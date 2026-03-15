import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface SearchResult {
  type: "news" | "page" | "document";
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  category?: string;
}

// ---------------------------------------------------------------------------
// GET - Full-text search across news, pages, documents
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const tenantId = searchParams.get("tenantId");
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "กรุณาระบุคำค้นหาอย่างน้อย 2 ตัวอักษร" },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
    }

    const searchTerm = query.trim();

    // Search across all content types in parallel
    const [newsResults, pageResults, documentResults] = await Promise.all([
      // Search news
      prisma.news.findMany({
        where: {
          tenantId,
          isPublished: true,
          OR: [
            { title: { contains: searchTerm } },
            { content: { contains: searchTerm } },
            { excerpt: { contains: searchTerm } },
            { tags: { contains: searchTerm } },
          ],
        },
        take: limit,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
          category: true,
          publishedAt: true,
          createdAt: true,
        },
      }),

      // Search pages
      prisma.page.findMany({
        where: {
          tenantId,
          isPublished: true,
          OR: [
            { title: { contains: searchTerm } },
            { content: { contains: searchTerm } },
          ],
        },
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          updatedAt: true,
        },
      }),

      // Search documents
      prisma.document.findMany({
        where: {
          tenantId,
          isPublished: true,
          OR: [
            { title: { contains: searchTerm } },
            { category: { contains: searchTerm } },
          ],
        },
        take: limit,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          category: true,
          fileUrl: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
    ]);

    // Format results
    const news: SearchResult[] = newsResults.map((item) => ({
      type: "news",
      id: item.id,
      title: item.title,
      excerpt: item.excerpt || "",
      url: `/news/${item.slug}`,
      date: (item.publishedAt || item.createdAt).toISOString(),
      category: item.category,
    }));

    const pages: SearchResult[] = pageResults.map((item) => ({
      type: "page",
      id: item.id,
      title: item.title,
      excerpt: item.content.substring(0, 150).replace(/<[^>]*>/g, "") + "...",
      url: `/${item.slug}`,
      date: item.updatedAt.toISOString(),
    }));

    const documents: SearchResult[] = documentResults.map((item) => ({
      type: "document",
      id: item.id,
      title: item.title,
      excerpt: `หมวดหมู่: ${item.category}`,
      url: item.fileUrl,
      date: (item.publishedAt || item.createdAt).toISOString(),
      category: item.category,
    }));

    return NextResponse.json({
      query: searchTerm,
      totalResults: news.length + pages.length + documents.length,
      results: {
        news,
        pages,
        documents,
      },
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการค้นหา" }, { status: 500 });
  }
}
