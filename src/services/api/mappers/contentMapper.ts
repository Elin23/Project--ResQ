import { resolveMediaUrl } from "../mediaUrl";
import type { PublicContent } from "@/src/domain";
import type { ArticleDto, SuccessStoryDto } from "@/src/contracts/backend/content";
const paragraphs=(content:string)=>content.split(/\n{2,}/g).map(x=>x.trim()).filter(Boolean);
const reading=(content:string)=>Math.max(1,Math.ceil(content.trim().split(/\s+/).filter(Boolean).length/220));
export function articleDtoToPublicContent(dto:ArticleDto):PublicContent { const content=dto.content ?? ""; return { id:String(dto.id),kind:"article",title:dto.title ?? "مقال",slug:dto.slug ?? undefined,excerpt:dto.excerpt ?? "",content,body:paragraphs(content),coverImageUrl:resolveMediaUrl(dto.coverImageUrl),category:dto.category ?? "OTHER",tags:dto.tags ?? [],publishedAt:dto.publishedAt ?? dto.updatedAt ?? dto.createdAt,readingMinutes:reading(content) }; }
export function successStoryDtoToPublicContent(dto:SuccessStoryDto):PublicContent { const content=dto.content ?? ""; return { id:String(dto.id),kind:"success-story",title:dto.title ?? "قصة نجاح",slug:dto.slug ?? undefined,excerpt:dto.summary ?? "",content,body:paragraphs(content),coverImageUrl:resolveMediaUrl(dto.coverImageUrl),category:"SUCCESS_STORY",publishedAt:dto.publishedAt ?? dto.updatedAt ?? dto.createdAt,readingMinutes:reading(content) }; }
