/* Basic interactions: menu, theme toggle, reveal on scroll, progress animation, contact form (mailto) */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- MENU TOGGLE ---------------- */
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  /* ---------------- THEME TOGGLE ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme =
    localStorage.getItem('theme') ||
    (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark');

  if (currentTheme === 'light') document.body.classList.add('light');

  const updateThemeIcon = () => {
    if (!themeToggle) return;
    themeToggle.textContent = document.body.classList.contains('light')
      ? '☀️'
      : '🌙';
  };
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem(
        'theme',
        document.body.classList.contains('light') ? 'light' : 'dark'
      );
      updateThemeIcon();
    });
  }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay ? Number(el.dataset.delay) : 0;
          setTimeout(() => el.classList.add('visible'), delay);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((r) => obs.observe(r));

  /* ---------------- SKILL PROGRESS BARS ---------------- */
  const progressBars = document.querySelectorAll('.progress-bar');
  const animateProgress = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const bar = e.target;
          const value = bar.dataset.value || 60;
          bar.style.width = value + '%';
          animateProgress.unobserve(bar);
        }
      });
    },
    { threshold: 0.2 }
  );

  progressBars.forEach((b) => animateProgress.observe(b));

  /* ---------------- CONTACT FORM (mailto) ---------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const formData = new FormData(form);
      const name = encodeURIComponent(formData.get('name'));
      const email = encodeURIComponent(formData.get('email'));
      const message = encodeURIComponent(formData.get('message'));
      const subject = encodeURIComponent(`Contact from portfolio: ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );

      // TODO: replace with your real email
      window.location.href = `mailto:yourmail@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------------- FOOTER YEAR ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- SMOOTH SCROLL ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        if (nav && nav.classList.contains('open')) nav.classList.remove('open');
      }
    })
  );

  /* ---------------- EDUCATION TOGGLE ---------------- */
  (function educationToggle() {
    const eduToggles = document.querySelectorAll('.edu-head.toggle');

    if (!eduToggles || eduToggles.length === 0) return;

    eduToggles.forEach((head) => {
      const card = head.closest('.edu-card');
      if (!card) return;

      const toggle = () => {
        const expanded = card.classList.toggle('expanded');
        head.setAttribute('aria-expanded', expanded ? 'true' : 'false');

        if (expanded && window.innerWidth < 900) {
          setTimeout(
            () =>
              card.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              }),
            220
          );
        }
      };

      head.addEventListener('click', toggle);

      head.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  })();

  /* ---------------- EXPERIENCE TOGGLE ---------------- */
  (function experienceToggle() {
    const expCards = document.querySelectorAll('.exp-card');

    if (!expCards || expCards.length === 0) return;

    expCards.forEach((card) => {
      const toggle = card.querySelector('.exp-toggle');
      if (!toggle) return;

      const doToggle = () => {
        const open = card.classList.toggle('expanded');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

        if (open && window.innerWidth < 900) {
          setTimeout(
            () =>
              card.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              }),
            200
          );
        }
      };

      toggle.addEventListener('click', doToggle);

      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          doToggle();
        }
      });
    });
  })();

  /* ---------------- MY PIC MODAL ---------------- */
  (function myPicModal() {
    const myPicBtn = document.getElementById('myPicBtn');
    const myPicModal = document.getElementById('myPicModal');
    const myPicBackdrop = document.getElementById('myPicBackdrop');
    const myPicClose = document.getElementById('myPicClose');

    if (!myPicBtn) return; // no opener found; nothing to do

    const openModal = () => {
      if (!myPicModal) return;
      myPicModal.classList.add('open');
      myPicModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // focus close control for keyboard users (if available)
      if (myPicClose) myPicClose.focus();
    };

    const closeModal = () => {
      if (!myPicModal) return;
      myPicModal.classList.remove('open');
      myPicModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      myPicBtn.focus(); // return focus to opener
    };

    myPicBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    if (myPicClose) myPicClose.addEventListener('click', closeModal);
    if (myPicBackdrop) myPicBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && myPicModal && myPicModal.classList.contains('open')) {
        closeModal();
      }
    });
  })();

}); // END DOMContentLoaded
