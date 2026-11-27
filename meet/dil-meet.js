



(function () {
  'use strict';
  var dil = 'tr';
  try { var s = localStorage.getItem('mm_dil'); if (s === 'en' || s === 'tr') dil = s; } catch (e) {   }
  var q = /[?&]dil=(en|tr)\b/.exec(location.search);
  if (q) { dil = q[1]; try { localStorage.setItem('mm_dil', dil); } catch (e2) {   } }
  document.documentElement.lang = dil;
  window.MeetDil = { dil: dil, t: function (x) { return x; } };
  if (dil !== 'en') return;

  var TAM = {
    '‹ Uygulama': '‹ App', 'Uygulamaya dön': 'Back to the app', 'Hazırlanıyor…': 'Getting ready…',
    'Önce uygulamada giriş yapın': 'Sign in to the app first', 'Mumu Meet, uygulamadaki oturumunuzu kullanır.': 'Mumu Meet uses your session in the app.',
    'Mumu Meet, uygulamadaki oturumunuzu kullanır; giriş yaptıktan sonra bu sayfaya dönün.': 'Mumu Meet uses your session in the app; sign in, then come back to this page.',
    'Uygulamaya git': 'Go to the app', 'Ana ekran': 'Home', 'Görüntülü görüşme ve toplantılar': 'Video calls and meetings',
    'Toplantı işlemleri': 'Meeting actions', 'Yeni toplantı': 'New meeting', 'Hemen başlat': 'Start now', 'Yeni toplantı, hemen başlat': 'New meeting, start now',
    'Planla': 'Schedule', 'Sonrası için': 'For later', 'Toplantı planla': 'Schedule a meeting', 'Katıl': 'Join', 'Kod ya da bağlantıyla': 'With a code or link',
    'Toplantıya katıl, kod ya da bağlantıyla': 'Join a meeting with a code or link', 'Kod ya da bağlantı girin': 'Enter a code or link',
    'Toplantı kodu ya da bağlantısı': 'Meeting code or link', 'Başlık': 'Title', 'Toplantı başlığı': 'Meeting title',
    'Başlangıç (isteğe bağlı)': 'Start (optional)', 'Süre': 'Duration', 'Davetliler': 'Invitees', 'Kişi ara': 'Search people', 'Davetli ara': 'Search invitees',
    'Şimdi başlat': 'Start now', 'Vazgeç': 'Cancel', 'Toplantı hazır': 'Meeting is ready', 'Toplantı kodu': 'Meeting code', 'Toplantı bağlantısı': 'Meeting link',
    'Bağlantıyı kopyala': 'Copy link', '.ics indir': 'Download .ics', 'Kapat': 'Close', 'Yaklaşan toplantılar': 'Upcoming meetings', 'Çevrimiçi': 'Online',
    'Katılmadan önce': 'Before joining', 'Kamera kapalı': 'Camera off', 'Mikrofonu kapat': 'Turn off microphone', 'Mikrofonu aç': 'Turn on microphone',
    'Kamerayı kapat': 'Turn off camera', 'Kamerayı aç': 'Turn on camera', 'Kamerayı çevir (ön/arka)': 'Flip camera (front/back)', 'Kamerayı çevir': 'Flip camera',
    'Arka plan ve efektler': 'Background and effects', 'Kamera': 'Camera', 'Mikrofon': 'Microphone', 'Hoparlör': 'Speaker',
    'Toplantıyı başlat': 'Start the meeting', 'Bir sohbet seçin. Sohbetin üyelerine toplantı bağlantısı mesaj olarak gider.': 'Choose a chat. The meeting link is sent to the chat members as a message.',
    'Sohbet': 'Chat', 'Hemen katıl': 'Join now', 'Geri': 'Back', 'Görüşme kaydedilmez. Ses ve görüntü Microsoft Azure üzerinden iletilir.': 'The call is not recorded.',
    'Görüşme kaydedilmez.': 'The call is not recorded.',
    'Toplantıdan ayrıldınız': 'You left the meeting', 'Yeniden katıl': 'Rejoin', 'Toplantı ana ekranı': 'Meeting home', 'Arama bitti': 'Call ended', 'Yeniden ara': 'Call again',
    'Görüşmenin kalitesi nasıldı?': 'How was the call quality?', 'Geri bildiriminiz için teşekkürler.': 'Thank you for your feedback.',
    '1 yıldız': '1 star', '2 yıldız': '2 stars', '3 yıldız': '3 stars', '4 yıldız': '4 stars', '5 yıldız': '5 stars',
    'Katılımcılar': 'Participants', 'Yan panel': 'Side panel', 'Paneli kapat': 'Close panel', 'Kişi ekle': 'Add people', 'Çağır': 'Invite',
    'Kişiler yüklenemedi': 'Could not load people', 'Kişiler yüklenemedi ': 'Could not load people ', 'Yeniden dene': 'Try again', 'Bağlantıyla davet et': 'Invite with a link', 'Toplantıda': 'In the meeting',
    'Toplantı içi mesajlar bu sohbetin üyelerine de görünür.': 'In-meeting messages are also visible to the members of this chat.', 'Mesaj yazın': 'Type a message', 'Mesaj': 'Message', 'Gönder': 'Send',
    'Toplantı bağlantısı ': 'Meeting link ', 'Kopyala': 'Copy', 'Bağlantıya sahip olan ve sohbetin üyesi olan herkes katılabilir.': 'Anyone with the link who is a member of the chat can join.',
    'Toplantı denetimleri': 'Meeting controls', 'Altyazı (yakında)': 'Captions (coming soon)', 'Tepki gönder': 'Send a reaction', 'Beğen': 'Like', 'Kalp': 'Heart', 'Gülme': 'Laugh', 'Şaşırma': 'Surprise', 'Alkış': 'Applause', 'Kutlama': 'Celebrate',
    'Ekranı paylaş': 'Share screen', 'Paylaşımı durdur': 'Stop sharing', 'Elini kaldır': 'Raise hand', 'Elini indir': 'Lower hand', 'Diğer seçenekler': 'More options', 'Düzeni değiştir': 'Change layout',
    'Otomatik': 'Auto', 'Döşeme': 'Tiles', 'Spotlight': 'Spotlight', 'Kenar çubuğu': 'Sidebar', 'Tam ekran': 'Full screen', 'Ayarlar': 'Settings', 'Toplantı bilgisi': 'Meeting info',
    'Toplantıdan ayrıl': 'Leave the meeting', 'Toplantı içi sohbet': 'In-meeting chat',
    'Gönderiliyor…': 'Sending…', 'Çalıyor…': 'Ringing…', 'Davet gönderildi': 'Invite sent', 'Cevap yok': 'No answer', 'Yeniden çağır': 'Call again', 'Yeniden davet et': 'Invite again',
    'Eşleşen kişi yok.': 'No matching people.', 'Çağrılacak kişi yok.': 'No one to invite.', 'Çağrı şu an gönderilemedi. Bağlantıyı paylaşın.': 'The invite could not be sent right now. Share the link instead.',
    'Mesajlar alınamadı': 'Messages could not be loaded', 'Merhaba, sesim geliyor mu?': 'Hello, can you hear me?', 'Toplantıya katılın (taklit bağlantı)': 'Join the meeting (demo link)',
    'Galeri görünümü': 'Gallery view', 'Konuşan görünümü': 'Speaker view', 'Tepki': 'React',
    'Sessize al': 'Mute', 'Sesi aç': 'Unmute', 'Video kapat': 'Stop video', 'Video aç': 'Start video', 'Paylaş': 'Share', 'Durdur': 'Stop', 'El kaldır': 'Raise hand', 'El indir': 'Lower hand', 'Diğer': 'More', 'Ayrıl': 'Leave',
    'Kısayollar: Alt+A mikrofon, Alt+V kamera, Alt+S ekran paylaş, Alt+H el, Alt+C sohbet, Alt+U katılımcılar': 'Shortcuts: Alt+A microphone, Alt+V camera, Alt+S share screen, Alt+H hand, Alt+C chat, Alt+U participants',
    'Yeniden bağlanıyor…': 'Reconnecting…', 'Bağlantınız koptu. Yeniden bağlanılıyor…': 'You are offline. Reconnecting…', 'Bağlantı yeniden kuruldu': 'Connection restored',
    'Bağlanıyor…': 'Connecting…', 'Aranıyor/Çalıyor': 'Calling/Ringing', 'Aranıyor…': 'Calling…', 'Ekranınızı paylaşıyorsunuz': 'You are sharing your screen', 'Ekran paylaşımı durdu': 'Screen sharing stopped',
    'Elini kaldırdı': 'Hand raised', 'Mikrofon kapalı': 'Microphone off', 'Mikrofon açık': 'Microphone on', 'Sabitlemeyi kaldır': 'Unpin', 'Sabitle': 'Pin',
    'Kamera yok': 'No camera', 'Mikrofon yok': 'No microphone', 'Hoparlör yok': 'No speaker', 'Katılmaya hazır mısınız?': 'Ready to join?',
    'Şu anda kimse yok': 'No one is here yet', 'Bire bir sohbet': 'One-to-one chat', 'Hiç sohbetiniz yok. Önce uygulamanın Mesaj bölümünden bir sohbet açın.': 'You have no chats. Open a chat from the Messages section of the app first.',
    'Arama reddedildi': 'Call declined', 'Arama iptal edildi': 'Call cancelled', 'Arama kurulamadı': 'Could not connect the call', 'Arama başlatılamadı': 'Could not start the call', 'Aramaya katılınamadı': 'Could not join the call',
    'Toplantı bugün yalnız bilgisayar tarayıcısında': 'Meetings currently work only in a computer browser', 'Bu sayfa uygulama içinde değil, bilgisayarınızın tarayıcısında açılır.': 'This page opens in your computer browser, not inside the app.',
    'Giriş bileşeni hazır değil': 'Sign-in is not ready', 'Sayfayı yenileyin; sürerse uygulamadan açın.': 'Refresh the page; if it continues, open it from the app.',
    'Toplantı başlangıcından 10 dakika önce açılır.': 'Opens 10 minutes before the meeting starts.', 'Toplantı bulunamadı ya da bitti.': 'The meeting was not found or has ended.',
    'Bu toplantıya katılamazsınız.': 'You cannot join this meeting.', 'Toplantılar şu anda kapalı.': 'Meetings are currently turned off.', 'Çok fazla deneme yaptınız. Biraz bekleyip yeniden deneyin.': 'Too many attempts. Wait a moment and try again.',
    'Toplantıya katılınamadı.': 'Could not join the meeting.', 'Toplantıya katılınamadı': 'Could not join the meeting', 'Toplantı sahibinin onayı bekleniyor.': 'Waiting for the host to let you in.',
    'Oda henüz açılmadı; davetlilerden biri katılınca girebilirsiniz.': 'The room is not open yet; you can enter once an invitee joins.',
    'Toplantıya kabul edildiniz. Ses ve görüntü bağlantısı bu sürümde henüz bağlanmadı.': 'You were admitted to the meeting. Audio and video are not connected in this version yet.',
    'Toplantı bulunamadı': 'Meeting not found', 'Bu adres geçerli bir toplantıya ait değil.': 'This address does not belong to a valid meeting.',
    'En çok 200 davetli seçebilirsiniz.': 'You can select up to 200 invitees.', 'Kişi listesi alınamadı.': 'The people list could not be loaded.',
    'Toplantı bilgileri geçersiz. Başlık, zaman ve davetlileri kontrol edin.': 'The meeting details are not valid. Check the title, time and invitees.', 'Toplantı başlığı yazın.': 'Enter a meeting title.',
    'Planlamak için başlangıç tarih ve saatini seçin; hemen başlatmak için "Şimdi başlat" düğmesini kullanın.': 'To schedule, choose a start date and time; to start right away, use the "Start now" button.',
    'Başlangıç zamanı geçersiz.': 'The start time is not valid.', 'Başlangıç zamanı geçmişte olamaz.': 'The start time cannot be in the past.',
    'Bağlantı kopyalandı.': 'Link copied.', 'Bağlantı kopyalandı': 'Link copied', 'Kopyalanamadı; bağlantıyı seçip elle kopyalayın.': 'Could not copy; select the link and copy it manually.',
    'Geçerli bir toplantı bağlantısı girin. Bağlantıyı toplantıyı başlatan kişiden alabilirsiniz.': 'Enter a valid meeting link. You can get the link from the person who started the meeting.',
    'Arka plan efektleri bu görüşmede kullanılamıyor.': 'Background effects are not available in this call.', 'Cihaz değiştirilemedi.': 'Could not change the device.',
    'Altyazı yakında eklenecek.': 'Captions are coming soon.', 'Tam ekran açılamadı.': 'Could not open full screen.',
    'Bugün planlanmış toplantı yok': 'No meetings scheduled today', 'Satış toplantısı': 'Sales meeting', 'Haftalık planlama': 'Weekly planning', 'Ekip değerlendirmesi': 'Team review',
    'Oturum alınamadı. Uygulamaya giriş yapıp bu sayfayı yenileyin.': 'Could not get a session. Sign in to the app and refresh this page.', 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.': 'Could not reach the server. Check your connection.',
    'Oturum geçersiz. Uygulamaya yeniden giriş yapın.': 'Your session is not valid. Sign in to the app again.', 'Bu sohbetin üyesi değilsiniz.': 'You are not a member of this chat.', 'Grup üyesi değil': 'Not a group member',
    'Toplantı bulunamadı ya da süresi doldu (katılma, başlangıçtan 2 saat sonra kapanır).': 'The meeting was not found or has expired (joining closes 2 hours after the start).',
    'Çok fazla deneme. Bir dakika sonra yeniden deneyin.': 'Too many attempts. Try again in a minute.', 'Sunucu şu an yanıt vermiyor. Biraz sonra yeniden deneyin.': 'The server is not responding right now. Try again shortly.',
    'İstek geçersiz ya da sunucu beklenmeyen yanıt verdi.': 'The request was not valid or the server gave an unexpected response.', 'Görüşme bileşeni (SDK) yüklenemedi. Sayfayı yenileyin.': 'The call component could not be loaded. Refresh the page.',
    'Kamera bulunamadı ya da izin verilmedi.': 'No camera found or permission was not given.', 'Kamera bulunamadı ya da izin verilmedi': 'No camera found or permission was not given', 'Boş mesaj gönderilemez.': 'An empty message cannot be sent.',
    'Mesaj çok uzun (en çok 4000 karakter).': 'The message is too long (4000 characters at most).', 'Ekran paylaşımı': 'Screen sharing', 'El kaldırma': 'Raising a hand', 'Bu özellik': 'This feature',
    'Gelen arama': 'Incoming call', 'Görüntülü arama': 'Video call', 'Sesli arama': 'Voice call', 'Kabul et': 'Accept', 'Sesli kabul et': 'Accept with voice', 'Görüntülü kabul et': 'Accept with video',
    'Toplantıya çağırıyor…': 'Inviting you to a meeting…', 'Görüntülü arıyor…': 'Video calling…', 'Sesli arıyor…': 'Voice calling…', 'sizi toplantıya çağırıyor': 'is inviting you to a meeting',
    'Ön kamera (taklit)': 'Front camera (demo)', 'Arka kamera (taklit)': 'Back camera (demo)', 'Arka ultra geniş (taklit)': 'Back ultra-wide (demo)', 'Paylaşılan ekran (taklit)': 'Shared screen (demo)',
    'Yerleşik mikrofon (taklit)': 'Built-in microphone (demo)', 'Kulaklık mikrofonu (taklit)': 'Headset microphone (demo)', 'Yerleşik hoparlör (taklit)': 'Built-in speaker (demo)', 'Kulaklık (taklit)': 'Headphones (demo)',
    'Deneme sohbeti': 'Test chat', 'Deneme grubu': 'Test group', 'Bir katılımcı': 'A participant', 'Kişi': 'Person', 'Şimdi katıl': 'Join now', 'Başlatılıyor…': 'Starting…',
    'Çağrı durumu': 'Call status', 'Siz': 'You', 'Bugün': 'Today', 'Yarın': 'Tomorrow', 'Şimdi': 'Now', 'Kod ya da bağlantı': 'Code or link', 'Katılımcı': 'Participant',
    'Satış toplantısı': 'Sales meeting', 'Haftalık planlama': 'Weekly planning', 'Ekip değerlendirmesi': 'Team review'
  };
   
  var KALIP = [
    [/^(.+) \((Alt\+[A-Z])\)$/, function (m, a, k) { var c = cevir(a); return c + ' (' + k + ')'; }],    
    [/^(\d+) dakika$/, '$1 minutes'], [/^Katılımcı (\d+)$/, 'Participant $1'], [/\bKatılımcı (\d+)\b/g, 'Participant $1'], [/^Deneme Kişi (\d+)$/, 'Test person $1'],
    [/^(.*) katıldı$/, '$1 joined'], [/^(.*) ayrıldı$/, '$1 left'], [/^(.*) elini kaldırdı$/, '$1 raised a hand'], [/^(.*) ekranını paylaşıyor$/, '$1 is sharing their screen'],
    [/^(.*) \(Siz\)$/, '$1 (You)'], [/^Siz - (.*)$/, 'You - $1'], [/^(.*) kişisini çağır$/, 'Invite $1'], [/^(.*) toplantısına katıl$/, 'Join $1'], [/^(\d+) katılımcı$/, '$1 participants'],
    [/^(.*) ile hemen görüşme başlat$/, 'Start a call with $1 now'], [/^(.*) \(meşgul\)$/, '$1 (busy)'], [/^\((\d+) seçili\)$/, '($1 selected)'], [/^(.*) \(grup, (\d+) kişi\)$/, '$1 (group, $2 people)'],
    [/^Karşı katılımcı: (.*)$/, 'Remote participant: $1'], [/^Çağrı durumu: (.*)$/, 'Call status: $1'], [/^Beklenmeyen hata: (.*)$/, 'Unexpected error: $1'],
    [/^Mesajlar alınamadı \((.*)\)$/, 'Messages could not be loaded ($1)'], [/^Mesaj gönderilemedi: (.*)$/, 'Message could not be sent: $1'], [/^\.ics alınamadı: (.*)$/, 'Could not get the .ics file: $1'],
    [/^(.*) bu görüşmede\/cihazda desteklenmiyor\.$/, '$1 is not supported in this call/on this device.'], [/^Katılımcı (\d+) burada$/, 'Participant $1 is here'],
    [/^Participant 1, Participant 2( ve (\d+) kişi daha)? burada$/, function (m, a, n) { return 'Participant 1, Participant 2' + (n ? ' and ' + n + ' more' : '') + ' here'; }],
    [/^Katılımcı 1, Katılımcı 2( ve (\d+) kişi daha)? burada$/, function (m, a, n) { return 'Participant 1, Participant 2' + (n ? ' and ' + n + ' more' : '') + ' here'; }],
    [/^Toplantı başladı ancak bağlantı mesajı sohbete gönderilemedi \((.*)\)\. Bağlantıyı Bilgi panelinden kopyalayıp paylaşın\.$/, 'The meeting started but the link message could not be sent to the chat ($1). Copy the link from the Info panel and share it.'],
    [/^Toplantıya katılın: (.*)$/, 'Join the meeting: $1'], [/^(.*) ile görüşme$/, 'Call with $1'], [/^(.*) sunuyor$/, '$1 is presenting']
  ];
  var ATTR = ['aria-label', 'title', 'placeholder', 'alt'];
  var ATLA = '#msg-liste, .kisi-ad, .cal-ad, #p-kisiler .ad, #sohbet-sec, textarea, [data-veri]';

  function cevir(v) {
    if (!v) return v;
    var t = v.replace(/^\s+|\s+$/g, ''); if (!t) return v;
    var on = v.slice(0, v.indexOf(t)), son = v.slice(v.indexOf(t) + t.length), c = TAM[t];
    if (c === undefined) {
      c = t; for (var i = 0; i < KALIP.length; i++) { var r = KALIP[i]; if (r[0].test(c)) { c = c.replace(r[0], r[1]); break; } }
      if (c === t) return v;
      c = c.replace(/Satış toplantısı/g, 'Sales meeting').replace(/Haftalık planlama/g, 'Weekly planning').replace(/Ekip değerlendirmesi/g, 'Team review').replace(/\(meşgul\)/g, '(busy)').replace(/Deneme Kişi (\d+)/g, 'Test person $1').replace(/Katılımcı/g, 'Participant');
    }
    return on + c + son;
  }
  window.MeetDil.t = cevir;
   
  var YER = [[/^Katılımcı( \d+)?( \((?:Siz|You)\))?( · \d\d:\d\d)?$/, function (m, a, b, c) { return 'Participant' + (a || '') + (b ? ' (You)' : '') + (c || ''); }],
    [/^Deneme Kişi (\d+)$/, 'Test person $1'], [/^Deneme sohbeti$/, 'Test chat'], [/^Siz( · \d\d:\d\d)?$/, 'You$1'], [/^Kişi( · \d\d:\d\d)?$/, 'Person$1'],
    [/^Toplantıya katılın \(taklit bağlantı\)$/, 'Join the meeting (demo link)'], [/^(.*) \(Siz\)$/, '$1 (You)']];
  function yer(v) {
    if (!v) return v; var t = v.trim(); if (!t) return v;
    for (var i = 0; i < YER.length; i++) if (YER[i][0].test(t)) return v.replace(t, t.replace(YER[i][0], YER[i][1]));
    return v;
  }
  function atla(n) { var e = n.nodeType === 1 ? n : n.parentElement; return !!(e && e.closest && e.closest(ATLA)); }
  function duz(n) { var v = n.nodeValue, c = atla(n) ? yer(v) : cevir(v); if (c !== v) n.nodeValue = c; }
  function ozn(e) { var f = atla(e) ? yer : cevir; ATTR.forEach(function (a) { if (e.hasAttribute && e.hasAttribute(a)) { var v = e.getAttribute(a), c = f(v); if (c !== v) e.setAttribute(a, c); } }); }
  function tara(kok) {
    if (!kok) return;
    if (kok.nodeType === 3) { duz(kok); return; }
    if (kok.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(kok.tagName)) return;
    ozn(kok);
    var y = document.createTreeWalker(kok, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
    while ((n = y.nextNode())) { if (n.nodeType === 3) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode.tagName)) duz(n); } else ozn(n); }
  }
  function basla() {
    document.title = cevir(document.title);
    tara(document.body);
    new MutationObserver(function (l) {
      l.forEach(function (m) {
        if (m.type === 'childList') m.addedNodes.forEach(tara);
        else if (m.type === 'characterData') duz(m.target);
        else if (m.type === 'attributes') ozn(m.target);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  }
  if (document.body) basla(); else document.addEventListener('DOMContentLoaded', basla);
})();
