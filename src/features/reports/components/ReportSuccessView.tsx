import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, Share, StyleSheet, TouchableOpacity, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useSession } from "@/src/features/session/SessionContext";
import { reportDetailsRoute, ROUTES } from "@/src/navigation/routes";
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = SPACING.md;

export default function ReportSuccessScreen() {
    const { isGuest, accountKind } = useSession();

    return (
        <SafeAreaView style={styles.outerContainer}>
            <ScreenHeader title="تم الإرسال بنجاح" onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Illustration Graphic Area */}
                <View style={styles.illustrationContainer}>
                    <Image 
                        source={require('@/assets/images/section-illustration.png')} 
                        style={styles.illustrationImage} 
                    />
                </View>

                {/* Header Title & Subtitle */}
                <View style={styles.headerTextBlock}>
                    <AppText style={styles.mainTitle}>تم إرسال البلاغ بنجاح</AppText>
                    <AppText style={styles.subTitle}>
                        شكراً لمساعدتك. تم استلام البلاغ وسيوم فريق ResQ بمراجعته في أقرب وقت ممكن.
                    </AppText>
                </View>

                {/* Report Number Card */}
                <View style={styles.cardBox}>
                    <View style={styles.cardContentRow}>
                        <AppText style={styles.reportCodeText}>RQ-2025-00481</AppText>
                        <View style={styles.cardRightGroup}>
                            <AppText style={styles.cardLabelText}>رقم البلاغ</AppText>
                            <TouchableOpacity accessibilityRole="button" accessibilityLabel="مشاركة رقم البلاغ" onPress={() => void Share.share({ message: "رقم البلاغ: RQ-2025-00481" })} style={styles.iconSquareButton} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                <Feather name="share-2" size={16} color={COLORS.brown} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Status Estimation Card */}
                <View style={styles.cardBox}>
                    <View style={styles.cardContentRow}>
                        <View style={styles.statusBadgeGray}>
                            <AppText style={styles.statusBadgeGrayText}>قيد المراجعة</AppText>
                        </View>
                        <View style={styles.statusLeftInfo}>
                            <View style={styles.statusTitleWithIcon}>
                                <AppText style={styles.statusMainTitle}>تم الاستلام</AppText>
                                <Ionicons name="checkmark-circle" size={20} color={COLORS.secondary} />
                            </View>
                            <AppText style={styles.statusSubInfoText}>المراجعة المتوقعة: 30–10 دقيقة</AppText>
                        </View>
                    </View>
                </View>

                {/* What Happens Next Section */}
                <View style={styles.cardBoxColumn}>
                    <AppText style={styles.sectionCardTitle}>ماذا سيحدث الآن؟</AppText>

                    <View style={styles.timelineContainer}>
                        <View style={styles.timelineVerticalLine} />

                        {/* Step 1 */}
                        <View style={styles.timelineRowItem}>
                            <View style={styles.timelineTextGroup}>
                                <AppText style={styles.timelineStepTitleActive}>تم استلام البلاغ</AppText>
                                <AppText style={styles.timelineStepTime}>اليوم، 10:45 ص</AppText>
                            </View>
                            <View style={styles.nodeCircleActive}>
                                <Ionicons name="checkmark" size={14} color={COLORS.white} />
                            </View>
                        </View>

                        {/* Step 2 */}
                        <View style={styles.timelineRowItem}>
                            <View style={styles.timelineTextGroup}>
                                <AppText style={styles.timelineStepTitleMuted}>سيتم مراجعته من قبل الفريق</AppText>
                                <AppText style={styles.timelineStepTimeMuted}>بانتظار التأكيد</AppText>
                            </View>
                            <View style={styles.nodeCircleMuted} />
                        </View>

                        {/* Step 3 */}
                        <View style={styles.timelineRowItem}>
                            <View style={styles.timelineTextGroup}>
                                <AppText style={styles.timelineStepTitleMuted}>تعيين متطوع أو جمعية</AppText>
                                <AppText style={styles.timelineStepTimeMuted}>بانتظار البدء</AppText>
                            </View>
                            <View style={styles.nodeCircleMuted} />
                        </View>

                        {/* Step 4 */}
                        <View style={[styles.timelineRowItem, { marginBottom: 0 }]}>
                            <View style={styles.timelineTextGroup}>
                                <AppText style={styles.timelineStepTitleMuted}>وصول تحديثات مباشرة</AppText>
                            </View>
                            <View style={styles.nodeCircleMuted} />
                        </View>
                    </View>
                </View>

                {/* Urgent Note Banner */}
                <View style={styles.urgentBannerBox}>
                    <AppText style={styles.urgentBannerText}>
                        إذا كان البلاغ عاجلاً للغاية، فقد يتم التواصل معك للحصول على معلومات إضافية.
                    </AppText>
                    <Feather name="info" size={20} color={COLORS.accent} style={{ marginTop: 2 }} />
                </View>

                {/* Create Account Promotion Box - تظهر فقط للزائر */}
                {isGuest && (
                    <View style={styles.promoAccountCard}>
                        <AppText style={styles.promoCardTitle}>أنشئ حساباً لمتابعة البلاغات بسهولة</AppText>

                        <View style={styles.promoBulletsContainer}>
                            <View style={styles.promoBulletRow}>
                                <AppText style={styles.promoBulletText}>متابعة حالة البلاغ مباشرة</AppText>
                                <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.brown} />
                            </View>
                            <View style={styles.promoBulletRow}>
                                <AppText style={styles.promoBulletText}>استقبال الإشعارات والتحذيرات</AppText>
                                <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.brown} />
                            </View>
                            <View style={styles.promoBulletRow}>
                                <AppText style={styles.promoBulletText}>التعليق والمشاركة في عمليات الإنقاذ</AppText>
                                <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.brown} />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.primaryBrownButton} onPress={() => router.push(ROUTES.chooseAccount)}>
                            <AppText style={styles.primaryBrownButtonText}>إنشاء حساب</AppText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.textLinkButton} onPress={() => router.push(ROUTES.login)}>
                            <AppText style={styles.textLinkButtonText}>تسجيل الدخول</AppText>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Bottom Action Main Button */}
                <TouchableOpacity style={styles.trackReportButton} onPress={() => router.push(reportDetailsRoute("1", accountKind))}>
                    <Ionicons name="chevron-back" size={18} color={COLORS.white} />
                    <AppText style={styles.trackReportButtonText}>متابعة البلاغ</AppText>
                </TouchableOpacity>

                {/* Footer Secondary Link */}
                <TouchableOpacity style={styles.backHomeTouch} onPress={() => router.replace(ROUTES.home)}>
                    <AppText style={styles.backHomeText}>العودة إلى الرئيسية</AppText>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    topBar: {
        flexDirection: 'row',
        direction: 'rtl',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    topBarTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.title,
        color: COLORS.ink,
        textAlign: 'center',
    },
    scrollContent: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingVertical: SPACING.lg,
    },
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    illustrationImage: {
        width: SCREEN_WIDTH * 0.72,  
        height: SCREEN_WIDTH * 0.72, 
        resizeMode: 'contain',       
    },
    headerTextBlock: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    mainTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.headline,
        color: COLORS.brown,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    subTitle: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: SPACING.sm,
    },
    cardBox: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.sm,
    },
    cardBoxColumn: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.sm,
    },
    cardContentRow: {
        flexDirection: 'row',
        direction: 'rtl',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reportCodeText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.title,
        color: COLORS.ink,
    },
    cardRightGroup: {
        flexDirection: 'row',
        direction: 'rtl',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    cardLabelText: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.label,
        color: COLORS.textSecondary,
    },
    iconSquareButton: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.lightgray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBadgeGray: {
        backgroundColor: COLORS.lightgray,
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: RADIUS.md,
    },
    statusBadgeGrayText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.label,
        color: COLORS.textSecondary,
    },
    statusLeftInfo: {
        alignItems: 'flex-end',
    },
    statusTitleWithIcon: {
        flexDirection: 'row',
        direction: 'rtl',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    statusMainTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.ink,
    },
    statusSubInfoText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    sectionCardTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.title,
        color: COLORS.ink,
        textAlign: 'right',
        marginBottom: SPACING.md,
    },
    timelineContainer: {
        position: 'relative',
        paddingVertical: 4,
        paddingStart: 0,
    },
    timelineVerticalLine: {
        position: 'absolute',
        right: 13,
        top: 16,
        bottom: 16,
        width: 2,
        backgroundColor: COLORS.border,
    },
    timelineRowItem: {
        flexDirection: 'row',
        direction: 'rtl',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 36, // زيادة المسافة (Gap) بين الخطوات بشكل مريح
    },
    timelineTextGroup: {
        flex: 1,
        alignItems: 'flex-end',
        paddingEnd: SPACING.md,
    },
    timelineStepTitleActive: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.successDark,
        textAlign: 'right',
    },
    timelineStepTime: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
        textAlign: 'right',
    },
    timelineStepTitleMuted: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.body,
        color: COLORS.disabled,
        textAlign: 'right',
    },
    timelineStepTimeMuted: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.caption,
        color: COLORS.placeholder,
        marginTop: 2,
        textAlign: 'right',
    },
    nodeCircleActive: {
        width: 26,
        height: 26,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeCircleMuted: {
        width: 26,
        height: 26,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.offwhite,
        borderWidth: 2,
        borderColor: COLORS.tan,
        alignItems: 'center',
        justifyContent: 'center',
    },
    urgentBannerBox: {
        flexDirection: 'row',
        direction: 'rtl',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: COLORS.lightgray,
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    urgentBannerText: {
        flex: 1,
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.label,
        color: COLORS.ink,
        textAlign: 'right',
        lineHeight: 20,
    },
    promoAccountCard: {
        backgroundColor: COLORS.primarySoft,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.peach,
        marginBottom: SPACING.lg,
        alignItems: 'center',
    },
    promoCardTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.title,
        color: COLORS.brownDark,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    promoBulletsContainer: {
        width: '100%',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    promoBulletRow: {
        flexDirection: 'row',
        direction: 'rtl',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: SPACING.sm,
    },
    promoBulletText: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.body,
        color: COLORS.brownDark,
        textAlign: 'right',
    },
    primaryBrownButton: {
        width: '100%',
        backgroundColor: COLORS.brown,
        paddingVertical: 14,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    primaryBrownButtonText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.white,
    },
    textLinkButton: {
        paddingVertical: SPACING.xs,
    },
    textLinkButtonText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.brown,
    },
    trackReportButton: {
        flexDirection: 'row',
        direction: 'rtl',
        backgroundColor: COLORS.brown,
        paddingVertical: 16,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.md,
    },
    trackReportButtonText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.white,
    },
    backHomeTouch: {
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    backHomeText: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
    },
});
