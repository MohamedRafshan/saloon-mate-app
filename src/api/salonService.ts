import { mockAPI } from './mock';
import { Salon } from '../types/Salon';

export const salonService = {
  async getAllSalons(): Promise<Salon[]> {
    return mockAPI.getSalons();
  },

  async getSalonById(id: string): Promise<Salon> {
    return mockAPI.getSalonById(id);
  },

  async searchSalons(query: string, city?: string): Promise<Salon[]> {
    return mockAPI.searchSalons(query, city);
  },

  async getNearby(latitude: number, longitude: number, radius: number): Promise<Salon[]> {
    const salons = await mockAPI.getSalons();
    // Mock distance calculation
    return salons;
  },

  async updateSalon(id: string, data: Partial<Salon>): Promise<Salon> {
    const salon = await mockAPI.getSalonById(id);
    return { ...salon, ...data };
  },
};
