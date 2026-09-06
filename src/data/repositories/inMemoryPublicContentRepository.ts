import type { PublicContent, PublicContentKind } from "@/src/domain/content/content";
import type { PublicContentRepository } from "@/src/domain/content/contentRepository";
import { PUBLIC_CONTENT_SEED } from "@/src/data/publicContent.seed";

export class InMemoryPublicContentRepository implements PublicContentRepository {
  private readonly items: PublicContent[] = PUBLIC_CONTENT_SEED.map((item) => ({ ...item, body: [...item.body] }));

  async list(kind: PublicContentKind): Promise<PublicContent[]> {
    return this.items
      .filter((item) => item.kind === kind)
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .map((item) => ({ ...item, body: [...item.body] }));
  }

  async getById(kind: PublicContentKind, id: string): Promise<PublicContent | null> {
    const item = this.items.find((candidate) => candidate.kind === kind && candidate.id === id);
    return item ? { ...item, body: [...item.body] } : null;
  }
}
