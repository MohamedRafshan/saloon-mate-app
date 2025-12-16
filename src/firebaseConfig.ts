import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-GRxcbHmhAJU11AX99ka4bFCxyLPMf68",
  authDomain: "salonapp-f7c3b.firebaseapp.com",
  projectId: "salonapp-f7c3b",
  storageBucket: "salonapp-f7c3b.appspot.com",
  messagingSenderId: "876074197562",
  appId: "1:876074197562:web:dea9bfcefa3a45af068b03",
  measurementId: "G-CL2PETBVFQ",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Enable persistence
db.enablePersistence().catch((err) => {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a time.
    console.warn("Firebase persistence failed: multiple tabs open.");
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    console.warn("Firebase persistence failed: browser does not support it.");
  }
});

export { auth, db, firebase };
