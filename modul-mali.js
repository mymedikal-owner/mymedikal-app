



(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, EN = window.MM_LOC === 'en-GB';

   
  function para(n) {
    if (n == null || !isFinite(n)) return '—';
    var a = Math.abs(n), u = EN ? ['bn', 'm', 'k'] : ['mr', 'mn', 'b'], t;
    if (a >= 1e9) t = G.say(a / 1e9, 2) + ' ' + u[0]; else if (a >= 1e6) t = G.say(a / 1e6, 1) + ' ' + u[1]; else if (a >= 1e3) t = G.say(a / 1e3, 0) + ' ' + u[2]; else t = G.say(a);
    return (n < 0 ? '−' : '') + '₺ ' + t;
  }
  function pct(n, o) { if (n == null || !isFinite(n)) return '—'; var t = G.say(Math.abs(n), 1); return (n < 0 ? '−' : (o && o.arti && n > 0 ? '+' : '')) + (EN ? t + '%' : '%' + t); }
  function ayAd(iso, uzun) {
    if (!iso) return '—'; var p = iso.split('-'), d = new Date(Date.UTC(+p[0], +p[1] - 1, 1));
    return new Intl.DateTimeFormat(window.MM_LOC || 'tr-TR', uzun ? { month: 'long', year: 'numeric', timeZone: 'UTC' } : { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(d);
  }
  function ayKisa(iso, yilli) {
    var p = iso.split('-'), d = new Date(Date.UTC(+p[0], +p[1] - 1, 1));
    var m = new Intl.DateTimeFormat(window.MM_LOC || 'tr-TR', { month: 'short', timeZone: 'UTC' }).format(d);
    return yilli ? m + ' ' + String(p[0]).slice(2) : m;
  }
  function tarihTR(iso) { if (!iso) return '—'; var p = String(iso).slice(0, 10).split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function hesapKur(rol) { return rol; }
   
  function bar(ogeler, o) {
    o = o || {}; var W = 640, H = o.yukseklik || 190, sol = 46, alt = 24, ust = 12, n = ogeler.length, yy = H - alt - ust;
    var vals = ogeler.map(function (x) { return x.d == null ? 0 : x.d; }), mx = Math.max.apply(null, vals.concat([0])), mn = Math.min.apply(null, vals.concat([0]));
    if (mx === 0 && mn === 0) mx = 1; var ar = (mx - mn) || 1; mx = mx + (mx > 0 ? ar * .06 : 0); mn = mn - (mn < 0 ? ar * .06 : 0); ar = mx - mn;
    var Y = function (v) { return ust + yy * (1 - (v - mn) / ar); }, gen = (W - sol - 8) / Math.max(n, 1), cg = Math.max(4, Math.min(gen * .62, 26));
    var svg = G.s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'grafik', role: 'group', 'aria-label': o.ad || 'Çubuk grafik' });
    var cizgiler = [mx, (mx + mn) / 2, mn]; if (mn < 0 && mx > 0) cizgiler = [mx, 0, mn];
    cizgiler.forEach(function (v) { var y = Y(v); svg.appendChild(G.s('line', { x1: sol, x2: W - 4, y1: y, y2: y, class: v === 0 ? 'g-eksen' : 'g-izgara' })); svg.appendChild(G.s('text', { x: sol - 6, y: y + 4, 'text-anchor': 'end', class: 'g-yazi' }, [G.kisa(v)])); });
    var adim = n > 12 ? 3 : (n > 8 ? 2 : 1), y0 = Y(0);
    ogeler.forEach(function (x, i) {
      var cx = sol + gen * i + (gen - cg) / 2, g = G.s('g', { class: 'g-cubuk' });
      if (x.d != null) { var yv = Y(x.d), top = Math.min(yv, y0), hh = Math.max(Math.abs(yv - y0), 1); g.appendChild(G.s('rect', { x: cx, y: top, width: cg, height: hh, rx: Math.min(3, cg / 2), style: 'fill:' + (x.renk || 'var(--s1)') + (x.soluk ? ';opacity:.38' : '') })); }
      g.appendChild(G.s('rect', { x: sol + gen * i, y: ust, width: gen, height: yy + alt, fill: 'transparent', class: 'g-hit' }));
      G.ipucu(g, x.ipucu || [x.e + ': ' + (x.d == null ? '—' : G.kisa(x.d))]);
      svg.appendChild(g);
      if (i % adim === 0 || i === n - 1) svg.appendChild(G.s('text', { x: cx + cg / 2, y: H - 7, 'text-anchor': 'middle', class: 'g-yazi' }, [x.e]));
    });
    return svg;
  }
  MM.s41 = { para: para, pct: pct, ayAd: ayAd, ayKisa: ayKisa, tarihTR: tarihTR, bar: bar, EN: EN };

   
  var ESKI_DK = 36 * 60;
  var ROLL = [['son_3_ay', 'Son 3 ay', 3], ['son_6_ay', 'Son 6 ay', 6], ['son_9_ay', 'Son 9 ay', 9], ['son_12_ay', 'Son 12 ay', 12]];
  var SATIRLAR = [
    ['Brüt satış', 'brut_satis', 'kalem'], ['İade ve indirimler', 'iade_indirim', 'gider'], ['Net satış', 'net_satis', 'ara'],
    ['Satılan malın maliyeti', 'smm', 'gider'], ['Brüt kâr', 'brut_kar', 'ara', 'brut_marj'],
    ['Faaliyet giderleri', 'faaliyet_gideri', 'gider'], ['Ar-Ge', 'arge', 'altgider'], ['Pazarlama', 'pazarlama', 'altgider'], ['Genel yönetim', 'genel_yonetim', 'altgider'],
    ['Esas faaliyet kârı', 'esas_faaliyet_kari', 'ara', 'esas_faaliyet_marj'], ['Amortisman (eklenir)', 'amortisman', 'alt'], ['FAVÖK', 'favok', 'vurgu', 'favok_marj'],
    ['Diğer gelirler', 'diger_gelir', 'kalem'], ['Diğer giderler', 'diger_gider', 'gider'], ['Finansman giderleri', 'finansman_gideri', 'gider'],
    ['Olağan dışı gelir', 'olagandisi_gelir', 'kalem'], ['Olağan dışı gider', 'olagandisi_gider', 'gider'], ['Dönem kârı (vergi öncesi)', 'vergi_oncesi_kar', 'vurgu', 'net_marj']
  ];

  function donemListesi(s) {
    var l = [], dk = s.donemler_maliyet_kapali || {}, yl = s.yillar || {}, yillar = Object.keys(yl).sort();
    ROLL.forEach(function (x) { var p = dk[x[0]]; if (p && p.rakamlar) l.push({ id: x[0], ad: x[1], yil: false, p: p, n: x[2] }); });
    yillar.forEach(function (y) {
      var p = yl[y]; if (!p || !p.rakamlar) return;
      if (yillar.length > 1 && (p.ay_sayisi || 0) < 3) return;   
      l.push({ id: 'y' + y, ad: y, yil: true, p: p, n: p.ay_sayisi });
    });
    return l;
  }
  function oncekiRakam(d) { var p = d.p; if (d.yil) return p.onceki_ayni_donem && p.onceki_ayni_donem.rakamlar; return p.onceki && p.onceki.rakamlar; }

  

  var KALEM_AD = { net_satis: 'Net satış', smm: 'Satılan malın maliyeti', brut_kar: 'Brüt kâr', faaliyet_gideri: 'Faaliyet giderleri', esas_faaliyet_kari: 'Esas faaliyet kârı', favok: 'FAVÖK', finansman_gideri: 'Finansman giderleri', net_kar: 'Dönem kârı (vergi öncesi)' };
  var SAPMA_ESLE = { vergi_oncesi_kar: 'net_kar' };
  function tam(n) { return n == null || !isFinite(n) ? '—' : (n < 0 ? '−' : '') + '₺ ' + G.say(Math.abs(n)); }
  function pyz(n) { if (n == null || !isFinite(n)) return '—'; var t = G.say(Math.abs(n), 1); return (n > 0 ? '+' : (n < 0 ? '−' : '')) + (EN ? t + '%' : '%' + t); }
  

  function dar() { return !!(window.matchMedia && window.matchMedia('(max-width: 599px)').matches); }
  function katla(st, anahtar, k, ad, say, zorunlu) {
    if (!dar() || !k) return k;
    if (k.firstChild && k.firstChild.tagName === 'HEADER') k.removeChild(k.firstChild);
    if (!st.acik) st.acik = {};
    var d = h('details', { sinif: 'acilir-bolum ms-katla' }, [h('summary', null, [h('span', { metin: ad }), say ? h('span', { sinif: 'ms-katla-say', metin: say }) : null]), k]);
    if (zorunlu || st.acik[anahtar]) d.open = true;
    d.addEventListener('toggle', function () { if (!zorunlu) st.acik[anahtar] = d.open; });
    return d;
  }
  function analizOku() {
    return window.MMVeri.oku('muhasebe', 'analiz').then(function (r) { var v = r && r.veri; return v && typeof v === 'object' && !Array.isArray(v) ? v : null; }).catch(function () { return null; });
  }
  function sapmaAy(an) {
    var s = an && an.sapma, o = s && s.ozet; if (!o || !o.ay) return null;
    var a = (s.aylar || []).filter(function (x) { return x.ay === o.ay; })[0];
    return a && a.kalemler ? { ay: o.ay, kalemler: a.kalemler } : null;
  }
   
  function sapmaIsareti(an, anahtar) {
    var sa = sapmaAy(an); if (!sa) return null;
    var k = sa.kalemler[SAPMA_ESLE[anahtar] || anahtar]; if (!k || !k.isaret || !k.isaret.length) return null;
    var yukari = (k.isaret.indexOf('ay') >= 0 ? k.fark_ay : k.fark_yil) > 0;   
    var ip = ayAd(sa.ay, true) + ': ' + (k.fark_ay_yuzde != null ? (EN ? 'month/month ' : 'ay/ay ') + pyz(k.fark_ay_yuzde) : '') + (k.fark_yil_yuzde != null ? ' · ' + (EN ? 'year/year ' : 'yıl/yıl ') + pyz(k.fark_yil_yuzde) : '');
    return h('span', { sinif: 'delta ' + (k.yon === 'olumlu' ? 'iyi' : (k.yon === 'olumsuz' ? 'kotu' : 'nötr')), title: ip, role: 'img', 'aria-label': 'Önemli sapma: ' + ip, style: 'margin-left:6px;font-size:.8em' }, [yukari ? '▲' : '▼']);
  }
  function sapmaKarti(an) {
    var s = an && an.sapma, o = s && s.ozet; if (!o || !Array.isArray(o.ilk_5_isaretli)) return null;
    var e = s.esikler || {}, aylar = s.aylar || [], geciciAylar = aylar.filter(function (x) { return x.ay > o.ay && x.durum !== 'kapali'; });
    var alt = ayAd(o.ay, true) + ' · ' + (EN ? 'flagged when ' : 'Eşik: ay/ay ') + (EN ? 'month/month ' + pct(e.ay_ay_yuzde) + ', year/year ' + pct(e.yil_yil_yuzde) + ' and ' + para(e.tl) + ' are all exceeded' : pct(e.ay_ay_yuzde) + ', yıl/yıl ' + pct(e.yil_yil_yuzde) + ' ve ' + para(e.tl) + ' birlikte aşılırsa işaretlenir');
    var govde;
    if (!o.ilk_5_isaretli.length) govde = h('p', { sinif: 'soluk', metin: 'Eşiği aşan sapma yok.' });
    else govde = h('div', { sinif: 'tablo-kaydir' }, [h('table', { sinif: 'ml-tablo' }, [
      h('thead', null, [h('tr', null, [h('th', { scope: 'col', metin: 'Kalem' }), h('th', { scope: 'col', metin: 'Değer' }), h('th', { scope: 'col', metin: 'Ay/ay' }), h('th', { scope: 'col', metin: 'Yıl/yıl' })])]),
      h('tbody', null, o.ilk_5_isaretli.map(function (k) {
        var iyi = k.yon === 'olumlu' ? 'iyi' : (k.yon === 'olumsuz' ? 'kotu' : 'nötr');
        return h('tr', null, [h('td', null, [KALEM_AD[k.kalem] || k.kalem, h('small', { metin: k.yon === 'olumlu' ? 'Olumlu yönde' : (k.yon === 'olumsuz' ? 'Olumsuz yönde' : '') })]),
          h('td', { metin: para(k.deger) }),
          h('td', null, [h('span', { sinif: 'delta ' + iyi, metin: pyz(k.fark_ay_yuzde) }), h('small', { metin: para(k.fark_ay) })]),
          h('td', null, [h('span', { sinif: 'delta ' + iyi, metin: pyz(k.fark_yil_yuzde) }), h('small', { metin: para(k.fark_yil) })])]);
      }))])]);
    return G.kart({ baslik: 'Önemli sapmalar', alt: alt, govde: govde, dip: geciciAylar.length ? geciciAylar.map(function (x) { return ayAd(x.ay, true); }).join(', ') + ' ' + (geciciAylar.length > 1 ? 'ayları' : 'ayı') + ' maliyeti kapanmadığı için (geçici) sapma hesabına katılmadı; son maliyeti kapanmış ay esas alındı.' : null });
  }

  var KOPRU_SEC = [['son_tam_ay_vs_onceki_ay', 'Önceki aya göre'], ['son_tam_ay_vs_gecen_yil_ayni_ay', 'Geçen yılın aynı ayına göre'], ['yil_basi_vs_gecen_yil_ayni_donem', 'Yıl başı, geçen yılın aynı dönemine göre']];
  var KOPRU_ADIM = [['Fiyat etkisi', 'fiyat_etkisi'], ['Hacim / ürün karışımı etkisi', 'miktar_karisim_etkisi'], ['Yeni ürün', 'yeni_urun'], ['Biten ürün', 'biten_urun'], ['İade etkisi', 'iade_etkisi'], ['Faturalandırma dışı / GL farkı', 'gl_fark_degisimi']];
  function donemMetni(d) { if (!d) return '—'; var p = String(d).split('..'); return p[0] === p[1] ? ayAd(p[0], true) : ayAd(p[0], true) + ' – ' + ayAd(p[1], true); }
  function kopruSatir(ad, v, mx, toplam) {
    var oran = mx ? Math.min(Math.abs(v) / mx, 1) * 50 : 0;
    var cubuk = toplam ? null : h('div', { style: 'position:absolute;top:3px;bottom:3px;border-radius:3px;width:' + oran + '%;' + (v >= 0 ? 'left:50%;background:var(--s1)' : 'right:50%;background:var(--turuncu)') });
    return h('div', { style: 'display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) auto;gap:8px;align-items:center;padding:5px 0;border-bottom:1px solid var(--cizgi);font-variant-numeric:tabular-nums' + (toplam ? ';font-weight:700' : '') }, [
      h('span', { metin: ad, style: 'overflow-wrap:anywhere' }),
      h('div', { style: 'position:relative;height:20px' }, toplam ? null : [h('div', { style: 'position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--cizgi)' }), cubuk]),
      h('span', { metin: toplam ? para(v) : (v > 0 ? '+' : '') + para(v), style: 'text-align:right;white-space:nowrap' })]);
  }
  function kopruKarti(an, st, yenidenCiz) {
    var k = an && an.ciro_kopru, kar = k && k.karsilastirmalar; if (!kar) return null;
    var secenek = KOPRU_SEC.filter(function (x) { return kar[x[0]]; }); if (!secenek.length) return null;
    if (!st.kopru || !kar[st.kopru]) st.kopru = secenek[0][0];
    var c = kar[st.kopru], mx = 0;
    KOPRU_ADIM.forEach(function (a) { mx = Math.max(mx, Math.abs(c[a[1]] || 0)); });
    var satirlar = [kopruSatir('Başlangıç: GL net satış (' + donemMetni(c.donem0) + ')', c.baslangic_gl, mx, true)];
    KOPRU_ADIM.forEach(function (a) { satirlar.push(kopruSatir(a[0], c[a[1]] || 0, mx, false)); });
    satirlar.push(kopruSatir('Bitiş: GL net satış (' + donemMetni(c.donem1) + ')', c.bitis_gl, mx, true));
    var f = [h('div', null, [G.cipler(secenek.map(function (x) { return [x[0], x[1]]; }), st.kopru, function (id) { st.kopru = id; st.malzeme = false; yenidenCiz(); }, 'Karşılaştırma')]), h('div', { style: 'margin-top:8px' }, satirlar)];
    if (c.kapanis_farki != null && Math.abs(c.kapanis_farki) > 1) f.push(h('div', { sinif: 'bant sari', role: 'status', style: 'margin-top:8px' }, [h('strong', { metin: 'Köprü kapanmıyor: ' }), 'fark ' + tam(c.kapanis_farki) + '.']));
    var dv = c.doviz_faturalar, dm = [];
    if (dv) ['donem0', 'donem1'].forEach(function (dn) { var m = dv[dn] || {}; Object.keys(m).forEach(function (cur) { dm.push(cur + ' ' + G.say(m[cur].fatura) + ' (' + m[cur].satir + (EN ? ' lines, ' : ' satır, ') + donemMetni(c[dn]) + ')'); }); });
    if (dm.length) f.push(h('p', { sinif: 'soluk kucuk', style: 'margin-top:8px', metin: 'Döviz cinsi faturalar (çevrilmedi, TL karşılığı faturalandırma dışı / GL farkı içinde kalır): ' + dm.join('; ') }));
    var ml = (c.en_etkili_10_malzeme || []).slice(0, 10);
    if (ml.length) {
      f.push(h('button', { type: 'button', sinif: 'mini-dugme', 'aria-expanded': st.malzeme ? 'true' : 'false', style: 'margin-top:8px', onclick: function () { st.malzeme = !st.malzeme; yenidenCiz(); }, metin: st.malzeme ? 'En etkili malzemeleri gizle' : 'En etkili 10 malzemeyi göster' }));
      if (st.malzeme) f.push(h('div', { sinif: 'tablo-kaydir', style: 'margin-top:8px' }, [h('table', { sinif: 'ml-tablo' }, [
        h('thead', null, [h('tr', null, [h('th', { scope: 'col', metin: 'Malzeme' }), h('th', { scope: 'col', metin: 'Toplam etki' }), h('th', { scope: 'col', sinif: 'on', metin: 'Fiyat' }), h('th', { scope: 'col', sinif: 'on', metin: 'Hacim / karışım' }), h('th', { scope: 'col', sinif: 'on', metin: 'Yeni' }), h('th', { scope: 'col', sinif: 'on', metin: 'Biten' })])]),
        h('tbody', null, ml.map(function (m) {
          return h('tr', null, [h('td', null, [m.malzeme_tanimi || m.malzeme_kodu, h('small', { metin: m.malzeme_kodu })]), h('td', { metin: para(m.etki) }), h('td', { sinif: 'on', metin: para(m.fiyat) }), h('td', { sinif: 'on', metin: para(m.miktar_karisim) }), h('td', { sinif: 'on', metin: para(m.yeni) }), h('td', { sinif: 'on', metin: para(m.biten) })]);
        }))])]));
    }
    var kAlt = donemMetni(c.donem0) + ' → ' + donemMetni(c.donem1) + ' · GL net satış (MY)', kapanmiyor = c.kapanis_farki != null && Math.abs(c.kapanis_farki) > 1;
    return katla(st, 'kopru', G.kart({ baslik: 'Ciro köprüsü', alt: kAlt, govde: h('div', null, f) }), 'Ciro köprüsü', kAlt, kapanmiyor);   
  }

  function nakitKarti(an, st) {
    var n = an && an.nakit_akis, ay = n && Array.isArray(n.aylar) ? n.aylar.filter(function (a) { return a.faaliyet_nakdi != null; }).slice(-12) : [];
    if (!ay.length) return null;
    var oge = [];
    ay.forEach(function (a) {
      var et = ayKisa(a.ay, a.ay.slice(5) === '01'), ip = function (ad, v) { return [ayAd(a.ay, true), ad + ': ' + para(v), a.gecici ? 'Geçici ay (maliyet dağıtımı eksik)' : '']; };
      oge.push({ e: et, d: a.faaliyet_nakdi, renk: 'var(--s1)', soluk: !!a.gecici, ipucu: ip('Faaliyet', a.faaliyet_nakdi) });
      oge.push({ e: '', d: a.yatirim_nakdi_yaklasik, renk: 'var(--s2)', soluk: !!a.gecici, ipucu: ip('Yatırım (yaklaşık)', a.yatirim_nakdi_yaklasik) });
      oge.push({ e: '', d: a.finansman_nakdi_yaklasik, renk: 'var(--turuncu)', soluk: !!a.gecici, ipucu: ip('Finansman (yaklaşık)', a.finansman_nakdi_yaklasik) });
    });
    var pn = n.pencereler || {}, KOL = [['son_3_ay', 'Son 3 ay'], ['son_6_ay', 'Son 6 ay'], ['son_12_ay', 'Son 12 ay']].filter(function (x) { return pn[x[0]]; });
    var SAT = [['Faaliyetlerden nakit', 'faaliyet_nakdi'], ['Yatırım (yaklaşık)', 'yatirim_nakdi_yaklasik'], ['Finansman (yaklaşık)', 'finansman_nakdi_yaklasik'], ['Nakit değişimi', 'nakit_degisimi_hesaplanan']];
    var tab = h('div', { sinif: 'tablo-kaydir' }, [h('table', { sinif: 'ml-tablo' }, [
      h('thead', null, [h('tr', null, [h('th', { scope: 'col', metin: 'Kalem' })].concat(KOL.map(function (x) { return h('th', { scope: 'col', metin: x[1] }); })))]),
      h('tbody', null, SAT.map(function (s) { return h('tr', { sinif: s[1] === 'nakit_degisimi_hesaplanan' ? 'vurgu' : '' }, [h('td', { metin: s[0] })].concat(KOL.map(function (x) { return h('td', { metin: para(pn[x[0]][s[1]]) }); }))); }))])]);
    var geciciAy = ay.filter(function (a) { return a.gecici; }).map(function (a) { return ayAd(a.ay, true); });
    var nAlt = 'Dolaylı yöntem, aylık · yatırım ve finansman yaklaşık';
     
    return katla(st, 'nakit', G.kart({ baslik: 'Nakit akışı', alt: nAlt, govde: h('div', null, [bar(oge, { ad: 'Aylık nakit akışı', yukseklik: 200 }),
      G.lejant([['Faaliyet', 'var(--s1)'], ['Yatırım (yaklaşık)', 'var(--s2)'], ['Finansman (yaklaşık)', 'var(--turuncu)']]), h('div', { style: 'margin-top:8px' }, [tab])]),
      dip: geciciAy.length ? 'Soluk çubuk ve tablo, maliyet dağıtımı tamamlanmamış geçici aylar içerir: ' + geciciAy.join(', ') + '.' : null }), 'Nakit akışı', nAlt, geciciAy.length > 0);
  }

   
  function tfrsSatirlar(sat, kolonlar) {
    return sat.map(function (r) {
      var kok = r.tur === 'baslik';
      var ilk = h('td', { colspan: kok ? String(kolonlar.length + 1) : null, style: 'min-width:170px' }, [r.ad, r.kaynak_hesap ? h('small', { metin: (EN ? 'Accounts: ' : 'Hesap: ') + r.kaynak_hesap }) : null, r.not ? h('small', { metin: r.not }) : null]);
      if (kok) return h('tr', { sinif: 'ara' }, [ilk]);
      var degerler = kolonlar.map(function (k) { return h('td', { metin: tam(k(r)) }); });
      var sinif = r.tur === 'toplam' ? 'vurgu' : (r.tur === 'ara' ? 'ara' : (r.tur === 'alt' || r.tur === 'uyum' ? 'alt' : ''));
      return h('tr', { sinif: sinif }, [ilk].concat(degerler));
    });
  }
   
  function tfrsTablo(baslik, alt, kolonAd, kolonlar, sat, kat, ek) {
    var t = h('table', { sinif: 'ml-tablo' }, [h('thead', null, [h('tr', null, [h('th', { scope: 'col', metin: 'Kalem' })].concat(kolonAd.map(function (a) { return h('th', { scope: 'col', metin: a }); })))]), h('tbody', null, tfrsSatirlar(sat, kolonlar))]);
    var kaydir = h('div', { sinif: 'tablo-kaydir' }, [t]);
    var k = G.kart({ baslik: baslik, alt: alt, govde: ek && ek.length ? h('div', null, [kaydir].concat(ek)) : kaydir });
    return kat ? katla(kat.st, kat.k, k, baslik, alt + ' · ' + sat.length + (EN ? ' rows' : ' satır')) : k;
  }
  MM.tfrsTab = function (kok) {
    var an = undefined, canli = true, ust = h('div'), govde = h('div', { 'aria-live': 'polite' }), st = { acik: {} };   
    kok.appendChild(ust); kok.appendChild(govde);
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (an === undefined) { govde.appendChild(G.iskelet('kart', 3)); return; }
      var f = an && an.ifrs;
      if (!f) { govde.appendChild(G.bos({ baslik: 'TFRS tabloları alınamadı', metin: 'Analiz verisi okunamadı ya da henüz hazırlanmadı.', eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (an.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      var dk = MM.yasDk(an.asof);
      if (dk == null || dk > ESKI_DK) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '. Değerler güncel olmayabilir.']));
       
      ust.appendChild(h('div', { sinif: 'bant sari', role: 'note' }, [h('strong', { metin: f.standart + ': ' }), f.uyari || '']));
      ust.appendChild(h('p', { sinif: 'soluk kucuk', metin: (f.sirket || 'MY') + ' · ' + (f.para_birimi || 'TL') + ' · ' + (f.day_notu || '') }));
      var fd = f.finansal_durum, kz = f.kar_zarar, na = f.nakit_akis;
      if (fd) {
        if (fd.uygun) {
          govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [tfrsTablo('Finansal durum tablosu', ayAd(fd.tarih, true) + ' sonu · karşılaştırma: ' + (fd.onceki_tarih ? ayAd(fd.onceki_tarih, true) + ' sonu' : '—') + ' (TMS 1)', [ayAd(fd.tarih, true), fd.onceki_tarih ? ayAd(fd.onceki_tarih, true) : 'Önceki'], [function (r) { return r.deger; }, function (r) { return r.onceki; }], fd.satirlar || [])]));
          if (fd.yansitma_notu) govde.appendChild(h('p', { sinif: 'soluk kucuk', metin: fd.yansitma_notu + (fd.denge_farki ? ' Denge farkı: ' + tam(fd.denge_farki) + '.' : '') }));
        } else govde.appendChild(h('div', { sinif: 'bant gri', role: 'status', metin: 'Finansal durum tablosu üretilemedi.' }));
      }
      if (kz) {
        if (kz.uygun) {
          var gecici = (kz.gecici_aylar || []).concat(kz.onceki_gecici_aylar || []), kzDar = dar();
          govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [tfrsTablo('Kâr veya zarar tablosu (fonksiyon esaslı)', ayAd(kz.baslangic, true) + ' – ' + ayAd(kz.bitis, true) + ' · karşılaştırma: ' + ayAd(kz.onceki_baslangic, true) + ' – ' + ayAd(kz.onceki_bitis, true) + ' (TMS 1)', [ayKisa(kz.baslangic) + ' – ' + ayAd(kz.bitis), ayKisa(kz.onceki_baslangic) + ' – ' + ayAd(kz.onceki_bitis)], [function (r) { return r.deger; }, function (r) { return r.onceki; }], kz.satirlar || [], { st: st, k: 'kz' }, kzDar && kz.kur_farki_siniflamasi ? [h('p', { sinif: 'soluk kucuk', metin: 'Kur farkı sınıflaması: ' + kz.kur_farki_siniflamasi + '.' })] : null)]));
          var notlar = []; if (kz.kur_farki_siniflamasi && !kzDar) notlar.push('Kur farkı sınıflaması: ' + kz.kur_farki_siniflamasi + '.'); if (gecici.length) notlar.push('Maliyeti tamamlanmamış (geçici) aylar: ' + gecici.map(function (a) { return ayAd(a, true); }).join(', ') + '.');   
          if (notlar.length) govde.appendChild(h('p', { sinif: 'soluk kucuk', metin: notlar.join(' ') }));
        } else govde.appendChild(h('div', { sinif: 'bant gri', role: 'status', metin: 'Kâr veya zarar tablosu üretilemedi.' }));
      }
      if (na) {
        if (na.uygun) {
          var naDar = dar(), dn = (na.donemler || []).filter(function (d) { return na.satirlar && na.satirlar.length; });
          govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [tfrsTablo('Nakit akış tablosu', (na.standart || 'TMS 7 (dolaylı yöntem)') + ' · yatırım ve finansman yaklaşık', dn.map(function (d) { return d.ad + ' (' + ayAd(d.baslangic) + ' – ' + ayAd(d.bitis) + ')'; }),
            dn.map(function (d) { return function (r) { return r.degerler ? r.degerler[d.id] : null; }; }), na.satirlar || [], { st: st, k: 'na' }, naDar && (na.notlar || []).length ? [h('p', { sinif: 'soluk kucuk', metin: na.notlar.join(' ') })] : null)]));
          var ngec = []; (na.donemler || []).forEach(function (d) { (d.gecici_aylar || []).forEach(function (a) { if (ngec.indexOf(a) < 0) ngec.push(a); }); });
          var nn = naDar ? [] : (na.notlar || []).slice(); if (ngec.length) nn.push('Maliyeti tamamlanmamış (geçici) aylar: ' + ngec.map(function (a) { return ayAd(a, true); }).join(', ') + '.');
          if (nn.length) govde.appendChild(h('p', { sinif: 'soluk kucuk', metin: nn.join(' ') }));
        } else govde.appendChild(h('div', { sinif: 'bant gri', role: 'status', metin: 'Nakit akış tablosu üretilemedi.' }));
      }
    }
    function yenile() { an = undefined; ciz(); analizOku().then(function (a) { an = a; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  };

  MM.maliTab = function (kok) {
    var yuk = null, hata = null, canli = true, st = { sirket: 'MY', donem: null }, an = null;   
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);

    function kart(ad, deger, alt, simdi, onceki, etiket) {
      return h('div', { sinif: 'ml-kpi' }, [h('div', { sinif: 'ml-kpi-ad', metin: ad }), h('div', { sinif: 'ml-kpi-deger', metin: deger }), alt ? h('div', { sinif: 'ml-kpi-alt', metin: alt }) : null,
        h('div', { sinif: 'ml-kpi-delta' }, [G.delta(simdi, onceki, { iyi: 'yukari', etiket: etiket })])]);
    }
    function degisimHucre(simdi, onceki, iyi) {
      if (simdi == null || onceki == null || !onceki) return h('span', { sinif: 'soluk', metin: '—' });
      return G.delta(simdi, onceki, { iyi: iyi, etiket: '' });
    }
    function gelirTablosu(d, onc) {
      var r = d.p.rakamlar, sat = SATIRLAR.map(function (s) {
        var cur = r[s[1]], pre = onc ? onc[s[1]] : null, gider = s[2] === 'gider' || s[2] === 'altgider';
        if ((s[2] === 'altgider' || s[2] === 'gider') && !cur) return null;   
        var yaz = function (v) { return v == null ? '—' : (gider ? para(-v) : para(v)); };
        var deg = s[2] === 'altgider' && pre == null ? null : degisimHucre(cur, pre, gider ? 'asagi' : 'yukari');
        return h('tr', { sinif: s[2] }, [h('td', null, [s[0], st.sirket === 'MY' ? sapmaIsareti(an, s[1]) : null]),
          h('td', null, [h('span', { metin: yaz(cur) }), s[3] && r[s[3]] != null ? h('small', { metin: 'Marj ' + pct(r[s[3]]) }) : null]),
          h('td', { sinif: 'on', metin: onc ? yaz(pre) : '—' }), h('td', null, [deg || h('span', { sinif: 'soluk', metin: '—' })])]);
      }).filter(Boolean);
      var t = h('table', { sinif: 'ml-tablo' }, [h('thead', null, [h('tr', null, [h('th', { scope: 'col', metin: 'Kalem' }), h('th', { scope: 'col', metin: 'Bu dönem' }), h('th', { scope: 'col', sinif: 'on', metin: 'Önceki dönem' }), h('th', { scope: 'col', metin: 'Değişim' })])]), h('tbody', null, sat)]);
      var sa = st.sirket === 'MY' ? sapmaAy(an) : null;
      return h('div', null, [h('div', { sinif: 'tablo-kaydir' }, [t]), sa ? h('p', { sinif: 'soluk kucuk', metin: '▲ ▼ işareti: ' + ayAd(sa.ay, true) + ' ayında önceki aya ya da geçen yıla göre eşiği aşan kalem (ayrıntı aşağıdaki "Önemli sapmalar" kartında).' }) : null]);
    }
    function aylikVeri(s, d) {
      var seri = (s.aylik_seri || []).filter(function (a) { return a.ay <= d.p.bitis; });
      if (d.yil) seri = seri.filter(function (a) { return a.ay.slice(0, 4) === String(d.p.baslangic).slice(0, 4); });
      else seri = seri.slice(-12);
      return seri;
    }
    function grafikler(s, d) {
      var seri = aylikVeri(s, d), kok2 = h('div', { sinif: 's41-ikili' });
      if (!seri.length) return null;
      var pencereDisi = function (a) { return !d.yil && (a.ay < d.p.baslangic); }, eksikAy = function (a) { return a.durum !== 'kapali'; };
      var etk = seri.map(function (a, i) { return ayKisa(a.ay, i === 0 || a.ay.slice(5) === '01'); });
      var satis = bar(seri.map(function (a, i) { return { e: etk[i], d: a.net_satis, soluk: pencereDisi(a), ipucu: [ayAd(a.ay, true), 'Net satış: ' + para(a.net_satis)] }; }), { ad: 'Aylık net satış' });
      var favok = bar(seri.map(function (a, i) { return { e: etk[i], d: a.favok, renk: eksikAy(a) ? 'var(--turuncu)' : 'var(--s2)', soluk: pencereDisi(a), ipucu: [ayAd(a.ay, true), 'FAVÖK: ' + para(a.favok), eksikAy(a) ? 'Maliyeti tamamlanmadı' : ''] }; }), { ad: 'Aylık FAVÖK' });
      var marj = G.cizgi([
        { ad: 'Brüt marj', renk: 'var(--s1)', d: seri.map(function (a) { return eksikAy(a) ? null : a.brut_marj; }) },
        { ad: 'FAVÖK marjı', renk: 'var(--s2)', d: seri.map(function (a) { return eksikAy(a) ? null : a.favok_marj; }) }], etk, { sifirdan: false, ad: 'Marj eğilimi', ondalik: 1, birim: '%' });
      var seciliLej = !d.yil && seri.some(pencereDisi) ? [['Seçili dönem', 'var(--s1)'], ['Önceki aylar', 'var(--s1)', 'soluk-lej']] : null;
      var satisAlt = ayAd(seri[0].ay, true) + ' – ' + ayAd(seri[seri.length - 1].ay, true);
      kok2.appendChild(katla(st, 'satis', G.kart({ baslik: 'Aylık net satış', alt: satisAlt, govde: h('div', null, [satis, seciliLej ? G.lejant(seciliLej) : null]) }), 'Aylık net satış', satisAlt));
      var eksikVar = seri.some(eksikAy);
      kok2.appendChild(G.kart({ baslik: 'Aylık FAVÖK', alt: 'Amortisman öncesi faaliyet kârı', govde: h('div', null, [favok, G.lejant(eksikVar ? [['Maliyeti kapanmış ay', 'var(--s2)'], ['Maliyeti tamamlanmamış ay', 'var(--turuncu)']] : [['FAVÖK', 'var(--s2)']])]) }));
      var marjKart = G.kart({ baslik: 'Marj eğilimi', alt: 'Brüt marj ve FAVÖK marjı, % olarak', govde: h('div', null, [marj, G.lejant([['Brüt marj', 'var(--s1)'], ['FAVÖK marjı', 'var(--s2)']])]) });
      marjKart.classList.add('ml-tam');
      var marjOge = katla(st, 'marj', marjKart, 'Marj eğilimi', 'Brüt marj ve FAVÖK marjı, % olarak');
      if (marjOge !== marjKart) marjOge.classList.add('ml-tam');   
      kok2.appendChild(marjOge);
      return kok2;
    }
    function bilancoKart(d) {
      var b = d.p.bilanco, o = d.p.oranlar, f = [];
      if (b && b.toplam_varlik > 0) {
        var T = b.toplam_varlik, pay = function (v) { return pct(v / T * 100); };
        var yat = function (liste, renk) { return G.yatay(liste.map(function (x) { return { e: x[0], d: Math.max(x[1] || 0, 0), renk: renk, etiketDeger: para(x[1]) + ' · ' + pay(x[1] || 0), alt: x[2] || undefined }; }), { maks: T }); };
        var bAlt = ayAd(b.ay, true) + ' sonu · toplam varlık ' + para(T);
        f.push(katla(st, 'bilanco', G.kart({ baslik: 'Bilanço özeti', alt: bAlt, govde: h('div', { sinif: 's41-ikili' }, [
          h('div', null, [h('h4', { sinif: 'ml-alt-baslik', metin: 'Varlıklar' }), yat([['Nakit ve benzeri', b.nakit_ve_benzeri], ['Ticari alacaklar', b.ticari_alacak], ['Stoklar', b.stok, 'değerleme farkı düşülmüş'], ['Diğer dönen varlıklar', b.diger_donen_varlik], ['Duran varlıklar', b.duran_varlik]], 'var(--s1)')]),
          h('div', null, [h('h4', { sinif: 'ml-alt-baslik', metin: 'Kaynaklar' }), yat([['Kısa vadeli borçlar', b.kv_yabanci_kaynak], ['Uzun vadeli borçlar', b.uv_yabanci_kaynak], ['Özkaynak', b.ozkaynak]], 'var(--s2)')])]) }), 'Bilanço özeti', bAlt));
      }
      if (o) {
        var g = function (ad, v, b2) { return h('div', { sinif: 'ml-oran' }, [h('small', { metin: ad }), h('b', { metin: v == null ? '—' : G.say(v, b2 == null ? 2 : b2) + (b2 === 0 ? ' ' + (EN ? 'days' : 'gün') : '') })]); };
        var gun = function (v) { return v == null ? null : Math.round(v); };
        var oAlt = b ? ayAd(b.ay, true) + ' sonu itibarıyla' : null;
        f.push(katla(st, 'oranlar', G.kart({ baslik: 'Finansal oranlar', alt: oAlt, govde: h('div', { sinif: 'ml-oranlar' }, [
          g('Cari oran', o.cari_oran), g('Likidite oranı', o.likidite_orani), g('Nakit oranı', o.nakit_orani), g('Borç / özkaynak', o.borc_ozkaynak),
          g('Alacak tahsil süresi', gun(o.alacak_gun_dso), 0), g('Stokta kalma süresi', gun(o.stok_gun_dio), 0), g('Borç ödeme süresi', gun(o.borc_gun_dpo), 0), g('Nakit döngüsü', gun(o.nakit_dongusu_gun), 0)]) }), 'Finansal oranlar', oAlt));
      }
      return f;
    }
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Mali tablolar alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri, sirketler = Object.keys(v.sirketler || {});
      if (!sirketler.length) { govde.appendChild(G.bos({ baslik: 'Mali tablo verisi yok', metin: 'Henüz mali tablo hazırlanmadı.' })); return; }
      if (sirketler.indexOf(st.sirket) < 0) st.sirket = sirketler[0];
      var s = v.sirketler[st.sirket], dl = donemListesi(s);
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      var dk = MM.yasDk(v.asof);
      if (dk == null || dk > ESKI_DK) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '. Değerler güncel olmayabilir.']));
      if (sirketler.length > 1) ust.appendChild(G.cipler(sirketler.map(function (k) { return [k, k]; }), st.sirket, function (k) { st.sirket = k; st.donem = null; ciz(); }, 'Şirket'));
      if (!dl.length) { govde.appendChild(G.bos({ baslik: st.sirket + ' için dönem yok', metin: 'Bu şirketin mali tablosu henüz hazır değil.' })); return; }
      if (!st.donem || !dl.some(function (x) { return x.id === st.donem; })) st.donem = dl[0].id;
      var d = dl.filter(function (x) { return x.id === st.donem; })[0], p = d.p, r = p.rakamlar, onc = oncekiRakam(d);
      ust.appendChild(G.cipler(dl.map(function (x) { return [x.id, x.ad]; }), st.donem, function (k) { st.donem = k; ciz(); }, 'Dönem'));
      var baslik = d.yil ? (p.tam_yil ? p.baslangic.slice(0, 4) + ' yılı' : ayAd(p.baslangic, true).replace(/\s\d{4}$/, '') + ' – ' + ayAd(p.bitis, true) + ' (' + d.p.baslangic.slice(0, 4) + ')') : ayAd(p.bitis, true) + ' sonuna kadar son ' + d.n + ' ay';
      ust.appendChild(h('div', { sinif: 'ml-baslik' }, [h('h3', { metin: d.yil ? (p.tam_yil ? p.baslangic.slice(0, 4) + ' yılı' : p.baslangic.slice(0, 4) + ' yılı, ' + ayAd(p.bitis, true) + ' sonuna kadar') : baslik }),
        h('span', { sinif: 'soluk kucuk', metin: ayAd(p.baslangic, true) + ' – ' + ayAd(p.bitis, true) + (onc ? ' · ' + (d.yil ? 'geçen yılın aynı dönemiyle' : 'önceki ' + d.n + ' ayla') + ' karşılaştırıldı' : '') })]));
      var eksik = (p.maliyet_eksik_aylar || []);
      if (eksik.length) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Maliyeti tamamlanmamış ay: ' }), eksik.map(function (a) { return ayAd(a, true); }).join(', ') + '. Bu aylarda brüt kâr ve marjlar gerçekte olandan yüksek görünür.']));
      if (st.sirket === 'DAY') ust.appendChild(h('div', { sinif: 'bant gri', role: 'status', metin: 'DAY kayıtları Eylül 2026\'da başladı; ilk ay devir girişlerini içerir. MY ile toplanmaz.' }));
      var et = d.yil ? 'geçen yılın aynı dönemine göre' : 'önceki döneme göre';
      govde.appendChild(h('div', { sinif: 'ml-kpi-izgara' }, [
        kart('Net satış', para(r.net_satis), null, r.net_satis, onc && onc.net_satis, et),
        kart('Brüt kâr', para(r.brut_kar), 'Marj ' + pct(r.brut_marj), r.brut_kar, onc && onc.brut_kar, et),
        kart('FAVÖK', para(r.favok), 'Marj ' + pct(r.favok_marj), r.favok, onc && onc.favok, et),
        kart('Dönem kârı (vergi öncesi)', para(r.vergi_oncesi_kar), 'Marj ' + pct(r.net_marj), r.vergi_oncesi_kar, onc && onc.vergi_oncesi_kar, et)]));
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Gelir tablosu', alt: ayAd(p.baslangic, true) + ' – ' + ayAd(p.bitis, true), govde: gelirTablosu(d, onc) })]));
      var gr = grafikler(s, d); if (gr) govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr]));
      if (st.sirket === 'MY' && an) {   
        [function () { return sapmaKarti(an); }, function () { return kopruKarti(an, st, ciz); }, function () { return nakitKarti(an, st); }].forEach(function (yap) {
          var k = null; try { k = yap(); } catch (e) { k = null; }
          if (k) govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [k]));
        });
      }
      bilancoKart(d).forEach(function (k) { govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [k])); });
    }
    function yenile() {
      hata = null; yuk = null; an = null; ciz();
      window.MMVeri.oku('muhasebe', 'mali_tablo').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); });
      analizOku().then(function (a) { an = a; if (canli && yuk) ciz(); });
    }
    yenile();
    return function () { canli = false; };
  };
})();
