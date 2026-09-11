/**
 * Transfer providers are configured by the backend administration.
 * This module intentionally contains only the UI view type — no fallback/mock providers.
 */
export type DonationTransferProvider = {
  id: string;
  code: string;
  name: string;
  shortName: string;
  instructions?: string;
  recipientName?: string;
  recipientAccount?: string;
};
