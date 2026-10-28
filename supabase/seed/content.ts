// Konten portofolio yang dipindahkan dari repo Laravel lama (lihat assets-lama/).
// Teks Indonesia diambil apa adanya dari PortfolioController.php dan portfolio.blade.php,
// teks Inggris dari kamus portfolio.js. Terjemahan yang belum ada di versi lama
// ditandai dengan komentar "terjemahan baru".
//
// Jangan edit supabase/seed.sql langsung: ubah file ini lalu jalankan `pnpm db:seed:generate`.

export type Localized = { id: string; en: string };
export type LocalizedList = { id: string[]; en: string[] };
export type ProjectCategory = "uiux" | "web" | "data" | "qa";

export type SeedProject = {
  slug: string;
  title: string;
  category: ProjectCategory;
  label: Localized;
  color: string;
  thumbnail: string;
  tagline: Localized;
  description: Localized;
  features: LocalizedList;
  technologies: string[];
  images: { path: string; alt: Localized }[];
  steps: { title: Localized; description: Localized }[];
};

const same = (text: string): Localized => ({ id: text, en: text });

// Nama tampilan per nama file gambar, untuk teks alternatif (terjemahan baru).
const screenNames: Record<string, Localized> = {
  about: { id: "halaman tentang", en: "about page" },
  activity: { id: "halaman aktivitas", en: "activity screen" },
  addproperty: { id: "halaman tambah properti", en: "add property page" },
  booking: { id: "halaman pemesanan", en: "booking page" },
  check_card: { id: "pengecekan kartu", en: "card check" },
  detail: { id: "halaman detail barang", en: "item detail screen" },
  features: { id: "halaman fitur", en: "features page" },
  historiccast: { id: "halaman Historiccast", en: "Historiccast page" },
  home: { id: "halaman beranda", en: "home screen" },
  landing: { id: "halaman utama", en: "landing page" },
  leaderboard: { id: "papan peringkat", en: "leaderboard screen" },
  learn: { id: "halaman materi belajar", en: "learning screen" },
  login: { id: "halaman masuk", en: "login screen" },
  mobile: { id: "aplikasi mobile", en: "mobile app" },
  packages: { id: "halaman paket", en: "packages page" },
  payment: { id: "halaman pembayaran", en: "payment page" },
  profile: { id: "halaman profil", en: "profile screen" },
  rewards: { id: "halaman hadiah", en: "rewards screen" },
  scan: { id: "pemindaian absensi QR", en: "QR attendance scan" },
  search: { id: "halaman pencarian", en: "search screen" },
  testimonials: { id: "halaman testimoni", en: "testimonials page" },
  tools: { id: "halaman alat", en: "tools page" },
  transfer: { id: "halaman transfer", en: "transfer screen" },
  uat_document: { id: "dokumen UAT", en: "UAT document" },
  workflow: { id: "halaman alur kerja", en: "workflow page" },
};

const screenshots = (slug: string, title: string, files: string[]) =>
  files.map((file) => {
    const stem = file.replace(/\.[a-z]+$/, "");
    const chart = /^chart_(\d+)$/.exec(stem);
    const alt: Localized = chart
      ? {
          id: `Grafik analisis ${title} ${chart[1]}`,
          en: `${title} analysis chart ${chart[1]}`,
        }
      : {
          id: `Tangkapan layar ${title}: ${screenNames[stem]?.id ?? stem}`,
          en: `${title} screenshot: ${screenNames[stem]?.en ?? stem}`,
        };
    return { path: `/images/projects/${slug}/${file}`, alt };
  });

