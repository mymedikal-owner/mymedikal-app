



(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var AZAMI = 6;
  var BOLUMLER = ['Dokuma', 'Spanç / Mabotex', 'Kompres', 'Batın', 'Paketleme', 'Sterilizasyon', 'Hammadde / Depo', 'Diğer'];
  var TURLER = ['Ölçü / gramaj dışı', 'Delik / yırtık', 'Leke / kirlilik / yabancı madde', 'Gevşek / kopuk dikiş', 'Yanlış / eksik etiket-baskı', 'Ambalaj / paket hatası',
    'Sterilizasyon / indikatör uygunsuzluğu', 'Hammadde uygunsuzluğu', 'Makine ayarı / duruş kaynaklı', 'Diğer'];
  var ONEMLER = [['Düşük', 'Düşük (bilgi)'], ['Orta', 'Orta (hat izlensin)'], ['Yüksek', 'Yüksek (durdurma / ayırma gerekli)']];

  function boyut(b) { return b >= 1048576 ? MM.sayi(b / 1048576, 1) + ' MB' : MM.sayi(Math.max(1, Math.round(b / 1024))) + ' KB'; }
  var DURUM = {
    kuyrukta: { ad: 'Sırada', ikon: 'saat', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)' },
    gonderiliyor: { ad: 'Gönderiliyor…', ikon: 'gonder', yazi: 'var(--vurgu-sert)', zemin: 'var(--vurgu-zemin)' },
    gonderildi: { ad: 'Gönderildi', ikon: 'tik', yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)' },
    hata: { ad: 'Gönderilemedi', ikon: 'uyari', yazi: 'var(--kirmizi)', zemin: 'var(--kirmizi-zemin)' }
  };
  function rozet(d) { var s = DURUM[d] || DURUM.kuyrukta; return h('span', { sinif: 'ny-rozet', style: 'color:' + s.yazi + ';background:' + s.zemin }, [G.ikon(s.ikon, 16), h('span', { metin: MM.t(s.ad) })]); }
  function secim(id, etiket, secenekler, bos) {
    var s = h('select', { id: id, sinif: 'ny-girdi' }, [h('option', { value: '', metin: bos })].concat(secenekler.map(function (o) { var d = Array.isArray(o) ? o : [o, o]; return h('option', { value: d[0], metin: d[1] }); })));
    return { etiket: h('label', { sinif: 'ny-etiket', 'for': id, metin: etiket }), girdi: s };
  }

  MM.moduller['kalite-yukle'] = function (kok) {
    kok.appendChild(h('div', { sinif: 'ny-baslik' }, [h('h2', { metin: 'Kalite problemi bildir' })]));
    var govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(govde);
    var ak = window.MMVeri.kaliteAcik();
    if (!ak.acik) {
      var bas = ak.neden === 'grup-yok' ? 'Yetki tanımlanınca açılacak' : (ak.neden === 'yetki' ? 'Bu ekran için yetkiniz yok' : 'Yükleme şu an kapalı');
      var alt = ak.neden === 'grup-yok' ? 'Kalite problemi bildirme ekranı, kullanıcı yetkisi verildiğinde burada açılır.' : (ak.neden === 'yetki' ? '' : 'Lütfen daha sonra tekrar deneyin.');
      govde.appendChild(G.bos({ tur: 'bekle', baslik: bas, metin: alt }));
      return null;
    }

    var secili = [], urller = [], gonderiyor = false, zamanlayici = null, canli = true;
    var bolum = secim('kp-bolum', 'Bölüm / hat', BOLUMLER, 'Seçin');
    var makine = h('input', { type: 'text', id: 'kp-makine', sinif: 'ny-girdi', maxlength: 60, autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'next' });
    var urun = h('input', { type: 'text', id: 'kp-urun', sinif: 'ny-girdi', maxlength: 80, autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'next' });
    var lot = h('input', { type: 'text', id: 'kp-lot', sinif: 'ny-girdi', maxlength: 40, autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', enterkeyhint: 'next' });
    var tur = secim('kp-tur', 'Problem türü', TURLER, 'Seçin');
    var onem = secim('kp-onem', 'Önem', ONEMLER, 'Seçin');
    var aciklama = h('textarea', { id: 'kp-aciklama', sinif: 'ny-girdi ny-not', rows: 4, maxlength: 1000, 'aria-describedby': 'kp-aciklama-ipucu' });
    var kameraInp = h('input', { type: 'file', accept: 'image/*', capture: 'environment', sinif: 'ny-gizli', tabindex: '-1', 'aria-hidden': 'true' });
    var dosyaInp = h('input', { type: 'file', accept: 'image/*', multiple: true, sinif: 'ny-gizli', tabindex: '-1', 'aria-hidden': 'true' });
    var seciliKap = h('div', { sinif: 'ny-secili' });
    var mesaj = h('div', { sinif: 'ny-mesaj', role: 'status', 'aria-live': 'polite' });
    var gonderDugme = h('button', { type: 'button', sinif: 'dugme ny-gonder', disabled: true }, [G.ikon('gonder', 20), h('span', { metin: 'Gönder' })]);
    var listeKap = h('div', { sinif: 'ny-liste', 'aria-live': 'polite' });

    function ekle(dosyalar) { Array.prototype.forEach.call(dosyalar, function (f) { if (secili.length < AZAMI) secili.push(f); }); cizSecili(); }
    kameraInp.addEventListener('change', function () { ekle(kameraInp.files || []); kameraInp.value = ''; });
    dosyaInp.addEventListener('change', function () { ekle(dosyaInp.files || []); dosyaInp.value = ''; });
    [bolum.girdi, tur.girdi, onem.girdi, aciklama].forEach(function (e) { e.addEventListener('input', durumGuncelle); e.addEventListener('change', durumGuncelle); });

    function url(f) { var u = URL.createObjectURL(f); urller.push(u); return u; }
    function cizSecili() {
      seciliKap.textContent = '';
      urller.forEach(function (u) { URL.revokeObjectURL(u); }); urller = [];
      if (!secili.length) seciliKap.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Fotoğraf ekleyin (en çok 6)' }));
      secili.forEach(function (f, i) {
        seciliKap.appendChild(h('div', { sinif: 'ny-dosya' }, [
          h('img', { src: url(f), alt: '', sinif: 'ny-kucuk' }),
          h('span', { sinif: 'ny-dosya-ad' }, [h('b', { metin: MM.t('Fotoğraf') + ' ' + (i + 1) }), h('small', { metin: boyut(f.size) })]),
          h('button', { type: 'button', sinif: 'ny-kaldir', 'aria-label': 'Kaldır', onclick: function () { secili.splice(i, 1); cizSecili(); } }, [G.ikon('kapat', 20)])
        ]));
      });
      durumGuncelle();
    }
    function durumGuncelle() { gonderDugme.disabled = gonderiyor || !secili.length || !bolum.girdi.value || !tur.girdi.value || !onem.girdi.value || aciklama.value.trim().length < 10; }

    gonderDugme.addEventListener('click', function () {
      if (gonderiyor) return;
      gonderiyor = true; durumGuncelle(); mesaj.className = 'ny-mesaj'; mesaj.textContent = MM.t('Gönderiliyor…');
      window.MMVeri.kaliteKaydet({ bolum: bolum.girdi.value, makine: makine.value, urun: urun.value, lot: lot.value, problem: tur.girdi.value, onem: onem.girdi.value, aciklama: aciklama.value, dosyalar: secili }).then(function (s) {
        var cevrimdisi = navigator.onLine === false;
        secili = []; [makine, urun, lot, aciklama].forEach(function (e) { e.value = ''; }); [bolum.girdi, tur.girdi, onem.girdi].forEach(function (e) { e.value = ''; }); cizSecili();
        mesaj.className = 'ny-mesaj tamam'; mesaj.textContent = s.kayitNo + ' · ' + MM.t(cevrimdisi ? 'Kayıt saklandı, bağlantı gelince gönderilecek.' : 'Kayıt gönderildi.');
        setTimeout(yenile, 1500); setTimeout(yenile, 4000);
        return yenile();
      }).catch(function (e) { mesaj.className = 'ny-mesaj hata'; mesaj.textContent = (e && e.message) || 'Gönderilemedi'; })
        .then(function () { gonderiyor = false; durumGuncelle(); });
    });

    function cizListe(k) {
      listeKap.textContent = '';
      if (!k.length) { listeKap.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Henüz kayıt yok' })); return; }
      k.forEach(function (x) {
        var alt = x.durum === 'kuyrukta' && x.hata ? (x.hata === 'giris_gerekli' ? 'Giriş yenilenince gönderilecek' : 'Bağlantı gelince gönderilecek') : (x.durum === 'hata' ? 'Yeniden bildirin.' : '');
        listeKap.appendChild(h('div', { sinif: 'ny-satir' }, [
          h('span', { sinif: 'ny-satir-ad' }, [h('b', { metin: x.kayitNo }), h('small', { metin: MM.saat(new Date(x.zaman)) + ' · ' + x.bolum + ' · ' + x.problem + ' · ' + x.onem + ' · ' + x.adet + (MM.dil() === 'en' ? ' photo(s)' : ' fotoğraf') + (alt ? ' · ' + MM.t(alt) : '') })]),
          rozet(x.durum === 'gonderildi' ? 'gonderildi' : (x.durum === 'hata' ? 'hata' : (x.durum === 'gonderiliyor' ? 'gonderiliyor' : 'kuyrukta')))
        ]));
      });
    }
    function yenile() { return window.MMVeri.kaliteKuyruk().then(function (k) { if (canli) cizListe(k); }).catch(function () { }); }

    var alanlar = [
      bolum.etiket, bolum.girdi,
      h('label', { sinif: 'ny-etiket', 'for': 'kp-makine', metin: 'Makine / tezgâh (isteğe bağlı)' }), makine,
      h('label', { sinif: 'ny-etiket', 'for': 'kp-urun', metin: 'Ürün (isteğe bağlı)' }), urun,
      h('label', { sinif: 'ny-etiket', 'for': 'kp-lot', metin: 'Lot (isteğe bağlı)' }), lot,
      tur.etiket, tur.girdi, onem.etiket, onem.girdi,
      h('label', { sinif: 'ny-etiket', 'for': 'kp-aciklama', metin: 'Açıklama' }), aciklama,
      h('small', { id: 'kp-aciklama-ipucu', sinif: 'ny-ipucu', metin: 'Ne gördünüz, nerede, kaç adet? (en az 10 karakter)' }),
      h('div', { sinif: 'ny-dugmeler' }, [
        h('button', { type: 'button', sinif: 'dugme ny-buyuk', onclick: function () { kameraInp.click(); } }, [G.ikon('kamera', 24), h('span', { metin: 'Fotoğraf çek' })]),
        h('button', { type: 'button', sinif: 'dugme ikincil ny-buyuk', onclick: function () { dosyaInp.click(); } }, [G.ikon('belge', 24), h('span', { metin: 'Galeriden seç' })])
      ]),
      kameraInp, dosyaInp, seciliKap, gonderDugme, mesaj
    ];
    govde.appendChild(h('section', { sinif: 'ny-kart' }, alanlar));
    govde.appendChild(h('section', { sinif: 'ny-kart' }, [h('h3', { sinif: 'ny-alt-baslik', metin: 'Bildirdiklerim' }), listeKap]));
    cizSecili();
    yenile();

    function dene() { window.MMVeri.kaliteIsle().then(yenile); }
    zamanlayici = setInterval(dene, 25000);
    window.addEventListener('online', dene);
    dene();
    return function () { canli = false; clearInterval(zamanlayici); window.removeEventListener('online', dene); urller.forEach(function (u) { URL.revokeObjectURL(u); }); };
  };
})();
