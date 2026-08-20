export type ModerationStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "archived";

export type ModerationDecision = "approve" | "reject";

export interface ModerationMetadata {
  moderationStatus: ModerationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface ModerationDecisionInput {
  decision: ModerationDecision;
  reviewerId: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export function submitForReview<T extends ModerationMetadata>(
  item: T,
  submittedAt = new Date().toISOString(),
): T {
  return {
    ...item,
    moderationStatus: "pending_review",
    submittedAt,
    reviewedAt: undefined,
    reviewedBy: undefined,
    rejectionReason: undefined,
  };
}

export function applyModerationDecision<T extends ModerationMetadata>(
  item: T,
  input: ModerationDecisionInput,
): T {
  if (item.moderationStatus !== "pending_review") {
    throw new Error("Only pending content can be reviewed");
  }

  if (input.decision === "reject" && !input.rejectionReason?.trim()) {
    throw new Error("A rejection reason is required");
  }

  return {
    ...item,
    moderationStatus: input.decision === "approve" ? "approved" : "rejected",
    reviewedAt: input.reviewedAt ?? new Date().toISOString(),
    reviewedBy: input.reviewerId,
    rejectionReason: input.decision === "reject" ? input.rejectionReason?.trim() : undefined,
  };
}

export function isPubliclyVisible(metadata: ModerationMetadata): boolean {
  return metadata.moderationStatus === "approved";
}
