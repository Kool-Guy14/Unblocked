javascript:(async()=>{if(window.__brainrotLibrary){alert("Already open!");return}window.__brainrotLibrary=true;const API="https://brainrots-game-library.onrender.com",KOOLIO_USER="koolio",KOOLIO_PASS="Kruzzer67*";let token=localStorage.getItem("token"),me=null;

async function api(p,o={}){const r=await fetch(API+p,o);let d={};try{d=await r.json()}catch{}if(!r.ok)throw Error(d.error||("HTTP "+r.status));return d}

async function auth(){try{if(token){try{let x=await api("/api/me",{headers:{Authorization:"Bearer "+token}});if(x.user){me=x.user;return}}catch{}}let x=await api("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:KOOLIO_USER,password:KOOLIO_PASS})});if(x.token){token=x.token;localStorage.setItem("token",token);me=x.user}}catch(e){console.error(e)}}

await auth();if(!token){alert("Failed to connect to the Brainrot server.");window.__brainrotLibrary=false;return}

const isKoolio=!!(me&&me.username&&me.username.toLowerCase()==="koolio");

const st=document.createElement("style");st.textContent=`
#brlib{position:fixed;top:50px;right:20px;width:650px;background:#18212c;border:3px solid #000;border-radius:9px;box-shadow:0 10px 35px #000;color:#fff;font-family:Arial,sans-serif;z-index:2147483647;overflow:hidden}
#brhead{height:42px;background:#263747;border-bottom:2px solid #000;display:flex;align-items:center;justify-content:space-between;padding:0 9px;cursor:move}
#brtitle{font-size:15px;font-weight:bold;text-shadow:1px 1px #000}
#brclose{width:25px;height:25px;background:#c62828;border:1px solid #000;border-radius:3px;color:#fff;font-weight:bold;cursor:pointer}
#brtabs{display:flex;background:#101820;border-bottom:2px solid #000}
.brtab{flex:1;border:0;border-right:2px solid #000;padding:9px 4px;color:#fff;font-weight:bold;font-size:12px;cursor:pointer;text-shadow:1px 1px #000}
.brtab:last-child{border-right:0}
.brtab.active{outline:2px solid #fff;outline-offset:-3px}
#tabTrade{background:#4caf50}#tabProfile{background:#2196f3}#tabGames{background:#9c27b0}#tabAdmin{background:#7b2cbf}
.brpage{display:none;padding:12px}.brpage.active{display:block}
.brinput,.brselect{width:100%;box-sizing:border-box;padding:9px;background:#0c1218;border:1px solid #46576a;border-radius:4px;color:#fff;font-size:12px;margin-bottom:7px}
.brbutton{width:100%;padding:8px;border:1px solid #000;border-radius:4px;color:#fff;font-size:12px;font-weight:bold;cursor:pointer;text-shadow:1px 1px #000;margin-top:4px}
.green{background:#4caf50}.blue{background:#1976d2}.purple{background:#8e24aa}.red{background:#d32f2f}.brown{background:#a3752c}
.brlabel{font-size:11px;font-weight:bold;margin:4px 0 5px}
.brhint{font-size:10px;color:#b7c3ce;margin-bottom:8px}
#brplayers,#gamePlayers{max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:7px}
.brplayer{background:#161e27;border:1px solid #394b5d;border-radius:6px;padding:8px;display:flex;align-items:center;justify-content:space-between}
.brpinfo{display:flex;align-items:center;gap:8px;min-width:0}
.bravatar{width:38px;height:38px;border-radius:5px;background:#303b48;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.bravatar img{width:100%;height:100%;object-fit:cover}
.brdetails{min-width:0}.brusername{font-size:12px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.brstatus{font-size:9px;color:#63d471;margin-top:2px}
.brtrade{background:#4caf50;border:2px solid #000;border-radius:4px;color:#fff;font-size:10px;font-weight:bold;padding:6px 9px;cursor:pointer}
.brtrade.sent{background:#275f30}

#tttwrap{display:none}
#tttheader{display:flex;justify-content:space-between;align-items:center;background:#202b38;border:1px solid #394b5d;padding:8px;border-radius:5px;margin-bottom:8px}
#tttplayers{font-size:11px;font-weight:bold}
#tttstatus{font-size:11px;color:#8fd694;text-align:right}
#tttgame{display:flex;gap:10px;align-items:stretch}
#tttleft{width:245px;flex-shrink:0}
#tttboard{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.tttcell{height:72px;background:#202b38;border:2px solid #000;border-radius:5px;color:#fff;font-size:30px;font-weight:bold;cursor:pointer}
.tttcell:hover{background:#293847}
#tttrematch{display:none}
#tttright{width:100%;min-width:0;background:#0d141c;border:2px solid #000;border-radius:6px;display:flex;flex-direction:column}
#tttchathead{background:#202b38;padding:8px;font-size:11px;font-weight:bold;border-bottom:2px solid #000}
#tttchatmessages{height:190px;overflow-y:auto;padding:7px;display:flex;flex-direction:column;gap:5px}
.tttmsg{background:#18222d;border-radius:4px;padding:5px 6px;font-size:10px;word-break:break-word}
.tttmsgname{font-weight:bold;color:#8fd694;margin-right:4px}
#tttchatbottom{display:flex;padding:6px;border-top:2px solid #000;gap:5px}
#tttchatinput{flex:1;background:#111923;color:#fff;border:1px solid #46576a;border-radius:4px;padding:7px;font-size:10px;outline:none}
#tttchatsend{background:#4caf50;color:#fff;border:1px solid #000;border-radius:4px;padding:0 10px;font-size:10px;font-weight:bold;cursor:pointer}
#tttinvite{margin-top:8px}
#tttback{background:#3b6ea5}

#brkeybox{display:none;background:#0b1117;border-radius:5px;padding:9px;text-align:center;margin-top:8px}
#brkey{font-weight:bold;color:#8fd694;font-size:14px;word-break:break-all}
#brout{font-size:10px;white-space:pre-wrap;margin-top:8px;color:#d5dde5}

#brnotif{position:fixed;top:20px;right:20px;width:320px;background:#3b2822;border:3px solid #1a100d;border-radius:12px;padding:12px 16px;box-sizing:border-box;color:#fff;box-shadow:0 8px 16px rgba(0,0,0,.6);z-index:2147483647}
#brnotif .ntitle{color:#c0a2f8;font-size:20px;font-weight:bold;margin-bottom:8px;text-shadow:1px 1px 2px #000}
#brnotif .nbody{display:flex;align-items:center;gap:10px;margin-bottom:12px}
#brnotif .navatar{width:48px;height:48px;border-radius:8px;background:#ff3b3b;display:flex;align-items:center;justify-content:center;font-size:26px;overflow:hidden;flex-shrink:0}
#brnotif .navatar img{width:100%;height:100%;object-fit:cover}
#brnotif .nmsg{font-size:16px;font-weight:bold;line-height:1.2;text-shadow:1px 1px 2px #000}
#brnotif .nbuttons{display:flex;gap:10px}
#brnotif .nbtn{flex:1;padding:8px 0;border:2px solid #000;border-radius:6px;color:#fff;font-size:16px;font-weight:bold;cursor:pointer;text-shadow:1px 1px 2px #000}
#brnotif .accept{background:#00c853}.brnotif .decline{background:#ff3d00}
`;

document.head.appendChild(st);

const w=document.createElement("div");w.id="brlib";w.innerHTML=`
<div id="brhead"><span id="brtitle">Brainrot Game Library</span><button id="brclose">✕</button></div>
<div id="brtabs">
<button class="brtab active" id="tabTrade">Trade</button>
<button class="brtab" id="tabProfile">Profile</button>
<button class="brtab" id="tabGames">Games</button>
<button class="brtab" id="tabAdmin" style="display:${isKoolio?"block":"none"}">Admin</button>
</div>

<div id="pageTrade" class="brpage active">
<div class="brlabel">Trade Machine</div>
<div class="brhint">Search for a username or choose someone currently online.</div>
<input id="brsearch" class="brinput" placeholder="Search usernames...">
<div id="brplayers"></div>
</div>

<div id="pageProfile" class="brpage">
<div class="brlabel">Profile</div>
<div class="brhint">Update your public profile information.</div>
<input id="displayName" class="brinput" maxlength="30" placeholder="Display Name">
<input id="avatarUrl" class="brinput" placeholder="Profile Picture URL">
<input id="newPassword" class="brinput" type="password" placeholder="New Password">
<button id="saveProfile" class="brbutton blue">SAVE PROFILE</button>
<div id="profileOut" style="font-size:10px;margin-top:7px"></div>
</div>

<div id="pageGames" class="brpage">
<div class="brlabel">Multiplayer Games</div>
<div class="brhint">Choose an online player to challenge them to Tic-Tac-Toe.</div>
<input id="gameSearch" class="brinput" placeholder="Search opponent...">
<div id="gamePlayers"></div>

<div id="tttwrap">
<div id="tttheader">
<div id="tttplayers"></div>
<div id="tttstatus"></div>
</div>

<div id="tttgame">
<div id="tttleft">
<div id="tttboard"></div>
<button id="tttrematch" class="brbutton purple">REMATCH</button>
<button id="tttback" class="brbutton blue">BACK TO PLAYERS</button>
</div>

<div id="tttright">
<div id="tttchathead">💬 GAME CHAT</div>
<div id="tttchatmessages"></div>
<div id="tttchatbottom">
<input id="tttchatinput" placeholder="Type a message...">
<button id="tttchatsend">SEND</button>
</div>
</div>
</div>
</div>
</div>

<div id="pageAdmin" class="brpage">
<div class="brlabel">Global Announcement</div>
<input id="ann" class="brinput" maxlength="200" placeholder="Announcement text">
<button id="annBtn" class="brbutton green">ANNOUNCE FOR 3 SECONDS</button>

<div class="brlabel" style="margin-top:13px">Give Brainrot</div>
<input id="giveUser" class="brinput" placeholder="Target Username">
<input id="giveItem" class="brinput" placeholder="Brainrot Name">
<button id="giveBtn" class="brbutton purple">GRANT ITEM</button>

<div class="brlabel" style="margin-top:13px">Manage Admins</div>
<input id="admUser" class="brinput" placeholder="Username">
<div style="display:flex;gap:6px">
<button id="admAdd" class="brbutton green">ADD ADMIN</button>
<button id="admRem" class="brbutton red">REMOVE ADMIN</button>
</div>

<div class="brlabel" style="margin-top:13px">RNG Luck</div>
<div style="display:flex;gap:6px">
<input id="luck" class="brinput" type="number" min="1" value="2">
<input id="seconds" class="brinput" type="number" min="1" value="60">
</div>
<button id="luckBtn" class="brbutton green">ACTIVATE LUCK</button>

<div class="brlabel" style="margin-top:13px">Generate Key</div>
<select id="duration" class="brselect">
<option value="hour">1 Hour</option>
<option value="day">1 Day</option>
<option value="week">7 Days</option>
<option value="month">30 Days</option>
<option value="permanent">Permanent</option>
</select>
<input id="customKey" class="brinput" placeholder="Custom key (optional)">
<div style="display:flex;gap:6px">
<button id="serverKey" class="brbutton purple">SERVER KEY</button>
<button id="offlineKey" class="brbutton brown">OFFLINE KEY</button>
</div>
<div id="brkeybox"><div style="font-size:9px;opacity:.7">GENERATED KEY</div><div id="brkey"></div><button id="copyKey" class="brbutton blue">COPY</button></div>
<div id="brout"></div>
</div>`;

document.body.appendChild(w);

function show(id){document.querySelectorAll(".brpage").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".brtab").forEach(x=>x.classList.remove("active"));document.getElementById(id==="pageTrade"?"tabTrade":id==="pageProfile"?"tabProfile":id==="pageGames"?"tabGames":"tabAdmin").classList.add("active")}

tabTrade.onclick=()=>show("pageTrade");
tabProfile.onclick=()=>show("pageProfile");
tabGames.onclick=()=>show("pageGames");
if(isKoolio)tabAdmin.onclick=()=>show("pageAdmin");

displayName.value=me.displayName||"";
avatarUrl.value=me.avatarUrl||"";

async function players(){try{let list=await api("/api/users/online"),q=brsearch.value.toLowerCase(),el=brplayers;el.innerHTML="";list.filter(p=>p.username.toLowerCase().includes(q)&&p.username.toLowerCase()!==me.username.toLowerCase()).forEach(p=>{let r=document.createElement("div");r.className="brplayer";r.innerHTML=`<div class="brpinfo"><div class="bravatar">${p.avatarUrl?`<img src="${String(p.avatarUrl).replace(/"/g,"&quot;")}">`:"👤"}</div><div class="brdetails"><div class="brusername">@${p.username}</div><div class="brstatus">● Online</div></div></div><button class="brtrade">TRADE</button>`;el.appendChild(r);r.querySelector("button").onclick=async()=>{try{let x=await api("/api/trade/request",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({targetUser:p.username})});if(x.error)throw Error(x.error);r.querySelector("button").textContent="SENT";r.querySelector("button").disabled=true}catch(e){alert(e.message)}}})}catch{brplayers.innerHTML="<div style='font-size:11px;text-align:center;color:#f66;padding:12px'>Unable to load players.</div>"}}

brsearch.oninput=players;players();setInterval(players,4000);

let pending=null;

async function tradePoll(){try{let x=await api("/api/trade/pending",{headers:{Authorization:"Bearer "+token}});if(x.trade&&x.trade.id!==pending){pending=x.trade.id;notify(x.trade)}}catch{}}

function notify(t){let old=document.getElementById("brnotif");if(old)old.remove();let n=document.createElement("div");n.id="brnotif";n.innerHTML=`<div class="ntitle">Trade Request</div><div class="nbody"><div class="navatar">${t.senderAvatar?`<img src="${String(t.senderAvatar).replace(/"/g,"&quot;")}">`:"🤠"}</div><div class="nmsg">@${t.a} wants to trade with you</div></div><div class="nbuttons"><button class="nbtn accept">Accept</button><button class="nbtn decline">Decline</button></div>`;document.body.appendChild(n);n.querySelector(".accept").onclick=async()=>{try{await api("/api/trade/action",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({tradeId:t.id,action:"accept_request"})})}catch{}n.remove();pending=null};n.querySelector(".decline").onclick=async()=>{try{await api("/api/trade/action",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({tradeId:t.id,action:"decline"})})}catch{}n.remove();pending=null}}

tradePoll();setInterval(tradePoll,2000);

saveProfile.onclick=async()=>{try{let x=await api("/api/profile",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({displayName:displayName.value.trim(),avatarUrl:avatarUrl.value.trim(),newPassword:newPassword.value})});if(x.user)me=x.user;newPassword.value="";profileOut.textContent=x.error||"Profile saved!"}catch(e){profileOut.textContent=e.message}};

let game=null,gameChat=[],chatSince=0;

function gamePlayers(){api("/api/users/online").then(list=>{let q=gameSearch.value.toLowerCase();gamePlayers.innerHTML="";list.filter(p=>p.username.toLowerCase().includes(q)&&p.username.toLowerCase()!==me.username.toLowerCase()).forEach(p=>{let r=document.createElement("div");r.className="brplayer";r.innerHTML=`<div class="brpinfo"><div class="bravatar">${p.avatarUrl?"🎮":"🎮"}</div><div class="brdetails"><div class="brusername">@${p.username}</div><div class="brstatus">● Online</div></div></div><button class="brtrade" style="background:#8e24aa">PLAY</button>`;gamePlayers.appendChild(r);r.querySelector("button").onclick=()=>inviteGame(p.username)})}).catch(()=>{})}

gameSearch.oninput=gamePlayers;gamePlayers();setInterval(gamePlayers,5000);

function boardWin(b){return[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].find(a=>b[a[0]]&&b[a[0]]===b[a[1]]&&b[a[1]]===b[a[2]])}

function renderGame(){if(!game)return;tttplayers.textContent=game.me+"  vs  "+game.opponent;let winner=boardWin(game.board);if(winner)tttstatus.textContent=game.board[winner[0]]==="X"?(game.x===me.username?"You win!":"You lose!"):(game.o===me.username?"You win!":"You lose!");else if(game.board.every(Boolean))tttstatus.textContent="Draw!";else tttstatus.textContent=game.turn===me.username?"Your turn":"Opponent's turn";tttboard.innerHTML="";game.board.forEach((v,i)=>{let c=document.createElement("button");c.className="tttcell";c.textContent=v;c.disabled=!!v||game.turn!==me.username||!!winner||game.board.every(Boolean);c.onclick=()=>makeMove(i);tttboard.appendChild(c)});if(winner||game.board.every(Boolean))tttrematch.style.display="block";else tttrematch.style.display="none"}

function chatRender(){tttchatmessages.innerHTML="";gameChat.forEach(m=>{let d=document.createElement("div");d.className="tttmsg";d.innerHTML=`<span class="tttmsgname">@${String(m.user||"").replace(/[<>"']/g,"")}</span>${String(m.text||"").replace(/[<>"']/g,"")}`;tttchatmessages.appendChild(d)});tttchatmessages.scrollTop=tttchatmessages.scrollHeight}

async function gameSend(d){try{await api("/api/chat",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({text:"__TTT__"+JSON.stringify(d)})})}catch{}}

function inviteGame(op){game={id:[me.username,op].sort().join("_")+"_"+Date.now(),me:me.username,opponent:op,x:me.username,o:op,turn:me.username,board:["","","","","","","","",""],over:false};gameChat=[];chatSince=0;tttwrap.style.display="block";gamePlayers.style.display="none";gameSearch.style.display="none";renderGame();chatRender();gameSend({type:"invite",id:game.id,from:me.username,to:op})}

function startAccepted(id,op){game={id,me:me.username,opponent:op,x:op,o:me.username,turn:op,board:["","","","","","","","",""],over:false};gameChat=[];chatSince=0;tttwrap.style.display="block";gamePlayers.style.display="none";gameSearch.style.display="none";renderGame();chatRender()}

async function makeMove(i){if(!game||game.turn!==me.username||game.board[i]||game.over)return;let symbol=game.x===me.username?"X":"O";game.board[i]=symbol;game.turn=game.opponent;let winner=boardWin(game.board)||game.board.every(Boolean);if(winner)game.over=true;renderGame();await gameSend({type:"move",id:game.id,from:me.username,to:game.opponent,index:i,symbol})}

async function rematch(){if(!game)return;game.board=["","","","","","","","",""];game.over=false;game.turn=game.x;tttrematch.style.display="none";renderGame();await gameSend({type:"rematch",id:game.id,from:me.username,to:game.opponent})}

tttrematch.onclick=rematch;

tttback.onclick=()=>{game=null;tttwrap.style.display="none";gamePlayers.style.display="flex";gameSearch.style.display="block"};

async function sendChat(){if(!game)return;let text=tttchatinput.value.trim();if(!text)return;tttchatinput.value="";await gameSend({type:"chat",id:game.id,from:me.username,to:game.opponent,text})}

tttchatsend.onclick=sendChat;
tttchatinput.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();sendChat()}};

async function gamePoll(){try{let x=await api("/api/chat?since="+chatSince);if(!Array.isArray(x))return;x.forEach(m=>{chatSince=Math.max(chatSince,Number(m.time)||0);if(typeof m.text!=="string"||!m.text.startsWith("__TTT__"))return;let d;try{d=JSON.parse(m.text.slice(7))}catch{return};

if(d.type==="invite"&&d.to===me.username){if(confirm("@"+d.from+" challenged you to Tic-Tac-Toe. Accept?")){startAccepted(d.id,d.from);gameSend({type:"accept",id:d.id,from:me.username,to:d.from})}}

else if(d.type==="accept"&&game&&d.id===game.id&&d.to===me.username){game.turn=game.x;renderGame()}

else if(d.type==="move"&&game&&d.id===game.id&&d.to===me.username){game.board[d.index]=d.symbol;game.turn=me.username;let winner=boardWin(game.board);if(winner||game.board.every(Boolean))game.over=true;renderGame()}

else if(d.type==="rematch"&&game&&d.id===game.id&&d.to===me.username){game.board=["","","","","","","","",""];game.over=false;game.turn=game.x;renderGame()}

else if(d.type==="chat"&&game&&d.id===game.id&&d.to===me.username){gameChat.push({user:d.from,text:d.text});chatRender()}})}catch{}}

setInterval(gamePoll,1000);

if(isKoolio){const out=document.getElementById("brout");async function admin(p,b){return api(p,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify(b)})}

annBtn.onclick=async()=>{try{let text=ann.value.trim(),x=await admin("/api/admin/announcement",{text});out.textContent=x.error||"Announcement sent.";if(!x.error)setTimeout(async()=>{try{await admin("/api/admin/announcement",{text:""})}catch{}},3000)}catch(e){out.textContent=e.message}};

giveBtn.onclick=async()=>{try{let x=await admin("/api/admin/give",{username:giveUser.value.trim(),brainrotName:giveItem.value.trim()});out.textContent=x.error||"Brainrot granted."}catch(e){out.textContent=e.message}};

admAdd.onclick=async()=>{try{let x=await admin("/api/admin/manage-admin",{action:"add",username:admUser.value.trim()});out.textContent=x.error||"Admin added."}catch(e){out.textContent=e.message}};

admRem.onclick=async()=>{try{let x=await admin("/api/admin/manage-admin",{action:"remove",username:admUser.value.trim()});out.textContent=x.error||"Admin removed."}catch(e){out.textContent=e.message}};

luckBtn.onclick=async()=>{try{let x=await admin("/api/admin/luck",{multiplier:+luck.value,seconds:+seconds.value});out.textContent=x.error||"Luck activated."}catch(e){out.textContent=e.message}};

const codes={hour:"1",day:"2",week:"3",month:"4",permanent:"0"};function fnv(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=(h*0x01000193)>>>0}return h>>>0}function offlineKey(d,b){let core=b.trim().toUpperCase().replace(/[^A-Z0-9]/g,"")||Math.random().toString(16).slice(2,8).toUpperCase(),sum=fnv(codes[d]+core+"ultra_brainrot_v1").toString(16).toUpperCase().padStart(8,"0").slice(0,6);return"OFF-"+codes[d]+"-"+core+"-"+sum}

serverKey.onclick=async()=>{try{let d=duration.value,c=customKey.value.trim(),x=await admin("/api/admin/key",c?{duration:d,key:c}:{duration:d});if(x.error){out.textContent=x.error;return}brkey.textContent=x.key;brkeybox.style.display="block";out.textContent=""}catch(e){out.textContent=e.message}};

offlineKey.onclick=()=>{brkey.textContent=offlineKey(duration.value,customKey.value);brkeybox.style.display="block";out.textContent="Offline key generated."};
copyKey.onclick=()=>{navigator.clipboard.writeText(brkey.textContent);out.textContent="Key copied."}}

let drag=false,ox=0,oy=0;brhead.onmousedown=e=>{if(e.target.id==="brclose")return;drag=true;ox=e.clientX-w.offsetLeft;oy=e.clientY-w.offsetTop};document.addEventListener("mousemove",e=>{if(drag){w.style.left=e.clientX-ox+"px";w.style.top=e.clientY-oy+"px";w.style.right="auto"}});document.addEventListener("mouseup",()=>drag=false);

brclose.onclick=()=>{w.remove();let n=document.getElementById("brnotif");if(n)n.remove();st.remove();window.__brainrotLibrary=false};

})();
