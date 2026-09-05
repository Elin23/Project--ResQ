import { Appearance } from "react-native";

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
  // Dark ramp. Added for the dark scheme; every light value above is untouched.
  darkBg: "#121116",
  darkSurface: "#1F1E25",
  darkSurfaceMuted: "#26242D",
  darkSurfaceElevated: "#2C2A34",
  darkBorder: "#35323E",
  darkBorderStrong: "#474352",
  darkDivider: "#2B2934",
  darkDisabled: "#55515F",
  darkText: "#ECEBEF",
  darkTextSecondary: "#B6B2C0",
  darkTextMuted: "#8F8B99",
  darkPlaceholder: "#7A7684",
  darkIcon: "#DCD9E3",
  darkIconMuted: "#9C98A6",
} as const;

/**
 * Which palette this JS bundle booted with.
 *
 * COLORS is a plain object, and most of its call sites sit inside module-level
 * StyleSheet.create blocks that JavaScript evaluates once, at import time. That makes
 * the scheme a boot-time decision rather than a render-time one: the app follows the
 * OS setting and picks up a change the next time it launches.
 */
const bootScheme = Appearance.getColorScheme();
export const COLOR_SCHEME: "light" | "dark" = bootScheme === "dark" ? "dark" : "light";
const isDark = COLOR_SCHEME === "dark";

/** Reads the left value in the light scheme, the right one in the dark scheme. */
const pick = <T,>(light: T, dark: T): T => (isDark ? dark : light);

