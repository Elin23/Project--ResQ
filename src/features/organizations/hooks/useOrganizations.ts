import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { ORGANIZATIONS } from "../constants/organizations";
import { organizationDetailsRoute } from "@/src/navigation/routes";

export function useOrganizations() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const organizations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return ORGANIZATIONS;
    return ORGANIZATIONS.filter((item) =>
      [item.name, item.city, item.country, item.services.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  return {
    query,
    setQuery,
    organizations,
    openOrganization: (id: string) => router.push(organizationDetailsRoute(id)),
  };
}
