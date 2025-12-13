import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@auth_token";
const USER_KEY = "@user_data";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "business";
  businessId?: string;
  businessName?: string;
  description?: string;
  category?: string;
  categories?: string[];
  district?: string;
  city?: string;
  address?: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
}

export interface AuthToken {
  token: string;
  user: AuthUser;
}

// Auth state listeners
type AuthListener = () => void;
const authListeners: AuthListener[] = [];

export const authService = {
  // Save authentication data
  async saveAuth(token: string, user: AuthUser): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      this.notifyListeners();
    } catch (error) {
      console.error("Error saving auth:", error);
    }
  },

  // Get authentication token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  // Get user data
  async getUser(): Promise<AuthUser | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },

  // Clear authentication data
  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      this.notifyListeners();
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  },

  // Subscribe to auth changes
  subscribe(listener: AuthListener): () => void {
    authListeners.push(listener);
    return () => {
      const index = authListeners.indexOf(listener);
      if (index > -1) {
        authListeners.splice(index, 1);
      }
    };
  },

  // Notify all listeners of auth state change
  notifyListeners() {
    authListeners.forEach((listener) => listener());
  },

  // Mock login
  async login(
    email: string,
    password: string,
    role: "customer" | "business" = "customer"
  ): Promise<AuthToken> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockToken = `mock_token_${Date.now()}`;
    const mockUser: AuthUser = {
      id: "user_" + Date.now(),
      name: role === "business" ? "Business Owner" : "Test User",
      email: email,
      phone: "+1 234 567 8900",
      role: role,
      businessId: role === "business" ? "business_" + Date.now() : undefined,
      businessName: role === "business" ? "Test Business" : undefined,
    };

    await this.saveAuth(mockToken, mockUser);
    return { token: mockToken, user: mockUser };
  },

  // Mock register
  async register(
    userData: Partial<AuthUser>,
    password: string
  ): Promise<AuthToken> {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockToken = `mock_token_${Date.now()}`;
    const mockUser: AuthUser = {
      id: "user_" + Date.now(),
      name: userData.name || "New User",
      email: userData.email || "",
      phone: userData.phone || "",
      role: userData.role || "customer",
      businessId:
        userData.role === "business" ? "business_" + Date.now() : undefined,
      businessName: userData.businessName || "",
      description: userData.description || "",
      category: userData.category || "",
      categories: userData.categories || [],
      district: userData.district || "",
      city: userData.city || "",
      address: userData.address || "",
      fullAddress: userData.fullAddress || "",
      latitude: userData.latitude,
      longitude: userData.longitude,
      amenities: userData.amenities || [],
    };

    await this.saveAuth(mockToken, mockUser);
    return { token: mockToken, user: mockUser };
  },
};
