



(function () {
  'use strict';

   
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

  function saatMetni(ms) { try { return new Date(ms).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }

   
  

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
    var simdi = Date.now(), sa = 3600000;
    return {
      yaklasan: [
        { id: 'y1', ad: 'Haftalık değerlendirme', baslangic: simdi + sa, katilimci: 6, g: 'taklit-y1' },
        { id: 'y2', ad: 'Tedarik zinciri toplantısı', baslangic: simdi + 3 * sa, katilimci: 4, g: 'taklit-y2' },
        { id: 'y3', ad: 'Satış ekibi', baslangic: simdi + 20 * sa, katilimci: 8, g: 'taklit-y3' }
      ],
      kisiler: [
        { id: 'c1', ad: 'Katılımcı 1', durum: 'cevrimici' }, { id: 'c2', ad: 'Katılımcı 2', durum: 'cevrimici' },
        { id: 'c3', ad: 'Katılımcı 3', durum: 'mesgul' }, { id: 'c4', ad: 'Katılımcı 4', durum: 'cevrimici' }
      ]
    };
  }

  function bosSatir(ul, metin) { var li = document.createElement('li'); li.className = 'lobi-bos'; li.textContent = metin; ul.appendChild(li); }
  function gunEtiketi(ms) {
    var d = new Date(ms), b = new Date(), yarin = new Date(b.getFullYear(), b.getMonth(), b.getDate() + 1);
    if (d.toDateString() === b.toDateString()) return 'Bugün';
    if (d.toDateString() === yarin.toDateString()) return 'Yarın';
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  }

   
  function ciz(v, katilHook) {
    var yb = document.getElementById('l-yaklasan'), kb = document.getElementById('l-kisiler');
    yb.hidden = !v.yaklasan; kb.hidden = !v.kisiler;
    var ul = document.getElementById('l-yaklasan-liste'); ul.textContent = '';
    if (v.yaklasan) {
      if (!v.yaklasan.length) bosSatir(ul, 'Yaklaşan toplantı yok. Yeni toplantı başlatabilir ya da bir bağlantıyla katılabilirsiniz.');
      v.yaklasan.forEach(function (t) {
        var li = document.createElement('li'); li.className = 'lobi-oge';
        var z = document.createElement('div'); z.className = 'lobi-zaman'; z.textContent = saatMetni(t.baslangic);
        var gn = document.createElement('span'); gn.className = 'lobi-gun'; gn.textContent = gunEtiketi(t.baslangic); z.appendChild(gn);
        var m = document.createElement('div'); m.className = 'lobi-metin';
        var a = document.createElement('strong'); a.textContent = t.ad;
        var k = document.createElement('span'); k.className = 'kucuk'; k.textContent = t.katilimci + ' katılımcı'; m.appendChild(a); m.appendChild(k);
        var b = document.createElement('button'); b.type = 'button'; b.className = 'metin-dugme'; b.textContent = 'Katıl';
        b.addEventListener('click', function () { katilHook(t.g); });
        li.appendChild(z); li.appendChild(m); li.appendChild(b); ul.appendChild(li);
      });
    }
    var ku = document.getElementById('l-kisiler-liste'); ku.textContent = '';
    if (v.kisiler) {
      if (!v.kisiler.length) bosSatir(ku, 'Şu anda çevrimiçi kimse görünmüyor.');
      v.kisiler.forEach(function (p) {
        var li = document.createElement('li'); li.className = 'lobi-oge';
        var b = document.createElement('span'); b.className = 'kisi-bas'; b.textContent = (p.ad || '?').trim().charAt(0).toUpperCase();
        var d = document.createElement('span'); d.className = 'durum-nokta ' + (p.durum === 'mesgul' ? 'mesgul' : 'cevrimici'); d.setAttribute('title', p.durum === 'mesgul' ? 'Meşgul' : 'Çevrimiçi');
        var m = document.createElement('div'); m.className = 'lobi-metin'; var a = document.createElement('strong'); a.textContent = p.ad; m.appendChild(a);
        li.appendChild(b); li.appendChild(m); li.appendChild(d); ku.appendChild(li);
      });
    }
  }

  window.MeetLobi = { cozumle: cozumle, veriAl: veriAl, ciz: ciz };
})();
