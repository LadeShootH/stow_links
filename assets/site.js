
// ====== Config & Data ======
const CLUB = {
  name: "STOW301 e.V.",
  email: "info@stow301.de",
  instagram: "https://www.instagram.com/stow.301/",
};

const DOCS = [
  { key: "mitgliedsantrag", label: "Mitgliedsantrag", href: "docs/mitgliedsantrag.pdf" },
  { key: "satzung", label: "Vereinssatzung", href: "docs/satzung.pdf" },
  { key: "beitragsordnung", label: "Beitragsordnung", href: "docs/beitragsordnung.pdf" },
  { key: "datenschutzordnung", label: "Datenschutzordnung", href: "docs/datenschutzordnung.pdf" },
];


const USE_BACKEND = false; // set true and configure BACKEND_* below to actually upload/verify
const BACKEND = {
  contact: "/api/contact",
  join: "/api/join",
  recaptchaVerify: "/api/recaptcha-verify",
};

// ====== Utils ======
// Events auslagern
const EVENTS = window.EVENTS || [];

// Mehrtages-Support
const endDateOf = (e) => e.dateEnd || e.date;
const fmtDateRange = (a, b) => (a === b ? fmtDate(a) : `${fmtDate(a)} – ${fmtDate(b)}`);

const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
const fmtDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
const parseDate = (iso) => { const d = new Date(`${iso}T00:00:00`); d.setHours(0,0,0,0); return d; };

function splitEvents(list) {
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = list
    .filter(e => e.date && parseDate(endDateOf(e)) >= today)
    .sort((a,b) => parseDate(a.date) - parseDate(b.date)); // Startdatum

  const past = list
    .filter(e => e.date && parseDate(endDateOf(e)) < today)
    .sort((a,b) => parseDate(endDateOf(b)) - parseDate(endDateOf(a))); // Enddatum

  return { upcoming, past, nextEvent: upcoming[0] || null, lastPast: past[0] || null };
}

function starRow(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
}

function statusPill(isPast) {
  return isPast
    ? `<span class="inline-flex items-center text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-white/10">Vergangen</span>`
    : `<span class="inline-flex items-center text-xs px-3 py-1 rounded-full bg-lime-600 text-white">Tickets verfügbar</span>`;
}

