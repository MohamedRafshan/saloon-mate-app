import { doc, setDoc } from "firebase/firestore";
import { salonService } from "../api/salonService";
import { auth, db, firebase } from "../firebaseConfig";
import { Salon } from "../types/Salon";
import { presentLocalNotification, registerPushToken } from "./notifications";

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

// Auth state listeners
type AuthListener = (user: AuthUser | null) => void;
const authListeners: AuthListener[] = [];

export const authService = {
  // Subscribe to auth changes
  subscribe(listener: AuthListener): () => void {
    const firebaseUnsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const authUser = await this.getUser(user.uid);
        listener(authUser);
      } else {
        listener(null);
      }
    });

    // Add a wrapper to our internal listeners array if needed, though onAuthStateChanged is often sufficient
    const customListener = (user: AuthUser | null) => listener(user);
    authListeners.push(customListener);

    return () => {
      firebaseUnsubscribe();
      const index = authListeners.indexOf(customListener);
      if (index > -1) {
        authListeners.splice(index, 1);
      }
    };
  },

  async getUser(uid?: string): Promise<AuthUser | null> {
    const effectiveUid = uid || auth.currentUser?.uid || "";
    if (!effectiveUid || typeof effectiveUid !== "string") {
      return null;
    }
    try {
      const userDoc = await db.collection("users").doc(effectiveUid).get();
      if (userDoc.exists) {
        return userDoc.data() as AuthUser;
      }
      return null;
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
      return null;
    }
  },

  // Login
  async login(email: string, password: string): Promise<AuthUser> {
    if (!email || !password) {
      throw new Error("Email and password are required for login.");
    }

    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );

      const user = userCredential.user;
      if (!user) {
        throw new Error("User not found after login.");
      }
      const authUser = await this.getUser(user.uid);
      if (!authUser) {
        throw new Error("User data not found in Firestore.");
      }

      // Register for push notifications
      await registerPushToken();
      // Send a welcome back notification
      presentLocalNotification(
        "Welcome Back!",
        `You have successfully logged in as ${authUser.name}`
      );

      return authUser;
    } catch (error: any) {
      console.log("Error login", error);
      throw new Error(error.message || "Login failed");
    }
  },

  // Register
  async register(userData: Partial<AuthUser>, password: string): Promise<any> {
    if (!userData.email) {
      throw new Error("Email is required for registration.");
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        userData.email,
        password
      );
      const user = userCredential.user;
      if (!user) {
        throw new Error("User not found after registration.");
      }

      const newUser: AuthUser = {
        id: user.uid,
        name: userData.name || "New User",
        email: user.email || "",
        phone: userData.phone || "",
        role: userData.role || "customer",
      };

      if (newUser.role === "business") {
        const salonData: Partial<Salon> = {
          name: userData.businessName,
          description: userData.description,
          categories: userData.categories,
          district: userData.district,
          city: userData.city,
          address: userData.address,
          phone: userData.phone,
          email: userData.email,
          location: {
            latitude: userData.latitude || 0,
            longitude: userData.longitude || 0,
          },
          amenities: userData.amenities,
        };
        const salonId = await salonService.createSalon(user.uid, salonData);
        newUser.businessId = salonId;
      }
      // Save the user profile to Firestore
      await setDoc(doc(db, "users", user.uid), newUser);

      // Register for push notifications
      await registerPushToken();

      return newUser;
    } catch (error: any) {
      console.log("Error register", error);
      throw new Error(error.message || "Registration failed");
    }
  },
  // Clear authentication data (sign out)
  async clearAuth(): Promise<void> {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },
  // Get current Firebase user
  getCurrentFirebaseUser(): firebase.User | null {
    return auth.currentUser;
  },
  // Check if the user is authenticated
  isAuthenticated: () => {
    return !!auth.currentUser;
  },
};
