import { ScrollView, StyleSheet } from "react-native";

import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import { SearchFilterKey } from "@/src/types/search";
import Button from "@/src/components/ui/Button";

type FilterItem = {
  key: SearchFilterKey;
  label: string;
};

type Props = {
  selectedFilter: SearchFilterKey;
  onFilterChange: (filter: SearchFilterKey) => void;
};

const FILTERS: FilterItem[] = [
  {
    key: "clinics",
    label: "العيادات البيطرية",
  },
  {
    key: "adoption",
    label: "الحيوانات للتبني",
  },
  {
    key: "lost",
    label: "الحيوانات المفقودة",
  },
  {
    key: "all",
    label: "الكل",
  },
];

export default function SearchFilterChips({
  selectedFilter,
  onFilterChange,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      {FILTERS.map((filter) => {
        const isSelected = selectedFilter === filter.key;

        return (
          <Button
            key={filter.key}
            title={filter.label}
            onPress={() => onFilterChange(filter.key)}
            variant="custom"
            size="small"
            fullWidth={false}
            backgroundColor={isSelected ? COLORS.primary : COLORS.background}
            borderColor={isSelected ? COLORS.primary : COLORS.border}
            borderWidth={1}
            textColor={isSelected ? COLORS.white : COLORS.text}
            radius={RADIUS.lg}
            style={styles.button}
            textStyle={[
              styles.buttonText,
              isSelected && styles.selectedButtonText,
            ]}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row-reverse",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  button: {
    minHeight: 40,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  buttonText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.label,
  },
  selectedButtonText: {
    fontFamily: FONTS.medium,
  },
});
