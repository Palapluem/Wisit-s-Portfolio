export {};

const root = document.documentElement;
root.classList.add('js-ready');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const desktop = window.matchMedia('(min-width: 64rem)');

/* ---------- Theme: system by default; the toggle remembers an explicit choice ---------- */

const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);
const syncThemeToggle = () => themeToggle?.setAttribute('aria-pressed', String(isDark()));
const applyTheme = (value: 'light' | 'dark') => {
  root.dataset.theme = value;
  try {
    localStorage.setItem('theme', value);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies for this visit.
  }
  syncThemeToggle();
};
syncThemeToggle();
systemDark.addEventListener('change', syncThemeToggle);
themeToggle?.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  if (!('startViewTransition' in document) || reduceMotion.matches) {
    applyTheme(next);
    return;
  }
  const box = themeToggle.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.classList.add('theme-switching');
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready.then(() => {
    root.animate(
      { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
      { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => {});
  transition.finished.finally(() => root.classList.remove('theme-switching'));
});

/* ---------- Pill navigation: mobile sheet and scroll-spy ---------- */

const menuButton = document.querySelector<HTMLButtonElement>('#menu-button');
const navLinks = document.querySelector<HTMLElement>('#primary-nav');
const menuLabel = menuButton?.querySelector<HTMLElement>('[data-menu-label]');

const setMenu = (open: boolean) => {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute('aria-expanded', String(open));
  if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
  navLinks.classList.toggle('is-open', open);
};

menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || menuButton?.getAttribute('aria-expanded') !== 'true') return;
  setMenu(false);
  menuButton.focus();
});
document.addEventListener('click', (event) => {
  if (!navLinks?.classList.contains('is-open')) return;
  const target = event.target;
  if (target instanceof Node && !navLinks.contains(target) && !menuButton?.contains(target)) setMenu(false);
});
desktop.addEventListener('change', () => setMenu(false));

const pill = document.querySelector<HTMLElement>('.pill');
const pillIndicator = pill?.querySelector<HTMLElement>('.pill__indicator');
const currentLink = () => navLinks?.querySelector<HTMLElement>('[aria-current="location"]') ?? null;
const placeIndicator = (link: Element | null) => {
  if (!pill || !pillIndicator) return;
  if (!link || !desktop.matches) {
    pillIndicator.classList.remove('is-on');
    return;
  }
  const pillBox = pill.getBoundingClientRect();
  const box = link.getBoundingClientRect();
  pillIndicator.style.width = box.width + 'px';
  pillIndicator.style.transform = 'translateX(' + (box.left - pillBox.left) + 'px)';
  pillIndicator.classList.add('is-on');
};
navLinks?.addEventListener('pointerover', (event) => {
  const link = event.target instanceof Element ? event.target.closest('.pill__link') : null;
  if (link) placeIndicator(link);
});
navLinks?.addEventListener('pointerleave', () => placeIndicator(currentLink()));
navLinks?.addEventListener('focusin', (event) => placeIndicator(event.target instanceof Element ? event.target : null));
navLinks?.addEventListener('focusout', () => placeIndicator(currentLink()));
window.addEventListener('resize', () => placeIndicator(currentLink()));

const spyLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-spy]'));
const spySections = spyLinks
  .map((link) => document.getElementById(link.dataset.spy ?? ''))
  .filter((section): section is HTMLElement => section !== null);
if ('IntersectionObserver' in window && spySections.length > 0) {
  const setCurrent = (id: string) => {
    for (const link of spyLinks) {
      if (link.dataset.spy === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    if (!navLinks?.matches(':hover')) placeIndicator(currentLink());
  };
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
  }, { rootMargin: '-45% 0px -50% 0px' });
  spySections.forEach((section) => spy.observe(section));
}

/* ---------- Reveals: each element rises (or fades, with reduced motion) once as it enters the viewport ---------- */

