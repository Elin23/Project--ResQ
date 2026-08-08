import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import AppText from "@/src/components/ui/AppText";
import IconButton from "@/src/components/ui/IconButton";
import Screen from "@/src/components/ui/Screen";
import { reportDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from "@/src/theme";
import NotificationCard from "../components/NotificationCard";
import { NOTIFICATION_FILTERS, NOTIFICATION_SECTIONS, type NotificationFilter, type NotificationItem } from "../constants/notifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>("all");
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

  const sections = useMemo(() => NOTIFICATION_SECTIONS.map((section) => ({
    ...section,
    data: section.data
      .filter((item) => selectedFilter === "all" || item.category === selectedFilter)
      .map((item) => ({ ...item, unread: item.unread && !readIds.has(item.id) })),
  })).filter((section) => section.data.length > 0), [readIds, selectedFilter]);

  const openNotification = (item: NotificationItem) => {
    setReadIds((current) => new Set(current).add(item.id));
    if (item.category === "reports" && item.targetId) {
      router.push(reportDetailsRoute(item.targetId));
      return;
    }
    if (item.category === "adoption") {
      router.push(ROUTES.adoptionList);
      return;
    }
    router.push(ROUTES.organizations);
  };

  const markAllRead = () => {
    setReadIds(new Set(NOTIFICATION_SECTIONS.flatMap((section) => section.data.map((item) => item.id))));
  };

  return (
    <Screen scroll padded={false} backgroundColor={COLORS.surface} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <IconButton icon="options-outline" accessibilityLabel="فلترة الإشعارات" onPress={() => undefined} />
          <IconButton icon="checkmark-done" accessibilityLabel="تحديد الكل كمقروء" onPress={markAllRead} />
        </View>
        <AppText weight="bold" size={FONT_SIZES.headline}>الإشعارات</AppText>
        <IconButton icon="arrow-forward" accessibilityLabel="رجوع" onPress={() => router.back()} />
      </View>

      <View style={styles.filters}>
        {NOTIFICATION_FILTERS.map((filter) => {
          const active = selectedFilter === filter.id;
          return (
            <Pressable
              key={filter.id}
              accessibilityRole="button"
              onPress={() => setSelectedFilter(filter.id)}
              style={({ pressed }) => [styles.filter, active && styles.filterActive, pressed && styles.filterPressed]}
            >
              <AppText weight={active ? "bold" : "regular"} color={active ? COLORS.onColor : COLORS.textSecondary}>
                {filter.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.list}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <AppText weight="medium" color={COLORS.textMuted} style={styles.sectionTitle}>{section.title}</AppText>
            {section.data.map((item) => <NotificationCard key={item.id} item={item} onPress={() => openNotification(item)} />)}
          </View>
        ))}
        {sections.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={42} color={COLORS.iconMuted} />
            <AppText weight="bold">لا توجد إشعارات ضمن هذا التصنيف</AppText>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: SPACING.xl },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  headerActions: { flexDirection: "row", gap: SPACING.sm },
  filters: { flexDirection: "row-reverse", gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  filter: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.darkgray },
  filterActive: { backgroundColor: COLORS.primary },
  filterPressed: { opacity: 0.8 },
  list: { paddingHorizontal: SPACING.md },
  section: { marginBottom: SPACING.md },
  sectionTitle: { fontFamily: FONTS.medium, textAlign: "right", marginBottom: SPACING.sm },
  empty: { alignItems: "center", gap: SPACING.md, paddingVertical: SPACING.xl },
});
