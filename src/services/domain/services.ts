import { RescueOperationsService } from "@/src/application/rescue/RescueOperationsService";
import { MapPlaceReviewService } from "@/src/application/map-places/MapPlaceReviewService";
import { MapPlaceChangeReviewService } from "@/src/application/map-places/MapPlaceChangeReviewService";
import { repositories } from "./repositories";

export const domainServices = {
  rescueOperations: new RescueOperationsService(repositories.reports, repositories.rescue),
  mapPlaceReview: new MapPlaceReviewService(repositories.mapPlaceApplications, repositories.servicePlaces),
  mapPlaceChangeReview: new MapPlaceChangeReviewService(repositories.mapPlaceChangeRequests, repositories.servicePlaces),
} as const;
