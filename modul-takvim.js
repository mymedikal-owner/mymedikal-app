





(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, S = G.s;
  var ESKI_DK = 72 * 60;
  var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var AY_KISA = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  var GUNLER = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  function bugunSeri() {
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-');
    return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5;
  }
  function seri(iso) { var p = iso.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
  function kalanGun(iso) { if (!iso) return null; return Math.round(seri(iso) - bugunSeri()); }
   
  function kovaK(k, gun) { return k && k.bilgi_notu === true && gun != null && gun < 0 ? 'bilgi' : kova(gun); }
  function kova(gun) { if (gun == null) return 'bilinmiyor'; if (gun < 0) return 'gecti'; if (gun <= 7) return 'k7'; if (gun <= 30) return 'k30'; if (gun <= 90) return 'k90'; return 'ok'; }
  var KOVA = { gecti: ['Süresi geçti', 'kirmizi'], k7: ['7 gün içinde', 'kirmizi'], k30: ['30 gün içinde', 'turuncu'], k90: ['90 gün içinde', 'sari'], ok: ['90 günden sonra', 'yesil'], bilgi: ['Bilgi', 'gri'], bilinmiyor: ['Tarih bilinmiyor', 'gri'] };
   
  var STIL = {
    gecti: { isaret: 'var(--kritik)', yazi: 'var(--kirmizi)', zemin: 'var(--kirmizi-zemin)', ikon: 'uyari', ad: 'Süresi geçti' },
    k7: { isaret: 'var(--kritik)', yazi: 'var(--kirmizi)', zemin: 'var(--kirmizi-zemin)', ikon: 'uyari', ad: '7 gün içinde' },
    k30: { isaret: 'var(--ciddi)', yazi: 'var(--turuncu)', zemin: 'var(--turuncu-zemin)', ikon: 'saat', ad: '8–30 gün' },
    k90: { isaret: 'var(--uyari)', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)', ikon: 'saat', ad: '31–90 gün' },
    ok: { isaret: 'var(--iyi)', yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)', ikon: 'tik', ad: '90 günden sonra' },
    bilgi: { isaret: 'var(--gri)', yazi: 'var(--soluk)', zemin: 'var(--gri-zemin)', ikon: 'bilgi', ad: 'Bilgi' },
    bilinmiyor: { isaret: 'var(--gri)', yazi: 'var(--soluk)', zemin: 'var(--gri-zemin)', ikon: 'bilgi', ad: 'Tarih bilinmiyor' }
  };
  function tarihTR(iso) { var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function hazirla(v) {
    return (v.kayitlar || []).map(function (k, i) { var g = kalanGun(k.son_tarih); return { k: k, gun: g, kova: kovaK(k, g), i: i }; })
      .sort(function (a, b) { if (a.gun == null && b.gun == null) return a.i - b.i; if (a.gun == null) return 1; if (b.gun == null) return -1; return a.gun - b.gun; });
  }
  function ozet(v) {
    var l = hazirla(v), s = { gecti: 0, k7: 0, k30: 0, k90: 0, ok: 0, bilgi: 0, bilinmiyor: 0, toplam: l.length, liste: l };
    l.forEach(function (x) { s[x.kova]++; });
    s.yaklasan = l.filter(function (x) { return x.gun != null && x.gun <= 90; });
    return s;
  }
  MM.takvim = { hazirla: hazirla, ozet: ozet, kova: KOVA, tarihTR: tarihTR };

   
  function kurulusMetin(v) { var s = String(v == null ? '' : v).trim(); return /teyit|bekleniyor/i.test(s) ? '' : s; }
  function kalanMetin(gun) { return gun == null ? 'tarih yok' : (gun < 0 ? Math.abs(gun) + ' gün geçti' : (gun === 0 ? 'bugün' : gun + ' gün kaldı')); }
  function rozet(kv) { var st = STIL[kv]; return h('span', { sinif: 'tq-rozet', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 13), st.ad]); }

   
  function belgeKarti(x, cfg) {
    var k = x.k, st = STIL[x.kova];
    return h('a', { href: '#' + cfg.id + '/belge/' + x.i, sinif: 'tq-kart', style: '--isaret:' + st.isaret }, [
      h('span', { sinif: 'tq-kart-ikon', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 20)]),
      h('span', { sinif: 'tq-kart-metin' }, [h('span', { sinif: 'tq-kart-ad', metin: k.belge }), kurulusMetin(k.kurulus) ? h('span', { sinif: 'tq-kart-alt', metin: kurulusMetin(k.kurulus) }) : null]),
      h('span', { sinif: 'tq-kart-sag' }, [h('b', { style: 'color:' + st.yazi, metin: kalanMetin(x.gun) }), k.son_tarih ? h('span', { metin: tarihTR(k.son_tarih) + (k.yaklasik ? ' (yaklaşık)' : '') }) : h('span', { metin: 'tarih kayıtlı değil' })])
    ]);
  }

   
  function zamanCizelgesi(o, cfg, kokGen) {
    var W = Math.max(320, Math.min(900, kokGen || 640)), sol = 52, sag = 10, ust = 22, ay = W < 520 ? 2 : 1;
    var xg = function (g) { return sol + g / 365 * (W - sol - sag); };
    var isl = o.liste.filter(function (x) { return x.gun != null && x.gun <= 365; }), ileri = o.liste.filter(function (x) { return x.gun != null && x.gun > 365; }).length;
    var seritler = [], yer = [];
    isl.forEach(function (x) {
      var px = x.gun < 0 ? sol / 2 : xg(x.gun), ln = 0;
      while (yer[ln] != null && px - yer[ln] < 15) ln++;
      yer[ln] = px; seritler.push([x, px, ln]);
    });
    var lanes = Math.max(1, yer.length), H = ust + lanes * 18 + 34, yy0 = ust, yy1 = H - 22;
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'grafik tq-zaman', role: 'group', 'aria-label': 'Önümüzdeki 12 ay son tarih çizelgesi' });
    [[0, 7, 'var(--kritik)'], [7, 30, 'var(--ciddi)'], [30, 90, 'var(--uyari)']].forEach(function (b) {
      svg.appendChild(S('rect', { x: xg(b[0]), y: yy0, width: xg(b[1]) - xg(b[0]), height: yy1 - yy0, fill: b[2], opacity: .16 }));
    });
    svg.appendChild(S('rect', { x: 0, y: yy0, width: sol - 6, height: yy1 - yy0, fill: 'var(--kritik)', opacity: .1 }));
    svg.appendChild(S('text', { x: (sol - 6) / 2, y: 14, 'text-anchor': 'middle', class: 'g-yazi' }, ['geçti']));
    [[7, '7 g'], [30, '30 g'], [90, '90 g']].forEach(function (b) {
      svg.appendChild(S('line', { x1: xg(b[0]), x2: xg(b[0]), y1: yy0, y2: yy1, class: 'g-hedef', style: 'stroke-width:1' }));
      svg.appendChild(S('text', { x: xg(b[0]) + 3, y: 14, class: 'g-yazi', 'text-anchor': b[0] === 7 ? 'middle' : 'start' }, [b[1]]));
    });
    svg.appendChild(S('line', { x1: sol, x2: sol, y1: yy0, y2: yy1, stroke: 'var(--yazi)', 'stroke-width': 2 }));
    svg.appendChild(S('text', { x: sol + 3, y: H - 6, class: 'g-yazi', style: 'font-weight:700' }, ['bugün']));
    var bs = bugunSeri(), d0 = new Date(bs * 864e5), yil = d0.getUTCFullYear(), m0 = d0.getUTCMonth();
    for (var i = 1; i <= 12; i += ay) {
      var mm = (m0 + i) % 12, yy = yil + Math.floor((m0 + i) / 12), g = Date.UTC(yy, mm, 1) / 864e5 - bs;
      if (g > 365) break;
      if (xg(g) < sol + 46) continue;
      svg.appendChild(S('line', { x1: xg(g), x2: xg(g), y1: yy1, y2: yy1 + 4, class: 'g-eksen' }));
      svg.appendChild(S('text', { x: xg(g), y: H - 6, 'text-anchor': 'middle', class: 'g-yazi' }, [AY_KISA[mm] + (mm === 0 ? ' ' + String(yy).slice(2) : '')]));
    }
    svg.appendChild(S('line', { x1: 0, x2: W, y1: yy1, y2: yy1, class: 'g-eksen' }));
    seritler.forEach(function (t) {
      var x = t[0], st = STIL[x.kova], cy = yy0 + 12 + t[2] * 18;
      var g = S('g', { class: 'tq-nokta' }, [S('circle', { cx: t[1], cy: cy, r: 12, fill: 'transparent' }), S('circle', { cx: t[1], cy: cy, r: 6, fill: st.isaret, stroke: 'var(--yuzey)', 'stroke-width': 2 })]);
      if (x.k.yaklasik) g.appendChild(S('circle', { cx: t[1], cy: cy, r: 2, fill: 'var(--yuzey)' }));
      G.ipucu(g, [x.k.belge, kalanMetin(x.gun) + (x.k.son_tarih ? ' · ' + tarihTR(x.k.son_tarih) : '') + (x.k.yaklasik ? ' (yaklaşık)' : '')]);
      svg.appendChild(g);
    });
    var kap = h('div', null, [svg]);
    kap.appendChild(h('p', { sinif: 'kucuk soluk tq-not', metin: (ileri ? '12 aydan sonra: ' + ileri + ' kayıt' : '') }));
    return kap;
  }

   
  function ayTakvimi(o, cfg, durum, yeniden) {
    var bs = bugunSeri(), d0 = new Date(bs * 864e5), top = d0.getUTCFullYear() * 12 + d0.getUTCMonth() + durum.ay, yil = Math.floor(top / 12), ay = top % 12;
    var ilk = Date.UTC(yil, ay, 1) / 864e5, gunSay = Date.UTC(yil, ay + 1, 1) / 864e5 - ilk, bosluk = (new Date(ilk * 864e5).getUTCDay() + 6) % 7;
    var tarihli = o.liste.filter(function (x) { return x.k.son_tarih; }), harita = {};
    tarihli.forEach(function (x) { (harita[x.k.son_tarih] = harita[x.k.son_tarih] || []).push(x); });
    var z2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var kap = h('div', { sinif: 'tq-ay' });
    kap.appendChild(h('div', { sinif: 'tq-ay-ust' }, [
      h('button', { type: 'button', sinif: 'mini-dugme', 'aria-label': 'Önceki ay', onclick: function () { durum.ay--; durum.gun = null; yeniden(); } }, [G.ikon('sol', 18)]),
      h('strong', { sinif: 'tq-ay-ad', 'aria-live': 'polite', metin: AYLAR[ay] + ' ' + yil }),
      h('button', { type: 'button', sinif: 'mini-dugme', 'aria-label': 'Sonraki ay', onclick: function () { durum.ay++; durum.gun = null; yeniden(); } }, [G.ikon('sag', 18)]),
      durum.ay !== 0 ? h('button', { type: 'button', sinif: 'mini-dugme', onclick: function () { durum.ay = 0; durum.gun = null; yeniden(); } }, ['Bugün']) : null]));
    var izg = h('div', { sinif: 'tq-izgara', role: 'grid', 'aria-label': AYLAR[ay] + ' ' + yil + ' son tarihleri' });
    GUNLER.forEach(function (g) { izg.appendChild(h('span', { sinif: 'tq-gun-ad', role: 'columnheader', metin: g })); });
    for (var b = 0; b < bosluk; b++) izg.appendChild(h('span', { sinif: 'tq-hucre bos', 'aria-hidden': 'true' }));
    var buAy = [];
    for (var g = 1; g <= gunSay; g++) {
      var iso = yil + '-' + z2(ay + 1) + '-' + z2(g), l = harita[iso] || [], bugun = ilk + g - 1 === bs;
      if (l.length) buAy = buAy.concat(l);
      var en = l.length ? l.reduce(function (a, x) { return (a == null || x.gun < a.gun) ? x : a; }, null) : null, st = en ? STIL[en.kova] : null;
      var sec = durum.gun === iso;
      var hc = h(l.length ? 'button' : 'span', { sinif: 'tq-hucre' + (l.length ? ' dolu' : '') + (bugun ? ' bugun' : '') + (sec ? ' secili' : ''), type: l.length ? 'button' : null, role: 'gridcell',
        'aria-label': g + ' ' + AYLAR[ay] + (l.length ? ': ' + l.length + ' son tarih' : ''), 'aria-pressed': l.length ? String(sec) : null,
        onclick: l.length ? (function (i) { return function () { durum.gun = durum.gun === i ? null : i; yeniden(); }; })(iso) : null }, [
        h('span', { sinif: 'tq-gun-no', metin: String(g) }),
        l.length ? h('span', { sinif: 'tq-isaret', style: 'background:' + st.zemin + ';color:' + st.yazi + ';border-color:' + st.isaret }, [G.ikon(st.ikon, 11), String(l.length)]) : null]);
      izg.appendChild(hc);
    }
    kap.appendChild(izg);
    var gosterilen = durum.gun ? (harita[durum.gun] || []) : buAy;
    kap.appendChild(h('h4', { sinif: 'tq-alt-baslik', metin: durum.gun ? tarihTR(durum.gun) + ' tarihli son tarihler (' + gosterilen.length + ')' : AYLAR[ay] + ' ayında son tarihler (' + gosterilen.length + ')' }));
    var lst = h('div', { sinif: 'tq-liste' });
    gosterilen.forEach(function (x) { lst.appendChild(belgeKarti(x, cfg)); });
    if (!gosterilen.length) lst.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu ayda tarihi kayıtlı son tarih yok.' }));
    kap.appendChild(lst);
    return kap;
  }

   
  function ayrinti(o, cfg, idx) {
    var x = o.liste.filter(function (y) { return y.i === idx; })[0], f = h('div');
    f.appendChild(G.sayfaBasi({ baslik: x ? x.k.belge : 'Belge bulunamadı', kirinti: [[cfg.ad, '#' + cfg.id], [x ? 'Belge ' + (idx + 1) : 'Belge']] }));
    if (!x) { f.appendChild(G.bos({ baslik: 'Bu belge listede yok', metin: 'Liste güncellenmiş olabilir.', eylem: { ad: cfg.ad + ' listesine dön', fn: function () { location.hash = '#' + cfg.id; } } })); return f; }
    var st = STIL[x.kova], k = x.k;
    f.appendChild(h('div', { sinif: 'tq-ayr-ust', style: 'border-color:' + st.isaret + ';background:' + st.zemin }, [
      h('span', { sinif: 'tq-ayr-ikon', style: 'color:' + st.yazi }, [G.ikon(st.ikon, 30)]),
      h('div', null, [h('div', { sinif: 'tq-ayr-sayi', style: 'color:' + st.yazi, metin: x.gun == null ? 'Tarih bilinmiyor' : (x.gun < 0 ? Math.abs(x.gun) + ' gün geçti' : (x.gun === 0 ? 'Bugün' : x.gun + ' gün kaldı')) }), h('div', { sinif: 'tq-ayr-alt', metin: st.ad })])]));
    var dl = h('dl', { sinif: 'degerler tq-dl' });
    [['Belge / yükümlülük', k.belge], ['Kuruluş / alan', kurulusMetin(k.kurulus) || 'kayıtlı değil'], ['Son tarih', k.son_tarih ? tarihTR(k.son_tarih) : 'kayıtlı değil'], ['Kaynaktaki tarih metni', k.tarih_metni || 'kayıtlı değil'],
      ['Tarih kesinliği', k.son_tarih ? (k.yaklasik ? 'Yaklaşık (gün belirsiz olabilir)' : 'Kesin') : '—'], ['Risk bandı', st.ad]].concat(cfg.id === 'kalite' ? [['Belge türü', belgeTuru(k.belge)]].concat(k.sorumlu ? [['Sorumlu', k.sorumlu]] : [], k.sonraki_adim ? [['Sonraki adım', k.sonraki_adim]] : []) : []).forEach(function (a) { dl.appendChild(h('dt', { metin: a[0] })); dl.appendChild(h('dd', { metin: String(a[1]) })); });
    f.appendChild(G.kart({ baslik: 'Belge bilgisi', govde: dl }));
    var yakin = o.liste.filter(function (y) { return y.i !== idx && y.gun != null && x.gun != null && Math.abs(y.gun - x.gun) <= 14; }).slice(0, 5);
    if (yakin.length) { var l = h('div', { sinif: 'tq-liste' }); yakin.forEach(function (y) { l.appendChild(belgeKarti(y, cfg)); }); f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: '±14 gün içindeki diğer son tarihler', govde: l })])); }
    f.appendChild(h('p', { sinif: 'ust-bosluk' }, [h('a', { sinif: 'dugme ikincil', href: '#' + cfg.id, metin: '← ' + cfg.ad + ' listesi' })]));
    return f;
  }

   
  var T = function (k) { return MM.t ? MM.t(k) : k; };
  var VB = 'Veri bekleniyor';
  function z2(n) { return (n < 10 ? '0' : '') + n; }
  function veriSatiri(asof) {
    var d = asof ? new Date(asof) : null, ok = d && !isNaN(d.getTime());
    var m = ok ? z2(d.getDate()) + '.' + z2(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + z2(d.getHours()) + ':' + z2(d.getMinutes()) : null;
    return h('div', { sinif: 'tq-veri-satir', metin: ok ? T('Veri') + ': ' + m + ' ' + T('itibarıyla') : T('Veri') + ': ' + T('zamanı bilinmiyor') });
  }
   
  var TUR_SIRA = ['ISO', 'CE / MDR', 'ÜTS', 'DÖF', 'SATRA', 'Module', 'Yerli malı', 'DMO', 'Diğer'];
  function belgeTuru(ad) {
    var a = (ad || '').trim();
    if (/^ISO\b/i.test(a)) return 'ISO';
    if (/^(CE\b|MDR\b|CE-)/i.test(a)) return 'CE / MDR';
    if (/^ÜTS\b/i.test(a)) return 'ÜTS';
    if (/^DÖF\b/i.test(a)) return 'DÖF';
    if (/^SATRA\b/i.test(a)) return 'SATRA';
    if (/^Module\b/i.test(a)) return 'Module';
    if (/^Yerli malı\b/i.test(a)) return 'Yerli malı';
    if (/^DMO\b/i.test(a)) return 'DMO';
    return 'Diğer';
  }
  function saglikOzeti(o) {
    var g = o.gecti, y = o.k7;
    return h('div', { sinif: 'tq-saglik ' + (g ? 'kirmizi' : (y ? 'turuncu' : 'yesil')), role: 'status' }, [G.ikon(g || y ? 'uyari' : 'tik', 18),
      h('strong', { metin: T('Süresi geçti') + ' ' + g + ' · 7 ' + T('günde') + ' ' + y })]);
  }
  function matris(o) {
    var kv = ['gecti', 'k7', 'k30', 'k90', 'ok', 'bilinmiyor'], sat = {};
    TUR_SIRA.forEach(function (t) { sat[t] = { gecti: 0, k7: 0, k30: 0, k90: 0, ok: 0, bilgi: 0, bilinmiyor: 0, top: 0 }; });
    o.liste.forEach(function (x) { var s = sat[belgeTuru(x.k.belge)]; s[x.kova]++; s.top++; });
    var satirlar = TUR_SIRA.filter(function (t) { return sat[t].top; }).map(function (t) { return [t].concat(kv.map(function (b) { return sat[t][b]; }), [sat[t].top]); });
    var kol = [T('Belge türü')].concat(kv.map(function (b) { return T(STIL[b].ad); }), [T('Toplam')]);
    var kap = h('div');
    kap.appendChild(G.duzTablo(kol, satirlar));
    kap.appendChild(h('p', { sinif: 'kucuk soluk tq-not', metin: T('Belge türü kayıt adının önekinden çıkarılır; kesin olmayanlar "Diğer"de.') }));
    var vr = o.liste.some(function (x) { return x.k.sorumlu || x.k.sonraki_adim; });
    if (vr) kap.appendChild(h('div', { sinif: 'tq-ek-satir' }, [h('span', { metin: T('Sorumlu') + ': ' }), h('b', { metin: T('kayıtlarda') }),
      h('span', { metin: ' · ' + T('Sonraki adım') + ': ' }), h('b', { metin: T('kayıtlarda') })]));   
    return G.kart({ baslik: T('Belge türü × durum'), alt: T('Kaç belge hangi risk bandında'), govde: kap });
  }
  function aylikGrafik(o) {
    var bs = bugunSeri(), d0 = new Date(bs * 864e5), yil = d0.getUTCFullYear(), m0 = d0.getUTCMonth(), say = [], gecmis = 0, ileri = 0, i;
    for (i = 0; i < 12; i++) say.push(0);
    o.liste.forEach(function (x) {
      if (!x.k.son_tarih) return;
      var p = x.k.son_tarih.split('-'), fark = (+p[0] - yil) * 12 + (+p[1] - 1 - m0);
      if (x.kova === 'bilgi') return;
      if (fark < 0 || x.gun < 0) gecmis++; else if (fark < 12) say[fark]++; else ileri++;
    });
    var oge = [{ e: T('Geçmiş'), d: gecmis, renk: 'var(--kritik)', ipucu: [T('Süresi geçmiş') + ': ' + gecmis, ''] }];
    for (i = 0; i < 12; i++) { var mm = (m0 + i) % 12; oge.push({ e: AY_KISA[mm], d: say[i], ipucu: [AY_KISA[mm] + ' ' + (yil + Math.floor((m0 + i) / 12)) + ': ' + say[i] + ' ' + T('belge'), ''] }); }
    var kap = h('div'); kap.appendChild(G.cubuk(oge, { yukseklik: 190, ad: T('12 aylık süre dolum') }));
    kap.appendChild(h('p', { sinif: 'kucuk soluk tq-not', metin: T('Bu ay dahil 12 ay; ilk sütun süresi geçmişler.') + (ileri ? ' ' + T('12 aydan sonra') + ': ' + ileri : '') }));
    return G.kart({ baslik: T('12 aylık süre dolumu'), alt: T('Aylara göre biten belge sayısı'), govde: kap,
      tablo: { kolonlar: [T('Ay'), T('Belge')], satirlar: oge.map(function (x) { return [x.e, x.d]; }) } });
  }
  function sikayetKutusu(v) {
    var s = v.sikayet, kap = h('div');
    if (!s || s.acik == null) return null;   
    else {
      var bs = bugunSeri(), yas = (s.acik_tarihler || []).map(function (t) { return Math.round(bs - seri(t)); }), a = [0, 0, 0];
      yas.forEach(function (d) { a[d <= 30 ? 0 : (d <= 90 ? 1 : 2)]++; });
      var en = yas.length ? Math.max.apply(null, yas) : null, kp = h('div', { sinif: 'kpi-izgara tq-kpi' });
      kp.appendChild(G.kpi({ baslik: T('Açık şikâyet'), deger: String(s.acik), birim: T('kayıt'), ikon: 'uyari', durum: s.acik ? 'uyari' : null, alt: T('kapanmamış olay') }));
      kp.appendChild(G.kpi({ baslik: T('En eski açık'), deger: en == null ? '—' : String(en), birim: en == null ? '' : T('gün'), ikon: 'saat', alt: T('tarihli olaylar içinde') }));
      kap.appendChild(kp);
      kap.appendChild(G.duzTablo([T('Yaş'), T('Açık olay')], [['0–30 ' + T('gün'), a[0]], ['31–90 ' + T('gün'), a[1]], ['90+ ' + T('gün'), a[2]], [T('Tarihi yok'), s.acik_tarihsiz || 0]]));
      if (s.asof) kap.appendChild(h('p', { sinif: 'kucuk soluk tq-not', metin: T('Şikâyet verisi') + ': ' + (function () { var d = new Date(s.asof); return isNaN(d.getTime()) ? '—' : z2(d.getDate()) + '.' + z2(d.getMonth() + 1) + ' ' + z2(d.getHours()) + ':' + z2(d.getMinutes()); })() + ' ' + T('itibarıyla') }));
    }
    return G.kart({ baslik: T('Şikâyet ve CAPA'), alt: T('Açık şikâyetlerin sayısı ve yaşı'), govde: kap });
  }

  


  var RISK_STIL = { 'Yüksek': 'gecti', 'Orta': 'k30', 'Düşük': 'ok' };
  var RISK_SIRA = { 'Yüksek': 0, 'Orta': 1, 'Düşük': 2 };
  var KART_DUGME = 'font:inherit;color:inherit;text-align:left;width:100%;cursor:pointer;';
  function riskRozet(sev) { var st = STIL[RISK_STIL[sev] || 'bilinmiyor']; return h('span', { sinif: 'tq-rozet', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 13), sev + ' risk']); }
  function yuzdeMetin(v) { return v == null ? 'ölçülemedi' : '%' + String(v).replace('.', ','); }
  function gunMetin(v) { return v == null ? 'ölçülemedi' : String(v).replace('.', ',') + ' gün'; }

  function tedSatir(t, ac) {
    var st = STIL[RISK_STIL[t.risk] || 'bilinmiyor'];
    return h('button', { type: 'button', sinif: 'tq-kart', style: '--isaret:' + st.isaret + ';' + KART_DUGME, onclick: ac }, [
      h('span', { sinif: 'tq-kart-ikon', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 20)]),
      h('span', { sinif: 'tq-kart-metin' }, [h('span', { sinif: 'tq-kart-ad', metin: t.ad }),
        h('span', { sinif: 'tq-kart-alt', metin: t.sirket + ' · ' + t.kalem + ' kalem · zamanında ' + yuzdeMetin(t.zamaninda_pct) + (t.vadesi_gecmis_acik ? ' · vadesi geçmiş açık ' + t.vadesi_gecmis_acik : '') })]),
      h('span', { sinif: 'tq-kart-sag' }, [riskRozet(t.risk), t.az_veri ? h('span', { metin: 'az veri' }) : null])]);
  }

  function tedAyrinti(t, v, kapat) {
    var st = STIL[RISK_STIL[t.risk] || 'bilinmiyor'], f = h('div');
    f.appendChild(h('p', null, [h('button', { type: 'button', sinif: 'dugme ikincil', onclick: kapat }, ['← Tedarikçi listesi'])]));
    f.appendChild(h('div', { sinif: 'tq-ayr-ust', style: 'border-color:' + st.isaret + ';background:' + st.zemin }, [
      h('span', { sinif: 'tq-ayr-ikon', style: 'color:' + st.yazi }, [G.ikon(st.ikon, 30)]),
      h('div', null, [h('div', { sinif: 'tq-ayr-sayi', style: 'color:' + st.yazi, metin: t.risk + ' risk' }), h('div', { sinif: 'tq-ayr-alt', metin: t.ad + ' · ' + t.sirket })])]));
    if (t.az_veri) f.appendChild(h('div', { sinif: 'bant gri', role: 'status', metin: 'Az veri: son 12 ayda 3 kalemden az sipariş var, göstergeler yol gösterici değildir.' }));
    var dl = h('dl', { sinif: 'degerler tq-dl' });
    [['Sipariş kalemi (son 12 ay)', String(t.kalem)],
      ['Zamanında teslim', yuzdeMetin(t.zamaninda_pct) + (t.olculen_zaman ? ' (' + t.olculen_zaman + ' kalem ölçüldü)' : '')],
      ['Ortalama gecikme (geç kalanlarda)', gunMetin(t.ort_gecikme_gun)],
      ['Miktar uyumu', yuzdeMetin(t.miktar_uyum_pct) + (t.olculen_miktar ? ' (' + t.olculen_miktar + ' kalem)' : '')],
      ['Açık (teslim bekleyen) kalem', String(t.acik)],
      ['Vadesi geçmiş açık kalem', String(t.vadesi_gecmis_acik)],
      ['İade hareketi', String(t.iade)],
      ['Ölçülemeyen kalem', String(t.olculemeyen)],
      ['Tek kaynak malzeme', t.tek_kaynak_malzeme + ' / ' + t.malzeme_sayisi + (t.tek_kaynak ? ' (tek kaynak bayrağı)' : '')],
      ['Son sipariş', t.son_siparis ? tarihTR(t.son_siparis) : 'kayıtlı değil']].forEach(function (a) { dl.appendChild(h('dt', { metin: a[0] })); dl.appendChild(h('dd', { metin: a[1] })); });
    f.appendChild(G.kart({ baslik: 'Göstergeler', alt: 'Sipariş ve mal girişi kayıtlarından', govde: dl }));
    var ul = h('ul', { sinif: 'tq-gerekce' });
    (t.gerekce || []).forEach(function (m) { ul.appendChild(h('li', { metin: m })); });
    f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Risk gerekçesi', alt: 'Puan ' + t.puan + ' (Yüksek 4 ve üstü, Orta 2-3, Düşük 0-1)',
      govde: (t.gerekce || []).length ? ul : h('p', { sinif: 'veri-yok', metin: 'Risk işareti yok.' }) })]));
    if (v.yontem && v.yontem.risk) f.appendChild(h('p', { sinif: 'kucuk soluk tq-not', metin: v.yontem.risk }));
    return f;
  }

  function tedarikciGorunum(v, durum, yeniden) {
    var kap = h('div'), tum = (v.tedarikciler || []).slice().sort(function (a, b) {
      return (a.az_veri ? 1 : 0) - (b.az_veri ? 1 : 0) || RISK_SIRA[a.risk] - RISK_SIRA[b.risk] || b.puan - a.puan || b.kalem - a.kalem;
    });
    if (!tum.length) return G.bos({ baslik: 'Veri henüz yok', metin: 'Tedarikçi göstergeleri henüz hazırlanmadı.' });
    if (durum.tedSec != null) {
      var sec = tum.filter(function (x) { return x.sirket + '|' + x.kod === durum.tedSec; })[0];
      if (sec) { kap.appendChild(tedAyrinti(sec, v, function () { durum.tedSec = null; yeniden(); })); return kap; }
      durum.tedSec = null;
    }
    var say = { 'Yüksek': 0, 'Orta': 0, 'Düşük': 0 }, az = 0, firmaSay = { MY: 0, DAY: 0 };
    tum.forEach(function (x) { say[x.risk]++; if (x.az_veri) az++; firmaSay[x.sirket] = (firmaSay[x.sirket] || 0) + 1; });
    var kp = h('div', { sinif: 'kpi-izgara tq-kpi' });
    [['Yüksek', 'Yüksek risk', 'kritik', 'uyari', 'Puan 4 ve üstü'], ['Orta', 'Orta risk', 'uyari', 'saat', 'Puan 2-3'], ['Düşük', 'Düşük risk', null, 'tik', 'Puan 0-1']].forEach(function (b) {
      kp.appendChild(G.kpi({ baslik: b[1], deger: String(say[b[0]]), birim: 'tedarikçi', durum: say[b[0]] && b[2] ? b[2] : null, ikon: b[3], alt: b[4], tikla: function () { durum.tedRisk = durum.tedRisk === b[0] ? '' : b[0]; yeniden(); } }));
    });
    kp.appendChild(G.kpi({ baslik: 'Az veri', deger: String(az), birim: 'tedarikçi', ikon: 'bilgi', alt: '3 kalemden az', tikla: function () { durum.tedRisk = durum.tedRisk === 'az' ? '' : 'az'; yeniden(); } }));
    kap.appendChild(kp);
    var r = durum.tedRisk || '', fr = durum.tedFirma || '';
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'Tümü', tum.length], ['Yüksek', 'Yüksek', say['Yüksek']], ['Orta', 'Orta', say['Orta']], ['Düşük', 'Düşük', say['Düşük']], ['az', 'Az veri', az]], r, function (d) { durum.tedRisk = d; yeniden(); }, 'Risk seviyesi filtresi')]));
    kap.appendChild(G.cipler([['', 'MY + DAY'], ['MY', 'MY', firmaSay.MY], ['DAY', 'DAY', firmaSay.DAY]], fr, function (d) { durum.tedFirma = d; yeniden(); }, 'Şirket filtresi'));
    var liste = tum.filter(function (x) { return (!r || (r === 'az' ? x.az_veri : x.risk === r)) && (!fr || x.sirket === fr); });
    var lk = h('div', { sinif: 'tq-liste ust-bosluk' });
    if (liste.length) lk.appendChild(G.sayfali(liste, function (x) { return tedSatir(x, function () { durum.tedSec = x.sirket + '|' + x.kod; yeniden(); try { window.scrollTo(0, 0); } catch (e) {   } }); }));
    else lk.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu süzgeçte tedarikçi yok.' }));
    kap.appendChild(lk);
    if (v.yontem) kap.appendChild(h('p', { sinif: 'kucuk soluk tq-not', metin: 'Dönem: ' + (v.pencere ? tarihTR(v.pencere.bas) + ' – ' + tarihTR(v.pencere.bit) : 'son 12 ay') + '. Zamanında teslim: mal girişi, planlı tarih + ' + (v.tolerans_gun == null ? 2 : v.tolerans_gun) + ' gün içinde. Tutar bilgisi içermez.' }));
    return kap;
  }

  function uyumKarti(x) {
    var k = x.k, st = STIL[x.kova], alt = k.kategori + (kurulusMetin(k.kurulus) ? ' · ' + kurulusMetin(k.kurulus) : '');
    var bilgi = x.kova === 'bilgi', dz = k.duzenleme_tarihi && /^\d{4}-\d{2}-\d{2}$/.test(k.duzenleme_tarihi) ? 'Düzenleme: ' + tarihTR(k.duzenleme_tarihi) : '';
    var nt = k.not ? String(k.not) : '';
    return h('div', { sinif: 'tq-kart', style: '--isaret:' + st.isaret + ';cursor:default' }, [
      h('span', { sinif: 'tq-kart-ikon', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 20)]),
      h('span', { sinif: 'tq-kart-metin' }, [h('span', { sinif: 'tq-kart-ad', metin: k.konu }), h('span', { sinif: 'tq-kart-alt', metin: alt }),
        dz ? h('span', { sinif: 'tq-kart-alt', metin: dz }) : null, nt ? h('span', { sinif: 'tq-kart-alt', metin: nt }) : null]),
      h('span', { sinif: 'tq-kart-sag' }, [h('b', { style: 'color:' + st.yazi, metin: bilgi ? 'Bilgi' : kalanMetin(x.gun) }), k.son_tarih ? h('span', { metin: tarihTR(k.son_tarih) + (k.yaklasik ? ' (yaklaşık)' : '') }) : h('span', { metin: 'tarih kayıtlı değil' })])]);
  }

  function uyumGorunum(v, durum, yeniden) {
    var kap = h('div'), hepsi = hazirla({ kayitlar: v.kayitlar || [] });
    if (!hepsi.length) return G.bos({ baslik: 'Veri henüz yok', metin: 'Uyum takvimi henüz hazırlanmadı.' });
    var kat = {}, kn = (v.kategoriler || []).slice();
    hepsi.forEach(function (x) { kat[x.k.kategori] = (kat[x.k.kategori] || 0) + 1; if (kn.indexOf(x.k.kategori) < 0) kn.push(x.k.kategori); });
    var ck = durum.uKat || '', kv = durum.uKova || '';
    var liste = hepsi.filter(function (x) { return !ck || x.k.kategori === ck; }), o = { gecti: 0, k7: 0, k30: 0, k90: 0, ok: 0, bilgi: 0, bilinmiyor: 0 };
    liste.forEach(function (x) { o[x.kova]++; });
    var ky = o.gecti + o.k7;
    kap.appendChild(h('div', { sinif: 'tq-saglik ' + (o.gecti ? 'kirmizi' : (o.k7 ? 'turuncu' : 'yesil')), role: 'status' }, [G.ikon(ky ? 'uyari' : 'tik', 18), h('strong', { metin: 'Süresi geçti ' + o.gecti + ' · 7 günde ' + o.k7 })]));
    var kp = h('div', { sinif: 'kpi-izgara tq-kpi ust-bosluk' });
    [['gecti', 'Süresi geçti', 'kritik', 'tarihi geçmiş'], ['k7', '7 gün içinde', 'kritik', '0–7 gün'], ['k30', '30 gün içinde', 'uyari', '8–30 gün'], ['k90', '90 gün içinde', 'uyari', '31–90 gün']].forEach(function (b) {
      kp.appendChild(G.kpi({ baslik: b[1], deger: String(o[b[0]]), birim: 'kayıt', durum: o[b[0]] && b[2] ? b[2] : null, ikon: STIL[b[0]].ikon, alt: b[3], tikla: function () { durum.uKova = durum.uKova === b[0] ? '' : b[0]; yeniden(); } }));
    });
    kap.appendChild(kp);
    var cp = [['', 'Tümü', hepsi.length]];
    kn.forEach(function (c) { if (kat[c]) cp.push([c, c, kat[c]]); });
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler(cp, ck, function (d) { durum.uKat = d; yeniden(); }, 'Kategori filtresi')]));
    var kvc = [['', 'Tüm bantlar']];
    ['gecti', 'k7', 'k30', 'k90', 'ok', 'bilgi'].forEach(function (b) { if (o[b]) kvc.push([b, STIL[b].ad, o[b]]); });
    kap.appendChild(G.cipler(kvc, kv, function (d) { durum.uKova = d; yeniden(); }, 'Risk bandı filtresi'));
    var tarihli = liste.filter(function (x) { return x.gun != null && (!kv || x.kova === kv); }), lk = h('div', { sinif: 'tq-liste ust-bosluk' });
    if (tarihli.length) lk.appendChild(G.sayfali(tarihli, uyumKarti));
    else lk.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu süzgeçte tarihi kayıtlı yükümlülük yok.' }));
    kap.appendChild(lk);
    var bil = liste.filter(function (x) { return x.gun == null; });
    if (bil.length && !kv) {
      var bk = h('div', { sinif: 'tq-liste' });
      bk.appendChild(G.sayfali(bil, uyumKarti));
      kap.appendChild(h('section', { sinif: 'tq-bilinmiyor ust-bosluk', 'aria-label': 'Tarihi bilinmeyen kayıtlar' }, [
        h('h3', { sinif: 'bolum' }, [G.ikon('bilgi', 18), ' Tarihi bilinmiyor (' + bil.length + ')']), bk]));
    }
    kap.appendChild(h('p', { sinif: 'kucuk soluk tq-not', metin: 'Kalite, İSG, resmi belge ve sigorta takvimlerinin birleşimidir; renkler bugünden hesaplanır, tarihi olmayan kayıt yeşil sayılmaz.' }));
    return kap;
  }

  function modul(cfg) {
    return function (kok) {
      var yuk = null, hata = null, canli = true, filtre = '';
      var q = new URLSearchParams(location.search).get('tsekme'), durum = { ay: 0, gun: null, sekme: q === 'takvim' ? 'takvim' : 'liste' };
      var yol = MM.yol(), detay = yol[0] === 'belge' && yol[1] != null && !isNaN(+yol[1]) ? +yol[1] : null;
      var ekVar = cfg.id === 'kalite', ana = ekVar && (q === 'tedarikci' || q === 'uyum') ? q : 'belge', ek = {};
      var baslik = detay == null ? G.sayfaBasi({ baslik: cfg.ad, alt: cfg.alt, kirinti: [[cfg.ad]] }) : null;
      if (baslik) kok.appendChild(baslik);
      var sekUst = h('div'), ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
      [sekUst, ust, govde].forEach(function (e) { kok.appendChild(e); });
      function urlSekme(d) { try { var u = new URL(location.href); u.searchParams.set('tsekme', d); history.replaceState(history.state, '', u.toString()); } catch (e) {   } }
      function sekCiz() {
        sekUst.textContent = '';
        if (!ekVar || detay != null) return;
        var sek = h('div', { sinif: 'cip-sira', role: 'tablist', 'aria-label': 'Kalite bölümleri' });
        [['belge', 'Belgeler', 'takvim'], ['tedarikci', 'Tedarikçiler', 'liste'], ['uyum', 'Uyum takvimi', 'saat']].forEach(function (s) {
          sek.appendChild(h('button', { type: 'button', role: 'tab', sinif: 'cip' + (ana === s[0] ? ' secili' : ''), 'aria-selected': ana === s[0] ? 'true' : 'false',
            onclick: function () { ana = s[0]; urlSekme(ana === 'belge' ? durum.sekme : ana); sekCiz(); ciz(); } }, [G.ikon(s[2], 16), s[1]]));
        });
        sekUst.appendChild(sek);
      }
      function ekCiz() {
        var e = ek[ana], a = ana;
        if (!e || e.bekle) {
          govde.appendChild(G.iskelet('kart', 4));
          if (!e) {
            ek[a] = { bekle: true };
            window.MMVeri.oku('kalite', a).then(function (r) { ek[a] = { yuk: r }; }).catch(function (er) { ek[a] = { hata: er }; }).then(function () { if (canli && ana === a) ciz(); });
          }
          return;
        }
        if (e.hata || !e.yuk || !e.yuk.veri) {
          govde.appendChild(G.bos({ baslik: 'Veri henüz yok', metin: a === 'tedarikci' ? 'Tedarikçi göstergeleri henüz hazırlanmadı.' : 'Uyum takvimi henüz hazırlanmadı.', eylem: { ad: 'Yeniden dene', fn: function () { delete ek[a]; ciz(); } } }));
          return;
        }
        var v = e.yuk.veri, dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK;
        if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
        if (eski) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — kaynak liste ' + MM.yasMetin(dk) + ' güncellendi.']));
        ust.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: MM.yasMetin(dk) + ' güncellendi' }), h('span', { sinif: 'kaynak-etiket', metin: e.yuk.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]));
        ust.appendChild(veriSatiri(v.asof));
        govde.appendChild(a === 'tedarikci' ? tedarikciGorunum(v, durum, ciz) : uyumGorunum(v, durum, ciz));
      }
      function ciz() {
        ust.textContent = ''; govde.textContent = '';
        if (ana !== 'belge') { ekCiz(); return; }
        if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: cfg.ad + ' alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
        if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
        var v = yuk.veri, dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK, o = ozet(v);
        if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
        if (eski) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — kaynak liste ' + MM.yasMetin(dk) + ' güncellendi.']));
        ust.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: MM.yasMetin(dk) + ' güncellendi' }), h('span', { sinif: 'kaynak-etiket', metin: yuk.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]));
        ust.appendChild(veriSatiri(v.asof));
        if (detay != null) { govde.appendChild(ayrinti(o, cfg, detay)); return; }
        if (!o.toplam) { govde.appendChild(G.bos({ baslik: 'Kayıt yok', metin: 'Listede belge ya da son tarih yok.' })); return; }
        if (o.bilinmiyor) ust.appendChild(h('div', { sinif: 'bant gri', role: 'status', metin: 'Tarihi olmayan: ' + o.bilinmiyor }));
        govde.appendChild(saglikOzeti(o));

         
        var kpiler = h('div', { sinif: 'kpi-izgara tq-kpi' });
        [['gecti', 'Süresi geçti', 'kritik'], ['k7', '7 gün içinde', 'kritik'], ['k30', '30 gün içinde', 'uyari'], ['k90', '90 gün içinde', 'uyari']].forEach(function (b) {
          var alt = { gecti: 'tarihi geçmiş', k7: '0–7 gün', k30: '8–30 gün', k90: '31–90 gün', ok: '91+ gün' }[b[0]];
          kpiler.appendChild(G.kpi({ baslik: b[1], deger: String(o[b[0]]), birim: 'kayıt', durum: o[b[0]] && b[2] ? b[2] : null, ikon: STIL[b[0]].ikon, alt: alt, tikla: function () { filtre = filtre === b[0] ? '' : b[0]; durum.sekme = 'liste'; ciz(); } }));
        });
        govde.appendChild(kpiler);
        if (cfg.id === 'kalite') {
          govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [matris(o)]));
          govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [aylikGrafik(o)]));
          govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [sikayetKutusu(v)]));
        }

        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Önümüzdeki 12 ay', alt: '', govde: zamanCizelgesi(o, cfg, (kok.clientWidth || window.innerWidth) - 56),
          tablo: { kolonlar: ['Belge', 'Son tarih', 'Kalan gün'], satirlar: o.liste.filter(function (x) { return x.gun != null; }).map(function (x) { return [x.k.belge, tarihTR(x.k.son_tarih) + (x.k.yaklasik ? ' (yaklaşık)' : ''), x.gun]; }) } })]));

        var sek = h('div', { sinif: 'cip-sira ust-bosluk', role: 'tablist', 'aria-label': 'Görünüm' });
        [['liste', 'Belge kartları'], ['takvim', 'Ay takvimi']].forEach(function (s) {
          sek.appendChild(h('button', { type: 'button', role: 'tab', sinif: 'cip' + (durum.sekme === s[0] ? ' secili' : ''), 'aria-selected': durum.sekme === s[0] ? 'true' : 'false', onclick: function () { durum.sekme = s[0]; ciz(); } }, [G.ikon(s[0] === 'liste' ? 'liste' : 'takvim', 16), s[1]]));
        });
        govde.appendChild(sek);

        if (durum.sekme === 'takvim') {
          govde.appendChild(G.kart({ baslik: 'Ay takvimi', alt: 'Günün rengi o günkü en yakın riski gösterir; dokununca o günün belgeleri açılır', govde: ayTakvimi(o, cfg, durum, ciz) }));
        } else {
          var cp = [['', 'Tümü', o.toplam - o.bilinmiyor]];
          ['gecti', 'k7', 'k30', 'k90', 'ok'].forEach(function (b) { if (o[b]) cp.push([b, STIL[b].ad, o[b]]); });
          govde.appendChild(G.cipler(cp, filtre, function (d) { filtre = d; ciz(); }, 'Risk bandı filtresi'));
          var liste = o.liste.filter(function (x) { return x.gun != null && (!filtre || x.kova === filtre); });
          var kap = h('div', { sinif: 'tq-liste' });
          if (liste.length) kap.appendChild(G.sayfali(liste, function (x) { return belgeKarti(x, cfg); }));
          else kap.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu risk bandında kayıt yok.' }));
          govde.appendChild(kap);
        }

         
        var bil = o.liste.filter(function (x) { return x.gun == null; });
        if (bil.length) {
          var bk = h('div', { sinif: 'tq-liste' });
          bk.appendChild(G.sayfali(bil, function (x) { return belgeKarti(x, cfg); }));
          govde.appendChild(h('section', { sinif: 'tq-bilinmiyor ust-bosluk', 'aria-label': 'Tarihi bilinmeyen kayıtlar' }, [
            h('h3', { sinif: 'bolum' }, [G.ikon('bilgi', 18), ' Tarihi bilinmiyor (' + bil.length + ')']),
            bk]));
        }
      }
      function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku(cfg.modul, cfg.dosya).then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
      sekCiz();
      yenile();
      return function () { canli = false; };
    };
  }
  MM.moduller.kalite = modul({ id: 'kalite', ad: 'Kalite', alt: 'Sertifika ve belge son tarihleri', modul: 'kalite', dosya: 'kalite' });
  MM.moduller.isg = modul({ id: 'isg', ad: 'İSG', alt: 'Eğitim, muayene ve periyodik kontrol takvimi', modul: 'isg', dosya: 'isg' });
})();
