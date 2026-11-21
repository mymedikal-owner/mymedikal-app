

(function () {
  try {
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) return;
    var ua = navigator.userAgent || '', m = /Chrome\/(\d+)/.exec(ua), eski = false;
    if (m && parseInt(m[1], 10) < 90) eski = true;
    if (!(window.Promise && window.fetch && window.Symbol && Object.assign && window.URLSearchParams && window.MutationObserver)) eski = true;
    if (!eski) return;
    var goster = function () {
      if (document.getElementById('eski-tarayici')) return;
      var d = document.createElement('div'); d.id = 'eski-tarayici'; d.setAttribute('role', 'alert');
      d.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:99999;background:#fff;color:#111;font:16px/1.5 sans-serif;padding:32px 20px;text-align:center;box-sizing:border-box';
      d.innerHTML = '<h1 style="font-size:20px;margin:0 0 12px">Tarayıcınızı güncelleyin (Chrome)</h1><p style="margin:0">Bu uygulama için tarayıcınızın daha yeni bir sürümü gerekir. Play Store\'dan Chrome\'u güncelleyip sayfayı yeniden açın.</p>';
      (document.body || document.documentElement).appendChild(d);
    };
    if (document.body) goster(); else document.addEventListener('DOMContentLoaded', goster);
    window.addEventListener('load', goster);
  } catch (e) { }
})();
