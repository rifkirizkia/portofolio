/**
 * Main application entry point for Vite.
 * Bundles Tailwind CSS, animations, internationalization,
 * project cards, portfolio interactions, and modern UI behaviors.
 */

// Styles
import '../styles/tailwind.css';
import '../styles/portfolio-3d.css';

// Vendor libraries
import AOS from '../js/aos.js';

if (typeof window !== 'undefined') {
  window.AOS = window.AOS || (AOS && typeof AOS.init === 'function' ? AOS : AOS?.default);
}

// Application data & components
import '../js/projects-data.js';
import '../js/project-card.js';
import '../js/i18n.js';
import '../js/portfolio.js';

// Interactive UI behaviors
import { initUI } from './ui.js';

// Initialize UI when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}
