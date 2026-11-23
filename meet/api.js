






(function () {
  'use strict';
  var A = window.MM_AYAR || {};
  var taban = (A.mesaj && A.mesaj.url) || '';

  function hata(kod, durum) { var e = new Error(kod); e.kod = kod; e.durum = durum || 0; return e; }
  function kodOf(d) {
    if (d === 401) return 'yetkisiz';
    if (d === 403) return 'uye-degil';
    if (d === 404) return 'yok';
    if (d === 429) return 'cok-istek';
    if (d >= 500) return 'sunucu';
    return 'gecersiz';
  }

  async function cagri(yontem, yol, govde) {
    var tok;
    try { tok = await window.MeetKimlik.belirtecAl(); } catch (e) { throw hata('belirtec'); }
    var res;
    try {
      res = await fetch(taban + yol, {
        method: yontem,
        headers: { 'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json' },
        body: govde ? JSON.stringify(govde) : undefined,
        cache: 'no-store'
      });
    } catch (e) { throw hata('ag'); }
    var j = null;
    try { var t = await res.text(); j = t ? JSON.parse(t) : null; } catch (e2) { j = null; }
    if (res.status < 200 || res.status >= 300) throw hata(kodOf(res.status), res.status);
    return j;
  }
  function sid(x) { return encodeURIComponent(String(x)); }
  function bilgiAl(v) {
    if (!v || typeof v.groupId !== 'string' || typeof v.acsToken !== 'string' || !v.groupId || !v.acsToken) throw hata('gecersiz');
    return { groupId: v.groupId, acsToken: v.acsToken, acsUserId: v.acsUserId, bitis: v.bitis };
  }
  function yeniId() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) {   }
    return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  }

  window.MeetApi = {
    sohbetler: async function () { var v = await cagri('GET', '/sohbetler'); return Array.isArray(v) ? v : []; },
    kisiler: async function () { var v = await cagri('GET', '/kisiler'); return Array.isArray(v) ? v : []; },
    aramaBaslat: async function (sohbetId) { return bilgiAl(await cagri('POST', '/sohbetler/' + sid(sohbetId) + '/arama', { video: true })); },
    aramaKatil: async function (sohbetId, groupId) {
      if (typeof groupId !== 'string' || !groupId) throw hata('gecersiz');
      return bilgiAl(await cagri('POST', '/sohbetler/' + sid(sohbetId) + '/arama/katil', { groupId: groupId }));
    },
     
    baglantiOlustur: function (sohbetId, groupId) { return new URL('./', location.href).href + '#s=' + sid(sohbetId) + '&g=' + sid(groupId); },
    baglantiMesaji: async function (sohbetId, groupId) {
      var link = window.MeetApi.baglantiOlustur(sohbetId, groupId);
      await cagri('POST', '/sohbetler/' + sid(sohbetId) + '/mesajlar', { tur: 'metin', metin: 'Toplantıya katılın: ' + link, istemciId: yeniId() });
      return link;
    }
  };
})();
