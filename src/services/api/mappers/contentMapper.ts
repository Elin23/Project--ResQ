import type { PublicContent } from "@/src/domain";
import type { ArticleDto, SuccessStoryDto } from "@/src/contracts/backend/content";

function paragraphs(content: string) {
  return content.split(/\n{2,}/g).map((item) => item.trim()).filter(Boolean);
}

export function articleDtoToPublicContent(dto: ArticleDto): PublicContent {
  return {
    id: dto.id,
    kind: "article",
    title: dto.title,
    slug: dto.slug,
    excerpt: dto.excerpt,
    content: dto.content,
    body: paragraphs(dto.content),
    coverImageUrl: dto.coverImageUrl ?? "",
    category: dto.category,
    tags: dto.tags,
    publishedAt: dto.publishedAt ?? dto.updatedAt,
    readingMinutes: Math.max(1, Math.ceil(dto.content.split(/\s+/).length / 220)),
    authorName: dto.author.name,
  };
}

export function successStoryDtoToPublicContent(dto: SuccessStoryDto): PublicContent {
  return {
    id: dto.id,
    kind: "success-story",
    title: dto.title,
    slug: dto.slug,
    excerpt: dto.summary,
    content: dto.content,
    body: paragraphs(dto.content),
    coverImageUrl: dto.coverImageUrl ?? "",
    category: "SUCCESS_STORY",
    publishedAt: dto.publishedAt ?? dto.updatedAt,
    readingMinutes: Math.max(1, Math.ceil(dto.content.split(/\s+/).length / 220)),
    authorName: dto.author.name,
  };
}
