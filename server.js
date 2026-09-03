const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const PORT = process.env.PORT || 3000, DB = process.env.DB_PATH || path.join(__dirname, "db.json"), PUBLIC = path.join(__dirname, "public");
const MAX_INV = 10;

// Dataset with full standard float decimals for weights
const ANIMALS = [
  { "Name": "Dragon Cannelloni", "DisplayName": "Dragon Cannelloni", "Rarity": "Secret", "Price": 250000000000, "Generation": 250000000, "RNGWeight": 0.00000001 },
  { "Name": "Meowl", "DisplayName": "Meowl", "Rarity": "Secret", "Price": 375000000000, "Generation": 375000000, "RNGWeight": 0.000000008 },
  { "Name": "Garama and Madundung", "DisplayName": "Garama and Madundung", "Rarity": "Secret", "Price": 10000000000, "Generation": 50000000, "RNGWeight": 0.00000002 },
  { "Name": "Gattino Hydrantino", "DisplayName": "Gattino Hydrantino", "Rarity": "Secret", "Price": 1950000000, "Generation": 14500000, "RNGWeight": 0.00000004 },
  { "Name": "Gub", "DisplayName": "Gub", "Rarity": "Secret", "Price": 900000000, "Generation": 5000000, "RNGWeight": 0.00000004 },
  { "Name": "Puffino Builderino", "DisplayName": "Puffino Builderino", "Rarity": "Secret", "Price": 3750000000, "Generation": 31000000, "RNGWeight": 0.00000003 },
  { "Name": "Sir Mangus", "DisplayName": "Sir Mangus", "Rarity": "Secret", "Price": 1250000000, "Generation": 7500000, "RNGWeight": 0.00000002 },
  { "Name": "Fluriflura", "DisplayName": "Fluriflura", "Rarity": "Common", "Price": 1000, "Generation": 10, "RNGWeight": 0.46 },
  { "Name": "Talpa Di Fero", "DisplayName": "Talpa Di Fero", "Rarity": "Common", "Price": 5000, "Generation": 50, "RNGWeight": 0.2 },
  { "Name": "Tim Cheese", "DisplayName": "Tim Cheese", "Rarity": "Common", "Price": 10000, "Generation": 100, "RNGWeight": 0.15 },
  { "Name": "Boneca Ambalabu", "DisplayName": "Boneca Ambalabu", "Rarity": "Rare", "Price": 50000, "Generation": 250, "RNGWeight": 0.08 },
  { "Name": "Odin Din Din Dun", "DisplayName": "Odin Din Din Dun", "Rarity": "Rare", "Price": 100000, "Generation": 500, "RNGWeight": 0.04 },
  { "Name": "Los Orcalitos", "DisplayName": "Los Orcalitos", "Rarity": "Rare", "Price": 250000, "Generation": 1200, "RNGWeight": 0.025 },
  { "Name": "Gatto Tacoto", "DisplayName": "Gatto Tacoto", "Rarity": "Epic", "Price": 500000, "Generation": 2500, "RNGWeight": 0.008 },
  { "Name": "Tralalero Tralala", "DisplayName": "Tralalero Tralala", "Rarity": "Epic", "Price": 1000000, "Generation": 5000, "RNGWeight": 0.002 },
  { "Name": "Los Chihuaninis", "DisplayName": "Los Chihuaninis", "Rarity": "Epic", "Price": 2500000, "Generation": 12000, "RNGWeight": 0.0009 },
  { "Name": "Chihuanini Tacoini", "DisplayName": "Chihuanini Tacoini", "Rarity": "Legendary", "Price": 10000000, "Generation": 50000, "RNGWeight": 0.0002 },
  { "Name": "Tripi Tropi Troppa Trippa", "DisplayName": "Tripi Tropi Troppa Trippa", "Rarity": "Legendary", "Price": 25000000, "Generation": 125000, "RNGWeight": 0.00008 }
];
const RARITY_ORDER = ["Common", "Rare", "Epic", "Legendary", "Mythic", "Secret"];

