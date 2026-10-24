const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function go(q){q=q.trim();if(!q)return;
 if(/^https?:\/\//i.test(q)||/^[^\s]+\.[a-zа-я]{2,}(\/\S*)?$/i.test(q)){location.href=/^https?:/i.test(q)?q:'https://'+q;return}
 location.href='results.html?q='+encodeURIComponent(q)}
function attachSearch(input,list,btn){let timer,idx=-1,items=[];
 const hide=()=>{list.innerHTML='';list.hidden=true;idx=-1};
 const mark=()=>[...list.children].forEach((li,i)=>li.classList.toggle('on',i==idx));
 input.addEventListener('input',()=>{clearTimeout(timer);const v=input.value.trim();if(!v)return hide();
  timer=setTimeout(async()=>{try{const r=await fetch('https://api.bing.com/osjson.aspx?query='+encodeURIComponent(v));
   items=(await r.json())[1].slice(0,7);list.innerHTML=items.map(s=>`<li>🔍 ${esc(s)}</li>`).join('');list.hidden=!items.length;idx=-1;
   [...list.children].forEach((li,i)=>li.onclick=()=>go(items[i]))}catch(e){hide()}},150)});
 input.addEventListener('keydown',e=>{if(e.key=='ArrowDown'&&items.length&&!list.hidden){idx=(idx+1)%items.length;input.value=items[idx];mark();e.preventDefault()}
  else if(e.key=='ArrowUp'&&items.length&&!list.hidden){idx=(idx-1+items.length)%items.length;input.value=items[idx];mark();e.preventDefault()}
  else if(e.key=='Enter')go(input.value);else if(e.key=='Escape')hide()});
 document.addEventListener('click',e=>{if(!list.contains(e.target)&&e.target!==input)hide()});
 if(btn)btn.onclick=()=>go(input.value)}
