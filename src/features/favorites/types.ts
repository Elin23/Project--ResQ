/** أنواع العناصر اللي بيقدر المستخدم يضيفها للمفضلة */
export type FavoriteKind =
  | "feeding-point"
  | "campaign"
  | "organization"
  | "adoption";

export interface FavoriteItem {
  kind: FavoriteKind;
  id: string;
  /** الاسم المعروض — منخزنه لنقدر نعرض لستة المفضلة بدون ما نجيب التفاصيل من جديد */
  title: string;
  savedAt: string; // ISO 8601
}

export type ToggleFavoriteInput = Omit<FavoriteItem, "savedAt">;
