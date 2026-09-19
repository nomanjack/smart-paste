(()=>{
 if(globalThis.__smartPaste)return;globalThis.__smartPaste=true;
 const A=SmartPasteAdapters;
 let capture=null,configured=false,seq=0,timer,prepared=null,busy=false,changes=[],host,root,status,preview,source;
 let stopped=false,pasteJob=null;
 const events=new AbortController();
 function shutdown(){
  if(stopped)return;stopped=true;seq++;clearTimeout(timer);events.abort();
  capture=null;prepared=null;configured=false;host?.remove();host=null;root=null;
  try{chrome.runtime.onMessage.removeListener(onMessage);}catch{}
 }
 function connected(){
  if(stopped)return false;
  try{if(chrome.runtime?.id)return true;}catch{}
  shutdown();return false;
 }
 async function send(m){
  if(!connected())return {error:'Extension reloaded. Refresh this page.'};
  try{return await chrome.runtime.sendMessage(m);}
  catch(error){
   if(!connected()||/extension context invalidated/i.test(error?.message||'')){shutdown();return {error:'Extension reloaded. Refresh this page.'};}
   throw error;
  }
 }
 function panel(){
  if(host)return;
  host=document.createElement('div');host.setAttribute('data-smart-paste','');host.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:2147483647';
  root=SmartPasteUI.mountToolbar(host,{shadow:true});
  document.documentElement.append(host);status=root.querySelector('[role=status]');preview=root.querySelector('#preview');source=root.querySelector('pre');
  root.querySelector('#settings').onclick=()=>send({type:'settings'}).catch(()=>show('Couldn’t open settings. Try again.','error'));
  root.querySelector('#close').onclick=()=>{invalidate();host?.remove();host=null;root=null;};
  root.querySelector('#retry').onclick=()=>{const focus=prepared?.snapshot.focus||lastFocus;if(focus){focus.focus();schedule(focus);}};
  root.querySelector('#original').onclick=async()=>{
   if(busy||!capture)return;
   const snapshot=prepared?.snapshot||A.snapshot(lastFocus);
   if(!snapshot||!A.fresh(snapshot)){show('Focus the field again.','error');return;}
   const focused=snapshot.fields.find(f=>f.el===snapshot.focus);if(!focused)return;
   busy=true;show('Pasting original…','preparing');
   try{const result=await A.apply(snapshot,{[focused.id]:capture.text});changes=result.changes;invalidate();show(result.verified?'Original pasted.':result.error,result.verified?'pasted':'error');}catch(e){show(e.message,'error');}finally{busy=false;}
  };
  root.querySelector('#undo').onclick=async()=>{if(busy)return;busy=true;invalidate();try{const n=await A.undo(changes);show(n?`Restored ${n} field${n===1?'':'s'}.`:'Nothing to undo.');changes=[];}catch(e){show(e.message);}finally{busy=false;}};
 }
 let lastFocus=null;
 const show=(text,state='captured')=>{if(root)SmartPasteUI.setToolbarState(root,state,text);};
 function invalidate(){seq++;pasteJob=null;prepared=null;clearTimeout(timer);preview?.replaceChildren();send({type:'cancel'}).catch(()=>{});}
 let refreshing=null;
 function refresh(){if(refreshing)return refreshing;refreshing=refreshState().finally(()=>{refreshing=null;});return refreshing;}
 async function refreshState(){
  const s=await send({type:'status'});if(stopped)return;
  const changed=capture?.version!==s.capture?.version||configured!==s.ready;
  if(!changed&&host)return;
  if(changed)invalidate();if(stopped)return;capture=s.capture;configured=s.ready;
  if(!capture){host?.remove();host=null;return;}
  panel();source.textContent=capture.text;
  if(!configured){show('Add your TypeSafe key in settings.');return;}
  schedule(document.activeElement);
 }
 function schedule(focus){
  if(!connected()||busy)return;
  invalidate();if(stopped)return;
  if(A.snapshot(focus)){lastFocus=focus;show('Press ⌘V to find a match.');}
  else show('Focus a text field.');
 }
 document.addEventListener('focusin',e=>{if(!connected())return;if(e.composedPath().includes(host)||busy)return;if(A.snapshot(e.target)){if(pasteJob?.snapshot.focus===e.target&&A.fresh(pasteJob.snapshot))return;schedule(e.target);}else if(capture||host){invalidate();show('Focus a text field.');}},{capture:true,signal:events.signal});
 document.addEventListener('input',e=>{if(!connected())return;if(!busy&&!e.composedPath().includes(host)){schedule(document.activeElement);}},{capture:true,signal:events.signal});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!busy){invalidate();show('Cancelled.');}},{capture:true,signal:events.signal});
 document.addEventListener('paste',async e=>{
  if(!connected()||!configured)return;
  const snapshot=A.snapshot(document.activeElement);
  if(!snapshot)return;
  const text=e.clipboardData?.getData('text/plain');
  if(!text)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(busy)return;
  if(pasteJob?.text===text&&pasteJob.snapshot.focus===snapshot.focus&&A.fresh(pasteJob.snapshot))return;
  invalidate();const token=seq;pasteJob={text,snapshot};let applying=false;panel();lastFocus=snapshot.focus;show('Finding a match…','preparing');
  try{
   let selected;
   {
    const response=await send({type:'preparePaste',text,version:'paste-'+token,context:A.context(snapshot)});
    if(stopped||token!==seq||document.activeElement!==snapshot.focus||!A.fresh(snapshot))return;
    if(response.error)throw Error(response.error);
    selected={};
    for(const row of response.rows||[]){if(row.confident&&row.selected){const option=row.options.find(o=>o.id===row.selected);if(option)selected[row.id]=option.text;}}
   }
   if(stopped||token!==seq||document.activeElement!==snapshot.focus||!A.fresh(snapshot))return;
   if(!Object.keys(selected).length){show('No confident match.','uncertain');return;}
   busy=true;applying=true;show('Pasting…','preparing');
   const result=await A.apply(snapshot,selected);changes=result.changes;invalidate();show(result.verified?`Pasted into ${changes.length} field${changes.length===1?'':'s'}.`:result.error,result.verified?'pasted':'error');
  }catch(error){if(token===seq)show(error.message||'Couldn’t find a match.','error');}finally{if(token===seq)pasteJob=null;if(applying)busy=false;}
 },{capture:true,signal:events.signal});
 function onMessage(m){
  if(!connected())return;
  if(m.type==='showToolbar'){
   send({type:'status'}).then(s=>{if(stopped)return;configured=s.ready;panel();if(!pasteJob&&!busy)show(configured?'Press ⌘V to find a match.':'Add your TypeSafe key in settings.');}).catch(()=>show('Couldn’t load settings.','error'));
  }else if(m.type==='captureChanged')refresh().catch(e=>show(e.message));
 }
 try{chrome.runtime.onMessage.addListener(onMessage);}catch{shutdown();}
 window.addEventListener('blur',()=>{if(!busy&&host){invalidate();show('Cancelled.');}},{signal:events.signal});
 window.addEventListener('focus',()=>{if(connected()&&!busy)refresh().catch(()=>{});},{signal:events.signal});
 refresh().catch(()=>{});
})();
