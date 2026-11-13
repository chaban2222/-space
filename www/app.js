'use strict';
// ---------- состояние ----------
const KEY='kosmos-progress-v1';
let S={planets:{},sections:{},quizzes:{},tasks:{},paused:false,lite:false};
try{const s=JSON.parse(localStorage.getItem(KEY));if(s)S=Object.assign(S,s);}catch(e){}
if(!localStorage.getItem(KEY)){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)S.paused=true;}catch(e){}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
const $=s=>document.querySelector(s);
const h=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const P=id=>PLANETS.find(p=>p.id===id);
const MOON={id:'moon',col:['#e6e6e6','#b4b4b4','#7a7a7a']};
const DPR=()=>S.lite?1:Math.min(window.devicePixelRatio||1,2);
function rng(seed){let a=0;for(const ch of String(seed))a=(a*31+ch.charCodeAt(0))|0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
let toastT;function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),3200);}
function doneTask(id){if(S.tasks[id])return;S.tasks[id]=1;save();const t=TASKS.find(x=>x.id===id);toast('🏅 Задание выполнено: '+t.text);updChip();}
function updChip(){const t=TASKS.find(x=>!S.tasks[x.id]);$('#taskChip').textContent=t?'🔭 Задание: '+t.text:'🏆 Все задания выполнены!';}

