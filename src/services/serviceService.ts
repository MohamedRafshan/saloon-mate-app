import { db, firebase } from "../firebaseConfig";
import { Service } from "../types/Service";
import { CACHE_EXPIRATION, CACHE_KEYS, cacheService } from "./cacheService";

export const serviceService = {
  async getBySalonId(salonId: string): Promise<Service[]> {
    return cacheService.getOrFetch(
      CACHE_KEYS.SERVICES(salonId),
      async () => {
        const snapshot = await db
          .collection("services")
          .where("salonId", "==", salonId)
          .get();
        return snapshot.docs.map((d) => {
          const data = d.data() as Service;
          const { id, ...rest } = data;
          return {
            id: d.id,
            ...rest,
            price: typeof (rest as any).price === "string" ? Number((rest as any).price) : (rest as any).price,
            duration: (rest as any).duration || "",
          };
        });
      },
      { expirationTime: CACHE_EXPIRATION.LONG }
    );
  },

  async create(salonId: string, data: Partial<Service>): Promise<Service> {
    const newDoc = {
      salonId,
      name: data.name!,
      description: data.description || "",
      price: data.price!,
      currency: data.currency || "LKR",
      duration: data.duration!,
      category: data.category!,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as any;

    const ref = await db.collection("services").add(newDoc);
    // Invalidate salon services cache
    await cacheService.remove(CACHE_KEYS.SERVICES(salonId));
    
    const saved = await ref.get();
    const { id, ...rest } = saved.data() as Service;
    return { id: saved.id, ...rest };
  },

  async update(serviceId: string, data: Partial<Service>): Promise<Service> {
    const patch = {
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as any;
    await db.collection("services").doc(serviceId).update(patch);
    // Invalidate all services caches on update
    await cacheService.clearPattern('services:*');
    
    const snap = await db.collection("services").doc(serviceId).get();
    const { id, ...rest } = snap.data() as Service;
    return { id: snap.id, ...rest };
  },

  async remove(serviceId: string): Promise<void> {
    await db.collection("services").doc(serviceId).delete();
  },
};
