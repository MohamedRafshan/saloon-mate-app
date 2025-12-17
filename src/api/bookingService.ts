import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { sendPushNotification } from "../services/notifications";
import { Booking } from "../types/Booking";

export const bookingService = {
  async getCustomerBookings(customerId: string): Promise<Booking[]> {
    const bookingsCol = collection(db, "bookings");
    const q = query(bookingsCol, where("customerId", "==", customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => mapBooking(docSnap.id, docSnap.data()));
  },

  async getSalonBookings(salonId: string): Promise<Booking[]> {
    const bookingsCol = collection(db, "bookings");
    const q = query(bookingsCol, where("salonId", "==", salonId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => mapBooking(docSnap.id, docSnap.data()));
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

    // Notify salon owner about the new booking (best-effort, non-blocking)
    try {
      await notifySalonOwnerOfBooking(docRef.id, {
        ...newBookingData,
        createdAt: newBookingData.createdAt.toDate().toISOString(),
      } as Booking);
    } catch (e) {
      console.warn("Failed to notify salon owner of booking", e);
    }

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

async function notifySalonOwnerOfBooking(
  bookingId: string,
  bookingData: Booking
) {
  if (!bookingData.salonId) return;
  try {
    const salonSnap = await getDoc(doc(db, "salons", bookingData.salonId));
    if (!salonSnap.exists()) return;
    const salon = salonSnap.data() as any;
    const ownerId = salon.ownerId;
    if (!ownerId) return;

    const ownerSnap = await getDoc(doc(db, "users", ownerId));
    if (!ownerSnap.exists()) return;
    const owner = ownerSnap.data() as any;
    const token = owner.pushToken;
    if (!token) return;

    const servicesCount = bookingData.serviceIds?.length || 0;
    const title = "New booking received";
    const body = `${bookingData.date || ""} ${bookingData.time || ""} • ${servicesCount} service(s)`;

    await sendPushNotification(token, title, body, {
      bookingId,
      salonId: bookingData.salonId,
      customerId: bookingData.customerId,
      services: bookingData.serviceIds,
      date: bookingData.date,
      time: bookingData.time,
    });
  } catch (e) {
    console.warn("notifySalonOwnerOfBooking error", e);
  }
}

function mapBooking(id: string, data: any): Booking {
  const date = data.date instanceof Timestamp ? data.date.toDate().toISOString().split("T")[0] : data.date;
  const time = data.time instanceof Timestamp ? data.time.toDate().toTimeString().substring(0, 5) : data.time;
  return {
    id,
    customerId: data.customerId,
    salonId: data.salonId,
    serviceIds: data.serviceIds || [],
    staffId: data.staffId,
    date,
    time,
    status: data.status,
    totalPrice: typeof data.totalPrice === "string" ? Number(data.totalPrice) : data.totalPrice,
    paymentStatus: data.paymentStatus,
    notes: data.notes,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt,
  } as Booking;
}
