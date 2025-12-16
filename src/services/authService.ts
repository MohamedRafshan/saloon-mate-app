import { doc, setDoc } from "firebase/firestore";
import { salonService } from "../api/salonService";
import { auth, db, firebase } from "../firebaseConfig";
import { Salon } from "../types/Salon";

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

  async getUser(uid: string): Promise<AuthUser | null> {
    if (!uid || typeof uid !== "string") {
      return null;
    }
    try {
      const userDoc = await db.collection("users").doc(uid).get();
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
  async login(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new Error("Email and password are required for login.");
    }
    console.log(email);

    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      console.log(email, password);

      const user = userCredential.user;
      if (!user) {
        throw new Error("User not found after login.");
      }
      const authUser = await this.getUser(user.uid);
      if (!authUser) {
        throw new Error("User data not found in Firestore.");
      }
      console.log("created", authUser);

      return authUser;
    } catch (error) {
      console.log("Error login", error);
    }
  },

  // Register
  async register(userData: Partial<AuthUser>, password: string): Promise<any> {
    if (!userData.email) {
      throw new Error("Email is required for registration.");
    }

    console.log(userData);

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        userData.email,
        password
      );
      const user = userCredential.user;
      if (!user) {
        throw new Error("User not found after registration.");
      }
      console.log("check1");

      const newUser: AuthUser = {
        id: user.uid,
        name: userData.name || "New User",
        email: user.email || "",
        phone: userData.phone || "",
        role: userData.role || "customer",
      };

      console.log("check2");

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
      console.log("check3");
      // Save the user profile to Firestore
      try {
        await setDoc(doc(db, "users", user.uid), newUser);
      } catch (error) {
        console.log("Error saving user to Firestore:", error);
      }
      // await db.collection("users").doc(user.uid).set(newUser);
      console.log("check4");

      return newUser;
    } catch (error) {
      console.log("Error register", error);
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
