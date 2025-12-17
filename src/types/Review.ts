export interface Review {
  id: string;
  salonId: string;
  userId: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
  staffName?: string;
}
