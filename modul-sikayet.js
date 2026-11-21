

(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, S = MM.s41, EN = window.MM_LOC === 'en-GB', ESKI_DK = 36 * 60;
  var SEV_AD = { 'yüksek': 'Yüksek', 'orta': 'Orta', 'izle': 'İzleme' }, SEV_SINIF = { 'yüksek': 'yuksek', 'orta': 'orta', 'izle': 'dusuk' };
  var DURUM_AD = { acik: 'Açık', kapali: 'Kapalı' };

  function topla(liste, alan) { var o = {}; liste.forEach(function (x) { var d = x[alan] || {}; Object.keys(d).forEach(function (k) { o[k] = (o[k] || 0) + d[k]; }); }); return o; }
  function sirali(o) { return Object.keys(o).filter(function (k) { return o[k] > 0; }).sort(function (a, b) { return o[b] - o[a]; }); }
  function baskin(x) { var t = x.tur_dagilimi_toplam || {}, k = sirali(t); return k.length ? k[0] : null; }
  function tl(n) { return n == null || !isFinite(n) || n === 0 ? '—' : S.para(n); }

  MM.moduller.sikayet = function (kok) {
    var yuk = null, hata = null, canli = true, st = { sec: null, filtre: 'dikkat' };
    var SAHA = !!(window.MMVeri && window.MMVeri.sahaKip && window.MMVeri.sahaKip());   
    kok.appendChild(G.sayfaBasi({ baslik: 'Şikâyetler', alt: 'Hastane şikâyetleri ve teslimat sorunları', kirinti: [['Şikâyetler']] }));
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);

    function kutu(ad, deger, alt) { return h('div', { sinif: 'ml-kpi' }, [h('div', { sinif: 'ml-kpi-ad', metin: ad }), h('div', { sinif: 'ml-kpi-deger', metin: deger }), alt ? h('div', { sinif: 'ml-kpi-alt', metin: alt }) : null]); }
    function sk(ad, deger) { return h('div', { sinif: 's41-sayi' }, [h('small', { metin: ad }), h('b', { metin: deger })]); }
    function yatayTur(o, renk) { var k = sirali(o); return k.length ? G.yatay(k.map(function (t) { return { e: t, d: o[t], renk: renk, etiketDeger: G.say(o[t]) }; }), { maks: o[k[0]] }) : h('p', { sinif: 'soluk', metin: '—' }); }

    function hastaneSatir(x) {
      var b = baskin(x), alt = [(EN ? '12 months: ' : '12 ay: ') + x.sikayet_12ay + (EN ? ' events' : ' olay'), x.sikayet_toplam != null ? (EN ? 'total ' : 'toplam ') + x.sikayet_toplam : null, x.sikayet_per_100_teslimat != null ? G.say(x.sikayet_per_100_teslimat, 1) + (EN ? ' per 100 deliveries' : ' / 100 teslimat') : null, b, x.acik ? x.acik + (EN ? ' open' : ' açık') : null].filter(function (y) { return y != null && y !== ''; }).join(' · ');
      var el = h('div', { sinif: 's41-satir tikla', role: 'button', tabindex: '0' }, [h('div', { sinif: 'ad', metin: x.ad }), h('div', { sinif: 'sag' }, [h('span', { sinif: 's41-dikkat ' + (SEV_SINIF[x.dikkat_seviye] || 'dusuk'), metin: SEV_AD[x.dikkat_seviye] || 'İzleme' })]), h('div', { sinif: 'alt', metin: alt })]);
      var ac = function () { st.sec = x.id; ciz(); window.scrollTo && window.scrollTo(0, 0); }; el.addEventListener('click', ac); el.addEventListener('keydown', function (e) { if (e.key === 'Enter') ac(); });
      return el;
    }
    function kartCiz(v, x) {
      var f = document.createDocumentFragment(), T = x.tur_dagilimi_toplam || {};
      f.appendChild(h('div', { sinif: 's41-geri' }, [h('button', { sinif: 'dugme ikincil', type: 'button', metin: 'Listeye dön', onclick: function () { st.sec = null; ciz(); } })]));
      f.appendChild(h('div', { sinif: 'ml-baslik' }, [h('h3', { metin: x.ad }), h('span', { sinif: 's41-dikkat ' + (SEV_SINIF[x.dikkat_seviye] || 'dusuk'), metin: 'Dikkat seviyesi: ' + (SEV_AD[x.dikkat_seviye] || 'İzleme') })]));
      f.appendChild(h('div', { sinif: 'ml-kpi-izgara' }, [kutu('Son 12 ay olay', G.say(x.sikayet_12ay), null), kutu('Toplam olay', G.say(x.sikayet_toplam), null),
        kutu('100 teslimatta olay', x.sikayet_per_100_teslimat != null ? G.say(x.sikayet_per_100_teslimat, 1) : '—', x.teslimat_12ay ? G.say(x.teslimat_12ay) + (EN ? ' deliveries in 12 months' : ' teslimat (12 ay)') : null),
        kutu('Açık / kapalı', G.say(x.acik || 0) + ' / ' + G.say(x.kapali || 0), x.p1_olay ? x.p1_olay + (EN ? ' high priority' : ' öncelikli (P1)') : null)]));
      if (x.ceza_kesinti_tl || x.iptal_tutar_tl || x.satis_tl_12ay) f.appendChild(h('div', { sinif: 'ust-bosluk s41-kart-ozet' }, [sk('Ceza kesintisi (toplam, MY+DAY)', tl(x.ceza_kesinti_tl)), sk('Ceza kesintisi (12 ay, MY+DAY)', tl(x.ceza_kesinti_12ay_tl)), sk('İptal tutarı', tl(x.iptal_tutar_tl)), sk('Satış (12 ay)', tl(x.satis_tl_12ay))]));
      f.appendChild(h('div', { sinif: 's41-ikili ust-bosluk' }, [
        G.kart({ baslik: 'Şikâyet türleri', alt: 'Toplam', govde: yatayTur(T, 'var(--s1)') }),
        G.kart({ baslik: 'Ürünler', alt: 'Olay sayısına göre', govde: (x.urunler || []).length ? G.yatay(x.urunler.map(function (u) { return { e: u.urun, d: u.olay, renk: 'var(--s2)', etiketDeger: G.say(u.olay) }; }), { maks: x.urunler[0].olay }) : h('p', { sinif: 'soluk', metin: '—' }) })]));
      var ol = (x.olaylar || []).slice().sort(function (a, b) { return String(b.tarih || '').localeCompare(String(a.tarih || '')); });
      if (ol.length) f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Olaylar', alt: 'En yeniden eskiye', govde: G.sayfali(ol, function (o) {
        return h('div', { sinif: 's41-satir' }, [h('div', { sinif: 'ad', metin: (o.turler || []).join(', ') || '—' }), h('div', { sinif: 'sag', metin: o.tarih ? S.tarihTR(o.tarih) : '—' }),
          h('div', { sinif: 'alt', metin: [(o.urunler || []).join(', '), DURUM_AD[o.durum] || null, o.oncelik, o.kapanis_tarihi ? (EN ? 'closed ' : 'kapanış ') + S.tarihTR(o.kapanis_tarihi) : null, o.iptal_tutar_tl ? (EN ? 'cancelled ' : 'iptal ') + S.para(o.iptal_tutar_tl) : null].filter(Boolean).join(' · ') })]);
      }, { n: 8 }) })]));
      return f;
    }
    function ayGrafik(v) {
      var a = (v.ay_serisi || []).slice(), i0 = -1;
      a.forEach(function (x, i) { if (i0 < 0 && (x.sk != null || x.iade != null)) i0 = i; });
      if (i0 < 0) a.forEach(function (x, i) { if (i0 < 0 && x.toplam_olay != null) i0 = i; });
      if (i0 < 0) return null; a = a.slice(i0);
      var seri = a.map(function (x, i) { return { e: S.ayKisa(x.ay, i === 0 || x.ay.slice(5) === '01'), d: x.toplam_olay == null ? null : x.toplam_olay, ipucu: [S.ayAd(x.ay, true), (EN ? 'Events: ' : 'Olay: ') + (x.toplam_olay == null ? '—' : x.toplam_olay)] }; });
      return G.kart({ baslik: 'Ay ay şikâyet olayı', alt: S.ayAd(a[0].ay, true) + ' – ' + S.ayAd(a[a.length - 1].ay, true), govde: S.bar(seri, { ad: 'Ay ay şikâyet olayı', yukseklik: 170 }) });
    }
    function genel(v) {
      var f = document.createDocumentFragment(), o = v.ozet || {}, H = (v.hastaneler || []).slice().sort(function (a, b) { return (b.dikkat_skoru || 0) - (a.dikkat_skoru || 0); });
      f.appendChild(h('div', { sinif: 'ml-kpi-izgara' }, [kutu('Son 12 ay olay', G.say(o.olay_12ay), null), kutu('Açık olay', G.say(o.acik_olay), null), kutu('Hastane sayısı', G.say(o.hastane_sayisi), null), SAHA ? null : kutu('Ceza kesintisi (toplam, MY+DAY)', tl(o.ceza_toplam_tl), null)]));
      var dik = H.filter(function (x) { return x.dikkat_seviye !== 'izle'; }), liste = st.filtre === 'dikkat' ? dik : H;
      f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Dikkat listesi', alt: SAHA ? 'Hastaneler dikkat skoruna göre; seviye olay sayısı ve açık kayıtla belirlenir' : 'Hastaneler dikkat skoruna göre; seviye olay sayısı, açık kayıt ve ceza kesintisiyle belirlenir',
        govde: h('div', null, [G.cipler([['dikkat', 'Dikkat gerektirenler', dik.length], ['tum', 'Tüm hastaneler', H.length]], st.filtre, function (k) { st.filtre = k; ciz(); }, 'Liste'),
          liste.length ? G.sayfali(liste, hastaneSatir, { n: 12 }) : G.bos({ baslik: 'Dikkat gerektiren hastane yok', metin: 'Tüm hastaneler izleme seviyesinde.' })]) })]));
      var tur = topla(H, 'tur_dagilimi_12ay'), u10 = v.urun_ilk10 || [];
      var ik = h('div', { sinif: 's41-ikili ust-bosluk' });
      if (sirali(tur).length) ik.appendChild(G.kart({ baslik: 'Şikâyet türü dağılımı', alt: 'Son 12 ay, olay sayısı', govde: yatayTur(tur, 'var(--s1)') }));
      if (u10.length) ik.appendChild(G.kart({ baslik: 'En çok şikâyet alan 10 ürün', alt: 'Olay sayısına göre', govde: G.yatay(u10.map(function (u) { return { e: u.urun, d: u.olay, renk: 'var(--s2)', etiketDeger: G.say(u.olay) }; }), { maks: u10[0].olay }) }));
      if (ik.childNodes.length) f.appendChild(ik);
      var ay = ayGrafik(v); if (ay) f.appendChild(h('div', { sinif: 'ust-bosluk' }, [ay]));
      return f;
    }
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Şikâyet verisi alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri, dk = MM.yasDk(v.asof);
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (dk == null || dk > ESKI_DK) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '.']));
      if (!(v.hastaneler || []).length) { govde.appendChild(G.bos({ baslik: 'Şikâyet kaydı yok', metin: 'Henüz hastane şikâyeti işlenmedi.' })); return; }
      if (st.sec) { var x = v.hastaneler.filter(function (k) { return k.id === st.sec; })[0]; if (x) { govde.appendChild(kartCiz(v, x)); return; } st.sec = null; }
      govde.appendChild(genel(v));
    }
    function yenile() { hata = null; yuk = null; ciz(); (SAHA ? window.MMVeri.oku('saha', 'sikayet') : window.MMVeri.oku('sikayet', 'sikayet', 'siparisler-yonetim')).then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  };
})();
