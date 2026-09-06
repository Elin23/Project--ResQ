/**
 * Read-only commercial advertisement delivered to the mobile app.
 * Creation, contracting, payment, approval and scheduling are admin/backend concerns.
 * The mobile client only renders advertisements that the backend marks as active.
 */
export type SponsoredAd = {
  id: string;
  sponsorName: string;
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl?: string;
  startsAt: string;
  endsAt?: string;
  active: boolean;
};
