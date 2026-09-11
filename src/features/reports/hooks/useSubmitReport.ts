import { useCallback, useState } from "react";
import { repositories } from "@/src/services/domain/repositories";
import type { CreateReportInput } from "@/src/domain";
import { ApiError } from "@/src/services/api/client";

export function useSubmitReport() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: CreateReportInput) => {
    setSubmitting(true);
    setError(null);
    try {
      return await repositories.reports.create(input);
    } catch (cause) {
      setError(cause instanceof ApiError || cause instanceof Error ? cause.message : "تعذر إرسال البلاغ. حاول مرة أخرى.");
      throw cause;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, error };
}
