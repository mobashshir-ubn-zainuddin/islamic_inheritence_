import json,re
M={'Husband':'husband','Wife':'wife','Son':'son','Daughter':'daughter','GrandSon':'grandson','GrandDaughter':'granddaughter',
'Father':'father','Mother':'mother','GrandFather':'grandfather','PaternalGrandMother':'paternalGrandmother','MaternalGrandMother':'maternalGrandmother',
'FullBrother':'fullBrother','FullSister':'fullSister','PaternalBrother':'paternalBrother','PaternalSister':'paternalSister',
'MaternalBrother':'maternalBrother','MaternalSister':'maternalSister','FullNephew':'fullNephew','PaternalNephew':'paternalNephew',
'FullUncle':'fullUncle','PaternalUncle':'paternalUncle','FullCousin':'fullCousin','PaternalCousin':'paternalCousin',
'PaternalCousinsGrandSon':'paternalCousinSonSon'}
d=json.load(open('data/ilmsummit_cases.json',encoding='utf8'))
out=[]
for x in d:
    if not x['category']: continue
    heirs={}
    for t in x['heirs'].split(','):
        m=re.match(r'\s*(\w+)\s+(\d+)',t)
        heirs[M[m.group(1)]]=int(m.group(2))
    exp={M[r[0]]:r[1] for r in x['category']}
    out.append({'id':x['id'],'text':x['heirs'],'heirs':heirs,'expected':exp,'steps':x['steps']})
open('site/data/ilmsummit.js','w',encoding='utf8').write('window.ILMSUMMIT='+json.dumps(out,ensure_ascii=False)+';\n')
open('site/data/ilmsummit.json','w',encoding='utf8').write(json.dumps(out,ensure_ascii=False))
print(len(out))
