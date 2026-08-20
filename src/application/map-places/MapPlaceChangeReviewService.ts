import type { MapPlaceChangeRequestRepository, ServicePlaceRepository } from '@/src/domain/service-places';
export class MapPlaceChangeReviewService {
  constructor(private readonly requests:MapPlaceChangeRequestRepository, private readonly places:ServicePlaceRepository){}
  async approve(requestId:string, reviewerId:string){
    const request=await this.requests.getForReview(requestId); if(!request) throw new Error('Change request not found');
    if(request.status!=='pending') throw new Error('Only pending change requests can be approved');
    const place=await this.places.getForModeration(request.placeId); if(!place) throw new Error('Service place not found');
    if(place.ownerUserId!==request.ownerUserId) throw new Error('Ownership mismatch');
    const updated=await this.places.applySensitiveChanges(place.id,request.changes);
    const reviewed=await this.requests.review(request.id,{decision:'approved',reviewerId});
    return {request:reviewed,place:updated};
  }
  async reject(requestId:string, reviewerId:string, rejectionReason:string){
    return this.requests.review(requestId,{decision:'rejected',reviewerId,rejectionReason});
  }
}
