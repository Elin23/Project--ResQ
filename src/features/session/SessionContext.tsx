import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type {
  AccountKind,
  AccountStatus,
  AuthenticatedAccount,
  SessionPrincipal,
} from "@/src/types/accounts";
import { can, type AppCapability } from "./accessPolicy";

type StoredSession = {
  version: 3;
  principal: SessionPrincipal;
};

type StartSessionInput = {
  id?: string;
  kind: AccountKind;
  status?: AccountStatus;
  displayName?: string;
  email?: string;
};

type SessionContextValue = {
  principal: SessionPrincipal;
  mode: "anonymous" | "guest" | "member";
  account: AuthenticatedAccount | null;
  accountKind: AccountKind | null;
  isGuest: boolean;
  isMember: boolean;
  isReady: boolean;
  can: (capability: AppCapability) => boolean;
  continueAsGuest: () => Promise<void>;
  startAuthenticatedSession: (input: StartSessionInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const STORAGE_KEY = "resq.session.v3";
const LEGACY_STORAGE_KEY = "resq.session.mode";
const SessionContext = createContext<SessionContextValue | null>(null);

function createLocalAccountId(kind: AccountKind): string {
  return `local-${kind}`;
}

function isValidStoredSession(value: unknown): value is StoredSession {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoredSession>;
  if (candidate.version !== 3 || !candidate.principal) return false;

  const principal = candidate.principal;
  if (principal.kind === "anonymous" || principal.kind === "guest") return true;
  if (principal.kind !== "authenticated" || !principal.account) return false;

  return ["user", "organization"].includes(principal.account.kind)
    && ["active", "pending", "rejected", "suspended"].includes(principal.account.status);
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [principal, setPrincipal] = useState<SessionPrincipal>({ kind: "anonymous" });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isValidStoredSession(parsed) && mounted) {
            setPrincipal(parsed.principal);
            return;
          }
        }

        // Safe one-time migration from V0.8. The old "member" session had no role,
        // therefore it is migrated to the least-privileged authenticated role: user.
        const legacyMode = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
        if (!mounted) return;
        if (legacyMode === "guest") {
          setPrincipal({ kind: "guest" });
        } else if (legacyMode === "member") {
          setPrincipal({
            kind: "authenticated",
            account: { id: createLocalAccountId("user"), kind: "user", status: "active" },
          });
        }
      } catch {
        if (mounted) setPrincipal({ kind: "anonymous" });
      } finally {
        if (mounted) setIsReady(true);
      }
    };

    void restore();
    return () => { mounted = false; };
  }, []);

  const persistPrincipal = useCallback(async (nextPrincipal: SessionPrincipal) => {
    setPrincipal(nextPrincipal);
    const payload: StoredSession = { version: 3, principal: nextPrincipal };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
  }, []);

  const continueAsGuest = useCallback(
    () => persistPrincipal({ kind: "guest" }),
    [persistPrincipal],
  );

  const startAuthenticatedSession = useCallback(async (input: StartSessionInput) => {
    await persistPrincipal({
      kind: "authenticated",
      account: {
        id: input.id ?? createLocalAccountId(input.kind),
        kind: input.kind,
        status: input.status ?? "active",
        displayName: input.displayName,
        email: input.email,
      },
    });
  }, [persistPrincipal]);

  const signOut = useCallback(async () => {
    setPrincipal({ kind: "anonymous" });
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY),
      AsyncStorage.removeItem(LEGACY_STORAGE_KEY),
    ]);
  }, []);

  const value = useMemo<SessionContextValue>(() => {
    const account = principal.kind === "authenticated" ? principal.account : null;
    return {
      principal,
      mode: principal.kind === "authenticated" ? "member" : principal.kind,
      account,
      accountKind: account?.kind ?? null,
      isGuest: principal.kind === "guest",
      isMember: principal.kind === "authenticated",
      isReady,
      can: (capability) => can(principal, capability),
      continueAsGuest,
      startAuthenticatedSession,
      signOut,
    };
  }, [continueAsGuest, isReady, principal, signOut, startAuthenticatedSession]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}
