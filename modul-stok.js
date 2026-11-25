


(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr, S = MM.s41, EN = window.MM_LOC === 'en-GB', ESKI_DK = 36 * 60, ILK = 40, ADIM = 80;
  function T(tr, en) { return EN ? en : tr; }

  function degerYetkisi() {
    if (window.MMVeri.mod() === 'graph') return !!window.MMVeri.ozelErisim('dmo-maliyet');   
    return ['yonetim', 'finans', 'muhasebe'].indexOf(MM.rol()) >= 0;
  }
  function sayiYaz(n, br) { if (n == null || !isFinite(n) || n < 0) return '—'; return G.say(n, n % 1 && n < 100 ? 2 : 0) + (br ? ' ' + br : ''); }
  function kalanGun(skt) {
    if (!skt) return null; var p = String(skt).slice(0, 10).split('-'), b = Date.UTC(+p[0], +p[1] - 1, +p[2]), t = new Date();
    return Math.round((b - Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())) / 864e5);
  }
  function tarihYaz(d) { if (!d) return ''; var p = String(d).slice(0, 10).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : String(d); }

  MM.moduller.stok = function (kok) {
    var yuk = null, hata = null, canli = true, zamanlayici = null, degerVeri = null;
    var st = { q: '', sirket: '', depo: '', skt: '', grup: '', tur: '', isaret: '', gorunum: 'parti', talepDurum: '', n: ILK }, satirlar = [], depolar = [];
    var GRUPLAR = [['spanc', 'Spanç'], ['batin', 'Batın'], ['gazli_bez', 'Gazlı bez'], ['eldiven', 'Eldiven'], ['diger', 'Diğer']], GRUP_KOD = { '1002': 'gazli_bez', '1003': 'batin', '1004': 'spanc', '1006': 'eldiven' };
    var TURLER = [['mamul', T('Mamul', 'Finished goods')], ['ticari', T('Ticari mal', 'Trade goods')], ['iplik', T('İplik / open-end', 'Yarn / open-end')], ['hammadde', T('Hammadde', 'Raw material')], ['diger', T('Diğer', 'Other')]];
    function turAd(k) { for (var i = 0; i < TURLER.length; i++) if (TURLER[i][0] === k) return TURLER[i][1]; return k; }
    function grupBul(kod, ad, ug) {   
      if (GRUP_KOD[ug]) return GRUP_KOD[ug];
      if (ug === '1001') { var n = MM.aramaNorm(ad || ''); if (n.indexOf('spanc') >= 0) return 'spanc'; if (n.indexOf('batin') >= 0) return 'batin'; if (n.indexOf('gazli bez') >= 0) return 'gazli_bez'; }
      return 'diger';
    }
    var segKok = h('div'), tumu = false, segMod = '';   
    kok.appendChild(G.sayfaBasi({ baslik: 'Stok', alt: 'Depo, lot ve son kullanma tarihi', kirinti: [['Stok']] }));
    var ust = h('div'), ozetKok = h('div'), aracKok = h('div'), araKok = h('div'), liste = h('div', { 'aria-live': 'polite' }), govde = h('div');
    var ARA_YER = T('Malzeme kodu, ad, lot, EAN veya talep no ara', 'Search material code, name, batch, EAN or requisition no.');
    kok.appendChild(ust); kok.appendChild(govde);
    function sifirla() { st.n = ILK; tumu = false; }

    function hazirla(v) {
      var K = v.kolonlar, ix = {}; K.forEach(function (k, i) { ix[k] = i; });
      var dv = degerVeri, dg = dv && dv.deger && dv.deger.satirlar ? dv.deger.satirlar : null, dmap = {};
      function al(r, ad) { return ix[ad] != null ? r[ix[ad]] : null; }
      satirlar = v.kalemler.map(function (r, i) {
        var o = { kod: r[ix.malzeme], ad: r[ix.ad], sirket: r[ix.sirket], depoKod: r[ix.depo_yeri] || '', depoAd: r[ix.depo_adi] || '', lot: r[ix.lot] || '', skt: r[ix.skt], serbest: r[ix.serbest], kalite: r[ix.kalite], bloke: r[ix.bloke], birim: r[ix.birim], deger: dg && dg[i] && !dg[i][3] ? dg[i][1] : null, fiyatKontrol: !!(dg && dg[i] && dg[i][3]) };
        o.grup = (ix.grup != null && r[ix.grup]) || grupBul(o.kod, o.ad, ix.urun_grubu != null ? r[ix.urun_grubu] : '');
        o.tur = al(r, 'tur') || 'diger'; o.ean = al(r, 'ean') || ''; o.tedLot = al(r, 'tedarikci_lot') || ''; o.lotTarihi = al(r, 'lot_tarihi') || ''; o.talep = al(r, 'satinalma_talep') || '';
        o.hareketsizGun = al(r, 'hareketsiz_gun'); o.hareketsiz = !!al(r, 'hareketsiz'); o.planda = !!al(r, 'planda');
        o.lotHata = !!o.lot && !/^[0-9]{10}$/.test(o.lot);   
        o.kalan = kalanGun(o.skt); o.anahtar = MM.aramaNorm([o.kod, o.ad, o.lot, o.ean, o.tedLot, o.talep].join(' '));
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
        if (st.tur && o.tur !== st.tur) return false;
        if (st.depo && o.depoKod !== st.depo) return false;
        if (st.skt === 'yaklasan' && !(o.kalan != null && o.kalan >= 0 && o.kalan <= 90)) return false;
        if (st.skt === 'gecmis' && !(o.kalan != null && o.kalan < 0)) return false;
        if (st.isaret === 'hareketsiz' && !o.hareketsiz) return false;
        if (st.isaret === 'plan' && !o.planda) return false;
        if (st.isaret === 'lothata' && !o.lotHata) return false;
        for (var i = 0; i < p.length; i++) if (o.anahtar.indexOf(p[i]) < 0) return false;
        return true;
      });
    }
    function sktYaz(o) {
      if (o.kalan == null) return h('span', { sinif: 'soluk', metin: '—' });
      if (o.kalan < 0) { var g = h('span', { sinif: 's41-skt-gecmis', metin: '⚠ SKT ' + S.tarihTR(o.skt) + ' · ' + Math.abs(o.kalan) + (EN ? ' days past' : ' gün geçti') }); g.style.color = '#c62828'; g.style.fontWeight = '700'; return g; }
      if (o.kalan <= 90) return h('span', { sinif: 's41-skt-uyari', metin: 'SKT ' + S.tarihTR(o.skt) + ' · ' + o.kalan + (EN ? ' days left' : ' gün kaldı') });
      return h('span', { metin: 'SKT ' + S.tarihTR(o.skt) });
    }
    function rozet(metin, renk, baslik) {
      var e = h('span', { metin: metin, title: baslik || metin }); e.style.cssText = 'display:inline-block;margin:2px 6px 0 0;padding:1px 7px;border-radius:9px;font-size:.78em;font-weight:600;color:' + renk + ';border:1px solid ' + renk;
      return e;
    }
    function isaretler(o, urunMu) {   
      var l = [];
      if (o.lotHata) l.push(rozet('⚠ ' + T('Lot 10 hane değil', 'Batch is not 10 digits'), '#c62828'));
      if (o.hareketsiz) l.push(rozet(T('Ürün 60+ gün hareketsiz', 'Product inactive 60+ days') + (o.hareketsizGun != null ? ' · ' + o.hareketsizGun + (EN ? ' d' : ' gün') : ''), '#7a7a7a', T('Bu parti değil, malzeme × tesis düzeyinde: ürünün son mal hareketi 60 günden eski. Ürün toplamı görünümünde de görünür.', 'Not this batch: at material × plant level the last stock movement is older than 60 days. Also shown in the Product totals view.')));
      if (o.planda) l.push(rozet('★ ' + T('Üretim planında', 'In production plan'), '#1565c0', T('Bu malzeme + lot açık üretim siparişinde hâlâ bekliyor', 'This material + batch is still pending in an open production order')));
      return l.length ? h('div', { sinif: 'alt' }, l) : null;
    }
    function satirCiz(o) {
      var miktar = h('div', { sinif: 's41-miktar' }, [h('span', { metin: 'Serbest ' + sayiYaz(o.serbest, o.birim) }), h('span', { metin: 'Kalite ' + sayiYaz(o.kalite, o.birim) }), h('span', { metin: 'Bloke ' + sayiYaz(o.bloke, o.birim) })]);
      var sag = h('div', { sinif: 'sag' }, [sktYaz(o)]);
      var alt = [o.kod, o.sirket, o.depoAd ? o.depoAd + (o.depoKod ? ' (' + o.depoKod + ')' : '') : (o.depoKod || null), o.lot ? 'Lot ' + o.lot : null, turAd(o.tur)].filter(Boolean).join(' · ');
      var ad = (o.planda ? '★ ' : '') + (o.ad || o.kod);
      var el = h('div', { sinif: 's41-satir' }, [h('div', { sinif: 'ad', metin: ad }), sag, h('div', { sinif: 'alt', metin: alt }), h('div', { sinif: 'alt' }, [miktar])]);
      var ek = [o.ean ? 'EAN/UBB ' + o.ean : null, o.tedLot ? T('Tedarikçi lotu ', 'Supplier batch ') + o.tedLot : null, o.lotTarihi ? T('Parti tarihi ', 'Batch created ') + tarihYaz(o.lotTarihi) : null, o.talep ? T('Talep no ', 'Requisition no. ') + o.talep : null].filter(Boolean).join(' · ');
      if (ek) el.appendChild(h('div', { sinif: 'alt', metin: ek }));
      var isr = isaretler(o); if (isr) el.appendChild(isr);
      if (o.kalan != null && o.kalan < 0) { el.style.borderLeft = '4px solid #c62828'; el.style.background = 'rgba(198,40,40,.10)'; }   
      if (o.deger != null && o.deger > 0) el.appendChild(h('div', { sinif: 'alt', metin: (EN ? 'Stock value ' : 'Stok değeri ') + S.para(o.deger) }));
      else if (o.fiyatKontrol) el.appendChild(h('div', { sinif: 'alt', metin: EN ? 'Price under review' : 'Fiyat kontrol edilecek' }));
      return el;
    }
    function urunlereTopla(f) {   
      var m = {}, sira = [];
      f.forEach(function (o) {
        var k = o.kod + '|' + o.sirket, u = m[k];
        if (!u) { u = m[k] = { kod: o.kod, ad: o.ad, sirket: o.sirket, tur: o.tur, birim: o.birim, ean: o.ean, serbest: 0, kalite: 0, bloke: 0, parti: 0, gecmis: 0, planda: 0, hareketsiz: false, lotHata: 0, enKalan: null, deger: null }; sira.push(u); }
        u.serbest += o.serbest || 0; u.kalite += o.kalite || 0; u.bloke += o.bloke || 0; u.parti++;
        if (o.kalan != null && o.kalan < 0) u.gecmis++;
        if (o.kalan != null && (u.enKalan == null || o.kalan < u.enKalan)) u.enKalan = o.kalan;
        if (o.planda) u.planda++; if (o.hareketsiz) u.hareketsiz = true; if (o.lotHata) u.lotHata++;
        if (o.deger != null) u.deger = (u.deger || 0) + o.deger;
      });
      return sira;
    }
    function urunCiz(u) {
      var miktar = h('div', { sinif: 's41-miktar' }, [h('span', { metin: 'Serbest ' + sayiYaz(u.serbest, u.birim) }), h('span', { metin: 'Kalite ' + sayiYaz(u.kalite, u.birim) }), h('span', { metin: 'Bloke ' + sayiYaz(u.bloke, u.birim) })]);
      var skt = u.enKalan == null ? h('span', { sinif: 'soluk', metin: '—' }) : (u.enKalan < 0 ? (function () { var e = h('span', { sinif: 's41-skt-gecmis', metin: '⚠ ' + u.gecmis + T(' parti SKT geçmiş', ' batches past expiry') }); e.style.color = '#c62828'; e.style.fontWeight = '700'; return e; })() : h('span', { sinif: u.enKalan <= 90 ? 's41-skt-uyari' : '', metin: T('En yakın SKT ', 'Nearest expiry ') + u.enKalan + (EN ? ' days' : ' gün') }));
      var alt = [u.kod, u.sirket, u.parti + T(' parti', ' batches'), turAd(u.tur), u.ean ? 'EAN/UBB ' + u.ean : null].filter(Boolean).join(' · ');
      var el = h('div', { sinif: 's41-satir' }, [h('div', { sinif: 'ad', metin: (u.planda ? '★ ' : '') + (u.ad || u.kod) }), h('div', { sinif: 'sag' }, [skt]), h('div', { sinif: 'alt', metin: alt }), h('div', { sinif: 'alt' }, [miktar])]);
      var l = [];
      if (u.lotHata) l.push(rozet('⚠ ' + u.lotHata + T(' partide lot 10 hane değil', ' batches not 10 digits'), '#c62828'));
      if (u.hareketsiz) l.push(rozet(T('60+ gün hareketsiz', '60+ days inactive'), '#b26a00'));
      if (u.planda) l.push(rozet('★ ' + u.planda + T(' parti üretim planında', ' batches in production plan'), '#1565c0'));
      if (l.length) el.appendChild(h('div', { sinif: 'alt' }, l));
      if (u.enKalan != null && u.gecmis) { el.style.borderLeft = '4px solid #c62828'; el.style.background = 'rgba(198,40,40,.10)'; }
      if (u.deger != null && u.deger > 0) el.appendChild(h('div', { sinif: 'alt', metin: (EN ? 'Stock value ' : 'Stok değeri ') + S.para(u.deger) }));
      return el;
    }
    function araToplamCiz(f, urunler) {   
      araKok.textContent = '';
      if (!f.length) return;
      var g = {}, sira = [];
      f.forEach(function (o) { var t = g[o.tur]; if (!t) { t = g[o.tur] = { urun: {}, satir: 0, b: {} }; sira.push(o.tur); }
        t.urun[o.kod + '|' + o.sirket] = 1; t.satir++;
        var b = t.b[o.birim || ''] || (t.b[o.birim || ''] = [0, 0, 0]); b[0] += o.serbest || 0; b[1] += o.kalite || 0; b[2] += o.bloke || 0; });
      sira.sort(function (a, b) { return Object.keys(g[b].urun).length - Object.keys(g[a].urun).length; });
      var satirlarEl = sira.map(function (tk) {
        var t = g[tk], br = Object.keys(t.b).map(function (k) { var b = t.b[k]; return sayiYaz(b[0], k) + ' ' + T('serbest', 'free') + ' · ' + sayiYaz(b[1], k) + ' ' + T('kalite', 'QI') + ' · ' + sayiYaz(b[2], k) + ' ' + T('bloke', 'blocked'); });
        return h('div', { sinif: 'alt' }, [h('strong', { metin: turAd(tk) + ': ' }), Object.keys(t.urun).length + T(' ürün, ', ' products, ') + G.say(t.satir) + T(' satır', ' lines') + (br.length ? ' — ' + br.slice(0, 3).join(' | ') + (br.length > 3 ? ' …' : '') : '')]);
      });
      var dt = h('details', { sinif: 's41-kart-ozet ust-bosluk' }, [h('summary', {}, [h('strong', { metin: st.tur ? T('Ara toplam — ', 'Subtotal — ') + turAd(st.tur) : T('Ara toplam (türe göre)', 'Subtotal (by material type)') })]), h('div', {}, satirlarEl)]);
      dt.style.display = 'block'; araKok.appendChild(dt);
    }
    var TALEP_DURUM = { acik: [T('Açık', 'Open'), '#b26a00'], kismi: [T('Kısmen siparişe döndü', 'Partly ordered'), '#1565c0'], siparis: [T('Siparişe döndü', 'Ordered'), '#2e7d32'] };
    function talepCiz() {   
      liste.textContent = ''; araKok.textContent = '';
      var tv = yuk.veri.satinalma_talepleri;
      if (!tv || !tv.satirlar) { liste.appendChild(G.bos({ baslik: T('Satınalma talebi verisi yok', 'No requisition data'), metin: T('Veri bir sonraki güncellemede gelir.', 'Data arrives with the next refresh.') })); return; }
      var ix = {}; tv.kolonlar.forEach(function (k, i) { ix[k] = i; });
      var q = MM.aramaNorm(st.q.trim()), p = q ? q.split(/\s+/) : [];
      var f = tv.satirlar.filter(function (r) {
        if (st.talepDurum && r[ix.durum] !== st.talepDurum) return false;
        var a = MM.aramaNorm([r[ix.talep], r[ix.malzeme], r[ix.ad], (r[ix.siparisler] || []).join(' ')].join(' '));
        for (var i = 0; i < p.length; i++) if (a.indexOf(p[i]) < 0) return false;
        return true;
      });
      var say = { acik: 0, kismi: 0, siparis: 0 }; tv.satirlar.forEach(function (r) { say[r[ix.durum]]++; });
      if (segMod !== 'talep') { segMod = 'talep'; segCiz(tv, say); }
      liste.appendChild(h('div', { sinif: 'soluk kucuk ust-bosluk', metin: G.say(f.length) + T(' talep kalemi · son 180 gün (', ' requisition items · last 180 days (') + tarihYaz(tv.pencere_baslangic) + T(' sonrası) · yalnız görüntüleme', ' onward) · view only') }));
      if (!f.length) { liste.appendChild(G.bos({ baslik: T('Eşleşen talep yok', 'No matching requisition'), metin: T('Aramayı ya da süzgeci değiştirin.', 'Change the search or filter.') })); return; }
      function talepSatir(r) {
        var d = TALEP_DURUM[r[ix.durum]] || ['', '#7a7a7a'], br = r[ix.birim];
        var pos = r[ix.siparisler] || [];
        var alt = [r[ix.malzeme], T('Talep tarihi ', 'Created ') + tarihYaz(r[ix.talep_tarihi]), r[ix.teslim_tarihi] ? T('İstenen teslim ', 'Requested delivery ') + tarihYaz(r[ix.teslim_tarihi]) : null].filter(Boolean).join(' · ');
        var mik = T('Talep ', 'Requested ') + sayiYaz(r[ix.miktar], br) + ' · ' + T('Siparişe dönen ', 'Ordered ') + sayiYaz(r[ix.siparis_miktar], br);
        var el = h('div', { sinif: 's41-satir' }, [h('div', { sinif: 'ad', metin: (r[ix.ad] || r[ix.malzeme]) }), h('div', { sinif: 'sag' }, [rozet(d[0], d[1])]),
          h('div', { sinif: 'alt', metin: T('Talep ', 'Req. ') + r[ix.talep] + ' / ' + r[ix.kalem] + ' · ' + alt }), h('div', { sinif: 'alt', metin: mik }),
          h('div', { sinif: 'alt', metin: pos.length ? T('Sipariş no ', 'PO no. ') + pos.join(', ') : T('Siparişe dönüşmedi', 'Not yet converted to a PO') })]);
        if (r[ix.onay_bekliyor]) el.appendChild(h('div', { sinif: 'alt' }, [rozet(T('Onay bekliyor', 'Awaiting release'), '#b26a00')]));
        return el;
      }
      if (!tumu) { liste.appendChild(G.ilkN(f, talepSatir, { n: 10, tumuFn: function () { tumu = true; listeCiz(); } })); return; }
      f.slice(0, st.n).forEach(function (r) { liste.appendChild(talepSatir(r)); });
      if (f.length > st.n) liste.appendChild(h('button', { sinif: 'dugme ikincil', type: 'button', metin: T('Daha fazla göster', 'Show more'), onclick: function () { st.n += ADIM; listeCiz(); } }));
    }
    function segCiz(tv, say) {   
      segKok.textContent = '';
      if (tv) { segKok.appendChild(G.segment([['', T('Tümü', 'All'), G.say(tv.satirlar.length)], ['acik', TALEP_DURUM.acik[0], G.say(say.acik)], ['kismi', TALEP_DURUM.kismi[0], G.say(say.kismi)], ['siparis', TALEP_DURUM.siparis[0], G.say(say.siparis)]], st.talepDurum, function (k) { st.talepDurum = k; sifirla(); listeCiz(); }, T('Talep durumu', 'Requisition status'))); return; }
      var sy = {}; satirlar.forEach(function (o) { sy[o.tur] = (sy[o.tur] || 0) + 1; });
      segKok.appendChild(G.segment([['', 'Tümü', G.say(satirlar.length)]].concat(TURLER.map(function (t) { return [t[0], t[1], G.say(sy[t[0]] || 0)]; })), st.tur, function (k) { st.tur = k; sifirla(); listeCiz(); }, T('Malzeme türü', 'Material type')));
    }
    function listeCiz() {
      var talepModu = st.gorunum === 'talep';
      ozetKok.style.display = talepModu ? 'none' : '';
      if (talepModu) { talepCiz(); return; }
      if (segMod !== 'stok') { segMod = 'stok'; segCiz(null); }
      liste.textContent = '';
      var f = suz();
      if (!f.length) { araKok.textContent = ''; liste.appendChild(G.bos({ baslik: 'Eşleşen stok yok', metin: 'Aramayı ya da süzgeçleri değiştirin.' })); return; }
      var u = st.gorunum === 'urun' ? urunlereTopla(f) : null;
      araToplamCiz(f, u);
      var n = u ? u.length : f.length;
      liste.appendChild(h('div', { sinif: 'soluk kucuk', metin: G.say(n) + (u ? T(' ürün', ' products') : (EN ? ' lines' : ' satır')) }));
      if (!tumu) { liste.appendChild(G.ilkN(u || f, u ? urunCiz : satirCiz, { n: 10, tumuFn: function () { tumu = true; listeCiz(); } })); return; }
      (u || f).slice(0, st.n).forEach(function (o) { liste.appendChild(u ? urunCiz(o) : satirCiz(o)); });
      if (n > st.n) liste.appendChild(h('button', { sinif: 'dugme ikincil', type: 'button', metin: 'Daha fazla göster', onclick: function () { st.n += ADIM; listeCiz(); } }));
    }
    function sayiKutu(ad, deger, tikla) {
      var el = h('div', { sinif: 's41-sayi' }, [h('small', { metin: ad }), h('b', { metin: deger })]);
      if (tikla) { el.classList.add('tikla'); el.style.cursor = 'pointer'; el.setAttribute('role', 'button'); el.tabIndex = 0; el.addEventListener('click', tikla); el.addEventListener('keydown', function (e) { if (e.key === 'Enter') tikla(); }); }
      return el;
    }
    function ozetCiz(v) {
      ozetKok.textContent = ''; var o = v.ozet || {}, dgo = degerVeri && degerVeri.deger_ozet, dg = dgo && dgo.toplam_stok_degeri;
      var k = [sayiKutu('Kalem sayısı', G.say(o.kalem_sayisi != null ? o.kalem_sayisi : satirlar.length)),
        sayiKutu('SKT 90 gün içinde', G.say(o.skt_90_gun_icinde), function () { st.skt = 'yaklasan'; sifirla(); aracCiz(yuk.veri); listeCiz(); }),
        sayiKutu('SKT geçmiş', G.say(o.skt_gecmis), function () { st.skt = 'gecmis'; sifirla(); aracCiz(yuk.veri); listeCiz(); }),
        sayiKutu('Yavaş dönen', G.say(o.yavas_donen_kalem))];
      if (dg) k.push(sayiKutu('Toplam stok değeri', S.para(dg)));
      ozetKok.appendChild(G.ozetSerit(k, { en: 4 }));
      if (dg) {
        var fk = dgo.fiyat_teyit_bekleyen_kalem || 0, dk = dgo.degerlenemeyen_kalem || 0;
        if (fk || dk) ozetKok.appendChild(h('div', { sinif: 'soluk kucuk', metin: EN ? ('Not in the total: ' + G.say(fk) + ' items with price under review, ' + G.say(dk) + ' items without a value') : ('Toplamda yer almayan: fiyatı kontrol edilecek ' + G.say(fk) + ' kalem, değeri girilmemiş ' + G.say(dk) + ' kalem') }));
      }
    }
    function aracCiz(v) {   
      aracKok.textContent = '';
      var sirk = Object.keys((v.ozet && v.ozet.sirket_kalem) || {}), sayim = function (fn) { return satirlar.filter(fn).length; }, sayG = {};
      satirlar.forEach(function (o) { sayG[o.grup] = (sayG[o.grup] || 0) + 1; });
      var yeniden = function () { sifirla(); listeCiz(); };
      var gruplar = [{ ad: T('Görünüm', 'View'), secenekler: [['parti', T('Parti detayı', 'Batch detail')], ['urun', T('Ürün toplamı', 'Product totals')], ['talep', T('Satınalma talepleri', 'Purchase requisitions')]], secili: st.gorunum, varsayilan: 'parti', sec: function (k) { st.gorunum = k; yeniden(); } },
        { ad: 'Ürün grubu', secenekler: [['', 'Tümü', G.say(satirlar.length)]].concat(GRUPLAR.map(function (g) { return [g[0], g[1], G.say(sayG[g[0]] || 0)]; })), secili: st.grup, sec: function (k) { st.grup = k; yeniden(); } }];
      if (sirk.length > 1) gruplar.push({ ad: 'Şirket', secenekler: [['', 'Tümü', satirlar.length]].concat(sirk.map(function (s) { return [s, s, sayim(function (o) { return o.sirket === s; })]; })), secili: st.sirket, sec: function (k) { st.sirket = k; yeniden(); } });
      gruplar.push({ ad: 'SKT durumu', secenekler: [['', 'Tüm SKT durumları'], ['yaklasan', 'SKT yaklaşan'], ['gecmis', 'SKT geçmiş']], secili: st.skt, sec: function (k) { st.skt = k; yeniden(); } });
      gruplar.push({ ad: T('İşaret', 'Flag'), secenekler: [['', T('Tüm işaretler', 'All flags')], ['hareketsiz', T('60+ gün hareketsiz', '60+ days inactive') + ' (' + G.say(sayim(function (o) { return o.hareketsiz; })) + ')'], ['plan', '★ ' + T('Üretim planında', 'In production plan') + ' (' + G.say(sayim(function (o) { return o.planda; })) + ')'], ['lothata', '⚠ ' + T('Lot 10 hane değil', 'Batch not 10 digits') + ' (' + G.say(sayim(function (o) { return o.lotHata; })) + ')']], secili: st.isaret, sec: function (k) { st.isaret = k; yeniden(); } });
      gruplar.push({ ad: 'Depo yeri', secenekler: [['', 'Tüm depolar']].concat(depolar), secili: st.depo, sec: function (k) { st.depo = k; yeniden(); } });
      aracKok.appendChild(G.aracCubugu({
        arama: { deger: st.q, yerTutucu: ARA_YER, degisti: function (q) { clearTimeout(zamanlayici); zamanlayici = setTimeout(function () { st.q = q; yeniden(); }, 120); } },
        filtre: { baslik: T('Filtre'), gruplar: gruplar, temizle: function () { st.grup = st.sirket = st.skt = st.isaret = st.depo = ''; st.gorunum = 'parti'; yeniden(); } }
      }));
    }
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Stok alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri;
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      var dk = MM.yasDk(v.uretim_zamani || v.guncelleme);
      ust.appendChild(G.tazelik(v.uretim_zamani || v.guncelleme, (dk == null || dk > ESKI_DK) ? 'eski' : 'taze'));
      if (!v.kalemler || !v.kalemler.length) { govde.appendChild(G.bos({ baslik: 'Stok kaydı yok', metin: 'Henüz stok verisi hazırlanmadı.' })); return; }
      hazirla(v); ozetCiz(v); aracCiz(v); segMod = '';
      govde.appendChild(ozetKok); govde.appendChild(aracKok); govde.appendChild(segKok); govde.appendChild(araKok); govde.appendChild(liste);
      listeCiz();
    }
    function yenile() {
      hata = null; yuk = null; degerVeri = null; ciz();
      window.MMVeri.oku('stok', 'stok').then(function (r) { yuk = r; hata = null; })
        .then(function () { return degerYetkisi() ? window.MMVeri.oku('stok', 'stok-deger', 'dmo-maliyet').then(function (d) { degerVeri = d && d.veri; }).catch(function () { degerVeri = null; }) : null; })   
        .catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); });
    }
    yenile();
    return function () { canli = false; clearTimeout(zamanlayici); };
  };
})();
