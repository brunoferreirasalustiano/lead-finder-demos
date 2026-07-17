(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Ano automático
  qsa('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  // Barra de progresso e header inteligente
  const progress = qs('[data-scroll-progress]');
  const header = qs('[data-header]');
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateScrollUI = () => {
    const current = window.scrollY;
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    if (progress) progress.style.width = `${Math.min((current / max) * 100, 100)}%`;

    if (header) {
      const movingDown = current > lastScrollY;
      header.classList.toggle('is-hidden', movingDown && current > 180);
    }
    lastScrollY = current;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  // Menu mobile acessível
  const menuButton = qs('[data-menu-button]');
  const menu = qs('[data-menu]');
  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  // Revelação progressiva
  const revealNodes = qsa('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: .16, rootMargin: '0px 0px -7% 0px' });
    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  // Navegação ativa por seção
  const navLinks = qsa('[data-menu] a[href^="#"]');
  const sections = navLinks
    .map((link) => qs(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!activeEntry) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${activeEntry.target.id}`);
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .25, .6] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Toast demonstrativo
  const toast = qs('[data-toast]');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 4300);
  };

  qsa('[data-demo-action]').forEach((control) => {
    control.addEventListener('click', (event) => {
      event.preventDefault();
      showToast(control.dataset.demoMessage || 'Demonstração: este botão será conectado ao canal oficial somente após aprovação do cliente.');
    });
  });

  // Contadores animados
  const counters = qsa('[data-count]');
  const animateCounter = (node) => {
    const target = Number(node.dataset.count || 0);
    const suffix = node.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();
    const draw = (time) => {
      const progressValue = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      node.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progressValue < 1) window.requestAnimationFrame(draw);
    };
    window.requestAnimationFrame(draw);
  };

  if (reducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach((node) => {
      node.textContent = `${node.dataset.count || 0}${node.dataset.suffix || ''}`;
    });
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .7 });
    counters.forEach((node) => counterObserver.observe(node));
  }

  // FAQ em accordion
  qsa('[data-faq-button]').forEach((button) => {
    const panel = qs(`#${button.getAttribute('aria-controls')}`);
    if (!panel) return;
    panel.hidden = button.getAttribute('aria-expanded') !== 'true';
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });

  // Tabs de conteúdo
  qsa('[data-tabs]').forEach((tabList) => {
    const buttons = qsa('[role="tab"]', tabList);
    const root = tabList.closest('[data-tabs-root]') || document;
    const activateTab = (button) => {
      buttons.forEach((item) => {
        const selected = item === button;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = qs(`#${item.getAttribute('aria-controls')}`, root);
        if (panel) panel.hidden = !selected;
      });
    };

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activateTab(button));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        buttons[nextIndex].focus();
        activateTab(buttons[nextIndex]);
      });
    });
  });

  // Tilt moderado e original em desktop
  if (finePointer && !reducedMotion) {
    qsa('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });

    qsa('[data-parallax]').forEach((node) => {
      window.addEventListener('pointermove', (event) => {
        const x = (event.clientX / window.innerWidth - .5) * Number(node.dataset.parallax || 12);
        const y = (event.clientY / window.innerHeight - .5) * Number(node.dataset.parallax || 12);
        node.style.translate = `${x}px ${y}px`;
      }, { passive: true });
    });
  }
})();