export const COLORS = {
  // Brand
  primary: pick(PALETTE.orange500, PALETTE.orange400),
  primaryPressed: pick(PALETTE.orange600, PALETTE.orange500),
  primaryStrong: pick(PALETTE.orange700, PALETTE.orange300),
  primarySoft: pick(PALETTE.orange100, "#35220F"),
  secondary: pick(PALETTE.green500, "#5FD07B"),
  secondaryStrong: pick(PALETTE.green600, "#7EDC94"),
  secondarySoft: pick(PALETTE.green50, "#14251A"),
  accent: pick(PALETTE.blue500, "#5CC8F7"),

  // Saturated fills, split out from the brand/status tokens above: one value cannot
  // clear 4.5:1 against both the dark canvas and the white label it carries. Each
  // light value is identical to the token it was split from, so the light scheme
  // renders exactly as it did before.
  primaryFill: pick(PALETTE.orange500, "#B8551C"),
  primaryStrongFill: pick(PALETTE.orange700, "#BD5416"),
  secondaryStrongFill: pick(PALETTE.green600, "#1C7038"),
  dangerFill: pick(PALETTE.red600, "#B3332C"),
  successFill: pick(PALETTE.green600, "#1C7038"),
  successDarkFill: pick("#00731E", "#16652E"),

  // Surfaces
  background: pick(PALETTE.neutral0, PALETTE.darkBg),
  surface: pick(PALETTE.neutral0, PALETTE.darkSurface),
  surfaceSubtle: pick(PALETTE.neutral0, PALETTE.darkSurface),
  surfaceMuted: pick(PALETTE.neutral100, PALETTE.darkSurfaceMuted),
  surfaceElevated: pick(PALETTE.neutral0, PALETTE.darkSurfaceElevated),

  // Content
  text: pick(PALETTE.neutral900, PALETTE.darkText),
  textSecondary: pick(PALETTE.neutral700, PALETTE.darkTextSecondary),
  textMuted: pick(PALETTE.neutral650, PALETTE.darkTextMuted),
  textInverse: PALETTE.neutral0,
  icon: pick(PALETTE.neutral800, PALETTE.darkIcon),
  iconMuted: pick(PALETTE.neutral600, PALETTE.darkIconMuted),
  placeholder: pick(PALETTE.neutral500, PALETTE.darkPlaceholder),

  // Borders / disabled
  border: pick(PALETTE.neutral300, PALETTE.darkBorder),
  borderStrong: pick(PALETTE.neutral400, PALETTE.darkBorderStrong),
  divider: pick(PALETTE.neutral200, PALETTE.darkDivider),
  disabled: pick(PALETTE.neutral400, PALETTE.darkDisabled),
  disabledSurface: pick(PALETTE.neutral150, PALETTE.darkSurfaceMuted),

  // Status
  success: pick(PALETTE.green600, "#6FD188"),
  successSoft: pick(PALETTE.green50, "#14251A"),
  danger: pick(PALETTE.red600, "#FF8B8B"),
  dangerSoft: pick(PALETTE.red50, "#2E1719"),
  warning: pick(PALETTE.amber700, PALETTE.amber500),
  warningSoft: pick(PALETTE.amber50, "#2E2310"),
  info: pick(PALETTE.blue500, "#5CC8F7"),
  infoSoft: pick(PALETTE.blue50, "#10262E"),

  // Generic
  white: PALETTE.neutral0,
  black: PALETTE.neutral950,
  transparent: "transparent",
  backdrop: pick("#00000066", "#000000A6"),
  glassSurface: pick("rgba(248,249,248,0.54)", "rgba(30,29,36,0.62)"),
  glassSurfaceIos: pick("rgba(248,249,248,0.58)", "rgba(30,29,36,0.66)"),
  glassSurfaceAndroid: pick("rgba(248,249,248,0.70)", "rgba(28,27,33,0.88)"),
  /** Opaque equivalent of the glass tint: native has no real backdrop blur, so the bar paints solid there. */
  glassSurfaceSolid: pick("#F8F9F8", "#1C1B21"),
  glassBorder: pick("rgba(255,255,255,0.72)", "rgba(255,255,255,0.10)"),
  glassActive: pick("rgba(255,136,73,0.16)", "rgba(255,136,73,0.26)"),
  /** Active tab tint for the floating navigation, kept separate from primaryStrong. */
  navActive: pick("#FF8C42", PALETTE.orange400),
  shadow: PALETTE.neutral950,
  onColor: PALETTE.neutral0,

  // Compatibility aliases - migrate feature code gradually to semantic tokens.
  neutral: pick(PALETTE.neutral300, PALETTE.darkBorder),
  lightgray: pick(PALETTE.neutral100, PALETTE.darkSurfaceMuted),
  darkgray: pick(PALETTE.neutral200, PALETTE.darkDivider),
  brown: pick(PALETTE.orange700, PALETTE.orange300),
  brownDark: pick(PALETTE.orange900, PALETTE.orange200),
  bgblue: pick(PALETTE.blue800, "#7FD3F2"),
  textblue: pick(PALETTE.blue500, "#5CC8F7"),
  bggreen: pick(PALETTE.green800, "#7EDC94"),
  textgreen: pick(PALETTE.green800, "#7EDC94"),
  strengthStrong: pick(PALETTE.green600, "#6FD188"),
  strengthMedium: pick("#E38A2E", "#F0A85A"),
  strengthWeak: pick(PALETTE.red500, "#FF8B8B"),
  statusPending: pick(PALETTE.orange500, PALETTE.orange400),
  statusPendingLight: pick("#FFE7A8", "#3A2F16"),
  orgStatOrangeBg: pick(PALETTE.orange100, "#35220F"),
  orgStatOrangeBorder: pick("#FFC9AE", "#5C3A1E"),
  orgStatGreenBg: pick(PALETTE.green100, "#14251A"),
  orgStatGreenBorder: pick("#A6E7AE", "#2A5233"),
  orgStatBlueBg: pick(PALETTE.blue100, "#10262E"),
  orgStatBlueBorder: pick(PALETTE.blue300, "#235064"),
  orgStatYellowBg: pick(PALETTE.amber50, "#2E2310"),
  orgStatYellowBorder: pick(PALETTE.amber300, "#5A4520"),
  contactPhoneBg: pick(PALETTE.orange100, "#35220F"),
  contactEmailBg: pick("#E9F7FD", "#10262E"),
  orgDashboardHeroBg: pick("#FFF2EA", "#2A1C12"),
  orgDashboardHeroBorder: pick("#F3CDB8", "#4A3325"),
  orgDashboardHeroMark: pick("#F3E4DD", "#3A2A22"),
  orgAchievementGreenBg: pick(PALETTE.green50, "#14251A"),
  orgAchievementGreenBorder: pick("#B8E3BC", "#2A5233"),
  orgAchievementOrangeBg: pick("#FFF3EA", "#33210F"),
  orgAchievementOrangeBorder: pick("#FFD0B5", "#5C3A1E"),
  orgAchievementBlueBg: pick(PALETTE.blue50, "#10262E"),
  orgAchievementBlueBorder: pick("#B3E2F6", "#235064"),
  orgAchievementLockedBg: pick("#F3F1F1", "#211F26"),
  orgAchievementLockedBorder: pick("#DCC7BA", "#3D3640"),
  statusApproved: pick(PALETTE.blue500, "#5CC8F7"),
  statusClosed: pick(PALETTE.green500, "#6FD188"),
  rescueSoft: pick("#FFF5F0", "#2A1C12"),
  rescueBorder: pick("#EFCFBE", "#4A3325"),
  rescueDangerSoft: pick(PALETTE.red50, "#2E1719"),
  rescueMapOverlay: pick("#FFF8F3", "#201A15"),
  rescueSuccess: pick(PALETTE.green500, "#6FD188"),
  rescueSuccessSoft: pick("#E9F8EB", "#14251A"),
  rescueInput: pick("#F4F4F7", PALETTE.darkSurfaceMuted),
  rating: pick(PALETTE.amber500, "#FFC24D"),
  urgent: pick(PALETTE.red700, "#FF8B8B"),
  peach: pick(PALETTE.orange300, "#4A3325"),
  brownMuted: pick("#564338", "#C9BDB2"),
  ink: pick("#1A1C1E", PALETTE.darkText),
  navy: pick(PALETTE.blue900, "#7FD3F2"),
  tan: pick("#DDC1B3", "#4A3B33"),
  offwhite: pick("#EEEEF0", PALETTE.darkSurfaceMuted),
  successDark: pick("#00731E", "#6FD188"),
  successLight: pick(PALETTE.green300, "#1E4A2A"),
} as const;


/**
 * Google Maps styling for the dark scheme.
 *
 * Google Maps paints its own tiles and ignores the app palette, so a default map
 * stays bright white inside a dark screen. This array retints the base map to sit
 * on the same canvas as the rest of the app while keeping roads, water and labels
 * readable. Points of interest stay unstyled so rescue-relevant places (vets,
 * shelters, parks) remain findable.
 *
 * Applies to the Google provider only, which is what the native maps use.
 */
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1B1A21" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8F8B99" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#121116" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#302E38" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#B6B2C0" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9C98A6" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1C2A20" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6FD188" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#26242D" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#201F26" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8F8B99" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#302E38" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#423F4D" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#C9BDB2" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#26242D" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9C98A6" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0E1A22" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4A6472" }],
  },
];

/** Empty in the light scheme, which leaves Google's default styling untouched. */
export const MAP_STYLE = isDark ? DARK_MAP_STYLE : [];

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
  textAlign: "auto" as const,
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