// ---------- рисование планет ----------
const TEX={};
function tex(p){
 const sz=S.lite?128:256;if(TEX[p.id]&&TEX[p.id].width===sz)return TEX[p.id];
 const c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d'),r=rng(p.id),Z=sz;
 g.fillStyle=p.col[1];g.fillRect(0,0,Z,Z);
 const blob=(x,y,rx,ry,col)=>{g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,r()*3,0,7);g.fill();};
 if(p.bands){const n=16;for(let i=0;i<n;i++){g.fillStyle=p.bands[i%p.bands.length];const y=i*Z/n+(r()-.5)*4;g.fillRect(0,y,Z,Z/n+3);}
  for(let i=0;i<70;i++){g.fillStyle=`rgba(${r()<.5?'255,250,240':'90,60,40'},${.05+r()*.1})`;g.fillRect(0,r()*Z,Z,1+r()*3);}
  if(p.id==='jupiter'){blob(Z*.64,Z*.64,Z*.11,Z*.06,'#c0573a');blob(Z*.64,Z*.64,Z*.07,Z*.035,'#d9785a');}}
 else if(p.id==='earth'){const og=g.createLinearGradient(0,0,0,Z);og.addColorStop(0,'#2a7be0');og.addColorStop(.5,'#1f5fc2');og.addColorStop(1,'#2a7be0');g.fillStyle=og;g.fillRect(0,0,Z,Z);
  for(let k=0;k<7;k++){const cx=r()*Z,cy=Z*.2+r()*Z*.6;for(let i=0;i<9;i++)blob(cx+(r()-.5)*Z*.2,cy+(r()-.5)*Z*.18,Z*(.03+r()*.06),Z*(.02+r()*.05),r()<.75?'#3f9a4a':'#b8a065');}
  for(let i=0;i<28;i++)blob(r()*Z,r()*Z,Z*(.03+r()*.09),Z*(.01+r()*.025),'rgba(255,255,255,.55)');
  blob(Z/2,0,Z*.6,Z*.08,'#f4f8ff');blob(Z/2,Z,Z*.6,Z*.08,'#f4f8ff');}
 else if(p.id==='mars'){for(let i=0;i<26;i++)blob(r()*Z,r()*Z,Z*(.03+r()*.1),Z*(.02+r()*.06),r()<.6?'rgba(90,30,10,.35)':'rgba(240,160,110,.25)');blob(Z/2,Z*.02,Z*.3,Z*.07,'#fff6f0');}
 else if(p.id==='venus'){for(let i=0;i<30;i++)blob(r()*Z,r()*Z,Z*(.15+r()*.3),Z*(.02+r()*.04),r()<.5?'rgba(255,240,200,.25)':'rgba(160,120,60,.2)');}
 else if(p.id==='uranus'||p.id==='neptune'){const n=10;for(let i=0;i<n;i++){g.fillStyle=`rgba(255,255,255,${r()*.08})`;g.fillRect(0,i*Z/n,Z,Z/n);}
  if(p.id==='neptune'){blob(Z*.4,Z*.6,Z*.08,Z*.045,'#16307a');blob(Z*.5,Z*.45,Z*.12,Z*.012,'rgba(255,255,255,.6)');}}
 else{for(let i=0;i<30;i++)blob(r()*Z,r()*Z,Z*(.04+r()*.14),Z*(.03+r()*.1),r()<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.08)');
  for(let i=0;i<(p.id==='moon'?25:45);i++){const x=r()*Z,y=r()*Z,cr=Z*(.008+r()*.035);g.fillStyle='rgba(40,35,30,.3)';g.beginPath();g.arc(x,y,cr,0,7);g.fill();g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=1;g.beginPath();g.arc(x-1,y-1,cr,0,7);g.stroke();}}
 return TEX[p.id]=c;
}
function drawSun(c,x,y,r,glow=1){
 if(glow){const g=c.createRadialGradient(x,y,r*.6,x,y,r*2.6);g.addColorStop(0,'rgba(255,190,70,.5)');g.addColorStop(1,'rgba(255,140,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r*2.6,0,7);c.fill();}
 const d=c.createRadialGradient(x-r*.2,y-r*.2,r*.1,x,y,r);d.addColorStop(0,'#fffbe0');d.addColorStop(.55,'#ffd34d');d.addColorStop(1,'#ff9a1f');c.fillStyle=d;c.beginPath();c.arc(x,y,r,0,7);c.fill();
}
function ring(c,x,y,r,front){c.save();c.translate(x,y);c.rotate(-.35);for(let k=1.35;k<=2.25;k+=.12){c.strokeStyle=`rgba(225,200,150,${k>1.8&&k<1.9?.18:.55})`;c.lineWidth=Math.max(.6,r*.11);c.beginPath();c.ellipse(0,0,r*k,r*k*.28,0,front?0:Math.PI,front?Math.PI:2*Math.PI);c.stroke();}c.restore();}
function drawPlanet(c,p,x,y,r,lx=-1,ly=0){
 if(p.id==='sun')return drawSun(c,x,y,r);
 if(p.ring)ring(c,x,y,r,false);
 c.save();c.beginPath();c.arc(x,y,r,0,7);c.clip();c.drawImage(tex(p),x-r,y-r,2*r,2*r);
 const g=c.createRadialGradient(x+lx*r*.45,y+ly*r*.45,r*.1,x+lx*r*.2,y+ly*r*.2,r*1.5);
 g.addColorStop(0,'rgba(255,255,255,.12)');g.addColorStop(.45,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,12,.9)');
 c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();
 if((p.id==='earth'||p.id==='venus'||p.id==='neptune')&&r>8){c.strokeStyle=p.id==='earth'?'rgba(120,190,255,.45)':'rgba(255,240,200,.3)';c.lineWidth=r*.06;c.beginPath();c.arc(x,y,r*1.02,0,7);c.stroke();}
 if(p.ring)ring(c,x,y,r,true);
}
// подготовка canvas под размер элемента
function fit(cv,aspect,maxH){const w=cv.clientWidth||cv.parentNode.clientWidth||600;const hh=Math.min(w*aspect,maxH||9999);cv.style.height=hh+'px';const d=DPR();cv.width=Math.round(w*d);cv.height=Math.round(hh*d);const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);return{c,w,h:hh};}

// ---------- фон ----------
const BG={cv:$('#bg'),stars:[],t:0,neb:null};
function bgInit(){const cv=BG.cv,d=DPR(),W=Math.max(1,innerWidth),H=Math.max(1,innerHeight);cv.width=W*d;cv.height=H*d;const r=rng('stars'),n=S.lite?70:160;BG.stars=[];
 for(let i=0;i<n;i++)BG.stars.push({x:r()*W,y:r()*H,s:.4+r()*r()*1.8,a:.35+r()*.6,ph:r()*6.3,sp:.4+r()*1.2,c:r()<.15?'190,210,255':r()<.1?'255,225,190':'255,255,255'});
 const nb=document.createElement('canvas');nb.width=W;nb.height=H;const g=nb.getContext('2d');
 [[.2,.25,'60,40,120'],[.8,.7,'20,60,130'],[.6,.15,'90,30,90']].forEach(([x,y,col])=>{const gr=g.createRadialGradient(x*W,y*H,0,x*W,y*H,Math.max(W,H)*.45);gr.addColorStop(0,`rgba(${col},.22)`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect(0,0,W,H);});
 BG.neb=nb;BG.dirty=true;}
function bgDraw(){const c=BG.cv.getContext('2d'),d=DPR();c.setTransform(d,0,0,d,0,0);c.fillStyle='#070b1a';c.fillRect(0,0,innerWidth,innerHeight);c.drawImage(BG.neb,0,0);
 for(const s of BG.stars){const a=s.a;c.fillStyle=`rgba(${s.c},${a})`;c.beginPath();c.arc(s.x,s.y,s.s,0,7);c.fill();}}

// ---------- живые объекты (анимации) ----------
let LIVE=[];const MAPO={};
function visible(el){const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0;}
let last=performance.now(),acc=0;
function loop(now){requestAnimationFrame(loop);try{frame(now);}catch(e){console.error(e);}}
// Фон неподвижный (рисуется только при изменении размера), анимации — до 30 кадров/с: меньше нагрузка и расход батареи.
function frame(now){acc+=Math.max(0,(now-last)/1000);last=now;
 if(BG.dirty){bgDraw();BG.dirty=false;}
 if(acc<.03)return;const dt=Math.min(.1,acc);acc=0;
 const list=cur==='map'?[MAPO]:LIVE;
 for(const o of list){if(!visible(o.el))continue;if(o.onVis)o.onVis();if(o.cv&&!o.c&&o.size)o.size();if(!o.draw||(o.cv&&!o.c))continue;
  if((!S.paused||o.always)&&o.tick){o.tick(dt);o.dirty=true;}if(o.dirty){o.dirty=false;o.draw();}}}

// ---------- карта Солнечной системы ----------
const ORB=[0,70,100,135,175,250,330,405,470],PR=[38,7,10,10.5,8,22,19,14,14],YR=[1,.24,.62,1,1.88,11.86,29.46,84,164.8];
const ang=PLANETS.map((p,i)=>i*2.1+.6);
const belt=(()=>{const r=rng('belt'),a=[];for(let i=0;i<140;i++)a.push([r()*6.283,203+r()*26,.6+r()*1.1]);return a;})();
const V={s:1,x:0,y:0};let mapCv,mapC,MW,MH;
function mapResize(){mapCv=$('#map');const d=DPR();MW=mapCv.clientWidth;MH=mapCv.clientHeight;if(!MW)return;mapCv.width=MW*d;mapCv.height=MH*d;mapC=mapCv.getContext('2d');mapFit();}
function mapFit(){V.s=Math.min(MW,MH*1.1)/(2*500);V.x=MW/2;V.y=MH/2+10;MAPO.dirty=true;}
function zoomAt(sx,sy,f){const fitS=Math.min(MW,MH)/(1000);const ns=Math.max(fitS*.6,Math.min(fitS*9,V.s*f));const wx=(sx-V.x)/V.s,wy=(sy-V.y)/V.s;V.s=ns;V.x=sx-wx*ns;V.y=sy-wy*ns;MAPO.dirty=true;}
const pos=i=>[Math.cos(ang[i])*ORB[i],Math.sin(ang[i])*ORB[i]*.92];
Object.assign(MAPO,{el:$('#v-map'),dirty:true,
 tick(dt){for(let i=1;i<9;i++)ang[i]-=dt*.22/Math.sqrt(YR[i]);},
 draw(){if(!mapC)return;const c=mapC,d=DPR(),s=V.s;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,mapCv.width,mapCv.height);
  c.setTransform(d*s,0,0,d*s,d*V.x,d*V.y);
  c.lineWidth=1/s;c.strokeStyle='rgba(150,180,255,.22)';for(let i=1;i<9;i++){c.beginPath();c.ellipse(0,0,ORB[i],ORB[i]*.92,0,0,7);c.stroke();}
  c.fillStyle='rgba(200,190,170,.55)';for(const b of belt){const a=b[0]+ang[4]*.3;c.fillRect(Math.cos(a)*b[1],Math.sin(a)*b[1]*.92,b[2],b[2]);}
  drawSun(c,0,0,PR[0]);
  const lab=[];
  for(let i=1;i<9;i++){const [x,y]=pos(i),r=Math.max(PR[i],4/s),l=Math.hypot(x,y);drawPlanet(c,PLANETS[i],x,y,r,-x/l,-y/l);lab.push([x,y+r*(PLANETS[i].ring?1.4:1),PLANETS[i].name,S.planets[PLANETS[i].id]]);}
  c.setTransform(d,0,0,d,0,0);c.font='600 17px Roboto,sans-serif';c.textAlign='center';c.shadowColor='#000';c.shadowBlur=4;
  for(const [x,y,n,seen] of lab){c.fillStyle=seen?'#cfe3ff':'#ffffff';c.fillText(n+(seen?' ✓':''),V.x+x*s,V.y+y*s+17);}
  c.fillStyle='#ffe9a8';c.fillText('Солнце',V.x,V.y+PR[0]*s+20);
  if(s>.9){c.fillStyle='rgba(220,210,190,.7)';c.font='15px Roboto,sans-serif';c.fillText('пояс астероидов',V.x,V.y-216*.92*s);}
  c.shadowBlur=0;}});
function mapTap(sx,sy){let best=-1,bd=1e9;for(let i=0;i<9;i++){const [x,y]=i?pos(i):[0,0];const dx=V.x+x*V.s-sx,dy=V.y+y*V.s-sy,dd=Math.hypot(dx,dy),hit=Math.max(PR[i]*V.s,24)+10;if(dd<hit&&dd<bd){bd=dd;best=i;}}
 if(best>=0)go('planet',PLANETS[best].id);}
function mapInput(){const cv=$('#map'),pts=new Map();let moved=0,t0=0,pinch=null;
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.offsetX,e.offsetY]);if(pts.size===1){moved=0;t0=performance.now();}pinch=null;});
 cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const p=pts.get(e.pointerId),nx=e.offsetX,ny=e.offsetY;
  if(pts.size===1){V.x+=nx-p[0];V.y+=ny-p[1];moved+=Math.abs(nx-p[0])+Math.abs(ny-p[1]);MAPO.dirty=true;pts.set(e.pointerId,[nx,ny]);}
  else{pts.set(e.pointerId,[nx,ny]);const [a,b]=[...pts.values()];const dd=Math.hypot(a[0]-b[0],a[1]-b[1]),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
   if(pinch){zoomAt(mx,my,dd/pinch.d);V.x+=mx-pinch.mx;V.y+=my-pinch.my;}pinch={d:dd,mx,my};moved=99;}});
 const up=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);pinch=null;if(pts.size===0&&moved<12&&performance.now()-t0<600)mapTap(e.offsetX,e.offsetY);};
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{pts.delete(e.pointerId);pinch=null;});
 cv.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.offsetX,e.offsetY,e.deltaY<0?1.15:1/1.15);},{passive:false});
 $('#zIn').onclick=()=>zoomAt(MW/2,MH/2,1.4);$('#zOut').onclick=()=>zoomAt(MW/2,MH/2,1/1.4);$('#zFit').onclick=mapFit;}

