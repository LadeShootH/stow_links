import React, { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Menu, Calendar, Clock, MapPin as Pin, Instagram, Youtube, Music2, CircleCheck, ArrowLeft } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 256 256" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M168 32h24c4 24 24 40 48 44v24c-18-1-36-7-52-18v86a56 56 0 11-56-56h8v24h-8a32 32 0 1032 32V32z"/>
    </svg>
  );
}

const CLUB_NAME = "STOW301 e.V.";
const CLUB_TAGLINE = "Clubevents • Künstlerförderung • Community";
const CONTACT_EMAIL = "info@stow301.de";
const INSTAGRAM_URL = "https://www.instagram.com/stow.301/";
const HOME_BG_IMAGE_URL = "";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/", icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com/@stow301", icon: TikTokIcon },
  { label: "YouTube", href: "https://youtube.com/", icon: Youtube },
];

const EVENTS = [
  {
    id: "vertigo-halloween-2025",
    title: "VERTIGO Halloween Party",
    date: "2025-10-31",
    startTime: "21:00",
    endTime: "02:00",
    venue: "FreiRaum Hausen",
    address: "",
    music: "Partymix & Halloween Sounds",
    description: "VERTIGO HALLOWEEN PARTY🎃👻",
    longDescription: `VERTIGO HALLOWEEN PARTY🎃👻

Halloween in Forchheim wird legendär! DJ flo.meins bringt euch die besten Beats. Sei dabei und sichere dir jetzt dein Ticket für die größte Halloween Party Forchheims!

Gratis Getränk deiner Wahl bei Verkleidung!🍹`,
    ticketsUrl: "https://vertigo-nights.de/halloween/6",
    cover: "",
  },
  {
    id: "vertigo-opening-2025",
    title: "VERTIGO OPENING",
    date: "2025-07-12",
    venue: "Eventvilla",
    description: "✨ Vertigo Opening ✨",
    longDescription: `✨ Vertigo Opening ✨

Am Wochenende war es endlich soweit: Das erste Vertigo Opening hat stattgefunden. Und was sollen wir sagen? Es war ein voller Erfolg und ein Abend, den wir so schnell nicht vergessen werden! 🙌

Von Beginn an herrschte eine besondere Atmosphäre – Vorfreude, Neugier und jede Menge Energie lagen in der Luft. Mit DJ Marvelz und Nørobeatz hatten wir zwei Künstler am Start, die genau wussten, wie man die Menge packt. Mit ihrem Mix aus satten Bässen, treibenden Beats und abwechslungsreichen Sounds haben sie den Abend geprägt und das Publikum auf eine musikalische Reise geschickt. 🎶🔥

Die Stimmung war ausgelassen, die Leute haben gefeiert, gelacht und die Nacht gemeinsam zelebriert. Es war deutlich zu spüren: Forchheim hat auf ein Event wie dieses gewartet. ✨

Ein riesiges Dankeschön an alle, die gekommen sind, um mit uns die erste Vertigo Night zu erleben. Ihr habt gezeigt, dass hier eine Community entsteht, die zusammen etwas Neues auf die Beine stellt. 🥂🧡

Wir können es kaum erwarten, bald den nächsten Schritt zu gehen. Dies war nur der Anfang. Vertigo Nights wird weiter wachsen, größer werden und noch mehr besondere Momente schaffen. 🚀`,
    music: "Clubsounds",
    stats: { guests: 85, rating: 4.0 },
  },
  {
    id: "fostival-2025",
    title: "FOstival 2025",
    date: "2025-06-28",
    venue: "KulturSommerQuartier",
    description: "",
    longDescription: "",
    music: "Rock, Indie",
    stats: { guests: 110, rating: 3.8 },
  },
];

function parseDate(iso) { const d = new Date(iso + "T00:00:00"); d.setHours(0,0,0,0); return d; }

