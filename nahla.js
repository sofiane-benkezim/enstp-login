/* =========================================================
   صوت النحلة BEE — تقرأ ما تقوله بصوت عالٍ (عربي / فرنسي / إنجليزي)
   مع زر كتم/تشغيل بجانب النحلة. لا يحتاج أي مكتبة.
   للتفعيل: <script src="bee-voice.js" defer></script>  (بعد السكربت الرئيسي)
   ========================================================= */
(function () {
  'use strict';
  var KEY = 'enstp-bee-voice';                      // 'on' | 'off'  (الافتراضي: تتكلم)
  var LANGS = { ar: 'ar-SA', fr: 'fr-FR', en: 'en-US' };
  var T = {
    ar: { on: 'النحلة تتكلم — اضغط لكتمها', off: 'النحلة صامتة — اضغط لتتكلم', none: 'لا يوجد صوت عربي على جهازك، لذلك قد لا يُسمع الكلام 🔇' },
    fr: { on: "L'abeille parle — cliquez pour la couper", off: "L'abeille est muette — cliquez pour activer la voix", none: "Aucune voix française sur votre appareil 🔇" },
    en: { on: 'Bee is talking — click to mute', off: 'Bee is muted — click to turn the voice on', none: 'No English voice on your device 🔇' }
  };
  var synth = ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) ? window.speechSynthesis : null;
  if (!synth) return;

  function on() { try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; } }
  function save(v) { try { localStorage.setItem(KEY, v ? 'on' : 'off'); } catch (e) {} }
  function L() { try { return LANGS[currentLang] ? currentLang : 'ar'; } catch (e) { return 'ar'; } }
  function clean(s) { return String(s).replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}️]/gu, '').replace(/\s+/g, ' ').trim(); }
  function pick(code) {
    var vs = synth.getVoices() || [], base = code.slice(0, 2), exact = null, loose = null;
    vs.forEach(function (v) {
      var vl = (v.lang || '').replace('_', '-').toLowerCase();
      if (vl === code.toLowerCase()) exact = exact || v; else if (vl.slice(0, 2) === base) loose = loose || v;
    });
    return exact || loose;
  }

  var btn, warned = {}, orig = {};

  function paint() {
    if (!btn) return;
    var o = on(), t = T[L()];
    btn.classList.toggle('off', !o);
    btn.title = o ? t.on : t.off; btn.setAttribute('aria-label', btn.title); btn.setAttribute('aria-pressed', o ? 'true' : 'false');
    btn.firstChild.className = 'fa-solid ' + (o ? 'fa-volume-high' : 'fa-volume-xmark');
  }
  function stop() { synth.cancel(); if (btn) btn.classList.remove('speaking'); }
  function speak(text) {
    if (!on()) return;
    var l = L(), c = clean(text); if (!c) return;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(c), v = pick(LANGS[l]);
    u.lang = LANGS[l]; if (v) u.voice = v; u.rate = 1; u.pitch = 1.15;   // نبرة أرفع قليلاً للنحلة
    u.onstart = function () { if (btn) btn.classList.add('speaking'); };
    u.onend = u.onerror = function () { if (btn) btn.classList.remove('speaking'); };
    if (!v && !warned[l] && synth.getVoices().length && orig.bubble) { warned[l] = 1; orig.bubble(T[l].none, 4200); }
    setTimeout(function () { synth.speak(u); }, 60);
  }
  function unlock() { if (on()) { try { var z = new SpeechSynthesisUtterance(' '); z.volume = 0; synth.speak(z); } catch (e) {} } }

  function init() {
    var host = document.getElementById('host-bee-container'); if (!host) return;

    /* الزر: يتحرك مع النحلة لأنه داخل حاويتها */
    var css = document.createElement('style');
    css.textContent =
      '.bee-voice{position:absolute;bottom:2px;inset-inline-end:-4px;z-index:3;width:30px;height:30px;border-radius:50%;border:2px solid #fff;cursor:pointer;pointer-events:auto;display:grid;place-items:center;font-size:.8rem;color:#14100a;background:linear-gradient(135deg,var(--gold-2,#ffdf9a),var(--gold,#f5b841));box-shadow:0 6px 16px rgba(0,0,0,.28);transition:transform .25s}' +
      '.bee-voice:hover{transform:scale(1.12)}.bee-voice:focus-visible{outline:3px solid var(--gold,#f5b841);outline-offset:3px}' +
      '.bee-voice.off{background:#ef4444;color:#fff}' +
      '.bee-voice.speaking{animation:beeVoiceP .9s ease-in-out infinite alternate}' +
      '@keyframes beeVoiceP{to{transform:scale(1.18)}}' +
      '@media(prefers-reduced-motion:reduce){.bee-voice.speaking{animation:none}}';
    document.head.appendChild(css);
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'bee-voice';
    btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var o = !on(); save(o); paint();
      if (o) { unlock(); speak(bubbleHello()); } else stop();
    });
    host.appendChild(btn);
    paint();

    /* اربط الصوت بما تقوله النحلة: الفقاعات */
    if (typeof triggerBeeBubbleText === 'function') {
      orig.bubble = triggerBeeBubbleText;
      window.triggerBeeBubbleText = function (text, ms) {
        orig.bubble(text, ms);
        if (!(typeof beePanelOpen !== 'undefined' && beePanelOpen)) speak(text);
      };
    }
    /* الجولة الإرشادية: تقرأ نص كل قسم */
    if (typeof tourShow === 'function') {
      var tourOrig = tourShow;
      window.tourShow = function () {
        tourOrig();
        try { speak(bt().tips[SECTIONS[beeTour].id]); } catch (e) {}
      };
    }
    /* فتح القائمة: تقرأ «إلى أين تريد أن نذهب؟» */
    if (typeof openPanel === 'function') {
      var openOrig = openPanel;
      window.openPanel = function () { unlock(); openOrig(); try { speak(bt().menu); } catch (e) {} };
    }
    if (typeof closePanel === 'function') {
      var closeOrig = closePanel;
      window.closePanel = function () { closeOrig(); stop(); };
    }
    /* تغيير اللغة: حدّث نص الزر */
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
    if (typeof changeLanguage === 'function') {
      var chOrig = changeLanguage;
      window.changeLanguage = function (l) { chOrig(l); stop(); paint(); };
    }
    try { synth.getVoices(); } catch (e) {}
  }
  function bubbleHello() { try { return bt().hello; } catch (e) { return ''; } }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
