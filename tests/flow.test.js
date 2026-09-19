const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');const C=require('../core.js');
const sample=fs.readFileSync(path.join(__dirname,'../sample.txt'),'utf8').trimEnd();
const pause=ms=>new Promise(r=>setTimeout(r,ms));
function fixture(url='https://linear.app/acme'){
 const dom=new JSDOM('<div role="dialog" aria-label="Create issue"><h2>New issue</h2><input placeholder="Issue title"><textarea aria-label="Description"></textarea></div>',{url,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.HTMLElement.prototype.getClientRects=function(){return [{}];};
 w.eval(fs.readFileSync(path.join(__dirname,'../adapters.js'),'utf8'));
 return {dom,w,A:w.SmartPasteAdapters,title:w.document.querySelector('input'),description:w.document.querySelector('textarea')};
}
function harness({ready=true,deferred=false,url,html,noCapture=false,noMatch=false}={}){
 const f=fixture(url);if(html){f.w.document.body.innerHTML=html;f.title=f.w.document.querySelector('input');f.description=f.w.document.querySelector('textarea');}let listener,resolveRequest;const requests=[];
 const rows=[{id:'f0',kind:'title',selected:'s0',confident:true,options:[{id:'s0',text:'Keep draft text when switching workspaces',probability:.95}]},{id:'f1',kind:'description',selected:'s1',confident:true,options:[{id:'s1',text:'Switching workspaces clears the issue draft.',probability:.94}]}];
 f.w.chrome={runtime:{id:'test-extension',onMessage:{addListener(fn){listener=fn;}},sendMessage:async m=>{
  requests.push(m);if(m.type==='status')return {capture:noCapture?undefined:{text:sample,version:'v1'},ready};
  if(m.type==='prepare'||m.type==='preparePaste'){const result={rows:noMatch?[]:rows,version:m.version,ms:105};if(deferred)return new Promise(r=>resolveRequest=()=>r(result));return result;}
  return {};
 }}};
 f.w.eval(fs.readFileSync(path.join(__dirname,'../shared-ui.js'),'utf8'));
 f.w.eval(fs.readFileSync(path.join(__dirname,'../content.js'),'utf8'));
 const paste=text=>{const e=new f.w.Event('paste',{bubbles:true,cancelable:true});Object.defineProperty(e,'clipboardData',{value:{getData:()=>text}});f.title.dispatchEvent(e);return e;};
 return {...f,requests,paste,finish:()=>resolveRequest(),notify:m=>listener(m),panel:()=>f.w.document.querySelector('[data-smart-paste]').shadowRoot};
}
test('unlabeled prose yields exact issue title and descriptive spans',()=>{
 const spans=C.candidates(sample);assert.ok(spans.some(s=>s.text==='Keep draft text when switching workspaces'));
 assert.ok(spans.some(s=>s.text==='Switching workspaces clears the issue draft. Preserve the title and description until the issue is created or discarded.'));
 for(const s of spans)assert.equal(sample.slice(s.start,s.end),s.text);
});
test('uncertainty is visible, unknown choices never become text',()=>{
 const spans=C.candidates('A sentence. Another sentence.');const rows=C.resolve({f0:{type:'choice',probabilities:{s0:.45,s1:.44,evil:.99}},ready:{type:'noul',noul:.99}},spans,[{id:'f0',kind:'title'}]);assert.equal(rows[0].confident,false);assert.ok(rows[0].options.every(o=>o.id!=='evil'));
});
test('focus does not match old capture; one paste fills and undo restores',async()=>{
 const f=harness();await pause(5);f.title.focus();await pause(140);
 assert.equal(f.requests.filter(m=>m.type.startsWith('prepare')).length,0);assert.match(f.panel().textContent,/Press ⌘V/);
 const e=f.paste(sample);assert.equal(e.defaultPrevented,true);await pause(490);
 const req=f.requests.find(m=>m.type==='preparePaste');assert.equal(req.context.heading,'New issue');assert.equal(req.context.fields[0].focused,true);assert.ok(!JSON.stringify(req.context).includes('before'));
 assert.equal(f.title.value,'Keep draft text when switching workspaces');assert.equal(f.description.value,'Switching workspaces clears the issue draft.');assert.match(f.panel().textContent,/Pasted into 2 fields/);
 f.panel().querySelector('#undo').click();await pause(150);assert.equal(f.title.value,'');assert.equal(f.description.value,'');f.dom.window.close();
});

test('changed clipboard matches the current paste instead of dumping text',async()=>{const f=harness();await pause(5);f.title.focus();await pause(140);assert.equal(f.paste('Different clipboard').defaultPrevented,true);await pause(490);assert.equal(f.requests.find(m=>m.type==='preparePaste').text,'Different clipboard');assert.equal(f.title.value,'Keep draft text when switching workspaces');f.dom.window.close();});
test('late response after a silent field edit cannot paste',async()=>{const f=harness({deferred:true});await pause(5);f.title.focus();f.paste(sample);f.title.value='My edit';f.finish();await pause(20);assert.equal(f.title.value,'My edit');assert.equal(f.description.value,'');f.dom.window.close();});

test('existing sibling description is excluded from writes',()=>{const f=fixture();f.description.value='Existing notes';f.title.focus();const s=f.A.snapshot(f.title);assert.equal(s.fields.length,1);f.dom.window.close();});
test('framework reversion is not reported as successful paste',async()=>{const f=fixture();const s=f.A.snapshot(f.title);let n=0;const r=await f.A.apply(s,{f0:'New title'},async()=>{if(++n===1)f.title.value='';});assert.equal(r.verified,false);assert.match(r.error,/did not retain/);f.dom.window.close();});
test('undo preserves subsequent user edits',async()=>{const f=fixture();const s=f.A.snapshot(f.title);const r=await f.A.apply(s,{f0:'Prepared'},async()=>{});f.title.value='User edited';assert.equal(await f.A.undo(r.changes,async()=>{}),0);assert.equal(f.title.value,'User edited');f.dom.window.close();});
test('moving between fields never submits an old capture',async()=>{const f=harness();await pause(5);f.title.focus();f.description.focus();f.title.focus();await pause(140);assert.equal(f.requests.filter(m=>m.type.startsWith('prepare')).length,0);f.dom.window.close();});

test('unconfigured matching preserves native paste',async()=>{const f=harness({ready:false});await pause(5);f.title.focus();const e=f.paste(sample);assert.equal(e.defaultPrevented,false);assert.equal(f.requests.filter(m=>m.type==='prepare').length,0);f.dom.window.close();});

test('ordinary forms support multiple text fields, preserve populated siblings, and exclude credentials',async()=>{
 const f=fixture(),d=f.w.document;
 d.body.innerHTML='<form><h2>Contact</h2><label>Name<input id="name"></label><label>Company<input id="company"></label><label>Email<input id="email" type="email"></label><label>Message<textarea id="message"></textarea></label><label>Password<input id="password" type="password"></label><label>API key<input id="key"></label><label>Card number<input id="card" autocomplete="cc-number"></label><input id="hidden" type="hidden"></form>';
 d.querySelector('#company').value='Keep this';const focus=d.querySelector('#name'),snap=f.A.snapshot(focus);
 assert.deepEqual(Array.from(snap.fields,x=>x.el.id),['name','email','message']);
 for(const id of ['password','key','card','hidden'])assert.equal(f.A.snapshot(d.getElementById(id)),null);
 const values=Object.fromEntries(snap.fields.map((x,i)=>[x.id,['Alex Morgan','alex@example.com','Please send details.'][i]]));
 const result=await f.A.apply(snap,values,async()=>{});assert.equal(result.verified,true);assert.equal(d.querySelector('#company').value,'Keep this');assert.equal(await f.A.undo(result.changes,async()=>{}),3);f.dom.window.close();
});
test('standalone inputs only match themselves and larger forms retain the focused field',()=>{
 const f=fixture(),d=f.w.document;d.body.innerHTML='<input aria-label="Name"><input aria-label="Other">';assert.equal(f.A.snapshot(d.querySelector('input')).fields.length,1);
 d.body.innerHTML='<form>'+Array.from({length:12},(_,i)=>'<input aria-label="Field '+i+'">').join('')+'</form>';const focus=d.querySelectorAll('input')[11],snap=f.A.snapshot(focus);assert.equal(snap.fields.length,8);assert.ok(snap.fields.some(x=>x.el===focus));f.dom.window.close();
});
test('generic candidate values preserve exact source offsets',()=>{const text='Name: Alex Morgan\nEmail: alex@example.com\nPhone: +1 415 555 0123';const spans=C.candidates(text);for(const expected of ['Alex Morgan','alex@example.com','+1 415 555 0123'])assert.ok(spans.some(x=>x.text===expected));for(const x of spans)assert.equal(text.slice(x.start,x.end),x.text);});

test('actual content script matches, pastes, and undoes on a non-Linear form',async()=>{
 const f=harness({url:'https://example.org/contact',html:'<form><h2>Contact us</h2><label>Subject<input></label><label>Message<textarea></textarea></label></form>'});await pause(5);f.title.focus();await pause(140);
 f.paste(sample);const request=f.requests.find(m=>m.type==='preparePaste');assert.equal(request.context.heading,'Contact us');assert.equal(request.context.fields.length,2);
 await pause(510);assert.equal(f.title.value,'Keep draft text when switching workspaces');assert.equal(f.description.value,'Switching workspaces clears the issue draft.');
 f.panel().querySelector('#undo').click();await pause(150);assert.equal(f.title.value,'');assert.equal(f.description.value,'');f.dom.window.close();
});
test('window refocus preserves the pending paste without starting another request',async()=>{const f=harness({deferred:true});await pause(5);f.title.focus();f.paste(sample);f.w.dispatchEvent(new f.w.Event('focus'));await pause(10);assert.equal(f.requests.filter(m=>m.type==='preparePaste').length,1);assert.equal(f.panel().querySelector('.sp-panel').dataset.state,'preparing');f.finish();await pause(490);assert.match(f.panel().textContent,/Pasted into 2/);f.dom.window.close();});

test('synchronous context invalidation shuts down listeners and preserves native paste',async()=>{
 const f=harness();await pause(5);f.title.focus();await pause(140);let calls=0;
 f.w.chrome.runtime.sendMessage=()=>{calls++;throw Error('Extension context invalidated.');};
 f.w.dispatchEvent(new f.w.Event('focus'));await pause(5);
 assert.equal(f.w.document.querySelector('[data-smart-paste]'),null);
 f.title.dispatchEvent(new f.w.Event('input',{bubbles:true}));f.w.dispatchEvent(new f.w.Event('focus'));assert.equal(f.paste(sample).defaultPrevented,false);await pause(140);assert.equal(calls,1);f.dom.window.close();
});
test('missing runtime id stops a stale prepared paste before interception',async()=>{
 const f=harness();await pause(5);f.title.focus();await pause(140);delete f.w.chrome.runtime.id;
 assert.equal(f.paste(sample).defaultPrevented,false);assert.equal(f.w.document.querySelector('[data-smart-paste]'),null);assert.equal(f.title.value,'');f.dom.window.close();
});
test('rejected context invalidation cannot render a late match',async()=>{
 const f=harness();await pause(5);f.w.chrome.runtime.sendMessage=async()=>{throw Error('Extension context invalidated.');};f.title.focus();await pause(150);
 assert.equal(f.w.document.querySelector('[data-smart-paste]'),null);assert.equal(f.paste(sample).defaultPrevented,false);f.dom.window.close();
});
test('one paste waits for matching and fills without a second paste',async()=>{const f=harness({deferred:true});await pause(5);f.title.focus();await pause(140);assert.equal(f.paste(sample).defaultPrevented,true);f.finish();await pause(490);assert.equal(f.title.value,'Keep draft text when switching workspaces');f.dom.window.close();});
for(const action of ['edit','focus','escape'])test('pending paste cancels on '+action,async()=>{const f=harness({deferred:true});await pause(5);f.title.focus();await pause(140);f.paste('Fresh clipboard');if(action==='edit'){f.title.value='My edit';f.title.dispatchEvent(new f.w.Event('input',{bubbles:true}));}else if(action==='focus')f.description.focus();else f.title.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));f.finish();await pause(20);assert.equal(f.title.value,action==='edit'?'My edit':'');assert.equal(f.description.value,'');f.dom.window.close();});

