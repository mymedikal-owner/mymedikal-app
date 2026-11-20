



(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var YENILE_MS = 60000, EK_MS = 5 * 60000;
  function say(n) { return n == null ? '—' : Math.round(n).toLocaleString('tr-TR'); }
  function bekleniyor(ad) { return h('p', { sinif: 'me-soluk', metin: ad + ': Veri bekleniyor' }); }

  var ESKI_MS = 3 * 60000;   
  

  function panoVerisi(html) {
    var a = '/*VERI:mabotex*/', b = '/*/VERI:mabotex*/', i = html.indexOf(a), j = html.indexOf(b);
    if (i < 0 || j < i) return null;
    try { return JSON.parse(html.slice(i + a.length, j)); } catch (e) { return null; }
  }
  function canliListe(p) {   
    var akis = {};
    (((p.akis || {}).hatlar) || []).forEach(function (x) { akis[x.hat] = x.ornekler || []; });
    return (p.hatlar || []).map(function (hh) {
      var o = akis[hh.hat] || [], son = o.length ? o[o.length - 1] : {}, hiz = hh.hiz_dk || 0, adet = hh.vardiya_uretilen;
      var cal = hh.durum === 'calisiyor' && hiz > 0 && (!son.durum || son.durum === 'calisiyor') && adet != null;
      return { hat: hh.hat, adet: adet, hiz_dk: cal ? hiz : 0, calisiyor: !!cal, adet_tahmin: !!hh.uretilen_tahmin, veri_yas_sn: hh.veri_yas_sn || 0 };
    });
  }
   
  function adimSonuc(o, simdi) {
    var eskidi = !o.veriMs || (simdi - o.veriMs + (o.c.veri_yas_sn || 0) * 1000) > ESKI_MS;
    if (eskidi || !o.artar || o.c.adet == null) return { eskidi: eskidi, deger: null };
    return { eskidi: false, deger: o.c.adet + o.c.hiz_dk * (simdi - o.t0) / 60000 };
  }
  MM.makineEkSinama = { adimSonuc: adimSonuc, ESKI_MS: ESKI_MS };
   
  function canliCiz(kutu, liste, veriMs, durum) {
    kutu.textContent = '';
    var ogeler = [], simdi = Date.now();
    liste.forEach(function (c) {
      var eski = (simdi - veriMs + (c.veri_yas_sn || 0) * 1000) > ESKI_MS;
      var sayi = h('div', { sinif: 'me-canli-sayi', metin: say(c.adet) });
      var alt = h('div', { sinif: 'me-canli-alt', metin: eski ? 'veri gecikmeli · artmıyor' : (c.calisiyor ? say(c.hiz_dk) + ' adet/dk' : (c.adet == null ? 'veri yok' : 'duruyor · artmıyor')) });
      var artar = c.calisiyor && !eski;
      var k = h('div', { sinif: 'me-canli-kutu' + (artar ? '' : ' dur') }, [h('div', { sinif: 'me-canli-hat', metin: 'Hat ' + c.hat }), sayi, alt,
        eski ? h('span', { sinif: 'me-etiket', metin: 'veri gecikmeli' }) : (c.calisiyor ? h('span', { sinif: 'me-etiket', metin: c.adet_tahmin ? 'canlı tahmini · adet tahmin' : 'canlı tahmini' }) : null)]);
      kutu.appendChild(k);
      ogeler.push({ c: c, sayi: sayi, alt: alt, k: k, t0: simdi, artar: artar, veriMs: veriMs });
    });
    durum.canli = ogeler;
  }

  function paretoBolum(p) {
    if (!p || !p.liste || !p.liste.length) return bekleniyor('Duruş nedeni');
    var mx = Math.max.apply(null, p.liste.map(function (x) { return x.dk; }).concat([1]));
    var og = p.liste.map(function (x) { return { e: x.ad, d: x.dk, etiketDeger: say(x.dk) + ' dk', renk: x.girilmedi ? 'var(--gri)' : 'var(--s1)' }; });
    var pay = p.toplam_dk ? Math.round(100 * p.girilmedi_dk / p.toplam_dk) : 0;
    return h('div', null, [G.yatay(og, { maks: mx }), h('p', { sinif: 'me-soluk', metin: 'Vardiya: ' + p.vardiya + ' · toplam ' + say(p.toplam_dk) + ' dk · %' + pay + ' neden girilmedi (gri). Neden girilmedi satırı sıfır değil, kayıt eksiğidir.' })]);
  }

  function seritBolum(s) {
    if (!s || !s.length) return bekleniyor('Zaman şeridi');
    var k = h('div', { sinif: 'me-serit' });
    s.forEach(function (x) {
      var yol = h('div', { sinif: 'me-serit-yol', role: 'img', 'aria-label': 'Hat ' + x.hat + ' durum şeridi' });
      (x.durumlar || '').split('').forEach(function (c) { yol.appendChild(h('i', { sinif: 'me-d-' + (c === 'n' ? 'n' : c === 's' ? 's' : c === 'd' ? 'd' : 'x') })); });
      k.appendChild(h('div', { sinif: 'me-serit-satir' }, [h('span', { sinif: 'me-serit-hat', metin: x.hat }), yol]));
    });
    k.appendChild(G.lejant([['Çalıştı', 'var(--yesil)'], ['Yavaş', 'var(--sari)'], ['Durdu', 'var(--kirmizi)'], ['Veri yok', 'var(--gri)']]));
    k.appendChild(h('p', { sinif: 'me-soluk', metin: 'Her dilim 15 dakika' }));
    return k;
  }

  function oeeBolum(o) {
    if (!o || !o.length) return bekleniyor('OEE');
    var f = function (v) { return v == null ? '—' : v.toFixed(1).replace('.', ','); };
    var t = h('table', { sinif: 'me-oee-tablo' }, [h('thead', null, [h('tr', null, ['Hat', 'OEE %', 'Kullanılabilirlik', 'Performans', 'Kalite'].map(function (c) { return h('th', { scope: 'col', metin: c }); }))]),
      h('tbody', null, o.map(function (x) { return h('tr', null, [h('td', { metin: x.hat + (x.gecici ? ' (geçici)' : '') }), h('td', { metin: x.oee == null ? '—' : f(x.oee) }), h('td', { metin: f(x.kullanilabilirlik) }), h('td', { metin: f(x.performans) }), h('td', { metin: f(x.kalite) })]); }))]);
    return h('div', null, [h('div', { sinif: 'me-tablo-kaydir' }, [t])]);
  }

  function alarmBolum(a) {
    if (!a || !a.vardiyalar) return bekleniyor('Alarm geçmişi');
    var v = h('div', { sinif: 'me-vardiya' }, a.vardiyalar.map(function (x) {
      return h('div', null, [h('span', { metin: x.ad + ' · ' + x.saat }), h('b', { metin: say(x.adet) + ' alarm' }), h('span', { metin: say(x.dk) + ' dk toplam' }), h('span', { sinif: 'me-soluk', metin: x.neden_girildi + ' / ' + x.adet + ' kayıtta neden girilmiş' })]);
    }));
    var l = h('ul', { sinif: 'me-alarm-liste' }, (a.son || []).map(function (x) { return h('li', null, [h('span', { metin: x.bas + ' · ' + x.hat }), h('span', { metin: x.alarm + ' · ' + say(x.dk) + ' dk · ' + x.vardiya })]); }));
    return h('div', null, [v, l, h('p', { sinif: 'me-soluk', metin: 'Son 24 saat, ' + say(a.toplam) + ' alarm; kişi adı yok.' })]);
  }

  function tahminBolum(t) {
    var s = (t || []).filter(function (x) { return x.tahmin != null; });
    if (!s.length) return bekleniyor('Gün sonu tahmini');
    var og = s.map(function (x) { return { e: 'Hat ' + x.hat, d: x.tahmin, alt: x.gun_hedef ? 'hedef ' + say(x.gun_hedef) : '', etiketDeger: say(x.tahmin) + ' (tahmin)', renk: 'var(--tahmin)' }; });
    return h('div', null, [G.yatay(og, {}), h('p', { sinif: 'me-soluk', metin: 'Tahmin: bugünkü üretim + bugünkü ortalama hız × kalan planlı süre. Ölçüm değildir.' })]);
  }

  MM.makineEk = function (ust) {
    var kok = h('section', { sinif: 'me-ek', 'aria-label': 'Makineler eki' }), durum = { canli: [] };
    ust.appendChild(kok);
    var canli_ = true, tmr = null, sayacTmr = null, yukleniyor = false, sonEk = 0;
    var azHareket = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function kart(baslik, alt, govde) { return G.kart({ baslik: baslik, alt: alt, govde: govde }); }
    var canliKutu = h('div', { sinif: 'me-canli' }), digerKok = h('div', { sinif: 'me-ek' }), ekYuklendi = false;
    kok.appendChild(h('h2', { sinif: 'me-ek-baslik', metin: 'Canlı ek bilgiler' }));
    kok.appendChild(kart('Hat adedi (canlı tahmini)', 'Son gerçek adet + adet/dk; her dakika gerçek veriyle düzelir', canliKutu));
    kok.appendChild(digerKok);
    function ciz(d) {   
      digerKok.textContent = '';
      digerKok.appendChild(kart('Duruş nedenleri', 'Vardiya bazlı Pareto', paretoBolum(d.pareto)));
      digerKok.appendChild(kart('Vardiya zaman şeridi', null, seritBolum(d.serit)));
      digerKok.appendChild(kart('OEE kırılımı', null, oeeBolum(d.oee)));
      digerKok.appendChild(kart('Alarm geçmişi', 'Son 24 saat · vardiya', alarmBolum(d.alarm_24s)));
      digerKok.appendChild(kart('Gün sonu tahmini', 'tahmin', tahminBolum(d.tahmin)));
    }
    function sayacAdim() {
      var simdi = Date.now();
      durum.canli.forEach(function (o) {
        var s = adimSonuc(o, simdi);
        if (s.eskidi) {   
          o.artar = false; o.k.className = 'me-canli-kutu dur'; o.alt.textContent = 'veri gecikmeli · artmıyor';
          var et = o.k.querySelector('.me-etiket'); if (et) et.textContent = 'veri gecikmeli'; else o.k.appendChild(h('span', { sinif: 'me-etiket', metin: 'veri gecikmeli' }));
        }
        if (s.deger != null) o.sayi.textContent = say(s.deger);
      });
    }
    async function yukleCanli() {   
      var r = await window.MMVeri.oku('fabrika', 'pano-uygulama'), v = r.veri || {}, p = typeof v.html === 'string' ? panoVerisi(v.html) : null;
      if (p && p.hatlar && p.hatlar.length) { canliCiz(canliKutu, canliListe(p), Date.parse(p.asof) || Date.parse(v.uretildi || v.asof) || 0, durum); return true; }
      return false;
    }
    async function yukle() {
      if (yukleniyor || !canli_) return; yukleniyor = true;
      try {
        var tamam = false;
        try { tamam = await yukleCanli(); } catch (e) { tamam = false; }
        var simdi = Date.now();
        if (!canli_) return;
        if (!tamam || !ekYuklendi || simdi - sonEk > EK_MS) {   
          try {
            var r = await window.MMVeri.oku('fabrika', 'makine-ek'), d = r.veri || {};
            if (!canli_) return;
            ciz(d); ekYuklendi = true; sonEk = simdi;
            if (!tamam) canliCiz(canliKutu, d.canli || [], Date.parse(d.asof) || 0, durum);
          } catch (e) { if (!digerKok.firstChild) digerKok.appendChild(bekleniyor('Makine eki')); }
        }
      } finally { yukleniyor = false; }
    }
    yukle();
    tmr = setInterval(function () { if (!document.hidden) yukle(); }, YENILE_MS);
    function temizle() { canli_ = false; clearInterval(tmr); clearInterval(sayacTmr); }
     
    sayacTmr = setInterval(function () { if (!kok.isConnected) { temizle(); return; } if (!document.hidden) sayacAdim(); }, azHareket ? 10000 : 1000);
    return temizle;
  };
})();
