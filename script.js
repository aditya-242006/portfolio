/* ============================================
   ADITYA SHARMA — GAME DEVELOPER PORTFOLIO
   Main JavaScript
   ============================================ */

'use strict';

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursorTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateCursorTrail);
}
animateCursorTrail();

/* ===== PARTICLE SYSTEM ===== */
const particleCanvas = document.getElementById('particleCanvas');
const pCtx = particleCanvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * particleCanvas.width;
    this.y = Math.random() * particleCanvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.25;
    this.speedY = (Math.random() - 0.5) * 0.25 - 0.05;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.6 ? '#a855f7' : '#00d4ff';
    this.life = 0;
    this.maxLife = Math.random() * 400 + 200;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > particleCanvas.width ||
        this.y < 0 || this.y > particleCanvas.height) {
      this.reset();
    }
  }
  draw() {
    const progress = this.life / this.maxLife;
    const alpha = this.opacity * Math.sin(progress * Math.PI);
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    pCtx.fillStyle = this.color;
    pCtx.globalAlpha = alpha;
    pCtx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor(window.innerWidth / 16));
  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }
}

function animateParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  pCtx.globalAlpha = 1;
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
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
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* ===== SMOOTH SCROLL (for nav links) ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== TYPING ROLE ANIMATION ===== */
const roles = ['Game Developer', 'Gameplay Programmer', 'Unity Developer', 'Unreal Engine Dev', 'Game Designer'];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const roleEl = document.getElementById('typingRole');

function typeRole() {
  if (!roleEl) return;
  const current = roles[roleIdx];
  if (isDeleting) {
    charIdx--;
    if (charIdx < 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      charIdx = 0;
      setTimeout(typeRole, 400);
      return;
    }
  } else {
    charIdx++;
    if (charIdx > current.length) {
      isDeleting = true;
      setTimeout(typeRole, 2200);
      return;
    }
  }
  roleEl.textContent = current.slice(0, charIdx);
  setTimeout(typeRole, isDeleting ? 60 : 90);
}

setTimeout(typeRole, 1200);

/* ===== INTERSECTION OBSERVER FOR REVEAL ANIMATIONS ===== */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ===== SKILL BAR ANIMATION ===== */
const skillCards = document.querySelectorAll('.skill-card');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // animate bars
      entry.target.querySelectorAll('.eb-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = width; }, 100);
      });
    }
  });
}, { threshold: 0.2 });

skillCards.forEach(card => skillObserver.observe(card));

