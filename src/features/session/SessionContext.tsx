import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

type SessionMode = "anonymous" | "guest" | "member";

type SessionContextValue = {
  mode: SessionMode;
  isGuest: boolean;
  isMember: boolean;
  isReady: boolean;
  continueAsGuest: () => Promise<void>;
  signInAsMember: () => Promise<void>;
  signOut: () => Promise<void>;
};

const STORAGE_KEY = "resq.session.mode";
const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<SessionMode>("anonymous");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "member" || stored === "guest") setMode(stored);
      })
      .finally(() => setIsReady(true));
  }, []);

  const persist = useCallback(async (nextMode: SessionMode) => {
    setMode(nextMode);
    await AsyncStorage.setItem(STORAGE_KEY, nextMode);
  }, []);

  const value = useMemo<SessionContextValue>(() => ({
    mode,
    isGuest: mode === "guest",
    isMember: mode === "member",
    isReady,
    continueAsGuest: () => persist("guest"),
    signInAsMember: () => persist("member"),
    signOut: async () => { setMode("anonymous"); await AsyncStorage.removeItem(STORAGE_KEY); },
  }), [isReady, mode, persist]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}
