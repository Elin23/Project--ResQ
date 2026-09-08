export type PublicContentKind = "article" | "success-story";

export type PublicContent = {
  id: string;
  kind: PublicContentKind;
  title: string;
  slug?: string;
  excerpt: string;
  /** Backend canonical rich/plain content. */
  content?: string;
  /** Existing screen compatibility paragraphs derived from content. */
  body: string[];
  coverImageUrl: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  readingMinutes: number;
  authorName?: string;
  featured?: boolean;
};
