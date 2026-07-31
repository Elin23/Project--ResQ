import { View } from "react-native";
import AppText from "./AppText";
import { COLORS, FONT_SIZES } from "@/src/theme";

type Props = { title: string };
export default function ComingSoonScreen({ title }: Props) {
  return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}><AppText size={FONT_SIZES.title} weight="bold">{title}</AppText><AppText color={COLORS.textSecondary}>قريبًا</AppText></View>;
}
