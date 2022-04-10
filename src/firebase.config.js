// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBv6k7CZFHsHrFOl8qmQKJrK0aogWZorDw',
  authDomain: 'shameless-app.firebaseapp.com',
  projectId: 'shameless-app',
  storageBucket: 'shameless-app.appspot.com',
  messagingSenderId: '467935944795',
  appId: '1:467935944795:web:a170a2976f95a07fe75f7e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore()