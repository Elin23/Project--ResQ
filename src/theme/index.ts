/**
 * ResQ Design System 2.0
 *
 * Raw palette values live in PALETTE. Product code should prefer semantic COLORS,
 * TYPOGRAPHY, SPACING, RADIUS, CONTROL_SIZES, ICON_SIZES and SHADOWS.
 */
export const PALETTE = {
  orange50: "#FFF7F2",
  orange100: "#FFF0E8",
  orange200: "#FFD8C2",
  orange300: "#FFB68D",
  orange400: "#FF9B63",
  orange500: "#FF8849",
  orange600: "#E66F30",
  orange700: "#B64E00",
  orange800: "#8B3B00",
  orange900: "#603016",

  green50: "#EFF9EF",
  green100: "#E7FAE9",
  green200: "#B9D7C1",
  green300: "#94F990",
  green500: "#48B857",
  green600: "#18833B",
  green700: "#16833A",
  green800: "#006E1C",

  blue50: "#EAF7FD",
  blue100: "#E4F5FC",
  blue300: "#A9DDF1",
  blue500: "#2BB5F6",
  blue800: "#00658D",
  blue900: "#004360",

  red50: "#FFF5F5",
  red500: "#C92335",
  red600: "#D32F2F",
  red700: "#BA1A1A",

  amber50: "#FFF2D9",
  amber300: "#FFD08C",
  amber500: "#FFB020",
  amber700: "#C2410C",

  neutral0: "#FFFFFF",
  neutral25: "#FFFFFF",
  neutral50: "#F9F8FC",
  neutral75: "#FFFFFF",
  neutral100: "#F3F3F6",
  neutral150: "#EFEFF1",
  neutral200: "#E8E8EA",
  neutral250: "#E4E1DF",
  neutral300: "#E2E2E5",
  neutral400: "#BDBDBD",
  neutral500: "#9E9E9E",
  neutral550: "#7C8A80",
  neutral600: "#777B75",
  neutral650: "#646A64",
  neutral700: "#4D514A",
  neutral800: "#332D2A",
  neutral900: "#1A1A1A",
  neutral950: "#000000",
} as const;

export const COLORS = {
  // Brand
  primary: PALETTE.orange500,
  primaryPressed: PALETTE.orange600,
  primaryStrong: PALETTE.orange700,
  primarySoft: PALETTE.orange100,
  secondary: PALETTE.green500,
  secondaryStrong: PALETTE.green600,
  secondarySoft: PALETTE.green50,
  accent: PALETTE.blue500,

  // Surfaces
  background: PALETTE.neutral0,
  surface: PALETTE.neutral0,
  surfaceSubtle: PALETTE.neutral0,
  surfaceMuted: PALETTE.neutral100,
  surfaceElevated: PALETTE.neutral0,

  // Content
  text: PALETTE.neutral900,
  textSecondary: PALETTE.neutral700,
  textMuted: PALETTE.neutral650,
  textInverse: PALETTE.neutral0,
  icon: PALETTE.neutral800,
  iconMuted: PALETTE.neutral600,
  placeholder: PALETTE.neutral500,

  // Borders / disabled
  border: PALETTE.neutral300,
  borderStrong: PALETTE.neutral400,
  divider: PALETTE.neutral200,
  disabled: PALETTE.neutral400,
  disabledSurface: PALETTE.neutral150,

  // Status
  success: PALETTE.green600,
  successSoft: PALETTE.green50,
  danger: PALETTE.red600,
  dangerSoft: PALETTE.red50,
  warning: PALETTE.amber700,
  warningSoft: PALETTE.amber50,
  info: PALETTE.blue500,
  infoSoft: PALETTE.blue50,

  // Generic
  white: PALETTE.neutral0,
  black: PALETTE.neutral950,
  transparent: "transparent",
  backdrop: "#00000066",
  glassSurface: "rgba(248,249,248,0.54)",
  glassSurfaceIos: "rgba(248,249,248,0.58)",
  glassSurfaceAndroid: "rgba(248,249,248,0.70)",
  glassBorder: "rgba(255,255,255,0.72)",
  glassActive: "rgba(255,136,73,0.16)",
  shadow: PALETTE.neutral950,
  onColor: PALETTE.neutral0,

  // Compatibility aliases - migrate feature code gradually to semantic tokens.
  neutral: PALETTE.neutral300,
  lightgray: PALETTE.neutral100,
  darkgray: PALETTE.neutral200,
  brown: PALETTE.orange700,
  brownDark: PALETTE.orange900,
  bgblue: PALETTE.blue800,
  textblue: PALETTE.blue500,
  bggreen: PALETTE.green800,
  textgreen: PALETTE.green800,
  strengthStrong: PALETTE.green600,
  strengthMedium: "#E38A2E",
  strengthWeak: PALETTE.red500,
  statusPending: PALETTE.orange500,
  statusPendingLight: "#FFE7A8",
  orgStatOrangeBg: PALETTE.orange100,
  orgStatOrangeBorder: "#FFC9AE",
  orgStatGreenBg: PALETTE.green100,
  orgStatGreenBorder: "#A6E7AE",
  orgStatBlueBg: PALETTE.blue100,
  orgStatBlueBorder: PALETTE.blue300,
  orgStatYellowBg: PALETTE.amber50,
  orgStatYellowBorder: PALETTE.amber300,
  contactPhoneBg: PALETTE.orange100,
  contactEmailBg: "#E9F7FD",
  orgDashboardHeroBg: "#FFF2EA",
  orgDashboardHeroBorder: "#F3CDB8",
  orgDashboardHeroMark: "#F3E4DD",
  orgAchievementGreenBg: PALETTE.green50,
  orgAchievementGreenBorder: "#B8E3BC",
  orgAchievementOrangeBg: "#FFF3EA",
  orgAchievementOrangeBorder: "#FFD0B5",
  orgAchievementBlueBg: PALETTE.blue50,
  orgAchievementBlueBorder: "#B3E2F6",
  orgAchievementLockedBg: "#F3F1F1",
  orgAchievementLockedBorder: "#DCC7BA",
  statusApproved: PALETTE.blue500,
  statusClosed: PALETTE.green500,
  rescueSoft: "#FFF5F0",
  rescueBorder: "#EFCFBE",
  rescueDangerSoft: PALETTE.red50,
  rescueMapOverlay: "#FFF8F3",
  rescueSuccess: PALETTE.green500,
  rescueSuccessSoft: "#E9F8EB",
  rescueInput: "#F4F4F7",
  rating: PALETTE.amber500,
  urgent: PALETTE.red700,
  peach: PALETTE.orange300,
  brownMuted: "#564338",
  ink: "#1A1C1E",
  navy: PALETTE.blue900,
  tan: "#DDC1B3",
  offwhite: "#EEEEF0",
  successDark: "#00731E",
  successLight: PALETTE.green300,
} as const;


