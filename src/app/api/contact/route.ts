import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ContactFormBody {
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
}

// ---------------------------------------------------------------------------
// POST - Save contact form submission
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormBody = await request.json();

    // Validate required fields
    const errors: string[] = [];

    if (!body.tenantId) {
      errors.push("tenantId is required");
    }
    if (!body.name || body.name.trim().length === 0) {
      errors.push("กรุณาระบุชื่อ-นามสกุล");
    }
    if (!body.subject || body.subject.trim().length === 0) {
      errors.push("กรุณาระบุหัวข้อเรื่อง");
    }
    if (!body.message || body.message.trim().length === 0) {
      errors.push("กรุณาระบุรายละเอียด");
    }
    if (!body.email && !body.phone) {
      errors.push("กรุณาระบุอีเมลหรือเบอร์โทรศัพท์อย่างน้อย 1 ช่องทาง");
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        errors.push("รูปแบบอีเมลไม่ถูกต้อง");
      }
    }

    // Validate phone format if provided (Thai phone numbers)
    if (body.phone) {
      const phoneRegex = /^(0[2-9]\d{7,8}|0[6-9]\d{8})$/;
      const cleaned = body.phone.replace(/[-\s]/g, "");
      if (!phoneRegex.test(cleaned)) {
        errors.push("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: body.tenantId },
      select: { id: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "ไม่พบข้อมูลหน่วยงาน" }, { status: 404 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        tenantId: body.tenantId,
        name: body.name.trim(),
        email: body.email?.trim() || null,
        phone: body.phone?.replace(/[-\s]/g, "") || null,
        subject: body.subject.trim(),
        message: body.message.trim(),
        status: "NEW",
      },
    });

    return NextResponse.json(
      {
        id: submission.id,
        message: "ส่งข้อความเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
