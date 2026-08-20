import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];
const requireFile = (file) => { if (!exists(file)) failures.push(`Missing required file: ${file}`); };
const requireText = (file, text, label = text) => {
  if (!exists(file) || !read(file).includes(text)) failures.push(`${file}: missing ${label}`);
};

[
  "app/feeding-points/create.tsx",
  "app/(user)/(tabs)/(home)/feeding-points/index.tsx",
  "app/(user)/(tabs)/(home)/feeding-points/submissions/index.tsx",
  "app/(user)/(tabs)/(home)/feeding-points/submissions/[id].tsx",
  "app/organization/(tabs)/(home)/feeding-points/index.tsx",
  "app/organization/(tabs)/(home)/feeding-points/submissions/index.tsx",
  "src/features/feeding-points/screens/CreateFeedingPointScreen.tsx",
  "src/features/feeding-points/screens/FeedingPointSubmissionsScreen.tsx",
  "src/features/feeding-points/screens/FeedingPointSubmissionDetailsScreen.tsx",
].forEach(requireFile);

requireText("app/feeding-points/create.tsx", 'capability="create-feeding-point"', "create-feeding-point capability gate");
requireText("src/features/feeding-points/screens/FeedingPointsScreen.tsx", 'can("create-feeding-point")', "create permission visibility");
requireText("src/features/feeding-points/screens/FeedingPointsScreen.tsx", 'can("view-own-submissions")', "owner-submission visibility");
requireText("src/features/feeding-points/hooks/useCreateFeedingPointSubmission.ts", "repositories.feedingPointSubmissions.submit", "repository-backed submission");
requireText("src/features/feeding-points/screens/CreateFeedingPointScreen.tsx", "سيتم نشرها بعد مراجعة الإدارة", "moderation copy/contract");
requireText("src/features/feeding-points/screens/FeedingPointSubmissionDetailsScreen.tsx", "rejectionReason", "rejection reason display");
requireText("src/data/repositories/inMemoryFeedingPointSubmissionRepository.ts", 'moderationStatus: "pending_review"', "pending review default");
requireText("src/features/session/accessPolicy.ts", 'guest: new Set(["browse", "create-report", "view-adoption"])', "guest remains unable to create feeding points");
requireText("src/features/home/hooks/useHomeScreen.ts", "feedingPointsRoute(accountKind)", "home action opens feeding-points feature");

if (failures.length) {
  console.error("Feeding-point submission flow check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Feeding-point submission flow check passed: authenticated user/organization creation, owner tracking, pending moderation, status follow-up, and guest exclusion are wired.");
