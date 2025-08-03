import { db } from './firebase.js';
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 🔄 Render produk
async function renderList(filter = "") {
  const listEl = document.getElementById("product-grid");
  if (!listEl) return;
  listEl.innerHTML = "";

  const snapshot = await getDocs(collection(db, "umkm"));
  let data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

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

    // 📌 klik card untuk lihat detail
    if (!location.pathname.includes("admin")) {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => showModal(item));
    }

    listEl.appendChild(card);
  });
}

// ✏️ Edit produk
window.editItem = async (id) => {
  const docRef = doc(db, "umkm", id);
  const snap = await getDocs(collection(db, "umkm"));
  const item = snap.docs.find(d => d.id === id).data();

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
    renderList();
  }
};

// 📄 Form simpan produk (Admin)
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

    if (id === "") {
      await addDoc(collection(db, "umkm"), item);
    } else {
      await updateDoc(doc(db, "umkm", id), item);
    }

    form.reset();
    renderList();
  });
}

// 🔍 Search
const search = document.getElementById("search");
if (search) {
  search.addEventListener("input", () => renderList(search.value));
}

// 📌 Modal detail produk
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

renderList();
