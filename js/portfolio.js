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
    setupLanguageListener();
  }

  // Listen to language change to re-render UI dynamically
  function setupLanguageListener() {
    window.addEventListener("languageChanged", function () {
      renderProjects(false);
      // If modal is open, re-render modal with new language
      if (caseStudyModal && caseStudyModal.classList.contains("active")) {
        const hashMatch = window.location.hash.match(/^#case-study\/(.+)$/);
        if (hashMatch && hashMatch[1]) {
          const project = projectsData.find(p => p.slug === hashMatch[1]);
          if (project && caseStudyContainer) {
            caseStudyContainer.innerHTML = buildCaseStudyHTML(project);
            // Re-attach lightbox listeners inside modal
            caseStudyContainer.querySelectorAll(".gallery-item").forEach(item => {
              item.addEventListener("click", () => {
                openLightbox(item.getAttribute("data-src"), item.getAttribute("data-title"));
              });
            });
          }
        }
      }
    });
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

  // Render Project Cards or Dedicated DevOps View with smooth transitions
  function renderProjects(animate = false) {
    if (!projectsGrid) return;

    const doRender = () => {
      if (currentCategory === "devops") {
        // Prepare container for full-width DevOps layout
        projectsGrid.className = "block w-full space-y-12";
        projectsGrid.innerHTML = buildDevOpsViewHTML();

        if (viewAllBtn) {
          viewAllBtn.style.display = "none";
        }

        setupDevOpsEventListeners();
      } else {
        // Restore standard 3-column project grid layout for "all", "mobile", and "web"
        projectsGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";

        const filtered = getFilteredProjects();
        if (filtered.length === 0) {
          const noProjectsText = window.i18n ? window.i18n.t("portfolio.noProjects") : "Tidak ada projek ditemukan untuk kategori ini.";
          projectsGrid.innerHTML = `
            <div class="col-span-full py-16 text-center text-gray-500 dark:text-gray-400">
              <i class="ri-folder-open-line text-4xl mb-3 block opacity-50"></i>
              <p class="text-lg">${noProjectsText}</p>
            </div>
          `;
        } else {
          projectsGrid.innerHTML = filtered.map((project, idx) => createProjectCardHTML(project, idx)).join("");
        }

        setupCardEventListeners();

        // Update "View All Projects" button visibility for standard grid
        if (viewAllBtn) {
          const totalInCategory = currentCategory === "all" 
            ? projectsData.length 
            : projectsData.filter(p => p.category === currentCategory).length;
          
          const viewAllLabel = window.i18n ? window.i18n.t("portfolio.viewAll") : "Lihat Semua Projek";
          const showLessLabel = window.i18n ? window.i18n.t("portfolio.showLess") : "Tampilkan Diringkas";

          if (totalInCategory > 6 && showOnlyFeatured) {
            viewAllBtn.style.display = "inline-flex";
            viewAllBtn.innerHTML = `${viewAllLabel} (${totalInCategory}) <i class="ri-arrow-right-line ml-2"></i>`;
          } else if (!showOnlyFeatured) {
            viewAllBtn.style.display = "inline-flex";
            viewAllBtn.innerHTML = `${showLessLabel} <i class="ri-arrow-up-s-line ml-2"></i>`;
          } else {
            viewAllBtn.style.display = "none";
          }
        }
      }

      if (animate) {
        requestAnimationFrame(() => {
          projectsGrid.style.opacity = "1";
          projectsGrid.style.transform = "translateY(0)";
        });
      }

      // Refresh AOS animations if active
      if (window.AOS) {
        setTimeout(() => {
          if (typeof window.AOS.refreshHard === "function") {
            window.AOS.refreshHard();
          } else if (typeof window.AOS.refresh === "function") {
            window.AOS.refresh();
          }
        }, 50);
      }
    };

    if (animate) {
      projectsGrid.style.opacity = "0";
      projectsGrid.style.transform = "translateY(12px)";
      setTimeout(doRender, 180);
    } else {
      doRender();
    }
  }

  // Create Modern Case-Study Card HTML (Linear / Vercel Aesthetic)
  function createProjectCardHTML(project, idx = 0) {
    const loc = window.i18n ? window.i18n.getLocalizedProject(project) : project;
    const isEn = window.i18n && window.i18n.getLanguage() === "en";

    const statusLabel = loc.status === "Production" 
      ? (isEn ? "Production" : "Produksi")
      : loc.status === "Completed"
      ? (isEn ? "Completed" : "Selesai")
      : loc.status;

    const statusColor = loc.status === "Production" 
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : loc.status === "Completed"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

    const techBadgesHTML = loc.techStack.slice(0, 5).map(tech => `
      <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5">
        <i class="${tech.icon} ${tech.color}"></i> ${tech.name}
      </span>
    `).join("");

    const extraTechCount = loc.techStack.length > 5 ? loc.techStack.length - 5 : 0;
    const staggerDelay = (idx % 3) * 100;

    const timelineText = isEn ? loc.timeline.replace("Sekarang", "Present") : loc.timeline;
    const readCaseStudyText = window.i18n ? window.i18n.t("portfolio.readCaseStudy") : "Baca Case Study";

    return `
      <div class="project-card group bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between interactive-element" data-aos="fade-up" data-aos-delay="${staggerDelay}">
        
        <!-- Thumbnail & Badges -->
        <div>
          <div class="h-52 overflow-hidden relative bg-gray-900/5 dark:bg-black/30 border-b border-gray-100 dark:border-white/5">
            <img src="${loc.thumbnailUrl}" alt="${loc.title}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out" />
            
            <!-- Category Badge -->
            <div class="absolute top-4 left-4 z-10">
              <span class="bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md border border-gray-200/80 dark:border-white/10 text-primary dark:text-secondary text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                ${loc.categoryLabel}
              </span>
            </div>

            <!-- Status Badge -->
            <div class="absolute top-4 right-4 z-10">
              <span class="backdrop-blur-md border text-xs font-medium px-2.5 py-1 rounded-md shadow-sm ${statusColor}">
                • ${statusLabel}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Role -->
            <div class="flex items-center gap-2 mb-2 text-xs font-mono text-secondary tracking-wide uppercase font-semibold">
              <i class="ri-user-settings-line"></i> ${loc.role}
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-primary dark:text-white group-hover:text-secondary transition-colors line-clamp-1 mb-2">
              ${loc.title}
            </h3>

            <!-- Short Description -->
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6">
              ${loc.shortDescription || (loc.overview ? loc.overview.what : '')}
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
            <i class="ri-calendar-line"></i> ${timelineText}
          </span>
          <button class="view-case-study-btn bg-primary/5 hover:bg-primary text-primary hover:text-white dark:bg-secondary/10 dark:hover:bg-secondary dark:text-secondary dark:hover:text-primary text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 interactive-element" data-slug="${loc.slug}">
            ${readCaseStudyText} <i class="ri-arrow-right-up-line text-sm"></i>
          </button>
        </div>

      </div>
    `;
  }

  // Dedicated DevOps Portfolio View (9 Sections)
  function buildDevOpsViewHTML() {
    const isEn = window.i18n && window.i18n.getLanguage() === "en";

    const managedApps = [
      { name: "SweetEscape", category: isEn ? "Mobile & Web App" : "Aplikasi Mobile & Web", tech: "Node.js, Docker, Nginx", logo: "asset/logo/sweet-escape-logo.svg" },
      { name: "Kosmik", category: isEn ? "Enterprise Platform" : "Platform Enterprise", tech: "Docker, Nginx, SSL", logo: "asset/logo/logo-kosmik.png" },
      { name: "DOMS", category: isEn ? "Operational Platform" : "Platform Operasional", tech: "Linux, Nginx, PostgreSQL", logo: "asset/logo/logo-doms.svg" },
      { name: "Elkopra", category: isEn ? "Cooperative PWA" : "PWA Koperasi", tech: "Laravel, Docker, PWA", logo: "asset/logo/logo-elkopra.svg", slug: "elkopra-financial-system" },
      { name: "Kopkar Anggota", category: isEn ? "Cooperative Mobile" : "Koperasi Mobile", tech: "Flutter, IoT Vending API", logo: "asset/logo/logo-kopkar.png", slug: "kopkar-toyota" },
      { name: "ERP Kopkar Toyota", category: isEn ? "Cooperative ERP System" : "Sistem ERP Koperasi", tech: "Frappe, ERPNext, Docker", logo: "asset/logo/logo-kopkar.png", slug: "erp-kopkar-toyota" },
      { name: "ERP Itekraf", category: isEn ? "Enterprise ERP System" : "Sistem ERP Enterprise", tech: "Frappe, Python, MariaDB", logo: "", slug: "erp-itekraf" },
      { name: "NAIQ User", category: isEn ? "Mobile App" : "Aplikasi Mobile", tech: "Flutter, Firebase, REST API", logo: "asset/logo/naiq-logo.png", slug: "naiq-shuttle-app" },
      { name: "NAIQ Driver", category: isEn ? "Driver Tracking" : "Tracking Pengemudi", tech: "React Native, Google Maps", logo: "asset/logo/logo-naiq-driver.png" },
      { name: "Walagiri", category: isEn ? "Agriculture System" : "Sistem Pertanian", tech: "Vue.js, Docker, Nginx", logo: "asset/logo/logo-wallagri.png" },
      { name: "Dapen", category: isEn ? "Pension Fund System" : "Sistem Dana Pensiun", tech: "Laravel, MySQL, Docker", logo: "asset/logo/logo-dapen.svg" },
      { name: "E-Pass", category: isEn ? "Access Control" : "Akses Kontrol", tech: "Node.js, Redis, Nginx", logo: "asset/logo/logo-epass.svg" },
      { name: "LSP", category: isEn ? "Certification Portal" : "Portal Sertifikasi", tech: "PHP, MariaDB, Linux", logo: "asset/logo/Logo-lsp.png" },
      { name: "Komuditi", category: isEn ? "Commodity System" : "Sistem Komoditas", tech: "Node.js, Docker Swarm", logo: "asset/logo/logo-komuditi.png" },
      { name: "Dialogue", category: isEn ? "Web App" : "Aplikasi Web", tech: "React, Express, PostgreSQL", logo: "asset/logo/logo-dialogue.jpeg" },
      { name: "RPSM", category: isEn ? "Management System" : "Sistem Manajemen", tech: "Laravel, MariaDB, Docker", logo: "" },
      { name: "Flexa", category: isEn ? "SaaS App" : "Aplikasi SaaS", tech: "Node.js, Redis, Docker Swarm", logo: "" },
      { name: "Presensy", category: isEn ? "Attendance System" : "Sistem Presensi", tech: "Laravel, MySQL, Certbot", logo: "" },
      { name: "Spendora", category: isEn ? "Finance App" : "Aplikasi Keuangan", tech: "Flutter, REST API", logo: "asset/logo/logo-ios.png", slug: "spendora-finance-app" }
    ];

    const logoGridHTML = managedApps.map((app, idx) => `
      <div class="devops-app-badge group relative bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:border-secondary/50 hover:shadow-lg hover:bg-white dark:hover:bg-dark-surface cursor-pointer" ${app.slug ? `data-slug="${app.slug}"` : ''} data-aos="zoom-in" data-aos-delay="${(idx % 4) * 60}">
        <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-white text-gray-900 flex items-center justify-center font-bold mb-2.5 group-hover:scale-110 transition-transform overflow-hidden p-2.5 shadow-sm border border-gray-200/60 dark:border-white">
          ${app.logo 
            ? `<img src="${app.logo}" alt="${app.name}" class="w-full h-full object-contain" />`
            : `<span class="text-2xl font-bold font-mono text-gray-900">${app.name.charAt(0)}</span>`
          }
        </div>
        <div class="text-xs font-bold text-primary dark:text-white line-clamp-1 group-hover:text-secondary transition-colors">${app.name}</div>

        <!-- Tooltip on hover -->
        <div class="absolute bottom-full mb-2 hidden group-hover:block z-20 w-44 bg-gray-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl border border-white/10 pointer-events-none text-center">
          <div class="font-bold text-secondary">${app.name}</div>
          <div class="text-gray-300 text-[10px] mt-0.5">${app.category}</div>
          ${app.slug ? `<div class="text-emerald-400 text-[9px] mt-1.5 flex items-center justify-center gap-1 font-mono"><i class="ri-eye-line"></i> ${isEn ? "View Case Study" : "Lihat Case Study"}</div>` : ''}
        </div>
      </div>
    `).join("");

    return `
      <div class="space-y-16 w-full text-left">
        
        <!-- SECTION 1: HERO -->
        <div class="bg-gradient-to-br from-white/80 to-white/40 dark:from-dark-surface/90 dark:to-dark-bg/90 border border-gray-200/80 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden" data-aos="fade-up">
          <div class="max-w-3xl relative z-10 space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono font-semibold">
              <span class="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              ${isEn ? "DevSecOps & Infrastructure Engineering" : "Teknik DevSecOps & Infrastruktur"}
            </div>
            <h1 class="text-3xl md:text-5xl font-bold text-primary dark:text-white tracking-tight">
              ${isEn ? "DevSecOps Portfolio" : "DevSecOps Portofolio"}
            </h1>
            <p class="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              ${isEn
                ? "Building reliable and secure infrastructure, integrating security pipelines (SonarQube SAST & OWASP ZAP DAST), automating deployments, and maintaining sustainable production systems."
                : "Membangun infrastruktur yang andal dan aman, mengintegrasikan security pipeline (SAST SonarQube & DAST OWASP ZAP), mengotomatisasi deployment, serta mengelola sistem produksi secara berkelanjutan."}
            </p>
          </div>

          <!-- Hero Stats Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200/60 dark:border-white/10">
            <div class="bg-white/60 dark:bg-black/30 border border-gray-200/60 dark:border-white/10 p-4 rounded-2xl text-center hover:border-secondary/40 transition-colors" data-aos="fade-up" data-aos-delay="50">
              <div class="text-2xl md:text-3xl font-bold text-primary dark:text-secondary font-mono">12+</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">${isEn ? "Production Apps" : "Aplikasi Produksi"}</div>
            </div>
            <div class="bg-white/60 dark:bg-black/30 border border-gray-200/60 dark:border-white/10 p-4 rounded-2xl text-center hover:border-secondary/40 transition-colors" data-aos="fade-up" data-aos-delay="100">
              <div class="text-2xl md:text-3xl font-bold text-primary dark:text-secondary font-mono">50+</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">${isEn ? "System Deployments" : "Deployment Sistem"}</div>
            </div>
            <div class="bg-white/60 dark:bg-black/30 border border-gray-200/60 dark:border-white/10 p-4 rounded-2xl text-center hover:border-secondary/40 transition-colors" data-aos="fade-up" data-aos-delay="150">
              <div class="text-2xl md:text-3xl font-bold text-primary dark:text-secondary font-mono">99%</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">${isEn ? "Service Availability" : "Ketersediaan Layanan"}</div>
            </div>
            <div class="bg-white/60 dark:bg-black/30 border border-gray-200/60 dark:border-white/10 p-4 rounded-2xl text-center hover:border-secondary/40 transition-colors" data-aos="fade-up" data-aos-delay="200">
              <div class="text-2xl md:text-3xl font-bold text-emerald-500 dark:text-emerald-400 font-mono">SAST &amp; DAST</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">DevSecOps Gates</div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: FEATURED CASE STUDY -->
        <div class="space-y-6" data-aos="fade-up">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-mono font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <i class="ri-star-line"></i> ${isEn ? "Featured Case Study" : "Case Study Unggulan"}
            </h3>
            <span class="text-xs text-gray-400 font-mono">${isEn ? "Key Infrastructure Highlight" : "Sorotan Utama Infrastruktur"}</span>
          </div>

          <div class="bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 relative h-64 lg:h-full rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 bg-gray-900/40 min-h-[220px]">
              <img src="asset/7.png" alt="Server Monitoring Platform" class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
              <div class="absolute top-3 left-3 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md text-secondary text-xs font-semibold px-3 py-1 rounded-lg border border-white/10">
                ${isEn ? "Key Highlight" : "Sorotan Utama"}
              </div>
            </div>

            <div class="lg:col-span-7 space-y-4">
              <div class="flex flex-wrap items-center gap-3">
                <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${isEn ? "Production Status" : "Status Produksi"}
                </span>
                <span class="bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary text-xs font-mono px-3 py-1 rounded-full">
                  ${isEn ? "Role: Fullstack & DevSecOps" : "Peran: Fullstack & DevSecOps"}
                </span>
              </div>

              <h2 class="text-2xl md:text-3xl font-bold text-primary dark:text-white">
                Server Monitoring Platform
              </h2>

              <p class="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                ${isEn
                  ? "Realtime multi-node server & website monitoring platform integrated with Telegram, WhatsApp, & AI Assistant alerts. Prevents undetected downtime by delivering immediate notifications (<5 seconds)."
                  : "Platform web pemantauan server & website multi-node realtime terintegrasi dengan alert Telegram, WhatsApp, & AI Assistant. Mencegah terjadinya downtime tanpa terdeteksi dengan memberikan notifikasi seketika (<5 detik)."}
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
                  ${isEn ? "Read Full Case Study" : "Baca Case Study Selengkapnya"} <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2.5: DEVOPS CASE STUDIES GRID -->
        <div class="space-y-6" data-aos="fade-up">
          <div class="flex items-center justify-between">
            <h3 class="text-xl md:text-2xl font-bold text-primary dark:text-white">
              ${isEn ? "DevSecOps & Infrastructure Case Studies" : "Studi Kasus DevSecOps & Infrastruktur"}
            </h3>
            <span class="text-xs text-gray-400 font-mono">${isEn ? "Enterprise Architecture & Deployments" : "Arsitektur & Deployment Enterprise"}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- ERP Kopkar Toyota -->
            <div class="bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-secondary/40 transition-all shadow-md group" data-aos="fade-up" data-aos-delay="0">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary text-xs font-mono px-3 py-1 rounded-full">
                    ${isEn ? "Cooperative ERP System" : "Sistem ERP Koperasi"}
                  </span>
                  <span class="text-xs font-mono text-emerald-500 font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${isEn ? "Production" : "Produksi"}
                  </span>
                </div>
                <h4 class="text-xl font-bold text-primary dark:text-white group-hover:text-secondary transition-colors">
                  ERP Kopkar Toyota Infrastructure &amp; Deployment
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  ${isEn
                    ? "Centralized ERPNext & Frappe infrastructure for Toyota Employee Cooperative, featuring Docker automated deployment, Nginx reverse proxy, and automated daily backups."
                    : "Infrastruktur ERPNext & Frappe terpusat untuk Koperasi Karyawan Toyota, mencakup otomatisasi deployment Docker, reverse proxy Nginx, dan backup otomatis harian."}
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Frappe / ERPNext</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Nginx</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">MariaDB</span>
                </div>
              </div>
              <div class="pt-4 mt-4 border-t border-gray-200/60 dark:border-white/10">
                <button class="view-case-study-btn bg-primary text-white dark:bg-secondary dark:text-primary font-semibold text-xs px-5 py-2.5 rounded-xl hover:shadow-md transition-all flex items-center gap-2 interactive-element" data-slug="erp-kopkar-toyota">
                  ${isEn ? "Read Case Study" : "Baca Case Study"} <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>

            <!-- ERP Itekraf -->
            <div class="bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-secondary/40 transition-all shadow-md group" data-aos="fade-up" data-aos-delay="100">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary text-xs font-mono px-3 py-1 rounded-full">
                    ${isEn ? "Enterprise ERP System" : "Sistem ERP Enterprise"}
                  </span>
                  <span class="text-xs font-mono text-emerald-500 font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${isEn ? "Production" : "Produksi"}
                  </span>
                </div>
                <h4 class="text-xl font-bold text-primary dark:text-white group-hover:text-secondary transition-colors">
                  ERP Itekraf Enterprise Infrastructure
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  ${isEn
                    ? "Enterprise ERP infrastructure for Itekraf with Frappe / ERPNext containerization, automated SSL management, and hardened VPS server security."
                    : "Infrastruktur ERP Enterprise Itekraf dengan kontainerisasi Frappe / ERPNext, manajemen SSL otomatis, dan pengerasan keamanan server VPS."}
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Frappe / ERPNext</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Python</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">MariaDB</span>
                </div>
              </div>
              <div class="pt-4 mt-4 border-t border-gray-200/60 dark:border-white/10">
                <button class="view-case-study-btn bg-primary text-white dark:bg-secondary dark:text-primary font-semibold text-xs px-5 py-2.5 rounded-xl hover:shadow-md transition-all flex items-center gap-2 interactive-element" data-slug="erp-itekraf">
                  ${isEn ? "Read Case Study" : "Baca Case Study"} <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>

            <!-- CI/CD Swarm -->
            <div class="bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-secondary/40 transition-all shadow-md group" data-aos="fade-up" data-aos-delay="0">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary text-xs font-mono px-3 py-1 rounded-full">
                    ${isEn ? "CI/CD Automation" : "Otomatisasi CI/CD"}
                  </span>
                  <span class="text-xs font-mono text-emerald-500 font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${isEn ? "Production" : "Produksi"}
                  </span>
                </div>
                <h4 class="text-xl font-bold text-primary dark:text-white group-hover:text-secondary transition-colors">
                  CI/CD Automation &amp; Docker Swarm Cluster
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  ${isEn
                    ? "Automated CI/CD workflow leveraging GitHub Actions & Docker Registry for zero-downtime deployments across a Docker Swarm cluster."
                    : "Alur kerja CI/CD otomatis menggunakan GitHub Actions & Docker Registry untuk deployment kluster Docker Swarm tanpa downtime."}
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">GitHub Actions</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker Swarm</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Portainer</span>
                </div>
              </div>
              <div class="pt-4 mt-4 border-t border-gray-200/60 dark:border-white/10">
                <button class="view-case-study-btn bg-primary text-white dark:bg-secondary dark:text-primary font-semibold text-xs px-5 py-2.5 rounded-xl hover:shadow-md transition-all flex items-center gap-2 interactive-element" data-slug="cicd-swarm-infrastructure">
                  ${isEn ? "Read Case Study" : "Baca Case Study"} <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>

            <!-- SonarQube & OWASP ZAP Quality Gate -->
            <div class="bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-secondary/40 transition-all shadow-md group" data-aos="fade-up" data-aos-delay="100">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary text-xs font-mono px-3 py-1 rounded-full">
                    DevSecOps: SAST &amp; DAST
                  </span>
                  <span class="text-xs font-mono text-emerald-500 font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${isEn ? "Production" : "Produksi"}
                  </span>
                </div>
                <h4 class="text-xl font-bold text-primary dark:text-white group-hover:text-secondary transition-colors">
                  SonarQube &amp; OWASP ZAP DevSecOps Pipeline
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  ${isEn
                    ? "Automated static application security testing (SAST SonarQube) & dynamic application security scanning (DAST OWASP ZAP) pipeline in CI/CD."
                    : "Pipeline otomatis pengujian keamanan kode statis (SAST SonarQube) & pemindaian kerentanan web dinamis (DAST OWASP ZAP) pada CI/CD."}
                </p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">SonarQube</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">OWASP ZAP</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">SAST/DAST</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker</span>
                  <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-[11px] font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">GitHub Actions</span>
                </div>
              </div>
              <div class="pt-4 mt-4 border-t border-gray-200/60 dark:border-white/10">
                <button class="view-case-study-btn bg-primary text-white dark:bg-secondary dark:text-primary font-semibold text-xs px-5 py-2.5 rounded-xl hover:shadow-md transition-all flex items-center gap-2 interactive-element" data-slug="sonarqube-code-quality-gate">
                  ${isEn ? "Read Case Study" : "Baca Case Study"} <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: PRODUCTION INFRASTRUCTURE -->
        <div class="space-y-6" data-aos="fade-up">
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-primary dark:text-white">
              ${isEn ? "Managed Production Applications" : "Aplikasi Produksi yang Dikelola"}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ${isEn
                ? "Active production environments and microservices under continuous maintenance."
                : "Lingkungan produksi aktif dan microservices di bawah pemeliharaan berkelanjutan."}
            </p>
          </div>

          <!-- Logo Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            ${logoGridHTML}
          </div>

          <!-- Responsibilities Footer Bar -->
          <div class="bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 p-5 rounded-2xl flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono text-gray-600 dark:text-gray-300 text-center">
            <span class="font-bold text-primary dark:text-secondary uppercase">${isEn ? "Responsible for:" : "Bertanggung jawab atas:"}</span>
            <span>DevSecOps Pipeline</span> <span class="text-gray-400">•</span>
            <span>Security Scan (SAST/DAST)</span> <span class="text-gray-400">•</span>
            <span>OWASP ZAP Auditing</span> <span class="text-gray-400">•</span>
            <span>${isEn ? "Automated Deployment" : "Deployment Otomatis"}</span> <span class="text-gray-400">•</span>
            <span>${isEn ? "Swarm Infrastructure" : "Infrastruktur Swarm"}</span> <span class="text-gray-400">•</span>
            <span>${isEn ? "Multi-node Monitoring" : "Pemantauan Multi-node"}</span> <span class="text-gray-400">•</span>
            <span>${isEn ? "SSL/TLS Certificates" : "Sertifikat SSL/TLS"}</span> <span class="text-gray-400">•</span>
            <span>Reverse Proxy Gateway</span> <span class="text-gray-400">•</span>
            <span>${isEn ? "Docker Containers" : "Kontainer Docker"}</span> <span class="text-gray-400">•</span>
            <span>${isEn ? "Server Maintenance" : "Pemeliharaan Server"}</span>
          </div>
        </div>

        <!-- SECTION 4: INFRASTRUCTURE EXPERTISE -->
        <div class="space-y-6" data-aos="fade-up">
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-primary dark:text-white">
              ${isEn ? "Infrastructure Expertise & Capabilities" : "Keahlian & Kapabilitas Infrastruktur"}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ${isEn
                ? "Core technical capabilities in containerization, automation, security, and system observability."
                : "Kapabilitas teknis utama dalam kontainerisasi, otomatisasi, keamanan, dan observabilitas sistem."}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 1. Containerization -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl">
                  <i class="ri-box-3-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "System Containerization" : "Kontainerisasi Sistem"}</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker Compose</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker Swarm</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                ${isEn
                  ? "Packaging application environments into isolated lightweight containers and configuring Docker Swarm clusters for zero-downtime rolling updates."
                  : "Mengemas lingkungan aplikasi ke dalam kontainer ringan terisolasi dan mengorientasikan kluster Docker Swarm untuk pembaruan tanpa downtime (zero-downtime rolling updates)."}
              </p>
            </div>

            <!-- 2. CI/CD -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">
                  <i class="ri-git-merge-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "CI/CD Automation" : "Otomatisasi CI/CD"}</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">GitHub Actions</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Docker Hub</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">${isEn ? "Release Automation" : "Otomatisasi Release"}</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                ${isEn
                  ? "Building automated testing workflows, multi-arch container image builds, publishing to Docker registries, and automated deployment triggers to VPS servers."
                  : "Membangun alur pengujian otomatis, pembuatan image kontainer multi-arsitektur, publikasi ke Docker registry, dan pemicu otomatis deployment ke server VPS."}
              </p>
            </div>

            <!-- 3. Reverse Proxy -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">
                  <i class="ri-global-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "Reverse Proxy & Networking" : "Reverse Proxy & Jaringan"}</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Nginx</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">SSL</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Certbot</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Cloudflare</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                ${isEn
                  ? "Centralized gateway routing setup, DDoS mitigation via Cloudflare WAF, HTTP security headers hardening, and automated Let's Encrypt SSL/TLS renewals."
                  : "Pengaturan routing gateway terpusat, mitigasi DDoS via Cloudflare WAF, penguatan keamanan header HTTP, dan pembaruan otomatis SSL/TLS Let's Encrypt."}
              </p>
            </div>

            <!-- 4. DevSecOps & Security Testing -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl">
                  <i class="ri-shield-check-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "DevSecOps Security (SAST & DAST)" : "Keamanan DevSecOps (SAST & DAST)"}</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">SonarQube</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">OWASP ZAP</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">SAST</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">DAST</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Quality Gates</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                ${isEn
                  ? "Static application security testing (SAST) with SonarQube and dynamic security scanning (DAST) using OWASP ZAP to detect OWASP Top 10 vulnerabilities prior to production release."
                  : "Pengujian keamanan kode statis (SAST) dengan SonarQube dan pemindaian keamanan dinamis (DAST) menggunakan OWASP ZAP untuk mendeteksi kerentanan web OWASP Top 10 sebelum rilis produksi."}
              </p>
            </div>

            <!-- 5. Monitoring -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl">
                  <i class="ri-notification-3-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "Monitoring & Observability" : "Pemantauan & Observabilitas"}</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Website Monitoring</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">API &amp; SSL</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Telegram</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">n8n</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                ${isEn
                  ? "Realtime multi-node server health monitoring with instant notifications dispatched via Telegram, WhatsApp, and n8n automated workflows."
                  : "Pemantauan kesehatan server multi-node realtime dengan notifikasi instan yang dikirim melalui Telegram, WhatsApp, dan alur kerja otomatis n8n."}
              </p>
            </div>

            <!-- 6. Operating System -->
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-4 hover:border-secondary/40 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center text-xl">
                  <i class="ri-terminal-box-line"></i>
                </div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "Operating Systems & VPS Servers" : "Sistem Operasi & Server VPS"}</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Ubuntu</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Linux</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">VPS</span>
                <span class="bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-mono px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Vultr</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                ${isEn
                  ? "Linux Ubuntu server administration, SSH access hardening, firewall configuration, memory/swap optimization, and automated backup scheduling."
                  : "Administrasi server Linux Ubuntu, penguatan keamanan akses SSH, konfigurasi firewall, optimalisasi memori/swap, dan pembuatan pencadangan otomatis."}
              </p>
            </div>
          </div>
        </div>

        <!-- SECTION 8: ACHIEVEMENTS -->
        <div class="space-y-6" data-aos="fade-up">
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-primary dark:text-white">
              ${isEn ? "Infrastructure & DevSecOps Achievements" : "Pencapaian Infrastruktur & DevSecOps"}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ${isEn
                ? "Key operational results, security automation milestones, and infrastructure engineering impact."
                : "Hasil utama operasional teknis, otomatisasi keamanan, dan dampak rekayasa infrastruktur."}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-apps-2-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "Managed Production Apps" : "Aplikasi Produksi Dikelola"}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  ${isEn
                    ? "12+ active production apps and microservices maintained with 99.9% availability."
                    : "12+ aplikasi dan microservices produksi aktif dipelihara dengan tingkat ketersediaan 99.9%."}
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-rocket-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "Production Deployments" : "Deployment Produksi"}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  ${isEn
                    ? "50+ automated releases executed with zero-downtime rolling updates."
                    : "50+ rilis otomatis dijalankan dengan pembaruan tanpa downtime (zero-downtime rolling updates)."}
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-pulse-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "Self-Hosted Monitoring Platform" : "Platform Monitoring Mandiri"}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  ${isEn
                    ? "Engineered and deployed a realtime multi-node monitoring platform with Telegram & WhatsApp alert systems."
                    : "Merancang dan mendeploy platform pemantauan multi-node realtime dengan sistem alert Telegram & WhatsApp."}
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-shield-keyhole-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "DevSecOps & CI/CD Pipeline" : "Pipeline DevSecOps & CI/CD"}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  ${isEn
                    ? "SonarQube & OWASP ZAP automated security scanning reduced vulnerabilities and slashed release cycle from 2 hours to <3 minutes."
                    : "Otomatisasi pengujian keamanan SonarQube & OWASP ZAP memangkas celah kerentanan serta memotong waktu rilis dari 2 jam menjadi <3 menit."}
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-cpu-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "Infrastructure Automation" : "Otomatisasi Infrastruktur"}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  ${isEn
                    ? "Packaged all services into a self-healing Docker Swarm cluster."
                    : "Mengemas seluruh layanan ke dalam kluster Docker Swarm dengan mekanisme pemulihan otomatis."}
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-2xl flex-shrink-0">
                <i class="ri-key-2-line"></i>
              </div>
              <div>
                <h4 class="font-bold text-primary dark:text-white text-base">${isEn ? "SSL Certificate Automation" : "Otomatisasi Sertifikat SSL"}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  ${isEn
                    ? "Automated 100% of TLS/SSL renewals via Certbot scheduled tasks & Cloudflare DNS challenges."
                    : "Mengotomatiskan 100% perpanjangan sertifikat TLS/SSL menggunakan tugas berkala Certbot & Cloudflare DNS challenge."}
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

    // Case study trigger buttons & clickable app badges inside DevOps view
    projectsGrid.querySelectorAll(".view-case-study-btn, .devops-app-badge[data-slug]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const slug = btn.getAttribute("data-slug");
        if (slug) openCaseStudy(slug);
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
        renderProjects(true);
      });
    });

    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        showOnlyFeatured = !showOnlyFeatured;
        renderProjects(true);
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
    } else if (caseStudyModal && caseStudyModal.classList.contains("active")) {
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
    // Ensure smooth frame transition
    requestAnimationFrame(() => {
      caseStudyModal.classList.add("active");
      caseStudyContainer.classList.add("active");
    });
    document.body.classList.add("overflow-hidden");

    // Scroll to top of modal
    const scrollContainer = caseStudyModal.querySelector(".modal-scroll-area") || caseStudyModal;
    scrollContainer.scrollTop = 0;

    // Attach internal listeners inside modal (close buttons, gallery lightbox)
    caseStudyContainer.querySelectorAll(".close-modal-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeCaseStudy(true);
      });
    });

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
    caseStudyModal.classList.remove("active");
    if (caseStudyContainer) caseStudyContainer.classList.remove("active");
    document.body.classList.remove("overflow-hidden");

    if (updateHash && window.location.hash.startsWith("#case-study/")) {
      if (window.history.pushState) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      } else {
        window.location.hash = "";
      }
    }
  }

  // Delegated event listener for any close modal button click
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest(".close-modal-btn");
    if (closeBtn && caseStudyModal && caseStudyModal.classList.contains("active")) {
      e.preventDefault();
      closeCaseStudy(true);
    }
  });

  // Build Comprehensive Case Study HTML Page
  function buildCaseStudyHTML(project) {
    const isEn = window.i18n && window.i18n.getLanguage() === "en";
    const loc = window.i18n ? window.i18n.getLocalizedProject(project) : project;

    // 1. Hero Tech Badges
    const techBadges = (loc.techStack || project.techStack || []).map(t => `
      <span class="bg-white dark:bg-white/10 border border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-mono px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
        <i class="${t.icon} ${t.color}"></i> ${t.name}
      </span>
    `).join("");

    // 2. Architecture Nodes HTML
    const archList = loc.architecture || project.architecture || [];
    const architectureHTML = archList.map((node, index) => {
      const isLast = index === archList.length - 1;
      return `
        <div class="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto relative group">
          <!-- Step Node Block -->
          <div class="bg-white dark:bg-dark-surface border border-gray-200/80 dark:border-white/15 p-4 rounded-xl shadow-sm flex items-center gap-3 w-full md:w-56 hover:border-secondary/50 hover:shadow-md transition-all duration-300">
            <div class="w-10 h-10 rounded-lg bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary flex items-center justify-center flex-shrink-0 text-xl font-bold">
              <i class="${node.icon}"></i>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold">${isEn ? "Step" : "Langkah"} ${node.step}</div>
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
    const respList = loc.responsibilities || project.responsibilities || [];
    const responsibilitiesHTML = respList.map(item => `
      <li class="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
        <i class="ri-checkbox-circle-fill text-secondary text-base mt-0.5 flex-shrink-0"></i>
        <span>${item}</span>
      </li>
    `).join("");

    // 4. Results Highlights
    const resultsList = loc.results || project.results || [];
    const resultsHTML = resultsList.map(item => `
      <div class="bg-white dark:bg-dark-surface border border-gray-200/80 dark:border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg flex-shrink-0">
          <i class="ri-trophy-line"></i>
        </div>
        <span class="text-sm font-semibold text-primary dark:text-white">${item}</span>
      </div>
    `).join("");

    // 5. Gallery Lightbox Grid
    const galleryList = loc.gallery || project.gallery || [];
    const galleryHTML = galleryList.length > 0 ? galleryList.map(item => `
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
              <span class="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 font-bold uppercase text-[11px] text-secondary tracking-wider font-mono flex-shrink-0">${loc.categoryLabel}</span>
              <span class="text-gray-300 dark:text-gray-700 hidden sm:inline">|</span>
              <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate hidden sm:inline">${loc.title}</span>
            </div>
            <button class="close-modal-btn group bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 text-xs font-medium interactive-element">
              <span>${isEn ? "Close" : "Tutup"}</span>
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
                ${isEn ? "Role" : "Peran"}: ${loc.role}
              </span>
              <span class="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/10">
                ${isEn ? "Timeline" : "Waktu"}: ${loc.timeline}
              </span>
              <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Status: ${loc.status}
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary dark:text-white tracking-tight leading-tight">
              ${loc.title}
            </h1>

            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
              ${loc.shortDescription || (loc.overview ? loc.overview.what : '')}
            </p>

            <!-- Action Buttons & Tech Stack -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200/80 dark:border-white/10">
              <div class="flex flex-wrap gap-2">
                ${techBadges}
              </div>
              
              <div class="flex items-center gap-3 flex-shrink-0">
                ${loc.githubUrl ? `
                  <a href="${loc.githubUrl}" target="_blank" class="bg-gray-900 hover:bg-black text-white dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 interactive-element">
                    <i class="ri-github-fill text-base"></i> ${isEn ? "GitHub Repository" : "Repository GitHub"}
                  </a>
                ` : ''}
                ${loc.demoUrl ? `
                  <a href="${loc.demoUrl}" target="_blank" class="bg-secondary text-primary font-semibold text-xs px-4 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 interactive-element">
                    <i class="ri-external-link-line text-base"></i> Live Demo
                  </a>
                ` : ''}
              </div>
            </div>
          </section>

          <!-- HERO THUMBNAIL PREVIEW -->
          <div class="rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-xl bg-gray-900/40 max-h-[500px]">
            <img src="${loc.thumbnailUrl}" alt="${loc.title}" class="w-full h-full object-cover object-top" />
          </div>

          <!-- 2. OVERVIEW -->
          <section class="space-y-6">
            <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary flex items-center justify-center text-base"><i class="ri-compass-3-line"></i></span>
              ${isEn ? "Executive Summary" : "Ringkasan Eksekutif"}
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                <h3 class="text-xs font-mono font-bold uppercase text-secondary">${isEn ? "What Was Built" : "Apa yang Dibangun"}</h3>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${loc.overview ? loc.overview.what : ''}</p>
              </div>
              
              <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                <h3 class="text-xs font-mono font-bold uppercase text-secondary">${isEn ? "Target Audience" : "Target Pengguna"}</h3>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${loc.overview ? loc.overview.who : ''}</p>
              </div>

              <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                <h3 class="text-xs font-mono font-bold uppercase text-secondary">${isEn ? "Core Value Created" : "Nilai Utama yang Dihasilkan"}</h3>
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${loc.overview ? loc.overview.problemSolved : ''}</p>
              </div>
            </div>
          </section>

          <!-- 3. THE PROBLEM -->
          <section class="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-6 md:p-8 rounded-2xl space-y-3">
            <h2 class="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <i class="ri-error-warning-line"></i> ${isEn ? "The Problem & Operational Bottlenecks" : "Tantangan & Kendala Operasional"}
            </h2>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              ${loc.problem}
            </p>
          </section>

          <!-- 4. SYSTEM ARCHITECTURE & TOPOLOGY -->
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-base"><i class="ri-mind-map"></i></span>
                ${isEn ? "Architecture Topology & Flow" : "Topologi Arsitektur & Alur Kerja"}
              </h2>
              <span class="text-xs font-mono text-gray-400 hidden sm:inline">${isEn ? "Interactive Pipeline" : "Pipeline Interaktif"}</span>
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
              ${isEn ? "Key Responsibilities & Deliverables" : "Tanggung Jawab & Kontribusi Kunci"}
            </h2>

            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm">
              ${responsibilitiesHTML}
            </ul>
          </section>

          <!-- 6. KEY RESULTS -->
          <section class="space-y-6">
            <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-base"><i class="ri-medal-line"></i></span>
              ${isEn ? "Measurable Outcomes & Results" : "Hasil Terukur & Pencapaian"}
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${resultsHTML}
            </div>
          </section>

          <!-- 7. GALLERY & SCREENSHOTS -->
          ${galleryList.length > 0 ? `
            <section class="space-y-6">
              <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center text-base"><i class="ri-image-line"></i></span>
                ${isEn ? "Architecture Gallery & Visual Artifacts" : "Galeri Arsitektur & Tangkapan Layar"}
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                ${galleryHTML}
              </div>
            </section>
          ` : ''}

          <!-- 8. LESSONS LEARNED -->
          ${loc.learnings ? `
            <section class="space-y-6">
              <h2 class="text-xl sm:text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
                <span class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-base"><i class="ri-lightbulb-line"></i></span>
                ${isEn ? "What I Learned" : "Pembelajaran & Evaluasi"}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                  <h3 class="text-xs font-mono font-bold uppercase text-amber-500 flex items-center gap-2">
                    <i class="ri-flag-line"></i> ${isEn ? "Technical Challenges" : "Tantangan Teknis"}
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${loc.learnings.challenges}</p>
                </div>

                <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                  <h3 class="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-2">
                    <i class="ri-bug-line"></i> ${isEn ? "Mistakes & Pitfalls" : "Kendala & Catatan Evaluasi"}
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${loc.learnings.mistakes}</p>
                </div>

                <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                  <h3 class="text-xs font-mono font-bold uppercase text-emerald-500 flex items-center gap-2">
                    <i class="ri-key-line"></i> ${isEn ? "Solutions Applied" : "Solusi yang Diterapkan"}
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${loc.learnings.solutions}</p>
                </div>

                <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 space-y-2 shadow-sm">
                  <h3 class="text-xs font-mono font-bold uppercase text-blue-400 flex items-center gap-2">
                    <i class="ri-rocket-line"></i> ${isEn ? "Future Improvements" : "Rencana Peningkatan"}
                  </h3>
                  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${loc.learnings.improvements}</p>
                </div>
              </div>
            </section>
          ` : ''}

          <!-- FOOTER CLOSE BUTTON -->
          <div class="pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <button class="close-modal-btn bg-primary hover:bg-black dark:bg-secondary dark:hover:bg-amber-400 text-white dark:text-primary font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg transition-all interactive-element">
              ${isEn ? "Close Case Study" : "Tutup Case Study"}
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
      if (e.target === lightboxModal || e.target.closest(".close-lightbox")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
        if (caseStudyModal && caseStudyModal.classList.contains("active")) {
          closeCaseStudy();
        }
      }
    });
  }

  function openLightbox(src, title) {
    if (!lightboxModal || !lightboxImage) return;
    lightboxImage.src = src;
    if (lightboxCaption) lightboxCaption.textContent = title || "";
    lightboxModal.classList.add("active");
    const inner = lightboxModal.querySelector(".modal-scale-smooth");
    if (inner) inner.classList.add("active");
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("active");
    const inner = lightboxModal.querySelector(".modal-scale-smooth");
    if (inner) inner.classList.remove("active");
  }

  // Start initialization
  initPortfolio();
});
