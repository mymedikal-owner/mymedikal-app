


(function () {
  'use strict';
  var MM = window.MM, gr = MM.gr, h = gr.h;
  var SURUM = 1;
  var ROL_AD = (window.MM_AYAR && window.MM_AYAR.rolAdlari) || { yonetim: 'Yönetim', fabrika: 'Fabrika', satis: 'Satış', finans: 'Finans', muhasebe: 'Muhasebe', calisan: 'Çalışan', kalite: 'Kalite', 'eldiven-finans': 'Eldiven finans' };
  var kapAcik = null, bellekGoruldu = false;

  function rol() { return MM.rol(); }
  function anahtar() { return 'mm-tanitim-' + rol(); }
   
  function oku() {
    var ad = anahtar(), kaynaklar = ['localStorage', 'sessionStorage'];
    for (var i = 0; i < kaynaklar.length; i++) {
      try { var v = window[kaynaklar[i]].getItem(ad); if (v) { var o = JSON.parse(v); if (o && typeof o === 'object') return o; } } catch (e) { }
    }
    return bellekGoruldu ? { s: SURUM, m: moduller().map(function (x) { return x.id; }) } : null;
  }
  function yaz() {
    var kayit = JSON.stringify({ s: SURUM, m: moduller().map(function (x) { return x.id; }) }), ad = anahtar(), yazildi = false;
    ['localStorage', 'sessionStorage'].forEach(function (k) { if (yazildi) return; try { window[k].setItem(ad, kayit); yazildi = true; } catch (e) { } });
    bellekGoruldu = true;
  }
  function moduller() { return (MM.modulListe || []).filter(function (m) { return !m.onizleme; }); }
  function yakinda() { return (MM.modulListe || []).filter(function (m) { return m.onizleme; }); }

   
  function modulCip(m) { return h('li', { sinif: 'tn-cip' }, [h('span', { sinif: 'tn-cip-ik', 'aria-hidden': 'true' }, [gr.ikon(m.id, 20)]), h('span', { metin: m.ad })]); }
  function satir(ikonAd, baslik, metin) {
    return h('li', { sinif: 'tn-satir' }, [h('span', { sinif: 'tn-satir-ik', 'aria-hidden': 'true' }, [gr.ikon(ikonAd, 20)]), h('div', null, [h('b', { metin: baslik }), h('span', { metin: metin })])]);
  }
  function adim1() {
    var r = rol(), liste = moduller(), y = yakinda();
    return { baslik: 'Hoş geldiniz', govde: [
      h('p', { sinif: 'tn-metin' }, ['Bu uygulama MY Medikal verisini tek yerde gösterir. Rolünüz: ', h('b', { metin: ROL_AD[r] || r }), '. Menünüzde şunlar var:']),
      h('ul', { sinif: 'tn-cipler', 'aria-label': 'Menünüzdeki modüller' }, liste.map(modulCip)),
      y.length ? h('p', { sinif: 'tn-not', metin: 'Yakında: ' + y.map(function (m) { return m.ad; }).join(', ') + ' (önizleme).' }) : null
    ] };
  }
  function adim2() {
    return { baslik: 'Ana sayfa, zil, arama', govde: [
      h('ul', { sinif: 'tn-satirlar' }, [
        satir('ana', 'Bugün dikkat', 'Ana sayfada en önemli en çok 3 madde çıkar. Dokununca ilgili ayrıntıya gidersiniz; “Tümü” bildirim panelini açar.'),
        satir('zil', 'Zil', 'Üstteki zildeki kırmızı sayı yalnız okunmamış kritik uyarıları sayar; diğer uyarılar panelde listelenir.'),
        satir('arama', 'Arama', 'Üstteki Ara düğmesi (ya da “/” veya Ctrl/⌘ K) ile konteyner, sipariş, makine veya belgeyi yazıp doğrudan açarsınız.')
      ])
    ] };
  }
  function adim3() {
    return { baslik: 'Veri güncelliği', govde: [
      h('ul', { sinif: 'tn-satirlar' }, [
        h('li', { sinif: 'tn-satir' }, [h('span', { sinif: 'tn-satir-ik', 'aria-hidden': 'true' }, [h('span', { sinif: 'nokta yesil' }), ' ', h('span', { sinif: 'nokta sari' })]), h('div', null, [h('b', { metin: 'Yeşil / sarı nokta' }), h('span', { metin: 'Yeşil: veri güncel. Sarı: veri eski; ⓘ içinde nedenini yazar. Yanındaki “x dk önce” son güncellemeyi gösterir.' })])]),
        satir('bilgi', 'ⓘ düğmesi', 'Kartın kıyas, kaynak ve açıklama gibi teknik notları ⓘ içindedir; ihtiyaç olunca açın.'),
      ]),
      h('p', { sinif: 'tn-guvence' }, [gr.ikon('kilit', 18), h('span', null, [h('b', { metin: 'Uygulama salt okunurdur. ' }), 'SAP’ye veya başka bir sisteme yazmaz; yalnız gösterir.'])])
    ] };
  }
  function adimYeni(yeni) {
    return { baslik: 'Yenilikler', govde: [
      h('p', { sinif: 'tn-metin', metin: 'Menünüze yeni modül eklendi:' }),
      h('ul', { sinif: 'tn-cipler', 'aria-label': 'Yeni modüller' }, yeni.map(modulCip))
    ] };
  }

   
  function kapat(kaydet) {
    if (!kapAcik) return;
    var k = kapAcik; kapAcik = null;
    document.removeEventListener('keydown', k.tus, true);
    var kabuk = document.querySelector('.kabuk'); if (kabuk) kabuk.inert = false;
    document.body.classList.remove('tanitim-acik');
    k.el.remove();
    if (kaydet) yaz();
    if (k.sonOdak && k.sonOdak.focus) { try { k.sonOdak.focus(); } catch (e) { } }
  }
  function ac(secenek) {
    if (kapAcik) return;
    secenek = secenek || {};
    var adimlar = secenek.yeni && secenek.yeni.length ? [adimYeni(secenek.yeni)] : [adim1(), adim2(), adim3()];
    var no = 0, kaydet = secenek.kaydet !== false;
    var baslikEl = h('h2', { sinif: 'tn-baslik', id: 'tn-baslik', tabindex: '-1' });
    var govdeEl = h('div', { sinif: 'tn-govde', id: 'tn-govde' });
    var sayac = h('p', { sinif: 'tn-sayac', 'aria-live': 'polite' });
    var noktalar = h('div', { sinif: 'tn-noktalar', 'aria-hidden': 'true' }, adimlar.map(function () { return h('span', { sinif: 'tn-n' }); }));
    var atla = h('button', { type: 'button', sinif: 'tn-dugme tn-atla', metin: 'Atla', onclick: function () { kapat(kaydet); } });
    var geri = h('button', { type: 'button', sinif: 'tn-dugme tn-geri', metin: 'Geri', onclick: function () { git(no - 1); } });
    var ileri = h('button', { type: 'button', sinif: 'tn-dugme tn-ileri', onclick: function () { if (no >= adimlar.length - 1) kapat(kaydet); else git(no + 1); } });
    var kart = h('div', { sinif: 'tn-kart', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'tn-baslik', 'aria-describedby': 'tn-govde' }, [
      h('div', { sinif: 'tn-ust' }, [sayac, noktalar]), baslikEl, govdeEl,
      h('div', { sinif: 'tn-alt' }, [atla, h('span', { sinif: 'tn-bosluk' }), geri, ileri])
    ]);
    var el = h('div', { sinif: 'tn-kap', id: 'tanitim' }, [h('div', { sinif: 'tn-perde' }), kart]);

    function git(i) {
      no = Math.max(0, Math.min(adimlar.length - 1, i));
      var a = adimlar[no];
      baslikEl.textContent = a.baslik; govdeEl.textContent = '';
      a.govde.forEach(function (c) { if (c) govdeEl.appendChild(c); });
      sayac.textContent = adimlar.length > 1 ? 'Adım ' + (no + 1) + ' / ' + adimlar.length : 'Yenilik';
      Array.prototype.forEach.call(noktalar.children, function (n, j) { n.classList.toggle('on', j === no); });
      geri.hidden = no === 0; ileri.textContent = no >= adimlar.length - 1 ? 'Bitti' : 'İleri';
      atla.hidden = no >= adimlar.length - 1 && adimlar.length > 1;    
      kart.scrollTop = 0; govdeEl.scrollTop = 0;
      if (kapAcik) baslikEl.focus({ preventScroll: true });
    }
    function tus(e) {
      if (!kapAcik) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); kapat(kaydet); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); if (no < adimlar.length - 1) git(no + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); if (no > 0) git(no - 1); }
      else if (e.key === 'Tab') {    
        var o = Array.prototype.filter.call(kart.querySelectorAll('button'), function (b) { return !b.hidden; });
        if (!o.length) return;
        var ilk = o[0], son = o[o.length - 1], ae = document.activeElement;
        if (!kart.contains(ae) || ae === baslikEl) { e.preventDefault(); (e.shiftKey ? son : ilk).focus(); }
        else if (e.shiftKey && ae === ilk) { e.preventDefault(); son.focus(); }
        else if (!e.shiftKey && ae === son) { e.preventDefault(); ilk.focus(); }
      }
    }
    kapAcik = { el: el, tus: tus, sonOdak: document.activeElement };
    document.body.appendChild(el); document.body.classList.add('tanitim-acik');
    var kabuk = document.querySelector('.kabuk'); if (kabuk) kabuk.inert = true;
    document.addEventListener('keydown', tus, true);
    var ta = parseInt(new URLSearchParams(location.search).get('tadim'), 10);    
    git(ta > 0 && secenek.kaydet === false ? ta - 1 : 0); baslikEl.focus({ preventScroll: true });
  }

   
  function otomatik() {
    if (window.MMVeri && window.MMVeri.kisitli && window.MMVeri.kisitli()) return;    
    var q = new URLSearchParams(location.search).get('tanitim');
    if (q === 'yeni') { var m = moduller(); return ac({ yeni: m.slice(-2), kaydet: false }); }
    if (q) return ac({ kaydet: false });
    if (/HeadlessChrome/.test(navigator.userAgent) || /[?&]sakin/.test(location.search)) return;    
    var k = oku();
    if (!k) return ac();
    if (k.s !== SURUM) {
      var gorulen = k.m || [], yeni = moduller().filter(function (m) { return gorulen.indexOf(m.id) < 0; });
      if (yeni.length) return ac({ yeni: yeni });
      yaz();
    }
  }
  MM.tanitimAc = function () { if (kapAcik) return; ac({ kaydet: true }); };
  function basla0() { if (!MM.modulListe || !MM.modulListe.length) return; var acilis = document.getElementById('acilis'); setTimeout(otomatik, acilis ? 1200 : 200); }
  function basla() { (MM.acikHazir || Promise.resolve()).then(basla0); }   
  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', basla); else basla();
})();
