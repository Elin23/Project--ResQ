import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type { FavoriteItem, FavoriteKind, ToggleFavoriteInput } from "./types";

type FavoritesContextValue = {
  items: FavoriteItem[];
  /** يصير true بعد ما تنقرأ المفضلة من التخزين — لتفادي وميض الأيقونة */
  isReady: boolean;
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  /** بيرجّع الحالة الجديدة: true يعني انضاف، false يعني انشال */
  toggleFavorite: (input: ToggleFavoriteInput) => boolean;
  removeFavorite: (kind: FavoriteKind, id: string) => void;
  /** بيفضّي المفضلة كلها من الذاكرة والتخزين — بينستخدم عند حذف الحساب */
  clearFavorites: () => void;
};

const STORAGE_KEY = "resq.favorites.v1";
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const FAVORITE_KINDS: FavoriteKind[] = ["feeding-point", "campaign", "organization", "adoption"];

function parseStoredFavorites(raw: string | null): FavoriteItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is FavoriteItem => {
      if (!entry || typeof entry !== "object") return false;
      const candidate = entry as Partial<FavoriteItem>;
      return (
        typeof candidate.id === "string"
        && typeof candidate.title === "string"
        && typeof candidate.savedAt === "string"
        && FAVORITE_KINDS.includes(candidate.kind as FavoriteKind)
      );
    });
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted) setItems(parseStoredFavorites(stored));
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setIsReady(true);
      }
    };

    void restore();
    return () => { mounted = false; };
  }, []);

  // الحفظ ما بيوقف الواجهة: الحالة بتتحدث فوراً والتخزين بيمشي بالخلفية.
  const persist = useCallback((next: FavoriteItem[]) => {
    setItems(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const isFavorite = useCallback(
    (kind: FavoriteKind, id: string) => items.some((item) => item.kind === kind && item.id === id),
    [items],
  );

  const toggleFavorite = useCallback((input: ToggleFavoriteInput) => {
    const exists = items.some((item) => item.kind === input.kind && item.id === input.id);
    persist(
      exists
        ? items.filter((item) => !(item.kind === input.kind && item.id === input.id))
        : [{ ...input, savedAt: new Date().toISOString() }, ...items],
    );
    return !exists;
  }, [items, persist]);

  const removeFavorite = useCallback((kind: FavoriteKind, id: string) => {
    persist(items.filter((item) => !(item.kind === kind && item.id === id)));
  }, [items, persist]);

  const clearFavorites = useCallback(() => {
    setItems([]);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ items, isReady, isFavorite, toggleFavorite, removeFavorite, clearFavorites }),
    [items, isReady, isFavorite, toggleFavorite, removeFavorite, clearFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites must be used within FavoritesProvider");
  return value;
}
