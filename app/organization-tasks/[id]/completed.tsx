import { Redirect, useLocalSearchParams } from "expo-router";
import { organizationTaskCompletedRoute } from "@/src/navigation/routes";
export default function LegacyOrganizationTaskCompletedRoute() { const { id = "" } = useLocalSearchParams<{id?: string}>(); return <Redirect href={organizationTaskCompletedRoute(id)} />; }
