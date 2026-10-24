const P=new URLSearchParams(location.search),Q=P.get('q')||'';
Kubik.make($('#m1'));Kubik.make($('#m2'));attachSearch($('#q'),$('#sug'),$('#go'));$('#q').value=Q;document.title=Q+' — Кубик';
$('#n-img').href='https://www.bing.com/images/search?q='+encodeURIComponent(Q);$('#n-news').href='https://www.bing.com/news/search?q='+encodeURIComponent(Q);
$('#n-map').href='https://www.bing.com/maps?q='+encodeURIComponent(Q);$('#n-g').href='https://www.google.com/search?q='+encodeURIComponent(Q);
$('#m2').addEventListener('poke',()=>openChat());
const ENG=[{id:'google',name:'Google',fn:google,c:'#4285f4'},{id:'bing',name:'Bing',fn:bing,c:'#00897b'},{id:'brave',name:'Brave',fn:brave,c:'#fb542b'}];
const seen=new Set(),CTX=[];let page=0,busy=false;
window.kubikCtx=()=>'Пользователь на странице поиска по запросу «'+Q+'». Найдено:\n'+CTX.slice(0,8).map((r,i)=>(i+1)+'. '+r.title+' — '+r.url+' — '+r.snippet).join('\n');
const norm=u=>{try{const x=new URL(u);return x.hostname.replace(/^www\./,'')+x.pathname.replace(/\/$/,'')+x.search}catch(e){return u}};
function merge(got){const map=new Map();
 ENG.forEach(e=>{const d=got[e.id];if(!d||!d.results)return;d.results.forEach((r,i)=>{const k=norm(r.url);if(seen.has(k))return;
  let m=map.get(k);if(!m){m={url:r.url,title:r.title,snippet:r.snippet||'',src:[],score:0,k};map.set(k,m)}
  if(!m.src.includes(e.id))m.src.push(e.id);m.score+=1/(60+i);if((r.snippet||'').length>m.snippet.length)m.snippet=r.snippet})});
 return[...map.values()].sort((a,b)=>b.score-a.score)}
function draw(sec,got,done){const list=merge(got);
 const chips=ENG.map(e=>{const d=got[e.id];const s=!d?'⏳':d.error?'✗':'✓ '+d.results.length;return`<span class="chip" style="border-color:${e.c};color:${e.c}" title="${esc(d&&d.error||'')}">${e.name} ${s}</span>`}).join('');
 const errs=ENG.filter(e=>got[e.id]&&got[e.id].error).map(e=>esc(e.name+': '+got[e.id].error)).join(' · ');
 let h=`<div class="chips">${chips}</div>${errs?`<div class="errs">${errs}</div>`:''}`;
 h+=list.map(r=>{let host=r.url;try{host=new URL(r.url).hostname.replace(/^www\./,'')}catch(e){}
  const b=r.src.map(id=>{const e=ENG.find(x=>x.id==id);return`<i class="src" style="background:${e.c}">${e.name}</i>`}).join('');
  return`<div class="r"><div class="site">${esc(host)} ${b}</div><a class="t" href="${esc(r.url)}">${esc(r.title)}</a>${r.snippet?`<p>${esc(r.snippet)}</p>`:''}</div>`}).join('');
 if(done&&!list.length)h+='<div class="msg">Ничего не найдено.'+ENG.map(e=>got[e.id]&&got[e.id].debug?`<details style="margin-top:8px"><summary>${e.name}: подробности</summary><pre style="white-space:pre-wrap;font-size:12px">${esc(JSON.stringify(got[e.id].debug,null,1))}</pre></details>`:'').join('')+'<br><a class="btn" target="_blank" rel="noopener" href="'+$('#n-g').href+'">Искать в Google</a></div>';
 sec.innerHTML=h;return list}
async function loadPage(){if(busy||!Q)return;busy=true;Kubik.setSpeed(9);$('#more')?.remove();
 const s=page*10,sec=document.createElement('div'),got={};$('#res').append(sec);draw(sec,got,false);
 await Promise.all(ENG.map(e=>e.fn(Q,s).catch(er=>({results:[],error:String(er&&er.message||er)})).then(d=>{got[e.id]=d;draw(sec,got,false)})));
 const list=draw(sec,got,true);list.forEach(r=>{seen.add(r.k);CTX.push(r)});
 Kubik.setSpeed(1);busy=false;
 if(list.length){const b=document.createElement('button');b.id='more';b.className='btn';b.textContent='Ещё результаты';b.onclick=()=>{page++;loadPage()};$('#res').append(b)}}
loadPage();
