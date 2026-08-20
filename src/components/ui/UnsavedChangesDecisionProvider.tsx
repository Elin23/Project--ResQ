import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

import UnsavedChangesDialog from "./UnsavedChangesDialog";

type Request = {
  title?: string;
  message?: string;
  saveDraftLabel?: string;
  onDiscard: () => void;
  onSaveDraft?: () => Promise<boolean | void> | boolean | void;
};

type ContextValue = {
  requestUnsavedChangesDecision: (request: Request) => void;
};

const Context = createContext<ContextValue | null>(null);

export function UnsavedChangesDecisionProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef<Request | null>(null);

  const clear = useCallback(() => {
    if (loading) return;
    requestRef.current = null;
    setRequest(null);
  }, [loading]);

  const open = useCallback((next: Request) => {
    if (requestRef.current || loading) return;
    requestRef.current = next;
    setRequest(next);
  }, [loading]);

  const discard = useCallback(() => {
    if (loading || !requestRef.current) return;
    const current = requestRef.current;
    requestRef.current = null;
    setRequest(null);
    current.onDiscard();
  }, [loading]);

  const saveDraft = useCallback(async () => {
    const current = requestRef.current;
    if (!current?.onSaveDraft || loading) return;
    setLoading(true);
    try {
      const result = await current.onSaveDraft();
      if (result === false) return;
      requestRef.current = null;
      setRequest(null);
      current.onDiscard();
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const value = useMemo(() => ({ requestUnsavedChangesDecision: open }), [open]);

  return (
    <Context.Provider value={value}>
      {children}
      <UnsavedChangesDialog
        visible={Boolean(request)}
        title={request?.title}
        message={request?.message}
        saveDraftLabel={request?.saveDraftLabel}
        showSaveDraft={Boolean(request?.onSaveDraft)}
        loading={loading}
        onContinue={clear}
        onDiscard={discard}
        onSaveDraft={() => void saveDraft()}
      />
    </Context.Provider>
  );
}

export function useUnsavedChangesDecision() {
  const value = useContext(Context);
  if (!value) throw new Error("useUnsavedChangesDecision must be used within UnsavedChangesDecisionProvider");
  return value;
}
