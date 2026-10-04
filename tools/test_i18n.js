const F=require('../site/js/engine.js'), I=require('../site/js/i18n.js');
const data=require('../site/data/ilmsummit.json');
let n=0;
for(const c of data){ const a=F.calculate({counts:c.heirs,lang:'en'}), b=F.calculate({counts:c.heirs,lang:'ur'});
  if(a.heirs.map(h=>h.total).join()!==b.heirs.map(h=>h.total).join()) console.log('DIFF',c.id);
  const txt=b.steps.map(s=>s.title+s.lines.join('')).join('');
  if(/[A-Za-z]{4,}/.test(txt.replace(/Rule|rule/g,''))) { if(n++<5) console.log('English left in ur #'+c.id, txt.match(/[A-Za-z]{4,}[^۔]{0,40}/)[0]); }
}
console.log('missing keys:',[...I.missing]);
