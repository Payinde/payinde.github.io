const body = document.body;
const root = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.site-nav a');
const year = document.querySelector('[data-year]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeLabel = document.querySelector('[data-theme-label]');
const themeIcon = document.querySelector('[data-theme-icon]');
const themeColorMeta = document.querySelector('[data-theme-color]');
const themeKey = 'ayinde-portfolio-theme';

if (year) year.textContent = new Date().getFullYear();

const applyTheme = (theme) => {
  const selected = theme === 'light' ? 'light' : 'dark';
  root.setAttribute('data-theme', selected);
  if (themeLabel) themeLabel.textContent = selected === 'dark' ? 'Dark' : 'Light';
  if (themeIcon) themeIcon.textContent = selected === 'dark' ? '🌙' : '☀️';
  if (themeToggle) themeToggle.setAttribute('aria-label', `Switch to ${selected === 'dark' ? 'light' : 'dark'} mode`);
  if (themeColorMeta) themeColorMeta.setAttribute('content', selected === 'dark' ? '#0b1220' : '#f7fafc');
};

const savedTheme = localStorage.getItem(themeKey);
applyTheme(savedTheme || 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeKey, next);
    applyTheme(next);
  });
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}
navLinks.forEach(link => link.addEventListener('click', () => {
  body.classList.remove('nav-open');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}));

const rotating = document.querySelector('.hero-rotate');
if (rotating) {
  const phrases = rotating.dataset.roles.split(',').map(v => v.trim()).filter(Boolean);
  const longest = Math.max(...phrases.map(v => v.length), rotating.textContent.length);
  rotating.style.setProperty('--role-width', `${longest}ch`);
  rotating.setAttribute('aria-live', 'polite');

  let index = 0;
  const rotatePhrase = () => {
    rotating.classList.add('is-changing');

    window.setTimeout(() => {
      index = (index + 1) % phrases.length;
      rotating.textContent = phrases[index];
      rotating.classList.remove('is-changing');
    }, 520);
  };

  window.setInterval(rotatePhrase, 4200);
}

const feed = document.querySelector('[data-feed]');
if (feed) {
  const lines = [
    '[triage] alert reviewed: suspicious process chain...',
    '[ioc] URL, domain, hash, and user-agent captured...',
    '[pcap] DNS and HTTP traffic correlated...',
    '[iam] access request validated against approval...',
    '[dfir] persistence check queued: tasks, WMI, Run keys...',
    '[report] remediation and lessons learned documented...',
    '[skills] secure administration and SOC triage practice logged...'
  ];
  let i = 0;
  setInterval(() => {
    const p = document.createElement('p');
    p.textContent = lines[i % lines.length];
    feed.appendChild(p);
    while (feed.children.length > 5) feed.removeChild(feed.firstElementChild);
    i += 1;
  }, 1800);
}

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card[data-status]');
const projectAccordions = document.querySelectorAll('.project-accordion');
projectAccordions.forEach(card => {
  card.addEventListener('toggle', () => {
    if (!card.open) return;
    projectAccordions.forEach(other => {
      if (other !== card && other.closest('main') === card.closest('main')) other.open = false;
    });
  });
});
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle('is-active', b === button));
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.status === filter;
      card.classList.toggle('is-hidden', !show);
      if (!show && card.open) card.open = false;
    });
  });
});

const backToTop = document.querySelector('[data-back-to-top]');
if (backToTop) {
  const toggleTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 700);
  toggleTop();
  window.addEventListener('scroll', toggleTop, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
