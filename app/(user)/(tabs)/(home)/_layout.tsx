import { Stack, useRouter } from "expo-router";

import TopBar from "@/src/components/ui/TopBar";
import { DEFAULT_PROFILE } from "@/src/features/profile/constants/profile";
import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES } from "@/src/navigation/routes";

export default function UserHomeStackLayout() {
  const router = useRouter();
  const { principal, can } = useSession();
  const isAuthenticatedUser = principal.kind === "authenticated" && principal.account.kind === "user";

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
              avatarUri={isAuthenticatedUser ? DEFAULT_PROFILE.avatarUri : undefined}
              avatarLabel="فتح حسابي"
              onAvatarPress={isAuthenticatedUser ? () => router.push(ROUTES.profile) : undefined}
            />
          ),
        }}
      />
    </Stack>
  );
}
