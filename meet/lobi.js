


(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
   
  var TAKLIT_ADLAR = ['Ayşe K.', 'Mehmet T.', 'Zeynep A.', 'Can B.'];

   
  function cozumle(metin) {
    var t = String(metin == null ? '' : metin).trim();
    if (!t || t.length > 400) return null;
    var i = t.indexOf('#'), h = i >= 0 ? t.slice(i + 1) : t, s = '', g = '';
    h.split('&').forEach(function (p) {
      var k = p.indexOf('='); if (k < 0) return;
      var a = p.slice(0, k), v = p.slice(k + 1);
      try { v = decodeURIComponent(v); } catch (e) { v = ''; }
      if (a === 's') s = v; else if (a === 'g') g = v;
    });
    s = s.slice(0, 128); g = g.slice(0, 64);
    return s && g ? { s: s, g: g } : null;
  }

  var LOC = (window.MeetDil && window.MeetDil.dil === 'en') ? 'en-GB' : 'tr-TR';    
  function saatMetni(ms) { try { return new Date(ms).toLocaleTimeString(LOC, { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }

   
  var saatZ = null;
  function saatYenile() {
    var s = document.getElementById('l-saat-s'), t = document.getElementById('l-saat-t');
    if (!s || !t) return;
    var d = new Date();
    try { s.textContent = d.toLocaleDateString(LOC, { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^(\d+ \S+) (\S+)$/, '$2, $1').replace(/^([A-Za-z]+) (\d+ [A-Za-z]+)$/, '$1, $2'); } catch (e) { s.textContent = ''; }
    try { t.textContent = d.toLocaleTimeString(LOC, { hour: '2-digit', minute: '2-digit' }); } catch (e2) { t.textContent = ''; }
    var u = document.getElementById('l-saat'); if (u) u.setAttribute('datetime', d.toISOString());
  }
  function saatBaslat() { saatYenile(); if (!saatZ) saatZ = setInterval(saatYenile, 15000); }

  

  async function gercekVeri() {
    var api = window.MeetApi;
    var r = await Promise.all([
      api.yaklasanToplantilar().then(function (l) { return { l: l, kapali: false }; }, function (e) { return { l: null, kapali: !!(e && e.kod === 'kapali') }; }),
      api.cevrimiciKisiler().then(function (c) { return c && c.acik ? c.kisiler : null; }, function () { return null; })
    ]);
    return { yaklasan: r[0].l, kisiler: r[1], toplantiKapali: r[0].kapali };
  }

   
  function veriAl(taklit, bos) {
    if (!taklit) return gercekVeri().catch(function () { return { yaklasan: null, kisiler: null, toplantiKapali: false }; });
    if (bos) return { yaklasan: [], kisiler: [] };
    var simdi = Date.now(), sa = 3600000, dk = 60000;
    return {
      yaklasan: [
        { id: 'y1', ad: 'Satış toplantısı', baslangic: simdi + 4 * dk, katilimci: 6, g: 'taklit-y1' },
        { id: 'y2', ad: 'Haftalık planlama', baslangic: simdi + 3 * sa, katilimci: 3, g: 'taklit-y2' },
        { id: 'y3', ad: 'Ekip değerlendirmesi', baslangic: simdi + 20 * sa, katilimci: 2, g: 'taklit-y3' }
      ],
      kisiler: TAKLIT_ADLAR.map(function (a, i) { return { id: 'c' + (i + 1), ad: a, durum: i === 2 ? 'mesgul' : 'cevrimici' }; })
    };
  }

   
  function svgYap(sinif, yollar) {
    var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', sinif);
    yollar.forEach(function (d) { var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); s.appendChild(p); });
    return s;
  }
  function el(etiket, sinif, metin) { var e = document.createElement(etiket); if (sinif) e.className = sinif; if (metin != null) e.textContent = metin; return e; }
  function renkNo(ad) { var t = 0; String(ad || '').split('').forEach(function (c) { t += c.charCodeAt(0); }); return t % 6; }
  function bas(ad) {
    var k = String(ad || '').trim().split(/\s+/).filter(Boolean);
    if (!k.length) return '?';
    var b = k[0].charAt(0) + (k.length > 1 ? k[1].charAt(0) : '');
    try { return b.toLocaleUpperCase('tr'); } catch (e) { return b.toUpperCase(); }
  }
  function gunEtiketi(ms) {
    var d = new Date(ms), b = new Date(), yarin = new Date(b.getFullYear(), b.getMonth(), b.getDate() + 1);
    if (d.toDateString() === b.toDateString()) return 'Bugün';
    if (d.toDateString() === yarin.toDateString()) return 'Yarın';
    return d.toLocaleDateString(LOC, { day: 'numeric', month: 'short' });
  }
   
  function zamanDurumu(ms) {
    var f = ms - Date.now();
    if (f <= 10 * 60000 && f >= -2 * 3600000) return { simdi: true, etiket: 'Şimdi' };
    if (f > 0 && f < 60 * 60000) return { simdi: false, etiket: Math.max(1, Math.round(f / 60000)) + ' dk sonra' };
    return { simdi: false, etiket: '' };
  }

  function bosDurum(ul) {
    var li = el('li', 'bos-durum');
    li.appendChild(svgYap('bos-cizim', ['M5 5h14a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 19 20H5a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 5 5z', 'M3.5 10h17M8 3v4M16 3v4', 'M9.2 15.2l2 2 3.8-4']));
    li.appendChild(el('p', 'bos-baslik', 'Bugün planlanmış toplantı yok'));
    var b = el('button', 'bos-planla', 'Planla'); b.type = 'button';
    b.addEventListener('click', function () { var p = document.getElementById('l-planla'); if (p) p.click(); });
    li.appendChild(b); ul.appendChild(li);
  }

  function toplantiKarti(t, katilHook) {
    var z = zamanDurumu(t.baslangic);
    var li = el('li', 'toplanti-kart' + (z.simdi ? ' simdi' : ''));
    var sol = el('div', 'tk-zaman');
    sol.appendChild(el('span', 'tk-saat', saatMetni(t.baslangic)));
    sol.appendChild(el('span', 'tk-gun', gunEtiketi(t.baslangic)));
    var orta = el('div', 'tk-orta');
    var ust = el('div', 'tk-ust');
    ust.appendChild(el('strong', 'tk-ad', t.ad));
    if (z.etiket) ust.appendChild(el('span', 'tk-rozet' + (z.simdi ? ' canli' : ''), z.etiket));
    orta.appendChild(ust);
    var alt = el('div', 'tk-alt');
    var n = Math.max(0, t.katilimci | 0);
    if (n > 0) {
      var yigin = el('span', 'yigin'); yigin.setAttribute('role', 'img'); yigin.setAttribute('aria-label', n + ' katılımcı');
      for (var i = 0; i < Math.min(n, 3); i++) { var a = el('span', 'mini a' + ((i + (t.ad || '').length) % 6)); a.appendChild(svgYap('mini-ikon', ['M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z', 'M5.5 19a6.5 6.5 0 0 1 13 0'])); yigin.appendChild(a); }
      if (n > 3) yigin.appendChild(el('span', 'mini fazla', '+' + (n - 3)));
      alt.appendChild(yigin); alt.appendChild(el('span', 'kucuk', n + ' katılımcı'));
    }
    orta.appendChild(alt);
    var b = el('button', 'tk-katil', 'Katıl'); b.type = 'button'; b.setAttribute('aria-label', t.ad + ' toplantısına katıl');
    b.addEventListener('click', function () { katilHook(t.g); });
    li.appendChild(sol); li.appendChild(orta); li.appendChild(b);
    return li;
  }

   
  function ciz(v, katilHook, kisiHook) {
    var yb = document.getElementById('l-yaklasan'), kb = document.getElementById('l-kisiler');
    var kisiler = v.kisiler && v.kisiler.length ? v.kisiler : null;   
    yb.hidden = !v.yaklasan; kb.hidden = !kisiler || typeof kisiHook !== 'function';
    var ul = document.getElementById('l-yaklasan-liste'); ul.textContent = '';
    if (v.yaklasan) {
      if (!v.yaklasan.length) bosDurum(ul);
      v.yaklasan.forEach(function (t) { ul.appendChild(toplantiKarti(t, katilHook)); });
    }
    var ku = document.getElementById('l-kisiler-liste'); ku.textContent = '';
    if (kisiler && typeof kisiHook === 'function') {
      kisiler.forEach(function (p) {
        var li = el('li', 'sk-oge');
        var b = el('button', 'sk-dugme'); b.type = 'button';
        b.setAttribute('aria-label', (p.ad || 'Kişi') + (p.durum === 'mesgul' ? ' (meşgul)' : '') + ' ile hemen görüşme başlat');
        var av = el('span', 'avatar a' + renkNo(p.ad), bas(p.ad));
        av.appendChild(el('span', 'durum-nokta ' + (p.durum === 'mesgul' ? 'mesgul' : 'cevrimici')));
        b.appendChild(av); b.appendChild(el('span', 'sk-ad', p.ad || 'Kişi'));
        b.addEventListener('click', function () { kisiHook(p); });
        li.appendChild(b); ku.appendChild(li);
      });
    }
  }

  saatBaslat();
  window.MeetLobi = { cozumle: cozumle, veriAl: veriAl, ciz: ciz, taklitKisiAdlari: TAKLIT_ADLAR, saatYenile: saatYenile };
})();