// ---------- навигация ----------
const NAV=[['map','☀️','Карта'],...SECTIONS.map(s=>[s.id,s.icon,s.nav||s.title]),['progress','🏅','Прогресс']];
let cur='map',hist=[];
function go(v,arg,push=true){if(push)hist.push([cur,curArg]);render(v,arg);}
let curArg=null;
function render(v,arg){cur=v;curArg=arg;LIVE=[];document.querySelectorAll('.view').forEach(e=>e.classList.remove('on'));
 const navId=v==='planet'?'planets':v==='page'?arg:v;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===navId));
 if(v==='map'){$('#v-map').classList.add('on');mapResize();MAPO.dirty=true;}
 else if(v==='planet'){renderPlanet(arg);}
 else if(v==='progress'){renderProgress();}
 else{renderSection(arg);}}
function back(){if(!$('#quiz').classList.contains('hidden')){closeQuiz();return true;}
 if(hist.length){const [v,a]=hist.pop();render(v,a);return true;}if(cur!=='map'){render('map');return true;}return false;}
function buildNav(){const n=$('#nav');NAV.forEach(([id,i,t])=>{const b=h('button',null,`<span class="i">${i}</span>${t}`);b.dataset.v=id;b.onclick=()=>{hist=[];render(id==='map'||id==='progress'?id:'page',id==='map'||id==='progress'?null:id);};n.appendChild(b);});}

// ---------- раздел ----------
function renderSection(id){const s=SECTIONS.find(x=>x.id===id),v=$('#v-page');v.innerHTML='';v.scrollTop=0;v.classList.add('on');const w=h('div','wrap');v.appendChild(w);
 w.appendChild(h('h2',null,s.icon+' '+s.title));
 for(const b of s.blocks){
  if(b.demo){w.appendChild(DEMOS[b.demo](b));continue;}
  if(b.cards){const g=h('div','cards');b.cards.forEach(([e,t,d])=>g.appendChild(h('div','card',`<div class="e">${e}</div><b>${t}</b><span>${d}</span>`)));w.appendChild(g);continue;}
  if(b.timeline){const t=h('div','tl');b.timeline.forEach(([y,n,d])=>t.appendChild(h('div',null,`<span class="y">${y}</span><b>${n}</b><br>${d}`)));w.appendChild(t);continue;}
  if(b.h)w.appendChild(h('h3',null,b.h));w.appendChild(h('div','blk',`<p>${b.p}</p>`));}
 const end=h('div','blk');end.innerHTML=s.quiz?`<h3 style="margin-top:4px">🧠 Проверь себя</h3><p>${S.quizzes[id]?'Викторина уже пройдена ⭐ — можно пройти ещё раз.':'Небольшая викторина: '+s.quiz.length+(s.quiz.length>4?' вопросов':' вопроса')+'. Ошибаться не страшно — можно попробовать снова.'}</p>`:'<p>Это последний раздел. Загляни в «Прогресс» — какие задания ещё остались?</p>';
 const r=h('div','row');if(s.quiz){const qb=h('button','btn gold','Начать викторину');qb.onclick=()=>openQuiz(id);r.appendChild(qb);}
 const i=SECTIONS.indexOf(s),nx=SECTIONS[i+1];if(nx){const nb=h('button','btn sec',`Дальше: ${nx.icon} ${nx.title}`);nb.onclick=()=>go('page',nx.id);r.appendChild(nb);}
 end.appendChild(r);w.appendChild(end);
 const chk=()=>{if(!S.sections[id]&&v.scrollTop+v.clientHeight>=v.scrollHeight-250){S.sections[id]=1;save();toast('📖 Раздел «'+s.title+'» изучен!');}};v.onscroll=chk;setTimeout(chk,500);}

// ---------- страница планеты ----------
function renderPlanet(id){const p=P(id),v=$('#v-planet'),i=PLANETS.indexOf(p);v.innerHTML='';v.scrollTop=0;v.classList.add('on');
 if(!S.planets[id]){S.planets[id]=1;save();}
 ({jupiter:'t_big',venus:'t_venus',mars:'t_red',uranus:'t_side'})[id]&&setTimeout(()=>doneTask(({jupiter:'t_big',venus:'t_venus',mars:'t_red',uranus:'t_side'})[id]),700);
 const w=h('div','wrap');v.appendChild(w);
 const hd=h('div','phead');const cv=h('canvas');hd.appendChild(cv);
 hd.appendChild(h('div','t',`<span class="tag">${p.type}${p.au?' · '+(i)+'-я от Солнца':''}</span><h2>${p.name}</h2><p>${p.short}</p>`));w.appendChild(hd);
 w.appendChild(h('h3',null,'Главное'));w.appendChild(h('div','blk',`<p>${p.main}</p>`));
 const st=h('div','stats');st.innerHTML=(p.au?`<div><small>Расстояние от Солнца</small>${p.au.toString().replace('.',',')} а.е. ${p.au===1?'(≈150 млн км)':'(≈'+Math.round(p.au*150).toLocaleString('ru')+' млн км)'}</div>`:'')+`<div><small>Диаметр</small>${p.d.toLocaleString('ru')} км</div>`+p.stats.map(([a,b])=>`<div><small>${a}</small>${b}</div>`).join('');w.appendChild(st);
 if(p.au)w.appendChild(h('p',null,'<small style="color:var(--muted)">а.е. — астрономическая единица: среднее расстояние от Земли до Солнца, около 150 миллионов км.</small>'));
 w.appendChild(h('h3',null,'Интересные факты'));const ul=h('ul','facts');p.facts.forEach(f=>ul.appendChild(h('li',null,f)));w.appendChild(ul);
 const r=h('div','row');r.style.marginTop='18px';
 if(i>0){const b=h('button','btn sec','◀ '+PLANETS[i-1].name);b.onclick=()=>go('planet',PLANETS[i-1].id,false);r.appendChild(b);}
 if(i<PLANETS.length-1){const b=h('button','btn','Следующая: '+PLANETS[i+1].name+' ▶');b.onclick=()=>go('planet',PLANETS[i+1].id,false);r.appendChild(b);}
 const m=h('button','btn sec','☀️ К карте');m.onclick=()=>{hist=[];render('map');};r.appendChild(m);w.appendChild(r);
 requestAnimationFrame(()=>{const d=DPR(),z=cv.clientWidth;cv.width=cv.height=z*d;const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);const rr=p.ring?z*.24:p.id==='sun'?z*.3:z*.42;drawPlanet(c,p,z/2,z/2,rr,-.8,-.5);});}

