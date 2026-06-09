// assets/events.js
//
// ╔══════════════════════════════════════════════════════════════════╗
// ║  SEO-FELDER – Was wird wo verwendet?                            ║
// ║                                                                  ║
// ║  id            → URL: event.html?id=DEIN-ID                     ║
// ║                  Tipp: kurz, lowercase, nur Bindestriche         ║
// ║                                                                  ║
// ║  title         → <title>-Tag, OG:title, JSON-LD name            ║
// ║                                                                  ║
// ║  date          → JSON-LD startDate, Sortierung, robots noindex   ║
// ║                  Format: "YYYY-MM-DD"                            ║
// ║                                                                  ║
// ║  description   → <meta name="description"> (max. 155 Zeichen!)  ║
// ║                  OG:description, Twitter:description             ║
// ║                  WICHTIG: Kurz & prägnant, kein Emoji-Spam       ║
// ║                                                                  ║
// ║  cover         → OG:image, Twitter:image, JSON-LD image         ║
// ║                  Ideal: 1200×630px JPG                           ║
// ║                  Wenn leer: Fallback auf Icon.png                ║
// ║                                                                  ║
// ║  venue         → JSON-LD location.name, Wegbeschreibung-Text     ║
// ║                                                                  ║
// ║  address       → Wegbeschreibungs-Button (nur wenn gesetzt!)     ║
// ║                  Entweder maps.app.goo.gl-URL oder Textadresse   ║
// ║                                                                  ║
// ║  ticketsUrl    → JSON-LD offers, Ticket-Button                   ║
// ║                  Wenn leer: Button zeigt "Abendkasse"            ║
// ║                                                                  ║
// ║  longDescription → Freitext auf der Detailseite (kein SEO-Limit) ║
// ╚══════════════════════════════════════════════════════════════════╝

