



(function () {
  'use strict';
  var BOLUM_AD = { kal: 'Kalite', sip: 'Sipariş', fab: 'Fabrika', isg: 'İSG', eld: 'Eldiven', dmo: 'DMO' };
  var MM = window.MM, gr = MM.gr, h = MM.h, sayi = MM.sayi;
  var ROL_AD = { yonetim: 'Yönetim', fabrika: 'Fabrika', satis: 'Satış', finans: 'Finans', calisan: 'Çalışan', kalite: 'Kalite', 'eldiven-finans': 'Eldiven finans' };

  function trParcalar() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(new Date()).reduce(function (a, p) { a[p.type] = p.value; return a; }, {}); }
  function bugunIso() { var p = trParcalar(); return p.year + '-' + p.month + '-' + p.day; }
  function dunIso() { return new Date(Date.parse(bugunIso() + 'T12:00:00Z') - 864e5).toISOString().slice(0, 10); }
  function gunEt(g) { return g ? g.slice(8, 10) + '.' + g.slice(5, 7) : ''; }
  function selam() { var s = +trParcalar().hour % 24; return s < 5 ? 'İyi geceler' : (s < 12 ? 'Günaydın' : (s < 18 ? 'İyi günler' : (s < 22 ? 'İyi akşamlar' : 'İyi geceler'))); }
  var tarihBicim = new Intl.DateTimeFormat(window.MM_LOC || 'tr-TR', { timeZone: 'Europe/Istanbul', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  function bossa(n) { return n == null ? '—' : sayi(n); }

  function ornekMi(d) { return !!(d && ((d.kaynak && d.kaynak.durum === 'ornek') || d.ornek === true)); }

   
  var KPI = {};
  KPI.hatlar = function (oz) {
    if (!oz.fab) return null;
    var d = oz.fab.v, hl = d.hatlar || [], say = function (s) { return hl.filter(function (x) { return x.durum === s; }).length; };
    var kk = MM.ozet.kompresKarsilastir(oz.fab), dk = MM.yasDk(d.asof), eski = dk == null || dk > (window.MM_AYAR.eskiDk || 15);
    var o = { baslik: 'Kompres hatları', ikon: 'makineler', deger: say('calisiyor') + ' / ' + hl.length, birim: 'hat çalışıyor', href: '#makineler', durum: (say('durdu') || say('no_data')) ? 'uyari' : (eski ? 'uyari' : null) };
    o.yas = dk; o.eski = eski;
    if (kk) {
      var son = kk.l.slice(-14); o.spark = son.map(function (x) { return x.o + x.t; }); o.sparkTahmin = son.map(function (x) { return x.th > 0; });
      o.sparkAd = 'Son ' + son.length + ' tam gün kompres toplamı';
      var dunMu = kk.son.g === dunIso(), et = dunMu ? 'dün' : gunEt(kk.son.g);
      o.deltalar = [gr.delta(kk.toplamSon, kk.onceki, { iyi: 'yukari', etiket: et + ' ↔ önceki gün' }), gr.delta(kk.toplamSon, kk.hafta, { iyi: 'yukari', etiket: 'geçen hafta' }), h('span', { sinif: 'delta yok', metin: 'hedef: tanımlı değil' })];
      var n = kk.nedenHat;
      o.neden = 'Son tam gün (' + gunEt(kk.son.g) + ') ' + sayi(kk.toplamSon) + ' kompres' + (n && Math.abs(n.f) > 0 ? '; önceki güne göre en büyük fark Hat ' + n.hat + ' (' + (n.f > 0 ? '+' : '−') + sayi(Math.abs(n.f)) + ')' : '') + '.';
    }
    o.alt = (say('no_data') ? say('no_data') + ' hatta veri yok. ' : '') + (kk && kk.tahminli ? 'Eğilimdeki ○ noktalar tahmin içeren günler.' : '');
    return o;
  };
  KPI.dokuma = function (oz) {
    if (!oz.fab || !oz.fab.v.dokuma) return null;
    var d = oz.fab.v, dk = d.dokuma, fyas = MM.yasDk(d.asof), ak = ((d.akis || {}).dokuma || []).map(function (x) { return x.calisan; });
    return { baslik: 'Dokuma salonu', ikon: 'makineler', deger: dk.calisan != null ? sayi(dk.calisan) + ' / ' + sayi(dk.toplam) : '—', birim: 'tezgâh çalışıyor', href: '#makineler', spark: ak.length > 2 ? ak : null, sparkAd: 'Son ~3 dk çalışan tezgâh sayısı', yas: fyas, eski: fyas == null || fyas > (window.MM_AYAR.eskiDk || 15),
      neden: 'Ortalama verim % ' + (dk.ort_verim == null ? '—' : sayi(dk.ort_verim, 1)) + ' · ' + sayi(dk.duran) + ' tezgâh duruyor' + (dk.bilinmeyen ? ' · ' + sayi(dk.bilinmeyen) + ' tezgâhtan veri yok (durdu değil, bilinmiyor)' : '') + '.', alt: 'Eğilim yalnız son ~3 dakikayı gösterir.' };
  };
  KPI.alarm = function (oz) {
    if (!oz.fab) return null;
    var al = oz.fab.v.alarmlar;
    return { baslik: 'Açık alarm', ikon: 'uyari', deger: al == null ? '?' : String(al.length), birim: al == null ? 'durum okunamadı' : 'alarm', href: '#makineler', durum: al && al.length ? 'kritik' : (al == null ? 'yok' : null),
      neden: al == null ? 'Alarm durumu alınamadı' : (al.length ? MM.alarmKonu(al[0].konu) + ' — ' + ((al[0].tur || '').replace(/-/g, ' ')) + (al[0].sure_dk != null ? ', ' + sayi(al[0].sure_dk) + ' dk' : '') + (al.length > 1 ? ' (+' + (al.length - 1) + ' alarm daha)' : '') : 'Açık alarm bildirilmedi.') };
  };
  KPI.eldiven = function (oz) {
    if (!oz.eld) return null;
    var o = oz.eld.o, v = oz.eld.v, dk = MM.yasDk(v.asof), eski = dk == null || dk > 360, hf = [0, 0, 0, 0, 0, 0, 0, 0];
    oz.eld.hz.liste.forEach(function (x) { if (x.d.grup === 'yolda' && x.d.kalan != null) { var b = Math.min(7, Math.max(0, Math.ceil(x.d.kalan / 7) - 1)); hf[b]++; } });
    var k = { baslik: 'Eldiven sevkiyatı', ikon: 'eldiven', deger: String(o.yolda), birim: 'yoldaki konteyner', href: '#eldiven', durum: o.dolan ? 'kritik' : (eski ? 'uyari' : null), spark: hf, sparkAd: 'Önümüzdeki 8 haftada varacak yoldaki konteyner sayısı (haftalık)',
      yas: dk, eski: eski, alt: 'Bu hafta varacak ' + o.hafta + ' · limanda ' + o.limanda + ' · serbest süresi dolan ' + o.dolan + '.' };
    if (v.ornek === true) k.etiket = { metin: 'ÖRNEK', tur: 'ornek' };
    k.neden = o.dolan ? 'Limanda bekleyen ' + o.limanda + ' konteynerin ' + o.dolan + ' tanesi serbest süreyi aştı; ardiye riski var.' : 'Serbest süresi dolan konteyner yok.';
    return k;
  };
  KPI.siparis = function (oz) {
    if (!oz.sip) return null;
    var o = oz.sip.o, v = oz.sip.v, dk = MM.yasDk(v.asof), l = v.siparisler || [], bugun = Date.parse(bugunIso() + 'T00:00:00Z'), gun = new Array(45).fill(0);
    l.forEach(function (s) { if (!s.tarih) return; var f = Math.round((bugun - Date.parse(s.tarih + 'T00:00:00Z')) / 864e5); if (f >= 0 && f < 45) gun[44 - f]++; });
    var gec = l.filter(function (s) { return s.gecikme_gun; }), dmo = gec.filter(function (s) { return s.tur_ad === 'DMO'; }).length;
    var k = { baslik: 'Siparişler', ikon: 'siparis', deger: String(o.acik), birim: 'açık sipariş', href: '#siparis', durum: o.gecikmis ? 'kritik' : null, spark: gun, sparkAd: 'Son 45 günde açılan sipariş sayısı (günlük)',
      neden: o.gecikmis ? o.gecikmis + ' sipariş gecikmiş' + (dmo ? ' (' + dmo + ' tanesi DMO)' : '') + '; ' + o.bilinmiyor + ' siparişin durumu bilinmiyor.' : o.bilinmiyor + ' siparişin durumu bilinmiyor.',
      yas: dk, eski: dk == null || dk > 2160, alt: (o.kismi ? sayi(o.bilinmeyenKalem) + ' kalemin teslim durumu henüz yok' : '') };
    if (v.ornek === true) k.etiket = { metin: 'ÖRNEK', tur: 'ornek' };
    return k;
  };
  function takvimKpi(ad, modul, anahtar) {
    return function (oz) {
      var m = oz[anahtar]; if (!m) return null; var o = m.o, dk = MM.yasDk(m.v.asof), aylik = new Array(12).fill(0);
      o.liste.forEach(function (x) { if (x.gun != null && x.gun >= 0 && x.gun < 360) aylik[Math.min(11, Math.floor(x.gun / 30))]++; });
      return { baslik: ad, ikon: modul, deger: String(o.gecti), birim: 'süresi geçen', href: '#' + modul, durum: o.gecti ? 'kritik' : (o.k7 ? 'uyari' : null), spark: aylik, sparkAd: 'Önümüzdeki 12 ayda biten belge sayısı (aylık)',
        neden: '30 gün içinde ' + (o.k7 + o.k30) + ' belge doluyor; ' + o.bilinmiyor + ' kaydın tarihi yok.', yas: dk, eski: dk == null || dk > 4320 };
    };
  }
  KPI.kalite = takvimKpi('Kalite belgeleri', 'kalite', 'kal');
  KPI.isg = takvimKpi('İSG takvimi', 'isg', 'isg');
  MM.anaKpi = { yap: function (ad, oz) { var s = KPI[ad] && KPI[ad](oz); return s ? gr.kpi(s) : null; }, spec: function (ad, oz) { return KPI[ad] && KPI[ad](oz); }, ORNEK: ornekMi, gunEt: gunEt, bugunIso: bugunIso, dunIso: dunIso };

   
  function kaynakSatiri(oz) {
    var kap = h('div', { sinif: 'kaynak-sira', role: 'list', 'aria-label': 'Veri kaynakları ve güncelliği' });
    function c(ad, asof, esik, hata) {
      var dk = MM.yasDk(asof), eski = hata || dk == null || dk > esik;
      kap.appendChild(h('span', { sinif: 'kaynak-cip ' + (hata ? 'hata' : (eski ? 'eski' : 'taze')), role: 'listitem' }, [h('i', { 'aria-hidden': 'true' }), ad + ': ', h('b', { metin: hata ? 'okunamadı' : MM.yasMetin(dk) }), eski && !hata ? ' · eski' : '']));
    }
    var hk = oz.hata;
    if (oz.fab) c('Fabrika', oz.fab.v.asof, window.MM_AYAR.eskiDk || 15); else if (hk.fabrika) c('Fabrika', null, 0, true);
    if (oz.eld) c('Eldiven', oz.eld.v.asof, 360); else if (hk.eldiven) c('Eldiven', null, 0, true);
    if (oz.sip) c('Siparişler', oz.sip.v.asof, 2160); else if (hk.siparis) c('Siparişler', null, 0, true);
    if (oz.kal) c('Kalite', oz.kal.v.asof, 4320); else if (hk.kalite) c('Kalite', null, 0, true);
    if (oz.isg) c('İSG', oz.isg.v.asof, 4320); else if (hk.isg) c('İSG', null, 0, true);
    return kap;
  }
  MM.kaynakSatiri = kaynakSatiri;

   
  function gorur(id) { return (MM.modulListe || []).some(function (m) { return m.id === id; }); }
  function hrefGorur(href) { var id = String(href || '').replace(/^#/, '').split(/[?\/&]/)[0]; return !id || gorur(id); }
  var KOM = ['siparis', 'nakliye', 'makineler', 'kalite', 'muhasebe', 'dmo', 'eldiven', 'finans'];
  var KOM_AD = { siparis: 'Siparişler', nakliye: 'Nakliye', makineler: 'Makineler', kalite: 'Kalite', muhasebe: 'Muhasebe', dmo: 'DMO', eldiven: 'Eldiven', finans: 'Finans' };
  var KOM_IK = { siparis: 'siparis', nakliye: 'kutu', makineler: 'makineler', kalite: 'kalite', muhasebe: 'muhasebe', dmo: 'belge', eldiven: 'eldiven', finans: 'finans' };
  var KOM_RENK = { siparis: '#2a78d6', nakliye: '#eb6834', makineler: '#6250d6', kalite: '#1baf7a', muhasebe: '#1c355e', dmo: '#009fde', eldiven: '#e87ba4', finans: '#008300' };
  function okuSinirli(klasor, dosya) { try { return window.MMVeri.oku(klasor, dosya).catch(function () { return null; }); } catch (e) { return Promise.resolve(null); } }
  function ekVeri() {
    var ek = {}, p = [];
    if (gorur('nakliye')) p.push(okuSinirli('nakliye', 'nakliye').then(function (r) { ek.nak = r; }));
    if (gorur('muhasebe')) p.push(okuSinirli('muhasebe', 'muhasebe').then(function (r) { ek.muh = r; }));
    if (gorur('dmo')) p.push(okuSinirli('dmo', 'dmo-acik-siparis').then(function (r) { ek.dmo = r; }));
    return Promise.all(p).then(function () { return ek; });
  }
   
  function komKutu(id, oz, ek) {
    var o, v;
    if (id === 'siparis') { if (!oz.sip) return null; o = oz.sip.o; return { sayi: String(o.acik), birim: 'açık', alt: o.gecikmis ? '▲ ' + o.gecikmis + ' geciken' : 'gecikme yok', ton: o.gecikmis ? 'kritik' : null, asof: oz.sip.v.asof }; }
    if (id === 'makineler') {
      if (!oz.fab) return null; var d = oz.fab.v, hl = d.hatlar || [], say = function (s) { return hl.filter(function (x) { return x.durum === s; }).length; }, dur = say('durdu') + say('no_data');
      return { sayi: say('calisiyor') + '/' + hl.length, birim: 'hat', alt: dur ? '▼ ' + dur + ' hat durdu/veri yok' : 'tüm hatlar çalışıyor', ton: dur ? 'kritik' : null, asof: d.asof };
    }
    if (id === 'kalite') { if (!oz.kal) return null; o = oz.kal.o; return { sayi: String(o.gecti), birim: 'süresi geçen', alt: o.gecti ? '● belge süresi geçti' : (o.k7 ? '● ' + o.k7 + ' belge 7 günde doluyor' : 'süresi geçen yok'), ton: o.gecti ? 'uyari' : null, asof: oz.kal.v.asof }; }
    if (id === 'eldiven') { if (!oz.eld) return null; o = oz.eld.o; return { sayi: String(o.yolda), birim: 'yolda', alt: o.dolan ? '▲ ' + o.dolan + ' serbest süre doldu' : 'bu hafta ' + o.hafta + ' varış', ton: o.dolan ? 'kritik' : null, asof: oz.eld.v.asof }; }
    if (id === 'nakliye') {
      if (!ek.nak || !ek.nak.veri || !MM.nakliye) return null; v = ek.nak.veri; o = MM.nakliye.ozet(v);
      return { sayi: String(o.gecikmis + o.bekliyor), birim: 'çıkış bekliyor', alt: o.gecikmis ? '▲ ' + o.gecikmis + ' gecikmiş' : 'gecikme yok', ton: o.gecikmis ? 'kritik' : null, asof: v.asof };
    }
    if (id === 'muhasebe') {
      if (!ek.muh || !ek.muh.veri) return null; v = ek.muh.veri; var sap = v.e_belge && v.e_belge.sap, gib = v.e_belge && v.e_belge.gib_kontrol;
      if (!sap) return null; var bek = (sap.bekleyen || []).length;
      return { sayi: String(bek), birim: 'aktarım bekliyor', alt: gib && gib.gonderilemez ? '● ' + gib.gonderilemez + ' belge GİB engeli' : (bek ? '▼ aktarılmayan fatura' : 'bekleyen yok'), ton: (gib && gib.gonderilemez) ? 'uyari' : null, asof: v.asof };
    }
    if (id === 'dmo') {
      if (!ek.dmo || !ek.dmo.veri || !ek.dmo.veri.toplam) return null; v = ek.dmo.veri; var t = v.toplam;
      if (t.siparis_sayisi == null) return null;
      return { sayi: String(t.siparis_sayisi), birim: 'açık sipariş', alt: t.kalan != null ? 'kalan ' + sayi(t.kalan) + ' adet' : '', ton: null, asof: v.uretim_zamani ? String(v.uretim_zamani).replace(' ', 'T') + '+03:00' : null };
    }
    return null;   
  }
  function komutaMerkezi(oz, ek, bildirimSay) {
    var gor = KOM.filter(gorur), kutular = gor.map(function (id) { return { id: id, k: komKutu(id, oz, ek) }; }), asofler = [];
    kutular.forEach(function (x) { if (x.k && x.k.asof) asofler.push(x.k.asof); });
    var kap = h('div', { sinif: 'komuta' + (gor.length < 3 ? ' az' : '') });
    if (!gor.length) return { kap: kap, asof: null, n: 0 };
    if (gor.length >= 3 && kutular.some(function (x) { return x.k; })) {
      var ac = bildirimSay.kritik, iz = bildirimSay.uyari, yol = kutular.filter(function (x) { return x.k && !x.k.ton; }).length;
      var baslik = ac ? 'Dikkat gerekiyor' : (iz ? 'Takip gerekiyor' : (kutular.some(function (x) { return x.k; }) ? 'Her şey yolunda' : 'Veri bekleniyor'));
      kap.appendChild(h('div', { sinif: 'kom-hero ' + (ac ? 'k' : (iz ? 'u' : 'i')) }, [h('div', { sinif: 'kh-k', metin: 'Şirket bugün' }), h('div', { sinif: 'kh-b', metin: baslik }),
        h('div', { sinif: 'kh-t' }, [h('div', null, [h('b', { metin: String(ac) }), 'acil']), h('div', null, [h('b', { metin: String(iz) }), 'izlenen']), h('div', null, [h('b', { metin: String(yol) }), 'yolunda'])])]));
    }
    var izg = h('div', { sinif: 'kom-izgara' });
    kutular.forEach(function (x) {
      var k = x.k;
      if (!k) return;   
      izg.appendChild(h('a', { href: '#' + x.id, sinif: 'kom-kutu' + (k && k.ton ? ' ton-' + k.ton : ''), 'aria-label': KOM_AD[x.id] }, [
        k && k.ton ? h('span', { sinif: 'kk-nokta', 'aria-hidden': 'true' }) : null,
        h('span', { sinif: 'kk-ik', style: 'background:' + KOM_RENK[x.id] }, [gr.ikon(KOM_IK[x.id], 20)]),
        h('span', { sinif: 'kk-ad', metin: KOM_AD[x.id] }),
        k ? h('span', { sinif: 'kk-sayi', metin: k.sayi }) : h('span', { sinif: 'kk-bos', metin: 'Veri bekleniyor' }),
        k ? h('span', { sinif: 'kk-birim', metin: k.birim }) : null,
        k && k.alt ? h('span', { sinif: 'kk-alt', metin: k.alt }) : null]));
    });
    kap.appendChild(izg);
    return { kap: kap, asof: asofler.length ? asofler.sort()[0] : null, n: gor.length };
  }

  var SIRA = { kritik: 0, uyari: 1 };
  function dikkatSeridi(oz, ust, baslik) {
    ust = ust || 3;
    var l = MM.ozet.bildirimler(oz).filter(function (b) { return b.sev !== 'bilgi' && hrefGorur(b.href); }).map(function (b, i) { b.__i = i; return b; }).sort(function (a, b) { return (SIRA[a.sev] - SIRA[b.sev]) || (a.__i - b.__i); }), kap = h('section', { sinif: 'dikkat', 'aria-label': 'Bugün dikkat' });
    kap.appendChild(h('div', { sinif: 'dikkat-ust' }, [h('h3', { metin: baslik || 'Bugün dikkat' }), l.length > ust ? h('button', { type: 'button', sinif: 'baglanti-dugme', onclick: function () { document.getElementById('zil').click(); } }, ['Tümü (' + l.length + ')']) : null]));
    var hk = Object.keys(oz.hata);
    if (!l.length) { kap.appendChild(h('p', { sinif: 'dikkat-bos' }, [gr.ikon(hk.length ? 'bilgi' : 'tik', 18), hk.length ? 'Şu an alınamayan veri: ' + hk.join(', ') :'Şu an dikkat gerektiren bir madde yok.'])); return kap; }
    var s = h('div', { sinif: 'dikkat-sira' });
    l.slice(0, ust).forEach(function (b) {
      s.appendChild(h('a', { href: b.href, sinif: 'dikkat-kart sev-' + b.sev }, [h('span', { sinif: 'dk-ik' }, [gr.ikon('uyari', 18)]), h('span', { sinif: 'dk-metin' }, [h('b', { metin: b.baslik }), h('small', { metin: b.metin })]), h('span', { sinif: 'dk-git', 'aria-hidden': 'true' }, [gr.ikon('sag', 16)])]));
    });
    kap.appendChild(s);
    return kap;
  }
  MM.dikkatSeridi = dikkatSeridi;

  MM.moduller.ana = function (kok) {
    var rol = MM.rol(), iptal = false;
    var kar = h('div', { sinif: 'karsilama' }, [h('div', null, [h('h2', { metin: selam() }), h('p', { sinif: 'soluk', metin: tarihBicim.format(new Date()) })])]);
    kok.appendChild(h('div', { sinif: 'sayfa-basi' }, [h('nav', { sinif: 'kirinti', 'aria-label': 'Konum' }, [h('span', { 'aria-current': 'page', metin: 'Ana sayfa' })])]));
    kok.appendChild(kar);
    var govde = h('div', null, [gr.iskelet('kart', 4)]);
    kok.appendChild(govde);
    Promise.all([MM.ozet.yukle(), ekVeri()]).then(function (sonuc) {
      var oz = sonuc[0], ek = sonuc[1];
      if (iptal) return; govde.textContent = '';
      if (oz.fab && gorur('makineler') && ornekMi(oz.fab.v)) govde.appendChild(h('div', { sinif: 'bant ornek', role: 'alert', metin: 'ÖRNEK VERİ — fabrika rakamları gerçek değil' }));
      var bl = MM.ozet.bildirimler(oz).filter(function (b) { return b.sev !== 'bilgi' && hrefGorur(b.href); });
      var km = komutaMerkezi(oz, ek, { kritik: bl.filter(function (b) { return b.sev === 'kritik'; }).length, uyari: bl.filter(function (b) { return b.sev === 'uyari'; }).length });
      var veriYer = h('div', { sinif: 'veri-yer' }); govde.appendChild(veriYer);
      MM.veriTarihi(veriYer, km.asof || (oz.fab && oz.fab.v.asof) || (oz.sip && oz.sip.v.asof) || null);
      if (km.n) govde.appendChild(km.kap);
      govde.appendChild(dikkatSeridi(oz, 3, km.n >= 3 ? 'Önce bunlar' : 'Bugün dikkat'));
      var izg = h('div', { sinif: 'kpi-izgara' }), say = 0;
      ['hatlar', 'dokuma', 'alarm', 'eldiven', 'siparis', 'kalite', 'isg'].forEach(function (ad) { if (/^(hatlar|dokuma|alarm)$/.test(ad) && !gorur('makineler')) return; if (ad === 'alarm' && oz.fab && (oz.fab.v.alarmlar || []).length === 0) return; var k = MM.anaKpi.yap(ad, oz); if (k) { izg.appendChild(k); say++; } });
      if (!say && km.n) {   }
      else if (!say) govde.appendChild(gr.bos({ baslik: 'Gösterilecek özet yok', metin: 'Gösterilecek bölüm verisi şu an yok.', tur: 'bekle', eylem: { ad: 'Yeniden dene', fn: function () { MM.git('#ana'); } } }));
      else { if (km.n >= 3) govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Ayrıntılı özet' })); govde.appendChild(izg); }
      Object.keys(oz.hata).forEach(function (k) { govde.appendChild(h('div', { sinif: 'bant ' + (oz.hata[k].kod === 'ayar_bekleniyor' || oz.hata[k].kod === 'giris_gerekli' ? 'gri' : 'kirmizi'), role: 'status' }, [h('strong', { metin: (BOLUM_AD[k] || 'Bir bölüm') + ' verisi alınamadı' }), ' — ' + oz.hata[k].message])); });
    });
    return function () { iptal = true; };
  };
})();
