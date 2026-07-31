import type { ImageSourcePropType } from "react-native";
import { IMAGES } from "@/src/assets/images";

export type OnboardingItem = {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
};

export const ACTIVE_INDICATOR_COLOR = "#B25A08";
export const INACTIVE_INDICATOR_COLOR = "#E7C8BB";

export const ONBOARDING_ITEMS: OnboardingItem[] = [
  {
    id: "journey",
    image: IMAGES.onboarding.journey,
    title: "ابدأ رحلتك مع ResQ",
    description:
      "سجّل الآن وساهم في إنقاذ الحيوانات ومتابعة البلاغات والمشاركة في المجتمع.",
  },
  {
    id: "community",
    image: IMAGES.onboarding.community,
    title: "ساهم في انتشار خدماتنا",
    description:
      "تعاون المتطوعين والجمعيات والعيادات يجعل الاستجابة أسرع وأكثر فاعلية.",
  },
  {
    id: "rescue",
    image: IMAGES.onboarding.rescue,
    title: "أنقذ حياة... ببلاغ واحد",
    description: "قد يكون بلاغك سببًا في إنقاذ حيوان يحتاج للمساعدة.",
  },
];
