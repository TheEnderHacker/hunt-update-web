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


  // Fixed published dates are safe to compare with the Berlin calendar. They are
  // NOT live server checks and must never change the state of community unlocks.
  const fixedReleases = [
    {date:'2026-09-08', label:'Chapter 1 · Burgess', detail:'Blood Testament & Update 2.9', href:'#release-sept8'},
    {date:'2026-10-05', label:'Update 2.9.1', detail:'Cursed Kin & Profil-Avatare', href:'#release-oct5'},
    {date:'2026-10-06', label:'Chapter 2 · Flame Rifle', detail:'Inferno & Firefighter Supply', href:'#release-oct6'},
    {date:'2026-10-07', label:'Bound in Blood DLC', detail:'Kosmetische DLC-Inhalte', href:'#release-oct7'},
    {date:'2026-10-13', label:'All Hallows’ Cleave', detail:'Event- und Gegner-Start; KEIN automatischer Stage-5-Unlock', href:'#release-oct13'},
    {date:'2026-10-26', label:'Twitch Drops starten', detail:'26.10.–09.11.; genaue Uhrzeit nicht bestätigt', href:'#release-oct26'},
    {date:'2026-11-09', label:'Twitch Drops: letzter Kalendertag', detail:'Keine fest bestätigte Enduhrzeit', href:'#release-nov9'}
  ];
  function shortDate(dayKey) {
    return new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit', timeZone:timezone})
      .format(new Date(`${dayKey}T12:00:00Z`));
  }
  function renderReleaseRows(targetId, entries, currentDay) {
    const target = $(targetId);
    if (!target) return;
    target.replaceChildren();
    for (const entry of entries) {
      const li = document.createElement('li');
      const date = document.createElement('span');
      date.className = 'quick-release-date';
      date.textContent = shortDate(entry.date);
      const body = document.createElement('div');
      body.className = 'quick-release-text';
      const title = document.createElement('strong');
      const link = document.createElement('a');
      link.href = entry.href;
      link.textContent = entry.label + ' ↗';
      title.append(link);
      const detail = document.createElement('small');
      detail.textContent = entry.detail;
      const badge = document.createElement('span');
      badge.className = 'quick-release-pill' + (entry.date === currentDay ? ' today' : '');
      badge.textContent = entry.date < currentDay ? 'TERMIN VORBEI' : entry.date === currentDay ? 'HEUTE · UHRZEIT OFFEN' : 'NOCH GEPLANT';
      body.append(title, detail, badge);
      li.append(date, body);
      target.append(li);
    }
    if (!entries.length) {
      const placeholder = document.createElement('li');
      placeholder.className = 'quick-empty';
      placeholder.textContent = targetId === 'release-done' ? 'Noch keine vergangenen Veröffentlichungstage.' : 'Kein weiterer fester Termin angekündigt. Community-Stufen können trotzdem freischalten.';
      target.append(placeholder);
    }
  }
  function renderQuickDashboard(today, now) {
    $('status-asof').textContent = new Intl.DateTimeFormat('de-DE', {
      timeZone: timezone, day:'numeric',month:'long',year:'numeric'
    }).format(now);
    const past = fixedReleases.filter(r => r.date < today && r.date !== '2026-11-09');
    const todayOrFuture = fixedReleases.filter(r => r.date >= today).slice(0, 3);
    // End date is not an actual new content release; do not count it as released content.
    $('release-done-count').textContent = String(past.length);
    renderReleaseRows('release-done', past, today);
    renderReleaseRows('release-next', todayOrFuture, today);
    document.querySelectorAll('[data-release-status]').forEach(badge => {
      const published = badge.dataset.releaseStatus;
      badge.textContent = published < today ? `✓ DATUM ERREICHT · SEIT ${shortDate(published)}` :
        published === today ? `◷ HEUTE ANGEKÜNDIGT · UHRZEIT OFFEN` :
        `◷ ANGEKÜNDIGT FÜR ${shortDate(published)}`;
    });
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
      renderQuickDashboard(today, now);
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
