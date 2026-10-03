const C='platelog-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
const put=(req,r)=>{if(r.ok||r.type==='opaque'){const x=r.clone();caches.open(C).then(c=>c.put(req,x))}return r};
self.addEventListener('fetch',e=>{
  const q=e.request;if(q.method!=='GET')return;
  if(new URL(q.url).origin===location.origin){
    // own files: use the network when online so updates arrive, cache when offline
    e.respondWith(fetch(q).then(r=>put(q,r)).catch(()=>caches.match(q).then(h=>h||(q.mode==='navigate'?caches.match('index.html'):Response.error()))));
  }else{
    e.respondWith(caches.match(q).then(h=>h||fetch(q).then(r=>put(q,r))));
  }
});
