







(function () {
  'use strict';
  var A = window.MM_AYAR || {};
  var taban = (A.mesaj && A.mesaj.url) || '';
  var MAKS_METIN = 4000;

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
    if (res.status === 503 && j && j.hata === 'kapali') throw hata('kapali', 503);   
    if (res.status === 425) throw hata('erken', 425);                                
    if (res.status < 200 || res.status >= 300) throw hata(kodOf(res.status), res.status);
    return j;
  }
   
  function kisaKodDuzelt(k) { return String(k == null ? '' : k).toUpperCase().replace(/[\s-]/g, ''); }
  function katilSonucu(v) {
    if (!v || typeof v.sonuc !== 'string') throw hata('gecersiz');
    var o = { sonuc: v.sonuc };
    if (v.sonuc === 'katildi') { o.groupId = s(v.groupId); if (typeof v.kod === 'string') o.kod = v.kod; }
    return o;
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
  function s(v) { return typeof v === 'string' ? v : ''; }
  function mesajCevir(m) {
    if (!m || typeof m !== 'object') return null;
    var tur = typeof m.tur === 'string' ? m.tur : 'metin';
    return { id: s(m.id), gonderen: s(m.gonderen), ts: (typeof m.ts === 'number' || typeof m.ts === 'string') ? m.ts : '', tur: tur, metin: typeof m.metin === 'string' ? m.metin : '' };
  }

  window.MeetApi = {
    sohbetler: async function () { var v = await cagri('GET', '/sohbetler'); return Array.isArray(v) ? v : []; },
    kisiler: async function () { var v = await cagri('GET', '/kisiler'); return Array.isArray(v) ? v : []; },
    aramaBaslat: async function (sohbetId) { return bilgiAl(await cagri('POST', '/sohbetler/' + sid(sohbetId) + '/arama', { video: true })); },
    aramaKatil: async function (sohbetId, groupId) {
      if (typeof groupId !== 'string' || !groupId) throw hata('gecersiz');
      return bilgiAl(await cagri('POST', '/sohbetler/' + sid(sohbetId) + '/arama/katil', { groupId: groupId }));
    },
     
    cevrimiciKisiler: async function () {
      var v = await cagri('GET', '/cevrimici');
      if (!v || v.acik !== true || !Array.isArray(v.cevrimici)) return { acik: false, kisiler: [] };
      return { acik: true, kisiler: v.cevrimici.map(function (p) { return p && typeof p === 'object' ? { id: s(p.oid), ad: s(p.ad), durum: 'cevrimici' } : null; }).filter(function (p) { return p && p.id; }) };
    },
     
    yaklasanToplantilar: async function () {
      var v = await cagri('GET', '/toplanti/yaklasan');
      return (Array.isArray(v) ? v : []).map(function (t) {
        if (!t || typeof t !== 'object' || typeof t.kod !== 'string') return null;
        var ms = Date.parse(t.baslangic);
        return { id: t.kod, ad: s(t.baslik) || 'Toplantı', baslangic: isNaN(ms) ? 0 : ms, katilimci: typeof t.katilimci === 'number' ? t.katilimci : 0, g: t.kod };
      }).filter(Boolean);
    },
    toplantiOlustur: async function (o) {
      o = o || {};
      var b = String(o.baslik == null ? '' : o.baslik).trim();
      if (!b) throw hata('gecersiz');
      var govde = { baslik: b.slice(0, 120), claude: false };
      if (o.baslangic != null) {
        var bas = new Date(o.baslangic).getTime();
        if (isNaN(bas)) throw hata('gecersiz');
        var dk = Math.max(1, Math.min(480, parseInt(o.sure, 10) || 60));
        govde.baslangic = new Date(bas).toISOString();
        govde.bitis = new Date(bas + dk * 60000).toISOString();
      }
      var v = await cagri('POST', '/toplanti', govde);
      if (!v || typeof v.kod !== 'string') throw hata('gecersiz');
      return { kod: v.kod, kisaKod: s(v.kisaKod), link: s(v.link), durum: s(v.durum) };
    },
     
    toplantiKatil: async function (kod) {
      if (typeof kod !== 'string' || !kod) throw hata('gecersiz');
      return katilSonucu(await cagri('POST', '/toplanti/' + sid(kod) + '/katil', {}));
    },
     
    kodlaKatil: async function (kisaKod) {
      var k = kisaKodDuzelt(kisaKod);
      if (k.length !== 8) throw hata('gecersiz');
      return katilSonucu(await cagri('POST', '/toplanti/kisa-kod/katil', { kisaKod: k }));
    },
     
    baglantiOlustur: function (sohbetId, groupId) { return new URL('./', location.href).href + '#s=' + sid(sohbetId) + '&g=' + sid(groupId); },
    baglantiMesaji: async function (sohbetId, groupId) {
      var link = window.MeetApi.baglantiOlustur(sohbetId, groupId);
      await cagri('POST', '/sohbetler/' + sid(sohbetId) + '/mesajlar', { tur: 'metin', metin: 'Toplantıya katılın: ' + link, istemciId: yeniId() });
      return link;
    },
     
    mesajlar: async function (sohbetId, adet) {
      var n = Math.max(1, Math.min(50, parseInt(adet, 10) || 50));
      var v = await cagri('GET', '/sohbetler/' + sid(sohbetId) + '/mesajlar?adet=' + n);
      return (Array.isArray(v) ? v : []).map(mesajCevir).filter(Boolean);
    },
    mesajGonder: async function (sohbetId, metin) {
      var t = String(metin == null ? '' : metin).trim();
      if (!t) throw hata('bos');
      if (t.length > MAKS_METIN) throw hata('uzun');
      return mesajCevir(await cagri('POST', '/sohbetler/' + sid(sohbetId) + '/mesajlar', { tur: 'metin', metin: t, istemciId: yeniId() }));
    }
  };
})();
