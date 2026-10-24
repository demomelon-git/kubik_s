// Android: нет подмены новой вкладки — адрес https://127.0.0.1/ открывает Кубика
const page=browser.runtime.getURL('newtab.html');
browser.webRequest.onBeforeRequest.addListener(()=>({redirectUrl:page}),{urls:['https://127.0.0.1/*','http://127.0.0.1/*'],types:['main_frame']},['blocking']);
// Google не пускает свои страницы во фреймы — снимаем эти заголовки только для нашего скрытого фрейма
browser.webRequest.onHeadersReceived.addListener(d=>({responseHeaders:d.responseHeaders.filter(h=>{const n=h.name.toLowerCase();return n!=='x-frame-options'&&n!=='content-security-policy'&&n!=='content-security-policy-report-only'})}),
 {urls:['https://www.google.com/*','https://consent.google.com/*'],types:['sub_frame']},['blocking','responseHeaders']);
