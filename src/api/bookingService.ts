import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Booking } from "../types/Booking";

export const bookingService = {
  async getCustomerBookings(customerId: string): Promise<Booking[]> {
    const bookingsCol = collection(db, "bookings");
    const q = query(bookingsCol, where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  async getSalonBookings(salonId: string): Promise<Booking[]> {
    const bookingsCol = collection(db, "bookings");
    const q = query(bookingsCol, where("salonId", "==", salonId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
  },

  async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    const bookingsCol = collection(db, "bookings");
    const newBookingData = {
      ...bookingData,
      createdAt: Timestamp.now(),
      status: "pending",
      paymentStatus: "pending",
    };
    const docRef = await addDoc(bookingsCol, newBookingData);
    return {
      id: docRef.id,
      ...newBookingData,
      createdAt: newBookingData.createdAt.toDate().toISOString(),
    } as Booking;
  },

  async updateBookingStatus(
    bookingId: string,
    status: Booking["status"]
  ): Promise<void> {
    const bookingDocRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingDocRef, { status });
  },

  async cancelBooking(bookingId: string): Promise<void> {
    const bookingDocRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingDocRef, { status: "cancelled" });
  },
};