function deriveEvents(list) {
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = list.filter(e => e.date && parseDate(e.date) >= today).sort((a,b) => parseDate(a.date) - parseDate(b.date));
  const past = list.filter(e => e.date && parseDate(e.date) < today).sort((a,b) => parseDate(b.date) - parseDate(a.date));
  const nextEvent = upcoming[0] || null;
  const lastPast = past[0] || null;
  return { upcoming, past, nextEvent, lastPast };
}

function getAllEvents() { return EVENTS; }

function useHashRoute() {
  const getHash = () => (typeof window !== "undefined" ? window.location.hash.replace("#", "") || "home" : "home");
  const [route, setRoute] = useState(getHash);
  useEffect(() => {
    const onHash = () => setRoute(getHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (id) => { setRoute(id); if (typeof window !== "undefined") window.location.hash = `#${id}`; };
  return [route, go];
}

function formatDate(iso) { const d = new Date(iso + "T00:00:00"); return d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" }); }

function useParallax(speed = 0.35) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const y = -rect.top;
      setOffset(y * speed);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return { ref, offset };
}

const RECAPTCHA_SITE_KEY = "YOUR_RECAPTCHA_SITE_KEY";
const USE_BACKEND = false;
const BACKEND_ENDPOINTS = { contact: "/api/contact", join: "/api/join" };

export default function VereinWebsiteDark() {
  const [route, go] = useHashRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const [consent, setConsent] = useState(null);
  const activeNav = route.startsWith("event/") ? "events" : route;

  const { nextEvent: _next, lastPast: _lastPast } = useMemo(() => deriveEvents(getAllEvents()), []);
  const seoEvent = _next || _lastPast || null;
  const eventJsonLd = useMemo(() => {
    if (!seoEvent) return null;
    const { title, date, startTime, endTime, venue, address, description, ticketsUrl, cover } = seoEvent;
    const start = `${date}T${(startTime || "00:00")}:00+01:00`;
    const end = `${date}T${(endTime || startTime || "00:00")}:00+01:00`;
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: title,
      startDate: start,
      endDate: end,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: venue, address },
      image: cover ? [cover] : undefined,
      description,
      offers: ticketsUrl ? { "@type": "Offer", url: ticketsUrl, availability: "https://schema.org/InStock" } : undefined,
      organizer: { "@type": "Organization", name: CLUB_NAME },
    };
  }, [seoEvent]);

  useEffect(() => {
    if (typeof document !== "undefined" && eventJsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(eventJsonLd);
      document.head.appendChild(script);
      return () => { document.head.removeChild(script); };
    }
  }, [eventJsonLd]);

  return (
    <div className="min-h-screen text-slate-100 bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <nav className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="#home" onClick={() => go("home")} className="flex items-center gap-2 font-semibold">
              <img src="https://stow301.de/images/STOW301_Logo-Modern.svg" alt="STOW301 Logo" className="h-8 w-auto" />
              <span className="tracking-tight">{CLUB_NAME}</span>
            </a>

            <div className="hidden md:flex items-center gap-6">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "Über" },
                { id: "events", label: "Events" },
                { id: "join", label: "Mitglied werden" },
                { id: "contact", label: "Kontakt" },
              ].map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => go(s.id)}
                  className={`relative text-sm px-1 pb-1 transition-colors ${activeNav===s.id ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                  aria-current={activeNav===s.id ? 'page' : undefined}
                >
                  {s.label}
                  {activeNav===s.id && (
                    <motion.span layoutId="nav-underline" className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500" />
                  )}
                </a>
              ))}
            </div>

            <button className="md:hidden p-2 rounded-xl border border-white/10" onClick={() => setMenuOpen((v) => !v)} aria-label="Menü öffnen">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 grid gap-2">
              {["home","about","events","join","contact","impressum","datenschutz"].map((id) => (
                <a key={id} href={`#${id}`} onClick={() => { setMenuOpen(false); go(id); }} className={`px-2 py-2 rounded-2xl hover:bg-white/5 text-slate-200 ${activeNav===id?'bg-white/10':''}`}>
                  {id === "join" ? "Mitglied werden" : id.charAt(0).toUpperCase()+id.slice(1)}
                </a>
              ))}
            </div>
          )}
        </nav>
      </header>

      {route === "home" && <Home go={go} />}
      {route === "about" && <About />}
      {route === "events" && <Events go={go} />}
      {route.startsWith("event/") && <EventDetail id={route.split("/")[1]} go={go} />}
      {route === "join" && <Join />}
      {route === "contact" && <Contact />}
      {route === "impressum" && <Impressum />}
      {route === "datenschutz" && <Datenschutz />}

      <footer className="py-10 border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 md:px-6 grid gap-6 sm:grid-cols-3">
          <div>
            <div className="text-sm text-slate-400">Events für junge Menschen</div>
            <div className="text-xs text-slate-500 mt-2">© {new Date().getFullYear()} {CLUB_NAME}</div>
          </div>
          <div>
            <div className="text-sm text-slate-300 mb-2">Quick Links</div>
            <ul className="grid gap-1 text-sm text-slate-400">
              {[
                { id: "about", label: "Über" },
                { id: "events", label: "Events" },
                { id: "contact", label: "Kontakt" },
              ].map((l) => (
                <li key={l.id}><a href={`#${l.id}`} onClick={() => go(l.id)} className="hover:text-white">{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm text-slate-300 mb-2">Rechtliches</div>
            <ul className="grid gap-1 text-sm text-slate-400">
              <li><a href="#impressum" onClick={() => go("impressum")} className="hover:text-white">Impressum</a></li>
              <li><a href="#datenschutz" onClick={() => go("datenschutz")} className="hover:text-white">Datenschutz</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {consent === null && (
        <div className="fixed bottom-4 inset-x-0 px-4 z-50">
          <Card className="mx-auto max-w-3xl rounded-2xl shadow-lg bg-slate-900 border border-white/10">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-sm text-slate-200">
                Wir verwenden nur technisch notwendige Cookies. Analytik wird erst gesetzt, wenn Sie zustimmen.
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="rounded-2xl bg-slate-800 text-slate-100 hover:bg-slate-700" onClick={() => setConsent("declined")}>Ablehnen</Button>
                <Button className="rounded-2xl bg-pink-600 hover:bg-pink-500 w-full sm:w-auto" onClick={() => setConsent("accepted")}>Zustimmen</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Home({ go }) {
  const { ref: heroRef, offset } = useParallax(0.35);
  const { nextEvent, lastPast } = deriveEvents(getAllEvents());
  const featured = nextEvent || lastPast;
  const featuredIsPast = !nextEvent;
  return (
    <section className="relative overflow-hidden" id="home" ref={heroRef}>
      <div className="absolute inset-0 -z-10" style={{ transform: `translateY(${offset}px)` }}>
        {HOME_BG_IMAGE_URL ? (
          <>
            <img src={HOME_BG_IMAGE_URL} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-fuchsia-950/20 to-slate-900" />
            <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[90rem] h-[90rem] rounded-full bg-pink-700/20 blur-3xl" />
            <div className="absolute -bottom-1/3 right-1/3 w-[80rem] h-[80rem] rounded-full bg-fuchsia-700/15 blur-3xl" />
          </>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 min-h-[calc(100vh-4rem)] grid place-items-center text-center">
        <div>
          <img
            src="https://stow301.de/images/STOW301_Logo-Modern.svg"
            alt="STOW301 Logo"
            className="w-64 h-auto md:w-80 drop-shadow mx-auto"
          />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="rounded-2xl bg-pink-600 hover:bg-pink-500">
              <a href="#events" onClick={() => go("events")}>Nächste Events</a>
            </Button>
            <Button asChild variant="secondary" className="rounded-2xl bg-slate-800 hover:bg-slate-700 text-white">
              <a href="#about" onClick={() => go("about")}>Mehr erfahren</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white text-center">Was ist STOW301?</h2>
          <p className="mt-3 text-slate-300 leading-relaxed text-center max-w-3xl mx-auto">
            Wir sind ein junger Verein aus Forchheim, der Clubevents organisiert, lokale Künstler*innen fördert und eine weltoffene Community zusammenbringt.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild className="rounded-2xl bg-pink-600 hover:bg-pink-500">
              <a href="#about" onClick={() => go("about")}>Mehr über uns</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16">
        <h3 className="text-2xl md:text-3xl font-semibold text-white text-center">{nextEvent ? "Nächstes Event" : "Letztes Event"}</h3>
        <p className="mt-2 text-slate-300 text-center">Verpass nicht unsere nächste Ausgabe.</p>
        <div className="mt-6 max-w-4xl mx-auto">
          {featured ? (
            <EventCard event={featured} isPast={featuredIsPast} onMore={() => go(`event/${featured.id}`)} />
          ) : (
            <div className="text-center text-slate-400">Aktuell keine Events.</div>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="secondary" className="rounded-2xl bg-slate-800 hover:bg-slate-700 text-white">
            <a href="#events" onClick={() => go("events")}>Alle Events ansehen</a>
          </Button>
        </div>
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-300">
          <a href="https://www.instagram.com/stow.301/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/5">
            <Instagram className="w-5 h-5" /> Instagram
          </a>
          <a href="https://tiktok.com/@stow301" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/5">
            <TikTokIcon className="w-5 h-5" /> TikTok
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Was ist {CLUB_NAME}?</h2>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Wir von STOW301 wollen in Forchheims Kulturlandschaft ein Angebot für junge Menschen schaffen. Dafür organisieren wir teils in Eigenregie, teils in Zusammenarbeit mit Partnern coole Festivals, Clubabende und vieles mehr. Gestalte mit uns dein Night-Life in Forchheim - egal ob als Gast auf unserer Veranstaltung, als Ehrenamtlicher bei der Organisation und Durchführung, oder als Künstler auf der Bühne.
          </p>
        </div>
        <ul className="grid gap-3">
          {["Soziales Engagement", "Kultureller Austausch", "Nachwuchsförderung", "Event-Organisation"].map((item) => (
            <li key={item} className="flex items-start gap-3 p-3 rounded-2xl border border-white/10 bg-slate-900">
              <CircleCheck className="w-5 h-5 mt-0.5 text-pink-500" />
              <span className="text-slate-200">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StarRow({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="mt-1 text-pink-500">
      {Array.from({ length: full }).map((_, i) => <span key={`f${i}`}>★</span>)}
      {half && <span>☆</span>}
      {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`}>☆</span>)}
    </div>
  );
}

function EventCard({ event, isPast, onMore }) {
  const rating = isPast && event.stats && typeof event.stats.rating === "number" ? Math.max(0, Math.min(5, event.stats.rating)) : null;
  const day = event.date ? new Date(event.date + "T00:00:00") : null;
  const dd = day ? String(day.getDate()).padStart(2, "0") : "--";
  const month = day ? day.toLocaleString("de-DE", { month: "short" }).toUpperCase() : "--";
  return (
    <Card className="rounded-2xl shadow-xl overflow-hidden bg-slate-900/80 border border-white/10">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
          <div className="shrink-0 w-16 text-center p-2 rounded-xl bg-gradient-to-b from-pink-600 to-pink-400 text-white">
            <div className="text-2xl font-bold leading-none">{dd}</div>
            <div className="text-[10px] tracking-widest mt-1">{month}</div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">{event.title}</h3>
              <div className="hidden sm:block">
                {isPast ? (
                  <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-white/10">Vergangen</span>
                ) : (
                  <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-lime-600 text-white">Tickets verfügbar</span>
                )}
              </div>
            </div>
            <div className="sm:hidden mt-2">
              {isPast ? (
                <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-white/10">Vergangen</span>
              ) : (
                <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-lime-600 text-white">Tickets verfügbar</span>
              )}
            </div>
            <div className="mt-2 grid gap-x-6 gap-y-2 sm:grid-flow-col sm:auto-cols-max text-sm text-slate-300">
              {event.date && <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(event.date)}</div>}
              {(event.startTime || event.endTime) && <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {event.startTime} {event.endTime ? `– ${event.endTime} Uhr` : ""}</div>}
              {event.venue && <div className="flex items-center gap-2"><Pin className="w-4 h-4" /> {event.venue}</div>}
              {event.music && <div className="flex items-center gap-2"><Music2 className="w-4 h-4" /> {event.music}</div>}
              {isPast && event.stats?.guests !== undefined && <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"/> {event.stats.guests} Gäste</div>}
              {isPast && rating !== null && <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"/> {rating.toFixed(1)} / 5</div>}
            </div>
            {event.description && <p className="mt-3 text-sm text-slate-300">{event.description}</p>}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button className="rounded-2xl bg-pink-600 hover:bg-pink-500 w-full sm:w-auto" onClick={() => onMore && onMore()}>Details ansehen</Button>
              {!isPast && event.ticketsUrl && (
                <Button asChild variant="secondary" className="rounded-2xl bg-white text-slate-900 hover:bg-white/90 w-full sm:w-auto">
                  <a href={event.ticketsUrl} target="_blank" rel="noreferrer">Tickets kaufen</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function findEventById(id) { return getAllEvents().find((e) => e.id === id) || null; }

function EventDetail({ id, go }) {
  const e = findEventById(id);
  if (!e) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6 text-slate-200">
          <Button variant="secondary" className="rounded-2xl bg-slate-800 hover:bg-slate-700 mb-6" onClick={() => go("events")}><ArrowLeft className="w-4 h-4 mr-2"/>Zurück</Button>
          <h2 className="text-2xl font-semibold">Event nicht gefunden</h2>
        </div>
      </section>
    );
  }
  const today = new Date(); today.setHours(0,0,0,0);
  const isPast = e.date ? (parseDate(e.date) < today) : false;
  const rating = e.stats && typeof e.stats.rating === "number" ? Math.max(0, Math.min(5, e.stats.rating)) : null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 text-slate-200">
        <Button variant="secondary" className="rounded-2xl bg-slate-800 hover:bg-slate-700 mb-8" onClick={() => go("events")}><ArrowLeft className="w-4 h-4 mr-2"/>Zurück</Button>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900">
          <div className="relative h-[38vh] sm:h-[42vh] min-h-[220px] sm:min-h-[300px] w-full">
            {e.cover ? (
              <img src={e.cover} alt={e.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 to-lime-900/30" />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">{e.title}</h1>
                {e.music && <p className="mt-3 text-slate-200">{e.music}</p>}
                <div className="mt-4">
                  {isPast ? (
                    <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-white/10">Vergangen</span>
                  ) : (
                    e.ticketsUrl && (
                      <Button asChild className="rounded-2xl bg-pink-600 hover:bg-pink-500">
                        <a href={e.ticketsUrl} target="_blank" rel="noreferrer">Tickets</a>
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6 md:gap-10">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-pink-400">Event Details</h2>
            {e.longDescription ? (
              <div className="prose prose-invert max-w-none mt-4 text-slate-300">
                <p>{e.longDescription}</p>
              </div>
            ) : (
              e.description && <p className="mt-4 text-slate-300">{e.description}</p>
            )}

            {isPast && (
              <div className="mt-10">
                <h4 className="text-lg font-semibold text-pink-400">Event Bewertung</h4>
                {rating !== null ? (
                  <div className="mt-2 flex items-center gap-3 text-slate-200">
                    <StarRow rating={rating} />
                    <span className="font-semibold">{rating.toFixed(1)}/5</span>
                  </div>
                ) : (
                  <div className="mt-2 text-slate-400 text-sm">Keine Bewertung vorhanden.</div>
                )}
                {e.stats?.guests !== undefined && (
                  <div className="text-xs text-slate-400 mt-1">Basierend auf {e.stats.guests} Gästen</div>
                )}
              </div>
            )}
          </div>

          <aside className="md:col-span-1">
            <h4 className="text-lg font-semibold text-pink-400">Event Informationen</h4>
            <ul className="mt-4 grid gap-3 text-sm text-slate-300">
              {e.date && <li className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <span><span className="text-slate-400">Datum</span><br/>{formatDate(e.date)}</span></li>}
              {(e.startTime || e.endTime) && <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span><span className="text-slate-400">Zeit</span><br/>{e.startTime} {e.endTime ? `– ${e.endTime} Uhr` : ""}</span></li>}
              {e.venue && <li className="flex items-center gap-2"><Pin className="w-4 h-4" /> <span><span className="text-slate-400">Ort</span><br/>{e.venue}</span></li>}
              <li className="flex items-center gap-2"><Music2 className="w-4 h-4" /> <span><span className="text-slate-400">Genre</span><br/>{e.music || "—"}</span></li>
            </ul>
            <div className="mt-6">
              {isPast ? (
                <Button asChild variant="secondary" className="w-full rounded-2xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-100">
                  <a href={e.galleryUrl || INSTAGRAM_URL} target="_blank" rel="noreferrer">Fotos ansehen</a>
                </Button>
              ) : (
                e.ticketsUrl && (
                  <Button asChild className="w-full rounded-2xl bg-pink-600 hover:bg-pink-500">
                    <a href={e.ticketsUrl} target="_blank" rel="noreferrer">Tickets kaufen</a>
                  </Button>
                )
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Events({ go }) {
  const { upcoming, past } = deriveEvents(getAllEvents());
  return (
    <section id="events" className="py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white text-center">Kommende Events</h2>
        <div className="mt-8 grid gap-6">
          {upcoming.length ? (
            upcoming.map((ev) => (
              <EventCard key={ev.id} event={ev} isPast={false} onMore={() => go(`event/${ev.id}`)} />
            ))
          ) : (
            <div className="text-center text-slate-400">Keine kommenden Events.</div>
          )}
        </div>

        <div className="relative my-14 h-px bg-white/10">
          <span className="absolute left-1/2 -translate-x-1/2 -top-2 block w-24 h-1 rounded-full bg-gradient-to-r from-pink-600 to-lime-600" />
        </div>

        <h3 className="text-3xl font-bold tracking-tight text-white text-center">Vergangene Events</h3>
        <div className="mt-8 grid gap-6">
          {past.map((e) => (
            <EventCard key={e.id} event={e} isPast={true} onMore={() => go(`event/${e.id}`)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Join() {
  const JOIN_TITLE = "Ich will Forchheims Kultur stärken!";
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [motivation, setMotivation] = useState("");
  const [accept, setAccept] = useState(false);
  const [files, setFiles] = useState([]);
  const [captcha, setCaptcha] = useState(null);
  const canMailto = files.length === 0;

  const DOCS = [
    { key: "mitgliedsantrag", label: "Mitgliedsantrag", href: "/docs/mitgliedsantrag.pdf" },
    { key: "satzung", label: "Vereinssatzung", href: "/docs/satzung.pdf" },
    { key: "beitragsordnung", label: "Beitragsordnung", href: "/docs/beitragsordnung.pdf" },
    { key: "datenschutzordnung", label: "Datenschutzordnung", href: "/docs/datenschutzordnung.pdf" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!accept || !captcha) return;
    if (USE_BACKEND) {
      const fd = new FormData();
      fd.append("title", JOIN_TITLE);
      fd.append("first", first);
      fd.append("last", last);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("motivation", motivation);
      fd.append("recaptcha", captcha);
      Array.from(files).forEach((f) => fd.append("files", f));
      try {
        const res = await fetch(BACKEND_ENDPOINTS.join, { method: "POST", body: fd });
        if (!res.ok) throw new Error("failed");
        alert("Antrag gesendet.");
      } catch (err) {
        alert("Senden fehlgeschlagen.");
      }
      return;
    }
    if (!canMailto) {
      alert("Dateiupload erfordert Server-Submit. Bitte PDFs ohne Upload per E-Mail senden oder Backend aktivieren.");
      return;
    }
    const subject = `Mitgliedsantrag – ${JOIN_TITLE}`;
    const body = `Titel: ${JOIN_TITLE}\nName: ${first} ${last}\nE-Mail: ${email}\nTelefon: ${phone}\n\nMotivation:\n${motivation}`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <section id="join" className="py-16 md:py-24 border-y border-white/10 bg-slate-950 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Mitglied werden</h2>
        <p className="mt-2 text-slate-300">Ehrenamtliches Engagement ist wichtig. Hilf uns, die Kulturlandschaft in Forchheim und Umgebung zu stärken und für junge Menschen wieder attraktiv zu machen! Werde Teil des STOW301 e.V. 
Fülle dafür den Mitgliedsantrag aus und schicke ihn uns per E-Mail oder über das Kontaktformular.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {DOCS.map((d) => (
            <div key={d.key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 p-3">
              <div className="text-slate-200 text-sm">{d.label}</div>
              <div className="flex gap-2">
                <Button asChild variant="secondary" className="rounded-2xl bg-slate-800 hover:bg-slate-700 text-white">
                  <a href={d.href} target="_blank" rel="noreferrer">Ansehen</a>
                </Button>
                <Button asChild className="rounded-2xl bg-pink-600 hover:bg-pink-500">
                  <a href={d.href} download>Download</a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Card className="mt-8 rounded-3xl shadow-sm bg-slate-900 border border-white/10">
          <CardContent className="p-6">
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-300">Vorname</label><Input required value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Max" className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
                <div><label className="text-sm text-slate-300">Nachname</label><Input required value={last} onChange={(e) => setLast(e.target.value)} placeholder="Mustermann" className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-300">E-Mail</label><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@example.com" className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
                <div><label className="text-sm text-slate-300">Telefon (optional)</label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49..." className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
              </div>
              <div><label className="text-sm text-slate-300">Titel</label><Input disabled value={JOIN_TITLE} className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
              <div><label className="text-sm text-slate-300">Motivation (optional)</label><Textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="Warum möchtest du mitmachen?" className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
              <div>
                <label className="text-sm text-slate-300">Mitgliedsantrag hochladen (PDF, max. 10 MB)</label>
                <Input type="file" accept="application/pdf" multiple onChange={(e) => setFiles(e.target.files || [])} className="mt-1 bg-slate-800 border-white/10 text-white" />
                {!USE_BACKEND && files.length > 0 && <p className="text-xs text-pink-400 mt-1">Dateiupload erfordert Server-Submit. Aktiviere Backend oder entferne Dateien, um per E‑Mail zu senden.</p>}
              </div>
              <label className="flex items-start gap-2 text-sm text-slate-300 select-none">
                <input type="checkbox" className="mt-1" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
                <span>Ich akzeptiere die Satzung, Beitragsordnung und Datenschutzordnung.</span>
              </label>
              <div className="scale-[0.9] sm:scale-100 origin-left"><ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setCaptcha} /></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                <div className="text-xs text-slate-400">Mit dem Senden akzeptierst du unsere Datenschutzhinweise.</div>
                <Button type="submit" disabled={!accept || !captcha || (!USE_BACKEND && !canMailto)} className="rounded-2xl bg-pink-600 hover:bg-pink-500">Antrag senden</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Contact() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [captcha, setCaptcha] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!captcha) return;
    if (USE_BACKEND) {
      try {
        setSending(true);
        const res = await fetch(BACKEND_ENDPOINTS.contact, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ first, last, email, message, recaptcha: captcha }) });
        if (!res.ok) throw new Error("failed");
        alert("Nachricht gesendet.");
      } catch (err) {
        alert("Senden fehlgeschlagen.");
      } finally {
        setSending(false);
      }
      return;
    }
    const subject = `Kontakt: ${first} ${last}`.trim();
    const body = `Name: ${first} ${last}\nE-Mail: ${email}\n\nNachricht:\n${message}`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <section id="contact" className="py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Kontakt</h2>
          <p className="mt-2 text-slate-300">Lass uns über dein Anliegen sprechen.</p>
          <div className="mt-6 grid gap-3 text-slate-200">
            <a className="flex items-center gap-2" href={`mailto:${CONTACT_EMAIL}`}><Mail className="w-4 h-4" /> {CONTACT_EMAIL}</a>
            <a className="flex items-center gap-2" href="tel:+491234567890"><Phone className="w-4 h-4" /> +49 123 4567890</a>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Musterstraße 1, 91301 Forchheim</div>
          </div>
        </div>

        <Card className="rounded-3xl shadow-sm bg-slate-900 border border-white/10">
          <CardContent className="p-6">
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-300">Vorname</label><Input required value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Max" className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
                <div><label className="text-sm text-slate-300">Nachname</label><Input required value={last} onChange={(e) => setLast(e.target.value)} placeholder="Mustermann" className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
              </div>
              <div><label className="text-sm text-slate-300">E-Mail</label><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@example.com" className="mt-1 bg-slate-800 border-white/10 text-white" /></div>
              <div><label className="text-sm text-slate-300">Nachricht</label><Textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Deine Nachricht..." className="mt-1 bg-slate-800 border-white/10 text-white min-h-[120px]" /></div>
              <div className="scale-[0.9] sm:scale-100 origin-left"><ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setCaptcha} /></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                <div className="text-xs text-slate-400">Mit dem Senden akzeptierst du unsere Datenschutzhinweise.</div>
                <Button type="submit" disabled={sending || !captcha} className="rounded-2xl bg-pink-600 hover:bg-pink-500">{sending ? "Senden…" : "Senden"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Impressum() {
  return (
    <section id="impressum" className="py-16 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Impressum</h2>
        <div className="mt-4 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
STOW301 e.V.
Verein mit Sitz in Forchheim
Vereinsregister des Amtsgerichts Bamberg
Nummer des Vereins: VR 201301

1. Vorsitzender

Timo Mayer
Am Hohen Zorn 38
91301 Forchheim

Email: info@stow301.de
Telefon: +49 1573 0780520 (WhatsApp)

Ansprechpartner für die Homepage
Leon Fleß
Email: leon.fless@stow301.de
        </div>
      </div>
    </section>
  );
}

function Datenschutz() {
  return (
    <section id="datenschutz" className="py-16 md:py-24 border-y border-white/10 bg-slate-950 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Datenschutzerklärung</h2>
        <div className="mt-4 text-slate-300 text-sm leading-relaxed space-y-3">
          <p>Verantwortlicher: {CLUB_NAME}, Adresse, Kontakt.</p>
          <p>Zwecke der Datenverarbeitung: Betrieb der Website, Kommunikation, Veranstaltungsmanagement.</p>
          <p>Rechtsgrundlagen: Art. 6 Abs. 1 lit. b, f DSGVO.</p>
          <p>Hosting/Logfiles, Cookies, Analyse nur mit Einwilligung, Kontakt- & Beitrittsformular.</p>
          <p>Betroffenenrechte: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit, Beschwerderecht.</p>
          <p>Auftragsverarbeiter & Drittlandtransfer falls zutreffend.</p>
        </div>
      </div>
    </section>
  );
}
