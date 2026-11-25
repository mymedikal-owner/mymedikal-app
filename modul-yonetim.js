


(function () {
  'use strict';
  var MM = window.MM, gr = MM.gr, h = MM.h, sayi = MM.sayi;
  function kart(baslik, alt, govde, ayr, tablo) { return gr.kart({ baslik: baslik, alt: alt, govde: govde, tablo: tablo, eylem: ayr ? h('a', { href: ayr[1], sinif: 'mini-dugme', 'aria-label': baslik + ' — ' + ayr[0] }, [ayr[0], gr.ikon('sag', 16)]) : null }); }

  function uretim(oz) {
    var kk = MM.ozet.kompresKarsilastir(oz.fab); if (!kk) return null;
    var son = kk.l.slice(-14), e = MM.anaKpi.gunEt;
    var cub = gr.cubuk(son.map(function (x) { var top = x.o + x.t; return { e: e(x.g), d: top, tahmin: x.t > 0 && x.o === 0, renk: 'var(--s1)', ipucu: [sayi(top) + ' kompres', e(x.g) + (x.t ? ' · içinde ' + sayi(x.t) + ' tahmin (ölçüm değil)' : ' · makine ölçümü')] }; }), { ad: 'Son 14 tam gün kompres toplamı', yukseklik: window.innerWidth < 600 ? 110 : 200 });
    var kap = h('div', null, [cub, gr.lejant([['makine ölçümü', 'var(--s1)'], ['tahmin içeren gün (ölçüm değil)', 'var(--tahmin)', 'tx']])]);
    return kart('Kompres üretimi — son ' + son.length + ' tam gün', 'Hat toplamı; devam eden gün karşılaştırmaya girmez', kap, ['Makineler', '#makineler'],
      { kolonlar: ['Gün', 'Kompres', 'Not'], satirlar: son.map(function (x) { return [e(x.g), sayi(x.o + x.t), x.t ? 'tahmin payı ' + sayi(x.t) : 'ölçüm']; }) });
  }
  function eldiven(oz) {
    if (!oz.eld) return null; var hf = [0, 0, 0, 0, 0, 0, 0, 0], sayilar = { yolda: 0, liman: 0, late: 0, bekleyen: 0, gelen: 0 };
    oz.eld.hz.liste.forEach(function (x) {
      if (x.d.grup === 'yolda' && x.d.kalan != null) hf[Math.min(7, Math.max(0, Math.ceil(x.d.kalan / 7) - 1))]++;
      if (x.d.ds === 'late') sayilar.late++; else if (x.d.grup === 'yolda') sayilar.yolda++; else if (x.d.grup === 'liman') sayilar.liman++; else if (x.d.grup === 'gelen' || x.d.grup === 'teslim') sayilar.gelen++; else sayilar.bekleyen++;
    });
    var et = ['Bu hf'].concat([1, 2, 3, 4, 5, 6, 7].map(function (i) { return '+' + i + ' hf'; }));
    var kap = h('div', null, [gr.cubuk(hf.map(function (n, i) { return { e: et[i], d: n, ipucu: [n + ' konteyner', i === 0 ? 'önümüzdeki 7 gün içinde varış' : 'varış: ' + i + '–' + (i + 1) + '. hafta (liste verisi, tahmini ETA)'] }; }), { yukseklik: window.innerWidth < 600 ? 100 : 150, ad: 'Haftalık varış' }),
      gr.yatay([{ e: 'Yolda', d: sayilar.yolda, renk: 'var(--s1)', tikla: function () { MM.git('?esekme=yolda#eldiven'); } }, { e: 'Limanda / antrepoda', d: sayilar.liman, renk: 'var(--uyari)', tikla: function () { MM.git('?esekme=liman#eldiven'); } },
        { e: 'Serbest süresi dolan', d: sayilar.late, renk: 'var(--kritik)', tikla: function () { MM.git('?esekme=liman#eldiven'); } }, { e: 'Bekleyen / hold', d: sayilar.bekleyen, renk: 'var(--gri)', tikla: function () { MM.git('?esekme=bekleyen#eldiven'); } }, { e: 'İthal / teslim', d: sayilar.gelen, renk: 'var(--iyi)', tikla: function () { MM.git('?esekme=gelen#eldiven'); } }].filter(function (x) { return x.d > 0 || x.e === 'Yolda'; }), { birim: 'konteyner' })]);
    return kart('Eldiven — varışlar ve durum', 'Yoldaki konteynerlerin haftalık varışı; durum dağılımı', kap, ['Eldiven', '#eldiven'], { kolonlar: ['Dilim', 'Konteyner'], satirlar: hf.map(function (n, i) { return [et[i], n]; }) });
  }
  function siparis(oz) {
    if (!oz.sip) return null; var gec = (oz.sip.v.siparisler || []).filter(function (s) { return s.gecikme_gun; }), b = [0, 0, 0];
    gec.forEach(function (s) { b[s.gecikme_gun <= 7 ? 0 : (s.gecikme_gun <= 30 ? 1 : 2)]++; });
    var kap = h('div', null, [gr.yatay([{ e: '1–7 gün', d: b[0], renk: 'var(--uyari)', tikla: function () { MM.git('?ssekme=gecikmis#siparis'); } }, { e: '8–30 gün', d: b[1], renk: 'var(--ciddi)', tikla: function () { MM.git('?ssekme=gecikmis#siparis'); } }, { e: '30+ gün', d: b[2], renk: 'var(--kritik)', tikla: function () { MM.git('?ssekme=gecikmis#siparis'); } }], { birim: 'sipariş' }),
      oz.sip.o.kismi ? h('p', { sinif: 'kucuk soluk ust-bosluk', metin: sayi(oz.sip.o.bilinmeyenKalem) + ' kalemin teslim bilgisi yok' }) : null]);
    return kart('Siparişler — gecikme yaşlandırma', gec.length + ' geciken sipariş (istenen teslim tarihi geçmiş ve açık)', kap, ['Siparişler', '#siparis'], { kolonlar: ['Gecikme', 'Sipariş'], satirlar: [['1–7 gün', b[0]], ['8–30 gün', b[1]], ['30+ gün', b[2]]] });
  }
  function takvim(oz) {
    var gruplar = [['Kalite', 'kal', 'kalite'], ['İSG', 'isg', 'isg']].filter(function (c) { return oz[c[1]]; }); if (!gruplar.length) return null;
    var ad = { gecti: ['Süresi geçti', 'var(--kritik)'], k7: ['7 gün içinde', 'var(--ciddi)'], k30: ['30 gün içinde', 'var(--uyari)'], k90: ['90 gün içinde', 'var(--s4)'], ok: ['90 günden sonra', 'var(--iyi)'], bilinmiyor: ['Tarihi bilinmiyor', 'var(--gri)'] };
    var kap = h('div', { sinif: 'risk-grup' });
    gruplar.forEach(function (c) {
      var o = oz[c[1]].o; kap.appendChild(h('h4', { metin: c[0] + ' — ' + o.toplam + ' kayıt' }));
      kap.appendChild(gr.yatay(['gecti', 'k7', 'k30', 'k90', 'ok', 'bilinmiyor'].map(function (k) { return { e: ad[k][0], d: o[k], renk: ad[k][1], tikla: function () { MM.git('#' + c[2]); } }; }), { birim: 'belge', maks: o.toplam || 1 }));
    });
    return kart('Kalite / İSG — risk bantları', '', kap, ['Kalite', '#kalite']);
  }
  function yaklasan(oz) {
    var l = [];
    [['Kalite', 'kal', 'kalite'], ['İSG', 'isg', 'isg']].forEach(function (c) { var m = oz[c[1]]; if (m) m.o.liste.forEach(function (x) { if (x.gun != null && x.gun <= 90) l.push({ x: x, ad: c[0], m: c[2] }); }); });
    l.sort(function (a, b) { return a.x.gun - b.x.gun; });
    var kap = h('div', { sinif: 'tk-liste' });
    l.slice(0, 7).forEach(function (r) {
      var k = r.x.k, renk = MM.takvim.kova[r.x.kova][1];
      kap.appendChild(h('a', { href: r.x.i != null ? '#' + r.m + '/belge/' + r.x.i : '#' + r.m, sinif: 'tk-satir ' + renk + ' baglanti' }, [h('div', null, [h('div', { sinif: 'ad', metin: k.belge }), h('div', { sinif: 'alt', metin: r.ad + (k.kurulus ? ' · ' + k.kurulus : '') })]),
        h('div', { sinif: 'tk-sag' }, [h('b', { metin: r.x.gun < 0 ? Math.abs(r.x.gun) + ' gün geçti' : (r.x.gun === 0 ? 'bugün' : r.x.gun + ' gün') }), h('span', { metin: MM.takvim.tarihTR(k.son_tarih) + (k.yaklasik ? ' (yaklaşık)' : '') })])]));
    });
    if (!l.length) kap.appendChild(h('p', { sinif: 'veri-yok', metin: '90 gün içinde tarihi bilinen son tarih yok. (Tarihi bilinmeyen kayıtlar bu listede olmaz.)' }));
    return kart('Yaklaşan son tarihler', 'Kalite ve İSG, en yakın önce', kap, null);
  }
  function veriDurumu(oz) {
    var A = window.MM_AYAR, satir = [];
    function ekle(ad, v, esik, kaynakAd) { var dk = MM.yasDk(v && v.asof); satir.push({ ad: ad, yas: dk, esik: esik, kaynak: kaynakAd }); }
    if (oz.fab) ekle('Fabrika (makineler)', oz.fab.v, A.eskiDk || 15, oz.fab.r.kaynak);
    if (oz.eld) ekle('Eldiven haritası', oz.eld.v, 360, oz.eld.y.r.kaynak);
    if (oz.sip) ekle('Siparişler', oz.sip.v, 2160, oz.sip.y.r.kaynak);
    if (oz.kal) ekle('Kalite takvimi', oz.kal.v, 4320, oz.kal.r.kaynak);
    if (oz.isg) ekle('İSG takvimi', oz.isg.v, 4320, oz.isg.r.kaynak);
    var rows = satir.map(function (s) { return { ad: s.ad, yas: s.yas, durum: s.yas == null ? 'bilinmiyor' : (s.yas > s.esik ? 'eski' : 'güncel'), esik: s.esik, kaynak: s.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' }; });
    Object.keys(oz.hata).forEach(function (k) { rows.push({ ad: k, yas: null, durum: 'okunamadı', esik: null, kaynak: '—' }); });
    return kart('Veri durumu', 'Her rakamın ne kadar güncel olduğu', gr.tablo({ kolonlar: [{ ad: 'Kaynak', k: 'ad' }, { ad: 'Yaş', k: 'yas', tur: 'sayi', ciz: function (r) { return r.yas == null ? '—' : MM.yasMetin(r.yas); }, deger: function (r) { return r.yas; } },
      { ad: 'Durum', k: 'durum', ciz: function (r) { return h('span', { sinif: 'etiket ' + (r.durum === 'güncel' ? '' : 'kismi'), metin: r.durum }); } }, { ad: 'Kaynak', k: 'kaynak' }], satirlar: rows, sira: { k: 'yas', yon: 'asagi' } }), null);
  }

  function tazelikRozeti(oz) {
    var kay = [['fab', 15], ['eld', 360], ['sip', 2160], ['kal', 4320], ['isg', 4320]], en = null, eski = false;
    kay.forEach(function (c) {
      var m = oz[c[0]]; if (!m) return; var dk = MM.yasDk(m.v && m.v.asof), esik = c[0] === 'fab' ? (window.MM_AYAR.eskiDk || 15) : c[1], oran = dk == null ? Infinity : dk / esik;
      if (oran > 1) eski = true; if (!en || oran > en.oran) en = { oran: oran, asof: m.v && m.v.asof };
    });
    if (Object.keys(oz.hata).length) eski = true;
    var d = h('details', { sinif: 'yn-tazelik' }, [h('summary', null, [gr.tazelik(en ? en.asof : null, eski ? 'eski' : 'taze'), h('span', { sinif: 'kucuk soluk', metin: 'Veri kaynakları' })]), MM.kaynakSatiri(oz)]);
    return d;
  }

  MM.moduller.yonetim = function (kok) {
    var iptal = false;
    kok.appendChild(gr.sayfaBasi({ baslik: 'Yönetim paneli', alt: 'Operasyonel özet (finans verisi yok)', kirinti: [['Yönetim']] }));
    var govde = h('div', null, [gr.iskelet('kart', 6)]); kok.appendChild(govde);
    MM.ozet.yukle().then(function (oz) {
      if (iptal) return; govde.textContent = '';
      if (oz.fab && MM.anaKpi.ORNEK(oz.fab.v)) govde.appendChild(h('div', { sinif: 'bant ornek yn-ornek', role: 'alert', metin: 'ÖRNEK VERİ — fabrika rakamları gerçek değil' }));
      var dk = MM.dikkatSeridi(oz);
      Array.prototype.forEach.call(dk.querySelectorAll('.dikkat-kart'), function (a) { var t = (a.textContent || '').replace(/\s+/g, ' ').trim(); a.setAttribute('title', t); a.setAttribute('aria-label', t); });
      govde.appendChild(tazelikRozeti(oz)); govde.appendChild(dk);
      var kutular = []; ['hatlar', 'dokuma', 'alarm', 'eldiven', 'siparis', 'kalite', 'isg'].forEach(function (a) { var k = MM.anaKpi.yap(a, oz); if (k) kutular.push(k); });
      govde.appendChild(gr.ozetSerit(kutular, { en: 4 }));
      var sekmeler = { ozet: [uretim, eldiven], risk: [siparis, takvim, yaklasan], veri: [veriDurumu] }, secili = 'ozet';
      var alan = h('div', { sinif: 'iki-kolon ust-bosluk' });
      function ciz() {
        alan.textContent = '';
        sekmeler[secili].forEach(function (f) { var k = f(oz); if (k) alan.appendChild(k); });
      }
      govde.appendChild(gr.segment([['ozet', 'Özet'], ['risk', 'Yaklaşan son tarihler'], ['veri', 'Veri durumu']], secili, function (id) { secili = id; ciz(); }));
      govde.appendChild(alan); ciz();
      Object.keys(oz.hata).forEach(function (k) { govde.appendChild(h('div', { sinif: 'bant kirmizi', role: 'status' }, [h('strong', { metin: 'Bir bölümün verisi alınamadı' }), ' — ' + oz.hata[k].message])); });
    });
    return function () { iptal = true; };
  };
})();
