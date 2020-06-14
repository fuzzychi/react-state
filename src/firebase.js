
import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUa_zqRb71kLdcphCiTeQwf9MNOcL1EPg",
  authDomain: "react-state-router-test.firebaseapp.com",
  databaseURL: "https://react-state-router-test.firebaseio.com",
  projectId: "react-state-router-test",
  storageBucket: "react-state-router-test.appspot.com",
  messagingSenderId: "138751544807",
  appId: "1:138751544807:web:123a059000a998aa9c0142"
  };

  firebase.initializeApp(firebaseConfig);
  export const db = firebase.firestore();


