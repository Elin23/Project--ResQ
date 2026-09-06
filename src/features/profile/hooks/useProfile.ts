import { Href, useRouter } from "expo-router";
import {
  ROUTES,
  aboutRoute,
  articlesRoute,
  helpCenterRoute,
  privacyPolicyRoute,
  successStoriesRoute,
  termsAndConditionsRoute,
} from "@/src/navigation/routes";
import { DEFAULT_PROFILE } from "../constants/profile";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";

export function useProfile() {
  const router = useRouter();
  const { showFeedback } = useFeedback();
  const { accountKind } = useSession();
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

  return { profile: DEFAULT_PROFILE, handleItemPress, edit: () => router.push(ROUTES.editProfile) };
}