export const projects: SeedProject[] = [
  {
    slug: "borrowit",
    title: "BorrowIt",
    category: "uiux",
    label: same("🎨 UI/UX Mobile"),
    color: "#6C5CE7",
    thumbnail: "/images/projects/borrowit/thumbnail.png",
    tagline: {
      id: "Platform Peminjaman Barang Kampus",
      en: "Campus Item Lending Platform",
    },
    description: {
      id: "Desain antarmuka aplikasi mobile untuk memudahkan peminjaman barang antar mahasiswa di lingkungan kampus. Dilengkapi fitur verifikasi KTM untuk keamanan dan kepercayaan, chat real-time, sistem rating, serta pencarian barang berbasis lokasi. Didesain dengan tampilan modern dan bersih yang mengutamakan kemudahan penggunaan.",
      en: "Mobile app interface design to facilitate item lending among campus students. Features KTM verification for security, real-time chat, rating system, and location-based search. Designed with a modern, clean look prioritizing ease of use.",
    },
    features: {
      id: [
        "Verifikasi KTM",
        "Kategori Barang",
        "Chat Real-time",
        "Sistem Rating",
        "Pencarian Berbasis Lokasi",
      ],
      en: [
        "KTM Verification",
        "Item Categories",
        "Real-time Chat",
        "Rating System",
        "Location-based Search",
      ],
    },
    technologies: ["Figma", "UI/UX Design", "Mobile Design", "Prototyping"],
    images: screenshots("borrowit", "BorrowIt", [
      "home.png",
      "search.png",
      "detail.png",
      "activity.png",
    ]),
    steps: [
      {
        title: {
          id: "Riset Pengguna & Identifikasi Masalah",
          en: "User Research & Problem Identification",
        },
        description: {
          id: "Melakukan riset terhadap mahasiswa untuk memahami permasalahan peminjaman barang di lingkungan kampus, termasuk survei kebutuhan dan analisis pain points.",
          en: "Researching students to understand item lending issues on campus, including needs surveys and pain point analysis.",
        },
      },
      {
        title: { id: "Arsitektur Informasi", en: "Information Architecture" },
        description: {
          id: "Menyusun struktur informasi aplikasi meliputi sitemap, user flow peminjaman dan pengembalian, serta hierarki navigasi.",
          en: "Structuring the app including sitemap, lending/return user flows, and navigation hierarchy.",
        },
      },
      {
        title: {
          id: "Wireframing & Prototipe Awal",
          en: "Wireframing & Early Prototype",
        },
        description: {
          id: "Membuat wireframe untuk setiap halaman utama seperti home, search, detail barang, dan activity tracking sebagai kerangka awal desain.",
          en: "Creating wireframes for main pages: home, search, item detail, and activity tracking.",
        },
      },
      {
        title: {
          id: "Desain UI & Design System",
          en: "UI Design & Design System",
        },
        description: {
          id: "Mendesain antarmuka high-fidelity di Figma dengan design system yang konsisten meliputi color palette, typography, spacing, dan komponen reusable.",
          en: "Designing high-fidelity interfaces in Figma with consistent design system including color palette, typography, and reusable components.",
        },
      },
      {
        title: {
          id: "Prototyping & Pengujian Pengguna",
          en: "Prototyping & User Testing",
        },
        description: {
          id: "Membangun interactive prototype dan melakukan usability testing dengan target pengguna untuk validasi alur serta perbaikan UI/UX berdasarkan feedback.",
          en: "Building interactive prototype and conducting usability testing with target users for validation and UI/UX improvements.",
        },
      },
    ],
  },
  {
    slug: "ekost",
    title: "E-Kost Manager",
    category: "web",
    label: same("🌐 Web App"),
    color: "#0C1B3A",
    thumbnail: "/images/projects/ekost/thumbnail.png",
    tagline: {
      id: "Sistem Manajemen Properti Kost",
      en: "Boarding House Management System",
    },
    description: {
      id: "Platform web untuk manajemen kost yang komprehensif. Memungkinkan pemilik kost mengelola penyewa, melacak pembayaran, dan menangani keluhan secara digital. Penyewa dapat mencari properti, melakukan pembayaran, dan berkomunikasi dengan pemilik secara seamless. Dibangun menggunakan Laravel dengan fitur lengkap untuk kedua sisi pengguna.",
      en: "Comprehensive boarding house management web platform. Allows owners to manage tenants, track payments, and handle complaints digitally. Tenants can search properties, make payments, and communicate with owners seamlessly. Built with Laravel with full features for both user roles.",
    },
    features: {
      id: [
        "Dashboard Pemilik",
        "Portal Penyewa",
        "Pelacakan Pembayaran",
        "Daftar Properti",
        "Sistem Testimoni",
      ],
      en: [
        "Owner Dashboard",
        "Tenant Portal",
        "Payment Tracking",
        "Property Listings",
        "Testimonial System",
      ],
    },
    technologies: ["Laravel", "PHP", "MySQL", "Bootstrap", "JavaScript"],
    images: screenshots("ekost", "E-Kost Manager", [
      "home.png",
      "payment.png",
      "profile.png",
      "addproperty.png",
    ]),
    steps: [
      {
        title: { id: "Analisis Kebutuhan", en: "Requirements Analysis" },
        description: {
          id: "Menganalisis kebutuhan sistem manajemen kost dari sisi pemilik dan penyewa, termasuk fitur pembayaran, keluhan, dan pencarian properti.",
          en: "Analyzing boarding house management needs from owner and tenant perspectives, including payment, complaints, and property search features.",
        },
      },
      {
        title: { id: "Perancangan Database", en: "Database Design" },
        description: {
          id: "Merancang skema database relasional dengan tabel users, properties, rooms, payments, complaints, dan testimonials beserta relasinya.",
          en: "Designing relational database schema with users, properties, rooms, payments, complaints, and testimonials tables.",
        },
      },
      {
        title: { id: "Pengembangan Backend", en: "Backend Development" },
        description: {
          id: "Mengembangkan backend menggunakan Laravel dengan fitur autentikasi multi-role (pemilik/penyewa), CRUD properti, dan sistem pembayaran digital.",
          en: "Developing backend using Laravel with multi-role authentication (owner/tenant), property CRUD, and digital payment system.",
        },
      },
      {
        title: { id: "Implementasi Frontend", en: "Frontend Implementation" },
        description: {
          id: "Membangun antarmuka responsif dengan Bootstrap dan JavaScript untuk dashboard pemilik, portal penyewa, serta halaman pencarian properti.",
          en: "Building responsive interface with Bootstrap and JavaScript for owner dashboard, tenant portal, and property search.",
        },
      },
      {
        title: { id: "Pengujian & Deployment", en: "Testing & Deployment" },
        description: {
          id: "Melakukan pengujian fungsional pada setiap modul, perbaikan bug, dan deployment ke server production.",
          en: "Functional testing on every module, bug fixes, and deployment to production server.",
        },
      },
    ],
  },
  {
    slug: "melodean",
    title: "Melodean",
    category: "uiux",
    label: same("🎨 UI/UX Mobile"),
    color: "#0066CC",
    thumbnail: "/images/projects/melodean/thumbnail.png",
    tagline: {
      id: "E-Learning Interaktif untuk Siswa",
      en: "Interactive E-Learning for Students",
    },
    description: {
      id: "Desain antarmuka platform e-learning mobile yang menarik untuk siswa SMA. Menampilkan elemen gamifikasi termasuk poin, badge, dan leaderboard untuk memotivasi proses belajar. Dilengkapi manajemen jadwal, modul pembelajaran berbasis mata pelajaran, dan pemindaian absensi berbasis QR. Didesain dengan pendekatan playful namun tetap fungsional.",
      // Kalimat terakhir adalah terjemahan baru; versi lama memotongnya.
      en: "Attractive mobile e-learning interface design for high school students. Features gamification elements including points, badges, and leaderboard to motivate learning. Includes schedule management, subject-based learning modules, and QR-based attendance scanning. Designed with a playful yet functional approach.",
    },
    features: {
      id: [
        "Sistem Gamifikasi",
        "Modul Pelajaran",
        "Absensi QR",
        "Leaderboard",
        "Koleksi Badge",
      ],
      en: [
        "Gamification System",
        "Learning Modules",
        "QR Attendance",
        "Leaderboard",
        "Badge Collection",
      ],
    },
    technologies: ["Figma", "UI/UX Design", "Mobile Design", "Gamification"],
    images: screenshots("melodean", "Melodean", [
      "learn.png",
      "leaderboard.png",
      "profile.png",
      "scan.png",
    ]),
    steps: [
      {
        title: {
          id: "Riset Pengguna & Persona",
          en: "User Research & Persona",
        },
        description: {
          id: "Melakukan riset terhadap siswa SMA untuk memahami motivasi belajar dan preferensi penggunaan aplikasi e-learning, lalu menyusun user persona.",
          en: "Researching high school students to understand learning motivation and e-learning app preferences, then creating user personas.",
        },
      },
      {
        title: { id: "Strategi Gamifikasi", en: "Gamification Strategy" },
        description: {
          id: "Merancang sistem gamifikasi meliputi poin, badge, dan leaderboard untuk meningkatkan engagement dan motivasi belajar siswa.",
          en: "Designing gamification system including points, badges, and leaderboard to increase student engagement and motivation.",
        },
      },
      {
        title: { id: "Desain UI/UX", en: "UI/UX Design" },
        description: {
          id: "Mendesain antarmuka yang menarik dan ramah pengguna di Figma dengan pendekatan playful namun tetap fungsional untuk konteks edukasi.",
          en: "Designing attractive and user-friendly interfaces in Figma with a playful yet functional approach for educational context.",
        },
      },
      {
        title: { id: "Prototyping Interaktif", en: "Interactive Prototyping" },
        description: {
          id: "Membangun prototype interaktif dengan micro-interactions, animasi transisi, dan simulasi fitur absensi QR scanning.",
          en: "Building interactive prototype with micro-interactions, transition animations, and QR scanning simulation.",
        },
      },
      {
        title: {
          id: "Pengujian Usability & Iterasi",
          en: "Usability Testing & Iteration",
        },
        description: {
          id: "Melakukan usability testing dengan siswa dan guru, mengumpulkan feedback, serta melakukan iterasi desain berdasarkan temuan testing.",
          en: "Conducting usability testing with students and teachers, collecting feedback, and iterating designs based on findings.",
        },
      },
    ],
  },
  {
    slug: "nusantara",
    title: "Nusantara Legacy",
    category: "uiux",
    label: same("🎨 UI/UX Web"),
    color: "#0F3D3E",
    thumbnail: "/images/projects/nusantara/thumbnail.png",
    tagline: {
      id: "Platform Warisan Budaya Indonesia",
      en: "Indonesian Cultural Heritage Platform",
    },
    description: {
      id: "Desain antarmuka platform web yang didedikasikan untuk melestarikan dan membagikan warisan budaya Indonesia. Menampilkan artikel budaya, podcast sejarah (Historiccast), circle komunitas, dan aktivitas interaktif. Pengguna dapat menjelajahi, berkontribusi, dan belajar tentang keragaman budaya Indonesia. Didesain dengan nuansa budaya yang kuat dan navigasi intuitif.",
      // Kalimat terakhir adalah terjemahan baru; versi lama memotongnya.
      en: "Web platform interface design dedicated to preserving and sharing Indonesian cultural heritage. Features cultural articles, history podcasts (Historiccast), community circles, and interactive activities. Users can explore, contribute, and learn about Indonesia's cultural diversity. Designed with a strong cultural feel and intuitive navigation.",
    },
    features: {
      id: [
        "Artikel Budaya",
        "Podcast Historiccast",
        "Circle Komunitas",
        "Aktivitas Interaktif",
        "Pencarian & Eksplorasi",
      ],
      en: [
        "Cultural Articles",
        "Historiccast Podcast",
        "Community Circle",
        "Interactive Activities",
        "Search & Exploration",
      ],
    },
    technologies: ["Figma", "UI/UX Design", "Web Design", "Prototyping"],
    images: screenshots("nusantara", "Nusantara Legacy", [
      "landing.png",
      "about.png",
      "historiccast.png",
      "login.png",
    ]),
    steps: [
      {
        title: {
          id: "Riset Konten & Strategi",
          en: "Content Research & Strategy",
        },
        description: {
          id: "Melakukan riset mendalam tentang budaya Indonesia dan menyusun strategi konten meliputi artikel budaya, podcast sejarah, dan aktivitas interaktif.",
          en: "Conducting in-depth research on Indonesian culture and developing content strategy including cultural articles, history podcasts, and interactive activities.",
        },
      },
      {
        title: {
          id: "Arsitektur Informasi & Sitemap",
          en: "Information Architecture & Sitemap",
        },
        description: {
          id: "Merancang struktur informasi website termasuk sitemap, user flow, dan hierarki konten untuk navigasi yang intuitif.",
          en: "Designing website information structure including sitemap, user flow, and content hierarchy for intuitive navigation.",
        },
      },
      {
        title: { id: "Wireframing & Layout", en: "Wireframing & Layout" },
        description: {
          id: "Membuat wireframe untuk setiap halaman utama meliputi landing page, halaman artikel, podcast player, dan area komunitas.",
          en: "Creating wireframes for main pages including landing page, article page, podcast player, and community area.",
        },
      },
      {
        title: { id: "Desain Visual & UI", en: "Visual Design & UI" },
        description: {
          id: "Mendesain antarmuka high-fidelity dengan nuansa budaya Indonesia yang kaya, dilengkapi tipografi dan warna yang mencerminkan identitas Nusantara.",
          en: "Designing high-fidelity interface with rich Indonesian cultural nuances, complemented by typography and colors reflecting Nusantara identity.",
        },
      },
      {
        title: { id: "Prototyping & Validasi", en: "Prototyping & Validation" },
        description: {
          id: "Membangun prototype interaktif dan melakukan validasi desain dengan target pengguna untuk memastikan pengalaman yang optimal.",
          en: "Building interactive prototype and validating design with target users to ensure optimal experience.",
        },
      },
    ],
  },
  {
    slug: "paynow",
    title: "PayNow",
    category: "uiux",
    label: same("🎨 UI/UX Mobile"),
    color: "#3B3F8C",
    thumbnail: "/images/projects/paynow/thumbnail.jpg",
    tagline: {
      id: "Dompet Digital & Solusi Pembayaran",
      en: "Digital Wallet & Payment Solution",
    },
    description: {
      id: "Desain antarmuka aplikasi dompet digital modern yang memungkinkan transfer uang cepat dan aman, pembayaran tagihan, dan pelacakan keuangan. Dilengkapi fitur top-up, transfer internasional, ringkasan keuangan, reward voucher, dan autentikasi biometrik untuk keamanan lebih baik. Didesain dengan fokus pada kepercayaan dan kemudahan transaksi.",
      // Kalimat terakhir adalah terjemahan baru; versi lama memotongnya.
      en: "Modern digital wallet app interface design enabling fast and secure money transfers, bill payments, and financial tracking. Features top-up, international transfers, financial summaries, reward vouchers, and biometric authentication. Designed with a focus on trust and ease of transaction.",
    },
    features: {
      id: [
        "Dompet Digital",
        "Pembayaran Tagihan",
        "Pelacakan Keuangan",
        "Reward Voucher",
        "Autentikasi Biometrik",
      ],
      en: [
        "Digital Wallet",
        "Bill Payment",
        "Financial Tracking",
        "Reward Vouchers",
        "Biometric Authentication",
      ],
    },
    technologies: ["Figma", "UI/UX Design", "Mobile Design", "FinTech"],
    images: screenshots("paynow", "PayNow", [
      "login.jpg",
      "transfer.jpg",
      "activity.jpg",
      "rewards.jpg",
    ]),
    steps: [
      {
        title: {
          id: "Riset Pasar & Analisis Kompetitor",
          en: "Market Research & Competitor Analysis",
        },
        description: {
          id: "Menganalisis aplikasi fintech sejenis di pasar untuk memahami standar industri, fitur unggulan, dan peluang diferensiasi produk.",
          en: "Analyzing similar fintech apps to understand industry standards, key features, and product differentiation opportunities.",
        },
      },
      {
        title: { id: "Pemetaan User Flow", en: "User Flow Mapping" },
        description: {
          id: "Merancang user flow untuk proses transfer, top-up, pembayaran tagihan, dan reward system dengan fokus pada efisiensi dan keamanan transaksi.",
          en: "Designing user flows for transfer, top-up, bill payment, and reward system with focus on transaction efficiency and security.",
        },
      },
      {
        title: { id: "Design System UI", en: "UI Design System" },
        description: {
          id: "Membangun design system komprehensif di Figma meliputi komponen finansial, color coding untuk transaksi, dan iconography khusus fintech.",
          en: "Building comprehensive design system in Figma including financial components, transaction color coding, and fintech-specific iconography.",
        },
      },
      {
        title: { id: "Prototipe High-Fidelity", en: "High-Fidelity Prototype" },
        description: {
          id: "Membuat prototype high-fidelity dengan animasi transisi antar halaman, simulasi autentikasi biometrik, dan micro-interactions pada elemen finansial.",
          en: "Creating high-fidelity prototype with page transition animations, biometric authentication simulation, and micro-interactions on financial elements.",
        },
      },
      {
        title: {
          id: "Pengujian Usability & Iterasi",
          en: "Usability Testing & Iteration",
        },
        description: {
          id: "Melakukan usability testing fokus pada kepercayaan dan kemudahan penggunaan, lalu iterasi berdasarkan feedback pengguna.",
          en: "Conducting usability testing focused on trust and ease of use, then iterating based on user feedback.",
        },
      },
    ],
  },
  {
    slug: "warasa",
    title: "Warasa",
    category: "web",
    label: same("🌐 Web & Mobile App"),
    color: "#FF6B35",
    thumbnail: "/images/projects/warasa/thumbnail.png",
    tagline: {
      id: "Asisten E-Commerce Berbasis AI",
      en: "AI-Powered E-Commerce Assistant",
    },
    description: {
      id: "Platform web dan mobile berbasis AI yang dirancang untuk membantu seller Shopee mengoptimalkan bisnis online mereka. Dilengkapi fitur smart product generation, kalkulator ROAS, SEO scoring, analisis kompetitor, dan tools bulk export. Dipercaya oleh 10.000+ seller online untuk meningkatkan performa toko mereka.",
      // Akhir kalimat terakhir adalah terjemahan baru; versi lama memotongnya.
      en: "AI-powered web and mobile platform designed to help Shopee sellers optimize their online business. Features smart product generation, ROAS calculator, SEO scoring, competitor analysis, and bulk export tools. Trusted by 10,000+ online sellers to improve their store performance.",
    },
    features: {
      id: [
        "Generator Produk AI",
        "Kalkulator ROAS",
        "Optimasi SEO",
        "Analisis Kompetitor",
        "Ekspor Massal",
      ],
      en: [
        "AI Product Generator",
        "ROAS Calculator",
        "SEO Optimization",
        "Competitor Analysis",
        "Bulk Export",
      ],
    },
    technologies: ["Laravel", "Flutter", "AI/ML", "Shopee API", "JavaScript"],
    images: screenshots("warasa", "Warasa", [
      "features.png",
      "workflow.png",
      "tools.png",
      "testimonials.png",
    ]),
    steps: [
      {
        title: {
          id: "Riset Pasar & Kebutuhan Seller",
          en: "Market Research & Seller Needs",
        },
        description: {
          id: "Melakukan riset kebutuhan seller Shopee meliputi tantangan optimasi produk, analisis kompetitor, dan pengelolaan toko online yang efektif.",
          en: "Researching Shopee seller needs including product optimization challenges, competitor analysis, and effective online store management.",
        },
      },
      {
        title: {
          id: "Arsitektur Integrasi AI",
          en: "AI Integration Architecture",
        },
        description: {
          id: "Merancang arsitektur integrasi AI/ML untuk fitur smart product generation, SEO scoring, dan analisis kompetitor berbasis Shopee API.",
          en: "Designing AI/ML integration architecture for smart product generation, SEO scoring, and competitor analysis via Shopee API.",
        },
      },
      {
        title: {
          id: "Pengembangan Backend & API",
          en: "Backend & API Development",
        },
        description: {
          id: "Mengembangkan backend Laravel dengan integrasi Shopee API, implementasi algoritma AI untuk rekomendasi produk, dan kalkulator ROAS.",
          en: "Developing Laravel backend with Shopee API integration, AI algorithms for product recommendations, and ROAS calculator.",
        },
      },
      {
        title: {
          id: "Desain Dashboard & Mobile App",
          en: "Dashboard & Mobile App Design",
        },
        description: {
          id: "Membangun dashboard web dan aplikasi mobile Flutter yang intuitif dengan visualisasi data performa produk dan tools bulk export.",
          en: "Building intuitive web dashboard and Flutter mobile app with product performance data visualization and bulk export tools.",
        },
      },
      {
        title: {
          id: "Pengujian & Optimasi Performa",
          en: "Testing & Performance Optimization",
        },
        description: {
          id: "Melakukan testing end-to-end pada semua fitur, optimasi performa API, dan load testing untuk memastikan skalabilitas platform.",
          en: "End-to-end testing on all features, API performance optimization, and load testing to ensure platform scalability.",
        },
      },
    ],
  },
  {
    slug: "spr",
    title: "Emotion-Based Music Recommender",
    category: "data",
    label: same("📊 Data Analysis"),
    color: "#10B981",
    thumbnail: "/images/projects/spr/chart_1.png",
    tagline: {
      id: "Sistem Rekomendasi Musik Berbasis Emosi",
      en: "Emotion-Based Music Recommendation System",
    },
    description: {
      id: "Sistem rekomendasi musik berbasis AI yang dapat dijelaskan, menggunakan attention-based emotion preference learning. Sistem mendeteksi emosi pengguna dari input teks, menerapkan TF-IDF + Logistic Regression untuk klasifikasi sentimen, menggunakan analisis fitur berbobot attention, dan memberikan rekomendasi lagu berbasis konten dengan transparansi XAI (Explainable AI) penuh.",
      en: "An explainable AI-based music recommendation system using attention-based emotion preference learning. The system detects user emotions from text input, applies TF-IDF + Logistic Regression for sentiment classification, uses attention-weighted feature analysis, and provides content-based song recommendations with full XAI transparency.",
    },
    features: {
      id: [
        "Deteksi Emosi",
        "Pembobotan Berbasis Attention",
        "Content-Based Filtering",
        "Explainable AI (XAI)",
        "Klasifikasi Sentimen",
        "Evaluasi Top-K",
      ],
      en: [
        "Emotion Detection",
        "Attention-Based Weighting",
        "Content-Based Filtering",
        "Explainable AI (XAI)",
        "Sentiment Classification",
        "Top-K Evaluation",
      ],
    },
    technologies: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "Matplotlib",
      "TF-IDF",
      "Logistic Regression",
    ],
    images: screenshots("spr", "Emotion-Based Music Recommender", [
      "chart_1.png",
      "chart_2.png",
      "chart_3.png",
      "chart_4.png",
      "chart_5.png",
      "chart_6.png",
    ]),
    steps: [
      {
        title: { id: "Preprocessing Data", en: "Data Preprocessing" },
        description: {
          id: "Standarisasi kolom, menangani missing values, dan menyiapkan dataset sentimen musik untuk analisis.",
          en: "Standardizing columns, handling missing values, and preparing music sentiment dataset for analysis.",
        },
      },
      {
        title: {
          id: "Analisis Data Eksploratif",
          en: "Exploratory Data Analysis",
        },
        description: {
          id: "Memvisualisasikan distribusi sentimen, distribusi genre, proporsi mood, kategori tempo, dan korelasi sentimen-genre.",
          en: "Visualizing sentiment distribution, genre distribution, mood proportions, tempo categories, and sentiment-genre correlations.",
        },
      },
      {
        title: { id: "Deteksi Emosi", en: "Emotion Detection" },
        description: {
          id: "Menerapkan vektorisasi TF-IDF dan Logistic Regression untuk mengklasifikasikan input teks pengguna ke dalam kategori emosi (Happy, Sad, Motivated, Relaxed).",
          en: "Applying TF-IDF vectorization and Logistic Regression to classify user text input into emotion categories (Happy, Sad, Motivated, Relaxed).",
        },
      },
      {
        title: {
          id: "Attention-Based Preference Learning",
          en: "Attention-Based Preference Learning",
        },
        description: {
          id: "Menghitung bobot attention per fitur per sentimen — fitur dengan variansi lebih rendah (lebih konsisten) mendapatkan skor attention lebih tinggi.",
          en: "Computing attention weights per feature per sentiment — features with lower variance (more consistent) receive higher attention scores.",
        },
      },
      {
        title: { id: "Content-Based Filtering", en: "Content-Based Filtering" },
        description: {
          id: "Membangun cosine similarity berbobot menggunakan attention weights untuk menemukan lagu yang paling relevan dengan profil emosi yang terdeteksi.",
          en: "Building weighted cosine similarity using attention weights to find songs most relevant to the detected emotion profile.",
        },
      },
      {
        title: {
          id: "Explainable AI & Visualisasi",
          en: "Explainable AI & Visualization",
        },
        description: {
          id: "Menghasilkan breakdown kontribusi fitur per lagu, analisis kata attention, dan heatmap XAI yang menjelaskan mengapa setiap lagu direkomendasikan.",
          en: "Generating per-song feature contribution breakdowns, attention word analysis, and XAI heatmaps explaining why each song is recommended.",
        },
      },
      {
        title: { id: "Evaluasi", en: "Evaluation" },
        description: {
          id: "Mengevaluasi performa sistem menggunakan metrik Precision@K, Recall@K, Hit Rate, MAP, dan NDCG pada K=3, K=5, dan K=7.",
          en: "Evaluating system performance using Precision@K, Recall@K, Hit Rate, MAP, and NDCG metrics at K=3, K=5, and K=7.",
        },
      },
    ],
  },
  {
    slug: "pixora",
    title: "Pixora",
    category: "web",
    label: same("🌐 Web & Mobile App"),
    color: "#E11D48",
    thumbnail: "/images/projects/pixora/thumbnail.png",
    tagline: {
      id: "Platform Booking Studio Fotografi",
      en: "Photography Studio Booking Platform",
    },
    description: {
      id: "Platform booking studio fotografi full-stack yang menghubungkan pelanggan dengan layanan fotografi profesional. Versi web dibangun dengan Laravel menyediakan landing page, katalog paket, kalender booking interaktif, pembayaran online via Midtrans (VA, E-Wallet, QRIS), invoice digital, admin dashboard, serta integrasi AI assistant. Versi mobile dibangun dengan Flutter menghadirkan pengalaman booking yang seamless dengan fitur browse paket, kalender ketersediaan, pembayaran dalam aplikasi, chatbot AI, Google Sign-In, dan manajemen profil lengkap dengan riwayat booking.",
      // Bagian akhir kalimat terakhir adalah terjemahan baru; versi lama memotongnya.
      en: "Full-stack photography studio booking platform connecting customers with professional photography services. Web version built with Laravel provides landing page, package catalog, interactive booking calendar, online payment via Midtrans (VA, E-Wallet, QRIS), digital invoices, admin dashboard, and AI assistant integration. Mobile version built with Flutter delivers a seamless booking experience with package browsing, an availability calendar, in-app payments, an AI chatbot, Google Sign-In, and full profile management with booking history.",
    },
    features: {
      id: [
        "Booking Online",
        "Pembayaran Midtrans",
        "AI Assistant",
        "Kalender Interaktif",
        "Admin Dashboard",
        "Mobile App Flutter",
      ],
      en: [
        "Online Booking",
        "Midtrans Payment",
        "AI Assistant",
        "Interactive Calendar",
        "Admin Dashboard",
        "Flutter Mobile App",
      ],
    },
    technologies: [
      "Laravel",
      "Flutter",
      "MySQL",
      "Midtrans",
      "AI Integration",
      "Google Auth",
    ],
    images: screenshots("pixora", "Pixora", [
      "landing.png",
      "packages.png",
      "booking.png",
      "mobile.png",
    ]),
    steps: [
      {
        title: {
          id: "Analisis Kebutuhan & Perancangan",
          en: "Requirements Analysis & Design",
        },
        description: {
          id: "Menganalisis kebutuhan platform booking studio fotografi, merancang database relasional (users, packages, bookings, payments), serta menyusun arsitektur integrasi web dan mobile.",
          en: "Analyzing photography studio booking platform needs, designing relational database (users, packages, bookings, payments), and planning web-mobile integration architecture.",
        },
      },
      {
        title: {
          id: "Pengembangan Backend Laravel",
          en: "Laravel Backend Development",
        },
        description: {
          id: "Membangun backend Laravel dengan autentikasi multi-role (admin/customer), CRUD paket fotografi, sistem booking dengan validasi ketersediaan jadwal, dan REST API untuk aplikasi mobile.",
          en: "Building Laravel backend with multi-role authentication (admin/customer), photography package CRUD, booking system with schedule validation, and REST API for mobile app.",
        },
      },
      {
        title: {
          id: "Integrasi Payment Gateway",
          en: "Payment Gateway Integration",
        },
        description: {
          id: "Mengintegrasikan Midtrans Snap untuk pembayaran online mendukung Virtual Account, E-Wallet, dan QRIS, lengkap dengan webhook notification dan invoice PDF otomatis.",
          en: "Integrating Midtrans Snap for online payments supporting Virtual Account, E-Wallet, and QRIS, with webhook notifications and automatic PDF invoices.",
        },
      },
      {
        title: {
          id: "Pengembangan Mobile App Flutter",
          en: "Flutter Mobile App Development",
        },
        description: {
          id: "Membangun aplikasi mobile menggunakan Flutter dengan Provider state management, fitur browse paket, kalender booking, pembayaran via WebView, chatbot AI, dan Google Sign-In.",
          en: "Building mobile app using Flutter with Provider state management, package browsing, booking calendar, WebView payments, AI chatbot, and Google Sign-In.",
        },
      },
      {
        title: { id: "Integrasi AI & Testing", en: "AI Integration & Testing" },
        description: {
          id: "Mengintegrasikan AI assistant untuk FAQ dan bantuan booking, melakukan pengujian end-to-end pada alur booking dan pembayaran di web maupun mobile, serta optimasi performa.",
          en: "Integrating AI assistant for FAQ and booking help, end-to-end testing on booking and payment flows for web and mobile, and performance optimization.",
        },
      },
    ],
  },
  {
    slug: "qa-cazh",
    title: "Quality Assurance — PT Cazh",
    category: "qa",
    label: same("🔍 Quality Assurance"),
    color: "#0EA5E9",
    thumbnail: "/images/projects/qa-cazh/thumbnail.png",
    tagline: {
      id: "Pengujian Kualitas Produk Digital",
      en: "Digital Product Quality Testing",
    },
    description: {
      id: "Proyek magang sebagai Quality Assurance di PT Cazh Purwokerto (Juli — Agustus 2026). Bertanggung jawab melakukan pengujian fungsional dan non-fungsional pada produk digital perusahaan, menyusun test case dan test scenario, melaporkan bug melalui bug tracking system, serta memastikan kualitas produk sebelum rilis ke production environment.",
      en: "Internship project as Quality Assurance at PT Cazh Purwokerto (July — August 2026). Responsible for conducting functional and non-functional testing on digital products, preparing test cases and test scenarios, reporting bugs through bug tracking system, and ensuring product quality before release to production.",
    },
    features: {
      id: [
        "Pengujian Fungsional",
        "Penyusunan Test Case",
        "Pelaporan Bug",
        "Regression Testing",
        "Validasi UI/UX",
      ],
      en: [
        "Functional Testing",
        "Test Case Design",
        "Bug Reporting",
        "Regression Testing",
        "UI/UX Validation",
      ],
    },
    technologies: [
      "Manual Testing",
      "Test Case",
      "Bug Tracking",
      "Functional Testing",
      "Regression Testing",
    ],
    images: screenshots("qa-cazh", "Quality Assurance — PT Cazh", [
      "landing.png",
      "login.png",
      "check_card.png",
      "uat_document.png",
    ]),
    steps: [
      {
        title: {
          id: "Analisis Requirements & Dokumen",
          en: "Requirements Analysis & Documentation",
        },
        description: {
          id: "Mempelajari dokumen spesifikasi produk, user story, dan acceptance criteria untuk memahami fitur yang akan diuji.",
          en: "Studying product specification documents, user stories, and acceptance criteria to understand features to be tested.",
        },
      },
      {
        title: {
          id: "Penyusunan Test Case & Test Scenario",
          en: "Test Case & Test Scenario Design",
        },
        description: {
          id: "Merancang test case dan test scenario yang komprehensif mencakup positive testing, negative testing, dan edge case untuk setiap fitur.",
          en: "Designing comprehensive test cases and test scenarios covering positive testing, negative testing, and edge cases for each feature.",
        },
      },
      {
        title: {
          id: "Eksekusi Pengujian Fungsional",
          en: "Functional Testing Execution",
        },
        description: {
          id: "Menjalankan pengujian fungsional secara manual pada setiap modul produk digital, memverifikasi kesesuaian dengan spesifikasi yang telah ditentukan.",
          en: "Executing manual functional testing on each digital product module, verifying compliance with defined specifications.",
        },
      },
      {
        title: {
          id: "Pelaporan Bug & Tracking",
          en: "Bug Reporting & Tracking",
        },
        description: {
          id: "Mendokumentasikan dan melaporkan bug yang ditemukan melalui bug tracking system dengan detail steps to reproduce, severity, dan priority.",
          en: "Documenting and reporting found bugs through bug tracking system with detailed steps to reproduce, severity, and priority.",
        },
      },
      {
        title: {
          id: "Regression Testing & Validasi",
          en: "Regression Testing & Validation",
        },
        description: {
          id: "Melakukan regression testing setelah perbaikan bug untuk memastikan tidak ada fitur lain yang terdampak, serta validasi akhir sebelum rilis ke production.",
          en: "Performing regression testing after bug fixes to ensure no other features are affected, and final validation before production release.",
        },
      },
    ],
  },
];

