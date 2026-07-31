import { View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import EmptyState from "@/src/components/ui/EmptyState";
import { COLORS, FONT_SIZES } from "@/src/theme";
import SearchResultCard from "../components/SearchResultCard";
import type { SearchScreenController } from "../hooks/useSearchScreen";
import { styles } from "../screens/Search.styles";

type Props = { controller: SearchScreenController };

export default function SearchResultsSection({ controller }: Props) {
  const { filteredResults, handleResultPress } = controller;

  return (
    <>
      <View style={styles.sectionHeader}>
        <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
          تم العثور على {filteredResults.length} نتائج
        </AppText>
        <AppText weight="bold" size={FONT_SIZES.title}>
          نتائج البحث
        </AppText>
      </View>

      {filteredResults.length > 0 ? (
        filteredResults.map((result) => (
          <SearchResultCard
            key={result.id}
            result={result}
            onPress={() => handleResultPress(result)}
          />
        ))
      ) : (
        <EmptyState
          title="لا توجد نتائج"
          description="جرّب البحث باستخدام كلمة أخرى أو اختيار تصنيف مختلف."
          icon="search-outline"
          style={styles.emptyState}
        />
      )}
    </>
  );
}
