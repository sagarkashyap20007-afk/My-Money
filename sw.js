const V='mcc-v11',FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const fresh=u=>fetch(new Request(u,{cache:'reload'}));
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>fresh(f).then(r=>{if(!r.ok)throw new Error(f);return c.put(f,r)})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{
  const net=fetch(new Request(e.request.url,{cache:'no-cache'})).then(res=>{if(res&&res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp))}return res}).catch(()=>r);
  return r||net.then(x=>x||caches.match('index.html'))}))});
