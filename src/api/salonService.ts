import { db, firebase } from "../firebaseConfig";
import { Salon } from "../types/Salon";

export const salonService = {
  async createSalon(
    ownerId: string,
    salonData: Partial<Salon>
  ): Promise<string> {
    const salonsCol = db.collection("salons");
    const newSalonData = {
      ...salonData,
      ownerId: ownerId,
      rating: 0,
      reviewCount: 0,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800", // Default image
      images: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      ],
      services: [],
      openingHours: {
        monday: { open: "09:00", close: "20:00", closed: false },
        tuesday: { open: "09:00", close: "20:00", closed: false },
        wednesday: { open: "09:00", close: "20:00", closed: false },
        thursday: { open: "09:00", close: "20:00", closed: false },
        friday: { open: "09:00", close: "20:00", closed: false },
        saturday: { open: "10:00", close: "18:00", closed: false },
        sunday: { closed: true, open: "", close: "" },
      },
      createdAt: firebase.firestore.Timestamp.now(),
    };
    const salonDocRef = await salonsCol.add(newSalonData);
    return salonDocRef.id;
  },

  async getAllSalons(): Promise<Salon[]> {
    const salonsCol = db.collection("salons");
    const salonSnapshot = await salonsCol.get();
    const salonList = salonSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Salon[];
    return salonList;
  },

  async getSalonById(id: string): Promise<Salon> {
    const salonDocRef = db.collection("salons").doc(id);
    const salonDoc = await salonDocRef.get();
    if (salonDoc.exists) {
      return { id: salonDoc.id, ...salonDoc.data() } as Salon;
    } else {
      throw new Error("Salon not found");
    }
  },

  async searchSalons(queryString: string, city?: string): Promise<Salon[]> {
    let salonQuery: firebase.firestore.Query = db.collection("salons");

    if (queryString) {
      salonQuery = salonQuery
        .where("name", ">=", queryString)
        .where("name", "<=", queryString + "\uf8ff");
    }

    if (city) {
      salonQuery = salonQuery.where("city", "==", city);
    }

    const salonSnapshot = await salonQuery.get();
    const salonList = salonSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Salon[];
    return salonList;
  },

  async getNearby(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Salon[]> {
    // This is a simplified nearby search. For production, consider using a service like Algolia or a more complex Geohashing solution.
    const latRange = [latitude - 0.1, latitude + 0.1];
    const lonRange = [longitude - 0.1, longitude + 0.1];

    const salonsCol = db.collection("salons");
    const q = salonsCol
      .where("location.latitude", ">=", latRange[0])
      .where("location.latitude", "<=", latRange[1]);

    const salonSnapshot = await q.get();

    const salonList = salonSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Salon[];

    // Further filter by longitude in-memory
    return salonList.filter(
      (salon) =>
        salon.location.longitude >= lonRange[0] &&
        salon.location.longitude <= lonRange[1]
    );
  },

  async updateSalon(id: string, data: Partial<Salon>): Promise<Salon> {
    const salonDocRef = db.collection("salons").doc(id);
    await salonDocRef.update(data);
    return this.getSalonById(id);
  },
};
