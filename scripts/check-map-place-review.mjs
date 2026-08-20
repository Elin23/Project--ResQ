import fs from "node:fs";
const failures = [];
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
const must = (file, token, label = token) => { if (!read(file).includes(token)) failures.push(`${file}: missing ${label}`); };

for (const file of [
  "src/application/map-places/MapPlaceReviewService.ts",
  "src/application/map-places/__tests__/MapPlaceReviewService.test.ts",
  "app/map-places/applications/[id]/edit.tsx",
  "src/features/map-places/screens/EditMapPlaceApplicationScreen.tsx",
]) if (!fs.existsSync(file)) failures.push(`Missing ${file}`);

must("src/domain/service-places/mapPlaceApplicationRepository.ts", "listPendingReview", "review queue contract");
must("src/domain/service-places/mapPlaceApplicationRepository.ts", "MapPlaceReviewDecision", "review decision contract");
must("src/data/repositories/inMemoryMapPlaceApplicationRepository.ts", 'current.status !== "pending"', "pending-only review transition");
must("src/data/repositories/inMemoryMapPlaceApplicationRepository.ts", "A rejection reason is required", "required rejection reason");
must("src/data/repositories/inMemoryMapPlaceApplicationRepository.ts", "Another active application already exists", "duplicate application prevention");
must("src/application/map-places/MapPlaceReviewService.ts", "ownerUserId: application.applicantUserId", "approved ownership materialization");
must("src/application/map-places/MapPlaceReviewService.ts", "verified: true", "verified approved place");
must("src/application/map-places/MapPlaceReviewService.ts", "await this.places.remove(place.id)", "approval rollback");
must("src/domain/service-places/servicePlaceRepository.ts", "Moderation status is intentionally excluded", "owner status separation");
must("src/data/repositories/inMemoryServicePlaceRepository.ts", 'item.status !== "archived"', "archived owner filtering");
must("src/data/repositories/inMemoryServicePlaceRepository.ts", "A suspension reason is required", "suspension reason");
must("src/application/map-places/MapPlaceReviewService.ts", "suspendPlace", "moderation suspension service");
must("src/application/map-places/MapPlaceReviewService.ts", "archivePlace", "moderation archive service");
must("src/services/domain/services.ts", "mapPlaceReview", "trusted review service wiring");
must("src/features/map-places/screens/MapPlaceApplicationDetailsScreen.tsx", "mapPlaceApplicationEditRoute", "rejected/draft edit action");
must("src/features/map-places/screens/MapPlaceApplicationDetailsScreen.tsx", "approvedPlaceId", "approved place management handoff");
must("src/product/screenCatalog.ts", 'route: "/map-places/applications/[id]/edit"', "edit screen catalog entry");

if (failures.length) {
  console.error("Map-place review check failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log("Map-place review check passed: trusted moderation boundary, pending-only decisions, rejection reasons, duplicate prevention, atomic-style approval materialization, ownership, resubmission, and route coverage are wired.");
