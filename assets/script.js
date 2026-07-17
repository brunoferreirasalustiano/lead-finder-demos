(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    || (navigator.deviceMemory && navigator.deviceMemory <= 4);

  const performanceStyles = document.createElement('style');
  performanceStyles.textContent = `
    body::after { display: none !important; }
    .reveal { opacity: 1 !important; transform: none !important; filter: none !important; }
    [data-tilt], [data-magnetic] { will-change: auto !important; }
    .section:not(.hero), .section-tight, .cta-wrap, footer {
      content-visibility: auto;
      contain-intrinsic-size: 1px 760px;
    }
    @media (max-width: 900px) {
      .nav-shell, .pill { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
      .hero::before, .stage-orb, .orbit, .floating-chip, .float-card { animation: none !important; }
      .marquee-track { animation-duration: 42s !important; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
    }
  `;
  document.head.appendChild(performanceStyles);

  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-scroll-progress]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const toast = document.querySelector('[data-toast]');
  let toastTimer;
  let scrollFrame = 0;

  const updateScrollUI = () => {
    scrollFrame = 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      const value = scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0;
      progress.style.transformOrigin = 'left center';
      progress.style.transform = `scaleX(${value / 100})`;
    }
    header?.classList.toggle('is-scrolled', scrollTop > 18);
  };

  const scheduleScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScrollUI);
  };

  updateScrollUI();
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });

  const closeMenu = () => {
    if (!menu || !menuButton) return;
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  };

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
  };

  document.querySelectorAll('[data-demo-action]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('Demonstração: este botão será conectado ao canal comercial oficial somente após aprovação do cliente.');
    });
  });

  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('is-visible');
  });

  document.querySelectorAll('[data-count]').forEach((element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';

    const setFinalValue = () => {
      element.textContent = `${target}${suffix}`;
    };

    if (reduceMotion || lowPower || !('IntersectionObserver' in window)) {
      setFinalValue();
      return;
    }

    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const duration = 700;

      const tick = (now) => {
        const ratio = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - ratio, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;
        if (ratio < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        run();
        observer.disconnect();
      }
    }, { threshold: .3 });

    observer.observe(element);
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      item.classList.toggle('is-open', !open);
      button.setAttribute('aria-expanded', String(!open));
    });
  });

  document.querySelectorAll('[role="tab"]').forEach((tab) => {
    const activateTab = () => {
      const tabsContainer = tab.closest('[data-tabs]');
      if (!tabsContainer) return;

      const targetId = tab.getAttribute('aria-controls');
      tabsContainer.querySelectorAll('[role="tab"]').forEach((button) => {
        const active = button === tab;
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });

      tabsContainer.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
        panel.hidden = panel.id !== targetId;
      });
    };

    tab.addEventListener('click', activateTab);
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const list = tab.closest('[role="tablist"]');
      if (!list) return;

      const tabs = [...list.querySelectorAll('[role="tab"]')];
      const current = tabs.indexOf(tab);
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(current + direction + tabs.length) % tabs.length];
      next.focus();
      next.click();
      event.preventDefault();
    });
  });

  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navAnchors
    .map((anchor) => document.querySelector(anchor.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window && !lowPower) {
    const spy = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;

      navAnchors.forEach((anchor) => {
        anchor.classList.toggle('is-active', anchor.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach((section) => spy.observe(section));
  }
})();