// Nama kategori versi Indonesia adalah terjemahan baru; versi lama hanya berbahasa Inggris.
export const skills: { category: Localized; icon: string; items: string[] }[] =
  [
    {
      category: { id: "Desain UI/UX", en: "UI/UX Design" },
      icon: "palette",
      items: [
        "Figma",
        "Adobe XD",
        "Prototyping",
        "Wireframing",
        "User Research",
        "Design System",
      ],
    },
    {
      category: { id: "Pengembangan Web", en: "Web Development" },
      icon: "code",
      items: ["Laravel", "PHP", "JavaScript", "HTML/CSS", "MySQL", "REST API"],
    },
    {
      category: { id: "Pengembangan Mobile", en: "Mobile Development" },
      icon: "smartphone",
      items: [
        "Flutter",
        "Dart",
        "Firebase",
        "Mobile UI",
        "State Management",
        "API Integration",
      ],
    },
    {
      category: { id: "Analisis Data", en: "Data Analysis" },
      icon: "chart",
      items: [
        "Python",
        "Pandas",
        "Matplotlib",
        "Scikit-learn",
        "TF-IDF",
        "Machine Learning",
      ],
    },
    {
      category: same("Quality Assurance"),
      icon: "shield",
      items: [
        "Manual Testing",
        "Test Case Design",
        "Bug Reporting",
        "Functional Testing",
        "Regression Testing",
        "Bug Tracking",
      ],
    },
  ];

