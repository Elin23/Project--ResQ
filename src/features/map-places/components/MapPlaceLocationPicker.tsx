import { StyleSheet, View } from 'react-native';
import AppText from '@/src/components/ui/AppText';
import { COLORS, RADIUS, SPACING } from '@/src/theme';
export type MapPlaceLocationValue = { latitude: number; longitude: number };
type Props = { value: MapPlaceLocationValue; onChange: (value: MapPlaceLocationValue) => void };
export default function MapPlaceLocationPicker({ value }: Props) {
  return <View style={styles.box}><AppText weight="bold">الموقع المحدد</AppText><AppText color={COLORS.textSecondary}>{value.latitude.toFixed(6)}، {value.longitude.toFixed(6)}</AppText><AppText variant="caption" color={COLORS.textMuted}>اختيار العلامة تفاعلي داخل تطبيق iOS وAndroid.</AppText></View>;
}
const styles=StyleSheet.create({box:{minHeight:140,padding:SPACING.lg,borderRadius:RADIUS.lg,borderWidth:1,borderColor:COLORS.border,backgroundColor:COLORS.surfaceSubtle,gap:SPACING.sm,justifyContent:'center'}});
