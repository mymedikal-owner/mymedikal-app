





(function () {
  'use strict';
  var MM = window.MM = window.MM || {};

  MM.aramaNorm = function (s) {
    return String(s == null ? '' : s).toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '');
  };
  var norm = MM.aramaNorm;

   
  var ALANLAR = {
    dmo: 'Hastane, ürün, SMT, dosya no, sipariş no, irsaliye / nakliye no ara…',
    nakliye: 'Nakliye no, irsaliye, firma, hastane, plaka ara…',
    finans: 'Banka, tür, tarih, tutar ara…',
    muhasebe: 'Fatura no, müşteri, belge ara…',
    makineler: 'Hat, tezgâh no, reçete, ürün ara…',
    kalite: 'Belge adı, konu ara…',
    isg: 'Belge adı, konu ara…',
    takvim: 'Belge adı, konu ara…',
    yonetim: 'Bu sayfadaki kayıtlarda ara…',
    stok: 'Ürün, depo, parti ara…',
    sikayet: 'Hastane, ürün, şikâyet türü ara…'
  };
  var KART = '.mh-satir, .mk-serit-satir, .mk-oee-satir, .eld-odeme-satir, .eld-uyari-satir';

   
  MM.aramaKutusu = function (kap, o) {
    var gr = MM.gr, h = gr.h; o = o || {};
    var inp = h('input', { type: 'search', sinif: 'eld-arama ara-girdi', placeholder: o.alanlar || 'Bu sayfada ara…', 'aria-label': 'Bu sayfada ara', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', enterkeyhint: 'search' });
    var sayi = h('span', { sinif: 'ara-sayi soluk kucuk', 'aria-live': 'polite' });
    var temizle = h('button', { type: 'button', sinif: 'ara-temizle', 'aria-label': 'Aramayı temizle', title: 'Temizle', hidden: true }, [gr.ikon('kapat', 16)]);
    var tumu = h('button', { type: 'button', sinif: 'ara-tumu', title: 'Tüm uygulamada ara (Ctrl/⌘ K)', onclick: function () { MM.araAc && MM.araAc(); } }, ['Tümünde ara']);
    var kutu = h('div', { sinif: 'ara-kutu', role: 'search' }, [h('div', { sinif: 'ara-alan' }, [inp, temizle]), sayi, tumu]);
    var q = '';
    function uygula(zorla) {
      var n = norm(inp.value).trim().replace(/\s+/g, ' ');
      if (n === q && !zorla) { guncelle(); return; }
      q = n; guncelle();
    }
    function guncelle() {
      var r = o.uygula ? o.uygula(q) : null;
      temizle.hidden = !inp.value;
      var m = r ? (q ? r[0] + ' / ' + r[1] + ' kayıt' : '') : '';
      if (sayi.textContent !== m) sayi.textContent = m;
      kutu.classList.toggle('sonuc-yok', !!(q && r && r[0] === 0));
    }
    inp.addEventListener('input', function () { uygula(); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Escape' && inp.value) { e.stopPropagation(); inp.value = ''; uygula(); } });
    temizle.addEventListener('click', function () { inp.value = ''; uygula(); inp.focus(); });
    (o.yer || function (k) { k.insertBefore(kutu, k.firstChild); })(kap, kutu);
    return {
      kutu: kutu, girdi: inp, uygula: uygula,
      odak: function () { try { kutu.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { } inp.focus(); inp.select && inp.select(); },
      sorgu: function () { return q; },
      sifirla: function () { inp.value = ''; q = ''; guncelle(); }
    };
  };

   
  var icerik = null, kutu = null, rota = '', obsBekle = false;
  function rotaAnahtar() { return (location.hash || '#ana').split('?')[0]; }
  function modulId() { return (rotaAnahtar().slice(1).split('/')[0]) || 'ana'; }

  function sayfaUygula(q) {
    var e = 0, t = 0;
    Array.prototype.forEach.call(icerik.querySelectorAll('[data-arakap]'), function (k) {
      if (!k.ara || (k.parentNode && k.parentNode.closest && k.parentNode.closest('.ara-kutu'))) return;
      var r = k.ara(q); e += r[0]; t += r[1];
    });
    Array.prototype.forEach.call(icerik.querySelectorAll(KART), function (k) {
      if (k.closest('[data-arakap]')) return;
      if (k.__an == null || k.__at !== k.textContent) { k.__at = k.textContent; k.__an = norm(k.textContent); }
      var ok = !q || k.__an.indexOf(q) >= 0; k.classList.toggle('ara-gizli', !ok); t++; if (ok) e++;
    });
    return [e, t];
  }
  function aranabilirVar() { return !!icerik.querySelector('[data-arakap], ' + KART); }
  function kendiKutu() { return icerik.querySelector('input.eld-arama:not(.ara-girdi)'); }

  function calis() {
    obsBekle = false;
    if (!icerik) return;
    var anahtar = rotaAnahtar();
    if (anahtar !== rota) { rota = anahtar; if (kutu) kutu.sifirla(); }
    var var_ = aranabilirVar() && !kendiKutu();
    if (!var_) { if (kutu && kutu.kutu.parentNode) kutu.kutu.parentNode.removeChild(kutu.kutu); return; }
    if (!kutu) kutu = MM.aramaKutusu(icerik, { alanlar: ALANLAR[modulId()] || 'Bu sayfada ara…', uygula: sayfaUygula });
    else if (!kutu.kutu.parentNode || kutu.kutu.parentNode !== icerik) icerik.insertBefore(kutu.kutu, icerik.firstChild);
    else if (icerik.firstChild !== kutu.kutu) icerik.insertBefore(kutu.kutu, icerik.firstChild);
    kutu.girdi.setAttribute('placeholder', ALANLAR[modulId()] || 'Bu sayfada ara…');
    kutu.uygula(true);
  }
  function planla(muts) {
    if (muts) { var disarida = muts.some(function (m) { return !(kutu && kutu.kutu.contains(m.target)); }); if (!disarida) return; }
    if (obsBekle) return; obsBekle = true; (window.requestAnimationFrame || setTimeout)(calis);
  }

  MM.sayfaAramaOdak = function () {
    if (!icerik) return false;
    var g = kendiKutu(); if (g && !g.hidden && g.offsetParent !== null) { try { g.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { } g.focus(); return true; }
    if (kutu && kutu.kutu.parentNode) { kutu.odak(); return true; }
    return false;
  };

  function baslat() {
    icerik = document.getElementById('icerik'); if (!icerik || !MM.gr) return;
    new MutationObserver(planla).observe(icerik, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () { planla(); });
    var qa = new URLSearchParams(location.search).get('ara');   
    setTimeout(function () { calis(); if (qa && kutu) { kutu.girdi.value = qa; kutu.uygula(true); } }, qa ? 600 : 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat); else baslat();
})();
