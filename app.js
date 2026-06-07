/* ═══════════════════════════════════
   C Visionary Studio · app.js
   Animations, Interactions, Particles
   ═══════════════════════════════════ */

'use strict';

/* ── CUSTOM CURSOR ── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  if (cursor) {
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── BURGER MENU ── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), +delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-scroll]').forEach(el => revealObserver.observe(el));

/* ── PARALLAX ORBS ── */
const orbBlue = document.getElementById('orbBlue');
const orbRed  = document.getElementById('orbRed');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (orbBlue) orbBlue.style.transform = `translateY(${y * 0.15}px)`;
  if (orbRed)  orbRed.style.transform  = `translateY(${-y * 0.1}px)`;
});

/* ── PARTICLES ── */
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size  = Math.random() * 1.6 + .6;
      this.speedX = (Math.random() - .5) * .3;
      this.speedY = -Math.random() * .6 - .2;
      this.opacity = Math.random() * .6 + .35;
      this.color = Math.random() > .6 ? '90,195,255' : '255,255,255';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10) this.reset();
      if (this.x < -10) this.x = w + 10;
      if (this.x > w + 10) this.x = -10;
    }
    draw() {
      ctx.save();
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = `rgba(${this.color},.9)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 130; i++) particles.push(new Particle());

  (function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  })();
}

/* ── HERO VIDEO FALLBACK ── */
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    heroVideo.style.display = 'none';
  });
  heroVideo.load();
}

/* ── SHOWCASE: VIDEO / IMG LOAD ── */
document.querySelectorAll('.si-video, .si-img').forEach(el => {
  const show = () => el.classList.add('loaded');
  if (el.tagName === 'VIDEO') {
    el.addEventListener('canplay', show);
    el.addEventListener('error', () => el.remove());
  } else {
    if (el.complete) show();
    else {
      el.addEventListener('load', show);
      el.addEventListener('error', () => el.remove());
    }
  }
});

/* ── SMOOTH SECTION SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── FORM ── */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Anfrage gesendet!';
  btn.style.background = '#00c85a';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Anfrage senden →';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}
window.handleForm = handleForm;

/* ── SCROLL HINT FADE ── */
const scrollHint = document.getElementById('scrollHint');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    scrollHint.style.opacity = window.scrollY > 100 ? '0' : '1';
  }, { passive: true });
}

/* ── STAGGER CARDS ON HOVER AREA ── */
document.querySelectorAll('.services-grid, .pricing-grid, .target-grid').forEach(grid => {
  grid.addEventListener('mousemove', e => {
    grid.querySelectorAll('.service-card, .pricing-card, .target-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      const dist = Math.sqrt(x*x + y*y);
      const maxDist = 300;
      if (dist < maxDist) {
        const intensity = (1 - dist / maxDist) * 6;
        card.style.transform = `translateY(${-intensity}px)`;
      } else {
        card.style.transform = '';
      }
    });
  });
  grid.addEventListener('mouseleave', () => {
    grid.querySelectorAll('.service-card, .pricing-card, .target-card').forEach(c => c.style.transform = '');
  });
});
