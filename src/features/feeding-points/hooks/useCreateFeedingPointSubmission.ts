import { useState } from "react";

import type { CreateFeedingPointSubmissionInput, FeedingPointSubmission } from "@/src/domain";
import { repositories } from "@/src/services/domain/repositories";

export function useCreateFeedingPointSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (input: CreateFeedingPointSubmissionInput): Promise<FeedingPointSubmission> => {
    setSubmitting(true);
    setError(null);
    try {
      return await repositories.feedingPointSubmissions.submit(input);
    } catch {
      const message = "تعذر إرسال نقطة الإطعام للمراجعة. حاول مرة أخرى.";
      setError(message);
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, error };
}
