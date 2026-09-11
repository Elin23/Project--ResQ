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
import { resetOnboarding } from "@/src/utils/onboardingStorage";
import { authApi } from "@/src/services/api/authApi";
import { profileApi } from "@/src/services/api/profileApi";
import { clearAuthTokens, isIsoExpiryPast, loadAuthTokens } from "@/src/services/api/authTokens";
import { subscribeSessionInvalidated } from "@/src/services/api/authSessionEvents";
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
  organizationId?: number;
  normalUserId?: number;
  phone?: string;
  phoneVerified?: boolean;
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
  signOutAll: () => Promise<void>;
  deleteAccount: () => Promise<void>;
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
    && ["active", "pending", "rejected", "suspended", "blocked", "deactivated", "more_info_required"].includes(principal.account.status);
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
            if (parsed.principal.kind === "authenticated") {
              const tokens = await loadAuthTokens();
              if (!tokens?.accessToken || !tokens.refreshToken || isIsoExpiryPast(tokens.refreshTokenExpiresAt, 5_000)) {
                await clearAuthTokens();
                setPrincipal({ kind: "anonymous" });
                await AsyncStorage.removeItem(STORAGE_KEY);
                return;
              }
            }
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
          // Legacy member sessions had no server identity/token and are unsafe to restore.
          setPrincipal({ kind: "anonymous" });
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


  useEffect(() => subscribeSessionInvalidated(() => {
    setPrincipal({ kind: "anonymous" });
    void Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY),
      AsyncStorage.removeItem(LEGACY_STORAGE_KEY),
    ]);
  }), []);

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
        organizationId: input.organizationId,
        normalUserId: input.normalUserId,
        phone: input.phone,
        phoneVerified: input.phoneVerified,
      },
    });
  }, [persistPrincipal]);

  const signOut = useCallback(async () => {
    const tokens = await loadAuthTokens();
    if (tokens?.refreshToken) {
      try { await authApi.logout(tokens.refreshToken); } catch { /* local sign-out must still succeed */ }
    }
    await clearAuthTokens();
    setPrincipal({ kind: "anonymous" });
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY),
      AsyncStorage.removeItem(LEGACY_STORAGE_KEY),
    ]);
  }, []);

  const signOutAll = useCallback(async () => {
    try { await authApi.logoutAll(); } catch { /* local cleanup still has to run */ }
    await clearAuthTokens();
    setPrincipal({ kind: "anonymous" });
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY),
      AsyncStorage.removeItem(LEGACY_STORAGE_KEY),
    ]);
  }, []);

  const deleteAccount = useCallback(async () => {
    await profileApi.deactivateMine();
    setPrincipal({ kind: "anonymous" });
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY),
      AsyncStorage.removeItem(LEGACY_STORAGE_KEY),
      clearAuthTokens(),
      resetOnboarding(),
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
      signOutAll,
      deleteAccount,
    };
  }, [continueAsGuest, deleteAccount, isReady, principal, signOut, signOutAll, startAuthenticatedSession]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}
