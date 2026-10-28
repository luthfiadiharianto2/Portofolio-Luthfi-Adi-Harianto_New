<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Luthfi Adi Harianto — UI/UX Designer, Frontend Developer & Quality Assurance portfolio. Specializing in UI/UX design, frontend mobile & web development, data analysis, and quality assurance.">
    <title>Luthfi Adi Harianto — Portfolio</title>
    <link rel="stylesheet" href="{{ asset('css/portfolio.css') }}?v={{ time() }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.1/lucide.min.css">
</head>
<body>

{{-- ═══════════ NAVBAR ═══════════ --}}
<nav class="navbar" id="navbar">
    <div class="container">
        <a href="#" class="nav-logo">LAH.</a>
        <ul class="nav-links" id="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <div class="lang-selector" id="lang-selector">
            <div class="lang-selector-trigger" id="lang-selector-trigger">
                <svg class="lang-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                <span class="lang-current">English</span>
                <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div class="lang-selector-dropdown">
                <div class="lang-option" data-lang="en">
                    <span class="lang-flag">🇬🇧</span>
                    <span class="lang-name">English</span>
                    <svg class="check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div class="lang-option" data-lang="id">
                    <span class="lang-flag">🇮🇩</span>
                    <span class="lang-name">Indonesia</span>
                    <svg class="check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
            </div>
        </div>
        <a href="#contact" class="nav-cta" data-i18n="nav_cta">Let's Talk</a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
        </button>
    </div>
</nav>

{{-- ═══════════ HERO ═══════════ --}}
<section class="hero" id="hero">
    <div class="container">
        <div class="hero-content">
            <p class="hero-greeting"><span class="wave">👋</span> <span data-i18n="hero_greeting">Hello, I'm</span></p>
            <h1 class="hero-name">Luthfi Adi<br><span class="gradient-text">Harianto</span></h1>
            <p class="hero-title"><span id="typed-text"></span><span class="typed-cursor">|</span></p>
            <p class="hero-desc" data-i18n="hero_desc">
                A passionate tech student at Telkom University Purwokerto crafting meaningful digital experiences through UI/UX design, frontend development, data analysis, and quality assurance.
            </p>
            <div class="hero-buttons">
                <a href="#projects" class="btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                    <span data-i18n="hero_btn_projects">View Projects</span>
                </a>
                <a href="#contact" class="btn-outline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span data-i18n="hero_btn_contact">Get in Touch</span>
                </a>
            </div>
            <div class="hero-stats">
                <div class="stat-item"><div class="stat-number">9+</div><div class="stat-label" data-i18n="stat_projects">Featured Projects</div></div>
                <div class="stat-item"><div class="stat-number">5+</div><div class="stat-label" data-i18n="stat_skills">Skills</div></div>
                <div class="stat-item"><div class="stat-number">2+</div><div class="stat-label" data-i18n="stat_years">Years Exp</div></div>
            </div>
        </div>
        <div class="hero-image">
            <div class="hero-image-wrapper">
                <img src="{{ asset('images/profile/profile.jpg') }}" alt="Luthfi Adi Harianto">
            </div>
        </div>
    </div>
</section>

