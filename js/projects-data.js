/**
 * Portfolio Case Studies Data Source
 * Centralized data storage for all portfolio items and case studies.
 * Update this file to add, modify, or remove projects without editing UI components.
 */

const PROJECTS_DATA = [
  // 1. TNI TACTICAL 3D SCAN VIEWER & SIMULATION PLATFORM (WEB & AI ENGINEERING)
  {
    id: "tni-3d-tactical-scan-viewer",
    slug: "tni-3d-tactical-scan-viewer",
    title: "TNI Tactical 3D Scan & Simulation Viewer",
    category: "web",
    categoryLabel: "Web & 3D Simulation",
    role: "Lead Fullstack & AI-Assisted Architect",
    status: "Production",
    timeline: "2026",
    isFeatured: true,
    thumbnailUrl: "asset/tni.webp",
    shortDescription: "Platform web interaktif visualisasi hasil scan 3D fotogrametri & LiDAR medan taktis untuk TNI dalam simulasi latihan, diarsiteki dari ide hingga produk siap pakai via prompt engineering model AI mutakhir (Gemini & ChatGPT).",
    demoUrl: "",
    techStack: [
      { name: "Three.js / WebGL", icon: "ri-box-3-line", color: "text-emerald-400" },
      { name: "Google Gemini AI", icon: "ri-sparkling-2-line", color: "text-blue-400" },
      { name: "ChatGPT / OpenAI", icon: "ri-openai-fill", color: "text-green-400" },
      { name: "Prompt Engineering", icon: "ri-terminal-box-line", color: "text-purple-400" },
      { name: "Google Cloud (GCP)", icon: "ri-google-line", color: "text-sky-400" },
      { name: "AWS Cloud", icon: "ri-amazon-line", color: "text-amber-500" },
      { name: "Docker", icon: "ri-box-3-line", color: "text-blue-500" },
      { name: "Nginx", icon: "ri-global-line", color: "text-emerald-500" }
    ],
    overview: {
      what: "Platform web 3D GIS & Tactical Terrain Viewer berkinerja tinggi untuk memvisualisasikan hasil scan 3D (fotogrametri resolusi tinggi, LiDAR point cloud, dan mesh topografi) secara real-time di web browser, dirancang khusus untuk mendukung simulasi latihan tempur dan analisis taktis TNI.",
      who: "Personel TNI, instruktur taktik tempur, dan perwira perencana latihan gabungan / simulasi manuver lapangan.",
      problemSolved: "Mengubah ide dan spesifikasi simulasi militer yang kompleks menjadi platform web siap pakai secara cepat melalui prompting AI canggih, mengatasi kendala file 3D raksasa (ratusan megabyte) agar dapat dirender 60 FPS di browser standar tanpa memerlukan software desktop berbayar ataupun workstation GPU khusus."
    },
    problem: "Sebelumnya, hasil scan 3D medan latihan (berisi jutaan titik koordinat dan poligon berukuran gigabyte) hanya bisa dibuka melalui workstation berspesifikasi khusus dengan software CAD/GIS desktop yang berat dan lisensi mahal. Hal ini membuat personel di lapangan dan ruang komando kesulitan melakukan briefing taktis yang kolaboratif. Dibutuhkan solusi web-based yang instan, aman, memiliki navigasi simulasi medan (analisis elevasi, waypoint navigasi, line-of-sight), serta harus siap pakai dalam siklus waktu yang sangat singkat.",
    architecture: [
      { step: 1, title: "Operational Requirement & Ideation", icon: "ri-lightbulb-line", desc: "Menganalisis kebutuhan simulasi taktis TNI & struktur data scan 3D (LiDAR / Mesh)" },
      { step: 2, title: "AI Prompting & Algorithm Solving", icon: "ri-sparkling-2-line", desc: "Prompting terstruktur ke Gemini & ChatGPT untuk kalkulasi WebGL shader, LOD, & kompresi" },
      { step: 3, title: "Rapid Three.js Prototyping", icon: "ri-code-s-slash-line", desc: "Membangun web viewer 3D interaktif dengan kontrol taktis, waypoints, & elevation slice" },
      { step: 4, title: "Draco Mesh & Web Streaming", icon: "ri-cpu-line", desc: "Optimasi streaming aset 3D terkompresi hingga 80% lebih hemat bandwidth" },
      { step: 5, title: "Cloud Deployment (GCP & AWS)", icon: "ri-cloud-line", desc: "Infrastruktur kontainer Docker dengan isolasi jaringan, Nginx reverse proxy, & SSL" },
      { step: 6, title: "DevSecOps & Security Hardening", icon: "ri-shield-keyhole-line", desc: "Pemeriksaan keamanan kode SAST/DAST & autentikasi tersandi standar militer" }
    ],
    responsibilities: [
      "Menerjemahkan ide dan tantangan visualisasi medan TNI menjadi solusi produk web 3D yang fungsional dan siap pakai.",
      "Menggunakan teknik prompt engineering pada Gemini dan ChatGPT untuk memecahkan komputasi matematis 3D, custom fragment shader, dan optimasi performa WebGL.",
      "Mengimplementasikan kontrol navigasi kamera taktis (orbit view, path walkthrough, waypoint telemetry, dan analisis kontur elevasi).",
      "Merancang pipeline kompresi data scan 3D (Draco/Meshopt) sehingga model berukuran gigabyte dapat di-streaming mulus via web.",
      "Mengatur orkestrasi deployment di cloud Google Cloud (GCP) dan AWS menggunakan kontainer Docker serta konfigurasi reverse proxy Nginx.",
      "Menerapkan standarisasi keamanan DevSecOps, enkripsi TLS 1.3, dan pengujian kerentanan SAST/DAST untuk melindungi kerahasiaan data simulasi."
    ],
    results: [
      "Akselerasi siklus pengembangan hingga 70% (dari ide mentah hingga produk web siap pakai) melalui integrasi prompting AI modern.",
      "Stabil di 60 FPS pada browser standar tanpa memerlukan instalasi aplikasi desktop atau hardware GPU workstation mahal.",
      "Kompresi data 3D hingga 80% lebih kecil dengan latensi muat di bawah 3 detik.",
      "Berhasil diujicobakan dan dimanfaatkan oleh unit TNI untuk simulasi skenario latihan taktis dan briefing medan tempur.",
      "Membuktikan kemampuan problem solving yang tangguh dalam mengintegrasikan AI, grafika komputer 3D, dan cloud DevSecOps ke dalam produk nyata."
    ],
    gallery: [
      { title: "TNI Tactical 3D Simulation Viewer Dashboard", image: "asset/tni.webp", category: "Dashboard" },
      { title: "Topographic Elevation & Waypoint Route Simulation", image: "asset/tni.webp", category: "3D Simulation" },
      { title: "Draco Compression & 3D Streaming Pipeline", image: "asset/tni.webp", category: "Architecture" }
    ],
    learnings: {
      challenges: "Menampilkan model 3D scan berdensitas jutaan poligon secara real-time di browser web tanpa crash memori pada perangkat klien dengan spesifikasi standar.",
      mistakes: "Awalnya mencoba memuat seluruh detail mesh resolusi tertinggi secara bersamaan, yang menimbulkan lonjakan konsumsi VRAM dan stuttering.",
      solutions: "Memanfaatkan bantuan prompting model AI terkini untuk merancang algoritma dynamic Level of Detail (LOD), frustum culling, dan texture chunking berbasis jarak kamera.",
      improvements: "Mengembangkan modul simulasi balistik taktis dan integrasi telemetry live drone GPS langsung ke dalam viewport 3D."
    }
  },

  // 2. WEB DEVELOPMENT (Server & Website Monitoring Platform)
  {
    id: "website-monitoring-platform",
    slug: "website-monitoring-platform",
    title: "Server Monitoring Platform",
    category: "web",
    categoryLabel: "Web Development",
    role: "Fullstack & DevSecOps",
    status: "Production",
    timeline: "2026 - 2026",
    isFeatured: true,
    thumbnailUrl: "asset/7.webp",
    shortDescription: "Platform web pemantauan server & website multi-node realtime terintegrasi dengan alert Telegram, WhatsApp, & AI Assistant.",
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
      who: "Tim IT operations, System Administrator, dan DevSecOps Engineers yang mengelola infrastruktur multi-server.",
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
      { title: "Monitoring Dashboard", image: "asset/7.webp", category: "Dashboard" },
      { title: "Server Health Topology", image: "asset/7.webp", category: "Architecture" },
      { title: "n8n Automation Pipeline", image: "asset/7.webp", category: "CI/CD Pipeline" },
      { title: "Telegram & WhatsApp Alerts", image: "asset/7.webp", category: "Notifications" }
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
    thumbnailUrl: "asset/4.webp",
    shortDescription: "Aplikasi mobile antar-jemput karyawan armada bus Toyota dengan pemantauan live GPS tracking dan QR check-in.",
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
      { title: "Naiq User Interface", image: "asset/4.webp", category: "Dashboard" },
      { title: "Naiq Driver Live Tracking", image: "asset/5.webp", category: "Monitoring" }
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
    thumbnailUrl: "asset/3.webp",
    shortDescription: "Aplikasi mobile koperasi digital karyawan Toyota terintegrasi dengan Vending Machine IoT JumpStart & PIMA.",
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
      { title: "Kopkar Mobile Member Dashboard", image: "asset/3.webp", category: "Dashboard" }
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
    thumbnailUrl: "asset/1.webp",
    shortDescription: "Aplikasi mobile pelayanan administrasi kependudukan desa, pengajuan surat mandiri & pelaporan warga berbasis QR Code.",
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
      { title: "Evillage Citizen Mobile App", image: "asset/1.webp", category: "Dashboard" }
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
    thumbnailUrl: "asset/2.webp",
    shortDescription: "Aplikasi mobile manajemen keuangan dan ERP akuntansi koperasi terpadu dengan pencatatan jurnal otomatis dan neraca saldo.",
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
      { title: "Elkopra Mobile ERP Interface", image: "asset/2.webp", category: "Dashboard" }
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
    thumbnailUrl: "asset/6.webp",
    shortDescription: "Aplikasi mobile manajemen keuangan pribadi, pelacak anggaran bulanan, target tabungan wishlist, dan analisis arus kas visual.",
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
      { title: "Spendora Mobile Analytics", image: "asset/6.webp", category: "Reports" }
    ],
    learnings: {
      challenges: "Menjaga aplikasi tetap responsif saat membuka laporan histori transaksi tahunan yang berisi ribuan baris record.",
      mistakes: "Awalnya melakukan rendering seluruh list item tanpa pagination / virtualized list.",
      solutions: "Menggunakan ListView.builder dengan lazy loading untuk optimasi performa memori.",
      improvements: "Penambahan fitur OCR Scanner untuk membaca struk belanja secara otomatis."
    }
  },

];

if (typeof window !== "undefined") {
  window.PROJECTS_DATA = PROJECTS_DATA;
}
