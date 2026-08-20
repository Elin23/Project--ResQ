import { describe, expect, it } from "vitest";

import {
  applyModerationDecision,
  isPubliclyVisible,
  submitForReview,
  type ModerationMetadata,
} from "@/src/domain";

const approved: ModerationMetadata = {
  moderationStatus: "approved",
  reviewedAt: "2026-01-01T00:00:00.000Z",
  reviewedBy: "admin-old",
};

describe("moderation lifecycle", () => {
  it("resubmits content without carrying an old review decision", () => {
    const pending = submitForReview(approved, "2026-02-01T00:00:00.000Z");
    expect(pending.moderationStatus).toBe("pending_review");
    expect(pending.submittedAt).toBe("2026-02-01T00:00:00.000Z");
    expect(pending.reviewedAt).toBeUndefined();
    expect(pending.reviewedBy).toBeUndefined();
  });

  it("requires a reason when rejecting", () => {
    expect(() => applyModerationDecision(
      { moderationStatus: "pending_review" },
      { decision: "reject", reviewerId: "admin-1" },
    )).toThrow("rejection reason");
  });

  it("only exposes approved content publicly", () => {
    expect(isPubliclyVisible({ moderationStatus: "approved" })).toBe(true);
    expect(isPubliclyVisible({ moderationStatus: "pending_review" })).toBe(false);
    expect(isPubliclyVisible({ moderationStatus: "rejected" })).toBe(false);
  });
});
