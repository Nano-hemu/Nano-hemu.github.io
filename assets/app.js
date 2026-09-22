(()=>{const $=(s,c=document)=>c.querySelector(s),$=(s,c=document)=>[...c.querySelectorAll(s)];

/* THEME PERSISTENCE */
const root=document.documentElement;
const storedTheme=localStorage.getItem("portfolio-theme");
root.dataset.theme=storedTheme==="dark"?"dark":"light";
const themeBtn=$("#themeBtn");
const syncTheme=()=>{if(!themeBtn)return;const dark=root.dataset.theme==="dark";const s=themeBtn.querySelector(".theme-symbol"),t=themeBtn.querySelector(".theme-text");if(s)s.textContent=dark?"☀":"☾";if(t)t.textContent=dark?"Light":"Dark";themeBtn.setAttribute("aria-label",dark?"Switch to light theme":"Switch to dark theme");};
syncTheme();
if(themeBtn)themeBtn.onclick=()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("portfolio-theme",root.dataset.theme);syncTheme();};

const menu=$("#menuBtn"),mobile=$("#mobileMenu");
if(menu&&mobile)menu.onclick=()=>{mobile.classList.toggle("open");menu.setAttribute("aria-expanded",mobile.classList.contains("open"))};

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.1});
$$(".reveal").forEach(e=>io.observe(e));

const glow=$(".glow");
if(glow&&matchMedia("(pointer:fine)").matches){
  addEventListener("mousemove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";glow.style.opacity="1"});
  addEventListener("mouseleave",()=>glow.style.opacity="0");
}

/* Physically inspired crystallisation field.
   Mode A: near-equilibrium, low nucleation density, subcritical nuclei dissolve,
   surviving crystals grow slowly toward faceted six-fold forms.
   Mode B: far-from-equilibrium, high supersaturation, rapid nucleation and
   anisotropic/dendritic growth. This is a conceptual visual model, not a solver. */
