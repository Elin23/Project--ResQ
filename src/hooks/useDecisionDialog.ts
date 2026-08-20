import { useCallback, useRef, useState, type ComponentProps } from "react";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";

type Config = Omit<ComponentProps<typeof ConfirmDialog>, "visible" | "onConfirm" | "onCancel" | "loading">;

export function useDecisionDialog() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<null | (() => Promise<void> | void)>(null);

  const request = useCallback((next: Config, action: () => Promise<void> | void) => {
    if (loading || config) return;
    actionRef.current = action;
    setConfig(next);
  }, [config, loading]);

  const cancel = useCallback(() => {
    if (loading) return;
    actionRef.current = null;
    setConfig(null);
  }, [loading]);

  const confirm = useCallback(async () => {
    if (!actionRef.current || loading) return;
    setLoading(true);
    try {
      await actionRef.current();
    } catch {
      // Action-level feedback is owned by the caller; always release the decision surface.
    } finally {
      actionRef.current = null;
      setConfig(null);
      setLoading(false);
    }
  }, [loading]);

  return {
    request,
    dialogProps: config ? { ...config, visible: true, loading, onConfirm: () => void confirm(), onCancel: cancel } : null,
  };
}
