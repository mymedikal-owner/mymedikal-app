


(function () {
  'use strict';
  var MM = window.MM, gr = MM.gr, h = MM.h;
  var toastEl = null, toastT = null;
  function bildir(m) { if (!toastEl) { toastEl = h('div', { sinif: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(toastEl); } toastEl.textContent = m; toastEl.classList.add('goster'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('goster'); }, 2800); }
  function ornekEt(t) { return h('span', { sinif: 'etiket ornek', metin: t || 'ÖRNEK' }); }
  function adimlar(l) { return h('ul', { sinif: 'ozellik-liste' }, l.map(function (x) { return h('li', null, [gr.ikon('tik', 16), h('span', { metin: x })]); })); }
  function bekleyen(l) { return h('div', { sinif: 'bekle-liste' }, l.map(function (x) { return h('div', { sinif: 'bekle-oge' }, [h('span', { sinif: 'bekle-ik' }, [gr.ikon(x[0], 18)]), h('div', null, [h('b', { metin: x[1] }), h('small', { metin: x[2] })]), h('span', { sinif: 'etiket kismi', metin: 'bekliyor' })]); })); }

  function kabuk(kok, o) {
    kok.appendChild(gr.sayfaBasi({ baslik: o.ad, alt: o.alt, kirinti: [[o.ad]] }));
    if (!o.canli) kok.appendChild(h('div', { sinif: 'bant ornek', role: 'status', metin: 'ÖNİZLEME — ÖRNEK VERİ: bu ekran taslaktır, rakamlar sahte, hiçbir düğme kayıt yapmaz' }));
    kok.appendChild(h('div', { sinif: 'yeni-izgara tek' }, [h('div', { sinif: 'yeni-onizleme' }, [o.govde])]));   
  }
  function aralik(n, f) { var a = []; for (var i = 0; i < n; i++) a.push(f(i)); return a; }

   
  MM.moduller.stok = function (kok) {
    var KOD = { '8682279940335': ['ÖRNEK Eldiven M (200/kutu)', 'P-ÖRNEK-01', '2028-03', 'Ana depo · A-12', 4200], '8682279940342': ['ÖRNEK Spanç 7,5×7,5', 'P-ÖRNEK-02', '2027-09', 'Ana depo · B-04', 18500], '8682279940359': ['ÖRNEK Gazlı bez 10×10', 'P-ÖRNEK-03', '2027-06', 'Mamul depo · C-02', 960] };
    var secili = '8682279940335', adet = 1, mod = 'sayim';
    var sonuc = h('div', { sinif: 'tarama-sonuc', 'aria-live': 'polite' }), say = h('output', { sinif: 'adet-deger', metin: '1' });
    function sonucCiz() {
      var m = KOD[secili]; sonuc.textContent = '';
      sonuc.appendChild(h('div', { sinif: 'tarama-ad' }, [h('b', { metin: m[0] }), ornekEt()]));
      var dl = h('dl', { sinif: 'degerler' }); [['Barkod (EAN)', secili], ['Parti / lot', m[1]], ['Son kullanma', m[2]], ['Depo yeri', m[3]], ['Sistemdeki miktar', MM.sayi(m[4]) + ' adet (ÖRNEK)']].forEach(function (c) { dl.appendChild(h('dt', { metin: c[0] })); dl.appendChild(h('dd', { metin: c[1] })); });
      sonuc.appendChild(dl);
    }
    var kod = h('div', { sinif: 'cip-sira', role: 'group', 'aria-label': 'Örnek barkodlar' }, Object.keys(KOD).map(function (k) { return h('button', { type: 'button', sinif: 'cip', 'aria-pressed': 'false', onclick: function (e) { secili = k; Array.prototype.forEach.call(e.currentTarget.parentNode.children, function (c) { c.classList.toggle('secili', c === e.currentTarget); c.setAttribute('aria-pressed', String(c === e.currentTarget)); }); sonucCiz(); } }, [k.slice(-6) + ' · ' + KOD[k][0].replace('ÖRNEK ', '')]); }));
    var cerceve = h('div', { sinif: 'tarayici', role: 'img', 'aria-label': 'Barkod okuyucu görünümü (örnek)' }, [h('div', { sinif: 'tarayici-cizgi' }), h('div', { sinif: 'barkod-cizim' }, aralik(34, function (i) { return h('i', { style: 'width:' + (1 + (i * 7 % 4)) + 'px;margin-right:' + (1 + (i * 5 % 3)) + 'px' }); })), h('span', { sinif: 'tarayici-not', metin: 'Kamerayı barkoda tutun' })]);
    var modlar = h('div', { sinif: 'cip-sira', role: 'group', 'aria-label': 'İşlem türü' }, [['giris', 'Mal girişi'], ['cikis', 'Çıkış'], ['sayim', 'Sayım']].map(function (m) { return h('button', { type: 'button', sinif: 'cip' + (mod === m[0] ? ' secili' : ''), 'aria-pressed': String(mod === m[0]), onclick: function (e) { mod = m[0]; Array.prototype.forEach.call(e.currentTarget.parentNode.children, function (c) { var on = c === e.currentTarget; c.classList.toggle('secili', on); c.setAttribute('aria-pressed', String(on)); }); } }, [m[1]]); }));
    var ad = h('div', { sinif: 'adet' }, [h('button', { type: 'button', sinif: 'dugme ikincil', 'aria-label': 'Azalt', onclick: function () { adet = Math.max(1, adet - 1); say.textContent = adet; } }, ['−']), say, h('button', { type: 'button', sinif: 'dugme ikincil', 'aria-label': 'Artır', onclick: function () { adet++; say.textContent = adet; } }, ['+'])]);
    var telefon = h('div', { sinif: 'telefon-cerceve' }, [h('div', { sinif: 'telefon-ust' }, [h('b', { metin: 'Depo — barkod tarama' }), ornekEt()]), cerceve, kod, modlar, sonuc, h('div', { sinif: 'adet-sira' }, [h('span', { metin: 'Adet' }), ad]), h('button', { type: 'button', sinif: 'dugme tam', onclick: function () { bildir('Önizleme: kayıt yapılmadı. Gerçek sürümde SAP\'ye yazma yetkisi ve onay kuralı gerekir.'); } }, [gr.ikon('tik', 18), ' Kaydı onayla (örnek)'])]);
    sonucCiz();
    var stok = [['ÖRNEK Eldiven M', 'Ana depo', 4200, 'P-ÖRNEK-01', 620], ['ÖRNEK Eldiven L', 'Ana depo', 2750, 'P-ÖRNEK-04', 410], ['ÖRNEK Spanç 7,5×7,5', 'Ana depo', 18500, 'P-ÖRNEK-02', 330], ['ÖRNEK Gazlı bez 10×10', 'Mamul depo', 960, 'P-ÖRNEK-03', 90], ['ÖRNEK Batın kompres', 'Mamul depo', 5400, 'P-ÖRNEK-05', 45]];
    var tablo = gr.tablo({ kolonlar: [{ ad: 'Malzeme', k: 'ad' }, { ad: 'Depo', k: 'depo' }, { ad: 'Miktar', k: 'miktar', sag: true, ciz: function (r) { return MM.sayi(r.miktar); } }, { ad: 'Parti', k: 'parti' }, { ad: 'SKT (gün)', k: 'skt', sag: true, ciz: function (r) { return h('span', { sinif: 'skt ' + (r.skt < 60 ? 'kirmizi' : (r.skt < 180 ? 'sari' : '')), metin: r.skt + (r.skt < 60 ? ' · yakın' : '') }); } }],
      satirlar: stok.map(function (s) { return { ad: s[0], depo: s[1], miktar: s[2], parti: s[3], skt: s[4] }; }), sira: { k: 'skt', yon: 'yukari' } });
    var sag = h('div', null, [gr.kart({ baslik: 'Stok durumu', alt: 'SAP stok tablolarından gelecek (salt okunur)', govde: tablo, eylem: ornekEt() }), h('div', { sinif: 'kpi-izgara ust-bosluk' }, [gr.kpi({ baslik: 'Toplam kalem', deger: '5', birim: 'malzeme (örnek)', etiket: { metin: 'ÖRNEK', tur: 'ornek' } }), gr.kpi({ baslik: 'SKT 60 günden az', deger: '3', birim: 'parti (örnek)', durum: 'uyari', etiket: { metin: 'ÖRNEK', tur: 'ornek' } })])]);
    kabuk(kok, { ad: 'Stok', alt: 'Depo ve mamul stok, barkodla hareket', govde: h('div', { sinif: 'stok-kolon' }, [telefon, sag]), });
  };

   
  MM.moduller.ik = function (kok) {
    var tur = 'Yıllık izin', bas = '', bit = '';
    var halka = (function () { var W = 140, r = 56, c = 2 * Math.PI * r, k = 14 / 22; var s = gr.s('svg', { viewBox: '0 0 ' + W + ' ' + W, width: 130, height: 130, role: 'img', 'aria-label': 'Örnek izin bakiyesi: 22 günden 8 gün kullanıldı, 14 gün kaldı' });
      s.appendChild(gr.s('circle', { cx: 70, cy: 70, r: r, fill: 'none', stroke: 'var(--yuzey3)', 'stroke-width': 14 })); s.appendChild(gr.s('circle', { cx: 70, cy: 70, r: r, fill: 'none', stroke: 'var(--s1)', 'stroke-width': 14, 'stroke-dasharray': (c * k).toFixed(1) + ' ' + c, 'stroke-linecap': 'round', transform: 'rotate(-90 70 70)' }));
      s.appendChild(gr.s('text', { x: 70, y: 70, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 700, fill: 'var(--yazi)' }, ['14'])); s.appendChild(gr.s('text', { x: 70, y: 90, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--soluk)' }, ['gün kaldı'])); return s; })();
    var bakiye = gr.kart({ baslik: 'İzin bakiyem', alt: 'Yıllık izin (örnek)', eylem: ornekEt(), govde: h('div', { sinif: 'ik-bakiye' }, [halka, h('dl', { sinif: 'degerler' }, [h('dt', { metin: 'Hak edilen' }), h('dd', { metin: '22 gün' }), h('dt', { metin: 'Kullanılan' }), h('dd', { metin: '8 gün' }), h('dt', { metin: 'Bekleyen talep' }), h('dd', { metin: '0' })])]) });
    var tarih = function (ad, set) { return h('label', { sinif: 'alan' }, [h('span', { metin: ad }), h('input', { type: 'date', oninput: function (e) { set(e.target.value); } })]); };
    var form = gr.kart({ baslik: 'İzin talebi', alt: 'Yöneticiye gider (örnek akış)', eylem: ornekEt(), govde: h('form', { sinif: 'ik-form', onsubmit: function (e) { e.preventDefault(); bildir('Önizleme: talep gönderilmedi. Gerçek sürümde yöneticiye iletilir.'); } }, [
      h('label', { sinif: 'alan' }, [h('span', { metin: 'İzin türü' }), h('select', { onchange: function (e) { tur = e.target.value; } }, ['Yıllık izin', 'Mazeret izni', 'Ücretsiz izin'].map(function (t) { return h('option', { metin: t }); }))]),
      tarih('Başlangıç', function (v) { bas = v; }), tarih('Bitiş', function (v) { bit = v; }),
      h('label', { sinif: 'alan tam' }, [h('span', { metin: 'Not (isteğe bağlı)' }), h('input', { type: 'text', placeholder: 'Örnek açıklama', maxlength: 120 })]),
      h('button', { type: 'submit', sinif: 'dugme' }, [gr.ikon('gonder', 18), ' Talep gönder (örnek)'])]) });
    var aylar = ['Ekim', 'Eylül', 'Ağustos', 'Temmuz'];
    var bordro = gr.kart({ baslik: 'Bordro pusulası', alt: 'Yalnız kişinin kendisi görür', eylem: ornekEt(), govde: h('div', { sinif: 'pusula-liste' }, aylar.map(function (a, i) { return h('div', { sinif: 'pusula' }, [h('span', { sinif: 'pusula-ik' }, [gr.ikon('belge', 20)]), h('div', null, [h('b', { metin: a + ' 2026 pusulası' }), h('small', { metin: 'PDF · örnek dosya' })]), h('button', { type: 'button', sinif: 'mini-dugme', onclick: function () { bildir('Önizleme: gerçek pusula yok. Gerçek sürümde yalnız oturum açan kişinin kayıtları açılır.'); } }, [gr.ikon('kilit', 16), ' Aç'])]); })) });
    var duyuru = gr.kart({ baslik: 'Duyurular', eylem: ornekEt(), govde: h('ul', { sinif: 'liste' }, [['ÖRNEK duyuru: yıllık izin planı', '3 gün önce'], ['ÖRNEK duyuru: İSG eğitimi takvimi', '1 hafta önce']].map(function (d) { return h('li', null, [h('span', { metin: d[0] }), h('span', { sinif: 'soluk', metin: d[1] })]); })) });
    kabuk(kok, { ad: 'İK', alt: 'İzin, bordro pusulası, duyurular', govde: h('div', { sinif: 'iki-kolon' }, [h('div', { sinif: 'yigin' }, [bakiye, form]), h('div', { sinif: 'yigin' }, [bordro, duyuru])]), });
  };

   
  MM.moduller.onay = function (kok) {
    var ORN = [['ÖRNEK-001', 'Satınalma siparişi onayı', 'Satınalma', 'bekleyen', 'ÖRNEK tedarikçi · ÖRNEK tutar', 'Yetkili onayı gerekir'], ['ÖRNEK-002', 'Müşteri satış siparişi kaydı', 'Satış', 'bekleyen', 'ÖRNEK hastane · 3 kalem', 'Satış yetkilisi onayı gerekir'], ['ÖRNEK-003', 'Şirket dışı bilgilendirme maili', 'İletişim', 'bekleyen', 'ÖRNEK alıcı · taslak metin', 'Gönderimden önce yetkili içeriği görür'], ['ÖRNEK-004', 'e-fatura gönderimi', 'Fatura', 'onaylanan', 'ÖRNEK belge no', 'Yetkili onayı verildi'], ['ÖRNEK-005', 'Fiyat revizyonu girişi', 'İhale', 'reddedilen', 'ÖRNEK ihale', 'Karar sahibi onaylamadı']];
    var filtre = 'bekleyen', secili = ORN[0][0], govde = h('div');
    function ciz() {
      govde.textContent = ''; var l = ORN.filter(function (x) { return x[3] === filtre; }); if (!l.some(function (x) { return x[0] === secili; })) secili = l[0] ? l[0][0] : null;
      var say = function (f) { return ORN.filter(function (x) { return x[3] === f; }).length; };
      govde.appendChild(gr.cipler([['bekleyen', 'Bekleyen', say('bekleyen')], ['onaylanan', 'Onaylanan', say('onaylanan')], ['reddedilen', 'Reddedilen', say('reddedilen')]], filtre, function (v) { filtre = v; ciz(); }, 'Onay durumu'));
      var liste = h('div', { sinif: 'inbox-liste', role: 'listbox', 'aria-label': 'Onay kutusu' }), ayr = h('div', { sinif: 'inbox-detay' });
      l.forEach(function (x) { liste.appendChild(h('button', { type: 'button', role: 'option', 'aria-selected': String(x[0] === secili), sinif: 'inbox-oge' + (x[0] === secili ? ' secili' : ''), onclick: function () { secili = x[0]; ciz(); } }, [h('span', { sinif: 'inbox-ik' }, [gr.ikon('onay', 18)]), h('span', { sinif: 'palet-ad' }, [h('b', { metin: x[1] }), h('small', { metin: x[2] + ' · ' + x[4] })]), ornekEt()])); });
      if (!l.length) liste.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu durumda örnek kayıt yok.' }));
      var s = ORN.filter(function (x) { return x[0] === secili; })[0];
      if (s) {
        ayr.appendChild(h('div', { sinif: 'kart2-ust' }, [h('div', null, [h('h3', { metin: s[1] }), h('p', { sinif: 'kart2-alt', metin: 'Talep no ' + s[0] + ' · ' + s[2] })]), ornekEt()]));
        var dl = h('dl', { sinif: 'degerler' }); [['Konu', s[4]], ['Onay kuralı', s[5]], ['Durum', { bekleyen: 'Karar bekliyor', onaylanan: 'Onaylandı', reddedilen: 'Reddedildi' }[s[3]]], ['Onay yolu', 'Mevcut onay akışı']].forEach(function (c) { dl.appendChild(h('dt', { metin: c[0] })); dl.appendChild(h('dd', { metin: c[1] })); });
        ayr.appendChild(dl);
        if (s[3] === 'bekleyen') ayr.appendChild(h('div', { sinif: 'onay-dugme' }, [h('button', { type: 'button', sinif: 'dugme', onclick: function () { bildir('Önizleme: ONAY iletilmedi. Gerçek sürüm kodu mevcut onay akışına iletir.'); } }, [gr.ikon('tik', 18), ' ONAY']), h('button', { type: 'button', sinif: 'dugme ikincil', onclick: function () { bildir('Önizleme: RED iletilmedi.'); } }, [gr.ikon('kapat', 18), ' RED'])]));
      }
      govde.appendChild(h('div', { sinif: 'inbox' }, [liste, ayr]));
    }
    ciz();
    kabuk(kok, { ad: 'Onaylar', alt: 'Onay kutusu — tek dokunuşla ONAY / RED', govde: gr.kart({ baslik: 'Onay kutusu', alt: 'Bekleyen ve karara bağlanan onaylar', eylem: ornekEt(), govde: govde }), });
  };

   
  

  var AS = MM.asistanDurum = MM.asistanDurum || { gecmis: [], bekleyen: false, ui: null };
  function Tt(k) { return MM.t ? MM.t(k) : k; }
  var AS_KLASOR_AD = {};
  function asBalon(o) {
    var kaynaklar = o.klasorler;
    var m = h('div', { sinif: 'mesaj ' + o.k }, [h('div', { sinif: 'balon' }, [h('p', { metin: o.metin }), kaynaklar && kaynaklar.length ? h('div', { sinif: 'kaynak-satir' }, [h('span', { sinif: 'soluk kucuk', metin: Tt('Dayandığı bilgiler:') })].concat(kaynaklar.map(function (k) { return h('span', { sinif: 'kaynak-rozet' }, [gr.ikon('belge', 14), AS_KLASOR_AD[k] || k]); }))) : null])]);
    return m;
  }
  function asMailHref(govde) { var p = window.MM.talimatPosta || ''; if (!p) return ''; return 'mailto:' + p + '?subject=' + encodeURIComponent('[Talimat] App asistan sorusu') + (govde ? '&body=' + encodeURIComponent(govde) : ''); }
  function asEylemSatiri(o) {   
    var ic = [];
    if (o.hata) { var yd = h('button', { type: 'button', sinif: 'dugme ikincil', metin: Tt('Yeniden dene') }); yd.addEventListener('click', function () { asGonder(o.soru, true); }); ic.push(yd); }
    ic.push(h('a', { sinif: 'dugme ikincil', href: asMailHref(o.soru), hidden: !asMailHref(o.soru), metin: Tt('İş olarak ilet') }));
    return h('div', { sinif: 'kaynak-satir' }, ic);
  }
  function asUiGuncelle() {
    var u = AS.ui; if (!u || !u.akis.isConnected) return;
    if (u.yaziyor && u.yaziyor.parentNode) u.yaziyor.parentNode.removeChild(u.yaziyor);
    if (AS.bekleyen) { u.yaziyor = h('div', { sinif: 'mesaj asistan yaziyor', role: 'status' }, [h('div', { sinif: 'balon' }, [h('p', { sinif: 'soluk', metin: Tt('yazıyor…') })])]); u.akis.appendChild(u.yaziyor); }
    if (u.dugme) u.dugme.disabled = AS.bekleyen;
    u.akis.scrollTop = u.akis.scrollHeight;
  }
  function asEkle(o) {
    o.ts = Date.now(); AS.gecmis.push(o); if (AS.gecmis.length > 40) AS.gecmis.shift();
    var u = AS.ui;
    if (u && u.akis.isConnected) { var bosEl = u.akis.querySelector('.asistan-bos'); if (bosEl) bosEl.remove(); u.akis.appendChild(asBalon(o)); if (o.soru && o.k === 'asistan') u.akis.appendChild(asEylemSatiri(o)); }
    asUiGuncelle();
  }
  function asBitir(o) { AS.bekleyen = false; asEkle(o); if (typeof MM.asistanDegisti === 'function') { try { MM.asistanDegisti(); } catch (e) {   } } }
  function asYokla(id, soru, gecen, bekle) {
    setTimeout(async function () {
      var c = null;
      try { c = await window.MMVeri.sohbetCevap(id); } catch (e) { c = null; }
      if (c) { MM.asistanSon = { metin: String(c.cevap || ''), ts: Date.now() }; asBitir({ k: 'asistan', metin: String(c.cevap || ''), klasorler: c.klasorler, soru: soru }); return; }
      gecen += bekle;
      if (gecen >= 300000) { asBitir({ k: 'asistan', metin: Tt('Cevap gecikti. Yeniden sorabilir ya da iş olarak iletebilirsiniz.'), soru: soru, hata: true }); return; }
      asYokla(id, soru, gecen, Math.min(15000, bekle + 2500));
    }, bekle);
  }
  async function asGonder(soru, tekrar) {
    soru = String(soru || '').trim().slice(0, 1000);
    if (!soru || AS.bekleyen) return false;
    AS.bekleyen = true;
    if (!tekrar) asEkle({ k: 'kullanici', metin: soru }); else asUiGuncelle();
    try { var s = await window.MMVeri.sohbetSor(soru); asYokla(s.id, soru, 0, 5000); }
    catch (err) { asBitir({ k: 'asistan', metin: Tt('Soru iletilemedi') + ' (' + (err && err.message ? err.message : Tt('hata')) + ').', soru: soru, hata: true }); }
    return true;
  }
  MM.asistanSohbet = function () {
    var rol = MM.rol(), roller = (window.MM_AYAR.roller || {}), KAYNAK = [['eldiven', 'Eldiven haritası'], ['siparis', 'Siparişler'], ['makineler', 'Makineler'], ['kalite', 'Kalite belgeleri'], ['isg', 'İSG takvimi'], ['stok', 'Stok'], ['ik', 'İK (yalnız kendi kaydın)'], ['finans', 'Finans'], ['muhasebe', 'Muhasebe']];
    var erisilen = KAYNAK.filter(function (k) { return MM.acik(k[0]) && window.MMVeri.ozelErisim(k[0]) && ((roller[k[0]] || []).indexOf(rol) >= 0 || (window.MMVeri.mod() === 'graph' && !!(window.MM_AYAR.ozelErisim || {})[k[0]])); });
    var sohbetDurum = window.MMVeri.sohbetAcik ? window.MMVeri.sohbetAcik() : { acik: false, neden: 'kapali' };
    KAYNAK.forEach(function (k) { AS_KLASOR_AD[k[0]] = k[1]; });
    var akis = h('div', { sinif: 'sohbet-akis', 'aria-live': 'polite' });
    var ui = { akis: akis, dugme: null, yaziyor: null };
    AS.ui = ui;
    var sohbetGovde = h('div', { sinif: 'sohbet' });
    function mailGorunum(metin, yeniden) {
      sohbetGovde.textContent = '';
      sohbetGovde.appendChild(h('p', { metin: Tt(metin) }));
      if (yeniden) { var yd = h('button', { type: 'button', sinif: 'dugme ikincil', metin: Tt('Yeniden dene') }); yd.addEventListener('click', function () { kapiAc(true); }); sohbetGovde.appendChild(yd); }
      sohbetGovde.appendChild(h('a', { sinif: 'dugme', href: asMailHref(''), hidden: !asMailHref(''), metin: Tt('Soruyu mail ile ilet') }));
    }
    function acikGorunum() {
      sohbetGovde.textContent = '';
      var giriKutu = h('input', { type: 'text', maxlength: '1000', placeholder: Tt('Sorunuzu yazın…'), 'aria-label': Tt('Sorunuz'), autocomplete: 'off' });
      var gonderDugme = h('button', { type: 'submit', sinif: 'dugme', 'aria-label': Tt('Gönder') }, [gr.ikon('gonder', 18)]);
      ui.dugme = gonderDugme;
      var giris = h('form', { sinif: 'sohbet-giris', onsubmit: function (e) {
        e.preventDefault();
        var soru = giriKutu.value.trim().slice(0, 1000);
        if (!soru || AS.bekleyen) return;
        giriKutu.value = '';
        asGonder(soru, false);
      } }, [giriKutu, gonderDugme]);
      [akis, giris, h('p', { sinif: 'soluk kucuk', metin: Tt('Sorular ve cevaplar denetim için kayda alınır, 90 gün saklanır.') })].forEach(function (x) { sohbetGovde.appendChild(x); });
      AS.gecmis.forEach(function (o) { akis.appendChild(asBalon(o)); if (o.soru && o.k === 'asistan') akis.appendChild(asEylemSatiri(o)); });   
      if (!AS.gecmis.length) {   
        var ORNEK = { siparis: 'Açık siparişlerin durumu nedir?', makineler: 'Bugün hangi makinelerde duruş var?', stok: 'Kritik stok seviyesindeki ürünler hangileri?', eldiven: 'Eldiven konteynerlerinin durumu nedir?' };
        var chipler = erisilen.filter(function (k) { return ORNEK[k[0]]; }).slice(0, 4).map(function (k) {
          var c = h('button', { type: 'button', sinif: 'asistan-ornek', metin: Tt(ORNEK[k[0]]) });
          c.addEventListener('click', function () { giriKutu.value = Tt(ORNEK[k[0]]); giriKutu.focus(); });
          return c;
        });
        akis.appendChild(h('div', { sinif: 'asistan-bos' }, [h('strong', { metin: Tt('Merhaba, size nasıl yardımcı olabilirim?') }), h('p', { sinif: 'soluk', metin: Tt('Aşağıya sorunuzu yazın; yanıtı yetkiniz olan bölümlerden hazırlarım.') }), chipler.length ? h('div', { sinif: 'asistan-ornekler' }, chipler) : null]));
      }
      asUiGuncelle();
    }
    function kapiAc(zorla) {
      sohbetGovde.textContent = '';
      sohbetGovde.appendChild(h('p', { sinif: 'soluk kucuk', metin: Tt('Asistan hazırlanıyor…') }));
      var kapiMail = function () { mailGorunum('Asistan şu an yanıt vermiyor. Sorunuzu mail ile iletin; cevap kendi yetkinize göre verilir.', true); };
      window.MMVeri.sohbetKapi(zorla === true).then(function (k) { if (k && k.acik) acikGorunum(); else kapiMail(); }, kapiMail);
    }
    if (!sohbetDurum.acik) {
      
      mailGorunum('Asistan yazma özelliği kurulunca bu ekrandan soru sorabileceksiniz. Şimdilik sorunuzu mail ile iletin; cevap kendi yetkinize göre verilir.');
    } else {
      
      kapiAc();
    }
    var kaynakSatiri = erisilen.length ? h('p', { sinif: 'asistan-kaynak soluk kucuk', metin: Tt('Erişebildiğin bölümler:') + ' ' + erisilen.map(function (k) { return Tt(k[1]); }).join(', ') }) : null;
    return { govde: sohbetGovde, kaynak: kaynakSatiri };
  };

  MM.moduller.asistan = function (kok) {
    var as = MM.asistanSohbet(), sohbetGovde = as.govde;
     
    var geriHedef = (MM.acik && MM.acik('mesaj')) ? '#mesaj' : '#ana';
    var geri = h('button', { sinif: 'ms-yd ms-yd-ust', type: 'button', 'aria-label': 'Geri' }, [MM.svg('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [MM.svg('path', { d: 'M15 5l-7 7 7 7' })])]);
    geri.addEventListener('click', function () { location.hash = geriHedef; });
    var asAv = h('span', { sinif: 'ms-av ms-av-ust ms-av-asistan', 'aria-hidden': 'true' }, [MM.svg('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: '#5b4bd5', 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [MM.svg('path', { d: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6' })])]);
    var ustCubuk = h('div', { sinif: 'ms-ust-cubuk ms-sohbet-ust' }, [geri, h('span', { sinif: 'ms-baslik-pill' }, [asAv, h('span', { sinif: 'ms-baslik-kutu' }, [h('strong', { sinif: 'ms-baslik', metin: 'Asistan' }), h('span', { sinif: 'ms-alt-yazi', metin: 'Şirket içi yapay zekâ asistanı' })])])]);
    var asKok = h('div', { sinif: 'ms-kok ms-ekran-sohbet asistan-ms asistan-sayfa' }, [ustCubuk]);
    if (as.kaynak) asKok.appendChild(as.kaynak);
    asKok.appendChild(sohbetGovde);
    kok.appendChild(asKok);   
    function asVv() {
      var v = window.visualViewport; if (!v) return;
      var ml = asKok.querySelector('.sohbet-akis');
      var enAlt = !!ml && (ml.scrollHeight - ml.scrollTop - ml.clientHeight < 40);
      var klavye = v.height > 120 && v.height < window.innerHeight - 80;   
      if (klavye) { asKok.style.setProperty('--ms-vh', Math.round(v.height) + 'px'); asKok.style.setProperty('--ms-ust', Math.round(v.offsetTop) + 'px'); }
      else { asKok.style.removeProperty('--ms-vh'); asKok.style.removeProperty('--ms-ust'); }
      document.body.classList.toggle('ms-klavye', klavye);
      if (ml && enAlt) ml.scrollTop = ml.scrollHeight;
    }
    function asVvGec() { asVv(); setTimeout(asVv, 120); setTimeout(asVv, 450); }   
    asVv(); if (window.visualViewport) { window.visualViewport.addEventListener('resize', asVv); window.visualViewport.addEventListener('scroll', asVv); }
    document.addEventListener('focusin', asVvGec); document.addEventListener('focusout', asVvGec);
    return function () {
      document.removeEventListener('focusin', asVvGec); document.removeEventListener('focusout', asVvGec);
      document.body.classList.remove('ms-tam'); document.body.classList.remove('ms-klavye');
      asKok.style.removeProperty('--ms-vh'); asKok.style.removeProperty('--ms-ust');
      if (window.visualViewport) { window.visualViewport.removeEventListener('resize', asVv); window.visualViewport.removeEventListener('scroll', asVv); }
    };
  };

   
  MM.moduller.finans = function (kok) {
    var ESKI_DK = 4 * 24 * 60;   
    var yuk = null, hata = null, canli = true;
    var LOC = window.MM_LOC || 'tr-TR';   
    function tl(n) { return n == null ? '—' : '₺ ' + Math.round(n).toLocaleString(LOC); }
    function mn(n) { return n == null ? '—' : (n !== 0 && Math.abs(n) < 1e5 ? '₺ ' + (n / 1e3).toLocaleString(LOC, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + (String(LOC).toLowerCase().indexOf('en') === 0 ? ' k' : ' bin') : Math.abs(n) >= 1e9 ?'₺ ' + (n / 1e9).toLocaleString(LOC, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mr' : '₺ ' + (n / 1e6).toLocaleString(LOC, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' mn'); }
    function trT(iso) { var p = String(iso).split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
    function kisaT(iso) { var p = String(iso).split('-'); return p[2] + '.' + p[1]; }
    var AY = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    function ayAd(k) { var p = k.split('-'); return AY[+p[1] - 1] + ' ' + p[0]; }
    function ciz() {
      kok.textContent = '';
      kok.appendChild(gr.sayfaBasi({ baslik: 'Finans', alt: 'Borç, teminat ve ödeme takvimi', kirinti: [['Finans']] }));
      var govde = h('div', { 'aria-live': 'polite' }); kok.appendChild(govde);
      if (hata) { govde.appendChild(gr.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Finans verisi alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(gr.iskelet('kart', 4)); return; }
      var v = yuk.veri, oz = v.ozet || {}, dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK;
      if (v.ornek === true) govde.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (eski) govde.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — kaynak dosya ' + (dk == null ? 'tarihsiz' : MM.yasMetin(dk) + ' tarihli') + '. Gösterilen değerler güncel olmayabilir.']));
      govde.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: (/NAK[İI]T/i.test((v.kaynak || {}).dosya || '') ? 'Nakit akış tablosu' : 'Kaynak') + ' · ' + trT((v.kaynak || {}).tarih_itibariyle || oz.tarih) }), h('span', { sinif: 'kaynak-etiket', metin: yuk.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]));
      if (v.krediler) { govde.appendChild(hazinePanel(v, oz, { ozet: eskiOzet, dmo: dmoKart })); return; }   
      eskiOzet(govde);
      function eskiOzet(govde, hz) {
      var on = v.onceki_gun, yak = (v.kredi_takvim || {}).yaklasan || [], aylik = (v.kredi_takvim || {}).aylik || [], cek = v.cek_takvim || [], seri = v.seri || [];
      var yakTop = yak.reduce(function (t, x) { return t + (x.tl || 0); }, 0);
      var spB = seri.map(function (x) { return x.borc == null ? null : x.borc / 1e6; }).filter(function (x) { return x != null; });
      govde.appendChild(h('div', { sinif: 'kpi-izgara' }, [
        gr.kpi({ baslik: 'Banka + leasing borcu', deger: mn(oz.borc_tl_karsiligi), birim: 'TL karşılığı', ikon: 'liste', spark: spB.length > 1 ? spB : null, sparkAd: 'son ' + spB.length + ' gün', deltalar: [gr.delta(oz.borc_tl_karsiligi, on && on.borc_tl_karsiligi, { iyi: 'asagi', etiket: on ? trT(on.tarih) + ' ile' : 'önceki gün' })], alt: 'USD ' + (oz.usd == null ? '—' : String(oz.usd).replace('.', ',')) + ' · EUR ' + (oz.eur == null ? '—' : String(oz.eur).replace('.', ',')) + ' kuruyla (dosyadaki kur)' + uzlastirmaMetni(v.ozet_hazine) }),
        gr.kpi({ baslik: 'Toplam teminat', deger: mn(oz.teminat_toplam), birim: 'TL karşılığı', ikon: 'kilit', deltalar: [gr.delta(oz.teminat_toplam, on && on.teminat_toplam, { iyi: null, etiket: on ? trT(on.tarih) + ' ile' : 'önceki gün' })] }),
        hz ? null : gr.kpi({ baslik: 'Önümüzdeki 30 gün taksit', deger: yak.length ? mn(yakTop) : '—', birim: yak.length ? yak.length + ' taksit' : 'veri yok', ikon: 'saat', durum: yak.length ? null : 'yok', alt: 'Açık kredi/leasing taksitleri, dosyadaki TL karşılığı' })].concat(hz || typeof v.banka_bakiye !== 'number' ? [] : [gr.kpi({ baslik: 'Banka bakiyesi', deger: tl(v.banka_bakiye), ikon: 'belge' })])));
      var tem = [['Çek', oz.cek, 'var(--s1)'], ['Temlik', oz.temlik, 'var(--s2)'], ['Nakit', oz.nakit, 'var(--s3)'], ['Leasing', oz.leasing, 'var(--s4)'], ['Kefalet', oz.kefalet, 'var(--s5)']].filter(function (x) { return x[1]; });
      var cizgiK = seri.length > 1 ? gr.kart({ baslik: 'Borç ve teminat eğilimi', alt: 'Son ' + seri.length + ' gün, milyar ₺', govde: gr.cizgi([{ ad: 'Borç', renk: 'var(--s1)', d: seri.map(function (x) { return x.borc == null ? null : Math.round(x.borc / 1e7) / 100; }) }, { ad: 'Teminat', renk: 'var(--s2)', d: seri.map(function (x) { return x.teminat == null ? null : Math.round(x.teminat / 1e7) / 100; }) }], seri.map(function (x) { return kisaT(x.t); }), { birim: 'mr ₺', yukseklik: 200, sifirdan: false }), tablo: { kolonlar: ['Tarih', 'Borç (mn ₺)', 'Teminat (mn ₺)'], satirlar: seri.slice(-14).reverse().map(function (x) { return [trT(x.t), x.borc == null ? '—' : (x.borc / 1e6).toFixed(1), x.teminat == null ? '—' : (x.teminat / 1e6).toFixed(1)]; }) } }) : gr.bos({ tur: 'bekle', baslik: 'Eğilim için yeterli gün yok', metin: 'Seri en az 2 gün gerektirir.' });
      var temK = gr.kart({ baslik: 'Teminat dağılımı', alt: trT(oz.tarih) + ' itibarıyla, milyon ₺', govde: tem.length ? gr.yatay(tem.map(function (x) { return { e: x[0], d: x[1], renk: x[2], etiketDeger: mn(x[1]) }; })) : gr.bos({ tur: 'bekle', baslik: 'Teminat verisi yok', metin: 'Kaynakta teminat satırı boş.' }) });
      govde.appendChild(h('div', { sinif: 'iki-kolon ust-bosluk' }, [cizgiK, temK]));
      var aylikK = gr.kart({ baslik: 'Aylık kredi/leasing taksit yükü', alt: 'Açık taksitler, dosyadaki TL karşılığı', govde: aylik.length ? gr.yatay(aylik.map(function (x) { return { e: ayAd(x.ay), d: x.tl, renk: 'var(--s1)', etiketDeger: mn(x.tl) + ' · ' + x.adet }; })) : gr.bos({ tur: 'bekle', baslik: 'Taksit verisi yok', metin: 'Krediler sayfasında açık taksit bulunamadı.' }), dip: 'Değerin yanındaki sayı taksit adedidir.' });
      var cekK = gr.kart({ baslik: 'Çek vade takvimi', alt: 'Önümüzdeki 30 gün, TL karşılığı', govde: cek.length ? gr.tablo({ kolonlar: [{ ad: 'Vade', k: 't', ciz: function (r) { return trT(r.t); } }, { ad: 'Tutar (TL karş.)', k: 'tl', sag: true, ciz: function (r) { return tl(r.tl); } }], satirlar: cek }) : gr.bos({ tur: 'bekle', baslik: 'Önümüzdeki 30 günde çek vadesi yok', metin: 'ÇEK sayfasında bu aralıkta tutar yok.' }) });
      if (!hz) govde.appendChild(h('div', { sinif: 'iki-kolon ust-bosluk' }, [aylikK, cekK]));   
      var YAK = 15;
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Yaklaşan taksitler', alt: 'Önümüzdeki 30 gün · ilk ' + Math.min(YAK, yak.length) + ' / ' + yak.length, govde: yak.length ? gr.tablo({ kolonlar: [{ ad: 'Tarih', k: 't', ciz: function (r) { return trT(r.t); } }, { ad: 'Tür', k: 'tur' }, { ad: 'Banka', k: 'banka' }, { ad: 'Kredi no', k: 'kredi_no', ciz: function (r) { return r.kredi_no || '—'; } }, { ad: 'Tutar (TL karş.)', k: 'tl', sag: true, ciz: function (r) { return tl(r.tl); } }], satirlar: yak.slice(0, YAK) }) : gr.bos({ tur: 'bekle', baslik: 'Yaklaşan taksit yok', metin: 'Önümüzdeki 30 günde açık taksit bulunamadı.' }), dip: yak.length > YAK ? (yak.length - YAK) + ' taksit daha var; tam liste Krediler sekmesinde.' : '' })]));
      sonKartlar(govde);
      }
      function yasKart(baslik, alt, x, kovaRenk, tur) {
        var cols = (x.sirketler || []).map(function (s) {
          var ek = [];
          if (tur === 'alacak' && s.acik_kredi_tl != null) {
            ek.push(h('p', { sinif: 'kucuk soluk', metin: 'Mahsup bekleyen tahsilat: ' + mn(Math.abs(s.acik_kredi_tl)) + (s.acik_kredi_adet != null ? ' · ' + s.acik_kredi_adet.toLocaleString(LOC) + ' kalem' : '') }));
            ek.push(h('p', { sinif: 'kucuk', metin: 'Net: ' + mn(s.toplam_tl - s.acik_kredi_tl) }));
          }
          if (tur === 'borc' && s.mahsup_bekleyen_tl != null) ek.push(h('p', { sinif: 'kucuk soluk', metin: 'Mahsup bekleyen: ' + mn(s.mahsup_bekleyen_tl) + (s.mahsup_bekleyen_adet != null ? ' · ' + s.mahsup_bekleyen_adet.toLocaleString(LOC) + ' kalem' : '') }));
          return h('div', null, [h('h4', { metin: s.sirket + ' · brüt (açık borç kalemleri) toplam ' + mn(s.toplam_tl) + ' · ' + s.adet.toLocaleString(LOC) + ' kalem' }),
            gr.yatay(s.kovalar.map(function (k, i) { return { e: k.ad, d: k.tl, renk: kovaRenk[i] || 'var(--s1)', etiketDeger: mn(k.tl) + ' · ' + k.adet.toLocaleString(LOC) }; }))].concat(ek));
        });
        return gr.kart({ baslik: baslik, alt: alt + ' · tarih itibarıyla ' + trT(x.tarih_itibariyle), govde: h('div', { sinif: 'iki-kolon' }, cols) });
      }
      function sonKartlar(govde) {
      if (v.alacak) govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [yasKart('Alacak yaşlandırma', 'Açık müşteri kalemleri, vadeye göre', v.alacak, ['var(--s3)', 'var(--s2)', 'var(--s1)', 'var(--s1)', 'var(--s5)', 'var(--s5)'], 'alacak')]));
      if (v.borc) govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [yasKart('Tedarikçi borcu', 'Açık satıcı kalemleri, vadeye göre', v.borc, ['var(--s5)', 'var(--s2)', 'var(--s3)', 'var(--s3)', 'var(--s4)'], 'borc')]));
      var dk = dmoKart(); if (dk) govde.appendChild(dk);
      }
      function dmoKart() {
      var dm = v.dmo_odeme;
      if (dm && dm.bankalar && dm.bankalar.length) {
        var gunler = dm.bankalar[0].gunler.map(function (g) { return g.t; });
        var kol = [{ ad: 'Banka', k: 'banka' }, { ad: 'Kredi (mn ₺)', k: 'kredi_mn_tl', sag: true, ciz: function (r) { return r.kredi_mn_tl == null ? '—' : r.kredi_mn_tl.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } }, { ad: 'DMO\'da bekleyen', k: 'dmo_bekleyen', sag: true, ciz: function (r) { return r.dmo_bekleyen == null ? '—' : r.dmo_bekleyen.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } }];
        gunler.forEach(function (t, i) { kol.push({ ad: String(t).replace(/\s*\(.*\)\s*$/, ''), k: 'g' + i, sag: true, ciz: function (r) { var m = r.gunler[i] && r.gunler[i].mn; return m == null ? '—' : m.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } }); });
        kol.push({ ad: 'Açık(+)/Fazla(−)', k: 'acik_fazla', sag: true, ciz: function (r) { return r.acik_fazla == null ? '—' : r.acik_fazla.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } });
        kol.push({ ad: 'Sonuç', k: 'sonuc', ciz: function (r) { var s = String(r.sonuc || ''), kisa = s.replace(/\s*\(.*\)\s*$/, ''); return kisa === s ? s : h('span', { title: s, metin: kisa }); } });
        var dmoRaporT = (dm.uretim || '').slice(0, 10);
        return (h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'DMO ödemesi → banka kredileri', alt: 'milyon ₺ · ilk ödeme ' + (dm.ilk_odeme || '—') + (dmoRaporT ? ' · rapor ' + trT(dmoRaporT) : '') + (dm.kismi ? ' · kısmi' : ''), govde: gr.tablo({ kolonlar: kol, satirlar: dm.bankalar }) })]));
      }
      return null;
      }
    }
     
    function uzlastirmaMetni(o) {
      var u = o && o.uzlastirma; if (!u) return '';
       
      return ' · Kredi listesiyle fark ' + mn(u.fark_tl);
    }
    var HZ_SEKME =[['ozet', 'Özet'], ['krediler', 'Krediler'], ['takvim', 'Ödeme takvimi'], ['cekler', 'Çekler'], ['dmo', 'DMO alacakları'], ['teminat', 'Teminat'], ['banka', 'Bankalar'], ['limit', 'Limitler'], ['doviz', 'Döviz']];
    var hzSek = new URLSearchParams(location.search).get('fsekme') || 'ozet', hzCek = 'verilen', hzTur = '', hzCekK = false, hzAy = null, hzDetay = null;
    function f1(n) { return n == null ? '—' : n.toLocaleString(LOC, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
    function pbS(pb) { return pb === 'USD' ? '$' : (pb === 'EUR' ? '€' : (!pb || pb === 'TL' ? '₺' : pb)); }    
    function dvz(n, pb) { if (n == null) return '—'; return pbS(pb) + ' ' + (Math.abs(n) >= 1e6 ? f1(n / 1e6) + ' mn' : Math.round(n).toLocaleString(LOC)); }
    function tut(n, pb) { return !pb || pb === 'TL' ? tl(n) : (n == null ? '—' : pbS(pb) + ' ' + Math.round(n).toLocaleString(LOC)); }
     
    function dvzHucre(n, pb, tlK) {
      if (n == null) return '—';
      if (!pb || pb === 'TL') return tl(n);
      return h('span', { sinif: 'hz-dvz' }, [h('b', { metin: tut(n, pb) }), tlK != null ? h('small', { metin: tl(tlK) }) : null]);
    }
     
     
    function nz(s) {
      return String(s == null ? '' : s).trim().toLocaleUpperCase('tr').replace(/İ/g, 'I').replace(/Ş/g, 'S').replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ö/g, 'O').replace(/Ç/g, 'C').replace(/\s+/g, ' ');
    }
    function logoAnahtar(ad, anahtar) { return (typeof anahtar === 'string' && /^[a-z0-9]{2,20}$/.test(anahtar)) ? anahtar : null; }
     
    function pc(sayi) { return String(LOC).toLowerCase().indexOf('en') === 0 ? sayi + '%' : '%' + sayi; }
    function bankaLogo(ad, anahtar, boy) {
      var k = logoAnahtar(ad, anahtar), bas = String(ad || '?').trim().charAt(0).toLocaleUpperCase('tr') || '?', i = 0, t = String(ad || '');
      for (var j = 0; j < t.length; j++) i += t.charCodeAt(j);
      var rozet = function () { return h('span', { sinif: 'hz-rozet', style: 'background:' + PAL[i % PAL.length], 'aria-hidden': 'true', metin: bas }); };
      var kap = h('span', { sinif: 'hz-logo' + (boy === 's' ? ' kucuk' : ''), 'aria-hidden': 'true' });
      if (!k || window.MM_WEB === true) { kap.appendChild(rozet()); return kap; }
      var im = h('img', { src: 'marka/banka/' + k + '.png', alt: '', width: 32, height: 32, loading: 'lazy', decoding: 'async' });
      im.addEventListener('error', function () { kap.textContent = ''; kap.appendChild(rozet()); });
      kap.appendChild(im); return kap;
    }
    function bankaAd(ad, anahtar, boy) { return h('span', { sinif: 'hz-bad' }, [bankaLogo(ad, anahtar, boy), h('span', { metin: ad == null ? 'Belirtilmemiş' : ad })]); }
    function yuzde(n) { return n == null ? '—' : pc(n.toLocaleString(LOC, { maximumFractionDigits: 2 })); }
    function kaynakSatir(ad, tarih) { return h('p', { sinif: 'hz-kaynak kucuk soluk', hidden: !tarih, metin: tarih ? 'Tarih itibarıyla ' + trT(String(tarih).slice(0, 10)) : '' }); }   
    function bnk(s) { return s == null ? 'Belirtilmemiş' : String(s).replace(/\(.*?\)/g, '').replace(/[-–].*$/, '').replace(/\d+/g, '').trim().toLocaleUpperCase('tr') || 'Belirtilmemiş'; }
    function gunMetin(g) { return g == null ? '—' : (g < 0 ? Math.abs(g) + ' gün geçti' : (g === 0 ? 'bugün' : g + ' gün kaldı')); }
    var PAL = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s7)', 'var(--s8)'];
    function ilerleme(oran) { return h('div', { sinif: 'hz-bar', role: 'img', 'aria-label': 'Ödenen oranı %' + Math.round(oran * 100) }, [h('i', { style: 'width:' + Math.max(0, Math.min(100, oran * 100)) + '%' })]); }
    function mini(baslik, deger, alt, durum) { return gr.kpi({ baslik: baslik, deger: deger, alt: alt, durum: durum || null }); }
    function halka(ogeler, ad) {
      var top = ogeler.reduce(function (t, x) { return t + (x.d || 0); }, 0), R = 48, C = 2 * Math.PI * R, off = 0;
      var svg = gr.s('svg', { viewBox: '0 0 130 130', 'class': 'hz-halka', role: 'group', 'aria-label': ad });
      svg.appendChild(gr.s('circle', { cx: 65, cy: 65, r: R, fill: 'none', stroke: 'var(--yuzey2)', 'stroke-width': 18 }));
      ogeler.forEach(function (x) {
        var len = top ? C * (x.d || 0) / top : 0;
        var c = gr.s('circle', { cx: 65, cy: 65, r: R, fill: 'none', stroke: x.renk, 'stroke-width': 18, 'stroke-dasharray': len + ' ' + (C - len), 'stroke-dashoffset': -off, transform: 'rotate(-90 65 65)' });
        gr.ipucu(c, [x.e + ': ' + (x.yok ? 'tutar kaynakta yok' : mn(x.d)), top ? '%' + (100 * x.d / top).toLocaleString(LOC, { maximumFractionDigits: 1 }) : '']); svg.appendChild(c); off += len;
      });
      svg.appendChild(gr.s('text', { x: 65, y: 62, 'text-anchor': 'middle', 'class': 'hz-halka-b' }, [String(ogeler.length)]));
      svg.appendChild(gr.s('text', { x: 65, y: 78, 'text-anchor': 'middle', 'class': 'g-yazi' }, ['tür']));
      return h('div', { sinif: 'hz-halka-kap' }, [svg, gr.lejant(ogeler.map(function (x) { return [x.e + ' · ' + (x.yok ? 'tutar kaynakta yok' : mn(x.d)), x.renk]; }))]);
    }
    function yiginCubuk(aylar, sec) {
      var W = 640, H = 230, sol = 44, alt = 26, ust = 12, n = aylar.length, yy = H - alt - ust, gen = (W - sol - 8) / Math.max(n, 1), cg = Math.min(gen * 0.7, 44);
       
      var poz = function (x) { return Math.max(0, x || 0); };
       
      var parca = function (a) { var an = a.anapara_tl || 0, fz = (a.faiz_tl || 0) + (a.diger_tl || 0), top = an + fz; return fz < 0 ? [Math.min(poz(an), poz(top)), 0] : [poz(an), poz(fz)]; };
      var mx = Math.max.apply(null, aylar.map(function (a) { var p = parca(a); return p[0] + p[1]; }).concat([1])) * 1.08;
      var svg = gr.s('svg', { viewBox: '0 0 ' + W + ' ' + H, 'class': 'grafik', role: 'group', 'aria-label': 'Aylık kredi ödemesi, anapara ve faiz' });
      [0, .5, 1].forEach(function (p) { var y = ust + yy * (1 - p); svg.appendChild(gr.s('line', { x1: sol, x2: W - 4, y1: y, y2: y, 'class': p ? 'g-izgara' : 'g-eksen' })); svg.appendChild(gr.s('text', { x: sol - 6, y: y + 4, 'text-anchor': 'end', 'class': 'g-yazi' }, [gr.kisa(mx * p / 1.08)])); });
      aylar.forEach(function (a, i) {
        var cx = sol + gen * i + (gen - cg) / 2, pc = parca(a), ha = yy * pc[0] / mx, hf = yy * pc[1] / mx, g = gr.s('g', { 'class': 'g-cubuk', 'data-ay': a.ay });
        g.appendChild(gr.s('rect', { x: cx, y: ust + yy - ha, width: cg, height: Math.max(ha, 1), style: 'fill:var(--s1)' }));
        g.appendChild(gr.s('rect', { x: cx, y: ust + yy - ha - hf, width: cg, height: Math.max(hf, 1), rx: 3, style: 'fill:var(--s2)' }));
        g.appendChild(gr.s('rect', { x: sol + gen * i, y: ust, width: gen, height: yy + alt, fill: 'transparent', 'class': 'g-hit' }));
        gr.ipucu(g, [ayAd(a.ay) + ': ' + mn((a.anapara_tl || 0) + (a.faiz_tl || 0) + (a.diger_tl || 0)), (a.faiz_tl < 0 ? 'Toplam ödeme ' + mn((a.anapara_tl || 0) + a.faiz_tl + (a.diger_tl || 0)) + ' · anapara/faiz ayrımı kaynakta düzeltiliyor · ' : 'Anapara ' + mn(a.anapara_tl) + ' · Faiz ' + mn(a.faiz_tl) + (a.diger_tl ? ' · Sigorta/diğer ' + mn(a.diger_tl) : '') + ' · ') + a.adet + ' taksit']); svg.appendChild(g);
        if (sec) g.addEventListener('click', function () { sec(a.ay); });   
        svg.appendChild(gr.s('text', { x: cx + cg / 2, y: H - 8, 'text-anchor': 'middle', 'class': 'g-yazi' }, [AY[+a.ay.split('-')[1] - 1]]));
      });
      return svg;
    }
    function dl(satirlar) { return h('dl', { sinif: 'hz-dl' }, satirlar.filter(function (x) { return !(x[1] == null && x[2] === 'gizle'); }).reduce(function (a, x) { return a.concat([h('dt', { metin: x[0] }), h('dd', { metin: x[1] == null ? 'veri yok' : String(x[1]) })]); }, [])); }
    function hazinePanel(v, oz, eski) {
      var kok = h('div', { sinif: 'hz' }), hz = v.ozet_hazine || {}, kr = v.krediler, cek = v.cekler || {}, tm = v.teminat, bb = v.banka_bakiye, dp = v.doviz_pozisyon;
      var NA = 'Nakit akış tablosu';
       
      var uy = [], ka = kr.toplam && kr.toplam.vadesi_gecmis_acik;
      if (hz.kredi_vadesi_gecmis_acik_tl > 0) uy.push('Vadesi geçmiş, ödeme teyidi bekleyen kredi taksiti: ' + mn(hz.kredi_vadesi_gecmis_acik_tl) + (ka && ka.adet ? ' · ' + ka.adet + ' kredi' : ''));
      if (hz.cek_vadesi_gecen_cikis_tl > 0) uy.push('Vadesi geçen verilen çek, ödeme teyidi bekleniyor: ' + mn(hz.cek_vadesi_gecen_cikis_tl));
      (Array.isArray(v.hazine_uyari) ? v.hazine_uyari : (v.hazine_uyari ? [v.hazine_uyari] : [])).forEach(function (u) { var t = typeof u === 'string' ? u : (u && (u.metin || u.mesaj)); if (t && !(v.cek_eski_tarih && /^cekler:/.test(t)) && !/Errno|No such file|Traceback|Exception|Error\b|\bhata:/i.test(t)) uy.push(t); });  
      if (uy.length) kok.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Ödeme teyidi bekleyen kalem var' }), h('p', { sinif: 'hz-teyit-not', metin: 'Banka hareketi bağlı değil: vadesi geçen kalem ödendi mi bilinmiyor; "gecikti" denmez.' }), h('ul', { sinif: 'hz-uyari' }, uy.map(function (t) { return h('li', { metin: t }); }))]));
       
      var ay0 = (v.kredi_odeme_aylik || {}).bu_ay, kalanB = hz.bu_ay_odenecek_kredi_tl, odenenB = hz.bu_ay_odenen_kredi_tl;
      var kAy = gr.kpi({ baslik: 'Bu ay ödenecek kredi', deger: mn(kalanB), birim: kalanB == null ? 'veri yok' : 'kalan', ikon: 'saat', durum: kalanB == null ? 'yok' : null, alt: odenenB == null ? null : 'Ödenen ' + mn(odenenB) + (ay0 && ay0.odenen_adet != null ? ' · ' + ay0.odenen_adet + ' taksit' : '') + ' · kalan ' + (ay0 && ay0.kalan_adet != null ? ay0.kalan_adet + ' taksit' : '') });
      if (kalanB != null && odenenB != null && kalanB + odenenB > 0) kAy.appendChild(ilerleme(odenenB / (kalanB + odenenB)));
      var cc = hz.cek_30gun_cikis_tl, cg = hz.cek_30gun_giris_tl;
      var dUsd = dp && dp.usd;
      var kpiler = [
        gr.kpi({ baslik: 'Toplam kredi borcu', deger: mn(hz.toplam_kredi_borcu_tl), birim: 'kalan anapara', ikon: 'liste', durum: hz.toplam_kredi_borcu_tl == null ? 'yok' : null, alt: [hz.kredi_adet != null ? hz.kredi_adet + ' kredi/leasing' : '', v.kur && v.kur.usd != null ? 'güncel kurla (USD ' + String(v.kur.usd).replace('.', ',') + ')' : '', hz.kaynak_toplam_tl != null && hz.toplam_kredi_borcu_tl != null && Math.abs(hz.kaynak_toplam_tl - hz.toplam_kredi_borcu_tl) > 1000 ? 'kaynak tablo, kullandırım kuruyla ' + mn(hz.kaynak_toplam_tl) : ''].filter(Boolean).join(' · ') || null }),
        kAy,
        gr.kpi({ baslik: '30 gün çek çıkışı / girişi', deger: mn(cc), birim: 'çıkış', ikon: 'belge', durum: cc == null ? 'yok' : null, alt: cg == null ? null : 'Giriş ' + mn(cg) + (cc != null ? ' · net ' + mn(cg - cc) : '') }),
        gr.kpi({ baslik: 'Nakit', deger: mn(hz.nakit_toplam_tl), birim: 'mevduat + bakiye', ikon: 'belge', durum: hz.nakit_toplam_tl == null ? 'yok' : null, alt: hz.mevduat_tl == null ? null : 'Mevduat ' + mn(hz.mevduat_tl) + ' · banka bakiyesi ' + mn(hz.nakit_bakiye_tl) }),
        gr.kpi({ baslik: 'Net borç', deger: mn(hz.net_borc_tl), birim: 'kredi borcu − nakit', ikon: 'liste', durum: hz.net_borc_tl == null ? 'yok' : null }),
        gr.kpi({ baslik: 'Teminat toplamı', deger: tm ? mn(tm.toplam.tl) : '—', birim: tm ? tm.toplam.adet + ' teminat' : 'veri yok', ikon: 'kilit', durum: tm ? null : 'yok' }),
        gr.kpi({ baslik: 'Döviz net pozisyon (USD)', deger: dUsd ? dvz(dUsd.net, 'USD') : '—', birim: dUsd ? 'TL karşılığı ' + mn(dUsd.net_tl_karsiligi) : 'veri yok', ikon: 'cubuk', durum: dUsd ? (dUsd.net < 0 ? 'kritik' : 'iyi') : 'yok' })
      ];
      kok.appendChild(h('div', { sinif: 'kpi-izgara' }, kpiler));
      var sek = h('div', { sinif: 'hz-sekme' }), kut = h('div', { sinif: 'ust-bosluk', 'aria-live': 'polite' });
      function sekCiz() { sek.textContent = ''; sek.appendChild(gr.sekmeler(HZ_SEKME, hzSek, function (id) { hzSek = id; sekCiz(); tabCiz(); }, { ad: 'Hazine görünümleri', goster: 9 })); }
      function tabCiz() { kut.textContent = ''; var f = { ozet: ozetTab, krediler: krediTab, takvim: takvimTab, cekler: cekTab, dmo: dmoTab, teminat: teminatTab, banka: bankaTab, limit: limitTab, doviz: dovizTab }[hzSek] || ozetTab; kut.appendChild(f()); }
      kok.appendChild(sek); kok.appendChild(kut); sekCiz(); tabCiz();
      function ozetTab() { var k = h('div'); eski.ozet(k, true); return k; }
       
      function kurSatiri() {
        var ku = v.kur; if (!ku || (ku.usd == null && ku.eur == null)) return null;
        return h('p', { sinif: 'hz-kaynak kucuk soluk', metin: 'Kur: ' + [ku.usd != null ? 'USD ' + String(ku.usd).replace('.', ',') : '', ku.eur != null ? 'EUR ' + String(ku.eur).replace('.', ',') : ''].filter(Boolean).join(' · ') + (ku.tarih ? ' · ' + trT(String(ku.tarih).slice(0, 10)) : '') });
      }
      function krediTab() {
        var k = h('div'), L = kr.liste || [], bz = (kr.banka_bazli || []).slice().sort(function (a, b) { return (b.kalan_anapara_tl || 0) - (a.kalan_anapara_tl || 0); });
        k.appendChild(kaynakSatir(NA, kr.kaynak && kr.kaynak.tarih_itibariyle));
        var kurS = kurSatiri(); if (kurS) k.appendChild(kurS);
        var ilk = bz.slice(0, 12), rest = bz.slice(12), items = ilk.map(function (b) { return { e: bankaAd(b.banka, b.logo, 's'), d: b.kalan_anapara_tl, renk: 'var(--s1)', etiketDeger: mn(b.kalan_anapara_tl) + ' · ' + b.adet }; });
        if (rest.length) items.push({ e: 'Diğer (' + rest.length + ' banka)', d: rest.reduce(function (t, b) { return t + (b.kalan_anapara_tl || 0); }, 0), renk: 'var(--gri)', etiketDeger: mn(rest.reduce(function (t, b) { return t + (b.kalan_anapara_tl || 0); }, 0)) + ' · ' + rest.reduce(function (t, b) { return t + b.adet; }, 0) });
        var tz = (kr.tur_bazli || []).slice().sort(function (a, b) { return (b.kalan_anapara_tl || 0) - (a.kalan_anapara_tl || 0); }).map(function (t, i) { var yz = L.filter(function (x) { return x.tur === t.tur; }); return { e: t.tur, d: t.kalan_anapara_tl, renk: PAL[i % PAL.length], yok: yz.length > 0 && yz.every(function (x) { return x.kalan_anapara == null; }) }; });
        k.appendChild(h('div', { sinif: 'iki-kolon' }, [gr.kart({ baslik: 'Banka bazında kalan anapara', alt: 'TL karşılığı · değerin yanında kredi adedi', govde: items.length ? gr.yatay(items) : gr.bos({ tur: 'bekle', baslik: 'Kredi verisi yok', metin: 'Kaynakta kredi satırı bulunamadı.' }) }),
          gr.kart({ baslik: 'Kredi türü dağılımı', alt: 'Kalan anapara, TL karşılığı', govde: tz.length ? halka(tz, 'Kredi türü dağılımı') : gr.bos({ tur: 'bekle', baslik: 'Tür verisi yok', metin: '' }) })]));
        var turler = Array.from(new Set(L.map(function (x) { return x.tur; }))).sort();
        var ckL = L.filter(function (x) { return x.cek_karsiligi === true; });
        var sapPb = {}; L.forEach(function (x) { (sapPb[x.sap_no] = sapPb[x.sap_no] || {})[x.pb || 'TL'] = 1; });    
        var ust3 = kr.toplam || {};
        var liste = (hzTur ? L.filter(function (x) { return x.tur === hzTur; }) : L).filter(function (x) { return !hzCekK || x.cek_karsiligi === true; });
         
        function toplamSatirlari(l) {
          var T = { TL: [0, 0], USD: [0, 0], EUR: [0, 0] }, n = 0;
          l.forEach(function (x) { if (x.kalan_anapara == null) return; var p = x.pb === 'USD' || x.pb === 'EUR' ? x.pb : 'TL'; T[p][0] += x.kalan_anapara; T[p][1] += x.kalan_anapara_tl || 0; n++; });
          return ['TL', 'USD', 'EUR'].filter(function (p) { return T[p][0] > 0; }).map(function (p) { return h('div', { sinif: 'hz-top-s' }, [h('b', { metin: p === 'TL' ? tl(T[p][0]) : tut(T[p][0], p) }), p === 'TL' ? null : h('small', { metin: tl(T[p][1]) })]); });
        }
        var topKutu = h('div', { sinif: 'hz-top' }, [
          h('div', { sinif: 'hz-top-k' }, [h('span', { sinif: 'hz-top-b', metin: (hzCekK ? 'Çek karşılığı' : 'Listedeki') + ' toplam kalan anapara' }), h('div', { sinif: 'hz-top-l' }, toplamSatirlari(liste).concat(liste.length ? [] : [h('small', { metin: 'Kayıt yok' })]))]),
          ust3.bakiye_tl != null ? h('div', { sinif: 'hz-top-k' }, [h('span', { sinif: 'hz-top-b', metin: 'Toplam bakiye' }), h('div', { sinif: 'hz-top-l' }, [h('div', { sinif: 'hz-top-s' }, [h('b', { metin: tl(ust3.bakiye_tl) }), h('small', { metin: 'taksitli: kalan taksit · diğer: kalan anapara' }), ust3.bakiye_yok_adet ? h('small', { metin: ust3.bakiye_yok_adet + ' kredi bakiyesi yok' }) : null])])]) : null,
          ckL.length ? h('div', { sinif: 'hz-top-k ck' }, [h('span', { sinif: 'hz-top-b', metin: 'Çek karşılığı krediler · ' + ckL.length + ' kredi' }), h('div', { sinif: 'hz-top-l' }, toplamSatirlari(ckL))]) : null]);
        var detayKut = h('div', { sinif: 'ust-bosluk' });
        function detayCiz() {
          detayKut.textContent = ''; var r = hzDetay; if (!r) return;
          var st = r.sonraki_taksit || {};
          detayKut.appendChild(gr.kart({ baslik: r.banka + ' · ' + r.tur, alt: (r.sirket || '') + (r.amac ? ' · ' + r.amac : ''), dip: r.tl_kaynak_farkli ? 'TL karşılığı güncel kurla hesaplandı' : '', govde: dl([
            ['Kredi no', r.kredi_no || null, 'gizle'], ['Varlık (leasing)', r.varlik || null, 'gizle'], ['Bakiye (' + (r.bakiye_esasi === 'kalan_toplam_taksit' ? 'kalan toplam taksit' : 'kalan anapara') + ')', r.bakiye == null ? null : tut(r.bakiye, r.pb) + ' (' + tl(r.bakiye_tl) + ')', 'gizle'], ['Kalan taksitlerdeki sigorta/diğer', r.kalan_diger_tl ? tl(r.kalan_diger_tl) : null, 'gizle'],
            ['Kullandırım tutarı', tut(r.kullandirim_tutari, r.pb)], ['Kalan anapara', r.kalan_anapara == null ? 'tutar kaynakta yok' : tut(r.kalan_anapara, r.pb) + ' (' + tl(r.kalan_anapara_tl) + ')'], ['Kalan toplam ödeme', r.kalan_odeme_tl == null ? null : tl(r.kalan_odeme_tl)],
            ['Faiz oranı', yuzde(r.faiz_orani)], ['Açılış tarihi', r.acilis ? trT(r.acilis) : null], ['Son vade', r.son_vade ? trT(r.son_vade) : null], ['Kalan taksit sayısı', r.kalan_taksit],
            ['Sonraki taksit', st.tarih ? trT(st.tarih) + ' · ' + tut(st.tutar, r.pb) : null], ['Vadesi geçmiş taksit', r.vadesi_gecmis ? 'ödeme teyidi bekleniyor' : 'yok'], ['Teminat', r.cek_karsiligi ? 'Çek karşılığı' + (r.teminat_metni ? ' — ' + r.teminat_metni : '') : (r.teminat_metni || 'belirtilmemiş')]]),
            eylem: h('button', { type: 'button', sinif: 'mini-dugme', onclick: function () { hzDetay = null; detayCiz(); } }, ['Kapat']) }));
        }
        var tb = gr.tablo({ satirlar: liste, sira: { k: 'kalan_anapara_tl', yon: 'asagi' }, bos: 'Bu türde kredi yok.', satirSinif: function (r) { return r.vadesi_gecmis ? 'hz-gecmis' : ''; },
          satirTikla: function (r) { hzDetay = r; detayCiz(); detayKut.scrollIntoView({ block: 'nearest' }); },
          kolonlar: [{ ad: 'Banka', k: 'banka', ciz: function (r) { return h('span', { sinif: 'hz-bh' }, [bankaAd(r.banka, r.logo, 's'), r.cek_karsiligi === true ? h('span', { sinif: 'hz-ck', metin: 'Çek karşılığı' }) : null, r.teminat_metni ? h('small', { sinif: 'hz-tm', metin: r.teminat_metni }) : null, Object.keys(sapPb[r.sap_no] || {}).length > 1 ? h('small', { sinif: 'hz-tm', metin: 'TL ve döviz ayrı satır' }) : null]); } }, { ad: 'Kredi no', k: 'kredi_no', ciz: function (r) { return r.kredi_no || '—'; } }, { ad: 'Tür', k: 'tur' },
            { ad: 'Kalan anapara', k: 'kalan_anapara_tl', sag: true, ciz: function (r) { return r.kalan_anapara == null ? 'tutar kaynakta yok' : dvzHucre(r.kalan_anapara, r.pb, r.kalan_anapara_tl); } },
            { ad: 'Bakiye', k: 'bakiye_tl', sag: true, ciz: function (r) { return r.bakiye == null ? '—' : dvzHucre(r.bakiye, r.pb, r.bakiye_tl); } },
            { ad: 'Faiz', k: 'faiz_orani', sag: true, ciz: function (r) { return yuzde(r.faiz_orani); } },
            { ad: 'Son vade', k: 'son_vade', ciz: function (r) { return r.son_vade ? trT(r.son_vade) : '—'; } },
            { ad: 'Sonraki taksit', k: 'sk', deger: function (r) { return r.sonraki_taksit && r.sonraki_taksit.tarih; }, ciz: function (r) { var s = r.sonraki_taksit; if (!(s && s.tarih)) return '—'; var d = r.pb === 'USD' || r.pb === 'EUR'; return h('span', { sinif: 'hz-dvz' }, [h('b', { metin: kisaT(s.tarih) + ' · ' + (d && s.tutar != null ? tut(s.tutar, r.pb) : tl(s.tl)) }), d && s.tl != null ? h('small', { metin: tl(s.tl) }) : null]); } },
            { ad: 'Şirket', k: 'sirket' }, { ad: 'PB', k: 'pb' }] });
        var ckSay = ckL.length;
        k.appendChild(gr.kart({ baslik: 'Kredi listesi (' + liste.length + ')', alt: 'Satıra dokununca ayrıntı açılır', eylem: null,
          govde: h('div', { sinif: 'hz-kredi' }, [gr.cipler([['', 'Tümü', L.length]].concat(turler.map(function (t) { return [t, t, L.filter(function (x) { return x.tur === t; }).length]; })), hzTur, function (t) { hzTur = t; tabCiz(); }, 'Kredi türü'),
            gr.cipler([['', 'Tüm teminatlar'], ['cek', 'Çek karşılığı', ckSay]], hzCekK ? 'cek' : '', function (t) { hzCekK = t === 'cek'; tabCiz(); }, 'Teminat süzgeci'), topKutu, tb]) }));
        k.appendChild(detayKut); detayCiz();
        return k;
      }
       
      function takvimTab() {
        var k = h('div'), ka2 = v.kredi_odeme_aylik, aylar = (ka2 && ka2.aylar) || [];
        k.appendChild(kaynakSatir(NA, ka2 && ka2.kaynak && ka2.kaynak.tarih_itibariyle));
        if (!aylar.length) { k.appendChild(gr.bos({ tur: 'bekle', baslik: 'Ödeme takvimi verisi yok', metin: 'Kaynakta açık taksit bulunamadı.' })); return k; }
        var b = ka2.bu_ay;
        var buAy = b ? gr.kart({ baslik: 'Bu ay (' + ayAd(b.ay) + ')', alt: 'Ödenen ve kalan taksit', govde: h('div', null, [ilerleme(b.odenen_tl + b.kalan_tl > 0 ? b.odenen_tl / (b.odenen_tl + b.kalan_tl) : 0),
          dl([['Ödenen', mn(b.odenen_tl) + ' · ' + b.odenen_adet + ' taksit'], ['Kalan', mn(b.kalan_tl) + ' · ' + b.kalan_adet + ' taksit'], ['Vadesi geçmiş, ödeme teyidi bekleyen', b.vadesi_gecmis_acik_tl > 0 ? mn(b.vadesi_gecmis_acik_tl) : 'yok']])]) }) : null;
        var yg = gr.kart({ baslik: 'Önümüzdeki 12 ay kredi ödemesi', alt: 'Anapara + faiz, TL karşılığı', govde: h('div', null, [yiginCubuk(aylar, function (ay) {
          var kaydir = function () { var e = document.getElementById('hz-ay-kirilim'); if (e && e.scrollIntoView) e.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
          if (ay !== hzAy) {
            hzAy = ay; tabCiz();   
            var yeni = kut.querySelector('.g-cubuk[data-ay="' + ay + '"] .g-hit'); if (yeni) yeni.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 0, clientY: 0 }));
          }
          setTimeout(kaydir, 1200);   
        }), gr.lejant([['Anapara', 'var(--s1)'], ['Faiz ve sigorta/diğer', 'var(--s2)']])]),
          dip: ka2.sonrasi ? 'Sonraki dönem: anapara ' + mn(ka2.sonrasi.anapara_tl) + ' + faiz ' + mn((ka2.sonrasi.faiz_tl || 0) + (ka2.sonrasi.diger_tl || 0)) + ' · ' + ka2.sonrasi.adet + ' taksit' : '' });
        k.appendChild(h('div', { sinif: 'iki-kolon' }, [yg, buAy]));
        if (!hzAy || !aylar.some(function (a) { return a.ay === hzAy; })) hzAy = aylar[0].ay;
        var sa = aylar.filter(function (a) { return a.ay === hzAy; })[0], bk = (sa.banka || []).slice().sort(function (a, c) { return (c.toplam_tl || 0) - (a.toplam_tl || 0); });
        k.appendChild(h('div', { id: 'hz-ay-kirilim', style: 'scroll-margin-top:72px' }, [gr.kart({ baslik: 'Banka kırılımı · ' + ayAd(hzAy), alt: 'Toplam ' + mn((sa.anapara_tl || 0) + (sa.faiz_tl || 0) + (sa.diger_tl || 0)) + ' · ' + sa.adet + ' taksit',
          govde: h('div', null, [gr.cipler(aylar.map(function (a) { return [a.ay, ayAd(a.ay)]; }), hzAy, function (a) { hzAy = a; tabCiz(); }, 'Ay'),
            gr.tablo({ satirlar: bk, sira: { k: 'toplam_tl', yon: 'asagi' }, bos: 'Bu ay için banka kırılımı yok.', kolonlar: [{ ad: 'Banka', k: 'banka', ciz: function (r) { return bankaAd(r.banka, r.logo, 's'); } }, { ad: 'Anapara', k: 'anapara_tl', sag: true, ciz: function (r) { return tl(r.anapara_tl); } }, { ad: 'Faiz', k: 'faiz_tl', sag: true, ciz: function (r) { return tl(r.faiz_tl); } }, { ad: 'Sigorta/diğer', k: 'diger_tl', sag: true, ciz: function (r) { return r.diger_tl ? tl(r.diger_tl) : '—'; } }, { ad: 'Toplam', k: 'toplam_tl', sag: true, ciz: function (r) { return tl(r.toplam_tl); } }] })]) })]));
        return k;
      }
       
      function cekTab() {
        var k = h('div'), c = cek[hzCek], renk = hzCek === 'verilen' ? 'var(--s2)' : 'var(--s3)';
        k.appendChild(kaynakSatir(NA, cek.kaynak && cek.kaynak.tarih_itibariyle));
        if (v.cek_eski_tarih) k.appendChild(h('div', { sinif: 'bant sari', role: 'status', metin: 'Çek verisi ' + trT(String(v.cek_eski_tarih).slice(0, 10)) + ' itibarıyla' }));    
        k.appendChild(gr.cipler([['verilen', 'Verilen çekler'], ['alinan', 'Alınan çekler']], hzCek, function (x) { hzCek = x; tabCiz(); }, 'Çek yönü'));
        if (!c) { k.appendChild(gr.bos({ tur: 'bekle', baslik: 'Çek verisi yok', metin: '' })); return k; }
        var t = c.toplam || {}, g = c.vadesi_gecen || {}, o30 = c.onumuzdeki_30_gun || {};
        k.appendChild(h('div', { sinif: 'kpi-izgara ust-bosluk' }, [
          mini('Toplam açık çek', mn(t.tl), (t.adet != null ? t.adet + ' çek' : '') + (t.USD ? ' · $ ' + f1(t.USD / 1e6) + ' mn' : '') + (t.EUR ? ' · € ' + f1(t.EUR / 1e3) + ' b' : '')),
          mini('Vadesi geçen', g.adet ? mn(g.tl) : 'yok', g.adet ? g.adet + ' çek' : '', g.adet && hzCek === 'verilen' ? 'kritik' : null),
          mini('Önümüzdeki 30 gün', mn(o30.tl), o30.adet != null ? o30.adet + ' çek' : '')]));
        var ha = (c.hafta || []).map(function (x) { return { e: kisaT(x.baslangic), d: x.tl, renk: renk, ipucu: [kisaT(x.baslangic) + ' – ' + kisaT(x.bitis) + ': ' + mn(x.tl), x.adet + ' çek'] }; });
        var ay = (c.ay || []).map(function (x) { return { e: ayAd(x.ay), d: x.tl, renk: renk, ipucu: [ayAd(x.ay) + ': ' + mn(x.tl), x.adet + ' çek'] }; });
        k.appendChild(h('div', { sinif: 'iki-kolon ust-bosluk' }, [gr.kart({ baslik: 'Haftalık vade', alt: 'Hafta başlangıcı · TL karşılığı', govde: ha.length ? gr.cubuk(ha, { ad: 'Haftalık çek vadesi', yukseklik: 190 }) : gr.bos({ tur: 'bekle', baslik: 'Vade verisi yok', metin: '' }) }),
          gr.kart({ baslik: 'Aylık vade', alt: 'TL karşılığı', govde: ay.length ? gr.cubuk(ay, { ad: 'Aylık çek vadesi', yukseklik: 190 }) : gr.bos({ tur: 'bekle', baslik: 'Vade verisi yok', metin: '' }) })]));
        function top8(l, ad) { return (l || []).filter(function (x) { return x.tl; }).slice(0, 8).map(function (x) { return { e: x[ad] == null ? 'Belirtilmemiş' : (ad === 'banka' ? bankaAd(x[ad], x.logo, 's') : x[ad]), d: x.tl, renk: renk, etiketDeger: mn(x.tl) + ' · ' + x.adet, anahtar: x[ad], tl: x.tl, adet: x.adet }; }); }
         
        function bugunGun(iso) { var p = String(iso).split('-'), t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((new Date(+p[0], +p[1] - 1, +p[2]) - t) / 864e5); }
        function cekPanel(o, ad, diger) {
          var rows = (c.liste || []).filter(function (r) { return (r[ad] == null ? null : r[ad]) === (o.anahtar == null ? null : o.anahtar); }).sort(function (a, b) { return String(a.vade || '9999').localeCompare(String(b.vade || '9999')); });
          var en = rows.filter(function (r) { return r.vade; })[0];
          var p = h('div', { sinif: 'hz-acilir', role: 'region' }, [h('p', { sinif: 'hz-ac-ozet', metin: 'Toplam ' + mn(o.tl) + ' · ' + o.adet + ' çek · En yakın vade ' + (en ? trT(en.vade) : '—') })]);
          var tb = h('div', { sinif: 'hz-ac-tablo' }, [h('div', { sinif: 'hz-ac-satir bas' }, [h('span', { metin: 'Vade' }), h('span', { sinif: 'sag', metin: 'Tutar (TL)' }), h('span', { metin: diger === 'banka' ? 'Banka' : 'Muhatap' }), h('span', { sinif: 'sag', metin: 'Kalan gün' })])]);
          rows.forEach(function (r) {
            var g = r.vade ? bugunGun(r.vade) : null, sn = g != null && g < 0 ? ' gecmis' : (g != null && g <= 7 ? ' yakin' : ''), dv = r.pb && r.pb !== 'TL';
            tb.appendChild(h('div', { sinif: 'hz-ac-satir' + sn }, [h('span', { metin: r.vade ? trT(r.vade) : '—' }), h('span', { sinif: 'sag', metin: dv ? tut(r.tutar, r.pb) + ' / ' + tl(r.tl) : tl(r.tl) }), h('span', { sinif: 'ad' }, [diger === 'banka' ? (r.banka ? bankaAd(r.banka, r.logo, 's') : '—') : (r.muhatap || '—')]), h('span', { sinif: 'sag', metin: gunMetin(g) })]));
          });
          p.appendChild(tb); return p;
        }
        function acilirYatay(ogeler, ad, diger) {
          var kap = gr.yatay(ogeler.map(function (o) { var d = o; return Object.assign({}, o, { tikla: function () { return; } }); }));
          kap.setAttribute('role', 'group');
          var btns = Array.prototype.slice.call(kap.querySelectorAll('button.y2-satir'));
          btns.forEach(function (b, i) {
            b.setAttribute('role', 'button'); b.setAttribute('aria-expanded', 'false'); b.classList.add('hz-ac-dugme');
            var panel = null;
            b.addEventListener('click', function () {
              if (panel) { panel.remove(); panel = null; b.setAttribute('aria-expanded', 'false'); b.classList.remove('acik'); return; }
              panel = cekPanel(ogeler[i], ad, diger); b.parentNode.insertBefore(panel, b.nextSibling); b.setAttribute('aria-expanded', 'true'); b.classList.add('acik');
            });
          });
          return kap;
        }
        var mu = top8(c.muhatap_bazli, 'muhatap'), bz = top8(c.banka_bazli, 'banka');
        k.appendChild(h('div', { sinif: 'iki-kolon' }, [gr.kart({ baslik: hzCek === 'verilen' ? 'Muhatap bazında (ilk 8)' : 'Keşideci bazında (ilk 8)', alt: 'TL karşılığı · çek adedi', govde: mu.length ? acilirYatay(mu, 'muhatap', 'banka') : gr.bos({ tur: 'bekle', baslik: 'Veri yok', metin: '' }) }),
          gr.kart({ baslik: 'Banka bazında (ilk 8)', alt: 'TL karşılığı · çek adedi', govde: bz.length ? acilirYatay(bz, 'banka', 'muhatap') : gr.bos({ tur: 'bekle', baslik: 'Veri yok', metin: '' }) })]));
        k.appendChild(gr.kart({ baslik: 'Çek listesi (' + (c.liste || []).length + ')', alt: c.liste_kisaltildi ? 'Liste kısaltılmıştır' : 'Vadeye göre sıralanır', govde: gr.tablo({ satirlar: c.liste || [], sira: { k: 'vade', yon: 'yukari' }, bos: 'Çek yok.', satirSinif: function (r) { return r.gun != null && r.gun < 0 ? 'hz-gecmis' : ''; },
          kolonlar: [{ ad: 'Vade', k: 'vade', ciz: function (r) { return r.vade ? trT(r.vade) : '—'; } }, { ad: 'Tutar', k: 'tutar', sag: true, ciz: function (r) { return tut(r.tutar, r.pb); } }, { ad: 'TL karşılığı', k: 'tl', sag: true, ciz: function (r) { return tl(r.tl); } },
            { ad: 'Banka', k: 'banka', ciz: function (r) { return r.banka ? bankaAd(r.banka, r.logo, 's') : '—'; } }, { ad: 'Muhatap', k: 'muhatap', ciz: function (r) { return r.muhatap || '—'; } }, { ad: 'Durum', k: 'durum' }, { ad: 'Vadeye', k: 'gun', ciz: function (r) { return gunMetin(r.gun); } }] }) }));
        return k;
      }
       
      function dmoTab() {
        var k = h('div'), dm = v.dmo_odeme, kt = eski.dmo();
        k.appendChild(kaynakSatir('DMO ödeme raporu', dm && dm.uretim));
        if (kt) k.appendChild(kt); else k.appendChild(gr.bos({ tur: 'bekle', baslik: 'DMO ödeme verisi yok', metin: 'Rapor henüz üretilmedi.' }));
        if (dm && dm.sirkete_kalan && dm.sirkete_kalan.length) {
          var gun = (dm.sirkete_kalan[0].degerler || []).map(function (x) { return x.t; });
          k.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Şirkete kalan DMO tutarları', alt: 'milyon ₺ · ödeme tarihine göre', govde: gr.tablo({ satirlar: dm.sirkete_kalan, bos: 'Kayıt yok.',
            kolonlar: [{ ad: 'Kalem', k: 'kalem' }].concat(gun.map(function (t, i) { return { ad: t, k: 'g' + i, sag: true, ciz: function (r) { var d = r.degerler[i]; return d && d.mn != null ? f1(d.mn) : '—'; } }; })) }) })]));
        }
        return k;
      }
       
      function teminatTab() {
        var k = h('div');
        if (!tm) { k.appendChild(gr.bos({ tur: 'bekle', baslik: 'Teminat verisi yok', metin: '' })); return k; }
        k.appendChild(kaynakSatir('Verilen teminatlar', tm.kaynak && tm.kaynak.tarih_itibariyle));
        var v60 = tm.vadesi_60_gun_icinde || {}, ib = tm.vadesi_gecmis_iade_bekleyen || {};
        k.appendChild(h('div', { sinif: 'kpi-izgara' }, [mini('Verilen teminat toplamı', mn(tm.toplam.tl), tm.toplam.adet + ' teminat'), mini('60 gün içinde vadesi dolan', v60.adet ? mn(v60.tl) : 'yok', v60.adet ? v60.adet + ' teminat' : '', v60.adet ? 'uyari' : null), mini('Vadesi geçmiş, iade bekleyen', ib.adet ? mn(ib.tl) : 'yok', ib.adet ? ib.adet + ' teminat' : '', ib.adet ? 'uyari' : null)]));
        var bt = (tm.banka_bazli || []).slice().sort(function (a, b) { return (b.tl || 0) - (a.tl || 0); }).map(function (b) { return { e: bankaAd(b.banka, b.logo, 's'), d: b.tl, renk: 'var(--s7)', etiketDeger: mn(b.tl) + ' · ' + b.adet }; });
        k.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Banka bazında teminat', alt: 'TL karşılığı · teminat adedi', govde: bt.length ? gr.yatay(bt) : gr.bos({ tur: 'bekle', baslik: 'Veri yok', metin: '' }) })]));
        var kol = [{ ad: 'Banka', k: 'banka', ciz: function (r) { return bankaAd(r.banka, r.logo, 's'); } }, { ad: 'Tür', k: 'tur', ciz: function (r) { return (r.tip || '') + (r.tur ? ' · ' + r.tur : ''); } }, { ad: 'Muhatap', k: 'muhatap', ciz: function (r) { return r.muhatap || '—'; } }, { ad: 'Tutar (TL)', k: 'tl', sag: true, ciz: function (r) { return tl(r.tl); } }, { ad: 'Vade', k: 'vade', ciz: function (r) { return r.vade ? trT(r.vade) : (r.suresiz ? 'süresiz' : '—'); } }, { ad: 'Vadeye', k: 'gun', ciz: function (r) { return gunMetin(r.gun); } }];
        if (v60.adet && v60.liste && v60.liste.length) k.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: '60 gün içinde vadesi dolanlar', alt: v60.adet + ' teminat', govde: gr.tablo({ satirlar: v60.liste, kolonlar: kol, sira: { k: 'gun', yon: 'yukari' } }) })]));
        k.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Verilen teminatlar (' + (tm.liste || []).length + ')', alt: 'Bankaların bizim adımıza verdiği teminat mektupları · vadesi geçmiş olanlar işaretli', govde: gr.tablo({ satirlar: tm.liste || [], kolonlar: kol, sira: { k: 'tl', yon: 'asagi' }, bos: 'Teminat yok.', satirSinif: function (r) { return r.gun != null && r.gun < 0 ? 'hz-gecmis' : ''; } }) })]));
         
        var al = tm.alinan, alKol = [{ ad: 'Tür', k: 'tur', ciz: function (r) { return r.tur || '—'; } }, { ad: 'Firma', k: 'firma', ciz: function (r) { return r.firma || '—'; } }, { ad: 'Tutar', k: 'tutar', sag: true, ciz: function (r) { return tut(r.tutar, r.pb); } }, { ad: 'Alınma', k: 'alinma', ciz: function (r) { return r.alinma ? trT(r.alinma) : '—'; } }, { ad: 'Vade', k: 'vade', ciz: function (r) { return r.vade ? trT(r.vade) : 'süresiz'; } }];
        k.appendChild(h('div', { sinif: 'ust-bosluk' }, [al && al.liste ? gr.kart({ baslik: 'Alınan teminatlar (' + al.liste.length + ')', alt: 'Müşteri ve firmalardan aldığımız teminatlar (iade edilenler hariç)', govde: gr.tablo({ satirlar: al.liste, kolonlar: alKol, sira: { k: 'tutar', yon: 'asagi' }, bos: 'Alınan teminat yok.' }) }) : gr.kart({ baslik: 'Alınan teminatlar', alt: '', govde: gr.bos({ tur: 'bekle', baslik: 'Alınan teminat verisi yok', metin: 'Kaynakta (ALINAN TEMİNAT sayfası) okunamadı.' }) })]));
         
        var bct = cek.banka_cek_teminat;
        if (bct && bct.liste && bct.liste.length) k.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Çek karşılığı ve çekle karşılanmayan tutar', alt: 'Banka düzeyi, kısmi', govde: gr.tablo({ satirlar: bct.liste, sira: { k: 'cekle_karsilanmayan_tl', yon: 'asagi' }, bos: 'Veri yok.', kolonlar: [{ ad: 'Banka', k: 'banka', ciz: function (r) { return bankaAd(r.banka, r.logo, 's'); } }, { ad: 'Çek karşılıklı kredi', k: 'kredi_cek_karsiligi_tl', sag: true, ciz: function (r) { return tl(r.kredi_cek_karsiligi_tl); } }, { ad: 'Bankaya verilen çek', k: 'cek_teminati_tl', sag: true, ciz: function (r) { return tl(r.cek_teminati_tl); } }, { ad: 'Çekle karşılanmayan', k: 'cekle_karsilanmayan_tl', sag: true, ciz: function (r) { return r.cekle_karsilanmayan_tl > 0 ? tl(r.cekle_karsilanmayan_tl) : '—'; } }] }) })]));
        return k;
      }
       
      function bankaTab() {
        var k = h('div'), M = {};
        function ent(ad) { var a = bnk(ad); return M[a] || (M[a] = { ad: a, bakiye: null, bloke: null, kredi: null, teminat: null, cek: null, kredi_adet: 0 }); }
        ((bb && bb.banka_bazli) || []).forEach(function (x) { var e = ent(x.banka); e.bakiye = e.bakiye || { tl: 0, usd: 0, eur: 0 }; e.bakiye.tl += x.tl_bakiye || 0; e.bakiye.usd += x.usd_bakiye || 0; e.bakiye.eur += x.eur_bakiye || 0; e.bloke = (e.bloke || 0) + (x.bloke_tl_karsiligi || 0); });
        (kr.banka_bazli || []).forEach(function (x) { var e = ent(x.banka); e.kredi = (e.kredi || 0) + (x.kalan_anapara_tl || 0); e.kredi_adet += x.adet || 0; });
        ((tm && tm.banka_bazli) || []).forEach(function (x) { var e = ent(x.banka); e.teminat = (e.teminat || 0) + (x.tl || 0); });
        ((cek.verilen && cek.verilen.banka_bazli) || []).forEach(function (x) { if (x.banka == null) return; var e = ent(x.banka); e.cek = (e.cek || 0) + (x.tl || 0); });
        var L = Object.keys(M).map(function (a) { return M[a]; }).sort(function (a, b) { return ((b.kredi || 0) + (b.teminat || 0)) - ((a.kredi || 0) + (a.teminat || 0)); });
        k.appendChild(kaynakSatir('Ödeme planı bakiye sayfası ve ' + NA.toLowerCase(), bb && bb.tarih_itibariyle));
        if (bb && bb.toplam) k.appendChild(h('div', { sinif: 'kpi-izgara' }, [mini('Bakiye TL', tl(bb.toplam.TL.bakiye), 'Bloke ' + tl(bb.toplam.TL.bloke)), mini('Bakiye USD', dvz(bb.toplam.USD.bakiye, 'USD'), 'Bloke ' + dvz(bb.toplam.USD.bloke, 'USD')), mini('Bakiye EUR', dvz(bb.toplam.EUR.bakiye, 'EUR'), 'Bloke ' + dvz(bb.toplam.EUR.bloke, 'EUR')), mini('Mevduat', bb.mevduat ? mn(bb.mevduat.toplam_tl) : '—', bb.mevduat ? 'Bloke ' + mn(bb.mevduat.bloke_tl) : 'veri yok')]));
        function satir(a, b, c) { return h('div', { sinif: 'hz-b-satir' }, [h('span', { metin: a }), h('b', { metin: b }), c ? h('small', { metin: c }) : null]); }
        var LM = {};
        ((v.banka_limit && Array.isArray(v.banka_limit.liste)) ? v.banka_limit.liste : []).forEach(function (x) { LM[nz(x.banka)] = x; if (x.gorunen_ad && !LM[nz(x.gorunen_ad)]) LM[nz(x.gorunen_ad)] = x; });
        function limitBlok(ad) {
          var x = LM[nz(ad)];
          if (!x || x.limit_tl == null) return h('p', { sinif: 'hz-limit kucuk soluk', metin: 'Limit kaynakta yok' });
          var neg = x.bos_tl != null && x.bos_tl < 0;
          return h('div', { sinif: 'hz-limit-blok' }, [
            satir('Limit', mn(x.limit_tl)), satir('Risk', mn(x.risk_tl)),
            h('div', { sinif: 'hz-b-satir hz-lim-bos' + (neg ? ' neg' : ''), style: neg ? 'color:var(--kritik)' : '' }, [h('span', { metin: neg ? 'Aşım' : 'Boş limit' }), h('b', { metin: x.bos_tl == null ? '—' : mn(Math.abs(x.bos_tl)) })])]);
        }
        var kartlar = gr.sayfali(L, function (e) {
          var ba = e.bakiye;
          return h('article', { sinif: 'hz-banka' }, [h('h4', null, [bankaAd(e.ad, null)]),
            satir('Bakiye', ba ? tl(ba.tl) : 'veri yok', ba ? '$ ' + Math.round(ba.usd).toLocaleString(LOC) + ' · € ' + Math.round(ba.eur).toLocaleString(LOC) : ''), satir('Bloke', e.bloke == null ? 'veri yok' : tl(e.bloke)),
            satir('Kredi kalan', e.kredi == null ? 'yok' : mn(e.kredi), e.kredi_adet ? e.kredi_adet + ' kredi' : ''), satir('Teminat', e.teminat == null ? 'yok' : mn(e.teminat)), satir('Verilen çek', e.cek == null ? 'yok' : mn(e.cek)),
            limitBlok(e.ad)]);
        }, { sinif: 'hz-banka-izgara', n: 12 });
        k.appendChild(h('div', { sinif: 'ust-bosluk' }, [kartlar]));
        return k;
      }
       
      function limitTab() {
        var k = h('div'), bl = v.banka_limit, L = bl && Array.isArray(bl.liste) ? bl.liste : [];
        if (!L.length) { k.appendChild(gr.bos({ tur: 'bekle', baslik: 'Limit verisi bekleniyor', metin: 'Banka limitleri finans ekibinden alındığında banka banka burada görünecek.' })); return k; }
        var kay = Array.isArray(bl.kaynak) ? bl.kaynak.join(', ') : (bl.kaynak || 'Banka limit listesi');
        k.appendChild(kaynakSatir(kay, bl.tarih));
        if (bl.uyari) k.appendChild(h('div', { sinif: 'bant sari', role: 'status', metin: typeof bl.uyari === 'string' ? bl.uyari : (bl.uyari.metin || bl.uyari.mesaj || '') }));
        if (bl.findeks_dogrulama && bl.findeks_dogrulama.tutuyor === false) k.appendChild(h('p', { sinif: 'hz-kaynak kucuk soluk', metin: 'Findeks blok toplamı özet toplamıyla tutmuyor; rakamlar kontrol edilmeli.' }));
        function topl(a) { var t = 0, var_ = false; L.forEach(function (x) { if (x[a] != null) { t += x[a]; var_ = true; } }); return var_ ? t : null; }
        var T = bl.toplam || {}, tLim = T.limit_tl != null ? T.limit_tl : topl('limit_tl'), tRisk = T.risk_tl != null ? T.risk_tl : topl('risk_tl'), tBos = T.bos_tl != null ? T.bos_tl : topl('bos_tl');
        var bayatSay = L.filter(function (x) { return x.bayat === true; }).length;
        k.appendChild(h('div', { sinif: 'kpi-izgara' }, [
          gr.kpi({ baslik: 'Toplam limit', deger: mn(tLim), birim: L.length + ' kurum · ' + (T.limitli_kurum_adedi != null ? T.limitli_kurum_adedi : L.filter(function (x) { return x.limit_tl != null; }).length) + ' limitli', ikon: 'liste', durum: tLim == null ? 'yok' : null }),
          gr.kpi({ baslik: 'Toplam risk (kullanılan)', deger: mn(tRisk), birim: tLim ? yuzde(100 * tRisk / tLim) + ' dolu' : '', ikon: 'cubuk', durum: tRisk == null ? 'yok' : null }),
          gr.kpi({ baslik: 'Toplam boş limit', deger: mn(tBos), birim: tBos != null && tBos < 0 ? 'aşım' : 'kullanılabilir', ikon: 'tik', durum: tBos == null ? 'yok' : (tBos < 0 ? 'kritik' : 'iyi') })]));
        if (bayatSay) k.appendChild(h('div', { sinif: 'bant sari ust-bosluk', role: 'status' }, [h('strong', { metin: 'Güncel olmayan limit var' }), ' — ' + bayatSay + ' bankanın limiti eski revizyondan; boş limit rakamı eski olabilir.']));
        var S = L.slice().sort(function (a, b) { return (b.bos_tl == null ? -Infinity : b.bos_tl) - (a.bos_tl == null ? -Infinity : a.bos_tl); });
        var cub = S.filter(function (x) { return x.bos_tl != null; }).map(function (x) { var neg = x.bos_tl < 0; return { e: bankaAd(x.banka, x.logo, 's'), d: Math.abs(x.bos_tl), renk: neg ? 'var(--kritik)' : 'var(--s1)', etiketDeger: neg ? 'aşım ' + mn(Math.abs(x.bos_tl)) : mn(x.bos_tl), ipucu: [x.banka + ': ' + (neg ? 'aşım ' + mn(Math.abs(x.bos_tl)) : 'boş ' + mn(x.bos_tl)), 'Limit ' + mn(x.limit_tl) + ' · risk ' + mn(x.risk_tl)] }; });
        var neg0 = S.some(function (x) { return x.bos_tl != null && x.bos_tl < 0; });
        k.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Boş limit sıralaması', alt: 'Bankalar boş limite göre · TL karşılığı', govde: cub.length ? h('div', null, [gr.yatay(cub)].concat(neg0 ? [gr.lejant([['Boş limit', 'var(--s1)'], ['Aşım (limit üstü risk)', 'var(--kritik)']])] : [])) : gr.bos({ tur: 'bekle', baslik: 'Boş limit hesaplanamadı', metin: 'Kaynakta risk/limit alanı yok.' }) })]));
        function ls(a, b, c) { return h('div', { sinif: 'hz-b-satir' }, [h('span', { metin: a }), h('b', { metin: b }), c ? h('small', { metin: c }) : null]); }
        function ikili(o) { return o ? mn(o.risk_tl) + ' / ' + mn(o.limit_tl) : '—'; }
        var kartlar = gr.sayfali(S, function (x) {
          var neg = x.bos_tl != null && x.bos_tl < 0, oran = x.limit_tl > 0 && x.risk_tl != null ? 100 * x.risk_tl / x.limit_tl : null;
          var renk = oran == null ? 'var(--gri)' : (oran > 100 ? 'var(--kritik)' : (oran >= 85 ? 'var(--uyari)' : 'var(--s1)'));
          var bar = h('div', { sinif: 'hz-lim-bar', role: 'img', 'aria-label': oran == null ? 'Doluluk bilinmiyor' : 'Doluluk ' + pc(Math.round(oran)) }, [h('i', { style: 'width:' + (oran == null ? 0 : Math.max(0, Math.min(100, oran))) + '%;background:' + renk })]);
          return h('article', { sinif: 'hz-banka hz-lim' + (neg ? ' asim' : '') }, [
            h('div', { sinif: 'hz-lim-ust' }, [bankaLogo(x.banka, x.logo), h('h4', { metin: x.gorunen_ad || x.banka }), x.bayat === true ? h('span', { sinif: 'hz-bayat', metin: x.revize_vadesi && x.revize_vadesi < new Date().toISOString().slice(0, 10) ? 'Limit revize vadesi geçmiş — güncel değil' : '2025 revize — güncel değil' }) : null]),
            h('div', { sinif: 'hz-lim-bos' + (neg ? ' neg' : '') }, [h('small', { metin: neg ? 'Aşım' : 'Boş limit' }), h('b', { metin: x.bos_tl == null ? '—' : mn(Math.abs(x.bos_tl)) })]),
            bar, h('div', { sinif: 'hz-lim-yuzde kucuk soluk', metin: oran == null ? 'Doluluk bilinmiyor' : 'Doluluk ' + pc(Math.round(oran).toLocaleString(LOC)) + ' · risk ' + mn(x.risk_tl) + ' / limit ' + mn(x.limit_tl) }),
            ls('Nakdi (risk / limit)', ikili(x.nakdi)), ls('Gayrinakdi (risk / limit)', ikili(x.gayrinakdi)),
            ls('Bizim kredi', mn(x.bizim_kredi_tl), x.kredi_usd > 0 ? '$ ' + Math.round(x.kredi_usd).toLocaleString(LOC) + (x.kredi_tl_pb > 0 ? ' + ' + mn(x.kredi_tl_pb) : '') : ''), ls('Teminat mektubu', mn(x.bizim_teminat_tl)), ls('Çek karşılığı', mn(x.cek_karsiligi_tl)),
            h('p', { sinif: 'hz-limit kucuk soluk', metin: [x.limit_kaynak ? 'Limit kaynağı: ' + x.limit_kaynak : '', x.revize_vadesi ? 'Revize vadesi ' + trT(x.revize_vadesi) : '', x.not || ''].filter(Boolean).join(' · ') || 'Limit kaynağı belirtilmemiş' })]);
        }, { sinif: 'hz-banka-izgara', n: 12 });
        k.appendChild(h('div', { sinif: 'ust-bosluk' }, [kartlar]));
        return k;
      }
       
      function dovizTab() {
        var k = h('div');
        if (!dp) { k.appendChild(gr.bos({ tur: 'bekle', baslik: 'Döviz pozisyonu verisi yok', metin: '' })); return k; }
        k.appendChild(kaynakSatir('Açık kalemler ve ' + NA.toLowerCase(), dp.kaynak && dp.kaynak.tarih_itibariyle));
        var kurS = kurSatiri(); if (kurS) k.appendChild(kurS);
        var AD = { banka_bakiye: 'Banka bakiyesi', mevduat: 'Mevduat', doviz_alacak: 'Döviz alacak', alinan_cek: 'Alınan çek', doviz_kredi_anapara: 'Döviz kredi anaparası', verilen_cek: 'Verilen çek', doviz_borc: 'Döviz borç' };
        var kartlar = ['usd', 'eur'].map(function (p) {
          var x = dp[p]; if (!x) return null; var PB = x.pb;
          var bar = gr.yatay([{ e: 'Varlık', d: Math.abs(x.varlik.toplam), renk: 'var(--s3)', etiketDeger: dvz(x.varlik.toplam, PB) }, { e: 'Yükümlülük', d: Math.abs(x.yukumluluk.toplam), renk: 'var(--s2)', etiketDeger: dvz(x.yukumluluk.toplam, PB) }, { e: 'Net', d: Math.abs(x.net), renk: x.net < 0 ? 'var(--kritik)' : 'var(--iyi)', etiketDeger: dvz(x.net, PB) }]);
          var sat = []; Object.keys(x.varlik).forEach(function (a) { if (a !== 'toplam' && !(a === 'doviz_alacak' && x.varlik[a] < 0)) sat.push({ kalem: 'Varlık · ' + (AD[a] || a), tutar: x.varlik[a] }); });   
          return gr.kart({ baslik: PB + ' pozisyonu', alt: 'Kur ' + String(x.kur).replace('.', ',') + ' · net TL karşılığı ' + mn(x.net_tl_karsiligi), govde: h('div', null, [bar, gr.tablo({ satirlar: sat, bos: 'Kalem yok.', sayfa: 20, kolonlar: [{ ad: 'Kalem', k: 'kalem' }, { ad: 'Tutar (' + PB + ')', k: 'tutar', sag: true, ciz: function (r) { return r.tutar == null ? 'veri yok' : dvz(r.tutar, PB); } }] })]) });
        }).filter(Boolean);
        k.appendChild(h('div', { sinif: 'iki-kolon' }, kartlar));
        return k;
      }
      return kok;
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('finans', 'finans').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  };

  



  MM.moduller.toplanti = function (kok) {
    var KONULAR = ['Genel', 'Satış', 'Üretim ve fabrika', 'DMO ve ihale', 'Tedarik ve ithalat', 'Finans', 'Kalite', 'Nakliye', 'App geliştirme'];
    var SURELER = [15, 30, 45, 60, 90];
    var z2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var simdi = new Date(), ilk = new Date(simdi.getTime() + 30 * 60000);
    ilk.setMinutes(ilk.getMinutes() < 30 ? 30 : 60, 0, 0);
    var saatler = []; for (var s = 8; s <= 19; s++) { saatler.push(z2(s) + ':00'); if (s < 19) saatler.push(z2(s) + ':30'); }
    var ilkSaat = z2(ilk.getHours()) + ':' + z2(ilk.getMinutes()); if (saatler.indexOf(ilkSaat) < 0) ilkSaat = '09:00';
    var ilkGun = ilk.getFullYear() + '-' + z2(ilk.getMonth() + 1) + '-' + z2(ilk.getDate());
    function secim(ad, liste, deger) {
      var sel = h('select', { 'aria-label': ad });
      liste.forEach(function (x) { var o = h('option', { value: String(x[0]), metin: x[1] }); if (String(x[0]) === String(deger)) o.selected = true; sel.appendChild(o); });
      return sel;
    }
    var konuS = secim('Konu', KONULAR.map(function (k) { return [k, k]; }), 'Genel');
    var gunI = h('input', { type: 'date', 'aria-label': 'Tarih', value: ilkGun, min: simdi.getFullYear() + '-' + z2(simdi.getMonth() + 1) + '-' + z2(simdi.getDate()) });
    var saatS = secim('Saat', saatler.map(function (x) { return [x, x]; }), ilkSaat);
    var sureS = secim('Süre', SURELER.map(function (x) { return [x, x + ' dk']; }), 30);
    var dugme = h('a', { sinif: 'dugme tam', role: 'button' }, [gr.ikon('gonder', 18), h('span', { metin: 'Toplantı isteğini hazırla' })]);
    var durum = h('p', { sinif: 'soluk', role: 'status', 'aria-live': 'polite' });
    function trTarih(iso) { var p = String(iso || '').split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : ''; }
    function guncelle() {
      var p = window.MM.talimatPosta || '', t = trTarih(gunI.value);
      if (!p || !t) { dugme.removeAttribute('href'); dugme.setAttribute('aria-disabled', 'true'); dugme.classList.add('pasif'); durum.textContent = !p ? 'Toplantı isteği hazırlanamıyor; biraz sonra yeniden deneyin.' : 'Tarih seçin.'; return; }
      var konu = '[Toplantı] ' + konuS.value + ' · ' + t + ' ' + saatS.value + ' · ' + sureS.value + ' dk';
      var govde = 'Merhaba,\n\nAşağıdaki toplantı için Google Meet daveti oluşturulmasını rica ederim.\n\n' +
        'Konu: ' + konuS.value + '\nTarih: ' + t + '\nSaat: ' + saatS.value + '\nSüre: ' + sureS.value + ' dk\n' +
        'Katılımcılar: bu mailin CC satırındaki kişiler\nGündem: \n\n(MY Medikal App · Toplantı)';
      dugme.setAttribute('href', 'mailto:' + p + '?subject=' + encodeURIComponent(konu) + '&body=' + encodeURIComponent(govde));
      dugme.removeAttribute('aria-disabled'); dugme.classList.remove('pasif'); durum.textContent = '';
    }
    [konuS, gunI, saatS, sureS].forEach(function (el) { el.addEventListener('change', guncelle); el.addEventListener('input', guncelle); });
    function alan(ad, el) { return h('label', { sinif: 'alan' }, [h('span', { metin: ad }), el]); }
    kok.appendChild(gr.sayfaBasi({ baslik: 'Mumu Meet', alt: 'Mumu Meet ile toplantı', kirinti: [['Mumu Meet']] }));
     
    

    var meetDugme = h('a', { sinif: 'dugme ikincil', role: 'button', href: 'meet/' }, [h('span', { metin: 'Lobiyi aç' })]);
    var meetAlan = h('div', null, [meetDugme]);
    var meetCerceve = null;
    function meetKabuk() { var M = MM.mesaj; return (M && M.kabukMu && M.kabukMu()) ? M : null; }
    function meetIcKapat() { if (meetCerceve) { try { meetCerceve.parentNode.removeChild(meetCerceve); } catch (e0) {   } meetCerceve = null; } meetDugme.style.display = ''; }
    function meetIcAc() {
      if (meetCerceve) return;
      meetDugme.style.display = 'none';
      meetCerceve = h('iframe', { title: 'Mumu Meet', src: 'meet/index.html', allow: 'camera; microphone; autoplay; display-capture' });
      meetCerceve.setAttribute('style', 'width:100%;height:calc(100vh - 230px);height:calc(100dvh - 230px);min-height:460px;border:0;border-radius:12px;background:#0b1424');
      meetAlan.appendChild(meetCerceve);
    }
    function meetIletiDinle(e) {
      if (e.origin !== location.origin || !meetCerceve || e.source !== meetCerceve.contentWindow) return;
      if (e.data && e.data.tur === 'meet-kapat') meetIcKapat();
    }
    window.addEventListener('message', meetIletiDinle);
    meetDugme.addEventListener('click', function (e) {   
      e.preventDefault();
      var M = meetKabuk();
      if (M) { if (M.meetCerceveAc) M.meetCerceveAc('meet/'); else M.disAc(M.meetTamAdres('meet/')); }
      else meetIcAc();
    });
    kok.appendChild(gr.kart({ baslik: 'Mumu Meet', govde: meetAlan }));
    setTimeout(function () { if (!kok.isConnected) return; var M = meetKabuk(); if (M) { if (M.meetCerceveAc) M.meetCerceveAc('meet/'); else meetIcAc(); } else meetIcAc(); }, 0);   
    var form = h('div', { sinif: 'yeni-izgara' }, [alan('Konu', konuS), alan('Tarih', gunI), alan('Saat', saatS), alan('Süre', sureS)]);
    var yedek = h('details', { sinif: 'ust-bosluk' }, [h('summary', { metin: 'Dış katılımcılı toplantı (Google Meet)' })]);   
    kok.appendChild(yedek);
    yedek.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Yedek yol (Yapay zekâ dinleyici gelene kadar)', govde: h('div', null, [form, h('div', { sinif: 'ust-bosluk' }, [dugme]), durum]) })]));
    yedek.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Nasıl çalışır?', govde: h('ol', { sinif: 'ozellik-liste' }, [
      h('li', { metin: 'Formu doldurup “Toplantı isteğini hazırla”ya dokunun; posta programınızda hazır bir mail açılır.' }),
      h('li', { metin: 'Katılacak kişileri mailin CC satırına ekleyin, gündemi yazın ve gönderin.' }),
      h('li', { metin: 'Google Meet daveti ve bağlantısı sizin ve katılımcıların e-postasına gelir; toplantı saatinde bağlantıyı açın.' }),
      h('li', { metin: 'Toplantılar bilgisayardan da, telefondan da yapılabilir.' })
    ]) })]));
    if (MM.acik && MM.acik('mesaj')) {
      kok.appendChild(h('div', { sinif: 'ust-bosluk' }, [gr.kart({ baslik: 'Hemen görüşme', govde: h('div', null, [
        h('p', { sinif: 'soluk', metin: 'Kısa bir görüşme için Mumu Talk bölümünü kullanabilirsiniz.' }),
        h('a', { sinif: 'dugme ikincil', href: '#mesaj' }, [h('span', { metin: 'Mumu Talk’a git' })])]) })]));
    }
    guncelle();
    var bekle = window.MM.acikHazir && window.MM.acikHazir.then ? window.MM.acikHazir.then(guncelle, guncelle) : null;
    var t = setTimeout(guncelle, 4000);
    return function () { clearTimeout(t); bekle = null; window.removeEventListener('message', meetIletiDinle); meetIcKapat(); };
  };
})();
