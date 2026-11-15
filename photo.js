/* =====================================================================
   ENSTP — صور الأماكن على الخرائط (ecolemap.html و residence.html)
   عند اختيار مكان تظهر صورته داخل لوحة المعلومات.
   الاستعمال: أضف هذا السطر قبل </body> في كل صفحة خريطة:
        <script src="place-photos.js"></script>
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     1) ضع هنا صورة كل مكان  ←←←  هذا هو القسم الوحيد الذي تعدّله
     -------------------------------------------------------------------
     المفتاح (يسار) = اسم المكان كما يظهر في الموقع، أو رمزه (مثل I أو Dfield).
     القيمة (يمين)  = اسم ملف الصورة المرفوع في المستودع.
       "المطعم": "restaurant.jpg",                       ← صورة واحدة
       "المبنى J": ["j1.jpg", "j2.jpg"],                 ← عدة صور (تظهر مصغّرات للتبديل)
       "المبنى K": { src: "k.jpg", caption: "واجهة K" }, ← صورة مع تعليق
     اترك القيمة "" لمكان بلا صورة (لن تظهر له أي صورة).
     لمعرفة أسماء كل الأماكن ورموزها افتح الصفحة هكذا:  residence.html?photos=setup
     =================================================================== */
  var PLACE_IMAGES = {
    "المطعم":          "",
    "ملعب كرة القدم":  "",
    "ملعب كرة السلة":  "",
    "المبنى J":        "",
    "المبنى K":        "",
    "المبنى G":        ""
    // أضف بقية الأماكن هنا بنفس الطريقة ...
  };

  /* ===== إعدادات متقدمة (لا تغيّرها إلا عند الحاجة) ===== */
  var INFO_SELECTORS  = ['#info', '.info', '#placeInfo', '.place-info', '#details', '.details', '[data-info]'];
  var TITLE_SELECTORS = ['h3', 'h2', 'h4', '.title', '.name'];

  /* ---------------- منطق المطابقة ---------------- */
  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '');
  }
  function toList(v) {
    if (!v) return [];
    if (typeof v === 'string') return v.trim() ? [{ src: v.trim() }] : [];
    if (Array.isArray(v)) return v.map(function (x) { return typeof x === 'string' ? { src: x } : x; }).filter(function (x) { return x && x.src; });
    return v.src ? [v] : [];
  }
  function match(title, id) {
    var keys = Object.keys(PLACE_IMAGES).filter(function (k) { return toList(PLACE_IMAGES[k]).length; });
    if (id && keys.indexOf(id) > -1) return toList(PLACE_IMAGES[id]);                 // مطابقة بالرمز
    var nt = norm(title), best = null;
    keys.forEach(function (k) {
      var nk = norm(k);
      if (nk && nt && (nt.indexOf(nk) > -1 || nk.indexOf(nt) > -1) && (!best || nk.length > norm(best).length)) best = k;
    });
    return best ? toList(PLACE_IMAGES[best]) : [];
  }
  window.__placePhotos = { match: match, norm: norm, images: PLACE_IMAGES };
  if (typeof document === 'undefined') return;

  /* ---------------- الواجهة ---------------- */
  var css = '' +
    '.pp-fig{margin:0 0 14px;border-radius:18px;overflow:hidden;position:relative;background:linear-gradient(135deg,#0b2545,#1d5288);border:1px solid var(--card-b,rgba(20,50,110,.15));box-shadow:0 14px 34px rgba(20,50,110,.18);animation:ppIn .45s cubic-bezier(.22,1,.36,1)}' +
    '@keyframes ppIn{from{opacity:0;transform:translateY(10px)}}' +
    '.pp-fig img.pp-main{display:block;width:100%;height:210px;object-fit:cover;cursor:zoom-in;transition:transform .6s cubic-bezier(.22,1,.36,1)}' +
    '.pp-fig:hover img.pp-main{transform:scale(1.04)}' +
    '.pp-fig::after{content:"";position:absolute;inset:auto 0 0 0;height:60px;background:linear-gradient(0deg,rgba(3,8,18,.6),transparent);pointer-events:none}' +
    '.pp-cap{position:absolute;z-index:2;inset-inline:12px;bottom:10px;font-size:.78rem;font-weight:800;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.6)}' +
    '.pp-zoom{position:absolute;z-index:2;top:10px;inset-inline-end:10px;width:34px;height:34px;border-radius:11px;display:grid;place-items:center;border:0;cursor:pointer;color:#fff;background:rgba(5,12,26,.65);backdrop-filter:blur(8px)}' +
    '.pp-thumbs{display:flex;gap:8px;padding:8px;background:rgba(5,12,26,.55);position:relative;z-index:2;overflow-x:auto}' +
    '.pp-thumbs img{width:54px;height:40px;object-fit:cover;border-radius:9px;cursor:pointer;opacity:.6;border:2px solid transparent;flex-shrink:0;transition:.25s}' +
    '.pp-thumbs img.on,.pp-thumbs img:hover{opacity:1;border-color:#f5b841}' +
    '.pp-lb{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(3,8,18,.88);backdrop-filter:blur(8px);cursor:zoom-out}' +
    '.pp-lb img{max-width:100%;max-height:88vh;border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
    '.pp-lb p{position:absolute;bottom:22px;left:0;right:0;text-align:center;color:#fff;font:800 .9rem Cairo,sans-serif}' +
    '.pp-setup{position:fixed;z-index:99998;inset-inline:12px;bottom:12px;max-width:560px;margin-inline:auto;padding:16px;border-radius:20px;color:#e8eef9;background:rgba(5,12,26,.96);border:1px solid rgba(245,184,65,.5);box-shadow:0 20px 60px rgba(0,0,0,.5);font:600 .8rem/1.8 Cairo,sans-serif}' +
    '.pp-setup h4{color:#f5b841;font-size:.95rem;margin-bottom:6px}' +
    '.pp-setup textarea{width:100%;height:150px;margin:8px 0;padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:#0a1730;color:#e8eef9;font:12px/1.6 monospace;direction:ltr}' +
    '.pp-setup button{padding:9px 16px;border:0;border-radius:11px;font:800 .8rem Cairo,sans-serif;cursor:pointer;color:#14100a;background:#f5b841;margin-inline-end:8px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var lastId = '', busy = false, infoEl = null, fig = null;

  function findInfo() {
    for (var i = 0; i < INFO_SELECTORS.length; i++) { var el = document.querySelector(INFO_SELECTORS[i]); if (el) return el; }
    return null;
  }
  function titleOf(el) {
    for (var i = 0; i < TITLE_SELECTORS.length; i++) { var t = el.querySelector(TITLE_SELECTORS[i]); if (t && t.textContent.trim()) return t.textContent.trim(); }
    return '';
  }
  function lightbox(src, cap) {
    var o = document.createElement('div'); o.className = 'pp-lb';
    o.innerHTML = '<img alt=""><p></p>'; o.querySelector('img').src = src; o.querySelector('p').textContent = cap || '';
    function close() { o.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    o.addEventListener('click', close); document.addEventListener('keydown', esc); document.body.appendChild(o);
  }
  function build(list) {
    var f = document.createElement('figure'); f.className = 'pp-fig';
    var img = document.createElement('img'); img.className = 'pp-main'; img.alt = ''; img.loading = 'lazy';
    var cap = document.createElement('div'); cap.className = 'pp-cap';
    var zoom = document.createElement('button'); zoom.className = 'pp-zoom'; zoom.type = 'button'; zoom.setAttribute('aria-label', 'تكبير'); zoom.textContent = '⤢';
    function show(i) {
      img.src = list[i].src; cap.textContent = list[i].caption || '';
      f.querySelectorAll('.pp-thumbs img').forEach(function (t, k) { t.classList.toggle('on', k === i); });
      img.dataset.i = i;
    }
    img.addEventListener('error', function () { f.remove(); });     // صورة غير موجودة: لا يظهر شيء
    img.addEventListener('click', function () { var i = +img.dataset.i || 0; lightbox(list[i].src, list[i].caption); });
    zoom.addEventListener('click', function () { var i = +img.dataset.i || 0; lightbox(list[i].src, list[i].caption); });
    f.appendChild(img); f.appendChild(zoom); f.appendChild(cap);
    if (list.length > 1) {
      var th = document.createElement('div'); th.className = 'pp-thumbs';
      list.forEach(function (it, i) { var t = document.createElement('img'); t.src = it.src; t.alt = ''; t.addEventListener('click', function () { show(i); }); th.appendChild(t); });
      f.appendChild(th);
    }
    show(0); return f;
  }
  function refresh() {
    if (!infoEl || busy) return;
    busy = true;
    try {
      var title = titleOf(infoEl), list = title || lastId ? match(title, lastId) : [];
      var key = JSON.stringify(list.map(function (x) { return x.src; }));
      if (fig && fig.parentNode === infoEl && fig.dataset.k === key) return;   // نفس الصورة معروضة
      if (fig) fig.remove(); fig = null;
      if (list.length) { fig = build(list); fig.dataset.k = key; infoEl.insertBefore(fig, infoEl.firstChild); }
    } finally { setTimeout(function () { busy = false; }, 0); }
  }
  function start() {
    infoEl = findInfo();
    if (!infoEl) return false;
    new MutationObserver(function () { if (!busy) refresh(); }).observe(infoEl, { childList: true, subtree: true, characterData: true });
    refresh(); return true;
  }

  // تتبّع الرمز المضغوط (للمطابقة بالرمز) ثم تحديث الصورة
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-place],[data-id]') : null;
    if (el) lastId = el.getAttribute('data-place') || el.getAttribute('data-id') || '';
    setTimeout(refresh, 60); setTimeout(refresh, 400);
  }, true);

  /* ---------------- مساعد الإعداد: ?photos=setup ---------------- */
  function setup() {
    var seen = {}, rows = [];
    document.querySelectorAll('[data-place]').forEach(function (el) {
      var id = el.getAttribute('data-place'); if (seen[id]) return;
      var name = ''; var b = el.querySelector('b'), clone = el.cloneNode(true);
      clone.querySelectorAll('b,small,i,svg,circle').forEach(function (n) { n.remove(); });
      name = clone.textContent.replace(/\s+/g, ' ').trim();
      if (!name && b) name = b.textContent.trim();
      seen[id] = 1; rows.push({ id: id, name: name });
    });
    var lines = rows.map(function (r) { return '  "' + (r.name || r.id).replace(/"/g, '\\"') + '": "",' + (r.name && r.name !== r.id ? '   // الرمز: ' + r.id : ''); });
    var p = document.createElement('div'); p.className = 'pp-setup';
    p.innerHTML = '<h4>مساعد صور الأماكن</h4><div></div><textarea readonly></textarea><button type="button">نسخ</button><button type="button" style="background:#fff">إغلاق</button>';
    p.querySelector('div').textContent = (infoEl ? 'لوحة المعلومات: تم العثور عليها ✓' : 'لم أجد لوحة المعلومات ✗ (أرسل لي الملف لأضبطه)') + ' · الأماكن المكتشفة: ' + rows.length;
    p.querySelector('textarea').value = rows.length ? 'var PLACE_IMAGES = {\n' + lines.join('\n') + '\n};' : 'لم أجد عناصر [data-place]. أرسل لي ملف الصفحة لأضبطه عليها.';
    var bs = p.querySelectorAll('button');
    bs[0].onclick = function () { var t = p.querySelector('textarea'); t.select(); try { document.execCommand('copy'); bs[0].textContent = 'تم ✓'; } catch (e) {} };
    bs[1].onclick = function () { p.remove(); };
    document.body.appendChild(p);
  }

  function init() {
    var tries = 0;
    (function wait() { if (!start() && ++tries < 20) setTimeout(wait, 300); })();
    if (/[?&]photos=setup/.test(location.search)) setTimeout(setup, 700);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
