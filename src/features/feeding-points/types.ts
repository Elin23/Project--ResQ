// ────────────── الحالات ──────────────

/** شو بيقدر المستخدم يبلّغ عنه — هاد اللي بينحفظ بالداتابيز */
export type ReportedStatus = 'stocked' | 'needsFood';

/** شو بيتعرض عالشاشة — بيزيد حالة محسوبة مو مخزّنة */
export type DisplayStatus = ReportedStatus | 'unknown';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ReviewState = 'pending' | 'verified' | 'rejected';

/** مرافق النقطة — تُعرض كوسوم صغيرة بشاشة التفاصيل */
export type FacilityKey = 'water' | 'shade';

/** مستوى الطعام المتوفر بالنقطة — مستقل عن ReportedStatus (حالة مُبلّغ عنها من مستخدم) */
export type FoodLevel = 'good' | 'medium' | 'empty';

/**
 * سبب البلاغ عن مشكلة — بلاغ منفصل تماماً عن ReportedStatus.
 * تحديث الحالة (ReportedStatus) بيقول "شو وضع الأكل هلق"،
 * أما هاد بيقول "في مشكلة بالنقطة نفسها" (وعاء، مي، حيوان...).
 */
export type FeedingPointIssueReason =
  | 'brokenContainer'
  | 'contaminatedWater'
  | 'injuredAnimal'
  | 'pointMissing'
  | 'other';

// ────────────── الكيانات ──────────────

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** الشكل الخفيف — هاد اللي بيرجع لاستعلام الخريطة واللستة */
export interface FeedingPointSummary {
  id: string;
  name: string;
  address: string;
  coordinate: GeoPoint;
  status: ReportedStatus;
  lastStatusUpdateAt: string;      // ISO 8601
  thumbnailUrl: string | null;
  distanceInMeters?: number;       // بيجي بس إذا بعتنا موقع المستخدم
  /** موثّقة من الإدارة — تُعرض كشارة "متحقق" فوق البطاقة */
  isVerified: boolean;
  hasWater: boolean;
  foodLevel: FoodLevel;
}

/** الشكل الكامل — بيرجع بس لما تفتح شاشة التفاصيل */
export interface FeedingPointDetails extends FeedingPointSummary {
  photoUrl: string | null;
  description: string | null;
  approvalStatus: ApprovalStatus;
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
  updatesCount: number;
  /** تقييم من 5 — بيجي لاحقاً من نظام تقييمات، اختياري لحد ما يجهز */
  rating?: number;
  ratingsCount?: number;
  facilities?: FacilityKey[];
}

/** سجل واحد من "تاريخ النشاط" */
export interface StatusUpdate {
  id: string;
  feedingPointId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  reportedStatus: ReportedStatus;
  photoUrl: string;                 // إجبارية
  note: string | null;
  createdAt: string;
  reviewState: ReviewState;
}

/** بلاغ مشكلة بنقطة — منفصل عن StatusUpdate، ما إله علاقة بحالة الأكل */
export interface FeedingPointIssue {
  id: string;
  feedingPointId: string;
  userId: string;
  userName: string;
  reason: FeedingPointIssueReason;
  note: string | null;
  createdAt: string;
  reviewState: ReviewState;
}

// ────────────── المدخلات ──────────────

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface FeedingPointsQuery {
  bbox?: BoundingBox;
  status?: ReportedStatus;
  search?: string;
  near?: GeoPoint;
}

export interface CreateStatusUpdateInput {
  feedingPointId: string;
  reportedStatus: ReportedStatus;
  photoUri: string;                 // مسار محلي قبل الرفع
  note?: string;
}

export interface CreateFeedingPointInput {
  name: string;
  address: string;
  coordinate: GeoPoint;
  description?: string;
  photoUri: string;
}

export interface CreateFeedingPointIssueInput {
  feedingPointId: string;
  reason: FeedingPointIssueReason;
  note?: string;
}