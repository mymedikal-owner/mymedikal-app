




(function () {
  'use strict';
  var BILGI = 'Bu sohbetler şirketin Microsoft bulut hesabında (Avrupa Birliği içinde) 12 ay saklanır. Uçtan uca şifreli değildir; şirket yönetimi gerektiğinde erişebilir. Aramalar kaydedilmez. Şifre, kimlik numarası, sağlık bilgisi yazmayınız. Buraya yazılan \'onay\' ya da \'gönder\' hiçbir işlemi başlatmaz.';
  var KABUL = 'image/jpeg,image/png,image/heic,application/pdf,.xlsx,.docx,audio/mp4,audio/webm,audio/aac';
  var MEET_CEVRIMICI = 'Mumu Meet lobisinde, uygulamayı açık tutan iş arkadaşlarınız sizi \'çevrimiçi\' olarak görebilir.';
  var TIK_GIZLILIK ='Mesajın ulaştığı ve okunduğu bilgisi sohbet üyelerine gösterilir.';
  var RENKLER = ['#2e6fb7', '#00796b', '#8e44ad', '#c0392b', '#b45309', '#6d4c41', '#455a64', '#ad1457'];

  function kisileriSuz(v) {
    var l = (v && v.kisiler) || (Array.isArray(v) ? v : []);
    return l.filter(function (k) { return k && k.oid && k.ad; }).map(function (k) { return { oid: String(k.oid), ad: String(k.ad) }; });   
  }
   
  function paylasMetni(rota, bolumAd) {
    var r = String(rota || '').replace(/^#\/?/, '');
    var bolum = r.split(/[\/?&]/)[0];
    if (!bolum || !/^[A-Za-z0-9_-]{1,60}$/.test(bolum)) return null;
    var rt = bolum.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);   
    if (!rt) return null;
    var ad = String(bolumAd || bolum).replace(/[^A-Za-z0-9ÇĞİÖŞÜçğıöşü _-]/g, '').trim().slice(0, 40) || rt;   
    return { bolum: bolum, rota: '#' + rt, kart: { bolum: ad, rota: '#' + rt }, yalnizBolum: true };
  }

   
  function epoch(ts) {
    if (typeof ts === 'number') return isFinite(ts) ? ts : NaN;
    if (typeof ts === 'string' && /^\d{9,}$/.test(ts)) return Number(ts);
    var d = new Date(ts); return d.getTime();
  }
  var TZ = null;
  function trParca(ts) {   
    var ms = epoch(ts); if (isNaN(ms)) return null;
    try {
      TZ = TZ || new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      var o = {}; TZ.formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
      return { y: o.year, m: o.month, d: o.day, sa: o.hour === '24' ? '00' : o.hour, dk: o.minute };
    } catch (e) { return null; }
  }
  function saatDk(ts) { var p = trParca(ts); return p ? p.sa + ':' + p.dk : ''; }
  function ayniGun(a, b) { return !!(a && b && a.y === b.y && a.m === b.m && a.d === b.d); }
   
  function saatBicim(ts, simdi) {
    var p = trParca(ts); if (!p) return '';
    var ms = epoch(simdi == null ? Date.now() : simdi);
    if (ayniGun(p, trParca(ms))) return p.sa + ':' + p.dk;
    if (ayniGun(p, trParca(ms - 86400000))) return 'Dün';
    return p.d + '.' + p.m + '.' + p.y;
  }
   
   
  var MEET_KOKLER = ['https://mymedikal-owner.github.io/mymedikal-app/', 'capacitor://localhost/', 'https://localhost/'];   
  function toplantiBag(metin) {
    var t = String(metin == null ? '' : metin), ON = 'Toplantıya katılın: ';
    if (t.length > 600 || t.indexOf(ON) !== 0) return '';
    var u = t.slice(ON.length);
    if (/\s/.test(u)) return '';   
    for (var k = 0; k < MEET_KOKLER.length; k++) {
      if (u.indexOf(MEET_KOKLER[k]) !== 0) continue;
      var m = /^meet\/(?:index\.html)?(#s=[^\s&#]{1,200}&g=[^\s&#]{1,200}|#toplanti\/[A-Za-z0-9_-]{22})$/.exec(u.slice(MEET_KOKLER[k].length));
      if (m) return 'meet/index.html' + m[1];
    }
    return '';   
  }
   
  

  var SESSIZ_BIT = {};
  function sessizBitisi(s) {
    var t = s.tercih || {}, b = typeof t.sessizBitis === 'number' ? t.sessizBitis : SESSIZ_BIT[s.id];
    return typeof b === 'number' ? b : null;   
  }
  function sessizAltYazi(s) {
    if (!(s.tercih && s.tercih.sessiz)) return '';
    var b = sessizBitisi(s), c = function (x) { return MM.t ? MM.t(x) : x; };
    if (b === 0) return c('Her zaman');
    if (b === null) return c('Sessize alındı');
    var d = new Date(b), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    if (b - Date.now() > 24 * 3600 * 1000) return p2(d.getDate()) + '.' + p2(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + c('tarihine kadar');
    return p2(d.getHours()) + ':' + p2(d.getMinutes()) + ' ' + c('saatine kadar');
  }
  function sessizSayfasi(s, ist, ebeveyn, yazFn, sonra) {
    var t = s.tercih || {}, kok2 = h('div', { sinif: 'ms-sheet-kok' });
    var kutu = h('div', { sinif: 'ms-sheet', role: 'dialog' });
    function kapat() { if (kok2.parentNode) kok2.parentNode.removeChild(kok2); }
    function uygula(sure) {
      var deger = sure !== null;
      function yerel() { if (sure === '8s') SESSIZ_BIT[s.id] = Date.now() + 8 * 3600 * 1000; else if (sure === '1h') SESSIZ_BIT[s.id] = Date.now() + 7 * 24 * 3600 * 1000; else if (sure === 'hep') SESSIZ_BIT[s.id] = 0; else delete SESSIZ_BIT[s.id]; s.tercih = Object.assign({}, s.tercih || {}, { sessiz: deger }); D.sohbetler = siraliSohbetler(D.sohbetler); bildir(); yazFn(''); if (sonra) sonra(); }
      function eskiYol() { return ist.tercih(s.id, { sessiz: deger }).then(yerel, function (e) { yazFn(hataYaz(e)); if (sonra) sonra(); }); }
      if (!ist.sessizAl) { eskiYol(); return; }
      ist.sessizAl(s.id, sure).then(yerel, function (e) {
        var d = e && e.durum;
        if (d === 404 || d === 400) {
          if (sure === 'hep' || sure === null) { eskiYol(); return; }
          yazFn(T('Bu özellik birazdan açılacak')); if (sonra) sonra(); return;
        }
        yazFn(hataYaz(e)); if (sonra) sonra();
      });
    }
    var enDil = T('Vazgeç') === 'Cancel';
    if (t.sessiz) {   
      var sb = h('button', { sinif: 'ms-sheet-oge', type: 'button', metin: T('Sesi aç') }); sb.addEventListener('click', function () { kapat(); uygula(null); }); kutu.appendChild(sb);
      var v = h('button', { sinif: 'ms-sheet-oge', type: 'button', metin: T('Vazgeç') }); v.addEventListener('click', kapat); kutu.appendChild(v);
    } else {
      var secili = '8s', grupAd = 'ms-sessiz-sure';
      kutu.classList.add('ms-sessiz-diyalog'); kutu.setAttribute('aria-label', T('Bildirimleri sessize al'));
      kutu.appendChild(h('p', { sinif: 'ms-sessiz-baslik', metin: T('Bildirimleri sessize al') }));
      kutu.appendChild(h('p', { sinif: 'ms-sessiz-acik', metin: T('Sessize aldığınızı diğer kişi görmez. Bahsedildiğinizde yine bildirim alırsınız.') }));
      [['8 saat', '8s'], ['1 hafta', '1h'], ['Her zaman', 'hep']].forEach(function (o) {
        var r = h('input', { type: 'radio', name: grupAd, value: o[1] });
        if (o[1] === secili) r.checked = true;
        r.addEventListener('change', function () { if (r.checked) secili = o[1]; });
        kutu.appendChild(h('label', { sinif: 'ms-sessiz-sec' }, [r, h('span', { metin: T(o[0]) })]));
      });
      var dsira = h('div', { sinif: 'ms-sessiz-dugmeler' });
      var ip = h('button', { sinif: 'ms-sessiz-dugme', type: 'button', metin: enDil ? 'Cancel' : 'İptal' }); ip.addEventListener('click', kapat);
      var tm = h('button', { sinif: 'ms-sessiz-dugme ms-sessiz-tamam', type: 'button', metin: T('Tamam') }); tm.addEventListener('click', function () { kapat(); uygula(secili); });
      dsira.appendChild(ip); dsira.appendChild(tm); kutu.appendChild(dsira);
    }
    kok2.addEventListener('click', function (e) { if (e.target === kok2) kapat(); });
    kok2.appendChild(kutu); ebeveyn.appendChild(kok2);
  }
  function onizMetni(son, ceviri) {
    var c = ceviri || function (x) { return x; };
    if (!son) return '';
    if (typeof son.metin === 'string' && son.metin && toplantiBag(son.metin)) return '📹 ' + c('Mumu Meet');
    if (typeof son.metin === 'string' && son.metin) return kirp(son.metin, 80);
    var o = String(son.ozet || '');
    if (o === 'metin') return '';
    if (o === 'silindi') return c('Bu mesaj silindi');
    if (o === 'dosya') return c('Dosya');
    if (o === 'ses') return c('Sesli mesaj');
    if (o === 'kart') return c('Paylaşılan kart');
    return o;
  }
   
  function sohbetSuz(liste, o, adFn) {
    o = o || {}; var q = kucukTr(String(o.q || '').trim()), cip = o.cip || 'tum';
    return (liste || []).filter(function (s) {
      if (!s) return false;
      var arsiv = !!(s.tercih && s.tercih.arsiv);
      if (cip === 'arsiv' ? !arsiv : arsiv) return false;
      if (cip === 'okunmamis' && !(s.okunmamis > 0)) return false;
      if (cip === 'favori' && !(s.tercih && s.tercih.favori)) return false;
      if (cip === 'grup' && s.tur !== 'grup') return false;
      if (q && kucukTr((adFn ? adFn(s) : s.ad) + ' ' + onizMetni(s.son)).indexOf(q) < 0) return false;
      return true;
    });
  }
  function harfBaslik(ad) { var k = Array.from(String(ad || '').trim())[0] || '#'; k = k.toLocaleUpperCase('tr'); return /\p{L}/u.test(k) ? k : '#'; }
  function gunEtiket(ts, simdi) {   
    var p = trParca(ts); if (!p) return '';
    var ms = epoch(simdi == null ? Date.now() : simdi);
    if (ayniGun(p, trParca(ms))) return 'Bugün';
    if (ayniGun(p, trParca(ms - 86400000))) return 'Dün';
    return p.d + '.' + p.m + '.' + p.y;
  }
  function basHarf(ad) {
    var k = String(ad || '').trim().split(/\s+/).filter(Boolean);
    if (!k.length) return '?';
    var ilk = Array.from(k[0])[0] || '';
    var son = k.length > 1 ? (Array.from(k[k.length - 1])[0] || '') : '';
    return (ilk + son).toLocaleUpperCase('tr');
  }
  function avatarRengi(anahtar) {
    var s = String(anahtar || ''), t = 0;
    for (var i = 0; i < s.length; i++) t = (t * 31 + s.charCodeAt(i)) >>> 0;
    return RENKLER[t % RENKLER.length];
  }
  function kucukTr(s) { return String(s || '').toLocaleLowerCase('tr'); }
   
  function kisiSuz(liste, q, benOid) {
    var a = kucukTr(String(q || '').trim());
    return (liste || []).filter(function (k) { return k && k.oid !== benOid && (!a || kucukTr(k.ad).indexOf(a) >= 0); })
      .sort(function (x, y) { return String(x.ad).localeCompare(String(y.ad), 'tr'); });
  }
  function okunmamisToplam(liste) { return (liste || []).reduce(function (t, s) { return t + (Number(s && s.okunmamis) > 0 ? Number(s.okunmamis) : 0); }, 0); }
  function rozetMetni(n) { n = Number(n) || 0; return n <= 0 ? '' : (n > 99 ? '99+' : String(n)); }
  function sonMs(s) { var ms = s && s.son ? epoch(s.son.ts) : NaN; return isNaN(ms) ? 0 : ms; }
  function sabitMi(s) { return !!(s && s.tercih && s.tercih.sabit); }
  function siraliSohbetler(liste) { return (liste || []).slice().sort(function (a, b) { return (sabitMi(b) - sabitMi(a)) || (sonMs(b) - sonMs(a)); }); }   
  function kirp(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
   
  function aramaMetni(m, ceviri, saat) {
    var c = ceviri || function (x) { return x; };
    var a = m && m.arama && typeof m.arama === 'object' ? m.arama : {}, so = String(a.sonuc || '');
    var t = /^(cevapsiz|missed)/.test(so) ? (a.video ? 'Cevapsız görüntülü arama' : 'Cevapsız sesli arama') : (/^(red|declined|rejected)/.test(so) ? 'Reddedilen arama' : 'Arama');
    return c(t) + (saat ? ' ' + saat : '');
  }
  function mesajOzet(m, ceviri) {
    var c = ceviri || function (x) { return x; };
    if (!m) return '';
    if (m.silindi) return c('Bu mesaj silindi');
    if (m.tur === 'arama') return aramaMetni(m, c, '');
    if (m.tur === 'metin' || !m.tur) return kirp(m.metin, 60);
    return c(m.tur === 'kart' ? 'Paylaşılan kart' : m.tur === 'ses' ? 'Sesli mesaj' : 'Dosya');
  }
   
  var HIZLI_TEPKI = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  var DUZENLE_MS = 15 * 60 * 1000, SIL_MS = 48 * 3600 * 1000;   
  function kacisRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
   
  function bahisParcala(metin, adlar) {
    metin = String(metin == null ? '' : metin);
    var l = (adlar || []).filter(function (a) { return typeof a === 'string' && a.trim(); }).sort(function (x, y) { return y.length - x.length; });
    if (!l.length || metin.indexOf('@') < 0) return [{ t: 'metin', v: metin }];
    var re = new RegExp('@(' + l.map(kacisRe).join('|') + ')(?![\\p{L}\\p{N}])', 'gu'), out = [], son = 0, m;
    while ((m = re.exec(metin))) {
      if (m.index > son) out.push({ t: 'metin', v: metin.slice(son, m.index) });
      out.push({ t: 'bahis', v: m[0] }); son = m.index + m[0].length;
    }
    if (son < metin.length) out.push({ t: 'metin', v: metin.slice(son) });
    return out;
  }
   
  function tepkiOzet(tepkiler, benOid) {
    var sira = [], say = {}, benim = {};
    Object.keys(tepkiler || {}).forEach(function (oid) {
      var e = tepkiler[oid]; if (!e) return;
      if (!Object.prototype.hasOwnProperty.call(say, e)) { say[e] = 0; sira.push(e); }
      say[e]++; if (oid === benOid) benim[e] = true;
    });
    return sira.map(function (e, ix) { return { emoji: e, sayi: say[e], benim: !!benim[e], ix: ix }; }).sort(function (a, b) { return (b.sayi - a.sayi) || (a.ix - b.ix); })
      .map(function (r) { return { emoji: r.emoji, sayi: r.sayi, benim: r.benim }; });
  }
  function duzenlenebilir(m, benOid, simdi) { return !!(m && !m.yerel && !m.silindi && m.tur === 'metin' && benOid && m.gonderen === benOid && (epoch(simdi == null ? Date.now() : simdi) - epoch(m.ts)) <= DUZENLE_MS); }
  function silinebilir(m, s, benOid, simdi) {
    if (!m || m.yerel || m.silindi || !benOid) return false;
    var yon = !!(s && s.tur === 'grup' && Array.isArray(s.yoneticiler) && s.yoneticiler.indexOf(benOid) >= 0);
    if (m.gonderen !== benOid && !yon) return false;
    return (epoch(simdi == null ? Date.now() : simdi) - epoch(m.ts)) <= SIL_MS;
  }
  function yanitOzet(y, ceviri) {   
    var c = ceviri || function (x) { return x; };
    if (!y) return '';
    if (y.silindi) return c('Bu mesaj silindi');
    if (y.yok) return c('Mesaj bulunamadı');
    if (y.tur === 'dosya') return c('Dosya');
    if (y.tur === 'ses') return c('Sesli mesaj');
    if (y.tur === 'kart') return c('Paylaşılan kart');
    return kirp(String(y.metin || '').split('\n')[0], 80);
  }
   
  function bahisSorgu(deger, imlec) {
    var on = String(deger || '').slice(0, imlec == null ? String(deger || '').length : imlec);
    var m = /(^|\s)@([^\s@]{0,30})$/.exec(on);
    return m ? { bas: on.length - m[2].length - 1, sorgu: m[2] } : null;
  }
  function bandMetni(ad, ozet) { return (ad || 'Biri') + ': ' + kirp(ozet, 50); }
  function birebirBul(liste, oid) {   
    return (liste || []).filter(function (s) { return s && s.tur === 'bire' && Array.isArray(s.uyeler) && s.uyeler.indexOf(oid) >= 0 && s.uyeler.length <= 2; })[0] || null;
  }

  


  function aliciListesi(s, benOid) { return ((s && s.uyeler) || []).filter(function (o) { return o !== benOid; }); }
  function tikHesap(id, alicilar, okundu, teslim, herhangi) {
    if (!id) return 'bekliyor';
    if (!alicilar || !alicilar.length) return 'gonderildi';
    okundu = okundu || {}; teslim = teslim || {};
    var test = herhangi ? 'some' : 'every';
    function oku(a) { return okundu[a] || ''; }
    function ulas(a) { var t = teslim[a] || '', o = oku(a); return t > o ? t : o; }
    if (alicilar[test](function (a) { return oku(a) && oku(a) >= id; })) return 'okundu';
    if (herhangi) return 'gonderildi';
    if (alicilar.every(function (a) { return ulas(a) && ulas(a) >= id; })) return 'ulasti';
    return 'gonderildi';
  }
  function sohbetTik(s, id, benOid) {   
    var herhangi = !s || !s.okundu || s.haritaYok === true;
    return tikHesap(id, aliciListesi(s, benOid), s && s.okundu, s && s.teslim, herhangi);
  }
  function haritaIleri(h, oid, sonId) {   
    if (!oid || !sonId) return false;
    if (sonId > (h[oid] || '')) { h[oid] = sonId; return true; }
    return false;
  }
  function haritaBirles(eski, yeni) { var r = Object.assign({}, yeni || {}); Object.keys(eski || {}).forEach(function (k) { haritaIleri(r, k, eski[k]); }); return r; }

  var MM = (typeof window !== 'undefined' && window.MM) || null;
  var API = { bahisParcala: bahisParcala, tepkiOzet: tepkiOzet, duzenlenebilir: duzenlenebilir, silinebilir: silinebilir, yanitOzet: yanitOzet, bahisSorgu: bahisSorgu, HIZLI_TEPKI: HIZLI_TEPKI, aliciListesi: aliciListesi, tikHesap: tikHesap, sohbetTik: sohbetTik, haritaBirles: haritaBirles, kisileriSuz: kisileriSuz, paylasMetni: paylasMetni, BILGI: BILGI, saatBicim: saatBicim, saatDk: saatDk, gunEtiket: gunEtiket, basHarf: basHarf, avatarRengi: avatarRengi, kisiSuz: kisiSuz, okunmamisToplam: okunmamisToplam, toplantiBag: toplantiBag, rozetMetni: rozetMetni, siraliSohbetler: siraliSohbetler, onizMetni: onizMetni, sohbetSuz: sohbetSuz, harfBaslik: harfBaslik, mesajOzet: mesajOzet, aramaMetni: aramaMetni, bandMetni: bandMetni, birebirBul: birebirBul, kirp: kirp };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (!MM) return;

  var h = MM.h, T = function (k) { return MM.t ? MM.t(k) : k; };
  var bekleyenKart = null, ist = null;
   
  var bildirimSon = '';
   
  var BD = { izin: '', token: '', tokenSon: '', kod: '', http: '', ts: '' };
  var bdDinleyen = [];
  function bdKod(e) { return String((e && (e.kod || e.code || e.message)) || e || 'hata').replace(/[^A-Za-z0-9_:.\-]/g, '').slice(0, 24) || 'hata'; }
  function bdSaat() { var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; }; return z(d.getHours()) + ':' + z(d.getMinutes()); }
  function bdYaz(a) { for (var k in a) BD[k] = a[k]; bdDinleyen.forEach(function (f) { try { f(); } catch (e) {   } }); }
  window.MM_bildirimKod = function (kod) { bdYaz({ kod: bdKod(kod) }); };   
  (function () { var q = window.MM_bildirimKodBekleyen; window.MM_bildirimKodBekleyen = []; if (q && q.length) q.forEach(function (k) { bdYaz({ kod: bdKod(k) }); }); })();   
  function bdMetin() {
    var izin = BD.izin === 'var' ? 'verildi' : BD.izin === 'red' ? 'reddedildi' : 'sorulmadı';
    var tok = BD.token === 'var' ? 'alındı …' + BD.tokenSon : (BD.token ? 'yok' : '—');
    var srv = BD.http ? BD.http + (BD.ts ? ' ' + BD.ts : '') : '—';
    return 'Bildirim · izin: ' + izin + ' · Telefon kaydı: ' + tok + ' · sunucu: ' + srv + (BD.kod ? ' · hata: ' + BD.kod : '') + (BD.izin === 'red' ? ' · Ayarlar > MY Medikal > Bildirimler\'den açın' : '');
  }
  function bdSatir() {
    if (!iosKabuk()) return null;   
    var tesh = false; try { tesh = /[?&]teshis=1(&|$)/.test(location.search); } catch (e) { tesh = false; }
    if (!tesh) return null;   
    var el = h('p', { sinif: 'soluk ms-bildirim-durum', role: 'status', 'aria-live': 'polite', metin: bdMetin() });
    var f = function () { el.textContent = bdMetin(); };
    bdDinleyen.push(f);
    return el;
  }
  function iosKabuk() { var c = window.Capacitor; return !!(c && c.isNativePlatform && c.isNativePlatform() && c.getPlatform && c.getPlatform() === 'ios'); }
  function bildirimKayit() {
    if (!iosKabuk()) return Promise.reject(new Error('bildirim'));
    var c = window.Capacitor, P = c.Plugins && c.Plugins.MMBildirim;
    if (!P || typeof P.izinIste !== 'function') { bdYaz({ token: 'yok', kod: 'eklenti_yok' }); return Promise.reject(new Error('bildirim')); }
    return Promise.resolve(typeof window.MMBildirimIzin === 'function' ? window.MMBildirimIzin() : P.izinIste()).then(function (s) {
      bildirimSon = s ? String(s.durum || 'yok') + (s.neden ? ':' + String(s.neden).slice(0, 20) : '') : 'yok';   
      var ok = !!(s && s.durum === 'var' && typeof s.belirtec === 'string' && s.belirtec);
      bdYaz({ izin: s && (s.durum === 'var' || s.durum === 'red') ? s.durum : '', token: ok ? 'var' : 'yok', tokenSon: ok ? s.belirtec.slice(-4) : '', kod: ok ? '' : bdKod(s && (s.neden || s.durum) || 'izin_yok') });
      if (!ok) { var er = new Error('bildirim'); er.kod = BD.kod || 'izin_yok'; throw er; }
      return { platform: 'apns', handle: s.belirtec };
    }, function (e) { bdYaz({ token: 'yok', kod: bdKod(e) }); throw e; });
  }
  

  var WEB_TABAN = 'https://mymedikal-owner.github.io/mymedikal-app/';
  function kabukMu() { var c = window.Capacitor; return !!(c && c.isNativePlatform && c.isNativePlatform()); }
  function meetTamAdres(adres) { return /^https:\/\//.test(adres) ? adres : WEB_TABAN + String(adres || '').replace(/^\/+/, ''); }
  function disAc(adres) {
    var w = null;
    try { w = window.open(adres, '_blank'); } catch (e) { w = null; }   
    if (!w) { try { window.open(adres, '_system'); } catch (e2) {   } }
  }
  


  var cerceveKok = null;
  function meetCerceveKapat() {
    if (!cerceveKok) return;
    try { cerceveKok.parentNode.removeChild(cerceveKok); } catch (e) {   }
    cerceveKok = null;
    try { document.documentElement.classList.remove('meet-cerceve-acik'); } catch (e2) {   }
  }
  function meetCerceveAc(adres) {
     
    adres = String(adres || 'meet/').replace(/^meet\/(?=$|[#?])/, 'meet/index.html');
    meetCerceveKapat();
    var kok = document.createElement('div');
    kok.className = 'meet-cerceve-kok';
    kok.setAttribute('style', 'position:fixed;inset:0;z-index:2147483000;background:#0b1424;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top)');
    var ust = document.createElement('div');
    ust.setAttribute('style', 'display:flex;gap:8px;justify-content:flex-end;padding:6px 10px');
    var dugmeStil = 'border:0;border-radius:18px;padding:8px 14px;font:600 14px system-ui;color:#fff;background:rgba(255,255,255,.16)';
    var yedek = document.createElement('button');
    yedek.type = 'button'; yedek.textContent = 'Tarayıcıda aç'; yedek.setAttribute('style', dugmeStil + ';display:none');
    yedek.addEventListener('click', function () { var a = adres; meetCerceveKapat(); disAc(meetTamAdres(a)); });
    var kapat = document.createElement('button');
    kapat.type = 'button'; kapat.textContent = 'Kapat'; kapat.setAttribute('aria-label', 'Aramayı kapat'); kapat.setAttribute('style', dugmeStil);
    kapat.addEventListener('click', meetCerceveKapat);
    ust.appendChild(yedek); ust.appendChild(kapat);
    var fr = document.createElement('iframe');
    fr.setAttribute('allow', 'camera; microphone; autoplay; display-capture');
    fr.setAttribute('title', 'Mumu Meet');
    fr.setAttribute('style', 'flex:1;width:100%;border:0;background:#0b1424');
    var hazir = false;
    var sure = setTimeout(function () { if (!hazir && cerceveKok === kok) yedek.style.display = ''; }, 15000);
    fr.addEventListener('error', function () { yedek.style.display = ''; });
    function mesajDinle(e) {
      if (!cerceveKok || cerceveKok !== kok) { window.removeEventListener('message', mesajDinle); return; }
      if (e.origin !== window.location.origin || e.source !== fr.contentWindow) return;   
      var v = e.data || {};   
      if (v.tur === 'meet-tani') {
        if (v.asama === 'belirtec_ok' || v.asama === 'katildi') { hazir = true; clearTimeout(sure); yedek.style.display = 'none'; }
        else if (v.asama === 'belirtec_yok' || v.asama === 'hata_kodu' || v.asama === 'kamera_izin_red') { yedek.style.display = ''; }
      } else if (v.tur === 'meet-kapat') { clearTimeout(sure); window.removeEventListener('message', mesajDinle); meetCerceveKapat(); }
    }
    window.addEventListener('message', mesajDinle);
    kok.appendChild(ust); kok.appendChild(fr);
    document.body.appendChild(kok);
    cerceveKok = kok;
    try { document.documentElement.classList.add('meet-cerceve-acik'); } catch (e3) {   }
    fr.src = adres;   
  }
  function ayar() { return (window.MM_AYAR && window.MM_AYAR.mesaj) || {}; }
   
  function meetAc(adres) {
    if (kabukMu()) { meetCerceveAc(adres); return; }   
    var dokunmatik = false;
    try { dokunmatik = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); } catch (e) { dokunmatik = false; }
    if (dokunmatik) { window.location.href = adres; return; }
    var w = null;
    try { w = window.open(adres, '_blank', 'noopener'); } catch (e2) { w = null; }
    if (!w) window.location.href = adres;
  }
   
  function gaVar() { var g = typeof window !== 'undefined' ? window.MumuGelenArama : null; return g && typeof g.goster === 'function' ? g : null; }
  function istemci() {
    if (ist) return ist;
    var IS = window.MMMesajIstemci;
    if (!IS) return null;
    var a = ayar();
    var cap = window.Capacitor;
    if (!((cap && cap.isNativePlatform && cap.isNativePlatform()) || window.MM_WEB === true)) return null;   
    var cfg = { apiUrl: a.url || '', belirtecAl: function () { return MM.mesaj.belirtecAl ? MM.mesaj.belirtecAl([a.apiKapsam]) : Promise.reject(new Error('belirtec')); }, bildirimKayit: bildirimKayit };
    ist = (MM.mesaj.istemciKur || IS.hazirla)(cfg);
    return ist;
  }
  function acik() { var i = istemci(); return !!(i && i.acik()); }
  function ben() { return (MM.mesaj.hesap && MM.mesaj.hesap()) || {}; }

   
  var D = { aramaKapali: {}, kendiArama: {},sonPush: '', sonPushZmn: 0, dokunusKuruldu: false, cevapsiz: 0, rozetSon: -1, sayacDinleyen: [], sohbetler: [], kisiler: null, kisiHata: null, sohbetYuklendi: false, acikId: '', basladi: false, abone: [], dinleyen: [], kisiBekle: null, sohbetBekle: null, ac: null, acilacak: '', bantZmn: null, bantEl: null, teslimBekle: {}, tsGonder: {}, okBekle: {}, okGonder: {}, okYok: false, cihazZaman: 0, cihazHandle: '', vgDinler: false, asBekleyen: [], asNot: {}, asEkran: null, sunucuToplam: -1 };
   
  var AS_SURE_MS = 15 * 60000;
  function asNotYaz(sid, neden) { (D.asNot[sid] = D.asNot[sid] || []).push(T('Gruba gönderilmedi') + ': ' + neden); if (D.asEkran && D.asEkran.sohbet === sid) D.asEkran.ciz(); }
  function asBitir(k) { var ix = D.asBekleyen.indexOf(k); if (ix >= 0) D.asBekleyen.splice(ix, 1); }
  function asYokla(k, bekle) {
    setTimeout(function () {
      if (D.asBekleyen.indexOf(k) < 0) return;
      if (Date.now() - k.ts > AS_SURE_MS) { asBitir(k); asNotYaz(k.sohbet, T('cevap 15 dakika içinde gelmedi')); return; }
      var V = window.MMVeri, ist = istemci();
      if (!V || !V.sohbetCevap || !ist || !ist.asistanCevapYaz) { asBitir(k); asNotYaz(k.sohbet, T('asistan şu an kapalı')); return; }
      var p; try { p = V.sohbetCevap(k.sid); } catch (e) { p = Promise.resolve(null); }
      Promise.resolve(p).then(function (c) {
        if (D.asBekleyen.indexOf(k) < 0) return;
        if (!c) { asYokla(k, Math.min(15000, bekle + 2500)); return; }
        if (c.kapsamDisi) { asBitir(k); asNotYaz(k.sohbet, T('bu soru asistanın konusu dışında')); return; }
        if (c.sonuc !== 'tamam' || !c.imza || !c.cevap) { asBitir(k); asNotYaz(k.sohbet, T('cevap alınamadı')); return; }
        if (c.cevap.length > 4000) { asBitir(k); asNotYaz(k.sohbet, T('cevap çok uzun')); return; }   
        ist.asistanCevapYaz(k.sohbet, { soruId: k.mid, metin: c.cevap, imza: c.imza, istemciId: ist.yeniIstemciId ? ist.yeniIstemciId() : undefined }).then(function (m) {
          asBitir(k); if (m && D.asEkran && D.asEkran.sohbet === k.sohbet) D.asEkran.ekle(m, true);
        }, function (e) { asBitir(k); asNotYaz(k.sohbet, e && e.durum === 400 ? T('cevap kabul edilmedi') : T('bağlantı hatası')); });
      }, function () { asYokla(k, Math.min(15000, bekle + 2500)); });
    }, bekle);
  }
  function asGrupBaslat(sid, m, metin) {
    var V = window.MMVeri;
    var soru = typeof metin === 'string' ? metin : '';   
    if (!V || !V.sohbetSor || !soru) { asNotYaz(sid, T('asistan şu an kapalı')); return; }
    if (soru !== soru.trim() || soru.length > 1000) { asNotYaz(sid, T('soru iletilemedi')); return; }   
    V.sohbetSor(soru, { sohbet: sid, mid: m.id }).then(function (r) {
      var k = { sohbet: sid, mid: m.id, sid: r.id, ts: Date.now() }; D.asBekleyen.push(k); asYokla(k, 5000);
    }, function () { asNotYaz(sid, T('soru iletilemedi')); });
  }
  function bildir() { rozetUygula(); D.dinleyen.slice().forEach(function (f) { try { f(); } catch (e) {   } }); }
  function rozetUygula() {
    if (typeof document === 'undefined') return;
    var top = talkToplam(), n = rozetMetni(top);
    Array.prototype.forEach.call(document.querySelectorAll('[data-modul="mesaj"], [data-modul="ana"]'), function (a) {
      var eski = a.querySelector('.ms-nrozet'); if (eski) a.removeChild(eski);
      if (n) { a.appendChild(h('span', { sinif: 'ms-nrozet', metin: n, role: 'status', 'aria-label': n + ' ' + T('okunmamış') })); }
    });
    if (top !== D.rozetSon) {   
      D.rozetSon = top;
      try { if (window.MMRozet) window.MMRozet(top); } catch (e) {   }
      D.sayacDinleyen.slice().forEach(function (f) { try { f(top); } catch (e2) {   } });
    }
  }
   
  function talkToplam() { return D.sunucuToplam >= 0 ? D.sunucuToplam : okunmamisToplam(D.sohbetler) + (D.cevapsiz > 0 ? D.cevapsiz : 0); }   
  function cevapsizYukle() {
    var i = istemci(); if (!i || !i.okunmamisSayilari) return;
    i.okunmamisSayilari().then(function (r) {
      var c = Number(r && r.cevapsiz) || 0, t = Number(r && r.toplam); if (!(t >= 0)) t = -1;
      if (c !== D.cevapsiz || t !== D.sunucuToplam) { D.cevapsiz = c; D.sunucuToplam = t; bildir(); }
    }, function () { D.sunucuToplam = -1;   });
  }
  function cevapsizGoruldu() {   
    var i = istemci(); if (!i || !i.cevapsizGoruldu || !(D.cevapsiz > 0)) return;
    i.cevapsizGoruldu().then(function () { D.cevapsiz = 0; D.sunucuToplam = -1; bildir(); cevapsizYukle(); }, function () {   });
  }
  MM.talkSayac = { al: function () { return talkToplam(); }, dinle: function (f) { D.sayacDinleyen.push(f); return function () { D.sayacDinleyen = D.sayacDinleyen.filter(function (x) { return x !== f; }); }; }, yukle: function () { cevapsizYukle(); } };
  function kisiYukle() {
    var i = istemci(); if (!i) return Promise.reject({ kod: 'kapali' });
    if (D.kisiBekle) return D.kisiBekle;
    D.kisiBekle = i.kisiler().then(function (k) { D.kisiBekle = null; D.kisiler = k; D.kisiHata = null; bildir(); return k; }, function (e) { D.kisiBekle = null; D.kisiHata = e; throw e; });
    return D.kisiBekle;
  }
  function sohbetYukle() {
    var i = istemci(); if (!i) return Promise.reject({ kod: 'kapali' });
    if (D.sohbetBekle) return D.sohbetBekle;
    D.sohbetBekle = i.sohbetleriListele().then(function (l) {
      D.sohbetBekle = null; D.sohbetYuklendi = true;
      
      l.forEach(function (s) {
        if (s.id === D.acikId) s.okunmamis = 0;
        var eski = D.sohbetler.filter(function (c) { return c.id === s.id; })[0];   
        if (eski && s.okundu) s.okundu = haritaBirles(eski.okundu, s.okundu);
        if (eski && s.teslim) s.teslim = haritaBirles(eski.teslim, s.teslim);
        if (eski && !s.okundu && eski.okundu) { s.okundu = eski.okundu; s.haritaYok = eski.haritaYok; }
        if (eski && !s.teslim && eski.teslim) s.teslim = eski.teslim;
        if (s.okundu && !eski) s.haritaYok = false;
      });
      D.sohbetler = l; bildir(); cevapsizYukle(); return l;
    }, function (e) { D.sohbetBekle = null; throw e; });
    return D.sohbetBekle;
  }
  function kisiAdiOid(oid) { if (oid === 'asistan') return T('Asistan'); var k = (D.kisiler || []).filter(function (x) { return x.oid === oid; })[0]; return k ? k.ad : ''; }
  function sohbetAdi(s) {
    if (s.ad) return s.ad;
    var me = ben().oid;
    var adlar = s.uyeler.filter(function (o) { return o !== me; }).map(kisiAdiOid).filter(Boolean);
    return adlar.join(', ') || T('Sohbet');
  }
  function bantKapat() { clearTimeout(D.bantZmn); if (D.bantEl && D.bantEl.parentNode) D.bantEl.parentNode.removeChild(D.bantEl); D.bantEl = null; }
  function sohbeteGit(id, mid) {
    D.sonPush = id; D.sonPushZmn = Date.now(); aramaYokla(id);   
    D.acilacak = id; D.acilacakMid = typeof mid === 'string' && /^[0-9]{14}-[A-Za-z0-9-]{1,64}$/.test(mid) ? mid : '';
    if (D.ac) D.ac(id); else location.hash = '#mesaj';
  }
  function bantGoster(s, m) {   
    if (typeof document === 'undefined' || document.hidden) return;
    bantKapat();
    var ad = (m.gonderen && kisiAdiOid(m.gonderen)) || sohbetAdi(s);
    var b = h('button', { sinif: 'ms-bildirim', type: 'button', role: 'status', metin: bandMetni(ad, mesajOzet(m, T)) });
    b.addEventListener('click', function () { bantKapat(); sohbeteGit(s.id); });
    D.bantEl = b; document.body.appendChild(b);
    D.bantZmn = setTimeout(bantKapat, 3000);
  }
   
  function teslimPlanla(m) {
    if (!m || !m.id || !m.sohbet) return;
    var b = D.teslimBekle[m.sohbet];
    if (b) { if (m.id > b.sonId) b.sonId = m.id; return; }
    b = D.teslimBekle[m.sohbet] = { sonId: m.id, zmn: null };
    b.zmn = setTimeout(function () {
      delete D.teslimBekle[m.sohbet];
      if (D.acikId === m.sohbet && typeof document !== 'undefined' && !document.hidden) return;
      if (b.sonId <= (D.tsGonder[m.sohbet] || '')) return;   
      var i = ist; if (!i || !i.acik()) return;
      var yolda = b.sonId; D.tsGonder[m.sohbet] = yolda;
      i.teslim(m.sohbet, yolda).then(null, function () { if (D.tsGonder[m.sohbet] === yolda) delete D.tsGonder[m.sohbet];   });
    }, 1000);
  }
  

  function gorunurAcik(sid) { return D.acikId === sid && typeof document !== 'undefined' && !document.hidden; }
  function okunduZamanla(sid) {
    var b = D.okBekle[sid]; if (!b || b.zmn || !gorunurAcik(sid)) return;
    b.zmn = setTimeout(function () { b.zmn = null; okunduAkit(sid); }, 1000);
  }
  function okunduAkit(sid) {
    var b = D.okBekle[sid]; if (!b) return;
    if (!gorunurAcik(sid)) return;   
    delete D.okBekle[sid];
    var i = ist; if (!i || !i.acik() || D.okYok) return;
    if (b.sonId <= (D.okGonder[sid] || '')) return;
    var yolda = b.sonId; D.okGonder[sid] = yolda;
    i.okundu(sid, yolda).then(null, function (e) {
      if (e && e.kod === 'yok') { D.okYok = true; return; }   
      if (D.okGonder[sid] === yolda) delete D.okGonder[sid];   
    });
  }
  function okunduIste(sid, id) {
    if (!sid || !id || D.okYok) return;
    if (id <= (D.okGonder[sid] || '')) return;
    var b = D.okBekle[sid];
    if (b) { if (id > b.sonId) b.sonId = id; } else D.okBekle[sid] = { sonId: id, zmn: null };
    okunduZamanla(sid);
  }
  function okunduBekleyenleriKur() { Object.keys(D.okBekle).forEach(okunduZamanla); }
  function haritaOlay(tur, ev) {   
    var s = D.sohbetler.filter(function (c) { return c.id === ev.sohbet; })[0];
    if (!s || !ev.oid || !ev.sonId) return false;
    if (!s.okundu) { s.okundu = {}; s.haritaYok = true; }
    if (!s.teslim) s.teslim = {};
    return haritaIleri(tur === 'okundu' ? s.okundu : s.teslim, ev.oid, ev.sonId);
  }
  function gelenMesaj(m) {
    D.sunucuToplam = -1;   
    var me = ben().oid, s = D.sohbetler.filter(function (c) { return c.id === m.sohbet; })[0];
    var baskasi = m.gonderen !== me;
    if (baskasi && !(D.acikId === m.sohbet && typeof document !== 'undefined' && !document.hidden)) teslimPlanla(m);
    if (!s) { sohbetYukle().then(function () { var y = D.sohbetler.filter(function (c) { return c.id === m.sohbet; })[0]; if (y && baskasi && D.acikId !== m.sohbet) bantGoster(y, m); }, function () {   }); return; }
    s.son = { id: m.id, ts: m.ts, gonderen: m.gonderen, ozet: mesajOzet(m, T), metin: (m.tur === 'metin' || !m.tur) ? kirp(m.metin, 80) : '', gonderenAd: '' };
    if (baskasi && D.acikId !== m.sohbet) { s.okunmamis = (s.okunmamis || 0) + 1; bantGoster(s, m); }
    D.sohbetler = siraliSohbetler(D.sohbetler);
    bildir();
  }
   
  var CIHAZ_ARALIK = 6 * 3600 * 1000;
  function cihazKaydiDene() {
    if (!iosKabuk()) return;
    var i = ist; if (!i || !i.acik() || !ben().oid) { bdYaz({ kod: !i || !i.acik() ? 'istemci_yok' : 'oid_yok' }); return; }
    var t = Date.now();
    if (t - D.cihazZaman < CIHAZ_ARALIK) return;
    D.cihazZaman = t;
    var sozu = null;
    try {
      sozu = bildirimKayit().then(function (k) { D.cihazHandle = k.handle; return i.cihazKaydet(k.platform, k.handle).then(function (r) { bdYaz({ http: '2xx', ts: bdSaat(), kod: '' })    ; return r; }, function (e) { bdYaz({ http: String((e && e.durum) || bdKod(e)), ts: bdSaat(), kod: bdKod(e) }); throw e; }); });
    } catch (e) { bdYaz({ kod: bdKod(e) }); sozu = Promise.reject(e); }
    sozu.then(null, function (e) { if (e && e.message !== 'bildirim' && !BD.kod) bdYaz({ kod: bdKod(e) }); D.cihazZaman = t - CIHAZ_ARALIK + 10 * 60 * 1000;   });
  }
   
  var ARAMA_ZIL_MS = 45000;   
  function aramaAcikMi(sohbet, aramaId, groupId) {   
    var i = ist; if (!i || !i.aramaSon) return Promise.reject(new Error('kapali'));
    return i.aramaSon(sohbet).then(function (v) { return !!v && (aramaId ? v.aramaId === aramaId : (!!groupId && v.groupId === groupId)); });
  }
  function aramaEkrani(a) {   
    var ga = gaVar(), i = ist; if (!ga || !i || !a || !a.sohbet || !a.groupId) return false;
    return ga.goster(a, {
      acikMi: function () { return aramaAcikMi(a.sohbet, a.aramaId, a.groupId); },
      kabul: function (v) { if (a.aramaId) D.aramaKapali[a.aramaId] = true; meetAc(ga.kabulAdresi(a, v)); },
      reddet: function () {
        if (a.aramaId) D.aramaKapali[a.aramaId] = true;
        if (!a.aramaId || !i.aramaReddet) return Promise.resolve();
        return i.aramaReddet(a.sohbet, a.aramaId).then(null, function () {   });
      }
    });
  }
  function aramaOlayi(ev) {   
    if (!ev || !ev.sohbet || !ev.groupId || (ev.arayan && ev.arayan === ben().oid)) return;   
    var s = D.sohbetler.filter(function (c) { return c.id === ev.sohbet; })[0], grup = !!(s && s.tur === 'grup');
    var ad = ev.arayanAd || (ev.arayan && kisiAdiOid(ev.arayan)) || (s && !grup ? sohbetAdi(s) : '');
    aramaEkrani({ sohbet: ev.sohbet, groupId: ev.groupId, aramaId: ev.aramaId || '', video: ev.video === true, ad: ad, baslik: grup ? sohbetAdi(s) : ad });   
  }
  function kendiAramaMi(sohbet) { var t = D.kendiArama[sohbet]; return !!t && Date.now() - t < 60000; }
  function aramaYokla(sohbet) {   
    var i = ist; if (!gaVar() || !i || !i.aramaSon || !sohbet || kendiAramaMi(sohbet)) return;   
    i.aramaSon(sohbet).then(function (v) {
      if (!v || !v.groupId || (v.aramaId && D.aramaKapali[v.aramaId]) || (v.arayan && v.arayan === ben().oid)) return;
      var t = epoch(v.ts), yas = Date.now() - t;
      if (isNaN(t) || yas < -5000 || yas > ARAMA_ZIL_MS) return;   
      var s = D.sohbetler.filter(function (c) { return c.id === sohbet; })[0], grup = !!(s && s.tur === 'grup');
      var ad = v.arayanAd || (v.arayan && kisiAdiOid(v.arayan)) || (s && !grup ? sohbetAdi(s) : '');
      aramaEkrani({ sohbet: sohbet, groupId: v.groupId, aramaId: v.aramaId || '', video: v.video === true, ad: ad, baslik: grup ? sohbetAdi(s) : ad });
    }, function () {   });
  }
  function toplantiCagrisi(ev) {   
    var ga = gaVar(); if (!ga || !ev || !ev.kod) return;
    if (ev.islem === 'cagri_cevap' && ev.cagriId && ev.sonuc) {   
      try { if (typeof BroadcastChannel === 'function') { var bk = new BroadcastChannel('mumu-cagri'); bk.postMessage({ islem: 'cagri_cevap', cagriId: String(ev.cagriId), sonuc: ev.sonuc === 'kabul' ? 'kabul' : 'red' }); bk.close(); } } catch (eBk) {   }
    }
    if (ev.islem === 'cagri_kapandi' || ev.islem === 'cagri_cevap' || ev.islem === 'bitti') { aramaKapat(ev); return; }
    if (ev.islem !== 'cagri' || (ev.arayan && ev.arayan === ben().oid)) return;
    var ad = ev.arayanAd || (ev.arayan && kisiAdiOid(ev.arayan)) || '';
    ga.goster({ tur: 'toplanti', kod: ev.kod, cagriId: ev.cagriId || '', sohbet: ev.sohbet || '', baslik: ad, ad: ad }, { kabul: function () { meetAc(ga.toplantiAdresi(ev.kod)); } });
  }
  function aramaKapat(ev) { var ga = gaVar(); if (ga && ev) { if (ev.sohbet) ga.kapat(ev.sohbet); if (ev.kod) ga.kapat(ev.kod); } }   
  function dokunusKur() {   
    if (D.dokunusKuruldu || typeof document === 'undefined' || !document.addEventListener) return;
    D.dokunusKuruldu = true;
    var olaylar = ['pointerdown', 'touchstart', 'keydown'];
    function ilk() {
      olaylar.forEach(function (o) { document.removeEventListener(o, ilk, true); });
      var ga = gaVar();
      if (ga && typeof ga.izinIste === 'function') { try { var p = ga.izinIste(); if (p && p.then) p.then(null, function () {   }); } catch (e) {   } }
      try {   
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) { var cx = new AC(); if (cx.resume) cx.resume(); var kay = cx.createBufferSource(); kay.buffer = cx.createBuffer(1, 1, 22050); kay.connect(cx.destination); kay.start(0); setTimeout(function () { try { cx.close(); } catch (e2) {   } }, 400); }
      } catch (e3) {   }
    }
    olaylar.forEach(function (o) { document.addEventListener(o, ilk, true); });
  }
  function arkaBaslat() {
    if (D.basladi) return;
    var i = istemci(); if (!i || !i.acik() || !ben().oid) return;
    D.basladi = true;
    D.abone.push(i.on('mesaj', gelenMesaj));
    D.abone.push(i.on('okundu', function (ev) { if (haritaOlay('okundu', ev)) bildir(); }));
    D.abone.push(i.on('teslim', function (ev) { if (haritaOlay('teslim', ev)) bildir(); }));
    D.abone.push(i.on('arama', aramaOlayi));
    D.abone.push(i.on('toplanti', toplantiCagrisi));
    ['arama_bitti', 'arama_cevap'].forEach(function (o) { D.abone.push(i.on(o, aramaKapat)); });
    D.abone.push(i.on('one', function () { if (D.sonPush && Date.now() - D.sonPushZmn < 120000) aramaYokla(D.sonPush); }));   
    dokunusKur();
    cihazKaydiDene();
    if (!D.vgDinler && typeof document !== 'undefined' && document.addEventListener) { D.vgDinler = true; document.addEventListener('visibilitychange', function () { if (!document.hidden && D.basladi) { cihazKaydiDene(); cevapsizYukle(); okunduBekleyenleriKur(); } }); }   
    ['one', 'baglandi'].forEach(function (o) { D.abone.push(i.on(o, function () { D.sunucuToplam = -1; sohbetYukle().then(null, function () {   }); })); });   
    D.abone.push(i.on('sohbet', function () { sohbetYukle().then(null, function () {   }); }));   
    ['duzenle', 'silindi'].forEach(function (o) { D.abone.push(i.on(o, function () { sohbetYukle().then(null, function () {   }); })); });   
    i.baglan().then(null, function () {   });
    kisiYukle().then(null, function () {   });
    sohbetYukle().then(null, function () {   });
  }
  function arkaSifirla() {
    D.abone.forEach(function (f) { f(); }); D.abone = []; D.basladi = false; D.sohbetler = []; D.kisiler = null; D.kisiHata = null; D.sohbetYuklendi = false; D.acikId = ''; D.acilacak = '';
    Object.keys(D.teslimBekle).forEach(function (k) { clearTimeout(D.teslimBekle[k].zmn); }); D.teslimBekle = {};
    Object.keys(D.okBekle).forEach(function (k) { clearTimeout(D.okBekle[k].zmn); }); D.okBekle = {}; D.okGonder = {}; D.tsGonder = {}; D.okYok = false;
    bantKapat(); bildir();
  }
  MM.mesaj = Object.assign(MM.mesaj || {}, API, {
    bildirimDurum: function () { return bildirimSon; },
    kabukMu: kabukMu, meetTamAdres: meetTamAdres, disAc: disAc, meetCerceveAc: meetCerceveAc, meetCerceveKapat: meetCerceveKapat,
    paylas: function (rota, bolumAd) {
      var p = paylasMetni(rota || location.hash, bolumAd);   
      if (!p) return p;
      if (acik()) { bekleyenKart = p; location.hash = '#mesaj'; }   
      return p;
    },
    arkaBaslat: arkaBaslat,
    rozetUygula: rozetUygula,
    sohbeteGit: function (id, mid) { if (typeof id === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(id)) sohbeteGit(id, mid); },   
    cikis: function () {
      var i = ist, handle = D.cihazHandle; arkaSifirla(); D.cihazZaman = 0; D.cihazHandle = '';
      if (!(i && i.acik())) return Promise.resolve(false);
      i.kapat();
      if (!iosKabuk()) return Promise.resolve(false);   
      var al = handle ? Promise.resolve(handle) : bildirimKayit().then(function (k) { return k.handle; });
      return al.then(function (h) { return i.cihazSil(h); }).then(null, function () { return false; });
    }
  });

  var HATA = { kapali: 'Mesaj kapalı', belirtec: 'Mesaj girişi alınamadı', kimlik: 'Giriş geçersiz', uye: 'İşlem yapılamadı', yok: 'Bulunamadı', gecersiz: 'Geçersiz istek', '429': 'Çok sık istek; biraz sonra deneyin', ag: 'Bağlantı yok', sunucu: 'Sunucu hatası', bos: 'Mesaj boş', uzun: 'Mesaj çok uzun', tur: 'Bu dosya türü gönderilemez', boyut: 'Dosya 25 MB\'tan büyük olamaz', foto: 'Fotoğraf işlenemedi', yukleme: 'Dosya yüklenemedi', ad: 'Grup adı yazın', 'arama-yok': 'Arama bu cihazda yok', arama: 'Arama başlatılamadı' };
  function hataYaz(e) { return T(HATA[e && e.kod] || 'Alınamadı'); }
   
  var W1_HATA = {
    duzenle: { gecersiz: 'Düzenleme süresi (15 dakika) doldu', uye: 'Bu mesajı düzenleyemezsiniz' },
    sil: { gecersiz: 'Silme süresi (48 saat) doldu', uye: 'Bu mesajı silme yetkiniz yok' },
    tepki: { gecersiz: 'Bu tepki gönderilemedi' },
    ilet: { gecersiz: 'Bu mesaj iletilemedi', uye: 'Seçilen sohbetlerden birine üye değilsiniz' },
    bilgi: { uye: 'Bilgiyi yalnız mesajı gönderen görebilir' },
    yanit: { gecersiz: 'Yanıtlanan mesaj artık yok' }
  };
  function w1HataYaz(e, islem) {
    var k = e && e.kod;
    if (k === 'w1yok') return T('Bu özellik birazdan açılacak');
    if (k === 'yok') return T('Mesaj bulunamadı');
    if (k === 'mesgul') return T('Sunucu meşgul, biraz sonra deneyin');
    if (k === 'cakisma') return T('Mesaj başka yerde değişti, tekrar deneyin');
    var o = W1_HATA[islem] && W1_HATA[islem][k];
    return o ? T(o) : hataYaz(e);
  }

   
  var IK = {   
    geri: 'M15 5l-7 7 7 7', arti: 'M12 5v14M5 12h14', ara: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4', gonder: 'M3 20l18-8L3 4v6l11 2-11 2z', mikrofon: 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM6 11a6 6 0 0012 0M12 17v4',
    kamera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 100-8 4 4 0 000 8z', video: 'M3 7h12v10H3zM15 11l6-3v8l-6-3', ahize: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
    nokta3: 'M5 12h.01M12 12h.01M19 12h.01', sag: 'M9 5l7 7-7 7', kisi: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6', grup: 'M16 11a3 3 0 100-6 3 3 0 000 6zM8 12a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5',
    hoparlorKapali: 'M11 5L6 9H3v6h3l5 4zM15.5 9.5a3.5 3.5 0 010 5M3 3l18 18', sessiz: 'M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 004 0M3 3l18 18', paylas: 'M12 3v12M8 7l4-4 4 4M5 12v8h14v-8', dosyaIk: 'M6 3h8l4 4v14H6zM14 3v4h4',
    tik: 'M5 12.5l4.5 4.5L19 7', tikcift: 'M2 12.5l4.2 4.2L15 8M9.2 14.8l1.9 1.9L21 7', saat: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2', unlem: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v5M12 16h.01',
    kapat: 'M6 6l12 12M18 6L6 18', asagi: 'M6 9l6 6 6-6', yanitla: 'M9 14L4 9l5-5M4 9h10a6 6 0 016 6v3', ilet: 'M15 14l5-5-5-5M20 9H10a6 6 0 00-6 6v3', kopya: 'M8 8h11v13H8zM5 16V3h11', kalem: 'M4 20l1-5L16 4l4 4L9 19zM14 6l4 4', cop: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13', bilgiIk: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 11v5M12 8h.01', sabit: 'M9 4h6l-1 6 3 3v2H7v-2l3-3zM12 15v6', arsiv: 'M4 5h16v4H4zM5 9v10h14V9M10 13h4', cift: 'M3 12l4 4L14 8M10 16l1 1 9-9', yenile: 'M20 12a8 8 0 11-3-6.2M20 4v5h-5', atac: 'M20.5 11.5l-8.2 8.2a5 5 0 01-7.1-7.1l8.5-8.5a3.3 3.3 0 014.7 4.7l-8.5 8.5a1.7 1.7 0 01-2.4-2.4l7.8-7.8'
  };
  function ikon(ad, boy, renk) { return MM.svg('svg', { viewBox: '0 0 24 24', width: boy || 22, height: boy || 22, fill: 'none', stroke: renk || 'currentColor', 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [MM.svg('path', { d: IK[ad] || ad })]); }
   
  var TIK_ETIKET = { bekliyor: 'Gönderiliyor', hata: 'Gönderilemedi', gonderildi: 'Gönderildi', ulasti: 'İletildi', okundu: 'Okundu' };
  function tikEl(durum) {
    if (!TIK_ETIKET[durum]) return null;
    var ad = durum === 'bekliyor' ? 'saat' : durum === 'hata' ? 'unlem' : (durum === 'ulasti' || durum === 'okundu') ? 'tikcift' : 'tik';
    return h('span', { sinif: 'ms-tik ms-tik-' + durum, role: 'img', 'aria-label': T(TIK_ETIKET[durum]) }, [ikon(ad, 16)]);
  }
  function avatar(ad, anahtar, grup, boy) {
    var a = h('span', { sinif: 'ms-av' + (grup ? ' ms-av-grup' : '') + (boy ? ' ms-av-' + boy : ''), 'aria-hidden': 'true', metin: grup ? '' : basHarf(ad) });
    if (!grup) a.style.background = avatarRengi(anahtar || ad);
    if (grup) a.appendChild(ikon('grup', boy === 'buyuk' ? 44 : 26, '#c2283d'));
    return a;
  }
  function geriDugme(fn) {
    var g = h('button', { sinif: 'ms-geri', type: 'button', 'aria-label': T('Geri') }, [ikon('geri', 22)]);
    g.addEventListener('click', fn); return g;
  }
  function yuvarlakDugme(ikonAd, etiket, fn, ekSinif) {
    var d = h('button', { sinif: 'ms-yd' + (ekSinif ? ' ' + ekSinif : ''), type: 'button', 'aria-label': etiket }, [ikon(ikonAd, 22)]);
    d.addEventListener('click', fn); return d;
  }

   
  MM.moduller.gizlilik = function (kok) {
    kok.appendChild(h('div', { sinif: 'gz-kok' }, [h('h2', { metin: T('Gizlilik') }), h('p', { sinif: 'gz-metin', metin: T(BILGI) }), h('p', { sinif: 'gz-metin gz-tik', metin: T(TIK_GIZLILIK) }), h('p', { sinif: 'gz-metin gz-tik', metin: T(MEET_CEVRIMICI) })]));
    return function () {};
  };

  MM.moduller.mesaj = function (kok) {
    var canli = true, i = istemci();
    var kap = h('div', { sinif: 'ms-kok' });
     
    var sol = h('div', { sinif: 'ms-kok ms-sol-bolme ms-ekran-liste' }), solKurulu = false;
    var mqGenis = window.matchMedia ? window.matchMedia('(min-width: 600px) and (min-height: 500px)') : null;
    function genis() { return !!(mqGenis && mqGenis.matches); }
    kok.appendChild(h('div', { sinif: 'ms-bolme' }, [kap, sol]));   
    if (!i || !i.acik()) {
      kap.appendChild(h('p', { sinif: 'veri-yok', metin: T('Mesaj kapalı') }));
      return function () { canli = false; };
    }
    arkaBaslat();
    var benOid = ben().oid || '';
    var bekleyenFoto = null;
    var secili = null, bantlar = [], cozucu = [], gorunum = 'liste', listeKut = null, bekleyenAc = D.acilacak || '';
    D.acilacak = '';
    var durum = h('p', { sinif: 'ms-durum kucuk soluk', metin: '' });
    function yaz(m) { if (canli) durum.textContent = m || ''; }
    function temizle() { if (!canli) return; kap.textContent = ''; cozucu.forEach(function (f) { f(); }); cozucu = []; if (!solKurulu) listeKut = null; }
    function ekranSinifi(s) {
      kap.className = 'ms-kok ' + s;
      var tam = s !== 'ms-ekran-liste' && !genis();   
      document.body.classList.toggle('ms-tam', tam);
      if (!tam) vvTemizle(); else vvDegisti();
    }
    function vvTemizle() { kap.style.removeProperty('--ms-vh'); kap.style.removeProperty('--ms-ust'); document.body.classList.remove('ms-klavye'); }
    function vvDegisti() {   
      var v = window.visualViewport;
      if (!canli || !v || !document.body.classList.contains('ms-tam')) return;
      var ml = kap.querySelector('.ms-mesajlar, .sohbet-akis');
      var enAlt = !!ml && (ml.scrollHeight - ml.scrollTop - ml.clientHeight < 40);
      var klavye = v.height > 120 && v.height < window.innerHeight - 80;   
      if (klavye) { kap.style.setProperty('--ms-vh', Math.round(v.height) + 'px'); kap.style.setProperty('--ms-ust', Math.round(v.offsetTop) + 'px'); }
      else { kap.style.removeProperty('--ms-vh'); kap.style.removeProperty('--ms-ust'); }
      var onceKlavye = document.body.classList.contains('ms-klavye');
      document.body.classList.toggle('ms-klavye', klavye);
      if (onceKlavye && !klavye && (window.pageYOffset || window.pageXOffset)) { try { window.scrollTo(0, 0); } catch (eS) {   } }   
      if (ml && enAlt) ml.scrollTop = ml.scrollHeight;
    }
    if (window.visualViewport) { window.visualViewport.addEventListener('resize', vvDegisti); window.visualViewport.addEventListener('scroll', vvDegisti); }
    function vvGecikmeli() { vvDegisti(); setTimeout(vvDegisti, 120); setTimeout(vvDegisti, 450); }   
    document.addEventListener('focusin', vvGecikmeli); document.addEventListener('focusout', vvGecikmeli);
    var filtre = { q: '', cip: 'tum' };
    function sohbetBul(id) { return D.sohbetler.filter(function (c) { return c.id === id; })[0]; }

     
    function bantEl() {
      var b = h('div', { sinif: 'ms-bant-kok' });
      bantlar.forEach(function (x) {
        var d = h('button', { sinif: 'ms-bant', type: 'button', metin: x.ad + ' ' + T('sizi arıyor') + (x.video ? ' (' + T('görüntülü') + ')' : '') + ' — ' + T('Katıl') });
        d.addEventListener('click', function () {
          bantlar = bantlar.filter(function (y) { return y !== x; });
          yaz(T('Aranıyor'));
          meetAc('meet/#s=' + encodeURIComponent(x.sohbet) + '&g=' + encodeURIComponent(x.groupId) + '&v=' + (x.video ? '1' : '0'));
          var s = sohbetBul(x.sohbet); if (!secili && s) sohbetGoster(s); else if (!secili) listeGoster();
        });
        b.appendChild(d);
      });
      return b;
    }
    var abonelik = [];
    abonelik.push(i.on('arama', function (ev) {
      if (!canli) return;
      var s = sohbetBul(ev.sohbet);
      if (!ev.groupId) return;
      var bantOge = { sohbet: ev.sohbet, groupId: ev.groupId, video: ev.video, ad: s ? sohbetAdi(s) : (ev.arayan || T('Sohbet')) };
      if (!gaVar()) { bantlar.push(bantOge); if (secili) return; listeGoster(); return; }   
       
      setTimeout(function () {
        if (!canli || (ev.aramaId && D.aramaKapali[ev.aramaId])) return;
        aramaAcikMi(ev.sohbet, ev.aramaId, ev.groupId).then(function (v) {
          if (!v || !canli) return;
          if (bantlar.some(function (y) { return y.groupId === bantOge.groupId; })) return;
          bantlar.push(bantOge);
          if (!secili) listeGoster();
        }, function () {   });
      }, ARAMA_ZIL_MS + 1000);
    }));

     
    function onizOnek(s) {   
      var g = s.son && s.son.gonderen; if (!g) return '';
      if (g === benOid) return s.tur === 'grup' ? T('Siz') + ': ' : '';
      return s.tur === 'grup' ? ((s.son.gonderenAd || kisiAdiOid(g) || T('Biri')) + ': ') : '';
    }
    function tercihYaz(s, alan, deger, sonra) {   
      var t = {}; t[alan] = deger;
      yaz(T('Yükleniyor'));
      i.tercih(s.id, t).then(function () { s.tercih = Object.assign({}, s.tercih || {}, t); D.sohbetler = siraliSohbetler(D.sohbetler); bildir(); yaz(''); if (sonra) sonra(); }, function (e) { yaz(hataYaz(e)); if (sonra) sonra(); });
    }
    function okunduSay(s) {   
      s.okunmamis = 0; D.sunucuToplam = -1; bildir(); if (canli && (gorunum === 'liste' || solKurulu)) { cipGuncelle(); listeIc(); }
      

      var sonId = s.son && s.son.id ? s.son.id : '';
      var bul = sonId ? Promise.resolve(sonId) : i.mesajlar(s.id, { adet: 30 }).then(function (l) {
        var m = null; (l || []).forEach(function (x) { if (x && x.id && (!m || epoch(x.ts) > epoch(m.ts))) m = x; });
        return m ? m.id : '';
      });
      bul.then(function (id) {
        if (id && id > (D.okGonder[s.id] || '')) return i.okundu(s.id, id).then(function () { if (id > (D.okGonder[s.id] || '')) D.okGonder[s.id] = id; }, function (e) { if (canli && !(e && e.kod === 'yok')) yaz(hataYaz(e));   });
      }).then(function () { cevapsizYukle(); return sohbetYukle(); }).then(null, function () {   });
    }
    function eylemMenusu(s) {   
      var kok2 = h('div', { sinif: 'ms-sheet-kok' }), t = s.tercih || {};
      function kapat() { if (kok2.parentNode) kok2.parentNode.removeChild(kok2); }
      var kutu = h('div', { sinif: 'ms-sheet', role: 'dialog' });
      function oge(ad, fn) { var b = h('button', { sinif: 'ms-sheet-oge', type: 'button', metin: T(ad) }); b.addEventListener('click', function () { kapat(); fn(); }); kutu.appendChild(b); }
      oge('Okundu olarak işaretle', function () { okunduSay(s); });
      if (s.tercih) {
        oge(t.favori ? 'Favoriden çıkar' : 'Favoriye ekle', function () { tercihYaz(s, 'favori', !t.favori); });
        oge(t.sessiz ? 'Sesi aç' : 'Bildirimleri sessize al', function () { sessizSayfasi(s, i, kap, yaz); });
        oge(t.sabit ? 'Sabitlemeyi kaldır' : 'Sabitle', function () { tercihYaz(s, 'sabit', !t.sabit); });
        oge(t.arsiv ? 'Arşivden çıkar' : 'Arşivle', function () { tercihYaz(s, 'arsiv', !t.arsiv); });
      }
      oge('Vazgeç', function () { });
      kok2.addEventListener('click', function (e) { if (e.target === kok2) kapat(); });
      kok2.appendChild(kutu); kap.appendChild(kok2);
    }
    function satirSohbet(s) {
      var grup = s.tur === 'grup', ad = sohbetAdi(s);
      var okunmamis = s.okunmamis > 0;
      var ust = h('span', { sinif: 'ms-satir-ust' }, [h('span', { sinif: 'ms-sad' + (okunmamis ? ' ms-kalin' : ''), metin: ad }), h('span', { sinif: 'ms-saat' + (okunmamis ? ' ms-saat-yeni' : ''), metin: s.son ? T(saatBicim(s.son.ts)) : '' })]);
      var benimSon = !!(s.son && benOid && s.son.gonderen === benOid && s.son.id), tikO = benimSon ? tikEl(sohbetTik(s, s.son.id, benOid)) : null;   
      var altEl = [h('span', { sinif: 'ms-ozet' + (tikO ? ' ms-ozet-tikli' : '') }, [tikO, document.createTextNode(s.son ? onizOnek(s) + onizMetni(s.son, T) : '')])];
      var rozetler = h('span', { sinif: 'ms-simge-sira' });
      if (s.tercih && s.tercih.sessiz) rozetler.appendChild(h('span', { sinif: 'ms-simge', 'aria-label': T('Sessize alındı') }, [ikon('hoparlorKapali', 16)]));
      if (s.tercih && s.tercih.sabit) rozetler.appendChild(h('span', { sinif: 'ms-simge', 'aria-label': T('Sabit') }, [ikon('sabit', 16)]));
      if (okunmamis) rozetler.appendChild(h('span', { sinif: 'ms-rozet', metin: rozetMetni(s.okunmamis) }));
      if (rozetler.childNodes.length) altEl.push(rozetler);
      var alt = h('span', { sinif: 'ms-satir-alt' }, altEl);
      var b = h('button', { sinif: 'ms-sohbet', type: 'button' }, [avatar(ad, s.id, grup, 'liste'), h('span', { sinif: 'ms-sol' }, [ust, alt])]);
      var tm = null, uzun = false, kayma = false, x0 = 0, y0 = 0, dx = 0;
       
      var eylemler = h('div', { sinif: 'ms-sat-eylem' });
      var kapsam = h('div', { sinif: 'ms-sat-kap' }, [eylemler, b]);
      if (s.tercih && 'arsiv' in s.tercih) {
        var arB = h('button', { sinif: 'ms-sat-arsivle', type: 'button', metin: s.tercih.arsiv ? T('Arşivden çıkar') : T('Arşivle') });
        arB.addEventListener('click', function () { kapsam.classList.remove('ms-acik'); tercihYaz(s, 'arsiv', !s.tercih.arsiv); });
        eylemler.appendChild(arB);
      }
      var dgB = h('button', { sinif: 'ms-sat-diger', type: 'button', metin: (secili && secili.id === s.id) ? '…' : T('Diğer'), 'aria-label': T('Diğer') });   
      dgB.addEventListener('click', function () { kapsam.classList.remove('ms-acik'); eylemMenusu(s); });
      eylemler.appendChild(dgB);
      kapsam.style.setProperty('--ms-sw', (eylemler.childNodes.length * 80) + 'px');
      b.addEventListener('touchstart', function (ev) {
        var t0 = ev.touches[0]; x0 = t0.clientX; y0 = t0.clientY; dx = 0; uzun = false; kayma = false; clearTimeout(tm);
        tm = setTimeout(function () { uzun = true; eylemMenusu(s); }, 550);
      }, { passive: true });
      b.addEventListener('touchmove', function (ev) {
        var t0 = ev.touches[0]; dx = t0.clientX - x0; var dy = t0.clientY - y0;
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) clearTimeout(tm);
        if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) kayma = true;
      }, { passive: true });
      b.addEventListener('touchend', function () {
        clearTimeout(tm);
        if (kayma) { if (dx < -50) kapsam.classList.add('ms-acik'); else if (dx > 30) kapsam.classList.remove('ms-acik'); }
      }, { passive: true });
      b.addEventListener('touchcancel', function () { clearTimeout(tm); }, { passive: true });
      b.addEventListener('contextmenu', function (ev) { ev.preventDefault(); eylemMenusu(s); });
      b.addEventListener('click', function () {
        if (uzun) { uzun = false; return; }
        if (kayma) { kayma = false; return; }
        if (kapsam.classList.contains('ms-acik')) { kapsam.classList.remove('ms-acik'); return; }
        sohbetGoster(s);
      });
      return kapsam;
    }
    var cipEl = null, aramaEl = null, araSonuc = null, araZmn = null, araKapali = false;
    function kisiSatiri(k) {   
      var av = avatar(k.ad, k.oid, false, 'liste');
      av.addEventListener('click', function (ev) { ev.stopPropagation(); kisiBilgiGoster(k.oid, k.ad, function () { listeGoster(); }); });
      var b = h('button', { sinif: 'ms-kisi', type: 'button' }, [av, h('span', { sinif: 'ms-kisi-ad', metin: k.ad })]);
      b.addEventListener('click', function () { birebirAc(k); });
      return b;
    }
    function sunucuAra() {   
      clearTimeout(araZmn);
      var q = (filtre.q || '').trim();
      if (araKapali || q.length < 2 || q.length > 64 || !i.ara) { if (araSonuc) { araSonuc = null; listeIc(); } return; }
      araZmn = setTimeout(function () {
        i.ara(q).then(function (r) { if (!canli || (filtre.q || '').trim() !== q) return; araSonuc = { q: q, kisiler: r.kisiler, sohbetler: r.sohbetler, mesajlar: r.mesajlar }; listeIc(); },
          function (e) { if (e && e.durum === 404) araKapali = true; });
      }, 300);
    }
    function cipGuncelle() {
      if (!cipEl) return;
      cipEl.textContent = '';
      var okn = D.sohbetler.filter(function (s) { return s.okunmamis > 0 && !(s.tercih && s.tercih.arsiv); }).length;
      var grp = D.sohbetler.filter(function (s) { return s.tur === 'grup' && !(s.tercih && s.tercih.arsiv); }).length;
      var fav = D.sohbetler.some(function (s) { return s.tercih && s.tercih.favori; });
      var tanim = [['tum', T('Tümü'), 0], ['okunmamis', T('Okunmamış'), okn]];
      if (fav) tanim.push(['favori', T('Favoriler'), 0]);
      tanim.push(['grup', T('Gruplar'), grp]);
      tanim.forEach(function (c) {
        var b = h('button', { sinif: 'ms-cip' + (filtre.cip === c[0] ? ' ms-cip-sec' : ''), type: 'button' }, [c[1], c[2] > 0 ? h('span', { sinif: 'ms-cip-n', metin: String(c[2]) }) : null]);
        b.addEventListener('click', function () { filtre.cip = filtre.cip === c[0] && c[0] !== 'tum' ? 'tum' : c[0]; cipGuncelle(); listeIc(); });
        cipEl.appendChild(b);
      });
    }
    function listeIc() {
      if (!canli || !listeKut) return;
      listeKut.textContent = '';
      var arsivSay = D.sohbetler.filter(function (s) { return s.tercih && s.tercih.arsiv; }).length;
      var gorunur = sohbetSuz(siraliSohbetler(D.sohbetler), filtre, sohbetAdi);
      if (filtre.cip === 'arsiv') {
        var geri = h('button', { sinif: 'ms-arsiv-sat', type: 'button' }, [ikon('geri', 20), h('span', { sinif: 'ms-arsiv-ad', metin: T('Arşivlenmiş') })]);
        geri.addEventListener('click', function () { filtre.cip = 'tum'; cipGuncelle(); listeIc(); });
        listeKut.appendChild(geri);
      } else if (arsivSay && !filtre.q) {
        var ar = h('button', { sinif: 'ms-arsiv-sat', type: 'button' }, [ikon('arsiv', 22), h('span', { sinif: 'ms-arsiv-ad', metin: T('Arşivlenmiş') }), h('span', { sinif: 'ms-arsiv-n', metin: String(arsivSay) })]);
        ar.addEventListener('click', function () { filtre.cip = 'arsiv'; cipGuncelle(); listeIc(); });
        listeKut.appendChild(ar);
      }
      var asKucuk = kucukTr(filtre.q);
      if (filtre.cip === 'tum' && (!asKucuk || kucukTr(T('Asistan')).indexOf(asKucuk) >= 0)) {   
        var asSon = MM.asistanSon && MM.asistanSon.metin ? MM.asistanSon : null;   
        var asIlk = asSon ? String(asSon.metin).split(/\r?\n/).map(function (x) { return x.replace(/\s+/g, ' ').trim(); }).filter(Boolean)[0] : '';   
        var alt = h('span', { sinif: 'ms-satir-alt' }, [h('span', { sinif: 'ms-ozet', metin: asIlk ? kirp(asIlk, 80) : T('Şirket içi yapay zekâ asistanı') }), ikon('sabit', 16)]);
        var asUst = [h('span', { sinif: 'ms-sad', metin: T('Asistan') })];
        if (asSon) asUst.push(h('span', { sinif: 'ms-saat', metin: T(saatBicim(asSon.ts)) }));
        var asistan = h('button', { sinif: 'ms-sohbet ms-asistan', type: 'button' }, [h('span', { sinif: 'ms-av ms-av-liste ms-av-asistan', 'aria-hidden': 'true' }, [ikon('kisi', 28, '#5b4bd5')]), h('span', { sinif: 'ms-sol' }, [h('span', { sinif: 'ms-satir-ust' }, asUst), alt])]);
        asistan.addEventListener('click', function () { if (MM.asistanSohbet) asistanGoster(); else location.hash = '#asistan'; });   
        if (solKurulu && gorunum === 'asistan') asistan.classList.add('ms-secili');
        listeKut.appendChild(asistan);
      }
      gorunur.forEach(function (s) { var el = satirSohbet(s); if (solKurulu && gorunum === 'sohbet' && secili && secili.id === s.id) el.classList.add('ms-secili'); listeKut.appendChild(el); });
       
      var kisiSay = 0;
      if (filtre.cip === 'tum' && Array.isArray(D.kisiler)) {
        var bosKisi = kisiSuz(D.kisiler, filtre.q || '', benOid).filter(function (k) { return k.kurulu === true && !birebirBul(D.sohbetler, k.oid); });
        if (bosKisi.length) {
          kisiSay = bosKisi.length;
          listeKut.appendChild(h('div', { sinif: 'ms-harf ms-bolum-baslik', metin: T('Kişiler') }));
          bosKisi.forEach(function (k) { listeKut.appendChild(kisiSatiri(k)); });
        }
      }
       
      var qT = (filtre.q || '').trim();
      if (qT.length >= 2 && araSonuc && araSonuc.q === qT) {
        var yerelIdler = {}; gorunur.forEach(function (s) { yerelIdler[s.id] = true; });
        var kisiIdler = {}; D.kisiler && kisiSuz(D.kisiler, filtre.q || '', benOid).forEach(function (k) { if (k.kurulu === true && !birebirBul(D.sohbetler, k.oid)) kisiIdler[k.oid] = true; });
        var yeniKisi = araSonuc.kisiler.filter(function (k) { return k.oid !== benOid && !kisiIdler[k.oid]; });
        var yeniSohbet = araSonuc.sohbetler.filter(function (c) { return !yerelIdler[c.id]; });
        if (yeniKisi.length) { listeKut.appendChild(h('div', { sinif: 'ms-harf ms-bolum-baslik', metin: T('Kişiler') })); yeniKisi.forEach(function (k) { listeKut.appendChild(kisiSatiri(k)); }); kisiSay += yeniKisi.length; }
        if (yeniSohbet.length) { listeKut.appendChild(h('div', { sinif: 'ms-harf ms-bolum-baslik', metin: T('Sohbetler') })); yeniSohbet.forEach(function (c) { var sb = sohbetBul(c.id) || c; listeKut.appendChild(satirSohbet(sb)); }); kisiSay += yeniSohbet.length; }
        if (araSonuc.mesajlar.length) {
          listeKut.appendChild(h('div', { sinif: 'ms-harf ms-bolum-baslik', metin: T('Mesajlar') })); kisiSay += araSonuc.mesajlar.length;
          araSonuc.mesajlar.forEach(function (m) {
            var sb = sohbetBul(m.sohbet), adM = sb ? sohbetAdi(sb) : T('Sohbet');
            var bm = h('button', { sinif: 'ms-sohbet ms-ara-mesaj', type: 'button' }, [avatar(adM, m.sohbet, !!(sb && sb.tur === 'grup'), 'liste'), h('span', { sinif: 'ms-sol' }, [h('span', { sinif: 'ms-satir-ust' }, [h('span', { sinif: 'ms-sad', metin: adM }), h('span', { sinif: 'ms-saat', metin: T(saatBicim(m.ts)) })]), h('span', { sinif: 'ms-satir-alt' }, [h('span', { sinif: 'ms-ozet', metin: kirp(String(m.metin || ''), 80) })])])]);
            bm.addEventListener('click', function () { if (sb) sohbetGoster(sb); });
            listeKut.appendChild(bm);
          });
        }
      }
      if (!gorunur.length && !kisiSay) {
        var yok =!D.sohbetler.length ? (D.sohbetYuklendi ? T('Henüz sohbet yok. Başlatmak için + düğmesine dokunun.') : T('Yükleniyor')) : (filtre.cip === 'arsiv' ? T('Arşivde sohbet yok') : T('Sonuç yok'));
        if (!D.sohbetler.length || filtre.q || filtre.cip !== 'tum') listeKut.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: yok }));
      }
    }
     
    function asistanGoster() {
      if (!canli || !MM.asistanSohbet) return; secili = null; gorunum = 'asistan'; D.acikId = ''; temizle(); ekranSinifi('ms-ekran-sohbet asistan-ms'); if (solKurulu) listeIc();
      var as = MM.asistanSohbet();
      var asAv = h('span', { sinif: 'ms-av ms-av-ust ms-av-asistan', 'aria-hidden': 'true' }, [ikon('kisi', 24, '#5b4bd5')]);
      var baslik = h('span', { sinif: 'ms-baslik-pill' }, [asAv, h('span', { sinif: 'ms-baslik-kutu' }, [h('strong', { sinif: 'ms-baslik', metin: T('Asistan') }), h('span', { sinif: 'ms-alt-yazi', metin: T('Şirket içi yapay zekâ asistanı') })])]);
      kap.appendChild(h('div', { sinif: 'ms-ust-cubuk ms-sohbet-ust' }, [yuvarlakDugme('geri', T('Geri'), function () { listeGoster(); }, 'ms-yd-ust'), baslik]));
      if (as.kaynak) kap.appendChild(as.kaynak);
      kap.appendChild(as.govde);
      vvDegisti();
    }
    function menuAc() {
      var kok2 = h('div', { sinif: 'ms-sheet-kok ms-menu-kok' }), kutu = h('div', { sinif: 'ms-menu' });
      function kapat() { if (kok2.parentNode) kok2.parentNode.removeChild(kok2); }
      function oge(ad, fn) { var b = h('button', { sinif: 'ms-sheet-oge', type: 'button', metin: T(ad) }); b.addEventListener('click', function () { kapat(); fn(); }); kutu.appendChild(b); }
      oge('Yeni grup', function () { grupGoster(); });
      kok2.addEventListener('click', function (e) { if (e.target === kok2) kapat(); });
      kok2.appendChild(kutu); kap.appendChild(kok2);
    }
    function bosGoster() {   
      kap.appendChild(h('div', { sinif: 'ms-bos-sag' }, [h('strong', { metin: T('Bir sohbet seçin') }), h('p', { sinif: 'soluk', metin: T('Soldaki listeden bir sohbet açın ya da yeni sohbet başlatın.') })]));
    }
    function solKur() { sol.textContent = ''; solKurulu = true; listeKut = null; listeKur(sol); }
    function listeGoster() {
      if (!canli) return; secili = null; gorunum = 'liste'; D.acikId = ''; temizle(); cevapsizGoruldu();
      if (genis()) { ekranSinifi('ms-ekran-bos'); bosGoster(); if (!solKurulu) solKur(); else { cipGuncelle(); listeIc(); } return; }
      ekranSinifi('ms-ekran-liste'); listeKur(kap);
    }
    function listeKur(lk) {
      var menuD = yuvarlakDugme('nokta3', T('Daha fazla'), menuAc), yeniD = yuvarlakDugme('arti', T('Yeni sohbet'), function () { kisiSecGoster(); }, 'ms-yd-yesil');
      var kamD = yuvarlakDugme('kamera', T('Fotoğraf'), function () { kamGirdi.click(); });
      var kamGirdi = h('input', { type: 'file', accept: 'image/*', hidden: true });
      kamGirdi.addEventListener('change', function () { var f = kamGirdi.files && kamGirdi.files[0]; kamGirdi.value = ''; if (!f) return; bekleyenFoto = f; kisiSecGoster(); });   
      lk.appendChild(h('div', { sinif: 'ms-ust-sat' }, [menuD, h('span', { sinif: 'ms-ust-sag' }, [kamD, yeniD]), kamGirdi]));
      lk.appendChild(h('h1', { sinif: 'ms-buyuk-baslik', metin: T('Mumu Talk') }));
      aramaEl = h('input', { sinif: 'ms-arama', type: 'search', placeholder: T('Ara'), 'aria-label': T('Ara'), autocomplete: 'off' });
      aramaEl.value = filtre.q;
      aramaEl.addEventListener('input', function () { filtre.q = aramaEl.value; listeIc(); sunucuAra(); });   
      lk.appendChild(h('div', { sinif: 'ms-arama-kap' }, [ikon('ara', 20), aramaEl]));
      cipEl = h('div', { sinif: 'ms-cipler', role: 'group' }); lk.appendChild(cipEl); cipGuncelle();
      lk.appendChild(bantEl());
      var bds = bdSatir(); if (bds) lk.appendChild(bds);   
      lk.appendChild(durum);   
      listeKut = h('div', { sinif: 'ms-sohbetler' }); lk.appendChild(listeKut);
      listeIc();
    }
    function listeYukle() {
      yaz(T('Yükleniyor'));
      return sohbetYukle().then(function () { yaz(''); }, function (e) { yaz(hataYaz(e)); });
    }

     
    function kisiBaslik(ad, geriFn) { return h('div', { sinif: 'ms-ust-cubuk' }, [geriDugme(geriFn), h('strong', { sinif: 'ms-ekran-ad', metin: ad })]); }
    function birebirAc(k, tekrar) {
      var var_ = birebirBul(D.sohbetler, k.oid);
      if (var_) { sohbetGoster(var_); return; }
      sohbetGoster(taslakSohbet(k.oid, k.ad));   
    }
    function taslakSohbet(oid, ad) { return { id: '', taslak: true, tur: 'bire', uyeler: [benOid, oid], ad: ad || kisiAdiOid(oid) || T('Biri'), okunmamis: 0 }; }
    var uyeOto = false;   
    function uyeHata(e, tekrar) {
      if (!canli) return;
      if (e && e.kod === 'uye') {
        if (!uyeOto) { uyeOto = true; yaz(T('Kişi listesi yenileniyor…')); kisiYukle().then(function () { if (canli && gorunum !== 'sohbet') { yaz(''); if (tekrar) tekrar(true); } },function () { yaz(T('Kişi listesi alınamadı')); if (tekrar) tekrar(false, true); }); return; }
        yaz(T('Kişi listesi alınamadı')); if (tekrar) tekrar(false, true); return;
      }
      yaz(hataYaz(e));
    }
    function kisiSecGoster() {
      if (!canli) return; secili = null; gorunum = 'yeni'; D.acikId = ''; temizle(); ekranSinifi('ms-ekran-kisi'); uyeOto = false;
      var arama = '', yenidenDugme = null;
      var ara = h('input', { sinif: 'ms-ara', type: 'search', placeholder: T('Kişi ara'), 'aria-label': T('Kişi ara') });
      var liste = h('div', { sinif: 'ms-liste' });
      function cizListe() {
        if (!canli || gorunum !== 'yeni') return;
        liste.textContent = '';
        var grupSat = h('button', { sinif: 'ms-kisi ms-kisi-grup', type: 'button' }, [h('span', { sinif: 'ms-av ms-av-liste ms-av-yesil', 'aria-hidden': 'true' }, [ikon('grup', 26, '#fff')]), h('span', { sinif: 'ms-kisi-ad', metin: T('Yeni grup') })]);
        grupSat.addEventListener('click', function () { grupGoster(); });
        liste.appendChild(grupSat);
        if (D.kisiler === null) { liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: D.kisiHata ? T('Kişi listesi alınamadı') : T('Yükleniyor') })); return; }
        var tum = kisiSuz(D.kisiler, '', benOid), g = kisiSuz(D.kisiler, arama, benOid);
        if (!tum.length) { liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Henüz kimse yok — app\'i açan iş arkadaşların burada görünecek') })); return; }
        if (!g.length) liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Kişi bulunamadı') }));
        var oncekiHarf = '';
        g.forEach(function (k) {
          var hr = harfBaslik(k.ad); if (hr !== oncekiHarf) { liste.appendChild(h('div', { sinif: 'ms-harf', metin: hr })); oncekiHarf = hr; }
          var avK = avatar(k.ad, k.oid, false, 'liste');
          avK.addEventListener('click', function (ev) { ev.stopPropagation(); kisiBilgiGoster(k.oid, k.ad, function () { kisiSecGoster(); }); });   
          var b = h('button', { sinif: 'ms-kisi', type: 'button' }, [avK, h('span', { sinif: 'ms-kisi-ad', metin: k.ad })]);
          b.addEventListener('click', function () { birebirAc(k, function (oto, goster) { if (oto) cizListe(); if (goster) retryGoster(function () { birebirAc(k); }); }); });
          liste.appendChild(b);
        });
      }
      function retryGoster(fn) {
        if (yenidenDugme && yenidenDugme.parentNode) yenidenDugme.parentNode.removeChild(yenidenDugme);
        yenidenDugme = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Yeniden dene') });
        yenidenDugme.addEventListener('click', function () { uyeOto = false; yenidenDugme.parentNode && yenidenDugme.parentNode.removeChild(yenidenDugme); yenidenDugme = null; yaz(T('Yükleniyor')); kisiYukle().then(function () { yaz(''); cizListe(); if (fn) fn(); }, function (e) { uyeHata(e, function (oto, goster) { if (goster) retryGoster(fn); }); }); });
        durum.parentNode && durum.parentNode.insertBefore(yenidenDugme, durum.nextSibling);
      }
      function yukle() {
        yaz(D.kisiler === null ? T('Yükleniyor') : '');
        kisiYukle().then(function () { yaz(''); cizListe(); }, function (e) {
          cizListe();
          if (e && e.kod === 'uye') { uyeHata(e, function (oto, goster) { if (oto) { yaz(''); cizListe(); } else if (goster) retryGoster(null); }); }
          else { yaz(hataYaz(e)); retryGoster(null); }
        });
      }
      ara.addEventListener('input', function () { arama = ara.value; cizListe(); });
      kap.appendChild(kisiBaslik(T('Yeni sohbet'), listeGoster));
      kap.appendChild(ara); kap.appendChild(durum); kap.appendChild(liste);
      cizListe(); yukle();   
    }

     
    function grupGoster() {
      if (!canli) return; secili = null; gorunum = 'grup'; D.acikId = ''; temizle(); ekranSinifi('ms-ekran-kisi');
      var seciliOid = {}, arama = '';
      var ara = h('input', { sinif: 'ms-ara', type: 'search', placeholder: T('Kişi ara'), 'aria-label': T('Kişi ara') });
      var grupAd = h('input', { sinif: 'ms-ara', type: 'text', placeholder: T('Grup adı'), 'aria-label': T('Grup adı'), maxlength: 80 });
      var sayac = h('p', { sinif: 'ms-sayac kucuk soluk', metin: '' });
      var liste = h('div', { sinif: 'ms-liste' });
      var basla = h('button', { sinif: 'ms-ac ms-ac-genis', type: 'button', metin: T('Grubu oluştur') });
      function sec() { return Object.keys(seciliOid).filter(function (k) { return seciliOid[k]; }); }
      var seciliCip = h('div', { sinif: 'ms-secili-cipler' });
      function sayacYaz() {
        var n = sec().length; sayac.textContent = n ? n + ' ' + T('kişi seçildi') : T('Gruba eklenecek kişileri seçin');
        seciliCip.textContent = '';
        sec().forEach(function (o) {
          var ad = kisiAdiOid(o), c = h('button', { sinif: 'ms-sc', type: 'button', 'aria-label': ad }, [avatar(ad, o, false, 'cip'), h('span', { sinif: 'ms-sc-ad', metin: ad.split(' ')[0] }), h('span', { sinif: 'ms-sc-x' }, [ikon('kapat', 12)])]);
          c.addEventListener('click', function () { seciliOid[o] = false; sayacYaz(); cizListe(); });
          seciliCip.appendChild(c);
        });
        seciliCip.hidden = !n;
      }
      function cizListe() {
        if (!canli || gorunum !== 'grup') return;
        liste.textContent = '';
        if (D.kisiler === null) { liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: D.kisiHata ? T('Kişi listesi alınamadı') : T('Yükleniyor') })); return; }
        var tum = kisiSuz(D.kisiler, '', benOid), g = kisiSuz(D.kisiler, arama, benOid);
        if (!tum.length) { liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Henüz kimse yok — app\'i açan iş arkadaşların burada görünecek') })); return; }
        if (!g.length) liste.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Kişi bulunamadı') }));
        g.forEach(function (k) {
          var cb = h('input', { type: 'checkbox', 'aria-label': k.ad, sinif: 'ms-isaret' }); cb.checked = !!seciliOid[k.oid];
          cb.addEventListener('change', function () { seciliOid[k.oid] = cb.checked; sayacYaz(); });
          liste.appendChild(h('label', { sinif: 'ms-kisi' }, [avatar(k.ad, k.oid, false, 'liste'), h('span', { sinif: 'ms-kisi-ad', metin: k.ad }), cb]));
        });
      }
      function olustur() {
        var l = sec();
        if (l.length < 2) { yaz(T('Grup için en az 2 kişi seçin')); return; }
        if (!grupAd.value.trim()) { yaz(T('Grup adı yazın')); return; }
        yaz(T('Açılıyor'));
        i.sohbetAc(l, grupAd.value).then(function (s) { if (!canli || !s) return; D.sohbetler = siraliSohbetler([s].concat(D.sohbetler.filter(function (c) { return c.id !== s.id; }))); bildir(); sohbetGoster(s); }, function (e) {
          if (e && e.kod === 'uye') { uyeOto = false; uyeHata(e, function (oto, goster) { if (oto) { yaz(T('Kişi listesi yenilendi, tekrar deneyin')); cizListe(); } else if (goster) { var r = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Yeniden dene') }); r.addEventListener('click', function () { uyeOto = false; r.parentNode && r.parentNode.removeChild(r); yaz(T('Yükleniyor')); kisiYukle().then(function () { yaz(''); cizListe(); }, function (e2) { uyeHata(e2, null); }); }); durum.parentNode && durum.parentNode.insertBefore(r, durum.nextSibling); } }); }
          else yaz(hataYaz(e));
        });
      }
      ara.addEventListener('input', function () { arama = ara.value; cizListe(); });
      basla.addEventListener('click', olustur);
      kap.appendChild(kisiBaslik(T('Yeni grup'), kisiSecGoster));
      kap.appendChild(seciliCip); kap.appendChild(grupAd); kap.appendChild(ara); kap.appendChild(sayac); kap.appendChild(liste); kap.appendChild(durum); kap.appendChild(basla);
      sayacYaz(); cizListe();
      kisiYukle().then(function () { cizListe(); }, function (e) { uyeOto = false; uyeHata(e, function (oto) { if (oto) cizListe(); }); });
    }

     
     
    function aramaYap(s, video) {
      yaz(T('Aranıyor'));
      D.kendiArama[s.id] = Date.now();   
      var ga = gaVar();   
      meetAc(ga && typeof ga.gidenAdres === 'function' ? ga.gidenAdres(s.id, video) : 'meet/#s=' + encodeURIComponent(s.id) + '&v=' + (video ? '1' : '0'));
    }

    

    function bilgiGoster(s) {
      if (!canli) return; secili = s; gorunum = 'bilgi'; temizle(); ekranSinifi('ms-ekran-bilgi');
      var grup = s.tur === 'grup', ad = sohbetAdi(s);
      var yonetimVar = grup && Array.isArray(s.yoneticiler), tercihVar = !!(s.tercih && typeof s.tercih === 'object');
      var benYonetici = yonetimVar && s.yoneticiler.indexOf(benOid) >= 0;
      var govde = h('div', { sinif: 'ms-bilgi-govde' });
      kap.appendChild(h('div', { sinif: 'ms-ust-cubuk ms-sohbet-ust' }, [yuvarlakDugme('geri', T('Geri'), function () { sohbetGoster(s); }, 'ms-yd-ust'), h('strong', { sinif: 'ms-ekran-ad', metin: grup ? T('Grup bilgisi') : T('Kişi bilgisi') })]));
      kap.appendChild(govde); kap.appendChild(durum);
      function satir(ikonAd, metin, fn, ek, alt) {
        var adEl = alt ? h('span', { sinif: 'ms-bilgi-ad' }, [h('span', { metin: metin }), h('small', { sinif: 'ms-bilgi-altyazi', metin: alt })]) : h('span', { sinif: 'ms-bilgi-ad', metin: metin });
        var b = h('button', { sinif: 'ms-bilgi-sat', type: 'button' }, [ikon(ikonAd, 22), adEl].concat(ek ? [ek] : []));
        b.addEventListener('click', fn); return b;
      }
      function ciz() {
        if (!canli || gorunum !== 'bilgi') return;
        govde.textContent = '';
        var ust = h('div', { sinif: 'ms-bilgi-ust' }, [avatar(ad, s.id, grup, 'buyuk'), h('h2', { sinif: 'ms-bilgi-baslik', metin: ad })]);
        if (grup) ust.appendChild(h('p', { sinif: 'ms-bilgi-alt', metin: T('Grup') + ' · ' + s.uyeler.length + ' ' + T('üye') }));
        govde.appendChild(ust);
         
        if (grup && (typeof s.aciklama === 'string' || benYonetici) && (s.aciklama || benYonetici)) {
          var ac = h('button', { sinif: 'ms-bilgi-kart ms-aciklama', type: 'button', disabled: !benYonetici }, [h('p', { sinif: 'ms-bilgi-aciklama' + (s.aciklama ? '' : ' ms-soluk'), metin: s.aciklama || T('Grup açıklaması ekle') })]);
          ac.addEventListener('click', function () { if (benYonetici) duzenle(); });
          govde.appendChild(ac);
        }
         
        govde.appendChild(h('div', { sinif: 'ms-eylem-sira' }, [
          yuvarlakKutu('video', T('Görüntülü'), function () { aramaYap(s, true); }),
          yuvarlakKutu('ahize', T('Sesli ara'), function () { aramaYap(s, false); }),
          yuvarlakKutu('paylas', T('Paylaş'), function () { if (navigator.share) navigator.share({ title: ad }).then(null, function () {   }); else yaz(T('Paylaşım bu cihazda yok')); }),
          yuvarlakKutu('ara', T('Ara'), function () { sohbetGoster(s, true); })
        ]));
         
        var sekmeler = grup ? ['uyeler', 'medya', 'ayarlar'] : ['medya', 'ayarlar'];
        var adlar = { uyeler: T('Üyeler'), medya: T('Medya'), ayarlar: T('Ayarlar') };
        var sekSira = h('div', { sinif: 'ms-sekmeler', role: 'tablist' });
        sekmeler.forEach(function (k) {
          var b = h('button', { sinif: 'ms-sekme' + (k === sekme ? ' ms-sekme-ac' : ''), type: 'button', role: 'tab', 'aria-selected': k === sekme ? 'true' : 'false', metin: adlar[k] });
          b.addEventListener('click', function () { sekme = k; ciz(); });
          sekSira.appendChild(b);
        });
        govde.appendChild(sekSira);
        var ic = h('div', { sinif: 'ms-sekme-ic' }); govde.appendChild(ic);
        if (sekme === 'uyeler' && grup) uyelerCiz(ic);
        else if (sekme === 'medya') medyaCiz(ic);
        else ayarCiz(ic);
      }
      var sekme = grup ? 'uyeler' : 'medya', medyaListe = null, medyaHata = false, uyeHepsi = false;
      function duzenle() {   
        var ad2 = h('input', { sinif: 'ms-duz-girdi', type: 'text', maxlength: 80, value: ad, 'aria-label': T('Grup adı') });
        var ac2 = h('textarea', { sinif: 'ms-duz-girdi', rows: 3, maxlength: 500, 'aria-label': T('Grup açıklaması') }); ac2.value = s.aciklama || '';
        var kaydet = h('button', { sinif: 'ms-ac ms-ac-genis', type: 'button', metin: T('Kaydet') });
        var iptal = h('button', { sinif: 'ms-ikon-yazi', type: 'button', metin: T('Vazgeç') });
        iptal.addEventListener('click', ciz);
        kaydet.addEventListener('click', function () {
          var b = { aciklama: ac2.value.trim() }; if (ad2.value.trim() && ad2.value.trim() !== ad) b.ad = ad2.value.trim();
          yaz(T('Yükleniyor'));
          i.grupBilgi(s.id, b).then(function (y) { if (b.ad) { s.ad = b.ad; ad = b.ad; } s.aciklama = (y && typeof y.aciklama === 'string') ? y.aciklama : b.aciklama; yaz(''); ciz(); }, function (e) { yaz(hataYaz(e)); });
        });
        govde.textContent = ''; govde.appendChild(h('div', { sinif: 'ms-bilgi-kart ms-duzen' }, [ad2, ac2, kaydet, iptal]));
      }
      function uyelerCiz(ic) {
        var uk = h('div', { sinif: 'ms-bilgi-kart' }, [h('div', { sinif: 'ms-bilgi-etiket' }, [h('span', { metin: s.uyeler.length + ' ' + T('üye') }), ikon('ara', 18)])]);
        if (benYonetici) uk.appendChild(satir('arti', T('Üye ekle'), function () { uyeEkleGoster(s, ciz); }));
        var gorunenUye = uyeHepsi ? s.uyeler : s.uyeler.slice(0, 10);
        gorunenUye.forEach(function (o) {
          var uad = o === benOid ? T('Siz') : (kisiAdiOid(o) || T('Biri'));
          var yon = yonetimVar && s.yoneticiler.indexOf(o) >= 0;
          var sat = h('div', { sinif: 'ms-kisi' + (o !== benOid ? ' ms-kisi-tikla' : '') }, [avatar(uad, o, false, 'liste'), h('span', { sinif: 'ms-kisi-ad', metin: uad })]);
          if (o !== benOid) sat.addEventListener('click', function (ev) { if (ev.target && ev.target.closest && ev.target.closest('.ms-ikon')) return; kisiBilgiGoster(o, uad, function () { bilgiGoster(s); }); });
          if (yon) sat.appendChild(h('span', { sinif: 'ms-yonetici', metin: T('Yönetici') }));
          if (benYonetici && o !== benOid) {
            var mn = h('button', { sinif: 'ms-ikon', type: 'button', 'aria-label': T('Üye işlemleri') + ': ' + uad }, [ikon('nokta3', 20)]);
            mn.addEventListener('click', function () { uyeMenu(o, uad, yon); });
            sat.appendChild(mn);
          }
          uk.appendChild(sat);
        });
        if (!uyeHepsi && s.uyeler.length > 10) uk.appendChild(satir('sag', T('Tümünü gör') + ' (' + s.uyeler.length + ')', function () { uyeHepsi = true; ciz(); }));
        ic.appendChild(uk);
      }
      function uyeMenu(o, uad, yon) {   
        var kok2 = h('div', { sinif: 'ms-sheet-kok' }), kutu = h('div', { sinif: 'ms-sheet', role: 'dialog' });
        function kapat() { if (kok2.parentNode) kok2.parentNode.removeChild(kok2); }
        function oge(metin, fn) { var b = h('button', { sinif: 'ms-sheet-oge', type: 'button', metin: metin }); b.addEventListener('click', function () { kapat(); fn(); }); kutu.appendChild(b); }
        if (yonetimVar) oge(yon ? T('Yöneticiliği kaldır') : T('Yönetici yap'), function () {
          yaz(T('Yükleniyor'));
          i.yonetici(s.id, o, !yon).then(function (y) {
            if (y && Array.isArray(y.yoneticiler)) s.yoneticiler = y.yoneticiler; else s.yoneticiler = yon ? s.yoneticiler.filter(function (x) { return x !== o; }) : s.yoneticiler.concat([o]);
            yaz(''); ciz();
          }, function (e) { yaz(hataYaz(e)); });
        });
        oge(T('Gruptan çıkar') + ': ' + uad, function () {
          yaz(T('Yükleniyor'));
          i.uyeCikar(s.id, o).then(function () { s.uyeler = s.uyeler.filter(function (x) { return x !== o; }); yaz(''); ciz(); }, function (e) { yaz(hataYaz(e)); });
        });
        oge(T('Vazgeç'), function () {});
        kok2.addEventListener('click', function (ev) { if (ev.target === kok2) kapat(); });
        kok2.appendChild(kutu); kap.appendChild(kok2);
      }
      function medyaCiz(ic) {
        if (medyaListe === null) {
          ic.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: medyaHata ? T('Medya yüklenemedi') : T('Yükleniyor') }));
          if (!medyaHata) i.medya(s.id).then(function (l) { medyaListe = (l || []).filter(function (m) { return m && m.dosya; }); if (canli && gorunum === 'bilgi' && sekme === 'medya') ciz(); }, function () { medyaHata = true; medyaListe = []; if (canli && gorunum === 'bilgi' && sekme === 'medya') ciz(); });
          return;
        }
        if (!medyaListe.length) { ic.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Medya yok') })); return; }
        var izgara = h('div', { sinif: 'ms-medya-izgara' }), kucukSay = 0;
        medyaListe.forEach(function (m) {
          var b = h('button', { sinif: 'ms-medya-kare', type: 'button', 'aria-label': m.dosya.ad }, [ikon('dosyaIk', 26), h('span', { sinif: 'ms-medya-ad', metin: m.dosya.ad })]);
          if (/^image\/(jpeg|png|gif|webp)$/i.test(m.dosya.mime || '') && kucukSay < 12) {   
            kucukSay++;
            i.dosyaIndir(s.id, m.dosya.blob).then(function (u) {
              if (!canli || !/^https:\/\//.test(u)) return;
              var im = document.createElement('img');
              im.className = 'ms-medya-resim'; im.alt = m.dosya.ad; im.loading = 'lazy'; im.referrerPolicy = 'no-referrer';
              im.addEventListener('load', function () { Array.prototype.slice.call(b.childNodes).forEach(function (c) { if (c !== im) b.removeChild(c); }); b.classList.add('ms-medya-resimli'); });
              im.addEventListener('error', function () { if (im.parentNode) im.parentNode.removeChild(im); });   
              b.appendChild(im);   
              im.src = u;
            }, function () {   });
          }
          b.addEventListener('click', function () { i.dosyaIndir(s.id, m.dosya.blob).then(function (u) { window.open(u, '_blank', 'noopener'); }, function (e) { yaz(hataYaz(e)); }); });
          izgara.appendChild(b);
        });
        ic.appendChild(izgara);
      }
      function ayarCiz(ic) {
        var kart = h('div', { sinif: 'ms-bilgi-kart' }), t = s.tercih || {};
        if (tercihVar) {
          if ('sessiz' in t) kart.appendChild(satir('sessiz', T('Bildirimleri sessize al'), function () { sessizSayfasi(s, i, kap, yaz, ciz); }, null, sessizAltYazi(s)));
          if ('favori' in t) kart.appendChild(satir('cift', t.favori ? T('Favoriden çıkar') : T('Favoriye ekle'), function () { tercihYaz(s, 'favori', !t.favori, ciz); }));
          if ('arsiv' in t) kart.appendChild(satir('arsiv', t.arsiv ? T('Arşivden çıkar') : T('Arşivle'), function () { tercihYaz(s, 'arsiv', !t.arsiv, ciz); }));
        }
        if (grup && benOid) kart.appendChild(satir('kapat', T('Gruptan çık'), function () {
          yaz(T('Yükleniyor'));
          i.uyeCikar(s.id, benOid).then(function () { D.sohbetler = D.sohbetler.filter(function (x) { return x.id !== s.id; }); bildir(); yaz(''); listeGoster(); listeYukle(); }, function (e) { yaz(hataYaz(e)); });
        }));
        if (kart.childNodes.length) ic.appendChild(kart); else ic.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: T('Ayar yok') }));
      }
      function yuvarlakKutu(ikonAd, etiket, fn) {
        var b = h('button', { sinif: 'ms-eylem', type: 'button' }, [ikon(ikonAd, 22), h('span', { metin: etiket })]);
        b.addEventListener('click', fn); return b;
      }
      ciz();
    }
    

    function kisiBilgiGoster(oid, adIlk, geri) {
      if (!canli || !oid) return; secili = null; gorunum = 'kisibilgi'; D.acikId = ''; temizle(); ekranSinifi('ms-ekran-bilgi ms-ekran-kisibilgi');
      var yerelK = (D.kisiler || []).filter(function (x) { return x.oid === oid; })[0];
      var bilgi = { oid: oid, ad: adIlk || (yerelK && yerelK.ad) || kisiAdiOid(oid) || T('Biri'), unvan: null, kurulu: yerelK ? yerelK.kurulu : false, ortakGruplar: [], ortakMedyaSayisi: 0, birebirSohbet: null, sessiz: null };
      var govde = h('div', { sinif: 'ms-bilgi-govde' });
      function geriGit() { if (geri) geri(); else listeGoster(); }
      kap.appendChild(h('div', { sinif: 'ms-ust-cubuk ms-sohbet-ust' }, [yuvarlakDugme('geri', T('Geri'), geriGit, 'ms-yd-ust'), h('strong', { sinif: 'ms-ekran-ad', metin: T('Kişi bilgisi') })]));
      kap.appendChild(govde); kap.appendChild(durum);
      function birebirSohbeti() {
        var yerel = bilgi.birebirSohbet ? sohbetBul(bilgi.birebirSohbet) : null;
        return yerel || birebirBul(D.sohbetler, oid);
      }
      function sohbetHazir(sonra) {   
        var var_ = birebirSohbeti(); if (var_) { sonra(var_); return; }
        yaz(T('Açılıyor'));
        i.sohbetAc([oid]).then(function (s) { if (!canli || !s) return; D.sohbetler = siraliSohbetler([s].concat(D.sohbetler.filter(function (c) { return c.id !== s.id; }))); bildir(); yaz(''); sonra(s); }, function (e) { yaz(hataYaz(e)); });
      }
      function yuvKutu(ikonAd, etiket, fn) { var b = h('button', { sinif: 'ms-eylem', type: 'button' }, [ikon(ikonAd, 22), h('span', { metin: etiket })]); b.addEventListener('click', fn); return b; }
      function satirK(ikonAd, metin, fn, ek, alt) {
        var adEl = alt ? h('span', { sinif: 'ms-bilgi-ad' }, [h('span', { metin: metin }), h('small', { sinif: 'ms-bilgi-altyazi', metin: alt })]) : h('span', { sinif: 'ms-bilgi-ad', metin: metin });
        var b = h('button', { sinif: 'ms-bilgi-sat', type: 'button' }, [ikon(ikonAd, 22), adEl].concat(ek ? [ek] : []));
        b.addEventListener('click', fn); return b;
      }
      function ciz() {
        if (!canli || gorunum !== 'kisibilgi') return;
        govde.textContent = '';
        var ust = h('div', { sinif: 'ms-bilgi-ust' }, [avatar(bilgi.ad, oid, false, 'buyuk'), h('h2', { sinif: 'ms-bilgi-baslik', metin: bilgi.ad })]);
        if (bilgi.unvan) ust.appendChild(h('p', { sinif: 'ms-bilgi-alt', metin: bilgi.unvan }));
        govde.appendChild(ust);
        govde.appendChild(h('div', { sinif: 'ms-eylem-sira' }, [
          yuvKutu('kisi', T('Mesaj'), function () { var s0 = birebirSohbeti(); if (s0) sohbetGoster(s0); else birebirAc({ oid: oid, ad: bilgi.ad }); }),
          yuvKutu('ahize', T('Sesli ara'), function () { sohbetHazir(function (s0) { aramaYap(s0, false); }); }),
          yuvKutu('video', T('Görüntülü ara'), function () { sohbetHazir(function (s0) { aramaYap(s0, true); }); })
        ]));
        var s1 = birebirSohbeti();
        var kart = h('div', { sinif: 'ms-bilgi-kart' });
        if (s1) {
          var medyaSay = bilgi.ortakMedyaSayisi > 0 ? h('span', { sinif: 'ms-bilgi-n', metin: String(bilgi.ortakMedyaSayisi) }) : null;
          kart.appendChild(satirK('kisi', T('Medya ve dosyalar'), function () { bilgiGoster(s1); }, medyaSay));
          var sessizMi = !!(s1.tercih && s1.tercih.sessiz) || (bilgi.sessiz != null && bilgi.sessiz !== false);
          kart.appendChild(satirK('sessiz', T('Bildirimleri sessize al'), function () { sessizSayfasi(s1, i, kap, yaz, ciz); }, null, sessizMi ? (sessizAltYazi(s1) || T('Sessize alındı')) : ''));
        }
        if (kart.childNodes.length) govde.appendChild(kart);
        if (bilgi.ortakGruplar.length) {
          var gk = h('div', { sinif: 'ms-bilgi-kart' }, [h('div', { sinif: 'ms-bilgi-etiket' }, [h('span', { metin: bilgi.ortakGruplar.length + ' ' + T('ortak grup') })])]);
          bilgi.ortakGruplar.forEach(function (g) {
            var sat = h('button', { sinif: 'ms-kisi', type: 'button' }, [avatar(g.ad, g.id, true, 'liste'), h('span', { sinif: 'ms-kisi-ad', metin: g.ad || T('Grup') }), g.uyeSayisi ? h('span', { sinif: 'ms-bilgi-n', metin: g.uyeSayisi + ' ' + T('üye') }) : null]);
            sat.addEventListener('click', function () { var gs = sohbetBul(g.id); if (gs) sohbetGoster(gs); });
            gk.appendChild(sat);
          });
          govde.appendChild(gk);
        }
      }
      ciz();
      if (i.kisiBilgi) i.kisiBilgi(oid).then(function (b) {
        if (!canli || gorunum !== 'kisibilgi') return;
        bilgi = Object.assign(bilgi, b, { ad: b.ad || bilgi.ad }); ciz();
      }, function () {   });
    }
    function uyeEkleGoster(s, geriye) {
      if (!canli) return; gorunum = 'uye-ekle'; temizle(); ekranSinifi('ms-ekran-kisi');
      var seciliOid = {}, liste = h('div', { sinif: 'ms-liste' }), ekle = h('button', { sinif: 'ms-ac ms-ac-genis', type: 'button', metin: T('Ekle') });
      kap.appendChild(kisiBaslik(T('Üye ekle'), function () { bilgiGoster(s); }));
      kap.appendChild(liste); kap.appendChild(durum); kap.appendChild(ekle);
      (D.kisiler || []).filter(function (k) { return s.uyeler.indexOf(k.oid) < 0 && k.oid !== benOid; }).forEach(function (k) {
        var cb = h('input', { type: 'checkbox', 'aria-label': k.ad, sinif: 'ms-isaret' });
        cb.addEventListener('change', function () { seciliOid[k.oid] = cb.checked; });
        liste.appendChild(h('label', { sinif: 'ms-kisi' }, [avatar(k.ad, k.oid, false, 'liste'), h('span', { sinif: 'ms-kisi-ad', metin: k.ad }), cb]));
      });
      ekle.addEventListener('click', function () {
        var l = Object.keys(seciliOid).filter(function (k) { return seciliOid[k]; });
        if (!l.length) { yaz(T('Gruba eklenecek kişileri seçin')); return; }
        yaz(T('Yükleniyor'));
        i.uyeEkle(s.id, l).then(function (y) { if (y && Array.isArray(y.uyeler)) s.uyeler = y.uyeler; else s.uyeler = s.uyeler.concat(l); bilgiGoster(s); }, function (e) { yaz(hataYaz(e)); });
      });
    }

     
    function sohbetGoster(s, aramaAc) {
      if (!canli) return; secili = s; gorunum = 'sohbet'; temizle(); ekranSinifi('ms-ekran-sohbet');
      s.okunmamis = 0; D.acikId = s.id; bildir();
      var grup = s.tur === 'grup', taslakBekle = null;
      var mesajlar = [], bekleyen = [], yaziyorZmn = null, uyeAd = kisiAdiOid, adEl = sohbetAdi(s);
       
      function gercekle() {
        if (!s.taslak) return Promise.resolve();
        if (taslakBekle) return taslakBekle;
        var hedef = s.uyeler.filter(function (o) { return o !== benOid; })[0], var_ = birebirBul(D.sohbetler, hedef);
        function gecis(g) { D.sohbetler = siraliSohbetler([g].concat(D.sohbetler.filter(function (c) { return c.id !== g.id; }))); bildir(); if (canli && secili === s) { s = g; secili = g; D.acikId = g.id; D.asEkran = { sohbet: g.id, ekle: ekle, ciz: ciz }; } }
        if (var_) { gecis(var_); return Promise.resolve(); }
        taslakBekle = i.sohbetAc([hedef]).then(function (g) { taslakBekle = null; if (!g) throw new Error('sohbet'); gecis(g); }, function (e) { taslakBekle = null; throw e; });
        return taslakBekle;
      }
      function altBaslangic() { return grup ? s.uyeler.filter(function (o) { return o !== benOid; }).map(function (o) { return (kisiAdiOid(o) || '').split(' ')[0]; }).filter(Boolean).concat([T('Siz')]).join(', ') : ''; }
      var altYazi = h('span', { sinif: 'ms-alt-yazi', metin: altBaslangic() });
      var goruntulu = yuvarlakDugme('video', T('Görüntülü ara'), function () { aramaYap(s, true); }, 'ms-yd-ust');
      var sesli = yuvarlakDugme('ahize', T('Sesli ara'), function () { aramaYap(s, false); }, 'ms-yd-ust');
      var baslikDugme = h('button', { sinif: 'ms-baslik-pill', type: 'button', 'aria-label': adEl }, [avatar(adEl, s.id, grup, 'ust'), h('span', { sinif: 'ms-baslik-kutu' }, [h('strong', { sinif: 'ms-baslik', metin: adEl }), altYazi])]);
      baslikDugme.addEventListener('click', function () {
        var diger = !grup && Array.isArray(s.uyeler) ? s.uyeler.filter(function (o) { return o !== benOid; })[0] : '';
        if (diger) kisiBilgiGoster(diger, adEl, function () { sohbetGoster(s); }); else bilgiGoster(s);   
      });
      kap.appendChild(h('div', { sinif: 'ms-ust-cubuk ms-sohbet-ust' }, [yuvarlakDugme('geri', T('Geri'), function () { listeGoster(); }, 'ms-yd-ust'), baslikDugme].concat(s.taslak ? [] : [goruntulu, sesli])));   
      kap.appendChild(bantEl());
       
      var filtre = '';
      var araKutu = h('input', { sinif: 'ms-ara-girdi', type: 'search', 'aria-label': T('Sohbette ara'), placeholder: T('Sohbette ara') });
      var araKapat = h('button', { sinif: 'ms-ikon', type: 'button', 'aria-label': T('Kapat') }, [ikon('kapat', 20)]);
      var araCubuk = h('div', { sinif: 'ms-ara-cubuk', hidden: !aramaAc }, [araKutu, araKapat]);
      kap.appendChild(araCubuk);
      araKutu.addEventListener('input', function () { filtre = araKutu.value.trim().toLocaleLowerCase('tr'); ciz(); });
      araKapat.addEventListener('click', function () { araKutu.value = ''; filtre = ''; araCubuk.hidden = true; ciz(); });
      var msj = h('div', { sinif: 'ms-mesajlar' }); kap.appendChild(msj);
       
      var yeniSay = 0, altaZorla = false;
      var asagiSayi = h('span', { sinif: 'ms-asagi-n', hidden: true });
      var asagiDugme = h('button', { sinif: 'ms-asagi', type: 'button', 'aria-label': T('En alta in'), hidden: true }, [ikon('asagi', 22), asagiSayi]);
      var asagiKap = h('div', { sinif: 'ms-asagi-kap' }, [asagiDugme]);
      function altaMesafe() { return msj.scrollHeight - msj.scrollTop - msj.clientHeight; }
      function asagiGuncelle() {
        var uzak = altaMesafe() > 200; if (!uzak) yeniSay = 0;
        asagiDugme.hidden = !uzak; asagiSayi.hidden = !(yeniSay > 0); asagiSayi.textContent = yeniSay > 99 ? '99+' : String(yeniSay);
      }
      msj.addEventListener('scroll', asagiGuncelle, { passive: true });
      asagiDugme.addEventListener('click', function () { yeniSay = 0; try { msj.scrollTo({ top: msj.scrollHeight, behavior: 'smooth' }); } catch (eA) { msj.scrollTop = msj.scrollHeight; } asagiGuncelle(); });
      var kutu = h('textarea', { sinif: 'ms-yaz', rows: 1, 'aria-label': T('Mesaj'), placeholder: T('Mesaj yazın'), maxlength: 4000 });
      var gon = h('button', { sinif: 'ms-gonder ms-gon-bos', type: 'button', 'aria-label': T('Gönder') }, [ikon('gonder', 22, '#fff')]);   
      var dosya = h('input', { type: 'file', accept: KABUL, hidden: true });
      var foto = h('input', { type: 'file', accept: 'image/*', hidden: true });
      var ek = h('button', { sinif: 'ms-ikon ms-ek', type: 'button', 'aria-label': T('Dosya / fotoğraf') }, [ikon('atac', 22)]);
      ek.addEventListener('click', function () { dosya.click(); });
      var kam = h('button', { sinif: 'ms-ikon', type: 'button', 'aria-label': T('Fotoğraf') }, [ikon('kamera', 22)]);
      kam.addEventListener('click', function () { foto.click(); });
      var yazKap = h('div', { sinif: 'ms-yaz-kap' }, [kutu, ek, kam]);   
      var alt = [yazKap, gon, dosya, foto];
      var altKap = h('div', { sinif: 'ms-alt' }, alt);
      function gonderGorunumu() { var yazili = !!kutu.value.trim(); gon.classList.toggle('ms-gon-bos', !yazili); kam.hidden = yazili; }   
      if (bekleyenKart) {
        var kb = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Kartı gönder') + ': ' + bekleyenKart.kart.bolum });
        kb.addEventListener('click', function () {
          var k = bekleyenKart; if (!k) return;
          gercekle().then(function () { if (s.taslak) throw new Error('sohbet'); return i.kartGonder(s.id, k.kart); }).then(function (m) { bekleyenKart = null; kb.disabled = true; if (m) ekle(m); }, function (e) { yaz(hataYaz(e)); });
        });
        kap.appendChild(kb);
      }
       
      var yanitHedef = null, duzenleHedef = null, bahisler = {};
      var seritYazi = h('div', { sinif: 'ms-serit-yazi' }), seritKapat = h('button', { sinif: 'ms-ikon', type: 'button', 'aria-label': T('Kapat') }, [ikon('kapat', 20)]);
      var serit = h('div', { sinif: 'ms-serit', hidden: true }, [seritYazi, seritKapat]);
      var bahisKutu = h('div', { sinif: 'ms-bahis-liste', role: 'listbox', hidden: true });
      function seritGuncelle() {
        seritYazi.textContent = '';
        if (duzenleHedef) { seritYazi.appendChild(h('strong', { metin: T('Mesajı düzenle') })); seritYazi.appendChild(h('span', { metin: kirp(duzenleHedef.ilk, 80) })); serit.hidden = false; }
        else if (yanitHedef) { seritYazi.appendChild(h('strong', { metin: yanitHedef.ad })); seritYazi.appendChild(h('span', { metin: yanitHedef.ozet })); serit.hidden = false; }
        else serit.hidden = true;
      }
      function seritIptal() { var duz = !!duzenleHedef; yanitHedef = null; duzenleHedef = null; if (duz) { kutu.value = ''; kutu.rows = 1; gonderGorunumu(); } seritGuncelle(); }
      seritKapat.addEventListener('click', seritIptal);
      kap.appendChild(durum); kap.appendChild(serit); kap.appendChild(bahisKutu); kap.appendChild(altKap);

      function guncelSohbet() { return sohbetBul(s.id) || s; }   
      function govdeEl(m) {
        if (m.silindi) return h('p', { sinif: 'ms-metin ms-silindi', metin: T('Bu mesaj silindi') });
        function toplantiKarti(bag) {   
          var katil = h('button', { sinif: 'ms-top-katil', type: 'button', metin: T('Katıl') });
          katil.addEventListener('click', function () { meetAc(bag); });
          return h('div', { sinif: 'ms-toplanti' }, [h('span', { sinif: 'ms-top-simge', 'aria-hidden': 'true', metin: '📹' }), h('span', { sinif: 'ms-top-ad', metin: T('Mumu Meet toplantısı') }), katil]);
        }
        if (m.tur === 'kart' && m.kart && m.kart.tur === 'toplanti') return toplantiKarti('meet/index.html#toplanti/' + m.kart.kod);
        if ((m.tur === 'metin' || !m.tur) && typeof m.metin === 'string' && toplantiBag(m.metin)) return toplantiKarti(toplantiBag(m.metin));
        if (m.tur === 'kart' && m.kart && m.kart.bolum) {   
          var d = h('button', { sinif: 'ms-kart', type: 'button', metin: m.kart.bolum });
          d.addEventListener('click', function () { location.hash = m.kart.rota; });
          return d;
        }
        if ((m.tur === 'dosya' || m.tur === 'ses') && m.dosya) {
           
          var dBoyut = Number(m.dosya.boyut) > 0 ? (m.dosya.boyut >= 1048576 ? (m.dosya.boyut / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(m.dosya.boyut / 1024)) + ' KB') : '';
          var dYazi = [h('span', { sinif: 'ms-kart-ad', metin: (m.tur === 'ses' ? T('Sesli mesaj') + ': ' : '') + m.dosya.ad })];
          if (dBoyut) dYazi.push(h('span', { sinif: 'ms-kart-boyut', metin: dBoyut }));
          var f = h('button', { sinif: 'ms-kart ms-kart-dosya', type: 'button' }, [ikon(m.tur === 'ses' ? 'mikrofon' : 'dosyaIk', 24), h('span', { sinif: 'ms-kart-yazi' }, dYazi)]);
          f.addEventListener('click', function () {
            i.dosyaIndir(s.id, m.dosya.blob).then(function (u) { window.open(u, '_blank', 'noopener'); }, function (e) { yaz(hataYaz(e)); });
          });
          return f;
        }
        var p = h('p', { sinif: 'ms-metin' });
        var bAdlar = grup && m.bahsedilen && m.bahsedilen.length ? m.bahsedilen.map(kisiAdiOid).filter(Boolean) : [];
        window.MMMesajIstemci.parcala(m.metin).forEach(function (x) {
          if (x.t === 'baglanti') { p.appendChild(h('a', { sinif: 'ms-link', href: x.v, target: '_blank', rel: 'noopener noreferrer', metin: x.v })); return; }
          bahisParcala(x.v, bAdlar).forEach(function (y) { p.appendChild(y.t === 'bahis' ? h('span', { sinif: 'ms-bahis-ad', metin: y.v }) : document.createTextNode(y.v)); });
        });
        return p;
      }
      function mesajBulId(mid) { return mesajlar.filter(function (x) { return x.id === mid; })[0] || null; }
      function mesajaKay(mid) {
        var kid = Array.prototype.filter.call(msj.children, function (e) { return e.getAttribute('data-mid') === mid; })[0];
        if (!kid) return;
        try { var kr = kid.getBoundingClientRect(), mr = msj.getBoundingClientRect(); msj.scrollTo({ top: msj.scrollTop + (kr.top - mr.top) - (msj.clientHeight - kr.height) / 2, behavior: 'smooth' }); } catch (eK) {   }   
        kid.classList.add('ms-flash'); setTimeout(function () { kid.classList.remove('ms-flash'); }, 1400);
      }
      function yanitKutusu(m) {   
        var y = m.yanit; if (!y) return null;
        var ozel = y.silindi || y.yok;
        var ad = ozel ? '' : (y.gonderen === benOid ? T('Siz') : (uyeAd(y.gonderen) || T('Biri')));
        var kt = h('button', { sinif: 'ms-yanit-kutu' + (ozel ? ' ms-yanit-ozel' : ''), type: 'button' }, [
          ad ? h('strong', { sinif: 'ms-yanit-ad', metin: ad }) : null,
          h('span', { sinif: 'ms-yanit-metin', metin: yanitOzet(y, T) })
        ]);
        if (!ozel && y.id) kt.addEventListener('click', function () { mesajaKay(y.id); });
        return kt;
      }
      function tepkiSatiri(m) {
        var oz = tepkiOzet(m.tepkiler, benOid); if (!oz.length) return null;
        return h('div', { sinif: 'ms-tepkiler' }, oz.map(function (r) {
          var b = h('button', { sinif: 'ms-tepki-rozet' + (r.benim ? ' ms-tepki-benim' : ''), type: 'button', 'aria-label': r.emoji + ' ' + r.sayi }, [h('span', { metin: r.emoji }), r.sayi > 1 ? h('span', { sinif: 'ms-tepki-sayi', metin: String(r.sayi) }) : null]);
          b.addEventListener('click', function (ev) { ev.stopPropagation(); tepkiVer(m.id, r.emoji); });
          return b;
        }));
      }
       
      function sheetKur() {
        var kok2 = h('div', { sinif: 'ms-sheet-kok' }), kutu2 = h('div', { sinif: 'ms-sheet', role: 'dialog' });
        function kapat() { if (kok2.parentNode) kok2.parentNode.removeChild(kok2); }
        kok2.addEventListener('click', function (e) { if (e.target === kok2) kapat(); });
        kok2.appendChild(kutu2); kap.appendChild(kok2);
        return { kutu: kutu2, kapat: kapat };
      }
      function ogeEkle(sh, ad, ikonAd, fn) {
        var b = h('button', { sinif: 'ms-sheet-oge ms-sheet-oge-ik', type: 'button' }, [ikonAd ? ikon(ikonAd, 20) : null, h('span', { metin: T(ad) })]);
        b.addEventListener('click', function () { sh.kapat(); if (fn) fn(); });
        sh.kutu.appendChild(b); return b;
      }
      function tepkiUygula(mid, oid, emoji) {
        var m = mesajBulId(mid); if (!m || m.silindi) return;
        var t = Object.assign({}, m.tepkiler || {});
        if (emoji) t[oid] = emoji; else delete t[oid];
        m.tepkiler = t;
      }
      function tepkiVer(mid, emoji) {
        var m = mesajBulId(mid); if (!m) return;
        var onceki = (m.tepkiler || {})[benOid] || null, yeni = onceki === emoji ? null : emoji;   
        tepkiUygula(mid, benOid, yeni); ciz();
        i.tepki(s.id, mid, yeni).then(function (t) { var x = mesajBulId(mid); if (x) { x.tepkiler = t; ciz(); } }, function (e) {
          if (!canli) return; tepkiUygula(mid, benOid, onceki); ciz(); yaz(w1HataYaz(e, 'tepki'));
        });
      }
      function metniKopyala(metin) {
        function yedek() {
          try { var ta = document.createElement('textarea'); ta.value = metin; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); yaz(T('Kopyalandı')); }
          catch (e) { yaz(T('Kopyalanamadı')); }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(metin).then(function () { yaz(T('Kopyalandı')); }, yedek); else yedek();
      }
      function silOnay(m) {
        var sh = sheetKur();
        sh.kutu.appendChild(h('p', { sinif: 'ms-sheet-soru', metin: T('Bu mesaj herkesten silinsin mi? Geri alınamaz.') }));
        ogeEkle(sh, 'Herkesten sil', 'cop', function () {
          i.herkestenSil(s.id, m.id).then(function () {
            if (!canli) return;
            var x = mesajBulId(m.id); if (x) silinmisYap(x.id, benOid); ciz();   
          }, function (e) { if (canli) yaz(w1HataYaz(e, 'sil')); });
        });
        ogeEkle(sh, 'Vazgeç', null, null);
      }
      function silinmisYap(mid, silen) {
        var m = mesajBulId(mid); if (!m) return;
        m.silindi = { ts: Date.now(), silen: silen || '' }; m.tur = 'metin'; m.metin = ''; m.kart = null; m.dosya = null; m.yanit = null; m.tepkiler = undefined; m.bahsedilen = [];
        mesajlar.forEach(function (x) { if (x.yanit && x.yanit.id === mid) x.yanit = { id: mid, silindi: true }; });
      }
      function bilgiAc(m) {
        var sh = sheetKur();
        sh.kutu.appendChild(h('p', { sinif: 'ms-sheet-soru', metin: T('Mesaj bilgisi') }));
        var ic = h('div', { sinif: 'ms-bilgi-liste' }, [h('p', { sinif: 'ms-sheet-soru soluk', metin: T('Yükleniyor') })]);
        sh.kutu.appendChild(ic);
        ogeEkle(sh, 'Kapat', null, null);
        i.mesajBilgi(s.id, m.id).then(function (l) {
          ic.textContent = '';
          if (!l.length) { ic.appendChild(h('p', { sinif: 'ms-sheet-soru soluk', metin: T('Gösterilecek kişi yok') })); return; }
          var gruplar = [['Okundu', l.filter(function (u) { return u.okundu; })], ['İletildi', l.filter(function (u) { return u.teslim && !u.okundu; })], ['Bekliyor', l.filter(function (u) { return !u.teslim && !u.okundu; })]];
          gruplar.forEach(function (g) {
            if (!g[1].length) return;
            ic.appendChild(h('div', { sinif: 'ms-bilgi-etiket', metin: T(g[0]) }));
            g[1].forEach(function (u) { ic.appendChild(h('div', { sinif: 'ms-bilgi-satir' }, [tikEl(g[0] === 'Okundu' ? 'okundu' : g[0] === 'İletildi' ? 'ulasti' : 'gonderildi'), h('span', { metin: kisiAdiOid(u.oid) || T('Biri') })])); });
          });
        }, function (e) { ic.textContent = ''; ic.appendChild(h('p', { sinif: 'ms-sheet-soru', metin: w1HataYaz(e, 'bilgi') })); });
      }
      function iletAc(m) {
        var sh = sheetKur(), secim = [];
        sh.kutu.appendChild(h('p', { sinif: 'ms-sheet-soru', metin: T('İletilecek sohbetleri seçin (en çok 5)') }));
        var lk = h('div', { sinif: 'ms-ilet-liste' });
        var tamam = h('button', { sinif: 'ms-ac', type: 'button', metin: T('İlet'), disabled: true });
        function tazele() { tamam.disabled = !secim.length; tamam.textContent = T('İlet') + (secim.length ? ' (' + secim.length + ')' : ''); }
        siraliSohbetler(D.sohbetler).forEach(function (c) {
          var r = h('button', { sinif: 'ms-ilet-satir', type: 'button', role: 'checkbox', 'aria-checked': 'false' }, [h('span', { sinif: 'ms-isaret-kutu' }), h('span', { sinif: 'ms-ilet-ad', metin: sohbetAdi(c) })]);
          r.addEventListener('click', function () {
            var ix = secim.indexOf(c.id);
            if (ix >= 0) secim.splice(ix, 1);
            else if (secim.length >= 5) { yaz(T('En çok 5 sohbet seçilebilir')); return; }
            else secim.push(c.id);
            r.classList.toggle('ms-ilet-sec', secim.indexOf(c.id) >= 0); r.setAttribute('aria-checked', secim.indexOf(c.id) >= 0 ? 'true' : 'false'); tazele();
          });
          lk.appendChild(r);
        });
        if (!D.sohbetler.length) lk.appendChild(h('p', { sinif: 'ms-sheet-soru soluk', metin: T('Sohbet yok') }));
        sh.kutu.appendChild(lk); sh.kutu.appendChild(tamam);
        tamam.addEventListener('click', function () {
          if (!secim.length) return;
          tamam.disabled = true;
          i.ilet(s.id, m.id, secim.slice()).then(function (l) {
            sh.kapat(); if (!canli) return;
            l.forEach(function (x) { if (x.sohbet === s.id) ekle(x, true); });
            yaz(T('İletildi'));
          }, function (e) { tamam.disabled = false; if (canli) yaz(w1HataYaz(e, 'ilet')); });
        });
        ogeEkle(sh, 'Vazgeç', null, null);
      }
      function yanitlaBaslat(m0) {   
        var m = mesajBulId(m0.id) || m0; if (!m || m.yerel || m.silindi || !m.id) return;
        duzenleHedef = null;
        yanitHedef = { id: m.id, ad: (!!benOid && m.gonderen === benOid) ? T('Siz') : (uyeAd(m.gonderen) || T('Biri')), ozet: mesajOzet(m, T) };
        seritGuncelle(); kutu.focus();
      }
      function mesajMenusu(m0) {
        var m = mesajBulId(m0.id) || m0;
        if (!m || m.yerel || m.silindi || !m.id) return;
        if (kap.querySelector('.ms-sheet-kok')) return;   
        var sh = sheetKur(), benim = !!benOid && m.gonderen === benOid;
        var sira = h('div', { sinif: 'ms-tepki-sira' }), mevcut = (m.tepkiler || {})[benOid] || '';
        HIZLI_TEPKI.forEach(function (e) {
          var b = h('button', { sinif: 'ms-tepki-dugme' + (mevcut === e ? ' ms-tepki-sec' : ''), type: 'button', 'aria-label': e, metin: e });
          b.addEventListener('click', function () { sh.kapat(); tepkiVer(m.id, e); });
          sira.appendChild(b);
        });
        sh.kutu.appendChild(sira);
        ogeEkle(sh, 'Yanıtla', 'yanitla', function () { yanitlaBaslat(m); });
        if (m.tur === 'metin' && m.metin) ogeEkle(sh, 'Kopyala', 'kopya', function () { metniKopyala(m.metin); });
        var asMsj = m.asistan === true || m.asistanSoru === true;   
        if (!asMsj) ogeEkle(sh, 'İlet', 'ilet', function () { iletAc(m); });
        if (!asMsj && duzenlenebilir(m, benOid)) ogeEkle(sh, 'Düzenle', 'kalem', function () {
          yanitHedef = null; duzenleHedef = { id: m.id, ilk: m.metin };
          kutu.value = m.metin; kutu.rows = Math.max(1, Math.min(5, kutu.value.split('\n').length)); gonderGorunumu(); seritGuncelle(); kutu.focus();
        });
        if (benim) ogeEkle(sh, 'Bilgi', 'bilgiIk', function () { bilgiAc(m); });
        if (silinebilir(m, guncelSohbet(), benOid)) ogeEkle(sh, 'Herkesten sil', 'cop', function () { silOnay(m); });
        ogeEkle(sh, 'Vazgeç', null, null);
      }
      function menuBagla(el, m) {   
        el.addEventListener('contextmenu', function (ev) { ev.preventDefault(); mesajMenusu(m); });
        var zmn = null, bas = null, uzun = 0;
        el.addEventListener('touchstart', function (ev) { var t = ev.touches && ev.touches[0]; bas = t ? { x: t.clientX, y: t.clientY } : null; clearTimeout(zmn); zmn = setTimeout(function () { zmn = null; uzun = Date.now(); mesajMenusu(m); }, 480); }, { passive: true });
        var kay = 0, kayHazir = false;   
        el.addEventListener('touchmove', function (ev) {
          var t = ev.touches && ev.touches[0]; if (!t || !bas) return;
          var dx = t.clientX - bas.x, dy = t.clientY - bas.y;
          if (zmn && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) { clearTimeout(zmn); zmn = null; }
          if (kay === 0 && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) kay = -1;   
          if (kay === -1) return;
          if (dx > 12 && dx > Math.abs(dy) * 1.5) { kay = 1; var g = Math.min(64, dx * 0.6); el.style.transform = 'translateX(' + g + 'px)'; kayHazir = dx >= 70; }
        }, { passive: true });
        ['touchend', 'touchcancel'].forEach(function (o) { el.addEventListener(o, function () {
          clearTimeout(zmn); zmn = null;
          if (kay === 1) { el.style.transform = ''; if (o === 'touchend' && kayHazir) { uzun = Date.now(); yanitlaBaslat(m); } }
          kay = 0; kayHazir = false;
        }, { passive: true }); });
        el.addEventListener('click', function (ev) { if (uzun && Date.now() - uzun < 700) { ev.preventDefault(); ev.stopPropagation(); } }, true);   
        var ok = h('button', { sinif: 'ms-m-ok', type: 'button', 'aria-label': T('Mesaj menüsü') }, [ikon('asagi', 16)]);
        ok.addEventListener('click', function (ev) { ev.stopPropagation(); mesajMenusu(m); });
        return ok;
      }
      function ciz() {
        if (!canli || secili !== s) return;
        var altaYakin = altaZorla || !msj.firstChild || (msj.scrollHeight - msj.scrollTop - msj.clientHeight) < 120, eskiKay = msj.scrollTop; altaZorla = false;   
        msj.textContent = '';
        var tumu = mesajlar.concat(bekleyen);   
        var gorunen = filtre ? tumu.filter(function (m) { return String(m.metin || (m.dosya && m.dosya.ad) || '').toLocaleLowerCase('tr').indexOf(filtre) >= 0; }) : tumu;
        var gs = guncelSohbet();
        if (!gorunen.length) msj.appendChild(h('p', { sinif: 'veri-yok ms-bos', metin: filtre ? T('Sonuç yok') : T('Mesaj yok') }));
        var oncekiGun = '', oncekiKim = '';
        gorunen.forEach(function (m) {
          var gun = gunEtiket(m.ts);
          if (gun && gun !== oncekiGun) { msj.appendChild(h('div', { sinif: 'ms-gun' }, [h('span', { metin: T(gun) })])); oncekiGun = gun; oncekiKim = ''; }
          if (m.tur === 'arama') { msj.appendChild(h('div', { sinif: 'ms-gun ms-arama-satir', 'data-mid': m.id || null }, [h('span', { metin: aramaMetni(m, T, saatDk(m.ts)) })])); oncekiKim = ''; return; }   
          var benim = !!benOid && m.gonderen === benOid;
          var ic = [];
          if (m.asistan && !m.yerel) {
            var yid = m.yanit && m.yanit.id, soranOid = m.yanit && m.yanit.gonderen;
            if (!soranOid && yid) { var sm = mesajlar.filter(function (x) { return x.id === yid; })[0]; if (sm) soranOid = sm.gonderen; }
            var soranAd = soranOid ? ((!!benOid && soranOid === benOid) ? T('Siz') : (uyeAd(soranOid) || T('Biri'))) : '';
            ic.push(h('span', { sinif: 'ms-gon ms-gon-asistan', metin: T('Asistan') + (soranAd ? ' · ' + soranAd + ' ' + T('sordu') : '') })); oncekiKim = '';
          }
          else if (grup && !benim && m.gonderen !== oncekiKim) { var ga = uyeAd(m.gonderen) || T('Biri'); var gEl = h('button', { sinif: 'ms-gon ms-gon-dugme', type: 'button', metin: ga }); gEl.style.setProperty('--gon', avatarRengi(m.gonderen));     gEl.addEventListener('click', function () { kisiBilgiGoster(m.gonderen, ga, function () { sohbetGoster(s); }); }); ic.push(gEl); }
          oncekiKim = m.gonderen;
          if (m.iletildi && !m.silindi) ic.push(h('span', { sinif: 'ms-etiket' }, [ikon('ilet', 12), h('span', { metin: T((m.iletimSayisi || 1) >= 5 ? 'Çok kez iletildi' : 'İletildi') })]));
          var yk = m.silindi ? null : yanitKutusu(m); if (yk) ic.push(yk);
          ic.push(govdeEl(m));
          if (m.asistan && !m.yerel && !m.silindi) ic.push(h('span', { sinif: 'ms-as-alt', metin: T('Soranın yetkisiyle · bilgi amaçlıdır, onay ya da talimat değildir') }));
          var meta = [];
          if (m.asistanSoru && !m.silindi) meta.push(h('span', { sinif: 'ms-etiket-duz ms-as-soruldu', metin: T('Asistana soruldu') }));
          if (m.duzenlendi && !m.silindi) meta.push(h('span', { sinif: 'ms-etiket-duz', metin: T('düzenlendi') }));
          meta.push(h('span', { sinif: 'ms-zmn', metin: saatDk(m.ts) }));
          if (benim && !m.silindi) meta.push(tikEl(m.yerel ? (m.durum === 'hata' ? 'hata' : 'bekliyor') : sohbetTik(gs, m.id, benOid)));
          ic.push(h('div', { sinif: 'ms-meta' }, meta));
          var tpk = m.silindi ? null : tepkiSatiri(m); if (tpk) ic.push(tpk);
          if (m.yerel && m.durum === 'hata') {
            var yd = h('button', { sinif: 'ms-tekrar', type: 'button', metin: T('Yeniden dene') });
            yd.addEventListener('click', function () { gonderBekleyen(m); });
            ic.push(yd);
          }
          var balon = h('div', { sinif: 'ms-m' + (benim ? ' ms-ben' : ' ms-karsi') + (m.yerel ? ' ms-yerel ms-yerel-' + m.durum : '') + (tpk ? ' ms-m-tepkili' : '') + (m.asistan && !m.yerel ? ' ms-m-asistan' : ''), 'data-mid': m.id || null }, ic);
          if (!m.yerel && !m.silindi && m.id) balon.appendChild(menuBagla(balon, m));
          msj.appendChild(balon);
        });
        (D.asNot[s.id] || []).forEach(function (t) { msj.appendChild(h('p', { sinif: 'ms-yerel-not', metin: t })); });   
        msj.appendChild(asagiKap);
        msj.scrollTop = altaYakin ? msj.scrollHeight : eskiKay;   
        asagiGuncelle();
      }
      if (aramaAc) setTimeout(function () { if (canli) araKutu.focus(); }, 0);
      

      function sonOkundu() {
        if (s.taslak) return;
        var enBuyuk = ''; mesajlar.forEach(function (x) { if (x && x.id && !x.yerel && x.gonderen !== benOid && x.id > enBuyuk) enBuyuk = x.id; });
        if (enBuyuk) okunduIste(s.id, enBuyuk);
      }
      var ESLEME_MS = 60000;   
      function bekleyenKaldir(b) { var ix = bekleyen.indexOf(b); if (ix >= 0) bekleyen.splice(ix, 1); }
      function bekleyenEsle(m) {   
        if (m.istemciId) { var b1 = bekleyen.filter(function (b) { return b.istemciId === m.istemciId; })[0]; if (b1) return b1; return null; }
        if (m.gonderen !== benOid || m.tur !== 'metin') return null;
        var t = Date.now();
        return bekleyen.filter(function (b) { return b.metin === String(m.metin || '').trim() && t - b.ts <= ESLEME_MS; })[0] || null;
      }
      function ekle(m, eslemeYok) {
        var b = eslemeYok ? null : bekleyenEsle(m); if (b) bekleyenKaldir(b);   
        if (mesajlar.some(function (x) { return x.id === m.id || (m.istemciId && x.istemciId === m.istemciId); })) { ciz(); return; }
        var yukarda = !!msj.firstChild && altaMesafe() > 120, benimM = !!benOid && m.gonderen === benOid;
        if (benimM) altaZorla = true;   
        mesajlar.push(m); mesajlar = sirala(mesajlar); ciz(); sonOkundu();
        if (yukarda && !benimM && !m.yerel && !eslemeYok) { yeniSay++; asagiGuncelle(); }
      }
      function sirala(l) { return l.slice().sort(function (a, b) { return epoch(a.ts) - epoch(b.ts) || 0; }); }
      var yenidenDugme = null;
      function toplantiMesajiAc() {   
        var mid = D.acilacakMid; if (!mid) return; D.acilacakMid = '';
        var m = mesajBulId(mid); if (!m || m.silindi) return;
        mesajaKay(mid);
        var bag = m.tur === 'kart' && m.kart && m.kart.tur === 'toplanti' ? 'meet/index.html#toplanti/' + m.kart.kod : ((m.tur === 'metin' || !m.tur) && typeof m.metin === 'string' ? toplantiBag(m.metin) : '');
        if (bag) meetAc(bag);
      }
      function yukle() {
        yaz(T('Yükleniyor'));
        i.mesajlar(s.id, { adet: 30 }).then(function (l) { yaz(''); if (!canli || secili !== s) return; mesajlar = sirala(l); ciz(); sonOkundu(); toplantiMesajiAc(); }, function (e) {
          if (!canli || secili !== s) return;
          yaz(e && e.kod === 'uye' ? T('Sohbet yüklenemedi') : hataYaz(e));
          if (!yenidenDugme) { yenidenDugme = h('button', { sinif: 'ms-ac', type: 'button', metin: T('Yeniden dene') }); yenidenDugme.addEventListener('click', function () { yenidenDugme.parentNode && yenidenDugme.parentNode.removeChild(yenidenDugme); yenidenDugme = null; yukle(); }); durum.parentNode && durum.parentNode.insertBefore(yenidenDugme, durum.nextSibling); }
        });
      }
       
      var yenileSurer = false, yenileTekrar = false;
      function yenile() {
        if (s.taslak || !canli || secili !== s) return;
        if (yenileSurer) { yenileTekrar = true; return; }
        yenileSurer = true;
        i.mesajlar(s.id, { adet: 30 }).then(function (l) {
          yenileSurer = false;
          if (canli && secili === s) {
            var degisti = false;
            l.forEach(function (m) {
              var ix = -1; mesajlar.forEach(function (x, k) { if (ix < 0 && (x.id === m.id || (m.istemciId && x.istemciId === m.istemciId))) ix = k; });
              if (ix < 0) { var b = bekleyenEsle(m); if (b) bekleyenKaldir(b); mesajlar.push(m); degisti = true; }
              else if (!mesajlar[ix].yerel && JSON.stringify(mesajlar[ix]) !== JSON.stringify(m)) { mesajlar[ix] = m; degisti = true; }   
            });
            if (degisti) { mesajlar = sirala(mesajlar); ciz(); sonOkundu(); }
          }
          if (yenileTekrar) { yenileTekrar = false; yenile(); }
        }, function () { yenileSurer = false; yenileTekrar = false;   });
      }
      cozucu.push(i.on('one', yenile));
      cozucu.push(i.on('baglandi', yenile));
      cozucu.push(i.on('one', function () { sonOkundu(); okunduBekleyenleriKur(); }));   
       
      cozucu.push(i.on('mesaj', function (m) { if (m.sohbet === s.id) ekle(m); }));
      cozucu.push(i.on('okundu', function (ev) { if (ev.sohbet === s.id) { haritaOlay('okundu', ev); ciz(); } }));   
      cozucu.push(i.on('teslim', function (ev) { if (ev.sohbet === s.id) { haritaOlay('teslim', ev); ciz(); } }));
      cozucu.push(i.on('tepki', function (ev) { if (ev.sohbet !== s.id) return; tepkiUygula(ev.mid, ev.oid, ev.emoji); ciz(); }));   
      cozucu.push(i.on('duzenle', function (nm) {
        if (nm.sohbet && nm.sohbet !== s.id) return;
        var ix = -1; mesajlar.forEach(function (x, k) { if (x.id === nm.id) ix = k; });
        if (ix >= 0 && !mesajlar[ix].silindi) { mesajlar[ix] = nm; ciz(); }
      }));
      cozucu.push(i.on('silindi', function (ev) { if (ev.sohbet !== s.id) return; silinmisYap(ev.mid, ev.silen); if (yanitHedef && yanitHedef.id === ev.mid) { yanitHedef = null; seritGuncelle(); } if (duzenleHedef && duzenleHedef.id === ev.mid) seritIptal(); ciz(); }));
      cozucu.push(i.on('yaziyor', function (ev) {
        if (ev.sohbet !== s.id || ev.oid === benOid) return;
        altYazi.textContent = (grup ? (uyeAd(ev.oid) || T('Biri')) + ' ' : '') + T('yazıyor…');
        clearTimeout(yaziyorZmn); yaziyorZmn = setTimeout(function () { if (canli) altYazi.textContent = altBaslangic(); }, 4000);
      }));
      cozucu.push(function () { clearTimeout(yaziyorZmn); });
      kutu.addEventListener('input', function () {
        kutu.rows = Math.max(1, Math.min(5, kutu.value.split('\n').length));
        gonderGorunumu();
        if (!s.taslak) i.yaziyor(s.id).then(null, function () {   });
      });
       
      function gonderBekleyen(b) {
        b.durum = 'bekliyor'; ciz();
        i.metinGonder(s.id, b.metin, b.istemciId, (b.yanitId || b.asistan || (b.bahsedilen && b.bahsedilen.length)) ? { yanit: b.yanitId, bahsedilen: b.bahsedilen, asistan: b.asistan === true } : null).then(function (m) {
          if (!canli) return;
          bekleyenKaldir(b);
          if (m) ekle(m, true); else ciz();
          if (m && b.asistan && grup) {   
            if (m.asistanSoru) asGrupBaslat(s.id, m, typeof m.metin === 'string' ? m.metin : b.metin); else yaz(T('Asistan bu grupta birazdan açılacak'));
          }
          if (m && ((b.yanitId && !m.yanit) || (b.bahsedilen && b.bahsedilen.length && !(m.bahsedilen && m.bahsedilen.length)))) yaz(T('Bu özellik birazdan açılacak'));   
        }, function (e) {
          if (!canli) return;
          b.durum = 'hata'; ciz(); yaz(b.yanitId ? w1HataYaz(e, 'yanit') : hataYaz(e));
        });
      }
      function duzenleKaydet(t) {
        var dh = duzenleHedef; if (!dh) return;
        if (t === dh.ilk) { seritIptal(); return; }
        kutu.disabled = true;
        i.duzenle(s.id, dh.id, t).then(function (nm) {
          kutu.disabled = false; if (!canli) return;
          var ix = -1; mesajlar.forEach(function (x, k) { if (x.id === dh.id) ix = k; });
          if (ix >= 0 && nm && nm.id) mesajlar[ix] = nm;
          seritIptal(); ciz();
        }, function (e) { kutu.disabled = false; if (canli) yaz(w1HataYaz(e, 'duzenle')); });   
      }
      function gonder() {
        var t = kutu.value.trim();
        if (!t) { kutu.focus(); return; }   
        if (duzenleHedef) { duzenleKaydet(t); return; }
        if (s.taslak) {   
          yaz(T('Açılıyor'));
          gercekle().then(function () { yaz(''); if (!s.taslak) gonder(); }, function (e) { if (canli) yaz(hataYaz(e)); });
          return;
        }
        var b = { yerel: true, durum: 'bekliyor', istemciId: i.yeniIstemciId ? i.yeniIstemciId() : '', metin: t, tur: 'metin', gonderen: benOid, ts: Date.now(), id: '' };
        if (!b.istemciId) delete b.istemciId;
        if (yanitHedef) {
          var kay = mesajBulId(yanitHedef.id);
          b.yanitId = yanitHedef.id;
          b.yanit = kay && !kay.silindi ? { id: kay.id, gonderen: kay.gonderen, tur: kay.tur, metin: kay.metin } : { id: yanitHedef.id, yok: true };
        }
        if (grup) {   
          var bl = []; Object.keys(bahisler).forEach(function (ad) {
            if (t.indexOf('@' + ad) < 0) return;
            if (bahisler[ad] === 'asistan') { b.asistan = true; return; }   
            if (bl.indexOf(bahisler[ad]) < 0 && bl.length < 20) bl.push(bahisler[ad]);
          });
          if (bl.length) { b.bahsedilen = bl; }
          if (/(^|\s)@Asistan(\s|$|[.,?!:;])/i.test(t)) b.asistan = true;   
        }
        bekleyen.push(b);
        yanitHedef = null; bahisler = {}; bahisKapat(); seritGuncelle();
        kutu.value = ''; kutu.rows = 1; gonderGorunumu(); yaz('');
        altaZorla = true; gonderBekleyen(b);
      }
      gon.addEventListener('click', gonder);
       
      function bahisKapat() { bahisKutu.hidden = true; bahisKutu.textContent = ''; }
      function bahisGuncelle() {
        if (!grup || duzenleHedef) { bahisKapat(); return; }
        var q = bahisSorgu(kutu.value, kutu.selectionStart);
        if (!q) { bahisKapat(); return; }
        var adaylar = kisiSuz(s.uyeler.map(function (o) { return { oid: o, ad: kisiAdiOid(o) }; }).filter(function (k) { return k.ad; }), q.sorgu, benOid).slice(0, 8);
        if (!q.sorgu || kucukTr('Asistan').indexOf(kucukTr(q.sorgu)) === 0) adaylar.unshift({ oid: 'asistan', ad: 'Asistan' });   
        bahisKutu.textContent = '';
        if (!adaylar.length) { bahisKapat(); return; }
        adaylar.forEach(function (k) {
          var b = h('button', { sinif: 'ms-bahis-oge', type: 'button', role: 'option' }, [avatar(k.ad, k.oid, false, 'cip'), h('span', { metin: k.ad })]);
          b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });   
          b.addEventListener('click', function () {
            var imlec = kutu.selectionStart == null ? kutu.value.length : kutu.selectionStart;
            kutu.value = kutu.value.slice(0, q.bas) + '@' + k.ad + ' ' + kutu.value.slice(imlec);
            bahisler[k.ad] = k.oid; bahisKapat(); gonderGorunumu(); kutu.focus();
            var yeni = q.bas + k.ad.length + 2; try { kutu.setSelectionRange(yeni, yeni); } catch (e) {   }
          });
          bahisKutu.appendChild(b);
        });
        bahisKutu.hidden = false;
      }
      kutu.addEventListener('input', bahisGuncelle);
      kutu.addEventListener('keyup', function (ev) { if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') bahisGuncelle(); });
      kutu.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { if (!bahisKutu.hidden) bahisKapat(); else if (yanitHedef || duzenleHedef) seritIptal(); } });
       
      var dokunmatik = false; try { dokunmatik = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); } catch (e) { dokunmatik = false; }
      kutu.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter' || ev.isComposing || ev.keyCode === 229) return;
        if (ev.shiftKey) return;
        if (dokunmatik && !(ev.ctrlKey || ev.metaKey)) return;
        if (!bahisKutu.hidden) {   
          var ilkAday = bahisKutu.querySelector('.ms-bahis-oge');
          if (ilkAday) { ev.preventDefault(); ilkAday.click(); return; }
        }
        ev.preventDefault(); gonder();
      });
      kutu.addEventListener('paste', function (ev) {   
        var it = ev.clipboardData && ev.clipboardData.items, f = null, k;
        if (!it) return;
        for (k = 0; k < it.length; k++) { if (it[k].kind === 'file' && /^image\//.test(it[k].type)) { f = it[k].getAsFile(); break; } }
        if (!f) return;
        ev.preventDefault();
        dosyaSecildi({ files: [f], value: '' });
      });
      function dosyaSecildi(inp) {
        var f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
        yaz(T('Yükleniyor'));
        var resim = /^image\//.test(f.type);
        gercekle().then(function () { if (s.taslak) throw new Error('sohbet'); return resim ? i.fotografTemizle({ ad: f.name, boyut: f.size, mime: f.type, veri: f }) : { ad: f.name, boyut: f.size, mime: f.type, veri: f }; })
          .then(function (d) { return i.dosyaYukle(s.id, d); })
          .then(function (m) { yaz(''); if (m) ekle(m); }, function (e) { yaz(hataYaz(e)); });
      }
      dosya.addEventListener('change', function () { dosyaSecildi(dosya); });
      foto.addEventListener('change', function () { dosyaSecildi(foto); });
      D.asEkran = { sohbet: s.id, ekle: ekle, ciz: ciz };
      ciz();
      if (!s.taslak) {
        yukle();
        sohbetYukle().then(function () { if (canli && secili === s) ciz(); }, function () {   });   
      }
      if (bekleyenFoto) { var bf = bekleyenFoto; bekleyenFoto = null; dosyaSecildi({ files: [bf], value: '' }); }
    }

     
    function durumDegisti() { if (canli && (gorunum === 'liste' || solKurulu)) { cipGuncelle(); listeIc(); } acilacaksa(); }
     
    if (mqGenis) {
      var mqDegisti = function () {
        if (!canli) return;
        sol.textContent = ''; solKurulu = false; listeKut = null;
        if (genis()) solKur();
        if (gorunum === 'sohbet' && secili) sohbetGoster(secili); else if (gorunum === 'asistan') asistanGoster(); else listeGoster();
      };
      if (mqGenis.addEventListener) mqGenis.addEventListener('change', mqDegisti); else if (mqGenis.addListener) mqGenis.addListener(mqDegisti);
    }
     
    var cekY = null;
    kap.addEventListener('touchstart', function (e) { cekY = (gorunum === 'liste' && (window.scrollY || 0) <= 0 && e.touches.length === 1) ? e.touches[0].clientY : null; }, { passive: true });
    kap.addEventListener('touchend', function (e) { if (cekY === null) return; var dy = e.changedTouches[0].clientY - cekY; cekY = null; if (dy > 90 && gorunum === 'liste') listeYukle(); }, { passive: true });
    function acilacaksa() { if (!bekleyenAc) return; var s = sohbetBul(bekleyenAc); if (s) { bekleyenAc = ''; sohbetGoster(s); } }
    D.dinleyen.push(durumDegisti);
    MM.asistanDegisti = durumDegisti;   
    D.ac = function (id) { bekleyenAc = id; D.acilacak = ''; acilacaksa(); if (bekleyenAc && canli) listeYukle(); };

    listeGoster();
    acilacaksa();
    if (!D.basladi) i.baglan().then(null, function (e) { yaz(hataYaz(e)); });   
    listeYukle();
    if (D.kisiler === null) kisiYukle().then(null, function () {   });
    return function () {
      canli = false; cozucu.forEach(function (f) { f(); }); abonelik.forEach(function (f) { f(); });
      var tamdiK = document.body.classList.contains('ms-tam') || document.body.classList.contains('ms-klavye');
      document.body.classList.remove('ms-tam'); document.body.classList.remove('ms-klavye'); kap.style.removeProperty('--ms-vh'); kap.style.removeProperty('--ms-ust');
      if (tamdiK && (window.pageYOffset || window.pageXOffset)) { try { window.scrollTo(0, 0); } catch (eS2) {   } }   
      if (window.visualViewport) { window.visualViewport.removeEventListener('resize', vvDegisti); window.visualViewport.removeEventListener('scroll', vvDegisti); }
      document.removeEventListener('focusin', vvGecikmeli); document.removeEventListener('focusout', vvGecikmeli);
      D.acikId = ''; D.ac = null; D.asEkran = null; MM.asistanDegisti = null; var ix = D.dinleyen.indexOf(durumDegisti); if (ix >= 0) D.dinleyen.splice(ix, 1);   
    };
  };
})();
