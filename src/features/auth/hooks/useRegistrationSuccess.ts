import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { AccountType, createRoleContent } from "../constants/registrationSuccess";

export function useRegistrationSuccess() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ accountType?: string }>();
  const accountType: AccountType = params.accountType === "entity" || params.accountType === "organization" ? "organization" : "user";
  const content = useMemo(() => createRoleContent(accountType), [accountType]);
  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 20;
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);
  return {
    content, horizontalPadding, contentWidth,
    openPrimary: () => router.replace(content.primaryButtonPathname),
    openSecondary: () => content.secondaryButtonPathname && router.push(content.secondaryButtonPathname),
  };
}
