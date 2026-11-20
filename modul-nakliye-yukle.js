


(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var AZAMI = 6;

   
  if (window.MM_DIL && window.MM_DIL.en) Object.assign(window.MM_DIL.en, {
    'Yükleme': 'Upload', 'Teslimat belgesi yükle': 'Upload delivery document',
    'İrsaliye / teslimat no': 'Delivery note / delivery no.', 'Belgenin üzerinde yazan numara': 'The number written on the document',
    'Fotoğraf çek': 'Take photo', 'Dosya seç': 'Choose file', 'Fotoğraf ya da PDF ekleyin (en çok 6)': 'Add photos or PDF (up to 6)',
    'Not (isteğe bağlı)': 'Note (optional)', 'Gönder': 'Send', 'Gönderiliyor…': 'Sending…', 'Kaldır': 'Remove',
    'Gönderdiklerim': 'My uploads', 'Henüz gönderim yok': 'Nothing sent yet', 'Gönderilen belgeler burada görünür.': 'Documents you send appear here.',
    'Gönderildi': 'Sent', 'Alındı': 'Received', 'Eşleşti': 'Matched', 'Kontrol ediliyor': 'Being checked', 'Sırada': 'Queued', 'Gönderilemedi': 'Not sent',
    'Bağlantı gelince gönderilecek': 'Will send when online', 'Giriş yenilenince gönderilecek': 'Will send after sign-in is renewed',
    'Yükleme şu an kapalı': 'Upload is closed right now', 'Lütfen daha sonra tekrar deneyin.': 'Please try again later.',
    'Bu ekran için yetkiniz yok': 'You do not have access to this screen', 'Yeniden dene': 'Try again',
    'Belge gönderildi.': 'Document sent.', 'Belge kaydedildi, bağlantı gelince gönderilecek.': 'Document saved, it will be sent when you are online.',
    'Fotoğraf': 'Photo', 'Belgeyi yeniden çekip gönderin.': 'Take the photo again and resend.'
  });

  function boyut(b) { return b >= 1048576 ? MM.sayi(b / 1048576, 1) + ' MB' : MM.sayi(Math.max(1, Math.round(b / 1024))) + ' KB'; }

  var DURUM = {
    sirada: { ad: 'Sırada', ikon: 'saat', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)' },
    gonderiliyor: { ad: 'Gönderiliyor…', ikon: 'gonder', yazi: 'var(--vurgu-sert)', zemin: 'var(--vurgu-zemin)' },
    gonderildi: { ad: 'Gönderildi', ikon: 'tik', yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)' },
    alindi: { ad: 'Alındı', ikon: 'tik', yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)' },
    eslesti: { ad: 'Eşleşti', ikon: 'tik', yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)' },
    kontrol: { ad: 'Kontrol ediliyor', ikon: 'saat', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)' },
    red: { ad: 'Kabul edilmedi', ikon: 'uyari', yazi: 'var(--kirmizi)', zemin: 'var(--kirmizi-zemin)' },
    isleniyor: { ad: 'İşleniyor', ikon: 'saat', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)' },
    hata: { ad: 'Gönderilemedi', ikon: 'uyari', yazi: 'var(--kirmizi)', zemin: 'var(--kirmizi-zemin)' }
  };
  var MAC_DURUM = { alindi: 1, eslesti: 1, kontrol: 1, red: 1 };
  function durumAnahtar(k, mac) {
    if (k.durum === 'gonderildi') return !mac ? 'gonderildi' : (MAC_DURUM[mac] ? mac : 'isleniyor');   
    if (k.durum === 'gonderiliyor' || (k.durum === 'kuyrukta' && !k.hata)) return 'gonderiliyor';   
    if (k.durum === 'hata') return 'hata';
    return 'sirada';
  }
  function rozet(a) { var s = DURUM[a]; return h('span', { sinif: 'ny-rozet', style: 'color:' + s.yazi + ';background:' + s.zemin }, [G.ikon(s.ikon, 16), h('span', { metin: MM.t(s.ad) })]); }

  if (window.MM_DIL && window.MM_DIL.en) Object.assign(window.MM_DIL.en, { 'Kabul edilmedi': 'Not accepted', 'İşleniyor': 'Processing', 'Erişim yok': 'No access', 'Yöneticinize başvurun.': 'Please contact your administrator.' });
  MM.moduller['erisim-yok'] = function (kok) {   
    kok.appendChild(G.bos({ tur: 'bekle', baslik: 'Erişim yok', metin: 'Yöneticinize başvurun.' }));
    return null;
  };

  MM.moduller['nakliye-yukle'] = function (kok) {
    var nk = window.MMVeri.nakliyeci();
    var ak = window.MMVeri.yuklemeAcik();
    var firmaAd = nk ? nk.ad : '';
    kok.appendChild(h('div', { sinif: 'ny-baslik' }, [h('h2', { metin: 'Teslimat belgesi yükle' }), firmaAd ? h('span', { sinif: 'ny-firma', metin: firmaAd }) : null]));
    var govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(govde);
    if (!ak.acik) {
      govde.appendChild(G.bos({ tur: 'bekle', baslik: ak.neden === 'yetki' ? 'Bu ekran için yetkiniz yok' : 'Yükleme şu an kapalı', metin: ak.neden === 'yetki' ? '' : 'Lütfen daha sonra tekrar deneyin.' }));
      return null;
    }

    var secili = [], urller = [], gonderiyor = false, zamanlayici = null, canli = true;
    var irsInp = h('input', { type: 'text', id: 'ny-irs', sinif: 'ny-girdi', maxlength: 30, autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', enterkeyhint: 'next', required: true, 'aria-describedby': 'ny-irs-ipucu' });
    var notInp = h('textarea', { id: 'ny-not', sinif: 'ny-girdi ny-not', rows: 2, maxlength: 500 });
    var kameraInp = h('input', { type: 'file', accept: 'image/*', capture: 'environment', sinif: 'ny-gizli', tabindex: '-1', 'aria-hidden': 'true' });
    var dosyaInp = h('input', { type: 'file', accept: 'image/*,application/pdf', multiple: true, sinif: 'ny-gizli', tabindex: '-1', 'aria-hidden': 'true' });
    var seciliKap = h('div', { sinif: 'ny-secili' });
    var mesaj = h('div', { sinif: 'ny-mesaj', role: 'status', 'aria-live': 'polite' });
    var gonderDugme = h('button', { type: 'button', sinif: 'dugme ny-gonder', disabled: true }, [G.ikon('gonder', 20), h('span', { metin: 'Gönder' })]);
    var listeKap = h('div', { sinif: 'ny-liste', 'aria-live': 'polite' });

    function ekle(dosyalar) {
      Array.prototype.forEach.call(dosyalar, function (f) { if (secili.length < AZAMI) secili.push(f); });
      if (dosyalar.length && secili.length >= AZAMI) mesaj.textContent = '';
      cizSecili();
    }
    kameraInp.addEventListener('change', function () { ekle(kameraInp.files || []); kameraInp.value = ''; });
    dosyaInp.addEventListener('change', function () { ekle(dosyaInp.files || []); dosyaInp.value = ''; });
    irsInp.addEventListener('input', durumGuncelle);

    function url(f) { var u = URL.createObjectURL(f); urller.push(u); return u; }
    function cizSecili() {
      seciliKap.textContent = '';
      urller.forEach(function (u) { URL.revokeObjectURL(u); }); urller = [];
      if (!secili.length) seciliKap.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Fotoğraf ya da PDF ekleyin (en çok 6)' }));
      secili.forEach(function (f, i) {
        var resim = /^image\//.test(f.type || '');
        seciliKap.appendChild(h('div', { sinif: 'ny-dosya' }, [
          resim ? h('img', { src: url(f), alt: '', sinif: 'ny-kucuk' }) : h('span', { sinif: 'ny-kucuk ny-pdf' }, [G.ikon('belge', 28)]),
          h('span', { sinif: 'ny-dosya-ad' }, [h('b', { metin: (resim ? MM.t('Fotoğraf') : 'PDF') + ' ' + (i + 1) }), h('small', { metin: boyut(f.size) })]),
          h('button', { type: 'button', sinif: 'ny-kaldir', 'aria-label': 'Kaldır', onclick: function () { secili.splice(i, 1); cizSecili(); } }, [G.ikon('kapat', 20)])
        ]));
      });
      durumGuncelle();
    }
    function durumGuncelle() { gonderDugme.disabled = gonderiyor || !secili.length || irsInp.value.trim().length < 4; }

    gonderDugme.addEventListener('click', function () {
      if (gonderiyor) return;
      gonderiyor = true; durumGuncelle(); mesaj.className = 'ny-mesaj'; mesaj.textContent = MM.t('Gönderiliyor…');
      window.MMVeri.yukle({ irsaliye: irsInp.value, not: notInp.value, dosyalar: secili }).then(function () {
        var cevrimdisi = navigator.onLine === false;   
        secili = []; irsInp.value = ''; notInp.value = ''; cizSecili();
        mesaj.className = 'ny-mesaj tamam'; mesaj.textContent = MM.t(cevrimdisi ? 'Belge kaydedildi, bağlantı gelince gönderilecek.' : 'Belge gönderildi.');
        setTimeout(yenile, 1500); setTimeout(yenile, 4000);   
        return yenile();
      }).catch(function (e) { mesaj.className = 'ny-mesaj hata'; mesaj.textContent = (e && e.message) || 'Gönderilemedi'; })
        .then(function () { gonderiyor = false; durumGuncelle(); });
    });

    function cizListe(k, mac) {
      listeKap.textContent = '';
      if (!k.length) { listeKap.appendChild(h('p', { sinif: 'ny-ipucu', metin: 'Henüz gönderim yok' })); return; }
      k.forEach(function (x) {
        var a = durumAnahtar(x, mac[x.id]);
        var alt = x.durum === 'kuyrukta' && x.hata ? (x.hata === 'giris_gerekli' ? 'Giriş yenilenince gönderilecek' : 'Bağlantı gelince gönderilecek') : (x.durum === 'hata' ? 'Belgeyi yeniden çekip gönderin.' : '');
        var neden = a === 'red' ? mac['neden:' + x.id] : '';   
        listeKap.appendChild(h('div', { sinif: 'ny-satir' }, [
          h('span', { sinif: 'ny-satir-ad' }, [h('b', { metin: x.irsaliye }), h('small', { metin: MM.saat(new Date(x.zaman)) + ' · ' + x.adet + (MM.dil() === 'en' ? ' file(s)' : ' dosya') + (alt ? ' · ' + MM.t(alt) : '') + (neden ? ' · ' + neden : '') })]),
          rozet(a)
        ]));
      });
    }
    function yenile() {
      return Promise.all([window.MMVeri.yuklemeKuyruk(), window.MMVeri.yuklemeDurum()]).then(function (s) { if (canli) cizListe(s[0], s[1]); }).catch(function () { });
    }

    var formKart = h('section', { sinif: 'ny-kart' }, [
      h('label', { sinif: 'ny-etiket', 'for': 'ny-irs', metin: 'İrsaliye / teslimat no' }), irsInp,
      h('small', { id: 'ny-irs-ipucu', sinif: 'ny-ipucu', metin: 'Belgenin üzerinde yazan numara' }),
      h('div', { sinif: 'ny-dugmeler' }, [
        h('button', { type: 'button', sinif: 'dugme ny-buyuk', onclick: function () { kameraInp.click(); } }, [G.ikon('kamera', 24), h('span', { metin: 'Fotoğraf çek' })]),
        h('button', { type: 'button', sinif: 'dugme ikincil ny-buyuk', onclick: function () { dosyaInp.click(); } }, [G.ikon('belge', 24), h('span', { metin: 'Dosya seç' })])
      ]),
      kameraInp, dosyaInp, seciliKap,
      h('label', { sinif: 'ny-etiket', 'for': 'ny-not', metin: 'Not (isteğe bağlı)' }), notInp,
      gonderDugme, mesaj
    ]);
    govde.appendChild(formKart);
    govde.appendChild(h('section', { sinif: 'ny-kart' }, [h('h3', { sinif: 'ny-alt-baslik', metin: 'Gönderdiklerim' }), listeKap]));
    cizSecili();
    yenile();

    
    function dene() { window.MMVeri.yuklemeIsle().then(yenile); }
    zamanlayici = setInterval(dene, 25000);
    window.addEventListener('online', dene);
    dene();
    return function () { canli = false; clearInterval(zamanlayici); window.removeEventListener('online', dene); urller.forEach(function (u) { URL.revokeObjectURL(u); }); };
  };
})();
