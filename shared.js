/* Ferizaj Stays — apartment data, translations and page templates.
   Used by the server (to build pages Google can read) and by the browser (for the booking widget).
   Edit prices, photos and text here. */
(function (root) {

const MAPS_ON = true;                   // maps on the home page and apartment pages
const HOST_WHATSAPP = "38349947897";    // +383 49 947 897 — digits only, with country code
const DEPOSIT_PCT = 30;                 // % of the total paid after the host confirms; the rest on arrival
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

const localPhotos = (slug, n) => Array.from({ length: n }, (_, i) => `/photos/${slug}/${String(i + 1).padStart(2, "0")}.jpg`);
// small (800px) copy of our own photos; Airbnb-hosted photos have no small copy
const small = u => u.startsWith("/photos/") ? u.replace(/.jpg$/, "-sm.jpg") : u;

const PROPERTIES = [
  {
    id: "centre-one-bedroom",   // internal id (calendar links, bookings) — don't change
    slug: "arch-point",
    building: { floor: 4, floors: 12, year: 2020, lifts: 2, bigLifts: true, parking: "garage", stepFree: true, ac: "living" },
    lat: 42.371094, lng: 21.153847,   // map position (from Google Maps)
    name: "Arch Point",
    subtitle: { en:"one-bedroom in the heart of Ferizaj", sq:"apartament me një dhomë gjumi në zemër të Ferizajt", de:"Wohnung mit Schlafzimmer im Herzen von Ferizaj" },
    guests: 3, bedrooms: 1, beds: 2, baths: 1,
    price: 35,  // € per night
    rating: 4.88, reviews: 78, guestFavorite: true,
    airbnb: "https://www.airbnb.com/rooms/555045357724911595",
    photos: localPhotos("arch-point", 18),   // own photos (resized copies in /photos/arch-point)
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
    building: { floor: 12, floors: 14, lifts: 2, parking: "front", ac: "yes", cot: true },
    whereText: { en:"Quiet residential area on the west side of Ferizaj, about a 15-minute walk (3 minutes by car) to the city centre and The Village shopping centre.", sq:"Zonë e qetë banimi në pjesën perëndimore të Ferizajt, rreth 15 minuta në këmbë (3 minuta me makinë) deri në qendër të qytetit dhe në qendrën tregtare Village.", de:"Ruhiges Wohngebiet im Westen von Ferizaj, ca. 15 Gehminuten (3 Minuten mit dem Auto) bis zum Stadtzentrum und zum Einkaufszentrum Village." },
    lat: 42.371465, lng: 21.139560,   // map position (from Google Maps)
    name: "Intercon",
    subtitle: { en:"cozy 2-bedroom apartment", sq:"apartament i rehatshëm me dy dhoma gjumi", de:"gemütliche Wohnung mit zwei Schlafzimmern" },
    guests: 5, bedrooms: 2, beds: 3, baths: 1,
    price: 40,  // € per night
    rating: 4.8, reviews: 5,
    airbnb: "https://www.airbnb.com/rooms/1677017208208577053",
    // own photos (resized copies in /photos/intercon); the numbers set the order, the first is the main photo
    photos: [6, 2, 3, 4, 5, 1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(n => `/photos/intercon/${String(n).padStart(2, "0")}.jpg`),
    description: {
      en: ["A modern two-bedroom apartment in Ferizaj, about a 15-minute walk (3 minutes by car) from the city centre and The Village Shopping & Fun.",
           "A master bedroom, a second bedroom with two single beds, a cozy living room, a fully equipped kitchen, fast Wi-Fi and a modern bathroom. Ideal for families, friends travelling together and business guests."],
      sq: ["Apartament modern me dy dhoma gjumi në Ferizaj, rreth 15 minuta në këmbë (3 minuta me makinë) nga qendra e qytetit dhe The Village Shopping & Fun.",
           "Një dhomë gjumi kryesore, një dhomë e dytë me dy shtretër teke, dhomë ndenjeje e rehatshme, kuzhinë plotësisht e pajisur, Wi-Fi i shpejtë dhe banjo moderne. Ideal për familje, shoqëri dhe udhëtarë biznesi."],
      de: ["Moderne Wohnung mit zwei Schlafzimmern in Ferizaj, ca. 15 Gehminuten (3 Minuten mit dem Auto) vom Stadtzentrum und The Village Shopping & Fun entfernt.",
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
    building: { floor: 3, floors: 13, lifts: 2, parking: "front", ac: "yes" },
    whereText: { en:"Quiet residential area on the west side of Ferizaj, about a 15-minute walk (3 minutes by car) to the city centre and The Village shopping centre.", sq:"Zonë e qetë banimi në pjesën perëndimore të Ferizajt, rreth 15 minuta në këmbë (3 minuta me makinë) deri në qendër të qytetit dhe në qendrën tregtare Village.", de:"Ruhiges Wohngebiet im Westen von Ferizaj, ca. 15 Gehminuten (3 Minuten mit dem Auto) bis zum Stadtzentrum und zum Einkaufszentrum Village." },
    lat: 42.370497, lng: 21.137826,   // map position (from Google Maps)
    name: "Dream Palace",
    subtitle: { en:"modern 1-bedroom with balcony", sq:"apartament modern me një dhomë gjumi dhe ballkon", de:"moderne Wohnung mit Schlafzimmer und Balkon" },
    guests: 3, bedrooms: 1, beds: 2, baths: 1,
    price: 36,  // € per night
    rating: 4.84, reviews: 25,
    airbnb: "https://www.airbnb.com/rooms/955832812626776693",
    photos: [
      "0785d269-3212-413b-ac20-fb6e6fa7121d","7ab3647e-80ad-40bc-96eb-91b0d6be149d",
      "6fe9747f-ef61-436e-a868-622674e455b5","26e5a9cd-2dd6-4864-ba97-7719414990d1",
      "ae6912a9-777a-454b-b5bb-58f7b7250936"
    ].map(id => `https://a0.muscache.com/im/pictures/miso/Hosting-955832812626776693/original/${id}.jpeg?im_w=1200`),
    description: {
      en: ["A contemporary apartment for solo travellers, couples or a small family who want to explore Ferizaj like locals — about a 15-minute walk (3 minutes by car) to the centre.",
           "Open-plan living, dining and kitchen with a dishwasher and oven, a sofa and flat-screen TV, and a private balcony with mountain views. No smoking inside (ashtray provided on the balcony)."],
      sq: ["Apartament bashkëkohor për udhëtarë të vetëm, çifte ose familje të vogla që duan ta njohin Ferizajin si vendasit – rreth 15 minuta në këmbë (3 minuta me makinë) deri në qendër.",
           "Hapësirë e hapur ndenjeje, ngrënieje dhe kuzhine me pjatalarëse dhe furrë, divan dhe TV, si dhe ballkon privat me pamje nga malet. Ndalohet duhani brenda (tavëll në ballkon)."],
      de: ["Zeitgemäße Wohnung für Alleinreisende, Paare oder kleine Familien, die Ferizaj wie Einheimische erleben möchten – ca. 15 Gehminuten (3 Minuten mit dem Auto) ins Zentrum.",
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
    bTitle:"The building", rTitle:"House rules",
    bFloor:(f, of, y) => `${(n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ({1:"st",2:"nd",3:"rd"}[n % 10] || "th")))(f)} floor of ${of}${y ? ` · modern building from ${y}` : ""}`,
    bLifts:(n, big) => `${n} lifts${big ? ", room for prams and large suitcases" : ""}`,
    bGarage:"Free parking in the basement garage, reserved for guests (fits our 9-seat van)", bFront:"Free parking in front of the building",
    bStepFree:"No steps at the entrance or inside", bAcLiving:"Air conditioning in the living room (also heats in winter)", bAc:"Air conditioning",
    rules:["Personal welcome: we meet you on arrival", "Check-in from 15:00 · check-out by 11:00", "Smoking on the balcony only", "No pets", "No baby cot or high chair available"], cotYes:"Baby cot available on request",
    tag:(f, garage) => `${(n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ({1:"st",2:"nd",3:"rd"}[n % 10] || "th")))(f)} floor · lift · ${garage ? "free garage parking" : "free parking"}`,
    navGuide:"Things to do", guideTeaser:"Things to do in Ferizaj & around", guideTeaserText:"Mosque and church side by side, the Kaçanik Gorge, Brezovica, Prizren and more — our tips for your stay.", guideBtn:"See our tips", mapBtn:"Map", backHome:"← Apartments", guideCta:"Find your apartment",
    payTitle:"Payment & cancellation", payList:["No payment when you send a request.", "After we confirm, you pay a 30% deposit by bank transfer or Western Union — we send the details on WhatsApp.", "The rest (70%) is paid on arrival, in cash or by transfer.", "Cancellation (firm): full refund of the deposit up to 30 days before check-in, 50% between 30 and 7 days before, no refund in the last 7 days."],
    allPhotos:"Show all photos", close:"Close",
    mapTitle:"Where the apartments are", approxLoc:"Check-in details are sent after booking.", gmaps:"Open in Google Maps", mapLink:"View apartment",
    intro:"Three calm, carefully kept apartments close to the centre of Ferizaj — booked directly with your host, without platform fees.", seeApts:"See the apartments", viewApt:"View & book", ctaBtn:"Book your stay", where2:"Ferizaj · Kosovo",
    pageTitle: "Ferizaj Stays · Apartments in Ferizaj, Kosovo",
    metaDesc: "Book apartments in the heart of Ferizaj, Kosovo directly with a Superhost. No platform fees, reply within an hour.",
    aptTitle: (name, sub) => `${name} – ${sub} | Ferizaj Stays`,
    navStays:"Apartments", navAbout:"About", navContact:"Contact",
    heroTitle:"Your home in the heart of Ferizaj",
    heroText:"Three apartments run by a Superhost with 5 years of hosting. Book directly with us and skip the platform fees.",
    badgeRating:"★ 4.87 from 108 reviews", badgeReply:"Replies within an hour",
    ourApts:"Our apartments", aboutTitle:"Hosted by Arian",
    aboutP1:"I've hosted guests in Ferizaj for five years, together with my co-hosts Trim, Vlorë and Vjollca. All three are on quiet streets: Arch Point a few minutes' walk from the city square and The Village, Intercon and Dream Palace about 15 minutes' walk away.",
    aboutP2:"Booking here works just like on the big platforms: pick your dates, send a request, and I'll confirm within the hour.",
    fact1:"5 yrs", fact1t:"hosting", fact2t:"response rate", fact3:"4.87", fact3t:"guest rating", fact4:"5–15 min", fact4t:"walk to centre",
    phone:"WhatsApp / phone", back:"← All apartments", photo:"photo",
    type:"Entire apartment", hostedBy:"hosted by Arian", reviews:"reviews", guestFav:"Guest favourite",
    sleep:"Where you'll sleep", offers:"What this place offers", where:"Where you'll be",
    whereText:"Quiet neighbourhood, about a 5-minute walk to the city centre and the Village shopping centre.",
    perNight:"/ night", checkin:"Check-in", checkout:"Checkout", addDate:"Add date", guestsLbl:"Guests", max:"Max",
    selectDates:"Select dates", requestBook:"Request to book",
    fName:"Full name", fPhone:"Phone / WhatsApp", fEmail:"Email", fMsg:"Arrival time, questions… (optional)",
    send:"Send booking request", sending:"Sending…", fine:"Nothing to pay now. After we confirm, you pay a 30% deposit; the rest on arrival.", deposit:"Deposit after confirmation", onArrival:"On arrival",
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
    bTitle:"Ndërtesa", rTitle:"Rregullat e shtëpisë",
    bFloor:(f, of, y) => `Kati ${f} nga ${of}${y ? ` · ndërtesë moderne e vitit ${y}` : ""}`,
    bLifts:(n, big) => `${n} ashensorë${big ? ", me vend për karroca fëmijësh dhe valixhe të mëdha" : ""}`,
    bGarage:"Parking falas në garazhin nëntokësor, i rezervuar për mysafirët (i përshtatshëm edhe për furgonin tonë me 9 ulëse)", bFront:"Parking falas para ndërtesës",
    bStepFree:"Pa shkallë në hyrje apo brenda", bAcLiving:"Klimë në dhomën e ndenjes (ngroh edhe në dimër)", bAc:"Klimë",
    rules:["Pritje personale: ju presim kur mbërrini", "Hyrja nga ora 15:00 · dalja deri në ora 11:00", "Duhani lejohet vetëm në ballkon", "Nuk lejohen kafshët shtëpiake", "Nuk ofrojmë krevat bebeje apo karrige për fëmijë"], cotYes:"Krevat bebeje në dispozicion sipas kërkesës",
    tag:(f, garage) => `Kati ${f} · ashensor · ${garage ? "parking falas në garazh" : "parking falas"}`,
    navGuide:"Çfarë të bëni", guideTeaser:"Çfarë të bëni në Ferizaj dhe rrethinë", guideTeaserText:"Xhamia dhe kisha krah për krah, Gryka e Kaçanikut, Brezovica, Prizreni e më shumë – këshillat tona për qëndrimin tuaj.", guideBtn:"Shikoni këshillat", mapBtn:"Harta", backHome:"← Apartamentet", guideCta:"Gjeni apartamentin tuaj",
    payTitle:"Pagesa & anulimi", payList:["Asnjë pagesë kur dërgoni kërkesën.", "Pas konfirmimit paguani 30% kapar me transfer bankar ose Western Union – detajet jua dërgojmë në WhatsApp.", "Pjesa tjetër (70%) paguhet në mbërritje, me para në dorë ose me transfer.", "Anulimi: kapari kthehet plotësisht deri 30 ditë para hyrjes, 50% nga 30 deri 7 ditë para, pa kthim në 7 ditët e fundit."],
    allPhotos:"Shiko të gjitha fotot", close:"Mbyll",
    mapTitle:"Ku ndodhen apartamentet", approxLoc:"Detajet e hyrjes ju dërgohen pas rezervimit.", gmaps:"Hape në Google Maps", mapLink:"Shiko apartamentin",
    intro:"Tri apartamente të qeta dhe të mirëmbajtura me kujdes, afër qendrës së Ferizajt – të rezervuara direkt te mikpritësi, pa tarifa platformash.", seeApts:"Shikoni apartamentet", viewApt:"Shiko & rezervo", ctaBtn:"Rezervoni qëndrimin", where2:"Ferizaj · Kosovë",
    pageTitle: "Ferizaj Stays · Apartamente me qira ditore në Ferizaj",
    metaDesc: "Rezervoni apartamente në qendër të Ferizajt direkt te Superhost-i. Pa tarifa platformash, përgjigje brenda një ore.",
    aptTitle: (name, sub) => `${name} – ${sub} | Ferizaj Stays`,
    navStays:"Apartamentet", navAbout:"Rreth nesh", navContact:"Kontakti",
    heroTitle:"Shtëpia juaj në zemër të Ferizajt",
    heroText:"Tri apartamente të menaxhuara nga një Superhost me 5 vjet përvojë. Rezervoni direkt me ne, pa tarifat e platformave.",
    badgeRating:"★ 4,87 nga 108 vlerësime", badgeReply:"Përgjigjemi brenda një ore",
    ourApts:"Apartamentet tona", aboutTitle:"Ju mirëpret Ariani",
    aboutP1:"Pres mysafirë në Ferizaj prej pesë vjetësh, së bashku me bashkëmikpritësit Trim, Vlorë dhe Vjollca. Të tria ndodhen në rrugë të qeta: Arch Point pak minuta në këmbë nga sheshi dhe Village, Intercon dhe Dream Palace rreth 15 minuta larg.",
    aboutP2:"Rezervimi këtu funksionon si në platformat e mëdha: zgjidhni datat, dërgoni kërkesën dhe unë jua konfirmoj brenda një ore.",
    fact1:"5 vjet", fact1t:"mikpritje", fact2t:"shkalla e përgjigjes", fact3:"4,87", fact3t:"vlerësimi i mysafirëve", fact4:"5–15 min", fact4t:"në këmbë deri në qendër",
    phone:"WhatsApp / telefon", back:"← Të gjitha apartamentet", photo:"foto",
    type:"Apartament i tërë", hostedBy:"mikpritës Ariani", reviews:"vlerësime", guestFav:"I preferuar nga mysafirët",
    sleep:"Ku do të flini", offers:"Çfarë ofron ky vend", where:"Ku do të jeni",
    whereText:"Lagje e qetë, rreth 5 minuta në këmbë nga qendra e qytetit dhe qendra tregtare Village.",
    perNight:"/ natë", checkin:"Hyrja", checkout:"Dalja", addDate:"Zgjidhni datën", guestsLbl:"Mysafirë", max:"Maks.",
    selectDates:"Zgjidhni datat", requestBook:"Kërko rezervim",
    fName:"Emri dhe mbiemri", fPhone:"Telefoni / WhatsApp", fEmail:"Email", fMsg:"Ora e mbërritjes, pyetje… (opsionale)",
    send:"Dërgo kërkesën", sending:"Duke dërguar…", fine:"Asgjë për të paguar tani. Pas konfirmimit paguani 30% kapar; pjesën tjetër në mbërritje.", deposit:"Kapari pas konfirmimit", onArrival:"Në mbërritje",
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
    bTitle:"Das Gebäude", rTitle:"Hausregeln",
    bFloor:(f, of, y) => `${f}. Stock von ${of}${y ? ` · modernes Gebäude von ${y}` : ""}`,
    bLifts:(n, big) => `${n} Aufzüge${big ? ", Platz für Kinderwagen und große Koffer" : ""}`,
    bGarage:"Kostenloser Parkplatz in der Tiefgarage, reserviert für Gäste (passt auch für unseren 9-Sitzer)", bFront:"Kostenloses Parken vor dem Gebäude",
    bStepFree:"Keine Stufen am Eingang oder in der Wohnung", bAcLiving:"Klimaanlage im Wohnzimmer (heizt auch im Winter)", bAc:"Klimaanlage",
    rules:["Persönlicher Empfang: Wir begrüßen Sie bei der Ankunft", "Check-in ab 15:00 · Check-out bis 11:00", "Rauchen nur auf dem Balkon", "Keine Haustiere", "Kein Babybett oder Hochstuhl vorhanden"], cotYes:"Babybett auf Anfrage verfügbar",
    tag:(f, garage) => `${f}. Stock · Aufzug · ${garage ? "kostenlose Tiefgarage" : "kostenloser Parkplatz"}`,
    navGuide:"Ausflugstipps", guideTeaser:"Ausflugstipps: Ferizaj & Umgebung", guideTeaserText:"Moschee und Kirche Seite an Seite, die Kaçanik-Schlucht, Brezovica, Prizren und mehr – unsere Tipps für Ihren Aufenthalt.", guideBtn:"Zu den Tipps", mapBtn:"Karte", backHome:"← Wohnungen", guideCta:"Wohnung finden",
    payTitle:"Zahlung & Stornierung", payList:["Bei der Anfrage zahlen Sie nichts.", "Nach unserer Bestätigung zahlen Sie 30 % an – per Banküberweisung oder Western Union. Die Daten schicken wir Ihnen per WhatsApp.", "Der Rest (70 %) wird bei Ankunft bezahlt, bar oder per Überweisung.", "Stornierung: volle Rückerstattung der Anzahlung bis 30 Tage vor Anreise, 50 % zwischen 30 und 7 Tagen vorher, danach keine Rückerstattung."],
    allPhotos:"Alle Fotos anzeigen", close:"Schließen",
    mapTitle:"Wo die Wohnungen liegen", approxLoc:"Die Check-in-Infos erhalten Sie nach der Buchung.", gmaps:"In Google Maps öffnen", mapLink:"Wohnung ansehen",
    intro:"Drei ruhige, liebevoll gepflegte Wohnungen nahe dem Zentrum von Ferizaj – direkt beim Gastgeber gebucht, ohne Plattformgebühren.", seeApts:"Wohnungen ansehen", viewApt:"Ansehen & buchen", ctaBtn:"Aufenthalt buchen", where2:"Ferizaj · Kosovo",
    pageTitle: "Ferizaj Stays · Ferienwohnungen in Ferizaj, Kosovo",
    metaDesc: "Ferienwohnungen im Zentrum von Ferizaj direkt beim Superhost buchen. Keine Plattformgebühren, Antwort innerhalb einer Stunde.",
    aptTitle: (name, sub) => `${name} – Ferienwohnung in Ferizaj: ${sub} | Ferizaj Stays`,
    navStays:"Wohnungen", navAbout:"Über uns", navContact:"Kontakt",
    heroTitle:"Ihr Zuhause im Herzen von Ferizaj",
    heroText:"Drei Wohnungen, betreut von einem Superhost mit 5 Jahren Erfahrung. Buchen Sie direkt bei uns – ohne Plattformgebühren.",
    badgeRating:"★ 4,87 aus 108 Bewertungen", badgeReply:"Antwort innerhalb einer Stunde",
    ourApts:"Unsere Wohnungen", aboutTitle:"Ihr Gastgeber: Arian",
    aboutP1:"Seit fünf Jahren empfange ich Gäste in Ferizaj, zusammen mit meinen Co-Gastgebern Trim, Vlorë und Vjollca. Alle drei liegen in ruhigen Straßen: Arch Point wenige Gehminuten vom Stadtplatz und dem Village, Intercon und Dream Palace ca. 15 Gehminuten entfernt.",
    aboutP2:"Die Buchung funktioniert wie auf den großen Plattformen: Daten wählen, Anfrage senden – ich bestätige innerhalb einer Stunde.",
    fact1:"5 Jahre", fact1t:"Gastgeber", fact2t:"Antwortrate", fact3:"4,87", fact3t:"Gästebewertung", fact4:"5–15 Min.", fact4t:"zu Fuß ins Zentrum",
    phone:"WhatsApp / Telefon", back:"← Alle Wohnungen", photo:"Foto",
    type:"Gesamte Wohnung", hostedBy:"Gastgeber: Arian", reviews:"Bewertungen", guestFav:"Gäste-Favorit",
    sleep:"Schlafmöglichkeiten", offers:"Ausstattung", where:"Lage",
    whereText:"Ruhige Wohngegend, ca. 5 Gehminuten vom Stadtzentrum und dem Einkaufszentrum Village.",
    perNight:"/ Nacht", checkin:"Check-in", checkout:"Check-out", addDate:"Datum wählen", guestsLbl:"Gäste", max:"max.",
    selectDates:"Daten wählen", requestBook:"Buchung anfragen",
    fName:"Vor- und Nachname", fPhone:"Telefon / WhatsApp", fEmail:"E-Mail", fMsg:"Ankunftszeit, Fragen … (optional)",
    send:"Anfrage senden", sending:"Wird gesendet …", fine:"Jetzt nichts zu zahlen. Nach unserer Bestätigung zahlen Sie 30 % an, den Rest bei Ankunft.", deposit:"Anzahlung nach Bestätigung", onArrival:"Bei Ankunft",
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
/* ===== "Things to do in Ferizaj & around" guide =====
   Times are approximate driving times from Ferizaj. "q" is what the map button searches for. */
const GUIDE = {
  slug: "things-to-do",
  // top photo; null = no photo. Licence requires the credit line.
  photo: { src: "/photos/arch-point/01.jpg" },   // own photo; for a licensed photo add author, licence, licenceUrl, source (shown as credit)
  title: { en:"Things to do in Ferizaj & around", sq:"Çfarë të bëni në Ferizaj dhe rrethinë", de:"Ausflugstipps: Ferizaj & Umgebung" },
  lead: {
    en:"Our favourite places in town, in the mountains nearby and for day trips — tips from your hosts. Driving times are approximate.",
    sq:"Vendet tona të preferuara në qytet, në malet përreth dhe për udhëtime njëditore – këshilla nga mikpritësit tuaj. Kohët e udhëtimit janë të përafërta.",
    de:"Unsere Lieblingsorte in der Stadt, in den Bergen ringsum und für Tagesausflüge – Tipps von Ihren Gastgebern. Die Fahrzeiten sind ungefähre Angaben.",
  },
  metaDesc: {
    en:"Things to do in Ferizaj, Kosovo and nearby: mosque and church side by side, Nerodime river bifurcation, Kaçanik Gorge, Brezovica, Prizren, Prishtina and airports.",
    sq:"Çfarë të bëni në Ferizaj dhe afër: xhamia dhe kisha krah për krah, bifurkacioni i Nerodimes, Gryka e Kaçanikut, Brezovica, Prizreni, Prishtina dhe aeroportet.",
    de:"Ausflugstipps für Ferizaj und Umgebung: Moschee und Kirche Seite an Seite, Flussgabelung der Nerodime, Kaçanik-Schlucht, Brezovica, Prizren, Prishtina und Flughäfen.",
  },
  sections: [
    { title: { en:"In Ferizaj", sq:"Në Ferizaj", de:"In Ferizaj" }, items: [
      { name: { en:"Mosque and church side by side", sq:"Xhamia dhe kisha krah për krah", de:"Moschee und Kirche Seite an Seite" },
        time: { en:"Town centre", sq:"Qendra e qytetit", de:"Stadtzentrum" }, q:"Xhamia e Madhe Ferizaj",
        text: { en:"In the town centre, the Great Mosque and the Orthodox Church of St. Uroš stand right next to each other — a well-known symbol of Ferizaj, about 300 m from the train station.",
                sq:"Në qendër të qytetit, Xhamia e Madhe dhe Kisha Ortodokse e Shën Uroshit qëndrojnë njëra pranë tjetrës – një simbol i njohur i Ferizajt, rreth 300 m nga stacioni i trenit.",
                de:"Im Stadtzentrum stehen die Große Moschee und die orthodoxe Kirche des Hl. Uroš direkt nebeneinander – ein bekanntes Wahrzeichen von Ferizaj, etwa 300 m vom Bahnhof." } },
      { name: { en:"The Village Shopping & Fun", sq:"The Village Shopping & Fun", de:"The Village Shopping & Fun" },
        time: { en:"Town centre", sq:"Qendra e qytetit", de:"Stadtzentrum" }, q:"The Village Shopping & Fun Ferizaj",
        text: { en:"Shopping centre on Ahmet Kaçiku street with shops, cafés and restaurants — handy for groceries and a coffee.",
                sq:"Qendër tregtare në rrugën Ahmet Kaçiku me dyqane, kafene dhe restorante – e përshtatshme për pazar dhe një kafe.",
                de:"Einkaufszentrum an der Ahmet-Kaçiku-Straße mit Geschäften, Cafés und Restaurants – praktisch für Einkäufe und einen Kaffee." } },
      { name: { en:"Cafés and evening walks", sq:"Kafene dhe shëtitje mbrëmjeve", de:"Cafés und Abendspaziergang" },
        time: { en:"Town centre", sq:"Qendra e qytetit", de:"Stadtzentrum" }, q:"Ferizaj city centre",
        text: { en:"Ferizaj is a young, lively town. On summer evenings the streets around the centre fill up with people and the cafés stay busy until late.",
                sq:"Ferizaji është qytet i ri dhe plot jetë. Në mbrëmjet e verës rrugët rreth qendrës mbushen me njerëz dhe kafenetë punojnë deri vonë.",
                de:"Ferizaj ist eine junge, lebendige Stadt. An Sommerabenden sind die Straßen rund ums Zentrum voller Menschen und die Cafés bis spät geöffnet." } },
    ]},
    { title: { en:"Nature nearby", sq:"Natyra përreth", de:"Natur in der Nähe" }, items: [
      { name: { en:"Nerodime river bifurcation", sq:"Bifurkacioni i Nerodimes", de:"Flussgabelung der Nerodime" },
        time: { en:"Edge of town", sq:"Në dalje të qytetit", de:"Am Stadtrand" }, q:"Bifurkacioni i Nerodimes",
        text: { en:"A protected nature reserve where the Nerodime river splits in two: one branch flows towards the Black Sea, the other towards the Aegean — a rare natural phenomenon. How much water flows depends on the season.",
                sq:"Rezervat natyror i mbrojtur ku lumi Nerodime ndahet në dy degë: njëra rrjedh drejt Detit të Zi, tjetra drejt Detit Egje – një dukuri e rrallë natyrore. Sasia e ujit varet nga stina.",
                de:"Ein geschütztes Naturreservat, in dem sich die Nerodime teilt: Ein Arm fließt Richtung Schwarzes Meer, der andere Richtung Ägäis – ein seltenes Naturphänomen. Die Wassermenge hängt von der Jahreszeit ab." } },
      { name: { en:"Kaçanik Gorge", sq:"Gryka e Kaçanikut", de:"Kaçanik-Schlucht" },
        time: { en:"About 20 min", sq:"Rreth 20 min", de:"Ca. 20 Min." }, q:"Gryka e Kaçanikut",
        text: { en:"A dramatic gorge where the road and railway cut through the mountains towards North Macedonia — a scenic drive with short hikes and birdwatching.",
                sq:"Grykë mbresëlënëse ku rruga dhe hekurudha kalojnë mes maleve drejt Maqedonisë së Veriut – udhëtim piktoresk, me shëtitje të shkurtra dhe vëzhgim zogjsh.",
                de:"Eine eindrucksvolle Schlucht, durch die Straße und Bahn Richtung Nordmazedonien führen – schöne Fahrt mit kurzen Wanderungen und Vogelbeobachtung." } },
      { name: { en:"Jezerc mountain village", sq:"Fshati malor Jezerc", de:"Bergdorf Jezerc" },
        time: { en:"About 30 min", sq:"Rreth 30 min", de:"Ca. 30 Min." }, q:"Jezerc Ferizaj",
        text: { en:"A village in the mountains above Ferizaj at more than 1,200 m — fresh air, forest walks and views over the plain.",
                sq:"Fshat në malet mbi Ferizaj, mbi 1.200 m lartësi – ajër i pastër, shëtitje në pyll dhe pamje mbi rrafsh.",
                de:"Ein Dorf in den Bergen über Ferizaj auf über 1.200 m – frische Luft, Waldspaziergänge und Blick über die Ebene." } },
      { name: { en:"Brezovica ski resort", sq:"Qendra e skijimit Brezovica", de:"Skigebiet Brezovica" },
        time: { en:"45–60 min", sq:"45–60 min", de:"45–60 Min." }, q:"Brezovica ski resort",
        text: { en:"Kosovo's best-known ski resort, in the Sharr mountains: skiing in winter, hiking and mountain air in summer.",
                sq:"Qendra më e njohur e skijimit në Kosovë, në malet e Sharrit: skijim në dimër, ecje dhe ajër malor në verë.",
                de:"Das bekannteste Skigebiet des Kosovo im Šar-Gebirge: im Winter Skifahren, im Sommer Wandern und Bergluft." } },
    ]},
    { title: { en:"Day trips", sq:"Udhëtime njëditore", de:"Tagesausflüge" }, items: [
      { name: { en:"Prishtina", sq:"Prishtina", de:"Prishtina" },
        time: { en:"About 40 min", sq:"Rreth 40 min", de:"Ca. 40 Min." }, q:"NEWBORN monument Prishtina",
        text: { en:"Kosovo's capital: the NEWBORN monument, the striking National Library, Mother Teresa Boulevard and plenty of cafés.",
                sq:"Kryeqyteti i Kosovës: monumenti NEWBORN, Biblioteka Kombëtare me arkitekturë të veçantë, Bulevardi Nëna Terezë dhe shumë kafene.",
                de:"Die Hauptstadt des Kosovo: das NEWBORN-Denkmal, die markante Nationalbibliothek, der Mutter-Teresa-Boulevard und viele Cafés." } },
      { name: { en:"Gadime Marble Cave", sq:"Shpella e Gadimes", de:"Marmorhöhle Gadime" },
        time: { en:"About 30 min", sq:"Rreth 30 min", de:"Ca. 30 Min." }, q:"Shpella e Gadimes",
        text: { en:"A marble cave near Lipjan with crystal formations, visited with a guide.",
                sq:"Shpellë mermeri afër Lipjanit me formacione kristalore, që vizitohet me guidë.",
                de:"Eine Marmorhöhle bei Lipjan mit Kristallformationen, Besichtigung mit Führung." } },
      { name: { en:"Prizren", sq:"Prizreni", de:"Prizren" },
        time: { en:"About 1 h", sq:"Rreth 1 orë", de:"Ca. 1 Std." }, q:"Prizren old town",
        text: { en:"Kosovo's most beautiful old town: the Stone Bridge, Sinan Pasha Mosque and the fortress with views over the city. In August: the DokuFest film festival.",
                sq:"Qyteti i vjetër më i bukur i Kosovës: Ura e Gurit, Xhamia e Sinan Pashës dhe Kalaja me pamje mbi qytet. Në gusht: festivali i filmit DokuFest.",
                de:"Die schönste Altstadt des Kosovo: die Steinbrücke, die Sinan-Pascha-Moschee und die Festung mit Blick über die Stadt. Im August: das Filmfestival DokuFest." } },
      { name: { en:"Skopje", sq:"Shkupi", de:"Skopje" },
        time: { en:"About 1 h", sq:"Rreth 1 orë", de:"Ca. 1 Std." }, q:"Old Bazaar Skopje",
        text: { en:"Capital of North Macedonia, with its Old Bazaar and Stone Bridge. Take your passport or ID card for the border.",
                sq:"Kryeqyteti i Maqedonisë së Veriut, me Çarshinë e Vjetër dhe Urën e Gurit. Merrni pasaportën ose letërnjoftimin për kufirin.",
                de:"Hauptstadt Nordmazedoniens mit Altem Basar und Steinbrücke. Reisepass oder Ausweis für die Grenze mitnehmen." } },
    ]},
    { title: { en:"Getting here", sq:"Si të vini", de:"Anreise" }, items: [
      { name: { en:"Prishtina Airport (PRN)", sq:"Aeroporti i Prishtinës (PRN)", de:"Flughafen Prishtina (PRN)" },
        time: { en:"About 45 min", sq:"Rreth 45 min", de:"Ca. 45 Min." }, q:"Prishtina International Airport Adem Jashari",
        text: { en:"The closest airport, with many flights from Germany, Switzerland and Austria. Need a transfer? Ask us on WhatsApp.",
                sq:"Aeroporti më i afërt, me shumë fluturime nga Gjermania, Zvicra dhe Austria. Ju duhet transport? Na shkruani në WhatsApp.",
                de:"Der nächste Flughafen, mit vielen Flügen aus Deutschland, der Schweiz und Österreich. Transfer gewünscht? Schreiben Sie uns auf WhatsApp." } },
      { name: { en:"Skopje Airport (SKP)", sq:"Aeroporti i Shkupit (SKP)", de:"Flughafen Skopje (SKP)" },
        time: { en:"About 1 h 15 min", sq:"Rreth 1 orë e 15 min", de:"Ca. 1 Std. 15 Min." }, q:"Skopje International Airport",
        text: { en:"A good alternative, often with low-cost flights. The drive includes the border crossing — take your passport or ID card.",
                sq:"Alternativë e mirë, shpesh me fluturime të lira. Rruga përfshin kalimin e kufirit – merrni pasaportën ose letërnjoftimin.",
                de:"Eine gute Alternative, oft mit günstigen Flügen. Die Fahrt führt über die Grenze – Reisepass oder Ausweis mitnehmen." } },
      { name: { en:"By bus", sq:"Me autobus", de:"Mit dem Bus" },
        time: { en:"Bus station in town", sq:"Stacioni në qytet", de:"Busbahnhof in der Stadt" }, q:"Stacioni i autobusëve Ferizaj",
        text: { en:"Buses run from Ferizaj bus station to Prishtina, Prizren and Skopje.",
                sq:"Nga stacioni i autobusëve në Ferizaj ka linja për Prishtinë, Prizren dhe Shkup.",
                de:"Vom Busbahnhof Ferizaj fahren Busse nach Prishtina, Prizren und Skopje." } },
    ]},
  ],
};

/* ===== Rent a car =====
   units = how many cars of that model (a date shows as taken only when all are booked).
   photoCredit: the example photos are from Wikimedia Commons and their licence requires this credit;
   set photoCredit to null once you use photos of your own cars. */
const CAR_FEATURES = {
  automatic: { en:"Automatic transmission", sq:"Kambio automatike", de:"Automatikgetriebe" },
  seats5:    { en:"5 seats", sq:"5 ulëse", de:"5 Sitze" },
  seats9:    { en:"8–9 seats", sq:"8–9 ulëse", de:"8–9 Sitze" },
  three:     { en:"3 cars of this model", sq:"3 makina të këtij modeli", de:"3 Fahrzeuge dieses Modells" },
  luggage:   { en:"Room for family luggage", sq:"Vend për bagazhet e familjes", de:"Platz für Familiengepäck" },
  ferizaj:   { en:"Free pick-up in Ferizaj", sq:"Marrje falas në Ferizaj", de:"Kostenlose Übergabe in Ferizaj" },
  airport:   { en:"Prishtina Airport on request", sq:"Aeroporti i Prishtinës sipas kërkesës", de:"Flughafen Prishtina auf Anfrage" },
};
const GOLF_TEXT = {
  en:"Automatic and easy to drive — comfortable and economical for the city, the airport and day trips around Kosovo.",
  sq:"Automatik dhe i lehtë për t'u ngarë – i rehatshëm dhe ekonomik për qytetin, aeroportin dhe udhëtime njëditore nëpër Kosovë.",
  de:"Automatik und einfach zu fahren – komfortabel und sparsam für Stadt, Flughafen und Tagesausflüge im Kosovo.",
};
const CARS = [
  {
    id: "car-golf-7", slug: "golf-7", kind: "car", units: 3, price: 30,
    name: { en:"VW Golf 7", sq:"VW Golf 7", de:"VW Golf 7" },
    subtitle: { en:"automatic, 5 seats", sq:"automatik, 5 ulëse", de:"Automatik, 5 Sitze" },
    seatsLabel: "seats5",
    description: GOLF_TEXT,
    features: ["automatic", "seats5", "three", "ferizaj", "airport"],
    photos: ["/photos/golf-7/01.jpg"],   // example photo from Unsplash; replace with your own car
    example: true,
    photoCredit: null,
  },
  {
    id: "car-golf-6", slug: "golf-6", kind: "car", units: 3, price: 25,
    name: { en:"VW Golf 6", sq:"VW Golf 6", de:"VW Golf 6" },
    subtitle: { en:"automatic, 5 seats", sq:"automatik, 5 ulëse", de:"Automatik, 5 Sitze" },
    seatsLabel: "seats5",
    description: GOLF_TEXT,
    features: ["automatic", "seats5", "three", "ferizaj", "airport"],
    photos: ["/photos/golf-6/01.jpg"],   // example photo from Unsplash; replace with your own car
    example: true,
    photoCredit: null,
  },
  {
    id: "car-family-van", slug: "family-van", kind: "car", units: 1, price: 60,
    name: { en:"Family van", sq:"Furgon familjar", de:"Familienbus" },
    subtitle: { en:"8–9 seats", sq:"8–9 ulëse", de:"8–9 Sitze" },
    seatsLabel: "seats9",
    description: {
      en:"Room for 8–9 people plus luggage — ideal for families, airport runs and day trips to Prizren or Brezovica.",
      sq:"Vend për 8–9 persona dhe bagazhe – ideal për familje, transfer nga aeroporti dhe udhëtime për në Prizren ose Brezovicë.",
      de:"Platz für 8–9 Personen samt Gepäck – ideal für Familien, Flughafenfahrten und Ausflüge nach Prizren oder Brezovica.",
    },
    features: ["seats9", "luggage", "ferizaj", "airport"],
    photos: ["/photos/family-van/01.jpg"],   // example photo from Unsplash; replace with your own car
    example: true,
    photoCredit: null,
  },
];
const CAR_T = {
  en: { carsBack:"← Rent a car", photoSoon:"Photo coming soon", carsNav:"Rent a car", carsEyebrow:"Cars & family van", carsTitle:"Rent a car", carsLead:"Automatic VW Golfs and a family van for 8–9 people. Free pick-up in Ferizaj, or we meet you at Prishtina Airport.",
        perDay:"/ day", carType:"Car rental", carIncl:"What you get", carPickTitle:"Pick-up & return",
        carPickList:["Free pick-up and return in Ferizaj.", "Pick-up or return at Prishtina Airport on request (extra fee).", "Valid driving licence and ID or passport required."],
        pickup:"Pick-up", ret:"Return", place:"Pick-up place", placeFerizaj:"Ferizaj (free)", placeAirport:"Prishtina Airport (fee on request)",
        carPickIn:"Choose your pick-up date", carPickOut:"Choose your return date", example:"Example photo", photoBy:"Example photo",
        carFine:"Nothing to pay now. We confirm availability and any airport fee on WhatsApp.", airportFee:"Airport pick-up", onRequest:"on request",
        carTitle:(n, s) => `${n} for rent in Ferizaj – ${s} | Ferizaj Stays`, carView:"View & book",
        days:["day","days"], placeWord:"Pick-up" },
  sq: { carsBack:"← Makina me qira", photoSoon:"Foto së shpejti", carsNav:"Makina me qira", carsEyebrow:"Makina dhe furgon familjar", carsTitle:"Makina me qira", carsLead:"Golf automatik dhe një furgon familjar për 8–9 persona. Marrja falas në Ferizaj, ose ju presim në Aeroportin e Prishtinës.",
        perDay:"/ ditë", carType:"Makinë me qira", carIncl:"Çfarë merrni", carPickTitle:"Marrja & kthimi",
        carPickList:["Marrja dhe kthimi falas në Ferizaj.", "Marrja ose kthimi në Aeroportin e Prishtinës sipas kërkesës (me tarifë shtesë).", "Kërkohet patentë shoferi e vlefshme dhe letërnjoftim ose pasaportë."],
        pickup:"Marrja", ret:"Kthimi", place:"Vendi i marrjes", placeFerizaj:"Ferizaj (falas)", placeAirport:"Aeroporti i Prishtinës (tarifë sipas kërkesës)",
        carPickIn:"Zgjidhni datën e marrjes", carPickOut:"Zgjidhni datën e kthimit", example:"Foto ilustruese", photoBy:"Foto ilustruese",
        carFine:"Asgjë për të paguar tani. Disponueshmërinë dhe tarifën e aeroportit (nëse ka) i konfirmojmë në WhatsApp.", airportFee:"Marrja në aeroport", onRequest:"sipas kërkesës",
        carTitle:(n, s) => `${n} me qira në Ferizaj – ${s} | Ferizaj Stays`, carView:"Shiko & rezervo",
        days:["ditë","ditë"], placeWord:"Marrja" },
  de: { carsBack:"← Mietwagen", photoSoon:"Foto folgt", carsNav:"Mietwagen", carsEyebrow:"Autos & Familienbus", carsTitle:"Mietwagen", carsLead:"VW Golf mit Automatik und ein Familienbus für 8–9 Personen. Kostenlose Übergabe in Ferizaj, oder wir treffen Sie am Flughafen Prishtina.",
        perDay:"/ Tag", carType:"Mietwagen", carIncl:"Das bekommen Sie", carPickTitle:"Abholung & Rückgabe",
        carPickList:["Kostenlose Übergabe und Rückgabe in Ferizaj.", "Übergabe oder Rückgabe am Flughafen Prishtina auf Anfrage (gegen Aufpreis).", "Gültiger Führerschein und Ausweis oder Reisepass erforderlich."],
        pickup:"Abholung", ret:"Rückgabe", place:"Übergabeort", placeFerizaj:"Ferizaj (kostenlos)", placeAirport:"Flughafen Prishtina (Gebühr auf Anfrage)",
        carPickIn:"Abholdatum wählen", carPickOut:"Rückgabedatum wählen", example:"Beispielfoto", photoBy:"Beispielfoto",
        carFine:"Jetzt nichts zu zahlen. Verfügbarkeit und ggf. Flughafengebühr bestätigen wir per WhatsApp.", airportFee:"Übergabe am Flughafen", onRequest:"auf Anfrage",
        carTitle:(n, s) => `${n} mieten in Ferizaj – ${s} | Ferizaj Stays`, carView:"Ansehen & buchen",
        days:["Tag","Tage"], placeWord:"Übergabe" },
};

for (const l of Object.keys(CAR_T)) Object.assign(T[l], CAR_T[l]);

/* ===== Long-stay discounts and the "book direct" saving =====
   LONG_STAY: biggest matching discount applies (apartments only).
   AIRBNB_FEE_PCT: roughly what Airbnb adds in fees; used for the "you save about €X" estimate. */
const LONG_STAY = [ { min: 28, pct: 20, key: "monthly" }, { min: 7, pct: 10, key: "weekly" } ];
const AIRBNB_FEE_PCT = 20;
function stayPrice(p, nights) {
  const sub = p.price * nights;
  const d = LONG_STAY.find(x => nights >= x.min);
  const disc = d ? Math.round(sub * d.pct / 100) : 0;
  const total = sub - disc + CLEANING_FEE;
  return { sub, disc, pct: d ? d.pct : 0, key: d ? d.key : null, total, saving: Math.round(total * AIRBNB_FEE_PCT / 100) };
}

const FEAT_T = {
  en: { sArrive:"Arrival", sLeave:"Departure", sBtn:"Search", sClear:"Clear search", sErrDates:"Please choose your arrival and departure dates.",
        sFree:(n, all, d) => `${n} of ${all} apartments free · ${d}`, sNone:"No apartment is free for these dates — message us on WhatsApp, we often find a solution.",
        avOk:"Available", avNo:"Booked for these dates", avTooMany:n => `Max. ${n} guests`, stayTotal:(tot, n) => `€${tot} total for ${n}`,
        directBadge:"No booking fees", cardSave:"Up to 20% cheaper than on Airbnb", directLine:"Book direct: no platform fees — Airbnb adds up to ~20%.",
        saveVs:x => `You save about €${x} compared with Airbnb`, weekly:p => `Weekly discount (−${p}%)`, monthly:p => `Monthly discount (−${p}%)`,
        longHint:"−10% from 7 nights · −20% from 28 nights. Longer stay or a big family?", askWa:"Ask us on WhatsApp",
        addCar:"Add a car for your stay", pkgCar:"Car", pkgFull:"booked", carLine:(name, n) => `${name} · ${n}`, totalWithCar:"Total incl. car",
        carSent:"Car request sent too.", carNotFree:"The car you chose isn't free for these dates — we'll suggest another one on WhatsApp.", pkgNote:apt => `Package with stay at ${apt}` },
  sq: { sArrive:"Mbërritja", sLeave:"Largimi", sBtn:"Kërko", sClear:"Pastro kërkimin", sErrDates:"Ju lutemi zgjidhni datat e mbërritjes dhe të largimit.",
        sFree:(n, all, d) => `${n} nga ${all} apartamente të lira · ${d}`, sNone:"Asnjë apartament nuk është i lirë për këto data – na shkruani në WhatsApp, shpesh gjejmë zgjidhje.",
        avOk:"I lirë", avNo:"I zënë për këto data", avTooMany:n => `Maks. ${n} mysafirë`, stayTotal:(tot, n) => `€${tot} gjithsej për ${n}`,
        directBadge:"Pa tarifa rezervimi", cardSave:"Deri në 20% më lirë se në Airbnb", directLine:"Rezervim direkt: pa tarifa platforme – Airbnb shton deri në ~20%.",
        saveVs:x => `Kurseni rreth €${x} krahasuar me Airbnb`, weekly:p => `Zbritje javore (−${p}%)`, monthly:p => `Zbritje mujore (−${p}%)`,
        longHint:"−10% nga 7 netë · −20% nga 28 netë. Qëndrim më i gjatë apo familje e madhe?", askWa:"Na pyetni në WhatsApp",
        addCar:"Shtoni një makinë për qëndrimin", pkgCar:"Makina", pkgFull:"e zënë", carLine:(name, n) => `${name} · ${n}`, totalWithCar:"Gjithsej me makinë",
        carSent:"U dërgua edhe kërkesa për makinë.", carNotFree:"Makina që zgjodhët nuk është e lirë për këto data – do t'ju propozojmë një tjetër në WhatsApp.", pkgNote:apt => `Paketë me qëndrim në ${apt}` },
  de: { sArrive:"Anreise", sLeave:"Abreise", sBtn:"Suchen", sClear:"Suche zurücksetzen", sErrDates:"Bitte wählen Sie An- und Abreisedatum.",
        sFree:(n, all, d) => `${n} von ${all} Wohnungen frei · ${d}`, sNone:"Für diese Daten ist keine Wohnung frei – schreiben Sie uns auf WhatsApp, oft finden wir eine Lösung.",
        avOk:"Frei", avNo:"Für diese Daten belegt", avTooMany:n => `Max. ${n} Gäste`, stayTotal:(tot, n) => `€${tot} gesamt für ${n}`,
        directBadge:"Keine Buchungsgebühren", cardSave:"Bis zu 20 % günstiger als bei Airbnb", directLine:"Direkt buchen: keine Plattformgebühren – Airbnb schlägt bis zu ~20 % auf.",
        saveVs:x => `Sie sparen ca. €${x} gegenüber Airbnb`, weekly:p => `Wochenrabatt (−${p} %)`, monthly:p => `Monatsrabatt (−${p} %)`,
        longHint:"−10 % ab 7 Nächten · −20 % ab 28 Nächten. Längerer Aufenthalt oder große Familie?", askWa:"Auf WhatsApp fragen",
        addCar:"Mietwagen für Ihren Aufenthalt dazubuchen", pkgCar:"Auto", pkgFull:"belegt", carLine:(name, n) => `${name} · ${n}`, totalWithCar:"Gesamt inkl. Auto",
        carSent:"Die Anfrage für das Auto wurde ebenfalls gesendet.", carNotFree:"Das gewählte Auto ist für diese Daten nicht frei – wir schlagen Ihnen per WhatsApp ein anderes vor.", pkgNote:apt => `Paket mit Aufenthalt in ${apt}` },
};

for (const l of Object.keys(FEAT_T)) Object.assign(T[l], FEAT_T[l]);   // car texts join the main translations

const LANGS = ["sq","de","en"];
const LOCALE = { sq:"sq-AL", de:"de-DE", en:"en-GB" };
// Albanian month/day names are built in, because many browsers have no Albanian date data
const SQ_MONTHS = ["janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nëntor","dhjetor"];
const SQ_MON_SHORT = ["jan","shk","mar","pri","maj","qer","korr","gush","sht","tet","nën","dhj"];
const SQ_DOWS = ["Hë","Ma","Më","En","Pr","Sh","Di"];

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ITEMS = [...PROPERTIES, ...CARS];
const bySlug = slug => ITEMS.find(p => p.slug === slug);
const byId = id => ITEMS.find(p => p.id === id);

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
      <img class="img" src="${small(p.photos[0])}" srcset="${small(p.photos[0])} 800w, ${p.photos[0]} 1600w" sizes="(max-width:860px) 100vw, 600px" alt="${esc(title(p))}" loading="lazy" width="1600" height="1067">
      <div class="body">
        <div class="eyebrow">${facts(p)}</div>
        <h3>${esc(p.name)} <span>— ${esc(tr(p.subtitle))}</span></h3>
        ${p.building ? `<div class="btag">${T[lang].tag(p.building.floor, p.building.parking === "garage")}</div>` : ""}
        <div class="row">
          <span class="price"><b>€${p.price}</b> ${t("perNight")} · ★ ${num(p.rating)} (${p.reviews})<em class="savetag">${t("cardSave")}</em></span>
          <span class="more"><i></i>${t("viewApt")}</span>
        </div>
      </div>
    </a>`;

  const detailHTML = p => `
    <h1>${esc(title(p))}</h1>
    <div class="meta">★ ${num(p.rating)} · ${p.reviews} ${t("reviews")}${p.guestFavorite ? " · " + t("guestFav") : ""} · Ferizaj, Kosovo</div>
    <div class="gallery">${p.photos.slice(0,5).map((u,i) => `<img src="${i ? small(u) : u}" alt="${esc(p.name)} – ${t("photo")} ${i+1}" ${i ? 'loading="lazy"' : ""} data-photo="${i}">`).join("")}
      ${p.photos.length > 5 ? `<button class="allbtn" id="allPhotos" type="button">▦ ${t("allPhotos")} (${p.photos.length})</button>` : ""}</div>
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
        ${p.building ? (() => { const b = p.building, L = T[lang]; const rows = [
            ["🏢", L.bFloor(b.floor, b.floors, b.year)],
            b.lifts ? ["🛗", L.bLifts(b.lifts, b.bigLifts)] : null,
            ["🅿️", b.parking === "garage" ? L.bGarage : L.bFront],
            b.stepFree ? ["♿", L.bStepFree] : null,
            b.ac ? ["❄️", b.ac === "living" ? L.bAcLiving : L.bAc] : null,
          ].filter(Boolean);
          return `<div class="block"><h2>${L.bTitle}</h2><ul class="infolist">${rows.map(([i, x]) => `<li><span aria-hidden="true">${i}</span>${x}</li>`).join("")}</ul></div>`; })() : ""}
        <div class="block"><h2>${t("rTitle")}</h2><ul class="infolist">${T[lang].rules.map((x, i) => `<li><span aria-hidden="true">${["🔑","🕒","🚭","🐾","👶"][i]}</span>${i === 4 && p.building && p.building.cot ? T[lang].cotYes : x}</li>`).join("")}</ul></div>
        <div class="block"><h2>${t("payTitle")}</h2><ul class="paylist">${T[lang].payList.map(x => `<li>${x}</li>`).join("")}</ul></div>
        <div class="block" style="border:0"><h2>${t("where")}</h2><p>${p.whereText ? tr(p.whereText) : t("whereText")}</p>${MAPS_ON ? `
          <div class="aptmap" id="aptMap" role="region" aria-label="${t("where")}"></div><div class="maphint"><a href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener">${t("gmaps")} ↗</a> · ${t("approxLoc")}</div>` : ""}</div>
      </div>

      <aside class="book">
        <div class="p">€${p.price} <small>${t("perNight")}</small></div>
        <div class="direct">✓ ${t("directLine")}</div>
        <div class="dates">
          <button id="inBtn"><label>${t("checkin")}</label><span id="inTxt">${t("addDate")}</span></button>
          <button id="outBtn"><label>${t("checkout")}</label><span id="outTxt">${t("addDate")}</span></button>
        </div>
        <div class="cal" id="cal"></div>
        <div class="guests"><div><b>${t("guestsLbl")}</b><div class="meta" style="margin:0">${t("max")} ${p.guests}</div></div>
          <div class="step"><button id="gMinus" aria-label="−">−</button><span id="gNum">1</span><button id="gPlus" aria-label="+">+</button></div></div>
        <label class="addcar"><input type="checkbox" id="pkgOn"> <span>🚗 ${t("addCar")}</span></label>
        <div class="pkg" id="pkg" hidden>
          <label><b>${t("pkgCar")}</b><select id="pkgCar">${CARS.map(c => `<option value="${c.id}">${esc(tr(c.name))} — €${c.price} ${t("perDay")}</option>`).join("")}</select></label>
          <label><b>${t("place")}</b><select id="pkgPlace"><option value="ferizaj">${t("placeFerizaj")}</option><option value="airport">${t("placeAirport")}</option></select></label>
        </div>
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
        <div class="longhint">${t("longHint")} <a href="https://wa.me/${HOST_WHATSAPP}" target="_blank" rel="noopener">${t("askWa")} ↗</a></div>
      </aside>
    </div>`;

  const guideHTML = () => `
    <section class="guide-hero${GUIDE.photo ? " has-photo" : ""}">${GUIDE.photo ? `
      <img class="gh-img" src="${GUIDE.photo.src}" srcset="${small(GUIDE.photo.src)} 800w, ${GUIDE.photo.src} 1600w" sizes="100vw" alt="${GUIDE.photo.alt || "Arch Point"}" fetchpriority="high">
      ${GUIDE.photo.author ? `<div class="gh-credit">Photo: <a href="${GUIDE.photo.source}" target="_blank" rel="noopener">${GUIDE.photo.author}</a>, <a href="${GUIDE.photo.licenceUrl}" target="_blank" rel="noopener license">${GUIDE.photo.licence}</a>, Wikimedia Commons</div>` : ""}` : ""}
      <div class="wrap">
      <a class="back" href="/${lang}/">${t("backHome")}</a>
      <div class="eyebrow" style="margin-top:28px">${t("where2")}</div>
      <h1>${tr(GUIDE.title)}</h1>
      <p>${tr(GUIDE.lead)}</p>
    </div></section>
    ${GUIDE.sections.map(sec => `
    <section class="guide-sec"><div class="wrap">
      <h2>${tr(sec.title)}</h2>
      <div class="guide-grid">${sec.items.map(it => `
        <article class="tip">
          <div class="eyebrow">${tr(it.time)}</div>
          <h3>${tr(it.name)}</h3>
          <p>${tr(it.text)}</p>
          <a class="maplink" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.q)}" target="_blank" rel="noopener">${t("mapBtn")} ↗</a>
        </article>`).join("")}
      </div>
    </div></section>`).join("")}
    <section class="guide-sec"><div class="wrap" style="text-align:center">
      <a class="pill" href="/${lang}/#stays"><i></i>${t("guideCta")}</a>
    </div></section>`;

  const carName = c => tr(c.name);
  const carTitle = c => `${carName(c)} — ${tr(c.subtitle)}`;
  const plDays = n => `${n} ${T[lang].days[n === 1 ? 0 : 1]}`;
  const credit = c => c.photoCredit ? `${t("photoBy")}: <a href="${c.photoCredit.source}" target="_blank" rel="noopener">${esc(c.photoCredit.author)}</a>, <a href="${c.photoCredit.licenceUrl}" target="_blank" rel="noopener license">${c.photoCredit.licence}</a>, Wikimedia Commons` : "";

  const carSvg = c => c.seatsLabel === "seats9"
    ? `<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M8 44V22c0-5 3-9 8-9h56c5 0 8 2 11 6l13 14c3 1 8 3 8 8v3c0 2-1 3-3 3h-6"/><path d="M8 44h7m22 0h44"/><circle cx="26" cy="45" r="7"/><circle cx="92" cy="45" r="7"/><path d="M16 20h16v12H16zM38 20h16v12H38zM60 20h14l9 12H60z"/></svg>`
    : `<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M10 42v-8c0-3 2-5 5-6l14-4 12-10c3-2 6-3 10-3h20c4 0 7 1 10 4l11 11c6 1 12 3 14 5 2 2 2 4 2 7v4c0 2-1 3-3 3h-6"/><path d="M10 42h8m24 0h46"/><circle cx="30" cy="43" r="7"/><circle cx="96" cy="43" r="7"/><path d="M36 25l9-8c2-1 4-2 6-2h10v10zM66 25V15h9c2 0 4 1 5 2l8 8z"/></svg>`;
  const carPhoto = (c, cls) => c.photos.length
    ? `<img class="${cls}" src="${small(c.photos[0])}" srcset="${small(c.photos[0])} 800w, ${c.photos[0]} 1600w" sizes="(max-width:860px) 100vw, 400px" alt="${esc(carTitle(c))}" loading="lazy" width="1600" height="1067">`
    : `<div class="${cls} nophoto">${carSvg(c)}<span>${t("photoSoon")}</span></div>`;
  const carCardHTML = c => `
    <a class="card carcard" href="${url(c)}" data-id="${c.id}">
      <div class="imgwrap">${carPhoto(c, "img")}
        ${c.example || c.photoCredit ? `<span class="examplebadge">${t("example")}</span>` : ""}</div>
      <div class="body">
        <div class="eyebrow">${c.features.slice(0, c.units > 1 ? 3 : 2).map(f => tr(CAR_FEATURES[f])).join(" · ")}</div>
        <h3>${esc(carName(c))} <span>— ${esc(tr(c.subtitle))}</span></h3>
        <div class="row">
          <span class="price"><b>€${c.price}</b> ${t("perDay")}</span>
          <span class="more"><i></i>${t("carView")}</span>
        </div>
        ${c.photoCredit ? `<div class="credit">${t("photoBy")}: ${esc(c.photoCredit.author)}, ${c.photoCredit.licence}</div>` : ""}
      </div>
    </a>`;

  const carDetailHTML = c => `
    <h1>${esc(carTitle(c))}</h1>
    <div class="meta">${t("carType")} · Ferizaj, Kosovo</div>
    <div class="carhero">${c.photos.length ? `<img src="${c.photos[0]}" alt="${esc(carTitle(c))}">` : carPhoto(c, "big")}${c.example || c.photoCredit ? `<span class="examplebadge">${t("example")}</span>` : ""}</div>
    ${c.photoCredit ? `<div class="credit">${credit(c)}</div>` : ""}
    <div class="layout">
      <div>
        <h2 style="font-size:22px">${t("carType")} · ${t("hostedBy")}</h2>
        <div class="facts-line">${[tr(CAR_FEATURES[c.seatsLabel]), c.features.includes("automatic") ? tr(CAR_FEATURES.automatic) : null].filter(Boolean).join(" · ")}</div>
        <div class="block"><p>${tr(c.description)}</p></div>
        <div class="block"><h2>${t("carIncl")}</h2><ul class="amen">${c.features.map(f => `<li>${tr(CAR_FEATURES[f])}</li>`).join("")}</ul></div>
        <div class="block" style="border:0"><h2>${t("carPickTitle")}</h2><ul class="paylist">${T[lang].carPickList.map(x => `<li>${x}</li>`).join("")}</ul></div>
      </div>

      <aside class="book">
        <div class="p">€${c.price} <small>${t("perDay")}</small></div>
        <div class="dates">
          <button id="inBtn"><label>${t("pickup")}</label><span id="inTxt">${t("addDate")}</span></button>
          <button id="outBtn"><label>${t("ret")}</label><span id="outTxt">${t("addDate")}</span></button>
        </div>
        <div class="cal" id="cal"></div>
        <label class="placesel"><b>${t("place")}</b>
          <select id="fPlace"><option value="ferizaj">${t("placeFerizaj")}</option><option value="airport">${t("placeAirport")}</option></select></label>
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
        <div class="fine" id="fine">${t("carFine")}</div>
      </aside>
    </div>`;

  return { lang, t, tr, num, pl, title, facts, url, cardHTML, detailHTML, guideHTML, carName, carTitle, plDays, carCardHTML, carDetailHTML };
}

const SHARED = { stayPrice, LONG_STAY, AIRBNB_FEE_PCT, CARS, CAR_FEATURES, ITEMS, GUIDE, DEPOSIT_PCT, MAPS_ON, small, HOST_WHATSAPP, CLEANING_FEE, A, PROPERTIES, T, LANGS, LOCALE, SQ_MONTHS, SQ_MON_SHORT, SQ_DOWS, esc, bySlug, byId, make };
if (typeof module !== "undefined" && module.exports) module.exports = SHARED;
else root.SHARED = SHARED;

})(typeof window !== "undefined" ? window : globalThis);
