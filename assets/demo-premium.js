(()=>{
  'use strict';
  document.documentElement.classList.add('js');
  const header=document.querySelector('[data-header]');
  const progress=document.querySelector('[data-scroll-progress]');
  const menuButton=document.querySelector('[data-menu-button]');
  const menu=document.querySelector('[data-menu]');
  const toast=document.querySelector('[data-toast]');
  const scene=document.querySelector('[data-parallax-scene]');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(pointer:fine)').matches;
  let frame=0;let toastTimer=0;

  const showToast=(message)=>{
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer=window.setTimeout(()=>toast.classList.remove('show'),3800);
  };
  const closeMenu=()=>{
    if(!menu||!menuButton)return;
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded','false');
  };
  const updateScroll=()=>{
    frame=0;
    const y=window.scrollY||document.documentElement.scrollTop;
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    header?.classList.toggle('is-scrolled',y>14);
    if(progress)progress.style.transform=`scaleX(${Math.min(1,y/max)})`;
  };
  const scheduleScroll=()=>{if(!frame)frame=requestAnimationFrame(updateScroll)};
  updateScroll();
  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleScroll,{passive:true});

  if(menuButton&&menu){
    menuButton.addEventListener('click',()=>{
      const open=menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded',String(open));
    });
    menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu()});
    document.addEventListener('click',event=>{if(!menu.contains(event.target)&&!menuButton.contains(event.target))closeMenu()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
  }

  document.querySelectorAll('[data-year]').forEach(node=>{node.textContent=String(new Date().getFullYear())});
  document.querySelectorAll('[data-demo-action]').forEach(node=>node.addEventListener('click',event=>{
    event.preventDefault();
    showToast('Demonstração: este botão será conectado ao WhatsApp Business oficial da empresa somente após autorização.');
  }));

  const contact=window.LEAD_FINDER_CONTACT||{};
  const phone=String(contact.whatsapp||'').replace(/\D/g,'');
  const contactEnabled=contact.enabled===true&&/^55\d{10,11}$/.test(phone);
  document.querySelectorAll('[data-whatsapp-link]').forEach(node=>node.addEventListener('click',event=>{
    if(!contactEnabled){
      event.preventDefault();
      showToast('O WhatsApp da Lead Finder Brasil será ativado assim que o número comercial for configurado.');
      return;
    }
    node.href=`https://wa.me/${phone}?text=${encodeURIComponent(String(contact.message||''))}`;
    node.target='_blank';node.rel='noopener noreferrer';
  }));

  if('IntersectionObserver'in window&&!reduceMotion){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
    }),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
    document.querySelectorAll('.reveal').forEach(node=>observer.observe(node));
  }else document.querySelectorAll('.reveal').forEach(node=>node.classList.add('visible'));

  if(scene&&finePointer&&!reduceMotion){
    let pointerFrame=0;let nextX=0;let nextY=0;
    scene.addEventListener('pointermove',event=>{
      const rect=scene.getBoundingClientRect();
      nextX=(event.clientX-rect.left)/rect.width-.5;
      nextY=(event.clientY-rect.top)/rect.height-.5;
      if(pointerFrame)return;
      pointerFrame=requestAnimationFrame(()=>{
        pointerFrame=0;
        const panel=scene.querySelector('.visual-panel');
        if(panel)panel.style.transform=`rotateX(${(-nextY*3).toFixed(2)}deg) rotateY(${(nextX*4).toFixed(2)}deg) rotate(-1deg)`;
      });
    },{passive:true});
    scene.addEventListener('pointerleave',()=>{const panel=scene.querySelector('.visual-panel');if(panel)panel.style.transform='rotate(-1deg)'},{passive:true});
  }
})();
