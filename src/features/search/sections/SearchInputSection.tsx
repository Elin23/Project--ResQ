import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import { COLORS } from "@/src/theme";
import type { SearchScreenController } from "../hooks/useSearchScreen";
import { styles } from "../screens/Search.styles";

type Props = { controller: SearchScreenController };
export default function SearchInputSection({ controller }: Props) {
  return <View style={styles.searchContainer}><View style={styles.searchBox}>
    <Ionicons name="search-outline" size={21} color={COLORS.textSecondary} />
    <TextInput ref={controller.searchInputRef} value={controller.searchQuery} onChangeText={controller.setSearchQuery} placeholder="ابحث عن حيوان أو عيادة..." placeholderTextColor={COLORS.textSecondary} returnKeyType="search" autoFocus style={styles.searchInput} />
    {controller.searchQuery.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="مسح البحث" onPress={controller.clearSearch} hitSlop={8} style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}><Ionicons name="close-circle" size={20} color={COLORS.textSecondary} /></Pressable>}
  </View></View>;
}
