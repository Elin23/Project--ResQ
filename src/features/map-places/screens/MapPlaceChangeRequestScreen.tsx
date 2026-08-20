import { StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AppText from '@/src/components/ui/AppText';
import Button from '@/src/components/ui/Button';
import Chip from '@/src/components/ui/Chip';
import ErrorState from '@/src/components/ui/ErrorState';
import Input from '@/src/components/ui/Input';
import LoadingState from '@/src/components/ui/LoadingState';
import Screen from '@/src/components/ui/Screen';
import ScreenHeader from '@/src/components/ui/ScreenHeader';
import { useFeedback } from '@/src/components/ui/FeedbackProvider';
import MapPlaceLocationPicker, { type MapPlaceLocationValue } from '@/src/features/map-places/components/MapPlaceLocationPicker';
import { SERVICE_PLACE_TYPE_META, canUserManageMapPlace, type ServicePlaceType } from '@/src/domain/service-places';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { useSession } from '@/src/features/session/SessionContext';
import { repositories } from '@/src/services/domain/repositories';
import { COLORS, SPACING } from '@/src/theme';
import { ROUTES } from '@/src/navigation/routes';

const TYPES=['clinic','pet_store','pet_hotel','cat_cafe','grooming','shelter','other'] as const satisfies readonly Exclude<ServicePlaceType,'organization'>[];
export default function MapPlaceChangeRequestScreen(){
  const router=useRouter(); const { showFeedback } = useFeedback(); const {id}=useLocalSearchParams<{id:string}>(); const {account}=useSession();
  const loader=useCallback(()=>account?.kind==='user'?repositories.servicePlaces.getOwnedByUser(id,account.id):Promise.resolve(null),[id,account]);
  const resource=useAsyncResource(loader,null,'تعذر تحميل الجهة.');
  const [type,setType]=useState<(typeof TYPES)[number]>('clinic'); const [address,setAddress]=useState(''); const [location,setLocation]=useState<MapPlaceLocationValue>({latitude:33.5138,longitude:36.2765}); const [licenseNumber,setLicenseNumber]=useState(''); const [supportingDocumentUri,setSupportingDocumentUri]=useState<string|undefined>(); const [reason,setReason]=useState(''); const [saving,setSaving]=useState(false);
  useEffect(()=>{if(!resource.data)return;setType(resource.data.type==='organization'?'other':resource.data.type);setAddress(resource.data.address);setLocation({latitude:resource.data.latitude,longitude:resource.data.longitude});setLicenseNumber(resource.data.licenseNumber??'');setSupportingDocumentUri(resource.data.supportingDocumentUri);},[resource.data]);
  const owned=Boolean(resource.data&&account?.kind==='user'&&canUserManageMapPlace(resource.data.ownerUserId,account.id));
  const pick=async()=>{const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:.85});if(!result.canceled&&result.assets[0]?.uri)setSupportingDocumentUri(result.assets[0].uri);};
  const submit=async()=>{if(!resource.data||!account||account.kind!=='user'||!owned)return;if(!reason.trim())return showFeedback({title:'سبب التغيير مطلوب',message:'اشرح باختصار لماذا تحتاج تعديل البيانات المعتمدة.',tone:'warning'});if(type==='clinic'&&!licenseNumber.trim())return showFeedback({title:'راجع البيانات',message:'رقم الترخيص مطلوب للعيادة.',tone:'warning'});
    const changes:any={}; if(type!==resource.data.type)changes.type=type;if(address.trim()!==resource.data.address)changes.address=address.trim();if(location.latitude!==resource.data.latitude)changes.latitude=location.latitude;if(location.longitude!==resource.data.longitude)changes.longitude=location.longitude;if(licenseNumber.trim()!==(resource.data.licenseNumber??''))changes.licenseNumber=licenseNumber.trim()||undefined;if(supportingDocumentUri!==resource.data.supportingDocumentUri)changes.supportingDocumentUri=supportingDocumentUri;
    if(!Object.keys(changes).length)return showFeedback({title:'لا توجد تغييرات',message:'عدّل نوع الجهة أو الموقع أو بيانات التحقق أولًا.',tone:'info'});
    try{setSaving(true);await repositories.mapPlaceChangeRequests.create({placeId:resource.data.id,ownerUserId:account.id,changes,reason:reason.trim()});showFeedback({title:'تم إرسال الطلب',message:'ستبقى البيانات الحالية منشورة حتى تتم مراجعة التغيير واعتماده.',tone:'success'});router.replace(ROUTES.myMapPlaces);}catch(error){showFeedback({title:'تعذر إرسال الطلب',message:error instanceof Error?error.message:'حاول مرة أخرى.',tone:'error'});}finally{setSaving(false);}
  };
  if(resource.loading)return <Screen><LoadingState/></Screen>;if(resource.error)return <Screen><ErrorState description={resource.error} onRetry={resource.reload}/></Screen>;if(!resource.data||!owned)return <Screen><ErrorState description="الجهة غير موجودة أو لا تملك صلاحية إدارتها."/></Screen>;
  return <Screen scroll padded={false} surface="app"><ScreenHeader title="طلب تغيير بيانات حساسة" subtitle="لن تتغير البيانات المنشورة قبل الاعتماد" onBack={()=>router.back()}/><View style={styles.content}><AppText color={COLORS.textSecondary}>النوع والموقع والترخيص جزء من هوية الجهة المعتمدة، لذلك أي تغيير عليها يمر بمراجعة جديدة.</AppText><View style={styles.chips}>{TYPES.map(x=><Chip key={x} label={SERVICE_PLACE_TYPE_META[x].label} selected={type===x} onPress={()=>setType(x)}/>)}</View><Input label="العنوان" required value={address} onChangeText={setAddress}/><MapPlaceLocationPicker value={location} onChange={setLocation}/>{type==='clinic'&&<><Input label="رقم الترخيص" required value={licenseNumber} onChangeText={setLicenseNumber} contentDirection="ltr"/><Button title={supportingDocumentUri?'تغيير إثبات الترخيص':'إرفاق إثبات الترخيص'} variant="outline" onPress={()=>void pick()}/></>}<Input label="سبب التغيير" required value={reason} onChangeText={setReason} multiline placeholder="مثال: انتقلت الجهة إلى فرع جديد..."/><Button title="إرسال طلب التغيير" loading={saving} onPress={()=>void submit()}/></View></Screen>;
}
const styles=StyleSheet.create({content:{padding:SPACING.md,gap:SPACING.md,paddingBottom:SPACING.xl},chips:{flexDirection:'row',direction:'rtl',flexWrap:'wrap',gap:SPACING.sm}});
