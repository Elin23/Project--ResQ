import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Share, StyleSheet, View, useWindowDimensions } from "react-native";

import {
    ActionStack,
    AppText,
    Button,
    Card,
    IconButton,
    Screen,
    ScreenHeader,
} from "@/src/components/ui";
import { useSession } from "@/src/features/session/SessionContext";
import { LTR_TEXT } from "@/src/i18n/rtl";
import { reportDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { COLORS, DENSITY, ICON_SIZES, LAYOUT, RADIUS, SPACING } from "@/src/theme";

const REPORT_CODE = "RQ-2025-00481";
const TIMELINE_NODE_SIZE = 26;
const ILLUSTRATION_MAX_HEIGHT = 220;

const TIMELINE_STEPS: { title: string; time?: string; done: boolean }[] = [
    { title: "تم استلام البلاغ", time: "اليوم، 10:45 ص", done: true },
    { title: "سيتم مراجعته من قبل الفريق", time: "بانتظار التأكيد", done: false },
    { title: "تعيين متطوع أو جمعية", time: "بانتظار البدء", done: false },
    { title: "وصول تحديثات مباشرة", done: false },
];

const PROMO_BENEFITS = [
    "متابعة حالة البلاغ مباشرة",
    "استقبال الإشعارات والتحذيرات",
    "التعليق والمشاركة في عمليات الإنقاذ",
];

export default function ReportSuccessScreen() {
    const { isGuest, accountKind } = useSession();
    const { width } = useWindowDimensions();
    const illustrationHeight = Math.min(width * 0.52, ILLUSTRATION_MAX_HEIGHT);

    return (
        <Screen scroll padded={false} contentContainerStyle={styles.screenContent}>
            <ScreenHeader title="تم الإرسال بنجاح" onBack={() => router.back()} />

            <View style={styles.body}>

                {/* Illustration Graphic Area */}
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require("@/assets/images/section-illustration.png")}
                        style={[styles.illustrationImage, { height: illustrationHeight }]}
                    />
                </View>

                {/* Header Title & Subtitle */}
                <View style={styles.headerTextBlock}>
                    <AppText variant="h1" weight="bold" align="center" color={COLORS.brown}>
                        تم إرسال البلاغ بنجاح
                    </AppText>
                    <AppText variant="bodyLarge" align="center" color={COLORS.textSecondary} style={styles.subTitle}>
                        شكراً لمساعدتك. تم استلام البلاغ وسيقوم فريق ResQ بمراجعته في أقرب وقت ممكن.
                    </AppText>
                </View>

                {/* Report Number Card */}
                <Card disabled radius={RADIUS.xl} padding={DENSITY.cardPadding}>
                    <View style={styles.cardContentRow}>
                        <View style={styles.cardCopyGroup}>
                            <AppText variant="caption" color={COLORS.textSecondary}>رقم البلاغ</AppText>
                            <AppText variant="h3" weight="bold" color={COLORS.ink} style={LTR_TEXT}>
                                {REPORT_CODE}
                            </AppText>
                        </View>

                        <IconButton
                            icon="share-social-outline"
                            accessibilityLabel="مشاركة رقم البلاغ"
                            color={COLORS.brown}
                            contained
                            onPress={() => void Share.share({ message: `رقم البلاغ: ${REPORT_CODE}` })}
                        />
                    </View>
                </Card>

                {/* Status Estimation Card */}
                <Card disabled radius={RADIUS.xl} padding={DENSITY.cardPadding}>
                    <View style={styles.cardContentRow}>
                        <View style={styles.cardCopyGroup}>
                            <View style={styles.statusTitleWithIcon}>
                                <Ionicons name="checkmark-circle" size={ICON_SIZES.md} color={COLORS.secondary} />
                                <AppText variant="body" weight="bold" color={COLORS.ink}>تم الاستلام</AppText>
                            </View>
                            <AppText variant="caption" color={COLORS.textSecondary}>
                                المراجعة المتوقعة: 10–30 دقيقة
                            </AppText>
                        </View>

                        <View style={styles.statusBadgeGray}>
                            <AppText variant="label" weight="medium" color={COLORS.textSecondary}>قيد المراجعة</AppText>
                        </View>
                    </View>
                </Card>

                {/* What Happens Next Section */}
                <Card disabled radius={RADIUS.xl} padding={DENSITY.cardPadding} style={styles.timelineCard}>
                    <AppText variant="h3" weight="bold" color={COLORS.ink}>ماذا سيحدث الآن؟</AppText>

                    <View style={styles.timelineContainer}>
                        {TIMELINE_STEPS.map((step, index) => {
                            const isLast = index === TIMELINE_STEPS.length - 1;

                            return (
                                <View key={step.title} style={styles.timelineRowItem}>
                                    <View style={styles.timelineRail}>
                                        {step.done ? (
                                            <View style={styles.nodeCircleActive}>
                                                <Ionicons name="checkmark" size={ICON_SIZES.xs} color={COLORS.white} />
                                            </View>
                                        ) : (
                                            <View style={styles.nodeCircleMuted} />
                                        )}
                                        {isLast ? null : <View style={styles.timelineVerticalLine} />}
                                    </View>

                                    <View style={[styles.timelineTextGroup, isLast && styles.timelineTextGroupLast]}>
                                        <AppText
                                            variant="body"
                                            weight={step.done ? "bold" : "medium"}
                                            color={step.done ? COLORS.successDark : COLORS.disabled}
                                        >
                                            {step.title}
                                        </AppText>
                                        {step.time ? (
                                            <AppText
                                                variant="caption"
                                                color={step.done ? COLORS.textSecondary : COLORS.placeholder}
                                            >
                                                {step.time}
                                            </AppText>
                                        ) : null}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </Card>

                {/* Urgent Note Banner */}
                <View style={styles.urgentBannerBox}>
                    <Ionicons
                        name="information-circle-outline"
                        size={ICON_SIZES.md}
                        color={COLORS.accent}
                        style={styles.urgentBannerIcon}
                    />
                    <AppText variant="label" color={COLORS.ink} style={styles.urgentBannerText}>
                        إذا كان البلاغ عاجلاً للغاية، فقد يتم التواصل معك للحصول على معلومات إضافية.
                    </AppText>
                </View>

                {/* Create Account Promotion Box - تظهر فقط للزائر */}
                {isGuest ? (
                    <Card
                        disabled
                        radius={RADIUS.xl}
                        padding={SPACING.lg}
                        backgroundColor={COLORS.primarySoft}
                        borderColor={COLORS.peach}
                        style={styles.promoAccountCard}
                    >
                        <AppText variant="h3" weight="bold" align="center" color={COLORS.brownDark}>
                            أنشئ حساباً لمتابعة البلاغات بسهولة
                        </AppText>

                        <View style={styles.promoBulletsContainer}>
                            {PROMO_BENEFITS.map((benefit) => (
                                <View key={benefit} style={styles.promoBulletRow}>
                                    <Ionicons name="checkmark-circle-outline" size={ICON_SIZES.sm} color={COLORS.brown} />
                                    <AppText variant="body" weight="medium" color={COLORS.brownDark} style={styles.promoBulletText}>
                                        {benefit}
                                    </AppText>
                                </View>
                            ))}
                        </View>

                        <ActionStack>
                            <Button
                                title="إنشاء حساب"
                                onPress={() => router.push(ROUTES.chooseAccount)}
                                variant="custom"
                                backgroundColor={COLORS.brown}
                                textColor={COLORS.white}
                                radius={RADIUS.lg}
                            />
                            <Button
                                title="تسجيل الدخول"
                                onPress={() => router.push(ROUTES.login)}
                                variant="text"
                                textColor={COLORS.brown}
                            />
                        </ActionStack>
                    </Card>
                ) : null}

                {/* Bottom Actions */}
                <ActionStack style={styles.footerActions}>
                    <Button
                        title="متابعة البلاغ"
                        onPress={() => router.push(reportDetailsRoute("1", accountKind))}
                        variant="custom"
                        size="large"
                        icon="chevron-back"
                        iconPosition="end"
                        backgroundColor={COLORS.brown}
                        textColor={COLORS.white}
                        radius={RADIUS.lg}
                    />
                    <Button
                        title="العودة إلى الرئيسية"
                        onPress={() => router.replace(ROUTES.home)}
                        variant="ghost"
                        textColor={COLORS.textSecondary}
                    />
                </ActionStack>

            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screenContent: {
        paddingTop: 0,
    },
    body: {
        width: "100%",
        paddingHorizontal: LAYOUT.screenPadding,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xl,
        gap: SPACING.md,
    },
    illustrationContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    illustrationImage: {
        width: "100%",
        resizeMode: "contain",
    },
    headerTextBlock: {
        width: "100%",
        alignItems: "center",
        gap: SPACING.xs,
        marginBottom: SPACING.xs,
    },
    subTitle: {
        paddingHorizontal: SPACING.sm,
    },
    cardContentRow: {
        width: "100%",
        flexDirection: "row",
        direction: "rtl",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SPACING.md,
    },
    cardCopyGroup: {
        flex: 1,
        minWidth: 0,
        alignItems: "flex-start",
        gap: SPACING.xxs,
    },
    statusTitleWithIcon: {
        flexDirection: "row",
        direction: "rtl",
        alignItems: "center",
        gap: SPACING.xs,
    },
    statusBadgeGray: {
        flexShrink: 0,
        backgroundColor: COLORS.lightgray,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
    },
    timelineCard: {
        gap: SPACING.md,
    },
    timelineContainer: {
        width: "100%",
    },
    timelineRowItem: {
        width: "100%",
        flexDirection: "row",
        direction: "rtl",
        alignItems: "flex-start",
        gap: SPACING.md,
    },
    timelineRail: {
        width: TIMELINE_NODE_SIZE,
        alignSelf: "stretch",
        alignItems: "center",
    },
    timelineVerticalLine: {
        width: 2,
        flex: 1,
        minHeight: SPACING.lg,
        marginVertical: SPACING.xs,
        backgroundColor: COLORS.border,
    },
    timelineTextGroup: {
        flex: 1,
        minWidth: 0,
        alignItems: "stretch",
        gap: SPACING.xxs,
        paddingBottom: SPACING.lg,
    },
    timelineTextGroupLast: {
        paddingBottom: 0,
    },
    nodeCircleActive: {
        width: TIMELINE_NODE_SIZE,
        height: TIMELINE_NODE_SIZE,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.secondary,
        alignItems: "center",
        justifyContent: "center",
    },
    nodeCircleMuted: {
        width: TIMELINE_NODE_SIZE,
        height: TIMELINE_NODE_SIZE,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.offwhite,
        borderWidth: 2,
        borderColor: COLORS.tan,
    },
    urgentBannerBox: {
        width: "100%",
        flexDirection: "row",
        direction: "rtl",
        alignItems: "flex-start",
        gap: SPACING.sm,
        backgroundColor: COLORS.lightgray,
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: RADIUS.xl,
        padding: DENSITY.cardPadding,
    },
    urgentBannerIcon: {
        marginTop: SPACING.xxs,
    },
    urgentBannerText: {
        flex: 1,
        minWidth: 0,
    },
    promoAccountCard: {
        gap: SPACING.md,
    },
    promoBulletsContainer: {
        width: "100%",
        gap: SPACING.sm,
    },
    promoBulletRow: {
        width: "100%",
        flexDirection: "row",
        direction: "rtl",
        alignItems: "center",
        gap: SPACING.sm,
    },
    promoBulletText: {
        flex: 1,
        minWidth: 0,
    },
    footerActions: {
        marginTop: SPACING.xs,
    },
});
