




(function () {
  'use strict';
  var MAKS_GOVDE = 4000, MAKS_BEKLE_SN = 10, YAZIYOR_MS = 3000, MAKS_DOSYA = 25 * 1024 * 1024;
  var MIME = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mp4', 'audio/webm', 'audio/aac'];
  var TURLER = ['metin', 'kart', 'dosya', 'ses'];
  var OLAYLAR = ['mesaj', 'okundu', 'teslim', 'yaziyor', 'arama', 'sohbet'];
  var ISTEMCI_ID = /^[A-Za-z0-9-]{8,64}$/;
  function yeniIstemciId() {   
    var c = typeof crypto !== 'undefined' ? crypto : null;
    if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    var b = '', i;
    if (c && c.getRandomValues) { var u = new Uint8Array(16); c.getRandomValues(u); for (i = 0; i < 16; i++) b += (u[i] < 16 ? '0' : '') + u[i].toString(16); }
    else for (i = 0; i < 32; i++) b += Math.floor(Math.random() * 16).toString(16);
    return b;
  }
  function harita(v) {   
    if (!v || typeof v !== 'object' || Array.isArray(v)) return undefined;
    var r = {}; Object.keys(v).forEach(function (k) { if (typeof v[k] === 'string' && v[k]) r[k] = v[k]; });
    return r;
  }

  function hata(kod, ek) { var e = new Error(kod); e.kod = kod; if (ek) for (var k in ek) e[k] = ek[k]; return e; }
  function oidGecerli(o) { return typeof o === 'string' && /^[0-9a-fA-F-]{8,40}$/.test(o); }
  function yerelUygulama() { var c = typeof window !== 'undefined' ? window.Capacitor : null; return !!(c && c.isNativePlatform && c.isNativePlatform()); }
  function s(v) { return typeof v === 'string' ? v : (typeof v === 'number' ? String(v) : ''); }
  function adTemizle(ad) { return String(ad || 'dosya').replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 100) || 'dosya'; }

   
  function parcala(metin) {
    var out = [], re = /https:\/\/[^\s<>"']+/g, son = 0, m;
    metin = String(metin || '');
    while ((m = re.exec(metin))) {
      if (m.index > son) out.push({ t: 'metin', v: metin.slice(son, m.index) });
      out.push({ t: 'baglanti', v: m[0] }); son = m.index + m[0].length;
    }
    if (son < metin.length) out.push({ t: 'metin', v: metin.slice(son) });
    return out;
  }
   
  function kartSuz(k) {
    if (!k || typeof k !== 'object') return null;
    if (typeof k.bolum !== 'string' || typeof k.rota !== 'string') return null;
    if (!/^[A-Za-z0-9ÇĞİÖŞÜçğıöşü _-]{1,40}$/.test(k.bolum)) return null;   
    if (!/^#[a-z0-9-]{1,40}$/.test(k.rota)) return null;                     
    return { bolum: k.bolum, rota: k.rota };
  }
  function mesajCevir(m) {
    if (!m || typeof m !== 'object') return null;
    var tur = TURLER.indexOf(m.tur) >= 0 ? m.tur : 'metin';
    var kart = tur === 'kart' ? kartSuz(m.kart) : null;
    if (tur === 'kart' && !kart) tur = 'metin';
    var dosya = null;
    if ((tur === 'dosya' || tur === 'ses') && m.dosya && typeof m.dosya === 'object') {
      dosya = { ad: s(m.dosya.ad), boyut: Number(m.dosya.boyut) || 0, mime: s(m.dosya.mime), blob: s(m.dosya.blob) };
      if (!dosya.blob) dosya = null;
    }
    if ((tur === 'dosya' || tur === 'ses') && !dosya) tur = 'metin';
    return { id: s(m.id), sohbet: s(m.sohbet), gonderen: s(m.gonderen), ts: (typeof m.ts === 'number' || typeof m.ts === 'string') ? m.ts : '', tur: tur, metin: typeof m.metin === 'string' ? m.metin : '', kart: kart, dosya: dosya, istemciId: ISTEMCI_ID.test(s(m.istemciId)) ? s(m.istemciId) : '' };
  }
  function sohbetCevir(c) {
    if (!c || typeof c !== 'object') return null;
    var son = c.son && typeof c.son === 'object' ? { id: s(c.son.id), ts: c.son.ts, gonderen: s(c.son.gonderen), ozet: s(c.son.ozet), metin: typeof c.son.metin === 'string' ? c.son.metin : '', gonderenAd: s(c.son.gonderenAd) } : null;
    var grup = c.tur === 'grup';
    var r = { id: s(c.id), tur: grup ? 'grup' : 'bire', ad: s(c.ad), uyeler: Array.isArray(c.uyeler) ? c.uyeler.filter(function (x) { return typeof x === 'string'; }) : [], son: son, okunmamis: Number(c.okunmamis) || 0 };
    if (grup && Array.isArray(c.yoneticiler)) r.yoneticiler = c.yoneticiler.filter(function (x) { return typeof x === 'string'; });   
    if (grup && typeof c.aciklama === 'string') r.aciklama = c.aciklama;
    var ok = harita(c.okundu), te = harita(c.teslim);
    if (ok) r.okundu = ok;      
    if (te) r.teslim = te;
    if (c.tercih && typeof c.tercih === 'object') { r.tercih = {}; ['arsiv', 'favori', 'sessiz', 'sabit'].forEach(function (k) { if (typeof c.tercih[k] === 'boolean') r.tercih[k] = c.tercih[k]; }); }
    return r;
  }
  function liste(v, f) { return (Array.isArray(v) ? v : []).map(f).filter(Boolean); }

  function durumKodu(d) { return d === 401 ? 'kimlik' : d === 403 ? 'uye' : d === 404 ? 'yok' : d === 400 ? 'gecersiz' : d === 429 ? '429' : d === 503 ? 'mesgul' : 'sunucu'; }

   
  function varsayilanTasiyici(apiUrl) {
    return function (r) {
      var b = Object.assign({ 'Content-Type': 'application/json' }, r.basliklar || {});
      return fetch(apiUrl + r.yol, { method: r.yontem, headers: b, body: r.govde ? JSON.stringify(r.govde) : undefined, cache: 'no-store' }).then(function (res) {
        return res.text().then(function (t) { var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; } return { durum: res.status, retryAfter: res.headers.get('Retry-After'), json: j }; });
      });
    };
  }
   
  function varsayilanBlobTasiyici(r) {
    return fetch(r.url, { method: r.yontem, headers: r.basliklar, body: r.govde, cache: 'no-store' }).then(function (res) { return { durum: res.status }; });
  }
  function varsayilanWs(url, altProtokol) { return new WebSocket(url, altProtokol); }

   
  function fotografTemizle(dosya) {
    if (!dosya || typeof document === 'undefined' || !/^image\/(jpeg|png|heic)$/.test(dosya.mime || dosya.type || '')) return Promise.resolve(dosya);
    return new Promise(function (ok, red) {
      var kaynak = dosya.veri || dosya, url = URL.createObjectURL(kaynak), im = new Image();
      im.onload = function () {
        try {
          var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
          c.getContext('2d').drawImage(im, 0, 0);
          URL.revokeObjectURL(url);
          c.toBlob(function (b) {
            if (!b) return red(hata('foto'));
            var ad = adTemizle(String(dosya.ad || dosya.name || 'foto').replace(/\.[^.]*$/, '')) + '.jpg';
            ok({ ad: ad, boyut: b.size, mime: 'image/jpeg', veri: b });
          }, 'image/jpeg', 0.85);
        } catch (e) { URL.revokeObjectURL(url); red(hata('foto')); }
      };
      im.onerror = function () { URL.revokeObjectURL(url); red(hata('foto')); };
      im.src = url;
    });
  }

   
  function hazirla(o) {
    o = o || {};
    var apiUrl = typeof o.apiUrl === 'string' ? o.apiUrl.trim().replace(/\/+$/, '') : '';
    var kapali = !apiUrl || (typeof window !== 'undefined' && !(yerelUygulama() || window.MM_WEB === true));   
    var tasiyici = o.tasiyici || varsayilanTasiyici(apiUrl);
    var blobTasiyici = o.blobTasiyici || varsayilanBlobTasiyici;
    var bekle = o.bekle || function (sn) { return new Promise(function (ok) { setTimeout(ok, sn * 1000); }); };
    var simdi = o.simdi || Date.now;
    var dinleyici = { mesaj: [], okundu: [], teslim: [], yaziyor: [], arama: [], sohbet: [] };
    var sonYaziyor = {}, teslimYok = false;   

    function cagri(yontem, yol, govde, denendi) {
      if (kapali) return Promise.reject(hata('kapali'));
      if (typeof o.belirtecAl !== 'function') return Promise.reject(hata('belirtec'));
      return Promise.resolve().then(o.belirtecAl).then(function (tok) {
        if (!tok || typeof tok !== 'string') throw hata('belirtec');
        return tok;
      }, function () { throw hata('belirtec'); }).then(function (tok) {
        return Promise.resolve().then(function () { return tasiyici({ yontem: yontem, yol: yol, govde: govde, basliklar: { Authorization: 'Bearer ' + tok } }); }).then(null, function () { throw hata('ag'); });
      }).then(function (r) {
        if (r && r.durum === 429) {
          var sn = Math.max(1, parseInt(r.retryAfter, 10) || 5);
          if (denendi || sn > MAKS_BEKLE_SN) throw hata('429', { bekleSn: sn });   
          return Promise.resolve(bekle(sn)).then(function () { return cagri(yontem, yol, govde, true); });
        }
         
        if (r && r.durum === 503 && !denendi && (yontem === 'GET' || (govde && typeof govde.istemciId === 'string'))) return Promise.resolve(bekle(1)).then(function () { return cagri(yontem, yol, govde, true); });   
        if (!r || r.durum < 200 || r.durum >= 300) throw hata(durumKodu(r && r.durum), { durum: r && r.durum });
        return r.json;
      });
    }
    function sid(x) { return encodeURIComponent(String(x)); }

     
    var ws = null, istenen = false, askida = false, planli = false, denemeSay = 0;
    function yay(olay, veri) { dinleyici[olay].slice().forEach(function (f) { try { f(veri); } catch (e) {   } }); }
    function gelen(ham) {
      var j; try { j = typeof ham === 'string' ? JSON.parse(ham) : ham; } catch (e) { return; }
      if (!j || j.type !== 'message' || j.from !== 'server' || !j.data) return;   
      var d = j.data; if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e2) { return; } }
      if (!d || OLAYLAR.indexOf(d.olay) < 0) return;
      if (d.olay === 'mesaj') { var m = mesajCevir(d.mesaj); if (m) yay('mesaj', m); }
      else if (d.olay === 'okundu') yay('okundu', { sohbet: s(d.sohbet), oid: s(d.oid), sonId: s(d.sonId) });
      else if (d.olay === 'teslim') yay('teslim', { sohbet: s(d.sohbet), oid: s(d.oid), sonId: s(d.sonId) });
      else if (d.olay === 'yaziyor') yay('yaziyor', { sohbet: s(d.sohbet), oid: s(d.oid) });
      else if (d.olay === 'sohbet') yay('sohbet', { sohbet: s(d.sohbet), islem: s(d.islem) });   
      else yay('arama', { sohbet: s(d.sohbet), groupId: s(d.groupId), arayan: s(d.arayan || d.gonderen), video: d.video === true });
    }
    function yenidenDene() {
      if (planli || !istenen || askida) return;
      planli = true; denemeSay++;
      var sn = Math.min(60, Math.pow(2, denemeSay - 1));   
      Promise.resolve(bekle(sn)).then(function () { planli = false; if (istenen && !askida && !ws) ac().then(null, yenidenDene); });
    }
    function ac() {
      if (ws) return Promise.resolve();
      return cagri('POST', '/negotiate').then(function (v) {
        if (!v || typeof v.url !== 'string' || !/^wss:\/\//.test(v.url)) throw hata('gecersiz');
        var w = (o.wsFabrika || varsayilanWs)(v.url, 'json.webpubsub.azure.v1');
        ws = w;
        w.onopen = function () { denemeSay = 0; };
        w.onmessage = function (e) { gelen(e && e.data); };
        w.onerror = function () {   };
        w.onclose = function () { if (ws === w) ws = null; yenidenDene(); };
      });
    }
    function gorunurlukDegisti(gizli) {
      if (gizli) { askida = true; var w = ws; ws = null; if (w) { try { w.close(); } catch (e) {   } } }
      else { askida = false; if (istenen && !ws) ac().then(null, yenidenDene); }
    }
    if (!kapali && o.gorunurluk !== false && typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('visibilitychange', function () { gorunurlukDegisti(!!document.hidden); });
    }

    function gonderGovde(g) {
      g = g || {};
      var tur = g.tur || 'metin';
      if (TURLER.indexOf(tur) < 0) return hata('gecersiz');
      if (tur === 'metin') {
        var t = String(g.metin == null ? '' : g.metin).trim();
        if (!t) return hata('bos');
        if (t.length > MAKS_GOVDE) return hata('uzun');
        return { tur: 'metin', metin: t };
      }
      if (tur === 'kart') { var k = kartSuz(g.kart); return k ? { tur: 'kart', kart: k } : hata('gecersiz'); }
      var d = g.dosya;
      if (!d || !d.blob || !d.ad || !(d.boyut > 0) || !d.mime) return hata('gecersiz');
      return { tur: tur, dosya: { blob: String(d.blob), ad: String(d.ad), boyut: d.boyut, mime: String(d.mime) } };
    }

    var api = {
      acik: function () { return !kapali; },
      kisiler: function () { return cagri('GET', '/kisiler').then(function (v) { return liste(v, function (k) { return k && k.oid && k.ad ? { oid: s(k.oid), ad: s(k.ad) } : null; }); }); },
      sohbetleriListele: function () { return cagri('GET', '/sohbetler').then(function (v) { return liste(v, sohbetCevir); }); },
      sohbetAc: function (uyeler, ad) {
        var l = Array.isArray(uyeler) ? uyeler : [];
        if (!l.length || !l.every(oidGecerli)) return Promise.reject(hata('uye'));
        if (l.length === 1) return cagri('POST', '/sohbetler', { tur: 'bire', uyeler: l }).then(sohbetCevir);
        var a = String(ad || '').trim();
        if (!a) return Promise.reject(hata('ad'));
        return cagri('POST', '/sohbetler', { tur: 'grup', uyeler: l, ad: a.slice(0, 80) }).then(sohbetCevir);
      },
       
      tercih: function (sohbetId, t) { return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/tercih', t || {}); },
      uyeEkle: function (sohbetId, uyeler) {
        var l = Array.isArray(uyeler) ? uyeler : [];
        if (!l.length || !l.every(oidGecerli)) return Promise.reject(hata('uye'));
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/uyeler', { uyeler: l }).then(sohbetCevir);
      },
      uyeCikar: function (sohbetId, oid) {
        if (!oidGecerli(oid)) return Promise.reject(hata('uye'));
        return cagri('DELETE', '/sohbetler/' + sid(sohbetId) + '/uyeler/' + sid(oid)).then(function () { return true; });
      },
      grupBilgi: function (sohbetId, b) { return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/bilgi', b || {}).then(sohbetCevir); },
      yonetici: function (sohbetId, oid, yonetici) {
        if (!oidGecerli(oid)) return Promise.reject(hata('uye'));
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/yonetici', { oid: oid, yonetici: yonetici === true }).then(sohbetCevir);
      },
      medya: function (sohbetId, once) { return cagri('GET', '/sohbetler/' + sid(sohbetId) + '/medya' + (once ? '?once=' + encodeURIComponent(String(once)) : '')).then(function (v) { return liste(v, mesajCevir); }); },
      mesajlar: function (sohbetId, sayfa) {
        var q = '';
        if (sayfa && sayfa.once != null) q += (q ? '&' : '?') + 'once=' + encodeURIComponent(String(sayfa.once));
        var adet = sayfa && sayfa.adet ? Math.max(1, Math.min(50, parseInt(sayfa.adet, 10) || 50)) : 0;
        if (adet) q += (q ? '&' : '?') + 'adet=' + adet;
        return cagri('GET', '/sohbetler/' + sid(sohbetId) + '/mesajlar' + q).then(function (v) { return liste(v, mesajCevir); });
      },
      gonder: function (sohbetId, g) {
        var b = gonderGovde(g);
        if (b instanceof Error) return Promise.reject(b);
        b.istemciId = typeof g.istemciId === 'string' && ISTEMCI_ID.test(g.istemciId) ? g.istemciId : yeniIstemciId();   
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/mesajlar', b).then(mesajCevir);
      },
      metinGonder: function (sohbetId, metin, istemciId) { return api.gonder(sohbetId, { tur: 'metin', metin: metin, istemciId: istemciId }); },
      kartGonder: function (sohbetId, kart, istemciId) { return api.gonder(sohbetId, { tur: 'kart', kart: kart, istemciId: istemciId }); },
      yeniIstemciId: yeniIstemciId,
       
      teslim: function (sohbetId, sonId) {
        if (kapali) return Promise.reject(hata('kapali'));
        if (sonId == null || sonId === '') return Promise.reject(hata('gecersiz'));
        if (teslimYok) return Promise.resolve(false);
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/teslim', { sonId: String(sonId) }).then(function () { return true; }, function (e) {
          if (e && e.kod === 'yok') { teslimYok = true; return false; }
          throw e;
        });
      },
      okundu: function (sohbetId, sonId) {
        if (sonId == null || sonId === '') return Promise.reject(hata('gecersiz'));
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/okundu', { sonId: String(sonId) }).then(function () { return true; });
      },
      yaziyor: function (sohbetId) {
        if (kapali) return Promise.reject(hata('kapali'));
        var t = simdi(), son = sonYaziyor[sohbetId];
        if (son != null && t - son < YAZIYOR_MS) return Promise.resolve({ atlandi: true });   
        sonYaziyor[sohbetId] = t;
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/yaziyor').then(function () { return { atlandi: false }; });
      },
       
      dosyaYukle: function (sohbetId, dosya, opts) {
        if (kapali) return Promise.reject(hata('kapali'));
        var d = dosya || {};
        if (MIME.indexOf(d.mime) < 0) return Promise.reject(hata('tur'));
        if (!(d.boyut > 0) || d.boyut > MAKS_DOSYA) return Promise.reject(hata('boyut'));
        if (d.veri == null) return Promise.reject(hata('gecersiz'));
        var ad = adTemizle(d.ad), tur = (opts && opts.tur) || (/^audio\//.test(d.mime) ? 'ses' : 'dosya');
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/dosya', { ad: ad, boyut: d.boyut, mime: d.mime }).then(function (v) {
          if (!v || typeof v.yukleUrl !== 'string' || !/^https:\/\//.test(v.yukleUrl) || !v.blob) throw hata('gecersiz');
          return Promise.resolve().then(function () {
            return blobTasiyici({ yontem: 'PUT', url: v.yukleUrl, basliklar: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': d.mime }, govde: d.veri });
          }).then(null, function () { throw hata('ag'); }).then(function (r) {
            if (!r || r.durum < 200 || r.durum >= 300) throw hata('yukleme', { durum: r && r.durum });
            return api.gonder(sohbetId, { tur: tur, dosya: { blob: v.blob, ad: ad, boyut: d.boyut, mime: d.mime } });
          });
        });
      },
      fotografTemizle: fotografTemizle,
      dosyaIndir: function (sohbetId, blob) {
        return cagri('GET', '/sohbetler/' + sid(sohbetId) + '/dosya/' + sid(blob)).then(function (v) {
          if (!v || typeof v.indirUrl !== 'string' || !/^https:\/\//.test(v.indirUrl)) throw hata('gecersiz');
          return v.indirUrl;
        });
      },
      aramaBaslat: function (sohbetId, video) {
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/arama', { video: video === true }).then(function (v) {
          if (!v || !v.groupId || !v.acsToken || !v.acsUserId) throw hata('gecersiz');
          return { groupId: s(v.groupId), acsToken: s(v.acsToken), acsUserId: s(v.acsUserId), bitis: v.bitis };
        });
      },
       
      aramayaKatil: function (sohbetId, groupId) {
        if (typeof groupId !== 'string' || !groupId) return Promise.reject(hata('gecersiz'));
        return cagri('POST', '/sohbetler/' + sid(sohbetId) + '/arama/katil', { groupId: groupId }).then(function (v) {
          if (!v || !v.groupId || !v.acsToken || !v.acsUserId) throw hata('gecersiz');
          return { groupId: s(v.groupId), acsToken: s(v.acsToken), acsUserId: s(v.acsUserId), bitis: v.bitis };
        });
      },
      cihazKaydet: function (platform, handle) {
        if ((platform !== 'apns' && platform !== 'fcmv1') || typeof handle !== 'string' || !handle) return Promise.reject(hata('gecersiz'));
        return cagri('POST', '/cihaz', { platform: platform, handle: handle }).then(function () { return true; });
      },
      cihazKaydiYap: function () {
        if (typeof o.bildirimKayit !== 'function') return Promise.reject(hata('bildirim'));
        return Promise.resolve().then(o.bildirimKayit).then(function (k) { return api.cihazKaydet(k && k.platform, k && k.handle); });
      },
      cihazSil: function (handle) { return cagri('DELETE', '/cihaz', typeof handle === 'string' && handle ? { handle: handle } : undefined).then(function () { return true; }); },   
      on: function (olay, fn) {
        if (OLAYLAR.indexOf(olay) < 0 || typeof fn !== 'function') return function () {};
        dinleyici[olay].push(fn);
        return function () { var i = dinleyici[olay].indexOf(fn); if (i >= 0) dinleyici[olay].splice(i, 1); };
      },
      baglan: function () { if (kapali) return Promise.reject(hata('kapali')); istenen = true; return ac(); },
      kapat: function () { istenen = false; var w = ws; ws = null; if (w) { try { w.close(); } catch (e) {   } } },
      gorunurlukDegisti: gorunurlukDegisti,
      baglantiVar: function () { return !!ws; }
    };
    return api;
  }

   
  var Arama = {
    baslat: function (bilgi, ayar, ortam) {
      var acs = (ortam && ortam.acs) || (typeof window !== 'undefined' ? window.MM_ACS : null);
      if (!acs || !acs.CallClient || !acs.AzureCommunicationTokenCredential) return Promise.reject(hata('arama-yok'));
      if (!bilgi || !bilgi.groupId || !bilgi.acsToken) return Promise.reject(hata('gecersiz'));
      return Promise.resolve().then(function () {
        var istemci = new acs.CallClient();
        return istemci.createCallAgent(new acs.AzureCommunicationTokenCredential(bilgi.acsToken)).then(function (ajan) {
          var cagri = ajan.join({ groupId: bilgi.groupId }, ayar && ayar.video ? { videoOptions: { localVideoStreams: [] } } : {});
          return { bitir: function () { return Promise.resolve(cagri.hangUp()).then(function () { return ajan.dispose(); }); }, cagri: cagri };
        });
      }).then(null, function (e) { throw e && e.kod ? e : hata('arama'); });
    }
  };

  var API = { hazirla: hazirla, parcala: parcala, kartSuz: kartSuz, mesajCevir: mesajCevir, sohbetCevir: sohbetCevir, fotografTemizle: fotografTemizle, adTemizle: adTemizle, MIME: MIME, MAKS_DOSYA: MAKS_DOSYA, Arama: Arama };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (typeof window !== 'undefined') { window.MMMesajIstemci = API; window.MMMesajArama = Arama; }
})();
