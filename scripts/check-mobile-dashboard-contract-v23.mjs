import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const requireText = (path, text, label) => {
  if (!read(path).includes(text)) throw new Error(`${label}: missing ${text} in ${path}`);
};

requireText("src/features/session/accessPolicy.ts", 'guest: new Set(["browse", "view-adoption"])', "guest report restriction");
requireText("app/reports/create.tsx", 'capability="create-report"', "report deep-link gate");
requireText("src/contracts/backend/reports.ts", '"OPEN" | "EN_ROUTE" | "RECEIVED" | "CLOSED"', "report lifecycle contract");
requireText("src/contracts/backend/adoption.ts", 'AdoptionModerationStatus', "adoption moderation contract");
requireText("src/contracts/backend/feedingPoints.ts", '"PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED"', "feeding point contract");
requireText("src/contracts/backend/advertising.ts", 'AdvertisementPlacement', "ad placement contract");
requireText("src/contracts/backend/content.ts", 'FaqItemDto', "dashboard FAQ contract");
requireText("src/contracts/backend/lookups.ts", 'GovernorateLookupDto', "location lookup contract");
requireText("src/services/api/mappers/reportMapper.ts", 'reportDtoToDomain', "report mapper");
requireText("src/services/api/endpoints.ts", 'governorates:', "lookup endpoints");
console.log("Mobile↔Dashboard backend contract V23 passed.");
