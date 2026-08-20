import type {
  FeedingPointDetails,
  FeedingPointSummary,
  StatusUpdate,
} from '../features/feeding-points/types';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

/** هوية المستخدم الحالي بالنسخة التجريبية — رح تجي من الـ auth لما يجهز الباك إند */
export const MOCK_CURRENT_USER = { id: 'u-current', name: 'أنت' };

export const MOCK_POINTS: FeedingPointSummary[] = [
  {
    id: 'fp-001',
    name: 'نقطة إطعام حديقة تشرين',
    address: 'دمشق - المزة - حديقة تشرين، البوابة الشمالية',
    coordinate: { latitude: 33.5102, longitude: 36.2585 },
    status: 'needsFood',
    lastStatusUpdateAt: hoursAgo(3),
    thumbnailUrl: 'https://placehold.co/200x200/FF8C42/FFFFFF',
    distanceInMeters: 850,
    isVerified: false,
    hasWater: false,
    foodLevel: 'empty',
  },
  {
    id: 'fp-002',
    name: 'نقطة ساحة الأمويين',
    address: 'دمشق - ساحة الأمويين، خلف المسرح',
    coordinate: { latitude: 33.5138, longitude: 36.2765 },
    status: 'stocked',
    lastStatusUpdateAt: hoursAgo(10),
    thumbnailUrl: 'https://placehold.co/200x200/4CAF50/FFFFFF',
    distanceInMeters: 1600,
    isVerified: true,
    hasWater: true,
    foodLevel: 'good',
  },
  {
    id: 'fp-003',
    name: 'نقطة باب توما',
    address: 'دمشق القديمة - باب توما، قرب الكنيسة',
    coordinate: { latitude: 33.5121, longitude: 36.3151 },
    status: 'stocked',
    lastStatusUpdateAt: hoursAgo(72), // ← لازم تطلع "غير مؤكد"
    thumbnailUrl: 'https://placehold.co/200x200/2BB5F6/FFFFFF',
    distanceInMeters: 4300,
    isVerified: true,
    hasWater: true,
    foodLevel: 'medium',
  },
  {
    id: 'fp-004',
    name: 'نقطة جرمانا الدوار',
    address: 'ريف دمشق - جرمانا، الدوار الرئيسي',
    coordinate: { latitude: 33.4869, longitude: 36.3436 },
    status: 'needsFood',
    lastStatusUpdateAt: hoursAgo(47), // ← حالة حدّية، على حافة الـ 48
    thumbnailUrl: 'https://placehold.co/200x200/D32F2F/FFFFFF',
    distanceInMeters: 7200,
    isVerified: false,
    hasWater: false,
    foodLevel: 'medium',
  },
  {
    id: 'fp-005',
    name: 'نقطة حديقة السبكي',
    address: 'دمشق - شارع بغداد، حديقة السبكي',
    coordinate: { latitude: 33.5169, longitude: 36.2921 },
    status: 'stocked',
    lastStatusUpdateAt: hoursAgo(0.5),
    thumbnailUrl: 'https://placehold.co/200x200/9B4500/FFFFFF',
    distanceInMeters: 2100,
    isVerified: true,
    hasWater: true,
    foodLevel: 'good',
  },
];

export const MOCK_DETAILS: Record<string, FeedingPointDetails> = {
  'fp-001': {
    ...MOCK_POINTS[0],
    photoUrl: 'https://placehold.co/800x500/FF8C42/FFFFFF',
    description: 'صندوق خشبي تحت الشجرة الكبيرة، في مكان مخصص للمي كمان.',
    ownerAccountId: 'u-12',
    ownerAccountKind: 'user',
    moderationStatus: 'approved',
    submittedAt: hoursAgo(24 * 41),
    reviewedAt: hoursAgo(24 * 40),
    reviewedBy: 'admin-seed',
    createdByUserId: 'u-12',
    createdByName: 'رامي',
    createdAt: hoursAgo(24 * 40),
    updatesCount: 3,
    rating: 4.5,
    ratingsCount: 128,
    facilities: ['water', 'shade'],
  },
};

export const MOCK_UPDATES: Record<string, StatusUpdate[]> = {
  'fp-001': [
    {
      id: 'su-101',
      feedingPointId: 'fp-001',
      userId: 'u-45',
      userName: 'ليلى',
      userAvatarUrl: null,
      reportedStatus: 'needsFood',
      photoUrl: 'https://placehold.co/600x400',
      note: 'الصندوق فاضي تماماً',
      createdAt: hoursAgo(3),
      reviewState: 'pending',
    },
    {
      id: 'su-100',
      feedingPointId: 'fp-001',
      userId: 'u-12',
      userName: 'رامي',
      userAvatarUrl: null,
      reportedStatus: 'stocked',
      photoUrl: 'https://placehold.co/600x400',
      note: null,
      createdAt: hoursAgo(20),
      reviewState: 'verified',
    },
  ],
};
