 
(function () {
  var a = document.getElementById('acilis'); if (!a) return;
  function k() { a.classList.add('gizle'); setTimeout(function () { a.remove(); }, 400); }
  if (document.documentElement.classList.contains('sakin') || /HeadlessChrome/.test(navigator.userAgent)) { a.remove(); return; }
  window.addEventListener('load', function () { setTimeout(k, 600); });
  setTimeout(k, 3500);
})();
