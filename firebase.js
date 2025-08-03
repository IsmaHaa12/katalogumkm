// ✅ Import modul Firebase terbaru
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 🔧 Konfigurasi Firebase (punya kamu)
const firebaseConfig = {
  apiKey: "AIzaSyBy4VPjUXprmEtCn137wxrw15O5FlQKHrA",
  authDomain: "stellar-tulumba-011b9c.netlify.app",
  projectId: "umkmdesa-gombong",
  storageBucket: "umkmdesa-gombong.firebasestorage.app",
  messagingSenderId: "770086679112",
  appId: "1:770086679112:web:e4fa4f805ee2a1c3df9e7d"
};

// 🚀 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
