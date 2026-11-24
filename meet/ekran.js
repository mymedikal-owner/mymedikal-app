





(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var taklit = /[?&]taklit=1(&|$)/.test(location.search);
  var sag = null, sohbetId = '', ad = 'Katılımcı', mesgul = false, grupId = '', toplantiAdi = 'Toplantı';
  var oz = { mik: true, kam: true, mod: 'yeni' };          
  var kartlar = new Map();                                    
  var uyeler = new Map();                                     
  var gorunum = 'otomatik', sabit = '', konusan = '', yanAcik = '', elAcik = false, ekranAcik = false, bagliOldu = false;   
  var lobiGirisi = false, lobiAtla = false, yeniLink = '', lobiSira = 0;
  var odaKod = '', odaBilgi = null, onBilgi = null, planSon = null, planSecili = new Set(), planKisiler = [];   
  var KOD_RE = /^[A-Za-z0-9_-]{22}$/, KISA_RE = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/, ODA_LINK_RE = /#toplanti\/([A-Za-z0-9_-]{22})\s*$/;
  var taklitN = (function () { var m = /[?&]n=(\d+)/.exec(location.search); return m ? Math.max(0, Math.min(12, parseInt(m[1], 10))) : 2; })();
  var lobiBos = /[?&]bos=1(&|$)/.test(location.search);
  var saatZ = null, mesajZ = null, sohbetListe = null, adlar = {};
  var mq = window.matchMedia ? window.matchMedia('(max-width: 700px)') : null;
   
  var mqDar = window.matchMedia ? window.matchMedia('(max-width: 600px)') : null;
  var ovc = 0, videoVar = new Set(), secim = [], seritZ = null;   

  var HATA = {
    belirtec: 'Oturum alınamadı. Uygulamaya giriş yapıp bu sayfayı yenileyin.',
    ag: 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.',
    yetkisiz: 'Oturum geçersiz. Uygulamaya yeniden giriş yapın.',
    'uye-degil': 'Bu sohbetin üyesi değilsiniz.',
    yok: 'Toplantı bulunamadı ya da süresi doldu (katılma, başlangıçtan 2 saat sonra kapanır).',
    'cok-istek': 'Çok fazla deneme. Bir dakika sonra yeniden deneyin.',
    sunucu: 'Sunucu şu an yanıt vermiyor. Biraz sonra yeniden deneyin.',
    gecersiz: 'İstek geçersiz ya da sunucu beklenmeyen yanıt verdi.',
    sdk: 'Görüşme bileşeni (SDK) yüklenemedi. Sayfayı yenileyin.',
    'kamera-yok': 'Kamera bulunamadı ya da izin verilmedi.',
    bos: 'Boş mesaj gönderilemez.',
    uzun: 'Mesaj çok uzun (en çok 4000 karakter).'
  };
  var OZELLIK_AD = { ekran: 'Ekran paylaşımı', el: 'El kaldırma', tepki: 'Tepki' };
  var EMOJI = { like: '👍', love: '❤️', heart: '❤️', laugh: '😂', surprised: '😮', applause: '👏' };
  function T(a, k) { try { if (window.MeetKimlik && window.MeetKimlik.tani) window.MeetKimlik.tani(a, k); } catch (e) {   } }
  function hataMetni(e) { return HATA[e && e.kod] || ('Beklenmeyen hata: ' + String((e && e.message) || e).slice(0, 160)); }

   
  var NS = 'http://www.w3.org/2000/svg';
  var MIK = [['rect', { x: 9, y: 3, width: 6, height: 11, rx: 3 }], ['path', { d: 'M5 11a7 7 0 0 0 14 0M12 18v3' }]];
  var KAM = [['rect', { x: 3, y: 6, width: 12, height: 12, rx: 2 }], ['path', { d: 'M15 10.5l6-3.5v10l-6-3.5' }]];
  var KES = ['path', { d: 'M4 4l16 16' }];
  var IKON = {
    mik: MIK, mikkapali: MIK.concat([KES]), kam: KAM, kamkapali: KAM.concat([KES]),
    altyazi: [['rect', { x: 3, y: 5, width: 18, height: 14, rx: 2 }], ['path', { d: 'M7 11h4M13 11h4M7 15h6' }]],
    emoji: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M8.5 14c1 1.4 2.1 2 3.5 2s2.5-.6 3.5-2M9 9.5h.01M15 9.5h.01' }]],
    ekran: [['rect', { x: 3, y: 4, width: 18, height: 12, rx: 2 }], ['path', { d: 'M8 20h8M12 16v4' }]],
    el: [['path', { d: 'M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6 7-2.6 0-4.2-1.4-5.5-3.7L3.5 13a1.5 1.5 0 0 1 2.6-1.5L8 14' }]],
    uc: [['circle', { cx: 12, cy: 5, r: 1.7, 'class': 'dolu' }], ['circle', { cx: 12, cy: 12, r: 1.7, 'class': 'dolu' }], ['circle', { cx: 12, cy: 19, r: 1.7, 'class': 'dolu' }]],
    ayril: [['path', { d: 'M3.5 14.5c5-4.5 12-4.5 17 0l-1.6 3.2-3.4-1.3v-2.4c-2-.7-5-.7-7 0v2.4l-3.4 1.3z' }]],
    bilgi: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 11v5M12 8h.01' }]],
    kisi: [['circle', { cx: 9, cy: 8, r: 3.5 }], ['path', { d: 'M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a5 5 0 0 1 3 4.5v1' }]],
    sohbet: [['path', { d: 'M4 5h16v11H9l-5 4z' }]],
    kapat: [['path', { d: 'M6 6l12 12M18 6L6 18' }]],
    cevir: [['path', { d: 'M4 12a8 8 0 0 1 13.5-5.8L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.5 5.8L4 15.5M4 20v-4.5h4.5' }]],
    gonder: [['path', { d: 'M4 12l16-8-6 16-3-7z' }]],
    izgara: [['rect', { x: 3, y: 4, width: 8, height: 7, rx: 1 }], ['rect', { x: 13, y: 4, width: 8, height: 7, rx: 1 }], ['rect', { x: 3, y: 13, width: 8, height: 7, rx: 1 }], ['rect', { x: 13, y: 13, width: 8, height: 7, rx: 1 }]],
    konusmaci: [['rect', { x: 3, y: 4, width: 18, height: 11, rx: 1.5 }], ['rect', { x: 3, y: 17, width: 5, height: 3, rx: 1 }], ['rect', { x: 10, y: 17, width: 5, height: 3, rx: 1 }], ['rect', { x: 17, y: 17, width: 4, height: 3, rx: 1 }]],
    ayar: [['path', { d: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4' }]],
    arka: [['rect', { x: 3, y: 4, width: 18, height: 16, rx: 2 }], ['path', { d: 'M3 16l5-5 4 4 3-3 6 6' }]],
    hoparlor: [['path', { d: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11' }]],
    baglanti: [['path', { d: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1' }]],
    takvim: [['rect', { x: 3, y: 5, width: 18, height: 16, rx: 2 }], ['path', { d: 'M3 10h18M8 3v4M16 3v4' }]],
    klavye: [['rect', { x: 2.5, y: 6, width: 19, height: 12, rx: 2 }], ['path', { d: 'M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10' }]],
    kisiekle: [['circle', { cx: 9, cy: 8, r: 3.5 }], ['path', { d: 'M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M19 8v6M16 11h6' }]],
    otomatik: [['rect', { x: 3, y: 4, width: 18, height: 16, rx: 2 }], ['path', { d: 'M12 4v16M3 12h18' }]],
    spotlight: [['rect', { x: 3, y: 4, width: 18, height: 16, rx: 2 }], ['circle', { cx: 12, cy: 12, r: 3 }]],
    tamekran: [['path', { d: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5' }]],
    pin: [['path', { d: 'M9 4h6l-1 6 3 3H7l3-3zM12 13v7' }]]
  };
  function svgYap(adi) {
    var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    (IKON[adi] || []).forEach(function (e) {
      var n = document.createElementNS(NS, e[0]);
      Object.keys(e[1]).forEach(function (k) { n.setAttribute(k, String(e[1][k])); });
      s.appendChild(n);
    });
    return s;
  }
  function ikonYap(adi, sinif) { var sp = document.createElement('span'); sp.className = 'ikon' + (sinif ? ' ' + sinif : ''); sp.appendChild(svgYap(adi)); return sp; }
  function ikonDegistir(dugme, adi) { var sp = dugme.querySelector('.ikon'); if (sp) { sp.textContent = ''; sp.appendChild(svgYap(adi)); } }
  function ikonlariKur() { Array.from(document.querySelectorAll('[data-ikon]')).forEach(function (sp) { sp.appendChild(svgYap(sp.getAttribute('data-ikon'))); }); }

   
  function mesaj(metin, tur) {
    var m = $('mesaj');
    if (!metin) { m.hidden = true; m.textContent = ''; m.className = 'bant'; return; }
    m.textContent = metin; m.className = 'bant' + (tur === 'bilgi' ? ' bilgi' : ''); m.hidden = false;
    m.setAttribute('role', tur === 'bilgi' ? 'status' : 'alert');
  }
  function durumYaz(d) { $('durum').setAttribute('data-durum', d); $('durum-metin').textContent = 'Çağrı durumu: ' + d; }
  function katilimciYaz(n) {
    $('durum').setAttribute('data-katilimci', String(n));
    var k = $('katilimci-metin'); k.hidden = false; k.textContent = 'Karşı katılımcı: ' + n;
    $('kisi-sayi').textContent = String(n + 1);
  }
  function panel(adi) {
    ['panel-yok', 'panel-lobi', 'panel-onizleme', 'panel-bitti', 'sahne'].forEach(function (p) { $(p).hidden = p !== adi; });
    document.body.classList.toggle('koyu', adi === 'sahne');
  }
  function yokGoster(baslik, metin, baglanti) {
    $('yok-baslik').textContent = baslik; $('yok-metin').textContent = metin;
    $('yok-baglanti').hidden = !baglanti;
    panel('panel-yok');
  }
  function tost(metin) {
    var alan = $('tost-alan'), t = document.createElement('div'); t.className = 'tost'; t.textContent = metin;
    alan.appendChild(t);
    while (alan.children.length > 4) alan.removeChild(alan.firstChild);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3500);
  }
  function bas(s) { return (s || '?').trim().charAt(0).toUpperCase() || '?'; }
  function renkNo(s) { var h = 0; for (var i = 0; i < (s || '').length; i++) h = (h * 31 + s.charCodeAt(i)) % 6; return h; }
  function mobil() { return !!(mq && mq.matches); }

   
  function kartYap(key, adMetni, yerel) {
    var var0 = kartlar.get(key);
    if (var0) { var0.adEl.textContent = adMetni + (yerel ? ' (Siz)' : ''); var0.bas.textContent = bas(adMetni); return var0; }
    var kart = document.createElement('div'); kart.className = 'kart av' + renkNo(adMetni); kart.setAttribute('data-kart', key);
    var gor = document.createElement('div'); gor.className = 'goruntu';
    var b = document.createElement('div'); b.className = 'bas'; b.textContent = bas(adMetni); gor.appendChild(b);
    var el = document.createElement('div'); el.className = 'el-ikon'; el.hidden = true; el.setAttribute('title', 'Elini kaldırdı'); el.appendChild(ikonYap('el'));
    var tepki = document.createElement('div'); tepki.className = 'tepkiler';
    var et = document.createElement('div'); et.className = 'etiket';
    var a = document.createElement('span'); a.className = 'ad'; a.textContent = adMetni + (yerel ? ' (Siz)' : ''); et.appendChild(a);
    var mk = ikonYap('mikkapali', 'mikkapali'); mk.hidden = true; mk.setAttribute('title', 'Mikrofon kapalı'); et.appendChild(mk);
    kart.appendChild(gor); kart.appendChild(el); kart.appendChild(tepki); kart.appendChild(et);
    if (key !== 'ben' && key.indexOf('ekran:') !== 0) {
      var pn = document.createElement('button'); pn.type = 'button'; pn.className = 'pin-dugme'; pn.appendChild(ikonYap('pin'));
      pn.addEventListener('click', function (e) { e.stopPropagation(); sabitle(key); });
      kart.appendChild(pn);
    }
    var o = { kart: kart, goruntu: gor, adEl: a, bas: b, mikEl: mk, elEl: el, tepkiEl: tepki };
    kartlar.set(key, o);
    duzenle();
    return o;
  }
  function kartSil(key) { var k = kartlar.get(key); if (k) { k.kart.remove(); kartlar.delete(key); if (sabit === key) sabit = ''; duzenle(); } }
  function pinUi() {
    kartlar.forEach(function (o, key) {
      var b = o.kart.querySelector('.pin-dugme'); if (!b) return;
      var s = key === sabit, t = s ? 'Sabitlemeyi kaldır' : 'Sabitle';
      b.setAttribute('aria-pressed', s ? 'true' : 'false'); b.setAttribute('aria-label', t); b.setAttribute('title', t); b.classList.toggle('aktif', s);
      o.kart.classList.toggle('sabit', s);
    });
  }
  function sabitle(key) { sabit = sabit === key ? '' : key; pinUi(); secimGuncelle(); duzenle(); }
  function videoKoy(key, element) {
    var k = kartlar.get(key); if (!k) return;
    Array.from(k.goruntu.querySelectorAll('[data-video]')).forEach(function (n) { n.remove(); });
    if (element) {
      var kap = document.createElement('div'); kap.className = 'video'; kap.setAttribute('data-video', '1'); kap.appendChild(element);
      k.goruntu.appendChild(kap); k.bas.hidden = true;
    } else { k.bas.hidden = false; }
  }
  function yerlestir(kap, liste) {
    liste.forEach(function (key, i) {
      var o = kartlar.get(key); if (!o) return;
      if (kap.children[i] !== o.kart) kap.insertBefore(o.kart, kap.children[i] || null);
    });
  }
  function izgaraSinif(n) {
    var m = mobil(), c = n <= 1 ? 1 : n === 2 ? (m ? 1 : 2) : n <= 4 ? 2 : n <= 9 ? (m ? 2 : 3) : (m ? 2 : 4);
    var r = Math.ceil(n / c);
    return 'izgara c' + c + (r > 6 ? ' cok' : ' r' + r) + (n === 1 ? ' tek' : '');
  }
  function videoSiniri() {
    var ust = (mqDar && mqDar.matches) ? 4 : 16;
    return Math.max(1, ovc > 0 ? Math.min(ovc, ust) : ust);
  }
   
  function secimGuncelle() {
    var onceki = secim.join(','), lim = videoSiniri();
    secim = secim.filter(function (id) { return videoVar.has(id) && kartlar.has(id); });
    var aday = Array.from(videoVar).filter(function (id) { return kartlar.has(id); });
    if (konusan && konusan !== 'ben' && aday.indexOf(konusan) >= 0 && secim.indexOf(konusan) < 0) secim.unshift(konusan);
    if (sabit && aday.indexOf(sabit) >= 0 && secim.indexOf(sabit) < 0) secim.unshift(sabit);
    aday.forEach(function (id) { if (secim.length < lim && secim.indexOf(id) < 0) secim.push(id); });
    while (secim.length > lim) {
      var at = -1;
      for (var i = secim.length - 1; i >= 0; i--) if (secim[i] !== konusan && secim[i] !== sabit) { at = i; break; }
      secim.splice(at < 0 ? secim.length - 1 : at, 1);
    }
    if (secim.join(',') !== onceki && sag && sag.gorunecek) { try { sag.gorunecek(secim.slice()); } catch (e) {   } }
    if (secim.join(',') !== onceki) duzenle();
  }
  function katilimSeridi(metin) {
    var kap = $('izgara-kap'); if (!kap || !metin) return;
    var s = $('katilim-serit');
    if (!s) { s = document.createElement('div'); s.id = 'katilim-serit'; s.className = 'katilim-serit'; s.setAttribute('role', 'status'); s.setAttribute('aria-live', 'polite'); kap.appendChild(s); }
    s.textContent = metin; s.hidden = false;
    clearTimeout(seritZ);
    seritZ = setTimeout(function () { s.hidden = true; s.textContent = ''; }, 4000);
  }
  function duzenle() {
    var anahtarlar = Array.from(kartlar.keys());
    var uzaklar = anahtarlar.filter(function (k) { return k !== 'ben' && k.indexOf('ekran:') !== 0; });
    uzaklar = secim.filter(function (k) { return uzaklar.indexOf(k) >= 0; }).concat(uzaklar.filter(function (k) { return secim.indexOf(k) < 0; }));   
    var ekranK = anahtarlar.filter(function (k) { return k.indexOf('ekran:') === 0; })[0] || '';
    var sabitK = sabit && uzaklar.indexOf(sabit) >= 0 ? sabit : '';
    var buyukDuzen = gorunum === 'konusmaci' || gorunum === 'spotlight';
    var anaMod = !!ekranK || !!sabitK || (buyukDuzen && uzaklar.length > 0);
    var kendi = $('kendi');
    if (!anaMod) {
      $('ana-mod').hidden = true; $('izgara').hidden = false;
      var liste = uzaklar.length ? uzaklar : (kartlar.has('ben') ? ['ben'] : []);
      yerlestir($('izgara'), liste);
      $('izgara').className = izgaraSinif(liste.length || 1);
      if (uzaklar.length && kartlar.has('ben')) yerlestir(kendi, ['ben']);
    } else {
      $('izgara').hidden = true; $('ana-mod').hidden = false;
      var ana = ekranK || sabitK || (kartlar.has(konusan) && konusan !== 'ben' ? konusan : uzaklar[0]);
      var serit = gorunum === 'spotlight' && !ekranK ? [] : uzaklar.filter(function (k) { return k !== ana; });
      yerlestir($('ana'), [ana]);
      yerlestir($('serit'), serit);
      if (!serit.length) yerlestir($('izgara'), uzaklar.filter(function (k) { return k !== ana; }));   
      $('ana-mod').className = 'ana-mod' + (serit.length ? '' : ' serit-yok');
      if (kartlar.has('ben')) yerlestir(kendi, ['ben']);
    }
  }
  function konusanIsaretle(id) {
    konusan = id || '';
    kartlar.forEach(function (o, key) { o.kart.classList.toggle('konusuyor', key === konusan); });
    secimGuncelle();
    if ((gorunum === 'konusmaci' || gorunum === 'spotlight') && !sabit) duzenle();
  }
  function mikGoster(key, acik) { var k = kartlar.get(key); if (k) k.mikEl.hidden = !!acik; }
  function elGoster(key, acik) { var k = kartlar.get(key); if (k) k.elEl.hidden = !acik; }
  function tepkiGoster(key, emoji) {
    var k = kartlar.get(key); if (!k || !emoji) return;
    var u = document.createElement('span'); u.className = 'ucan l' + Math.floor(Math.random() * 5); u.textContent = emoji;
    k.tepkiEl.appendChild(u);
    setTimeout(function () { if (u.parentNode) u.parentNode.removeChild(u); }, 2800);
  }

   
  function uyeYaz(id, adMetni) { var u = uyeler.get(id) || { ad: adMetni, mik: true, el: false }; if (adMetni) u.ad = adMetni; uyeler.set(id, u); listeCiz(); }
  function listeCiz() {
    var ul = $('kisi-liste'); ul.textContent = '';
    var sira = Array.from(uyeler.keys()).sort(function (a, b) { return a === 'ben' ? -1 : b === 'ben' ? 1 : 0; });
    $('kisi-toplam').textContent = '(' + sira.length + ')';
    var ara = ($('kisi-ara').value || '').trim().toLocaleLowerCase('tr');
    sira.forEach(function (id) {
      var u = uyeler.get(id), li = document.createElement('li');
      if (ara && (u.ad || '').toLocaleLowerCase('tr').indexOf(ara) < 0) return;
      var b = document.createElement('span'); b.className = 'kisi-bas'; b.textContent = bas(u.ad);
      var a = document.createElement('span'); a.className = 'kisi-ad'; a.textContent = u.ad + (id === 'ben' ? ' (Siz)' : '');
      li.appendChild(b); li.appendChild(a);
      if (u.el) { var e = ikonYap('el', 'el'); e.setAttribute('title', 'Elini kaldırdı'); li.appendChild(e); }
      var m = ikonYap(u.mik ? 'mik' : 'mikkapali', u.mik ? '' : 'uyari'); m.setAttribute('title', u.mik ? 'Mikrofon açık' : 'Mikrofon kapalı'); li.appendChild(m);
      ul.appendChild(li);
    });
  }

   
  function mikUi(dugme, acik) {
    dugme.setAttribute('aria-pressed', acik ? 'true' : 'false');
    var t = acik ? 'Mikrofonu kapat' : 'Mikrofonu aç'; dugme.setAttribute('aria-label', t); dugme.setAttribute('title', t);
    dugme.classList.toggle('kapali', !acik); ikonDegistir(dugme, acik ? 'mik' : 'mikkapali');
  }
  function kamUi(dugme, acik) {
    dugme.setAttribute('aria-pressed', acik ? 'true' : 'false');
    var t = acik ? 'Kamerayı kapat' : 'Kamerayı aç'; dugme.setAttribute('aria-label', t); dugme.setAttribute('title', t);
    dugme.classList.toggle('kapali', !acik); ikonDegistir(dugme, acik ? 'kam' : 'kamkapali');
  }
  function elUi() {
    var b = $('b-el'); b.setAttribute('aria-pressed', elAcik ? 'true' : 'false'); b.classList.toggle('aktif', elAcik);
    var t = elAcik ? 'Elini indir' : 'Elini kaldır'; b.setAttribute('aria-label', t); b.setAttribute('title', t);
    $('m-el').lastChild.textContent = t;
  }
  function ekranUi() {
    var b = $('b-ekran'); b.setAttribute('aria-pressed', ekranAcik ? 'true' : 'false'); b.classList.toggle('aktif', ekranAcik);
    var t = ekranAcik ? 'Paylaşımı durdur' : 'Ekranı paylaş'; b.setAttribute('aria-label', t); b.setAttribute('title', t);
    $('m-ekran').lastChild.textContent = t;
  }
  function gorunumUi() {
    [['m-otomatik', 'otomatik'], ['m-izgara', 'izgara'], ['m-spotlight', 'spotlight'], ['m-konusmaci', 'konusmaci']].forEach(function (p) {
      $(p[0]).setAttribute('aria-checked', gorunum === p[1] ? 'true' : 'false');
    });
  }
  function saatYaz() { try { $('saat').textContent = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { $('saat').textContent = '--:--'; } }

   
  function acilirKapat() {
    [['b-tepki', 'tepki-panel'], ['b-uc', 'menu']].forEach(function (p) { $(p[1]).hidden = true; $(p[0]).setAttribute('aria-expanded', 'false'); });
  }
  function acilirDegistir(dugme, pnl) {
    var ac0 = $(pnl).hidden; acilirKapat();
    if (ac0) { $(pnl).hidden = false; $(dugme).setAttribute('aria-expanded', 'true'); }
  }
  var YAN = { kisiler: ['Katılımcılar', 'yan-kisiler', 'b-kisiler'], sohbet: ['Toplantı içi sohbet', 'yan-sohbet', 'b-sohbet'], bilgi: ['Toplantı bilgisi', 'yan-bilgi', 'b-bilgi'] };
  function yanKapat() {
    yanAcik = ''; $('yan').hidden = true;
    Object.keys(YAN).forEach(function (k) { $(YAN[k][1]).hidden = true; $(YAN[k][2]).setAttribute('aria-pressed', 'false'); $(YAN[k][2]).classList.remove('secili'); });
    mesajPlanla();
  }
  function yanAc(adi) {
    acilirKapat();
    if (yanAcik === adi) { yanKapat(); return; }
    yanKapat(); yanAcik = adi;
    $('yan').hidden = false; $('yan-baslik').textContent = YAN[adi][0]; $(YAN[adi][1]).hidden = false;
    $(YAN[adi][2]).setAttribute('aria-pressed', 'true'); $(YAN[adi][2]).classList.add('secili');
    if (adi === 'kisiler') listeCiz();
    if (adi === 'sohbet') { gorulduIsaretle(); mesajCek(); setTimeout(function () { try { $('msg-giris').focus(); } catch (e) {   } }, 0); }
    mesajPlanla();
  }

  




  var aktifAramaId = '';
  var CAGRI_MS = 45000, DAVET_MAKS = 200;
  var cagriyok = /[?&]cagriyok=1(&|$)/.test(location.search);
  var davetKisiler = null, davetYukleniyor = false, davetCagri = new Map();   
  function davetSon(d) { var b = $('davet-bolum'); if (b) b.setAttribute('data-cagri-son', d || ''); }
  var davetNesil = 0;   
  function davetSifirla() {
    davetNesil++;
    davetCagri.forEach(function (r) { clearTimeout(r.zaman); });
    davetCagri = new Map(); davetKisiler = null; davetYukleniyor = false;
    var b = $('davet-bolum'); if (!b) return;
    b.hidden = true; b.removeAttribute('data-cagri-son');
    $('davet-liste').textContent = ''; $('davet-durum').hidden = true; $('davet-hata').hidden = true;
    var ka = $('kisi-ara'); if (ka) ka.value = '';
  }
  function davetDurumMetni(d) { return d === 'bekliyor' ? 'Gönderiliyor…' : d === 'caliyor' ? 'Çalıyor…' : d === 'davet' ? 'Davet gönderildi' : d === 'cevapsiz' ? 'Cevap yok' : ''; }
  function davetCiz() {
    var ul = $('davet-liste'); ul.textContent = '';
    if (!davetKisiler) return;
    var ara = ($('kisi-ara').value || '').trim().toLocaleLowerCase('tr'), n = 0;
    davetKisiler.forEach(function (k) {
      if (n >= DAVET_MAKS) return;
      if (ara && (k.ad || '').toLocaleLowerCase('tr').indexOf(ara) < 0) return;
      n++;
      var r = davetCagri.get(k.oid), d = r ? r.durum : 'hazir';
      var li = document.createElement('li'); li.setAttribute('data-oid', k.oid); li.setAttribute('data-durum', d);
      var b = document.createElement('span'); b.className = 'kisi-bas'; b.textContent = bas(k.ad);
      if (k.cevrimici) { var nk = document.createElement('span'); nk.className = 'cevrimici-nokta'; nk.setAttribute('title', 'Çevrimiçi'); b.appendChild(nk); }
      var a = document.createElement('span'); a.className = 'kisi-ad'; a.textContent = k.ad || 'Kişi';
      li.appendChild(b); li.appendChild(a);
      if (r) { var st = document.createElement('span'); st.className = 'davet-durum-metin'; st.textContent = davetDurumMetni(d); li.appendChild(st); }
      var dg = document.createElement('button'); dg.type = 'button'; dg.className = 'davet-dugme';
      dg.textContent = d === 'cevapsiz' ? 'Yeniden çağır' : d === 'davet' ? 'Yeniden davet et' : 'Çağır';
      dg.disabled = d === 'caliyor' || d === 'bekliyor';
      dg.setAttribute('aria-label', (k.ad || 'Kişi') + ' kişisini çağır');
      dg.addEventListener('click', function () { kisiCagir(k); });
      li.appendChild(dg); ul.appendChild(li);
    });
    if (!n) { var l0 = document.createElement('li'); l0.className = 'kucuk'; l0.textContent = davetKisiler.length ? 'Eşleşen kişi yok.' : 'Çağrılacak kişi yok.'; ul.appendChild(l0); }
  }
  async function davetYukle() {
    if (davetYukleniyor) return;
    davetYukleniyor = true; $('davet-hata').hidden = true;
    var nesil = davetNesil;
    try {
      var kl, cv;
      if (taklit) {
        kl = []; for (var i = 1; i <= 6; i++) kl.push({ oid: 'dk' + i, ad: 'Deneme Kişi ' + i });
        cv = { acik: true, kisiler: [{ id: 'dk5' }, { id: 'dk2' }] };
      } else {
        var s = await Promise.all([window.MeetApi.kisiler(), window.MeetApi.cevrimiciKisiler().catch(function () { return { acik: false, kisiler: [] }; })]);
        kl = s[0]; cv = s[1];
      }
      if (nesil !== davetNesil) return;
      var ben = benOid(), on = new Set((cv && cv.acik ? cv.kisiler : []).map(function (p) { return p.id; }));
      var liste = (kl || []).filter(function (k) { return k && typeof k.oid === 'string' && k.oid && k.oid !== ben; })
        .map(function (k) { return { oid: k.oid, ad: typeof k.ad === 'string' ? k.ad : '', cevrimici: on.has(k.oid) }; });
      var ada = function (x, y) { return (x.ad || '').localeCompare(y.ad || '', 'tr'); };
      davetKisiler = liste.filter(function (k) { return k.cevrimici; }).sort(ada).concat(liste.filter(function (k) { return !k.cevrimici; }).sort(ada));
      davetCiz();
    } catch (e) {
      if (nesil !== davetNesil) return;
      davetKisiler = null; $('davet-liste').textContent = ''; $('davet-hata').hidden = false;
    }
    if (nesil === davetNesil) davetYukleniyor = false;
  }
  function davetKaydet(oid, durum) {
    var eski = davetCagri.get(oid); if (eski) clearTimeout(eski.zaman);
    var r = { durum: durum, zaman: null };
    if (durum === 'caliyor') {   
      r.zaman = setTimeout(function () {
        if (davetCagri.get(oid) !== r) return;
        r.durum = 'cevapsiz'; r.zaman = null; davetSon('cevapsiz');
        if (!$('davet-bolum').hidden) davetCiz();
      }, CAGRI_MS);
    }
    davetCagri.set(oid, r); davetSon(durum);
    if (!$('davet-bolum').hidden) davetCiz();
  }
  async function kisiCagir(k) {
    if (!k || !k.oid) return;
    var r = davetCagri.get(k.oid); if (r && (r.durum === 'caliyor' || r.durum === 'bekliyor')) return;   
    var nesil = davetNesil, odaK = odaKod, bek = { durum: 'bekliyor', zaman: null };
    if (r) clearTimeout(r.zaman);
    davetCagri.set(k.oid, bek); if (!$('davet-bolum').hidden) davetCiz();   
    function birak() { if (nesil === davetNesil && davetCagri.get(k.oid) === bek) { davetCagri.delete(k.oid); if (!$('davet-bolum').hidden) davetCiz(); } }
    var yok = false;
    try {
      if (taklit) { if (cagriyok) { yok = true; } }
      else if (odaK) await window.MeetApi.toplantiCagir(odaK, k.oid);
      else {
        if (sohbetId && !aktifAramaId && grupId) { try { var a = await window.MeetApi.aramaSon(sohbetId); if (a && a.groupId === grupId) aktifAramaId = a.aramaId || ''; } catch (e0) {   } }
        if (!sohbetId || !aktifAramaId) yok = true;
        else await window.MeetApi.aramaCagir(sohbetId, aktifAramaId, k.oid);
      }
    } catch (e) {
      if (nesil !== davetNesil) return;
      if (e && e.kod === 'uc_yok') yok = true;
      else { birak(); davetSon('hata'); tost(hataMetni(e)); return; }
    }
    if (nesil !== davetNesil) return;
    if (!yok) { davetKaydet(k.oid, 'caliyor'); return; }
    if (odaK || (taklit && !sohbetId)) {   
      try { if (!taklit) await window.MeetApi.toplantiDavet(odaK, [k.oid]); if (nesil !== davetNesil) return; davetKaydet(k.oid, 'davet'); return; }
      catch (e2) { if (nesil !== davetNesil) return; birak(); davetSon('hata'); tost(hataMetni(e2)); return; }
    }
    birak(); davetSon('uc_yok'); tost('Çağrı şu an gönderilemedi. Bağlantıyı paylaşın.');
  }
  function davetAcKapa() {
    var b = $('davet-bolum'), ac0 = b.hidden;
    b.hidden = !ac0;
    $('kisi-ekle').setAttribute('aria-expanded', ac0 ? 'true' : 'false');
    if (ac0) { if (!davetKisiler) davetYukle(); else davetCiz(); try { $('kisi-ara').focus(); } catch (e) {   } }
  }

   
  var sohbetMsg = [], taklitMsg = [], gorulenId = '', ilkCekim = true, mesajHata = false;
  function zaman(m) { return typeof m.ts === 'number' ? m.ts : (Date.parse(m.ts) || 0); }
  function benOid() { return taklit ? 'ben-t' : (window.MeetKimlik ? window.MeetKimlik.oid() : ''); }
  function mesajSirala(l) { return l.slice().sort(function (a, b) { return zaman(a) - zaman(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); }); }
  function okunmamis() {
    if (!sohbetMsg.length) return 0;
    var ben = benOid(), n = 0, say = !gorulenId;
    for (var i = 0; i < sohbetMsg.length; i++) {
      var m = sohbetMsg[i];
      if (say && m.gonderen !== ben) n++;
      if (m.id === gorulenId) say = true;
    }
    return gorulenId ? n : 0;
  }
  function gorulduIsaretle() { if (sohbetMsg.length) gorulenId = sohbetMsg[sohbetMsg.length - 1].id; rozetYaz(); }
  function rozetYaz() { var n = yanAcik === 'sohbet' ? 0 : okunmamis(); var r = $('sohbet-rozet'); r.hidden = n < 1; r.textContent = String(n); }
  function mesajCiz() {
    var ul = $('msg-liste'), dipte = ul.scrollHeight - ul.scrollTop - ul.clientHeight < 40;
    ul.textContent = '';
    var ben = benOid();
    sohbetMsg.forEach(function (m) {
      var li = document.createElement('li');
      var u = document.createElement('div'); u.className = 'msg-ust';
      var kim = m.gonderen === ben ? 'Siz' : (adlar[m.gonderen] || 'Kişi');
      var z = zaman(m); var saat = z ? new Date(z).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '';
      u.textContent = kim + (saat ? ' · ' + saat : '');
      var t = document.createElement('div'); t.className = 'msg-metin';
      t.textContent = m.tur === 'metin' || !m.tur ? m.metin : ('[' + m.tur + ']' + (m.metin ? ' ' + m.metin : ''));
      li.appendChild(u); li.appendChild(t); ul.appendChild(li);
    });
    if (dipte) ul.scrollTop = ul.scrollHeight;
  }
  async function mesajCek() {
    if (!sohbetId || $('sahne').hidden) return;
    try {
      var l = taklit ? taklitMsg.slice() : await window.MeetApi.mesajlar(sohbetId, 50);
      var s = mesajSirala(l);
      var degisti = s.length !== sohbetMsg.length || (s.length && s[s.length - 1].id !== sohbetMsg[sohbetMsg.length - 1].id);
      sohbetMsg = s;
      if (ilkCekim) { ilkCekim = false; if (s.length) gorulenId = s[s.length - 1].id; }
      if (mesajHata) { mesajHata = false; $('msg-bos').hidden = true; }
      if (degisti || !$('msg-liste').children.length) mesajCiz();
      if (yanAcik === 'sohbet') gorulduIsaretle(); else rozetYaz();
    } catch (e) {
      if (!mesajHata) { mesajHata = true; $('msg-bos').textContent = 'Mesajlar alınamadı (' + hataMetni(e) + ')'; $('msg-bos').hidden = false; }
    }
  }
  function mesajPlanla() {
    clearTimeout(mesajZ); mesajZ = null;
    if ($('sahne').hidden || !sohbetId) return;
    mesajZ = setTimeout(async function () { await mesajCek(); mesajPlanla(); }, yanAcik === 'sohbet' ? 5000 : 15000);
  }
  async function adlariYukle() {
    if (taklit) { adlar = { k1: 'Katılımcı 1', k2: 'Katılımcı 2' }; return; }
    try { (await window.MeetApi.kisiler()).forEach(function (k) { adlar[k.oid] = k.ad; }); } catch (e) {   }
  }
  async function mesajGonder(metin) {
    var t = String(metin || '').trim(); if (!t) return;
    var b = $('msg-gonder'); b.disabled = true;
    try {
      if (taklit) taklitMsg.push({ id: 'tm' + Date.now(), gonderen: 'ben-t', ts: Date.now(), tur: 'metin', metin: t });
      else await window.MeetApi.mesajGonder(sohbetId, t);
      $('msg-giris').value = '';
      await mesajCek();
    } catch (e) { tost('Mesaj gönderilemedi: ' + hataMetni(e)); }
    b.disabled = false;
  }
  function sohbetBaslat() {
    sohbetMsg = []; ilkCekim = true; gorulenId = ''; mesajHata = false; $('msg-liste').textContent = ''; $('msg-bos').hidden = true; rozetYaz();
    if (taklit) {
      taklitMsg = [{ id: 'tm0', gonderen: 'k1', ts: Date.now() - 60000, tur: 'metin', metin: 'Toplantıya katılın (taklit bağlantı)' }];
      setTimeout(function () { if (!$('sahne').hidden) taklitMsg.push({ id: 'tm1', gonderen: 'k2', ts: Date.now(), tur: 'metin', metin: 'Merhaba, sesim geliyor mu?' }); }, 9000);
    }
    adlariYukle().then(mesajCek).then(mesajPlanla);
  }

   
  function saglayiciKur() {
    if (sag) { try { sag.temizle(); } catch (e0) {   } }
    sag =window.MeetSaglayici.olustur(taklit ? 'taklit' : 'acs');
    sag.dinle('durum', function (v) {
      durumYaz(v.durum);
      if (v.durum === 'Connecting') { if (!(zil && !zil.cevap)) mesaj('Bağlanıyor…', 'bilgi'); }   
      else if (v.durum === 'Connected') { bagliOldu = true; if ($('mesaj').classList.contains('bilgi')) mesaj(''); }
    });
    sag.dinle('katilimci', function (v) { katilimciYaz(v.sayi); zilKatilimci(Number(v.sayi) || 0); });
    sag.dinle('katilimciEkle', function (v) {
      kartYap(v.id, v.ad, false); uyeYaz(v.id, v.ad);
    });
    sag.dinle('katilimciCikar', function (v) {
      kartSil(v.id); kartSil('ekran:' + v.id); uyeler.delete(v.id); listeCiz();
      videoVar.delete(v.id); secimGuncelle();
      if (konusan === v.id) konusanIsaretle('');
    });
    sag.dinle('katilimHaber', function (v) { if (v && v.ad) katilimSeridi(String(v.ad).slice(0, 60) + (v.tur === 'ayrildi' ? ' ayrıldı' : ' katıldı')); });
    sag.dinle('optimalVideoCount', function (v) { var n = Number(v && v.sayi); ovc = n > 0 ? Math.floor(n) : 0; secimGuncelle(); });
    sag.dinle('videoMevcut', function (v) { if (v.var) videoVar.add(v.id); else videoVar.delete(v.id); secimGuncelle(); });
    sag.dinle('uzakVideo', function (v) { videoKoy(v.id, v.element); });
    sag.dinle('yerelVideo', function (v) { videoKoy('ben', v.element); });
    sag.dinle('onizlemeVideo', function (v) {
      var kap = $('onizleme-video'); kap.textContent = '';
      if (v.element) kap.appendChild(v.element);
      $('onizleme-bos').hidden = !!v.element;
    });
    sag.dinle('ekranPaylasimi', function (v) {
      if (v.id === 'ben') {
        var yeniAcik = !!v.acik; if (yeniAcik !== ekranAcik) tost(yeniAcik ? 'Ekranınızı paylaşıyorsunuz' : 'Ekran paylaşımı durdu');
        ekranAcik = yeniAcik; ekranUi(); return;
      }
      var key = 'ekran:' + v.id;
      if (v.element) {
        var u = uyeler.get(v.id), o = kartYap(key, (u ? u.ad : 'Katılımcı') + ' sunuyor', false);
        o.kart.classList.add('ekran-kart'); o.kart.classList.remove('av0', 'av1', 'av2', 'av3', 'av4', 'av5');
        videoKoy(key, v.element); tost((u ? u.ad : 'Bir katılımcı') + ' ekranını paylaşıyor');
      } else { kartSil(key); }
    });
    sag.dinle('mikrofon', function (v) { mikUi($('b-mik'), v.acik); mikGoster('ben', v.acik); var u = uyeler.get('ben'); if (u) { u.mik = !!v.acik; listeCiz(); } });
    sag.dinle('kamera', function (v) { kamUi($('b-kam'), v.acik); });
    sag.dinle('kameraYonu', function () { cihazlariDoldur(); });
    sag.dinle('mikrofonDurumu', function (v) { mikGoster(v.id, v.acik); var u = uyeler.get(v.id); if (u) { u.mik = !!v.acik; listeCiz(); } });
    sag.dinle('elKalkti', function (v) {
      var u = uyeler.get(v.id); if (u) { u.el = !!v.acik; listeCiz(); }
      elGoster(v.id, v.acik);
      if (v.id === 'ben') { elAcik = !!v.acik; elUi(); }
      else if (v.acik && u) tost(u.ad + ' elini kaldırdı');
    });
    sag.dinle('tepki', function (v) { tepkiGoster(v.id, EMOJI[v.tur]); });
    sag.dinle('konusan', function (v) { konusanIsaretle(v.id); });
    sag.dinle('desteklenmiyor', function (v) { tost((OZELLIK_AD[v.ozellik] || 'Bu özellik') + ' bu görüşmede/cihazda desteklenmiyor.'); });
    sag.dinle('hata', function (v) { mesaj(v.mesaj); });
    sag.dinle('ayrildi', function () { zilAyrildi(); bittiGoster(); });
  }

  function sahneSifirla() {
    kartlar.forEach(function (o) { o.kart.remove(); }); kartlar.clear(); uyeler.clear();
    ['izgara', 'ana', 'serit', 'kendi'].forEach(function (i) { $(i).textContent = ''; });
    gorunum = 'otomatik'; sabit = ''; konusan = ''; elAcik = false; ekranAcik = false; bagliOldu = false;
    videoVar.clear(); secim = []; ovc = 0; clearTimeout(seritZ); var ks = $('katilim-serit'); if (ks) { ks.hidden = true; ks.textContent = ''; }
    gorunumUi(); elUi(); ekranUi(); yanKapat(); acilirKapat(); davetSifirla(); $('tost-alan').textContent = '';
    $('toplanti-adi').textContent = toplantiAdi; $('izgara').className = 'izgara c1 r1 tek';
  }
  async function cagriyaGir(bilgi) {
    mesaj('');
    sahneSifirla(); katilimciYaz(0); durumYaz('Connecting');
    kartYap('ben', ad, true); uyeYaz('ben', ad);
    mikUi($('b-mik'), oz.mik); kamUi($('b-kam'), oz.kam); mikGoster('ben', oz.mik);
    var u = uyeler.get('ben'); if (u) u.mik = oz.mik;
    panel('sahne'); saatYaz(); clearInterval(saatZ); saatZ = setInterval(saatYaz, 20000);
    try {
      await sag.baglan({ groupId: bilgi.groupId, acsToken: bilgi.acsToken, acsUserId: bilgi.acsUserId, ad: ad, kameraAcik: oz.kam, mikrofonAcik: oz.mik });
    } catch (e) { T('hata_kodu', e && e.kod); mesaj(hataMetni(e)); durumYaz('Hata'); try { await sag.temizle(); } catch (e2) {   } panel('panel-onizleme'); throw e; }
    grupId = bilgi.groupId; T('katildi');
    var link = odaKod ? window.MeetApi.odaBaglantisi(odaKod) : (window.MeetApi && window.MeetApi.baglantiOlustur ? window.MeetApi.baglantiOlustur(sohbetId, bilgi.groupId) : '');
    $('baglanti').value = link;
    sohbetBaslat();
  }
  function bittiGoster() {
    clearInterval(saatZ); saatZ = null; clearTimeout(mesajZ); mesajZ = null;
    aktifAramaId = ''; davetSifirla();
     
    var aramaBitti = !!(zil && !zil.gelen);
    $('bitti-baslik').textContent = zil ? (ZIL_METIN[zil.sonuc] || 'Arama bitti') : 'Toplantıdan ayrıldınız';
    $('b-tekrar').textContent = aramaBitti ? 'Yeniden ara' : 'Yeniden katıl';
    $('b-lobiye').hidden = !!zil;
    if (zil) caliyor('');
    if ($('panel-bitti').hidden) {
      acilirKapat(); mesaj(''); panel('panel-bitti'); window.MeetKimlik.kapat();
      Array.from(document.querySelectorAll('.puan-d')).forEach(function (x) { x.classList.remove('secili'); }); $('puan-tesekkur').hidden = true;
      try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {   }
    }
  }

   
  function selDoldur(sel, liste, secili, bos) {
    sel.textContent = '';
    if (!liste || !liste.length) { var o0 = document.createElement('option'); o0.value = ''; o0.textContent = bos; sel.appendChild(o0); sel.disabled = true; return; }
    sel.disabled = false;
    liste.forEach(function (c) { var o = document.createElement('option'); o.value = c.id; o.textContent = c.ad; if (c.id === secili) o.selected = true; sel.appendChild(o); });
  }
  var SEL = [
    ['o-kamera-sec', 'kamera'], ['o-mik-sec', 'mikrofon'], ['o-hop-sec', 'hoparlor'],
    ['a-kamera-sec', 'kamera'], ['a-mik-sec', 'mikrofon'], ['a-hop-sec', 'hoparlor']
  ];
  async function cihazlariDoldur() {
    if (!sag) return;
    var c; try { c = await sag.cihazlar(); } catch (e) { return; }
    var harita = { kamera: [c.kameralar, c.secili.kamera, 'Kamera yok'], mikrofon: [c.mikrofonlar, c.secili.mikrofon, 'Mikrofon yok'], hoparlor: [c.hoparlorler, c.secili.hoparlor, 'Hoparlör yok'] };
    SEL.forEach(function (p) { var h = harita[p[1]]; selDoldur($(p[0]), h[0], h[1], h[2]); });
    var cok = (c.kameralar || []).length > 1;
    ['o-cevir', 'b-cevir'].forEach(function (id) { var d = $(id); if (d) d.hidden = !cok; });
  }
  async function kameraCevir() {
    if (!sag || typeof sag.cevir !== 'function') return;
    var dugmeler = ['o-cevir', 'b-cevir'].map($);
    dugmeler.forEach(function (d) { if (d) d.disabled = true; });
    try { await sag.cevir(); } finally { dugmeler.forEach(function (d) { if (d) d.disabled = false; }); }
    await cihazlariDoldur();
  }
  function onizlemeUi() {
    mikUi($('o-mik'), oz.mik); kamUi($('o-kam'), oz.kam);
    if (!oz.kam) $('onizleme-bos').hidden = false;
  }
  async function onizlemeBaslat() {
    try { var iz = await sag.onizlemeBaslat({ kamera: oz.kam }); T(iz && iz.kamera ? 'kamera_izin_ok' : 'kamera_izin_red'); }
    catch (e) { oz.kam = false; onizlemeUi(); mesaj(hataMetni(e)); T('kamera_izin_red', e && e.kod); }
    await cihazlariDoldur();
  }
  async function onizlemeGoster(mod) {
    oz.mod = mod; mesaj('');
    var katil = mod === 'katil';
    $('onizleme-baslik').textContent = katil ? 'Katılmaya hazır mısınız?' : 'Toplantıyı başlat';
    $('onizleme-alt').textContent = katil ? toplantiAdi : 'Bir sohbet seçin. Sohbetin üyelerine toplantı bağlantısı mesaj olarak gider.';
    $('onizleme-ad').textContent = ad;
     
    var ic = $('onizleme-icerde');
    ic.hidden = !(katil && taklit);
    if (katil && taklit) ic.textContent = taklitN < 1 ? 'Şu anda kimse yok' : (taklitN === 1 ? 'Katılımcı 1 burada' : 'Katılımcı 1, Katılımcı 2' + (taklitN > 2 ? ' ve ' + (taklitN - 2) + ' kişi daha' : '') + ' burada');
    $('sohbet-alan').hidden = katil; $('b-baslat').hidden = katil; $('b-katil').hidden = !katil; $('b-katil').disabled = false;
    $('b-lobi').hidden = !lobiGirisi;
    panel('panel-onizleme'); onizlemeUi();
    saglayiciKur();
    if (!sag.hazir()) mesaj(HATA.sdk);
    await onizlemeBaslat();
  }

   
  function etiketle(s, ben) {
    var e = s.tur === 'grup' ? (s.ad || 'Grup') : ((s.uyeler || []).filter(function (u) { return u !== ben; }).map(function (u) { return adlar[u] || 'Kişi'; }).join(', ') || 'Bire bir sohbet');
    return e;
  }
  async function baslat() {
    if (mesgul || !sohbetId) return;
    mesgul = true; $('b-baslat').disabled = true; mesaj('');
    var sec = $('sohbet-sec'); if (sec.selectedIndex >= 0) toplantiAdi = sec.options[sec.selectedIndex].getAttribute('data-ad') || sec.options[sec.selectedIndex].textContent;
    try {
      var bilgi = taklit ? { groupId: 'taklit-' + Date.now(), acsToken: 'taklit' } : await window.MeetApi.aramaBaslat(sohbetId);
      await cagriyaGir(bilgi);
      aktifAramaId = bilgi.aramaId || '';
       
      try { history.replaceState(null, '', location.pathname + location.search + '#s=' + encodeURIComponent(sohbetId) + '&g=' + encodeURIComponent(bilgi.groupId)); } catch (eh) {   }
      if (!taklit) {
        try { await window.MeetApi.baglantiMesaji(sohbetId, bilgi.groupId); }
        catch (e) { mesaj('Toplantı başladı ancak bağlantı mesajı sohbete gönderilemedi (' + hataMetni(e) + '). Bağlantıyı Bilgi panelinden kopyalayıp paylaşın.'); }
      }
    } catch (e2) { if ($('sahne').hidden) { mesaj(hataMetni(e2)); } $('b-baslat').disabled = false; }
    mesgul = false;
  }
  async function katil(s, g) {
    if (mesgul) return;
    mesgul = true; $('b-katil').disabled = true; mesaj('');
    try {
      var bilgi = taklit ? { groupId: g, acsToken: 'taklit' } : await window.MeetApi.aramaKatil(s, g);
      sohbetId = s;
      await cagriyaGir(bilgi);
    } catch (e) { if ($('sahne').hidden) mesaj(hataMetni(e)); }
    $('b-katil').disabled = false; mesgul = false;
  }

  function hashOku() {
    var h = (location.hash || '').replace(/^#/, ''), s = '', g = '', vv = '', c = '', kb = '', a = '';
    if (h.indexOf('toplanti/') === 0) { var kd = h.slice(9); return { s: '', g: '', v: '', c: '', k: '', a: '', t: KOD_RE.test(kd) ? kd : '!' }; }
    h.split('&').forEach(function (p) {
      var i = p.indexOf('='); if (i < 0) return;
      var k = p.slice(0, i), v = p.slice(i + 1);
      try { v = decodeURIComponent(v); } catch (e) { v = ''; }
      if (k === 's') s = v; else if (k === 'g') g = v; else if (k === 'v') vv = v;
      else if (k === 'c') c = v; else if (k === 'k') kb = v; else if (k === 'a') a = v;   
    });
    return { s: s.slice(0, 128), g: g.slice(0, 64), v: vv.slice(0, 1), c: c.slice(0, 1), k: kb.slice(0, 1), a: /^[0-9a-f-]{36}$/.test(a) ? a : '' };
  }

  async function sohbetListesi(oncelik) {
    var sec = $('sohbet-sec'); sec.textContent = '';
    if (taklit) {
      var o = document.createElement('option'); o.value = 't1'; o.textContent = 'Deneme sohbeti'; o.setAttribute('data-ad', 'Deneme sohbeti'); sec.appendChild(o);
      $('b-baslat').disabled = false; sohbetId = 't1'; toplantiAdi = 'Deneme sohbeti'; return;
    }
    var sonuc = await Promise.all([window.MeetApi.sohbetler(), window.MeetApi.kisiler().catch(function () { return []; })]);
    sonuc[1].forEach(function (k) { adlar[k.oid] = k.ad; });
    var ben = window.MeetKimlik.oid();
    var l = sonuc[0].filter(function (s) { return !(s.tercih && s.tercih.arsiv); });
    sohbetListe = l;
    l.forEach(function (s) {
      var et = etiketle(s, ben), gosterim = et;
      if (s.tur === 'grup') gosterim += ' (grup, ' + s.uyeler.length + ' kişi)';
      var op = document.createElement('option'); op.value = s.id; op.textContent = gosterim; op.setAttribute('data-ad', et); sec.appendChild(op);
    });
    if (!l.length) { mesaj('Hiç sohbetiniz yok. Önce uygulamanın Mesaj bölümünden bir sohbet açın.'); $('b-baslat').disabled = true; return; }
    if (oncelik && l.some(function (s) { return s.id === oncelik; })) sec.value = oncelik;
    sohbetId = sec.value; $('b-baslat').disabled = false;
  }
  async function sohbetAdiBul(id) {
    try {
      if (!sohbetListe) { await adlariYukle(); sohbetListe = await window.MeetApi.sohbetler(); }
      var ben = window.MeetKimlik.oid();
      var s = sohbetListe.filter(function (x) { return x.id === id; })[0];
      if (s) { toplantiAdi = etiketle(s, ben); if (oz.mod === 'katil' && !$('panel-onizleme').hidden) $('onizleme-baslik').textContent = toplantiAdi; }
    } catch (e) {   }
  }

  





  var YOKLA_MS = 3000;
  var ZIL_SURE_MS = (function () { var m = /[?&]zilsn=(\d+)/.exec(location.search); return taklit && m ? Math.max(2, Math.min(60, parseInt(m[1], 10))) * 1000 : 45000; })();
  var taklitRed = (function () { var m = /[?&]red=(\d+)/.exec(location.search); return taklit && m ? parseInt(m[1], 10) * 1000 : 0; })();
  var zil = null;   
  var ZIL_METIN = { cevapsiz: 'Cevap yok', reddedildi: 'Arama reddedildi', iptal: 'Arama iptal edildi', bitti: 'Arama bitti', hata: 'Arama kurulamadı' };
  function zilDurumYaz(d) { $('durum').setAttribute('data-zil', d || ''); }
  function caliyor(metin) {
    var k = $('caliyor'); if (!k) return;
    k.hidden = !metin; if (!metin) return;
    $('cal-ad').textContent = toplantiAdi; $('cal-durum').textContent = metin;
    var bas = (toplantiAdi || '?').trim().charAt(0).toLocaleUpperCase('tr-TR'); $('cal-av').textContent = bas || '?';
  }
  function geriDonusTonu() {   
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    var ctx; try { ctx = new AC(); } catch (e) { return null; }
    try { if (ctx.state === 'suspended') ctx.resume(); } catch (e1) {   }
    function cal() {
      try {
        var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
        o.frequency.value = 425; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.03);
        g.gain.setValueAtTime(0.08, t + 0.95); g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.02);
      } catch (e2) {   }
    }
    cal(); var z = setInterval(cal, 4000);
    return { dur: function () { clearInterval(z); try { ctx.close(); } catch (e3) {   } } };
  }
  function zilDurdur() {
    if (!zil) return;
    clearTimeout(zil.zaman); clearInterval(zil.yokla); zil.zaman = null; zil.yokla = null;
    if (zil.ses) { zil.ses.dur(); zil.ses = null; }
  }
  function zilSifirla() { zilDurdur(); zil = null; caliyor(''); zilDurumYaz(''); }
  function sohbetBireMi(id) {
    if (taklit) return taklitN <= 1;
    var s = (sohbetListe || []).filter(function (x) { return x.id === id; })[0];
    return !!(s && s.tur === 'bire');
  }
  function zilCevaplandi() {
    if (!zil || zil.cevap || zil.sonuc) return;
    zil.cevap = true; zilDurdur(); caliyor(''); zilDurumYaz('cevaplandi'); T('arama_cevaplandi');
  }
  function zilKatilimci(n) {   
    if (!zil || zil.sonuc) return;
    if (n > 0) { zil.enCok = Math.max(zil.enCok || 0, n); zilCevaplandi(); return; }
    if (n === 0 && zil.bire && zil.cevap && zil.enCok > 0 && sag) {   
      altIs(function () { return sag.ayril(); });
    }
  }
  async function zilSonu(sebep) {   
    if (!zil || zil.sonuc || zil.cevap) return;
    var z = zil; z.sonuc = sebep; zilDurdur(); zilDurumYaz(sebep); T('arama_' + sebep);
    if (sebep !== 'reddedildi' && !taklit) { try { await window.MeetApi.aramaBitti(z.sohbet, z.aramaId, 'cevapsiz'); } catch (e) { T('hata_kodu', e && e.kod); } }
    caliyor('');
    if (sag) { try { await sag.ayril(); } catch (e2) {   } }
    bittiGoster();
  }
  async function zilYokla() {
    if (!zil || zil.cevap || zil.sonuc || zil.yoklaniyor) return;
    var z = zil, acik = true; z.yoklaniyor = true;
    try {
      if (taklit) acik = !(taklitRed && Date.now() - z.t0 >= taklitRed);
      else { var a = await window.MeetApi.aramaSon(z.sohbet); acik = !!(a && (!z.aramaId || !a.aramaId || a.aramaId === z.aramaId)); }
    } catch (e) { acik = true; }   
    z.yoklaniyor = false;
    if (!acik && zil === z) zilSonu('reddedildi');
  }
  function zilAyrildi() {   
    if (!zil || zil.sonuc) return;
    var z = zil;
    if (!z.cevap && !z.gelen) { z.sonuc = 'iptal'; zilDurdur(); caliyor(''); zilDurumYaz('iptal'); T('arama_iptal'); if (!taklit) window.MeetApi.aramaBitti(z.sohbet, z.aramaId, 'cevapsiz').catch(function () {   }); return; }
    z.sonuc = 'bitti'; zilDurdur(); caliyor(''); zilDurumYaz('bitti');
    if (!z.gelen && !taklit) window.MeetApi.aramaBitti(z.sohbet, z.aramaId, 'bitti').catch(function () {   });
  }
  async function gidenArama(s) {
    sohbetId = s; grupId = ''; oz.mik = true;
    saglayiciKur();
    if (!sag.hazir()) { yokGoster('Arama başlatılamadı', HATA.sdk, false); durumYaz('hata'); return; }
    if (taklit) toplantiAdi = taklitN <= 1 ? 'Katılımcı 1' : 'Deneme grubu'; else await sohbetAdiBul(s);
    zil = { sohbet: s, aramaId: '', gelen: false, bire: sohbetBireMi(s), cevap: false, sonuc: '', enCok: 0, t0: 0 };
    var z = zil;
    panel('sahne'); caliyor('Aranıyor…'); zilDurumYaz('araniyor'); T('arama_giden');
    var bilgi;
    try { bilgi = taklit ? { groupId: 'taklit-' + Date.now(), acsToken: 'taklit', aramaId: '' } : await window.MeetApi.aramaBaslat(s, oz.kam); }
    catch (e) { zilSifirla(); yokGoster('Arama başlatılamadı', hataMetni(e), false); durumYaz('hata'); return; }
     
    if (zil !== z || z.sonuc) { if (!taklit && bilgi.aramaId) window.MeetApi.aramaBitti(s, bilgi.aramaId, 'cevapsiz').catch(function () {   }); return; }
    z.aramaId = bilgi.aramaId || ''; aktifAramaId = z.aramaId;
     
    try { history.replaceState(null, '', location.pathname + location.search + '#s=' + encodeURIComponent(s) + '&g=' + encodeURIComponent(bilgi.groupId) + '&v=' + (oz.kam ? '1' : '0')); } catch (eh) {   }
    try { await cagriyaGir(bilgi); }
    catch (e2) { if (zil === z) { z.sonuc = 'hata'; zilDurdur(); caliyor(''); zilDurumYaz('hata'); if (!taklit) window.MeetApi.aramaBitti(s, z.aramaId, 'cevapsiz').catch(function () {   }); yokGoster('Arama kurulamadı', hataMetni(e2), false); } return; }
    if (zil !== z || z.cevap || z.sonuc) return;
    caliyor('Çalıyor…'); zilDurumYaz('caliyor');
    z.t0 = Date.now(); z.ses = geriDonusTonu();
    z.zaman = setTimeout(function () { if (zil === z) zilSonu('cevapsiz'); }, ZIL_SURE_MS);
    z.yokla = setInterval(zilYokla, YOKLA_MS);
  }
  async function gelenKabul(s, g, aramaId) {
    sohbetId = s; grupId = g; oz.mik = true;
    zil = { sohbet: s, aramaId: aramaId || '', gelen: true, bire: false, cevap: true, sonuc: '', enCok: 0, t0: Date.now() };
    var z = zil; zilDurumYaz('cevaplandi'); T('arama_kabul'); aktifAramaId = aramaId || '';
    saglayiciKur();
    if (!sag.hazir()) { yokGoster('Aramaya katılınamadı', HATA.sdk, false); durumYaz('hata'); return; }
    if (taklit) toplantiAdi = 'Katılımcı 1'; else await sohbetAdiBul(s);
    z.bire = sohbetBireMi(s);
    $('b-katil').onclick = function () { katil(s, g); };   
    try { history.replaceState(null, '', location.pathname + location.search + '#s=' + encodeURIComponent(s) + '&g=' + encodeURIComponent(g) + '&v=' + (oz.kam ? '1' : '0')); } catch (eh) {   }
    await katil(s, g);
    if (taklit || zil !== z || $('sahne').hidden) return;
    try {
      if (!z.aramaId) { var a = await window.MeetApi.aramaSon(s); z.aramaId = a && a.groupId === g ? a.aramaId : ''; aktifAramaId = z.aramaId; }
      await window.MeetApi.aramaKatildi(s, z.aramaId);   
    } catch (e) { T('hata_kodu', e && e.kod); }
  }

  async function ac() {
    zilSifirla();   
    aktifAramaId = ''; davetSifirla();
    durumYaz('hazir'); toplantiAdi = 'Toplantı'; oz.mik = true;
    if (window.MeetKimlik.yerelUygulama()) { yokGoster('Toplantı bugün yalnız bilgisayar tarayıcısında', 'Bu sayfa uygulama içinde değil, bilgisayarınızın tarayıcısında açılır.', false); durumYaz('desteklenmiyor'); return; }
    if (!taklit) {
      var k = await window.MeetKimlik.hazirla();
      if (k === 'giris-yok') { yokGoster('Önce uygulamada giriş yapın', 'Mumu Meet, uygulamadaki oturumunuzu kullanır; giriş yaptıktan sonra bu sayfaya dönün.', true); durumYaz('giris-yok'); return; }
      if (k !== 'tamam') { yokGoster('Giriş bileşeni hazır değil', 'Sayfayı yenileyin; sürerse uygulamadan açın.', true); durumYaz('giris-yok'); return; }
      ad = window.MeetKimlik.ad();
    }
    var h = hashOku();
    odaKod = '';
    if (h.t) { lobiAtla = false; await odaAc(h.t); return; }   
    

    lobiGirisi = !h.s;
    if (lobiGirisi && !lobiAtla) { lobiGoster(); durumYaz('hazir'); return; }
    lobiAtla = false;
    

    oz.kam = h.v !== '0';
    

    if (h.s && !h.g && h.c === '1') { await gidenArama(h.s); return; }
    if (h.s && h.g && h.k === '1') { await gelenKabul(h.s, h.g, h.a); return; }
    if (h.s && h.g) {
      sohbetId = h.s; grupId = h.g;
      $('b-katil').onclick = function () { katil(h.s, h.g); };
      await onizlemeGoster('katil');
      if (!taklit) sohbetAdiBul(h.s);
      durumYaz('hazir');
      return;
    }
    await onizlemeGoster('yeni');
    try { await sohbetListesi(h.s); durumYaz('hazir'); } catch (e) { mesaj(hataMetni(e)); durumYaz('hata'); }
  }

   
  function lobiHata(m) { var e = $('l-kod-hata'); e.textContent = m || ''; e.hidden = !m; }
  function lobiKodAc(ac0) { $('l-kod-form').hidden = !ac0; $('l-katil-ac').setAttribute('aria-expanded', ac0 ? 'true' : 'false'); if (!ac0) lobiHata(''); }
  function lobiGoster() {
    if (sag) { try { sag.temizle(); } catch (e0) {   } sag = null; }
    odaKod = ''; odaBilgi = null; onBilgi = null;
    mesaj(''); lobiHata(''); lobiKodAc(false); $('l-kod').value = ''; $('l-kod-katil').disabled = true;
    $('l-planla').hidden = false;                          
    planKapat(); $('p-sonuc').hidden = true; planSon = null;
    $('l-kod').placeholder = 'Kod ya da bağlantı girin';   
    lobiVeriYenile(true);
    panel('panel-lobi');
  }
  function lobiKatilHook(g) { if (taklit) lobiKatil({ s: 't1', g: g }); else lobiOdaKatil(g, false); }   
  function lobiVeriYenile(gizle) {
    var sira = ++lobiSira;
    if (gizle) window.MeetLobi.ciz({ yaklasan: null, kisiler: null }, lobiKatilHook, lobiKisiyleBaslat);   
    Promise.resolve(window.MeetLobi.veriAl(taklit, lobiBos)).then(function (v) {
      if (sira !== lobiSira || $('panel-lobi').hidden) return;   
      window.MeetLobi.ciz(v, lobiKatilHook, lobiKisiyleBaslat);
    }).catch(function () {   });
  }

   
  function odaHataMetni(e) {
    var k = e && e.kod;
    return k === 'erken' ? 'Toplantı başlangıcından 10 dakika önce açılır.'
      : k === 'yok' ? 'Toplantı bulunamadı ya da bitti.'
      : k === 'uye-degil' ? 'Bu toplantıya katılamazsınız.'
      : k === 'kapali' ? 'Toplantılar şu anda kapalı.'
      : k === 'cok-istek' ? 'Çok fazla deneme yaptınız. Biraz bekleyip yeniden deneyin.'
      : hataMetni(e);
  }
   
  function odaSonuc(r) {
    if (!r) return { mesaj: 'Toplantıya katılınamadı.' };
    if (r.sonuc === 'bekleme') return { mesaj: 'Toplantı sahibinin onayı bekleniyor.' };
    if (r.sonuc === 'acilmadi') return { mesaj: 'Oda henüz açılmadı; davetlilerden biri katılınca girebilirsiniz.' };
    if (r.sonuc === 'katildi') {
      if (r.acsToken && r.groupId) return { bilgi: { groupId: r.groupId, acsToken: r.acsToken, acsUserId: r.acsUserId, bitis: r.bitis }, kod: r.kod };
      return { mesaj: 'Toplantıya kabul edildiniz. Ses ve görüntü bağlantısı bu sürümde henüz bağlanmadı.' };
    }
    return { mesaj: 'Toplantıya katılınamadı.' };
  }
  async function odaKatilIste(kod, kisa) {
    var r;
    try {
      if (taklit) r = { sonuc: 'katildi', groupId: 'taklit-' + kod.slice(0, 8), acsToken: 'taklit', kod: kod };
      else r = kisa ? await window.MeetApi.kodlaKatil(kod) : await window.MeetApi.toplantiKatil(kod);
    } catch (e) { return { mesaj: odaHataMetni(e) }; }
    return odaSonuc(r);
  }
   
  async function lobiOdaKatil(kod, kisa) {
    if (mesgul) return;
    mesgul = true; lobiHata('');
    try {
      var kk = taklit && kisa ? ('T' + kod + 'xxxxxxxxxxxxxxxxxxxxxx').slice(0, 22) : kod;
      var s = await odaKatilIste(kk, kisa && !taklit);
      var hedef = taklit ? kk : (s.kod || (kisa ? '' : kod));
      if (s.bilgi && KOD_RE.test(hedef)) {
        onBilgi = { kod: hedef, bilgi: s.bilgi };
        var nh = '#toplanti/' + hedef;
        if (location.hash === nh) { ac().catch(function (e) { mesaj(hataMetni(e)); }); } else location.hash = nh;   
      } else lobiHata(s.bilgi ? 'Toplantıya katılınamadı.' : s.mesaj);
    } finally { mesgul = false; }
  }
  async function odaAc(t) {
    lobiGirisi = false; sohbetId = ''; grupId = ''; oz.kam = true; toplantiAdi = 'Toplantı'; odaBilgi = null;
    if (!KOD_RE.test(t)) { onBilgi = null; yokGoster('Toplantı bulunamadı', 'Bu adres geçerli bir toplantıya ait değil.', true); durumYaz('hata'); return; }
    odaKod = t;
    var s;
    if (onBilgi && onBilgi.kod === t) { s = { bilgi: onBilgi.bilgi }; onBilgi = null; }
    else { onBilgi = null; s = await odaKatilIste(t, false); }
    if (!s.bilgi) { odaKod = ''; yokGoster('Toplantıya katılınamadı', s.mesaj, true); durumYaz('hata'); return; }
    odaBilgi = s.bilgi;
    $('b-katil').onclick = odaGir;
    await onizlemeGoster('katil'); durumYaz('hazir');
  }
  async function odaGir() {
    if (mesgul || !odaKod) return;
    mesgul = true; $('b-katil').disabled = true; mesaj('');
    try {
      var b = odaBilgi; odaBilgi = null;
      if (!b) {   
        var s = await odaKatilIste(odaKod, false);
        if (!s.bilgi) { mesaj(s.mesaj); $('b-katil').disabled = false; mesgul = false; return; }
        b = s.bilgi;
      }
      await cagriyaGir(b);
    } catch (e) { if ($('sahne').hidden) mesaj(hataMetni(e)); }
    $('b-katil').disabled = false; mesgul = false;
  }

   
  var KISA_ALF = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', B64U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  function rastgele(alfabe, n) {
    var a = new Uint8Array(n), o = '';
    try { crypto.getRandomValues(a); } catch (e) { for (var i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256); }
    for (var j = 0; j < n; j++) o += alfabe.charAt(a[j] % alfabe.length);
    return o;
  }
  function kisaGoster(k) { var t = String(k || '').toUpperCase().replace(/[\s-]/g, ''); return t.length === 8 ? t.slice(0, 4) + '-' + t.slice(4) : t; }
  function planHata(m) { var e = $('p-hata'); e.textContent = m || ''; e.hidden = !m; }
  function planKapat() { $('p-form').hidden = true; planHata(''); }
  function planSeciliYaz() { $('p-secili').textContent = planSecili.size ? '(' + planSecili.size + ' seçili)' : ''; }
  function planKisiCiz() {
    var ul = $('p-kisiler'); ul.textContent = '';
    var ara = ($('p-ara').value || '').trim().toLocaleLowerCase('tr'), n = 0;
    planKisiler.forEach(function (k) {
      if (ara && (k.ad || '').toLocaleLowerCase('tr').indexOf(ara) < 0) return;
      n++;
      var li = document.createElement('li'), lb = document.createElement('label'), cb = document.createElement('input');
      cb.type = 'checkbox'; cb.checked = planSecili.has(k.oid);
      cb.addEventListener('change', function () {
        if (cb.checked) { if (planSecili.size >= 200) { cb.checked = false; planHata('En çok 200 davetli seçebilirsiniz.'); return; } planSecili.add(k.oid); }
        else planSecili.delete(k.oid);
        planHata(''); planSeciliYaz();
      });
      var sp = document.createElement('span'); sp.textContent = k.ad || 'Kişi';
      lb.appendChild(cb); lb.appendChild(sp); li.appendChild(lb); ul.appendChild(li);
    });
    if (!n) { var l0 = document.createElement('li'); l0.className = 'lobi-bos'; l0.textContent = planKisiler.length ? 'Eşleşen kişi yok.' : 'Kişi listesi alınamadı.'; ul.appendChild(l0); }
  }
  async function planAc() {
    $('p-sonuc').hidden = true; planSon = null; planSecili = new Set(); planSeciliYaz();
    $('p-baslik').value = ''; $('p-zaman').value = ''; $('p-sure').value = '60'; $('p-ara').value = ''; planHata('');
    var d = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
    $('p-zaman').min = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
    $('p-form').hidden = false; planKisiler = []; planKisiCiz();
    try { $('p-baslik').focus(); } catch (e) {   }
    try {
      planKisiler = taklit ? window.MeetLobi.taklitKisiAdlari.map(function (a, i) { return { oid: 'c' + (i + 1), ad: a }; })
        : (await window.MeetApi.kisiler()).filter(function (k) { return k && typeof k.oid === 'string'; }).map(function (k) { return { oid: k.oid, ad: typeof k.ad === 'string' ? k.ad : '' }; });
    } catch (e2) { planKisiler = []; }
    if (!$('p-form').hidden) planKisiCiz();
  }
  function planHataMetni(e) { return e && e.kod === 'gecersiz' ? 'Toplantı bilgileri geçersiz. Başlık, zaman ve davetlileri kontrol edin.' : odaHataMetni(e); }
  function taklitOda() { return { kod: rastgele(B64U, 22), kisaKod: kisaGoster(rastgele(KISA_ALF, 8)), durum: 'bekliyor' }; }
  async function planGonder(simdi) {
    if (mesgul) return;
    var baslik = $('p-baslik').value.trim();
    if (!baslik) { planHata('Toplantı başlığı yazın.'); return; }
    var o = { baslik: baslik, davetliler: Array.from(planSecili) }, ms = 0, sure = parseInt($('p-sure').value, 10) || 60;
    if (!simdi) {
      var v = $('p-zaman').value;
      if (!v) { planHata('Planlamak için başlangıç tarih ve saatini seçin; hemen başlatmak için "Şimdi başlat" düğmesini kullanın.'); return; }
      ms = new Date(v).getTime();
      if (isNaN(ms)) { planHata('Başlangıç zamanı geçersiz.'); return; }
      if (ms < Date.now()) { planHata('Başlangıç zamanı geçmişte olamaz.'); return; }
      o.baslangic = ms; o.sure = sure;
    }
    if (o.davetliler.length > 200) { planHata('En çok 200 davetli seçebilirsiniz.'); return; }
    mesgul = true; planHata(''); ['p-planla', 'p-simdi'].forEach(function (i) { $(i).disabled = true; });
    var basari = null;
    try {
      var r = taklit ? taklitOda() : await window.MeetApi.toplantiOlustur(o);
      basari = { kod: r.kod, kisaKod: kisaGoster(r.kisaKod), link: window.MeetApi.odaBaglantisi(r.kod), planli: !simdi, baslik: baslik, ms: ms, sure: sure };
    } catch (e) { planHata(planHataMetni(e)); }
    ['p-planla', 'p-simdi'].forEach(function (i) { $(i).disabled = false; });
    mesgul = false;
    if (!basari) return;
    if (simdi) { planKapat(); lobiOdaKatil(basari.kod, false); return; }   
    planSon = basari; planKapat();
    $('p-kisakod').textContent = basari.kisaKod; $('p-link').value = basari.link; $('p-ics').hidden = !basari.planli; $('p-sonuc-hata').hidden = true;
    $('p-sonuc').hidden = false; lobiVeriYenile(false);
  }
  function taklitIcs(p) {
    var f = function (ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z'); };
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mumu Meet//TR', 'BEGIN:VEVENT', 'UID:taklit-' + rastgele(KISA_ALF, 8) + '@toplanti.taklit',
      'DTSTART:' + f(p.ms), 'DTEND:' + f(p.ms + p.sure * 60000), 'SUMMARY:' + p.baslik, 'URL:' + p.link, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n') + '\r\n';
  }
  async function icsIndir() {
    if (!planSon) return;
    var h = $('p-sonuc-hata'); h.hidden = true;
    try {
      var ics = taklit ? taklitIcs(planSon) : await window.MeetApi.toplantiIcs(planSon.kod);
      var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      var a = document.createElement('a'); a.href = url; a.download = 'toplanti.ics'; a.hidden = true;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    } catch (e) { h.textContent = '.ics alınamadı: ' + planHataMetni(e); h.hidden = false; }
  }
  function planDugmeleri() {
    $('p-form').addEventListener('submit', function (e) { e.preventDefault(); planGonder(false); });
    $('p-simdi').addEventListener('click', function () { planGonder(true); });
    $('p-iptal').addEventListener('click', planKapat);
    $('p-ara').addEventListener('input', planKisiCiz);
    $('p-kapat').addEventListener('click', function () { $('p-sonuc').hidden = true; planSon = null; });
    $('p-katil').addEventListener('click', function () { if (planSon) lobiOdaKatil(planSon.kod, false); });
    $('p-ics').addEventListener('click', icsIndir);
    $('p-kopyala').addEventListener('click', async function () {
      var h = $('p-sonuc-hata'); h.hidden = true;
      try { await navigator.clipboard.writeText($('p-link').value); tost2('Bağlantı kopyalandı.'); } catch (e) { $('p-link').select(); h.textContent = 'Kopyalanamadı; bağlantıyı seçip elle kopyalayın.'; h.hidden = false; }
    });
  }
  function lobiKatil(r) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {   }
    location.hash = '#s=' + encodeURIComponent(r.s) + '&g=' + encodeURIComponent(r.g);   
  }
  function lobiKodGonder() {
    var t = $('l-kod').value.trim(); if (!t) return;
    var r = window.MeetLobi.cozumle(t);
    if (!r) {
      var om = ODA_LINK_RE.exec(t), ok = om ? om[1] : (KOD_RE.test(t) ? t : '');
      if (ok) { lobiOdaKatil(ok, false); return; }                       
      var kk = t.toUpperCase().replace(/[\s-]/g, '');
      if (KISA_RE.test(kk)) { lobiOdaKatil(kk, true); return; }          
    }
    if (!r && taklit && /^[A-Za-z0-9-]{3,64}$/.test(t)) r = { s: 't1', g: 'taklit-' + t };   
    if (!r) { lobiHata('Geçerli bir toplantı bağlantısı girin. Bağlantıyı toplantıyı başlatan kişiden alabilirsiniz.'); return; }
    lobiHata(''); lobiKatil(r);
  }
   
  function lobiKisiyleBaslat(k) {
    if (mesgul || !k || !k.id) return;
    planSecili = new Set([k.id]); planSon = null; planHata('');
    $('p-baslik').value = ((k.ad || 'Kişi') + ' ile görüşme').slice(0, 120);
    $('p-sure').value = '60';
    planGonder(true).then(function () {
      var h = $('p-hata');
      if (!h.hidden && h.textContent) { mesaj(h.textContent); h.textContent = ''; h.hidden = true; }
    });
  }
  function lobiDugmeleri() {
    $('l-hemen').addEventListener('click', function () { lobiAtla = true; ac().catch(function (e) { mesaj(hataMetni(e)); }); });
    $('l-katil-ac').addEventListener('click', function () {
      var ac0 = $('l-kod-form').hidden; if (ac0) planKapat();
      lobiKodAc(ac0);
      if (ac0) { try { $('l-kod').focus(); $('l-kod-form').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {   } }
    });
    $('l-kod').addEventListener('input', function () { $('l-kod-katil').disabled = !this.value.trim(); lobiHata(''); });
    $('l-kod-form').addEventListener('submit', function (e) { e.preventDefault(); lobiKodGonder(); });
    $('b-lobi').addEventListener('click', function () { lobiGoster(); });
    $('b-lobiye').addEventListener('click', function () {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {   }
      if (sag) { try { sag.temizle(); } catch (e0) {   } } sag = null; katilimciYaz(0); lobiAtla = false; lobiGirisi = true; lobiGoster();
    });
    $('l-planla').addEventListener('click', function () {
      lobiKodAc(false); planAc();
      try { $('p-form').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {   }
    });
    planDugmeleri();
     
    ['yok-baglanti', 'b-ana', 'b-app'].forEach(function (id) {
      $(id).addEventListener('click', function (e) {
        if (window.parent === window) return;               
        e.preventDefault(); window.MeetKimlik.kapat();
      });
    });
    Array.from(document.querySelectorAll('.puan-d')).forEach(function (b) {
      b.addEventListener('click', function () {
        var n = parseInt(b.getAttribute('data-puan'), 10);      
        Array.from(document.querySelectorAll('.puan-d')).forEach(function (x) { x.classList.toggle('secili', parseInt(x.getAttribute('data-puan'), 10) <= n); });
        $('puan-tesekkur').hidden = false;
      });
    });
    $('o-efekt').addEventListener('click', function () { tost2('Arka plan efektleri bu görüşmede kullanılamıyor.'); });
  }
  function tost2(m) { mesaj(m, 'bilgi'); setTimeout(function () { if ($('mesaj').textContent === m) mesaj(''); }, 3000); }

   
  async function altIs(f) { try { await f(); } catch (e) { mesaj(hataMetni(e)); } }
  function ayarAc() { acilirKapat(); $('ayar').hidden = false; cihazlariDoldur(); }
  function dugmeler() {
    $('b-baslat').addEventListener('click', baslat);
    $('sohbet-sec').addEventListener('change', function () { sohbetId = this.value; });
    $('o-mik').addEventListener('click', function () { oz.mik = !oz.mik; mikUi($('o-mik'), oz.mik); });
    $('o-kam').addEventListener('click', async function () {
      oz.kam = !oz.kam; kamUi($('o-kam'), oz.kam);
      if (sag) { await onizlemeBaslat(); onizlemeUi(); }
    });
    SEL.forEach(function (p) {
      $(p[0]).addEventListener('change', async function () {
        if (!sag || !this.value) return;
        var ok = await sag.cihazSec(p[1], this.value);
        if (!ok) tost('Cihaz değiştirilemedi.');
      });
    });

    $('o-cevir').addEventListener('click', function () { altIs(kameraCevir); });
    $('b-cevir').addEventListener('click', function () { altIs(kameraCevir); });
    $('b-mik').addEventListener('click', function () { if (sag) altIs(function () { return sag.mikrofon($('b-mik').getAttribute('aria-pressed') !== 'true'); }); });
    $('b-kam').addEventListener('click', function () { if (sag) altIs(function () { return sag.kamera($('b-kam').getAttribute('aria-pressed') !== 'true'); }); });
    function altyazi() { acilirKapat(); tost('Altyazı yakında eklenecek.'); }
    function arka() { acilirKapat(); tost('Arka plan efektleri bu görüşmede kullanılamıyor.'); }
    function ekranPaylas() { acilirKapat(); if (sag) altIs(function () { return sag.ekranPaylas(!ekranAcik); }); }
    function elDegis() { acilirKapat(); if (sag) altIs(function () { return sag.elKaldir(!elAcik); }); }
    $('b-altyazi').addEventListener('click', altyazi); $('m-altyazi').addEventListener('click', altyazi);
    $('m-arka').addEventListener('click', arka);
    $('b-ekran').addEventListener('click', ekranPaylas); $('m-ekran').addEventListener('click', ekranPaylas);
    $('b-el').addEventListener('click', elDegis); $('m-el').addEventListener('click', elDegis);
    $('b-tepki').addEventListener('click', function (e) { e.stopPropagation(); acilirDegistir('b-tepki', 'tepki-panel'); });
    Array.from(document.querySelectorAll('[data-tepki]')).forEach(function (b) {
      b.addEventListener('click', function () {
        var tur = b.getAttribute('data-tepki'), em = b.getAttribute('data-emoji');
        acilirKapat(); tepkiGoster('ben', em);
        if (sag) altIs(function () { return sag.tepkiGonder(tur); });
      });
    });
    $('b-uc').addEventListener('click', function (e) { e.stopPropagation(); acilirDegistir('b-uc', 'menu'); });
    [['m-otomatik', 'otomatik'], ['m-izgara', 'izgara'], ['m-spotlight', 'spotlight'], ['m-konusmaci', 'konusmaci']].forEach(function (p) {
      $(p[0]).addEventListener('click', function () { gorunum = p[1]; gorunumUi(); duzenle(); acilirKapat(); });
    });
    $('m-tamekran').addEventListener('click', function () {
      acilirKapat();
      try { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); }
      catch (e) { tost('Tam ekran açılamadı.'); }
    });
    $('kisi-ekle').addEventListener('click', davetAcKapa);
    $('kisi-ara').addEventListener('input', function () { listeCiz(); if (!$('davet-bolum').hidden) davetCiz(); });
    $('davet-yeniden').addEventListener('click', function () { davetYukle(); });
    $('davet-baglanti').addEventListener('click', function () { yanAc('bilgi'); });
    lobiDugmeleri();
    $('m-ayar').addEventListener('click', ayarAc);
    $('ayar-kapat').addEventListener('click', function () { $('ayar').hidden = true; });
    $('ayar').addEventListener('click', function (e) { if (e.target === $('ayar')) $('ayar').hidden = true; });
    $('b-ayril').addEventListener('click', function () { if (sag) altIs(function () { return sag.ayril(); }); });

    $('b-kisiler').addEventListener('click', function () { yanAc('kisiler'); });
    $('b-sohbet').addEventListener('click', function () { yanAc('sohbet'); });
    $('b-bilgi').addEventListener('click', function () { yanAc('bilgi'); });
    $('m-bilgi').addEventListener('click', function () { yanAc('bilgi'); });
    $('yan-kapat').addEventListener('click', yanKapat);
    $('msg-form').addEventListener('submit', function (e) { e.preventDefault(); mesajGonder($('msg-giris').value); });
    $('b-kopyala').addEventListener('click', async function () {
      var v = $('baglanti').value;
      try { await navigator.clipboard.writeText(v); tost('Bağlantı kopyalandı'); } catch (e) { $('baglanti').select(); tost('Kopyalanamadı; bağlantıyı seçip elle kopyalayın.'); }
    });
    $('b-tekrar').addEventListener('click', function () {
       
      if (zil && !zil.gelen && zil.sohbet) { try { history.replaceState(null, '', location.pathname + location.search + '#s=' + encodeURIComponent(zil.sohbet) + '&v=' + (oz.kam ? '1' : '0') + '&c=1'); } catch (eh) {   } }
      mesaj(''); katilimciYaz(0); if (sag) { try { sag.temizle(); } catch (e0) {   } } sag = null; ac().catch(function (e) { mesaj(hataMetni(e)); }); });

    document.addEventListener('click', function (e) { if (!e.target.closest || !e.target.closest('.acilir-kap')) { acilirKapat(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('panel-lobi').hidden && !$('l-kod-form').hidden) { lobiKodAc(false); return; }
      if (!$('ayar').hidden) { $('ayar').hidden = true; return; }
      if (!$('menu').hidden || !$('tepki-panel').hidden) { acilirKapat(); return; }
      if (yanAcik) yanKapat();
    });
    if (mq && mq.addEventListener) mq.addEventListener('change', duzenle);
    if (mqDar && mqDar.addEventListener) mqDar.addEventListener('change', secimGuncelle);
    window.addEventListener('beforeunload', function () { try { if (sag) sag.ayril(); } catch (e) {   } });
    window.addEventListener('hashchange', function () { if ($('sahne').hidden) ac().catch(function (e) { mesaj(hataMetni(e)); }); });
     
    var lobiSonTazele = 0;
    function lobiOneGelince() {
      if ($('panel-lobi').hidden) return;
      var t = Date.now();
      if (t - lobiSonTazele < 1500) return;
      lobiSonTazele = t;
      lobiVeriYenile(false);
    }
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') lobiOneGelince(); });
    window.addEventListener('pageshow', lobiOneGelince);
    window.addEventListener('focus', lobiOneGelince);
    window.addEventListener('online', lobiOneGelince);
  }

  ikonlariKur();
  dugmeler();
  ac().catch(function (e) { mesaj(hataMetni(e)); durumYaz('hata'); });
})();
