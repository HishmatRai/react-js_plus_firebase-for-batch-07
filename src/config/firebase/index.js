import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyCsMKNoIcR3MkLHV3meajJ_EAuxJPBx91k",
  authDomain: "test-1bfd6.firebaseapp.com",
  databaseURL: "https://test-1bfd6-default-rtdb.firebaseio.com",
  projectId: "test-1bfd6",
  storageBucket: "test-1bfd6.appspot.com",
  messagingSenderId: "878098156779",
  appId: "1:878098156779:web:80a9ea12a54cad6d3182ae",
  measurementId: "G-8973585197",
};
const firebase = initializeApp(firebaseConfig);
export default firebase;