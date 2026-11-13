/* ===== ENSTP performance patch (loaded with defer, before DOMContentLoaded) ===== */

/* 1) Lighter particles: pauses off-screen / hidden tab, off on phones */
window.initParticles = function () {
  const canvas = document.getElementById('particles');
  const hero = document.getElementById('hero-section');
  if (!canvas || !hero) return;
  if (innerWidth < 700 || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w, h, pts = [], running = false, raf = 0, mouse = { x: -999, y: -999 };

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(50, (w * h) / 20000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.8 + .6, gold: Math.random() > .72
    }));
  }
  function frame() {
    if (!running || document.hidden) { raf = 0; return; }
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      if (dx * dx + dy * dy < 14000) { p.x += dx * .004; p.y += dy * .004; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = p.gold ? 'rgba(245,184,65,.9)' : 'rgba(150,200,255,.75)';
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], ax = p.x - q.x, ay = p.y - q.y, d = ax * ax + ay * ay;
        if (d < 15000) {
          ctx.strokeStyle = `rgba(${p.gold ? '245,184,65' : '120,170,240'},${(1 - d / 15000) * .28})`;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (running && !raf) raf = requestAnimationFrame(frame); };
  resize();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(resize, 200); });
  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  document.addEventListener('visibilitychange', kick);
  new IntersectionObserver(([en]) => { running = en.isIntersecting; kick(); }).observe(hero);
};

/* 2) Card images: async decode + fixed size (no layout jumps) */
(function () {
  if (typeof renderGrid !== 'function') return;
  const orig = renderGrid;
  window.renderGrid = renderGrid = function (id, list, btn) {
    orig(id, list, btn);
    const c = document.getElementById(id);
    if (!c) return;
    c.querySelectorAll('img.card-image').forEach(img => {
      img.decoding = 'async';
      if (!img.getAttribute('width')) { img.setAttribute('width', '600'); img.setAttribute('height', '200'); }
    });
  };
})();
