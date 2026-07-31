import type { QuickAction } from "@/src/components/ui/QuickActionGrid";

export const NEARBY_REPORTS = [
  { id: "nearby-report-1", title: "كلب صغير", location: "دمشق، المزة", time: "منذ 30 دقيقة", distance: "1.2 كم", imageUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=80", urgent: true },
  { id: "nearby-report-2", title: "قطة صغيرة", location: "دمشق، الشعلان", time: "منذ ساعة واحدة", imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80", urgent: false },
] as const;

export const ADOPTION_ANIMALS = [
  { id: "adoption-animal-1", name: "ليلو", details: "قطة شيرازي • سنة واحدة", imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80" },
  { id: "adoption-animal-2", name: "روكي", details: "كلب ودود • سنتان", imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80" },
] as const;

export const COMMUNITY_STATS = [
  { key: "rescued", value: 248, label: "تم إنقاذه" },
  { key: "active", value: 63, label: "بلاغ نشط" },
  { key: "volunteers", value: 91, label: "متطوع" },
] as const;

export type HomeQuickAction = QuickAction;
