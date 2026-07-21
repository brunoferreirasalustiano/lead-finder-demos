(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-scroll-progress]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const toast = document.querySelector('[data-toast]');
  let toastTimer;
  let scrollFrame = 0;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3800);
  };

  const updateScroll = () => {
    scrollFrame = 0;
    const top = window.scrollY || document.documentElement.scrollTop;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle('is-scrolled', top > 18);
    if (progress) progress.style.transform = `scaleX(${total > 0 ? Math.min(1, top / total) : 0})`;
  };

  const scheduleScroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScroll);
  };

  updateScroll();
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });

  const closeMenu = () => {
    if (!menu || !menuButton) return;
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    if (!menu) return;
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (menu && menuButton && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const contact = window.LEAD_FINDER_CONTACT || {};
  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const digits = String(contact.whatsapp || '').replace(/\D/g, '');
      if (!contact.enabled || digits.length < 12) {
        event.preventDefault();
        showToast('O WhatsApp Business está em configuração e será ativado assim que o número comercial for confirmado.');
        return;
      }
      const text = encodeURIComponent(contact.message || 'Olá! Gostaria de saber mais.');
      link.href = `https://wa.me/${digits}?text=${text}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
  } else {
    document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
  }

  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-parallax-scene]').forEach((scene) => {
      let frame = 0;
      let x = 0;
      let y = 0;
      const draw = () => {
        frame = 0;
        scene.style.setProperty('--mx', x.toFixed(3));
        scene.style.setProperty('--my', y.toFixed(3));
      };
      scene.addEventListener('pointermove', (event) => {
        const rect = scene.getBoundingClientRect();
        x = ((event.clientX - rect.left) / rect.width - .5) * 2;
        y = ((event.clientY - rect.top) / rect.height - .5) * 2;
        if (!frame) frame = requestAnimationFrame(draw);
      }, { passive: true });
      scene.addEventListener('pointerleave', () => {
        x = 0;
        y = 0;
        if (!frame) frame = requestAnimationFrame(draw);
      });
    });
  }
})();
