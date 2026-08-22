(()=>{
  const menuButton=document.querySelector('[data-menu-button]');
  const menu=document.querySelector('[data-menu]');

  if(menuButton&&menu){
    menuButton.addEventListener('click',()=>{
      const open=menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded',String(open));
    });
    menu.addEventListener('click',event=>{
      if(event.target.closest('a')){
        menu.classList.remove('open');
        menuButton.setAttribute('aria-expanded','false');
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach(node=>{
    node.textContent=String(new Date().getFullYear());
  });

  const reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const supportsObserver='IntersectionObserver' in window;
  const whatsappNumber='5519971519337';
  const whatsappBase='https://wa.me/';
  const whatsappDefaultMessage='Olá, Bruno! Conheci a Lead Finder Brasil pelo site e gostaria de saber mais sobre o Pacote Essencial de landing page.';
  const buildWhatsappUrl=message=>`${whatsappBase}${whatsappNumber}?text=${encodeURIComponent(message)}`;

  if(!reduceMotion){
    const style=document.createElement('style');
    style.textContent=`
      .image-unfold,.image-mask{
        --image-delay:0ms;
        backface-visibility:hidden;
      }
      .project-media.image-unfold{position:relative}
      .image-unfold{
        clip-path:polygon(0 0,18% 0,0 18%,0 100%);
        opacity:.18;
        transform:translate3d(0,34px,0) rotate(.9deg) scale(.985);
        transform-origin:50% 65%;
        transition:
          clip-path 1.05s cubic-bezier(.2,.72,.18,1) var(--image-delay),
          opacity .55s ease var(--image-delay),
          transform 1.05s cubic-bezier(.2,.72,.18,1) var(--image-delay);
        will-change:clip-path,transform,opacity;
      }
      .image-unfold.image-unfold-reverse{
        clip-path:polygon(82% 0,100% 0,100% 100%,100% 18%);
        transform:translate3d(0,34px,0) rotate(-.9deg) scale(.985);
      }
      .image-unfold.is-unfolded{
        clip-path:polygon(0 0,100% 0,100% 100%,0 100%);
        opacity:1;
        transform:translate3d(0,0,0) rotate(0) scale(1);
      }
      .image-mask{
        clip-path:inset(0 0 100% 0 round 22px);
        opacity:.25;
        transition:
          clip-path .9s cubic-bezier(.2,.72,.18,1) var(--image-delay),
          opacity .45s ease var(--image-delay);
        will-change:clip-path,opacity;
      }
      .image-mask.is-unfolded{
        clip-path:inset(0 0 0 0 round 22px);
        opacity:1;
      }
      .image-unfold::after{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.28) 49%,transparent 63%);
        transform:translateX(-130%);
        transition:transform .9s cubic-bezier(.2,.72,.18,1) calc(var(--image-delay) + 180ms);
        mix-blend-mode:soft-light;
      }
      .image-unfold.is-unfolded::after{transform:translateX(130%)}
      .image-unfold.image-effect-done,.image-mask.image-effect-done{will-change:auto}
      @media(max-width:700px){
        .image-unfold{
          transform:translate3d(0,20px,0) scale(.99);
          transition-duration:.82s;
        }
        .image-unfold.image-unfold-reverse{transform:translate3d(0,20px,0) scale(.99)}
      }
      @media(prefers-reduced-motion:reduce){
        .image-unfold,.image-mask{
          clip-path:none!important;
          opacity:1!important;
          transform:none!important;
          transition:none!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const revealTargets=document.querySelectorAll('.reveal');
  if(!reduceMotion&&supportsObserver){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.1,rootMargin:'0px 0px -6% 0px'});
    revealTargets.forEach(element=>observer.observe(element));
  }else{
    revealTargets.forEach(element=>element.classList.add('visible'));
  }

  const unfoldTargets=[
    ...document.querySelectorAll('.visual-main,.visual-small,.project-media,.demo-images .portrait,.demo-images .secondary')
  ];
  const maskTargets=[
    ...document.querySelectorAll('.about-grid img,.gallery img')
  ];

  unfoldTargets.forEach((element,index)=>{
    element.classList.add('image-unfold');
    if(element.closest('.project-row.reverse')||element.classList.contains('visual-small')||element.classList.contains('secondary')){
      element.classList.add('image-unfold-reverse');
    }
    element.style.setProperty('--image-delay',`${Math.min(index%4,3)*90}ms`);
  });

  maskTargets.forEach((element,index)=>{
    element.classList.add('image-mask');
    element.style.setProperty('--image-delay',`${Math.min(index%4,3)*75}ms`);
  });

  const imageEffects=[...unfoldTargets,...maskTargets];
  const showImage=element=>{
    element.classList.add('is-unfolded');
    element.addEventListener('transitionend',()=>{
      element.classList.add('image-effect-done');
    },{once:true});
  };

  if(!reduceMotion&&supportsObserver){
    const imageObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          showImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    },{threshold:.16,rootMargin:'0px 0px -4% 0px'});
    imageEffects.forEach(element=>imageObserver.observe(element));
  }else{
    imageEffects.forEach(showImage);
  }

  document.querySelectorAll('[data-faq-button]').forEach(button=>{
    button.addEventListener('click',()=>{
      const item=button.closest('.faq-item');
      const expanded=item.classList.toggle('open');
      button.setAttribute('aria-expanded',String(expanded));
    });
  });

  document.querySelectorAll('[data-contact]').forEach(control=>{
    const label=control.textContent.trim();
    const message=control.dataset.message?.trim()||whatsappDefaultMessage;
    const whatsappUrl=buildWhatsappUrl(message);
    control.setAttribute('aria-label',`${label} — abrir WhatsApp da Lead Finder Brasil`);
    if(control instanceof HTMLAnchorElement){
      control.href=whatsappUrl;
      control.target='_blank';
      control.rel='noopener noreferrer';
      return;
    }
    control.addEventListener('click',()=>window.location.assign(whatsappUrl));
  });

  const modal=document.querySelector('[data-contact-modal]');
  const closeModal=()=>{
    if(!modal)return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  };

  modal?.addEventListener('click',event=>{
    if(event.target===modal||event.target.closest('[data-modal-close]'))closeModal();
  });

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')closeModal();
  });
})();

// Lead Finder Brasil: troca de imagens no tamanho original
(() => {
  const root = document.querySelector("[data-hero-gallery]");
  if (!root) return;

  const mainFrame = root.querySelector("[data-gallery-main]");
  const nextFrame = root.querySelector("[data-gallery-next]");
  const mainImage = root.querySelector("[data-gallery-main-image]");
  const nextImage = root.querySelector("[data-gallery-next-image]");
  const mainLabel = root.querySelector("[data-gallery-main-label]");
  const nextLabel = root.querySelector("[data-gallery-next-label]");
  const status = root.querySelector("[data-gallery-status]");

  if (
    !mainFrame ||
    !nextFrame ||
    !mainImage ||
    !nextImage ||
    !mainLabel ||
    !nextLabel
  ) {
    return;
  }

  const items = [
    {
      label: "Barbearia",
      src: "assets/img/barbearia-hero.webp",
      alt: "Barbeiro fazendo acabamento em cliente",
    },
    {
      label: "Restaurante",
      src: "assets/img/restaurante-prato.webp",
      alt: "Prato apresentado em restaurante",
    },
    {
      label: "Oficina",
      src: "assets/img/oficina-mecanico.webp",
      alt: "Mecânico trabalhando em veículo",
    },
    {
      label: "Prestador de serviços",
      src: "assets/img/prestador-profissional.webp",
      alt: "Profissional trabalhando em instalação elétrica",
    },
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const AUTO_INTERVAL = 5000;

  let currentIndex = 0;
  let locked = false;
  let pointerStart = null;
  let suppressClick = false;
  let autoTimer = null;

  const normalize = (index) => (index + items.length) % items.length;

  const applyImages = () => {
    const current = items[currentIndex];
    const next = items[normalize(currentIndex + 1)];

    mainImage.src = current.src;
    mainImage.alt = current.alt;
    mainLabel.textContent = current.label;

    nextImage.src = next.src;
    nextImage.alt = next.alt;
    nextLabel.textContent = next.label;

    mainFrame.setAttribute(
      "aria-label",
      `Demonstração atual: ${current.label}. Mostrar próxima.`
    );

    nextFrame.setAttribute(
      "aria-label",
      `Próxima demonstração: ${next.label}. Mostrar agora.`
    );

    if (status) {
      status.textContent =
        `Demonstração ${currentIndex + 1} de ${items.length}: ${current.label}.`;
    }
  };

  const stopAuto = () => {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const startAuto = () => {
    stopAuto();

    if (reducedMotion.matches) return;

    autoTimer = window.setInterval(() => {
      change(1);
    }, AUTO_INTERVAL);
  };

  const restartAuto = () => {
    stopAuto();
    startAuto();
  };

  const change = (direction) => {
    if (locked) return;
    locked = true;

    const duration = reducedMotion.matches ? 0 : 420;
    mainFrame.classList.add("is-changing");
    nextFrame.classList.add("is-changing");

    window.setTimeout(() => {
      currentIndex = normalize(currentIndex + direction);
      applyImages();

      requestAnimationFrame(() => {
        mainFrame.classList.remove("is-changing");
        nextFrame.classList.remove("is-changing");

        window.setTimeout(() => {
          locked = false;
        }, duration);
      });
    }, duration);
  };

  const activateNext = () => {
    if (suppressClick) return;
    change(1);
    restartAuto();
  };

  mainFrame.addEventListener("click", activateNext);
  nextFrame.addEventListener("click", activateNext);

  [mainFrame, nextFrame].forEach((frame) => {
    frame.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        change(1);
        restartAuto();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        change(1);
        restartAuto();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        change(-1);
        restartAuto();
      }
    });

    frame.addEventListener("mouseenter", stopAuto);
    frame.addEventListener("mouseleave", startAuto);
    frame.addEventListener("focusin", stopAuto);
    frame.addEventListener("focusout", startAuto);
  });

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    stopAuto();

    pointerStart = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  });

  root.addEventListener("pointerup", (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;

    if (
      Math.abs(deltaX) < 48 ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      startAuto();
      return;
    }

    suppressClick = true;
    window.setTimeout(() => {
      suppressClick = false;
    }, 100);

    change(deltaX < 0 ? 1 : -1);
    restartAuto();
  });

  root.addEventListener("pointercancel", () => {
    pointerStart = null;
    startAuto();
  });

  applyImages();
  startAuto();
})();
