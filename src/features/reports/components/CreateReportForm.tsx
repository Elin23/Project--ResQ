import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, type ComponentProps } from "react";
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import AppText from "@/src/components/ui/AppText";
import Screen from "@/src/components/ui/Screen";
import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";


// حالات الحيوان
const ANIMAL_STATUSES = [
  {
    id: "injured",
    label: "مصاب",
    icon: "medical-bag",
    lib: "MaterialCommunityIcons",
  },
  {
    id: "sick",
    label: "مريض",
    icon: "emoticon-sad-outline",
    lib: "MaterialCommunityIcons",
  },
  {
    id: "trapped",
    label: "عالق",
    icon: "lock-outline",
    lib: "MaterialCommunityIcons",
  },
  {
    id: "lost",
    label: "ضائع",
    icon: "help-box-outline",
    lib: "MaterialCommunityIcons",
  },
  { id: "food", label: "يحتاج طعاماً", icon: "utensils", lib: "FontAwesome5" },
  {
    id: "dead",
    label: "متوفى",
    icon: "heart-broken-outline",
    lib: "MaterialCommunityIcons",
  },
];

// درجات الخطورة
const SEVERITY_LEVELS = [
  {
    id: "critical",
    title: "حرجة",
    desc: "الحيوان في خطر داهم ويحتاج تدخل فوري",
    isUrgent: true,
  },
  {
    id: "high",
    title: "عالية",
    desc: "إصابة شديدة تتطلب عناية طبية سريعة",
  },
  {
    id: "medium",
    title: "متوسطة",
    desc: "حالة غير مستقرة ولكن لا تشكل خطراً فورياً",
  },
  {
    id: "low",
    title: "منخفضة",
    desc: "يحتاج مساعدة بسيطة أو توفير طعام",
  },
];

