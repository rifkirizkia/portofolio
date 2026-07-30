/**
 * Portfolio Case Studies Data Source
 * Centralized data storage for all portfolio items and case studies.
 * Update this file to add, modify, or remove projects without editing UI components.
 */

const PROJECTS_DATA = [
  // 1. WEB DEVELOPMENT (Server & Website Monitoring Platform)
  {
    id: "website-monitoring-platform",
    slug: "website-monitoring-platform",
    title: "Server Monitoring Platform",
    category: "web",
    categoryLabel: "Web Development",
    role: "Fullstack & DevOps",
    status: "Production",
    timeline: "2026 - 2026",
    isFeatured: true,
    thumbnailUrl: "asset/7.png",
    shortDescription: "Platform web pemantauan server & website multi-node realtime terintegrasi dengan alert Telegram, WhatsApp, & AI Assistant.",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "Node.js", icon: "ri-nodejs-line", color: "text-green-500" },
      { name: "React", icon: "ri-reactjs-line", color: "text-cyan-400" },
      { name: "Docker", icon: "ri-box-3-line", color: "text-blue-500" },
      { name: "Nginx", icon: "ri-global-line", color: "text-emerald-500" },
      { name: "n8n", icon: "ri-loop-left-line", color: "text-red-500" },
      { name: "Linux", icon: "ri-terminal-box-line", color: "text-slate-400" },
      { name: "Cloudflare", icon: "ri-cloud-line", color: "text-orange-400" },
      { name: "PostgreSQL", icon: "ri-database-2-line", color: "text-blue-400" }
    ],
    overview: {
      what: "Platform web SaaS dan internal monitoring server untuk memantau uptime, latency, CPU/Memory load, serta masa berlaku sertifikat SSL dari puluhan endpoint server secara terpusat.",
      who: "Tim IT operations, System Administrator, dan DevOps Engineers yang mengelola infrastruktur multi-server.",
      problemSolved: "Mencegah terjadinya downtime tanpa terdeteksi dengan memberikan notifikasi seketika via Telegram dan WhatsApp ketika terjadi kegagalan server atau SSL mendekati kadaluwarsa."
    },
    problem: "Sebelumnya, pemantauan kesehatan server dilakukan secara manual dan terpisah tanpa adanya sistem notifikasi terpusat. Ketika server mengalami downtime di luar jam kerja, tim IT tidak segera mengetahuinya, berpotensi menimbulkan kerugian pada operasional bisnis.",
    architecture: [
      { step: 1, title: "Managed Nodes", icon: "ri-server-line", desc: "Server agen melakukan health check ping & kirim metrics" },
      { step: 2, title: "Cloudflare Proxy", icon: "ri-global-line", desc: "Routing DNS aman dengan WAF & SSL protection" },
      { step: 3, title: "Nginx Gateway", icon: "ri-shield-keyhole-line", desc: "Reverse proxy, rate limiting, & SSL termination" },
      { step: 4, title: "Monitoring Core Engine", icon: "ri-node-tree", desc: "Daemon Node.js mengevaluasi threshold & SSL expiry" },
      { step: 5, title: "n8n Workflow Engine", icon: "ri-loop-left-line", desc: "Webhook dispatcher dengan retry logic" },
      { step: 6, title: "Notifications & AI Agent", icon: "ri-notification-3-line", desc: "Realtime alert via Telegram, WhatsApp, & AI logs summary" }
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
    gallery: [
      { title: "Monitoring Dashboard", image: "asset/7.png", category: "Dashboard" },
      { title: "Server Health Topology", image: "asset/7.png", category: "Architecture" },
      { title: "n8n Automation Pipeline", image: "asset/7.png", category: "CI/CD Pipeline" },
      { title: "Telegram & WhatsApp Alerts", image: "asset/7.png", category: "Notifications" }
    ],
    learnings: {
      challenges: "Mengelola koneksi realtime healthcheck untuk puluhan node server tanpa menimbulkan overhead beban memori pada engine monitoring.",
      mistakes: "Awalnya melakukan HTTP polling frekuensi tinggi tanpa exponential backoff, yang sempat memicu false-positive alarm saat kestabilan jaringan berfluktuasi.",
      solutions: "Mengimplementasikan sliding window ping verification dan mengalirkan event notifikasi melalui n8n queue manager.",
      improvements: "Menambahkan agen AI otomatis untuk menganalisis log error server dan memberikan saran tindakan perbaikan secara otomatis."
    }
  },

  // 2. MOBILE DEVELOPMENT - NAIQ SHUTTLE
  {
    id: "naiq-shuttle-app",
    slug: "naiq-shuttle-app",
    title: "Naiq",
    category: "mobile",
    categoryLabel: "Mobile Development",
    role: "Mobile Developer",
    status: "Production",
    timeline: "2023 - 2024",
    isFeatured: true,
    thumbnailUrl: "asset/4.png",
    shortDescription: "Aplikasi mobile antar-jemput karyawan armada bus Toyota dengan pemantauan live GPS tracking dan QR check-in.",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "Flutter", icon: "ri-code-s-slash-line", color: "text-blue-400" },
      { name: "React Native", icon: "ri-reactjs-line", color: "text-cyan-400" },
      { name: "Firebase", icon: "ri-database-2-line", color: "text-amber-500" },
      { name: "Laravel", icon: "ri-code-line", color: "text-red-500" },
      { name: "Google Maps API", icon: "ri-map-pin-2-line", color: "text-green-500" },
      { name: "REST API", icon: "ri-api-line", color: "text-purple-400" }
    ],
    overview: {
      what: "Ekosistem aplikasi mobile (Client Karyawan & Driver App) untuk penjemputan armada bus karyawan pabrik Toyota dengan fitur live tracking GPS dan QR Code check-in.",
      who: "Ribuan karyawan dan pengemudi armada shuttle perusahaan.",
      problemSolved: "Menghilangkan ketidakpastian posisi mobil jemputan dan mengotomatiskan pencatatan kehadiran penumpang secara akurat."
    },
    problem: "Karyawan sering terlambat bekerja akibat tidak tahu posisi persis mobil jemputan, sementara manajemen armada kesulitan memantau kepatuhan rute dan jam penjemputan pengemudi.",
    architecture: [
      { step: 1, title: "Naiq Mobile Apps", icon: "ri-smartphone-line", desc: "Aplikasi Karyawan (User) & Driver App" },
      { step: 2, title: "Firebase Realtime DB", icon: "ri-database-2-line", desc: "Sinkronisasi posisi GPS kendaraan secara instan" },
      { step: 3, title: "Laravel Backend API", icon: "ri-server-line", desc: "Manajemen rute, akun, jadwal, & laporan" },
      { step: 4, title: "Google Maps Engine", icon: "ri-map-pin-2-line", desc: "Routing rute tercepat, ETA, & geofencing" },
      { step: 5, title: "FCM Push Notifications", icon: "ri-notification-line", desc: "Alert otomatis saat shuttle mendekati lokasi penjemputan" }
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
    gallery: [
      { title: "Naiq User Interface", image: "asset/4.png", category: "Dashboard" },
      { title: "Naiq Driver Live Tracking", image: "asset/5.png", category: "Monitoring" }
    ],
    learnings: {
      challenges: "Mengurangi konsumsi baterai berlebih pada HP Driver akibat tracking GPS latar belakang (background location) sepanjang perjalanan.",
      mistakes: "Memanggil lokasi high-accuracy secara konstan walaupun posisi mobil dalam keadaan berhenti di lampu merah.",
      solutions: "Mengimplementasikan motion-activity detector untuk menyesuaikan frekuensi update lokasi berdasarkan kondisi pergerakan kendaraan.",
      improvements: "Integrasi algoritma AI untuk estimasi waktu tempuh berdasarkan kondisi kemacetan historis."
    }
  },

  // 3. MOBILE DEVELOPMENT - KOPKAR TOYOTA
  {
    id: "kopkar-toyota",
    slug: "kopkar-toyota",
    title: "Kopkar Toyota",
    category: "mobile",
    categoryLabel: "Mobile Development",
    role: "Mobile Developer",
    status: "Production",
    timeline: "2023 - 2024",
    isFeatured: true,
    thumbnailUrl: "asset/3.png",
    shortDescription: "Aplikasi mobile koperasi digital karyawan Toyota terintegrasi dengan Vending Machine IoT JumpStart & PIMA.",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "Flutter", icon: "ri-code-s-slash-line", color: "text-blue-400" },
      { name: "Laravel", icon: "ri-code-line", color: "text-red-500" },
      { name: "MySQL", icon: "ri-database-line", color: "text-sky-500" },
      { name: "Vending IoT API", icon: "ri-cpu-line", color: "text-emerald-400" },
      { name: "PPOB Gateway", icon: "ri-shopping-cart-2-line", color: "text-amber-400" }
    ],
    overview: {
      what: "Aplikasi mobile koperasi karyawan Toyota terpadu dengan fitur simpan-pinjam, pembayaran PPOB, POS Cafe, serta transaksi di Vending Machine JumpStart & PIMA.",
      who: "Ribuan anggota Koperasi Karyawan Toyota.",
      problemSolved: "Digitalisasi total transaksi koperasi karyawan tanpa antrean kasir dan tanpa membutuhkan uang tunai (cashless)."
    },
    problem: "Proses belanja kantin dan permohonan pinjaman sebelumnya menggunakan kertas fisik yang membutuhkan proses verifikasi bertingkat dan antrean panjang.",
    architecture: [
      { step: 1, title: "Flutter Member App", icon: "ri-smartphone-line", desc: "Aplikasi mobile untuk saldo & pinjaman anggota" },
      { step: 2, title: "Vending Machine IoT API", icon: "ri-cpu-line", desc: "Integrasi sistem dispenser vending JumpStart & PIMA" },
      { step: 3, title: "PPOB & POS Gateway", icon: "ri-shopping-cart-line", desc: "Layanan pembayaran pulsa, PLN, & kasir cafe" },
      { step: 4, title: "Laravel Backend Engine", icon: "ri-server-line", desc: "Sistem pencatatan akuntansi & payroll deduction" },
      { step: 5, title: "MySQL Database", icon: "ri-database-line", desc: "Penyimpanan data transaksi & audit trail aman" }
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
    gallery: [
      { title: "Kopkar Mobile Member Dashboard", image: "asset/3.png", category: "Dashboard" }
    ],
    learnings: {
      challenges: "Menangani batas waktu (timeout) koneksi Vending Machine IoT ketika dispensing barang terjadi ganguan sinyal.",
      mistakes: "Langsung memotong saldo pengguna sebelum konfirmasi hardware vending machine mengeluarkan produk.",
      solutions: "Menerapkan dua langkah otorisasi transaksi dengan idempotency key dan auto-rollback saldo jika dispensasi gagal.",
      improvements: "Penambahan otentikasi biometrik sidik jari untuk persetujuan pinjaman dana besar."
    }
  },

  // 4. MOBILE DEVELOPMENT - EVILLAGE (NOW MOBILE)
  {
    id: "evillage-smart-village",
    slug: "evillage-smart-village",
    title: "Evillage",
    category: "mobile",
    categoryLabel: "Mobile Development",
    role: "Mobile Developer",
    status: "Production",
    timeline: "2023",
    isFeatured: true,
    thumbnailUrl: "asset/1.png",
    shortDescription: "Aplikasi mobile pelayanan administrasi kependudukan desa, pengajuan surat mandiri & pelaporan warga berbasis QR Code.",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "Flutter", icon: "ri-code-s-slash-line", color: "text-blue-400" },
      { name: "Firebase", icon: "ri-fire-line", color: "text-amber-500" },
      { name: "Firestore", icon: "ri-database-2-line", color: "text-orange-400" },
      { name: "Node.js", icon: "ri-nodejs-line", color: "text-green-500" },
      { name: "PDF Engine", icon: "ri-file-pdf-line", color: "text-red-400" }
    ],
    overview: {
      what: "Aplikasi mobile layanan desa digital untuk memfasilitasi pengajuan surat publik online mandiri dari smartphone warga, verifikasi tanda tangan digital QR Code, dan pelaporan pengaduan warga.",
      who: "Masyarakat warga desa dan perangkat pemerintahan desa.",
      problemSolved: "Memangkas waktu pengurusan surat keterangan desa dari hitungan hari menjadi hitungan menit langsung dari HP warga."
    },
    problem: "Warga terpaksa bolak-balik ke kantor desa hanya untuk membuat surat pengantar sederhana, yang seringkali terkendala keberadaan petugas di tempat.",
    architecture: [
      { step: 1, title: "Citizen Mobile App", icon: "ri-smartphone-line", desc: "Warga mengajukan permohonan surat & pengaduan" },
      { step: 2, title: "Firebase Backend Engine", icon: "ri-fire-line", desc: "Auth, Firestore NoSQL DB, & Storage berkas" },
      { step: 3, title: "Verification Gateway", icon: "ri-shield-check-line", desc: "Validasi tanda tangan digital QR Code & NIK kependudukan" },
      { step: 4, title: "PDF Document Generator", icon: "ri-file-pdf-line", desc: "Generasi surat resmi bertanda tangan digital otomatis" }
    ],
    responsibilities: [
      "Flutter Mobile application design & development",
      "Firebase Firestore database schema design",
      "Dynamic PDF letter generator implementation",
      "QR Code digital signature verification system",
      "Public complaint tracking & status notifications"
    ],
    results: [
      "Letter processing time reduced from 2 days to 5 minutes",
      "100% digitalized document archiving system",
      "Zero physical paper wastage for administrative forms",
      "Realtime community report notification system"
    ],
    gallery: [
      { title: "Evillage Citizen Mobile App", image: "asset/1.png", category: "Dashboard" }
    ],
    learnings: {
      challenges: "Mendesain interface aplikasi mobile yang simpel agar ramah digunakan oleh warga senior/lansia.",
      mistakes: "Awalnya menggunakan ukuran font dan tombol yang terlalu kecil untuk form permohonan.",
      solutions: "Menerapkan prinsip UI accessible dengan ukuran font dinamis dan panduan audio/ikon jelas.",
      improvements: "Integrasi ke WhatsApp Gateway untuk otomatisasi pengiriman berkas surat yang sudah selesai."
    }
  },

  // 5. MOBILE DEVELOPMENT - ELKOPRA (NOW SEPARATED & MOBILE)
  {
    id: "elkopra-financial-system",
    slug: "elkopra-financial-system",
    title: "Elkopra",
    category: "mobile",
    categoryLabel: "Mobile Development",
    role: "Mobile Developer",
    status: "Production",
    timeline: "2023 - 2024",
    isFeatured: true,
    thumbnailUrl: "asset/2.png",
    shortDescription: "Aplikasi mobile manajemen keuangan dan ERP akuntansi koperasi terpadu dengan pencatatan jurnal otomatis dan neraca saldo.",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "Flutter", icon: "ri-code-s-slash-line", color: "text-blue-400" },
      { name: "Firebase", icon: "ri-fire-line", color: "text-amber-500" },
      { name: "Chart.js", icon: "ri-bar-chart-box-line", color: "text-pink-400" },
      { name: "Node.js", icon: "ri-nodejs-line", color: "text-green-500" },
      { name: "MySQL", icon: "ri-database-line", color: "text-sky-500" }
    ],
    overview: {
      what: "Aplikasi mobile sistem ERP akuntansi koperasi dengan fitur jurnal transaksi otomatis, neraca keuangan realtime, laporan laba rugi, dan audit saldo anggota.",
      who: "Pengurus koperasi, kasir, dan pengawas keuangan instansi.",
      problemSolved: "Menyajikan laporan keuangan standar akuntansi secara otomatis tanpa menuntut keahlian pembukuan manual yang rumit."
    },
    problem: "Pencatatan transaksi koperasi secara manual sering menimbulkan selisih kas, keterlambatan laporan bulanan, dan ketidaktransparanan saldo anggota.",
    architecture: [
      { step: 1, title: "Flutter Mobile App", icon: "ri-smartphone-line", desc: "Input transaksi kasir, simpanan, & tagihan pinjaman" },
      { step: 2, title: "Double-Entry Engine", icon: "ri-calculator-line", desc: "Kalkulasi otomatis jurnal debit/kredit & ledger" },
      { step: 3, title: "Node.js Backend API", icon: "ri-server-line", desc: "Otorisasi transaksi, enkripsi data, & audit trail" },
      { step: 4, title: "Financial Reports Engine", icon: "ri-bar-chart-line", desc: "Grafik Laba Rugi, Cashflow, & PDF Exporter" }
    ],
    responsibilities: [
      "Flutter mobile UI/UX development",
      "Double-entry bookkeeping automation logic",
      "Interactive analytical chart rendering",
      "PDF & Excel financial report generator"
    ],
    results: [
      "Instant real-time financial statements (Profit/Loss & Balance Sheet)",
      "Zero accounting calculation error rate",
      "Automated financial health score indicator"
    ],
    gallery: [
      { title: "Elkopra Mobile ERP Interface", image: "asset/2.png", category: "Dashboard" }
    ],
    learnings: {
      challenges: "Menjaga ketelitian kalkulasi nilai angka desimal mata uang pada volume ribuan transaksi bulanan.",
      mistakes: "Menggunakan tipe data floating point standar JavaScript yang dapat menyebabkan kesalahan pembulatan sen/rupiah.",
      solutions: "Menggunakan library komputasi presisi tinggi untuk perhitungan finansial.",
      improvements: "Integrasi Open Banking API untuk sinkronisasi otomatis mutasi rekening bank."
    }
  },

  // 6. MOBILE DEVELOPMENT - SPENDORA (NEW SEPARATE MOBILE PROJECT, FORMERLY KEUANGANKU)
  {
    id: "spendora-finance-app",
    slug: "spendora-finance-app",
    title: "Spendora",
    category: "mobile",
    categoryLabel: "Mobile Development",
    role: "Mobile Developer",
    status: "Production",
    timeline: "2023 - 2024",
    isFeatured: true,
    thumbnailUrl: "asset/6.png",
    shortDescription: "Aplikasi mobile manajemen keuangan pribadi, pelacak anggaran bulanan, target tabungan wishlist, dan analisis arus kas visual.",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "Flutter", icon: "ri-code-s-slash-line", color: "text-blue-400" },
      { name: "Firebase", icon: "ri-fire-line", color: "text-amber-500" },
      { name: "SQLite", icon: "ri-database-2-line", color: "text-sky-400" },
      { name: "Chart.js", icon: "ri-pie-chart-line", color: "text-purple-400" }
    ],
    overview: {
      what: "Aplikasi mobile manajemen keuangan pribadi untuk mencatat pengeluaran harian, menetapkan anggaran bulanan per kategori, serta melacak progres target tabungan (wishlist).",
      who: "Individu, profesional muda, dan mahasiswa yang ingin mengelola keuangan pribadi secara sehat.",
      problemSolved: "Membantu pengguna mengontrol gaya hidup impulsif dengan memberikan insight grafik pengeluaran dan notifikasi peringatan batas budget."
    },
    problem: "Banyak pengguna kesulitan melacak ke mana uang mereka habis di akhir bulan karena tidak ada pencatatan pengeluaran harian yang praktis dan instan.",
    architecture: [
      { step: 1, title: "Spendora Mobile UI", icon: "ri-smartphone-line", desc: "Catat transaksi cepat, scan struk, & wishlist" },
      { step: 2, title: "Local SQLite Buffer", icon: "ri-database-line", desc: "Penyimpanan offline-first dengan respon instan" },
      { step: 3, title: "Firebase Cloud Sync", icon: "ri-cloud-line", desc: "Backup otomatis data pengguna ke cloud" },
      { step: 4, title: "Analytics Engine", icon: "ri-pie-chart-2-line", desc: "Kalkulasi rasio keuangan & perbandingan budget" }
    ],
    responsibilities: [
      "Mobile App UI/UX Design & Flutter Development",
      "Offline-first architecture implementation with SQLite",
      "Interactive pie charts and monthly cashflow graphs",
      "Wishlist savings progress calculator with target alerts"
    ],
    results: [
      "Over 80% user engagement rate in daily expense tracking",
      "Instant offline transaction recording (<100ms response)",
      "Visual budget threshold alert system"
    ],
    gallery: [
      { title: "Spendora Mobile Analytics", image: "asset/6.png", category: "Reports" }
    ],
    learnings: {
      challenges: "Menjaga aplikasi tetap responsif saat membuka laporan histori transaksi tahunan yang berisi ribuan baris record.",
      mistakes: "Awalnya melakukan rendering seluruh list item tanpa pagination / virtualized list.",
      solutions: "Menggunakan ListView.builder dengan lazy loading untuk optimasi performa memori.",
      improvements: "Penambahan fitur OCR Scanner untuk membaca struk belanja secara otomatis."
    }
  },

  // 7. DEVOPS & INFRASTRUCTURE (DUMMY DEMO PROJECT 1)
  {
    id: "cicd-swarm-infrastructure",
    slug: "cicd-swarm-infrastructure",
    title: "CI/CD Automation & Docker Swarm Cluster",
    category: "devops",
    categoryLabel: "DevOps & Infrastructure",
    role: "DevOps Engineer",
    status: "Production",
    timeline: "2024 - Present",
    isFeatured: true,
    thumbnailUrl: "asset/docker_swarm.png",
    shortDescription: "Arsitektur CI/CD otomatis dengan Docker Swarm untuk deployment zero-downtime dan pemindaian keamanan SonarQube. (Infrastructure Demo)",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "Docker", icon: "ri-box-3-line", color: "text-blue-500" },
      { name: "Docker Swarm", icon: "ri-cpu-line", color: "text-cyan-400" },
      { name: "GitHub Actions", icon: "ri-github-fill", color: "text-slate-300" },
      { name: "SonarQube", icon: "ri-search-eye-line", color: "text-indigo-400" },
      { name: "Linux", icon: "ri-terminal-box-line", color: "text-slate-400" },
      { name: "Ubuntu", icon: "ri-ubuntu-line", color: "text-orange-500" },
      { name: "Nginx", icon: "ri-global-line", color: "text-emerald-500" },
      { name: "Docker Hub", icon: "ri-box-1-line", color: "text-sky-400" }
    ],
    overview: {
      what: "Arsitektur pipeline CI/CD end-to-end yang mengotomatiskan pengujian unit, pemindaian kualitas kode via SonarQube, pembuatan Docker image, hingga deployment ke cluster Docker Swarm.",
      who: "Tim software developer dan devops engineer.",
      problemSolved: "Eliminasi rilis manual yang rentan kesalahan manusia serta menjamin zero-downtime rolling update saat pengiriman versi aplikasi baru."
    },
    problem: "Sebelumnya, proses deployment aplikasi dilakukan secara manual via SSH/FTP ke VPS. Metode ini memakan waktu lama (lebih dari 1-2 jam), berisiko salah konfigurasi environment, dan menyebabkan downtime bagi pengguna akhir.",
    architecture: [
      { step: 1, title: "Developer Push", icon: "ri-git-commit-line", desc: "Commit & Push kode baru ke repository GitHub" },
      { step: 2, title: "GitHub Actions Trigger", icon: "ri-github-fill", desc: "Jalankan job otomatis: Linting & Unit Testing" },
      { step: 3, title: "SonarQube Quality Scan", icon: "ri-search-eye-line", desc: "Pemeriksaan Quality Gate security & code smell" },
      { step: 4, title: "Docker Container Build", icon: "ri-box-3-line", desc: "Build multi-arch image & push ke Docker Hub" },
      { step: 5, title: "Docker Swarm Deployment", icon: "ri-server-line", desc: "Zero-downtime rolling update di VPS Swarm Node" },
      { step: 6, title: "Nginx & SSL Certbot", icon: "ri-shield-check-line", desc: "Reverse proxy routing & automatic TLS renewal" }
    ],
    responsibilities: [
      "Infrastructure setup & server provisioning",
      "Docker Compose & Swarm cluster orchestration",
      "Reverse Proxy & SSL automated setup",
      "GitHub Actions workflow automation",
      "SonarQube Quality Gate integration",
      "Docker Hub registry pipeline management",
      "Zero-downtime rolling update deployment strategy",
      "Monitoring & container healthcheck setup"
    ],
    results: [
      "Automated deployment pipeline fully implemented",
      "HTTPS enabled with automated SSL renewals",
      "CI/CD implemented with GitHub Actions",
      "Reduced deployment time from 2 hours to under 3 minutes",
      "Zero-downtime deployment during releases",
      "100% code quality gate enforcement"
    ],
    gallery: [
      { title: "Docker Swarm Cluster Node", image: "asset/docker_swarm.png", category: "Architecture" },
      { title: "Docker Container Architecture", image: "asset/docker.png", category: "CI/CD Pipeline" }
    ],
    learnings: {
      challenges: "Mengelola persisten volume dan zero-downtime rolling updates tanpa mengganggu transaksi user yang sedang berjalan.",
      mistakes: "Awalnya tidak menyertakan directive healthcheck pada Docker Compose, menyebabkan Swarm mengarahkan traffic ke container yang belum fully initialized.",
      solutions: "Menambahkan healthcheck khusus dan mengatur order start-first pada Swarm update_config.",
      improvements: "Persiapan migrasi ke Kubernetes cluster untuk skalabilitas skala besar di masa mendatang."
    }
  },

  // 8. DEVOPS & INFRASTRUCTURE (DUMMY DEMO PROJECT 2)
  {
    id: "reverse-proxy-ssl-infrastructure",
    slug: "reverse-proxy-ssl-infrastructure",
    title: "Reverse Proxy & Automated SSL Infrastructure",
    category: "devops",
    categoryLabel: "DevOps & Infrastructure",
    role: "DevOps Engineer",
    status: "Production",
    timeline: "2024",
    isFeatured: false,
    thumbnailUrl: "asset/foto1.png",
    shortDescription: "Infrastruktur Nginx Reverse Proxy terpusat dengan otomatisasi pembaruan sertifikat Let's Encrypt TLS/SSL. (Infrastructure Demo)",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "Nginx", icon: "ri-global-line", color: "text-emerald-500" },
      { name: "Certbot", icon: "ri-key-2-line", color: "text-yellow-400" },
      { name: "Cloudflare", icon: "ri-cloud-line", color: "text-orange-400" },
      { name: "Linux", icon: "ri-terminal-box-line", color: "text-slate-400" },
      { name: "Ubuntu", icon: "ri-ubuntu-line", color: "text-orange-500" }
    ],
    overview: {
      what: "Infrastruktur gateway reverse proxy Nginx terpusat dengan otomatisasi renewal sertifikat Let's Encrypt TLS/SSL, security header hardening, dan mitigasi DDoS.",
      who: "Seluruh layanan web dan API microservices di lingkungan server.",
      problemSolved: "Pengelolaan sertifikat SSL yang sering terlupakan serta standarisasi tingkat keamanan seluruh domain aplikasi."
    },
    problem: "Setiap service memiliki konfigurasi web server terpisah tanpa standar keamanan yang konsisten, berisiko terhadap serangan cyber dan sertifikat SSL expired.",
    architecture: [
      { step: 1, title: "Cloudflare Edge", icon: "ri-cloud-line", desc: "DNS management, WAF, & DDoS protection" },
      { step: 2, title: "Nginx Edge Proxy", icon: "ri-shield-flash-line", desc: "Rate limiting, Gzip compression, & security headers" },
      { step: 3, title: "Certbot Auto Renewal", icon: "ri-key-2-line", desc: "Cron job otomatis untuk pembaruan sertifikat TLS/SSL" },
      { step: 4, title: "Upstream Microservices", icon: "ri-server-line", desc: "Routing aman ke Docker container / Virtual Host" }
    ],
    responsibilities: [
      "Infrastructure setup & Nginx hardening",
      "Automated Certbot SSL renewal cron jobs",
      "Security header enforcement (HSTS, CSP, X-Frame)",
      "Cloudflare DNS & Proxy integration",
      "Rate limiting & DDoS protection rules setup"
    ],
    results: [
      "100% A+ SSL Labs Security Rating achieved",
      "Zero downtime during automated SSL renewal",
      "Sub-50ms TLS handshake latency",
      "Centralized SSL & domain management"
    ],
    gallery: [
      { title: "Nginx Infrastructure Topology", image: "asset/foto1.png", category: "Architecture" }
    ],
    learnings: {
      challenges: "Menangani Let's Encrypt HTTP-01 challenge saat domain berada di balik Cloudflare Flexible/Full proxy.",
      mistakes: "Lupa meloloskan header `X-Forwarded-For` sehingga IP asli pengguna terdeteksi sebagai IP proxy Cloudflare.",
      solutions: "Mengonfigurasi directive `set_real_ip_from` Cloudflare IP ranges pada Nginx configuration.",
      improvements: "Implementasi mTLS (Mutual TLS) untuk enkripsi antar microservices internal."
    }
  },

  // 9. DEVOPS & INFRASTRUCTURE (DUMMY DEMO PROJECT 3)
  {
    id: "sonarqube-code-quality-gate",
    slug: "sonarqube-code-quality-gate",
    title: "SonarQube Code Quality & Security Gate",
    category: "devops",
    categoryLabel: "DevOps & Infrastructure",
    role: "DevOps Engineer",
    status: "Production",
    timeline: "2024",
    isFeatured: false,
    thumbnailUrl: "asset/7.png",
    shortDescription: "Sistem pengujian kualitas kode & keamanan SAST otomatis yang terintegrasi di dalam GitHub Actions CI/CD. (Infrastructure Demo)",
    githubUrl: "https://github.com/rifkirizkia",
    demoUrl: "",
    techStack: [
      { name: "SonarQube", icon: "ri-search-eye-line", color: "text-indigo-400" },
      { name: "Docker", icon: "ri-box-3-line", color: "text-blue-500" },
      { name: "GitHub Actions", icon: "ri-github-fill", color: "text-slate-300" },
      { name: "PostgreSQL", icon: "ri-database-2-line", color: "text-blue-400" }
    ],
    overview: {
      what: "Sistem analisis statis otomatis (SAST) yang diintegrasikan dalam CI/CD pipeline untuk memindai potensi celah keamanan, bug, dan kualitas kode pada setiap Pull Request.",
      who: "Tim developer software & lead software engineers.",
      problemSolved: "Mencegah masuknya kode berkualitas buruk atau berisiko celah keamanan ke branch utama produksi."
    },
    problem: "Code review manual memerlukan waktu lama dan berpotensi melewatkan celah keamanan tak kasat mata seperti SQL Injection atau kebocoran memori.",
    architecture: [
      { step: 1, title: "Git Pull Request", icon: "ri-git-pull-request-line", desc: "Developer buat Pull Request di GitHub Repository" },
      { step: 2, title: "SonarScanner Execution", icon: "ri-search-eye-line", desc: "Runner membaca source code & unit test coverage" },
      { step: 3, title: "SonarQube Analysis Server", icon: "ri-shield-keyhole-line", desc: "Evaluasi Quality Gate: Security, Bugs, & Technical Debt" },
      { step: 4, title: "GitHub PR Status Gate", icon: "ri-checkbox-circle-line", desc: "Komentar otomatis & pass/fail status gate di PR" }
    ],
    responsibilities: [
      "SonarQube server deployment via Docker Swarm",
      "GitHub Organization integration & webhook setup",
      "Custom Quality Gate threshold rules design",
      "Automated Pull Request status check reporting"
    ],
    results: [
      "85%+ minimum unit test coverage enforced",
      "Zero critical security vulnerabilities deployed",
      "Reduced technical debt by 35%",
      "Automated code review feedback on PRs"
    ],
    gallery: [
      { title: "SonarQube Quality Gate Report", image: "asset/7.png", category: "CI/CD Pipeline" }
    ],
    learnings: {
      challenges: "Mengoptimalkan durasi scan SonarScanner agar tidak memperlambat execution pipeline GitHub Actions.",
      mistakes: "Awalnya melakukan pemindaian pada folder build artifact dan dependencies yang menghabiskan waktu berlebih.",
      solutions: "Menyusun file aturan pengecualian `.sonarcloud.properties` secara rinci.",
      improvements: "Integrasi pemindaian kontainer otomatis dengan Trivy security scanner."
    }
  }
];

if (typeof window !== "undefined") {
  window.PROJECTS_DATA = PROJECTS_DATA;
}
