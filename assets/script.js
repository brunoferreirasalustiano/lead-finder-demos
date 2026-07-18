(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        menu.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const toast = document.querySelector('[data-toast]');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
  };

  document.querySelectorAll('[data-demo-action]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('Ação demonstrativa: nenhum contato ou dado foi enviado. O uso deste catálogo exige autorização manual.');
    });
  });
})();
