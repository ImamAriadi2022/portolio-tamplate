# Panduan Pengelolaan Data Portofolio (JSON-Driven)

Seluruh isi konten dan gambar pada website ini dikelola terpusat tanpa perlu mengubah kode komponen React.

---

## 1. Tempat Menyimpan Gambar & Dokumen (`public/`)

**Hanya ada satu lokasi folder gambar**, yaitu di dalam `public/assets/`:

```text
public/
├── assets/
│   ├── avatar.png               # Foto profil utama
│   ├── proyek/                  # Gambar thumbnail & screenshot project
│   ├── tools/                   # Ikon skill & tools
│   ├── certifications/          # Gambar sertifikat
│   └── experiences/             # Logo perusahaan / organisasi
└── documents/
    └── cv.pdf                   # File CV yang diunduh dari tombol Download CV
```

> **Tips Mudah Menulis Path Gambar di JSON:**
> Anda bisa menulis path lengkap seperti `"/assets/proyek/proyek1.webp"` **atau cukup nama filenya saja** seperti `"proyek1.webp"`, `"avatar.png"`, `"cert-001.svg"`, `"exp-001.svg"`. Sistem akan otomatis mengarahkannya ke subfolder yang sesuai di `public/assets/`.

---

## 2. Tempat Mengubah Konten Teks (`data/`)

Semua file data berada di dalam folder `data/`:

1. **`data/profile.json`** — Mengubah nama, kutipan hero, headline, deskripsi singkat, tentang saya, foto profil (`avatar`), dan file CV (`resume`).
2. **`data/skills.json`** — Mengubah daftar tools/keahlian. Properti `icon` dapat diisi nama pendek (`"react"`, `"tailwind"`, `"figma"`, `"html"`, `"css"`) atau nama file di `public/assets/tools/`.
3. **`data/projects.json`** — Menambah atau mengedit proyek.
   - `featured: true` akan menampilkan proyek di halaman Beranda (maksimal 3 proyek).
   - `slug` dan `id` akan dibuat otomatis dari `title` jika tidak ditulis manual.
   - `gallery` bersifat opsional (jika dikosongkan, otomatis menggunakan `thumbnail`).
4. **`data/certifications.json`** — Menambah atau mengedit sertifikasi. Jika `image` atau `credentialUrl` dikosongkan (`""`), tombol/gambar tersebut otomatis disembunyikan.
5. **`data/experiences.json`** — Menambah atau mengedit pengalaman kerja/organisasi. Otomatis diurutkan dari tanggal terbaru (`startDate`), dan gunakan `"current": true` jika masih berlangsung.
6. **`data/contact.json`** — Mengubah alamat email dan daftar tautan sosial media.
7. **`data/navigation.json`** — Mengatur label dan urutan menu navigasi.
