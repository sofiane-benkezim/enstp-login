/* =========================================================
   مساعد البحث الذكي - ENSTP  (يعمل محلياً بالكامل، بدون خادم أو مفتاح API)
   يفهم أسئلة الطلبة بالعربية / الفرنسية / الإنجليزية (وبعض الدارجة)
   ويوجّههم إلى الصفحة المناسبة داخل الموقع.
   للتفعيل في أي صفحة:  <script src="assistant.js" defer></script>
   لإضافة صفحة جديدة: أضف عنصراً جديداً في مصفوفة PAGES أدناه.
   ========================================================= */
(function () {
  'use strict';
  if (window.__enstpAssistant) return;
  window.__enstpAssistant = true;

  /* ---------- قاعدة المعرفة: صفحات الموقع ---------- */
  var PAGES = [
    { url: 'ecole.html', icon: 'fa-building',
      t: { ar: 'المدرسة العليا للأشغال العمومية', fr: 'École Nationale Supérieure des TP', en: 'The school (ENSTP)' },
      d: { ar: 'نبذة عن المدرسة وبعض القاعات والمدرجات.', fr: "Aperçu de l'école, de ses salles et amphithéâtres.", en: 'Overview of the school, its halls and lecture theaters.' },
      k: 'مدرسة ecole école enstp نبذة تعريف presentation présentation about school كلية جامعة' },
    { url: 'ecolemap.html', icon: 'fa-route',
      t: { ar: 'خريطة الحرم والمسارات الداخلية', fr: 'Plan du campus et itinéraires', en: 'Campus map & internal paths' },
      d: { ar: 'أين توجد القاعات والمدرجات والمقصف وكيف تصل إليها.', fr: 'Où se trouvent salles, amphis et buvette, et comment y aller.', en: 'Where rooms, lecture halls and the canteen are, and how to get there.' },
      k: 'خريطة خريطه map plan campus حرم مسار مسارات itineraire itinéraire path where اين وين فين أين où قاعة قاعات salle salles amphi مدرج مقصف buvette cafeteria canteen توجيه orientation مبنى بناية batiment bâtiment block bloc ضايع perdu lost' },
    { url: 'temp.html', icon: 'fa-calendar-days',
      t: { ar: 'جدول التوقيت', fr: 'Emploi du temps', en: 'Class timetable' },
      d: { ar: 'مواعيد الحصص والقاعات وأسماء الأساتذة لكل فوج.', fr: 'Horaires des cours, salles et enseignants par groupe.', en: 'Class times, rooms and teachers for each group.' },
      k: 'جدول توقيت زمني حصص حصة مواعيد emploi temps horaire horaires timetable schedule planning cours seance séance groupe فوج قسم section سداسي semestre اليوم today demain tomorrow ouvrage' },
    { url: 'agenda.html', icon: 'fa-list-check',
      t: { ar: 'الرزنامة اليومية', fr: 'Agenda quotidien', en: 'Daily agenda' },
      d: { ar: 'نظّم مهامك ومواعيدك وتذكيراتك.', fr: 'Organisez vos tâches, rendez-vous et rappels.', en: 'Organise your tasks, appointments and reminders.' },
      k: 'رزنامة رزنامه agenda مهام مهمة وظائف تذكير تذكيرات rappel rappels tasks task todo reminder calendrier calendar تنظيم organisation planner devoir devoirs tp امتحان examen exam موعد deadline' },
    { url: 'professors.html', icon: 'fa-chalkboard-user',
      t: { ar: 'دليل الأساتذة والبريد المؤسساتي', fr: 'Annuaire des enseignants', en: 'Faculty directory & emails' },
      d: { ar: 'أسماء الأساتذة وبريدهم الإلكتروني الرسمي.', fr: 'Noms des enseignants et adresses e-mail officielles.', en: 'Teacher names and official email addresses.' },
      k: 'استاذ أستاذ اساتذة أساتذة دكتور بروفيسور بريد ايميل email mail professeur professeurs enseignant enseignants annuaire teacher teachers professor faculty contact تواصل مراسلة اتصال prof' },
    { url: 'dms.html', icon: 'fa-bridge',
      t: { ar: 'قسم المنشآت والجسور (DMS)', fr: "Département Ouvrages d'Art (DMS)", en: 'Structures & Bridges dept. (DMS)' },
      d: { ar: 'تخصص المنشآت الفنية والهندسة المدنية.', fr: 'Spécialité ouvrages d’art, génie civil et structures.', en: 'Structural engineering and bridges specialty.' },
      k: 'dms منشآت منشات جسور جسر ouvrages ouvrage art structures structure bridge bridges قسم département departement genie génie civil مدني هندسة تخصص specialite spécialité' },
    { url: 'dib.html', icon: 'fa-road',
      t: { ar: 'قسم الطرقات والمنشآت القاعدية (DIB)', fr: 'Département Infrastructures de Base (DIB)', en: 'Highway Infrastructure dept. (DIB)' },
      d: { ar: 'تصميم الطرق والتعبيد وإدارة المرور.', fr: 'Conception des routes, chaussées et trafic.', en: 'Road design, pavements and traffic management.' },
      k: 'dib طرق طرقات طريق تعبيد مرور routes route infrastructure infrastructures chaussee chaussée road roads highway traffic قسم département departement تخصص specialite spécialité' },
    { url: 'labo.html', icon: 'fa-flask',
      t: { ar: 'المخابر العلمية والتقنية', fr: 'Laboratoires scientifiques', en: 'Scientific laboratories' },
      d: { ar: '7 مخابر: فيزياء، كيمياء، موائع، تربة، مقاومة المواد، كهرباء، مواد البناء.', fr: '7 labos : physique, chimie, fluides, sols, RDM, électricité, matériaux.', en: '7 labs: physics, chemistry, fluids, soils, strength of materials, electricity, construction materials.' },
      k: 'مخبر مخابر labo laboratoire laboratoires lab labs tp travaux pratiques تطبيقية فيزياء كيمياء physique chimie physics chemistry mdf mds mdc rdm موائع تربة خرسانة مقاومة المواد béton beton sols fluides electricite électricité كهرباء materiaux matériaux' },
    { url: 'scolarite.html', icon: 'fa-id-card',
      t: { ar: 'مصلحة الدراسة والتسجيل (Scolarité)', fr: 'Service Scolarité & Inscription', en: 'Registrar / Scolarité' },
      d: { ar: 'الشهادات المدرسية، كشوف النقاط، التسجيلات السنوية.', fr: 'Certificats de scolarité, relevés de notes, inscriptions.', en: 'Enrolment certificates, transcripts, registrations.' },
      k: 'شهادة شهادات مدرسية دراسة تسجيل تسجيلات كشف نقاط علامات اعادة اعادة التسجيل scolarite scolarité inscription reinscription réinscription certificat releve relevé notes attestation certificate transcript registration registrar enrollment administration ادارة اداره وثائق documents ملف dossier' },
    { url: 'bib.html', icon: 'fa-book-open',
      t: { ar: 'المكتبة المركزية', fr: 'Bibliothèque centrale', en: 'Central library' },
      d: { ar: 'المراجع الهندسية ومذكرات التخرج وقاعات المطالعة.', fr: "Ouvrages d'ingénierie, PFE et salles de lecture.", en: 'Engineering books, graduation theses and reading rooms.' },
      k: 'مكتبة مكتبه كتب كتاب مراجع مرجع مذكرة مذكرات تخرج مطالعة bibliotheque bibliothèque livre livres pfe memoire mémoire library book books thesis theses reading lecture' },
    { url: 'food.html', icon: 'fa-utensils',
      t: { ar: 'مطاعم ومقاهي الجوار', fr: 'Restaurants & cafés à proximité', en: 'Nearby restaurants & cafés' },
      d: { ar: 'أفضل أماكن الأكل والقهوة قرب بوابة المدرسة.', fr: 'Les meilleurs fast-foods et cafés près de l’école.', en: 'Best food and coffee spots near the school gate.' },
      k: 'اكل أكل مطعم مطاعم مقهى مقاهي قهوة وجبة وجبات سندويتش ماكلة جوع restaurant restaurants cafe café manger nourriture fast food fastfood sandwich pizza tacos eat food coffee lunch dejeuner déjeuner' },
    { url: 'print.html', icon: 'fa-print',
      t: { ar: 'مراكز الطباعة والنسخ والبقالة', fr: 'Impression, copie & épiceries', en: 'Printing, copying & groceries' },
      d: { ar: 'طباعة المخططات A0/A1 والدروس ومحلات قريبة.', fr: 'Tirage A0/A1, cours et commerces proches.', en: 'A0/A1 plans, course notes and nearby shops.' },
      k: 'طباعة طباعه نسخ تصوير مخططات مخطط ورق قرطاسية بقالة محل محلات impression imprimer photocopie copie copies tirage plan plans papeterie epicerie épicerie print printing copy xerox photocopy a0 a1 a3 a4 grocery shop shops superette supérette ليل night' },
    { url: 'pharma.html', icon: 'fa-capsules',
      t: { ar: 'الصيدليات والعيادات', fr: 'Pharmacies & cliniques', en: 'Pharmacies & clinics' },
      d: { ar: 'دليل الصيدليات والعيادات الطبية القريبة.', fr: 'Pharmacies et services de santé à proximité.', en: 'Nearby pharmacies and medical clinics.' },
      k: 'صيدلية صيدليه صيدليات دواء ادوية طبيب مريض مرض عيادة عيادات مستشفى صحة اسعاف طوارئ pharmacie pharmacies medicament médicament clinique cliniques hopital hôpital sante santé medecin médecin urgence pharmacy medicine doctor clinic hospital health emergency sick ill' },
    { url: 'transport.html', icon: 'fa-bus-simple',
      t: { ar: 'حافلات ETUSA والخطوط الجامعية', fr: 'Bus ETUSA & lignes universitaires', en: 'ETUSA buses & university lines' },
      d: { ar: 'خطوط الحافلات الرابطة بين المدرسة والمترو والقطار.', fr: "Lignes de bus reliant l’école au métro et au train.", en: 'Bus lines linking the school to metro and train stations.' },
      k: 'حافلة حافلات باص باصات نقل مواصلات مترو ترامواي قطار طاكسي تاكسي خط خطوط etusa bus transport metro métro tramway train taxi ligne lignes station stations ride commute كيفاش نروح الوصول وصول trajet itineraire itinéraire how to get route routes' },
    { url: 'tran.html', icon: 'fa-taxi',
      t: { ar: 'المواقف والمحطات الرئيسية', fr: 'Stations et arrêts principaux', en: 'Main stops & stations' },
      d: { ar: 'نقاط انطلاق الحافلات والمواصلات العامة.', fr: 'Points de départ des bus et transports en commun.', en: 'Starting points of buses and public transport.' },
      k: 'موقف مواقف محطة محطات نقطة انطلاق station stations arret arrêt arrets arrêts gare gares depart départ stop stops terminal terminus parking taxi' },
    { url: 'cousse.html', icon: 'fa-bus',
      t: { ar: 'حافلات النقل الجامعي', fr: 'Bus de transport universitaire', en: 'University bus shuttles' },
      d: { ar: 'مواقيت الانطلاق نحو كل الاتجاهات.', fr: 'Horaires de départ vers toutes les directions.', en: 'Departure times towards all directions.' },
      k: 'نقل جامعي حافلة جامعية مواقيت انطلاق اتجاهات transport universitaire navette navettes bus horaires depart départ direction directions shuttle university schedule cousse coussa اقامة' },
    { url: 'residence.html', icon: 'fa-bed',
      t: { ar: 'الإقامة الجامعية وخدماتها', fr: 'Résidence universitaire', en: 'University residence' },
      d: { ar: 'الغرف، الإطعام الداخلي، الأمن، تذاكر الوجبات.', fr: 'Chambres, restauration interne, sécurité, tickets repas.', en: 'Rooms, dining hall, security and meal tickets.' },
      k: 'اقامة إقامة اقامه جامعية غرفة غرف حي سكن اطعام مطعم جامعي تذكرة تذاكر وجبات امن residence résidence cite cité chambre chambres hebergement hébergement restaurant universitaire ticket tickets repas dorm dorms dormitory room rooms housing meal' },
    { url: 'important.html', icon: 'fa-suitcase',
      t: { ar: 'مستلزمات الغرفة والإقامة', fr: 'Équipement de chambre & conseils', en: 'Dorm checklist & tips' },
      d: { ar: 'قائمة الأغراض والنصائح التي تحتاجها في الإقامة.', fr: 'Liste des objets essentiels et conseils pour la résidence.', en: 'Essential items and tips for dorm life.' },
      k: 'مستلزمات اغراض أغراض نصائح نصيحة جهاز تجهيزات تجهيز حقيبة اشياء equipement équipement affaires conseils conseil valise besoins checklist liste essentials tips bring pack luggage need needs' },
    { url: 'sport.html', icon: 'fa-trophy',
      t: { ar: 'النوادي والأنشطة الرياضية', fr: 'Clubs & tournois sportifs', en: 'Sports clubs & tournaments' },
      d: { ar: 'كرة القدم، الشطرنج، قاعات الرياضة.', fr: 'Football, échecs et salles de sport.', en: 'Football, chess and gyms.' },
      k: 'رياضة رياضه نادي نوادي كرة قدم شطرنج قاعة رياضة كمال اجسام بطولة دوري sport sports club clubs tournoi tournois football foot echecs échecs salle gym musculation fitness tournament chess' },
    { url: 'alger.html', icon: 'fa-landmark',
      t: { ar: 'معالم ومتاحف العاصمة', fr: "Monuments & musées d'Alger", en: 'Algiers landmarks & museums' },
      d: { ar: 'مقام الشهيد، حديقة الحامة، القصبة وزيارات للطلبة.', fr: "Makam Echahid, Jardin d'Essai, Casbah.", en: 'Martyrs’ Memorial, Hamma Garden, Casbah.' },
      k: 'معالم متحف متاحف سياحة زيارة خرجة خرجات ترفيه سينما مقام الشهيد حامة القصبة الجزائر العاصمة alger algiers musee musée musees monument monuments tourisme visite sortie sorties loisir loisirs cinema cinéma casbah hamma museum museums tourism visit fun leisure culture ثقافة' },
    { url: 'drives.html', icon: 'fa-hands-holding-circle',
      t: { ar: 'مصادر الدراسة وتبادل الدروس', fr: 'Cours, examens & ressources', en: 'Study resources & exam archive' },
      d: { ar: 'ملخصات وامتحانات سابقة وحلول من الطلبة.', fr: 'Résumés, anciens sujets et corrigés partagés.', en: 'Summaries, past exams and solutions shared by students.' },
      k: 'دروس درس ملخصات ملخص امتحانات امتحان سابقة حلول مراجعة مصادر drive drives cours resume résumé resumes examens examen sujets corrige corrigé corriges td tp series séries revision révision ressources study resources exam exams past papers solutions notes summary lessons pdf مراجعه' },
    { url: 'experience.html', icon: 'fa-heart-pulse',
      t: { ar: 'جلسات التوجيه ونقل الخبرة', fr: 'Mentorat & orientation', en: 'Mentorship & guidance' },
      d: { ar: 'جلسات يقدمها الطلبة القدامى للمستجدين.', fr: 'Sessions animées par les anciens pour les nouveaux.', en: 'Sessions by senior students for newcomers.' },
      k: 'توجيه نصيحة خبرة تجربة قدامى مستجدين جدد تكافل تضامن مساعدة mentorat orientation conseil conseils experience expérience anciens nouveaux bac solidarite solidarité aide mentor mentoring guidance advice senior seniors newcomers freshman freshmen help' },
    { url: 'ai.html', icon: 'fa-robot',
      t: { ar: 'المساعد الذكي بالذكاء الاصطناعي (Gemini)', fr: 'Assistant IA (Gemini)', en: 'AI assistant (Gemini)' },
      d: { ar: 'اطرح أي سؤال بجمل طبيعية (يتطلب مفتاح Gemini).', fr: 'Posez vos questions en langage naturel (clé Gemini requise).', en: 'Ask anything in natural language (needs a Gemini key).' },
      k: 'ذكاء اصطناعي ذكي مساعد نحلة سؤال اسال ai ia assistant intelligence artificielle gemini chatbot bee abeille question demander ask' }
  ];

  var STOP = ('في من الى إلى على عن هل ما ماذا اين أين وين فين كيف كيفاش علاش لماذا متى هو هي هذا هذه هاذي هاذا انا أنا اريد أريد ابغى نبغي نحب اي أي لو لي لك مع او أو ثم قد كل بعض ' +
    'le la les un une des de du dans pour sur est ou où et au aux ce cet cette que qui quoi comment quel quelle quels je tu il elle nous vous veux voudrais cherche chercher trouver ' +
    'the a an of to in on is are where how what which who do does can i me my you we want need find looking look for and or at it this that please').split(/\s+/);
  var STOPSET = {}; STOP.forEach(function (w) { STOPSET[norm1(w)] = 1; });

  /* ---------- أدوات المطابقة ---------- */
  function norm1(s) {
    return String(s).toLowerCase()
      .replace(/[ـ]/g, '')
      .normalize('NFD').replace(/[̀-ًͯ-ٰٟ]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
  }
  function stem(w) {
    if (/^[؀-ۿ]+$/.test(w)) {
      w = w.replace(/^(وال|بال|كال|فال|لل|ال)/, function (m) { return m === 'لل' ? 'ل' : ''; });
      if (w.length > 4) w = w.replace(/(ات|ون|ين|ان)$/, '');
      if (w.length > 3) w = w.replace(/^[وبلف](?=.{3,})/, '');
      return w;
    }
    if (w.length > 4) w = w.replace(/(s|x)$/, '');
    return w;
  }
  function tokens(s, dropStop) {
    return norm1(s).split(/[^a-z0-9؀-ۿ]+/).filter(Boolean).map(function (w) { return dropStop && STOPSET[w] ? '' : stem(w); }).filter(function (w) { return w.length > 1 || /\d/.test(w); });
  }
  function lev1(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, e = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++e > 1) return false;
      if (a.length > b.length) i++; else if (a.length < b.length) j++; else { i++; j++; }
    }
    return e + (a.length - i) + (b.length - j) <= 1;
  }

  PAGES.forEach(function (p) {
    p._title = {};
    ['ar', 'fr', 'en'].forEach(function (l) { tokens(p.t[l]).forEach(function (w) { p._title[w] = 1; }); });
    p._kw = {};
    tokens(p.k).forEach(function (w) { p._kw[w] = 1; });
    p._kwList = Object.keys(p._kw);
  });

  function scorePage(p, q) {
    var s = 0, hit = 0;
    q.forEach(function (t) {
      var best = 0;
      if (p._title[t]) best = 4;
      else if (p._kw[t]) best = 3;
      else if (t.length >= 3) {
        for (var i = 0; i < p._kwList.length; i++) {
          var k = p._kwList[i];
          if (k.length >= 3 && (k.indexOf(t) === 0 || t.indexOf(k) === 0) && Math.min(k.length, t.length) >= 3) { best = Math.max(best, 2); }
          else if (t.length >= 5 && k.length >= 5 && lev1(t, k)) { best = Math.max(best, 1.5); }
        }
      }
      if (best) { hit++; s += best; }
    });
    return s + hit * 0.5;
  }

  function search(text) {
    var q = tokens(text, true);
    if (!q.length) q = tokens(text, false);
    var res = PAGES.map(function (p) { return { p: p, s: scorePage(p, q) }; })
      .filter(function (r) { return r.s >= 2; })
      .sort(function (a, b) { return b.s - a.s; });
    return res;
  }

  /* ---------- النصوص ---------- */
  var UI = {
    ar: { title: 'المساعد الذكي', sub: 'اسألني وسأوجّهك للصفحة المناسبة', ph: 'اكتب سؤالك... مثلاً: أين الصيدلية؟', send: 'إرسال', open: 'افتح المساعد', close: 'إغلاق',
      hello: 'مرحباً! 👋 اسألني عن أي شيء في الموقع: الجدول، القاعات، الأساتذة، النقل، الإقامة، المطاعم... وسأدلّك على الصفحة المناسبة.',
      found: 'وجدت لك هذا:', more: 'قد يفيدك أيضاً:', none: 'لم أجد نتيجة دقيقة 🤔 جرّب كلمات أخرى، أو اختر من الاقتراحات:', thanks: 'العفو! أنا هنا متى احتجت. 😊', go: 'فتح الصفحة',
      sug: ['أين الصيدلية؟', 'جدول التوقيت', 'كيف أصل بالحافلة؟', 'شهادة مدرسية', 'مطاعم قريبة', 'بريد الأساتذة'] },
    fr: { title: 'Assistant intelligent', sub: 'Posez votre question, je vous oriente', ph: 'Écrivez... ex : où est la pharmacie ?', send: 'Envoyer', open: "Ouvrir l'assistant", close: 'Fermer',
      hello: "Bonjour ! 👋 Posez-moi une question sur le site : emploi du temps, salles, enseignants, transport, résidence, restauration… Je vous dirige vers la bonne page.",
      found: 'Voici ce que j’ai trouvé :', more: 'Peut aussi vous aider :', none: "Je n'ai pas trouvé de résultat précis 🤔 Essayez d'autres mots, ou choisissez une suggestion :", thanks: 'Avec plaisir ! 😊', go: 'Ouvrir la page',
      sug: ['Où est la pharmacie ?', 'Emploi du temps', 'Bus vers le métro', 'Certificat de scolarité', 'Restaurants proches', 'E-mails des profs'] },
    en: { title: 'Smart assistant', sub: 'Ask me and I will point you to the right page', ph: 'Type your question... e.g. where is the pharmacy?', send: 'Send', open: 'Open assistant', close: 'Close',
      hello: 'Hi! 👋 Ask me anything about this site: timetable, rooms, teachers, transport, residence, food… I will point you to the right page.',
      found: 'Here is what I found:', more: 'You may also like:', none: "I couldn't find an exact match 🤔 Try other words, or pick a suggestion:", thanks: 'You are welcome! 😊', go: 'Open page',
      sug: ['Where is the pharmacy?', 'Class timetable', 'Bus to the metro', 'Enrolment certificate', 'Restaurants nearby', 'Teachers emails'] }
  };
  var GREET = /(^|\s)(سلام|السلام|مرحبا|اهلا|أهلا|صباح|مساء|hello|hi|hey|bonjour|salut|bonsoir|coucou)(\s|$)/;
  var THANKS = /(شكرا|بارك|merci|thanks|thank)/;

  function lang() {
    var l = (document.documentElement.lang || '').slice(0, 2);
    if (l === 'ar' || l === 'fr' || l === 'en') return l;
    try { var s = localStorage.getItem('enstp-lang'); if (UI[s]) return s; } catch (e) {}
    return 'ar';
  }

  /* ---------- الواجهة ---------- */
  var css = [
    '.eas-fab{position:fixed;inset-inline-end:24px;bottom:90px;z-index:10000;width:54px;height:54px;border-radius:18px;border:0;cursor:pointer;display:grid;place-items:center;font-size:1.2rem;color:#14100a;background:linear-gradient(135deg,var(--gold-2,#ffdf9a),var(--gold,#f5b841) 55%,#e29a14);box-shadow:0 14px 34px rgba(245,184,65,.45),inset 0 1px 0 rgba(255,255,255,.5);transition:transform .3s,box-shadow .3s}',
    '.eas-fab:hover{transform:translateY(-3px) scale(1.04)}.eas-fab:focus-visible{outline:3px solid #fff;outline-offset:3px}',
    '.eas-fab .eas-dot{position:absolute;top:-4px;inset-inline-start:-4px;width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid #fff;animation:eas-p 2s infinite}',
    '@keyframes eas-p{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}',
    '.eas-panel{--eas-bg:#fff;--eas-fg:#0b1d3a;--eas-mut:#5a6b88;--eas-soft:rgba(20,50,110,.06);--eas-b:rgba(20,50,110,.14);position:fixed;inset-inline-end:24px;bottom:156px;z-index:10001;width:min(392px,calc(100vw - 28px));height:min(560px,calc(100vh - 190px));display:flex;flex-direction:column;border-radius:26px;overflow:hidden;background:var(--eas-bg);color:var(--eas-fg);border:1px solid var(--eas-b);box-shadow:0 30px 80px rgba(2,10,30,.35);font-family:Cairo,Inter,system-ui,sans-serif;opacity:0;visibility:hidden;transform:translateY(16px) scale(.97);transition:opacity .3s,transform .4s cubic-bezier(.2,.8,.2,1),visibility 0s .4s}',
    'html[data-theme="dark"] .eas-panel,html.dark .eas-panel{--eas-bg:#0a1730;--eas-fg:#fff;--eas-mut:#9db0cc;--eas-soft:rgba(255,255,255,.07);--eas-b:rgba(255,255,255,.14)}',
    '.eas-panel.open{opacity:1;visibility:visible;transform:none;transition:opacity .3s,transform .4s cubic-bezier(.2,.8,.2,1),visibility 0s}',
    '.eas-head{display:flex;align-items:center;gap:12px;padding:14px 16px;color:#fff;background:linear-gradient(135deg,#0b2545,#1d4a8a)}',
    '.eas-ic{width:40px;height:40px;border-radius:13px;display:grid;place-items:center;color:#14100a;background:linear-gradient(135deg,var(--gold-2,#ffdf9a),var(--gold,#f5b841));flex-shrink:0}',
    '.eas-head b{display:block;font-size:.95rem;font-weight:900;line-height:1.2}.eas-head small{display:block;font-size:.7rem;opacity:.8;font-weight:600;margin-top:2px}',
    '.eas-x{margin-inline-start:auto;width:34px;height:34px;border-radius:11px;border:0;cursor:pointer;color:#fff;background:rgba(255,255,255,.14);font-size:1rem}.eas-x:hover{background:rgba(255,255,255,.26)}',
    '.eas-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}',
    '.eas-m{max-width:88%;padding:10px 14px;border-radius:18px;font-size:.84rem;line-height:1.7;font-weight:600;animation:eas-in .3s ease}',
    '@keyframes eas-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '.eas-m.bot{align-self:flex-start;background:var(--eas-soft);border:1px solid var(--eas-b);border-end-start-radius:6px}',
    '.eas-m.me{align-self:flex-end;color:#14100a;background:linear-gradient(135deg,var(--gold-2,#ffdf9a),var(--gold,#f5b841));border-end-end-radius:6px;font-weight:800}',
    '.eas-cards{display:flex;flex-direction:column;gap:8px;align-self:stretch;animation:eas-in .35s ease}',
    '.eas-card{display:flex;align-items:center;gap:12px;padding:11px 13px;border-radius:16px;text-decoration:none;color:var(--eas-fg);background:var(--eas-soft);border:1px solid var(--eas-b);transition:transform .25s,border-color .25s,box-shadow .25s}',
    '.eas-card:hover{transform:translateY(-2px);border-color:var(--gold,#f5b841);box-shadow:0 10px 26px rgba(245,184,65,.22)}',
    '.eas-card.top{border-color:var(--gold,#f5b841);background:linear-gradient(135deg,rgba(245,184,65,.16),var(--eas-soft))}',
    '.eas-card i.ci{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0;color:#14100a;background:linear-gradient(135deg,var(--gold-2,#ffdf9a),var(--gold,#f5b841));font-size:.95rem}',
    '.eas-card b{display:block;font-size:.84rem;font-weight:900;line-height:1.35}.eas-card span{display:block;font-size:.72rem;color:var(--eas-mut);font-weight:600;line-height:1.5;margin-top:2px}',
    '.eas-card .go{margin-inline-start:auto;color:var(--gold,#f5b841);font-size:.8rem;flex-shrink:0}[dir=rtl] .eas-card .go{transform:scaleX(-1)}',
    '.eas-sug{display:flex;gap:7px;flex-wrap:wrap;padding:0 16px 10px}',
    '.eas-sug button{border:1px solid var(--eas-b);background:var(--eas-soft);color:var(--eas-fg);padding:6px 12px;border-radius:999px;font:inherit;font-size:.72rem;font-weight:700;cursor:pointer;transition:.25s}',
    '.eas-sug button:hover{background:linear-gradient(135deg,var(--gold-2,#ffdf9a),var(--gold,#f5b841));color:#14100a;border-color:transparent}',
    '.eas-form{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--eas-b);background:var(--eas-bg)}',
    '.eas-form input{flex:1;min-width:0;padding:11px 14px;border-radius:14px;border:1px solid var(--eas-b);background:var(--eas-soft);color:var(--eas-fg);font:inherit;font-size:.84rem;font-weight:600;outline:0}',
    '.eas-form input:focus{border-color:var(--gold,#f5b841);box-shadow:0 0 0 3px rgba(245,184,65,.25)}.eas-form input::placeholder{color:var(--eas-mut);font-weight:500}',
    '.eas-form button{width:44px;border:0;border-radius:14px;cursor:pointer;color:#14100a;background:linear-gradient(135deg,var(--gold-2,#ffdf9a),var(--gold,#f5b841));font-size:.95rem}[dir=rtl] .eas-form button i{transform:scaleX(-1)}',
    '.eas-typing{display:inline-flex;gap:4px;padding:4px 0}.eas-typing i{width:6px;height:6px;border-radius:50%;background:var(--eas-mut);animation:eas-t 1s infinite}.eas-typing i:nth-child(2){animation-delay:.15s}.eas-typing i:nth-child(3){animation-delay:.3s}',
    '@keyframes eas-t{0%,80%,100%{opacity:.3;transform:none}40%{opacity:1;transform:translateY(-3px)}}',
    '@media(max-width:640px){.eas-fab{inset-inline-end:14px;bottom:84px;width:50px;height:50px}.eas-panel{inset-inline-end:10px;bottom:144px;height:min(520px,calc(100vh - 170px))}}',
    '@media(prefers-reduced-motion:reduce){.eas-fab .eas-dot,.eas-m,.eas-cards{animation:none}}'
  ].join('\n');

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function init() {
    var st = el('style'); st.textContent = css; document.head.appendChild(st);

    var fab = el('button', 'eas-fab', '<i class="fa-solid fa-wand-magic-sparkles"></i><span class="eas-dot"></span>');
    fab.type = 'button'; fab.setAttribute('aria-expanded', 'false');
    var panel = el('div', 'eas-panel'); panel.setAttribute('role', 'dialog');
    panel.innerHTML =
      '<div class="eas-head"><div class="eas-ic"><i class="fa-solid fa-wand-magic-sparkles"></i></div><div><b class="eas-t"></b><small class="eas-s"></small></div><button type="button" class="eas-x"><i class="fa-solid fa-xmark"></i></button></div>' +
      '<div class="eas-msgs" aria-live="polite"></div><div class="eas-sug"></div>' +
      '<form class="eas-form" autocomplete="off"><input type="text" maxlength="200" aria-label="question"><button type="submit"><i class="fa-solid fa-paper-plane"></i></button></form>';
    document.body.appendChild(panel); document.body.appendChild(fab);

    var msgs = panel.querySelector('.eas-msgs'), sug = panel.querySelector('.eas-sug'), form = panel.querySelector('form'), input = form.querySelector('input');
    var started = false;

    function paint() {
      var u = UI[lang()];
      panel.querySelector('.eas-t').textContent = u.title; panel.querySelector('.eas-s').textContent = u.sub;
      input.placeholder = u.ph; fab.setAttribute('aria-label', u.open); fab.title = u.open;
      panel.querySelector('.eas-x').setAttribute('aria-label', u.close);
      form.querySelector('button').setAttribute('aria-label', u.send);
      sug.innerHTML = '';
      u.sug.forEach(function (s) { var b = el('button', null, esc(s)); b.type = 'button'; b.addEventListener('click', function () { ask(s); }); sug.appendChild(b); });
      panel.dir = document.documentElement.dir || (lang() === 'ar' ? 'rtl' : 'ltr');
    }
    function scroll() { msgs.scrollTop = msgs.scrollHeight; }
    function say(text, cls) { var m = el('div', 'eas-m ' + cls); m.textContent = text; msgs.appendChild(m); scroll(); return m; }
    function cards(list, top) {
      var l = lang(), wrap = el('div', 'eas-cards');
      list.forEach(function (p, i) {
        var a = el('a', 'eas-card' + (top && i === 0 ? ' top' : ''));
        a.href = p.url;
        a.innerHTML = '<i class="ci fa-solid ' + esc(p.icon) + '"></i><div><b>' + esc(p.t[l]) + '</b><span>' + esc(p.d[l]) + '</span></div><i class="go fa-solid fa-arrow-right"></i>';
        wrap.appendChild(a);
      });
      msgs.appendChild(wrap); scroll();
    }
    function answer(text) {
      var u = UI[lang()], n = norm1(text);
      if (THANKS.test(n)) return say(u.thanks, 'bot');
      var res = search(text);
      if (!res.length) {
        if (GREET.test(' ' + n + ' ')) return say(u.hello, 'bot');
        say(u.none, 'bot');
        return;
      }
      say(u.found, 'bot');
      cards(res.slice(0, 1).map(function (r) { return r.p; }), true);
      var rest = res.slice(1, 4).filter(function (r) { return r.s >= res[0].s * 0.55; }).map(function (r) { return r.p; });
      if (rest.length) { say(u.more, 'bot'); cards(rest, false); }
    }
    function ask(text) {
      text = (text || '').trim(); if (!text) return;
      say(text, 'me'); input.value = '';
      var t = el('div', 'eas-m bot', '<span class="eas-typing"><i></i><i></i><i></i></span>'); msgs.appendChild(t); scroll();
      setTimeout(function () { t.remove(); answer(text); }, 380);
    }
    function open(v) {
      panel.classList.toggle('open', v); fab.setAttribute('aria-expanded', v);
      if (v) {
        paint();
        if (!started) { started = true; say(UI[lang()].hello, 'bot'); }
        setTimeout(function () { input.focus(); }, 250);
      }
    }
    fab.addEventListener('click', function () { open(!panel.classList.contains('open')); });
    panel.querySelector('.eas-x').addEventListener('click', function () { open(false); fab.focus(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) open(false); });
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
    paint();
    window.enstpAssistantSearch = search; /* للاختبار */
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