{{-- ═══════════ ABOUT ═══════════ --}}
<section class="section" id="about">
    <div class="container">
        <span class="section-label reveal" data-i18n="about_label">About Me</span>
        <h2 class="section-title reveal"><span data-i18n="about_title_1">Turning Ideas Into</span><br><span class="gradient-text" data-i18n="about_title_2">Digital Reality</span></h2>
        <div class="about-grid">
            <div class="about-text reveal">
                <p data-i18n="about_p1">
                    I'm a multi-disciplinary tech student with a strong passion for creating intuitive user interfaces 
                    and building robust web & mobile applications. Currently pursuing my degree at 
                    <strong>Telkom University Purwokerto</strong>.
                </p>
                <p data-i18n="about_p2">
                    My journey spans across UI/UX design, frontend mobile & web development, data analysis, and quality assurance. 
                    I believe in creating digital products that not only look beautiful but also solve real problems 
                    and deliver exceptional user experiences.
                </p>
                <div class="about-info">
                    <div class="about-info-item">
                        <div class="label">Name</div>
                        <div class="value">Luthfi Adi Harianto</div>
                    </div>
                    <div class="about-info-item">
                        <div class="label">University</div>
                        <div class="value">Telkom University Purwokerto</div>
                    </div>
                    <div class="about-info-item">
                        <div class="label">Location</div>
                        <div class="value">Purwokerto, ID</div>
                    </div>
                    <div class="about-info-item">
                        <div class="label">Focus</div>
                        <div class="value">UI/UX, Frontend, Data & QA</div>
                    </div>
                </div>
            </div>
            <div class="about-visual reveal reveal-delay-2">
                <div class="about-card">
                    <div class="experience-item">
                        <div class="experience-year">Jul — Aug 2026</div>
                        <div class="experience-title" data-i18n="exp_title_1">Quality Assurance Intern</div>
                        <div class="experience-place">PT Cazh Purwokerto</div>
                        <div class="experience-desc" data-i18n="exp_desc_1">Melakukan pengujian fungsional dan non-fungsional pada produk digital perusahaan, menyusun test case, melaporkan bug melalui bug tracking system, serta memastikan kualitas produk sebelum rilis ke production.</div>
                    </div>
                    <div class="experience-item">
                        <div class="experience-year">2024 — Present</div>
                        <div class="experience-title">UI/UX Designer & Developer</div>
                        <div class="experience-place">Freelance & Academic Projects</div>
                        <div class="experience-desc" data-i18n="exp_desc_2">Merancang dan mengembangkan antarmuka pengguna untuk aplikasi web dan mobile, mulai dari wireframing, prototyping di Figma, hingga implementasi frontend dengan fokus pada user experience yang intuitif.</div>
                    </div>
                    <div class="experience-item">
                        <div class="experience-year">2023 — Present</div>
                        <div class="experience-title">Informatics Student</div>
                        <div class="experience-place">Telkom University Purwokerto</div>
                        <div class="experience-desc" data-i18n="exp_desc_3">Menempuh pendidikan S1 Informatika dengan fokus pada pengembangan perangkat lunak, basis data, algoritma, serta proyek-proyek akademik di bidang web, mobile, dan data analysis.</div>
                    </div>
                    <div class="experience-item">
                        <div class="experience-year">2023 — 2024</div>
                        <div class="experience-title">Web Development Learner</div>
                        <div class="experience-place">Self-taught & Bootcamps</div>
                        <div class="experience-desc" data-i18n="exp_desc_4">Mempelajari fundamental web development secara otodidak dan melalui bootcamp online, meliputi HTML, CSS, JavaScript, PHP, Laravel, serta konsep REST API dan database management.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- ═══════════ EDUCATION, ACHIEVEMENTS & ORGANIZATIONS ═══════════ --}}
<section class="section" id="background">
    <div class="container">
        <span class="section-label reveal" data-i18n="bg_label">Background</span>
        <h2 class="section-title reveal"><span data-i18n="bg_title_1">Pendidikan, Prestasi &</span><br><span class="gradient-text" data-i18n="bg_title_2">Organisasi</span></h2>
        <p class="section-subtitle reveal" data-i18n="bg_subtitle">Perjalanan akademik, pencapaian, dan keterlibatan organisasi yang membentuk kompetensi saya.</p>

        <div class="background-grid">
            {{-- Pendidikan --}}
            <div class="bg-column reveal">
                <div class="bg-column-header">
                    <div class="bg-column-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>
                    </div>
                    <h3 data-i18n="bg_edu_title">Pendidikan</h3>
                </div>
                <div class="bg-column-items">
                    @foreach($education as $edu)
                    <div class="edu-item">
                        <div class="edu-icon">
                            @if($edu['icon'] === 'university')
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>
                            @else
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                            @endif
                        </div>
                        <div class="edu-content">
                            <div class="edu-year" data-i18n="edu_year_{{ $loop->index }}">{{ $edu['year'] }}</div>
                            <div class="edu-institution" data-i18n="edu_inst_{{ $loop->index }}">{{ $edu['institution'] }}</div>
                            <div class="edu-degree" data-i18n="edu_deg_{{ $loop->index }}">{{ $edu['degree'] }}</div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- Prestasi --}}
            <div class="bg-column reveal reveal-delay-2">
                <div class="bg-column-header">
                    <div class="bg-column-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                    </div>
                    <h3 data-i18n="bg_ach_title">Prestasi</h3>
                </div>
                <div class="bg-column-items">
                    @foreach($achievements as $ach)
                    <div class="achievement-item">
                        <span class="achievement-icon">{{ $ach['icon'] }}</span>
                        <div class="achievement-content">
                            <div class="achievement-title" data-i18n="ach_title_{{ $loop->index }}">{{ $ach['title'] }}</div>
                            <div class="achievement-detail" data-i18n="ach_det_{{ $loop->index }}">{{ $ach['detail'] }}</div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- Organisasi --}}
            <div class="bg-column reveal reveal-delay-3">
                <div class="bg-column-header">
                    <div class="bg-column-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <h3 data-i18n="bg_org_title">Organisasi</h3>
                </div>
                <div class="bg-column-items">
                    @foreach($organizations as $org)
                    <div class="org-item">
                        <div class="org-header">
                            <div class="org-year" data-i18n="org_year_{{ $loop->index }}">{{ $org['year'] }}</div>
                            <div class="org-role" data-i18n="org_role_{{ $loop->index }}">{{ $org['role'] }}</div>
                            <div class="org-name" data-i18n="org_name_{{ $loop->index }}">{{ $org['org'] }}</div>
                        </div>
                        <div class="org-desc" data-i18n="org_desc_{{ $loop->index }}">{{ $org['desc'] }}</div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</section>

