<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index()
    {
        $projects = [
            [
                'id' => 'borrowit',
                'name' => 'BorrowIt',
                'category' => 'uiux',
                'label' => '🎨 UI/UX Mobile',
                'tagline' => 'Platform Peminjaman Barang Kampus',
                'description' => 'Desain antarmuka aplikasi mobile untuk memudahkan peminjaman barang antar mahasiswa di lingkungan kampus. Dilengkapi fitur verifikasi KTM untuk keamanan dan kepercayaan, chat real-time, sistem rating, serta pencarian barang berbasis lokasi. Didesain dengan tampilan modern dan bersih yang mengutamakan kemudahan penggunaan.',
                'tech' => ['Figma', 'UI/UX Design', 'Mobile Design', 'Prototyping'],
                'color' => '#6C5CE7',
                'thumbnail' => '/images/projects/borrowit/thumbnail.png',
                'images' => [
                    '/images/projects/borrowit/home.png',
                    '/images/projects/borrowit/search.png',
                    '/images/projects/borrowit/detail.png',
                    '/images/projects/borrowit/activity.png',
                ],
                'features' => ['Verifikasi KTM', 'Kategori Barang', 'Chat Real-time', 'Sistem Rating', 'Pencarian Berbasis Lokasi'],
                'steps' => [
                    ['title' => 'Riset Pengguna & Identifikasi Masalah', 'desc' => 'Melakukan riset terhadap mahasiswa untuk memahami permasalahan peminjaman barang di lingkungan kampus, termasuk survei kebutuhan dan analisis pain points.'],
                    ['title' => 'Arsitektur Informasi', 'desc' => 'Menyusun struktur informasi aplikasi meliputi sitemap, user flow peminjaman dan pengembalian, serta hierarki navigasi.'],
                    ['title' => 'Wireframing & Prototipe Awal', 'desc' => 'Membuat wireframe untuk setiap halaman utama seperti home, search, detail barang, dan activity tracking sebagai kerangka awal desain.'],
                    ['title' => 'Desain UI & Design System', 'desc' => 'Mendesain antarmuka high-fidelity di Figma dengan design system yang konsisten meliputi color palette, typography, spacing, dan komponen reusable.'],
                    ['title' => 'Prototyping & Pengujian Pengguna', 'desc' => 'Membangun interactive prototype dan melakukan usability testing dengan target pengguna untuk validasi alur serta perbaikan UI/UX berdasarkan feedback.'],
                ],
            ],
            [
                'id' => 'ekost',
                'name' => 'E-Kost Manager',
                'category' => 'web',
                'label' => '🌐 Web App',
                'tagline' => 'Sistem Manajemen Properti Kost',
                'description' => 'Platform web untuk manajemen kost yang komprehensif. Memungkinkan pemilik kost mengelola penyewa, melacak pembayaran, dan menangani keluhan secara digital. Penyewa dapat mencari properti, melakukan pembayaran, dan berkomunikasi dengan pemilik secara seamless. Dibangun menggunakan Laravel dengan fitur lengkap untuk kedua sisi pengguna.',
                'tech' => ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
                'color' => '#0C1B3A',
                'thumbnail' => '/images/projects/ekost/thumbnail.png',
                'images' => [
                    '/images/projects/ekost/home.png',
                    '/images/projects/ekost/payment.png',
                    '/images/projects/ekost/profile.png',
                    '/images/projects/ekost/addproperty.png',
                ],
                'features' => ['Dashboard Pemilik', 'Portal Penyewa', 'Pelacakan Pembayaran', 'Daftar Properti', 'Sistem Testimoni'],
                'steps' => [
                    ['title' => 'Analisis Kebutuhan', 'desc' => 'Menganalisis kebutuhan sistem manajemen kost dari sisi pemilik dan penyewa, termasuk fitur pembayaran, keluhan, dan pencarian properti.'],
                    ['title' => 'Perancangan Database', 'desc' => 'Merancang skema database relasional dengan tabel users, properties, rooms, payments, complaints, dan testimonials beserta relasinya.'],
                    ['title' => 'Pengembangan Backend', 'desc' => 'Mengembangkan backend menggunakan Laravel dengan fitur autentikasi multi-role (pemilik/penyewa), CRUD properti, dan sistem pembayaran digital.'],
                    ['title' => 'Implementasi Frontend', 'desc' => 'Membangun antarmuka responsif dengan Bootstrap dan JavaScript untuk dashboard pemilik, portal penyewa, serta halaman pencarian properti.'],
                    ['title' => 'Pengujian & Deployment', 'desc' => 'Melakukan pengujian fungsional pada setiap modul, perbaikan bug, dan deployment ke server production.'],
                ],
            ],
            [
                'id' => 'melodean',
                'name' => 'Melodean',
                'category' => 'uiux',
                'label' => '🎨 UI/UX Mobile',
                'tagline' => 'E-Learning Interaktif untuk Siswa',
                'description' => 'Desain antarmuka platform e-learning mobile yang menarik untuk siswa SMA. Menampilkan elemen gamifikasi termasuk poin, badge, dan leaderboard untuk memotivasi proses belajar. Dilengkapi manajemen jadwal, modul pembelajaran berbasis mata pelajaran, dan pemindaian absensi berbasis QR. Didesain dengan pendekatan playful namun tetap fungsional.',
                'tech' => ['Figma', 'UI/UX Design', 'Mobile Design', 'Gamification'],
                'color' => '#0066CC',
                'thumbnail' => '/images/projects/melodean/thumbnail.png',
                'images' => [
                    '/images/projects/melodean/learn.png',
                    '/images/projects/melodean/leaderboard.png',
                    '/images/projects/melodean/profile.png',
                    '/images/projects/melodean/scan.png',
                ],
                'features' => ['Sistem Gamifikasi', 'Modul Pelajaran', 'Absensi QR', 'Leaderboard', 'Koleksi Badge'],
                'steps' => [
                    ['title' => 'Riset Pengguna & Persona', 'desc' => 'Melakukan riset terhadap siswa SMA untuk memahami motivasi belajar dan preferensi penggunaan aplikasi e-learning, lalu menyusun user persona.'],
                    ['title' => 'Strategi Gamifikasi', 'desc' => 'Merancang sistem gamifikasi meliputi poin, badge, dan leaderboard untuk meningkatkan engagement dan motivasi belajar siswa.'],
                    ['title' => 'Desain UI/UX', 'desc' => 'Mendesain antarmuka yang menarik dan ramah pengguna di Figma dengan pendekatan playful namun tetap fungsional untuk konteks edukasi.'],
                    ['title' => 'Prototyping Interaktif', 'desc' => 'Membangun prototype interaktif dengan micro-interactions, animasi transisi, dan simulasi fitur absensi QR scanning.'],
                    ['title' => 'Pengujian Usability & Iterasi', 'desc' => 'Melakukan usability testing dengan siswa dan guru, mengumpulkan feedback, serta melakukan iterasi desain berdasarkan temuan testing.'],
                ],
            ],
            [
                'id' => 'nusantara',
                'name' => 'Nusantara Legacy',
                'category' => 'uiux',
                'label' => '🎨 UI/UX Web',
                'tagline' => 'Platform Warisan Budaya Indonesia',
                'description' => 'Desain antarmuka platform web yang didedikasikan untuk melestarikan dan membagikan warisan budaya Indonesia. Menampilkan artikel budaya, podcast sejarah (Historiccast), circle komunitas, dan aktivitas interaktif. Pengguna dapat menjelajahi, berkontribusi, dan belajar tentang keragaman budaya Indonesia. Didesain dengan nuansa budaya yang kuat dan navigasi intuitif.',
                'tech' => ['Figma', 'UI/UX Design', 'Web Design', 'Prototyping'],
                'color' => '#0F3D3E',
                'thumbnail' => '/images/projects/nusantara/thumbnail.png',
                'images' => [
                    '/images/projects/nusantara/landing.png',
                    '/images/projects/nusantara/about.png',
                    '/images/projects/nusantara/historiccast.png',
                    '/images/projects/nusantara/login.png',
                ],
                'features' => ['Artikel Budaya', 'Podcast Historiccast', 'Circle Komunitas', 'Aktivitas Interaktif', 'Pencarian & Eksplorasi'],
                'steps' => [
                    ['title' => 'Riset Konten & Strategi', 'desc' => 'Melakukan riset mendalam tentang budaya Indonesia dan menyusun strategi konten meliputi artikel budaya, podcast sejarah, dan aktivitas interaktif.'],
                    ['title' => 'Arsitektur Informasi & Sitemap', 'desc' => 'Merancang struktur informasi website termasuk sitemap, user flow, dan hierarki konten untuk navigasi yang intuitif.'],
                    ['title' => 'Wireframing & Layout', 'desc' => 'Membuat wireframe untuk setiap halaman utama meliputi landing page, halaman artikel, podcast player, dan area komunitas.'],
                    ['title' => 'Desain Visual & UI', 'desc' => 'Mendesain antarmuka high-fidelity dengan nuansa budaya Indonesia yang kaya, dilengkapi tipografi dan warna yang mencerminkan identitas Nusantara.'],
                    ['title' => 'Prototyping & Validasi', 'desc' => 'Membangun prototype interaktif dan melakukan validasi desain dengan target pengguna untuk memastikan pengalaman yang optimal.'],
                ],
            ],
            [
                'id' => 'paynow',
                'name' => 'PayNow',
                'category' => 'uiux',
                'label' => '🎨 UI/UX Mobile',
                'tagline' => 'Dompet Digital & Solusi Pembayaran',
                'description' => 'Desain antarmuka aplikasi dompet digital modern yang memungkinkan transfer uang cepat dan aman, pembayaran tagihan, dan pelacakan keuangan. Dilengkapi fitur top-up, transfer internasional, ringkasan keuangan, reward voucher, dan autentikasi biometrik untuk keamanan lebih baik. Didesain dengan fokus pada kepercayaan dan kemudahan transaksi.',
                'tech' => ['Figma', 'UI/UX Design', 'Mobile Design', 'FinTech'],
                'color' => '#3B3F8C',
                'thumbnail' => '/images/projects/paynow/thumbnail.jpg',
                'images' => [
                    '/images/projects/paynow/login.jpg',
                    '/images/projects/paynow/transfer.jpg',
                    '/images/projects/paynow/activity.jpg',
                    '/images/projects/paynow/rewards.jpg',
                ],
                'features' => ['Dompet Digital', 'Pembayaran Tagihan', 'Pelacakan Keuangan', 'Reward Voucher', 'Autentikasi Biometrik'],
                'steps' => [
                    ['title' => 'Riset Pasar & Analisis Kompetitor', 'desc' => 'Menganalisis aplikasi fintech sejenis di pasar untuk memahami standar industri, fitur unggulan, dan peluang diferensiasi produk.'],
                    ['title' => 'Pemetaan User Flow', 'desc' => 'Merancang user flow untuk proses transfer, top-up, pembayaran tagihan, dan reward system dengan fokus pada efisiensi dan keamanan transaksi.'],
                    ['title' => 'Design System UI', 'desc' => 'Membangun design system komprehensif di Figma meliputi komponen finansial, color coding untuk transaksi, dan iconography khusus fintech.'],
                    ['title' => 'Prototipe High-Fidelity', 'desc' => 'Membuat prototype high-fidelity dengan animasi transisi antar halaman, simulasi autentikasi biometrik, dan micro-interactions pada elemen finansial.'],
                    ['title' => 'Pengujian Usability & Iterasi', 'desc' => 'Melakukan usability testing fokus pada kepercayaan dan kemudahan penggunaan, lalu iterasi berdasarkan feedback pengguna.'],
                ],
            ],
            [
                'id' => 'warasa',
                'name' => 'Warasa',
                'category' => 'web',
                'label' => '🌐 Web & Mobile App',
                'tagline' => 'Asisten E-Commerce Berbasis AI',
                'description' => 'Platform web dan mobile berbasis AI yang dirancang untuk membantu seller Shopee mengoptimalkan bisnis online mereka. Dilengkapi fitur smart product generation, kalkulator ROAS, SEO scoring, analisis kompetitor, dan tools bulk export. Dipercaya oleh 10.000+ seller online untuk meningkatkan performa toko mereka.',
                'tech' => ['Laravel', 'Flutter', 'AI/ML', 'Shopee API', 'JavaScript'],
                'color' => '#FF6B35',
                'thumbnail' => '/images/projects/warasa/thumbnail.png',
                'images' => [
                    '/images/projects/warasa/features.png',
                    '/images/projects/warasa/workflow.png',
                    '/images/projects/warasa/tools.png',
                    '/images/projects/warasa/testimonials.png',
                ],
                'features' => ['Generator Produk AI', 'Kalkulator ROAS', 'Optimasi SEO', 'Analisis Kompetitor', 'Ekspor Massal'],
                'steps' => [
                    ['title' => 'Riset Pasar & Kebutuhan Seller', 'desc' => 'Melakukan riset kebutuhan seller Shopee meliputi tantangan optimasi produk, analisis kompetitor, dan pengelolaan toko online yang efektif.'],
                    ['title' => 'Arsitektur Integrasi AI', 'desc' => 'Merancang arsitektur integrasi AI/ML untuk fitur smart product generation, SEO scoring, dan analisis kompetitor berbasis Shopee API.'],
                    ['title' => 'Pengembangan Backend & API', 'desc' => 'Mengembangkan backend Laravel dengan integrasi Shopee API, implementasi algoritma AI untuk rekomendasi produk, dan kalkulator ROAS.'],
                    ['title' => 'Desain Dashboard & Mobile App', 'desc' => 'Membangun dashboard web dan aplikasi mobile Flutter yang intuitif dengan visualisasi data performa produk dan tools bulk export.'],
                    ['title' => 'Pengujian & Optimasi Performa', 'desc' => 'Melakukan testing end-to-end pada semua fitur, optimasi performa API, dan load testing untuk memastikan skalabilitas platform.'],
                ],
            ],
            [
                'id' => 'spr',
                'name' => 'Emotion-Based Music Recommender',
                'category' => 'data',
                'label' => '📊 Data Analysis',
                'tagline' => 'Sistem Rekomendasi Musik Berbasis Emosi',
                'description' => 'Sistem rekomendasi musik berbasis AI yang dapat dijelaskan, menggunakan attention-based emotion preference learning. Sistem mendeteksi emosi pengguna dari input teks, menerapkan TF-IDF + Logistic Regression untuk klasifikasi sentimen, menggunakan analisis fitur berbobot attention, dan memberikan rekomendasi lagu berbasis konten dengan transparansi XAI (Explainable AI) penuh.',
                'tech' => ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib', 'TF-IDF', 'Logistic Regression'],
                'color' => '#10B981',
                'thumbnail' => '/images/projects/spr/chart_1.png',
                'images' => [
                    '/images/projects/spr/chart_1.png',
                    '/images/projects/spr/chart_2.png',
                    '/images/projects/spr/chart_3.png',
                    '/images/projects/spr/chart_4.png',
                    '/images/projects/spr/chart_5.png',
                    '/images/projects/spr/chart_6.png',
                ],
                'features' => ['Deteksi Emosi', 'Pembobotan Berbasis Attention', 'Content-Based Filtering', 'Explainable AI (XAI)', 'Klasifikasi Sentimen', 'Evaluasi Top-K'],
                'steps' => [
                    ['title' => 'Preprocessing Data', 'desc' => 'Standarisasi kolom, menangani missing values, dan menyiapkan dataset sentimen musik untuk analisis.'],
                    ['title' => 'Analisis Data Eksploratif', 'desc' => 'Memvisualisasikan distribusi sentimen, distribusi genre, proporsi mood, kategori tempo, dan korelasi sentimen-genre.'],
                    ['title' => 'Deteksi Emosi', 'desc' => 'Menerapkan vektorisasi TF-IDF dan Logistic Regression untuk mengklasifikasikan input teks pengguna ke dalam kategori emosi (Happy, Sad, Motivated, Relaxed).'],
                    ['title' => 'Attention-Based Preference Learning', 'desc' => 'Menghitung bobot attention per fitur per sentimen — fitur dengan variansi lebih rendah (lebih konsisten) mendapatkan skor attention lebih tinggi.'],
                    ['title' => 'Content-Based Filtering', 'desc' => 'Membangun cosine similarity berbobot menggunakan attention weights untuk menemukan lagu yang paling relevan dengan profil emosi yang terdeteksi.'],
                    ['title' => 'Explainable AI & Visualisasi', 'desc' => 'Menghasilkan breakdown kontribusi fitur per lagu, analisis kata attention, dan heatmap XAI yang menjelaskan mengapa setiap lagu direkomendasikan.'],
                    ['title' => 'Evaluasi', 'desc' => 'Mengevaluasi performa sistem menggunakan metrik Precision@K, Recall@K, Hit Rate, MAP, dan NDCG pada K=3, K=5, dan K=7.'],
                ],
            ],
            [
                'id' => 'pixora',
                'name' => 'Pixora',
                'category' => 'web',
                'label' => '🌐 Web & Mobile App',
                'tagline' => 'Platform Booking Studio Fotografi',
                'description' => 'Platform booking studio fotografi full-stack yang menghubungkan pelanggan dengan layanan fotografi profesional. Versi web dibangun dengan Laravel menyediakan landing page, katalog paket, kalender booking interaktif, pembayaran online via Midtrans (VA, E-Wallet, QRIS), invoice digital, admin dashboard, serta integrasi AI assistant. Versi mobile dibangun dengan Flutter menghadirkan pengalaman booking yang seamless dengan fitur browse paket, kalender ketersediaan, pembayaran dalam aplikasi, chatbot AI, Google Sign-In, dan manajemen profil lengkap dengan riwayat booking.',
                'tech' => ['Laravel', 'Flutter', 'MySQL', 'Midtrans', 'AI Integration', 'Google Auth'],
                'color' => '#E11D48',
                'thumbnail' => '/images/projects/pixora/thumbnail.png',
                'images' => [
                    '/images/projects/pixora/landing.png',
                    '/images/projects/pixora/packages.png',
                    '/images/projects/pixora/booking.png',
                    '/images/projects/pixora/mobile.png',
                ],
                'features' => ['Booking Online', 'Pembayaran Midtrans', 'AI Assistant', 'Kalender Interaktif', 'Admin Dashboard', 'Mobile App Flutter'],
                'steps' => [
                    ['title' => 'Analisis Kebutuhan & Perancangan', 'desc' => 'Menganalisis kebutuhan platform booking studio fotografi, merancang database relasional (users, packages, bookings, payments), serta menyusun arsitektur integrasi web dan mobile.'],
                    ['title' => 'Pengembangan Backend Laravel', 'desc' => 'Membangun backend Laravel dengan autentikasi multi-role (admin/customer), CRUD paket fotografi, sistem booking dengan validasi ketersediaan jadwal, dan REST API untuk aplikasi mobile.'],
                    ['title' => 'Integrasi Payment Gateway', 'desc' => 'Mengintegrasikan Midtrans Snap untuk pembayaran online mendukung Virtual Account, E-Wallet, dan QRIS, lengkap dengan webhook notification dan invoice PDF otomatis.'],
                    ['title' => 'Pengembangan Mobile App Flutter', 'desc' => 'Membangun aplikasi mobile menggunakan Flutter dengan Provider state management, fitur browse paket, kalender booking, pembayaran via WebView, chatbot AI, dan Google Sign-In.'],
                    ['title' => 'Integrasi AI & Testing', 'desc' => 'Mengintegrasikan AI assistant untuk FAQ dan bantuan booking, melakukan pengujian end-to-end pada alur booking dan pembayaran di web maupun mobile, serta optimasi performa.'],
                ],
            ],
            [
                'id' => 'qa-cazh',
                'name' => 'Quality Assurance — PT Cazh',
                'category' => 'qa',
                'label' => '🔍 Quality Assurance',
                'tagline' => 'Pengujian Kualitas Produk Digital',
                'description' => 'Proyek magang sebagai Quality Assurance di PT Cazh Purwokerto (Juli — Agustus 2026). Bertanggung jawab melakukan pengujian fungsional dan non-fungsional pada produk digital perusahaan, menyusun test case dan test scenario, melaporkan bug melalui bug tracking system, serta memastikan kualitas produk sebelum rilis ke production environment.',
                'tech' => ['Manual Testing', 'Test Case', 'Bug Tracking', 'Functional Testing', 'Regression Testing'],
                'color' => '#0EA5E9',
                'thumbnail' => '/images/projects/qa-cazh/thumbnail.png',
                'images' => [
                    '/images/projects/qa-cazh/landing.png',
                    '/images/projects/qa-cazh/login.png',
                    '/images/projects/qa-cazh/check_card.png',
                    '/images/projects/qa-cazh/uat_document.png',
                ],
                'features' => ['Pengujian Fungsional', 'Penyusunan Test Case', 'Pelaporan Bug', 'Regression Testing', 'Validasi UI/UX'],
                'steps' => [
                    ['title' => 'Analisis Requirements & Dokumen', 'desc' => 'Mempelajari dokumen spesifikasi produk, user story, dan acceptance criteria untuk memahami fitur yang akan diuji.'],
                    ['title' => 'Penyusunan Test Case & Test Scenario', 'desc' => 'Merancang test case dan test scenario yang komprehensif mencakup positive testing, negative testing, dan edge case untuk setiap fitur.'],
                    ['title' => 'Eksekusi Pengujian Fungsional', 'desc' => 'Menjalankan pengujian fungsional secara manual pada setiap modul produk digital, memverifikasi kesesuaian dengan spesifikasi yang telah ditentukan.'],
                    ['title' => 'Pelaporan Bug & Tracking', 'desc' => 'Mendokumentasikan dan melaporkan bug yang ditemukan melalui bug tracking system dengan detail steps to reproduce, severity, dan priority.'],
                    ['title' => 'Regression Testing & Validasi', 'desc' => 'Melakukan regression testing setelah perbaikan bug untuk memastikan tidak ada fitur lain yang terdampak, serta validasi akhir sebelum rilis ke production.'],
                ],
            ],
        ];

        $skills = [
            [
                'category' => 'UI/UX Design',
                'icon' => 'palette',
                'items' => ['Figma', 'Adobe XD', 'Prototyping', 'Wireframing', 'User Research', 'Design System'],
            ],
            [
                'category' => 'Web Development',
                'icon' => 'code',
                'items' => ['Laravel', 'PHP', 'JavaScript', 'HTML/CSS', 'MySQL', 'REST API'],
            ],
            [
                'category' => 'Mobile Development',
                'icon' => 'smartphone',
                'items' => ['Flutter', 'Dart', 'Firebase', 'Mobile UI', 'State Management', 'API Integration'],
            ],
            [
                'category' => 'Data Analysis',
                'icon' => 'chart',
                'items' => ['Python', 'Pandas', 'Matplotlib', 'Scikit-learn', 'TF-IDF', 'Machine Learning'],
            ],
            [
                'category' => 'Quality Assurance',
                'icon' => 'shield',
                'items' => ['Manual Testing', 'Test Case Design', 'Bug Reporting', 'Functional Testing', 'Regression Testing', 'Bug Tracking'],
            ],
        ];

        $education = [
            [
                'institution' => 'Telkom University Purwokerto',
                'degree' => 'S1 Teknik Informatika',
                'year' => '2023 — Sekarang',
                'icon' => 'university',
            ],
            [
                'institution' => 'SMA Negeri 2 Pati',
                'degree' => 'Jurusan IPA',
                'year' => '2020 — 2023',
                'icon' => 'school',
            ],
        ];

        $achievements = [
            [
                'title' => 'Penyisihan Nasional GEMASTIK 2025',
                'detail' => 'UI/UX Design (Leader)',
                'icon' => '🏆',
            ],
            [
                'title' => 'Penyisihan Nasional GEMASTIK 2025',
                'detail' => 'Karya Tulis Ilmiah (Anggota)',
                'icon' => '🏆',
            ],
            [
                'title' => 'Penyisihan Nasional GEMASTIK 2024',
                'detail' => 'Data Mining (Leader)',
                'icon' => '🏆',
            ],
            [
                'title' => 'Posisi 7 Lomba Nasional UI/UX Design',
                'detail' => 'ITASE 6.0',
                'icon' => '🥇',
            ],
            [
                'title' => 'Juara 2 Lomba Mobile Legend Internal',
                'detail' => 'SMA Negeri 2 Pati',
                'icon' => '🥈',
            ],
        ];

        $organizations = [
            [
                'role' => 'Coach Mobile Legend',
                'org' => 'Tel U Purwokerto Esport',
                'year' => 'Des 2025 — Des 2026',
                'desc' => 'Melatih strategi tim, koordinasi gameplay, dan komunikasi dalam tim kompetitif.',
            ],
            [
                'role' => 'Member — Divisi AI',
                'org' => 'SIRCLE',
                'year' => 'Okt 2023 — Jul 2025',
                'desc' => 'Mempelajari preprocessing data, EDA, dan dasar machine learning.',
            ],
            [
                'role' => 'Member',
                'org' => 'SRE ITTP',
                'year' => 'Feb 2024 — Jul 2025',
                'desc' => 'Belajar tentang Energi Terbarukan. Panitia Career Talk (12 Okt 2024).',
            ],
            [
                'role' => 'Talent',
                'org' => 'Tim Otak Kanan',
                'year' => 'Okt 2023 — Sep 2024',
                'desc' => 'Menyusun naskah konten promosi kampus. Talent video branding institusi.',
            ],
        ];

        return view('portfolio', compact('projects', 'skills', 'education', 'achievements', 'organizations'));
    }
}
