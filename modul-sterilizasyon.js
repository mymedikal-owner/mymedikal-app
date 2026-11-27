


(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, ESKI_DK = 36 * 60;

  function sayiYaz(n) { return n == null || !isFinite(n) ? '—' : G.say(n); }
  function tarihTR(iso) { if (!iso) return '—'; var p = String(iso).slice(0, 10).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : '—'; }
  function gunKisa(iso) { var p = String(iso).slice(0, 10).split('-'); return p[2] + '.' + p[1]; }

  MM.moduller.sterilizasyon = function (kok) {
    var yuk = null, hata = null, canli = true, sekme = 'lotlar', q = '';
    kok.appendChild(G.sayfaBasi({ baslik: 'Sterilizasyon', alt: 'Sevk geçiş deposu ve lotlar', kirinti: [['Sterilizasyon']] }));
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);

    function ozetKutular(v) {
      var o = v.ozet || {};
      return G.ozetSerit([
        { baslik: 'Sevk geçiş deposunda', deger: sayiYaz(o.depoda_adet), birim: o.depoda_adet == null ? '' : 'adet', ikon: 'stok', alt: (o.depoda_ns_adet ? 'ayrıca steril olmayan (NS): ' + G.say(o.depoda_ns_adet) + ' adet' : '') },
        { baslik: 'Depodaki lot', deger: sayiYaz(o.depoda_lot), birim: o.depoda_lot == null ? '' : 'lot', ikon: 'belge' },
        { baslik: 'Kalite kararı bekleyen', deger: sayiYaz(o.kalite_bekleyen_parti), birim: o.kalite_bekleyen_parti == null ? '' : 'parti', ikon: 'saat', alt: 'son 30 günde açılan' }], { en: 3 });
    }

     
    function kaliteBekleyen(v) {
      var l = v.kalite_bekleyen_urunler, govde2, eskiKaynak = v.kalite_bekleyen_kaynak_eski === true;
      if (!Array.isArray(l)) govde2 = h('p', { sinif: 'ny-ipucu', metin: 'Ürün bazında bekleyen miktar: görünüm bekleniyor' });
      else if (!l.length) govde2 = h('p', { sinif: 'ny-ipucu', metin: eskiKaynak ? 'Veri eski: bekleyen ürün bilgisi güncel değil.' : 'Kalite kararı bekleyen ürün yok.' });
      else govde2 = h('div', { sinif: 's41-liste' }, l.map(function (r) {
        var alt = (r.parti == null ? '' : G.say(r.parti) + ' parti') + (r.en_eski_parti_tarihi ? ' · en eski parti ' + tarihTR(r.en_eski_parti_tarihi) : '');
        return h('div', { sinif: 'st-satir st-salt' }, [h('span', { sinif: 'st-ad', metin: r.urun || '—' }),
          h('span', { sinif: 'st-sag', metin: r.miktar == null ? '—' : G.say(r.miktar) + (r.birim ? ' ' + r.birim : '') }), alt ? h('small', { sinif: 'st-alt', metin: alt }) : null]);
      }));
      var ust = eskiKaynak ? h('p', { sinif: 'ny-ipucu', metin: 'Veri eski: liste güncel olmayabilir' }) : null;
      var kt = v.kalite_bekleyen_kaynak_tarihi ? h('p', { sinif: 'ny-ipucu', metin: 'Veri tarihi: ' + tarihTR(v.kalite_bekleyen_kaynak_tarihi) }) : null;
      return h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Kalite kararı bekleyen miktar (ürün bazında)', alt: 'kararı henüz verilmemiş mamul partileri · tarih sınırı yok', govde: h('div', null, [ust, govde2, kt]) })]);
    }

    function bugun(v) {
      var gn = v.gunluk || [], ciftler = gn.map(function (x) { return { e: gunKisa(x.gun), giren: x.giren, cikan: x.cikan }; });
      var ham = ciftler.filter(function (x) { return x.giren != null || x.cikan != null; }), toplam = 0;
      ham.forEach(function (x) { toplam += (x.giren || 0) + (x.cikan || 0); });
      var kok2 = h('div');
      kok2.appendChild(kaliteBekleyen(v));
      if (!ham.length) kok2.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Hareket bilgisi şu an alınamıyor.' }));
      else if (!toplam) kok2.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Son 7 günde sevk geçiş deposunda hareket olmadı.' }));
      else {
        kok2.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Giren adet', alt: 'son 7 gün', govde: G.cubuk(ciftler.map(function (x) { return { e: x.e, d: x.giren }; }), { ad: 'Günlük giren adet' }) })]));
        kok2.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Çıkan adet', alt: 'son 7 gün', govde: G.cubuk(ciftler.map(function (x) { return { e: x.e, d: x.cikan }; }), { ad: 'Günlük çıkan adet', renk: 'var(--s2)' }) })]));
      }
      return kok2;
    }

    function lotlar(v) {
      var l = v.lotlar || [], kap = h('div');
      if (!l.length) { kap.appendChild(G.bos({ baslik: 'Lot kaydı yok', metin: 'Sevk geçiş deposunda lot bulunamadı.' })); return kap; }
      var liste = h('div'), zm = null;
      function ciz() {
        liste.textContent = '';
        var n = MM.aramaNorm(q), s = l.filter(function (x) { return !n || MM.aramaNorm((x.urun || '') + ' ' + (x.lot || '')).indexOf(n) >= 0; });
        if (!s.length) { liste.appendChild(G.bos({ baslik: 'Eşleşen lot yok', metin: 'Aramayı değiştirin.' })); return; }
        liste.appendChild(G.ilkN(s, lotSatir, { n: 10, sinif: 's41-liste' }));
      }
      function lotSatir(r) {
        var alt = [(r.lot || '—'), tarihTR(r.son_hareket), r.durum === 'Depoda' ? 'Depoda' : 'Sevk edildi'].join(' · ');
        return h('button', { type: 'button', sinif: 'st-satir', 'aria-haspopup': 'dialog', onclick: function () { lotDetay(r); } }, [
          h('span', { sinif: 'st-ad', metin: r.urun || '—' }), h('span', { sinif: 'st-sag', metin: sayiYaz(r.adet_depoda) }), h('small', { sinif: 'st-alt', metin: alt })]);
      }
      function lotDetay(r) {
        G.sheet(r.urun || 'Lot', function (g) {
          var tablo = [['Lot', r.lot || '—'], ['Depoda', sayiYaz(r.adet_depoda)], ['Giren', sayiYaz(r.giren)], ['Çıkan', sayiYaz(r.cikan)], ['Son hareket', tarihTR(r.son_hareket)], ['Durum', r.durum === 'Depoda' ? 'Depoda' : 'Sevk edildi']];
          return h('div', { sinif: 'st-detay' }, tablo.map(function (x) { return h('div', { sinif: 'st-detay-satir' }, [h('span', { metin: x[0] }), h('strong', { metin: x[1] })]); }));
        }).ac();
      }
      kap.appendChild(G.aracCubugu({ arama: { deger: q, yerTutucu: 'Ürün veya lot ara', degisti: function (x) { clearTimeout(zm); zm = setTimeout(function () { q = x; ciz(); }, 120); } } }));
      kap.appendChild(liste); ciz();
      return kap;
    }

    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata && hata.kod === 'bulunamadi') {
        var bk = G.bos({ tur: 'veri', baslik: 'Veri bekleniyor', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } });
        var bd = bk.querySelector('button'); if (bd) bd.classList.add('ikincil');
        govde.appendChild(bk); return;
      }
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Sterilizasyon alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri;
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      var dk = MM.yasDk(v.veri_tarihi || v.uretildi);
      ust.appendChild(G.tazelik(v.veri_tarihi || v.uretildi, (v.eski === true || dk == null || dk > ESKI_DK) ? 'eski' : 'taze'));
      ust.appendChild(ozetKutular(v));
      var sek = [['bugun', 'Bugün'], ['lotlar', 'Lotlar', (v.lotlar || []).length]];   
      ust.appendChild(G.segment(sek, sekme, function (id) { sekme = id; ciz(); }, { ad: 'Sterilizasyon görünümleri' }));
      govde.appendChild(sekme === 'lotlar' ? lotlar(v) : bugun(v));
    }
    function yenile() {
      hata = null; yuk = null; ciz();
      window.MMVeri.oku('sterilizasyon', 'sterilizasyon').then(function (r) { yuk = r; hata = null; })
        .catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); });
    }
    yenile();
    return function () { canli = false; };
  };
})();
