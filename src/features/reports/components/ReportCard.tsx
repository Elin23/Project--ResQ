import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '@/src/components/ui/Card';
import Chip from '@/src/components/ui/Chip';
import AppText from '@/src/components/ui/AppText';
import Button from '@/src/components/ui/Button';
import { Report } from '@/src/types';
import { COLORS, FONT_SIZES, FONTS, SPACING } from '@/src/theme';

type Props = {
  report: Report;
  onHelpPress: () => void;
};

const STATUS_CONFIG = {
  pending: { label: 'قيد الانتظار', color: COLORS.statusPending },
  approved: { label: 'عاجل', color: COLORS.danger },
  closed: { label: 'مغلق', color: COLORS.statusClosed },
};

export default function ReportCard({ report, onHelpPress }: Props) {
  const status = STATUS_CONFIG[report.status];

  return (
    <Card>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: report.imageUrl }} style={styles.image} />
        <View style={styles.chipOverlay}>
          <Chip label={status.label} color={status.color} />
        </View>
      </View>

      <View style={styles.body}>
        <AppText style={styles.title}>{report.description}</AppText>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={COLORS.textSecondary} />
          <AppText style={styles.location}>حي المزة، دمشق</AppText>
        </View>

        <Button title="استجابة" variant="primary" onPress={onHelpPress} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 180,
  },
  chipOverlay: {
    position: 'absolute',
    top: SPACING.sm,
    start: SPACING.sm,           
  },
  body: {
    width: '100%',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  location: {
    fontSize: FONT_SIZES.label,
    color: COLORS.textSecondary,
  },
  imageWrapper: {
    width: '100%',
  },
});