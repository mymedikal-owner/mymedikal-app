



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

  MM.maliTab = function (kok) {
    var yuk = null, hata = null, canli = true, st = { sirket: 'MY', donem: null };
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
        return h('tr', { sinif: s[2] }, [h('td', { metin: s[0] }),
          h('td', null, [h('span', { metin: yaz(cur) }), s[3] && r[s[3]] != null ? h('small', { metin: 'Marj ' + pct(r[s[3]]) }) : null]),
          h('td', { sinif: 'on', metin: onc ? yaz(pre) : '—' }), h('td', null, [deg || h('span', { sinif: 'soluk', metin: '—' })])]);
      }).filter(Boolean);
      var t = h('table', { sinif: 'ml-tablo' }, [h('thead', null, [h('tr', null, [h('th', { scope: 'col', metin: 'Kalem' }), h('th', { scope: 'col', metin: 'Bu dönem' }), h('th', { scope: 'col', sinif: 'on', metin: 'Önceki dönem' }), h('th', { scope: 'col', metin: 'Değişim' })])]), h('tbody', null, sat)]);
      return h('div', { sinif: 'tablo-kaydir' }, [t]);
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
      kok2.appendChild(G.kart({ baslik: 'Aylık net satış', alt: ayAd(seri[0].ay, true) + ' – ' + ayAd(seri[seri.length - 1].ay, true), govde: h('div', null, [satis, seciliLej ? G.lejant(seciliLej) : null]) }));
      var eksikVar = seri.some(eksikAy);
      kok2.appendChild(G.kart({ baslik: 'Aylık FAVÖK', alt: 'Amortisman öncesi faaliyet kârı', govde: h('div', null, [favok, G.lejant(eksikVar ? [['Maliyeti kapanmış ay', 'var(--s2)'], ['Maliyeti tamamlanmamış ay', 'var(--turuncu)']] : [['FAVÖK', 'var(--s2)']])]) }));
      var marjKart = G.kart({ baslik: 'Marj eğilimi', alt: 'Brüt marj ve FAVÖK marjı, % olarak', govde: h('div', null, [marj, G.lejant([['Brüt marj', 'var(--s1)'], ['FAVÖK marjı', 'var(--s2)']])]) });
      marjKart.classList.add('ml-tam');
      kok2.appendChild(marjKart);
      return kok2;
    }
    function bilancoKart(d) {
      var b = d.p.bilanco, o = d.p.oranlar, f = [];
      if (b && b.toplam_varlik > 0) {
        var T = b.toplam_varlik, pay = function (v) { return pct(v / T * 100); };
        var yat = function (liste, renk) { return G.yatay(liste.map(function (x) { return { e: x[0], d: Math.max(x[1] || 0, 0), renk: renk, etiketDeger: para(x[1]) + ' · ' + pay(x[1] || 0), alt: x[2] || undefined }; }), { maks: T }); };
        f.push(G.kart({ baslik: 'Bilanço özeti', alt: ayAd(b.ay, true) + ' sonu · toplam varlık ' + para(T), govde: h('div', { sinif: 's41-ikili' }, [
          h('div', null, [h('h4', { sinif: 'ml-alt-baslik', metin: 'Varlıklar' }), yat([['Nakit ve benzeri', b.nakit_ve_benzeri], ['Ticari alacaklar', b.ticari_alacak], ['Stoklar', b.stok, 'değerleme farkı düşülmüş'], ['Diğer dönen varlıklar', b.diger_donen_varlik], ['Duran varlıklar', b.duran_varlik]], 'var(--s1)')]),
          h('div', null, [h('h4', { sinif: 'ml-alt-baslik', metin: 'Kaynaklar' }), yat([['Kısa vadeli borçlar', b.kv_yabanci_kaynak], ['Uzun vadeli borçlar', b.uv_yabanci_kaynak], ['Özkaynak', b.ozkaynak]], 'var(--s2)')])]) }));
      }
      if (o) {
        var g = function (ad, v, b2) { return h('div', { sinif: 'ml-oran' }, [h('small', { metin: ad }), h('b', { metin: v == null ? '—' : G.say(v, b2 == null ? 2 : b2) + (b2 === 0 ? ' ' + (EN ? 'days' : 'gün') : '') })]); };
        var gun = function (v) { return v == null ? null : Math.round(v); };
        f.push(G.kart({ baslik: 'Finansal oranlar', alt: b ? ayAd(b.ay, true) + ' sonu itibarıyla' : null, govde: h('div', { sinif: 'ml-oranlar' }, [
          g('Cari oran', o.cari_oran), g('Likidite oranı', o.likidite_orani), g('Nakit oranı', o.nakit_orani), g('Borç / özkaynak', o.borc_ozkaynak),
          g('Alacak tahsil süresi', gun(o.alacak_gun_dso), 0), g('Stokta kalma süresi', gun(o.stok_gun_dio), 0), g('Borç ödeme süresi', gun(o.borc_gun_dpo), 0), g('Nakit döngüsü', gun(o.nakit_dongusu_gun), 0)]) }));
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
      bilancoKart(d).forEach(function (k) { govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [k])); });
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('muhasebe', 'mali_tablo').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  };
})();
