

(function () {
  var hazir = !!(window.MM_AYAR && window.MMVeri);
  var anahtar = 'mm-yeniden';
  if (hazir) { try { sessionStorage.removeItem(anahtar); } catch (e) { } return; }
  var denendi = false;
  try { denendi = sessionStorage.getItem(anahtar) === '1'; sessionStorage.setItem(anahtar, '1'); } catch (e) { }
  if (!denendi) { location.reload(); return; }
  function goster() {
    var ana = document.querySelector('main') || document.body;
    var kap = document.createElement('div');
    kap.style.cssText = 'padding:24px;font:16px system-ui,-apple-system,sans-serif;line-height:1.5';
    var b = document.createElement('b'); b.textContent = 'Uygulama tam yüklenemedi.';
    var d = document.createElement('button');
    d.type = 'button'; d.textContent = 'Yeniden dene'; d.style.cssText = 'min-height:44px;padding:0 18px;font:inherit';
    d.addEventListener('click', function () { try { sessionStorage.removeItem(anahtar); } catch (e) { } location.reload(); });   
    [b, document.createElement('br'), document.createTextNode('Bağlantıyı kontrol edip yeniden deneyin.'), document.createElement('br'), document.createElement('br'), d].forEach(function (x) { kap.appendChild(x); });
    ana.textContent = ''; ana.appendChild(kap);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', goster); else goster();
})();
