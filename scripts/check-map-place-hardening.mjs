import fs from 'node:fs';
const failures=[]; const read=f=>fs.readFileSync(f,'utf8'); const must=(f,t,l=t)=>{if(!fs.existsSync(f)||!read(f).includes(t))failures.push(`${f}: missing ${l}`)}; const mustNot=(f,t,l=t)=>{if(fs.existsSync(f)&&read(f).includes(t))failures.push(`${f}: forbidden ${l}`)};
for(const f of ['src/domain/service-places/mapPlaceValidation.ts','src/domain/service-places/mapPlaceChangeRequest.ts','src/domain/service-places/mapPlaceChangeRequestRepository.ts','src/data/repositories/inMemoryMapPlaceChangeRequestRepository.ts','src/application/map-places/MapPlaceChangeReviewService.ts','src/features/map-places/components/OpeningHoursEditor.tsx','src/features/map-places/components/MapPlaceLocationPicker.native.tsx','src/features/map-places/screens/MapPlaceChangeRequestScreen.tsx','app/map-places/[id]/change-request.tsx']) if(!fs.existsSync(f))failures.push(`Missing ${f}`);
must('src/domain/service-places/mapPlaceValidation.ts',"input.requestedType === 'clinic'",'clinic-specific server-side validation');
must('src/domain/service-places/mapPlaceValidation.ts','supportingDocumentUri','verification evidence requirement');
must('src/data/repositories/inMemoryMapPlaceApplicationRepository.ts','validateMapPlaceDraft(current, { forSubmission: true })','repository submission validation');
must('src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx','MapPlaceLocationPicker','interactive location picker');
must('src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx','OpeningHoursEditor','opening-hours editor');
must('src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx','launchImageLibraryAsync','verification evidence picker');
must('src/domain/service-places/servicePlaceRepository.ts','ApplySensitiveServicePlaceChangesInput','trusted sensitive update contract');
mustNot('src/domain/service-places/servicePlaceRepository.ts','| "address"\n  | "latitude"\n  | "longitude"','owner direct location mutation');
must('src/features/map-places/screens/EditOwnedMapPlaceScreen.tsx','mapPlaceChangeRequestRoute','sensitive-change CTA');
must('src/data/repositories/inMemoryMapPlaceChangeRequestRepository.ts',"x.placeId===input.placeId&&x.status==='pending'",'duplicate pending change prevention');
must('src/application/map-places/MapPlaceChangeReviewService.ts','place.ownerUserId!==request.ownerUserId','ownership verification before sensitive apply');
must('src/application/map-places/MapPlaceChangeReviewService.ts','applySensitiveChanges','review-only sensitive application');
must('app/map-places/[id]/change-request.tsx','capability="edit-owned-map-place"','route capability gate');
must('src/product/screenCatalog.ts','route: "/map-places/[id]/change-request"','screen catalog coverage');
if(failures.length){console.error('Map-place hardening check failed:\n'+failures.map(x=>`- ${x}`).join('\n'));process.exit(1)}
console.log('Map-place hardening check passed: category-specific verification, map location selection, opening-hours editing, evidence capture, owner-safe updates, and moderated sensitive change requests are wired.');
