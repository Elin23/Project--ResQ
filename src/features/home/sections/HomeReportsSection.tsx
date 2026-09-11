import { useEffect, useState } from "react";
import { View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import SectionHeader from "@/src/components/ui/SectionHeader";
import ActiveReportCard from "../components/ActiveReportCard";
import { useSession } from "@/src/features/session/SessionContext";
import { repositories } from "@/src/services/domain/repositories";
import type { Report } from "@/src/domain";
import { COLORS } from "@/src/theme";
import { styles } from "../screens/Home.styles";

type Props = { onOpenReports: () => void };

const progressFor = (status: Report["status"]) => status === "closed" ? 100 : status === "assigned" ? 65 : status === "approved" ? 35 : 10;

export default function HomeReportsSection({ onOpenReports }: Props) {
  const { account } = useSession();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!account || account.kind !== "user") { setLoading(false); return () => { active = false; }; }
    repositories.reports.listByUser(account.id)
      .then((items) => { if (active) setReport(items.find((item) => item.status !== "closed") ?? items[0] ?? null); })
      .catch(() => { if (active) setReport(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [account]);
  if (loading) return <View style={styles.section}><SectionHeader title="بلاغاتي" /><AppText variant="bodySmall" color={COLORS.textSecondary}>جاري تحميل البلاغات...</AppText></View>;
  if (!report) return null;
  return <View style={styles.section}>
    <SectionHeader title="بلاغاتي" actionLabel="عرض الكل" onActionPress={onOpenReports} />
    <ActiveReportCard title={report.title} reportNumber={report.code} progress={progressFor(report.status)} imageUrl={report.imageUrl} onPress={onOpenReports} />
  </View>;
}
