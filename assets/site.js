// ====== Config & Data ======
const CLUB = {
  name: "STOW301 e.V.",
  email: "info@stow301.de",
  instagram: "https://www.instagram.com/stow.301/",
};

const DOCS = [
  { key: "mitgliedsantrag", label: "Mitgliedsantrag", href: "/ressources/Mitgliedsantrag.pdf" },
  { key: "satzung", label: "Vereinssatzung", href: "/ressources/STOW301eV_Vereinssatzung.pdf" },
  { key: "beitragsordnung", label: "Beitragsordnung", href: "/ressources/Beitragsordnung_STOW301.pdf" },
  { key: "datenschutzordnung", label: "Datenschutzordnung", href: "/ressources/Datenschutzordnung_STOW301.pdf" },
];

const USE_BACKEND = false;
const BACKEND = {
  contact: "/api/contact",
  join: "/api/join",
  recaptchaVerify: "/api/recaptcha-verify",
};

// ====== Utils ======
const EVENTS = window.EVENTS || [];

const endDateOf = (e) => e.dateEnd || e.date;
const fmtDateRange = (a, b) => (a === b ? fmtDate(a) : `${fmtDate(a)} – ${fmtDate(b)}`);
const fmtTime = (t) => (t || "").replace(/^(\d{1,2}):(\d{2}).*$/, "$1:$2");
const fmtTimeRange = (a, b) => (a && b ? `${fmtTime(a)} – ${fmtTime(b)}` : (a || b ? fmtTime(a || b) : ""));
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
const fmtDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
const parseDate = (iso) => { const d = new Date(`${iso}T00:00:00`); d.setHours(0,0,0,0); return d; };

