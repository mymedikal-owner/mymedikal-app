





(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var ESKI_DK = 36 * 60;   

  var TUR_AD = { Z001: 'Genel / grup içi satış', Z003: 'İade faturası', Z004: 'DMO tevkifatlı', Z009: 'Bedelsiz', ZB00: 'Fiyat farkı', S1: 'Fatura iptali', S2: 'İade iptali', Z105: 'Transit ticaret (ihracat)' };
  var TON = {
    kirmizi: ['var(--kirmizi)', 'var(--kirmizi-zemin)'], turuncu: ['var(--turuncu)', 'var(--turuncu-zemin)'], sari: ['var(--sari)', 'var(--sari-zemin)'],
    yesil: ['var(--yesil)', 'var(--yesil-zemin)'], gri: ['var(--soluk)', 'var(--gri-zemin)']
  };
  function rozet(metin, ton, ikon) { var t = TON[ton] || TON.gri; return h('span', { sinif: 'tq-rozet', style: 'color:' + t[0] + ';background:' + t[1] }, [ikon ? G.ikon(ikon, 13) : null, metin]); }
  function ornekEt(t) { return h('span', { sinif: 'etiket ornek', metin: t || 'ÖRNEK' }); }
  function tarihTR(iso) { if (!iso) return '—'; var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function seri(iso) { var p = iso.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
  function bugunSeri() { var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
  function yasGun(iso) { return iso ? Math.round(bugunSeri() - seri(iso)) : null; }
  function turAd(t) { return TUR_AD[t] || 'Diğer'; }   
  function bekleyen(l) { return h('div', { sinif: 'bekle-liste' }, l.map(function (x) { return h('div', { sinif: 'bekle-oge' }, [h('span', { sinif: 'bekle-ik' }, [G.ikon(x.ikon || 'bilgi', 18)]), h('div', null, [h('b', { metin: x.baslik }), h('small', { metin: x.metin })]), h('span', { sinif: 'etiket kismi', metin: 'bekliyor' })]); })); }

  var SEKMELER = [['ozet', 'Özet'], ['mali', 'Mali tablolar'], ['tfrs', 'TFRS tabloları'], ['anlik', 'Anlık ciro'], ['ebelge', 'e-Belge'], ['aktarim', 'Aktarım'], ['kapanis', 'Kapanış'], ['mutabakat', 'Mutabakat'], ['duzeltme', 'Düzeltmeler']];

  


  function saatTR(iso) { try { return new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(new Date(iso)); } catch (e) { return '—'; } }
  function anlikTab(kok) {
    var yuk = null, hata = null, canli = true, para = function (n) { return MM.s41 ? MM.s41.para(n) : String(n); };
    function degisim(b) {
      var gy = b.gecen_yil, t = gy && gy.net != null ? 'geçen yıl aynı dönem' + (gy.gun_etiketi ? ' (' + gy.gun_etiketi + ' ' + gy.bit.slice(0, 4) + ')' : '') + ' ' + para(gy.net) : 'geçen yıl aynı dönem için veri yok';
      if (b.degisim_yuzde != null) t += ' · ' + (b.degisim_yuzde > 0 ? '+' : '−') + '%' + G.say(Math.abs(b.degisim_yuzde), 1);
      return t;
    }
    function ciz() {
      kok.textContent = '';
      if (hata) { kok.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Ciro verisi alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { kok.appendChild(G.iskelet('kart', 3)); return; }
      var v = yuk.veri, dk = MM.yasDk(v.asof), eski = dk == null || dk > 150;
      if (v.ornek === true) kok.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (eski) kok.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '. Rakamlar güncel olmayabilir.']));
      kok.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }),
        h('span', { metin: 'Son güncelleme ' + saatTR(v.asof) + ' · Kayıt saati ' + (v.sap_veri_zamani ? String(v.sap_veri_zamani).slice(11, 16) : '—') })]));
      var bg = v.bugun, hf = v.hafta, ay = v.ay;
      var bosMetin = function (b) { return b.net == null ? 'veri yok' : 'boş ciro hariç ' + para(b.net_bos_haric); };
      kok.appendChild(h('div', { sinif: 'kpi-izgara tq-kpi' }, [
        G.kpi({ baslik: 'Bugün', deger: bg.net == null ? '—' : para(bg.net), ikon: 'para', durum: bg.net == null ? 'yok' : null, alt: bg.net == null ? 'Henüz kayıt yok (son kayıt ' + tarihTR(v.sap_son_kayit_tarihi) + ')' : degisim(bg) + ' · ' + bosMetin(bg) }),
        G.kpi({ baslik: 'Bu hafta', deger: hf.net == null ? '—' : para(hf.net), ikon: 'para', durum: hf.net == null ? 'yok' : null, alt: hf.net == null ? 'veri yok' : tarihTR(hf.bas) + ' – ' + tarihTR(hf.bit) + ' · ' + degisim(hf) + ' · ' + bosMetin(hf) }),
        G.kpi({ baslik: 'Bu ay', deger: ay.net == null ? '—' : para(ay.net), ikon: 'para', durum: ay.net == null ? 'yok' : null, alt: ay.net == null ? 'veri yok' : tarihTR(ay.bas) + ' – ' + tarihTR(ay.bit) + ' · ' + degisim(ay) + ' · ' + bosMetin(ay) })]));
      var dsat = [['Bugün', bg], ['Bu hafta', hf], ['Bu ay', ay]].map(function (x) { var b = x[1], gy = b.gecen_yil; return [x[0], b.net == null ? 'veri yok' : para(b.net), gy && gy.net != null ? para(gy.net) : 'veri yok', b.degisim_yuzde == null ? '—' : (b.degisim_yuzde > 0 ? '+' : '−') + '%' + G.say(Math.abs(b.degisim_yuzde), 1), b.net == null ? '—' : para(b.net_bos_haric)]; });
      kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Dönem karşılaştırması', alt: 'Geçen yılın aynı tarih aralığıyla · boş ciro hariç ayrıca', govde: G.duzTablo(['Dönem', 'Net satış', 'Geçen yıl', 'Değişim', 'Boş ciro hariç'], dsat) })]));
      var ogeler = v.gunluk.map(function (g) { return { e: String(+g.t.slice(8)), d: g.net, ipucu: [tarihTR(g.t), g.net == null ? 'kayıt yok (hafta sonu / henüz işlenmedi)' : 'Net satış: ' + para(g.net), g.bos_ciro ? 'Boş ciro dahil: ' + para(g.bos_ciro) : ''] }; });
      var satirlar = v.gunluk.map(function (g) { return [tarihTR(g.t), g.net == null ? 'veri yok' : para(g.net), g.bos_ciro == null ? '—' : para(g.bos_ciro)]; }).reverse();
       
      var dkolon = ['Gün', 'Net satış', 'Bunun içinde boş ciro'], dar = window.matchMedia && window.matchMedia('(max-width: 899px)').matches, kisalt = dar && satirlar.length > 7;
      kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Bu ay günlük ciro', alt: tarihTR(ay.bas) + ' – ' + tarihTR(ay.bit) + ' · net satış, ' + (v.sirket || 'MY'), govde: G.cubuk(ogeler, { ad: 'Günlük net satış', yukseklik: 200 }), tablo: { kolonlar: dkolon, satirlar: kisalt ? satirlar.slice(0, 7) : satirlar } }),
        kisalt ? h('details', { sinif: 'acilir-bolum ms-katla' }, [h('summary', null, [h('span', { metin: 'Tümü (' + satirlar.length + ')' })]), G.duzTablo(dkolon, satirlar)]) : null]));
      kok.appendChild(h('p', { sinif: 'soluk kucuk', metin: 'Net satış = yurtiçi + yurtdışı + diğer satış − iade − iskonto − diğer indirim (yalnız MY). "Boş ciro" grup şirketiyle sıfır marjlı al-sat; ayrıca gösterilir. Yalnız gerçekleşen kayıtlar; kapanışı yapılmamış ayda rakam değişebilir.' }));
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('muhasebe', 'ciro_anlik').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  }

   
  function ebelge(v) {
    var kok = h('div', { sinif: 'yigin' }), sap = v.e_belge && v.e_belge.sap, gib = v.e_belge && v.e_belge.gib_kontrol;
    if (sap) {
      var satirlar = sap.ozet.map(function (o) { return { sirket: o.sirket, tur: o.tur, toplam: o.toplam, c: o.C, a: o.A, e: o.E, diger: o.diger }; });
      var tablo = G.tablo({ kolonlar: [{ ad: 'Şirket', k: 'sirket' }, { ad: 'Fatura türü', k: 'tur', ciz: function (r) { return turAd(r.tur); } }, { ad: 'Kesilen', k: 'toplam', sag: true }, { ad: 'Aktarıldı', k: 'c', sag: true }, { ad: 'Aktarım bekliyor', k: 'a', sag: true, ciz: function (r) { return r.a ? h('b', { metin: String(r.a) }) : '0'; } }, { ad: 'İptal', k: 'e', sag: true }], satirlar: satirlar, sira: { k: 'sirket', yon: 'yukari' } });
      kok.appendChild(G.kart({ baslik: 'Kesilen faturalar', alt: tarihTR(sap.pencere.bas) + ' – ' + tarihTR(sap.pencere.bit), govde: tablo }));
    } else kok.appendChild(G.bos({ tur: 'bekle', baslik: 'Fatura verisi yok', metin: 'Fatura verisi henüz gelmedi.' }));

    if (gib) {
      var f = '', grupAcik = false;
      var kart = h('div'), liste = h('div');
      var ciz = function () {
        liste.textContent = '';
        var l = gib.kararlar.filter(function (k) { return !f || k.karar === f; });
        if (!l.length) liste.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu kararda belge yok.' }));
        var okMu = function (k) { return k.karar === 'GÖNDERİLEBİLİR'; };
        var satirYap = function (k) {
          var ok = okMu(k);
          return h('div', { sinif: 'mh-satir', style: '--isaret:' + (ok ? 'var(--iyi)' : 'var(--kritik)') }, [
            h('div', { sinif: 'mh-satir-ust' }, [h('b', { metin: k.belge }), h('span', { sinif: 'soluk kucuk', metin: k.tur })]),
            rozet(ok ? 'Gönderilebilir' : 'Gönderilemez', ok ? 'yesil' : 'kirmizi', ok ? 'tik' : 'uyari'),
            k.gerekce ? h('p', { sinif: 'mh-not', metin: 'Gerekçe: ' + k.gerekce }) : null]);
        };
        if (f) { l.forEach(function (k) { liste.appendChild(satirYap(k)); }); return; }
         
        var tonlu = l.filter(function (k) { return !okMu(k); }), tonsuz = l.filter(okMu);
        tonlu.forEach(function (k) { liste.appendChild(satirYap(k)); });
        if (tonsuz.length) {
          var grup = h('details', { sinif: 'acilir-bolum ms-katla', open: grupAcik ? '' : null }, [
            h('summary', null, [h('span', { metin: 'Gönderilebilir' }), h('span', { sinif: 'ms-katla-say', metin: String(tonsuz.length) })]),
            h('div', { sinif: 'mh-liste' }, tonsuz.map(satirYap))]);
          grup.addEventListener('toggle', function () { grupAcik = grup.open; });
          liste.appendChild(grup);
        }
      };
      var cip = function () {
        kart.textContent = '';
        kart.appendChild(G.cipler([['', 'Tümü', gib.kararlar.length], ['GÖNDERİLEBİLİR', 'Gönderilebilir', gib.gonderilebilir], ['GÖNDERİLEMEZ', 'Gönderilemez', gib.gonderilemez]], f, function (d) { f = d; cip(); ciz(); }, 'Karar filtresi'));
      };
      cip(); ciz();
      var eski = yasGun(gib.tarih);
      kok.appendChild(G.kart({ baslik: 'GİB öncesi kontrol kararı', alt: tarihTR(gib.tarih) + (eski > 0 ? ' (' + eski + ' gün önceki kontrol)' : ' (bugün)'), govde: h('div', null, [kart, liste]) }));
      if (gib.ayristirilamayan) kok.appendChild(h('div', { sinif: 'bant gri', role: 'status', metin: gib.ayristirilamayan + ' karar satırı belge numarasına ayrıştırılamadı; tam liste gib-kontrol günlüğünde.' }));
    }
    return kok;
  }

  function aktarim(v) {
    var sap = v.e_belge && v.e_belge.sap, kok = h('div', { sinif: 'yigin' });
    if (!sap) return G.bos({ tur: 'bekle', baslik: 'Fatura verisi yok', metin: 'Aktarım listesi hesaplanamadı.' });
    var l = sap.bekleyen, kontrol = l.filter(function (x) { return x.sinif === 'kontrol'; }).length;
    kok.appendChild(h('div', { sinif: 'kpi-izgara tq-kpi' }, [
      G.kpi({ baslik: 'Aktarım bekleyen', deger: String(l.length), birim: 'fatura', ikon: 'belge' }),
      G.kpi({ baslik: 'Kontrol gerekir', deger: String(kontrol), birim: 'fatura', durum: kontrol ? 'kritik' : null, ikon: 'uyari', alt: 'kural dışı bekleyen' }),
      G.kpi({ baslik: 'Kural gereği / zamanlama', deger: String(l.length - kontrol), birim: 'fatura', ikon: 'saat', alt: 'iade, transit, bugünkü' })]));
    var tablo = G.tablo({ kolonlar: [{ ad: 'Belge no', k: 'belge' }, { ad: 'Tür', k: 'tur', ciz: function (r) { return turAd(r.tur); } }, { ad: 'Şirket', k: 'sirket' }, { ad: 'Fatura tarihi', k: 'fatura_tarihi', ciz: function (r) { return tarihTR(r.fatura_tarihi); } }, { ad: 'Bekleme (gün)', k: 'gun', sag: true, deger: function (r) { return yasGun(r.olusturma); }, ciz: function (r) { var g = yasGun(r.olusturma); return g == null ? '—' : g; } }, { ad: 'Durum', k: 'sinif', ciz: function (r) { return r.sinif === 'kural' ? rozet('Kural gereği', 'sari', 'saat') : rozet('Kontrol gerekir', 'kirmizi', 'uyari'); } }, { ad: 'Neden', k: 'neden', genis: true }], satirlar: l, sira: { k: 'gun', yon: 'asagi' }, bos: 'Aktarılmamış fatura yok.' });
    kok.appendChild(G.kart({ baslik: 'Muhasebeye aktarılmamış faturalar', alt: tarihTR(sap.pencere.bas) + ' – ' + tarihTR(sap.pencere.bit), govde: tablo }));
    return kok;
  }

  var K_DURUM = { tamam: ['Tamam', 'yesil', 'tik'], suruyor: ['Sürüyor', 'sari', 'saat'], bekliyor: ['Bekliyor', 'gri', 'saat'], gecikti: ['Gecikti', 'kirmizi', 'uyari'] };
  function kapanis(v) {
    var k = v.kapanis, say = { tamam: 0, suruyor: 0, bekliyor: 0, gecikti: 0 };
    k.gorevler.forEach(function (g) { if (say[g.durum] != null) say[g.durum]++; });
    var yuzde = Math.round(say.tamam / k.gorevler.length * 100);
    var kanitVar = k.gorevler.some(function (g) { return g.kanit; });   
    var kol = [{ ad: 'Görev', k: 'ad', genis: true }, { ad: 'Sorumlu rol', k: 'rol' }, { ad: 'Son tarih kuralı', k: 'son' }, { ad: 'Durum', k: 'durum', ciz: function (r) { var d = K_DURUM[r.durum] || K_DURUM.bekliyor; return rozet(d[0], d[1], d[2]); } }];
    if (kanitVar) kol.push({ ad: 'Kanıt', k: 'kanit', genis: true, ciz: function (r) { return r.kanit || (r.veri_yok ? 'Veri yok' : '—'); } });
    var tablo = G.tablo({ kolonlar: kol, satirlar: k.gorevler, bos: 'Görev yok.' });
    var kpiler = [
      G.kpi({ baslik: 'Tamamlanan', deger: String(say.tamam) + ' / ' + k.gorevler.length, ikon: 'tik', alt: '% ' + yuzde }),
      G.kpi({ baslik: 'Sürüyor', deger: String(say.suruyor), ikon: 'saat' }),
      G.kpi({ baslik: 'Bekliyor', deger: String(say.bekliyor), ikon: 'liste' }),
      G.kpi({ baslik: 'Gecikti', deger: String(say.gecikti), durum: say.gecikti ? 'kritik' : null, ikon: 'uyari' })];
    if (k.kapanis_suresi_gun != null) kpiler.push(G.kpi({ baslik: 'Kapanış süresi', deger: String(k.kapanis_suresi_gun), birim: 'gün', ikon: 'saat', alt: 'Son kayıt: ' + (k.son_kayit_olusturma ? tarihTR(k.son_kayit_olusturma) : '—') }));
    var bosluk = (k.veri_bosluklari || []).map(function (x) { return h('li', { metin: x }); });
    return h('div', { sinif: 'yigin' }, [
      h('div', { sinif: 'kpi-izgara tq-kpi' }, kpiler),
      G.kart({ baslik: 'Ay sonu kapanış kokpiti', alt: k.donem, govde: tablo, dip: k.kapanis_suresi_not || null }),
      bosluk.length ? G.kart({ baslik: 'Veri boşlukları', alt: 'Muhasebe kayıt izinde görünmeyen adımlar (boş, sıfır değil)', govde: h('ul', { sinif: 'soluk' }, bosluk) }) : null]);
  }

  var M_DURUM = { mutabik: ['Mutabık', 'yesil', 'tik'], gonderildi: ['Gönderildi', 'sari', 'saat'], fark: ['Fark var', 'kirmizi', 'uyari'], gonderilmedi: ['Gönderilmedi', 'gri', 'bilgi'], veri_yok: ['Veri yok', 'gri', 'bilgi'] };
  function mutabakat(v) {
    var m = v.mutabakat, say = { mutabik: 0, gonderildi: 0, fark: 0, gonderilmedi: 0, veri_yok: 0 };
    m.kayitlar.forEach(function (x) { var d = x.veri_yok ? 'veri_yok' : x.durum; if (say[d] != null) say[d]++; });
    var P = function (n) { return n == null || !isFinite(n) ? '—' : (MM.s41 ? MM.s41.para(n) : String(Math.round(n))); };
    var ekAlan = m.kayitlar.concat(m.kayitlar_day || []).some(function (x) { return x.gl != null || x.alt_defter != null; });
    var KAT = { zamanlama: 'zamanlama', ozel_defter: 'özel defter', aciklanamayan: 'açıklanamayan' };
    var kolonlar = function () {
      var kol = [{ ad: 'Karşı taraf', k: 'karsi' }, { ad: 'Tür', k: 'tur' }, { ad: 'Durum', k: 'durum', ciz: function (r) { var d = M_DURUM[r.veri_yok ? 'veri_yok' : r.durum] || M_DURUM.gonderilmedi; return rozet(d[0], d[1], d[2]); } }];
      if (ekAlan) {
        kol.push({ ad: 'Genel defter', k: 'gl', sag: true, ciz: function (r) { return P(r.gl); } }, { ad: 'Alt defter', k: 'alt_defter', sag: true, ciz: function (r) { return P(r.alt_defter); } }, { ad: 'Fark', k: 'fark', sag: true, ciz: function (r) { return r.fark == null ? '—' : P(r.fark); } },
          { ad: 'Fark nedeni', k: 'kategori', ciz: function (r) { var c = r.kategori; if (!c) return '—'; var p = Object.keys(KAT).filter(function (x) { return c[x]; }).map(function (x) { return KAT[x] + ' ' + P(c[x]); }); return p.length ? p.join(' · ') : 'fark yok'; } });
      }
      kol.push({ ad: 'Sonuç', k: 'sonuc', genis: true, ciz: function (r) { return r.sonuc || (r.veri_yok ? 'Veri yok' : '—'); } });
      return kol;
    };
    var tablo = G.tablo({ kolonlar: kolonlar(), satirlar: m.kayitlar });
    var kartlar = [
      h('div', { sinif: 'kpi-izgara tq-kpi' }, [['Mutabık', 'mutabik', null, 'tik'], ['Gönderildi', 'gonderildi', null, 'saat'], ['Fark var', 'fark', 'kritik', 'uyari'], ['Gönderilmedi', 'gonderilmedi', null, 'bilgi']].concat(say.veri_yok ? [['Veri yok', 'veri_yok', null, 'bilgi']] : []).map(function (c) { return G.kpi({ baslik: c[0], deger: String(say[c[1]]), durum: say[c[1]] && c[2] ? c[2] : null, ikon: c[3] }); })),
      G.kart({ baslik: 'Cari mutabakat', alt: (m.tarih_itibariyle ? tarihTR(m.tarih_itibariyle) + ' itibarıyla · ' : '') + 'MY · müşteri / tedarikçi / grup içi', govde: tablo, dip: m.yontem || null })];
    if (m.kayitlar_day && m.kayitlar_day.length) kartlar.push(G.kart({ baslik: 'DAY alt defter (ayrı, MY ile toplanmaz)', alt: 'Yalnız muhasebe rolü', govde: G.tablo({ kolonlar: kolonlar(), satirlar: m.kayitlar_day }) }));
    var bosluk = (m.veri_bosluklari || []).map(function (x) { return h('li', { metin: typeof x === 'string' ? x : (x.metin || x.ad || '') }); });
    if (bosluk.length) kartlar.push(G.kart({ baslik: 'Veri boşlukları', alt: 'Hesaplanamayan ya da eksik kaynaklar (boş, sıfır değil)', govde: h('ul', { sinif: 'soluk' }, bosluk) }));
    return h('div', { sinif: 'yigin' }, kartlar);
  }

  var D_DURUM = { acik: ['Açık', 'kirmizi', 'uyari'], cevap: ['Cevap geldi', 'sari', 'saat'], kapandi: ['Kapandı', 'yesil', 'tik'] };
  function duzeltme(v) {
    var d = v.duzeltme;
    if (!d) return G.bos({ tur: 'bekle', baslik: 'Düzeltme defteri okunamadı', metin: 'Düzeltme listesi şu an yok.' });
    var f = '', grupAcik = false, govde = h('div'), liste = h('div', { sinif: 'mh-liste' });
    function ciz() {
      govde.textContent = '';
      govde.appendChild(G.cipler([['', 'Tümü', d.kayitlar.length], ['acik', 'Açık', d.acik], ['cevap', 'Cevap geldi', d.cevap], ['kapandi', 'Kapandı', d.kapandi]], f, function (x) { f = x; ciz(); }, 'Durum filtresi'));
      liste.textContent = '';
      var l = d.kayitlar.filter(function (k) { return !f || k.durum === f; });
      if (!l.length) liste.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu durumda kayıt yok.' }));
      var satirYap = function (k) {
        var st = D_DURUM[k.durum] || D_DURUM.acik, isaret = { acik: 'var(--kritik)', cevap: 'var(--uyari)', kapandi: 'var(--iyi)' }[k.durum];
        return h('div', { sinif: 'mh-satir', style: '--isaret:' + isaret }, [
          h('div', { sinif: 'mh-satir-ust' }, [h('b', { metin: k.sahip_rol }), h('span', { sinif: 'soluk kucuk', metin: 'açıldı ' + tarihTR(k.acildi) + ' · son kontrol ' + tarihTR(k.son_kontrol) })]),
          rozet(st[0], st[1], st[2]), h('p', { sinif: 'mh-not', metin: k.konu })]);
      };
      if (f) l.forEach(function (k) { liste.appendChild(satirYap(k)); });
      else {
         
        var kapali = l.filter(function (k) { return k.durum === 'kapandi'; });
        l.filter(function (k) { return k.durum !== 'kapandi'; }).forEach(function (k) { liste.appendChild(satirYap(k)); });
        if (kapali.length) {
          var grup = h('details', { sinif: 'acilir-bolum ms-katla', open: grupAcik ? '' : null }, [
            h('summary', null, [h('span', { metin: 'Kapandı' }), h('span', { sinif: 'ms-katla-say', metin: String(kapali.length) })]),
            h('div', { sinif: 'mh-liste' }, kapali.map(satirYap))]);
          grup.addEventListener('toggle', function () { grupAcik = grup.open; });
          liste.appendChild(grup);
        }
      }
      govde.appendChild(liste);
    }
    ciz();
    return h('div', { sinif: 'yigin' }, [G.kart({ baslik: 'Açık düzeltme ricaları', alt: 'Muhasebe ve GİB kontrolünün bulduğu hatalar · kişi adı yerine rol', govde: govde })]);
  }

  


  function mn(n) { return n == null ? '—' : G.say(n / 1e6, 1) + ' mn ₺'; }
  function tarihSaat(iso) { try { return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(new Date(iso)); } catch (e) { return '—'; } }
   
  function favokCubuk(son, c, aylik, tikla) {
    var NS = 'http://www.w3.org/2000/svg', W = 640, H = 200, sol = 44, alt = 24, ust = 12, n = son.length, yy = H - alt - ust;
    function s(ad, a) { var e = document.createElementNS(NS, ad); Object.keys(a || {}).forEach(function (k) { e.setAttribute(k, a[k]); }); return e; }
    var v = son.map(function (x) { return x.favok == null ? 0 : x.favok / 1e6; });
    var mx = Math.max.apply(null, v.concat([1])) * 1.08, mn0 = Math.min.apply(null, v.concat([0])) * 1.08, aralik = (mx - mn0) || 1;
    var Y = function (d) { return ust + yy * (mx - d) / aralik; }, y0 = Y(0), gen = (W - sol - 8) / Math.max(n, 1), cg = Math.max(4, Math.min(gen - 2, gen * 0.78, 56));
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, 'class': 'grafik', role: 'group', 'aria-label': 'FAVÖK, ' + (aylik ? 'son 12 ay' : 'son 8 çeyrek') });
    [mx, 0].concat(mn0 < 0 ? [mn0] : []).forEach(function (d) { var y = Y(d); svg.appendChild(s('line', { x1: sol, x2: W - 4, y1: y, y2: y, 'class': d === 0 ? 'g-eksen' : 'g-izgara' })); var t = s('text', { x: sol - 6, y: y + 4, 'text-anchor': 'end', 'class': 'g-yazi' }); t.textContent = G.say(d, 0); svg.appendChild(t); });
    son.forEach(function (x, i) {
      var cx = sol + gen * i + (gen - cg) / 2, d = v[i], y1 = Y(Math.max(d, 0)), hh = Math.max(Math.abs(Y(d) - y0), 1);
      var t = aylik ? x.ay_adi : x.yil + ' Ç' + x.c;
      var g = s('g', { 'class': 'g-cubuk' + (x.gecici ? ' tahmin' : '') + (x === c ? ' secili' : '') });
      if (x.favok == null) g.appendChild(s('line', { x1: cx, x2: cx + cg, y1: y0, y2: y0, 'class': 'g-bos' }));
      else g.appendChild(s('rect', { x: cx, y: y1, width: cg, height: hh, rx: Math.min(4, cg / 2), style: 'fill:' + (d < 0 ? 'var(--kirmizi)' : 'var(--s1)') + (x.gecici ? ';opacity:.55' : '') }));
      g.appendChild(s('rect', { x: sol + gen * i, y: ust, width: gen, height: yy + alt, fill: 'transparent', 'class': 'g-hit' }));
      var bas = s('title'); bas.textContent = t + ': FAVÖK ' + (x.favok == null ? 'veri yok' : G.say(d, 1) + ' mn ₺') + (x.gecici ? ' · geçici (' + (x.gecici_neden || 'kapanmamış') + ')' : ' · kapanmış'); g.appendChild(bas);
      g.addEventListener('click', function () { tikla(x); });
      svg.appendChild(g);
      var lt = s('text', { x: cx + cg / 2, y: H - 7, 'text-anchor': 'middle', 'class': 'g-yazi' }); lt.textContent = t; if (i % (n > 12 ? 3 : (n > 7 ? 2 : 1)) === 0 || i === n - 1) svg.appendChild(lt);
    });
    return svg;
  }
  function veriBekleniyor(baslik, metin) { return G.bos({ tur: 'bekle', baslik: baslik || 'Veri bekleniyor', metin: metin }); }

  function aramaKutusu(v, git) {
    var kap = h('div', { sinif: 'mhs-arama' }), deger = '';
    var cubuk = G.aracCubugu({ arama: { deger: '', yerTutucu: 'Fatura numarası ya da düzeltme konusu ara', degisti: function (x) { deger = x; ara(); } } });
    var kutu = cubuk.querySelector('input'); kutu.setAttribute('maxlength', '60'); kutu.setAttribute('autocomplete', 'off');
    var sonuc = h('div', { sinif: 'mhs-arama-sonuc','aria-live': 'polite' });
    kap.appendChild(cubuk); kap.appendChild(sonuc);
    var sap = v.e_belge && v.e_belge.sap, gib = v.e_belge && v.e_belge.gib_kontrol, dz = v.duzeltme;
    function ara() {
      var q = deger.trim().toLowerCase(); sonuc.textContent = '';
      if (q.length < 3) return;
      var bul = [];
      ((sap && sap.bekleyen) || []).forEach(function (x) { if (String(x.belge).toLowerCase().indexOf(q) >= 0) bul.push(['Aktarım bekliyor', x.belge, turAd(x.tur) + ' · ' + x.sirket + ' · ' + tarihTR(x.fatura_tarihi), 'aktarim']); });
      ((gib && gib.kararlar) || []).forEach(function (x) { if (String(x.belge).toLowerCase().indexOf(q) >= 0) bul.push([x.karar === 'GÖNDERİLEBİLİR' ? 'Gönderilebilir' : 'Gönderilemez', x.belge, x.tur, 'ebelge']); });
      ((dz && dz.kayitlar) || []).forEach(function (x) { if (String(x.konu).toLowerCase().indexOf(q) >= 0) bul.push(['Düzeltme ricası', x.konu, x.sahip_rol + ' · açıldı ' + tarihTR(x.acildi), 'duzeltme']); });
      if (!bul.length) { sonuc.appendChild(h('p', { sinif: 'soluk kucuk', metin: 'Sonuç yok. Arama yalnız aktarım bekleyen faturalarda, GİB kontrol kararlarında ve düzeltme ricalarında yapılır; cari adı bu kaynakta tutulmuyor.' })); return; }
      bul.slice(0, 12).forEach(function (b) {
        sonuc.appendChild(h('button', { type: 'button', sinif: 'mhs-arama-satir', onclick: function () { git(b[3]); } }, [h('span', { sinif: 'etiket', metin: b[0] }), h('b', { metin: b[1] }), h('small', { metin: b[2] })]));
      });
      if (bul.length > 12) sonuc.appendChild(h('p', { sinif: 'soluk kucuk', metin: bul.length + ' sonuç, ilk 12 gösteriliyor. Aramayı daraltın.' }));
    }
    return kap;
  }

  function kapanisKutusu(v) {
    var k = v.kapanis;
    if (!k) return null;
    var say = { tamam: 0, suruyor: 0, bekliyor: 0, gecikti: 0 }, n = k.gorevler.length || 1;
    k.gorevler.forEach(function (g) { say[g.durum]++; });
    var seg = [['tamam', 'Tamamlanan', 'var(--iyi)'], ['suruyor', 'Sürüyor', 'var(--s1)'], ['bekliyor', 'Bekliyor', 'var(--eksen)'], ['gecikti', 'Gecikti', 'var(--kritik)']];
    var cubuk = h('div', { sinif: 'ms-kapanis', role: 'img', 'aria-label': 'Kapanış ilerlemesi: ' + say.tamam + ' / ' + k.gorevler.length + ' tamam, ' + say.gecikti + ' gecikti' }, seg.map(function (x) { return say[x[0]] ? h('i', { style: 'width:' + (100 * say[x[0]] / n) + '%;background:' + x[2], title: x[1] + ' ' + say[x[0]] }) : null; }));
    return G.kart({ baslik: 'Ay sonu kapanış', alt: k.donem, govde: h('div', null, [cubuk, G.lejant(seg.map(function (x) { return [x[1] + ' ' + say[x[0]], x[2]]; }))]) });
  }

  function duzeltmeKutusu(v, git) {
    var d = v.duzeltme;
    if (!d) return null;
    var l = d.kayitlar.filter(function (k) { return k.durum !== 'kapandi'; }).map(function (k) { return { k: k, g: yasGun(k.acildi) }; });
    l.sort(function (a, b) { return (b.g == null ? -1 : b.g) - (a.g == null ? -1 : a.g); });
    var govde = h('div', { sinif: 'mh-liste' });
    if (!l.length) govde.appendChild(h('p', { sinif: 'veri-yok', metin: 'Açık düzeltme ricası yok.' }));
    var gosterN = Math.min(6, Math.max(3, l.filter(function (x) { return x.g != null && x.g > 3; }).length));   
    l.slice(0, gosterN).forEach(function (x) {
      var ton = x.g == null ? 'gri' : (x.g > 7 ? 'kirmizi' : (x.g > 3 ? 'turuncu' : 'yesil'));
      govde.appendChild(h('div', { sinif: 'mh-satir', style: '--isaret:' + (TON[ton] || TON.gri)[0] }, [
        h('div', { sinif: 'mh-satir-ust' }, [h('b', { metin: x.k.konu }), h('span', { sinif: 'soluk kucuk', metin: x.k.sahip_rol })]),
        rozet(x.g == null ? '—' : x.g + ' gün', ton, 'saat')]));
    });
    if (l.length > gosterN) govde.appendChild(h('button', { type: 'button', sinif: 'mini-dugme ms-tumu', onclick: function () { git('duzeltme'); }, metin: 'Tümü (' + l.length + ')' }));
    return G.kart({ baslik: 'Açık düzeltme ricaları', alt: 'Yaşa göre, en eski üstte · kişi adı yerine rol', govde: govde });
  }

  var YAS_KOVA = [['Vadesi gelmemiş', 'var(--eksen)'], ['0–30 gün gecikmiş', 'var(--s1)'], ['31–60 gün', 'var(--s1)'], ['61–90 gün', 'var(--uyari)'], ['91–180 gün', 'var(--uyari)'], ['180+ gün', 'var(--kritik)']];
  function yaslandirmaKutusu(v) {
    var y = v.cari_yaslandirma;
    if (!y || !y.sirketler || !y.sirketler.length) return null;
    var govde = h('div', { sinif: 'yigin' }), toplamlar = h('div', null), kovaYigin = h('div', { sinif: 'yigin' }), kovaSay = 0, gecmis = 0, kritikKova = 0, kritikKalem = 0;
    y.sirketler.forEach(function (s) {
      var mx = Math.max.apply(null, s.kovalar.map(function (k) { return k.tl || 0; }).concat([1]));
      var oge = s.kovalar.map(function (k, i) { var r = (YAS_KOVA.filter(function (z) { return z[0] === k.ad; })[0] || ['', 'var(--s1)'])[1]; return { e: k.ad, alt: (k.adet != null ? G.say(k.adet) + ' kalem' : null), d: k.tl, renk: r, etiketDeger: mn(k.tl) }; });
      s.kovalar.forEach(function (k) { kovaSay++; if (k.ad !== YAS_KOVA[0][0] && (k.tl || 0) > 0) gecmis++; if (k.ad === YAS_KOVA[5][0] && (k.tl || 0) > 0) { kritikKova++; kritikKalem += (k.adet || 0); } });
      toplamlar.appendChild(h('h4', { sinif: 'ms-alt-baslik', metin: s.sirket + ' · toplam ' + mn(s.toplam_tl) }));   
      kovaYigin.appendChild(h('div', null, [h('h4', { sinif: 'ms-alt-baslik', metin: s.sirket }), G.yatay(oge, { maks: mx })]));
    });
    govde.appendChild(toplamlar);
    govde.appendChild(h('details', { sinif: 'acilir-bolum ms-katla' }, [
      h('summary', null, [h('span', { metin: 'Vade kovaları' }), h('span', { sinif: 'ms-katla-say', metin: y.sirketler.length + ' şirket · ' + kovaSay + ' kova' + (gecmis ? ' · ' + gecmis + ' vadesi geçmiş' : '') + (kritikKova ? ' · 180+ gün: ' + (kritikKalem ? G.say(kritikKalem) + ' kalem' : kritikKova + ' şirkette') : '') })]),
      kovaYigin]));
    return G.kart({ baslik: 'Cari yaşlandırma', alt: 'Açık alacak, vade gününe göre' + (y.tarih_itibariyle ? ' · ' + tarihTR(y.tarih_itibariyle) + ' itibarıyla' : '') + ' · MY ve DAY ayrı gösterilir', govde: govde });
  }

  function performansKutusu() {
    var kapsa = h('div'), yuk = null, hata = null, canli = true, st = { mod: 'ay', idx: null };
    function ciz() {
      kapsa.textContent = '';
      if (hata) return;   
      if (!yuk) { kapsa.appendChild(G.iskelet('kart', 1)); return; }
      var v = yuk.veri, aylik = st.mod === 'ay', liste = (aylik ? v.aylar : v.ceyrekler) || [];
      if (!liste.length) return;   
      if (st.idx == null || st.idx >= liste.length) st.idx = liste.length - 1;
      var c = liste[st.idx], onc = liste[st.idx - 1] || null;
      var gy = null; liste.forEach(function (x) { if (aylik ? (x.yil === c.yil - 1 && x.ay_no === c.ay_no) : (x.yil === c.yil - 1 && x.c === c.c)) gy = x; });
      var tabanDegil = function (x) { return !x || x.kismi_baslangic || x.kismi; };
      if (tabanDegil(onc)) onc = null; if (tabanDegil(gy)) gy = null;
      var ad = aylik ? c.ay_adi + ' ' + c.yil : c.yil + ' Ç' + c.c, onEt = aylik ? 'önceki ay' : 'önceki çeyrek', gyEt = aylik ? 'geçen yıl aynı ay' : 'geçen yıl aynı çeyrek';
      var ust = h('div', { sinif: 'ms-sec' }, [
        G.cipler([['ay', 'Aylık'], ['ceyrek', 'Çeyreklik']], st.mod, function (m) { st.mod = m; st.idx = null; ciz(); }, 'Dönem türü'),
        h('div', { sinif: 'ms-adim' }, [
          h('button', { type: 'button', sinif: 'mini-dugme', 'aria-label': 'Önceki dönem', disabled: st.idx <= 0 ? '' : null, onclick: function () { st.idx--; ciz(); } }, [G.ikon('sol', 16)]),
          h('b', { sinif: 'ms-adim-ad', metin: ad }),
          h('button', { type: 'button', sinif: 'mini-dugme', 'aria-label': 'Sonraki dönem', disabled: st.idx >= liste.length - 1 ? '' : null, onclick: function () { st.idx++; ciz(); } }, [G.ikon('sag', 16)])])]);
      var vBekl = c.veri_bekleniyor && c.veri_bekleniyor.length, eksikAy = c.eksik_aylar && c.eksik_aylar.length;
      var etGecici = eksikAy ? { metin: 'eksik ay', tur: 'kismi' } : (vBekl && c.favok == null ? { metin: 'veri yok', tur: 'kismi' } : (c.gecici ? { metin: c.kismi ? 'kısmi' : 'geçici', tur: c.kismi ? 'kismi' : 'tahmin' } : null));
      function kutu(baslik, alan, ikon, etiket, alt) {
        var dl = h('div', { sinif: 'ms-delta' }, [G.delta(c[alan], onc && onc[alan], { etiket: onEt, iyi: 'yukari' }), G.delta(c[alan], gy && gy[alan], { etiket: gyEt, iyi: 'yukari' })]);
        var kk = G.kpi({ baslik: baslik, deger: G.say(c[alan] == null ? null : c[alan] / 1e6, 1), birim: 'mn ₺', ikon: ikon, etiket: etiket, alt: alt });
        if (darPerf) { karsilar.push(h('div', { sinif: 'ms-fk' }, [h('b', { sinif: 'ms-alt-baslik', metin: baslik }), dl])); return h('div', { sinif: 'ms-fk' }, [kk]); }   
        return h('div', { sinif: 'ms-fk' }, [kk, dl]);
      }
      var darPerf = false, karsilar = [];    
      var kpiler = h('div', { sinif: 'kpi-izgara tq-kpi' }, [
        kutu('Ciro (MY)', 'net_satis', 'para', c.gecici && (aylik ? c.gecici_neden === 'ay devam ediyor' : c.kismi) ? { metin: 'kısmi', tur: 'kismi' } : null, null),
        kutu('Brüt kâr', 'brut_kar', 'para', etGecici, null),
        kutu('FAVÖK (EBITDA)', 'favok', 'para', etGecici, c.favok_marj == null ? null : 'ciroya oranı %' + G.say(c.favok_marj, 1))]);
      var karsiBolum = karsilar.length ? h('details', { sinif: 'acilir-bolum ms-katla' }, [h('summary', null, [h('span', { metin: 'Önceki dönemle karşılaştırma' }), h('span', { sinif: 'ms-katla-say', metin: '(' + karsilar.length + ')' })]), h('div', { sinif: 'yigin' }, karsilar)]) : null;
      var son = liste.slice(aylik ? -12 : -8);
      var grafik = favokCubuk(son, c, aylik, function (x) { st.idx = liste.indexOf(x); ciz(); });
      var notlar = [];
      if (c.veri_uyari) notlar.push(c.veri_uyari + '.');
      if (c.gecici) notlar.push('Geçici: ' + (c.gecici_neden || 'dönem kapanmadı') + '. Maliyet dağıtımı tamamlanınca değişebilir.');
      var uyarilar = notlar.slice();   
      notlar = [];
      if (son.some(function (x) { return x.favok != null && x.favok < 0; })) notlar.push('Negatif FAVÖK çubuğu sıfır çizgisinin altına çizilir.');
      notlar.push('FAVÖK = esas faaliyet kârı + amortisman; finansman gideri ve kur farkı dışarıda. Yalnız MY.');
      var negSay = son.filter(function (x) { return x.favok != null && x.favok < 0; }).length;
      var ac = h('details', { sinif: 'acilir-bolum ms-katla' }, [
        h('summary', null, [h('span', { metin: 'FAVÖK grafiği ve notlar' }), h('span', { sinif: 'ms-katla-say', metin: son.length + (aylik ? ' ay' : ' çeyrek') + (negSay ? ' · ' + negSay + ' negatif' : '') })]),
        h('div', { sinif: 'yigin' }, [grafik, h('p', { sinif: 'soluk kucuk', metin: notlar.join(' ') })])]);
      kapsa.appendChild(G.kart({ baslik: 'Finansal performans', alt: 'MY Medikal · milyon ₺ · ' + (aylik ? 'aylık' : 'çeyreklik'), govde: h('div', { sinif: 'yigin' }, [ust, kpiler, uyarilar.length ? h('p', { sinif: 'soluk kucuk', metin: uyarilar.join(' ') }) : null, karsiBolum, ac]) }));
    }
    function yenile() { yuk = null; hata = null; ciz(); window.MMVeri.oku('muhasebe', 'ebitda').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return { kok: kapsa, temizle: function () { canli = false; } };
  }

  function ozetGovde(v, git) {
    var kok = h('div', { sinif: 'yigin' });
    var dar = window.matchMedia && window.matchMedia('(max-width: 899px)').matches;
    if (!dar) { [kapanisKutusu(v), duzeltmeKutusu(v, git), yaslandirmaKutusu(v)].forEach(function (k) { if (k) kok.appendChild(k); }); return kok; }   
     
    var kap = kapanisKutusu(v), yas = yaslandirmaKutusu(v), duz = duzeltmeKutusu(v, git), y = v.cari_yaslandirma;
    var kapTonlu = !!(v.kapanis && v.kapanis.gorevler.some(function (g) { return g.durum === 'gecikti'; }));
    var yasTonlu = !!(y && y.sirketler && y.sirketler.some(function (s) { return s.kovalar.some(function (k) { return k.ad === YAS_KOVA[5][0] && (k.tl || 0) > 0; }); }));
    var katli = [];
    [[kap, kapTonlu], [yas, yasTonlu]].forEach(function (x) { if (!x[0]) return; if (x[1]) kok.appendChild(x[0]); else katli.push(x[0]); });
    if (duz) kok.appendChild(duz);
    if (katli.length) kok.appendChild(h('details', { sinif: 'acilir-bolum ms-katla' }, [h('summary', null, [h('span', { metin: 'Ayrıntı kartları' }), h('span', { sinif: 'ms-katla-say', metin: '(' + katli.length + ')' })]), h('div', { sinif: 'yigin' }, katli)]));
    return kok;
  }

   
  MM.moduller.muhasebe = function (kok) {
    var yuk = null, hata = null, canli = true;
    var q = new URLSearchParams(location.search).get('msekme'), durum = { sekme: SEKMELER.some(function (s) { return s[0] === q; }) ? q : 'ozet' };
    var maliKok = h('div'), maliTemiz = null, anlikKok = h('div'), anlikTemiz = null, tfrsKok = h('div'), tfrsTemiz = null, perf = null;
    kok.appendChild(G.sayfaBasi({ baslik: 'Muhasebe', alt: 'Mali tablolar, e-Belge, aktarım, kapanış', kirinti: [['Muhasebe']] }));
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (durum.sekme === 'mali' || durum.sekme === 'anlik' || durum.sekme === 'tfrs') {
        var vv = yuk && yuk.veri;
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.sekmeler(SEKMELER.filter(function (s) { return vv ? ((s[0] !== 'kapanis' || vv.kapanis) && (s[0] !== 'mutabakat' || vv.mutabakat)) : (s[0] !== 'kapanis' && s[0] !== 'mutabakat'); }).map(function (s) { return [s[0], s[1], null]; }), durum.sekme, function (id) { durum.sekme = id; ciz(); }, { sinif: 'cip', ad: 'Muhasebe bölümleri', goster: 4 })]));
        if (durum.sekme === 'anlik') {
          if (!anlikTemiz) anlikTemiz = anlikTab(anlikKok);
          govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [anlikKok]));
          return;
        }
        if (durum.sekme === 'tfrs') {
          if (!tfrsTemiz) tfrsTemiz = MM.tfrsTab(tfrsKok);
          govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [tfrsKok]));
          return;
        }
        if (!maliTemiz) maliTemiz = MM.maliTab(maliKok);
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [maliKok]));
        return;
      }
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Muhasebe verisi alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri, dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK;
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (eski) {
        var uzunMetin = 'Veri eski — son dışa aktarım ' + MM.yasMetin(dk) + '. Gösterilen değerler güncel olmayabilir.';
        var rozet = h('button', { type: 'button', sinif: 'mhs-eski-rozet', title: uzunMetin, 'aria-label': uzunMetin, onclick: function () { G.sheet('Veri durumu', function () { return h('p', { metin: uzunMetin }); }).ac(); } }, [h('i', { 'aria-hidden': 'true' }), 'Eski · ' + MM.yasMetin(dk).replace(' önce', '')]);
        ust.appendChild(h('div', { sinif: 'mhs-eski' }, [rozet]));
      }
      ust.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: 'Veri: ' + tarihSaat(v.asof) + ' itibarıyla · ' + MM.yasMetin(dk) + ' güncellendi' }), h('span', { sinif: 'kaynak-etiket', metin: yuk.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]));
      var sap = v.e_belge && v.e_belge.sap, gib = v.e_belge && v.e_belge.gib_kontrol, dz = v.duzeltme;
      var bek = sap ? sap.bekleyen.length : null, kontrol = sap ? sap.bekleyen.filter(function (x) { return x.sinif === 'kontrol'; }).length : 0;
      var git = function (s) { return function () { durum.sekme = s; ciz(); }; };
      var gitSekme = function (s) { durum.sekme = s; ciz(); };
      var ozetMi = durum.sekme === 'ozet';
      if (ozetMi) govde.appendChild(aramaKutusu(v, gitSekme));
      var kgec = v.kapanis ? v.kapanis.gorevler.filter(function (g) { return g.durum === 'gecikti'; }).length : null;
      var ucuncu = ozetMi
        ? G.kpi({ baslik: 'Gecikmiş kapanış adımı', deger: kgec == null ? '—' : String(kgec), birim: kgec == null ? 'veri yok' : 'adım', ikon: 'uyari', durum: kgec == null ? 'yok' : (kgec ? 'kritik' : null), alt: null, tikla: kgec == null ? null : git('kapanis') })
        : G.kpi({ baslik: 'Düzeltme', deger: dz ? String(dz.acik + dz.cevap) : '—', birim: dz ? 'rica' : 'veri yok', ikon: 'liste', durum: dz ? (dz.acik ? 'uyari' : null) : 'yok', alt: dz ? dz.acik + ' açık · ' + dz.cevap + ' cevap geldi' : 'veri yok', tikla: git('duzeltme') });
      govde.appendChild(h('div', { sinif: 'kpi-izgara tq-kpi' }, [
        G.kpi({ baslik: 'Aktarılmayan', deger: bek == null ? '—' : String(bek), birim: bek == null ? 'veri yok' : 'fatura', ikon: 'belge', durum: kontrol ? 'kritik' : (bek == null ? 'yok' : null), alt: bek == null ? 'veri yok' : (kontrol ? kontrol + ' tanesi kontrol gerektirir' : 'tamamı kural gereği bekliyor'), tikla: git('aktarim') }),
        G.kpi({ baslik: 'GİB engeli', deger: gib ? String(gib.gonderilemez) : '—', birim: gib ? 'belge' : 'veri yok', ikon: 'uyari', durum: gib ? (gib.gonderilemez ? 'kritik' : null) : 'yok', alt: gib ? tarihTR(gib.tarih) + ' kontrolü · ' + gib.gonderilebilir + ' gönderilebilir' : 'veri yok', tikla: git('ebelge') }),
        ucuncu]));
      var sek =h('div', { sinif: 'ust-bosluk' }, [G.sekmeler(SEKMELER.filter(function (s) { return (s[0] !== 'kapanis' || v.kapanis) && (s[0] !== 'mutabakat' || v.mutabakat); }).map(function (s) { return [s[0], s[1], null]; }), durum.sekme, function (id) { durum.sekme = id; ciz(); }, { sinif: 'cip', ad: 'Muhasebe bölümleri', goster: window.matchMedia && window.matchMedia('(max-width: 599px)').matches ? 2 : 4 })]);
      govde.appendChild(sek);
      if ((durum.sekme === 'kapanis' && !v.kapanis) || (durum.sekme === 'mutabakat' && !v.mutabakat)) durum.sekme = 'ebelge';
      if (ozetMi) {
        if (!perf) perf = performansKutusu();
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [perf.kok]));
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [ozetGovde(v, gitSekme)]));
        return;
      }
      var icerik = h('div', { sinif: 'ust-bosluk' }, [{ ebelge: ebelge, aktarim: aktarim, kapanis: kapanis, mutabakat: mutabakat, duzeltme: duzeltme }[durum.sekme](v)]);
      govde.appendChild(icerik);
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('muhasebe', 'muhasebe').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; if (maliTemiz) maliTemiz(); if (anlikTemiz) anlikTemiz(); if (tfrsTemiz) tfrsTemiz(); if (perf) perf.temizle(); };
  };
})();
