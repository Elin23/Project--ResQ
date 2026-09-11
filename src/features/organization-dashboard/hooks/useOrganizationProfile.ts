import { useCallback, useMemo } from "react";
import { useRouter, type Href } from "expo-router";

import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useSession } from "@/src/features/session/SessionContext";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { organizationDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { fetchMyOrganization } from "@/src/services/api/organizationsApi";
import { organizationProfileSections } from "../constants/organizationProfile";

export function useOrganizationProfile() {
  const router = useRouter();
  const { account, signOut } = useSession();
  const { showFeedback } = useFeedback();
  const loader = useCallback(async () => {
    if (account?.kind !== "organization") return null;
    return fetchMyOrganization();
  }, [account?.kind]);
  const resource = useAsyncResource(loader, null, "تعذر تحميل بيانات الجمعية.");
  const publicProfileId = resource.data?.id ? String(resource.data.id) : undefined;
  const sections = useMemo(() => organizationProfileSections(publicProfileId), [publicProfileId]);

  const handleItemPress = (route?: Href, label?: string) => {
    if (route) return router.push(route);
    showFeedback({ title: label ?? "إعدادات الجمعية", message: "هذا الإجراء غير متاح لهذا الحساب حاليًا.", tone: "info" });
  };

  return {
    name: resource.data?.name ?? account?.displayName ?? "الجمعية",
    logoUrl: resource.data?.logoUrl ?? undefined,
    locationLabel: [resource.data?.place?.regionName, resource.data?.place?.governorateName].filter(Boolean).join("، "),
    verified: resource.data?.verificationStatus === "VERIFIED" && resource.data?.status === "ACTIVE",
    verifiedAt: resource.data?.verifiedAt ?? undefined,
    sections,
    loading: resource.loading,
    error: resource.error,
    reload: resource.reload,
    handleItemPress,
    canOpenPublicProfile: Boolean(publicProfileId),
    openPublicProfile: () => {
      if (publicProfileId) router.push(organizationDetailsRoute(publicProfileId));
      else showFeedback({ title: "الملف العام غير متاح بعد", message: "سيظهر الملف العام بعد اكتمال اعتماد الجمعية ونشرها.", tone: "info" });
    },
    logout: async () => {
      await signOut();
      router.replace(ROUTES.login);
    },
  };
}
