import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import TopBar from "@/src/components/ui/TopBar";
import { useUnreadNotificationCount } from "@/src/features/notifications/hooks";
import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES } from "@/src/navigation/routes";
import { profileApi } from "@/src/services/api/profileApi";
import {
  getLatestProfile,
  publishProfileChanged,
  subscribeProfileChanged,
} from "@/src/services/api/profileEvents";

export default function UserHomeStackLayout() {
  const router = useRouter();
  const { principal, can } = useSession();
  const isAuthenticatedUser = principal.kind === "authenticated" && principal.account.kind === "user";
  const authenticatedAccountId = principal.kind === "authenticated" ? principal.account.id : null;
  const unread = useUnreadNotificationCount(principal.kind === "authenticated" && can("view-notifications"));
  const [avatarUri, setAvatarUri] = useState(() => getLatestProfile()?.avatarUrl ?? "");

  useEffect(() => {
    if (!isAuthenticatedUser) {
      setAvatarUri("");
      return;
    }

    let active = true;

    const unsubscribe = subscribeProfileChanged((profile) => {
      if (active) setAvatarUri(profile.avatarUrl ?? "");
    });

    // Load the backend profile once on authenticated app entry. This is needed
    // because the login/session payload does not necessarily contain avatarUrl.
    void profileApi
      .getMine()
      .then((profile) => {
        if (!active) return;
        setAvatarUri(profile.avatarUrl ?? "");
        publishProfileChanged(profile);
      })
      .catch(() => {
        // The header can safely keep the fallback icon if profile loading fails.
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [authenticatedAccountId, isAuthenticatedUser]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => (
            <TopBar
              onSearchPress={() => router.push(ROUTES.search)}
              onNotificationsPress={can("view-notifications") ? () => router.push(ROUTES.notifications) : undefined}
              unreadNotificationCount={unread.count}
              avatarUri={avatarUri || undefined}
              avatarLabel="فتح حسابي"
              onAvatarPress={isAuthenticatedUser ? () => router.push(ROUTES.profile) : undefined}
            />
          ),
        }}
      />
    </Stack>
  );
}
