/* Basic interactions: menu, theme toggle, reveal on scroll, progress animation, contact form (mailto) */

document.addEventListener('DOMContentLoaded', () => {
  // Menu toggle
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Theme toggle (persist)
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  if (currentTheme === 'light') document.body.classList.add('light');

  const updateThemeIcon = () => {
    themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
  };
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    updateThemeIcon();
  });

  // Reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? Number(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(r => obs.observe(r));

  // Animate progress bars when skills appear
  const progressBars = document.querySelectorAll('.progress-bar');
  const animateProgress = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target;
        const value = bar.dataset.value || 60;
        bar.style.width = value + '%';
        animateProgress.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  progressBars.forEach(b => animateProgress.observe(b));

  // Contact form submission: use mailto fallback
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);
    const name = encodeURIComponent(formData.get('name'));
    const email = encodeURIComponent(formData.get('email'));
    const message = encodeURIComponent(formData.get('message'));
    const subject = encodeURIComponent(`Contact from portfolio: ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:yourmail@gmail.com?subject=${subject}&body=${body}`;
  });

  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      // close mobile nav if open
      if (nav.classList.contains('open')) nav.classList.remove('open');
    }
  }));
});

// Education card interactivity: toggle expand/collapse with keyboard support
(function educationToggle() {
  const eduToggles = document.querySelectorAll('.edu-head.toggle');

  eduToggles.forEach(head => {
    const card = head.closest('.edu-card');
    const chevron = head.querySelector('.chev');

    const toggle = (ev) => {
      const expanded = card.classList.toggle('expanded');
      head.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      // if expanded, smooth scroll the card into view on small screens
      if (expanded && window.innerWidth < 900) {
        setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 220);
      }
    };

    head.addEventListener('click', toggle);

    // keyboard accessibility: Enter or Space
    head.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();
