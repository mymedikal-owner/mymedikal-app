





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
   
  var DEGISIM_ILK = 20;
  function degisimVar(v) { return !!v && Array.isArray(v.degisim_mal_fazlasi) && v.degisim_mal_fazlasi.length > 0; }    
  function hastaneAd(s) { return (typeof s !== 'string' || !s.trim() || /^[*\s]+$/.test(s)) ? '—' : s.trim(); }    
  function degisimTurAd(d) { return d.tur_ad === 'mal fazlası' || d.tur_ad === 'Mal fazlası' ? 'Mal fazlası' : (d.tur_ad === 'değişim' || d.tur_ad === 'Değişim' ? 'Değişim' : ''); }
  function degisimSirala(liste) { return (liste || []).slice().sort(function (a, b) { return String(b.tarih || '').localeCompare(String(a.tarih || '')) || String(b.no || '').localeCompare(String(a.no || '')); }); }
  function degisimSay(liste) { var s = { tumu: (liste || []).length, degisim: 0, fazla: 0 }; (liste || []).forEach(function (d) { var t = degisimTurAd(d); if (t === 'Değişim') s.degisim++; else if (t === 'Mal fazlası') s.fazla++; }); return s; }
  function degisimSuz(liste, tur, q, norm) {
    norm = norm || function (x) { return String(x).toLocaleLowerCase('tr'); };
    var a = norm(q || '');
    return (liste || []).filter(function (d) {
      if (tur === 'degisim' && degisimTurAd(d) !== 'Değişim') return false;
      if (tur === 'fazla' && degisimTurAd(d) !== 'Mal fazlası') return false;
      if (!a) return true;
      var m = [d.no, hastaneAd(d.hastane)].concat((d.kalemler || []).map(function (k) { return (k.malzeme || '') + ' ' + (k.tanim || ''); })).join(' ');
      return norm(m).indexOf(a) >= 0;
    });
  }
  MM.siparis = { yukle: yukle, ozet: ozet, degisimVar: degisimVar, degisimSuz: degisimSuz, degisimSirala: degisimSirala, degisimSay: degisimSay, hastaneAd: hastaneAd };
  function bugunISO() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  function rozet(o) { return h('span', { sinif: 'sp-rozet ' + sinif(o), metin: o.gecikme_gun ? 'Geciken ' + o.gecikme_gun + ' gün' : DURUM_AD[o.durum] }); }

  MM.moduller.siparis = function (kok) {
    var qs = new URLSearchParams(location.search), yol = MM.yol();
    var secili = qs.get('ssekme') || 'acik', sirket = '', tur = '', yas = '', kanit = '', q = '', gor = 'liste', yuk = null, hata = null, canli = true;
    var urun = '', musF = '', hasF = '';    
    function urunGrubu(o) {    
      if (o._urun) return o._urun;
      var t = (o.kalemler || []).map(function (k) { return k.tanim || ''; }).join(' ').toLocaleLowerCase('tr');
      o._urun = /eldiven|nitril|glove|lateks|latex/.test(t) ? 'Eldiven' : (/spanc|spanç|mumu|batin|batın|bez|gazl/.test(t) ? 'Spanç' : 'Diğer');
      return o._urun;
    }
    var detayNo = yol[0] === 'siparis' && yol[1] ? yol[1] : ((qs.get('ac') || '').split(',')[0] || null);
    var ustKap = h('div'), govde = h('div', { 'aria-live': 'polite' });
    var musMod = yol[0] === 'musteriler', musKok = h('div'), musTemiz = null;
    var degMod = yol[0] === 'degisim', degTur = 'tumu', degQ = '', degN = DEGISIM_ILK, degAcik = {};    
    kok.appendChild(ustKap); kok.appendChild(govde);

    function uygun(o, yoksay) {
      if (yoksay !== 'sirket' && sirket) { if (sirket === 'DIGER' ? (o.sirket === 'MY' || o.sirket === 'DAY') : o.sirket !== sirket) return false; }
      if (yoksay !== 'tur' && tur === 'OZEL') { if (o.tur_ad === 'DMO') return false; }    
      else if (yoksay !== 'tur' && tur) { if (tur === 'DIGER' ? !!o.tur_ad && o.tur_ad !== 'DMO' && o.tur_ad !== 'Özel müşteri' : (o.tur_ad || '') !== tur) return false; }
      if (yoksay !== 'urun' && urun && urunGrubu(o) !== urun) return false;
      if (yoksay === 'grup') return true;    
      if (musF && o.musteri !== musF) return false;
      if (hasF && o.teslim_alan !== hasF) return false;
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
      var o = ozet(v), k = [];
      function kutu(id, baslik, n, ikn, durum, alt) {
        k.push({ baslik: baslik, deger: n == null ? 'veri yok' : String(n), birim: n == null ? '' : 'sipariş', ikon: ikn, durum: durum, alt: alt, tikla: function () { secili = id; yas = ''; ciz(); } });
      }
      kutu('acik', 'Açık', o.acik, 'siparis', null, 'kayıtlı kanıtla açık');
      kutu('gecikmis', 'Geciken', o.gecikmis, 'uyari', o.gecikmis ? 'kritik' : null, 'istenen teslim geçmiş');
      kutu('blokeli', 'Blokeli', o.blokeli, 'uyari', o.blokeli ? 'uyari' : null, 'teslimat blokajı var');
      kutu('tamam', 'Tamamlanan', o.tamam, 'tik', null, 'tam teslim kanıtlı');
      kutu('iade', 'İade', null, 'bilgi', 'yok', 'iade verisi henüz yok — "iade yok" demek değil');   
      kutu('bilinmiyor', 'Durum bilinmiyor', o.bilinmiyor, 'bilgi', null, 'kayıtlı kanıt yok; iade sayılmaz');
      return { ana: G.ozetSerit(k.slice(0, 4), { en: 4 }), ek: G.ozetSerit(k.slice(4), { en: 2 }) };    
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

     
     
    function ilkDegerler(liste, anahtar, secili_) {
      var m = {}; liste.forEach(function (o) { var a = anahtar(o); if (a) m[a] = (m[a] || 0) + 1; });
      var a = Object.keys(m).sort(function (x, y) { return m[y] - m[x] || x.localeCompare(y, 'tr'); }).slice(0, 8);
      if (secili_ && a.indexOf(secili_) < 0) a.unshift(secili_);
      return a.map(function (x) { return [x, x, m[x] || 0]; });
    }
    function arac(v, vg) {
      var o = ozet(vg || v), tum = (vg || v).siparisler;
      var say0 = function (fn, yoksay) { return v.siparisler.filter(function (x) { return uygun(x, yoksay) && fn(x); }).length; };
      var sec = [['acik', 'Açık', o.acik], ['blokeli', 'Blokeli', o.blokeli], ['gecikmis', 'Geciken', o.gecikmis], ['tamam', 'Tamamlanan', o.tamam], ['iade', 'İade', 'veri yok'], ['bilinmiyor', 'Durum bilinmiyor', o.bilinmiyor], ['tumu', 'Tümü', tum.length]];
      var urunSay = function (u) { return say0(function (x) { return urunGrubu(x) === u; }, 'urun'); };
      var gruplar = [
        { ad: 'Görünümler', secenekler: [['liste', 'Sipariş listesi'], ['musteri', 'Müşteri bazında'], ['hastane', 'Hastane / teslim yeri bazında']], secili: gor, varsayilan: 'liste', sec: function (d) { gor = d || 'liste'; ciz(); } },
        { ad: 'Durum', secenekler: sec, secili: secili, varsayilan: 'acik', sec: function (d) { secili = d; yas = ''; ciz(); } },
        { ad: 'Şirket', secenekler: [['', 'MY + DAY', say0(function () { return true; }, 'sirket')], ['MY', 'MY', say0(function (x) { return x.sirket === 'MY'; }, 'sirket')], ['DAY', 'DAY', say0(function (x) { return x.sirket === 'DAY'; }, 'sirket')]], secili: sirket === 'DIGER' ? '' : sirket, sec: function (d) { sirket = d || ''; ciz(); } },
        { ad: 'Tür', secenekler: [['', 'Özel + DMO', say0(function () { return true; }, 'tur')], ['DMO', 'DMO', say0(function (x) { return x.tur_ad === 'DMO'; }, 'tur')], ['OZEL', 'Özel (doğrudan temin dahil)', say0(function (x) { return x.tur_ad !== 'DMO'; }, 'tur')]], secili: tur === 'OZEL' || tur === 'DMO' ? tur : '', sec: function (d) { tur = d || ''; ciz(); } },
        { ad: 'Ürün grubu', secenekler: [['', 'Tümü', say0(function () { return true; }, 'urun')], ['Eldiven', 'Eldiven', urunSay('Eldiven')], ['Spanç', 'Spanç', urunSay('Spanç')], ['Diğer', 'Diğer', urunSay('Diğer')]], secili: urun, sec: function (d) { urun = d || ''; ciz(); } },
        { ad: 'Gecikme', secenekler: [['', 'Tümü']].concat(YAS.map(function (y) { return [y[0], y[1]]; })), secili: yas, sec: function (d) { yas = d || ''; if (yas) secili = 'gecikmis'; ciz(); } },
        { ad: 'Kayıt', secenekler: [['', 'Tümü'], ['irs', 'Teslimat kaydı olanlar'], ['fat', 'Fatura kaydı olanlar']], secili: kanit, sec: function (d) { kanit = d || ''; ciz(); } },
        { ad: 'Müşteri', secenekler: [['', 'Tümü']].concat(ilkDegerler(tum, function (x) { return x.musteri; }, musF)), secili: musF, sec: function (d) { musF = d || ''; ciz(); } },
        { ad: 'Hastane / teslim yeri', secenekler: [['', 'Tümü']].concat(ilkDegerler(tum, function (x) { return x.teslim_alan; }, hasF)), secili: hasF, sec: function (d) { hasF = d || ''; ciz(); } }];
      var kapAra = G.aracCubugu({
        arama: { deger: q, yerTutucu: 'Sipariş no, YK, müşteri, hastane, malzeme ara…', degisti: function (t) { q = t.trim().toLocaleLowerCase('tr'); var kk = document.querySelector('.arac-arama'), p = kk ? kk.selectionStart : 0; ciz(); var yn = document.querySelector('.arac-arama'); if (yn) { yn.focus(); try { yn.setSelectionRange(p, p); } catch (e) { } } } },
        cipler: [{ id: 'acik', ad: 'Açık', secili: secili === 'acik', degisti: function (on) { secili = on ? 'acik' : 'tumu'; yas = ''; ciz(); } }, { id: 'gecikmis', ad: 'Geciken', secili: secili === 'gecikmis', degisti: function (on) { secili = on ? 'gecikmis' : 'tumu'; yas = ''; ciz(); } }],
        filtre: { baslik: 'Filtre', gruplar: gruplar, temizle: function () { secili = 'acik'; sirket = ''; tur = ''; urun = ''; yas = ''; kanit = ''; musF = ''; hasF = ''; q = ''; gor = 'liste'; ciz(); } } });
      var gir = kapAra.querySelector('.arac-arama');
      if (gir) { gir.addEventListener('change', function () { sonYaz(gir.value); }); gir.addEventListener('keydown', function (e) { if (e.key === 'Enter') sonYaz(gir.value); }); }
      return kapAra;
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
    var siparisKol = null, xlKaynak = null;
    function belgeNo(a) { return a.length ? (a.length > 1 ? a[0] + ' +' + (a.length - 1) : a[0]) : 'kayıt yok'; }    
    function siparisTablosu(liste) {
      var kol = [
        { ad: 'Sipariş', k: 'no', ciz: function (o) { return h('a', { href: '#siparis/siparis/' + encodeURIComponent(o.no), sinif: 'sp-no', metin: o.no, onclick: function (e) { e.stopPropagation(); } }); } },
        { ad: 'YK no / Özel', k: 'turetiket', ciz: turEtiket, csv: turEtiket, deger: turEtiket },
        { ad: 'Durum', k: 'durum', deger: function (o) { return o.gecikme_gun ? 'a' + (1000 - o.gecikme_gun) : (o.durum === 'acik' ? 'b' : o.durum === 'tamam' ? 'c' : 'd'); }, ciz: rozet },
        { ad: 'Gecikme (gün)', k: 'gecikme', sag: true, deger: function (o) { return o.gecikme_gun || 0; }, ciz: function (o) { return o.gecikme_gun ? String(o.gecikme_gun) : '—'; } },
        { ad: 'Şirket', k: 'sirket', ciz: function (o) { return o.sirket || '—'; } },
        { ad: 'Tür', k: 'tur_ad', ciz: function (o) { return o.tur_ad || '—'; } },
        { ad: 'Müşteri', k: 'musteri', csv: function (o) { return o.musteri || ''; }, ciz: function (o) { return h('span', { sinif: 'sp-hucre-metin', metin: o.musteri || '—' }); } },
        { ad: 'Teslim yeri / müşteri', k: 'teslim', csv: function (o) { return o.teslim_alan || o.musteri || ''; }, deger: function (o) { return o.teslim_alan || o.musteri || ''; }, ciz: function (o) { return h('span', { sinif: 'sp-hucre-metin', metin: o.teslim_alan || o.musteri || '—' }); } },
        { ad: 'Açıldı', k: 'tarih', deger: function (o) { return o.tarih || ''; }, ciz: function (o) { return tarihTR(o.tarih); } },
        { ad: 'İstenen teslim', k: 'vade', deger: function (o) { return o.vade || null; }, ciz: function (o) { return vadeMetin(o, tarihTR); } },
        { ad: 'Kalem', k: 'kalem', sag: true, deger: function (o) { return o.kalemler.length; }, ciz: function (o) { return o.kalemler.length + (o.bilinmeyen_kalem ? ' (' + o.bilinmeyen_kalem + '?)' : ''); } },
        { ad: 'İrsaliye', k: 'irs', sag: true, deger: function (o) { return o.irsaliye.length; }, ciz: function (o) { return belgeNo(o.irsaliye); }, csv: function (o) { return o.irsaliye.join(' '); } },
        { ad: 'Fatura', k: 'fat', sag: true, deger: function (o) { return o.fatura_no.length; }, ciz: function (o) { return belgeNo(o.fatura_no); }, csv: function (o) { return o.fatura_no.join(' '); } }];
      if (yuk.tutar) kol.push({ ad: 'Tutar (ÖRNEK)', k: 'tutar', sag: true, deger: function (o) { return o.tutar == null ? null : o.tutar; }, ciz: function (o) { return o.tutar == null ? '—' : sayi(o.tutar, 2) + ' ' + (o.para || ''); } });
      siparisKol = kol; xlKaynak = { ad: 'Siparişler', kolonlar: kol, satirlar: liste };
      return G.tablo({ kolonlar: kol, satirlar: liste, sayfa: 10, sira: secili === 'gecikmis' ? { k: 'gecikme', yon: 'asagi' } : { k: 'tarih', yon: 'asagi' }, satirTikla: function (o) { location.hash = '#siparis/siparis/' + encodeURIComponent(o.no); }, satirSinif: function (o) { return o.gecikme_gun ? 'kirmizi' : ''; }, bos: 'Bu görünümde sipariş yok.' });
    }

     
    function grupTablosu(liste, anahtar, ad) {
      var m = {};
      liste.forEach(function (o) { var a = anahtar(o) || '(kayıtlı değil)'; var g = m[a] || (m[a] = { ad: a, n: 0, acik: 0, gec: 0, bil: 0, tam: 0, tutar: 0, tutarVar: false }); g.n++; var s = sinif(o); if (s === 'gecikmis') g.gec++; if (o.durum === 'acik') g.acik++; if (o.durum === 'bilinmiyor') g.bil++; if (o.durum === 'tamam') g.tam++; if (yuk.tutar && o.tutar != null) { g.tutar += o.tutar; g.tutarVar = true; } });
      var satir = Object.keys(m).map(function (k) { return m[k]; });
      var kol = [{ ad: ad, k: 'ad', ciz: function (g) { return h('span', { sinif: 'sp-hucre-metin', metin: g.ad }); } }, { ad: 'Sipariş', k: 'n', sag: true }, { ad: 'Açık', k: 'acik', sag: true }, { ad: 'Geciken', k: 'gec', sag: true }, { ad: 'Durum bilinmiyor', k: 'bil', sag: true }, { ad: 'Tamamlanan', k: 'tam', sag: true }];
      if (yuk.tutar) kol.push({ ad: 'Tutar (ÖRNEK)', k: 'tutar', sag: true, ciz: function (g) { return g.tutarVar ? sayi(g.tutar, 0) : '—'; } });
      xlKaynak = { ad: ad + ' bazında', kolonlar: kol, satirlar: satir };
      return G.tablo({ kolonlar: kol, satirlar: satir, sayfa: 10, sira: { k: 'n', yon: 'asagi' }, satirTikla: function (g) { q = g.ad === '(kayıtlı değil)' ? '' : g.ad.toLocaleLowerCase('tr'); gor = 'liste'; ciz(); window.scrollTo(0, 0); }, satirSinif: function (g) { return g.gec ? 'kirmizi' : ''; } });
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
      var fatDizi = (Array.isArray(o.faturalar) && o.faturalar.length) ? o.faturalar : null;    
      var faMetin = fatDizi ? fatDizi.length + ' fatura kaydı' : (o.fatura_no.length ? o.fatura_no.length + ' fatura kaydı · Fatura no: ' + belgeler(o.fatura_no, faT) : 'Fatura no: —');
      var faAlt = o.fatura_no.length ? (o.irsaliye.length ? (d2 != null ? 'İlk fatura ilk tesliminden ' + d2 + ' gün sonra' : null) : 'Fatura var ama teslimat kaydı yok.') : 'Faturalanmadı.';
      var zincir = h('ol', { sinif: 'sp-zincir' }, [
        adim('tamam', 'siparis', '1 · Sipariş', 'Açıldı ' + tarihTR(o.tarih) + ' · istenen teslim ' + vadeMetin(o, tarihTR) + (o.durum === 'blokeli' ? ' · teslimat blokajı (' + o.blokaj + ')' : '') + (o.gecikme_gun ? ' · ' + o.gecikme_gun + ' gün gecikmiş' : ''), null),
        adim(o.irsaliye.length ? 'tamam' : 'yok', o.irsaliye.length ? 'tik' : 'bilgi', '2 · Teslimat / irsaliye', irMetin, irAlt),
        adim(o.fatura_no.length ? 'tamam' : 'yok', o.fatura_no.length ? 'tik' : 'bilgi', '3 · Fatura', faMetin, faAlt)]);
      if (fatDizi) {
        var faKap = h('div', { sinif: 'sp-fat-liste' });
        fatDizi.forEach(function (ft) {
          var gonderildi = ft.e_fatura_gonderildi === 'evet';
          faKap.appendChild(h('div', { sinif: 'sp-fat-satir' }, [h('span', { sinif: 'sp-fat-no', metin: ft.no || '—' }), h('span', { sinif: 'kucuk soluk', metin: tarihTR(ft.tarih) }), h('span', { sinif: 'etiket' + (gonderildi ? '' : ' kismi'), metin: gonderildi ? 'e-fatura gönderildi' : 'e-fatura gönderilmedi' })]));
        });
        var faIcerik = zincir.lastChild.querySelector('.sp-adim-icerik'); if (faIcerik) faIcerik.appendChild(faKap);
      }
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
    function aramaBar(v, vg) {
      var kap = h('div', { sinif: 'sp-arama-ust' }, [arac(v, vg)]);   
      var son = sonOku();
      if (son.length && !q) {
        var satir = h('div', { sinif: 'sp-son', role: 'group', 'aria-label': 'Son aramalar' }, [h('span', { sinif: 'kucuk soluk', metin: 'Son aramalar:' })]);
        son.forEach(function (t) { satir.appendChild(h('button', { type: 'button', sinif: 'cip', metin: t, onclick: function () { q = t.toLocaleLowerCase('tr'); secili = 'tumu'; yas = ''; kanit = ''; ciz(); } })); });
        satir.appendChild(h('button', { type: 'button', sinif: 'mini-dugme', metin: 'Temizle', onclick: function () { try { (window.MM_DEPO || localStorage).removeItem(SON_ANAHTAR); } catch (e) { } ciz(); } }));
        kap.appendChild(satir);
      }
      return kap;
    }

     
    function degisimGorunum(v) {
      var tum = degisimSirala(v.degisim_mal_fazlasi), say = degisimSay(tum), kap = h('div', { sinif: 'sp-deg' });
      var cipSira = h('div', { sinif: 'cip-sira', role: 'group', 'aria-label': 'Belge türü' }), liste = h('div', { sinif: 'sp-deg-liste', 'aria-live': 'polite' });
      var gir = h('input', { type: 'search', sinif: 'sp-deg-ara', placeholder: 'Hastane, belge no, malzeme ara…', 'aria-label': 'Hastane, belge no, malzeme ara', value: degQ, enterkeyhint: 'search' });
      function cipler() {
        cipSira.textContent = '';
        [['tumu', 'Son 365 gün', say.tumu], ['degisim', 'Değişim', say.degisim], ['fazla', 'Mal fazlası', say.fazla]].forEach(function (c) {
          cipSira.appendChild(h('button', { type: 'button', sinif: 'cip' + (degTur === c[0] ? ' secili' : ''), 'aria-pressed': degTur === c[0] ? 'true' : 'false', onclick: function () { degTur = c[0]; degN = DEGISIM_ILK; cipler(); satirlar(); } }, [c[1], h('span', { sinif: 'cip-sayi', metin: sayi(c[2]) })]));
        });
      }
      function satirlar() {
        liste.textContent = '';
        var s = degisimSuz(tum, degTur, degQ, MM.aramaNorm);
        if (!s.length) { liste.appendChild(h('p', { sinif: 'veri-yok sp-deg-bos', metin: 'Kayıt bulunamadı' })); return; }
        liste.appendChild(h('p', { sinif: 'kucuk soluk sp-sayim', metin: sayi(s.length) + ' belge' }));
        s.slice(0, degN).forEach(function (d, i) {
          var id = (d.no || '') + '|' + i, acik = !!degAcik[id], kal = Array.isArray(d.kalemler) ? d.kalemler : [];
          var detay = h('ul', { sinif: 'sp-deg-kalem', hidden: acik ? null : '' });
          if (!kal.length) detay.appendChild(h('li', { sinif: 'soluk', metin: 'Kalem kaydı yok' }));
          kal.forEach(function (k) { detay.appendChild(h('li', null, [h('span', { sinif: 'sp-deg-urun', metin: (k.tanim || k.malzeme || '—') }), h('span', { sinif: 'sp-deg-adet', metin: adet(k.adet, k.birim) })])); });
          var dugme = h('button', { type: 'button', sinif: 'sp-deg-satir', 'aria-expanded': acik ? 'true' : 'false', onclick: function () { degAcik[id] = !degAcik[id]; detay.hidden = !degAcik[id]; dugme.setAttribute('aria-expanded', degAcik[id] ? 'true' : 'false'); } }, [
            h('span', { sinif: 'sp-deg-ust' }, [h('span', { sinif: 'etiket' + (degisimTurAd(d) === 'Mal fazlası' ? ' kismi' : ''), metin: degisimTurAd(d) || '—' }), h('span', { sinif: 'sp-no', metin: d.no || '—' }), h('span', { sinif: 'kucuk soluk', metin: tarihTR(d.tarih) })]),
            h('span', { sinif: 'sp-deg-hastane', metin: hastaneAd(d.hastane) })]);
          liste.appendChild(h('div', { sinif: 'sp-deg-kart' }, [dugme, detay]));
        });
        if (s.length > degN) liste.appendChild(h('button', { type: 'button', sinif: 'dugme ikincil sp-deg-daha', metin: 'Daha fazla göster', onclick: function () { degN += DEGISIM_ILK; satirlar(); } }));
      }
      gir.addEventListener('input', function () { degQ = gir.value.trim(); degN = DEGISIM_ILK; satirlar(); });
      kap.appendChild(h('div', { sinif: 'sp-arama-ust' }, [gir])); cipler(); kap.appendChild(cipSira); kap.appendChild(liste); satirlar();
      return kap;
    }

     
    var dahaAcik = false;
    function ciz() {
      ustKap.textContent = ''; govde.textContent = '';
      var baslik = detayNo ? null : G.sayfaBasi({ baslik: 'Siparişler', alt: 'Sipariş ve sevkiyat durumu', kirinti: [['Siparişler']] });
      if (baslik) ustKap.appendChild(baslik);
      var degGoster = !!yuk && degisimVar(yuk.r.veri);    
      var segSecenek = [['siparis', 'Siparişler']];
      if (tutarYetkisi() && MM.musteriModul) segSecenek.push(['musteri', 'Müşteriler']);
      if (degGoster) segSecenek.push(['degisim', 'Değişim ve mal fazlası']);
      if (!detayNo && segSecenek.length > 1) {
        var segGit = function (d) { location.hash = d === 'musteri' ? '#siparis/musteriler' : (d === 'degisim' ? '#siparis/degisim' : '#siparis'); };
        ustKap.appendChild(h('div', { sinif: 'sp-segment' }, [G.segment(segSecenek, (degMod && degGoster) ? 'degisim' : (musMod ? 'musteri' : 'siparis'), segGit, { ad: 'Görünüm' })]));
        if (musMod && tutarYetkisi() && MM.musteriModul) { if (!musTemiz) musTemiz = MM.musteriModul(musKok); govde.appendChild(musKok); return; }
      }
      if (hata && !yuk) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Siparişler alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.r.veri;
      if (degMod && !detayNo && degGoster) { ustKap.appendChild(bantlar(v, true)); govde.appendChild(degisimGorunum(v)); return; }
      var vg = (!detayNo && (v.siparisler || []).length && (sirket || tur || urun)) ? Object.assign({}, v, { siparisler: v.siparisler.filter(function (o) { return uygun(o, 'grup'); }) }) : v;   
      if (!detayNo && (v.siparisler || []).length) ustKap.appendChild(aramaBar(v, vg));   
      var vt = h('div'); ustKap.appendChild(vt);
      if (MM.veriTarihi) MM.veriTarihi(vt, v.asof);   
      ustKap.appendChild(bantlar(v, !!detayNo));
      if (detayNo) { govde.appendChild(ayrinti(v, detayNo)); return; }
      if (!(v.siparisler || []).length) { govde.appendChild(G.bos({ baslik: 'Sipariş verisi boş', metin: 'Listede sipariş yok.' })); return; }
      var kp = kpiSeridi(vg);
      govde.appendChild(kp.ana);
      var ilk5 = gecikenIlk5(vg);
      var dahaKutu = h('div', { sinif: 'sp-daha' }, [h('p', { sinif: 'kucuk soluk', metin: 'Analiz (huni, gecikme, son 45 gün)' }), kp.ek, ilk5, h('div', { sinif: 'sp-uclu' }, [huni(vg), yaslandir(vg), son45(vg)])]);
      dahaKutu.hidden = !dahaAcik;
      var dahaDugme = h('button', { type: 'button', sinif: 'dugme ikincil sp-daha-dugme', 'aria-expanded': dahaAcik ? 'true' : 'false', metin: dahaAcik ? 'Daha az' : 'Daha fazla', onclick: function () { dahaAcik = !dahaAcik; dahaKutu.hidden = !dahaAcik; dahaDugme.setAttribute('aria-expanded', dahaAcik ? 'true' : 'false'); dahaDugme.textContent = dahaAcik ? 'Daha az' : 'Daha fazla'; } });
      govde.appendChild(dahaKutu);
      var liste = v.siparisler.filter(function (o) { return uygun(o); });
      var sayimSatir = h('div', { sinif: 'sp-sayim-satir' }, [h('p', { sinif: 'kucuk soluk sp-sayim', metin: (q ? 'Arama: "' + q + '" · ' : '') + DURUM_AD[secili] + ': ' + sayi(liste.length) + ' sipariş' })]);
      var xl = (secili !== 'iade' && liste.length) ? G.excelDugme(function () { var xk = xlKaynak || { ad: 'Siparişler', kolonlar: siparisKol, satirlar: liste }; return { ad: xk.ad, filtre: DURUM_AD[secili] + (q ? ' · arama: ' + q : '') + (sirket ? ' · ' + sirket : '') + (tur ? ' · ' + tur : '') + (urun ? ' · ' + urun : '') + (musF ? ' · ' + musF : '') + (hasF ? ' · ' + hasF : ''), kolonlar: xk.kolonlar, satirlar: xk.satirlar }; }) : null;
      var sayimMetin = sayimSatir.firstChild.textContent;
      var eylemKap = h('span', { sinif: 'sp-eylem' }, [dahaDugme]);
      if (xl) eylemKap.appendChild(xl);
      var listeKartta = secili !== 'iade' && liste.length;
      if (!listeKartta) { sayimSatir.appendChild(eylemKap); govde.appendChild(sayimSatir); }
      if (secili === 'iade') {   
        govde.appendChild(G.bos({ baslik: 'İade verisi henüz yok', metin: 'İadeler için kaynak veri gelince burada listelenir.' }));
        var iadeAdim = ['İade başlatıldı', 'Lojistik yönlendirildi', 'Hastaneden alındı', 'Depoya ulaştı', 'Mal girişi', 'Kalite kontrol', 'Satışa hazır'];
        var zin = h('ol', { sinif: 'sp-zincir', 'aria-label': 'İade adımları' });
        iadeAdim.forEach(function (a) { zin.appendChild(adim('yok', 'bilgi', a, 'veri yok')); });
        govde.appendChild(G.kart({ baslik: 'İade adımları', alt: 'adım adım takip · adım verisi henüz yok', govde: zin }));
        return;
      }
      if (!liste.length) { govde.appendChild(G.bos({ baslik: 'Bu görünümde sipariş yok', metin: 'Filtreleri değiştirin ya da aramayı temizleyin.' })); return; }
      govde.appendChild(G.kart({ govde: gor === 'liste' ? siparisTablosu(liste) : (gor === 'musteri' ? grupTablosu(liste, function (o) { return o.musteri; }, 'Müşteri') : grupTablosu(liste, function (o) { return o.teslim_alan; }, 'Hastane / teslim yeri')), baslik: gor === 'liste' ? 'Sipariş listesi' : (gor === 'musteri' ? 'Müşteri bazında' : 'Hastane / teslim yeri bazında'), alt: sayimMetin, eylem: eylemKap }));
    }
    function yenile() { hata = null; yuk = null; ciz(); yukle().then(function (y) { yuk = y; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; if (musTemiz) musTemiz(); };
  };
})();
