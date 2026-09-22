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

  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const canvas=document.createElement('canvas'); canvas.className='crystal-canvas'; document.body.prepend(canvas);
    const ctx=canvas.getContext('2d'); const modeLabel=document.createElement('div'); modeLabel.className='crystal-mode'; document.body.appendChild(modeLabel);
    let w=0,h=0,dpr=1,pts=[],xtals=[],mode=0,last=performance.now(),elapsed=0; const tau=Math.PI*2; const rnd=(a,b)=>a+Math.random()*(b-a);
    const isDark=()=>document.documentElement.dataset.theme==='dark';
    function reset(){const n=mode===0?7:18;xtals=Array.from({length:n},()=>({x:rnd(.06*w,.94*w),y:rnd(.08*h,.92*h),r:rnd(1.5,mode===0?5:3)*dpr,max:rnd(mode===0?18:12,mode===0?52:34)*dpr,a:rnd(0,tau),arms:Array.from({length:6},()=>rnd(.55,1)),alive:true}));modeLabel.textContent=mode===0?'near-equilibrium · nucleation ⇄ dissolution · faceted growth':'non-equilibrium · rapid nucleation → dendritic growth';}
    function resize(){dpr=Math.min(devicePixelRatio||1,2);w=canvas.width=innerWidth*dpr;h=canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';pts=Array.from({length:Math.min(78,Math.max(38,Math.floor(innerWidth/22)))},()=>({x:Math.random()*w,y:Math.random()*h,vx:rnd(-.10,.10)*dpr,vy:rnd(-.10,.10)*dpr}));reset();}
    function hex(c,r,alpha){ctx.beginPath();for(let k=0;k<6;k++){const ang=c.a+k*Math.PI/3,x=c.x+Math.cos(ang)*r,y=c.y+Math.sin(ang)*r;k?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.lineWidth=.6*dpr;ctx.strokeStyle=isDark()?'rgba(67,195,228,'+alpha+')':'rgba(39,100,255,'+alpha+')';ctx.stroke();}
    function dendrite(c,alpha){ctx.strokeStyle=isDark()?'rgba(163,139,255,'+alpha+')':'rgba(120,104,230,'+alpha+')';ctx.lineWidth=.58*dpr;for(let k=0;k<6;k++){const a=c.a+k*Math.PI/3,L=c.r*c.arms[k],x2=c.x+Math.cos(a)*L,y2=c.y+Math.sin(a)*L;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(x2,y2);ctx.stroke();const bn=Math.max(1,Math.floor(L/(16*dpr)));for(let j=1;j<=bn;j++){const t=j/(bn+1),bx=c.x+(x2-c.x)*t,by=c.y+(y2-c.y)*t,bl=Math.min(9*dpr,L*.2);for(const s of[-1,1]){const ba=a+s*Math.PI/3;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(ba)*bl,by+Math.sin(ba)*bl);ctx.stroke()}}}}
    function frame(now){const dt=Math.min(32,now-last);last=now;elapsed+=dt;if(elapsed>14000){elapsed=0;mode=1-mode;reset()}ctx.clearRect(0,0,w,h);for(const p of pts){p.x+=p.vx*dt*(mode===0 ? .20 : .48);p.y+=p.vy*dt*(mode===0 ? .20 : .48);if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;ctx.fillStyle=isDark()?(mode===0?'rgba(67,195,228,.075)':'rgba(163,139,255,.08)'):(mode===0?'rgba(39,100,255,.07)':'rgba(120,104,230,.07)');ctx.beginPath();ctx.arc(p.x,p.y,.9*dpr,0,tau);ctx.fill()}for(const c of xtals){if(!c.alive)continue;if(mode===0){c.r+=(c.r>4.2*dpr ? .0042 : -.0030)*dt;if(c.r<.8*dpr){c.alive=false;continue}c.r=Math.min(c.r,c.max);hex(c,c.r,.07+Math.min(.11,c.r/(320*dpr)))}else{c.r=Math.min(c.max,c.r+.0095*dt);dendrite(c,.065+Math.min(.105,c.r/(210*dpr)))}}requestAnimationFrame(frame)}
    resize(); addEventListener('resize',resize); requestAnimationFrame(frame);
  }
})();