test('paste without a previous capture still matches once',async()=>{const f=harness({noCapture:true});await pause(5);f.title.focus();assert.equal(f.paste('New clipboard').defaultPrevented,true);await pause(490);assert.equal(f.title.value,'Keep draft text when switching workspaces');assert.equal(f.requests.filter(m=>m.type==='preparePaste').length,1);f.dom.window.close();});

test('repeated paste while loading coalesces to one request and insertion',async()=>{const f=harness({deferred:true});await pause(5);f.title.focus();f.paste(sample);f.paste(sample);assert.equal(f.requests.filter(m=>m.type==='preparePaste').length,1);f.finish();await pause(490);assert.match(f.panel().textContent,/Pasted into 2/);f.dom.window.close();});

test('no match never inserts or retries on refocus',async()=>{const f=harness({noMatch:true});await pause(5);f.title.focus();f.paste(sample);await pause(20);assert.match(f.panel().textContent,/No confident match/);assert.equal(f.title.value,'');assert.equal(f.description.value,'');f.w.dispatchEvent(new f.w.Event('focus'));await pause(20);assert.equal(f.requests.filter(m=>m.type.startsWith('prepare')).length,1);assert.match(f.panel().textContent,/No confident match/);f.dom.window.close();});

test('show command mounts toolbar without capture and close dismisses it',async()=>{const f=harness({noCapture:true});await pause(5);assert.equal(f.w.document.querySelector('[data-smart-paste]'),null);f.notify({type:'showToolbar'});await pause(5);assert.match(f.panel().textContent,/Press ⌘V/);assert.equal(f.requests.filter(m=>m.type.startsWith('prepare')||m.type==='capture').length,0);f.panel().querySelector('#close').click();assert.equal(f.w.document.querySelector('[data-smart-paste]'),null);f.notify({type:'showToolbar'});await pause(5);assert.ok(f.panel());f.dom.window.close();});
