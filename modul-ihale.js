



(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, ESKI_DK = 24 * 60, LOC = window.MM_LOC || 'tr-TR';
  var GRUPLAR = [['hepsi', 'Hepsi'], ['spanc', 'Spanç'], ['batin', 'Batın'], ['gazli-bez', 'Gazlı bez'], ['eldiven', 'Eldiven'], ['tampon', 'Tampon']];
  var GRUP_AD = { 'spanc': 'Spanç', 'batin': 'Batın', 'gazli-bez': 'Gazlı bez', 'eldiven': 'Eldiven', 'tampon': 'Tampon' };

  function sayiYaz(n, ond) { return n == null || typeof n !== 'number' || !isFinite(n) ? '—' : n.toLocaleString(LOC, { minimumFractionDigits: ond || 0, maximumFractionDigits: ond == null ? 0 : Math.max(ond, 4) }); }
  function tl(n) { return n == null || typeof n !== 'number' || !isFinite(n) ? '—' : n.toLocaleString(LOC, { minimumFractionDigits: 2, maximumFractionDigits: 4 }); }
  function bugunIst() { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  function kalanGun(iso) {
    if (!iso) return null;
    var a = String(iso).slice(0, 10).split('-'), b = bugunIst().split('-');
    if (a.length !== 3 || b.length !== 3) return null;
    var d = Math.round((Date.UTC(+a[0], +a[1] - 1, +a[2]) - Date.UTC(+b[0], +b[1] - 1, +b[2])) / 864e5);
    return isFinite(d) ? d : null;
  }
  function tarihTR(iso) { if (!iso) return null; var p = String(iso).slice(0, 10).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : null; }
  function saatDk(iso) { var m = /T(\d\d:\d\d)/.exec(String(iso || '')); return m ? m[1] : null; }
  function durumMetin(s) {
    s = String(s || '');
    if (/karar bekleniyor/i.test(s)) return 'Karar aşamasında';
    if (/tekl[i]f/i.test(s)) return 'Satış müdürü işlemde';
    if (/\b(hanım|hanim|bey)\b/i.test(s)) return /işlemde/i.test(s) ? 'Satış müdürü işlemde' : 'İşlemde';   
    return s || 'Açık';
  }
  function ilgili(k) { return k && k.ilgi === 'ilgili'; }
  function kisalt(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; }

  MM.moduller.ihale = function (kok) {
    var yuk = null, hata = null, canli = true;
    var bantDmo = null, maliyet = null;
    var SAHA = !!(window.MMVeri && window.MMVeri.sahaKip && window.MMVeri.sahaKip());   
    var durum = { sekme: 'dmo', ilgiliYalniz: true, grup: 'hepsi', q: '', fiyat: {} };
    var secili = {};   

    kok.appendChild(G.sayfaBasi({ baslik: 'İhaleler', alt: 'Açık ihaleler ve bizimle ilgili kalemler', kirinti: [['İhaleler']] }));
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);

    function dmoFiyatGor() { return !SAHA && window.MMVeri.ozelErisim('dmo-fiyat-gor'); }
    function maliyetGor() { return !SAHA && window.MMVeri.ozelErisim('dmo-maliyet'); }

    function bantKayit(ih, k) {   
      if (ih.bolum === 'dmo') {
        if (!dmoFiyatGor() || !bantDmo) return {};
        var il = (bantDmo.ihaleler || []).filter(function (x) { return x.id === ih.id; })[0];
        return (il && (il.kalemler || []).filter(function (x) { return x.no === k.no; })[0]) || {};
      }
      return k || {};
    }
    var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    function ayYil(s) { var m = /^(\d{4})-(\d{2})/.exec(String(s || '')); return m && AY[+m[2] - 1] ? AY[+m[2] - 1] + ' ' + m[1] : null; }
    function T(s) { return MM.t ? MM.t(s) : s; }
    function tarihGoster(t) { return t && String(t).length === 7 ? ayYil(t) : tarihTR(t); }   
    
    
    function segmentler(ih, k) {
      var bd = null, s = { dmo: null, devlet: null, universite: null }, tavan = null;
      if (dmoFiyatGor() && bantDmo) {
        var il = (bantDmo.ihaleler || []).filter(function (x) { return x.id === ih.id; })[0];
        bd = (il && (il.kalemler || []).filter(function (x) { return x.no === k.no; })[0]) || null;
      }
      if (ih.bolum === 'dmo') { if (bd && bd.segmentler) { s = bd.segmentler; tavan = bd.tavan || null; } }
      else {
        var ks = k.segmentler || {};
        s.devlet = ks.devlet || null; s.universite = ks.universite || null;
        if (bd && bd.segmentler) { s.dmo = bd.segmentler.dmo || null; tavan = bd.tavan || null; }
      }
      return { s: s, tavan: tavan, dmoGor: !!bd };
    }
    function segSatiri(ad, kay, not) {
      var var_ = kay && typeof kay.fiyat === 'number' && isFinite(kay.fiyat), tar = var_ ? tarihGoster(kay.tarih) : null;
      var alt = [];
      if (tar) alt.push(tar);
      if (var_ && kay.aralik && kay.aralik.length === 2) alt.push(T('Aralık') + ' ' + tl(kay.aralik[0]) + '–' + tl(kay.aralik[1]));
      if (not) alt.push(not);
      return h('div', { sinif: 'ih-seg' + (var_ ? '' : ' yok') }, [
        h('span', { sinif: 'ih-seg-ad', metin: ad }),
        h('strong', { sinif: 'ih-seg-fiyat', metin: var_ ? tl(kay.fiyat) + ' TL' : T('Fiyat bulunamadı') }),
        h('small', { sinif: 'ih-seg-alt', metin: alt.join(' · ') })]);
    }
    function maliyetBul(ih, k) {
      if (ih.bolum !== 'dmo' || !maliyetGor() || !maliyet) return undefined;
      var il = (maliyet.ihaleler || []).filter(function (x) { return x.id === ih.id; })[0];
      var kk = il && (il.kalemler || []).filter(function (x) { return x.no === k.no; })[0];
      return kk || null;
    }
    function karaEtiketi(ih) { return ih.bolum === 'dmo' ? 'öneri; karar: yönetim' : 'öneri; karar: satış'; }
    
    function karaEtiketMetin(e, ih) {
      e = String(e || '');
      if (/^öneri; karar:? (\S+ bey|yönetim)$/i.test(e)) return 'öneri; karar: yönetim';   
      if (/^öneri; karar:? (\S+ hanım|satış)$/i.test(e)) return 'öneri; karar: satış';   
      return karaEtiketi(ih);
    }

    function secimAl(ih) {
      if (!secili[ih.id]) { var s = {}; (ih.kalemler || []).forEach(function (k) { if (ilgili(k)) s[k.no] = true; }); secili[ih.id] = s; }
      return secili[ih.id];
    }
    function mailHref(ih) {
      var s = secimAl(ih), nolar = (ih.kalemler || []).filter(function (k) { return s[k.no]; }).map(function (k) { return k.no; });
      var konu = '[Talimat] İhale fiyat önerisi — ' + kisalt(ih.kurum, 60) + ' ' + (ih.ikn || ih.id);
      var govdeM = 'İhale: ' + ih.id + '\nKalem no: ' + (nolar.length ? nolar.join(', ') : '(seçilmedi)') + '\n';
      var p = window.MM.talimatPosta || ''; if (!p) return '';
      return 'mailto:' + p + '?subject=' + encodeURIComponent(konu) + '&body=' + encodeURIComponent(govdeM);
    }

    function bandSatiri(ih, k) {
      var sg = segmentler(ih, k), mal = maliyetBul(ih, k), kay = bantKayit(ih, k);
      var kutu = h('div', { sinif: 'ih-fk' }, [h('div', { sinif: 'ih-fk-ad', metin: T('Kalem') + ' ' + k.no + ' · ' + (k.tanim || '') }),
        h('p', { sinif: 'ih-alt', metin: T('Son fiyatımız (TL/adet)') })]);
      var grid = h('div', { sinif: 'ih-seg-liste' });
      if (sg.dmoGor) grid.appendChild(segSatiri(T('DMO'), sg.s.dmo));
      grid.appendChild(segSatiri(T('Devlet hastaneleri'), sg.s.devlet));
      grid.appendChild(segSatiri(T('Üniversite hastaneleri'), sg.s.universite, T('vade ~1,5 yıl')));
      kutu.appendChild(grid);
      var tv = sg.tavan && typeof sg.tavan.fiyat === 'number' && isFinite(sg.tavan.fiyat) ? sg.tavan : null;
      kutu.appendChild(h('p', { sinif: 'ih-tavan' + (tv ? '' : ' yok'), metin: tv ? T('Tavan') + ': ' + tl(tv.fiyat) + ' TL' + (tarihGoster(tv.tarih) ? ' · ' + tarihGoster(tv.tarih) : '') : T('Tavan: bilinmiyor') }));
      if (mal !== undefined) {
        if (mal && mal.maliyet_tabani != null && isFinite(mal.maliyet_tabani)) {
          kutu.appendChild(h('p', { sinif: 'ih-maliyet', metin: 'Maliyet tabanı: ' + tl(mal.maliyet_tabani) + ' TL/adet' }));
          if (mal.bant_maliyet_alti === true) kutu.appendChild(h('p', { sinif: 'ih-uyari', role: 'alert', metin: 'Bant maliyetin altında' }));
        } else kutu.appendChild(h('p', { sinif: 'ih-yok', metin: 'maliyet modeli yok' }));
      }
      kutu.appendChild(h('p', { sinif: 'ih-etiket', metin: karaEtiketMetin(k.etiket, ih) }));
      return kutu;
    }

    function fiyatPaneli(ih) {
      var s = secimAl(ih), liste = (ih.kalemler || []).filter(function (k) { return s[k.no]; });
      var p = h('div', { sinif: 'ih-panel', role: 'region', 'aria-label': 'Fiyat önerisi' }, [h('h4', { metin: 'Fiyat önerisi' })]);
      if (!liste.length) { p.appendChild(h('p', { sinif: 'ih-yok', metin: 'Kalem seçilmedi.' })); return p; }
      liste.forEach(function (k) { p.appendChild(bandSatiri(ih, k)); });
      return p;
    }

    function kalemListesi(ih, yeniden) {
      var s = secimAl(ih), liste = (ih.kalemler || []).filter(function (k) { return !durum.ilgiliYalniz || ilgili(k); });
      var kap = h('div', { sinif: 'ih-kalemler' });
      if (!liste.length) { kap.appendChild(h('p', { sinif: 'ih-yok', metin: ih.kalem_sayisi ? 'Bizimle ilgili kalem yok.' : 'Kalem bilgisi yok.' })); return kap; }
      var mail;
      liste.forEach(function (k) {
        var satir = h('label', { sinif: 'ih-kalem' + (ilgili(k) ? '' : ' ilgisiz') });
        var kutu = h('input', { type: 'checkbox', 'aria-label': 'Kalem ' + k.no + ' seç', hidden: SAHA });
        kutu.checked = !!s[k.no];
        kutu.addEventListener('change', function () { if (kutu.checked) s[k.no] = true; else delete s[k.no]; if (mail) mail.setAttribute('href', mailHref(ih)); if (durum.fiyat[ih.id]) yeniden(); });
        var miktar = k.miktar != null && isFinite(k.miktar) ? sayiYaz(k.miktar) + (k.birim ? ' ' + String(k.birim).toLowerCase() : '') : 'miktar yok';
        satir.appendChild(kutu);
        satir.appendChild(h('span', { sinif: 'ih-kalem-metin' }, [h('span', { sinif: 'ih-kalem-no', metin: String(k.no) }), h('span', { sinif: 'ih-kalem-tanim', metin: k.tanim || '—' }), h('span', { sinif: 'ih-kalem-miktar', metin: miktar })]));
        if (k.grup && GRUP_AD[k.grup]) satir.appendChild(h('span', { sinif: 'ih-rozet-grup g-' + k.grup, metin: GRUP_AD[k.grup] }));
        kap.appendChild(satir);
      });
      var eylem = h('div', { sinif: 'ih-eylem' });
      var fiyatVar = !SAHA && (ih.bolum !== 'dmo' || dmoFiyatGor());
      if (fiyatVar) eylem.appendChild(h('button', { type: 'button', sinif: 'dugme ih-fiyat-dugme', 'aria-expanded': durum.fiyat[ih.id] ? 'true' : 'false', onclick: function () { durum.fiyat[ih.id] = !durum.fiyat[ih.id]; yeniden(); } }, ['Fiyat önerisi']));
      if (!SAHA) {
        mail = h('a', { sinif: 'dugme ih-mail-dugme', href: mailHref(ih), hidden: !mailHref(ih), metin: 'Mail at' });
        eylem.appendChild(mail);
        kap.appendChild(eylem);
        kap.appendChild(h('p', { sinif: 'ih-ipucu', metin: 'Asistan önerili tabloyu kontrol edip size mail eder' }));
      }
      if (fiyatVar && durum.fiyat[ih.id]) { var fp = fiyatPaneli(ih); fp.setAttribute('data-fiyat', '1'); kap.appendChild(fp); }
      return kap;
    }
    function detayAc(ih) {
      G.sheet(kisalt(ih.kurum || ih.id, 60), function (g) {
        function kur() { g.textContent = ''; g.appendChild(kalemListesi(ih, kur)); }
        kur();
      }).ac();
    }

    function kart(ih) {
      var kg = kalanGun(ih.son_tarih), tr = tarihTR(ih.son_tarih);
      var sonMetin = tr ? tr + (kg == null ? '' : kg < 0 ? ' · süresi geçti' : kg === 0 ? ' · bugün' : ' · ' + kg + ' gün kaldı') : 'son tarih bilinmiyor';
      var acil = kg != null && kg >= 0 && kg <= 7;
      var ust2 = h('button', { type: 'button', sinif: 'ih-kart-ust', 'aria-haspopup': 'dialog', onclick: function () { detayAc(ih); } }, [
        h('span', { sinif: 'ih-kurum', metin: ih.kurum || ih.id }),
        h('span', { sinif: 'ih-meta' }, [ih.ikn ? h('span', { sinif: 'ih-ikn', metin: 'İKN ' + ih.ikn }) : null, h('span', { sinif: 'ih-son' + (acil ? ' acil' : ''), metin: sonMetin })]),
        h('span', { sinif: 'ih-meta' }, [h('span', { sinif: 'etiket', metin: durumMetin(ih.durum_etiket) }), h('span', { sinif: 'ih-say', metin: (ih.ilgili_kalem == null ? 0 : ih.ilgili_kalem) + ' ilgili kalem' + (ih.kalem_sayisi ? ' · ' + ih.kalem_sayisi + ' kalem' : '') })])]);
      return h('article', { sinif: 'ih-kart' + (ih.bolum === 'dmo' ? ' dmo' : ' dis') }, [ust2]);
    }

    function rozet(v) {
      var b = v.bolumler || {}, o = durum.sekme === 'dmo' ? b.dmo : b.dis, kutu = h('div', { sinif: 'ih-rozetler' });
      var dk = o ? MM.yasDk(o.zaman) : null, eski = !o || o.eski === true || dk == null || dk > ESKI_DK;
      var metin = durum.sekme === 'dmo' ? 'DMO: robot ' + (o && saatDk(o.zaman) ? saatDk(o.zaman) : 'zamanı yok') : 'DMO dışı: günlük defter' + (o && tarihTR(o.zaman) ? ', ' + tarihTR(o.zaman) : '');
      kutu.appendChild(h('span', { sinif: 'ih-bilgi' + (eski ? ' kirmizi' : ''), role: 'status', metin: metin + (eski ? ' · eski' : '') }));
      return kutu;
    }

    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (!window.MMVeri.ozelErisim('ihale')) { govde.appendChild(G.bos({ baslik: 'Bu bölüm sizin için kapalı', metin: 'Erişim için yöneticinize başvurun.' })); return; }
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'İhaleler alınamadı', metin: hata.message || 'Bağlantı kurulamadı.', eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri || {}, tum = Array.isArray(v.ihaleler) ? v.ihaleler : [];
      var dkG = MM.yasDk(v.zaman);
      ust.appendChild(G.tazelik(v.zaman, (v.eski === true || dkG == null || dkG > ESKI_DK) ? 'eski' : 'taze'));
      var acikSay = tum.length, ilgSay = 0, yedi = 0, karar = 0;
      tum.forEach(function (x) { ilgSay += x.ilgili_kalem || 0; var g = kalanGun(x.son_tarih); if (g != null && g >= 0 && g <= 7) yedi++; if (x.durum === 'karar-bekleniyor') karar++; });
      var ozetKap = h('div', { sinif: 'ih-ozet' });
      ust.appendChild(ozetKap);
      ozetKap.appendChild(G.ozetSerit([
        { baslik: 'Açık ihale', deger: sayiYaz(acikSay), ikon: 'belge' },
        { baslik: 'İlgili kalem', deger: sayiYaz(ilgSay), ikon: 'stok' },
        { baslik: '7 gün içinde son tarih', deger: sayiYaz(yedi), ikon: 'saat', durum: yedi ? 'uyari' : null },
        { baslik: 'Karar bekleyen', deger: sayiYaz(karar), ikon: 'uyari' }], { en: 4 }));
      var sayDmo = tum.filter(function (x) { return x.bolum === 'dmo'; }).length;
      ust.appendChild(G.segment([['dmo', 'DMO', sayDmo], ['dis', 'DMO dışı', tum.length - sayDmo]], durum.sekme, function (id) { durum.sekme = id; ciz(); }, { ad: 'İhale türleri' }));
      var eskiBolum = (function () { var b = v.bolumler || {}, o = durum.sekme === 'dmo' ? b.dmo : b.dis, dk = o ? MM.yasDk(o.zaman) : null; return !o || o.eski === true || dk == null || dk > ESKI_DK; })();
      if (eskiBolum) ust.appendChild(rozet(v));
      var liste2 = h('div');
      function listeCiz() {
        liste2.textContent = '';
        var n = MM.aramaNorm ? MM.aramaNorm(durum.q || '') : String(durum.q || '').toLowerCase();
        var liste = tum.filter(function (x) {
          if ((x.bolum || 'dis') !== durum.sekme) return false;
          if (durum.ilgiliYalniz && !(x.ilgili_kalem > 0)) return false;
          if (durum.grup !== 'hepsi' && !(x.kalemler || []).some(function (k) { return k.grup === durum.grup; })) return false;
          if (n) { var ham = [x.kurum, x.ikn, x.id].concat((x.kalemler || []).map(function (k) { return k.tanim; })).join(' '); if ((MM.aramaNorm ? MM.aramaNorm(ham) : ham.toLowerCase()).indexOf(n) < 0) return false; }
          return true;
        });
        liste.sort(function (a, b) { var ga = kalanGun(a.son_tarih), gb = kalanGun(b.son_tarih); if (ga == null) ga = 99999; if (gb == null) gb = 99999; return ga - gb; });
        if (!liste.length) { liste2.appendChild(G.bos({ baslik: 'İhale yok', metin: durum.ilgiliYalniz || durum.grup !== 'hepsi' || n ? 'Bu filtreyle eşleşen ihale yok.' : 'Şu an açık ihale görünmüyor.' })); return; }
        liste2.appendChild(G.ilkN(liste, kart, { n: 10, sinif: 'ih-liste' }));
      }
      var zm = null;
      var aracKutu = G.aracCubugu({
        arama: { deger: durum.q || '', yerTutucu: 'Kurum, İKN veya kalem ara', degisti: function (q) { clearTimeout(zm); zm = setTimeout(function () { durum.q = q; listeCiz(); }, 120); } },
        cipler: [{ id: 'ilgili', ad: 'Yalnız ilgili', secili: durum.ilgiliYalniz, degisti: function (s) { durum.ilgiliYalniz = s; listeCiz(); } }],
        filtre: { baslik: 'Filtre', temizle: function () { durum.grup = 'hepsi'; listeCiz(); }, gruplar: [{ ad: 'Ürün grubu', secenekler: GRUPLAR, secili: durum.grup, varsayilan: 'hepsi', sec: function (id) { durum.grup = id; listeCiz(); } }] }
      });
      if (aracKutu && aracKutu.classList) aracKutu.classList.add('ih-arac');
      ust.appendChild(aracKutu);
      govde.appendChild(liste2);
      listeCiz();
    }

    function yenile() {
      hata = null; yuk = null; bantDmo = null; maliyet = null; ciz();
      if (!window.MMVeri.ozelErisim('ihale')) return;   
      (SAHA ? window.MMVeri.oku('saha', 'acik-ihaleler') : window.MMVeri.oku('ihale', 'acik-ihaleler')).then(function (r) {
        yuk = r; hata = null;
        var js = [];
        if (dmoFiyatGor()) js.push(window.MMVeri.oku('ihale', 'ihale-dmo-bant', 'dmo-fiyat-gor').then(function (x) { bantDmo = x.veri || null; }, function () { bantDmo = null; }));
        if (maliyetGor()) js.push(window.MMVeri.oku('ihale', 'ihale-maliyet', 'dmo-maliyet').then(function (x) { maliyet = x.veri || null; }, function () { maliyet = null; }));
        return Promise.all(js);
      }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); });
    }
    yenile();
    return function () { canli = false; };
  };
})();
