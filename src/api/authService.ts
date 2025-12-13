import { mockAPI } from './mock';
import { User } from '../types/User';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    return mockAPI.login(email, password);
  },

  async register(userData: Partial<User>): Promise<User> {
    return mockAPI.register(userData);
  },

  async getUserProfile(userId: string): Promise<User> {
    return mockAPI.getUserById(userId);
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const user = await mockAPI.getUserById(userId);
    return { ...user, ...data };
  },
};
