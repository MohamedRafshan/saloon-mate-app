export interface Booking {
  id: string;
  customerId: string;
  salonId: string;
  serviceIds: string[];
  staffId?: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  notes?: string;
  createdAt: string;
  notificationIds?: string[];
}
