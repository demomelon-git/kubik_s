// Работает внутри скрытого фрейма с поиском Google и отправляет найденные результаты страницы Кубика
(()=>{const id=(location.hash.match(/kubik-(\w+)/)||[])[1];if(!id)return;
const send=m=>browser.runtime.sendMessage(Object.assign({type:'results',id},m)).catch(()=>{});
if(location.hostname.startsWith('consent.')){send({blocked:'consent'});return}
if(location.pathname.startsWith('/sorry')){send({blocked:'captcha'});return}
if(location.pathname!=='/search')return;
const isG=h=>/(^|\.)google\.[a-z.]+$/.test(h);
function clean(u){try{const x=new URL(u);if(isG(x.hostname)){if(x.pathname=='/url'&&(x.searchParams.get('q')||x.searchParams.get('url')))return x.searchParams.get('q')||x.searchParams.get('url');return null}return /^https?:/.test(x.protocol)?u:null}catch(e){return null}}
const txt=e=>((e.innerText||e.textContent)||'').replace(/\s+/g,' ').trim();
function grab(){const out=[],seen=new Set();
 const add=(a,title,root)=>{const u=clean(a.href);if(!u||seen.has(u)||!title)return;
  let c=a;for(let i=0;i<8;i++){const p=c.parentElement;if(!p||p===root||p.querySelectorAll('h3,[role=heading]').length>1)break;c=p}
  const cands=[...c.querySelectorAll('div,span')].filter(e=>!a.contains(e)&&!e.contains(a)&&e.children.length<=8);
  const sn=cands.find(e=>e.hasAttribute('data-sncf'));
  let t=sn?txt(sn):cands.map(txt).filter(x=>x.length>40&&x!==title).sort((x,y)=>y.length-x.length)[0]||'';
  if(t.length>320)t=t.slice(0,317)+'…';seen.add(u);out.push({url:u,title,snippet:t})};
 document.querySelectorAll('a[href] h3, a[href] [role="heading"]').forEach(h=>add(h.closest('a'),txt(h)));
 document.querySelectorAll('h3 a[href]').forEach(a=>add(a,txt(a)));
 if(!out.length){const root=document.querySelector('#rso,#search,main')||document.body;
  root.querySelectorAll('a[href]').forEach(a=>{const t=txt(a);if(t.length>15&&clean(a.href))add(a,t.slice(0,120),root)})}
 return out}
let tries=0;(function tick(){const r=grab();if(r.length)send({results:r});else if(++tries>25)send({results:[],debug:{title:document.title,h3:document.querySelectorAll('h3').length,text:txt(document.body||document.documentElement).slice(0,160)}});else setTimeout(tick,400)})()})();
