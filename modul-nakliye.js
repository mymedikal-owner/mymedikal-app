


(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var ESKI_DK = 6 * 60; 
  function bugunSeri() {
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-');
    return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5;
  }
  function seri(iso) { var p = iso.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
  function tarihTR(iso) { if (!iso) return 'kayıtlı değil'; var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  var STIL = {
    gecikmis: { ad: 'Gecikmiş', isaret: 'var(--kritik)', yazi: 'var(--kirmizi)', zemin: 'var(--kirmizi-zemin)', ikon: 'uyari' },
    bekliyor: { ad: 'Çıkış bekliyor', isaret: 'var(--uyari)', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)', ikon: 'saat' },
    cikti: { ad: 'Çıkış yapıldı', isaret: 'var(--iyi)', yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)', ikon: 'tik' }
  };
  function hazirla(v) {
    var bu = bugunSeri();
    return (v.kayitlar || []).map(function (k, i) {
      var kv = k.cikis ? 'cikti' : (k.plan && seri(k.plan) < bu ? 'gecikmis' : 'bekliyor');
      return { k: k, i: i, kova: kv, gec: kv === 'gecikmis' ? Math.round(bu - seri(k.plan)) : 0 };
    });
  }
  function ozet(v) {
    var l = hazirla(v), bu = bugunSeri(), s = { toplam: 0, ic: 0, my: 0, day: 0, gecikmis: 0, bekliyor: 0, cikti: 0, bugun: 0, hafta: 0, liste: l };
    l.forEach(function (x) {
      if (x.k.ic) { s.ic++; return; } 
      s.toplam++; if (x.k.sirket === 'MY') s.my++; else if (x.k.sirket === 'DAY') s.day++;
      s[x.kova]++;
      if (x.k.cikis) { var d = bu - seri(x.k.cikis); if (d === 0) s.bugun++; if (d >= 0 && d < 7) s.hafta++; }
    });
    return s;
  }
  MM.nakliye = { hazirla: hazirla, ozet: ozet };

  function rozet(kv) { var st = STIL[kv]; return h('span', { sinif: 'tq-rozet', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 13), st.ad]); }
  var T = function (k) { return MM.t ? MM.t(k) : k; };
  var VB = 'Veri bekleniyor';
  function z2(n) { return (n < 10 ? '0' : '') + n; }
  function veriSatiri(asof) {
    var d = asof ? new Date(asof) : null, ok = d && !isNaN(d.getTime());
    var m = ok ? z2(d.getDate()) + '.' + z2(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + z2(d.getHours()) + ':' + z2(d.getMinutes()) : null;
    return h('div', { sinif: 'tq-veri-satir', metin: ok ? T('Veri') + ': ' + m + ' ' + T('itibarıyla') : T('Veri') + ': ' + T('zamanı bilinmiyor') });
  }
  function kisaTarih(iso) { var p = iso.split('-'); return p[2] + '.' + p[1]; }
   
  function cizgi(x) {
    var k = x.k, st = STIL[x.kova], son = k.cikis ? h('span', { sinif: 'ns-nokta dolu', style: 'background:' + st.isaret }) : h('span', { sinif: 'ns-nokta bos', style: 'border-color:' + st.isaret });
    return h('span', { sinif: 'ns-cizgi', 'aria-label': T('Plan') + ' ' + tarihTR(k.plan) + (k.cikis ? ' → ' + T('Çıkış') + ' ' + tarihTR(k.cikis) : ' → ' + T('çıkış yok')) }, [
      h('span', { sinif: 'ns-etiket', metin: k.plan ? kisaTarih(k.plan) : '—' }), h('span', { sinif: 'ns-nokta dolu', style: 'background:var(--gri)' }),
      h('span', { sinif: 'ns-hat', style: 'background:' + st.isaret }), son,
      h('span', { sinif: 'ns-etiket', metin: k.cikis ? kisaTarih(k.cikis) : T('çıkış yok') })]);
  }
  function kart(x) {
    var k = x.k, st = STIL[x.kova];
    return h('div', { sinif: 'tq-kart', style: '--isaret:' + st.isaret }, [
      h('span', { sinif: 'tq-kart-ikon', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 20)]),
      h('span', { sinif: 'tq-kart-metin' }, [h('span', { sinif: 'tq-kart-ad', metin: k.musteri || 'Müşteri bilinmiyor' }), h('span', { sinif: 'tq-kart-alt', metin: 'Teslimat ' + k.no + (k.tur === 'Z004' ? ' · DMO' : '') + (k.ic ? ' · Şirket içi (DAY)' : (k.sirket === 'MY' || k.sirket === 'DAY' ? ' · ' + k.sirket : '')) }), cizgi(x)]),
      h('span', { sinif: 'tq-kart-sag' }, [rozet(x.kova),
        h('span', { metin: k.cikis ? 'Çıkış ' + tarihTR(k.cikis) : 'Plan ' + tarihTR(k.plan) + (x.gec ? ' · ' + x.gec + ' gün geçti' : '') })])
    ]);
  }

  MM.moduller.nakliye = function (kok) {
    var yuk = null, hata = null, canli = true, durum = '', musteri = '', sirket = '', zaman = '';
    kok.appendChild(G.sayfaBasi({ baslik: 'Nakliye', alt: 'Yurtiçi sevkiyatlar: çıkış durumu ve gecikmeler', kirinti: [['Nakliye']] }));
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Nakliye alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri, dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK, o = ozet(v);
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (eski) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — sevkiyat listesi ' + MM.yasMetin(dk) + ' güncellendi.']));
      ust.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: MM.yasMetin(dk) + ' güncellendi' }), h('span', { sinif: 'kaynak-etiket', metin: yuk.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]));
      ust.appendChild(veriSatiri(v.asof));
      if (!o.toplam) { govde.appendChild(G.bos({ baslik: 'Kayıt yok', metin: 'Listede sevkiyat yok.' })); return; }
      var kp = h('div', { sinif: 'kpi-izgara tq-kpi' });
      
      function sy(n) { return eski ? '—' : String(n); }
      function al(t) { return eski ? 'veri eski — sayı gösterilmiyor' : t; }
      kp.appendChild(G.kpi({ baslik: 'Bugün çıkan', deger: sy(o.bugun), birim: eski ? '' : 'teslimat', ikon: 'tik', alt: al('fiili çıkış tarihi bugün') }));
      kp.appendChild(G.kpi({ baslik: 'Son 7 gün çıkan', deger: sy(o.hafta), birim: eski ? '' : 'teslimat', ikon: 'tik', alt: al('bugün dahil 7 gün') }));
      kp.appendChild(G.kpi({ baslik: 'Çıkış bekliyor', deger: sy(o.bekliyor), birim: eski ? '' : 'teslimat', ikon: 'saat', alt: al('plan tarihi geçmemiş'), tikla: function () { durum = durum === 'bekliyor' ? '' : 'bekliyor'; ciz(); } }));
      kp.appendChild(G.kpi({ baslik: 'Gecikmiş', deger: sy(o.gecikmis), birim: eski ? '' : 'teslimat', durum: !eski && o.gecikmis ? 'kritik' : null, ikon: 'uyari', alt: al('çıkışsız, planlanan çıkış tarihi geçti'), tikla: function () { durum = durum === 'gecikmis' ? '' : 'gecikmis'; ciz(); } }));
      govde.appendChild(kp);
       
      if (!eski) {
        var bu7 = bugunSeri(), say7 = [0, 0, 0, 0, 0, 0, 0];
        o.liste.forEach(function (x) { if (x.k.ic || !x.k.cikis || (sirket && x.k.sirket !== sirket)) return; var d = bu7 - seri(x.k.cikis); if (d >= 0 && d < 7) say7[6 - d]++; });
        var oge7 = say7.map(function (n, i) { var iso = new Date((bu7 - (6 - i)) * 864e5).toISOString().slice(0, 10); return { e: kisaTarih(iso), d: n, renk: 'var(--vurgu)', ipucu: [tarihTR(iso) + ': ' + n + ' ' + T('çıkış'), ''] }; });
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: T('Son 7 gün çıkış'), alt: T('Günlük fiili çıkış yapılan teslimat') + (sirket ? ' · ' + sirket : ' · MY + DAY'), govde: G.cubuk(oge7, { yukseklik: 170, ad: T('Son 7 gün çıkış') }),
          tablo: { kolonlar: [T('Gün'), T('Çıkış')], satirlar: oge7.map(function (x) { return [x.e, x.d]; }) } })]));
      }
      var cp = [['', 'Tümü', o.toplam]];
      ['gecikmis', 'bekliyor', 'cikti'].forEach(function (b) { if (o[b]) cp.push([b, STIL[b].ad, o[b]]); });
      if (o.ic) cp.push(['ic', 'Şirket içi (DAY)', o.ic]);
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler(cp, durum, function (d) { durum = d; ciz(); }, 'Durum filtresi')]));
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'MY + DAY', o.toplam], ['MY', 'MY', o.my], ['DAY', 'DAY', o.day]], sirket, function (d) { sirket = d; ciz(); }, 'Şirket filtresi')]));
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', T('Tüm günler')], ['bugun', T('Bugün')], ['hafta', T('Bu hafta')]], zaman, function (d) { zaman = d; ciz(); }, T('Zaman filtresi'))]));
      var ad = {}; o.liste.forEach(function (x) { if (x.k.musteri) ad[x.k.musteri] = 1; });
      var sel = h('select', { 'aria-label': 'Müşteri / hastane filtresi', sinif: 'ust-bosluk', style: 'max-width:100%', onchange: function (e) { musteri = e.target.value; ciz(); } },
        [h('option', { value: '', metin: 'Tüm müşteriler / hastaneler' })].concat(Object.keys(ad).sort().map(function (a) { var op = h('option', { value: a, metin: a }); if (a === musteri) op.selected = true; return op; })));
      govde.appendChild(sel);
      var rank = { gecikmis: 0, bekliyor: 1, cikti: 2 };
      var liste = o.liste.filter(function (x) {
        if (durum === 'ic') return !!x.k.ic && (!musteri || x.k.musteri === musteri);
        return !x.k.ic && (!durum || x.kova === durum) && (!sirket || x.k.sirket === sirket) && (!musteri || x.k.musteri === musteri);
      })
        .sort(function (a, b) { return rank[a.kova] - rank[b.kova] || b.gec - a.gec || (b.k.olusturma > a.k.olusturma ? 1 : -1); });
       
      var buGun = bugunSeri();
      function zamanUyar(x) {
        if (!zaman || x.kova === 'gecikmis') return true;
        var r = x.k.cikis || x.k.plan; if (!r) return false; var d = seri(r) - buGun;
        return zaman === 'bugun' ? d === 0 : (d >= -6 && d <= 6);
      }
      liste = liste.filter(zamanUyar);
      var gec = liste.filter(function (x) { return x.kova === 'gecikmis'; }).sort(function (a, b) { return b.gec - a.gec; });
      var digeri = durum === 'gecikmis' ? [] : liste.filter(function (x) { return x.kova !== 'gecikmis'; });
      if (gec.length) {
        var gk = h('div', { sinif: 'tq-liste' }); gk.appendChild(G.sayfali(gec, kart, { n: 10 }));
        govde.appendChild(h('section', { sinif: 'ns-gecikmis ust-bosluk', 'aria-label': T('Gecikmiş sevkiyatlar') }, [h('h3', { sinif: 'bolum' }, [G.ikon('uyari', 18), ' ' + T('Gecikmiş sevkiyatlar') + ' (' + gec.length + ')']),
          h('p', { sinif: 'kucuk soluk', metin: T('En çok geciken en üstte.') }), gk]));
      }
       
      var gruplar = {}, sirali = [];
      digeri.forEach(function (x) { var a = x.k.musteri || 'Müşteri bilinmiyor'; if (!gruplar[a]) { gruplar[a] = []; sirali.push(a); } gruplar[a].push(x); });
      sirali.sort(function (a, b) { return gruplar[b].length - gruplar[a].length || (a < b ? -1 : 1); });
      var kap = h('div', { sinif: 'ns-gruplar' });
      if (sirali.length) kap.appendChild(G.sayfali(sirali, function (a) {
        var l = gruplar[a], ic = h('div', { sinif: 'tq-liste' }); l.forEach(function (x) { ic.appendChild(kart(x)); });
        return h('section', { sinif: 'ns-grup', 'aria-label': a }, [h('h4', { sinif: 'ns-grup-ad' }, [a, h('span', { sinif: 'cip-sayi', metin: String(l.length) })]), ic]);
      }, { n: 8 }));
      else if (!gec.length) kap.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu filtrede sevkiyat yok.' }));
      govde.appendChild(kap);
       
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('nakliye', 'nakliye').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  };
})();
