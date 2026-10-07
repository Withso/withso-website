(()=>{
 document.documentElement.classList.add('js');
 const menu=document.querySelector('.menu-button'),links=document.querySelector('.nav-links');
 if(menu&&links){
  const close=()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.querySelector('span').textContent='Menu'};
  menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.querySelector('span').textContent=open?'Close':'Menu'});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('open')){close();menu.focus()}});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))close()});
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 }
 if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('pending');observer.observe(el)}});
 }
 document.querySelectorAll('[data-tabs]').forEach(group=>{
  const tabs=[...group.querySelectorAll('[role=tab]')],panels=[...group.querySelectorAll('[role=tabpanel]')];
  const activate=tab=>{tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});panels.forEach(p=>p.hidden=p.id!==tab.getAttribute('aria-controls'))};
  tabs.forEach((tab,i)=>{
   tab.addEventListener('click',()=>activate(tab));
   tab.addEventListener('keydown',e=>{let index;if(e.key==='ArrowRight'||e.key==='ArrowDown')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();activate(tabs[index]);tabs[index].focus()});
  });
 });
})();
