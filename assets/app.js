(()=>{
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const root=document.documentElement;
  const saved=localStorage.getItem('theme'); if(saved) root.dataset.theme=saved;
  const themeBtn=$('#themeBtn');
  const syncThemeIcon=()=>{ if(themeBtn) themeBtn.textContent=root.dataset.theme==='dark'?'☀':'◐'; };
  syncThemeIcon();
  if(themeBtn) themeBtn.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.setItem('theme',root.dataset.theme);syncThemeIcon();});
  const menuBtn=$('#menuBtn'),mobile=$('#mobileMenu');
  if(menuBtn&&mobile) menuBtn.addEventListener('click',()=>mobile.classList.toggle('open'));
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>io.observe(el));
  $$('[data-count]').forEach(el=>{let started=false,target=+el.dataset.count,suffix=el.dataset.suffix||'',dec=+(el.dataset.decimals||0);const o=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting||started)return;started=true;const s=performance.now(),dur=1000;const tick=t=>{const p=Math.min(1,(t-s)/dur),v=target*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec)+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);o.disconnect()}),{threshold:.55});o.observe(el)});
  const filters=$$('.filter'),projects=$$('.project[data-category]');
  filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;projects.forEach(p=>p.classList.toggle('hidden',f!=='all'&&p.dataset.category!==f));}));
  const search=$('#blogSearch'); if(search){const cards=$$('.blog-card');search.addEventListener('input',()=>{const q=search.value.toLowerCase().trim();cards.forEach(c=>c.style.display=(c.dataset.search||c.textContent).toLowerCase().includes(q)?'flex':'none')})}
})();