{{-- ═══════════ SKILLS ═══════════ --}}
<section class="section" id="skills">
    <div class="container">
        <span class="section-label reveal" data-i18n="skills_label">What I Do</span>
        <h2 class="section-title reveal"><span data-i18n="skills_title_1">My </span><span class="gradient-text" data-i18n="skills_title_2">Expertise</span></h2>
        <p class="section-subtitle reveal" data-i18n="skills_subtitle">Combining creativity with technical skills to build products that make a difference.</p>
        <div class="skills-grid">
            @foreach($skills as $index => $skill)
            <div class="skill-card reveal reveal-delay-{{ $index + 1 }}">
                <div class="skill-icon">
                    @if($skill['icon'] === 'palette')
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="var(--accent-2)"/><circle cx="17.5" cy="10.5" r=".5" fill="var(--accent-2)"/><circle cx="8.5" cy="7.5" r=".5" fill="var(--accent-2)"/><circle cx="6.5" cy="12.5" r=".5" fill="var(--accent-2)"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                    @elseif($skill['icon'] === 'code')
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    @elseif($skill['icon'] === 'chart')
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                    @elseif($skill['icon'] === 'shield')
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                    @else
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                    @endif
                </div>
                <h3>{{ $skill['category'] }}</h3>
                <div class="skill-tags">
                    @foreach($skill['items'] as $item)
                    <span class="skill-tag">{{ $item }}</span>
                    @endforeach
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════════ PROJECTS ═══════════ --}}
<section class="section" id="projects">
    <div class="container">
        <span class="section-label reveal" data-i18n="projects_label">Portfolio</span>
        <h2 class="section-title reveal"><span data-i18n="projects_title_1">Featured </span><span class="gradient-text" data-i18n="projects_title_2">Projects</span></h2>
        <p class="section-subtitle reveal" data-i18n="projects_subtitle">A selection of projects that showcase my skills across design and development.</p>

        <div class="project-filters reveal">
            <button class="filter-btn active" data-filter="all" data-i18n="filter_all">Semua Proyek</button>
            <button class="filter-btn" data-filter="uiux">UI/UX Design</button>
            <button class="filter-btn" data-filter="web">Web & Mobile</button>
            <button class="filter-btn" data-filter="data">Data Analysis</button>
            <button class="filter-btn" data-filter="qa">Quality Assurance</button>
        </div>

        <div class="projects-grid">
            @foreach($projects as $index => $project)
            <div class="project-card reveal reveal-delay-{{ ($index % 4) + 1 }}"
                 data-id="{{ $project['id'] }}"
                 data-category="{{ $project['category'] }}"
                 data-name="{{ $project['name'] }}"
                 data-tagline="{{ $project['tagline'] }}"
                 data-description="{{ $project['description'] }}"
                 data-features="{{ implode(',', $project['features']) }}"
                 data-tech="{{ implode(',', $project['tech']) }}"
                 data-images="{{ implode(',', $project['images']) }}"
                 @if(isset($project['steps']))
                 data-steps='@json($project['steps'])'
                 @endif>
                <div class="project-card-image">
                    <img src="{{ asset($project['thumbnail']) }}" alt="{{ $project['name'] }}" loading="lazy">
                    <div class="project-card-overlay">
                         <span data-i18n="view_details">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            View Details
                        </span>
                    </div>
                </div>
                <div class="project-card-body">
                    <div class="project-card-category">
                        {{ $project['label'] }}
                    </div>
                    <h3>{{ $project['name'] }}</h3>
                    <p class="tagline">{{ $project['tagline'] }}</p>
                    <div class="project-tech">
                        @foreach(array_slice($project['tech'], 0, 3) as $tech)
                        <span>{{ $tech }}</span>
                        @endforeach
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════════ CONTACT ═══════════ --}}
<section class="section" id="contact">
    <div class="container">
        <span class="section-label reveal" data-i18n="contact_label">Get in Touch</span>
        <h2 class="section-title reveal"><span data-i18n="contact_title_1">Let's Work </span><span class="gradient-text" data-i18n="contact_title_2">Together</span></h2>
        <p class="section-subtitle reveal" data-i18n="contact_subtitle">Have a project in mind? I'd love to hear about it.</p>
        <div class="contact-grid">
            <div class="contact-info reveal">
                <h3 data-i18n="contact_info_title">Contact Information</h3>
                <p data-i18n="contact_info_desc">Feel free to reach out through any of the platforms below. I'm always open to discussing new projects and opportunities.</p>
                <div class="contact-links">
                    <a href="mailto:luthfiadiharianto2@gmail.com" class="contact-link">
                        <div class="contact-link-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <div class="contact-link-text">
                            <div class="link-label">Email</div>
                            <div class="link-value">luthfiadiharianto2@gmail.com</div>
                        </div>
                    </a>
                    <a href="https://linkedin.com/in/lutfi-adi-harianto" target="_blank" class="contact-link">
                        <div class="contact-link-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </div>
                        <div class="contact-link-text">
                            <div class="link-label">LinkedIn</div>
                            <div class="link-value">Lutfi Adi Harianto</div>
                        </div>
                    </a>
                    <a href="https://github.com/LuthfiAdiHarianto" target="_blank" class="contact-link">
                        <div class="contact-link-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        </div>
                        <div class="contact-link-text">
                            <div class="link-label">GitHub</div>
                            <div class="link-value">LuthfiAdiHarianto</div>
                        </div>
                    </a>
                </div>
            </div>
            <form class="contact-form reveal reveal-delay-2" onsubmit="event.preventDefault(); alert('Thank you for your message!');">
                <div class="form-group">
                    <label for="name" data-i18n="form_name">Your Name</label>
                    <input type="text" id="name" placeholder="John Doe" required>
                </div>
                <div class="form-group">
                    <label for="email" data-i18n="form_email">Email Address</label>
                    <input type="email" id="email" placeholder="john@example.com" required>
                </div>
                <div class="form-group">
                    <label for="message" data-i18n="form_message">Message</label>
                    <textarea id="message" placeholder="Tell me about your project..." required></textarea>
                </div>
                <button type="submit" class="btn-primary" style="width:100%; justify-content:center;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    <span data-i18n="form_submit">Send Message</span>
                </button>
            </form>
        </div>
    </div>