const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-gallery], .section-title'));
if (!('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('is-in'));
} else {
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  revealTargets.forEach((element) => reveal.observe(element));
}

/* ---------- Numbers from the work: count up once ---------- */

const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
const formatCount = (element: HTMLElement, value: number) => {
  element.textContent = (element.dataset.prefix ?? '') + Math.round(value).toLocaleString('en-US') + (element.dataset.suffix ?? '');
};
const runCounter = (element: HTMLElement) => {
  const target = Number(element.dataset.count ?? 0);
  const final = element.textContent ?? '';
  const duration = 1400;
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(2, -10 * progress);
    formatCount(element, target * (progress === 1 ? 1 : eased));
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = final;
  };
  requestAnimationFrame(step);
};
if (counters.length > 0 && 'IntersectionObserver' in window) {
  const countObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      runCounter(entry.target as HTMLElement);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.6 });
  counters.forEach((counter) => countObserver.observe(counter));
}

/* ---------- Segmented indicator: a highlight slides to the selected option ---------- */

const segment = (container: HTMLElement | null, selected: string) => {
  if (!container) return () => {};
  const indicator = document.createElement('span');
  indicator.className = 'seg';
  indicator.setAttribute('aria-hidden', 'true');
  container.prepend(indicator);
  container.classList.add('has-seg');
  const place = () => {
    const option = container.querySelector<HTMLElement>(selected);
    if (!option || option.offsetParent === null) {
      indicator.style.opacity = '0';
      return;
    }
    indicator.style.width = option.offsetWidth + 'px';
    indicator.style.height = option.offsetHeight + 'px';
    indicator.style.transform = 'translate(' + option.offsetLeft + 'px, ' + option.offsetTop + 'px)';
    indicator.style.opacity = '1';
  };
  if ('ResizeObserver' in window) new ResizeObserver(place).observe(container);
  requestAnimationFrame(place);
  return place;
};

/* ---------- Competition filter ---------- */

const filterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
const filterTiles = Array.from(document.querySelectorAll<HTMLElement>('[data-gallery] [data-type]'));
const filterStatus = document.querySelector<HTMLElement>('[data-filter-status]');
const placeFilter = segment(document.querySelector<HTMLElement>('[data-filters]'), '[aria-pressed="true"]');
for (const button of filterButtons) {
  button.addEventListener('click', () => {
    const type = button.dataset.filter ?? 'all';
    filterButtons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    let shown = 0;
    for (const tile of filterTiles) {
      const visible = type === 'all' || tile.dataset.type === type;
      const wasHidden = tile.hidden;
      tile.hidden = !visible;
      tile.classList.remove('is-filtered-in');
      if (visible) {
        shown += 1;
        if (wasHidden) {
          void tile.offsetWidth;
          tile.classList.add('is-filtered-in');
        }
      }
    }
    if (filterStatus) filterStatus.textContent = 'Showing ' + shown + (shown === 1 ? ' competition.' : ' competitions.');
    placeFilter();
  });
}

/* ---------- Capabilities explorer: accessible tabs, built from plain sections ---------- */

const explorer = document.querySelector<HTMLElement>('[data-tabs]');
if (explorer) {
  const tablist = explorer.querySelector<HTMLElement>('[data-tablist]');
  const tabs = Array.from(explorer.querySelectorAll<HTMLButtonElement>('[data-tab]'));
  const panels = Array.from(explorer.querySelectorAll<HTMLElement>('[data-panel]'));
  tablist?.setAttribute('role', 'tablist');
  const placeTab = segment(tablist, '[aria-selected="true"]');
  const select = (index: number, focus: boolean) => {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach((panel, panelIndex) => {
      const active = panelIndex === index;
      const wasHidden = panel.hidden;
      panel.hidden = !active;
      panel.classList.remove('is-entering');
      if (active && wasHidden) {
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
    });
    placeTab();
  };
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.addEventListener('click', () => select(index, false));
    tab.addEventListener('keydown', (event) => {
      const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
      const next = keys[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select((next + tabs.length) % tabs.length, true);
    });
  });
  panels.forEach((panel) => {
    panel.setAttribute('role', 'tabpanel');
    const tab = tabs.find((candidate) => candidate.dataset.tab === panel.dataset.panel);
    if (tab) panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
  });
  select(0, false);
}

/* ---------- Pointer effects: page spotlight and card border light; the hero tilt only without reduced motion ---------- */

