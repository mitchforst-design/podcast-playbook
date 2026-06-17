/* ── Progress bar ── */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ── Active nav link ── */
const sections = document.querySelectorAll('section[id], .hero[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

sections.forEach(s => observer.observe(s));

/* ── Mobile menu toggle ── */
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when a nav link is clicked on mobile
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) sidebar.classList.remove('open');
  });
});

// Close on outside tap
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && !sidebar.contains(e.target) && e.target !== menuToggle) {
    sidebar.classList.remove('open');
  }
});

/* ── localStorage save/restore for fill-in fields ── */
const STORAGE_KEY = 'podcast-playbook-v1';

function loadSaved() {
  let data = {};
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch(e) {}
  return data;
}

function saveField(key, value) {
  const data = loadSaved();
  data[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function showSaved(fieldId) {
  const el = document.getElementById('saved-' + fieldId);
  if (!el) return;
  el.style.display = 'block';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.display = 'none'; }, 1800);
}

// Wire up all fill fields
const saved = loadSaved();
document.querySelectorAll('[data-key]').forEach(el => {
  const key = el.dataset.key;

  // Restore saved value
  if (saved[key]) el.value = saved[key];

  // Save on change
  const handler = () => {
    saveField(key, el.value);
    showSaved(key);
  };

  if (el.tagName === 'TEXTAREA') {
    el.addEventListener('input', handler);
  } else {
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  }
});
