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
import ToggleField from '@/src/components/ui/ToggleField';
import { useFeedback } from '@/src/components/ui/FeedbackProvider';
import OpeningHoursEditor from '@/src/features/map-places/components/OpeningHoursEditor';
import { canUserManageMapPlace, SERVICE_PLACE_TYPE_META, validateOpeningHours, type DailyOpeningHours } from '@/src/domain/service-places';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { useSession } from '@/src/features/session/SessionContext';
import { repositories } from '@/src/services/domain/repositories';
import { COLORS, SPACING } from '@/src/theme';
import { ROUTES, mapPlaceChangeRequestRoute } from '@/src/navigation/routes';

export default function EditOwnedMapPlaceScreen(){
  const router=useRouter(); const { showFeedback } = useFeedback(); const {id}=useLocalSearchParams<{id:string}>(); const {account}=useSession();
  const loader=useCallback(()=>account?.kind==='user'?repositories.servicePlaces.getOwnedByUser(id,account.id):Promise.resolve(null),[id,account]);
  const resource=useAsyncResource(loader,null,'تعذر تحميل بيانات الجهة.');
  const [acceptsFreeCases,setAcceptsFreeCases]=useState(false); const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [secondaryPhone,setSecondaryPhone]=useState(''); const [whatsapp,setWhatsapp]=useState(''); const [website,setWebsite]=useState(''); const [responsiblePerson,setResponsiblePerson]=useState(''); const [description,setDescription]=useState(''); const [openingHours,setOpeningHours]=useState<DailyOpeningHours[]>([]); const [saving,setSaving]=useState(false);
  useEffect(()=>{const p=resource.data;if(!p)return;setName(p.name);setPhone(p.phone);setSecondaryPhone(p.secondaryPhone??'');setWhatsapp(p.whatsapp??'');setWebsite(p.website??'');setResponsiblePerson(p.responsiblePerson??'');setDescription(p.description??'');setOpeningHours(p.openingHours.map(x=>({...x})));setAcceptsFreeCases(Boolean(p.acceptsFreeCases));},[resource.data]);
  const owned=Boolean(resource.data&&account?.kind==='user'&&canUserManageMapPlace(resource.data.ownerUserId,account.id));
  const save=async()=>{
    if(!resource.data||!account||account.kind!=='user'||!owned)return;
    if(!name.trim()||!phone.trim()) return showFeedback({title:'راجع البيانات',message:'اسم الجهة ورقم الهاتف مطلوبان.',tone:'warning'});
    const hoursError=validateOpeningHours(openingHours); if(hoursError)return showFeedback({title:'راجع أوقات الدوام',message:hoursError,tone:'warning'});
    try{setSaving(true);await repositories.servicePlaces.updateOwnedByUser(resource.data.id,account.id,{name:name.trim(),phone:phone.trim(),secondaryPhone:secondaryPhone.trim()||undefined,whatsapp:whatsapp.trim()||undefined,website:website.trim()||undefined,responsiblePerson:responsiblePerson.trim()||undefined,emergency24h:resource.data.emergency24h,acceptsFreeCases,openingHours,description:description.trim()||undefined});showFeedback({title:'تم الحفظ',message:'تم تحديث المعلومات التشغيلية للجهة.',tone:'success'});router.replace(ROUTES.myMapPlaces);}catch{showFeedback({title:'تعذر الحفظ',message:'لم نتمكن من تحديث الجهة أو أنك لا تملك صلاحية تعديلها.',tone:'error'});}finally{setSaving(false);}
  };
  if(resource.loading)return <Screen><LoadingState/></Screen>; if(resource.error)return <Screen><ErrorState description={resource.error} onRetry={resource.reload}/></Screen>; if(!resource.data||!owned)return <Screen><ErrorState description="الجهة غير موجودة أو لا تملك صلاحية تعديلها."/></Screen>;
  const place = resource.data;
  return <Screen scroll padded={false} surface="app"><ScreenHeader title="إدارة الجهة" subtitle={SERVICE_PLACE_TYPE_META[place.type].label} onBack={()=>router.back()}/><View style={styles.content}>
    <Card backgroundColor={COLORS.surfaceSubtle} borderColor={COLORS.divider}><AppText weight="bold">التعديلات اليومية</AppText><AppText color={COLORS.textSecondary} style={styles.noticeCopy}>يمكن تعديل الاسم، التواصل، الوصف وأوقات الدوام مباشرة. تغيير النوع أو الموقع أو بيانات الترخيص يحتاج مراجعة جديدة.</AppText></Card>
    <Input label="اسم الجهة" required value={name} onChangeText={setName}/><Input label="رقم الهاتف" required value={phone} onChangeText={setPhone} keyboardType="phone-pad" contentDirection="ltr"/><Input label="رقم بديل" value={secondaryPhone} onChangeText={setSecondaryPhone} keyboardType="phone-pad" contentDirection="ltr"/><Input label="واتساب" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" contentDirection="ltr"/><Input label="الموقع الإلكتروني" value={website} onChangeText={setWebsite} keyboardType="url" autoCapitalize="none" contentDirection="ltr"/><Input label="الشخص المسؤول" value={responsiblePerson} onChangeText={setResponsiblePerson}/><Input label="الوصف" value={description} onChangeText={setDescription} multiline/><ToggleField label="استقبال حالات مجانية" description="يمكن تغيير هذا البيان مباشرة وسيظهر للمستخدمين في تفاصيل الجهة." value={acceptsFreeCases} onValueChange={setAcceptsFreeCases}/><OpeningHoursEditor value={openingHours} onChange={setOpeningHours}/><Button title="حفظ التغييرات" loading={saving} onPress={()=>void save()}/><Button title="طلب تغيير النوع أو الموقع أو الترخيص" variant="outline" onPress={()=>router.push(mapPlaceChangeRequestRoute(place.id))}/>
  </View></Screen>;
}
const styles=StyleSheet.create({content:{padding:SPACING.md,gap:SPACING.md,paddingBottom:SPACING.xl},noticeCopy:{marginTop:SPACING.xs}});