// Judul, tempat, dan periode versi Indonesia untuk entri 2–4 adalah terjemahan baru;
// versi lama hanya menulisnya dalam bahasa Inggris.
export const experiences: {
  title: Localized;
  place: Localized;
  period: Localized;
  description: Localized;
}[] = [
  {
    title: { id: "Magang Quality Assurance", en: "Quality Assurance Intern" },
    place: same("PT Cazh Purwokerto"),
    period: { id: "Jul — Agu 2026", en: "Jul — Aug 2026" },
    description: {
      id: "Melakukan pengujian fungsional dan non-fungsional pada produk digital perusahaan, menyusun test case, melaporkan bug melalui bug tracking system, serta memastikan kualitas produk sebelum rilis ke production.",
      en: "Conducted functional and non-functional testing on the company's digital products, prepared test cases, reported bugs through bug tracking system, and ensured product quality before release to production.",
    },
  },
  {
    title: {
      id: "Desainer & Pengembang UI/UX",
      en: "UI/UX Designer & Developer",
    },
    place: {
      id: "Proyek Freelance & Akademik",
      en: "Freelance & Academic Projects",
    },
    period: { id: "2024 — Sekarang", en: "2024 — Present" },
    description: {
      id: "Merancang dan mengembangkan antarmuka pengguna untuk aplikasi web dan mobile, mulai dari wireframing, prototyping di Figma, hingga implementasi frontend dengan fokus pada user experience yang intuitif.",
      en: "Designed and developed user interfaces for web and mobile applications, from wireframing, prototyping in Figma, to frontend implementation with a focus on intuitive user experience.",
    },
  },
  {
    title: { id: "Mahasiswa Informatika", en: "Informatics Student" },
    place: same("Telkom University Purwokerto"),
    period: { id: "2023 — Sekarang", en: "2023 — Present" },
    description: {
      id: "Menempuh pendidikan S1 Informatika dengan fokus pada pengembangan perangkat lunak, basis data, algoritma, serta proyek-proyek akademik di bidang web, mobile, dan data analysis.",
      en: "Pursuing a Bachelor's degree in Informatics with a focus on software development, databases, algorithms, and academic projects in web, mobile, and data analysis.",
    },
  },
  {
    title: { id: "Pembelajar Pengembangan Web", en: "Web Development Learner" },
    place: { id: "Otodidak & Bootcamp", en: "Self-taught & Bootcamps" },
    period: same("2023 — 2024"),
    description: {
      id: "Mempelajari fundamental web development secara otodidak dan melalui bootcamp online, meliputi HTML, CSS, JavaScript, PHP, Laravel, serta konsep REST API dan database management.",
      en: "Learned fundamental web development through self-study and online bootcamps, including HTML, CSS, JavaScript, PHP, Laravel, as well as REST API and database management concepts.",
    },
  },
];

