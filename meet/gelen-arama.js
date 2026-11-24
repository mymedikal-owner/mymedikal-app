












(function () {
  'use strict';
  var ZIL_MS = 45000, YOKLA_MS = 3000;
  var acik = null;   

  function el(tag, sinif, metin) { var e = document.createElement(tag); if (sinif) e.className = sinif; if (metin != null) e.textContent = metin; return e; }
  function olc(d) { try { document.documentElement.setAttribute('data-gelen-arama', d); } catch (e) {   } }

  function zil() {   
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    var ctx; try { ctx = new AC(); } catch (e) { return null; }
    try { if (ctx.state === 'suspended') ctx.resume(); } catch (e1) {   }
    function ton(f, bas, sure) {
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + bas;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
      g.gain.setValueAtTime(0.12, t + sure - 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + sure + 0.02);
    }
    function cal() { try { ton(880, 0, 0.4); ton(660, 0.45, 0.4); ton(880, 1.0, 0.4); ton(660, 1.45, 0.4); } catch (e2) {   } }
    cal(); var z = setInterval(cal, 3000);
    return { dur: function () { clearInterval(z); try { ctx.close(); } catch (e3) {   } } };
  }
  function titret(ac) { try { if (navigator.vibrate) navigator.vibrate(ac ? [800, 400, 800, 400, 800, 400, 800, 400, 800, 400, 800] : 0); } catch (e) {   } }
  function bildirimGoster(a) {
    try {
      if (!document.hidden || !('Notification' in window) || Notification.permission !== 'granted') return null;
      var n = new Notification(a.baslik || 'Mumu Talk', { body: a.tur === 'toplanti' ? 'Toplantıya çağırıyor…' : (a.video ? 'Görüntülü arıyor…' : 'Sesli arıyor…'), tag: a.tur === 'toplanti' ? 'mumu-toplanti-' + a.kod : 'mumu-arama-' + a.sohbet, requireInteraction: true });
      n.onclick = function () { try { window.focus(); } catch (e) {   } n.close(); };
      return n;
    } catch (e) { return null; }
  }

  function temizle(sonuc) {
    if (!acik) return;
    var o = acik; acik = null;
    clearTimeout(o.zaman); clearInterval(o.yokla);
    if (o.ses) o.ses.dur();
    titret(false);
    if (o.bildirim) { try { o.bildirim.close(); } catch (e) {   } }
    document.removeEventListener('visibilitychange', o.gorunurluk);
    if (o.kok && o.kok.parentNode) o.kok.parentNode.removeChild(o.kok);
    olc(sonuc || 'kapandi');
  }

  function goster(a, cb) {
    if (!a) return false;
    var tpl = a.tur === 'toplanti';   
    if (tpl ? !a.kod : (!a.sohbet || !a.groupId)) return false;
    cb = cb || {};
    if (acik) {
      var ay = tpl ? (acik.arama.tur === 'toplanti' && acik.arama.kod === a.kod) : (acik.arama.tur !== 'toplanti' && acik.arama.sohbet === a.sohbet);
      var ayId = tpl ? (acik.arama.cagriId || '') === (a.cagriId || '') : (acik.arama.aramaId || '') === (a.aramaId || '');
      if (ay && ayId) return true;   
      if (ay) temizle('kapandi');   
      else return false;   
    }
    var kok = el('div', 'ga-kok'); kok.setAttribute('role', 'dialog'); kok.setAttribute('aria-modal', 'true'); kok.setAttribute('aria-label', 'Gelen arama');
    var ust = el('div', 'ga-ust');
    var bas = String(a.baslik || '').trim();
    ust.appendChild(el('div', 'ga-av', (bas.charAt(0) || '?').toLocaleUpperCase('tr-TR')));
    ust.appendChild(el('p', 'ga-ad', bas || 'Mumu Talk'));
    ust.appendChild(el('p', 'ga-tur', tpl ? 'sizi toplantıya çağırıyor' : (a.video ? 'Görüntülü arama' : 'Sesli arama')));
    kok.appendChild(ust);
    var alt = el('div', 'ga-alt');
    function dugme(sinif, etiket, yazi, f) {
      var k = el('div', 'ga-dk'), b = el('button', 'ga-d ' + sinif); b.type = 'button'; b.setAttribute('aria-label', etiket);
      b.appendChild(el('span', 'ga-ikon ' + sinif.split(' ')[0] + '-ikon')); b.addEventListener('click', f);
      k.appendChild(b); k.appendChild(el('span', 'ga-etiket', yazi)); alt.appendChild(k); return b;
    }
    dugme('ga-red', 'Reddet', 'Reddet', function () {
      var o = acik; temizle('red');
      if (o && o.cb.reddet) { Promise.resolve().then(function () { return o.cb.reddet(); }).catch(function () {   }); }
    });
    var vid = a.video && !tpl;
    if (vid) dugme('ga-kabul ga-sesli', 'Sesli kabul et', 'Sesli', function () { kabulEt(false); });
    var kb = dugme('ga-kabul', vid ? 'Görüntülü kabul et' : 'Kabul et', vid ? 'Görüntülü' : 'Kabul et', function () { kabulEt(!!vid); });
    kok.appendChild(alt);
    function kabulEt(videoIle) { var o = acik; temizle('kabul'); if (o && o.cb.kabul) o.cb.kabul(videoIle); }
    kok.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); } });

    document.body.appendChild(kok);
    acik = { arama: a, cb: cb, kok: kok, ses: zil(), zaman: null, yokla: null, bildirim: bildirimGoster(a), yoklaniyor: false };
    var o = acik;
    o.gorunurluk = function () { if (acik === o && !document.hidden && o.bildirim) { try { o.bildirim.close(); } catch (e) {   } o.bildirim = null; } };
    document.addEventListener('visibilitychange', o.gorunurluk);
    titret(true); olc('caliyor');
    try { kb.focus(); } catch (e) {   }
    o.zaman = setTimeout(function () { if (acik === o) temizle('zamanasimi'); }, ZIL_MS);
    if (typeof cb.acikMi === 'function') {
      o.yokla = setInterval(function () {
        if (acik !== o || o.yoklaniyor) return;
        o.yoklaniyor = true;
        Promise.resolve().then(function () { return cb.acikMi(); })
          .then(function (v) { o.yoklaniyor = false; if (v === false && acik === o) temizle('kapandi'); })
          .catch(function () { o.yoklaniyor = false;   });
      }, YOKLA_MS);
    }
    return true;
  }

  function kapat(anahtar) { if (acik && (!anahtar || acik.arama.sohbet === anahtar || acik.arama.kod === anahtar)) temizle('kapandi'); }
  function izinIste() {
    try { if ('Notification' in window && Notification.permission === 'default') return Notification.requestPermission(); } catch (e) {   }
    return Promise.resolve(window.Notification ? Notification.permission : 'denied');
  }
   
  function kabulAdresi(a, videoIle) {
    return 'meet/#s=' + encodeURIComponent(a.sohbet) + '&g=' + encodeURIComponent(a.groupId) + '&v=' + (videoIle ? '1' : '0') + '&k=1' + (a.aramaId ? '&a=' + encodeURIComponent(a.aramaId) : '');
  }
  function toplantiAdresi(kod) { return 'meet/#toplanti/' + encodeURIComponent(kod); }
  function gidenAdres(sohbet, video) { return 'meet/#s=' + encodeURIComponent(sohbet) + '&v=' + (video ? '1' : '0') + '&c=1'; }

  window.MumuGelenArama = { goster: goster, kapat: kapat, izinIste: izinIste, kabulAdresi: kabulAdresi, toplantiAdresi: toplantiAdresi, gidenAdres: gidenAdres, acikMi: function () { return !!acik; } };
})();
