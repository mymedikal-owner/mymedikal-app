















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
  function acsTepki(t) { return t === 'heart' ? 'love' : t; }

   
  function taklit() {
    var ev = olayYonetici(), bagli = false, zamanlar = [], araclar = [];
    var q = (typeof location !== 'undefined' && location.search) || '';
    var nm = /[?&]n=(\d+)/.exec(q);
    var N = nm ? Math.max(1, Math.min(12, parseInt(nm[1], 10))) : 2;
    var gm = /[?&]gecik=(\d+)/.exec(q);
    var GECIK = gm ? Math.min(600, parseInt(gm[1], 10)) * 1000 : 0;   
    var om = /[?&]ovc=(\d+)/.exec(q);
    var OVC = om ? Math.max(1, Math.min(16, parseInt(om[1], 10))) : 8;   
    var sahte = []; for (var i = 0; i < N; i++) sahte.push({ id: 'k' + (i + 1), ad: 'Katılımcı ' + (i + 1) });
    var izinli = null, cizili = {}, gitti = {};   
    var mikAcik = true, kamAcik = false, ozOnizleme = false, ekranAcik = false, elAcik = false;
    var secili = { kamera: 'kam1', mikrofon: 'mik1', hoparlor: 'hop1' };
    var RENK = [['#3b5b92', '#7aa2e3'], ['#8a4b6b', '#e39ab8'], ['#2f7a6a', '#7fd1be'], ['#7a5c2f', '#e3c27a']];
    var KAMERALAR = [{ id: 'kam1', ad: 'Ön kamera (taklit)', yon: 'on' }, { id: 'kam2', ad: 'Arka kamera (taklit)', yon: 'arka' }, { id: 'kam3', ad: 'Arka ultra geniş (taklit)', yon: 'arka' }];
    function kamBul(id) { return KAMERALAR.filter(function (k) { return k.id === id; })[0] || KAMERALAR[0]; }
    function kamEtiket() { var t = window.MeetDil ? window.MeetDil.t : function (x) { return x; }; return t('Siz') + ' - ' + t(kamBul(secili.kamera).ad); }    
    function yerelYenile() { if (kamAcik) ev.yay('yerelVideo', { element: tuval(kamEtiket(), kamBul(secili.kamera).yon === 'on' ? 3 : 1) }); }

    function tuval(etiket, k, ekran) {
      var c = document.createElement('canvas'); c.width = 640; c.height = 360; c.className = 'taklit-tuval';
      var x = c.getContext('2d'); if (!x) return c;
      var r = RENK[k % RENK.length];
      var g = x.createLinearGradient(0, 0, 640, 360); g.addColorStop(0, r[0]); g.addColorStop(1, r[1]);
      x.fillStyle = g; x.fillRect(0, 0, 640, 360);
      if (ekran) { x.fillStyle = 'rgba(255,255,255,.9)'; x.fillRect(40, 40, 560, 280); x.fillStyle = '#233'; x.font = '28px sans-serif'; x.fillText(window.MeetDil ? window.MeetDil.t('Paylaşılan ekran (taklit)') : 'Paylaşılan ekran (taklit)', 150, 190); }
      else { x.fillStyle = 'rgba(255,255,255,.9)'; x.font = '26px sans-serif'; x.fillText(etiket, 24, 340); }
      return c;
    }
    function tut(f, ms) { zamanlar.push(setTimeout(function () { if (bagli) f(); }, ms)); }
     
    function taklitCiz(id) {
      var i = -1; sahte.forEach(function (k, x) { if (k.id === id) i = x; });
      if (i < 0 || gitti[id]) return;
      var ok = !izinli || izinli.has(id);
      if (ok && !cizili[id]) { cizili[id] = true; ev.yay('uzakVideo', { id: id, element: tuval(sahte[i].ad, i) }); }
      else if (!ok && cizili[id]) { cizili[id] = false; ev.yay('uzakVideo', { id: id, element: null }); }
    }
    function listeler() {
      return {
        kameralar: KAMERALAR.map(function (k) { return { id: k.id, ad: k.ad }; }),
        mikrofonlar: [{ id: 'mik1', ad: 'Yerleşik mikrofon (taklit)' }, { id: 'mik2', ad: 'Kulaklık mikrofonu (taklit)' }],
        hoparlorler: [{ id: 'hop1', ad: 'Yerleşik hoparlör (taklit)' }, { id: 'hop2', ad: 'Kulaklık (taklit)' }],
        secili: { kamera: secili.kamera, mikrofon: secili.mikrofon, hoparlor: secili.hoparlor }
      };
    }
    return {
      ad: 'taklit', dinle: ev.dinle,
      onizlemeBaslat: async function (p) {
        ozOnizleme = true;
        if (p && p.kamera) ev.yay('onizlemeVideo', { element: tuval(kamEtiket(), 0) }); else ev.yay('onizlemeVideo', { element: null });
        return { ses: true, kamera: true };
      },
      onizlemeDurdur: async function () { ozOnizleme = false; ev.yay('onizlemeVideo', { element: null }); },
      cihazlar: async function () { return listeler(); },
      cihazSec: async function (tur, id) {
        if (!(tur in secili)) return false;
        secili[tur] = id;
        if (tur === 'kamera') {
          if (ozOnizleme) ev.yay('onizlemeVideo', { element: tuval(kamEtiket(), 0) });
          yerelYenile(); ev.yay('kameraYonu', { id: id, yon: kamBul(id).yon });
        }
        return true;
      },
      kameraListesi: async function () { return KAMERALAR.map(function (k) { return { id: k.id, ad: k.ad, yon: k.yon, secili: k.id === secili.kamera }; }); },
      kameraSec: async function (id) { return this.cihazSec('kamera', id); },
      cevir: async function () {
        var simdi = kamBul(secili.kamera), hedef = simdi.yon === 'on' ? 'arka' : 'on';
        var c = KAMERALAR.filter(function (k) { return k.yon === hedef; })[0];
        return this.cihazSec('kamera', c.id);
      },

      baglan: async function (p) {
        if (!p || !p.groupId) throw new Error('groupId yok');
        bagli = true;
        mikAcik = !p || p.mikrofonAcik !== false; kamAcik = !!(p && p.kameraAcik);
        if (ozOnizleme) { ozOnizleme = false; ev.yay('onizlemeVideo', { element: null }); }
        ev.yay('durum', { durum: 'Connecting' });
        tut(function () {
          ev.yay('durum', { durum: 'Connected' }); ev.yay('baglandi', {});
          ev.yay('mikrofon', { acik: mikAcik }); ev.yay('kamera', { acik: kamAcik });
          yerelYenile();
          sahte.forEach(function (k, i) {
            tut(function () {
              ev.yay('katilimciEkle', k); ev.yay('katilimci', { sayi: i + 1 });
              ev.yay('katilimHaber', { tur: 'katildi', ad: k.ad });
              ev.yay('videoMevcut', { id: k.id, var: true });
              taklitCiz(k.id);
            }, GECIK + 300 + i * 250);
          });
          ev.yay('optimalVideoCount', { sayi: OVC });
          var t0 = 400 + N * 250;
          if (N >= 4) {
            tut(function () {
              var son = sahte[N - 1]; gitti[son.id] = true;
              ev.yay('katilimciCikar', { id: son.id }); ev.yay('katilimci', { sayi: N - 1 });
              ev.yay('katilimHaber', { tur: 'ayrildi', ad: son.ad });
            }, t0 + 4000);
          }
          tut(function () { ev.yay('mikrofonDurumu', { id: sahte[Math.min(1, N - 1)].id, acik: false }); }, t0);
          tut(function () { ev.yay('elKalkti', { id: sahte[0].id, acik: true }); }, t0 + 600);
          tut(function () { ev.yay('tepki', { id: sahte[Math.min(1, N - 1)].id, tur: 'love' }); }, t0 + 1500);
          if (/[?&]ekran=1(&|$)/.test(q)) {
            tut(function () { ev.yay('ekranPaylasimi', { id: sahte[0].id, element: tuval('', 1, true), acik: true }); }, t0 + 2500);
          }
          var sira = 0, kimler = sahte.map(function (k) { return k.id; }).concat(['ben']);
          araclar.push(setInterval(function () { if (!bagli) return; ev.yay('konusan', { id: kimler[sira % kimler.length] }); sira++; }, 3000));
        }, 300);
      },
      gorunecek: function (idler) {
        izinli = new Set(idler || []);
        sahte.forEach(function (k) { if (cizili[k.id] !== undefined) taklitCiz(k.id); });
      },
      hazir: function () { return true; },
      temizle: async function () { bagli = false; zamanlar.splice(0).forEach(clearTimeout); araclar.splice(0).forEach(clearInterval); },
      ayril: async function () {
        if (!bagli) return;
        bagli = false; zamanlar.splice(0).forEach(clearTimeout); araclar.splice(0).forEach(clearInterval);
        ev.yay('durum', { durum: 'Disconnected' }); ev.yay('ayrildi', {});
      },
      mikrofon: async function (acik) { mikAcik = !!acik; ev.yay('mikrofon', { acik: mikAcik }); },
      kamera: async function (acik) {
        kamAcik = !!acik;
        if (kamAcik) yerelYenile(); else ev.yay('yerelVideo', { element: null });
        ev.yay('kamera', { acik: kamAcik });
      },
      ekranPaylas: async function (acik) { ekranAcik = !!acik; ev.yay('ekranPaylasimi', { id: 'ben', element: null, acik: ekranAcik }); return true; },
      elKaldir: async function (acik) { elAcik = !!acik; ev.yay('elKalkti', { id: 'ben', acik: elAcik }); return true; },
      tepkiGonder: async function (tur) { ev.yay('tepki', { id: 'ben', tur: tur }); return true; }
    };
  }

   
  function acs() {
    var ev = olayYonetici();
    var istemci = null, ajan = null, cagri = null, dm = null;
    var kameralar = [], mikrofonlar = [], hoparlorler = [], izin = null, seciliKamera = null;
    var onizAkis = null, onizGorunum = null;
    var yerelAkis = null, yerelGorunum = null, yerelHam = '';
    var uzak = new Map();   
    var sayac = 0, bitti = false, sonKonusan = null, ozellikler = {}, ozellikKuruldu = false, dinlList = [], ayrildiYayildi = false;
    var izinli = null;   
     
    function bagla(obj, adi, fn) { obj.on(adi, fn); dinlList.push([obj, adi, fn]); }

    function lib() {
      var L = window.MM_ACS;
      if (!L || !L.CallClient || !L.AzureCommunicationTokenCredential) { var e = new Error('SDK yüklenemedi'); e.kod = 'sdk'; throw e; }
      return L;
    }
    function sayiYay() { ev.yay('katilimci', { sayi: cagri ? cagri.remoteParticipants.length : 0 }); }
    function ham(kimlik) { return (kimlik && (kimlik.rawId || kimlik.communicationUserId || kimlik.microsoftTeamsUserId)) || ''; }
    function idBul(kimlik) {
      var h = ham(kimlik);
      if (!h) return '';
      if (yerelHam && (h === yerelHam || (kimlik && kimlik.communicationUserId === yerelHam))) return 'ben';
      var bulunan = '';
      uzak.forEach(function (k) { if (k.ham === h) bulunan = k.id; });
      return bulunan;
    }
    function konusanYay(id) { if (id === sonKonusan) return; sonKonusan = id; ev.yay('konusan', { id: id || '' }); }

    async function istemciHazir() {
      var L = lib();
      if (!istemci) istemci = new L.CallClient();
      if (!dm) dm = await istemci.getDeviceManager();
      return dm;
    }
    async function izinAl() {
      var s = { audio: false, video: false };
      try { s = await dm.askDevicePermission({ audio: true, video: true }); }
      catch (e) {
        try { var y = await dm.askDevicePermission({ audio: true, video: false }); s = { audio: !!(y && y.audio), video: false }; }
        catch (e2) { ev.yay('hata', { mesaj: 'Mikrofon/kamera izni alınamadı: ' + msg(e2) }); }
      }
      return { audio: !!(s && s.audio), video: !!(s && s.video) };
    }
    async function listele() {
      if (izin && izin.video) { try { kameralar = await dm.getCameras(); } catch (e) { kameralar = []; } }
      if (izin && izin.audio) {
        try { mikrofonlar = await dm.getMicrophones(); } catch (e2) { mikrofonlar = []; }
        try { hoparlorler = await dm.getSpeakers(); } catch (e3) { hoparlorler = []; }
      }
      if (!seciliKamera || !kameralar.some(function (c) { return c.id === seciliKamera.id; })) seciliKamera = onKameraBul(kameralar);
    }
     
    function yonBul(c) {
      var p = c && c.cameraFacing ? c.cameraFacing : (c && c.position);
      if (p === 'front' || p === 'back') return p === 'front' ? 'on' : 'arka';
      var a = String((c && c.name) || '').toLowerCase();
      if (/front|(^|\s)ön(\s|$)|facetime|user|selfie/i.test(String((c && c.name) || ''))) return 'on';
      if (/back|rear|arka|environment|ultra|tele|wide/.test(a)) return 'arka';
      return 'bilinmiyor';
    }
     
    function ozelLens(c) { return /ultra|geni[sş]|wide|tele|dual|[cç]ift|triple|[uü][cç]l[uü]|desk|masa/i.test(String((c && c.name) || '')); }
    function onKameraBul(l) {
      if (!l || !l.length) return null;
      var i;
      for (i = 0; i < l.length; i++) if (yonBul(l[i]) === 'on' && !ozelLens(l[i])) return l[i];
      for (i = 0; i < l.length; i++) if (yonBul(l[i]) === 'on') return l[i];
      for (i = 0; i < l.length; i++) if (!ozelLens(l[i])) return l[i];
      return l[0];
    }
    function aynali() { return yonBul(seciliKamera) !== 'arka'; }
     
    var GONDERIM = { send: { frameHeight: { max: 720 }, frameRate: { max: 30 } } };
    function gorunumKapat(g) {
      if (!g) return;
      try { g.v.dispose(); } catch (e) {   }
      try { g.r.dispose(); } catch (e2) {   }
    }
    async function onizlemeCiz() {
      var L = lib();
      gorunumKapat(onizGorunum); onizGorunum = null; onizAkis = null;
      if (!izin || !izin.video || !seciliKamera) { var e = new Error('Kamera bulunamadı ya da izin verilmedi'); e.kod = 'kamera-yok'; throw e; }
      onizAkis = new L.LocalVideoStream(seciliKamera);
      var r = new L.VideoStreamRenderer(onizAkis);
      var v = await r.createView({ scalingMode: 'Crop', isMirrored: aynali() });
      onizGorunum = { r: r, v: v };
       
      try {
        var ms = onizAkis.getMediaStream ? await onizAkis.getMediaStream() : null, tr = ms && ms.getVideoTracks ? ms.getVideoTracks()[0] : null, st = tr && tr.getSettings ? tr.getSettings() : null;
        window.__meetKamera = { ad: seciliKamera.name || '', genislik: st && st.width, yukseklik: st && st.height, fps: st && st.frameRate };
      } catch (eOl) { window.__meetKamera = { ad: seciliKamera.name || '', hata: msg(eOl) }; }
      ev.yay('onizlemeVideo', { element: v.target });
    }
    function onizlemeGorselKapat() { gorunumKapat(onizGorunum); onizGorunum = null; ev.yay('onizlemeVideo', { element: null }); }

     
    function videoIzinli(k, ekran) { return ekran || !izinli || izinli.has(k.id); }
    async function akisCiz(k, stream) {
      var L = lib();
      if (k.gorunumler.has(stream) || k.bekle.has(stream)) return;
      var ekran = stream.mediaStreamType === 'ScreenSharing';
      if (!videoIzinli(k, ekran)) return;
      k.bekle.add(stream);
      try {
        var r = new L.VideoStreamRenderer(stream);
        var v = await r.createView({ scalingMode: ekran ? 'Fit' : 'Crop' });
        k.bekle.delete(stream);
        if (bitti || !uzak.has(k.p) || !stream.isAvailable || !videoIzinli(k, ekran)) { try { v.dispose(); } catch (eA) {   } try { r.dispose(); } catch (eB) {   } return; }
        k.gorunumler.set(stream, { r: r, v: v, tur: ekran ? 'ekran' : 'video' });
        if (ekran) ev.yay('ekranPaylasimi', { id: k.id, element: v.target, acik: true }); else ev.yay('uzakVideo', { id: k.id, element: v.target });
      } catch (e) { k.bekle.delete(stream); ev.yay('hata', { mesaj: 'Karşı görüntü çizilemedi: ' + msg(e) }); }
    }
    function akisKaldir(k, stream) {
      var g = k.gorunumler.get(stream);
      if (!g) return;
      k.gorunumler.delete(stream);
      gorunumKapat(g);
      var kaldi = false;
      k.gorunumler.forEach(function (x) { if (x.tur === g.tur) kaldi = true; });
      if (!kaldi) { if (g.tur === 'ekran') ev.yay('ekranPaylasimi', { id: k.id, element: null, acik: false }); else ev.yay('uzakVideo', { id: k.id, element: null }); }
    }
    function akisIzle(k, stream) {
      var t = stream.mediaStreamType;
      if (t !== 'Video' && t !== 'ScreenSharing') return;
      var kam = t === 'Video';
      function var_() { if (!kam) return; if (stream.isAvailable) k.akislar.add(stream); else k.akislar.delete(stream); ev.yay('videoMevcut', { id: k.id, var: k.akislar.size > 0 }); }
      var_();
      if (stream.isAvailable) akisCiz(k, stream);
      stream.on('isAvailableChanged', function () { var_(); if (stream.isAvailable) akisCiz(k, stream); else akisKaldir(k, stream); });
    }
    function katilimciEkle(p) {
      if (uzak.has(p)) return;
      var k = { id: 'p' + (++sayac), ad: p.displayName || 'Katılımcı', ham: ham(p.identifier), gorunumler: new Map(), akislar: new Set(), bekle: new Set(), p: p };
      uzak.set(p, k);
      ev.yay('katilimciEkle', { id: k.id, ad: k.ad });
      try { ev.yay('mikrofonDurumu', { id: k.id, acik: !p.isMuted }); } catch (e0) {   }
      p.on('videoStreamsUpdated', function (e) {
        e.added.forEach(function (s) { akisIzle(k, s); });
        e.removed.forEach(function (s) { akisKaldir(k, s); });
      });
      p.on('displayNameChanged', function () { ev.yay('katilimciEkle', { id: k.id, ad: p.displayName || 'Katılımcı' }); });
      p.on('isMutedChanged', function () { ev.yay('mikrofonDurumu', { id: k.id, acik: !p.isMuted }); });
      p.on('isSpeakingChanged', function () { if (p.isSpeaking) konusanYay(k.id); else if (sonKonusan === k.id) konusanYay(''); });
      (p.videoStreams || []).forEach(function (s) { akisIzle(k, s); });
    }
    function katilimciCikar(p) {
      var k = uzak.get(p);
      if (!k) return;
      Array.from(k.gorunumler.keys()).forEach(function (s) { akisKaldir(k, s); });
      uzak.delete(p);
      if (sonKonusan === k.id) konusanYay('');
      ev.yay('katilimciCikar', { id: k.id });
    }

     
    function ozellik(ad) {
      if (!cagri) return null;
      if (ad in ozellikler) return ozellikler[ad];
      var L = window.MM_ACS, F = L && L.Features, ozel = null;
      try {
        var anahtar = ad === 'el' ? 'RaiseHand' : ad === 'tepki' ? 'Reaction' : ad === 'baskin' ? 'DominantSpeakers' : ad === 'ovc' ? 'OptimalVideoCount' : '';
        ozel = F && anahtar && F[anahtar] ? cagri.feature(F[anahtar]) : null;
      } catch (e) { ozel = null; }
      ozellikler[ad] = ozel;
      return ozel;
    }
    function ozellikKur() {
      if (ozellikKuruldu || !cagri) return;
      ozellikKuruldu = true;
      var el = ozellik('el');
      if (el) {
        try {
          bagla(el, 'raisedHandEvent', function (e) { var id = idBul(e && e.identifier); if (id) ev.yay('elKalkti', { id: id, acik: true }); });
          bagla(el, 'loweredHandEvent', function (e) { var id = idBul(e && e.identifier); if (id) ev.yay('elKalkti', { id: id, acik: false }); });
          (el.getRaisedHands() || []).forEach(function (x) { var id = idBul(x && x.identifier); if (id) ev.yay('elKalkti', { id: id, acik: true }); });
        } catch (e1) {   }
      }
      var tp = ozellik('tepki');
      if (tp) {
        try { bagla(tp, 'reaction', function (e) { var id = idBul(e && e.identifier); if (id && e.reactionMessage) ev.yay('tepki', { id: id, tur: e.reactionMessage.reactionType }); }); }
        catch (e2) {   }
      }
      var bs = ozellik('baskin');
      if (bs) {
        try {
          bagla(bs, 'dominantSpeakersChanged', function () {
            var l = (bs.dominantSpeakers && bs.dominantSpeakers.speakersList) || [];
            konusanYay(l.length ? idBul(l[0]) : '');
          });
        } catch (e3) {   }
      }
       
      var ovc = ozellik('ovc');
      if (ovc) {
        try {
          var ovcYay = function () { var n = Number(ovc.optimalVideoCount); if (n > 0) ev.yay('optimalVideoCount', { sayi: Math.floor(n) }); };
          bagla(ovc, 'optimalVideoCountChanged', ovcYay);
          ovcYay();
        } catch (e4) {   }
      }
    }

    async function yerelCiz() {
      var L = lib();
      gorunumKapat(yerelGorunum); yerelGorunum = null;
      try {
        var r = new L.VideoStreamRenderer(yerelAkis);
        var v = await r.createView({ scalingMode: 'Crop', isMirrored: aynali() });
        yerelGorunum = { r: r, v: v };
        ev.yay('yerelVideo', { element: v.target });
      } catch (e2) { ev.yay('hata', { mesaj: 'Yerel önizleme çizilemedi: ' + msg(e2) }); }
    }
    async function yerelKapat() { gorunumKapat(yerelGorunum); yerelGorunum = null; ev.yay('yerelVideo', { element: null }); }
     
    async function temizle(kapat) {
      bitti = true;
      dinlList.splice(0).forEach(function (d) { try { d[0].off(d[1], d[2]); } catch (e0) {   } });
      try { if (cagri && cagri.isScreenSharingOn) await cagri.stopScreenSharing(); } catch (e1) {   }
      try { if (yerelAkis && cagri) await cagri.stopVideo(yerelAkis); } catch (e2) {   }
      await yerelKapat();
      onizlemeGorselKapat(); onizAkis = null;
      Array.from(uzak.keys()).forEach(katilimciCikar);
      try { if (kapat && cagri && cagri.state !== 'Disconnected') await cagri.hangUp(); } catch (e3) {   }
      try { if (ajan) await ajan.dispose(); } catch (e4) {   }
      cagri = null; ajan = null; yerelAkis = null; ozellikler = {}; ozellikKuruldu = false;
    }
    async function bitir(kapat) {
      if (ayrildiYayildi) return;
      ayrildiYayildi = true;
      await temizle(kapat);
      ev.yay('durum', { durum: 'Disconnected' });
      ev.yay('ayrildi', {});
    }
     
    async function kameraGec(c) {
      var L = lib();
      var eskiCihaz = seciliKamera;
      seciliKamera = c;
      if (yerelAkis && cagri) {
        var eski = yerelAkis;
        try { await cagri.stopVideo(eski); } catch (e0) {   }
        await yerelKapat();
        try {
          yerelAkis = new L.LocalVideoStream(c);
          await cagri.startVideo(yerelAkis);
          await yerelCiz();
          ev.yay('kamera', { acik: true });
        } catch (e1) {
          seciliKamera = eskiCihaz;
          try {
            yerelAkis = new L.LocalVideoStream(eskiCihaz);
            await cagri.startVideo(yerelAkis);
            await yerelCiz();
            ev.yay('kamera', { acik: true });
          } catch (e2) {
            yerelAkis = null; await yerelKapat(); ev.yay('kamera', { acik: false });
          }
          ev.yay('kameraYonu', { id: seciliKamera ? seciliKamera.id : '', yon: yonBul(seciliKamera) });
          throw e1;
        }
      } else if (onizGorunum) {
        try { await onizlemeCiz(); } catch (e3) { seciliKamera = eskiCihaz; try { await onizlemeCiz(); } catch (e4) {   } throw e3; }
      }
      ev.yay('kameraYonu', { id: c.id, yon: yonBul(c) });
    }
    var degisiyor = false;
    async function kilitli(f) {
      if (degisiyor) return false;
      degisiyor = true;
      try { return await f(); } finally { degisiyor = false; }
    }
    function yok(oz, e) { ev.yay('desteklenmiyor', { ozellik: oz, mesaj: e ? msg(e) : '' }); return false; }

    return {
      ad: 'acs', dinle: ev.dinle,

      onizlemeBaslat: async function (p) {
        await istemciHazir();
        if (!izin) { izin = await izinAl(); await listele(); }
        if (p && p.kamera) { await onizlemeCiz(); } else { onizlemeGorselKapat(); onizAkis = null; }
        return { ses: izin.audio, kamera: izin.video };
      },
      onizlemeDurdur: async function () { onizlemeGorselKapat(); onizAkis = null; },

      cihazlar: async function () {
        if (dm && !kameralar.length && !mikrofonlar.length) { try { await listele(); } catch (e) {   } }
        var m = function (l) { return (l || []).map(function (c) { return { id: c.id, ad: c.name || c.id }; }); };
        var sm = null, sh = null;
        try { sm = dm && dm.selectedMicrophone; sh = dm && dm.selectedSpeaker; } catch (e2) {   }
        return {
          kameralar: m(kameralar), mikrofonlar: m(mikrofonlar), hoparlorler: m(hoparlorler),
          secili: { kamera: seciliKamera ? seciliKamera.id : '', mikrofon: sm ? sm.id : '', hoparlor: sh ? sh.id : '' }
        };
      },
      kameraListesi: async function () {
        if (dm && !kameralar.length) { try { await listele(); } catch (e) {   } }
        return kameralar.map(function (c) { return { id: c.id, ad: c.name || c.id, yon: yonBul(c), secili: !!(seciliKamera && seciliKamera.id === c.id) }; });
      },
      kameraSec: async function (id) { return this.cihazSec('kamera', id); },
       
      cevir: async function () {
        try {
          if (!dm || kameralar.length < 2) return false;
          var simdi = yonBul(seciliKamera), hedef = simdi === 'on' ? 'arka' : 'on', c = null;
          for (var i = 0; i < kameralar.length && !c; i++) if (kameralar[i].id !== seciliKamera.id && yonBul(kameralar[i]) === hedef && !ozelLens(kameralar[i])) c = kameralar[i];
          for (var j = 0; j < kameralar.length && !c; j++) if (kameralar[j].id !== seciliKamera.id && yonBul(kameralar[j]) === hedef) c = kameralar[j];
          if (!c) { var ix = kameralar.findIndex(function (x) { return x.id === seciliKamera.id; }); c = kameralar[(ix + 1) % kameralar.length]; }
          return await kilitli(function () { return kameraGec(c).then(function () { return true; }); });
        } catch (e) { ev.yay('hata', { mesaj: 'Kamera çevrilemedi: ' + msg(e) }); return false; }
      },
      cihazSec: async function (tur, id) {
        try {
          if (!dm) return false;
          if (tur === 'kamera') {
            var c = kameralar.filter(function (x) { return x.id === id; })[0]; if (!c) return false;
            return await kilitli(function () { return kameraGec(c).then(function () { return true; }); });
          }
          if (tur === 'mikrofon') { var m = mikrofonlar.filter(function (x) { return x.id === id; })[0]; if (!m) return false; await dm.selectMicrophone(m); return true; }
          if (tur === 'hoparlor') { var h = hoparlorler.filter(function (x) { return x.id === id; })[0]; if (!h) return false; await dm.selectSpeaker(h); return true; }
        } catch (e) { ev.yay('hata', { mesaj: 'Cihaz değiştirilemedi: ' + msg(e) }); }
        return false;
      },

      baglan: async function (p) {
        var L = lib();
        if (!p || !p.groupId || !p.acsToken) throw new Error('groupId/acsToken yok');
        bitti = false; ayrildiYayildi = false; ozellikler = {}; ozellikKuruldu = false; sonKonusan = null; dinlList = []; izinli = null;
        ev.yay('durum', { durum: 'Connecting' });
        await istemciHazir();
        var kimlik = new L.AzureCommunicationTokenCredential(p.acsToken);
        ajan = await istemci.createCallAgent(kimlik, { displayName: String(p.ad || 'Katılımcı').slice(0, 256) });
        if (!izin) { izin = await izinAl(); await listele(); }
        yerelHam = p.acsUserId ? String(p.acsUserId) : '';
        var sesAcik = !!izin.audio && p.mikrofonAcik !== false;
        var akis = null;
        if (p.kameraAcik) {
          if (izin.video && seciliKamera) akis = onizAkis || new L.LocalVideoStream(seciliKamera);
          else ev.yay('hata', { mesaj: 'Kamera bulunamadı ya da izin verilmedi.' });
        }
        onizlemeGorselKapat();
        if (akis !== onizAkis) onizAkis = null;
        var secenek = { audioOptions: { muted: !sesAcik } };
        secenek.videoOptions = { constraints: GONDERIM };
        if (akis) secenek.videoOptions.localVideoStreams = [akis];
        cagri = ajan.join({ groupId: p.groupId }, secenek);
        bagla(cagri, 'stateChanged', function () {
          if (!cagri) return;
          ev.yay('durum', { durum: cagri.state });
          if (cagri.state === 'Connected') { ev.yay('baglandi', {}); ozellikKur(); }
           
          if (cagri.state === 'Disconnected' && !bitti) { bitir(false); }
        });
        bagla(cagri, 'remoteParticipantsUpdated', function (e) {
          e.added.forEach(function (p) { var yeni = !uzak.has(p); katilimciEkle(p); if (yeni && uzak.has(p)) ev.yay('katilimHaber', { tur: 'katildi', ad: uzak.get(p).ad }); });
          e.removed.forEach(function (p) { var k = uzak.get(p); katilimciCikar(p); if (k) ev.yay('katilimHaber', { tur: 'ayrildi', ad: k.ad }); });
          sayiYay();
        });
        try { bagla(cagri, 'isScreenSharingOnChanged', function () { ev.yay('ekranPaylasimi', { id: 'ben', element: null, acik: !!cagri.isScreenSharingOn }); }); } catch (e1) {   }
        cagri.remoteParticipants.forEach(katilimciEkle);
        ev.yay('durum', { durum: cagri.state });
        ev.yay('mikrofon', { acik: sesAcik });
        if (akis) { yerelAkis = akis; onizAkis = null; await yerelCiz(); ev.yay('kamera', { acik: true }); } else { ev.yay('kamera', { acik: false }); }
        if (cagri.state === 'Connected') ozellikKur();
        sayiYay();
      },

      mikrofon: async function (acik) {
        if (!cagri) return;
        if (acik) await cagri.unmute(); else await cagri.mute();
        ev.yay('mikrofon', { acik: !!acik });
      },

      kamera: async function (acik) {
        var L = lib();
        if (!cagri) return;
        if (acik) {
          if (!kameralar.length || !seciliKamera) {
            try { if (!izin || !izin.video) izin = await izinAl(); await listele(); } catch (e0) {   }
          }
          if (!seciliKamera) { var e = new Error('Kamera bulunamadı ya da izin verilmedi'); e.kod = 'kamera-yok'; throw e; }
          yerelAkis = new L.LocalVideoStream(seciliKamera);
          await cagri.startVideo(yerelAkis);
          await yerelCiz();
          ev.yay('kamera', { acik: true });
        } else {
          if (yerelAkis) { try { await cagri.stopVideo(yerelAkis); } catch (e3) {   } }
          yerelAkis = null;
          await yerelKapat();
          ev.yay('kamera', { acik: false });
        }
      },

      ekranPaylas: async function (acik) {
        if (!cagri) return false;
        try {
          if (acik) await cagri.startScreenSharing(); else await cagri.stopScreenSharing();
          ev.yay('ekranPaylasimi', { id: 'ben', element: null, acik: !!acik });
          return true;
        } catch (e) { return yok('ekran', e); }
      },
      elKaldir: async function (acik) {
        var f = ozellik('el');
        if (!f) return yok('el');
        try { if (acik) await f.raiseHand(); else await f.lowerHand(); ev.yay('elKalkti', { id: 'ben', acik: !!acik }); return true; }
        catch (e) { return yok('el', e); }
      },
      tepkiGonder: async function (tur) {
        var f = ozellik('tepki');
        if (!f) return yok('tepki');
        try { await f.sendReaction({ reactionType: acsTepki(tur) }); return true; }
        catch (e) { return yok('tepki', e); }
      },

       
      gorunecek: function (idler) {
        izinli = new Set(idler || []);
        uzak.forEach(function (k) {
          var ok = izinli.has(k.id);
          k.akislar.forEach(function (s) { if (ok) akisCiz(k, s); else akisKaldir(k, s); });
        });
      },
      hazir: function () { return !!(window.MM_ACS && window.MM_ACS.CallClient); },
      ayril: function () { return bitir(true); },
      temizle: function () { return temizle(true); }
    };
  }

  window.MeetSaglayici = { olustur: function (tur) { return tur === 'taklit' ? taklit() : acs(); } };
})();
