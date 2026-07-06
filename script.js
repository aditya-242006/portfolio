/* ========================================================
   ADITYA SHARMA — GAME DESIGN & DEVELOPMENT PORTFOLIO
   Main JavaScript
   ======================================================== */

'use strict';

/* ===== NAVBAR SCROLL ACTIVE STATE ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(sectionId)) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

/* ===== INTERSECTION OBSERVER FOR REVEAL ANIMATIONS ===== */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ===== PROJECT MODALS ===== */
window.openProjectModal = function(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.closeProjectModal = function(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

window.closeModal = function(event) {
  if (event.target === event.currentTarget) {
    event.currentTarget.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    const lb = document.getElementById('lightboxModal');
    if (lb && lb.classList.contains('open')) {
      closeLightbox();
    }
    document.body.style.overflow = '';
  }
});

/* ===== LIGHTBOX GALLERIES ===== */
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

window.openLightbox = function(src, captionText) {
  if (!lightboxModal || !lightboxImg || !lightboxCaption) return;
  lightboxImg.src = src;
  lightboxCaption.textContent = captionText;
  lightboxModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.closeLightbox = function() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== TRIGGER REVEAL ON LOAD ===== */
window.addEventListener('load', () => {
  // Trigger hero elements immediately
  document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach(el => {
    el.classList.add('visible');
  });
});
