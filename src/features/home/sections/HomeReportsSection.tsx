import { ScrollView, View } from "react-native";
import SectionHeader from "@/src/components/ui/SectionHeader";
import ActiveReportCard from "../components/ActiveReportCard";
import NearbyReportCard from "../components/NearbyReportCard";
import { NEARBY_REPORTS } from "../constants/home";
import { styles } from "../screens/Home.styles";

type Props = { onOpenReports: () => void };
export default function HomeReportsSection({ onOpenReports }: Props) {
  return <>
    <View style={styles.section}>
      <SectionHeader title="بلاغاتي" actionLabel="عرض الكل" onActionPress={onOpenReports} />
      <ActiveReportCard title="قطة ضالة" reportNumber="RQ-2481" progress={65} imageUrl="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80" onPress={onOpenReports} />
    </View>
    <View style={styles.section}>
      <SectionHeader title="بلاغات قريبة منك" actionLabel="عرض الكل" onActionPress={onOpenReports} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {NEARBY_REPORTS.map((report) => <NearbyReportCard key={report.id} {...report} onPress={onOpenReports} />)}
      </ScrollView>
    </View>
  </>;
}
