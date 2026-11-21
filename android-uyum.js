




(function () {
  'use strict';
  var MM = window.MM = window.MM || {};
  var ua = navigator.userAgent || '';
  function t(s) { return (MM.t ? MM.t(s) : s); }

   
  var olay = null, kuruldu = false, kutular = [];
  var android = /Android/i.test(ua);
  var ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var capacitor = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  function standalone() { try { return !!((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone); } catch (e) { return false; } }
  function yonergeGerek() { return android && !olay && /SamsungBrowser|Firefox|OPR\/|EdgA|UCBrowser|MiuiBrowser|Vivaldi/i.test(ua); }
  function gizli() { return ios || capacitor || kuruldu || standalone(); }

  function doldur(k) {
    k.textContent = '';
    if (gizli()) { k.hidden = true; return; }
    if (olay) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mm-yukle-dugme'; b.textContent = t('Uygulamayı yükle');
      b.addEventListener('click', yukle);
      k.appendChild(b); k.hidden = false;
    } else if (yonergeGerek()) {
      var p = document.createElement('p');
      p.className = 'mm-yukle-not'; p.textContent = t('Uygulamayı yüklemek için: Menü → Ana ekrana ekle');
      k.appendChild(p); k.hidden = false;
    } else k.hidden = true;
  }
  function guncelle() { kutular = kutular.filter(function (k) { return document.body.contains(k); }); kutular.forEach(doldur); }
  function yukle() {
    var o = olay; if (!o) return;
    olay = null; guncelle();   
    try { o.prompt(); if (o.userChoice && o.userChoice.then) o.userChoice.then(function (s) { if (s && s.outcome === 'accepted') { kuruldu = true; guncelle(); } }, function () { }); } catch (e) { }
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); olay = e; guncelle(); });
  window.addEventListener('appinstalled', function () { kuruldu = true; olay = null; guncelle(); });
  try { var mq = window.matchMedia('(display-mode: standalone)'); if (mq.addEventListener) mq.addEventListener('change', guncelle); } catch (e) { }

  MM.yukle = {
    dugme: function () {   
      var k = document.createElement('div'); k.className = 'mm-yukle'; kutular.push(k); doldur(k); return k;
    }
  };

   
  function sheet() { var s = document.getElementById('diger-sheet'); return s && !s.hidden && s.parentNode ? s : null; }
  function esc(el) { return function () { el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }; }
  function katmanlar() {   
    var l = [], e;
    if ((e = document.querySelector('.bk-katman'))) l.push({ kapat: esc(e) });
    if ((e = document.querySelector('.dm-gorsel-katman'))) l.push({ kapat: esc(e) });
    if ((e = document.getElementById('tanitim'))) l.push({ kapat: esc(e) });
    if ((e = document.querySelector('.palet-kap'))) l.push({ kapat: esc(e) });
    if (document.querySelector('.zil-kap')) l.push({ kapat: esc(document) });
    if ((e = sheet())) l.push({ kapat: (function (s) { return function () { var d = document.querySelector('.menu-diger'); if (d) d.click(); else s.hidden = true; }; })(e) });
    return l;
  }
  var isaret = false, plan = null;
  function denetle() {
    var n = katmanlar().length;
    if (n > 0 && !isaret) { try { history.pushState({ mmk: 1 }, '', location.href); isaret = true; } catch (e) { } }
    else if (n === 0 && isaret) {
      clearTimeout(plan);   
      plan = setTimeout(function () {
        if (katmanlar().length) return;
        if (isaret && history.state && history.state.mmk) { isaret = false; history.back(); } else isaret = false;
      }, 80);
    }
  }
  function izle() {
    try { new MutationObserver(denetle).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); } catch (e) { }
  }
  window.addEventListener('popstate', function (e) {
    var l = katmanlar();
    if (l.length) { isaret = false; l[0].kapat(); setTimeout(denetle, 30); return; }   
    if (e.state && e.state.mmk) { isaret = false; history.back(); }   
  });
  if (document.body) izle(); else document.addEventListener('DOMContentLoaded', izle);
})();
