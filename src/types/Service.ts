export interface Service {
  id: string;
  salonId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  duration: string;
  category: string;
  discount?: string;
}
