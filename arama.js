





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
     
    var tumu = h('button', { type: 'button', sinif: 'ara-tumu', title: 'Bu bölümün bütün sekmelerinde ara (Ctrl/⌘ Shift K: tüm uygulama)', onclick: function () { if (MM.herYerdeAra && MM.herYerdeAra.ac) MM.herYerdeAra.ac(inp.value, modulId()); else MM.araAc && MM.araAc(); } }, ['Tümünde ara']);
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

  




  var HYA_KLASORLER = ['dmo', 'eldiven', 'fabrika', 'ihale', 'kalite', 'nakliye', 'saha', 'sikayet', 'siparisler', 'siparisler-yonetim', 'sterilizasyon', 'stok'];
  var HYA_TUR = [['hastane', 'Hastane / müşteri'], ['siparis', 'Sipariş'], ['teslimat', 'Teslimat / irsaliye'], ['konteyner', 'Konteyner'], ['urun', 'Ürün'], ['tedarikci', 'Tedarikçi'], ['belge', 'Belge'], ['ihale', 'İhale'], ['makine', 'Makine']];
  var HYA_ROTA = /^(\?[A-Za-z0-9_=&%.-]+)?#[a-z][a-z0-9-]*(\/[A-Za-z0-9_%.~-]+)*$/;
  var hyaDurum = { kap: null, girdi: null, govde: null, alt: null, sonOdak: null, dizin: null, yukleniyor: false, kaynakSayi: 0, bugun: [] };

  function hyaErisilebilir() {
    var V = window.MMVeri;
    return HYA_KLASORLER.filter(function (k) {
      if (!V) return false;
      try { return typeof V.ozelErisim === 'function' ? V.ozelErisim(k) : true; } catch (e) { return false; }
    });
  }
  function hyaYukle() {
    if (hyaDurum.dizin) return Promise.resolve(hyaDurum.dizin);
    if (hyaDurum.yukleniyor) return hyaDurum.yukleniyor;
    var V = window.MMVeri, klasorler = hyaErisilebilir();
    var oku = klasorler.map(function (k) {
      return V.oku(k, 'arama-dizin').then(function (r) { return { k: k, v: r && r.veri }; }, function () { return null; });   
    });
    hyaDurum.yukleniyor = Promise.all(oku).then(function (liste) {
      var kayit = [], gor = {}, bugun = [], kaynak = 0;
      liste.forEach(function (x) {
        if (!x || !x.v || !Array.isArray(x.v.kayitlar)) return;
        kaynak++;
        x.v.kayitlar.forEach(function (k) {
          if (!k || typeof k.a !== 'string' || !HYA_ROTA.test(String(k.r || ''))) return;
          var z = k.t + '|' + k.a + '|' + k.r; if (gor[z]) return; gor[z] = 1;
          kayit.push({ t: String(k.t || ''), a: k.a, b: String(k.b || ''), r: k.r, d: String(k.d || ''), n: norm(k.a + ' ' + (k.b || '')), na: norm(k.a) });
        });
        (Array.isArray(x.v.ozet_degisen) ? x.v.ozet_degisen : []).forEach(function (k) {
          if (k && typeof k.a === 'string' && HYA_ROTA.test(String(k.r || ''))) bugun.push({ t: String(k.t || ''), a: k.a, b: String(k.b || ''), r: k.r, d: String(k.d || '') });
        });
      });
      var gb = {};
      bugun = bugun.filter(function (k) { var z = k.t + '|' + k.a + '|' + k.r; if (gb[z]) return false; gb[z] = 1; return true; });
      bugun.sort(function (a, b) { return a.d < b.d ? 1 : (a.d > b.d ? -1 : 0); });
      hyaDurum.dizin = kayit; hyaDurum.bugun = bugun.slice(0, 10); hyaDurum.kaynakSayi = kaynak; hyaDurum.yukleniyor = false;
      return kayit;
    });
    return hyaDurum.yukleniyor;
  }
   
  var HYA_BOLUM = { dmo: ['dmo'], 'dmo-nakliyat': ['dmo-nakliyat', 'nakliye'], nakliye: ['nakliye', 'dmo-nakliyat'], siparis: ['siparis'] };
  function hyaKapsamda(k) {
    var b = hyaDurum.bolum; if (!b) return true;
    var kok = String(k.r || '').split('#')[1] || ''; kok = kok.split('/')[0];
    return (HYA_BOLUM[b] || [b]).indexOf(kok) >= 0;
  }
  function hyaAra(q, tumu) {
    var j = q.split(' ').filter(Boolean), sonuc = [];
    (hyaDurum.dizin || []).forEach(function (k) {
      if (!tumu && !hyaKapsamda(k)) return;
      var puan = 0;
      for (var i = 0; i < j.length; i++) {
        if (k.n.indexOf(j[i]) < 0) return;
        puan += k.na.indexOf(j[i]) === 0 ? 3 : (k.na.indexOf(j[i]) >= 0 ? 2 : 1);
        if (k.t === 'siparis' && k.na.indexOf(j[i]) >= 0) puan += 4;                        
        if (/^\d{3,}$/.test(j[i]) && k.na.length >= j[i].length && k.na.slice(-j[i].length) === j[i]) puan += 3;    
      }
      sonuc.push({ k: k, p: puan });
    });
    sonuc.sort(function (a, b) { return b.p - a.p; });
    return sonuc.slice(0, 50).map(function (x) { return x.k; });
  }
  function hyaGit(rota) {
    if (!HYA_ROTA.test(String(rota || ''))) return;
    var p = rota.split('#'), sorgu = p[0], hash = '#' + p[1];
    hyaKapat(true);
    if (sorgu && sorgu !== location.search && window.history && history.replaceState) { try { history.replaceState(null, '', location.pathname + sorgu); } catch (e) { } }
    if (location.hash === hash) window.dispatchEvent(new Event('hashchange')); else location.hash = hash;
  }
  function hyaSatir(k) {
    var h = MM.gr.h;
    return h('a', { href: k.r, sinif: 'hya-sonuc', onclick: function (e) { e.preventDefault(); hyaGit(k.r); } }, [
      h('span', { sinif: 'hya-ad', metin: k.a }),
      h('span', { sinif: 'hya-bag soluk kucuk', metin: (k.b || '') + (k.d ? (k.b ? ' · ' : '') + k.d : '') })
    ]);
  }
  function hyaCiz() {
    var h = MM.gr.h, g = hyaDurum.govde, alt = hyaDurum.alt, q = norm(hyaDurum.girdi.value).trim().replace(/\s+/g, ' ');
    g.textContent = '';
    if (!hyaDurum.dizin) { g.appendChild(h('p', { sinif: 'soluk', metin: 'Kaynaklar okunuyor…' })); alt.textContent = ''; return; }
    if (hyaDurum.bolum && !hyaDurum.dizin.some(hyaKapsamda)) hyaDurum.bolum = '';    
    alt.textContent = hyaDurum.kaynakSayi + ' kaynakta arandı' + (hyaDurum.bolum ? ' · yalnız bu bölümün sekmeleri (tümü için Ctrl/⌘ Shift K)' : '');
    if (!q) {
      g.appendChild(h('h3', { sinif: 'hya-grup', metin: 'Bugün ne değişti' }));
      var bg = hyaDurum.bugun.filter(hyaKapsamda);
      if (!bg.length) g.appendChild(h('p', { sinif: 'soluk', metin: hyaDurum.kaynakSayi ? 'Son 24 saatte yeni ya da değişen kayıt yok.' : 'Erişebildiğiniz kaynakta arama dizini henüz yok.' }));
      bg.forEach(function (k) { g.appendChild(hyaSatir(k)); });
      return;
    }
    var s = hyaAra(q);
    if (!s.length) { g.appendChild(h('p', { sinif: 'soluk', metin: 'Sonuç yok.' })); return; }
    HYA_TUR.forEach(function (tr) {
      var l = s.filter(function (k) { return k.t === tr[0]; });
      if (!l.length) return;
      g.appendChild(h('h3', { sinif: 'hya-grup', metin: tr[1] + ' (' + l.length + ')' }));
      l.forEach(function (k) { g.appendChild(hyaSatir(k)); });
    });
  }
  function hyaKapat(odaksiz) {
    var d = hyaDurum; if (!d.kap) return;
    d.kap.remove(); d.kap = null; document.body.style.overflow = d.eskiTasma || '';
    if (!odaksiz && d.sonOdak && d.sonOdak.focus) { try { d.sonOdak.focus(); } catch (e) { } }
  }
  function hyaAc(sorgu, bolum) {
    if (MM.araAc && MM.araAc(typeof sorgu === 'string' ? sorgu : '') === true) return;   
    if (hyaDurum.kap || !MM.gr) return;
    var h = MM.gr.h, d = hyaDurum; d.bolum = (typeof bolum === 'string' && /^[a-z][a-z0-9-]*$/.test(bolum) && bolum !== 'ana') ? bolum : '';
    d.sonOdak = document.activeElement; d.eskiTasma = document.body.style.overflow; document.body.style.overflow = 'hidden';
    d.girdi = h('input', { type: 'search', sinif: 'eld-arama hya-girdi', placeholder: 'Her yerde ara: hastane, ürün, sipariş, konteyner, belge…', 'aria-label': 'Her yerde ara', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', enterkeyhint: 'search' });
    d.govde = h('div', { sinif: 'hya-govde', role: 'region', 'aria-live': 'polite' });
    d.alt = h('div', { sinif: 'hya-alt soluk kucuk', 'aria-live': 'polite' });
    var kapat = h('button', { type: 'button', sinif: 'mini-dugme hya-kapat', 'aria-label': 'Kapat', onclick: function () { hyaKapat(); } }, ['Kapat']);
    d.kap = h('div', { sinif: 'hya-kap', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Her yerde ara' }, [
      h('div', { sinif: 'hya-ust' }, [d.girdi, kapat]), d.govde, d.alt]);
    var st = d.kap.style;   
    st.position = 'fixed'; st.top = '0'; st.left = '0'; st.right = '0'; st.bottom = '0'; st.zIndex = '10000'; st.background = 'var(--yuzey, #fff)'; st.color = 'var(--yazi, #111)';
    st.display = 'flex'; st.flexDirection = 'column'; st.padding = '16px'; st.boxSizing = 'border-box'; st.maxWidth = '100%';
    var us = d.kap.firstChild.style; us.display = 'flex'; us.gap = '8px'; us.alignItems = 'center'; us.maxWidth = '860px'; us.width = '100%'; us.margin = '0 auto 12px';
    d.girdi.style.flex = '1'; d.girdi.style.minWidth = '0'; d.girdi.style.minHeight = '44px'; d.girdi.style.fontSize = '16px';
    var gs = d.govde.style; gs.flex = '1'; gs.overflowY = 'auto'; gs.maxWidth = '860px'; gs.width = '100%'; gs.margin = '0 auto';
    var as = d.alt.style; as.maxWidth = '860px'; as.width = '100%'; as.margin = '8px auto 0';
    if (!document.getElementById('hya-stil')) {
      var s = document.createElement('style'); s.id = 'hya-stil';
      s.textContent = '.hya-grup{font-size:13px;margin:14px 0 6px;color:var(--yazi2,#555);text-transform:none}.hya-sonuc{display:flex;flex-direction:column;gap:2px;padding:8px 10px;border:1px solid var(--cizgi,#ddd);border-radius:var(--r-t,8px);margin-bottom:6px;background:var(--yuzey,#fff);color:inherit;text-decoration:none;min-height:44px;justify-content:center}.hya-sonuc:hover,.hya-sonuc:focus{background:var(--yuzey2,#f3f3f3)}.hya-ad{font-weight:600;overflow-wrap:anywhere}.hya-bag{overflow-wrap:anywhere}.hya-dugme{margin-left:auto}';
      document.head.appendChild(s);
    }
    document.body.appendChild(d.kap);
    d.kap.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); hyaKapat(); } });
    d.girdi.addEventListener('input', hyaCiz);
    if (sorgu) d.girdi.value = sorgu;
    hyaCiz(); d.girdi.focus();
    hyaYukle().then(function () { if (hyaDurum.kap) hyaCiz(); }, function () { hyaDurum.dizin = hyaDurum.dizin || []; if (hyaDurum.kap) hyaCiz(); });
  }
   
  var hyaBirlesik = {
    hazir: function () { return !!hyaDurum.dizin; },
    yukle: function () { return hyaYukle().then(function (d) { return d; }, function () { hyaDurum.dizin = hyaDurum.dizin || []; return hyaDurum.dizin; }); },
    ara: function (q) { var n = norm(q).trim().replace(/\s+/g, ' '); return n ? hyaAra(n, true) : []; },
    tur: function (t) { for (var i = 0; i < HYA_TUR.length; i++) if (HYA_TUR[i][0] === t) return HYA_TUR[i][1]; return String(t || ''); },
    git: hyaGit
  };
  MM.herYerdeAra = { ac: hyaAc, kapat: hyaKapat, birlesik: hyaBirlesik };

  function hyaDugmeKoy() {
    var kok = document.getElementById('icerik'); if (!kok) return;
    var asistan = rotaAnahtar().split('/')[0] === '#asistan';
    var ust = asistan ? kok.querySelector('.ms-ust-cubuk') : null;
    if (!ust) return;
    if (ust.querySelector('.hya-dugme')) return;
    var b = MM.gr.h('button', { type: 'button', sinif: 'mini-dugme hya-dugme', title: 'Tüm kaynaklarda ara', 'aria-label': 'Her yerde ara', onclick: function () { hyaAc(); } }, ['Her yerde ara']);
    ust.appendChild(b);
  }
  function hyaBaslat() {
    document.addEventListener('keydown', function (e) {
      if (!(e.ctrlKey || e.metaKey) || (e.key !== 'k' && e.key !== 'K')) return;
      var asistan = rotaAnahtar().split('/')[0] === '#asistan';
      if (!e.shiftKey && !asistan) return;   
      e.preventDefault(); e.stopImmediatePropagation();
      if (MM.araAcik && MM.araAcik()) { MM.araKapat(); return; }   
      hyaDurum.kap ? hyaKapat() : hyaAc();
    }, true);
    var ic = document.getElementById('icerik');
    if (ic && window.MutationObserver) { var gz = false; new MutationObserver(function () { if (gz) return; gz = true; (window.requestAnimationFrame || setTimeout)(function () { gz = false; hyaDugmeKoy(); }); }).observe(ic, { childList: true, subtree: true }); }
    window.addEventListener('hashchange', hyaDugmeKoy);
    hyaDugmeKoy();
    var qh = new URLSearchParams(location.search).get('hya');   
    if (qh !== null) setTimeout(function () { hyaAc(qh); }, 700);
  }

  function baslat() {
    hyaBaslat();
    icerik = document.getElementById('icerik'); if (!icerik || !MM.gr) return;
    new MutationObserver(planla).observe(icerik, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () { planla(); });
    var qa = new URLSearchParams(location.search).get('ara');   
    setTimeout(function () { calis(); if (qa && kutu) { kutu.girdi.value = qa; kutu.uygula(true); } }, qa ? 600 : 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat); else baslat();
})();
