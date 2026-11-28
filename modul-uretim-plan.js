


(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, ESKI_DK = 26 * 60;

  function sayiYaz(n) { return n == null || !isFinite(n) ? '—' : G.say(n); }
  function ondalik(n) { return n == null || !isFinite(n) ? '—' : (Math.round(n * 10) / 10).toLocaleString(window.MM_LOC || 'tr-TR'); }
  function tarihTR(iso) { if (!iso) return '—'; var p = String(iso).slice(0, 10).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : '—'; }
  function tarihSaat(iso) { if (!iso) return '—'; var s = String(iso); return tarihTR(s) + (s.length >= 16 ? ' ' + s.slice(11, 16) : ''); }
  function yuzde(n) { return n == null || !isFinite(n) ? '—' : '%' + G.say(Math.round(n * 100)); }
  function birimAd(b) { return b === 'metre' ? 'metre' : (b === 'adet' ? 'adet' : (b || '')); }
  function metin(v) { return v == null || v === '' ? '—' : String(v); }
   
  function temizle(s) {
    return String(s == null ? '' : s).replace(/teyitsiz/gi, 'kesin değil').replace(/teyit/gi, 'doğrulama').replace(/\bSAP\b\s*/g, '').replace(/\s*\(\s*,?\s*yazışma\s*\)/gi, '').replace(/,\s*yazışma/gi, '').replace(/\s{2,}/g, ' ').trim();
  }
  function etiket(m, tur) { return h('span', { sinif: 'etiket' + (tur ? ' ' + tur : ''), metin: m }); }

  var PARAM_AD = {
    ic_cihaz_koli_dongu: 'İç cihaz: döngü başına koli', ic_cihaz_koli_gun: 'İç cihaz: günlük koli', karantina_saat: 'Karantina süresi',
    risus_koli_hafta: 'Dış sterilizasyon (1): haftalık koli', yuce_koli_gun: 'Dış sterilizasyon (2): günlük koli', fason_gidis_donus_saat: 'Dış sterilizasyon: gidiş dönüş süresi',
    dis_steril_uygunluk: 'Dış sterilizasyon uygunluğu', arac_palet_kapasitesi: 'Araç palet kapasitesi', sevk_paleti_koli_adedi: 'Sevk paleti koli adedi',
    hedef_spanc_gunluk: 'Spanç günlük hedef', hedef_mabotex_gunluk: 'Mabotex günlük hedef', hedef_otomatik_batin_gunluk: 'Otomatik batın günlük hedef',
    ornek_olculen_parametre: 'Ölçülen değer'
  };
  var PARAM_BIRIM = { 'koli/döngü': 'koli/döngü', 'koli/gün': 'koli/gün', 'koli/hafta': 'koli/hafta', saat: 'saat' };
  var TUR_AD = {
    yazisma: 'Yazışma', talimat: 'Talimat', yonetim_bilgisi: 'Yönetim bilgisi', sistem_kaydi: 'Sistem kaydı',
    sistem_kaydi_tek_pencere: 'Sistem kaydı (tek dönem)', whatsapp_mesajindan_turetilmis: 'Mesajdan türetilmiş', yok: '—'
  };
  var AILE_AD = { dokuma: 'Dokuma', mabotex: 'Mabotex', cin: 'Çin makineleri', otomatik_batin: 'Otomatik batın', manuel_batin: 'Manuel batın', spanc_ortak: 'Spanç ortak', diger: 'Diğer' };
  function paramAd(ad) { return PARAM_AD[ad] || String(ad || '').replace(/_/g, ' '); }
  function kaynakAd(a, i) {
    var s = String(a || '').toLowerCase();
    if (/okuma/.test(s)) return 'Sipariş ve stok';
    if (/hareket/.test(s)) return 'Üretim onayı ve depo hareketi';
    if (/dokuma|mabotex/.test(s)) return 'Dokuma ve Mabotex sayacı';
    if (/çin|cin|batın|batin/.test(s)) return 'Çin ve batın sayacı';
    return 'Veri ' + (i + 1);
  }
  function olcumAd(k) { return k === 'makine_sayaci' ? 'Makine sayacı' : (k === 'sap_onayi' ? 'Üretim onayı' : '—'); }

  MM.moduller['uretim-plan'] = function (kok) {
    var yuk = null, hata = null, canli = true, sekme = 'hat', sirket = 'hepsi';
    kok.appendChild(G.sayfaBasi({ baslik: 'Üretim Planı', alt: 'Hat yükü, açık siparişler ve sterilizasyon önerileri', kirinti: [['Üretim Planı']] }));
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);

     
    function hedefMetin(a) {
      if (a.hedef == null) return a.hedef_durum === 'yok' || a.hedef_durum == null ? '—' : '—';
      return G.say(a.hedef) + ' ' + birimAd(a.birim) + '/gün';
    }
    function hedefHucre(a) {
      var k = h('span', {}, [hedefMetin(a)]);
      if (a.hedef != null && a.hedef_durum === 'teyitsiz') { k.appendChild(document.createTextNode(' ')); k.appendChild(etiket('Kesin değil', 'tahmin')); }
      return k;
    }
    function hatYuku(v) {
      var hy = v.hat_yuku || {}, aileler = hy.aileler || [], kap = h('div');
      if (!aileler.length) { kap.appendChild(G.bos({ baslik: 'Hat yükü yok', metin: 'Hat yükü bilgisi şu an alınamıyor.' })); return kap; }
      var ciftler = aileler.filter(function (a) { return a.kac_gunluk_is != null; }).map(function (a) { return { e: a.etiket || AILE_AD[a.aile] || a.aile, d: a.kac_gunluk_is }; });
      var kutular = [];
      aileler.forEach(function (a) {
        if (a.kac_gunluk_is == null) return;
        kutular.push({ baslik: a.etiket || AILE_AD[a.aile] || a.aile, deger: ondalik(a.kac_gunluk_is), birim: a.kac_gunluk_is == null ? '' : 'günlük iş', ikon: 'makine',
          alt: 'Açık iş ' + sayiYaz(a.acik_uretim_yuku) + (a.acik_uretim_yuku == null ? '' : ' ' + birimAd(a.birim)) + ' · günlük ort. ' + sayiYaz(a.son10_ort) });
      });
      (hy.toplam_hedefler || []).forEach(function (t) {
        if (t.hedef == null) return;
        kutular.push({ baslik: (t.ad === 'spanc_toplam' ? 'Spanç toplam hedef' : metin(t.etiket)), deger: t.hedef == null ? '—' : G.say(t.hedef), birim: t.hedef == null ? '' : birimAd(t.birim),
          ikon: 'hedef', etiket: t.hedef != null && t.hedef_durum === 'teyitsiz' ? { metin: 'Kesin değil', tur: 'tahmin' } : null,
          alt: 'Son 10 iş günü toplamı: ' + sayiYaz(t.toplam_son10_ort) });
      });
      kap.appendChild(G.ozetSerit(kutular, { en: 4 }));
      var dar = window.innerWidth < 600;
      var grafikGovde = !ciftler.length ? h('p', { sinif: 'ny-ipucu', metin: 'Hesaplanabilen hat ailesi yok.' })
        : G.yatay(ciftler.map(function (c) { return { e: c.e, d: c.d, etiketDeger: ondalik(c.d) + ' gün' }; }), {});   
      var grafikKart = h('div', { sinif: 'ust-bosluk' }, [G.kart({ sinif: 'up-grafik', baslik: 'Hat ailesi yükü', alt: 'açık işin kaç günlük olduğu', govde: grafikGovde })]);
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Hat aileleri', alt: 'son 10 iş günü ortalaması', govde: G.tablo({ sayfa: 10, bos: 'Hat ailesi yok.', satirlar: aileler, kolonlar: [
        { k: 'etiket', ad: 'Hat ailesi', ciz: function (r) { return r.etiket || AILE_AD[r.aile] || r.aile; } },
        { k: 'acik_uretim_yuku', ad: 'Açık iş', sag: true, tur: 'sayi', ciz: function (r) { return r.acik_uretim_yuku == null ? '—' : G.say(r.acik_uretim_yuku) + ' ' + birimAd(r.birim); } },
        { k: 'son10_ort', ad: 'Günlük ort.', sag: true, tur: 'sayi', ciz: function (r) { return sayiYaz(r.son10_ort); } },
        { k: 'kac_gunluk_is', ad: 'Kaç günlük iş', sag: true, tur: 'sayi', ciz: function (r) { return ondalik(r.kac_gunluk_is); } },
        { k: 'hedef', ad: 'Hedef', sag: true, tur: 'sayi', ciz: hedefHucre },
        { k: 'olcum_kaynagi', ad: 'Ölçüm', ciz: function (r) { return olcumAd(r.olcum_kaynagi); } }] }) })]));
      kap.appendChild(grafikKart);
      var mab = null; aileler.forEach(function (a) { if (a.aile === 'mabotex' && a.hatlar && a.hatlar.length) mab = a; });
      if (mab) kap.appendChild(h('details', { sinif: 'ust-bosluk up-acilir' }, [h('summary', { sinif: 'up-ozet', metin: 'Mabotex hatları (' + mab.hatlar.length + ')' }), G.kart({ baslik: 'Mabotex hatları', alt: 'hat bazında', govde: G.tablo({ sayfa: 10, bos: 'Hat yok.', satirlar: mab.hatlar, kolonlar: [
        { k: 'hat', ad: 'Hat' },
        { k: 'acik_uretim_yuku', ad: 'Açık iş', sag: true, tur: 'sayi', ciz: function (r) { return r.acik_uretim_yuku == null ? '—' : G.say(r.acik_uretim_yuku) + ' ' + birimAd(r.birim); } },
        { k: 'son10_ort', ad: 'Günlük ort.', sag: true, tur: 'sayi', ciz: function (r) { return sayiYaz(r.son10_ort); } },
        { k: 'kac_gunluk_is', ad: 'Kaç günlük iş', sag: true, tur: 'sayi', ciz: function (r) { return ondalik(r.kac_gunluk_is); } }] }) })]));
      var es = hy.esleme;
      if (es && (es.eslenen_oran != null || es.eslenmeyen_oran != null)) kap.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Ürün eşleme: ' + yuzde(es.eslenen_oran) + ' eşlendi · ' + yuzde(es.eslenmeyen_oran) + ' Diğer hatlarda' }));
      return kap;
    }

     
    function stokYaz(s) {
      s = s || {};
      return 'Steril ' + sayiYaz(s.steril) + ' · Sterilsiz ' + sayiYaz(s.sterilsiz) + ' · Karantina ' + sayiYaz(s.karantina);
    }
    function siparisler(v) {
      var sp = v.siparisler || {}, sk = sp.sirketler || [], kap = h('div'), satirlar = [];
      sk.forEach(function (s) { if (sirket === 'hepsi' || s.sirket === sirket) (s.satirlar || []).forEach(function (r) { satirlar.push(Object.assign({ _sirket: s.sirket }, r)); }); });
      var eksikSay = 0, uretimsiz = 0;
      satirlar.forEach(function (r) { if (r.eksik_miktar != null && r.eksik_miktar > 0) { eksikSay++; if (r.bagli_uretim_var === false) uretimsiz++; } });
      var dogr = !!(v.sterilizasyon_ic && v.sterilizasyon_ic.depo_tanimi_dogrulandi === true);
      if (!sk.length) { kap.appendChild(G.bos({ baslik: 'Açık sipariş yok', metin: 'Açık sipariş bilgisi şu an alınamıyor.' })); return kap; }
      kap.appendChild(G.cipler([['hepsi', 'Tümü'], ['MY', 'MY'], ['DAY', 'DAY']], sirket, function (x) { sirket = x; ciz(); }, 'Şirket'));
      var k = h('div', { sinif: 'kpi-izgara ust-bosluk' });
      k.appendChild(G.kpi({ baslik: 'Açık sipariş satırı', deger: G.say(satirlar.length), ikon: 'siparis' }));
      k.appendChild(G.kpi({ baslik: 'Eksiği olan satır', deger: G.say(eksikSay), ikon: 'uyari' }));
      k.appendChild(G.kpi({ baslik: 'Eksik olup üretimi açılmamış', deger: G.say(uretimsiz), ikon: 'makine' }));
      kap.appendChild(k);
      if (!dogr) kap.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Depo tanımı doğrulanmadı' }), ' — stok kırılımı (steril, sterilsiz, karantina) kesin olmayabilir.']));
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.tablo({ sayfa: 10, bos: 'Eşleşen sipariş yok.', satirlar: satirlar, kolonlar: [
        { k: '_sirket', ad: 'Şirket' },
        { k: 'musteri_kisa', ad: 'Müşteri', ciz: function (r) { return metin(r.musteri_kisa); } },
        { k: 'urun', ad: 'Ürün', ciz: function (r) { return metin(r.urun); } },
        { k: 'istenen_teslim', ad: 'İstenen teslim', ciz: function (r) { return tarihTR(r.istenen_teslim); } },
        { k: 'teyitli_teslim', ad: 'Söz verilen teslim', ciz: function (r) { return tarihTR(r.teyitli_teslim); } },
        { k: 'siparis_miktar', ad: 'Sipariş', sag: true, tur: 'sayi', ciz: function (r) { return r.siparis_miktar == null ? '—' : G.say(r.siparis_miktar) + ' ' + metin(r.birim).replace('—', ''); } },
        { k: 'eksik_miktar', ad: 'Eksik', sag: true, tur: 'sayi', ciz: function (r) { return r.eksik_miktar == null ? '—' : G.say(r.eksik_miktar) + ' ' + metin(r.birim).replace('—', ''); } },
        { k: 'stok', ad: 'Stok', deger: function (r) { return stokYaz(r.stok); }, ciz: function (r) { return stokYaz(r.stok); } },
        { k: 'bagli_uretim_var', ad: 'Üretim', ciz: function (r) { return r.bagli_uretim_var == null ? '—' : (r.bagli_uretim_var ? 'Açık' : 'Yok'); } }] })]));
      if (sp.ic_siparis_cift_sayim_ayiklandi != null) kap.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Şirketler arası siparişlerden ayıklanan satır: ' + G.say(sp.ic_siparis_cift_sayim_ayiklandi) }));
      return kap;
    }

     
    function sterilizasyon(v) {
      var s = v.sterilizasyon_ic, kap = h('div');
      if (!s) { kap.appendChild(G.bos({ baslik: 'Sterilizasyon planı yok', metin: 'Sterilizasyon bilgisi şu an alınamıyor.' })); return kap; }
      if (s.depo_tanimi_dogrulandi !== true) kap.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Depo tanımı doğrulanmadı' }), ' — kuyruk ve öneriler stok kırılımına dayanır, kesin olmayabilir.']));
      var kuyruk = s.kuyruk, oner = s.dongu_onerileri, toplamKoli = null, toplamPalet = null;
      if (kuyruk) { toplamKoli = 0; toplamPalet = 0; kuyruk.forEach(function (r) { toplamKoli += r.koli || 0; toplamPalet += r.palet || 0; }); }
      var k = h('div', { sinif: 'kpi-izgara' + (kap.firstChild ? ' ust-bosluk' : '') });
      k.appendChild(G.kpi({ baslik: 'Günlük iç cihaz kapasitesi', deger: sayiYaz(s.kapasite_gunluk_koli), birim: s.kapasite_gunluk_koli == null ? '' : 'koli/gün', ikon: 'saat',
        etiket: s.kapasite_gunluk_koli != null && s.kapasite_durum === 'teyitsiz' ? { metin: 'Kesin değil', tur: 'tahmin' } : null }));
      k.appendChild(G.kpi({ baslik: 'Sterilizasyon kuyruğu', deger: sayiYaz(toplamKoli), birim: toplamKoli == null ? '' : 'koli', ikon: 'stok', alt: toplamPalet == null ? '' : G.say(toplamPalet) + ' palet' }));
      kap.appendChild(k);
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Kuyruk', alt: 'sterilizasyon bekleyen', govde: kuyruk == null ? h('p', { sinif: 'ny-ipucu', metin: 'Kuyruk hesaplanamadı.' }) : G.tablo({ sayfa: 10, bos: 'Kuyrukta ürün yok.', satirlar: kuyruk, kolonlar: [
        { k: 'urun', ad: 'Ürün', ciz: function (r) { return metin(r.urun); } },
        { k: 'koli', ad: 'Koli', sag: true, tur: 'sayi', ciz: function (r) { return sayiYaz(r.koli); } },
        { k: 'palet', ad: 'Palet', sag: true, tur: 'sayi', ciz: function (r) { return sayiYaz(r.palet); } },
        { k: 'teslim_tarihi', ad: 'Teslim', ciz: function (r) { return tarihTR(r.teslim_tarihi); } },
        { k: 'oncelik', ad: 'Öncelik', ciz: function (r) { return metin(r.oncelik); } }] }) })]));
      var on = h('div');
      if (oner == null) on.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Döngü önerisi hesaplanamadı.' }));
      else if (!oner.length) on.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Şu an döngü önerisi yok.' }));
      else oner.forEach(function (d) {
        var dy = (d.dayanak || []).map(function (x) { return h('li', { metin: temizle(x) }); });
        on.appendChild(h('div', { sinif: 'up-dongu' }, [
          h('div', { sinif: 'up-dongu-ust' }, [h('strong', { metin: tarihTR(d.tarih) }), d.taslak ? etiket('Taslak', 'tahmin') : null]),
          h('div', { sinif: 'up-dongu-say', metin: sayiYaz(d.koli) + ' koli · ' + sayiYaz(d.palet) + ' palet' }),
          h('div', { sinif: 'up-dongu-alt', metin: 'Bitiş ' + tarihSaat(d.bitis_tahmini) + ' · Sevke hazır ' + tarihSaat(d.sevke_hazir) }),
          dy.length ? h('ul', { sinif: 'up-dayanak' }, dy) : null]));
      });
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Döngü önerileri', govde: on })]));
      return kap;
    }

     
    function degerler(v) {
      var kap = h('div'), kn = v.kaynaklar || [], ps = v.parametreler || [];
      var gun = h('div', { sinif: 'up-liste' });
      if (!kn.length) gun.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Güncellik bilgisi yok.' }));
      kn.forEach(function (a, i) {
        var m = a.itibariyla == null ? 'Veri yok' : tarihSaat(a.itibariyla);
        gun.appendChild(h('div', { sinif: 'up-satir' }, [h('span', { sinif: 'up-ad', metin: kaynakAd(a.ad, i) }), h('span', { sinif: 'up-deger' }, [m, a.eski === true ? ' ' : null, a.eski === true ? etiket('Eski', 'kismi') : null])]));
      });
      kap.appendChild(G.kart({ baslik: 'Veri güncelliği', alt: 'her bilginin son tarihi', govde: gun }));
      var lst = h('div', { sinif: 'up-liste' });
      if (!ps.length) lst.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Değer bilgisi yok.' }));
      ps.forEach(function (p) {
        var yokMu = p.durum === 'yok' || p.deger == null;
        var degerNode = h('span', { sinif: 'up-deger' }, [yokMu ? '—' : G.say(p.deger) + ' ' + (PARAM_BIRIM[p.birim] || p.birim || ''), !yokMu && p.durum === 'teyitsiz' ? ' ' : null, !yokMu && p.durum === 'teyitsiz' ? etiket('Kesin değil', 'tahmin') : null, yokMu ? ' ' : null, yokMu ? etiket('Veri yok', 'kismi') : null]);
        var ayr = h('div', { sinif: 'up-ayrinti', hidden: true }, [
          h('span', { metin: 'Dayanak türü: ' + (TUR_AD[p.kaynak_turu] || '—') }),
          h('span', { metin: 'Tarih: ' + tarihTR(p.itibariyla) }),
          p.n != null ? h('span', { metin: 'Gözlem sayısı: ' + G.say(p.n) }) : null]);
        var d = h('button', { type: 'button', sinif: 'up-satir up-tikla', 'aria-expanded': 'false' }, [h('span', { sinif: 'up-ad', metin: paramAd(p.ad) }), degerNode]);
        d.addEventListener('click', function () { var ac = ayr.hidden; ayr.hidden = !ac; d.setAttribute('aria-expanded', String(ac)); });
        lst.appendChild(h('div', { sinif: 'up-par' }, [d, ayr]));
      });
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Planlama değerleri', alt: 'dokununca ayrıntı', govde: lst })]));
      return kap;
    }

    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) {
        if (hata.kod === 'bulunamadi') { govde.appendChild(G.bos({ baslik: 'Veri henüz yok', metin: 'Üretim planı hazırlandığında burada görünecek.', eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
        govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Üretim planı alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return;
      }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri || {};
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      var dk = MM.yasDk(v.uretildi || v.itibariyla);
      if (v.eski === true || dk == null || dk > ESKI_DK) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '. Miktarlar güncel olmayabilir.']));
      var sek = [['hat', 'Hat yükü'], ['siparis', 'Siparişler'], ['steril', 'Sterilizasyon'], ['deger', 'Değerler']];
      ust.appendChild(G.sekmeler(sek, sekme, function (id) { sekme = id; ciz(); }, { ad: 'Üretim planı görünümleri' }));
      govde.appendChild(sekme === 'siparis' ? siparisler(v) : (sekme === 'steril' ? sterilizasyon(v) : (sekme === 'deger' ? degerler(v) : hatYuku(v))));
    }
    function yenile() {
      hata = null; yuk = null; ciz();
      window.MMVeri.oku('uretim-plan', 'uretim-plan').then(function (r) { yuk = r; hata = null; })
        .catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); });
    }
    yenile();
    return function () { canli = false; };
  };
})();
