


(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, ESKI_DK = 36 * 60;

  function sayiYaz(n) { return n == null || !isFinite(n) ? '—' : G.say(n); }
  function tarihTR(iso) { if (!iso) return '—'; var p = String(iso).slice(0, 10).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : '—'; }
  function gunKisa(iso) { var p = String(iso).slice(0, 10).split('-'); return p[2] + '.' + p[1]; }

  MM.moduller.sterilizasyon = function (kok) {
    var yuk = null, hata = null, canli = true, sekme = 'bugun', q = '';
    kok.appendChild(G.sayfaBasi({ baslik: 'Sterilizasyon', alt: 'Sterilizasyon deposu ve lotlar', kirinti: [['Sterilizasyon']] }));
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);

    function bugun(v) {
      var o = v.ozet || {}, k = h('div', { sinif: 'kpi-izgara' });
      k.appendChild(G.kpi({ baslik: 'Sterilizasyon deposunda', deger: sayiYaz(o.depoda_adet), birim: o.depoda_adet == null ? '' : 'adet', ikon: 'stok', alt: (o.depoda_lot == null ? '' : G.say(o.depoda_lot) + ' lot') + (o.depoda_ns_adet ? ' · ayrıca steril olmayan (NS): ' + G.say(o.depoda_ns_adet) + ' adet' : '') + (o.depo_tanim_teyit_bekliyor ? ' · depo tanımı doğrulanıyor' : '') }));
      k.appendChild(G.kpi({ baslik: 'Karantinada', deger: sayiYaz(o.karantina_adet), birim: o.karantina_adet == null ? '' : 'adet', ikon: 'uyari', alt: o.karantina_lot == null ? '' : G.say(o.karantina_lot) + ' lot' }));
      k.appendChild(G.kpi({ baslik: 'Kalite kararı bekleyen', deger: sayiYaz(o.kalite_bekleyen_parti), birim: o.kalite_bekleyen_parti == null ? '' : 'parti', ikon: 'saat', alt: 'son 30 günde açılan' }));
      var gn = v.gunluk || [], ciftler = gn.map(function (x) { return { e: gunKisa(x.gun), giren: x.giren, cikan: x.cikan }; });
      var ham = ciftler.filter(function (x) { return x.giren != null || x.cikan != null; }), toplam = 0;
      ham.forEach(function (x) { toplam += (x.giren || 0) + (x.cikan || 0); });
      var kok2 = h('div');
      kok2.appendChild(k);
      if (!ham.length) kok2.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Hareket bilgisi şu an alınamıyor.' }));
      else if (!toplam) kok2.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Son 7 günde sterilizasyon deposunda hareket olmadı.' }));
      else {
        kok2.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Giren adet', alt: 'son 7 gün', govde: G.cubuk(ciftler.map(function (x) { return { e: x.e, d: x.giren }; }), { ad: 'Günlük giren adet' }) })]));
        kok2.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Çıkan adet', alt: 'son 7 gün', govde: G.cubuk(ciftler.map(function (x) { return { e: x.e, d: x.cikan }; }), { ad: 'Günlük çıkan adet', renk: 'var(--s2)' }) })]));
      }
      return kok2;
    }

    function lotlar(v) {
      var l = v.lotlar || [], kap = h('div');
      if (!l.length) { kap.appendChild(G.bos({ baslik: 'Lot kaydı yok', metin: 'Sterilizasyon deposunda lot bulunamadı.' })); return kap; }
      var inp = h('input', { sinif: 's41-ara', type: 'search', autocomplete: 'off', placeholder: 'Ürün veya lot ara', 'aria-label': 'Ürün veya lot ara' });
      var liste = h('div');
      function ciz() {
        liste.textContent = '';
        var n = MM.aramaNorm(q), s = l.filter(function (x) { return !n || MM.aramaNorm((x.urun || '') + ' ' + (x.lot || '')).indexOf(n) >= 0; });
        liste.appendChild(G.tablo({ sayfa: 20, bos: 'Eşleşen lot yok.', satirlar: s, kolonlar: [
          { k: 'urun', ad: 'Ürün' }, { k: 'lot', ad: 'Lot' },
          { k: 'adet_depoda', ad: 'Depoda', sag: true, ciz: function (r) { return sayiYaz(r.adet_depoda); } },
          { k: 'giren', ad: 'Giren', sag: true, ciz: function (r) { return sayiYaz(r.giren); } },
          { k: 'cikan', ad: 'Çıkan', sag: true, ciz: function (r) { return sayiYaz(r.cikan); } },
          { k: 'son_hareket', ad: 'Son hareket', ciz: function (r) { return tarihTR(r.son_hareket); } },
          { k: 'durum', ad: 'Durum', ciz: function (r) { return r.durum === 'Depoda' ? 'Depoda' : 'Sevk edildi'; } }] }));
      }
      inp.addEventListener('input', function () { q = inp.value; ciz(); });
      kap.appendChild(h('div', { sinif: 's41-bar' }, [inp])); kap.appendChild(liste); ciz();
      return kap;
    }

    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Sterilizasyon alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri;
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      var dk = MM.yasDk(v.veri_tarihi || v.uretildi);
      if (v.eski === true || dk == null || dk > ESKI_DK) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '. Miktarlar güncel olmayabilir.']));
      var sek = [['bugun', 'Bugün'], ['lotlar', 'Lotlar']];   
      ust.appendChild(G.sekmeler(sek, sekme, function (id) { sekme = id; ciz(); }, { ad: 'Sterilizasyon görünümleri' }));
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
