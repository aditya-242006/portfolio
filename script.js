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

/* ===== RAIN CANVAS BACKGROUND EFFECT ===== */
const rainCanvas = document.getElementById('rainCanvas');
if (rainCanvas) {
  const ctx = rainCanvas.getContext('2d');
  let width = 0, height = 0;
  let drops = [];
  const maxDrops = 110;
  let isHeroVisible = true;
  let animationId = null;

  function resizeRainCanvas() {
    const parent = rainCanvas.parentElement;
    if (parent) {
      width = parent.clientWidth;
      height = parent.clientHeight;
      rainCanvas.width = width;
      rainCanvas.height = height;
    }
  }

  class RainDrop {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // distribute initial drops across the height
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.length = Math.random() * 25 + 15;
      this.speed = Math.random() * 8 + 6;
      this.slant = -1 - Math.random() * 2; // slant left-downwards
      this.opacity = Math.random() * 0.18 + 0.05;
      this.width = Math.random() * 1 + 0.5;
    }

    update() {
      this.y += this.speed;
      this.x += this.slant;
      if (this.y > height || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.slant, this.y + this.length);
      ctx.strokeStyle = `rgba(234, 225, 201, ${this.opacity})`;
      ctx.lineWidth = this.width;
      ctx.stroke();
    }
  }

  function initRain() {
    resizeRainCanvas();
    drops = [];
    for (let i = 0; i < maxDrops; i++) {
      drops.push(new RainDrop());
    }
  }

  function animateRain() {
    if (!isHeroVisible) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < drops.length; i++) {
      drops[i].update();
      drops[i].draw();
    }
    animationId = requestAnimationFrame(animateRain);
  }

  // Optimize performance: only run loop when hero is visible
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible) {
          cancelAnimationFrame(animationId);
          animateRain();
        } else {
          cancelAnimationFrame(animationId);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  } else {
    animateRain();
  }

  initRain();
  window.addEventListener('resize', () => {
    resizeRainCanvas();
  });
}

/* ===== CLICK/TAP GOLD SPARK EFFECT ===== */
const clickCanvas = document.getElementById('clickCanvas');
if (clickCanvas) {
  const ctx = clickCanvas.getContext('2d');
  let sparks = [];
  let animId = null;

  function resizeClickCanvas() {
    clickCanvas.width = window.innerWidth;
    clickCanvas.height = window.innerHeight;
  }

  class Spark {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1.5; // slight upward force
      this.size = Math.random() * 3 + 1.5;
      this.alpha = 1;
      this.decay = Math.random() * 0.03 + 0.015;
      this.color = Math.random() > 0.4 ? 'rgba(125, 211, 252, ' : 'rgba(255, 255, 255, '; // cyan or white
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // gravity force
      this.vx *= 0.98; // air drag
      this.vy *= 0.98;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  function animateSparks() {
    ctx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    sparks = sparks.filter(s => s.alpha > 0);
    
    if (sparks.length === 0) {
      cancelAnimationFrame(animId);
      animId = null;
      ctx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
      return;
    }

    for (let i = 0; i < sparks.length; i++) {
      sparks[i].update();
      sparks[i].draw();
    }
    animId = requestAnimationFrame(animateSparks);
  }

  window.addEventListener('click', (e) => {
    // Spawn 16 sparks per click
    for (let i = 0; i < 16; i++) {
      sparks.push(new Spark(e.clientX, e.clientY));
    }
    if (!animId) {
      animateSparks();
    }
  });

  resizeClickCanvas();
  window.addEventListener('resize', resizeClickCanvas);
}

/* ===== SCROLL PARALLAX ZOOM ===== */
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      
      // Parallax hero background
      const heroBg = document.querySelector('.hero-bg-img');
      if (heroBg && scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.25}px) scale(${1 + scrollY * 0.0003})`;
      }
      
      // Subtle shift for hero visual wrapper
      const heroVisual = document.querySelector('.hero-game-img');
      if (heroVisual && scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrollY * -0.08}px)`;
      }
      
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

/* ===== CUSTOM CURSOR ===== */
(function() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;
  let rafId  = null;

  // Update cursor dot position instantly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring lags behind with lerp
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateCursor() {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover detection on interactive elements
  const hoverTargets = 'a, button, [onclick], .project-card, .skill-pill, .nav-link, .btn, .card-btn-primary, .card-btn-ghost';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '';
    ring.style.opacity = '';
  });
})();