export const education: {
  institution: string;
  degree: Localized;
  period: Localized;
  icon: string;
}[] = [
  {
    institution: "Telkom University Purwokerto",
    degree: { id: "S1 Teknik Informatika", en: "B.Sc. in Informatics" },
    period: { id: "2023 — Sekarang", en: "2023 — Present" },
    icon: "university",
  },
  {
    institution: "SMA Negeri 2 Pati",
    degree: { id: "Jurusan IPA", en: "Science Major" },
    period: same("2020 — 2023"),
    icon: "school",
  },
];

// Koreksi: versi lama menerjemahkan "Penyisihan Nasional" sebagai "National Finalist",
// padahal artinya babak penyisihan.
const gemastikPreliminary = (year: number): Localized => ({
  id: `Penyisihan Nasional GEMASTIK ${year}`,
  en: `National Preliminary Round (Penyisihan) GEMASTIK ${year}`,
});

export const achievements: {
  title: Localized;
  detail: Localized;
  icon: string;
}[] = [
  {
    title: gemastikPreliminary(2025),
    detail: same("UI/UX Design (Leader)"),
    icon: "🏆",
  },
  {
    title: gemastikPreliminary(2025),
    detail: {
      id: "Karya Tulis Ilmiah (Anggota)",
      en: "Scientific Paper (Member)",
    },
    icon: "🏆",
  },
  {
    title: gemastikPreliminary(2024),
    detail: same("Data Mining (Leader)"),
    icon: "🏆",
  },
  {
    title: {
      id: "Posisi 7 Lomba Nasional UI/UX Design",
      en: "7th Place National UI/UX Design",
    },
    detail: same("ITASE 6.0"),
    icon: "🥇",
  },
  {
    title: {
      id: "Juara 2 Lomba Mobile Legend Internal",
      en: "2nd Place Internal Mobile Legend Tournament",
    },
    detail: same("SMA Negeri 2 Pati"),
    icon: "🥈",
  },
];

