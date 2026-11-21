



(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function h(et, oz, ch) {
    var e = document.createElement(et);
    if (oz) for (var k in oz) { var v = oz[k]; if (v == null || v === false) continue;
      if (k === 'sinif') e.className = v; else if (k === 'metin') e.textContent = v;
      else if (k.indexOf('on') === 0) { if (typeof v === 'function') e.addEventListener(k.slice(2), v); }   
      else if ((k === 'href' || k === 'src' || k === 'xlink:href') && /^\s*(javascript|data|vbscript):/i.test(String(v))) continue;   
      else e.setAttribute(k, v === true ? '' : v); }
    (ch || []).forEach(function (c) { if (c == null || c === false) return; e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); });
    return e;
  }
  function s(et, oz, ch) {
    var e = document.createElementNS(NS, et);
    for (var k in (oz || {})) if (oz[k] != null) e.setAttribute(k, oz[k]);
    (ch || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  var nf = new Intl.NumberFormat(window.MM_LOC || 'tr-TR');
  function say(n, o) { if (n == null || isNaN(n)) return '—'; return o ? new Intl.NumberFormat(window.MM_LOC || 'tr-TR', { maximumFractionDigits: o }).format(n) : nf.format(Math.round(n)); }
  function kisa(n) { if (n == null || isNaN(n)) return '—'; var a = Math.abs(n); if (a >= 1e6) return say(n / 1e6, 1) + ' mn'; if (a >= 1e4) return say(n / 1e3, 0) + ' b'; if (a >= 1e3) return say(n / 1e3, 1) + ' b'; return say(n); }

   
  var IK = {
    ana: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z', makineler: 'M3 20V9l6 4V9l6 4V5h3v15zM6 17h2M11 17h2M16 17h2',
    eldiven: 'M8 21c-2-2-3-4-3-7V7a1.5 1.5 0 013 0v4V4a1.5 1.5 0 013 0v7V3.5a1.5 1.5 0 013 0V11V6a1.5 1.5 0 013 0v9c0 3-2 6-5 6z',
    stok: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8', ik: 'M16 11a3 3 0 100-6 3 3 0 000 6zM8 12a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5',
    onay: 'M5 12l4.5 4.5L19 7', asistan: 'M4 5h16v11H9l-5 4zM8 10h8', siparis: 'M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10',
    finans: 'M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6', muhasebe: 'M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2zM5 18a2 2 0 012-2h12M9 8h6M9 12h6', kalite: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4',
    isg: 'M12 3l9 16H3zM12 10v4M12 17h.01', yonetim: 'M4 20V10M10 20V4M16 20v-8M22 20H2', diger: 'M5 12h.01M12 12h.01M19 12h.01',
    arama: 'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5', zil: 'M6 16V11a6 6 0 1112 0v5l2 2H4zM10 21h4', uyari: 'M12 3l9 16H3zM12 10v4M12 17h.01',
    yukari: 'M12 19V5M6 11l6-6 6 6', asagi: 'M12 5v14M6 13l6 6 6-6', esit: 'M5 9h14M5 15h14', sag: 'M9 5l7 7-7 7', sol: 'M15 5l-7 7 7 7',
    gemi: 'M3 17l2 3h14l2-3-9-3zM12 14V4l6 5h-6M6 11h4', kutu: 'M3 8l9-5 9 5v8l-9 5-9-5zM12 13v8M3 8l9 5 9-5', belge: 'M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6',
    takvim: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', tik: 'M5 12l4.5 4.5L19 7', kapat: 'M6 6l12 12M18 6L6 18', saat: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
    kilit: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3', barkod: 'M4 6v12M7 6v12M11 6v12M14 6v12M18 6v12M20 6v12', kullanici: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6',
    bilgi: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5h.01', gonder: 'M4 12l16-8-6 16-3-7z', kamera: 'M4 8h4l2-3h4l2 3h4v11H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
    filtre: 'M4 5h16l-6 8v6l-4-2v-4z', indir: 'M12 4v11M7 11l5 5 5-5M5 20h14', ay: 'M20 14A8 8 0 019.5 4 8 8 0 1020 14z', gun: 'M12 16a4 4 0 100-8 4 4 0 000 8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
    liste: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01', harita: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14', cubuk: 'M5 20V10M12 20V4M19 20v-7', para: 'M12 21a9 9 0 100-18 9 9 0 000 18zM14.5 9c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5 1-2.5 2 0 3 5 1.5 5 4.5 0 1-1 2-2.5 2-1 0-2-.5-2.5-1.5M12 6v1.5M12 16.5V18',
    gelen: 'M4 4h16v12H4zM8 20h8M12 16v4'
  };
  function ikon(ad, boy) {
    return s('svg', { viewBox: '0 0 24 24', width: boy || 20, height: boy || 20, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false' }, [s('path', { d: IK[ad] || IK.bilgi })]);
  }

   
  var ipucuEl = null, ipucuSahip = null;
  function ipucuKur() {
    if (ipucuEl) return;
    ipucuEl = h('div', { sinif: 'ipucu', role: 'tooltip', hidden: true }); document.body.appendChild(ipucuEl);
    document.addEventListener('pointerdown', function (e) { if (ipucuSahip && !ipucuSahip.contains(e.target) && !ipucuEl.contains(e.target)) ipucuKapat(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') ipucuKapat(); });
    window.addEventListener('scroll', ipucuKapat, true); window.addEventListener('resize', ipucuKapat);
  }
  function ipucuAc(el, metin, x, y) {
    ipucuKur(); ipucuSahip = el; ipucuEl.textContent = ''; ipucuEl.hidden = false;
    (Array.isArray(metin) ? metin : [metin]).forEach(function (m, i) { ipucuEl.appendChild(h('div', { sinif: i === 0 ? 'ip-ust' : 'ip-alt', metin: m })); });
    var r = el.getBoundingClientRect(), w = ipucuEl.offsetWidth, hh = ipucuEl.offsetHeight;
    var cx = x != null ? x : r.left + r.width / 2, ay = y != null ? y : r.top;
    var sol = Math.max(8, Math.min(window.innerWidth - w - 8, cx - w / 2)), ust = ay - hh - 10; if (ust < 8) ust = (y != null ? y : r.bottom) + 12;
    ipucuEl.style.left = sol + 'px'; ipucuEl.style.top = ust + 'px';
  }
  function ipucuKapat() { if (ipucuEl) ipucuEl.hidden = true; ipucuSahip = null; }
   
  function ipucu(el, metin) {
    if (!metin) return el;
    el.setAttribute('tabindex', '0'); el.setAttribute('role', 'img');
    var ad = (Array.isArray(metin) ? metin.join(' — ') : metin); if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', ad);
    el.classList.add('ipucu-hedef');
    el.addEventListener('click', function (e) { if (ipucuSahip === el && !ipucuEl.hidden) ipucuKapat(); else ipucuAc(el, metin, e.clientX || null, e.clientY || null); });
    el.addEventListener('focus', function () { ipucuAc(el, metin); }); el.addEventListener('blur', ipucuKapat);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ipucuAc(el, metin); } });
    return el;
  }

   
   
  function spark(vals, o) {
    o = o || {}; var W = o.genislik || 96, H = o.yukseklik || 30, p = 3;
    var nz = vals.filter(function (v) { return v != null; });
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'spark', role: 'img', 'aria-label': o.ad || ('Eğilim: ' + nz.length + ' nokta') , preserveAspectRatio: 'none' });
    if (nz.length < 2) { svg.appendChild(s('line', { x1: p, x2: W - p, y1: H / 2, y2: H / 2, class: 'spark-bos' })); return svg; }
    var mn = Math.min.apply(null, nz), mx = Math.max.apply(null, nz); if (mx === mn) { mx += 1; mn -= 1; }
    var n = vals.length, xy = vals.map(function (v, i) { return v == null ? null : [p + (W - 2 * p) * i / (n - 1), p + (H - 2 * p) * (1 - (v - mn) / (mx - mn))]; });
    var d = '', alan = '', ilk = null, son = null;
    xy.forEach(function (q, i) { if (!q) { ilk = null; return; } d += (ilk ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); if (!ilk) alan = alan; ilk = q; son = q; });
    var ilkNok = xy.filter(Boolean)[0], sonNok = son;
    svg.appendChild(s('path', { d: d + 'L' + sonNok[0].toFixed(1) + ' ' + (H - p) + 'L' + ilkNok[0].toFixed(1) + ' ' + (H - p) + 'Z', class: 'spark-alan', style: o.renk ? 'fill:' + o.renk : null }));
    svg.appendChild(s('path', { d: d, class: 'spark-cizgi', style: o.renk ? 'stroke:' + o.renk : null }));
    if (o.tahmin) xy.forEach(function (q, i) { if (q && o.tahmin[i]) svg.appendChild(s('circle', { cx: q[0], cy: q[1], r: 2.2, class: 'spark-tahmin' })); });
    svg.appendChild(s('circle', { cx: sonNok[0], cy: sonNok[1], r: 3, class: 'spark-son', style: o.renk ? 'fill:' + o.renk : null }));
    return svg;
  }

   
   
  function delta(simdi, onceki, o) {
    o = o || {};
    if (simdi == null || onceki == null || !isFinite(simdi) || !isFinite(onceki)) return h('span', { sinif: 'delta yok', metin: (o.etiket ? o.etiket + ': ' : '') + 'karşılaştırma yok' });
    var fark = simdi - onceki, yuzde = onceki ? fark / Math.abs(onceki) * 100 : null;
    var yon = Math.abs(yuzde == null ? fark : yuzde) < 0.5 ? 'esit' : (fark > 0 ? 'yukari' : 'asagi');
    var renk = yon === 'esit' || !o.iyi ? 'nötr' : ((yon === o.iyi) ? 'iyi' : 'kotu');
    var yaz = o.mutlak || yuzde == null ? (fark > 0 ? '+' : '') + say(fark, 1) : (fark > 0 ? '+' : (fark < 0 ? '−' : '')) + say(Math.abs(yuzde), 1) + '%';
    return h('span', { sinif: 'delta ' + renk, title: (o.etiket || '') + ' ' + say(onceki, 1) + ' → ' + say(simdi, 1) }, [ikon(yon, 14), h('b', { metin: yaz }), h('span', { sinif: 'delta-et', metin: o.etiket || '' })]);
  }

   
   
  function kpi(o) {
     
    var link = !!(o.href || o.tikla), et = o.href ? 'a' : (o.tikla ? 'button' : 'div');
    var k = h('div', { sinif: 'kpi' + (o.durum ? ' d-' + o.durum : '') + (link ? ' tikla' : '') });
    var tz = o.yas !== undefined ? h('span', { sinif: 'kpi-taze' + (o.eski ? ' eski' : ''), title: o.eski ? 'Veri eski' : 'Güncel' }, [h('i', { 'aria-hidden': 'true' }), o.yas == null ? 'yaş yok' : MM.yasMetin(o.yas)]) : null;
    var bilgi = [];
    if (o.eski) bilgi.push(h('p', { sinif: 'kpi-eski', metin: 'Veri eski' + (o.yas != null ? ': son güncelleme ' + MM.yasMetin(o.yas) : '') + '. Değerler güncel olmayabilir.' }));
    if (o.deltalar && o.deltalar.length) bilgi.push(h('div', { sinif: 'kpi-delta' }, o.deltalar));
    if (o.neden) bilgi.push(h('p', { sinif: 'kpi-neden', metin: o.neden }));
    if (o.alt) bilgi.push(h('p', { sinif: 'kpi-alt', metin: o.alt }));
    if (o.sparkAd) bilgi.push(h('p', { sinif: 'kpi-alt', metin: 'Eğilim: ' + o.sparkAd }));
    var govde = h(et, { sinif: 'kpi-ana', href: o.href || null, type: et === 'button' ? 'button' : null, onclick: o.tikla || null, 'aria-label': link ? o.baslik + ': ' + o.deger + (o.birim ? ' ' + o.birim : '') + ' — ayrıntıya git' : null });
    govde.appendChild(h('div', { sinif: 'kpi-ust' }, [o.ikon ? h('span', { sinif: 'kpi-ikon' }, [ikon(o.ikon, 18)]) : null, h('span', { sinif: 'kpi-baslik', metin: o.baslik }), o.etiket ? h('span', { sinif: 'etiket ' + (o.etiket.tur || ''), metin: o.etiket.metin }) : null]));
    govde.appendChild(h('div', { sinif: 'kpi-orta' }, [h('div', { sinif: 'kpi-deger' }, [h('span', { sinif: 'kpi-sayi', metin: o.deger }), o.birim ? h('small', { metin: o.birim }) : null]), o.spark ? h('div', { sinif: 'kpi-spark' }, [spark(o.spark, { renk: o.sparkRenk, ad: o.sparkAd, tahmin: o.sparkTahmin })]) : null]));
    if (tz) govde.appendChild(tz);
    k.appendChild(govde);
    if (bilgi.length) {
      var kutu = h('div', { sinif: 'kpi-bilgi', hidden: true }, bilgi), dugme = h('button', { type: 'button', sinif: 'kpi-i', 'aria-label': o.baslik + ' hakkında ayrıntı', 'aria-expanded': 'false' }, [ikon('bilgi', 18)]);
      dugme.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); var ac = kutu.hidden; kutu.hidden = !ac; dugme.setAttribute('aria-expanded', String(ac)); k.classList.toggle('bilgi-acik', ac); });
      k.appendChild(dugme); k.appendChild(kutu);
    }
    return k;
  }

   
   
  function kart(o) {
    var k = h('section', { sinif: 'kart2' + (o.sinif ? ' ' + o.sinif : '') });
    var ust = h('header', { sinif: 'kart2-ust' }, [h('div', null, [h('h3', { metin: o.baslik }), o.alt ? h('p', { sinif: 'kart2-alt', metin: o.alt }) : null])]);
    var govde = h('div', { sinif: 'kart2-govde' }, [o.govde]), tabloGorunum = false;
    var sag = h('div', { sinif: 'kart2-eylem' }); if (o.eylem) sag.appendChild(o.eylem);
    if (o.tablo) {
      var d = h('button', { type: 'button', sinif: 'mini-dugme', 'aria-pressed': 'false', title: 'Grafik / tablo görünümü', onclick: function () {
        tabloGorunum = !tabloGorunum; d.setAttribute('aria-pressed', String(tabloGorunum)); d.textContent = ''; d.appendChild(ikon(tabloGorunum ? 'cubuk' : 'liste', 16)); d.appendChild(document.createTextNode(tabloGorunum ? ' Grafik' : ' Tablo'));
        govde.textContent = ''; govde.appendChild(tabloGorunum ? duzTablo(o.tablo.kolonlar, o.tablo.satirlar) : o.govde); } }, [ikon('liste', 16), ' Tablo']);
      sag.appendChild(d);
    }
    if (sag.childNodes.length) ust.appendChild(sag);
    k.appendChild(ust); k.appendChild(govde);
    if (o.dip) k.appendChild(h('footer', { sinif: 'kart2-dip', metin: o.dip }));
    return k;
  }
  function duzTablo(kolonlar, satirlar) {
    var t = h('table', { sinif: 'tablo' }, [h('thead', null, [h('tr', null, kolonlar.map(function (c) { return h('th', { scope: 'col', metin: c }); }))]),
      h('tbody', null, satirlar.map(function (r) { return h('tr', null, r.map(function (c) { return h('td', { metin: c == null ? '—' : String(c) }); })); }))]);
    return h('div', { sinif: 'tablo-kaydir' }, [t]);
  }

   
   
  function cubuk(ogeler, o) {
    o = o || {}; var W = 640, H = o.yukseklik || 200, sol = 40, alt = 24, ust = 12, n = ogeler.length;
    var vals = ogeler.map(function (x) { return x.d || 0; }); var hedef = o.hedef && o.hedef.d;
    var mx = Math.max.apply(null, vals.concat([hedef || 0, 1])) * 1.08, yy = H - alt - ust, gen = (W - sol - 8) / Math.max(n, 1), cg = Math.max(4, Math.min(gen - 2, gen * 0.78, 56));
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'grafik', role: 'group', 'aria-label': o.ad || 'Çubuk grafik' });
    [0, .5, 1].forEach(function (pp) { var y = ust + yy * (1 - pp); svg.appendChild(s('line', { x1: sol, x2: W - 4, y1: y, y2: y, class: pp ? 'g-izgara' : 'g-eksen' })); svg.appendChild(s('text', { x: sol - 6, y: y + 4, 'text-anchor': 'end', class: 'g-yazi' }, [kisa(mx * pp / 1.08)])); });
    var adim = n > 24 ? Math.ceil(n / 8) : (n > 12 ? 3 : (n > 7 ? 2 : 1));
    ogeler.forEach(function (x, i) {
      var cx = sol + gen * i + (gen - cg) / 2, hh = x.d == null ? 0 : yy * x.d / mx;
      var g = s('g', { class: 'g-cubuk' + (x.tahmin ? ' tahmin' : '') + (o.sec && o.sec(i) ? ' secili' : '') });
      if (x.d == null) { g.appendChild(s('line', { x1: cx, x2: cx + cg, y1: ust + yy - 1, y2: ust + yy - 1, class: 'g-bos' })); }
      else g.appendChild(s('rect', { x: cx, y: ust + yy - hh, width: cg, height: Math.max(hh, 1), rx: Math.min(4, cg / 2), style: 'fill:' + (x.tahmin ? 'url(#tx-tahmin)' : (x.renk || o.renk || 'var(--s1)')), class: x.tahmin ? 'tahmin-dolgu' : null }));
      var hit = s('rect', { x: sol + gen * i, y: ust, width: gen, height: yy + alt, fill: 'transparent', class: 'g-hit' }); g.appendChild(hit);
      ipucu(g, x.ipucu || [x.e + ': ' + (x.d == null ? 'veri yok' : say(x.d)), x.tahmin ? 'tahmin (ölçüm değil)' : '']);
      if (o.tikla) g.addEventListener('click', function () { o.tikla(i, x); });
      svg.appendChild(g);
      if (i % adim === 0 || i === n - 1) svg.appendChild(s('text', { x: cx + cg / 2, y: H - 7, 'text-anchor': 'middle', class: 'g-yazi' }, [x.e]));
    });
    if (hedef) { var yh = ust + yy * (1 - hedef / mx); svg.appendChild(s('line', { x1: sol, x2: W - 4, y1: yh, y2: yh, class: 'g-hedef' })); svg.appendChild(s('text', { x: W - 6, y: yh - 5, 'text-anchor': 'end', class: 'g-yazi g-hedef-yazi' }, [(o.hedef.ad || 'hedef') + ' ' + kisa(hedef)])); }
    var defs = s('defs', null, [s('pattern', { id: 'tx-tahmin', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, [s('rect', { width: 6, height: 6, fill: 'var(--tahmin-zemin)' }), s('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: 'var(--tahmin)', 'stroke-width': 3 })])]);
    svg.insertBefore(defs, svg.firstChild);
    return svg;
  }

   
   
  function cizgi(seriler, etiketler, o) {
    o = o || {}; var W = 640, H = o.yukseklik || 200, sol = 42, alt = 24, ust = 12, n = etiketler.length, yy = H - alt - ust, xx = W - sol - 10;
    var tum = []; seriler.forEach(function (sr) { sr.d.forEach(function (v) { if (v != null) tum.push(v); }); }); if (o.hedef) tum.push(o.hedef.d);
    var mn = o.sifirdan === false ? Math.min.apply(null, tum) : 0, mx = Math.max.apply(null, tum.concat([1])) * 1.08; if (mx === mn) mx = mn + 1;
    var X = function (i) { return sol + (n < 2 ? xx / 2 : xx * i / (n - 1)); }, Y = function (v) { return ust + yy * (1 - (v - mn) / (mx - mn)); };
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'grafik', role: 'group', 'aria-label': o.ad || 'Çizgi grafik' });
    [0, .5, 1].forEach(function (pp) { var y = ust + yy * (1 - pp); svg.appendChild(s('line', { x1: sol, x2: W - 6, y1: y, y2: y, class: pp ? 'g-izgara' : 'g-eksen' })); svg.appendChild(s('text', { x: sol - 6, y: y + 4, 'text-anchor': 'end', class: 'g-yazi' }, [kisa(mn + (mx - mn) * pp)])); });
    var adim = n > 24 ? Math.ceil(n / 8) : (n > 12 ? 3 : (n > 7 ? 2 : 1));
    etiketler.forEach(function (e, i) { if (i % adim === 0 || i === n - 1) svg.appendChild(s('text', { x: X(i), y: H - 7, 'text-anchor': 'middle', class: 'g-yazi' }, [e])); });
    if (o.hedef) { var yh = Y(o.hedef.d); svg.appendChild(s('line', { x1: sol, x2: W - 6, y1: yh, y2: yh, class: 'g-hedef' })); svg.appendChild(s('text', { x: W - 8, y: yh - 5, 'text-anchor': 'end', class: 'g-yazi g-hedef-yazi' }, [(o.hedef.ad || 'hedef') + ' ' + kisa(o.hedef.d)])); }
    var cap = s('line', { x1: 0, x2: 0, y1: ust, y2: ust + yy, class: 'g-cap', visibility: 'hidden' }); svg.appendChild(cap);
    seriler.forEach(function (sr) {
      var d = '', on = false; sr.d.forEach(function (v, i) { if (v == null) { on = false; return; } d += (on ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); on = true; });
      svg.appendChild(s('path', { d: d, class: 'g-cizgi', style: 'stroke:' + (sr.renk || 'var(--s1)') + (sr.kesik ? ';stroke-dasharray:5 4' : '') }));
      sr.d.forEach(function (v, i) { if (v != null && (n <= 32 || i === n - 1)) svg.appendChild(s('circle', { cx: X(i), cy: Y(v), r: sr.tahmin && sr.tahmin[i] ? 3.4 : 2.8, class: 'g-nokta' + (sr.tahmin && sr.tahmin[i] ? ' tahmin' : ''), style: sr.tahmin && sr.tahmin[i] ? null : 'fill:' + (sr.renk || 'var(--s1)') })); });
    });
    var adimW = n < 2 ? xx : xx / (n - 1);
    etiketler.forEach(function (e, i) {
      var satirlar = [e]; seriler.forEach(function (sr) { satirlar.push((seriler.length > 1 ? sr.ad + ': ' : '') + (sr.d[i] == null ? 'veri yok' : say(sr.d[i], o.ondalik) + (o.birim ? ' ' + o.birim : '')) + (sr.tahmin && sr.tahmin[i] ? ' (tahmin)' : '')); });
      var hit = s('rect', { x: X(i) - adimW / 2, y: ust, width: Math.max(adimW, 12), height: yy + alt, fill: 'transparent', class: 'g-hit' });
      ipucu(hit, satirlar.length > 2 ? [satirlar[1]].concat([satirlar[0]]).concat(satirlar.slice(2)).join(' · ') : [satirlar[1], satirlar[0]]);
      hit.addEventListener('focus', function () { cap.setAttribute('x1', X(i)); cap.setAttribute('x2', X(i)); cap.setAttribute('visibility', 'visible'); });
      hit.addEventListener('blur', function () { cap.setAttribute('visibility', 'hidden'); });
      hit.addEventListener('click', function () { cap.setAttribute('x1', X(i)); cap.setAttribute('x2', X(i)); cap.setAttribute('visibility', 'visible'); });
      svg.appendChild(hit);
    });
    return svg;
  }

   
   
  function yatay(ogeler, o) {
    o = o || {}; var mx = o.maks || Math.max.apply(null, ogeler.map(function (x) { return x.d || 0; }).concat([1]));
    var kap = h('div', { sinif: 'yatay2', role: 'list' });
    ogeler.forEach(function (x) {
      var et = x.tikla ? 'button' : 'div';
      var sat = h(et, { sinif: 'y2-satir' + (x.tikla ? ' tikla' : ''), role: 'listitem', type: et === 'button' ? 'button' : null, onclick: x.tikla || null }, [
        h('span', { sinif: 'y2-ad' }, [x.e, x.alt ? h('small', { metin: x.alt }) : null]),
        h('span', { sinif: 'y2-yol' }, [h('i', { style: 'width:' + Math.max(x.d ? 100 * x.d / mx : 0, x.d ? 1.5 : 0) + '%;background:' + (x.renk || 'var(--s1)') })]),
        h('span', { sinif: 'y2-deger', metin: x.etiketDeger != null ? x.etiketDeger : (x.d == null ? 'veri yok' : say(x.d) + (o.birim ? ' ' + o.birim : '')) })]);
      if (x.ipucu) ipucu(sat, x.ipucu);
      kap.appendChild(sat);
    });
    return kap;
  }

   
  function pareto(ogeler, o) {
    o = o || {}; var top = ogeler.reduce(function (a, x) { return a + (x.d || 0); }, 0); if (!top) return h('p', { sinif: 'veri-yok', metin: 'Duruş/kayıp süresi bildirilmedi.' });
    var cum = 0, W = 640, H = o.yukseklik || 210, sol = 44, alt = 48, ust = 12, yy = H - alt - ust, n = ogeler.length, gen = (W - sol - 10) / n, cg = Math.min(gen * 0.7, 54);
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'grafik', role: 'group', 'aria-label': o.ad || 'Pareto' });
    [0, .5, 1].forEach(function (pp) { var y = ust + yy * (1 - pp); svg.appendChild(s('line', { x1: sol, x2: W - 6, y1: y, y2: y, class: pp ? 'g-izgara' : 'g-eksen' })); svg.appendChild(s('text', { x: sol - 6, y: y + 4, 'text-anchor': 'end', class: 'g-yazi' }, [kisa(top * pp)])); });
    var pts = [];
    ogeler.forEach(function (x, i) {
      cum += x.d || 0; var cx = sol + gen * i + (gen - cg) / 2, hh = yy * (x.d || 0) / top;
      var g = s('g', { class: 'g-cubuk' }); g.appendChild(s('rect', { x: cx, y: ust + yy - hh, width: cg, height: Math.max(hh, 1), rx: Math.min(4, cg / 2), style: 'fill:' + (x.renk || 'var(--s1)') }));
      g.appendChild(s('rect', { x: sol + gen * i, y: ust, width: gen, height: yy + alt, fill: 'transparent', class: 'g-hit' }));
      ipucu(g, [say(x.d) + ' ' + (o.birim || '') + ' · % ' + say(100 * (x.d || 0) / top, 1), x.e + ' · kümülatif % ' + say(100 * cum / top, 0)]); svg.appendChild(g);
      pts.push([cx + cg / 2, ust + yy * (1 - cum / top)]);
      var kisaAd = x.e.length > 16 ? x.e.slice(0, 15) + '…' : x.e, t = s('text', { x: cx + cg / 2, y: H - alt + 14, 'text-anchor': 'end', class: 'g-yazi', transform: 'rotate(-30 ' + (cx + cg / 2) + ' ' + (H - alt + 14) + ')' }, [kisaAd]); svg.appendChild(t);
    });
    svg.appendChild(s('path', { d: pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(''), class: 'g-cizgi', style: 'stroke:var(--s2)' }));
    pts.forEach(function (p) { svg.appendChild(s('circle', { cx: p[0], cy: p[1], r: 3, class: 'g-nokta', style: 'fill:var(--s2)' })); });
    return svg;
  }

   
  function lejant(ogeler) { return h('div', { sinif: 'lejant2', role: 'list' }, ogeler.map(function (o) { return h('span', { role: 'listitem' }, [h('i', { sinif: o[2] || '', style: 'background:' + o[1] }), o[0]]); })); }

   
  function iskelet(tur, n) {
    var k = h('div', { sinif: 'iskelet-kap tur-' + (tur || 'kart'), 'aria-hidden': 'true' });
    for (var i = 0; i < (n || 3); i++) k.appendChild(h('div', { sinif: 'iskelet' }, [h('i'), h('i'), h('i')]));
    var sr = h('p', { sinif: 'sr-only', role: 'status', metin: 'Yükleniyor…' }); var kap = h('div'); kap.appendChild(k); kap.appendChild(sr); return kap;
  }
   
  function bos(o) {
    var d = h('div', { sinif: 'bos-durum ' + (o.tur || 'veri'), role: o.tur === 'hata' ? 'alert' : 'status' }, [
      h('div', { sinif: 'bos-ikon' }, [ikon(o.tur === 'hata' ? 'uyari' : (o.tur === 'bekle' ? 'saat' : 'bilgi'), 28)]),
      h('h3', { metin: o.baslik }), o.metin ? h('p', { metin: o.metin }) : null]);
    if (o.eylem) d.appendChild(h('button', { type: 'button', sinif: 'dugme', onclick: o.eylem.fn, metin: o.eylem.ad }));
    return d;
  }

   
   
  function tablo(o) {
    var sira = o.sira || null, kap = h('div', { sinif: 'tablo-kaydir', 'data-arakap': '1' }), gor = o.sayfa || 20, aq = '', aSay = 0, aNorm = (window.MM && MM.aramaNorm) || function (x) { return String(x).toLowerCase(); };
     
    function satirUyar(r) {
      var t = o.kolonlar.map(function (c) { var v; try { v = c.ciz ? c.ciz(r) : r[c.k]; } catch (e) { v = r[c.k]; } return v == null ? '' : (typeof v === 'object' ? (v.textContent || '') : String(v)); }).join(' ');
      return aNorm(t).indexOf(aq) >= 0;
    }
    kap.ara = function (q) { q = q || ''; if (q === aq) return [aq ? aSay : o.satirlar.length, o.satirlar.length]; aq = q; gor = o.sayfa || 20; ciz(); return [aq ? aSay : o.satirlar.length, o.satirlar.length]; };    
    function ciz() {
      kap.textContent = '';
      var s_ = o.satirlar.slice();
      if (aq) { s_ = s_.filter(satirUyar); aSay = s_.length; }
      if (sira) { var kol = o.kolonlar.filter(function (c) { return c.k === sira.k; })[0]; var gv = kol && (kol.deger || function (r) { return r[kol.k]; });
        if (kol) s_.sort(function (a, b) { var x = gv(a), y = gv(b); if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1; var c = (typeof x === 'number' && typeof y === 'number') ? x - y : String(x).localeCompare(String(y), 'tr'); return sira.yon === 'asagi' ? -c : c; }); }
      var tr = h('tr');
      o.kolonlar.forEach(function (c) {
        var on = sira && sira.k === c.k;
        tr.appendChild(h('th', { scope: 'col', sinif: (c.sag ? 'sag ' : '') + (on ? 'sirali' : ''), 'aria-sort': on ? (sira.yon === 'asagi' ? 'descending' : 'ascending') : 'none' }, [
          h('button', { type: 'button', sinif: 'th-dugme', onclick: function () { sira = { k: c.k, yon: on && sira.yon === 'yukari' ? 'asagi' : 'yukari' }; ciz(); } }, [c.ad, on ? h('span', { sinif: 'th-ok', 'aria-hidden': 'true', metin: sira.yon === 'asagi' ? ' ▼' : ' ▲' }) : null])]));
      });
      var tb = h('tbody');
      var toplam = s_.length; s_ = s_.slice(0, gor);
      s_.forEach(function (r) {
        var t = h('tr', { sinif: (o.satirSinif ? o.satirSinif(r) : '') + (o.satirTikla ? ' tikla' : ' acilir') + (o.kolonlar.length <= 3 ? ' kisa' : ''), tabindex: '0', onclick: o.satirTikla ? function () { o.satirTikla(r); } : function (e) { if (matchMedia('(max-width: 599px)').matches && !e.target.closest('a,button')) t.classList.toggle('acik'); },
          onkeydown: function (e) { if (e.key === 'Enter') { if (o.satirTikla) o.satirTikla(r); else t.classList.toggle('acik'); } } });
        o.kolonlar.forEach(function (c) { var v = c.ciz ? c.ciz(r) : r[c.k]; t.appendChild(h('td', { sinif: c.sag ? 'sag' : '', 'data-et': c.ad }, [v == null ? '—' : (typeof v === 'object' ? v : String(v))])); });
        tb.appendChild(t);
      });
      if (!s_.length) tb.appendChild(h('tr', null, [h('td', { colspan: o.kolonlar.length, sinif: 'veri-yok', metin: o.bos || 'Kayıt yok.' })]));
      kap.appendChild(h('table', { sinif: 'tablo tablo-siralanir' }, [h('thead', null, [tr]), tb]));
      if (toplam > gor) kap.appendChild(h('button', { type: 'button', sinif: 'daha-fazla', onclick: function () { gor += 20; ciz(); } }, ['Daha fazla göster (' + (toplam - gor) + ' kayıt daha)']));
    }
    ciz(); kap.yenile = function (satirlar) { o.satirlar = satirlar; ciz(); };
    return kap;
  }

   
   
  function cipler(secenekler, secili, degisti, ad) {
    var kap = h('div', { sinif: 'cip-sira', role: 'group', 'aria-label': ad || 'Filtre' });
    secenekler.forEach(function (c) { kap.appendChild(h('button', { type: 'button', sinif: 'cip' + (c[0] === secili ? ' secili' : ''), 'aria-pressed': c[0] === secili ? 'true' : 'false', onclick: function () { degisti(c[0]); } }, [c[1], c[2] != null ? h('span', { sinif: 'cip-sayi', metin: String(c[2]) }) : null])); });
    return kap;
  }

   
   
  function sekmeler(liste, secili, sec, o) {
    o = o || {}; var N = liste.length, sn = o.sinif || 'sekme', acik = false, kap = h('div', { sinif: 'sekme-sira', role: 'tablist', 'aria-label': o.ad || 'Görünümler' });
    function ciz() {
      kap.textContent = '';
      var gor = liste.slice(0, N), ek = liste.slice(N);
      if (ek.length && secili && !gor.some(function (x) { return x[0] === secili; }) && ek.some(function (x) { return x[0] === secili; })) { var kx = ek.filter(function (x) { return x[0] === secili; })[0]; ek = ek.filter(function (x) { return x !== kx; }).concat([gor[gor.length - 1]]); gor = gor.slice(0, N - 1).concat([kx]); }
      var d = function (x) { return h('button', { type: 'button', role: 'tab', sinif: sn + (x[0] === secili ? ' secili' : ''), 'aria-selected': x[0] === secili ? 'true' : 'false', onclick: function () { sec(x[0]); } }, [x[1], x[2] || null]); };
      gor.forEach(function (x) { kap.appendChild(d(x)); });
      if (ek.length) {
        kap.appendChild(h('button', { type: 'button', sinif: sn + ' daha-fazla-sekme', 'aria-expanded': String(acik), onclick: function () { acik = !acik; ciz(); } }, [acik ? 'Daha az' : 'Daha fazla (' + ek.length + ')']));
        if (acik) ek.forEach(function (x) { kap.appendChild(d(x)); });
      }
    }
    ciz(); return kap;
  }
   
  function sayfali(ogeler, yap, o) {
    o = o || {}; var n = o.n || 20, gor = n, kap = h('div', { sinif: o.sinif || null, 'data-arakap': '1' }), aq = '', gorunen = ogeler, dugumler = null, aNorm = (window.MM && MM.aramaNorm) || function (x) { return String(x).toLowerCase(); };
    function ciz() {
      kap.textContent = '';
      gorunen.slice(0, gor).forEach(function (x) { kap.appendChild(yap(x)); });
      if (gorunen.length > gor) kap.appendChild(h('button', { type: 'button', sinif: 'daha-fazla', onclick: function () { gor += n; ciz(); } }, ['Daha fazla göster (' + (gorunen.length - gor) + ' kayıt daha)']));
    }
     
    kap.ara = function (q) {
      q = q || ''; if (q !== aq) {
        aq = q; gor = n;
        if (!q) gorunen = ogeler; else { if (!dugumler) dugumler = ogeler.map(function (x) { var d; try { d = yap(x); } catch (e) { d = null; } return d ? aNorm(d.textContent || '') : ''; }); gorunen = ogeler.filter(function (x, i) { return dugumler[i].indexOf(q) >= 0; }); }
        ciz();
      }
      return [gorunen.length, ogeler.length];
    };
    ciz(); return kap;
  }

   
  function sayfaBasi(o) {   
    var k = h('div', { sinif: 'sayfa-basi' });
    var kr = h('nav', { sinif: 'kirinti', 'aria-label': 'Konum' }), liste = [['Ana sayfa', '#ana']].concat(o.kirinti || []);
    liste.forEach(function (p, i) { if (i) kr.appendChild(h('span', { sinif: 'kirinti-ayrac', 'aria-hidden': 'true', metin: '/' })); kr.appendChild(p[1] && i < liste.length - 1 ? h('a', { href: p[1], metin: p[0] }) : h('span', { 'aria-current': 'page', metin: p[0] })); });
    k.appendChild(kr);
    var b = h('div', { sinif: 'baslik-satir' }, [h('h2', { metin: o.baslik }), o.alt ? h('span', { sinif: 'soluk kucuk', metin: o.alt }) : null]); if (o.eylem) b.appendChild(o.eylem);
    k.appendChild(b); return k;
  }

   
  function gecis(liste) {   
    var gor = (window.MM && window.MM.modulListe) || [], k = h('nav', { sinif: 'modul-gecis', 'aria-label': 'Bölüm geçişi' });
    liste.forEach(function (p) { if (gor.some(function (m) { return m.id === p[0]; })) k.appendChild(h('a', { href: '#' + p[0], sinif: 'mini-dugme modul-gecis-bag', metin: p[2] === 'geri' ? '← ' + p[1] : p[1] + ' →' })); });
    return k.firstChild ? k : null;
  }

   
   
  function csvHucre(v) {
    var t = v == null || v === '' ? '—' : String(v).replace(/\r?\n/g, ' ');
    if (/^[=+@]/.test(t) || /^-[^\d.,\s]/.test(t)) t = "'" + t;
    return /[;"]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  }
  function trZaman() { try { return new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date()).replace(',', ''); } catch (e) { return ''; } }
  function dosyaAdi(ad) { return String(ad).toLocaleLowerCase('tr').replace(/[ç]/g, 'c').replace(/[ğ]/g, 'g').replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ş]/g, 's').replace(/[ü]/g, 'u').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function csvMetin(r) {
    var T = (window.MM && MM.t) || function (x) { return x; };
    var sat = [['Rapor', r.ad], ['Süzgeç', r.filtre || 'Yok'], ['Oluşturma', trZaman()], [], r.kolonlar.map(function (c) { return c.ad; })].concat(r.satirlar);
    return '﻿' + sat.map(function (s) { return s.map(csvHucre).join(';'); }).join('\r\n') + '\r\n';
  }
  function iosMu() { return /iPad|iPhone|iPod/.test(navigator.userAgent || '') || (/Macintosh/.test(navigator.userAgent || '') && navigator.maxTouchPoints > 1) || !!window.Capacitor; }
  function paylasabilir() { try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File(['a'], 'a.csv', { type: 'text/csv' })] })); } catch (e) { return false; } }
   
  function excelDugme(getir) {
    if (iosMu() && !paylasabilir()) return null;
    return h('button', { type: 'button', sinif: 'mini-dugme excel-dugme', 'aria-label': "Excel'e aktar", onclick: function () {
      var r = getir(), kol = r.kolonlar, rows = r.satirlar.map(function (s) { return kol.map(function (c) { var v = c.csv ? c.csv(s) : (c.ciz ? c.ciz(s) : s[c.k]); return v && typeof v === 'object' ? (v.textContent || '') : v; }); });
      var metin = csvMetin({ ad: r.ad, filtre: r.filtre, kolonlar: kol, satirlar: rows }), ad = dosyaAdi(r.ad) + '.csv';
      var blob = new Blob([metin], { type: 'text/csv;charset=utf-8' });
      if (iosMu()) { try { navigator.share({ files: [new File([blob], ad, { type: 'text/csv' })], title: r.ad }); } catch (e) {   } return; }
      var u = URL.createObjectURL(blob), a = h('a', { href: u, download: ad }); document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
    } }, [ikon('indir', 16), "Excel'e aktar"]);
  }
   
  function veriTablo(o) {
    var kap = h('div', { sinif: 'veri-tablo' }), dg = excelDugme(function () { return { ad: o.ad, filtre: o.filtre, kolonlar: o.kolonlar, satirlar: o.satirlar }; });
    kap.appendChild(h('div', { sinif: 'veri-tablo-ust' }, [h('strong', { sinif: 'veri-tablo-ad', metin: o.ad + ' (' + say(o.satirlar.length) + ')' }), dg]));
    kap.appendChild(tablo({ kolonlar: o.kolonlar, satirlar: o.satirlar, sayfa: o.sayfa || 50, bos: o.bos }));
    return kap;
  }

  window.MM = window.MM || {};
  window.MM.gr = { excelDugme: excelDugme, veriTablo: veriTablo, h: h, s: s, say: say, kisa: kisa, ikon: ikon, ipucu: ipucu, spark: spark, delta: delta, kpi: kpi, kart: kart, duzTablo: duzTablo, cubuk: cubuk, cizgi: cizgi, yatay: yatay, pareto: pareto, lejant: lejant, iskelet: iskelet, bos: bos, tablo: tablo, cipler: cipler, sekmeler: sekmeler, sayfali: sayfali, sayfaBasi: sayfaBasi, gecis: gecis, IK: IK };
})();
