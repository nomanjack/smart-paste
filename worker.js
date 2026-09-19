importScripts('core.js');
const secured=Promise.all([chrome.storage.local.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'}),chrome.storage.session.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'})]);
const trusted=url=>(url||'').startsWith(chrome.runtime.getURL(''));
const allowed=url=>trusted(url)||/^https?:\/\//.test(url||'');
const pending=new Map();
async function notify(){for(const t of await chrome.tabs.query({})){try{await chrome.tabs.sendMessage(t.id,{type:'captureChanged'});}catch{}}}
function cancelAll(){for(const ctrl of pending.values())ctrl.abort();pending.clear();}
chrome.storage.onChanged.addListener((changes,area)=>{
 if(area==='session'&&changes.capture)cancelAll();
 if(area==='local'&&(changes.key||changes.consent)){cancelAll();notify().catch(()=>{});}
});
chrome.runtime.onInstalled.addListener(async details=>{await chrome.storage.session.remove('capture');await notify();if(details.reason==='install')await chrome.runtime.openOptionsPage();});
chrome.runtime.onMessage.addListener((m,sender,reply)=>{
 if(!allowed(sender.url))return;
 (async()=>{
  await secured;
  if(m.type==='settings'){await chrome.runtime.openOptionsPage();return {};}
  const settings=await chrome.storage.local.get({key:'',consent:false});
  if(m.type==='capture'){
    if(!trusted(sender.url))throw Error('Capture is available from the extension button.');
    if(settings.key&&typeof m.text==='string'&&m.text.includes(settings.key)){const saved=await chrome.storage.session.get('capture');if(saved.capture){await chrome.storage.session.remove('capture');await notify();}throw Error('Your key is saved. Copy other text to capture.');}
    SmartPasteCore.candidates(m.text);
    const capture={text:m.text,version:crypto.randomUUID()};await chrome.storage.session.set({capture});await notify();return {ok:true};
  }
  if(m.type==='clear'){await chrome.storage.session.remove('capture');await notify();return {};}
  if(m.type==='status'){const saved=await chrome.storage.session.get('capture');if(settings.key&&saved.capture?.text?.includes(settings.key)){await chrome.storage.session.remove('capture');await notify();return {ready:!!settings.key&&settings.consent};}return {...saved,ready:!!settings.key&&settings.consent};}
  const tab=sender.tab?.id??sender.url;
  if(m.type==='cancel'){pending.get(tab)?.abort();pending.delete(tab);return {};}
  const direct=m.type==='preparePaste';
  if(m.type!=='prepare'&&!direct)throw Error('Unknown request');
  if(!settings.key||!settings.consent)throw Error('Add a TypeSafe key and enable matching.');
  const capture=direct?{text:m.text,version:m.version}:(await chrome.storage.session.get('capture')).capture;if(settings.key&&capture?.text?.includes(settings.key)){await chrome.storage.session.remove('capture');await notify();throw Error('Copy the text you want to paste, then capture again.');}if(!capture||capture.version!==m.version)throw Error('Clipboard capture changed.');
  if(!m.context||!Array.isArray(m.context.fields)||m.context.fields.length<1||m.context.fields.length>8||m.context.fields.some(f=>!['title','description','text','email','tel','url'].includes(f.kind)||!/^f[0-7]$/.test(f.id)||typeof f.label!=='string'||f.label.length>160))throw Error('Unsupported form.');
  const {spans,body}=SmartPasteCore.build(capture.text,m.context);
  pending.get(tab)?.abort();const ctrl=new AbortController();pending.set(tab,ctrl);const timer=setTimeout(()=>ctrl.abort(),10000),start=performance.now();
  try{
    async function current(){
      if(ctrl.signal.aborted)throw new DOMException('Cancelled','AbortError');
      const [latest,saved]=await Promise.all([chrome.storage.local.get({key:'',consent:false}),chrome.storage.session.get('capture')]);
      if(!latest.consent||latest.key!==settings.key||(!direct&&saved.capture?.version!==m.version))throw Error('Settings or capture changed. Focus the field again.');
      if(ctrl.signal.aborted)throw new DOMException('Cancelled','AbortError');
    }
    async function ask(payload){
      await current();
      if(ctrl.signal.aborted)throw new DOMException('Cancelled','AbortError');
      const res=await fetch('https://api.typesafe.ai/v1/systemone',{method:'POST',headers:{Authorization:'Bearer '+settings.key,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:ctrl.signal});
      if(!res.ok)throw Error('Jev returned HTTP '+res.status+'.');return res.json();
    }
    const data=await ask(body);
    const initial=SmartPasteCore.resolve(data.answers,spans,m.context.fields);
    const stage=SmartPasteCore.boundaries(capture.text,m.context,initial);
    let values=[],answers={};
    if(stage.items.length){
      const refined=await ask(stage.body);values=SmartPasteCore.extracted(capture.text,stage,refined.answers);
      if(values.length)answers=(await ask(SmartPasteCore.verification(capture.text,m.context,values))).answers;
    }
    await current();
    return {rows:SmartPasteCore.verifiedRows(m.context,values,answers),ms:Math.round(performance.now()-start),model:data.model,version:m.version};
  }finally{clearTimeout(timer);if(pending.get(tab)===ctrl)pending.delete(tab);}
 })().then(reply).catch(e=>reply({error:e.name==='AbortError'?'Matching cancelled or timed out.':e.message}));return true;
});

// _execute_action covers both the browser button and Command+J without a popup.
chrome.action.onClicked.addListener(async tab=>{
 if(!tab.id)return;
 try{await chrome.tabs.sendMessage(tab.id,{type:'showToolbar'});await chrome.action.setBadgeText({tabId:tab.id,text:''});await chrome.action.setTitle({tabId:tab.id,title:'Show Smart Paste'});}
 catch{await chrome.action.setBadgeText({tabId:tab.id,text:'!'});await chrome.action.setTitle({tabId:tab.id,title:'Refresh this page to show Smart Paste. Browser internal pages are unsupported.'});}
});
