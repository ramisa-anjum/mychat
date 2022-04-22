// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDtwMvFZsVKjL7K67PdyAZqN5_mWtIF7l0",
  authDomain: "my-chat-7a3fe.firebaseapp.com",
  projectId: "my-chat-7a3fe",
  databaseURL:"https://my-chat-7a3fe-default-rtdb.firebaseio.com/",
  storageBucket: "my-chat-7a3fe.appspot.com",
  messagingSenderId: "456604381745",
  appId: "1:456604381745:web:5d03a6e0dc4c1b0fc5db10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export default firebaseConfig 