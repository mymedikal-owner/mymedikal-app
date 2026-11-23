





(function () {
  'use strict';
  var A = window.MM_AYAR || {};
  var cap = window.Capacitor;
  var native = !!(cap && cap.isNativePlatform && cap.isNativePlatform());
  var ios = native && cap.getPlatform && cap.getPlatform() === 'ios';
  var P = ios && cap.Plugins && cap.Plugins.MMBildirim;
  if (!P) return;   

  var ANAHTAR = 'mm_bildirim_son';           
  var ARALIK = 6 * 3600 * 1000;
  var yapiliyor = false, bitti = false;

   
  function kodYaz(k) {
    try { if (window.MM_bildirimKod) window.MM_bildirimKod(k); else (window.MM_bildirimKodBekleyen = window.MM_bildirimKodBekleyen || []).push(String(k).slice(0, 24)); } catch (e) {   }
  }
  function sonYazim() { try { return +localStorage.getItem(ANAHTAR) || 0; } catch (e) { return 0; } }
  function sonYazimKaydet() { try { localStorage.setItem(ANAHTAR, String(Date.now())); } catch (e) {   } }

   
  var izinSozu = null;
  window.MMBildirimIzin = function () {
    if (!izinSozu) { izinSozu = Promise.resolve(P.izinIste()); setTimeout(function () { izinSozu = null; }, 20000); }
    return izinSozu;
  };

  async function ozet(metin) {
    var d = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metin))), s = '';
    for (var i = 0; i < 8; i++) s += (d[i] < 16 ? '0' : '') + d[i].toString(16);   
    return s;
  }

  async function dosyayaYaz(upn, belirtec) {
    var V = window.MMVeri, hedef = String(A.bildirimDriveId || '').trim();   
    if (!hedef) return 'yok';   
    if (!V || typeof V.cihazBelirteciYaz !== 'function') { kodYaz('f_ayar'); return 'ayar'; }
    var ad = await ozet(upn);
    var govde = JSON.stringify({ surum: 1, upn: upn, rol: A.girisRol || 'calisan', belirtec: belirtec, ortam: 'production', platform: 'ios', ts: new Date().toISOString() });
    return V.cihazBelirteciYaz(ad, govde, hedef);   
  }

  async function kayit() {
    if (yapiliyor || bitti) return;
    var upn = String(A.girisUpn || '').trim().toLowerCase();
    if (!upn || A.girisMisafir || A.mod !== 'graph') return;   
    if (Date.now() - sonYazim() < ARALIK) { bitti = true; return; }
    yapiliyor = true;
    try {
      var s = await window.MMBildirimIzin();
      if (!s || s.durum !== 'var' || !s.belirtec) { kodYaz('f_' + String((s && (s.neden || s.durum)) || 'izin_yok').replace(/[^A-Za-z0-9_]/g, '').slice(0, 20)); if (s && s.durum === 'red') bitti = true; return; }
      var sonuc = await dosyayaYaz(upn, s.belirtec);
      if (sonuc === 'tamam') { sonYazimKaydet(); bitti = true; }
      else if (sonuc === 'yok') { bitti = true; }
      else if (sonuc === 'yetki') { console.warn('bildirim', 'yazma yetkisi yok'); kodYaz('f_yetki'); bitti = true; }   
    } catch (e) { console.warn('bildirim', String((e && (e.code || e.message)) || 'hata').slice(0, 40)); kodYaz('f_' + String((e && (e.code || e.message)) || 'hata').replace(/[^A-Za-z0-9_]/g, '').slice(0, 20)); }
    finally { yapiliyor = false; }
  }

   
  function rotayaGit(rota, sohbet, toplanti) {
    if (rota === 'fabrika') { location.hash = '#fabrika'; return; }
    if (rota !== 'mesaj') return;
    var M = window.MM && window.MM.mesaj;
    var mid = toplanti && typeof toplanti.mid === 'string' && /^[0-9]{14}-[A-Za-z0-9-]{1,64}$/.test(toplanti.mid) ? toplanti.mid : '';   
    if (typeof sohbet === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(sohbet) && M && typeof M.sohbeteGit === 'function') M.sohbeteGit(sohbet, mid);
    else location.hash = '#mesaj';
  }

  try { P.addListener('bildirimAcildi', function (o) { rotayaGit(o && o.rota, o && o.sohbet, o && o.toplanti); }); } catch (e) { kodYaz('dinleyici'); }
  setTimeout(function () {
    try { P.bekleyenRota().then(function (o) { if (o && o.rota) rotayaGit(o.rota, o.sohbet, o.toplanti); }).catch(function () { kodYaz('rota_bekleyen'); }); } catch (e) { kodYaz('rota_bekleyen'); }
  }, 1500);

  
  var BEKLEME = [5000, 15000, 45000], deneme = 0;
  function planla() {
    if (bitti || deneme >= BEKLEME.length) return;
    setTimeout(function () {
      deneme++;
      Promise.resolve(kayit()).catch(function () { kodYaz('f_kayit'); }).then(planla);
    }, BEKLEME[deneme]);
  }
  planla();
})();
