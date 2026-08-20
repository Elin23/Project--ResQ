import type { MapPlaceChangeRequest, MapPlaceSensitiveChanges } from './mapPlaceChangeRequest';
export interface MapPlaceChangeRequestRepository {
  create(input:{placeId:string;ownerUserId:string;changes:MapPlaceSensitiveChanges;reason:string}):Promise<MapPlaceChangeRequest>;
  listForUser(userId:string):Promise<MapPlaceChangeRequest[]>;
  getOwned(id:string,userId:string):Promise<MapPlaceChangeRequest|null>;
  getForReview(id:string):Promise<MapPlaceChangeRequest|null>;
  review(id:string,input:{decision:'approved'|'rejected';reviewerId:string;rejectionReason?:string}):Promise<MapPlaceChangeRequest>;
  cancel(id:string,userId:string):Promise<MapPlaceChangeRequest>;
}
