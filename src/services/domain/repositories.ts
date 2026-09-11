import { ApiRescueRepository } from "@/src/services/api/rescueMissionRepository";
import { ApiNotificationRepository } from "@/src/services/api/notificationApiRepository";
import { ApiLocationLookupRepository } from "@/src/services/api/locationLookupRepository";
import {
  ApiFaqRepository,
  ApiPublicContentRepository,
  ApiReportRepository,
  ApiServicePlaceRepository,
  ApiSponsoredAdRepository,
} from "@/src/services/api/apiRepositories";
import {
  ApiAdoptionApplicationRepository,
  ApiAdoptionWriteRepository,
  ApiDonationCampaignWriteRepository,
  ApiDonationTransferWriteRepository,
  ApiFeedingPointSubmissionRepository,
  ApiMapPlaceApplicationRepository,
} from "@/src/services/api/apiWriteRepositories";

/**
 * Runtime repository graph.
 *
 * Production code is intentionally API-only. Test fixtures/in-memory repositories
 * live under test-fixtures but are never imported into the application runtime, which
 * prevents mock cards, mock ids and local mutations from conflicting with the
 * persisted backend state.
 */
const reportRepository = new ApiReportRepository();
const adoptionRepository = new ApiAdoptionWriteRepository();
const notificationRepository = new ApiNotificationRepository();
const servicePlaceRepository = new ApiServicePlaceRepository();
const donationCampaignRepository = new ApiDonationCampaignWriteRepository();

export const repositories = {
  reports: reportRepository,
  rescue: new ApiRescueRepository(),
  adoption: adoptionRepository,
  adoptionApplications: new ApiAdoptionApplicationRepository(),
  notifications: notificationRepository,
  feedingPointSubmissions: new ApiFeedingPointSubmissionRepository(),
  servicePlaces: servicePlaceRepository,
  mapPlaceApplications: new ApiMapPlaceApplicationRepository(),
  donationCampaigns: donationCampaignRepository,
  donationTransfers: new ApiDonationTransferWriteRepository(),
  publicContent: new ApiPublicContentRepository(),
  sponsoredAds: new ApiSponsoredAdRepository(),
  locationLookups: new ApiLocationLookupRepository(),
  faq: new ApiFaqRepository(),
} as const;