const c=$("#networkCanvas");
if(c&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
  const ctx=c.getContext("2d");
  const label=document.createElement("div");
  label.className="crystal-mode";
  document.body.appendChild(label);

  let w=0,h=0,dpr=1,particles=[],crystals=[],mode=0,last=performance.now(),modeT=0;
  const TAU=Math.PI*2;
  const rnd=(a,b)=>a+Math.random()*(b-a);

  function resize(){
    dpr=Math.min(devicePixelRatio||1,2);
    w=c.width=innerWidth*dpr; h=c.height=innerHeight*dpr;
    c.style.width=innerWidth+"px"; c.style.height=innerHeight+"px";
    particles=Array.from({length:Math.min(92,Math.max(48,Math.floor(innerWidth/18)))},()=>({
      x:Math.random()*w,y:Math.random()*h,vx:rnd(-.13,.13)*dpr,vy:rnd(-.13,.13)*dpr
    }));
    resetCrystals();
  }

  function resetCrystals(){
    const n=mode===0?7:18;
    crystals=Array.from({length:n},(_,i)=>({
      x:rnd(.08*w,.92*w),y:rnd(.08*h,.92*h),
      r:rnd(1.5,mode===0?5:3)*dpr,
      max:rnd(mode===0?18:12,mode===0?54:34)*dpr,
      angle:rnd(0,TAU),phase:rnd(0,TAU),
      alive:true,arms:Array.from({length:6},()=>rnd(.55,1))
    }));
    label.textContent=mode===0
      ?"THERMODYNAMIC · nucleation ⇄ dissolution · faceted growth"
      :"NON-EQUILIBRIUM · rapid nucleation → dendritic growth";
  }

  function hex(x,y,r,a,alpha){
    ctx.beginPath();
    for(let k=0;k<6;k++){
      const ang=a+k*Math.PI/3,px=x+Math.cos(ang)*r,py=y+Math.sin(ang)*r;
      k?ctx.lineTo(px,py):ctx.moveTo(px,py);
    }
    ctx.closePath();
    ctx.strokeStyle=root.dataset.theme==="dark"?`rgba(90,240,223,${alpha})`:`rgba(39,100,255,${Math.min(.32,alpha*1.22)})`;
    ctx.lineWidth=.65*dpr; ctx.stroke();
  }

  function dendrite(cr,alpha){
    ctx.strokeStyle=root.dataset.theme==="dark"?`rgba(157,130,255,${alpha})`:`rgba(104,82,220,${Math.min(.30,alpha*1.18)})`;
    ctx.lineWidth=.65*dpr;
    for(let k=0;k<6;k++){
      const ang=cr.angle+k*Math.PI/3;
      const L=cr.r*cr.arms[k];
      const x2=cr.x+Math.cos(ang)*L,y2=cr.y+Math.sin(ang)*L;
      ctx.beginPath();ctx.moveTo(cr.x,cr.y);ctx.lineTo(x2,y2);ctx.stroke();
      const branches=Math.max(1,Math.floor(L/(15*dpr)));
      for(let j=1;j<=branches;j++){
        const t=j/(branches+1),bx=cr.x+(x2-cr.x)*t,by=cr.y+(y2-cr.y)*t,bl=Math.min(10*dpr,L*.22);
        for(const s of [-1,1]){
          const ba=ang+s*Math.PI/3;
          ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(ba)*bl,by+Math.sin(ba)*bl);ctx.stroke();
        }
      }
    }
  }

  function frame(now){
    const dt=Math.min(32,now-last); last=now; modeT+=dt;
    if(modeT>14500){modeT=0;mode=1-mode;resetCrystals();label.classList.remove("pulse");void label.offsetWidth;label.classList.add("pulse");}
    ctx.clearRect(0,0,w,h);

    const speed=mode===0?.23:.62;
    for(const p of particles){
      p.x+=p.vx*dt*speed;p.y+=p.vy*dt*speed;
      p.vx+=rnd(-.004,.004)*dpr;p.vy+=rnd(-.004,.004)*dpr;
      if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
      ctx.fillStyle=root.dataset.theme==="dark"?(mode===0?"rgba(90,240,223,.10)":"rgba(157,130,255,.11)"):(mode===0?"rgba(39,100,255,.105)":"rgba(104,82,220,.10)");
      ctx.beginPath();ctx.arc(p.x,p.y,1.0*dpr,0,TAU);ctx.fill();
    }

    for(const cr of crystals){
      if(!cr.alive)continue;
      if(mode===0){
        const critical=4.2*dpr;
        const drive=cr.r>critical?.0046:-.0032;
        cr.r+=drive*dt;
        if(cr.r<.8*dpr){cr.alive=false;continue;}
        cr.r=Math.min(cr.r,cr.max);
        hex(cr.x,cr.y,cr.r,cr.angle,.10+Math.min(.13,cr.r/(300*dpr)));
        if(cr.r>12*dpr)hex(cr.x,cr.y,cr.r*.66,cr.angle+.02,.06);
      }else{
        cr.r=Math.min(cr.max,cr.r+.0105*dt);
        dendrite(cr,.085+Math.min(.12,cr.r/(180*dpr)));
        if(cr.r>9*dpr)hex(cr.x,cr.y,Math.max(3*dpr,cr.r*.16),cr.angle,.07);
      }
    }
    requestAnimationFrame(frame);
  }
  resize();addEventListener("resize",resize);requestAnimationFrame(frame);
}

$$("[data-count]").forEach(el=>{let started=false,target=+el.dataset.count,suffix=el.dataset.suffix||"",dec=+(el.dataset.decimals||0);const o=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting||started)return;started=true;let s=performance.now(),dur=1100;const tick=t=>{let p=Math.min(1,(t-s)/dur),v=target*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec)+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);o.disconnect()}),{threshold:.5});o.observe(el)});

const fs=$$(".filter"),projects=$$(".project[data-category]");
fs.forEach(b=>b.onclick=()=>{fs.forEach(q=>q.classList.remove("active"));b.classList.add("active");let f=b.dataset.filter;projects.forEach(p=>p.classList.toggle("hidden",f!=="all"&&p.dataset.category!==f))});

const search=$("#blogSearch");
if(search){const cards=$$(".blog");search.oninput=()=>{let q=search.value.toLowerCase().trim();cards.forEach(card=>card.style.display=(card.dataset.search||card.textContent).toLowerCase().includes(q)?"flex":"none")}};

$$("[data-tilt]").forEach(card=>{if(!matchMedia("(pointer:fine)").matches)return;card.onmousemove=e=>{const r=card.getBoundingClientRect(),a=(e.clientX-r.left)/r.width-.5,b=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-b*3}deg) rotateY(${a*4}deg) translateY(-4px)`};card.onmouseleave=()=>card.style.transform=""});
})();