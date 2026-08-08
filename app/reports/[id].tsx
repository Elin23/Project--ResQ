import { Stack } from "expo-router";

import ReportDetailsScreen from "@/src/features/reports/components/ReportDetailsScreen";

export default function ReportDetailsRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ReportDetailsScreen />
    </>
  );
}
