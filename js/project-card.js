/* Shared by the static build and the interactive portfolio. */
  // Create Modern Case-Study Card HTML (Linear / Vercel Aesthetic)
  function createProjectCardHTML(project, idx = 0, i18n) {
    const loc = i18n ? i18n.getLocalizedProject(project) : project;
    const isEn = i18n && i18n.getLanguage() === "en";

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
    const readCaseStudyText = i18n ? i18n.t("portfolio.readCaseStudy") : "Baca Case Study";

    return `
      <div class="project-card group bg-white dark:bg-dark-surface/90 border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between interactive-element" data-aos="fade-up" data-aos-delay="${staggerDelay}">
        
        <!-- Thumbnail & Badges -->
        <div>
          <div class="h-52 overflow-hidden relative bg-gray-900/5 dark:bg-black/30 border-b border-gray-100 dark:border-white/5">
            <img loading="lazy" decoding="async" src="${loc.thumbnailUrl}" alt="${loc.title}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out" />
            
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


if (typeof module !== "undefined") module.exports = createProjectCardHTML;
