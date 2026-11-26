




(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var YENILE_MS = 30000;      
  var YUKLEME_ZA_MS = 12000;  

  function gunToplamlari(d) {   
    var m = {};
    (d.gunluk_kompres || []).forEach(function (s) {
      var x = m[s.gun] || (m[s.gun] = { g: s.gun, o: 0, t: 0, hs: 0, th: 0 }); x.hs++;
      if (s.tahmin) { x.t += s.kompres || 0; x.th++; } else x.o += s.kompres || 0;
    });
    return Object.keys(m).sort().map(function (k) { return m[k]; });
  }

  




  function rozetMantik(pano, simdi, esikSn) {
    var esik = esikSn || 900, asof = Date.parse(pano && pano.asof), liste = (pano && pano.hatlar) || [], hatlar = [], sonMs = 0, taze = 0;
    liste.forEach(function (x) {
      if (!x || x.kapali === true) return;
      var gec = typeof x.veri_yas_sn === 'number' ? x.veri_yas_sn : null, ok = false, son = null;
      if (!isNaN(asof) && gec != null) { son = asof - gec * 1000; ok = x.durum !== 'no_data' && ((simdi - asof) / 1000 + gec) <= esik; }
      if (son != null && son > sonMs) sonMs = son;
      if (ok) taze++;
      hatlar.push({ hat: x.hat, taze: ok, durum: x.durum });
    });
    var n = hatlar.length, gecikmeli = n - taze;
    return { hatlar: hatlar, n: n, taze: taze, gecikmeli: gecikmeli, sonMs: sonMs, seviye: n && taze === n ? 'iyi' : (taze > 0 ? 'sari' : 'kotu') };
  }
  function rozetYama(mantik, T) {   
    var veri = null;
    function oku() {
      var l = document.querySelectorAll('script#pano-veri');
      for (var i = 0; i < l.length; i++) {
        try { var p = JSON.parse(l[i].textContent.replace(/\/\*\/?VERI:[a-z]+\*\//g, '')); if (p && p.hatlar && p.hatlar.length) return p; } catch (e) { }
      }
      return null;
    }
    function saat(ms) { var d = new Date(ms), z = function (v) { return (v < 10 ? '0' : '') + v; }; return z(d.getHours()) + ':' + z(d.getMinutes()); }
    function tik() {
      if (!veri) veri = oku(); if (!veri) return;
      var m = mantik(veri, Date.now());
      var sinif = m.seviye === 'iyi' ? 'r-ok' : (m.seviye === 'sari' ? 'r-eski' : 'r-hata');
      var metin = m.seviye === 'iyi' ? T.canli : (m.seviye === 'sari' ? T.kismi.replace('{n}', m.gecikmeli) : T.tumu.replace('{t}', m.sonMs ? saat(m.sonMs) : '—'));
      var rl = document.querySelectorAll('#ust-sag .rozet');
      for (var i = 0; i < rl.length; i++) {
        var r = rl[i], tx = r.textContent;
        if (!(r.id === 'canli-rozet' || /Canl|Live/.test(tx) || r.classList.contains('r-ok'))) continue;
        var s = 'rozet ' + sinif, y = (m.seviye === 'iyi' ? '● ' : '▲ ') + metin;
        if (r.className !== s) r.className = s;
        if (r.textContent !== y) r.textContent = y;
      }
      var gec = {}; m.hatlar.forEach(function (x) { if (!x.taze) gec[x.hat] = 1; });
      var kl = document.querySelectorAll('.kart.hat[data-key]');
      for (var j = 0; j < kl.length; j++) {
        var k = kl[j], ad = (k.getAttribute('data-key') || '').replace(/^hat:/, '');
        if (!gec[ad]) continue;
        if (!k.classList.contains('no_data')) { ['calisiyor', 'durdu', 'sorunlu', 'hedefalti'].forEach(function (c) { k.classList.remove(c); }); k.classList.add('no_data'); }
        var d = k.querySelector('.durum');
        if (d) { if (d.className !== 'durum d-no_data') d.className = 'durum d-no_data'; if (d.textContent !== '○ ' + T.kart) d.textContent = '○ ' + T.kart; }
      }
    }
    setInterval(tik, 1000); setTimeout(tik, 50);
  }
  function rozetBetik() {
    var T = { canli: MM.t('Canlı'), kismi: MM.t('{n} hatta veri gecikmeli'), tumu: MM.t('Veri gecikmeli (son: {t})'), kart: MM.t('Veri gecikmeli') };
    var kod = '(' + rozetYama.toString() + ')(' + rozetMantik.toString() + ',' + JSON.stringify(T) + ');';
    return '<script>' + kod.replace(/<\//g, '<\\/') + '<\/script>';
  }
  function rozetEkle(html) {
    var i = html.indexOf('<head'), j = i >= 0 ? html.indexOf('>', i) + 1 : 0;
    return html.slice(0, j) + rozetBetik() + html.slice(j);
  }

  function hataKutusu(e) {
    var baslik = { ayar_bekleniyor: 'Giriş ayarı bekleniyor', giris_gerekli: 'Giriş gerekli', bulunamadi: 'Pano henüz hazır değil', ag: 'Veriye ulaşılamadı', bicim: 'Pano okunamadı' }[e.kod] || 'Hata';
    return h('div', { sinif: 'bant ' + (e.kod === 'ayar_bekleniyor' || e.kod === 'giris_gerekli' || e.kod === 'bulunamadi' ? 'gri' : 'kirmizi'), role: 'alert' }, [h('strong', { metin: baslik }), ' — ' + e.message]);
  }

  



  var PS = { sablon: null, sablonSurum: null, gecmis: null, gecmisSurum: null, yokMs: 0 };
  var ISARET_SIRA = ['VERI:mabotex', 'GECMIS:mabotex', 'VERI:dokuma', 'GECMIS:dokuma', 'KUME:dokuma'];
  function panoDoldur(sablon, bloklar) {
    var html = sablon;
    for (var i = 0; i < ISARET_SIRA.length; i++) {
      var is = ISARET_SIRA[i], bas = '/*' + is + '*/', son = '/*/' + is + '*/', eski = bas + 'null' + son, a = html.indexOf(eski), b = bloklar[is];
      if (a < 0 || (typeof b !== 'string' && b !== null)) return null;
      html = html.slice(0, a) + bas + (b === null ? 'null' : b) + son + html.slice(a + eski.length);
    }
    return html;
  }
  async function panoAl() {
    var V = window.MMVeri, simdi = Date.now();
    if (simdi - PS.yokMs > 300000) {
      try {
        var c = (await V.oku('fabrika', 'pano-canli')).veri;
        if (c && c.surum === 2 && c.bloklar && c.sablon_surum && c.gecmis_surum) {
          var gerek = [];
          if (PS.sablonSurum !== c.sablon_surum) gerek.push(V.oku('fabrika', 'pano-sablon').then(function (r) { var s = r.veri || {}; if (s.surum !== c.sablon_surum || typeof s.html !== 'string') throw new Error('sablon'); PS.sablon = s.html; PS.sablonSurum = s.surum; }));
          if (PS.gecmisSurum !== c.gecmis_surum) gerek.push(V.oku('fabrika', 'pano-gecmis-app').then(function (r) { var g = r.veri || {}; if (g.surum !== c.gecmis_surum || !g.bloklar) throw new Error('gecmis'); PS.gecmis = g.bloklar; PS.gecmisSurum = g.surum; }));
          if (gerek.length) await Promise.all(gerek);   
          var bl = Object.assign({}, PS.gecmis, c.bloklar);
          return { kaynak: 'uc', asof: c.asof, uretildi: c.uretildi, bloklar: bl, html: function () { return panoDoldur(PS.sablon, bl); } };
        }
      } catch (e) {
        if (e && (e.kod === 'giris_gerekli' || e.kod === 'ayar_bekleniyor' || e.kod === 'ag')) throw e;   
        PS.sablonSurum = PS.gecmisSurum = null; PS.yokMs = Date.now();   
      }
    }
    var r = await V.oku('fabrika', 'pano-uygulama'), v = r.veri || {};
    return { kaynak: 'eski', asof: v.asof, uretildi: v.uretildi, bloklar: null, html: function () { return v.html; } };
  }

  function panoJson(v) {   
    var p = null, a = '/*VERI:mabotex*/', b = '/*/VERI:mabotex*/';
    try {
      if (v.bloklar && typeof v.bloklar['VERI:mabotex'] === 'string') p = JSON.parse(v.bloklar['VERI:mabotex']);
      else { var html = v.html(), i = html.indexOf(a), j = html.indexOf(b); if (i >= 0 && j > i) p = JSON.parse(html.slice(i + a.length, j)); }
    } catch (e) { p = null; }
    return p && p.hatlar && p.hatlar.length ? p : null;
  }

  MM.moduller.makineler = function (kok) {
    var sayfa = h('div', { sinif: 'mk-pano', hidden: true }), uyari = h('div', { 'aria-live': 'polite' });
     
    var ozetKap = h('div', { sinif: 'mk-ozet' }), segKap = h('div', { sinif: 'mk-seg' }), sonPano = null, panoSurum = null, denendi = false, panoAcik = false, sonV = null;
    function ozetCiz() {
      var p = sonPano, m = p ? rozetMantik(p, Date.now()) : null, taze = !!m && m.seviye === 'iyi', tarih = null;
      ozetKap.textContent = '';
      if (!p && !denendi) { ozetKap.appendChild(G.iskelet('kart', 2)); return; }   
      if (m) {
        tarih = m.sonMs || null;
        if (!taze && m.gecikmeli > 0 && m.taze > 0) {   
          var en = null, j = 0;
          (p.hatlar || []).forEach(function (x) {
            if (!x || x.kapali === true) return;
            var hh = m.hatlar[j++], t = Date.parse(p.asof) - (typeof x.veri_yas_sn === 'number' ? x.veri_yas_sn * 1000 : NaN);
            if (hh && !hh.taze && !isNaN(t) && (en == null || t < en)) en = t;
          });
          if (en != null) tarih = en;
        }
      }
      var rozet = G.tazelik(tarih ? new Date(tarih) : null, taze ? 'taze' : 'eski'), not = null;
      if (m && !taze) not = h('span', { sinif: 'mk-not', metin: m.taze > 0 ? MM.t('{n} hatta veri gecikmeli').replace('{n}', m.gecikmeli) : MM.t('Veri gecikmeli (son: {t})').replace('{t}', tarih ? new Date(tarih).toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' }) : '—') });
      if (!m) not = h('span', { sinif: 'mk-not', metin: MM.t('Veri yok') });
      ozetKap.appendChild(h('div', { sinif: 'mk-rozet-sira' }, [rozet, not]));
      var ks = p && p.kaynak ? p.kaynak : null;
      if (p && (p.ornek === true || (ks && ks.durum === 'ornek'))) ozetKap.appendChild(h('div', { sinif: 'bant sari', role: 'alert' }, [h('strong', { metin: MM.t('ÖRNEK VERİ') }), ' — ' + MM.t('gerçek makine verisi değil')]));
      else if (ks && ks.durum && ks.durum !== 'ok') ozetKap.appendChild(h('div', { sinif: 'bant gri', role: 'status' }, [h('strong', { metin: MM.t('Veri yok') }), ' — ' + (ks.mesaj || ks.durum)]));
      var cal = 0, dur = 0, yok = 0, n = m ? m.hatlar.length : 0;
      if (m) m.hatlar.forEach(function (x) { if (!x.taze || x.durum === 'no_data' || x.durum === 'unknown') yok++; else if (x.durum === 'durdu' || x.durum === 'sorunlu') dur++; else cal++; });
      var al = MM.makineEkDurum && MM.makineEkDurum.alarm != null ? MM.makineEkDurum.alarm : null;
      var kutular = [
        { baslik: MM.t('Çalışan hat'), deger: m ? cal + ' / ' + n : '—', durum: m && cal === 0 ? 'kritik' : null },
        { baslik: MM.t('Duran / sorunlu hat'), deger: m ? String(dur) : '—', durum: dur > 0 ? 'uyari' : null },
        { baslik: MM.t('Veri yok'), deger: m ? String(yok) : '—', durum: yok > 0 ? 'yok' : null }
      ];
      if (al != null) kutular.push({ baslik: MM.t('Alarm (24 sa)'), deger: String(al) });
      ozetKap.appendChild(G.ozetSerit(kutular, { en: 4 }));
    }
    window.addEventListener('mm-makine-ek', ozetCiz);
    var ozetTmr = setInterval(function () { if (!document.hidden) ozetCiz(); }, 15000);
     
    var tamAcik = false, tamDugme = null;
    function tamAyarla(a) {
      tamAcik = !!a; kok.classList.toggle('mk-pano-tam', tamAcik);
      if (tamDugme) {
        var ad = MM.t(tamAcik ? 'Panoyu küçült' : 'Panoyu büyüt');
        tamDugme.setAttribute('aria-label', ad); tamDugme.setAttribute('title', ad);
        tamDugme.textContent = ''; tamDugme.appendChild(h('span', { 'aria-hidden': 'true', metin: tamAcik ? '⤡' : '⤢' }));
        if (!tamAcik) tamDugme.appendChild(h('span', { sinif: 'mk-pano-yazi', metin: 'Büyüt' }));
      }
      if (tamAcik) { if (window.pageYOffset) window.scrollTo(0, 0); sayfa.style.height = ''; sayfa.style.minHeight = ''; }
      else { boyutla(); setTimeout(boyutla, 300); }
    }
    function tamDugmeKur() {
      if (tamDugme) return;
      tamDugme = h('button', { type: 'button', sinif: 'mk-pano-dugme' });
      tamDugme.addEventListener('click', function () { tamAyarla(!tamAcik); });
      sayfa.appendChild(tamDugme); tamAyarla(false);
    }
    function tamDugmeKaldir() {
      tamAcik = false; kok.classList.remove('mk-pano-tam');
      if (tamDugme && tamDugme.parentNode) tamDugme.parentNode.removeChild(tamDugme);
      tamDugme = null;
    }
    function bolumGoster(id) {
      sayfa.hidden = id !== 'pano'; ozetKap.hidden = id === 'pano'; kok.classList.toggle('mk-pano-ac', id === 'pano');
      if (id !== 'pano') tamDugmeKaldir(); else tamDugmeKur();
      if (MM.makineEkGoster) MM.makineEkGoster(id);
      if (id === 'pano') { panoAc(); boyutla(); setTimeout(boyutla, 300); } else if (panoAcik) panoKapat();
    }
    segKap.appendChild(G.segment([['hatlar', MM.t('Hatlar')], ['duruslar', MM.t('Duruşlar')], ['gecmis', MM.t('Geçmiş')], ['pano', MM.t('Canlı pano')]], 'hatlar', bolumGoster, { ad: MM.t('Makineler görünümü') }));
    kok.appendChild(ozetKap); kok.appendChild(segKap); kok.appendChild(sayfa); if (MM.makineEk) MM.makineEk(kok);  
    ozetCiz();
    var bekci = null, aktif = null, bekleyen = null, bekleyenHtml = null, sonSurum = null, ss = {}, canli_ = true, yukleniyor = false, sonCizim = 0;
    var yukleme = G.iskelet('kart', 4);
    sayfa.appendChild(yukleme);
    function yuklemeKaldir() { if (yukleme && yukleme.parentNode) yukleme.parentNode.removeChild(yukleme); yukleme = null; }

    function degistir() {   
      clearTimeout(bekci); if (kok.contains(uyari)) { uyari.textContent = ''; kok.removeChild(uyari); }
      var eski = aktif; aktif = bekleyen; bekleyen = null; bekleyenHtml = null;
      aktif.classList.remove('bekleyen');
      if (eski && eski.parentNode) eski.parentNode.removeChild(eski);
    }
    function mesaj(e) {
      var d = e.data; if (!d || typeof d.mm !== 'string') return;
      var f = bekleyen && e.source === bekleyen.contentWindow ? bekleyen : (aktif && e.source === aktif.contentWindow ? aktif : null);
      if (!f) return;
      if (d.mm === 'hazir' && f === bekleyen && bekleyenHtml) f.contentWindow.postMessage({ mm: 'html', html: bekleyenHtml, ss: ss }, '*');
      else if (d.mm === 'yuklendi' && f === bekleyen) degistir();
      else if (d.mm === 'ss' && d.ss && typeof d.ss === 'object') ss = d.ss;
    }
    window.addEventListener('message', mesaj);

    function cerceve(html) {
      if (bekleyen && bekleyen.parentNode) bekleyen.parentNode.removeChild(bekleyen);
      var f = document.createElement('iframe');
      f.className = 'mk-pano-f' + (aktif ? ' bekleyen' : '');
      f.setAttribute('sandbox', 'allow-scripts');   
      f.setAttribute('title', 'Canlı fabrika panosu');
      f.setAttribute('referrerpolicy', 'no-referrer');
      bekleyen = f; bekleyenHtml = rozetEkle(html);
      clearTimeout(bekci);
      bekci = setTimeout(function () {   
        if (bekleyen !== f || !sayfa.isConnected) return;
        var d = h('button', { sinif: 'mini-dugme', type: 'button', metin: 'Yeniden dene' });
        d.addEventListener('click', function () { sonSurum = null; yukle(); });
        var b = h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Pano açılamadı' }), ' — veri alındı ama pano çizilemedi. ', d]);
        uyari.textContent = ''; uyari.appendChild(b);
        if (!kok.contains(uyari)) kok.insertBefore(uyari, segKap);
      }, YUKLEME_ZA_MS);
      f.src = 'pano-kabuk.html' + (MM.dil && MM.dil() === 'en' ? '?dil=en' : '');   
      sayfa.appendChild(f);
      boyutla(); setTimeout(boyutla, 300); setTimeout(boyutla, 1200);
    }
     
    function boyutla() {
      if (tamAcik) {   
        if (window.innerWidth >= 600) { tamAyarla(false); return; }
        sayfa.style.height = ''; sayfa.style.minHeight = ''; return;
      }
      var menu = document.getElementById('menu'), mr = menu ? menu.getBoundingClientRect() : null;
      if (!sayfa.isConnected || !mr || mr.height >= 120 || mr.top <= 0) return;
      if (window.pageYOffset) window.scrollTo(0, 0);
      var hh = Math.floor(mr.top - sayfa.getBoundingClientRect().top);
      if (hh >= 280) { sayfa.style.minHeight = '0'; sayfa.style.height = hh + 'px'; }
      if (window.pageYOffset) window.scrollTo(0, 0);
    }
    window.addEventListener('resize', boyutla); window.addEventListener('orientationchange', boyutla);

    function panoCiz(v, surum) {   
      if (!panoAcik) return;
      if (!aktif || surum !== sonSurum) {
        if (aktif && Date.now() - sonCizim < 55000) {   }
        else {
          var html = v.html();
          if (typeof html !== 'string' || html.length < 1000) throw Object.assign(new Error('Pano dosyası okunamadı'), { kod: 'bicim' });
          uyari.textContent = '';
          if (kok.contains(uyari)) kok.removeChild(uyari);
          sonSurum = surum; sonCizim = Date.now();
          yuklemeKaldir();
          cerceve(html);
        }
      } else { uyari.textContent = ''; if (kok.contains(uyari)) kok.removeChild(uyari); }
    }
    function panoAc() {
      panoAcik = true; sonSurum = null; sonCizim = 0;
      if (!sonV) return;
      try { panoCiz(sonV.v, sonV.surum); } catch (e) {
        yuklemeKaldir(); uyari.textContent = ''; uyari.appendChild(hataKutusu(e)); kok.insertBefore(uyari, segKap);
      }
    }
    function panoKapat() {
      panoAcik = false; clearTimeout(bekci);
      [aktif, bekleyen].forEach(function (f) { if (f && f.parentNode) f.parentNode.removeChild(f); });
      aktif = null; bekleyen = null; bekleyenHtml = null; sonSurum = null;
      uyari.textContent = ''; if (kok.contains(uyari)) kok.removeChild(uyari);
    }
    async function yukle() {
      if (yukleniyor || !canli_) return; yukleniyor = true;
      try {
        var v = await panoAl();
        var surum = String(v.uretildi || v.asof || '');
        if (panoSurum !== surum || !sonPano) { var pj = panoJson(v); if (pj) { sonPano = pj; panoSurum = surum; } ozetCiz(); }
        sonV = { v: v, surum: surum };
        panoCiz(v, surum);
      } catch (e) {
        yuklemeKaldir();
        uyari.textContent = '';
        if (aktif) uyari.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Pano güncellenemedi' }), ' — gördüğünüz son alınabilen sürümdür.']));
        else uyari.appendChild(hataKutusu(e));
        kok.insertBefore(uyari, segKap);
      }
      yukleniyor = false;
      if (!denendi) { denendi = true; ozetCiz(); }
    }
    yukle();
    var zamanlayici = setInterval(function () { if (!document.hidden) yukle(); }, YENILE_MS);
    function onGorun() { if (!document.hidden) yukle(); }
    document.addEventListener('visibilitychange', onGorun);
    return function temizle() {
      canli_ = false; panoKapat(); clearInterval(zamanlayici); clearTimeout(bekci); clearInterval(ozetTmr); kok.classList.remove('mk-pano-ac'); tamDugmeKaldir(); window.removeEventListener('mm-makine-ek', ozetCiz);
      document.removeEventListener('visibilitychange', onGorun); window.removeEventListener('message', mesaj);
    };
  };
  MM.fabrika = { gunToplamlari: gunToplamlari, rozetMantik: rozetMantik, rozetEkle: rozetEkle, panoAl: panoAl, panoDoldur: panoDoldur };
})();
