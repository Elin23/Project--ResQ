import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";
import {
  ROUTES,
  aboutRoute,
  articlesRoute,
  helpCenterRoute,
  privacyPolicyRoute,
  successStoriesRoute,
  termsAndConditionsRoute,
} from "@/src/navigation/routes";
import { ApiError } from "@/src/services/api/client";
import { profileApi, type MyProfileDto } from "@/src/services/api/profileApi";
import {
  getLatestProfile,
  publishProfileChanged,
  subscribeProfileChanged,
} from "@/src/services/api/profileEvents";

const splitName = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
};

export function useProfile() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { accountKind, account } = useSession();
  const [remote, setRemote] = useState<MyProfileDto | null>(() => getLatestProfile());
  const [loading, setLoading] = useState(accountKind === "user" && !getLatestProfile());
  const [error, setError] = useState<string>();

  const reload = useCallback(async () => {
    if (accountKind !== "user") return;
    try {
      setLoading(true);
      setError(undefined);
      const profile = await profileApi.getMine();
      setRemote(profile);
      publishProfileChanged(profile);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "تعذر تحميل الملف الشخصي.");
    } finally {
      setLoading(false);
    }
  }, [accountKind]);

  useEffect(() => {
    return subscribeProfileChanged((profile) => {
      setRemote(profile);
      setError(undefined);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handleItemPress = (route?: Href, label?: string) => {
    if (route === ROUTES.helpCenter) return router.push(helpCenterRoute(accountKind));
    if (route === ROUTES.privacyPolicy) return router.push(privacyPolicyRoute(accountKind));
    if (route === ROUTES.termsAndConditions) return router.push(termsAndConditionsRoute(accountKind));
    if (route === ROUTES.about) return router.push(aboutRoute(accountKind));
    if (route === ROUTES.articles) return router.push(articlesRoute(accountKind));
    if (route === ROUTES.successStories) return router.push(successStoriesRoute(accountKind));
    if (route) return router.push(route);
    showFeedback({ title: label ?? "الخيار", message: "هذا الخيار غير متاح حاليًا.", tone: "info" });
  };

  const name = remote?.fullName ?? account?.displayName ?? "";
  const parts = splitName(name);
  const profile = {
    ...parts,
    email: remote?.email ?? account?.email ?? "",
    phone: remote?.phone ?? account?.phone ?? "",
    avatarUri: remote?.avatarUrl ?? "",
  };

  return {
    profile,
    loading,
    error,
    reload,
    handleItemPress,
    edit: () => router.push(ROUTES.editProfile),
  };
}