function load() { try { return JSON.parse(fs.readFileSync(DB, "utf8")) } catch { return { users: {}, keys: {}, sessions: {}, messages: [], requests: [], trades: {}, dm: [], admins: ["koolio"], announcement: null, luck: { multiplier: 1, expiresAt: 0 }, tictactoe: {} } } }
let db = load();
db.messages ??= []; db.requests ??= []; db.trades ??= {}; db.dm ??= []; db.users ??= {}; db.keys ??= {}; db.sessions ??= {}; db.admins ??= ["koolio"]; db.announcement ??= null; db.luck ??= { multiplier: 1, expiresAt: 0 }; db.tictactoe ??= {};

function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)) }
function json(res, c, d) { res.writeHead(c, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Cache-Control": "no-store" }); res.end(JSON.stringify(d)) }
function body(req) { return new Promise((ok, no) => { let s = ""; req.on("data", x => s += x); req.on("end", () => { try { ok(s ? JSON.parse(s) : {}) } catch (e) { no(e) } }) }) }
function id() { return crypto.randomBytes(8).toString("hex") }
function token() { return crypto.randomBytes(32).toString("hex") }
function hash(p, s = crypto.randomBytes(16).toString("hex")) { return { s, h: crypto.scryptSync(p, s, 64).toString("hex") } }
function check(p, o) { try { return crypto.timingSafeEqual(Buffer.from(crypto.scryptSync(p, o.s, 64).toString("hex"), "hex"), Buffer.from(o.h, "hex")) } catch { return false } }
function auth(req) { let t = (req.headers.authorization || "").replace(/^Bearer /, ""); return db.sessions[t] && db.users[db.sessions[t]] }
function clean(u) { return { username: u.username, displayName: u.displayName || u.username, avatarUrl: u.avatarUrl || null, createdAt: u.createdAt, keyRedeemed: !!u.keyRedeemed, redeemedKey: u.redeemedKey || null, keyCreatedAt: u.keyCreatedAt || null, keyExpiresAt: u.keyExpiresAt || null, inventory: u.inventory || [], stats: u.stats || { plinkoBest: 0, lockBest: 0, balance: 1000 }, cookieData: u.cookieData || { count: 0, perClick: 1 }, friends: u.friends || [], isKoolio: u.username.toLowerCase() === "koolio", isAdmin: db.admins.includes(u.username.toLowerCase()) } }
function active(u) { return u && u.keyRedeemed && (!u.keyExpiresAt || u.keyExpiresAt > Date.now()) }
function weights() { let luck = (db.luck.expiresAt > Date.now() ? Math.max(1, Number(db.luck.multiplier) || 1) : 1); return { luck, animals: ANIMALS } }
function roll() { let luck = weights().luck, arr = ANIMALS.map(a => [a, a.RNGWeight * Math.max(1, (a.Rarity === "Secret" ? luck : Math.sqrt(luck)))]), total = arr.reduce((s, x) => s + x[1], 0), r = Math.random() * total; for (const [a, w] of arr) { r -= w; if (r <= 0) return { ...a, id: id() } } return { ...ANIMALS[0], id: id() } }
function validName(s) { return typeof s === "string" && /^[A-Za-z0-9_]{3,20}$/.test(s) }

function route(req, res) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "OPTIONS") { res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" }); return res.end() }

  // Authentication
  if (u.pathname === "/api/register" && req.method === "POST") return body(req).then(b => { if (!validName(b.username) || typeof b.password !== "string" || b.password.length < 6) return json(res, 400, { error: "Invalid username or password" }); if (db.users[b.username]) return json(res, 409, { error: "Username already exists" }); let hp = hash(b.password), now = Date.now(); db.users[b.username] = { username: b.username, displayName: b.username, avatarUrl: "", password: hp, createdAt: now, keyRedeemed: false, inventory: [], stats: { plinkoBest: 0, lockBest: 0, balance: 1000 }, cookieData: { count: 0, perClick: 1 }, friends: [] }; let t = token(); db.sessions[t] = b.username; save(); json(res, 200, { token: t, user: clean(db.users[b.username]) }) })
  if (u.pathname === "/api/login" && req.method === "POST") return body(req).then(b => { let x = db.users[b.username]; if (!x || !check(b.password, x.password)) return json(res, 401, { error: "Invalid login" }); let t = token(); db.sessions[t] = x.username; save(); json(res, 200, { token: t, user: clean(x) }) })
  if (u.pathname === "/api/me" && req.method === "GET") { let user = auth(req); return user ? json(res, 200, { user: clean(user) }) : json(res, 401, { error: "Login required" }) }
  
  // Profile Management
  if (u.pathname === "/api/profile" && req.method === "POST") return body(req).then(b => {
    let user = auth(req); if (!user) return json(res, 401, { error: "Login required" });
    if (b.displayName) user.displayName = String(b.displayName).trim().slice(0, 30);
    if (b.avatarUrl) user.avatarUrl = String(b.avatarUrl).trim();
    if (b.newPassword && b.newPassword.length >= 6) user.password = hash(b.newPassword);
    save(); json(res, 200, { user: clean(user) });
  })

  // Online Players List
  if (u.pathname === "/api/users/online" && req.method === "GET") {
    let list = Object.values(db.users).map(x => ({ username: x.username, displayName: x.displayName || x.username, avatarUrl: x.avatarUrl || null }));
    return json(res, 200, list);
  }

  // Admin Give Item directly to user inventory
  if (u.pathname === "/api/admin/give" && req.method === "POST") return body(req).then(b => {
    let user = auth(req);
    if (!user || !db.admins.includes(user.username.toLowerCase())) return json(res, 403, { error: "Admin permissions required" });
    let target = db.users[b.username];
    if (!target) return json(res, 404, { error: "Target user not found" });
    let animal = ANIMALS.find(a => a.Name.toLowerCase() === String(b.brainrotName).trim().toLowerCase());
    if (!animal) return json(res, 404, { error: "Brainrot not found" });
    target.inventory = target.inventory || [];
    let item = { ...animal, id: id() };
    target.inventory.push(item);
    save(); json(res, 200, { ok: true, given: item, target: target.username });
  })

  // Admin Luck Activation
  if (u.pathname === "/api/admin/luck" && req.method === "POST") return body(req).then(b => {
    let multiplier = Math.max(1, Number(b.multiplier) || 1), seconds = Math.max(1, Number(b.seconds) || 1);
    db.luck = { multiplier, expiresAt: Date.now() + seconds * 1000 };
    db.messages.push({ id: id(), username: "SYSTEM", text: `⚡ GLOBAL LUCK EVENT: ${multiplier}x Luck active for ${seconds} seconds!`, time: Date.now() });
    save(); json(res, 200, { ok: true, luck: db.luck });
  })

  // Admin Announcement (Prepend Display Name)
  if (u.pathname === "/api/admin/announcement" && req.method === "POST") return body(req).then(b => {
    let user = auth(req);
    let namePrefix = user ? (user.displayName || user.username) : "Koolio";
    let text = String(b.text || "").trim().slice(0, 200);
    db.announcement = text ? { text: `${namePrefix}: ${text}`, time: Date.now() } : null;
    save(); json(res, 200, { ok: true, announcement: db.announcement });
  })

  // Manage Permanent Admins
  if (u.pathname === "/api/admin/manage-admin" && req.method === "POST") return body(req).then(b => {
    let user = auth(req);
    if (!user || user.username.toLowerCase() !== "koolio") return json(res, 403, { error: "Only koolio can manage admin roles" });
    let target = String(b.username || "").trim().toLowerCase();
    if (!target) return json(res, 400, { error: "Username required" });

    if (b.action === "add") {
      if (!db.admins.includes(target)) db.admins.push(target);
    } else if (b.action === "remove") {
      if (target === "koolio") return json(res, 400, { error: "Cannot remove primary admin koolio" });
      db.admins = db.admins.filter(a => a !== target);
    }
    save(); json(res, 200, { ok: true, admins: db.admins });
  })

  // Trade System
  if (u.pathname === "/api/trade/request" && req.method === "POST") return body(req).then(b => {
    let sender = auth(req); if (!sender) return json(res, 401, { error: "Login required" });
    let target = db.users[b.targetUser];
    if (!target) return json(res, 404, { error: "User not found" });
    let tradeId = id();
    db.trades[tradeId] = { id: tradeId, a: sender.username, senderAvatar: sender.avatarUrl, b: target.username, status: "pending", time: Date.now() };
    save(); return json(res, 200, { ok: true, tradeId });
  })
  if (u.pathname === "/api/trade/pending" && req.method === "GET") {
    let user = auth(req); if (!user) return json(res, 401, { error: "Login required" });
    let incoming = Object.values(db.trades).find(t => t.b.toLowerCase() === user.username.toLowerCase() && t.status === "pending");
    return json(res, 200, { trade: incoming || null });
  }
  if (u.pathname === "/api/trade/action" && req.method === "POST") return body(req).then(b => {
    let user = auth(req); if (!user) return json(res, 401, { error: "Login required" });
    let trade = db.trades[b.tradeId];
    if (!trade) return json(res, 404, { error: "Trade not found" });
    if (b.action === "decline") trade.status = "declined";
    if (b.action === "accept_request") trade.status = "active";
    save(); return json(res, 200, { ok: true, trade });
  })

  // Games & RNG
  if (u.pathname === "/api/animals" && req.method === "GET") return json(res, 200, weights())
  if (u.pathname === "/api/roll" && req.method === "POST") { let user = auth(req); if (!active(user)) return json(res, 403, { error: "Active key required" }); let item = roll(); user.inventory.push(item); save(); return json(res, 200, { item, user: clean(user) }) }
  
  if (u.pathname === "/api/game/plinko" && req.method === "POST") return body(req).then(b => {
    let user = auth(req); if (!user) return json(res, 401, { error: "Login required" });
    user.stats = user.stats || { balance: 1000 };
    let bet = Math.max(1, Number(b.bet) || 0);
    if ((user.stats.balance || 0) < bet) return json(res, 400, { error: "Insufficient balance" });
    user.stats.balance -= bet;
    let multipliers = [0.2, 0.5, 1.0, 1.5, 3.0, 10.0];
    let mult = multipliers[Math.floor(Math.random() * multipliers.length)];
    let win = Math.floor(bet * mult);
    user.stats.balance += win;
    save(); json(res, 200, { bet, mult, win, balance: user.stats.balance });
  })

  // Tic-Tac-Toe Multiplayer
  if (u.pathname === "/api/game/tictactoe/create" && req.method === "POST") {
    let user = auth(req); if (!user) return json(res, 401, { error: "Login required" });
    let gameId = "TTT-" + id();
    db.tictactoe[gameId] = { id: gameId, playerX: user.username, playerO: null, board: Array(9).fill(null), turn: "X", winner: null };
    save(); return json(res, 200, { game: db.tictactoe[gameId] });
  }
  if (u.pathname === "/api/game/tictactoe/move" && req.method === "POST") return body(req).then(b => {
    let user = auth(req), g = db.tictactoe[b.gameId];
    if (!user || !g) return json(res, 404, { error: "Game not found" });
    if (!g.playerO && g.playerX !== user.username) { g.playerO = user.username; }
    let symbol = g.playerX === user.username ? "X" : (g.playerO === user.username ? "O" : null);
    if (!symbol || g.turn !== symbol || g.board[b.index] || g.winner) return json(res, 400, { error: "Invalid move" });
    g.board[b.index] = symbol;
    g.turn = symbol === "X" ? "O" : "X";
    save(); json(res, 200, { game: g });
  })

  // Serve Bookmarklet
  if (u.pathname === "/bookmarklet.js") {
    res.writeHead(200, { "Content-Type": "application/javascript", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" });
    return res.end(fs.readFileSync(path.join(PUBLIC, "bookmarklet.js"), "utf8"))
  }

  res.writeHead(200, { "Content-Type": "text/plain" }); res.end("RNG Engine Online");
}

http.createServer((q, s) => Promise.resolve(route(q, s)).catch(e => json(s, 500, { error: e.message }))).listen(PORT, () => console.log("Listening on " + PORT));
