import { getApp, initializeApp, getApps } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"; // Added signOut import
import { getFirestore, getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsNze9h4qw50zh2LON03mIOgw8nlmMQDU",
  authDomain: "dogbnb-ccb7b.firebaseapp.com",
  projectId: "dogbnb-ccb7b",
  storageBucket: "dogbnb-ccb7b.appspot.com",
  messagingSenderId: "803586230912",
  appId: "1:803586230912:web:f415a4d750b1f17c7a3465",
  measurementId: "G-MVQZ578XXW"
};

let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const DB = getFirestore(app);

export const logOut = async () => {
  try {
    await signOut(auth); // Use signOut function
    localStorage.clear(); // Clear any additional user data stored in local storage if needed
  } catch (error) {
    console.error("Error logging out: ", error);
  }
};
