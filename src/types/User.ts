export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'owner' | 'staff';
  createdAt: string;
  avatar?: string;
}