/* ===== PROJECT MODALS ===== */
function openProjectModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModal(event) {
  if (event.target === event.currentTarget) {
    event.currentTarget.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

/* ===== HERO PARALLAX ===== */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroBg = document.querySelector('.hero-bg-img');
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ===== SECTION ENTER ANIMATIONS (staggered children) ===== */
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.12}s`;
});

const achCards = document.querySelectorAll('.achievement-card');
achCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});

/* ===== HERO IMAGE HOVER GLOW ===== */
const heroImgWrapper = document.querySelector('.hero-img-wrapper');
if (heroImgWrapper) {
  heroImgWrapper.addEventListener('mousemove', (e) => {
    const rect = heroImgWrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    heroImgWrapper.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  heroImgWrapper.addEventListener('mouseleave', () => {
    heroImgWrapper.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  });
}

/* ===== NAV LINKS HOVER RIPPLE ===== */
navLinks.forEach(link => {
  link.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position:absolute;width:4px;height:4px;border-radius:50%;
      background:rgba(0,212,255,0.4);pointer-events:none;
      left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;
      transform:translate(-50%,-50%);
      animation:rippleExpand 0.4s ease forwards;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  });
});

// Add ripple keyframe
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes rippleExpand {
    from { transform: translate(-50%,-50%) scale(0); opacity: 1; }
    to   { transform: translate(-50%,-50%) scale(30); opacity: 0; }
  }
`;
document.head.appendChild(styleEl);

/* ===== CARD TILT EFFECT ===== */
document.querySelectorAll('.project-card, .skill-card, .achievement-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = y * 6;
    const tiltY = x * -6;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== GLITCH EFFECT ON HERO NAME ===== */
const heroNameEl = document.querySelector('.hero-name');
if (heroNameEl) {
  setInterval(() => {
    if (Math.random() > 0.95) {
      heroNameEl.style.textShadow = '2px 0 0 rgba(0,212,255,0.5), -2px 0 0 rgba(168,85,247,0.5)';
      setTimeout(() => {
        heroNameEl.style.textShadow = '';
      }, 80);
    }
  }, 2000);
}

/* ===== ACHIEVEMENT CARD GLOW ON HOVER ===== */
document.querySelectorAll('.achievement-card').forEach((card, i) => {
  const colors = ['rgba(0,212,255,0.15)', 'rgba(20,220,180,0.15)', 'rgba(168,85,247,0.15)'];
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 40px ${colors[i % colors.length]}`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* ===== CONTACT CARD HOVER SOUND LINE ===== */
// subtle horizontal scan on contact cards
document.querySelectorAll('.contact-card').forEach(card => {
  const scanLine = document.createElement('div');
  scanLine.style.cssText = `
    position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(0,212,255,0.6),transparent);
    opacity:0;transition:opacity 0.2s;pointer-events:none;
    animation:scanMove 1.5s linear infinite;
  `;
  card.style.position = 'relative';
  card.appendChild(scanLine);

  card.addEventListener('mouseenter', () => { scanLine.style.opacity = '1'; });
  card.addEventListener('mouseleave', () => { scanLine.style.opacity = '0'; });
});

const scanStyle = document.createElement('style');
scanStyle.textContent = `
  @keyframes scanMove {
    from { top: 0; }
    to   { top: 100%; }
  }
`;
document.head.appendChild(scanStyle);

/* ===== INIT REVEAL ON LOAD ===== */
window.addEventListener('load', () => {
  // Trigger hero items immediately
  document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach(el => {
    el.classList.add('visible');
  });
});

/* ===== SHADOWWALKER IDLE SLIDESHOW ===== */
(function () {
  const SW_SLIDES = [
    'sw_slide1.png',
    'sw_slide2.png',
    'sw_slide3.png',
    'sw_slide4.png',
  ];
  const IDLE_DELAY   = 3000;   // ms before slideshow starts
  const SLIDE_SPEED  = 2800;   // ms per slide
  const FADE_DURATION = 700;   // ms crossfade

  let idleTimer      = null;
  let slideTimer     = null;
  let currentSlide   = 0;
  let isSliding      = false;

  // DOM refs
  const heroImg        = document.querySelector('.hero-game-img');
  const heroBgImg      = document.querySelector('.hero-bg-img');
  const cardBg         = document.querySelector('.shadowwalker-bg');
  const modalBg        = document.querySelector('.modal-img-wrap.shadowwalker-bg');
  const idleBadge      = document.getElementById('sw-idle-badge');

  // Original srcs
  const originalHeroSrc = heroImg ? heroImg.src : '';

  /* --- helpers --- */
  function crossfadeHeroImg(src) {
    if (!heroImg) return;
    heroImg.style.transition = `opacity ${FADE_DURATION}ms ease`;
    heroImg.style.opacity = '0';
    setTimeout(() => {
      heroImg.src = src;
      heroImg.style.opacity = '1';
    }, FADE_DURATION);

    // Also update hero bg 
    if (heroBgImg) {
      heroBgImg.style.transition = `opacity ${FADE_DURATION}ms ease`;
      heroBgImg.style.opacity = '0';
      setTimeout(() => {
        heroBgImg.src = src;
        heroBgImg.style.opacity = '0.35'; // keep it subtle
      }, FADE_DURATION);
    }
  }

  function showCardOverlay(src) {
    if (!cardBg) return;
    cardBg.style.transition = `background-image ${FADE_DURATION}ms ease, opacity ${FADE_DURATION}ms ease`;
    // Use pseudo via data attribute — simpler: inject inline style overlay div
    let overlay = cardBg.querySelector('.sw-slide-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sw-slide-overlay';
      overlay.style.cssText = `
        position:absolute;inset:0;border-radius:inherit;
        background-size:cover;background-position:center;
        opacity:0;transition:opacity ${FADE_DURATION}ms ease;
        pointer-events:none;z-index:1;
      `;
      cardBg.style.position = 'relative';
      cardBg.appendChild(overlay);
    }
    overlay.style.backgroundImage = `url('${src}')`;
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });
  }

  function hideCardOverlay() {
    if (!cardBg) return;
    const overlay = cardBg.querySelector('.sw-slide-overlay');
    if (overlay) overlay.style.opacity = '0';
  }

  function showIdleBadge() {
    const badge = document.getElementById('sw-idle-badge');
    if (badge) { badge.style.opacity = '1'; badge.style.transform = 'translateY(0)'; }
  }
  function hideIdleBadge() {
    const badge = document.getElementById('sw-idle-badge');
    if (badge) { badge.style.opacity = '0'; badge.style.transform = 'translateY(8px)'; }
  }

  /* --- slideshow loop --- */
  function nextSlide() {
    currentSlide = (currentSlide + 1) % SW_SLIDES.length;
    const src = SW_SLIDES[currentSlide];
    crossfadeHeroImg(src);
    showCardOverlay(src);
  }

  function startSlideshow() {
    if (isSliding) return;
    isSliding = true;
    currentSlide = 0;
    crossfadeHeroImg(SW_SLIDES[0]);
    showCardOverlay(SW_SLIDES[0]);
    showIdleBadge();
    slideTimer = setInterval(nextSlide, SLIDE_SPEED);
  }

  function stopSlideshow() {
    if (!isSliding) return;
    isSliding = false;
    clearInterval(slideTimer);
    slideTimer = null;
    // restore originals
    crossfadeHeroImg(originalHeroSrc);
    if (heroBgImg) {
      heroBgImg.style.transition = `opacity ${FADE_DURATION}ms ease`;
      heroBgImg.style.opacity = '0';
      setTimeout(() => {
        heroBgImg.src = originalHeroSrc;
        heroBgImg.style.opacity = '0.35';
      }, FADE_DURATION);
    }
    hideCardOverlay();
    hideIdleBadge();
  }

  /* --- idle detection --- */
  function resetIdleTimer() {
    if (isSliding) stopSlideshow();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startSlideshow, IDLE_DELAY);
  }

  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'touchmove'].forEach(evt => {
    window.addEventListener(evt, resetIdleTimer, { passive: true });
  });

  // Start idle timer immediately on page load
  resetIdleTimer();

  /* --- inject idle badge into hero --- */
  const heroImgWrapper = document.querySelector('.hero-img-wrapper');
  if (heroImgWrapper) {
    const badge = document.createElement('div');
    badge.id = 'sw-idle-badge';
    badge.innerHTML = `<span class="sw-badge-dot"></span><span>Slideshow</span>`;
    badge.style.cssText = `
      position:absolute;bottom:48px;right:14px;
      display:flex;align-items:center;gap:6px;
      background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);
      border:1px solid rgba(168,85,247,0.4);border-radius:20px;
      padding:5px 12px;font-size:11px;letter-spacing:0.05em;
      color:rgba(168,85,247,0.9);font-family:'JetBrains Mono',monospace;
      opacity:0;transform:translateY(8px);
      transition:opacity 0.4s ease, transform 0.4s ease;
      pointer-events:none;z-index:10;
    `;
    const dot = badge.querySelector('.sw-badge-dot');
    dot.style.cssText = `
      width:6px;height:6px;border-radius:50%;
      background:#a855f7;
      animation:swBadgePulse 1.2s ease-in-out infinite;
      display:inline-block;
    `;
    heroImgWrapper.appendChild(badge);

    // inject pulse keyframe
    const ks = document.createElement('style');
    ks.textContent = `@keyframes swBadgePulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.6);}}`;
    document.head.appendChild(ks);
  }

  /* --- slide indicator dots in hero --- */
  if (heroImgWrapper) {
    const dots = document.createElement('div');
    dots.id = 'sw-slide-dots';
    dots.style.cssText = `
      position:absolute;bottom:16px;left:50%;transform:translateX(-50%);
      display:flex;gap:6px;opacity:0;
      transition:opacity 0.4s ease;pointer-events:none;z-index:10;
    `;
    SW_SLIDES.forEach((_, i) => {
      const d = document.createElement('span');
      d.style.cssText = `
        width:6px;height:6px;border-radius:50%;
        background:rgba(255,255,255,0.35);
        transition:background 0.3s ease, transform 0.3s ease;
        display:inline-block;
      `;
      dots.appendChild(d);
    });
    heroImgWrapper.appendChild(dots);

    // update dots on each slide
    const origNextSlide = nextSlide;
    function updateDots() {
      const allDots = dots.querySelectorAll('span');
      allDots.forEach((d, i) => {
        if (i === currentSlide) {
          d.style.background = '#a855f7';
          d.style.transform = 'scale(1.4)';
        } else {
          d.style.background = 'rgba(255,255,255,0.35)';
          d.style.transform = 'scale(1)';
        }
      });
    }

    // Override start to show dots
    const _startSlideshow = startSlideshow;
    const _stopSlideshow  = stopSlideshow;
    const _nextSlide      = nextSlide;

    // Patch via interval watcher
    const origInterval = setInterval;
    let patchedStart = false;

    // Simpler: just watch isSliding via a rAF loop
    (function watchSlide() {
      if (isSliding) {
        dots.style.opacity = '1';
        updateDots();
      } else {
        dots.style.opacity = '0';
      }
      requestAnimationFrame(watchSlide);
    })();
  }
})();

