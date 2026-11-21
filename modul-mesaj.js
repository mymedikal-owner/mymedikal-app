



(function () {
  'use strict';
  var BILGI = 'Bu sohbetler şirketin Microsoft bulut hesabında (Avrupa Birliği içinde) 12 ay saklanır. Uçtan uca şifreli değildir; şirket yönetimi gerektiğinde erişebilir. Aramalar kaydedilmez. Şifre, kimlik numarası, sağlık bilgisi yazmayınız. Buraya yazılan \'onay\' ya da \'gönder\' hiçbir işlemi başlatmaz.';
  var KABUL = 'image/jpeg,image/png,image/heic,application/pdf,.xlsx,.docx,audio/mp4,audio/webm,audio/aac';

  function kisileriSuz(v) {
    var l = (v && v.kisiler) || (Array.isArray(v) ? v : []);
    return l.filter(function (k) { return k && k.oid && k.ad; }).map(function (k) { return { oid: String(k.oid), ad: String(k.ad) }; });   
  }
   
  function paylasMetni(rota, bolumAd) {
    var r = String(rota || '').replace(/^#\/?/, '');
    var bolum = r.split(/[\/?&]/)[0];
    if (!bolum || !/^[A-Za-z0-9_-]{1,60}$/.test(bolum)) return null;
    var rt = bolum.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);   
    if (!rt) return null;
    var ad = String(bolumAd || bolum).replace(/[^A-Za-z0-9ÇĞİÖŞÜçğıöşü _-]/g, '').trim().slice(0, 40) || rt;   
    return { bolum: bolum, rota: '#' + rt, kart: { bolum: ad, rota: '#' + rt }, yalnizBolum: true };
  }
  var MM = (typeof window !== 'undefined' && window.MM) || null;
  var API = { kisileriSuz: kisileriSuz, paylasMetni: paylasMetni, BILGI: BILGI };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (!MM) return;

  var h = MM.h, T = function (k) { return MM.t ? MM.t(k) : k; };
  var bekleyenKart = null, ist = null, bilgiOk = false;
  function ayar() { return (window.MM_AYAR && window.MM_AYAR.mesaj) || {}; }
  function istemci() {
    if (ist) return ist;
    var IS = window.MMMesajIstemci;
    if (!IS) return null;
    var a = ayar();
    var cfg = { apiUrl: a.url || '', belirtecAl: function () { return MM.mesaj.belirtecAl ? MM.mesaj.belirtecAl([a.apiKapsam]) : Promise.reject(new Error('belirtec')); } };
    ist = (MM.mesaj.istemciKur || IS.hazirla)(cfg);
    return ist;
  }
  function acik() { var i = istemci(); return !!(i && i.acik()); }
  function ben() { return (MM.mesaj.hesap && MM.mesaj.hesap()) || {}; }
  MM.mesaj = Object.assign(MM.mesaj || {}, API, {
    paylas: function (rota, bolumAd) {
      var p = paylasMetni(rota || location.hash, bolumAd);   
      if (!p) return p;
      if (acik()) { bekleyenKart = p; location.hash = '#mesaj'; }   
      return p;
    },
    cikis: function () { var i = ist; if (i && i.acik()) { i.kapat(); return i.cihazSil().then(null, function () { return false; }); } return Promise.resolve(false); }
  });

  var HATA = { kapali: 'Mesaj kapalı', belirtec: 'Mesaj girişi alınamadı', kimlik: 'Giriş geçersiz', uye: 'Bu sohbete erişiminiz yok', yok: 'Bulunamadı', gecersiz: 'Geçersiz istek', '429': 'Çok sık istek; biraz sonra deneyin', ag: 'Bağlantı yok', sunucu: 'Sunucu hatası', bos: 'Mesaj boş', uzun: 'Mesaj çok uzun', tur: 'Bu dosya türü gönderilemez', boyut: 'Dosya 25 MB\'tan büyük olamaz', foto: 'Fotoğraf işlenemedi', yukleme: 'Dosya yüklenemedi', ad: 'Grup adı yazın', 'arama-yok': 'Arama bu cihazda yok', arama: 'Arama başlatılamadı' };
  function hataYaz(e) { return T(HATA[e && e.kod] || 'Alınamadı'); }
  function zamanYaz(ts) { var d = new Date(ts); return isNaN(d) ? '' : d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }); }
  function sirala(l) { return l.slice().sort(function (a, b) { return a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0; }); }

  MM.moduller.mesaj = function (kok) {
    var canli = true, i = istemci();
    var kap = h('div', { sinif: 'ms-kok' });
    kok.appendChild(kap);
    if (!i || !i.acik()) {
      kap.appendChild(h('p', { sinif: 'veri-yok', metin: T('Mesaj kapalı') }));
      return function () { canli = false; };
    }
    var benOid = ben().oid || '';
    var sohbetler = [], kisiler = null, secili = null, bantlar = [], cozucu = [];
    var durum = h('p', { sinif: 'ms-durum kucuk soluk', metin: '' });
    function yaz(m) { if (canli) durum.textContent = m || ''; }
    function bilgiSatir() { return h('p', { sinif: 'ms-bilgi kucuk soluk', metin: BILGI }); }
    function temizle() { if (!canli) return; kap.textContent = ''; cozucu.forEach(function (f) { f(); }); cozucu = []; }

     
    function bantEl() {
      var b = h('div', { sinif: 'ms-bant-kok' });
      bantlar.forEach(function (x) {
        var d = h('button', { sinif: 'ms-bant', type: 'button', metin: x.ad + ' ' + T('sizi arıyor') + (x.video ? ' (' + T('görüntülü') + ')' : '') + ' — ' + T('Katıl') });
        d.addEventListener('click', function () {
          bantlar = bantlar.filter(function (y) { return y !== x; });
          yaz(T('Aranıyor'));
          i.aramayaKatil(x.sohbet, x.groupId).then(function (bl) { return window.MMMesajArama.baslat(bl, { video: x.video }); }).then(function () { yaz(T('Arama sürüyor')); }, function (e) { yaz(hataYaz(e)); });
          var s = sohbetler.filter(function (c) { return c.id === x.sohbet; })[0]; if (!secili && s) sohbetGoster(s); else if (!secili) listeGoster();
        });
        b.appendChild(d);
      });
      return b;
    }
    var abonelik = [];
    abonelik.push(i.on('arama', function (ev) {
      if (!canli) return;
      var s = sohbetler.filter(function (c) { return c.id === ev.sohbet; })[0];
      if (!ev.groupId) return;
      bantlar.push({ sohbet: ev.sohbet, groupId: ev.groupId, video: ev.video, ad: s ? sohbetAdi(s) : (ev.arayan || T('Sohbet')) });
      if (secili) return; listeGoster();
    }));

     
    function kisiAdi(oid) { var k = (kisiler || []).filter(function (x) { return x.oid === oid; })[0]; return k ? k.ad : ''; }
    function sohbetAdi(s) {
      if (s.ad) return s.ad;
      var adlar = s.uyeler.filter(function (o) { return o !== benOid; }).map(function (o) { var k = (kisiler || []).filter(function (x) { return x.oid === o; })[0]; return k ? k.ad : ''; }).filter(Boolean);
      return adlar.join(', ') || T('Sohbet');
    }
    function listeGoster() {
      if (!canli) return; secili = null; temizle();
      kap.appendChild(bantEl());
      if (!bilgiOk) {   
        var kutu = h('div', { sinif: 'ms-ilk' }, [h('p', { metin: BILGI })]);
        var tmm = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Anladım') });
        tmm.addEventListener('click', function () { bilgiOk = true; listeGoster(); });
        kutu.appendChild(tmm); kap.appendChild(kutu);
      }
      var asistan = h('button', { sinif: 'ms-sohbet ms-asistan', type: 'button', metin: T('Asistan') });
      asistan.addEventListener('click', function () { location.hash = '#asistan'; });   
      var yeni = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Yeni sohbet') });
      yeni.addEventListener('click', yeniGoster);
      var yen = h('button', { sinif: 'ms-yenile', type: 'button', metin: T('Yenile') });
      yen.addEventListener('click', listeYukle);
      kap.appendChild(h('div', { sinif: 'ms-ust' }, [yeni, yen]));
      kap.appendChild(durum);
      var kut = h('div', { sinif: 'ms-sohbetler' }, [asistan]);
      sohbetler.forEach(function (s) {
        var ust = h('span', { sinif: 'ms-sad', metin: sohbetAdi(s) });
        var alt = h('span', { sinif: 'ms-ozet kucuk soluk', metin: s.son ? (s.son.gonderen ? (kisiAdi(s.son.gonderen) || T('Biri')) + ': ' : '') + s.son.ozet : '' });
        var ic = [h('span', { sinif: 'ms-sol' }, [ust, alt])];
        if (s.okunmamis > 0) ic.push(h('span', { sinif: 'ms-rozet', metin: String(s.okunmamis) }));
        var b = h('button', { sinif: 'ms-sohbet', type: 'button' }, ic);
        b.addEventListener('click', function () { sohbetGoster(s); });
        kut.appendChild(b);
      });
      if (!sohbetler.length) kut.appendChild(h('p', { sinif: 'veri-yok', metin: T('Sohbet yok') }));
      kap.appendChild(kut);
      kap.appendChild(bilgiSatir());
    }
    function listeYukle() {
      yaz(T('Yükleniyor'));
      return Promise.all([i.sohbetleriListele(), kisiler ? kisiler : i.kisiler()]).then(function (r) {
        if (!canli) return; kisiler = r[1]; sohbetler = r[0]; yaz(''); if (!secili) listeGoster();
      }, function (e) { yaz(hataYaz(e)); });
    }

     
    function yeniGoster() {
      if (!canli) return; secili = null; temizle();
      var seciliOid = {}, arama = '';
      var geri = h('button', { sinif: 'ms-geri', type: 'button', metin: T('Geri') });
      geri.addEventListener('click', listeGoster);
      var ara = h('input', { sinif: 'ms-ara', type: 'search', placeholder: T('Kişi ara'), 'aria-label': T('Kişi ara') });
      var grupAd = h('input', { sinif: 'ms-ara', type: 'text', placeholder: T('Grup adı'), 'aria-label': T('Grup adı'), maxlength: 80 });
      var liste = h('div', { sinif: 'ms-liste' });
      var basla = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Başlat') });
      function sec() { return Object.keys(seciliOid).filter(function (k) { return seciliOid[k]; }); }
      function cizListe() {
        liste.textContent = '';
        var q = arama.toLocaleLowerCase('tr');
        var g = (kisiler || []).filter(function (k) { return k.oid !== benOid && (!q || k.ad.toLocaleLowerCase('tr').indexOf(q) >= 0); });
        if (!g.length) liste.appendChild(h('p', { sinif: 'veri-yok', metin: T('Kişi bulunamadı') }));
        g.forEach(function (k) {
          var cb = h('input', { type: 'checkbox', 'aria-label': k.ad }); cb.checked = !!seciliOid[k.oid];
          cb.addEventListener('change', function () { seciliOid[k.oid] = cb.checked; grupAd.hidden = sec().length < 2; });
          liste.appendChild(h('label', { sinif: 'ms-kisi' }, [cb, h('span', { metin: k.ad })]));
        });
      }
      ara.addEventListener('input', function () { arama = ara.value; cizListe(); });
      grupAd.hidden = true;
      basla.addEventListener('click', function () {
        var l = sec(); if (!l.length) { yaz(T('Kişi seçin')); return; }
        i.sohbetAc(l, grupAd.value).then(function (s) { if (!canli || !s) return; sohbetler = [s].concat(sohbetler.filter(function (c) { return c.id !== s.id; })); sohbetGoster(s); }, function (e) { yaz(hataYaz(e)); });
      });
      kap.appendChild(h('div', { sinif: 'ms-ust' }, [geri]));
      kap.appendChild(ara); kap.appendChild(liste); kap.appendChild(grupAd); kap.appendChild(basla); kap.appendChild(durum); kap.appendChild(bilgiSatir());
      cizListe();
      if (!kisiler) i.kisiler().then(function (k) { kisiler = k; if (canli) cizListe(); }, function (e) { yaz(hataYaz(e)); });
    }

     
    function sohbetGoster(s) {
      if (!canli) return; secili = s; temizle(); s.okunmamis = 0;
      var mesajlar = [], okuyan = {}, yaziyorZmn = null, uyeAd = function (oid) { var k = (kisiler || []).filter(function (x) { return x.oid === oid; })[0]; return k ? k.ad : ''; };
      var geri = h('button', { sinif: 'ms-geri', type: 'button', metin: T('Geri') });
      geri.addEventListener('click', function () { listeGoster(); });
      var sesli = h('button', { sinif: 'ms-yenile', type: 'button', metin: T('Sesli ara'), 'aria-label': T('Sesli ara') });
      var goruntulu = h('button', { sinif: 'ms-yenile', type: 'button', metin: T('Görüntülü ara'), 'aria-label': T('Görüntülü ara') });
      function ara(video) {
        yaz(T('Aranıyor'));
        i.aramaBaslat(s.id, video).then(function (b) { return window.MMMesajArama.baslat(b, { video: video }); }).then(function () { yaz(T('Arama sürüyor')); }, function (e) { yaz(hataYaz(e)); });
      }
      sesli.addEventListener('click', function () { ara(false); });
      goruntulu.addEventListener('click', function () { ara(true); });
      kap.appendChild(h('div', { sinif: 'ms-ust' }, [geri, h('strong', { sinif: 'ms-baslik', metin: sohbetAdi(s) }), sesli, goruntulu]));
      kap.appendChild(bantEl());
      var msj = h('div', { sinif: 'ms-mesajlar' }); kap.appendChild(msj);
      var yazan = h('p', { sinif: 'ms-yaziyor kucuk soluk', metin: '' }); kap.appendChild(yazan);
      var kutu = h('textarea', { sinif: 'ms-yaz', rows: 2, 'aria-label': T('Mesaj'), maxlength: 4000 });
      var gon = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Gönder') });
      var dosya = h('input', { type: 'file', accept: KABUL, hidden: true });
      var ek = h('button', { sinif: 'ms-yenile', type: 'button', metin: T('Dosya / fotoğraf'), 'aria-label': T('Dosya / fotoğraf') });
      ek.addEventListener('click', function () { dosya.click(); });
      var alt = [kutu, ek, gon, dosya];
      if (bekleyenKart) {
        var kb = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Kartı gönder') + ': ' + bekleyenKart.kart.bolum });
        kb.addEventListener('click', function () {
          var k = bekleyenKart; if (!k) return;
          i.kartGonder(s.id, k.kart).then(function (m) { bekleyenKart = null; kb.disabled = true; if (m) ekle(m); }, function (e) { yaz(hataYaz(e)); });
        });
        alt.unshift(kb);
      }
      kap.appendChild(h('div', { sinif: 'ms-alt' }, alt));
      kap.appendChild(durum); kap.appendChild(bilgiSatir());

      function okunduMu(idx) {   
        return Object.keys(okuyan).some(function (o) { if (o === benOid) return false; var j = -1; mesajlar.forEach(function (m, n) { if (m.id === okuyan[o]) j = n; }); return j >= idx; });
      }
      function govdeEl(m) {
        if (m.tur === 'kart' && m.kart) {   
          var d = h('button', { sinif: 'ms-kart', type: 'button', metin: m.kart.bolum });
          d.addEventListener('click', function () { location.hash = m.kart.rota; });
          return d;
        }
        if ((m.tur === 'dosya' || m.tur === 'ses') && m.dosya) {
          var f = h('button', { sinif: 'ms-kart', type: 'button', metin: (m.tur === 'ses' ? T('Sesli mesaj') + ': ' : '') + m.dosya.ad });
          f.addEventListener('click', function () {
            i.dosyaIndir(s.id, m.dosya.blob).then(function (u) { window.open(u, '_blank', 'noopener'); }, function (e) { yaz(hataYaz(e)); });
          });
          return f;
        }
        var p = h('p', { sinif: 'ms-metin' });
        window.MMMesajIstemci.parcala(m.metin).forEach(function (x) {
          p.appendChild(x.t === 'baglanti' ? h('a', { sinif: 'ms-link', href: x.v, target: '_blank', rel: 'noopener noreferrer', metin: x.v }) : document.createTextNode(x.v));
        });
        return p;
      }
      function ciz() {
        if (!canli || secili !== s) return; msj.textContent = '';
        if (!mesajlar.length) msj.appendChild(h('p', { sinif: 'veri-yok', metin: T('Mesaj yok') }));
        mesajlar.forEach(function (m, n) {
          var benim = benOid && m.gonderen === benOid;
          var ust = [h('span', { sinif: 'ms-gon kucuk soluk', metin: benim ? T('Siz') : (uyeAd(m.gonderen) || '') }), h('span', { sinif: 'ms-zmn kucuk soluk', metin: zamanYaz(m.ts) })];
          var ic = [h('div', { sinif: 'ms-mu' }, ust), govdeEl(m)];
          if (benim) ic.push(h('span', { sinif: 'ms-tik kucuk soluk', metin: okunduMu(n) ? '✓✓ ' + T('Okundu') : '✓ ' + T('Gönderildi') }));
          msj.appendChild(h('div', { sinif: 'ms-m' + (benim ? ' ms-ben' : '') }, ic));
        });
        msj.scrollTop = msj.scrollHeight;
      }
      function sonOkundu() { var son = mesajlar[mesajlar.length - 1]; if (son && son.gonderen !== benOid) i.okundu(s.id, son.id).then(null, function () {   }); }
      function ekle(m) { if (mesajlar.some(function (x) { return x.id === m.id; })) return; mesajlar.push(m); mesajlar = sirala(mesajlar); ciz(); sonOkundu(); }
      function yukle() {
        yaz(T('Yükleniyor'));
        i.mesajlar(s.id, { adet: 30 }).then(function (l) { yaz(''); if (!canli || secili !== s) return; mesajlar = sirala(l); ciz(); sonOkundu(); }, function (e) { yaz(hataYaz(e)); });
      }
       
      cozucu.push(i.on('mesaj', function (m) {
        if (m.sohbet === s.id) ekle(m);
      }));
      cozucu.push(i.on('okundu', function (ev) { if (ev.sohbet === s.id) { okuyan[ev.oid] = ev.sonId; ciz(); } }));
      cozucu.push(i.on('yaziyor', function (ev) {
        if (ev.sohbet !== s.id || ev.oid === benOid) return;
        yazan.textContent = (uyeAd(ev.oid) || T('Biri')) + ' ' + T('yazıyor…');
        clearTimeout(yaziyorZmn); yaziyorZmn = setTimeout(function () { if (canli) yazan.textContent = ''; }, 4000);
      }));
      cozucu.push(function () { clearTimeout(yaziyorZmn); });
      kutu.addEventListener('input', function () { i.yaziyor(s.id).then(null, function () {   }); });
      gon.addEventListener('click', function () {
        i.metinGonder(s.id, kutu.value).then(function (m) { kutu.value = ''; if (m) ekle(m); }, function (e) { yaz(hataYaz(e)); });
      });
      dosya.addEventListener('change', function () {
        var f = dosya.files && dosya.files[0]; dosya.value = ''; if (!f) return;
        yaz(T('Yükleniyor'));
        var foto = /^image\//.test(f.type);
        Promise.resolve(foto ? i.fotografTemizle({ ad: f.name, boyut: f.size, mime: f.type, veri: f }) : { ad: f.name, boyut: f.size, mime: f.type, veri: f })
          .then(function (d) { return i.dosyaYukle(s.id, d); })
          .then(function (m) { yaz(''); if (m) ekle(m); }, function (e) { yaz(hataYaz(e)); });
      });
      yukle();
    }

     
    abonelik.push(i.on('mesaj', function (m) {
      if (!canli || (secili && secili.id === m.sohbet)) return;
      var s = sohbetler.filter(function (c) { return c.id === m.sohbet; })[0];
      if (!s) { listeYukle(); return; }
      s.okunmamis = (s.okunmamis || 0) + 1; s.son = { ts: m.ts, gonderen: m.gonderen, ozet: m.tur === 'metin' ? m.metin.slice(0, 60) : T(m.tur === 'kart' ? 'Paylaşılan kart' : m.tur === 'ses' ? 'Sesli mesaj' : 'Dosya') };
      sohbetler = [s].concat(sohbetler.filter(function (c) { return c !== s; }));
      if (!secili) listeGoster();
    }));

    listeGoster();
    i.baglan().then(null, function (e) { yaz(hataYaz(e)); });   
    listeYukle();
    return function () { canli = false; cozucu.forEach(function (f) { f(); }); abonelik.forEach(function (f) { f(); }); i.kapat(); };
  };
})();
