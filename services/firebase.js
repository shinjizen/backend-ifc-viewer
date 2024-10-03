import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC9Tis46JDBInSVCO4pjXwByuSeX3GJ1jM",
    authDomain: "that-open-ifc-viewer.firebaseapp.com",
    projectId: "that-open-ifc-viewer",
    storageBucket: "that-open-ifc-viewer.appspot.com",
    messagingSenderId: "249523490161",
    appId: "1:249523490161:web:63382aa2051d4b69c23ad0",
    measurementId: "G-72Q8Q147JM"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };