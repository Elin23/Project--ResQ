import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Dimensions, Image, Linking, NativeScrollEvent, NativeSyntheticEvent, Platform, SafeAreaView, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { useSession } from "@/src/features/session/SessionContext";
import { ROUTES } from "@/src/navigation/routes";
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = SPACING.md;
const PAGE_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2);

const CUSTOM_FIRST_IMAGE = require('../../../../assets/images/dogg.png');

const REPORT_IMAGES = [
    CUSTOM_FIRST_IMAGE,
    { uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop' },
    { uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop' },
    { uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop' },
];

export default function ReportDetailsScreen() {
    const { isGuest } = useSession();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slide = Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH);
        if (slide !== activeImageIndex && slide >= 0 && slide < REPORT_IMAGES.length) {
            setActiveImageIndex(slide);
        }
    }, [activeImageIndex]);

    const openRealMap = () => {
        const latitude = 33.5138;
        const longitude = 36.2765;
        const label = 'كلب مصاب - دمشق المزة';

        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q='
        });
        const latLng = `${latitude},${longitude}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url) {
            Linking.openURL(url);
        }
    };


    return (
        <SafeAreaView style={styles.outerContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Top Navigation Bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="arrow-forward" size={22} color={COLORS.ink} />
                    </TouchableOpacity>

                    <Text style={styles.topBarTitle}>تفاصيل البلاغ</Text>

                    <TouchableOpacity onPress={() => void Share.share({ message: "بلاغ إنقاذ على ResQ: كلب مصاب بالقرب من الطريق الرئيسي" })} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="share-social-outline" size={20} color={COLORS.ink} />
                    </TouchableOpacity>
                </View>

                {/* Image Carousel */}
                <View style={styles.imageWrapper}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        snapToInterval={PAGE_WIDTH}
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {REPORT_IMAGES.map((imgSource, idx) => (
                            <Image 
                                key={idx} 
                                source={imgSource} 
                                style={styles.carouselImage} 
                            />
                        ))}
                    </ScrollView>

                    <View style={styles.imageCounterBadge}>
                        <Text style={styles.imageCounterText}>{activeImageIndex + 1} / {REPORT_IMAGES.length}</Text>
                    </View>

                    <View style={styles.dotsRow}>
                        {REPORT_IMAGES.map((_, idx) => (
                            <View
                                key={idx}
                                style={[styles.dot, activeImageIndex === idx ? styles.dotActive : styles.dotInactive]}
                            />
                        ))}
                    </View>
                </View>

                {/* Status Badge */}
                <View style={styles.statusBadgeRow}>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>قيد الإنقاذ</Text>
                        <MaterialCommunityIcons name="medical-bag" size={18} color={COLORS.bgblue} />
                    </View>
                </View>

                {/* Title & Urgent Tag */}
                <View style={styles.titleContainer}>
                    <View style={styles.titleRow}>
                        <View style={styles.urgencyBadge}>
                            <Text style={styles.urgencyBadgeText}>حالة عاجلة</Text>
                        </View>
                        <Text style={styles.mainTitle}>كلب مصاب بالقرب من الطريق الرئيسي</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.metaText}>منذ 25 دقيقة</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.metaText}>دمشق</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaText}># رقم البلاغ: RQ-2481</Text>
                        </View>
                    </View>
                </View>

                {/* Details Cards Grid */}
                <View style={styles.cardsGridContainer}>
                    <View style={styles.cardsRow}>
                        <View style={styles.infoCard}>
                            <Text style={styles.cardLabel}>نوع الحيوان</Text>
                            <Text style={styles.cardValue}>كلب</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.cardLabel}>الحجم</Text>
                            <Text style={styles.cardValue}>متوسط</Text>
                        </View>
                    </View>

                    <View style={styles.cardsRow}>
                        <View style={styles.infoCard}>
                            <Text style={styles.cardLabel}>العمر</Text>
                            <Text style={styles.cardValue}>بالغ</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.cardLabel}>الجنس</Text>
                            <Text style={styles.cardValue}>غير معروف</Text>
                        </View>
                    </View>

                    <View style={styles.fullWidthCard}>
                        <View style={styles.cardHalfRight}>
                            <Text style={styles.cardLabel}>الحالة الصحية</Text>
                            <Text style={styles.cardValue}>إصابة ظاهرة في الساق</Text>
                        </View>
                        <View style={styles.cardHalfLeft}>
                            <Text style={styles.cardLabel}>السلوك</Text>
                            <Text style={styles.cardValue}>هادئ لكنه خائف</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionHeader}>وصف الحالة</Text>
                    <Text style={styles.descriptionParagraph}>
                        تم العثور على الكلب بالقرب من الطريق الرئيسي في منطقة المزة. الكلب يعاني من إصابة واضحة في ساقه الخلفية تمنعه من الحركة بشكل طبيعي. يبدو أليفاً ولكنه يظهر علامات خوف وتوتر من السيارات المارة.
                    </Text>
                </View>

                {/* Location & Map Section */}
                <View style={styles.sectionBlock}>
                        <Text style={styles.sectionHeader}>الموقع</Text>

                        <View style={styles.mapCardOuter}>
                            <View style={styles.mapViewFrame}>
                                <MapView
                                    style={styles.mapElement}
                                    initialRegion={{
                                        latitude: 33.5138,
                                        longitude: 36.2765,
                                        latitudeDelta: 0.02,
                                        longitudeDelta: 0.02,
                                    }}
                                >
                                    <Marker coordinate={{ latitude: 33.5138, longitude: 36.2765 }} />
                                </MapView>
                            </View>

                            <View style={styles.mapBottomContent}>
                                <View style={styles.mapInfoAndButtonRow}>
                                    <TouchableOpacity style={styles.openMapPeachPill} onPress={openRealMap}>
                                        <Text style={styles.openMapPeachText}>فتح في{"\n"}الخريطة</Text>
                                        <Feather name="map" size={18} color={COLORS.brownDark} />
                                    </TouchableOpacity>

                                    <View style={styles.locationTextGroup}>
                                        <Text style={styles.locationTitleText}>دمشق، المزة، بالقرب من دوار الجلاء</Text>
                                        <Text style={styles.locationSubText}>يبعد 2.4 كم عن موقعك الحالي</Text>
                                    </View>
                                </View>

                                <View style={styles.privacyFooter}>
                                    <Ionicons name="information-circle-outline" size={16} color={COLORS.placeholder} style={{ marginRight: SPACING.xs }} />
                                    <Text style={styles.privacyFooterText}>يتم تشفير الإحداثيات الدقيقة لخصوصية الحيوان والمبلغ.</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                {/* Rescue Timeline */}
                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionHeader}>مسار الإنقاذ</Text>

                    <View style={styles.timelineContainer}>
                        <View style={styles.timelineVerticalLine} />

                        <View style={styles.timelineRowItem}>
                            <Text style={styles.timelineTimeText}>08:30 ص</Text>
                            <View style={styles.timelineBodyTextGroup}>
                                <Text style={styles.timelineStepTitle}>تم إرسال البلاغ</Text>
                                <Text style={styles.timelineStepDesc}>تم توثيق الحالة بنجاح.</Text>
                            </View>
                            <View style={styles.nodeOuterCircleGreen}>
                                <View style={styles.nodeInnerCircleGreen} />
                            </View>
                        </View>

                        <View style={styles.timelineRowItem}>
                            <Text style={styles.timelineTimeText}>08:40 ص</Text>
                            <View style={styles.timelineBodyTextGroup}>
                                <Text style={styles.timelineStepTitle}>تم قبول البلاغ</Text>
                                <Text style={styles.timelineStepDesc}>فريق ResQ استلم الحالة.</Text>
                            </View>
                            <View style={styles.nodeOuterCircleGreen}>
                                <View style={styles.nodeInnerCircleGreen} />
                            </View>
                        </View>

                        <View style={styles.timelineRowItem}>
                            <Text style={styles.timelineTimeText}>08:50 ص</Text>
                            <View style={styles.timelineBodyTextGroup}>
                                <Text style={styles.timelineStepTitle}>المتطوع في طريقه</Text>
                                <Text style={styles.timelineStepDesc}>المتطوع &quot;أحمد س.&quot; توجه للموقع.</Text>
                            </View>
                            <View style={styles.nodeOuterCircleOrange}>
                                <View style={styles.nodeInnerCircleOrange} />
                            </View>
                        </View>

                        <View style={[styles.timelineRowItem, { marginBottom: 0 }]}>
                            <Text style={styles.timelineTimeTextMuted}>قيد الانتظار</Text>
                            <View style={styles.timelineBodyTextGroup}>
                                <Text style={styles.timelineStepTitleMuted}>تم نقل الحيوان إلى العيادة</Text>
                            </View>
                            <View style={styles.nodeOuterCircleGray}>
                                <View style={styles.nodeInnerCircleGray} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Reporter Info (مع تعديل الكارت ليصبح MR على اليمين والسهم على اليسار) */}
                <View style={styles.userCardBox}>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="chevron-back" size={18} color={COLORS.placeholder} />
                    </TouchableOpacity>

                    <View style={styles.userCardRightGroup}>
                        <View style={styles.userCardInfo}>
                            <Text style={styles.userCardRoleLabel}>معلومات المبلغ / المتطوع</Text>
                            <Text style={styles.userCardNameText}>أحمد س.</Text>
                            <View style={styles.reporterTagsRow}>
                                <Text style={styles.reporterBadgeTag}>متطوع موثوق</Text>
                                <Text style={styles.reporterCountText}>8 بلاغات</Text>
                            </View>
                        </View>
                        <View style={styles.avatarCircleBeige}>
                            <Text style={styles.avatarCircleText}>MR</Text>
                        </View>
                    </View>
                </View>

                {/* Rescue Team Info */}
                <View style={styles.userCardBox}>
                    <TouchableOpacity style={styles.profileLightBtn}>
                        <Text style={styles.profileLightBtnText}>عرض الملف</Text>
                    </TouchableOpacity>

                    <View style={styles.userCardRightGroup}>
                        <View style={styles.userCardInfo}>
                            <Text style={styles.userCardRoleLabel}>الجهة المستجيبة</Text>
                            <Text style={styles.userCardNameText}>فريق إنقاذ ResQ</Text>
                            <Text style={styles.userCardSubText}>جمعية إنقاذ حيوانات مرخصة</Text>
                        </View>
                        <View style={styles.avatarCircleBlue}>
                            <MaterialCommunityIcons name="hand-heart" size={22} color={COLORS.white} />
                        </View>
                    </View>
                </View>

                {/* Comments Section */}
                <View style={styles.sectionBlock}>
                    <View style={styles.commentHeaderRow}>
                        <Text style={styles.sectionHeader}>التعليقات والتحديثات</Text>
                        <Text style={styles.commentCountBadge}>2 تعليق</Text>
                    </View>

                    <View style={styles.commentOuterRow}>
                        <View style={[styles.commentAvatarCircle, { backgroundColor: COLORS.success }]} />
                        <View style={styles.commentMainCard}>
                            <View style={styles.commentHeaderMeta}>
                                <Text style={styles.commentAuthorName}>أحمد س. (المتطوع)</Text>
                                <Text style={styles.commentTimeAgo}>منذ 5 د</Text>
                            </View>
                            <Text style={styles.commentBodyText}>
                                أنا الآن في المزة، سأصل إلى الموقع خلال دقيقتين. الكلب ما زال في مكانه؟
                            </Text>
                        </View>
                    </View>

                    <View style={styles.commentOuterRow}>
                        <View style={[styles.commentAvatarCircle, { backgroundColor: COLORS.tan }]} />
                        <View style={styles.commentMainCard}>
                            <View style={styles.commentHeaderMeta}>
                                <Text style={styles.commentAuthorName}>المبلغ</Text>
                                <Text style={styles.commentTimeAgo}>منذ 3 د</Text>
                            </View>
                            <Text style={styles.commentBodyText}>
                                نعم، أنا بقربه تماماً. إنه هادئ الآن.
                            </Text>
                        </View>
                    </View>

                    {isGuest && (
                        <View style={styles.loginDashedContainer}>
                            <Text style={styles.loginDashedTitle}>سجّل الدخول لإضافة تعليق أو تحديث للحالة</Text>
                            <TouchableOpacity style={styles.loginBrownBtn} onPress={() => router.push(ROUTES.login)}>
                                <Text style={styles.loginBrownBtnText}>تسجيل الدخول</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Bottom Actions */}
                <View style={styles.bottomButtonsRow}>
                    <TouchableOpacity style={styles.reportMainButton} onPress={() => router.push(ROUTES.createReport)}>
                        <MaterialCommunityIcons name="bell-plus-outline" size={20} color={COLORS.white} style={{ marginLeft: SPACING.xs }} />
                        <Text style={styles.reportMainButtonText}>الإبلاغ عن حالة مشابهة</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionIconSquareButton}>
                        <Feather name="upload" size={20} color={COLORS.ink} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionIconVerticalButton}>
                        <Ionicons name="bookmark-outline" size={20} color={COLORS.ink} />
                        <Text style={styles.actionIconLabel}>حفظ البلاغ</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    scrollContent: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingVertical: SPACING.lg,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    topBarTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.title,
        color: COLORS.ink,
        textAlign: 'center',
    },
    imageWrapper: {
        width: PAGE_WIDTH,
        height: 230,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: COLORS.darkgray,
        marginBottom: SPACING.md,
    },
    carouselImage: {
        width: PAGE_WIDTH,
        height: 230,
        resizeMode: 'cover',
    },
    imageCounterBadge: {
        position: 'absolute',
        bottom: 12,
        left: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.md,
    },
    imageCounterText: {
        fontFamily: FONTS.medium,
        color: COLORS.white,
        fontSize: FONT_SIZES.caption,
    },
    dotsRow: {
        position: 'absolute',
        bottom: 14,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: RADIUS.full,
    },
    dotActive: {
        backgroundColor: COLORS.white,
        width: 14,
    },
    dotInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: 8,
    },
    statusBadgeRow: {
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accent,
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: RADIUS.lg,
        gap: SPACING.xs,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    statusBadgeText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.bgblue,
    },
    titleContainer: {
        marginBottom: SPACING.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
        gap: SPACING.sm,
    },
    mainTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.headline,
        color: COLORS.ink,
        textAlign: 'right',
        flex: 1,
        lineHeight: 30,
    },
    urgencyBadge: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 6,
        borderRadius: RADIUS.md,
        marginTop: 4,
    },
    urgencyBadgeText: {
        fontFamily: FONTS.bold,
        color: COLORS.urgent,
        fontSize: FONT_SIZES.label,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: SPACING.md,
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    metaText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.label,
        color: COLORS.textSecondary,
    },
    cardsGridContainer: {
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    cardsRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    infoCard: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.xl,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'flex-end',
    },
    fullWidthCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'space-between',
    },
    cardHalfRight: {
        flex: 1.2,
        alignItems: 'flex-end',
    },
    cardHalfLeft: {
        flex: 0.8,
        alignItems: 'flex-end',
    },
    cardLabel: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.label,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        textAlign: 'right',
    },
    cardValue: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.ink,
        textAlign: 'right',
    },
    sectionBlock: {
        marginBottom: SPACING.lg,
    },
    sectionHeader: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.title,
        color: COLORS.ink,
        textAlign: 'right',
        marginBottom: SPACING.sm,
    },
    descriptionParagraph: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.body,
        color: COLORS.textSecondary,
        textAlign: 'right',
        lineHeight: 22,
    },
    mapCardOuter: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    mapViewFrame: {
        height: 160,
        width: '100%',
    },
    mapElement: {
        width: '100%',
        height: '100%',
    },
    mapBottomContent: {
        padding: SPACING.md,
        backgroundColor: COLORS.background,
    },
    mapInfoAndButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    openMapPeachPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.peach,
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: RADIUS.full,
        gap: SPACING.sm,
    },
    openMapPeachText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.label,
        color: COLORS.brownDark,
        textAlign: 'center',
        lineHeight: 16,
    },
    locationTextGroup: {
        flex: 1,
        alignItems: 'flex-end',
    },
    locationTitleText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.ink,
        textAlign: 'right',
    },
    locationSubText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.label,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        textAlign: 'right',
    },
    privacyFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.offwhite,
    },
    privacyFooterText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.caption,
        color: COLORS.placeholder,
        textAlign: 'right',
    },
    timelineContainer: {
        position: 'relative',
        paddingVertical: 4,
    },
    timelineVerticalLine: {
        position: 'absolute',
        left: 13,
        top: 10,
        bottom: 20,
        width: 2,
        backgroundColor: COLORS.border,
    },
    timelineRowItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    timelineBodyTextGroup: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: SPACING.sm,
    },
    timelineStepTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.ink,
        textAlign: 'right',
    },
    timelineStepTitleMuted: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.body,
        color: COLORS.disabled,
        textAlign: 'right',
    },
    timelineStepDesc: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.label,
        color: COLORS.textSecondary,
        marginTop: 2,
        textAlign: 'right',
    },
    timelineTimeText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.label,
        color: COLORS.textSecondary,
        width: 75,
        textAlign: 'right',
        paddingTop: 2,
    },
    timelineTimeTextMuted: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.label,
        color: COLORS.disabled,
        width: 75,
        textAlign: 'right',
        paddingTop: 2,
    },
    nodeOuterCircleGreen: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#C8FAD6',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: SPACING.sm,
    },
    nodeInnerCircleGreen: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#008522',
    },
    nodeOuterCircleOrange: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FFE5D0',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: SPACING.sm,
    },
    nodeInnerCircleOrange: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#B45309',
    },
    nodeOuterCircleGray: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#EBEBED',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: SPACING.sm,
    },
    nodeInnerCircleGray: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.disabled,
    },
    userCardBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    userCardRightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    avatarCircleBeige: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.tan,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarCircleText: {
        fontFamily: FONTS.bold,
        color: COLORS.brownDark,
        fontSize: FONT_SIZES.body,
    },
    avatarCircleBlue: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCardInfo: {
        alignItems: 'flex-end',
    },
    userCardRoleLabel: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.caption,
        color: COLORS.placeholder,
    },
    userCardNameText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.body,
        color: COLORS.ink,
        marginTop: 2,
    },
    userCardSubText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    reporterTagsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: 4,
    },
    reporterBadgeTag: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.caption,
        color: COLORS.successDark,
        backgroundColor: COLORS.successLight,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 3,
        borderRadius: RADIUS.sm,
    },
    reporterCountText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.caption,
        color: COLORS.textSecondary,
    },
    profileLightBtn: {
        backgroundColor: COLORS.lightgray,
        paddingHorizontal: SPACING.md,
        paddingVertical: 8,
        borderRadius: RADIUS.md,
    },
    profileLightBtnText: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.label,
        color: COLORS.ink,
    },
    commentHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    commentCountBadge: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.label,
        color: COLORS.textSecondary,
        backgroundColor: COLORS.lightgray,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.md,
    },
    commentOuterRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
        gap: SPACING.sm,
    },
    commentAvatarCircle: {
        width: 42,
        height: 42,
        borderRadius: RADIUS.full,
    },
    commentMainCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    commentHeaderMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    commentAuthorName: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.label,
        color: COLORS.ink,
    },
    commentTimeAgo: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.caption,
        color: COLORS.placeholder,
    },
    commentBodyText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.label,
        color: COLORS.text,
        textAlign: 'right',
        lineHeight: 20,
    },
    loginDashedContainer: {
        borderWidth: 1.5,
        borderColor: COLORS.brown,
        borderStyle: 'dashed',
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        alignItems: 'center',
        marginTop: SPACING.xs,
        backgroundColor: COLORS.background,
    },
    loginDashedTitle: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.label,
        color: COLORS.brownDark,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    loginBrownBtn: {
        backgroundColor: COLORS.brown,
        paddingHorizontal: SPACING.xl,
        paddingVertical: 10,
        borderRadius: RADIUS.md,
    },
    loginBrownBtnText: {
        fontFamily: FONTS.bold,
        color: COLORS.white,
        fontSize: FONT_SIZES.label,
    },
    bottomButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.xs,
        gap: SPACING.xs,
    },
    reportMainButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.brown,
        paddingVertical: 14,
        borderRadius: RADIUS.lg,
    },
    reportMainButtonText: {
        fontFamily: FONTS.bold,
        color: COLORS.white,
        fontSize: FONT_SIZES.body,
    },
    actionIconSquareButton: {
        width: 48,
        height: 48,
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconVerticalButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 6,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 48,
    },
    actionIconLabel: {
        fontFamily: FONTS.regular,
        fontSize: 9,
        color: COLORS.ink,
        marginTop: 2,
    },
});