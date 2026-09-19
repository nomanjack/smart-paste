(async()=>{
 const app=SmartPasteUI.mountSettings(document.getElementById('app')),$=id=>app.querySelector('#'+id),save=app.querySelector('.sp-save');
 const clearError=()=>{$('key').removeAttribute('aria-invalid');$('key-error').hidden=true;$('key-error').textContent='';};
 $('key').addEventListener('input',clearError);$('consent').addEventListener('change',clearError);
 save.disabled=true;
 try{const s=await chrome.storage.local.get({key:'',consent:false});$('key').value=s.key;$('consent').checked=s.consent;$('connection').textContent=s.key?'Key saved':'Not configured';}
 catch{$('status').textContent='Couldn’t load settings. Reload this page.';return;}
 save.disabled=false;
 $('shortcut').onclick=()=>chrome.tabs.create({url:'chrome://extensions/shortcuts'});
 $('settings').onsubmit=async e=>{
  e.preventDefault();if(save.disabled)return;clearError();
  const key=$('key').value.trim(),consent=$('consent').checked;
  if(consent&&!key){$('key-error').textContent='Add a key to find matches.';$('key-error').hidden=false;$('key').setAttribute('aria-invalid','true');$('status').textContent='Add a key to find matches.';$('key').focus();return;}
  save.disabled=true;save.textContent='Saving…';$('settings').setAttribute('aria-busy','true');
  try{await chrome.storage.local.set({key,consent});$('connection').textContent=key?'Key saved':'Not configured';$('status').textContent='Changes saved.';}
  catch{$('status').textContent='Couldn’t save. Try again.';}
  finally{save.disabled=false;save.textContent='Save changes';$('settings').removeAttribute('aria-busy');}
 };
})();
