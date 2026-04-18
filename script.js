// Lightweight parallax + small UI niceties
(function(){
  // Parallax for hero background image (only if present)
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if(hero && heroBg){
    let latestScroll = 0;
    let ticking = false;
    function updateParallax(){
      const rect = hero.getBoundingClientRect();
      const offset = Math.max(-rect.top, 0);
      const translate = Math.min(offset * 0.15, 80);
      heroBg.style.transform = `translateY(${translate}px) scale(1.02)`;
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      latestScroll = window.scrollY;
      if(!ticking){
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, {passive:true});
  }

  // Smooth focus for hash anchor links on same page
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if(target){
        target.focus({preventScroll:true});
        setTimeout(()=> target.scrollIntoView({behavior:'smooth', block:'start'}), 0);
      }
    });
  });

  // Highlight current top navigation item based on pathname
  (function highlightNav(){
    const navLinks = document.querySelectorAll('.nav a');
    if(!navLinks.length) return;
    const path = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      const isActive = (href && href.indexOf(path) !== -1) || (path === 'index.html' && (href === 'index.html' || href === './' || href === '/'));
      if(isActive){
        a.classList.add('active');
        a.setAttribute('aria-current','page');
      } else {
        a.classList.remove('active');
        a.removeAttribute('aria-current');
      }
    });
  })();

  // Reports page behavior: sidebar nav toggles report panels
  (function reportsPage(){
    const sidebarItems = document.querySelectorAll('.report-item');
    const panels = document.querySelectorAll('.report-panel');
    if(!sidebarItems.length || !panels.length) return;

    function showPanel(id){
      panels.forEach(p => {
        const isShown = (p.id === id);
        p.hidden = !isShown;
        p.setAttribute('aria-hidden', String(!isShown));
        if(isShown){
          p.setAttribute('tabindex','-1');
          p.focus();
        } else {
          p.removeAttribute('tabindex');
        }
      });
      sidebarItems.forEach(li => {
        const selected = (li.dataset.target === id);
        li.classList.toggle('active', selected);
        li.setAttribute('aria-selected', String(selected));
      });
      // update hash for deep-linking
      history.replaceState(null, '', `#${id}`);
    }

    sidebarItems.forEach(item => {
      // add aria-controls for better semantics
      const target = item.dataset.target;
      if(target) item.setAttribute('aria-controls', target);
      item.setAttribute('role','tab');
      item.setAttribute('aria-selected','false');
      item.addEventListener('click', function(e){
        e.preventDefault();
        const id = this.dataset.target;
        showPanel(id);
      });
      // keyboard support
      item.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); this.click(); }
      });
    });

    // initial panel from hash or default
    const initial = location.hash ? location.hash.replace('#','') : (panels[0] && panels[0].id);
    if(initial) showPanel(initial);
  })();

    // 已移除：原先用于移动装饰形状的 pointermove 微交互

})();
