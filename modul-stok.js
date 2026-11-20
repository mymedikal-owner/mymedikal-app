

(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, S = MM.s41, EN = window.MM_LOC === 'en-GB', ESKI_DK = 36 * 60, ILK = 40, ADIM = 80;

  function degerYetkisi() {
    if (window.MMVeri.mod() === 'graph') return !!window.MMVeri.ozelErisim('siparisler-yonetim');   
    return ['yonetim', 'finans', 'muhasebe'].indexOf(MM.rol()) >= 0;
  }
  function sayiYaz(n, br) { if (n == null || !isFinite(n) || n < 0) return '—'; return G.say(n, n % 1 && n < 100 ? 2 : 0) + (br ? ' ' + br : ''); }
  function kalanGun(skt) {
    if (!skt) return null; var p = String(skt).slice(0, 10).split('-'), b = Date.UTC(+p[0], +p[1] - 1, +p[2]), t = new Date();
    return Math.round((b - Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())) / 864e5);
  }

  MM.moduller.stok = function (kok) {
    var yuk = null, hata = null, canli = true, zamanlayici = null, degerVeri = null;
    var st = { q: '', sirket: '', depo: '', skt: '', grup: '', n: ILK }, satirlar = [], depolar = [];
    var GRUPLAR = [['spanc', 'Spanç'], ['batin', 'Batın'], ['gazli_bez', 'Gazlı bez'], ['eldiven', 'Eldiven'], ['diger', 'Diğer']], GRUP_KOD = { '1002': 'gazli_bez', '1003': 'batin', '1004': 'spanc', '1006': 'eldiven' };
    function grupBul(kod, ad, ug) {   
      if (GRUP_KOD[ug]) return GRUP_KOD[ug];
      if (ug === '1001') { var n = MM.aramaNorm(ad || ''); if (n.indexOf('spanc') >= 0) return 'spanc'; if (n.indexOf('batin') >= 0) return 'batin'; if (n.indexOf('gazli bez') >= 0) return 'gazli_bez'; }
      return 'diger';
    }
    var sekmeKok = h('div', { sinif: 's44-grup' });
    kok.appendChild(G.sayfaBasi({ baslik: 'Stok', alt: 'Depo, lot ve son kullanma tarihi', kirinti: [['Stok']] }));
    var ust = h('div'), ozetKok = h('div'), aramaKok = h('div'), liste = h('div', { 'aria-live': 'polite' }), govde = h('div');
    var inp = h('input', { sinif: 's41-ara', type: 'search', autocomplete: 'off', placeholder: 'Malzeme kodu, ad veya lot ara', 'aria-label': 'Malzeme kodu, ad veya lot ara' });
    var sel = h('select', { sinif: 's41-ara', 'aria-label': 'Depo yeri' });
    kok.appendChild(ust); kok.appendChild(govde);

    function hazirla(v) {
      var K = v.kolonlar, ix = {}; K.forEach(function (k, i) { ix[k] = i; });
      var dv = degerVeri, dg = dv && dv.deger && dv.deger.satirlar ? dv.deger.satirlar : null, dmap = {};
      satirlar = v.kalemler.map(function (r, i) {
        var o = { kod: r[ix.malzeme], ad: r[ix.ad], sirket: r[ix.sirket], depoKod: r[ix.depo_yeri] || '', depoAd: r[ix.depo_adi] || '', lot: r[ix.lot] || '', skt: r[ix.skt], serbest: r[ix.serbest], kalite: r[ix.kalite], bloke: r[ix.bloke], birim: r[ix.birim], deger: dg && dg[i] && !dg[i][3] ? dg[i][1] : null, fiyatKontrol: !!(dg && dg[i] && dg[i][3]) };
        o.grup = (ix.grup != null && r[ix.grup]) || grupBul(o.kod, o.ad, ix.urun_grubu != null ? r[ix.urun_grubu] : '');
        o.kalan = kalanGun(o.skt); o.anahtar = MM.aramaNorm(o.kod + ' ' + o.ad + ' ' + o.lot);
        if (o.depoKod && !dmap[o.depoKod]) dmap[o.depoKod] = o.depoAd || o.depoKod;
        return o;
      });
      depolar = Object.keys(dmap).sort().map(function (k) { return [k, dmap[k] + ' (' + k + ')']; });
    }
    function suz() {
      var q = MM.aramaNorm(st.q.trim()), p = q ? q.split(/\s+/) : [];
      return satirlar.filter(function (o) {
        if (st.sirket && o.sirket !== st.sirket) return false;
        if (st.grup && o.grup !== st.grup) return false;
        if (st.depo && o.depoKod !== st.depo) return false;
        if (st.skt === 'yaklasan' && !(o.kalan != null && o.kalan >= 0 && o.kalan <= 90)) return false;
        if (st.skt === 'gecmis' && !(o.kalan != null && o.kalan < 0)) return false;
        for (var i = 0; i < p.length; i++) if (o.anahtar.indexOf(p[i]) < 0) return false;
        return true;
      });
    }
    function sktYaz(o) {
      if (o.kalan == null) return h('span', { sinif: 'soluk', metin: '—' });
      if (o.kalan < 0) return h('span', { sinif: 's41-skt-gecmis', metin: 'SKT ' + S.tarihTR(o.skt) + ' · ' + Math.abs(o.kalan) + (EN ? ' days past' : ' gün geçti') });
      if (o.kalan <= 90) return h('span', { sinif: 's41-skt-uyari', metin: 'SKT ' + S.tarihTR(o.skt) + ' · ' + o.kalan + (EN ? ' days left' : ' gün kaldı') });
      return h('span', { metin: 'SKT ' + S.tarihTR(o.skt) });
    }
    function satirCiz(o) {
      var miktar = h('div', { sinif: 's41-miktar' }, [h('span', { metin: 'Serbest ' + sayiYaz(o.serbest, o.birim) }), h('span', { metin: 'Kalite ' + sayiYaz(o.kalite, o.birim) }), h('span', { metin: 'Bloke ' + sayiYaz(o.bloke, o.birim) })]);
      var sag = h('div', { sinif: 'sag' }, [sktYaz(o)]);
      var alt = [o.kod, o.sirket, o.depoAd ? o.depoAd + (o.depoKod ? ' (' + o.depoKod + ')' : '') : (o.depoKod || null), o.lot ? 'Lot ' + o.lot : null].filter(Boolean).join(' · ');
      var el = h('div', { sinif: 's41-satir' }, [h('div', { sinif: 'ad', metin: o.ad || o.kod }), sag, h('div', { sinif: 'alt', metin: alt }), h('div', { sinif: 'alt' }, [miktar])]);
      if (o.deger != null && o.deger > 0) el.appendChild(h('div', { sinif: 'alt', metin: (EN ? 'Stock value ' : 'Stok değeri ') + S.para(o.deger) }));
      else if (o.fiyatKontrol) el.appendChild(h('div', { sinif: 'alt', metin: EN ? 'Price under review' : 'Fiyat kontrol edilecek' }));
      return el;
    }
    function listeCiz() {
      liste.textContent = '';
      var f = suz();
      if (!f.length) { liste.appendChild(G.bos({ baslik: 'Eşleşen stok yok', metin: 'Aramayı ya da süzgeçleri değiştirin.' })); return; }
      liste.appendChild(h('div', { sinif: 'soluk kucuk', metin: G.say(f.length) + (EN ? ' lines' : ' satır') }));
      f.slice(0, st.n).forEach(function (o) { liste.appendChild(satirCiz(o)); });
      if (f.length > st.n) liste.appendChild(h('button', { sinif: 'dugme ikincil', type: 'button', metin: 'Daha fazla göster', onclick: function () { st.n += ADIM; listeCiz(); } }));
    }
    function sayiKutu(ad, deger, tikla) {
      var el = h('div', { sinif: 's41-sayi' }, [h('small', { metin: ad }), h('b', { metin: deger })]);
      if (tikla) { el.classList.add('tikla'); el.style.cursor = 'pointer'; el.setAttribute('role', 'button'); el.tabIndex = 0; el.addEventListener('click', tikla); el.addEventListener('keydown', function (e) { if (e.key === 'Enter') tikla(); }); }
      return el;
    }
    function ozetCiz(v) {
      ozetKok.textContent = ''; var o = v.ozet || {}, dgo = degerVeri && degerVeri.deger_ozet, dg = dgo && dgo.toplam_stok_degeri;
      var k = [sayiKutu('Kalem sayısı', G.say(o.kalem_sayisi != null ? o.kalem_sayisi : satirlar.length)),
        sayiKutu('SKT 90 gün içinde', G.say(o.skt_90_gun_icinde), function () { st.skt = 'yaklasan'; st.n = ILK; hepsi(); }),
        sayiKutu('SKT geçmiş', G.say(o.skt_gecmis), function () { st.skt = 'gecmis'; st.n = ILK; hepsi(); }),
        sayiKutu('Yavaş dönen', G.say(o.yavas_donen_kalem))];
      if (dg) k.push(sayiKutu('Toplam stok değeri', S.para(dg)));
      ozetKok.appendChild(h('div', { sinif: 's41-kart-ozet' }, k));
      if (dg) {
        var fk = dgo.fiyat_teyit_bekleyen_kalem || 0, dk = dgo.degerlenemeyen_kalem || 0;
        if (fk || dk) ozetKok.appendChild(h('div', { sinif: 'soluk kucuk', metin: EN ? ('Not in the total: ' + G.say(fk) + ' items with price under review, ' + G.say(dk) + ' items without a value') : ('Toplamda yer almayan: fiyatı kontrol edilecek ' + G.say(fk) + ' kalem, değeri girilmemiş ' + G.say(dk) + ' kalem') }));
      }
    }
    function aramaCiz(v) {
      aramaKok.textContent = '';
      var sirk = Object.keys((v.ozet && v.ozet.sirket_kalem) || {}), sayim = function (fn) { return satirlar.filter(fn).length; };
      if (sirk.length > 1) aramaKok.appendChild(G.cipler([['', 'Tümü', satirlar.length]].concat(sirk.map(function (s) { return [s, s, sayim(function (o) { return o.sirket === s; })]; })), st.sirket, function (k) { st.sirket = k; st.n = ILK; hepsi(); }, 'Şirket'));
      aramaKok.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'Tüm SKT durumları'], ['yaklasan', 'SKT yaklaşan'], ['gecmis', 'SKT geçmiş']], st.skt, function (k) { st.skt = k; st.n = ILK; hepsi(); }, 'SKT durumu')]));
      sel.textContent = ''; sel.appendChild(h('option', { value: '', metin: 'Tüm depolar' }));
      depolar.forEach(function (d) { var op = h('option', { value: d[0], metin: d[1] }); sel.appendChild(op); });
      sel.value = st.depo;
      aramaKok.appendChild(h('div', { sinif: 'ust-bosluk' }, [sel]));
    }
    function sekmeCiz() {   
      sekmeKok.textContent = '';
      var say = {}; satirlar.forEach(function (o) { say[o.grup] = (say[o.grup] || 0) + 1; });
      var l = [['', 'Tümü', G.say(satirlar.length)]].concat(GRUPLAR.map(function (g) { return [g[0], g[1], G.say(say[g[0]] || 0)]; }));
      sekmeKok.appendChild(G.cipler(l, st.grup,function (k) { st.grup = k; st.n = ILK; sekmeCiz(); listeCiz(); }, 'Ürün grubu'));
    }
    function hepsi() { aramaCiz(yuk.veri); listeCiz(); }
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Stok alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri;
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      var dk = MM.yasDk(v.uretim_zamani || v.guncelleme);
      if (dk == null || dk > ESKI_DK) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '. Miktarlar güncel olmayabilir.']));
      if (!v.kalemler || !v.kalemler.length) { govde.appendChild(G.bos({ baslik: 'Stok kaydı yok', metin: 'Henüz stok verisi hazırlanmadı.' })); return; }
      hazirla(v); ozetCiz(v); aramaCiz(v);
      sekmeCiz(); govde.appendChild(sekmeKok); govde.appendChild(ozetKok); govde.appendChild(h('div', { sinif: 's41-bar' }, [inp, aramaKok])); govde.appendChild(liste);
      listeCiz();
    }
    inp.addEventListener('input', function () { clearTimeout(zamanlayici); zamanlayici = setTimeout(function () { st.q = inp.value; st.n = ILK; listeCiz(); }, 120); });
    sel.addEventListener('change', function () { st.depo = sel.value; st.n = ILK; listeCiz(); });
    function yenile() {
      hata = null; yuk = null; degerVeri = null; ciz();
      window.MMVeri.oku('stok', 'stok').then(function (r) { yuk = r; hata = null; })
        .then(function () { return degerYetkisi() ? window.MMVeri.oku('stok', 'stok-deger', 'siparisler-yonetim').then(function (d) { degerVeri = d && d.veri; }).catch(function () { degerVeri = null; }) : null; })   
        .catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); });
    }
    yenile();
    return function () { canli = false; clearTimeout(zamanlayici); };
  };
})();
