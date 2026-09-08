export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface FaqRepository {
  list(): Promise<FaqItem[]>;
}
