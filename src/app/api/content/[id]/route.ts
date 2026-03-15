import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: { id: string };
}

// ---------------------------------------------------------------------------
// GET - Get single content by ID
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "news";

    if (type === "news") {
      const news = await prisma.news.findUnique({
        where: { id },
        include: { author: { select: { id: true, name: true, avatar: true } } },
      });

      if (!news) {
        return NextResponse.json({ error: "ไม่พบเนื้อหาที่ต้องการ" }, { status: 404 });
      }

      // Increment view count
      await prisma.news.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      return NextResponse.json(news);
    }

    // type === "page"
    const page = await prisma.page.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });

    if (!page) {
      return NextResponse.json({ error: "ไม่พบเนื้อหาที่ต้องการ" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("GET /api/content/[id] error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PUT - Update content
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const type = body.type || "news";

    if (type === "news") {
      const existing = await prisma.news.findUnique({ where: { id } });

      if (!existing) {
        return NextResponse.json({ error: "ไม่พบเนื้อหาที่ต้องการแก้ไข" }, { status: 404 });
      }

      // Check tenant access
      if (existing.tenantId !== session.user.tenantId! && session.user.role! !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไขเนื้อหานี้" }, { status: 403 });
      }

      const updated = await prisma.news.update({
        where: { id },
        data: {
          title: body.title,
          titleEn: body.titleEn,
          slug: body.slug,
          excerpt: body.excerpt,
          excerptEn: body.excerptEn,
          content: body.content,
          contentEn: body.contentEn,
          featuredImage: body.featuredImage,
          category: body.category,
          isPinned: body.isPinned,
          isPublished: body.isPublished,
          publishedAt: body.isPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
          tags: body.tags,
        },
        include: { author: { select: { id: true, name: true } } },
      });

      return NextResponse.json(updated);
    }

    // type === "page"
    const existing = await prisma.page.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "ไม่พบเนื้อหาที่ต้องการแก้ไข" }, { status: 404 });
    }

    if (existing.tenantId !== session.user.tenantId! && session.user.role! !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไขเนื้อหานี้" }, { status: 403 });
    }

    const updated = await prisma.page.update({
      where: { id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        slug: body.slug,
        content: body.content,
        contentEn: body.contentEn,
        template: body.template,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        featuredImage: body.featuredImage,
        isPublished: body.isPublished,
        publishedAt: body.isPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
      include: { author: { select: { id: true, name: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/content/[id] error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการแก้ไขเนื้อหา" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE - Delete content
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "news";

    if (type === "news") {
      const existing = await prisma.news.findUnique({ where: { id } });

      if (!existing) {
        return NextResponse.json({ error: "ไม่พบเนื้อหาที่ต้องการลบ" }, { status: 404 });
      }

      if (existing.tenantId !== session.user.tenantId! && session.user.role! !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "ไม่มีสิทธิ์ลบเนื้อหานี้" }, { status: 403 });
      }

      await prisma.news.delete({ where: { id } });

      return NextResponse.json({ message: "ลบเนื้อหาเรียบร้อยแล้ว" });
    }

    // type === "page"
    const existing = await prisma.page.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "ไม่พบเนื้อหาที่ต้องการลบ" }, { status: 404 });
    }

    if (existing.tenantId !== session.user.tenantId! && session.user.role! !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "ไม่มีสิทธิ์ลบเนื้อหานี้" }, { status: 403 });
    }

    await prisma.page.delete({ where: { id } });

    return NextResponse.json({ message: "ลบเนื้อหาเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("DELETE /api/content/[id] error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลบเนื้อหา" }, { status: 500 });
  }
}
