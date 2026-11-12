// Bagian 1: Ibnu Faris Pribadi (1710625118) SE 1

function formatRupiah(nominal) {
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

function hitungHargaDasar(hargaPaket, jumlahTiket) {
  return hargaPaket * jumlahTiket;
}

function pilihPaketDariKatalog(nilaiHarga) {
  const selectPaket = document.getElementById("kategori-tiket");
  if (selectPaket) {
    selectPaket.value = nilaiHarga;
    hitungTotalTiket();
  }
}

function hitungTotalTiket() {
  const selectPaket = document.getElementById("kategori-tiket");
  const inputJumlah = document.getElementById("jumlah-tiket");
  const inputKodePromo = document.getElementById("kode-promo");
  const panelHasil = document.getElementById("hasil-kalkulator");

  const hargaSatuan = parseInt(selectPaket.value, 10);
  const opsiTerpilih = selectPaket.options[selectPaket.selectedIndex];
  const namaPaket = opsiTerpilih.getAttribute("data-nama") || opsiTerpilih.text.split(" — ")[0];
  const jumlahBeli = parseInt(inputJumlah.value, 10);

  if (isNaN(jumlahBeli) || jumlahBeli < 1) {
    panelHasil.innerHTML = `
      <div class="output-error">
        <strong>Input Tidak Valid:</strong> Jumlah pembelian minimal adalah 1 tiket. Silakan periksa kembali kolom jumlah tiket Anda.
      </div>
    `;
    return;
  }

  const hargaAwal = hitungHargaDasar(hargaSatuan, jumlahBeli);

  // Bagian 2: Umar (1710625202) SE 2

  const kodePromo = inputKodePromo.value.trim().toUpperCase();
  const KODE_RESMI = "JOYBISDIG";
  const PERSEN_DISKON = 0.10;

  let potonganDiskon = 0;
  let keteranganPromo = "";
  let statusBadgeClass = "badge-normal";

  if (kodePromo === KODE_RESMI && jumlahBeli >= 3) {
    potonganDiskon = hargaAwal * PERSEN_DISKON;
    keteranganPromo = "Diskon 10% aktif (Kode JOYBISDIG + Pembelian Kolektif >= 3 tiket)";
    statusBadgeClass = "badge-success";
  } else if (kodePromo === KODE_RESMI) {
    potonganDiskon = hargaAwal * PERSEN_DISKON;
    keteranganPromo = "Diskon 10% aktif menggunakan kode promo JOYBISDIG";
    statusBadgeClass = "badge-success";
  } else if (kodePromo === "" && jumlahBeli >= 3) {
    potonganDiskon = hargaAwal * PERSEN_DISKON;
    keteranganPromo = "Diskon 10% otomatis aktif (Pembelian Kolektif minimal 3 tiket)";
    statusBadgeClass = "badge-success";
  } else if (kodePromo !== "" && kodePromo !== KODE_RESMI) {
    if (jumlahBeli >= 3) {
      potonganDiskon = hargaAwal * PERSEN_DISKON;
      keteranganPromo = `Kode "${kodePromo}" tidak terdaftar, namun Anda tetap mendapat diskon 10% karena membeli ${jumlahBeli} tiket`;
      statusBadgeClass = "badge-warning";
    } else {
      potonganDiskon = 0;
      keteranganPromo = `Kode promo "${kodePromo}" tidak ditemukan. Gunakan kode: JOYBISDIG`;
      statusBadgeClass = "badge-error";
    }
  } else {
    potonganDiskon = 0;
    keteranganPromo = "Harga normal (Masukkan kode JOYBISDIG atau beli minimal 3 tiket untuk diskon 10%)";
    statusBadgeClass = "badge-normal";
  }

  const totalBayarAkhir = hargaAwal - potonganDiskon;

  panelHasil.innerHTML = `
    <div class="receipt-box">
      <div class="receipt-header">
        <span class="receipt-title">RINGKASAN SIMULASI TIKET</span>
        <span class="receipt-status ${statusBadgeClass}">
          ${potonganDiskon > 0 ? "HEMAT 10%" : "HARGA NORMAL"}
        </span>
      </div>

      <div class="receipt-body">
        <div class="receipt-row">
          <span class="row-label">Kategori Pilihan</span>
          <strong class="row-value">${namaPaket}</strong>
        </div>

        <div class="receipt-row">
          <span class="row-label">Kuantitas &amp; Harga Satuan</span>
          <span class="row-value">${jumlahBeli} tiket &times; ${formatRupiah(hargaSatuan)}</span>
        </div>

        <div class="receipt-row">
          <span class="row-label">Harga Awal</span>
          <strong class="row-value">${formatRupiah(hargaAwal)}</strong>
        </div>

        <div class="receipt-row discount-row">
          <span class="row-label">Potongan Diskon (10%)</span>
          <strong class="row-value">- ${formatRupiah(potonganDiskon)}</strong>
        </div>

        <div class="receipt-note">
          <span>Catatan Sistem: ${keteranganPromo}</span>
        </div>

        <div class="receipt-total">
          <span class="total-label">Total Bayar Akhir</span>
          <strong class="total-amount">${formatRupiah(totalBayarAkhir)}</strong>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  const formKalkulator = document.getElementById("ticket-calc-form");
  if (formKalkulator) {
    formKalkulator.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        hitungTotalTiket();
      }
    });
  }
});