// ---------- демонстрации ----------
function demoBox(aspect,maxH){const box=h('div','demo'),cv=h('canvas'),info=h('div','info'),ctrl=h('div','ctrl');box.append(cv,info,ctrl);const o={el:box,cv,info,ctrl,aspect,maxH,dirty:true};o.size=()=>Object.assign(o,fit(cv,aspect,maxH));LIVE.push(o);requestAnimationFrame(()=>{o.size();o.dirty=true;});return o;}
function btn(t,cls,f){const b=h('button','btn '+(cls||''),t);b.onclick=f;return b;}
function slider(min,max,step,val,f){const s=h('input');s.type='range';s.min=min;s.max=max;s.step=step;s.value=val;s.oninput=()=>f(+s.value);return s;}
function playBtn(o){const b=btn('⏸ Стоп','sec',()=>{o.run=!o.run;b.textContent=o.run?'⏸ Стоп':'▶ Пуск';});o.run=true;o.playB=b;return b;}
function arrow(c,x1,y1,x2,y2){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();const a=Math.atan2(y2-y1,x2-x1);c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-9*Math.cos(a-.4),y2-9*Math.sin(a-.4));c.lineTo(x2-9*Math.cos(a+.4),y2-9*Math.sin(a+.4));c.fill();}
let GAL=null;function galaxyTex(){if(GAL)return GAL;const Z=420,c=document.createElement('canvas');c.width=c.height=Z;const g=c.getContext('2d'),r=rng('gal');
 const gr=g.createRadialGradient(Z/2,Z/2,0,Z/2,Z/2,Z*.18);gr.addColorStop(0,'rgba(255,240,200,.95)');gr.addColorStop(1,'rgba(255,200,140,0)');g.fillStyle=gr;g.fillRect(0,0,Z,Z);
 for(let i=0;i<(S.lite?900:2200);i++){const arm=i%2,t=r()*3.2,rad=Z*.05+t*Z*.13,a=t*1.15+arm*Math.PI+(r()-.5)*.7;const x=Z/2+Math.cos(a)*rad+(r()-.5)*14,y=Z/2+Math.sin(a)*rad+(r()-.5)*14;g.fillStyle=r()<.2?`rgba(170,200,255,${.4+r()*.5})`:`rgba(255,245,230,${.25+r()*.5})`;g.fillRect(x,y,r()<.1?2:1.2,r()<.1?2:1.2);}
 return GAL=c;}

