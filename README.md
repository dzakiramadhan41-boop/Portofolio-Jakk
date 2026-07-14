# Portofolio — Dzaki Pasha Ramadhan

Portofolio pribadi milik Dzaki Pasha Ramadhan — mahasiswa Manajemen Informatika, Universitas Negeri Surabaya. Situs ini dibuat dengan HTML, CSS, dan JavaScript murni (vanilla), tanpa build step.

---

## Halaman

| File | Keterangan |
|---|---|
| `index.html` | Halaman utama — hero, tech stack, layanan, dan statistik |
| `about.html` | Profil, skill, dan statistik belajar |
| `project.html` | Daftar proyek dengan filter kategori |
| `penghargaan.html` | Galeri sertifikat & penghargaan *(halaman baru)* |
| `contact.html` | WhatsApp, Instagram, Email, GitHub, LinkedIn |

---

## Struktur Proyek

```
Portofolio-Jakk/
├── index.html
├── about.html
├── project.html
├── penghargaan.html          ← baru
├── contact.html
├── style.css
├── script.js
├── images/
│   ├── fotoku.jpg            ← foto profil baru (menggantikan "foto dzaki.jpeg")
│   ├── finance tracker.png   ← gambar thumbnail baru (menggantikan .jpeg)
│   ├── kostku premium.png
│   ├── absensi mahasiswa.png
│   ├── kost6.jpg             ← gambar baru
│   ├── sertif1.jpg – sertif21.jpg  ← 21 file sertifikat baru
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

## Perubahan yang Dilakukan

### Halaman Baru
- **`penghargaan.html`** — halaman galeri sertifikat & penghargaan dengan:
  - Grid 21 sertifikat (`sertif1.jpg` – `sertif21.jpg`)
  - Lightbox viewer (buka, tutup, navigasi prev/next)
  - Kotak pencarian sertifikat real-time
  - Counter total sertifikat otomatis

### Navigasi (semua halaman)
- Menu tambah item **Penghargaan** yang mengarah ke `penghargaan.html`, baik di navbar desktop maupun mobile menu

### `index.html`
- Tambah meta SEO lengkap: `description`, `author`, `robots`, `theme-color`
- Tambah Open Graph tags (WhatsApp, Facebook, Discord, LinkedIn preview)
- Tambah Canonical URL (`https://dzakipasha.site/`)
- Tambah Schema.org JSON-LD untuk Google
- Ganti foto profil dari `foto dzaki.jpeg` → `images/fotoku.jpg`
- Tambah ikon media sosial di hero: GitHub, Instagram, Email, WhatsApp, **LinkedIn** *(baru)*
- Tambah **Tech Stack** section di hero dengan ikon Devicons (HTML, CSS, JS, Python, C++, GitHub)
- Tambah `devicon` CSS dari CDN jsdelivr
- Tambah scroll indicator arrow di hero
- Tambah scroll progress bar (`#scroll-progress`)
- Tambah toast container (`#toast-container`)
- Tambah custom cursor (`.cursor-dot`, `.cursor-ring`)
- Tambah hamburger / mobile menu

### `about.html`
- Tambah meta SEO + Open Graph + Canonical URL
- Tambah scroll progress bar, toast container, custom cursor, mobile menu
- Tambah section **Skill & Kemampuan** dengan badge level dan tooltip (HTML, CSS, JS, Python, C++)
- Tambah animasi counter pada stats (`count-up` dengan `data-target`)
- Parallax banner pada header About

### `project.html`
- Tambah meta SEO + Open Graph + Canonical URL
- Tambah scroll progress bar, toast container, custom cursor, mobile menu
- Tambah **filter bar** (Semua / Web App / UI/UX / JavaScript)
- Setiap kartu proyek punya `data-category` untuk filter
- Thumbnail Finance Tracker diperbarui ke `images/finance tracker.png`

### `contact.html`
- Tambah meta SEO + Open Graph + Canonical URL
- Tambah scroll progress bar, toast container, custom cursor, mobile menu
- Tambah kartu kontak **LinkedIn** *(baru)*
- Setiap link kontak punya `data-toast` untuk notifikasi saat diklik

### `script.js`
- Tambah **custom cursor** dengan efek ring smooth-follow dan state `hovered`
- Tambah **scroll progress bar** (progress pengisian bar di bagian atas)
- Tambah **back-to-top button** (muncul saat scroll > 300px)
- Tambah **ripple effect** pada tombol dan link
- Tambah **toast notification** system (`showToast()`)
- Tambah **project filter** (menyembunyikan/menampilkan kartu berdasarkan kategori)
- Tambah **counter animation** untuk stats di about (`count-up`)
- Tambah **parallax banner** (scroll parallax ringan, dinonaktifkan di mobile/reduced-motion)
- Tambah **hamburger/mobile menu** (`openMobileMenu()`, `closeMobileMenu()`, Escape key support)
- Visitor counter kini memiliki animasi count-up
- Skill bar legacy tetap dipertahankan untuk kompatibilitas

### `style.css`
- Penambahan style untuk semua fitur baru di atas (cursor, scroll progress, toast, ripple, filter bar, skill badges, lightbox, penghargaan grid, dsb.)

### Gambar
- `foto dzaki.jpeg` → dihapus, diganti `images/fotoku.jpg`
- `images/finance tracker.jpeg` → dihapus, diganti `images/finance tracker.png`
- Tambah `images/kost6.jpg`
- Tambah `images/sertif1.jpg` – `images/sertif21.jpg` (21 file)

---

## Fitur Utama

- Typing effect pada hero
- Jam real-time yang diperbarui setiap detik
- Penghitung pengunjung dengan animasi menggunakan `localStorage`
- Toggle dark mode dengan penyimpanan preferensi di `localStorage`
- Animasi muncul saat scroll menggunakan `IntersectionObserver`
- Latar partikel interaktif (via `particles.js` CDN)
- Custom cursor dengan smooth-follow ring
- Scroll progress bar
- Ripple effect pada tombol
- Toast notification
- Hamburger menu untuk mobile
- Back-to-top button
- Parallax banner (desktop only)
- Galeri sertifikat dengan lightbox dan pencarian
- Filter proyek berdasarkan kategori
- Responsif untuk perangkat mobile

---

## Teknologi

- HTML5, CSS3, JavaScript (Vanilla)
- particles.js (CDN)
- Devicons (CDN)
- Google Fonts (Poppins)

---

## Menjalankan

Buka `index.html` di browser (double-click) — tidak perlu server atau build.