if (finePointer.matches) {
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const paint = () => {
    frame = 0;
    root.style.setProperty('--mx', pointerX + 'px');
    root.style.setProperty('--my', pointerY + 'px');
  };
  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    root.classList.add('has-pointer');
    if (!frame) frame = requestAnimationFrame(paint);
    const target = event.target;
    const card = target instanceof Element ? target.closest<HTMLElement>('.spot') : null;
    if (card) {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--sx', event.clientX - box.left + 'px');
      card.style.setProperty('--sy', event.clientY - box.top + 'px');
    }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => root.classList.remove('has-pointer'));

  const tilt = document.querySelector<HTMLElement>('[data-tilt]');
  const collage = tilt?.querySelector<HTMLElement>('.collage');
  if (tilt && collage && !reduceMotion.matches) {
    tilt.addEventListener('pointermove', (event) => {
      const box = tilt.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      collage.style.setProperty('--tilt-x', (x * 10).toFixed(2) + 'deg');
      collage.style.setProperty('--tilt-y', (y * -8).toFixed(2) + 'deg');
    });
    tilt.addEventListener('pointerleave', () => {
      collage.style.setProperty('--tilt-x', '0deg');
      collage.style.setProperty('--tilt-y', '0deg');
    });
  }

  if (!reduceMotion.matches) {
    // Cards lean toward the pointer; bigger cards lean less.
    const tiltCards = Array.from(document.querySelectorAll<HTMLElement>('.work-card, .tile, .number, .pager__link, .school, .cred'));
    tiltCards.forEach((card) => card.classList.add('tilt'));
    let tilted: HTMLElement | null = null;
    const resetTilt = (card: HTMLElement) => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };
    // Controls drift a few pixels toward the pointer.
    const magnets = Array.from(document.querySelectorAll<HTMLElement>('.button, .theme-toggle, .marquee-toggle, .socials a'));
    magnets.forEach((magnet) => magnet.classList.add('magnetic'));
    let pulled: HTMLElement | null = null;
    const release = (magnet: HTMLElement) => {
      magnet.style.setProperty('--mag-x', '0px');
      magnet.style.setProperty('--mag-y', '0px');
    };
    window.addEventListener('pointermove', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest<HTMLElement>('.tilt') ?? null;
      if (tilted && tilted !== card) resetTilt(tilted);
      tilted = card;
      if (card) {
        const box = card.getBoundingClientRect();
        const strength = box.width > 480 ? 3 : 6;
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        card.style.setProperty('--rx', (-y * strength).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (x * strength).toFixed(2) + 'deg');
      }
      const magnet = target?.closest<HTMLElement>('.magnetic') ?? null;
      if (pulled && pulled !== magnet) release(pulled);
      pulled = magnet;
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        magnet.style.setProperty('--mag-x', Math.max(-8, Math.min(8, dx * 0.22)).toFixed(1) + 'px');
        magnet.style.setProperty('--mag-y', Math.max(-6, Math.min(6, dy * 0.3)).toFixed(1) + 'px');
      }
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => {
      if (tilted) resetTilt(tilted);
      if (pulled) release(pulled);
      tilted = null;
      pulled = null;
    });
  }
}

/* ---------- Footer clock: local time in Bangkok ---------- */

const clock = document.querySelector<HTMLTimeElement>('[data-local-time]');
if (clock) {
  const format = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const tickClock = () => {
    const now = new Date();
    clock.textContent = format.format(now) + ' (UTC+7)';
    clock.dateTime = now.toISOString();
  };
  tickClock();
  window.setInterval(tickClock, 30000);
}

/* ---------- Scroll progress ---------- */

let progressQueued = false;
const paintProgress = () => {
  progressQueued = false;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  root.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
};
window.addEventListener('scroll', () => {
  if (progressQueued) return;
  progressQueued = true;
  requestAnimationFrame(paintProgress);
}, { passive: true });
paintProgress();

/* ---------- Marquee rows: drift, slow down on hover, drag, and pause ----------
 * The browser runs each row as a Web Animation, so no script touches the page on every frame; that keeps
 * cross-page view transitions intact. The script only changes the playback rate or scrubs the time.
 */

