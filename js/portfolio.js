/**
 * Portfolio Interactive Module
 * Manages category tab filtering, project card rendering,
 * dedicated DevOps portfolio experience, case study overlay modal, 
 * CSS architecture diagrams, and gallery lightboxes.
 */

document.addEventListener("DOMContentLoaded", function () {
  const projectsData = window.PROJECTS_DATA || [];
  
  // Elements
  const projectsGrid = document.getElementById("projects-grid");
  const tabButtons = document.querySelectorAll(".portfolio-tab-btn");
  const viewAllBtn = document.getElementById("view-all-projects-btn");
  const caseStudyModal = document.getElementById("case-study-modal");
  const caseStudyContainer = document.getElementById("case-study-content");
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");

  let currentCategory = "all";
  let showOnlyFeatured = true;

  // Initialize Portfolio UI
  function initPortfolio() {
    renderProjects();
    setupTabListeners();
    setupHashRouting();
    setupLightboxListeners();
  }

  // Filter projects by active category and featured status
  function getFilteredProjects() {
    let filtered = projectsData;
    if (currentCategory !== "all") {
      filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (showOnlyFeatured && filtered.length > 6) {
      return filtered.slice(0, 6);
    }
    return filtered;
  }

  // Render Project Cards or Dedicated DevOps View
  function renderProjects() {
    if (!projectsGrid) return;

    // Ensure section is marked active so scroll-reveal CSS doesn't hide it
    const projekSection = document.getElementById("projek");
    if (projekSection) {
      projekSection.classList.add("active");
    }

    if (currentCategory === "devops") {
      // Prepare container for full-width DevOps layout
      projectsGrid.className = "block w-full space-y-12 transition-all duration-300";
      projectsGrid.innerHTML = buildDevOpsViewHTML();

      if (viewAllBtn) {
        viewAllBtn.style.display = "none";
      }

      setupDevOpsEventListeners();
    } else {
      // Restore standard 3-column project grid layout for "all", "mobile", and "web"
      projectsGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300";

      const filtered = getFilteredProjects();
      if (filtered.length === 0) {
        projectsGrid.innerHTML = `
          <div class="col-span-full py-16 text-center text-gray-500 dark:text-gray-400">
            <i class="ri-folder-open-line text-4xl mb-3 block opacity-50"></i>
            <p class="text-lg">Tidak ada projek ditemukan untuk kategori ini.</p>
          </div>
        `;
      } else {
        projectsGrid.innerHTML = filtered.map(project => createProjectCardHTML(project)).join("");
      }

      setupCardEventListeners();

      // Update "View All Projects" button visibility for standard grid
      if (viewAllBtn) {
        const totalInCategory = currentCategory === "all" 
          ? projectsData.length 
          : projectsData.filter(p => p.category === currentCategory).length;
        
        if (totalInCategory > 6 && showOnlyFeatured) {
          viewAllBtn.style.display = "inline-flex";
          viewAllBtn.innerHTML = `Lihat Semua Projek (${totalInCategory}) <i class="ri-arrow-right-line ml-2"></i>`;
        } else if (!showOnlyFeatured) {
          viewAllBtn.style.display = "inline-flex";
          viewAllBtn.innerHTML = `Tampilkan Diringkas <i class="ri-arrow-up-s-line ml-2"></i>`;
        } else {
          viewAllBtn.style.display = "none";
        }
      }
    }

    // Refresh AOS animations if active
    if (window.AOS && typeof window.AOS.refresh === "function") {
      setTimeout(() => {
        window.AOS.refresh();
      }, 50);
    }
  }

  // Create Modern Case-Study Card HTML (Linear / Vercel Aesthetic)
  function createProjectCardHTML(project) {
    const statusColor = project.status === "Production" 
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : project.status === "Completed"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

    const techBadgesHTML = project.techStack.slice(0, 5).map(tech => `
      <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5">
        <i class="${tech.icon} ${tech.color}"></i> ${tech.name}
      </span>
    `).join("");

    const extraTechCount = project.techStack.length > 5 ? project.techStack.length - 5 : 0;

    return `
      <div class="project-card group bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between interactive-element" data-aos="fade-up">
        
        <!-- Thumbnail & Badges -->
        <div>
          <div class="h-52 overflow-hidden relative bg-gray-900/5 dark:bg-black/30 border-b border-gray-100 dark:border-white/5">
            <img src="${project.thumbnailUrl}" alt="${project.title}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out" />
            
            <!-- Category Badge -->
            <div class="absolute top-4 left-4 z-10">
              <span class="bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md border border-gray-200/80 dark:border-white/10 text-primary dark:text-secondary text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                ${project.categoryLabel}
              </span>
            </div>

            <!-- Status Badge -->
            <div class="absolute top-4 right-4 z-10">
              <span class="backdrop-blur-md border text-xs font-medium px-2.5 py-1 rounded-md shadow-sm ${statusColor}">
                • ${project.status}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Role -->
            <div class="flex items-center gap-2 mb-2 text-xs font-mono text-secondary tracking-wide uppercase font-semibold">
              <i class="ri-user-settings-line"></i> ${project.role}
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-primary dark:text-white group-hover:text-secondary transition-colors line-clamp-1 mb-2">
              ${project.title}
            </h3>

            <!-- Short Description -->
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6">
              ${project.shortDescription || (project.overview ? project.overview.what : '')}
            </p>

            <!-- Tech Stack Badges -->
            <div class="flex flex-wrap gap-1.5">
              ${techBadgesHTML}
              ${extraTechCount > 0 ? `<span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-500 text-xs font-mono px-2 py-1 rounded-md">+${extraTechCount}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Footer / Action Button -->
        <div class="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between mt-auto">
          <span class="text-xs font-mono text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <i class="ri-calendar-line"></i> ${project.timeline}
          </span>
          <button class="view-case-study-btn bg-primary/5 hover:bg-primary text-primary hover:text-white dark:bg-secondary/10 dark:hover:bg-secondary dark:text-secondary dark:hover:text-primary text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 interactive-element" data-slug="${project.slug}">
            Baca Case Study <i class="ri-arrow-right-up-line text-sm"></i>
          </button>
        </div>

      </div>
    `;
  }

  // Dedicated DevOps Portfolio View (9 Sections)
  function buildDevOpsViewHTML() {
    const managedApps = [
      { name: "SweetEscape", category: "Aplikasi Mobile & Web", tech: "Node.js, Docker, Nginx", logo: "asset/logo/sweet-escape-logo.svg" },
      { name: "Kosmik", category: "Platform Enterprise", tech: "Docker, Nginx, SSL", logo: "asset/logo/logo-kosmik.png" },
      { name: "DOMS", category: "Platform Operasional", tech: "Linux, Nginx, PostgreSQL", logo: "asset/logo/logo-doms.svg" },
      { name: "Elkopra", category: "PWA Koperasi", tech: "Laravel, Docker, PWA", logo: "asset/logo/logo-elkopra.svg" },
      { name: "Kopkar Anggota", category: "Koperasi Mobile", tech: "Flutter, IoT Vending API", logo: "asset/logo/logo-kopkar.png" },
      { name: "NAIQ User", category: "Aplikasi Mobile", tech: "Flutter, Firebase, REST API", logo: "asset/logo/naiq-logo.png" },
      { name: "NAIQ Driver", category: "Tracking Pengemudi", tech: "React Native, Google Maps", logo: "asset/logo/logo-naiq-driver.png" },
      { name: "Walagiri", category: "Sistem Pertanian", tech: "Vue.js, Docker, Nginx", logo: "asset/logo/logo-wallagri.png" },
      { name: "Dapen", category: "Sistem Dana Pensiun", tech: "Laravel, MySQL, Docker", logo: "asset/logo/logo-dapen.svg" },
      { name: "E-Pass", category: "Akses Kontrol", tech: "Node.js, Redis, Nginx", logo: "asset/logo/logo-epass.svg" },
      { name: "LSP", category: "Portal Sertifikasi", tech: "PHP, MariaDB, Linux", logo: "asset/logo/Logo-lsp.png" },
      { name: "Komuditi", category: "Sistem Komoditas", tech: "Node.js, Docker Swarm", logo: "asset/logo/logo-komuditi.png" },
      { name: "Dialogue", category: "Aplikasi Web", tech: "React, Express, PostgreSQL", logo: "asset/logo/logo-dialogue.jpeg" },
      { name: "RPSM", category: "Sistem Manajemen", tech: "Laravel, MariaDB, Docker", logo: "" },
      { name: "Flexa", category: "Aplikasi SaaS", tech: "Node.js, Redis, Docker Swarm", logo: "" },
      { name: "Presensy", category: "Sistem Presensi", tech: "Laravel, MySQL, Certbot", logo: "" },
      { name: "Spendora", category: "Aplikasi Keuangan", tech: "Flutter, REST API", logo: "asset/logo/logo-ios.png" }
    ];

    const logoGridHTML = managedApps.map(app => `
      <div class="devops-app-badge group relative bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:border-secondary/50 hover:shadow-lg hover:bg-white dark:hover:bg-dark-surface cursor-pointer">
        <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-white text-gray-900 flex items-center justify-center font-bold mb-2.5 group-hover:scale-110 transition-transform overflow-hidden p-2.5 shadow-sm border border-gray-200/60 dark:border-white">
          ${app.logo 
            ? `<img src="${app.logo}" alt="${app.name}" class="w-full h-full object-contain" />`
            : `<span class="text-2xl font-bold font-mono text-gray-900">${app.name.charAt(0)}</span>`
          }
        </div>
        <div class="text-xs font-bold text-primary dark:text-white line-clamp-1 group-hover:text-secondary transition-colors">${app.name}</div>

        <!-- Tooltip on hover -->
        <div class="absolute bottom-full mb-2 hidden group-hover:block z-20 w-40 bg-gray-900 text-white text-[11px] p-2 rounded-xl shadow-xl border border-white/10 pointer-events-none text-center">
          <div class="font-bold text-secondary">${app.name}</div>
          <div class="text-gray-300 text-[10px] mt-0.5">${app.category}</div>
        </div>
      </div>
    `).join("");

    return `
      <div class="space-y-16 w-full text-left">
        
        <!-- SECTION 1: HERO -->
        <div class="bg-gradient-to-br from-white/80 to-white/40 dark:from-dark-surface/90 dark:to-dark-bg/90 border border-gray-200/80 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div class="max-w-3xl relative z-10 space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono font-semibold">
              <span class="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              Teknik DevOps &amp; Infrastruktur
            </div>
            <h1 class="text-3xl md:text-5xl font-bold text-primary dark:text-white tracking-tight">
              DevOps Portofolio
            </h1>
            <p class="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Membangun infrastruktur yang andal, mengotomatisasi deployment, meningkatkan kualitas perangkat lunak, serta mengelola sistem produksi secara berkelanjutan.
            </p>
          </div>

          <!-- Hero Stats Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200/60 dark:border-white/10">
            <div class="bg-white/60 dark:bg-black/30 border border-gray-200/60 dark:border-white/10 p-4 rounded-2xl text-center hover:border-secondary/40 transition-colors">
              <div class="text-2xl md:text-3xl font-bold text-primary dark:text-secondary font-mono">12+</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Aplikasi Produksi</div>
            </div>
            <div class="bg-white/60 dark:bg-black/30 border border-gray-200/60 dark:border-white/10 p-4 rounded-2xl text-center hover:border-secondary/40 transition-colors">
              <div class="text-2xl md:text-3xl font-bold text-primary dark:text-secondary font-mono">50+</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Deployment Sistem</div>
            </div>
            <div class="bg-white/60 dark:bg-black/30 border border-gray-200/60 dark:border-white/10 p-4 rounded-2xl text-center hover:border-secondary/40 transition-colors">
              <div class="text-2xl md:text-3xl font-bold text-primary dark:text-secondary font-mono">99%</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Ketersediaan Layanan</div>
            </div>
            <div class="bg-white/60 dark:bg-black/30 border border-gray-200/60 dark:border-white/10 p-4 rounded-2xl text-center hover:border-secondary/40 transition-colors">
              <div class="text-2xl md:text-3xl font-bold text-emerald-500 dark:text-emerald-400 font-mono">CI/CD</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Terotomatisasi</div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: FEATURED CASE STUDY -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <i class="ri-star-line"></i> Case Study Unggulan
            </h3>
            <span class="text-xs text-gray-400 font-mono">Sorotan Utama Infrastruktur</span>
          </div>

          <div class="bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 relative h-64 lg:h-full rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 bg-gray-900/40 min-h-[220px]">
              <img src="asset/7.png" alt="Server Monitoring Platform" class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
              <div class="absolute top-3 left-3 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md text-secondary text-xs font-semibold px-3 py-1 rounded-lg border border-white/10">
                Sorotan Utama
              </div>
            </div>

            <div class="lg:col-span-7 space-y-4">
              <div class="flex flex-wrap items-center gap-3">
                <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Status Produksi
                </span>
                <span class="bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary text-xs font-mono px-3 py-1 rounded-full">
                  Peran: Fullstack &amp; DevOps
                </span>
              </div>

              <h2 class="text-2xl md:text-3xl font-bold text-primary dark:text-white">
                Server Monitoring Platform
              </h2>

              <p class="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Platform web pemantauan server &amp; website multi-node realtime terintegrasi dengan alert Telegram, WhatsApp, &amp; AI Assistant. Mencegah terjadinya downtime tanpa terdeteksi dengan memberikan notifikasi seketika (&lt;5 detik).
              </p>

              <!-- Tech Stack Badges -->
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">Node.js</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">React</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">Docker</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">Nginx</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">n8n</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">PostgreSQL</span>
              </div>

              <div class="pt-4 border-t border-gray-200/60 dark:border-white/10">
                <button class="view-case-study-btn bg-primary text-white dark:bg-secondary dark:text-primary font-semibold text-xs px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 interactive-element" data-slug="website-monitoring-platform">
                  Baca Case Study Selengkapnya <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: PRODUCTION INFRASTRUCTURE -->
        <div class="space-y-6">
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-primary dark:text-white">
              Aplikasi Produksi yang Dikelola
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Lingkungan produksi aktif dan microservices di bawah pemeliharaan berkelanjutan.
            </p>
          </div>

          <!-- Logo Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            ${logoGridHTML}
          </div>

          <!-- Responsibilities Footer Bar -->
          <div class="bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 p-5 rounded-2xl flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono text-gray-600 dark:text-gray-300 text-center">
            <span class="font-bold text-primary dark:text-secondary uppercase">Bertanggung jawab atas:</span>
            <span>Deployment</span> <span class="text-gray-400">•</span>
            <span>CI/CD Pipeline</span> <span class="text-gray-400">•</span>
            <span>Infrastruktur</span> <span class="text-gray-400">•</span>
            <span>Pemantauan</span> <span class="text-gray-400">•</span>
            <span>Sertifikat SSL</span> <span class="text-gray-400">•</span>
            <span>Reverse Proxy</span> <span class="text-gray-400">•</span>
            <span>Kontainer Docker</span> <span class="text-gray-400">•</span>
            <span>Dukungan Produksi</span> <span class="text-gray-400">•</span>
            <span>Pemeliharaan Server</span>
          </div>
        </div>

        <!-- SECTION 4: INFRASTRUCTURE EXPERTISE -->
        <div class="space-y-6">
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-primary dark:text-white">
              Keahlian &amp; Kapabilitas Infrastruktur
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Kapabilitas teknis utama dalam kontainerisasi, otomatisasi, keamanan, dan observabilitas sistem.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 1. Containerization -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl">
                  <i class="ri-box-3-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">Kontainerisasi Sistem</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker Compose</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker Swarm</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Mengemas lingkungan aplikasi ke dalam kontainer ringan terisolasi dan mengorientasikan kluster Docker Swarm untuk pembaruan tanpa downtime (zero-downtime rolling updates).
              </p>
            </div>

            <!-- 2. CI/CD -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">
                  <i class="ri-git-merge-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">Otomatisasi CI/CD</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">GitHub Actions</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker Hub</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Otomatisasi Release</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Membangun alur pengujian otomatis, pembuatan image kontainer multi-arsitektur, publikasi ke Docker registry, dan pemicu otomatis deployment ke server VPS.
              </p>
            </div>

            <!-- 3. Reverse Proxy -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">
                  <i class="ri-global-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">Reverse Proxy &amp; Jaringan</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Nginx</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">SSL</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Certbot</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Cloudflare</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Pengaturan routing gateway terpusat, mitigasi DDoS via Cloudflare WAF, penguatan keamanan header HTTP, dan pembaruan otomatis SSL/TLS Let's Encrypt.
              </p>
            </div>

            <!-- 4. Code Quality -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl">
                  <i class="ri-search-eye-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">Kualitas Kode &amp; SAST</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">SonarQube</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Quality Gates</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">SAST</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Pengujian keamanan aplikasi statis, pemindaian kerentanan kode, deteksi bug/code smell, dan penegakan Quality Gate otomatis pada setiap Pull Request.
              </p>
            </div>

            <!-- 5. Monitoring -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl">
                  <i class="ri-notification-3-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">Pemantauan &amp; Observabilitas</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Website Monitoring</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">API &amp; SSL</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Telegram</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">n8n</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Pemantauan kesehatan server multi-node realtime dengan notifikasi instan yang dikirim melalui Telegram, WhatsApp, dan alur kerja otomatis n8n.
              </p>
            </div>

            <!-- 6. Operating System -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center text-xl">
                  <i class="ri-terminal-box-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">Sistem Operasi &amp; Server VPS</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Ubuntu</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Linux</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">VPS</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Vultr</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Administrasi server Linux Ubuntu, penguatan keamanan akses SSH, konfigurasi firewall, optimalisasi memori/swap, dan pembuatan pencadangan otomatis.
              </p>
            </div>
          </div>
        </div>

        <!-- SECTION 8: ACHIEVEMENTS -->
        <div class="space-y-6">
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-primary dark:text-white">
              Pencapaian Infrastruktur &amp; DevOps
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Hasil utama operasional teknis dan dampak rekayasa infrastruktur.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-apps-2-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">Aplikasi Produksi Dikelola</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  12+ aplikasi dan microservices produksi aktif dipelihara dengan tingkat ketersediaan 99.9%.
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-rocket-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">Deployment Produksi</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  50+ rilis otomatis dijalankan dengan pembaruan tanpa downtime (zero-downtime rolling updates).
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-pulse-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">Platform Monitoring Mandiri</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Merancang dan mendeploy platform pemantauan multi-node realtime dengan sistem alert Telegram &amp; WhatsApp.
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-git-branch-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">Implementasi Pipeline CI/CD</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Memangkas waktu rilis manual dari 2 jam menjadi kurang dari 3 menit per deployment.
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-cpu-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">Otomatisasi Infrastruktur</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Mengemas seluruh layanan ke dalam kluster Docker Swarm dengan mekanisme pemulihan otomatis.
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-key-2-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">Otomatisasi Sertifikat SSL</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  Mengotomatiskan 100% perpanjangan sertifikat TLS/SSL menggunakan tugas berkala Certbot &amp; Cloudflare DNS challenge.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // Event Listeners inside DevOps View
  function setupDevOpsEventListeners() {
    if (!projectsGrid) return;

    // Case study trigger buttons inside DevOps view
    projectsGrid.querySelectorAll(".view-case-study-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute("data-slug");
        openCaseStudy(slug);
      });
    });

    // Lightbox triggers for Architecture gallery items
    projectsGrid.querySelectorAll(".open-arch-lightbox-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const src = btn.getAttribute("data-src");
        const title = btn.getAttribute("data-title");
        openLightbox(src, title);
      });
    });
  }

  // Tab Button Filtering Listeners
  function setupTabListeners() {
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => {
          b.classList.remove("active", "bg-primary", "text-white", "dark:bg-secondary", "dark:text-primary", "shadow-md");
          b.classList.add("bg-white/60", "dark:bg-white/5", "text-gray-600", "dark:text-gray-400", "border-transparent");
        });

        btn.classList.add("active", "bg-primary", "text-white", "dark:bg-secondary", "dark:text-primary", "shadow-md");
        btn.classList.remove("bg-white/60", "dark:bg-white/5", "text-gray-600", "dark:text-gray-400", "border-transparent");

        currentCategory = btn.getAttribute("data-category");
        showOnlyFeatured = true; // Reset filter state
        renderProjects();
      });
    });

    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        showOnlyFeatured = !showOnlyFeatured;
        renderProjects();
      });
    }
  }

  // Attach card button click handlers
  function setupCardEventListeners() {
    document.querySelectorAll(".view-case-study-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute("data-slug");
        openCaseStudy(slug);
      });
    });
  }

  // Hash Navigation support (`#case-study/website-monitoring-platform`)
  function setupHashRouting() {
    window.addEventListener("hashchange", checkHash);
    checkHash();
  }

  function checkHash() {
    const hash = window.location.hash;
    if (hash.startsWith("#case-study/")) {
      const slug = hash.replace("#case-study/", "");
      openCaseStudy(slug, false);
    } else if (caseStudyModal && !caseStudyModal.classList.contains("hidden")) {
      closeCaseStudy(false);
    }
  }

  // Open Case Study Modal
  function openCaseStudy(slug, updateHash = true) {
    const project = projectsData.find(p => p.slug === slug);
    if (!project || !caseStudyModal || !caseStudyContainer) return;

    if (updateHash) {
      window.location.hash = `#case-study/${slug}`;
    }

    caseStudyContainer.innerHTML = buildCaseStudyHTML(project);
    caseStudyModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");

    // Scroll to top of modal
    const scrollContainer = caseStudyModal.querySelector(".modal-scroll-area") || caseStudyModal;
    scrollContainer.scrollTop = 0;

    // Attach internal listeners inside modal (close button, gallery lightbox)
    const closeBtn = caseStudyContainer.querySelector(".close-modal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeCaseStudy());
    }

    // Attach lightbox to gallery thumbnails
    caseStudyContainer.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        const imgSrc = item.getAttribute("data-src");
        const title = item.getAttribute("data-title");
        openLightbox(imgSrc, title);
      });
    });
  }

  // Close Case Study Modal
  function closeCaseStudy(updateHash = true) {
    if (!caseStudyModal) return;
    caseStudyModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");

    if (updateHash && window.location.hash.startsWith("#case-study/")) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  }

  // Build Comprehensive Case Study HTML Page
  function buildCaseStudyHTML(project) {
    // 1. Hero Tech Badges
    const techBadges = project.techStack.map(t => `
      <span class="bg-white dark:bg-white/10 border border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-mono px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
        <i class="${t.icon} ${t.color}"></i> ${t.name}
      </span>
    `).join("");

    // 2. Architecture Nodes HTML
    const architectureHTML = project.architecture.map((node, index) => {
      const isLast = index === project.architecture.length - 1;
      return `
        <div class="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto relative group">
          <!-- Step Node Block -->
          <div class="bg-white dark:bg-dark-surface border border-gray-200/80 dark:border-white/15 p-4 rounded-xl shadow-sm flex items-center gap-3 w-full md:w-56 hover:border-secondary/50 hover:shadow-md transition-all duration-300">
            <div class="w-10 h-10 rounded-lg bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary flex items-center justify-center flex-shrink-0 text-xl font-bold">
              <i class="${node.icon}"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold">Step ${node.step}</div>
              <div class="text-sm font-bold text-primary dark:text-white truncate">${node.title}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">${node.desc}</div>
            </div>
          </div>

          <!-- Connector Arrow -->
          ${!isLast ? `
            <div class="flex md:flex-col items-center justify-center text-secondary py-1 md:py-0 md:px-1">
              <i class="ri-arrow-down-line md:ri-arrow-right-line text-xl animate-pulse"></i>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");

    // 3. Responsibilities Checklist
    const responsibilitiesHTML = project.responsibilities.map(item => `
      <li class="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
        <i class="ri-checkbox-circle-fill text-secondary text-base mt-0.5 flex-shrink-0"></i>
        <span>${item}</span>
      </li>
    `).join("");

    // 4. Results Highlights
    const resultsHTML = project.results.map(item => `
      <div class="bg-white dark:bg-dark-surface border border-gray-200/80 dark:border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg flex-shrink-0">
          <i class="ri-trophy-line"></i>
        </div>
        <span class="text-sm font-semibold text-primary dark:text-white">${item}</span>
      </div>
    `).join("");

    // 5. Gallery Lightbox Grid
    const galleryHTML = project.gallery ? project.gallery.map(item => `
      <div class="gallery-item group relative h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 cursor-pointer interactive-element" data-src="${item.image}" data-title="${item.title}">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
          <span class="text-[10px] font-mono text-secondary uppercase font-bold">${item.category}</span>
          <h4 class="text-xs font-bold text-white">${item.title}</h4>
        </div>
      </div>
    `).join("") : "";

    return `
      <div>
        <!-- STICKY MODAL TOP NAVBAR -->
        <div class="sticky top-0 z-50 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 px-4 md:px-8 py-3.5 mb-8 shadow-sm">
          <div class="max-w-5xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3 overflow-hidden">
              <span class="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 font-bold uppercase text-[11px] text-secondary tracking-wider font-mono flex-shrink-0">${project.categoryLabel}</span>
              <span class="text-gray-300 dark:text-gray-700 hidden sm:inline">|</span>
              <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate hidden sm:inline">${project.title}</span>
            </div>
            <button class="close-modal-btn group bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 text-xs font-medium interactive-element">
              <span>Tutup</span>
              <i class="ri-close-line text-lg group-hover:rotate-90 transition-transform duration-300"></i>
            </button>
          </div>
        </div>

        <!-- MAIN CONTENT CONTAINER WITH MAX-WIDTH & PADDING -->
        <div class="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-12 pb-12">
          
          <!-- 1. HERO SECTION -->
          <section class="space-y-6">
            <div class="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span class="bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary font-semibold px-3 py-1 rounded-lg border border-primary/10 dark:border-secondary/20">
                Role: ${project.role}
              </span>
              <span class="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/10">
                Timeline: ${project.timeline}
              </span>
              <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Status: ${project.status}
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary dark:text-white tracking-tight leading-tight">
              ${project.title}
            </h1>

            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
              ${project.shortDescription || (project.overview ? project.overview.what : '')}
            </p>

            <!-- Action Buttons & Tech Stack -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200/80 dark:border-white/10">
              <div class="flex flex-wrap gap-2">
                ${techBadges}
              </div>
              
              <div class="flex items-center gap-3 flex-shrink-0">
                ${project.githubUrl ? `
                  <a href="${project.githubUrl}" target="_blank" class="bg-gray-900 hover:bg-black text-white dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 interactive-element">
                    <i class="ri-github-fill text-base"></i> Repository GitHub
                  </a>
                ` : ''}
                ${project.demoUrl ? `
                  <a href="${project.demoUrl}" target="_blank" class="bg-secondary text-primary font-semibold text-xs px-4 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 interactive-element">
                    <i class="ri-external-link-line text-base"></i> Live Demo
                  </a>
                ` : ''}
              </div>
            </div>
          </section>

          <!-- HERO THUMBNAIL PREVIEW -->
          <div class="rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-xl bg-gray-900/40 max-h-[500px]">
            <img src="${project.thumbnailUrl}" alt="${project.title}" class="w-full h-full object-cover object-top" />
          </div>

          <!-- 2. OVERVIEW -->
          <section class="space-y-6">
            <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary flex items-center justify-center text-base"><i class="ri-compass-3-line"></i></span>
              Executive Summary
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                <h3 class="text-xs font-mono font-bold uppercase text-secondary">What Was Built</h3>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${project.overview ? project.overview.what : ''}</p>
              </div>
              
              <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                <h3 class="text-xs font-mono font-bold uppercase text-secondary">Target Audience</h3>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${project.overview ? project.overview.who : ''}</p>
              </div>

              <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                <h3 class="text-xs font-mono font-bold uppercase text-secondary">Core Value Created</h3>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${project.overview ? project.overview.problemSolved : ''}</p>
              </div>
            </div>
          </section>

          <!-- 3. THE PROBLEM -->
          <section class="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-6 md:p-8 rounded-2xl space-y-3">
            <h2 class="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <i class="ri-error-warning-line"></i> The Problem & Operational Bottlenecks
            </h2>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              ${project.problem}
            </p>
          </section>

          <!-- 4. SYSTEM ARCHITECTURE & TOPOLOGY -->
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-base"><i class="ri-mind-map"></i></span>
                Architecture Topology & Flow
              </h2>
              <span class="text-xs font-mono text-gray-400 hidden sm:inline">Interactive Pipeline</span>
            </div>

            <div class="bg-white dark:bg-dark-surface border border-gray-200/80 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm overflow-x-auto">
              <div class="flex flex-col md:flex-row items-center justify-between gap-4 min-w-max">
                ${architectureHTML}
              </div>
            </div>
          </section>

          <!-- 5. RESPONSIBILITIES -->
          <section class="space-y-6">
            <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-base"><i class="ri-task-line"></i></span>
              Key Responsibilities & Deliverables
            </h2>

            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm">
              ${responsibilitiesHTML}
            </ul>
          </section>

          <!-- 6. KEY RESULTS -->
          <section class="space-y-6">
            <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-base"><i class="ri-medal-line"></i></span>
              Measurable Outcomes & Results
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${resultsHTML}
            </div>
          </section>

          <!-- 7. GALLERY & SCREENSHOTS -->
          ${project.gallery && project.gallery.length > 0 ? `
            <section class="space-y-6">
              <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center text-base"><i class="ri-image-line"></i></span>
                Architecture Gallery & Visual Artifacts
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                ${galleryHTML}
              </div>
            </section>
          ` : ''}

          <!-- 8. LESSONS LEARNED -->
          ${project.learnings ? `
            <section class="space-y-6">
              <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-base"><i class="ri-lightbulb-line"></i></span>
                What I Learned
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                  <h3 class="text-xs font-mono font-bold uppercase text-amber-500 flex items-center gap-2">
                    <i class="ri-flag-line"></i> Technical Challenges
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${project.learnings.challenges}</p>
                </div>

                <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                  <h3 class="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-2">
                    <i class="ri-bug-line"></i> Mistakes & Pitfalls
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${project.learnings.mistakes}</p>
                </div>

                <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                  <h3 class="text-xs font-mono font-bold uppercase text-emerald-500 flex items-center gap-2">
                    <i class="ri-key-line"></i> Solutions Applied
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${project.learnings.solutions}</p>
                </div>

                <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                  <h3 class="text-xs font-mono font-bold uppercase text-blue-400 flex items-center gap-2">
                    <i class="ri-rocket-line"></i> Future Improvements
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${project.learnings.improvements}</p>
                </div>
              </div>
            </section>
          ` : ''}

          <!-- FOOTER CLOSE BUTTON -->
          <div class="pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <button class="close-modal-btn bg-primary hover:bg-black dark:bg-secondary dark:hover:bg-amber-400 text-white dark:text-primary font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg transition-all interactive-element">
              Tutup Case Study
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // Lightbox Modal Logic
  function setupLightboxListeners() {
    if (!lightboxModal) return;

    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal || e.target.classList.contains("close-lightbox")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
        if (caseStudyModal && !caseStudyModal.classList.contains("hidden")) {
          closeCaseStudy();
        }
      }
    });
  }

  function openLightbox(src, title) {
    if (!lightboxModal || !lightboxImage) return;
    lightboxImage.src = src;
    if (lightboxCaption) lightboxCaption.textContent = title || "";
    lightboxModal.classList.remove("hidden");
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add("hidden");
  }

  // Start initialization
  initPortfolio();
});
