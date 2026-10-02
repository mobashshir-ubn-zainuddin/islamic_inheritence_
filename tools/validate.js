const F=require('../site/js/engine.js');
const data=require('../site/data/ilmsummit.json');
let bad=0;
for(const c of data){
  let r; try{ r=F.calculate({counts:c.heirs,options:{literalRule12:process.argv[2]==='literal'}}); }catch(e){ console.log('#'+c.id,c.text,'CRASH',e.message); bad++; continue;}
  const diffs=[];
  const got={}; r.heirs.forEach(h=>got[h.key]=h.total);
  for(const k of new Set([...Object.keys(got),...Object.keys(c.expected)])){
    const [n,d]=(c.expected[k]||'0/1').split('/');
    const ex=F.fr(n,d||1); const g=got[k]||F.ZERO;
    if(!ex.eq(g)) diffs.push(`${k}: expected ${ex} got ${g}`);
  }
  if(diffs.length){bad++; console.log('#'+c.id,c.text,'\n   ',diffs.join('; '));}
}
console.log(`${data.length-bad}/${data.length} pass`);
