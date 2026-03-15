import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface MenuItemInput {
  id?: string;
  label: string;
  labelEn?: string;
  url: string;
  icon?: string;
  parentId?: string | null;
  order: number;
  isVisible?: boolean;
  target?: string;
  children?: MenuItemInput[];
}

// ---------------------------------------------------------------------------
// GET - Get menu tree
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
    }

    const menuItems = await prisma.menuItem.findMany({
      where: { tenantId, parentId: null },
      orderBy: { order: "asc" },
      include: {
        children: {
          orderBy: { order: "asc" },
          include: {
            children: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("GET /api/menu error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงเมนู" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST - Save entire menu structure (replace all)
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role!)) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์จัดการเมนู" }, { status: 403 });
    }

    const body: { items: MenuItemInput[] } = await request.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "กรุณาส่งข้อมูลเมนูที่ถูกต้อง" }, { status: 400 });
    }

    const tenantId = session.user.tenantId!;

    // Delete existing menu items for this tenant and recreate
    await prisma.menuItem.deleteMany({ where: { tenantId } });

    // Recursively create menu items
    async function createMenuItems(items: MenuItemInput[], parentId: string | null = null) {
      for (const item of items) {
        const created = await prisma.menuItem.create({
          data: {
            tenantId,
            label: item.label,
            labelEn: item.labelEn,
            url: item.url,
            icon: item.icon,
            parentId,
            order: item.order,
            isVisible: item.isVisible ?? true,
            target: item.target || "_self",
          },
        });

        if (item.children && item.children.length > 0) {
          await createMenuItems(item.children, created.id);
        }
      }
    }

    await createMenuItems(body.items);

    // Return the new menu tree
    const menuItems = await prisma.menuItem.findMany({
      where: { tenantId, parentId: null },
      orderBy: { order: "asc" },
      include: {
        children: {
          orderBy: { order: "asc" },
          include: {
            children: { orderBy: { order: "asc" } },
          },
        },
      },
    });

    return NextResponse.json(menuItems, { status: 201 });
  } catch (error) {
    console.error("POST /api/menu error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกเมนู" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PUT - Update a single menu item
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role!)) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์จัดการเมนู" }, { status: 403 });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "กรุณาระบุ id ของเมนูที่ต้องการแก้ไข" }, { status: 400 });
    }

    const existing = await prisma.menuItem.findUnique({ where: { id: body.id } });

    if (!existing) {
      return NextResponse.json({ error: "ไม่พบเมนูที่ต้องการแก้ไข" }, { status: 404 });
    }

    if (existing.tenantId !== session.user.tenantId! && session.user.role! !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไขเมนูนี้" }, { status: 403 });
    }

    const updated = await prisma.menuItem.update({
      where: { id: body.id },
      data: {
        label: body.label,
        labelEn: body.labelEn,
        url: body.url,
        icon: body.icon,
        parentId: body.parentId,
        order: body.order,
        isVisible: body.isVisible,
        target: body.target,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/menu error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการแก้ไขเมนู" }, { status: 500 });
  }
}
