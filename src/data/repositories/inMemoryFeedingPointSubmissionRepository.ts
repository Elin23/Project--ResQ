import {
  applyModerationDecision,
  type CreateFeedingPointSubmissionInput,
  type FeedingPointSubmission,
  type FeedingPointSubmissionRepository,
  type ModerationDecisionInput,
} from "@/src/domain";

function clone(item: FeedingPointSubmission): FeedingPointSubmission {
  return { ...item, facilities: [...item.facilities] };
}

export class InMemoryFeedingPointSubmissionRepository
implements FeedingPointSubmissionRepository {
  private submissions: FeedingPointSubmission[] = [];
  private idCounter = 0;

  async submit(input: CreateFeedingPointSubmissionInput) {
    const now = new Date().toISOString();
    const item: FeedingPointSubmission = {
      id: `feeding-submission-${Date.now()}-${++this.idCounter}`,
      ...input,
      facilities: [...(input.facilities ?? [])],
      moderationStatus: "pending_review",
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    this.submissions.unshift(item);
    return clone(item);
  }

  async listByOwner(ownerAccountId: string) {
    return this.submissions
      .filter((item) => item.ownerAccountId === ownerAccountId)
      .map(clone);
  }

  async getOwnedById(id: string, ownerAccountId: string) {
    const item = this.submissions.find(
      (submission) => submission.id === id && submission.ownerAccountId === ownerAccountId,
    );
    return item ? clone(item) : undefined;
  }

  async listPendingReview() {
    return this.submissions
      .filter((item) => item.moderationStatus === "pending_review")
      .map(clone);
  }

  async getForReview(id: string) {
    const item = this.submissions.find((submission) => submission.id === id);
    return item ? clone(item) : undefined;
  }

  async review(id: string, input: ModerationDecisionInput) {
    const index = this.submissions.findIndex((submission) => submission.id === id);
    if (index < 0) throw new Error("Feeding point submission not found");
    const reviewed = applyModerationDecision(this.submissions[index], input);
    const next = { ...reviewed, updatedAt: reviewed.reviewedAt ?? new Date().toISOString() };
    this.submissions[index] = next;
    return clone(next);
  }
}
