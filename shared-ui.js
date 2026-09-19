(function(root){
 const icons={copy:'<rect x="7" y="7" width="10" height="11" rx="2"/><path d="M13 7V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/>',spark:'<path d="m10 2 2.1 5.9L18 10l-5.9 2.1L10 18l-2.1-5.9L2 10l5.9-2.1Z"/>',settings:'<path fill-rule="evenodd" clip-rule="evenodd" d="M12 1a.75.75 0 0 1 .75.75v1.281a8.96 8.96 0 0 1 3.086.825l.64-1.108a.75.75 0 1 1 1.299.75l-.64 1.109a9.05 9.05 0 0 1 2.258 2.259l1.109-.64a.75.75 0 0 1 .75 1.298l-1.108.64a8.96 8.96 0 0 1 .825 3.086h1.281a.75.75 0 0 1 0 1.5h-1.281a8.96 8.96 0 0 1-.825 3.086l1.108.639a.75.75 0 1 1-.75 1.299l-1.109-.64a9.05 9.05 0 0 1-2.259 2.259l.64 1.109a.75.75 0 0 1-1.298.75l-.64-1.108a8.96 8.96 0 0 1-3.086.825v1.281a.75.75 0 0 1-1.5 0v-1.281a8.96 8.96 0 0 1-3.086-.825l-.64 1.108a.75.75 0 1 1-1.299-.75l.64-1.109a9.05 9.05 0 0 1-2.258-2.259l-1.109.64a.75.75 0 1 1-.75-1.299l1.108-.639a8.96 8.96 0 0 1-.825-3.086H1.75a.75.75 0 0 1 0-1.5h1.281a8.96 8.96 0 0 1 .825-3.086l-1.108-.64a.75.75 0 1 1 .75-1.298l1.109.64a9.05 9.05 0 0 1 2.258-2.259l-.64-1.109a.75.75 0 1 1 1.299-.75l.64 1.108a8.96 8.96 0 0 1 3.086-.825V1.75A.75.75 0 0 1 12 1Zm0 3.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 4.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>',close:'<path d="m5 5 10 10M15 5 5 15"/>',undo:'<path d="M6 5 2 9l4 4M3 9h9a5 5 0 0 1 0 10"/>',arrow:'<path d="M4 10h12m-5-5 5 5-5 5"/>'};
 const icon=name=>name==='settings'
  ?`<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M9 12.75C10.9534 12.75 12.5778 14.149 12.9287 16H20.25C20.6642 16 21 16.3358 21 16.75C21 17.1642 20.6642 17.5 20.25 17.5H12.9287C12.5778 19.351 10.9534 20.75 9 20.75C7.0466 20.75 5.42223 19.351 5.07129 17.5H3.75C3.33579 17.5 3 17.1642 3 16.75C3 16.3358 3.33579 16 3.75 16H5.07129C5.42223 14.149 7.0466 12.75 9 12.75Z"/><path d="M15 3.25C16.9534 3.25 18.5778 4.64901 18.9287 6.5H20.25C20.6642 6.5 21 6.83579 21 7.25C21 7.66421 20.6642 8 20.25 8H18.9287C18.5778 9.85099 16.9534 11.25 15 11.25C13.0466 11.25 11.4222 9.85099 11.0713 8H3.75C3.33579 8 3 7.66421 3 7.25C3 6.83579 3.33579 6.5 3.75 6.5H11.0713C11.4222 4.64901 13.0466 3.25 15 3.25Z"/></svg>`
  :`<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.spark}</svg>`;
 let css=`
 .sp-panel,.sp-settings{--sp-surface:#f2f2f7;--sp-hover:#e8e8ed;--sp-border:#e5e5ea;--ink:#242529;--muted:#6b6b73;--line:var(--sp-border);--yellow:#f7df67;color:var(--ink);font:13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:-.12px;text-align:left;color-scheme:light}
 .sp-panel *,.sp-settings *{box-sizing:border-box}.sp-panel button,.sp-settings button,.sp-panel select,.sp-settings input{font:inherit;color:inherit}.sp-panel button,.sp-settings button{cursor:pointer}.sp-panel button:focus-visible,.sp-panel select:focus-visible,.sp-settings button:focus-visible,.sp-settings input:focus-visible{outline:2px solid #007aff;outline-offset:3px}.sp-panel svg,.sp-settings svg{vertical-align:middle;flex-shrink:0}.sp-panel button{border:0;background:transparent}.sp-panel{width:360px;max-width:calc(100vw - 32px);background:#fff;border:1px solid var(--sp-border);border-radius:16px;box-shadow:0 3px 8px #00000005,0 12px 36px #0000000d;overflow:hidden;animation:sp-in .22s ease-out}
 .sp-panel header{display:flex;align-items:center;gap:9px;padding:14px 15px 9px}.sp-panel header b{font-weight:550;flex:1}.sp-mark{width:27px;height:27px;display:inline-flex;align-items:center;justify-content:center;background:var(--yellow);border-radius:8px;color:#463d13}.sp-panel .sp-icon{width:27px;height:27px;display:grid;place-items:center;border-radius:6px;color:#6b6b73}.sp-panel .sp-icon:hover{background:var(--sp-hover);color:#242529}.sp-panel [role=status]{margin:0;padding:0 16px 12px;color:#6b6b73;font-size:11px;min-height:29px}.sp-panel #preview:empty{display:none}.sp-panel #preview{padding:0 8px 8px}.sp-choice{display:block;padding:10px 9px;background:var(--sp-surface);border-radius:9px;margin-top:3px}.sp-choice-head{display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#6b6b73;margin-bottom:6px}.sp-choice select{max-width:130px;border:0;border-radius:4px;background:transparent;color:#6b6b73;font-size:10px;padding:2px}.sp-choice output{display:block;font-size:12px;line-height:1.6;white-space:pre-wrap;max-height:155px;overflow:auto}.sp-panel details{border-top:1px solid var(--line);padding:10px 16px;font-size:11px;color:#6b6b73}.sp-panel summary{cursor:pointer}.sp-panel pre{white-space:pre-wrap;max-height:130px;overflow:auto;font:11px/1.6 inherit;color:#777;margin:9px 0 0}.sp-panel footer{display:flex;align-items:center;gap:4px;padding:9px 11px;border-top:1px solid var(--line);background:var(--sp-surface)}.sp-panel footer button{font-size:11px;padding:5px 7px;color:#6b6b73;border-radius:5px}.sp-panel footer button:hover{background:var(--sp-hover)}.sp-panel .hint{margin-left:auto;font-size:11px;color:#6b6b73;display:flex;align-items:center;gap:7px}.sp-panel kbd,.sp-settings kbd{font:11px -apple-system,BlinkMacSystemFont,sans-serif;border:1px solid var(--sp-border);border-radius:5px;padding:3px 6px;background:white;box-shadow:0 1px 0 var(--sp-border)}.sp-panel[data-state=preparing] .sp-mark svg{animation:sp-turn 2s linear infinite}.sp-panel[data-state=error] .sp-mark{background:#ffe3dc}.sp-panel[data-state=pasted] .sp-mark{background:#e1eddf}
 .sp-settings{max-width:980px;margin:0 auto;padding:38px 32px 64px}.sp-settings nav{display:flex;justify-content:space-between;align-items:center;padding-bottom:42px}.sp-brand{display:flex;gap:9px;align-items:center;font-weight:550}.sp-version{font-size:11px;color:#6b6b73}.sp-settings h1{font-size:25px;line-height:1.2;letter-spacing:-.75px;font-weight:550;margin:0 0 9px}.sp-settings .sp-subtitle{margin:0 0 30px;color:var(--muted);font-size:13px}.sp-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:56px}.sp-settings h2{font-size:12px;font-weight:550;margin:0 0 15px}.sp-settings .sp-block{padding:23px 0;border-top:1px solid var(--line)}.sp-settings .sp-block:first-child{padding-top:0;border-top:0}.sp-settings .sp-label-row{display:flex;justify-content:space-between;align-items:center;margin:0 0 9px;font-size:12px}.sp-settings .sp-badge{font-size:10px;border:1px solid var(--line);border-radius:20px;padding:2px 7px;color:#6b6b73;background:var(--sp-surface)}.sp-settings .sp-key{position:relative}.sp-settings .sp-key input{width:100%;height:42px;border:1px solid var(--sp-border);border-radius:8px;padding:10px 62px 10px 12px;background:var(--sp-surface);outline-offset:2px}.sp-settings .sp-key button{position:absolute;right:7px;top:8px;border:0;padding:5px 7px;font-size:11px;color:#6b6b73;background:transparent}.sp-settings .sp-help{font-size:11px;color:#6b6b73;margin:9px 0 0;line-height:1.65}.sp-settings a{color:#6b6b73;text-underline-offset:3px}.sp-settings .sp-toggle-row{display:flex;gap:18px;align-items:flex-start;justify-content:space-between}.sp-settings .sp-toggle-row label{font-size:12px}.sp-settings .sp-toggle-row p{color:#6b6b73;font-size:11px;line-height:1.65;max-width:320px;margin:5px 0 0}.sp-switch{appearance:none;-webkit-appearance:none;width:30px;height:18px;border:1px solid var(--sp-border);background:var(--sp-border);border-radius:20px;position:relative;flex-shrink:0;cursor:pointer;margin:2px 0}.sp-switch:before{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:100%;background:white;box-shadow:0 1px 2px #0002;transition:transform .18s}.sp-switch:checked{background:#27272a;border-color:#27272a}.sp-switch:checked:before{transform:translateX(12px)}.sp-settings .sp-shortcut{display:flex;align-items:center;justify-content:space-between;font-size:12px}.sp-settings .sp-shortcut button{border:0;background:transparent;color:#6b6b73;font-size:11px;margin-left:8px}.sp-settings .sp-save-row{display:flex;align-items:center;gap:12px;border-top:1px solid var(--line);padding-top:20px}.sp-settings .sp-save{border:1px solid #242529;background:#242529;color:white;border-radius:8px;padding:9px 15px;font-size:12px}.sp-settings #status{font-size:11px;color:#6b6b73}.sp-settings aside{padding-top:1px}.sp-settings .sp-preview-wrap{background:var(--sp-surface);border:1px solid var(--sp-border);border-radius:14px;padding:27px 13px}.sp-settings .sp-preview-wrap .sp-panel{width:100%;box-shadow:0 6px 16px #00000009}.sp-settings .sp-aside-title{color:#6b6b73;font-size:11px;margin:0 0 13px}.sp-settings .sp-steps{list-style:none;padding:0;margin:22px 0 0}.sp-settings .sp-steps li{display:flex;gap:11px;align-items:center;font-size:11px;color:#6b6b73;margin:13px 0}.sp-settings .sp-steps span{display:grid;place-items:center;border:1px solid var(--sp-border);border-radius:50%;width:19px;height:19px;color:#6b6b73;font-size:10px}.sp-settings .sp-foot{margin-top:42px;color:#6b6b73;font-size:10px;display:flex;justify-content:space-between}.sp-settings .sp-foot button{border:0;background:none;padding:0;color:#777;font-size:10px}.sp-sample{white-space:pre-wrap;background:var(--sp-surface);border-radius:8px;padding:14px;font-size:11px;line-height:1.6}.sp-settings [hidden]{display:none}
 @keyframes sp-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}@keyframes sp-turn{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.sp-panel,.sp-panel *{animation:none!important;transition:none!important}}@media(max-width:760px){.sp-layout{grid-template-columns:1fr;gap:30px}.sp-settings{padding:24px}.sp-settings nav{padding-bottom:32px}.sp-settings aside{max-width:360px}.sp-settings .sp-foot{gap:16px;flex-wrap:wrap}}
 `;

 css+=`
 .sp-panel{width:max-content;max-width:calc(100vw - 32px);border-radius:17px;overflow:hidden;background:#fff;box-shadow:0 3px 12px #00000005,0 10px 30px #0000000a;animation:sp-in .2s ease-out}
 .sp-bar{display:flex;align-items:center;gap:8px;padding:9px;min-height:58px}.sp-panel .sp-brand-chip{display:inline-flex;align-items:center;gap:6px;border-radius:10px;padding:9px 12px;background:#ffdf3e;font-size:13px;font-weight:600;white-space:nowrap;letter-spacing:-.18px;color:#29250c;flex-shrink:0}.sp-panel [role=status]{margin:0;padding:0 12px;min-height:0;max-width:410px;color:#525252;font-size:13px;line-height:1.45;white-space:nowrap}.sp-panel .sp-actions{display:flex;align-items:center;gap:7px}.sp-panel .sp-action,.sp-panel .sp-icon{border:0;border-radius:9px;background:var(--sp-surface);color:#525252;font-size:12px;height:36px;padding:0 11px;white-space:nowrap}.sp-panel .sp-icon{display:grid;place-items:center;width:34px;padding:0;color:#6b6b73}.sp-panel .sp-action:hover,.sp-panel .sp-icon:hover{background:var(--sp-hover)}.sp-panel .sp-action:active,.sp-panel .sp-icon:active{transform:scale(.97)}.sp-panel #review{background:var(--sp-surface)}.sp-panel #original,.sp-panel #retry,.sp-panel #undo,.sp-panel #review,.sp-panel .sp-paste-hint{display:none}.sp-panel[data-state=ready] #review,.sp-panel[data-state=uncertain] #review{display:block}.sp-panel[data-state=uncertain] #original,.sp-panel[data-state=error] #original,.sp-panel[data-state=error] #retry,.sp-panel[data-state=pasted] #undo{display:block}.sp-panel[data-state=ready] .sp-paste-hint{display:block;margin:0 4px;color:#6b6b73}.sp-panel .sp-paste-hint kbd{font-size:11px;padding:3px 6px}.sp-panel .sp-detail{display:none;border-top:1px solid var(--sp-border);padding:6px 10px 0;max-width:100%}.sp-panel[data-expanded=true] .sp-detail{display:block;animation:sp-in .18s ease-out}.sp-panel #preview{padding:0 0 9px;display:grid;grid-template-columns:1fr 1.5fr;gap:8px;max-width:700px}.sp-panel #preview:empty{display:none}.sp-panel .sp-choice{margin:0;min-width:0;padding:10px 12px}.sp-panel .sp-choice output{font-size:12px;max-height:180px}.sp-panel details{border-top:1px solid var(--sp-border);padding:10px 2px}.sp-panel[data-state=preparing] .sp-brand-chip{background:linear-gradient(100deg,#ffdf3e 20%,#fff0a3 50%,#ffdf3e 80%);background-size:200% 100%;animation:sp-shimmer 1.6s ease-in-out infinite}.sp-panel[data-state=pasted] .sp-brand-chip{background:#ffdf3e}.sp-panel[data-state=error] [role=status]{color:#525252}.sp-panel[data-state=captured] .sp-icon,.sp-panel[data-state=preparing] .sp-icon{background:var(--sp-surface)}.sp-settings .sp-preview-wrap .sp-panel{width:100%}.sp-settings .sp-preview-wrap .sp-bar{flex-wrap:wrap}.sp-settings .sp-preview-wrap [role=status]{padding:5px 3px;white-space:normal}.sp-settings .sp-preview-wrap .sp-panel #preview{grid-template-columns:1fr}.sp-settings .sp-preview-wrap .sp-actions{flex-wrap:wrap}.sp-settings .sp-preview-wrap .sp-paste-hint{display:none}
 @keyframes sp-shimmer{from{background-position:150% 0}to{background-position:-50% 0}}@media(max-width:720px){.sp-bar{flex-wrap:wrap;max-width:calc(100vw - 32px)}.sp-panel [role=status]{white-space:normal;flex:1;min-width:160px;padding:0 5px}.sp-panel .sp-actions{margin-left:auto}.sp-panel #preview{grid-template-columns:1fr}.sp-panel .sp-detail{max-width:calc(100vw - 32px)}}
 `;

 css+=`
 .sp-panel{--resize-dur:250ms;--resize-ease:cubic-bezier(0.22,1,0.36,1);--acc-expand:250ms;--acc-collapse:250ms;--acc-chevron:250ms;--acc-ease:cubic-bezier(0.22,1,0.36,1);--press-duration:160ms;--press-ease:cubic-bezier(0.23,1,0.32,1);animation:none;box-sizing:border-box}
 .t-resize {
  transition:
    width  var(--resize-dur) var(--resize-ease),
    height var(--resize-dur) var(--resize-ease);
  will-change: width, height;
 }
 .t-acc-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--acc-collapse) var(--acc-ease);
 }
 .t-acc[data-open="true"] .t-acc-panel {
  grid-template-rows: 1fr;
  transition: grid-template-rows var(--acc-expand) var(--acc-ease);
 }
 .t-acc-panel-inner {
  overflow: hidden;
  opacity: 0;
  filter: blur(2px);
  transition:
    opacity var(--acc-collapse) var(--acc-ease),
    filter var(--acc-collapse) var(--acc-ease);
 }
 .t-acc[data-open="true"] .t-acc-panel-inner {
  opacity: 1;
  filter: blur(0);
  transition:
    opacity var(--acc-expand) var(--acc-ease),
    filter var(--acc-expand) var(--acc-ease);
 }
 .t-acc-chevron {
  display: inline-flex;
  transform: scaleY(1);
  transform-origin: center;
  transition: transform var(--acc-chevron) var(--acc-ease);
 }
 .t-acc-chevron path { vector-effect: non-scaling-stroke; }
 .t-acc[data-open="true"] .t-acc-chevron { transform: scaleY(-1); }
 .sp-panel .sp-detail,.sp-panel[data-expanded=true] .sp-detail{display:grid;border:0;padding:0;animation:none}
 .sp-panel .sp-detail{width:0;min-width:0}.sp-panel[data-expanded=true] .sp-detail{width:100%}
 .sp-detail-content{padding:6px 10px 0;border-top:1px solid var(--sp-border)}
 .sp-panel .t-acc-panel-inner{min-height:0}
 .sp-instant,.sp-instant .t-acc-panel,.sp-instant .t-acc-panel-inner,.sp-instant .t-acc-chevron{transition:none!important}
 .sp-panel #review{align-items:center;gap:6px}
 .sp-panel[data-state=ready] #review,.sp-panel[data-state=uncertain] #review{display:flex}
 .sp-panel .sp-action,.sp-panel .sp-icon{transition:transform var(--press-duration) var(--press-ease),background-color 150ms ease;color:#525252}
 .sp-panel button:disabled{cursor:default;opacity:.5}
 .sp-panel button:disabled:active{transform:none}
 .sp-panel[data-state=preparing] .sp-brand-chip{background:#ffdf3e;animation:none}
 .sp-panel[data-state=preparing] .sp-brand-chip>span{animation:sp-breathe 1.6s linear infinite}
 @keyframes sp-breathe{0%,100%{opacity:1}50%{opacity:.4}}
 @media(hover:none){.sp-panel .sp-action:hover,.sp-panel .sp-icon:hover{background:var(--sp-surface)}.sp-panel #review:hover{background:var(--sp-surface)}}
 @media (prefers-reduced-motion: reduce) {
  .t-resize { transition: none !important; }
  .t-acc-panel, .t-acc-panel-inner, .t-acc-chevron { transition: none !important; }
  .sp-panel .sp-action,.sp-panel .sp-icon{transition:background-color 150ms ease!important}
  .sp-panel .sp-action:active,.sp-panel .sp-icon:active{transform:none}
  .sp-panel .t-acc-panel-inner{filter:none}
 }
 `;

 css+=`
 .sp-panel [hidden],.sp-panel #review,.sp-panel #original{display:none!important}
 .sp-panel .sp-bar{flex-wrap:nowrap;max-width:100%;gap:6px;padding:8px;min-height:54px;height:54px;max-height:62px}
 .sp-panel .sp-brand-chip{width:38px;height:38px;padding:0;justify-content:center}
 .sp-panel .sp-brand-chip{overflow:hidden}.sp-panel .sp-brand-chip img{display:block;width:32px;height:32px;object-fit:contain;border-radius:0}
 .sp-panel [role=status]{flex:0 1 auto;min-width:0;max-width:340px;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .sp-panel .sp-actions{flex:0 0 auto;margin-left:0;gap:6px}
 .sp-panel .sp-paste-hint kbd{border:0;box-shadow:none;background:none;padding:0;font-size:12px;white-space:nowrap}
 .sp-panel[data-state=preparing] .sp-brand-chip img{animation:sp-breathe 1.6s linear infinite}
 .sp-panel[data-state=preparing] .sp-actions,.sp-panel[data-state=uncertain] .sp-actions{display:none}
 .sp-settings .sp-preview-wrap .sp-bar{flex-wrap:nowrap}
 .sp-settings .sp-preview-wrap [role=status]{white-space:nowrap;min-width:0;padding:0 8px}
 .sp-settings .sp-preview-wrap .sp-actions{flex-wrap:nowrap}
 @media(max-width:480px){.sp-panel .sp-bar{padding:7px;gap:4px}.sp-panel [role=status]{padding:0 5px;font-size:12px}.sp-panel .sp-actions{gap:4px}}
 `;
 let iconURL=globalThis.chrome?.runtime?.getURL?.('assets/copy.svg')||'assets/copy.svg';
 const setIconURL=url=>{iconURL=url;};
 // Compact pill surface and circular icon controls.
 css+=`.sp-panel{border-color:transparent;border-radius:999px;box-shadow:0 1px 2px #0000001a,0 0 0 1px #0000000f}.sp-panel .sp-icon,.sp-panel[data-state=captured] .sp-icon{width:34px;height:34px;border-radius:50%;background:transparent}.sp-panel .sp-icon:hover{background:var(--sp-hover)}.sp-panel .sp-brand-chip,.sp-panel[data-state=preparing] .sp-brand-chip,.sp-panel[data-state=pasted] .sp-brand-chip{background:transparent}.sp-settings h1{margin-bottom:32px}.sp-settings .sp-steps{margin-top:0}.sp-settings aside{padding-top:0}@media(prefers-reduced-motion:reduce){.sp-settings .sp-switch:before{transition:none}}`;

 // Transit typography, control sizing, and shadow tokens.
 css+=`
 .sp-panel,.sp-settings{--ink:#242529;--muted:#6b6b73;--line:var(--sp-hover);--sp-ghost-shadow:0 1px 2px #0000001a,0 0 0 1px #0000000f;font-family:'Smart Paste Inter',Inter,sans-serif;font-size:13px;font-weight:500;line-height:18px;letter-spacing:-.08px;-webkit-font-smoothing:antialiased}
 .sp-panel{border:0}
 .sp-panel .sp-bar{height:42px;min-height:42px;max-height:42px;padding:4px 6px;gap:4px}
 .sp-panel .sp-brand-chip{width:34px;height:34px}
 .sp-panel [role=status]{font-size:13px;font-weight:500;line-height:18px;letter-spacing:-.08px;color:#525252}
 .sp-panel .sp-action,.sp-settings button{height:34px;border:0;border-radius:999px;padding:0 12px;background:#fff;color:#525252;box-shadow:var(--sp-ghost-shadow);font-size:13px;font-weight:500;line-height:18px;letter-spacing:-.08px;transition:transform 150ms ease,background-color 150ms ease,color 150ms ease}
 .sp-panel .sp-action:hover,.sp-settings button:hover{background:var(--sp-hover)}
 .sp-panel .sp-icon{box-shadow:none;color:#6b6b73;transition:transform 150ms ease,color 150ms ease,background-color 150ms ease}
 .sp-panel .sp-icon:hover{color:#525252}
 .sp-panel button:active,.sp-settings button:active{transform:scale(.97)}
 .sp-panel .sp-paste-hint kbd,.sp-settings kbd{font-family:inherit}
 .sp-settings h1{font-size:16px;font-weight:500;line-height:20px;letter-spacing:-.08px;color:#242529}
 .sp-settings h2{font-size:14px;font-weight:500;line-height:20px;letter-spacing:-.08px;color:#242529}
 .sp-settings .sp-label-row,.sp-settings .sp-toggle-row label,.sp-settings .sp-shortcut,.sp-settings .sp-help,.sp-settings .sp-toggle-row p,.sp-settings .sp-steps li,.sp-settings #status{font-size:13px;line-height:18px;font-weight:500;color:#525252}
 .sp-settings .sp-help,.sp-settings .sp-toggle-row p{color:#6b6b73}
 .sp-settings .sp-badge{font-size:12px;line-height:18px}
 .sp-settings .sp-key input{height:42px;padding-right:76px;font-size:13px}
 .sp-settings .sp-key button{top:5px;right:5px;height:32px;padding:0 12px;font-size:13px;color:#525252;background:#fff}
 .sp-settings .sp-shortcut button{font-size:13px;color:#525252;background:#fff}
 .sp-settings .sp-save{height:34px;padding:0 16px;border:0;border-radius:999px;background:#27272a;color:#fff;box-shadow:inset 0 .75px 0 #ffffff33,0 1px 2px #00000066,0 0 0 1px #18181b;font-size:13px}
 .sp-settings .sp-save:hover{background:#3f3f46}
 @media(prefers-reduced-motion:reduce){.sp-panel button,.sp-settings button,.sp-settings .sp-switch:before{transition:none!important}.sp-panel button:active,.sp-settings button:active{transform:none}}
 `;
 let fontURL=globalThis.chrome?.runtime?.getURL?.('assets/inter-var.woff2')||'assets/inter-var.woff2';
 const setFontURL=url=>{fontURL=url;};
 function ensureFont(doc){if(doc.querySelector('style[data-smart-paste-font]'))return;const style=doc.createElement('style');style.dataset.smartPasteFont='';style.textContent=`@font-face{font-family:'Smart Paste Inter';src:url("${fontURL}") format('woff2');font-style:normal;font-weight:100 900;font-display:swap}`;(doc.head||doc.documentElement).append(style);}
 const toolbarHTML=`<section class="sp-panel t-resize t-acc" aria-label="Smart Paste" tabindex="-1" data-state="captured" data-expanded="false" data-open="false"><div class="sp-bar"><b class="sp-brand-chip" aria-label="Smart Paste"><img data-copy-icon alt="" width="24" height="24"></b><p role="status" aria-live="polite" aria-atomic="true">Focus a text field.</p><div class="sp-actions"><span class="sp-paste-hint"><kbd>⌘V</kbd></span><button class="sp-action" id="review" hidden aria-expanded="false" aria-controls="paste-preview">Review<span class="t-acc-chevron"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><button class="sp-action" id="original" hidden>Paste original</button><button class="sp-action" id="retry">Try again</button><button class="sp-action" id="undo">Undo</button><button class="sp-icon" id="settings" title="Settings" aria-label="Settings">${icon('settings')}</button><button class="sp-icon" id="close" title="Close toolbar" aria-label="Close toolbar">${icon('close')}</button></div></div><div id="paste-preview" class="sp-detail t-acc-panel" inert><div class="t-acc-panel-inner"><div class="sp-detail-content"><div id="preview"></div><details><summary>Captured clipboard</summary><pre></pre></details></div></div></div></section>`;

 css+=`.sp-panel{--resize-dur:180ms}.sp-panel[data-state=preparing] .sp-brand-chip img{animation:none}.sp-panel .sp-bar{max-width:calc(100vw - 32px)}`;
 // Two-layer shimmer ported from /imgn; the base remains readable throughout.
 css+=`
 .sp-panel .sp-bar{position:relative}
 .sp-panel [role=status]{position:relative;--shimmer-dur:2000ms;--shimmer-base:#6e6e6e;--shimmer-highlight:#ededed;--shimmer-band:400%}
 .sp-panel[data-state=preparing] [role=status]{color:var(--shimmer-base)}
 .sp-panel[data-state=preparing] [role=status]:before{content:attr(data-text) / '';position:absolute;inset:0;padding:inherit;pointer-events:none;white-space:inherit;overflow:hidden;text-overflow:ellipsis;background-image:linear-gradient(90deg,transparent 0%,transparent 40%,var(--shimmer-highlight) 50%,transparent 60%,transparent 100%);background-size:var(--shimmer-band) 100%;background-repeat:no-repeat;background-clip:text;-webkit-background-clip:text;color:transparent;-webkit-text-fill-color:transparent;animation:sp-imgn-shimmer var(--shimmer-dur) linear infinite}
 @keyframes sp-imgn-shimmer{0%{background-position:100% 0}100%{background-position:0% 0}}
 .sp-panel .sp-exit-layer{position:absolute;pointer-events:none;user-select:none}
 @media(prefers-reduced-motion:reduce),(forced-colors:active){.sp-panel[data-state=preparing] [role=status]:before{display:none;animation:none}}
 `;
 const contentAnimations=new WeakMap();
 // Snapshot only visible content. State and actions update synchronously; ghosts are inert.
 function captureExit(panel){
  const previous=contentAnimations.get(panel);
  contentAnimations.delete(panel);
  if(reduced(panel)||!panel.animate){previous?.forEach(cleanup=>cleanup());return [];}
  const bar=panel.querySelector('.sp-bar'),origin=bar.getBoundingClientRect();
  const ghosts=[panel.querySelector('[role=status]'),panel.querySelector('.sp-actions')].flatMap(el=>{
   const box=el.getBoundingClientRect();if(!box.width||!box.height)return [];
   const clone=el.cloneNode(true);
   const originals=[el,...el.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
   copies.forEach((copy,i)=>{const style=panel.ownerDocument.defaultView.getComputedStyle(originals[i]);for(const property of style)copy.style.setProperty(property,style.getPropertyValue(property));copy.style.animation='none';copy.style.transition='none';});
   clone.removeAttribute('role');clone.removeAttribute('aria-live');clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
   clone.setAttribute('aria-hidden','true');clone.inert=true;clone.classList.add('sp-exit-layer');
   clone.style.cssText+=`;position:absolute;left:${box.left-origin.left}px;top:${box.top-origin.top}px;width:${box.width}px;height:${box.height}px;margin:0;display:${panel.ownerDocument.defaultView.getComputedStyle(el).display};pointer-events:none;`;
   return [clone];
  });
  previous?.forEach(cleanup=>cleanup());
  return ghosts;
 }
 function revealContent(panel,ghosts=[]){
  if(reduced(panel)||!panel.animate)return;
  const cleanups=[];contentAnimations.set(panel,cleanups);
  const run=(el,frames,options,remove=false)=>{const animation=el.animate(frames,options);const cleanup=()=>{animation.cancel();if(remove)el.remove();};cleanups.push(cleanup);animation.onfinish=cleanup;};
  const ease='linear';
  for(const ghost of ghosts){panel.querySelector('.sp-bar').append(ghost);run(ghost,[{opacity:Number(ghost.style.opacity)||0},{opacity:0}],{duration:180,easing:ease},true);}
  for(const el of [panel.querySelector('[role=status]'),panel.querySelector('.sp-actions')]){
   run(el,[{opacity:0},{opacity:1}],{duration:180,fill:'backwards',easing:ease});
  }
 }
 // Annotation feedback: compact controls with balanced 9px outer insets.
 css+=`
 .sp-panel .sp-bar{padding:9px;gap:4px}
 .sp-panel .sp-brand-chip{width:24px;height:24px}
 .sp-panel .sp-brand-chip img{width:20px;height:20px}
 .sp-panel .sp-actions{gap:0}
 .sp-panel .sp-action,.sp-panel .sp-icon,.sp-panel[data-state=captured] .sp-icon{height:24px;min-height:24px}
 .sp-panel .sp-icon,.sp-panel[data-state=captured] .sp-icon{width:24px}
 .sp-panel .sp-action{padding:0 9px;font-size:12px}
 .sp-panel[data-state=ready] .sp-paste-hint{display:flex;align-items:center;justify-content:center;height:24px;padding:0 7px;margin:0;border-radius:999px;background:var(--sp-surface);color:#6b6b73}
 .sp-panel .sp-paste-hint kbd{font-size:12px;line-height:16px}
 .sp-settings .sp-key button,.sp-settings .sp-key button:hover{background:transparent;box-shadow:none}
 .sp-settings .sp-shortcut kbd{display:inline-flex;align-items:center;justify-content:center;height:24px;padding:0 7px;border:0;box-shadow:none;border-radius:999px;background:var(--sp-surface)}
 `;
 css+=`
 .sp-panel:focus-visible{outline:2px solid #007aff;outline-offset:3px}
 .sp-panel button:focus-visible{outline-offset:-2px}
 .sp-panel button,.sp-settings button,.sp-settings input{touch-action:manipulation}
 .sp-settings .sp-key input{border-color:#85858c}
 .sp-settings .sp-key input::placeholder{color:#6b6b73;opacity:1}
 .sp-settings .sp-key input[aria-invalid=true]{border-color:#b42318}
 .sp-settings #key-error{color:#b42318}
 .sp-settings .sp-switch{border-color:#767680}
 .sp-settings .sp-switch:after{content:'';position:absolute;inset:-4px}
 .sp-settings .sp-badge,.sp-settings .sp-steps span{color:#6b6b73}
 .sp-settings button:disabled{opacity:.65;cursor:wait}
 @media(forced-colors:active){.sp-panel,.sp-settings button,.sp-panel button,.sp-paste-hint{border:1px solid ButtonText}.sp-switch:checked{background:Highlight}.sp-switch:before{background:ButtonText}}
 `;
 const resizeTimers=new WeakMap();
 function reduced(panel){return panel.ownerDocument.defaultView.matchMedia?.('(prefers-reduced-motion: reduce)').matches;}
 // A single measured surface resize; content itself is never scaled.
 // Read the current rendered width first so repeated state changes retarget mid-flight.
 function resizeAround(panel,change){
  clearTimeout(resizeTimers.get(panel));
  const before=panel.getBoundingClientRect().width;
  const bar=panel.querySelector('.sp-bar');
  panel.style.transition='none';panel.style.width='max-content';bar.style.width='';change();
  const after=panel.getBoundingClientRect().width;
  if(!before||!after||reduced(panel)||Math.abs(before-after)<.5){panel.style.width='';panel.style.transition='';return;}
  // Keep text and controls at their destination layout while the surface resizes.
  // This avoids changing ellipsis and flex positions on every animation frame.
  bar.style.width=after+'px';
  panel.style.width=before+'px';void panel.offsetWidth;panel.style.transition='';panel.style.width=after+'px';
  const duration=parseFloat(panel.ownerDocument.defaultView.getComputedStyle(panel).getPropertyValue('--resize-dur'))||250;
  resizeTimers.set(panel,setTimeout(()=>{panel.style.width='';bar.style.width='';resizeTimers.delete(panel);},duration+40));
 }
 function expand(target,open,keyboard=false){const panel=target.querySelector('.sp-panel'),detail=target.querySelector('#paste-preview');
  if(!open&&detail.contains(target.activeElement||panel.ownerDocument.activeElement))target.querySelector('#review').focus();
  const change=()=>{panel.dataset.expanded=String(open);panel.dataset.open=String(open);detail.inert=!open;target.querySelector('#review').setAttribute('aria-expanded',String(open));};
  if(keyboard){panel.classList.add('sp-instant');change();}else{panel.classList.remove('sp-instant');resizeAround(panel,change);}
 }
 function mountToolbar(container,{shadow=false}={}){ensureFont(container.ownerDocument);const target=shadow?container.attachShadow({mode:'open'}):container;target.innerHTML='<style>'+css+'</style>'+toolbarHTML;target.querySelector('[data-copy-icon]').src=iconURL;
  target.querySelector('#review').onclick=e=>!e.currentTarget.hidden&&expand(target,target.querySelector('.sp-panel').dataset.expanded!=='true',e.detail===0);
  target.querySelector('.sp-panel').addEventListener('keydown',e=>{if(e.key==='Escape'&&target.querySelector('.sp-panel').dataset.expanded==='true'){e.preventDefault();e.stopPropagation();expand(target,false,true);}});
  return target;
 }
 function setToolbarState(target,state,text){const panel=target.querySelector('.sp-panel');
  if(panel.dataset.state===state&&(text===undefined||target.querySelector('[role=status]').textContent===text))return;
  const change=()=>{if(panel.dataset.state!==state){panel.dataset.expanded='false';panel.dataset.open='false';target.querySelector('#paste-preview').inert=true;target.querySelector('#review').setAttribute('aria-expanded','false');}panel.dataset.state=state;for(const id of ['settings','close'])target.querySelector('#'+id).hidden=state!=='captured';if(text!==undefined){const status=target.querySelector('[role=status]');status.textContent=text;status.title=text;status.dataset.text=text;}};
  const active=target.activeElement||panel.ownerDocument.activeElement;
  const ghosts=captureExit(panel);panel.classList.remove('sp-instant');resizeAround(panel,change);revealContent(panel,ghosts);
  if(active?.tagName==='BUTTON'&&panel.contains(active)&&(active.hidden||panel.ownerDocument.defaultView.getComputedStyle(active).display==='none'))panel.focus({preventScroll:true});
 }
 function renderChoice(container,row,onChoose){const d=container.ownerDocument,label=d.createElement('label');label.className='sp-choice';const head=d.createElement('span');head.className='sp-choice-head';const title=d.createElement('span');title.textContent=row.label||(row.kind==='title'?'Title':row.kind==='description'?'Description':'Text field');const select=d.createElement('select');select.setAttribute('aria-label',title.textContent+' passage');const none=d.createElement('option');none.value='';none.textContent='Leave unchanged';select.append(none);row.options.forEach((o,i)=>{const option=d.createElement('option');option.value=o.id;option.textContent=(i===0?'Suggested':'Alternative '+i)+' · '+o.text;select.append(option);});const output=d.createElement('output');const choose=id=>{const option=row.options.find(o=>o.id===id);output.textContent=option?.text||'Choose a passage';onChoose?.(option?.text,id);};select.value=row.confident?row.selected:'';select.onchange=()=>choose(select.value);head.append(title,select);label.append(head,output);container.append(label);choose(select.value);return label;}
 const sample='Can we file “Keep draft text when switching workspaces”? Switching workspaces clears the issue draft. Preserve the title and description until the issue is created or discarded. Also, the address is Ferry Building, San Francisco. Our demo is on September 24 at 2 pm.';
 const demoRows=[{id:'f0',kind:'title',selected:'s0',confident:true,options:[{id:'s0',text:'Keep draft text when switching workspaces'}]},{id:'f1',kind:'description',selected:'s1',confident:true,options:[{id:'s1',text:'Switching workspaces clears the issue draft. Preserve the title and description until the issue is created or discarded.'}]}];
 function setDemoState(target,state){const panel=target.querySelector('.sp-panel'),preview=target.querySelector('#preview');preview.replaceChildren();const messages={captured:'Focus a text field.',preparing:'Finding a match…',ready:'2 fields ready.',uncertain:'No confident match.',pasted:'Pasted into 2 fields.',error:'Couldn’t find a match.'};setToolbarState(target,state,messages[state]||messages.captured);target.querySelector('pre').textContent=sample;if(state==='ready'||state==='uncertain')for(const row of demoRows)renderChoice(preview,{...row,confident:state==='ready'});target.querySelector('#undo').disabled=state!=='pasted';target.querySelector('#retry').disabled=state==='preparing';}
 function mountSettings(container){ensureFont(container.ownerDocument);container.innerHTML='<style>'+css+'</style>'+`<div class="sp-settings tr-controls"><h1>A little less copy-paste.</h1><div class="sp-layout"><form id="settings"><section class="sp-block"><h2>Connection</h2><div class="sp-label-row"><label for="key">TypeSafe API key</label><span class="sp-badge" id="connection">Not configured</span></div><div class="sp-key"><input class="tr-input" id="key" name="apiKey" type="password" autocomplete="off" spellcheck="false" autocapitalize="none" placeholder="Paste your API key" aria-describedby="key-help key-error"><button type="button" id="reveal" aria-label="Show API key" aria-pressed="false">Show</button></div><p class="sp-help" id="key-help">Stored on this device. Sent only to TypeSafe for requests.</p><p id="key-error" class="sp-help" hidden></p></section><section class="sp-block"><h2>Smart matching</h2><div class="sp-toggle-row"><div><label for="consent">Find a match when I paste</label><p id="consent-help">Sends pasted text, field labels, and form heading to TypeSafe. Inserts confident matches when ready.</p></div><input id="consent" name="matching" aria-describedby="consent-help" class="sp-switch" type="checkbox" role="switch"></div></section><section class="sp-block"><h2>Shortcut</h2><div class="sp-shortcut"><span>Show toolbar</span><div><kbd>⌘ J</kbd><button type="button" id="shortcut" class="tr-button">Change</button></div></div><p class="sp-help">Or click Smart Paste in your browser toolbar.</p></section><div class="sp-save-row"><button class="sp-save tr-button tr-primary" type="submit">Save changes</button><span id="status" role="status" aria-live="polite"></span></div></form><aside><ol class="sp-steps"><li><span>1</span>Copy text from anywhere.</li><li><span>2</span>Focus a field in a form.</li><li><span>3</span>Press ⌘V once. Undo after pasting.</li></ol></aside></div></div>`;const q=s=>container.querySelector(s);q('#reveal').onclick=()=>{const show=q('#key').type==='password';q('#key').type=show?'text':'password';q('#reveal').textContent=show?'Hide':'Show';q('#reveal').setAttribute('aria-pressed',String(show));q('#reveal').setAttribute('aria-label',show?'Hide API key':'Show API key');};return container;}
 css+=`
 .sp-settings.sp-capture{box-sizing:border-box;width:360px;max-width:100%;padding:16px;margin:0}
 .sp-capture header{display:flex;align-items:center;gap:8px;margin-bottom:14px}
 .sp-capture header img{width:24px;height:24px}
 .sp-capture h1{font-size:14px;margin:0;flex:1}
 .sp-capture header button{flex:0 0 24px;height:24px;width:24px;padding:0;background:none;box-shadow:none}
 .sp-capture #capture-status{min-height:36px;margin:0 0 12px;color:#525252;overflow-wrap:anywhere}
 .sp-capture .capture-actions{display:flex;gap:8px}
 .sp-capture .capture-actions button{flex:0 0 auto;white-space:nowrap;height:24px;padding:0 10px;font-size:12px}
 .sp-capture details{margin-top:14px;color:#6b6b73;font-size:12px}
 .sp-capture summary{cursor:pointer}
 .sp-capture pre{max-height:150px;overflow:auto;overflow-wrap:anywhere;white-space:pre-wrap;font:500 12px/18px 'Smart Paste Inter',sans-serif;background:var(--sp-surface);border-radius:8px;padding:10px}
 .sp-capture summary:focus-visible{outline:2px solid #007aff;outline-offset:3px}
 `;
 function mountCapture(container){ensureFont(container.ownerDocument);container.innerHTML='<style>'+css+'</style>'+`<section class="sp-settings sp-capture" aria-label="Clipboard capture"><header><img src="${iconURL}" alt="" width="24" height="24"><h1>Smart Paste</h1><button type="button" id="capture-settings" aria-label="Settings" title="Settings">${icon('settings')}</button></header><p id="capture-status" role="status" aria-live="polite" aria-atomic="true">Reading clipboard…</p><div class="capture-actions"><button type="button" id="read" class="sp-save">Capture clipboard</button><button type="button" id="clear">Clear</button></div><details id="capture-details" hidden><summary>Captured text</summary><pre id="capture" tabindex="0" aria-label="Captured clipboard"></pre></details></section>`;return container;}

 /* Shared input, button, and segmented-control primitives. */
 const controlsCSS=`
 .tr-controls{--tr-surface:#fafafa;--tr-track:#f7f7f7;--tr-hover:#f0f0f0;--tr-text:#242529;--tr-secondary:#525252;--tr-shadow:0 1px 2px #0000001a,0 0 0 1px #0000000f;--tr-inset:inset 0 0 0 .5px #0000000a;font-size:13px;font-weight:500;line-height:18px;letter-spacing:-.08px}
 .tr-controls .tr-input,.tr-controls .tr-textarea{box-sizing:border-box;width:100%;min-width:0;border:0;outline:none;background:var(--tr-surface);color:var(--tr-text);box-shadow:var(--tr-inset);font:inherit;letter-spacing:inherit}
 .tr-controls .tr-input{height:30px;min-height:30px;border-radius:999px;padding:0 12px}
 .tr-controls .tr-textarea{border-radius:12px;padding:10px 12px;line-height:20px;resize:vertical}
 .tr-controls .tr-input:focus,.tr-controls .tr-textarea:focus{outline:2px solid #007aff;outline-offset:2px}
 .tr-controls .tr-input[aria-invalid=true]{outline:2px solid #b42318;outline-offset:2px}
 .tr-controls .tr-button{height:30px;padding:0 12px;border:0;border-radius:999px;background:#fff;color:var(--tr-secondary);box-shadow:var(--tr-shadow);font:inherit;white-space:nowrap}
 .tr-controls .tr-primary{background:#27272a;color:white;box-shadow:inset 0 .75px 0 #ffffff33,0 1px 2px #00000066,0 0 0 1px #18181b}
 .tr-controls .tr-button:hover{background:var(--tr-hover)}.tr-controls .tr-primary:hover{background:#3f3f46}
 .tr-controls .tr-button:focus-visible,.tr-controls .tr-tab:focus-visible{outline:2px solid #007aff;outline-offset:3px}
 .tr-select{position:relative}.tr-select .tr-button{display:flex;align-items:center;gap:8px}.tr-select svg{flex:none}
 .tr-menu{position:absolute;top:calc(100% + 8px);right:0;width:max-content;min-width:172px;max-width:calc(100vw - 48px);padding:4px;border-radius:12px;background:#fff;box-shadow:0 8px 24px #00000012,var(--tr-shadow);z-index:10;outline:none}
 .tr-option{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:8px 10px;border-radius:8px;cursor:pointer;color:var(--tr-secondary)}
 .tr-option[data-active=true]{background:var(--tr-hover);color:var(--tr-text)}.tr-option[aria-selected=true]{color:var(--tr-text)}
 .tr-tabs{height:30px;padding:2px;display:inline-grid;grid-template-columns:repeat(var(--tr-count,2),1fr);gap:2px;position:relative;border-radius:999px;background:var(--tr-track)}
 .tr-indicator{position:absolute;top:2px;bottom:2px;left:2px;width:calc((100% - 4px - (var(--tr-count,2) - 1)*2px)/var(--tr-count,2));background:#fff;border-radius:999px;box-shadow:var(--tr-shadow);transform:translateX(calc(var(--tr-index,0) * (100% + 2px)));transition:transform 350ms cubic-bezier(.25,.46,.45,.94);pointer-events:none}
 .tr-controls .tr-tab{position:relative;z-index:1;height:26px;border:0;border-radius:999px;background:transparent;box-shadow:none;padding:0 12px;color:var(--tr-secondary);font:inherit;white-space:nowrap}
 .tr-controls .tr-tab[aria-selected=true]{color:var(--tr-text)}.tr-controls .tr-tab:active{transform:none}
 @media(prefers-reduced-motion:reduce){.tr-indicator{transition:none}}
 @media(forced-colors:active){.tr-controls .tr-input,.tr-controls .tr-textarea,.tr-controls .tr-button,.tr-menu{border:1px solid ButtonText}.tr-tab[aria-selected=true]{outline:1px solid Highlight}}
 `;
 css+=controlsCSS;
 css+=`
 .sp-settings .sp-key .tr-input{height:30px;padding:0 64px 0 12px;border:0;border-radius:999px;background:var(--tr-surface);box-shadow:var(--tr-inset);color:var(--tr-text)}
 .sp-settings .sp-key .tr-input:focus{outline:2px solid #007aff;outline-offset:2px}
 .sp-settings .sp-key .tr-input[aria-invalid=true]{outline:2px solid #b42318;outline-offset:2px}
 /* Transit PeakHoursOverlay.MiniToggle, retaining native checkbox semantics. */
 .sp-settings .sp-switch{width:32px;height:18px;border:0;background:#f0f0f0}
 .sp-settings .sp-switch:before{width:14px;height:14px;top:2px;left:2px;box-shadow:var(--tr-shadow)}
 .sp-settings .sp-switch:checked{background:#27272a}
 .sp-settings .sp-switch:checked:before{transform:translateX(14px)}
 .sp-settings .sp-key button{height:26px;top:2px;right:4px;padding:0 10px}
 .sp-settings .sp-save.tr-primary{height:30px;padding:0 12px}
 .sp-settings .sp-badge{border:0;background:var(--tr-track);border-radius:999px;padding:3px 8px}
 `;
 root.SmartPasteUI={controlsCSS,mountCapture,setFontURL,setIconURL,css,toolbarHTML,mountToolbar,renderChoice,mountSettings,setDemoState,setToolbarState,sample,demoRows};
})(globalThis);
