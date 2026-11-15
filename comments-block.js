/* === التعليقات (نص فقط) تظهر تحت « رأي الزبائن » في كل بطاقة ===
   اكتب تعليقك بين علامتي الاقتباس أمام اسم المكان. اتركه فارغًا "" فلا يظهر شيء.
   - نص واحد يظهر بكل اللغات:      "تعليقي هنا"
   - أو ثلاث لغات [فرنسية، إنجليزية، عربية]: ["Mon commentaire","My comment","تعليقي"]
   - للانتقال إلى سطر جديد داخل التعليق استعمل \n */
const COMMENTS={
  "Musée national du Bardo":"",
  "Musée national des Beaux-Arts":"",
  "Jardin d'Essai du Hamma":"",
  "Place des Martyrs":"",
  "Basilique Notre-Dame d'Afrique":"",
  "Grande Poste d'Alger":"",
  "Mosquée Ketchaoua":"",
  "Sablette (Les Sablettes)":"",
  "Dream Park":"",
  "Place Emir Abdelkader":"",
  "Dar Mustapha Pacha":"",
  "Bab Ezzouar Mall":"",
  "Garden City Mall":"",
  "Grande Mosquée d'Algérie":"",
};
const cmt=p=>{let c=COMMENTS[p.n];if(Array.isArray(c))c=c[LG==="fr"?0:LG==="en"?1:2];c=(c||"").toString().trim();return c?`<p class="i cm">${c.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</p>`:""};
