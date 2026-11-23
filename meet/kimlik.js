





(function () {
  'use strict';
  var A = window.MM_AYAR || {};
  var pca = null, hesap = null, durum = 'bekliyor';
  var cerceve = false, kimlik = { oid: '', ad: '' };

   
  function ebeveyn() {
    try {
      if (window.parent === window) return null;
      var p = window.parent;
      if (p.location.origin !== location.origin) return null;
      return (p.MM && p.MM.mesaj && typeof p.MM.mesaj.belirtecAl === 'function') ? p : null;
    } catch (e) { return null; }
  }
  function kapsam(eb) {   
    var m = (A.mesaj && A.mesaj.apiKapsam) || (eb && eb.MM_AYAR && eb.MM_AYAR.mesaj && eb.MM_AYAR.mesaj.apiKapsam);
    return m ? String(m) : '';
  }
  function jwtTalep(t) {
    try {
      var b = String(t).split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      return JSON.parse(decodeURIComponent(escape(atob(b))));
    } catch (e) { return {}; }
  }
   
  function tani(asama, kod) {
    try {
      if (window.parent === window) return;
      var m = { tur: 'meet-tani', asama: String(asama) };
      if (kod) m.kod = String(kod).slice(0, 40);
      window.parent.postMessage(m, location.origin);
    } catch (e) {   }
  }
  function kapat() { try { if (window.parent !== window) window.parent.postMessage({ tur: 'meet-kapat' }, location.origin); } catch (e) {   } }

  function yerelUygulama() {
    if (cerceve || ebeveyn()) return false;   
    try { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); } catch (e) { return false; }
  }
  function sinir(ms) { return new Promise(function (_, red) { setTimeout(function () { red(new Error('zaman_asimi')); }, ms); }); }

   
  async function hazirla() {
    var eb = ebeveyn();
    var kap = eb ? kapsam(eb) : '';
    if (eb && kap) {
      try {
        var t = await Promise.race([eb.MM.mesaj.belirtecAl([kap]), sinir(15000)]);
        if (!t) throw new Error('belirtec_yok');
        var c = jwtTalep(t); kimlik = { oid: c.oid || '', ad: c.name || '' };
        cerceve = true; durum = 'tamam'; tani('belirtec_ok'); return durum;
      } catch (e) { tani('belirtec_yok', e && e.message);   }
    }
    if (yerelUygulama()) { durum = 'yerel'; return durum; }
    if (!window.msal || !window.msal.PublicClientApplication) { durum = 'msal-yok'; return durum; }
    if (!A.clientId || !A.tenantId || !A.mesaj || !A.mesaj.url || !A.mesaj.apiKapsam) { durum = 'ayar-yok'; return durum; }
    try {
      var yonlendirme = new URL('../', location.href).href;   
      pca = new window.msal.PublicClientApplication({
        auth: { clientId: String(A.clientId).trim(), authority: 'https://login.microsoftonline.com/' + String(A.tenantId).trim(), redirectUri: yonlendirme, postLogoutRedirectUri: yonlendirme, navigateToLoginRequestUrl: false },
        cache: { cacheLocation: 'localStorage' }
      });
      await pca.initialize();
      hesap = pca.getActiveAccount() || pca.getAllAccounts()[0] || null;
    } catch (e) { hesap = null; }
    durum = hesap ? 'tamam' : 'giris-yok';
    return durum;
  }

  async function belirtecAl() {
    if (cerceve) {
      var eb = ebeveyn();
      if (!eb) throw new Error('giris_yok');
      var tk = await Promise.race([eb.MM.mesaj.belirtecAl([kapsam(eb)]), sinir(15000)]);
      if (!tk) throw new Error('belirtec_yok');
      return tk;
    }
    if (!pca || !hesap) throw new Error('giris_yok');
    var istek = { scopes: [A.mesaj.apiKapsam], account: hesap };
    if (window.msal.CacheLookupPolicy) istek.cacheLookupPolicy = window.msal.CacheLookupPolicy.AccessTokenAndRefreshToken;   
    var s = await Promise.race([pca.acquireTokenSilent(istek), sinir(15000)]);
    if (!s || !s.accessToken) throw new Error('belirtec_yok');
    return s.accessToken;
  }

  function oid() {
    if (cerceve) return kimlik.oid;
    var c = hesap && hesap.idTokenClaims;
    return (c && c.oid) || (hesap && hesap.localAccountId) || '';
  }
  function ad() { if (cerceve) return kimlik.ad || 'Katılımcı'; return (hesap && hesap.name) || 'Katılımcı'; }

  window.MeetKimlik = { hazirla: hazirla, belirtecAl: belirtecAl, oid: oid, ad: ad, tani: tani, kapat: kapat, cerceve: function () { return cerceve; }, yerelUygulama: yerelUygulama, durum: function () { return durum; } };
})();
