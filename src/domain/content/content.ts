export type PublicContentKind = "article" | "success-story";

export type PublicContent = {
  id: string;
  kind: PublicContentKind;
  title: string;
  excerpt: string;
  body: string[];
  coverImageUrl: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  authorName?: string;
  featured?: boolean;
};
