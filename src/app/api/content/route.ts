import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContentCreateBody {
  type: "news" | "page";
  title: string;
  titleEn?: string;
  slug: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  excerptEn?: string;
  category?: string;
  featuredImage?: string;
  isPublished?: boolean;
  isPinned?: boolean;
  tags?: string;
  template?: string;
  metaTitle?: string;
  metaDescription?: string;
}

// ---------------------------------------------------------------------------
// GET - List content with pagination and filters
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") || "news"; // "news" | "page"
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // "published" | "draft"
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search");
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    if (type === "news") {
      const where: Record<string, unknown> = { tenantId };

      if (category) {
        where.category = category;
      }
      if (status === "published") {
        where.isPublished = true;
      } else if (status === "draft") {
        where.isPublished = false;
      }
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { content: { contains: search } },
        ];
      }

      const [items, total] = await Promise.all([
        prisma.news.findMany({
          where,
          skip,
          take: limit,
          orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
          include: { author: { select: { id: true, name: true, avatar: true } } },
        }),
        prisma.news.count({ where }),
      ]);

      return NextResponse.json({
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // type === "page"
    const where: Record<string, unknown> = { tenantId };

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { author: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.page.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST - Create new content
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const body: ContentCreateBody = await request.json();

    // Validate required fields
    if (!body.type || !body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็น: type, title, slug, content" },
        { status: 400 }
      );
    }

    const tenantId = session.user.tenantId!;
    const authorId = session.user.id!;

    if (body.type === "news") {
      const existing = await prisma.news.findUnique({
        where: { tenantId_slug: { tenantId, slug: body.slug } },
      });

      if (existing) {
        return NextResponse.json({ error: "Slug นี้ถูกใช้งานแล้ว" }, { status: 409 });
      }

      const news = await prisma.news.create({
        data: {
          tenantId,
          authorId,
          title: body.title,
          titleEn: body.titleEn,
          slug: body.slug,
          excerpt: body.excerpt,
          excerptEn: body.excerptEn,
          content: body.content,
          contentEn: body.contentEn,
          featuredImage: body.featuredImage,
          category: (body.category as "NEWS" | "ANNOUNCEMENT" | "PR") || "NEWS",
          isPinned: body.isPinned ?? false,
          isPublished: body.isPublished ?? false,
          publishedAt: body.isPublished ? new Date() : null,
          tags: body.tags,
        },
        include: { author: { select: { id: true, name: true } } },
      });

      return NextResponse.json(news, { status: 201 });
    }

    // type === "page"
    const existing = await prisma.page.findUnique({
      where: { tenantId_slug: { tenantId, slug: body.slug } },
    });

    if (existing) {
      return NextResponse.json({ error: "Slug นี้ถูกใช้งานแล้ว" }, { status: 409 });
    }

    const page = await prisma.page.create({
      data: {
        tenantId,
        authorId,
        title: body.title,
        titleEn: body.titleEn,
        slug: body.slug,
        content: body.content,
        contentEn: body.contentEn,
        template: body.template || "default",
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        featuredImage: body.featuredImage,
        isPublished: body.isPublished ?? false,
        publishedAt: body.isPublished ? new Date() : null,
      },
      include: { author: { select: { id: true, name: true } } },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("POST /api/content error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างเนื้อหา" }, { status: 500 });
  }
}
