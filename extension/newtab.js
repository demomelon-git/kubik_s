Kubik.make($('#m1'));Kubik.make($('#m2'));attachSearch($('#q'),$('#sug'),$('#go'));
$('#tiles').innerHTML=[['YouTube','Y','#ea4335','https://youtube.com'],['Википедия','W','#4285f4','https://ru.wikipedia.org'],['GitHub','G','#34a853','https://github.com'],['Карты','К','#fbbc05','https://www.bing.com/maps'],['Telegram','T','#4285f4','https://web.telegram.org']].map(t=>`<a class="tile" href="${t[3]}"><span style="color:${t[2]}">${t[1]}</span>${t[0]}</a>`).join('');
const tips=['Совет: нажми на стрелку вниз, чтобы выбрать подсказку.','Я не вижу глаз, зато вижу все результаты 😉','Можно ввести адрес сайта — открою сразу.','Результаты приходят из Bing, а выглядят по-моему.'];let i=0;
$('#m2').addEventListener('poke',()=>openChat());
$('#m1').addEventListener('poke',()=>{$('#hb').textContent='Привет-привет! Что будем искать?'});
