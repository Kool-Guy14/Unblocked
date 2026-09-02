const http=require("http"),fs=require("fs"),path=require("path"),crypto=require("crypto");
const PORT=process.env.PORT||3000, DB=process.env.DB_PATH||path.join(__dirname,"db.json"), PUBLIC=path.join(__dirname,"public");
const ANIMALS=[
  {
    "Name": "Gattino Hydrantino",
    "DisplayName": "Gattino Hydrantino",
    "Rarity": "Secret",
    "Price": 1950000000,
    "Generation": 14500000,
    "RNGWeight": 4e-08
  },
  {
    "Name": "Gub",
    "DisplayName": "Gub",
    "Rarity": "Secret",
    "Price": 900000000,
    "Generation": 5000000,
    "RNGWeight": 4e-08
  },
  {
    "Name": "Puffino Builderino",
    "DisplayName": "Puffino Builderino",
    "Rarity": "Secret",
    "Price": 3750000000,
    "Generation": 31000000,
    "RNGWeight": 3e-08
  },
  {
    "Name": "Sir Mangus",
    "DisplayName": "Sir Mangus",
    "Rarity": "Secret",
    "Price": 1250000000,
    "Generation": 7500000,
    "RNGWeight": 2e-08
  },
  {
    "Name": "Fluriflura",
    "DisplayName": "Fluriflura",
    "Rarity": "Common",
    "Price": 1000,
    "Generation": 10,
    "RNGWeight": 0.46
  },
  {
    "Name": "Talpa Di Fero",
    "DisplayName": "Talpa Di Fero",
    "Rarity": "Common",
    "Price": 5000,
    "Generation": 50,
    "RNGWeight": 0.2
  },
  {
    "Name": "Tim Cheese",
    "DisplayName": "Tim Cheese",
    "Rarity": "Common",
    "Price": 10000,
    "Generation": 100,
    "RNGWeight": 0.15
  },
  {
    "Name": "Boneca Ambalabu",
    "DisplayName": "Boneca Ambalabu",
    "Rarity": "Rare",
    "Price": 50000,
    "Generation": 250,
    "RNGWeight": 0.08
  },
  {
    "Name": "Odin Din Din Dun",
    "DisplayName": "Odin Din Din Dun",
    "Rarity": "Rare",
    "Price": 100000,
    "Generation": 500,
    "RNGWeight": 0.04
  },
  {
    "Name": "Los Orcalitos",
    "DisplayName": "Los Orcalitos",
    "Rarity": "Rare",
    "Price": 250000,
    "Generation": 1200,
    "RNGWeight": 0.025
  },
  {
    "Name": "Gatto Tacoto",
    "DisplayName": "Gatto Tacoto",
    "Rarity": "Epic",
    "Price": 500000,
    "Generation": 2500,
    "RNGWeight": 0.008
  },
  {
    "Name": "Tralalero Tralala",
    "DisplayName": "Tralalero Tralala",
    "Rarity": "Epic",
    "Price": 1000000,
    "Generation": 5000,
    "RNGWeight": 0.002
  },
  {
    "Name": "Los Chihuaninis",
    "DisplayName": "Los Chihuaninis",
    "Rarity": "Epic",
    "Price": 2500000,
    "Generation": 12000,
    "RNGWeight": 0.0009
  },
  {
    "Name": "Chihuanini Tacoini",
    "DisplayName": "Chihuanini Tacoini",
    "Rarity": "Legendary",
    "Price": 10000000,
    "Generation": 50000,
    "RNGWeight": 0.0002
  },
  {
    "Name": "Tripi Tropi Troppa Trippa",
    "DisplayName": "Tripi Tropi Troppa Trippa",
    "Rarity": "Legendary",
    "Price": 25000000,
    "Generation": 125000,
    "RNGWeight": 8e-05
  }
];
const RARITY_ORDER=["Common","Rare","Epic","Legendary","Mythic","Secret"];
function load(){try{return JSON.parse(fs.readFileSync(DB,"utf8"))}catch{return {users:{},keys:{},sessions:{},messages:[],requests:[],trades:{},announcement:null,luck:{multiplier:1,expiresAt:0}}}}
let db=load();
db.messages??=[];db.requests??=[];db.trades??={};db.users??={};db.keys??={};db.sessions??={};db.announcement??=null;db.luck??={multiplier:1,expiresAt:0};
function save(){fs.writeFileSync(DB,JSON.stringify(db,null,2))}
function json(res,c,d){res.writeHead(c,{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type, Authorization","Cache-Control":"no-store"});res.end(JSON.stringify(d))}
function body(req){return new Promise((ok,no)=>{let s="";req.on("data",x=>s+=x);req.on("end",()=>{try{ok(s?JSON.parse(s):{})}catch(e){no(e)}})})}
function id(){return crypto.randomBytes(8).toString("hex")}
function token(){return crypto.randomBytes(32).toString("hex")}
function hash(p,s=crypto.randomBytes(16).toString("hex")){return {s,h:crypto.scryptSync(p,s,64).toString("hex")}}
function check(p,o){try{return crypto.timingSafeEqual(Buffer.from(crypto.scryptSync(p,o.s,64).toString("hex"),"hex"),Buffer.from(o.h,"hex"))}catch{return false}}
function auth(req){let t=(req.headers.authorization||"").replace(/^Bearer /,"");return db.sessions[t]&&db.users[db.sessions[t]]}
function clean(u){return {username:u.username,createdAt:u.createdAt,keyRedeemed:!!u.keyRedeemed,redeemedKey:u.redeemedKey||null,keyCreatedAt:u.keyCreatedAt||null,keyExpiresAt:u.keyExpiresAt||null,inventory:u.inventory||[],stats:u.stats||{}}}
function active(u){return u&&u.keyRedeemed&&(!u.keyExpiresAt||u.keyExpiresAt>Date.now())}
function weights(){let luck=(db.luck.expiresAt>Date.now()?Math.max(1,Number(db.luck.multiplier)||1):1);return {luck,animals:ANIMALS}}
function roll(){let luck=weights().luck, arr=ANIMALS.map(a=>[a,a.RNGWeight*Math.max(1,(a.Rarity==="Secret"?luck:Math.sqrt(luck)))]), total=arr.reduce((s,x)=>s+x[1],0), r=Math.random()*total;for(const [a,w] of arr){r-=w;if(r<=0)return {...a,id:id()}}return {...ANIMALS[0],id:id()}}
function rarity(a){return RARITY_ORDER.indexOf(a.Rarity)}
function fuse(items){let counts={};items.forEach(x=>counts[x.Rarity]=(counts[x.Rarity]||0)+1);let best=items.reduce((a,b)=>rarity(a)>rarity(b)?a:b);let target=rarity(best);if(target<0)return null;let pool=ANIMALS.filter(a=>rarity(a)>=target && a.Rarity!==best.Rarity);if(!pool.length)pool=ANIMALS.filter(a=>rarity(a)>=target);let a=pool[Math.floor(Math.random()*pool.length)]||best;return {...a,id:id()}}
function validName(s){return typeof s==="string"&&/^[A-Za-z0-9_]{3,20}$/.test(s)}
function route(req,res){
 const u=new URL(req.url,`http://${req.headers.host}`);
 if(req.method==="OPTIONS"){res.writeHead(204,{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type, Authorization"});return res.end()}
 if(u.pathname==="/api/register"&&req.method==="POST")return body(req).then(b=>{if(!validName(b.username)||typeof b.password!=="string"||b.password.length<6)return json(res,400,{error:"Invalid username or password"});if(db.users[b.username])return json(res,409,{error:"Username already exists"});let hp=hash(b.password),now=Date.now();db.users[b.username]={username:b.username,password:hp,createdAt:now,keyRedeemed:false,inventory:[],stats:{plinkoBest:0,lockBest:0}};let t=token();db.sessions[t]=b.username;save();json(res,200,{token:t,user:clean(db.users[b.username])})})
 if(u.pathname==="/api/login"&&req.method==="POST")return body(req).then(b=>{let x=db.users[b.username];if(!x||!check(b.password,x.password))return json(res,401,{error:"Invalid login"});let t=token();db.sessions[t]=x.username;save();json(res,200,{token:t,user:clean(x)})})
 if(u.pathname==="/api/redeem"&&req.method==="POST")return body(req).then(b=>{let user=auth(req);if(!user)return json(res,401,{error:"Login required"});let k=db.keys[b.key];if(!k)return json(res,400,{error:"Invalid key"});if(k.used)return json(res,400,{error:"this key is out of stock."});if(k.expiresAt&&k.expiresAt<=Date.now())return json(res,400,{error:"Key expired"});if(user.keyRedeemed)return json(res,400,{error:"This account already has a redeemed key"});k.used=true;k.redeemedBy=user.username;k.redeemedAt=Date.now();user.keyRedeemed=true;user.redeemedKey=b.key;user.keyCreatedAt=k.createdAt;user.keyExpiresAt=k.expiresAt;save();json(res,200,{user:clean(user)})})
 if(u.pathname==="/api/admin/key"&&req.method==="POST")return body(req).then(b=>{let ds={hour:3600000,day:86400000,week:604800000,month:2592000000,permanent:0},d=ds[b.duration];if(d===undefined)return json(res,400,{error:"Invalid duration"});let key="ULTRA-"+crypto.randomBytes(2).toString("hex").toUpperCase()+"-"+crypto.randomBytes(2).toString("hex").toUpperCase();db.keys[key]={createdAt:Date.now(),expiresAt:d?Date.now()+d:null,used:false,redeemedBy:null,redeemedAt:null};save();json(res,200,{key,...db.keys[key]})})
 if(u.pathname==="/api/me"&&req.method==="GET"){let user=auth(req);return user?json(res,200,{user:clean(user)}):json(res,401,{error:"Login required"})}
 if(u.pathname==="/api/animals"&&req.method==="GET")return json(res,200,weights())
 if(u.pathname==="/api/roll"&&req.method==="POST"){let user=auth(req);if(!active(user))return json(res,403,{error:"Active key required"});let item=roll();user.inventory.push(item);save();return json(res,200,{item,user:clean(user),luck:weights().luck})}
 if(u.pathname==="/api/fuse"&&req.method==="POST")return body(req).then(b=>{let user=auth(req);if(!active(user))return json(res,403,{error:"Active key required"});let ids=Array.isArray(b.ids)?b.ids:[];if(ids.length!==4||new Set(ids).size!==4)return json(res,400,{error:"Select exactly 4 different brainrots"});let chosen=[];for(const x of ids){let i=user.inventory.findIndex(v=>v.id===x);if(i<0)return json(res,400,{error:"Brainrot not found"});chosen.push(user.inventory[i])}ids.forEach(x=>user.inventory.splice(user.inventory.findIndex(v=>v.id===x),1));let result=fuse(chosen);user.inventory.push(result);save();json(res,200,{result,user:clean(user)})})
 if(u.pathname==="/api/chat"&&req.method==="GET"){let user=auth(req);if(!user)return json(res,401,{error:"Login required"});let since=Number(u.searchParams.get("since")||0);return json(res,200,{messages:db.messages.filter(x=>x.time>since).slice(-100),announcement:db.announcement,luck:weights().luck})}
 if(u.pathname==="/api/chat"&&req.method==="POST")return body(req).then(b=>{let user=auth(req);if(!user)return json(res,401,{error:"Login required"});let text=String(b.text||"").trim().slice(0,300);if(!text)return json(res,400,{error:"Empty message"});db.messages.push({id:id(),username:user.username,text,time:Date.now()});db.messages=db.messages.slice(-500);save();json(res,200,{ok:true})})
 if(u.pathname==="/api/admin/announcement"&&req.method==="POST")return body(req).then(b=>{let text=String(b.text||"").trim().slice(0,200);db.announcement=text?{text,time:Date.now()}:null;save();json(res,200,{ok:true,announcement:db.announcement})})
 if(u.pathname==="/api/admin/luck"&&req.method==="POST")return body(req).then(b=>{let multiplier=Math.max(1,Number(b.multiplier)||1),seconds=Math.max(1,Number(b.seconds)||1);db.luck={multiplier,expiresAt:Date.now()+seconds*1000};save();json(res,200,{ok:true,luck:db.luck})})
 if(u.pathname==="/api/friends"&&req.method==="GET"){let user=auth(req);if(!user)return json(res,401,{error:"Login required"});let friends=(user.friends||[]).map(n=>db.users[n]).filter(Boolean).map(x=>({username:x.username}));let incoming=db.requests.filter(x=>x.to===user.username&&x.status==="pending");return json(res,200,{friends,requests:incoming})}
 if(u.pathname==="/api/friends/request"&&req.method==="POST")return body(req).then(b=>{let user=auth(req);if(!user)return json(res,401,{error:"Login required"});if(!db.users[b.username]||b.username===user.username)return json(res,400,{error:"User not found"});if((user.friends||[]).includes(b.username))return json(res,400,{error:"Already friends"});if(db.requests.some(x=>x.from===user.username&&x.to===b.username&&x.status==="pending"))return json(res,400,{error:"Request already sent"});db.requests.push({id:id(),from:user.username,to:b.username,status:"pending",time:Date.now()});save();json(res,200,{ok:true})})
 if(u.pathname==="/api/friends/respond"&&req.method==="POST")return body(req).then(b=>{let user=auth(req);if(!user)return json(res,401,{error:"Login required"});let q=db.requests.find(x=>x.id===b.id||x.from===b.from&&x.to===user.username&&x.status==="pending");if(!q)return json(res,404,{error:"Request not found"});if(b.accept){user.friends=user.friends||[];let o=db.users[q.from];o.friends=o.friends||[];if(!user.friends.includes(o.username))user.friends.push(o.username);if(!o.friends.includes(user.username))o.friends.push(user.username)}q.status=b.accept?"accepted":"declined";save();json(res,200,{ok:true})})
 if(u.pathname==="/api/dm"&&req.method==="GET"){let user=auth(req);if(!user)return json(res,401,{error:"Login required"});let w=u.searchParams.get("with"),since=Number(u.searchParams.get("since")||0);let msgs=(db.dm||[]).filter(x=>((x.from===user.username&&x.to===w)||(x.from===w&&x.to===user.username))&&x.time>since);return json(res,200,{messages:msgs.slice(-100)})}
 if(u.pathname==="/api/dm"&&req.method==="POST")return body(req).then(b=>{let user=auth(req);if(!user)return json(res,401,{error:"Login required"});if(!(user.friends||[]).includes(b.to))return json(res,403,{error:"You can only DM friends"});let text=String(b.text||"").trim().slice(0,300);if(!text)return json(res,400,{error:"Empty message"});db.dm=db.dm||[];db.dm.push({id:id(),from:user.username,to:b.to,text,time:Date.now()});db.dm=db.dm.slice(-1000);save();json(res,200,{ok:true})})
 if(u.pathname==="/api/trade/create"&&req.method==="POST")return body(req).then(b=>{let user=auth(req);if(!user)return json(res,401,{error:"Login required"});if(!db.users[b.to]||!(user.friends||[]).includes(b.to))return json(res,400,{error:"You must be friends to trade"});let t="T"+id();db.trades[t]={id:t,a:user.username,b:b.to,aItems:[],bItems:[],aReady:false,bReady:false,status:"open",chat:[]};save();json(res,200,{trade:db.trades[t]})})
 if(u.pathname.startsWith("/api/trade/")&&req.method==="GET"){let user=auth(req),t=db.trades[u.pathname.split("/").pop()];if(!user||!t||![t.a,t.b].includes(user.username))return json(res,404,{error:"Trade not found"});return json(res,200,{trade:t})}
 if(u.pathname==="/api/trade/action"&&req.method==="POST")return body(req).then(b=>{let user=auth(req),t=db.trades[b.tradeId];if(!user||!t||![t.a,t.b].includes(user.username))return json(res,404,{error:"Trade not found"});if(b.action==="chat"){let text=String(b.text||"").trim().slice(0,200);if(text)t.chat.push({username:user.username,text,time:Date.now()})}if(b.action==="ready"){if(user.username===t.a)t.aReady=true;else t.bReady=true}if(b.action==="cancel")t.status="cancelled";if(t.aReady&&t.bReady)t.status="completed";save();json(res,200,{trade:t})})
 if(u.pathname==="/bookmarklet.js"){res.writeHead(200,{"Content-Type":"application/javascript","Cache-Control":"no-store"});return res.end(fs.readFileSync(path.join(PUBLIC,"bookmarklet.js"),"utf8").replace(/^javascript:/,""))}
 res.writeHead(200,{"Content-Type":"text/plain"});res.end("RNG Game Library API online")
}
http.createServer((q,s)=>Promise.resolve(route(q,s)).catch(e=>json(s,500,{error:e.message}))).listen(PORT,()=>console.log("Listening on "+PORT));
