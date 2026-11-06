// Data Vila (Array of Objects)
const dataVila = [
  {
    id: "v1",
    nama: "Vila Permai 1 (Mawar)",
    tipe: "2 Kamar Tidur",
    lokasi: "Puncak Atas",
    harga: 750000,
    fasilitas: "Kolam Renang, Wifi, Dapur, BBQ",
    tersedia: true
  },
  {
    id: "v2",
    nama: "Vila Permai 2 (Melati)",
    tipe: "3 Kamar Tidur",
    lokasi: "Puncak Tengah",
    harga: 1200000,
    fasilitas: "Kolam Renang, Karaoke, Garden, Wifi",
    tersedia: true
  },
  {
    id: "v3",
    nama: "Vila Permai 3 (Anggrek)",
    tipe: "4 Kamar Tidur",
    lokasi: "Puncak Utama",
    harga: 1800000,
    fasilitas: "Private Pool, Billiard, View Gunung, Wifi",
    tersedia: true
  }
];

// Inisialisasi Elemen DOM
document.addEventListener("DOMContentLoaded", () => {
  try {
    renderKatalogVila(dataVila);
    populateDropdownVila();
    muatDataTerakhir();
    pasangEventListener();
  } catch (error) {
    console.error("Terjadi kesalahan saat inisialisasi:", error);
  }
});

// Render Vila secara Dinamis (createElement & appendChild)
function renderKatalogVila(daftarVila) {
  const container = document.getElementById("villa-list");
  container.innerHTML = "";

  if (daftarVila.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "Vila yang Anda cari tidak ditemukan.";
    container.appendChild(emptyMsg);
    return;
  }

  daftarVila.forEach((vila) => {
    const card = document.createElement("article");
    card.className = "villa-card";

    const title = document.createElement("h3");
    title.className = "villa-card__title";
    title.textContent = vila.nama;

    const tipe = document.createElement("p");
    tipe.textContent = `Tipe: ${vila.tipe} (${vila.lokasi})`;

    const price = document.createElement("p");
    price.className = "villa-card__price";
    price.textContent = `Rp ${vila.harga.toLocaleString("id-ID")} / malam`;

    const fasilitas = document.createElement("p");
    fasilitas.textContent = `Fasilitas: ${vila.fasilitas}`;

    const badge = document.createElement("span");
    badge.className = "villa-card__badge";
    badge.textContent = vila.tersedia ? "Tersedia" : "Penuh";

    card.appendChild(title);
    card.appendChild(tipe);
    card.appendChild(price);
    card.appendChild(fasilitas);
    card.appendChild(badge);

    container.appendChild(card);
  });
}

// Opsi Dropdown Dinamis
function populateDropdownVila() {
  const select = document.getElementById("villa-select");
  select.innerHTML = "";

  dataVila.forEach((vila) => {
    const option = document.createElement("option");
    option.value = vila.id;
    option.textContent = `${vila.nama} - Rp ${vila.harga.toLocaleString("id-ID")}/malam`;
    select.appendChild(option);
  });
}

// Logika Perhitungan Otomatis
function hitungTotalHarga() {
  const vilaId = document.getElementById("villa-select").value;
  const checkinVal = document.getElementById("checkin").value;
  const checkoutVal = document.getElementById("checkout").value;

  const vilaSelected = dataVila.find((v) => v.id === vilaId);
  const totalHargaElem = document.getElementById("total-harga");
  const durasiMalamElem = document.getElementById("durasi-malam");

  if (!checkinVal || !checkoutVal || !vilaSelected) {
    durasiMalamElem.textContent = "0";
    totalHargaElem.textContent = "Rp 0";
    return 0;
  }

  const date1 = new Date(checkinVal);
  const date2 = new Date(checkoutVal);
  const timeDiff = date2.getTime() - date1.getTime();
  const durasiHari = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (durasiHari > 0) {
    const total = durasiHari * vilaSelected.harga;
    durasiMalamElem.textContent = durasiHari;
    totalHargaElem.textContent = `Rp ${total.toLocaleString("id-ID")}`;
    return total;
  } else {
    durasiMalamElem.textContent = "0";
    totalHargaElem.textContent = "Rp 0";
    return 0;
  }
}

// Validasi Form
function validasiForm() {
  const nama = document.getElementById("nama").value.trim();
  const checkinVal = document.getElementById("checkin").value;
  const checkoutVal = document.getElementById("checkout").value;
  const jumlahTamu = parseInt(document.getElementById("jumlah-tamu").value, 10);
  const errorDiv = document.getElementById("error-message");

  errorDiv.style.display = "none";
  errorDiv.textContent = "";

  if (!nama) {
    showError("Nama lengkap wajib diisi.");
    return false;
  }

  if (!checkinVal || !checkoutVal) {
    showError("Tanggal check-in dan check-out wajib dipilih.");
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkinDate = new Date(checkinVal);
  const checkoutDate = new Date(checkoutVal);

  if (checkinDate < today) {
    showError("Tanggal check-in tidak boleh di masa lalu.");
    return false;
  }

  if (checkoutDate <= checkinDate) {
    showError("Tanggal check-out harus setelah tanggal check-in.");
    return false;
  }

  if (isNaN(jumlahTamu) || jumlahTamu < 1 || jumlahTamu > 10) {
    showError("Jumlah tamu harus di antara 1 sampai 10 orang.");
    return false;
  }

  return true;
}

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

// Event Listeners
function pasangEventListener() {
  document.getElementById("checkin").addEventListener("change", hitungTotalHarga);
  document.getElementById("checkout").addEventListener("change", hitungTotalHarga);
  document.getElementById("villa-select").addEventListener("change", hitungTotalHarga);

  // Filter Pencarian
  document.getElementById("input-search").addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = dataVila.filter((v) =>
      v.nama.toLowerCase().includes(keyword) || v.fasilitas.toLowerCase().includes(keyword)
    );
    renderKatalogVila(filtered);
  });

  // Tombol Cek Ketersediaan
  document.getElementById("btn-cek").addEventListener("click", () => {
    if (validasiForm()) {
      alert("Status: Vila tersedia untuk tanggal pilihan Anda!");
    }
  });

  // Submit Form
  document.getElementById("booking-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validasiForm()) return;

    const nama = document.getElementById("nama").value.trim();
    const vilaId = document.getElementById("villa-select").value;
    const vilaSelected = dataVila.find((v) => v.id === vilaId);
    const totalBiaya = hitungTotalHarga();

    // Simpan ke LocalStorage
    localStorage.setItem("lastGuestName", nama);

    // Tampilkan Hasil Ringkasan
    const resultArea = document.getElementById("result-area");
    const resultContent = document.getElementById("result-content");

    resultContent.innerHTML = `
      <p><strong>Nama Tamu:</strong> ${nama}</p>
      <p><strong>Vila Dipilih:</strong> ${vilaSelected.nama}</p>
      <p><strong>Tanggal Check-In:</strong> ${document.getElementById("checkin").value}</p>
      <p><strong>Tanggal Check-Out:</strong> ${document.getElementById("checkout").value}</p>
      <p><strong>Total Biaya:</strong> Rp ${totalBiaya.toLocaleString("id-ID")}</p>
      <p><em>Pemesanan Anda telah dicatat. Pak Hendra akan segera mengonfirmasi via WhatsApp.</em></p>
    `;

    resultArea.style.display = "block";
  });
}

// Fitur LocalStorage (Muat Nama Terakhir)
function muatDataTerakhir() {
  const lastGuest = localStorage.getItem("lastGuestName");
  if (lastGuest) {
    document.getElementById("nama").value = lastGuest;
  }
}