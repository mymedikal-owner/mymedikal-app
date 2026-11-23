


(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var taklit = /[?&]taklit=1(&|$)/.test(location.search);
  var sag = null, sohbetId = '', ad = 'Katılımcı', meşgul = false;
  var kartlar = new Map();   

  var HATA = {
    belirtec: 'Oturum alınamadı. Uygulamaya giriş yapıp bu sayfayı yenileyin.',
    ag: 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.',
    yetkisiz: 'Oturum geçersiz. Uygulamaya yeniden giriş yapın.',
    'uye-degil': 'Bu sohbetin üyesi değilsiniz.',
    yok: 'Toplantı bulunamadı ya da süresi doldu (katılma, başlangıçtan 2 saat sonra kapanır).',
    'cok-istek': 'Çok fazla deneme. Bir dakika sonra yeniden deneyin.',
    sunucu: 'Sunucu şu an yanıt vermiyor. Biraz sonra yeniden deneyin.',
    gecersiz: 'İstek geçersiz ya da sunucu beklenmeyen yanıt verdi.',
    sdk: 'Görüşme bileşeni (SDK) yüklenemedi. Sayfayı yenileyin.',
    'kamera-yok': 'Kamera bulunamadı ya da izin verilmedi.'
  };
  function hataMetni(e) { return HATA[e && e.kod] || ('Beklenmeyen hata: ' + String((e && e.message) || e).slice(0, 160)); }

  function mesaj(metin) { var m = $('mesaj'); if (!metin) { m.hidden = true; m.textContent = ''; return; } m.textContent = metin; m.hidden = false; }
  function durumYaz(d) { $('durum').setAttribute('data-durum', d); $('durum-metin').textContent = 'Çağrı durumu: ' + d; }
  function katilimciYaz(n) {
    $('durum').setAttribute('data-katilimci', String(n));
    var k = $('katilimci-metin'); k.hidden = false; k.textContent = 'Karşı katılımcı: ' + n;
  }
  function panel(ad) {
    ['panel-yok', 'panel-sec', 'panel-katil', 'panel-bitti', 'sahne'].forEach(function (p) { $(p).hidden = p !== ad; });
    $('cubuk').hidden = ad !== 'sahne';
  }
  function yokGoster(baslik, metin, baglanti) {
    $('yok-baslik').textContent = baslik; $('yok-metin').textContent = metin;
    $('yok-baglanti').hidden = !baglanti;
    panel('panel-yok');
  }

   
  function kartYap(id, adMetni, yerel) {
    if (kartlar.has(id)) { kartlar.get(id).ad.textContent = adMetni; return kartlar.get(id); }
    var kart = document.createElement('div'); kart.className = 'kart'; kart.setAttribute('data-kart', id);
    var gor = document.createElement('div'); gor.className = 'goruntu';
    var bas = document.createElement('div'); bas.className = 'bas'; bas.textContent = (adMetni || '?').trim().charAt(0).toUpperCase();
    gor.appendChild(bas);
    var alt = document.createElement('div'); alt.className = 'alt';
    var a = document.createElement('span'); a.className = 'ad'; a.textContent = adMetni; alt.appendChild(a);
    if (yerel) { var r = document.createElement('span'); r.className = 'rozet'; r.textContent = 'Siz'; alt.appendChild(r); }
    kart.appendChild(gor); kart.appendChild(alt);
    $('izgara').appendChild(kart);
    var o = { kart: kart, goruntu: gor, ad: a, bas: bas };
    kartlar.set(id, o);
    return o;
  }
  function videoKoy(id, element) {
    var k = kartlar.get(id); if (!k) return;
    Array.from(k.goruntu.querySelectorAll('[data-video]')).forEach(function (n) { n.remove(); });
    if (element) {
      var kap = document.createElement('div'); kap.className = 'video'; kap.setAttribute('data-video', '1'); kap.appendChild(element);
      k.goruntu.appendChild(kap); k.bas.hidden = true;
    } else { k.bas.hidden = false; }
  }
  function izgaraTemizle() { $('izgara').textContent = ''; kartlar.clear(); }

   
  function saglayiciKur() {
    sag = window.MeetSaglayici.olustur(taklit ? 'taklit' : 'acs');
    sag.dinle('durum', function (v) { durumYaz(v.durum); });
    sag.dinle('katilimci', function (v) { katilimciYaz(v.sayi); });
    sag.dinle('katilimciEkle', function (v) { kartYap(v.id, v.ad, false); });
    sag.dinle('katilimciCikar', function (v) { var k = kartlar.get(v.id); if (k) { k.kart.remove(); kartlar.delete(v.id); } });
    sag.dinle('uzakVideo', function (v) { videoKoy(v.id, v.element); });
    sag.dinle('yerelVideo', function (v) { videoKoy('ben', v.element); });
    sag.dinle('mikrofon', function (v) { $('b-mik').setAttribute('aria-pressed', v.acik ? 'true' : 'false'); $('b-mik').textContent = v.acik ? 'Mikrofon' : 'Mikrofon kapalı'; });
    sag.dinle('kamera', function (v) { $('b-kam').setAttribute('aria-pressed', v.acik ? 'true' : 'false'); $('b-kam').textContent = v.acik ? 'Kamera açık' : 'Kamera'; });
    sag.dinle('hata', function (v) { mesaj(v.mesaj); });
    sag.dinle('ayrildi', function () { bittiGoster(); });
  }

  async function cagriyaGir(bilgi) {
    mesaj('');
    izgaraTemizle(); katilimciYaz(0); durumYaz('Connecting');
    kartYap('ben', ad, true);
    panel('sahne');
    saglayiciKur();
    try { await sag.baglan({ groupId: bilgi.groupId, acsToken: bilgi.acsToken, ad: ad }); }
    catch (e) { mesaj(hataMetni(e)); durumYaz('Hata'); try { await sag.ayril(); } catch (e2) {   } }
  }

  function bittiGoster() { if ($('panel-bitti').hidden) { panel('panel-bitti'); } }

   
  async function baslat() {
    if (meşgul || !sohbetId) return;
    meşgul = true; $('b-baslat').disabled = true; mesaj('');
    try {
      var bilgi = taklit ? { groupId: 'taklit-' + Date.now(), acsToken: 'taklit' } : await window.MeetApi.aramaBaslat(sohbetId);
      await cagriyaGir(bilgi);
      var link = window.MeetApi && window.MeetApi.baglantiOlustur ? window.MeetApi.baglantiOlustur(sohbetId, bilgi.groupId) : '';
      $('baglanti').value = link; $('baglanti-satiri').hidden = !link;
      if (!taklit) {
        try { await window.MeetApi.baglantiMesaji(sohbetId, bilgi.groupId); }
        catch (e) { mesaj('Toplantı başladı ancak bağlantı mesajı sohbete gönderilemedi (' + hataMetni(e) + '). Bağlantıyı yukarıdan kopyalayıp paylaşın.'); }
      }
    } catch (e2) { mesaj(hataMetni(e2)); $('b-baslat').disabled = false; }
    meşgul = false;
  }

  async function katil(s, g) {
    if (meşgul) return;
    meşgul = true; $('b-katil').disabled = true; mesaj('');
    try {
      var bilgi = taklit ? { groupId: g, acsToken: 'taklit' } : await window.MeetApi.aramaKatil(s, g);
      sohbetId = s;
      $('baglanti-satiri').hidden = true;
      await cagriyaGir(bilgi);
    } catch (e) { mesaj(hataMetni(e)); }
    $('b-katil').disabled = false; meşgul = false;
  }

  function hashOku() {
    var h = (location.hash || '').replace(/^#/, ''), s = '', g = '';
    h.split('&').forEach(function (p) {
      var i = p.indexOf('='); if (i < 0) return;
      var k = p.slice(0, i), v = p.slice(i + 1);
      try { v = decodeURIComponent(v); } catch (e) { v = ''; }
      if (k === 's') s = v; else if (k === 'g') g = v;
    });
    return { s: s.slice(0, 128), g: g.slice(0, 64) };
  }

  async function sohbetListesi() {
    var sec = $('sohbet-sec'); sec.textContent = '';
    if (taklit) {
      var o = document.createElement('option'); o.value = 't1'; o.textContent = 'Deneme sohbeti'; sec.appendChild(o);
      $('b-baslat').disabled = false; sohbetId = 't1'; return;
    }
    var sonuc = await Promise.all([window.MeetApi.sohbetler(), window.MeetApi.kisiler().catch(function () { return []; })]);
    var adlar = {}; sonuc[1].forEach(function (k) { adlar[k.oid] = k.ad; });
    var ben = window.MeetKimlik.oid();
    var l = sonuc[0].filter(function (s) { return !(s.tercih && s.tercih.arsiv); });
    l.forEach(function (s) {
      var etiket = s.tur === 'grup' ? (s.ad || 'Grup') : (s.uyeler.filter(function (u) { return u !== ben; }).map(function (u) { return adlar[u] || 'Kişi'; }).join(', ') || 'Bire bir sohbet');
      if (s.tur === 'grup') etiket += ' (grup, ' + s.uyeler.length + ' kişi)';
      var op = document.createElement('option'); op.value = s.id; op.textContent = etiket; sec.appendChild(op);
    });
    if (!l.length) { mesaj('Hiç sohbetiniz yok. Önce uygulamanın Mesaj bölümünden bir sohbet açın.'); $('b-baslat').disabled = true; return; }
    sohbetId = sec.value; $('b-baslat').disabled = false;
  }

  async function ac() {
    durumYaz('hazir');
    if (window.MeetKimlik.yerelUygulama()) { yokGoster('Toplantı bugün yalnız bilgisayar tarayıcısında', 'Bu sayfa uygulama içinde değil, bilgisayarınızın tarayıcısında açılır.', false); durumYaz('desteklenmiyor'); return; }
    if (!taklit) {
      var k = await window.MeetKimlik.hazirla();
      if (k === 'giris-yok') { yokGoster('Önce uygulamada giriş yapın', 'Meet, uygulamadaki oturumunuzu kullanır; giriş yaptıktan sonra bu sayfaya dönün.', true); durumYaz('giris-yok'); return; }
      if (k !== 'tamam') { yokGoster('Giriş bileşeni hazır değil', 'Sayfayı yenileyin; sürerse uygulamadan açın.', true); durumYaz('giris-yok'); return; }
      ad = window.MeetKimlik.ad();
    }
    if (!taklit && !(window.MM_ACS && window.MM_ACS.CallClient)) mesaj(HATA.sdk);
    var h = hashOku();
    if (h.s && h.g) {
      sohbetId = h.s;
      $('katil-bilgi').textContent = 'Bağlantıdaki toplantıya katılacaksınız. Katıl dediğinizde tarayıcı mikrofon/kamera izni isteyebilir.';
      panel('panel-katil'); durumYaz('hazir');
      $('b-katil').onclick = function () { katil(h.s, h.g); };
      return;
    }
    panel('panel-sec');
    try { await sohbetListesi(); durumYaz('hazir'); } catch (e) { mesaj(hataMetni(e)); durumYaz('hata'); }
  }

  function dugmeler() {
    $('b-baslat').addEventListener('click', baslat);
    $('sohbet-sec').addEventListener('change', function () { sohbetId = this.value; });
    $('b-mik').addEventListener('click', async function () {
      if (!sag) return;
      try { await sag.mikrofon($('b-mik').getAttribute('aria-pressed') !== 'true'); } catch (e) { mesaj(hataMetni(e)); }
    });
    $('b-kam').addEventListener('click', async function () {
      if (!sag) return;
      try { await sag.kamera($('b-kam').getAttribute('aria-pressed') !== 'true'); } catch (e) { mesaj(hataMetni(e)); }
    });
    $('b-ayril').addEventListener('click', async function () { if (sag) { try { await sag.ayril(); } catch (e) { mesaj(hataMetni(e)); } } });
    $('b-kopyala').addEventListener('click', async function () {
      var v = $('baglanti').value;
      try { await navigator.clipboard.writeText(v); mesaj('Bağlantı kopyalandı.'); } catch (e) { $('baglanti').select(); mesaj('Kopyalanamadı; bağlantıyı seçip elle kopyalayın.'); }
    });
    $('b-tekrar').addEventListener('click', function () { mesaj(''); katilimciYaz(0); sag = null; ac(); });
    window.addEventListener('beforeunload', function () { try { if (sag) sag.ayril(); } catch (e) {   } });
    window.addEventListener('hashchange', function () { if ($('sahne').hidden) ac(); });
  }

  dugmeler();
  ac().catch(function (e) { mesaj(hataMetni(e)); durumYaz('hata'); });
})();
