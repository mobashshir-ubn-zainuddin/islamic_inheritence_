global.window={};
const F=require('../site/js/engine.js'); require('../site/js/cases.js');
let bad=0;
for(const c of window.FAMOUS_CASES){
  const r=F.calculate({counts:c.counts}); const got={}; r.heirs.forEach(h=>got[h.key]=h.total.toString());
  const ok=JSON.stringify(Object.keys(c.expect).sort().map(k=>[k,c.expect[k]]))===JSON.stringify(Object.keys(got).sort().map(k=>[k,got[k]]));
  if(!ok){bad++;console.log('FAIL',c.id,'expected',c.expect,'got',got);}
}
console.log(window.FAMOUS_CASES.length-bad+'/'+window.FAMOUS_CASES.length+' famous cases OK');
