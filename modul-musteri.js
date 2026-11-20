

(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, S = MM.s41, EN = window.MM_LOC === 'en-GB', ESKI_DK = 36 * 60;
  var TIP_RENK = { 'DMO': 'var(--s1)', 'Bayi': 'var(--s2)', 'Özel hastane': 'var(--s3)', 'Devlet hastanesi': 'var(--s4)', 'İhracat': 'var(--s5)' };
  var TIP_SIRA = ['DMO', 'Bayi', 'Özel hastane', 'Devlet hastanesi', 'İhracat'];

  function tl(n) { return n == null || !isFinite(n) ? '—' : (n === 0 ? '0' : S.para(n)); }   
  function adet(n) { return n == null || !isFinite(n) ? '—' : G.say(n); }
  function yuzde(n) { return n == null || !isFinite(n) ? '—' : S.pct(n, { arti: true }); }

  MM.musteriModul = function (kok) {
    var yuk = null, hata = null, canli = true, st = { q: '', sec: null, tip: '' }, zam = null;
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    var inp = h('input', { sinif: 's41-ara', type: 'search', autocomplete: 'off', placeholder: 'Müşteri adı veya numarası ara', 'aria-label': 'Müşteri adı veya numarası ara' });
    kok.appendChild(ust); kok.appendChild(govde);

    function bantlar(v) {
      var f = document.createDocumentFragment(), dk = MM.yasDk(v.asof);
      if (v.ornek === true) f.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (dk == null || dk > ESKI_DK) f.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '.']));
      return f;
    }
    function musteriBul(v, no) { return (v.musteriler || []).filter(function (m) { return m.musteri_no === no; })[0]; }
    function git(no) { st.sec = no; ciz(); window.scrollTo && window.scrollTo(0, 0); }

    function kartCiz(v, m) {
      var f = document.createDocumentFragment(), aylar = (v.donemler && v.donemler.aylar) || [];
      f.appendChild(h('div', { sinif: 's41-geri' }, [h('button', { sinif: 'dugme ikincil', type: 'button', metin: 'Listeye dön', onclick: function () { st.sec = null; ciz(); } })]));
      f.appendChild(h('div', { sinif: 'ml-baslik' }, [h('h3', { metin: m.musteri }), h('span', { sinif: 'soluk kucuk', metin: [m.tip, m.sehir, m.ulke && m.ulke !== 'TR' ? m.ulke : null, 'No ' + m.musteri_no].filter(Boolean).join(' · ') })]));
      var d = m.degisim_yuzde;
      f.appendChild(h('div', { sinif: 'ml-kpi-izgara' }, [
        ml('Müşteri faturası (son 12 ay)', tl(m.ciro_son12), null), ml('Müşteri faturası (bu yıl)', tl(m.ciro_yil), d == null ? null : yuzde(d) + (EN ? ' vs last year' : ' geçen yıla göre')),
        ml('Sipariş adedi (12 ay)', adet(m.siparis_adedi_son12), m.ortalama_siparis_tutari ? (EN ? 'Average ' : 'Ortalama ') + tl(m.ortalama_siparis_tutari) : null),
        ml('Açık sipariş', adet(m.acik_siparis_adedi), m.acik_siparis_adedi ? tl(m.acik_siparis_tutari) : null)]));
      f.appendChild(h('div', { sinif: 'ust-bosluk s41-kart-ozet' }, [sk('İade oranı', m.iade_orani_yuzde ? S.pct(m.iade_orani_yuzde) : '—'),
        sk('Son sipariş', m.son_siparis_tarihi ? S.tarihTR(m.son_siparis_tarihi) : '—'), sk('Son siparişten geçen', m.son_siparisten_gecen_gun != null ? m.son_siparisten_gecen_gun + (EN ? ' days' : ' gün') : '—'), sk('Önceki yıl aynı dönem', tl(m.ciro_onceki_yil_ayni_donem))]));
      if (m.aylik_ciro && m.aylik_ciro.length && aylar.length === m.aylik_ciro.length && m.aylik_ciro.some(function (x) { return x; })) {
        var seri = m.aylik_ciro.map(function (x, i) { return { e: S.ayKisa(aylar[i], i === 0 || aylar[i].slice(5) === '01'), d: x, ipucu: [S.ayAd(aylar[i], true), (EN ? 'Customer invoices: ' : 'Müşteri faturası: ') + S.para(x)] }; });
        f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Müşteri faturası (son 12 ay)', alt: S.ayAd(aylar[0], true) + ' – ' + S.ayAd(aylar[aylar.length - 1], true), govde: S.bar(seri, { ad: 'Müşteri faturası (son 12 ay)', yukseklik: 170 }) })]));
      }
      var u = (m.en_cok_alinan_5_urun || []).filter(function (x) { return x.tutar > 0; });
      if (u.length) f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'En çok alınan 5 ürün', alt: 'Tutara göre', govde: G.yatay(u.map(function (x) { return { e: x.ad || x.malzeme, d: x.tutar, renk: 'var(--s1)', etiketDeger: S.para(x.tutar) }; }), { maks: u[0].tutar }) })]));
      f.appendChild(siparisKarti(m));
      return f;
    }
     
    var DURUM_METIN = { acik: 'Açık', tamam: 'Tamamlandı', bilinmiyor: 'Durum bilinmiyor', blokeli: 'Blokeli' };
    function siparisKarti(m) {
      var kap = h('div', { sinif: 'ust-bosluk' }), gov = h('div', null, [G.iskelet('kart', 1)]);
      kap.appendChild(G.kart({ baslik: 'Siparişleri', alt: 'Son 45 gün, bu müşteri adına açılan siparişler', govde: gov }));
      if (!MM.siparis || !MM.siparis.yukle) { kap.textContent = ''; return kap; }   
      MM.siparis.yukle().then(function (y) {
        if (!canli) return;
        gov.textContent = '';
        var tum = (y.r.veri.siparisler || []), anahtarli = tum.some(function (o) { return o.musteri_no; });
        if (!anahtarli) { kap.textContent = ''; return; }
        var s = tum.filter(function (o) { return o.musteri_no === m.musteri_no; }).sort(function (a, b) { return (b.gecikme_gun || 0) - (a.gecikme_gun || 0) || (b.tarih || '').localeCompare(a.tarih || ''); });
        if (!s.length) { gov.appendChild(h('p', { sinif: 'soluk', metin: 'Son 45 günde bu müşteriden sipariş yok.' })); return; }
        var ac = s.filter(function (o) { return o.durum === 'acik'; }).length, gec = s.filter(function (o) { return o.gecikme_gun; }).length;
        gov.appendChild(h('p', { sinif: 'soluk kucuk', metin: s.length + ' sipariş · ' + ac + ' açık · ' + gec + ' geciken' }));
        s.slice(0, 50).forEach(function (o) {
          var sag = o.gecikme_gun ? 'Geciken ' + o.gecikme_gun + ' gün' : (DURUM_METIN[o.durum] || o.durum);
          var alt = [o.tarih ? S.tarihTR(o.tarih) : null, o.teslim_alan, o.kalemler.length + ' kalem', y.tutar && o.tutar != null ? S.para(o.tutar) : null].filter(Boolean).join(' · ');
          var el = h('div', { sinif: 's41-satir tikla', role: 'button', tabindex: '0' }, [h('div', { sinif: 'ad', metin: 'Sipariş ' + o.no }), h('div', { sinif: 'sag', metin: sag }), h('div', { sinif: 'alt', metin: alt })]);
          var git = function () { location.hash = '#siparis/siparis/' + encodeURIComponent(o.no); };
          el.addEventListener('click', git); el.addEventListener('keydown', function (e) { if (e.key === 'Enter') git(); });
          gov.appendChild(el);
        });
        if (s.length > 50) gov.appendChild(h('p', { sinif: 'soluk kucuk', metin: 'İlk 50 gösteriliyor, toplam ' + s.length }));
      }).catch(function () { if (!canli) return; kap.textContent = ''; });
      return kap;
    }
    function ml(ad, deger, alt) { return h('div', { sinif: 'ml-kpi' }, [h('div', { sinif: 'ml-kpi-ad', metin: ad }), h('div', { sinif: 'ml-kpi-deger', metin: deger }), alt ? h('div', { sinif: 'ml-kpi-alt', metin: alt }) : null]); }
    function sk(ad, deger) { return h('div', { sinif: 's41-sayi' }, [h('small', { metin: ad }), h('b', { metin: deger })]); }

    function musteriSatir(v, m, sag, alt) {
      var el = h('div', { sinif: 's41-satir tikla', role: 'button', tabindex: '0' }, [h('div', { sinif: 'ad', metin: m.musteri }), h('div', { sinif: 'sag', metin: sag }), alt ? h('div', { sinif: 'alt', metin: alt }) : null]);
      var ac = function () { git(m.musteri_no); }; el.addEventListener('click', ac); el.addEventListener('keydown', function (e) { if (e.key === 'Enter') ac(); });
      return el;
    }
    function degisimListe(v, liste) {
      var f = h('div');
      liste.forEach(function (x) { var m = musteriBul(v, x.musteri_no) || x; f.appendChild(musteriSatir(v, m, yuzde(x.degisim_yuzde), [x.tip, S.para(x.ciro_yil) + (EN ? ' this year' : ' bu yıl'), x.ciro_onceki_yil_ayni_donem != null ? (EN ? 'last year ' : 'geçen yıl ') + S.para(x.ciro_onceki_yil_ayni_donem) : null].filter(Boolean).join(' · '))); });
      return f;
    }
    function sonuc(v) {
      var q = MM.aramaNorm(st.q.trim()), p = q.split(/\s+/);
      return (v.musteriler || []).filter(function (m) { var a = MM.aramaNorm(m.musteri + ' ' + m.musteri_no); return p.every(function (w) { return a.indexOf(w) >= 0; }); });
    }
    var sonucKok = h('div');
    function sonucCiz(v) {
      sonucKok.textContent = '';
      if (!st.q.trim()) return;
      var r = sonuc(v); if (!r.length) { sonucKok.appendChild(G.bos({ baslik: 'Eşleşen müşteri yok', metin: 'Adı ya da numarayı değiştirip tekrar deneyin.' })); return; }
      r.slice(0, 30).forEach(function (m) { sonucKok.appendChild(musteriSatir(v, m, tl(m.ciro_son12), [m.tip, m.sehir].filter(Boolean).join(' · '))); });
      if (r.length > 30) sonucKok.appendChild(h('p', { sinif: 'soluk kucuk', metin: (EN ? 'Showing first 30 of ' : 'İlk 30 gösteriliyor, toplam ') + G.say(r.length) }));
    }
    function genel(v) {
      var o = v.ozet || {}, f = document.createDocumentFragment(), M = v.musteriler || [];
      f.appendChild(h('div', { sinif: 'ml-kpi-izgara' }, [
        ml('Müşteri sayısı', adet(o.musteri_sayisi), null), ml('Müşteri faturası (son 12 ay)', tl(o.ciro_son12_tl), null),
        ml('Müşteri faturası (bu yıl)', tl(o.ciro_yil_tl), o.degisim_yuzde != null ? yuzde(o.degisim_yuzde) + (EN ? ' vs last year' : ' geçen yıla göre') : null),
        ml('Açık sipariş', adet(o.acik_siparis_adedi), o.acik_siparis_tutari_tl ? tl(o.acik_siparis_tutari_tl) : null)]));
      f.appendChild(h('div', { sinif: 'soluk kucuk', metin: 'DAY ve şirket içi satışlar hariç' }));
      f.appendChild(h('div', { sinif: 's41-bar' }, [inp, sonucKok]));
      sonucCiz(v);
      if (st.q.trim()) return f;
      var tumu = M.slice().sort(function (a, b) { return (b.ciro_son12 || 0) - (a.ciro_son12 || 0); });
      if (tumu.length) f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Müşteri listesi (' + G.say(tumu.length) + ')', alt: 'Son 12 ay müşteri faturasına göre · bir müşteriye dokununca siparişleri açılır',
        govde: G.sayfali(tumu, function (m) { return musteriSatir(v, m, tl(m.ciro_son12), [m.tip, m.sehir, m.acik_siparis_adedi ? m.acik_siparis_adedi + (EN ? ' open orders' : ' açık sipariş') : null].filter(Boolean).join(' · ')); }, { n: 15 }) })]));
      var ts = {}; M.forEach(function (m) { ts[m.tip] = (ts[m.tip] || 0) + (m.ciro_son12 > 0 ? m.ciro_son12 : 0); });
      var tipler = TIP_SIRA.filter(function (t) { return ts[t] > 0; });
      var toplam = tipler.reduce(function (a, t) { return a + ts[t]; }, 0), say = o.tip_dagilimi || {};
      if (tipler.length) f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Müşteri türüne göre müşteri faturası', alt: 'Son 12 ay', govde: h('div', null, [G.yatay(tipler.map(function (t) { return { e: t, d: ts[t], renk: TIP_RENK[t], etiketDeger: S.para(ts[t]) + ' · ' + S.pct(ts[t] / toplam * 100) + (say[t] ? ' · ' + say[t] + (EN ? ' customers' : ' müşteri') : '') }; }), { maks: Math.max.apply(null, tipler.map(function (t) { return ts[t]; })) })]) })]));
      var ilk = ((v.ust_listeler || {}).ilk20_ciro || []);
      if (ilk.length) f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'İlk 20 müşteri', alt: 'Son 12 ay müşteri faturasına göre', govde: G.yatay(ilk.map(function (x) { return { e: x.musteri, d: x.ciro_son12, renk: TIP_RENK[x.tip] || 'var(--s1)', etiketDeger: S.para(x.ciro_son12), alt: x.tip, tikla: function () { git(x.musteri_no); } }; }), { maks: ilk[0].ciro_son12 }) })]));
      var UL = v.ust_listeler || [];
      var buy = UL.en_hizli_buyuyen10 || [], dus = UL.en_hizli_dusen10 || [];
      var ikili = h('div', { sinif: 's41-ikili ust-bosluk' });
      if (buy.length) ikili.appendChild(G.kart({ baslik: 'En hızlı büyüyen 10', alt: 'Bu yıl, geçen yılın aynı dönemine göre', govde: degisimListe(v, buy) }));
      if (dus.length) ikili.appendChild(G.kart({ baslik: 'En hızlı düşen 10', alt: 'Bu yıl, geçen yılın aynı dönemine göre', govde: degisimListe(v, dus) }));
      if (ikili.childNodes.length) f.appendChild(ikili);
      var yok = UL['sipariş_vermeyen_90_gun'] || [], yokTop = UL['sipariş_vermeyen_90_gun_toplam'];
      if (yok.length) f.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: '90 gündür sipariş vermeyen müşteriler', alt: (yokTop ? G.say(yokTop) + (EN ? ' customers' : ' müşteri') + ' · ' : '') + 'son 12 ay müşteri faturası büyükten küçüğe',
        govde: G.sayfali(yok, function (x) { var m = musteriBul(v, x.musteri_no) || x; return musteriSatir(v, m, x.gun + (EN ? ' days' : ' gün'), [x.tip, x.son_siparis_tarihi ? (EN ? 'last order ' : 'son sipariş ') + S.tarihTR(x.son_siparis_tarihi) : null, S.para(x.ciro_son12) + (EN ? ' in 12 months' : ' (12 ay)')].filter(Boolean).join(' · ')); }, { n: 15 }) })]));
      return f;
    }
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Müşteri raporu alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri; ust.appendChild(bantlar(v));
      if (!(v.musteriler || []).length) { govde.appendChild(G.bos({ baslik: 'Müşteri verisi yok', metin: 'Henüz müşteri raporu hazırlanmadı.' })); return; }
      if (st.sec) { var m = musteriBul(v, st.sec); if (m) { govde.appendChild(kartCiz(v, m)); return; } st.sec = null; }
      govde.appendChild(genel(v));
    }
    inp.addEventListener('input', function () { clearTimeout(zam); zam = setTimeout(function () { st.q = inp.value; if (yuk) { var pos = inp.selectionStart; ciz(); var y = govde.querySelector('.s41-ara'); if (y) { y.focus(); try { y.setSelectionRange(pos, pos); } catch (e) { } } } }, 150); });
     
    function adTemizle(v) {
      if (!v) return;
      var d = function (x) { if (x && typeof x.musteri === 'string') x.musteri = x.musteri.replace(/^\(isim[^)]*\)\s*/i, 'Müşteri '); };
      (v.musteriler || []).forEach(d);
      var u = v.ust_listeler || {};
      Object.keys(u).forEach(function (k) { if (Array.isArray(u[k])) u[k].forEach(d); });
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('siparisler', 'musteri-rapor', 'siparisler-yonetim').then(function (r) { adTemizle(r && r.veri); yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; clearTimeout(zam); };
  };
})();
