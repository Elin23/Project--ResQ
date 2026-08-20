import { Stack } from "expo-router";

import OrganizationReportDetailsScreen from "@/src/features/organization-dashboard/screens/OrganizationReportDetailsScreen";

export default function OrganizationReportDetailsRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OrganizationReportDetailsScreen />
    </>
  );
}
