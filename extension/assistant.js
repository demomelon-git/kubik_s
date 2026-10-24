(()=>{const SYS='Ты — Кубик, дружелюбный помощник-кубик в поисковом сервисе «Кубик». У тебя нет глаз, но ты всё видишь. Отвечай по-русски, коротко и по делу (до 6 предложений), без лишнего форматирования. Если дан контекст страницы поиска, опирайся на него.';
let hist=[],box=null,busy=false;
const q=s=>box.querySelector(s);
function build(){box=document.createElement('div');box.id='chat';box.hidden=true;
 box.innerHTML=`<div class="ch-h"><b>Кубик</b><span><button id="ch-s" title="Настройки">⚙</button><button id="ch-x">✕</button></span></div>
 <div class="ch-set" hidden><label>API-ключ Gemini<input id="ch-k" type="password" autocomplete="off" placeholder="AQ.…"></label><label>Модель<input id="ch-m" placeholder="gemini-flash-latest"></label><button class="btn" id="ch-save">Сохранить</button></div>
 <div class="ch-msgs" id="ch-l"></div>
 <div class="ch-in"><input id="ch-i" placeholder="Спроси Кубика…" autocomplete="off"><button class="btn" id="ch-go">➤</button></div>`;
 document.body.append(box);
 q('#ch-x').onclick=()=>box.hidden=true;
 q('#ch-s').onclick=async()=>{const s=q('.ch-set');s.hidden=!s.hidden;if(!s.hidden){const c=await browser.storage.local.get(['key','model']);q('#ch-k').value=c.key||'';q('#ch-m').value=c.model||''}};
 q('#ch-save').onclick=async()=>{await browser.storage.local.set({key:q('#ch-k').value.trim(),model:q('#ch-m').value.trim()});q('.ch-set').hidden=true;say('bot','Ключ сохранён. Спрашивай!')};
 q('#ch-go').onclick=send;q('#ch-i').addEventListener('keydown',e=>{if(e.key=='Enter')send()});
 say('bot','Привет! Я Кубик. Чтобы я мог отвечать, нажми ⚙ и вставь API-ключ Gemini.')}
function say(who,t){const d=document.createElement('div');d.className='ch-m '+who;d.textContent=t;const l=q('#ch-l');l.append(d);l.scrollTop=l.scrollHeight;return d}
async function ask(){const c=await browser.storage.local.get(['key','model']);if(!c.key)throw new Error('Нет ключа: нажми ⚙ и вставь его.');
 const ctx=window.kubikCtx?'\n\nКонтекст страницы:\n'+window.kubikCtx():'';
 const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(c.model||'gemini-flash-latest')}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':c.key},
  body:JSON.stringify({systemInstruction:{parts:[{text:SYS+ctx}]},contents:hist.map(m=>({role:m.role,parts:[{text:m.text}]}))})});
 const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error((j.error&&j.error.message)||('ошибка '+r.status));
 return((j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[]).map(p=>p.text||'').join('').trim()||'(пустой ответ)'}
async function send(){if(busy)return;const i=q('#ch-i'),t=i.value.trim();if(!t)return;i.value='';say('me',t);hist.push({role:'user',text:t});
 busy=true;Kubik.setSpeed(9);const w=say('bot','…');
 try{const a=await ask();w.textContent=a;hist.push({role:'model',text:a})}catch(e){hist.pop();w.textContent='Не получилось: '+e.message}
 Kubik.setSpeed(1);busy=false}
window.openChat=()=>{if(!box)build();box.hidden=!box.hidden;if(!box.hidden)q('#ch-i').focus()};
})();
