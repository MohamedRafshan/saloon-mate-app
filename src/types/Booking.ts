export interface Booking {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  staffId?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  currency: string;
  notes?: string;
  createdAt: string;
}
