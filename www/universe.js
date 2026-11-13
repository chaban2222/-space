'use strict';
// Карта «от Солнечной системы до других галактик» (единица мира — световой год), страницы звёзд и галактик, тема со свечением.
(function(){
const U=1e-6,TAU=Math.PI*2;
S.exo=S.exo||{};
const SCOL={M:'#ff9d6e',K:'#ffc98a',G:'#fff0b8',F:'#fbf8ff',A:'#dbe6ff'};
const SPN={M:'красный карлик',K:'оранжевая звезда',G:'жёлтая звезда, как Солнце',F:'жёлто-белая звезда',A:'белая звезда'};
STARS.forEach(s=>{const a=s.ra/24*TAU;s.x=Math.cos(a)*s.d;s.y=-Math.sin(a)*s.d;s.c=SCOL[s.sp];});
const SST=STARS.slice().sort((a,b)=>a.d-b.d);
const GC=[Math.cos(2.6)*26000,Math.sin(2.6)*26000];
GALAXIES.forEach(g=>{g.x=GC[0]+Math.cos(g.ang)*g.d;g.y=GC[1]+Math.sin(g.ang)*g.d;});
const plural=(n,a,b,c)=>{n=Math.abs(n)%100;const k=n%10;return n>10&&n<20?c:k===1?a:k>=2&&k<=4?b:c;};
function fmtLy(v){if(v<1)return v.toFixed(2).replace('.',',')+' светового года';
 if(v>=1e6){const m=v/1e6;return (m<10?m.toFixed(1).replace('.',',').replace(',0',''):Math.round(m))+' млн световых лет';}
 const n=v<20?Math.round(v*10)/10:v<1000?Math.round(v):Math.round(v/100)*100;const t=String(n).replace('.',',');
 return n.toLocaleString('ru').replace('.',',')+' '+(Number.isInteger(n)?plural(n,'световой год','световых года','световых лет'):'светового года');}
function yrs(d){const n=d<20?Math.round(d*10)/10:Math.round(d);return n.toLocaleString('ru').replace('.',',')+' '+(Number.isInteger(n)?plural(n,'год','года','лет'):'года');}
const sm=(x,a,b)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`;};
const SPR={};function glow(col){if(SPR[col])return SPR[col];const z=64,c=document.createElement('canvas');c.width=c.height=z;const g=c.getContext('2d'),gr=g.createRadialGradient(z/2,z/2,0,z/2,z/2,z/2);
 gr.addColorStop(0,'#fff');gr.addColorStop(.1,col);gr.addColorStop(.3,hexA(col,.35));gr.addColorStop(1,hexA(col,0));g.fillStyle=gr;g.fillRect(0,0,z,z);return SPR[col]=c;}
// фоновые звёзды: рядом (до 80 св. лет) и подальше (до 4000)
const field=(seed,n,R)=>{const r=rng(seed),a=[];for(let i=0;i<n;i++){const t=r()*TAU,d=R*Math.sqrt(r());a.push([Math.cos(t)*d,Math.sin(t)*d,.6+r()*1.2,r()<.6?'255,190,160':r()<.5?'255,240,210':'200,215,255',.25+r()*.5]);}return a;};
const F1=field('f1',380,80),F2=field('f2',700,4000);
// текстуры галактик
let MWT=null;function mwTex(){if(MWT&&MWT.l===S.lite)return MWT.c;const Z=S.lite?384:640,c=document.createElement('canvas');c.width=c.height=Z;const g=c.getContext('2d'),r=rng('mw2'),C=Z/2;
 let gr=g.createRadialGradient(C,C,0,C,C,C);gr.addColorStop(0,'rgba(255,236,200,.55)');gr.addColorStop(.25,'rgba(190,170,255,.16)');gr.addColorStop(1,'rgba(80,90,200,0)');g.fillStyle=gr;g.fillRect(0,0,Z,Z);
 const N=S.lite?2600:7000;for(let i=0;i<N;i++){const k=i%4,t=Math.pow(r(),.8),rad=Z*(.07+t*.41),a=k*Math.PI/2+Math.log(rad/(Z*.07))*2.3+(r()-.5)*.55*(1-t*.4);
  const x=C+Math.cos(a)*rad+(r()-.5)*Z*.02,y=C+Math.sin(a)*rad+(r()-.5)*Z*.02,q=r();g.fillStyle=q<.06?'rgba(255,140,200,.55)':q<.35?`rgba(170,200,255,${.35+r()*.5})`:`rgba(255,246,232,${.2+r()*.45})`;const s=q<.06?2.2:r()<.08?1.8:1.1;g.fillRect(x,y,s,s);}
 for(let i=0;i<(S.lite?600:1500);i++){const rad=Z*.45*Math.pow(r(),1.6),a=r()*TAU;g.fillStyle=`rgba(255,240,215,${.15+r()*.3})`;g.fillRect(C+Math.cos(a)*rad,C+Math.sin(a)*rad,1,1);}
 g.save();g.translate(C,C);g.rotate(.5);gr=g.createRadialGradient(0,0,0,0,0,Z*.12);gr.addColorStop(0,'rgba(255,245,215,.95)');gr.addColorStop(1,'rgba(255,200,140,0)');g.fillStyle=gr;g.scale(1.8,.7);g.beginPath();g.arc(0,0,Z*.12,0,TAU);g.fill();g.restore();
 MWT={c,l:S.lite};return c;}
let IRT=null;function irrTex(){if(IRT)return IRT;const Z=160,c=document.createElement('canvas');c.width=c.height=Z;const g=c.getContext('2d'),r=rng('irr');
 for(let i=0;i<14;i++){const x=Z*(.25+r()*.5),y=Z*(.3+r()*.4),R=Z*(.08+r()*.18),gr=g.createRadialGradient(x,y,0,x,y,R);gr.addColorStop(0,'rgba(220,225,255,.28)');gr.addColorStop(1,'rgba(200,210,255,0)');g.fillStyle=gr;g.fillRect(0,0,Z,Z);}
 for(let i=0;i<500;i++){const x=Z/2+(r()+r()-1)*Z*.38,y=Z/2+(r()+r()-1)*Z*.28;g.fillStyle=r()<.1?'rgba(255,150,200,.6)':'rgba(240,245,255,.55)';g.fillRect(x,y,1,1);}return IRT=c;}

// ---------- карта ----------
const solarS=()=>Math.min(MW,MH*1.1)/1000/U;
const sMax=()=>solarS()*9,sMin=()=>Math.min(MW,MH)/1.4e7;
const LV=[()=>[0,0,solarS()],()=>[0,0,Math.min(MW,MH)/32],()=>[GC[0]*.85,GC[1]*.85,Math.min(MW,MH)/125000],()=>[(GC[0]+GALAXIES[3].x)/2,(GC[1]+GALAXIES[3].y)/2,Math.min(MW*.6,MH)/3.6e6]];
let FLY=null;const center=()=>[(MW/2-V.x)/V.s,(MH/2-V.y)/V.s];
function flyTo(cx,cy,s){FLY={t:0,st:performance.now(),s0:V.s,s1:s,c0:center(),c1:[cx,cy]};MAPO.dirty=true;}
window.flyLevel=i=>{if(!MW)return;const [x,y,s]=LV[i]();flyTo(x,y,s);};
mapFit=function(){V.s=solarS();V.x=MW/2;V.y=MH/2+10;FLY=null;MAPO.dirty=true;};
let inited=false;
mapResize=function(){const oc=inited&&MW?center():null,ow=MW;mapCv=$('#map');const d=DPR();MW=mapCv.clientWidth;MH=mapCv.clientHeight;if(!MW)return;mapCv.width=MW*d;mapCv.height=MH*d;mapC=mapCv.getContext('2d');
 if(!oc){inited=true;mapFit();}else{V.x=MW/2-oc[0]*V.s;V.y=MH/2-oc[1]*V.s;MAPO.dirty=true;}};
zoomAt=function(sx,sy,f){const ns=Math.max(sMin(),Math.min(sMax(),V.s*f));const wx=(sx-V.x)/V.s,wy=(sy-V.y)/V.s;V.s=ns;V.x=sx-wx*ns;V.y=sy-wy*ns;FLY=null;MAPO.dirty=true;};
$('#zIn').onclick=()=>zoomAt(MW/2,MH/2,2.5);$('#zOut').onclick=()=>zoomAt(MW/2,MH/2,1/2.5);$('#zFit').onclick=()=>flyLevel(0);
$('#map').addEventListener('pointerdown',()=>{FLY=null;});
const lvlB=[...document.querySelectorAll('#lvl button')];lvlB.forEach((b,i)=>b.onclick=()=>flyLevel(i));
const TITLES=['Солнечная система','Ближайшие звёзды','Млечный Путь','Соседние галактики'];let curL=-1,lastSl='';
let HIT=[];
MAPO.always=true;
MAPO.tick=function(dt){
 if(FLY){const f=FLY;f.t=Math.min(1,(performance.now()-f.st)/1800);const e=f.t*f.t*(3-2*f.t),l0=Math.log(f.s0),l1=Math.log(f.s1),s=Math.exp(l0+(l1-l0)*e);
  const w0=1/f.s0,w1=1/f.s1,w=Math.abs(w1-w0)>1e-12*w0?(1/s-w0)/(w1-w0):e;const cx=f.c0[0]+(f.c1[0]-f.c0[0])*w,cy=f.c0[1]+(f.c1[1]-f.c0[1])*w;
  V.s=s;V.x=MW/2-cx*s;V.y=MH/2-cy*s;if(f.t>=1)FLY=null;}
 if(!S.paused)for(let i=1;i<9;i++)ang[i]-=dt*.22/Math.sqrt(YR[i]);};
MAPO.draw=function(){if(!mapC)return;const c=mapC,d=DPR(),s=V.s,Wv=MW/s,lg=Math.log10(Wv);HIT=[];
 c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,mapCv.width,mapCv.height);c.setTransform(d,0,0,d,0,0);
 const X=wx=>V.x+wx*s,Y=wy=>V.y+wy*s,on=(x,y,m)=>x>-m&&x<MW+m&&y>-m&&y<MH+m;
 const aSol=1-sm(lg,-2.4,-1.4),aSun=sm(lg,-2.7,-1.9),aSt=sm(lg,-1.6,-.4)*(1-sm(lg,3.5,4.3)),aF1=sm(lg,-1.2,0)*(1-sm(lg,2.2,3)),aF2=sm(lg,1.5,2.4)*(1-sm(lg,4,4.7)),aMW=sm(lg,3.1,4.2),aGal=sm(lg,4.5,5.3),aLG=sm(lg,6.1,6.5);
 // уровень и заголовок
 const L=lg<-1.6?0:lg<3.3?1:lg<5.4?2:3;if(L!==curL){curL=L;$('#v-map h1').textContent=TITLES[L];lvlB.forEach((b,i)=>b.classList.toggle('on',i===L));}
 const sl=lg<-1.6?'Размеры планет, расстояния и скорости — условные, не в масштабе.':'Поперёк экрана — около '+fmtLy(Wv)+'. Расстояния до звёзд и галактик — примерно в масштабе, размеры звёзд и галактик — условные.';if(sl!==lastSl){lastSl=sl;$('#scaleLbl').textContent=sl;}
 if(lg>4.5)doneTask('t_mw');
 // дальние фоновые звёзды
 if(aF2>.01){for(const [x,y,z,col,a] of F2){const sx=X(x),sy=Y(y);if(!on(sx,sy,2))continue;c.fillStyle=`rgba(${col},${a*aF2})`;c.fillRect(sx,sy,z,z);}}
 // Млечный Путь
 if(aMW>.01){const gs=Math.max(100000*s,80),gx=X(GC[0]),gy=Y(GC[1]);c.globalAlpha=aMW;c.drawImage(mwTex(),gx-gs/2,gy-gs/2,gs,gs);c.globalAlpha=1;
  HIT.push({x:gx,y:gy,r:Math.max(30,gs*.25),f:()=>go('gal','mw'),p:1});
  if(aMW>.3){c.font='600 17px Roboto,sans-serif';c.textAlign='center';c.fillStyle=`rgba(220,230,255,${aMW*(1-aLG*.3)})`;c.shadowColor='#000';c.shadowBlur=6;c.fillText('Млечный Путь',gx,gy+gs*.5+22);c.shadowBlur=0;}}
 // другие галактики
 if(aGal>.01){for(const g of GALAXIES){if(g.id==='mw')continue;const gx=X(g.x),gy=Y(g.y),gs=Math.max({m31:90,m33:50,lmc:30,smc:22}[g.id],g.size*s*(g.id[0]==='m'?1:2.2));if(!on(gx,gy,gs))continue;
   c.save();c.globalAlpha=aGal;c.translate(gx,gy);
   if(g.id==='m31'){c.rotate(-.6);c.scale(1,.34);c.drawImage(mwTex(),-gs/2,-gs/2,gs,gs);}else if(g.id==='m33'){c.rotate(.4);c.scale(1,.7);c.drawImage(mwTex(),-gs/2,-gs/2,gs,gs);}else c.drawImage(irrTex(),-gs/2,-gs/2,gs,gs);
   c.restore();const lbl=g.id[0]==='m'?lg>5.6:lg>4.7&&lg<6.3;
   if(lbl){c.font='600 16px Roboto,sans-serif';c.textAlign='center';c.fillStyle=`rgba(230,235,255,${aGal})`;c.shadowColor='#000';c.shadowBlur=6;c.fillText(g.name,gx,gy+Math.max(gs*.3,10)+20);c.shadowBlur=0;}
   HIT.push({x:gx,y:gy,r:Math.max(30,gs*.4),f:()=>go('gal',g.id),p:2});}}
 if(aLG>.01){const R=4.5e6*s;c.setLineDash([6,8]);c.strokeStyle=`rgba(160,190,255,${.35*aLG})`;c.lineWidth=1.5;c.beginPath();c.arc(X(GC[0]*.5+GALAXIES[3].x*.3),Y(GC[1]*.5+GALAXIES[3].y*.3),R,0,TAU);c.stroke();c.setLineDash([]);
  c.fillStyle=`rgba(190,210,255,${.8*aLG})`;c.font='16px Roboto,sans-serif';c.textAlign='center';c.fillText('Местная группа галактик (граница условная)',X(GC[0]*.5+GALAXIES[3].x*.3),Y(GC[1]*.5+GALAXIES[3].y*.3)-R-8);}
 // кольца расстояний
 if(aSt>.01){c.font='14px Roboto,sans-serif';c.textAlign='center';for(const R of [5,10,25,50,100,250,500,1000,2000]){const rp=R*s;if(rp<40||rp>Math.max(MW,MH)*1.6)continue;const a=.3*Math.min(1,(rp-40)/80)*aSt;
   c.strokeStyle=`rgba(140,170,255,${a})`;c.lineWidth=1;c.setLineDash([3,6]);c.beginPath();c.arc(X(0),Y(0),rp,0,TAU);c.stroke();c.setLineDash([]);c.fillStyle=`rgba(170,195,255,${a*2})`;c.fillText(fmtLy(R),X(0),Y(0)-rp-5);}}
 if(aF1>.01){for(const [x,y,z,col,a] of F1){const sx=X(x),sy=Y(y);if(!on(sx,sy,2))continue;c.fillStyle=`rgba(${col},${a*aF1})`;c.fillRect(sx,sy,z,z);}}
 // звёзды с подписями (ближние подписываются первыми, наложения пропускаются)
 if(aSt>.01){const boxes=[];c.font='600 15px Roboto,sans-serif';c.textAlign='center';
  for(const st of SST){const sx=X(st.x),sy=Y(st.y);if(!on(sx,sy,40))continue;const big=st.planets.length?1:0,z=(st.sp==='M'?16:22)+(S.exo[st.id]?0:2);
   c.globalAlpha=aSt;c.drawImage(glow(st.c),sx-z,sy-z,2*z,2*z);
   if(big){c.strokeStyle=`rgba(124,196,255,${.55*aSt})`;c.lineWidth=1.2;c.beginPath();c.arc(sx,sy,9,0,TAU);c.stroke();}
   c.globalAlpha=1;const dSun=Math.hypot(sx-X(0),sy-Y(0));
   if(dSun>28){const t=st.name+(S.exo[st.id]?' ✓':''),tw=c.measureText(t).width,b=[sx-tw/2-3,sy+12,tw+6,20];
    if(!boxes.some(o=>b[0]<o[0]+o[2]&&o[0]<b[0]+b[2]&&b[1]<o[1]+o[3]&&o[1]<b[1]+b[3])){boxes.push(b);c.fillStyle=big?`rgba(205,230,255,${aSt})`:`rgba(255,240,205,${aSt*.85})`;c.shadowColor='#000';c.shadowBlur=4;c.fillText(t,sx,sy+27);c.shadowBlur=0;}
    HIT.push({x:sx,y:sy,r:30,f:()=>go('exo',st.id),p:3});}}}
 // Солнце-точка, когда Солнечная система уже мала
 if(aSun>.01&&lg<6.6){const sx=X(0),sy=Y(0),z=24;c.globalAlpha=aSun;c.drawImage(glow('#ffd36b'),sx-z,sy-z,2*z,2*z);c.globalAlpha=1;
  if(lg>-1.8){c.strokeStyle='#ffcf5a';c.lineWidth=2;c.beginPath();c.arc(sx,sy,12,0,TAU);c.stroke();c.font='600 16px Roboto,sans-serif';c.textAlign='center';c.fillStyle='#ffe28a';c.shadowColor='#000';c.shadowBlur=5;
   c.fillText(lg>3?'Солнце — мы здесь':'Солнце',sx,sy-20);c.shadowBlur=0;HIT.push({x:sx,y:sy,r:34,f:()=>flyLevel(lg>3?1:0),p:4});}}
 // Солнечная система (условно)
 if(aSol>.01){const ss=s*U;c.save();c.globalAlpha=aSol;c.setTransform(d*ss,0,0,d*ss,d*V.x,d*V.y);
  c.lineWidth=1/ss;c.strokeStyle='rgba(150,180,255,.25)';for(let i=1;i<9;i++){c.beginPath();c.ellipse(0,0,ORB[i],ORB[i]*.92,0,0,7);c.stroke();}
  c.fillStyle='rgba(200,190,170,.55)';for(const b of belt){const a=b[0]+ang[4]*.3;c.fillRect(Math.cos(a)*b[1],Math.sin(a)*b[1]*.92,b[2],b[2]);}
  drawSun(c,0,0,Math.max(PR[0],3/ss));const lab=[];
  for(let i=1;i<9;i++){const [x,y]=pos(i),r=Math.max(PR[i],3/ss),l=Math.hypot(x,y);drawPlanet(c,PLANETS[i],x,y,r,-x/l,-y/l);lab.push([x,y+r*(PLANETS[i].ring?1.4:1),PLANETS[i].name,S.planets[PLANETS[i].id]]);
   if(aSol>.5)HIT.push({x:V.x+x*ss,y:V.y+y*ss,r:Math.max(PR[i]*ss,24)+10,f:()=>go('planet',PLANETS[i].id),p:5});}
  if(aSol>.5)HIT.push({x:V.x,y:V.y,r:Math.max(PR[0]*ss,24)+10,f:()=>go('planet','sun'),p:5});
  c.setTransform(d,0,0,d,0,0);if(ss>.25){c.font='600 17px Roboto,sans-serif';c.textAlign='center';c.shadowColor='#000';c.shadowBlur=4;
   for(const [x,y,n,seen] of lab){c.fillStyle=seen?'#cfe3ff':'#ffffff';c.fillText(n+(seen?' ✓':''),V.x+x*ss,V.y+y*ss+17);}
   c.fillStyle='#ffe9a8';c.fillText('Солнце',V.x,V.y+PR[0]*ss+20);
   if(ss>.9){c.fillStyle='rgba(220,210,190,.7)';c.font='15px Roboto,sans-serif';c.fillText('пояс астероидов',V.x,V.y-216*.92*ss);}c.shadowBlur=0;}
  c.restore();}
};
mapTap=function(sx,sy){let best=null,bd=1e9;for(const o of HIT){const dd=Math.hypot(o.x-sx,o.y-sy);if(dd>o.r)continue;const sc=dd-o.p*6;if(sc<bd){bd=sc;best=o;}}if(best)best.f();};

// ---------- страницы звёзд и галактик ----------
const _render=render;
render=function(v,arg){if(v!=='exo'&&v!=='gal')return _render(v,arg);
 cur=v;curArg=arg;LIVE=[];document.querySelectorAll('.view').forEach(e=>e.classList.remove('on'));document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v==='exo'));renderObj(v,arg);};
const PCOL={rock:[['#9a8572','#8a7562','#6e5e50'],['#8f9298','#7f8288','#5f6268'],['#b08a68','#a07a58','#7a5a40']],super:[['#a08a7a','#8c7a6c','#6a5a4e'],['#9c7f6a','#8b6e5a','#6a5040']],
 mini:[['#a8d4ee','#9ccbe8','#86b8d8']],nept:[['#6f9fd8','#5c8fd0','#4a7cc0']],giant:[['#e2c79c','#d4b484','#c49a6c'],['#d9a87a','#c8956a','#b07a50']]};
const PSZ={rock:15,super:20,mini:24,nept:27,giant:34},PTN={rock:'каменная планета',super:'суперземля — каменная, больше Земли',mini:'мини-нептун',nept:'похожа на Нептун',giant:'газовый гигант'};
function fakeP(p,i){const t=p[2],pal=PCOL[t],col=p[0].startsWith('HD 189733')?['#4f86e0','#3d72cf','#2d5cb0']:pal[i%pal.length];const o={id:'x'+p[0],col};if(t!=='rock'&&t!=='super')o.bands=[col[0],col[1],col[2],col[1]];return o;}
function exoTasks(id){if(id==='proxima')doneTask('t_proxima');if(id==='trappist')doneTask('t_trappist');if(id==='m31')doneTask('t_andromeda');
 if(STARS.filter(s=>s.planets.length&&S.exo[s.id]).length>=10)doneTask('t_exo10');}
function renderObj(kind,id){const v=$('#v-planet'),L=kind==='gal'?GALAXIES:SST,o=L.find(x=>x.id===id),i=L.indexOf(o);v.innerHTML='';v.scrollTop=0;v.classList.add('on');
 if(!S.exo[id]){S.exo[id]=1;save();}setTimeout(()=>exoTasks(id),600);
 const w=h('div','wrap');v.appendChild(w);const hd=h('div','phead');const cv=h('canvas');hd.appendChild(cv);
 const tag=kind==='gal'?o.type:SPN[o.sp]+' · '+fmtLy(o.d)+' от нас';
 hd.appendChild(h('div','t',`<span class="tag">${tag}</span><h2>${o.name}</h2><p>${o.short}</p>`));w.appendChild(hd);
 const st=h('div','stats');
 if(kind==='gal')st.innerHTML=o.stats.map(([a,b])=>`<div><small>${a}</small>${b}</div>`).join('');
 else st.innerHTML=`<div><small>Расстояние</small>около ${fmtLy(o.d)}</div><div><small>Свет летит до нас</small>около ${yrs(o.d)}</div><div><small>Тип звезды</small>${SPN[o.sp]}</div><div><small>Планет известно</small>${o.planets.length||'пока не найдено'}</div><div><small>Видна глазом?</small>${o.eye||'нет, только в телескоп'}</div>`;
 w.appendChild(st);
 if(kind!=='gal'&&o.planets.length){w.appendChild(h('h3',null,'Планеты этой звезды'));const g=h('div','exo-grid');
  o.planets.forEach((p,k)=>{const card=h('div','exo-p'),pc=h('canvas');pc.width=pc.height=1;card.appendChild(pc);
   card.appendChild(h('div',null,`<b>${p[0]}</b><span>${PTN[p[2]]}${p[4].includes('андидат')?'':''}</span><span>Открыта в ${p[1]} году</span>${p[3]?'<span class="hz">🌱 в зоне обитаемости</span>':''}${p[4]?`<p>${p[4]}</p>`:''}`));g.appendChild(card);
   requestAnimationFrame(()=>{const z=84,dd=DPR();pc.width=pc.height=z*dd;pc.style.width=pc.style.height=z+'px';const c=pc.getContext('2d');c.setTransform(dd,0,0,dd,0,0);drawPlanet(c,fakeP(p,k),z/2,z/2,PSZ[p[2]],-.8,-.5);});});
  w.appendChild(g);w.appendChild(h('p',null,'<small style="color:var(--muted)">Планеты нарисованы условно: настоящих фотографий почти нет. У многих экзопланет известна только примерная масса, поэтому их тип — оценка учёных. Данные на 2025–2026 год.</small>'));}
 w.appendChild(h('h3',null,'Интересные факты'));const ul=h('ul','facts');o.facts.forEach(f=>ul.appendChild(h('li',null,f)));w.appendChild(ul);
 const r=h('div','row');r.style.marginTop='18px';
 if(i>0){const b=h('button','btn sec','◀ '+L[i-1].name);b.onclick=()=>go(kind,L[i-1].id,false);r.appendChild(b);}
 if(i<L.length-1){const b=h('button','btn','Дальше: '+L[i+1].name+' ▶');b.onclick=()=>go(kind,L[i+1].id,false);r.appendChild(b);}
 const m=h('button','btn sec','🔭 Показать на карте');m.onclick=()=>{hist=[];render('map');requestAnimationFrame(()=>{if(kind==='gal')flyTo(o.x,o.y,Math.min(MW,MH)/(o.size*(o.id==='mw'?1.3:o.id[0]==='m'?2.5:12)));else flyTo(o.x,o.y,Math.min(MW,MH)/Math.max(12,o.d*.6));});};r.appendChild(m);
 w.appendChild(r);
 requestAnimationFrame(()=>{const d=DPR(),z=cv.clientWidth;cv.width=cv.height=z*d;const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);
  if(kind==='gal'){c.translate(z/2,z/2);if(o.id==='m31'){c.rotate(-.6);c.scale(1,.4);}if(o.id==='m33')c.scale(1,.75);c.drawImage(o.id[0]==='m'||o.id==='mw'?mwTex():irrTex(),-z*.48,-z*.48,z*.96,z*.96);return;}
  const n=o.planets.length,sr=n?z*.13:z*.22;c.drawImage(glow(o.c),z/2-sr*3,z/2-sr*3,sr*6,sr*6);
  const sg=c.createRadialGradient(z/2-sr*.3,z/2-sr*.3,sr*.1,z/2,z/2,sr);sg.addColorStop(0,'#fffdf2');sg.addColorStop(1,o.c);c.fillStyle=sg;c.beginPath();c.arc(z/2,z/2,sr,0,TAU);c.fill();
  o.planets.slice(0,7).forEach((p,k)=>{const R=sr*1.5+(k+1)*(z*.36-sr)/Math.min(n,7),a=k*2.2+.5;c.strokeStyle='rgba(150,180,255,.25)';c.lineWidth=1;c.beginPath();c.arc(z/2,z/2,R,0,TAU);c.stroke();
   const px=z/2+Math.cos(a)*R,py=z/2+Math.sin(a)*R;drawPlanet(c,fakeP(p,k),px,py,Math.max(3,PSZ[p[2]]*.28),-(px-z/2)/R,-(py-z/2)/R);});});}

// ---------- демонстрации ----------
function ov(dd,R,r){if(dd>=R+r)return 0;if(dd<=R-r)return Math.PI*r*r;const a=r*r*Math.acos((dd*dd+r*r-R*R)/(2*dd*r)),b=R*R*Math.acos((dd*dd+R*R-r*r)/(2*dd*R)),k=.5*Math.sqrt((-dd+r+R)*(dd+r-R)*(dd-r+R)*(dd+r+R));return a+b-k;}
Object.assign(DEMOS,{
 transit(){const o=demoBox(.55,400);o.x=-1.5;o.big=true;o.pts=[];
  o.info.innerHTML='Планета проходит перед звездой и закрывает крошечную часть её света. Внизу — график яркости звезды: видишь «ямку»? Размеры условные: настоящая «ямка» обычно совсем маленькая.';
  o.ctrl.append(playBtn(o),btn('Большая / маленькая планета','sec',()=>{o.big=!o.big;o.pts=[];o.x=-1.5;o.dirty=true;}));
  o.tick=dt=>{if(!o.run)return;o.x+=dt*.3;if(o.x>1.5){o.x=-1.5;o.pts=[];doneTask('t_transit');}};
  o.draw=()=>{const {c,w:W,h:H}=o;c.clearRect(0,0,W,H);const cx=W/2,cy=H*.34,R=Math.min(W*.16,H*.25),pr=R*(o.big?.3:.13);
   c.drawImage(glow('#ffc870'),cx-R*2.4,cy-R*2.4,R*4.8,R*4.8);const g=c.createRadialGradient(cx-R*.25,cy-R*.25,R*.1,cx,cy,R);g.addColorStop(0,'#fffbe6');g.addColorStop(1,'#ffae3a');c.fillStyle=g;c.beginPath();c.arc(cx,cy,R,0,TAU);c.fill();
   const px=cx+o.x*R,py=cy+R*.2;c.fillStyle='#0a0f2a';c.beginPath();c.arc(px,py,pr,0,TAU);c.fill();c.strokeStyle='rgba(124,196,255,.7)';c.lineWidth=1.5;c.stroke();
   const b=1-ov(Math.hypot(px-cx,py-cy),R,pr)/(Math.PI*R*R);if(!o.pts.length||o.pts[o.pts.length-1][0]<o.x)o.pts.push([o.x,b]);
   const gx0=W*.08,gx1=W*.92,gy0=H*.7,gy1=H*.95,xm=x=>gx0+(x+1.5)/3*(gx1-gx0),ym=v=>gy0+(1-v)/.1*(gy1-gy0)*.9;
   c.strokeStyle='rgba(150,180,255,.35)';c.lineWidth=1;c.beginPath();c.moveTo(gx0,gy0);c.lineTo(gx0,gy1);c.lineTo(gx1,gy1);c.stroke();
   c.fillStyle='rgba(200,215,255,.8)';c.font='14px Roboto,sans-serif';c.textAlign='left';c.fillText('яркость звезды',gx0+6,gy0-6);c.textAlign='right';c.fillText('время →',gx1,gy1+16);
   c.strokeStyle='#6ee7a8';c.lineWidth=2.5;c.shadowColor='#6ee7a8';c.shadowBlur=8;c.beginPath();o.pts.forEach(([x,v],k)=>k?c.lineTo(xm(x),ym(v)):c.moveTo(xm(x),ym(v)));c.stroke();c.shadowBlur=0;};
  return o.el;},
 exoList(){const g=h('div','sgrid');SST.filter(s=>s.planets.length).forEach(s=>{const n=s.planets.length,b=h('button',S.exo[s.id]?'seen':'',`<i style="background:${s.c};box-shadow:0 0 14px ${s.c}"></i><b>${s.name}</b><small>${fmtLy(s.d)} · ${n} ${plural(n,'планета','планеты','планет')}</small>`);b.onclick=()=>go('exo',s.id);g.appendChild(b);});
  const all=STARS.reduce((a,s)=>a+s.planets.length,0);const box=h('div');box.appendChild(h('p',null,`<small style="color:var(--muted)">В приложении: ${all} ${plural(all,'экзопланета','экзопланеты','экзопланет')} у ${SST.filter(s=>s.planets.length).length} звёзд. Яркие звёзды без известных планет (Сириус, Вега и другие) есть на карте.</small>`));box.appendChild(g);return box;},
 galList(){const g=h('div','sgrid');GALAXIES.forEach(x=>{const b=h('button',S.exo[x.id]?'seen':'',`<i style="background:#c9d4ff;box-shadow:0 0 14px #9fb4ff"></i><b>${x.name}</b><small>${x.d?fmtLy(x.d):'наша галактика'}</small>`);b.onclick=()=>go('gal',x.id);g.appendChild(b);});return g;}
});

// ---------- тема: мерцающие звёзды и метеоры ----------
function twTile(seed){const Z=520,c=document.createElement('canvas');c.width=c.height=Z;const g=c.getContext('2d'),r=rng(seed);
 for(let i=0;i<26;i++){const x=r()*Z,y=r()*Z,s=1+r()*2.2,col=r()<.3?'190,215,255':'255,250,240';const gr=g.createRadialGradient(x,y,0,x,y,s*3);gr.addColorStop(0,`rgba(${col},1)`);gr.addColorStop(.3,`rgba(${col},.5)`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect(x-s*3,y-s*3,s*6,s*6);
  if(s>2.6){g.strokeStyle=`rgba(${col},.45)`;g.lineWidth=.8;g.beginPath();g.moveTo(x-s*4,y);g.lineTo(x+s*4,y);g.moveTo(x,y-s*4);g.lineTo(x,y+s*4);g.stroke();}}
 return c.toDataURL();}
const sky=h('div');sky.id='sky';sky.innerHTML='<div id="tw1"></div><div id="tw2"></div><i class="meteor"></i><i class="meteor m2"></i>';document.body.insertBefore(sky,$('#nav'));
function skyInit(){document.body.classList.toggle('lite',!!S.lite);if(!S.lite){$('#tw1').style.backgroundImage=`url(${twTile('t1')})`;$('#tw2').style.backgroundImage=`url(${twTile('t2')})`;}}
const _bg=bgInit;let skyDone=null;bgInit=function(){_bg();if(skyDone!==S.lite){skyDone=S.lite;MWT=null;skyInit();}};
bgInit();
render('map');
})();
