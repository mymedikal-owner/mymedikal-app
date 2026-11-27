


(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var ESKI_DK = 6 * 60; 
  function bugunSeri() {
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-');
    return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5;
  }
  function seri(iso) { var p = iso.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
  function tarihTR(iso) { if (!iso) return 'kayıtlı değil'; var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  var STIL = {
    gecikmis: { ad: 'Gecikmiş', isaret: 'var(--kritik)', yazi: 'var(--kirmizi)', zemin: 'var(--kirmizi-zemin)', ikon: 'uyari' },
    bekliyor: { ad: 'Çıkış bekliyor', isaret: 'var(--uyari)', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)', ikon: 'saat' },
    cikti: { ad: 'Çıkış yapıldı', isaret: 'var(--iyi)', yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)', ikon: 'tik' }
  };
  function hazirla(v) {
    var bu = bugunSeri();
    return (v.kayitlar || []).map(function (k, i) {
      var kv = k.cikis ? 'cikti' : (k.plan && seri(k.plan) < bu ? 'gecikmis' : 'bekliyor');
      return { k: k, i: i, kova: kv, gec: kv === 'gecikmis' ? Math.round(bu - seri(k.plan)) : 0 };
    });
  }
  function ozet(v) {
    var l = hazirla(v), bu = bugunSeri(), s = { toplam: 0, ic: 0, my: 0, day: 0, gecikmis: 0, bekliyor: 0, cikti: 0, bugun: 0, hafta: 0, liste: l };
    l.forEach(function (x) {
      if (x.k.ic) { s.ic++; return; } 
      s.toplam++; if (x.k.sirket === 'MY') s.my++; else if (x.k.sirket === 'DAY') s.day++;
      s[x.kova]++;
      if (x.k.cikis) { var d = bu - seri(x.k.cikis); if (d === 0) s.bugun++; if (d >= 0 && d < 7) s.hafta++; }
    });
    return s;
  }
  MM.nakliye = { hazirla: hazirla, ozet: ozet };

  function rozet(kv) { var st = STIL[kv]; return h('span', { sinif: 'tq-rozet', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 13), st.ad]); }
  var T = function (k) { return MM.t ? MM.t(k) : k; };
  var VB = 'Veri bekleniyor';
  function z2(n) { return (n < 10 ? '0' : '') + n; }
  function veriSatiri(asof) {
    var d = asof ? new Date(asof) : null, ok = d && !isNaN(d.getTime());
    var m = ok ? z2(d.getDate()) + '.' + z2(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + z2(d.getHours()) + ':' + z2(d.getMinutes()) : null;
    return h('div', { sinif: 'tq-veri-satir veri-tarihi', metin: ok ? T('Veri') + ': ' + m + ' ' + T('itibarıyla') : T('Veri') + ': ' + T('zamanı bilinmiyor') });
  }
  function kisaTarih(iso) { var p = iso.split('-'); return p[2] + '.' + p[1]; }
   
  function cizgi(x) {
    var k = x.k, st = STIL[x.kova], son = k.cikis ? h('span', { sinif: 'ns-nokta dolu', style: 'background:' + st.isaret }) : h('span', { sinif: 'ns-nokta bos', style: 'border-color:' + st.isaret });
    return h('span', { sinif: 'ns-cizgi', 'aria-label': T('Plan') + ' ' + tarihTR(k.plan) + (k.cikis ? ' → ' + T('Çıkış') + ' ' + tarihTR(k.cikis) : ' → ' + T('çıkış yok')) }, [
      h('span', { sinif: 'ns-etiket', metin: k.plan ? kisaTarih(k.plan) : '—' }), h('span', { sinif: 'ns-nokta dolu', style: 'background:var(--gri)' }),
      h('span', { sinif: 'ns-hat', style: 'background:' + st.isaret }), son,
      h('span', { sinif: 'ns-etiket', metin: k.cikis ? kisaTarih(k.cikis) : T('çıkış yok') })]);
  }
   
  var KARGO_ESKI_DK = 180;
  var KD = {
    teslim_edildi: { ad: 'Teslim edildi', yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)', renk: 'var(--iyi)', ikon: 'tik' },
    dagitimda: { ad: 'Dağıtımda', yazi: 'var(--vurgu-sert)', zemin: 'var(--vurgu-zemin)', renk: 'var(--vurgu)', ikon: 'saat' },
    yolda: { ad: 'Yolda', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)', renk: 'var(--uyari)', ikon: 'saat' },
    hazirlaniyor: { ad: 'Hazırlanıyor', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)', renk: 'var(--s7)', ikon: 'saat' },
    kismen: { ad: 'Kısmen teslim', yazi: 'var(--sari)', zemin: 'var(--sari-zemin)', renk: 'var(--ciddi)', ikon: 'saat' },
    portalda_yok: { ad: 'Kanıt yok', yazi: 'var(--soluk)', zemin: 'var(--yuzey3)', renk: 'var(--gri)', ikon: 'bilgi' },
    kapsam_disi: { ad: 'Kanıt yok', yazi: 'var(--soluk)', zemin: 'var(--yuzey3)', renk: 'var(--gri)', ikon: 'bilgi' }
  };
  var KD_SIRA = ['teslim_edildi', 'dagitimda', 'yolda', 'hazirlaniyor', 'kismen'];
  var KD_GRUP = { teslim_edildi: 'teslim', dagitimda: 'yolda', yolda: 'yolda', hazirlaniyor: 'yolda', kismen: 'yolda', portalda_yok: 'kanit', kapsam_disi: 'kanit' };
  var KD_GRI = { portalda_yok: 'Portalda yok', kapsam_disi: 'Taşıyıcı bilgisi yok' };
  var TAS_AD = { okn: 'ÖKN Nakliyat', profesyoneller: 'Profesyoneller Lojistik' };
  function ksay(n) { var s = MM.sayi(n); return s == null ? '—' : s; }
  function kyz(n) { var s = MM.sayi(n, 1); return s == null ? '—' : '%' + s; }
  function kgun(n) { var s = MM.sayi(n, 1); return s == null ? '—' : s + ' gün'; }
  function kdRozet(k) {
    var st = KD[k.kargo_durum]; if (!st) return null;
    return h('span', { sinif: 'tq-rozet', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 13), st.ad]);
  }
  function kdSatir(k) {
    var d = k.kargo_durum;
    var ac = function (e) { e.currentTarget.classList.toggle('acik'); };
    if (!d || d === 'kapsam_disi' || d === 'portalda_yok') return h('span', { sinif: 'kt-not', onclick: ac, metin: 'Teslim edilmedi DEĞİL, kanıt yok' + (k.kargo_neden ? ' · ' + k.kargo_neden : '') });
    var p = [];
    if (k.tasiyici) p.push(k.tasiyici);
    if (d === 'teslim_edildi') p.push('Teslim ' + tarihTR(k.kargo_teslim_tarihi) + (k.kargo_teslim_gun != null ? ' (' + kgun(k.kargo_teslim_gun) + ')' : ''));
    else if (k.kargo_cikis_tarihi) p.push('Kargo çıkış ' + tarihTR(k.kargo_cikis_tarihi));
    if (k.esleme === 'tahmini') p.push('(tahmini)');
    return h('span', { sinif: 'kt-not', onclick: ac, metin: p.join(' · ') });
  }
  function yigin(oge, gri) {
    var t = 0; oge.forEach(function (o) { t += o.n || 0; }); if (!t) return null;
    var yazi = oge.map(function (o) { return o.ad + ' ' + ksay(o.n); }).join(' · ');
    return h('div', { sinif: 'dn-sevk kt-yigin' }, [
      h('span', { sinif: 'kt-yigin-iz' + (gri ? ' gri' : ''), role: 'img', 'aria-label': yazi }, oge.map(function (o) { return o.n ? h('i', { style: 'flex:' + o.n + ';background:' + o.renk }) : null; })),
      h('span', { sinif: 'dn-sevk-yazi', metin: yazi })]);
  }
  function kbar(ad, deger, renk, alt) {
    return h('div', { sinif: 'dn-bar', role: 'img', 'aria-label': ad + ' ' + kyz(deger) }, [
      h('span', { sinif: 'dn-bar-ad', metin: ad }), h('span', { sinif: 'dn-bar-iz' }, [deger == null ? null : h('i', { style: 'width:' + Math.max(0, Math.min(100, deger)).toFixed(1) + '%;background:' + renk })]),
      h('strong', { sinif: 'dn-bar-say', metin: kyz(deger) }), alt ? h('span', { sinif: 'dn-bar-adet', metin: alt }) : null]);
  }
  function uyBaslik(kg) { var e = MM.sayi(kg && kg.uzun_yolda_esik_gun); return e == null ? 'Uzun yolda' : 'Uzun yolda (' + e + '+ gün)'; }
  function kargoGorunum(v, sirket, kSek, setSek) {
    var kap = h('div'), kg = v.kargo_teslim;
    if (!kg || typeof kg !== 'object') { kap.appendChild(G.bos({ baslik: 'Kargo teslim verisi yok', metin: 'Taşıyıcı portallarından teslim verisi henüz gelmedi.' })); return kap; }
    var kpsm = kg.kapsam || {}, eksik = Object.keys(kpsm).filter(function (t) { return kpsm[t] !== 'TAM'; }).map(function (t) { return (TAS_AD[t] || t) + ' (' + 'bilgisi eksik)'; });
    var dk = kg.son_basari_en_eski ? MM.yasDk(kg.son_basari_en_eski) : null, eskiMi = dk == null || dk > KARGO_ESKI_DK;
    if (eskiMi || eksik.length || kg.etiket) {
      var m = [];
      if (eksik.length) m.push('Eksik taşıyıcı: ' + eksik.join(', ') + ' — oranlar eksik olabilir');
      if (dk == null) m.push('son başarılı okuma zamanı yok'); else if (dk > KARGO_ESKI_DK) m.push('son başarılı okuma ' + MM.yasMetin(dk));
      kap.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski/eksik' }), ' — ' + m.join(' · ') + '.']));
    }
    var pg = kg.portal_gonderi || {}, sh = sirket ? ((kg.sirket || {})[sirket] || {}) : null;
    var kpi = [];
    if (!sh) {
      var ps = pg.durum || {}, yg = ps.yolda || {};
      kpi.push({ baslik: 'Teslim oranı', deger: kyz(pg.teslim && pg.teslim.yuzde), ikon: 'tik', alt: ksay(pg.teslim && pg.teslim.pay) + ' / ' + ksay(pg.teslim && pg.teslim.payda) + ' gönderi teslim' });
      kpi.push({ baslik: 'Koli teslim oranı', deger: kyz(pg.koli_teslim && pg.koli_teslim.yuzde), ikon: 'tik', alt: ksay(pg.koli_teslim && pg.koli_teslim.pay) + ' / ' + ksay(pg.koli_teslim && pg.koli_teslim.payda) + ' koli' });
      kpi.push({ baslik: 'Yolda', deger: ksay(yg.gonderi), birim: 'gönderi', ikon: 'saat', alt: ksay(yg.koli) + ' koli' });
      kpi.push({ baslik: uyBaslik(kg), deger: ksay(kg.uzun_yolda_sayi), birim: 'gönderi', ikon: 'uyari', durum: kg.uzun_yolda_sayi ? 'kritik' : null, alt: '14 gün üstü: ' + ksay(kg.uzun_yolda_14_gun_ustu) });
    } else {
      var bt = sh.bagli_teslimat_teslim || {}, dd = sh.kargo_durum_dagilimi || {};
      kpi.push({ baslik: 'Teslim oranı', deger: kyz(bt.yuzde), ikon: 'tik', alt: ksay(bt.pay) + ' / ' + ksay(bt.payda) + ' bağlı teslimat' });
      kpi.push({ baslik: 'Koli teslim oranı', deger: '—', ikon: 'tik', alt: 'şirket bazında koli verisi yok' });
      kpi.push({ baslik: 'Yolda', deger: ksay((dd.yolda || 0) + (dd.dagitimda || 0)), birim: 'teslimat', ikon: 'saat', alt: 'taşıyıcıda, teslim edilmedi' });
      kpi.push({ baslik: uyBaslik(kg), deger: '—', ikon: 'uyari', alt: 'şirket bazında uzun yolda verisi yok' });
    }
    kap.appendChild(G.ozetSerit(kpi, { en: 4 }));
    var sek = [];    
     
    var par = [];
    if (!sh) {
      var pd = pg.durum || {}, oge = KD_SIRA.filter(function (d) { return pd[d]; }).map(function (d) { return { ad: KD[d].ad, n: pd[d].gonderi, renk: KD[d].renk }; });
      par.push(h('h4', { sinif: 'dn-alt-baslik', metin: 'Portal gönderileri (' + ksay(pg.giden) + ' gönderi)' }));
      par.push(yigin(oge) || h('p', { sinif: 'veri-yok', metin: 'Veri yok' }));
    } else par.push(h('p', { sinif: 'kucuk soluk', metin: 'Portal gönderi sayıları şirket bazında ayrılmaz; aşağıda bu şirketin teslimat kayıtları var.' }));
    var dgl = sh ? (sh.kargo_durum_dagilimi || {}) : (kg.kargo_durum_dagilimi || {});
    var tk = sh ? sh.teslimat_kayit : (kg.teslimat_eslesme || {}).teslimat_kayit;
    par.push(h('h4', { sinif: 'dn-alt-baslik', metin: 'Teslimat kayıtları ('+ ksay(tk) + ')' }));
    var oge2 = KD_SIRA.filter(function (d) { return dgl[d]; }).map(function (d) { return { ad: KD[d].ad, n: dgl[d], renk: KD[d].renk }; });
    par.push(yigin(oge2) || h('p', { sinif: 'veri-yok', metin: 'Bağlı teslimat yok' }));
    var gri = ['kapsam_disi', 'portalda_yok'].filter(function (d) { return dgl[d]; });
    if (gri.length) {
      par.push(yigin(gri.map(function (d) { return { ad: KD_GRI[d], n: dgl[d], renk: 'var(--gri)' }; }), true));
      par.push(h('p', { sinif: 'kucuk soluk dn-not', metin: 'Gri = teslim edilmedi DEĞİL, kanıt yok: bu teslimatlar için taşıyıcı portalında kayıt bulunamadı ya da taşıyıcı listesi tam değil. Boş sıfır değildir.' }));
    }
    var durumSek = h('div', null, [h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Teslim durumu', govde: h('div', { sinif: 'dn-kargo' }, par) })])]);
    sek.push(['durum', 'Teslim durumu', durumSek]);
     
    var tas = kg.tasiyici || {}, tk2 = h('div', { sinif: 'kt-tas' }), tasTonsuz = [];
    Object.keys(tas).forEach(function (t) {
      var x = tas[t] || {}, kisa = x.kapsam && x.kapsam !== 'TAM', p = [];
      if (!x.veri) p.push(h('p', { sinif: 'veri-yok', metin: 'Veri yok' }));
      else {
        p.push(kbar('Teslim', x.teslim_yuzde, 'var(--iyi)', ksay(x.teslim_gonderi) + ' / ' + ksay(x.giden_gonderi) + ' gönderi'));
        p.push(h('div', { sinif: 'kt-gun' }, [h('span', { metin: 'Çıkış → teslim' }), h('strong', { metin: 'ort. ' + kgun(x.teslim_gun_ort) + ' · medyan ' + kgun(x.teslim_gun_medyan) })]));
        if (x.negatif_gun_kayit) p.push(h('p', { sinif: 'kucuk soluk', metin: x.negatif_gun_kayit + ' kayıtta teslim tarihi çıkıştan önce görünüyor; süre ortalamasına alınmadı.' }));
      }
      if (kisa) p.push(h('div', { sinif: 'bant sari kucuk-bant', role: 'status', metin: 'Bu taşıyıcının bilgileri eksik geliyor; oranlar eksik olabilir.' }));
      var tkart = G.kart({ baslik: TAS_AD[t] || t, alt: x.son_basari ? 'Son başarılı okuma ' + MM.yasMetin(MM.yasDk(x.son_basari)) : 'Son okuma zamanı yok', govde: h('div', { sinif: 'dn-kargo' }, p) });
       
      if (x.veri && !kisa) tasTonsuz.push(tkart); else tk2.appendChild(tkart);
    });
    var darKt = window.matchMedia && window.matchMedia('(max-width: 899px)').matches;
    if (darKt && tasTonsuz.length >= 2) {
      var tkKat = h('div', { sinif: 'kt-tas' }); tasTonsuz.forEach(function (c) { tkKat.appendChild(c); });
      tk2.appendChild(h('details', { sinif: 'acilir-bolum nk-katla' }, [h('summary', null, [h('span', { metin: 'Taşıyıcı ayrıntıları' }), h('span', { sinif: 'nk-katla-say', metin: '(' + tasTonsuz.length + ')' })]), tkKat]));
    } else tasTonsuz.forEach(function (c) { tk2.appendChild(c); });
    if (tk2.childNodes.length) durumSek.appendChild(h('div', { sinif: 'ust-bosluk' }, [tk2]));
     
    var s30 = kg.son_30_gun || [];
    if (s30.length) {
      var et = s30.map(function (x) { return kisaTarih(x.tarih); });
      sek.push(['son30', 'Son 30 gün', h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Son 30 gün: kargo çıkışı ve teslim', alt: 'Taşıyıcı portalı, gönderi adedi/gün' + (sirket ? ' · şirket ayrımı yok, tüm gönderiler' : ''),
        govde: h('div', null, [G.cizgi([{ ad: 'Çıkış', d: s30.map(function (x) { return x.cikis; }), renk: 'var(--vurgu)' }, { ad: 'Teslim', d: s30.map(function (x) { return x.teslim; }), renk: 'var(--iyi)' }], et, { yukseklik: 190, ad: 'Son 30 gün kargo çıkış ve teslim', birim: 'gönderi' }), G.lejant([['Çıkış', 'var(--vurgu)'], ['Teslim', 'var(--iyi)']])]),
        tablo: { kolonlar: ['Gün', 'Çıkış', 'Teslim'], satirlar: s30.map(function (x) { return [kisaTarih(x.tarih), x.cikis, x.teslim]; }) } })])]);
    }
     
    var il = (kg.il || []).filter(function (x) { return x.teslim_gun_ort != null; }).slice(0, 12);
    if (il.length) {
      var mx = Math.max.apply(null, il.map(function (x) { return x.teslim_gun_ort; }));
      var ilNot = kg.il_bilinmeyen_gonderi ? 'İli bilinmeyen ' + ksay(kg.il_bilinmeyen_gonderi) + ' gönderi bu grafiğe girmez.' : 'İli bilinmeyen gönderi yok.';
      sek.push(['il', 'İl bazında', h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'İl bazında ortalama teslim süresi', alt: 'En çok gönderi giden 12 il · çıkıştan teslime gün · ' + ilNot,
        govde: G.yatay(il.map(function (x) { return { e: x.il, alt: ksay(x.teslim_gonderi) + ' / ' + ksay(x.giden_gonderi) + ' teslim', d: x.teslim_gun_ort, etiketDeger: kgun(x.teslim_gun_ort), renk: x.teslim_gun_ort >= 10 ? 'var(--ciddi)' : 'var(--vurgu)' }; }), { maks: mx, ad: 'İl bazında teslim günü' }) })])]);
    }
     
    var uy = kg.uzun_yolda || [];
    if (uy.length || kg.uzun_yolda_sayi) {
      var ul = h('div', { sinif: 'kt-uy' });
      ul.appendChild(G.sayfali(uy, function (x) {
        return h('div', { sinif: 'kt-uy-sat' }, [h('strong', { sinif: 'kt-uy-no', metin: x.takip_no || '—' }), h('span', { sinif: 'kt-uy-gun', metin: ksay(x.gun) + ' gün' }),
          h('span', { sinif: 'kt-uy-alt', metin: [x.tasiyici, x.il, 'çıkış ' + tarihTR(x.cikis_tarihi)].filter(Boolean).join(' · ') })]);
      }, { n: 10 }));
      sek.push(['uy', uyBaslik(kg), h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: uyBaslik(kg) + ' · ' + ksay(kg.uzun_yolda_sayi) + ' gönderi', alt: 'Portalda hâlâ teslim görünmeyen; en uzun bekleyen üstte',
        govde: h('div', null, [kg.uzun_yolda_liste_kesik ? h('p', { sinif: 'kucuk dn-tahmin', metin: 'Liste kesik: ilk ' + ksay(uy.length) + ' gönderi gösteriliyor, toplam ' + ksay(kg.uzun_yolda_sayi) + '.' }) : null, uy.length ? ul : h('p', { sinif: 'veri-yok', metin: 'Liste verisi yok' })]) })])]);
    }
    var secId = sek.some(function (x) { return x[0] === kSek; }) ? kSek : sek[0][0];
    if (sek.length > 1) kap.appendChild(G.segment(sek.map(function (x) { return [x[0], x[1]]; }), secId, function (d) { setSek(d); }, { ad: 'Kargo bölümü' }));
    sek.forEach(function (x) { if (x[0] === secId) kap.appendChild(x[2]); });
    return kap;
  }
  function kartTelefon(x) {
     
    var k = x.k, st = STIL[x.kova];
    var planMetin = k.cikis ? 'Çıkış ' + tarihTR(k.cikis) : 'Plan ' + tarihTR(k.plan) + (x.gec ? ' · ' + x.gec + ' gün geçti' : '');
    var altMetin = 'Teslimat ' + k.no + (k.tur === 'Z004' ? ' · DMO' : '') + (k.ic ? ' · Şirket içi (DAY)' : (k.sirket === 'MY' || k.sirket === 'DAY' ? ' · ' + k.sirket : '')) + ' · ' + planMetin;
    var rg = rozet(x.kova); rg.classList.add('tq-rg');
    var kr = k.kargo_durum ? kdRozet(k) : null; if (kr) kr.classList.add('tq-rk');
    return h('div', { sinif: 'tq-kart tq-kart-tel', style: '--isaret:' + st.isaret }, [
      h('span', { sinif: 'tq-kart-ikon', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 20)]),
      h('span', { sinif: 'tq-kart-metin' }, [h('span', { sinif: 'tq-kart-ad', metin: k.musteri || 'Müşteri bilinmiyor' }), h('span', { sinif: 'tq-kart-alt', metin: altMetin }), cizgi(x), k.kargo_durum ? kdSatir(k) : null]),
      h('span', { sinif: 'tq-kart-sag' }, [rg, kr])
    ]);
  }
  function kart(x) {
    if (window.matchMedia && window.matchMedia('(max-width: 599px)').matches) return kartTelefon(x);
    var k = x.k, st = STIL[x.kova];
    return h('div', { sinif: 'tq-kart', style: '--isaret:' + st.isaret }, [
      h('span', { sinif: 'tq-kart-ikon', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 20)]),
      h('span', { sinif: 'tq-kart-metin' }, [h('span', { sinif: 'tq-kart-ad', metin: k.musteri || 'Müşteri bilinmiyor' }), h('span', { sinif: 'tq-kart-alt', metin: 'Teslimat ' + k.no + (k.tur === 'Z004' ? ' · DMO' : '') + (k.ic ? ' · Şirket içi (DAY)' : (k.sirket === 'MY' || k.sirket === 'DAY' ? ' · ' + k.sirket : '')) }), cizgi(x), k.kargo_durum ? kdSatir(k) : null]),
      h('span', { sinif: 'tq-kart-sag' }, [rozet(x.kova), k.kargo_durum ? kdRozet(k) : null,
        h('span', { metin: k.cikis ? 'Çıkış ' + tarihTR(k.cikis) : 'Plan ' + tarihTR(k.plan) + (x.gec ? ' · ' + x.gec + ' gün geçti' : '') })])
    ]);
  }

   
  var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var BIRIM_SIRA = ['ADT', 'KUT', 'PAK', 'KG'];
  function say(n) { return G.say(n); }
  function td(iso) { if (!iso) return '—'; var p = String(iso).split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : String(iso); }
  function bugunISO() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  function ayAd(ay) { var p = String(ay).split('-'); return (AYLAR[+p[1] - 1] || ay) + ' ' + p[0]; }
  function birimler(b) { var k = Object.keys(b || {}).sort(function (a, c) { var i = BIRIM_SIRA.indexOf(a), j = BIRIM_SIRA.indexOf(c); return (i < 0 ? 9 : i) - (j < 0 ? 9 : j); }); return k; }
  function miktarMetin(b) { var k = birimler(b); return k.length ? k.map(function (u) { return say(b[u]) + ' ' + u; }).join(' · ') : '—'; }
  function dolu(x) { return x == null || x === '' ? '—' : x; }
   
  function koliOran(x) { var m = x && typeof x.koli_kapsam === 'string' ? /^\s*(\d+)\s*\/\s*(\d+)/.exec(x.koli_kapsam) : null; return m ? [+m[1], +m[2]] : null; }
  function koliOranMetin(o) { return o ? ' (koli ' + o[0] + '/' + o[1] + ' teslimatta var)' : ''; }
  function ekExcel(ad, kolonlar, satirlar, filtre) { return G.excelDugme(function () { return { ad: ad, filtre: filtre, kolonlar: kolonlar, satirlar: satirlar }; }); }
  function planNotu(v) { var s = v.sevkiyat; return s && Array.isArray(s.kaynak_yok) && s.kaynak_yok.length ? h('div', { sinif: 'bant sari kucuk-bant', role: 'status', metin: 'Koli bilgisi WhatsApp nakliye fişleri ve kargo portalından gelir; bilinmeyen koli için "veri yok" yazılır.' }) : null; }
  function sevkOzet(v) {
    var s = v.sevkiyat; if (!s || typeof s !== 'object') return null;
    var kap = h('div', { sinif: 'ust-bosluk' }); kap.appendChild(h('h3', { sinif: 'bolum', metin: 'Sevkiyat özeti' }));
    var pn = planNotu(v); if (pn) kap.appendChild(pn);
    var ay = (s.aylik || []).slice().reverse();
    if (ay.length) {
      var ik = h('div', { sinif: 'kpi-izgara tq-kpi sv-ay' });
      ay.forEach(function (a) { ik.appendChild(G.kpi({ baslik: ayAd(a.ay) + (a === ay[ay.length - 1] || a.ay === bugunISO().slice(0, 7) ? ' (kısmi ay)' : ''), deger: say(a.sevk_teslimat), birim: 'teslimat', ikon: 'saat', alt: say(a.sevk_satir) + ' satır · ' + say(a.urun_cesidi) + ' ürün çeşidi · koli ' + dolu(a.koli == null ? null : say(a.koli)) + koliOranMetin(koliOran(a)) + ' · ' + miktarMetin(a.adet_birim) })); });
      kap.appendChild(G.kart({ baslik: 'Aylık sevkiyat', alt: 'Her ay çıkışı yapılan teslimat, satır ve miktar', govde: ik,
        eylem: ekExcel('Aylık sevkiyat', ['Ay', 'Teslimat', 'Satır', 'Ürün çeşidi', 'Miktar', 'Koli'].map(function (a, i) { return { ad: a, k: i }; }), ay.map(function (a) { return [ayAd(a.ay), a.sevk_teslimat, a.sevk_satir, a.urun_cesidi, miktarMetin(a.adet_birim), a.koli]; })) }));
    }
     
    var darOz = window.matchMedia && window.matchMedia('(max-width: 899px)').matches, katOz = h('div', { sinif: 'ust-bosluk' }), katSay = 0;
    function ekOz(el) { if (darOz) { katOz.appendChild(el); katSay++; } else kap.appendChild(el); }
    var g = s.gunluk_30 || [];
    if (g.length) {
      var et = g.map(function (x) { return kisaTarih(x.tarih); });
      ekOz(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Son 30 gün sevkiyat', alt: 'Günlük çıkışı yapılan teslimat sayısı · günlük ortalama koli ' + (s.gunluk_ort_koli == null ? '—' : say(s.gunluk_ort_koli)) + koliOranMetin(g.reduce(function (t, x) { var o = koliOran(x); return o ? [(t ? t[0] : 0) + o[0], (t ? t[1] : 0) + o[1]] : t; }, null)),
        govde: h('div', null, [G.cizgi([{ ad: 'Teslimat', d: g.map(function (x) { return x.sevk_teslimat; }), renk: 'var(--vurgu)' }], et, { yukseklik: 190, ad: 'Son 30 gün günlük sevkiyat teslimat sayısı', birim: 'teslimat' }), G.lejant([['Teslimat', 'var(--vurgu)']])]),
        tablo: { kolonlar: ['Gün', 'Teslimat', 'Satır', 'Miktar'], satirlar: g.map(function (x) { return [kisaTarih(x.tarih), x.sevk_teslimat, x.sevk_satir, miktarMetin(x.adet_birim)]; }) },
        eylem: ekExcel('Son 30 gün sevkiyat', ['Gün', 'Teslimat', 'Satır', 'Miktar', 'Koli'].map(function (a, i) { return { ad: a, k: i }; }), g.map(function (x) { return [td(x.tarih), x.sevk_teslimat, x.sevk_satir, miktarMetin(x.adet_birim), x.koli]; })) })]));
    }
    var tp = s.top10_urun || [];
    if (tp.length) {
      var mx = Math.max.apply(null, tp.map(function (x) { return x.sevk_satir || 0; }).concat([1]));
      ekOz(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'En çok sevk edilen 10 ürün', alt: 'Sevk satırı sayısına göre; miktar kendi biriminde' + (s.urun_cesidi_60g != null ? ' · son 60 günde ' + say(s.urun_cesidi_60g) + ' ürün çeşidi' : ''),
        govde: G.yatay(tp.map(function (x) { return { e: x.malzeme || x.urun_kodu, alt: dolu(x.urun_kodu) + ' · ' + miktarMetin(x.adet_birim), d: x.sevk_satir, etiketDeger: say(x.sevk_satir) + ' satır', renk: 'var(--vurgu)' }; }), { maks: mx, ad: 'En çok sevk edilen 10 ürün' }),
        eylem: ekExcel('En çok sevk edilen 10 ürün', ['Ürün kodu', 'Ürün', 'Sevk satırı', 'Miktar'].map(function (a, i) { return { ad: a, k: i }; }), tp.map(function (x) { return [x.urun_kodu, x.malzeme, x.sevk_satir, miktarMetin(x.adet_birim)]; })) })]));
    }
    if (katSay) kap.appendChild(h('details', { sinif: 'acilir-bolum nk-katla' }, [h('summary', null, [h('span', { metin: 'Ayrıntı kartları' }), h('span', { sinif: 'nk-katla-say', metin: '(' + katSay + ')' })]), katOz]));
    return kap;
  }
  function araKutu(deger, yaz) {
    return h('input', { type: 'search', sinif: 'sv-ara', 'aria-label': 'Ara', placeholder: 'Ara: kurum, ürün, sipariş, irsaliye…', value: deger || '', oninput: function (e) { yaz(e.target.value); } });
  }
  function satirMetin(r, kol) { return MM.aramaNorm ? MM.aramaNorm(kol.map(function (k) { return r[k]; }).join(' ')) : kol.map(function (k) { return r[k]; }).join(' ').toLowerCase(); }
  var LOJ_ROZET = { 'Sevk edildi': { yazi: 'var(--yesil)', zemin: 'var(--yesil-zemin)', ikon: 'tik' }, 'Planlandı': { yazi: 'var(--vurgu-sert)', zemin: 'var(--vurgu-zemin)', ikon: 'saat' } };
  function lojDurumAd(r) { return r.durum === 'Planlandı' && r.plan_tarihi && r.plan_tarihi < bugunISO() ? 'Planlandı · gecikmiş' : r.durum; }
  function lojRozet(r) { var d = lojDurumAd(r), st = LOJ_ROZET[r.durum]; if (d !== r.durum) st = { yazi: 'var(--ciddi)', zemin: 'var(--sari-zemin)', ikon: 'uyari' }; return st ? h('span', { sinif: 'tq-rozet', style: 'color:' + st.yazi + ';background:' + st.zemin }, [G.ikon(st.ikon, 13), d]) : '—'; }
  var ARA_ALAN = ['teslim_alan_kurum', 'malzeme', 'urun_kodu', 'siparis_no', 'irsaliye_no', 'teslimat_no', 'il', 'lojistik', 'yk_no'];
  function tesNo(r) { return r.teslimat_no || r.irsaliye_no; }    
  function turAd(r) { return r.tur === 'DMO' ? 'DMO' : (r.tur ? 'Özel' + (/DT/.test(r.tur) ? ' (doğrudan temin)' : '') : '—'); }
   
  function turSuz(v, t) {
    if (!t) return v;
    var c = Object.assign({}, v), dmoK = function (k) { return k.tur === 'Z004'; }, dmoS = function (r) { return r.tur === 'DMO'; };
    c.kayitlar = (v.kayitlar || []).filter(function (k) { return t === 'dmo' ? dmoK(k) : !dmoK(k); });
    if (v.lojistik && Array.isArray(v.lojistik.satirlar)) c.lojistik = Object.assign({}, v.lojistik, { satirlar: v.lojistik.satirlar.filter(function (r) { return t === 'dmo' ? dmoS(r) : !dmoS(r); }) });
    if (v.gunluk_sevkiyat && Array.isArray(v.gunluk_sevkiyat.satirlar)) c.gunluk_sevkiyat = Object.assign({}, v.gunluk_sevkiyat, { satirlar: v.gunluk_sevkiyat.satirlar.filter(function (r) { return t === 'dmo' ? dmoS(r) : !dmoS(r); }) });
    return c;
  }
  function miktarKol(r) { return r.miktar == null ? '—' : say(r.miktar) + (r.birim ? ' ' + r.birim : ''); }
  function lojistikGorunum(v, st, yeniden, turGr, turTem) {
    var kap = h('div'), lj = v.lojistik;
    if (!lj || !Array.isArray(lj.satirlar)) { kap.appendChild(G.bos({ baslik: 'Lojistik listesi yok', metin: 'Sevkiyat planı verisi henüz gelmedi.' })); return kap; }
    var bg = bugunISO(), tum = lj.satirlar.filter(function (r) { return r.miktar !== 0; }), pn = planNotu(v); if (pn) kap.appendChild(pn);
    if (lj.kesik) kap.appendChild(h('div', { sinif: 'bant sari kucuk-bant', role: 'status', metin: 'Liste kesik: ilk ' + say(tum.length) + ' satır gösteriliyor.' }));
    if (!st.d) { st.d = tum.some(function (r) { return r.plan_tarihi === bg; }) ? 'bugun' : 'tumu'; st.d0 = st.d; }
    if (!st.tarih) st.tarih = bg;
    var bugunSay = tum.filter(function (r) { return r.plan_tarihi === bg; }).length;
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.aracCubugu({
      arama: { deger: st.ara, yerTutucu: 'Ara: kurum, ürün, sipariş, irsaliye…', degisti: function (q) { st.ara = q; ciz(); } },
      filtre: { baslik: 'Filtre', temizle: function () { st.d = st.d0 || 'tumu'; st.durum = ''; st.sirket = ''; st.ara = ''; turTem(); yeniden(); },
        gruplar: [
          { ad: 'Plan tarihi', secenekler: [['bugun', 'Bugün', bugunSay], ['tumu', 'Tümü', tum.length], ['tarih', 'Tarih seç']], secili: st.d, varsayilan: st.d0 || 'tumu', sec: function (d) { st.d = d || 'tumu'; yeniden(); } },
          { ad: 'Durum', secenekler: [['', 'Tüm durumlar'], ['Sevk edildi', 'Sevk edildi'], ['Planlandı', 'Planlandı']], secili: st.durum, varsayilan: '', sec: function (d) { st.durum = d; yeniden(); } },
          { ad: 'Şirket', secenekler: [['', 'MY + DAY'], ['MY', 'MY'], ['DAY', 'DAY']], secili: st.sirket, varsayilan: '', sec: function (d) { st.sirket = d || ''; yeniden(); } },
          turGr] } })]));
    if (st.d === 'tarih') kap.appendChild(h('div', { sinif: 'ust-bosluk sv-tarih' }, [h('label', null, ['Plan tarihi ', h('input', { type: 'date', value: st.tarih, 'aria-label': 'Plan tarihi', onchange: function (e) { st.tarih = e.target.value || bg; yeniden(); } })])]));
    var alan = h('div', { sinif: 'ust-bosluk' });
    kap.appendChild(alan);
    var kol = [
      { ad: 'Teslim alan kurum', k: 'teslim_alan_kurum', ciz: function (r) { return dolu(r.teslim_alan_kurum); } },
      { ad: 'Durum', k: 'durum', ciz: function (r) { return lojRozet(r); }, csv: lojDurumAd },
      { ad: 'Plan tarihi', k: 'plan_tarihi', ciz: function (r) { return td(r.plan_tarihi); } },
      { ad: 'Sevk tarihi', k: 'sevk_tarihi', ciz: function (r) { return td(r.sevk_tarihi); } },
      { ad: 'Ürün', k: 'malzeme', ciz: function (r) { return dolu(r.malzeme); } },
      { ad: 'Miktar', k: 'miktar', sag: true, ciz: miktarKol, deger: function (r) { return r.miktar; } },
      { ad: 'Koli', k: 'koli', sag: true, ciz: function (r) { return r.koli == null ? '—' : say(r.koli); } },
      { ad: 'İl', k: 'il', ciz: function (r) { return dolu(r.il); } },
      { ad: 'Sipariş no', k: 'siparis_no', ciz: function (r) { return dolu(r.siparis_no); } },
      { ad: 'Teslimat no', k: 'teslimat_no', ciz: function (r) { return dolu(tesNo(r)); }, deger: tesNo },
      { ad: 'İrsaliye no', k: 'irsaliye_no', ciz: function (r) { return dolu(r.teslimat_no ? r.irsaliye_no : null); } },
      { ad: 'Lojistik', k: 'lojistik', ciz: function (r) { return dolu(r.lojistik); } },
      { ad: 'Tür', k: 'tur', ciz: turAd },
      { ad: 'Şirket', k: 'sirket', ciz: function (r) { return dolu(r.sirket); } }];
    function ciz() {
      alan.textContent = '';
      var q = MM.aramaNorm ? MM.aramaNorm(st.ara || '') : (st.ara || '').toLowerCase();
      var s = tum.filter(function (r) {
        if (st.d === 'bugun' && r.plan_tarihi !== bg) return false; if (st.d === 'tarih' && r.plan_tarihi !== st.tarih) return false;
        if (st.durum && r.durum !== st.durum) return false; if (st.sirket && r.sirket !== st.sirket) return false; return !q || satirMetin(r, ARA_ALAN).indexOf(q) >= 0;
      }).sort(function (a, b) { return (b.plan_tarihi || '') < (a.plan_tarihi || '') ? -1 : (b.plan_tarihi || '') > (a.plan_tarihi || '') ? 1 : 0; });
      var f = [st.d === 'bugun' ? 'Plan tarihi: bugün (' + td(bg) + ')' : st.d === 'tarih' ? 'Plan tarihi: ' + td(st.tarih) : 'Plan tarihi: tümü', 'Durum: ' + (st.durum || 'tümü'), 'Şirket: ' + (st.sirket || 'MY + DAY')]; if (st.ara) f.push('Arama: ' + st.ara);
      alan.appendChild(G.veriTablo({ ad: 'Lojistik', filtre: f.join(' · '), kolonlar: kol, satirlar: s, sayfa: 10, bos: st.d === 'bugun' ? 'Bugün için planlanmış sevkiyat yok; “Tümü” sekmesine bakın.' : 'Bu süzgeçte kayıt yok.' }));
    }
    ciz(); return kap;
  }
  


  var GS_ON = { DY: 'DAY', MY: 'MY' };
  function gsNorm(r) {
    return { sevk_tarihi: r.sevk_tarihi, teslim_alan_kurum: r.teslim_alan_kurum, urun_kodu: r.urun_kodu, malzeme: r.malzeme, miktar: r.miktar, koli_ici: r.koli_ici == null ? null : r.koli_ici,
      birim: r.birim, koli: r.koli == null ? null : r.koli, lokasyon: r.lokasyon, aciklama_var: r.aciklama_var === true,
      irsaliye_no: r.aciklama_var !== undefined || r.teslimat_no ? (r.irsaliye_no || null) : null, lojistik: r.lojistik, sirket: r.sirket || null, teslimat_no: r.teslimat_no || null };
  }
  function gsSirket(r, harita) { if (r.sirket) return r.sirket; var o = GS_ON[String(r.irsaliye_no || '').slice(0, 2)]; return o || (r.teslimat_no && harita[r.teslimat_no]) || ''; }
  function gsRozet(ad, yazi, zemin, ikon) { return h('span', { sinif: 'tq-rozet gs-rozet', style: 'color:' + yazi + ';background:' + zemin }, [G.ikon(ikon, 13), ad]); }
  function gsKurum(r) {
    var rz = [r.irsaliye_no ? gsRozet('İrsaliyeli', 'var(--yesil)', 'var(--yesil-zemin)', 'tik') : gsRozet('İrsaliyesiz', 'var(--soluk)', 'var(--yuzey3)', 'bilgi')];
    if (r.koli == null) rz.push(gsRozet('Koli girilmemiş', 'var(--sari)', 'var(--sari-zemin)', 'bilgi'));
    if (r.aciklama_var) rz.push(gsRozet('Not var', 'var(--vurgu-sert)', 'var(--vurgu-zemin)', 'bilgi'));
    return h('span', { sinif: 'gs-kurum' }, [h('span', { sinif: 'gs-kurum-ad', metin: dolu(r.teslim_alan_kurum) }), h('span', { sinif: 'gs-rozetler' }, rz)]);
  }
  function gsMiktarMetin(mk) { return birimler(mk).map(function (u) { return say(mk[u]) + (u === '—' ? '' : ' ' + u); }).join(' · ') || '—'; }
  function gunlukGorunum(v, st, yeniden, turGr, turTem) {
    var kap = h('div'), gs = v.gunluk_sevkiyat;
    if (!gs || !Array.isArray(gs.satirlar)) { kap.appendChild(G.bos({ baslik: 'Günlük sevk yok', metin: 'Günlük sevkiyat listesi henüz gelmedi.' })); return kap; }
    var okn = gs.okn && Array.isArray(gs.okn.satirlar) && gs.okn.satirlar.length ? gs.okn : null;
    var tum = (okn ? okn.satirlar : gs.satirlar).filter(function (r) { return r.miktar !== 0; }).map(gsNorm);
    if (!okn) { var pn = planNotu(v); if (pn) kap.appendChild(pn); }
    else {
      var odk = okn.dosya_zamani ? MM.yasDk(okn.dosya_zamani) : null;
      if (odk != null && odk > 36 * 60) kap.appendChild(h('div', { sinif: 'bant sari kucuk-bant', role: 'status', metin: 'Günlük liste ' + MM.yasMetin(odk) + ' güncellendi.' }));
      if (okn.dosya_zamani) kap.appendChild(veriSatiri(okn.dosya_zamani));
    }
    var gunler = [], gv = {}; tum.forEach(function (r) { if (r.sevk_tarihi && !gv[r.sevk_tarihi]) { gv[r.sevk_tarihi] = 1; gunler.push(r.sevk_tarihi); } }); gunler.sort();
    var son = gunler.length ? gunler[gunler.length - 1] : '';
    if (!st.bas) { st.bas = son || bugunISO(); st.bit = st.bas; }
    if (!st.grup) st.grup = 'liste';
    var sirketHarita = {};    
    ((v.lojistik && v.lojistik.satirlar) || []).forEach(function (r) { var n = tesNo(r); if (n && r.sirket) sirketHarita[n] = r.sirket; });
    var gruplar = [
      { ad: 'Rapor dönemi', secenekler: [['gun', 'Tek gün'], ['ay', 'Ay'], ['aralik', 'Tarih aralığı']], secili: st.mod, varsayilan: 'gun', sec: function (d) { st.mod = d || 'gun'; yeniden(); } },
      { ad: 'Şirket', secenekler: [['', 'MY + DAY'], ['MY', 'MY'], ['DAY', 'DAY']], secili: st.sirket, varsayilan: '', sec: function (d) { st.sirket = d || ''; yeniden(); } }];
    if (!okn) gruplar.push(turGr);
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.aracCubugu({
      arama: { deger: st.ara, yerTutucu: 'Ara: kurum, ürün, sipariş, irsaliye…', degisti: function (q) { st.ara = q; ciz(); } },
      filtre: { baslik: 'Filtre', temizle: function () { st.mod = 'gun'; st.bas = ''; st.bit = ''; st.sirket = ''; st.ara = ''; st.grup = 'liste'; turTem(); yeniden(); }, gruplar: gruplar } })]));
     
    function sirketUyar(r) { return !st.sirket || gsSirket(r, sirketHarita) === st.sirket; }
    var say7 = {}; tum.forEach(function (r) { if (sirketUyar(r)) say7[r.sevk_tarihi] = (say7[r.sevk_tarihi] || 0) + 1; });
    var gunSec = gunler.slice(-7).reverse().map(function (d) { return [d, td(d).slice(0, 5), say7[d] || 0]; });
    if (st.mod === 'gun' && gunler.length) kap.appendChild(h('div', { sinif: 'ust-bosluk gs-gunler' }, [G.segment(gunSec, st.bas, function (d) { st.mod = 'gun'; st.bas = st.bit = d; yeniden(); }, { ad: 'Sevk günü' })]));
    var gir = h('div', { sinif: 'ust-bosluk sv-tarih gs-gir' });
    if (st.mod === 'gun') {
      var onceki = '', sonraki = ''; gunler.forEach(function (d) { if (d < st.bas) onceki = d; if (d > st.bas && !sonraki) sonraki = d; });
      gir.appendChild(h('button', { type: 'button', sinif: 'mini-dugme gs-gezin', disabled: onceki ? null : 'disabled', 'aria-label': 'Önceki gün', onclick: function () { st.bas = st.bit = onceki; yeniden(); } }, ['‹ ', 'Önceki gün']));
      gir.appendChild(h('label', null, ['Gün ', h('input', { type: 'date', value: st.bas, 'aria-label': 'Gün', onchange: function (e) { st.bas = st.bit = e.target.value || son; yeniden(); } })]));
      gir.appendChild(h('button', { type: 'button', sinif: 'mini-dugme gs-gezin', disabled: sonraki ? null : 'disabled', 'aria-label': 'Sonraki gün', onclick: function () { st.bas = st.bit = sonraki; yeniden(); } }, ['Sonraki gün', ' ›']));
    }
    else if (st.mod === 'ay') gir.appendChild(h('label', null, ['Ay ', h('input', { type: 'month', value: st.bas.slice(0, 7), 'aria-label': 'Ay', onchange: function (e) { st.bas = (e.target.value || son.slice(0, 7)) + '-01'; yeniden(); } })]));
    else { gir.appendChild(h('label', null, ['Başlangıç ', h('input', { type: 'date', value: st.bas, 'aria-label': 'Başlangıç', onchange: function (e) { st.bas = e.target.value || son; if (st.bit < st.bas) st.bit = st.bas; yeniden(); } })])); gir.appendChild(h('label', null, ['Bitiş ', h('input', { type: 'date', value: st.bit, 'aria-label': 'Bitiş', onchange: function (e) { st.bit = e.target.value || st.bas; if (st.bit < st.bas) st.bas = st.bit; yeniden(); } })])); }
    kap.appendChild(gir);
    var ozAlan = h('div', { sinif: 'ust-bosluk' }), grupAlan = h('div', { sinif: 'ust-bosluk' }), alan = h('div', { sinif: 'ust-bosluk' });
    grupAlan.appendChild(G.segment([['liste', 'Liste'], ['kurum', 'Kuruma göre'], ['urun', 'Ürüne göre']], st.grup, function (d) { st.grup = d; ciz(); }, { ad: 'Gruplama' }));
    kap.appendChild(ozAlan); kap.appendChild(grupAlan); kap.appendChild(alan);
    function cv(k) { return function (r) { return r[k] == null ? '' : r[k]; }; }
    var kol = [
      { ad: 'Malı Teslim Alan', k: 'teslim_alan_kurum', ciz: gsKurum, csv: cv('teslim_alan_kurum') },
      { ad: 'Malzeme Kodu', k: 'urun_kodu', ciz: function (r) { return dolu(r.urun_kodu); }, csv: cv('urun_kodu') },
      { ad: 'Malzeme Adı', k: 'malzeme', ciz: function (r) { return dolu(r.malzeme); }, csv: cv('malzeme') },
      { ad: 'Miktar', k: 'miktar', sag: true, ciz: function (r) { return r.miktar == null ? '—' : say(r.miktar); }, deger: function (r) { return r.miktar; }, csv: cv('miktar') },
      { ad: 'Koli İçi Miktar', k: 'koli_ici', sag: true, ciz: function (r) { return r.koli_ici == null ? '—' : say(r.koli_ici); }, deger: function (r) { return r.koli_ici; }, csv: cv('koli_ici') },
      { ad: 'Ölçü Birimi', k: 'birim', ciz: function (r) { return dolu(r.birim); }, csv: cv('birim') },
      { ad: 'Koli Miktarı', k: 'koli', sag: true, ciz: function (r) { return r.koli == null ? '—' : say(r.koli); }, deger: function (r) { return r.koli; }, csv: cv('koli') },
      { ad: 'Sevk Tarih', k: 'sevk_tarihi', ciz: function (r) { return td(r.sevk_tarihi); }, csv: function (r) { return td(r.sevk_tarihi); } },
      { ad: 'Lokasyon', k: 'lokasyon', ciz: function (r) { return dolu(r.lokasyon); }, csv: cv('lokasyon') },
      { ad: 'Açıklama', k: 'aciklama_var', ciz: function (r) { return r.aciklama_var ? 'Var' : '—'; }, csv: function (r) { return r.aciklama_var ? 'Var' : ''; } },
      { ad: 'İrsaliye No', k: 'irsaliye_no', ciz: function (r) { return dolu(r.irsaliye_no); }, csv: cv('irsaliye_no') },
      { ad: 'Lojistik', k: 'lojistik', ciz: function (r) { return dolu(r.lojistik); }, csv: cv('lojistik') }];
    function grupla(s, anahtar) {
      var o = {}, sira = [];
      s.forEach(function (r) {
        var a = anahtar(r); if (!o[a]) { o[a] = { ad: a, kod: r.urun_kodu, satir: 0, tes: {}, koli: 0, kv: false, mk: {} }; sira.push(o[a]); }
        var g = o[a]; g.satir++; if (r.irsaliye_no) g.tes[r.irsaliye_no] = 1; if (r.koli != null) { g.koli += r.koli; g.kv = true; }
        if (r.miktar != null) g.mk[r.birim || '—'] = (g.mk[r.birim || '—'] || 0) + r.miktar;
      });
      return sira.sort(function (a, b) { return b.satir - a.satir || (a.ad < b.ad ? -1 : 1); });
    }
    function ciz() {
      alan.textContent = ''; ozAlan.textContent = '';
      var q = MM.aramaNorm ? MM.aramaNorm(st.ara || '') : (st.ara || '').toLowerCase(), bas = st.bas, bit = st.mod === 'gun' ? st.bas : st.bit;
      var s = tum.filter(function (r) {
        var t = r.sevk_tarihi || ''; if (st.mod === 'ay' ? t.slice(0, 7) !== bas.slice(0, 7) : (t < bas || t > bit)) return false;
        if (!sirketUyar(r)) return false;
        return !q || satirMetin(r, ['teslim_alan_kurum', 'malzeme', 'urun_kodu', 'irsaliye_no', 'lokasyon', 'lojistik']).indexOf(q) >= 0;
      }).sort(function (a, b) { return (b.sevk_tarihi || '') < (a.sevk_tarihi || '') ? -1 : (b.sevk_tarihi || '') > (a.sevk_tarihi || '') ? 1 : 0; });
      var mk = {}, ku = {}, ir = {}, kt = 0, kv = false, kSat = 0;
      s.forEach(function (r) { if (r.irsaliye_no) ir[r.irsaliye_no] = 1; if (r.miktar != null) mk[r.birim || '—'] = (mk[r.birim || '—'] || 0) + r.miktar; if (r.koli != null) { kt += r.koli; kv = true; kSat++; } if (r.teslim_alan_kurum) ku[r.teslim_alan_kurum] = 1; });
      var bu = birimler(mk), kp = [];
      kp.push({ baslik: 'Satır', deger: say(s.length), ikon: 'saat', alt: 'sevk satırı' });
      kp.push({ baslik: 'Miktar', deger: bu.length ? G.kisa(mk[bu[0]]) : '—', birim: bu.length && bu[0] !== '—' ? bu[0] : '', ikon: 'saat', alt: bu.length > 1 ? bu.slice(1).map(function (u) { return say(mk[u]) + ' ' + u; }).join(' · ') : 'toplam miktar' });
      kp.push({ baslik: 'Koli', deger: kv ? say(kt) : '—', ikon: 'saat', alt: kv ? 'koli girilen ' + say(kSat) + ' satır' : 'koli girilmemiş' });
      kp.push({ baslik: 'Teslim noktası', deger: say(Object.keys(ku).length), ikon: 'saat', alt: 'farklı kurum' });
      kp.push({ baslik: 'İrsaliye', deger: say(Object.keys(ir).length), ikon: 'saat', alt: 'farklı irsaliye' });
      ozAlan.appendChild(G.ozetSerit(kp, { en: 4 }));
      var donem = st.mod === 'gun' ? td(st.bas) : st.mod === 'ay' ? ayAd(st.bas.slice(0, 7)) : td(st.bas) + ' – ' + td(st.bit), f = 'Dönem: ' + donem + ' · Şirket: ' + (st.sirket || 'MY + DAY'); if (st.ara) f += ' · Arama: ' + st.ara;
      var bosYazi = st.mod === 'gun' ? 'Bu günde sevkiyat kaydı yok; önceki ya da sonraki güne geçin.' : 'Bu dönemde sevkiyat kaydı yok.';
      if (st.grup === 'liste') { alan.appendChild(G.veriTablo({ ad: 'Günlük sevk', filtre: f, kolonlar: kol, satirlar: s, sayfa: 10, bos: bosYazi })); return; }
      var ku2 = st.grup === 'kurum', gl = grupla(s, function (r) { return ku2 ? (r.teslim_alan_kurum || '—') : ((r.urun_kodu ? r.urun_kodu + ' · ' : '') + (r.malzeme || '—')); });
      var gkol = [
        { ad: ku2 ? 'Malı Teslim Alan' : 'Malzeme', k: 'ad', ciz: function (g) { return h('span', { sinif: 'gs-kurum' }, [h('span', { sinif: 'gs-kurum-ad', metin: g.ad })]); }, csv: function (g) { return g.ad; } },
        { ad: 'Satır', k: 'satir', sag: true, ciz: function (g) { return say(g.satir); }, deger: function (g) { return g.satir; } },
        { ad: 'İrsaliye', k: 'tes', sag: true, ciz: function (g) { return say(Object.keys(g.tes).length); }, deger: function (g) { return Object.keys(g.tes).length; } },
        { ad: 'Koli', k: 'koli', sag: true, ciz: function (g) { return g.kv ? say(g.koli) : '—'; }, deger: function (g) { return g.kv ? g.koli : null; }, csv: function (g) { return g.kv ? g.koli : ''; } },
        { ad: 'Miktar', k: 'mk', sag: true, ciz: function (g) { return gsMiktarMetin(g.mk); }, csv: function (g) { return gsMiktarMetin(g.mk); } }];
      alan.appendChild(G.veriTablo({ ad: ku2 ? 'Günlük sevk · kuruma göre' : 'Günlük sevk · ürüne göre', filtre: f, kolonlar: gkol, satirlar: gl, sayfa: 10, bos: bosYazi }));
    }
    ciz(); return kap;
  }

  MM.moduller.nakliye = function (kok) {
    var loj = { d: '', tarih: '', durum: '', sirket: '', ara: '' }, gun = { mod: 'gun', bas: '', bit: '', sirket: '', ara: '' };
    var yuk = null, hata = null, canli = true, durum = '', musteri = '', sirket = '', zaman = '', gorunum = 'sevk', kdurum = '', turF = '', ara = '', altSek = 'liste', kSek = '';
    var SEK_ANAHTAR = 'mm.nakliye.gorunum';
    try { var kg0 = localStorage.getItem(SEK_ANAHTAR); if (['sevk', 'loj', 'gunluk', 'kargo'].indexOf(kg0) >= 0) gorunum = kg0; } catch (e) {   }
    kok.appendChild(G.sayfaBasi({ baslik: 'Nakliye', alt: 'Yurtiçi sevkiyatlar: çıkış durumu ve gecikmeler', kirinti: [['Nakliye']] }));
    var gor0 = MM.modulListe || [], gcL = [['nakliye', 'Genel sevkiyat'], ['dmo-nakliyat', 'DMO Nakliyat']].filter(function (p) { return p[0] === 'nakliye' || gor0.some(function (m) { return m.id === p[0]; }); });
    if (gcL.length > 1) kok.appendChild(h('div', { sinif: 'nk-bolum' }, [G.segment(gcL, 'nakliye', function (d) { if (d !== 'nakliye') location.hash = '#' + d; }, { ad: 'Bölüm' })]));
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Nakliye alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri, dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK, o = ozet(turSuz(v, turF));
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (eski) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — sevkiyat listesi ' + MM.yasMetin(dk) + ' güncellendi.']));
       
      var vs = veriSatiri(v.asof).textContent;
      ust.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: MM.yasMetin(dk) + ' güncellendi · ' + vs }), h('span', { sinif: 'kaynak-etiket', metin: yuk.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]));
      ust.appendChild(h('div', { sinif: 'ust-bosluk nk-sekme' }, [G.sekmeler([['sevk', 'Sevkiyat', !eski && o.gecikmis ? h('span', { sinif: 'cip-sayi', metin: o.gecikmis + ' gecikmiş' }) : null], ['loj', 'Lojistik'], ['gunluk', 'Günlük rapor'], ['kargo', 'Kargo teslim']], gorunum, function (d) { gorunum = d || 'sevk'; try { localStorage.setItem(SEK_ANAHTAR, gorunum); } catch (e) {   } ciz(); }, { ad: 'Ekran bölümü', sinif: 'segment-dugme', goster: 3 })]));
      var turGr = { ad: 'Tür', secenekler: [['', 'Özel + DMO'], ['dmo', 'DMO'], ['ozel', 'Özel (doğrudan temin dahil)']], secili: turF, varsayilan: '', sec: function (d) { turF = d || ''; ciz(); } };
      function turTem() { turF = ''; }
      if (gorunum === 'loj') { govde.appendChild(lojistikGorunum(turSuz(v, turF), loj, ciz, turGr, turTem)); return; }
      if (gorunum === 'gunluk') { govde.appendChild(gunlukGorunum(turSuz(v, turF), gun, ciz, turGr, turTem)); return; }
      if (gorunum === 'kargo') {
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.aracCubugu({ filtre: { baslik: 'Filtre', temizle: function () { sirket = ''; ciz(); }, gruplar: [{ ad: 'Şirket', secenekler: [['', 'Tümü'], ['MY', 'MY'], ['DAY', 'DAY']], secili: sirket, varsayilan: '', sec: function (d) { sirket = d || ''; ciz(); } }] } })]));
        govde.appendChild(kargoGorunum(v, sirket, kSek, function (d) { kSek = d; ciz(); })); return;
      }
      if (!o.toplam) { govde.appendChild(G.bos({ baslik: 'Kayıt yok', metin: 'Listede sevkiyat yok.' })); return; }
      var kp = [];
      
      function sy(n) { return eski ? '—' : String(n); }
      function al(t) { return eski ? 'veri eski — sayı gösterilmiyor' : t; }
      kp.push({ baslik: 'Bugün çıkan', deger: sy(o.bugun), birim: eski ? '' : 'teslimat', ikon: 'tik', alt: al('fiili çıkış tarihi bugün') });
      kp.push({ baslik: 'Son 7 gün çıkan', deger: sy(o.hafta), birim: eski ? '' : 'teslimat', ikon: 'tik', alt: al('bugün dahil 7 gün') });
      kp.push({ baslik: 'Çıkış bekliyor', deger: sy(o.bekliyor), birim: eski ? '' : 'teslimat', ikon: 'saat', alt: al('plan tarihi geçmemiş'), tikla: function () { durum = durum === 'bekliyor' ? '' : 'bekliyor'; ciz(); } });
      kp.push({ baslik: 'Gecikmiş', deger: sy(o.gecikmis), birim: eski ? '' : 'teslimat', durum: !eski && o.gecikmis ? 'kritik' : null, ikon: 'uyari', alt: al('çıkışsız, planlanan çıkış tarihi geçti'), tikla: function () { durum = durum === 'gecikmis' ? '' : 'gecikmis'; ciz(); } });
      var kpDolu = kp.filter(function (x) { return x.deger !== '—'; });
      if (kpDolu.length) govde.appendChild(h('div', { sinif: 'nk-ozet' }, [G.ozetSerit(kpDolu, { en: 4 })]));
      else govde.appendChild(h('p', { sinif: 'veri-yok nk-ozet-yok', metin: 'Özet verisi yok' }));
       
      var cp = [['', 'Tümü', o.toplam]];
      ['gecikmis', 'bekliyor', 'cikti'].forEach(function (b) { if (o[b] || b !== 'cikti') cp.push([b, STIL[b].ad, o[b]]); });
      if (o.ic) cp.push(['ic', 'Şirket içi (DAY)', o.ic]);
      var ad = {}; o.liste.forEach(function (x) { if (x.k.musteri) ad[x.k.musteri] = 1; });
      var gruplarF = [
        { ad: 'Durum', secenekler: cp, secili: durum, varsayilan: '', sec: function (d) { durum = d; ciz(); } },
        { ad: 'Şirket', secenekler: [['', 'MY + DAY', o.toplam], ['MY', 'MY', o.my], ['DAY', 'DAY', o.day]], secili: sirket, varsayilan: '', sec: function (d) { sirket = d; ciz(); } },
        { ad: 'Zaman', secenekler: [['', T('Tüm günler')], ['bugun', T('Bugün')], ['hafta', T('Bu hafta')]], secili: zaman, varsayilan: '', sec: function (d) { zaman = d; ciz(); } }];
      if (v.kargo_teslim) gruplarF.push({ ad: 'Teslim durumu', secenekler: [['', 'Tüm teslim durumları'], ['teslim', 'Teslim edildi'], ['yolda', 'Yolda / bekliyor'], ['kanit', 'Kanıt yok']], secili: kdurum, varsayilan: '', sec: function (d) { kdurum = d; ciz(); } });
      gruplarF.push(turGr);
      gruplarF.push({ ad: 'Müşteri / hastane', secenekler: [['', 'Tüm müşteriler / hastaneler']].concat(Object.keys(ad).sort().map(function (a) { return [a, a]; })), secili: musteri, varsayilan: '', sec: function (d) { musteri = d || ''; ciz(); } });
      var alan = h('div');
      var xlYer = h('span', { sinif: 'nk-xl-yer' });
      govde.appendChild(h('div', { sinif: 'nk-arac-sira' }, [G.aracCubugu({
        arama: { deger: ara, yerTutucu: 'Ara', degisti: function (t) { ara = t; listeCiz(); } },
        cipler: [{ id: 'gecikmis', ad: STIL.gecikmis.ad, secili: durum === 'gecikmis', degisti: function (on) { durum = on ? 'gecikmis' : ''; ciz(); } }],
        filtre: { baslik: 'Filtre', gruplar: gruplarF, temizle: function () { durum = ''; sirket = ''; zaman = ''; kdurum = ''; turF = ''; musteri = ''; ara = ''; ciz(); } } }), xlYer]));
      govde.appendChild(h('div', { sinif: 'nk-segment-sira' }, [G.segment([['liste', 'Teslimat listesi'], ['ozet', 'Sevkiyat özeti']], altSek, function (d) { altSek = d; ciz(); }, { ad: 'Sevkiyat bölümü' })]));
      govde.appendChild(alan);
      if (altSek === 'ozet') ozetCiz(); else listeCiz();
      function ozetCiz() {
       
      if (!eski) {
        var bu7 = bugunSeri(), say7 = [0, 0, 0, 0, 0, 0, 0];
        o.liste.forEach(function (x) { if (x.k.ic || !x.k.cikis || (sirket && x.k.sirket !== sirket)) return; var d = bu7 - seri(x.k.cikis); if (d >= 0 && d < 7) say7[6 - d]++; });
        var oge7 = say7.map(function (n, i) { var iso = new Date((bu7 - (6 - i)) * 864e5).toISOString().slice(0, 10); return { e: kisaTarih(iso), d: n, renk: 'var(--vurgu)', ipucu: [tarihTR(iso) + ': ' + n + ' ' + T('çıkış'), ''] }; });
        alan.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: T('Son 7 gün çıkış'), alt: T('Günlük fiili çıkış yapılan teslimat') + (sirket ? ' · ' + sirket : ' · MY + DAY'), govde: G.cubuk(oge7, { yukseklik: 170, ad: T('Son 7 gün çıkış') }),
          tablo: { kolonlar: [T('Gün'), T('Çıkış')], satirlar: oge7.map(function (x) { return [x.e, x.d]; }) } })]));
      }
      var ozt = sevkOzet(v); if (ozt) alan.appendChild(ozt);
      }
      function listeCiz() {
      if (altSek !== 'liste') return;
      alan.textContent = '';
      var aq = MM.aramaNorm ? MM.aramaNorm(ara || '') : (ara || '').toLowerCase();
      var rank = { gecikmis: 0, bekliyor: 1, cikti: 2 };
      var liste = o.liste.filter(function (x) {
        if (aq) { var mt = [x.k.musteri, x.k.no, x.k.sirket, x.k.tasiyici].join(' '); if ((MM.aramaNorm ? MM.aramaNorm(mt) : mt.toLowerCase()).indexOf(aq) < 0) return false; }
        if (durum === 'ic') return !!x.k.ic && (!musteri || x.k.musteri === musteri);
        return !x.k.ic && (!durum || x.kova === durum) && (!sirket || x.k.sirket === sirket) && (!musteri || x.k.musteri === musteri) && (!kdurum || KD_GRUP[x.k.kargo_durum || 'kapsam_disi'] === kdurum);
      })
        .sort(function (a, b) { return rank[a.kova] - rank[b.kova] || b.gec - a.gec || (b.k.olusturma > a.k.olusturma ? 1 : -1); });
       
      var buGun = bugunSeri();
      function zamanUyar(x) {
        if (!zaman || x.kova === 'gecikmis') return true;
        var r = x.k.cikis || x.k.plan; if (!r) return false; var d = seri(r) - buGun;
        return zaman === 'bugun' ? d === 0 : (d >= -6 && d <= 6);
      }
      liste = liste.filter(zamanUyar);
      var xlKol = [{ ad: 'Müşteri / hastane', csv: function (x) { return x.k.musteri; } }, { ad: 'Teslimat no', csv: function (x) { return x.k.no; } }, { ad: 'Şirket', csv: function (x) { return x.k.ic ? 'Şirket içi (DAY)' : x.k.sirket; } }, { ad: 'Tür', csv: function (x) { return x.k.tur === 'Z004' ? 'DMO' : 'Özel'; } }, { ad: 'Durum', csv: function (x) { return STIL[x.kova].ad; } },
        { ad: 'Plan tarihi', csv: function (x) { return td(x.k.plan); } }, { ad: 'Çıkış tarihi', csv: function (x) { return td(x.k.cikis); } }, { ad: 'Gecikme (gün)', csv: function (x) { return x.gec || ''; } }, { ad: 'Taşıyıcı', csv: function (x) { return x.k.tasiyici; } }, { ad: 'Kargo durumu', csv: function (x) { return x.k.kargo_durum ? (KD[x.k.kargo_durum] || {}).ad : ''; } }];
      var xlSuz = [durum ? 'Durum: ' + (STIL[durum] ? STIL[durum].ad : durum) : '', sirket ? 'Şirket: ' + sirket : '', turF ? 'Tür: ' + turF : '', musteri ? 'Müşteri: ' + musteri : '', zaman ? 'Zaman: ' + zaman : '', ara ? 'Arama: ' + ara : ''].filter(Boolean).join(' · ');
      xlYer.textContent = '';
      var xl = liste.length ? G.excelDugme(function () { return { ad: 'Nakliye teslimat listesi', filtre: xlSuz, kolonlar: xlKol, satirlar: liste }; }) : null;
      if (xl) xlYer.appendChild(xl);
      var gec = liste.filter(function (x) { return x.kova === 'gecikmis'; }).sort(function (a, b) { return b.gec - a.gec; });
      var digeri = durum === 'gecikmis' ? [] : liste.filter(function (x) { return x.kova !== 'gecikmis'; });
      if (gec.length) {
         
        var gk = G.ilkN(gec, kart, { n: Math.min(3, gec.length), sinif: 'tq-liste' });
        alan.appendChild(h('section', { sinif: 'ns-gecikmis ust-bosluk', 'aria-label': T('Gecikmiş sevkiyatlar') }, [h('h3', { sinif: 'bolum' }, [G.ikon('uyari', 18), ' ' + T('Gecikmiş sevkiyatlar') + ' (' + gec.length + ')']),
          gk]));
      }
       
      var gruplar = {}, sirali = [];
      digeri.forEach(function (x) { var a = x.k.musteri || 'Müşteri bilinmiyor'; if (!gruplar[a]) { gruplar[a] = []; sirali.push(a); } gruplar[a].push(x); });
      sirali.sort(function (a, b) { return gruplar[b].length - gruplar[a].length || (a < b ? -1 : 1); });
      var kap = h('div', { sinif: 'ns-gruplar' }), ent = [];
      sirali.forEach(function (a) { var l = gruplar[a]; l.forEach(function (x, i) { ent.push({ x: x, bas: i === 0 ? a : null, say: l.length }); }); });
      function entCiz(e) {
        var f = document.createDocumentFragment();
        if (e.bas) f.appendChild(h('h4', { sinif: 'ns-grup-ad', 'aria-label': e.bas }, [e.bas, h('span', { sinif: 'cip-sayi', metin: String(e.say) })]));
        f.appendChild(kart(e.x)); return f;
      }
       
       
      if (ent.length) kap.appendChild(G.ilkN(ent, entCiz, { n: Math.max(2, 5 - Math.min(3, gec.length)), sinif: 'tq-liste' }));
      else if (!gec.length) kap.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu filtrede sevkiyat yok.' }));
      alan.appendChild(kap);
       
      }
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('nakliye', 'nakliye').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  };
})();
