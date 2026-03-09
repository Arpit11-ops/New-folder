import Swup from 'swup';
const swup = new Swup();

/* ── GLOBAL FUNCTIONS ── */
window.toggleMobileMenu = function() {
  const nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.toggle('active');
  }
};

/* ── HERO CANVAS: Light beams animation ── */
(function(){
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return; // Error handling: Ensure canvas exists before initializing
  
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;

  function resize(){
    if (!parent) return;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const beams = [
    { angle: -18, color: '#1a6fff', width: 120, speed: .3, offset: 0, alpha: .7 },
    { angle: -15, color: '#2563EB', width: 80, speed: .5, offset: 0.3, alpha: .5 },
    { angle: -12, color: '#60A5FA', width: 60, speed: .4, offset: 0.6, alpha: .4 },
    { angle: -20, color: '#06B6D4', width: 100, speed: .6, offset: 0.9, alpha: .6 },
    { angle: -14, color: '#818CF8', width: 50, speed: .35, offset: 1.2, alpha: .35 },
    { angle: -22, color: '#3B82F6', width: 140, speed: .25, offset: 1.5, alpha: .45 },
    { angle: -10, color: '#0EA5E9', width: 45, speed: .55, offset: 1.8, alpha: .3 },
    // warm accent
    { angle: -16, color: '#F97316', width: 30, speed: .4, offset: 2.1, alpha: .5, warm: true },
    { angle: -14, color: '#EF4444', width: 20, speed: .45, offset: 2.4, alpha: .4, warm: true },
    { angle: -19, color: '#EC4899', width: 25, speed: .5, offset: 2.7, alpha: .35, warm: true },
  ];

  let t = 0;
  const vanishX = canvas.width;
  const vanishY = canvas.height * .45;

  function drawBeam(beam, t){
    const W = canvas.width, H = canvas.height;
    const phase = (t * beam.speed + beam.offset) % 4;
    // origin on left edge, spread top to bottom
    const originY = H * 0.35 + Math.sin(t * .2 + beam.offset) * H * .08;
    const originX = -20;

    ctx.save();
    ctx.globalAlpha = beam.alpha * (0.6 + 0.4 * Math.sin(t * .8 + beam.offset));

    const gradient = ctx.createLinearGradient(originX, originY, W + 100, vanishY);
    gradient.addColorStop(0, beam.color);
    gradient.addColorStop(0.15, beam.color);
    gradient.addColorStop(0.7, beam.color + '44');
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    // beam as a thin wedge
    const spread = beam.width * 0.5;
    const angleRad = (beam.angle * Math.PI) / 180;
    const endX = W + 200;
    const endY1 = vanishY + Math.tan(angleRad) * (endX - originX) - spread * 0.05;
    const endY2 = vanishY + Math.tan(angleRad) * (endX - originX) + spread * 0.05;

    ctx.moveTo(originX, originY - spread);
    ctx.lineTo(endX, endY1);
    ctx.lineTo(endX, endY2);
    ctx.lineTo(originX, originY + spread);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.filter = 'blur(8px)';
    ctx.fill();
    ctx.restore();
  }

  function drawGlow(){
    // Central bright line
    const W = canvas.width, H = canvas.height;
    const y = H * .44;
    ctx.save();
    const glowGrad = ctx.createLinearGradient(0, y, W, y);
    glowGrad.addColorStop(0, '#FF6B3580');
    glowGrad.addColorStop(0.05, '#FFFFFF');
    glowGrad.addColorStop(0.5, '#06B6D4');
    glowGrad.addColorStop(1, 'transparent');
    ctx.globalAlpha = .9;
    ctx.beginPath();
    ctx.moveTo(0, y - 1.5);
    ctx.lineTo(W, y - .5);
    ctx.lineTo(W, y + .5);
    ctx.lineTo(0, y + 1.5);
    ctx.closePath();
    ctx.fillStyle = glowGrad;
    ctx.filter = 'blur(1px)';
    ctx.fill();
    // halo
    ctx.globalAlpha = .15;
    ctx.beginPath();
    ctx.moveTo(0, y - 8);
    ctx.lineTo(W * .3, y - 4);
    ctx.lineTo(W * .3, y + 4);
    ctx.lineTo(0, y + 8);
    ctx.closePath();
    ctx.fillStyle = '#FF6B35';
    ctx.filter = 'blur(4px)';
    ctx.fill();
    ctx.restore();
  }

  function animate(){
    requestAnimationFrame(animate);
    t += .015;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // dark bg
    ctx.fillStyle = '#040D1F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // slight radial glow center
    const rg = ctx.createRadialGradient(canvas.width*.6, canvas.height*.4, 0, canvas.width*.6, canvas.height*.4, canvas.width*.5);
    rg.addColorStop(0, 'rgba(37,99,235,.12)');
    rg.addColorStop(1, 'transparent');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    beams.forEach(b => drawBeam(b, t));
    drawGlow();
  }
  animate();
})();

/* ── INIT FUNCTION FOR PAGE TRANSITIONS ── */
function init() {
  // 1. SCROLL REVEAL
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold: .08});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // 2. DIGIT WHEEL ANIMATION
  const digits = ['d1','d2','d3','d4','d5','d6','d7'];
  const targets = [7,4,9,5,2,2,7];
  function animateDigits(){
    digits.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return; // Error handling: check if digit element exists on current page
      let n = 0, steps = 0;
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
  
  const capCard = document.querySelector('.dk-card.capital');
  if(capCard) {
    digitObs.observe(capCard);
  }

  // 3. FORM HANDLING
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Only attach if not already attached to prevent duplicates on swup view
    if (!contactForm.dataset.initialized) {
      contactForm.dataset.initialized = "true";
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your message has been sent. We will contact you shortly.');
        contactForm.reset();
      });
    }
  }
}

// Run on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Run on Swup page transitions
swup.hooks.on('page:view', init);