</section>

{{-- ═══════════ FOOTER ═══════════ --}}
<footer class="footer">
    <div class="container">
        <div class="footer-social">
            <a href="https://linkedin.com/in/lutfi-adi-harianto" target="_blank" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://github.com/LuthfiAdiHarianto" target="_blank" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="https://instagram.com/" target="_blank" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
        </div>
        <p>&copy; {{ date('Y') }} Luthfi Adi Harianto. <span data-i18n="footer_text">Crafted with passion.</span></p>
    </div>
</footer>

{{-- ═══════════ MODAL ═══════════ --}}
<div class="modal-overlay" id="modal-overlay">
    <div class="modal">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="modal-gallery">
            <img id="modal-gallery-img" src="" alt="Project screenshot">
            <button class="gallery-nav gallery-prev" aria-label="Previous">&#8249;</button>
            <button class="gallery-nav gallery-next" aria-label="Next">&#8250;</button>
        </div>
        <div class="gallery-dots" id="gallery-dots"></div>
        <div class="modal-body">
            <h2 id="modal-title"></h2>
            <p class="modal-tagline" id="modal-tagline"></p>
            <p id="modal-desc"></p>
            <div id="modal-steps-wrapper" style="display:none;">
                <div class="modal-section-title" data-i18n="modal_steps_title">Development Steps</div>
                <div class="modal-steps" id="modal-steps"></div>
            </div>
            <div class="modal-section-title" data-i18n="modal_features_title">Key Features</div>
            <div class="modal-features" id="modal-features"></div>
            <div class="modal-section-title" data-i18n="modal_tech_title">Tech Stack</div>
            <div class="modal-tech-tags" id="modal-tech"></div>
        </div>
    </div>
</div>

<script src="{{ asset('js/portfolio.js') }}?v={{ time() }}"></script>
</body>
</html>
