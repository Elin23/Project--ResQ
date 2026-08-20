import type { ModerationDecisionInput } from "../moderation/moderation";
import type {
  CreateFeedingPointSubmissionInput,
  FeedingPointSubmission,
} from "./feedingPointSubmission";

export interface FeedingPointSubmissionRepository {
  submit(input: CreateFeedingPointSubmissionInput): Promise<FeedingPointSubmission>;
  listByOwner(ownerAccountId: string): Promise<FeedingPointSubmission[]>;
  getOwnedById(id: string, ownerAccountId: string): Promise<FeedingPointSubmission | undefined>;
  listPendingReview(): Promise<FeedingPointSubmission[]>;
  getForReview(id: string): Promise<FeedingPointSubmission | undefined>;
  review(id: string, input: ModerationDecisionInput): Promise<FeedingPointSubmission>;
}
