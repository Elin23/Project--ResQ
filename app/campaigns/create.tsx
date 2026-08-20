import CampaignManagerRouteGate from "@/src/features/donations/CampaignManagerRouteGate";
import CreateDonationCampaignScreen from "@/src/features/donations/screens/CreateDonationCampaignScreen";

export default function CreateCampaignRoute() {
  return (
    <CampaignManagerRouteGate>
      <CreateDonationCampaignScreen />
    </CampaignManagerRouteGate>
  );
}
