import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Helper: Generate reference number SRV-YYYY-XXXXX
// ---------------------------------------------------------------------------
function generateReferenceNumber(): string {
  const year = new Date().getFullYear() + 543; // Buddhist year
  const random = Math.floor(10000 + Math.random() * 90000); // 5-digit
  return `SRV-${year}-${random}`;
}

// ---------------------------------------------------------------------------
// Helper: Validate citizen token (simplified - placeholder)
// ---------------------------------------------------------------------------
async function validateCitizenToken(
  request: NextRequest
): Promise<{ valid: boolean; citizenId?: string }> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return { valid: false };
  }

  // In production, verify JWT and look up citizen
  // For now, we trust the token and extract citizenId from the request body
  return { valid: true, citizenId: undefined };
}

// ---------------------------------------------------------------------------
// In-memory store (replace with DB in production)
// ---------------------------------------------------------------------------
interface ServiceRequest {
  id: string;
  referenceNumber: string;
  serviceType: string;
  citizenId: string | null;
  formData: Record<string, string>;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

const serviceRequests: ServiceRequest[] = [];

// ---------------------------------------------------------------------------
// POST - Submit a new service request
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceType, formData, citizenId } = body;

    // Validate service type
    const validServices = [
      'tax-payment',
      'building-permit',
      'civil-registration',
      'information-request',
      'queue-booking',
      'report-issue',
    ];

    if (!serviceType || !validServices.includes(serviceType)) {
      return NextResponse.json(
        { error: 'ประเภทบริการไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // Validate required form data
    if (!formData || typeof formData !== 'object') {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Services that require authentication (all except report-issue)
    const authRequiredServices = [
      'tax-payment',
      'building-permit',
      'civil-registration',
      'information-request',
      'queue-booking',
    ];

    let resolvedCitizenId = citizenId || null;

    if (authRequiredServices.includes(serviceType)) {
      const auth = await validateCitizenToken(request);
      if (!auth.valid) {
        return NextResponse.json(
          { error: 'กรุณาเข้าสู่ระบบก่อนใช้บริการ' },
          { status: 401 }
        );
      }
      // Prefer citizenId from verified token over body
      resolvedCitizenId = auth.citizenId || citizenId || null;
    }

    // Validate specific fields per service type
    const errors: string[] = [];

    if (!formData.name?.trim()) {
      errors.push('กรุณาระบุชื่อ-นามสกุล');
    }
    if (!formData.phone?.trim()) {
      errors.push('กรุณาระบุเบอร์โทรศัพท์');
    }

    switch (serviceType) {
      case 'tax-payment':
        if (!formData.taxType) errors.push('กรุณาเลือกประเภทภาษี');
        if (!formData.propertyAddress?.trim()) errors.push('กรุณาระบุที่อยู่ทรัพย์สิน');
        if (!formData.paymentMethod) errors.push('กรุณาเลือกวิธีชำระเงิน');
        break;
      case 'building-permit':
        if (!formData.propertyAddress?.trim()) errors.push('กรุณาระบุที่อยู่ที่ดิน');
        if (!formData.buildingType) errors.push('กรุณาเลือกประเภทอาคาร');
        if (!formData.area?.trim()) errors.push('กรุณาระบุพื้นที่');
        break;
      case 'queue-booking':
        if (!formData.department) errors.push('กรุณาเลือกแผนก');
        if (!formData.date) errors.push('กรุณาเลือกวันที่');
        if (!formData.timeSlot) errors.push('กรุณาเลือกช่วงเวลา');
        if (!formData.purpose?.trim()) errors.push('กรุณาระบุเรื่องที่ต้องการติดต่อ');
        break;
      case 'report-issue':
        if (!formData.issueType) errors.push('กรุณาเลือกประเภทปัญหา');
        if (!formData.location?.trim()) errors.push('กรุณาระบุสถานที่');
        if (!formData.description?.trim()) errors.push('กรุณาอธิบายรายละเอียดปัญหา');
        break;
      case 'information-request':
        if (!formData.requestDetail?.trim()) errors.push('กรุณาระบุข้อมูลที่ต้องการ');
        if (!formData.purpose?.trim()) errors.push('กรุณาระบุวัตถุประสงค์');
        break;
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Generate reference number and create request
    const referenceNumber = generateReferenceNumber();
    const now = new Date().toISOString();

    const serviceRequest: ServiceRequest = {
      id: `sr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      referenceNumber,
      serviceType,
      citizenId: resolvedCitizenId,
      formData,
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now,
    };

    // Store in memory (replace with prisma in production)
    serviceRequests.push(serviceRequest);

    // In production: also create a CitizenActivity record if citizenId exists
    // await prisma.citizenActivity.create({ ... })

    return NextResponse.json(
      {
        id: serviceRequest.id,
        referenceNumber,
        status: serviceRequest.status,
        message: 'ส่งคำขอเรียบร้อยแล้ว',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/e-service error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการส่งคำขอ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET - List citizen's service requests
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const auth = await validateCitizenToken(request);
    const { searchParams } = new URL(request.url);
    const citizenId = searchParams.get('citizenId');

    if (!auth.valid && !citizenId) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const targetCitizenId = auth.citizenId || citizenId;

    // Filter requests by citizen ID
    const requests = serviceRequests
      .filter((r) => r.citizenId === targetCitizenId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      requests,
      total: requests.length,
    });
  } catch (error) {
    console.error('GET /api/e-service error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
