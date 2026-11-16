// Ferizaj Stays server: serves the site, syncs calendars with Airbnb, stores booking requests.
// Run: node server.js     (Node 18+; no packages needed)
//
//   GET  /                          the website
//   GET  /api/availability/:id      blocked date ranges (Airbnb + bookings made on this site)
//   POST /api/requests              a guest's booking request
//   GET  /calendar/:id.ics          this site's bookings as a calendar Airbnb can import
//   GET  /admin/                    host dashboard (password from config.json "adminPassword")
//   GET  /admin/api/bookings        all requests + sync status
//   POST /admin/api/bookings/:id    { status: "confirmed" | "declined" | "pending" }
//   POST /admin/api/blocks          { listing, start, end, note } — block dates yourself

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "config.json"), "utf8"));
const PORT = process.env.PORT || CONFIG.port || 8080;
// On the host, DATA_DIR points at a persistent disk so bookings survive redeploys.
const BOOKINGS_FILE = path.join(process.env.DATA_DIR || path.join(ROOT, "data"), "bookings.json");
const LISTING_IDS = Object.keys(CONFIG.listings);

// Secrets come from environment variables (locally: the .env file), never from config.json.
//   ADMIN_USERS="arian:password1,trim:password2"     dashboard logins, one per host/co-host
//   AIRBNB_ICAL_CENTRE_ONE_BEDROOM="https://www.airbnb.com/calendar/ical/....ics"
const ADMIN_USERS = new Map((process.env.ADMIN_USERS || "").split(",").map(s => s.trim()).filter(Boolean)
  .map(s => { const i = s.indexOf(":"); return [s.slice(0, i).trim().toLowerCase(), s.slice(i + 1)]; })
  .filter(([u, p]) => u && p));
const icalEnv = id => process.env["AIRBNB_ICAL_" + id.toUpperCase().replace(/-/g, "_")];
for (const id of LISTING_IDS) CONFIG.listings[id].airbnbIcal = icalEnv(id) || CONFIG.listings[id].airbnbIcal || "";
if (!ADMIN_USERS.size) console.warn("ADMIN_USERS is not set — the host dashboard is disabled.");

/* ---------- Telegram alerts for new requests ----------
   TELEGRAM_BOT_TOKEN  from @BotFather
   TELEGRAM_CHAT_ID    the hosts' group (or a person) the bot posts to
   PUBLIC_URL          optional; defaults to Railway's public domain, used for the dashboard link */
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || "";
const PUBLIC_URL = process.env.PUBLIC_URL
  || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : `http://localhost:${PORT}`);
