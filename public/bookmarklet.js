javascript:(async()=>{if(window.__brainrotLibrary){alert("Already open!");return}window.__brainrotLibrary=true;const API="https://brainrots-game-library.onrender.com";let token=localStorage.getItem("token"),me=null;

async function req(path,opt={}){const r=await fetch(API+path,opt);let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||("HTTP "+r.status));return d}

async function login(){try{if(token){try{let x=await req("/api/me",{headers:{Authorization:"Bearer "+token}});if(x.user){me=x.user;return}}catch{}}
let x=await req("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:"koolio",password:"Kruzzer67*"})});if(x.token){token=x.token;localStorage.setItem("token",token);me=x.user}}
catch(e){console.error("[Brainrots] Login failed:",e)}}

await login();if(!token){alert("Unable to connect to the Brainrots server.");window.__brainrotLibrary=false;return}

const style=document.createElement("style");style.textContent=`
#br-lib{position:fixed;top:55px;right:20px;width:390px;background:#17202b;border:3px solid #050505;border-radius:9px;box-shadow:0 10px 35px #000;color:#fff;font-family:Arial,sans-serif;z-index:2147483647;overflow:hidden}
#br-head{height:44px;background:#273747;display:flex;align-items:center;justify-content:space-between;padding:0 10px;box-sizing:border-box;border-bottom:2px solid #000;cursor:move}
#br-title{font-size:16px;font-weight:bold;text-shadow:1px 1px #000}
#br-x{background:#c62828;border:1px solid #000;color:#fff;font-weight:bold;border-radius:3px;width:24px;height:24px;cursor:pointer}
#br-tabs{display:flex;background:#0c1219;border-bottom:2px solid #000}
.br-tab{flex:1;border:0;border-right:2px solid #000;padding:10px 5px;color:#fff;font-weight:bold;font-size:13px;cursor:pointer;text-shadow:1px 1px #000}
.br-tab:last-child{border-right:0}
.br-tab.active{outline:2px solid #fff;outline-offset:-3px}
#br-trade-tab{background:#3f9b52}
#br-admin-tab{background:#7b2cbf}
#br-content{padding:12px}
.br-page{display:none}
.br-page.active{display:block}
.br-search{width:100%;box-sizing:border-box;padding:10px;background:#0b1117;color:#fff;border:1px solid #46576a;border-radius:5px;font-size:13px;margin-bottom:10px;outline:none}
.br-list{max-height:315px;overflow-y:auto;display:flex;flex-direction:column;gap:7px}
.br-player{display:flex;align-items:center;justify-content:space-between;background:#202b38;border:1px solid #394b5d;border-radius:6px;padding:8px}
.br-info{display:flex;align-items:center;gap:9px;min-width:0}
.br-avatar{width:38px;height:38px;border-radius:5px;background:#303b48;display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:20px;flex-shrink:0}
.br-avatar img{width:100%;height:100%;object-fit:cover}
.br-details{display:flex;flex-direction:column;min-width:0}
.br-name{font-size:13px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.br-online{font-size:10px;color:#63d471;margin-top:2px}
.br-dot{display:inline-block;width:6px;height:6px;background:#4caf50;border-radius:50%;margin-right:4px}
.br-send{background:#4caf50;border:2px solid #000;border-radius:4px;color:#fff;font-size:11px;font-weight:bold;padding:6px 10px;cursor:pointer}
.br-send.sent{background:#245a2c}
.br-section{font-size:12px;font-weight:bold;margin:0 0 6px}
.br-input,.br-select{width:100%;box-sizing:border-box;background:#111923;color:#fff;border:1px solid #46576a;border-radius:4px;padding:8px;font-size:12px;margin-bottom:5px}
.br-row{display:flex;gap:6px}
.br-row>*{flex:1}
.br-action{width:100%;padding:8px;border:1px solid #000;border-radius:4px;color:#fff;font-size:12px;font-weight:bold;cursor:pointer;margin-top:4px}
.br-green{background:#4caf50}.br-purple{background:#9c27b0}.br-red{background:#d32f2f}.br-blue{background:#3b6ea5}.br-brown{background:#a3752c}
.br-output{white-space:pre-wrap;font-size:11px;margin-top:9px;opacity:.9;min-height:14px}
.br-keybox{display:none;margin-top:8px;background:#0a1016;border-radius:5px;padding:9px;text-align:center}
.br-key{font-size:14px;font-weight:bold;color:#8fd694;word-break:break-all}
#br-notif{position:fixed;top:20px;right:20px;width:320px;background:#3b2822;border:3px solid #1a100d;border-radius:12px;padding:12px 16px;box-sizing:border-box;color:#fff;box-shadow:0 8px 16px rgba(0,0,0,.6);z-index:2147483647}
.br-ntitle{color:#c0a2f8;font-size:20px;font-weight:bold;margin-bottom:8px;text-shadow:1px 1px 2px #000}
.br-nbody{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.br-navatar{width:48px;height:48px;border-radius:8px;background:#ff3b3b;display:flex;align-items:center;justify-content:center;font-size:27px;overflow:hidden;flex-shrink:0}
.br-navatar img{width:100%;height:100%;object-fit:cover}
.br-nmsg{font-size:16px;font-weight:bold;line-height:1.2;text-shadow:1px 1px 2px #000}
.br-nbuttons{display:flex;gap:10px}
.br-nbtn{flex:1;padding:8px 0;border:2px solid #000;border-radius:6px;color:#fff;font-size:16px;font-weight:bold;cursor:pointer;text-shadow:1px 1px 2px #000}
.br-accept{background:#00c853}.br-decline{background:#ff3d00}
`;document.head.appendChild(style);

const wrap=document.createElement("div");wrap.id="br-lib";wrap.innerHTML=`
<div id="br-head"><span id="br-title">Brainrot Game Library</span><button id="br-x">✕</button></div>
<div id="br-tabs">
<button class="br-tab active" id="br-tab-trade">Trade</button>
<button class="br-tab" id="br-tab-admin" style="display:none">Admin</button>
</div>
<div id="br-content">
<div class="br-page active" id="br-page-trade">
<div class="br-section">Trade Machine</div>
<div style="font-size:10px;color:#cfd8dc;margin-bottom:8px">Search for a player or select someone online.</div>
<input id="br-search" class="br-search" placeholder="Search usernames...">
<div id="br-list" class="br-list"></div>
</div>
<div class="br-page" id="br-page-admin">
<div class="br-section">Global Announcement</div>
<input id="br-ann" class="br-input" maxlength="200" placeholder="Announcement text">
<button id="br-ann-btn" class="br-action br-green">ANNOUNCE FOR 3 SECONDS</button>

<div class="br-section" style="margin-top:14px">Give Brainrot to User</div>
<input id="br-gu" class="br-input" placeholder="Target Username">
<input id="br-gi" class="br-input" placeholder="Brainrot Name">
<button id="br-give" class="br-action br-purple">GRANT ITEM</button>

<div class="br-section" style="margin-top:14px">Manage Permanent Admins</div>
<input id="br-au" class="br-input" placeholder="Username">
<div class="br-row">
<button id="br-add" class="br-action br-green">ADD ADMIN</button>
<button id="br-rem" class="br-action br-red">REMOVE ADMIN</button>
</div>

<div class="br-section" style="margin-top:14px">RNG Luck</div>
<div class="br-row">
<input id="br-luck" type="number" min="1" value="2" class="br-input" placeholder="Multiplier">
<input id="br-seconds" type="number" min="1" value="60" class="br-input" placeholder="Seconds">
</div>
<button id="br-luck-btn" class="br-action br-green">ACTIVATE LUCK</button>

<div class="br-section" style="margin-top:14px">Generate Key</div>
<select id="br-duration" class="br-select">
<option value="hour">1 Hour</option>
<option value="day">1 Day</option>
<option value="week">7 Days</option>
<option value="month">30 Days</option>
<option value="permanent">Permanent</option>
</select>
<input id="br-custom" class="br-input" placeholder="Custom key (optional)">
<div class="br-row">
<button id="br-server-key" class="br-action br-purple">SERVER KEY</button>
<button id="br-offline-key" class="br-action br-brown">OFFLINE KEY</button>
</div>
<div id="br-keybox" class="br-keybox"><div style="font-size:10px;opacity:.7">GENERATED KEY</div><div id="br-key" class="br-key"></div><button id="br-copy" class="br-action br-blue">COPY</button></div>
<div id="br-output" class="br-output"></div>
</div>
</div>`;document.body.appendChild(wrap);

const tradeTab=document.getElementById("br-tab-trade"),adminTab=document.getElementById("br-tab-admin"),tradePage=document.getElementById("br-page-trade"),adminPage=document.getElementById("br-page-admin");

function page(which){tradeTab.classList.toggle("active",which==="trade");adminTab.classList.toggle("active",which==="admin");tradePage.classList.toggle("active",which==="trade");adminPage.classList.toggle("active",which==="admin")}

tradeTab.onclick=()=>page("trade");adminTab.onclick=()=>page("admin");

if(me&&me.username&&me.username.toLowerCase()==="koolio")adminTab.style.display="block";

let sent=new Set();

function safe(s){return String(s||"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]))}

async function loadPlayers(){try{const players=await req("/api/users/online");const q=document.getElementById("br-search").value.trim().toLowerCase();const list=document.getElementById("br-list");const filtered=players.filter(p=>p.username&&p.username.toLowerCase().includes(q));list.innerHTML=filtered.length?"":"<div style='text-align:center;opacity:.6;font-size:11px;padding:15px'>No online players found.</div>";filtered.forEach(p=>{if(p.username.toLowerCase()===(me.username||"").toLowerCase())return;const row=document.createElement("div");row.className="br-player";const avatar=p.avatarUrl?`<img src="${safe(p.avatarUrl)}">`:"👤";const was=sent.has(p.username);row.innerHTML=`<div class="br-info"><div class="br-avatar">${avatar}</div><div class="br-details"><span class="br-name">@${safe(p.username)}</span><span class="br-online"><span class="br-dot"></span>Online</span></div></div><button class="br-send ${was?"sent":""}">${was?"SENT":"TRADE"}</button>`;list.appendChild(row);const btn=row.querySelector("button");btn.onclick=async()=>{if(sent.has(p.username))return;btn.disabled=true;try{let x=await req("/api/trade/request",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify({targetUser:p.username})});if(x.error)throw new Error(x.error);sent.add(p.username);btn.textContent="SENT";btn.classList.add("sent")}catch(e){btn.disabled=false;alert(e.message)}}})}catch(e){document.getElementById("br-list").innerHTML="<div style='text-align:center;color:#ff7777;font-size:11px;padding:15px'>Unable to load online players.</div>"}}

document.getElementById("br-search").oninput=loadPlayers;loadPlayers();setInterval(loadPlayers,3000);

let lastTrade=null;

function notifyTrade(t){const old=document.getElementById("br-notif");if(old)old.remove();const p=document.createElement("div");p.id="br-notif";const avatar=t.senderAvatar?`<img src="${safe(t.senderAvatar)}">`:"🤠";p.innerHTML=`<div class="br-ntitle">Trade Request</div><div class="br-nbody"><div class="br-navatar">${avatar}</div><div class="br-nmsg">@${safe(t.a)} wants to trade with you</div></div><div class="br-nbuttons"><button class="br-nbtn br-accept" id="br-accept">Accept</button><button class="br-nbtn br-decline" id="br-decline">Decline</button></div>`;document.body.appendChild(p);

p.querySelector("#br-accept").onclick=async()=>{try{await req("/api/trade/action",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify({tradeId:t.id,action:"accept_request"})})}catch{}p.remove();lastTrade=null};
p.querySelector("#br-decline").onclick=async()=>{try{await req("/api/trade/action",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify({tradeId:t.id,action:"decline"})})}catch{}p.remove();lastTrade=null}};

async function checkTrades(){try{const x=await req("/api/trade/pending",{headers:{Authorization:"Bearer "+token}});if(x.trade&&x.trade.id!==lastTrade){lastTrade=x.trade.id;notifyTrade(x.trade)}}catch{}}

setInterval(checkTrades,2000);checkTrades();

async function postAdmin(path,data){return req(path,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify(data)})}

const out=document.getElementById("br-output");

document.getElementById("br-ann-btn").onclick=async()=>{try{let text=document.getElementById("br-ann").value.trim();let x=await postAdmin("/api/admin/announcement",{text});out.textContent=x.error||"Announcement sent.";if(!x.error){setTimeout(async()=>{try{await postAdmin("/api/admin/announcement",{text:""})}catch{}},3000)}}catch(e){out.textContent=e.message}};

document.getElementById("br-give").onclick=async()=>{try{let username=document.getElementById("br-gu").value.trim(),brainrotName=document.getElementById("br-gi").value.trim();let x=await postAdmin("/api/admin/give",{username,brainrotName});out.textContent=x.error||`Granted ${brainrotName} to ${username}!`}catch(e){out.textContent=e.message}};

document.getElementById("br-add").onclick=async()=>{try{let username=document.getElementById("br-au").value.trim();let x=await postAdmin("/api/admin/manage-admin",{action:"add",username});out.textContent=x.error||`Added admin: ${username}`}catch(e){out.textContent=e.message}};

document.getElementById("br-rem").onclick=async()=>{try{let username=document.getElementById("br-au").value.trim();let x=await postAdmin("/api/admin/manage-admin",{action:"remove",username});out.textContent=x.error||`Removed admin: ${username}`}catch(e){out.textContent=e.message}};

document.getElementById("br-luck-btn").onclick=async()=>{try{let multiplier=+document.getElementById("br-luck").value,seconds=+document.getElementById("br-seconds").value;let x=await postAdmin("/api/admin/luck",{multiplier,seconds});out.textContent=x.error||"Luck activated."}catch(e){out.textContent=e.message}};

const codes={hour:"1",day:"2",week:"3",month:"4",permanent:"0"};function fnv(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h>>>0}

function offlineKey(duration,base){let code=codes[duration],core=base.trim().toUpperCase().replace(/[^A-Z0-9]/g,"")||Math.random().toString(36).slice(2,8).toUpperCase(),sum=fnv(code+core+"ultra_brainrot_v1").toString(16).toUpperCase().padStart(8,"0").slice(0,6);return`OFF-${code}-${core}-${sum}`}

document.getElementById("br-server-key").onclick=async()=>{try{let duration=document.getElementById("br-duration").value,custom=document.getElementById("br-custom").value.trim(),x=await postAdmin("/api/admin/key",custom?{duration,key:custom}:{duration});if(x.error){out.textContent=x.error;return}document.getElementById("br-key").textContent=x.key;document.getElementById("br-keybox").style.display="block";out.textContent=""}catch(e){out.textContent=e.message}};

document.getElementById("br-offline-key").onclick=()=>{const key=offlineKey(document.getElementById("br-duration").value,document.getElementById("br-custom").value);document.getElementById("br-key").textContent=key;document.getElementById("br-keybox").style.display="block";out.textContent="Offline key generated."};

document.getElementById("br-copy").onclick=()=>{navigator.clipboard.writeText(document.getElementById("br-key").textContent).then(()=>out.textContent="Key copied.")};

let drag=false,dx=0,dy=0;document.getElementById("br-head").onmousedown=e=>{if(e.target.id==="br-x")return;drag=true;dx=e.clientX-wrap.offsetLeft;dy=e.clientY-wrap.offsetTop};document.addEventListener("mousemove",e=>{if(drag){wrap.style.left=e.clientX-dx+"px";wrap.style.top=e.clientY-dy+"px";wrap.style.right="auto"}});document.addEventListener("mouseup",()=>drag=false);

document.getElementById("br-x").onclick=()=>{wrap.remove();const n=document.getElementById("br-notif");if(n)n.remove();style.remove();window.__brainrotLibrary=false};

})(); 
