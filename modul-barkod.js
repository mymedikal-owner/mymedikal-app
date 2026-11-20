





(function () {
  'use strict';
  var VENDOR = 'vendor/zxing/zxing-library.min.js';
  var zxingSoz = null;

  function el(tag, sinif, metin, ozn) {
    var e = document.createElement(tag);
    if (sinif) e.className = sinif;
    if (metin != null) e.textContent = metin;
    if (ozn) Object.keys(ozn).forEach(function (k) { e.setAttribute(k, ozn[k]); });
    return e;
  }
  function ekle(ata, cocuklar) { cocuklar.forEach(function (c) { if (c) ata.appendChild(c); }); return ata; }

  function zxingYukle() {
    if (window.ZXing) return Promise.resolve(window.ZXing);
    if (zxingSoz) return zxingSoz;
    zxingSoz = new Promise(function (ok, red) {
      var s = document.createElement('script');
      s.src = VENDOR; s.async = true;
      s.onload = function () { window.ZXing ? ok(window.ZXing) : red(new Error('zxing yok')); };
      s.onerror = function () { zxingSoz = null; red(new Error('zxing yüklenemedi')); };
      document.head.appendChild(s);
    });
    return zxingSoz;
  }

   
  function sade(t) { return String(t || '').replace(/^\][A-Za-z][0-9A-Za-z]/, '').replace(/[\u0000-\u001c\u001e\u001f]/g, '').replace(/^\s+|\s+$/g, ''); }
  var AI_SABIT = { '00': 18, '01': 14, '02': 14, '11': 6, '12': 6, '13': 6, '15': 6, '16': 6, '17': 6, '20': 2 };
  function gs1Coz(ham) {
    var t = String(ham || '').replace(/^\][A-Za-z][0-9A-Za-z]/, ''), o = {}, m;
    if (t.indexOf('(') >= 0) {   
      var re = /\((\d{2,4})\)([^(]*)/g;
      while ((m = re.exec(t))) o[m[1]] = m[2].replace(/\u001d/g, '');
    } else {
      var i = 0, n = t.length;
      while (i < n) {
        if (t.charAt(i) === '\u001d') { i++; continue; }
        var ai = t.substr(i, 2);
        if (AI_SABIT[ai]) { o[ai] = t.substr(i + 2, AI_SABIT[ai]); i += 2 + AI_SABIT[ai]; }
        else if (ai === '10' || ai === '21' || ai === '30') {
          var j = t.indexOf('\u001d', i + 2); if (j < 0) j = n;
          o[ai] = t.substring(i + 2, j); i = j;
        } else { return Object.keys(o).length ? o : null; }
      }
    }
    return o['01'] && /^\d{14}$/.test(o['01']) ? o : null;
  }
  function sktYMD(a) { return a && /^\d{6}$/.test(a) ? '20' + a.substr(0, 2) + '-' + a.substr(2, 2) + '-' + (a.substr(4, 2) === '00' ? '28' : a.substr(4, 2)) : ''; }
  function kapsa(metin) {   
    var g = gs1Coz(metin);
    if (g) return { barkod: g['01'], gs1: true, lot: g['10'] || '', skt: sktYMD(g['17']), seri: g['21'] || '' };
    return { barkod: sade(metin), gs1: false, lot: '', skt: '', seri: '' };
  }
  function anahtar(b) { return String(b || '').replace(/\D/g, '').replace(/^0+/, ''); }   

   
  function veriOku(dosya) { return window.MMVeri.oku('stok', dosya).then(function (r) { return r.veri; }); }
  function yetkisizMi(e) { return !!e && (e.kod === 'giris_gerekli'); }

  function sayiMetin(n) { return typeof n === 'number' ? n.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) : 'veri yok'; }
  function tarihTR(iso) { if (!iso) return '—'; var p = String(iso).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso; }

  function stokIndex(stok) {
    var K = stok.kolonlar, ix = {}; K.forEach(function (k, i) { ix[k] = i; });
    var m = {};
    stok.kalemler.forEach(function (r) {
      var kod = r[ix.malzeme]; (m[kod] = m[kod] || []).push({
        sirket: r[ix.sirket], depo: r[ix.depo_adi] || r[ix.depo_yeri] || '—', lot: r[ix.lot] || '', skt: r[ix.skt] || '',
        serbest: r[ix.serbest] || 0, kalite: r[ix.kalite] || 0, bloke: r[ix.bloke] || 0, birim: r[ix.birim] || '' });
    });
    return m;
  }

   
  function malzemeKarti(mz, kalemler, sorgu, ac) {
    var kart = el('div', 'bk-kart');
    var baslik = el('div', 'bk-kart-baslik');
    ekle(baslik, [el('strong', 'bk-ad', mz.ad || '(adsız)'), el('span', 'bk-kod', 'Malzeme ' + mz.malzeme)]);
    kart.appendChild(baslik);
    if (mz.birim && mz.birim !== 'ADT') kart.appendChild(el('div', 'bk-not', 'Bu barkod ' + mz.birim + ' barkodudur' + (mz.koli_ici ? ' (1 ' + mz.birim + ' = ' + sayiMetin(mz.koli_ici) + ' adet)' : '') + '.'));
    if (!kalemler || !kalemler.length) { kart.appendChild(el('div', 'bk-bos', 'Stokta kayıt yok (veri yok = stok 0 değildir; yalnız stok verisinde satırı yok).')); return kart; }
    var topS = 0, topK = 0, topB = 0, birim = kalemler[0].birim;
    kalemler.forEach(function (k) { topS += k.serbest; topK += k.kalite; topB += k.bloke; });
    ekle(kart, [ekle(el('div', 'bk-toplam'), [
      ekle(el('div', 'bk-kutu'), [el('span', 'bk-kutu-ad', 'Serbest stok'), el('strong', 'bk-kutu-deger', sayiMetin(topS) + ' ' + birim)]),
      ekle(el('div', 'bk-kutu'), [el('span', 'bk-kutu-ad', 'Kalite kontrolde'), el('strong', 'bk-kutu-deger', sayiMetin(topK))]),
      ekle(el('div', 'bk-kutu'), [el('span', 'bk-kutu-ad', 'Bloke'), el('strong', 'bk-kutu-deger', sayiMetin(topB))])])]);
    if (sorgu.lot) {
      var esl = kalemler.filter(function (k) { return k.lot === sorgu.lot; });
      var s = esl.reduce(function (a, k) { return a + k.serbest; }, 0);
      kart.appendChild(el('div', 'bk-lot-not', 'Okutulan lot ' + sorgu.lot + (esl.length ? ': serbest ' + sayiMetin(s) + ' ' + birim : ': bu malzemede bu lot stok verisinde yok') + (sorgu.skt ? ' · okutulan SKT ' + tarihTR(sorgu.skt) : '')));
    }
    var tbl = el('table', 'bk-tablo');
    var th = el('tr'); ['Depo', 'Lot', 'SKT', 'Serbest'].forEach(function (a, i) { th.appendChild(el('th', i === 3 ? 'sag' : '', a)); });
    tbl.appendChild(ekle(el('thead'), [th]));
    var sirali = kalemler.slice().sort(function (a, b) { return (a.skt || '9999') < (b.skt || '9999') ? -1 : 1; });
    var gb = el('tbody'), limit = 12;
    sirali.slice(0, limit).forEach(function (k) {
      var tr = el('tr', sorgu.lot && k.lot === sorgu.lot ? 'bk-vurgu' : '');
      ekle(tr, [el('td', '', k.depo + (k.sirket === 'DAY' ? ' (DAY)' : '')), el('td', '', k.lot || '—'), el('td', '', k.skt ? tarihTR(k.skt) : '—'), el('td', 'sag', sayiMetin(k.serbest))]);
      gb.appendChild(tr);
    });
    tbl.appendChild(gb);
    kart.appendChild(el('div', 'bk-tablo-kap')).appendChild(tbl);
    if (sirali.length > limit) kart.appendChild(el('div', 'bk-not', '+ ' + (sirali.length - limit) + ' satır daha (Stok bölümünde malzeme koduyla arayın).'));
    return kart;
  }

   
  function ac(secenek) {
    secenek = secenek || {};
    if (document.querySelector('.bk-katman')) return;
    var akim = null, dongu = null, kapali = false, okuyucu = null, sonMetin = '', sonZaman = 0, veriSoz = null;
    var video = el('video', 'bk-video', null, { playsinline: '', 'webkit-playsinline': '', muted: '', autoplay: '', 'aria-label': 'Kamera görüntüsü' });
    video.muted = true; video.setAttribute('playsinline', '');
    var tuval = document.createElement('canvas');
    var durum = el('div', 'bk-durum', 'Kamera açılıyor…', { role: 'status', 'aria-live': 'polite' });
    var sonuc = el('div', 'bk-sonuc', null, { 'aria-live': 'polite' });
    var giris = el('input', 'bk-giris', null, { type: 'text', inputmode: 'numeric', autocomplete: 'off', placeholder: 'Barkodu elle yazın (ör. 8683020021396)', 'aria-label': 'Barkod numarası' });
    var sorBtn = el('button', 'dugme bk-btn', 'Sorgula', { type: 'button' });
    var yenidenBtn = el('button', 'dugme bk-btn bk-gizli', 'Tekrar okut', { type: 'button' });
    var kapat = el('button', 'dugme bk-kapat', 'Kapat', { type: 'button' });
    var gorunum = ekle(el('div', 'bk-goruntu'), [video, el('div', 'bk-nisan', null, { 'aria-hidden': 'true' })]);
    var kat = el('div', 'bk-katman', null, { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Barkod okut ve stok sorgula' });
    ekle(kat, [ekle(el('div', 'bk-ust'), [el('strong', 'bk-baslik', 'Barkod okut — stok sorgula'), kapat]),
      gorunum, durum,
      ekle(el('div', 'bk-elle'), [giris, sorBtn]), yenidenBtn, sonuc]);
    document.body.appendChild(kat);

    function durdur() {
      if (dongu) { clearTimeout(dongu); dongu = null; }
      if (akim) { akim.getTracks().forEach(function (t) { t.stop(); }); akim = null; }
      try { video.srcObject = null; } catch (e) {}
    }
    function kapatFn() { kapali = true; durdur(); document.removeEventListener('keydown', tus); if (kat.parentNode) kat.parentNode.removeChild(kat); }
    function tus(e) { if (e.key === 'Escape') kapatFn(); }
    document.addEventListener('keydown', tus);
    kapat.addEventListener('click', kapatFn);

    function veriler() {
      if (!veriSoz) veriSoz = Promise.all([veriOku('barkod'), veriOku('stok')]).then(function (r) {
        var bi = {}; (r[0].barkodlar || []).forEach(function (b) { (bi[anahtar(b.barkod)] = bi[anahtar(b.barkod)] || []).push(b); });
        return { barkod: bi, stok: stokIndex(r[1]) };
      });
      return veriSoz;
    }

    function goster(metin) {
      var sorgu = kapsa(metin);
      if (!anahtar(sorgu.barkod)) { durum.textContent = 'Okunan değer barkod numarası değil: ' + sorgu.barkod; return; }
      durdur(); yenidenBtn.classList.remove('bk-gizli');
      gorunum.classList.add('bk-gizli');
      durum.textContent = 'Okunan barkod: ' + sorgu.barkod + (sorgu.gs1 ? ' (GS1/UBB)' : '');
      sonuc.textContent = '';
      sonuc.appendChild(el('div', 'bk-not', 'Stok aranıyor…'));
      veriler().then(function (v) {
        if (kapali) return;
        sonuc.textContent = '';
        var liste = v.barkod[anahtar(sorgu.barkod)];
        if (!liste || !liste.length) {
          sonuc.appendChild(el('div', 'bk-hata', 'Bu barkod ürün kartlarında kayıtlı değil: ' + sorgu.barkod + '. Elle yazarak yeniden deneyin ya da Stok bölümünden arayın.')); return;
        }
        var benzersiz = {}, mzler = [];
        liste.forEach(function (b) { if (!benzersiz[b.malzeme]) { benzersiz[b.malzeme] = 1; mzler.push(b); } });
        mzler.sort(function (a, b) { return (v.stok[b.malzeme] ? 1 : 0) - (v.stok[a.malzeme] ? 1 : 0); });   
        if (mzler.length > 1) sonuc.appendChild(el('div', 'bk-not', 'Bu barkod ' + mzler.length + ' malzeme kartında ortak (müşteri/ambalaj varyantları). Stoklu olanlar önce gösterilir.'));
        mzler.slice(0, 8).forEach(function (mz) { sonuc.appendChild(malzemeKarti(mz, v.stok[mz.malzeme], sorgu)); });
        if (mzler.length > 8) sonuc.appendChild(el('div', 'bk-not', '+ ' + (mzler.length - 8) + ' malzeme daha (Stok bölümünde arayın).'));
      }).catch(function (e) {
        if (kapali) return;
        veriSoz = null; sonuc.textContent = '';
        sonuc.appendChild(el('div', 'bk-hata', yetkisizMi(e) ? 'Stok görme yetkiniz yok.' : (e && e.kod === 'bulunamadi' ? 'Barkod listesi henüz yayımlanmadı.' : 'Stok verisi şu an alınamıyor. Biraz sonra yeniden deneyin.')));
      });
    }

    function elleSorgula() { var t = giris.value.replace(/\s+/g, ''); if (!t) { giris.focus(); return; } goster(t); }
    sorBtn.addEventListener('click', elleSorgula);
    giris.addEventListener('keydown', function (e) { if (e.key === 'Enter') elleSorgula(); });
    yenidenBtn.addEventListener('click', function () { sonuc.textContent = ''; yenidenBtn.classList.add('bk-gizli'); gorunum.classList.remove('bk-gizli'); sonMetin = ''; baslat(); });

    function kameraYok(neden) {
      gorunum.classList.add('bk-gizli');
      durum.textContent = neden + ' Barkodu aşağıya elle yazabilirsiniz.';
      giris.focus();
    }

    function tara(ZX) {
      if (kapali || !akim) return;
      try {
        if (video.readyState >= 2 && video.videoWidth) {
          var w = Math.min(video.videoWidth, 1100), oran = w / video.videoWidth, hh = Math.round(video.videoHeight * oran);
          tuval.width = w; tuval.height = hh;
          var cx = tuval.getContext('2d', { willReadFrequently: true });
          cx.drawImage(video, 0, 0, w, hh);
          var kaynak = new ZX.HTMLCanvasElementLuminanceSource(tuval);
          var bmp = new ZX.BinaryBitmap(new ZX.HybridBinarizer(kaynak));
          var r = okuyucu.decode(bmp), m = r && r.getText();
          if (m) { var simdi = Date.now(); if (m !== sonMetin || simdi - sonZaman > 2000) { sonMetin = m; sonZaman = simdi; if (secenek.okunca) { try { secenek.okunca(m); } catch (x) {} } goster(m); return; } }
        }
      } catch (e) {   }
      dongu = setTimeout(function () { tara(ZX); }, 120);
    }

    function baslat() {
      durum.textContent = 'Kamera açılıyor…';
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { kameraYok('Bu cihazda kamera erişimi yok.'); return; }
      Promise.all([zxingYukle(), navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } })]).then(function (r) {
        var ZX = r[0]; akim = r[1];
        if (kapali) { durdur(); return; }
        var ipucu = new Map();
        ipucu.set(ZX.DecodeHintType.POSSIBLE_FORMATS, [ZX.BarcodeFormat.EAN_13, ZX.BarcodeFormat.EAN_8, ZX.BarcodeFormat.UPC_A, ZX.BarcodeFormat.CODE_128, ZX.BarcodeFormat.DATA_MATRIX, ZX.BarcodeFormat.QR_CODE, ZX.BarcodeFormat.ITF, ZX.BarcodeFormat.CODE_39]);
        ipucu.set(ZX.DecodeHintType.TRY_HARDER, true);
        okuyucu = new ZX.MultiFormatReader(); okuyucu.setHints(ipucu);
        video.srcObject = akim;
        return video.play().catch(function () {}).then(function () { durum.textContent = 'Ürünün barkodunu kameraya tutun…'; tara(ZX); });
      }).catch(function (e) {
        var ad = e && e.name;
        if (ad === 'NotAllowedError' || ad === 'SecurityError') kameraYok('Kamera izni verilmedi (Ayarlar > MY Medikal > Kamera).');
        else if (ad === 'NotFoundError' || ad === 'OverconstrainedError') kameraYok('Kamera bulunamadı.');
        else kameraYok('Kamera açılamadı.');
      });
    }
    baslat();
    return { kapat: kapatFn, sorgula: goster };
  }

  window.MMBarkod = { ac: ac, kapsa: kapsa, gs1Coz: gs1Coz, anahtar: anahtar };
})();
