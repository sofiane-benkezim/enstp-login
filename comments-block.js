
const COMMENTS={
  "Musée national du Bardo":"ztyiujtk-k",
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
