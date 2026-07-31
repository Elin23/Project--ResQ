// import { AdoptionPost, FeedingPoint, Report } from "../types";

// const HOUR = 60 * 60 * 1000;
// const DAY = 24 * HOUR;

// export const mockReports: Report[] = [
//   {
//     id: "1",
//     description: "كلب بلدي",
//     subtitle: "مصاب في قدمه",
//     imageUrl: "https://placekitten.com/300/200",
//     locationName: "حلب",
//     latitude: 33.5138,
//     longitude: 36.2765,
//     status: "approved",
//     createdAt: new Date(Date.now() - 2 * HOUR).toISOString(),
//     userId: "u1",
//   },
//   {
//     id: "2",
//     description: "قط شيرازي",
//     subtitle: "مفقودة في حي الحمدانية",
//     imageUrl: "https://placekitten.com/301/200",
//     locationName: "حلب",
//     latitude: 33.5102,
//     longitude: 36.2913,
//     status: "pending",
//     createdAt: new Date(Date.now() - 5 * HOUR).toISOString(),
//     userId: "u1",
//   },
//   {
//     id: "3",
//     description: "جرو صغير",
//     subtitle: "بحاجة لمأوى",
//     imageUrl: "https://placekitten.com/302/200",
//     locationName: "دمشق",
//     latitude: 33.5201,
//     longitude: 36.282,
//     status: "closed",
//     createdAt: new Date(Date.now() - 1 * DAY).toISOString(),
//     userId: "u2",
//   },
// ];

// export const mockFeedingPoints: FeedingPoint[] = [
//   {
//     id: "f1",
//     name: "نقطة إطعام الحديقة",
//     latitude: 33.5155,
//     longitude: 36.29,
//     description: "أكل وماء يومياً الساعة 6 مساءً",
//     userId: "u1",
//   },
// ];

// export const mockAdoptionPosts: AdoptionPost[] = [
//   {
//     id: "a1",
//     animalName: "لولو",
//     animalType: "قطة",
//     description: "قطة شيرازية عمرها سنة، ملقحة وهادية",
//     imageUrl: "https://placekitten.com/303/200",
//     userId: "u2",
//     createdAt: "2026-07-12T11:00:00",
//   },
// ];



import { AdoptionPost, FeedingPoint, Report } from "../types";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const mockReports: Report[] = [
  {
    id: "1",
    description: "كلب بلدي",
    subtitle: "مصاب في قدمه",
    imageUrl: "https://picsum.photos/seed/report1/300/200",
    locationName: "حلب",
    latitude: 36.2021,
    longitude: 37.1343,
    status: "approved",
    createdAt: new Date(Date.now() - 2 * HOUR).toISOString(),
    userId: "u1",
  },
  {
    id: "2",
    description: "قط شيرازي",
    subtitle: "مفقودة في حي الحمدانية",
    imageUrl: "https://picsum.photos/seed/report2/300/200",
    locationName: "حلب",
    latitude: 36.178,
    longitude: 37.105,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * HOUR).toISOString(),
    userId: "u1",
  },
  {
    id: "3",
    description: "جرو صغير",
    subtitle: "بحاجة لمأوى",
    imageUrl: "https://picsum.photos/seed/report3/300/200",
    locationName: "دمشق",
    latitude: 33.5201,
    longitude: 36.282,
    status: "closed",
    createdAt: new Date(Date.now() - 1 * DAY).toISOString(),
    userId: "u2",
  },
];

export const mockFeedingPoints: FeedingPoint[] = [
  {
    id: "f1",
    name: "نقطة إطعام الحديقة",
    latitude: 33.5155,
    longitude: 36.29,
    description: "أكل وماء يومياً الساعة 6 مساءً",
    userId: "u1",
  },
];

export const mockAdoptionPosts: AdoptionPost[] = [
  {
    id: "a1",
    animalName: "لولو",
    animalType: "قطة",
    description: "قطة شيرازية عمرها سنة، ملقحة وهادية",
    imageUrl: "https://picsum.photos/seed/adopt1/300/200",
    userId: "u2",
    createdAt: "2026-07-12T11:00:00Z",
  },
];