import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { db } from "../firebaseConfig";
import {
  CACHE_EXPIRATION,
  CACHE_KEYS,
  cacheService,
} from "../services/cacheService";
import {
  sendPushNotification,
  scheduleLocalNotification,
} from "../services/notifications";
import { Booking } from "../types/Booking";

export const bookingService = {
  async getCustomerBookings(customerId: string): Promise<Booking[]> {
    return cacheService.getOrFetch(
      CACHE_KEYS.USER_BOOKINGS(customerId),
      async () => {
        const bookingsCol = collection(db, "bookings");
        const q = query(bookingsCol, where("customerId", "==", customerId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((docSnap) =>
          mapBooking(docSnap.id, docSnap.data())
        );
      },
      { expirationTime: CACHE_EXPIRATION.SHORT }
    );
  },

  subscribeToCustomerBookings(
    customerId: string,
    callback: (bookings: Booking[]) => void
  ): () => void {
    const bookingsCol = collection(db, "bookings");
    const q = query(bookingsCol, where("customerId", "==", customerId));
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map((docSnap) =>
        mapBooking(docSnap.id, docSnap.data())
      );
      callback(bookings);
    });
  },

  async getSalonBookings(salonId: string): Promise<Booking[]> {
    return cacheService.getOrFetch(
      `bookings:salon:${salonId}`,
      async () => {
        const bookingsCol = collection(db, "bookings");
        const q = query(bookingsCol, where("salonId", "==", salonId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((docSnap) =>
          mapBooking(docSnap.id, docSnap.data())
        );
      },
      { expirationTime: CACHE_EXPIRATION.SHORT }
    );
  },

  subscribeToSalonBookings(
    salonId: string,
    callback: (bookings: Booking[]) => void
  ): () => void {
    const bookingsCol = collection(db, "bookings");
    const q = query(bookingsCol, where("salonId", "==", salonId));
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map((docSnap) =>
        mapBooking(docSnap.id, docSnap.data())
      );
      callback(bookings);
    });
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

    // Invalidate customer and salon bookings caches
    if (bookingData.customerId) {
      await cacheService.remove(
        CACHE_KEYS.USER_BOOKINGS(bookingData.customerId)
      );
    }
    if (bookingData.salonId) {
      await cacheService.remove(`bookings:salon:${bookingData.salonId}`);
    }

    // Notify salon owner about the new booking
    try {
      await notifySalonOwnerOfBooking(docRef.id, {
        ...newBookingData,
        createdAt: newBookingData.createdAt.toDate().toISOString(),
      } as Booking);
    } catch (e) {
      console.warn("Failed to notify salon owner of booking", e);
    }

    // Schedule reminders for the customer
    if (bookingData.date && bookingData.time) {
      scheduleAppointmentReminders(bookingData as Booking);
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
    await cacheService.clearPattern("bookings:*");
  },

  async cancelBooking(bookingId: string): Promise<void> {
    const bookingDocRef = doc(db, "bookings", bookingId);
    const booking = (await getDoc(bookingDocRef)).data() as Booking;
    if (booking.notificationIds) {
      for (const id of booking.notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    }
    await updateDoc(bookingDocRef, { status: "cancelled" });
    await cacheService.clearPattern("bookings:*");
  },
};

async function scheduleAppointmentReminders(booking: Booking) {
  const appointmentDate = new Date(`${booking.date}T${booking.time}`);
  const now = new Date();
  const notificationIds: string[] = [];

  // 24-hour reminder
  const twentyFourHoursBefore = new Date(
    appointmentDate.getTime() - 24 * 60 * 60 * 1000
  );
  if (twentyFourHoursBefore > now) {
    const seconds = (twentyFourHoursBefore.getTime() - now.getTime()) / 1000;
    const id = await scheduleLocalNotification(
      "Appointment Reminder",
      `Your appointment at ${booking.salonId} is in 24 hours.`,
      seconds
    );
    if (id) notificationIds.push(id);
  }

  // 1-hour reminder
  const oneHourBefore = new Date(
    appointmentDate.getTime() - 60 * 60 * 1000
  );
  if (oneHourBefore > now) {
    const seconds = (oneHourBefore.getTime() - now.getTime()) / 1000;
    const id = await scheduleLocalNotification(
      "Appointment Reminder",
      `Your appointment at ${booking.salonId} is in 1 hour.`,
      seconds
    );
    if (id) notificationIds.push(id);
  }
  // At booking time
  if (appointmentDate > now) {
    const seconds = (appointmentDate.getTime() - now.getTime()) / 1000;
    const id = await scheduleLocalNotification(
      "Appointment Time!",
      `It's time for your appointment at ${booking.salonId}.`,
      seconds
    );
    if (id) notificationIds.push(id);
  }

  if (notificationIds.length > 0) {
    const bookingDocRef = doc(db, "bookings", booking.id);
    await updateDoc(bookingDocRef, { notificationIds });
  }
}

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
    const body = `${bookingData.date || ""} ${
      bookingData.time || ""
    } • ${servicesCount} service(s)`;

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
  const date =
    data.date instanceof Timestamp
      ? data.date.toDate().toISOString().split("T")[0]
      : data.date;
  const time =
    data.time instanceof Timestamp
      ? data.time.toDate().toTimeString().substring(0, 5)
      : data.time;
  return {
    id,
    customerId: data.customerId,
    salonId: data.salonId,
    serviceIds: data.serviceIds || [],
    staffId: data.staffId,
    date,
    time,
    status: data.status,
    totalPrice:
      typeof data.totalPrice === "string"
        ? Number(data.totalPrice)
        e,
    paymentStatus: data.paymentStatus,
    notes: data.notes,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt,
    notificationIds: data.notificationIds || [],
  } as Booking;
}