const tgEsc = s => String(s ?? "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

async function telegram(html) {
  if (!TG_TOKEN || !TG_CHAT) return { ok: false, error: "Telegram is not set up (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)" };
  try {
    const r = await fetch(`${process.env.TELEGRAM_API || "https://api.telegram.org"}/bot${TG_TOKEN}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    const out = await r.json().catch(() => ({}));
    if (!out.ok) console.error(`[telegram] failed: ${out.description || r.status}`);
    return { ok: !!out.ok, error: out.ok ? null : (out.description || `HTTP ${r.status}`) };
  } catch (e) {
    console.error(`[telegram] failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

// Lists the groups/chats the bot has seen recently, so hosts can find the TELEGRAM_CHAT_ID.
async function telegramChats() {
  if (!TG_TOKEN) return { ok: false, error: "Add TELEGRAM_BOT_TOKEN first" };
  try {
    const r = await fetch(`${process.env.TELEGRAM_API || "https://api.telegram.org"}/bot${TG_TOKEN}/getUpdates`);
    const out = await r.json().catch(() => ({}));
    if (!out.ok) return { ok: false, error: out.description || `HTTP ${r.status}` };
    const chats = new Map();
    for (const u of out.result || []) {
      const c = (u.my_chat_member || u.message || u.channel_post || u.edited_message || {}).chat;
      if (c) chats.set(c.id, { id: String(c.id), title: c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || "", type: c.type });
    }
    return { ok: true, chats: [...chats.values()] };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function requestAlert(b) {
  const name = CONFIG.listings[b.listing]?.name || b.listing;
  const nights = Math.round((Date.parse(b.end) - Date.parse(b.start)) / 864e5);
  const d = s => new Date(s + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const flag = { sq: "🇦🇱 Shqip", de: "🇩🇪 Deutsch", en: "🇬🇧 English" }[b.lang] || "";
  const wa = b.phone ? b.phone.replace(/\D/g, "").replace(/^00/, "").replace(/^0/, "383") : "";
  return [
    `🔔 <b>New booking request — ${tgEsc(name)}</b>`,
    `📅 ${d(b.start)} → ${d(b.end)} (${nights} night${nights === 1 ? "" : "s"})`,
    `👤 ${tgEsc(b.name)} · ${b.guests} guest${b.guests === 1 ? "" : "s"}${flag ? " · " + flag : ""}`,
    b.phone ? `📞 ${tgEsc(b.phone)}${wa ? ` · <a href="https://wa.me/${wa}">WhatsApp</a>` : ""}` : null,
    b.email ? `✉️ ${tgEsc(b.email)}` : null,
    b.quotedTotal ? `💶 €${b.quotedTotal} quoted` : null,
    b.message ? `💬 ${tgEsc(b.message)}` : null,
    ``,
    `👉 <a href="${PUBLIC_URL}/admin/">Accept or decline in the dashboard</a>`,
  ].filter(l => l !== null).join("\n");
}

/* ---------- bookings made on this site ---------- */
function loadBookings() {
  try { return JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf8")); } catch { return []; }
}
function saveBookings(list) {
  fs.mkdirSync(path.dirname(BOOKINGS_FILE), { recursive: true });
  const tmp = BOOKINGS_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, BOOKINGS_FILE);
}
// "pending" requests hold their dates too, so nobody books them on Airbnb while you decide.
// Set a booking's status to "declined" in data/bookings.json to free its dates.
const activeBookings = id => loadBookings().filter(b => b.listing === id && b.status !== "declined");

/* ---------- Airbnb calendar import ---------- */
const airbnbBlocks = {};   // listing id -> { ranges: [[start,end]], updated, error }

function parseIcal(text) {
  const lines = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").split(/\r?\n/);
  const ranges = []; let ev = null;
  const toIso = v => { const d = v.match(/(\d{4})(\d{2})(\d{2})/); return d ? `${d[1]}-${d[2]}-${d[3]}` : null; };
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") ev = {};
    else if (line === "END:VEVENT") { if (ev && ev.start && ev.end) ranges.push([ev.start, ev.end]); ev = null; }
    else if (ev && line.startsWith("DTSTART")) ev.start = toIso(line.split(":").pop());
    else if (ev && line.startsWith("DTEND")) ev.end = toIso(line.split(":").pop());
  }
  return ranges;
}

async function readCalendar(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src, { headers: { "User-Agent": "FerizajStays-CalendarSync/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }
  return fs.readFileSync(path.resolve(ROOT, src), "utf8");   // local file, for testing
}

async function syncAirbnb() {
  for (const id of LISTING_IDS) {
    const src = CONFIG.listings[id].airbnbIcal;
    if (!src) continue;
    try {
      const ranges = parseIcal(await readCalendar(src));
      airbnbBlocks[id] = { ranges, updated: new Date().toISOString(), error: null };
      console.log(`[sync] ${id}: ${ranges.length} blocked periods from Airbnb`);
    } catch (e) {
      // keep the last good copy so a temporary Airbnb outage doesn't open up booked dates
      airbnbBlocks[id] = { ...(airbnbBlocks[id] || { ranges: [] }), error: String(e.message || e) };
      console.error(`[sync] ${id}: failed (${e.message}) — keeping previous data`);
    }
  }
}

function blockedRanges(id) {
  return [
    ...(airbnbBlocks[id]?.ranges || []),
    ...activeBookings(id).map(b => [b.start, b.end]),
  ];
}

/* ---------- calendar export for Airbnb ---------- */
function exportIcal(id) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const d = s => s.replace(/-/g, "");
  const events = activeBookings(id).map(b => [
    "BEGIN:VEVENT",
    `UID:${b.id}@ferizajstays`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${d(b.start)}`,
    `DTEND;VALUE=DATE:${d(b.end)}`,
    "SUMMARY:Booked on Ferizaj Stays",
    "END:VEVENT",
  ].join("\r\n"));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ferizaj Stays//Calendar//EN", "CALSCALE:GREGORIAN",
    ...events, "END:VCALENDAR", ""].join("\r\n");
}

/* ---------- booking requests ---------- */
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const overlaps = (a1, a2, b1, b2) => a1 < b2 && b1 < a2;   // end dates are checkout days (exclusive)
const clip = (v, n) => String(v ?? "").trim().slice(0, n);

function checkDates(listing, start, end) {
  if (!LISTING_IDS.includes(listing)) return "Unknown apartment";
  if (!ISO.test(start) || !ISO.test(end) || start >= end) return "Invalid dates";
  if (start < new Date().toISOString().slice(0, 10)) return "Check-in is in the past";
  return null;
}

function createRequest(body) {
  const { listing, start, end } = body;
  const bad = checkDates(listing, start, end);
  if (bad) return [400, { error: bad }];
  const name = clip(body.name, 100), phone = clip(body.phone, 40), email = clip(body.email, 120);
  if (!name || (!phone && !email)) return [400, { error: "Name and a phone number or email are required" }];
  if (blockedRanges(listing).some(([s, e]) => overlaps(start, end, s, e)))
    return [409, { error: "Sorry, those dates were just booked. Please choose other dates." }];

  const booking = {
    id: crypto.randomUUID(), listing, start, end,
    guests: Math.max(1, Math.min(20, parseInt(body.guests) || 1)),
    name, phone, email, message: clip(body.message, 1000),
    quotedTotal: Number(body.total) || null,
    lang: ["sq", "de", "en"].includes(body.lang) ? body.lang : "en",
    source: "website", status: "pending", createdAt: new Date().toISOString(),
  };
  saveBookings([...loadBookings(), booking]);
  console.log(`[request] ${listing} ${start} → ${end} from ${name}`);
  telegram(requestAlert(booking));   // don't make the guest wait for Telegram
  return [201, { ok: true, id: booking.id }];
}

/* ---------- host dashboard ---------- */
const sha = s => crypto.createHash("sha256").update(String(s)).digest();
// returns the logged-in host's name, or null
function adminUser(req) {
  const h = req.headers.authorization || "";
  if (!h.startsWith("Basic ")) return null;
  const [user = "", pass = ""] = Buffer.from(h.slice(6), "base64").toString().split(/:(.*)/s);
  const expected = ADMIN_USERS.get(user.trim().toLowerCase());
  const ok = crypto.timingSafeEqual(sha(pass), sha(expected ?? crypto.randomUUID()));
  return expected !== undefined && ok ? user.trim().toLowerCase() : null;
}

function adminOverview(me) {
  return {
    me, telegram: TG_TOKEN && TG_CHAT ? "connected" : TG_TOKEN ? "needs-chat" : "off",
    listings: LISTING_IDS.map(id => ({
      id, name: CONFIG.listings[id].name || id,
      airbnbConnected: !!CONFIG.listings[id].airbnbIcal,
      syncedAt: airbnbBlocks[id]?.updated || null, syncError: airbnbBlocks[id]?.error || null,
      airbnbBlocked: airbnbBlocks[id]?.ranges || [],
    })),
    bookings: loadBookings().sort((a, b) => a.start.localeCompare(b.start)),
  };
}

function setStatus(id, status, by) {
  if (!["confirmed", "declined", "pending"].includes(status)) return [400, { error: "Invalid status" }];
  const list = loadBookings();
  const b = list.find(x => x.id === id);
  if (!b) return [404, { error: "Booking not found" }];
  if (b.status === "declined" && status !== "declined") {
    // re-opening a declined request: make sure the dates are still free
    const clash = blockedRanges(b.listing).some(([s, e]) => overlaps(b.start, b.end, s, e));
    if (clash) return [409, { error: "Those dates have been taken since. Can't reopen this request." }];
  }
  b.status = status; b.updatedAt = new Date().toISOString(); b.updatedBy = by;
  saveBookings(list);
  console.log(`[admin] ${by}: ${b.listing} ${b.start} → ${b.end}: ${status}`);
  return [200, { ok: true, booking: b }];
}

function addBlock(body, by) {
  const { listing, start, end } = body;
  const bad = checkDates(listing, start, end);
  if (bad) return [400, { error: bad }];
  if (blockedRanges(listing).some(([s, e]) => overlaps(start, end, s, e)))
    return [409, { error: "Some of those dates are already booked." }];
  const block = {
    id: crypto.randomUUID(), listing, start, end, guests: 0,
    name: clip(body.note, 100) || "Blocked by host", phone: "", email: "", message: "",
    source: "manual", status: "confirmed", createdAt: new Date().toISOString(), updatedBy: by,
  };
  saveBookings([...loadBookings(), block]);
  return [201, { ok: true, booking: block }];
}

function readJson(req, cb) {
  let raw = "";
  req.on("data", c => { raw += c; if (raw.length > 10000) req.destroy(); });
  req.on("end", () => { let body; try { body = JSON.parse(raw); } catch { body = null; } cb(body); });
}

/* ---------- http ---------- */
function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let m;
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html"))
    return send(res, 200, fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), "text/html; charset=utf-8");

  if (req.method === "GET" && (m = url.pathname.match(/^\/api\/availability\/([\w-]+)$/))) {
    if (!LISTING_IDS.includes(m[1])) return send(res, 404, { error: "Unknown apartment" });
    return send(res, 200, { blocked: blockedRanges(m[1]), syncedAt: airbnbBlocks[m[1]]?.updated || null });
  }

  if (req.method === "GET" && (m = url.pathname.match(/^\/calendar\/([\w-]+)\.ics$/))) {
    if (!LISTING_IDS.includes(m[1])) return send(res, 404, "Not found", "text/plain");
    return send(res, 200, exportIcal(m[1]), "text/calendar; charset=utf-8");
  }

  if (req.method === "POST" && url.pathname === "/api/requests")
    return readJson(req, body => body ? send(res, ...createRequest(body)) : send(res, 400, { error: "Bad request" }));

  if (url.pathname === "/admin" ) { res.writeHead(301, { Location: "/admin/" }); return res.end(); }
  if (url.pathname.startsWith("/admin/")) {
    if (!ADMIN_USERS.size) return send(res, 503, "Set ADMIN_USERS to enable the host dashboard.", "text/plain");
    const me = adminUser(req);
    if (!me) {
      res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Ferizaj Stays host", charset="UTF-8"', "Content-Type": "text/plain" });
      return res.end("Login required");
    }
    if (req.method === "GET" && url.pathname === "/admin/")
      return send(res, 200, fs.readFileSync(path.join(ROOT, "admin.html"), "utf8"), "text/html; charset=utf-8");
    if (req.method === "GET" && url.pathname === "/admin/api/bookings") return send(res, 200, adminOverview(me));
    if (req.method === "POST" && (m = url.pathname.match(/^\/admin\/api\/bookings\/([\w-]+)$/)))
      return readJson(req, body => send(res, ...setStatus(m[1], body?.status, me)));
    if (req.method === "POST" && url.pathname === "/admin/api/blocks")
      return readJson(req, body => body ? send(res, ...addBlock(body, me)) : send(res, 400, { error: "Bad request" }));
    if (req.method === "GET" && url.pathname === "/admin/api/telegram-chats")
      return telegramChats().then(r => send(res, r.ok ? 200 : 502, r));
    if (req.method === "POST" && url.pathname === "/admin/api/telegram-test")
      return telegram(`✅ Test from the Ferizaj Stays dashboard (sent by ${tgEsc(me)}). New booking requests will appear here.`)
        .then(r => send(res, r.ok ? 200 : 502, r));
    if (req.method === "POST" && url.pathname === "/admin/api/sync")
      return syncAirbnb().then(() => send(res, 200, adminOverview(me)));
  }

  if (url.pathname === "/healthz") return send(res, 200, { ok: true });

  send(res, 404, "Not found", "text/plain");
}).listen(PORT, () => console.log(`Ferizaj Stays running on http://localhost:${PORT}`));

syncAirbnb();
setInterval(syncAirbnb, (CONFIG.refreshMinutes || 15) * 60 * 1000);
