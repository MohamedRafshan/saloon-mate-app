import { db, firebase } from "../firebaseConfig";
import { Service } from "../types/Service";

export const serviceService = {
  async getBySalonId(salonId: string): Promise<Service[]> {
    const snapshot = await db
      .collection("services")
      .where("salonId", "==", salonId)
      .get();
    return snapshot.docs.map((d) => {
      const data = d.data() as Service;
      const { id, ...rest } = data;
      return { id: d.id, ...rest };
    });
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
    const snap = await db.collection("services").doc(serviceId).get();
    const { id, ...rest } = snap.data() as Service;
    return { id: snap.id, ...rest };
  },

  async remove(serviceId: string): Promise<void> {
    await db.collection("services").doc(serviceId).delete();
  },
};
