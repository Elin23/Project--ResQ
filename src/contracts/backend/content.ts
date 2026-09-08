import type { BackendId, MediaDto } from "./common";

export type ContentStatus = "DRAFT" | "IN_REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type ArticleCategory = "ANIMAL_CARE" | "HEALTH" | "NUTRITION" | "BEHAVIOR" | "SAFETY" | "ADOPTION" | "OTHER";

export interface ContentAuthorDto {
  id: BackendId;
  name: string;
}

export interface ArticleDto {
  id: BackendId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  coverAltText?: string;
  category: ArticleCategory;
  tags: string[];
  status: ContentStatus;
  author: ContentAuthorDto;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuccessStoryDto {
  id: BackendId;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl?: string;
  coverAltText?: string;
  gallery?: MediaDto[];
  reportId?: BackendId;
  organizationId?: BackendId;
  status: ContentStatus;
  author: ContentAuthorDto;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqItemDto {
  id: BackendId;
  question: string;
  answer: string;
  category: string;
  order: number;
}
