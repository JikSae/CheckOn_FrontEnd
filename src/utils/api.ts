export const API_URL = import.meta.env.VITE_API_URL;
export const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:4000/auth";

export type CreateChecklistPayload = {
  userId:      number;
  title:       string;
  travelType:  'ACTIVITY' | 'RECREATION' | 'EXPLORATION' | 'BUSINESS';
  cityId:      number;
  travelStart: string;  // ex. '2025-07-20T00:00:00.000Z'
  travelEnd:   string;  // ex. '2025-07-25T00:00:00.000Z'
  content?:    string;
  items: Array<{
    itemId:     number | null;
    packingBag: 'HAND' | 'HOLD';
  }>;
}
