import { mockAPI } from './mock';
import { Booking } from '../types/Booking';

export const bookingService = {
  async getCustomerBookings(customerId: string): Promise<Booking[]> {
    return mockAPI.getBookingsByCustomerId(customerId);
  },

  async getSalonBookings(salonId: string): Promise<Booking[]> {
    return mockAPI.getBookingsBySalonId(salonId);
  },

  async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    return mockAPI.createBooking(bookingData);
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    return mockAPI.updateBookingStatus(bookingId, status);
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    return mockAPI.updateBookingStatus(bookingId, 'cancelled');
  },
};
