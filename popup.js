const app=SmartPasteUI.mountCapture(document.getElementById('app')),q=s=>app.querySelector(s);
const status=q('#capture-status'),preview=q('#capture');
let capturing=false;
function display(text=''){preview.textContent=text;q('#capture-details').hidden=!text;q('#capture-details').open=false;q('#clear').disabled=!text;}
async function capture(){
 if(capturing)return;capturing=true;
 q('#read').disabled=true;q('#clear').disabled=true;status.textContent='Reading clipboard…';
 try{const text=await navigator.clipboard.readText();const r=await chrome.runtime.sendMessage({type:'capture',text});if(r.error)throw Error(r.error);display(text);status.textContent='Captured. Focus a supported field to paste.';}
 catch(e){display();status.textContent=e.message||'Couldn’t read clipboard. Try again.';}
 finally{capturing=false;q('#read').disabled=false;}
}
q('#read').onclick=capture;
q('#clear').onclick=async()=>{try{const r=await chrome.runtime.sendMessage({type:'clear'});if(r.error)throw Error(r.error);display();status.textContent='Capture cleared. Copy text to start again.';}catch{status.textContent='Couldn’t clear capture. Try again.';}};
q('#capture-settings').onclick=()=>chrome.runtime.openOptionsPage();
capture();
