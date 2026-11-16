/* Ferizaj Stays — apartment data, translations and page templates.
   Used by the server (to build pages Google can read) and by the browser (for the booking widget).
   Edit prices, photos and text here. */
(function (root) {

const HOST_WHATSAPP = "38349947897";    // +383 49 947 897 — digits only, with country code
const CLEANING_FEE = 0;                 // € per stay (0 = no cleaning fee)

/* Amenity names in all three languages */
const A = {
  kitchen:   { en:"Fully equipped kitchen", sq:"Kuzhinë e pajisur plotësisht", de:"Voll ausgestattete Küche" },
  kitchenDw: { en:"Kitchen with dishwasher & oven", sq:"Kuzhinë me pjatalarëse dhe furrë", de:"Küche mit Geschirrspüler und Backofen" },
  wifi:      { en:"Fast Wi-Fi", sq:"Wi-Fi i shpejtë", de:"Schnelles WLAN" },
  work:      { en:"Dedicated workspace", sq:"Hapësirë pune", de:"Eigener Arbeitsplatz" },
  parking:   { en:"Free parking on premises", sq:"Parking falas në objekt", de:"Kostenloser Parkplatz vor Ort" },
  tvNetflix: { en:"55\" HDTV with Netflix", sq:"TV 55\" HD me Netflix", de:"55-Zoll-HD-TV mit Netflix" },
  tv:        { en:"TV", sq:"TV", de:"TV" },
  washerIn:  { en:"Washer in unit", sq:"Lavatriçe në apartament", de:"Waschmaschine in der Wohnung" },
  washer:    { en:"Washer", sq:"Lavatriçe", de:"Waschmaschine" },
  balcony:   { en:"Private balcony", sq:"Ballkon privat", de:"Privater Balkon" },
  heating:   { en:"Heating", sq:"Ngrohje", de:"Heizung" },
  mountain:  { en:"Mountain view", sq:"Pamje nga malet", de:"Bergblick" },
  coAlarm:   { en:"Carbon monoxide alarm", sq:"Alarm për monoksid karboni", de:"Kohlenmonoxidmelder" },
};

const PROPERTIES = [
  {
    id: "centre-one-bedroom",   // internal id (calendar links, bookings) — don't change
    slug: "arch-point",         // web address: /sq/arch-point, /de/arch-point, /en/arch-point
    name: "Arch Point",
    subtitle: { en:"one-bedroom in the heart of Ferizaj", sq:"apartament me një dhomë gjumi në zemër të Ferizajt", de:"Wohnung mit Schlafzimmer im Herzen von Ferizaj" },
    guests: 3, bedrooms: 1, beds: 2, baths: 1,
    price: 35,  // € per night
    rating: 4.88, reviews: 78, guestFavorite: true,
    airbnb: "https://www.airbnb.com/rooms/555045357724911595",
    photos: [
      "5ef15470-034a-4b7d-a43a-746feb1db686","42580a5e-0e85-41fb-9f35-d6952eea5a23",
      "9a154cd5-a8c9-482d-bb28-4b1091ece7a8","c59c6d43-6b01-49dc-85dc-c8c12d3f6c18",
      "e4f0694c-cf3c-49b2-a686-420033399533","ad2e108d-90f7-448f-a730-d107c397e7a0"
    ].map(id => `https://a0.muscache.com/im/pictures/miso/Hosting-555045357724911595/original/${id}.png?im_w=1200`),
    description: {
      en: ["A recently renovated one-bedroom apartment right in the city centre, just a few minutes' walk from the city square and the Village shopping centre, on a quiet street.",
           "A spacious living room opens onto a fully equipped modern kitchen, with a dining and work area. The bedroom has a large double bed, the living room a sofa bed, and the bathroom a walk-in shower. Heating and fast Wi-Fi throughout."],
      sq: ["Apartament me një dhomë gjumi, i rinovuar së fundmi, në qendër të qytetit, në një rrugë të qetë vetëm pak minuta në këmbë nga sheshi dhe qendra tregtare Village.",
           "Dhoma e madhe e ndenjes lidhet me një kuzhinë moderne plotësisht të pajisur, me hapësirë për ngrënie dhe punë. Dhoma e gjumit ka një shtrat të madh dopio, dhoma e ndenjes një divan-shtrat, ndërsa banjoja ka kabinë dushi. Ngrohje dhe Wi-Fi i shpejtë në të gjithë apartamentin."],
      de: ["Frisch renovierte Wohnung mit einem Schlafzimmer mitten im Stadtzentrum – in einer ruhigen Straße, nur wenige Gehminuten vom Stadtplatz und dem Einkaufszentrum Village entfernt.",
           "Das geräumige Wohnzimmer geht in eine voll ausgestattete moderne Küche mit Ess- und Arbeitsbereich über. Im Schlafzimmer steht ein großes Doppelbett, im Wohnzimmer ein Schlafsofa; das Bad hat eine Duschkabine. Heizung und schnelles WLAN in der ganzen Wohnung."],
    },
    sleeping: [
      { en:"Bedroom: 1 double bed", sq:"Dhoma e gjumit: 1 shtrat dopio", de:"Schlafzimmer: 1 Doppelbett" },
      { en:"Living room: 1 sofa bed", sq:"Dhoma e ndenjes: 1 divan-shtrat", de:"Wohnzimmer: 1 Schlafsofa" },
    ],
    amenities: ["kitchen","wifi","work","parking","tvNetflix","washerIn","balcony","heating"],
    missing: ["coAlarm"],
    scores: { clean:4.9, accuracy:4.9, checkin:5.0, comm:5.0, location:5.0, value:4.9 },
    booked: []   // extra manual blocks; taken dates normally come from the server
  },
  {
    id: "cozy-two-bedroom",
    slug: "intercon",
    name: "Intercon",
    subtitle: { en:"cozy 2-bedroom apartment", sq:"apartament i rehatshëm me dy dhoma gjumi", de:"gemütliche Wohnung mit zwei Schlafzimmern" },
    guests: 5, bedrooms: 2, beds: 3, baths: 1,
    price: 40,  // € per night
    rating: 4.8, reviews: 5,
    airbnb: "https://www.airbnb.com/rooms/1677017208208577053",
    photos: [
      "0d426798-5da1-4d06-b7fc-dd49262e6210","919b6904-46f4-4a85-82ea-044cb357017e",
      "5b68b138-e73f-4f4f-a282-c55339c3b3bf","e4ad9c39-a6c1-4554-a0cb-788a7a49f063",
      "27dd1019-2e24-4d34-9f7f-c415894afb37","255962b2-b272-4025-98f7-32ab87543e43"
    ].map(id => `https://a0.muscache.com/im/pictures/hosting/Hosting-1677017208208577053/original/${id}.jpeg?im_w=1200`),
    description: {
      en: ["A modern two-bedroom apartment in central Ferizaj, about a 5-minute walk from the city centre and The Village Shopping & Fun, with shops, cafés and restaurants close by.",
           "A master bedroom, a second bedroom with two single beds, a cozy living room, a fully equipped kitchen, fast Wi-Fi and a modern bathroom. Ideal for families, friends travelling together and business guests."],
      sq: ["Apartament modern me dy dhoma gjumi në qendër të Ferizajt, rreth 5 minuta në këmbë nga qendra e qytetit dhe The Village Shopping & Fun, me dyqane, kafene dhe restorante afër.",
           "Një dhomë gjumi kryesore, një dhomë e dytë me dy shtretër teke, dhomë ndenjeje e rehatshme, kuzhinë plotësisht e pajisur, Wi-Fi i shpejtë dhe banjo moderne. Ideal për familje, shoqëri dhe udhëtarë biznesi."],
      de: ["Moderne Wohnung mit zwei Schlafzimmern im Zentrum von Ferizaj, ca. 5 Gehminuten vom Stadtzentrum und The Village Shopping & Fun – Geschäfte, Cafés und Restaurants in der Nähe.",
           "Ein großes Schlafzimmer, ein zweites Schlafzimmer mit zwei Einzelbetten, ein gemütliches Wohnzimmer, eine voll ausgestattete Küche, schnelles WLAN und ein modernes Bad. Ideal für Familien, Freunde und Geschäftsreisende."],
    },
    sleeping: [
      { en:"Bedroom 1: 1 queen bed", sq:"Dhoma 1: 1 shtrat i madh (queen)", de:"Schlafzimmer 1: 1 Queen-Size-Bett" },
      { en:"Bedroom 2: 2 single beds", sq:"Dhoma 2: 2 shtretër teke", de:"Schlafzimmer 2: 2 Einzelbetten" },
    ],
    amenities: ["kitchen","wifi","work","parking","tv","washer"],
    missing: ["coAlarm"],
    scores: { clean:5.0, accuracy:4.8, checkin:4.8, comm:5.0, location:4.8, value:4.6 },
    booked: []
  },
  {
    id: "modern-one-bedroom",
    slug: "dream-palace",
    name: "Dream Palace",
    subtitle: { en:"modern 1-bedroom with balcony", sq:"apartament modern me një dhomë gjumi dhe ballkon", de:"moderne Wohnung mit Schlafzimmer und Balkon" },
    guests: 3, bedrooms: 1, beds: 2, baths: 1,
    price: 36,  // € per night
    rating: 4.84, reviews: 25,
    airbnb: "https://www.airbnb.com/rooms/955832812626776693",
    photos: [
      "7ab3647e-80ad-40bc-96eb-91b0d6be149d","6fe9747f-ef61-436e-a868-622674e455b5",
      "0785d269-3212-413b-ac20-fb6e6fa7121d","26e5a9cd-2dd6-4864-ba97-7719414990d1",
      "ae6912a9-777a-454b-b5bb-58f7b7250936"
    ].map(id => `https://a0.muscache.com/im/pictures/miso/Hosting-955832812626776693/original/${id}.jpeg?im_w=1200`),
    description: {
      en: ["A contemporary apartment for solo travellers, couples or a small family who want to explore Ferizaj like locals — walkable to the centre and daily essentials.",
           "Open-plan living, dining and kitchen with a dishwasher and oven, a sofa and flat-screen TV, and a private balcony with mountain views. No smoking inside (ashtray provided on the balcony)."],
      sq: ["Apartament bashkëkohor për udhëtarë të vetëm, çifte ose familje të vogla që duan ta njohin Ferizajin si vendasit – në këmbë deri në qendër dhe te gjithçka që ju nevojitet.",
           "Hapësirë e hapur ndenjeje, ngrënieje dhe kuzhine me pjatalarëse dhe furrë, divan dhe TV, si dhe ballkon privat me pamje nga malet. Ndalohet duhani brenda (tavëll në ballkon)."],
      de: ["Zeitgemäße Wohnung für Alleinreisende, Paare oder kleine Familien, die Ferizaj wie Einheimische erleben möchten – Zentrum und Einkaufsmöglichkeiten zu Fuß erreichbar.",
           "Offener Wohn-, Ess- und Küchenbereich mit Geschirrspüler und Backofen, Sofa und Flachbildfernseher sowie ein privater Balkon mit Bergblick. Rauchen nur auf dem Balkon (Aschenbecher vorhanden)."],
    },
    sleeping: [
      { en:"Living area: 1 queen bed, 1 sofa bed", sq:"Hapësira e ndenjes: 1 shtrat i madh (queen), 1 divan-shtrat", de:"Wohnbereich: 1 Queen-Size-Bett, 1 Schlafsofa" },
    ],
    amenities: ["mountain","kitchenDw","wifi","work","parking","balcony"],
    missing: ["coAlarm"],
    scores: { clean:4.7, accuracy:4.8, checkin:4.8, comm:5.0, location:4.6, value:4.8 },
    booked: []
  },
];

/* ===== Translations ===== */
const T = {
  en: {
    intro:"Three calm, carefully kept apartments, a short walk from the centre of Ferizaj — booked directly with your host, without platform fees.", seeApts:"See the apartments", viewApt:"View & book", ctaBtn:"Book your stay", where2:"Ferizaj · Kosovo",
    pageTitle: "Ferizaj Stays · Apartments in Ferizaj, Kosovo",
    metaDesc: "Book apartments in the heart of Ferizaj, Kosovo directly with a Superhost. No platform fees, reply within an hour.",
    aptTitle: (name, sub) => `${name} – ${sub} | Ferizaj Stays`,
    navStays:"Apartments", navAbout:"About", navContact:"Contact",
    heroTitle:"Your home in the heart of Ferizaj",
    heroText:"Three apartments run by a Superhost with 5 years of hosting. Book directly with us and skip the platform fees.",
    badgeRating:"★ 4.87 from 108 reviews", badgeReply:"Replies within an hour",
    ourApts:"Our apartments", aboutTitle:"Hosted by Arian",
    aboutP1:"I've hosted guests in Ferizaj for five years, together with my co-hosts Trim, Vlorë and Vjollca. Every apartment is in a quiet street a few minutes' walk from the city square and the Village shopping centre.",
    aboutP2:"Booking here works just like on the big platforms: pick your dates, send a request, and I'll confirm within the hour.",
    fact1:"5 yrs", fact1t:"hosting", fact2t:"response rate", fact3:"4.87", fact3t:"guest rating", fact4:"5 min", fact4t:"walk to centre",
    phone:"WhatsApp / phone", back:"← All apartments", photo:"photo",
    type:"Entire apartment", hostedBy:"hosted by Arian", reviews:"reviews", guestFav:"Guest favourite",
    sleep:"Where you'll sleep", offers:"What this place offers", where:"Where you'll be",
    whereText:"Quiet neighbourhood, about a 5-minute walk to the city centre and the Village shopping centre. Exact address shared after booking.",
    perNight:"/ night", checkin:"Check-in", checkout:"Checkout", addDate:"Add date", guestsLbl:"Guests", max:"Max",
    selectDates:"Select dates", requestBook:"Request to book",
    fName:"Full name", fPhone:"Phone / WhatsApp", fEmail:"Email", fMsg:"Arrival time, questions… (optional)",
    send:"Send booking request", sending:"Sending…", fine:"You won't be charged yet",
    pickIn:"Choose your check-in date", pickOut:"Choose your checkout date", taken:"crossed-out dates are taken",
    cleaning:"Cleaning fee", service:"Service fee", total:"Total",
    errMissing:"Please add your name and a phone number or email.",
    errTaken:"Sorry, those dates were just booked. Please choose other dates.",
    errGeneric:"Something went wrong. Please try again or message us on WhatsApp.",
    errNetwork:"Couldn't reach the server. Please try again or message us on WhatsApp.",
    sentTitle:"Request sent", sentText:"Arian will confirm your booking within the hour. Want a faster reply?", waBtn:"Message on WhatsApp",
    waMsg:(p,d,tot,n,ph,em,m) => `Hi Arian, I'd like to book "${p}"\n${d}\nTotal: €${tot}\nName: ${n}\nPhone: ${ph||"-"}\nEmail: ${em||"-"}\n${m}`,
    scores:{ clean:"Cleanliness", accuracy:"Accuracy", checkin:"Check-in", comm:"Communication", location:"Location", value:"Value" },
    n:{ night:["night","nights"], guest:["guest","guests"], bedroom:["bedroom","bedrooms"], bed:["bed","beds"], bath:["bath","baths"] },
  },
  sq: {
    intro:"Tri apartamente të qeta dhe të mirëmbajtura me kujdes, pak hapa nga qendra e Ferizajt – të rezervuara direkt te mikpritësi, pa tarifa platformash.", seeApts:"Shikoni apartamentet", viewApt:"Shiko & rezervo", ctaBtn:"Rezervoni qëndrimin", where2:"Ferizaj · Kosovë",
    pageTitle: "Ferizaj Stays · Apartamente me qira ditore në Ferizaj",
    metaDesc: "Rezervoni apartamente në qendër të Ferizajt direkt te Superhost-i. Pa tarifa platformash, përgjigje brenda një ore.",
    aptTitle: (name, sub) => `${name} – ${sub} | Ferizaj Stays`,
    navStays:"Apartamentet", navAbout:"Rreth nesh", navContact:"Kontakti",
    heroTitle:"Shtëpia juaj në zemër të Ferizajt",
    heroText:"Tri apartamente të menaxhuara nga një Superhost me 5 vjet përvojë. Rezervoni direkt me ne, pa tarifat e platformave.",
    badgeRating:"★ 4,87 nga 108 vlerësime", badgeReply:"Përgjigjemi brenda një ore",
    ourApts:"Apartamentet tona", aboutTitle:"Ju mirëpret Ariani",
    aboutP1:"Pres mysafirë në Ferizaj prej pesë vjetësh, së bashku me bashkëmikpritësit Trim, Vlorë dhe Vjollca. Çdo apartament ndodhet në një rrugë të qetë, vetëm pak minuta në këmbë nga sheshi i qytetit dhe qendra tregtare Village.",
    aboutP2:"Rezervimi këtu funksionon si në platformat e mëdha: zgjidhni datat, dërgoni kërkesën dhe unë jua konfirmoj brenda një ore.",
    fact1:"5 vjet", fact1t:"mikpritje", fact2t:"shkalla e përgjigjes", fact3:"4,87", fact3t:"vlerësimi i mysafirëve", fact4:"5 min", fact4t:"në këmbë deri në qendër",
    phone:"WhatsApp / telefon", back:"← Të gjitha apartamentet", photo:"foto",
    type:"Apartament i tërë", hostedBy:"mikpritës Ariani", reviews:"vlerësime", guestFav:"I preferuar nga mysafirët",
    sleep:"Ku do të flini", offers:"Çfarë ofron ky vend", where:"Ku do të jeni",
    whereText:"Lagje e qetë, rreth 5 minuta në këmbë nga qendra e qytetit dhe qendra tregtare Village. Adresa e saktë ju dërgohet pas rezervimit.",
    perNight:"/ natë", checkin:"Hyrja", checkout:"Dalja", addDate:"Zgjidhni datën", guestsLbl:"Mysafirë", max:"Maks.",
    selectDates:"Zgjidhni datat", requestBook:"Kërko rezervim",
    fName:"Emri dhe mbiemri", fPhone:"Telefoni / WhatsApp", fEmail:"Email", fMsg:"Ora e mbërritjes, pyetje… (opsionale)",
    send:"Dërgo kërkesën", sending:"Duke dërguar…", fine:"Nuk paguani asgjë tani",
    pickIn:"Zgjidhni datën e hyrjes", pickOut:"Zgjidhni datën e daljes", taken:"datat e vijëzuara janë të zëna",
    cleaning:"Pastrimi", service:"Tarifa e shërbimit", total:"Gjithsej",
    errMissing:"Ju lutemi shkruani emrin dhe një numër telefoni ose email.",
    errTaken:"Na vjen keq, këto data sapo u rezervuan. Ju lutemi zgjidhni data të tjera.",
    errGeneric:"Diçka shkoi keq. Provoni përsëri ose na shkruani në WhatsApp.",
    errNetwork:"Nuk u lidhëm me serverin. Provoni përsëri ose na shkruani në WhatsApp.",
    sentTitle:"Kërkesa u dërgua", sentText:"Ariani do ta konfirmojë rezervimin brenda një ore. Doni përgjigje më të shpejtë?", waBtn:"Shkruani në WhatsApp",
    waMsg:(p,d,tot,n,ph,em,m) => `Përshëndetje Arian, dua të rezervoj "${p}"\n${d}\nGjithsej: €${tot}\nEmri: ${n}\nTelefoni: ${ph||"-"}\nEmail: ${em||"-"}\n${m}`,
    scores:{ clean:"Pastërtia", accuracy:"Saktësia", checkin:"Hyrja", comm:"Komunikimi", location:"Vendndodhja", value:"Vlera" },
    n:{ night:["natë","netë"], guest:["mysafir","mysafirë"], bedroom:["dhomë gjumi","dhoma gjumi"], bed:["shtrat","shtretër"], bath:["banjo","banjo"] },
  },
  de: {
    intro:"Drei ruhige, liebevoll gepflegte Wohnungen, nur wenige Schritte vom Zentrum von Ferizaj – direkt beim Gastgeber gebucht, ohne Plattformgebühren.", seeApts:"Wohnungen ansehen", viewApt:"Ansehen & buchen", ctaBtn:"Aufenthalt buchen", where2:"Ferizaj · Kosovo",
    pageTitle: "Ferizaj Stays · Ferienwohnungen in Ferizaj, Kosovo",
    metaDesc: "Ferienwohnungen im Zentrum von Ferizaj direkt beim Superhost buchen. Keine Plattformgebühren, Antwort innerhalb einer Stunde.",
    aptTitle: (name, sub) => `${name} – Ferienwohnung in Ferizaj: ${sub} | Ferizaj Stays`,
    navStays:"Wohnungen", navAbout:"Über uns", navContact:"Kontakt",
    heroTitle:"Ihr Zuhause im Herzen von Ferizaj",
    heroText:"Drei Wohnungen, betreut von einem Superhost mit 5 Jahren Erfahrung. Buchen Sie direkt bei uns – ohne Plattformgebühren.",
    badgeRating:"★ 4,87 aus 108 Bewertungen", badgeReply:"Antwort innerhalb einer Stunde",
    ourApts:"Unsere Wohnungen", aboutTitle:"Ihr Gastgeber: Arian",
    aboutP1:"Seit fünf Jahren empfange ich Gäste in Ferizaj, zusammen mit meinen Co-Gastgebern Trim, Vlorë und Vjollca. Alle Wohnungen liegen in ruhigen Straßen, nur wenige Gehminuten vom Stadtplatz und dem Einkaufszentrum Village entfernt.",
    aboutP2:"Die Buchung funktioniert wie auf den großen Plattformen: Daten wählen, Anfrage senden – ich bestätige innerhalb einer Stunde.",
    fact1:"5 Jahre", fact1t:"Gastgeber", fact2t:"Antwortrate", fact3:"4,87", fact3t:"Gästebewertung", fact4:"5 Min.", fact4t:"zu Fuß ins Zentrum",
    phone:"WhatsApp / Telefon", back:"← Alle Wohnungen", photo:"Foto",
    type:"Gesamte Wohnung", hostedBy:"Gastgeber: Arian", reviews:"Bewertungen", guestFav:"Gäste-Favorit",
    sleep:"Schlafmöglichkeiten", offers:"Ausstattung", where:"Lage",
    whereText:"Ruhige Wohngegend, ca. 5 Gehminuten vom Stadtzentrum und dem Einkaufszentrum Village. Die genaue Adresse erhalten Sie nach der Buchung.",
    perNight:"/ Nacht", checkin:"Check-in", checkout:"Check-out", addDate:"Datum wählen", guestsLbl:"Gäste", max:"max.",
    selectDates:"Daten wählen", requestBook:"Buchung anfragen",
    fName:"Vor- und Nachname", fPhone:"Telefon / WhatsApp", fEmail:"E-Mail", fMsg:"Ankunftszeit, Fragen … (optional)",
    send:"Anfrage senden", sending:"Wird gesendet …", fine:"Noch keine Zahlung fällig",
    pickIn:"Check-in-Datum wählen", pickOut:"Check-out-Datum wählen", taken:"durchgestrichene Tage sind belegt",
    cleaning:"Reinigung", service:"Servicegebühr", total:"Gesamt",
    errMissing:"Bitte geben Sie Ihren Namen und eine Telefonnummer oder E-Mail an.",
    errTaken:"Diese Daten wurden leider gerade gebucht. Bitte wählen Sie andere Daten.",
    errGeneric:"Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns auf WhatsApp.",
    errNetwork:"Keine Verbindung zum Server. Bitte versuchen Sie es erneut oder schreiben Sie uns auf WhatsApp.",
    sentTitle:"Anfrage gesendet", sentText:"Arian bestätigt Ihre Buchung innerhalb einer Stunde. Schneller geht's per WhatsApp:", waBtn:"Auf WhatsApp schreiben",
    waMsg:(p,d,tot,n,ph,em,m) => `Hallo Arian, ich möchte "${p}" buchen\n${d}\nGesamt: €${tot}\nName: ${n}\nTelefon: ${ph||"-"}\nE-Mail: ${em||"-"}\n${m}`,
    scores:{ clean:"Sauberkeit", accuracy:"Genauigkeit", checkin:"Check-in", comm:"Kommunikation", location:"Lage", value:"Preis-Leistung" },
    n:{ night:["Nacht","Nächte"], guest:["Gast","Gäste"], bedroom:["Schlafzimmer","Schlafzimmer"], bed:["Bett","Betten"], bath:["Bad","Bäder"] },
  },
};
const LANGS = ["sq","de","en"];
const LOCALE = { sq:"sq-AL", de:"de-DE", en:"en-GB" };
// Albanian month/day names are built in, because many browsers have no Albanian date data
const SQ_MONTHS = ["janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nëntor","dhjetor"];
const SQ_MON_SHORT = ["jan","shk","mar","pri","maj","qer","korr","gush","sht","tet","nën","dhj"];
const SQ_DOWS = ["Hë","Ma","Më","En","Pr","Sh","Di"];

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const bySlug = slug => PROPERTIES.find(p => p.slug === slug);
const byId = id => PROPERTIES.find(p => p.id === id);

/* Helpers and page templates for one language */
function make(lang) {
  const t = k => T[lang][k] ?? T.en[k];
  const tr = o => typeof o === "string" ? o : (o[lang] ?? o.en);
  // decimal comma for sq/de without relying on the device having locale data
  const num = (v, min = 1, max = 2) => {
    const s = (Math.round(v * 10 ** max) / 10 ** max).toFixed(max).replace(/0+$/, "");
    const fixed = Number(s).toFixed(Math.max(min, (s.split(".")[1] || "").length));
    return lang === "en" ? fixed : fixed.replace(".", ",");
  };
  const pl = (n, k) => `${n} ${T[lang].n[k][n === 1 ? 0 : 1]}`;
  const title = p => `${p.name} — ${tr(p.subtitle)}`;
  const facts = p => [pl(p.guests,"guest"), pl(p.bedrooms,"bedroom"), pl(p.beds,"bed"), pl(p.baths,"bath")].join(" · ");
  const url = p => `/${lang}/${p.slug}`;

  const cardHTML = p => `
    <a class="card" href="${url(p)}" data-id="${p.id}">
      <img class="img" src="${p.photos[0]}" alt="${esc(title(p))}" loading="lazy" width="1200" height="800">
      <div class="body">
        <div class="eyebrow">${facts(p)}</div>
        <h3>${esc(p.name)} <span>— ${esc(tr(p.subtitle))}</span></h3>
        <div class="row">
          <span class="price"><b>€${p.price}</b> ${t("perNight")} · ★ ${num(p.rating)} (${p.reviews})</span>
          <span class="more"><i></i>${t("viewApt")}</span>
        </div>
      </div>
    </a>`;

  const detailHTML = p => `
    <h1>${esc(title(p))}</h1>
    <div class="meta">★ ${num(p.rating)} · ${p.reviews} ${t("reviews")}${p.guestFavorite ? " · " + t("guestFav") : ""} · Ferizaj, Kosovo</div>
    <div class="gallery">${p.photos.slice(0,5).map((u,i) => `<img src="${u}" alt="${esc(p.name)} – ${t("photo")} ${i+1}" ${i ? 'loading="lazy"' : ""}>`).join("")}</div>
    <div class="layout">
      <div>
        <h2 style="font-size:22px">${t("type")} · ${t("hostedBy")}</h2>
        <div class="facts-line">${facts(p)}</div>
        <div class="block">${tr(p.description).map(x => `<p style="margin-bottom:10px">${x}</p>`).join("")}</div>
        <div class="block"><h2>${t("sleep")}</h2>${p.sleeping.map(s => `<div>${tr(s)}</div>`).join("")}</div>
        <div class="block"><h2>${t("offers")}</h2><ul class="amen">
          ${p.amenities.map(a => `<li>${tr(A[a])}</li>`).join("")}${p.missing.map(a => `<li class="no">${tr(A[a])}</li>`).join("")}
        </ul></div>
        <div class="block"><h2>★ ${num(p.rating)} · ${p.reviews} ${t("reviews")}</h2><div class="scores">
          ${Object.entries(p.scores).map(([k,v]) => `<div><b>${num(v,1,1)}</b>${T[lang].scores[k]}</div>`).join("")}
        </div></div>
        <div class="block" style="border:0"><h2>${t("where")}</h2><p>${t("whereText")}</p></div>
      </div>

      <aside class="book">
        <div class="p">€${p.price} <small>${t("perNight")}</small></div>
        <div class="dates">
          <button id="inBtn"><label>${t("checkin")}</label><span id="inTxt">${t("addDate")}</span></button>
          <button id="outBtn"><label>${t("checkout")}</label><span id="outTxt">${t("addDate")}</span></button>
        </div>
        <div class="cal" id="cal"></div>
        <div class="guests"><div><b>${t("guestsLbl")}</b><div class="meta" style="margin:0">${t("max")} ${p.guests}</div></div>
          <div class="step"><button id="gMinus" aria-label="−">−</button><span id="gNum">1</span><button id="gPlus" aria-label="+">+</button></div></div>
        <div class="breakdown" id="breakdown"></div>
        <button class="btn" id="reserve" disabled>${t("selectDates")}</button>
        <div class="form" id="form">
          <input id="fName" placeholder="${t("fName")}" autocomplete="name">
          <input id="fPhone" placeholder="${t("fPhone")}" autocomplete="tel">
          <input id="fEmail" type="email" placeholder="${t("fEmail")}" autocomplete="email">
          <textarea id="fMsg" rows="3" placeholder="${t("fMsg")}"></textarea>
          <button class="btn" id="send">${t("send")}</button>
        </div>
        <div class="done" id="done"></div>
        <div class="fine" id="fine">${t("fine")}</div>
      </aside>
    </div>`;

  return { lang, t, tr, num, pl, title, facts, url, cardHTML, detailHTML };
}

const SHARED = { HOST_WHATSAPP, CLEANING_FEE, A, PROPERTIES, T, LANGS, LOCALE, SQ_MONTHS, SQ_MON_SHORT, SQ_DOWS, esc, bySlug, byId, make };
if (typeof module !== "undefined" && module.exports) module.exports = SHARED;
else root.SHARED = SHARED;

})(typeof window !== "undefined" ? window : globalThis);
