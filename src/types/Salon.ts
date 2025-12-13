export interface Salon {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: OpeningHours[];
  featured?: boolean;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}
