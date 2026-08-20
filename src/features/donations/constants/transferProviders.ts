export type DonationTransferProvider = {
  id: string;
  name: string;
  shortName: string;
  instructions?: string;
};

export const DONATION_TRANSFER_PROVIDERS: DonationTransferProvider[] = [
  { id: "al-haram", name: "الهرم للحوالات المالية", shortName: "الهرم" },
  { id: "al-fouad", name: "الفؤاد للحوالات المالية", shortName: "الفؤاد" },
];
