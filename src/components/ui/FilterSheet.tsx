import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import AppText from './AppText';
import Button from './Button';
import Chip from './Chip';
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from '@/src/theme';

export type Filters = {
  animalType: string;
  condition: string;
};

type Props = {
  visible: boolean;
  onApply: (filters: Filters) => void;
  onClose: () => void;
};

const ANIMAL_TYPES = ['الكل', 'قطط', 'كلاب'];
const CONDITIONS = ['إصابة', 'مرض', 'جوع'];

export default function FilterSheet({ visible, onApply, onClose }: Props) {
  const [animalType, setAnimalType] = useState('الكل');
  const [condition, setCondition] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessible={false} style={styles.backdrop} onPress={onClose}>
        <Pressable accessibilityViewIsModal style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <AppText accessibilityRole="header" style={styles.title}>تصفية النتائج</AppText>

          <AppText style={styles.groupLabel}>نوع الحيوان</AppText>
          <View style={styles.chipRow}>
            {ANIMAL_TYPES.map((type) => (
              <Chip
                    key={type}
                    label={type}
                    selected={animalType === type}
                    onPress={() => setAnimalType(type)} color={COLORS.primaryStrong} />
            ))}
          </View>

          <AppText style={styles.groupLabel}>الحالة الصحية</AppText>
          <View style={styles.chipRow}>
            {CONDITIONS.map((c) => (
              <Chip
                    key={c}
                    label={c}
                    selected={condition === c}
                    onPress={() => setCondition(condition === c ? '' : c)} color={COLORS.primaryStrong} />
            ))}
          </View>

          <Button
            title="تطبيق الفلاتر"
            onPress={() => onApply({ animalType, condition })}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    justifyContent: 'flex-end',      
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopStartRadius: RADIUS["2xl"],
    borderTopEndRadius: RADIUS["2xl"],
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
    marginBottom: SPACING.sm,
  },
  groupLabel: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    direction: 'rtl',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
});