export const SCREEN_SURFACES = {
  /** Canonical product canvas used by normal app/workspace screens. */
  app: COLORS.background,
  /** White canvas reserved for auth/onboarding and intentionally immersive flows. */
  plain: COLORS.background,
  elevated: COLORS.background,
  subtle: COLORS.background,
} as const;

export type ScreenSurface = keyof typeof SCREEN_SURFACES;

export const ACCESSIBILITY = {
  /** Keep Arabic Dynamic Type useful without allowing labels to destroy navigation/layout chrome. */
  textMaxFontSizeMultiplier: 1.8,
  controlTextMaxFontSizeMultiplier: 1.6,
} as const;

export const ARABIC_LAYOUT = {
  direction: "rtl" as const,
  textAlign: "right" as const,
  /** Logical start/end values used by components that support them. */
  start: "right" as const,
  end: "left" as const,
} as const;

export const FONTS = {
  regular: "IBMPlexSansArabic_400Regular",
  medium: "IBMPlexSansArabic_500Medium",
  bold: "IBMPlexSansArabic_700Bold",
} as const;

/** Backwards-compatible raw font sizes. Prefer TYPOGRAPHY in new code. */
export const FONT_SIZES = {
  displayLarge: 30,
  headline: 21,
  title: 17,
  body: 14,
  label: 12,
  caption: 11,
} as const;

/**
 * Arabic-first type scale. Line heights deliberately stay generous enough for
 * IBM Plex Sans Arabic ascenders/descenders while keeping cards compact.
 */
export const TYPOGRAPHY = {
  display: { fontSize: 30, lineHeight: 39, fontFamily: FONTS.bold },
  h1: { fontSize: 22, lineHeight: 31, fontFamily: FONTS.bold },
  h2: { fontSize: 19, lineHeight: 28, fontFamily: FONTS.bold },
  h3: { fontSize: 17, lineHeight: 25, fontFamily: FONTS.medium },
  bodyLarge: { fontSize: 15, lineHeight: 23, fontFamily: FONTS.regular },
  body: { fontSize: 14, lineHeight: 22, fontFamily: FONTS.regular },
  bodySmall: { fontSize: 13, lineHeight: 20, fontFamily: FONTS.regular },
  label: { fontSize: 12, lineHeight: 18, fontFamily: FONTS.medium },
  caption: { fontSize: 11, lineHeight: 17, fontFamily: FONTS.regular },
} as const;

export type TypographyVariant = keyof typeof TYPOGRAPHY;

export const SPACING = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
} as const;

export const RADIUS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 999,
} as const;

export const CONTROL_SIZES = {
  buttonSmall: 44,
  buttonMedium: 46,
  buttonLarge: 50,
  input: 50,
  inputMultiline: 104,
  iconButton: 44,
  topBar: 58,
  tabBar: 68,
} as const;

export const NAVIGATION = {
  horizontalInset: 16,
  bottomInsetMin: 8,
  maxWidth: 720,
  barRadius: 24,
  barHorizontalPadding: 8,
  barVerticalPadding: 6,
  itemMinHeight: 56,
  iconSlotSize: 30,
  activeIndicatorWidth: 24,
  activeIndicatorHeight: 3,
  quickActionGap: 12,
} as const;

export const DENSITY = {
  narrowScreenBreakpoint: 360,
  compactScreenBreakpoint: 380,
  shortScreenBreakpoint: 700,
  compactScreenPadding: 12,
  screenVerticalPadding: 12,
  compactScreenVerticalPadding: 8,
  cardPadding: 14,
  compactCardPadding: 12,
  sectionGap: 20,
  itemGap: 10,
  controlGap: 8,
  touchTargetMin: 44,
  quickActionMinHeight: 96,
  quickActionIcon: 44,
  readingMaxWidth: 620,
} as const;

export const ICON_SIZES = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

export const LAYOUT = {
  screenPadding: 16,
  contentMaxWidth: 720,
  sectionGap: DENSITY.sectionGap,
  cardGap: DENSITY.itemGap,
} as const;


export const MOTION = {
  duration: {
    instant: 120,
    fast: 180,
    standard: 280,
    expressive: 420,
    slow: 650,
  },
  launch: {
    minimumVisible: 2400,
    exit: 320,
    progress: 2100,
  },
  onboarding: {
    initialEnter: 420,
    slideOut: 180,
    slideIn: 320,
    completionExit: 300,
  },
} as const;

export const SHADOWS = {
  none: {},
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;
