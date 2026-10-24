// Источники: Microsoft Bing, Google (через скрытый фрейм), Brave Search
const cut=(t,n=320)=>t.length>n?t.slice(0,n-3)+'…':t;
const isBing=h=>/(^|\.)bing\.com$/.test(h);
function real(h){try{const u=new URL(h,'https://www.bing.com');
 if(isBing(u.hostname)){if(u.pathname.startsWith('/ck/')){let p=u.searchParams.get('u');if(p&&p.startsWith('a1')){p=p.slice(2).replace(/-/g,'+').replace(/_/g,'/');while(p.length%4)p+='=';const x=atob(p);return /^https?:/.test(x)?x:null}}return null}
 return /^https?:/.test(u.protocol)?u.href:null}catch(e){return null}}
const T=e=>(e?(e.textContent||''):'').replace(/\s+/g,' ').trim();
async function bing(q,s){const r=await fetch('https://www.bing.com/search?q='+encodeURIComponent(q)+'&setlang=ru&mkt=ru-RU&cc=RU&first='+(s+1),{credentials:'omit'});
 const html=await r.text(),doc=new DOMParser().parseFromString(html,'text/html'),out=[],used=new Set();
 const abs=h=>{try{return new URL(h,'https://www.bing.com').href}catch(e){return null}};
 const take=(a,box)=>{if(!a)return;const title=T(a);if(!title||title.length<2)return;
  let url=real(a.getAttribute('href'));
  if(!url){const c=T(box.querySelector('cite'));if(c&&/\./.test(c))url='https://'+c.replace(/^https?:\/\//,'').split(/[\s›]/)[0]}
  if(!url)url=abs(a.getAttribute('href'));if(!url||used.has(url))return;
  const sn=box.querySelector('.b_caption p,.b_lineclamp2,.b_lineclamp3,.b_lineclamp4,.b_algoSlug,p');
  let t=T(sn);if(t===title)t='';if(t.length>320)t=t.slice(0,317)+'…';used.add(url);out.push({url,title,snippet:t})};
 doc.querySelectorAll('li.b_algo').forEach(li=>{
  const as=[...li.querySelectorAll('a[href]')];
  const a=li.querySelector('a.tilk')||li.querySelector('h2 a')||as.find(x=>real(x.getAttribute('href')))||as.find(x=>/\/ck\//.test(x.getAttribute('href')||''));
  if(!a)return;
  let title=T(li.querySelector('.tptt'))||T(li.querySelector('h2'))||T(a);
  const sn=li.querySelector('.b_caption p,.b_lineclamp2,.b_lineclamp3,.b_lineclamp4,.b_algoSlug,.tpcn p');
  let t=T(sn);
  if(!t){t=T(li).replace(title,'').trim()}
  if(t.length>320)t=t.slice(0,317)+'…';
  let url=real(a.getAttribute('href'));
  if(!url){const c=T(li.querySelector('cite'));if(c&&/\./.test(c))url='https://'+c.replace(/^https?:\/\//,'').split(/[\s›]/)[0]}
  if(!url)url=abs(a.getAttribute('href'));
  if(!title||!url||used.has(url))return;used.add(url);out.push({url,title,snippet:t})});
 if(!out.length)doc.querySelectorAll('#b_results > li').forEach(li=>take(li.querySelector('h2 a'),li));
 if(!out.length)doc.querySelectorAll('h2 a[href]').forEach(a=>take(a,a.closest('li')||a.parentElement.parentElement||doc.body));
 if(!out.length)doc.querySelectorAll('#b_results a[href]').forEach(a=>{const u=real(a.getAttribute('href'));if(!u||used.has(u))return;const t=T(a);if(t.length<4)return;const box=a.closest('li')||a.parentElement;take(a,box)});
 if(!out.length){doc.querySelectorAll('script,style').forEach(e=>e.remove());
  return{results:[],debug:{status:r.status,title:T(doc.querySelector('title')),size:html.length,b_algo:(html.match(/b_algo/g)||[]).length,h2:doc.querySelectorAll('h2').length,a:doc.querySelectorAll('a').length,b_results:[...doc.querySelectorAll('#b_results > *')].slice(0,8).map(e=>e.tagName+'.'+e.className).join(' | '),text:T(doc.body).slice(0,200)}}}
 return{results:out}}

async function brave(q,s){const r=await fetch('https://search.brave.com/search?q='+encodeURIComponent(q)+'&source=web&offset='+(s/10),{credentials:'omit'});
 if(!r.ok)return{results:[],error:'HTTP '+r.status};
 const html=await r.text(),doc=new DOMParser().parseFromString(html,'text/html'),out=[],used=new Set();
 const ext=h=>{try{const u=new URL(h,'https://search.brave.com');return /^https?:$/.test(u.protocol)&&!/(^|\.)brave\.com$/.test(u.hostname)?u.href:null}catch(e){return null}};
 const add=(a,box)=>{const url=ext(a.getAttribute('href'));if(!url||used.has(url))return;
  const title=T(box.querySelector('.title,.snippet-title,[class*="title"]'))||T(a);if(title.length<3)return;
  let t=T(box.querySelector('.snippet-description,.generic-snippet,.content,[class*="description"]'));if(t===title)t='';
  used.add(url);out.push({url,title:cut(title,140),snippet:cut(t)})};
 doc.querySelectorAll('.snippet[data-type="web"],#results .snippet').forEach(b=>{const a=b.querySelector('a[href]');if(a)add(a,b)});
 if(!out.length)doc.querySelectorAll('#results a[href]').forEach(a=>{if(T(a).length>12)add(a,a.closest('div')||a.parentElement)});
 if(!out.length){doc.querySelectorAll('script,style').forEach(e=>e.remove());return{results:[],debug:{status:r.status,title:T(doc.querySelector('title')),size:html.length,text:T(doc.body).slice(0,160)}}}
 return{results:out}}
function google(q,s){return new Promise(res=>{const id=Math.random().toString(36).slice(2,10);
 const f=document.createElement('iframe');f.style.cssText='position:fixed;left:-9999px;top:0;width:1000px;height:800px;border:0';
 const end=d=>{clearTimeout(t);browser.runtime.onMessage.removeListener(h);f.remove();res(d)};
 const h=m=>{if(m&&m.type==='results'&&m.id===id)end(m.blocked?{results:[],error:m.blocked==='captcha'?'капча Google':'окно согласия Google'}:m)};
 const t=setTimeout(()=>end({results:[],error:'таймаут'}),15000);
 browser.runtime.onMessage.addListener(h);
 f.src='https://www.google.com/search?hl=ru&q='+encodeURIComponent(q)+(s?'&start='+s:'')+'#kubik-'+id;document.body.append(f)})}
