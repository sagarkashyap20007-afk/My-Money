const V='mcc-v13',FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const fresh=u=>fetch(new Request(u,{cache:'reload'}));
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>fresh(f).then(r=>{if(!r.ok)throw new Error(f);return c.put(f,r)})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith((async()=>{const c=await caches.open(V);
  try{const res=await Promise.race([fetch(new Request(e.request.url,{cache:'no-cache'})),new Promise((_,j)=>setTimeout(j,4000))]);if(res&&res.ok){c.put(e.request,res.clone());return res}}catch(x){}
  return (await c.match(e.request,{ignoreSearch:true}))||(await c.match('index.html'))||Response.error()})())});