export default function CreateReportForm() {
  const router = useRouter();

  const { isGuest } = useSession();
  const [count, setCount] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("injured");
  const [selectedSeverity, setSelectedSeverity] = useState("medium");
  const [description, setDescription] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [region, setRegion] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const renderStatusIcon = (item: (typeof ANIMAL_STATUSES)[0]) => {
    const iconColor = COLORS.brown;
    if (item.lib === "FontAwesome5") {
      return (
        <FontAwesome5 name={item.icon as ComponentProps<typeof FontAwesome5>["name"]} size={20} color={iconColor} />
      );
    }
    return (
      <MaterialCommunityIcons
        name={item.icon as ComponentProps<typeof MaterialCommunityIcons>["name"]}
        size={24}
        color={iconColor}
      />
    );
  };

  return (
    <Screen safeAreaEdges={["top", "bottom"]} style={styles.screen}>
      <View style={styles.container}>
        {/* Header / الهيدر العلوي */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={COLORS.text}
            />
          </TouchableOpacity>

          <AppText weight="bold" size={18} color={COLORS.text}>
            إرسال بلاغ جديد
          </AppText>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <Ionicons name="arrow-forward" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Stepper / شريط الخطوات */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <AppText color={COLORS.white} weight="bold" size={12}>
                1
              </AppText>
            </View>
            <AppText size={11} color={COLORS.brown} weight="bold">
              المعلومات
            </AppText>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <AppText color={COLORS.textSecondary} size={12}>
                2
              </AppText>
            </View>
            <AppText size={11} color={COLORS.textSecondary}>
              الموقع
            </AppText>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <AppText color={COLORS.textSecondary} size={12}>
                3
              </AppText>
            </View>
            <AppText size={11} color={COLORS.textSecondary}>
              المراجع
            </AppText>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.formScrollView}
        >
          {/* صور الحالة */}
          <AppText
            weight="bold"
            size={14}
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            صور الحالة
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={styles.uploadBox}>
            <View style={styles.uploadIconsRow}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={28}
                color={COLORS.brown}
              />
              <Ionicons
                name="image-outline"
                size={28}
                color={COLORS.brown}
                style={{ marginRight: 8 }}
              />
            </View>
            <AppText
              weight="bold"
              size={13}
              color={COLORS.text}
              style={{ marginTop: 8 }}
            >
              اضغط هنا لرفع الصور
            </AppText>
            <AppText
              size={11}
              color={COLORS.textSecondary}
              style={{ marginTop: 2 }}
            >
              يمكنك رفع حتى 5 صور
            </AppText>
          </TouchableOpacity>

          {/* نوع الحيوان */}
          <AppText
            weight="bold"
            size={14}
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            نوع الحيوان
          </AppText>
          <View style={styles.dropdownBox}>
            <AppText color={COLORS.textSecondary} size={14}>
              اختر النوع
            </AppText>
            <Ionicons
              name="chevron-down"
              size={20}
              color={COLORS.textSecondary}
            />
          </View>

          {/* عدد الحيوانات */}
          <AppText
            weight="bold"
            size={14}
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            عدد الحيوانات
          </AppText>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}
              style={styles.counterBtn}
            >
              <Ionicons name="remove" size={20} color={COLORS.brown} />
            </TouchableOpacity>

            <AppText weight="bold" size={16} color={COLORS.text}>
              {count}
            </AppText>

            <TouchableOpacity
              onPress={() => setCount((prev) => prev + 1)}
              style={styles.counterBtn}
            >
              <Ionicons name="add" size={20} color={COLORS.brown} />
            </TouchableOpacity>
          </View>

          {/* حالة الحيوان */}
          <AppText
            weight="bold"
            size={14}
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            حالة الحيوان
          </AppText>
          <View style={styles.statusGrid}>
            {ANIMAL_STATUSES.map((item) => {
              const isSelected = selectedStatus === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[
                    styles.statusCard,
                    isSelected && styles.statusCardSelected,
                  ]}
                  onPress={() => setSelectedStatus(item.id)}
                >
                  {renderStatusIcon(item)}
                  <AppText
                    size={13}
                    color={COLORS.text}
                    style={{ marginTop: 6 }}
                  >
                    {item.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* درجة الخطورة */}
          <AppText
            weight="bold"
            size={14}
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            درجة الخطورة
          </AppText>
          <View style={styles.severityContainer}>
            {SEVERITY_LEVELS.map((item) => {
              const isSelected = selectedSeverity === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={[
                    styles.severityCardFirstImage,
                    isSelected && styles.severityCardSelected,
                  ]}
                  onPress={() => setSelectedSeverity(item.id)}
                >
                  <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={isSelected ? COLORS.brown : COLORS.brownMuted}
                  />

                  <View style={styles.severityTextWrapper}>
                    <AppText
                      weight="bold"
                      size={14}
                      color={
                        item.isUrgent && !isSelected
                          ? COLORS.urgent
                          : COLORS.text
                      }
                    >
                      {item.title}
                    </AppText>
                    <AppText
                      size={12}
                      color={COLORS.textSecondary}
                      style={{ marginTop: 2, textAlign: "right" }}
                    >
                      {item.desc}
                    </AppText>
                  </View>

                  {item.isUrgent && (
                    <AppText
                      weight="bold"
                      size={20}
                      color={COLORS.urgent}
                      style={styles.urgentAsterisk}
                    >
                      *
                    </AppText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* وصف الحالة */}
          <AppText
            weight="bold"
            size={14}
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            وصف الحالة
          </AppText>
          <View style={styles.textareaContainer}>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="اشرح ما شاهدته بالتفصيل لمساعدتنا في التقييم..."
              placeholderTextColor={COLORS.placeholder}
              value={description}
              onChangeText={setDescription}
              maxLength={500}
              style={styles.textareaInput}
            />
            <AppText
              size={11}
              color={COLORS.textSecondary}
              style={styles.charCounter}
            >
              {description.length} / 500
            </AppText>
          </View>

          {/* الموقع */}
          <AppText
            weight="bold"
            size={14}
            color={COLORS.text}
            style={styles.fieldLabel}
          >
            الموقع
          </AppText>
          <View style={styles.mapCard}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
              >
                <Marker
                  coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                />
              </MapView>
            </View>

            <View style={styles.mapActions}>
              <TouchableOpacity style={styles.currentLocationBtn}>
                <Ionicons
                  name="navigate-outline"
                  size={18}
                  color={COLORS.white}
                />
                <AppText
                  color={COLORS.white}
                  weight="bold"
                  size={14}
                  style={{ marginRight: 6 }}
                >
                  حدد الموقع الحالي
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.mapPickerBtn}>
                <Ionicons name="map-outline" size={18} color={COLORS.brown} />
                <AppText
                  color={COLORS.brown}
                  weight="bold"
                  size={14}
                  style={{ marginRight: 6 }}
                >
                  اختيار من الخريطة
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.privacyNoteRow}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <AppText
                size={11}
                color={COLORS.textSecondary}
                style={{ marginRight: 4, flex: 1, textAlign: "right" }}
              >
                لن يتم مشاركة موقعك الدقيق مع أي جهة، سيستخدم فقط لتوجيه فرق
                الإنقاذ.
              </AppText>
            </View>
          </View>

          {/* معلومات التواصل للزائر */}
          {isGuest && (
            <>
              <AppText
                weight="bold"
                size={14}
                color={COLORS.text}
                style={styles.fieldLabel}
              >
                معلومات التواصل
              </AppText>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="الاسم الكامل"
                  placeholderTextColor={COLORS.placeholder}
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.textInput}
                />
              </View>
              <View style={[styles.inputBox, { marginTop: 10 }]}>
                <TextInput
                  placeholder="+963 --- --- ---"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.textInput}
                />
              </View>
            </>
          )}

          {/* تنبيه هام */}
          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <Ionicons
                name="warning-outline"
                size={20}
                color={COLORS.urgent}
              />
              <AppText
                weight="bold"
                size={14}
                color={COLORS.urgent}
                style={{ marginRight: 6 }}
              >
                تنبيه هام
              </AppText>
            </View>
            <AppText size={12} color={COLORS.urgent} style={styles.warningText}>
              إذا كان الحيوان يشكل خطراً مباشراً على نفسه أو على المارة (على
              طريق سريع مثلاً)، يرجى الاتصال المباشر برقم الطوارئ المتاح في
              واجهة المساعدة.
            </AppText>
          </View>

          {/* زر إرسال البلاغ المعدل */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.submitBtn}
            onPress={() => {
              router.push(ROUTES.reportSuccess);
            }}
          >
            <Ionicons
              name="paper-plane-outline"
              size={20}
              color={COLORS.white}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
            <AppText
              color={COLORS.white}
              weight="bold"
              size={16}
              style={{ marginRight: 8 }}
            >
              إرسال البلاغ
            </AppText>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  container: { flex: 1, paddingHorizontal: SPACING.md },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
  },
  headerBtn: { padding: 4 },
  stepperContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.sm,
    paddingHorizontal: 10,
  },
  stepItem: { alignItems: "center" },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.darkgray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepCircleActive: { backgroundColor: COLORS.brown },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  formScrollView: { flex: 1 },
  fieldLabel: {
    textAlign: "right",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  uploadBox: {
    borderWidth: 1.6,
    borderColor: COLORS.tan,
    borderStyle: "dashed",
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    height: 140,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  uploadIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  dropdownBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  counterBtn: { padding: 4 },
  statusGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  statusCard: {
    width: "48%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    minHeight: 92,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCardSelected: {
    borderColor: COLORS.brown,
    borderWidth: 1.5,
    elevation: 1,
  },
  severityContainer: { gap: 10 },
  severityCardFirstImage: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    padding: 12,
  },
  severityCardSelected: {
    backgroundColor: COLORS.peach,
    borderColor: COLORS.brown,
    borderWidth: 1.5,
  },
  severityTextWrapper: { flex: 1, marginRight: 10 },
  urgentAsterisk: { marginLeft: 6 },
  textareaContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    padding: 12,
    minHeight: 110,
    justifyContent: "space-between",
  },
  textareaInput: {
    textAlign: "right",
    textAlignVertical: "top",
    fontSize: 14,
    color: COLORS.text,
  },
  charCounter: { textAlign: "right", marginTop: 6 },
  mapCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    padding: 10,
    overflow: "hidden",
  },
  mapContainer: {
    height: 180,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapActions: { gap: 8, marginTop: 6 },
  currentLocationBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brown,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 10,
  },
  mapPickerBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.brown,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    width: "100%",
  },
  privacyNoteRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 4,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 8,
  },
  textInput: { textAlign: "right", fontSize: 14, color: COLORS.text },
  warningBox: {
    backgroundColor: COLORS.peach,
    borderRadius: RADIUS.md,
    padding: 14,
    marginTop: 20,
  },
  warningHeader: { flexDirection: "row-reverse", alignItems: "center" },
  warningText: { textAlign: "right", marginTop: 6, lineHeight: 18 },
  submitBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brown,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    marginTop: 20,
  },
});
