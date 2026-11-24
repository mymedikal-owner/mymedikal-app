


(function () {
  'use strict';
  var MM = window.MM, h = MM.h, sayi = MM.sayi, G = MM.gr;
  var ESKI_DK = 36 * 60;
  var SIRA = [['cikti', 'En düşük çıktı'], ['onay', 'En düşük onay'], ['gecikme', 'En çok gecikme'], ['kalan', 'En az kalan gün']];
  var RENK = { cikti: 'var(--vurgu)', teslim: 'var(--iyi)', onay: 'var(--sk6)' };
  function say(n) { var s = sayi(n); return s == null ? '—' : s; }
  function yz(n) { var s = sayi(n, 1); return s == null ? '—' : '%' + s; }
  function gun(n) { var s = sayi(n, 1); return s == null ? '—' : s + ' gün'; }
  function tarihTR(iso) { if (!iso) return '—'; var p = String(iso).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso; }
  function kisaTarih(iso) { var p = String(iso).split('-'); return p[2] + '.' + p[1]; }
  function z2(n) { return (n < 10 ? '0' : '') + n; }
  function zamanTR(asof) { var d = asof ? new Date(asof) : null; return d && !isNaN(d.getTime()) ? z2(d.getDate()) + '.' + z2(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + z2(d.getHours()) + ':' + z2(d.getMinutes()) : null; }
  function firmaRozet(f) { return h('span', { sinif: 'dm-firma ' + (f === 'DAY' ? 'day' : 'my'), metin: f || '?' }); }
  function ordKey(v, artan) { return v == null ? (artan ? Infinity : -Infinity) : v; }
  function buyuk(s) { return String(s == null ? '' : s).toLocaleUpperCase('tr'); }
  var GRUP_AD = { eldiven: 'Eldiven', spanc: 'Spanç', batin: 'Batın', gazli_bez: 'Gazlı bez' };
  var TASIYICI_AD = { okn: 'ÖKN', profesyoneller: 'Profesyoneller' };
  var KARGO_ESKI_DK = 180;
  var KDURUM_AD = { teslim_edildi: 'Teslim edildi', yolda: 'Yolda', hazirlaniyor: 'Hazırlanıyor', dagitimda: 'Dağıtımda' };
  var KDURUM_SN = { teslim_edildi: 'tm', yolda: 'ks', hazirlaniyor: 'hz', dagitimda: 'dg' };
  var ESLEME_AD = { tam: 'Tam eşleşme', tahmini: 'Tahmini eşleşme', baglanamadi: 'Bağlanamadı' };
  var UYZ_AD = { cikis_var_portal_yok: 'Çıktı, portalda teslim yok', portal_fazla: 'Portalda teslim çıkıştan fazla', siparisten_fazla: 'Çıkış siparişten fazla' };
  var DURUM_AD = { tamam: 'Tamamlandı', kismi: 'Tamamlanmadı', baslanmadi: 'Sevke başlanmadı' };
   
  var IL_IZGARA = [
    ['EDİRNE', 'KIRKLARELİ', 'İSTANBUL', 'KOCAELİ', 'DÜZCE', 'ZONGULDAK', 'BARTIN', 'KASTAMONU', 'SİNOP', 'SAMSUN', 'ORDU', 'GİRESUN', 'TRABZON', 'RİZE', 'ARTVİN'],
    ['TEKİRDAĞ', '', 'YALOVA', 'SAKARYA', 'BOLU', 'KARABÜK', 'ÇANKIRI', 'ÇORUM', 'AMASYA', 'TOKAT', 'GÜMÜŞHANE', 'BAYBURT', 'ERZURUM', 'KARS', 'ARDAHAN'],
    ['ÇANAKKALE', 'BALIKESİR', 'BURSA', 'BİLECİK', 'ESKİŞEHİR', 'ANKARA', 'KIRIKKALE', 'YOZGAT', 'SİVAS', 'ERZİNCAN', 'TUNCELİ', 'BİNGÖL', 'AĞRI', 'IĞDIR'],
    ['İZMİR', 'MANİSA', 'UŞAK', 'KÜTAHYA', 'AFYONKARAHİSAR', 'KIRŞEHİR', 'NEVŞEHİR', 'KAYSERİ', 'MALATYA', 'ELAZIĞ', 'MUŞ', 'BİTLİS', 'VAN'],
    ['AYDIN', 'DENİZLİ', 'BURDUR', 'ISPARTA', 'KONYA', 'AKSARAY', 'NİĞDE', 'OSMANİYE', 'KAHRAMANMARAŞ', 'ADIYAMAN', 'DİYARBAKIR', 'BATMAN', 'SİİRT', 'HAKKARİ'],
    ['MUĞLA', 'ANTALYA', '', 'KARAMAN', 'MERSİN', 'ADANA', 'HATAY', 'KİLİS', 'GAZİANTEP', 'ŞANLIURFA', 'MARDİN', 'ŞIRNAK']];
   
  function uyzAyrinti(a) {
    a = String(a || ''); var m;
    if ((m = /çıkış (\d+) · portal teslim (\d+)(?: · çıkış (\d{4}-\d{2}-\d{2}))?(?: \((\d+) gün önce\))?/.exec(a))) return 'Çıkış ' + say(+m[1]) + ' adet · portal teslimi ' + say(+m[2]) + ' adet' + (m[3] ? ' · çıkış ' + tarihTR(m[3]) : '') + (m[4] ? ' (' + m[4] + ' gün önce)' : '');
    if ((m = /portal teslim (\d+) > \S+ çıkış (\d+)/.exec(a))) return 'Portal teslimi ' + say(+m[1]) + ' adet · çıkış ' + say(+m[2]) + ' adet';
    return '';
  }

   
  function halka(ad, deger, renk, alt) {
    var NS = 'http://www.w3.org/2000/svg', boy = 92, C = 2 * Math.PI * 41, vd = deger == null ? null : Math.max(0, Math.min(100, deger));
    function sv(et, oz) { var e = document.createElementNS(NS, et); for (var k in oz) e.setAttribute(k, oz[k]); return e; }
    var svg = sv('svg', { viewBox: '0 0 100 100', 'class': 'dm-hk-svg', 'aria-hidden': 'true', focusable: 'false' });
    svg.appendChild(sv('circle', { cx: 50, cy: 50, r: 41, 'class': 'dm-hk-iz', 'stroke-width': 11 }));
    if (vd != null && vd > 0) svg.appendChild(sv('circle', { cx: 50, cy: 50, r: 41, 'class': 'dm-hk-dolgu ' + renk, 'stroke-width': 11, 'stroke-linecap': vd >= 100 ? 'butt' : 'round', 'stroke-dasharray': (C * vd / 100).toFixed(2) + ' ' + C.toFixed(2), transform: 'rotate(-90 50 50)' }));
    var kap = h('div', { sinif: 'dm-halka', style: '--hk:' + boy + 'px;width:' + boy + 'px;height:' + boy + 'px', role: 'img', 'aria-label': ad + ' ' + yz(deger) }, [svg, h('div', { sinif: 'dm-hk-merkez' }, [h('strong', { metin: yz(deger) })])]);
    return h('div', { sinif: 'dn-hk-kutu' }, [kap, h('span', { sinif: 'dm-hk-ad', metin: ad }), h('span', { sinif: 'dm-hk-alt', metin: alt })]);
  }

  function bar(ad, deger, renk, adet) {
    return h('div', { sinif: 'dn-bar', role: 'img', 'aria-label': ad + ' ' + yz(deger) }, [
      h('span', { sinif: 'dn-bar-ad', metin: ad }),
      h('span', { sinif: 'dn-bar-iz' }, [deger == null ? null : h('i', { style: 'width:' + Math.max(0, Math.min(100, deger)).toFixed(1) + '%;background:' + renk })]),
      h('strong', { sinif: 'dn-bar-say', metin: yz(deger) }),
      adet ? h('span', { sinif: 'dn-bar-adet', metin: adet }) : null]);
  }

  MM.moduller['dmo-nakliyat'] = function (kok) {
    var yuk = null, hata = null, canli = true, firma = 'TOPLAM', sira = 'cikti', ilSec = '', uyz = 'turuncu', sd = { durum: '', teslim: '', ara: '', gec: '' };
    kok.appendChild(G.sayfaBasi({ baslik: 'DMO Nakliyat', alt: 'İhale bazında çıktı, teslim ve DMO onayı', kirinti: [['DMO Nakliyat']] }));
    var bg = G.bolumGecis([['nakliye', 'Genel sevkiyat'], ['dmo-nakliyat', 'DMO Nakliyat']], 'dmo-nakliyat'); if (bg) kok.appendChild(bg);
    var gc = G.gecis([['dmo', 'DMO', 'geri']]); if (gc) kok.appendChild(gc);
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);

     
    function sevkYigin(i) {
      var a = i.sevk_edildi, b = i.kismi, c = i.baslanmadi;
      if (a == null && b == null && c == null) return null;
      var t = (a || 0) + (b || 0) + (c || 0); if (!t) return null;
      var dl = function (n, sn) { return n ? h('i', { sinif: sn, style: 'flex:' + n }) : null; };
      return h('div', { sinif: 'dn-sevk' }, [
        h('span', { sinif: 'dn-sevk-iz', role: 'img', 'aria-label': 'Sevk edildi ' + say(a) + ', kısmi ' + say(b) + ', sevke başlanmadı ' + say(c) }, [dl(a, 'tm'), dl(b, 'ks'), dl(c, 'bs')]),
        h('span', { sinif: 'dn-sevk-yazi', metin: 'Sevk edildi ' + say(a) + ' · Kısmi ' + say(b) + ' · Sevke başlanmadı ' + say(c) })]);
    }
    function kalanRozet(i) {
      var k = i.kalan_gun; if (k == null) return null;
      return h('span', { sinif: 'dn-kalan' + (k < 0 ? ' gec' : (k <= 5 ? ' yakin' : '')), metin: k < 0 ? Math.abs(k) + ' gün geçti' : 'Kalan gün ' + k });
    }
     
    function kargoIhaleSatiri(i, kg) {
      if (!kg || !Array.isArray(kg.ihale_bazinda)) return null;
      var b = null; kg.ihale_bazinda.forEach(function (x) { if (x.firma === i.firma && x.ikn === i.ikn) b = x; });
      if (!b) return h('span', { sinif: 'dn-kargo-yok', metin: 'Kargo: portalda kayıt yok (kanıt yok)' });
      var t = b.tahmini_sayi > 0;
      return h('div', { sinif: 'dn-kargo-sat' }, [
        h('span', { sinif: 'dn-kargo-ad', metin: 'Kargo teslim' }),
        h('strong', { metin: 'koli ' + yz(b.kargo_teslim_koli_yuzde) + ' · gönderi ' + yz(b.kargo_teslim_gonderi_yuzde) }),
        h('span', { sinif: 'dn-kargo-alt', metin: say(b.kargo_teslim_koli) + ' koli teslim · ' + say(b.kargo_yolda_koli) + ' yolda' + (b.kargo_hazirlaniyor_koli ? ' · ' + say(b.kargo_hazirlaniyor_koli) + ' hazırlanıyor' : '') }),
        t ? h('span', { sinif: 'dn-tahmin', metin: '(tahmini: ' + say(b.tahmini_sayi) + ' gönderi)' }) : null]);
    }
    function yigin(oge, adlar, snf) {
      var t = 0; oge.forEach(function (o) { t += o.n || 0; }); if (!t) return null;
      return h('div', { sinif: 'dn-sevk' }, [
        h('span', { sinif: 'dn-sevk-iz', role: 'img', 'aria-label': oge.map(function (o) { return (adlar[o.k] || o.k) + ' ' + say(o.n); }).join(', ') }, oge.map(function (o) { return o.n ? h('i', { sinif: snf[o.k] || '', style: 'flex:' + o.n }) : null; })),
        h('span', { sinif: 'dn-sevk-yazi', metin: oge.map(function (o) { return (adlar[o.k] || o.k) + ' ' + say(o.n); }).join(' · ') })]);
    }
    function kargoKart(v) {
      var kg = v.kargo;
      if (!kg || typeof kg !== 'object') return G.kart({ baslik: 'Kargo teslim (ÖKN portalı)', govde: h('p', { sinif: 'dm-yok dm-bekle', metin: 'Kargo teslim verisi yok' }) });
      var parca = [];
      var kap = kg.kapsam || {}, eksik = Object.keys(kap).filter(function (t) { return kap[t] !== 'TAM'; }).map(function (t) { return (TASIYICI_AD[t] || t) + ' (' + (kap[t] === 'KISMI' ? 'kısmi okuma' : String(kap[t]).toLowerCase()) + ')'; });
      var dk = MM.yasDk(kg.son_basari_en_eski), eskiMi = dk != null && dk > KARGO_ESKI_DK;
      if (eksik.length || eskiMi || kg.etiket || kg.son_basari_en_eski == null) {
        var m = [];
        if (eksik.length) m.push('Eksik taşıyıcı: ' + eksik.join(', ') + ' — oranlar eksik olabilir');
        if (eskiMi) m.push('son başarılı okuma ' + MM.yasMetin(dk));
        if (kg.son_basari_en_eski == null) m.push('son başarılı okuma zamanı yok');
        parca.push(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski/eksik' }), ' — ' + (m.join(' · ') || 'kaynak uyarısı var') + '.']));
      }
      parca.push(bar('Gönderi teslim', kg.ihale_bagli_gonderi_teslim_yuzde, RENK.teslim, say(kg.ihale_bagli_gonderi) + ' DMO ihalesine bağlı gönderi'));
      parca.push(bar('Koli teslim', kg.ihale_bagli_koli_teslim_yuzde, RENK.teslim, 'DMO ihalesine bağlı koli'));
      parca.push(h('p', { sinif: 'kucuk soluk dn-not', metin: 'Tüm eşlenen gönderiler (DMO dışı ' + say(kg.dmo_disi_eslesen) + ' dahil): gönderi ' + yz(kg.eslesen_gonderi_teslim_yuzde) + ' · koli ' + yz(kg.eslesen_koli_teslim_yuzde) + '. Panoda esas olan DMO ihalesine bağlı orandır.' }));
      parca.push(h('h4', { sinif: 'dn-alt-baslik', metin: 'Eşleme (' + say(kg.giden_sayi) + ' gönderi)' }));
      parca.push(yigin([{ k: 'tam', n: kg.eslesen_tam }, { k: 'tahmini', n: kg.eslesen_tahmini }, { k: 'baglanamadi', n: kg.baglanamadi }], ESLEME_AD, { tam: 'tm', tahmini: 'hz', baglanamadi: 'bs' }));
      if (kg.eslesen_tahmini > 0) parca.push(h('p', { sinif: 'kucuk dn-tahmin', metin: 'Tahmini eşleşmeler (' + say(kg.eslesen_tahmini) + ') kesin değildir; ihale sütunlarında ayrıca etiketlenir.' }));
      var dd = kg.durum_dagilimi || {}, dg = Object.keys(dd).map(function (k) { return { k: k, n: dd[k] }; });
      parca.push(h('h4', { sinif: 'dn-alt-baslik', metin: 'Durum' }));
      parca.push(dg.length ? yigin(dg, KDURUM_AD, KDURUM_SN) : h('p', { sinif: 'dm-yok', metin: 'Durum verisi yok' }));
      parca.push(h('p', { sinif: 'kucuk soluk dn-not', metin: 'Portalda kaydı olmayan gönderi için durum: kanıt yok (teslim edilmedi sonucu çıkarılmaz).' }));
      return G.kart({ baslik: 'Kargo teslim (ÖKN portalı)', govde: h('div', { sinif: 'dn-kargo' }, parca) });
    }
    function uzunYolda(v) {
      var kg = v.kargo; if (!kg) return null;
      var l = (kg.uzun_yolda || []).filter(function (x) { return !ilSec || buyuk(x.alici_il) === ilSec; });
      var bas = h('h3', { sinif: 'bolum', metin: 'Uzun yolda (' + say(kg.uzun_yolda_sayi) + ')' });
      var not = h('p', { sinif: 'kucuk soluk dn-not', metin: '14 günden eski, portalda hâlâ yolda görünen gönderiler. Portal güncellememiş olabilir; teslim edilmedi sonucu çıkarılmaz.' });
      if (!l.length) return h('div', null, [bas, not, G.bos({ baslik: ilSec ? 'Bu ilde uzun yolda gönderi yok' : 'Uzun yolda gönderi yok' })]);
      return h('div', null, [bas, not, G.sayfali(l, function (x) {
        return h('div', { sinif: 'dm-sp dn-uyz turuncu' }, [
          h('div', { sinif: 'dm-sp-ust' }, [h('strong', { metin: x.takip_no || '—' }), h('span', { sinif: 'soluk kucuk', metin: TASIYICI_AD[x.tasiyici] || x.tasiyici || '' }), x.alici_il ? h('span', { sinif: 'soluk kucuk', metin: x.alici_il }) : null]),
          h('div', { sinif: 'dm-sp-alt kucuk' }, [h('span', {}, ['Çıkış ' + tarihTR(x.cikis_tarihi) + ' · ', h('strong', { metin: say(x.gun) + ' gün' })]), h('span', { metin: x.ihale_ikn ? 'İKN ' + x.ihale_ikn : 'İhale bağı yok' }), h('span', { metin: ESLEME_AD[x.eslesme] || '' })])]);
      }, { n: 10, sinif: 'dn-liste' })]);
    }
    function ihaleKart(i, kg) {
      var det = h('div', { sinif: 'dn-detay', hidden: true }, [
        h('div', { sinif: 'dm-oge-izgara' }, [
          ['Hastane', say(i.hastane_sayisi)], ['Sipariş', say(i.siparis_sayisi)], ['Gecikmiş sipariş', say(i.gecikmis_siparis)],
          ['Ortalama çıkıştan teslime', gun(i.ort_cikis_teslim_gun)], ['Son çıkış', tarihTR(i.en_son_cikis)], ['İlk son teslim tarihi', tarihTR(i.son_teslim_ilk)], ['Teslim kanıtı yok', say(i.kanit_yok_miktar) + ' adet']].map(function (r) {
          return h('div', { sinif: 'dm-oge' + (r[0] === 'Gecikmiş sipariş' && i.gecikmis_siparis > 0 ? ' kritik' : '') }, [h('span', { sinif: 'dm-oge-ad', metin: r[0] }), h('strong', { sinif: 'dm-oge-deger', metin: r[1] })]);
        }))]);
      var d = h('button', { type: 'button', sinif: 'dn-ihale' + (i.firma === 'DAY' ? ' day' : ''), 'aria-expanded': 'false', onclick: function () { var ac = det.hidden; det.hidden = !ac; d.setAttribute('aria-expanded', String(ac)); d.classList.toggle('acik', ac); } }, [
        h('span', { sinif: 'dm-ih-ust' }, [firmaRozet(i.firma), h('strong', { sinif: 'dm-ikn', metin: 'Sipariş no ' + (i.dosya_no || 'veri yok') }), h('span', { sinif: 'dm-ad', metin: 'İKN ' + (i.ikn || '—') }), kalanRozet(i)]),
        sevkYigin(i),
        bar('Çıktı', i.cikti_yuzde, RENK.cikti, say(i.cikan_miktar) + ' adet'),
        bar('Teslim oldu', i.teslim_yuzde, RENK.teslim, say(i.teslim_miktar) + ' adet'),
        bar('DMO onayladı', i.onay_yuzde, RENK.onay, say(i.onay_miktar) + ' adet'),
        kargoIhaleSatiri(i, kg),
        i.gecikmis_siparis > 0 ? h('span', { sinif: 'dn-gec', metin: say(i.gecikmis_siparis) + ' sipariş gecikmiş' }) : null]);
      return h('div', { sinif: 'dn-ihale-kap' }, [d, det]);
    }

     
    var SD_TESLIM = { teslim_tam: 'Teslim edildi', teslim_kismi: 'Kısmen teslim', kanit_yok: 'Kanıt yok' };
    function sdKova(d) { d = String(d || ''); return /^sevk edildi/i.test(d) ? 'sevk' : /kısm/i.test(d) ? 'kismi' : /başlanmad/i.test(d) ? 'bas' : 'diger'; }
    var SD_ROZET = { sevk: ['var(--yesil)', 'var(--yesil-zemin)', 'Sevk edildi'], kismi: ['var(--sari)', 'var(--sari-zemin)', 'Kısmi'], bas: ['var(--soluk)', 'var(--yuzey3)', 'Başlanmadı'] };
    function sdRozet(ad, yazi, zemin) { return h('span', { sinif: 'tq-rozet', style: 'color:' + yazi + ';background:' + zemin, metin: ad }); }
    function sdGecik(r) { var b = new Date(), iso = b.getFullYear() + '-' + ('0' + (b.getMonth() + 1)).slice(-2) + '-' + ('0' + b.getDate()).slice(-2); return !!(r.son_teslim && String(r.son_teslim) < iso && (r.miktar || 0) > (r.teslim_adet || 0)); }
    function sdBasla(r) { return r.sevk_edilen_adet === 0 || sdKova(r.durum) === 'bas'; }    
    function sdKontrol(r) { if (sdBasla(r)) return ['—', null]; var k = r.kontrol; if (k == null || k === '') return ['—', null]; if (k === 'tamam') return ['Tamam', ['var(--yesil)', 'var(--yesil-zemin)']]; if (k === 'kanit_yok') return ['Teslim kanıtı yok', ['var(--soluk)', 'var(--yuzey3)']]; return ['Uyuşmazlık', ['var(--ciddi)', 'var(--sari-zemin)']]; }
    function sevkDurumu(v) {
      var sv = v.sevk_satirlari; if (!sv || !Array.isArray(sv.satirlar)) return null;
      var kap = h('div', { sinif: 'ust-bosluk' }), tum = sv.satirlar.filter(function (x) { return firmaEsles(x) && ilEsles(x); });
      kap.appendChild(h('h3', { sinif: 'bolum', metin: 'Sevk durumu (' + tum.length + ')' }));
      if (sv.kaynak_yok) kap.appendChild(h('div', { sinif: 'bant sari kucuk-bant', role: 'status', metin: 'Planlama dosyası henüz bağlı değil; durum sevk tarihinden belirlenir. İrsaliye, lokasyon ve koli bilgisi dosya bağlanınca gelecek.' }));
      var sayD = { sevk: 0, kismi: 0, bas: 0 }, tv = {}; tum.forEach(function (x) { var k = sdKova(x.durum); if (sayD[k] != null) sayD[k]++; if (x.teslim_durumu && !sdBasla(x)) tv[x.teslim_durumu] = (tv[x.teslim_durumu] || 0) + 1; });
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'Tüm durumlar', tum.length], ['sevk', 'Sevk edildi', sayD.sevk], ['kismi', 'Kısmi', sayD.kismi], ['bas', 'Başlanmadı', sayD.bas]], sd.durum, function (d) { sd.durum = d; ciz(); }, 'Sevk durumu süzgeci')]));
      var tcip = [['', 'Tüm teslim durumları']].concat(Object.keys(tv).sort().map(function (k) { return [k, SD_TESLIM[k] || k.replace(/_/g, ' '), tv[k]]; }));
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler(tcip, sd.teslim, function (d) { sd.teslim = d; ciz(); }, 'Teslim durumu süzgeci')]));
      var gecSay = tum.filter(sdGecik).length;
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'Tüm teslim tarihleri', tum.length], ['gec', 'Geciken sevkiyatlar', gecSay]], sd.gec, function (d) { sd.gec = d; ciz(); }, 'Gecikme süzgeci')]));
      var alan = h('div', { sinif: 'ust-bosluk' });
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [h('input', { type: 'search', sinif: 'sv-ara', 'aria-label': 'Ara', placeholder: 'Ara: hastane, İKN, sipariş, il…', value: sd.ara || '', oninput: function (e) { sd.ara = e.target.value; yaz(); } })])); kap.appendChild(alan);
      var kol = [
        { ad: 'Hastane', k: 'hastane', ciz: function (r) { return r.hastane || '—'; } },
        { ad: 'Ürün', k: 'urun_adi', ciz: function (r) { return r.urun_adi || '—'; } },
        { ad: 'Adet', k: 'miktar', sag: true, ciz: function (r) { return say(r.miktar); } },
        { ad: 'Sipariş no', k: 'siparis_no', ciz: function (r) { return r.siparis_no || '—'; } },
        { ad: 'Durum', k: 'durum', ciz: function (r) { var s = SD_ROZET[sdKova(r.durum)]; return s ? sdRozet(s[2], s[0], s[1]) : (r.durum || '—'); }, csv: function (r) { return r.durum; } },
        { ad: 'Teslim durumu', k: 'teslim_durumu', ciz: function (r) { return r.teslim_durumu && !sdBasla(r) ? (SD_TESLIM[r.teslim_durumu] || r.teslim_durumu) : '—'; } },
        { ad: 'Kontrol', k: 'kontrol', ciz: function (r) { var c = sdKontrol(r); return c[1] ? sdRozet(c[0], c[1][0], c[1][1]) : c[0]; }, csv: function (r) { return sdKontrol(r)[0]; } },
        { ad: 'Firma', k: 'firma', ciz: function (r) { return r.firma || '—'; } },
        { ad: 'İKN', k: 'ikn', ciz: function (r) { return r.ikn || '—'; } },
        { ad: 'İl', k: 'il', ciz: function (r) { return r.il || '—'; } },
        { ad: 'Ürün grubu', k: 'urun_grubu', ciz: function (r) { return GRUP_AD[r.urun_grubu] || r.urun_grubu || '—'; } },
        { ad: 'Miktar', k: 'miktar', sag: true, ciz: function (r) { return say(r.miktar); } },
        { ad: 'Sevk edilen', k: 'sevk_edilen_adet', sag: true, ciz: function (r) { return say(r.sevk_edilen_adet); } },
        { ad: 'Teslim adet', k: 'teslim_adet', sag: true, ciz: function (r) { return say(r.teslim_adet); } },
        { ad: 'Teslim kanıtı yok (adet)', k: 'kanit_yok_adet', sag: true, ciz: function (r) { return sdBasla(r) ? '—' : say(r.kanit_yok_adet); } },
        { ad: 'Son irsaliye', k: 'son_irsaliye_tarihi', ciz: function (r) { return tarihTR(r.son_irsaliye_tarihi); } },
        { ad: 'Son teslim', k: 'son_teslim', ciz: function (r) { return tarihTR(r.son_teslim); } },
        { ad: 'İrsaliye no', k: 'irsaliye_no', ciz: function (r) { return r.irsaliye_no || '—'; } },
        { ad: 'Koli', k: 'koli', sag: true, ciz: function (r) { return say(r.koli); } }];
      function yaz() {
        alan.textContent = '';
        var q = MM.aramaNorm ? MM.aramaNorm(sd.ara || '') : String(sd.ara || '').toLowerCase();
        var s = tum.filter(function (r) {
          if (sd.gec && !sdGecik(r)) return false; if (sd.durum && sdKova(r.durum) !== sd.durum) return false; if (sd.teslim && (sdBasla(r) || r.teslim_durumu !== sd.teslim)) return false;
          if (!q) return true; var t = [r.hastane, r.ikn, r.siparis_no, r.il, r.irsaliye_no, r.malzeme, r.urun_adi].join(' '); return (MM.aramaNorm ? MM.aramaNorm(t) : t.toLowerCase()).indexOf(q) >= 0;
        });
        var f = ['Firma: ' + (firma === 'TOPLAM' ? 'tümü' : firma), 'İl: ' + (ilSec ? ilSec : 'tümü'), 'Durum: ' + (sd.durum ? SD_ROZET[sd.durum][2] : 'tümü'), 'Teslim durumu: ' + (sd.teslim ? (SD_TESLIM[sd.teslim] || sd.teslim) : 'tümü')]; if (sd.ara) f.push('Arama: ' + sd.ara);
        alan.appendChild(G.veriTablo({ ad: 'Sevk durumu', filtre: f.join(' · '), kolonlar: kol, satirlar: s, sayfa: 50, bos: 'Bu süzgeçte kayıt yok.' }));
      }
      yaz(); return kap;
    }
    function ilEsles(x) { return !ilSec || buyuk(x.il) === ilSec; }
    function firmaEsles(x) { return firma === 'TOPLAM' || x.firma === firma; }
    function ilHarita(v) {
      var arr = (v.il_harita || {})[firma]; if (!arr) return null;
      var bil = {}; arr.forEach(function (x) { bil[buyuk(x.il)] = x; });
      var yer = {}, satirlar = IL_IZGARA.map(function (r) { return r.slice(); });
      IL_IZGARA.forEach(function (r) { r.forEach(function (a) { if (a) yer[a] = 1; }); });
      var fazla = Object.keys(bil).filter(function (a) { return !yer[a]; }).sort();
      if (fazla.length) satirlar.push(fazla);
      var say4 = { tamam: 0, kismi: 0, baslanmadi: 0, yok: 0 }, kutu = h('div', { sinif: 'dn-harita', role: 'group', 'aria-label': 'İl haritası' });
      satirlar.forEach(function (r, ri) {
        r.forEach(function (a, ci) {
          if (!a) return;
          var b = bil[a], dr = b ? b.durum : 'yok'; if (say4[dr] == null) dr = 'yok'; say4[dr]++;
          var et = a.charAt(0) + a.slice(1).toLocaleLowerCase('tr');
          var ad = et + (b ? ': ' + (DURUM_AD[dr] || '') + ' · ' + say(b.hastane_sayisi) + ' hastane · sevk ' + yz(b.sevk_yuzde) : ': bu seçimde yok');
          kutu.appendChild(h('button', { type: 'button', sinif: 'dn-il ' + dr + (ilSec === a ? ' sec' : ''), style: 'grid-column:' + (ci + 1) + ';grid-row:' + (ri + 1), title: ad, 'aria-label': ad, 'aria-pressed': ilSec === a ? 'true' : 'false', onclick: function () { ilSec = ilSec === a ? '' : a; ciz(); } }, [a.slice(0, 3)]));
        });
      });
      var lej = h('div', { sinif: 'dn-lejant' }, [['tamam', 'Tamamlandı'], ['kismi', 'Tamamlanmadı'], ['baslanmadi', 'Sevke başlanmadı'], ['yok', 'Bu seçimde yok']].map(function (r) { return h('span', {}, [h('i', { sinif: 'dn-il ' + r[0] }), r[1] + ' ' + say4[r[0]]]); }));
      var bilg = null;
      if (ilSec) {
        var s = bil[ilSec];
        bilg = h('div', { sinif: 'dn-il-bilgi' }, [h('strong', { metin: ilSec.charAt(0) + ilSec.slice(1).toLocaleLowerCase('tr') }), h('span', { metin: s ? (DURUM_AD[s.durum] || '') + ' · ' + say(s.hastane_sayisi) + ' hastane · sevk ' + yz(s.sevk_yuzde) : 'Bu seçimde yok' }),
          h('button', { type: 'button', sinif: 'mini-dugme', onclick: function () { ilSec = ''; ciz(); } }, ['Süzgeci kaldır'])]);
      }
      return G.kart({ baslik: 'İl haritası', alt: 'sevk durumu · ile dokunun, listeler o ile süzülsün', govde: h('div', null, [kutu, lej, bilg]) });
    }
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'DMO Nakliyat alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri, dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK;
      var oz = (v.ozet || {})[firma] || null;
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (eski) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — son güncelleme ' + MM.yasMetin(dk) + '.']));
      var zt = zamanTR(v.asof);
      ust.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: MM.yasMetin(dk) + ' güncellendi' + (zt ? ' (' + zt + ')' : '') })]));
      govde.appendChild(G.cipler([['TOPLAM', 'Tümü'], ['MY', 'MY'], ['DAY', 'DAY']], firma, function (d) { firma = d; ciz(); }, 'Şirket'));
      if (firma === 'DAY' && v.okn_durum === 'kaynak_bekleniyor' && (v.planlama_durum === 'veri_bekleniyor' || v.planlama_durum === 'karsilastirma_yok')) govde.appendChild(h('p', { sinif: 'dm-yok dm-bekle', metin: 'Kargo teslim bilgisi bekleniyor' }));
      if (!oz) { govde.appendChild(G.bos({ baslik: 'Kayıt yok', metin: 'Bu seçimde nakliyat kaydı yok.' })); return; }

       
      govde.appendChild(h('div', { sinif: 'dn-hk-sira' }, [
        halka('Çıktı', oz.cikti_yuzde, 'mavi', say(oz.cikan_miktar) + ' adet çıktı'),
        halka('Teslim oldu', oz.teslim_yuzde, 'yesil', say(oz.teslim_miktar) + ' adet'),
        halka('DMO onayladı', oz.onay_yuzde, 'lacivert', say(oz.onay_miktar) + ' adet')]));
      govde.appendChild(h('p', { sinif: 'dn-sip kucuk soluk', metin: say(oz.siparis_miktar) + ' adet sipariş · ' + say(oz.siparis_sayisi) + ' sipariş · ' + say(oz.ihale_sayisi) + ' ihale · ' + say(oz.gecikmis_siparis) + ' gecikmiş' }));
      govde.appendChild(h('div', { sinif: 'dn-gri' }, [h('span', { sinif: 'dn-gri-ad', metin: 'Teslim kanıtı yok' }), h('strong', { sinif: 'dn-gri-say', metin: say(oz.kanit_yok_miktar) }), h('span', { sinif: 'dn-gri-alt', metin: 'adet · belgeli ' + say(oz.belgeli_miktar) + ' adet' })]));

       
      var en = Math.max(oz.siparis_miktar || 0, 1);
      var adimlar = [['Sipariş', oz.siparis_miktar, 'var(--gri)'], ['Çıktı', oz.cikan_miktar, RENK.cikti], ['Teslim oldu', oz.teslim_miktar, RENK.teslim], ['DMO onayladı', oz.onay_miktar, RENK.onay]];
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Sipariş akışı', alt: 'adet', govde: h('div', { sinif: 'dm-hn' }, adimlar.map(function (a) {
        return h('div', { sinif: 'dm-hn-satir' }, [h('div', { sinif: 'dm-hn-ad' }, [h('span', { metin: a[0] })]), h('div', { sinif: 'dm-hn-iz' }, [a[1] == null ? null : h('i', { style: 'width:' + Math.max(a[1] ? 1.5 : 0, Math.min(100, a[1] / en * 100)).toFixed(1) + '%;background:' + a[2] })]), h('strong', { sinif: 'dm-hn-say', metin: say(a[1]) })]);
      })) })]));

       
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [kargoKart(v)]));

       
      var hk = ilHarita(v); if (hk) govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [hk]));

       
      var ihaleler = (v.ihaleler || []).filter(function (i) { return firma === 'TOPLAM' || i.firma === firma; });
      govde.appendChild(h('h3', { sinif: 'bolum', metin: 'İhale bazında (' + ihaleler.length + ')' }));
      govde.appendChild(G.cipler(SIRA, sira, function (d) { sira = d; ciz(); }, 'Sıralama'));
      var sirali = ihaleler.slice().sort(function (a, b) {
        if (sira === 'gecikme') return (b.gecikmis_siparis || 0) - (a.gecikmis_siparis || 0);
        if (sira === 'kalan') return ordKey(a.kalan_gun, true) - ordKey(b.kalan_gun, true);   
        var k = sira === 'cikti' ? 'cikti_yuzde' : 'onay_yuzde';
        return ordKey(a[k], true) - ordKey(b[k], true);   
      });
      govde.appendChild(sirali.length ? G.sayfali(sirali, function (i) { return ihaleKart(i, v.kargo); }, { n: 10, sinif: 'dn-liste' }) : G.bos({ baslik: 'İhale yok' }));

      var uy = uzunYolda(v); if (uy) govde.appendChild(uy);

       
      var ik = (v.iptal_kotasi || []).filter(firmaEsles);
      if (ik.length) {
        var zor = ik.filter(function (x) { return x.zorunlu_sevk > 0; }).length;
        ik = ik.slice().sort(function (a, b) { return (b.zorunlu_sevk || 0) - (a.zorunlu_sevk || 0) || (b.baslanmayan_hastane || 0) - (a.baslanmayan_hastane || 0); });
        govde.appendChild(h('h3', { sinif: 'bolum', metin: 'İptal hakkı (' + zor + ' sevk zorunlu)' }));
        govde.appendChild(G.sayfali(ik, function (x) {
          var hak = x.hak || 0, kul = x.iptal_hastane || 0, pay = hak > 0 ? Math.min(100, kul / hak * 100) : (kul > 0 ? 100 : 0);
          return h('div', { sinif: 'dm-sp dn-iptal' + (x.zorunlu_sevk > 0 ? ' zorunlu' : '') }, [
            h('div', { sinif: 'dm-sp-ust' }, [firmaRozet(x.firma), h('strong', { sinif: 'dm-ikn', metin: 'İKN ' + (x.ikn || '—') }), h('span', { sinif: 'soluk kucuk', metin: GRUP_AD[x.urun_grubu] || x.urun_grubu || '' })]),
            x.zorunlu_sevk > 0 ? h('div', { sinif: 'dn-zorunlu', metin: 'En az ' + say(x.zorunlu_sevk) + ' hastaneye sevk zorunlu' }) : null,
            h('span', { sinif: 'dn-bar-iz', role: 'img', 'aria-label': 'İptal hakkı ' + say(hak) + ', kullanılan ' + say(kul) }, [pay ? h('i', { style: 'width:' + pay.toFixed(1) + '%;background:' + (kul > hak ? 'var(--kritik)' : 'var(--ciddi)') }) : null]),
            h('div', { sinif: 'dm-sp-alt kucuk' }, [h('span', { metin: 'Hastane ' + say(x.hastane_sayisi) }), h('span', { metin: 'Hak ' + say(hak) }), h('span', { metin: 'Kullanılan ' + say(kul) }), h('span', { metin: 'Kalan hak ' + say(x.kalan_hak) }), h('span', { metin: 'Sevke başlanmayan ' + say(x.baslanmayan_hastane) })])]);
        }, { n: 8, sinif: 'dn-liste' }));
      }

       
      var gl = (v.gunluk || []).slice(-30);
      if (gl.length) {
        var et = gl.map(function (x) { return kisaTarih(x.tarih); });
        var seriler = [{ ad: 'Çıkan', renk: RENK.cikti, d: gl.map(function (x) { return x.cikan; }) }, { ad: 'Teslim', renk: RENK.teslim, d: gl.map(function (x) { return x.teslim; }) }, { ad: 'Onay', renk: RENK.onay, d: gl.map(function (x) { return x.onay; }) }];
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Son 30 gün', alt: 'günlük adet · MY + DAY', govde: h('div', null, [G.cizgi(seriler, et, { yukseklik: 200, ad: 'Son 30 gün günlük çıkan, teslim, onay' }), G.lejant([['Çıkan', RENK.cikti], ['Teslim', RENK.teslim], ['Onay', RENK.onay]])]),
          tablo: { kolonlar: ['Gün', 'Çıkan', 'Teslim', 'Onay'], satirlar: gl.map(function (x) { return [tarihTR(x.tarih), say(x.cikan), say(x.teslim), say(x.onay)]; }) } })]));
      }

       
      var il = (v.iller || []).filter(ilEsles).sort(function (a, b) { return ordKey(b.ort_cikis_teslim_gun, false) - ordKey(a.ort_cikis_teslim_gun, false); });
      if (il.length) {
        var mx = Math.max.apply(null, il.map(function (x) { return x.ort_cikis_teslim_gun || 0; }).concat([1]));
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'İl bazında teslim süresi', alt: 'çıkıştan teslime ortalama gün · en yavaş üstte', govde: G.yatay(il.slice(0, 15).map(function (x) {
          return { e: x.il, alt: say(x.siparis_sayisi) + ' sipariş' + (x.gecikmis_siparis ? ' · ' + x.gecikmis_siparis + ' gecikmiş' : ''), d: x.ort_cikis_teslim_gun, renk: x.gecikmis_siparis ? 'var(--ciddi)' : 'var(--vurgu)', etiketDeger: x.ort_cikis_teslim_gun == null ? '—' : gun(x.ort_cikis_teslim_gun) + ' · ' + yz(x.teslim_yuzde) + ' teslim' };
        }), { maks: mx }),
          tablo: { kolonlar: ['İl', 'Sipariş', 'Teslim %', 'Ort. gün', 'Medyan gün', 'Gecikmiş'], satirlar: il.map(function (x) { return [x.il, say(x.siparis_sayisi), yz(x.teslim_yuzde), gun(x.ort_cikis_teslim_gun), gun(x.medyan_cikis_teslim_gun), say(x.gecikmis_siparis)]; }) } })]));
      }

       
      var nk = (v.nakliyeciler || []);
      if (!nk.length) {
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Nakliyeci bazında gecikme', govde: h('p', { sinif: 'dm-yok dm-bekle', metin: 'Nakliyeci bilgisi bekleniyor' }) })]));
      } else {
        var nks = nk.slice().sort(function (a, b) { return (b.gecikmeli_sayisi || 0) - (a.gecikmeli_sayisi || 0); });
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Nakliyeci bazında gecikme', alt: 'gecikmeli sevk sayısı', govde: G.yatay(nks.map(function (x) {
          return { e: x.ad, alt: say(x.sevk_sayisi) + ' sevk', d: x.gecikmeli_sayisi, renk: 'var(--ciddi)', etiketDeger: say(x.gecikmeli_sayisi) + ' gecikmeli · ' + gun(x.ort_gun) };
        })) })]));
      }

       
       
      var uz = v.uyusmazlik || null;
      if (uz && (uz.liste || []).length) {
        var ul = uz.liste.filter(function (x) { return firmaEsles(x) && ilEsles(x); }), nt = ul.filter(function (x) { return x.renk === 'turuncu'; }).length;
        var ug = uyz === 'turuncu' ? ul.filter(function (x) { return x.renk === 'turuncu'; }) : ul;
        govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Uyuşmazlıklar (' + nt + ')' }));
        govde.appendChild(G.cipler([['turuncu', 'Yalnız uyuşmazlıklar ' + nt], ['', 'Tümü ' + ul.length]], uyz, function (d) { uyz = d; ciz(); }, 'Uyuşmazlık süzgeci'));
        govde.appendChild(ug.length ? G.sayfali(ug, function (x) {
          var ay = uyzAyrinti(x.ayrinti);
          return h('div', { sinif: 'dm-sp dn-uyz ' + (x.renk === 'turuncu' ? 'turuncu' : 'gri') }, [
            h('div', { sinif: 'dm-sp-ust' }, [firmaRozet(x.firma), h('strong', { metin: x.hastane || '—' }), x.il ? h('span', { sinif: 'soluk kucuk', metin: x.il }) : null]),
            h('div', { sinif: 'dn-uyz-tur', metin: UYZ_AD[x.tur] || 'Uyuşmazlık' }),
            h('div', { sinif: 'dm-sp-alt kucuk' }, [h('span', { metin: 'Sipariş ' + (x.siparis_no || '—') }), h('span', { metin: 'İKN ' + (x.ikn || '—') }), ay ? h('span', { metin: ay }) : null])]);
        }, { n: 10, sinif: 'dn-liste' }) : G.bos({ baslik: 'Uyuşmazlık yok' }));
      }

      var sdk = sevkDurumu(v); if (sdk) govde.appendChild(sdk);

      var be = v.belge_eksik || {}, bl = (be.liste || []).filter(function (x) { return firmaEsles(x) && ilEsles(x); }).slice(0, 50);
      govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Teslim belgesi eksiği (' + say(be.sayi) + ')' }));
      govde.appendChild(bl.length ? G.sayfali(bl, function (x) {
        return h('div', { sinif: 'dm-sp dn-belge' }, [
          h('div', { sinif: 'dm-sp-ust' }, [firmaRozet(x.firma), h('strong', { metin: x.hastane || '—' }), x.il ? h('span', { sinif: 'soluk kucuk', metin: x.il }) : null]),
          h('div', { sinif: 'dm-sp-alt kucuk' }, [h('span', { metin: 'Sipariş ' + (x.siparis_no || '—') }), h('span', { metin: 'İKN ' + (x.ikn || '—') }), h('span', {}, ['Çıkış ' + tarihTR(x.cikis_tarihi) + ' · ', h('strong', { metin: say(x.gecen_gun) + ' gün' })])])]);
      }, { n: 10, sinif: 'dn-liste' }) : G.bos({ baslik: 'Eksik belge yok' }));
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('dmo', 'dmo-nakliyat').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  };
})();