window.EVENTS = [
  {
    id: "fachwerk-festival-2026",
    title: "Fachwerk Festival",
    date: "2026-09-12",
    startTime: "18:30",
    endTime: "22:30",
    venue: "Junges Theater Forchheim",
    address: "https://maps.app.goo.gl/Q9Y1NRGs73UgKjhW7",
    music: "Indie, Pop, Rock",
    // description: max. 155 Zeichen für Google
    description: "Newcomer Festival in Forchheim – Bands auf der Bühne, Jury-Voting und Livemusik im Jungen Theater Forchheim.",
    cover: "", // Tipp: 1200×630px Bild hochladen für Social Sharing
    longDescription: `Das Fachwerk Festival findet am 12. September im Jungen Theater Forchheim statt. 🩷 
Es bietet Newcomer-Bands eine Plattform, um sich Forchheims Undergroundfans zu präsentieren.
Zum Abschluss der Veranstaltung findet ein Voting statt, bei dem Du gemeinsam mit einer Jury entscheidest, welche Band am stärksten war und den Hauptpreis verdient hat!

Erlebe folgende Acts:
- SYN
- LisaRuftAn
- HalfStepDown
- CHARM


Mit freundlicher Unterstützung unserer Sponsoren:
  <div class="grid grid-cols-2 gap-4 my-6">
    <img 
      src="https://fachwerkfestival.de/images/logo-holzbau-bluemlein.jpg"
      alt="Holzbau Blümlein"
      class="rounded-2xl w-full object-cover">
    <img 
      src="https://fachwerkfestival.de/images/logo-ortungslogistik.svg"
      alt="Ortungslogistik"
      class="rounded-2xl w-full object-cover">
  </div>`,
  },
  {
    id: "tiefgaragenrave-2026",
    title: "Tiefgaragen-Rave",
    date: "2026-05-16",
    startTime: "18:30",
    endTime: "23:00",
    venue: "Möbel Fischer",
    address: "", // Adresse/Maps-Link eintragen für Wegbeschreibungs-Button
    music: "Techno, Hard Techno, Schranz",
    description: "TIEFGARAGEN RAVE in einer echten Tiefgarage – Techno, Hard Techno & Schranz. Streng limitierte Kapazität.",
    ticketsUrl: "https://www.eventim-light.com/de/a/6830dbf9953bfc2f71f4cf9b/e/69dd07c3033faf7a4fb2e52c/?campaign=STOW",
    cover: "", // Tipp: Eventbild hier eintragen
    stats: { guests: 400, rating: 4.9 },
    longDescription: `TIEFGARAGEN RAVE: UNIQUE EXPERIENCE⛓️‍💥

RAVE IN DER TIEFGARAGE

Tief unter der Stadt. Beton. Dunkelheit. Druck auf der Brust. ⛓️‍💥
Für wenige Stunden verwandelt sich eine echte Tiefgarage einmalig in einen kompromisslosen Techno Rave. Roh. Industriell. Laut.
Starke Visuals und ein Sound, der den gesamten Raum einnimmt. Reduziert auf das, was wirklich zählt. 😮‍💨
TECHNO - HARD TECHNO - SCHRANZ ⛓️‍💥

LINE-UP 🎧
@noro_ofc
@finn_schaller
@felx.wav

WICHTIG:
Einmalige Rave Experience mit streng limitierter Kapazität.
Nur Bass, Beton und Menschen, die genau dafür gekommen sind.

Sicher dir JETZT dein Ticket. 🎟️

Großes Danke an Möbel Fischer für diese krasse Location 🫶🏼`,
  },
  {
    id: "fostival-2026",
    title: "FOstival 2026",
    date: "2026-07-03",
    startTime: "17:00",
    endTime: "23:00",
    venue: "KulturSommerQuartier",
    address: "",
    music: "Indie, Pop, Rock, Metal",
    description: "Jugendfestival Forchheim 2026 – Newcomer-Bands, Beats und Spaß ab 16 im KulturSommerQuartier.",
    cover: "https://stow301.de/images/events/fostival2026.jpg",
    longDescription: `Das FOstival kommt zurück – frischer, lauter und jetzt für alle ab 16! 
Freu dich auf coole Beats, spannende Acts und jede Menge Spaß mit Leuten, die genauso feiern wie du. 
Programm, Specials und weitere Highlights verraten wir bald – also stay tuned und sei dabei, wenn wir den Sommer im KulturSommerQuartier richtig abfeiern!`,
  },
  {
    id: "vertigo-silvester-2025",
    title: "VERTIGO Silvester Party",
    date: "2025-12-31",
    startTime: "21:00",
    endTime: "03:00",
    venue: "Eventvilla Forchheim",
    address: "",
    music: "2000er & 2010er",
    description: "Silvester 2025 in Forchheim – die 2000er & 2010er Party mit DJ Curse, XXL-Feuerwerk und Gratis Shots.",
    ticketsUrl: "https://vertigo-nights.de/silvester/23pna",
    cover: "https://stow301.de/images/events/djcurse.jpg",
    stats: { guests: 110, rating: 4.6 },
    longDescription: `SILVESTER 2025 – DIE 2000er & 2010er PARTY DES JAHRES! 🎆🎉

Feier mit uns den Jahreswechsel zu den besten Hits der 2000er und 2010er! DJ Curse sorgt im Main Set für unvergessliche Vibes, während DI.FFO euch mit seinem Pre-Act perfekt auf die Nacht einstimmt. Erlebe ein XXL-Feuerwerk, sichere dir Gratis Shots und finde mit unseren Beziehungsbändern vielleicht sogar dein Perfect Match fürs neue Jahr!

Lass das alte Jahr hinter dir und starte 2026 mit einem Knall – Party, Beats und Erinnerungen, die bleiben! 🥂✨`,
  },
  {
    id: "vertigo-halloween-2025",
    title: "VERTIGO Halloween Party",
    date: "2025-10-31",
    startTime: "21:00",
    endTime: "02:00",
    venue: "FreiRaum Hausen",
    address: "",
    music: "Partymix & Halloween Sounds",
    description: "VERTIGO Halloween Party 2025 im FreiRaum Hausen – Bodennebel, Deko, DJ flo.meins & DI.FFO, 120 Gäste.",
    ticketsUrl: "",
    stats: { guests: 120, rating: 4.9 },
    cover: "https://stow301.de/images/events/vertigo-halloween.jpg",
    longDescription: `Halloween im FreiRaum Hausen war dieses Jahr einfach nächste Stufe! Schon beim Reinkommen war klar: Das wird kein normaler Freitagabend. Nebelschwaden zogen über den Boden, gruselige Lichter flackerten durch den Raum, und überall tummelten sich Vampire, Hexen und Zombies - die Stimmung war von Anfang an elektrisierend. ⚡️

DI.FFO sorgte mit seinem Pre-Set direkt für den perfekten Einstieg, bevor DJ flo.meins mit seinem unverwechselbaren Halloween Mix die Tanzfläche komplett übernommen hat. Von 21 bis 2 Uhr wurde getanzt, gefeiert und mitgesungen - der FreiRaum hat gebebt! Der Nebel hat für die richtige Portion Gänsehaut gesorgt, während die aufwendige Deko das Ganze in eine richtige Horrorfilm-Kulisse verwandelt hat. 🕸️💀

Und natürlich durfte unser Klassiker nicht fehlen: Gratis Getränk für alle Verkleideten! 🍹 Das kam super an – genauso wie die großartige Community, die diese Nacht zu dem gemacht hat, was sie war: legendär.

Ihr wart der absolute Wahnsinn! Danke an alle, die dabei waren - ihr habt Halloween in Forchheim unvergesslich gemacht. 🔥🧡`,
  },
  {
    id: "vertigo-opening-2025",
    title: "VERTIGO OPENING",
    date: "2025-07-12",
    startTime: "20:00",
    endTime: "02:00",
    venue: "Eventvilla Forchheim",
    address: "",
    music: "Clubsounds",
    description: "Das erste Vertigo Opening in der Eventvilla Forchheim – DJ Marvelz & Nørobeatz, 85 Gäste, unvergessliche Nacht.",
    stats: { guests: 85, rating: 4.0 },
    cover: "https://stow301.de/images/events/vertigo-opening.png",
    longDescription: `✨ Vertigo Opening ✨

Am Wochenende war es endlich soweit: Das erste Vertigo Opening hat stattgefunden. Und was sollen wir sagen? Es war ein voller Erfolg und ein Abend, den wir so schnell nicht vergessen werden! 🙌

Von Beginn an herrschte eine besondere Atmosphäre – Vorfreude, Neugier und jede Menge Energie lagen in der Luft. Mit DJ Marvelz und Nørobeatz hatten wir zwei Künstler am Start, die genau wussten, wie man die Menge packt. Mit ihrem Mix aus satten Bässen, treibenden Beats und abwechslungsreichen Sounds haben sie den Abend geprägt und das Publikum auf eine musikalische Reise geschickt. 🎶🔥

Die Stimmung war ausgelassen, die Leute haben gefeiert, gelacht und die Nacht gemeinsam zelebriert. Es war deutlich zu spüren: Forchheim hat auf ein Event wie dieses gewartet. ✨

Ein riesiges Dankeschön an alle, die gekommen sind, um mit uns die erste Vertigo Night zu erleben. Ihr habt gezeigt, dass hier eine Community entsteht, die zusammen etwas Neues auf die Beine stellt. 🥂🧡

Wir können es kaum erwarten, bald den nächsten Schritt zu gehen. Dies war nur der Anfang. Vertigo Nights wird weiter wachsen, größer werden und noch mehr besondere Momente schaffen. 🚀`,
  },
  {
    id: "fostival-2025",
    title: "FOstival 2025",
    date: "2025-06-28",
    startTime: "14:00",
    endTime: "22:00",
    venue: "KulturSommerQuartier",
    address: "",
    music: "Rock, Indie",
    description: "FOstival 2025 im KulturSommerQuartier Forchheim – Jugendfestival mit Left Fudge, SYN & freaky vanilla.",
    stats: { guests: 110, rating: 3.8 },
    cover: "https://stow301.de/images/events/fostival25.png",
    longDescription: `Das FOstival ging 2025 in die dritte Runde – dieses Mal im Kultursommerquartier beim Königsbad.
    Auf Jugendliche ab 12 Jahren warteten Angebote für die Freizeitgestaltung, Spiele, Kunst und viel Musik. 🎨
    Ab 14 Uhr konnten Jugendliche auf dem Gelände gemeinsam feiern oder einfach chillen. 
    Ab 17 Uhr wurden verschiedene Music-Acts zum Tanzen eingeladen. Bis 22 Uhr konnte dann gemeinsam gefeiert werden. 💃
    Folgende Bands hat STOW301 euch mitgebracht:
    - Left Fudge
    - SYN
    - freaky vanilla`,
  },
  {
    id: "silent-disco-2025",
    title: "SILENT DISCO",
    date: "2025-01-31",
    dateEnd: "2025-02-01",
    startTime: "18:00",
    endTime: "22:00",
    cover: "https://stow301.de/images/events/SilentDisco2025.jpg",
    venue: "Kellerwald Winterzauber",
    address: "",
    music: "EDM, Techno, House, Hip-Hop",
    description: "Silent Disco beim Kellerwald Winterzauber Forchheim – 3 Kanäle, Techno, House & Hip-Hop auf Kopfhörer.",
    stats: { guests: 150, rating: 4.2 },
    longDescription: `❄️ SILENT DISCO beim Kellerwald WINTERZAUBER ❄️

    Am 31. Januar & 01. Februar verwandelte sich der obere Festplatz im Kellerwald in einen technoiden Spielplatz mit mehreren DJs, die feinsten Techno, House und Hip-Hop direkt in euere Ohren zauberten. 
    Auf drei verschiedenen Kanälen spielten mehrere DJs treibende Musik, nur für euch! 🥶 
    
    Was wir im Angebot hatten:
    31.01.2025:
    - 18 Uhr: DJ Curse (Tech House)
    - 20 Uhr: flo.meins (EDM)
    01.02.2025:
    - 18 Uhr: Alan Oey (Techno)
    - 20 Uhr: DJ YOYI (Trance)`,
  },
];
