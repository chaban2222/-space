'use strict';
// Расширение: пошаговые истории, ракета, пушка Ньютона, МКС, лунный модуль, игры на порядок, итоговая викторина, словарик.
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const fmt=(x,d=1)=>x.toFixed(d).replace('.',',');

Object.assign(DEMOS,{
 steps(b){const box=h('div','demo steps');let i=0;const body=h('div','st-body'),dots=h('div','dots'),row=h('div','ctrl');box.append(body,dots,row);
  const prev=btn('◀ Назад','sec',()=>show(i-1)),next=btn('Дальше ▶','',()=>show(i+1));row.append(prev,next);
  function show(n){i=Math.max(0,Math.min(b.data.length-1,n));const [e,t,hd,p]=b.data[i];
   body.innerHTML=`<div class="st-e">${e}</div><div class="st-t">${t}</div><h4>${hd}</h4><p>${p}</p>`;
   dots.innerHTML=b.data.map((_,k)=>`<i class="${k<=i?'on':''}"></i>`).join('');
   prev.style.opacity=i?1:.4;next.textContent=i===b.data.length-1?'✅ Готово':'Дальше ▶';
   if(i===b.data.length-1&&b.done)doneTask(b.done);}
  show(0);return box;},

 rocket(){const o=demoBox(.62,440);o.always=true;
  const ST=[{dry:40,fuel:330,ve:3.0,col:'#e8ecf2',hgt:.42},{dry:15,fuel:85,ve:3.3,col:'#d5dbe4',hgt:.24},{dry:5,fuel:25,ve:3.5,col:'#c4ccd8',hgt:.13}];
  let s,falling;const reset=()=>{s={ph:'ready',k:0,left:ST.map(x=>x.fuel),att:[1,1,1],v:0,loss:0,alt:0,sep:0};falling=[];o.dirty=true;info();btns();};
  const mass=()=>10+ST.reduce((a,x,k)=>a+(s.att[k]?x.dry+s.left[k]:0),0);
  const b1=btn('🚀 Старт','gold',()=>{s.ph='burn';btns();info();}),b2=btn('✂️ Отделить ступень','',()=>go(true)),b3=btn('Не отделять, включить следующую','sec',()=>go(false)),b4=btn('↻ Ещё раз','sec',reset);
  o.ctrl.append(b1,b2,b3,b4);
  function go(sep){if(s.ph!=='wait')return;if(sep){s.att[s.k]=0;s.sep++;falling.push({k:s.k,y:0,a:1});}s.k++;s.ph='burn';btns();info();}
  function btns(){b1.style.display=s.ph==='ready'?'':'none';b2.style.display=b3.style.display=s.ph==='wait'?'':'none';b4.style.display=s.ph==='done'?'':'none';}
  function info(){const v=Math.max(0,s.v-s.loss);let t;
   if(s.ph==='ready')t='Ракета из трёх ступеней. Цель — набрать <b>7,9 км/с</b>, чтобы выйти на орбиту. Нажми «Старт».';
   else if(s.ph==='burn')t=`Работает ${s.k+1}-я ступень. Скорость: <b>${fmt(v)} км/с</b>.`;
   else if(s.ph==='wait')t=`Топливо ${s.k+1}-й ступени кончилось! Скорость: <b>${fmt(v)} км/с</b>. Что делаем с пустой ступенью?`;
   else t=v>=7.9?`🎉 <b>Орбита!</b> Скорость ${fmt(v)} км/с. Ракета стала легче, отбрасывая пустые ступени, — поэтому ей хватило топлива.`:`Скорость ${fmt(v)} км/с из 7,9 — не хватило, ракета упадёт обратно. Пустые ступени были лишним грузом: топливо тратилось на их разгон. Попробуй отделять ступени!`;
   o.info.innerHTML=t+'<br><small style="color:var(--muted)">Числа условные, но соотношения как у настоящих ракет. Часть скорости уходит на борьбу с притяжением и воздухом.</small>';}
  o.tick=dt=>{if(s.ph==='burn'){const x=ST[s.k],burn=Math.min(s.left[s.k],x.fuel/3*dt),m0=mass();s.left[s.k]-=burn;s.v+=x.ve*Math.log(m0/mass());if(s.k===0)s.loss=Math.min(1.5,s.loss+.5*dt);
    if(s.left[s.k]<=0){if(s.k<2){s.ph='wait';}else{s.ph='done';if(s.v-s.loss>=7.9)doneTask('t_stage');}btns();}info();}
   if(s.ph!=='ready')s.alt+=Math.max(.3,s.v-s.loss)*dt*.12;falling.forEach(f=>{f.y+=dt*120;f.a-=dt*.5;});falling=falling.filter(f=>f.a>0);};
  o.draw=()=>{const {c,w:W,h:H}=o,sky=Math.min(1,s.alt/2);c.clearRect(0,0,W,H);
   const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(40,90,170,${.9*(1-sky)})`);g.addColorStop(1,`rgba(120,170,230,${.9*(1-sky)})`);c.fillStyle=g;c.fillRect(0,0,W,H);
   if(sky>.3){const r=rng('rs');c.fillStyle=`rgba(255,255,255,${sky})`;for(let i=0;i<50;i++)c.fillRect(r()*W,r()*H,1.5,1.5);}
   const gy=H-20+s.alt*120;if(gy<H+400){c.fillStyle='#3c6e3a';c.beginPath();c.ellipse(W/2,gy+W,W*1.3,W,0,0,7);c.fill();}
   const cx=W*.42,rw=Math.min(34,W*.06),Ht=H*.8;let y=H*.88;const vis=[];
   for(let k=0;k<3;k++){if(s.att[k])vis.push(k);}
   // пламя
   if(s.ph==='burn'){const fl=c.createLinearGradient(0,y,0,y+60);fl.addColorStop(0,'#fff6c0');fl.addColorStop(.4,'#ffb030');fl.addColorStop(1,'rgba(255,80,0,0)');c.fillStyle=fl;c.beginPath();c.moveTo(cx-rw*.4,y);c.lineTo(cx+rw*.4,y);c.lineTo(cx+(Math.random()-.5)*6,y+50+Math.random()*15);c.fill();}
   vis.forEach(k=>{const hh=Ht*ST[k].hgt;y-=hh;c.fillStyle=ST[k].col;c.fillRect(cx-rw/2,y,rw,hh);c.strokeStyle='#5a6475';c.lineWidth=1;c.strokeRect(cx-rw/2,y,rw,hh);
    const f=s.left[k]/ST[k].fuel;c.fillStyle='rgba(60,140,255,.35)';c.fillRect(cx-rw/2+3,y+3+(hh-6)*(1-f),rw-6,(hh-6)*f);c.fillStyle='#223';c.font='600 14px Roboto';c.textAlign='center';c.fillText(k+1,cx,y+hh/2+4);});
   c.fillStyle='#e04a3a';c.beginPath();c.moveTo(cx-rw/2,y);c.lineTo(cx+rw/2,y);c.lineTo(cx,y-rw*1.3);c.fill();
   falling.forEach(f=>{c.globalAlpha=Math.max(0,f.a);c.fillStyle=ST[f.k].col;c.save();c.translate(cx-rw*1.4,H*.9+f.y-Ht*ST[f.k].hgt);c.rotate(.4);c.fillRect(-rw/2,0,rw,Ht*ST[f.k].hgt);c.restore();c.globalAlpha=1;});
   const v=Math.max(0,s.v-s.loss),bx=W*.75,bh=H*.75,by=H*.1;c.fillStyle='rgba(0,0,0,.35)';c.fillRect(bx,by,22,bh);const fr=Math.min(1,v/10);c.fillStyle=v>=7.9?'#6ee7a8':'#ffcf5a';c.fillRect(bx,by+bh*(1-fr),22,bh*fr);
   const ty=by+bh*(1-.79);c.strokeStyle='#fff';c.setLineDash([4,3]);c.beginPath();c.moveTo(bx-8,ty);c.lineTo(bx+30,ty);c.stroke();c.setLineDash([]);
   c.fillStyle='#fff';c.font='600 16px Roboto';c.textAlign='left';c.fillText('орбита 7,9',bx+30,ty+5);c.fillText(fmt(v)+' км/с',bx-6,by+bh+18);};
  reset();return o.el;},

 cannon(){const o=demoBox(.62,460);o.always=true;const R=6371,GM=398600,r0=R+400;let v=5,sim=null;
  const sl=slider(1,12,.1,5,x=>{v=x;lab.textContent=fmt(x)+' км/с';});const lab=h('b',null,'5,0 км/с');
  o.ctrl.append(h('span',null,'Скорость:'),sl,lab,btn('💥 Выстрел','gold',()=>{sim={x:0,y:r0,vx:v,vy:0,ang:0,pa:Math.PI/2,trail:[[0,r0]],end:null,t:0,E:v*v/2-GM/r0};o.info.innerHTML='Летит…';}));
  o.info.innerHTML='Выбери скорость и стреляй. Попробуй 3, 7,7 и 11 км/с.<br><small style="color:var(--muted)">Гора, ядро и пушка нарисованы огромными, чтобы их было видно. Воздух не учитывается — это мысленный опыт Ньютона.</small>';
  o.tick=()=>{if(!sim||sim.end)return;for(let i=0;i<14;i++){const r=Math.hypot(sim.x,sim.y),dt=5*Math.pow(r/r0,1.5),a=-GM/(r*r*r);sim.vx+=a*sim.x*dt;sim.vy+=a*sim.y*dt;sim.x+=sim.vx*dt;sim.y+=sim.vy*dt;sim.t+=dt;
    const pa=Math.atan2(sim.y,sim.x);let d=pa-sim.pa;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;sim.ang+=Math.abs(d);sim.pa=pa;
    const rr=Math.hypot(sim.x,sim.y);if(i%2===0)sim.trail.push([sim.x,sim.y]);
    if(rr<R){sim.end='fall';o.info.innerHTML=`Ядро упало на Землю, пролетев около ${Math.round(sim.ang*R).toLocaleString('ru')} км. Чем быстрее выстрел, тем дальше оно падает. Нужно ещё быстрее!`;break;}
    if(sim.ang>=2*Math.PI){sim.end='orbit';doneTask('t_orbit');o.info.innerHTML=v<8.3?'🛰️ <b>Орбита!</b> Ядро всё время падает, но Земля «закругляется» под ним, и оно падает вокруг неё. Так летают спутники и МКС.':'🛰️ <b>Тоже орбита</b>, только вытянутая — эллипс. Ядро улетает далеко, но всё равно возвращается.';break;}
    if(sim.E>=0&&rr>R*4){sim.end='escape';doneTask('t_escape');o.info.innerHTML='☄️ <b>Ядро улетело от Земли навсегда!</b> Это вторая космическая скорость. Так улетают аппараты к другим планетам.';break;}}};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const cx=W/2,cy=H*.56,Rp=Math.min(W,H)*.24,k=Rp/R;
   drawPlanet(c,P('earth'),cx,cy,Rp,-.6,-.6);c.strokeStyle='rgba(120,190,255,.35)';c.lineWidth=3;c.beginPath();c.arc(cx,cy,Rp+3,0,7);c.stroke();
   const mt=r0*k;c.fillStyle='#8a7a66';c.beginPath();c.moveTo(cx-Rp*.22,cy-Rp+4);c.lineTo(cx,cy-mt);c.lineTo(cx+Rp*.22,cy-Rp+4);c.fill();c.fillStyle='#fff';c.beginPath();c.moveTo(cx-Rp*.05,cy-mt+Rp*.05);c.lineTo(cx,cy-mt);c.lineTo(cx+Rp*.05,cy-mt+Rp*.05);c.fill();
   c.fillStyle='#333';c.fillRect(cx-10,cy-mt-6,18,7);
   if(sim){c.strokeStyle='#ffcf5a';c.lineWidth=2;c.beginPath();sim.trail.forEach(([x,y],i)=>{const px=cx+x*k,py=cy-y*k;i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();
    c.fillStyle='#fff';c.beginPath();c.arc(cx+sim.x*k,cy-sim.y*k,5,0,7);c.fill();}};
  return o.el;},

 iss(){const o=demoBox(.56,440),P2={};let sel=null;
  const R=(id,x,y,w,hh)=>P2[id]={x,y,w,h:hh};
  R('zvezda',14,28,15,6);R('zarya',29,28.5,13,5);R('unity',43,27.5,6,7);R('destiny',49,28.5,14,5);R('harmony',63,27.5,7,7);R('columbus',70,28.5,10,5);
  R('kibo',63.5,34.5,6,13);R('nauka',18,34,6,11);R('tranq',43.5,34.5,5,9);R('cupola',44,43.5,4,4);R('arm',53,17,8,10);
  o.info.innerHTML='Нажми на любую часть станции.';
  o.cv.addEventListener('pointerdown',e=>{const r=o.cv.getBoundingClientRect(),{s,ox,oy}=o.sc,ux=(e.clientX-r.left-ox)/s,uy=(e.clientY-r.top-oy)/s;
   let hit=Object.keys(P2).find(id=>{const p=P2[id];return ux>=p.x-1&&ux<=p.x+p.w+1&&uy>=p.y-1&&uy<=p.y+p.h+1;});
   if(!hit&&uy<30&&((ux>6&&ux<34)||(ux>66&&ux<94)))hit='solar';
   if(!hit)return;sel=hit;const d=ISS_PARTS.find(x=>x[0]===hit);o.info.innerHTML=`<b>${d[1]}</b> · <span style="color:var(--blue)">${d[2]}</span><br>${d[3]}`;if(hit==='cupola')doneTask('t_cupola');o.dirty=true;});
  o.draw=()=>{const {c,w:W,h:H}=o,s=Math.min(W/100,H/55),ox=(W-100*s)/2,oy=(H-55*s)/2;o.sc={s,ox,oy};c.clearRect(0,0,W,H);c.save();c.translate(ox,oy);c.scale(s,s);
   const glow=id=>{if(sel===id){c.shadowColor='#ffcf5a';c.shadowBlur=12;}else c.shadowBlur=0;};
   glow('solar');[[8,0],[20,0],[68,0],[80,0]].forEach(([x])=>{[[2,10],[17,10]].forEach(([y,hh])=>{c.fillStyle=sel==='solar'?'#c9a24a':'#8a6d2e';c.fillRect(x,y,7,hh);c.strokeStyle='rgba(255,230,160,.35)';c.lineWidth=.15;for(let j=1;j<4;j++){c.beginPath();c.moveTo(x,y+hh*j/4);c.lineTo(x+7,y+hh*j/4);c.stroke();}});});
   c.shadowBlur=0;c.fillStyle='#9aa3ae';c.fillRect(6,14.2,88,1.6);c.fillRect(45.5,15.5,1.2,12);
   glow('arm');c.strokeStyle=sel==='arm'?'#ffcf5a':'#e6e6e6';c.lineWidth=.8;c.beginPath();c.moveTo(54,16);c.lineTo(59,21);c.lineTo(56,26);c.stroke();
   for(const id in P2){if(id==='arm')continue;const p=P2[id];glow(id);const g=c.createLinearGradient(0,p.y,0,p.y+p.h);g.addColorStop(0,'#f2f5f8');g.addColorStop(1,'#9aa5b3');c.fillStyle=g;
    if(id==='cupola'){c.beginPath();c.arc(p.x+2,p.y+2,2,0,7);c.fill();c.fillStyle='#4a78b8';c.beginPath();c.arc(p.x+2,p.y+2.2,1.1,0,7);c.fill();}
    else{c.beginPath();c.roundRect?c.roundRect(p.x,p.y,p.w,p.h,1.2):c.rect(p.x,p.y,p.w,p.h);c.fill();}
    c.shadowBlur=0;if(sel===id){c.strokeStyle='#ffcf5a';c.lineWidth=.5;c.strokeRect(p.x-.5,p.y-.5,p.w+1,p.h+1);}}
   c.restore();c.font='600 14px Roboto';c.textAlign='center';c.fillStyle='#fff';c.shadowColor='#000';c.shadowBlur=3;
   ISS_PARTS.forEach(([id,n])=>{const p=P2[id];if(!p||id==='arm')return;const tall=p.h>p.w,x=ox+(p.x+p.w/2)*s,y=oy+(tall?p.y+p.h+2.5:p.y+p.h/2+.8)*s;if(id==='cupola'||id==='tranq'){c.textAlign='left';c.fillText(n,ox+(p.x+p.w+1)*s,oy+(p.y+p.h/2+.8)*s);c.textAlign='center';}else if(tall)c.fillText(n,x,y);else{c.shadowBlur=0;c.fillStyle='#14203a';c.fillText(n,x,y);c.fillStyle='#fff';c.shadowBlur=3;}});
   c.fillText('Солнечные батареи',ox+50*s,oy+2*s+6);c.fillText('Канадарм2',ox+62*s,oy+23*s);c.shadowBlur=0;};
  return o.el;},

 lander(){const o=demoBox(.6,440);o.always=true;let s,on=false;
  const reset=()=>{s={h:120,v:8,fuel:100,ph:'fly',t:0};o.dirty=true;msg();};
  const thr=btn('🔥 Двигатель (держи)','gold');thr.style.minWidth='220px';thr.style.minHeight='64px';
  const set=x=>e=>{e.preventDefault();on=x;};thr.addEventListener('pointerdown',set(true));['pointerup','pointerleave','pointercancel'].forEach(ev=>thr.addEventListener(ev,set(false)));
  o.cv.classList.add('grab');o.cv.addEventListener('pointerdown',set(true));['pointerup','pointerleave','pointercancel'].forEach(ev=>o.cv.addEventListener(ev,set(false)));
  o.ctrl.append(thr,btn('↻ Сначала','sec',reset));
  function msg(t){o.info.innerHTML=t||'Держи кнопку или палец на экране, чтобы включить двигатель. Следи за скоростью: зелёная — безопасно.';}
  o.tick=dt=>{if(s.ph!=='fly')return;const burn=on&&s.fuel>0;s.v+=(1.62-(burn?4:0))*dt;if(burn)s.fuel=Math.max(0,s.fuel-8*dt);s.h-=s.v*dt;s.t+=dt;
   if(s.h>140){s.h=140;s.v=Math.max(0,s.v);}
   if(s.h<=0){s.h=0;const v=s.v;s.ph='end';
    if(v<2){doneTask('t_lander');msg(`🎉 <b>«Орёл» сел!</b> Мягкая посадка: ${fmt(v)} м/с. Осталось топлива: ${Math.round(s.fuel)}%. Настоящий пилот!`);}
    else if(v<4)msg(`Посадка жестковата: ${fmt(v)} м/с. Модуль выдержал, но попробуй мягче — меньше 2 м/с. Нажми «Сначала».`);
    else msg(`Слишком быстро: ${fmt(v)} м/с — опоры не выдержали бы. Подсказка: начни тормозить раньше, примерно с середины пути, и держи двигатель дольше. Нажми «Сначала».`);}};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);c.fillStyle='#03050d';c.fillRect(0,0,W,H);const r=rng('ln');c.fillStyle='#fff';for(let i=0;i<60;i++)c.fillRect(r()*W,r()*H*.7,1.2,1.2);
   drawPlanet(c,P('earth'),W*.85,H*.18,Math.min(28,H*.07),-1,0);
   const gy=H-34;c.fillStyle='#8c8c8c';c.fillRect(0,gy,W,34);c.fillStyle='#6d6d6d';for(let i=0;i<9;i++){c.beginPath();c.ellipse(r()*W,gy+8+r()*20,10+r()*25,3+r()*4,0,0,7);c.fill();}
   const ly=gy-14-(s.h/140)*(gy-70),lx=W*.4;
   if(on&&s.fuel>0&&s.ph==='fly'){const fl=c.createLinearGradient(0,ly+8,0,ly+48);fl.addColorStop(0,'#fff6c0');fl.addColorStop(1,'rgba(255,120,0,0)');c.fillStyle=fl;c.beginPath();c.moveTo(lx-7,ly+8);c.lineTo(lx+7,ly+8);c.lineTo(lx+(Math.random()-.5)*4,ly+40+Math.random()*10);c.fill();}
   c.strokeStyle='#cfcfcf';c.lineWidth=2;c.beginPath();c.moveTo(lx-12,ly+2);c.lineTo(lx-22,ly+14);c.moveTo(lx+12,ly+2);c.lineTo(lx+22,ly+14);c.stroke();
   c.fillStyle='#d9a93a';c.beginPath();c.moveTo(lx-14,ly-8);c.lineTo(lx+14,ly-8);c.lineTo(lx+11,ly+6);c.lineTo(lx-11,ly+6);c.fill();
   c.fillStyle='#c9ced6';c.beginPath();c.moveTo(lx-10,ly-8);c.lineTo(lx-7,ly-22);c.lineTo(lx+7,ly-22);c.lineTo(lx+10,ly-8);c.fill();c.fillStyle='#2b3a55';c.fillRect(lx-4,ly-18,8,5);
   const v=s.v,col=v<2?'#6ee7a8':v<4?'#ffcf5a':'#ff8a7a';c.font='600 18px Roboto';c.textAlign='left';c.fillStyle='#fff';c.fillText(`Высота: ${Math.round(s.h)} м`,14,26);c.fillStyle=col;c.fillText(`Скорость: ${fmt(Math.abs(v))} м/с ${v>=0?'вниз':'вверх'}`,14,50);
   c.fillStyle='#fff';c.fillText('Топливо',14,74);c.fillStyle='rgba(255,255,255,.2)';c.fillRect(90,62,120,14);c.fillStyle=s.fuel>25?'#7cc4ff':'#ffcf5a';c.fillRect(90,62,120*s.fuel/100,14);};
  reset();return o.el;},

 order(b){const box=h('div','demo order'),row=h('div','ord-row'),pool=h('div','ord-pool'),inf=h('div','info');box.append(row,pool,inf);let n=0;
  const start=()=>{n=0;row.innerHTML='';pool.innerHTML='';inf.textContent='Выбери первый.';shuffle(b.items).forEach(t=>{const x=h('button','ord-b',t);x.onclick=()=>{
    if(t===b.items[n]){x.remove();row.appendChild(h('span','ord-c',`${n+1}. ${t} ✓`));n++;
     if(n===b.items.length){inf.innerHTML='🎉 <b>Всё верно!</b> ';const r=btn('↻ Ещё раз','sec',start);inf.appendChild(r);if(b.done)doneTask(b.done);}else inf.textContent='Верно! Дальше.';}
    else{x.classList.remove('shake');void x.offsetWidth;x.classList.add('shake');inf.innerHTML=`Не совсем: сейчас нужен ${n+1}-й по порядку. ${b.hint}`;}};pool.appendChild(x);});};
  start();return box;},

 exam(){const box=h('div','blk');box.innerHTML=`<p>${S.quizzes.exam?'Ты уже проходил большую викторину ⭐ — попробуй ещё раз, вопросы будут другие!':'Ошибки не страшны: после каждого ответа будет объяснение.'}</p>`;box.appendChild(btn('🏆 Начать большую викторину','gold',()=>openQuiz('exam')));return box;},

 glossary(){const d=h('div','gloss');GLOSSARY.slice().sort((a,b)=>a[0].localeCompare(b[0],'ru')).forEach(([t,x])=>d.appendChild(h('div',null,`<b>${t}</b><span>${x}</span>`)));return d;}
});

function makeExam(){const all=[];SECTIONS.forEach(s=>(s.quiz||[]).forEach(q=>all.push(q)));return{id:'exam',icon:'🏆',title:'Большая викторина',quiz:shuffle(all).slice(0,15)};}
