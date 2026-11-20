

(function () {
  'use strict';
  var MM = window.MM, gr = MM.gr, h = gr.h;
  var KORU = ['rol', 'mod', 'durum', 'sakin', 'nakliyeci'];
  function nakliyeciMi() { return !!(window.MMVeri && window.MMVeri.kisitli && window.MMVeri.kisitli()); }   

  

  var vtBicim = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  MM.veriTarihi = function (el, iso) {
    if (!el) return null;
    var eski = el.querySelector && el.querySelector('.veri-tarihi'); if (eski) eski.remove();
    var t = iso ? Date.parse(iso) : NaN, en = MM.dil && MM.dil() === 'en', dk = isNaN(t) ? null : (Date.now() - t) / 60000, metin;
    if (isNaN(t)) metin = en ? 'Data: date unknown' : 'Veri: tarih bilinmiyor';
    else { var s = vtBicim.format(new Date(t)).replace(',', ''); metin = en ? 'Data as of ' + s : 'Veri: ' + s + ' itibarıyla'; }
    var e = MM.h('div', { sinif: 'veri-tarihi' + (dk != null && dk > 1440 ? ' eski' : ''), role: 'note', metin: metin });
    el.insertBefore(e, el.firstChild); return e;
  };
   
  (function () { var m = document.querySelector('.ust .marka'); if (m && !m.querySelector('a')) { var a = MM.h('a', { href: '#ana', sinif: 'marka-link', 'aria-label': 'MY Medikal — Ana sayfa' }); while (m.firstChild) a.appendChild(m.firstChild); m.appendChild(a); } })();

   
  if (/HeadlessChrome/.test(navigator.userAgent) || /[?&]sakin/.test(location.search)) document.documentElement.classList.add('sakin');

   
  MM.git = function (href) {
    var qi = href.indexOf('?'), hi = href.indexOf('#'), hash = hi >= 0 ? href.slice(hi) : '';
    var eski = new URLSearchParams(location.search), y = new URLSearchParams();
    KORU.forEach(function (k) { if (eski.has(k)) y.set(k, eski.get(k)); });
    if (qi >= 0) new URLSearchParams(href.slice(qi + 1, hi >= 0 ? hi : undefined)).forEach(function (v, k) { y.set(k, v); });
    var qs = y.toString();
    history.pushState(null, '', location.pathname + (qs ? '?' + qs : '') + hash);
    window.dispatchEvent(new Event('hashchange'));
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    var q = new URLSearchParams(location.search), fazla = false; q.forEach(function (v, k) { if (KORU.indexOf(k) < 0) fazla = true; });
    if (fazla) { e.preventDefault(); MM.git(a.getAttribute('href')); }
  });
  window.addEventListener('hashchange', function () { setTimeout(function () { var m = document.getElementById('icerik'); if (m && document.activeElement === document.body) m.focus({ preventScroll: true }); }, 0); });

   
  var araAc = document.getElementById('ara-ac'), zil = document.getElementById('zil'), tema = document.getElementById('tema');
  araAc.querySelector('.ara-ikon').appendChild(gr.ikon('arama', 18));
  zil.querySelector('.zil-ikon').appendChild(gr.ikon('zil', 20));
  function temaIkonu() {
    var koyu = (document.documentElement.getAttribute('data-tema') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'koyu' : 'acik')) === 'koyu';
    var k = tema.querySelector('.tema-ikon'); k.textContent = ''; k.appendChild(gr.ikon(koyu ? 'gun' : 'ay', 20)); tema.setAttribute('title', koyu ? 'Açık temaya geç' : 'Koyu temaya geç');
  }
  temaIkonu(); tema.addEventListener('click', function () { setTimeout(temaIkonu, 0); });
   
  var dilSag = tema.parentNode, dilKap = h('div', { sinif: 'dil-sec', role: 'group', 'aria-label': 'Dil / Language' });
  [['tr', 'TR', 'Türkçe'], ['en', 'EN', 'English']].forEach(function (d) {
    dilKap.appendChild(h('button', { type: 'button', sinif: 'dil-dugme' + (MM.dil() === d[0] ? ' secili' : ''), title: d[2], lang: d[0], 'aria-pressed': MM.dil() === d[0] ? 'true' : 'false', metin: d[1], onclick: function () { MM.dilSec(d[0]); } }));
  });
  dilSag.insertBefore(dilKap, tema);
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) araAc.querySelector('kbd').textContent = '⌘ K';

   
  var oz = null, ozYuk = null;
  function veriAl(zorla) { ozYuk = (MM.acikHazir || Promise.resolve()).then(function () { return MM.ozet.yukle(zorla); }).then(function (x) { oz = x; return x; }); return ozYuk; }

   
  var palet = null, sonOdak = null, tum = [], secimNo = 0, gorunen = [];
  var EYLEMLER = [
    { tur: 'Eylem', ad: 'Temayı değiştir (açık / koyu)', alt: 'Görünüm', fn: function () { tema.click(); } },
    { tur: 'Eylem', ad: 'Bildirimleri aç', alt: 'Uyarılar', fn: function () { setTimeout(function () { zil.click(); }, 50); } },
    { tur: 'Eylem', ad: 'Tanıtımı yeniden göster', alt: 'Kısa tur', fn: function () { MM.tanitimAc && MM.tanitimAc(); } },
    { tur: 'Eylem', ad: 'Verileri yenile', alt: 'Kaynakları yeniden oku', fn: function () { veriAl(true).then(function () { MM.bildirimYenile && MM.bildirimYenile(); }); } }
  ];
  function normal(s) { return (s || '').toLocaleLowerCase('tr'); }
  function filtrele(q) {
    q = normal(q).trim();
    if (!q) { var oneri = tum.filter(function (x) { return x.tur === 'Modül'; }).concat(EYLEMLER); return oneri; }
    var tok = q.split(/\s+/), sonuc = [];
    tum.concat(EYLEMLER).forEach(function (x) {
      var k = x.k || normal(x.ad + ' ' + x.alt); for (var i = 0; i < tok.length; i++) if (k.indexOf(tok[i]) < 0) return;
      var ad = normal(x.ad), s = ad === tok.join(' ') ? 0 : (ad.indexOf(tok[0]) === 0 ? 1 : (ad.indexOf(tok[0]) >= 0 ? 2 : 3));
      sonuc.push({ x: x, s: s });
    });
    sonuc.sort(function (a, b) { return a.s - b.s; });
    var say = {}, cikti = [];
    sonuc.forEach(function (r) { say[r.x.tur] = (say[r.x.tur] || 0) + 1; if (say[r.x.tur] <= 8) cikti.push(r.x); });
    return cikti;
  }
  function paletCiz() {
    var liste = palet.querySelector('.palet-liste'), q = palet.querySelector('input').value;
    liste.textContent = '';
    if (!oz) { liste.appendChild(gr.iskelet('satir', 4)); return; }
    gorunen = filtrele(q); if (secimNo >= gorunen.length) secimNo = 0;
    if (!gorunen.length) { liste.appendChild(h('div', { sinif: 'palet-bos' }, [h('b', { metin: '“' + q + '” için sonuç yok' }), h('span', { metin: 'Konteyner no, sipariş no, hat/tezgâh no, belge adı veya modül adı deneyin.' })])); return; }
    var son = '';
    gorunen.forEach(function (x, i) {
      if (x.tur !== son) { son = x.tur; liste.appendChild(h('div', { sinif: 'palet-grup', role: 'presentation', metin: x.tur === 'Modül' && !q ? 'Modüller' : (x.tur === 'Eylem' ? 'Eylemler' : x.tur) })); }
      var o = h('div', { sinif: 'palet-oge' + (i === secimNo ? ' secili' : ''), role: 'option', id: 'palet-' + i, 'aria-selected': i === secimNo ? 'true' : 'false', onclick: function () { paletSec(i); }, onpointermove: function () { if (secimNo !== i) { secimNo = i; vurgu(); } } }, [
        h('span', { sinif: 'palet-ik' }, [gr.ikon({ Modül: 'ana', Konteyner: 'gemi', Sipariş: 'siparis', Makine: 'makineler', Belge: 'belge', Eylem: 'sag' }[x.tur] || 'sag', 18)]),
        h('span', { sinif: 'palet-ad' }, [h('b', { metin: x.ad }), h('small', { metin: x.alt })]), h('span', { sinif: 'palet-tur', metin: x.tur })]);
      liste.appendChild(o);
    });
    if (oz && Object.keys(oz.hata).length) liste.appendChild(h('p', { sinif: 'palet-not', metin: 'Şu an alınamayan veri: ' + Object.keys(oz.hata).join(', ') }));
  }
  function vurgu() {
    palet.querySelectorAll('.palet-oge').forEach(function (e, i) { e.classList.toggle('secili', i === secimNo); e.setAttribute('aria-selected', i === secimNo ? 'true' : 'false'); });
    var s = palet.querySelector('.palet-oge.secili'); if (s) { palet.querySelector('input').setAttribute('aria-activedescendant', s.id); s.scrollIntoView({ block: 'nearest' }); }
  }
  function paletSec(i) { var x = gorunen[i]; if (!x) return; paletKapat(); if (x.fn) x.fn(); else if (x.href) location.hash === x.href ? window.dispatchEvent(new Event('hashchange')) : MM.git(x.href); }
  function paletAc() {
    if (nakliyeciMi()) return;
    if (palet) return; sonOdak = document.activeElement; secimNo = 0;
    var inp = h('input', { type: 'search', placeholder: 'Konteyner, sipariş, makine, belge ara…', 'aria-label': 'Ara', role: 'combobox', 'aria-expanded': 'true', 'aria-controls': 'palet-liste', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', enterkeyhint: 'go' });
    palet = h('div', { sinif: 'palet-kap', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Ara ve git' }, [
      h('div', { sinif: 'palet-perde', onclick: paletKapat }),
      h('div', { sinif: 'palet' }, [
        h('div', { sinif: 'palet-ust' }, [gr.ikon('arama', 20), inp, h('button', { type: 'button', sinif: 'palet-kapat', 'aria-label': 'Kapat', onclick: paletKapat }, [gr.ikon('kapat', 18)])]),
        h('div', { sinif: 'palet-liste', id: 'palet-liste', role: 'listbox', 'aria-label': 'Sonuçlar' }),
        h('div', { sinif: 'palet-alt' }, [h('span', null, [h('kbd', { metin: '↑↓' }), ' seç']), h('span', null, [h('kbd', { metin: 'Enter' }), ' aç']), h('span', null, [h('kbd', { metin: 'Esc' }), ' kapat'])])])]);
    document.body.appendChild(palet); document.body.classList.add('palet-acik');
    inp.addEventListener('input', function () { secimNo = 0; paletCiz(); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); secimNo = Math.min(gorunen.length - 1, secimNo + 1); vurgu(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); secimNo = Math.max(0, secimNo - 1); vurgu(); }
      else if (e.key === 'Enter') { e.preventDefault(); paletSec(secimNo); }
      else if (e.key === 'Tab') { e.preventDefault(); inp.focus(); }
    });
    palet.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); paletKapat(); } });
    paletCiz(); inp.focus();
    (oz ? Promise.resolve(oz) : veriAl()).then(function (x) { tum = MM.ozet.dizin(x); if (palet) paletCiz(); }).catch(function () { if (palet) paletCiz(); });
    if (oz && !tum.length) tum = MM.ozet.dizin(oz);
  }
  function paletKapat() { if (!palet) return; palet.remove(); palet = null; document.body.classList.remove('palet-acik'); if (sonOdak && sonOdak.focus) sonOdak.focus(); }
  araAc.addEventListener('click', function () { if (palet) return; if (MM.sayfaAramaOdak && MM.sayfaAramaOdak()) return; paletAc(); });   
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); palet ? paletKapat() : paletAc(); }
    else if (e.key === '/' && !palet && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); paletAc(); }
  });
  MM.araAc = paletAc;

   
  var panel = null, bildirim = [], okunanlar = {};
  try { okunanlar = JSON.parse(localStorage.getItem('mm-okunan') || '{}'); } catch (e) { okunanlar = {}; }
  function anahtar(b) { return b.id + '|' + b.baslik; }
  function okunduYaz() { try { localStorage.setItem('mm-okunan', JSON.stringify(okunanlar)); } catch (e) { } }
  function sayiGuncelle() {
    var n = bildirim.filter(function (b) { return b.sev === 'kritik' && !okunanlar[anahtar(b)]; }).length, e = zil.querySelector('.zil-sayi');    
    e.hidden = !n; e.textContent = n > 99 ? '99+' : String(n); zil.setAttribute('aria-label', 'Bildirimler' + (n ? ' — ' + n + ' kritik okunmamış' : ''));
  }
  var SEV = { kritik: ['Kritik', 'uyari'], uyari: ['Uyarı', 'uyari'], bilgi: ['Bilgi', 'bilgi'] };
  function panelCiz() {
    var g = panel.querySelector('.zil-liste'); g.textContent = '';
    if (!oz) { g.appendChild(gr.iskelet('satir', 3)); return; }
    if (!bildirim.length) {
      var hk = Object.keys(oz.hata);
      g.appendChild(gr.bos({ baslik: hk.length ? 'Bazı kaynaklar okunamadı' : 'Şu an bildirim yok', metin: hk.length ? 'Bazı bölümlerin verisi şu an alınamıyor' : 'Makine alarmı, süresi dolan konteyner, geciken sipariş ve yaklaşan belge tarihleri burada görünür.', tur: hk.length ? 'bekle' : 'veri' }));
      return;
    }
    var sonSev = '';
    bildirim.forEach(function (b) {
      var k = anahtar(b), s = SEV[b.sev];
      if (sonSev !== b.sev) { sonSev = b.sev; g.appendChild(h('div', { sinif: 'palet-grup', role: 'presentation', metin: b.sev === 'kritik' ? 'Kritik' : (b.sev === 'uyari' ? 'Diğer uyarılar' : 'Bilgi') })); }
      g.appendChild(h('a', { href: b.href, sinif: 'zil-oge sev-' + b.sev + (okunanlar[k] ? ' okundu' : ''), onclick: function () { okunanlar[k] = 1; okunduYaz(); sayiGuncelle(); panelKapat(); } }, [
        h('span', { sinif: 'zil-sev' }, [gr.ikon(b.sev === 'bilgi' ? 'bilgi' : 'uyari', 18)]),
        h('span', { sinif: 'zil-metin' }, [h('b', { metin: b.baslik }), h('small', { metin: b.metin }), h('em', { metin: s[0] + ' · ' + b.kaynak })])]));
    });
    if (Object.keys(oz.hata).length) g.appendChild(h('p', { sinif: 'palet-not', metin: 'Şu an alınamayan veri: ' + Object.keys(oz.hata).join(', ') }));
  }
  function panelAc() {
    if (nakliyeciMi()) return;
    if (panel) return panelKapat();
    panel = h('div', { sinif: 'zil-kap', role: 'dialog', 'aria-label': 'Bildirimler' }, [h('div', { sinif: 'palet-perde zil-perde', onclick: panelKapat }), h('div', { sinif: 'zil-panel' }, [
      h('div', { sinif: 'zil-ust' }, [h('h3', { metin: 'Bildirimler' }), h('button', { type: 'button', sinif: 'mini-dugme', onclick: function () { bildirim.forEach(function (b) { okunanlar[anahtar(b)] = 1; }); okunduYaz(); sayiGuncelle(); panelCiz(); } }, [gr.ikon('tik', 16), ' Okundu işaretle']), h('button', { type: 'button', sinif: 'ikon-dugme', 'aria-label': 'Kapat', onclick: panelKapat }, [gr.ikon('kapat', 18)])]),
      h('div', { sinif: 'zil-liste' }), h('p', { sinif: 'zil-dip' }, ['Uyarılar verilerden türetilir; kaynak güncelliği her modülde yazılıdır. ', h('button', { type: 'button', sinif: 'zil-tur', metin: 'Tanıtımı yeniden göster', onclick: function () { panelKapat(); setTimeout(function () { MM.tanitimAc && MM.tanitimAc(); }, 0); } })])])]);
    document.body.appendChild(panel); zil.setAttribute('aria-expanded', 'true'); panelCiz();
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') panelKapat(); });
    var ilk = panel.querySelector('.zil-oge, .ikon-dugme'); if (ilk) ilk.focus();
  }
  function panelKapat() { if (!panel) return; panel.remove(); panel = null; zil.setAttribute('aria-expanded', 'false'); zil.focus(); }
  zil.addEventListener('click', panelAc);
  var SIRA = { kritik: 0, uyari: 1, bilgi: 2 };
  MM.bildirimYenile = function () { bildirim = oz ? MM.ozet.bildirimler(oz).map(function (b, i) { b.__i = i; return b; }).sort(function (a, b) { return (SIRA[a.sev] - SIRA[b.sev]) || (a.__i - b.__i); }) : []; tum = oz ? MM.ozet.dizin(oz) : tum; sayiGuncelle(); if (panel) panelCiz(); if (palet) paletCiz(); };
  MM.bildirimTazele = function () { return veriAl(true).then(function () { MM.bildirimYenile(); }).catch(function () { }); };   
  function yukleVeBildir() { veriAl().then(function () { MM.bildirimYenile(); }).catch(function () { }); }
  window.addEventListener('DOMContentLoaded', yukleVeBildir); if (document.readyState !== 'loading') yukleVeBildir();
  setInterval(function () { if (!document.hidden) veriAl(true).then(function () { MM.bildirimYenile(); }); }, 300000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) yukleVeBildir(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel && !palet) panelKapat(); });

   
  var q = new URLSearchParams(location.search);
  if (q.get('palet')) setTimeout(function () { paletAc(); var i = document.querySelector('.palet input'); if (i) { i.value = q.get('palet') === '1' ? 'HAMU' : q.get('palet'); i.dispatchEvent(new Event('input')); } }, 400);
  if (q.get('zil')) setTimeout(function () { veriAl().then(function () { MM.bildirimYenile(); panelAc(); }); }, 400);
})();
