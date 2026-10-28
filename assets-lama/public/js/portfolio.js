document.addEventListener('DOMContentLoaded', () => {

  // ── Translation Dictionary ──
  const translations = {
    en: {
      nav_cta: "Let's Talk",
      hero_greeting: "Hello, I'm",
      hero_desc: "A passionate tech student at Telkom University Purwokerto crafting meaningful digital experiences through UI/UX design, frontend development, data analysis, and quality assurance.",
      hero_btn_projects: "View Projects",
      hero_btn_contact: "Get in Touch",
      stat_projects: "Featured Projects",
      stat_skills: "Skills",
      stat_years: "Years Exp",
      about_label: "About Me",
      about_title_1: "Turning Ideas Into",
      about_title_2: "Digital Reality",
      about_p1: 'I\'m a multi-disciplinary tech student with a strong passion for creating intuitive user interfaces and building robust web & mobile applications. Currently pursuing my degree at <strong>Telkom University Purwokerto</strong>.',
      about_p2: 'My journey spans across UI/UX design, frontend mobile & web development, data analysis, and quality assurance. I believe in creating digital products that not only look beautiful but also solve real problems and deliver exceptional user experiences.',
      exp_title_1: "Quality Assurance Intern",
      exp_desc_1: "Conducted functional and non-functional testing on the company's digital products, prepared test cases, reported bugs through bug tracking system, and ensured product quality before release to production.",
      exp_desc_2: "Designed and developed user interfaces for web and mobile applications, from wireframing, prototyping in Figma, to frontend implementation with a focus on intuitive user experience.",
      exp_desc_3: "Pursuing a Bachelor's degree in Informatics with a focus on software development, databases, algorithms, and academic projects in web, mobile, and data analysis.",
      exp_desc_4: "Learned fundamental web development through self-study and online bootcamps, including HTML, CSS, JavaScript, PHP, Laravel, as well as REST API and database management concepts.",
      bg_label: "Background",
      bg_title_1: "Education, Achievements &",
      bg_title_2: "Organizations",
      bg_subtitle: "Academic journey, accomplishments, and organizational involvement that shaped my competencies.",
      bg_edu_title: "Education",
      bg_ach_title: "Achievements",
      bg_org_title: "Organizations",
      skills_label: "What I Do",
      skills_title_1: "My ",
      skills_title_2: "Expertise",
      skills_subtitle: "Combining creativity with technical skills to build products that make a difference.",
      projects_label: "Portfolio",
      projects_title_1: "Featured ",
      projects_title_2: "Projects",
      projects_subtitle: "A selection of projects that showcase my skills across design and development.",
      filter_all: "All Projects",
      view_details: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> View Details',
      contact_label: "Get in Touch",
      contact_title_1: "Let's Work ",
      contact_title_2: "Together",
      contact_subtitle: "Have a project in mind? I'd love to hear about it.",
      contact_info_title: "Contact Information",
      contact_info_desc: "Feel free to reach out through any of the platforms below. I'm always open to discussing new projects and opportunities.",
      form_name: "Your Name",
      form_email: "Email Address",
      form_message: "Message",
      form_submit: "Send Message",
      footer_text: "Crafted with passion.",
      modal_steps_title: "Development Steps",
      modal_features_title: "Key Features",
      modal_tech_title: "Tech Stack",
      edu_year_0: "2023 — Present",
      edu_inst_0: "Telkom University Purwokerto",
      edu_deg_0: "B.Sc. in Informatics",
      edu_year_1: "2020 — 2023",
      edu_inst_1: "SMA Negeri 2 Pati",
      edu_deg_1: "Science Major",
      ach_title_0: "National Finalist GEMASTIK 2025",
      ach_det_0: "UI/UX Design (Leader)",
      ach_title_1: "National Finalist GEMASTIK 2025",
      ach_det_1: "Scientific Paper (Member)",
      ach_title_2: "National Finalist GEMASTIK 2024",
      ach_det_2: "Data Mining (Leader)",
      ach_title_3: "7th Place National UI/UX Design",
      ach_det_3: "ITASE 6.0",
      ach_title_4: "2nd Place Internal Mobile Legend Tournament",
      ach_det_4: "SMA Negeri 2 Pati",
      org_year_0: "Dec 2025 — Dec 2026",
      org_role_0: "Mobile Legend Coach",
      org_name_0: "Tel U Purwokerto Esport",
      org_desc_0: "Coached team strategy, gameplay coordination, and communication in competitive teams.",
      org_year_1: "Oct 2023 — Jul 2025",
      org_role_1: "Member — AI Division",
      org_name_1: "SIRCLE",
      org_desc_1: "Learned data preprocessing, EDA, and machine learning fundamentals.",
      org_year_2: "Feb 2024 — Jul 2025",
      org_role_2: "Member",
      org_name_2: "SRE ITTP",
      org_desc_2: "Learned about Renewable Energy. Career Talk Committee (Oct 12, 2024).",
      org_year_3: "Oct 2023 — Sep 2024",
      org_role_3: "Talent",
      org_name_3: "Tim Otak Kanan",
      org_desc_3: "Wrote scripts for campus promotional content. Talent for institution branding videos.",
    },
    id: {
      nav_cta: "Hubungi Saya",
      hero_greeting: "Halo, Saya",
      hero_desc: "Mahasiswa teknologi yang bersemangat di Telkom University Purwokerto, menciptakan pengalaman digital bermakna melalui desain UI/UX, pengembangan frontend, analisis data, dan quality assurance.",
      hero_btn_projects: "Lihat Proyek",
      hero_btn_contact: "Hubungi Saya",
      stat_projects: "Proyek Unggulan",
      stat_skills: "Keahlian",
      stat_years: "Tahun Pengalaman",
      about_label: "Tentang Saya",
      about_title_1: "Mengubah Ide Menjadi",
      about_title_2: "Realitas Digital",
      about_p1: 'Saya adalah mahasiswa teknologi multidisiplin dengan semangat tinggi dalam menciptakan antarmuka pengguna yang intuitif dan membangun aplikasi web & mobile yang tangguh. Saat ini menempuh pendidikan di <strong>Telkom University Purwokerto</strong>.',
      about_p2: 'Perjalanan saya mencakup desain UI/UX, pengembangan frontend mobile & web, analisis data, dan quality assurance. Saya percaya dalam menciptakan produk digital yang tidak hanya terlihat indah tetapi juga memecahkan masalah nyata dan memberikan pengalaman pengguna yang luar biasa.',
      exp_title_1: "Magang Quality Assurance",
      exp_desc_1: "Melakukan pengujian fungsional dan non-fungsional pada produk digital perusahaan, menyusun test case, melaporkan bug melalui bug tracking system, serta memastikan kualitas produk sebelum rilis ke production.",
      exp_desc_2: "Merancang dan mengembangkan antarmuka pengguna untuk aplikasi web dan mobile, mulai dari wireframing, prototyping di Figma, hingga implementasi frontend dengan fokus pada user experience yang intuitif.",
      exp_desc_3: "Menempuh pendidikan S1 Informatika dengan fokus pada pengembangan perangkat lunak, basis data, algoritma, serta proyek-proyek akademik di bidang web, mobile, dan data analysis.",
      exp_desc_4: "Mempelajari fundamental web development secara otodidak dan melalui bootcamp online, meliputi HTML, CSS, JavaScript, PHP, Laravel, serta konsep REST API dan database management.",
      bg_label: "Latar Belakang",
      bg_title_1: "Pendidikan, Prestasi &",
      bg_title_2: "Organisasi",
      bg_subtitle: "Perjalanan akademik, pencapaian, dan keterlibatan organisasi yang membentuk kompetensi saya.",
      bg_edu_title: "Pendidikan",
      bg_ach_title: "Prestasi",
      bg_org_title: "Organisasi",
      skills_label: "Yang Saya Kerjakan",
      skills_title_1: "Keahlian ",
      skills_title_2: "Saya",
      skills_subtitle: "Menggabungkan kreativitas dengan keterampilan teknis untuk membangun produk yang berdampak.",
      projects_label: "Portofolio",
      projects_title_1: "Proyek ",
      projects_title_2: "Unggulan",
      projects_subtitle: "Kumpulan proyek yang menampilkan keahlian saya dalam desain dan pengembangan.",
      filter_all: "Semua Proyek",
      view_details: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> Lihat Detail',
      contact_label: "Hubungi",
      contact_title_1: "Mari Bekerja ",
      contact_title_2: "Bersama",
      contact_subtitle: "Punya proyek dalam pikiran? Saya ingin mendengarnya.",
      contact_info_title: "Informasi Kontak",
      contact_info_desc: "Jangan ragu untuk menghubungi melalui platform di bawah ini. Saya selalu terbuka untuk membahas proyek dan peluang baru.",
      form_name: "Nama Anda",
      form_email: "Alamat Email",
      form_message: "Pesan",
      form_submit: "Kirim Pesan",
      footer_text: "Dibuat dengan sepenuh hati.",
      modal_steps_title: "Langkah Pengembangan",
      modal_features_title: "Fitur Utama",
      modal_tech_title: "Teknologi",
      edu_year_0: "2023 — Sekarang",
      edu_inst_0: "Telkom University Purwokerto",
      edu_deg_0: "S1 Teknik Informatika",
      edu_year_1: "2020 — 2023",
      edu_inst_1: "SMA Negeri 2 Pati",
      edu_deg_1: "Jurusan IPA",
      ach_title_0: "Penyisihan Nasional GEMASTIK 2025",
      ach_det_0: "UI/UX Design (Leader)",
      ach_title_1: "Penyisihan Nasional GEMASTIK 2025",
      ach_det_1: "Karya Tulis Ilmiah (Anggota)",
      ach_title_2: "Penyisihan Nasional GEMASTIK 2024",
      ach_det_2: "Data Mining (Leader)",
      ach_title_3: "Posisi 7 Lomba Nasional UI/UX Design",
      ach_det_3: "ITASE 6.0",
      ach_title_4: "Juara 2 Lomba Mobile Legend Internal",
      ach_det_4: "SMA Negeri 2 Pati",
      org_year_0: "Des 2025 — Des 2026",
      org_role_0: "Coach Mobile Legend",
      org_name_0: "Tel U Purwokerto Esport",
      org_desc_0: "Melatih strategi tim, koordinasi gameplay, dan komunikasi dalam tim kompetitif.",
      org_year_1: "Okt 2023 — Jul 2025",
      org_role_1: "Member — Divisi AI",
      org_name_1: "SIRCLE",
      org_desc_1: "Mempelajari preprocessing data, EDA, dan dasar machine learning.",
      org_year_2: "Feb 2024 — Jul 2025",
      org_role_2: "Member",
      org_name_2: "SRE ITTP",
      org_desc_2: "Belajar tentang Energi Terbarukan. Panitia Career Talk (12 Okt 2024).",
      org_year_3: "Okt 2023 — Sep 2024",
      org_role_3: "Talent",
      org_name_3: "Tim Otak Kanan",
      org_desc_3: "Menyusun naskah konten promosi kampus. Talent video branding institusi.",
    }
  };

  const typedTexts = {
    en: ['UI/UX Designer', 'Frontend Developer', 'Mobile Developer', 'Data Analyst', 'Quality Assurance'],
    id: ['Desainer UI/UX', 'Pengembang Frontend', 'Pengembang Mobile', 'Analis Data', 'Quality Assurance']
  };

  const projectTranslations = {
    borrowit: {
      en: { tagline:'Campus Item Lending Platform', label:'🎨 UI/UX Mobile', description:'Mobile app interface design to facilitate item lending among campus students. Features KTM verification for security, real-time chat, rating system, and location-based search. Designed with a modern, clean look prioritizing ease of use.', features:['KTM Verification','Item Categories','Real-time Chat','Rating System','Location-based Search'], steps:[{title:'User Research & Problem Identification',desc:'Researching students to understand item lending issues on campus, including needs surveys and pain point analysis.'},{title:'Information Architecture',desc:'Structuring the app including sitemap, lending/return user flows, and navigation hierarchy.'},{title:'Wireframing & Early Prototype',desc:'Creating wireframes for main pages: home, search, item detail, and activity tracking.'},{title:'UI Design & Design System',desc:'Designing high-fidelity interfaces in Figma with consistent design system including color palette, typography, and reusable components.'},{title:'Prototyping & User Testing',desc:'Building interactive prototype and conducting usability testing with target users for validation and UI/UX improvements.'}] },
    },
    ekost: {
      en: { tagline:'Boarding House Management System', label:'🌐 Web App', description:'Comprehensive boarding house management web platform. Allows owners to manage tenants, track payments, and handle complaints digitally. Tenants can search properties, make payments, and communicate with owners seamlessly. Built with Laravel with full features for both user roles.', features:['Owner Dashboard','Tenant Portal','Payment Tracking','Property Listings','Testimonial System'], steps:[{title:'Requirements Analysis',desc:'Analyzing boarding house management needs from owner and tenant perspectives, including payment, complaints, and property search features.'},{title:'Database Design',desc:'Designing relational database schema with users, properties, rooms, payments, complaints, and testimonials tables.'},{title:'Backend Development',desc:'Developing backend using Laravel with multi-role authentication (owner/tenant), property CRUD, and digital payment system.'},{title:'Frontend Implementation',desc:'Building responsive interface with Bootstrap and JavaScript for owner dashboard, tenant portal, and property search.'},{title:'Testing & Deployment',desc:'Functional testing on every module, bug fixes, and deployment to production server.'}] },
    },
    melodean: {
      en: { tagline:'Interactive E-Learning for Students', label:'🎨 UI/UX Mobile', description:'Attractive mobile e-learning interface design for high school students. Features gamification elements including points, badges, and leaderboard to motivate learning. Includes schedule management, subject-based learning modules, and QR-based attendance scanning.', features:['Gamification System','Learning Modules','QR Attendance','Leaderboard','Badge Collection'], steps:[{title:'User Research & Persona',desc:'Researching high school students to understand learning motivation and e-learning app preferences, then creating user personas.'},{title:'Gamification Strategy',desc:'Designing gamification system including points, badges, and leaderboard to increase student engagement and motivation.'},{title:'UI/UX Design',desc:'Designing attractive and user-friendly interfaces in Figma with a playful yet functional approach for educational context.'},{title:'Interactive Prototyping',desc:'Building interactive prototype with micro-interactions, transition animations, and QR scanning simulation.'},{title:'Usability Testing & Iteration',desc:'Conducting usability testing with students and teachers, collecting feedback, and iterating designs based on findings.'}] },
    },
    nusantara: {
      en: { tagline:'Indonesian Cultural Heritage Platform', label:'🎨 UI/UX Web', description:'Web platform interface design dedicated to preserving and sharing Indonesian cultural heritage. Features cultural articles, history podcasts (Historiccast), community circles, and interactive activities. Users can explore, contribute, and learn about Indonesia\'s cultural diversity.', features:['Cultural Articles','Historiccast Podcast','Community Circle','Interactive Activities','Search & Exploration'], steps:[{title:'Content Research & Strategy',desc:'Conducting in-depth research on Indonesian culture and developing content strategy including cultural articles, history podcasts, and interactive activities.'},{title:'Information Architecture & Sitemap',desc:'Designing website information structure including sitemap, user flow, and content hierarchy for intuitive navigation.'},{title:'Wireframing & Layout',desc:'Creating wireframes for main pages including landing page, article page, podcast player, and community area.'},{title:'Visual Design & UI',desc:'Designing high-fidelity interface with rich Indonesian cultural nuances, complemented by typography and colors reflecting Nusantara identity.'},{title:'Prototyping & Validation',desc:'Building interactive prototype and validating design with target users to ensure optimal experience.'}] },
    },
    paynow: {
      en: { tagline:'Digital Wallet & Payment Solution', label:'🎨 UI/UX Mobile', description:'Modern digital wallet app interface design enabling fast and secure money transfers, bill payments, and financial tracking. Features top-up, international transfers, financial summaries, reward vouchers, and biometric authentication.', features:['Digital Wallet','Bill Payment','Financial Tracking','Reward Vouchers','Biometric Authentication'], steps:[{title:'Market Research & Competitor Analysis',desc:'Analyzing similar fintech apps to understand industry standards, key features, and product differentiation opportunities.'},{title:'User Flow Mapping',desc:'Designing user flows for transfer, top-up, bill payment, and reward system with focus on transaction efficiency and security.'},{title:'UI Design System',desc:'Building comprehensive design system in Figma including financial components, transaction color coding, and fintech-specific iconography.'},{title:'High-Fidelity Prototype',desc:'Creating high-fidelity prototype with page transition animations, biometric authentication simulation, and micro-interactions on financial elements.'},{title:'Usability Testing & Iteration',desc:'Conducting usability testing focused on trust and ease of use, then iterating based on user feedback.'}] },
    },
    warasa: {
      en: { tagline:'AI-Powered E-Commerce Assistant', label:'🌐 Web & Mobile App', description:'AI-powered web and mobile platform designed to help Shopee sellers optimize their online business. Features smart product generation, ROAS calculator, SEO scoring, competitor analysis, and bulk export tools. Trusted by 10,000+ online sellers.', features:['AI Product Generator','ROAS Calculator','SEO Optimization','Competitor Analysis','Bulk Export'], steps:[{title:'Market Research & Seller Needs',desc:'Researching Shopee seller needs including product optimization challenges, competitor analysis, and effective online store management.'},{title:'AI Integration Architecture',desc:'Designing AI/ML integration architecture for smart product generation, SEO scoring, and competitor analysis via Shopee API.'},{title:'Backend & API Development',desc:'Developing Laravel backend with Shopee API integration, AI algorithms for product recommendations, and ROAS calculator.'},{title:'Dashboard & Mobile App Design',desc:'Building intuitive web dashboard and Flutter mobile app with product performance data visualization and bulk export tools.'},{title:'Testing & Performance Optimization',desc:'End-to-end testing on all features, API performance optimization, and load testing to ensure platform scalability.'}] },
    },
    spr: {
      en: { tagline:'Emotion-Based Music Recommendation System', label:'📊 Data Analysis', description:'An explainable AI-based music recommendation system using attention-based emotion preference learning. The system detects user emotions from text input, applies TF-IDF + Logistic Regression for sentiment classification, uses attention-weighted feature analysis, and provides content-based song recommendations with full XAI transparency.', features:['Emotion Detection','Attention-Based Weighting','Content-Based Filtering','Explainable AI (XAI)','Sentiment Classification','Top-K Evaluation'], steps:[{title:'Data Preprocessing',desc:'Standardizing columns, handling missing values, and preparing music sentiment dataset for analysis.'},{title:'Exploratory Data Analysis',desc:'Visualizing sentiment distribution, genre distribution, mood proportions, tempo categories, and sentiment-genre correlations.'},{title:'Emotion Detection',desc:'Applying TF-IDF vectorization and Logistic Regression to classify user text input into emotion categories (Happy, Sad, Motivated, Relaxed).'},{title:'Attention-Based Preference Learning',desc:'Computing attention weights per feature per sentiment — features with lower variance (more consistent) receive higher attention scores.'},{title:'Content-Based Filtering',desc:'Building weighted cosine similarity using attention weights to find songs most relevant to the detected emotion profile.'},{title:'Explainable AI & Visualization',desc:'Generating per-song feature contribution breakdowns, attention word analysis, and XAI heatmaps explaining why each song is recommended.'},{title:'Evaluation',desc:'Evaluating system performance using Precision@K, Recall@K, Hit Rate, MAP, and NDCG metrics at K=3, K=5, and K=7.'}] },
    },
    pixora: {
      en: { tagline:'Photography Studio Booking Platform', label:'🌐 Web & Mobile App', description:'Full-stack photography studio booking platform connecting customers with professional photography services. Web version built with Laravel provides landing page, package catalog, interactive booking calendar, online payment via Midtrans (VA, E-Wallet, QRIS), digital invoices, admin dashboard, and AI assistant integration. Mobile version built with Flutter delivers seamless booking experience.', features:['Online Booking','Midtrans Payment','AI Assistant','Interactive Calendar','Admin Dashboard','Flutter Mobile App'], steps:[{title:'Requirements Analysis & Design',desc:'Analyzing photography studio booking platform needs, designing relational database (users, packages, bookings, payments), and planning web-mobile integration architecture.'},{title:'Laravel Backend Development',desc:'Building Laravel backend with multi-role authentication (admin/customer), photography package CRUD, booking system with schedule validation, and REST API for mobile app.'},{title:'Payment Gateway Integration',desc:'Integrating Midtrans Snap for online payments supporting Virtual Account, E-Wallet, and QRIS, with webhook notifications and automatic PDF invoices.'},{title:'Flutter Mobile App Development',desc:'Building mobile app using Flutter with Provider state management, package browsing, booking calendar, WebView payments, AI chatbot, and Google Sign-In.'},{title:'AI Integration & Testing',desc:'Integrating AI assistant for FAQ and booking help, end-to-end testing on booking and payment flows for web and mobile, and performance optimization.'}] },
    },
    'qa-cazh': {
      en: { tagline:'Digital Product Quality Testing', label:'🔍 Quality Assurance', description:'Internship project as Quality Assurance at PT Cazh Purwokerto (July — August 2026). Responsible for conducting functional and non-functional testing on digital products, preparing test cases and test scenarios, reporting bugs through bug tracking system, and ensuring product quality before release to production.', features:['Functional Testing','Test Case Design','Bug Reporting','Regression Testing','UI/UX Validation'], steps:[{title:'Requirements Analysis & Documentation',desc:'Studying product specification documents, user stories, and acceptance criteria to understand features to be tested.'},{title:'Test Case & Test Scenario Design',desc:'Designing comprehensive test cases and test scenarios covering positive testing, negative testing, and edge cases for each feature.'},{title:'Functional Testing Execution',desc:'Executing manual functional testing on each digital product module, verifying compliance with defined specifications.'},{title:'Bug Reporting & Tracking',desc:'Documenting and reporting found bugs through bug tracking system with detailed steps to reproduce, severity, and priority.'},{title:'Regression Testing & Validation',desc:'Performing regression testing after bug fixes to ensure no other features are affected, and final validation before production release.'}] },
    },
  };

  let currentLang = localStorage.getItem('portfolio-lang') || 'en';

  // ── Language Switcher ──
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Update custom dropdown UI
    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
      const currentName = langSelector.querySelector('.lang-current');
      currentName.textContent = lang === 'en' ? 'English' : 'Indonesia';
      
      // Update active state in dropdown options
      langSelector.querySelectorAll('.lang-option').forEach(opt => {
        if (opt.dataset.lang === lang) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
    }

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Restart typing animation with new language
    if (typedEl) {
      textIdx = 0; charIdx = 0; deleting = false;
      texts = typedTexts[lang];
    }

    // Update project cards with translated taglines and labels
    document.querySelectorAll('.project-card').forEach(card => {
      const pid = card.dataset.id;
      const pt = projectTranslations[pid];
      if (pt && lang === 'en' && pt.en) {
        card.querySelector('.tagline').textContent = pt.en.tagline;
        card.querySelector('.project-card-category').textContent = pt.en.label;
      } else if (pt && lang === 'id') {
        // Restore original Indonesian from data attributes
        card.querySelector('.tagline').textContent = card.dataset.tagline;
        const origLabel = card.querySelector('.project-card-category');
        // Use original label from server
        origLabel.textContent = origLabel.getAttribute('data-orig') || origLabel.textContent;
      }
    });
  }

  // Dropdown interactions
  const langSelector = document.getElementById('lang-selector');
  if (langSelector) {
    const trigger = document.getElementById('lang-selector-trigger');
    
    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      langSelector.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      langSelector.classList.remove('active');
    });

    // Handle option click
    langSelector.querySelectorAll('.lang-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = option.dataset.lang;
        if (selectedLang !== currentLang) {
          setLanguage(selectedLang);
        }
        langSelector.classList.remove('active');
      });
    });
  }

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Mobile nav toggle ──
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('active')));
  }

  // ── Typing animation ──
  const typedEl = document.getElementById('typed-text');
  let texts = typedTexts[currentLang];
  let textIdx = 0, charIdx = 0, deleting = false;
  if (typedEl) {
    function type() {
      const current = texts[textIdx];
      typedEl.textContent = current.substring(0, charIdx);
      if (!deleting && charIdx < current.length) { charIdx++; setTimeout(type, 80); }
      else if (!deleting) { setTimeout(() => { deleting = true; type(); }, 1800); }
      else if (deleting && charIdx > 0) { charIdx--; setTimeout(type, 40); }
      else { deleting = false; textIdx = (textIdx + 1) % texts.length; setTimeout(type, 400); }
    }
    type();
  }

  // ── Scroll reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Project filters ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) { card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => { card.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
        }
      });
    });
  });

  // ── Modal ──
  const overlay = document.getElementById('modal-overlay');
  const modalGalleryImg = document.getElementById('modal-gallery-img');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTech = document.getElementById('modal-tech');
  const dotsContainer = document.getElementById('gallery-dots');
  let currentImages = [], currentIdx = 0;

  function showImage(idx) {
    currentIdx = idx;
    modalGalleryImg.style.opacity = '0';
    setTimeout(() => { modalGalleryImg.src = currentImages[idx]; modalGalleryImg.style.opacity = '1'; }, 200);
    dotsContainer.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  const modalSteps = document.getElementById('modal-steps');
  const modalStepsWrapper = document.getElementById('modal-steps-wrapper');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const d = card.dataset;
      const pid = d.id;
      const pt = projectTranslations[pid];
      const useEn = currentLang === 'en' && pt && pt.en;

      modalTitle.textContent = d.name;
      modalTagline.textContent = useEn ? pt.en.tagline : d.tagline;
      modalDesc.textContent = useEn ? pt.en.description : d.description;

      const features = useEn ? pt.en.features : d.features.split(',');
      modalFeatures.innerHTML = features.map(f => `<span class="modal-feature">${(typeof f === 'string' ? f : f).trim()}</span>`).join('');
      modalTech.innerHTML = d.tech.split(',').map(t => `<span class="modal-tech-tag">${t.trim()}</span>`).join('');

      // Handle steps
      // Handle steps
      const stepsData = useEn && pt.en.steps ? pt.en.steps : (d.steps ? JSON.parse(d.steps) : null);
      if (stepsData) {
        modalSteps.innerHTML = stepsData.map((s, i) => 
          `<div class="step-item"><div class="step-number">${i + 1}</div><div class="step-content"><div class="step-title">${s.title}</div><div class="step-desc">${s.desc}</div></div></div>`
        ).join('');
        modalStepsWrapper.style.display = '';
      } else {
        modalStepsWrapper.style.display = 'none';
      }

      currentImages = d.images.split(',');
      dotsContainer.innerHTML = currentImages.map((_, i) => `<button class="gallery-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></button>`).join('');
      dotsContainer.querySelectorAll('.gallery-dot').forEach(dot => dot.addEventListener('click', () => showImage(parseInt(dot.dataset.idx))));
      showImage(0);
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelector('.gallery-prev')?.addEventListener('click', (e) => { e.stopPropagation(); showImage((currentIdx - 1 + currentImages.length) % currentImages.length); });
  document.querySelector('.gallery-next')?.addEventListener('click', (e) => { e.stopPropagation(); showImage((currentIdx + 1) % currentImages.length); });

  function closeModal() { overlay.classList.remove('active'); document.body.style.overflow = ''; }
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showImage((currentIdx - 1 + currentImages.length) % currentImages.length);
    if (e.key === 'ArrowRight') showImage((currentIdx + 1) % currentImages.length);
  });

  // ── Active nav on scroll ──
  const sections = document.querySelectorAll('.section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top = sec.offsetTop, height = sec.offsetHeight, id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) link.classList.toggle('active-link', scrollY >= top && scrollY < top + height);
    });
  });

  // ── Store original labels for ID restoration ──
  document.querySelectorAll('.project-card').forEach(card => {
    const label = card.querySelector('.project-card-category');
    if (label) label.setAttribute('data-orig', label.textContent.trim());
  });

  // ── Apply saved language on load ──
  setLanguage(currentLang);
});
