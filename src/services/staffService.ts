import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Staff } from "../types/Staff";

const staffCollection = collection(db, "staff");

export const staffService = {
  async getAll(): Promise<Staff[]> {
    const snapshot = await getDocs(staffCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Staff));
  },

  async create(staff: Partial<Staff>): Promise<Staff> {
    const { id, ...staffData } = staff;
    const docRef = await addDoc(staffCollection, staffData);
    return { id: docRef.id, ...staffData } as Staff;
  },

  async update(id: string, updates: Partial<Staff>): Promise<void> {
    const staffDoc = doc(db, "staff", id);
    await updateDoc(staffDoc, updates);
  },

  async delete(id: string): Promise<void> {
    const staffDoc = doc(db, "staff", id);
    await deleteDoc(staffDoc);
  },

  subscribe(callback: (staff: Staff[]) => void): () => void {
    return onSnapshot(staffCollection, (snapshot) => {
      const staffList = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Staff)
      );
      callback(staffList);
    });
  },
};