// ====== FIX: Wegbeschreibung nur anzeigen wenn explizit gesetzt ======
// Früher wurde immer ein Maps-Link aus `venue` gebaut, auch wenn keine Adresse vorhanden war.
// Jetzt: Link nur wenn `mapsLink` explizit gesetzt ODER `address` eine URL oder Adressangabe ist.
function buildMapsLink(e) {
  if (!e) return null;
  // Expliziter Maps-Link hat höchste Priorität
  if (e.mapsLink && e.mapsLink.trim()) return e.mapsLink.trim();
  // address nur verwenden wenn es eine echte URL oder Adressangabe ist (nicht leer)
  if (e.address && e.address.trim()) {
    const addr = e.address.trim();
    // Wenn es eine vollständige URL ist (z.B. maps.app.goo.gl), direkt zurückgeben
    if (/^https?:\/\//i.test(addr)) return addr;
    // Sonst als Google-Maps-Suche encodieren
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.replace(/\s+/g, "+"))}`;
  }
  // Kein Link → null (kein Wegbeschreibungs-Button wird gerendert)
  return null;
}

// ====== FIX: Ticket-Status korrekt bestimmen ======
// Früher wurde für alle upcoming Events "Tickets verfügbar" gezeigt, egal ob ticketsUrl gesetzt war.
// Jetzt gibt es drei Zustände: vergangen / tickets verfügbar / kein Vorverkauf
function ticketStatus(e, isPast) {
  if (isPast) return "past";
  if (e.ticketsUrl && e.ticketsUrl.trim()) return "available";
  return "none";
}

function statusPill(e, isPast) {
  const status = ticketStatus(e, isPast);
  if (status === "past") {
    return `<span class="inline-flex items-center text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-white/10">Vergangen</span>`;
  }
  if (status === "available") {
    return `<span class="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>Tickets verfügbar
    </span>`;
  }
  // none: kommendes Event ohne Vorverkauf
  return `<span class="inline-flex items-center text-xs px-3 py-1 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30">Abendkasse</span>`;
}

function splitEvents(list) {
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = list
    .filter(e => e.date && parseDate(endDateOf(e)) >= today)
    .sort((a,b) => parseDate(a.date) - parseDate(b.date));
  const past = list
    .filter(e => e.date && parseDate(endDateOf(e)) < today)
    .sort((a,b) => parseDate(endDateOf(b)) - parseDate(endDateOf(a)));
  return { upcoming, past, nextEvent: upcoming[0] || null, lastPast: past[0] || null };
}

function starRow(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
}

// ====== Event Card (überarbeitet & modernisiert) ======
function eventCardHTML(e, isPast) {
  const day = e.date ? new Date(`${e.date}T00:00:00`) : null;
  const dd = day ? String(day.getDate()).padStart(2,"0") : "--";
  const month = day ? day.toLocaleString("de-DE", { month: "short" }).toUpperCase() : "--";
  const rating = isPast && e.stats && typeof e.stats.rating === "number" ? Math.max(0, Math.min(5, e.stats.rating)) : null;

  return `
  <a href="event.html?id=${encodeURIComponent(e.id)}" class="block group">
    <div class="rounded-2xl overflow-hidden border border-white/10 bg-slate-900/80 hover:border-pink-500/40 hover:bg-slate-900 transition-all duration-200 shadow-lg hover:shadow-pink-900/20">
      <div class="flex flex-col sm:flex-row">
        ${e.cover ? `
          <div class="sm:w-48 sm:shrink-0 h-40 sm:h-auto overflow-hidden">
            <img src="${e.cover}" alt="${e.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          </div>` : `
          <div class="sm:w-48 sm:shrink-0 h-40 sm:h-auto bg-gradient-to-br from-pink-900/40 via-fuchsia-900/30 to-slate-900 flex items-center justify-center">
            <span class="text-4xl opacity-40">🎵</span>
          </div>`}
        <div class="p-5 flex-1 flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="shrink-0 w-12 text-center py-1.5 px-1 rounded-xl bg-gradient-to-b from-pink-600 to-pink-500 text-white shadow-md">
                <div class="text-xl font-bold leading-none">${dd}</div>
                <div class="text-[9px] tracking-widest mt-0.5 opacity-90">${month}</div>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">${e.title}</h3>
                ${e.venue ? `<div class="text-xs text-slate-400 mt-0.5">📍 ${e.venue}</div>` : ""}
              </div>
            </div>
            <div class="shrink-0 hidden sm:block">${statusPill(e, isPast)}</div>
          </div>

          <div class="sm:hidden">${statusPill(e, isPast)}</div>

          <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            ${e.date ? `<span>🗓 ${fmtDateRange(e.date, endDateOf(e))}</span>` : ""}
            ${(e.startTime || e.endTime) ? `<span>⏰ ${e.startTime || ""}${e.endTime ? ` – ${e.endTime} Uhr` : ""}</span>` : ""}
            ${e.music ? `<span>🎵 ${e.music}</span>` : ""}
            ${isPast && e.stats?.guests !== undefined ? `<span>👥 ${e.stats.guests} Gäste</span>` : ""}
            ${isPast && rating !== null ? `<span class="text-pink-400">★ ${rating.toFixed(1)}/5</span>` : ""}
          </div>

          ${e.description ? `<p class="text-sm text-slate-400 line-clamp-2">${e.description}</p>` : ""}

          <div class="mt-auto flex flex-wrap gap-2 pt-1">
            <span class="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-pink-600/20 border border-pink-500/30 text-pink-300 text-sm group-hover:bg-pink-600 group-hover:text-white transition-all">Details ansehen →</span>
            ${!isPast && e.ticketsUrl ? `<span class="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm">🎟 Tickets kaufen</span>` : ""}
          </div>
        </div>
      </div>
    </div>
  </a>`;
}

// ====== JSON-LD für Events (nur einmal aufrufen!) ======
function injectJSONLD(event) {
  if (!event) return;
  const start = `${event.date}T${(event.startTime || "00:00")}:00+01:00`;
  const endDate = endDateOf(event);
  const end = `${endDate}T${(event.endTime || event.startTime || "00:00")}:00+01:00`;
  const obj = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: start,
    endDate: end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Forchheim",
        addressRegion: "BY",
        addressCountry: "DE"
      }
    },
    image: event.cover ? [event.cover] : ["https://stow301.de/images/Icon.png"],
    description: event.longDescription || event.description || "",
    organizer: { "@type": "Organization", name: CLUB.name, url: "https://stow301.de" },
  };
  if (event.ticketsUrl) {
    obj.offers = { "@type": "Offer", url: event.ticketsUrl, availability: "https://schema.org/InStock" };
  }
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(obj);
  document.head.appendChild(s);
}

// ====== SEO-Hilfsfunktionen ======
function setMetaTag(name, content, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

function setEventPageSEO(e) {
  const title = `${e.title} – STOW301 e.V.`;
  const desc = `${e.title} am ${fmtDate(e.date)} in ${e.venue || "Forchheim"}${e.music ? " · " + e.music : ""} – von STOW301 e.V.`;
  const image = e.cover || "https://stow301.de/images/Icon.png";
  const url = `https://stow301.de/event.html?id=${encodeURIComponent(e.id)}`;

  document.title = title;
  setMetaTag("description", desc);
  setCanonical(url);

  // Open Graph
  setMetaTag("og:title", title, true);
  setMetaTag("og:description", desc, true);
  setMetaTag("og:image", image, true);
  setMetaTag("og:url", url, true);
  setMetaTag("og:type", "website", true);

  // Twitter Card
  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", title);
  setMetaTag("twitter:description", desc);
  setMetaTag("twitter:image", image);
}

