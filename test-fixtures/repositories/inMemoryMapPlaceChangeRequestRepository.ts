import type { MapPlaceChangeRequest, MapPlaceChangeRequestRepository } from '@/src/domain/service-places';
const clone=(x:MapPlaceChangeRequest):MapPlaceChangeRequest=>({...x,changes:{...x.changes}});
export class InMemoryMapPlaceChangeRequestRepository implements MapPlaceChangeRequestRepository {
  private items:MapPlaceChangeRequest[]=[];
  async create(input:Parameters<MapPlaceChangeRequestRepository['create']>[0]){
    if(!input.reason.trim()) throw new Error('سبب التغيير مطلوب.');
    if(!Object.keys(input.changes).length) throw new Error('يجب تحديد تغيير حساس واحد على الأقل.');
    if(this.items.some(x=>x.placeId===input.placeId&&x.status==='pending')) throw new Error('يوجد طلب تغيير حساس قيد المراجعة لهذه الجهة.');
    const now=new Date().toISOString();
    const item:MapPlaceChangeRequest={id:`map-place-change-${Date.now()}-${this.items.length+1}`,...input,reason:input.reason.trim(),status:'pending',createdAt:now,updatedAt:now};
    this.items.unshift(item); return clone(item);
  }
  async listForUser(userId:string){return this.items.filter(x=>x.ownerUserId===userId).map(clone);}
  async getOwned(id:string,userId:string){const x=this.items.find(x=>x.id===id&&x.ownerUserId===userId);return x?clone(x):null;}
  async getForReview(id:string){const x=this.items.find(x=>x.id===id);return x?clone(x):null;}
  async review(id:string,input:{decision:'approved'|'rejected';reviewerId:string;rejectionReason?:string}){
    const i=this.items.findIndex(x=>x.id===id); if(i<0) throw new Error('Change request not found');
    if(this.items[i].status!=='pending') throw new Error('Only pending change requests can be reviewed');
    if(!input.reviewerId.trim()) throw new Error('Reviewer id is required');
    if(input.decision==='rejected'&&!input.rejectionReason?.trim()) throw new Error('Rejection reason is required');
    this.items[i]={...this.items[i],status:input.decision,rejectionReason:input.rejectionReason?.trim()||undefined,reviewedBy:input.reviewerId,reviewedAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    return clone(this.items[i]);
  }
  async cancel(id:string,userId:string){const i=this.items.findIndex(x=>x.id===id&&x.ownerUserId===userId);if(i<0) throw new Error('Change request not found');if(this.items[i].status!=='pending') throw new Error('Only pending change requests can be cancelled');this.items[i]={...this.items[i],status:'cancelled',updatedAt:new Date().toISOString()};return clone(this.items[i]);}
}
