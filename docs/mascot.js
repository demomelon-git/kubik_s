(()=>{const C={r:'#ea4335',y:'#fbbc05',b:'#4285f4',g:'#34a853'};
function gear(R,n,col){const p=[],w=Math.PI/n*.28,v=Math.PI/n*.55;
 for(let i=0;i<n*2;i++){const a=i*Math.PI/n;if(i%2==0)p.push([a-w,R],[a+w,R]);else p.push([a-v,R-7],[a+v,R-7])}
 return `<polygon points="${p.map(([a,r])=>(Math.cos(a)*r).toFixed(1)+','+(Math.sin(a)*r).toFixed(1)).join(' ')}" fill="${col}" stroke="${col}" stroke-width="5" stroke-linejoin="round"/>`}
const spec=[[50,50,C.r,1,0],[150,50,C.y,-1,18],[150,150,C.b,1,0],[50,150,C.g,-1,18]];
const all=[];let speed=1,t=0,last=performance.now();
function make(el){
 el.innerHTML=`<svg viewBox="-8 -8 216 216" width="100%" height="100%">${spec.map((s,i)=>`<g transform="translate(${s[0]} ${s[1]})"><g class="g${i}">${gear(57,10,s[2])}<circle r="15" fill="rgba(0,0,0,.22)"/><circle r="5" fill="rgba(255,255,255,.55)" cx="9"/></g></g>`).join('')}</svg>`;
 const o={el,sv:el.firstChild,gs:[...el.querySelectorAll('[class^=g]')],tx:0,ty:0,cx:0,cy:0};all.push(o);
 el.addEventListener('click',()=>{el.classList.remove('jump');void el.offsetWidth;el.classList.add('jump');el.dispatchEvent(new CustomEvent('poke'))});return o}
function loop(n){const d=(n-last)/1000;last=n;t+=d*30*speed;
 all.forEach(o=>{o.gs.forEach((g,i)=>g.setAttribute('transform',`rotate(${spec[i][3]*t+spec[i][4]})`));
  o.cx+=(o.tx-o.cx)*.12;o.cy+=(o.ty-o.cy)*.12;const b=1+Math.sin(t/9)*.025;
  o.sv.style.transform=`perspective(500px) rotateX(${-o.cy}deg) rotateY(${o.cx}deg) scale(${b},${2-b})`});requestAnimationFrame(loop)}
addEventListener('pointermove',e=>all.forEach(o=>{const r=o.el.getBoundingClientRect();if(!r.width)return;
 const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),L=Math.hypot(dx,dy)||1,k=Math.min(1,L/250);o.tx=dx/L*k*22;o.ty=dy/L*k*22}));
setInterval(()=>{if(speed!==1)return;speed=7;setTimeout(()=>{if(speed===7)speed=1},700)},5000);
requestAnimationFrame(loop);
window.Kubik={make,setSpeed:v=>{speed=v}};})();
