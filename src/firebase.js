// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8a_Jz-nNqR-GwXoBWWi40jDwwLfo7rhQ",
  authDomain: "vercelwiki.firebaseapp.com",
  projectId: "vercelwiki",
  storageBucket: "vercelwiki.appspot.com",
  messagingSenderId: "861492727975",
  appId: "1:861492727975:web:0fbb526fe94b185f674b82",
  measurementId: "G-459W7N111X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();
const auth = getAuth(app);
const analytics = getAnalytics(app);

const imagesRef = ref(storage, 'images');


export {app, analytics, storage, auth}