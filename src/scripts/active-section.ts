export {};

const page = document.documentElement;
page.classList.add('js-ready');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuButton = document.querySelector<HTMLButtonElement>('#menu-icon');
const navbar = document.querySelector<HTMLElement>('#primary-nav');

function closeMenu() {
  if (!menuButton || !navbar) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  menuButton.querySelector('i')?.classList.replace('bx-x', 'bx-menu');
  navbar.classList.remove('active');
}

menuButton?.addEventListener('click', () => {
  if (!navbar) return;
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  menuButton.querySelector('i')?.classList.toggle('bx-menu', isOpen);
  menuButton.querySelector('i')?.classList.toggle('bx-x', !isOpen);
  navbar.classList.toggle('active', !isOpen);
});

navbar?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', (event) => {
  if (!navbar?.classList.contains('active')) return;
  const target = event.target;
  if (target instanceof Node && !navbar.contains(target) && !menuButton?.contains(target)) closeMenu();
});

const photoCarousel = document.querySelector<HTMLElement>('[data-photo-carousel]');
if (photoCarousel) {
  const slides = Array.from(photoCarousel.querySelectorAll<HTMLImageElement>('[data-photo-slide]'));
  const photoButtons = Array.from(photoCarousel.querySelectorAll<HTMLButtonElement>('[data-photo-select]'));
  const toggleButton = photoCarousel.querySelector<HTMLButtonElement>('[data-photo-toggle]');
  const title = photoCarousel.querySelector<HTMLElement>('[data-photo-title-display]');
  const subtitle = photoCarousel.querySelector<HTMLElement>('[data-photo-subtitle-display]');
  let activePhoto = 0;
  let rotationTimer: number | undefined;
  let rotationPaused = reduceMotion;

  const showPhoto = (index: number) => {
    activePhoto = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activePhoto;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    photoButtons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === activePhoto)));
    const current = slides[activePhoto];
    if (title && current) title.textContent = current.dataset.photoTitle ?? '';
    if (subtitle && current) subtitle.textContent = current.dataset.photoSubtitle ?? '';
  };

  const stopRotation = () => {
    if (rotationTimer !== undefined) window.clearInterval(rotationTimer);
    rotationTimer = undefined;
  };
  const startRotation = () => {
    stopRotation();
    if (rotationPaused || document.hidden || slides.length < 2) return;
    rotationTimer = window.setInterval(() => showPhoto(activePhoto + 1), 6500);
  };
  const updateToggle = () => {
    if (!toggleButton) return;
    toggleButton.setAttribute('aria-label', rotationPaused ? 'Resume photo rotation' : 'Pause photo rotation');
    const icon = toggleButton.querySelector('i');
    icon?.classList.toggle('bx-play', rotationPaused);
    icon?.classList.toggle('bx-pause', !rotationPaused);
  };

  photoButtons.forEach((button) => button.addEventListener('click', () => {
    showPhoto(Number(button.dataset.photoSelect ?? 0));
    startRotation();
  }));
  toggleButton?.addEventListener('click', () => {
    rotationPaused = !rotationPaused;
    updateToggle();
    startRotation();
  });
  document.addEventListener('visibilitychange', startRotation);
  showPhoto(0);
  updateToggle();
  startRotation();
}

const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const navigationLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.navbar .nav-link'));
const navigationSections = navigationLinks
  .map((link) => document.querySelector<HTMLElement>(link.hash))
  .filter((section): section is HTMLElement => section !== null);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of navigationLinks) {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-35% 0px -57% 0px' });
  navigationSections.forEach((section) => sectionObserver.observe(section));
}

const educationGrid = document.querySelector<HTMLElement>('[data-education-grid]');
const educationCards = Array.from(document.querySelectorAll<HTMLElement>('[data-education-card]'));
const focusEducationCard = (activeCard: HTMLElement | null) => {
  educationGrid?.classList.toggle('has-focus', activeCard !== null);
  for (const card of educationCards) {
    card.classList.toggle('is-focused', card === activeCard);
    card.classList.toggle('is-muted', activeCard !== null && card !== activeCard);
  }
};

educationGrid?.addEventListener('pointerover', (event) => {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const card = target.closest<HTMLElement>('[data-education-card]');
  if (card) focusEducationCard(card);
});
educationGrid?.addEventListener('pointerleave', () => focusEducationCard(null));
educationGrid?.addEventListener('focusin', (event) => {
  const target = event.target;
  if (target instanceof Element) focusEducationCard(target.closest<HTMLElement>('[data-education-card]'));
});
educationGrid?.addEventListener('focusout', (event) => {
  const next = event.relatedTarget;
  if (!(next instanceof Node) || !educationGrid?.contains(next)) focusEducationCard(null);
});

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
