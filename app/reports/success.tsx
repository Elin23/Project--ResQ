import { Stack } from "expo-router";

import ReportSuccessView from "@/src/features/reports/components/ReportSuccessView";

export default function SuccessPageRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ReportSuccessView />
    </>
  );
}
