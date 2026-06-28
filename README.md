# Portofolio – Dzaki Pasha Ramadhan

Website portofolio pribadi milik **Dzaki Pasha Ramadhan**, mahasiswa Manajemen Informatika Universitas Negeri Surabaya. Dibangun menggunakan HTML, CSS, dan JavaScript murni tanpa framework.

---

## Struktur Halaman

| File | Deskripsi |
|---|---|
| `index.html` | Halaman utama — hero, statistik, dan keahlian |
| `about.html` | Profil diri, minat, dan karakter |
| `project.html` | Daftar project yang telah dikerjakan |
| `contact.html` | Informasi kontak (WhatsApp, Instagram, Email, GitHub) |

---

## Struktur Folder

```
biodata jakk/
├── index.html
├── about.html
├── project.html
├── contact.html
├── style.css
├── script.js
├── foto dzaki.jpeg
├── images/
│   ├── finance tracker.jpeg
│   ├── kostku premium.png
│   ├── absensi mahasiswa.png
│   ├── kost1.jpg – kost6.jpg
└── project/
    ├── finance tracker/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── kostku premium/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    └── absensi mahasiswa/
        ├── index.html
        ├── style.css
        └── script.js
```

---

## Fitur

- **Typing effect** — animasi teks bergantian di halaman Home
- **Real-time clock** — jam yang terus diperbarui setiap detik
- **Visitor counter** — penghitung pengunjung menggunakan `localStorage`
- **Dark mode toggle** — beralih antara mode terang dan gelap, disimpan di `localStorage`
- **Scroll fade-in** — elemen muncul secara animasi saat di-scroll menggunakan `IntersectionObserver`
- **Particles background** — latar belakang partikel interaktif via `particles.js`
- **Responsif** — layout menyesuaikan untuk layar mobile (≤768px) dan kecil (≤480px)

---

## Project yang Ditampilkan

| Project | Deskripsi |
|---|---|
| 💰 Student Finance Tracker | Manajemen keuangan mahasiswa dengan dashboard interaktif dan penyimpanan lokal |
| 🏠 Kost Finder (Kostku Premium) | Pencarian kost berdasarkan budget, lokasi, dan fasilitas |
| 🎓 Sistem Absensi Mahasiswa | Absensi web dengan statistik, pencarian, dan riwayat kehadiran |

---

## Teknologi

- **HTML5** — struktur dan konten
- **CSS3** — styling, animasi, variabel CSS, dan responsive design
- **JavaScript (Vanilla)** — interaktivitas dan logika
- **[particles.js](https://github.com/VincentGarreau/particles.js/)** v2.0.0 via CDN — animasi partikel latar belakang
- **[Google Fonts – Poppins](https://fonts.google.com/specimen/Poppins)** — tipografi utama

---

## Catatan CSS

### Variabel Warna (`:root`)
| Variabel | Nilai | Keterangan |
|---|---|---|
| `--primary` | `#38bdf8` | Biru utama |
| `--primary-dark` | `#0ea5e9` | Biru gelap |
| `--accent` | `#818cf8` | Ungu aksen |
| `--bg-dark` | `#0a0f1e` | Latar gelap utama |
| `--bg-mid` | `#0f172a` | Latar gelap tengah |
| `--bg-card` | `rgba(255,255,255,0.05)` | Latar kartu |
| `--border` | `rgba(56,189,248,0.25)` | Warna border |
| `--text` | `#e2e8f0` | Teks utama |
| `--text-muted` | `#94a3b8` | Teks redup |
| `--glow` | `rgba(56,189,248,0.4)` | Efek glow biru |

### Kompatibilitas Browser – `.foto-ring`
Elemen `.foto-ring` menggunakan teknik gradient border melingkar dengan `mask` property. Kedua properti berikut digunakan bersama untuk memastikan kompatibilitas lintas browser:

```css
-webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
-webkit-mask-composite: destination-out;
mask-composite: exclude;
```

Properti `mask` (standar W3C) ditambahkan berdampingan dengan `-webkit-mask` agar border animasi berfungsi di browser modern yang tidak lagi membutuhkan prefix `-webkit-`.

---

## Cara Menjalankan

Buka `index.html` langsung di browser — tidak ada build step atau server yang diperlukan.
