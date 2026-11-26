

var SURUM = 'mm-v3-tanitim-80-37';   
var KABUK = ['./', 'index.html', 'web-koruma.js', 'tokens.css', 'app.css', 'bilesen.css', 'kabuk.css', 'm-ana.css', 'm-makine.css', 'm-eldiven.css', 'm-siparis.css', 'm-dmo.css', 'm-dmo-nakliyat.css', 'modul-dmo-nakliyat.js','m-takvim.css', 'm-yeni.css', 'm-tanitim.css', 'm-s41.css', 'm-s42.css', 'm-sterilizasyon.css', 'm-uretim-plan.css', 'modul-uretim-plan.js','m-ihale.css', 'm-nakliye-s49.css', 'm-makine-ek.css', 'm-muhasebe-s49.css', 'm-mesaj.css', 'mesaj-istemci.js', 'modul-mesaj.js', 'modul-makine-ek.js', 'modul-sterilizasyon.js', 'modul-ihale.js', 'modul-kalite-yukle.js', 'bildirim.js', 'modul-nakliye-yukle.js', 'm-barkod.css', 'modul-barkod.js', 'vendor/zxing/zxing-library.min.js', 'modul-mali.js', 'modul-stok.js', 'modul-musteri.js', 'modul-sikayet.js', 'giris.css', 'm-uyum.css', 'tarayici-kontrol.js','giris.js', 'vendor/msal-browser.min.js', 'eldiven-harita/harita.html', 'eldiven-harita/harita.js', 'eldiven-harita/echarts-shim.js', 'vendor/OrbitControls.js', 'vendor/echarts-world.js', 'vendor/eldiven-font/font.css', 'dil.js', 'android-uyum.js', 'arama.js', 'grafik.js','modul-yeni.js', 'modul-muhasebe.js', 'ozet.js', 'kabuk-ek.js', 'modul-tanitim.js', 'yukleme-kontrol.js', 'acilis.js', 'app.js', 'veri.js', 'ayar.js', 'modul-fabrika.js', 'pano-kabuk.html', 'pano-kabuk.js', 'pano-en.js','modul-eldiven.js', 'modul-siparis.js', 'modul-dmo.js', 'modul-takvim.js', 'modul-nakliye.js','modul-yonetim.js', 'modul-ana.js', 'manifest.webmanifest', 'icon.svg', 'marka/logo.svg', 'marka/logo-koyu.svg', 'marka/logo-isaret.svg', 'marka/ikon-192.png', 'marka/ikon-512.png'];
var KOK_YOL = new URL('./', self.registration.scope).pathname;
var KABUK_YOL = {};
KABUK.forEach(function (p) { if (p !== './') KABUK_YOL[new URL(p, self.registration.scope).pathname] = 1; });
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SURUM).then(function (c) { return c.addAll(KABUK.map(function (p) { return new Request(p, { cache: 'reload' }); })); })    .then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== SURUM; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('message', function (e) {
  if (e.data === 'temizle') e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;   
  if (/[?&](code|state|error|session_state|client_info)=/.test(u.search)) return;   
  if (/(^|\.)(blob\.core\.windows\.net|webpubsub\.azure\.com|azurewebsites\.net|communication\.azure\.com)$/i.test(u.hostname) || /[?&]sig=/.test(u.search)) return;   
  if (u.pathname.indexOf('/meet/') >= 0) return;                  
  if (u.pathname.indexOf('/demo/') >= 0) return;                 
  if (u.pathname.indexOf('/ornek/') >= 0) return;               
  

  var kokMu = r.mode === 'navigate' && (u.pathname === KOK_YOL || u.pathname === KOK_YOL + 'index.html');   
  var kabukMu = kokMu || KABUK_YOL[u.pathname];
  if (kabukMu) {
    e.respondWith(caches.match(kokMu ? 'index.html' : r, { ignoreSearch: u.pathname.indexOf('/eldiven-harita/') >= 0 }).then(function (m) { return m || agdan(r, u); }));
    return;
  }
  e.respondWith(agdan(r, u));
});
function agdan(r, u) {
  return (
    fetch(r).then(function (cevap) {
      if (!cevap.ok) throw new Error('http ' + cevap.status);   
      var kopya = cevap.clone();
      caches.open(SURUM).then(function (c) { c.put(r, kopya); });
      return cevap;
    }).catch(function () {
      return caches.match(r, { ignoreSearch: u.pathname.indexOf('/eldiven-harita/') >= 0 }).then(function (m) {   
        if (m) return m;
        if (r.mode === 'navigate') return caches.match('index.html');   
        return Response.error();
      });
    })
  );
}
