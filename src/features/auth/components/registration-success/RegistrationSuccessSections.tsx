import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { RoleContent } from "../../constants/registrationSuccess";
import { registrationSuccessStyles as styles } from "../../screens/RegistrationSuccess.styles";

export function RegistrationBrand() {
  return <View style={styles.brandRow}><Ionicons name="paw" size={22} color="#20201F" /><AppText style={styles.brandText}>Res<AppText style={styles.brandAccent}>Q</AppText></AppText></View>;
}

export function RegistrationHero({ content, displayName }: { content: RoleContent; displayName: string }) {
  return <View style={styles.heroCard}>
    <View style={styles.heroDecorationOne} /><View style={styles.heroDecorationTwo} />
    <View style={styles.heroIconHalo}><View style={styles.heroIconCircle}><Ionicons name={content.heroIcon} size={42} color="#A6511C" /></View><View style={styles.heroCheck}><Ionicons name="checkmark" size={18} color="#FFFFFF" /></View></View>
    <View style={styles.rolePill}><AppText style={styles.rolePillText}>{content.roleLabel}</AppText></View>
    <AppText style={styles.title}>{displayName ? `مرحبًا ${displayName}` : content.welcomeTitle}</AppText>
    <AppText style={styles.description}>{content.welcomeDescription}</AppText>
  </View>;
}

export function AccountStatusCard({ content }: { content: RoleContent }) {
  const active = content.status === "active";
  return <View style={[styles.statusCard, active ? styles.activeStatusCard : styles.pendingStatusCard]}>
    <View style={[styles.statusIcon, active ? styles.activeStatusIcon : styles.pendingStatusIcon]}><Ionicons name={active ? "shield-checkmark" : "time-outline"} size={23} color={active ? "#16833A" : "#B86625"} /></View>
    <View style={styles.statusTextContainer}>
      <View style={styles.statusTitleRow}><AppText style={styles.statusLabel}>حالة الحساب</AppText><View style={[styles.statusDot, active ? styles.activeStatusDot : styles.pendingStatusDot]} /></View>
      <AppText style={[styles.statusTitle, active ? styles.activeStatusTitle : styles.pendingStatusTitle]}>{content.statusTitle}</AppText>
      <AppText style={styles.statusDescription}>{content.statusDescription}</AppText>
    </View>
  </View>;
}

export function CapabilitiesSection({ content }: { content: RoleContent }) {
  return <>
    <View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>{content.capabilitiesTitle}</AppText><AppText style={styles.sectionDescription}>{content.capabilitiesDescription}</AppText></View>
    <View style={styles.capabilitiesCard}>{content.capabilities.map((item, index) => <View key={item.id} style={[styles.capabilityRow, index < content.capabilities.length - 1 && styles.capabilityRowBorder]}>
      <View style={styles.capabilityCheck}><Ionicons name="checkmark" size={16} color="#FFFFFF" /></View>
      <View style={styles.capabilityTextContainer}><View style={styles.capabilityTitleRow}><Ionicons name={item.icon} size={19} color="#19723A" /><AppText style={styles.capabilityTitle}>{item.title}</AppText></View><AppText style={styles.capabilityDescription}>{item.description}</AppText></View>
    </View>)}</View>
  </>;
}

export function ProfileCompletionCard() {
  return <View style={styles.profileCard}><View style={styles.profileIcon}><Ionicons name="person-circle-outline" size={28} color="#59635A" /></View><View style={styles.profileTextContainer}><AppText style={styles.profileTitle}>أكمل بيانات حسابك</AppText><AppText style={styles.profileDescription}>الملف المكتمل يزيد الثقة ويسهّل التواصل</AppText></View><View style={styles.progressContainer}><AppText style={styles.progressText}>60%</AppText><View style={styles.progressTrack}><View style={styles.progressFill} /></View></View></View>;
}

export function RegistrationActions({ content, onPrimary, onSecondary }: { content: RoleContent; onPrimary: () => void; onSecondary: () => void }) {
  return <>
    <Pressable accessibilityRole="button" onPress={onPrimary} style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}><AppText style={styles.primaryButtonText}>{content.primaryButtonTitle}</AppText><Ionicons name="arrow-back-outline" size={21} color="#FFFFFF" /></Pressable>
    {content.secondaryButtonTitle && content.secondaryButtonPathname ? <Pressable accessibilityRole="button" onPress={onSecondary} style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}><AppText style={styles.secondaryButtonText}>{content.secondaryButtonTitle}</AppText></Pressable> : null}
  </>;
}
