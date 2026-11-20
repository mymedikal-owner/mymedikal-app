


(function () {
  'use strict';
  var cercevede = false;
  try {
    if (window.top !== window.self) { void window.top.location.href; }   
  } catch (e) { cercevede = true; }
  if (cercevede && window.MM_CERCEVE_IZIN && self.origin === 'null') cercevede = false;   
  if (cercevede) {
    window.MM_CERCEVE = true;
    try { window.stop(); } catch (e) {   }
    document.documentElement.innerHTML = '<head><meta charset="utf-8"><title></title></head><body style="margin:0;padding:24px;font:14px sans-serif;color:#555">Bu sayfa çerçeve içinde açılamaz.</body>';
    return;
  }
  var cap = window.Capacitor, native = !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
  window.MM_WEB = !native;
  try { window.MM_DEPO = native ? window.localStorage : window.sessionStorage; } catch (e) { window.MM_DEPO = null; }
})();
