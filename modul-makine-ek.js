



(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var YENILE_MS = 30000, EK_MS = 5 * 60000;   
  function say(n) { return n == null ? '—' : Math.round(n).toLocaleString('tr-TR'); }
  function bekleniyor(ad) { return h('p', { sinif: 'me-soluk', metin: ad + ': Kayıt yok' }); }

  var ESKI_MS = 3 * 60000;   
  

  function panoVerisi(html) {
    var a = '/*VERI:mabotex*/', b = '/*/VERI:mabotex*/', i = html.indexOf(a), j = html.indexOf(b);
    if (i < 0 || j < i) return null;
    try { return JSON.parse(html.slice(i + a.length, j)); } catch (e) { return null; }
  }
  function canliListe(p) {   
    var akis = {};
    (((p.akis || {}).hatlar) || []).forEach(function (x) { akis[x.hat] = x.ornekler || []; });
    return (p.hatlar || []).map(function (hh) {
      var o = akis[hh.hat] || [], son = o.length ? o[o.length - 1] : {}, hiz = hh.hiz_dk || 0, adet = hh.vardiya_uretilen;
      var cal = hh.durum === 'calisiyor' && hiz > 0 && (!son.durum || son.durum === 'calisiyor') && adet != null;
      return { hat: hh.hat, adet: adet, hiz_dk: cal ? hiz : 0, calisiyor: !!cal, adet_tahmin: !!hh.uretilen_tahmin, veri_yas_sn: hh.veri_yas_sn || 0 };
    });
  }
   
  function adimSonuc(o, simdi) {
    var eskidi = !o.veriMs || (simdi - o.veriMs + (o.c.veri_yas_sn || 0) * 1000) > ESKI_MS;
    if (eskidi || !o.artar || o.c.adet == null) return { eskidi: eskidi, deger: null };
    return { eskidi: false, deger: o.c.adet + o.c.hiz_dk * (simdi - o.t0) / 60000 };
  }
   
  var DK_ILK = 20;
  var UD = null;   
  function mSayi(v) { return typeof v === 'number' && isFinite(v); }
  function m2Yaz(n) { return n.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  function dokumaGecerli(d) {    
    var m = d && d.dokuma_m2;
    if (!m || typeof m !== 'object' || !Array.isArray(m.liste)) return null;
    var l = m.liste.filter(function (x) { return x && x.no != null && x.salon != null; });
    return l.length ? { ad: (m.donem && typeof m.donem.ad === 'string') ? m.donem.ad : '', zaman: (m.donem && m.donem.veri_zamani) || '', liste: l } : null;
  }
  function dokumaSalonlar(l) {    
    var o = {}, sira = [];
    l.forEach(function (x) { var s = String(x.salon); if (!o[s]) { o[s] = { salon: s, toplam: 0, sayi: 0, tanimsiz: 0 }; sira.push(s); } if (mSayi(x.m2)) { o[s].toplam += x.m2; o[s].sayi++; } else o[s].tanimsiz++; });
    return sira.sort(function (a, b) { return (parseFloat(a) - parseFloat(b)) || (a < b ? -1 : 1); }).map(function (s) { return o[s]; });
  }
  function dokumaSirala(l, salon) {    
    return l.filter(function (x) { return salon === 't' || String(x.salon) === salon; }).slice().sort(function (a, b) {
      var A = mSayi(a.m2), B = mSayi(b.m2);
      if (A && B) return (b.m2 - a.m2) || (String(a.no) < String(b.no) ? -1 : 1);
      if (A !== B) return A ? -1 : 1;
      return String(a.no) < String(b.no) ? -1 : 1;
    });
  }
  function dokumaToplam(l) { return l.reduce(function (t, x) { return mSayi(x.m2) ? t + x.m2 : t; }, 0); }
  var saatTr = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hour12: false });
  function saatYaz(iso) { var t = Date.parse(iso); return isNaN(t) ? '' : saatTr.format(new Date(t)); }
  MM.makineEkSinama = { adimSonuc: adimSonuc, ESKI_MS: ESKI_MS, dokumaGecerli: dokumaGecerli, dokumaSalonlar: dokumaSalonlar, dokumaSirala: dokumaSirala, dokumaToplam: dokumaToplam, m2Yaz: m2Yaz };
   
   
  var acikDurum = { canli: false, tahmin: !(window.matchMedia && window.matchMedia('(max-width: 599px)').matches) };   
  function acilir(anahtar, ozet, icerik) {
    var ac = h('details', { sinif: 'acilir-bolum me-ac' }, [ozet, icerik]);
    if (acikDurum[anahtar]) ac.setAttribute('open', '');
    ac.addEventListener('toggle', function () { acikDurum[anahtar] = ac.open; });
    return ac;
  }
  function canliCiz(kutu, liste, veriMs, durum) {
    kutu.textContent = '';
    var ogeler = [], simdi = Date.now(), uyarili = [], calisan = [];
    var dar = false;   
    liste.forEach(function (c) {
      var eski = (simdi - veriMs + (c.veri_yas_sn || 0) * 1000) > ESKI_MS;
      var sayi = h('div', { sinif: 'me-canli-sayi', metin: say(c.adet) });
      var alt = h('div', { sinif: 'me-canli-alt', metin: eski ? 'veri gecikmeli · artmıyor' : (c.calisiyor ? say(c.hiz_dk) + ' adet/dk' : (c.adet == null ? 'veri yok' : 'duruyor · artmıyor')) });
      var artar = c.calisiyor && !eski;
      var k = h('div', { sinif: 'me-canli-kutu' + (artar ? ' ok' : (eski || c.adet == null ? ' dur yok' : ' dur dus')) }, [h('div', { sinif: 'me-canli-hat', metin: 'Hat ' + c.hat }), sayi, alt,
        h('div', { sinif: 'me-canli-vard', 'data-hat': c.hat }),
        eski ? h('span', { sinif: 'me-etiket', metin: 'veri gecikmeli' }) : (c.calisiyor ? h('span', { sinif: 'me-etiket', metin: c.adet_tahmin ? 'canlı tahmini · adet tahmin' : 'canlı tahmini' }) : null)]);
      (artar && dar ? calisan : uyarili).push(k);   
      ogeler.push({ c: c, sayi: sayi, alt: alt, k: k, t0: simdi, artar: artar, veriMs: veriMs });
    });
    uyarili.forEach(function (k) { kutu.appendChild(k); });
    if (calisan.length) {
      var trc = window.MM.t || function (x) { return x };
      kutu.appendChild(acilir('canli', h('summary', { metin: trc('Çalışan hatlar') + ' (' + calisan.length + ')' }), h('div', { sinif: 'me-canli-ic' }, calisan)));
    }
    durum.canli = ogeler;
  }

   
  var saatBicim = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', hour12: false });
  function vardiyaMetin(bilgi, saat) {
    var t = window.MM.t || function (x) { return x };
    if (!bilgi) return t('Vardiya') + ': ' + t('veri yok');
    if (bilgi.saat === 12) return t('Vardiya') + ': ' + bilgi.sistem + ' · ' + (saat >= 8 && saat < 20 ? t('Gündüz') + ' 08:00–20:00' : t('Gece') + ' 20:00–08:00');
    if (bilgi.saat === 8) return t('Vardiya') + ': ' + bilgi.sistem + ' · ' + (saat < 8 ? t('Gece') + ' 00:00–08:00' : saat < 16 ? t('Gündüz') + ' 08:00–16:00' : t('Akşam') + ' 16:00–24:00');
    return t('Vardiya') + ': ' + t('veri yok');
  }
   
  function vardiyaYaz(kutu, vardMap, opMap) {
    var saat = parseInt(saatBicim.format(new Date()), 10) % 24, t = window.MM.t || function (x) { return x };
    Array.prototype.forEach.call(kutu.querySelectorAll('.me-canli-vard'), function (e) {
      var hat = e.getAttribute('data-hat');
      e.textContent = vardiyaMetin(vardMap[hat], saat);
      if (opMap) {
        var ad = opMap[hat];
        e.appendChild(h('div', { metin: t('Operatör') + ': ' + (ad ? ad : t('veri yok')) }));
      }
    });
  }

  function paretoBolum(p) {
    if (!p || !p.liste || !p.liste.length) return bekleniyor('Duruş nedeni');
    var mx = Math.max.apply(null, p.liste.map(function (x) { return x.dk; }).concat([1]));
    var og = p.liste.map(function (x) { return { e: x.ad, d: x.dk, etiketDeger: say(x.dk) + ' dk', renk: x.girilmedi ? 'var(--gri)' : 'var(--s1)' }; });
    var pay = p.toplam_dk ? Math.round(100 * p.girilmedi_dk / p.toplam_dk) : 0;
    return h('div', null, [G.yatay(og, { maks: mx }), h('p', { sinif: 'me-soluk', metin: 'Vardiya: ' + p.vardiya + ' · toplam ' + say(p.toplam_dk) + ' dk · %' + pay + ' neden girilmedi (gri). Neden girilmedi satırı sıfır değil, kayıt eksiğidir.' })]);
  }

  function seritBolum(s) {
    if (!s || !s.length) return bekleniyor('Zaman şeridi');
    var k = h('div', { sinif: 'me-serit' });
    s.forEach(function (x) {
      var yol = h('div', { sinif: 'me-serit-yol', role: 'img', 'aria-label': 'Hat ' + x.hat + ' durum şeridi' });
      (x.durumlar || '').split('').forEach(function (c) { yol.appendChild(h('i', { sinif: 'me-d-' + (c === 'n' ? 'n' : c === 's' ? 's' : c === 'd' ? 'd' : 'x') })); });
      k.appendChild(h('div', { sinif: 'me-serit-satir' }, [h('span', { sinif: 'me-serit-hat', metin: x.hat }), yol]));
    });
    k.appendChild(G.lejant([['Çalıştı', 'var(--yesil)'], ['Yavaş', 'var(--sari)'], ['Durdu', 'var(--kirmizi)'], ['Veri yok', 'var(--gri)']]));
    k.appendChild(h('p', { sinif: 'me-soluk', metin: 'Her dilim 15 dakika' }));
    return k;
  }

  function oeeBolum(o) {
    if (!o || !o.length) return bekleniyor('OEE');
    var f = function (v) { return v == null ? '—' : v.toFixed(1).replace('.', ','); };
    var t = h('table', { sinif: 'me-oee-tablo' }, [h('thead', null, [h('tr', null, ['Hat', 'OEE %', 'Kullanılabilirlik', 'Performans', 'Kalite'].map(function (c) { return h('th', { scope: 'col', metin: c }); }))]),
      h('tbody', null, o.map(function (x) { return h('tr', null, [h('td', { metin: x.hat + (x.gecici ? ' (geçici)' : '') }), h('td', { metin: x.oee == null ? '—' : f(x.oee) }), h('td', { metin: f(x.kullanilabilirlik) }), h('td', { metin: f(x.performans) }), h('td', { metin: f(x.kalite) })]); }))]);
    return h('div', null, [h('div', { sinif: 'me-tablo-kaydir' }, [t])]);
  }

  function alarmBolum(a) {
    if (!a || !a.vardiyalar) return bekleniyor('Alarm geçmişi');
    var v = h('div', { sinif: 'me-vardiya' }, a.vardiyalar.map(function (x) {
      return h('div', null, [h('span', { metin: x.ad + ' · ' + x.saat }), h('b', { metin: say(x.adet) + ' alarm' }), h('span', { metin: say(x.dk) + ' dk toplam' }), h('span', { sinif: 'me-soluk', metin: x.neden_girildi + ' / ' + x.adet + ' kayıtta neden girilmiş' })]);
    }));
    var ALARM_AD = { 'hat-durus': 'Hat durdu', 'dusuk-uretim': 'Düşük üretim' };   
    var alarmAd = function (k) { return ALARM_AD[k] || (k ? String(k).replace(/-/g, ' ').replace(/^./, function (c) { return c.toLocaleUpperCase('tr-TR'); }) : 'Alarm'); };
    var l = G.ilkN(a.son || [], function (x) { return h('div', { sinif: 'me-alarm-satir' }, [h('span', { metin: x.bas + ' · ' + x.hat }), h('span', { metin: alarmAd(x.alarm) + ' · ' + say(x.dk) + ' dk · ' + x.vardiya })]); }, { n: 10, sinif: 'me-alarm-liste' });
    return h('div', null, [v, l, h('p', { sinif: 'me-soluk', metin: 'Son 24 saat, ' + say(a.toplam) + ' alarm; kişi adı yok.' })]);
  }

  function tahminBolum(t) {
    var s = (t || []).filter(function (x) { return x.tahmin != null; });
    if (!s.length) return bekleniyor('Gün sonu tahmini');
    var og = s.map(function (x) { return { e: 'Hat ' + x.hat, d: x.tahmin, alt: x.gun_hedef ? 'hedef ' + say(x.gun_hedef) : '', etiketDeger: say(x.tahmin) + ' (tahmin)', renk: 'var(--tahmin)' }; });
    var trt = window.MM.t || function (x) { return x };   
    return h('div', null, [acilir('tahmin', h('summary', { metin: trt('Hat bazında tahmin') + ' (' + s.length + ')' }), G.yatay(og, {})), h('p', { sinif: 'me-soluk', metin: 'Tahmin: bugünkü üretim + bugünkü ortalama hız × kalan planlı süre. Ölçüm değildir.' })]);
  }

   
  function dokumaKart(v, durum, yeniden) {
    var tr = window.MM.t || function (x) { return x };
    var sal = dokumaSalonlar(v.liste), toplam = dokumaToplam(v.liste), tanim = v.liste.filter(function (x) { return !mSayi(x.m2); }).length;
    var udSay = UD ? v.liste.filter(function (x) { return UD[String(x.no)]; }).length : 0;
    var sifirHepsi = !v.liste.some(function (x) { return mSayi(x.m2) && x.m2 > 0; });   
    var saat = saatYaz(v.zaman), alt = [v.ad, saat ? tr('veri saati') + ' ' + saat : ''].filter(Boolean).join(' · ');
    var ozet = h('div', { sinif: 'me-dk-ozet' }, [h('div', { sinif: 'me-dk-kutu me-dk-toplam' }, [h('span', { sinif: 'me-soluk', metin: tr('Toplam') }), h('b', { metin: sifirHepsi ? '—' : m2Yaz(toplam) + ' m²' })])]);
    var salonlar = h('div', { sinif: 'me-dk-salonlar', style: 'grid-template-columns:repeat(' + Math.max(sal.length, 1) + ',minmax(0,1fr))' }, sal.map(function (s) {
      return h('div', { sinif: 'me-dk-kutu' }, [h('span', { sinif: 'me-soluk', metin: tr('Salon') + ' ' + s.salon }), h('b', { metin: s.sayi && !sifirHepsi ? m2Yaz(s.toplam) : '—' })]);
    }));
    var govde = h('div', null, [ozet, salonlar]);
    if (sifirHepsi) govde.appendChild(h('p', { sinif: 'me-soluk me-uyari', metin: udSay >= v.liste.length - tanim ? tr('Planlı üretim dışı') + ' · ' + say(udSay) : tr('Tüm tezgâhlar 0 bildiriyor; ölçüm gelmedi sayıldı, toplam yazılmadı') }));
    if (tanim) govde.appendChild(h('p', { sinif: 'me-soluk', metin: tr('{n} tezgahta m² bilgisi tanımsız (toplama katılmadı)').replace('{n}', say(tanim)) }));
    var ac = h('details', { sinif: 'acilir-bolum me-dk-ac' }, [h('summary', { metin: tr('Tezgah bazında') })]);
    if (durum.acik) ac.setAttribute('open', '');
    ac.addEventListener('toggle', function () { durum.acik = ac.open; });
    var liste = h('div');
    function listeCiz() {
      liste.textContent = '';
      var tum = dokumaSirala(v.liste, durum.salon), gor = tum.slice(0, durum.n);
      liste.appendChild(G.cipler([['t', tr('Tümü')]].concat(sal.map(function (s) { return [s.salon, tr('Salon') + ' ' + s.salon]; })), durum.salon, function (id) { durum.salon = id; durum.n = DK_ILK; listeCiz(); }, tr('Salon süzgeci')));
      liste.appendChild(h('div', { sinif: 'me-dk-izgara' }, gor.map(function (x) {
        var sayi = mSayi(x.m2), disi = !!(UD && UD[String(x.no)]);
        return h('div', { sinif: 'me-dk-hucre' + (disi ? ' tanimsiz' : (sayi && x.m2 === 0 ? ' sifir' : '') + (sayi ? '' : ' tanimsiz')) }, [h('span', { metin: String(x.no) }), h('b', { metin: disi ? tr('üretim dışı') : (sayi ? m2Yaz(x.m2) : tr('tanımsız')) })]);
      })));
      if (tum.length > gor.length) liste.appendChild(h('button', { type: 'button', sinif: 'mini-dugme', metin: tr('Daha fazla göster'), onclick: function () { durum.n += DK_ILK; listeCiz(); } }));
    }
    listeCiz();
    ac.appendChild(liste); govde.appendChild(ac);
    return G.kart({ baslik: tr('Dokuma m²'), alt: alt, govde: govde });
  }

   
  function fireBolum(f) {
    var s = (f || []).filter(function (x) { return x.fire_yuzde != null; });
    if (!s.length) return bekleniyor('Fire');
    var mx = Math.max.apply(null, s.map(function (x) { return x.fire_yuzde; }).concat([1]));
    var og = s.map(function (x) { return { e: 'Hat ' + x.hat, d: x.fire_yuzde, alt: x.uretilen != null ? say(x.uretilen) + ' adet üretim' : '', etiketDeger: '%' + x.fire_yuzde.toFixed(1).replace('.', ','), renk: x.fire_yuzde >= 3 ? 'var(--kirmizi)' : 'var(--sari)' }; });
    var yok = (f || []).filter(function (x) { return x.fire_yuzde == null; }).map(function (x) { return 'Hat ' + x.hat; });
    return h('div', null, [G.yatay(og, { maks: mx }),
      h('p', { sinif: 'me-soluk', metin: 'Fire oranı makinenin bildirdiği değerdir (üretim adedi üzerinden %). Adet ya da m² olarak fire miktarı henüz yok (Kısmi).' + (yok.length ? ' Fire verisi yok: ' + yok.join(', ') + '. Dokuma tezgâhlarında fire verisi yok.' : ' Dokuma tezgâhlarında fire verisi yok.') })]);
  }

   
  function donemBolum(kayit) {
    if (!kayit || !kayit.liste) return bekleniyor('Dönem raporu');
    var bugun = new Date(), gunYaz = function (d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
    var bas = h('input', { type: 'date', 'aria-label': 'Başlangıç tarihi' }), son = h('input', { type: 'date', 'aria-label': 'Bitiş tarihi' });
    var bilgi = h('p', { sinif: 'me-soluk' });
    function ayarla(gun) { var a = new Date(); a.setDate(a.getDate() - gun); bas.value = gunYaz(a); son.value = gunYaz(bugun); guncelle(); }
    function secili() { return kayit.liste.filter(function (x) { return (!bas.value || x.gun >= bas.value) && (!son.value || x.gun <= son.value); }); }
    function guncelle() {
      var s = secili(), dk = s.reduce(function (t, x) { return t + (x.dk || 0); }, 0), y = s.filter(function (x) { return x.yorum; }).length;
      bilgi.textContent = say(s.length) + ' duruş · ' + say(dk) + ' dk toplam · ' + say(y) + ' kayıtta yorum var.';   
    }
    bas.addEventListener('change', guncelle); son.addEventListener('change', guncelle);
    var kolonlar = [{ ad: 'Tarih', k: 0 }, { ad: 'Makine', k: 1 }, { ad: 'Vardiya', k: 2 }, { ad: 'Duruş türü', k: 3 }, { ad: 'Başlangıç', k: 4 }, { ad: 'Bitiş', k: 5 }, { ad: 'Süre (dk)', k: 6 }, { ad: 'Duruş yorumu', k: 7 }];
    var dg = G.excelDugme(function () {
      var s = secili();
      return { ad: 'Makineler · duruşlar', filtre: (bas.value || '…') + ' – ' + (son.value || '…') + ' · bütün makineler (Mabotex, dokuma)' + (s.length ? '' : ' · bu dönemde kayıt yok'),
        kolonlar: kolonlar, satirlar: s.map(function (x) { return [x.gun, x.makine, x.vardiya, x.tur, x.bas, x.bit, x.dk == null ? '' : x.dk, x.yorum || '']; }) };
    });
    var secenek = [['Son 7 gün', 7], ['Son 30 gün', 30], ['Son ' + kayit.gun + ' gün', kayit.gun]].map(function (x) { return h('button', { type: 'button', sinif: 'mini-dugme', metin: x[0], onclick: function () { ayarla(x[1]); } }); });
    ayarla(7);
    return h('div', null, [h('div', { sinif: 'me-donem' }, [h('label', null, ['Başlangıç ', bas]), h('label', null, ['Bitiş ', son])].concat(secenek).concat([dg])), bilgi]);
  }

  MM.makineEk = function (ust) {
    var kok = h('section', { sinif: 'me-ek', 'aria-label': 'Makineler eki' }), durum = { canli: [] };
    ust.appendChild(kok);
    var canli_ = true, tmr = null, sayacTmr = null, yukleniyor = false, sonEk = 0;
    var azHareket = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function kart(baslik, alt, govde) { return G.kart({ baslik: baslik, alt: alt, govde: govde }); }
    var canliKutu = h('div', { sinif: 'me-canli' }), digerKok = h('div', { sinif: 'me-ek' }), durusKok = h('div', { sinif: 'me-ek', hidden: true }), gecmisKok = h('div', { sinif: 'me-ek', hidden: true }), hatKok = h('div', { sinif: 'me-ek' }), ekYuklendi = false;
     
    MM.makineEkGoster = function (id) { hatKok.hidden = id !== 'hatlar'; durusKok.hidden = id !== 'duruslar'; gecmisKok.hidden = id !== 'gecmis'; };
    MM.makineEkDurum = null;
    var vardMap = {}, opMap = null;
    function vardiyaTazele() { vardiyaYaz(canliKutu, vardMap, opMap); }
    async function operatorYukle() {   
      var V = window.MMVeri;
      if (!V || !V.ozelErisim || !V.ozelErisim('ik')) { opMap = null; return; }
      try {
        var r = await V.oku('ik', 'makine-operator'), m = {};
        ((r.veri || {}).hatlar || []).forEach(function (x) { if (x && x.hat) m[x.hat] = x.operator || null; });
        opMap = m;
      } catch (e) { opMap = {}; }
    }
    hatKok.appendChild(kart('Hat adedi (canlı tahmini)', 'Son gerçek adet + adet/dk; her dakika gerçek veriyle düzelir', canliKutu));
    hatKok.appendChild(digerKok);
    var dokumaKok = h('div', { sinif: 'me-ek' }), dokumaDurum = { salon: 't', n: DK_ILK, acik: false };
    hatKok.appendChild(dokumaKok);
    kok.appendChild(hatKok); kok.appendChild(durusKok); kok.appendChild(gecmisKok);
    var donemKutu = h('div'), donemYuklendi = false;
    var gecmisUst = h('div', { sinif: 'me-ek' });
    gecmisKok.appendChild(donemKutu); gecmisKok.appendChild(gecmisUst);
    async function donemYukle() {   
      if (donemYuklendi) return; donemYuklendi = true;
      donemKutu.textContent = '';
      try {
        var r = await window.MMVeri.oku('fabrika', 'makine-durus');
        if (!canli_) return;
        donemKutu.appendChild(kart('Duruşlar · dönem Excel', 'Bütün makineler (Mabotex, dokuma) · duruş ve duruş yorumları', donemBolum((r.veri || {}).durus)));
      } catch (e) { donemYuklendi = false; donemKutu.appendChild(kart('Duruşlar · dönem Excel', null, bekleniyor('Dönem raporu'))); }
    }
    function ciz(d) {   
      digerKok.textContent = ''; durusKok.textContent = '';
      digerKok.appendChild(kart('Gün sonu tahmini', 'tahmin · bugünkü hıza göre, ölçüm değil', tahminBolum(d.tahmin)));
      dokumaKok.textContent = '';
      try { var dv = dokumaGecerli(d); if (dv) dokumaKok.appendChild(dokumaKart(dv, dokumaDurum)); } catch (e) { dokumaKok.textContent = ''; }    
      gecmisUst.textContent = '';
      gecmisUst.appendChild(kart('OEE kırılımı', null, oeeBolum(d.oee)));
      gecmisUst.appendChild(kart('Makine bazında fire', 'makinenin bildirdiği oran', fireBolum(d.fire)));
      durusKok.appendChild(kart('Duruş nedenleri', 'Vardiya bazlı Pareto', paretoBolum(d.pareto)));
      durusKok.appendChild(kart('Vardiya zaman şeridi', null, seritBolum(d.serit)));
      durusKok.appendChild(kart('Alarm geçmişi', 'Son 24 saat · vardiya', alarmBolum(d.alarm_24s)));
      MM.makineEkDurum = { alarm: d.alarm_24s && typeof d.alarm_24s.toplam === 'number' ? d.alarm_24s.toplam : null };   
      window.dispatchEvent(new Event('mm-makine-ek'));
    }
    function sayacAdim() {
      var simdi = Date.now();
      durum.canli.forEach(function (o) {
        var s = adimSonuc(o, simdi);
        if (s.eskidi) {   
          o.artar = false; o.k.className = 'me-canli-kutu dur yok'; o.alt.textContent = 'veri gecikmeli · artmıyor';
          var et = o.k.querySelector('.me-etiket'); if (et) et.textContent = 'veri gecikmeli'; else o.k.appendChild(h('span', { sinif: 'me-etiket', metin: 'veri gecikmeli' }));
          var ic = o.k.parentNode;   
          if (ic && ic.classList && ic.classList.contains('me-canli-ic')) {
            var grup = ic.parentNode, izgara = grup && grup.parentNode;
            if (izgara) {
              izgara.insertBefore(o.k, grup);
              var kalan = ic.querySelectorAll('.me-canli-kutu').length, ozet = grup.querySelector('summary'), trc = window.MM.t || function (x) { return x };
              if (!kalan) izgara.removeChild(grup); else if (ozet) ozet.textContent = trc('Çalışan hatlar') + ' (' + kalan + ')';
            }
          }
        }
        if (s.deger != null) o.sayi.textContent = say(s.deger);
      });
    }
    async function yukleCanli() {   
      var v = await MM.fabrika.panoAl(), p = null;   
      if (v.bloklar && typeof v.bloklar['VERI:mabotex'] === 'string') { try { p = JSON.parse(v.bloklar['VERI:mabotex']); } catch (e) { p = null; } }
      if (!p) { var html = v.html(); p = typeof html === 'string' ? panoVerisi(html) : null; }
      if (p && p.hatlar && p.hatlar.length) { canliCiz(canliKutu, canliListe(p), Date.parse(p.asof) || Date.parse(v.uretildi || v.asof) || 0, durum); vardiyaTazele(); return true; }
      return false;
    }
    async function yukle() {
      if (yukleniyor || !canli_) return; yukleniyor = true;
      try {
        var tamam = false;
        try { tamam = await yukleCanli(); } catch (e) { tamam = false; }
        var simdi = Date.now();
        if (!canli_) return;
        if (!tamam || !ekYuklendi || simdi - sonEk > EK_MS) {   
          try {
            var r = await window.MMVeri.oku('fabrika', 'makine-ek'), d = r.veri || {};
            if (!canli_) return;
            try {   
              var rd = await window.MMVeri.oku('fabrika', 'dokuma-veri'), tz = (rd.veri || {}).tezgahlar || [], ks = {};
              tz.forEach(function (x) { if (x && x.uretim_disi === true) ks[String(x.no)] = true; });
              UD = Object.keys(ks).length ? ks : null;
            } catch (e2) { UD = null; }
            ciz(d); ekYuklendi = true; sonEk = simdi; donemYukle();
            vardMap = d.vardiya_hat || {};
            await operatorYukle();
            if (!canli_) return;
            if (!tamam) canliCiz(canliKutu, d.canli || [], Date.parse(d.asof) || 0, durum);
            vardiyaTazele();
          } catch (e) { if (!digerKok.firstChild) digerKok.appendChild(bekleniyor('Makine eki')); if (!durusKok.firstChild) durusKok.appendChild(bekleniyor('Makine eki')); }
        }
      } finally { yukleniyor = false; }
    }
    yukle();
    tmr = setInterval(function () { if (!document.hidden) yukle(); }, YENILE_MS);
    function temizle() { canli_ = false; clearInterval(tmr); clearInterval(sayacTmr); }
     
    sayacTmr = setInterval(function () { if (!kok.isConnected) { temizle(); return; } if (!document.hidden) sayacAdim(); }, azHareket ? 10000 : 1000);
    return temizle;
  };
})();
