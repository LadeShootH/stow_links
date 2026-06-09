// assets/icons.js
// Lucide Icons als inline SVG – konsistent auf allen Seiten
// Verwendung: icon("calendar") gibt einen <svg>-String zurück
// Größe und Farbe werden per CSS-Klasse gesteuert (currentColor)

window.ICONS = {
  // Inline SVG helper
  get(name, cls = "w-4 h-4 inline-block shrink-0") {
    const paths = {
      "calendar":     `<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>`,
      "clock":        `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
      "map-pin":      `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
      "music":        `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,
      "users":        `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>`,
      "star":         `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
      "star-half":    `<path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2"/><path d="M12 2v15.8l-6.2 3.2 1.2-6.9L2 9.3l7-1L12 2z" fill="currentColor"/>`,
      "ticket":       `<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>`,
      "camera":       `<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>`,
      "search":       `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>`,
      "mail":         `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
      "smartphone":   `<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>`,
      "handshake":    `<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-1"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>`,
      "mic":          `<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/>`,
      "newspaper":    `<path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M8 7h8M8 11h8M8 15h5"/>`,
      "check":        `<path d="M20 6 9 17l-5-5"/>`,
      "arrow-left":   `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`,
      "arrow-right":  `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
      "instagram":    `<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/>`,
      "tiktok":       `<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>`,
      "image-off":    `<path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="2" y1="2" x2="22" y2="22"/>`,
      "map":          `<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>`,
    };
    const d = paths[name];
    if (!d) return "";
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  }
};

// Shorthand
window.icon = (name, cls) => window.ICONS.get(name, cls);
