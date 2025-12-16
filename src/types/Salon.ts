export interface Salon {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  category: string;
  categories: string[];
  image: string;
  images: string[];
  openingHours: OpeningHours;
  location: {
    latitude: number;
    longitude: number;
  };
  services: string[];
  amenities: string[];
  createdAt: string; // Should be a Timestamp from Firebase, but string for now
}

export interface OpeningHours {
  [day: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}
