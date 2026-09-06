import { useCallback, useEffect, useState } from "react";
import type { PublicContent, PublicContentKind } from "@/src/domain/content/content";
import { repositories } from "@/src/services/domain/repositories";

export function usePublicContentList(kind: PublicContentKind) {
  const [items, setItems] = useState<PublicContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setItems(await repositories.publicContent.list(kind));
    } catch {
      setError("تعذر تحميل المحتوى الآن. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => { void load(); }, [load]);
  return { items, loading, error, reload: load };
}

export function usePublicContentDetails(kind: PublicContentKind, id?: string) {
  const [item, setItem] = useState<PublicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setItem(null);
      setError("المحتوى المطلوب غير متوفر.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setItem(await repositories.publicContent.getById(kind, id));
    } catch {
      setError("تعذر تحميل المحتوى الآن. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [id, kind]);

  useEffect(() => { void load(); }, [load]);
  return { item, loading, error, reload: load };
}
