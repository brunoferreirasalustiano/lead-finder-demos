(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-scroll-progress]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0}%`;
    header?.classList.toggle('is-scrolled', scrollTop > 18);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

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
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
  };

  document.querySelectorAll('[data-demo-action]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('Demonstração: este botão será conectado ao canal comercial oficial somente após aprovação do cliente.');
    });
  });

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((element) => revealObserver.observe(element));
  }

  document.querySelectorAll('[data-count]').forEach((element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      if (reduceMotion) {
        element.textContent = `${target}${suffix}`;
        return;
      }
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const progressValue = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progressValue < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      }, { threshold: .45 });
      observer.observe(element);
    } else run();
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

  const tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabsContainer = tab.closest('[data-tabs]');
      if (!tabsContainer) return;
      const targetId = tab.getAttribute('aria-controls');
      tabsContainer.querySelectorAll('[role="tab"]').forEach((button) => {
        button.setAttribute('aria-selected', String(button === tab));
        button.tabIndex = button === tab ? 0 : -1;
      });
      tabsContainer.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
        panel.hidden = panel.id !== targetId;
      });
    });
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const group = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
      const current = group.indexOf(tab);
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const next = group[(current + direction + group.length) % group.length];
      next.focus();
      next.click();
      event.preventDefault();
    });
  });

  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navAnchors
    .map((anchor) => document.querySelector(anchor.getAttribute('href')))
    .filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((anchor) => {
          anchor.classList.toggle('is-active', anchor.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { threshold: .45 });
    sections.forEach((section) => spy.observe(section));
  }

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      document.body.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.body.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });

    document.querySelectorAll('[data-tilt]').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        element.style.transform = `perspective(1200px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
      });
      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });

    document.querySelectorAll('[data-magnetic]').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * .08}px, ${y * .08}px) translateY(-3px)`;
      });
      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });
  }
})();
