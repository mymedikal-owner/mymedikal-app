



(function () {
  'use strict';
  var A = function () { return window.MM_AYAR || {}; };

  var SADE = {
    bulunamadi: 'Bu bölümün verisi henüz hazır değil',
    bicim: 'Bu bölümün verisi henüz hazır değil',
    ag: 'Bağlantı kurulamadı, biraz sonra yenileyin',
    giris_gerekli: 'Bu bölümü görme yetkiniz yok',
    ayar_bekleniyor: 'Bu bölüm henüz kullanıma açılmadı'
  };
  
  function hata(kod, mesaj) {
    var e = new Error(SADE[kod] || 'Bu bölümün verisi şu an alınamıyor'); e.kod = kod; e.ayrinti = mesaj;
    try { console.warn('[veri]', kod, mesaj); } catch (x) {}
    return e;
  }

  

  var DEMO = false;
  function demoIso(ms) {
    var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
    return p.year + '-' + p.month + '-' + p.day + 'T' + p.hour + ':' + p.minute + ':' + p.second + '+03:00';
  }
  var DEMO_ZAMAN = ['asof', 'uretim', 'uretim_zamani', 'zaman', 'sap_veri_zamani', 'sap_senk', 'guncellendi', 'veri_tarihi', 'uretildi', 'portal_okuma_zamani', 'veri_zamani'];
  var DEMO_ISARET = '2026-01-15T10:00:00+03:00';   
  function demoTazele(v) {   
    if (!v || typeof v !== 'object' || Array.isArray(v)) return v;
    var simdi = demoIso(Date.now() - 120000);
    DEMO_ZAMAN.forEach(function (k) { if (typeof v[k] === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v[k])) v[k] = simdi; });
    if (typeof v.bugun === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.bugun)) v.bugun = simdi.slice(0, 10);
    if (typeof v.html === 'string') v.html = v.html.split(DEMO_ISARET).join(simdi);
    return v;
  }
  var demoDizinSozu = null;
  function demoDizin() {
    if (!demoDizinSozu) demoDizinSozu = fetch('demo/dizin.json', { cache: 'no-cache', credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : { dosyalar: [] }; }).catch(function () { return { dosyalar: [] }; });
    return demoDizinSozu;
  }
  function demoTemizle() {   
    try { localStorage.removeItem('mm-okunan'); localStorage.removeItem('mm_siparis_son_aramalar'); Object.keys(localStorage).forEach(function (k) { if (k.indexOf('mm-dmo-fiyat-') === 0) localStorage.removeItem(k); }); } catch (e) {   }
    try { sessionStorage.clear(); } catch (e) {   }
  }

  function modAl() {
    if (DEMO) return 'yerel';   
    
    if (A().mod === 'graph') return 'graph';
    var q = new URLSearchParams(location.search).get('mod');
    return (q === 'graph' || q === 'yerel') ? q : (A().mod || 'yerel');
  }

  function istekSiniri() { return Number(A().istekSiniriMs) > 0 ? Number(A().istekSiniriMs) : 12000; }
  function toplamSinir() { return Number(A().okuSiniriMs) > 0 ? Number(A().okuSiniriMs) : 18000; }
  function eskiNotu(zaman) {   
    if (typeof document === 'undefined' || !document.body) return;
    var n = document.getElementById('eski-veri-notu');
    if (!zaman) { if (n) n.remove(); return; }
    if (!n) { n = document.createElement('div'); n.id = 'eski-veri-notu'; n.setAttribute('role', 'status'); n.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:99998;padding:10px 14px;font:inherit;font-size:14px;border-radius:12px;background:#334155;color:#fff;text-align:center;'; document.body.appendChild(n); }
    var p = function (x) { return (x < 10 ? '0' : '') + x; };
    n.textContent = 'Son güncelleme ' + p(zaman.getHours()) + ':' + p(zaman.getMinutes()) + ' · bağlantı yenileniyor';
  }
  var SON_IYI = {};   

  async function jsonGetir(url, secenek) {
    var r, kt = null, ac = (typeof AbortController === 'function') ? new AbortController() : null;
    secenek = Object.assign({}, secenek || {});
    if (ac && !secenek.signal) { secenek.signal = ac.signal; kt = setTimeout(function () { ac.abort(); }, istekSiniri()); }   
    try { r = await fetch(url, secenek); } catch (e) { throw hata('ag', (e && e.name === 'AbortError') ? 'İstek zaman aşımına uğradı, tekrar deneyin' : 'Bağlantı yok, tekrar deneyin'); }
    finally { if (kt) clearTimeout(kt); }
    if (r.status === 404) throw hata('bulunamadi', 'Veri şu an yok');
    if (r.status === 401 || r.status === 403) { var eh = hata('giris_gerekli', 'Yetki yok (' + r.status + ')'); eh.http = r.status; throw eh; }   
    if (!r.ok) throw hata('ag', 'Sunucu cevabı ' + r.status);
    try { return await r.json(); } catch (e) { throw hata('bicim', 'Veri okunamadı'); }
  }

  async function yerelOku(modul, dosya) {
    if (DEMO) {   
      var dz = await demoDizin();
      if ((dz.dosyalar || []).indexOf(modul + '/' + dosya) < 0) throw hata('bulunamadi', 'Veri şu an yok');
      return demoTazele(await jsonGetir('demo/' + modul + '/' + dosya + '.json', { cache: 'no-cache', credentials: 'omit' }));
    }
    return jsonGetir('ornek/' + modul + '/' + dosya + '.json', { cache: 'no-cache' });   
  }

  async function graphOku(modul, dosya, graphModul) {
    var a = A();
    if (!a.clientId || !a.tenantId) throw hata('ayar_bekleniyor', 'Giriş henüz açık değil');
    if (typeof MMVeri.tokenSaglayici !== 'function') throw hata('giris_gerekli', 'Giriş henüz açık değil');
    var token = await MMVeri.tokenSaglayici();
    if (!token) {
      if (MMVeri.tokenDurumu === 'kimlik') throw hata('ag', 'Oturum yenilenemedi (kimlik)');   
      if (MMVeri.tokenDurumu === 'gecici') throw hata('ag', 'Oturum yenilenemedi (bağlantı), tekrar deneyin');   
      throw hata('giris_gerekli', 'Giriş yapın');
    }
    if (!a.driveId) throw hata('ayar_bekleniyor', 'Giriş henüz açık değil');
    var yol = [a.onedriveKok, graphModul || modul, dosya + '.json'].filter(Boolean).map(encodeURIComponent).join('/');   
    
    var graphUrl = 'https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(a.driveId) + '/root:/' + yol, bilgi;
    try {
      bilgi = await jsonGetir(graphUrl, { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });   
    } catch (e1) {
      if (!e1 || e1.kod !== 'giris_gerekli' || e1.http !== 401) throw e1;   
      var token2 = await MMVeri.tokenSaglayici(true);   
      if (!token2) throw e1;
      bilgi = await jsonGetir(graphUrl, { headers: { Authorization: 'Bearer ' + token2 }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
    }
    var indir = bilgi && bilgi['@microsoft.graph.downloadUrl'];
    if (!indir) throw hata('bicim', 'İndirme adresi alınamadı');
    
    var r, ac2 = (typeof AbortController === 'function') ? new AbortController() : null, kt2 = ac2 ? setTimeout(function () { ac2.abort(); }, istekSiniri()) : null;
    try { r = await fetch(indir, { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer', signal: ac2 ? ac2.signal : undefined }); } catch (e) { if (kt2) clearTimeout(kt2); throw hata('ag', 'Ağ hatası (veri indirme)'); }
    try {
      if (!r.ok) throw hata('ag', 'Sunucu cevabı ' + r.status);
      try { return await r.json(); } catch (e) { throw hata('bicim', 'JSON okunamadı'); }
    } finally { if (kt2) clearTimeout(kt2); }
  }

  
  
  
  function ozelErisim(modul) {
    var liste = (A().ozelErisim || {})[modul];
    if (!liste) return true;                       
    if (modAl() !== 'graph') return true;          
    var gruplar = A().girisGruplar;
    if (!Array.isArray(gruplar) || !gruplar.length || !liste.length) return false;   
    return liste.some(function (g) { g = String(g).trim().toLowerCase(); return !!g && gruplar.indexOf(g) >= 0; });   
  }

  
  
  function sahaKip() {
    if (DEMO) return false;
    if (modAl() === 'graph') return ozelErisim('saha') && !ozelErisim('siparisler-yonetim');
    try { return new URLSearchParams(location.search).get('saha') === '1'; } catch (e) { return false; }
  }

  
  
  function bolumGorur(modul, rol) {
    var ozel = (A().ozelErisim || {})[modul];
    if (ozel && modAl() === 'graph') return ozelErisim(modul);
    var r = (A().roller || {})[modul];
    return !r || r.indexOf(rol) >= 0;
  }

   
  async function gorselUrl(klasor, ad) {
    if (DEMO) throw hata('bulunamadi', 'Demo kipinde görsel yok');
    if (kisitli() || !ozelErisim(klasor)) throw hata('giris_gerekli', 'Bu görsel için erişiminiz yok');   
    if (modAl() !== 'graph') return 'ornek/' + encodeURIComponent(klasor) + '/' + encodeURIComponent(ad);
    var a = A();
    if (!a.driveId || typeof MMVeri.tokenSaglayici !== 'function') throw hata('giris_gerekli', 'Microsoft girişi yapılmadı');
    var token = await MMVeri.tokenSaglayici();
    if (!token) throw hata('giris_gerekli', 'Microsoft girişi yapılmadı');
    var yol = [a.onedriveKok, klasor, ad].filter(Boolean).map(encodeURIComponent).join('/');
    var bilgi = await jsonGetir('https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(a.driveId) + '/root:/' + yol,
      { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
    var indir = bilgi && bilgi['@microsoft.graph.downloadUrl'];
    if (!indir) throw hata('bicim', 'İndirme adresi alınamadı');
    return indir;
  }

   
  async function gorselBlob(klasor, ad) {
    var u = await gorselUrl(klasor, ad);
    var r;
    try { r = await fetch(u, { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' }); } catch (e) { throw hata('ag', 'Ağ hatası (görsel indirme)'); }
    if (!r.ok) throw hata('ag', 'Sunucu cevabı ' + r.status);
    var b = await r.blob();
    if (!b || !/^image\//i.test(b.type || '')) throw hata('bicim', 'Bu belge türü uygulamada gösterilemiyor');
    return b;
  }

  



  function firmaSlug(s) { return String(s || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 40); }
  function nakliyeci() {
    if (DEMO) return null;
    var a = A(), tanim = a.nakliyeciGruplar || {};
    if (modAl() === 'graph') {   
      var g = a.girisGruplar; if (!Array.isArray(g) || !g.length) return null;
      var kucuk = {}; Object.keys(tanim).forEach(function (k) { kucuk[String(k).trim().toLowerCase()] = tanim[k]; });
      for (var i = 0; i < g.length; i++) { var t = kucuk[g[i]]; if (t && firmaSlug(t.firma)) return { firma: firmaSlug(t.firma), ad: String(t.ad || t.firma) }; }
      return null;
    }
    var q = new URLSearchParams(location.search).get('nakliyeci');   
    if (!q) { try { q = localStorage.getItem('mm_nakliyeci_onizleme'); } catch (e) { q = null; } }
    return q && firmaSlug(q) ? { firma: firmaSlug(q), ad: firmaSlug(q).replace(/-/g, ' ') } : null;
  }

  
  function misafirYetkisiz() { return modAl() === 'graph' && !!A().girisMisafir && !nakliyeci(); }
  function kisitli() { return !!nakliyeci() || misafirYetkisiz(); }
  var IDB_AD ='mm-nakliye-yukle', bellekIs = {};
  function idbAc() {
    return new Promise(function (coz, red) {
      if (!window.indexedDB) { red(new Error('idb yok')); return; }
      var r = indexedDB.open(IDB_AD, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('is', { keyPath: 'id' }); };
      r.onsuccess = function () { coz(r.result); };
      r.onerror = function () { red(r.error || new Error('idb')); };
    });
  }
  async function isIslem(tur, ob) {   
    var db;
    try { db = await idbAc(); } catch (e) {   
      if (tur === 'put') bellekIs[ob.id] = ob; else if (tur === 'sil') delete bellekIs[ob]; else return Object.keys(bellekIs).map(function (k) { return bellekIs[k]; });
      return ob;
    }
    return new Promise(function (coz, red) {
      var tx = db.transaction('is', tur === 'tum' ? 'readonly' : 'readwrite'), s = tx.objectStore('is'), r;
      if (tur === 'put') r = s.put(ob); else if (tur === 'sil') r = s.delete(ob); else r = s.getAll();
      tx.oncomplete = function () { db.close(); coz(tur === 'tum' ? r.result : ob); };
      tx.onerror = tx.onabort = function () { db.close(); red(tx.error || new Error('idb')); };
    });
  }
  function rastgeleHex(n) { var u = new Uint8Array(n); (window.crypto || window.msCrypto).getRandomValues(u); return Array.prototype.map.call(u, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function trTarih(d) {
    var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
      .formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
    return p.year + p.month + p.day + '-' + p.hour + p.minute + p.second;
  }
  function turBul(u8) {   
    if (u8.length > 4 && u8[0] === 0xFF && u8[1] === 0xD8 && u8[2] === 0xFF) return { tur: 'image/jpeg', uz: 'jpg' };
    if (u8.length > 8 && u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4E && u8[3] === 0x47) return { tur: 'image/png', uz: 'png' };
    if (u8.length > 5 && u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46) return { tur: 'application/pdf', uz: 'pdf' };
    return null;
  }
  var AZAMI_DOSYA = 6, AZAMI_BAYT = 15 * 1024 * 1024, KUCULT_ESIK = 6 * 1024 * 1024;
  async function kucult(blob) {   
    try {
      var bmp = await createImageBitmap(blob), olcek = Math.min(1, 3000 / Math.max(bmp.width, bmp.height));
      var c = document.createElement('canvas'); c.width = Math.round(bmp.width * olcek); c.height = Math.round(bmp.height * olcek);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      var k = await new Promise(function (ok) { c.toBlob(ok, 'image/jpeg', 0.9); });
      return k && k.size < blob.size ? k : blob;
    } catch (e) { return blob; }
  }
  async function shaHex(buf) {
    if (!(window.crypto && crypto.subtle)) throw hata('ag', 'Güvenli bağlam yok');
    var d = new Uint8Array(await crypto.subtle.digest('SHA-256', buf)), s = '';
    for (var i = 0; i < d.length; i++) s += (d[i] < 16 ? '0' : '') + d[i].toString(16);
    return s;
  }
  function yuklemeAcik() {
    var a = A(), nk = nakliyeci();
    if (!nk) return { acik: false, neden: 'yetki' };
    if (modAl() !== 'graph') return { acik: true, neden: '' };   
    if (!String(a.yuklemeDriveId || '').trim()) return { acik: false, neden: 'kapali' };   
    return { acik: true, neden: '' };
  }
  function bekleMs(ms) { return new Promise(function (c) { setTimeout(c, ms); }); }

   
  
  async function graphKoy(yol, tur, govde) {
    var a = A(), nk = nakliyeci(), hedef = String(a.yuklemeDriveId || '').trim();
    if (!nk || !hedef || modAl() !== 'graph') throw hata('ayar_bekleniyor', 'Yükleme kapalı');
    if (yol.indexOf(nk.firma + '/gelen/') !== 0 || yol.indexOf('..') >= 0) throw hata('giris_gerekli', 'Hedef klasör dışı');
    if (typeof MMVeri.tokenSaglayici !== 'function') throw hata('giris_gerekli', 'Giriş yok');
    var token = await MMVeri.tokenSaglayici();
    if (!token) throw hata('giris_gerekli', 'Giriş yenilenmeli');
    var adres = 'https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(hedef) + '/root:/' + yol.split('/').map(encodeURIComponent).join('/') + ':/content?@microsoft.graph.conflictBehavior=rename';
    var ham = window.CapacitorWebFetch || window.fetch, r;   
    try { r = await ham.call(window, adres, { method: 'PUT', headers: { Authorization: 'Bearer ' + token, 'Content-Type': tur }, body: govde, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' }); }
    catch (e) { throw hata('ag', 'Bağlantı yok'); }
    if (r.status === 401 || r.status === 403) throw hata('giris_gerekli', 'Yazma yetkisi yok (' + r.status + ')');
    if (r.status === 429 || r.status >= 500) throw hata('ag', 'Sunucu meşgul (' + r.status + ')');
    if (!r.ok) throw hata('bicim', 'Reddedildi (' + r.status + ')');
  }
  
  async function graphKoyKalite(yol, tur, govde) {
    var hedef = String(A().yuklemeDriveId || '').trim();
    if (!hedef || modAl() !== 'graph') throw hata('ayar_bekleniyor', 'Yükleme kapalı');
    if (yol.indexOf('kalite-problem/') !== 0 || yol.indexOf('..') >= 0) throw hata('giris_gerekli', 'Hedef klasör dışı');
    if (typeof MMVeri.tokenSaglayici !== 'function') throw hata('giris_gerekli', 'Giriş yok');
    var token = await MMVeri.tokenSaglayici();
    if (!token) throw hata('giris_gerekli', 'Giriş yenilenmeli');
    var adres = 'https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(hedef) + '/root:/' + yol.split('/').map(encodeURIComponent).join('/') + ':/content?@microsoft.graph.conflictBehavior=rename';
    var ham = window.CapacitorWebFetch || window.fetch, r;
    try { r = await ham.call(window, adres, { method: 'PUT', headers: { Authorization: 'Bearer ' + token, 'Content-Type': tur }, body: govde, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' }); }
    catch (e) { throw hata('ag', 'Bağlantı yok'); }
    if (r.status === 401 || r.status === 403) throw hata('giris_gerekli', 'Yazma yetkisi yok (' + r.status + ')');
    if (r.status === 429 || r.status >= 500) throw hata('ag', 'Sunucu meşgul (' + r.status + ')');
    if (!r.ok) throw hata('bicim', 'Reddedildi (' + r.status + ')');
  }
  
  
  async function cihazBelirteciYaz(upnOzet, govde, hedefSurucu) {
    if (DEMO) return 'ayar';
    var hedef = String(hedefSurucu || '').trim(), ozet = String(upnOzet || '');
    if (!hedef || !/^[0-9a-f]{16}$/.test(ozet)) return 'ayar';
    var yol = 'bildirim/cihazlar/' + ozet + '.json';
    if (yol.indexOf('bildirim/cihazlar/') !== 0 || yol.indexOf('..') >= 0) return 'ayar';
    if (typeof MMVeri.tokenSaglayici !== 'function') return 'ayar';
    var token = await MMVeri.tokenSaglayici();
    if (!token) return 'giris';
    var adres = 'https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(hedef) + '/root:/' + yol.split('/').map(encodeURIComponent).join('/') + ':/content?@microsoft.graph.conflictBehavior=replace';
    var ham = window.CapacitorWebFetch || window.fetch, r;
    try { r = await ham.call(window, adres, { method: 'PUT', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: govde, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' }); }
    catch (e) { return 'ag'; }
    if (r.ok) return 'tamam';
    return (r.status === 401 || r.status === 403) ? 'yetki' : 'hata';
  }
   

   
  
  function sohbetOid() { var o = String(A().girisOid || '').trim().toLowerCase(); return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(o) ? o : ''; }
  function sohbetAcik() {
    if (DEMO) return { acik: false, neden: 'kapali' };
    if (!String(A().sohbetDriveId || '').trim()) return { acik: false, neden: 'kapali' };
    if (modAl() !== 'graph') return { acik: false, neden: 'kapali' };
    if (!sohbetOid()) return { acik: false, neden: 'giris' };
    return { acik: true, neden: '' };
  }
  var SOHBET_KLASORLERI = ['dmo', 'dmo-fiyat-gor', 'dmo-maliyet', 'eldiven', 'fabrika', 'finans', 'ihale', 'isg', 'kalite', 'muhasebe', 'nakliye', 'saha', 'sikayet', 'siparisler', 'siparisler-yonetim', 'sterilizasyon', 'stok'];
  
  var nabizOnbellek = { t: 0, acik: false };
  async function sohbetKapi(zorla) {
    var ac = sohbetAcik();
    if (!ac.acik) return ac;
    if (zorla !== true && Date.now() - nabizOnbellek.t < 60000) return nabizOnbellek.acik ? { acik: true, neden: '' } : { acik: false, neden: 'nabiz' };
    var acik = false, hedef = String(A().sohbetDriveId || '').trim();
    try {
      var token = await sohbetJetonu(), yol = sohbetOid() + '/nabiz.json';
      var bilgi = await jsonGetir('https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(hedef) + '/root:/' + yol.split('/').map(encodeURIComponent).join('/'), { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
      var indir = bilgi && bilgi['@microsoft.graph.downloadUrl'];
      if (indir) {
        var r = await fetch(indir, { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
        if (r.ok) {
          var j = await r.json(), z = Date.parse(j && j.zaman);
          if (isFinite(z)) { var fark = Date.now() - z; acik = fark <= 15 * 60000 && fark >= -5 * 60000; }
        }
      }
    } catch (e) { acik = false; }
    nabizOnbellek = { t: Date.now(), acik: acik };
    return acik ? { acik: true, neden: '' } : { acik: false, neden: 'nabiz' };
  }
  async function sohbetJetonu() {
    if (typeof MMVeri.tokenSaglayici !== 'function') throw hata('giris_gerekli', 'Giriş yok');
    var t = await MMVeri.tokenSaglayici();
    if (!t) throw hata('giris_gerekli', 'Giriş yenilenmeli');
    return t;
  }
  
  async function sohbetAnahtarlari() {
    var a = A(), sonuc = {};
    if (!a.driveId || modAl() !== 'graph') return sonuc;
    var token = await sohbetJetonu();
    
    var adaylar = SOHBET_KLASORLERI.filter(function (k) { return ozelErisim(k); });
    await Promise.all(adaylar.map(async function (k) {
      try {
        var yol = [a.onedriveKok, k, '_sohbet-anahtar.txt'].filter(Boolean).map(encodeURIComponent).join('/');
        var bilgi = await jsonGetir('https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(a.driveId) + '/root:/' + yol, { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
        var indir = bilgi && bilgi['@microsoft.graph.downloadUrl'];
        if (!indir) return;
        var r = await fetch(indir, { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
        if (!r.ok) return;
        var m = String(await r.text()).trim();
        if (/^[0-9a-f]{16,64}$/.test(m)) sonuc[k] = m;
      } catch (e) {   }
    }));
    return sonuc;
  }
  function sekizHex() { var b = new Uint8Array(4); (window.crypto || {}).getRandomValues(b); var s = ''; for (var i = 0; i < 4; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16); return s; }
  
  async function sohbetSor(soru) {
    var hedef = String(A().sohbetDriveId || '').trim(), ac = await sohbetKapi();
    if (!ac.acik) throw hata('ayar_bekleniyor', 'Sohbet şu an kapalı');
    soru = String(soru || '').trim().slice(0, 1000);
    if (!soru) throw hata('bicim', 'Soru boş');
    var token = await sohbetJetonu(), anahtarlar = await sohbetAnahtarlari();
    var id = sekizHex(), d = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
    var zaman = d.getUTCFullYear() + p(d.getUTCMonth() + 1) + p(d.getUTCDate()) + 'T' + p(d.getUTCHours()) + p(d.getUTCMinutes()) + p(d.getUTCSeconds());
    var yol = sohbetOid() + '/soru-' + zaman + '-' + id + '.json';
    var govde = JSON.stringify({ id: id, zaman: d.toISOString(), soru: soru, anahtarlar: anahtarlar, surum: 1 });
    var adres = 'https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(hedef) + '/root:/' + yol.split('/').map(encodeURIComponent).join('/') + ':/content?@microsoft.graph.conflictBehavior=fail';
    var ham = window.CapacitorWebFetch || window.fetch, r;
    try { r = await ham.call(window, adres, { method: 'PUT', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: govde, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' }); }
    catch (e) { throw hata('ag', 'Bağlantı yok'); }
    if (r.status === 401 || r.status === 403) throw hata('giris_gerekli', 'Yazma yetkisi yok (' + r.status + ')');
    if (r.status === 429 || r.status >= 500) throw hata('ag', 'Sunucu meşgul (' + r.status + ')');
    if (!r.ok) throw hata('bicim', 'Reddedildi (' + r.status + ')');
    return { id: id };
  }
  
  async function sohbetCevap(id) {
    var ac = sohbetAcik(), hedef = String(A().sohbetDriveId || '').trim();
    if (!ac.acik || !/^[0-9a-f]{8}$/.test(String(id))) return null;
    var token = await sohbetJetonu(), yol = sohbetOid() + '/cevap-' + id + '.json', bilgi;
    try { bilgi = await jsonGetir('https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(hedef) + '/root:/' + yol.split('/').map(encodeURIComponent).join('/'), { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' }); }
    catch (e) { if (e && e.kod === 'bulunamadi') return null; throw e; }
    var indir = bilgi && bilgi['@microsoft.graph.downloadUrl'];
    if (!indir) return null;
    var r = await fetch(indir, { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (!r.ok) return null;
    try { var j = await r.json(); return (j && typeof j.cevap === 'string') ? { cevap: j.cevap, sonuc: String(j.sonuc || ''), klasorler: Array.isArray(j.klasorler) ? j.klasorler.map(String) : [] } : null; } catch (e) { return null; }
  }
   

  var isleniyor = false;
  async function isGonder(is) {
    var nk = nakliyeci();
    if (!nk || nk.firma !== is.firma) throw hata('giris_gerekli', 'Firma uyuşmuyor');
    var yerel = modAl() !== 'graph';
    for (var i = 0; i < is.dosyalar.length; i++) {
      var d = is.dosyalar[i]; if (d.yuklendi) continue;
      if (yerel) await bekleMs(350); else await graphKoy(is.firma + '/gelen/' + d.ad, d.tur, d.veri);
      d.yuklendi = true; await isIslem('put', is);   
    }
    if (!is.bildirimYuklendi) {
      var bildirim = { surum: 1, id: is.id, firma: is.firma, kim: is.kim, irsaliye: is.irsaliye, not: is.not, zaman: is.zaman,
        dosyalar: is.dosyalar.map(function (d) { return { ad: d.ad, tur: d.tur, boyut: d.boyut, sha256: d.sha }; }) };
      if (yerel) await bekleMs(150); else await graphKoy(is.firma + '/gelen/' + is.id + '.json', 'application/json', new Blob([JSON.stringify(bildirim)], { type: 'application/json' }));
      is.bildirimYuklendi = true;
    }
    is.durum = 'gonderildi'; is.hata = ''; is.dosyalar.forEach(function (d) { d.veri = null; }); is.gonderildi = new Date().toISOString();
    await isIslem('put', is);
  }
  async function yuklemeIsle() {   
    if (isleniyor) return;
    var ak = yuklemeAcik(); if (!ak.acik) return;
    isleniyor = true;
    try {
      var liste = (await isIslem('tum')).filter(function (x) { return x.tur !== 'kalite' && x.durum !== 'gonderildi' && x.durum !== 'hata' && x.kim === (A().girisUpn || ''); });
      for (var i = 0; i < liste.length; i++) {
        var is = liste[i]; is.durum = 'gonderiliyor'; await isIslem('put', is);
        try { await isGonder(is); }
        catch (e) {
          is.durum = (e && e.kod === 'bicim') ? 'hata' : 'kuyrukta'; is.hata = (e && e.kod) || 'ag'; await isIslem('put', is);
          if (is.durum === 'kuyrukta') break;   
        }
      }
    } finally { isleniyor = false; }
  }
  async function yukle(girdi) {
    var ak = yuklemeAcik();
    if (!ak.acik) throw hata(ak.neden === 'yetki' ? 'giris_gerekli' : 'ayar_bekleniyor', 'Yükleme kapalı');
    var nk = nakliyeci(), irs = String((girdi && girdi.irsaliye) || '').trim().replace(/\s+/g, ' ');
    if (irs.length < 4 || irs.length > 30 || !/^[A-Za-z0-9\-\/ ]+$/.test(irs)) { var e1 = new Error('İrsaliye / teslimat numarasını yazın (en az 4 karakter)'); e1.kod = 'girdi'; throw e1; }
    var dosyalar = Array.prototype.slice.call((girdi && girdi.dosyalar) || []);
    if (!dosyalar.length || dosyalar.length > AZAMI_DOSYA) { var e2 = new Error('1 ile ' + AZAMI_DOSYA + ' arasında fotoğraf ya da PDF seçin'); e2.kod = 'girdi'; throw e2; }
    var simdi = new Date(), tarih = trTarih(simdi), irsAd = (irs.replace(/[^A-Za-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'no') + '-' + rastgeleHex(3);   
    var is = { id: tarih + '-' + irsAd, firma: nk.firma, kim: A().girisUpn || '', irsaliye: irs, not: String((girdi && girdi.not) || '').trim().slice(0, 500), zaman: simdi.toISOString(), durum: 'kuyrukta', hata: '', bildirimYuklendi: false, dosyalar: [] };
    for (var i = 0; i < dosyalar.length; i++) {
      var f = dosyalar[i], buf = await f.arrayBuffer(), t = turBul(new Uint8Array(buf));
      if (!t) { var e3 = new Error('Yalnız fotoğraf (JPEG, PNG) ve PDF yüklenebilir'); e3.kod = 'girdi'; throw e3; }
      if (buf.byteLength > KUCULT_ESIK && t.tur !== 'application/pdf') { var k = await kucult(new Blob([buf], { type: t.tur })); if (k.size < buf.byteLength) { buf = await k.arrayBuffer(); t = turBul(new Uint8Array(buf)) || t; } }
      if (buf.byteLength > AZAMI_BAYT) { var e4 = new Error('Dosya çok büyük (en çok 15 MB)'); e4.kod = 'girdi'; throw e4; }
      is.dosyalar.push({ ad: tarih + '-' + irsAd + '-' + (i + 1) + '.' + t.uz, tur: t.tur, boyut: buf.byteLength, sha: await shaHex(buf), veri: buf, yuklendi: false });
    }
    await isIslem('put', is);
    yuklemeIsle();   
    return { id: is.id };
  }
  async function yuklemeKuyruk() {
    var kim = A().girisUpn || '', nk = nakliyeci(); if (!nk) return [];
    var l = (await isIslem('tum')).filter(function (x) { return x.kim === kim && x.firma === nk.firma; });
    l.sort(function (a, b) { return a.zaman < b.zaman ? 1 : -1; });
    return l.slice(0, 50).map(function (x) { return { id: x.id, irsaliye: x.irsaliye, zaman: x.zaman, durum: x.durum, hata: x.hata, adet: x.dosyalar.length }; });
  }
   
  async function yuklemeDurum() {
    var nk = nakliyeci(), a = A(); if (!nk) return {};
    try {
      var v;
      if (modAl() !== 'graph') v = await jsonGetir('ornek/nakliye-yukle/durum.json', { cache: 'no-cache' });
      else {
        var hedef = String(a.yuklemeDriveId || '').trim(); if (!hedef || typeof MMVeri.tokenSaglayici !== 'function') return {};
        var token = await MMVeri.tokenSaglayici(); if (!token) return {};
        var bilgi = await jsonGetir('https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(hedef) + '/root:/' + encodeURIComponent(nk.firma) + '/durum.json', { headers: { Authorization: 'Bearer ' + token }, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
        var indir = bilgi && bilgi['@microsoft.graph.downloadUrl']; if (!indir) return {};
        v = await jsonGetir(indir, { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
      }
      var o = {}; ((v && v.yuklemeler) || []).forEach(function (x) { if (x && x.id) { o[String(x.id)] = String(x.durum || ''); if (x.neden) o['neden:' + String(x.id)] = String(x.neden).slice(0, 200); } });   
      return o;
    } catch (e) { return {}; }
  }

  


  var KALITE_AZAMI = 6;
  function kaliteGruplar() {   
    var k = A().kaliteYukleGrup, d = Array.isArray(k) ? k : [k];
    return d.map(function (x) { return String(x || '').trim().toLowerCase(); }).filter(Boolean);
  }
  function kaliteUye() { var gr = A().girisGruplar; return Array.isArray(gr) && kaliteGruplar().some(function (g) { return gr.indexOf(g) >= 0; }); }
  function kaliteAcik() {
    if (DEMO) return { acik: false, neden: 'kapali' };
    if (modAl() !== 'graph') return { acik: true, neden: '' };   
    if (!kaliteGruplar().length) return { acik: false, neden: 'grup-yok' };
    if (!kaliteUye()) return { acik: false, neden: 'yetki' };
    if (!String(A().yuklemeDriveId || '').trim()) return { acik: false, neden: 'kapali' };
    return { acik: true, neden: '' };
  }
  function kaliteGorur(yonetim) {   
    if (modAl() !== 'graph') return true;
    if (!kaliteGruplar().length) return !!yonetim;
    return kaliteUye();
  }
  function trParca(d) {
    var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
    return p;
  }
  function vardiyaAd(saat) { return saat >= 8 && saat < 16 ? 'Gündüz vardiyası' : (saat >= 16 ? 'Akşam vardiyası' : 'Gece vardiyası'); }
  async function kaliteSonrakiNo(gun) {
    var en = 0, on = 'KP-' + gun + '-';
    (await isIslem('tum')).forEach(function (x) { if (x.tur === 'kalite' && x.kayitNo && x.kayitNo.indexOf(on) === 0) en = Math.max(en, parseInt(x.kayitNo.slice(on.length), 10) || 0); });
    if (modAl() === 'graph') {   
      try {
        var token = typeof MMVeri.tokenSaglayici === 'function' ? await MMVeri.tokenSaglayici() : null;
        if (token) {
          var r = await fetch('https://graph.microsoft.com/v1.0/drives/' + encodeURIComponent(String(A().yuklemeDriveId || '').trim()) + '/root:/kalite-problem/' + gun + ':/children?$select=name&$top=200', { headers: { Authorization: 'Bearer ' + token }, credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store' });
          if (r.ok) ((await r.json()).value || []).forEach(function (f) { var m = /^KP-\d{8}-(\d{2,})/.exec(f.name || ''); if (m) en = Math.max(en, parseInt(m[1], 10) || 0); });
        }
      } catch (e) {   }
    }
    return on + (en + 1 < 10 ? '0' : '') + (en + 1);
  }
  async function kaliteGonder(is) {
    var yerel = modAl() !== 'graph', klasor = 'kalite-problem/' + is.gun + '/';
    for (var i = 0; i < is.dosyalar.length; i++) {
      var d = is.dosyalar[i]; if (d.yuklendi) continue;
      if (yerel) await bekleMs(250); else await graphKoyKalite(klasor + d.ad, d.tur, d.veri);
      d.yuklendi = true; await isIslem('put', is);
    }
    if (!is.bildirimYuklendi) {
      var f = is.form, bildirim = { surum: 1, kayit_no: is.kayitNo, id: is.id, zaman: is.zaman, vardiya: is.vardiya, bolum: f.bolum, makine: f.makine, urun: f.urun, lot: f.lot, problem: f.problem, onem: f.onem, aciklama: f.aciklama, kim: is.kim,
        dosyalar: is.dosyalar.map(function (d) { return { ad: d.ad, tur: d.tur, boyut: d.boyut, sha256: d.sha }; }) };
      if (yerel) await bekleMs(120); else await graphKoyKalite(klasor + is.kayitNo + '.json', 'application/json', new Blob([JSON.stringify(bildirim)], { type: 'application/json' }));
      is.bildirimYuklendi = true;
    }
    is.durum = 'gonderildi'; is.hata = ''; is.dosyalar.forEach(function (d) { d.veri = null; }); is.gonderildi = new Date().toISOString();
    await isIslem('put', is);
  }
  var kaliteIsleniyor = false;
  async function kaliteIsle() {
    if (kaliteIsleniyor) return;
    if (!kaliteAcik().acik) return;
    kaliteIsleniyor = true;
    try {
      var liste = (await isIslem('tum')).filter(function (x) { return x.tur === 'kalite' && x.durum !== 'gonderildi' && x.durum !== 'hata' && x.kim === (A().girisUpn || ''); });
      for (var i = 0; i < liste.length; i++) {
        var is = liste[i]; is.durum = 'gonderiliyor'; await isIslem('put', is);
        try { await kaliteGonder(is); }
        catch (e) {
          is.durum = (e && e.kod === 'bicim') ? 'hata' : 'kuyrukta'; is.hata = (e && e.kod) || 'ag'; await isIslem('put', is);
          if (is.durum === 'kuyrukta') break;
        }
      }
    } finally { kaliteIsleniyor = false; }
  }
  async function kaliteKaydet(girdi) {
    var ak = kaliteAcik();
    if (!ak.acik) throw hata(ak.neden === 'kapali' || ak.neden === 'grup-yok' ? 'ayar_bekleniyor' : 'giris_gerekli', 'Yükleme kapalı');
    var f = { bolum: String(girdi.bolum || '').slice(0, 40), makine: String(girdi.makine || '').trim().slice(0, 60), urun: String(girdi.urun || '').trim().slice(0, 80), lot: String(girdi.lot || '').trim().slice(0, 40),
      problem: String(girdi.problem || '').slice(0, 60), onem: String(girdi.onem || '').slice(0, 20), aciklama: String(girdi.aciklama || '').trim().slice(0, 1000) };
    var e0 = null;
    if (!f.bolum) e0 = 'Bölümü seçin'; else if (!f.problem) e0 = 'Problem türünü seçin'; else if (!f.onem) e0 = 'Önem derecesini seçin'; else if (f.aciklama.length < 10) e0 = 'Açıklamayı yazın (en az 10 karakter)';
    var dosyalar = Array.prototype.slice.call(girdi.dosyalar || []);
    if (!e0 && (!dosyalar.length || dosyalar.length > KALITE_AZAMI)) e0 = '1 ile ' + KALITE_AZAMI + ' arasında fotoğraf seçin';
    if (e0) { var e1 = new Error(e0); e1.kod = 'girdi'; throw e1; }
    var simdi = new Date(), p = trParca(simdi), gun = p.year + p.month + p.day, tarih = trTarih(simdi);
    var kayitNo = await kaliteSonrakiNo(gun), kim = A().girisUpn || '';
    var is = { id: kayitNo + '-' + rastgeleHex(3), tur: 'kalite', kayitNo: kayitNo, gun: gun, kim: kim, zaman: simdi.toISOString(), vardiya: vardiyaAd(parseInt(p.hour, 10)), form: f, durum: 'kuyrukta', hata: '', bildirimYuklendi: false, dosyalar: [] };
    for (var i = 0; i < dosyalar.length; i++) {
      var fo = dosyalar[i], buf = await fo.arrayBuffer(), t = turBul(new Uint8Array(buf));
      if (!t || t.tur === 'application/pdf') { var e3 = new Error('Yalnız fotoğraf (JPEG, PNG) yüklenebilir'); e3.kod = 'girdi'; throw e3; }
      if (buf.byteLength > KUCULT_ESIK) { var k = await kucult(new Blob([buf], { type: t.tur })); if (k.size < buf.byteLength) { buf = await k.arrayBuffer(); t = turBul(new Uint8Array(buf)) || t; } }
      if (buf.byteLength > AZAMI_BAYT) { var e4 = new Error('Dosya çok büyük (en çok 15 MB)'); e4.kod = 'girdi'; throw e4; }
      is.dosyalar.push({ ad: kayitNo + '-' + (i + 1) + '-' + tarih.slice(9) + '.' + t.uz, tur: t.tur, boyut: buf.byteLength, sha: await shaHex(buf), veri: buf, yuklendi: false });
    }
    await isIslem('put', is);
    kaliteIsle();
    return { id: is.id, kayitNo: kayitNo };
  }
  async function kaliteKuyruk() {
    var kim = A().girisUpn || '';
    var l = (await isIslem('tum')).filter(function (x) { return x.tur === 'kalite' && x.kim === kim; });
    l.sort(function (a, b) { return a.zaman < b.zaman ? 1 : -1; });
    return l.slice(0, 30).map(function (x) { return { id: x.id, kayitNo: x.kayitNo, zaman: x.zaman, durum: x.durum, hata: x.hata, adet: x.dosyalar.length, bolum: x.form.bolum, problem: x.form.problem, onem: x.form.onem }; });
  }

  var ORTAK_OKU = {};
  var MMVeri = {
    demo: function () { return DEMO; },
    demoAc: function () { DEMO = true; },
    demoKapat: function () { DEMO = false; demoTemizle(); },
    kaliteAcik: kaliteAcik,
    kaliteGorur: kaliteGorur,
    kaliteKaydet: kaliteKaydet,
    cihazBelirteciYaz: cihazBelirteciYaz,
    kaliteIsle: kaliteIsle,
    kaliteKuyruk: kaliteKuyruk,
    nakliyeci: nakliyeci,
    misafirYetkisiz: misafirYetkisiz,
    kisitli: kisitli,
    yukle: yukle,
    yuklemeAcik: yuklemeAcik,
    sohbetAcik: sohbetAcik,
    sohbetKapi: sohbetKapi,
    sohbetSor: sohbetSor,
    sohbetCevap: sohbetCevap,
    yuklemeIsle: yuklemeIsle,
    yuklemeKuyruk: yuklemeKuyruk,
    yuklemeDurum: yuklemeDurum,
    gorselUrl: gorselUrl,
    gorselBlob: gorselBlob,
    tokenSaglayici: null,
    mod: modAl,
    ozelErisim: ozelErisim,
    sahaKip: sahaKip,
    bolumGorur: bolumGorur,
    

    oku(modul, dosya, graphModul) {
      var anahtar = String(A().girisUpn || '') + '|' + modul + '|' + (graphModul || '') + '|' + dosya, simdi = Date.now(), g = ORTAK_OKU[anahtar];
      if (g && (!g.bitti || (g.ttl && simdi - g.bitti < g.ttl))) return g.p;
      var kayit = { p: null, bitti: 0, ttl: modul === 'fabrika' ? 8000 : 0 };
      kayit.p = MMVeri.okuHam(modul, dosya, graphModul).then(function (s) { kayit.bitti = Date.now(); if (!kayit.ttl) delete ORTAK_OKU[anahtar]; return s; }, function (e) { delete ORTAK_OKU[anahtar]; throw e; });
      ORTAK_OKU[anahtar] = kayit;
      return kayit.p;
    },
    async okuHam(modul, dosya, graphModul) {
      var m = modAl();
      if (kisitli() || !ozelErisim(modul) || (graphModul && !ozelErisim(graphModul))) throw hata('giris_gerekli', 'Bu bölüm için erişiminiz yok');   
      if (m !== 'graph') return { veri: await yerelOku(modul, dosya), kaynak: m, alindi: new Date() };
      var anahtar = String(A().girisUpn || '') + '|' + modul + '|' + (graphModul || '') + '|' + dosya, tz = null;
      try {
        
        var veri = await Promise.race([graphOku(modul, dosya, graphModul), new Promise(function (_, red) { tz = setTimeout(function () { red(hata('ag', 'Okuma zaman aşımına uğradı')); }, toplamSinir()); })]);
        clearTimeout(tz); SON_IYI[anahtar] = { veri: veri, alindi: new Date() }; eskiNotu(null);
        return { veri: veri, kaynak: m, alindi: SON_IYI[anahtar].alindi };
      } catch (e) {
        clearTimeout(tz);
        var iyi = SON_IYI[anahtar];
        if (iyi && e && (e.kod === 'ag' || e.kod === 'giris_gerekli')) { eskiNotu(iyi.alindi); return { veri: iyi.veri, kaynak: m, alindi: iyi.alindi, eski: true }; }   
        if (e && e.kod === 'ag' && /Oturum yenilenemedi \(kimlik\)/.test(String(e.ayrinti || ''))) e.message = 'Oturumunuzun yenilenmesi gerekiyor — alttaki kırmızı “Oturumu yenile” düğmesine dokunun';
        else if (e && e.kod === 'ag' && /zaman aşımı|Oturum yenilenemedi/.test(String(e.ayrinti || ''))) e.message = 'Bağlantı yenileniyor, birkaç saniye sonra yeniden deneyin';
        throw e;
      }
    }
  };
  window.MMVeri = MMVeri;
})();
