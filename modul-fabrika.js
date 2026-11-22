




(function () {
  'use strict';
  var MM = window.MM, h = MM.h, G = MM.gr;
  var YENILE_MS = 60000;      
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

  MM.moduller.makineler = function (kok) {
    var sayfa = h('div', { sinif: 'mk-pano' }), uyari = h('div', { 'aria-live': 'polite' });
    kok.appendChild(sayfa); if (MM.makineEk) MM.makineEk(kok);  
    var bekci = null, aktif = null, bekleyen = null, bekleyenHtml = null, sonSurum = null, ss = {}, canli_ = true, yukleniyor = false;
    var yukleme = G.iskelet('kart', 4);
    sayfa.appendChild(yukleme);
    function yuklemeKaldir() { if (yukleme && yukleme.parentNode) yukleme.parentNode.removeChild(yukleme); yukleme = null; }

    function degistir() {   
      clearTimeout(bekci); if (sayfa.contains(uyari)) { uyari.textContent = ''; sayfa.removeChild(uyari); }
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
        if (!sayfa.contains(uyari)) sayfa.insertBefore(uyari, sayfa.firstChild);
      }, YUKLEME_ZA_MS);
      f.src = 'pano-kabuk.html' + (MM.dil && MM.dil() === 'en' ? '?dil=en' : '');   
      sayfa.appendChild(f);
      boyutla(); setTimeout(boyutla, 300); setTimeout(boyutla, 1200);
    }
     
    function boyutla() {
      var menu = document.getElementById('menu'), mr = menu ? menu.getBoundingClientRect() : null;
      if (!sayfa.isConnected || !mr || mr.height >= 120 || mr.top <= 0) return;
      if (window.pageYOffset) window.scrollTo(0, 0);
      var hh = Math.floor(mr.top - sayfa.getBoundingClientRect().top);
      if (hh >= 280) { sayfa.style.minHeight = '0'; sayfa.style.height = hh + 'px'; }
      if (window.pageYOffset) window.scrollTo(0, 0);
    }
    window.addEventListener('resize', boyutla); window.addEventListener('orientationchange', boyutla);

    async function yukle() {
      if (yukleniyor || !canli_) return; yukleniyor = true;
      try {
        var r = await window.MMVeri.oku('fabrika', 'pano-uygulama');
        var v = r.veri || {};
        if (typeof v.html !== 'string' || v.html.length < 1000) throw Object.assign(new Error('Pano dosyası okunamadı'), { kod: 'bicim' });
        uyari.textContent = '';
        if (sayfa.contains(uyari)) sayfa.removeChild(uyari);
        var surum = String(v.uretildi || v.asof || '');
        if (!aktif || surum !== sonSurum) {
          sonSurum = surum;
          yuklemeKaldir();
          cerceve(v.html);
        }
      } catch (e) {
        yuklemeKaldir();
        uyari.textContent = '';
        if (aktif) uyari.appendChild(h('div', { sinif: 'bant sari', role: 'status' }, [h('strong', { metin: 'Pano güncellenemedi' }), ' — gördüğünüz son alınabilen sürümdür.']));
        else uyari.appendChild(hataKutusu(e));
        sayfa.insertBefore(uyari, sayfa.firstChild);
      }
      yukleniyor = false;
    }
    yukle();
    var zamanlayici = setInterval(function () { if (!document.hidden) yukle(); }, YENILE_MS);
    function onGorun() { if (!document.hidden) yukle(); }
    document.addEventListener('visibilitychange', onGorun);
    return function temizle() {
      canli_ = false; clearInterval(zamanlayici); clearTimeout(bekci);
      document.removeEventListener('visibilitychange', onGorun); window.removeEventListener('message', mesaj);
    };
  };
  MM.fabrika = { gunToplamlari: gunToplamlari, rozetMantik: rozetMantik, rozetEkle: rozetEkle };
})();
