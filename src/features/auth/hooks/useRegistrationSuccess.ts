import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { AccountType, createRoleContent, EntityType } from "../constants/registrationSuccess";

export function useRegistrationSuccess() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ accountType?: string; entityType?: string; status?: string; name?: string }>();

  const accountType: AccountType = params.accountType === "entity" ? "entity" : "user";
  const entityType: EntityType | undefined = params.entityType === "clinic" ? "clinic" : params.entityType === "organization" ? "organization" : undefined;
  const statusParam = Array.isArray(params.status) ? params.status[0] : params.status;
  const displayName = useMemo(() => {
    const value = Array.isArray(params.name) ? params.name[0] : params.name;
    return value?.trim() ?? "";
  }, [params.name]);
  const content = useMemo(() => createRoleContent(accountType, entityType, statusParam), [accountType, entityType, statusParam]);
  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 20;
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);

  return {
    content, displayName, horizontalPadding, contentWidth,
    openPrimary: () => router.replace(content.primaryButtonPathname as never),
    openSecondary: () => content.secondaryButtonPathname && router.push(content.secondaryButtonPathname as never),
  };
}