const DEMOS={
 address(){const o=demoBox(.56,440);o.step=0;o.t=1;o.ga=0;
  const T=[['🌍 Земля','Ты живёшь здесь: в Узбекистане, на планете Земля. Земля — третья планета от Солнца.'],
   ['🪐 Солнечная система','Отдалимся. Земля — одна из 8 планет, которые летают вокруг Солнца. Размеры и расстояния здесь условные.'],
   ['🌌 Млечный Путь','Ещё дальше. Солнце — одна из сотен миллиардов звёзд нашей галактики. Отсюда Землю не разглядеть: мы отметили, где примерно находится Солнце. Рисунок условный — снаружи нашу галактику никто не фотографировал.'],
   ['✨ Вселенная','Млечный Путь — лишь одна из сотен миллиардов галактик Вселенной (это оценка учёных). Рисунок условный.']];
  const dots=h('div','dots');const prev=btn('◀ Ближе','sec',()=>set(o.step-1)),next=btn('Дальше ▶','',()=>set(o.step+1));o.ctrl.append(prev,next,dots);
  function set(n){n=Math.max(0,Math.min(3,n));if(n===o.step)return;o.from=o.step;o.step=n;o.t=0;o.dir=n>o.from?1:-1;upd();if(n===3)doneTask('t_universe');}
  function upd(){o.info.innerHTML=`<b>${T[o.step][0]}</b><br>${T[o.step][1]}<br><small style="color:var(--muted)">Твой космический адрес: Узбекистан → Земля → Солнечная система → Млечный Путь → Вселенная</small>`;dots.innerHTML=T.map((_,i)=>`<i class="${i===o.step?'on':''}"></i>`).join('');prev.disabled=o.step===0;next.disabled=o.step===3;prev.style.opacity=o.step?1:.4;next.style.opacity=o.step<3?1:.4;}
  upd();
  const scene=(c,n,W,H)=>{const cx=W/2,cy=H/2,m=Math.min(W,H);
   if(n===0){drawPlanet(c,P('earth'),cx,cy,m*.36,-.7,-.4);c.fillStyle='#ffcf5a';c.beginPath();c.arc(cx+m*.06,cy-m*.13,6,0,7);c.fill();c.font='600 19px Roboto';c.textAlign='left';c.fillText('Ты здесь',cx+m*.06+12,cy-m*.13+6);}
   if(n===1){drawSun(c,cx,cy,m*.07);for(let i=1;i<9;i++){const R=m*.1+i*m*.045,a=i*1.7+(o.ga*.4/Math.sqrt(YR[i]));c.strokeStyle='rgba(150,180,255,.25)';c.lineWidth=1;c.beginPath();c.ellipse(cx,cy,R*1.25,R,0,0,7);c.stroke();drawPlanet(c,PLANETS[i],cx+Math.cos(a)*R*1.25,cy+Math.sin(a)*R,i>4?7:4.5);if(i===3){const x=cx+Math.cos(a)*R*1.25,y=cy+Math.sin(a)*R;c.strokeStyle='#ffcf5a';c.lineWidth=2;c.beginPath();c.arc(x,y,11,0,7);c.stroke();c.fillStyle='#ffcf5a';c.font='600 18px Roboto';c.textAlign='center';c.fillText('Земля',x,y-16);}}}
   if(n===2){c.save();c.translate(cx,cy);c.scale(1,.62);c.rotate(o.ga*.05);const g=galaxyTex(),z=m*1.05;c.drawImage(g,-z/2,-z/2,z,z);const sa=2.3,sr=z*.3;const sx=Math.cos(sa)*sr,sy=Math.sin(sa)*sr;c.restore();
    const px=cx+(Math.cos(sa+o.ga*.05)*sr),py=cy+Math.sin(sa+o.ga*.05)*sr*.62;c.strokeStyle='#ffcf5a';c.lineWidth=2;c.beginPath();c.arc(px,py,9,0,7);c.stroke();c.fillStyle='#ffcf5a';c.font='600 18px Roboto';c.textAlign='center';c.fillText('Солнце примерно здесь',px,py-16);}
   if(n===3){const r=rng('uni');for(let i=0;i<70;i++){const x=r()*W,y=r()*H,s=4+r()*14,a=r()*3;if(Math.hypot(x-cx,y-cy)<60)continue;c.save();c.translate(x,y);c.rotate(a);const gr=c.createRadialGradient(0,0,0,0,0,s);const col=r()<.5?'255,230,200':'190,210,255';gr.addColorStop(0,`rgba(${col},.9)`);gr.addColorStop(1,`rgba(${col},0)`);c.fillStyle=gr;c.scale(1,.3+r()*.6);c.beginPath();c.arc(0,0,s,0,7);c.fill();c.restore();}
    c.save();c.translate(cx,cy);c.scale(1,.6);c.drawImage(galaxyTex(),-30,-30,60,60);c.restore();c.strokeStyle='#ffcf5a';c.lineWidth=2;c.beginPath();c.arc(cx,cy,34,0,7);c.stroke();c.fillStyle='#ffcf5a';c.font='600 18px Roboto';c.textAlign='center';c.fillText('Млечный Путь',cx,cy-42);}};
  o.tick=dt=>{o.ga+=dt;if(o.t<1)o.t=Math.min(1,o.t+dt*1.4);};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const e=o.t<1?o.t*o.t*(3-2*o.t):1;
   if(o.t<1&&o.from!=null){const so=o.dir>0?1-e*.85:1+e*2,sn=o.dir>0?3-2*e:.15+.85*e;
    c.save();c.globalAlpha=1-e;c.translate(W/2,H/2);c.scale(so,so);c.translate(-W/2,-H/2);scene(c,o.from,W,H);c.restore();
    c.save();c.globalAlpha=e;c.translate(W/2,H/2);c.scale(sn,sn);c.translate(-W/2,-H/2);scene(c,o.step,W,H);c.restore();}
   else scene(c,o.step,W,H);};
  o.tickAlways=true;const ot=o.tick;o.tick=dt=>ot(dt);
  // переход должен доигрываться и при паузе
  o.onVis=()=>{if(S.paused&&o.t<1){o.t=1;o.dirty=true;}};
  return o.el;},
 planetGrid(){const g=h('div','pgrid');PLANETS.forEach(p=>{const b=h('button',S.planets[p.id]?'seen':'');const cv=h('canvas');b.append(cv,document.createTextNode(p.name));b.onclick=()=>go('planet',p.id);g.appendChild(b);
   requestAnimationFrame(()=>{const d=DPR();cv.width=cv.height=72*d;const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);drawPlanet(c,p,36,36,p.ring?15:p.id==='sun'?20:28,-.8,-.4);});});return g;},
 sizes(){const box=h('div','demo'),sc=h('div','sizes'),cv=h('canvas');sc.appendChild(cv);box.appendChild(sc);box.appendChild(h('div','info','Размеры планет и Солнца — <b>в одном масштабе</b>. Расстояния между ними — <b>не в масштабе</b>. Листай вправо →'));
  const k=230/142984,gap=74,H=320,list=PLANETS.slice(1);let W=90;list.forEach(p=>W+=p.d*k+gap+(p.ring?p.d*k*.7:0));W+=30;
  const d=DPR();cv.width=W*d;cv.height=H*d;cv.style.width=W+'px';cv.style.height=H+'px';const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);
  const sr=1392700*k/2,cy=H/2-10;drawSun(c,70-sr,cy,sr,0);c.fillStyle='#2a1a00';c.font='600 17px Roboto';c.save();c.translate(36,cy);c.rotate(-Math.PI/2);c.textAlign='center';c.fillText('Край Солнца',0,0);c.restore();
  let x=90+gap/2;c.textAlign='center';list.forEach(p=>{const r=p.d*k/2,ex=p.ring?r*.7:0;x+=ex+r;drawPlanet(c,p,x,cy,r,-1,-.2);c.fillStyle='#fff';c.font='600 17px Roboto';c.fillText(p.name,x,cy+Math.max(r,20)+28);c.fillStyle='#a9b4d6';c.font='15px Roboto';c.fillText(p.d.toLocaleString('ru')+' км',x,cy+Math.max(r,20)+46);x+=r+ex+gap;});
  LIVE.push({el:box,onVis(){doneTask('t_sizes');}});return box;},
 daynight(){const o=demoBox(.5,380);o.m=Math.PI;
  const sl=slider(0,24,.1,12,v=>{o.m=Math.PI+(v-12)/24*2*Math.PI;o.dirty=true;});o.ctrl.append(playBtn(o),h('span',null,'Время:'),sl);
  o.tick=dt=>{if(o.run){o.m+=dt*2*Math.PI/14;}};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const ex=W*.58,ey=H/2,r=H*.36;
   const sg=c.createLinearGradient(0,0,W*.3,0);sg.addColorStop(0,'rgba(255,200,80,.5)');sg.addColorStop(1,'rgba(255,200,80,0)');c.fillStyle=sg;c.fillRect(0,0,W*.3,H);drawSun(c,-H*.25,H/2,H*.45,0);
   c.strokeStyle=c.fillStyle='rgba(255,210,110,.7)';c.lineWidth=2;for(let i=-2;i<=2;i++)arrow(c,W*.16,ey+i*r*.4,ex-r-14,ey+i*r*.4);
   c.save();c.translate(ex,ey);c.rotate(-o.m+Math.PI);c.beginPath();c.arc(0,0,r,0,7);c.clip();c.drawImage(tex(P('earth')),-r,-r,2*r,2*r);c.restore();
   const ng=c.createLinearGradient(ex-r*.15,0,ex+r*.15,0);ng.addColorStop(0,'rgba(0,0,20,0)');ng.addColorStop(1,'rgba(0,0,20,.78)');c.fillStyle=ng;c.beginPath();c.arc(ex,ey,r,0,7);c.fill();
   const mx=ex+Math.cos(o.m)*r*.78,my=ey-Math.sin(o.m)*r*.78;c.fillStyle='#ffcf5a';c.strokeStyle='#000';c.lineWidth=2;c.beginPath();c.arc(mx,my,8,0,7);c.fill();c.stroke();c.font='600 18px Roboto';c.textAlign='center';c.lineWidth=4;c.strokeText('Ташкент',mx,my-14);c.fillText('Ташкент',mx,my-14);
   c.fillStyle='#fff';c.font='17px Roboto';c.fillText('ДЕНЬ',ex-r*.5,ey+r+22);c.fillText('НОЧЬ',ex+r*.5,ey+r+22);
   let hr=((12+(o.m-Math.PI)/(2*Math.PI)*24)%24+24)%24;sl.value=hr;const hh=Math.floor(hr),mm=Math.floor((hr-hh)*6)*10;
   const ph=hr<5.5||hr>=18.5?'🌙 ночь':hr<7?'🌅 утро, восход Солнца':hr<17?'☀️ день':'🌇 вечер, закат';
   o.info.innerHTML=`В Ташкенте сейчас: <b>${ph}</b> (около ${hh}:${String(mm).padStart(2,'0')}).<br><small style="color:var(--muted)">Вид сверху, со стороны Северного полюса. Земля вращается против часовой стрелки. Время показано примерно.</small>`;
   if(ph.includes('ночь'))doneTask('t_night');};
  return o.el;},
 seasons(){const o=demoBox(.5,400);o.mo=0;o.tilt=true;const M=['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
  const sl=slider(0,11.99,.01,0,v=>{o.mo=v;o.dirty=true;});const tb=btn('Наклон оси: есть','sec',()=>{o.tilt=!o.tilt;tb.textContent='Наклон оси: '+(o.tilt?'есть':'нет');o.dirty=true;});
  o.ctrl.append(playBtn(o),h('span',null,'Месяц:'),sl,tb);o.run=false;o.playB.textContent='▶ Пуск';
  o.tick=dt=>{if(o.run)o.mo=(o.mo+dt*.8)%12;};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const cx=W/2,cy=H*.5,rx=W*.36,ry=H*.27;sl.value=o.mo;
   const f=Math.PI+(o.mo-5.67)/12*2*Math.PI,ex=cx+rx*Math.cos(f),ey=cy+ry*Math.sin(f),er=Math.min(30,H*.08);
   c.strokeStyle='rgba(150,180,255,.35)';c.lineWidth=1.5;c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,7);c.stroke();
   const earth=()=>{const dx=cx-ex,dy=cy-ey,l=Math.hypot(dx,dy);drawPlanet(c,P('earth'),ex,ey,er,dx/l,dy/l);
    const a=o.tilt?23.4*Math.PI/180:0,ax=Math.sin(a),ay=-Math.cos(a);c.strokeStyle='#fff';c.lineWidth=2.5;c.beginPath();c.moveTo(ex-ax*er*1.7,ey-ay*er*1.7);c.lineTo(ex+ax*er*1.7,ey+ay*er*1.7);c.stroke();
    c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1;c.beginPath();c.moveTo(ex-ay*er,ey+ax*er);c.lineTo(ex+ay*er,ey-ax*er);c.stroke();
    c.fillStyle='#fff';c.font='600 16px Roboto';c.textAlign='center';c.fillText('С',ex+ax*er*1.7*1.25,ey+ay*er*1.7*1.25-2);
    const ux=ex+ax*er*.55+(-ay)*0,uy=ey+ay*er*.55;c.fillStyle='#ffcf5a';c.beginPath();c.arc(ux,uy,3.5,0,7);c.fill();};
   if(ey<cy)earth();drawSun(c,cx,cy,H*.11);if(ey>=cy)earth();
   c.fillStyle='#ffcf5a';c.font='600 18px Roboto';c.textAlign='center';c.fillText(M[Math.floor(o.mo)],ex,ey+er+26);
   const tw=-Math.cos(f);let s=['зима','зима','весна','весна','весна','лето','лето','лето','осень','осень','осень','зима'][Math.floor(o.mo)];
   let t;if(!o.tilt)t='Без наклона оси Солнце освещало бы оба полушария одинаково весь год. Времён года почти не было бы!';
   else if(tw>.55)t='Северный полюс наклонён <b>к Солнцу</b>. В Узбекистане лучи падают круче, день длинный — тепло.';
   else if(tw<-.55)t='Северный полюс наклонён <b>от Солнца</b>. В Узбекистане лучи падают полого, день короткий — холодно. А в Южном полушарии сейчас лето!';
   else t='Оба полушария освещены почти одинаково: день и ночь примерно равны.';
   o.info.innerHTML=`<b>${M[Math.floor(o.mo)][0].toUpperCase()+M[Math.floor(o.mo)].slice(1)}</b>${o.tilt?` — в Северном полушарии <b>${s}</b>`:''}. ${t}<br><small style="color:var(--muted)">Жёлтая точка — примерно Узбекистан. «С» — Северный полюс. Размеры и форма орбиты условные. Ось всегда смотрит в одну сторону.</small>`;
   if(o.tilt&&tw>.85)doneTask('t_summer');};
  return o.el;},
 moon(){const o=demoBox(.5,400);o.p=Math.PI+.6;o.run=false;
  const sl=slider(0,100,.1,10,v=>{o.p=Math.PI+v/100*2*Math.PI;o.dirty=true;});o.ctrl.append(playBtn(o),h('span',null,'Луна:'),sl);o.run=false;o.playB.textContent='▶ Пуск';
  o.tick=dt=>{if(o.run)o.p+=dt*.5;};
  const cv=o.cv;cv.classList.add('grab');let drag=false;const setP=e=>{const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(x>o.w*.62)return;o.p=Math.atan2(-(y-o.h/2),x-o.w*.32);o.dirty=true;};
  cv.addEventListener('pointerdown',e=>{drag=true;cv.setPointerCapture(e.pointerId);setP(e);});cv.addEventListener('pointermove',e=>{if(drag)setP(e);});cv.addEventListener('pointerup',()=>drag=false);
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const ex=W*.32,ey=H/2,R=Math.min(H*.36,W*.22);
   c.strokeStyle=c.fillStyle='rgba(255,210,110,.6)';c.lineWidth=1.5;for(let i=-2;i<=2;i++)arrow(c,6,ey+i*H*.18,40,ey+i*H*.18);c.font='15px Roboto';c.textAlign='left';c.fillText('свет Солнца',6,22);
   c.strokeStyle='rgba(150,180,255,.35)';c.beginPath();c.arc(ex,ey,R,0,7);c.stroke();drawPlanet(c,P('earth'),ex,ey,H*.07,-1,0);
   const mx=ex+Math.cos(o.p)*R,my=ey-Math.sin(o.p)*R,mr=H*.04;
   c.setLineDash([4,5]);c.strokeStyle='rgba(255,255,255,.35)';c.beginPath();c.moveTo(ex,ey);c.lineTo(mx,my);c.stroke();c.setLineDash([]);
   drawPlanet(c,MOON,mx,my,mr,-1,0);c.fillStyle='#fff';c.font='16px Roboto';c.textAlign='center';c.fillText('Луна',mx,my-mr-6);
   c.fillStyle='#a9b4d6';c.fillText('вид сверху (не в масштабе)',ex,H-10);
   c.strokeStyle='rgba(255,255,255,.15)';c.beginPath();c.moveTo(W*.64,10);c.lineTo(W*.64,H-10);c.stroke();
   const th=((o.p-Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI),dx=W*.82,dy=H/2-8,r=Math.min(H*.32,W*.15),cs=Math.cos(th);
   c.save();c.translate(dx,dy);c.save();c.beginPath();c.arc(0,0,r,0,7);c.clip();c.drawImage(tex(MOON),-r,-r,2*r,2*r);c.fillStyle='rgba(5,8,20,.86)';c.fillRect(-r,-r,2*r,2*r);c.restore();
   c.beginPath();if(th<Math.PI){c.arc(0,0,r,-Math.PI/2,Math.PI/2,false);c.ellipse(0,0,Math.abs(r*cs),r,0,Math.PI/2,-Math.PI/2,cs>0);}else{c.arc(0,0,r,Math.PI/2,3*Math.PI/2,false);c.ellipse(0,0,Math.abs(r*cs),r,0,-Math.PI/2,Math.PI/2,cs>0);}
   c.save();c.clip();c.drawImage(tex(MOON),-r,-r,2*r,2*r);c.restore();c.restore();
   c.fillStyle='#fff';c.font='16px Roboto';c.textAlign='center';c.fillText('так её видно с Земли',dx,H-10);
   const dg=th*180/Math.PI,name=dg<10||dg>350?'новолуние (Луну почти не видно)':dg<80?'растущий серп':dg<100?'первая четверть':dg<170?'растущая Луна':dg<190?'полнолуние':dg<260?'убывающая Луна':dg<280?'последняя четверть':'убывающий серп';
   sl.value=th/(2*Math.PI)*100;
   o.info.innerHTML=`Фаза: <b>${name}</b>. Видно освещённой части: ${Math.round((1-cs)/2*100)}%.<br><small style="color:var(--muted)">Перетащи Луну пальцем по орбите или двигай ползунок. Солнце всегда освещает половину Луны — посмотри на неё сверху. Вид фаз — как из Северного полушария.</small>`;
   if(dg>170&&dg<190)doneTask('t_full');};
  return o.el;},
 starColors(){const o=demoBox(.32,240);const L=[['255,110,80','красная','≈3 000 °C'],['255,170,90','оранжевая','≈4 000 °C'],['255,230,140','жёлтая (Солнце)','≈5 500 °C'],['245,245,255','белая','≈8 000 °C'],['150,190,255','голубая','10 000 °C и больше']];
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const sp=W/L.length;L.forEach(([col,n,t],i)=>{const x=sp*(i+.5),y=H*.4,r=Math.min(sp*.18,H*.16);const g=c.createRadialGradient(x,y,0,x,y,r*2.8);g.addColorStop(0,`rgba(${col},1)`);g.addColorStop(.35,`rgba(${col},.7)`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.beginPath();c.arc(x,y,r*2.8,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(x,y,r*.55,0,7);c.fill();c.font='600 17px Roboto';c.textAlign='center';c.fillText(n,x,H*.8);c.fillStyle='#a9b4d6';c.font='15px Roboto';c.fillText(t,x,H*.8+18);});};
  o.info.innerHTML='Температура поверхности звёзд примерная. Чем горячее звезда, тем она «голубее».';return o.el;},
 galaxy(){const o=demoBox(.56,420);o.a=0;
  o.tick=dt=>{o.a+=dt*.03;};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const m=Math.min(W,H*1.6),cx=W/2,cy=H/2;c.save();c.translate(cx,cy);c.scale(1,.6);c.rotate(o.a);c.drawImage(galaxyTex(),-m/2,-m/2,m,m);c.restore();
   const sa=2.3+o.a,sr=m*.3,px=cx+Math.cos(sa)*sr,py=cy+Math.sin(sa)*sr*.6;c.strokeStyle='#ffcf5a';c.lineWidth=2;c.beginPath();c.arc(px,py,9,0,7);c.stroke();c.fillStyle='#ffcf5a';c.font='600 18px Roboto';c.textAlign='center';c.fillText('Солнце (примерно здесь)',px,py-16);
   c.fillStyle='#fff';c.font='16px Roboto';c.fillText('центр галактики',cx,cy+30);};
  o.info.innerHTML='Рисунок условный: снаружи нашу галактику никто не фотографировал. Учёные знают её форму по наблюдениям изнутри. В центре — сверхмассивная чёрная дыра Стрелец A*.';return o.el;},
 comet(){const o=demoBox(.45,340);o.a=0;
  o.tick=dt=>{const W=o.w,rx=W*.42;const dist=Math.hypot(Math.cos(o.a)*rx+rx*.8,Math.sin(o.a)*o.h*.3);o.a+=dt*60/Math.max(40,dist);};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const sx=W*.14,sy=H/2,rx=W*.42,ry=H*.3,cx=sx+rx*.8;
   c.strokeStyle='rgba(150,180,255,.25)';c.setLineDash([5,6]);c.beginPath();c.ellipse(cx,sy,rx,ry,0,0,7);c.stroke();c.setLineDash([]);drawSun(c,sx,sy,H*.07);
   const x=cx+Math.cos(o.a)*rx,y=sy+Math.sin(o.a)*ry,dx=x-sx,dy=y-sy,l=Math.hypot(dx,dy),len=Math.max(10,(1-l/(rx*1.8))*W*.35);
   const g=c.createLinearGradient(x,y,x+dx/l*len,y+dy/l*len);g.addColorStop(0,'rgba(190,230,255,.85)');g.addColorStop(1,'rgba(190,230,255,0)');c.strokeStyle=g;c.lineCap='round';
   for(let k=-1;k<=1;k++){c.lineWidth=k?3:7;c.beginPath();c.moveTo(x,y);c.lineTo(x+dx/l*len-dy/l*k*len*.12,y+dy/l*len+dx/l*k*len*.12);c.stroke();}
   c.fillStyle='#eaf6ff';c.beginPath();c.arc(x,y,5,0,7);c.fill();c.fillStyle='#fff';c.font='16px Roboto';c.textAlign='center';c.fillText('комета',x,y-12);};
  o.info.innerHTML='Посмотри: хвост всегда смотрит <b>от Солнца</b> и становится длиннее, когда комета подлетает ближе. Размеры и орбита условные.';return o.el;},
 blackhole(){const o=demoBox(.45,320);o.a=0;o.tick=dt=>{o.a+=dt*.4;};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const cx=W/2,cy=H/2,r=H*.2;
   for(let i=0;i<3;i++){const g=c.createRadialGradient(cx,cy,r*.9,cx,cy,r*(1.7+i*.25));g.addColorStop(0,'rgba(255,170,60,.9)');g.addColorStop(.35,'rgba(255,110,30,.45)');g.addColorStop(1,'rgba(255,80,0,0)');c.fillStyle=g;c.beginPath();c.arc(cx,cy,r*2.3,0,7);c.fill();}
   const b=c.createLinearGradient(cx-r*2,0,cx+r*2,0);const k=.5+.15*Math.sin(o.a);b.addColorStop(0,'rgba(255,220,150,0)');b.addColorStop(k,'rgba(255,230,170,.35)');b.addColorStop(1,'rgba(255,220,150,0)');c.fillStyle=b;c.beginPath();c.arc(cx,cy,r*1.5,0,7);c.fill();
   c.fillStyle='#000';c.beginPath();c.arc(cx,cy,r,0,7);c.fill();};
  o.info.innerHTML='Иллюстрация по мотивам настоящих снимков телескопа Event Horizon (2019 и 2022 годы): светится горячий газ вокруг, а в центре — тёмная «тень» чёрной дыры.';
  o.onVis=()=>doneTask('t_bh');return o.el;}
};

