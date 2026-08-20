import { View, Image, StyleSheet } from "react-native";
import Card from "@/src/components/ui/Card";
import Chip from "@/src/components/ui/Chip";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import MetaRow from "@/src/components/ui/MetaRow";
import { Report } from "@/src/types";
import { COLORS, SPACING } from "@/src/theme";

type Props = { report: Report; onHelpPress: () => void };
const STATUS_CONFIG = {
  pending: { label: "قيد الانتظار", color: COLORS.statusPending },
  assigned: { label: "قيد التنفيذ", color: COLORS.info },
  approved: { label: "عاجل", color: COLORS.danger },
  closed: { label: "مغلق", color: COLORS.statusClosed },
};
export default function ReportCard({ report, onHelpPress }: Props) {
  const status = STATUS_CONFIG[report.status];
  return <Card padding={0}>
    <View style={styles.imageWrapper}><Image source={{ uri: report.imageUrl }} style={styles.image} /><View style={styles.chipOverlay}><Chip label={status.label} color={status.color} /></View></View>
    <View style={styles.body}><AppText variant="h3" numberOfLines={2}>{report.description}</AppText><MetaRow icon="location" text="حي المزة، دمشق" /><Button title="استجابة" onPress={onHelpPress} /></View>
  </Card>;
}
const styles = StyleSheet.create({ image:{width:"100%",height:180}, imageWrapper:{width:"100%"}, chipOverlay:{position:"absolute",top:SPACING.sm,start:SPACING.sm}, body:{width:"100%",padding:SPACING.md,gap:SPACING.sm} });
