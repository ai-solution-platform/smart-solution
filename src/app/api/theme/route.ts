import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  logo?: string;
  favicon?: string;
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  fax?: string;
  socialFacebook?: string;
  socialLine?: string;
  socialYoutube?: string;
  socialTiktok?: string;
  // SiteConfig key-value pairs
  configs?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// GET - Get tenant theme settings
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const tenantSlug = searchParams.get("slug");

    if (!tenantId && !tenantSlug) {
      return NextResponse.json({ error: "tenantId or slug is required" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findFirst({
      where: tenantId ? { id: tenantId } : { slug: tenantSlug! },
      include: {
        siteConfigs: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "ไม่พบข้อมูลหน่วยงาน" }, { status: 404 });
    }

    // Transform siteConfigs into a grouped object
    const configs: Record<string, Record<string, string>> = {};
    for (const config of tenant.siteConfigs) {
      if (!configs[config.group]) {
        configs[config.group] = {};
      }
      configs[config.group][config.key] = config.value;
    }

    return NextResponse.json({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      domain: tenant.domain,
      logo: tenant.logo,
      favicon: tenant.favicon,
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      accentColor: tenant.accentColor,
      fontFamily: tenant.fontFamily,
      description: tenant.description,
      address: tenant.address,
      phone: tenant.phone,
      email: tenant.email,
      fax: tenant.fax,
      socialFacebook: tenant.socialFacebook,
      socialLine: tenant.socialLine,
      socialYoutube: tenant.socialYoutube,
      socialTiktok: tenant.socialTiktok,
      configs,
    });
  } catch (error) {
    console.error("GET /api/theme error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลธีม" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PUT - Update theme settings
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role!)) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไขธีม" }, { status: 403 });
    }

    const tenantId = session.user.tenantId!;
    const body: ThemeSettings = await request.json();

    // Update tenant fields
    const tenantData: Record<string, unknown> = {};
    const allowedFields = [
      "primaryColor",
      "secondaryColor",
      "accentColor",
      "fontFamily",
      "logo",
      "favicon",
      "name",
      "description",
      "address",
      "phone",
      "email",
      "fax",
      "socialFacebook",
      "socialLine",
      "socialYoutube",
      "socialTiktok",
    ] as const;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        tenantData[field] = body[field];
      }
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: tenantData,
    });

    // Update site configs if provided
    if (body.configs) {
      for (const [key, value] of Object.entries(body.configs)) {
        await prisma.siteConfig.upsert({
          where: { tenantId_key: { tenantId, key } },
          update: { value },
          create: { tenantId, key, value, group: "theme" },
        });
      }
    }

    return NextResponse.json(updatedTenant);
  } catch (error) {
    console.error("PUT /api/theme error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตธีม" }, { status: 500 });
  }
}
