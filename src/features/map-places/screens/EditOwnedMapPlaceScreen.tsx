import { StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppText from '@/src/components/ui/AppText';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import ErrorState from '@/src/components/ui/ErrorState';
import Input from '@/src/components/ui/Input';
import LoadingState from '@/src/components/ui/LoadingState';
import Screen from '@/src/components/ui/Screen';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { useFeedback } from '@/src/components/ui/FeedbackProvider';
import { canUserManageMapPlace, SERVICE_PLACE_TYPE_META } from '@/src/domain/service-places';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { useSession } from '@/src/features/session/SessionContext';
import { repositories } from '@/src/services/domain/repositories';
import { COLORS, SPACING } from '@/src/theme';
import { ROUTES } from '@/src/navigation/routes';

export default function EditOwnedMapPlaceScreen(){
  const router=useRouter(); const { showFeedback } = useFeedback(); const {id}=useLocalSearchParams<{id:string}>(); const {account}=useSession();
  const loader=useCallback(()=>account?.kind==='user'?repositories.servicePlaces.getOwnedByUser(id,account.id):Promise.resolve(null),[id,account]);
  const resource=useAsyncResource(loader,null,'تعذر تحميل بيانات الجهة.');
  const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [website,setWebsite]=useState(''); const [description,setDescription]=useState(''); const [saving,setSaving]=useState(false);
  useEffect(()=>{const p=resource.data;if(!p)return;setName(p.name);setPhone(p.phone);setWebsite(p.website??'');setDescription(p.description??'');},[resource.data]);
  const owned=Boolean(resource.data&&account?.kind==='user'&&canUserManageMapPlace(resource.data.ownerUserId,account.id));
  const save=async()=>{
    if(!resource.data||!account||account.kind!=='user'||!owned)return;
    if(!name.trim()||!phone.trim()) return showFeedback({title:'راجع البيانات',message:'اسم الجهة ورقم الهاتف مطلوبان.',tone:'warning'});
    try{setSaving(true);await repositories.servicePlaces.updateOwnedByUser(resource.data.id,account.id,{name:name.trim(),phone:phone.trim(),website:website.trim()||undefined,openingHours:resource.data.openingHours,description:description.trim()||undefined});showFeedback({title:'تم الحفظ',message:'تم تحديث المعلومات التشغيلية للجهة.',tone:'success'});router.replace(ROUTES.myMapPlaces);}catch{showFeedback({title:'تعذر الحفظ',message:'لم نتمكن من تحديث الجهة أو أنك لا تملك صلاحية تعديلها.',tone:'error'});}finally{setSaving(false);}
  };
  if(resource.loading)return <Screen><LoadingState/></Screen>; if(resource.error)return <Screen><ErrorState description={resource.error} onRetry={resource.reload}/></Screen>; if(!resource.data||!owned)return <Screen><ErrorState description="الجهة غير موجودة أو لا تملك صلاحية تعديلها."/></Screen>;
  const place = resource.data;
  return <Screen scroll padded={false} surface="app"><ScreenHeader title="إدارة الجهة" subtitle={SERVICE_PLACE_TYPE_META[place.type].label} onBack={()=>router.back()}/><View style={styles.content}>
    <Card backgroundColor={COLORS.surfaceSubtle} borderColor={COLORS.divider}><AppText weight="bold">التعديلات المتاحة</AppText><AppText color={COLORS.textSecondary} style={styles.noticeCopy}>يمكن تعديل الاسم، رقم التواصل، الموقع الإلكتروني والوصف مباشرة. تغيير النوع أو الموقع غير متاح حاليًا من تطبيق الجوال؛ تواصل مع الإدارة لإجراء تعديل على البيانات المعتمدة.</AppText></Card>
    <Input label="اسم الجهة" required value={name} onChangeText={setName}/><Input label="رقم الهاتف" required value={phone} onChangeText={setPhone} keyboardType="phone-pad" contentDirection="ltr"/><Input label="الموقع الإلكتروني" value={website} onChangeText={setWebsite} keyboardType="url" autoCapitalize="none" contentDirection="ltr"/><Input label="الوصف" value={description} onChangeText={setDescription} multiline/><Button title="حفظ التغييرات" loading={saving} onPress={()=>void save()}/>{null}
  </View></Screen>;
}
const styles=StyleSheet.create({content:{padding:SPACING.md,gap:SPACING.md,paddingBottom:SPACING.xl},noticeCopy:{marginTop:SPACING.xs}});