// ====== Header/Footer ======
function renderHeader(active) {
  const nav = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "about", label: "Über", href: "about.html" },
    { id: "events", label: "Events", href: "events.html" },
    { id: "artists", label: "Künstlerförderung", href: "artists.html" },
    { id: "join", label: "Mitglied werden", href: "join.html" },
    { id: "contact", label: "Kontakt", href: "contact.html" },
  ];

  const header = qs("#header");
  header.innerHTML = `
  <header class="sticky top-0 inset-x-0 z-50 border-b border-white/10 backdrop-blur bg-slate-950/70 supports-[backdrop-filter]:bg-slate-950/40">
    <nav class="mx-auto max-w-6xl px-4 md:px-6">
      <div class="flex items-center justify-between h-16">
        <a href="index.html" class="flex items-center" aria-label="${CLUB.name} – Startseite">
          <img src="https://stow301.de/images/STOW301_Logo-Modern.svg" alt="STOW301 e.V." class="h-8 w-auto" />
        </a>
        <div class="hidden md:flex items-center gap-6">
          ${nav.map(s => `
            <a class="nav-link text-sm ${active===s.id ? "text-white" : "text-slate-300 hover:text-white"}"
               aria-current="${active===s.id ? "page" : ""}" href="${s.href}">
               ${s.label}
            </a>`).join("")}
        </div>
        <button class="md:hidden p-2 rounded-xl border border-white/10" id="menu-btn" aria-label="Menü öffnen">☰</button>
      </div>
      <div class="md:hidden pb-4 grid gap-2 hidden" id="mobile-menu">
        ${[...nav, {id:"impressum", label:"Impressum", href:"impressum.html"}, {id:"datenschutz", label:"Datenschutz", href:"datenschutz.html"}]
          .map(s => `
            <a class="px-2 py-2 rounded-2xl hover:bg-white/5 text-slate-200 ${active===s.id ? "bg-white/10" : ""}"
               href="${s.href}">
               ${s.label}
            </a>
        `).join("")}
      </div>
    </nav>
  </header>`;

  const btn = qs("#menu-btn");
  const menu = qs("#mobile-menu");
  if (btn && menu) btn.addEventListener("click", () => menu.classList.toggle("hidden"));
}

function renderFooter() {
  const footer = qs("#footer");
  footer.innerHTML = `
  <footer class="py-10 border-t border-white/10 bg-slate-950">
    <div class="mx-auto max-w-6xl px-4 md:px-6 grid gap-6 sm:grid-cols-3">
      <div>
        <div class="text-sm text-slate-400">Events für junge Menschen</div>
        <div class="text-xs text-slate-500 mt-2">© ${new Date().getFullYear()} ${CLUB.name}</div>
      </div>
      <div>
        <div class="text-sm text-slate-300 mb-2">Quick Links</div>
        <ul class="grid gap-1 text-sm text-slate-400">
          <li><a class="hover:text-white" href="about.html">Über</a></li>
          <li><a class="hover:text-white" href="events.html">Events</a></li>
          <li><a class="hover:text-white" href="contact.html">Kontakt</a></li>
        </ul>
      </div>
      <div>
        <div class="text-sm text-slate-300 mb-2">Rechtliches</div>
        <ul class="grid gap-1 text-sm text-slate-400">
          <li><a class="hover:text-white" href="impressum.html">Impressum</a></li>
          <li><a class="hover:text-white" href="datenschutz.html">Datenschutz</a></li>
        </ul>
      </div>
    </div>
  </footer>`;
}

