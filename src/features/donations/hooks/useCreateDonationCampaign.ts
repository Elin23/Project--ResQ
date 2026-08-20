import { useCallback, useState } from "react";

import type { CreateDonationCampaignInput } from "@/src/domain";
import { repositories } from "@/src/services/domain/repositories";

export function useCreateDonationCampaign() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDraft = useCallback(async (input: CreateDonationCampaignInput) => {
    setSaving(true);
    setError(null);
    try {
      return await repositories.donationCampaigns.createDraft(input);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "تعذر حفظ الحملة.";
      setError(message);
      throw cause;
    } finally {
      setSaving(false);
    }
  }, []);

  const createAndSubmit = useCallback(async (input: CreateDonationCampaignInput) => {
    setSaving(true);
    setError(null);
    try {
      const draft = await repositories.donationCampaigns.createDraft(input);
      return await repositories.donationCampaigns.submitForReview(
        draft.id,
        input.ownerAccountId,
      );
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "تعذر إرسال الحملة للمراجعة.";
      setError(message);
      throw cause;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateOwned = useCallback(
    async (id: string, ownerAccountId: string, input: Parameters<typeof repositories.donationCampaigns.updateOwned>[2]) => {
      setSaving(true);
      setError(null);
      try {
        return await repositories.donationCampaigns.updateOwned(id, ownerAccountId, input);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : "تعذر تحديث الحملة.";
        setError(message);
        throw cause;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const updateAndSubmit = useCallback(
    async (id: string, ownerAccountId: string, input: Parameters<typeof repositories.donationCampaigns.updateOwned>[2]) => {
      setSaving(true);
      setError(null);
      try {
        await repositories.donationCampaigns.updateOwned(id, ownerAccountId, input);
        return await repositories.donationCampaigns.submitForReview(id, ownerAccountId);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : "تعذر تحديث الحملة وإرسالها.";
        setError(message);
        throw cause;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return {
    createDraft,
    createAndSubmit,
    updateOwned,
    updateAndSubmit,
    saving,
    error,
  };
}
