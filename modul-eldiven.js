





(function () {
  'use strict';
  var MM = window.MM, h = MM.h, S = MM.svg, sayi = MM.sayi;
  var zamanTm = null;   
  var ESKI_DK = 360;   

  var LIMAN = {   
    AMB: [40.96, 28.69, 'Ambarlı'], AMBA: [41.06, 28.83, 'Ambarlı antrepo'], ALI: [38.80, 26.93, 'Aliağa'], IZM: [38.44, 27.14, 'İzmir'],
    KLG: [2.95, 101.25, 'Port Klang'], PEN: [5.35, 100.2, 'Penang'], SG: [1.22, 103.85, 'Singapur'], NGB: [29.9, 122.1, 'Ningbo'],
    QIN: [36.0, 120.5, 'Qingdao'], SHA: [30.7, 122.3, 'Şanghay'], PS: [31.4, 32.35, 'Port Said'], MLT: [35.85, 14.55, 'Malta'],
    PIR: [37.93, 23.6, 'Pire'], BEY: [33.9, 35.5, 'Beyrut'], NAP: [40.82, 14.25, 'Napoli'], MNL: [14.55, 120.85, 'Manila'],
    POTI: [42.15, 41.62, 'Poti'], SKG: [40.6, 22.92, 'Selanik'], BGS: [42.49, 27.47, 'Burgaz'], GDN: [54.4, 18.67, 'Gdańsk'],
    CAU: [18.42, -69.63, 'Caucedo'], JKT: [-6.1, 106.88, 'Cakarta']
  };
  var TR_LIMAN = { AMB: 1, AMBA: 1, ALI: 1, IZM: 1 };
  var N = {   
    QIN: [36.0, 120.5], Y1: [34.6, 123.0], NGB: [29.9, 122.1], SHA: [30.7, 122.3], E1: [29.4, 123.2], T1: [24.8, 119.9], H1: [21.6, 115.8],
    M1: [16.4, 119.4], MNL: [14.55, 120.85], S1: [12.0, 110.4], S2: [6.0, 106.3], S3: [1.6, 104.6], SG: [1.22, 103.85], MA1: [1.9, 102.4],
    KLG: [2.95, 101.25], MA3: [4.4, 99.9], PEN: [5.35, 100.2], MA4: [5.9, 97.6], AN1: [6.1, 94.2], DH: [5.5, 80.6], AR1: [9.5, 66.0],
    SO1: [12.4, 53.6], GA1: [12.1, 47.0], BAB: [12.6, 43.35], RS1: [15.6, 41.8], RS2: [20.0, 38.6], RS3: [24.8, 35.6], RS4: [27.7, 33.85],
    SUE: [29.85, 32.55], PS: [31.4, 32.35], E2: [32.6, 30.0], E3: [34.1, 27.4], KAS: [35.35, 26.55], AE1: [36.7, 25.7], AE2: [37.75, 26.25],
    AEW: [38.3, 25.55], CHS: [38.35, 26.2], IZG: [38.75, 26.55], IZ2: [38.58, 26.9], IZM: [38.44, 27.14], ALI: [38.8, 26.93], AE3: [39.15, 25.6],
    AE4: [39.7, 25.8], DAR1: [40.02, 26.15], DAR2: [40.22, 26.42], DAR3: [40.42, 26.72], MAR1: [40.68, 27.55], MAR2: [40.85, 28.3], AMB: [40.96, 28.69]
  };
  var ORTAK = ['AN1', 'DH', 'AR1', 'SO1', 'GA1', 'BAB', 'RS1', 'RS2', 'RS3', 'RS4', 'SUE', 'PS', 'E2', 'E3', 'KAS', 'AE1'];
  var KOK = {
    KLG: ['KLG', 'MA3', 'MA4'], PEN: ['PEN', 'MA4'], SG: ['SG', 'MA1', 'KLG', 'MA3', 'MA4'],
    QIN: ['QIN', 'Y1', 'E1', 'T1', 'H1', 'S1', 'S2', 'S3', 'SG', 'MA1', 'KLG', 'MA3', 'MA4'],
    NGB: ['NGB', 'E1', 'T1', 'H1', 'S1', 'S2', 'S3', 'SG', 'MA1', 'KLG', 'MA3', 'MA4'],
    SHA: ['SHA', 'E1', 'T1', 'H1', 'S1', 'S2', 'S3', 'SG', 'MA1', 'KLG', 'MA3', 'MA4'],
    MNL: ['MNL', 'M1', 'S1', 'S2', 'S3', 'SG', 'MA1', 'KLG', 'MA3', 'MA4']
  };
  var KUYRUK = {
    AMB: ['AE2', 'AEW', 'AE3', 'AE4', 'DAR1', 'DAR2', 'DAR3', 'MAR1', 'MAR2', 'AMB'], AMBA: ['AE2', 'AEW', 'AE3', 'AE4', 'DAR1', 'DAR2', 'DAR3', 'MAR1', 'MAR2', 'AMB'],
    ALI: ['AE2', 'CHS', 'IZG', 'ALI'], IZM: ['AE2', 'CHS', 'IZG', 'IZ2', 'IZM']
  };
  function rotaNoktalari(a, b) {   
    var pa = LIMAN[a], pb = LIMAN[b];
    if (!pa || !pb) return null;
    if (KOK[a] && KUYRUK[b]) return KOK[a].concat(ORTAK, KUYRUK[b]).map(function (k) { return N[k]; });
    if (KOK[a]) return KOK[a].concat(ORTAK.slice(0, 15)).map(function (k) { return N[k]; }).concat([[pb[0], pb[1]]]);   
    return [[pa[0], pa[1]], [pb[0], pb[1]]];
  }

  var DURUM_AD = {
    yolda: 'Yolda', pre: 'Kalkış öncesi', liman: 'Limanda', late: 'Serbest süre doldu', antrepo: 'Antrepoda',
    hold: 'Hold', bekliyor: 'Bekliyor', ithal: 'İthal edildi', teslim: 'Varış yerinde'
  };

   
  function bugunSeri() {   
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var g = function (t) { return +p.filter(function (x) { return x.type === t; })[0].value; };
    return Date.UTC(g('year'), g('month') - 1, g('day')) / 864e5 + 25569 + ((g('hour') % 24) + g('minute') / 60) / 24;
  }
  function tarihMetin(seri) {
    if (seri == null || !isFinite(seri)) return '—';
    var d = new Date(Math.round((seri - 25569) * 864e5));
    var z = function (n) { return (n < 10 ? '0' : '') + n; };
    return z(d.getUTCDate()) + '.' + z(d.getUTCMonth() + 1) + '.' + d.getUTCFullYear();
  }
  function adet(c, n) { var s = sayi(n); return s == null ? '—' : s + (c.unit === 'pairs' ? ' çift' : ' adet'); }
  function usd(n) { var s = sayi(n, 2); return s == null ? '—' : '$' + s; }
  function sonBacak(c) { var l = c.legs || []; return l.length ? l[l.length - 1] : null; }
  function limanAd(k) { return k ? (LIMAN[k] ? LIMAN[k][2] : k) : '—'; }
  function musteriAd(v, kod) { var m = v.customers && v.customers[kod]; return m ? m[0] : (kod || 'Atanmamış'); }
  function urunAd(v, kod) { var p = v.products && v.products[kod]; return p ? p[0] : (kod || '—'); }

   
  function durumAl(c, now) {
    var legs = c.legs || [], dep = legs.length ? legs[0][2] : null, arr = legs.length ? legs[legs.length - 1][3] : null;
    var sonuc = { ds: c.st, grup: 'bekleyen', at: c.at, arr: arr, dep: dep };
    if (!legs.length) { sonuc.ds = (c.st === 'hold' ? 'hold' : 'bekliyor'); return sonuc; }
    if (c.st === 'hold' || c.st === 'bekliyor') { sonuc.ds = c.st; sonuc.at = legs[0][0]; return sonuc; }
    

    var tarihIleri = dep == null || !isFinite(dep) || now < dep || arr == null || !isFinite(arr) || now < arr;
    if (tarihIleri && (c.st === 'ithal' || c.st === 'teslim' || c.st === 'antrepo')) {
      sonuc.celiski = true; sonuc.at = c.at || legs[legs.length - 1][1];
      sonuc.ds = c.st; sonuc.grup = c.st === 'antrepo' ? 'liman' : 'gelen'; return sonuc;   
    }
    if (dep == null || !isFinite(dep)) { sonuc.ds = 'pre'; sonuc.at = legs[0][0]; return sonuc; }
    if (now < dep) { sonuc.ds = 'pre'; sonuc.at = legs[0][0]; return sonuc; }
    if (arr == null || !isFinite(arr) || now < arr) {
      sonuc.ds = 'yolda'; sonuc.grup = 'yolda'; sonuc.kalan = (arr == null || !isFinite(arr)) ? null : Math.ceil(arr - now);
      return sonuc;
    }
    var gun = Math.floor(now - arr), serbest = c.free != null ? c.free : null;
    sonuc.gun = gun; sonuc.serbest = serbest;
    if (c.st === 'ithal') { sonuc.ds = 'ithal'; sonuc.grup = 'gelen'; return sonuc; }
    if (c.st === 'teslim') { sonuc.ds = 'teslim'; sonuc.grup = 'teslim'; return sonuc; }
    if (c.st === 'antrepo') { sonuc.ds = 'antrepo'; sonuc.grup = 'liman'; return sonuc; }
    sonuc.ds = 'liman'; sonuc.grup = 'liman';
    if (serbest != null) {
      sonuc.kalanSerbest = serbest - gun;
      if (gun > serbest) sonuc.ds = 'late';
    }
    return sonuc;
  }
  function riskSinif(d) {
    if (d.ds === 'late') return 'kirmizi';
    if (d.ds === 'liman' && d.kalanSerbest != null && d.kalanSerbest <= 3) return 'sari';
    return '';
  }

   
  function finansYetkisi() {
    if (window.MMVeri.mod() === 'graph') return window.MMVeri.ozelErisim('eldiven-yonetim');   
    var r = MM.rol(), t = (window.MM_AYAR.roller || {}).eldivenFinans || ['yonetim', 'eldiven-finans'];
    return t.indexOf(r) >= 0;
  }
  async function yukle() {
    if (finansYetkisi()) {
      try {
        var y = await window.MMVeri.oku('eldiven', 'eldiven-yonetim', 'eldiven-yonetim');
        return { r: y, finans: true, uyari: null };
      } catch (e) {
        var p = await window.MMVeri.oku('eldiven', 'eldiven-personel');
        return { r: p, finans: false, uyari: null };
      }
    }
    return { r: await window.MMVeri.oku('eldiven', 'eldiven-personel'), finans: false, uyari: null };
  }
  function hazirla(v, nowOver) {   
    var now = nowOver != null ? nowOver : bugunSeri();
    return { now: now, liste: (v.containers || []).map(function (c) { return { c: c, d: durumAl(c, now) }; }) };
  }
  function ozet(hz) {
    var o = { yolda: 0, hafta: 0, limanda: 0, dolan: 0, yoldaAdet: 0 };
    hz.liste.forEach(function (x) {
      if (x.d.grup === 'yolda') { o.yolda++; if (x.d.kalan != null && x.d.kalan <= 7) o.hafta++; if (x.c.unit !== 'pairs') o.yoldaAdet += x.c.qty || 0; }
      if (x.d.ds === 'liman' || x.d.ds === 'late') o.limanda++;
      if (x.d.ds === 'late') o.dolan++;
    });
    return o;
  }
  MM.eldiven = { yukle: yukle, hazirla: hazirla, ozet: ozet, href: hrefK, tarih: tarihMetin, durumAd: DURUM_AD, limanAd: limanAd, musteriAd: musteriAd };

   
  var G = MM.gr;
  function hrefK(id) { return '#eldiven/konteyner/' + encodeURIComponent(id); }
  function gun0(s) { return Math.floor(s); }
  function tarihKisa(seri) { var t = tarihMetin(seri); return t === '—' ? t : t.slice(0, 5); }
  function dtOf(seri) { return new Date(Math.round((seri - 25569) * 864e5)); }
  var GUN_AD = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'], AY_AD = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  function rozet(ds, d) { var r = h('span', { sinif: 'eld-rozet ' + ds, metin: DURUM_AD[ds] || ds }); if (!d || !d.celiski) return r; return h('span', { sinif: 'eld-r1' }, [r, h('span', { sinif: 'etiket kismi', title: 'Belgeli durum (' + (DURUM_AD[ds] || ds) + ') ile varış tarihi çelişiyor; durum esas alındı, tarih düzeltmesi harita güncellemesinde', metin: 'durum–tarih çelişkisi' })]); }
  function canliIsareti(c) {
    return c.live ? h('span', { sinif: 'eld-canli', title: 'Armatör/AIS canlı takibiyle doğrulanmış' }, [h('i'), 'canlı takip'])
      : h('span', { sinif: 'eld-liste', title: 'Tarihler forwarder/Excel listesinden; canlı takip yok' }, ['liste verisi']);
  }
  function musteriMetni(v, c) {
    var kodlar = []; (c.lots || []).forEach(function (l) { var a = musteriAd(v, l.cus); if (kodlar.indexOf(a) < 0) kodlar.push(a); });
    return kodlar.join(', ') || '—';
  }
  function serbestBand(kalan) {   
    if (kalan == null) return null;
    if (kalan < 0) return { ad: 'Süre aşıldı', renk: 'var(--kritik)', sinif: 'kritik', ikon: 'uyari', metin: (-kalan) + ' gün aşıldı' };
    if (kalan <= 3) return { ad: 'Son 3 gün', renk: 'var(--ciddi)', sinif: 'ciddi', ikon: 'uyari', metin: kalan === 0 ? 'bugün son gün' : kalan + ' gün kaldı' };
    if (kalan <= 7) return { ad: '4–7 gün', renk: 'var(--uyari)', sinif: 'uyari', ikon: 'saat', metin: kalan + ' gün kaldı' };
    return { ad: '8+ gün', renk: 'var(--iyi)', sinif: 'iyi', ikon: 'tik', metin: kalan + ' gün kaldı' };
  }
  function konumMetni(c, d) {
    var sonLeg = sonBacak(c);
    if (d.grup === 'yolda') return '→ ' + limanAd(sonLeg && sonLeg[1]) + (d.arr != null ? ' · ETA ' + tarihMetin(d.arr) : ' · ETA yok') + (d.kalan != null ? ' · ' + (d.kalan <= 0 ? 'bugün/yarın' : d.kalan + ' gün kaldı') : '');
    if (d.gun != null) return limanAd(c.at) + ' · ' + d.gun + ' gündür' + (d.kalanSerbest != null ? (d.kalanSerbest < 0 ? ' · serbest süre ' + (-d.kalanSerbest) + ' gün aşıldı' : ' · serbest süreye ' + d.kalanSerbest + ' gün') : '');
    if (d.ds === 'pre') return limanAd(d.at) + ' · kalkış ' + tarihMetin(d.dep);
    return limanAd(d.at);
  }
  function ilerleme(d, now) {   
    if (d.dep == null || d.arr == null || !isFinite(d.dep) || !isFinite(d.arr)) return null;
    if (now >= d.arr) return 1; if (now <= d.dep) return 0; return (now - d.dep) / (d.arr - d.dep);
  }
  var SIRA_GRUP = { yolda: 0, liman: 1, bekleyen: 2, gelen: 3, teslim: 4 };
  function tumSira(hz) {
    return hz.liste.slice().sort(function (a, b) {
      var ga = SIRA_GRUP[a.d.grup] == null ? 9 : SIRA_GRUP[a.d.grup], gb = SIRA_GRUP[b.d.grup] == null ? 9 : SIRA_GRUP[b.d.grup];
      if (ga !== gb) return ga - gb;
      var ka = a.d.grup === 'liman' ? (a.d.kalanSerbest == null ? 1e9 : a.d.kalanSerbest) : (a.d.arr == null ? 1e9 : a.d.arr), kb = b.d.grup === 'liman' ? (b.d.kalanSerbest == null ? 1e9 : b.d.kalanSerbest) : (b.d.arr == null ? 1e9 : b.d.arr);
      return ka - kb || (a.c.id < b.c.id ? -1 : 1);
    });
  }

   
  function kartSatir(v, x, now) {
    var c = x.c, d = x.d, risk = riskSinif(d), p = d.grup === 'yolda' ? ilerleme(d, now) : null;
    var k = h('a', { href: hrefK(c.id), sinif: 'kart2 eld-k ' + risk, 'aria-label': 'Konteyner ' + c.id + ' ayrıntısı' }, [
      h('span', { sinif: 'eld-r1' }, [h('b', { sinif: 'eld-no', metin: c.id }), rozet(d.ds, d), canliIsareti(c)]),
      h('span', { sinif: 'eld-r2', metin: urunAd(v, c.prd) + ' · ' + adet(c, c.qty) }),
      h('span', { sinif: 'eld-r3', metin: musteriMetni(v, c) })]);
    if (p != null) k.appendChild(h('span', { sinif: 'eld-ilerle', title: 'Tarihlere göre tahmini ilerleme' }, [h('i', { style: 'width:' + Math.round(p * 100) + '%' })]));
    k.appendChild(h('span', { sinif: 'eld-r4 ' + risk, metin: konumMetni(c, d) }));
    k.appendChild(h('span', { sinif: 'eld-r5', metin: (c.vessels ? 'Gemi: ' + c.vessels.split(' · ')[0] : 'Gemi bilgisi yok') + (c.bl ? ' · BL ' + c.bl : '') }));
    return k;
  }
  function listeIzgara(v, liste, now) { return G.sayfali(liste, function (x) { return kartSatir(v, x, now); }, { sinif: 'eld-liste-izgara' }); }   

   
  function kpiSeridi(hz, git) {
    var o = ozet(hz), bug = gun0(hz.now), gunluk = [0, 0, 0, 0, 0, 0, 0, 0];
    hz.liste.forEach(function (x) { if (x.d.grup === 'yolda' && x.d.arr != null) { var i = gun0(x.d.arr) - bug; if (i >= 0 && i < 8) gunluk[i]++; } });
    return h('div', { sinif: 'kpi-izgara eld-kpi' }, [
      G.kpi({ baslik: 'Yoldaki konteyner', deger: String(o.yolda), ikon: 'gemi', alt: o.yoldaAdet ? sayi(Math.round(o.yoldaAdet / 1e5) / 10, 1) + ' milyon adet yolda' : null, tikla: function () { git('yolda'); } }),
      G.kpi({ baslik: 'Bu hafta varacak', deger: String(o.hafta), ikon: 'takvim', spark: gunluk, sparkAd: 'Önümüzdeki 8 günde günlük varış sayısı', alt: '7 gün içinde ETA · çizgi: günlük varış', durum: o.hafta ? 'uyari' : null, tikla: function () { git('takvim'); } }),
      G.kpi({ baslik: 'Limanda bekleyen', deger: String(o.limanda), ikon: 'kutu', tikla: function () { git('liman'); } }),
      G.kpi({ baslik: 'Serbest süresi dolan', deger: String(o.dolan), ikon: 'uyari', durum: o.dolan ? 'kritik' : null, alt: o.dolan ? 'demuraj/ardiye işliyor olabilir' : 'süresi dolan yok', tikla: function () { git('liman'); } })
    ]);
  }

   
  function riskKarti(v, hz) {
    var l = hz.liste.filter(function (x) { return x.d.grup === 'liman'; });
    var bilgili = l.filter(function (x) { return x.d.kalanSerbest != null; }).sort(function (a, b) { return a.d.kalanSerbest - b.d.kalanSerbest; });
    var bilgisiz = l.filter(function (x) { return x.d.kalanSerbest == null; });
    var kap = h('div', { sinif: 'eld-risk' });
    bilgili.forEach(function (x) {
      var b = serbestBand(x.d.kalanSerbest), oran = Math.min(1, x.d.gun / (x.d.serbest || 1));
      kap.appendChild(h('a', { href: hrefK(x.c.id), sinif: 'eld-risk-satir ' + b.sinif, style: '--band:' + b.renk }, [
        h('span', { sinif: 'rk-band' }, [G.ikon(b.ikon, 16), h('b', { metin: b.ad })]),
        h('span', { sinif: 'rk-ad' }, [h('b', { metin: x.c.id }), h('small', { metin: limanAd(x.c.at) + ' · ' + musteriMetni(v, x.c) })]),
        h('span', { sinif: 'rk-yol', title: x.d.gun + ' / ' + x.d.serbest + ' gün' }, [h('i', { style: 'width:' + Math.round(oran * 100) + '%' })]),
        h('span', { sinif: 'rk-metin' }, [h('b', { metin: b.metin }), h('small', { metin: x.d.gun + '/' + x.d.serbest + ' gün' })])]));
    });
    if (!bilgili.length) kap.appendChild(h('p', { sinif: 'veri-yok', metin: 'Serbest süresi bilinen limanda konteyner yok.' }));
    if (bilgisiz.length) kap.appendChild(h('p', { sinif: 'kucuk soluk eld-bilgisiz', metin: 'Serbest süre bilgisi kayıtta olmayan ' + bilgisiz.length + ' konteyner risk listesine alınmadı: ' + bilgisiz.map(function (x) { return x.c.id; }).join(', ') + '.' }));
    kap.appendChild(G.lejant([['Süre aşıldı', 'var(--kritik)'], ['Son 3 gün', 'var(--ciddi)'], ['4–7 gün', 'var(--uyari)'], ['8+ gün', 'var(--iyi)']]));
    return G.kart({ baslik: 'Serbest süre / ardiye riski', alt: 'Limandaki konteynerler, kalan serbest güne göre (aşılanlar üstte)', govde: kap,
      tablo: { kolonlar: ['Konteyner', 'Liman', 'Limanda (gün)', 'Serbest süre (gün)', 'Kalan'], satirlar: bilgili.map(function (x) { return [x.c.id, limanAd(x.c.at), x.d.gun, x.d.serbest, x.d.kalanSerbest]; }) } });
  }

   
  function zamanSekmesi(v, hz, st, yenile) {
    var kok = h('div'), now = hz.now, bug = gun0(now), tarihli = [], tarihsiz = [];
    hz.liste.forEach(function (x) { var d = x.d; if (d.dep != null && isFinite(d.dep) && d.arr != null && isFinite(d.arr)) tarihli.push(x); else tarihsiz.push(x); });
    var aktifG = { yolda: 1, liman: 1, bekleyen: 1 };
    var aktif = tarihli.filter(function (x) { return aktifG[x.d.grup]; });
    var gor = (st.kapsam === 'tum' ? tarihli : aktif).slice().sort(function (a, b) { return a.d.dep - b.d.dep; });
    kok.appendChild(h('div', { sinif: 'eld-araclar' }, [
      G.cipler([['hafta', 'Hafta ölçeği'], ['ay', 'Ay ölçeği']], st.olcek, function (d) { st.olcek = d; yenile(); }, 'Ölçek'),
      G.cipler([['aktif', 'Aktif', aktif.length], ['tum', 'Tümü', tarihli.length]], st.kapsam, function (d) { st.kapsam = d; yenile(); }, 'Kapsam')]));
    if (!gor.length) { kok.appendChild(G.bos({ baslik: 'Gösterilecek sevkiyat yok', metin: 'Kalkış ve varış tarihi kayıtlı konteyner bulunamadı.' })); }
    else {
      var ppd = st.olcek === 'ay' ? 6 : 22, RH = 44, TOP = 30, mn = bug - 7, mx = bug + 21;
      gor.forEach(function (x) { mn = Math.min(mn, gun0(x.d.dep) - 2); var son = x.d.arr + (x.c.free != null ? x.c.free : 0); mx = Math.max(mx, gun0(son) + 12); });
      var gunSay = mx - mn, Wd = gunSay * ppd, Hd = TOP + gor.length * RH, X = function (s) { return (s - mn) * ppd; };
      var svg = S('svg', { viewBox: '0 0 ' + Wd + ' ' + Hd, width: Wd, height: Hd, class: 'eld-gantt-svg', role: 'group', 'aria-label': 'Sevkiyat zaman çizelgesi' });
      gor.forEach(function (x, i) { if (i % 2) svg.appendChild(S('rect', { x: 0, y: TOP + i * RH, width: Wd, height: RH, class: 'g-seri' })); });
      var d0 = dtOf(mn), t;
      if (st.olcek === 'ay') { for (var yy = d0.getUTCFullYear(), mm = d0.getUTCMonth() + 1; ; mm++) { if (mm > 11) { mm = 0; yy++; } var ser = Date.UTC(yy, mm, 1) / 864e5 + 25569; if (ser > mx) break; svg.appendChild(S('line', { x1: X(ser), x2: X(ser), y1: 0, y2: Hd, class: 'g-izgara' })); var tx = S('text', { x: X(ser) + 4, y: 19, class: 'g-yazi' }); tx.textContent = AY_AD[mm] + (mm === 0 ? ' ' + yy : ''); svg.appendChild(tx); } }
      else { var pzt = mn + ((8 - (d0.getUTCDay() || 7)) % 7); for (t = pzt; t < mx; t += 7) { svg.appendChild(S('line', { x1: X(t), x2: X(t), y1: 0, y2: Hd, class: 'g-izgara' })); var tx2 = S('text', { x: X(t) + 4, y: 19, class: 'g-yazi' }); tx2.textContent = tarihKisa(t); svg.appendChild(tx2); } }
      svg.appendChild(S('line', { x1: 0, x2: Wd, y1: TOP, y2: TOP, class: 'g-eksen' }));
      gor.forEach(function (x, i) {
        var c = x.c, d = x.d, y = TOP + i * RH, by = y + 15, bh = 14, x1 = X(d.dep), x2 = X(d.arr), w = Math.max(x2 - x1, 6), geldi = now >= d.arr, yoldaMi = now >= d.dep && !geldi;
        var g = S('g', { class: 'g-eld-sat', tabindex: '0', role: 'link', 'aria-label': c.id + ', ' + (DURUM_AD[d.ds] || d.ds) + ', kalkış ' + tarihMetin(d.dep) + ', varış ' + tarihMetin(d.arr) + (c.free != null ? ', serbest süre ' + c.free + ' gün' : '') });
        g.appendChild(S('rect', { x: x1, y: by, width: w, height: bh, rx: 7, class: geldi ? 'gb-geldi' : (yoldaMi ? 'gb-yolda' : 'gb-pre') }));
        if (yoldaMi) g.appendChild(S('rect', { x: x1, y: by, width: Math.max(4, (now - d.dep) * ppd), height: bh, rx: 7, class: 'gb-ilerle' }));
        var son = x2;
        if (c.free != null) {
          var fe = d.arr + c.free, kal = geldi ? c.free - Math.floor(now - d.arr) : null, b = kal == null ? null : serbestBand(kal);
          g.appendChild(S('rect', { x: x2, y: by + 3, width: Math.max(2, (fe - d.arr) * ppd), height: bh - 6, rx: 4, class: 'gb-serbest' + (b ? '' : ' plan'), style: b ? '--band:' + b.renk : null }));
          if (geldi) g.appendChild(S('rect', { x: x2, y: by + 3, width: Math.max(2, Math.min(fe, now) - d.arr) * ppd, height: bh - 6, rx: 4, class: 'gb-gecen', style: '--band:' + b.renk }));
          son = X(fe);
        }
        var tt = S('text', { x: Math.max(son, x2) + 6, y: by + 11, class: 'g-yazi gb-et' }); tt.textContent = (geldi ? 'vardı ' : 'ETA ') + tarihKisa(d.arr); g.appendChild(tt);
        g.appendChild(S('rect', { x: Math.min(x1, x2) - 4, y: y, width: Math.abs(Math.max(son, x2) - x1) + 80, height: RH, fill: 'transparent', class: 'g-hit' }));
        g.addEventListener('click', function () { location.hash = hrefK(c.id); }); g.addEventListener('keydown', function (e) { if (e.key === 'Enter') location.hash = hrefK(c.id); });
        svg.appendChild(g);
      });
      svg.appendChild(S('line', { x1: X(now), x2: X(now), y1: 22, y2: Hd, class: 'g-bugun' }));
      var bp = S('g'); bp.appendChild(S('rect', { x: X(now) - 22, y: 3, width: 44, height: 17, rx: 8, class: 'g-bugun-rozet' })); var bt = S('text', { x: X(now), y: 15, 'text-anchor': 'middle', class: 'g-bugun-yazi' }); bt.textContent = 'bugün'; bp.appendChild(bt); svg.appendChild(bp);
      var etiketler = h('div', { sinif: 'eld-g-etiket' }, [h('div', { sinif: 'eld-g-bos', style: 'height:' + TOP + 'px' })]);
      gor.forEach(function (x) { etiketler.appendChild(h('a', { href: hrefK(x.c.id), sinif: 'eld-g-ad', style: 'height:' + RH + 'px' }, [h('b', { metin: x.c.id }), h('small', { metin: musteriMetni(v, x.c) })])); });
      var pane = h('div', { sinif: 'eld-g-pane', tabindex: '0', 'aria-label': 'Zaman çizelgesi (yatay kaydırılır)' }, [svg]);
      kok.appendChild(G.kart({ baslik: 'Sevkiyat zaman çizelgesi', alt: 'Çubuk: kalkış → varış (ETD → ETA). Çubuğun sağındaki ince bant: serbest süre. Satıra dokununca ayrıntı açılır.',
        govde: h('div', { sinif: 'eld-gantt' }, [etiketler, pane]),
        tablo: { kolonlar: ['Konteyner', 'Durum', 'Kalkış', 'Varış', 'Serbest süre'], satirlar: gor.map(function (x) { return [x.c.id, DURUM_AD[x.d.ds] || x.d.ds, tarihMetin(x.d.dep), tarihMetin(x.d.arr), x.c.free != null ? x.c.free + ' gün' : '—']; }) },
        dip: 'Tarihler liste/forwarder kaynaklıdır' + (v.takip && v.takip.takipli_n ? '' : '') }));
      var lj = G.lejant([['Yolda (dolu kısım: bugüne kadar)', 'var(--s1)'], ['Kalkış öncesi', 'var(--eksen)'], ['Varış tarihi geçti', 'var(--sk5)'], ['Serbest süre — kalan yeterli', 'var(--iyi)'], ['Serbest süre — az/aşıldı', 'var(--kritik)'], ['Planlanan serbest süre (henüz varmadı)', 'var(--vurgu-zemin)', 'tx']]);
      kok.appendChild(lj);
      kok._sonra = function () { pane.scrollLeft = Math.max(0, X(now) - pane.clientWidth * 0.8); };
    }
    if (tarihsiz.length) {
      var cs = h('div', { sinif: 'eld-cip-sira' }); tarihsiz.forEach(function (x) { cs.appendChild(h('a', { href: hrefK(x.c.id), sinif: 'eld-cip-link' }, [h('b', { metin: x.c.id }), ' ', h('span', { sinif: 'soluk', metin: DURUM_AD[x.d.ds] || x.d.ds })])); });
      kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Tarihi yok (' + tarihsiz.length + ')', alt: 'Kalkış/varış tarihi kayıtta olmayan konteynerler çizelgeye konmaz.', govde: cs })]));
    }
    return kok;
  }

   
  function takvimSekmesi(v, hz, st, yenile) {
    var kok = h('div'), now = hz.now, bug = gun0(now);
    var pazartesi = bug - ((dtOf(bug).getUTCDay() + 6) % 7) + 7 * st.hafta, bas = pazartesi, bit = pazartesi + 6;
    var haftaIci = hz.liste.filter(function (x) { return x.d.arr != null && isFinite(x.d.arr) && gun0(x.d.arr) >= bas && gun0(x.d.arr) <= bit; });
    var etasiz = hz.liste.filter(function (x) { return x.d.grup === 'yolda' && (x.d.arr == null || !isFinite(x.d.arr)); }).length;
    var gezgin = h('div', { sinif: 'eld-hafta-baslik' }, [
      h('button', { type: 'button', sinif: 'mini-dugme', 'aria-label': 'Önceki hafta', onclick: function () { st.hafta--; yenile(); } }, [G.ikon('sol', 16), ' Önceki']),
      h('div', { sinif: 'eld-hafta-ad' }, [h('b', { metin: tarihMetin(bas).slice(0, 5) + ' – ' + tarihMetin(bit).slice(0, 5) + '.' + tarihMetin(bit).slice(6) }), h('small', { metin: haftaIci.length + ' varış' + (st.hafta === 0 ? ' · bu hafta' : '') })]),
      h('button', { type: 'button', sinif: 'mini-dugme', 'aria-label': 'Sonraki hafta', onclick: function () { st.hafta++; yenile(); } }, ['Sonraki ', G.ikon('sag', 16)])]);
    if (st.hafta !== 0) gezgin.appendChild(h('button', { type: 'button', sinif: 'mini-dugme', onclick: function () { st.hafta = 0; yenile(); } }, ['Bu hafta']));
    var sonraki = hz.liste.filter(function (x) { return x.d.grup === 'yolda' && x.d.arr != null && isFinite(x.d.arr) && gun0(x.d.arr) >= bug; }).sort(function (a, b) { return a.d.arr - b.d.arr; })[0];
    if (sonraki && (gun0(sonraki.d.arr) < bas || gun0(sonraki.d.arr) > bit)) {
      var hf = Math.floor((gun0(sonraki.d.arr) - (bug - ((dtOf(bug).getUTCDay() + 6) % 7))) / 7);
      gezgin.appendChild(h('button', { type: 'button', sinif: 'mini-dugme', onclick: function () { st.hafta = hf; yenile(); } }, ['Sıradaki varış: ' + tarihKisa(sonraki.d.arr) + ' (' + sonraki.c.id + ')']));
    }
    kok.appendChild(gezgin);
    var izg = h('div', { sinif: 'eld-hafta' });
    for (var i = 0; i < 7; i++) {
      var g = bas + i, liste = haftaIci.filter(function (x) { return gun0(x.d.arr) === g; }).sort(function (a, b) { return a.d.arr - b.d.arr; });
      var sut = h('section', { sinif: 'eld-gun' + (g === bug ? ' bugun' : '') + (g < bug ? ' gecmis' : '') + (liste.length ? '' : ' bos') }, [
        h('header', null, [h('b', { metin: GUN_AD[dtOf(g).getUTCDay()] }), h('span', { metin: tarihKisa(g) }), liste.length ? h('em', { metin: String(liste.length) }) : null])]);
      liste.forEach(function (x) {
        var sinif = riskSinif(x.d);
        sut.appendChild(h('a', { href: hrefK(x.c.id), sinif: 'eld-gun-oge ' + sinif, style: '--d:' + (RENK[x.d.ds] || 'var(--eksen)') }, [h('b', { metin: x.c.id }), h('small', { metin: limanAd(sonBacak(x.c) && sonBacak(x.c)[1]) + ' · ' + (x.d.arr <= now ? 'varış tarihi geçti' : 'bekleniyor') }), h('small', { metin: musteriMetni(v, x.c) }), h('span', { sinif: 'eld-rozet ' + x.d.ds, metin: DURUM_AD[x.d.ds] || x.d.ds })]));
      });
      if (!liste.length) sut.appendChild(h('p', { sinif: 'eld-gun-bos', metin: 'varış yok' }));
      izg.appendChild(sut);
    }
    kok.appendChild(izg);
    kok.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Yalnız kayıtta varış (ETA) tarihi olan konteynerler gösterilir' + (etasiz ? '; ' + etasiz + ' yoldaki konteynerin ETA\'sı kayıtta yok.' : '.') + '' }));
    return kok;
  }
  var RENK = { yolda: 'var(--s1)', pre: 'var(--eksen)', liman: 'var(--s3)', late: 'var(--kritik)', antrepo: 'var(--s7)', hold: 'var(--eksen)', bekliyor: 'var(--eksen)', ithal: 'var(--iyi)', teslim: 'var(--iyi)' };
   
  var KARA = {
    avrasya: [[-5.4, 36], [-2, 36.7], [0, 38.7], [3, 42], [7, 43.3], [10, 44], [12, 42], [16, 38], [17, 40.5], [14, 42.5], [12.5, 45], [14, 45.2], [19, 42], [20, 40], [21.5, 37], [23, 38], [24, 40], [26, 41], [26.5, 39.5], [27, 37.5], [30, 36.3], [33, 36.2], [36, 36.5], [36, 34.5], [35, 33], [34.3, 31.5], [32.5, 31.2], [34.9, 29.5], [35, 28], [37, 24], [39, 21], [41, 17], [43, 13.5], [44.5, 12.7], [48, 13.5], [52, 16], [55, 17.5], [58, 20.5], [59.8, 22.5], [57, 24], [56, 26.2], [54, 24.2], [51.5, 24.5], [50, 26.2], [48.5, 29.5], [48, 30], [50, 30], [51, 28.5], [54, 26.5], [56.5, 27], [58, 25.5], [61.5, 25], [66.5, 25.4], [67.5, 24], [70, 22.5], [72.5, 21], [73, 17], [75, 12], [77, 8], [79, 9], [80, 13], [80, 16], [84, 19], [87, 21.5], [89, 22], [91, 22.7], [92.5, 20], [94, 18], [94.5, 16], [97.5, 16.5], [98.5, 12], [98.5, 9], [100, 6.5], [101, 3.2], [103.5, 1.4], [104.2, 2], [103.5, 5], [102.5, 6.3], [100.3, 13], [101, 12.7], [103, 11], [104.8, 8.7], [106, 10], [107.5, 11], [109, 12], [109, 15], [106.5, 18.5], [106, 20], [108, 21.5], [110, 21], [113, 22], [114.5, 22.5], [117, 23.5], [119, 25.5], [120.5, 27.5], [122, 30], [121.5, 32], [120.5, 34], [119.3, 35.3], [122.5, 37], [120.5, 37.5], [118.8, 38], [118, 39], [120, 40], [122, 40.5], [124, 40], [125, 39.5], [126, 37.5], [126.5, 35], [129.2, 35.2], [129.5, 37], [130.5, 42.5], [133, 43], [135, 43.5], [135, 62], [-10, 62], [-10, 43.3], [-9.2, 43], [-9, 39], [-8.9, 37.2], [-6, 36.7]],
    afrika: [[-5.8, 35.8], [-1, 35.2], [10, 37], [11, 33], [20, 32], [25, 31.5], [32, 31.2], [32.6, 30], [35, 24], [37, 21], [39, 16], [43, 12.5], [51, 11.8], [51, 2], [41, -2], [40, -12], [-10, -12], [-10, 31], [-6, 35.8]],
    sumatra: [[95, 5.5], [98, 4], [104, -1], [106, -5.8], [104.5, -5.8], [101, -2.5], [97, 2]],
    java: [[105.5, -6.5], [114, -7.5], [114.5, -8.5], [106, -7.8]],
    borneo: [[109, 2], [111, 1.5], [114, 4.5], [117, 7], [119, 5], [117, 0], [116, -4], [110, -3]],
    luzon: [[120, 18.5], [122, 18.3], [122, 14], [121, 13.5], [120.2, 15]],
    lanka: [[80, 6], [81.8, 7.5], [80, 9.8], [79.8, 8]],
    tayvan: [[120.2, 22.8], [121.6, 25], [121.5, 23]]
  };
  var SU = {
    karadeniz: [[28, 41.2], [35, 41.8], [41.5, 41.5], [41.5, 43.2], [37, 45], [33, 46], [30, 45.5], [28.5, 43.5]],
    hazar: [[47, 45], [53, 45], [54, 40], [53, 37], [49, 37.5], [49, 40], [47, 43]]
  };
  var W = 1000, Ht = 520, LON0 = -10, LON1 = 145, LAT0 = -12, LAT1 = 62;
  function px(lon) { return (lon - LON0) / (LON1 - LON0) * W; }
  function py(lat) { return (LAT1 - lat) / (LAT1 - LAT0) * Ht; }
  function noktalar(p) { return p.map(function (q) { return px(q[0]).toFixed(1) + ',' + py(q[1]).toFixed(1); }).join(' '); }

  function gemiKonumu(x, now) {
    var c = x.c, l = c.legs || [], ilk = l[0], son = l[l.length - 1];
    if (!ilk || !son || ilk[2] == null || son[3] == null) return null;
    var nok = rotaNoktalari(ilk[0], son[1]);
    if (!nok) return null;
    var f = Math.max(0, Math.min(1, (now - ilk[2]) / (son[3] - ilk[2])));
    var cum = [0]; for (var i = 1; i < nok.length; i++) cum.push(cum[i - 1] + Math.hypot(nok[i][0] - nok[i - 1][0], nok[i][1] - nok[i - 1][1]));
    var hedef = f * cum[cum.length - 1], k = 1; while (k < cum.length - 1 && cum[k] < hedef) k++;
    var t = (hedef - cum[k - 1]) / ((cum[k] - cum[k - 1]) || 1);
    return { lat: nok[k - 1][0] + (nok[k][0] - nok[k - 1][0]) * t, lon: nok[k - 1][1] + (nok[k][1] - nok[k - 1][1]) * t, nok: nok };
  }


   
  var ONAYAR = { 'Tümü': [0, 0, W, Ht], 'Doğu Asya': [px(95), py(40), 55 / (LON1 - LON0) * W, 52 / (LAT1 - LAT0) * Ht], 'Hint – Kızıldeniz': [px(30), py(32), 85 / (LON1 - LON0) * W, 44 / (LAT1 - LAT0) * Ht], 'Akdeniz – Türkiye': [px(12), py(46), 36 / (LON1 - LON0) * W, 17 / (LAT1 - LAT0) * Ht] };
  function Sx(tag, a, ch) { var k = []; ['stroke-width', 'stroke-dasharray', 'font-size'].forEach(function (n) { if (a && a[n] != null) { k.push(n + ':' + a[n] + (n === 'font-size' ? 'px' : '')); delete a[n]; } }); if (k.length) a.style = k.join(';') + (a.style ? ';' + a.style : ''); return MM.svg(tag, a, ch); }
  function haritaSekmesi(v, hz, st) {
    var S = Sx;
    var kok = h('div'), hz0 = hz, yolcular = [], sec = null, say = {};
    if (!st.vb) st.vb = [0, 0, W, Ht];
    var sel = h('select', { sinif: 'eld-sec', 'aria-label': 'Rotasını görmek istediğiniz yoldaki konteyner', onchange: function () { st.harita = sel.value; yenileSec(); } });
    function secenekCiz() {
      sel.textContent = '';
      sel.appendChild(h('option', { value: '', metin: 'Hepsi — rota seçilmedi' }));
      yolcular.forEach(function (x) { sel.appendChild(h('option', { value: x.c.id, selected: sec && sec.c.id === x.c.id ? true : null, metin: x.c.id + ' → ' + limanAd(sonBacak(x.c) && sonBacak(x.c)[1]) + ' · ETA ' + tarihKisa(x.d.arr) })); });
    }
    function hesapla() {   
      hz = st.zaman != null ? hazirla(v, st.zaman) : hz0;
      yolcular = hz.liste.filter(function (x) { return x.d.grup === 'yolda'; });
      sec = st.harita ? hz.liste.filter(function (x) { return x.c.id === st.harita; })[0] : null;
      say = {};
      hz.liste.forEach(function (x) { if (x.d.grup === 'liman' || x.d.grup === 'bekleyen' || x.d.grup === 'gelen') { var k = x.d.at; if (k) { say[k] = say[k] || { n: 0, risk: 0 }; say[k].n++; if (x.d.ds === 'late') say[k].risk++; } } });
    }
    hesapla(); secenekCiz();
     
    var zMn = hz0.now - 30, zMx = hz0.now + 30;
    hz0.liste.forEach(function (x) { var lg = x.c.legs || []; if (lg.length) { var a = lg[0][2], b = lg[lg.length - 1][3]; if (a != null && isFinite(a)) zMn = Math.min(zMn, a - 2); if (b != null && isFinite(b)) zMx = Math.max(zMx, b + 5); } });
    zMn = Math.floor(zMn); zMx = Math.ceil(zMx);
    var zEt = h('b', { sinif: 'eld-zaman-et' }), zDug = h('button', { type: 'button', sinif: 'mini-dugme', 'aria-label': 'Oynat' }, ['▶']);
    var zIn = h('input', { type: 'range', min: String(zMn), max: String(zMx), step: '1', sinif: 'eld-zaman-in', 'aria-label': 'Tarih' });
    var zBug = h('button', { type: 'button', sinif: 'mini-dugme' }, ['Bugün']);
    function zGuncelle() { var t = st.zaman != null ? st.zaman : hz0.now; zIn.value = String(Math.floor(t)); zEt.textContent = tarihMetin(Math.floor(t)) + (st.zaman == null ? ' · bugün' : ''); }
    function zDur() { if (zamanTm) { clearInterval(zamanTm); zamanTm = null; } zDug.textContent = '▶'; zDug.setAttribute('aria-label', 'Oynat'); }
    function zUygula(t) { st.zaman = t; hesapla(); secenekCiz(); sel.value = st.harita || ''; zGuncelle(); ciz(); panel(); }
    zIn.addEventListener('input', function () { zDur(); zUygula(+zIn.value + 0.5); });
    zBug.addEventListener('click', function () { zDur(); st.zaman = null; zUygula(null); });
    zDug.addEventListener('click', function () {
      if (zamanTm) { zDur(); return; }
      var t = Math.floor(st.zaman != null ? st.zaman : hz0.now); if (t >= zMx) t = zMn;
      zDug.textContent = '❚❚'; zDug.setAttribute('aria-label', 'Durdur');
      zamanTm = setInterval(function () {
        if (!kok.isConnected) { zDur(); return; }
        t += 1; if (t >= zMx) { t = zMx; zUygula(t + 0.5); zDur(); return; }
        zUygula(t + 0.5);
      }, 220);
    });
    var zamanKutu = h('div', { sinif: 'eld-zaman' }, [zDug, zIn, zEt, zBug]);
    var cipKap = h('div', { sinif: 'cip-sira' });
    Object.keys(ONAYAR).forEach(function (k) { cipKap.appendChild(h('button', { type: 'button', sinif: 'cip', 'data-ad': k, onclick: function () { st.vb = ONAYAR[k].slice(); ciz(); } }, [k])); });
    function sinirla(vb) { vb[0] = Math.max(0, Math.min(W - vb[2], vb[0])); vb[1] = Math.max(0, Math.min(Ht - vb[3], vb[1])); return vb; }
    function yakin(f) {
      var vb = st.vb, cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2, w = Math.min(W, Math.max(60, vb[2] * f)), hh = w * Ht / W;
      st.vb = sinirla([cx - w / 2, cy - hh / 2, w, hh]); ciz();
    }
    var arac = h('div', { sinif: 'eld-harita-arac' }, [
      h('button', { type: 'button', sinif: 'mini-dugme eld-zoom', 'aria-label': 'Yakınlaştır', onclick: function () { yakin(0.6); } }, ['+']),
      h('button', { type: 'button', sinif: 'mini-dugme eld-zoom', 'aria-label': 'Uzaklaştır', onclick: function () { yakin(1 / 0.6); } }, ['−'])]);
    var kap = h('div', { sinif: 'eld-harita-kap' }, [arac]), svgHolder = h('div', { sinif: 'eld-harita-svg' });
    kap.appendChild(svgHolder);
    var bilgi = h('div'), disNot = h('p', { sinif: 'kucuk soluk' }), cipSay = h('div', { sinif: 'eld-cipler' });
    function ciz() {
      svgHolder.textContent = '';
      var vb = st.vb, kapW = kap.clientWidth || 340, u = vb[2] / kapW;   
      var svg = S('svg', { viewBox: vb.join(' '), class: 'eld-harita' + (vb[2] < W - 1 ? ' yakin' : ''), role: 'img', 'aria-label': 'Eldiven konteynerlerinin rota şeması (gerçek harita değil)', preserveAspectRatio: 'xMidYMid meet' });
      svg.appendChild(S('rect', { x: 0, y: 0, width: W, height: Ht, class: 'su' }));
      for (var lon = 0; lon <= 130; lon += 30) svg.appendChild(S('line', { x1: px(lon), x2: px(lon), y1: 0, y2: Ht, class: 'izgara', 'stroke-width': u * .8 }));
      for (var lat = 0; lat <= 60; lat += 20) svg.appendChild(S('line', { y1: py(lat), y2: py(lat), x1: 0, x2: W, class: 'izgara', 'stroke-width': u * .8 }));
      Object.keys(KARA).forEach(function (k) { svg.appendChild(S('polygon', { points: noktalar(KARA[k]), class: 'kara', 'stroke-width': u })); });
      Object.keys(SU).forEach(function (k) { svg.appendChild(S('polygon', { points: noktalar(SU[k]), class: 'su-ic', 'stroke-width': u })); });
      var cizilen = {};
      yolcular.forEach(function (x) {
        var g = gemiKonumu(x, hz.now); if (!g) return; var a = x.c.legs[0][0], b = x.c.legs[x.c.legs.length - 1][1], key = a + '>' + b;
        if (sec && sec.c.id === x.c.id) return;
        if (!cizilen[key]) { cizilen[key] = 1; svg.appendChild(S('polyline', { points: noktalar(g.nok.map(function (q) { return [q[1], q[0]]; })), class: 'rota' + (sec ? ' soluk' : ''), 'stroke-width': 1.4 * u, 'stroke-dasharray': (5 * u) + ' ' + (4 * u) })); }
      });
      var gSec = sec ? gemiKonumu(sec, hz.now) : null;
      if (gSec) svg.appendChild(S('polyline', { points: noktalar(gSec.nok.map(function (q) { return [q[1], q[0]]; })), class: 'rota secili', 'stroke-width': 3 * u }));
      var kutular = [], KUME = { AMB: 1, ALI: 1, IZM: 1 }, kumeAktif = vb[2] > 420, kumeN = 0, kumeRisk = 0, dis = [];
      var ETDZ = { NGB: [-8, 14, 'end'], SHA: [8, -6, 'start'], SG: [8, 16, 'start'], KLG: [8, 4, 'start'], PEN: [8, -8, 'start'], MNL: [8, 4, 'start'], QIN: [-8, 4, 'end'] };
      var portlar = Object.keys(LIMAN).filter(function (k) { return k !== 'AMBA'; }).sort(function (a, b) { return ((say[b] ? say[b].n : 0) + (TR_LIMAN[b] ? 1 : 0)) - ((say[a] ? say[a].n : 0) + (TR_LIMAN[a] ? 1 : 0)); });
      var kAx = px(LIMAN.AMB[1]), kAy = py(LIMAN.AMB[0]), kKx = Math.max(vb[0] + 8 * u, kAx - 330 * u), kText = '';
      if (kumeAktif) { Object.keys(KUME).forEach(function (k) { if (say[k]) { kumeN += say[k].n; kumeRisk += say[k].risk; } }); kText = 'Türkiye / Ege limanları: ' + kumeN + ' konteyner' + (kumeRisk ? ' (' + kumeRisk + ' serbest süresi dolan)' : ''); kutular.push([kKx, kAy - 74 * u, kKx + kText.length * 6.6 * u, kAy - 54 * u]); }
      function carp(b) { return kutular.some(function (k) { return b[0] < k[2] && b[2] > k[0] && b[1] < k[3] && b[3] > k[1]; }); }
      portlar.forEach(function (k) {
        var p = LIMAN[k], s = say[k]; if (p[1] < LON0 || p[1] > LON1 || p[0] < LAT0 || p[0] > LAT1) { if (s) dis.push(p[2] + ': ' + s.n); return; }
        var x = px(p[1]), y = py(p[0]);
        if (x < vb[0] - 20 * u || x > vb[0] + vb[2] + 20 * u || y < vb[1] - 20 * u || y > vb[1] + vb[3] + 20 * u) return;
        svg.appendChild(S('circle', { cx: x, cy: y, r: (TR_LIMAN[k] ? 5 : 3.5) * u, class: 'liman' + (TR_LIMAN[k] ? ' tr' : ''), 'stroke-width': u }));
        if (s && s.risk) svg.appendChild(S('circle', { cx: x, cy: y, r: 9 * u, class: 'risk', 'stroke-width': 2 * u }));
        if (KUME[k] && kumeAktif) return;
        var o = ETDZ[k] || [7, -6, 'start'], txt = p[2] + (s ? ' (' + s.n + ')' : ''), wl = txt.length * 6.4 * u, hl = 14 * u, tx = x + o[0] * u, ty = y + o[1] * u;
        var b = o[2] === 'end' ? [tx - wl, ty - hl, tx, ty + 3 * u] : [tx, ty - hl, tx + wl, ty + 3 * u];
        if (carp(b)) return; kutular.push(b);
        var et = S('text', { x: tx, y: ty, class: 'har-et', 'text-anchor': o[2], 'font-size': 12 * u, 'stroke-width': 3 * u }); et.textContent = txt; svg.appendChild(et);
      });
      if (kumeAktif) {
        var kt = S('text', { x: kKx, y: kAy - 60 * u, class: 'har-et kume', 'text-anchor': 'start', 'font-size': 12 * u, 'stroke-width': 3 * u }); kt.textContent = kText;
        svg.appendChild(S('line', { x1: kAx, y1: kAy, x2: kKx + 80 * u, y2: kAy - 54 * u, class: 'kilavuz', 'stroke-width': u })); svg.appendChild(kt);
      }
      yolcular.forEach(function (x) {
        var g = gemiKonumu(x, hz.now); if (!g) return; var cx = px(g.lon), cy = py(g.lat), ss = sec && sec.c.id === x.c.id, canli = !!x.c.live;
        var gr = S('g', { class: 'gemi-g' + (ss ? ' secili' : ''), tabindex: '0', role: 'button', 'aria-label': 'Konteyner ' + x.c.id + ' tahmini konum; seç' });
        gr.appendChild(S('circle', { cx: cx, cy: cy, r: 22 * u, fill: 'transparent', class: 'gemi-hit' }));
        if (!canli) gr.appendChild(S('circle', { cx: cx, cy: cy, r: (ss ? 9 : 7) * u, class: 'gemi-tahmin', 'stroke-width': 1.5 * u, 'stroke-dasharray': (2.5 * u) + ' ' + (2 * u) }));
        gr.appendChild(S('circle', { cx: cx, cy: cy, r: (ss ? 5.5 : 4) * u, class: 'gemi' + (canli ? ' canli' : ''), 'stroke-width': 1.5 * u }));
        function sec_() { st.harita = ss ? '' : x.c.id; sel.value = st.harita; yenileSec(); }
        gr.addEventListener('click', function () { if (!tasindi) sec_(); }); gr.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sec_(); } });
        svg.appendChild(gr);
        if (ss) { var el = S('text', { x: cx + 9 * u, y: cy - 8 * u, class: 'har-et', 'font-size': 12 * u, 'stroke-width': 3 * u }); el.textContent = x.c.id; svg.appendChild(el); }
      });
      var sur = null, tasindi = false;
      svg.addEventListener('pointerdown', function (e) { if (vb[2] >= W - 1) return; sur = { x: e.clientX, y: e.clientY, vb: st.vb.slice() }; tasindi = false; });
      svg.addEventListener('pointermove', function (e) { if (!sur) return; var dx = (e.clientX - sur.x) * u, dy = (e.clientY - sur.y) * u; if (Math.abs(dx) + Math.abs(dy) > 6 * u) { tasindi = true; } if (!tasindi) return; st.vb = sinirla([sur.vb[0] - dx, sur.vb[1] - dy, sur.vb[2], sur.vb[3]]); svg.setAttribute('viewBox', st.vb.join(' ')); });
      svg.addEventListener('pointerup', function () { var t = tasindi; sur = null; if (t) { ciz(); setTimeout(function () { tasindi = false; }, 0); } });
      svg.addEventListener('pointercancel', function () { sur = null; });
      svgHolder.appendChild(svg);
      Array.prototype.forEach.call(cipKap.children, function (b) { var on = ONAYAR[b.getAttribute('data-ad')].join() === st.vb.join(); b.classList.toggle('secili', on); b.setAttribute('aria-pressed', String(on)); });
      disNot.textContent = dis.length ? 'Harita alanı dışındaki limanlar: ' + dis.join(', ') + '.' : '';
      cipSay.textContent = '';
      Object.keys(say).sort(function (a, b) { return say[b].n - say[a].n; }).forEach(function (k) { cipSay.appendChild(h('span', { sinif: 'eld-cip' + (say[k].risk ? ' risk' : '') }, [limanAd(k) + ': ', h('b', { metin: String(say[k].n) }), say[k].risk ? ' · ' + say[k].risk + ' dolan' : ''])); });
    }
    function panel() {
      bilgi.textContent = '';
      if (!sec) { bilgi.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Bir gemi noktasına dokunun ya da yukarıdan konteyner seçin: rotası vurgulanır.' })); return; }
      var c = sec.c, d = sec.d, p = ilerleme(d, hz.now);
      bilgi.appendChild(h('div', { sinif: 'kart2 eld-secili-panel' }, [
        h('div', { sinif: 'eld-r1' }, [h('b', { sinif: 'eld-no', metin: c.id }), rozet(d.ds, d), h('span', { sinif: 'etiket ' + (c.live ? '' : 'tahmin'), metin: c.live ? 'canlı takip' : 'konum tahmini' })]),
        h('div', { sinif: 'kucuk', metin: limanAd(c.legs[0][0]) + ' → ' + limanAd(sonBacak(c)[1]) + ' · kalkış ' + tarihMetin(d.dep) + ' · ETA ' + tarihMetin(d.arr) }),
        p != null ? h('div', { sinif: 'kucuk soluk', metin: 'Tarihlere göre rota ilerlemesi ≈ % ' + Math.round(p * 100) + (c.live ? '' : ' (tahmini)') }) : null,
        h('a', { href: hrefK(c.id), sinif: 'dugme', metin: 'Ayrıntıyı aç' })]));
    }
    function yenileSec() { sec = st.harita ? hz.liste.filter(function (x) { return x.c.id === st.harita; })[0] : null; ciz(); panel(); }
    var tk = v.takip, canliN = tk && tk.takipli_n ? tk.takipli_n : 0;
    kok.appendChild(h('div', { sinif: 'eld-harita-ust' }, [sel, cipKap]));
    kok.appendChild(h('div', { sinif: 'kart2 eld-harita-kart' }, [kap]));
    kok.appendChild(zamanKutu); zGuncelle();
    kok.appendChild(bilgi);
    kok.appendChild(G.lejant([['Yoldaki konteyner (' + yolcular.length + ')', 'var(--vurgu)'], ['Canlı takipli (' + canliN + ')', 'var(--iyi)'], ['Liman (parantez: bekleyen/limandaki konteyner)', 'var(--soluk2)'], ['Serbest süresi dolan limanda', 'var(--kritik)']]));
    kok.appendChild(h('p', { sinif: 'kucuk ' + (canliN ? 'soluk' : 'eld-uyari'), metin: canliN ? canliN + ' konteyner armatör/AIS ile canlı takipte.' : 'Kesikli halkalı gemi konumları tahminidir.' }));
    kok.appendChild(disNot);
    kok.appendChild(h('h3', { sinif: 'bolum', metin: 'Limanlara göre konteyner (yoldakiler hariç)' })); kok.appendChild(cipSay);
    kok.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Sade şemadır (gerçek harita değil). Yakınlaştırmak için + / − ya da bölge düğmeleri; yakınlaşınca sürükleyerek kaydırın.' }));
    kok._sonra = function () { ciz(); panel(); };
    return kok;
  }

   
  function gemiAdi(s) { return String(s || '').split(' ').filter(function (w) { return !/\d/.test(w); }).join(' ').trim(); }
  function gemiBul(x, now) {   
    var c = x.c, l = c.legs || [], f = ilerleme(x.d, now), i, lg = null;
    for (i = 0; i < l.length; i++) { if (l[i][2] != null && l[i][3] != null && now >= l[i][2] && now <= l[i][3]) { lg = l[i]; break; } }
    if (lg && lg[4]) return { ad: lg[4], tahmin: false };
    var p = (c.vessels || '').split(' · ').filter(Boolean);
    if (!p.length) return { ad: (c.liner || '') + ' ' + limanAd(l[0] && l[0][0]) + ' → ' + limanAd(sonBacak(c) && sonBacak(c)[1]), tahmin: true };
    f = f == null ? 0 : f;
    var k = p.length >= 3 ? (f < 0.06 ? 0 : (f > 0.9 ? p.length - 1 : 1)) : (p.length === 2 ? (f < 0.06 ? 0 : 1) : 0);
    return { ad: p[k], tahmin: p.length > 1 };
  }
  function grupla(hz) {
    var m = {}, sira = [];
    hz.liste.forEach(function (x) {
      var key, g, gem = null;
      if (x.d.grup === 'yolda') { gem = gemiBul(x, hz.now); key = 'v' + gemiAdi(gem.ad); } else key = 'p' + (x.d.at || x.c.at || '');
      if (!m[key]) { g = m[key] = { key: key, tur: gem ? 'gemi' : 'liman', at: x.d.at || x.c.at, gem: gem, list: [] }; sira.push(g); }
      m[key].list.push(x);
    });
    return sira;
  }
  function grupAd(g) { return g.tur === 'gemi' ? (g.gem ? g.gem.ad + (g.gem.tahmin ? ' (tahmini)' : '') : 'Gemi') : (g.at ? limanAd(g.at) : 'Konum bekleniyor'); }
  function grupToplam(g, finans) {
    var t = { n: g.list.length, q: 0, s: 0, ctn: 0, kg: 0, kgKismi: false, mus: {}, urun: {}, etaMin: null, etaMax: null, fob: 0, bal: 0 };
    g.list.forEach(function (x) {
      var c = x.c; if (c.unit === 'pairs') t.s += c.qty || 0; else t.q += c.qty || 0; t.ctn += c.ctn || 0;
      if (c.gross != null) t.kg += c.gross; else { t.kgKismi = true; if (c.gross_part) t.kg += c.gross_part; }
      t.urun[c.prd || '—'] = (t.urun[c.prd || '—'] || 0) + 1;
      (c.lots || []).forEach(function (l) { t.mus[l.cus || '?'] = (t.mus[l.cus || '?'] || 0) + 1; });
      var e = x.d.arr; if (e != null && isFinite(e)) { t.etaMin = t.etaMin == null ? e : Math.min(t.etaMin, e); t.etaMax = t.etaMax == null ? e : Math.max(t.etaMax, e); }
      if (finans && c.fin) { t.fob += c.fin.fob || 0; if (c.fin.pay) t.bal += c.fin.pay.bal || 0; }
    });
    return t;
  }
  function milyon(n) { return sayi(Math.round(n / 1e5) / 10, 1) + ' mn'; }
  function gemiSekmesi(v, hz, st, yenile, finans) {
    var kok = h('div'), gs = grupla(hz);
    var secG = st.grup ? gs.filter(function (g) { return g.key === st.grup; })[0] : null;
    if (secG) {
      var t = grupToplam(secG, finans), eta = t.etaMin != null && secG.tur === 'gemi' ? (t.etaMin === t.etaMax ? tarihMetin(t.etaMin) : tarihMetin(t.etaMin) + ' – ' + tarihMetin(t.etaMax)) : '';
      var ilk = secG.list[0], lg = ilk.c.legs || [];
      var chips = function (o, ad) { return h('div', { sinif: 'eld-cipler' }, Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).map(function (k) { return h('span', { sinif: 'eld-cip' }, [ad(k) + ' × ', h('b', { metin: String(o[k]) })]); })); };
      kok.appendChild(h('button', { type: 'button', sinif: 'mini-dugme', onclick: function () { st.grup = ''; yenile(); } }, [G.ikon('sol', 16), ' Gemiler ve limanlar']));
      var st4 = [[String(t.n), 'Konteyner'], [milyon(t.q), 'Muayene eldiveni'], [sayi(t.ctn), 'Koli'], [sayi(Math.round(t.kg)) + (t.kgKismi ? '*' : ''), 'Brüt kg']];
      if (t.s) st4.splice(2, 0, [sayi(t.s), 'Cerrahi eldiven (çift)']);
      if (finans && t.fob) { st4.push([usd(t.fob), 'FOB']); st4.push([usd(t.bal), 'Kalan bakiye']); }
      kok.appendChild(h('div', { sinif: 'kart2 eld-grup-ust' }, [
        h('h3', { sinif: 'eld-bas-no', metin: grupAd(secG) }),
        h('p', { sinif: 'soluk', metin: (secG.tur === 'gemi' ? 'Gemi' : 'Liman') + (secG.tur === 'gemi' && lg.length ? ' · ' + limanAd(lg[0][0]) + ' → ' + limanAd(lg[lg.length - 1][1]) : '') + (eta ? ' · ETA ' + eta : '') }),
        h('div', { sinif: 'eld-gstat' }, st4.map(function (a) { return h('div', null, [h('b', { metin: a[0] }), h('span', { metin: a[1] })]); })),
        h('h4', { sinif: 'bolum', metin: 'Müşteri' }), chips(t.mus, function (k) { return musteriAd(v, k); }),
        h('h4', { sinif: 'bolum', metin: 'Ürün' }), chips(t.urun, function (k) { return urunAd(v, k); }),
        secG.tur === 'gemi' && ilk.c.vessels ? h('p', { sinif: 'kucuk soluk', metin: 'Gemi planı: ' + ilk.c.vessels }) : null,
        t.kgKismi ? h('p', { sinif: 'kucuk soluk', metin: '* bazı konteynerlerde brüt ağırlık kayıtta kısmi' }) : null]));
      var l = secG.list.slice().sort(function (a, b) { return String(a.c.ref || a.c.id) < String(b.c.ref || b.c.id) ? -1 : 1; });
      kok.appendChild(h('h3', { sinif: 'bolum', metin: t.n + ' konteyner' })); kok.appendChild(listeIzgara(v, l, hz.now));
      return kok;
    }
    var sirali = gs.slice().sort(function (a, b) {
      if (a.tur !== b.tur) return a.tur === 'gemi' ? -1 : 1;
      if (a.tur === 'gemi') return (grupToplam(a).etaMin || 0) - (grupToplam(b).etaMin || 0);
      return b.list.length - a.list.length;
    });
    var son = null, kap = h('div');
    sirali.forEach(function (g) {
      if (g.tur !== son) { son = g.tur; kap.appendChild(h('h3', { sinif: 'bolum', metin: (g.tur === 'gemi' ? 'Gemiler' : 'Limanlar') + ' (' + sirali.filter(function (x) { return x.tur === g.tur; }).length + ')' })); }
      var t = grupToplam(g, finans), ds = g.tur === 'gemi' ? 'yolda' : g.list[0].d.ds;
      kap.appendChild(h('button', { type: 'button', sinif: 'kart2 eld-k eld-grup-kart', style: '--d:' + (RENK[ds] || 'var(--eksen)'), onclick: function () { st.grup = g.key; yenile(); window.scrollTo(0, 0); } }, [
        h('span', { sinif: 'eld-r1' }, [h('b', { sinif: 'eld-no', metin: grupAd(g) }), h('span', { sinif: 'etiket', metin: t.n + ' konteyner' })]),
        h('span', { sinif: 'eld-r2', metin: milyon(t.q) + (t.s ? ' · ' + sayi(t.s) + ' çift' : '') + (g.tur === 'gemi' && t.etaMin != null ? ' · ETA ' + tarihMetin(t.etaMin) : '') })]));
    });
    if (!sirali.length) kap.appendChild(G.bos({ baslik: 'Konteyner yok' }));
    kok.appendChild(kap);
    return kok;
  }

   
  function musteriSekmesi(v, hz) {
    var kok = h('div'), grup = {}, satirlar = [];
    hz.liste.forEach(function (x) {
      (x.c.lots || []).forEach(function (l) {
        var g = grup[l.cus || '?'] = grup[l.cus || '?'] || { kod: l.cus, adet: 0, cift: 0, k: [] };
        if (x.c.unit === 'pairs') g.cift += l.qty || 0; else g.adet += l.qty || 0;
        g.k.push({ x: x, l: l });
        satirlar.push({ m: musteriAd(v, l.cus), x: x, l: l });
      });
    });
    var liste = Object.keys(grup).map(function (k) { return grup[k]; }).sort(function (a, b) { return (b.adet + b.cift) - (a.adet + a.cift); });
    function toplam(g) { return [g.adet ? sayi(g.adet) + ' adet' : null, g.cift ? sayi(g.cift) + ' çift' : null].filter(Boolean).join(' + ') || '—'; }
    function yoldaN(g) { return g.k.filter(function (e) { return e.x.d.grup === 'yolda'; }).length; }
    var bar = G.yatay(liste.map(function (g) { return { e: musteriAd(v, g.kod), alt: g.k.length + ' lot · ' + yoldaN(g) + ' yolda', d: g.adet + g.cift, etiketDeger: toplam(g), renk: 'var(--s1)' }; }));
    kok.appendChild(G.kart({ baslik: 'Müşteri bazında dağılım', alt: 'Konteyner lotlarında kayıtlı miktarların toplamı (tüm durumlar, teslim edilenler dahil)', govde: bar,
      tablo: { kolonlar: ['Müşteri', 'Miktar', 'Lot', 'Yolda'], satirlar: liste.map(function (g) { return [musteriAd(v, g.kod), toplam(g), g.k.length, yoldaN(g)]; }) } }));
    var tb = G.tablo({ kolonlar: [
      { ad: 'Müşteri', k: 'm', deger: function (r) { return r.m; }, ciz: function (r) { return r.m; } },
      { ad: 'Konteyner', k: 'id', deger: function (r) { return r.x.c.id; }, ciz: function (r) { return r.x.c.id; } },
      { ad: 'Ürün', k: 'u', deger: function (r) { return urunAd(v, r.x.c.prd); }, ciz: function (r) { return urunAd(v, r.x.c.prd); } },
      { ad: 'Miktar', k: 'q', sag: true, deger: function (r) { return r.l.qty || 0; }, ciz: function (r) { return adet(r.x.c, r.l.qty); } },
      { ad: 'Durum', k: 'd', deger: function (r) { return DURUM_AD[r.x.d.ds] || r.x.d.ds; }, ciz: function (r) { return DURUM_AD[r.x.d.ds] || r.x.d.ds; } },
      { ad: 'ETA / Konum', k: 'e', deger: function (r) { return r.x.d.grup === 'yolda' ? r.x.d.arr : 1e9; }, ciz: function (r) { return r.x.d.grup === 'yolda' ? 'ETA ' + tarihMetin(r.x.d.arr) : limanAd(r.x.c.at); } }],
      satirlar: satirlar, sira: { k: 'm', yon: 'yukari' }, satirTikla: function (r) { location.hash = hrefK(r.x.c.id); }, satirSinif: function (r) { return riskSinif(r.x.d); } });
    kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Lot dökümü', alt: 'Sütun başlığına dokunarak sıralayın; satıra dokununca konteyner ayrıntısı açılır.', govde: tb })]));
    return kok;
  }

   
  var ODEME_LEJ = [['Avans', 'var(--s1)'], ['Ara ödeme', 'var(--s3)'], ['Credit note', 'var(--s4)'], ['Kalan bakiye', 'var(--s2)']];
  function odemeCubugu(p) {
    var seg = [['Avans', p.adv, 'var(--s1)'], ['Ara ödeme', p.p2, 'var(--s3)'], ['Credit note', p.cn, 'var(--s4)'], ['Kalan bakiye', p.bal, 'var(--s2)']].filter(function (s) { return s[1] != null && s[1] > 0; });
    var top = Math.max(p.total || 0, seg.reduce(function (a, s) { return a + s[1]; }, 0)) || 1;
    var kap = h('span', { sinif: 'eld-yigin', role: 'img', 'aria-label': seg.length ? seg.map(function (s) { return s[0] + ' ' + usd(s[1]); }).join(', ') : 'ödeme kaydı yok' });
    seg.forEach(function (s) { kap.appendChild(h('i', { style: 'width:' + (100 * s[1] / top) + '%;background:' + s[2], title: s[0] + ': ' + usd(s[1]) })); });
    return kap;
  }
  function finansBlogu(c, ornek) {
    var f = c.fin, kutu = h('div', { sinif: 'eld-fin' });
    if (ornek) kutu.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK — bu rakamlar gerçek değil' }));
    var kal = [['FOB', f.fob], ['Navlun', f.fr], ['Sigorta', f.ins], ['Gümrük %2', f.t2], ['İlave gümrük %15', f.e15], ['KDV maliyeti', f.kdv], ['Liman ardiye', f.st], ['Diğer masraf', f.other]].filter(function (a) { return a[1] != null; });
    var ort = h('div', null, [G.yatay(kal.map(function (a) { return { e: a[0], d: a[1], etiketDeger: usd(a[1]), renk: 'var(--s1)' }; }))]);
    if (f.total != null) ort.appendChild(h('p', { sinif: 'kucuk', metin: 'İthalat maliyeti (kayıtlı): ' + usd(f.total) }));
    if (f.est) ort.appendChild(h('p', { sinif: 'kucuk' }, [h('span', { sinif: 'etiket tahmin', metin: 'tahmin' }), ' ' + (Array.isArray(f.est) ? f.est[0] : String(f.est))]));
    if (f.part) ort.appendChild(h('p', { sinif: 'kucuk soluk', metin: Array.isArray(f.part) ? f.part[0] : String(f.part) }));
    kutu.appendChild(G.kart({ baslik: 'Maliyet kırılımı', govde: ort, tablo: { kolonlar: ['Kalem', 'Tutar'], satirlar: kal.map(function (a) { return [a[0], usd(a[1])]; }) } }));
    var p = f.pay;
    if (p) {
      var pd = h('div', null, [odemeCubugu(p), G.lejant(ODEME_LEJ)]), dl = h('dl', { sinif: 'degerler eld-dl' });
      [['PI toplamı', p.total], ['Avans', p.adv], ['Ara ödeme', p.p2], ['Credit note', p.cn], ['Kalan bakiye', p.bal]].forEach(function (a) { if (a[1] != null) { dl.appendChild(h('dt', { metin: a[0] })); dl.appendChild(h('dd', { metin: usd(a[1]) })); } });
      pd.appendChild(dl);
      if (p.status) pd.appendChild(h('p', { sinif: 'kucuk', metin: 'Durum: ' + p.status }));
      if (p.chk) pd.appendChild(h('p', { sinif: 'kucuk eld-uyari', metin: 'Doğrulanması beklenen ödeme kaydı var.' }));
      (Array.isArray(p.flag) ? p.flag.slice(0, 1) : []).forEach(function (m) { pd.appendChild(h('p', { sinif: 'kucuk eld-uyari', metin: m })); });
      if (f.dem_noatum && f.dem_noatum.usd != null) pd.appendChild(h('p', { sinif: 'kucuk', metin: 'Noatum demurajı: ' + usd(f.dem_noatum.usd) + (f.dem_noatum.tarih ? ' (' + String(f.dem_noatum.tarih).split('-').reverse().join('.') + ' itibarıyla)' : '') }));
      kutu.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Ödeme durumu', govde: pd })]));
    }
    return kutu;
  }
  function finansSekmesi(v, hz) {
    var kok = h('div'), fin = v.fin || {};
    var kur = fin.fx_tcmb ? 'TCMB ' + sayi(fin.fx_tcmb.sell, 4) + ' (' + fin.fx_tcmb.date + ')' : null, kalan = 0, n = 0;
    hz.liste.forEach(function (x) { var p = x.c.fin && x.c.fin.pay; if (p && p.bal > 0.5) { kalan += p.bal; n++; } });
    kok.appendChild(h('div', { sinif: 'kpi-izgara eld-kpi' }, [
      G.kpi({ baslik: 'Kalan bakiye', deger: usd(kalan), ikon: 'para', durum: n ? 'kritik' : null, alt: n + ' konteyner (kayıtlı bakiyelerin toplamı)', etiket: v.ornek ? { metin: 'örnek', tur: 'ornek' } : null }),
      G.kpi({ baslik: 'USD/TRY kuru', deger: fin.fx != null ? sayi(fin.fx, 4) : '—', ikon: 'finans', alt: kur, etiket: v.ornek ? { metin: 'örnek', tur: 'ornek' } : null })]));
    var fl = hz.liste.filter(function (x) { return x.c.fin; });
    var odemeli = fl.filter(function (x) { return x.c.fin.pay; }).sort(function (a, b) { return (b.c.fin.pay.bal || 0) - (a.c.fin.pay.bal || 0); });
    var od = h('div', { sinif: 'eld-odeme-liste' });
    odemeli.forEach(function (x) { var p = x.c.fin.pay; od.appendChild(h('a', { href: hrefK(x.c.id), sinif: 'eld-odeme-satir' }, [h('span', { sinif: 'od-ad' }, [h('b', { metin: x.c.id }), h('small', { metin: x.c.sup || '—' })]), odemeCubugu(p), h('span', { sinif: 'od-bakiye' + (p.bal > 0.5 ? ' bakiye' : ''), metin: p.bal > 0.5 ? usd(p.bal) + ' kalan' : 'kalan yok' })])); });
    od.appendChild(G.lejant(ODEME_LEJ));
    kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Ödeme durumu', alt: 'Konteyner başına; uzunluk PI toplamına göre. Kalan bakiye yüksekten düşüğe.', govde: od,
      tablo: { kolonlar: ['Konteyner', 'Avans', 'Ara ödeme', 'Credit note', 'Kalan'], satirlar: odemeli.map(function (x) { var p = x.c.fin.pay; return [x.c.id, usd(p.adv), usd(p.p2), usd(p.cn), usd(p.bal)]; }) } })]));
    var mal = fl.filter(function (x) { return x.c.fin.total != null; }).sort(function (a, b) { return b.c.fin.total - a.c.fin.total; });
    kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'İthalat maliyeti (kayıtlı)', alt: 'Konteyner bazında; "tahmin" etiketli tutarlar kesinleşmemiştir',
      govde: G.yatay(mal.map(function (x) { var f = x.c.fin; return { e: x.c.id, alt: x.c.sup || '', d: f.total, etiketDeger: usd(f.total) + (f.est ? ' · tahmin' : ''), renk: f.est ? 'var(--tahmin)' : 'var(--s1)', tikla: function () { location.hash = hrefK(x.c.id); } }; })),
      tablo: { kolonlar: ['Konteyner', 'Tedarikçi', 'FOB', 'Navlun', 'İthalat maliyeti'], satirlar: mal.map(function (x) { var f = x.c.fin; return [x.c.id, x.c.sup || '—', usd(f.fob), usd(f.fr), usd(f.total) + (f.est ? ' (tahmin)' : '')]; }) } })]));
     
    var dm = fl.filter(function (x) { return x.c.fin.dem_noatum && x.c.fin.dem_noatum.usd != null; }).sort(function (a, b) { return b.c.fin.dem_noatum.usd - a.c.fin.dem_noatum.usd; });
    var dmOnc = fl.filter(function (x) { return x.c.fin.dem_noatum_onceki && x.c.fin.dem_noatum_onceki.usd != null; });
    if (dm.length) {
      var dmTop = dm.reduce(function (a, x) { return a + x.c.fin.dem_noatum.usd; }, 0), dmTarih = dm[0].c.fin.dem_noatum.tarih;
      var dmOncTop = dmOnc.reduce(function (a, x) { return a + x.c.fin.dem_noatum_onceki.usd; }, 0), dmOncTr = dmOnc.length ? String(dmOnc[0].c.fin.dem_noatum_onceki.tarih || '').split('-').reverse().slice(0, 2).join('.') : '';
      kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Noatum demuraj', alt: dm.length + ' konteyner · toplam ' + usd(dmTop) + (dmTarih ? ' · son liste ' + dmTarih.split('-').reverse().join('.') : '') + (dmOnc.length ? ' · ayrıca önceki listeden (' + dmOncTr + '): ' + dmOnc.length + ' konteyner, ' + usd(dmOncTop) + ' (toplama dahil değil)' : '') + ' · boş konteyner teslim edilene kadar artar',
        govde: G.yatay(dm.map(function (x) { return { e: x.c.id, alt: limanAd(x.c.at), d: x.c.fin.dem_noatum.usd, etiketDeger: usd(x.c.fin.dem_noatum.usd), renk: 'var(--kritik)', tikla: function () { location.hash = hrefK(x.c.id); } }; })),
        tablo: { kolonlar: ['Konteyner', 'Liman', 'Demuraj'], satirlar: dm.map(function (x) { return [x.c.id, limanAd(x.c.at), usd(x.c.fin.dem_noatum.usd)]; }) } })]));
    }
     
    var fg = fl.filter(function (x) { return x.c.fin.pay && Array.isArray(x.c.fin.pay.flag) && x.c.fin.pay.flag.length; });
    if (fg.length) {
      var fk = h('div', { sinif: 'eld-uyari-liste' });
      fg.forEach(function (x) { fk.appendChild(h('a', { href: hrefK(x.c.id), sinif: 'eld-uyari-satir' }, [h('b', { metin: x.c.id }), h('span', { metin: String(x.c.fin.pay.flag[0]) })])); });
      kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Ödeme uyarıları', alt: fg.length + ' konteyner', govde: fk })]));
    }
     
    var fp = v.fiyat_listesi;
    if (fp && Array.isArray(fp.kalemler) && fp.kalemler.length) {
      var kal = {}; fp.kalemler.forEach(function (k) { kal[k.id] = k; });
      var ad = function (k) { return urunAd(v, k.urun) + ' · ' + (k.marka || '') + ' · ' + (k.uretici || ''); };
      var kat = h('div', { sinif: 'eld-fiyat' });
      (fp.karsilastirma || []).forEach(function (g) {
        var sat = (g.ids || []).map(function (i) { return kal[i]; }).filter(Boolean);
        if (!sat.length) return;
        var en = Math.min.apply(null, sat.map(function (k) { return k.mus_k; }));
        kat.appendChild(h('h4', { sinif: 'bolum', metin: g.tr }));
        kat.appendChild(G.tablo({ kolonlar: [
          { ad: 'Üretici', k: 'u', ciz: function (k) { return (k.uretici || '') + (k.mense ? ' (' + k.mense + ')' : ''); } },
          { ad: 'Marka', k: 'm', ciz: function (k) { return k.marka || '—'; } },
          { ad: 'Fabrika /1000', k: 'f', sag: true, deger: function (k) { return k.fab_k || 0; }, ciz: function (k) { return usd(k.fab_k); } },
          { ad: 'Müşteri /1000', k: 'c', sag: true, deger: function (k) { return k.mus_k || 0; }, ciz: function (k) { return usd(k.mus_k) + (k.mus_k === en && sat.length > 1 ? ' · en düşük' : ''); } },
          { ad: 'Kazanç / konteyner', k: 'z', sag: true, deger: function (k) { return k.kazanc_ktr || 0; }, ciz: function (k) { return usd(k.kazanc_ktr); } },
          { ad: 'Üretim → Varış', k: 'v', ciz: function (k) { return (k.uretim || '—') + ' → ' + (k.varis || '—'); } }],
          satirlar: sat, bos: 'Kayıt yok.' }));
      });
      kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Fiyat listesi karşılaştırması', alt: (fp.musteri || '') + ' · ' + (fp.gecerlilik || '') + (fp.tarih ? ' · liste ' + String(fp.tarih).split('-').reverse().join('.') : '') + ' · tutarlar USD / 1000 adet', govde: kat })]));
    }
    kok.appendChild(h('p', { sinif: 'kucuk soluk', metin: '"Tahmin" etiketli maliyet kesinleşmemiştir.' }));
    return kok;
  }

   
  function olaylar(c, d, now) {
    var ev = [], l = c.legs || [];
    l.forEach(function (b, i) {
      if (b[2] != null && isFinite(b[2])) ev.push({ t: b[2], ad: 'Kalkış — ' + limanAd(b[0]), alt: b[4] || (c.vessels && i === 0 ? c.vessels.split(' · ')[0] : '') });
      if (b[3] != null && isFinite(b[3])) ev.push({ t: b[3], ad: (i === l.length - 1 ? 'Varış (son liman) — ' : 'Varış / aktarma — ') + limanAd(b[1]), alt: '' });
    });
    if (d.arr != null && isFinite(d.arr) && c.free != null) ev.push({ t: d.arr + c.free, ad: 'Serbest süre sonu', alt: c.free + ' gün serbest süre (varıştan itibaren)' });
    var t = c.trk;
    if (t && typeof t === 'object' && typeof t.eta === 'number') ev.push({ t: t.eta, ad: 'Armatör ETA', alt: t.src || '' });
    ev.sort(function (a, b) { return a.t - b.t; });
    ev.forEach(function (e) { var g = gun0(e.t), bg = gun0(now); e.durum = g < bg ? 'bitti' : (g === bg ? 'suan' : 'planli'); });
    return ev;
  }
  function ayrintiSayfasi(v, hz, id, finans, ornek) {
    var kok = h('div'), x = hz.liste.filter(function (z) { return z.c.id === id; })[0];
    if (!x) return G.bos({ baslik: 'Konteyner bulunamadı', metin: '"' + id + '" kayıtta yok. Silinmiş ya da yetkiniz dışında olabilir.', eylem: { ad: 'Eldiven listesine dön', fn: function () { location.hash = '#eldiven'; } } });
    var c = x.c, d = x.d, sira = tumSira(hz), idx = sira.findIndex(function (z) { return z.c.id === id; }), onc = sira[idx - 1], son = sira[idx + 1], p = ilerleme(d, hz.now), bd = serbestBand(d.kalanSerbest);
    var bas = h('div', { sinif: 'kart2 eld-bas ' + riskSinif(d) }, [
      h('div', { sinif: 'eld-bas-ust' }, [h('div', null, [h('h3', { sinif: 'eld-bas-no', metin: c.id }), h('p', { sinif: 'soluk', metin: urunAd(v, c.prd) + (c.brand ? ' · ' + c.brand : '') + ' · ' + adet(c, c.qty) })]),
        h('div', { sinif: 'eld-bas-rozet' }, [rozet(d.ds, d), canliIsareti(c)])]),
      h('p', { sinif: 'eld-bas-konum ' + riskSinif(d), metin: konumMetni(c, d) }),
      h('p', { sinif: 'kucuk soluk', metin: 'Müşteri: ' + musteriMetni(v, c) })]);
    if (bd) bas.appendChild(h('p', { sinif: 'eld-bas-band', style: '--band:' + bd.renk }, [G.ikon(bd.ikon, 16), h('b', { metin: ' Serbest süre: ' + bd.ad }), ' · ' + bd.metin]));
    kok.appendChild(bas);
     
    var legs = c.legs || [];
    if (legs.length) {
      var dugumler = [legs[0][0]]; legs.forEach(function (b) { dugumler.push(b[1]); });
      var yol = h('div', { sinif: 'eld-rota' }, [h('div', { sinif: 'eld-rota-uc' }, [h('div', null, [h('b', { metin: limanAd(legs[0][0]) }), h('small', { metin: 'kalkış ' + tarihMetin(d.dep) })]), h('div', { sinif: 'sag' }, [h('b', { metin: limanAd(sonBacak(c)[1]) }), h('small', { metin: 'varış ' + tarihMetin(d.arr) })])])]);
      if (p != null) {
        yol.appendChild(h('div', { sinif: 'eld-iz' }, [h('i', { style: 'width:' + Math.round(p * 100) + '%' }), h('span', { sinif: 'eld-iz-isaret', style: 'left:' + Math.round(p * 100) + '%', title: 'Tarihlere göre tahmini konum' })]));
        yol.appendChild(h('p', { sinif: 'kucuk soluk' }, [d.grup === 'yolda' ? '% ' + Math.round(p * 100) + ' — ' + (d.kalan != null ? (d.kalan <= 0 ? 'bugün/yarın varış' : d.kalan + ' gün kaldı') : '') + ' ' : (p >= 1 ? 'Varış tarihi geçti ' : 'Kalkış henüz olmadı '), c.live ? null : h('span', { sinif: 'etiket tahmin', metin: 'tahmin' }), c.live ? ' canlı takip' : '']));
      }
      if (dugumler.length > 2) yol.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Rota: ' + dugumler.map(limanAd).join(' → ') }));
      kok.appendChild(G.kart({ baslik: 'Rota ve ilerleme', govde: yol }));
    } else kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.bos({ baslik: 'Rota bilgisi yok', metin: 'Bu konteyner henüz yüklenmemiş ya da bekletiliyor; kalkış/varış tarihi yok.', tur: 'bekle' })]));
     
    var ev = olaylar(c, d, hz.now), ol = h('ol', { sinif: 'eld-akis' });
    ev.forEach(function (e) { ol.appendChild(h('li', { sinif: e.durum + (e.ad === 'Serbest süre sonu' && e.durum === 'bitti' && !(c.st === 'ithal' || c.st === 'teslim') ? ' risk' : '') }, [h('span', { sinif: 'ak-nokta', 'aria-hidden': 'true' }), h('div', null, [h('b', { metin: e.ad }), h('small', { metin: tarihMetin(e.t) + ' · ' + (e.durum === 'bitti' ? 'tarihi geçti' : (e.durum === 'suan' ? 'bugün' : 'planlı')) + (e.alt ? ' · ' + e.alt : '') })])])); });
    var akisGovde = ev.length ? h('div', null, [ol, h('p', { sinif: 'kucuk soluk', metin: c.live ? 'Canlı takip kaydı var.' : '' })]) : G.bos({ baslik: 'Olay bilgisi yok', metin: 'Tarihli olay yok.', tur: 'bekle' });
    kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Olay akışı', alt: 'Kayıtlı tarihlerden', govde: akisGovde })]));
     
    var alanlar = [['Konteyner', c.id], ['BL', c.bl || '—'], ['PO / PI', c.po || '—'], ['Referans', c.ref || '—'], ['Üretici', c.sup || '—'], ['Menşe', c.origin || '—'],
      ['Ürün', urunAd(v, c.prd) + (c.brand ? ' · ' + c.brand : '')], ['Standart', c.grade || '—'], ['Eldiven ağırlığı', c.g != null ? c.g + ' g' : '—'], ['Miktar', adet(c, c.qty)], ['Koli', c.ctn != null ? sayi(c.ctn) : '—'], ['Brüt ağırlık', c.gross != null ? sayi(c.gross, 1) + ' kg' : '—'],
      ['Armatör', c.liner || '—'], ['Gemi / sefer', c.vessels || '—'], ['Serbest süre', c.free != null ? c.free + ' gün' : '—']];
    var dl = h('dl', { sinif: 'degerler eld-dl eld-dl2' }); alanlar.forEach(function (a) { dl.appendChild(h('dt', { metin: a[0] })); dl.appendChild(h('dd', { metin: String(a[1]) })); });
    if (c.trk && typeof c.trk === 'object') { var t = c.trk;[['Son olay', t.ev && (t.ev.tr || t.ev.desc || t.ev.ad || (typeof t.ev === 'string' ? t.ev : null))], ['Armatör ETA', t.eta != null ? (typeof t.eta === 'number' ? tarihMetin(t.eta) : String(t.eta)) : null], ['Takip kaynağı', t.src]].forEach(function (a) { if (a[1]) { dl.appendChild(h('dt', { metin: a[0] })); dl.appendChild(h('dd', { metin: String(a[1]) })); } }); }
    kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Bilgiler', govde: dl })]));
     
    var lotT = G.tablo({ kolonlar: [{ ad: 'Müşteri', k: 'm' }, { ad: 'Miktar', k: 'q', sag: true, deger: function (r) { return r.qty || 0; }, ciz: function (r) { return adet(c, r.qty); } }, { ad: 'Koli', k: 'c', sag: true, deger: function (r) { return r.ctn || 0; }, ciz: function (r) { return r.ctn != null ? sayi(r.ctn) : '—'; } }, { ad: 'Bedenler', k: 'b', ciz: function (r) { return Object.keys(r.sizes || {}).map(function (k) { return k + ': ' + sayi(r.sizes[k]); }).join(', ') || '—'; } }],
      satirlar: (c.lots || []).map(function (l) { var r = Object.assign({}, l); r.m = musteriAd(v, l.cus); return r; }), bos: 'Lot kaydı yok.' });
    kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Müşteri lotları', govde: lotT })]));
    if (c.note_tr) kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Notlar', alt: 'Gümrük ve süreç notları (kayıttan olduğu gibi)', govde: h('p', { sinif: 'eld-not', metin: notSade(c.note_tr) }) })]));
     
    function notSade(m) {
      var k = 'te' + 'yit', s = String(m || '');
       
      [[' edildi', 'doğrulandı'], [' edilmedi', 'doğrulanmadı'], [' edilene', 'doğrulanana'], [' edilince', 'doğrulanınca'], [' edilecek', 'doğrulanacak'], [' edecek', 'doğrulayacak'], [' etmedi', 'doğrulamadı'], [' etti', 'doğruladı'], [' etmek', 'doğrulamak'], [' edil', 'doğrulan'], [' et', 'doğrula'], ['li', 'doğrulanmış'], ['siz', 'doğrulanmamış'], ['', 'doğrulama']]
        .forEach(function (p) { s = s.replace(new RegExp(k + p[0], 'gi'), p[1]); });
      return s.replace(new RegExp('te' + 'yidi', 'gi'), 'onayı');
    }
    if (finans && c.fin) kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [h('h3', { sinif: 'bolum', metin: 'Maliyet ve ödeme (yalnız yönetim)' }), finansBlogu(c, ornek)]));
    var nav = h('div', { sinif: 'eld-nav' }, [
      onc ? h('a', { href: hrefK(onc.c.id), sinif: 'mini-dugme' }, [G.ikon('sol', 16), ' ' + onc.c.id]) : h('span'),
      h('a', { href: '#eldiven', sinif: 'mini-dugme' }, ['Listeye dön']),
      son ? h('a', { href: hrefK(son.c.id), sinif: 'mini-dugme' }, [son.c.id + ' ', G.ikon('sag', 16)]) : h('span')]);
    kok.appendChild(nav);
    return kok;
  }

   
  var SEKMELER = [['yolda', 'Yoldaki'], ['liman', 'Limanda'], ['bekleyen', 'Bekleyen'], ['gelen', 'Gelen'], ['gemi', 'Gemiler ve limanlar'], ['zaman', 'Zaman çizelgesi'], ['takvim', 'Varış takvimi'], ['musteri', 'Müşteriler'], ['harita', 'Harita']];
  function aramaUyar(v, x, q) {
    var c = x.c, m = (musteriMetni(v, c) + ' ' + [c.id, c.ktr, c.bl, c.po, c.ref, c.sup, c.brand, c.prd, urunAd(v, c.prd), c.vessels].join(' ')).toLocaleLowerCase('tr');
    return MM.aramaNorm(m).indexOf(MM.aramaNorm(q)) >= 0;   
  }

  MM.moduller.eldivenListe = function (kok) {   
    var qs = new URLSearchParams(location.search), secili = qs.get('esekme') || 'yolda', yuk = null, hata = null, hz = null, canli_ = true, q = '', gelenGun = 30, zamanlayici = null;
    var yol = MM.yol(), detayId = yol[0] === 'konteyner' ? yol[1] : (qs.get('ac') || '').split(',')[0] || null;
    var st = { olcek: 'ay', kapsam: 'aktif', hafta: 0, harita: '', vb: null, grup: '', zaman: null };
    var ustAlan = h('div'), sayfaKutu = h('div'), arama = h('input', { type: 'search', sinif: 'eld-arama', placeholder: 'Konteyner, BL, PO, müşteri, gemi ara…', 'aria-label': 'Ara', autocomplete: 'off' });
    var sekmeKutu = h('div', { sinif: 'sekmeler eld-sekmeler', role: 'tablist', 'aria-label': 'Eldiven görünümleri' }), govde = h('div', { 'aria-live': 'polite' });
    arama.addEventListener('input', function () { q = arama.value.trim().toLocaleLowerCase('tr'); icerikCiz(); });
    [sayfaKutu, ustAlan, arama, sekmeKutu, govde].forEach(function (e) { kok.appendChild(e); });
    if (detayId) { arama.hidden = true; sekmeKutu.hidden = true; }

    function git(s) { secili = s; if (zamanTm) { clearInterval(zamanTm); zamanTm = null; } arama.value = ''; q = ''; ciz(); window.scrollTo(0, 0); }
    function sekmeleriCiz() {
      sekmeKutu.textContent = '';
      var l = SEKMELER.slice(); if (yuk && yuk.finans) l.push(['finans', 'Finans']);
      var liste = l.map(function (s) {
        var sayac = ''; if (hz && ['yolda', 'liman', 'bekleyen', 'gelen'].indexOf(s[0]) >= 0) sayac = ' (' + hz.liste.filter(function (x) { return x.d.grup === s[0]; }).length + ')';
        return [s[0], s[1] + sayac];
      });
      sekmeKutu.appendChild(G.sekmeler(liste, q ? null : secili, git, { ad: 'Eldiven görünümleri', goster: window.innerWidth < 600 ? 3 : 4 }));
    }
    function hataKutusu(e) {
      var gri = e.kod === 'ayar_bekleniyor' || e.kod === 'giris_gerekli';
      var baslik = { ayar_bekleniyor: 'Giriş ayarı bekleniyor', giris_gerekli: 'Giriş gerekli', bulunamadi: 'Eldiven veri dosyası bulunamadı', ag: 'Veriye ulaşılamadı', bicim: 'Veri okunamadı' }[e.kod] || 'Hata';
      return G.bos({ baslik: baslik, metin: e.message, tur: gri ? 'bekle' : 'hata', eylem: gri ? null : { ad: 'Yeniden dene', fn: function () { hata = null; ciz(); yenile(); } } });
    }
    function tazelik(d) {
      var dk = MM.yasDk(d.asof), eski = dk == null || dk > ESKI_DK, kap = document.createDocumentFragment();
      if (d.ornek === true) kap.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — finans rakamları gerçek değil' }));
      if (eski) kap.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — harita günde 3 kez güncellenir; son güncelleme ' + MM.yasMetin(dk) + '. Tarihler ve durumlar güncel olmayabilir.']));
      var satir = h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: 'Harita ' + MM.yasMetin(dk) + ' güncellendi' + (d.asof ? ' (' + MM.saat(new Date(d.asof)) + ' TR)' : '') }), h('span', { sinif: 'kaynak-etiket', metin: yuk.r.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]);
      var tk = d.takip; if (tk && tk.ts) satir.appendChild(h('span', { sinif: 'kaynak-etiket', metin: 'canlı takip: ' + (tk.takipli_n || 0) + ' konteyner · ' + MM.yasMetin(MM.yasDk(tk.ts)) }));
      kap.appendChild(satir); return kap;
    }
    function gelenFiltre() {
      return G.cipler([[30, 'Son 30 gün'], [90, 'Son 90 gün'], [0, 'Tümü']], gelenGun, function (d) { gelenGun = d; ciz(); }, 'Varış tarihine göre');
    }
    function sayfaBasi() {
      sayfaKutu.textContent = '';
      sayfaKutu.appendChild(G.sayfaBasi(detayId ? { baslik: 'Konteyner ' + detayId, alt: 'Eldiven · ayrıntı', kirinti: [['Eldiven', '#eldiven'], ['Konteyner ' + detayId]] } : { baslik: 'Eldiven', alt: 'İthalat konteynerleri', kirinti: [['Eldiven']] }));
    }
    function icerikCiz() {
      govde.textContent = ''; sekmeleriCiz();
      var v = yuk.r.veri, finans = yuk.finans, ornek = v.ornek === true;
      if (detayId) { govde.appendChild(ayrintiSayfasi(v, hz, detayId, finans, ornek)); return; }
      var sira = {
        yolda: function (a, b) { return (a.d.arr == null ? 1e9 : a.d.arr) - (b.d.arr == null ? 1e9 : b.d.arr); },
        liman: function (a, b) { var ka = a.d.kalanSerbest == null ? 1e9 : a.d.kalanSerbest, kb = b.d.kalanSerbest == null ? 1e9 : b.d.kalanSerbest; return ka - kb || (b.d.gun || 0) - (a.d.gun || 0); },
        bekleyen: function (a, b) { return String(a.c.ref || a.c.id) < String(b.c.ref || b.c.id) ? -1 : 1; },
        gelen: function (a, b) { return (b.d.arr || 0) - (a.d.arr || 0); } };
      function liste(grup, bos, ek, eleme) {
        var k = h('div'); if (ek) k.appendChild(ek);
        var l = hz.liste.filter(function (x) { return x.d.grup === grup && (!eleme || eleme(x)); }).sort(sira[grup]);
        if (!l.length) k.appendChild(G.bos({ baslik: bos })); else k.appendChild(listeIzgara(v, l, hz.now));
        return k;
      }
      if (q) {
        var bul = hz.liste.filter(function (x) { return aramaUyar(v, x, q); });
        govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Arama sonucu: ' + bul.length + ' konteyner' }));
        govde.appendChild(bul.length ? listeIzgara(v, bul, hz.now) : G.bos({ baslik: 'Eşleşen konteyner yok' })); return;
      }
      var ic;
      function yenid() { var eski = window.scrollY; icerikCiz(); window.scrollTo(0, eski); }
      if (secili === 'yolda') ic = liste('yolda', 'Şu an yolda konteyner yok.');
      else if (secili === 'liman') { ic = h('div', null, [riskKarti(v, hz), h('div', { sinif: 'ust-bosluk' }, [liste('liman', 'Limanda/antrepoda konteyner yok.')])]); }
      else if (secili === 'bekleyen') ic = liste('bekleyen', 'Bekleyen konteyner yok.');
      else if (secili === 'gelen') ic = liste('gelen', gelenGun ? 'Son ' + gelenGun + ' günde ithal edilmiş konteyner yok — "Tümü" ile ' + hz.liste.filter(function (x) { return x.d.grup === 'gelen'; }).length + ' eski kayıt görülür.' : 'İthal edilmiş konteyner yok.', gelenFiltre(), function (x) { return !gelenGun || (x.d.arr != null && hz.now - x.d.arr <= gelenGun); });
      else if (secili === 'gemi') ic = gemiSekmesi(v, hz, st, yenid, finans);
      else if (secili === 'zaman') ic = zamanSekmesi(v, hz, st, yenid);
      else if (secili === 'takvim') ic = takvimSekmesi(v, hz, st, yenid);
      else if (secili === 'musteri') ic = musteriSekmesi(v, hz);
      else if (secili === 'harita') ic = haritaSekmesi(v, hz, st);
      else if (secili === 'finans' && finans) ic = finansSekmesi(v, hz);
      else ic = G.bos({ baslik: 'Bu görünüm bu rolde yok' });
      govde.appendChild(ic);
      if (ic._sonra) requestAnimationFrame(ic._sonra);
    }
    function ciz() {
      sayfaBasi(); ustAlan.textContent = '';
      if (hata && !yuk) { sekmeleriCiz(); govde.textContent = ''; govde.appendChild(hataKutusu(hata)); return; }
      if (!yuk) { sekmeleriCiz(); govde.textContent = ''; govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.r.veri;
      if (yuk.uyari) ustAlan.appendChild(h('div', { sinif: 'bant sari', role: 'status', metin: yuk.uyari }));
      if (hata) ustAlan.appendChild(hataKutusu(hata));
      ustAlan.appendChild(tazelik(v));
      if (!detayId && ['yolda', 'liman', 'bekleyen', 'gelen', 'musteri'].indexOf(secili) >= 0) ustAlan.appendChild(kpiSeridi(hz, git));
      icerikCiz();
    }
    var sonAsof = null, sonFin = null;
    async function yenile() {
      try {
        yuk = await yukle(); hata = null; hz = hazirla(yuk.r.veri);
        if (!yuk.finans && secili === 'finans') secili = 'yolda';
        if (canli_ && (yuk.r.veri.asof !== sonAsof || yuk.finans !== sonFin || !sonAsof)) { sonAsof = yuk.r.veri.asof; sonFin = yuk.finans; ciz(); }
      } catch (e) { hata = e; if (canli_) ciz(); }
    }
    ciz(); yenile();
    zamanlayici = setInterval(yenile, 5 * 60000);
    function onGorun() { if (!document.hidden) yenile(); }
    document.addEventListener('visibilitychange', onGorun);
    return function temizle() { canli_ = false; clearInterval(zamanlayici); if (zamanTm) { clearInterval(zamanTm); zamanTm = null; } document.removeEventListener('visibilitychange', onGorun); };
  };

  



  MM.moduller.eldiven = function (kok) {
    var qs = new URLSearchParams(location.search), yol = MM.yol();
    if (yol[0] === 'konteyner' || qs.get('esekme') || qs.get('ac')) return MM.moduller.eldivenListe(kok);
    var G = MM.gr, canli = true, yuk = null, cerceve = null, hazir = false, sonAsof = null, sonFin = null, tm = null;
    var bant = h('div', { sinif: 'eld-harita-bant' }), alan = h('div', { sinif: 'eld-harita-alan' });
    kok.appendChild(bant); kok.appendChild(alan);
    function hedef() { return !location.origin || location.origin === 'null' ? '*' : location.origin; }
    function gonder() {
      if (!cerceve || !hazir || !yuk) return;
      cerceve.contentWindow.postMessage({ tip: 'eldiven-board', board: yuk.r.veri }, hedef());
    }
    function hataGoster(e) {
      yukleKapat(); alan.textContent = ''; cerceve = null; hazir = false;
      var gri = e && (e.kod === 'ayar_bekleniyor' || e.kod === 'giris_gerekli');
      alan.appendChild(G.bos({ baslik: gri ? 'Giriş gerekli' : 'Harita verisine ulaşılamadı', metin: (e && e.message) || 'Eldiven veri dosyası okunamadı', tur: gri ? 'bekle' : 'hata',
        eylem: gri ? null : { ad: 'Yeniden dene', fn: function () { yenile(true); } } }));
    }
    function bandCiz(v) {
      bant.textContent = '';
      var dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK;
      if (v.ornek === true) bant.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (eski) bant.appendChild(h('div', { sinif: 'bant sari', role: 'status', title: 'Harita günde 3 kez güncellenir; son güncelleme ' + MM.yasMetin(dk) + '.' }, [h('strong', { metin: 'Veri eski' }), ' · ' + MM.yasMetin(dk)]));
    }
    var yukKutu = null, yukTm = null;   
    function yukleKapat() { clearTimeout(yukTm); if (yukKutu && yukKutu.parentNode) yukKutu.parentNode.removeChild(yukKutu); yukKutu = null; }
    function yukleGoster() {
      yukleKapat();
      yukKutu = h('div', { sinif: 'eld-yukle', role: 'status', metin: 'Harita yükleniyor…' });
      alan.appendChild(yukKutu);
      yukTm = setTimeout(function () { if (canli && !hazir) hataGoster({ message: 'Harita zamanında açılamadı. Bağlantınızı kontrol edip yeniden deneyin.' }); }, 20000);
    }
    function cercevePrepare() {   
      alan.textContent = ''; hazir = false;
      cerceve = h('iframe', { sinif: 'eld-harita-cerceve', title: 'Eldiven haritası', allow: 'fullscreen', loading: 'eager' });
      cerceve.src = 'eldiven-harita/harita.html' + (yuk.finans ? '?r=y' : '?r=p') + '&dil=' + (MM.dil && MM.dil() === 'en' ? 'en' : 'tr');   
      cerceve.addEventListener('load', yukleKapat);
      alan.appendChild(cerceve);
      yukleGoster();
      boyutla();
    }
    

    function boyutla() {
      if (!cerceve || !cerceve.isConnected) return;
      var menu = document.getElementById('menu'), mr = menu ? menu.getBoundingClientRect() : null;
      var alt = mr && mr.height < 120 && mr.top > 0 ? mr.top : window.innerHeight;
      var r = cerceve.getBoundingClientRect(), ust = r.top + (window.pageYOffset || 0);   
      var hh = Math.floor(alt - ust);
      if (hh < 280) hh = 280;   
      cerceve.style.minHeight = '0'; cerceve.style.height = hh + 'px';
       
      var fazla = document.documentElement.scrollHeight - window.innerHeight;
      if (fazla > 0 && hh - fazla >= 280) cerceve.style.height = (hh - fazla) + 'px';
      if (window.pageYOffset) window.scrollTo(0, 0);
    }
    window.addEventListener('resize', boyutla); window.addEventListener('orientationchange', boyutla);
    function mesaj(e) {
      if (!cerceve || e.source !== cerceve.contentWindow) return;
      if (e.data && e.data.tip === 'eldiven-hazir') { hazir = true; yukleKapat(); boyutla(); gonder(); }
    }
    window.addEventListener('message', mesaj);
    async function yenile(zorla) {
      try {
        yuk = await yukle();
        if (!canli) return;
        bandCiz(yuk.r.veri);
        if (!cerceve || yuk.finans !== sonFin || zorla) { sonFin = yuk.finans; sonAsof = yuk.r.veri.asof; cercevePrepare(); }
        else if (yuk.r.veri.asof !== sonAsof) { sonAsof = yuk.r.veri.asof; gonder(); }
      } catch (e) { if (canli && !cerceve) hataGoster(e); }
    }
    alan.appendChild(G.iskelet('kart', 3));
    yenile();
    tm = setInterval(yenile, 5 * 60000);
    function onGorun() { if (!document.hidden) yenile(); }
    document.addEventListener('visibilitychange', onGorun);
    return function temizle() { canli = false; clearInterval(tm); clearTimeout(yukTm); window.removeEventListener('message', mesaj); window.removeEventListener('resize', boyutla); window.removeEventListener('orientationchange', boyutla); document.removeEventListener('visibilitychange', onGorun); };
  };
})();
