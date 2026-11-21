




(function () {
  'use strict';
  var BILGI = 'Bu sohbetler şirketin Microsoft bulut hesabında (Avrupa Birliği içinde) 12 ay saklanır. Uçtan uca şifreli değildir; şirket yönetimi gerektiğinde erişebilir. Aramalar kaydedilmez. Şifre, kimlik numarası, sağlık bilgisi yazmayınız. Buraya yazılan \'onay\' ya da \'gönder\' hiçbir işlemi başlatmaz.';
  var KABUL = 'image/jpeg,image/png,image/heic,application/pdf,.xlsx,.docx,audio/mp4,audio/webm,audio/aac';
  var RENKLER = ['#2e6fb7', '#00796b', '#8e44ad', '#c0392b', '#b45309', '#6d4c41', '#455a64', '#ad1457'];

  function kisileriSuz(v) {
    var l = (v && v.kisiler) || (Array.isArray(v) ? v : []);
    return l.filter(function (k) { return k && k.oid && k.ad; }).map(function (k) { return { oid: String(k.oid), ad: String(k.ad) }; });   
  }
   
  function paylasMetni(rota, bolumAd) {
    var r = String(rota || '').replace(/^#\/?/, '');
    var bolum = r.split(/[\/?&]/)[0];
    if (!bolum || !/^[A-Za-z0-9_-]{1,60}$/.test(bolum)) return null;
    var rt = bolum.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);   
    if (!rt) return null;
    var ad = String(bolumAd || bolum).replace(/[^A-Za-z0-9ÇĞİÖŞÜçğıöşü _-]/g, '').trim().slice(0, 40) || rt;   
    return { bolum: bolum, rota: '#' + rt, kart: { bolum: ad, rota: '#' + rt }, yalnizBolum: true };
  }

   
  function epoch(ts) {
    if (typeof ts === 'number') return isFinite(ts) ? ts : NaN;
    if (typeof ts === 'string' && /^\d{9,}$/.test(ts)) return Number(ts);
    var d = new Date(ts); return d.getTime();
  }
  var TZ = null;
  function trParca(ts) {   
    var ms = epoch(ts); if (isNaN(ms)) return null;
    try {
      TZ = TZ || new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      var o = {}; TZ.formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
      return { y: o.year, m: o.month, d: o.day, sa: o.hour === '24' ? '00' : o.hour, dk: o.minute };
    } catch (e) { return null; }
  }
  function saatDk(ts) { var p = trParca(ts); return p ? p.sa + ':' + p.dk : ''; }
  function ayniGun(a, b) { return !!(a && b && a.y === b.y && a.m === b.m && a.d === b.d); }
   
  function saatBicim(ts, simdi) {
    var p = trParca(ts); if (!p) return '';
    var n = trParca(simdi == null ? Date.now() : simdi);
    return ayniGun(p, n) ? p.sa + ':' + p.dk : p.d + '.' + p.m;
  }
  function gunEtiket(ts, simdi) {   
    var p = trParca(ts); if (!p) return '';
    var ms = epoch(simdi == null ? Date.now() : simdi);
    if (ayniGun(p, trParca(ms))) return 'Bugün';
    if (ayniGun(p, trParca(ms - 86400000))) return 'Dün';
    return p.d + '.' + p.m + '.' + p.y;
  }
  function basHarf(ad) {
    var k = String(ad || '').trim().split(/\s+/).filter(Boolean);
    if (!k.length) return '?';
    var ilk = Array.from(k[0])[0] || '';
    var son = k.length > 1 ? (Array.from(k[k.length - 1])[0] || '') : '';
    return (ilk + son).toLocaleUpperCase('tr');
  }
  function avatarRengi(anahtar) {
    var s = String(anahtar || ''), t = 0;
    for (var i = 0; i < s.length; i++) t = (t * 31 + s.charCodeAt(i)) >>> 0;
    return RENKLER[t % RENKLER.length];
  }
  function kucukTr(s) { return String(s || '').toLocaleLowerCase('tr'); }
   
  function kisiSuz(liste, q, benOid) {
    var a = kucukTr(String(q || '').trim());
    return (liste || []).filter(function (k) { return k && k.oid !== benOid && (!a || kucukTr(k.ad).indexOf(a) >= 0); })
      .sort(function (x, y) { return String(x.ad).localeCompare(String(y.ad), 'tr'); });
  }
  function okunmamisToplam(liste) { return (liste || []).reduce(function (t, s) { return t + (Number(s && s.okunmamis) > 0 ? Number(s.okunmamis) : 0); }, 0); }
  function rozetMetni(n) { n = Number(n) || 0; return n <= 0 ? '' : (n > 99 ? '99+' : String(n)); }
  function sonMs(s) { var ms = s && s.son ? epoch(s.son.ts) : NaN; return isNaN(ms) ? 0 : ms; }
  function siraliSohbetler(liste) { return (liste || []).slice().sort(function (a, b) { return sonMs(b) - sonMs(a); }); }   
  function kirp(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function mesajOzet(m, ceviri) {
    var c = ceviri || function (x) { return x; };
    if (!m) return '';
    if (m.tur === 'metin' || !m.tur) return kirp(m.metin, 60);
    return c(m.tur === 'kart' ? 'Paylaşılan kart' : m.tur === 'ses' ? 'Sesli mesaj' : 'Dosya');
  }
  function bandMetni(ad, ozet) { return (ad || 'Biri') + ': ' + kirp(ozet, 50); }
  function birebirBul(liste, oid) {   
    return (liste || []).filter(function (s) { return s && s.tur === 'bire' && Array.isArray(s.uyeler) && s.uyeler.indexOf(oid) >= 0 && s.uyeler.length <= 2; })[0] || null;
  }

  var MM = (typeof window !== 'undefined' && window.MM) || null;
  var API = { kisileriSuz: kisileriSuz, paylasMetni: paylasMetni, BILGI: BILGI, saatBicim: saatBicim, saatDk: saatDk, gunEtiket: gunEtiket, basHarf: basHarf, avatarRengi: avatarRengi, kisiSuz: kisiSuz, okunmamisToplam: okunmamisToplam, rozetMetni: rozetMetni, siraliSohbetler: siraliSohbetler, mesajOzet: mesajOzet, bandMetni: bandMetni, birebirBul: birebirBul, kirp: kirp };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (!MM) return;

  var h = MM.h, T = function (k) { return MM.t ? MM.t(k) : k; };
  var bekleyenKart = null, ist = null, bilgiOk = false;
  function ayar() { return (window.MM_AYAR && window.MM_AYAR.mesaj) || {}; }
  function istemci() {
    if (ist) return ist;
    var IS = window.MMMesajIstemci;
    if (!IS) return null;
    var a = ayar();
    var cap = window.Capacitor;
    if (!(cap && cap.isNativePlatform && cap.isNativePlatform())) return null;   
    var cfg = { apiUrl: a.url || '', belirtecAl: function () { return MM.mesaj.belirtecAl ? MM.mesaj.belirtecAl([a.apiKapsam]) : Promise.reject(new Error('belirtec')); } };
    ist = (MM.mesaj.istemciKur || IS.hazirla)(cfg);
    return ist;
  }
  function acik() { var i = istemci(); return !!(i && i.acik()); }
  function ben() { return (MM.mesaj.hesap && MM.mesaj.hesap()) || {}; }

   
  var D = { sohbetler: [], kisiler: null, kisiHata: null, sohbetYuklendi: false, acikId: '', basladi: false, abone: [], dinleyen: [], kisiBekle: null, sohbetBekle: null, ac: null, acilacak: '', bantZmn: null, bantEl: null };
  function bildir() { rozetUygula(); D.dinleyen.slice().forEach(function (f) { try { f(); } catch (e) {   } }); }
  function rozetUygula() {
    if (typeof document === 'undefined') return;
    var n = rozetMetni(okunmamisToplam(D.sohbetler));
    Array.prototype.forEach.call(document.querySelectorAll('[data-modul="mesaj"]'), function (a) {
      var eski = a.querySelector('.ms-nrozet'); if (eski) a.removeChild(eski);
      if (n) { a.appendChild(h('span', { sinif: 'ms-nrozet', metin: n, role: 'status', 'aria-label': n + ' ' + T('okunmamış') })); }
    });
  }
  function kisiYukle() {
    var i = istemci(); if (!i) return Promise.reject({ kod: 'kapali' });
    if (D.kisiBekle) return D.kisiBekle;
    D.kisiBekle = i.kisiler().then(function (k) { D.kisiBekle = null; D.kisiler = k; D.kisiHata = null; bildir(); return k; }, function (e) { D.kisiBekle = null; D.kisiHata = e; throw e; });
    return D.kisiBekle;
  }
  function sohbetYukle() {
    var i = istemci(); if (!i) return Promise.reject({ kod: 'kapali' });
    if (D.sohbetBekle) return D.sohbetBekle;
    D.sohbetBekle = i.sohbetleriListele().then(function (l) {
      D.sohbetBekle = null; D.sohbetYuklendi = true;
      
      l.forEach(function (s) { if (s.id === D.acikId) s.okunmamis = 0; });
      D.sohbetler = l; bildir(); return l;
    }, function (e) { D.sohbetBekle = null; throw e; });
    return D.sohbetBekle;
  }
  function kisiAdiOid(oid) { var k = (D.kisiler || []).filter(function (x) { return x.oid === oid; })[0]; return k ? k.ad : ''; }
  function sohbetAdi(s) {
    if (s.ad) return s.ad;
    var me = ben().oid;
    var adlar = s.uyeler.filter(function (o) { return o !== me; }).map(kisiAdiOid).filter(Boolean);
    return adlar.join(', ') || T('Sohbet');
  }
  function bantKapat() { clearTimeout(D.bantZmn); if (D.bantEl && D.bantEl.parentNode) D.bantEl.parentNode.removeChild(D.bantEl); D.bantEl = null; }
  function sohbeteGit(id) {
    D.acilacak = id;
    if (D.ac) D.ac(id); else location.hash = '#mesaj';
  }
  function bantGoster(s, m) {   
    if (typeof document === 'undefined' || document.hidden) return;
    bantKapat();
    var ad = (m.gonderen && kisiAdiOid(m.gonderen)) || sohbetAdi(s);
    var b = h('button', { sinif: 'ms-bildirim', type: 'button', role: 'status', metin: bandMetni(ad, mesajOzet(m, T)) });
    b.addEventListener('click', function () { bantKapat(); sohbeteGit(s.id); });
    D.bantEl = b; document.body.appendChild(b);
    D.bantZmn = setTimeout(bantKapat, 3000);
  }
  function gelenMesaj(m) {
    var me = ben().oid, s = D.sohbetler.filter(function (c) { return c.id === m.sohbet; })[0];
    var baskasi = m.gonderen !== me;
    if (!s) { sohbetYukle().then(function () { var y = D.sohbetler.filter(function (c) { return c.id === m.sohbet; })[0]; if (y && baskasi && D.acikId !== m.sohbet) bantGoster(y, m); }, function () {   }); return; }
    s.son = { ts: m.ts, gonderen: m.gonderen, ozet: mesajOzet(m, T) };
    if (baskasi && D.acikId !== m.sohbet) { s.okunmamis = (s.okunmamis || 0) + 1; bantGoster(s, m); }
    D.sohbetler = siraliSohbetler(D.sohbetler);
    bildir();
  }
  function arkaBaslat() {
    if (D.basladi) return;
    var i = istemci(); if (!i || !i.acik() || !ben().oid) return;
    D.basladi = true;
    D.abone.push(i.on('mesaj', gelenMesaj));
    i.baglan().then(null, function () {   });
    kisiYukle().then(null, function () {   });
    sohbetYukle().then(null, function () {   });
  }
  function arkaSifirla() {
    D.abone.forEach(function (f) { f(); }); D.abone = []; D.basladi = false; D.sohbetler = []; D.kisiler = null; D.kisiHata = null; D.sohbetYuklendi = false; D.acikId = ''; D.acilacak = '';
    bantKapat(); bildir();
  }
  MM.mesaj = Object.assign(MM.mesaj || {}, API, {
    paylas: function (rota, bolumAd) {
      var p = paylasMetni(rota || location.hash, bolumAd);   
      if (!p) return p;
      if (acik()) { bekleyenKart = p; location.hash = '#mesaj'; }   
      return p;
    },
    arkaBaslat: arkaBaslat,
    rozetUygula: rozetUygula,
    cikis: function () { var i = ist; arkaSifirla(); if (i && i.acik()) { i.kapat(); return i.cihazSil().then(null, function () { return false; }); } return Promise.resolve(false); }
  });

  var HATA = { kapali: 'Mesaj kapalı', belirtec: 'Mesaj girişi alınamadı', kimlik: 'Giriş geçersiz', uye: 'İşlem yapılamadı', yok: 'Bulunamadı', gecersiz: 'Geçersiz istek', '429': 'Çok sık istek; biraz sonra deneyin', ag: 'Bağlantı yok', sunucu: 'Sunucu hatası', bos: 'Mesaj boş', uzun: 'Mesaj çok uzun', tur: 'Bu dosya türü gönderilemez', boyut: 'Dosya 25 MB\'tan büyük olamaz', foto: 'Fotoğraf işlenemedi', yukleme: 'Dosya yüklenemedi', ad: 'Grup adı yazın', 'arama-yok': 'Arama bu cihazda yok', arama: 'Arama başlatılamadı' };
  function hataYaz(e) { return T(HATA[e && e.kod] || 'Alınamadı'); }

   
  function avatar(ad, anahtar, grup) {
    var a = h('span', { sinif: 'ms-av' + (grup ? ' ms-av-grup' : ''), 'aria-hidden': 'true', metin: grup ? '' : basHarf(ad) });
    a.style.background = avatarRengi(anahtar || ad);
    if (grup) a.appendChild(MM.svg('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: '#fff', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [MM.svg('path', { d: 'M16 11a3 3 0 100-6 3 3 0 000 6zM8 12a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5' })]));
    return a;
  }
  function geriDugme(fn) {
    var g = h('button', { sinif: 'ms-geri', type: 'button', 'aria-label': T('Geri'), metin: '‹' });
    g.addEventListener('click', fn); return g;
  }

  MM.moduller.mesaj = function (kok) {
    var canli = true, i = istemci();
    var kap = h('div', { sinif: 'ms-kok' });
    kok.appendChild(kap);
    if (!i || !i.acik()) {
      kap.appendChild(h('p', { sinif: 'veri-yok', metin: T('Mesaj kapalı') }));
      return function () { canli = false; };
    }
    arkaBaslat();
    var benOid = ben().oid || '';
    var secili = null, bantlar = [], cozucu = [], gorunum = 'liste', listeKut = null, bekleyenAc = D.acilacak || '';
    D.acilacak = '';
    var durum = h('p', { sinif: 'ms-durum kucuk soluk', metin: '' });
    function yaz(m) { if (canli) durum.textContent = m || ''; }
    function bilgiSatir() { return h('p', { sinif: 'ms-bilgi kucuk soluk', metin: BILGI }); }
    function temizle() { if (!canli) return; kap.textContent = ''; cozucu.forEach(function (f) { f(); }); cozucu = []; listeKut = null; }
    function ekranSinifi(s) { kap.className = 'ms-kok ' + s; }
    function sohbetBul(id) { return D.sohbetler.filter(function (c) { return c.id === id; })[0]; }

     
    function bantEl() {
      var b = h('div', { sinif: 'ms-bant-kok' });
      bantlar.forEach(function (x) {
        var d = h('button', { sinif: 'ms-bant', type: 'button', metin: x.ad + ' ' + T('sizi arıyor') + (x.video ? ' (' + T('görüntülü') + ')' : '') + ' — ' + T('Katıl') });
        d.addEventListener('click', function () {
          bantlar = bantlar.filter(function (y) { return y !== x; });
          yaz(T('Aranıyor'));
          i.aramayaKatil(x.sohbet, x.groupId).then(function (bl) { return window.MMMesajArama.baslat(bl, { video: x.video }); }).then(function () { yaz(T('Arama sürüyor')); }, function (e) { yaz(hataYaz(e)); });
          var s = sohbetBul(x.sohbet); if (!secili && s) sohbetGoster(s); else if (!secili) listeGoster();
        });
        b.appendChild(d);
      });
      return b;
    }
    var abonelik = [];
    abonelik.push(i.on('arama', function (ev) {
      if (!canli) return;
      var s = sohbetBul(ev.sohbet);
      if (!ev.groupId) return;
      bantlar.push({ sohbet: ev.sohbet, groupId: ev.groupId, video: ev.video, ad: s ? sohbetAdi(s) : (ev.arayan || T('Sohbet')) });
      if (secili) return; listeGoster();
    }));

     
    function satirSohbet(s) {
      var grup = s.tur === 'grup', ad = sohbetAdi(s);
      var onek = '';
      if (s.son && s.son.gonderen) onek = (s.son.gonderen === benOid ? T('Siz') : (grup ? (kisiAdiOid(s.son.gonderen) || T('Biri')) : '')) + (s.son.gonderen === benOid || grup ? ': ' : '');
      var ozet = s.son ? onek + s.son.ozet : '';
      var okunmamis = s.okunmamis > 0;
      var ust = h('span', { sinif: 'ms-satir-ust' }, [h('span', { sinif: 'ms-sad' + (okunmamis ? ' ms-kalin' : ''), metin: ad }), h('span', { sinif: 'ms-saat' + (okunmamis ? ' ms-saat-yeni' : ''), metin: s.son ? saatBicim(s.son.ts) : '' })]);
      var altEl = [h('span', { sinif: 'ms-ozet', metin: ozet })];
      if (okunmamis) altEl.push(h('span', { sinif: 'ms-rozet', metin: rozetMetni(s.okunmamis) }));
      var alt = h('span', { sinif: 'ms-satir-alt' }, altEl);
      var b = h('button', { sinif: 'ms-sohbet', type: 'button' }, [avatar(ad, s.id, grup), h('span', { sinif: 'ms-sol' }, [ust, alt])]);
      b.addEventListener('click', function () { sohbetGoster(s); });
      return b;
    }
    function listeIc() {
      if (!canli || !listeKut) return;
      listeKut.textContent = '';
      var asistan = h('button', { sinif: 'ms-sohbet ms-asistan', type: 'button' }, [avatar('Asistan', 'asistan'), h('span', { sinif: 'ms-sol' }, [h('span', { sinif: 'ms-satir-ust' }, [h('span', { sinif: 'ms-sad', metin: T('Asistan') })])])]);
      asistan.addEventListener('click', function () { location.hash = '#asistan'; });   
      listeKut.appendChild(asistan);
      siraliSohbetler(D.sohbetler).forEach(function (s) { listeKut.appendChild(satirSohbet(s)); });
      if (!D.sohbetler.length) listeKut.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: D.sohbetYuklendi ? T('Henüz sohbet yok. Başlatmak için sağ alttaki düğmeye dokunun.') : T('Yükleniyor') }));
    }
    function listeGoster() {
      if (!canli) return; secili = null; gorunum = 'liste'; D.acikId = ''; temizle(); ekranSinifi('ms-ekran-liste');
      var yen = h('button', { sinif: 'ms-yenile', type: 'button', metin: T('Yenile') });
      yen.addEventListener('click', function () { yaz(T('Yükleniyor')); sohbetYukle().then(function () { yaz(''); }, function (e) { yaz(hataYaz(e)); }); });
      kap.appendChild(h('div', { sinif: 'ms-baslik-sat' }, [h('strong', { sinif: 'ms-ekran-ad', metin: T('Mesajlar') }), yen]));
      kap.appendChild(bantEl());
      if (!bilgiOk) {   
        var kutu = h('div', { sinif: 'ms-ilk' }, [h('p', { metin: BILGI })]);
        var tmm = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Anladım') });
        tmm.addEventListener('click', function () { bilgiOk = true; listeGoster(); });
        kutu.appendChild(tmm); kap.appendChild(kutu);
      }
      kap.appendChild(durum);
      listeKut = h('div', { sinif: 'ms-sohbetler' }); kap.appendChild(listeKut);
      listeIc();
      kap.appendChild(bilgiSatir());
      var fab = h('button', { sinif: 'ms-fab', type: 'button', 'aria-label': T('Yeni sohbet') }, [MM.svg('svg', { viewBox: '0 0 24 24', width: 26, height: 26, fill: 'none', stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [MM.svg('path', { d: 'M4 5h16v11H9l-5 4zM12 8v5M9.5 10.5h5' })])]);
      fab.addEventListener('click', function () { kisiSecGoster(); });
      kap.appendChild(fab);
    }
    function listeYukle() {
      yaz(T('Yükleniyor'));
      return sohbetYukle().then(function () { yaz(''); }, function (e) { yaz(hataYaz(e)); });
    }

     
    function kisiBaslik(ad, geriFn) { return h('div', { sinif: 'ms-ust-cubuk' }, [geriDugme(geriFn), h('strong', { sinif: 'ms-ekran-ad', metin: ad })]); }
    function birebirAc(k, tekrar) {
      var var_ = birebirBul(D.sohbetler, k.oid);
      if (var_) { sohbetGoster(var_); return; }
      yaz(T('Açılıyor'));
      i.sohbetAc([k.oid]).then(function (s) { if (!canli || !s) return; D.sohbetler = siraliSohbetler([s].concat(D.sohbetler.filter(function (c) { return c.id !== s.id; }))); bildir(); sohbetGoster(s); }, function (e) { uyeHata(e, tekrar); });
    }
    var uyeOto = false;   
    function uyeHata(e, tekrar) {
      if (!canli) return;
      if (e && e.kod === 'uye') {
        if (!uyeOto) { uyeOto = true; yaz(T('Kişi listesi yenileniyor…')); kisiYukle().then(function () { if (canli && gorunum !== 'sohbet') { yaz(''); if (tekrar) tekrar(true); } },function () { yaz(T('Kişi listesi alınamadı')); if (tekrar) tekrar(false, true); }); return; }
        yaz(T('Kişi listesi alınamadı')); if (tekrar) tekrar(false, true); return;
      }
      yaz(hataYaz(e));
    }
    function kisiSecGoster() {
      if (!canli) return; secili = null; gorunum = 'yeni'; D.acikId = ''; temizle(); ekranSinifi('ms-ekran-kisi'); uyeOto = false;
      var arama = '', yenidenDugme = null;
      var ara = h('input', { sinif: 'ms-ara', type: 'search', placeholder: T('Kişi ara'), 'aria-label': T('Kişi ara') });
      var liste = h('div', { sinif: 'ms-liste' });
      function cizListe() {
        if (!canli || gorunum !== 'yeni') return;
        liste.textContent = '';
        var grupSat = h('button', { sinif: 'ms-kisi ms-kisi-grup', type: 'button' }, [avatar('', 'grup', true), h('span', { sinif: 'ms-kisi-ad', metin: T('Yeni grup') })]);
        grupSat.addEventListener('click', function () { grupGoster(); });
        liste.appendChild(grupSat);
        if (D.kisiler === null) { liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: D.kisiHata ? T('Kişi listesi alınamadı') : T('Yükleniyor') })); return; }
        var tum = kisiSuz(D.kisiler, '', benOid), g = kisiSuz(D.kisiler, arama, benOid);
        if (!tum.length) { liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Henüz kimse yok — app\'i açan iş arkadaşların burada görünecek') })); return; }
        if (!g.length) liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Kişi bulunamadı') }));
        g.forEach(function (k) {
          var b = h('button', { sinif: 'ms-kisi', type: 'button' }, [avatar(k.ad, k.oid), h('span', { sinif: 'ms-kisi-ad', metin: k.ad })]);
          b.addEventListener('click', function () { birebirAc(k, function (oto, goster) { if (oto) cizListe(); if (goster) retryGoster(function () { birebirAc(k); }); }); });
          liste.appendChild(b);
        });
      }
      function retryGoster(fn) {
        if (yenidenDugme && yenidenDugme.parentNode) yenidenDugme.parentNode.removeChild(yenidenDugme);
        yenidenDugme = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Yeniden dene') });
        yenidenDugme.addEventListener('click', function () { uyeOto = false; yenidenDugme.parentNode && yenidenDugme.parentNode.removeChild(yenidenDugme); yenidenDugme = null; yaz(T('Yükleniyor')); kisiYukle().then(function () { yaz(''); cizListe(); if (fn) fn(); }, function (e) { uyeHata(e, function (oto, goster) { if (goster) retryGoster(fn); }); }); });
        durum.parentNode && durum.parentNode.insertBefore(yenidenDugme, durum.nextSibling);
      }
      function yukle() {
        yaz(D.kisiler === null ? T('Yükleniyor') : '');
        kisiYukle().then(function () { yaz(''); cizListe(); }, function (e) {
          cizListe();
          if (e && e.kod === 'uye') { uyeHata(e, function (oto, goster) { if (oto) { yaz(''); cizListe(); } else if (goster) retryGoster(null); }); }
          else { yaz(hataYaz(e)); retryGoster(null); }
        });
      }
      ara.addEventListener('input', function () { arama = ara.value; cizListe(); });
      kap.appendChild(kisiBaslik(T('Yeni sohbet'), listeGoster));
      kap.appendChild(ara); kap.appendChild(durum); kap.appendChild(liste);
      cizListe(); yukle();   
    }

     
    function grupGoster() {
      if (!canli) return; secili = null; gorunum = 'grup'; D.acikId = ''; temizle(); ekranSinifi('ms-ekran-kisi');
      var seciliOid = {}, arama = '';
      var ara = h('input', { sinif: 'ms-ara', type: 'search', placeholder: T('Kişi ara'), 'aria-label': T('Kişi ara') });
      var grupAd = h('input', { sinif: 'ms-ara', type: 'text', placeholder: T('Grup adı'), 'aria-label': T('Grup adı'), maxlength: 80 });
      var sayac = h('p', { sinif: 'ms-sayac kucuk soluk', metin: '' });
      var liste = h('div', { sinif: 'ms-liste' });
      var basla = h('button', { sinif: 'ms-ac ms-ac-genis', type: 'button', metin: T('Grubu oluştur') });
      function sec() { return Object.keys(seciliOid).filter(function (k) { return seciliOid[k]; }); }
      function sayacYaz() { var n = sec().length; sayac.textContent = n ? n + ' ' + T('kişi seçildi') : T('Gruba eklenecek kişileri seçin'); }
      function cizListe() {
        if (!canli || gorunum !== 'grup') return;
        liste.textContent = '';
        if (D.kisiler === null) { liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: D.kisiHata ? T('Kişi listesi alınamadı') : T('Yükleniyor') })); return; }
        var tum = kisiSuz(D.kisiler, '', benOid), g = kisiSuz(D.kisiler, arama, benOid);
        if (!tum.length) { liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Henüz kimse yok — app\'i açan iş arkadaşların burada görünecek') })); return; }
        if (!g.length) liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Kişi bulunamadı') }));
        g.forEach(function (k) {
          var cb = h('input', { type: 'checkbox', 'aria-label': k.ad, sinif: 'ms-isaret' }); cb.checked = !!seciliOid[k.oid];
          cb.addEventListener('change', function () { seciliOid[k.oid] = cb.checked; sayacYaz(); });
          liste.appendChild(h('label', { sinif: 'ms-kisi' }, [avatar(k.ad, k.oid), h('span', { sinif: 'ms-kisi-ad', metin: k.ad }), cb]));
        });
      }
      function olustur() {
        var l = sec();
        if (l.length < 2) { yaz(T('Grup için en az 2 kişi seçin')); return; }
        if (!grupAd.value.trim()) { yaz(T('Grup adı yazın')); return; }
        yaz(T('Açılıyor'));
        i.sohbetAc(l, grupAd.value).then(function (s) { if (!canli || !s) return; D.sohbetler = siraliSohbetler([s].concat(D.sohbetler.filter(function (c) { return c.id !== s.id; }))); bildir(); sohbetGoster(s); }, function (e) {
          if (e && e.kod === 'uye') { uyeOto = false; uyeHata(e, function (oto, goster) { if (oto) { yaz(T('Kişi listesi yenilendi, tekrar deneyin')); cizListe(); } else if (goster) { var r = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Yeniden dene') }); r.addEventListener('click', function () { uyeOto = false; r.parentNode && r.parentNode.removeChild(r); yaz(T('Yükleniyor')); kisiYukle().then(function () { yaz(''); cizListe(); }, function (e2) { uyeHata(e2, null); }); }); durum.parentNode && durum.parentNode.insertBefore(r, durum.nextSibling); } }); }
          else yaz(hataYaz(e));
        });
      }
      ara.addEventListener('input', function () { arama = ara.value; cizListe(); });
      basla.addEventListener('click', olustur);
      kap.appendChild(kisiBaslik(T('Yeni grup'), kisiSecGoster));
      kap.appendChild(grupAd); kap.appendChild(ara); kap.appendChild(sayac); kap.appendChild(liste); kap.appendChild(durum); kap.appendChild(basla);
      sayacYaz(); cizListe();
      kisiYukle().then(function () { cizListe(); }, function (e) { uyeOto = false; uyeHata(e, function (oto) { if (oto) cizListe(); }); });
    }

     
    function sohbetGoster(s) {
      if (!canli) return; secili = s; gorunum = 'sohbet'; temizle(); ekranSinifi('ms-ekran-sohbet');
      s.okunmamis = 0; D.acikId = s.id; bildir();
      var grup = s.tur === 'grup';
      var mesajlar = [], okuyan = {}, yaziyorZmn = null, uyeAd = kisiAdiOid, adEl = sohbetAdi(s);
      var altYazi = h('span', { sinif: 'ms-alt-yazi', metin: grup ? (s.uyeler.length + ' ' + T('üye')) : '' });
      function ikonSvg(d) { return MM.svg('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [MM.svg('path', { d: d })]); }
      var sesli = h('button', { sinif: 'ms-ikon', type: 'button', 'aria-label': T('Sesli ara') }, [ikonSvg('M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z')]);
      var goruntulu = h('button', { sinif: 'ms-ikon', type: 'button', 'aria-label': T('Görüntülü ara') }, [ikonSvg('M3 7h12v10H3zM15 11l6-3v8l-6-3')]);
      function ara(video) {
        yaz(T('Aranıyor'));
        i.aramaBaslat(s.id, video).then(function (b) { return window.MMMesajArama.baslat(b, { video: video }); }).then(function () { yaz(T('Arama sürüyor')); }, function (e) { yaz(hataYaz(e)); });
      }
      sesli.addEventListener('click', function () { ara(false); });
      goruntulu.addEventListener('click', function () { ara(true); });
      kap.appendChild(h('div', { sinif: 'ms-ust-cubuk ms-sohbet-ust' }, [geriDugme(function () { listeGoster(); }), avatar(adEl, s.id, grup), h('span', { sinif: 'ms-baslik-kutu' }, [h('strong', { sinif: 'ms-baslik', metin: adEl }), altYazi]), sesli, goruntulu]));
      kap.appendChild(bantEl());
      var msj = h('div', { sinif: 'ms-mesajlar' }); kap.appendChild(msj);
      var kutu = h('textarea', { sinif: 'ms-yaz', rows: 1, 'aria-label': T('Mesaj'), placeholder: T('Mesaj yazın'), maxlength: 4000 });
      var gon = h('button', { sinif: 'ms-gonder', type: 'button', 'aria-label': T('Gönder') }, [MM.svg('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: '#fff', 'aria-hidden': 'true' }, [MM.svg('path', { d: 'M3 20l18-8L3 4v6l11 2-11 2z' })])]);
      var dosya = h('input', { type: 'file', accept: KABUL, hidden: true });
      var ek = h('button', { sinif: 'ms-ikon ms-ek', type: 'button', metin: '+', 'aria-label': T('Dosya / fotoğraf') });
      ek.addEventListener('click', function () { dosya.click(); });
      var alt = [ek, kutu, gon, dosya];
      var altKap = h('div', { sinif: 'ms-alt' }, alt);
      if (bekleyenKart) {
        var kb = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Kartı gönder') + ': ' + bekleyenKart.kart.bolum });
        kb.addEventListener('click', function () {
          var k = bekleyenKart; if (!k) return;
          i.kartGonder(s.id, k.kart).then(function (m) { bekleyenKart = null; kb.disabled = true; if (m) ekle(m); }, function (e) { yaz(hataYaz(e)); });
        });
        kap.appendChild(kb);
      }
      kap.appendChild(durum); kap.appendChild(altKap);

      function okunduMu(idx) {   
        return Object.keys(okuyan).some(function (o) { if (o === benOid) return false; var j = -1; mesajlar.forEach(function (m, n) { if (m.id === okuyan[o]) j = n; }); return j >= idx; });
      }
      function govdeEl(m) {
        if (m.tur === 'kart' && m.kart) {   
          var d = h('button', { sinif: 'ms-kart', type: 'button', metin: m.kart.bolum });
          d.addEventListener('click', function () { location.hash = m.kart.rota; });
          return d;
        }
        if ((m.tur === 'dosya' || m.tur === 'ses') && m.dosya) {
          var f = h('button', { sinif: 'ms-kart', type: 'button', metin: (m.tur === 'ses' ? T('Sesli mesaj') + ': ' : '') + m.dosya.ad });
          f.addEventListener('click', function () {
            i.dosyaIndir(s.id, m.dosya.blob).then(function (u) { window.open(u, '_blank', 'noopener'); }, function (e) { yaz(hataYaz(e)); });
          });
          return f;
        }
        var p = h('p', { sinif: 'ms-metin' });
        window.MMMesajIstemci.parcala(m.metin).forEach(function (x) {
          p.appendChild(x.t === 'baglanti' ? h('a', { sinif: 'ms-link', href: x.v, target: '_blank', rel: 'noopener noreferrer', metin: x.v }) : document.createTextNode(x.v));
        });
        return p;
      }
      function ciz() {
        if (!canli || secili !== s) return; msj.textContent = '';
        msj.appendChild(h('div', { sinif: 'ms-sistem' }, [bilgiSatir()]));
        if (!mesajlar.length) msj.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Mesaj yok') }));
        var oncekiGun = '', oncekiKim = '';
        mesajlar.forEach(function (m, n) {
          var gun = gunEtiket(m.ts);
          if (gun && gun !== oncekiGun) { msj.appendChild(h('div', { sinif: 'ms-gun' }, [h('span', { metin: T(gun) })])); oncekiGun = gun; oncekiKim = ''; }
          var benim = !!benOid && m.gonderen === benOid;
          var ic = [];
          if (grup && !benim && m.gonderen !== oncekiKim) { var ga = uyeAd(m.gonderen) || T('Biri'); var gEl = h('span', { sinif: 'ms-gon', metin: ga }); gEl.style.color = avatarRengi(m.gonderen); ic.push(gEl); }
          oncekiKim = m.gonderen;
          ic.push(govdeEl(m));
          var meta = [h('span', { sinif: 'ms-zmn', metin: saatDk(m.ts) })];
          if (benim) { var oku = okunduMu(n); meta.push(h('span', { sinif: 'ms-tik' + (oku ? ' ms-tik-okundu' : ''), metin: oku ? '✓✓' : '✓', 'aria-label': oku ? T('Okundu') : T('Gönderildi') })); }
          ic.push(h('div', { sinif: 'ms-meta' }, meta));
          msj.appendChild(h('div', { sinif: 'ms-m' + (benim ? ' ms-ben' : ' ms-karsi') }, ic));
        });
        msj.scrollTop = msj.scrollHeight;   
      }
      function sonOkundu() { var son = mesajlar[mesajlar.length - 1]; if (son && son.gonderen !== benOid) i.okundu(s.id, son.id).then(null, function () {   }); }
      function ekle(m) { if (mesajlar.some(function (x) { return x.id === m.id; })) return; mesajlar.push(m); mesajlar = sirala(mesajlar); ciz(); sonOkundu(); }
      function sirala(l) { return l.slice().sort(function (a, b) { return epoch(a.ts) - epoch(b.ts) || 0; }); }
      var yenidenDugme = null;
      function yukle() {
        yaz(T('Yükleniyor'));
        i.mesajlar(s.id, { adet: 30 }).then(function (l) { yaz(''); if (!canli || secili !== s) return; mesajlar = sirala(l); ciz(); sonOkundu(); }, function (e) {
          if (!canli || secili !== s) return;
          yaz(e && e.kod === 'uye' ? T('Sohbet yüklenemedi') : hataYaz(e));
          if (!yenidenDugme) { yenidenDugme = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Yeniden dene') }); yenidenDugme.addEventListener('click', function () { yenidenDugme.parentNode && yenidenDugme.parentNode.removeChild(yenidenDugme); yenidenDugme = null; yukle(); }); durum.parentNode && durum.parentNode.insertBefore(yenidenDugme, durum.nextSibling); }
        });
      }
       
      cozucu.push(i.on('mesaj', function (m) { if (m.sohbet === s.id) ekle(m); }));
      cozucu.push(i.on('okundu', function (ev) { if (ev.sohbet === s.id) { okuyan[ev.oid] = ev.sonId; ciz(); } }));
      cozucu.push(i.on('yaziyor', function (ev) {
        if (ev.sohbet !== s.id || ev.oid === benOid) return;
        altYazi.textContent = (grup ? (uyeAd(ev.oid) || T('Biri')) + ' ' : '') + T('yazıyor…');
        clearTimeout(yaziyorZmn); yaziyorZmn = setTimeout(function () { if (canli) altYazi.textContent = grup ? (s.uyeler.length + ' ' + T('üye')) : ''; }, 4000);
      }));
      cozucu.push(function () { clearTimeout(yaziyorZmn); });
      kutu.addEventListener('input', function () {
        kutu.rows = Math.max(1, Math.min(5, kutu.value.split('\n').length));
        i.yaziyor(s.id).then(null, function () {   });
      });
      var gonderiyor = false;
      function gonder() {
        if (gonderiyor || !kutu.value.trim()) return;
        gonderiyor = true; gon.disabled = true;
        i.metinGonder(s.id, kutu.value).then(function (m) { gonderiyor = false; gon.disabled = false; kutu.value = ''; kutu.rows = 1; if (m) ekle(m); }, function (e) { gonderiyor = false; gon.disabled = false; yaz(hataYaz(e)); });
      }
      gon.addEventListener('click', gonder);
      kutu.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); gonder(); } });
      dosya.addEventListener('change', function () {
        var f = dosya.files && dosya.files[0]; dosya.value = ''; if (!f) return;
        yaz(T('Yükleniyor'));
        var foto = /^image\//.test(f.type);
        Promise.resolve(foto ? i.fotografTemizle({ ad: f.name, boyut: f.size, mime: f.type, veri: f }) : { ad: f.name, boyut: f.size, mime: f.type, veri: f })
          .then(function (d) { return i.dosyaYukle(s.id, d); })
          .then(function (m) { yaz(''); if (m) ekle(m); }, function (e) { yaz(hataYaz(e)); });
      });
      ciz(); yukle();
    }

     
    function durumDegisti() { if (canli && gorunum === 'liste') listeIc(); acilacaksa(); }
    function acilacaksa() { if (!bekleyenAc) return; var s = sohbetBul(bekleyenAc); if (s) { bekleyenAc = ''; sohbetGoster(s); } }
    D.dinleyen.push(durumDegisti);
    D.ac = function (id) { bekleyenAc = id; D.acilacak = ''; acilacaksa(); if (bekleyenAc && canli) listeYukle(); };

    listeGoster();
    acilacaksa();
    if (!D.basladi) i.baglan().then(null, function (e) { yaz(hataYaz(e)); });   
    listeYukle();
    if (D.kisiler === null) kisiYukle().then(null, function () {   });
    return function () {
      canli = false; cozucu.forEach(function (f) { f(); }); abonelik.forEach(function (f) { f(); });
      D.acikId = ''; D.ac = null; var ix = D.dinleyen.indexOf(durumDegisti); if (ix >= 0) D.dinleyen.splice(ix, 1);   
    };
  };
})();
