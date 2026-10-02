# Portofolio — Dzaki Pasha Ramadhan

Portofolio pribadi milik Dzaki Pasha Ramadhan — mahasiswa Manajemen Informatika, Universitas Negeri Surabaya. Situs ini dibuat dengan HTML, CSS, dan JavaScript murni (vanilla), tanpa build step.

🌐 **Live:** [dzakipasha.site](https://dzakipasha.site)

---

## Halaman

| File | Keterangan |
|---|---|
| `index.html` | Halaman utama — hero, tech stack, layanan, dan statistik |
| `about.html` | Profil, skill, dan statistik belajar |
| `project.html` | Daftar proyek dengan filter kategori |
| `penghargaan.html` | Galeri sertifikat & penghargaan (23 sertifikat) |
| `contact.html` | WhatsApp, Instagram, Email, GitHub, LinkedIn |

---

## Struktur Proyek

```
Portofolio-Jakk/
├── index.html
├── about.html
├── project.html
├── penghargaan.html
├── contact.html
├── style.css
├── script.js
├── sitemap.xml               ← SEO sitemap
├── robots.txt                ← SEO robots
├── favicon.ico               ← fallback favicon
├── googlec1a37de692454a95.html  ← Google Search Console verification
├── images/
│   ├── fotoku.jpg
│   ├── favicon.jpg           ← favicon logo ZD biru
│   ├── finance tracker.png
│   ├── kostku premium.png
│   ├── absensi mahasiswa.png
│   ├── hand tracking.png     ← thumbnail baru
│   ├── kost1.jpg – kost6.jpg
│   └── sertif1.jpg – sertif23.jpg
└── project/
    ├── hand tracking/        ← project baru
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
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

## Proyek

| Nama | Deskripsi | Teknologi |
|---|---|---|
| 🖐️ Hand Gesture Particle Control | Kontrol partikel interaktif via gerakan tangan real-time dengan kamera | HTML, CSS, JS, MediaPipe |
| 💸 Student Finance Tracker | Manajemen keuangan mahasiswa dengan dashboard interaktif | HTML, CSS, JS |
| 🏡 Kost Finder | Pencarian kost berdasarkan budget, lokasi, dan fasilitas | HTML, CSS, JS |
| 🎓 Sistem Absensi Mahasiswa | Absensi berbasis web dengan statistik dan riwayat kehadiran | HTML, CSS, JS |

---

## SEO

Website sudah dioptimasi untuk mesin pencari:

- ✅ Meta tags lengkap (`description`, `author`, `robots`) di semua halaman
- ✅ Open Graph tags (preview WhatsApp, Facebook, LinkedIn, Discord)
- ✅ Twitter Card tags di semua halaman
- ✅ Canonical URL di semua halaman
- ✅ JSON-LD Schema.org (`Person` di homepage, `CollectionPage` di penghargaan)
- ✅ `sitemap.xml` terdaftar di Google Search Console
- ✅ `robots.txt` dengan referensi sitemap
- ✅ Favicon custom (logo ZD) di semua halaman
- ✅ `lang="id"` pada semua halaman
- ✅ Satu H1 per halaman (heading hierarchy benar)
- ✅ Google Search Console terverifikasi

---

## Fitur Utama

- Typing effect pada hero
- Jam real-time yang diperbarui setiap detik
- Penghitung pengunjung dengan animasi (`localStorage`)
- Toggle dark mode dengan penyimpanan preferensi (`localStorage`)
- Animasi muncul saat scroll (`IntersectionObserver`)
- Latar partikel interaktif (`particles.js` CDN)
- Custom cursor dengan smooth-follow ring
- Scroll progress bar
- Ripple effect pada tombol
- Toast notification
- Hamburger menu untuk mobile
- Back-to-top button
- Parallax banner (desktop only)
- Galeri sertifikat dengan lightbox, pencarian, sort, favorit, download, share
- Filter proyek berdasarkan kategori
- Responsif untuk perangkat mobile

---

## Teknologi

- HTML5, CSS3, JavaScript (Vanilla)
- MediaPipe Hands (hand tracking project)
- particles.js (CDN)
- Devicons (CDN)
- Google Fonts (Poppins)

---

## Menjalankan

Buka `index.html` di browser (double-click) — tidak perlu server atau build step.

> **Catatan:** Project Hand Tracking membutuhkan akses kamera dan koneksi internet (MediaPipe CDN). Jalankan via local server (Live Server / `http-server`) agar kamera bisa diakses.
