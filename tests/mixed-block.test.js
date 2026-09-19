const {test}=require('node:test'),assert=require('node:assert/strict'),C=require('../core.js');
const text='Linear ticket Title: Keep draft text when switching workspaces Description: Switching workspaces clears the issue draft. Preserve title and description until the issue is created or discarded. Address Ferry Building, 1 Ferry Building, San Francisco, CA 94111 Tweet One clipboard, four destinations. Working on a little experiment that pastes just what you need. ✨ Calendar event Title: Smart Paste demo Date: 2026-09-24 End date: 2026-09-24 Start: 14:00 End: 14:30 Location: Ferry Building, San Francisco Descrip';
test('inline mixed destination block extracts complete bounded values',()=>{
 const spans=C.candidates(text),get=(destination,label)=>spans.find(s=>s.destination===destination&&s.label.toLowerCase()===label).text;
 assert.equal(get('Linear ticket','title'),'Keep draft text when switching workspaces');
 assert.equal(get('Linear ticket','description'),'Switching workspaces clears the issue draft. Preserve title and description until the issue is created or discarded.');
 assert.equal(get('Address','address'),'Ferry Building, 1 Ferry Building, San Francisco, CA 94111');
 assert.equal(get('Tweet','tweet'),'One clipboard, four destinations. Working on a little experiment that pastes just what you need. ✨');
 assert.equal(get('Calendar event','title'),'Smart Paste demo');assert.equal(get('Calendar event','date'),'2026-09-24');assert.equal(get('Calendar event','end date'),'2026-09-24');assert.equal(get('Calendar event','start'),'14:00');assert.equal(get('Calendar event','end'),'14:30');assert.equal(get('Calendar event','location'),'Ferry Building, San Francisco');
 assert.ok(!spans.some(s=>s.destination==='Calendar event'&&s.label==='Description'));for(const s of spans)assert.equal(text.slice(s.start,s.end),s.text);
});
test('issue destination cannot select calendar title or description as title',()=>{
 const fields=[{id:'f0',kind:'title',label:'Issue title'},{id:'f1',kind:'description',label:'Description'}],built=C.build(text,{heading:'New issue',fields});
 assert.ok(built.spans.every(s=>s.destination==='Linear ticket'));
 const title=built.spans.find(s=>s.label==='Title'),desc=built.spans.find(s=>s.label==='Description');
 assert.equal(built.body.questions.f0.criteria[desc.id],undefined);
 const rows=C.resolve({f0:{type:'choice',probabilities:{[title.id]:.99}},f1:{type:'choice',probabilities:{[desc.id]:.99}},ready:{type:'noul',noul:.99}},built.spans,fields);
 assert.ok(rows.every(r=>r.confident));assert.equal(rows[0].options[0].text,title.text);assert.equal(rows[1].options[0].text,desc.text);
 const wrong=C.resolve({f0:{type:'choice',probabilities:{[desc.id]:.99}},ready:{type:'noul',noul:.99}},built.spans,[fields[0]]);assert.equal(wrong[0].confident,false);
});
test('generic title cannot confidently choose between destinations',()=>{
 const fields=[{id:'f0',kind:'title',label:'Title'}],b=C.build(text,{heading:'Form',fields});const title=b.spans.find(s=>s.label==='Title');const rows=C.resolve({f0:{type:'choice',probabilities:{[title.id]:.99}},ready:{type:'noul',noul:.99}},b.spans,fields);assert.equal(rows[0].confident,false);
});
