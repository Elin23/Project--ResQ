import CampaignManagerRouteGate from "@/src/features/donations/CampaignManagerRouteGate";
import CreateDonationCampaignScreen from "@/src/features/donations/screens/CreateDonationCampaignScreen";

export default function EditCampaignRoute() {
  return (
    <CampaignManagerRouteGate>
      <CreateDonationCampaignScreen />
    </CampaignManagerRouteGate>
  );
}
