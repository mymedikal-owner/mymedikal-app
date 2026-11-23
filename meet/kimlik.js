


(function () {
  'use strict';
  var A = window.MM_AYAR || {};
  var pca = null, hesap = null, durum = 'bekliyor';

  function yerelUygulama() {
    try { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); } catch (e) { return false; }
  }
  function sinir(ms) { return new Promise(function (_, red) { setTimeout(function () { red(new Error('zaman_asimi')); }, ms); }); }

   
  async function hazirla() {
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
    if (!pca || !hesap) throw new Error('giris_yok');
    var istek = { scopes: [A.mesaj.apiKapsam], account: hesap };
    if (window.msal.CacheLookupPolicy) istek.cacheLookupPolicy = window.msal.CacheLookupPolicy.AccessTokenAndRefreshToken;   
    var s = await Promise.race([pca.acquireTokenSilent(istek), sinir(15000)]);
    if (!s || !s.accessToken) throw new Error('belirtec_yok');
    return s.accessToken;
  }

  function oid() {
    var c = hesap && hesap.idTokenClaims;
    return (c && c.oid) || (hesap && hesap.localAccountId) || '';
  }
  function ad() { return (hesap && hesap.name) || 'Katılımcı'; }

  window.MeetKimlik = { hazirla: hazirla, belirtecAl: belirtecAl, oid: oid, ad: ad, yerelUygulama: yerelUygulama, durum: function () { return durum; } };
})();
