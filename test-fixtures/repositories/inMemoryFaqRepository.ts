import type { FaqItem, FaqRepository } from "@/src/domain/content/faq";
import { FAQS } from "@/src/features/public/constants/helpCenter";

export class InMemoryFaqRepository implements FaqRepository {
  async list(): Promise<FaqItem[]> {
    return FAQS.map((item, index) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      category: "GENERAL",
      order: index,
    }));
  }
}
