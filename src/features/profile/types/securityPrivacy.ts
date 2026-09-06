import { Ionicons } from "@expo/vector-icons";

/** نسختا الشاشة: حساب شخصي وحساب جمعية. المحتوى يختلف، والبنية واحدة. */
export type SecurityPrivacyVariant = "user" | "organization";

export type ProtectionToggleId = "twoFactor" | "loginAlerts";

export type PrivacyToggleId =
  | "publicProfile"
  | "showPhone"
  | "shareLocation"
  | "allowMessages";

export type SecurityToggleId = ProtectionToggleId | PrivacyToggleId;

export type SecurityToggleDefinition = {
  id: SecurityToggleId;
  label: string;
  description: string;
};

export type SecurityPrivacySettings = Record<SecurityToggleId, boolean>;

export type SecurityPrivacyContent = {
  title: string;
  subtitle: string;
  passwordSectionTitle: string;
  passwordSectionSubtitle: string;
  protectionSectionTitle: string;
  protectionSectionSubtitle: string;
  protectionToggles: SecurityToggleDefinition[];
  privacySectionTitle: string;
  privacySectionSubtitle: string;
  privacyToggles: SecurityToggleDefinition[];
  sessionsSectionTitle: string;
  sessionsSectionSubtitle: string;
  signOutAllMessage: string;
  dataSectionTitle: string;
  dataSectionSubtitle: string;
  privacyPolicyLabel: string;
  privacyPolicyIcon: keyof typeof Ionicons.glyphMap;
};

export type PasswordFormErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};
