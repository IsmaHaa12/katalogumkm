import { db } from './firebase.js';
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function renderList(filter = "") {
  const listEl = document.getElementById("product-grid");
  if (!listEl) {
    console.warn("⚠️ Tidak menemukan elemen #product-grid");
    return;
  }
  listEl.innerHTML = "<p>🔄 Memuat produk...</p>";

  try {
    // 🔥 Ambil data dari Firestore
    const snapshot = await getDocs(collection(db, "umkm"));
    console.log(`✅ ${snapshot.size} produk ditemukan di Firestore`);

    let data = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // 🔍 Filter kalau ada pencarian
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );

    // 🔄 Kosongkan grid
    listEl.innerHTML = "";

    if (filtered.length === 0) {
      listEl.innerHTML = "<p>📭 Belum ada produk ditemukan</p>";
    }

    // 🎨 Render produk
    filtered.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p><strong>Kontak:</strong> ${item.kontak}</p>
        ${location.pathname.includes("admin") ? `
          <button onclick="editItem('${item.id}')">Edit</button>
          <button onclick="deleteItem('${item.id}')">Hapus</button>
        ` : ""}
      `;

      // 🔍 Kalau di index.html (bukan admin), klik kartu → detail modal
      if (!location.pathname.includes("admin")) {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => showModal(item));
      }

      listEl.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Gagal ambil data Firestore:", err);
    listEl.innerHTML = "<p>⚠️ Gagal memuat produk</p>";
  }
}

// ✏️ Fungsi edit produk (Admin)
window.editItem = async (id) => {
  const snapshot = await getDocs(collection(db, "umkm"));
  const itemDoc = snapshot.docs.find(d => d.id === id);
  if (!itemDoc) return alert("Produk tidak ditemukan!");

  const item = itemDoc.data();
  document.getElementById("product-id").value = id;
  document.getElementById("name").value = item.name;
  document.getElementById("image").value = item.image;
  document.getElementById("desc").value = item.desc;
  document.getElementById("kontak").value = item.kontak;
};

// ❌ Hapus produk
window.deleteItem = async (id) => {
  if (confirm("Yakin ingin menghapus produk ini?")) {
    await deleteDoc(doc(db, "umkm", id));
    console.log(`🗑 Produk dengan ID ${id} dihapus`);
    renderList();
  }
};

// 📝 Simpan produk dari admin
const form = document.getElementById("umkm-form");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.getElementById("product-id").value;
    const item = {
      name: document.getElementById("name").value,
      image: document.getElementById("image").value,
      desc: document.getElementById("desc").value,
      kontak: document.getElementById("kontak").value,
    };

    try {
      if (id === "") {
        await addDoc(collection(db, "umkm"), item);
        console.log("✅ Produk baru ditambahkan:", item);
      } else {
        await updateDoc(doc(db, "umkm", id), item);
        console.log("✏️ Produk diperbarui:", item);
      }
      form.reset();
      renderList();
    } catch (err) {
      console.error("❌ Gagal menyimpan produk:", err);
    }
  });
}

// 🔍 Search real-time
const search = document.getElementById("search");
if (search) {
  search.addEventListener("input", () => renderList(search.value));
}

// 📌 Modal produk
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalKontak = document.getElementById("modal-kontak");
const closeBtn = document.querySelector(".close-btn");

function showModal(item) {
  if (!modal) return;
  modal.style.display = "block";
  modalImg.src = item.image;
  modalTitle.textContent = item.name;
  modalDesc.textContent = item.desc;
  modalKontak.textContent = item.kontak;
}

if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

// 🚀 Panggil render awal
renderList();
