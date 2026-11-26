




(function () {
  'use strict';
  var MM = window.MM, h = MM.h, sayi = MM.sayi, G = MM.gr;
  var ESKI_DK = 12 * 60;
  var RISK_AD = { riskli: 'Riskli', sure_gecti: 'Cezalı süre geçti', cezali_surede: 'Cezalı sürede', riskli_toplam: 'Riskli (hepsi)', teslim_alinmadi: 'Teslim edilmedi', son_teslim_yakin: 'Son teslim yakın', ek_sure_iste: 'Ek süre iste', itiraz: 'İtiraz', iptal_sure_doldu: 'İptale düştü (süre doldu)' };
  var RISK_ACIK = { teslim_alinmadi: 'İrsaliyeden 5 gün ya da daha fazla geçti, DMO\'da teslimat tamamlandı görünmüyor.', son_teslim_yakin: 'Son teslim tarihi 5 gün içinde, DMO\'da teslim girişi yok (irsaliye kuralından bağımsız).', riskli: 'Portalda teslim girişi yok; cezalı sürenin bitmesine 3 gün ya da daha az var.', sure_gecti: 'Portalda teslim girişi yok; cezalı süre bitti.', cezali_surede: 'Son teslim tarihi geçti, teslim tamamlanmadı; cezalı süre içinde (bitmesine 3 günden fazla var). Cezalı süreye kalan güne göre sıralı.', riskli_toplam: 'Kart sayısıyla aynı küme: riskli, cezalı süre geçti, cezalı sürede, teslim edilmedi ve son teslim yakın etiketlerinden en az birini taşıyan kalemler (ek süre ve itiraz hariç).', ek_sure_iste: 'Ek süre başvurusunun son günü yaklaşıyor.', itiraz: 'Teslim girilmiş ama hastane kabulü yok: imzalı teslim belgesiyle itiraz edilir.', iptal_sure_doldu: 'Cezalı süre bitti, teslim yok ve hastane ek süre vermedi: sipariş iptale düştü. Riskli sayılmaz.' };
  var RISK_SIRA = ['riskli', 'sure_gecti', 'cezali_surede', 'teslim_alinmadi', 'son_teslim_yakin', 'ek_sure_iste', 'itiraz', 'iptal_sure_doldu'];
  var RISKLI_GRUP = ['riskli', 'sure_gecti', 'cezali_surede', 'teslim_alinmadi', 'son_teslim_yakin'];   
  function etiketVar(s, r) { var e = s.risk_etiketleri || (s.risk ? [s.risk] : []); return r === 'riskli_toplam' ? RISKLI_GRUP.some(function (g) { return e.indexOf(g) >= 0; }) : e.indexOf(r) >= 0; }
  var TESLIM_AD = { tamamlandi: 'Teslim tamam', kismi: 'Kısmi teslim', yok: 'Portalda giriş yok', iptal: 'İptal' };
  var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var DOSYALAR = ['dmo-ozet', 'dmo-ihaleler', 'dmo-siparisler', 'dmo-muayene', 'dmo-ceza'];

  function barkodAc() {   
    if (window.MMBarkod) { window.MMBarkod.ac(); return; }
    if (!document.querySelector('link[href="m-barkod.css"]')) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'm-barkod.css'; document.head.appendChild(l); }
    var s = document.createElement('script'); s.src = 'modul-barkod.js';
    s.onload = function () { window.MMBarkod.ac(); };
    s.onerror = function () { window.alert('Barkod okuyucu yüklenemedi. Bağlantınızı kontrol edin.'); };
    document.head.appendChild(s);
  }
  function tarihTR(iso) { if (!iso) return '—'; var p = String(iso).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso; }
  function zamanTR(z) { var m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(z || ''); return m ? m[3] + '.' + m[2] + '.' + m[1] + ' ' + m[4] + ':' + m[5] : 'zamanı bilinmiyor'; }
  function say(n) { var s = sayi(n); return s == null ? 'veri yok' : s; }
   
  function sipNo(x) { return x && x.dosya_no != null && x.dosya_no !== '' ? String(x.dosya_no) : 'veri yok'; }
  function tl(n) { var s = sayi(n); return s == null ? 'veri yok' : s + ' TL'; }
  function yuzde(n) { var s = sayi(n, 1); return s == null ? 'veri yok' : '%' + s; }
  function ayAd(k) { if (!k) return 'Tarih yok'; var p = k.split('-'); return AY[Number(p[1]) - 1] + ' ' + p[0]; }
  function firmaRozet(f) { return h('span', { sinif: 'dm-firma ' + (f === 'DAY' ? 'day' : 'my'), metin: f || '?' }); }
  function etiket(r) { return h('span', { sinif: 'dm-risk ' + r, metin: RISK_AD[r] || r }); }
  function kalanMetin(n) { if (n == null) return 'veri yok'; return n < 0 ? Math.abs(n) + ' gün geçti' : n + ' gün kaldı'; }
  function ikiSatir(ad, deger, sinif) { return h('div', { sinif: 'dm-oge' + (sinif ? ' ' + sinif : '') }, [h('span', { sinif: 'dm-oge-ad', metin: ad }), h('strong', { sinif: 'dm-oge-deger', metin: deger })]); }

  

  var GEREK = {
    '*': ['dmo-ihaleler', 'dmo-siparisler', 'dmo-muayene', 'dmo-ceza', 'fy', 'tb', 'as', 's49'],
    ozet: ['dmo-ihaleler', 'as', 's49'], acik: ['as'], hastaneler: ['dmo-ihaleler'], ihaleler: ['dmo-ihaleler', 'fy'],
    ihale: ['dmo-ihaleler', 'dmo-siparisler', 'fy', 'tb'], siparis: ['dmo-ihaleler', 'dmo-siparisler', 'fy', 'tb'], muayene: ['dmo-ihaleler', 'dmo-muayene'],
    ceza: ['dmo-ihaleler', 'dmo-ceza', 'fy'], belge: ['dmo-ihaleler', 'tb'], anlik: [], mektup: ['dmo-ihaleler']
  };
  async function fyOku() {
     
    var fy = null;
    if (fiyatGor()) {
      try {
        var r = await window.MMVeri.oku('dmo', 'dmo-fiyat', 'dmo-fiyat-gor'), d = r.veri || {};
        fy = { sip: {}, ihale: {}, ceza: {}, ozet: d.ozet || {}, cezaToplam: (d.ceza || {}).toplam_tl || {}, cezaEsles: (d.ceza || {}).siparisle_eslesmeyen_tl || {} };
        (d.siparisler || []).forEach(function (x) { fy.sip[x.satir_id] = x; });
        (d.ihaleler || []).forEach(function (x) { fy.ihale[x.firma + '|' + x.ikn] = x; });
        ((d.ceza || {}).satirlar || []).forEach(function (x) { fy.ceza[x.satir_id] = x; });
      } catch (e) { fy = null; }   
    }
    return fy;
  }
  async function yukle(sekme) {
    var g = {}; (GEREK[sekme] || GEREK['*']).forEach(function (k) { g[k] = 1; });
    var sonuc = {}, ad = DOSYALAR.filter(function (d) { return d === 'dmo-ozet' || g[d]; });
    var fyS = (g.fy && fiyatGor()) ? fyOku() : null;   
    var oku = await Promise.all(ad.map(function (d) { return window.MMVeri.oku('dmo', d); }));
    ad.forEach(function (d, i) { sonuc[d] = oku[i].veri; });
    var fy = fyS ? await fyS : null;
     
    var tb = null;
    if (g.tb) try { var rb = await window.MMVeri.oku('dmo', 'dmo-teslim-belge'); tb = rb.veri || null; } catch (e) { tb = null; }
     
    var as = null;
    if (g.as) try { var ra = await window.MMVeri.oku('dmo', 'dmo-acik-siparis'); as = ra.veri || null; } catch (e) { as = null; }
     
    var s49 = null, s49f = null;
    if (g.s49) try { var r49 = await window.MMVeri.oku('dmo', 'dmo-s49'); s49 = r49.veri || null; } catch (e) { s49 = null; }
    if (g.s49 && fiyatGor()) { try { var r49f = await window.MMVeri.oku('dmo', 'dmo-s49-fiyat', 'dmo-fiyat-gor'); s49f = r49f.veri || null; } catch (e) { s49f = null; } }
    return { v: sonuc, kaynak: oku[0].kaynak, fy: fy, tb: tb, as: as, s49: s49, s49f: s49f };
  }
  var TUR_AD = { nitril: 'Nitril', pudrali_lateks: 'Pudralı lateks', pudrasiz_lateks_muayene: 'Pudrasız lateks', cerrahi_lateks: 'Cerrahi lateks', spanc: 'Spanç', batin: 'Batın', gazli_bez: 'Gazlı bez' };
  function turAdi(t, grupAdi) { if (grupAdi) return grupAdi; return TUR_AD[t] || (t ? 'Eşleşmeyen ' + String(t).replace('eslesmeyen:', '') : 'veri yok'); }
  function fiyatGor() { return window.MMVeri.ozelErisim('dmo-fiyat-gor'); }   
  function fiyatYetkisi() { return window.MMVeri.ozelErisim('dmo-fiyat'); }
  function maliyetYetkisi() { return window.MMVeri.ozelErisim('dmo-maliyet'); }   
  MM.dmo = { yukle: yukle };

   
  var NS = 'http://www.w3.org/2000/svg';
  function sv(et, oz, ch) { var e = document.createElementNS(NS, et); for (var k in (oz || {})) if (oz[k] != null) e.setAttribute(k, oz[k]); (ch || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function oran(a, b) { return (a == null || b == null || !b) ? null : a / b * 100; }   
   
  function halka(o) {
    var boy = o.boy || 96, C = function (r) { return 2 * Math.PI * r; };
    var vd = o.deger == null ? null : Math.max(0, Math.min(100, o.deger));
    var svg = sv('svg', { viewBox: '0 0 100 100', class: 'dm-hk-svg', 'aria-hidden': 'true', focusable: 'false' });
    function halkaCiz(r, w, d, renk) {
      svg.appendChild(sv('circle', { cx: 50, cy: 50, r: r, class: 'dm-hk-iz', 'stroke-width': w }));
      if (d != null && d > 0) svg.appendChild(sv('circle', { cx: 50, cy: 50, r: r, class: 'dm-hk-dolgu ' + renk, 'stroke-width': w, 'stroke-linecap': d >= 100 ? 'butt' : 'round', 'stroke-dasharray': (C(r) * d / 100).toFixed(2) + ' ' + C(r).toFixed(2), transform: 'rotate(-90 50 50)' }));
    }
    var dis = o.ikinci != null ? 43 : 41, w = o.ikinci != null ? 9 : 11;
    halkaCiz(dis, w, vd, o.renk || 'mavi');
    if (o.ikinci != null) halkaCiz(30, 9, Math.max(0, Math.min(100, o.ikinci)), o.renk2 || 'lacivert');
    if (o.esik != null) {   
      var a = (o.esik * 3.6 - 90) * Math.PI / 180, r1 = (o.ikinci != null ? 26 : 34), r2 = 49;
      svg.appendChild(sv('line', { x1: 50 + r1 * Math.cos(a), y1: 50 + r1 * Math.sin(a), x2: 50 + r2 * Math.cos(a), y2: 50 + r2 * Math.sin(a), class: 'dm-hk-esik' }));
    }
    var kap = h('div', { sinif: 'dm-halka' + (o.sinif ? ' ' + o.sinif : ''), style: '--hk:' + boy + 'px;width:' + boy + 'px;height:' + boy + 'px', role: 'img', 'aria-label': o.ad || '' }, [svg,
      h('div', { sinif: 'dm-hk-merkez' }, [h('strong', { metin: vd == null ? 'veri yok' : o.merkez }), o.alt ? h('small', { metin: o.alt }) : null])]);
    return kap;
  }
  function halkaKutu(ad, hk, alt) { return h('div', { sinif: 'dm-hk-kutu' }, [hk, h('span', { sinif: 'dm-hk-ad', metin: ad }), alt ? h('span', { sinif: 'dm-hk-alt', metin: alt }) : null]); }

   
  function cubuk(teslimPct, kabulPct, esik) {
    var kap = h('div', { sinif: 'dm-cubuk', role: 'img', 'aria-label': 'Teslim ' + yuzde(teslimPct) + ', hastane kabulü ' + yuzde(kabulPct) + (esik != null ? ', temlik eşiği ' + yuzde(esik) : '') });
    var iz = h('div', { sinif: 'dm-iz' }, [
      h('i', { sinif: 'dm-teslim', style: 'width:' + Math.min(100, teslimPct || 0) + '%' }),
      h('i', { sinif: 'dm-kabul', style: 'width:' + Math.min(100, kabulPct || 0) + '%' })]);
    kap.appendChild(iz);
    if (esik != null) kap.appendChild(h('span', { sinif: 'dm-esik', style: 'left:' + Math.min(100, esik) + '%' }, [h('em', { metin: yuzde(esik) })]));
    return kap;
  }

  MM.moduller.dmo = function (kok) {
    var qs = new URLSearchParams(location.search), yol = MM.yol(), hq = new URLSearchParams((location.hash.split('?')[1]) || '');
    var sekme = yol[0] || 'ozet', yuk = null, hata = null, canli = true;
    var f = { firma: hq.get('firma') || '', yil: hq.get('yil') || '', ay: hq.get('ay') || '', risk: hq.get('risk') || qs.get('risk') || '' };   
    var ustKap = h('div'), govde = h('div', { 'aria-live': 'polite' }), menuKapat = null;
    kok.appendChild(ustKap); kok.appendChild(govde);
    var belgeTik = function () { if (menuKapat) menuKapat(); }, belgeTus = function (e) { if (e.key === 'Escape' && menuKapat) menuKapat(); };
    document.addEventListener('click', belgeTik); document.addEventListener('keydown', belgeTus);

    function ihaleBul(firma, ikn) { return yuk.v['dmo-ihaleler'].ihaleler.filter(function (i) { return i.firma === firma && i.ikn === ikn; })[0]; }
    function git(adres) { location.hash = adres; }
     
    var IKN_IDX = null;
    function urunKisa(ad) { var s = String(ad || '').toLocaleLowerCase('tr'); return /spanç|spanc/.test(s) ? 'Spanç' : (/eldiven/.test(s) ? 'Eldiven' : (/batın|batin/.test(s) ? 'Batın' : (/gazlı bez|gazli bez/.test(s) ? 'Gazlı bez' : null))); }
    function iknIdx() {
      if (IKN_IDX) return IKN_IDX;
      var fk = {}, k = {}, ihs = yuk && yuk.v && yuk.v['dmo-ihaleler'] ? (yuk.v['dmo-ihaleler'].ihaleler || []) : [];
      ihs.forEach(function (i) {
        var u = []; (i.kota_gruplari || []).forEach(function (g) { var a = urunKisa(g.grup_adi || g.urun_turu); if (a && u.indexOf(a) < 0) u.push(a); });
        var o = { urun: u.join(' / '), dosya: i.dosya_no, bas: i.baslangic };
        fk[i.firma + '|' + i.ikn] = o; if (!k[i.ikn]) k[i.ikn] = o;
      });
      IKN_IDX = { fk: fk, k: k }; return IKN_IDX;
    }
    function iknBul(firma, ikn) { var x = iknIdx(); return x.fk[(firma || '') + '|' + ikn] || x.k[ikn] || null; }
    function iknUrun(firma, ikn) { if (!ikn) return 'IKN veri yok'; var o = iknBul(firma, ikn); return 'IKN ' + ikn + (o && o.urun ? ' · ' + o.urun : ''); }
    function iknTam(firma, ikn) { var o = iknBul(firma, ikn); return iknUrun(firma, ikn) + (o && o.dosya != null && o.dosya !== '' ? ' · Sipariş no ' + o.dosya : ''); }

    function bantlar(o) {
      var f2 = document.createDocumentFragment();
      var dk = MM.yasDk((o.uretim_zamani || '').replace(' ', 'T') + '+03:00'), eski = dk == null || dk > ESKI_DK;
      var kt = o.kaynak || {};
      var kisa = function (t) { return tarihTR(t).replace(/\.\d{4}$/, ''); };
      var gunc = 'Güncelleme: MY ' + tarihTR((kt.MY || {}).tarih) + ' · DAY ' + tarihTR((kt.DAY || {}).tarih);
       
      var rozet = G.tazelik(o.uretim_zamani ? String(o.uretim_zamani).replace(' ', 'T') + '+03:00' : null, eski && o.ornek !== true ? 'eski' : 'taze');
      rozet.setAttribute('title', (o.ornek === true ? 'Örnek veri: hastane adları, sipariş numaraları ve tutarlar gerçek değil. ' : '') + 'Veri: ' + zamanTR(o.uretim_zamani) + ' itibarıyla' + (eski && o.ornek !== true ? ' — son üretim ' + MM.yasMetin(dk) + '. Değerler güncel olmayabilir.' : '') + ' · ' + gunc);
      if (o.ornek === true) { rozet.classList.add('ornek'); rozet.insertBefore(h('span', { sinif: 'dm-ornek-ayrac', 'aria-hidden': 'true', metin: '·' }), rozet.firstChild); rozet.insertBefore(h('b', { sinif: 'dm-ornek-et', metin: 'ÖRNEK VERİ' }), rozet.firstChild); }
      f2.appendChild(h('div', { sinif: 'dm-taze-satir' }, [rozet, h('span', { sinif: 'soluk kucuk dm-gunc', title: gunc, metin: 'MY ' + kisa((kt.MY || {}).tarih) + ' · DAY ' + kisa((kt.DAY || {}).tarih) })]));
      return f2;
    }

    function sekmeSatiri() {
      var r = function (id, ad, ek) { return [id, ad, ek || null]; };
      var l = [r('ozet', 'Özet'), r('mektup', 'Siparişler'), r('acik', 'Açık sipariş'), r('hastaneler', 'Hastaneler'), r('ihaleler', 'İhaleler'), r('siparis', 'Kalemler / risk'), r('muayene', 'Muayene'), r('ceza', 'Ceza'), r('belge', 'Teslim belgeleri')];
      var aktif = sekme === 'ihale' ? 'ihaleler' : sekme;
       
      return h('div', { sinif: 'segment dm-seg' }, [G.sekmeler(l.map(function (x) { return [x[0], x[1]]; }), aktif, function (id) { git('#dmo' + (id === 'ozet' ? '' : '/' + id)); }, { sinif: 'segment-dugme', goster: 3, ad: 'DMO bölümleri' })]);
    }
     
    function eylemMenu(oge) {
      var pano = h('div', { sinif: 'dm-eylem-menu', role: 'menu', hidden: true }), acik = false;
      var dg = h('button', { type: 'button', sinif: 'mini-dugme dm-eylem-dg', 'aria-haspopup': 'menu', 'aria-expanded': 'false', onclick: function (e) { e.stopPropagation(); ac(!acik); } }, ['Eylemler ▾']);
      function ac(a) { acik = a; if (a) { menuKapat = function () { ac(false); }; pano.removeAttribute('hidden'); } else { if (menuKapat) menuKapat = null; pano.setAttribute('hidden', ''); } dg.setAttribute('aria-expanded', String(a)); }
      oge.forEach(function (x) {
        pano.appendChild(x[1].href ? h('a', { href: x[1].href, role: 'menuitem', sinif: 'dm-eylem-oge', metin: x[0] }) : h('button', { type: 'button', role: 'menuitem', sinif: 'dm-eylem-oge', metin: x[0], onclick: function () { ac(false); x[1].fn(); } }));
      });
      return h('div', { sinif: 'dm-eylem' }, [dg, pano]);
    }
    

    var FIRMA_GRUP = { ad: 'Firma', anahtar: 'firma', secenekler: [['', 'MY + DAY'], ['MY', 'MY'], ['DAY', 'DAY']] };
    function aracKur(gruplar) {
      return G.aracCubugu({ filtre: {
        gruplar: gruplar.map(function (g) { return { ad: g.ad, secenekler: g.secenekler, secili: g.deger ? g.deger() : (f[g.anahtar] || ''), varsayilan: '', sec: function (id) { if (g.sec) g.sec(id); else f[g.anahtar] = id; ciz(); } }; }),
        temizle: function () { gruplar.forEach(function (g) { if (g.sec) g.sec(''); else f[g.anahtar] = ''; }); ciz(); } } });
    }

     
    var BELGE_TUR = { kargo_fisi: 'Kargo fişi', nakliye: 'Nakliye / irsaliye' };
    var ESL_AD = { siparis_no: 'sipariş no', ikn_hastane: 'IKN + hastane', hastane_tarih: 'hastane + tarih', ikn: 'yalnız IKN (ihale düzeyi)' };
    function tbVar() { return !!(yuk && yuk.tb && yuk.tb.durum === 'tamam'); }
    function belgeIdleri(sozluk, anahtar) { return tbVar() ? ((yuk.tb[sozluk] || {})[anahtar] || []) : []; }
    function belgeNesne(id) { if (!yuk.tb._idx) { yuk.tb._idx = {}; (yuk.tb.belgeler || []).forEach(function (b) { yuk.tb._idx[b.id] = b; }); } return yuk.tb._idx[id]; }
     
    function teslimGorselGor() { return window.MMVeri.ozelErisim('dmo-teslim-gorsel'); }
    function gorselKatman(blob) {
      var url = URL.createObjectURL(blob);
      var kat;
      function kapat() { document.removeEventListener('keydown', tus); URL.revokeObjectURL(url); if (kat.parentNode) kat.parentNode.removeChild(kat); }
      function tus(e) { if (e.key === 'Escape') kapat(); }
      kat = h('div', { sinif: 'dm-gorsel-katman', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Teslim görseli' }, [
        h('button', { sinif: 'dm-gorsel-kapat', type: 'button', metin: 'Kapat', onclick: kapat }),
        h('div', { sinif: 'dm-gorsel-kap' }, [h('img', { sinif: 'dm-gorsel-img', src: url, alt: 'Teslim belgesi görseli' })])]);
      document.addEventListener('keydown', tus);
      document.body.appendChild(kat);
    }
    function gorselDugme(ad) {
      var d = h('button', { sinif: 'dm-temlik', type: 'button', metin: 'Teslim görselini aç' });
      d.addEventListener('click', function () {
        d.disabled = true; d.textContent = 'Yükleniyor…';
        window.MMVeri.gorselBlob('dmo-teslim-gorsel', ad).then(function (b) { d.disabled = false; d.textContent = 'Teslim görselini aç'; gorselKatman(b); },
          function (e) { d.disabled = false; d.textContent = 'Görsel açılamadı'; });
      });
      return d;
    }
    function belgeSatiri(b, esl) {
      var ir = (b.irsaliye_no || []).concat((b.eirsaliye_no || []).map(function (x) { return x + ' (e-irsaliye)'; }));
      return h('article', { sinif: 'dm-sp' }, [
        h('div', { sinif: 'dm-sp-ust' }, [h('strong', { metin: b.hastane || 'Hastane okunamadı' }), h('span', { sinif: 'dm-temlik', metin: BELGE_TUR[b.tur] || b.tur })]),
        h('div', { sinif: 'dm-sp-orta' }, [h('span', {}, ['Tarih ', h('strong', { metin: tarihTR(b.tarih) + (b.saat ? ' ' + b.saat : '') })]),
          h('span', {}, ['İrsaliye no ', h('strong', { metin: ir.length ? ir.join(', ') : 'okunamadı' })]),
          h('span', {}, [h('strong', { metin: (b.ikn || []).length ? b.ikn.map(function (n) { return iknTam('', n); }).join(' · ') : 'IKN yok' })]),
          h('span', {}, ['Sipariş ', h('strong', { metin: (b.siparis_no || []).length ? b.siparis_no.join(', ') : 'yok' })])]),
        h('div', { sinif: 'dm-sp-alt' }, [esl ? h('span', {}, ['Eşleşme: ', h('strong', { metin: esl })]) : h('span', { sinif: 'soluk', metin: 'Eşleşmedi (sahip: nakliye)' }),
          b.gorsel && teslimGorselGor() ? gorselDugme(b.gorsel) : null])]);
    }
    function belgeEkrani() {
      if (!yuk.tb || yuk.tb.durum !== 'tamam') { govde.appendChild(G.bos({ baslik: 'Teslim belgesi verisi yok', metin: 'Teslim belgesi verisi henüz yok' })); return; }
      var sy = yuk.tb.sayilar || {}, fs = sy.firmaya_gore_eslesen_belge || {};
      govde.appendChild(h('div', { sinif: 'dm-oge-izgara' }, [ikiSatir('Nakliye + kargo belgesi', say(sy.toplam_nakliye_kargo)), ikiSatir('Siparişe/ihaleye bağlanan', say(sy.eslesen)), ikiSatir('MY', say(fs.MY)), ikiSatir('DAY', say(fs.DAY)), ikiSatir('Eşleşmeyen', say(sy.eslesmeyen), sy.eslesmeyen ? 'kritik' : '')]));
      govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Eşleşmeyen belgeler (' + say(yuk.tb.eslesmeyen_sayi) + ') — son ' + (yuk.tb.eslesmeyen_son50 || []).length }));
      govde.appendChild(h('p', { sinif: 'dm-aciklama', metin: 'Sipariş no, IKN ya da hastane+tarih ile bağlanamayan belgeler. Sahip: nakliye. Fotoğrafın altına teslimat/sipariş numarası yazılırsa bağlanır.' }));
      var esz = yuk.tb.eslesmeyen_son50 || [];
      govde.appendChild(sayiSatiri(esz.length + ' belge', 'Eşleşmeyen teslim belgeleri', 'Son ' + esz.length,
        [sutun('Hastane', function (b) { return b.hastane; }), sutun('Tür', function (b) { return BELGE_TUR[b.tur] || b.tur; }), sutun('Tarih', function (b) { return b.tarih; }),
          sutun('İrsaliye no', function (b) { return (b.irsaliye_no || []).concat(b.eirsaliye_no || []).join(', '); }), sutun('IKN', function (b) { return (b.ikn || []).join(', '); }), sutun('Sipariş no', function (b) { return (b.siparis_no || []).join(', '); })], esz));
      govde.appendChild((yuk.tb.eslesmeyen_son50 || []).length ? G.ilkN(yuk.tb.eslesmeyen_son50, function (b) { return belgeSatiri(b, null); }, { n: 10, sinif: 'dm-liste' }) : G.bos({ baslik: 'Eşleşmeyen belge yok' }));
    }

     
    function fSip(s) { return (yuk.fy && yuk.fy.sip[s.satir_id]) || {}; }
    function fIhale(i) { return (yuk.fy && yuk.fy.ihale[i.firma + '|' + i.ikn]) || {}; }
    function fCeza(c) { return (yuk.fy && yuk.fy.ceza[c.satir_id]) || {}; }
    function cezaToplamMetin(firma) { var o = yuk.fy && yuk.fy.ozet[firma]; return o && o.gerceklesen_ceza_toplami_tl != null ? tl(o.gerceklesen_ceza_toplami_tl) : null; }

     
     
    function sayiSatiri(metin, ad, filtre, kolonlar, satirlar) {
      var dg = satirlar.length ? G.excelDugme(function () { return { ad: ad, filtre: filtre, kolonlar: kolonlar, satirlar: satirlar }; }) : null;
      return h('div', { sinif: 'dm-say-satir' }, [h('p', { sinif: 'kucuk soluk', metin: metin }), dg]);
    }
    function sutun(ad, fn) { return { ad: ad, k: ad, csv: function (s) { var v = fn(s); return v == null ? '' : v; } }; }
    function firmaFiltre() { return f.firma ? 'Firma: ' + f.firma : 'Tüm firmalar'; }
    function bekleniyor(ad) { return h('p', { sinif: 'dm-yok dm-bekle', metin: (ad ? ad + ': ' : '') + 'Veri bekleniyor' }); }
    function topFirma(k) { var fk = yuk.v['dmo-ozet'].firmalar || {}, a = (fk.MY || {})[k], b = (fk.DAY || {})[k]; return a == null && b == null ? null : (a || 0) + (b || 0); }
    function bugunKarti() {
      var s = yuk.s49, od0 = s && s.odeme_cizelgesi && (s.odeme_cizelgesi.satirlar || []).filter(function (x) { return !x.gecikmis; })[0];
      var is = [
        ['Riskli sipariş: cezalı süre ya da teslim işlemi bekliyor', topFirma('riskli_toplam_siparis'), '#dmo/siparis?risk=riskli_toplam', true],
        ['Son teslimi 5 gün içinde, teslim girişi yok', topFirma('son_teslim_yakin_siparis'), '#dmo/siparis?risk=son_teslim_yakin', true],
        ['İrsaliyeden 5 gün geçti, teslim görünmüyor', topFirma('teslim_alinmadi_siparis'), '#dmo/siparis?risk=teslim_alinmadi', true],
        ['Ek süre başvurusu yaklaşıyor', topFirma('ek_sure_istenecek_siparis'), '#dmo/siparis?risk=ek_sure_iste', true],
        ['İtiraz edilebilir sipariş (teslim var, hastane kabulü yok)', topFirma('itiraz_adayi_siparis'), '#dmo/siparis?risk=itiraz', false],
        ['Olumsuz muayenede işlem gereken', topFirma('olumsuz_muayene_aksiyon_gerekli'), '#dmo/muayene', true]
      ];
      var bilinen = is.filter(function (x) { return x[1] != null; }), liste = bilinen.filter(function (x) { return x[1] > 0; });
      var satirlar = liste.map(function (x) {
        return h('button', { type: 'button', sinif: 'dm-bg-satir' + (x[3] ? ' kritik' : ''), onclick: function () { git(x[2]); } }, [h('strong', { sinif: 'dm-bg-say', metin: say(x[1]) }), h('span', { metin: x[0] })]);
      });
      if (od0 && od0.kalan_gun <= 7) satirlar.push(h('div', { sinif: 'dm-bg-satir bilgi' }, [h('strong', { sinif: 'dm-bg-say', metin: od0.kalan_gun + ' gün' }), h('span', { metin: 'DMO ödeme günü ' + tarihTR(od0.odeme_gunu) })]));
      if (!bilinen.length) return null;   
      var govdeEl = (satirlar.length ? h('div', { sinif: 'dm-bg-liste' }, satirlar) : h('p', { sinif: 'dm-yok', metin: 'Bugün için açık iş görünmüyor.' }));
      return G.kart({ baslik: 'Bugün yapılacak', alt: 'tıklayınca ilgili liste açılır', govde: govdeEl });
    }
    function odemeKarti() {
      var oc = yuk.s49 && yuk.s49.odeme_cizelgesi, fg = fiyatGor();
      if (!oc || !(oc.satirlar || []).length) return null;   
      var tlMap = {}; if (fg && yuk.s49f) (yuk.s49f.odeme_gunleri || []).forEach(function (x) { tlMap[x.odeme_gunu] = x; });
      var en = Math.max.apply(null, oc.satirlar.map(function (x) { return (x.fatura_MY || 0) + (x.fatura_DAY || 0); })) || 1;
      var sat = oc.satirlar.map(function (x) {
        var t = (x.fatura_MY || 0) + (x.fatura_DAY || 0), tt = tlMap[x.odeme_gunu];
        return h('div', { sinif: 'dm-od-satir' + (x.gecikmis ? ' gecikmis' : '') }, [
          h('div', { sinif: 'dm-od-ust' }, [h('strong', { metin: tarihTR(x.odeme_gunu) }), h('span', { sinif: 'soluk kucuk', metin: x.gecikmis ? Math.abs(x.kalan_gun) + ' gün geçti' : x.kalan_gun + ' gün kaldı' })]),
          h('div', { sinif: 'dm-od-iz', role: 'img', 'aria-label': tarihTR(x.odeme_gunu) + ': ' + t + ' fatura' }, [h('i', { sinif: 'my', style: 'width:' + ((x.fatura_MY || 0) / en * 100).toFixed(1) + '%' }), h('i', { sinif: 'day', style: 'width:' + ((x.fatura_DAY || 0) / en * 100).toFixed(1) + '%' })]),
          h('div', { sinif: 'dm-od-alt kucuk' }, [h('span', {}, [firmaRozet('MY'), ' ' + say(x.fatura_MY) + ' fatura']), h('span', {}, [firmaRozet('DAY'), ' ' + say(x.fatura_DAY) + ' fatura']),
            tt ? h('span', {}, ['Tutar ', h('strong', { metin: tl((tt.tutar_MY_tl || 0) + (tt.tutar_DAY_tl || 0)) })]) : null])]);
      });
      return G.kart({ baslik: 'Ödeme zaman çizelgesi', alt: 'ödenmemiş DMO faturaları, beklenen ödeme gününe göre', govde: h('div', null, [h('div', { sinif: 'dm-od-liste' }, sat)]) });
    }
    function huniKarti() {
      var ih = (yuk.v['dmo-ihaleler'].ihaleler || []), aktif = topFirma('aktif_ihale_portal');
      var teslimli = ih.filter(function (i) { return (i.teslim_edilen_hastane || 0) > 0; }).length, temlik = ih.filter(function (i) { return i.temlik_esigine_ulasti === true; }).length;
      var as = [['Portal aktif ihale', aktif, 'portal sayacı, ihale bazında değil'], ['Katılım / sonuç durumu', null, 'ihale bazında kaynak yok'], ['Siparişli ihale', ih.length, 'son 90 gün'], ['Teslimi başlayan', teslimli, 'en az 1 hastane teslim'], ['Temlik eşiğine ulaşan', temlik, 'hastane kabulü eşiği aştı']];
      var en = Math.max.apply(null, as.map(function (a) { return a[1] || 0; })) || 1;
      return G.kart({ baslik: 'İhale hattı', govde: h('div', { sinif: 'dm-hn' }, as.filter(function (a) { return a[1] != null; }).map(function (a) {
        return h('div', { sinif: 'dm-hn-satir' + (a[1] == null ? ' yok' : '') }, [h('div', { sinif: 'dm-hn-ad' }, [h('span', { metin: a[0] }), h('em', { metin: a[2] })]),
          h('div', { sinif: 'dm-hn-iz' }, [h('i', { style: 'width:' + (a[1] == null ? 100 : Math.max(2, a[1] / en * 100)).toFixed(1) + '%' })]),
          h('strong', { sinif: 'dm-hn-say', metin: a[1] == null ? 'Veri bekleniyor' : say(a[1]) })]);
      })) });
    }
    function otifKarti() {
      var ot = yuk.s49 && yuk.s49.hastane_otif;
      if (!ot || !(ot.en_riskli_5 || []).length) return null;   
      var l = ot.en_riskli_5 || [];
      return G.kart({ baslik: 'Hastane OTIF, en riskli 5', alt: 'zamanında ve tam teslim oranı, düşükten yükseğe', govde: h('div', null, [
        l.length ? h('div', { sinif: 'dm-ot-liste' }, l.map(function (x) {
          return h('div', { sinif: 'dm-ot-satir' }, [h('div', { sinif: 'dm-ot-ust' }, [firmaRozet(x.firma), h('strong', { metin: x.hastane || 'Hastane yok' }), x.il ? h('span', { sinif: 'soluk kucuk', metin: x.il }) : null]),
            h('div', { sinif: 'dm-ot-iz', role: 'img', 'aria-label': 'Zamanında ve tam teslim ' + yuzde(x.otif_yuzde) }, [h('i', { style: 'width:' + Math.max(1, x.otif_yuzde || 0) + '%' })]),
            h('div', { sinif: 'dm-ot-alt kucuk' }, [h('strong', { metin: yuzde(x.otif_yuzde) }), h('span', { metin: ' · ' + say(x.kapsam) + ' kalem: zamanında ' + say(x.zamaninda_tam) + ', geç tamam ' + say(x.gec_tamam) + ', süresi geçmiş açık ' + say(x.acik_gecmis) })])]);
        })) : bekleniyor('Ölçülecek hastane (en az ' + say(ot.min_kalem) + ' kalem)'),
        h('p', { sinif: 'kucuk soluk', metin: say(ot.hastane_sayisi_olculen) + ' / ' + say(ot.hastane_sayisi_toplam) + ' hastane ölçüldü. ' + (ot.tanim || '') })]) });
    }
     
    function kotaGruplariTekil(gecmisDahil) {
      var d = yuk.v['dmo-ihaleler'], hepsi = [], gor = {};
      (d.ihaleler || []).forEach(function (i) { (i.kota_gruplari || []).forEach(function (g) { hepsi.push(g); }); });
      if (gecmisDahil) (d.gecmis_kota_gruplari || []).forEach(function (g) { hepsi.push(g); });
      return hepsi.filter(function (g) { var k = g.firma + '|' + g.dosya_no + '|' + (g.smt_kodu || g.urun_turu); if (gor[k]) return false; gor[k] = 1; return true; });
    }
    function kotaKarti() {
      var d = yuk.v['dmo-ihaleler'];
      var liste = kotaGruplariTekil(true);
      function doluluk(g) { return !g.iptal_hakki_hastane ? (g.kullanilan_iptal_hastane > 0 ? 200 : 0) : g.kullanilan_iptal_hastane / g.iptal_hakki_hastane * 100; }
      liste = liste.filter(function (g) { return (g.kullanilan_iptal_hastane || 0) > 0; }).sort(function (a, b) { return doluluk(b) - doluluk(a); });
      var ilk = liste.slice(0, 6);
      return G.kart({ baslik: 'Ceza ve iptal kotası (%10, en az 3)', alt: 'iptal hakkı: %10, en az 3 (hastane azsa hastane sayısı kadar) · çizgi = hak sınırı', govde: ilk.length ? h('div', null, [h('div', { sinif: 'dm-kt-liste' }, ilk.map(function (g) {
        var p = doluluk(g), asim = p > 100, renk = g.yasak_asim_teyitsiz || asim ? 'kirmizi' : (g.yasak_durumu === 'sari' || p >= 80 ? 'sari' : 'yesil');
        return h('div', { sinif: 'dm-kt-satir' }, [h('div', { sinif: 'dm-kt-ust' }, [firmaRozet(g.firma), h('strong', { metin: 'Dosya ' + say(g.dosya_no) + ' · ' + turAdi(g.urun_turu, g.grup_adi) })]),
          h('div', { sinif: 'dm-kt-iz', role: 'img', 'aria-label': 'İptal hakkı: ' + say(g.kullanilan_iptal_hastane) + ' kullanıldı, hak ' + say(g.iptal_hakki_hastane) }, [h('i', { sinif: renk, style: 'width:' + Math.min(100, p).toFixed(1) + '%' }), h('span', { sinif: 'dm-kt-sinir' })]),
          h('div', { sinif: 'dm-kt-alt kucuk' }, [h('strong', { metin: say(g.kullanilan_iptal_hastane) + ' / ' + say(g.iptal_hakki_hastane) }), h('span', { metin: ' hastane iptal · toplam ' + say(g.hastane_sayisi_toplam != null ? g.hastane_sayisi_toplam : g.hastane_sayisi_pencere) + ' hastane' + (renk === 'kirmizi' ? ' · kota aşıldı' : (renk === 'sari' ? ' · sınıra yakın' : '')) })])]);
      })), h('p', { sinif: 'kucuk soluk', metin: 'İptal kaydı olan en yüksek dolulukta ' + ilk.length + ' kota grubu (toplam ' + liste.length + ').' })]) : h('p', { sinif: 'dm-yok', metin: 'İptal kaydı olan kota grubu yok.' }) });
    }
    function s49Blok() {
      return h('div', { sinif: 'dm-s49' }, [bugunKarti(), h('div', { sinif: 'dm-iki' }, [odemeKarti(), huniKarti()]), h('div', { sinif: 'dm-iki' }, [otifKarti(), kotaKarti()])]);
    }

     
    function firmaKarti(ad, o) {
      var kart = h('section', { sinif: 'dm-firma-kart ' + (ad === 'DAY' ? 'day' : 'my') });
      kart.appendChild(h('header', { sinif: 'dm-fk-ust' }, [firmaRozet(ad), h('h3', { metin: ad === 'MY' ? 'MY Medikal' : 'DAY Medikal' })]));
      if (!o) { kart.appendChild(h('p', { sinif: 'dm-yok', metin: 'Bu firma için veri yok.' })); return kart; }
      function satir(baslik, deger, risk, hedef, kritik) {
        var tik = hedef ? 'button' : 'div';
        return h(tik, { sinif: 'dm-st' + (kritik && deger ? ' kritik' : '') + (hedef ? ' tikla' : ''), type: hedef ? 'button' : null, onclick: hedef ? function () { git(hedef); } : null }, [
          h('span', { sinif: 'dm-st-ad', metin: baslik }), h('strong', { sinif: 'dm-st-sayi' + (deger == null ? ' yok' : ''), metin: deger == null ? 'veri yok' : (typeof deger === 'string' ? deger : say(deger)) })]);
      }
       
      var g = h('div', { sinif: 'dm-st-izgara' }, [
        satir('Açık sipariş', o.acik_siparis, null, '#dmo/siparis?risk=acik'),
        satir('Riskli sipariş', o.riskli_toplam_siparis, null, '#dmo/siparis?risk=riskli_toplam', true),
        satir('Riskli hastane', o.riskli_hastane_sayisi, null, '#dmo/hastaneler', true),
        satir('Cezalı sürede (son teslim geçti)', o.cezali_surede_siparis, null, '#dmo/siparis?risk=cezali_surede', true),
        satir('Teslim edilmedi (irsaliye 5 gün)', o.teslim_alinmadi_siparis, null, '#dmo/siparis?risk=teslim_alinmadi', true),
        satir('Son teslim yakın (5 gün)', o.son_teslim_yakin_siparis, null, '#dmo/siparis?risk=son_teslim_yakin', true),
        satir('Cezalı süresi geçmiş', o.cezali_sure_gecmis_siparis, null, '#dmo/siparis?risk=sure_gecti', true),
        satir('İptale düştü (süre doldu)', o.iptal_sure_doldu_siparis, null, '#dmo/siparis?risk=iptal_sure_doldu'),
        satir('Ek süre istenecek', o.ek_sure_istenecek_siparis, null, '#dmo/siparis?risk=ek_sure_iste', true),
        satir('İtiraz adayı', o.itiraz_adayi_siparis, null, '#dmo/siparis?risk=itiraz', true),
        satir('Temlik uyarısı (sipariş cirosunun %25+)', o.temlik_uyari_siparis, null, '#dmo/siparis'),
        satir('Olumsuz muayene', o.olumsuz_muayene, null, '#dmo/muayene'),
        satir('Muayenede işlem gereken', o.olumsuz_muayene_aksiyon_gerekli, null, '#dmo/muayene', true),
        satir('Siparişli ihale', o.siparisli_ihale_sayisi, null, '#dmo/ihaleler'),
        satir('Portal aktif ihale', o.aktif_ihale_portal),
        fiyatGor()
          ? satir('Gerçekleşen ceza', cezaToplamMetin(ad), null, '#dmo/ceza')
          : satir('Ceza kesintisi (satır)', o.gerceklesen_ceza_satiri, null, '#dmo/ceza')
      ]);
       
      var hRisk = oran(o.riskli_toplam_siparis, o.acik_siparis), hCez = oran(o.cezali_surede_siparis, o.acik_siparis);
       
      var hTes = o.teslim_ciro_yuzde == null ? null : o.teslim_ciro_yuzde, hKab = o.kabul_ciro_yuzde == null ? null : o.kabul_ciro_yuzde;
      var hEsik = o.temlik_esik_yuzde == null ? null : o.temlik_esik_yuzde;
      kart.appendChild(h('div', { sinif: 'dm-hk-sira' }, [
        halkaKutu('Riskli sipariş', halka({ boy: 92, deger: hRisk, merkez: yuzde(hRisk), renk: 'turuncu', ad: 'Riskli sipariş oranı ' + yuzde(hRisk) }), say(o.riskli_toplam_siparis) + ' / ' + say(o.acik_siparis) + ' açık'),
        halkaKutu('Cezalı sürede', halka({ boy: 92, deger: hCez, merkez: yuzde(hCez), renk: 'kirmizi', ad: 'Cezalı sürede oranı ' + yuzde(hCez) }), say(o.cezali_surede_siparis) + ' / ' + say(o.acik_siparis) + ' açık'),
        halkaKutu('Teslim (ciro)', halka({ boy: 92, deger: hTes, ikinci: hKab, esik: hEsik, merkez: yuzde(hTes), renk: 'yesil', ad: 'Teslim ciro oranı ' + yuzde(hTes) + (hKab != null ? ', hastane kabulü ' + yuzde(hKab) : '') + (hEsik != null ? ', temlik eşiği ' + yuzde(hEsik) : '') }), hTes == null ? 'veri yok' : 'ciro bazında · temlik eşiği ' + (hEsik == null ? 'veri yok' : yuzde(hEsik)))]));
      kart.appendChild(g);
      kart.appendChild(h('p', { sinif: 'dm-yasak ' + ((o.yasak_kirmizi_dosya || 0) > 0 ? 'kirmizi' : (((o.yasak_sari_dosya || 0) + (o.yasak_asim_teyitsiz_dosya || 0)) > 0 ? 'sari' : '')) }, [
        h('strong', { metin: 'Yasaklılık sınırı: ' }),
        o.yasak_asim_teyitsiz_dosya == null && o.yasak_sari_dosya == null ? 'veri yok' : (say(o.yasak_asim_teyitsiz_dosya) + ' kota grubunda aşım · ' + say(o.yasak_sari_dosya) + ' kota grubunda sınıra yakın')]));
       
      var gecmis = (yuk.v['dmo-ihaleler'].gecmis_kota_gruplari || []).filter(function (g) { return g.firma === ad; });
      if (o.gecmis_kota_asim_grup == null && o.gecmis_kota_sinir_grup == null) kart.appendChild(h('p', { sinif: 'dm-yasak kucuk', metin: 'Geçmiş kota grupları: veri yok' }));
      else {
        kart.appendChild(h('p', { sinif: 'dm-yasak ' + ((o.gecmis_kota_asim_grup || 0) > 0 ? 'sari' : '') }, [
          h('strong', { metin: 'Geçmiş kotalar: ' }),
          say(o.gecmis_kota_asim_grup) + ' grupta aşım · ' + say(o.gecmis_kota_sinir_grup) + ' grup sınırda']));
        if (gecmis.length) kart.appendChild(G.ilkN(gecmis, function (g) {
          return h('div', { sinif: 'dm-satir' }, [
            h('strong', { metin: 'Dosya ' + say(g.dosya_no) + ' · ' + turAdi(g.urun_turu, g.grup_adi) }),
            h('span', { sinif: 'dm-yasak-et ' + (g.yasak_asim_teyitsiz ? 'kirmizi' : 'sari'), metin: g.yasak_asim_teyitsiz ? 'Aşım' : 'Sınırda' }),
            h('span', { sinif: 'kucuk soluk', metin: ' ' + say(g.hastane_sayisi_toplam) + ' hastane · iptal ' + say(g.kullanilan_iptal_hastane) + ' / hak ' + say(g.iptal_hakki_hastane) })]);
        }, { n: 6, sinif: 'dm-liste' }));
      }
      return kart;
    }
     
    function ayGrafigi() {
      var tum = yuk.v['dmo-ihaleler'].ihaleler || [], ay = {};
      tum.forEach(function (i) { var k = i.siparis_ay_yil; if (!k) return; var o = ay[k] = ay[k] || { MY: 0, DAY: 0 }; o[i.firma === 'DAY' ? 'DAY' : 'MY']++; });
      var anahtar = Object.keys(ay).sort().slice(-12);
      if (!anahtar.length) return G.kart({ baslik: 'Aylara göre ihale', govde: h('p', { sinif: 'dm-yok', metin: 'Ay bilgisi olan ihale yok (veri yok).' }) });
      var en = Math.max.apply(null, anahtar.map(function (k) { return ay[k].MY + ay[k].DAY; })) || 1;
      var sutunlar = anahtar.map(function (k) {
        var p = k.split('-'), t = ay[k].MY + ay[k].DAY;
        return h('button', { type: 'button', sinif: 'dm-ay-s', title: ayAd(k) + ': MY ' + ay[k].MY + ' · DAY ' + ay[k].DAY, 'aria-label': ayAd(k) + ' MY ' + ay[k].MY + ' DAY ' + ay[k].DAY + ' ihale', onclick: function () { git('#dmo/ihaleler?yil=' + p[0] + '&ay=' + p[1]); } }, [
          h('span', { sinif: 'dm-ay-say', metin: t }),
          h('span', { sinif: 'dm-ay-kolon', style: 'height:' + (t / en * 100).toFixed(1) + '%' }, [
            ay[k].DAY ? h('i', { sinif: 'day', style: 'flex:' + ay[k].DAY }) : null, ay[k].MY ? h('i', { sinif: 'my', style: 'flex:' + ay[k].MY }) : null]),
          h('span', { sinif: 'dm-ay-ad', metin: AY[Number(p[1]) - 1].slice(0, 3) + (p[1] === '01' || k === anahtar[0] ? ' ' + p[0].slice(2) : '') })]);
      });
      return G.kart({ baslik: 'Aylara göre ihale', alt: 'sipariş ayına göre ihale sayısı · mavi MY, mor DAY', govde: h('div', { sinif: 'dm-ay-grafik', role: 'group', 'aria-label': 'Aylara göre ihale sayısı' }, sutunlar) });
    }
    function ozetGoster() {
      var d = yuk.v['dmo-ozet'], fk = d.firmalar || {};
       
      var top = function (k) { var a = (fk.MY || {})[k], b = (fk.DAY || {})[k]; return a == null && b == null ? null : (a || 0) + (b || 0); };
       
      var kutular = [['Açık sipariş', 'acik_siparis', '#dmo/siparis?risk=acik', false], ['Riskli sipariş', 'riskli_toplam_siparis', '#dmo/siparis?risk=riskli_toplam', true], ['Cezalı sürede', 'cezali_surede_siparis', '#dmo/siparis?risk=cezali_surede', true],
        ['Olumsuz muayene', 'olumsuz_muayene', '#dmo/muayene', false], ['Siparişli ihale', 'siparisli_ihale_sayisi', '#dmo/ihaleler', false]].map(function (r) {
        var v = top(r[1]);
        return { baslik: r[0], deger: say(v), durum: v == null ? 'yok' : (r[3] && v ? 'kritik' : null), tikla: function () { git(r[2]); } };
      });
      if (yuk.as) kutular.push({ baslik: 'Gönderilecek adet (açık sipariş takibi)', deger: say((yuk.as.toplam || {}).kalan), tikla: function () { git('#dmo/acik'); } });
      govde.appendChild(G.ozetSerit(kutular, { en: 4 }));
       
      var mkListe = mektupListesi();
      govde.appendChild(h('button', { type: 'button', sinif: 'dm-ayr dm-mk-gecis', onclick: function () { git('#dmo/mektup'); } }, [h('strong', { metin: 'Siparişler (sipariş bazlı görünüm)' }), h('span', { sinif: 'soluk kucuk', metin: mkListe.length + ' sipariş · ' + mkListe.filter(function (o) { return o.uyari; }).length + ' uyarılı' })]));
      var bugun = bugunKarti();
      if (bugun) govde.appendChild(bugun);
       
      var ayr = [['Firmaya göre kırılım', 'MY ve DAY ayrı ayrı', function () { return h('div', { sinif: 'dm-iki' }, [firmaKarti('MY', fk.MY), firmaKarti('DAY', fk.DAY)]); }],
        ['Ödeme zaman çizelgesi', 'ödenmemiş DMO faturaları', odemeKarti], ['İhale hattı', 'aktif, siparişli, teslimi başlayan', huniKarti],
        ['Hastane OTIF, en riskli 5', 'zamanında ve tam teslim', otifKarti], ['Ceza ve iptal kotası', 'iptal hakkı doluluğu', kotaKarti], ['Aylara göre ihale', 'sipariş ayına göre sayı', ayGrafigi]];
      var ayrSatirlar = ayr.map(function (r) {
        var kart = r[2](); if (!kart) return null;
        return h('button', { type: 'button', sinif: 'dm-ayr', onclick: function () { G.sheet(r[0], function (g) { g.appendChild(kart); }).ac(); } }, [h('strong', { metin: r[0] }), h('span', { sinif: 'soluk kucuk', metin: r[1] })]);
      }).filter(function (x) { return x; });
      if (ayrSatirlar.length) govde.appendChild(h('div', { sinif: 'dm-ayr-liste' }, ayrSatirlar));
      var liste = riskliHastaneler();
      govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Riskli hastaneler (' + liste.length + ' İKN×hastane satırı)' }));
      govde.appendChild(liste.length ? G.ilkN(liste, hastaneSatiri, { n: 3, sinif: 'dm-liste' }) : G.bos({ baslik: 'Riskli hastane etiketi yok', metin: 'Riskli, süresi geçmiş ya da teslim edilmemiş etiketli hastane yok.' }));
      govde.appendChild(h('p', { sinif: 'dm-yon', }, [h('a', { href: '#dmo/hastaneler', metin: 'Hastane bazında bütün detay →' })]));
    }

     
    var GRUP_AD = { eldiven: 'Eldiven', spanc: 'Spanç', batin: 'Batın', gazli_bez: 'Gazlı bez', diger: 'Diğer' };
    function acikSatiri(u) {
      var gec = u.gecikmis_kalan > 0, yak = u.kalan_gun_en_yakin;
      var teslimMetin = u.en_yakin_son_teslim ? tarihTR(u.en_yakin_son_teslim) + (yak == null ? '' : (yak < 0 ? ' · ' + Math.abs(yak) + ' gün geçti' : ' · ' + yak + ' gün kaldı')) : 'veri yok';
      var tur = u.tur_ad && u.tur_ad !== 'Diğer' ? u.tur_ad : null;
      return h('div', { sinif: 'dm-sp dm-as' + (gec ? ' riskli' : '') }, [
        h('div', { sinif: 'dm-sp-ust' }, [h('strong', { metin: u.ad || u.urun_kodu }), tur ? h('span', { sinif: 'soluk kucuk', metin: tur }) : null, gec ? h('span', { sinif: 'dm-risk riskli', metin: 'Gecikmiş var' }) : null]),
        h('div', { sinif: 'dm-as-kalan' }, [h('strong', { sinif: 'dm-as-say', metin: say(u.kalan) }), h('span', { sinif: 'soluk', metin: ' adet gönderilecek' })]),
        cubuk(oran(u.sevk_edilen, u.siparis_edilen), 0, null),
        h('div', { sinif: 'dm-sp-orta kucuk' }, [h('span', {}, ['Sipariş ', h('strong', { metin: say(u.siparis_edilen) })]), h('span', {}, ['Sevk ', h('strong', { metin: say(u.sevk_edilen) })]),
          h('span', {}, [say(u.siparis_sayisi) + ' sipariş · ' + say(u.hastane_sayisi) + ' hastane'])]),
        h('div', { sinif: 'dm-sp-alt kucuk' }, [h('span', {}, ['En yakın son teslim ', h('strong', { metin: teslimMetin })]),
          gec ? h('span', { sinif: 'dm-as-gec', metin: 'Geciken ' + say(u.gecikmis_kalan) + ' adet (en çok ' + say(u.en_gec_gecikme_gun) + ' gün)' }) : null,
          u.kalan_MY ? h('span', {}, [firmaRozet('MY'), ' ' + say(u.kalan_MY)]) : null, u.kalan_DAY ? h('span', {}, [firmaRozet('DAY'), ' ' + say(u.kalan_DAY)]) : null,
          u.sap_cikti_portal_bekliyor ? h('span', { sinif: 'soluk', metin: 'Depodan çıkmış, portalda teslim bekliyor: ' + say(u.sap_cikti_portal_bekliyor) }) : null])]);
    }
    function acikSiparisEkrani() {
      var d = yuk.as;
      if (!d) { govde.appendChild(G.bos({ baslik: 'Açık sipariş takibi: veri yok', metin: 'dmo-acik-siparis.json henüz yayımlanmadı ya da okunamadı.' })); return; }
      var t = d.toplam || {}, gr = d.gruplar || {}, ur = d.urunler || [];
      var gecikmis = Object.keys(gr).reduce(function (a, k) { return a + (gr[k].gecikmis_kalan || 0); }, 0);
      var hGec = oran(gecikmis, t.kalan);
      govde.appendChild(h('div', { sinif: 'dm-pano' }, [
        h('div', { sinif: 'dm-pano-ana' }, [
          halka({ boy: 112, deger: hGec, merkez: yuzde(hGec), alt: 'geciken', renk: 'kirmizi', ad: 'Gönderilecek miktarın gecikmiş oranı ' + yuzde(hGec) }),
          h('ul', { sinif: 'dm-hk-lejant' }, [
            h('li', {}, [h('strong', { metin: say(t.kalan) }), ' adet gönderilecek']),
            h('li', {}, [h('strong', { metin: say(gecikmis) }), ' adedi son teslimi geçmiş']),
            h('li', { sinif: 'soluk' }, [firmaRozet('MY'), ' ' + say(t.kalan_MY) + ' · ', firmaRozet('DAY'), ' ' + say(t.kalan_DAY)]),
            h('li', { sinif: 'soluk', metin: say(t.siparis_sayisi) + ' sipariş · ' + say(t.urun_sayisi) + ' ürün' })])]),
        h('div', { sinif: 'dm-pano-yan' }, Object.keys(gr).sort(function (a, b) { return gr[b].kalan - gr[a].kalan; }).slice(0, 3).map(function (k) {
          var p = oran(gr[k].kalan, t.kalan);
          return halkaKutu(GRUP_AD[k] || k, halka({ boy: 76, deger: p, merkez: yuzde(p), renk: k === 'eldiven' ? 'mavi' : 'lacivert', ad: (GRUP_AD[k] || k) + ' payı ' + yuzde(p) }), say(gr[k].kalan) + ' adet');
        }))]));
       
      var ta = d.eldiven_tur_adlari || {};
      var gOps = [['', 'Tümü']].concat(Object.keys(gr).map(function (k) { return [k, GRUP_AD[k] || k]; })).concat(Object.keys(ta).map(function (k) { return ['eldiven:' + k, 'Eldiven · ' + ta[k]]; }));
      govde.appendChild(aracKur([{ ad: 'Ürün grubu', secenekler: gOps, deger: function () { return f.at ? 'eldiven:' + f.at : (f.ag || ''); },
        sec: function (v) { if (v.indexOf('eldiven:') === 0) { f.ag = 'eldiven'; f.at = v.slice(8); } else { f.ag = v; f.at = ''; } } }]));
      if (f.ag === 'eldiven') {
        var et = d.eldiven_turleri || {};
        govde.appendChild(h('div', { sinif: 'dm-st-izgara' }, Object.keys(et).sort(function (a, b) { return et[b].kalan - et[a].kalan; }).map(function (k) {
          return h('div', { sinif: 'dm-st' }, [h('span', { sinif: 'dm-st-ad', metin: (ta[k] || k) + ' · ' + say(et[k].urun_sayisi) + ' beden/kod' }), h('strong', { sinif: 'dm-st-sayi', metin: say(et[k].kalan) })]);
        })));
      }
      var liste = ur.filter(function (u) { return (!f.ag || u.grup === f.ag) && (!f.at || u.tur === f.at); });   
      govde.appendChild(sayiSatiri(liste.length + ' ürün · en çok gönderilecek üstte', 'Açık sipariş takibi', f.at ? 'Eldiven · ' + (ta[f.at] || f.at) : (f.ag ? (GRUP_AD[f.ag] || f.ag) : 'Tümü'),
        [sutun('Ürün', function (u) { return u.ad || u.urun_kodu; }), sutun('Grup', function (u) { return GRUP_AD[u.grup] || u.grup; }), sutun('Gönderilecek adet', function (u) { return u.kalan; }), sutun('Sipariş edilen', function (u) { return u.siparis_edilen; }),
          sutun('Sevk edilen', function (u) { return u.sevk_edilen; }), sutun('Sipariş sayısı', function (u) { return u.siparis_sayisi; }), sutun('Hastane sayısı', function (u) { return u.hastane_sayisi; }),
          sutun('Geciken adet', function (u) { return u.gecikmis_kalan; }), sutun('En yakın son teslim', function (u) { return u.en_yakin_son_teslim; })], liste));
      govde.appendChild(liste.length ? G.ilkN(liste, acikSatiri, { n: 10, sinif: 'dm-liste' }) : G.bos({ baslik: 'Bu görünümde açık sipariş yok' }));
    }

     
    function hastaneSirala(a, b) {
      var ra = a.risk ? RISK_SIRA.indexOf(a.risk) : 9, rb = b.risk ? RISK_SIRA.indexOf(b.risk) : 9;
      return ra - rb || (a.en_yakin_cezali_sure_kalan_gun == null ? 1e9 : a.en_yakin_cezali_sure_kalan_gun) - (b.en_yakin_cezali_sure_kalan_gun == null ? 1e9 : b.en_yakin_cezali_sure_kalan_gun);
    }
    function riskliHastaneler() { return (yuk.v['dmo-ihaleler'].hastaneler || []).filter(function (x) { return (x.riskli_siparis || 0) > 0; }).sort(hastaneSirala); }
     
    function hastaneSiparisleri(x) {
      var ad = x.hastane || 'Hastane';
      G.sheet(ad, function (g) {
        function yaz(tum) {
          var l = tum.filter(function (s) { return s.firma === x.firma && s.hastane_no != null && s.hastane_no === x.hastane_no; }).sort(function (a, b) { return String(a.son_teslim || '').localeCompare(String(b.son_teslim || '')); });
          g.textContent = '';
          if (!l.length) { g.appendChild(G.bos({ baslik: 'Bu hastanede sipariş kalemi yok' })); return; }
          g.appendChild(sayiSatiri(l.length + ' sipariş kalemi', ad, x.firma, [sutun('Sipariş no', function (s) { return sipNo(s); }), sutun('Risk', function (s) { return s.risk ? (RISK_AD[s.risk] || s.risk) : ''; }), sutun('Teslim durumu', function (s) { return TESLIM_AD[s.teslim_durum] || ''; }),
            sutun('Son teslim', function (s) { return s.son_teslim; }), sutun('Miktar', function (s) { return s.miktar; }), sutun('Teslim edilen', function (s) { return s.teslim_edilen_miktar; })], l));
          g.appendChild(G.ilkN(l, function (s) {
            return h('div', { sinif: 'dm-hs-sat' }, [h('div', { sinif: 'dm-sp-ust' }, [h('strong', { metin: 'Sipariş no ' + sipNo(s) }), s.risk ? etiket(s.risk) : null]),
              h('div', { sinif: 'kucuk soluk', metin: (TESLIM_AD[s.teslim_durum] || 'Teslim durumu yok') + ' · son teslim ' + tarihTR(s.son_teslim) + ' · teslim ' + say(s.teslim_edilen_miktar) + ' / ' + say(s.miktar) })]);
          }, { n: 10 }));
        }
        if (yuk && yuk.v && yuk.v['dmo-siparisler']) { yaz(yuk.v['dmo-siparisler'].siparisler || []); return; }
        g.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Yükleniyor…' }));
        window.MMVeri.oku('dmo', 'dmo-siparisler').then(function (r) { yaz((r.veri || {}).siparisler || []); }, function () { g.textContent = ''; g.appendChild(G.bos({ baslik: 'Sipariş verisi şu an yok' })); });
      }).ac();
    }
    function hastaneSatiri(x) {
      var kap = h('div', { sinif: 'dm-hs-kap' }, [hastaneKart(x), x.hastane_no != null ? h('button', { type: 'button', sinif: 'mini-dugme dm-hs-sip', metin: 'Bu hastanenin siparişleri', onclick: function () { hastaneSiparisleri(x); } }) : null]);
      return kap;
    }
    function hastaneKart(x) {
      var uyari = x.uyari_metni || ((x.riskli_siparis || 0) > 0 && x.risk ? RISK_ACIK[x.risk] : null);
      return h('button', { type: 'button', sinif: 'dm-sp dm-hs' + (x.risk ? ' ' + x.risk : ''), onclick: function () { git('#dmo/ihale/' + x.firma + '/' + encodeURIComponent(x.ikn)); } }, [
        h('div', { sinif: 'dm-sp-ust' }, [firmaRozet(x.firma), h('strong', { metin: x.hastane || 'Hastane yok' }), x.il ? h('span', { sinif: 'soluk kucuk', metin: x.il }) : null, x.risk ? etiket(x.risk) : null]),
        h('div', { sinif: 'dm-sp-orta' }, [h('span', {}, ['Sipariş no ', h('strong', { metin: sipNo(x) })]), h('span', { sinif: 'soluk kucuk', metin: iknUrun(x.firma, x.ikn) }),
          h('span', {}, ['Açık sipariş ', h('strong', { metin: say(x.acik_siparis) })]),
          h('span', { sinif: (x.riskli_siparis || 0) > 0 ? 'kritik' : '' }, ['Riskli sipariş ', h('strong', { metin: say(x.riskli_siparis) })]),
          x.en_yakin_cezali_sure_kalan_gun != null ? h('span', { metin: 'Cezalı süre: ' + kalanMetin(x.en_yakin_cezali_sure_kalan_gun) }) : null]),
        uyari ? h('p', { sinif: 'dm-sp-not', metin: uyari }) : null,
        x.lojistik_firmalari ? h('div', { sinif: 'dm-sp-alt' }, [h('span', {}, ['Lojistik ', h('strong', { metin: x.lojistik_firmalari.join(', ') })])]) : null]);
    }
    function hastanelerEkrani() {
      var tum = yuk.v['dmo-ihaleler'].hastaneler || [];
      govde.appendChild(aracKur([{ ad: 'Hastane filtresi', anahtar: 'hs', secenekler: [['', 'Riskli olanlar'], ['acik', 'Açık siparişi olanlar'], ['tum', 'Tümü']] }, FIRMA_GRUP]));
      var liste = tum.filter(function (x) { return (!f.firma || x.firma === f.firma) && (f.hs === 'tum' || (f.hs === 'acik' ? (x.acik_siparis || 0) > 0 : (x.riskli_siparis || 0) > 0)); }).sort(hastaneSirala);
      govde.appendChild(sayiSatiri(liste.length + ' hastane satırı (her satır bir IKN × hastane; aynı hastane birden çok ihalede görünebilir)', 'DMO hastaneler', firmaFiltre() + ' · ' + (f.hs === 'tum' ? 'Tümü' : (f.hs === 'acik' ? 'Açık siparişi olanlar' : 'Riskli olanlar')),
        [sutun('Firma', function (x) { return x.firma; }), sutun('Hastane', function (x) { return x.hastane; }), sutun('İl', function (x) { return x.il; }), sutun('Sipariş no', function (x) { return sipNo(x); }),
          sutun('Açık sipariş', function (x) { return x.acik_siparis; }), sutun('Riskli sipariş', function (x) { return x.riskli_siparis; }), sutun('Risk', function (x) { return x.risk ? (RISK_AD[x.risk] || x.risk) : ''; }),
          sutun('Cezalı süre kalan gün', function (x) { return x.en_yakin_cezali_sure_kalan_gun; })], liste));
      govde.appendChild(liste.length ? G.ilkN(liste, hastaneSatiri, { n: 10, sinif: 'dm-liste' }) : G.bos({ baslik: 'Bu görünümde hastane yok' }));
    }


     
    function ihaleSatiri(i, sec) {
      return h('button', { type: 'button', sinif: 'dm-ihale ' + (i.firma === 'DAY' ? 'day' : 'my'), onclick: function () { git('#dmo/ihale/' + i.firma + '/' + encodeURIComponent(i.ikn)); } }, [
        h('div', { sinif: 'dm-ih-ust' }, [firmaRozet(i.firma), h('strong', { sinif: 'dm-ikn', metin: 'Sipariş no ' + sipNo(i) }), h('span', { sinif: 'soluk kucuk', metin: iknUrun(i.firma, i.ikn) + ' · Sipariş tarihi ' + tarihTR(i.baslangic) }), i.temlik_esigine_ulasti ? h('span', { sinif: 'dm-temlik', metin: 'Temlik eşiği aşıldı' }) : null,
          i.yasak_durumu && i.yasak_durumu !== 'yesil' ? h('span', { sinif: 'dm-yasak-et ' + i.yasak_durumu, metin: i.yasak_asim_teyitsiz ? 'İptal kotası aşım' : 'Yasak sınırına yakın' }) : null,
          halka({ boy: 60, sinif: 'ust-sag', deger: i.teslim_ciro_yuzde, merkez: yuzde(i.teslim_ciro_yuzde), esik: i.temlik_esik_yuzde, renk: 'mavi', ad: 'Teslim ' + yuzde(i.teslim_ciro_yuzde) + (i.temlik_esik_yuzde != null ? ', temlik eşiği ' + yuzde(i.temlik_esik_yuzde) : '') })]),
        h('div', { sinif: 'dm-ad', metin: i.ad || 'Ad yok' }),
        ihaleTarihleri(i),
        cubuk(i.teslim_ciro_yuzde, i.kabul_ciro_yuzde, i.temlik_esik_yuzde),
        h('div', { sinif: 'dm-ih-alt' }, [
          h('span', {}, ['Hastane ', h('strong', { metin: say(i.teslim_edilen_hastane) + ' / ' + say(i.hastane_sayisi_pencere) + ' hastane' })]),
          h('span', {}, ['Teslim (ciro) ', h('strong', { metin: yuzde(i.teslim_ciro_yuzde) })]),
          h('span', {}, ['Kabul (ciro) ', h('strong', { metin: yuzde(i.kabul_ciro_yuzde) })]),
          fiyatGor() && !(sec && sec.cirosuz === true) ? h('span', {}, ['Ciro ', h('strong', { metin: tl(fIhale(i).toplam_ciro_kdv_haric_tl) })]) : null,
          h('span', {}, ['Açık ', h('strong', { metin: say(i.acik_siparis) + ' sipariş' })]),
          (i.riskli_toplam_siparis || 0) > 0 ? h('span', { sinif: 'dm-ih-risk' }, ['Riskli ', h('strong', { metin: say(i.riskli_toplam_siparis) + ' sipariş' })]) : null,
          (i.cezali_surede_siparis || 0) > 0 ? h('span', { sinif: 'dm-ih-risk' }, ['Cezalı sürede ', h('strong', { metin: say(i.cezali_surede_siparis) + ' sipariş' })]) : null])]);
    }
     
    function aralik(a, b) { if (!a && !b) return 'veri yok'; return a === b || !b ? tarihTR(a) : tarihTR(a) + ' – ' + tarihTR(b); }
    function ihaleTarihleri(i) {
      var ek = i.ek_sure_var == null ? 'veri yok' : (i.ek_sure_var ? 'Var (' + say(i.ek_sure_var_siparis) + ' sipariş)' : 'Yok');
      return h('div', { sinif: 'dm-tarih' }, [
        h('span', {}, [h('em', { metin: 'Başlangıç' }), h('strong', { metin: tarihTR(i.baslangic) })]),
        h('span', {}, [h('em', { metin: 'Son teslim' }), h('strong', { metin: aralik(i.son_teslim_ilk, i.son_teslim_son) })]),
        h('span', {}, [h('em', { metin: 'Cezalı süre sonu (en yakın)' }), h('strong', { metin: tarihTR(i.cezali_sure_sonu_en_yakin) })]),
        h('span', {}, [h('em', { metin: 'Ek süre' }), h('strong', { metin: ek })])]);
    }
    function yilAy(i) { var k = i.siparis_ay_yil; return k ? k.split('-') : [null, null]; }
    function ihaleListesi() {
      var tum = yuk.v['dmo-ihaleler'].ihaleler;
      var yillar = {}, aylar = {};
      tum.forEach(function (i) { var p = yilAy(i); if (p[0]) { yillar[p[0]] = 1; aylar[p[1]] = 1; } });
      var firmaSay = function (x) { return tum.filter(function (i) { return !x || i.firma === x; }).length; };
      var yl = Object.keys(yillar).sort().reverse(), al = Object.keys(aylar).sort();
      govde.appendChild(aracKur([
        { ad: 'Firma', anahtar: 'firma', secenekler: [['', 'Tüm firmalar', firmaSay('')], ['MY', 'MY', firmaSay('MY')], ['DAY', 'DAY', firmaSay('DAY')]] },
        { ad: 'Yıl', anahtar: 'yil', secenekler: [['', 'Tüm yıllar']].concat(yl.map(function (y) { return [y, y]; })) },
        { ad: 'Ay', anahtar: 'ay', secenekler: [['', 'Tüm aylar']].concat(al.map(function (a) { return [a, AY[Number(a) - 1]]; })) }]));
      var liste = tum.filter(function (i) { var p = yilAy(i); return (!f.firma || i.firma === f.firma) && (!f.yil || p[0] === f.yil) && (!f.ay || p[1] === f.ay); });
      govde.appendChild(sayiSatiri(liste.length + ' ihale · çubuk: koyu = hastane kabulü, açık = teslim, çizgi = temlik eşiği', 'DMO ihaleler', firmaFiltre() + (f.yil ? ' · ' + f.yil : '') + (f.ay ? ' · ' + AY[Number(f.ay) - 1] : ''),
        [sutun('Firma', function (i) { return i.firma; }), sutun('Sipariş no', function (i) { return sipNo(i); }), sutun('Ad', function (i) { return i.ad; }), sutun('Sipariş tarihi', function (i) { return i.baslangic; }),
          sutun('Teslim (ciro) %', function (i) { return i.teslim_ciro_yuzde; }), sutun('Kabul (ciro) %', function (i) { return i.kabul_ciro_yuzde; }), sutun('Açık sipariş', function (i) { return i.acik_siparis; }),
          sutun('Riskli sipariş', function (i) { return i.riskli_toplam_siparis; }), sutun('Cezalı sürede', function (i) { return i.cezali_surede_siparis; })], liste));
      if (!liste.length) { govde.appendChild(G.bos({ baslik: 'Bu filtrede ihale yok', metin: 'Filtreleri değiştirin.' })); return; }
      var gruplar = {}, sirali = [];   
      liste.forEach(function (i) { var k = i.siparis_ay_yil || ''; (gruplar[k] = gruplar[k] || []).push(i); });
      Object.keys(gruplar).sort().reverse().forEach(function (k) { sirali = sirali.concat(gruplar[k]); });
      govde.appendChild(G.ilkN(sirali, ihaleSatiri, { n: 10, sinif: 'dm-ihale-izgara' }));
    }

     
    function ihaleDetay(firma, ikn) {
      var i = ihaleBul(firma, ikn);
      govde.appendChild(h('a', { sinif: 'dm-geri', href: '#dmo/ihaleler', metin: '← İhaleler' }));
      if (!i) { govde.appendChild(G.bos({ baslik: 'İhale bulunamadı', metin: firma + ' ' + ikn + ' veri dosyasında yok.' })); return; }
      govde.appendChild(h('div', { sinif: 'dm-ayr-ust' }, [firmaRozet(i.firma), h('h2', { sinif: 'dm-ayr-ikn', metin: 'Sipariş no ' + sipNo(i) })]));
      govde.appendChild(h('p', { sinif: 'dm-ayr-ad', metin: i.ad || 'Ad yok' }));
      govde.appendChild(h('p', { sinif: 'kucuk soluk', metin: iknUrun(i.firma, i.ikn) + ' · sipariş ayı ' + ayAd(i.siparis_ay_yil) + ' · sipariş tarihi ' + tarihTR(i.baslangic) }));

      govde.appendChild(ihaleTarihleri(i));
       
      var hsOran = oran(i.teslim_edilen_hastane, i.hastane_sayisi_pencere), kgl = i.kota_gruplari || [], kgYakin = i.kota_yakin_veya_asan_grup, ysOran = kgl.length ? oran(kgYakin, kgl.length) : null;
      var esikTxt = i.temlik_esigine_ulasti == null ? 'Temlik: veri yok' : (i.temlik_esigine_ulasti ? 'Temlik eşiğine ulaşıldı' : 'Temlik eşiğine kalan ' + yuzde(i.temlik_esigine_kalan_yuzde));
      govde.appendChild(h('section', { sinif: 'dm-pano' }, [
        h('div', { sinif: 'dm-pano-ana' }, [
          halka({ boy: 168, deger: i.teslim_ciro_yuzde, ikinci: i.kabul_ciro_yuzde == null ? null : i.kabul_ciro_yuzde, esik: i.temlik_esik_yuzde, renk: 'mavi', renk2: 'lacivert', merkez: yuzde(i.teslim_ciro_yuzde), alt: 'teslim', sinif: 'buyuk', ad: 'Teslim ' + yuzde(i.teslim_ciro_yuzde) + ', hastane kabulü ' + yuzde(i.kabul_ciro_yuzde) + ', temlik eşiği ' + yuzde(i.temlik_esik_yuzde) }),
          h('ul', { sinif: 'dm-hk-lejant' }, [
            h('li', {}, [h('i', { sinif: 'mavi' }), 'Teslim (DMO teslimat) ', h('strong', { metin: yuzde(i.teslim_ciro_yuzde) })]),
            h('li', {}, [h('i', { sinif: 'lacivert' }), 'Hastane kabulü ', h('strong', { metin: yuzde(i.kabul_ciro_yuzde) })]),
            h('li', {}, [h('i', { sinif: 'esik' }), 'Temlik eşiği ', h('strong', { metin: yuzde(i.temlik_esik_yuzde) })]),
            h('li', { sinif: i.temlik_esigine_ulasti ? 'iyi' : 'soluk', metin: esikTxt })])]),
        h('div', { sinif: 'dm-pano-yan' }, [
          halkaKutu('Hastane teslim', halka({ boy: 84, deger: hsOran, merkez: yuzde(hsOran), renk: 'yesil', ad: 'Teslim edilen hastane oranı ' + yuzde(hsOran) }), say(i.teslim_edilen_hastane) + ' / ' + say(i.hastane_sayisi_pencere)),
          halkaKutu('İptal kotası', halka({ boy: 84, deger: ysOran, merkez: kgl.length ? say(kgYakin) + '/' + say(kgl.length) : '—', renk: i.yasak_asim_teyitsiz ? 'kirmizi' : (i.yasak_durumu === 'sari' ? 'sari' : 'yesil'), ad: 'Sınıra yakın veya aşan kota grubu ' + say(kgYakin) + ' / ' + say(kgl.length) }), kgl.length ? 'sınıra yakın/aşan grup (sipariş × SMT)' : 'veri yok')])]));
      var fg = fiyatGor(), fi = fIhale(i);   
      govde.appendChild(h('div', { sinif: 'dm-buyuk' }, [
        fg ? h('div', { sinif: 'dm-buyuk-k' }, [h('span', { metin: 'Bu IKN toplam ciro (son 90 gün)' }), h('strong', { metin: tl(fi.toplam_ciro_kdv_haric_tl) })]) : h('div', { sinif: 'dm-buyuk-k' }, [h('span', { metin: 'Açık / riskli sipariş' }), h('strong', { metin: say(i.acik_siparis) + ' / ' + say(i.riskli_toplam_siparis) })]),
        h('div', { sinif: 'dm-buyuk-k' }, [h('span', { metin: 'Teslim edilen (DMO teslimat)' }), h('strong', { metin: fg ? tl(fi.teslim_edilen_ciro_kdv_haric_tl) : yuzde(i.teslim_ciro_yuzde) }), fg ? h('small', { metin: yuzde(i.teslim_ciro_yuzde) }) : null]),
        h('div', { sinif: 'dm-buyuk-k' }, [h('span', { metin: 'Hastane kabul etti' }), h('strong', { metin: fg ? tl(fi.hastane_kabul_ciro_kdv_haric_tl) : yuzde(i.kabul_ciro_yuzde) }), fg ? h('small', { metin: yuzde(i.kabul_ciro_yuzde) }) : null])]));

       
      var temlik = h('div', null, [cubuk(i.teslim_ciro_yuzde, i.kabul_ciro_yuzde, i.temlik_esik_yuzde),
        h('p', { sinif: 'dm-aciklama' }, [i.temlik_esigine_ulasti == null ? 'Temlik durumu: veri yok.' : (i.temlik_esigine_ulasti ? 'Temlik eşiğine ulaşıldı (hastane kabulü ' + yuzde(i.kabul_ciro_yuzde) + ').' : 'Temlik eşiğine kalan: ' + yuzde(i.temlik_esigine_kalan_yuzde) + ' (hastane kabulü ' + yuzde(i.kabul_ciro_yuzde) + ', eşik ' + yuzde(i.temlik_esik_yuzde) + ').')]),
        h('p', { sinif: 'kucuk soluk', metin: 'Teslim edilip hastane kabul eden ciro eşiğe ulaşınca temliğe başvurulur.' })]);
      govde.appendChild(G.kart({ baslik: 'Temlik eşiği (sipariş no ' + sipNo(i) + ')', alt: 'Sipariş no düzeyi · yüzdeler ciro (TL) bazında: teslim edilen ve hastane kabulü', govde: temlik }));

       
      govde.appendChild(G.kart({ baslik: 'Hastaneler', alt: 'son 90 gün', govde: h('div', { sinif: 'dm-oge-izgara' }, [
        ikiSatir('Toplam hastane', say(i.hastane_sayisi_pencere) + ' hastane'), ikiSatir('Teslim edilen', say(i.teslim_edilen_hastane) + ' hastane'),
        ikiSatir('Teslim bekleyen', say(i.teslim_bekleyen_hastane) + ' hastane'), ikiSatir('İptal siparişi', say(i.iptal_siparis_sayisi) + ' sipariş'),
        ikiSatir('Açık sipariş', say(i.acik_siparis) + ' sipariş'), ikiSatir('Riskli sipariş', say(i.riskli_toplam_siparis), (i.riskli_toplam_siparis || 0) > 0 ? 'kritik' : ''), ikiSatir('Cezalı sürede (son teslim geçti)', say(i.cezali_surede_siparis), (i.cezali_surede_siparis || 0) > 0 ? 'kritik' : ''),
        ikiSatir('Teslim edilmedi (irsaliye)', say(i.teslim_alinmadi_siparis)), ikiSatir('Son teslim yakın', say(i.son_teslim_yakin_siparis)),
        ikiSatir('Temlik uyarısı (sipariş)', say(i.temlik_uyari_siparis)), ikiSatir('Lojistik firması', i.lojistik_firmalari ? i.lojistik_firmalari.join(', ') : 'Lojistik firması henüz eşleşmedi')]), dip: 'Teslim edilen ve bekleyen hastane kalem bazlıdır; bir hastane iki grupta da olabilir.' }));
      var hs = (yuk.v['dmo-ihaleler'].hastaneler || []).filter(function (x) { return x.firma === i.firma && x.ikn === i.ikn; }).sort(hastaneSirala);
      govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Hastane bazında (' + hs.length + ')' }));
      govde.appendChild(hs.length ? G.ilkN(hs, hastaneSatiri, { n: 8, sinif: 'dm-liste' }) : G.bos({ baslik: 'Bu ihalede hastane satırı yok' }));

       
       
      var yb = h('div');
      if (!kgl.length) yb.appendChild(h('p', { sinif: 'dm-yok', metin: 'Kota grubu verisi yok.' }));
      else {
        yb.appendChild(h('div', { sinif: 'dm-pano-yan' }, kgl.map(function (g) {
          var hakSifir = !g.iptal_hakki_hastane, dolu = hakSifir ? (g.kullanilan_iptal_hastane > 0 ? 100 : 0) : oran(g.kullanilan_iptal_hastane, g.iptal_hakki_hastane);   
          var renk = g.yasak_asim_teyitsiz ? 'kirmizi' : (g.yasak_durumu === 'sari' ? 'sari' : 'yesil');
          var turAd = g.grup_adi || ({ nitril: 'Nitril', pudrali_lateks: 'Pudralı lateks', pudrasiz_lateks_muayene: 'Pudrasız lateks', cerrahi_lateks: 'Cerrahi lateks', spanc: 'Spanç', batin: 'Batın', gazli_bez: 'Gazlı bez' })[g.urun_turu] || (g.urun_turu ? 'Eşleşmeyen ' + String(g.urun_turu).replace('eslesmeyen:', '') : 'veri yok');
          return halkaKutu(turAd, halka({ boy: 84, deger: dolu, merkez: say(g.kullanilan_iptal_hastane) + '/' + say(g.iptal_hakki_hastane), renk: renk, ad: turAd + ' iptal hakkı: ' + say(g.kullanilan_iptal_hastane) + ' kullanıldı, hak ' + say(g.iptal_hakki_hastane) }),
            say(g.hastane_sayisi_toplam != null ? g.hastane_sayisi_toplam : g.hastane_sayisi_pencere) + ' hastane (' + (/^siparişin tamamı/.test(g.hastane_kaynagi || '') ? 'siparişin tamamı' : '90 gün') + ') · dosya ' + say(g.dosya_no) + (g.yasak_asim_teyitsiz ? ' · kota aşıldı' : (g.yasak_durumu === 'sari' ? ' · sınıra yakın' : '')));
        })));
      }
      govde.appendChild(G.kart({ baslik: 'İptal kotası (%10, en az 3) · sipariş no ' + sipNo(i), alt: 'yalnız sipariş no düzeyinde: %10, en az 3 (hastane azsa hastane sayısı kadar) · sipariş mektubu × teknik şartname kodu (SMT) bazında', govde: yb }));

       
      if (fg) govde.appendChild(G.kart({ baslik: 'Gerçekleşen ceza', govde: h('p', { sinif: 'dm-buyuk-metin', metin: fi.gerceklesen_ceza_tl == null ? 'Bu ihaleye bağlanan kesinti yok / veri yok' : tl(fi.gerceklesen_ceza_tl) }) }));

       
       

       
      if (tbVar()) {
        var ib = belgeIdleri('ikn_belge', i.firma + '|' + i.ikn).map(belgeNesne).filter(Boolean);
        govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Teslim belgeleri (' + ib.length + ')' }));
        govde.appendChild(ib.length ? G.ilkN(ib, function (b) { var e = (b.eslesmeler || []).filter(function (x) { return x.firma === i.firma && x.ikn === i.ikn; })[0]; return belgeSatiri(b, e ? ESL_AD[e.kaynak] : null); }, { n: 5, sinif: 'dm-liste' }) : G.bos({ baslik: 'Bu ihaleye bağlı teslim belgesi yok' }));
      } else govde.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Teslim belgesi verisi yok' }));

       
      var kal =yuk.v['dmo-siparisler'].siparisler.filter(function (s) { return s.firma === i.firma && s.ikn === i.ikn; });
      kal.sort(function (a, b) { var ra = a.risk ? RISK_SIRA.indexOf(a.risk) : 9, rb = b.risk ? RISK_SIRA.indexOf(b.risk) : 9; return ra - rb || (a.cezali_sure_kalan_gun == null ? 1e9 : a.cezali_sure_kalan_gun) - (b.cezali_sure_kalan_gun == null ? 1e9 : b.cezali_sure_kalan_gun); });
      govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Sipariş kalemleri (' + kal.length + ')' }));
      govde.appendChild(kal.length ? G.ilkN(kal, siparisSatiri, { n: 10, sinif: 'dm-liste' }) : G.bos({ baslik: 'Bu ihalede sipariş kalemi yok' }));
    }

    function yerelKey(i) { return 'mm-dmo-fiyat-' + i.firma + '-' + i.ikn; }
    function fiyatPaneli(i) {
      var kayit = null; try { if (window.MM_DEPO) kayit = JSON.parse(window.MM_DEPO.getItem(yerelKey(i)) || 'null'); } catch (e) { }
      var giris = h('input', { type: 'text', inputmode: 'decimal', sinif: 'dm-girdi', id: 'dm-fiyat', placeholder: 'Birim fiyat (TL)', autocomplete: 'off', value: kayit && kayit.fiyat ? kayit.fiyat : '' });
      var not = h('input', { type: 'text', sinif: 'dm-girdi', id: 'dm-not', placeholder: 'Not (isteğe bağlı)', autocomplete: 'off', value: kayit && kayit.not ? kayit.not : '' });
      var durum = h('p', { sinif: 'kucuk soluk', role: 'status', metin: kayit ? 'Yerel taslak kayıtlı: ' + kayit.zaman : 'Henüz taslak yok.' });
      var kaydet = h('button', { type: 'button', sinif: 'dugme', onclick: function () {
        var z = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date());
        try { if (!window.MM_DEPO) throw new Error('depo yok'); window.MM_DEPO.setItem(yerelKey(i), JSON.stringify({ fiyat: giris.value.trim(), not: not.value.trim(), zaman: z + ' (TR)' })); durum.textContent = 'Yerel taslak kaydedildi: ' + z + ' (TR) — yalnız bu cihazda.'; } catch (e) { durum.textContent = 'Kaydedilemedi (tarayıcı depolaması kapalı).'; } } }, ['Taslağı kaydet (yerel)']);
      var gonder = h('button', { type: 'button', sinif: 'dugme ikincil', disabled: true, 'aria-disabled': 'true', title: 'Portal şu an salt okuma; gönderim ayrı yetki' }, ['Portala gönder']);
      return G.kart({ baslik: 'Fiyat girişi (taslak)', govde: h('div', { sinif: 'dm-fiyat' }, [
        h('label', { sinif: 'dm-etiket', for: 'dm-fiyat', metin: 'Birim fiyat' }), giris, h('label', { sinif: 'dm-etiket', for: 'dm-not', metin: 'Not' }), not,
        h('div', { sinif: 'dm-dugmeler' }, [kaydet, gonder]), durum,
        h('p', { sinif: 'dm-ipucu', metin: 'Portala gönder kapalı: portal şu an salt okuma; gönderim ayrı yetkiyle açılacak. Taslak şimdilik yalnız bu cihazda durur.' })]) });
    }
    function maliyetPaneli(i) {
      var gv = h('div', { sinif: 'dm-maliyet' }, [h('p', { sinif: 'kucuk soluk', metin: 'Maliyet yükleniyor…' })]);
      window.MMVeri.oku('dmo', 'dmo-maliyet', 'dmo-maliyet').then(function (r) {
        var k = (r.veri.kayitlar || []).filter(function (x) { return x.firma === i.firma && x.ikn === i.ikn; });
        gv.textContent = '';
        if (!k.length) gv.appendChild(h('p', { sinif: 'dm-yok', metin: 'Maliyet verisi yok' }));
        else k.forEach(function (x) { gv.appendChild(h('div', { sinif: 'dm-oge-izgara' }, [ikiSatir('Maliyet', tl(x.maliyet_tl)), ikiSatir('Önerilen fiyat', tl(x.onerilen_fiyat_tl))])); });
      }).catch(function (e) { gv.textContent = ''; gv.appendChild(h('p', { sinif: 'dm-yok', metin: 'Maliyet verisi şu an yok' })); });
      return G.kart({ baslik: 'Maliyet ve önerilen fiyat', govde: gv });
    }

     
    function siparisSatiri(s) {
      var r = s.risk;
      var kalan = s.cezali_sure_kalan_gun;
      var satir = [
        h('div', { sinif: 'dm-sp-ust' }, [firmaRozet(s.firma), h('strong', { metin: s.hastane || 'Hastane yok' }), s.il ? h('span', { sinif: 'soluk kucuk', metin: s.il }) : null, r ? etiket(r) : null]),
        h('div', { sinif: 'dm-sp-orta' }, [
          h('span', {}, ['Sipariş no ', h('strong', { metin: sipNo(s) })]),
          h('span', { sinif: 'soluk kucuk', metin: 'Satın alma sip. ' + s.siparis_no + (s.parti_no != null ? ' / ' + s.parti_no : '') + ' · ' + iknUrun(s.firma, s.ikn) }),
          h('span', {}, [TESLIM_AD[s.teslim_durum] || 'Teslim durumu yok'])]),
        h('div', { sinif: 'dm-sp-alt' }, [
          h('span', {}, ['Son teslim ', h('strong', { metin: tarihTR(s.son_teslim) })]),
          h('span', {}, ['Cezalı süre sonu ', h('strong', { metin: tarihTR(s.cezali_sure_sonu) })]),
           
          s.teslim_durum === 'tamamlandi' ? h('span', { sinif: 'soluk', metin: 'Teslim tamamlandı' })
            : (s.siparis_durum === 'iptal' ? h('span', { sinif: 'soluk', metin: (s.iptal_kaynagi && s.iptal_kaynagi.indexOf('süre doldu') === 0) ? 'İptale düştü (süre doldu)' : 'Sipariş iptal' })
              : (s.siparis_durum !== 'acik' ? h('span', { sinif: 'soluk', metin: 'Sipariş kapalı' }
              ) : h('span', { sinif: kalan != null && kalan <= 3 ? 'kritik' : '' }, ['Cezalı süre: ' + kalanMetin(kalan)]))),
          h('span', {}, ['Teslim ', h('strong', { metin: say(s.teslim_edilen_miktar) + ' / ' + say(s.miktar) })])])];
       
      var oranEl = s.siparis_teslim_tamam_oran_yuzde;
      satir.push(h('div', { sinif: 'dm-sp-alt' }, [
        h('span', {}, ['Teslim oranı (sipariş, DMO tamamlandı) ', h('strong', { metin: yuzde(oranEl) })]),
        s.siparis_tamamlandi ? h('span', { sinif: 'dm-temlik', metin: 'Sipariş tamamlandı (%100)' }) : null,
         
        s.lojistik_firma ? h('span', {}, ['Lojistik ', h('strong', { metin: s.lojistik_firma + (s.lojistik_no ? ' · ' + s.lojistik_no : '') }), s.lojistik_kaynak === 'kargo_portal' ? h('span', { sinif: 'soluk kucuk', metin: ' (kargo portalı)' }) : null]) : h('span', { sinif: 'soluk', metin: 'Lojistik firması henüz eşleşmedi' }),
        fiyatGor() ? h('span', {}, ['Birim fiyat ', h('strong', { metin: tl(fSip(s).birim_fiyat_kdv_haric_tl) }), ' · tutar (KDV hariç) ', h('strong', { metin: tl(fSip(s).tutar_kdv_haric_tl) })]) : null]));
      if (s.uyari_metni) satir.push(h('p', { sinif: 'dm-sp-not uyari', metin: s.uyari_metni + (s.irsaliye_tarihi ? ' (irsaliye ' + tarihTR(s.irsaliye_tarihi) + ')' : '') }));
      if (r === 'ek_sure_iste') satir.push(h('p', { sinif: 'dm-sp-not', metin: 'Ek süre başvurusu son gün ' + tarihTR(s.ek_sure_basvuru_son_gun) + ' (' + kalanMetin(s.ek_sure_basvuru_kalan_gun) + ').' }));
      if (r === 'itiraz') satir.push(h('p', { sinif: 'dm-sp-not', metin: RISK_ACIK.itiraz + ' Teslim tarihi (portal): ' + tarihTR(s.teslim_tarihi) + '.' }));
       
      var bid = belgeIdleri('siparis_belge', s.firma + '|' + s.siparis_no);
      if (bid.length) {
        var bl = bid.map(belgeNesne).filter(Boolean), tr = bl.map(function (b) { return b.tarih; }).sort();
        satir.push(h('div', { sinif: 'dm-sp-alt' }, [h('span', { sinif: 'dm-temlik' + (s.siparis_durum === 'acik' && s.teslim_durum !== 'tamamlandi' ? ' uyari' : ''), metin: 'Teslim belgesi var (' + bl.length + ')' }),
          h('span', {}, ['Belge tarihi ', h('strong', { metin: tarihTR(tr[0]) + (tr.length > 1 ? ' – ' + tarihTR(tr[tr.length - 1]) : '') })]),
          s.siparis_durum === 'acik' && s.teslim_durum !== 'tamamlandi' ? h('span', { sinif: 'soluk', metin: 'Portalda teslim girişi tamam değil; belge itiraz kanıtı olabilir' }) : null]));
      }
      return h('article', { sinif: 'dm-sp' + (r ? ' ' + r : '') }, satir);
    }
    function siparisEkrani() {
      var tum = yuk.v['dmo-siparisler'].siparisler;
      var ops = [['', 'Tüm etiketliler'], ['riskli_toplam', RISK_AD.riskli_toplam]].concat(RISK_SIRA.map(function (r) { return [r, RISK_AD[r]]; })).concat([['acik', 'Tüm açık siparişler']]);   
      govde.appendChild(aracKur([{ ad: 'Risk etiketi', anahtar: 'risk', secenekler: ops }, FIRMA_GRUP]));
      if (f.risk && RISK_ACIK[f.risk]) govde.appendChild(h('p', { sinif: 'dm-aciklama', metin: RISK_ACIK[f.risk] }));
      var liste = tum.filter(function (s) { return (!f.firma || s.firma === f.firma) && (f.risk === 'acik' ? s.siparis_durum === 'acik' : (f.risk ? etiketVar(s, f.risk) : !!s.risk)); });   
      liste.sort(function (a, b) { var ra = a.risk ? RISK_SIRA.indexOf(a.risk) : 9, rb = b.risk ? RISK_SIRA.indexOf(b.risk) : 9; return ra - rb || (a.cezali_sure_kalan_gun == null ? 1e9 : a.cezali_sure_kalan_gun) - (b.cezali_sure_kalan_gun == null ? 1e9 : b.cezali_sure_kalan_gun); });
      govde.appendChild(sayiSatiri(liste.length + ' sipariş kalemi (özet kartları tekil sipariş sayar; bir sipariş birden çok kalem olabilir)', 'DMO siparişler', firmaFiltre() + ' · ' + (f.risk ? (RISK_AD[f.risk] || f.risk) : 'Tüm etiketliler'),
        [sutun('Firma', function (s) { return s.firma; }), sutun('Hastane', function (s) { return s.hastane; }), sutun('İl', function (s) { return s.il; }), sutun('Sipariş no', function (s) { return sipNo(s); }),
          sutun('Risk', function (s) { return s.risk ? (RISK_AD[s.risk] || s.risk) : ''; }), sutun('Teslim durumu', function (s) { return TESLIM_AD[s.teslim_durum] || ''; }), sutun('Son teslim', function (s) { return s.son_teslim; }),
          sutun('Cezalı süre sonu', function (s) { return s.cezali_sure_sonu; }), sutun('Miktar', function (s) { return s.miktar; }), sutun('Teslim edilen', function (s) { return s.teslim_edilen_miktar; })], liste));
      govde.appendChild(liste.length ? G.ilkN(liste, siparisSatiri, { n: 10, sinif: 'dm-liste' }) : G.bos({ baslik: 'Bu görünümde kalem yok' }));
    }

     
    var MUAYENE_AD = { urun_degisimi_yapildi: 'Ürün değişimi yapıldı', itiraz_edildi: 'İtiraz edildi', islem_yapilmadi_sure_doldu: 'İşlem yapılmadı, süre doldu', islem_bekleniyor: 'İşlem bekleniyor' };
    function muayeneEkrani() {
      var liste = yuk.v['dmo-muayene'].muayene, fk = yuk.v['dmo-ozet'].firmalar || {};
      govde.appendChild(aracKur([FIRMA_GRUP]));
      var l = liste.filter(function (m) { return !f.firma || m.firma === f.firma; });
      if (!l.length) {
        govde.appendChild(G.bos({ baslik: 'Olumsuz muayene kaydı yok', metin: 'Son 90 günde olumsuz muayene görünmüyor.' }));
        return;
      }
      l.sort(function (a, b) { return (b.aksiyon_gerekli ? 1 : 0) - (a.aksiyon_gerekli ? 1 : 0) || (a.islem_kalan_gun == null ? 1e9 : a.islem_kalan_gun) - (b.islem_kalan_gun == null ? 1e9 : b.islem_kalan_gun); });
      var ms = (yuk.v['dmo-ozet'].firmalar || {});
      var sayilar = ['MY', 'DAY'].filter(function (fa) { return !f.firma || f.firma === fa; }).map(function (fa) { return (ms[fa] || {}).muayene_durum_sayilari || {}; });
      function topla(k) { return sayilar.reduce(function (t, o) { return t + (o[k] || 0); }, 0); }
      govde.appendChild(h('div', { sinif: 'dm-oge-izgara dm-muay-say' }, [ikiSatir('İşlem bekleniyor', say(topla('islem_bekleniyor')), topla('islem_bekleniyor') ? 'kritik' : ''), ikiSatir('Ürün değişimi yapıldı', say(topla('urun_degisimi_yapildi'))), ikiSatir('İtiraz edildi', say(topla('itiraz_edildi'))), ikiSatir('Süre doldu, işlem yok', say(topla('islem_yapilmadi_sure_doldu')))]));
      govde.appendChild(sayiSatiri(l.length + ' kayıt · 15 günlük değişim süresi "işlem son tarihi"nden izlenir · ret gerekçesi metni kaynakta yok', 'Olumsuz muayeneler', firmaFiltre(),
        [sutun('Firma', function (m) { return m.firma; }), sutun('Hastane', function (m) { return m.hastane; }), sutun('Sipariş no', function (m) { return sipNo(m); }), sutun('Durum', function (m) { return MUAYENE_AD[m.durum] || m.durum_portal || ''; }),
          sutun('İşlem son tarihi', function (m) { return m.islem_son_tarihi; }), sutun('Kalan gün', function (m) { return m.islem_kalan_gun; }), sutun('Teslimat', function (m) { return m.teslimat_miktari; })], l));
      govde.appendChild(G.ilkN(l, function (m) {
        return h('article', { sinif: 'dm-sp' + (m.aksiyon_gerekli ? ' riskli' : '') }, [
          h('div', { sinif: 'dm-sp-ust' }, [firmaRozet(m.firma), h('strong', { metin: m.hastane || 'Hastane yok' }), m.aksiyon_gerekli ? h('span', { sinif: 'dm-risk riskli', metin: 'İşlem gerekli' }) : null]),
          h('div', { sinif: 'dm-sp-orta' }, [h('span', {}, ['Sipariş no ', h('strong', { metin: sipNo(m) })]), h('span', { sinif: 'soluk kucuk', metin: 'Satın alma sip. ' + (m.siparis_no || 'veri yok') + ' · ' + (m.ikn ? iknUrun(m.firma, m.ikn) : 'IKN eşleşmedi') }), h('span', { metin: MUAYENE_AD[m.durum] || m.durum_portal || 'Durum yok' })]),
          h('div', { sinif: 'dm-sp-alt' }, [h('span', {}, ['İşlem son tarihi ', h('strong', { metin: tarihTR(m.islem_son_tarihi) })]), h('span', { metin: kalanMetin(m.islem_kalan_gun) }), h('span', {}, ['Teslimat ', h('strong', { metin: say(m.teslimat_miktari) })])])]);
      }, { n: 10, sinif: 'dm-liste' }));
    }

     
    function cezaEkrani() {
      var c = yuk.v['dmo-ceza'];
      var fg = fiyatGor(), t = fg && yuk.fy ? yuk.fy.cezaToplam : {};   
      var satirSay = function (fa) { return c.ceza.filter(function (x) { return x.firma === fa; }).length; };
      govde.appendChild(h('div', { sinif: 'dm-iki' }, ['MY', 'DAY'].map(function (fa) {
        return h('div', { sinif: 'dm-buyuk-k kutu ' + (fa === 'DAY' ? 'day' : 'my') }, [h('span', {}, [firmaRozet(fa), ' Gerçekleşen kesinti']), h('strong', { metin: fg ? tl(t[fa]) : say(satirSay(fa)) + ' kesinti satırı' })]);
      })));
      var dn = c.donem || {}, es = fg && yuk.fy ? yuk.fy.cezaEsles : {};
      var dnMetin = ['MY', 'DAY'].filter(function (fa) { return dn[fa] && dn[fa].bas; }).map(function (fa) { return fa + ' ' + tarihTR(dn[fa].bas) + '–' + tarihTR(dn[fa].son); }).join(' · ');
      govde.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Dönem (fatura tarihi): ' + (dnMetin || 'veri yok') + '.' + (fg ? ' Önceki siparişlere ait kesinti: MY ' + tl(es.MY) + ' · DAY ' + tl(es.DAY) + '.' : '') }));
      govde.appendChild(aracKur([FIRMA_GRUP]));
      var l = c.ceza.filter(function (x) { return !f.firma || x.firma === f.firma; }).slice().sort(function (a, b) { return String(b.fatura_tarihi || '').localeCompare(String(a.fatura_tarihi || '')); });
      if (!l.length) { govde.appendChild(G.bos({ baslik: 'Kesinti kaydı yok', metin: 'Kaynakta bu filtrede kesinti satırı görünmüyor.' })); return; }
      govde.appendChild(sayiSatiri(l.length + ' kesinti satırı', 'DMO ceza kesintileri', firmaFiltre(),
        [sutun('Firma', function (x) { return x.firma; }), sutun('Hastane', function (x) { return x.hastane; }), sutun('Sipariş no', function (x) { return sipNo(x); }), sutun('Ceza tipi', function (x) { return x.ceza_tipi; }),
          sutun('Fatura no', function (x) { return x.fatura_no; }), sutun('Fatura tarihi', function (x) { return x.fatura_tarihi; })], l));
      govde.appendChild(G.ilkN(l, function (x) {
        return h('article', { sinif: 'dm-sp' }, [
          h('div', { sinif: 'dm-sp-ust' }, [firmaRozet(x.firma), h('strong', { metin: x.hastane || 'Siparişle eşleşmedi' }), fg ? h('strong', { sinif: 'dm-ceza-tl', metin: tl(fCeza(x).ceza_tl) }) : null]),
          h('div', { sinif: 'dm-sp-orta' }, [h('span', {}, ['Sipariş no ', h('strong', { metin: sipNo(x) })]), h('span', { sinif: 'soluk kucuk', metin: 'Satın alma sip. ' + (x.siparis_no || 'veri yok') + ' · ' + iknUrun(x.firma, x.ikn) }), h('span', { metin: x.ceza_tipi || '' })]),
          h('div', { sinif: 'dm-sp-alt' }, [h('span', {}, ['Fatura ', h('strong', { metin: x.fatura_no || 'veri yok' })]), h('span', { metin: tarihTR(x.fatura_tarihi) }), fg ? h('span', {}, ['Fatura tutarı ', h('strong', { metin: tl(fCeza(x).fatura_tutari_tl) })]) : null])]);
      }, { n: 10, sinif: 'dm-liste' }));
    }

     
    var AN_GRUP = [['eldiven', 'Eldiven'], ['spanc', 'Spanç'], ['diger', 'Diğer']];   
    var AN_ALT = { eldiven: { muayene: 'Muayene', cerrahi: 'Cerrahi' }, spanc: { spanc: 'Spanç', gaz_kompres_batin: 'Gaz kompres / batın', gazli_bez: 'Gazlı bez' }, diger: {} };
    var anVeri = null, anHata = null, anYukleniyor = false, anGrup = 'eldiven';
    async function anlikYukle() {   
      var r = null, d = null, f = null;
      try { r = await window.MMVeri.oku('dmo', 'anlik-sonuc'); d = (r && r.veri) || null; }
      catch (e) { if (!(e && e.kod === 'bulunamadi')) throw e; }   
      if (fiyatGor()) { try { var rf = await window.MMVeri.oku('dmo', 'anlik-sonuc-fiyat', 'dmo-fiyat-gor'); f = rf.veri || null; } catch (e) { f = null; } }
      var fm = {}; if (f) (f.satirlar || []).forEach(function (x) { if (x && x.satir_id != null) fm[x.satir_id] = x; });
      return { d: d, f: f, fm: fm };
    }
    function anAdetMetin(n) { return n == null ? 'okunamadı' : say(n); }
    function anAdetFirma(x) {   
      if (x.adet != null) return say(x.adet);
      var ab = x.adet_birim && typeof x.adet_birim === 'object' ? Object.keys(x.adet_birim) : [];
      return ab.length ? ab.map(function (k) { return say(x.adet_birim[k]) + ' ' + k; }).join(' + ') : 'okunamadı';
    }
    function anBizim(ad) { return ad === 'MY' || ad === 'DAY' || ad === 'MY+DAY'; }
    function anSatirlar(v) {   
      var d = v.d || {}, ar = (d.satirlar || []).filter(function (x) { return x && typeof x === 'object'; });
      return ar.filter(function (x) { return anBizim(x.firma); });   
    }
    function anFirmaKartlari(v) {   
      var d = v.d || {}, sonuc = d.asama === 'sonuc', fg = fiyatGor();
      var fl = (d.firmalar || []).filter(function (x) { return x && typeof x === 'object' && anBizim(x.ad); });
      var fiy = {}; if (fg && v.f) (v.f.firmalar || []).forEach(function (x) { if (x && x.ad) fiy[x.ad] = x; });
      var rfy = {}; if (fg && v.f) (v.f.rakipler_fiyat || []).forEach(function (x) { if (x && x.ad) rfy[x.ad] = x; });
      var kartlar = fl.map(function (x) {
        var okundu = x.okundu !== false;
        var ic = [h('strong', { sinif: 'dm-oge-ad', metin: x.ad || 'Firma' })];
        var kismi = x.kismi === true, veriVar = okundu || (kismi && x.kalem != null);   
        if (kismi) ic.push(h('span', { sinif: 'soluk kucuk', metin: 'kısmi: bir firma okunamadı' }));
        if (!veriVar) ic.push(h('span', { sinif: 'dm-yok', metin: 'portalda okunamadı' }));
        else {
          ic.push(h('span', {}, ['Kalem ', h('strong', { metin: anAdetMetin(x.kalem) })]), h('span', {}, ['Adet ', h('strong', { metin: anAdetFirma(x) })]));
          if (fg) ic.push(h('span', {}, ['Tutar (KDV hariç) ', h('strong', { metin: fiy[x.ad] ? tl(fiy[x.ad].tutar_tl) : 'veri yok' })]));
          if (!sonuc && x.bizde_olmayan_kalem != null) {   
            var bo = x.bizde_olmayan_adet != null ? say(x.bizde_olmayan_adet) : anAdetFirma({ adet: null, adet_birim: x.bizde_olmayan_adet_birim });
            ic.push(h('span', { sinif: 'soluk kucuk', metin: 'bizde olmayan: ' + say(x.bizde_olmayan_kalem) + ' kalem / ' + bo + ' adet; firma adı sonuç açıklanınca' }));
          }
        }
        if (!sonuc) ic.push(h('span', { sinif: 'soluk kucuk', metin: 'değerlendirme aşaması, kesin değil' }));
        return h('div', { sinif: 'dm-oge' }, ic);
      });
      var rak = sonuc ? (d.rakipler || []).filter(function (x) { return x && typeof x === 'object' && x.ad; }).map(function (x) {
        var ic = [h('strong', { sinif: 'dm-oge-ad', metin: x.ad }), h('span', {}, ['Kalem ', h('strong', { metin: anAdetMetin(x.kalem) })]), h('span', {}, ['Adet ', h('strong', { metin: anAdetFirma(x) })])];
        if (x.hastane != null) ic.push(h('span', {}, ['Hastane ', h('strong', { metin: say(x.hastane) })]));
        if (fg) {   
          var rf = rfy[x.ad];
          if (rf && rf.belgeli_satir > 0) ic.push(h('span', { sinif: 'soluk kucuk', metin: 'belgeli: ' + tl(rf.belgeli_tutar_tl) + ' (' + say(rf.toplam_satir) + ' satırın ' + say(rf.belgeli_satir) + '’i)' }));
          else ic.push(h('span', { sinif: 'soluk kucuk', metin: 'fiyat portalda yok' }));
        }
        return h('div', { sinif: 'dm-oge' }, ic);
      }) : [];
      var cikti = h('div', {});
      if (kartlar.length) cikti.appendChild(h('div', { sinif: 'dm-oge-izgara' }, kartlar));
      if (rak.length) { cikti.appendChild(h('p', { sinif: 'dm-aciklama', metin: 'Diğer firmalar' })); cikti.appendChild(h('div', { sinif: 'dm-oge-izgara' }, rak)); }
      return cikti.childNodes.length ? cikti : null;
    }
    function anAltBolum(satirlar, grup, kod) {
      var ad = (AN_ALT[grup] || {})[kod] || (kod === 'diger' ? 'Diğer' : 'Diğer'), fg = fiyatGor(), v = anVeri;
      var kol = [{ ad: 'Firma', k: 'firma' }, { ad: 'Ürün', k: 'urun' }, { ad: 'Adet', k: 'adet', csv: function (s) { return s.adet == null ? '' : s.adet; }, ciz: function (s) { return anAdetMetin(s.adet); } }, { ad: 'Birim', k: 'birim' }];
      var rows = satirlar;
      if (fg) { kol.push({ ad: 'Birim fiyat (TL)', k: 'bf', csv: function (s) { var f = v.fm[s.satir_id]; return f && f.birim_fiyat_tl != null ? f.birim_fiyat_tl : ''; }, ciz: function (s) { var f = v.fm[s.satir_id]; return f ? (f.birim_fiyat_tl == null && f.fiyat_cesit > 1 ? 'birden çok fiyat' : tl(f.birim_fiyat_tl)) : 'veri yok'; } }); }
      return G.veriTablo({ ad: ad, filtre: ({ eldiven: 'Eldiven', spanc: 'Spanç' })[grup] || 'Diğer', kolonlar: kol, satirlar: rows, bos: 'Bu grupta satır yok' });
    }
    function anlikEkrani() {
      govde.appendChild(h('div', { sinif: 'bk-dugme-kap' }, [h('button', { type: 'button', sinif: 'dugme', metin: '← DMO özeti', onclick: function () { git('#dmo'); } })]));
      if (anYukleniyor && !anVeri) { govde.appendChild(G.iskelet('kart', 3)); return; }
      if (anHata && !anVeri) { govde.appendChild(G.bos({ tur: 'hata', baslik: 'Anlık sonuç alınamadı', metin: anHata.message || 'Okunamadı', eylem: { ad: 'Yeniden dene', fn: function () { anVeri = null; anHata = null; anlikBaslat(); } } })); return; }
      var d = anVeri && anVeri.d;
      if (!d || typeof d !== 'object' || (d.ihale_var === false) || (!(d.satirlar || []).length && !(d.firmalar || []).length)) { govde.appendChild(G.bos({ baslik: 'Bugün ihale yok / veri yok', metin: 'Anlık sonuç dosyası bulunamadı ya da bugün için sonuç yok.' })); return; }
      if (d.ornek === true) govde.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ' }));
      var okuma = d.portal_okuma_zamani;
      if (okuma) govde.appendChild(h('div', { sinif: 'tazelik dm-taze' }, [h('span', { sinif: 'nokta yesil', 'aria-hidden': 'true' }), h('strong', { metin: 'Portal okuma: ' + zamanTR(okuma) })]));
      govde.appendChild(h('p', { sinif: 'dm-aciklama', metin: d.asama === 'sonuc' ? 'Sonuç açıklandı; diğer firmalar için yalnız kalem ve adet gösterilir.' : 'Değerlendirme aşaması: sonuçlar kesin değildir; yalnız MY ve DAY gösterilir.' }));
      var fk = anFirmaKartlari(anVeri); if (fk) govde.appendChild(fk);
      var tum = anSatirlar(anVeri);
      govde.appendChild(G.segment(AN_GRUP.map(function (g) { return [g[0], g[1], tum.filter(function (x) { return x.grup === g[0]; }).length]; }), anGrup, function (id) { anGrup = id; ciz(); }, { ad: 'Ürün grubu' }));
      var gs = tum.filter(function (x) { return x.grup === anGrup; }), kodlar = Object.keys(AN_ALT[anGrup] || {});
      kodlar.forEach(function (k) { var s = gs.filter(function (x) { return x.alt_grup === k; }); if (s.length) govde.appendChild(anAltBolum(s, anGrup, k)); });
      var diger = gs.filter(function (x) { return kodlar.indexOf(x.alt_grup) < 0; }); if (diger.length) govde.appendChild(anAltBolum(diger, anGrup, 'diger'));
      if (!gs.length) govde.appendChild(G.bos({ baslik: 'Bu grupta satır yok' }));
      if (!window.MMVeri.demo()) govde.appendChild(h('div', { sinif: 'bk-dugme-kap' }, [h('button', { type: 'button', sinif: 'dugme', disabled: 'disabled', title: 'Yakında', metin: 'Gönder (yakında)' })]));   
    }
    function anlikBaslat() {
      if (anVeri || anYukleniyor || anHata) return;
      anYukleniyor = true;
      anlikYukle().then(function (v) { anVeri = v; anHata = null; }, function (e) { anHata = e; anVeri = null; }).then(function () { anYukleniyor = false; if (canli && sekme === 'anlik') ciz(); });
    }

     
    function mektupUyarili(x, gr) {   
      var yd = function (o) { return o && o.yasak_durumu != null && o.yasak_durumu !== 'yesil'; };
      return yd(x) || gr.some(function (g) { return yd(g) || g.yasak_asim_teyitsiz === true || (g.kalan_hak != null && g.kalan_hak <= 0); });
    }
    function mektupListesi() {
      var d = yuk.v['dmo-ihaleler'], gm = {};
      kotaGruplariTekil(false).forEach(function (g) { var k = g.firma + '|' + g.dosya_no; (gm[k] = gm[k] || []).push(g); });
      return (d.dosyalar || []).filter(function (x) { return !f.firma || x.firma === f.firma; }).map(function (x) {
        var gr = gm[x.firma + '|' + x.dosya_no] || [];
        return { x: x, gr: gr, uyari: mektupUyarili(x, gr) };
      }).sort(function (a, b) {
        return (a.uyari === b.uyari ? 0 : (a.uyari ? -1 : 1)) || String(a.x.firma).localeCompare(String(b.x.firma)) || String(a.x.dosya_no).localeCompare(String(b.x.dosya_no), 'tr', { numeric: true });
      });
    }
    function mektupGrupSatiri(g) {
      var m = (g.grup_adi || turAdi(g.urun_turu)) + ': kullanılan ' + say(g.kullanilan_iptal_hastane) + ' / hak ' + say(g.iptal_hakki_hastane) + ' · kalan ' + say(g.kalan_hak) + (g.yasak_asim_teyitsiz === true ? ' · kota aşıldı' : '');
      return h('div', { sinif: 'dm-mk-grup' }, [h('div', { sinif: 'dm-mk-grup-ust' + (g.yasak_durumu != null && g.yasak_durumu !== 'yesil' ? ' ' + g.yasak_durumu : ''), metin: m }), g.uyari ? h('p', { sinif: 'dm-mk-uyari', metin: g.uyari }) : null]);
    }
    function mektupKart(o) {
      var x = o.x, bilgi = [];
      if (x.ikn_sayisi != null) bilgi.push('IKN ' + say(x.ikn_sayisi));
      if (x.hastane_sayisi_pencere != null) bilgi.push('Hastane ' + say(x.hastane_sayisi_pencere) + ' (son 90 gün)');
      if (x.iptal_hastane_sayisi != null) bilgi.push('İptal olan hastane ' + say(x.iptal_hastane_sayisi) + ' (son 90 gün)');
      var ton = x.yasak_durumu != null && x.yasak_durumu !== 'yesil' ? ' ' + x.yasak_durumu : '';
      return h('button', { type: 'button', sinif: 'dm-mk-kart' + (o.uyari ? ' uyari' : '') + ton, onclick: function () { git('#dmo/mektup/' + encodeURIComponent(x.firma) + '/' + encodeURIComponent(x.dosya_no)); } }, [
        h('div', { sinif: 'dm-mk-ust' }, [firmaRozet(x.firma), h('strong', { metin: 'Sipariş no ' + sipNo(x) }), h('span', { sinif: 'dm-mk-ton' + (o.uyari ? ' uyari' : ''), metin: o.uyari ? 'Uyarı' : 'Normal' })]),
        bilgi.length ? h('div', { sinif: 'dm-mk-bilgi kucuk', metin: bilgi.join(' · ') }) : null,
        o.gr.length ? h('div', { sinif: 'dm-mk-gruplar' }, o.gr.map(mektupGrupSatiri)) : h('p', { sinif: 'dm-mk-yok kucuk soluk', metin: 'İptal hakkı: veri yok' }),
        x.uyari ? h('p', { sinif: 'dm-mk-uyari', metin: x.uyari }) : null]);
    }
    function mektupEkrani() {
      govde.appendChild(aracKur([FIRMA_GRUP]));
      var liste = mektupListesi();
      govde.appendChild(h('p', { sinif: 'kucuk soluk', metin: liste.length + ' sipariş' }));
      govde.appendChild(liste.length ? G.ilkN(liste, mektupKart, { n: 50, sinif: 'dm-liste' }) : G.bos({ baslik: 'Bu görünümde sipariş yok' }));
    }
     
    function mektupSiparisleri(cb) {
      if (yuk && yuk.v && yuk.v['dmo-siparisler']) { cb(yuk.v['dmo-siparisler'].siparisler || []); return; }
      window.MMVeri.oku('dmo', 'dmo-siparisler').then(function (r) { cb((r.veri || {}).siparisler || []); }, function () { cb(null); });
    }
    function mektupSatirlari(tum, firma, no) { return tum.filter(function (s) { return s.firma === firma && String(s.dosya_no) === String(no); }); }
    function mektupIknUyarili(i) { return !!(i && ((i.yasak_durumu && i.yasak_durumu !== 'yesil') || (i.riskli_toplam_siparis || 0) > 0 || (i.cezali_surede_siparis || 0) > 0)); }
    function mektupIknSatiri(o) {   
      var i = o.i;
      if (!i) return h('p', { sinif: 'dm-mk-yok kucuk soluk', metin: 'IKN ' + o.ikn + ': ihale satırı yok' });
      var et = [], ub = iknBul(i.firma, i.ikn), urun = ub && ub.urun ? String(ub.urun) : '';
      if (i.yasak_durumu && i.yasak_durumu !== 'yesil') et.push(h('span', { sinif: 'dm-yasak-et ' + i.yasak_durumu, metin: i.yasak_asim_teyitsiz ? 'İptal kotası aşım' : 'Yasak sınırına yakın' }));
      if ((i.riskli_toplam_siparis || 0) > 0) et.push(h('span', { sinif: 'dm-ih-risk' }, ['Riskli ', h('strong', { metin: say(i.riskli_toplam_siparis) + ' sipariş' })]));
      if ((i.cezali_surede_siparis || 0) > 0) et.push(h('span', { sinif: 'dm-ih-risk' }, ['Cezalı sürede ', h('strong', { metin: say(i.cezali_surede_siparis) + ' sipariş' })]));
      if (i.dosya_sayisi > 1) et.push(h('span', { sinif: 'dm-mk-uyari', metin: 'bu IKN ' + i.dosya_sayisi + ' siparişte geçiyor' }));
      return h('button', { type: 'button', sinif: 'dm-mk-iknk' + (o.uyari ? ' uyari' : ''), onclick: function () { git('#dmo/ihale/' + i.firma + '/' + encodeURIComponent(i.ikn)); } }, [
        h('div', { sinif: 'dm-mk-iknk-ust' }, [h('strong', { metin: 'IKN ' + i.ikn }), urun ? h('span', { sinif: 'soluk kucuk', metin: urun }) : null]),
        h('div', { sinif: 'dm-mk-iknk-ad', metin: i.ad || 'Ad yok' }),
        et.length ? h('div', { sinif: 'dm-mk-iknk-et' }, et) : null]);
    }
    function mektupIknKarti(firma, ikns) {   
      var oz = ikns.map(function (ikn) { var i = ihaleBul(firma, ikn); return { ikn: ikn, i: i, uyari: mektupIknUyarili(i) }; });
      var uy = oz.filter(function (o) { return o.uyari; }), tonsuz = oz.filter(function (o) { return o.i && !o.uyari; }), yok = oz.filter(function (o) { return !o.i; });
      var sirali = uy.concat(tonsuz, yok);
      return G.kart({ baslik: 'IKN\'ler (' + ikns.length + ')', govde: h('div', null, [
        h('p', { sinif: 'kucuk dm-mk-say' + (uy.length > 0 ? ' uyari' : ''), metin: 'Dikkat gereken IKN: ' + uy.length }),
        h('p', { sinif: 'dm-mk-yok kucuk soluk', metin: 'Sayılar IKN toplamıdır, bu siparişe özel değildir.' }),
        ikns.length ? G.ilkN(sirali, mektupIknSatiri, { n: 5, sinif: 'dm-liste dm-mk-iknl' }) : G.bos({ baslik: 'IKN yok' })]) });
    }
    function mektupHastaneKarti(firma, no, satirlar) {   
      var gor = {}, hs = [];
      satirlar.forEach(function (s) {
        var k = s.hastane_no != null ? 'n' + s.hastane_no : 'a' + (s.hastane || '');
        if (!gor[k]) { gor[k] = { ad: s.hastane || 'Hastane yok', il: s.il, satirlar: [], risk: false, ek: false }; hs.push(gor[k]); }
        var o = gor[k]; o.satirlar.push(s);
        if ((s.risk_etiketleri && s.risk_etiketleri.length) || s.risk) o.risk = true;
        if (etiketVar(s, 'ek_sure_iste')) o.ek = true;
      });
      var riskli = hs.filter(function (o) { return o.risk; }), digerleri = hs.filter(function (o) { return !o.risk; });
      var ekSay = hs.filter(function (o) { return o.ek; }).length;
      var riskliSirali = riskli.filter(function (o) { return o.ek; }).concat(riskli.filter(function (o) { return !o.ek; }));   
      function satir(o) {
        return h('button', { type: 'button', sinif: 'dm-mk-hs' + (o.risk ? ' uyari' : ''), onclick: function () {
          G.sheet(o.ad, function (g) { o.satirlar.forEach(function (s) { g.appendChild(siparisSatiri(s)); }); }).ac();
        } }, [h('strong', { metin: o.ad }), o.il ? h('span', { sinif: 'soluk kucuk', metin: o.il }) : null, o.ek ? h('span', { sinif: 'dm-mk-et', metin: 'Ek süre başvurusu' }) : null]);
      }
      return G.kart({ baslik: 'Hastaneler (' + hs.length + ')', govde: h('div', null, [
        h('p', { sinif: 'kucuk dm-mk-say' + (riskli.length > 0 ? ' uyari' : ''), metin: 'Açık kaleminde risk etiketi olan hastane: ' + riskli.length + ' (bugünkü durum; geçmiş teslimat puanı değil)' }),
        h('p', { sinif: 'kucuk dm-mk-say' + (ekSay > 0 ? ' uyari' : ''), metin: 'Ek süre başvurusu gereken hastane (başvuru süresi içinde): ' + ekSay }),
        h('p', { sinif: 'kucuk soluk', metin: 'Geçmiş teslimata göre riskli hastane: veri yok' }),
        riskli.length ? G.ilkN(riskliSirali, satir, { n: 5, sinif: 'dm-liste dm-mk-riskli' }) : null,
        digerleri.length ? G.ilkN(digerleri, satir, { n: 3, sinif: 'dm-liste' }) : null,
        !hs.length ? G.bos({ baslik: 'Bu siparişte hastane yok' }) : null]) });
    }
     
    function mektupAyrinti(firma, no) {
      govde.appendChild(h('div', { sinif: 'bk-dugme-kap' }, [h('a', { href: '#dmo/mektup', sinif: 'dugme', metin: '← Siparişler' })]));
      var x = ((yuk.v['dmo-ihaleler'].dosyalar) || []).filter(function (d) { return d.firma === firma && String(d.dosya_no) === String(no); })[0];
      if (!x) { govde.appendChild(G.bos({ baslik: 'Sipariş bulunamadı' })); return; }
      var gr = kotaGruplariTekil(false).filter(function (g) { return g.firma === x.firma && String(g.dosya_no) === String(x.dosya_no); });
      var uyari = mektupUyarili(x, gr);
      govde.appendChild(h('div', { sinif: 'dm-mk-baslik' }, [firmaRozet(x.firma), h('strong', { metin: 'Sipariş no ' + sipNo(x) }), h('span', { sinif: 'dm-mk-ton' + (uyari ? ' uyari' : ''), metin: uyari ? 'Uyarı' : 'Normal' })]));
      govde.appendChild(G.kart({ baslik: 'İptal hakkı', govde: gr.length ? h('div', { sinif: 'dm-mk-gruplar' }, gr.map(function (g) {
        return h('div', { sinif: 'dm-mk-grup-kap' }, [mektupGrupSatiri(g), g.hastane_sayisi_toplam != null ? h('div', { sinif: 'kucuk soluk', metin: 'Hastane ' + say(g.hastane_sayisi_toplam) + (g.hastane_kaynagi ? ' (' + (/^siparişin tamamı/.test(g.hastane_kaynagi) ? 'siparişin tamamı' : '90 gün') + ')' : '') }) : null]);
      })) : h('p', { sinif: 'dm-mk-yok kucuk soluk', metin: 'İptal hakkı: veri yok' }) }));
      govde.appendChild(G.kart({ baslik: 'Oranlar (TL)', govde: h('p', { sinif: 'dm-mk-yok kucuk soluk', metin: 'İrsaliye / kargo teslim / muayene kabul oranları: veri yok' }) }));
      var iknKap = h('div', null), hsKap = h('div', null);
      govde.appendChild(iknKap); govde.appendChild(hsKap);
      var ikns = [], gorIkn = {};
      gr.forEach(function (g) { (g.ikn_listesi || []).forEach(function (k) { if (!gorIkn[k]) { gorIkn[k] = 1; ikns.push(k); } }); });
      if (gr.length) iknKap.appendChild(mektupIknKarti(x.firma, ikns));
      else iknKap.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'IKN listesi yükleniyor' }));
      hsKap.appendChild(h('p', { sinif: 'kucuk soluk', metin: 'Hastane listesi yükleniyor' }));
      mektupSiparisleri(function (tum) {
        if (!canli || !hsKap.isConnected) return;
        iknKap.textContent = ''; hsKap.textContent = '';
        if (!tum) {
          if (!gr.length) iknKap.appendChild(G.bos({ baslik: 'Sipariş verisi şu an yok' }));
          hsKap.appendChild(G.bos({ baslik: 'Sipariş verisi şu an yok' })); return;
        }
        var sat = mektupSatirlari(tum, x.firma, x.dosya_no);
        if (!gr.length) {
          var g2 = {}, l2 = [];
          sat.forEach(function (s) { if (s.ikn != null && !g2[s.ikn]) { g2[s.ikn] = 1; l2.push(s.ikn); } });
          iknKap.appendChild(mektupIknKarti(x.firma, l2));
        } else iknKap.appendChild(mektupIknKarti(x.firma, ikns));
        hsKap.appendChild(mektupHastaneKarti(x.firma, x.dosya_no, sat));
      });
    }

     
    function ciz() {
      ustKap.textContent = ''; govde.textContent = '';
      var gc = G.gecis([['dmo-nakliyat', 'DMO Nakliyat']]);   
      var eyl = null;
      if (yuk && !(hata && !yuk)) eyl = eylemMenu([['Barkod okut', { fn: function () { barkodAc(); } }], ['Anlık sonuç', { fn: function () { git('#dmo/anlik'); } }]].concat(gc ? [['DMO Nakliyat →', { href: '#dmo-nakliyat' }]] : []));
      ustKap.appendChild(G.sayfaBasi({ baslik: 'DMO', alt: 'İhale, sipariş ve ceza takibi', kirinti: [['DMO']], eylem: eyl }));
      if (!eyl && gc) ustKap.appendChild(gc);
      if (hata && !yuk) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'DMO verisi alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      ustKap.appendChild(bantlar(yuk.v['dmo-ozet']));
      ustKap.appendChild(sekmeSatiri());
      if (sekme === 'anlik') { anlikBaslat(); anlikEkrani(); }
      else if (sekme === 'acik') acikSiparisEkrani();
      else if (sekme === 'hastaneler') hastanelerEkrani();
      else if (sekme === 'ihaleler') ihaleListesi();
      else if (sekme === 'ihale') ihaleDetay(yol[1], yol[2]);
      else if (sekme === 'mektup') { if (yol[1]) mektupAyrinti(yol[1], yol[2]); else mektupEkrani(); }
      else if (sekme === 'siparis') siparisEkrani();
      else if (sekme === 'muayene') muayeneEkrani();
      else if (sekme === 'belge') belgeEkrani();
      else if (sekme === 'ceza') cezaEkrani();
      else ozetGoster();
    }
    function yenile() {
      hata = null; yuk = null; IKN_IDX = null; ciz();
      yukle(sekme).then(function (y) { yuk = y; hata = null; }).catch(function (e) { hata = e; }).then(function () {
        if (canli) ciz();
        if (canli && yuk && sekme === 'ozet' && fiyatGor() && !yuk.fy) {   
          var y0 = yuk;
          fyOku().then(function (fy) { if (canli && yuk === y0 && fy) { y0.fy = fy; ciz(); } }, function () { });
        }
      });
    }
    yenile();
    return function () { canli = false; document.removeEventListener('click', belgeTik); document.removeEventListener('keydown', belgeTus); };
  };
})();
