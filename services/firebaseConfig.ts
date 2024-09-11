import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCsC98pfdYFAfIbZzozqjKoYj4a-D39JxU",
  authDomain: "finance-tracker-1398.firebaseapp.com",
  projectId: "finance-tracker-1398",
  storageBucket: "finance-tracker-1398.appspot.com",
  messagingSenderId: "473992667309",
  appId: "1:473992667309:web:0b95ab2bd3ed2b0291a624",
  measurementId: "G-Y6HL2CYGF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;