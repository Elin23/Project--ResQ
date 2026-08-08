import { Redirect } from "expo-router";

/** Legacy route kept for links created before report details moved under /reports/[id]. */
export default function LegacyReportDetailsRoute() {
  return <Redirect href={{ pathname: "/reports/[id]", params: { id: "1" } }} />;
}
