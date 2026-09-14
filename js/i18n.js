/**
 * Internationalization (i18n) Module
 * Handles bilingual support (Bahasa Indonesia & English) across the portfolio.
 * Preserves standard developer terminology (deploy, maintenance, CI/CD, Docker, etc.) in both languages.
 */

(function () {
  const STORAGE_KEY = "portfolio_lang";

  // UI Strings Dictionary
  const I18N_DICTIONARY = {
    id: {
      meta: {
        title: "Rifki Rizkia - Software Engineer & DevSecOps Portofolio",
        description: "Portofolio Rifki Rizkia - Software Engineer, Mobile Developer, dan DevSecOps Engineer. Spesialisasi dalam pengembangan Flutter, React Native, Docker Swarm, CI/CD, OWASP ZAP, SonarQube, dan infrastruktur cloud."
      },
      nav: {
        brand: "Portofolio",
        about: "Tentang",
        experience: "Pengalaman",
        portfolio: "Portofolio",
        projects: "Projek",
        organization: "Organisasi",
        awards: "Penghargaan",
        contact: "Kontak"
      },
      hero: {
        greeting: "Halo, saya",
        bio: "Berpengalaman dalam pengembangan aplikasi, website, serta infrastruktur server untuk menghadirkan solusi digital yang cepat, aman, dan mudah dikembangkan sesuai kebutuhan bisnis.",
        ctaPortfolio: "Lihat Portofolio",
        ctaContact: "Hubungi Saya"
      },
      about: {
        title: "Tentang Saya",
        p1: "Saya adalah Software Engineer dengan pengalaman lebih dari 5 tahun dalam membangun aplikasi mobile, website, dan sistem backend yang siap digunakan di lingkungan produksi.",
        p2: "Saya membantu bisnis mengubah ide menjadi produk digital melalui proses end-to-end, mulai dari analisis kebutuhan, desain UI/UX, pengembangan aplikasi, hingga deployment ke server agar sistem dapat berjalan dengan stabil dan aman.",
        p3: "Selain pengembangan aplikasi menggunakan Flutter, React Native, dan teknologi web modern, saya juga berpengalaman dalam pengelolaan server, cloud, dan CI/CD untuk memastikan aplikasi siap digunakan dan mudah dikembangkan ke depannya.",
        p4: "Saya fokus membangun solusi yang cepat, aman, dan mudah digunakan untuk mendukung pertumbuhan bisnis klien.",
        skillsTitle: "Keahlian & Teknologi",
        skillsSubtitle: "Berikut adalah ekosistem teknologi yang biasa saya gunakan untuk membangun solusi siap produksi.",
        catMobile: "Mobile & Frontend",
        catBackend: "Backend & Automation",
        catDevops: "DevSecOps & Infrastructure",
        sslSetup: "Setup SSL"
      },
      experience: {
        title: "Pengalaman Kerja",
        exp1Date: "Jan 2023 – Jul 2023",
        exp1Role: "Mobile Developer (Magang)",
        exp1Company: "Radya Labs",
        exp1Desc: "Mengembangkan aplikasi mobile menggunakan Flutter untuk klien perusahaan. Bertanggung jawab untuk implementasi UI/UX design, integrasi API, dan pengujian aplikasi.",
        exp2Date: "Nov 2023 – Sekarang",
        exp2Role: "Mobile Developer",
        exp2Company: "elSpasial",
        exp2Desc: "Memimpin pengembangan aplikasi mobile untuk berbagai proyek perusahaan menggunakan Flutter dan React Native. Menerapkan best practices dalam pengembangan mobile.",
        exp3Date: "Jun 2025 – Sekarang",
        exp3Role: "DevSecOps Engineer",
        exp3Company: "elSpasial",
        exp3Desc: "Fokus pada otomatisasi deployment, CI/CD pipeline, keamanan SAST/DAST (SonarQube & OWASP ZAP), serta infrastruktur cloud yang andal dan terproteksi."
      },
      portfolio: {
        title: "Portofolio & Case Studies",
        subtitle: "Eksplorasi proyek aplikasi mobile, sistem web enterprise, dan arsitektur infrastruktur DevSecOps yang telah saya selesaikan.",
        tabAll: "Semua Projek",
        tabMobile: "Mobile",
        tabWeb: "Web",
        tabDevops: "DevSecOps",
        viewAll: "Lihat Semua Projek",
        showLess: "Tampilkan Diringkas",
        noProjects: "Tidak ada projek ditemukan untuk kategori ini.",
        readCaseStudy: "Baca Case Study",
        viewCaseStudy: "Lihat Case Study",
        statusProduction: "Produksi",
        statusCompleted: "Selesai",
        roleLabel: "Peran"
      },
      devops: {
        badge: "Teknik DevSecOps & Infrastruktur",
        title: "DevSecOps Portofolio",
        subtitle: "Membangun infrastruktur yang andal dan aman, mengintegrasikan security pipeline (SAST SonarQube & DAST OWASP ZAP), mengotomatisasi deployment, serta mengelola sistem produksi secara berkelanjutan.",
        stat1Number: "12+",
        stat1Label: "Aplikasi Produksi",
        stat2Number: "50+",
        stat2Label: "Deployment Sistem",
        stat3Number: "99%",
        stat3Label: "Ketersediaan Layanan",
        stat4Number: "SAST & DAST",
        stat4Label: "DevSecOps Gates",
        featuredBadge: "Case Study Unggulan",
        featuredSub: "Sorotan Utama Infrastruktur",
        featuredHighlight: "Sorotan Utama",
        statusProductionBadge: "Status Produksi",
        readFullCaseStudy: "Baca Case Study Selengkapnya",
        gridTitle: "Studi Kasus DevSecOps & Infrastruktur",
        gridSub: "Arsitektur & Deployment Enterprise",
        sec3Badge: "Otomatisasi Alur Kerja",
        sec3Title: "Alur Kerja CI/CD & DevSecOps",
        sec3Desc: "Alur kerja end-to-end terintegrasi mulai dari commit kode sumber hingga deployment otomatis di kluster produksi dengan continuous testing dan security scanning.",
        pipeStep1Title: "Code Commit",
        pipeStep1Desc: "Developer push ke branch main / release",
        pipeStep2Title: "CI & SAST",
        pipeStep2Desc: "SonarQube memeriksa kerentanan & code smells",
        pipeStep3Title: "Docker Build",
        pipeStep3Desc: "Build image teroptimasi & push ke Docker Registry",
        pipeStep4Title: "DAST Scan",
        pipeStep4Desc: "OWASP ZAP menguji kerentanan API & endpoint",
        pipeStep5Title: "CD Deploy",
        pipeStep5Desc: "Rolling update kluster Docker Swarm zero-downtime",
        pipeStep6Title: "Monitoring",
        pipeStep6Desc: "Prometheus, Grafana, & alert Telegram/WA",
        sec4Badge: "Visualisasi Interaktif",
        sec4Title: "Arsitektur Pipeline Interaktif",
        sec4Desc: "Klik setiap tahapan di bawah untuk melihat detail implementasi teknis dan tooling yang digunakan.",
        sec5Badge: "Infrastruktur Jaringan",
        sec5Title: "Topologi Server Terkelola",
        sec5Desc: "Arsitektur multi-node cluster dengan reverse proxy terpusat, SSL termination, load balancing, dan isolasi jaringan Docker.",
        sec6Badge: "Keamanan Sistem",
        sec6Title: "Audit Keamanan Otomatis (SAST & DAST)",
        sec6Desc: "Penerapan automated security quality gate pada setiap pipeline untuk mencegah kerentanan keamanan sebelum rilis ke produksi.",
        sec7Badge: "Observabilitas Sistem",
        sec7Title: "Monitoring & Observabilitas Realtime",
        sec7Desc: "Sistem monitoring 24/7 untuk memastikan performa server, uptime aplikasi, dan alert cepat jika terjadi gangguan.",
        sec8Badge: "Jejak Rekam Produksi",
        sec8Title: "18+ Sistem & Aplikasi Berjalan di Produksi",
        sec8Desc: "Portofolio platform, aplikasi web, dan aplikasi mobile yang infrastrukturnya dikonfigurasi, dideploy, dan dikelola secara aktif.",
        sec9Title: "Siap Meningkatkan Keamanan & Keandalan Infrastruktur Anda?",
        sec9Desc: "Diskusikan kebutuhan arsitektur cloud, otomatisasi CI/CD, atau audit keamanan sistem bersama saya.",
        sec9Btn: "Konsultasi Infrastruktur"
      },
      caseStudy: {
        backBtn: "Kembali ke Portofolio",
        overviewTitle: "Gambaran Projek",
        whatLabel: "Apa ini?",
        whoLabel: "Untuk siapa?",
        problemSolvedLabel: "Masalah yang Diatasi",
        problemTitle: "Tantangan & Masalah Utama",
        archTitle: "Arsitektur Solusi & Workflow",
        respTitle: "Tanggung Jawab & Kontribusi Teknis",
        resultsTitle: "Hasil Terukur & Dampak",
        galleryTitle: "Galeri Arsitektur & Screenshot",
        learningsTitle: "Pembelajaran Teknis",
        challengesLabel: "Tantangan Utama",
        mistakesLabel: "Kesalahan & Solusi",
        solutionsLabel: "Solusi Kunci",
        improvementsLabel: "Rencana Peningkatan",
        ctaTitle: "Tertarik berkolaborasi atau mendiskusikan arsitektur ini?",
        ctaDesc: "Saya terbuka untuk diskusi teknis, review infrastruktur, atau eksplorasi peluang baru.",
        ctaBtn: "Hubungi via WhatsApp",
        closeBtn: "Tutup"
      },
      organization: {
        title: "Pengalaman Organisasi",
        name: "Danurdara",
        p1: "Aktif sebagai anggota Danurdara, organisasi yang berfokus pada kegiatan sosial dan kemanusiaan.",
        p2: "Sebagai tim teknologi, saya berkontribusi dalam pengembangan website komunitas profile dan publikasi dokumentasi kegiatan."
      },
      awards: {
        title: "Penghargaan & Prestasi",
        awardTopTitle: "Juara 2",
        awardTopDesc: "Mahasiswa Berprestasi Program Diploma Tingkat Universitas",
        award1Title: "Juara 1",
        award1Desc: "Lomba Swichfest UI/UX",
        award2Title: "Juara 1",
        award2Desc: "Java Business Competition UI/UX",
        award3Title: "Juara 1",
        award3Desc: "Bussiness Plan Competition HMPS Nasional",
        award4Title: "Juara 2",
        award4Desc: "Lomba UI/UX FIKFAIR"
      },
      contact: {
        title: "Mari Terhubung",
        subtitle: "Saya selalu terbuka untuk mendiskusikan peluang kerja baru, kolaborasi proyek, atau sekadar bertukar sapa.",
        emailLabel: "Email",
        locationLabel: "Lokasi",
        locationValue: "Bandung, Indonesia"
      },
      footer: {
        designedBy: "Didesain & Dibangun oleh",
        rights: "© 2025 All rights reserved."
      }
    },
    en: {
      meta: {
        title: "Rifki Rizkia - Software Engineer & DevSecOps Portfolio",
        description: "Portfolio of Rifki Rizkia - Software Engineer, Mobile Developer, and DevSecOps Engineer. Specializing in Flutter, React Native, Docker Swarm, CI/CD, OWASP ZAP, SonarQube, and cloud infrastructure."
      },
      nav: {
        brand: "Portfolio",
        about: "About",
        experience: "Experience",
        portfolio: "Portfolio",
        projects: "Projects",
        organization: "Organization",
        awards: "Awards",
        contact: "Contact"
      },
      hero: {
        greeting: "Hello, I am",
        bio: "Experienced in mobile application, website, and server infrastructure development to deliver fast, secure, and scalable digital solutions tailored to business needs.",
        ctaPortfolio: "View Portfolio",
        ctaContact: "Contact Me"
      },
      about: {
        title: "About Me",
        p1: "I am a Software Engineer with over 5 years of experience in building mobile applications, websites, and backend systems ready for production environments.",
        p2: "I help businesses transform ideas into digital products through an end-to-end process—from requirements analysis, UI/UX design, application development, to server deployment ensuring high stability and security.",
        p3: "Beyond mobile development with Flutter, React Native, and modern web tech, I specialize in server management, cloud infrastructure, and CI/CD pipelines to ensure applications are production-ready and easily scalable.",
        p4: "I focus on engineering fast, secure, and user-friendly solutions that accelerate business growth.",
        skillsTitle: "Skills & Technologies",
        skillsSubtitle: "The technology ecosystem I actively leverage to build production-grade solutions.",
        catMobile: "Mobile & Frontend",
        catBackend: "Backend & Automation",
        catDevops: "DevSecOps & Infrastructure",
        sslSetup: "SSL Setup"
      },
      experience: {
        title: "Work Experience",
        exp1Date: "Jan 2023 – Jul 2023",
        exp1Role: "Mobile Developer (Intern)",
        exp1Company: "Radya Labs",
        exp1Desc: "Developed enterprise mobile applications using Flutter. Responsible for UI/UX design implementation, REST API integration, and thorough application testing.",
        exp2Date: "Nov 2023 – Present",
        exp2Role: "Mobile Developer",
        exp2Company: "elSpasial",
        exp2Desc: "Led mobile application development for various enterprise projects using Flutter and React Native. Enforced best practices in mobile architecture and quality.",
        exp3Date: "Jun 2025 – Present",
        exp3Role: "DevSecOps Engineer",
        exp3Company: "elSpasial",
        exp3Desc: "Focused on automated deployment, CI/CD pipelines, SAST/DAST security scanning (SonarQube & OWASP ZAP), and highly reliable, protected cloud infrastructure."
      },
      portfolio: {
        title: "Portfolio & Case Studies",
        subtitle: "Explore mobile applications, enterprise web platforms, and DevSecOps infrastructure architectures I have engineered.",
        tabAll: "All Projects",
        tabMobile: "Mobile",
        tabWeb: "Web",
        tabDevops: "DevSecOps",
        viewAll: "View All Projects",
        showLess: "Show Less",
        noProjects: "No projects found for this category.",
        readCaseStudy: "Read Case Study",
        viewCaseStudy: "View Case Study",
        statusProduction: "Production",
        statusCompleted: "Completed",
        roleLabel: "Role"
      },
      devops: {
        badge: "DevSecOps & Infrastructure Engineering",
        title: "DevSecOps Portfolio",
        subtitle: "Building reliable and secure infrastructure, integrating security pipelines (SonarQube SAST & OWASP ZAP DAST), automating deployments, and maintaining sustainable production systems.",
        stat1Number: "12+",
        stat1Label: "Production Apps",
        stat2Number: "50+",
        stat2Label: "System Deployments",
        stat3Number: "99%",
        stat3Label: "Service Availability",
        stat4Number: "SAST & DAST",
        stat4Label: "DevSecOps Gates",
        featuredBadge: "Featured Case Study",
        featuredSub: "Key Infrastructure Highlight",
        featuredHighlight: "Key Highlight",
        statusProductionBadge: "Production Status",
        readFullCaseStudy: "Read Full Case Study",
        gridTitle: "DevSecOps & Infrastructure Case Studies",
        gridSub: "Enterprise Architecture & Deployments",
        sec3Badge: "Workflow Automation",
        sec3Title: "CI/CD & DevSecOps Pipeline Flow",
        sec3Desc: "Integrated end-to-end pipeline from source code commit to automated cluster deployment with continuous automated testing and security scanning.",
        pipeStep1Title: "Code Commit",
        pipeStep1Desc: "Developer pushes commit to main / release branch",
        pipeStep2Title: "CI & SAST",
        pipeStep2Desc: "SonarQube scans for vulnerabilities & code smells",
        pipeStep3Title: "Docker Build",
        pipeStep3Desc: "Build optimized image & push to Docker Registry",
        pipeStep4Title: "DAST Scan",
        pipeStep4Desc: "OWASP ZAP scans API endpoints for security flaws",
        pipeStep5Title: "CD Deploy",
        pipeStep5Desc: "Zero-downtime rolling update across Docker Swarm cluster",
        pipeStep6Title: "Monitoring",
        pipeStep6Desc: "Prometheus, Grafana metrics, & Telegram/WA alert dispatch",
        sec4Badge: "Interactive Visualization",
        sec4Title: "Interactive Pipeline Architecture",
        sec4Desc: "Click any pipeline stage below to view technical implementation details and tooling applied.",
        sec5Badge: "Network Infrastructure",
        sec5Title: "Managed Server Topology",
        sec5Desc: "Multi-node cluster architecture with centralized reverse proxy, SSL termination, load balancing, and Docker network isolation.",
        sec6Badge: "System Security",
        sec6Title: "Automated Security Scanning (SAST & DAST)",
        sec6Desc: "Automated security quality gates implemented across pipelines to prevent vulnerabilities before reaching production.",
        sec7Badge: "System Observability",
        sec7Title: "Realtime Monitoring & Observability",
        sec7Desc: "24/7 monitoring infrastructure ensuring server health, application uptime, and rapid alerting during incidents.",
        sec8Badge: "Production Track Record",
        sec8Title: "18+ Systems & Apps Running in Production",
        sec8Desc: "Showcase of platforms, web apps, and mobile applications whose infrastructure is actively configured, deployed, and managed.",
        sec9Title: "Ready to Upgrade Your Infrastructure & Security?",
        sec9Desc: "Let's discuss your cloud architecture, CI/CD automation, or security audit needs.",
        sec9Btn: "Consult Infrastructure"
      },
      caseStudy: {
        backBtn: "Back to Portfolio",
        overviewTitle: "Project Overview",
        whatLabel: "What is this?",
        whoLabel: "Target Audience",
        problemSolvedLabel: "Problem Solved",
        problemTitle: "Key Challenges & Problem Statement",
        archTitle: "Solution Architecture & Workflow",
        respTitle: "Responsibilities & Technical Contributions",
        resultsTitle: "Measurable Results & Impact",
        galleryTitle: "Architecture & Screenshot Gallery",
        learningsTitle: "Engineering Learnings",
        challengesLabel: "Key Challenges",
        mistakesLabel: "Mistakes & Fixes",
        solutionsLabel: "Key Solutions",
        improvementsLabel: "Future Improvements",
        ctaTitle: "Interested in collaborating or discussing this architecture?",
        ctaDesc: "I am open to technical discussions, infrastructure reviews, or exploring new opportunities.",
        ctaBtn: "Chat via WhatsApp",
        closeBtn: "Close"
      },
      organization: {
        title: "Organizational Experience",
        name: "Danurdara",
        p1: "Active member of Danurdara, an organization dedicated to social and humanitarian initiatives.",
        p2: "As part of the technology team, contributed to developing the community profile website and publishing event documentation."
      },
      awards: {
        title: "Awards & Achievements",
        awardTopTitle: "2nd Place",
        awardTopDesc: "Outstanding Student of Diploma Program - University Level",
        award1Title: "1st Place",
        award1Desc: "Swichfest UI/UX Competition",
        award2Title: "1st Place",
        award2Desc: "Java Business Competition UI/UX",
        award3Title: "1st Place",
        award3Desc: "National HMPS Business Plan Competition",
        award4Title: "2nd Place",
        award4Desc: "FIKFAIR UI/UX Competition"
      },
      contact: {
        title: "Let's Connect",
        subtitle: "I am always open to discussing new opportunities, project collaborations, or simply saying hello.",
        emailLabel: "Email",
        locationLabel: "Location",
        locationValue: "Bandung, Indonesia"
      },
      footer: {
        designedBy: "Designed & Built by",
        rights: "© 2025 All rights reserved."
      }
    }
  };

  // Projects English Translations Mapping
  const PROJECTS_EN_TRANSLATIONS = {
    "website-monitoring-platform": {
      shortDescription: "Realtime multi-node server & website monitoring platform integrated with Telegram, WhatsApp alerts, & AI Assistant.",
      overview: {
        what: "SaaS and internal server monitoring platform for tracking uptime, latency, CPU/Memory load, and SSL certificate validity across dozens of server endpoints centrally.",
        who: "IT Operations teams, System Administrators, and DevSecOps Engineers managing multi-server infrastructure.",
        problemSolved: "Prevents undetected downtime by delivering instantaneous alerts via Telegram and WhatsApp whenever server failures occur or SSL certificates approach expiration."
      },
      problem: "Previously, server health monitoring was executed manually and fragmented without a unified alert system. When servers faced downtime outside working hours, the IT team was unaware, risking operational losses.",
      architecture: [
        { step: 1, title: "Managed Nodes", desc: "Agent nodes perform health check pings & report metrics" },
        { step: 2, title: "Cloudflare Proxy", desc: "Secure DNS routing with WAF & SSL protection" },
        { step: 3, title: "Nginx Gateway", desc: "Reverse proxy, rate limiting, & SSL termination" },
        { step: 4, title: "Monitoring Core Engine", desc: "Node.js daemon evaluates thresholds & SSL expiry" },
        { step: 5, title: "n8n Workflow Engine", desc: "Webhook dispatcher with automated retry logic" },
        { step: 6, title: "Notifications & AI Agent", desc: "Realtime alerts via Telegram, WhatsApp, & AI summary" }
      ],
      responsibilities: [
        "Infrastructure setup & Docker containerization",
        "Nginx reverse proxy configuration with auto SSL renewal",
        "n8n automation workflow engine integration",
        "Telegram & WhatsApp notification alert pipeline",
        "Realtime server health check daemon in Node.js",
        "SSL expiration warning automation (30/7/1 day threshold)",
        "SonarQube code quality and security gate setup",
        "Prometheus & Grafana metrics visualization"
      ],
      results: [
        "Automated 24/7 multi-server health & SSL monitoring",
        "Instant downtime notification via Telegram & WhatsApp (<5 sec)",
        "99.9% reduction in undetected server outages",
        "Zero missed SSL expiration deadlines",
        "Reduced incident response time by 80%"
      ],
      learnings: {
        challenges: "Managing realtime health check connections for dozens of server nodes without memory overhead on the monitoring engine.",
        mistakes: "Initially conducted high-frequency HTTP polling without exponential backoff, which triggered false-positive alerts during network fluctuations.",
        solutions: "Implemented sliding window ping verification and streamed notification events through the n8n queue manager.",
        improvements: "Added automated AI agents to analyze server error logs and provide automated remediation recommendations."
      }
    },
    "naiq-shuttle-app": {
      shortDescription: "Mobile shuttle bus application for Toyota employees featuring live GPS tracking and QR check-in.",
      overview: {
        what: "Mobile application ecosystem (Employee Client & Driver App) for Toyota factory employee shuttle buses with live GPS tracking and QR Code check-in.",
        who: "Thousands of employees and company shuttle fleet drivers.",
        problemSolved: "Eliminates pickup bus location uncertainty and digitalizes passenger attendance logging accurately."
      },
      problem: "Employees were frequently late due to lack of visibility into the exact bus position, while fleet management struggled to monitor route compliance and driver pickup schedules.",
      architecture: [
        { step: 1, title: "Naiq Mobile Apps", desc: "Employee App (User) & Driver App" },
        { step: 2, title: "Firebase Realtime DB", desc: "Instant vehicle GPS coordinate synchronization" },
        { step: 3, title: "Laravel Backend API", desc: "Route management, accounts, schedules, & reporting" },
        { step: 4, title: "Google Maps Engine", desc: "Fastest route calculation, ETA, & geofencing" },
        { step: 5, title: "FCM Push Notifications", desc: "Automated alerts when shuttle approaches pickup stop" }
      ],
      responsibilities: [
        "Flutter & React Native mobile client development",
        "Real-time GPS location tracking implementation",
        "QR Code Scanner for instant passenger attendance",
        "Interactive map UI with custom route polyline",
        "Push notifications integration via FCM",
        "Offline storage buffering for unstable connection"
      ],
      results: [
        "Increased shuttle arrival punctuality by 40%",
        "100% digitalized passenger check-in system",
        "Realtime location tracking for shuttle fleet",
        "Reduced waiting time at pickup points by 15 mins"
      ],
      learnings: {
        challenges: "Minimizing excessive battery drain on Driver devices caused by continuous background GPS location tracking.",
        mistakes: "Queried high-accuracy GPS coordinates continuously even when the vehicle was stationary at traffic lights.",
        solutions: "Implemented motion-activity detection to dynamically adjust location update frequency based on movement state.",
        improvements: "Integrated AI predictive algorithms for travel time estimation based on historical traffic congestion."
      }
    },
    "kopkar-toyota": {
      shortDescription: "Toyota employee digital cooperative mobile app integrated with JumpStart & PIMA IoT Vending Machines.",
      overview: {
        what: "Integrated digital cooperative mobile application for Toyota employees featuring savings/loans, PPOB bill payments, Cafe POS, and cashless transactions at JumpStart & PIMA Vending Machines.",
        who: "Thousands of Toyota Employee Cooperative members.",
        problemSolved: "Fully digitalized cooperative transactions without cashier queues and eliminating cash requirements."
      },
      problem: "Canteen shopping and loan applications previously relied on physical paperwork that required multi-level manual verifications and long queues.",
      architecture: [
        { step: 1, title: "Flutter Member App", desc: "Mobile client for member balances & loan requests" },
        { step: 2, title: "Vending Machine IoT API", desc: "Integration with JumpStart & PIMA vending dispensers" },
        { step: 3, title: "PPOB & POS Gateway", desc: "Payment services for utilities, telecom, & cafe POS" },
        { step: 4, title: "Laravel Backend Engine", desc: "Cooperative accounting engine & payroll deduction" },
        { step: 5, title: "MySQL Database", desc: "Secure transaction storage & comprehensive audit trail" }
      ],
      responsibilities: [
        "End-to-end Flutter mobile app development",
        "API integration with JumpStart & PIMA Vending Machines",
        "POS Cafe cashier scanning & item inventory management",
        "PPOB transaction gateway implementation",
        "Financial statement & electronic receipt PDF generator"
      ],
      results: [
        "10,000+ active monthly digital transactions",
        "Cashless vending machine purchases factory-wide",
        "Automated monthly payroll deduction reporting",
        "Reduced queue time at cooperative store by 60%"
      ],
      learnings: {
        challenges: "Handling IoT Vending Machine connection timeouts when product dispensing experiences hardware signal drops.",
        mistakes: "Deducted user balances immediately before receiving hardware confirmation of successful product release.",
        solutions: "Implemented two-phase transaction authorization with idempotency keys and automatic balance rollback upon failure.",
        improvements: "Added biometric fingerprint authentication for high-value loan approvals."
      }
    },
    "evillage-smart-village": {
      shortDescription: "Smart village civic administration mobile app with self-service document requests and QR citizen reports.",
      overview: {
        what: "Citizen mobile app and digital administrative system for village governance, civil document applications, and community reporting with digital signatures.",
        who: "Village residents and village administrative apparatus.",
        problemSolved: "Eliminates citizen queues at the village hall by enabling paperless self-service document applications from home."
      },
      problem: "Residents had to take leave from work and visit the village office in person to obtain letters of certificate or administration, where physical paperwork often went missing.",
      architecture: [
        { step: 1, title: "Flutter Mobile App", desc: "Citizen portal for document requests & reports" },
        { step: 2, title: "Firebase Auth & Firestore", desc: "Secure resident identity database & realtime updates" },
        { step: 3, title: "Node.js Document Worker", desc: "Automated PDF certificate generator with QR verification" },
        { step: 4, title: "Cloud Storage", desc: "Secure cloud repository for resident IDs & documents" },
        { step: 5, title: "FCM Push Notifications", desc: "Instant status updates when documents are approved" }
      ],
      responsibilities: [
        "Fullstack Flutter mobile app architecture & development",
        "Firebase Firestore schema design & security rules setup",
        "Automated PDF document template generator",
        "QR Code verification system for civil certificates",
        "Citizen incident reporting module with photo uploads"
      ],
      results: [
        "5,000+ registered active village residents",
        "Over 12,000 digital civil certificates processed",
        "Reduced document processing turnaround from 3 days to under 1 hour",
        "85% reduction in physical paperwork volume"
      ],
      learnings: {
        challenges: "Designing an intuitive mobile interface that elderly residents with varying digital literacy could easily navigate.",
        mistakes: "Initially used complex multi-step application forms that caused high drop-off rates.",
        solutions: "Redesigned the flow into guided 3-step wizards with voice assistance and camera auto-cropping for document scanning.",
        improvements: "Integrated official digital identity verification (Dukcapil) with e-KTP card readers."
      }
    },
    "elkopra-financial-system": {
      shortDescription: "PWA & web-based financial ledger and cooperative operational platform for multi-branch organizations.",
      overview: {
        what: "Comprehensive cooperative financial system and Progressive Web App (PWA) managing member accounts, savings schemes, loan underwriting, and automated financial journals.",
        who: "Cooperative management boards, credit committees, and branch accountants.",
        problemSolved: "Automates complex double-entry cooperative accounting and enforces credit risk management."
      },
      problem: "Manual spreadsheet calculations resulted in reconciliation errors between branches, delayed financial reports, and high default risks due to lack of credit scoring.",
      architecture: [
        { step: 1, title: "PWA & Web Client", desc: "Responsive cross-platform interface for branch officers" },
        { step: 2, title: "Nginx Gateway", desc: "SSL termination, caching, & HTTP/2 reverse proxy" },
        { step: 3, title: "Laravel Core System", desc: "Double-entry bookkeeping engine & loan calculations" },
        { step: 4, title: "MySQL Enterprise", desc: "Relational database with transactional isolation" },
        { step: 5, title: "Docker Environment", desc: "Containerized deployment with automated daily backups" }
      ],
      responsibilities: [
        "End-to-end fullstack web & PWA architecture",
        "Double-entry general ledger and automated journal posting",
        "Amortization loan repayment calculator engine",
        "Docker Swarm deployment and Nginx reverse proxy configuration",
        "Automated off-site database backup pipeline"
      ],
      results: [
        "Consolidated 5 cooperative branch books into one unified ledger",
        "Zero calculation discrepancies across annual audits",
        "Reduced month-end closing period from 14 days to 1 day",
        "99.9% uptime maintained with automated Docker health checks"
      ],
      learnings: {
        challenges: "Ensuring database transactions remain completely ACID-compliant during concurrent loan disbursements across multiple branches.",
        mistakes: "Used optimistic locking on balance updates without proper queue serialization during peak payment windows.",
        solutions: "Implemented pessimistic database row locks and wrapped financial mutations in strict database transactions.",
        improvements: "Automated payment gateway integration for instant virtual account loan repayments."
      }
    },
    "spendora-finance-app": {
      shortDescription: "Personal finance and budget tracking mobile app with AI expense categorization and financial analytics.",
      overview: {
        what: "Modern personal finance tracking mobile app enabling users to manage budgets, categorize daily expenditures, and visualize cash flow trends.",
        who: "Individuals and professionals aiming to take control of their financial health.",
        problemSolved: "Helps users understand their spending habits through intelligent insights and automated monthly budgets."
      },
      problem: "Traditional expense tracker apps are tedious to maintain, lack actionable visualizations, and fail to prevent overspending before budgets run out.",
      architecture: [
        { step: 1, title: "Flutter iOS & Android", desc: "Smooth 60fps mobile interface with dark mode" },
        { step: 2, title: "SQLite / Hive Local DB", desc: "Fast offline-first local encrypted storage" },
        { step: 3, title: "REST Backend API", desc: "Cloud sync and analytics calculation services" },
        { step: 4, title: "Chart Analytics Engine", desc: "Interactive cash flow visualizations & breakdown graphs" }
      ],
      responsibilities: [
        "Flutter mobile application architecture & UI/UX implementation",
        "Offline-first local caching architecture with Hive",
        "Custom financial chart visualization components",
        "Category-based budget alert and notification system",
        "Export reports to PDF & Excel format"
      ],
      results: [
        "Over 15,000 organic downloads across mobile stores",
        "4.8/5.0 average user rating on app store",
        "Average 25% user monthly savings increase reported by active users",
        "Sub-100ms offline transaction logging speed"
      ],
      learnings: {
        challenges: "Rendering complex interactive financial charts with thousands of data points smoothly on low-end smartphones.",
        mistakes: "Re-calculating monthly aggregations on the main UI thread whenever transactions were added.",
        solutions: "Offloaded heavy data calculations to Dart worker isolates and implemented smart data windowing.",
        improvements: "AI receipt OCR scanning to log transactions automatically by photographing paper receipts."
      }
    },
    "cicd-swarm-infrastructure": {
      shortDescription: "Automated CI/CD deployment pipelines orchestrating high-availability Docker Swarm multi-node clusters.",
      overview: {
        what: "Production-grade CI/CD automation pipeline powered by GitHub Actions, private container registries, and automated rolling deployments across Docker Swarm clusters.",
        who: "Development teams, operations engineers, and enterprise stakeholders requiring zero-downtime releases.",
        problemSolved: "Eliminates risky manual SSH deployments and provides automated rollback mechanisms for production stability."
      },
      problem: "Deployments were executed manually via SSH terminals, leading to human configuration errors, unpredictable downtimes during updates, and lack of version traceability.",
      architecture: [
        { step: 1, title: "Git Push / Release", desc: "Triggers automated GitHub Actions workflow" },
        { step: 2, title: "Automated Test & SAST", desc: "Runs unit tests, linting, & SonarQube quality gate" },
        { step: 3, title: "Docker Multi-Stage Build", desc: "Creates lightweight secure images & pushes to registry" },
        { step: 4, title: "Docker Swarm CD Agent", desc: "Executes rolling update across manager & worker nodes" },
        { step: 5, title: "Health Check Verification", desc: "Validates endpoint health before deprecating old containers" }
      ],
      responsibilities: [
        "GitHub Actions CI/CD workflow pipeline design & scripting",
        "Multi-node Docker Swarm cluster provisioning & hardening",
        "Rolling deployment configuration with zero downtime",
        "Private Docker registry setup with image vulnerability scanning",
        "Automated health checks and self-healing container policies"
      ],
      results: [
        "Achieved 100% zero-downtime production deployments",
        "Reduced deployment cycle time from 45 minutes to 3.5 minutes",
        "Deployed over 50+ microservice updates with zero human SSH interventions",
        "Instant automated rollback triggered if health checks fail"
      ],
      learnings: {
        challenges: "Coordinating zero-downtime rolling updates on stateful database services without transaction interrupts.",
        mistakes: "Updated cluster services simultaneously rather than sequentially using health check wait delays.",
        solutions: "Configured Swarm rolling update parallelism with update-delay and health check grace periods.",
        improvements: "GitOps automation using ArgoCD / Portainer webhooks for declarative cluster management."
      }
    },
    "reverse-proxy-ssl-infrastructure": {
      shortDescription: "Centralized Nginx reverse proxy architecture with automated Certbot SSL renewal and rate-limiting.",
      overview: {
        what: "High-performance centralized Nginx gateway acting as a reverse proxy, SSL termination layer, load balancer, and web application firewall (WAF) for multiple domain services.",
        who: "Enterprise applications requiring secure external traffic management and DDoS mitigation.",
        problemSolved: "Centralizes SSL certificate management, prevents expired SSL outages, and protects internal services from malicious bots."
      },
      problem: "Each server service managed its own SSL certificates manually, leading to expired certificate warnings for customers and inconsistent security headers.",
      architecture: [
        { step: 1, title: "Public Traffic / Cloudflare", desc: "DNS routing & DDoS mitigation layer" },
        { step: 2, title: "Nginx Gateway", desc: "Centralized reverse proxy with TLS 1.3 & HSTS" },
        { step: 3, title: "Certbot SSL Daemon", desc: "Automated Let's Encrypt renewal with zero downtime" },
        { step: 4, title: "Security Header Policies", desc: "Enforces CSP, X-Frame, XSS, & rate limiting rules" },
        { step: 5, title: "Internal Docker Network", desc: "Routes traffic cleanly to isolated container ports" }
      ],
      responsibilities: [
        "Nginx reverse proxy architecture & performance tuning",
        "Automated Let's Encrypt SSL certificate renewal pipelines",
        "Implementation of strict security headers (HSTS, CSP, X-Frame-Options)",
        "Rate limiting and burst protection against brute-force attacks",
        "HTTP/2 and gzip/brotli compression optimization"
      ],
      results: [
        "A+ rating achieved on SSL Labs security audits",
        "Zero downtime caused by SSL certificate expiration",
        "Sub-15ms proxy latency across all routed applications",
        "Over 1 million daily requests routed seamlessly"
      ],
      learnings: {
        challenges: "Managing automated SSL challenge validation for dozens of subdomains behind Cloudflare proxies.",
        mistakes: "Relying solely on HTTP-01 challenges which occasionally timed out during proxy propagation.",
        solutions: "Adopted DNS-01 validation with automated API tokens and optimized Nginx reload hooks.",
        improvements: "Integrating ModSecurity / OWASP Core Rule Set directly into the Nginx container image."
      }
    },
    "sonarqube-code-quality-gate": {
      shortDescription: "DevSecOps static analysis (SAST) and dynamic scanning (DAST) pipelines with automated quality gates.",
      overview: {
        what: "Continuous security testing integration combining SonarQube SAST (Static Application Security Testing) and OWASP ZAP DAST (Dynamic Application Security Testing) within CI/CD pipelines.",
        who: "Software engineering teams and DevSecOps professionals demanding secure code before deployment.",
        problemSolved: "Prevents code vulnerabilities, security holes, and code smells from reaching production environments."
      },
      problem: "Security vulnerabilities and code quality flaws were only discovered post-production or during infrequent manual penetration testing audits.",
      architecture: [
        { step: 1, title: "Developer Pull Request", desc: "Triggers automated security analysis workflow" },
        { step: 2, title: "SonarQube SAST Scanner", desc: "Inspects source code for OWASP Top 10 flaws & debt" },
        { step: 3, title: "Quality Gate Evaluation", desc: "Enforces 0 blocker bugs, 0 vulnerabilities threshold" },
        { step: 4, title: "OWASP ZAP DAST", desc: "Executes automated dynamic endpoint penetration test" },
        { step: 5, title: "Automated Report & Alert", desc: "Notifies team via PR comments and Telegram alerts" }
      ],
      responsibilities: [
        "SonarQube enterprise server deployment and configuration",
        "Custom Quality Gate threshold rules definition",
        "GitHub Actions CI integration with SonarScanner CLI",
        "OWASP ZAP dynamic baseline and full scan implementation",
        "Developer security training and vulnerability remediation guidance"
      ],
      results: [
        "100% of pull requests validated through automated Quality Gates",
        "Identified and remediated 45+ critical and high vulnerabilities pre-production",
        "Reduced technical debt by 65% across core repositories",
        "Established zero-tolerance policy for critical CVEs in production"
      ],
      learnings: {
        challenges: "Balancing strict security rules without causing alert fatigue or blocking developer release velocity unnecessarily.",
        mistakes: "Initially set overly aggressive false-positive-prone rules that frustrated frontend development teams.",
        solutions: "Calibrated rule profiles focusing strictly on high-impact OWASP Top 10 vulnerabilities first.",
        improvements: "Adding Software Bill of Materials (SBOM) and dependency scanning via Trivy."
      }
    },
    "erp-kopkar-toyota": {
      shortDescription: "Enterprise ERPNext & Frappe infrastructure for Toyota Employee Cooperative with automated backups.",
      overview: {
        what: "Centralized ERP infrastructure hosting Frappe & ERPNext for Toyota Employee Cooperative, covering supply chain, accounting, inventory, and payroll systems.",
        who: "Cooperative management, financial auditors, warehouse operators, and retail staff.",
        problemSolved: "Consolidates multi-unit business processes onto an enterprise-grade open-source ERP platform."
      },
      problem: "Disparate software tools for accounting, cafe sales, and vending machines caused data silos, manual reconciliation nightmares, and lost productivity.",
      architecture: [
        { step: 1, title: "Frappe / ERPNext Core", desc: "Modular enterprise Python backend & web desk" },
        { step: 2, title: "Redis Cache & Queue", desc: "Session storage & background task worker queues" },
        { step: 3, title: "MariaDB Enterprise", desc: "Optimized database with InnoDB transactional engine" },
        { step: 4, title: "Nginx & SSL Proxy", desc: "High-speed static asset serving & secure TLS" },
        { step: 5, title: "Automated Backup Daemon", desc: "Encrypted daily database & site snapshots" }
      ],
      responsibilities: [
        "Frappe bench and ERPNext multi-container architecture",
        "MariaDB performance tuning and custom buffer configurations",
        "Automated daily and weekly offsite backup pipelines",
        "Nginx reverse proxy configuration with WebSocket support",
        "System security hardening, firewall setup, and fail2ban rules"
      ],
      results: [
        "Unified 6 business units onto a single ERP source of truth",
        "Zero data loss with automated daily encrypted backups",
        "99.95% system uptime over 2+ consecutive years",
        "Seamless processing of 50,000+ monthly financial transactions"
      ],
      learnings: {
        challenges: "Tuning MariaDB and Frappe Redis workers on limited VPS resources to handle sudden month-end payroll spikes.",
        mistakes: "Under-allocated Redis queue workers, which delayed asynchronous invoice email deliveries during peak hours.",
        solutions: "Separated Redis cache and Redis queue instances and scaled Frappe worker threads.",
        improvements: "Clustering MariaDB with Galera for active-active high availability."
      }
    },
    "erp-itekraf": {
      shortDescription: "Itekraf enterprise ERP infrastructure with containerized Frappe, auto SSL, and VPS hardening.",
      overview: {
        what: "Production ERP deployment for Itekraf using Frappe and ERPNext, tailored for enterprise resource planning, financial control, and multi-currency operations.",
        who: "Corporate management, finance teams, and operational project managers.",
        problemSolved: "Delivers a scalable ERP system backed by automated cloud infrastructure and security hardening."
      },
      problem: "Company operations were scaling rapidly, requiring an agile ERP system that could be deployed quickly without expensive proprietary license fees.",
      architecture: [
        { step: 1, title: "VPS Cloud Node", desc: "Hardened Linux server with SSH keys & UFW firewall" },
        { step: 2, title: "Dockerized Frappe", desc: "Isolated services for app, web, socketio, & workers" },
        { step: 3, title: "MariaDB Service", desc: "Dedicated database container with persistent volumes" },
        { step: 4, title: "Nginx Reverse Proxy", desc: "Certbot auto-renewing SSL & gzip compression" }
      ],
      responsibilities: [
        "Cloud VPS setup, user permission policies, & firewall hardening",
        "Docker-based ERPNext / Frappe multi-service containerization",
        "Automated SSL provisioning and domain routing",
        "Performance optimization and MariaDB index tuning",
        "Periodic disaster recovery drills and snapshot testing"
      ],
      results: [
        "Deployed production-ready ERP system in under 2 weeks",
        "Reduced software operational licensing costs by 80%",
        "Zero security incidents or unauthorized access attempts",
        "Fast page load times averaging under 400ms"
      ],
      learnings: {
        challenges: "Managing safe version upgrades for Frappe bench across major framework versions without schema conflicts.",
        mistakes: "Upgrading core modules directly on production without staging schema test migrations.",
        solutions: "Instituted a staging environment clone workflow where migrations are verified before production execution.",
        improvements: "Integrating Prometheus exporters to monitor ERP container CPU and memory usage in real time."
      }
    }
  };

  // State
  let currentLanguage = localStorage.getItem(STORAGE_KEY) || "id";

  // Helper to retrieve nested object value by dot path
  function getNestedValue(obj, path) {
    if (!obj || !path) return "";
    return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj) || "";
  }

  // Get current language
  function getLanguage() {
    return currentLanguage;
  }

  // Get translated UI string
  function t(key) {
    const langDict = I18N_DICTIONARY[currentLanguage] || I18N_DICTIONARY.id;
    let val = getNestedValue(langDict, key);
    if (!val && currentLanguage !== "id") {
      val = getNestedValue(I18N_DICTIONARY.id, key);
    }
    return val || key;
  }

  // Get localized project data
  function getLocalizedProject(project) {
    if (!project) return null;
    if (currentLanguage === "id") {
      return project; // Default in projects-data.js is Indonesian
    }

    const enData = PROJECTS_EN_TRANSLATIONS[project.id] || PROJECTS_EN_TRANSLATIONS[project.slug];
    if (!enData) return project;

    return {
      ...project,
      shortDescription: enData.shortDescription || project.shortDescription,
      overview: {
        what: (enData.overview && enData.overview.what) || (project.overview && project.overview.what),
        who: (enData.overview && enData.overview.who) || (project.overview && project.overview.who),
        problemSolved: (enData.overview && enData.overview.problemSolved) || (project.overview && project.overview.problemSolved)
      },
      problem: enData.problem || project.problem,
      architecture: enData.architecture && enData.architecture.length
        ? project.architecture.map((orig, idx) => ({
            ...orig,
            title: (enData.architecture[idx] && enData.architecture[idx].title) || orig.title,
            desc: (enData.architecture[idx] && enData.architecture[idx].desc) || orig.desc
          }))
        : project.architecture,
      responsibilities: enData.responsibilities || project.responsibilities,
      results: enData.results || project.results,
      learnings: {
        challenges: (enData.learnings && enData.learnings.challenges) || (project.learnings && project.learnings.challenges),
        mistakes: (enData.learnings && enData.learnings.mistakes) || (project.learnings && project.learnings.mistakes),
        solutions: (enData.learnings && enData.learnings.solutions) || (project.learnings && project.learnings.solutions),
        improvements: (enData.learnings && enData.learnings.improvements) || (project.learnings && project.learnings.improvements)
      }
    };
  }

  // Update all DOM elements with data-i18n attributes
  function updateDOMTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    const htmlElements = document.querySelectorAll("[data-i18n-html]");
    htmlElements.forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const translation = t(key);
      if (translation) {
        el.innerHTML = translation;
      }
    });

    // Update document title and metadata
    document.title = t("meta.title");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("meta.description"));

    // Update HTML lang attribute
    document.documentElement.setAttribute("lang", currentLanguage);

    // Update Switcher buttons visual active state
    updateSwitcherButtonsUI();
  }

  // Update switcher visual active states (both desktop & mobile)
  function updateSwitcherButtonsUI() {
    const switchers = document.querySelectorAll(".lang-switcher");
    switchers.forEach((container) => {
      const btnID = container.querySelector('[data-lang="id"]');
      const btnEN = container.querySelector('[data-lang="en"]');
      
      if (btnID && btnEN) {
        if (currentLanguage === "id") {
          btnID.classList.add("bg-white", "dark:bg-dark-surface", "shadow-sm", "opacity-100", "scale-105");
          btnID.classList.remove("opacity-40", "hover:opacity-75");
          btnEN.classList.remove("bg-white", "dark:bg-dark-surface", "shadow-sm", "opacity-100", "scale-105");
          btnEN.classList.add("opacity-40", "hover:opacity-75");
        } else {
          btnEN.classList.add("bg-white", "dark:bg-dark-surface", "shadow-sm", "opacity-100", "scale-105");
          btnEN.classList.remove("opacity-40", "hover:opacity-75");
          btnID.classList.remove("bg-white", "dark:bg-dark-surface", "shadow-sm", "opacity-100", "scale-105");
          btnID.classList.add("opacity-40", "hover:opacity-75");
        }
      }
    });
  }

  // Set active language and trigger updates
  function setLanguage(lang) {
    if (lang !== "id" && lang !== "en") return;
    currentLanguage = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn("Could not persist language preference to localStorage", e);
    }

    updateDOMTranslations();

    // Dispatch global event for other scripts (like portfolio.js) to re-render
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: currentLanguage }
      })
    );
  }

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    updateDOMTranslations();

    // Attach click listeners to all language buttons
    document.querySelectorAll(".lang-switcher button[data-lang]").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const targetLang = this.getAttribute("data-lang");
        if (targetLang && targetLang !== currentLanguage) {
          setLanguage(targetLang);
        }
      });
    });
  });

  // Expose global i18n object
  window.i18n = {
    getLanguage,
    setLanguage,
    t,
    getLocalizedProject,
    DICTIONARY: I18N_DICTIONARY,
    PROJECTS_EN: PROJECTS_EN_TRANSLATIONS
  };
})();
