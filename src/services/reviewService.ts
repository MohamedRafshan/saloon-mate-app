import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Review } from "../types/Review";

const reviewsCollection = collection(db, "reviews");

export const reviewService = {
  subscribeToSalonReviews(
    salonId: string,
    callback: (reviews: Review[]) => void
  ): () => void {
    const q = query(reviewsCollection, where("salonId", "==", salonId));
    return onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Review)
      );
      callback(reviews);
    });
  },
};
