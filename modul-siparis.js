





(function () {
  'use strict';
  var MM = window.MM, h = MM.h, sayi = MM.sayi, G = MM.gr;
  var ESKI_DK = 36 * 60;   
  var DURUM_AD = { acik: 'Açık', gecikmis: 'Geciken', tamam: 'Tamamlandı', bilinmiyor: 'Durum bilinmiyor', blokeli: 'Blokeli', iade: 'İade', tumu: 'Tümü' };
  var VADE_YOK = { bilinmiyor: 'vade bilinmiyor', girilmemis: 'vade girilmemiş' };
  function vadeMetin(o, tr) { return o.vade_durum ? VADE_YOK[o.vade_durum] : tr(o.vade); }
  var KALEM_AD = { yok: 'Teslim yok', kismi: 'Kısmi teslim', tam: 'Teslim edildi', bilinmiyor: 'Durum bilinmiyor' };
  var YAS = [['a', '1–7 gün', 1, 7, 'var(--uyari)'], ['b', '8–30 gün', 8, 30, 'var(--ciddi)'], ['c', '30 günden fazla', 31, 1e9, 'var(--kritik)']];

  function tutarYetkisi() { if (window.MMVeri.mod() === 'graph') return window.MMVeri.ozelErisim('siparisler-yonetim'); return ((window.MM_AYAR.roller || {}).siparisTutar || ['yonetim']).indexOf(MM.rol()) >= 0; }
  async function yukle() {
    if (tutarYetkisi()) {
      try { return { r: await window.MMVeri.oku('siparisler', 'siparisler-yonetim', 'siparisler-yonetim'), tutar: true, uyari: null }; }
      catch (e) { var p = await window.MMVeri.oku('siparisler', 'siparisler-personel'); return { r: p, tutar: false, uyari: null }; }
    }
    return { r: await window.MMVeri.oku('siparisler', 'siparisler-personel'), tutar: false, uyari: null };
  }
  function tarihTR(iso) { if (!iso) return '—'; var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function adet(n, b) { var s = sayi(n); return s == null ? '—' : s + ' ' + (b === 'ADT' ? 'adet' : (b || '')); }
  function sinif(o) { return o.gecikme_gun ? 'gecikmis' : o.durum; }
  function ozet(v) {
    var s = v.siparisler || [], say = function (f) { return s.filter(f).length; };
    return { acik: say(function (o) { return o.durum === 'acik'; }), gecikmis: say(function (o) { return !!o.gecikme_gun; }),
      bilinmiyor: say(function (o) { return o.durum === 'bilinmiyor'; }), blokeli: say(function (o) { return o.durum === 'blokeli'; }), tamam: say(function (o) { return o.durum === 'tamam'; }),
      kismi: !!(v.kapsam && v.kapsam.kismi), bilinmeyenKalem: v.kapsam ? v.kapsam.kalem_durumu_bilinmeyen : null, kalemToplam: v.kapsam ? v.kapsam.kalem_toplam : null };
  }
  MM.siparis = { yukle: yukle, ozet: ozet };
  function bugunISO() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  function rozet(o) { return h('span', { sinif: 'sp-rozet ' + sinif(o), metin: o.gecikme_gun ? 'Geciken ' + o.gecikme_gun + ' gün' : DURUM_AD[o.durum] }); }

  MM.moduller.siparis = function (kok) {
    var qs = new URLSearchParams(location.search), yol = MM.yol();
    var secili = qs.get('ssekme') || 'acik', sirket = '', tur = '', yas = '', kanit = '', q = '', gor = 'liste', yuk = null, hata = null, canli = true;
    var detayNo = yol[0] === 'siparis' && yol[1] ? yol[1] : ((qs.get('ac') || '').split(',')[0] || null);
    var ustKap = h('div'), govde = h('div', { 'aria-live': 'polite' });
    var musMod = yol[0] === 'musteriler', musKok = h('div'), musTemiz = null;
    kok.appendChild(ustKap); kok.appendChild(govde);

    function uygun(o, yoksay) {
      if (yoksay !== 'sirket' && sirket) { if (sirket === 'DIGER' ? (o.sirket === 'MY' || o.sirket === 'DAY') : o.sirket !== sirket) return false; }
      if (yoksay !== 'tur' && tur === 'OZEL') { if (o.tur_ad === 'DMO') return false; }    
      else if (yoksay !== 'tur' && tur) { if (tur === 'DIGER' ? !!o.tur_ad && o.tur_ad !== 'DMO' && o.tur_ad !== 'Özel müşteri' : (o.tur_ad || '') !== tur) return false; }
      if (yoksay === 'grup') return true;    
      if (!q) {    
        if (secili === 'acik' && o.durum !== 'acik') return false;
        if (secili === 'gecikmis' && !o.gecikme_gun) return false;
        if (secili === 'bilinmiyor' && o.durum !== 'bilinmiyor') return false;   
        if (secili === 'iade') return false;   
        if (secili === 'tamam' && o.durum !== 'tamam') return false;
        if (secili === 'blokeli' && o.durum !== 'blokeli') return false;
      }
      if (kanit === 'irs' && !o.irsaliye.length) return false;   
      if (kanit === 'fat' && !o.fatura_no.length) return false;   
      if (yas) { var b = YAS.filter(function (y) { return y[0] === yas; })[0]; if (!o.gecikme_gun || o.gecikme_gun < b[2] || o.gecikme_gun > b[3]) return false; }
      if (q) {
        var m = o._ara || (o._ara = [o.no, o.yk, o.musteri, o.teslim_alan].concat(o.irsaliye, o.fatura_no, o.kalemler.map(function (k) { return k.malzeme + ' ' + k.tanim; })).join(' ').toLocaleLowerCase('tr'));   
        return MM.aramaNorm(m).indexOf(MM.aramaNorm(q)) >= 0;   
      }
      return true;
    }

     
    function bantlar(v, kisa) {
      var dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK, f = document.createDocumentFragment();
      if (v.ornek === true) f.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — tutarlar gerçek değil' }));
      if (eski) f.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '.']));
      if (v.kapsam && v.kapsam.kismi && v.kapsam.kalem_durumu_bilinmeyen) f.appendChild(h('p', { sinif: 'kucuk soluk', metin: v.kapsam.kalem_durumu_bilinmeyen + ' kalemin durumu henüz yok' }));
      f.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: MM.yasMetin(dk) + ' güncellendi' + (v.asof ? ' (' + MM.saat(new Date(v.asof)) + ' TR)' : '') }), h('span', { sinif: 'kaynak-etiket', metin: yuk.r.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]));
      return f;
    }

     
    function kpiSeridi(v) {
      var o = ozet(v), k = h('div', { sinif: 'kpi-izgara sp-kpi' });
      function kutu(id, baslik, n, ikn, durum, alt) {
        k.appendChild(G.kpi({ baslik: baslik, deger: n == null ? 'veri yok' : String(n), birim: n == null ? '' : 'sipariş', ikon: ikn, durum: durum, alt: alt, tikla: function () { secili = id; yas = ''; ciz(); } }));
      }
      kutu('acik', 'Açık', o.acik, 'siparis', null, 'kayıtlı kanıtla açık');
      kutu('gecikmis', 'Geciken', o.gecikmis, 'uyari', o.gecikmis ? 'kritik' : null, 'istenen teslim geçmiş');
      kutu('blokeli', 'Blokeli', o.blokeli, 'uyari', o.blokeli ? 'uyari' : null, 'teslimat blokajı var');
      kutu('tamam', 'Tamamlanan', o.tamam, 'tik', null, 'tam teslim kanıtlı');
      kutu('iade', 'İade', null, 'bilgi', 'yok', 'iade verisi henüz yok — "iade yok" demek değil');   
      kutu('bilinmiyor', 'Durum bilinmiyor', o.bilinmiyor, 'bilgi', null, 'kayıtlı kanıt yok; iade sayılmaz');
      return k;
    }

     
    function huni(v) {
      var s = v.siparisler, n = s.length, ir = s.filter(function (o) { return o.irsaliye.length; }).length, fa = s.filter(function (o) { return o.fatura_no.length; }).length;
      var sn = { gecikmis: 0, acik: 0, tamam: 0, bilinmiyor: 0, blokeli: 0 }; s.forEach(function (o) { sn[sinif(o)]++; });
      var kal = { tam: 0, kismi: 0, yok: 0, bilinmiyor: 0 }, kt = 0; s.forEach(function (o) { o.kalemler.forEach(function (k) { kal[k.durum]++; kt++; }); });
      var pct = function (a, b) { return b ? ' (%' + Math.round(100 * a / b) + ')' : ''; };
      var kap = h('div', { sinif: 'sp-huni' });
      kap.appendChild(h('p', { sinif: 'sp-huni-bas', metin: 'Sipariş düzeyi — kayıtlı kanıt olan sipariş sayısı' }));
      var git = function (k) { return function () { secili = 'tumu'; yas = ''; kanit = kanit === k ? '' : k; ciz(); window.scrollTo(0, 0); }; };   
      kap.appendChild(G.yatay([
        { e: 'Siparişler', d: n, etiketDeger: sayi(n), renk: 'var(--s1)', ipucu: [n + ' sipariş', 'Dokunun: tüm listeyi göster'], tikla: git('') },
        { e: 'İrsaliye / teslimat kaydı olan', d: ir, etiketDeger: sayi(ir) + pct(ir, n), renk: 'var(--sk4)', ipucu: [ir + ' sipariş', 'Dokunun: yalnız teslimat kaydı olanlar'], tikla: git('irs') },
        { e: 'Fatura kaydı olan', d: fa, etiketDeger: sayi(fa) + pct(fa, n), renk: 'var(--sk6)', ipucu: [fa + ' sipariş', 'Dokunun: yalnız fatura kaydı olanlar'], tikla: git('fat') }], { maks: n }));
      function yigin(ogeler, toplam, ad) {
        var b = h('div', { sinif: 'sp-yigin', role: 'img', 'aria-label': ad + ': ' + ogeler.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') });
        ogeler.forEach(function (x) { if (x[1]) b.appendChild(h('i', { style: 'flex:' + Math.max(x[1], toplam * 0.006) + ' 1 0;background:' + x[2], title: x[0] + ': ' + sayi(x[1]) })); });
        return b;
      }
      var segS = [['Geciken', sn.gecikmis, 'var(--kritik)'], ['Açık (zamanında)', sn.acik, 'var(--s1)'], ['Blokeli', sn.blokeli, 'var(--uyari)'], ['Tamamlandı', sn.tamam, 'var(--iyi)'], ['Durum bilinmiyor', sn.bilinmiyor, 'var(--eksen)']];
      kap.appendChild(h('p', { sinif: 'sp-huni-bas', metin: 'Durum dağılımı (sipariş)' })); kap.appendChild(yigin(segS, n, 'Sipariş durumu'));
      kap.appendChild(G.lejant(segS.map(function (x) { return [x[0] + ' ' + sayi(x[1]), x[2]]; })));
      var segK = [['Teslim edildi', kal.tam, 'var(--iyi)'], ['Kısmi', kal.kismi, 'var(--uyari)'], ['Teslim yok', kal.yok, 'var(--s1)'], ['Durum bilinmiyor', kal.bilinmiyor, 'var(--eksen)']];
      kap.appendChild(h('p', { sinif: 'sp-huni-bas', metin: 'Kalem düzeyi — ' + sayi(kt) + ' kalem' })); kap.appendChild(yigin(segK, kt, 'Kalem durumu'));
      kap.appendChild(G.lejant(segK.map(function (x) { return [x[0] + ' ' + sayi(x[1]), x[2]]; })));
      return G.kart({ baslik: 'Sipariş hunisi', alt: 'Açık → teslim → fatura: yalnız kayıtlı kanıt sayılır', govde: kap,
        tablo: { kolonlar: ['Ölçü', 'Adet'], satirlar: [['Sipariş', n], ['İrsaliye kaydı olan', ir], ['Fatura kaydı olan', fa], ['Geciken', sn.gecikmis], ['Açık (zamanında)', sn.acik], ['Tamamlandı', sn.tamam], ['Durum bilinmiyor', sn.bilinmiyor], ['Kalem: teslim edildi', kal.tam], ['Kalem: kısmi', kal.kismi], ['Kalem: teslim yok', kal.yok], ['Kalem: bilinmiyor', kal.bilinmiyor]] },
        dip: 'Durumu bilinmeyen siparişler ayrı dilimdir ("Durum bilinmiyor"); "teslim edildi" ya da 0 sayılmaz.' });
    }

     
    function yaslandir(v) {
      var g = v.siparisler.filter(function (o) { return o.gecikme_gun; });
      var og = YAS.map(function (y) {
        var n = g.filter(function (o) { return o.gecikme_gun >= y[2] && o.gecikme_gun <= y[3]; }).length;
        return { e: y[1], d: n, renk: y[4], etiketDeger: sayi(n) + ' sipariş', ipucu: [n + ' sipariş', y[1] + ' gecikmiş — dokunun: listeyi filtrele'], tikla: function () { secili = 'gecikmis'; yas = yas === y[0] ? '' : y[0]; ciz(); } };
      });
      var gov = g.length ? G.yatay(og, { maks: Math.max.apply(null, og.map(function (x) { return x.d; }).concat([1])) }) : h('p', { sinif: 'veri-yok', metin: 'Geciken sipariş yok.' });
      return G.kart({ baslik: 'Gecikme yaşlandırma', alt: g.length + ' geciken sipariş · bir çubuğa dokununca liste filtrelenir', govde: gov,
        tablo: { kolonlar: ['Gecikme', 'Sipariş'], satirlar: og.map(function (x) { return [x.e, x.d]; }) }, dip: 'Gün sayısı kaynaktaki gecikme_gun alanıdır (istenen teslimden bugüne).' });
    }

     
    function son45(v) {
      var bugun = Date.parse(bugunISO() + 'T00:00:00Z'), gunler = [], harita = {};
      v.siparisler.forEach(function (o) { harita[o.tarih] = (harita[o.tarih] || 0) + 1; });
      var top = 0;
      for (var i = 44; i >= 0; i--) { var t = new Date(bugun - i * 864e5).toISOString().slice(0, 10), n = harita[t] || 0; top += n; gunler.push({ e: t.slice(8, 10) + '.' + t.slice(5, 7), d: n, ipucu: [n + ' sipariş', tarihTR(t) + ' tarihinde açıldı'] }); }
      var kap = h('div');
      kap.appendChild(G.cubuk(gunler, { yukseklik: 150, ad: 'Son 45 günde açılan siparişler' }));
      return G.kart({ baslik: 'Son 45 günde açılan siparişler', alt: sayi(top) + ' sipariş', govde: kap,
        tablo: { kolonlar: ['Gün', 'Açılan sipariş'], satirlar: gunler.filter(function (x) { return x.d; }).map(function (x) { return [x.e, x.d]; }) } });
    }

     
    function secimler(v, vg) {
      var f = h('div', { sinif: 'sp-filtre' });
      var o = ozet(vg || v);
      var sec = [['acik', 'Açık', o.acik], ['blokeli', 'Blokeli', o.blokeli], ['gecikmis', 'Geciken', o.gecikmis], ['tamam', 'Tamamlanan', o.tamam], ['iade', 'İade', null], ['bilinmiyor', 'Durum bilinmiyor', o.bilinmiyor], ['tumu', 'Tümü', (vg || v).siparisler.length]];
       
      var say0 = function (fn, yoksay) { return v.siparisler.filter(function (x) { return uygun(x, yoksay) && fn(x); }).length; };
      var ustF = h('div', { sinif: 'sp-filtre' });
      ustF.appendChild(G.cipler([['', 'MY + DAY', say0(function () { return true; }, 'sirket')], ['MY', 'MY', say0(function (x) { return x.sirket === 'MY'; }, 'sirket')], ['DAY', 'DAY', say0(function (x) { return x.sirket === 'DAY'; }, 'sirket')]], sirket === 'DIGER' ? '' : sirket, function (d) { sirket = d || ''; ciz(); }, 'Şirket'));
      ustF.appendChild(G.cipler([['', 'Özel + DMO', say0(function () { return true; }, 'tur')], ['DMO', 'DMO', say0(function (x) { return x.tur_ad === 'DMO'; }, 'tur')], ['OZEL', 'Özel (doğrudan temin dahil)', say0(function (x) { return x.tur_ad !== 'DMO'; }, 'tur')]], tur === 'OZEL' || tur === 'DMO' ? tur : '', function (d) { tur = d || ''; ciz(); }, 'Tür'));
      f.appendChild(ustF);
      f.appendChild(G.sekmeler(sec.map(function (c) { return [c[0], c[1], h('span', { sinif: 'cip-sayi', metin: c[0] === 'iade' ? 'veri yok' : String(c[2]) })]; }), secili, function (d) { secili = d; yas = ''; ciz(); }, { sinif: 'cip', ad: 'Durum', goster: 3 }));
      if (yas) f.appendChild(G.cipler([[yas, 'Gecikme: ' + YAS.filter(function (y) { return y[0] === yas; })[0][1] + ' ✕']], yas, function () { yas = ''; ciz(); }, 'Gecikme filtresi'));
      if (kanit) f.appendChild(G.cipler([[kanit, (kanit === 'irs' ? 'Teslimat kaydı olanlar' : 'Fatura kaydı olanlar') + ' ✕']], kanit, function () { kanit = ''; ciz(); }, 'Kayıt filtresi'));
      return f;
    }
     
    function gecikenIlk5(v) {
      var g = v.siparisler.filter(function (o) { return o.gecikme_gun; });
      if (!g.length) return null;
      function ilk5(anahtar) {
        var m = {};
        g.forEach(function (o) { var a = anahtar(o); if (!a) return; var x = m[a] || (m[a] = { ad: a, n: 0, en: 0 }); x.n++; if (o.gecikme_gun > x.en) x.en = o.gecikme_gun; });
        return Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return b.n - a.n || b.en - a.en; }).slice(0, 5);
      }
      function kutu(baslik, liste) {
        var tik = function (x) { return function () { secili = 'gecikmis'; yas = ''; kanit = ''; q = x.ad.toLocaleLowerCase('tr'); ciz(); window.scrollTo(0, 0); }; };
        var gov = liste.length ? G.yatay(liste.map(function (x) { return { e: x.ad, d: x.n, renk: 'var(--kritik)', etiketDeger: x.n + ' sipariş · en uzun ' + x.en + ' gün', ipucu: [x.n + ' geciken sipariş', 'En uzun ' + x.en + ' gün — dokunun: listeyi süz'], tikla: tik(x) }; }), { maks: liste[0].n }) : h('p', { sinif: 'veri-yok', metin: 'Veri yok.' });
        return G.kart({ baslik: baslik, alt: 'Geciken sipariş sayısına göre', govde: gov, tablo: { kolonlar: ['Ad', 'Geciken sipariş', 'En uzun gecikme (gün)'], satirlar: liste.map(function (x) { return [x.ad, x.n, x.en]; }) } });
      }
      return h('div', { sinif: 'sp-uclu ust-bosluk' }, [kutu('En çok geciken 5 müşteri', ilk5(function (o) { return o.musteri; })), kutu('En çok geciken 5 hastane / teslim yeri', ilk5(function (o) { return o.teslim_alan; }))]);
    }
     
    function turEtiket(o) {
      if (o.tur_ad === 'DMO') return o.yk ? o.yk : 'YK no yok';
      if (o.tur_ad === 'Özel müşteri') return 'Özel';
      return o.yk ? o.yk : '—';
    }
    function siparisTablosu(liste) {
      var kol = [
        { ad: 'Sipariş', k: 'no', ciz: function (o) { return h('a', { href: '#siparis/siparis/' + encodeURIComponent(o.no), sinif: 'sp-no', metin: o.no, onclick: function (e) { e.stopPropagation(); } }); } },
        { ad: 'YK no / Özel', k: 'turetiket', ciz: turEtiket, csv: turEtiket, deger: turEtiket },
        { ad: 'Durum', k: 'durum', deger: function (o) { return o.gecikme_gun ? 'a' + (1000 - o.gecikme_gun) : (o.durum === 'acik' ? 'b' : o.durum === 'tamam' ? 'c' : 'd'); }, ciz: rozet },
        { ad: 'Gecikme (gün)', k: 'gecikme', sag: true, deger: function (o) { return o.gecikme_gun || 0; }, ciz: function (o) { return o.gecikme_gun ? String(o.gecikme_gun) : '—'; } },
        { ad: 'Şirket', k: 'sirket', ciz: function (o) { return o.sirket || '—'; } },
        { ad: 'Tür', k: 'tur_ad', ciz: function (o) { return o.tur_ad || '—'; } },
        { ad: 'Teslim yeri / müşteri', k: 'teslim', deger: function (o) { return o.teslim_alan || o.musteri; }, ciz: function (o) { return h('span', { sinif: 'sp-hucre-metin', metin: o.teslim_alan || o.musteri }); } },
        { ad: 'Açıldı', k: 'tarih', ciz: function (o) { return tarihTR(o.tarih); } },
        { ad: 'İstenen teslim', k: 'vade', ciz: function (o) { return vadeMetin(o, tarihTR); } },
        { ad: 'Kalem', k: 'kalem', sag: true, deger: function (o) { return o.kalemler.length; }, ciz: function (o) { return o.kalemler.length + (o.bilinmeyen_kalem ? ' (' + o.bilinmeyen_kalem + '?)' : ''); } },
        { ad: 'İrsaliye', k: 'irs', sag: true, deger: function (o) { return o.irsaliye.length; }, ciz: function (o) { return o.irsaliye.length ? String(o.irsaliye.length) : 'kayıt yok'; } },
        { ad: 'Fatura', k: 'fat', sag: true, deger: function (o) { return o.fatura_no.length; }, ciz: function (o) { return o.fatura_no.length ? String(o.fatura_no.length) : 'kayıt yok'; } }];
      if (yuk.tutar) kol.push({ ad: 'Tutar (ÖRNEK)', k: 'tutar', sag: true, deger: function (o) { return o.tutar == null ? null : o.tutar; }, ciz: function (o) { return o.tutar == null ? '—' : sayi(o.tutar, 2) + ' ' + (o.para || ''); } });
      return G.tablo({ kolonlar: kol, satirlar: liste, sira: secili === 'gecikmis' ? { k: 'gecikme', yon: 'asagi' } : { k: 'tarih', yon: 'asagi' }, satirTikla: function (o) { location.hash = '#siparis/siparis/' + encodeURIComponent(o.no); }, satirSinif: function (o) { return o.gecikme_gun ? 'kirmizi' : ''; }, bos: 'Bu görünümde sipariş yok.' });
    }
    function grupTablosu(liste, anahtar, ad) {
      var m = {};
      liste.forEach(function (o) { var a = anahtar(o) || '(kayıtlı değil)'; var g = m[a] || (m[a] = { ad: a, n: 0, acik: 0, gec: 0, bil: 0, tam: 0, tutar: 0, tutarVar: false }); g.n++; var s = sinif(o); if (s === 'gecikmis') g.gec++; if (o.durum === 'acik') g.acik++; if (o.durum === 'bilinmiyor') g.bil++; if (o.durum === 'tamam') g.tam++; if (yuk.tutar && o.tutar != null) { g.tutar += o.tutar; g.tutarVar = true; } });
      var satir = Object.keys(m).map(function (k) { return m[k]; });
      var kol = [{ ad: ad, k: 'ad', ciz: function (g) { return h('span', { sinif: 'sp-hucre-metin', metin: g.ad }); } }, { ad: 'Sipariş', k: 'n', sag: true }, { ad: 'Açık', k: 'acik', sag: true }, { ad: 'Geciken', k: 'gec', sag: true }, { ad: 'Durum bilinmiyor', k: 'bil', sag: true }, { ad: 'Tamamlanan', k: 'tam', sag: true }];
      if (yuk.tutar) kol.push({ ad: 'Tutar (ÖRNEK)', k: 'tutar', sag: true, ciz: function (g) { return g.tutarVar ? sayi(g.tutar, 0) : '—'; } });
      return G.tablo({ kolonlar: kol, satirlar: satir, sira: { k: 'n', yon: 'asagi' }, satirTikla: function (g) { q = g.ad === '(kayıtlı değil)' ? '' : g.ad.toLocaleLowerCase('tr'); gor = 'liste'; ciz(); window.scrollTo(0, 0); }, satirSinif: function (g) { return g.gec ? 'kirmizi' : ''; } });
    }

     
    function adim(durum, ikn, baslik, metin, alt) {
      return h('li', { sinif: 'sp-adim ' + durum }, [h('span', { sinif: 'sp-adim-nokta' }, [G.ikon(ikn, 18)]), h('div', { sinif: 'sp-adim-icerik' }, [h('strong', { metin: baslik }), h('span', { sinif: 'sp-adim-metin', metin: metin }), alt ? h('span', { sinif: 'kucuk soluk', metin: alt }) : null])]);
    }
    function ayrinti(v, no) {
      var o = v.siparisler.filter(function (x) { return x.no === no; })[0], f = h('div');
      f.appendChild(G.sayfaBasi({ baslik: 'Sipariş ' + no, kirinti: [['Siparişler', '#siparis'], ['Sipariş ' + no]] }));
      if (!o) { f.appendChild(G.bos({ baslik: 'Sipariş bulunamadı', metin: no + ' numaralı sipariş listede yok.', eylem: { ad: 'Siparişlere dön', fn: function () { location.hash = '#siparis'; } } })); return f; }
      f.appendChild(h('div', { sinif: 'sp-ayr-ust' }, [rozet(o), h('span', { sinif: 'sp-rozet', metin: o.sirket }), o.tur_ad ? h('span', { sinif: 'sp-rozet', metin: o.tur_ad }) : null, o.yk ? h('span', { sinif: 'soluk kucuk', metin: 'YK/ref: ' + o.yk }) : null]));
      f.appendChild(h('p', { sinif: 'sp-ayr-musteri', metin: o.teslim_alan || o.musteri }));
      if (o.teslim_alan) f.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Sipariş veren: ' + o.musteri }));
      var kanit = []; o.kalemler.forEach(function (k) { if (kanit.indexOf(k.kanit) < 0) kanit.push(k.kanit); });
      var kn = { tam: 0, kismi: 0, yok: 0, bilinmiyor: 0 }; o.kalemler.forEach(function (k) { kn[k.durum]++; });
      var irT = o.irsaliye_tarih || {}, faT = o.fatura_tarih || {};
      var belgeler = function (liste, tar) { return liste.map(function (n) { return n + (tar[n] ? ' (' + tarihTR(tar[n]) + ')' : ''); }).join(', '); };
      var ilkTarih = function (tar) { var t = Object.keys(tar).map(function (k) { return tar[k]; }).filter(Boolean).sort(); return t.length ? t[0] : null; };
      var gunFark = function (a, b) { if (!a || !b) return null; var d = Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5); return d >= 0 ? d : null; };
      var irIlk = ilkTarih(irT), faIlk = ilkTarih(faT), d1 = gunFark(o.tarih, irIlk), d2 = gunFark(irIlk, faIlk);
      var irMetin = o.irsaliye.length ? o.irsaliye.length + ' teslimat kaydı · Teslimat no: ' + belgeler(o.irsaliye, irT) + ' · İrsaliye no: veri yok' : 'Teslimat no: veri yok · İrsaliye no: veri yok';
      var irAlt = o.irsaliye.length ? (d1 != null ? 'İlk teslimat siparişten ' + d1 + ' gün sonra' : null) : (o.durum === 'bilinmiyor' ? 'Teslimat durumu bilinmiyor.' : 'Teslimat belgesi yok.');
      var faMetin = o.fatura_no.length ? o.fatura_no.length + ' fatura kaydı · Fatura no: ' + belgeler(o.fatura_no, faT) : 'Fatura no: —';
      var faAlt = o.fatura_no.length ? (o.irsaliye.length ? (d2 != null ? 'İlk fatura ilk tesliminden ' + d2 + ' gün sonra' : null) : 'Fatura var ama teslimat kaydı yok.') : 'Faturalanmadı.';
      var zincir = h('ol', { sinif: 'sp-zincir' }, [
        adim('tamam', 'siparis', '1 · Sipariş', 'Açıldı ' + tarihTR(o.tarih) + ' · istenen teslim ' + vadeMetin(o, tarihTR) + (o.durum === 'blokeli' ? ' · teslimat blokajı (' + o.blokaj + ')' : '') + (o.gecikme_gun ? ' · ' + o.gecikme_gun + ' gün gecikmiş' : ''), null),
        adim(o.irsaliye.length ? 'tamam' : 'yok', o.irsaliye.length ? 'tik' : 'bilgi', '2 · Teslimat / irsaliye', irMetin, irAlt),
        adim(o.fatura_no.length ? 'tamam' : 'yok', o.fatura_no.length ? 'tik' : 'bilgi', '3 · Fatura', faMetin, faAlt)]);
      var kartlar = h('div', { sinif: 'iki-kolon' });
      kartlar.appendChild(G.kart({ baslik: 'Sipariş zinciri', alt: 'Sipariş → irsaliye → fatura', govde: zincir }));
      var dl = h('dl', { sinif: 'degerler' });
      [['Kalem sayısı', String(o.kalemler.length)], ['Teslim edildi', String(kn.tam)], ['Kısmi teslim', String(kn.kismi)], ['Teslim yok', String(kn.yok)], ['Durumu bilinmiyor', String(kn.bilinmiyor)]].forEach(function (a) { dl.appendChild(h('dt', { metin: a[0] })); dl.appendChild(h('dd', { metin: a[1] })); });
      var ozKap = h('div', null, [dl]);
      if (yuk.tutar && o.tutar != null) ozKap.appendChild(h('p', { sinif: 'sp-tutar' }, ['Sipariş tutarı: ' + sayi(o.tutar, 2) + ' ' + (o.para || ''), v.ornek ? h('span', { sinif: 'etiket ornek', metin: 'ÖRNEK' }) : null]));
      if (o.red_kalem) ozKap.appendChild(h('p', { sinif: 'kucuk soluk', metin: o.red_kalem + ' reddedilmiş kalem listeye alınmadı.' }));
      kartlar.appendChild(G.kart({ baslik: 'Kalem özeti', govde: ozKap }));
      f.appendChild(kartlar);
      var kt = G.tablo({ kolonlar: [{ ad: 'Poz', k: 'poz' }, { ad: 'Malzeme', k: 'malzeme' }, { ad: 'Tanım', k: 'tanim', ciz: function (k) { return h('span', { sinif: 'sp-hucre-metin', metin: k.tanim || '' }); } },
        { ad: 'Sipariş', k: 'adet', sag: true, ciz: function (k) { return adet(k.adet, k.birim); } }, { ad: 'Teslim', k: 'teslim', sag: true, ciz: function (k) { return k.teslim == null ? 'bilinmiyor' : adet(k.teslim, k.birim); } },
        { ad: 'Durum', k: 'durum', ciz: function (k) { return h('span', { sinif: 'sp-rozet ' + (k.durum === 'yok' || k.durum === 'kismi' ? 'acik' : (k.durum === 'tam' ? 'tamam' : k.durum)), metin: KALEM_AD[k.durum] }); } },
        { ad: 'Fatura', k: 'fatura', ciz: function (k) { return k.fatura ? 'var' : 'kayıt yok'; } }, { ad: 'Tesis', k: 'tesis', ciz: function (k) { return k.tesis || '—'; } }],
        satirlar: o.kalemler, sira: { k: 'poz', yon: 'yukari' } });
      f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Kalemler (' + o.kalemler.length + ')', govde: kt })]));
      f.appendChild(h('p', { sinif: 'ust-bosluk' }, [h('a', { sinif: 'dugme ikincil', href: '#siparis', metin: '← Sipariş listesi' })]));
      return f;
    }

     
    var SON_ANAHTAR = 'mm_siparis_son_aramalar';
    function sonOku() { try { var a = JSON.parse((window.MM_DEPO || localStorage).getItem(SON_ANAHTAR) || '[]'); return Array.isArray(a) ? a.filter(function (x) { return typeof x === 'string'; }).slice(0, 5) : []; } catch (e) { return []; } }
    function sonYaz(t) {
      t = (t || '').trim(); if (t.length < 2) return;
      try { var a = sonOku().filter(function (x) { return x !== t; }); a.unshift(t); (window.MM_DEPO || localStorage).setItem(SON_ANAHTAR, JSON.stringify(a.slice(0, 5))); } catch (e) { }
    }
    function aramaBar() {
      var ara = h('input', { type: 'search', sinif: 'eld-arama', placeholder: 'Sipariş no, YK, müşteri, hastane, malzeme ara…', 'aria-label': 'Sipariş ara', autocomplete: 'off', value: q });
      ara.addEventListener('input', function () { q = ara.value.trim().toLocaleLowerCase('tr'); var p = ara.selectionStart; ciz(); var yn = document.querySelector('.eld-arama'); if (yn) { yn.focus(); try { yn.setSelectionRange(p, p); } catch (e) { } } });
      ara.addEventListener('change', function () { sonYaz(ara.value); });
      ara.addEventListener('keydown', function (e) { if (e.key === 'Enter') sonYaz(ara.value); });
      var kap = h('div', { sinif: 'sp-arama-ust' }, [ara]);
      var son = sonOku();
      if (son.length) {
        var satir = h('div', { sinif: 'sp-son', role: 'group', 'aria-label': 'Son aramalar' }, [h('span', { sinif: 'kucuk soluk', metin: 'Son aramalar:' })]);
        son.forEach(function (t) { satir.appendChild(h('button', { type: 'button', sinif: 'cip', metin: t, onclick: function () { q = t.toLocaleLowerCase('tr'); secili = 'tumu'; yas = ''; kanit = ''; ciz(); } })); });
        satir.appendChild(h('button', { type: 'button', sinif: 'mini-dugme', metin: 'Temizle', onclick: function () { try { (window.MM_DEPO || localStorage).removeItem(SON_ANAHTAR); } catch (e) { } ciz(); } }));
        kap.appendChild(satir);
      }
      return kap;
    }

     
    function ciz() {
      ustKap.textContent = ''; govde.textContent = '';
      var baslik = detayNo ? null : G.sayfaBasi({ baslik: 'Siparişler', alt: 'Sipariş ve sevkiyat durumu', kirinti: [['Siparişler']] });
      if (baslik) ustKap.appendChild(baslik);
      if (!detayNo && tutarYetkisi() && MM.musteriModul) {
        var segGit = function (m) { return function () { location.hash = m ? '#siparis/musteriler' : '#siparis'; }; };
        ustKap.appendChild(h('div', { sinif: 's41-segment', role: 'group', 'aria-label': 'Görünüm' }, [
          h('button', { type: 'button', 'aria-pressed': musMod ? 'false' : 'true', metin: 'Siparişler', onclick: segGit(false) }),
          h('button', { type: 'button', 'aria-pressed': musMod ? 'true' : 'false', metin: 'Müşteriler', onclick: segGit(true) })]));
        if (musMod) { if (!musTemiz) musTemiz = MM.musteriModul(musKok); govde.appendChild(musKok); return; }
      }
      if (hata && !yuk) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Siparişler alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.r.veri;
      if (!detayNo) ustKap.appendChild(aramaBar());   
      var vt = h('div'); ustKap.appendChild(vt);
      if (MM.veriTarihi) MM.veriTarihi(vt, v.asof);   
      ustKap.appendChild(bantlar(v, !!detayNo));
      if (detayNo) { govde.appendChild(ayrinti(v, detayNo)); return; }
      if (!(v.siparisler || []).length) { govde.appendChild(G.bos({ baslik: 'Sipariş verisi boş', metin: 'Listede sipariş yok.' })); return; }
      var vg = (sirket || tur) ? Object.assign({}, v, { siparisler: v.siparisler.filter(function (o) { return uygun(o, 'grup'); }) }) : v;   
      govde.appendChild(secimler(v, vg));   
      govde.appendChild(kpiSeridi(vg));
      var ilk5 = gecikenIlk5(vg); if (ilk5) govde.appendChild(ilk5);
      govde.appendChild(h('details', { sinif: 'acilir-bolum' }, [h('summary', { metin: 'Analiz (huni, gecikme, son 45 gün)' }), h('div', { sinif: 'sp-uclu' }, [huni(vg), yaslandir(vg), son45(vg)])]));
      govde.appendChild(h('h3', { sinif: 'bolum ust-bosluk', metin: 'Siparişler' }));
      var liste = v.siparisler.filter(function (o) { return uygun(o); });
      govde.appendChild(G.cipler([['liste', 'Sipariş listesi'], ['musteri', 'Müşteri bazında'], ['hastane', 'Hastane / teslim yeri bazında']], gor, function (d) { gor = d; ciz(); }, 'Görünüm'));
      govde.appendChild(h('p', { sinif: 'kucuk soluk sp-sayim', metin: (q ? 'Arama: "' + q + '" · ' : '') + DURUM_AD[secili] + ': ' + sayi(liste.length) + ' sipariş' }));
      if (secili === 'iade') {   
        govde.appendChild(G.bos({ baslik: 'İade verisi henüz yok', metin: 'İadeler için kaynak veri gelince burada listelenir.' }));
        var iadeAdim = ['İade başlatıldı', 'Lojistik yönlendirildi', 'Hastaneden alındı', 'Depoya ulaştı', 'Mal girişi', 'Kalite kontrol', 'Satışa hazır'];
        var zin = h('ol', { sinif: 'sp-zincir', 'aria-label': 'İade adımları' });
        iadeAdim.forEach(function (a) { zin.appendChild(adim('yok', 'bilgi', a, 'veri yok')); });
        govde.appendChild(G.kart({ baslik: 'İade adımları', alt: 'adım adım takip · adım verisi henüz yok', govde: zin }));
        return;
      }
      if (!liste.length) { govde.appendChild(G.bos({ baslik: 'Bu görünümde sipariş yok', metin: 'Filtreleri değiştirin ya da aramayı temizleyin.' })); return; }
      govde.appendChild(G.kart({ govde: gor === 'liste' ? siparisTablosu(liste) : (gor === 'musteri' ? grupTablosu(liste, function (o) { return o.musteri; }, 'Müşteri') : grupTablosu(liste, function (o) { return o.teslim_alan; }, 'Hastane / teslim yeri')), baslik: gor === 'liste' ? 'Sipariş listesi' : (gor === 'musteri' ? 'Müşteri bazında' : 'Hastane / teslim yeri bazında'), alt: 'Başlığa dokununca sıralanır · satıra dokununca ayrıntı açılır' }));
    }
    function yenile() { hata = null; yuk = null; ciz(); yukle().then(function (y) { yuk = y; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; if (musTemiz) musTemiz(); };
  };
})();
