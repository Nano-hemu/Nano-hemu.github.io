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
    const canvas=document.createElement('canvas');
    canvas.className='crystal-canvas';
    document.body.prepend(canvas);
    const ctx=canvas.getContext('2d');
    let w=0,h=0,dpr=1,last=performance.now(),solutes=[],crystals=[];
    const tau=Math.PI*2, rnd=(a,b)=>a+Math.random()*(b-a);
    const isDark=()=>document.documentElement.dataset.theme==='dark';

    function reset(){
      const desktop=innerWidth>=981;
      const count=desktop?18:24;
      crystals=Array.from({length:count},(_,i)=>{
        let x=rnd(.035*w,.965*w),y=rnd(.05*h,.95*h);
        if(desktop){
          const anchors=[
            [.045,.18],[.955,.22],[.07,.52],[.93,.58],[.08,.84],[.92,.86],
            [.18,.10],[.82,.11]
          ];
          if(i<anchors.length){x=anchors[i][0]*w;y=anchors[i][1]*h;}
        }
        return{
          x,y,
          r:rnd(desktop?5.5:2.2,desktop?10:4.5)*dpr,
          max:rnd(desktop?58:26,desktop?112:62)*dpr,
          a:rnd(0,tau),
          arms:Array.from({length:6},()=>rnd(desktop?.72:.58,desktop?1.28:1.2))
        };
      });
    }
    function resize(){
      dpr=Math.min(devicePixelRatio||1,2);
      w=canvas.width=innerWidth*dpr;h=canvas.height=innerHeight*dpr;
      canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
      solutes=Array.from({length:Math.min(115,Math.max(58,Math.floor(innerWidth/14)))},()=>({
        x:Math.random()*w,y:Math.random()*h,vx:rnd(-.14,.14)*dpr,vy:rnd(-.14,.14)*dpr
      }));
      reset();
    }
    function dendrite(c,alpha){
      const desktop=innerWidth>=981;
      ctx.strokeStyle=isDark()?'rgba(151,135,255,'+alpha+')':'rgba(63,72,194,'+alpha+')';
      ctx.lineWidth=(desktop?1.08:.72)*dpr;
      ctx.shadowBlur=(desktop?7:0)*dpr;
      ctx.shadowColor=isDark()?'rgba(92,164,255,.26)':'rgba(54,91,190,.15)';
      for(let k=0;k<6;k++){
        const a=c.a+k*Math.PI/3,L=c.r*c.arms[k],x2=c.x+Math.cos(a)*L,y2=c.y+Math.sin(a)*L;
        ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(x2,y2);ctx.stroke();
        const bn=Math.max(1,Math.floor(L/((innerWidth>=981?12:15)*dpr)));
        for(let j=1;j<=bn;j++){
          const t=j/(bn+1),bx=c.x+(x2-c.x)*t,by=c.y+(y2-c.y)*t,bl=Math.min((innerWidth>=981?15:11)*dpr,L*(innerWidth>=981?.28:.23));
          for(const s of[-1,1]){
            const ba=a+s*Math.PI/3;
            ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(ba)*bl,by+Math.sin(ba)*bl);ctx.stroke();
          }
        }
      }
      ctx.shadowBlur=0;
    }
    function frame(now){
      const dt=Math.min(32,now-last);last=now;
      ctx.clearRect(0,0,w,h);
      for(const p of solutes){
        p.x+=p.vx*dt*.44;p.y+=p.vy*dt*.44;
        p.vx+=rnd(-.0025,.0025)*dpr;p.vy+=rnd(-.0025,.0025)*dpr;
        if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
        const desktop=innerWidth>=981;
        ctx.fillStyle=isDark()?(desktop?'rgba(110,190,255,.18)':'rgba(110,185,255,.12)'):(desktop?'rgba(40,91,190,.16)':'rgba(40,91,190,.11)');
        ctx.beginPath();ctx.arc(p.x,p.y,(desktop?1.25:1.0)*dpr,0,tau);ctx.fill();
      }
      for(const c of crystals){
        const desktop=innerWidth>=981;
        c.r+=(desktop?.0078:.0105)*dt;
        if(c.r>c.max){
          c.r=rnd(desktop?5.5:2.2,desktop?10:4.5)*dpr;
          if(desktop){
            const edge=Math.random()<.5;
            c.x=edge?rnd(.02*w,.13*w):rnd(.87*w,.98*w);
            c.y=rnd(.08*h,.92*h);
            c.max=rnd(58,112)*dpr;
          }else{
            c.x=rnd(.035*w,.965*w);c.y=rnd(.05*h,.95*h);
          }
          c.a=rnd(0,tau);
        }
        dendrite(c,desktop?(.20+Math.min(.16,c.r/(260*dpr))):(.12+Math.min(.12,c.r/(210*dpr))));
      }
      requestAnimationFrame(frame);
    }
    resize();addEventListener('resize',resize);requestAnimationFrame(frame);
  }
})();