interface MarqueeRow {
  root: HTMLElement;
  track: HTMLElement;
  list: HTMLElement;
  group: string;
  direction: number;
  speed: number;
  loop: number;
  animation: Animation | null;
  ramp: number;
  lastPointerX: number;
  hover: boolean;
  dragging: boolean;
}

const pausedGroups = new Set<string>();
const marqueeRows: MarqueeRow[] = [];
for (const root of Array.from(document.querySelectorAll<HTMLElement>('[data-marquee]'))) {
  const track = root.querySelector<HTMLElement>('[data-marquee-track]');
  const list = track?.querySelector<HTMLElement>('.marquee__list');
  if (!track || !list) continue;
  marqueeRows.push({
    root, track, list,
    group: root.dataset.marqueeGroup ?? '',
    direction: root.dataset.reverse ? 1 : -1,
    // Rows play for everyone; with reduced motion they drift at half speed. The pause button stops them.
    speed: Number(root.dataset.speed ?? 32) * (reduceMotion.matches ? 0.5 : 1),
    loop: 0, animation: null, ramp: 0, lastPointerX: 0,
    hover: false, dragging: false,
  });
}

const targetRate = (row: MarqueeRow) => (pausedGroups.has(row.group) || row.dragging ? 0 : row.hover ? 0.2 : 1);

// Ease the playback rate toward its target so hover and pause feel soft rather than abrupt.
const rampRow = (row: MarqueeRow) => {
  const animation = row.animation;
  if (!animation) return;
  cancelAnimationFrame(row.ramp);
  const from = animation.playbackRate;
  const to = targetRate(row);
  const began = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - began) / 400);
    animation.updatePlaybackRate(from + (to - from) * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) row.ramp = requestAnimationFrame(step);
  };
  row.ramp = requestAnimationFrame(step);
};

// Clone the list until the track covers the row plus one loop, then run one seamless loop forever.
const buildRow = (row: MarqueeRow) => {
  const fraction = row.animation && row.loop ? ((Number(row.animation.currentTime) || 0) % (row.loop / row.speed * 1000)) / (row.loop / row.speed * 1000) : 0;
  row.animation?.cancel();
  row.track.querySelectorAll('[data-clone]').forEach((clone) => clone.remove());
  const gap = parseFloat(getComputedStyle(row.track).columnGap) || 0;
  row.loop = row.list.getBoundingClientRect().width + gap;
  if (row.loop <= gap) return;
  for (let covered = row.loop; covered < row.root.clientWidth + row.loop; covered += row.loop) {
    const clone = row.list.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    clone.dataset.clone = '';
    row.track.append(clone);
  }
  const [from, to] = row.direction < 0 ? [0, -row.loop] : [-row.loop, 0];
  const duration = row.loop / row.speed * 1000;
  row.animation = row.track.animate(
    [{ transform: 'translate3d(' + from + 'px, 0, 0)' }, { transform: 'translate3d(' + to + 'px, 0, 0)' }],
    { duration, iterations: Infinity },
  );
  row.animation.currentTime = fraction * duration;
  row.animation.playbackRate = targetRate(row);
};

