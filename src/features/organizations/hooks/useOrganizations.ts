import { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { organizationDetailsRoute } from "@/src/navigation/routes";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { fetchOrganizations } from "@/src/services/api/organizationsApi";

export function useOrganizations() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const load = useCallback(() => fetchOrganizations(), []);
  const state = useAsyncResource(load, [], "تعذر تحميل الجمعيات. تحقق من الاتصال ثم حاول مرة أخرى.", { cacheKey: "public-organizations", refreshOnForeground: true });
  const organizations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return state.data;
    return state.data.filter((item) => [item.name, item.city, item.country, item.services.join(" ")].join(" ").toLowerCase().includes(normalized));
  }, [query, state.data]);
  return { query, setQuery, organizations, loading: state.loading, refreshing: state.refreshing, error: state.error, refreshError: state.refreshError, reload: state.reload, openOrganization: (id: string) => router.push(organizationDetailsRoute(id)) };
}
