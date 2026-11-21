










(function () {
  'use strict';
  var A = window.MM_AYAR || {}, MM = window.MM, V = window.MMVeri;
  if (!MM || !V) return;
  var KAPSAM = ['User.Read', 'Sites.Selected'];
  var ROL_SIRASI = ['yonetim', 'finans', 'muhasebe', 'satis', 'fabrika', 'kalite', 'eldiven-finans', 'calisan'];
  var CEREZ_ADI = 'msal.cache.encryption';   
  var tema = document.getElementById('tema'), sag = tema && tema.parentNode;
  if (!sag || V.mod() !== 'graph') return;   

  

  var demoDugme = null, demoYigin = null;
  if (A.demo === true && typeof V.demoAc === 'function') {
    demoDugme = document.createElement('button'); demoDugme.id = 'demo-ac'; demoDugme.type = 'button'; demoDugme.className = 'giris-dugme demo-dugme';
    var demoEtiket = document.createElement('span'); demoEtiket.className = 'giris-metin'; demoEtiket.textContent = MM.t('Demo'); demoDugme.appendChild(demoEtiket);
    demoDugme.title = MM.t('Örnek verilerle gezin'); demoDugme.setAttribute('aria-label', MM.t('Örnek verilerle gezin'));
    demoYigin = document.createElement('div'); demoYigin.className = 'giris-yigin'; demoYigin.appendChild(demoDugme);   
    sag.insertBefore(demoYigin, tema);
    demoDugme.addEventListener('click', function () {
      if (V.demo()) { V.demoKapat(); location.replace(location.pathname); return; }
      V.demoAc(); A.rol = 'yonetim';
      var s = document.createElement('div'); s.id = 'demo-serit'; s.setAttribute('role', 'status');
      s.textContent = MM.t('ÖRNEK VERİ / SAMPLE DATA');
      document.body.appendChild(s); document.body.classList.add('demo-kip');
      var g = document.getElementById('giris'); if (g) g.hidden = true;
      demoEtiket.textContent = MM.t('Demodan çık'); demoDugme.title = MM.t('Demodan çık'); demoDugme.setAttribute('aria-label', MM.t('Demodan çık'));
      window.addEventListener('pagehide', function () { if (V.demo()) V.demoKapat(); });
      var yenile = function () { if (MM.menuYenile) MM.menuYenile(); };
      if (MM.bayrakYenile) Promise.resolve(MM.bayrakYenile()).catch(function () {   }).then(yenile); else yenile();
    });
  }

  var dugme = document.createElement('button');
  dugme.id = 'giris'; dugme.type = 'button'; dugme.className = 'giris-dugme';
  var etiket = document.createElement('span'); etiket.className = 'giris-metin';
  dugme.appendChild(etiket);
  if (demoYigin) demoYigin.appendChild(dugme); else sag.insertBefore(dugme, tema);
  function durum(metin, baslik, bos) { etiket.textContent = metin; dugme.title = baslik || metin; dugme.setAttribute('aria-label', baslik || metin); dugme.classList.toggle('giris-yok', !!bos); }

  var native = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  var yapilandi = !!(String(A.clientId || '').trim() && String(A.tenantId || '').trim());
  var http = /^https?:$/.test(location.protocol) || native;
  if (!yapilandi) { durum('Giriş yapılandırılmadı', 'Giriş şu an kullanılamıyor', true); dugme.disabled = true; return; }
  if (!window.msal || !window.msal.PublicClientApplication || !http) { durum('Giriş kullanılamıyor', 'Giriş bu ortamda kullanılamıyor', true); dugme.disabled = true; return; }

  
  var yonlendirme = native ? location.origin : location.origin + location.pathname.replace(/[^\/]*$/, '');
  var pca = null;

  function hesapAyarla(hesap) {
    var talep = (hesap && hesap.idTokenClaims) || {};
    var upn = String(talep.preferred_username || (hesap && hesap.username) || '').trim().toLowerCase();
    var roller = Array.isArray(talep.roles) ? talep.roles.map(function (r) { return String(r).toLowerCase(); }) : [];
    var gruplar = Array.isArray(talep.groups) ? talep.groups.map(function (g) { return String(g).trim().toLowerCase(); }) : [];   
    var rol = 'calisan', rg = A.rolGruplari || {};
    for (var i = 0; i < ROL_SIRASI.length; i++) {   
      var ad = ROL_SIRASI[i], listeli = Array.isArray(rg[ad]) ? rg[ad] : [];
      if (roller.indexOf(ad) >= 0 || listeli.some(function (g) { return gruplar.indexOf(String(g).trim().toLowerCase()) >= 0; })) { rol = ad; break; }
    }
    A.girisUpn = upn; A.girisRol = rol; A.girisGruplar = gruplar;
    A.girisOid = String(talep.oid || '').trim().toLowerCase();   
    A.girisAd = String(talep.name || '').trim().slice(0, 80);   
    var iss = String(talep.iss || ''), tid = String(talep.tid || ''), ev = String(A.tenantId || '').trim().toLowerCase();
    var eposta = String(talep.email || '').trim().toLowerCase(), ALANLAR = (Array.isArray(A.sirketAlanlari) && A.sirketAlanlari.length ? A.sirketAlanlari : ['mymedikal.com.tr']).map(function (d) { return String(d).trim().toLowerCase(); }), EV_ALAN = { test: function (s) { return ALANLAR.some(function (d) { return s.length > d.length + 1 && s.slice(-(d.length + 1)) === '@' + d; }); } };
    A.girisMisafir = talep.acct === 1 || /#ext#/.test(upn) || !EV_ALAN.test(upn) || (!!eposta && !EV_ALAN.test(eposta)) ||   
 (!!tid && !!ev && tid.toLowerCase() !== ev) || (!!iss && !!ev && iss.toLowerCase().indexOf(ev) < 0);   
    durum(upn ? upn.split('@')[0] : 'Giriş yapıldı', (upn || 'Hesap') + ' — çıkış için dokunun', false);
    dugme.classList.add('giris-acik');
    if (demoDugme && !V.demo()) demoDugme.hidden = true;   
  }
  function cikisAyarla() {
    if (demoDugme) demoDugme.hidden = false;
    A.girisUpn = ''; A.girisOid = ''; A.girisAd = ''; A.girisRol = ''; A.girisGruplar = []; A.girisMisafir = false; dugme.classList.remove('giris-acik');
    durum('Giriş', 'Giriş yap', false);
  }

  
  var sistem = native && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === 'ios' && window.Capacitor.Plugins && window.Capacitor.Plugins.MMGiris;
  var SSO_KEY = 'mm_sso_deneme', SSO_ARALIK = 10 * 60 * 1000, bekleyen = null, bekleyenZorla = null, bant = null;
  var hazir = null;
  var webSessizHak = false;   
  var IZ_KEY = 'mm_web_giris_izi';   
  var geciciler = [];   

  
  var kopruKuruldu = false, kopruHata = false, saklikAnahtar = '';
  function zamanAsimi(ms) { return new Promise(function (_, red) { setTimeout(function () { red(new Error('zaman_asimi')); }, ms); }); }
  function kodKisa(e) { return String((e && (e.errorCode || e.code || e.message)) || 'hata').replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 24); }
  async function kopruKur() {   
    if (kopruKuruldu) return true;
    var s;
    try { s = await Promise.race([sistem.anahtarOku(), zamanAsimi(2000)]); } catch (e) { return false; }
    if (!s || (s.durum !== 'var' && s.durum !== 'yok')) return false;
    if (s.durum === 'var' && !String(s.deger || '')) return false;
    var ozgun = (typeof Document !== 'undefined') && Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    if (!ozgun || !ozgun.get || !ozgun.set) return false;
    saklikAnahtar = s.durum === 'var' ? String(s.deger) : '';
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: function () {
        var c = ozgun.get.call(document);
        return saklikAnahtar ? (c ? c + '; ' : '') + CEREZ_ADI + '=' + encodeURIComponent(saklikAnahtar) : c;
      },
      set: function (v) {
        var t = String(v), ilk = t.split(';')[0], i = ilk.indexOf('='), ad = '';
        try { ad = i < 0 ? '' : decodeURIComponent(ilk.slice(0, i)).trim(); } catch (e) { ad = ''; }
        if (ad !== CEREZ_ADI) { ozgun.set.call(document, v); return; }   
        var deger = '';
        try { deger = decodeURIComponent(ilk.slice(i + 1)); } catch (e) { deger = ''; }
        var son = /expires=([^;]+)/i.exec(t), gecmis = !!son && Date.parse(son[1]) < Date.now();
        if (!deger || gecmis) { saklikAnahtar = ''; sistem.anahtarSil().catch(function (e) { console.warn('anahtar-sil', kodKisa(e)); }); }
        else { saklikAnahtar = deger; sistem.anahtarYaz({ deger: deger }).catch(function (e) { console.warn('anahtar-yaz', kodKisa(e)); }); }
      }
    });
    kopruKuruldu = true;
    return true;
  }

  function sistemYonlendir(url) {   
    sistem.ac({ url: url }).then(function (donus) {
      var s = String((donus && donus.url) || '');
      var i = s.indexOf('#');   
      if (i < 0) i = s.indexOf('?');
      return pca.handleRedirectPromise(i >= 0 ? s.slice(i) : '').then(function (sonuc) {
        if (sonuc && sonuc.account) {
          sistemYonlendir.yenile = false;
          try { localStorage.removeItem(SSO_KEY); } catch (e) {   }
          geciciler.length = 0; V.tokenDurumu = ''; bantGizle();
          return girisSonrasi(sonuc.account);   
        }
        location.reload();   
      });
    }).catch(function (e) {
      console.warn('giris-sistem', String((e && (e.code || e.message || e.errorCode)) || 'hata').slice(0, 40));   
      location.reload();   
    });
    return false;
  }

  
  
  
  
  function bantGoster(kod) {
    if (!document.body) return;
    if (!bant) {
      bant = document.createElement('button'); bant.type = 'button'; bant.id = 'oturum-yenile'; bant.setAttribute('role', 'alert');
      bant.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:99999;padding:14px 16px;font:inherit;font-size:15px;font-weight:600;border:0;border-radius:12px;background:#c0392b;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.3);';
      bant.addEventListener('click', function () { bant.textContent = 'Yenileniyor…'; interaktifYenile(); });
      document.body.appendChild(bant);
    }
    bant.textContent = 'Oturumu yenile — dokunun' + (kod ? ' (' + kod + ')' : '');   
  }
  function bantGizle() { if (bant) { bant.remove(); bant = null; } }
  function interaktifYenile() {   
    var hesap = pca && pca.getActiveAccount();
    var istek = { scopes: KAPSAM, responseMode: 'query' };
    if (hesap) istek.account = hesap;
    if (sistem) { istek.onRedirectNavigate = sistemYonlendir; sistemYonlendir.yenile = true; }
    try { pca.acquireTokenRedirect(istek); } catch (e) { bantGoster(kodKisa(e)); }
  }
  async function sessizDene(hesap, zorla) {   
    var istek = { scopes: KAPSAM, account: hesap, forceRefresh: !!zorla };
    if (sistem && window.msal.CacheLookupPolicy) istek.cacheLookupPolicy = window.msal.CacheLookupPolicy.AccessTokenAndRefreshToken;   
    try {
      var s = await Promise.race([pca.acquireTokenSilent(istek), zamanAsimi(sessizSinir())]);   
      var bit = 0; try { bit = s.expiresOn ? new Date(s.expiresOn).getTime() : 0; } catch (e2) { bit = 0; }
      return { t: s.accessToken, agdan: s.fromCache === false, bit: bit || 0 };
    } catch (e) {
      var IR = window.msal.InteractionRequiredAuthError;
      return { sinif: (IR && e instanceof IR) ? 'kimlik' : 'gecici', kod: kodKisa(e) };
    }
  }
  function geciciKaydet(kod) {
    V.tokenDurumu = 'gecici';
    var n = Date.now(); geciciler.push(n); if (geciciler.length > 3) geciciler.shift();
    if (geciciler.length >= 3 && n - geciciler[0] >= 2 * 60 * 1000 && navigator.onLine !== false) bantGoster(kod);
  }
  function yetkiTazele() {   
    var hesap = pca && pca.getActiveAccount();
    if (!hesap) return;
    var once = JSON.stringify([A.girisRol || '', (A.girisGruplar || []).slice().sort()]);
    hesapAyarla(hesap);
    if (JSON.stringify([A.girisRol || '', (A.girisGruplar || []).slice().sort()]) !== once) {
      Promise.resolve().then(function () { return MM.bayrakYenile && MM.bayrakYenile(); }).catch(function () {   }).then(function () { if (MM.menuYenile) MM.menuYenile(); });
    }
  }
  function sessizSinir() { return Number(A.sessizSiniriMs) > 0 ? Number(A.sessizSiniriMs) : 8000; }
  function tokenSinir() { return Number(A.tokenSiniriMs) > 0 ? Number(A.tokenSiniriMs) : 12000; }
  var sonBitis = 0;   
  function basari(r) {
    if (r.bit) sonBitis = r.bit;
    geciciler.length = 0; V.tokenDurumu = ''; bantGizle(); webSessizHak = false;
    if (r.agdan) yetkiTazele();
    return r.t;
  }
  async function tokenAl(sistemIzni, zorla) {
    if (!pca && hazir) await hazir;   
    if (!pca) { if (kopruHata) V.tokenDurumu = 'gecici'; return null; }   
    var hesap = pca.getActiveAccount();
    if (!hesap) return null;
    var r = await sessizDene(hesap, !!zorla);
    if (r.t) return basari(r);
    if (r.sinif === 'gecici') { geciciKaydet(r.kod); return null; }
    if (!zorla) {   
      r = await sessizDene(hesap, true);
      if (r.t) return basari(r);
      if (r.sinif === 'gecici') { geciciKaydet(r.kod); return null; }
    }
    V.tokenDurumu = 'kimlik';
    var simdi = Date.now(), son = 0;
    try { son = parseInt(localStorage.getItem(SSO_KEY) || '0', 10) || 0; } catch (e) {   }
    if (!native && !sistem && webSessizHak && simdi - son > SSO_ARALIK) {   
      webSessizHak = false;
      try { localStorage.setItem(SSO_KEY, String(simdi)); } catch (e) {   }
      try { pca.acquireTokenRedirect({ scopes: KAPSAM, account: hesap, prompt: 'none', responseMode: 'query' }); } catch (e) { bantGoster(kodKisa(e)); }
      return null;
    }
    if (sistem && sistemIzni && simdi - son > SSO_ARALIK) {
      try { localStorage.setItem(SSO_KEY, String(simdi)); } catch (e) {   }
      sistemYonlendir.yenile = true;
      try { pca.acquireTokenRedirect({ scopes: KAPSAM, account: hesap, prompt: 'none', responseMode: 'query', onRedirectNavigate: sistemYonlendir }); } catch (e) { bantGoster(kodKisa(e)); }
      return null;   
    }
    bantGoster('kimlik-' + (r.kod || 'x'));
    return null;
  }
  
  function sinirliToken(p) {
    var zt;
    var sinir = new Promise(function (c) { zt = setTimeout(function () { V.tokenDurumu = 'gecici'; c(null); }, tokenSinir()); });
    return Promise.race([p, sinir]).then(function (t) { clearTimeout(zt); return t; }, function () { clearTimeout(zt); return null; });
  }
  V.tokenSaglayici = function (zorla) {   
    if (zorla === true) {
      if (!bekleyenZorla) { var pz = bekleyenZorla = sinirliToken(tokenAl(true, true)).then(function (t) { if (bekleyenZorla === pz) bekleyenZorla = null; return t; }); }
      return bekleyenZorla;
    }
    if (bekleyenZorla) return bekleyenZorla;
    if (!bekleyen) { var pb = bekleyen = sinirliToken(tokenAl(true)).then(function (t) { if (bekleyen === pb) bekleyen = null; return t; }); }
    return bekleyen;
  };
  function onIsit(oneGelme) {   
    if (!pca) { if (kopruHata) baslat(); return; }
    if (!pca.getActiveAccount()) return;
    if (oneGelme === true && !native) webSessizHak = true;
    var kotu = !!V.tokenDurumu, dolacak = !!sonBitis && sonBitis - Date.now() < 10 * 60 * 1000;
    if (kotu || dolacak) {   
      V.tokenSaglayici(true).then(function (t) { if (t && MM.menuYenile) MM.menuYenile(); });
      return;
    }
    V.tokenSaglayici();
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) onIsit(true); });
  setInterval(function () { if (!document.hidden) onIsit(); }, 20 * 60 * 1000);
  try {
    var capApp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (capApp && capApp.addListener) capApp.addListener('appStateChange', function (d) { if (d && d.isActive) onIsit(); });
  } catch (e) {   }
  

  async function kapsamliTokenAl(kapsamlar) {
    var kap = (Array.isArray(kapsamlar) ? kapsamlar : [kapsamlar]).map(function (k) { return String(k || '').trim(); }).filter(Boolean);
    if (!kap.length) throw new Error('kapsam');
    if (!pca && hazir) await hazir;
    var hesap = pca && pca.getActiveAccount();
    if (!hesap) throw new Error('giris_yok');
    var istek = { scopes: kap, account: hesap };
    if (sistem && window.msal.CacheLookupPolicy) istek.cacheLookupPolicy = window.msal.CacheLookupPolicy.AccessTokenAndRefreshToken;
    var s = await Promise.race([pca.acquireTokenSilent(istek), zamanAsimi(sessizSinir())]);
    if (!s || !s.accessToken) throw new Error('belirtec_yok');
    return s.accessToken;
  }
  MM.mesaj = Object.assign(MM.mesaj || {}, { belirtecAl: kapsamliTokenAl });
  window.MMGirisSinama = { tokenAl: tokenAl, kapsamliTokenAl: kapsamliTokenAl };   

  
  function yerelTemizle() {
    try { sessionStorage.clear(); } catch (e) {   }
    try { localStorage.removeItem(SSO_KEY); localStorage.removeItem(IZ_KEY); localStorage.removeItem('mm_siparis_son_aramalar'); localStorage.removeItem('mm-okunan'); Object.keys(localStorage).forEach(function (k) { if (k.indexOf('mm-dmo-fiyat-') === 0) localStorage.removeItem(k); }); } catch (e) {   }
    var isler = [];
    try { if (window.caches) isler.push(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); })); } catch (e) {   }
    try { if (window.indexedDB) isler.push(new Promise(function (c) { var r = indexedDB.deleteDatabase('mm-nakliye-yukle'); r.onsuccess = r.onerror = r.onblocked = function () { c(); }; })); } catch (e) {   }
    return Promise.all(isler).catch(function () {   });
  }
  dugme.addEventListener('click', function () {
    if (!pca) { baslat(); return; }
    var hesap = pca.getActiveAccount();
    if (hesap) {
      
      bantGizle(); geciciler.length = 0; V.tokenDurumu = '';
      try { if (MM.mesaj && MM.mesaj.cikis) MM.mesaj.cikis(); } catch (e) {   }   
      try { localStorage.removeItem(SSO_KEY); } catch (e) {   }
      if (sistem) {
        
        var cikisSozu = Promise.resolve().then(function () { return pca.logoutRedirect({ account: hesap, onRedirectNavigate: function () { return false; } }); });
        saklikAnahtar = '';
        cikisAyarla();
        cikisSozu.catch(function (e) { console.warn('cikis', kodKisa(e)); })
          .then(function () { return sistem.anahtarSil(); })
          .catch(function (e) { console.warn('anahtar-sil', kodKisa(e)); })
          .then(function () { location.reload(); });
      }
      else {
        
        var yonlen = function () { pca.logoutRedirect({ account: hesap, postLogoutRedirectUri: yonlendirme }); };
        if (native) yonlen(); else yerelTemizle().then(yonlen, yonlen);
      }
    } else {
      var istek = { scopes: KAPSAM, responseMode: 'query' };   
      if (sistem) { istek.prompt = 'select_account'; istek.onRedirectNavigate = sistemYonlendir; }
      pca.loginRedirect(istek);
    }
  });

  async function girisSonrasi(hesap) {
    pca.setActiveAccount(hesap);
    hesapAyarla(hesap);
    if (!native) { try { localStorage.setItem(IZ_KEY, '1'); } catch (e) {   } }   
    try { await MM.bayrakYenile(); } catch (e) {   }
    if (MM.menuYenile) MM.menuYenile();
  }

  var baslatSozu = null, hazirCoz = null;
  function baslat() {
    if (baslatSozu) return baslatSozu;
    durum('Giriş hazırlanıyor…', 'Giriş hazırlanıyor', true);
    hazir = new Promise(function (c) { hazirCoz = c; });
    baslatSozu = (async function () {
      try {
        if (sistem && !(await kopruKur())) {   
          kopruHata = true; V.tokenDurumu = 'gecici'; dugme.disabled = false;
          durum('Giriş hazırlanamadı — dokunun', 'Giriş hazırlanamadı — dokunup yeniden deneyin', true);
          return;
        }
        kopruHata = false;
        var p = new window.msal.PublicClientApplication({
          auth: { clientId: String(A.clientId).trim(), authority: 'https://login.microsoftonline.com/' + String(A.tenantId).trim(), redirectUri: yonlendirme, postLogoutRedirectUri: yonlendirme, navigateToLoginRequestUrl: false },
          cache: { cacheLocation: 'localStorage' }   
        });
        await p.initialize();
        pca = p; hazirCoz();   
        var sonuc = null;
        try { sonuc = await pca.handleRedirectPromise(); }
        catch (re) {   
          var sessizKod = String((re && (re.errorCode || re.error)) || '');   
          if (native || !/^(login_required|interaction_required|consent_required|account_selection_required)$/.test(sessizKod)) throw re;
          sonuc = null;
        }
        if (/[?&](code|state|error)=/.test(location.search) && history.replaceState) {   
          var q = new URLSearchParams(location.search); ['code', 'state', 'session_state', 'client_info', 'error', 'error_description', 'iss'].forEach(function (k) { q.delete(k); });
          history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q.toString() : '') + location.hash);
        }
        var hesap = (sonuc && sonuc.account) || pca.getActiveAccount() || pca.getAllAccounts()[0] || null;
        dugme.disabled = false;
        if (!hesap) {
          cikisAyarla();
          var izVar = false, sonDeneme = 0;
          if (!native) { try { izVar = localStorage.getItem(IZ_KEY) === '1'; sonDeneme = parseInt(localStorage.getItem(SSO_KEY) || '0', 10) || 0; } catch (e) {   } }
          if (izVar && Date.now() - sonDeneme > SSO_ARALIK) {   
            try { localStorage.setItem(SSO_KEY, String(Date.now())); } catch (e) {   }
            durum('Giriş yenileniyor…', 'Giriş yenileniyor', true);
            try { pca.loginRedirect({ scopes: KAPSAM, prompt: 'none', responseMode: 'query' }); } catch (e) { cikisAyarla(); }
          }
          return;
        }
        if (sonuc && sonuc.account) { try { localStorage.removeItem(SSO_KEY); } catch (e) {   } }
        if (!native) webSessizHak = true;   
        await girisSonrasi(hesap);
        V.tokenSaglayici();   
      } catch (e) {
        dugme.disabled = false;
        durum('Giriş başarısız', 'Giriş başlatılamadı — dokunup yeniden deneyin', true);
         
      }
    })().then(function () { hazirCoz(); baslatSozu = null; });
    return baslatSozu;
  }
  

  var BOSTA_MS = 0;   
  if (!native && BOSTA_MS > 0) {
    var sonHareket = Date.now(), bostaCikiyor = false;
    var bostaCikis = function () {
      if (bostaCikiyor) return; bostaCikiyor = true;
      var hesap = pca && pca.getActiveAccount && pca.getActiveAccount();
      bantGizle(); geciciler.length = 0; V.tokenDurumu = '';
      try { if (MM.mesaj && MM.mesaj.cikis) MM.mesaj.cikis(); } catch (e) {   }
      var temizle = yerelTemizle;
      A.girisUpn = ''; A.girisOid = ''; A.girisAd = ''; A.girisRol = ''; A.girisGruplar = []; A.girisMisafir = false;
      Promise.resolve().then(function () { return hesap ? pca.logoutRedirect({ account: hesap, onRedirectNavigate: function () { return false; } }) : null; })   
        .catch(function (e) { console.warn('bosta-cikis', kodKisa(e)); })
        .then(temizle)
        .then(function () { location.replace(yonlendirme); });
    };
    var hareket = function () { if (!document.hidden) sonHareket = Date.now(); };
    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(function (o) { window.addEventListener(o, hareket, { passive: true, capture: true }); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && pca && pca.getActiveAccount() && Date.now() - sonHareket >= BOSTA_MS) bostaCikis(); });
    setInterval(function () { if (pca && pca.getActiveAccount() && Date.now() - sonHareket >= BOSTA_MS) bostaCikis(); }, Math.min(15000, Math.max(250, BOSTA_MS / 4)));
  }
  baslat();
})();
