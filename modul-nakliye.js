


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
    return h('div', { sinif: 'tq-veri-satir', metin: ok ? T('Veri') + ': ' + m + ' ' + T('itibarıyla') : T('Veri') + ': ' + T('zamanı bilinmiyor') });
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
    if (!d || d === 'kapsam_disi' || d === 'portalda_yok') return h('span', { sinif: 'kt-not', metin: 'Teslim edilmedi DEĞİL, kanıt yok' + (k.kargo_neden ? ' · ' + k.kargo_neden : '') });
    var p = [];
    if (k.tasiyici) p.push(k.tasiyici);
    if (d === 'teslim_edildi') p.push('Teslim ' + tarihTR(k.kargo_teslim_tarihi) + (k.kargo_teslim_gun != null ? ' (' + kgun(k.kargo_teslim_gun) + ')' : ''));
    else if (k.kargo_cikis_tarihi) p.push('Kargo çıkış ' + tarihTR(k.kargo_cikis_tarihi));
    if (k.esleme === 'tahmini') p.push('(tahmini)');
    return h('span', { sinif: 'kt-not', metin: p.join(' · ') });
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
  function kargoGorunum(v, sirket) {
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
    var kpi = h('div', { sinif: 'kpi-izgara tq-kpi' });
    if (!sh) {
      var ps = pg.durum || {}, yg = ps.yolda || {};
      kpi.appendChild(G.kpi({ baslik: 'Teslim oranı', deger: kyz(pg.teslim && pg.teslim.yuzde), ikon: 'tik', alt: ksay(pg.teslim && pg.teslim.pay) + ' / ' + ksay(pg.teslim && pg.teslim.payda) + ' gönderi teslim' }));
      kpi.appendChild(G.kpi({ baslik: 'Koli teslim oranı', deger: kyz(pg.koli_teslim && pg.koli_teslim.yuzde), ikon: 'tik', alt: ksay(pg.koli_teslim && pg.koli_teslim.pay) + ' / ' + ksay(pg.koli_teslim && pg.koli_teslim.payda) + ' koli' }));
      kpi.appendChild(G.kpi({ baslik: 'Yolda', deger: ksay(yg.gonderi), birim: 'gönderi', ikon: 'saat', alt: ksay(yg.koli) + ' koli' }));
      kpi.appendChild(G.kpi({ baslik: uyBaslik(kg), deger: ksay(kg.uzun_yolda_sayi), birim: 'gönderi', ikon: 'uyari', durum: kg.uzun_yolda_sayi ? 'kritik' : null, alt: '14 gün üstü: ' + ksay(kg.uzun_yolda_14_gun_ustu) }));
    } else {
      var bt = sh.bagli_teslimat_teslim || {}, dd = sh.kargo_durum_dagilimi || {};
      kpi.appendChild(G.kpi({ baslik: 'Teslim oranı', deger: kyz(bt.yuzde), ikon: 'tik', alt: ksay(bt.pay) + ' / ' + ksay(bt.payda) + ' bağlı teslimat' }));
      kpi.appendChild(G.kpi({ baslik: 'Koli teslim oranı', deger: '—', ikon: 'tik', alt: 'şirket bazında koli verisi yok' }));
      kpi.appendChild(G.kpi({ baslik: 'Yolda', deger: ksay((dd.yolda || 0) + (dd.dagitimda || 0)), birim: 'teslimat', ikon: 'saat', alt: 'taşıyıcıda, teslim edilmedi' }));
      kpi.appendChild(G.kpi({ baslik: uyBaslik(kg), deger: '—', ikon: 'uyari', alt: 'şirket bazında uzun yolda verisi yok' }));
    }
    kap.appendChild(kpi);
     
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
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Teslim durumu', govde: h('div', { sinif: 'dn-kargo' }, par) })]));
     
    var tas = kg.tasiyici || {}, tk2 = h('div', { sinif: 'kt-tas' });
    Object.keys(tas).forEach(function (t) {
      var x = tas[t] || {}, kisa = x.kapsam && x.kapsam !== 'TAM', p = [];
      if (!x.veri) p.push(h('p', { sinif: 'veri-yok', metin: 'Veri yok' }));
      else {
        p.push(kbar('Teslim', x.teslim_yuzde, 'var(--iyi)', ksay(x.teslim_gonderi) + ' / ' + ksay(x.giden_gonderi) + ' gönderi'));
        p.push(h('div', { sinif: 'kt-gun' }, [h('span', { metin: 'Çıkış → teslim' }), h('strong', { metin: 'ort. ' + kgun(x.teslim_gun_ort) + ' · medyan ' + kgun(x.teslim_gun_medyan) })]));
        if (x.negatif_gun_kayit) p.push(h('p', { sinif: 'kucuk soluk', metin: x.negatif_gun_kayit + ' kayıtta teslim tarihi çıkıştan önce görünüyor; süre ortalamasına alınmadı.' }));
      }
      if (kisa) p.push(h('div', { sinif: 'bant sari kucuk-bant', role: 'status', metin: 'Bu taşıyıcının bilgileri eksik geliyor; oranlar eksik olabilir.' }));
      tk2.appendChild(G.kart({ baslik: TAS_AD[t] || t, alt: x.son_basari ? 'Son başarılı okuma ' + MM.yasMetin(MM.yasDk(x.son_basari)) : 'Son okuma zamanı yok', govde: h('div', { sinif: 'dn-kargo' }, p) }));
    });
    if (tk2.childNodes.length) kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [tk2]));
     
    var s30 = kg.son_30_gun || [];
    if (s30.length) {
      var et = s30.map(function (x) { return kisaTarih(x.tarih); });
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Son 30 gün: kargo çıkışı ve teslim', alt: 'Taşıyıcı portalı, gönderi adedi/gün' + (sirket ? ' · şirket ayrımı yok, tüm gönderiler' : ''),
        govde: h('div', null, [G.cizgi([{ ad: 'Çıkış', d: s30.map(function (x) { return x.cikis; }), renk: 'var(--vurgu)' }, { ad: 'Teslim', d: s30.map(function (x) { return x.teslim; }), renk: 'var(--iyi)' }], et, { yukseklik: 190, ad: 'Son 30 gün kargo çıkış ve teslim', birim: 'gönderi' }), G.lejant([['Çıkış', 'var(--vurgu)'], ['Teslim', 'var(--iyi)']])]),
        tablo: { kolonlar: ['Gün', 'Çıkış', 'Teslim'], satirlar: s30.map(function (x) { return [kisaTarih(x.tarih), x.cikis, x.teslim]; }) } })]));
    }
     
    var il = (kg.il || []).filter(function (x) { return x.teslim_gun_ort != null; }).slice(0, 12);
    if (il.length) {
      var mx = Math.max.apply(null, il.map(function (x) { return x.teslim_gun_ort; }));
      var ilNot = kg.il_bilinmeyen_gonderi ? 'İli bilinmeyen ' + ksay(kg.il_bilinmeyen_gonderi) + ' gönderi bu grafiğe girmez.' : 'İli bilinmeyen gönderi yok.';
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'İl bazında ortalama teslim süresi', alt: 'En çok gönderi giden 12 il · çıkıştan teslime gün · ' + ilNot,
        govde: G.yatay(il.map(function (x) { return { e: x.il, alt: ksay(x.teslim_gonderi) + ' / ' + ksay(x.giden_gonderi) + ' teslim', d: x.teslim_gun_ort, etiketDeger: kgun(x.teslim_gun_ort), renk: x.teslim_gun_ort >= 10 ? 'var(--ciddi)' : 'var(--vurgu)' }; }), { maks: mx, ad: 'İl bazında teslim günü' }) })]));
    }
     
    var uy = kg.uzun_yolda || [];
    if (uy.length || kg.uzun_yolda_sayi) {
      var ul = h('div', { sinif: 'kt-uy' });
      ul.appendChild(G.sayfali(uy, function (x) {
        return h('div', { sinif: 'kt-uy-sat' }, [h('strong', { sinif: 'kt-uy-no', metin: x.takip_no || '—' }), h('span', { sinif: 'kt-uy-gun', metin: ksay(x.gun) + ' gün' }),
          h('span', { sinif: 'kt-uy-alt', metin: [x.tasiyici, x.il, 'çıkış ' + tarihTR(x.cikis_tarihi)].filter(Boolean).join(' · ') })]);
      }, { n: 10 }));
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: uyBaslik(kg) + ' · ' + ksay(kg.uzun_yolda_sayi) + ' gönderi', alt: 'Portalda hâlâ teslim görünmeyen; en uzun bekleyen üstte',
        govde: h('div', null, [kg.uzun_yolda_liste_kesik ? h('p', { sinif: 'kucuk dn-tahmin', metin: 'Liste kesik: ilk ' + ksay(uy.length) + ' gönderi gösteriliyor, toplam ' + ksay(kg.uzun_yolda_sayi) + '.' }) : null, uy.length ? ul : h('p', { sinif: 'veri-yok', metin: 'Liste verisi yok' })]) })]));
    }
    return kap;
  }
  function kart(x) {
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
    var g = s.gunluk_30 || [];
    if (g.length) {
      var et = g.map(function (x) { return kisaTarih(x.tarih); });
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'Son 30 gün sevkiyat', alt: 'Günlük çıkışı yapılan teslimat sayısı · günlük ortalama koli ' + (s.gunluk_ort_koli == null ? '—' : say(s.gunluk_ort_koli)) + koliOranMetin(g.reduce(function (t, x) { var o = koliOran(x); return o ? [(t ? t[0] : 0) + o[0], (t ? t[1] : 0) + o[1]] : t; }, null)),
        govde: h('div', null, [G.cizgi([{ ad: 'Teslimat', d: g.map(function (x) { return x.sevk_teslimat; }), renk: 'var(--vurgu)' }], et, { yukseklik: 190, ad: 'Son 30 gün günlük sevkiyat teslimat sayısı', birim: 'teslimat' }), G.lejant([['Teslimat', 'var(--vurgu)']])]),
        tablo: { kolonlar: ['Gün', 'Teslimat', 'Satır', 'Miktar'], satirlar: g.map(function (x) { return [kisaTarih(x.tarih), x.sevk_teslimat, x.sevk_satir, miktarMetin(x.adet_birim)]; }) },
        eylem: ekExcel('Son 30 gün sevkiyat', ['Gün', 'Teslimat', 'Satır', 'Miktar', 'Koli'].map(function (a, i) { return { ad: a, k: i }; }), g.map(function (x) { return [td(x.tarih), x.sevk_teslimat, x.sevk_satir, miktarMetin(x.adet_birim), x.koli]; })) })]));
    }
    var tp = s.top10_urun || [];
    if (tp.length) {
      var mx = Math.max.apply(null, tp.map(function (x) { return x.sevk_satir || 0; }).concat([1]));
      kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: 'En çok sevk edilen 10 ürün', alt: 'Sevk satırı sayısına göre; miktar kendi biriminde' + (s.urun_cesidi_60g != null ? ' · son 60 günde ' + say(s.urun_cesidi_60g) + ' ürün çeşidi' : ''),
        govde: G.yatay(tp.map(function (x) { return { e: x.malzeme || x.urun_kodu, alt: dolu(x.urun_kodu) + ' · ' + miktarMetin(x.adet_birim), d: x.sevk_satir, etiketDeger: say(x.sevk_satir) + ' satır', renk: 'var(--vurgu)' }; }), { maks: mx, ad: 'En çok sevk edilen 10 ürün' }),
        eylem: ekExcel('En çok sevk edilen 10 ürün', ['Ürün kodu', 'Ürün', 'Sevk satırı', 'Miktar'].map(function (a, i) { return { ad: a, k: i }; }), tp.map(function (x) { return [x.urun_kodu, x.malzeme, x.sevk_satir, miktarMetin(x.adet_birim)]; })) })]));
    }
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
  function miktarKol(r) { return r.miktar == null ? '—' : say(r.miktar) + (r.birim ? ' ' + r.birim : ''); }
  function lojistikGorunum(v, st, yeniden) {
    var kap = h('div'), lj = v.lojistik;
    if (!lj || !Array.isArray(lj.satirlar)) { kap.appendChild(G.bos({ baslik: 'Lojistik listesi yok', metin: 'Sevkiyat planı verisi henüz gelmedi.' })); return kap; }
    var bg = bugunISO(), tum = lj.satirlar.filter(function (r) { return r.miktar !== 0; }), pn = planNotu(v); if (pn) kap.appendChild(pn);
    if (lj.kesik) kap.appendChild(h('div', { sinif: 'bant sari kucuk-bant', role: 'status', metin: 'Liste kesik: ilk ' + say(tum.length) + ' satır gösteriliyor.' }));
    if (!st.d) st.d = tum.some(function (r) { return r.plan_tarihi === bg; }) ? 'bugun' : 'tumu';
    if (!st.tarih) st.tarih = bg;
    var bugunSay = tum.filter(function (r) { return r.plan_tarihi === bg; }).length;
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['bugun', 'Bugün', bugunSay], ['tumu', 'Tümü', tum.length], ['tarih', 'Tarih seç']], st.d, function (d) { st.d = d || 'tumu'; yeniden(); }, 'Plan tarihi')]));
    if (st.d === 'tarih') kap.appendChild(h('div', { sinif: 'ust-bosluk sv-tarih' }, [h('label', null, ['Plan tarihi ', h('input', { type: 'date', value: st.tarih, 'aria-label': 'Plan tarihi', onchange: function (e) { st.tarih = e.target.value || bg; yeniden(); } })])]));
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'Tüm durumlar'], ['Sevk edildi', 'Sevk edildi'], ['Planlandı', 'Planlandı']], st.durum, function (d) { st.durum = d; yeniden(); }, 'Durum filtresi')]));
    var alan = h('div', { sinif: 'ust-bosluk' });
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [araKutu(st.ara, function (q) { st.ara = q; ciz(); })])); kap.appendChild(alan);
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
      { ad: 'Şirket', k: 'sirket', ciz: function (r) { return dolu(r.sirket); } }];
    function ciz() {
      alan.textContent = '';
      var q = MM.aramaNorm ? MM.aramaNorm(st.ara || '') : (st.ara || '').toLowerCase();
      var s = tum.filter(function (r) {
        if (st.d === 'bugun' && r.plan_tarihi !== bg) return false; if (st.d === 'tarih' && r.plan_tarihi !== st.tarih) return false;
        if (st.durum && r.durum !== st.durum) return false; return !q || satirMetin(r, ARA_ALAN).indexOf(q) >= 0;
      }).sort(function (a, b) { return (b.plan_tarihi || '') < (a.plan_tarihi || '') ? -1 : (b.plan_tarihi || '') > (a.plan_tarihi || '') ? 1 : 0; });
      var f = [st.d === 'bugun' ? 'Plan tarihi: bugün (' + td(bg) + ')' : st.d === 'tarih' ? 'Plan tarihi: ' + td(st.tarih) : 'Plan tarihi: tümü', 'Durum: ' + (st.durum || 'tümü')]; if (st.ara) f.push('Arama: ' + st.ara);
      alan.appendChild(G.veriTablo({ ad: 'Lojistik', filtre: f.join(' · '), kolonlar: kol, satirlar: s, sayfa: 50, bos: st.d === 'bugun' ? 'Bugün için planlanmış sevkiyat yok; “Tümü” sekmesine bakın.' : 'Bu süzgeçte kayıt yok.' }));
    }
    ciz(); return kap;
  }
  function gunlukGorunum(v, st, yeniden) {
    var kap = h('div'), gs = v.gunluk_sevkiyat;
    if (!gs || !Array.isArray(gs.satirlar)) { kap.appendChild(G.bos({ baslik: 'Günlük rapor yok', metin: 'Günlük sevkiyat verisi henüz gelmedi.' })); return kap; }
    var tum = gs.satirlar.filter(function (r) { return r.miktar !== 0; }), pn = planNotu(v); if (pn) kap.appendChild(pn);
    var son = tum.reduce(function (m, r) { return r.sevk_tarihi && r.sevk_tarihi > m ? r.sevk_tarihi : m; }, '');
    if (!st.bas) { st.bas = son || bugunISO(); st.bit = st.bas; }
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['gun', 'Tek gün'], ['ay', 'Ay'], ['aralik', 'Tarih aralığı']], st.mod, function (d) { st.mod = d || 'gun'; yeniden(); }, 'Rapor dönemi')]));
    var gir = h('div', { sinif: 'ust-bosluk sv-tarih' });
    if (st.mod === 'gun') gir.appendChild(h('label', null, ['Gün ', h('input', { type: 'date', value: st.bas, 'aria-label': 'Gün', onchange: function (e) { st.bas = st.bit = e.target.value || son; yeniden(); } })]));
    else if (st.mod === 'ay') gir.appendChild(h('label', null, ['Ay ', h('input', { type: 'month', value: st.bas.slice(0, 7), 'aria-label': 'Ay', onchange: function (e) { st.bas = (e.target.value || son.slice(0, 7)) + '-01'; yeniden(); } })]));
    else { gir.appendChild(h('label', null, ['Başlangıç ', h('input', { type: 'date', value: st.bas, 'aria-label': 'Başlangıç', onchange: function (e) { st.bas = e.target.value || son; if (st.bit < st.bas) st.bit = st.bas; yeniden(); } })])); gir.appendChild(h('label', null, ['Bitiş ', h('input', { type: 'date', value: st.bit, 'aria-label': 'Bitiş', onchange: function (e) { st.bit = e.target.value || st.bas; if (st.bit < st.bas) st.bas = st.bit; yeniden(); } })])); }
    kap.appendChild(gir);
    var ozAlan = h('div', { sinif: 'ust-bosluk' }), alan = h('div', { sinif: 'ust-bosluk' });
    kap.appendChild(h('div', { sinif: 'ust-bosluk' }, [araKutu(st.ara, function (q) { st.ara = q; ciz(); })])); kap.appendChild(ozAlan); kap.appendChild(alan);
    var kol = [
      { ad: 'Teslim alan kurum', k: 'teslim_alan_kurum', ciz: function (r) { return dolu(r.teslim_alan_kurum); } },
      { ad: 'Sevk tarihi', k: 'sevk_tarihi', ciz: function (r) { return td(r.sevk_tarihi); } },
      { ad: 'Ürün', k: 'malzeme', ciz: function (r) { return dolu(r.malzeme); } },
      { ad: 'Miktar', k: 'miktar', sag: true, ciz: miktarKol, deger: function (r) { return r.miktar; } },
      { ad: 'Koli', k: 'koli', sag: true, ciz: function (r) { return r.koli == null ? '—' : say(r.koli); } },
      { ad: 'Sipariş no', k: 'siparis_no', ciz: function (r) { return dolu(r.siparis_no); } },
      { ad: 'Teslimat no', k: 'teslimat_no', ciz: function (r) { return dolu(tesNo(r)); }, deger: tesNo },
      { ad: 'İrsaliye no', k: 'irsaliye_no', ciz: function (r) { return dolu(r.teslimat_no ? r.irsaliye_no : null); } },
      { ad: 'Lojistik', k: 'lojistik', ciz: function (r) { return dolu(r.lojistik); } },
      { ad: 'Lokasyon', k: 'lokasyon', ciz: function (r) { return dolu(r.lokasyon); } },
      { ad: 'Açıklama', k: 'aciklama', ciz: function (r) { return dolu(r.aciklama); } }];
    function ciz() {
      alan.textContent = ''; ozAlan.textContent = '';
      var q = MM.aramaNorm ? MM.aramaNorm(st.ara || '') : (st.ara || '').toLowerCase(), bas = st.bas, bit = st.mod === 'gun' ? st.bas : st.bit;
      var s = tum.filter(function (r) {
        var t = r.sevk_tarihi || ''; if (st.mod === 'ay' ? t.slice(0, 7) !== bas.slice(0, 7) : (t < bas || t > bit)) return false;
        return !q || satirMetin(r, ARA_ALAN.concat(['lokasyon', 'aciklama'])).indexOf(q) >= 0;
      }).sort(function (a, b) { return (b.sevk_tarihi || '') < (a.sevk_tarihi || '') ? -1 : (b.sevk_tarihi || '') > (a.sevk_tarihi || '') ? 1 : 0; });
      var mk = {}, ku = {}, ir = {}, kt = 0, kv = false, tsl = {}, tslK = {};
      s.forEach(function (r) { var tn = tesNo(r); if (tn) { tsl[tn] = 1; if (r.koli != null) tslK[tn] = 1; } if (r.miktar != null) mk[r.birim || '—'] = (mk[r.birim || '—'] || 0) + r.miktar; if (r.koli != null) { kt += r.koli; kv = true; } if (r.teslim_alan_kurum) ku[r.teslim_alan_kurum] = 1; if (tn) ir[tn] = 1; });
      var bu = birimler(mk), kp = h('div', { sinif: 'kpi-izgara tq-kpi' });
      kp.appendChild(G.kpi({ baslik: 'Satır', deger: say(s.length), ikon: 'saat', alt: 'sevk satırı' }));
      kp.appendChild(G.kpi({ baslik: 'Miktar', deger: bu.length ? G.kisa(mk[bu[0]]) : '—', birim: bu.length ? bu[0] : '', ikon: 'saat', alt: bu.length > 1 ? bu.slice(1).map(function (u) { return say(mk[u]) + ' ' + u; }).join(' · ') : 'toplam miktar' }));
      kp.appendChild(G.kpi({ baslik: 'Koli', deger: kv ? say(kt) : '—', ikon: 'saat', alt: kv ? 'toplam koli' + (Object.keys(tsl).length ? ' · ' + Object.keys(tslK).length + '/' + Object.keys(tsl).length + ' teslimatta var' : '') : 'koli bilgisi yok' }));
      kp.appendChild(G.kpi({ baslik: 'Teslim noktası', deger: say(Object.keys(ku).length), ikon: 'saat', alt: 'farklı kurum' }));
      kp.appendChild(G.kpi({ baslik: 'Teslimat', deger: say(Object.keys(ir).length), ikon: 'saat', alt: 'farklı teslimat' }));
      ozAlan.appendChild(kp);
      var donem = st.mod === 'gun' ? td(st.bas) : st.mod === 'ay' ? ayAd(st.bas.slice(0, 7)) : td(st.bas) + ' – ' + td(st.bit), f = 'Dönem: ' + donem; if (st.ara) f += ' · Arama: ' + st.ara;
      alan.appendChild(G.veriTablo({ ad: 'Günlük rapor', filtre: f, kolonlar: kol, satirlar: s, sayfa: 50, bos: 'Bu dönemde sevkiyat kaydı yok.' }));
    }
    ciz(); return kap;
  }

  MM.moduller.nakliye = function (kok) {
    var loj = { d: '', tarih: '', durum: '', ara: '' }, gun = { mod: 'gun', bas: '', bit: '', ara: '' };
    var yuk = null, hata = null, canli = true, durum = '', musteri = '', sirket = '', zaman = '', gorunum = 'sevk', kdurum = '';
    kok.appendChild(G.sayfaBasi({ baslik: 'Nakliye', alt: 'Yurtiçi sevkiyatlar: çıkış durumu ve gecikmeler', kirinti: [['Nakliye']] }));
    var gc = G.bolumGecis([['nakliye', 'Genel sevkiyat'], ['dmo-nakliyat', 'DMO Nakliyat']], 'nakliye'); if (gc) kok.appendChild(gc);
    var ust = h('div'), govde = h('div', { 'aria-live': 'polite' });
    kok.appendChild(ust); kok.appendChild(govde);
    function ciz() {
      ust.textContent = ''; govde.textContent = '';
      if (hata) { govde.appendChild(G.bos({ tur: hata.kod === 'ayar_bekleniyor' || hata.kod === 'giris_gerekli' ? 'bekle' : 'hata', baslik: 'Nakliye alınamadı', metin: hata.message, eylem: { ad: 'Yeniden dene', fn: yenile } })); return; }
      if (!yuk) { govde.appendChild(G.iskelet('kart', 4)); return; }
      var v = yuk.veri, dk = MM.yasDk(v.asof), eski = dk == null || dk > ESKI_DK, o = ozet(v);
      if (v.ornek === true) ust.appendChild(h('div', { sinif: 'bant ornek kucuk-bant', role: 'alert', metin: 'ÖRNEK VERİ — gerçek değil' }));
      if (eski) ust.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Veri eski' }), ' — sevkiyat listesi ' + MM.yasMetin(dk) + ' güncellendi.']));
      ust.appendChild(h('div', { sinif: 'tazelik' }, [h('span', { sinif: 'nokta ' + (eski ? 'sari' : 'yesil'), 'aria-hidden': 'true' }), h('span', { metin: MM.yasMetin(dk) + ' güncellendi' }), h('span', { sinif: 'kaynak-etiket', metin: yuk.kaynak === 'graph' ? 'OneDrive' : 'yerel kopya' })]));
      ust.appendChild(veriSatiri(v.asof));
      ust.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['sevk', 'Sevkiyat'], ['loj', 'Lojistik'], ['gunluk', 'Günlük rapor'], ['kargo', 'Kargo teslim']], gorunum, function (d) { gorunum = d || 'sevk'; ciz(); }, 'Ekran bölümü')]));
      if (gorunum === 'loj') { govde.appendChild(lojistikGorunum(v, loj, ciz)); return; }
      if (gorunum === 'gunluk') { govde.appendChild(gunlukGorunum(v, gun, ciz)); return; }
      if (gorunum === 'kargo') {
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'Tümü'], ['MY', 'MY'], ['DAY', 'DAY']], sirket, function (d) { sirket = d; ciz(); }, 'Şirket filtresi')]));
        govde.appendChild(kargoGorunum(v, sirket)); return;
      }
      if (!o.toplam) { govde.appendChild(G.bos({ baslik: 'Kayıt yok', metin: 'Listede sevkiyat yok.' })); return; }
      var kp = h('div', { sinif: 'kpi-izgara tq-kpi' });
      
      function sy(n) { return eski ? '—' : String(n); }
      function al(t) { return eski ? 'veri eski — sayı gösterilmiyor' : t; }
      kp.appendChild(G.kpi({ baslik: 'Bugün çıkan', deger: sy(o.bugun), birim: eski ? '' : 'teslimat', ikon: 'tik', alt: al('fiili çıkış tarihi bugün') }));
      kp.appendChild(G.kpi({ baslik: 'Son 7 gün çıkan', deger: sy(o.hafta), birim: eski ? '' : 'teslimat', ikon: 'tik', alt: al('bugün dahil 7 gün') }));
      kp.appendChild(G.kpi({ baslik: 'Çıkış bekliyor', deger: sy(o.bekliyor), birim: eski ? '' : 'teslimat', ikon: 'saat', alt: al('plan tarihi geçmemiş'), tikla: function () { durum = durum === 'bekliyor' ? '' : 'bekliyor'; ciz(); } }));
      kp.appendChild(G.kpi({ baslik: 'Gecikmiş', deger: sy(o.gecikmis), birim: eski ? '' : 'teslimat', durum: !eski && o.gecikmis ? 'kritik' : null, ikon: 'uyari', alt: al('çıkışsız, planlanan çıkış tarihi geçti'), tikla: function () { durum = durum === 'gecikmis' ? '' : 'gecikmis'; ciz(); } }));
      govde.appendChild(kp);
       
      if (!eski) {
        var bu7 = bugunSeri(), say7 = [0, 0, 0, 0, 0, 0, 0];
        o.liste.forEach(function (x) { if (x.k.ic || !x.k.cikis || (sirket && x.k.sirket !== sirket)) return; var d = bu7 - seri(x.k.cikis); if (d >= 0 && d < 7) say7[6 - d]++; });
        var oge7 = say7.map(function (n, i) { var iso = new Date((bu7 - (6 - i)) * 864e5).toISOString().slice(0, 10); return { e: kisaTarih(iso), d: n, renk: 'var(--vurgu)', ipucu: [tarihTR(iso) + ': ' + n + ' ' + T('çıkış'), ''] }; });
        govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.kart({ baslik: T('Son 7 gün çıkış'), alt: T('Günlük fiili çıkış yapılan teslimat') + (sirket ? ' · ' + sirket : ' · MY + DAY'), govde: G.cubuk(oge7, { yukseklik: 170, ad: T('Son 7 gün çıkış') }),
          tablo: { kolonlar: [T('Gün'), T('Çıkış')], satirlar: oge7.map(function (x) { return [x.e, x.d]; }) } })]));
      }
      var ozt = sevkOzet(v); if (ozt) govde.appendChild(ozt);
      govde.appendChild(h('h3', { sinif: 'bolum', metin: 'Teslimat listesi' }));
      var cp = [['', 'Tümü', o.toplam]];
      ['gecikmis', 'bekliyor', 'cikti'].forEach(function (b) { if (o[b]) cp.push([b, STIL[b].ad, o[b]]); });
      if (o.ic) cp.push(['ic', 'Şirket içi (DAY)', o.ic]);
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler(cp, durum, function (d) { durum = d; ciz(); }, 'Durum filtresi')]));
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'MY + DAY', o.toplam], ['MY', 'MY', o.my], ['DAY', 'DAY', o.day]], sirket, function (d) { sirket = d; ciz(); }, 'Şirket filtresi')]));
      govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', T('Tüm günler')], ['bugun', T('Bugün')], ['hafta', T('Bu hafta')]], zaman, function (d) { zaman = d; ciz(); }, T('Zaman filtresi'))]));
      if (v.kargo_teslim) govde.appendChild(h('div', { sinif: 'ust-bosluk' }, [G.cipler([['', 'Tüm teslim durumları'], ['teslim', 'Teslim edildi'], ['yolda', 'Yolda / bekliyor'], ['kanit', 'Kanıt yok']], kdurum, function (d) { kdurum = d; ciz(); }, 'Teslim durumu filtresi')]));
      var ad = {}; o.liste.forEach(function (x) { if (x.k.musteri) ad[x.k.musteri] = 1; });
      var sel = h('select', { 'aria-label': 'Müşteri / hastane filtresi', sinif: 'ust-bosluk', style: 'max-width:100%', onchange: function (e) { musteri = e.target.value; ciz(); } },
        [h('option', { value: '', metin: 'Tüm müşteriler / hastaneler' })].concat(Object.keys(ad).sort().map(function (a) { var op = h('option', { value: a, metin: a }); if (a === musteri) op.selected = true; return op; })));
      govde.appendChild(sel);
      var rank = { gecikmis: 0, bekliyor: 1, cikti: 2 };
      var liste = o.liste.filter(function (x) {
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
      var gec = liste.filter(function (x) { return x.kova === 'gecikmis'; }).sort(function (a, b) { return b.gec - a.gec; });
      var digeri = durum === 'gecikmis' ? [] : liste.filter(function (x) { return x.kova !== 'gecikmis'; });
      if (gec.length) {
        var gk = h('div', { sinif: 'tq-liste' }); gk.appendChild(G.sayfali(gec, kart, { n: 10 }));
        govde.appendChild(h('section', { sinif: 'ns-gecikmis ust-bosluk', 'aria-label': T('Gecikmiş sevkiyatlar') }, [h('h3', { sinif: 'bolum' }, [G.ikon('uyari', 18), ' ' + T('Gecikmiş sevkiyatlar') + ' (' + gec.length + ')']),
          h('p', { sinif: 'kucuk soluk', metin: T('En çok geciken en üstte.') }), gk]));
      }
       
      var gruplar = {}, sirali = [];
      digeri.forEach(function (x) { var a = x.k.musteri || 'Müşteri bilinmiyor'; if (!gruplar[a]) { gruplar[a] = []; sirali.push(a); } gruplar[a].push(x); });
      sirali.sort(function (a, b) { return gruplar[b].length - gruplar[a].length || (a < b ? -1 : 1); });
      var kap = h('div', { sinif: 'ns-gruplar' });
      if (sirali.length) kap.appendChild(G.sayfali(sirali, function (a) {
        var l = gruplar[a], ic = h('div', { sinif: 'tq-liste' }); l.forEach(function (x) { ic.appendChild(kart(x)); });
        return h('section', { sinif: 'ns-grup', 'aria-label': a }, [h('h4', { sinif: 'ns-grup-ad' }, [a, h('span', { sinif: 'cip-sayi', metin: String(l.length) })]), ic]);
      }, { n: 8 }));
      else if (!gec.length) kap.appendChild(h('p', { sinif: 'veri-yok', metin: 'Bu filtrede sevkiyat yok.' }));
      govde.appendChild(kap);
       
    }
    function yenile() { hata = null; yuk = null; ciz(); window.MMVeri.oku('nakliye', 'nakliye').then(function (r) { yuk = r; hata = null; }).catch(function (e) { hata = e; }).then(function () { if (canli) ciz(); }); }
    yenile();
    return function () { canli = false; };
  };
})();
