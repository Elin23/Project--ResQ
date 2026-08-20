import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '@/src/components/ui/AppText';
import Input from '@/src/components/ui/Input';
import type { DailyOpeningHours } from '@/src/domain/service-places';
import { COLORS, RADIUS, SPACING } from '@/src/theme';

const DAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'] as const;
type Props={value:DailyOpeningHours[];onChange:(value:DailyOpeningHours[])=>void};
export function defaultOpeningHours(): DailyOpeningHours[] { return DAYS.map((_,day)=>({day:day as DailyOpeningHours['day'],open: day===5 ? null : '09:00',close: day===5 ? null : '18:00'})); }
export default function OpeningHoursEditor({value,onChange}:Props){
  const update=(day:number, patch:Partial<DailyOpeningHours>)=>onChange(value.map(x=>x.day===day?{...x,...patch}:x));
  return <View style={styles.wrap}><AppText weight="bold">أوقات الدوام</AppText><AppText variant="caption" color={COLORS.textSecondary}>استخدم صيغة 24 ساعة. اختر «مغلق» للأيام غير العاملة.</AppText>{value.map(item=>{
    const closed=item.open==null&&item.close==null;
    return <View key={item.day} style={styles.row}><View style={styles.dayRow}><AppText weight="medium">{DAYS[item.day]}</AppText><Pressable accessibilityRole="switch" accessibilityLabel={`${DAYS[item.day]}، ${closed ? "مغلق" : "مفتوح"}`} accessibilityState={{ checked: !closed }} onPress={()=>update(item.day,closed?{open:'09:00',close:'18:00'}:{open:null,close:null})} style={[styles.badge,closed&&styles.closed]}><AppText variant="caption">{closed?'مغلق':'مفتوح'}</AppText></Pressable></View>{!closed&&<View style={styles.times}><Input containerStyle={styles.time} label="من" value={item.open??''} onChangeText={v=>update(item.day,{open:v})} contentDirection="ltr" placeholder="09:00"/><Input containerStyle={styles.time} label="إلى" value={item.close??''} onChangeText={v=>update(item.day,{close:v})} contentDirection="ltr" placeholder="18:00"/></View>}</View>})}</View>;
}
const styles=StyleSheet.create({wrap:{gap:SPACING.sm},row:{borderWidth:1,borderColor:COLORS.border,borderRadius:RADIUS.md,padding:SPACING.sm,gap:SPACING.sm},dayRow:{flexDirection:'row',direction:'rtl',alignItems:'center',justifyContent:'space-between'},badge:{paddingHorizontal:SPACING.sm,paddingVertical:6,borderRadius:RADIUS.full,backgroundColor:COLORS.surfaceSubtle},closed:{opacity:.65},times:{flexDirection:'row',direction:'rtl',gap:SPACING.sm},time:{flex:1}});
