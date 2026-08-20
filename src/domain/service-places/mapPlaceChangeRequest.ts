import type { ServicePlaceType } from './servicePlace';

export type MapPlaceChangeRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type MapPlaceSensitiveChanges = {
  type?: Exclude<ServicePlaceType,'organization'>;
  address?: string;
  latitude?: number;
  longitude?: number;
  licenseNumber?: string;
  supportingDocumentUri?: string;
};

export type MapPlaceChangeRequest = {
  id:string;
  placeId:string;
  ownerUserId:string;
  changes:MapPlaceSensitiveChanges;
  status:MapPlaceChangeRequestStatus;
  reason:string;
  rejectionReason?:string;
  createdAt:string;
  updatedAt:string;
  reviewedAt?:string;
  reviewedBy?:string;
};
