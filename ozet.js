


(function () {
  'use strict';
  var MM = window.MM, A = window.MM_AYAR || {};
  var onbellek = null, zaman = 0, bekleyen = null;

   
  MM.alarmKonu = function (k) {
    k = String(k || '');
    var m = /^Veri topla\S*\s+.*?\(hat\s+(\S+?)\)\s*$/i.exec(k);
    if (m) return 'Hat ' + m[1] + ' verisi gelmiyor';
    m = /^Veri topla\S*\s+(.+)$/i.exec(k);
    return m ? m[1].replace(/\s*csv\s*$/i, '') + ' verisi gelmiyor' : k;
  };
  function rolVar(m) { return MM.acik(m) && window.MMVeri.ozelErisim(m) && (((A.roller || {})[m] || []).indexOf(MM.rol()) >= 0 || (window.MMVeri.mod() === 'graph' && !!(A.ozelErisim || {})[m])); }   
  function sinirla(p, ad, hata) { return p.catch(function (e) { hata[ad] = e; return null; }); }

  function yukle(zorla) {
    if (window.MMVeri && window.MMVeri.kisitli && window.MMVeri.kisitli()) return Promise.resolve({ hata: {}, rol: MM.rol() });   
    if (!zorla && onbellek && Date.now() - zaman < 60000) return Promise.resolve(onbellek);
    if (bekleyen) return bekleyen;
    var oz = { hata: {}, rol: MM.rol() }, h = oz.hata, isler = [];
    if (rolVar('eldiven') && MM.eldiven) isler.push(sinirla(MM.eldiven.yukle().then(function (y) { var hz = MM.eldiven.hazirla(y.r.veri); oz.eld = { y: y, v: y.r.veri, hz: hz, o: MM.eldiven.ozet(hz) }; }), 'eldiven', h));
    if (rolVar('siparis') && MM.siparis) isler.push(sinirla(MM.siparis.yukle().then(function (y) { oz.sip = { y: y, v: y.r.veri, o: MM.siparis.ozet(y.r.veri) }; }), 'siparis', h));
    [['kalite', 'kal'], ['isg', 'isg']].forEach(function (c) {
      if (rolVar(c[0]) && MM.takvim) isler.push(sinirla(window.MMVeri.oku(c[0], c[0]).then(function (r) { oz[c[1]] = { r: r, v: r.veri, o: MM.takvim.ozet(r.veri) }; }), c[0], h));
    });
    if (MM.acik('makineler') || MM.acik('yonetim')) isler.push(sinirla(window.MMVeri.oku('fabrika', 'pano-veri').then(function (r) { oz.fab = { r: r, v: r.veri }; }), 'fabrika', h));
    if (rolVar('makineler')) isler.push(sinirla(window.MMVeri.oku('fabrika', 'dokuma-veri').then(function (r) { oz.dok = { r: r, v: r.veri }; }), 'dokuma', h));
    bekleyen = Promise.all(isler).then(function () { onbellek = oz; zaman = Date.now(); bekleyen = null; return oz; });
    return bekleyen;
  }

   
  function kompresGunluk(fab) {
    if (!fab || !MM.fabrika) return [];
    var bugun = fab.v.uretim_gunu;
    return MM.fabrika.gunToplamlari(fab.v).filter(function (x) { return x.g !== bugun; });   
  }
   
  function kompresKarsilastir(fab) {
    var l = kompresGunluk(fab); if (!l.length) return null;
    var son = l[l.length - 1], onceki = l.length > 1 ? l[l.length - 2] : null;
    var gunBul = function (g) { return l.filter(function (x) { return x.g === g; })[0] || null; };
    var d7 = new Date(Date.parse(son.g + 'T12:00:00Z') - 7 * 864e5).toISOString().slice(0, 10), hf = gunBul(d7);
    var r = { l: l, son: son, toplamSon: son.o + son.t, onceki: onceki ? onceki.o + onceki.t : null, hafta: hf ? hf.o + hf.t : null, nedenHat: null, tahminli: son.th > 0 || (onceki && onceki.th > 0) };
    if (onceki) {
      var hs = {}; (fab.v.gunluk_kompres || []).forEach(function (s) { if (s.gun === son.g) (hs[s.hat] = hs[s.hat] || [0, 0])[0] = s.kompres || 0; if (s.gun === onceki.g) (hs[s.hat] = hs[s.hat] || [0, 0])[1] = s.kompres || 0; });
      var en = null; Object.keys(hs).forEach(function (k) { var f = hs[k][0] - hs[k][1]; if (!en || Math.abs(f) > Math.abs(en.f)) en = { hat: k, f: f }; }); r.nedenHat = en;
    }
    return r;
  }

   
  function sayiTR(n) { return MM.sayi(n); }
  function bildirimler(oz) {
    var l = [];
    function ekle(id, sev, baslik, metin, href, kaynak) { l.push({ id: id, sev: sev, baslik: baslik, metin: metin, href: href, kaynak: kaynak }); }
    if (oz.fab && rolVar('makineler')) {
      var d = oz.fab.v, k = d.kaynak || {}, dk = MM.yasDk(d.asof);
      if (k.durum === 'hata' || k.durum === 'anahtar_yok') ekle('fab-kaynak', 'kritik', 'Fabrika verisi alınamıyor', k.mesaj || 'Neden bildirilmedi', '#makineler', 'Makineler');
      else if (dk == null || dk > (A.eskiDk || 15)) ekle('fab-eski', 'uyari', 'Fabrika verisi eski', 'Son güncelleme ' + MM.yasMetin(dk) + '. Değerler güncel olmayabilir.', '#makineler', 'Makineler');
      (d.alarmlar || []).forEach(function (a) {
        var m = /Tezg[aâ]h\s+(\d+)/i.exec(a.konu || ''), hh = /^Hat\s+(\S+)/i.exec(MM.alarmKonu(a.konu));
        ekle('al-' + a.id, a.adim === 'uyarı' ? 'uyari' : 'kritik', 'Makine alarmı: ' + MM.alarmKonu(a.konu), (a.tur || '').replace(/-/g, ' ') + (a.sure_dk != null ? ' · ' + sayiTR(a.sure_dk) + ' dk' : '') + (a.vardiya ? ' · ' + a.vardiya : ''), m ? '#makineler/tezgah/' + m[1] : (hh ? '#makineler/hat/' + encodeURIComponent(hh[1]) : '#makineler'), 'Makineler');
      });
    }
    if (oz.eld && rolVar('eldiven')) {
      var late = [], yakin = [];
      oz.eld.hz.liste.forEach(function (x) { if (x.d.ds === 'late') late.push(x); else if (x.d.ds === 'liman' && x.d.kalanSerbest != null && x.d.kalanSerbest <= 3) yakin.push(x); });
      if (late.length) {
        late.sort(function (a, b) { return (b.d.gun - (b.d.serbest || 0)) - (a.d.gun - (a.d.serbest || 0)); });
        var w = late[0];
        ekle('eld-late', 'kritik', late.length + ' konteynerin serbest süresi doldu', 'En uzun: ' + w.c.id + ' — ' + (w.d.gun - (w.d.serbest || 0)) + ' gün aştı (' + MM.eldiven.limanAd(w.d.at) + ')', MM.eldiven.href(w.c.id), 'Eldiven');
      }
      yakin.sort(function (a, b) { return a.d.kalanSerbest - b.d.kalanSerbest; }).slice(0, 4).forEach(function (x) {
        ekle('eld-y-' + x.c.id, 'uyari', 'Serbest süre bitiyor: ' + x.c.id, x.d.kalanSerbest <= 0 ? 'Son gün bugün' : x.d.kalanSerbest + ' gün kaldı (' + MM.eldiven.limanAd(x.d.at) + ')', MM.eldiven.href(x.c.id), 'Eldiven');
      });
    }
    if (oz.sip && rolVar('siparis')) {
      var o =oz.sip.o, sl = oz.sip.v.siparisler || [], gec = sl.filter(function (s) { return s.gecikme_gun; }).sort(function (a, b) { return b.gecikme_gun - a.gecikme_gun; });
      if (gec.length) ekle('sip-gec', 'kritik', gec.length + ' sipariş gecikmiş', 'En eski: ' + gec[0].no + ' — ' + gec[0].gecikme_gun + ' gün (' + (gec[0].teslim_alan || gec[0].musteri || '') + ')', '#siparis/siparis/' + encodeURIComponent(gec[0].no), 'Siparişler');
      if (o.kismi) ekle('sip-kismi', 'bilgi', 'Bazı siparişlerin durumu belli değil', sayiTR(o.bilinmeyenKalem) + ' / ' + sayiTR(o.kalemToplam) + ' kalemin teslim durumu henüz yok.', '#siparis', 'Siparişler');
    }
    [['kal', 'kalite', 'Kalite'], ['isg', 'isg', 'İSG']].forEach(function (c) {
      var m = oz[c[0]]; if (!m || !rolVar(c[1])) return;
      m.o.liste.filter(function (x) { return x.kova === 'gecti' || x.kova === 'k7'; }).slice(0, 5).forEach(function (x) {
        ekle(c[1] + '-' + (x.i != null ? x.i : x.k.belge), 'kritik', (x.kova === 'gecti' ? 'Süresi geçti: ' : '7 gün içinde: ') + x.k.belge, (x.gun < 0 ? Math.abs(x.gun) + ' gün geçti' : (x.gun === 0 ? 'bugün' : x.gun + ' gün kaldı')) + ' · ' + MM.takvim.tarihTR(x.k.son_tarih), x.i != null ? '#' + c[1] + '/belge/' + x.i : '#' + c[1], c[2]);
      });
      if (m.o.k30) ekle(c[1] + '-30', 'bilgi', c[2] + ': ' + m.o.k30 + ' belge 30 gün içinde', 'Yaklaşan son tarihler', '#' + c[1], c[2]);
    });
    var sira = { kritik: 0, uyari: 1, bilgi: 2 };
    return l.sort(function (a, b) { return sira[a.sev] - sira[b.sev]; });
  }

   
  var MODUL_ADLARI = [['ana', 'Ana sayfa'], ['makineler', 'Makineler'], ['eldiven', 'Eldiven'], ['siparis', 'Siparişler'], ['stok', 'Stok'], ['kalite', 'Kalite'], ['isg', 'İSG'], ['nakliye', 'Nakliye'], ['ik', 'İK'], ['onay', 'Onaylar'], ['asistan', 'Asistan'], ['yonetim', 'Yönetim'], ['finans', 'Finans'], ['muhasebe', 'Muhasebe'], ['sikayet', 'Şikâyetler']];
  function dizin(oz) {
    var l = [];
    function e(tur, ad, alt, href, anahtar) { l.push({ tur: tur, ad: ad, alt: alt || '', href: href, k: (ad + ' ' + (alt || '') + ' ' + (anahtar || '')).toLocaleLowerCase('tr') }); }
    MODUL_ADLARI.forEach(function (m) { if (rolVar(m[0])) e('Modül', m[1], 'Sayfaya git', '#' + m[0]); });
    if (oz.eld && rolVar('eldiven')) oz.eld.hz.liste.forEach(function (x) {
      var c = x.c, mus = (c.lots || []).map(function (t) { return MM.eldiven.musteriAd(oz.eld.v, t.cus); }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(', ');
      e('Konteyner', c.id, (MM.eldiven.durumAd[x.d.ds] || x.d.ds) + (mus ? ' · ' + mus : '') + (c.at ? ' · ' + MM.eldiven.limanAd(c.at) : ''), MM.eldiven.href(c.id), [c.bl, c.po, c.ref, c.sup, c.vessels].join(' '));
    });
    if (oz.sip && rolVar('siparis')) (oz.sip.v.siparisler || []).forEach(function (s) {
      e('Sipariş', s.no, (s.teslim_alan || s.musteri || '') + (s.gecikme_gun ? ' · ' + s.gecikme_gun + ' gün gecikmiş' : ''), '#siparis/siparis/' + encodeURIComponent(s.no), [s.yk, s.musteri].concat(s.irsaliye || [], s.fatura_no || []).join(' '));
    });
    if (oz.fab && rolVar('makineler')) (oz.fab.v.hatlar || []).forEach(function (x) { e('Makine', 'Hat ' + x.hat, (x.durum === 'calisiyor' ? 'Çalışıyor' : (x.durum === 'durdu' ? 'Durdu' : 'Veri yok')) + (x.tip === 'stacker' ? ' · stacker' : ''), '#makineler/hat/' + encodeURIComponent(x.hat), 'kompres hat ' + x.hat); });
    if (oz.dok && rolVar('makineler')) (oz.dok.v.tezgahlar || []).forEach(function (t) { e('Makine', 'Tezgâh ' + t.no, 'Dokuma salon ' + t.salon + ' · ' + ({ calisiyor: 'çalışıyor', durdu: 'duruyor', veri_yok: 'veri yok' }[t.durum] || t.durum), '#makineler/tezgah/' + encodeURIComponent(t.no), 'dokuma tezgah ' + (t.urun_kod || '')); });
    [['kal', 'kalite', 'Kalite'], ['isg', 'isg', 'İSG']].forEach(function (c) { var m = oz[c[0]]; if (m && rolVar(c[1])) m.o.liste.forEach(function (x) { e('Belge', x.k.belge, c[2] + (x.gun != null ? ' · ' + MM.takvim.kova[x.kova][0] : ' · tarih bilinmiyor'), x.i != null ? '#' + c[1] + '/belge/' + x.i : '#' + c[1], x.k.kurulus || ''); }); });
    return l;
  }

  function sifirla() { onbellek = null; zaman = 0; bekleyen = null; }   
  MM.ozet = { sifirla: sifirla, yukle: yukle, rolVar: rolVar, bildirimler: bildirimler, dizin: dizin, kompresGunluk: kompresGunluk, kompresKarsilastir: kompresKarsilastir };
})();