export const organizations: {
  role: Localized;
  organization: string;
  period: Localized;
  description: Localized;
}[] = [
  {
    role: { id: "Coach Mobile Legend", en: "Mobile Legend Coach" },
    organization: "Tel U Purwokerto Esport",
    period: { id: "Des 2025 — Des 2026", en: "Dec 2025 — Dec 2026" },
    description: {
      id: "Melatih strategi tim, koordinasi gameplay, dan komunikasi dalam tim kompetitif.",
      en: "Coached team strategy, gameplay coordination, and communication in competitive teams.",
    },
  },
  {
    role: { id: "Member — Divisi AI", en: "Member — AI Division" },
    organization: "SIRCLE",
    period: { id: "Okt 2023 — Jul 2025", en: "Oct 2023 — Jul 2025" },
    description: {
      id: "Mempelajari preprocessing data, EDA, dan dasar machine learning.",
      en: "Learned data preprocessing, EDA, and machine learning fundamentals.",
    },
  },
  {
    role: same("Member"),
    organization: "SRE ITTP",
    period: same("Feb 2024 — Jul 2025"),
    description: {
      id: "Belajar tentang Energi Terbarukan. Panitia Career Talk (12 Okt 2024).",
      en: "Learned about Renewable Energy. Career Talk Committee (Oct 12, 2024).",
    },
  },
  {
    role: same("Talent"),
    organization: "Tim Otak Kanan",
    period: { id: "Okt 2023 — Sep 2024", en: "Oct 2023 — Sep 2024" },
    description: {
      id: "Menyusun naskah konten promosi kampus. Talent video branding institusi.",
      en: "Wrote scripts for campus promotional content. Talent for institution branding videos.",
    },
  },
];
