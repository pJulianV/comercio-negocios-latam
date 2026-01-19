
import { setupScrollAnimations } from './animation.js';
import { initCarousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  setupScrollAnimations();
  // Inicializar carousel si existe
  const carousel = document.querySelector('.servicios-carousel');
  if (carousel) {
    initCarousel();
  }
});

// Smooth scroll para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
