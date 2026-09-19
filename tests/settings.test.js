const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const {JSDOM}=require('jsdom');
const source=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
test('shared settings supports reveal and revoking matching',async()=>{
 const dom=new JSDOM('<main id="app"></main>',{runScripts:'outside-only'}),w=dom.window;let saved;
 w.chrome={storage:{local:{get:async()=>({key:'test-only-key',consent:true}),set:async s=>{saved=s;}}},tabs:{create:async()=>{}}};
 w.eval(source('shared-ui.js'));w.eval(source('options.js'));await new Promise(setImmediate);
 const q=s=>w.document.querySelector(s);assert.equal(q('#key').type,'password');assert.equal(q('#connection').textContent,'Key saved');
 q('#reveal').click();assert.equal(q('#key').type,'text');q('#reveal').click();assert.equal(q('#key').type,'password');
 assert.equal(q('.sp-settings nav'),null);assert.equal(q('#settings-preview'),null);assert.equal(q('.sp-foot'),null);assert.match(q('label[for=consent]').textContent,/Find a match/);
 q('#key').value='';q('#consent').checked=false;q('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await new Promise(setImmediate);
 assert.equal(saved.key,'');assert.equal(saved.consent,false);assert.equal(q('#status').textContent,'Changes saved.');dom.window.close();
});
test('all toolbar states use the shared renderer',()=>{
 const dom=new JSDOM('<div id="mount"></div>',{runScripts:'outside-only'}),w=dom.window;w.eval(source('shared-ui.js'));const target=w.SmartPasteUI.mountToolbar(w.document.querySelector('#mount'));
 for(const state of ['captured','preparing','ready','uncertain','pasted','error']){w.SmartPasteUI.setDemoState(target,state);assert.equal(target.querySelector('.sp-panel').dataset.state,state);assert.ok(target.querySelector('[role=status]').textContent);assert.equal(target.querySelectorAll('.sp-choice').length,['ready','uncertain'].includes(state)?2:0);}
 dom.window.close();
});
test('compact toolbar hides secondary actions and retains full long status',()=>{
 const dom=new JSDOM('<div id="mount"></div>',{runScripts:'outside-only'}),w=dom.window;w.eval(source('shared-ui.js'));const target=w.SmartPasteUI.mountToolbar(w.document.querySelector('#mount'));
 assert.equal(target.querySelector('.sp-brand-chip').textContent,'');assert.ok(target.querySelector('.sp-brand-chip img'));
 for(const state of ['captured','preparing','ready','uncertain','pasted','error']){
  w.SmartPasteUI.setDemoState(target,state);
  for(const id of ['review','original'])assert.equal(target.querySelector('#'+id).hidden,true);
  for(const id of ['settings','close'])assert.equal(target.querySelector('#'+id).hidden,state!=='captured');
  target.querySelector('#review').click();assert.equal(target.querySelector('.sp-panel').dataset.expanded,'false');
 }
 const long='A long failure detail. '.repeat(50);w.SmartPasteUI.setToolbarState(target,'error',long);
 assert.equal(target.querySelector('[role=status]').title,long);assert.equal(target.querySelector('[role=status]').textContent,long);dom.window.close();
});
test('resize retargets from the rendered width and skips motion when reduced',()=>{
 const dom=new JSDOM('<div id="mount"></div>',{runScripts:'outside-only'}),w=dom.window;
 let reduce=false;w.matchMedia=()=>({matches:reduce});w.eval(source('shared-ui.js'));
 const target=w.SmartPasteUI.mountToolbar(w.document.querySelector('#mount')),panel=target.querySelector('.sp-panel');
 const widths=[270,190,230,350,300,250],starts=[];
 panel.getBoundingClientRect=()=>({width:widths.shift()});
 Object.defineProperty(panel,'offsetWidth',{get(){starts.push(panel.style.width);return 0;}});
 w.SmartPasteUI.setToolbarState(target,'preparing','Finding a match…');
 w.SmartPasteUI.setToolbarState(target,'error','Try again.');
 assert.deepEqual(starts,['270px','230px']);assert.equal(panel.style.width,'350px');
 assert.equal(panel.querySelector('.sp-bar').style.width,'350px');
 w.SmartPasteUI.setToolbarState(target,'error','Try again.');
 assert.equal(widths.length,2,'identical updates must not restart measurement or motion');
 reduce=true;w.SmartPasteUI.setToolbarState(target,'ready','Ready.');
 assert.equal(panel.style.width,'');assert.equal(panel.querySelector('.sp-bar').style.width,'');assert.equal(starts.length,2);dom.window.close();
});

test('missing key reports an associated error and focuses the field',async()=>{
 const dom=new JSDOM('<main id="app"></main>',{runScripts:'outside-only'}),w=dom.window;let saves=0;
 w.chrome={storage:{local:{get:async()=>({key:'',consent:true}),set:async()=>{saves++;}}},tabs:{create:async()=>{}}};
 w.eval(source('shared-ui.js'));w.eval(source('options.js'));await new Promise(setImmediate);
 const q=s=>w.document.querySelector(s);q('form').dispatchEvent(new w.Event('submit',{cancelable:true}));
 assert.equal(q('#key').getAttribute('aria-invalid'),'true');assert.equal(q('#key-error').hidden,false);assert.equal(w.document.activeElement,q('#key'));assert.equal(saves,0);
 q('#key').value='test';q('#key').dispatchEvent(new w.Event('input'));assert.equal(q('#key').hasAttribute('aria-invalid'),false);dom.window.close();
});
test('focus remains in the toolbar when its focused action disappears',()=>{
 const dom=new JSDOM('<main id="app"></main>',{runScripts:'outside-only'}),w=dom.window;w.eval(source('shared-ui.js'));const target=w.SmartPasteUI.mountToolbar(w.document.querySelector('main'));
 w.SmartPasteUI.setDemoState(target,'pasted');target.querySelector('#undo').focus();w.SmartPasteUI.setDemoState(target,'captured');assert.equal(w.document.activeElement,target.querySelector('.sp-panel'));dom.window.close();
});

test('capture popup keeps rejected clipboard text out of the DOM',async()=>{
 const dom=new JSDOM('<main id="app"></main>',{runScripts:'outside-only'}),w=dom.window;
 Object.defineProperty(w.navigator,'clipboard',{value:{readText:async()=> 'test-only-secret'}});
 w.chrome={runtime:{sendMessage:async()=>({error:'API key not captured. Copy the text you want to paste.'}),openOptionsPage:async()=>{}}};
 w.eval(source('shared-ui.js'));w.eval(source('popup.js'));await new Promise(setImmediate);
 assert.equal(w.document.querySelector('#capture').textContent,'');assert.equal(w.document.querySelector('#capture-details').hidden,true);assert.ok(!w.document.body.textContent.includes('test-only-secret'));assert.match(w.document.querySelector('#capture-status').textContent,/API key not captured/);dom.window.close();
});
test('popup ignores overlapping capture attempts',async()=>{
 const dom=new JSDOM('<main id="app"></main>',{runScripts:'outside-only'}),w=dom.window;let reads=0,finish;
 Object.defineProperty(w.navigator,'clipboard',{value:{readText:()=>{reads++;return new Promise(resolve=>{finish=resolve;});}}});
 w.chrome={runtime:{sendMessage:async()=>({ok:true}),openOptionsPage:async()=>{}}};
 w.eval(source('shared-ui.js'));w.eval(source('popup.js'));w.document.querySelector('#read').onclick();assert.equal(reads,1);
 finish('A sample message.');await new Promise(setImmediate);assert.equal(w.document.querySelector('#read').disabled,false);assert.equal(w.document.querySelector('#capture').textContent,'A sample message.');dom.window.close();
});
