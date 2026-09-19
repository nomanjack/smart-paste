(function(root){
  const read=e=>e.isContentEditable?e.innerText:e.value;
  function label(e){return [e.getAttribute('aria-label'),e.getAttribute('placeholder'),e.getAttribute('data-placeholder'),...(e.getAttribute('aria-labelledby')||'').split(/\s+/).map(id=>e.ownerDocument.getElementById(id)?.textContent),...Array.from(e.labels||[],l=>l.textContent),e.querySelector('[data-placeholder]')?.getAttribute('data-placeholder')].filter(Boolean).join(' ').trim();}
  const selector='input,textarea,[contenteditable=true],[contenteditable=plaintext-only]';
  function supported(e){
    if(!e?.matches(selector)||e.disabled||e.matches(':disabled')||e.readOnly||e.closest('[hidden],[inert],[aria-hidden="true"]')||!e.getClientRects().length)return false;
    if(e.tagName==='INPUT'&&!['text','email','tel','url'].includes(e.type))return false;
    const purpose=[label(e),e.name,e.id,e.getAttribute('autocomplete')].filter(Boolean).join(' ');
    return !/password|passcode|one.?time|otp|verification.?code|security.?code|api.?key|secret|token|credit.?card|card.?number|cardholder|cvv|cvc|cc-|social.?security|ssn/i.test(purpose);
  }
  function kind(e){const l=label(e);if(/issue title|add title|^title\b|subject/i.test(l))return 'title';if(/description|add more details|message|comments|details/i.test(l))return 'description';return e.tagName==='INPUT'&&['email','tel','url'].includes(e.type)?e.type:'text';}
  function snapshot(focus){
    if(!supported(focus))return null;
    const group=focus.closest('form,[role=dialog],dialog,fieldset,[role=form]');
    const scope=group||focus.parentElement;if(!scope)return null;
    const eligible=(group?Array.from(scope.querySelectorAll(selector)):[focus]).filter(el=>supported(el)&&(el===focus||!read(el).trim()));
    // Never drop the focused control when bounding larger forms.
    const selected=new Set([focus,...eligible].slice(0,8));
    const fields=eligible.filter(el=>selected.has(el)).map((el,i)=>({id:'f'+i,kind:kind(el),label:(label(el)||el.name||'Text field').slice(0,160),el,before:read(el),focused:el===focus}));
    if(!fields.some(f=>f.el===focus))return null;
    return {scope,focus,heading:(scope.querySelector('h1,h2,legend,[role=heading]')?.textContent||scope.getAttribute('aria-label')||'Form').slice(0,160),fields};
  }
  const context=s=>({heading:s.heading,fields:s.fields.map(({id,kind,label,focused,before})=>({id,kind,label,focused,occupied:!!before}))});
  const fresh=s=>s.scope.isConnected&&s.fields.every(f=>supported(f.el)&&f.el.isConnected&&s.scope.contains(f.el)&&read(f.el)===f.before);
  function write(el,text){
    el.focus();
    if(el.isContentEditable){const sel=el.ownerDocument.getSelection(),r=el.ownerDocument.createRange();r.selectNodeContents(el);sel.removeAllRanges();sel.addRange(r);if(!el.ownerDocument.execCommand('insertText',false,text))throw Error('Editor rejected the paste.');}
    else {const w=el.ownerDocument.defaultView,p=el.tagName==='TEXTAREA'?w.HTMLTextAreaElement.prototype:w.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(el,text);el.dispatchEvent(new w.InputEvent('input',{bubbles:true,inputType:'insertFromPaste',data:text}));el.dispatchEvent(new w.Event('change',{bubbles:true}));}
  }
  async function apply(s,values,wait=ms=>new Promise(r=>setTimeout(r,ms))){
    if(!fresh(s))throw Error('Form changed. Focus the field again.');
    const changes=[];let error;
    try {for(const f of s.fields){const value=values[f.id];if(typeof value!=='string')continue;if(!f.el.isConnected||read(f.el)!==f.before)throw Error('Form changed while pasting.');changes.push({...f,after:value});write(f.el,value);f.el.blur();}}
    catch(e){error=e.message;}
    // Observe twice after blur so a framework reset does not count as success.
    await wait(120);let verified=changes.length>0&&changes.every(c=>c.el.isConnected&&read(c.el)===c.after);
    await wait(330);verified=verified&&changes.every(c=>c.el.isConnected&&read(c.el)===c.after);
    if(s.focus.isConnected)s.focus.focus();
    return {changes,verified:verified&&!error,error:error||(!verified?'The app did not retain every field. Review the form; Undo is available.':null)};
  }
  async function undo(changes,wait=ms=>new Promise(r=>setTimeout(r,ms))){
    const restored=[];for(const c of changes)if(c.el.isConnected&&read(c.el)===c.after){write(c.el,c.before);c.el.blur();restored.push(c);}
    await wait(120);return restored.filter(c=>c.el.isConnected&&read(c.el)===c.before).length;
  }
  root.SmartPasteAdapters={read,label,kind,supported,snapshot,context,fresh,write,apply,undo};if(typeof module!=='undefined')module.exports=root.SmartPasteAdapters;
})(globalThis);
