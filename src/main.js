import Swup from 'swup';
const swup = new Swup();

/* ── GLOBAL STATE FOR MEMORY MANAGEMENT ── */
let currentRafId = null;
let heroIntervalId = null;
let numbersIntervalId = null;
let isAnimating = true;
let activeObservers = [];

/* ── GLOBAL FUNCTIONS ── */
window.toggleMobileMenu = function() {
  const nav = document.getElementById('mobileNav');
  const btn = document.querySelector('.mobile-menu-btn');
  if (nav) {
    nav.classList.toggle('open');
  }
  if (btn) {
    btn.classList.toggle('open');
  }
};

/* ── CLEANUP (Runs before every page transition) ── */
function cleanup() {
  if (currentRafId) {
    cancelAnimationFrame(currentRafId);
    currentRafId = null;
  }
  if (heroIntervalId) {
    clearInterval(heroIntervalId);
    heroIntervalId = null;
  }
  if (numbersIntervalId) {
    clearInterval(numbersIntervalId);
    numbersIntervalId = null;
  }
  activeObservers.forEach(obs => {
    if (obs && typeof obs.disconnect === 'function') {
      obs.disconnect();
    }
  });
  activeObservers = [];
  
  // Reset any body-bound states
  document.body.classList.remove('nav-open');
}

/* ── FEATURE MODULES ── */

function initCanvas() {
  // Video background replaces canvas. No initialization needed here.
}

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold: .08});
  activeObservers.push(obs);
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function initDigits() {
  const digits = ['d1','d2','d3','d4','d5','d6','d7'];
  const targets = [7,4,9,5,2,2,7];
  function animateDigits(){
    digits.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      let steps = 0;
      const max = 20 + i * 5;
      const iv = setInterval(() => {
        el.textContent = Math.floor(Math.random() * 10);
        steps++;
        if(steps > max){ el.textContent = targets[i]; clearInterval(iv); }
      }, 60);
    });
  }
  
  const digitObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ animateDigits(); digitObs.disconnect(); } });
  }, {threshold:.3});
  activeObservers.push(digitObs);
  
  const capCard = document.querySelector('.dk-card.capital');
  if(capCard) digitObs.observe(capCard);
}

function initForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm && !contactForm.dataset.initialized) {
    contactForm.dataset.initialized = "true";
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been sent. We will contact you shortly.');
      contactForm.reset();
    });
  }
}

function initHeroCard() {
  const heroCard = document.getElementById('hero-revenue-card');
  if (!heroCard || heroIntervalId) return;

  const cardData = [
    { title: "Experience", amount: "10+ Years", period: "in Web & App Development", pct: "100%", label: "Satisfaction" },
    { title: "Delivery", amount: "500+", period: "Global Projects Completed", pct: "24/7", label: "Support" },
    { title: "Growth", amount: "10x", period: "Average Client Traffic Growth", pct: "#1", label: "Rankings" }
  ];

  let currentIndex = 0;
  const titleEl = document.getElementById('rc-title');
  const amountEl = document.getElementById('rc-amount');
  const periodEl = document.getElementById('rc-period');
  const badgeEl = document.getElementById('rc-badge');
  const pctEl = document.getElementById('rc-pct');
  const labelEl = document.getElementById('rc-badge-label');
  const dots = document.querySelectorAll('#rc-dots .rc-dot');
  const animElements = [titleEl, amountEl, periodEl, badgeEl];

  const triggerHeroAnim = () => {
    // Slide out (up)
    animElements.forEach(el => { if (el) el.classList.add('fade-out'); });

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % cardData.length;
      const data = cardData[currentIndex];

      if (titleEl) titleEl.innerText = data.title;
      if (amountEl) amountEl.innerText = data.amount;
      if (periodEl) periodEl.innerText = data.period;
      if (pctEl) pctEl.innerText = data.pct;
      if (labelEl) labelEl.innerText = data.label;

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });

      // Teleport
      animElements.forEach(el => {
        if (el) {
          el.classList.remove('fade-out');
          el.classList.add('fade-in-pre');
        }
      });

      if (titleEl) void titleEl.offsetWidth; // Force reflow

      // Slide in
      animElements.forEach(el => { if (el) el.classList.remove('fade-in-pre'); });
    }, 500);
  };

  // Initial delay of 2.5s then start 4.5s cycle
  setTimeout(() => {
    if (!heroCard) return;
    triggerHeroAnim();
    heroIntervalId = setInterval(triggerHeroAnim, 4500);
  }, 2500);
}

function initNumbersAnimation() {
  const numSection = document.getElementById('num-section');
  if (!numSection || numbersIntervalId) return;

  const numData = [
    { num: "10", label: "Years of Excellence" },
    { num: "500+", label: "Projects Completed" },
    { num: "100%", label: "Satisfaction Guarantee" }
  ];

  let currentIndex = 0;
  const numEl = document.getElementById('big-num');
  const labelEl = document.getElementById('num-label');
  const dots = document.querySelectorAll('#num-dots-container .num-dot');
  const animElements = [numEl, labelEl];

  const triggerNumAnim = () => {
    // Slide out (up)
    animElements.forEach(el => { if (el) el.classList.add('fade-out'); });

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % numData.length;
      const data = numData[currentIndex];

      if (numEl) numEl.innerText = data.num;
      if (labelEl) labelEl.innerText = data.label;

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('on');
        else dot.classList.remove('on');
      });

      // Teleport
      animElements.forEach(el => {
        if (el) {
          el.classList.remove('fade-out');
          el.classList.add('fade-in-pre');
        }
      });

      if (numEl) void numEl.offsetWidth; // Force reflow

      // Slide in
      animElements.forEach(el => { if (el) el.classList.remove('fade-in-pre'); });
    }, 500);
  };

  // Initial delay of 2s then start 4.5s cycle for numbers
  setTimeout(() => {
    if (!numSection) return;
    triggerNumAnim();
    numbersIntervalId = setInterval(triggerNumAnim, 4500);
  }, 2000);
}

/* ── MAIN INITIALIZATION ── */
function init() {
  cleanup();
  initCanvas();
  initReveal();
  initDigits();
  initForm();
  initHeroCard();
  initNumbersAnimation();
}

// Map bindings
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

swup.hooks.on('page:view', init);
swup.hooks.on('visit:start', cleanup);
