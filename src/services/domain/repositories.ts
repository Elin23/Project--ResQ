import { InMemoryAdoptionRepository } from "@/src/data/repositories/inMemoryAdoptionRepository";
import { InMemoryNotificationRepository } from "@/src/data/repositories/inMemoryNotificationRepository";
import { InMemoryAdoptionApplicationRepository } from "@/src/data/repositories/inMemoryAdoptionApplicationRepository";
import { InMemoryFeedingPointSubmissionRepository } from "@/src/data/repositories/inMemoryFeedingPointSubmissionRepository";
import { InMemoryReportRepository } from "@/src/data/repositories/inMemoryReportRepository";
import { InMemoryRescueRepository } from "@/src/data/repositories/inMemoryRescueRepository";
import { InMemoryServicePlaceRepository } from "@/src/data/repositories/inMemoryServicePlaceRepository";
import { InMemoryMapPlaceApplicationRepository } from "@/src/data/repositories/inMemoryMapPlaceApplicationRepository";
import { InMemoryMapPlaceChangeRequestRepository } from "@/src/data/repositories/inMemoryMapPlaceChangeRequestRepository";
import { InMemoryDonationCampaignRepository } from "@/src/data/repositories/inMemoryDonationCampaignRepository";
import { InMemoryDonationTransferRepository } from "@/src/data/repositories/inMemoryDonationTransferRepository";

const reportRepository = new InMemoryReportRepository();
const adoptionRepository = new InMemoryAdoptionRepository();
const notificationRepository = new InMemoryNotificationRepository();
const donationCampaignRepository = new InMemoryDonationCampaignRepository();
const servicePlaceRepository = new InMemoryServicePlaceRepository();
const mapPlaceApplicationRepository = new InMemoryMapPlaceApplicationRepository();
const mapPlaceChangeRequestRepository = new InMemoryMapPlaceChangeRequestRepository();

export const repositories = {
  reports: reportRepository,
  rescue: new InMemoryRescueRepository(reportRepository),
  adoption: adoptionRepository,
  adoptionApplications: new InMemoryAdoptionApplicationRepository(adoptionRepository, notificationRepository),
  notifications: notificationRepository,
  feedingPointSubmissions: new InMemoryFeedingPointSubmissionRepository(),
  servicePlaces: servicePlaceRepository,
  mapPlaceApplications: mapPlaceApplicationRepository,
  mapPlaceChangeRequests: mapPlaceChangeRequestRepository,
  donationCampaigns: donationCampaignRepository,
  donationTransfers: new InMemoryDonationTransferRepository(donationCampaignRepository),
} as const;
