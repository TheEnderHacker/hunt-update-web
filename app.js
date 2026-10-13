/* Hunt Blood Testament – Browser code; no API keys, analytics or external tracking. */
(() => {
  'use strict';
  const timezone = 'Europe/Berlin';
  const timeline = [...document.querySelectorAll('.timeline-item[data-date]')];
  const filters = [...document.querySelectorAll('.filter')];
  const state = { dateKey: null, filter: 'all' };
  const labels = {
    past: '✓ DATUM BEREITS VORBEI',
    today: '● HEUTE · DATUM ERREICHT',
    future: '◷ TERMIN ANGEKÜNDIGT'
  };
  const $ = (id) => document.getElementById(id);

  // en-CA formatToParts is deliberate: do not parse de-DE date strings.
  function berlinDayKey(date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    const p = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${p.year}-${p.month}-${p.day}`;
  }

  function germanDate(date) {
    return new Intl.DateTimeFormat('de-DE', {
      timeZone: timezone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
  }

  function germanClock(date, seconds = true) {
    return new Intl.DateTimeFormat('de-DE', {
      timeZone: timezone, hour: '2-digit', minute: '2-digit', ...(seconds ? {second:'2-digit'} : {}), hour12: false
    }).format(date);
  }

  function applyFilter() {
    for (const entry of timeline) {
      entry.hidden = state.filter !== 'all' && entry.dataset.type !== state.filter;
    }
    filters.forEach(button => {
      const active = button.dataset.filter === state.filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function redrawEventStatus(day) {
    for (const entry of timeline) {
      const eventDay = entry.dataset.date;
      const status = eventDay < day ? 'past' : eventDay > day ? 'future' : 'today';
      entry.classList.toggle('is-today', status === 'today');
      entry.classList.toggle('is-past', status === 'past');
      const badge = entry.querySelector('.date-badge');
      if (badge) {
        badge.textContent = labels[status];
        badge.dataset.state = status;
      }
    }
    const todayEvents = timeline.filter(entry => entry.dataset.date === day);
    const note = $('today-sub');
    if (todayEvents.length) {
      note.textContent = `Heute auf dem Release-Kalender: ${todayEvents.map(e => e.querySelector('h3')?.textContent).join(' · ')}. Ob Inhalte live freigeschaltet sind, musst du im Spiel prüfen.`;
    } else {
      note.textContent = 'Heute ist kein separat bestätigter Release-Tag eingetragen. Community-Stufen können unabhängig davon freischalten.';
    }
  }

  // Germany changed to winter time on 25 Oct 2026. These are *date boundaries*,
  // explicitly NOT an assertion about when Twitch flips the real campaigns live.
  const twitchCalendarStart = Date.parse('2026-10-25T23:00:00Z'); // Oct 26 00:00 MEZ
  const twitchCalendarEnd = Date.parse('2026-11-09T23:00:00Z'); // Nov 10 00:00 MEZ
  const pad = (n) => String(n).padStart(2, '0');

  function countdown(now) {
    const nowMs = now.getTime();
    let remaining;
    if (nowMs < twitchCalendarStart) {
      $('count-title').textContent = 'BIS ZUM 26. OKTOBER';
      remaining = twitchCalendarStart - nowMs;
    } else if (nowMs < twitchCalendarEnd) {
      $('count-title').textContent = 'BIS ZUM 10. NOVEMBER';
      remaining = twitchCalendarEnd - nowMs;
    } else {
      $('count-title').textContent = 'DATUMSZEITRAUM VORBEI';
      remaining = 0;
    }
    const total = Math.floor(Math.max(0, remaining) / 1000);
    $('count-days').textContent = pad(Math.floor(total / 86400));
    $('count-hours').textContent = pad(Math.floor((total % 86400) / 3600));
    $('count-minutes').textContent = pad(Math.floor((total % 3600) / 60));
    $('count-seconds').textContent = pad(total % 60);
  }

  function tick() {
    const now = new Date();
    const today = berlinDayKey(now);
    $('today-date').textContent = germanDate(now);
    $('today-clock').textContent = `${germanClock(now)} Uhr`;
    $('header-clock').textContent = `BERLIN · ${germanClock(now, false)}`;
    if (today !== state.dateKey) {
      state.dateKey = today;
      redrawEventStatus(today);
    }
    countdown(now);
  }

  filters.forEach(button => button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    applyFilter();
  }));

  $('jump-today')?.addEventListener('click', () => {
    state.filter = 'all';
    applyFilter();
    const today = state.dateKey || berlinDayKey(new Date());
    const currentOrNext = timeline.find(entry => entry.dataset.date >= today) || timeline[timeline.length - 1];
    currentOrNext?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'center'});
  });

  const menuToggle = $('mobile-toggle');
  const mobileNav = $('mobile-nav');
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.textContent = open ? '☰' : '×';
    menuToggle.setAttribute('aria-label', open ? 'Menü öffnen' : 'Menü schließen');
    mobileNav.hidden = open;
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
    menuToggle.setAttribute('aria-label', 'Menü öffnen');
    mobileNav.hidden = true;
  }));

  applyFilter();
  tick();
  window.setInterval(tick, 1000);
})();