// ---------- викторина ----------
let Q=null;
function openQuiz(id){const s=id==='exam'?makeExam():SECTIONS.find(x=>x.id===id);Q={s,i:0,first:0,miss:false};$('#quiz').classList.remove('hidden');qShow();}
function closeQuiz(){$('#quiz').classList.add('hidden');Q=null;if(cur==='page')renderSection(curArg);}
function qShow(){const box=$('#quiz'),{s,i}=Q,q=s.quiz[i];Q.miss=false;box.innerHTML='';const b=h('div','qbox');box.appendChild(b);
 const top=h('div','row');top.style.justifyContent='space-between';top.appendChild(h('span','tag',`${s.icon} ${s.title} · вопрос ${i+1} из ${s.quiz.length}`));top.appendChild(btn('✕','sec',closeQuiz));b.appendChild(top);
 b.appendChild(h('div','q',q.q));const ord=q.a.map((_,k)=>k).sort(()=>Math.random()-.5);const op=h('div','opts'),ex=h('div');b.append(op,ex);
 ord.forEach(k=>{const o=h('button',null,q.a[k]);o.onclick=()=>{if(o.disabled)return;
  if(k===q.c){op.querySelectorAll('button').forEach(x=>x.disabled=true);o.classList.add('ok');if(!Q.miss)Q.first++;ex.className='expl good';ex.innerHTML='✅ <b>Верно!</b> '+q.e;
   const last=i===s.quiz.length-1;const nb=btn(last?'Завершить 🎉':'Следующий вопрос ▶','gold',()=>{if(last)qEnd();else{Q.i++;qShow();}});nb.style.marginTop='14px';ex.appendChild(h('br'));ex.appendChild(nb);}
  else{Q.miss=true;o.disabled=true;o.classList.add('no');ex.className='expl';ex.innerHTML='🤔 <b>Не совсем.</b> '+q.e+'<br>Попробуй выбрать ещё раз!';}};op.appendChild(o);});}
