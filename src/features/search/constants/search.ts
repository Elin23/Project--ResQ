import { COLORS } from "@/src/theme";
import type { SearchResult } from "@/src/types/search";

export const SEARCH_RESULTS: SearchResult[] = [
  { id: "lost-cat-1", type: "animal", category: "lost", title: "قطة مفقودة", subtitle: "منطقة الميدان", distance: "1.2 كم", image: { uri: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80" }, badge: { label: "بلاغ جديد", backgroundColor: COLORS.primary, textColor: COLORS.white } },
  { id: "adoption-dog-1", type: "animal", category: "adoption", title: "جرو للتبني", subtitle: "ذكي ولطيف", distance: "3.5 كم", image: { uri: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80" }, badge: { label: "متاح للتبني", backgroundColor: "#A5F3B4", textColor: "#14752E" } },
  { id: "clinic-1", type: "clinic", title: "عيادة الأمل البيطرية", subtitle: "حي الحمدانية", distance: "5.0 كم", services: "جراحة، تطعيمات", status: { label: "مفتوح", backgroundColor: "#D8F3FF", textColor: "#1687B1" } },
];
