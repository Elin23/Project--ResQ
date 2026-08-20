import { Redirect, useLocalSearchParams } from "expo-router";
import { organizationTaskDetailsRoute } from "@/src/navigation/routes";
export default function LegacyOrganizationTaskRoute() { const { id = "" } = useLocalSearchParams<{id?: string}>(); return <Redirect href={organizationTaskDetailsRoute(id)} />; }