function eventCardHTML(e, isPast) {
  const day = e.date ? new Date(`${e.date}T00:00:00`) : null;
  const dd = day ? String(day.getDate()).padStart(2,"0") : "--";
  const month = day ? day.toLocaleString("de-DE", { month: "short" }).toUpperCase() : "--";
  const rating = isPast && e.stats && typeof e.stats.rating === "number" ? Math.max(0, Math.min(5, e.stats.rating)) : null;
  return `
  <div class="rounded-2xl shadow-xl overflow-hidden bg-slate-900/80 border border-white/10">
    <div class="p-4 sm:p-5">
      <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <div class="shrink-0 w-16 text-center p-2 rounded-xl bg-gradient-to-b from-pink-600 to-pink-400 text-white">
          <div class="text-2xl font-bold leading-none">${dd}</div>
          <div class="text-[10px] tracking-widest mt-1">${month}</div>
        </div>
        <div class="flex-1">
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-xl font-semibold text-white">${e.title}</h3>
            <div class="hidden sm:block">${statusPill(isPast)}</div>
          </div>
          <div class="sm:hidden mt-2">${statusPill(isPast)}</div>
          <div class="mt-2 grid gap-x-6 gap-y-2 sm:grid-flow-col sm:auto-cols-max text-sm text-slate-300">
            ${e.date ? `<div class="flex items-center gap-2">🗓 ${fmtDateRange(e.date, endDateOf(e))}</div>` : ""}            ${(e.startTime || e.endTime) ? `<div class="flex items-center gap-2">⏰ ${e.startTime || ""} ${e.endTime ? `– ${e.endTime} Uhr` : ""}</div>` : ""}
            ${e.venue ? `<div class="flex items-center gap-2">📍 ${e.venue}</div>` : ""}
            ${e.music ? `<div class="flex items-center gap-2">🎵 ${e.music}</div>` : ""}
            ${isPast && e.stats?.guests !== undefined ? `<div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block"></span> ${e.stats.guests} Gäste</div>` : ""}
            ${isPast && rating !== null ? `<div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block"></span> ${rating.toFixed(1)} / 5</div>` : ""}
          </div>
          ${e.description ? `<p class="mt-3 text-sm text-slate-300">${e.description}</p>` : ""}
          <div class="mt-4 flex flex-col sm:flex-row gap-3">
            <a href="event.html?id=${encodeURIComponent(e.id)}" class="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500 w-full sm:w-auto">Details ansehen</a>
            ${!isPast && e.ticketsUrl ? `<a href="${e.ticketsUrl}" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-white text-slate-900 hover:bg-white/90 w-full sm:w-auto">Tickets kaufen</a>` : ""}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function injectJSONLD(event) {
  if (!event) return;
  const start = `${event.date}T${(event.startTime || "00:00")}:00+01:00`;
  const end = `${event.date}T${(event.endTime || event.startTime || "00:00")}:00+01:00`;
  const obj = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: start,
    endDate: end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: event.venue, address: event.address || "" },
    image: event.cover ? [event.cover] : undefined,
    description: event.description || "",
    offers: event.ticketsUrl ? { "@type": "Offer", url: event.ticketsUrl, availability: "https://schema.org/InStock" } : undefined,
    organizer: { "@type": "Organization", name: CLUB.name },
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(obj);
  document.head.appendChild(s);
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
  <header class="sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
    <nav class="mx-auto max-w-6xl px-4 md:px-6">
      <div class="flex items-center justify-between h-16">
        <a href="index.html" class="flex items-center gap-2 font-semibold">
          <img src="https://stow301.de/images/STOW301_Logo-Modern.svg" alt="STOW301 Logo" class="h-8 w-auto" />
          <span class="tracking-tight">${CLUB.name}</span>
        </a>
        <div class="hidden md:flex items-center gap-6">
          ${nav.map(s => `<a class="nav-link text-sm ${active===s.id ? 'text-white' : 'text-slate-300 hover:text-white'}" aria-current="${active===s.id ? 'page' : ''}" href="${s.href}">${s.label}</a>`).join("")}
        </div>
        <button class="md:hidden p-2 rounded-xl border border-white/10" id="menu-btn" aria-label="Menü öffnen">☰</button>
      </div>
      <div class="md:hidden pb-4 grid gap-2 hidden" id="mobile-menu">
        ${[...nav, {id:"impressum", label:"Impressum", href:"impressum.html"}, {id:"datenschutz", label:"Datenschutz", href:"datenschutz.html"}].map(s => `
          <a class="px-2 py-2 rounded-2xl hover:bg-white/5 text-slate-200 ${active===s.id ? 'bg-white/10' : ''}" href="${s.href}">${s.label}</a>
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

  // Parallax for hero layers
  const hero = qs('[data-parallax]');
  const layers = qsa('[data-hero-layer]', hero);
  const onScroll = () => {
    const rect = hero.getBoundingClientRect();
    const y = -rect.top;
    layers.forEach((el, i) => el.style.transform = `translateY(${y * (0.15 + i*0.05)}px)`);
  };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Featured event
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
  qs("#events-upcoming").innerHTML = upcoming.length ? upcoming.map(e => eventCardHTML(e, false)).join("") : `<div class="text-center text-slate-400">Keine kommenden Events.</div>`;
  qs("#events-past").innerHTML = past.map(e => eventCardHTML(e, true)).join("");
}

function initEventDetail() {
  renderHeader("events"); renderFooter();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const e = EVENTS.find(x => x.id === id);
  const root = qs("#event-detail");
  if (!e) {
    root.innerHTML = `<h2 class="text-2xl font-semibold">Event nicht gefunden</h2>`;
    return;
  }
  const today = new Date(); today.setHours(0,0,0,0);
  const isPast = e.date ? parseDate(endDateOf(e)) < today : false;
  const rating = e.stats && typeof e.stats.rating === "number" ? Math.max(0, Math.min(5, e.stats.rating)) : null;

  root.innerHTML = `
    <div class="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900">
      <div class="relative h-[38vh] sm:h-[42vh] min-h-[220px] sm:min-h-[300px] w-full">
        ${e.cover ? `<img src="${e.cover}" alt="${e.title}" class="absolute inset-0 w-full h-full object-cover">` : `<div class="absolute inset-0 bg-gradient-to-br from-pink-900/40 to-lime-900/30"></div>`}
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">${e.title}</h1>
            ${e.music ? `<p class="mt-3 text-slate-200">${e.music}</p>` : ""}
            <div class="mt-4">${isPast ? statusPill(true) : (e.ticketsUrl ? `<a href="${e.ticketsUrl}" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500">Tickets</a>` : "")}</div>
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
          <div class="mt-10">
            <h4 class="text-lg font-semibold text-pink-400">Event Bewertung</h4>
            ${rating !== null ? `<div class="mt-2 flex items-center gap-3 text-slate-200"><span class="text-pink-500">${starRow(rating)}</span><span class="font-semibold">${rating.toFixed(1)}/5</span></div>` : `<div class="mt-2 text-slate-400 text-sm">Keine Bewertung vorhanden.</div>`}
            ${e.stats?.guests !== undefined ? `<div class="text-xs text-slate-400 mt-1">Basierend auf ${e.stats.guests} Gästen</div>` : ""}
          </div>` : ""}
      </div>
      <aside class="md:col-span-1">
        <h4 class="text-lg font-semibold text-pink-400">Event Informationen</h4>
        <ul class="mt-4 grid gap-3 text-sm text-slate-300">
          ${e.date ? `<li class="flex items-center gap-2">🗓 <span><span class="text-slate-400">Datum</span><br>${fmtDateRange(e.date, endDateOf(e))}</span></li>` : ""}
          <li class="flex items-center gap-2">🎵 <span><span class="text-slate-400">Genre</span><br>${e.music || "—"}</span></li>
        </ul>
        <div class="mt-6">
          ${isPast ? `<a href="${e.galleryUrl || CLUB.instagram}" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-100 w-full">Fotos ansehen</a>`
                   : (e.ticketsUrl ? `<a href="${e.ticketsUrl}" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500 w-full">Tickets kaufen</a>` : "")}
        </div>
      </aside>
    </div>
  `;
const startDate = e.date;
const endDate = endDateOf(e);
const start = `${startDate}T${(e.startTime || "00:00")}:00+01:00`;
const end   = `${endDate}T${(e.endTime || e.startTime || "00:00")}:00+01:00`;
  injectJSONLD(e);
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
  const submitBtn = qs("#join-submit");
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
  const form = qs("#contact-form"); const submitBtn = qs("#contact-submit"); let captchaToken = "";
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

// ====== Router (robust gegen Unterordner, Slash, Groß-/Kleinschreibung) ======
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
