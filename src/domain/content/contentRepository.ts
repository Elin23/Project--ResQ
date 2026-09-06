import type { PublicContent, PublicContentKind } from "./content";

export interface PublicContentRepository {
  list(kind: PublicContentKind): Promise<PublicContent[]>;
  getById(kind: PublicContentKind, id: string): Promise<PublicContent | null>;
}
