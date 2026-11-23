




(function () {
  'use strict';
  function olayYonetici() {
    var d = {};
    return {
      dinle: function (o, f) { (d[o] = d[o] || []).push(f); return function () { d[o] = (d[o] || []).filter(function (x) { return x !== f; }); }; },
      yay: function (o, v) { (d[o] || []).slice().forEach(function (f) { try { f(v); } catch (e) {   } }); }
    };
  }
  function msg(e) { return String((e && e.message) || e || 'bilinmeyen hata').slice(0, 200); }

   
  function taklit() {
    var ev = olayYonetici(), bagli = false, zamanlar = [];
    var sahte = [{ id: 'k1', ad: 'Ayşe Yılmaz' }, { id: 'k2', ad: 'Berk Demir' }];
    return {
      ad: 'taklit', dinle: ev.dinle,
      baglan: async function (p) {
        if (!p || !p.groupId) throw new Error('groupId yok');
        bagli = true;
        ev.yay('durum', { durum: 'Connecting' });
        zamanlar.push(setTimeout(function () {
          if (!bagli) return;
          ev.yay('durum', { durum: 'Connected' }); ev.yay('baglandi', {});
          sahte.forEach(function (k, i) { zamanlar.push(setTimeout(function () { if (bagli) { ev.yay('katilimciEkle', k); ev.yay('katilimci', { sayi: i + 1 }); } }, 300 + i * 400)); });
        }, 300));
      },
      ayril: async function () { bagli = false; zamanlar.splice(0).forEach(clearTimeout); ev.yay('durum', { durum: 'Disconnected' }); ev.yay('ayrildi', {}); },
      mikrofon: async function (acik) { ev.yay('mikrofon', { acik: !!acik }); },
      kamera: async function (acik) { ev.yay('kamera', { acik: !!acik }); }
    };
  }

   
  function acs() {
    var ev = olayYonetici();
    var istemci = null, ajan = null, cagri = null, dm = null, kameralar = [];
    var yerelAkis = null, yerelGorunum = null, yerelSayac = 0;
    var uzak = new Map();   
    var sayac = 0, mikAcik = true, bitti = false;

    function lib() {
      var L = window.MM_ACS;
      if (!L || !L.CallClient || !L.AzureCommunicationTokenCredential) { var e = new Error('SDK yüklenemedi'); e.kod = 'sdk'; throw e; }
      return L;
    }
    function sayiYay() { ev.yay('katilimci', { sayi: cagri ? cagri.remoteParticipants.length : 0 }); }

    async function akisCiz(k, stream) {
      var L = lib();
      if (k.gorunumler.has(stream)) return;
      try {
        var r = new L.VideoStreamRenderer(stream);
        var v = await r.createView({ scalingMode: 'Crop' });
        k.gorunumler.set(stream, { r: r, v: v });
        ev.yay('uzakVideo', { id: k.id, element: v.target });
      } catch (e) { ev.yay('hata', { mesaj: 'Karşı görüntü çizilemedi: ' + msg(e) }); }
    }
    function akisKaldir(k, stream) {
      var g = k.gorunumler.get(stream);
      if (!g) return;
      k.gorunumler.delete(stream);
      try { g.v.dispose(); } catch (e) {   }
      try { g.r.dispose(); } catch (e2) {   }
      if (!k.gorunumler.size) ev.yay('uzakVideo', { id: k.id, element: null });
    }
    function akisIzle(k, stream) {
      if (stream.mediaStreamType !== 'Video') return;   
      if (stream.isAvailable) akisCiz(k, stream);
      stream.on('isAvailableChanged', function () { if (stream.isAvailable) akisCiz(k, stream); else akisKaldir(k, stream); });
    }
    function katilimciEkle(p) {
      if (uzak.has(p)) return;
      var k = { id: 'p' + (++sayac), ad: p.displayName || 'Katılımcı', gorunumler: new Map() };
      uzak.set(p, k);
      ev.yay('katilimciEkle', { id: k.id, ad: k.ad });
      p.on('videoStreamsUpdated', function (e) {
        e.added.forEach(function (s) { akisIzle(k, s); });
        e.removed.forEach(function (s) { akisKaldir(k, s); });
      });
      p.on('displayNameChanged', function () { ev.yay('katilimciEkle', { id: k.id, ad: p.displayName || 'Katılımcı' }); });
      (p.videoStreams || []).forEach(function (s) { akisIzle(k, s); });
    }
    function katilimciCikar(p) {
      var k = uzak.get(p);
      if (!k) return;
      Array.from(k.gorunumler.keys()).forEach(function (s) { akisKaldir(k, s); });
      uzak.delete(p);
      ev.yay('katilimciCikar', { id: k.id });
    }

    async function yerelKapat() {
      if (yerelGorunum) { try { yerelGorunum.v.dispose(); } catch (e) {   } try { yerelGorunum.r.dispose(); } catch (e2) {   } yerelGorunum = null; }
      ev.yay('yerelVideo', { element: null });
    }

    return {
      ad: 'acs', dinle: ev.dinle,

      baglan: async function (p) {
        var L = lib();
        if (!p || !p.groupId || !p.acsToken) throw new Error('groupId/acsToken yok');
        bitti = false;
        ev.yay('durum', { durum: 'Connecting' });
        istemci = new L.CallClient();
        var kimlik = new L.AzureCommunicationTokenCredential(p.acsToken);
        ajan = await istemci.createCallAgent(kimlik, { displayName: String(p.ad || 'Katılımcı').slice(0, 256) });
        dm = await istemci.getDeviceManager();
        var izin = { audio: false, video: false };
        try { izin = await dm.askDevicePermission({ audio: true, video: true }); }
        catch (e) {
          try { var yalnizSes = await dm.askDevicePermission({ audio: true, video: false }); izin = { audio: !!(yalnizSes && yalnizSes.audio), video: false }; }
          catch (e2) { ev.yay('hata', { mesaj: 'Mikrofon/kamera izni alınamadı: ' + msg(e2) }); }
        }
        if (izin && izin.video) { try { kameralar = await dm.getCameras(); } catch (e3) { kameralar = []; } }
        var sesAcik = !!(izin && izin.audio);
        mikAcik = sesAcik;
        cagri = ajan.join({ groupId: p.groupId }, { audioOptions: { muted: !sesAcik } });
        cagri.on('stateChanged', function () {
          ev.yay('durum', { durum: cagri.state });
          if (cagri.state === 'Connected') ev.yay('baglandi', {});
          if (cagri.state === 'Disconnected' && !bitti) { bitti = true; ev.yay('ayrildi', {}); }
        });
        cagri.on('remoteParticipantsUpdated', function (e) {
          e.added.forEach(katilimciEkle);
          e.removed.forEach(katilimciCikar);
          sayiYay();
        });
        cagri.remoteParticipants.forEach(katilimciEkle);
        ev.yay('durum', { durum: cagri.state });
        ev.yay('mikrofon', { acik: sesAcik });
        sayiYay();
      },

      mikrofon: async function (acik) {
        if (!cagri) return;
        if (acik) await cagri.unmute(); else await cagri.mute();
        mikAcik = !!acik;
        ev.yay('mikrofon', { acik: mikAcik });
      },

      kamera: async function (acik) {
        var L = lib();
        if (!cagri) return;
        if (acik) {
          if (!kameralar.length) { var e = new Error('Kamera bulunamadı ya da izin verilmedi'); e.kod = 'kamera-yok'; throw e; }
          yerelAkis = new L.LocalVideoStream(kameralar[0]);
          await cagri.startVideo(yerelAkis);
          try {
            var r = new L.VideoStreamRenderer(yerelAkis);
            var v = await r.createView({ scalingMode: 'Crop' });
            yerelGorunum = { r: r, v: v };
            ev.yay('yerelVideo', { element: v.target });
          } catch (e2) { ev.yay('hata', { mesaj: 'Yerel önizleme çizilemedi: ' + msg(e2) }); }
          ev.yay('kamera', { acik: true });
        } else {
          if (yerelAkis) { try { await cagri.stopVideo(yerelAkis); } catch (e3) {   } }
          yerelAkis = null;
          await yerelKapat();
          ev.yay('kamera', { acik: false });
        }
      },

      ayril: async function () {
        bitti = true;
        try { if (yerelAkis && cagri) await cagri.stopVideo(yerelAkis); } catch (e) {   }
        await yerelKapat();
        Array.from(uzak.keys()).forEach(katilimciCikar);
        try { if (cagri) await cagri.hangUp(); } catch (e2) {   }
        try { if (ajan) await ajan.dispose(); } catch (e3) {   }
        cagri = null; ajan = null; istemci = null; yerelAkis = null;
        ev.yay('durum', { durum: 'Disconnected' });
        ev.yay('ayrildi', {});
      }
    };
  }

  window.MeetSaglayici = { olustur: function (tur) { return tur === 'taklit' ? taklit() : acs(); } };
})();