if (marqueeRows.length > 0 && 'animate' in Element.prototype) {
  document.documentElement.classList.add('has-marquee');
  for (const button of Array.from(document.querySelectorAll<HTMLButtonElement>('[data-marquee-toggle]'))) {
    const group = button.dataset.marqueeToggle ?? '';
    const sync = () => button.setAttribute('aria-pressed', String(pausedGroups.has(group)));
    sync();
    button.addEventListener('click', () => {
      if (pausedGroups.has(group)) pausedGroups.delete(group);
      else pausedGroups.add(group);
      sync();
      marqueeRows.filter((row) => row.group === group).forEach(rampRow);
    });
  }

  for (const row of marqueeRows) {
    buildRow(row);
    row.root.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      row.hover = true;
      rampRow(row);
    });
    row.root.addEventListener('pointerleave', () => {
      row.hover = false;
      rampRow(row);
    });
    row.root.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || !row.animation) return;
      row.dragging = true;
      row.lastPointerX = event.clientX;
      cancelAnimationFrame(row.ramp);
      row.animation.updatePlaybackRate(0);
      row.root.setPointerCapture(event.pointerId);
      row.root.classList.add('is-dragging');
    });
    row.root.addEventListener('pointermove', (event) => {
      if (!row.dragging || !row.animation || row.loop === 0) return;
      const duration = row.loop / row.speed * 1000;
      const moved = event.clientX - row.lastPointerX;
      row.lastPointerX = event.clientX;
      const time = (Number(row.animation.currentTime) || 0) + row.direction * moved / row.loop * duration;
      row.animation.currentTime = ((time % duration) + duration) % duration;
    });
    const endDrag = (event: PointerEvent) => {
      if (!row.dragging) return;
      row.dragging = false;
      row.root.classList.remove('is-dragging');
      if (row.root.hasPointerCapture(event.pointerId)) row.root.releasePointerCapture(event.pointerId);
      rampRow(row);
    };
    row.root.addEventListener('pointerup', endDrag);
    row.root.addEventListener('pointercancel', endDrag);
  }

  if ('ResizeObserver' in window) {
    const widths = new Map<Element, number>();
    const resize = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.round(entry.contentRect.width);
        if (widths.get(entry.target) === width) continue;
        widths.set(entry.target, width);
        const row = marqueeRows.find((candidate) => candidate.root === entry.target);
        if (row) buildRow(row);
      }
    });
    marqueeRows.forEach((row) => resize.observe(row.root));
  }
  void document.fonts?.ready.then(() => marqueeRows.forEach(buildRow));
  // Hold the rows still while the browser captures the page for a cross-page transition.
  window.addEventListener('pageswap', () => marqueeRows.forEach((row) => row.animation?.pause()));
}

/* ---------- Floating contact pill: shown between the hero and the contact section ---------- */

const floatCta = document.querySelector<HTMLElement>('[data-float-cta]');
if (floatCta) {
  const blockers = new Set<Element>();
  let queued = false;
  const update = () => {
    queued = false;
    floatCta.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8 && blockers.size === 0);
  };
  if ('IntersectionObserver' in window) {
    const watch = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) blockers.add(entry.target);
        else blockers.delete(entry.target);
      }
      update();
    });
    document.querySelectorAll('#contact, .footer').forEach((element) => watch.observe(element));
  }
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

/* ---------- Toast ---------- */

const toast = document.querySelector<HTMLElement>('[data-toast]');
const toastLabel = toast?.querySelector<HTMLElement>('[data-toast-label]');
const toastText = toast?.querySelector<HTMLElement>('[data-toast-text]');
let toastTimer: number | undefined;
const showToast = (label: string, text: string) => {
  if (!toast || !toastLabel || !toastText) return;
  toastLabel.textContent = label;
  toastText.textContent = text;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
};

/* ---------- Copy email ---------- */

const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-email]');
if (copyButton) {
  const label = copyButton.querySelector<HTMLElement>('[data-copy-label]');
  const copyIcon = copyButton.querySelector<HTMLElement>('[data-copy-icon="copy"]');
  const doneIcon = copyButton.querySelector<HTMLElement>('[data-copy-icon="done"]');
  let resetTimer: number | undefined;
  const setCopied = (copied: boolean) => {
    if (label) label.textContent = copied ? 'Copied' : 'Copy';
    if (copyIcon) copyIcon.hidden = copied;
    if (doneIcon) doneIcon.hidden = !copied;
  };
  copyButton.addEventListener('click', async () => {
    window.clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copyEmail ?? '');
      setCopied(true);
      showToast('Email copied', copyButton.dataset.copyEmail ?? '');
    } catch {
      showToast('Copy failed', 'Select the address and copy it instead.');
    }
    resetTimer = window.setTimeout(() => setCopied(false), 2000);
  });
}

/* ---------- Contact form: compose a mail draft ---------- */

const contactForm = document.querySelector<HTMLFormElement>('#contact-form');
const formNote = document.querySelector<HTMLElement>('#form-note');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const subject = encodeURIComponent('Portfolio enquiry from ' + name);
  const body = encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);
  if (formNote) formNote.textContent = 'Opening your email app with a draft. Review it there before sending.';
  window.location.href = 'mailto:wisit.p.2005@gmail.com?subject=' + subject + '&body=' + body;
});
