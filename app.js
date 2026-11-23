 
(function () {
  'use strict';

   
  function h(etiket, ozellik, cocuklar) {
    var e = document.createElement(etiket);
    if (ozellik) for (var k in ozellik) {
      var v = ozellik[k];
      if (v == null || v === false) continue;
      if (k === 'sinif') e.className = v;
      else if (k === 'metin') e.textContent = v;
      else if (k.indexOf('on') === 0) { if (typeof v === 'function') e.addEventListener(k.slice(2), v); }   
      else if ((k === 'href' || k === 'src' || k === 'xlink:href') && /^\s*(javascript|data|vbscript):/i.test(String(v))) continue;   
      else e.setAttribute(k, v === true ? '' : v);
    }
    (cocuklar || []).forEach(function (c) {
      if (c == null || c === false) return;
      e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
    return e;
  }
  function svg(etiket, ozellik, cocuklar) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', etiket);
    for (var k in (ozellik || {})) if (ozellik[k] != null) e.setAttribute(k, ozellik[k]);
    (cocuklar || []).forEach(function (c) { e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  var LOC = window.MM_LOC || 'tr-TR';   
  var sayiBicim = new Intl.NumberFormat(LOC);
  function sayi(n, ondalik) {
    if (n == null || isNaN(n)) return null;
    return ondalik ? new Intl.NumberFormat(LOC, { maximumFractionDigits: ondalik }).format(n) : sayiBicim.format(n);
  }
  var saatBicim = new Intl.DateTimeFormat(LOC, { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  function saat(d) { return d ? saatBicim.format(d) : '—'; }
  function yasMetin(dk) {
    if (dk == null) return 'bilinmiyor';
    if (dk < 1) return 'az önce';
    if (dk < 60) return Math.round(dk) + ' dk önce';
    if (dk < 1440) { var s = Math.floor(dk / 60), m = Math.round(dk % 60); return s + ' sa' + (m ? ' ' + m + ' dk' : '') + ' önce'; }
    return Math.floor(dk / 1440) + ' gün önce';
  }
  function yasDk(iso) { var t = Date.parse(iso); return isNaN(t) ? null : (Date.now() - t) / 60000; }

   
  function tazelikSatiri(asofIso, kaynakAdi) {
    var dk = yasDk(asofIso), eski = dk == null || dk > (window.MM_AYAR.eskiDk || 15);
    var kutu = h('div', { sinif: 'tazelik' });
    kutu.appendChild(h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }));
    kutu.appendChild(h('span', { metin: yasMetin(dk) + ' güncellendi' + (asofIso ? ' (' + saat(new Date(asofIso)) + ' TR)' : '') }));
    kutu.appendChild(h('span', { sinif: 'kaynak-etiket', metin: kaynakAdi === 'graph' ? 'OneDrive' : 'yerel kopya' }));
    var bant = eski ? h('div', { sinif: 'bant sari', role: 'status' }, [
      h('strong', { metin: 'Veri eski' }),
      ' — son güncelleme ' + yasMetin(dk) + '. Gösterilen değerler güncel olmayabilir.'
    ]) : null;
    return { satir: kutu, bant: bant, eski: eski, dk: dk };
  }

  window.MM = Object.assign(window.MM || {}, { h: h, svg: svg, sayi: sayi, saat: saat, yasMetin: yasMetin, yasDk: yasDk, tazelikSatiri: tazelikSatiri, moduller: {} });
   
  window.MM.mesaj = Object.assign(window.MM.mesaj || {}, { hesap: function () { var a = window.MM_AYAR || {}; return { oid: String(a.girisOid || ''), ad: String(a.girisAd || '') }; } });
  function mesajAcik() { var m = (window.MM_AYAR || {}).mesaj || {}; var cap = window.Capacitor; if (!((cap && cap.isNativePlatform && cap.isNativePlatform()) || window.MM_WEB === true)) return false; return !!(String(m.url || '').trim() && String(m.apiKapsam || '').trim()); }   

   
  var IKON = {
    ana: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
    makineler: 'M3 20V9l6 4V9l6 4V5h3v15zM6 17h2M11 17h2M16 17h2',
    eldiven: 'M8 21c-2-2-3-4-3-7V7a1.5 1.5 0 013 0v4V4a1.5 1.5 0 013 0v7V3.5a1.5 1.5 0 013 0V11V6a1.5 1.5 0 013 0v9c0 3-2 6-5 6z',
    stok: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8',
    ik: 'M16 11a3 3 0 100-6 3 3 0 000 6zM8 12a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5',
    onay: 'M5 12l4.5 4.5L19 7',
    asistan: 'M4 5h16v11H9l-5 4zM8 10h8',
    toplanti: 'M3 7h12v10H3zM15 10.5l6-3.5v10l-6-3.5',
    mesaj: 'M4 5h16v11H9l-5 4zM8 9h8M8 12h5',
    gizlilik: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4',
    siparis: 'M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10',
    finans: 'M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6',
    muhasebe: 'M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2zM5 18a2 2 0 012-2h12M9 8h6M9 12h6',
    kalite: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4',
    isg: 'M12 3l9 16H3zM12 10v4M12 17h.01',
    sikayet: 'M4 5h16v11H9l-5 4zM12 8v4M12 14h.01',
    dmo: 'M5 3h10l4 4v14H5zM14 3v5h5M8 13h8M8 17h6',
    nakliye: 'M2 6h11v10H2zM13 9h4l3 3v4h-7zM6 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
    'dmo-nakliyat': 'M2 6h11v10H2zM13 9h4l3 3v4h-7zM6 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM5 10h5M5 13h3',
    'nakliye-yukle': 'M12 16V5M7 10l5-5 5 5M5 20h14',
    sterilizasyon: 'M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3M8 15h8',
    ihale: 'M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h5',
    'kalite-yukle': 'M12 8v5M12 16.5h.01M10.3 3.9L2.6 17a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
    yonetim: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
    diger: 'M5 12h.01M12 12h.01M19 12h.01'
  };
  var MODULLER_TUM = [
    { id: 'ana', ad: 'Ana sayfa', aktif: true },
    { id: 'makineler', ad: 'Makineler', aktif: true },
    { id: 'eldiven', ad: 'Eldiven', aktif: true },
    { id: 'siparis', ad: 'Siparişler', aktif: true },
    { id: 'dmo', ad: 'DMO', aktif: true },
    { id: 'dmo-nakliyat', ad: 'DMO Nakliyat', kisa: 'DMO Nak.', aktif: true },
    { id: 'stok', ad: 'Stok', aktif: true },
    { id: 'sikayet', ad: 'Şikâyetler', aktif: true },
    { id: 'kalite', ad: 'Kalite', aktif: true },
    { id: 'isg', ad: 'İSG', aktif: true },
    { id: 'nakliye', ad: 'Nakliye', aktif: true },
    { id: 'sterilizasyon', ad: 'Sterilizasyon', aktif: true },
    { id: 'ihale', ad: 'İhaleler', aktif: true },
    { id: 'kalite-yukle', ad: 'Kalite bildir', aktif: true },
    { id: 'nakliye-yukle', ad: 'Yükleme', aktif: true, nakliyeci: true },
    { id: 'erisim-yok', ad: 'Erişim', aktif: true, erisimYok: true },   
    { id: 'ik', ad: 'İK', aktif: true, onizleme: true },
    { id: 'onay', ad: 'Onaylar', aktif: true, onizleme: true },
    { id: 'asistan', ad: 'Asistan', aktif: true },   
    { id: 'toplanti', ad: 'Toplantı', aktif: true },   
    { id: 'mesaj', ad: 'Mumu Talk', aktif: true, mesaj: true },   
    { id: 'yonetim', ad: 'Yönetim', aktif: true },
    { id: 'finans', ad: 'Finans', aktif: true },
    { id: 'muhasebe', ad: 'Muhasebe', aktif: true },
    { id: 'gizlilik', ad: 'Gizlilik', aktif: true, gizlilik: true }   
  ];
  function rolAl() {
    
    
    
    if (window.MMVeri && window.MMVeri.demo()) return 'yonetim';   
    if (window.MMVeri && window.MMVeri.mod() === 'graph') return window.MM_AYAR.girisRol || 'calisan';
    var q = new URLSearchParams(location.search).get('rol');
    return q || window.MM_AYAR.rol || 'yonetim';
  }
  


  var ACIK = null;
  function acikListe(l) { return Array.isArray(l) ? l.filter(function (x) { return typeof x === 'string'; }) : null; }
  ACIK = acikListe(window.MM_AYAR.acikModuller);
  var VARSAYILAN_ACIK = ACIK ? ACIK.slice() : null;   
  function modAcik(id) { return id === 'ana' || id === 'nakliye-yukle' || id === 'erisim-yok' || id === 'gizlilik' || !ACIK || ACIK.indexOf(id) >= 0; }
  var onizQ = new URLSearchParams(location.search).get('moduller');
  var ONIZ = (onizQ && window.MMVeri && window.MMVeri.mod() === 'yerel') ? onizQ.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : null;   
  if (ONIZ) ACIK = ONIZ;
  window.MM.acik = modAcik;
  var ilkOkuma = true, KAPALI = [];
  function bayrakOku() {
    if (ONIZ || !window.MMVeri || window.MMVeri.kisitli()) return Promise.resolve();   
    var zaman = new Promise(function (c) { setTimeout(function () { c(null); }, 3000); });
    var oku = window.MMVeri.oku('ayar', 'moduller', 'ayar').then(function (r) { return r && r.veri; }).catch(function () { return null; });
    return Promise.race([oku, zaman]).then(function (v) {
      var kl = (v && acikListe(v.kapali)) || [], l = v && acikListe(v.acik), ilk = ilkOkuma; ilkOkuma = false;
      var pEski = window.MM.talimatPosta || '', pYeni = (v && typeof v.talimat_posta === 'string' && /^[^@\s]{1,64}@[^@\s]{3,80}$/.test(v.talimat_posta.trim())) ? v.talimat_posta.trim() : '';   
      window.MM.talimatPosta = pYeni;
      var kapaliDegisti = JSON.stringify(kl) !== JSON.stringify(KAPALI); KAPALI = kl;   
      if ((!l || JSON.stringify(l) === JSON.stringify(ACIK)) && !kapaliDegisti && pEski === pYeni) return;
      if (l) ACIK = l;
      if (kurulu) { filtrele(); menuKur(); }
      if (window.MM.ozet && window.MM.ozet.sifirla) window.MM.ozet.sifirla();   
      if (!ilk) { git(); if (window.MM.bildirimTazele) window.MM.bildirimTazele(); }   
    });
  }
  window.MM.acikHazir = bayrakOku();
  window.MM.bayrakYenile = bayrakOku;   
  
  var DEMO_KAPALI = ['kalite-yukle', 'nakliye-yukle', 'asistan', 'toplanti', 'mesaj', 'ik', 'onay', 'yonetim'];
  function yonetimMi() {
    if (window.MMVeri && window.MMVeri.mod() === 'graph') return !!window.MMVeri.ozelErisim('yonetim') && !!(window.MM_AYAR.ozelErisim || {}).yonetim;
    return rolAl() === 'yonetim';
  }
  var kurulu = false, YUKLENDI = false;   
  function filtrele() {
    var nk = window.MMVeri && window.MMVeri.nakliyeci(), yz = !nk && window.MMVeri && window.MMVeri.misafirYetkisiz();
    document.body.classList.toggle('nakliyeci', !!nk || !!yz);
    if (yz) { MODULLER = MODULLER_TUM.filter(function (m) { return m.erisimYok; }); window.MM.modulListe = []; return; }   
    if (nk) {   
      MODULLER = MODULLER_TUM.filter(function (m) { return m.nakliyeci; });
      window.MM.modulListe = [];
      return;
    }
    var ym = yonetimMi();   
    MODULLER = MODULLER_TUM.filter(function (m) {
      if (m.nakliyeci || m.erisimYok) return false;
      if (window.MMVeri && window.MMVeri.demo() && DEMO_KAPALI.indexOf(m.id) >= 0) return false;   
      if ((m.mesaj || m.gizlilik) && !mesajAcik()) return false;   
      if (m.gizlilik) return true;   
      var r = (window.MM_AYAR.roller || {})[m.id];
      if (KAPALI.indexOf(m.id) >= 0 && m.id !== 'ana') return false;   
      if (ym && ACIK && VARSAYILAN_ACIK && VARSAYILAN_ACIK.indexOf(m.id) >= 0 && !modAcik(m.id)) return false;   
      if (!ym && !modAcik(m.id)) return false;   
      if (YUKLENDI && m.id !== 'ana' && !m.onizleme && !window.MM.moduller[m.id]) return false;   
      if (m.onizleme && !ym) return false;   
      if (window.MMVeri && !window.MMVeri.ozelErisim(m.id)) return false;
      if (m.id === 'kalite-yukle') return !window.MMVeri || window.MMVeri.kaliteGorur(ym);   
      return window.MMVeri ? window.MMVeri.bolumGorur(m.id, rolAl()) : (!r || r.indexOf(rolAl()) >= 0);   
    });
    MODULLER = MODULLER.filter(function (m) { return !m.onizleme; }).concat(MODULLER.filter(function (m) { return m.onizleme; }));   
    window.MM.modulListe = MODULLER.map(function (m) { return { id: m.id, ad: m.ad, onizleme: !!m.onizleme }; });   
  }
  var MODULLER = [];
  window.MM.rol = rolAl;
  filtrele();

  var menu = document.getElementById('menu'), icerik = document.getElementById('icerik');

  function ikon(id) {
    return svg('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [svg('path', { d: IKON[id] })]);
  }
  var ILK = 4;   
  var sheet = h('div', { sinif: 'diger-sheet', id: 'diger-sheet', hidden: true, role: 'menu', 'aria-label': 'Diğer modüller' });
  function menuOge(m, ekstra) {
    return h('a', { href: '#' + m.id, 'data-modul': m.id, sinif: 'menu-oge' + (m.onizleme ? ' onizleme' : '') + (ekstra ? ' diger-oge' : ''), 'aria-label': m.ad, title: m.ad }, [
      ikon(m.id),
      h('span', { sinif: 'ad', metin: m.kisa || m.ad }),
      null
    ]);
  }
  var YAKINDA_ILK = -1, BAR = {};
  var yakindaAcik = false, yakindaDugme = null;
  var digerDugme = h('button', { type: 'button', sinif: 'menu-oge menu-diger', 'aria-haspopup': 'true', 'aria-controls': 'diger-sheet', 'aria-expanded': 'false' }, [ikon('diger'), h('span', { sinif: 'ad', metin: 'Diğer' })]);
  function kayarIpucu() { sheet.classList.toggle('kayar', sheet.scrollHeight > sheet.clientHeight + 4 && sheet.scrollTop + sheet.clientHeight < sheet.scrollHeight - 4); }   
  sheet.addEventListener('scroll', kayarIpucu);
  digerDugme.addEventListener('click', function () { sheet.hidden = !sheet.hidden; digerDugme.setAttribute('aria-expanded', String(!sheet.hidden)); if (!sheet.hidden) { sheet.scrollTop = 0; kayarIpucu(); } });
  function yakindaGoster(ac) { yakindaAcik = ac; Array.prototype.forEach.call(menu.querySelectorAll('.menu-oge.onizleme'), function (e) { e.classList.toggle('gizli', !ac); }); if (yakindaDugme) yakindaDugme.setAttribute('aria-expanded', String(ac)); }
  function menuKur() {   
  menu.textContent = ''; sheet.textContent = ''; sheet.hidden = true; if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
  YAKINDA_ILK = -1; yakindaDugme = null; yakindaAcik = false;
  
  
  BAR = {};
  var mesajVar = MODULLER.some(function (m) { return m.id === 'mesaj'; });
  MODULLER.filter(function (m) { return m.id !== 'mesaj'; }).slice(0, mesajVar ? ILK - 1 : ILK).forEach(function (m) { BAR[m.id] = true; });
  if (mesajVar) BAR.mesaj = true;
  MODULLER.forEach(function (m, i) {
    var barda = !!BAR[m.id];
    var o = menuOge(m, !barda); o.classList.remove('onizleme');
    menu.appendChild(o);
    var k = menuOge(m, false); k.classList.remove('onizleme'); k.setAttribute('role', 'menuitem'); k.addEventListener('click', function () { sheet.hidden = true; }); sheet.appendChild(k);
  });
  if (window.MM.yukle) sheet.appendChild(window.MM.yukle.dugme());   
  sheet.appendChild(h('div', { sinif: 'diger-surum', role: 'presentation', metin: 'Sürüm ' + (window.MM_AYAR.surum || '') }));   
  if (MODULLER.length > ILK || MODULLER.length) { menu.appendChild(digerDugme); document.body.appendChild(sheet); }
  if (window.MM.mesaj) { if (window.MM.mesaj.arkaBaslat) window.MM.mesaj.arkaBaslat(); if (window.MM.mesaj.rozetUygula) window.MM.mesaj.rozetUygula(); }   
  }
  menuKur(); kurulu = true;
  window.MM.menuYenile = function () {   
    if (!kurulu) return;
    filtrele(); menuKur();
    if (window.MM.ozet && window.MM.ozet.sifirla) window.MM.ozet.sifirla();
    git();
    if (window.MM.bildirimTazele) window.MM.bildirimTazele();
  };
  document.addEventListener('click', function (e) { if (!sheet.hidden && !sheet.contains(e.target) && !digerDugme.contains(e.target)) { sheet.hidden = true; digerDugme.setAttribute('aria-expanded', 'false'); } });

  function yolParcalari() { return (location.hash || '#ana').slice(1).split('?')[0].split('/').filter(Boolean).map(function (x) { try { return decodeURIComponent(x); } catch (e) { return x; } }); }
  window.MM.yol = function () { return yolParcalari().slice(1); };   
  var aktifTemizle = null;
   
  function toplantiAdresi(hash) {
    var m = /^#toplanti\/([A-Za-z0-9_-]{22})$/.exec(String(hash || ''));
    return m ? 'meet/index.html#toplanti/' + m[1] : '';
  }
  function toplantiYonlendir() {
    var adres = toplantiAdresi(location.hash);
    if (!adres) return false;
    var M = window.MM.mesaj;
    if (M && M.kabukMu && M.kabukMu() && M.meetCerceveAc) {   
      try { history.replaceState(null, '', location.pathname + location.search + '#ana'); } catch (e) { }
      M.meetCerceveAc(adres);
      return false;
    }
    location.replace(adres);   
    return true;
  }
  function git() {
    if (toplantiYonlendir()) return;
    var id = yolParcalari()[0] || 'ana';
    var m = MODULLER.filter(function (x) { return x.id === id; })[0];
    if (!m) { m = MODULLER[0]; if (id !== m.id && history.replaceState) { try { history.replaceState(null, '', location.pathname + location.search + '#' + m.id); } catch (e) { } } }   
    Array.prototype.forEach.call(menu.querySelectorAll('[data-modul]'), function (a) {
      var on = a.getAttribute('data-modul') === m.id;
      a.classList.toggle('secili', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var ekstraSecili = MODULLER.some(function (x) { return x.id === m.id && !BAR[x.id]; });
    digerDugme.classList.toggle('secili', ekstraSecili);
    sheet.hidden = true;
    if (aktifTemizle) { aktifTemizle(); aktifTemizle = null; }
    icerik.textContent = '';
    document.title = m.ad + ' — MY Medikal';
    if (m.aktif && window.MM.moduller[m.id]) {
      aktifTemizle = window.MM.moduller[m.id](icerik) || null;
    } else {
      icerik.appendChild(h('section', { sinif: 'yakinda-kutu' }, [
        h('h2', { metin: m.ad }),
        h('p', { metin: 'Bu modül yakında. ' + (m.not || '') })
      ]));
    }
    icerik.scrollTop = 0; window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', git);

   
  function temaUygula(t) { if (t) document.documentElement.setAttribute('data-tema', t); else document.documentElement.removeAttribute('data-tema'); }
  try { temaUygula(localStorage.getItem('mm-tema')); } catch (e) { }
  var temaQ = new URLSearchParams(location.search).get('tema'); if (temaQ === 'koyu' || temaQ === 'acik') temaUygula(temaQ);   
  document.getElementById('tema').addEventListener('click', function () {
    var simdi = document.documentElement.getAttribute('data-tema') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'koyu' : 'acik');
    var yeni = simdi === 'koyu' ? 'acik' : 'koyu';
    temaUygula(yeni);
    try { localStorage.setItem('mm-tema', yeni); } catch (e) { }
  });

   
  var menuAc = document.getElementById('menu-ac'), kabuk = document.querySelector('.kabuk');
  menuAc.addEventListener('click', function () { var g = kabuk.classList.toggle('menu-genis'); menuAc.setAttribute('aria-expanded', String(g)); });
  function kova() { var w = window.innerWidth; return w < 600 ? 'telefon' : (w < 1024 ? 'tablet' : 'genis'); }
  var sonKova = kova(), yenidenT = null;
  function yenidenCiz() { clearTimeout(yenidenT); yenidenT = setTimeout(function () { var k = kova(); if (k !== sonKova) { sonKova = k; if (k === 'genis') kabuk.classList.remove('menu-genis'); git(); } }, 250); }
  window.addEventListener('resize', yenidenCiz); window.addEventListener('orientationchange', yenidenCiz);
  window.addEventListener('DOMContentLoaded', function () { YUKLENDI = true; filtrele(); menuKur(); if (window.MM_AYAR && window.MMVeri) window.MM.acikHazir.then(git); });   

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(function () {   });
  }
})();
