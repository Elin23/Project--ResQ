import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { COLORS, FONT_SIZES, SPACING } from '@/src/theme';

type Props = {
  label: string;
  color?: string;                      
  icon?: keyof typeof Ionicons.glyphMap;
  soft?: boolean;                        
  selected?: boolean;                     
  onPress?: () => void;                    
};

export default function Chip({
  label,
  color = COLORS.primary,
  icon,
  soft = false,
  selected,
  onPress,
}: Props) {
  const isFilled = onPress ? selected : !soft;

  const backgroundColor = isFilled ? color : color + '22';
  const contentColor = isFilled ? '#FFFFFF' : color;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}                 
      style={[styles.chip, { backgroundColor }]}
    >
      {icon && <Ionicons name={icon} size={14} color={contentColor} />}
      <AppText style={[styles.label, { color: contentColor }]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    borderRadius: 20,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.label,
  },
});