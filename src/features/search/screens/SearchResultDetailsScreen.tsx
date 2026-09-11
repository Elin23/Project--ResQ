import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import ActionStack from "@/src/components/ui/ActionStack";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS, SPACING } from "@/src/theme";
import { useCallback } from "react";

export default function SearchResultDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const entityId = rawId?.startsWith("clinic:") ? rawId.slice("clinic:".length) : undefined;
  const resource = useAsyncResource(useCallback(() => entityId ? repositories.servicePlaces.getById(entityId) : Promise.resolve(null), [entityId]), null, "تعذر تحميل تفاصيل الجهة.");
  const place = resource.data;
  if (!resource.loading && !place) return <Screen padded={false}><Stack.Screen options={{headerShown:false}}/><ScreenHeader title="تفاصيل النتيجة" onBack={()=>router.back()}/><View style={styles.empty}><EmptyState title="النتيجة غير موجودة" description={resource.error ?? "قد تكون الجهة لم تعد متاحة."} actionTitle="العودة" onActionPress={()=>router.back()}/></View></Screen>;
  return (
    <Screen scroll padded={false} contentContainerStyle={styles.content}>
      <Stack.Screen options={{headerShown:false}}/><ScreenHeader title="تفاصيل العيادة" onBack={()=>router.back()}/>
      <View style={styles.hero}><AppText variant="h1">🏥</AppText></View>
      <View style={styles.body}>
        <AppText variant="h1" weight="bold">{place?.name ?? "جاري التحميل..."}</AppText>
        {place ? <>
          <AppText color={COLORS.textSecondary}>{place.address || place.regionName || place.governorateName || "الموقع غير محدد"}</AppText>
          <Card disabled style={styles.card}><AppText weight="bold">معلومات التواصل</AppText>{place.description ? <AppText color={COLORS.textSecondary}>{place.description}</AppText>:null}{place.phone ? <AppText direction="ltr">{place.phone}</AppText>:null}{place.website ? <AppText direction="ltr">{place.website}</AppText>:null}</Card>
          <ActionStack>
            <Button title="عرض على الخريطة" icon="map-outline" onPress={()=>router.push("/map")}/>
            {place.phone ? <Button title="اتصال" variant="outline" icon="call-outline" onPress={()=>void Linking.openURL(`tel:${place.phone}`)}/>:null}
          </ActionStack>
        </>:null}
      </View>
    </Screen>
  );
}
const styles=StyleSheet.create({content:{paddingVertical:0},empty:{flex:1,padding:SPACING.lg,justifyContent:"center"},hero:{height:180,alignItems:"center",justifyContent:"center",backgroundColor:COLORS.surfaceMuted},body:{padding:SPACING.lg,gap:SPACING.md},card:{gap:SPACING.sm}});
