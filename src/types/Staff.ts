export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  avatar?: string;
  rating?: number;
  active: boolean;
}
