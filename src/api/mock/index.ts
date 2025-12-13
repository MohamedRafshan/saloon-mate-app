import usersData from './users.json';
import salonsData from './salons.json';
import servicesData from './services.json';
import bookingsData from './bookings.json';
import { User } from '../../types/User';
import { Salon } from '../../types/Salon';
import { Service } from '../../types/Service';
import { Booking } from '../../types/Booking';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(1000);
    const user = usersData.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return user as User;
  },

  async register(userData: Partial<User>): Promise<User> {
    await delay(1000);
    const newUser: User = {
      id: `user${Date.now()}`,
      email: userData.email!,
      name: userData.name!,
      phone: userData.phone!,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString(),
    };
    return newUser;
  },

  // Salons
  async getSalons(): Promise<Salon[]> {
    await delay(800);
    return salonsData as Salon[];
  },

  async getSalonById(id: string): Promise<Salon> {
    await delay(500);
    const salon = salonsData.find(s => s.id === id);
    if (!salon) throw new Error('Salon not found');
    return salon as Salon;
  },

  async searchSalons(query: string, city?: string): Promise<Salon[]> {
    await delay(700);
    return salonsData.filter(salon => {
      const matchesQuery = salon.name.toLowerCase().includes(query.toLowerCase());
      const matchesCity = !city || salon.city.toLowerCase() === city.toLowerCase();
      return matchesQuery && matchesCity;
    }) as Salon[];
  },

  // Services
  async getServicesBySalonId(salonId: string): Promise<Service[]> {
    await delay(500);
    return servicesData.filter(s => s.salonId === salonId) as Service[];
  },

  async getServiceById(id: string): Promise<Service> {
    await delay(300);
    const service = servicesData.find(s => s.id === id);
    if (!service) throw new Error('Service not found');
    return service as Service;
  },

  // Bookings
  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    await delay(600);
    return bookingsData.filter(b => b.customerId === customerId) as Booking[];
  },

  async getBookingsBySalonId(salonId: string): Promise<Booking[]> {
    await delay(600);
    return bookingsData.filter(b => b.salonId === salonId) as Booking[];
  },

  async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    await delay(1000);
    const newBooking: Booking = {
      id: `booking${Date.now()}`,
      customerId: bookingData.customerId!,
      salonId: bookingData.salonId!,
      serviceIds: bookingData.serviceIds!,
      date: bookingData.date!,
      time: bookingData.time!,
      status: 'pending',
      totalPrice: bookingData.totalPrice!,
      paymentStatus: 'pending',
      notes: bookingData.notes,
      createdAt: new Date().toISOString(),
    };
    return newBooking;
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    await delay(500);
    const booking = bookingsData.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    return { ...booking, status } as Booking;
  },

  // Users
  async getUserById(id: string): Promise<User> {
    await delay(300);
    const user = usersData.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user as User;
  },

  // Owner specific
  async getOwnerSalons(ownerId: string): Promise<Salon[]> {
    await delay(600);
    return salonsData.filter(s => s.ownerId === ownerId) as Salon[];
  },

  async updateSalon(salonId: string, data: Partial<Salon>): Promise<Salon> {
    await delay(800);
    const salon = salonsData.find(s => s.id === salonId);
    if (!salon) throw new Error('Salon not found');
    return { ...salon, ...data } as Salon;
  },

  async createService(serviceData: Partial<Service>): Promise<Service> {
    await delay(800);
    const newService: Service = {
      id: `service${Date.now()}`,
      salonId: serviceData.salonId!,
      name: serviceData.name!,
      description: serviceData.description!,
      duration: serviceData.duration!,
      price: serviceData.price!,
      category: serviceData.category!,
      available: true,
    };
    return newService;
  },

  async updateService(serviceId: string, data: Partial<Service>): Promise<Service> {
    await delay(500);
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) throw new Error('Service not found');
    return { ...service, ...data } as Service;
  },

  async deleteService(serviceId: string): Promise<void> {
    await delay(500);
    // Mock delete - in real app, remove from database
  },

  // Stats for owner dashboard
  async getOwnerStats(ownerId: string): Promise<{
    todayBookings: number;
    todayRevenue: number;
    monthBookings: number;
    averageRating: number;
  }> {
    await delay(600);
    const ownerSalons = salonsData.filter(s => s.ownerId === ownerId);
    const salonIds = ownerSalons.map(s => s.id);
    const ownerBookings = bookingsData.filter(b => salonIds.includes(b.salonId));

    return {
      todayBookings: 24,
      todayRevenue: 1250,
      monthBookings: 156,
      averageRating: ownerSalons.reduce((sum, s) => sum + s.rating, 0) / ownerSalons.length,
    };
  },
};
