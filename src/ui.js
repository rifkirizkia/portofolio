import AOS from '../js/aos.js';

export function initUI() {
  const html = document.documentElement;

  // --- Dark Mode Toggle & Dynamic Backgrounds ---
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  let activeSection = null;

  function updateActiveSectionBackground() {
    if (!activeSection) return;
    const isDark = html.classList.contains('dark');
    const darkBg = activeSection.getAttribute('data-bg-dark');
    const lightBg = activeSection.getAttribute('data-bg-light');
    if (darkBg && lightBg) {
      document.body.style.backgroundColor = isDark ? darkBg : lightBg;
    }
  }

  function toggleTheme() {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateActiveSectionBackground();
  }

  // Check local storage or system preference
  if (localStorage.theme === 'light') {
    html.classList.remove('dark');
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

  // --- Custom Cursor ---
  const cursor = document.getElementById('customCursor');
  const interactives = document.querySelectorAll('.interactive-element, a, button');

  if (cursor) {
    if (window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });
    } else {
      cursor.style.display = 'none'; // Hide on touch devices
    }
  }

  // --- 3D Tilt Effect ---
  const tiltWrapper = document.querySelector('.tilt-wrapper');
  const tiltElement = document.querySelector('.tilt-element');

  if (tiltWrapper && tiltElement && window.matchMedia('(pointer: fine)').matches) {
    tiltWrapper.addEventListener('mousemove', (e) => {
      const rect = tiltWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      tiltElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltWrapper.addEventListener('mouseleave', () => {
      tiltElement.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  // --- Mobile Menu Toggle with Smooth Animation ---
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function () {
      const isClosed = mobileMenu.classList.contains('menu-closed');
      const icon = mobileMenuButton.querySelector('i');
      if (isClosed) {
        mobileMenu.classList.remove('menu-closed');
        mobileMenu.classList.add('menu-open');
        if (icon) icon.classList.replace('ri-menu-line', 'ri-close-line');
      } else {
        mobileMenu.classList.remove('menu-open');
        mobileMenu.classList.add('menu-closed');
        if (icon) icon.classList.replace('ri-close-line', 'ri-menu-line');
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('menu-open');
        mobileMenu.classList.add('menu-closed');
        const icon = mobileMenuButton.querySelector('i');
        if (icon) icon.classList.replace('ri-close-line', 'ri-menu-line');
      });
    });
  }

  // --- Scroll Reveal / Entrance & Exit Animation (Bidirectional) ---
  html.classList.add('reveal-ready');
  const revealSections = document.querySelectorAll('.scroll-reveal');

  if (revealSections.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (window.AOS && typeof window.AOS.refresh === 'function') {
              window.AOS.refresh();
            }
          } else {
            entry.target.classList.remove('active');
          }
        });
      },
      {
        root: null,
        threshold: 0.05,
        rootMargin: '-20px 0px -20px 0px',
      }
    );

    revealSections.forEach((section) => {
      revealObserver.observe(section);
    });
  }

  // --- Parallax Ambient Orbs Scroll Effect ---
  const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
  if (parallaxElements.length > 0) {
    let ticking = false;
    function updateParallax() {
      const vh = window.innerHeight;
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
        const parent = el.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom >= -150 && rect.top <= vh + 150) {
          const progress = (vh - rect.top) / (vh + rect.height);
          const offset = (progress - 0.5) * 90 * speed;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // --- Background Theme Dynamic Observer ---
  const sectionsWithBg = document.querySelectorAll('section[data-bg-dark]');
  if (sectionsWithBg.length > 0 && 'IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target;
            updateActiveSectionBackground();
          }
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );

    sectionsWithBg.forEach((section) => {
      bgObserver.observe(section);
    });

    activeSection = sectionsWithBg[0];
    updateActiveSectionBackground();
  }

  // --- Typewriter Effect ---
  const words = [
    'DevOps Engineer & Software Developer',
    'Software Engineer',
    'DevSecOps & Cloud Specialist',
    'AI-Driven Product Builder',
    'Fullstack & Mobile Developer',
  ];
  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = true;
  const typewriterEl = document.getElementById('typewriter-text');

  function type() {
    if (!typewriterEl) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 3000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  if (typewriterEl) {
    setTimeout(type, 3000);
  }

  // --- Floating WhatsApp Action Button Visibility ---
  const whatsappFab = document.getElementById('whatsapp-floating-btn');
  const heroSection = document.getElementById('hero');
  const contactSection = document.getElementById('kontak');

  function updateWhatsappFabVisibility() {
    if (!whatsappFab || !heroSection || !contactSection) return;
    const heroRect = heroSection.getBoundingClientRect();
    const contactRect = contactSection.getBoundingClientRect();

    const pastHero = heroRect.bottom <= 100;
    const reachedContact = contactRect.top <= window.innerHeight * 0.7;

    if (pastHero && !reachedContact) {
      whatsappFab.classList.remove('opacity-0', 'translate-y-8', 'scale-75', 'pointer-events-none');
      whatsappFab.classList.add('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
    } else {
      whatsappFab.classList.remove('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
      whatsappFab.classList.add('opacity-0', 'translate-y-8', 'scale-75', 'pointer-events-none');
    }
  }

  window.addEventListener('scroll', updateWhatsappFabVisibility, { passive: true });
  window.addEventListener('resize', updateWhatsappFabVisibility, { passive: true });
  updateWhatsappFabVisibility();

  // --- AOS Initialization with Bidirectional Transitions ---
  const aosInstance = window.AOS || (AOS && typeof AOS.init === 'function' ? AOS : AOS?.default);
  if (aosInstance && typeof aosInstance.init === 'function') {
    html.classList.add('aos-ready');
    aosInstance.init({
      once: false,
      mirror: true,
      offset: 80,
      duration: 750,
      easing: 'ease-out-cubic',
      anchorPlacement: 'top-bottom',
    });
    setTimeout(() => {
      if (typeof aosInstance.refreshHard === 'function') {
        aosInstance.refreshHard();
      } else if (typeof aosInstance.refresh === 'function') {
        aosInstance.refresh();
      }
    }, 120);
  } else {
    html.classList.add('aos-ready');
  }
}
