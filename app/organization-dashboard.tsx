import { Redirect } from "expo-router";
import { ROUTES } from "@/src/navigation/routes";
export default function LegacyOrganizationDashboardRoute() { return <Redirect href={ROUTES.organizationDashboard} />; }
