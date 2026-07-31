import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import Button from './Button';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/src/theme';

type Props = {
  visible: boolean;               // النافذة ظاهرة؟
  title: string;                  // "هل أنت متأكد؟"
  message: string;                // نص التوضيح
  confirmLabel: string;           // "حذف الآن"
  onConfirm: () => void;
  onCancel: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  icon = 'trash',
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent                   // الخلفية شفافة حتى نتحكم فيها نحنا
      animationType="fade"
      onRequestClose={onCancel}     // زر الرجوع بالأندرويد بيسكر النافذة
    >
      {/* الخلفية المعتمة، الكبس عليها بيسكر */}
      <Pressable style={styles.backdrop} onPress={onCancel}>
        {/* الكرت نفسو، الكبس عليه ما بيسكر (بيوقف انتشار الكبسة) */}
        <Pressable style={styles.dialog} onPress={() => {}}>
          <View style={styles.iconCircle}>
            <Ionicons name={icon} size={22} color={COLORS.danger} />
          </View>

          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.message}>{message}</AppText>

          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <Button title={confirmLabel} variant="danger" onPress={onConfirm} />
            </View>
            <View style={styles.actionButton}>
              <Button title="إلغاء" variant="outline" onPress={onCancel} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000066',      
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  dialog: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.danger + '22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    flex: 1,                            
  },
});