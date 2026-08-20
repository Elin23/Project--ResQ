export type { Report, ReportStatus } from "@/src/domain";


export interface FeedingPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  userId: string;
}

export interface AdoptionPost {
  id: string;
  animalName: string;
  animalType: string;
  description: string;
  imageUrl: string;
  userId: string;
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}
