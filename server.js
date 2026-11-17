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

/* ---------- pages for Google: one per language and apartment ---------- */
const SHARED = require("./shared.js");
const OG_LOCALE = { sq: "sq_AL", de: "de_DE", en: "en_GB" };
const clipText = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…";
const abs = u => u.startsWith("/") ? PUBLIC_URL + u : u;   // photos on our own site need the full address
const jsonLd = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

// language for "/": a choice the visitor made before, else their browser's languages, else English
function preferredLang(req) {
  const c = (req.headers.cookie || "").match(/(?:^|;\s*)lang=(sq|de|en)/);
  if (c) return c[1];
  for (const part of String(req.headers["accept-language"] || "").split(",")) {
    const l = part.trim().slice(0, 2).toLowerCase();
    if (SHARED.LANGS.includes(l)) return l;
  }
  return "en";
}

function renderPage(lang, p) {
  const { esc, T, LANGS, PROPERTIES } = SHARED;
  const H = SHARED.make(lang);
  const slug = p ? p.slug : "";
  const pageUrl = `${PUBLIC_URL}/${lang}/${slug}`;
  const title = p ? T[lang].aptTitle(p.name, H.tr(p.subtitle)) : H.t("pageTitle");
  const desc = p ? clipText(H.tr(p.description)[0], 158) : H.t("metaDesc");
  const image = abs((p || PROPERTIES[0]).photos[0]);
  const prices = PROPERTIES.map(x => x.price);
  const business = {
    "@type": "LodgingBusiness", name: "Ferizaj Stays", url: `${PUBLIC_URL}/${lang}/`,
    telephone: "+383 49 947 897", priceRange: `€${Math.min(...prices)}–€${Math.max(...prices)}`,
    image: PROPERTIES.map(x => abs(x.photos[0])),
    address: { "@type": "PostalAddress", addressLocality: "Ferizaj", addressCountry: "XK" },
    knowsLanguage: ["sq", "de", "en"],
  };
  const apartment = x => ({
    "@type": "Apartment", name: H.title(x), url: `${PUBLIC_URL}/${lang}/${x.slug}`,
    description: H.tr(x.description).join(" "), image: x.photos.map(abs),
    numberOfRooms: x.bedrooms + 1, numberOfBedrooms: x.bedrooms, numberOfBathroomsTotal: x.baths,
    occupancy: { "@type": "QuantitativeValue", maxValue: x.guests },
    amenityFeature: x.amenities.map(a => ({ "@type": "LocationFeatureSpecification", name: H.tr(SHARED.A[a]), value: true })),
    address: business.address,
  });
  const structured = p
    ? { "@context": "https://schema.org", ...apartment(p), containedInPlace: business }
    : { "@context": "https://schema.org", ...business, containsPlace: PROPERTIES.map(apartment) };

  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${pageUrl}">`,
    ...LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${PUBLIC_URL}/${l}/${slug}">`),
    `<link rel="alternate" hreflang="x-default" href="${p ? `${PUBLIC_URL}/en/${slug}` : `${PUBLIC_URL}/`}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Ferizaj Stays">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${pageUrl}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
    ...LANGS.filter(l => l !== lang).map(l => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`),
    `<meta name="twitter:card" content="summary_large_image">`,
    process.env.GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${esc(process.env.GOOGLE_SITE_VERIFICATION)}">` : "",
    jsonLd(structured),
  ].filter(Boolean).join("\n");

  let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8")
    .replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->/, head)
    .replace(/<html lang="\w+">/, `<html lang="${lang}">`)
    // page text in the right language, so it is readable without JavaScript
    .replace(/(data-i18n="(\w+)"[^>]*>)[^<]*</g, (_, open, key) => `${open}${esc(H.t(key))}<`)
    // maps stay hidden until the real apartment locations are in (MAPS_ON in shared.js)
    .replace(/\n\s*<div class="mapcol">.*<\/div><\/div>/, m => SHARED.MAPS_ON ? m : "")
    .replace('<div class="split">', SHARED.MAPS_ON ? '<div class="split">' : '<div class="split nomap">')
    .replace('<div class="grid" id="grid"></div>', `<div class="grid" id="grid">${PROPERTIES.map(H.cardHTML).join("")}</div>`)
    .replace(/(<a data-lang="(\w+)" lang="\w+" hreflang="\w+") href="[^"]*">/g,
      (_, open, l) => `${open} href="/${l}/${slug}"${l === lang ? ' class="on"' : ""}>`)
    .replace('<a class="back" id="back" href="/"', `<a class="back" id="back" href="/${lang}/"`)
    .replace(/<a class="logo" href="\/">/g, `<a class="logo" href="/${lang}/">`);
  if (p) html = html
    // one main heading per page: on apartment pages that's the apartment's name
    .replace(/<h1 data-i18n="heroTitle">([^<]*)<\/h1>/, '<div class="hero-title" data-i18n="heroTitle">$1</div>')
    .replace('<header id="top">', '<header id="top" class="solid">')
    .replace('<div class="overlay" id="detail">', '<div class="overlay open" id="detail">')
    .replace('<div class="wrap detail" id="detailBody"></div>', `<div class="wrap detail" id="detailBody">${H.detailHTML(p)}</div>`)
    .replace("<body>", '<body style="overflow:hidden">');
  return html;
}

