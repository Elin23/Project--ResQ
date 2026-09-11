import { useState } from "react";

import type {
  AdoptionListing,
  CreateAdoptionListingInput,
  UpdateAdoptionListingInput,
} from "@/src/domain";
import { repositories } from "@/src/services/domain/repositories";

export function useCreateAdoptionListing() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    input: CreateAdoptionListingInput,
  ): Promise<AdoptionListing> => {
    setSubmitting(true);
    setError(null);
    try {
      return await repositories.adoption.submit(input);
    } catch (cause) {
      const message = cause instanceof Error && cause.message.trim()
        ? cause.message
        : "تعذر إرسال إعلان التبني للمراجعة. حاول مرة أخرى.";
      setError(message);
      throw cause instanceof Error ? cause : new Error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateAndResubmit = async (
    id: string,
    ownerAccountId: string,
    input: UpdateAdoptionListingInput,
  ): Promise<AdoptionListing> => {
    setSubmitting(true);
    setError(null);
    try {
      return await repositories.adoption.updateAndResubmit(id, ownerAccountId, input);
    } catch (cause) {
      const message = cause instanceof Error && cause.message.trim()
        ? cause.message
        : "تعذر تحديث الإعلان وإعادة إرساله للمراجعة.";
      setError(message);
      throw cause instanceof Error ? cause : new Error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, updateAndResubmit, submitting, error };
}