// ====== Page initializers ======
function initHome() {
  renderHeader("home"); renderFooter();

  const hero = qs("[data-parallax]");
  const layers = qsa("[data-hero-layer]", hero);
  const onScroll = () => {
    const rect = hero.getBoundingClientRect();
    const y = -rect.top;
    layers.forEach((el, i) => el.style.transform = `translateY(${y * (0.15 + i*0.05)}px)`);
  };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  const { nextEvent, lastPast } = splitEvents(EVENTS);
  const featured = nextEvent || lastPast;
  if (featured) {
    qs("#home-featured-event").innerHTML = eventCardHTML(featured, !nextEvent);
    qs("#home-event-title").textContent = nextEvent ? "Nächstes Event" : "Letztes Event";
    injectJSONLD(featured);
  } else {
    qs("#home-featured-event").innerHTML = `<div class="text-center text-slate-400">Aktuell keine Events.</div>`;
  }
}

function initEvents() {
  renderHeader("events"); renderFooter();
  const { upcoming, past } = splitEvents(EVENTS);

  const upcomingEl = qs("#events-upcoming");
  const pastEl = qs("#events-past");

  if (upcoming.length) {
    upcomingEl.innerHTML = upcoming.map(e => eventCardHTML(e, false)).join("");
  } else {
    upcomingEl.innerHTML = `<div class="text-center py-12 text-slate-400">
      <div class="text-3xl mb-3">📅</div>
      <p>Aktuell keine kommenden Events geplant.</p>
      <p class="text-sm mt-1 text-slate-500">Folge uns auf Instagram für Updates!</p>
    </div>`;
  }

  if (past.length) {
    pastEl.innerHTML = past.map(e => eventCardHTML(e, true)).join("");
  } else {
    pastEl.innerHTML = `<div class="text-center text-slate-400">Noch keine vergangenen Events.</div>`;
  }
}