function qEnd(){const {s}=Q;const was=S.quizzes[s.id];S.quizzes[s.id]=1;save();if(s.id==='exam')doneTask('t_exam');const b=$('#quiz');b.innerHTML='';const q=h('div','qbox');b.appendChild(q);
 q.innerHTML=`<div style="text-align:center"><div style="font-size:72px">⭐</div><h2>Викторина пройдена!</h2><p>Раздел «${s.title}»${was?'':': ты получил новый значок'}.<br>С первой попытки: ${Q.first} из ${s.quiz.length}. Каждая ошибка — тоже шаг к знаниям!</p></div>`;
 const r=h('div','row');r.style.justifyContent='center';r.appendChild(btn('Ещё раз','sec',()=>openQuiz(s.id)));r.appendChild(btn('Готово','gold',closeQuiz));q.appendChild(r);}

// ---------- прогресс и раздел для родителей ----------
function renderProgress(){const v=$('#v-progress');v.innerHTML='';v.classList.add('on');v.scrollTop=0;const w=h('div','wrap');v.appendChild(w);
 const QS=SECTIONS.filter(s=>s.quiz),np=PLANETS.filter(p=>S.planets[p.id]).length,ns=SECTIONS.filter(s=>S.sections[s.id]).length,nq=QS.filter(s=>S.quizzes[s.id]).length,nt=TASKS.filter(t=>S.tasks[t.id]).length;
 const pts=np+ns+nq*2+nt,R=[[0,'Начинающий исследователь'],[8,'Юный наблюдатель'],[18,'Исследователь космоса'],[30,'Астроном'],[42,'Космонавт-исследователь'],[54,'Командир звёздной экспедиции']];const ri=R.filter(x=>pts>=x[0]).length-1,rank=R[ri][1],nx=R[ri+1];
 w.appendChild(h('h2',null,'🏅 Мой прогресс'));w.appendChild(h('div','blk',`<p style="font-size:22px">Звание: <b>${rank}</b>${nx?`<br><small style="color:var(--muted);font-size:16px">До звания «${nx[1]}» осталось ${nx[0]-pts} оч.</small>`:''}</p>`+[['Небесные тела изучено',np,PLANETS.length],['Разделов прочитано',ns,SECTIONS.length],['Викторин пройдено',nq,QS.length],['Заданий выполнено',nt,TASKS.length]].map(([a,b,c])=>`${a}: <b>${b} из ${c}</b><div class="bar"><i style="width:${b/c*100}%"></i></div>`).join('')));
 w.appendChild(h('h3',null,'Значки'));const bd=h('div','badges');QS.forEach(s=>bd.appendChild(h('div','badge'+(S.quizzes[s.id]?'':' off'),`<span class="e">${s.icon}</span>${s.title}`)));
 [[np===PLANETS.length,'🪐','Все планеты и Солнце'],[S.tasks.t_lander,'🦅','Пилот лунного модуля'],[S.tasks.t_stage,'🛰️','Инженер ракет'],[S.quizzes.exam,'🏆','Большая викторина'],[nt===TASKS.length,'🔭','Все задания']].forEach(([ok,e,t])=>bd.appendChild(h('div','badge'+(ok?'':' off'),`<span class="e">${e}</span>${t}`)));w.appendChild(bd);
 w.appendChild(h('h3',null,'Исследовательские задания'));const ul=h('ul','tasks');TASKS.forEach(t=>ul.appendChild(h('li',S.tasks[t.id]?'done':'',`<span class="c">${S.tasks[t.id]?'✅':'🔭'}</span><div>${t.text}<small>${S.tasks[t.id]?'Выполнено!':'Подсказка: '+t.hint}</small></div>`)));w.appendChild(ul);
 w.appendChild(h('h3',null,'Настройки'));const st=h('div','row');
 const lb=btn('Облегчённая графика: '+(S.lite?'вкл':'выкл'),'sec',()=>{S.lite=!S.lite;save();Object.keys(TEX).forEach(k=>delete TEX[k]);GAL=null;bgInit();renderProgress();});
 const pb=btn('Анимации: '+(S.paused?'остановлены':'включены'),'sec',()=>{togglePause();renderProgress();});st.append(lb,pb);w.appendChild(st);
 w.appendChild(h('h3',null,'👪 Для родителей'));
 w.appendChild(h('div','blk',`<p>Приложение работает без интернета, без регистрации и рекламы. Оно не собирает личные данные и не просит доступ к камере, микрофону, геолокации или контактам. Прогресс хранится только на этом устройстве.</p>
<p><b>Что упрощено:</b> на карте и в демонстрациях размеры, расстояния и скорости условные (это подписано на экранах). В сравнении размеров диаметры планет и Солнца показаны в одном масштабе. Сравнения с бытовыми вещами — это аналогии, а не точные описания.</p>
<p><b>Точность данных:</b> основные сведения — по материалам NASA, ESA и Международного астрономического союза. Числа спутников планет постоянно растут; в приложении указаны данные на 2025 год. Температуры и расстояния даны округлённо. Ветер, температуры и размеры — средние или типичные значения.</p>
<p><b>Учтённые заблуждения:</b> Плутон — карликовая планета (МАС, 2006). Времена года вызваны наклоном оси, а не расстоянием до Солнца. Чёрные дыры не «засасывают» всё вокруг. Метеоры — не звёзды.</p>`));
 const src=h('div','blk src','<p><b>Источники</b> (откроются в браузере, если есть интернет):</p>'+SOURCES.map(([t,u])=>`<p>• ${t}<br><a href="${u}" target="_blank" rel="noopener">${u}</a></p>`).join(''));w.appendChild(src);
 let sure=false;const rb=btn('Сбросить весь прогресс','sec',()=>{if(!sure){sure=true;rb.textContent='Точно сбросить? Нажми ещё раз';return;}S.planets={};S.sections={};S.quizzes={};S.tasks={};save();updChip();renderProgress();toast('Прогресс сброшен');});w.appendChild(rb);}

// ---------- пауза, запуск ----------
function togglePause(){S.paused=!S.paused;save();$('#pauseBtn').textContent=S.paused?'▶':'⏸';document.body.classList.toggle('paused',S.paused);toast(S.paused?'Анимации остановлены':'Анимации включены');BG.dirty=true;}
$('#pauseBtn').onclick=togglePause;$('#pauseBtn').textContent=S.paused?'▶':'⏸';document.body.classList.toggle('paused',S.paused);
$('#taskChip').onclick=()=>go('progress');
buildNav();bgInit();mapInput();updChip();render('map');
let rsT;addEventListener('resize',()=>{clearTimeout(rsT);rsT=setTimeout(()=>{bgInit();if(cur==='map')mapResize();LIVE.forEach(o=>{if(o.size){o.size();o.dirty=true;}});},150);});
try{const A=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App;if(A)A.addListener('backButton',()=>{if(!back())A.exitApp();});}catch(e){}
requestAnimationFrame(loop);
