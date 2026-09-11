export type FeedingPointStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
export type FeedingPointCondition = "GOOD"|"NEEDS_CLEANING"|"DAMAGED"|"MISSING"|"UNKNOWN";
export type FeedingPointFoodLevel = "FULL"|"MEDIUM"|"LOW"|"EMPTY"|"UNKNOWN";
export type FeedingPointIssueType = "EMPTY"|"NO_WATER"|"DAMAGED"|"DIRTY"|"MISSING"|"UNSAFE_LOCATION"|"OTHER";
export interface FeedingPointMediaDto { id:number; type?:string|null; url?:string|null; thumbnailUrl?:string|null; }
export interface FeedingPointDto { id:number; code?:string|null; name?:string|null; address?:string|null; governorateId:number; governorateName?:string|null; regionId:number; regionName?:string|null; latitude:number; longitude:number; note?:string|null; status?:string|null; condition?:string|null; foodLevel?:string|null; waterAvailable:boolean; lastVerifiedRefillAt?:string|null; rejectionReason?:string|null; media?:FeedingPointMediaDto[]|null; createdAt:string; updatedAt:string; }
export type RefillReviewStatus = "PENDING"|"VERIFIED"|"REJECTED";
export type FeedingPointIssueStatus = "OPEN"|"UNDER_REVIEW"|"RESOLVED"|"REJECTED";
