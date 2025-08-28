/* NOVA — Interactions */
(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Theme toggle with persistence
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }
  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Mobile nav
  const navToggle = $('.nav-toggle');
  const menu = $('#menu');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
  // Close on link click (mobile)
  $$('#menu a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.2 });
  $$('.reveal').forEach(el => observer.observe(el));

  // Pricing toggle (monthly/yearly)
  const billingToggle = $('#billingToggle');
  const amounts = $$('.amount');
  const periodEls = $$('.period');
  const setBilling = (yearly) => {
    amounts.forEach(el => {
      const val = yearly ? el.dataset.year : el.dataset.month;
      el.textContent = val;
    });
    periodEls.forEach(p => p.textContent = yearly ? '/yr' : '/mo');
  };
  billingToggle?.addEventListener('change', e => setBilling(e.target.checked));

  // Slider (testimonials)
  const slider = $('[data-slider]');
  if (slider) {
    const slidesWrap = $('.slides', slider);
    const slides = $$('.slide', slidesWrap);
    const prev = $('.prev', slider);
    const next = $('.next', slider);
    const dots = $('.dots', slider);

    let index = 0;
    const update = () => {
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      dots.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', i === index));
    };
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { index = i; update(); });
      dots.appendChild(dot);
    });
    prev.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; update(); });
    next.addEventListener('click', () => { index = (index + 1) % slides.length; update(); });
    // Auto-play
    setInterval(() => { index = (index + 1) % slides.length; update(); }, 6000);
    update();
  }

  // Accordion (FAQ) — progressively enhance
  const accord = $('[data-accordion]');
  if (accord) {
    $$('.item', accord).forEach(item => {
      const btn = $('.trigger', item);
      const panel = $('.panel', item);
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        item.toggleAttribute('open');
        panel.style.paddingBlock = item.hasAttribute('open') ? '0.75rem' : '0';
      });
    });
  }

  // Lightbox modal for gallery
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  $$('.gallery-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.img;
      // Create a data URL from the button's SVG for crisp modal visuals
      const svg = btn.querySelector('svg');
      const xml = new XMLSerializer().serializeToString(svg);
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
      lightboxImg.src = url;
      lightbox.showModal();
    });
  });
  $$('.modal-close').forEach(btn => btn.addEventListener('click', e => {
    e.target.closest('dialog')?.close();
  }));

  // Open arbitrary modal
  $$('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-open-modal');
      const dlg = document.querySelector(id);
      dlg?.showModal();
    });
  });

  // Forms — basic client-side validation
  const setError = (input, msg) => {
    const small = input.closest('.form-row')?.querySelector('.error') || input.closest('form')?.querySelector('.error');
    if (small) small.textContent = msg || '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const contactForm = $('#contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name'), email = $('#email'), msg = $('#msg');
    let ok = true;

    if (name.value.trim().length < 2) { setError(name, 'Please enter at least 2 characters.'); ok = false; } else setError(name, '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError(email, 'Enter a valid email.'); ok = false; } else setError(email, '');
    if (msg.value.trim().length < 10) { setError(msg, 'Please add a few more details.'); ok = false; } else setError(msg, '');

    if (ok) {
      contactForm.reset();
      alert('Thanks! We’ll be in touch shortly.'); // Replace with real submission
    }
  });

  const newsletter = $('#newsletterForm');
  newsletter?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsEmail');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError(email, 'Enter a valid email.');
    } else {
      setError(email, '');
      email.value = '';
      alert('Welcome aboard! 🎉');
    }
  });

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Subtle “tilt” effect on code card
  const tiltEl = document.querySelector('[data-tilt]');
  if (tiltEl) {
    const strength = 8;
    tiltEl.addEventListener('mousemove', (e) => {
      const rect = tiltEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltEl.style.transform = `rotateX(${(-y*strength)}deg) rotateY(${x*strength}deg)`;
    });
    tiltEl.addEventListener('mouseleave', () => tiltEl.style.transform = '');
  }
})();
