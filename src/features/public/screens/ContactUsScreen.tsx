import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Share,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import { IMAGES } from "@/src/assets/images";
import { MAX_MESSAGE_LENGTH, MESSAGE_TYPES, SOCIAL_ITEMS, SUPPORT_EMAIL, SUPPORT_PHONE } from "../constants/contact";
import { useContactUsForm } from "../hooks/useContactUsForm";
import { styles } from "./ContactUs.styles";

export default function ContactUsScreen() {
  const form = useContactUsForm();
  const {
    fullName, setFullName, email, setEmail, subject, setSubject,
    messageType, setMessageType, message, setMessage, attachmentUri,
    setAttachmentUri, typeModalVisible, setTypeModalVisible, errors, setErrors,
    isSubmitting, horizontalPadding, contentWidth, remainingCharacters,
    handleBack, handleHelpCenter, openExternalUrl, handleEmail, handlePhone, handlePickImage, handleSubmit,
  } = form;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مشاركة صفحة التواصل"
            hitSlop={10}
            onPress={() =>
              void Share.share({
                title: "تواصل معنا - ResQ",
                message:
                  "يمكنك التواصل مع فريق ResQ عبر صفحة التواصل داخل التطبيق.",
              })
            }
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="share-social-outline" size={23} color="#25211F" />
          </Pressable>

          <AppText style={styles.topBarTitle}>تواصل معنا</AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="العودة"
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-forward-outline" size={25} color="#25211F" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.content, { width: contentWidth }]}>
            <Image
              source={IMAGES.helpCenterHero}
              resizeMode="cover"
              style={styles.heroImage}
            />

            <View style={styles.heroTextWrap}>
              <AppText style={styles.heroTitle}>يسعدنا التواصل معك</AppText>
              <AppText style={styles.heroDescription}>
                إذا كان لديك سؤال أو اقتراح أو واجهت مشكلة، يسعد فريق ResQ
                بمساعدتك.
              </AppText>
            </View>

            <View style={styles.formCard}>
              <View style={styles.fieldGroup}>
                <AppText style={styles.label}>الاسم الكامل</AppText>

                <TextInput
                  value={fullName}
                  onChangeText={(value) => {
                    setFullName(value);
                    setErrors((current) => ({ ...current, name: undefined }));
                  }}
                  placeholder="أدخل اسمك هنا"
                  placeholderTextColor="#99918B"
                  style={[styles.input, errors.name ? styles.inputError : null]}
                />

                {errors.name ? (
                  <AppText style={styles.errorText}>{errors.name}</AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <AppText style={styles.label}>البريد الإلكتروني</AppText>

                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setErrors((current) => ({ ...current, email: undefined }));
                  }}
                  placeholder="example@mail.com"
                  placeholderTextColor="#99918B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    styles.ltrInput,
                    errors.email ? styles.inputError : null,
                  ]}
                />

                {errors.email ? (
                  <AppText style={styles.errorText}>{errors.email}</AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <AppText style={styles.label}>الموضوع</AppText>

                <TextInput
                  value={subject}
                  onChangeText={(value) => {
                    setSubject(value);
                    setErrors((current) => ({
                      ...current,
                      subject: undefined,
                    }));
                  }}
                  placeholder="عنوان الرسالة"
                  placeholderTextColor="#99918B"
                  style={[
                    styles.input,
                    errors.subject ? styles.inputError : null,
                  ]}
                />

                {errors.subject ? (
                  <AppText style={styles.errorText}>{errors.subject}</AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <AppText style={styles.label}>نوع الرسالة</AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="اختيار نوع الرسالة"
                  onPress={() => setTypeModalVisible(true)}
                  style={({ pressed }) => [
                    styles.selectInput,
                    errors.messageType ? styles.inputError : null,
                    pressed && styles.fieldPressed,
                  ]}
                >
                  <AppText
                    style={[
                      styles.selectText,
                      !messageType && styles.selectPlaceholder,
                    ]}
                  >
                    {messageType?.label ?? "اختر نوع الرسالة"}
                  </AppText>

                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="#776E68"
                  />
                </Pressable>

                {errors.messageType ? (
                  <AppText style={styles.errorText}>
                    {errors.messageType}
                  </AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.messageLabelRow}>
                  <AppText style={styles.label}>رسالتك</AppText>

                  <AppText
                    style={[
                      styles.counterText,
                      remainingCharacters < 0 && styles.counterError,
                    ]}
                  >
                    {message.length} / {MAX_MESSAGE_LENGTH}
                  </AppText>
                </View>

                <TextInput
                  value={message}
                  onChangeText={(value) => {
                    if (value.length <= MAX_MESSAGE_LENGTH) {
                      setMessage(value);
                    }

                    setErrors((current) => ({
                      ...current,
                      message: undefined,
                    }));
                  }}
                  placeholder="اكتب رسالتك هنا بالتفصيل..."
                  placeholderTextColor="#99918B"
                  multiline
                  textAlignVertical="top"
                  style={[
                    styles.messageInput,
                    errors.message ? styles.inputError : null,
                  ]}
                />

                {errors.message ? (
                  <AppText style={styles.errorText}>{errors.message}</AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroupLast}>
                <AppText style={styles.label}>إرفاق صورة (اختياري)</AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="اختيار صورة"
                  onPress={handlePickImage}
                  style={({ pressed }) => [
                    styles.uploadBox,
                    pressed && styles.fieldPressed,
                  ]}
                >
                  {attachmentUri ? (
                    <Image
                      source={{ uri: attachmentUri }}
                      resizeMode="cover"
                      style={styles.attachmentPreview}
                    />
                  ) : (
                    <>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={34}
                        color="#B64E00"
                      />
                      <AppText style={styles.uploadTitle}>
                        اضغط لرفع الملفات
                      </AppText>
                      <AppText style={styles.uploadHint}>
                        JPG, PNG, WEBP
                      </AppText>
                    </>
                  )}
                </Pressable>

                {attachmentUri ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="إزالة الصورة"
                    onPress={() => setAttachmentUri(null)}
                    style={({ pressed }) => [
                      styles.removeAttachmentButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name="trash-outline" size={17} color="#C73732" />
                    <AppText style={styles.removeAttachmentText}>
                      إزالة الصورة
                    </AppText>
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View style={styles.helpCard}>
              <AppText style={styles.helpTitle}>ربما تجد إجابتك هنا</AppText>

              <AppText style={styles.helpDescription}>
                تصفح الأسئلة الشائعة والمقالات الإرشادية في مركز المساعدة.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى مركز المساعدة"
                onPress={handleHelpCenter}
                style={({ pressed }) => [
                  styles.helpButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="help-buoy-outline" size={18} color="#AD4B18" />
                <AppText style={styles.helpButtonText}>
                  الانتقال إلى مركز المساعدة
                </AppText>
              </Pressable>
            </View>

            <View style={styles.contactInfoCard}>
              <AppText style={styles.sectionTitle}>معلومات التواصل</AppText>

              <Pressable
                accessibilityRole="link"
                accessibilityLabel="إرسال بريد إلكتروني"
                onPress={handleEmail}
                style={({ pressed }) => [
                  styles.contactInfoRow,
                  pressed && styles.rowPressed,
                ]}
              >
                <View style={styles.contactIconOrange}>
                  <Ionicons name="mail-outline" size={21} color="#B64E00" />
                </View>

                <View style={styles.contactTextWrap}>
                  <AppText style={styles.contactLabel}>
                    البريد الإلكتروني
                  </AppText>
                  <AppText style={styles.contactValueLTR}>
                    {SUPPORT_EMAIL}
                  </AppText>
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="link"
                accessibilityLabel="الاتصال برقم الدعم"
                onPress={handlePhone}
                style={({ pressed }) => [
                  styles.contactInfoRow,
                  pressed && styles.rowPressed,
                ]}
              >
                <View style={styles.contactIconGreen}>
                  <Ionicons name="call-outline" size={21} color="#18833B" />
                </View>

                <View style={styles.contactTextWrap}>
                  <AppText style={styles.contactLabel}>رقم الهاتف</AppText>
                  <AppText style={styles.contactValueLTR}>
                    {SUPPORT_PHONE}
                  </AppText>
                </View>
              </Pressable>

              <View style={styles.contactInfoRow}>
                <View style={styles.contactIconNeutral}>
                  <Ionicons name="time-outline" size={21} color="#6A625D" />
                </View>

                <View style={styles.contactTextWrap}>
                  <AppText style={styles.contactLabel}>ساعات الدعم</AppText>
                  <AppText style={styles.contactValue}>
                    الأحد - الخميس | 09:00 - 17:00
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.socialCard}>
              <AppText style={styles.sectionTitle}>تابعنا</AppText>

              <View style={styles.socialGrid}>
                {SOCIAL_ITEMS.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="link"
                    accessibilityLabel={item.label}
                    onPress={() => void openExternalUrl(item.url)}
                    style={({ pressed }) => [
                      styles.socialItem,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.socialIcon}>
                      <Ionicons name={item.icon} size={21} color="#5F5955" />
                    </View>

                    <AppText style={styles.socialLabel}>{item.label}</AppText>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إرسال الرسالة"
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitPressed,
                isSubmitting && styles.submitDisabled,
              ]}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />

              <AppText style={styles.submitButtonText}>
                {isSubmitting ? "جارٍ الإرسال..." : "إرسال الرسالة"}
              </AppText>
            </Pressable>
          </View>
        </ScrollView>

        <Modal
          visible={typeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTypeModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setTypeModalVisible(false)}
          >
            <Pressable
              style={[styles.typeModalCard, { width: contentWidth }]}
              onPress={() => undefined}
            >
              <View style={styles.modalHeader}>
                <AppText style={styles.modalTitle}>اختر نوع الرسالة</AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="إغلاق"
                  onPress={() => setTypeModalVisible(false)}
                  style={({ pressed }) => [
                    styles.modalCloseButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="close" size={21} color="#3D3733" />
                </Pressable>
              </View>

              {MESSAGE_TYPES.map((item, index) => {
                const isSelected = messageType?.id === item.id;

                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setMessageType(item);
                      setErrors((current) => ({
                        ...current,
                        messageType: undefined,
                      }));
                      setTypeModalVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.typeOption,
                      index < MESSAGE_TYPES.length - 1 &&
                        styles.typeOptionBorder,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <Ionicons
                      name={
                        isSelected
                          ? "radio-button-on"
                          : "radio-button-off-outline"
                      }
                      size={21}
                      color={isSelected ? "#B64E00" : "#8B837D"}
                    />

                    <AppText style={styles.typeOptionText}>
                      {item.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