function initEventDetail() {
  renderHeader("events"); renderFooter();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const e = EVENTS.find(x => x.id === id);
  const root = qs("#event-detail");

  if (!e) {
    root.innerHTML = `
      <div class="text-center py-20">
        <div class="text-5xl mb-4">🔍</div>
        <h2 class="text-2xl font-semibold text-white">Event nicht gefunden</h2>
        <p class="mt-2 text-slate-400">Das gesuchte Event existiert nicht oder wurde entfernt.</p>
        <a href="events.html" class="inline-flex items-center mt-6 px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white">Alle Events ansehen</a>
      </div>`;
    return;
  }

  // SEO: Titel, Meta-Tags und OG-Tags dynamisch setzen
  setEventPageSEO(e);
  // JSON-LD nur EINMAL injizieren
  injectJSONLD(e);

  const maps = buildMapsLink(e);
  const today = new Date(); today.setHours(0,0,0,0);
  const isPast = e.date ? parseDate(endDateOf(e)) < today : false;
  const rating = e.stats && typeof e.stats.rating === "number" ? Math.max(0, Math.min(5, e.stats.rating)) : null;
  const status = ticketStatus(e, isPast);

  root.innerHTML = `
    <div class="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900">
      <div class="relative h-[38vh] sm:h-[42vh] min-h-[220px] sm:min-h-[300px] w-full">
        ${e.cover
          ? `<img src="${e.cover}" alt="${e.title}" class="absolute inset-0 w-full h-full object-cover">`
          : `<div class="absolute inset-0 bg-gradient-to-br from-pink-900/40 to-lime-900/30"></div>`}
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">${e.title}</h1>
            ${e.music ? `<p class="mt-3 text-slate-200">${e.music}</p>` : ""}
            <div class="mt-4 flex items-center justify-center gap-3 flex-wrap">
              ${statusPill(e, isPast)}
              ${!isPast && status === "available" ? `<a href="${e.ticketsUrl}" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-medium shadow-lg">🎟 Tickets sichern</a>` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 grid md:grid-cols-3 gap-6 md:gap-10">
      <div class="md:col-span-2">
        <h2 class="text-2xl font-bold text-pink-400">Event Details</h2>
        ${e.longDescription
          ? `<div class="prose prose-invert max-w-none mt-4 text-slate-300 whitespace-pre-line">${e.longDescription}</div>`
          : (e.description ? `<p class="mt-4 text-slate-300">${e.description}</p>` : "")}
        ${isPast ? `
          <div class="mt-10 p-5 rounded-2xl border border-white/10 bg-slate-900/60">
            <h4 class="text-lg font-semibold text-pink-400">Event Bewertung</h4>
            ${rating !== null ? `
              <div class="mt-2 flex items-center gap-3 text-slate-200">
                <span class="text-pink-400 text-xl">${starRow(rating)}</span>
                <span class="font-bold text-lg text-white">${rating.toFixed(1)}<span class="text-slate-400 font-normal text-sm">/5</span></span>
              </div>` : `<div class="mt-2 text-slate-400 text-sm">Keine Bewertung vorhanden.</div>`}
            ${e.stats?.guests !== undefined ? `<div class="text-xs text-slate-500 mt-1">Basierend auf ${e.stats.guests} Gästen</div>` : ""}
          </div>` : ""}
      </div>

      <aside class="md:col-span-1">
        <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h4 class="text-base font-semibold text-pink-400 mb-4">Event Informationen</h4>
          <ul class="grid gap-4 text-sm">
            ${e.date ? `
              <li class="flex items-start gap-3">
                <span class="text-lg leading-none mt-0.5">🗓</span>
                <div><div class="text-slate-500 text-xs uppercase tracking-wide mb-0.5">Datum</div>
                <div class="text-slate-200">${e.dateEnd && e.dateEnd !== e.date ? `${fmtDate(e.date)} – ${fmtDate(e.dateEnd)}` : fmtDate(e.date)}</div></div>
              </li>` : ""}
            ${e.startTime || e.endTime ? `
              <li class="flex items-start gap-3">
                <span class="text-lg leading-none mt-0.5">⏰</span>
                <div><div class="text-slate-500 text-xs uppercase tracking-wide mb-0.5">Uhrzeit</div>
                <div class="text-slate-200">${e.startTime || ""}${e.endTime ? ` – ${e.endTime} Uhr` : ""}</div></div>
              </li>` : ""}
            ${e.venue ? `
              <li class="flex items-start gap-3">
                <span class="text-lg leading-none mt-0.5">📍</span>
                <div><div class="text-slate-500 text-xs uppercase tracking-wide mb-0.5">Location</div>
                <div class="text-slate-200">${e.venue}</div></div>
              </li>` : ""}
            ${e.music ? `
              <li class="flex items-start gap-3">
                <span class="text-lg leading-none mt-0.5">🎵</span>
                <div><div class="text-slate-500 text-xs uppercase tracking-wide mb-0.5">Musik</div>
                <div class="text-slate-200">${e.music}</div></div>
              </li>` : ""}
          </ul>

          <div class="mt-6 grid gap-2">
            ${maps ? `<a href="${maps}" target="_blank" rel="noreferrer noopener" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm w-full transition-colors">📍 Wegbeschreibung</a>` : ""}
            ${isPast
              ? `<a href="${e.galleryUrl || CLUB.instagram}" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-100 text-sm w-full transition-colors">📸 Fotos ansehen</a>`
              : (status === "available" ? `<a href="${e.ticketsUrl}" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium w-full transition-colors">🎟 Tickets kaufen</a>` : "")}
          </div>
        </div>
      </aside>
    </div>
  `;
}

function initArtists() {
  renderHeader("artists");
  renderFooter();
}

function initJoin() {
  renderHeader("join"); renderFooter();

  const cont = qs("#join-docs");
  if (cont) {
    cont.innerHTML = DOCS.map(d => `
      <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 p-3">
        <div class="text-slate-200 text-sm">${d.label}</div>
        <div class="flex gap-2">
          <a href="${d.href}" target="_blank" rel="noreferrer" class="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white">Ansehen</a>
          <a href="${d.href}" download class="px-3 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500">Download</a>
        </div>
      </div>`).join("");
  }

  const form = qs("#join-form");
  if (!form) return;

  const note = qs("#join-upload-note");
  let captchaToken = "";
  window.onJoinCaptcha = (token) => { captchaToken = token; };

  form.addEventListener("change", () => {
    const hasFiles = (form.elements["files"] && form.elements["files"].files && form.elements["files"].files.length > 0);
    if (note) note.hidden = !hasFiles || USE_BACKEND;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if (!fd.get("accept")) return alert("Bitte akzeptiere die Ordnungen.");
    if (!captchaToken) return alert("Bitte reCAPTCHA bestätigen.");

    if (USE_BACKEND) {
      fd.append("recaptcha", captchaToken);
      try {
        const res = await fetch(BACKEND.join, { method: "POST", body: fd });
        if (!res.ok) throw new Error("failed");
        alert("Antrag gesendet.");
      } catch { alert("Senden fehlgeschlagen."); }
      return;
    }

    const files = form.elements["files"]?.files || [];
    if (files.length > 0) return alert("Dateiupload per Mail nicht möglich. Bitte Backend aktivieren oder ohne Upload per E-Mail senden.");
    const subject = `Mitgliedsantrag – Ich will Forchheims Kultur stärken!`;
    const body =
`Titel: Ich will Forchheims Kultur stärken!
Name: ${fd.get("first")} ${fd.get("last")}
E-Mail: ${fd.get("email")}
Telefon: ${fd.get("phone") || ""}

Motivation:
${fd.get("motivation") || ""}`;
    location.href = `mailto:${CLUB.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function initContact() {
  renderHeader("contact"); renderFooter();
  const form = qs("#contact-form");
  let captchaToken = "";
  window.onContactCaptcha = (token) => { captchaToken = token; };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if (!captchaToken) return alert("Bitte reCAPTCHA bestätigen.");
    if (USE_BACKEND) {
      try {
        const res = await fetch(BACKEND.contact, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ first: fd.get("first"), last: fd.get("last"), email: fd.get("email"), message: fd.get("message"), recaptcha: captchaToken })
        });
        if (!res.ok) throw new Error("failed");
        alert("Nachricht gesendet.");
      } catch { alert("Senden fehlgeschlagen."); }
      return;
    }
    const subject = `Kontakt: ${fd.get("first")} ${fd.get("last")}`.trim();
    const body = `Name: ${fd.get("first")} ${fd.get("last")}
E-Mail: ${fd.get("email")}

Nachricht:
${fd.get("message")}`;
    location.href = `mailto:${CLUB.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function initImpressum() { renderHeader("impressum"); renderFooter(); }
function initDatenschutz() { renderHeader("datenschutz"); renderFooter(); }
function initAbout() { renderHeader("about"); renderFooter(); }

// ====== Router ======
(function () {
  const path = new URL(location.href).pathname.replace(/\/+$/, "").toLowerCase();
  let base = path.split("/").pop() || "index";
  if (base.endsWith(".html")) base = base.slice(0, -5);

  const byDom = () => {
    if (document.querySelector("#events-upcoming")) return "events";
    if (document.querySelector("#event-detail"))    return "event";
    if (document.querySelector('[data-page="artists"]')) return "artists";
    if (document.querySelector("#join-form"))       return "join";
    if (document.querySelector("#contact-form"))    return "contact";
    if (document.querySelector("#impressum"))       return "impressum";
    if (document.querySelector("#datenschutz"))     return "datenschutz";
    if (document.querySelector("#hero"))            return "index";
    return null;
  };

  const byTitle = () => {
    const t = (document.title || "").toLowerCase();
    if (t.includes("events"))      return "events";
    if (t.includes("event –"))     return "event";
    if (t.includes("mitglied"))    return "join";
    if (t.includes("kontakt"))     return "contact";
    if (t.includes("impressum"))   return "impressum";
    if (t.includes("datenschutz")) return "datenschutz";
    if (t.includes("über") || t.includes("ueber")) return "about";
    return null;
  };

  const page = ["index","about","events","event","join","contact","impressum","datenschutz"].includes(base)
    ? base
    : (byDom() || byTitle() || "index");

  const map = {
    index: initHome,
    about: initAbout,
    events: initEvents,
    event: initEventDetail,
    join: initJoin,
    contact: initContact,
    impressum: initImpressum,
    datenschutz: initDatenschutz,
    artists: initArtists
  };

  (map[page] || initHome)();
})();
