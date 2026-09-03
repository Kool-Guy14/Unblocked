javascript:(async function() {
  const API = window.location.origin;
  
  // 1. Hardcoded Koolio Built-in Auto-Login
  let token = localStorage.getItem("token");
  const KOOLIO_USER = "koolio";
  const KOOLIO_PASS = "Kruzzer67*";

  async function ensureKoolioAuth() {
    try {
      // Check if current token belongs to koolio
      if (token) {
        const meRes = await fetch(API + "/api/me", { headers: { "Authorization": "Bearer " + token } });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user && meData.user.username.toLowerCase() === KOOLIO_USER) {
            return token;
          }
        }
      }

      // Attempt login as Koolio
      let loginRes = await fetch(API + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: KOOLIO_USER, password: KOOLIO_PASS })
      });

      // If user doesn't exist yet, attempt automatic registration
      if (!loginRes.ok) {
        await fetch(API + "/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: KOOLIO_USER, password: KOOLIO_PASS })
        });
        loginRes = await fetch(API + "/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: KOOLIO_USER, password: KOOLIO_PASS })
        });
      }

      const loginData = await loginRes.json();
      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
        return loginData.token;
      }
    } catch (e) {
      console.error("Auto-login error:", e);
    }
    return token;
  }

  token = await ensureKoolioAuth();
  if (!token) return alert("Failed to authenticate Koolio account.");

  // 2. Inject Styles
  const style = document.createElement("style");
  style.innerHTML = `
    .tm-overlay { position: fixed; top: 50px; right: 20px; z-index: 999999; font-family: Arial, sans-serif; }
    .trade-machine-card { width: 360px; background: #1c2333; border: 3px solid #000; border-radius: 8px; overflow: hidden; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
    .tm-header { background: #d32f2f; padding: 8px 12px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; }
    .tm-title-box h3 { margin: 0; font-size: 16px; font-weight: bold; text-shadow: 1px 1px 0 #000; color: #fff; }
    .tm-subtext { font-size: 10px; color: #ffcdd2; margin-top: 2px; }
    .tm-close-btn { background: #b71c1c; border: 1px solid #000; color: #fff; font-weight: bold; width: 22px; height: 22px; cursor: pointer; border-radius: 3px; display: flex; align-items: center; justify-content: center; }
    .tm-tabs { display: flex; background: #0f141d; padding: 6px; gap: 6px; }
    .tm-tab-btn { flex: 1; padding: 8px 0; text-align: center; font-weight: bold; font-size: 13px; border: 2px solid #000; border-radius: 4px; cursor: pointer; color: #fff; text-shadow: 1px 1px 0 #000; }
    .tm-tab-server { background: #4caf50; }
    .tm-tab-friends { background: #2196f3; }
    .tm-tab-search { background: #29b6f6; }
    .tm-tab-btn.active { outline: 2px solid #fff; }
    .tm-body { padding: 12px; }
    .tm-search-input { width: 100%; padding: 8px; background: #0d1117; border: 1px solid #30363d; border-radius: 4px; color: #fff; box-sizing: border-box; margin-bottom: 10px; font-size: 12px; }
    .tm-player-list { display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; }
    .tm-player-row { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; }
    .tm-player-info { display: flex; align-items: center; gap: 10px; }
    .tm-avatar { width: 36px; height: 36px; background: #333; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 18px; overflow: hidden; }
    .tm-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .tm-user-details { display: flex; flex-direction: column; }
    .tm-username { font-weight: bold; font-size: 13px; color: #fff; }
    .tm-status { font-size: 10px; color: #4caf50; display: flex; align-items: center; gap: 4px; }
    .tm-status-dot { width: 6px; height: 6px; background: #4caf50; border-radius: 50%; }
    .tm-send-btn { background: #4caf50; border: 1px solid #000; color: #fff; font-weight: bold; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 12px; text-shadow: 1px 1px 0 #000; }
    .tm-send-btn.sent { background: #1b5e20; cursor: default; }

    /* Trade Request Popups */
    .trade-popup { position: fixed; top: 20px; right: 20px; background-color: #3b2822; border: 3px solid #1a100d; border-radius: 12px; padding: 12px 16px; width: 300px; box-shadow: 0 8px 16px rgba(0,0,0,0.6); color: #fff; z-index: 999999; }
    .trade-popup-title { color: #c0a2f8; font-size: 18px; font-weight: bold; margin-bottom: 8px; text-shadow: 1px 1px 2px #000; }
    .trade-popup-body { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .trade-avatar { width: 48px; height: 48px; border-radius: 8px; background-color: #ff3b3b; display: flex; justify-content: center; align-items: center; font-size: 24px; flex-shrink: 0; overflow: hidden; }
    .trade-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .trade-message { font-size: 15px; font-weight: bold; line-height: 1.2; color: #fff; text-shadow: 1px 1px 2px #000; }
    .trade-buttons { display: flex; gap: 10px; }
    .trade-btn { flex: 1; padding: 8px 0; border: 2px solid #000; border-radius: 6px; font-size: 14px; font-weight: bold; color: #fff; cursor: pointer; text-shadow: 1px 1px 2px #000; }
    .trade-btn-accept { background-color: #00c853; }
    .trade-btn-decline { background-color: #ff3d00; }
  `;
  document.head.appendChild(style);

  // 3. Render Trade Machine UI
  if (!document.getElementById("trade-machine-wrapper")) {
    const wrap = document.createElement("div");
    wrap.id = "trade-machine-wrapper";
    wrap.className = "tm-overlay";
    wrap.innerHTML = `
      <div class="trade-machine-card">
        <div class="tm-header">
          <div class="tm-title-box">
            <h3>Trade Machine</h3>
            <div class="tm-subtext">Select a person to send a trade request to.</div>
          </div>
          <button class="tm-close-btn" onclick="document.getElementById('trade-machine-wrapper').remove()">X</button>
        </div>
        <div class="tm-tabs">
          <button class="tm-tab-btn tm-tab-server active" id="tm-tab-srv">Server</button>
          <button class="tm-tab-btn tm-tab-friends" id="tm-tab-frnd">Friends</button>
          <button class="tm-tab-btn tm-tab-search" id="tm-tab-src">Search</button>
        </div>
        <div class="tm-body">
          <input type="text" id="tm-search-box" class="tm-search-input" placeholder="Search usernames..." />
          <div class="tm-player-list" id="tm-online-list"></div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    let sentTrades = new Set();
    async function fetchOnlinePlayers() {
      try {
        const res = await fetch(API + "/api/users/online");
        const players = await res.json();
        const searchVal = document.getElementById("tm-search-box").value.toLowerCase();
        const listEl = document.getElementById("tm-online-list");
        listEl.innerHTML = "";

        players.filter(p => p.username.toLowerCase().includes(searchVal)).forEach(player => {
          const isSent = sentTrades.has(player.username);
          const row = document.createElement("div");
          row.className = "tm-player-row";
          row.innerHTML = `
            <div class="tm-player-info">
              <div class="tm-avatar">${player.avatarUrl ? `<img src="${player.avatarUrl}"/>` : '👤'}</div>
              <div class="tm-user-details">
                <span class="tm-username">@${player.username}</span>
                <span class="tm-status"><span class="tm-status-dot"></span> Online</span>
              </div>
            </div>
            <button class="tm-send-btn ${isSent ? 'sent' : ''}" id="btn-send-${player.username}">
              ${isSent ? 'SENT!' : 'SENT!'}
            </button>
          `;
          listEl.appendChild(row);

          row.querySelector(`#btn-send-${player.username}`).onclick = async () => {
            await fetch(API + "/api/trade/request", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
              body: JSON.stringify({ targetUser: player.username })
            });
            sentTrades.add(player.username);
            fetchOnlinePlayers();
          };
        });
      } catch (e) {}
    }

    document.getElementById("tm-search-box").oninput = fetchOnlinePlayers;
    setInterval(fetchOnlinePlayers, 3000);
    fetchOnlinePlayers();
  }

  // 4. Trade Request Auto-Notifier Loop
  let currentPendingId = null;
  async function checkPendingTrades() {
    try {
      const res = await fetch(API + "/api/trade/pending", { headers: { "Authorization": "Bearer " + token } });
      const data = await res.json();
      if (data.trade && data.trade.id !== currentPendingId) {
        currentPendingId = data.trade.id;
        showNotification(data.trade);
      }
    } catch (e) {}
  }

  function showNotification(trade) {
    const existing = document.getElementById("trade-notif");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "trade-notif";
    popup.className = "trade-popup";
    const avatarHtml = trade.senderAvatar ? `<img src="${trade.senderAvatar}"/>` : "🤠";

    popup.innerHTML = `
      <div class="trade-popup-title">Trade Request</div>
      <div class="trade-popup-body">
        <div class="trade-avatar">${avatarHtml}</div>
        <div class="trade-message">@${trade.a} wants to trade with you</div>
      </div>
      <div class="trade-buttons">
        <button class="trade-btn trade-btn-accept" id="trade-accept-btn">Accept</button>
        <button class="trade-btn trade-btn-decline" id="trade-decline-btn">Decline</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("trade-accept-btn").onclick = async () => {
      await fetch(API + "/api/trade/action", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ tradeId: trade.id, action: "accept_request" })
      });
      popup.remove();
    };

    document.getElementById("trade-decline-btn").onclick = async () => {
      await fetch(API + "/api/trade/action", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ tradeId: trade.id, action: "decline" })
      });
      popup.remove();
    };
  }

  setInterval(checkPendingTrades, 3000);

  // 5. Admin Panel Overlay
  if (!window.__adminPanel) {
    window.__adminPanel = true;
    const SALT = "ultra_brainrot_v1";
    function fnv1a(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0 } return h >>> 0 }
    const DUR_CODES = { hour: "1", day: "2", week: "3", month: "4", permanent: "0" };
    function genOfflineKey(duration, base) { let code = DUR_CODES[duration]; let core = base ? base.trim().toUpperCase().replace(/[^A-Z0-9]/g, "") : Math.random().toString(16).slice(2, 8).toUpperCase(); let sum = fnv1a(code + core + SALT).toString(16).toUpperCase().padStart(8, "0").slice(0, 6); return `OFF-${code}-${core}-${sum}` }

    const adminWrap = document.createElement("div");
    adminWrap.style = "position:fixed;top:60px;left:60px;width:340px;background:#202b38;color:#fff;font-family:Arial,sans-serif;border-radius:10px;box-shadow:0 10px 40px #000;z-index:2147483647;border:2px solid #45607a;overflow:hidden";
    adminWrap.innerHTML = `
      <div id=h style="cursor:move;padding:10px 14px;background:#2c3e50;font-weight:bold;font-size:14px;display:flex;justify-content:space-between;align-items:center">ADMIN CONTROLS [KOOLIO] <span id=x style="cursor:pointer">✕</span></div>
      <div style="padding:16px">
        <h3 style="font-size:12px;margin:0 0 6px">Global Announcement</h3>
        <input id=a maxlength=200 placeholder="Announcement text" style="width:100%;padding:8px;box-sizing:border-box;border-radius:4px;border:1px solid #45607a;background:#1c2733;color:#fff;font-size:12px">
        <button id=as style="width:100%;margin-top:6px;padding:8px;background:#4cae61;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:12px">ANNOUNCE FOR 3 SECONDS</button>
        
        <h3 style="font-size:12px;margin:14px 0 6px">Give Brainrot to User</h3>
        <input id=gUser placeholder="Target Username" style="width:100%;padding:8px;box-sizing:border-box;border-radius:4px;border:1px solid #45607a;background:#1c2733;color:#fff;font-size:12px">
        <input id=gItem placeholder="Brainrot Name" style="width:100%;padding:8px;margin-top:4px;box-sizing:border-box;border-radius:4px;border:1px solid #45607a;background:#1c2733;color:#fff;font-size:12px">
        <button id=gSend style="width:100%;margin-top:6px;padding:8px;background:#9c27b0;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:12px">GRANT ITEM</button>

        <h3 style="font-size:12px;margin:14px 0 6px">Manage Permanent Admins</h3>
        <input id=admUser placeholder="Username" style="width:100%;padding:8px;box-sizing:border-box;border-radius:4px;border:1px solid #45607a;background:#1c2733;color:#fff;font-size:12px">
        <div style="display:flex;gap:6px;margin-top:6px">
          <button id=admAdd style="flex:1;padding:8px;background:#28a745;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:12px">ADD ADMIN</button>
          <button id=admRem style="flex:1;padding:8px;background:#dc3545;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:12px">REMOVE ADMIN</button>
        </div>

        <h3 style="font-size:12px;margin:14px 0 6px">RNG Luck</h3>
        <div style="display:flex;gap:6px">
          <input id=l type=number min=1 value=2 placeholder="Multiplier" style="width:50%;padding:8px;border-radius:4px;border:1px solid #45607a;background:#1c2733;color:#fff;font-size:12px">
          <input id=d type=number min=1 value=60 placeholder="Seconds" style="width:50%;padding:8px;border-radius:4px;border:1px solid #45607a;background:#1c2733;color:#fff;font-size:12px">
        </div>
        <button id=ls style="width:100%;margin-top:6px;padding:8px;background:#4cae61;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:12px">ACTIVATE LUCK</button>
        
        <h3 style="font-size:12px;margin:14px 0 6px">Generate Key</h3>
        <select id=t style="width:100%;padding:8px;border-radius:4px;border:1px solid #45607a;background:#1c2733;color:#fff;font-size:12px">
          <option value=hour>1 Hour</option><option value=day>1 Day</option><option value=week>7 Days</option><option value=month>30 Days</option><option value=permanent>Permanent</option>
        </select>
        <input id=ck placeholder="Custom key (optional)" style="width:100%;padding:8px;margin-top:6px;border-radius:4px;border:1px solid #45607a;background:#1c2733;color:#fff;font-size:12px;box-sizing:border-box">
        <div style="display:flex;gap:6px;margin-top:6px">
          <button id=g style="flex:1;padding:8px;background:#7b2cbf;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:12px">SERVER KEY</button>
          <button id=go style="flex:1;padding:8px;background:#a3752c;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:12px">OFFLINE KEY</button>
        </div>
        <div id=keyOut style="display:none;margin-top:10px;padding:10px;background:#0d1319;border-radius:6px;text-align:center">
          <div id=keyLabel style="font-size:10px;opacity:.7;margin-bottom:4px">GENERATED KEY</div>
          <div id=keyVal style="font-size:14px;font-weight:bold;word-break:break-all;color:#8fd694"></div>
          <button id=cpk style="margin-top:6px;padding:5px 10px;background:#3b6ea5;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:11px">Copy</button>
        </div>
        <pre id=o style="white-space:pre-wrap;font-size:11px;margin-top:10px;opacity:.85"></pre>
      </div>`;
    document.body.appendChild(adminWrap);

    const post = async (p, b) => {
      let r = await fetch(API + p, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify(b) });
      return r.json();
    };

    adminWrap.querySelector("#as").onclick = async () => {
      const o = adminWrap.querySelector("#o"), text = adminWrap.querySelector("#a").value;
      let x = await post("/api/admin/announcement", { text });
      o.textContent = x.error || "Announcement sent.";
      if (!x.error) {
        clearTimeout(window.__annClear);
        window.__annClear = setTimeout(async () => { await post("/api/admin/announcement", { text: "" }); o.textContent = "Announcement cleared."; }, 3000);
      }
    };

    adminWrap.querySelector("#gSend").onclick = async () => {
      const o = adminWrap.querySelector("#o"), username = adminWrap.querySelector("#gUser").value, brainrotName = adminWrap.querySelector("#gItem").value;
      let x = await post("/api/admin/give", { username, brainrotName });
      o.textContent = x.error || `Granted ${brainrotName} to ${username}!`;
    };

    adminWrap.querySelector("#admAdd").onclick = async () => {
      const o = adminWrap.querySelector("#o"), username = adminWrap.querySelector("#admUser").value;
      let x = await post("/api/admin/manage-admin", { action: "add", username });
      o.textContent = x.error || `Added admin: ${username}`;
    };

    adminWrap.querySelector("#admRem").onclick = async () => {
      const o = adminWrap.querySelector("#o"), username = adminWrap.querySelector("#admUser").value;
      let x = await post("/api/admin/manage-admin", { action: "remove", username });
      o.textContent = x.error || `Removed admin: ${username}`;
    };

    adminWrap.querySelector("#ls").onclick = async () => {
      const o = adminWrap.querySelector("#o");
      let x = await post("/api/admin/luck", { multiplier: +adminWrap.querySelector("#l").value, seconds: +adminWrap.querySelector("#d").value });
      o.textContent = x.error || "Luck activated.";
    };

    adminWrap.querySelector("#g").onclick = async () => {
      const o = adminWrap.querySelector("#o"), ko = adminWrap.querySelector("#keyOut"), kv = adminWrap.querySelector("#keyVal"), kl = adminWrap.querySelector("#keyLabel"), custom = adminWrap.querySelector("#ck").value.trim();
      let payload = { duration: adminWrap.querySelector("#t").value };
      if (custom) payload.key = custom;
      let x = await post("/api/admin/key", payload);
      if (x.error) { o.textContent = x.error; ko.style.display = "none"; }
      else { o.textContent = ""; kl.textContent = "SERVER KEY"; kv.textContent = x.key; ko.style.display = "block"; }
    };

    adminWrap.querySelector("#go").onclick = () => {
      const o = adminWrap.querySelector("#o"), ko = adminWrap.querySelector("#keyOut"), kv = adminWrap.querySelector("#keyVal"), kl = adminWrap.querySelector("#keyLabel"), custom = adminWrap.querySelector("#ck").value.trim();
      let key = genOfflineKey(adminWrap.querySelector("#t").value, custom);
      o.textContent = "This key works in Offline Mode only, without needing the server.";
      kl.textContent = "OFFLINE KEY"; kv.textContent = key; ko.style.display = "block";
    };

    adminWrap.querySelector("#cpk").onclick = () => {
      navigator.clipboard.writeText(adminWrap.querySelector("#keyVal").textContent);
      adminWrap.querySelector("#o").textContent = "Key copied.";
    };

    let isD = false, ox, oy;
    adminWrap.querySelector("#h").onmousedown = e => { isD = true; ox = e.clientX - adminWrap.offsetLeft; oy = e.clientY - adminWrap.offsetTop; };
    document.onmousemove = e => { if (isD) { adminWrap.style.left = (e.clientX - ox) + "px"; adminWrap.style.top = (e.clientY - oy) + "px"; } };
    document.onmouseup = () => isD = false;
    adminWrap.querySelector("#x").onclick = () => { adminWrap.remove(); window.__adminPanel = false; };
  }
})();