function sitemap() {
  const { LANGS, PROPERTIES } = SHARED;
  const pages = ["", ...PROPERTIES.map(p => p.slug)];
  const urls = pages.flatMap(slug => LANGS.map(lang => [
    `<url><loc>${PUBLIC_URL}/${lang}/${slug}</loc>`,
    ...LANGS.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${PUBLIC_URL}/${l}/${slug}"/>`),
    `<changefreq>weekly</changefreq><priority>${slug ? "0.8" : "1.0"}</priority></url>`,
  ].join("")));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

/* ---------- http ---------- */
function send(res, status, body, type = "application/json; charset=utf-8", headers = {}) {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", ...headers });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}
const redirect = (res, status, to, headers = {}) => { res.writeHead(status, { Location: to, ...headers }); res.end(); };
const HTML = "text/html; charset=utf-8";
const PAGE_CACHE = { "Cache-Control": "public, max-age=300" };

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let m;
  if (req.method === "GET" || req.method === "HEAD") {
    // "/" sends visitors to their language; old ?lang= links keep working
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const q = url.searchParams.get("lang");
      if (SHARED.LANGS.includes(q)) return redirect(res, 301, `/${q}/`);
      return redirect(res, 302, `/${preferredLang(req)}/`, { Vary: "Accept-Language, Cookie", "Cache-Control": "no-store" });
    }
    if ((m = url.pathname.match(/^\/(sq|de|en)$/))) return redirect(res, 301, `/${m[1]}/`);
    if ((m = url.pathname.match(/^\/(sq|de|en)\/$/))) return send(res, 200, renderPage(m[1]), HTML, PAGE_CACHE);
    if ((m = url.pathname.match(/^\/(sq|de|en)\/([\w-]+)\/?$/))) {
      const p = SHARED.bySlug(m[2]);
      if (p) return url.pathname.endsWith("/") ? redirect(res, 301, `/${m[1]}/${p.slug}`) : send(res, 200, renderPage(m[1], p), HTML, PAGE_CACHE);
    }
    // our own photos (resized copies), cached by browsers for 30 days
    if ((m = url.pathname.match(/^\/photos\/([a-z-]+)\/(\d{2}(?:-sm)?\.jpg)$/))) {
      const file = path.join(ROOT, "photos", m[1], m[2]);
      if (fs.existsSync(file)) {
        res.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=2592000" });
        return fs.createReadStream(file).pipe(res);
      }
    }
    if (url.pathname === "/shared.js")
      return send(res, 200, fs.readFileSync(path.join(ROOT, "shared.js"), "utf8"), "text/javascript; charset=utf-8", PAGE_CACHE);
    if (url.pathname === "/sitemap.xml") return send(res, 200, sitemap(), "application/xml; charset=utf-8", PAGE_CACHE);
    if (url.pathname === "/robots.txt")
      return send(res, 200, `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${PUBLIC_URL}/sitemap.xml\n`, "text/plain; charset=utf-8", PAGE_CACHE);
  }

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
