



(function () {
  'use strict';
  var dil = 'tr';
  try { var s = localStorage.getItem('mm_dil'); if (s === 'en' || s === 'tr') dil = s; } catch (e) { }
  var q = /[?&]dil=(en|tr)\b/.exec(location.search);
  if (q) { dil = q[1]; try { localStorage.setItem('mm_dil', dil); } catch (e) { } }
  var EN = dil === 'en';
  window.MM_LOC = EN ? 'en-GB' : 'tr-TR';
  document.documentElement.lang = dil;

   
  var TAM = {
     
    'Şirket bugün': 'Company today', 'Dikkat gerekiyor': 'Needs attention', 'Takip gerekiyor': 'Needs follow-up', 'Her şey yolunda': 'All on track', 'Veri bekleniyor': 'Awaiting data',
    'acil': 'urgent', 'izlenen': 'watching', 'yolunda': 'on track', 'Önce bunlar': 'First things first', 'Ayrıntılı özet': 'Detailed summary', 'Bugün dikkat': 'Needs attention today',
    'Veri: tarih bilinmiyor': 'Data: date unknown', 'Blokeli': 'Blocked', 'teslimat blokajı var': 'delivery block set', 'vade bilinmiyor': 'due date unknown', 'vade girilmemiş': 'due date not entered', 'Son aramalar:': 'Recent searches:', 'Sipariş ara': 'Search orders','Siparişler': 'Orders', 'açık': 'open', 'çıkış bekliyor': 'awaiting dispatch', 'aktarım bekliyor': 'awaiting posting', 'açık sipariş': 'open orders',
    'süresi geçen': 'expired', 'yolda': 'in transit', 'hat': 'lines', 'gecikme yok': 'no delays', 'bekleyen yok': 'none pending', 'süresi geçen yok': 'none expired', 'tüm hatlar çalışıyor': 'all lines running',
     
    'İhaleler': 'Tenders', 'Açık ihaleler ve bizimle ilgili kalemler': 'Open tenders and the items relevant to us', 'Açık ihale': 'Open tenders', 'İlgili kalem': 'Relevant items',
    '7 gün içinde son tarih': 'Due within 7 days', 'Karar bekleyen': 'Awaiting decision', 'DMO dışı': 'Non-DMO', 'İhale türleri': 'Tender types', 'İlgi filtresi': 'Relevance filter', 'Ürün grubu': 'Product group',
    'Yalnız ilgili': 'Relevant only', 'Tümü': 'All', 'Hepsi': 'All', 'Spanç': 'Gauze swab', 'Batın': 'Abdominal pad', 'Gazlı bez': 'Gauze roll', 'Eldiven': 'Gloves', 'Tampon': 'Tampon',
    'Karar aşamasında': 'In decision', 'Satış müdürü işlemde': 'Handled by sales manager', 'Açık': 'Open', 'son tarih bilinmiyor': 'due date unknown', 'miktar yok': 'no quantity',
    'Bir sohbet seçin': 'Select a chat', 'Soldaki listeden bir sohbet açın ya da yeni sohbet başlatın.': 'Open a chat from the list on the left or start a new one.',
    'Merhaba, size nasıl yardımcı olabilirim?': 'Hello, how can I help you?', 'Aşağıya sorunuzu yazın; yanıtı yetkiniz olan bölümlerden hazırlarım.': 'Type your question below; I answer from the sections you have access to.',
    'Açık siparişlerin durumu nedir?': 'What is the status of open orders?', 'Bugün hangi makinelerde duruş var?': 'Which machines have downtime today?', 'Kritik stok seviyesindeki ürünler hangileri?': 'Which products are at critical stock level?', 'Eldiven konteynerlerinin durumu nedir?': 'What is the status of the glove containers?',
    'Soruyu mail ile ilet': 'Send the question by email', 'İş olarak ilet': 'Send as a request', 'Sorunuzu yazın…': 'Type your question…', 'Sorular ve cevaplar denetim için kayda alınır, 90 gün saklanır.': 'Questions and answers are recorded for audit and kept for 90 days.', 'Cevap hazır olunca bu ekranda görünür.': 'The answer will appear on this screen when ready.', 'Asistan yazma özelliği kurulunca bu ekrandan soru sorabileceksiniz. Şimdilik sorunuzu mail ile iletin; cevap kendi yetkinize göre verilir.': 'Once the assistant writing feature is set up you can ask questions here. For now, send your question by email; the answer follows your own access rights.',
    'Fiyat önerisi': 'Price suggestion', 'Mail at': 'Send mail', 'Asistan önerili tabloyu kontrol edip size mail eder': 'The assistant will check the suggested table and email it to you',
    'geçmiş fiyat bulunamadı': 'no past price found', 'maliyet modeli yok': 'no cost model', 'Bant maliyetin altında': 'Range is below cost', 'En düşük': 'Lowest', 'Son': 'Latest', 'En yüksek': 'Highest',
    'öneri; karar: yönetim': 'suggestion; decision: management', 'öneri; karar: satış': 'suggestion; decision: sales', 'Kalem seçilmedi.': 'No item selected.', 'Kalem bilgisi yok.': 'No item information.',
    'Bizimle ilgili kalem yok.': 'No relevant items.', 'İhale yok': 'No tenders', 'Bu filtreyle eşleşen ihale yok.': 'No tender matches this filter.', 'Şu an açık ihale görünmüyor.': 'No open tenders right now.',
    'İhaleler alınamadı': 'Tenders could not be loaded', 'Bu bölüm sizin için kapalı': 'This section is not open to you', 'Erişim için yöneticinize başvurun.': 'Contact your administrator for access.',
    'Maliyet tabanı: ': 'Cost floor: ', ' geçmiş fiyat': ' past price(s)', ' gün kaldı': ' day(s) left', ' · süresi geçti': ' · expired', ' · bugün': ' · today', ' ilgili kalem': ' relevant item(s)',
    'DMO: robot ': 'DMO: robot ', 'DMO dışı: günlük defter': 'Non-DMO: daily log', ' · eski': ' · stale', ' kalem seç': ' select',
     
    'Sterilizasyon': 'Sterilization', 'Sevk geçiş deposu ve lotlar': 'Dispatch transit store and lots', 'Kalite bildir': 'Report quality issue', 'Bugün': 'Today', 'Lotlar': 'Lots',
    'Sevk geçiş deposunda': 'In dispatch transit store', 'Karantinada': 'In quarantine','Kalite kararı bekleyen': 'Awaiting quality decision', 'son 30 günde açılan': 'opened in the last 30 days',
    'Giren adet': 'Units in', 'Çıkan adet': 'Units out', 'son 7 gün': 'last 7 days', 'Günlük giren adet': 'Daily units in', 'Günlük çıkan adet': 'Daily units out',
    'Hareket bilgisi şu an alınamıyor.': 'Movement data is not available right now.', 'Son 7 günde sevk geçiş deposunda hareket olmadı.': 'No movement in the dispatch transit store in the last 7 days.',
    'Lot kaydı yok': 'No lot records', 'Sevk geçiş deposunda lot bulunamadı.': 'No lots found in the dispatch transit store.', 'Ürün veya lot ara': 'Search product or lot', 'Eşleşen lot yok.': 'No matching lots.',
    'Ürün': 'Product', 'Lot': 'Lot', 'Depoda': 'In store', 'Giren': 'In', 'Çıkan': 'Out', 'Son hareket': 'Last movement', 'Durum': 'Status', 'Sevk edildi': 'Shipped',
    'Sterilizasyon alınamadı': 'Could not load sterilization', 'Sterilizasyon görünümleri': 'Sterilization views',
    'Kalite problemi bildir': 'Report a quality problem', 'Yetki tanımlanınca açılacak': 'Will open once access is granted', 'Kalite problemi bildirme ekranı, kullanıcı yetkisi verildiğinde burada açılır.': 'The quality problem screen opens here once user access is granted.',
    'Bölüm / hat': 'Section / line', 'Seçin': 'Select', 'Makine / tezgâh (isteğe bağlı)': 'Machine / loom (optional)', 'Ürün (isteğe bağlı)': 'Product (optional)', 'Lot (isteğe bağlı)': 'Lot (optional)',
    'Problem türü': 'Problem type', 'Önem': 'Severity', 'Açıklama': 'Description', 'Ne gördünüz, nerede, kaç adet? (en az 10 karakter)': 'What did you see, where, how many? (at least 10 characters)',
    'Galeriden seç': 'Choose from gallery', 'Fotoğraf ekleyin (en çok 6)': 'Add photos (up to 6)', 'Bildirdiklerim': 'My reports', 'Henüz kayıt yok': 'No reports yet',
    'Kayıt gönderildi.': 'Report sent.', 'Kayıt saklandı, bağlantı gelince gönderilecek.': 'Report saved, it will be sent when you are online.', 'Yeniden bildirin.': 'Please report again.',
    'Dokuma': 'Weaving', 'Spanç / Mabotex': 'Sponge / Mabotex', 'Kompres': 'Gauze pad', 'Batın': 'Abdominal pad', 'Paketleme': 'Packaging', 'Sterilizasyon': 'Sterilization', 'Hammadde / Depo': 'Raw material / Store', 'Diğer': 'Other',
    'Ölçü / gramaj dışı': 'Out of size / weight', 'Delik / yırtık': 'Hole / tear', 'Leke / kirlilik / yabancı madde': 'Stain / dirt / foreign matter', 'Gevşek / kopuk dikiş': 'Loose / broken stitch',
    'Yanlış / eksik etiket-baskı': 'Wrong / missing label or print', 'Ambalaj / paket hatası': 'Packaging defect', 'Sterilizasyon / indikatör uygunsuzluğu': 'Sterilization / indicator nonconformity',
    'Hammadde uygunsuzluğu': 'Raw material nonconformity', 'Makine ayarı / duruş kaynaklı': 'Machine setting / stoppage related',
    'Düşük (bilgi)': 'Low (information)', 'Orta (hat izlensin)': 'Medium (monitor the line)', 'Yüksek (durdurma / ayırma gerekli)': 'High (stop / segregate)',
    'Düşük': 'Low', 'Orta': 'Medium', 'Yüksek': 'High', 'Bu ekran için yetkiniz yok': 'You do not have access to this screen', 'Yükleme şu an kapalı': 'Upload is closed right now', 'Lütfen daha sonra tekrar deneyin.': 'Please try again later.',
    'DMO Nakliyat →': 'DMO Freight →', '← DMO': '← DMO', '← Nakliye': '← Logistics', 'Bölüm geçişi': 'Section links',
    'Ana sayfa': 'Home', 'Makineler': 'Machines', 'Eldiven': 'Gloves', 'Siparişler': 'Orders', 'DMO': 'DMO', 'Stok': 'Stock', 'Kalite': 'Quality', 'İSG': 'OHS', 'Nakliye': 'Logistics',
    'Sürüm': 'Version', 'Rol: ': 'Role: ', 'Oturumunuzun yenilenmesi gerekiyor — alttaki kırmızı “Oturumu yenile” düğmesine dokunun': 'Your session needs to be renewed — tap the red “Renew session” button below',
    'İK': 'HR', 'Onaylar': 'Approvals', 'Asistan': 'Assistant', 'Yönetim': 'Management', 'Finans': 'Finance', 'Muhasebe': 'Accounting', 'Diğer': 'More', 'Yakında': 'Coming soon',
    'Diğer modüller': 'More sections', 'Yakında gelecek modüller': 'Sections coming soon', 'Modüller': 'Sections', 'Modül': 'Section', 'Eylem': 'Action', 'Eylemler': 'Actions',
    'Menüyü aç / daralt': 'Open / collapse menu', 'Bildirimler': 'Notifications', 'Temayı değiştir': 'Change theme', 'Açık / koyu tema': 'Light / dark theme',
    'Açık temaya geç': 'Switch to light theme', 'Koyu temaya geç': 'Switch to dark theme', 'Ara…': 'Search…', 'Ara': 'Search', 'Kapat': 'Close', 'Sonuçlar': 'Results', 'Ara ve git': 'Search and go',
    'Ara (konteyner, sipariş, makine, belge)': 'Search (container, order, machine, document)',
    'Temayı değiştir (açık / koyu)': 'Change theme (light / dark)', 'Görünüm': 'Appearance', 'Bildirimleri aç': 'Open notifications', 'Uyarılar': 'Alerts', 'Tanıtımı yeniden göster': 'Show the intro again',
    'Kısa tur': 'Quick tour', 'Verileri yenile': 'Refresh data', 'Kaynakları yeniden oku': 'Re-read the sources', 'Konteyner': 'Container', 'Sipariş': 'Order', 'Makine': 'Machine', 'Belge': 'Document',
    'Konteyner, sipariş, makine, belge ara…': 'Search container, order, machine, document…',
    'Konteyner no, sipariş no, hat/tezgâh no, belge adı veya modül adı deneyin.': 'Try a container no., order no., line/loom no., document name or section name.',
    'Kritik': 'Critical', 'Uyarı': 'Warning', 'Bilgi': 'Info', 'Bazı kaynaklar okunamadı': 'Some sources could not be read', 'Şu an bildirim yok': 'No notifications right now',
    'Bazı bölümlerin verisi şu an alınamıyor': 'Data for some sections is unavailable right now',
    'Makine alarmı, süresi dolan konteyner, geciken sipariş ve yaklaşan belge tarihleri burada görünür.': 'Machine alarms, expired containers, late orders and upcoming document dates appear here.',
    'Diğer uyarılar': 'Other alerts', ' Okundu işaretle': ' Mark as read',
    'Hastane, ürün, SMT, dosya no, sipariş no, irsaliye / nakliye no ara…': 'Search hospital, product, SMT, file no., order no., delivery note / shipment no…',
    'Nakliye no, irsaliye, firma, hastane, plaka ara…': 'Search shipment no., delivery note, company, hospital, plate…',
    'Banka, tür, tarih, tutar ara…': 'Search bank, type, date, amount…',
    'Fatura no, müşteri, belge ara…': 'Search invoice no., customer, document…', 'Hat, tezgâh no, reçete, ürün ara…': 'Search line, loom no., recipe, product…',
    'Belge adı, konu ara…': 'Search document name, subject…', 'Bu sayfadaki kayıtlarda ara…': 'Search the records on this page…', 'Ürün, depo, parti ara…': 'Search product, warehouse, batch…',
    'Bu sayfada ara…': 'Search this page…', 'Bu sayfada ara': 'Search this page', 'Aramayı temizle': 'Clear search', 'Temizle': 'Clear', 'Tüm uygulamada ara (Ctrl/⌘ K)': 'Search the whole app (Ctrl/⌘ K)', 'Tümünde ara': 'Search all tabs', 'Bu bölümün bütün sekmelerinde ara (Ctrl/⌘ Shift K: tüm uygulama)': 'Search all tabs of this section (Ctrl/⌘ Shift K: whole app)',
    'Veri eski': 'Data is stale', 'Yaklaşan son tarihler': 'Upcoming deadlines', 'Sayfaya git': 'Go to page', 'Çalışıyor': 'Running', 'Durdu': 'Stopped', 'Veri yok': 'No data', 'veri yok': 'no data',
    'çalışıyor': 'running', 'uyarı': 'warning', 'bugün': 'today', 'dün': 'yesterday', 'geçen hafta': 'last week', 'Fabrika verisi alınamıyor': 'Factory data unavailable', 'Fabrika verisi eski': 'Factory data is stale',
    'Neden bildirilmedi': 'Reason not reported', 'neden bildirilmedi': 'reason not reported', 'Fabrika': 'Factory', 'Satış': 'Sales', 'Çalışan': 'Employee', 'Eldiven finans': 'Glove finance',
    'İyi geceler': 'Good night', 'Günaydın': 'Good morning', 'İyi günler': 'Good afternoon', 'İyi akşamlar': 'Good evening', 'Kompres hatları': 'Compress lines', 'Dokuma salonu': 'Weaving hall',
    'Açık alarm': 'Open alarms', 'Eldiven sevkiyatı': 'Glove shipments', 'ÖRNEK': 'SAMPLE', 'ÖRNEK VERİ — gerçek değil': 'SAMPLE DATA — not real', 'ÖRNEK VERİ — fabrika rakamları gerçek değil': 'SAMPLE DATA — factory figures are not real',
    'açık sipariş': 'open orders', 'süresi geçen': 'overdue', 'Kalite belgeleri': 'Quality documents', 'İSG takvimi': 'OHS calendar', 'Veri kaynakları ve güncelliği': 'Data sources and freshness',
    'okunamadı': 'could not be read', ' · eski': ' · stale', 'Bugün dikkat': 'Needs attention today', 'Şu an dikkat gerektiren bir madde yok.': 'Nothing needs attention right now.', 'Konum': 'Location',
    'Gösterilecek özet yok': 'No summary to show', 'Gösterilecek bölüm verisi şu an yok.': 'There is no section data to show right now.', 'Yeniden dene': 'Try again', 'Bir bölüm': 'A section',
    'Bu bölümün verisi henüz hazır değil': 'This section’s data is not ready yet', 'Bağlantı kurulamadı, biraz sonra yenileyin': 'Could not connect; please refresh shortly', 'Bu bölümü görme yetkiniz yok': 'You do not have access to this section',
    'Bu bölüm henüz kullanıma açılmadı': 'This section is not open yet', 'Bu bölümün verisi şu an alınamıyor': 'This section’s data is unavailable right now', 'Microsoft girişi yapılmadı': 'Not signed in to Microsoft',
    'Giriş yapılandırılmadı': 'Sign-in not configured', 'Giriş kullanılamıyor': 'Sign-in unavailable', 'Giriş yapıldı': 'Signed in', 'Microsoft ile giriş': 'Sign in with Microsoft', 'Giriş hazırlanıyor…': 'Preparing sign-in…', 'Giriş başarısız': 'Sign-in failed',
    'Giriş şu an kullanılamıyor': 'Sign-in is unavailable right now', 'Microsoft hesabıyla giriş yap': 'Sign in with your Microsoft account', 'Microsoft girişi bu ortamda kullanılamıyor': 'Microsoft sign-in is not available in this environment',
    'Microsoft girişi hazırlanıyor': 'Preparing Microsoft sign-in', 'Microsoft girişi başlatılamadı — dokunup yeniden deneyin': 'Microsoft sign-in could not start — tap to retry',
    'Giriş bu ortamda kullanılamıyor': 'Sign-in is not available in this environment', 'Giriş hazırlanıyor': 'Preparing sign-in', 'Giriş başlatılamadı — dokunup yeniden deneyin': 'Sign-in could not start — tap to retry', 'Giriş gerekli': 'Sign-in required', 'Giriş yapılmadı': 'Not signed in', 'Giriş henüz hazır değil': 'Sign-in is not ready yet',
    'Canlı': 'Live', 'Gün': 'Day', 'Ürün': 'Product', 'Duruş': 'Downtime', 'Personel': 'Personnel', 'Hedefe yakın': 'Close to target', 'Hedefin altında': 'Below target', 'Hedefe göre başarı': 'Achievement vs target',
    'Veri şu an alınamıyor': 'Data unavailable right now', 'Canlı veri henüz bağlı değil': 'Live data is not connected yet', 'Giriş ayarı bekleniyor': 'Sign-in setup pending', 'Microsoft girişi gerekli': 'Microsoft sign-in required',
    'Veri dosyası bulunamadı': 'Data file not found', 'Veriye ulaşılamadı': 'Could not reach the data', 'Veri okunamadı': 'Data could not be read', 'Kompres hattı çalışıyor': 'Compress lines running',
    'Dokuma tezgâhı çalışıyor': 'Looms running', 'Dokuma ort. verim': 'Weaving avg. efficiency', 'Çalışan tezgâh': 'Running looms', 'Tüm tezgâhlar yolunda': 'All looms on track', 'Şimdi dikkat': 'Needs attention now',
    'Dikkat gerektiren tezgâh yok.': 'No loom needs attention.', 'Dokuma salonu — genel durum': 'Weaving hall — overall status', 'Dokuma — dikkat': 'Weaving — attention', 'En düşük verimli 5 tezgâh': '5 lowest-efficiency looms',
    'Bu hafta': 'This week', 'Bugün toplam kompres': 'Total compress today', 'Üretilen / hedef': 'Produced / target', 'kısmi': 'partial', 'Hız': 'Speed', 'Kayıp bugün': 'Loss today', 'Blister bugün': 'Blister today', 'Reçete': 'Recipe',
    'Veri yaşı': 'Data age', 'Tamamlanan günler': 'Completed days', 'Kullanılabilirlik': 'Availability', 'Performans (verim)': 'Performance (efficiency)', 'OEE': 'OEE', 'şüpheli': 'suspect', 'çalıştı': 'ran', 'yavaş': 'slow',
    'Akış verisi yok': 'No flow data', 'Kayıp nedeni bildirilmedi.': 'Loss reason not reported.', 'Kayıp nedenleri Pareto': 'Loss reasons Pareto', 'Şu an duran tezgâh yok.': 'No loom is stopped right now.',
    'Alarm durumu okunamadı': 'Alarm status could not be read', 'Açık alarm yok.': 'No open alarms.', 'Bildirilen uyarı yok.': 'No alerts reported.', 'KIRMIZI': 'RED', 'SARI': 'YELLOW', 'BİLGİ': 'INFO',
    'Batın': 'Batın (auto)', 'Otomatik batın makineleri': 'Automatic Batın machines', 'Spanç': 'Gauze (Spanç)', 'Mabotex katlama / paketleme': 'Mabotex folding / packing', 'Paketleme': 'Packing', 'Robot kolileme ve paletleme': 'Robot casing and palletising',
    'Sterilizasyon': 'Sterilisation', 'EtO çevrimleri': 'EtO cycles', 'RFID': 'RFID', 'Koli okuma noktaları': 'Case reading points', 'bağlanıyor': 'connecting', 'Makine grupları': 'Machine groups',
    'Bağlı olanlar canlı; diğerleri bağlanınca eklenir': 'Connected ones are live; the others are added once connected', 'Dokuma salonu — tezgâh durumu': 'Weaving hall — loom status', 'Kompres hat kartları': 'Compress line cards',
    'Hat verisi yok': 'No line data', 'Kaynak hat listesi göndermedi.': 'The source did not send a line list.', 'Verim göstergesi (OEE)': 'Efficiency gauge (OEE)', 'Vardiya zaman çizelgesi': 'Shift timeline', 'Çalışma / duruş şeridi': 'Run / stop strip',
    'Açık alarmlar': 'Open alarms', 'Dikkat': 'Attention', 'Neden': 'Reason', 'Dakika': 'Minutes', 'Günlük kompres üretimi (hat toplamı)': 'Daily compress output (line total)', 'önceki gün': 'previous day', 'tahmin içerir': 'includes estimate',
    'hat toplamı': 'line total', 'Son 7 gün toplamı': 'Last 7 days total', 'önceki 7 gün': 'previous 7 days', 'Bugünkü kompres (hat toplamı)': 'Compress today (line total)', 'Dokuma metre (bugün)': 'Weaving metres (today)',
    'Bugünkü kompres — hat bazında': 'Compress today — by line', 'Hat satırına dokunun: ayrıntı': 'Tap a line row for details', 'Kompres bugün': 'Compress today', 'Tahmin (dış kaynak)': 'Estimate (external source)',
    'Dokuma salonları (bu vardiya)': 'Weaving halls (this shift)', 'şu an duran tezgâhlar': 'looms stopped right now', 'Tüm salon': 'Whole hall', 'Geçmiş veri yok': 'No history', 'makine ölçümü': 'machine measurement',
    'Ölçüm': 'Measurement', 'Tahmin payı': 'Estimate share', 'Hat bazında': 'By line', 'Günlük dokuma metresi': 'Daily weaving metres', 'Günlük dokuma verimi': 'Daily weaving efficiency', 'Dokuma — günlük metre': 'Weaving — daily metres',
    'Verim %': 'Efficiency %', 'Dokuma — günlük verim (%)': 'Weaving — daily efficiency (%)', 'Ürün verisi yok': 'No product data', 'Tezgâh': 'Loom', 'Müdahale — bu vardiya': 'Interventions — this shift', 'Toplam dk': 'Total min', 'Ort. dk': 'Avg. min',
    'Şu an duran tezgâhlar': 'Looms stopped right now', 'Personel — kapalı': 'Personnel — closed', 'Vardiya başarısı': 'Shift achievement', 'Vardiya hedefi (tam)': 'Shift target (full)', 'Gün (08:00–08:00)': 'Day (08:00–08:00)',
    'Hedef kaynağı': 'Target source', 'Hedefe fark': 'Gap to target', 'Hedefe göre durum': 'Status vs target', 'Arıza olayı': 'Fault events', 'Duruş sayısı': 'Stop count', 'Gerçek / ideal çevrim': 'Actual / ideal cycle', 'Fire': 'Scrap',
    'Başlıca kayıp nedenleri': 'Main loss reasons', 'Verim (OEE) ve arıza': 'Efficiency (OEE) and faults', 'bu vardiya': 'this shift', 'Arıza ve kayıp': 'Faults and losses', 'Vardiya zaman şeridi': 'Shift timeline strip',
    'Saatlik üretim': 'Hourly output', 'saatlik hedef': 'hourly target', 'Saat': 'Hour', 'Üretilen': 'Produced', 'Başarı %': 'Achievement %', 'Vardiya geçmişi': 'Shift history', 'Başarı': 'Achievement', 'Hat bulunamadı': 'Line not found',
    'istifleyici hat': 'stacker line', 'paketleme hattı': 'packing line', 'Makinelere dön': 'Back to machines', 'Kompres (bu vardiya)': 'Compress (this shift)', 'Hız akışı': 'Speed flow', 'Saat (TR)': 'Hour (TR)', 'Hız /dk': 'Speed /min',
    'Çevrim': 'Cycles', 'Kompres': 'Compress', 'Durum': 'Status', 'Durum şeridi (kısa pencere)': 'Status strip (short window)', 'Günlük kompres': 'Daily compress', 'ölçüm': 'measurement', 'Tür': 'Type', 'Bilgiler': 'Details',
    'Çevrim bugün': 'Cycles today', 'Sayaç': 'Counter', 'Duruş nedeni': 'Downtime reason', 'Veri toplayıcılar ve uyarılar': 'Data collectors and alerts', 'Bu hat için toplayıcı kaydı yok.': 'No collector record for this line.',
    'geç': 'late', 'kapalı': 'closed', 'canlı': 'live', 'Metre (vardiya)': 'Metres (shift)', 'Atkı': 'Weft', 'Salon': 'Hall', 'Ürün kodu': 'Product code', 'Duruş süresi': 'Downtime duration', 'Duruş başlangıcı': 'Downtime start',
    'Çalışma / duruş': 'Run / stop', 'Durum değişimleri': 'Status changes', 'kısa pencere': 'short window', 'Fabrika görünümleri': 'Factory views', 'Canlı fabrika durumu': 'Live factory status', ' (kapalı)': ' (closed)',
    'Son 7 gün': 'Last 7 days', 'Son 30 gün': 'Last 30 days', 'Kayıt yok.': 'No records.', 'Açık düzeltmeler': 'Open corrections',
    'Hafta': 'Week', 'Ay': 'Month', 'Hesap': 'Account', 'Dil / Language': 'Dil / Language',
     
    'Canlı': 'Live', '{n} hatta veri gecikmeli': 'Data delayed on {n} line(s)', 'Veri gecikmeli (son: {t})': 'Data delayed (last: {t})', 'Veri gecikmeli': 'Data delayed',
     
    'Filtre': 'Filter', 'Filtreyi temizle': 'Clear filter', 'Eski veri': 'Old data', 'Görünümler': 'Views', 'Filtreler': 'Filters', 'dk': 'min', 'sa': 'h', 'Daha az': 'Less'
  };
   
  var TAM41 = {
    'Mali tablolar': 'Financial statements', 'Gelir tablosu': 'Income statement', 'Net satış': 'Net sales', 'Brüt satış': 'Gross sales', 'İade ve indirimler': 'Returns and discounts',
    'Satılan malın maliyeti': 'Cost of goods sold', 'Brüt kâr': 'Gross profit', 'Brüt marj': 'Gross margin', 'Faaliyet giderleri': 'Operating expenses', 'Pazarlama': 'Marketing', 'Genel yönetim': 'General administration',
    'Esas faaliyet kârı': 'Operating profit', 'Diğer gelirler': 'Other income', 'Diğer giderler': 'Other expenses', 'Finansman giderleri': 'Financing expenses', 'Olağan dışı gelir': 'Extraordinary income', 'Olağan dışı gider': 'Extraordinary expense',
    'Dönem kârı (vergi öncesi)': 'Profit for the period (before tax)', 'FAVÖK': 'EBITDA', 'FAVÖK marjı': 'EBITDA margin', 'Amortisman öncesi faaliyet kârı': 'Operating profit before depreciation',
    'Bu dönem': 'This period', 'Önceki dönem': 'Previous period', 'Değişim': 'Change', 'Toplam': 'Total', 'Dönem': 'Period', 'Seçili dönem': 'Selected period',
    'Son 3 ay': 'Last 3 months', 'Son 6 ay': 'Last 6 months', 'Son 9 ay': 'Last 9 months', 'Son 12 ay': 'Last 12 months',
    'Aylık net satış': 'Monthly net sales', 'Aylık FAVÖK': 'Monthly EBITDA', 'Marj eğilimi': 'Margin trend', 'Brüt marj ve FAVÖK marjı, % olarak': 'Gross margin and EBITDA margin, in %',
    'Veri kaynakları': 'Data sources', 'Kod, ad, lot, EAN ara': 'Search code, name, batch, EAN', 'Barkod okut': 'Scan barcode', 'Eylemler ▾': 'Actions ▾', 'Riskli olanlar': 'At-risk only', 'Önümüzdeki 30 gün taksit': 'Instalments, next 30 days', 'Gecikmiş sipariş': 'Overdue orders', 'Dikkat seviyesi': 'Attention level',
    'Bilanço özeti': 'Balance sheet summary', 'Varlıklar': 'Assets', 'Kaynaklar': 'Liabilities and equity', 'Nakit ve benzeri': 'Cash and equivalents', 'Ticari alacaklar': 'Trade receivables', 'Stoklar': 'Inventories',
    'Diğer dönen varlıklar': 'Other current assets', 'Duran varlıklar': 'Non-current assets', 'Kısa vadeli borçlar': 'Short-term liabilities', 'Uzun vadeli borçlar': 'Long-term liabilities', 'Özkaynak': 'Equity',
    'Finansal oranlar': 'Financial ratios', 'Cari oran': 'Current ratio', 'Likidite oranı': 'Liquidity ratio', 'Nakit oranı': 'Cash ratio', 'Alacak tahsil süresi': 'Receivables collection period',
    'Stokta kalma süresi': 'Inventory holding period', 'Borç ödeme süresi': 'Payables payment period', 'Nakit döngüsü': 'Cash cycle',
    'Maliyeti kapanmış ay': 'Month with closed costing', 'Maliyeti tamamlanmadı': 'Costing not completed', 'Maliyeti tamamlanmamış ay': 'Month with incomplete costing',
    'Mali tablo verisi yok': 'No financial statement data', 'Mali tablolar alınamadı': 'Financial statements could not be loaded',
     
    'Önemli sapmalar': 'Significant variances', 'Eşiği aşan sapma yok.': 'No variance above the threshold.', 'Olumlu yönde': 'Favourable', 'Olumsuz yönde': 'Unfavourable', 'Ay/ay': 'Month/month', 'Yıl/yıl': 'Year/year', 'Değer': 'Value',
    'Satılan malın maliyeti': 'Cost of goods sold', 'Dönem kârı (vergi öncesi)': 'Profit for the period (before tax)', 'Önemli sapma: ': 'Significant variance: ',
    'Ciro köprüsü': 'Net sales bridge', 'Önceki aya göre': 'Versus previous month', 'Geçen yılın aynı ayına göre': 'Versus same month last year', 'Yıl başı, geçen yılın aynı dönemine göre': 'Year to date versus same period last year',
    'Fiyat etkisi': 'Price effect', 'Hacim / ürün karışımı etkisi': 'Volume / product mix effect', 'Yeni ürün': 'New products', 'Biten ürün': 'Discontinued products', 'İade etkisi': 'Returns effect', 'Faturalandırma dışı / GL farkı': 'Non-invoiced / GL difference',
    'En etkili 10 malzemeyi göster': 'Show the 10 most impactful materials', 'En etkili malzemeleri gizle': 'Hide the most impactful materials', 'Malzeme': 'Material', 'Toplam etki': 'Total effect', 'Fiyat': 'Price', 'Hacim / karışım': 'Volume / mix', 'Yeni': 'New', 'Biten': 'Discontinued',
    'Köprü GL net satıştan başlar ve GL net satışta kapanır; son satır, faturalandırma dışı kayıtların GL farkındaki değişimini taşır.': 'The bridge starts at GL net sales and closes at GL net sales; the last step carries the change in the GL difference from non-invoiced entries.',
    'Nakit akışı': 'Cash flow', 'Dolaylı yöntem, aylık · yatırım ve finansman yaklaşık': 'Indirect method, monthly · investing and financing are approximate', 'Aylık nakit akışı': 'Monthly cash flow', 'Faaliyet': 'Operating', 'Yatırım (yaklaşık)': 'Investing (approx.)', 'Finansman (yaklaşık)': 'Financing (approx.)',
    'Faaliyetlerden nakit': 'Cash from operations', 'Nakit değişimi': 'Net change in cash', 'Son 3 ay': 'Last 3 months', 'Son 6 ay': 'Last 6 months', 'Son 12 ay': 'Last 12 months', 'Karşılaştırma': 'Comparison',
    'Yatırım ve finansman rakamları hesap grubu değişiminden türetildiği için yaklaşıktır (alım/satış, kredi/vergi ayrılamaz).': 'Investing and financing figures are derived from account-group movements and are approximate (purchases/disposals and loans/taxes cannot be separated).',
    'TFRS tabloları': 'IFRS statements', 'TFRS tabloları alınamadı': 'IFRS statements could not be loaded', 'Analiz verisi okunamadı ya da henüz hazırlanmadı.': 'Analysis data could not be read or is not ready yet.',
    'Finansal durum tablosu': 'Statement of financial position', 'Kâr veya zarar tablosu (fonksiyon esaslı)': 'Statement of profit or loss (by function)', 'Nakit akış tablosu': 'Statement of cash flows', 'Finansal durum tablosu üretilemedi.': 'The statement of financial position could not be produced.', 'Kâr veya zarar tablosu üretilemedi.': 'The statement of profit or loss could not be produced.', 'Nakit akış tablosu üretilemedi.': 'The statement of cash flows could not be produced.',
    'TFRS/UFRS sunum biçimi (TMS 1, TMS 7)': 'IFRS presentation format (IAS 1, IAS 7)',
    'TDHP kayıtlarının TFRS sunum biçimine yeniden sınıflanmasıdır; TFRS düzeltme kayıtları (TMS 29 yüksek enflasyon düzeltmesi, TFRS 16 kiralamalar, TMS 19 kıdem tazminatı, ertelenmiş vergi, TFRS 9 beklenen kredi zararı) sistemde kayıtlı olmadığından uygulanmadı; denetlenmiş TFRS tablosu yerine geçmez.': 'This is a reclassification of Turkish Uniform Chart of Accounts (TDHP) postings into the IFRS presentation format; IFRS adjustments (IAS 29 hyperinflation, IFRS 16 leases, IAS 19 severance, deferred tax, IFRS 9 expected credit losses) are not recorded in the system and were not applied; it does not replace audited IFRS statements.',
    'Kalem': 'Item', 'Hesap: ': 'Accounts: ', 'Veri yok': 'No data', 'Kanıt': 'Evidence', 'Kapanış süresi': 'Closing time', 'Veri boşlukları': 'Data gaps', 'Genel defter': 'General ledger', 'Alt defter': 'Subledger', 'Fark': 'Difference', 'Fark nedeni': 'Difference reason',
    'Hasılat': 'Revenue', 'Satışların maliyeti (−)': 'Cost of sales (−)', 'Brüt kâr': 'Gross profit', 'Pazarlama giderleri (−)': 'Selling and marketing expenses (−)', 'Genel yönetim giderleri (−)': 'General and administrative expenses (−)', 'Araştırma ve geliştirme giderleri (−)': 'Research and development expenses (−)',
    'Esas faaliyetlerden diğer gelirler': 'Other income from operating activities', 'Esas faaliyetlerden diğer giderler (−)': 'Other expenses from operating activities (−)', 'Esas faaliyet kârı': 'Operating profit', 'Finansman gelirleri': 'Finance income', 'Finansman giderleri (−)': 'Finance costs (−)', 'Vergi öncesi kâr': 'Profit before tax', 'Vergi gideri (−)': 'Tax expense (−)', 'Dönem kârı': 'Profit for the period',
    'Dönen varlıklar': 'Current assets', 'Nakit ve nakit benzerleri': 'Cash and cash equivalents', 'Ticari alacaklar': 'Trade receivables', 'Diğer alacaklar': 'Other receivables', 'Stoklar': 'Inventories', 'Diğer dönen varlıklar': 'Other current assets', 'Toplam dönen varlıklar': 'Total current assets', 'Duran varlıklar': 'Non-current assets', 'Toplam varlıklar': 'Total assets',
    'Kısa vadeli yükümlülükler': 'Current liabilities', 'Ticari borçlar': 'Trade payables', 'Diğer kısa vadeli yükümlülükler': 'Other current liabilities', 'Toplam kısa vadeli yükümlülükler': 'Total current liabilities', 'Uzun vadeli yükümlülükler': 'Non-current liabilities', 'Özkaynaklar': 'Equity', 'Toplam yükümlülükler ve özkaynaklar': 'Total liabilities and equity',
    'Yansıtması bekleyen maliyet hesapları (uyumlandırma)': 'Cost accounts pending allocation (reconciliation)', 'bunun içinde dönem net kârı (yıl içi)': 'of which net profit for the period (year to date)',
    'A. İşletme faaliyetlerinden nakit akışları': 'A. Cash flows from operating activities', 'B. Yatırım faaliyetlerinden nakit akışları (yaklaşık)': 'B. Cash flows from investing activities (approx.)', 'C. Finansman faaliyetlerinden nakit akışları (yaklaşık)': 'C. Cash flows from financing activities (approx.)',
    'Dönem net kârı': 'Net profit for the period', 'Düzeltmeler: amortisman ve itfa payları': 'Adjustments: depreciation and amortisation', 'İşletme sermayesindeki değişimler: ticari alacaklar': 'Changes in working capital: trade receivables', 'İşletme sermayesindeki değişimler: stoklar': 'Changes in working capital: inventories',
    'İşletme sermayesindeki değişimler: ticari borçlar': 'Changes in working capital: trade payables', 'İşletme sermayesindeki değişimler: diğer alacak ve dönen varlıklar': 'Changes in working capital: other receivables and current assets', 'Yansıtması bekleyen maliyet hesaplarındaki değişim (uyumlandırma)': 'Change in cost accounts pending allocation (reconciliation)',
    'İşletme faaliyetlerinden sağlanan net nakit': 'Net cash from operating activities', 'Duran varlık değişimi ve amortisman düzeltmesi (alım/satış ayrılamaz)': 'Change in non-current assets and depreciation adjustment (purchases/disposals cannot be separated)', 'Finansal borçlar ve diğer yükümlülüklerdeki değişim': 'Change in financial debt and other liabilities',
    'Özkaynaklardaki diğer değişim': 'Other change in equity', 'Finansman faaliyetlerinden net nakit': 'Net cash from financing activities', 'Nakit ve nakit benzerlerindeki net artış (azalış), hesaplanan': 'Net increase (decrease) in cash and cash equivalents, calculated', 'Bilançodaki nakit ve nakit benzerleri değişimi': 'Change in cash and cash equivalents per balance sheet', 'Fark (uyumlandırma)': 'Difference (reconciliation)',
    'Depo, lot ve son kullanma tarihi': 'Warehouse, lot and expiry date', 'Malzeme kodu, ad veya lot ara': 'Search material code, name or lot', 'Daha fazla göster': 'Show more',
    'Depo yeri': 'Storage location', 'Kalem sayısı': 'Items', 'SKT 90 gün içinde': 'Expiry within 90 days', 'SKT geçmiş': 'Expired', 'Yavaş dönen': 'Slow-moving', 'Toplam stok değeri': 'Total stock value',
    'Ürün grubu': 'Product group', 'Spanç': 'Gauze swabs (Spanç)', 'Gazlı bez': 'Gauze roll', 'Diğer': 'Other',
    'Eşleşen stok yok': 'No matching stock', 'Stok alınamadı': 'Stock could not be loaded', 'Stok kaydı yok': 'No stock records', 'Enter': 'Enter',
    'Müşteriler': 'Customers', 'Müşteri sayısı': 'Customers', 'İlk 20 müşteri': 'Top 20 customers', 'Müşteri türüne göre ciro': 'Revenue by customer type', 'Son 12 ay ciro': 'Revenue, last 12 months',
    'Bu yıl ciro': 'Revenue this year', 'En hızlı büyüyen 10': 'Top 10 growing', 'En hızlı düşen 10': 'Top 10 declining', '90 gündür sipariş vermeyen müşteriler': 'Customers with no order for 90 days',
    'Müşteri adı veya numarası ara': 'Search customer name or number', 'Eşleşen müşteri yok': 'No matching customers', 'Müşteri verisi yok': 'No customer data', 'Müşteri raporu alınamadı': 'Customer report could not be loaded',
    'Listeye dön': 'Back to list', 'Son sipariş': 'Last order', 'En çok alınan 5 ürün': 'Top 5 products purchased', 'Son 12 ay ciroya göre': 'By last 12 months revenue',
    'Bayi': 'Dealer', 'Özel hastane': 'Private hospital', 'Devlet hastanesi': 'State hospital', 'İhracat': 'Export', 'Liste': 'List',
    'Şikâyetler': 'Complaints', 'Dikkat listesi': 'Attention list', 'Dikkat gerektirenler': 'Needing attention', 'Tüm hastaneler': 'All hospitals', 'Dikkat gerektiren hastane yok': 'No hospitals need attention',
    'Hastane şikâyetleri ve teslimat sorunları': 'Hospital complaints and delivery issues', 'Hastane sayısı': 'Hospitals', 'Açık olay': 'Open events', 'Toplam olay': 'Total events', 'Son 12 ay olay': 'Events, last 12 months',
    'Şikâyet türleri': 'Complaint types', 'Şikâyet türü dağılımı': 'Complaint type distribution', 'En çok şikâyet alan 10 ürün': 'Top 10 products by complaints', 'Ay ay şikâyet olayı': 'Complaint events by month',
    'Önceki aylar': 'Earlier months', 'Olaylar': 'Events', 'Ürünler': 'Products', 'Yüksek': 'High', 'Orta': 'Medium', 'İzleme': 'Watch', 'Kapalı': 'Closed', 'İptal tutarı': 'Cancelled amount',
    '100 teslimatta olay': 'Events per 100 deliveries', 'Olay sayısına göre': 'By number of events', 'Son 12 ay, olay sayısı': 'Last 12 months, number of events', 'Tutara göre': 'By amount', 'En yeniden eskiye': 'Newest first',
    'Ambalaj': 'Packaging', 'Belge/irsaliye/teslim kanıtı': 'Document / waybill / proof of delivery', 'DMO iptal': 'DMO cancellation', 'DMO muayene ret': 'DMO inspection rejection', 'Eksik teslimat': 'Incomplete delivery',
    'Geç teslim': 'Late delivery', 'Yanlış malzeme/beden teslimi': 'Wrong item / size delivered', 'Ürün kalitesi': 'Product quality', 'İade': 'Return', 'Hasarlı teslimat': 'Damaged delivery',
    'Cerrahi eldiven': 'Surgical glove', 'Eldiven (tür belirsiz)': 'Glove (type unknown)', 'Gazlı bez / batın': 'Gauze / laparotomy sponge', 'Lateks pudralı eldiven': 'Powdered latex glove',
    'Lateks pudrasız eldiven': 'Powder-free latex glove', 'Nitril eldiven': 'Nitrile glove', 'Spanç': 'Gauze swab', 'Steril eldiven': 'Sterile glove',
    'Ceza kesintisi (toplam, MY+DAY)': 'Penalty deductions (total, MY+DAY)', 'Ceza kesintisi (12 ay, MY+DAY)': 'Penalty deductions (12 months, MY+DAY)',
    'DAY ve şirket içi satışlar hariç': 'Excludes DAY and intercompany sales', 'Son 12 ay müşteri faturasına göre': 'By customer invoices, last 12 months', 'son 12 ay müşteri faturası büyükten küçüğe': 'last 12 months customer invoices, largest first',
    'Müşteri faturası (son 12 ay)': 'Customer invoices (last 12 months)', 'Müşteri faturası (bu yıl)': 'Customer invoices (this year)', 'Müşteri türüne göre müşteri faturası': 'Customer invoices by customer type',
    'Hastane, ürün, şikâyet türü ara…': 'Search hospital, product, complaint type…', 'Şikâyet kaydı yok': 'No complaint records', 'Şikâyet verisi alınamadı': 'Complaint data could not be loaded'
  };
  Object.keys(TAM41).forEach(function (k) { TAM[k] = TAM41[k]; });
   
  var TAM49 = {
     
    'Son aramalar:': 'Recent searches:', 'Temizle': 'Clear', 'Sipariş ara': 'Search orders', 'Teslimat kaydı olanlar ✕': 'With delivery record ✕', 'Fatura kaydı olanlar ✕': 'With invoice record ✕',
    'En çok geciken 5 müşteri': 'Top 5 customers by overdue orders', 'En çok geciken 5 hastane / teslim yeri': 'Top 5 hospitals / delivery sites by overdue orders', 'Geciken sipariş sayısına göre': 'By number of overdue orders',
    'Ad': 'Name', 'Geciken sipariş': 'Overdue orders', 'En uzun gecikme (gün)': 'Longest delay (days)', 'Dokunun: tüm listeyi göster': 'Tap: show full list',
    'Dokunun: yalnız teslimat kaydı olanlar': 'Tap: only those with a delivery record', 'Dokunun: yalnız fatura kaydı olanlar': 'Tap: only those with an invoice record', 'Dokunun: listeyi süz': 'Tap: filter the list',
    'Müşteri listesi': 'Customer list', 'bir müşteriye dokununca siparişleri açılır': 'tap a customer to open their orders', 'Siparişleri': 'Orders',
    'Son 45 gün, bu müşteri adına açılan siparişler': 'Orders opened for this customer in the last 45 days', 'Son 45 günde bu müşteriden sipariş yok.': 'No orders from this customer in the last 45 days.',
    'İlk 50 gösteriliyor, toplam': 'Showing first 50, total',
     
    'Veri': 'Data', 'itibarıyla': 'as of', 'zamanı bilinmiyor': 'time unknown', 'Süresi geçti': 'Expired', 'Belge türü': 'Document type', 'Toplam': 'Total',
    'Belge türü kayıt adının önekinden çıkarılır; kesin olmayanlar "Diğer"de.': 'Document type is derived from the record name prefix; uncertain ones are under "Other".',
    'Diğer': 'Other', 'Sorumlu': 'Owner', 'Sonraki adım': 'Next step', 'kayıtlarda': 'in records', 'Belge türü × durum': 'Document type × status', 'Kaç belge hangi risk bandında': 'How many documents in which risk band',
    'Geçmiş': 'Past', 'Süresi geçmiş': 'Expired', 'belge': 'documents', '12 aylık süre dolum': '12-month expiry', '12 aylık süre dolumu': 'Expiries over 12 months', 'Aylara göre biten belge sayısı': 'Documents expiring per month',
    'Ay': 'Month', 'Belge': 'Documents', 'Bu ay dahil 12 ay; ilk sütun süresi geçmişler.': '12 months including this one; first column is already expired.', '12 aydan sonra': 'After 12 months',
    'Şikâyet': 'Complaints', 'Şikâyet ve CAPA': 'Complaints and CAPA', 'Açık şikâyetlerin sayısı ve yaşı': 'Number and age of open complaints', 'Açık şikâyet': 'Open complaints', 'kayıt': 'records', 'kapanmamış olay': 'unresolved events',
    'En eski açık': 'Oldest open', 'gün': 'days', 'tarihli olaylar içinde': 'among dated events', 'Yaş': 'Age', 'Açık olay': 'Open events', 'Tarihi yok': 'No date', 'Şikâyet verisi': 'Complaint data', 'Plan': 'Plan',
    'Çıkış': 'Dispatch', 'çıkış yok': 'not dispatched', 'çıkış': 'dispatches', 'Son 7 gün çıkış': 'Dispatches, last 7 days', 'Günlük fiili çıkış yapılan teslimat': 'Deliveries dispatched per day', 'Gün': 'Day',
    'Tüm günler': 'All days', 'Bu hafta': 'This week', 'Zaman filtresi': 'Time filter', 'Gecikmiş sevkiyatlar': 'Overdue shipments', 'En çok geciken en üstte.': 'Most overdue first.',
    'Teslim bilgisi bu kaynakta yok.': 'Delivery information is not in this source.', 'ETA': 'ETA', 'Nakliye firması': 'Carrier', 'Taşıma maliyeti': 'Freight cost', 'ETA, firma ve maliyet': 'ETA, carrier and cost',
    'Bu bilgiler henüz kaynakta tutulmuyor': 'This information is not yet kept in the source',
     
    'Bugün yapılacak': 'To do today', 'Ödeme zaman çizelgesi': 'Payment timeline', 'Kural teyit bekleniyor': 'Rule awaiting confirmation', 'İhale hattı': 'Tender pipeline', 'Portal aktif ihale': 'Active tenders on portal',
    'Katılım / sonuç durumu': 'Participation / result status', 'Siparişli ihale': 'Tenders with orders', 'Teslimi başlayan': 'Delivery started', 'Temlik eşiğine ulaşan': 'Reached assignment threshold',
    'Hastane OTIF, en riskli 5': 'Hospital OTIF, top 5 at risk', 'Ceza ve iptal kotası (%10)': 'Penalty and cancellation quota (10%)', 'Fiyat girişi (taslak)': 'Price entry (draft)',
     
    'Özet': 'Summary', 'Aktarım bekleyen': 'Awaiting transfer', 'GİB engeli': 'GIB blocker', 'Gecikmiş kapanış adımı': 'Overdue closing step', 'Kapanış ilerlemesi': 'Closing progress', 'Açık düzeltme ricaları': 'Open correction requests',
    'Cari yaşlandırma': 'Receivables aging', 'Finansal performans': 'Financial performance', 'Dönem karşılaştırması': 'Period comparison', 'Önceki dönem': 'Previous period', 'Sonraki dönem': 'Next period',
    'Nakit giriş ve çıkış · 6 ay': 'Cash in and out · 6 months', 'Fatura numarası ya da düzeltme konusu ara': 'Search invoice number or correction topic', 'Fatura ya da düzeltme ara': 'Search invoice or correction',
    'Sonuç yok. Arama yalnız aktarım bekleyen faturalarda, GİB kontrol kararlarında ve düzeltme ricalarında yapılır; cari adı bu kaynakta tutulmuyor.': 'No result. Search covers invoices awaiting transfer, GIB check decisions and correction requests only; customer names are not stored in this source.',
    'Hat adedi (canlı tahmini)': 'Line count (live estimate)', 'Son gerçek adet + adet/dk; her dakika gerçek veriyle düzelir': 'Last real count + units/min; re-anchored to real data every minute',
    'canlı tahmini': 'live estimate', 'canlı tahmini · adet tahmin': 'live estimate · count is an estimate', 'adet/dk': 'units/min', 'duruyor · artmıyor': 'stopped · not counting',
    'Her dilim 15 dakika': 'Each slice is 15 minutes', 'Duruş nedenleri': 'Stop causes','Vardiya bazlı Pareto': 'Pareto by shift', 'Neden girilmedi': 'Cause not entered', 'Vardiya zaman şeridi': 'Shift time strip', 'Çalıştı / Yavaş / Durdu / Veri yok': 'Running / Slow / Stopped / No data',
    'OEE kırılımı': 'OEE breakdown', 'payda teyit': 'denominator to be confirmed', 'Kullanılabilirlik / Performans / Kalite': 'Availability / Performance / Quality', 'Alarm geçmişi': 'Alarm history',
    'Son 24 saat · vardiya': 'Last 24 hours · by shift', 'Gün sonu tahmini': 'End-of-day forecast', 'tahmin': 'forecast', 'Canlı ek bilgiler': 'Live extras', 'Makine eki': 'Machine extras',
     
    'Son fiyatımız (TL/adet)': 'Our latest price (TRY/unit)', 'DMO': 'DMO', 'Devlet hastaneleri': 'State hospitals', 'Üniversite hastaneleri': 'University hospitals', 'vade ~1,5 yıl': 'payment term ~1.5 years',
    'Fiyat bulunamadı': 'No price found', 'Aralık': 'Range', 'Tavan': 'Ceiling', 'Tavan: bilinmiyor': 'Ceiling: unknown', 'Kalem': 'Item'
  };
  Object.keys(TAM49).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM49[k]; });

   
  var PARCA_L = [
    ['Belge/irsaliye/teslim kanıtı', 'Document / waybill / proof of delivery'], ['DMO muayene ret', 'DMO inspection rejection'], ['DMO iptal', 'DMO cancellation'], ['Eksik teslimat', 'Incomplete delivery'], ['Geç teslim', 'Late delivery'],
    ['Yanlış malzeme/beden teslimi', 'Wrong item / size delivered'], ['Ürün kalitesi', 'Product quality'], ['Hasarlı teslimat', 'Damaged delivery'],
    [' — son güncelleme ', ' — last updated '], ['. Gösterilen değerler güncel olmayabilir.', '. Values shown may be out of date.'], [' güncellendi', ' updated'], ['yerel kopya', 'local copy'],
    ['az önce', 'just now'], [' gün önce', ' days ago'], [' dk önce', ' min ago'], [' bilinmiyor', ' unknown'], ['bilinmiyor', 'unknown'],
    ['Şu an alınamayan veri: ', 'Currently unavailable: '], ['Okunamayan kaynak: ', 'Unreadable source: '], [' — bu kaynakların kayıtları aramada çıkmaz.', ' — records from these sources will not appear in search.'], [' için sonuç yok', ' — no results'],
    [' kritik okunmamış', ' critical unread'], ['Uyarılar verilerden türetilir; kaynak güncelliği her modülde yazılıdır. ', 'Alerts are derived from the data; source freshness is shown in each section. '],
    ['Son güncelleme ', 'Last updated '], [' — değerler güncel olmayabilir.', ' — values may be out of date.'], ['. Değerler güncel olmayabilir.', '. Values may be out of date.'],
    [' konteynerin serbest süresi doldu', ' container(s) past free time'], ['Makine alarmı: ', 'Machine alarm: '], ['En uzun: ', 'Longest: '], [' gün aştı (', ' days over ('], ['Serbest süre bitiyor: ', 'Free time ending: '],
    ['Son gün bugün', 'Last day is today'], [' gün kaldı (', ' days left ('], [' gün kaldı', ' days left'], [' sipariş gecikmiş', ' order(s) late'], ['En eski: ', 'Oldest: '], ['Bazı siparişlerin durumu belli değil', 'Status of some orders is unknown'],
    [' kalemin teslim durumu henüz yok.', ' item(s) have no delivery status yet.'], [' kalemin teslim durumu henüz yok', ' item(s) have no delivery status yet'], ['Süresi geçti: ', 'Overdue: '], ['7 gün içinde: ', 'Within 7 days: '],
    [' gün geçti', ' days overdue'], [' gün gecikmiş', ' days late'], [' belge 30 gün içinde', ' document(s) within 30 days'], [' · tarih bilinmiyor', ' · date unknown'], [' · stacker', ' · stacker'], ['kompres hat ', 'compress line '],
    ['Dokuma salon ', 'Weaving hall '], ['dokuma tezgah ', 'weaving loom '], ['Tezgâh ', 'Loom '], [' hat çalışıyor', ' line(s) running'], [' tam gün kompres toplamı', ' full-day compress total'], [' ↔ önceki gün', ' ↔ previous day'],
    ['hedef: tanımlı değil', 'target: not defined'], ['Son tam gün (', 'Last full day ('], ['; önceki güne göre en büyük fark Hat ', '; biggest change vs previous day: Line '], [' hatta veri yok. ', ' line(s) with no data. '],
    ['Eğilimdeki ○ noktalar tahmin içeren günler.', 'The ○ points in the trend are days that include estimates.'], [' tezgâh çalışıyor', ' looms running'], ['Son ~3 dk çalışan tezgâh sayısı', 'Looms running in the last ~3 min'],
    ['Ortalama verim % ', 'Average efficiency % '], [' tezgâh duruyor', ' looms stopped'], [' tezgâhtan veri yok (durdu değil, bilinmiyor)', ' looms with no data (not stopped — unknown)'], ['Eğilim yalnız son ~3 dakikayı gösterir.', 'The trend shows only the last ~3 minutes.'],
    ['durum okunamadı', 'status could not be read'], ['Alarm durumu alınamadı', 'Alarm status unavailable'], [' alarm daha)', ' more alarms)'], ['Açık alarm bildirilmedi.', 'No open alarm reported.'],
    ['Önümüzdeki 8 haftada varacak yoldaki konteyner sayısı (haftalık)', 'Containers in transit arriving in the next 8 weeks (weekly)'], ['Bu hafta varacak ', 'Arriving this week: '], [' · limanda ', ' · at port '], [' · serbest süresi dolan ', ' · past free time '],
    ['Limanda bekleyen ', 'Waiting at port: '], [' tanesi serbest süreyi aştı; ardiye riski var.', ' past free time; demurrage risk.'], ['Serbest süresi dolan konteyner yok.', 'No container past free time.'], ['Son 45 günde açılan sipariş sayısı (günlük)', 'Orders opened in the last 45 days (daily)'],
    [' tanesi DMO)', ' of them DMO)'], [' siparişin durumu bilinmiyor.', ' order(s) have unknown status.'], ['Önümüzdeki 12 ayda biten belge sayısı (aylık)', 'Documents expiring in the next 12 months (monthly)'], ['30 gün içinde ', 'Within 30 days: '],
    [' belge doluyor; ', ' document(s) expiring; '], [' kaydın tarihi bilinmiyor (sorun yok demek değil).', ' record(s) have no known date (this does not mean “no problem”).'], ['Tümü (', 'All ('], ['Okunamayan kaynak var (', 'Some sources unreadable ('],
    ['); bu kaynaklarda dikkat gerektiren bir şey olup olmadığı bilinmiyor.', '); it is unknown whether anything needs attention in them.'], [' verisi alınamadı', ' data could not be loaded'],
    ['Ağ hatası: ', 'Network error: '], ['Dosya yok: ', 'File not found: '], ['Yetki yok (', 'No permission ('], ['Sunucu cevabı ', 'Server response '], ['JSON okunamadı', 'JSON could not be read'],
    [' — aşağıdakiler son alınabilen değerlerdir.', ' — the values below are the last ones available.'], [' — makine verisi geldiğinde burada görünecek.', ' — machine data will appear here when it arrives.'],
    [' hatta veri yok', ' line(s) with no data'], [' hat durdu', ' line(s) stopped'], ['veri yok olan hat yok', 'no line without data'], ['Çalışan tezgâh sayısı, son kayıtlar', 'Running looms, latest records'],
    ['verim = makinenin bildirdiği randıman', 'efficiency = yield reported by the machine'], ['alarm durumu okunamadı (“yok” demek değil)', 'alarm status could not be read (does not mean “none”)'], ['ayrıntı aşağıda', 'details below'], ['açık alarm yok', 'no open alarms'],
    [' düşük verim', ' low efficiency'], [' (düşük)', ' (low)'], [', verim % ', ', efficiency % '], [' tezgâh daha — aşağıda plan', ' more looms — plan below'], [' tezgâh veri göndermiyor (durdu sayılmaz).', ' looms send no data (not counted as stopped).'],
    ['▼ Düşük', '▼ Low'], ['çalışıyor', 'running'], ['durdu (duruş)', 'stopped (downtime)'], ['düşük verim (% ', 'low efficiency (% '], ['veri yok (durmuş değil)', 'no data (not stopped)'],
    ['Tezgâh ayrıntı listesi bağlanıyor', 'Loom detail list is connecting'], ['Yalnız duran / verisi olmayan tezgâhlar:', 'Only stopped / no-data looms:'], [' veri yok (toplam ', ' no data (total '], [' duruyor · ', ' stopped · '], [' · ort. verim % ', ' · avg. efficiency % '],
    ['Kısmi: ', 'Partial: '], [' hatta ölçüm yok', ' line(s) with no measurement'], ['En az — bir hattın bir vardiya parçası henüz gelmedi.', 'At least — part of a shift for a line has not arrived yet.'], [' (toplama dahil değil)', ' (not included in the total)'],
    [' ayrıntısı', ' details'], [' · istifleyici', ' · stacker'], ['Veri yok — ', 'No data — '], ['Bu durum “durdu” anlamına gelmez; makineden okuma alınamıyor.', 'This does not mean “stopped”; no reading can be taken from the machine.'],
    [' (şu ana kadar, bu vardiya)', ' (so far, this shift)'], [' vardiya başarısı', ' shift achievement'], ['Başarı yüzdesi yok: ', 'No achievement %: '], ['Gün sonu: ~', 'End of day: ~'], ['Gün: ', 'Day: '],
    ['Eksik: bir vardiya parçası henüz gelmedi (değer sıfır değil, eksik).', 'Incomplete: part of a shift has not arrived yet (the value is not zero, it is missing).'], ['Dış kaynak tahmini: ', 'External estimate: '],
    ['▲ Sayaç şüpheli — ölçüm değil.', '▲ Counter suspect — not a measurement.'], ['Duruş nedeni: ', 'Downtime reason: '], ['Dokuma salonu — bu vardiya', 'Weaving hall — this shift'], ['çalışma ÷ (çalışma + duruş), veri bildiren tezgâhlar', 'run ÷ (run + stop), looms reporting data'],
    ['makinenin bildirdiği ortalama randıman', 'average yield reported by the machine'], ['Kompres hatları — OEE (K = kullanılabilirlik · P = performans · Q = kalite)', 'Compress lines — OEE (A = availability · P = performance · Q = quality)'],
    [' durum şeridi', ' status strip'], [' vardiya şeridi', ' shift strip'], ['yavaş (olağan temponun %60’ı altı)', 'slow (below 60% of usual pace)'], ['durdu / çok az', 'stopped / very little'], ['veri yok (durdu değil)', 'no data (not stopped)'],
    ['Her kutu 15 dk · ', 'Each box 15 min · '], ['Kısa süreli durum akışı bu kaynakta bulunmuyor.', 'No short-term status flow in this source.'], ['Bilinmiyor — “alarm yok” demek değil.', 'Unknown — does not mean “no alarm”.'],
    ['Kompres hatları', 'Compress lines'], ['Dokunun: hat ayrıntısı', 'Tap for line details'], [' tezgâh · vardiya ', ' looms · shift '], ['Dokuma salonu', 'Weaving hall'],
    ['dakika; çizgi: kümülatif pay', 'minutes; line: cumulative share'], ['Dokuma duruş nedenleri — Pareto', 'Weaving downtime reasons — Pareto'], ['şu an duran tezgâhlar, duruş dk', 'looms stopped now, downtime min'],
    ['Kompres kayıp nedenleri — Pareto', 'Compress loss reasons — Pareto'], ['Tahmin: dış kaynak yorumu, makine ölçümü değil — çubuk yalnız ölçümü gösterir.', 'Estimate: external interpretation, not a machine measurement — the bar shows measurement only.'],
    ['Günlük kompres geçmişi bu kaynakta bulunmuyor; birikince burada görünür.', 'Daily compress history is not in this source; it will appear here once collected.'], ['tahmin payı (ölçüm değil)', 'estimate share (not measurement)'],
    ['çubuğa dokunun: gün ayrıntısı', 'tap a bar for day details'], ['* tahmin — makine ölçümü değil. — : o gün veri yok. Başlığa dokunarak sıralayın.', '* estimate — not a machine measurement. — : no data that day. Tap a header to sort.'],
    ['Dokuma geçmişi yok', 'No weaving history'], ['Boş gün = veri yok ya da üretim yok (0 m).', 'Empty day = no data or no production (0 m).'], ['Verim eğrisi için yeterli gün yok.', 'Not enough days for the efficiency curve.'],
    ['Dokuma ürün kırılımı (dokuma-veri) bu kaynakta bulunmuyor.', 'The weaving product breakdown is not in this source.'], ['Dokuma — ürüne göre metre (bu vardiya)', 'Weaving — metres by product (this shift)'], ['hangi kumaş ne kadar dokunuyor', 'how much of each fabric is being woven'],
    ['Veri yok tezgâh', 'Looms with no data'], ['Kısmi: bazı tezgâhların verisi eksik — gerçek değer daha yüksek olabilir.', 'Partial: some looms have missing data — the real value may be higher.'], ['Son 31 gün — ürüne göre metre', 'Last 31 days — metres by product'],
    ['Dokuma duruş nedenleri — bu hafta', 'Weaving downtime reasons — this week'], ['Haftalık dokuma duruş nedenleri', 'Weekly weaving downtime reasons'], ['Haftalık duruş nedeni yok', 'No weekly downtime reason'], ['Veri bu kaynakta bulunmuyor.', 'This data is not in this source.'],
    ['Dokuma salonları — dönem sıralaması', 'Weaving halls — period ranking'], ['Çalışılmayan ve eksik veri günleri dışarıda bırakıldı.', 'Non-working and missing-data days were excluded.'],
    ['Kişi ve vardiya bazlı performans KVKK nedeniyle bu uygulamada gösterilmez. Yetkili erişim yalnız İK ve doğrudan yöneticiye açıktır.', 'Person- and shift-level performance is not shown in this app because of data-protection rules. Access is limited to HR and the direct manager.'],
    ['Bu vardiya — üretilen / hedef (şu ana kadar)', 'This shift — produced / target (so far)'], [' kalite (fire) verisi şüpheli — OEE gösterilmiyor', ' quality (scrap) data suspect — OEE not shown'], ['K — Kullanılabilirlik', 'A — Availability'],
    ['P — Performans', 'P — Performance'], ['Q — Kalite', 'Q — Quality'], ['üretim dk ÷ planlı süre', 'production min ÷ planned time'], ['ideal çevrime göre', 'vs ideal cycle'], ['makine fire verisinden', 'from machine scrap data'],
    ['MTBF (arızalar arası)', 'MTBF (between faults)'], ['MTTR (arıza süresi)', 'MTTR (repair time)'], ['yetersiz örnek', 'insufficient sample'], ['OEE bu hat için bildirilmedi.', 'OEE not reported for this line.'],
    ['son saat henüz tamamlanmadıysa eksik', 'incomplete if the last hour is not finished'], [' (sürüyor)', ' (in progress)'], [' · saat sürüyor', ' · hour in progress'], [' vardiya (TR)', ' shift (TR)'],
    ['Tahmin: sayaç şüpheli ya da vardiya yarım — ölçüm değil.', 'Estimate: counter suspect or shift incomplete — not a measurement.'], ['” adlı hat bu veride yok', '” — no such line in this data'], ['Hat listesi: ', 'Line list: '],
    ['. Bu durum “durdu” anlamına gelmez.', '. This does not mean “stopped”.'], ['Sayaç şüpheli: değer tahmindir, ölçüm değil.', 'Counter suspect: the value is an estimate, not a measurement.'], [' (tahmin, ölçüm değil)', ' (estimate, not measurement)'],
    ['Eksik: bir vardiya parçası henüz gelmedi.', 'Incomplete: part of a shift has not arrived yet.'], ['tahmin var', 'includes estimate'], ['istifleyici hatta blister yok (0 değil)', 'no blister on stacker line (not 0)'],
    ['Akış çizgisi — hız (/dk)', 'Flow line — speed (/min)'], ['Yalnız son ~', 'Only the last ~'], [' dk; tam vardiya geçmişi birikiyor.', ' min; full shift history is accumulating.'], [' · tahmin (ölçüm değil)', ' · estimate (not measurement)'],
    ['şüpheli — ölçüm değil', 'suspect — not a measurement'], ['Tezgâh satır verisi okunamadı (bağlanıyor).', 'Loom row data could not be read (connecting).'], [' tezgâh var.', ' looms.'], ['. Durmuş sayılmaz; bilinmiyor.', '. Not counted as stopped; unknown.'],
    ['çalışma ve duruş süresi yok', 'no run/stop time'], [' dk çalışma, ', ' min run, '], [' dk duruş', ' min downtime'], [' — diğer tezgâhlar', ' — other looms'], ['Dokuma salonları', 'Weaving halls'],
    ['Eğilim', 'Trend'], ['Hat ', 'Line '], ['hat ', 'line '], [' tezgâh', ' looms'], [' · kısmi', ' · partial'], [' gün', ' days'], [' dk', ' min'], [' · tahmin ', ' · estimate '], ['tahmin', 'estimate'],
    ['ayrıca ', 'also '], ['Salon ', 'Hall '], ['Durdu', 'Stopped'], ['durdu', 'stopped'], [' veri yok', ' no data'], ['ort. verim', 'avg. efficiency'], ['metre bugün', 'metres today'], ['tezgâh', 'looms'],
    ['yoldaki konteyner', 'containers in transit'], ['Sabah', 'Morning'], ['Öğleden sonra', 'Afternoon'], ['Gece', 'Night'], ['Bobin', 'Bobbin'], ['Atkı', 'Weft'], ['Çözgü', 'Warp'], ['Personel (kapalı)', 'Personnel (closed)'],
    ['verim', 'efficiency'], ['Verim', 'Efficiency'], ['/dk', '/min'], ['looms listesi', 'loom list'], ['altı)', 'below)'], ['dokunun: ayrıntı', 'tap for details'], ['Üretilen / hedef', 'Produced / target'],
    ['geçen hafta: karşılaştırma yok', 'last week: no comparison'], ['çizgi: son ~', 'line: last ~'], ['karşılaştırma yok', 'no comparison'], ['geçen hafta', 'last week'], ['hedef %', 'target %'], ['Ürün', 'Product'],
    [' hat', ' lines'], ['Fabrika', 'Factory'], [' kayıt', ' records'], [' seç', ' select'], [' aç', ' open'], [' kapat', ' close']
  ];
   
  Object.assign(TAM, {
    'Uygulamayı yükle': 'Install the app', 'Uygulamayı yüklemek için: Menü → Ana ekrana ekle': 'To install the app: Menu → Add to Home screen',
    'Demo': 'Demo', 'Örnek verilerle gezin': 'Explore with sample data', 'Demodan çık': 'Exit demo', 'ÖRNEK VERİ / SAMPLE DATA': 'SAMPLE DATA',    
    'Giriş': 'Sign in', 'Giriş yap': 'Sign in', 'Fatura verisi yok': 'No invoice data', 'Kesilen faturalar': 'Issued invoices', 'Mahsup bekleyen tahsilat: ': 'Collections pending offset: ', 'Mahsup bekleyen: ': 'Pending offset: ', 'Geçmiş kotalar: ': 'Past quotas: ', 'Aşım': 'Over limit', 'Son 90 günde olumsuz muayene görünmüyor.': 'No negative inspections in the last 90 days.', 'Teslimat durumu bilinmiyor.': 'Delivery status unknown.', 'Teslimat belgesi yok.': 'No delivery document.', 'Fatura var ama teslimat kaydı yok.': 'Invoice exists but no delivery record.', 'Faturalanmadı.': 'Not invoiced.', 'Sipariş → irsaliye → fatura': 'Order → delivery note → invoice', 'Borç, teminat ve ödeme takvimi': 'Debt, collateral and payment schedule', 'Diğer': 'More',
    'Çalışıyor': 'Running', 'Güncel': 'Up to date', 'Açık': 'Open', 'Geciken': 'Late', 'Tamamlanan': 'Completed', 'Tümü': 'All', 'Özet': 'Summary', 'İhaleler': 'Tenders',
    'Şirket': 'Company', 'Kaynak': 'Source', 'Yaş': 'Age', 'Veri durumu': 'Data status', 'Durum': 'Status', 'Adet': 'Quantity', 'Banka': 'Bank', 'Borç': 'Debt', 'Depo': 'Warehouse',
    'Ocak': 'January', 'Şubat': 'February', 'Mart': 'March', 'Nisan': 'April', 'Mayıs': 'May', 'Haziran': 'June', 'Temmuz': 'July', 'Ağustos': 'August', 'Eylül': 'September', 'Ekim': 'October', 'Kasım': 'November', 'Aralık': 'December',
    'Oca': 'Jan', 'Şub': 'Feb', 'Nis': 'Apr', 'Haz': 'Jun', 'Tem': 'Jul', 'Ağu': 'Aug', 'Eyl': 'Sep', 'Eki': 'Oct', 'Kas': 'Nov',
    'sipariş': 'orders', 'belge': 'documents', 'fatura': 'invoices', 'rica': 'requests', 'kayıt': 'records', 'kalem': 'items', 'konteyner': 'containers', 'hastane': 'hospitals', 'Mutabakat': 'Reconciliation', 'Kesilen': 'Issued', 'Teslim': 'Delivery',
    'Geri': 'Back', 'Atla': 'Skip', 'Hoş geldiniz': 'Welcome', 'Yenilikler': 'What’s new', 'Yeniden dene': 'Try again', 'Kayıt yok': 'No records'
  });
  PARCA_L.push.apply(PARCA_L, [
     
    ['ayrıntıya git', 'view details'], ['Açık alarm', 'Open alarms'], ['Eldiven sevkiyatı', 'Glove shipments'], ['Kalite belgeleri', 'Quality documents'], ['süresi geçen', 'expired'], ['Veri eski: ', 'Data is stale: '],
    ['Son ', 'Last '], ['Güncel', 'Up to date'], ['Açık', 'Open'], ['açık', 'open'], ['Çalışıyor', 'Running'], ['Trend: ', 'Trend: '], ['tam gün', 'full days'], ['ÖRNEK VERİ', 'SAMPLE DATA'], ['ÖRNEK', 'SAMPLE'], ['Örnek', 'Sample'], ['örnek', 'sample'],
    ['uydurma', 'fictitious'], ['gerçek değil', 'not real'], ['Tümü', 'All'], ['Özet', 'Summary'], ['Durumu bilinmiyor', 'Status unknown'], ['Durum bilinmiyor', 'Status unknown'], ['Durumu', 'Status'], ['Durum', 'Status'], ['Grafik / tablo görünümü', 'Chart / table view'],
    ['Dayandığı bilgiler:', 'Based on:'], ['Erişebildiğin bölümler: ', 'Sections you can access: '], ['Kaynak: ', 'Source: '], ['Kaynak', 'Source'], ['kaynak', 'source'], ['Şirket', 'Company'], ['şirket içi', 'internal'], ['Şirket içi', 'Internal'], ['Tüm şirketler', 'All companies'], ['Tüm türler', 'All types'], ['Geciken', 'Late'], ['geciken', 'late'], ['gecikmiş', 'late'], ['Gecikmiş', 'Late'],
    ['yaklaşık', 'approximate'], ['tarih yok', 'no date'], ['tarih kayıtlı değil', 'date not recorded'], ['kayıt yok', 'no record'], ['Kayıt yok', 'No records'], ['veri yok', 'no data'], ['çalıştı', 'ran'], ['yavaş', 'slow'], ['şüpheli', 'suspect'],
     
    ['İthalat konteynerleri', 'Import containers'], ['ÖRNEK VERİ — finans rakamları gerçek değil', 'SAMPLE DATA — finance figures are not real'], ['harita günde 3 kez güncellenir; son güncelleme ', 'the map is updated 3 times a day; last update '],
    ['. Tarihler ve durumlar güncel olmayabilir.', '. Dates and statuses may be out of date.'], ['canlı takip: ', 'live tracking: '], ['Yoldaki konteyner', 'Containers in transit'], ['Limanda bekleyen', 'Waiting at port'], ['Serbest süresi dolan', 'Free time expired'],
    ['süresi dolan yok', 'none expired'], ['Bekleyen', 'Waiting'], ['Gemi: ', 'Vessel: '], ['ÖRNEK GEMİ', 'SAMPLE VESSEL'], ['çizgi: günlük varış', 'line: daily arrivals'], ['Konteyner, BL, PO, müşteri, gemi ara…', 'Search container, BL, PO, customer, vessel…'],
    ['Eldiven görünümleri', 'Glove views'], ['Konteyner', 'Container'], ['konteyner', 'container'], ['Tarihler forwarder/Excel listesinden; canlı takip yok', 'Dates come from the forwarder/Excel list; no live tracking'], ['Tarihlere göre tahmini ilerleme', 'Estimated progress by dates'],
    ['Örnek Hastane', 'Sample Hospital'], ['Örnek Bayi', 'Sample Dealer'], ['Örnek Müşteri', 'Sample Customer'], ['Örnek belge', 'Sample document'], ['Örnek reçete', 'Sample recipe'], ['Örnek duruş', 'Sample stoppage'], ['ÖRNEK-ÜRÜN', 'SAMPLE-PRODUCT'], ['ÖRNEK-', 'SAMPLE-'],
     
    ['İhale, sipariş ve ceza takibi', 'Tender, order and penalty tracking'], ['ÖRNEK VERİ — hastane adları, sipariş numaraları ve tutarlar gerçek değil', 'SAMPLE DATA — hospital names, order numbers and amounts are not real'], ['Portal verisi: ', 'Portal data: '],
    [' penceresi', ' window'], ['tutarlar KDV hariç, para birimi TL', 'amounts exclude VAT, currency TRY'], ['Siparişler / risk', 'Orders / risk'], ['Riskli sipariş oranı', 'At-risk order rate'], ['Riskli sipariş', 'At-risk orders'], ['Cezalı sürede oranı', 'In-penalty-period rate'],
    ['Cezalı sürede (son teslim geçti)', 'In penalty period (delivery deadline passed)'], ['Cezalı sürede', 'In penalty period'], ['Açık sipariş', 'Open orders'], ['Riskli hastaneler', 'At-risk hospitals'], ['Riskli hastane etiketi yok', 'No at-risk hospital label'], ['Riskli hastane', 'At-risk hospital'],
    ['Son teslim yakın', 'Delivery deadline near'], ['Cezalı süresi geçmiş', 'Penalty period passed'], ['İptale düştü (süre doldu)', 'Cancelled (time expired)'], ['Ek süre istenecek', 'Extra time to be requested'], ['İtiraz adayı', 'Objection candidate'],
    ['Temlik uyarısı (sipariş %25+)', 'Assignment warning (order 25%+)'], ['Muayenede işlem gereken', 'Inspection action required'], ['Siparişli ihale', 'Tenders with orders'], ['Gerçekleşen ceza', 'Penalty incurred'],
    ['Kapsam: irsaliyesi kayıtlı ', 'Scope: with delivery note on record '], ['Yasaklılık sınırı: ', 'Debarment threshold: '], ['kota grubunda aşım', 'quota groups over limit'], ['kota grubunda sınıra yakın', 'quota groups near limit'], ['siparişi olan gruplar', 'groups with orders'],
    ['Geçmiş kota grupları: ', 'Past quota groups: '], ['Aylara göre ihale sayısı', 'Number of tenders by month'], ['Aylara göre ihale', 'Tenders by month'], ['sipariş ayına göre ihale sayısı · mavi MY, mor DAY', 'tender count by order month · blue MY, purple DAY'], ['İKN×hastane satırı', 'tender no. × hospital rows'],
    ['Kaynakta riskli, süre geçmiş ya da teslim edilmemiş etiketli hastane yok. ', 'No hospital is labelled at risk, overdue or undelivered in the source. '], ['anlamına gelmez', 'does not mean'],
    ['Eylül', 'September'], ['Ekim', 'October'], ['Kasım', 'November'], ['Aralık', 'December'], ['Ocak', 'January'], ['Şubat', 'February'], ['Mart', 'March'], ['Nisan', 'April'], ['Mayıs', 'May'], ['Haziran', 'June'], ['Temmuz', 'July'], ['Ağustos', 'August'],
    ['Daha fazla', 'More'], ['Nitril muayene eldiveni', 'Nitrile examination glove'], ['mavi', 'blue'], ['adet', 'units'], ['MY Medikal stok', 'MY Medikal stock'], ['liste verisi', 'list data'], ['Hastaneler', 'Hospitals'], ['Muayene', 'Inspection'], ['muayene', 'inspection'], ['Ceza', 'Penalty'],
    ['Teslim belgeleri', 'Delivery documents'], ['Teslimi tamam', 'Fully delivered'], ['Teslim edilmedi', 'Not delivered'], ['Olumsuz muayene', 'Failed inspection'], ['ÖRNEK VERİ — tutarlar gerçek değil', 'SAMPLE DATA — amounts are not real'], ['Filtreler', 'Filters'], ['Kalem', 'Item'], ['Fatura', 'Invoice'], ['fatura', 'invoice'],
    ['sevkiyat listesi', 'shipment list'], ['Teslimat', 'Delivery'], ['belge', 'document'], ['e-Belge', 'e-Document'], ['Kesilen faturalar (SAP)', 'Issued invoices (SAP)'], ['Fatura iptali', 'Invoice cancellation'], ['e-fatura', 'e-invoice'], ['e-irsaliye', 'e-delivery note'], ['Karar filtresi', 'Decision filter'],
    ['irsaliye', 'delivery note'], ['Ayrıntı için dokunun', 'Tap for details'], ['Veri yok', 'No data'], [' sn', ' s'], ['Duruş nedeni: ', 'Stoppage reason: '], ['neden bildirilmedi', 'no reason reported'], ['Siparişler', 'Orders'], ['(örne…', '(sample…'], ['son güncelleme ', 'last update '], ['geçti', 'overdue'], ['kayıt', 'records'], ['veri göndermiyor', 'not sending data'], ['durdu sayılmaz', 'not counted as stopped'], ['sayılmaz', 'not counted'],
    ['Hastane bazında bütün detay →', 'All details by hospital →'], ['DMO bölümleri', 'DMO sections'], ['Teslimi tamam kalem oranı', 'Fully delivered item rate'], [' ihale', ' tenders'], ['“sorun yok”', '“no problem”'], ['"sorun yok"', '"no problem"'], ['sorun yok', 'no problem'],
     
    ['Siparişler — MY Medikal', 'Orders — MY Medikal'], ['Sipariş ve sevkiyat durumu', 'Order and shipment status'], ['kayıtlı kanıtla açık', 'open per recorded evidence'], ['istenen teslim geçmiş', 'requested delivery date passed'], ['kanıt yok — teslim/yok demek değil', 'no evidence — does not mean delivered or not delivered'],
    ['tam teslim kanıtlı', 'fully delivered (evidenced)'], ['huni', 'funnel'], ['Sipariş hunisi', 'Order funnel'], ['Açık → teslim → fatura: yalnız kayıtlı kanıt sayılır', 'Open → delivery → invoice: only recorded evidence counts'], ['Sipariş düzeyi — kayıtlı kanıt olan sipariş sayısı', 'Order level — number of orders with recorded evidence'],
    ['Siparişler (pencere içi)', 'Orders (within window)'], ['İrsaliye / teslimat kaydı olan', 'With delivery note / delivery record'], ['kayıt yok ≠ teslim edilmedi', 'no record ≠ not delivered'], ['Fatura kaydı olan', 'With invoice record'], ['kayıt yok ≠ faturalanmadı', 'no record ≠ not invoiced'],
    ['Durum dağılımı (sipariş)', 'Status distribution (orders)'], ['Açık (zamanında)', 'Open (on time)'], ['Tamamlandı', 'Completed'], ['Kalem düzeyi — ', 'Item level — '], ['Kısmi', 'Partial'], ['Teslim yok', 'Not delivered'], ['Teslim edildi', 'Delivered'],
    ['Durumu bilinmeyen siparişler ayrı dilimdir; ', 'Orders with unknown status are a separate slice; '], ['“teslim edildi” ya da 0 sayılmaz', 'they are not counted as “delivered” or 0'], ['"teslim edildi" ya da 0 sayılmaz', 'they are not counted as "delivered" or 0'],
    ['Gecikme yaşlandırma', 'Delay ageing'], ['bir çubuğa dokununca liste filtrelenir', 'tap a bar to filter the list'], ['dokunun: listeyi filtrele', 'tap to filter the list'], ['30 günden fazla gecikmiş', 'more than 30 days late'], ['30 günden fazla', 'more than 30 days'],
    ['Gün sayısı kaynaktaki gecikme_gun alanıdır (istenen teslimden bugüne).', 'The day count is the source delay field (from the requested delivery date to today).'], ['Son 45 günde açılan siparişler', 'Orders opened in the last 45 days'], ['kaynak penceresi: ', 'source window: '], [' sonrası', ' onwards'],
    ['Özel müşteri', 'Private customer'], ['Sipariş listesi', 'Order list'], ['Müşteri bazında', 'By customer'], ['Hastane / teslim yeri bazında', 'By hospital / delivery location'], ['Başlığa dokununca sıralanır · satıra dokununca ayrıntı açılır', 'Tap a header to sort · tap a row for details'],
    ['Gecikme (gün)', 'Delay (days)'], ['Teslim yeri / müşteri', 'Delivery location / customer'], ['Açıldı', 'Opened'], ['İstenen teslim', 'Requested delivery'], ['İrsaliye', 'Delivery note'], ['Tutar (SAMPLE)', 'Amount (SAMPLE)'], ['Sipariş durumu', 'Order status'], ['Kalem durumu', 'Item status'],
    ['Sipariş no, YK, müşteri, hastane, malzeme ara…', 'Search order no., YK, customer, hospital, material…'], ['Sipariş', 'Order'], ['sipariş', 'order'], ['Müşteri', 'Customer'], ['müşteri', 'customer'], ['hastane', 'hospital'], ['Hastane', 'Hospital'],
     
    ['Sertifika ve belge son tarihleri', 'Certificate and document deadlines'], ['kaydın tarihi ', 'record’s date is '], [' (kaynak listede yok); gri gösterilir, ', ' (not in the source list); shown in grey, '], ['Süresi geçti', 'Overdue'], ['tarihi geçmiş', 'past due'],
    ['Son tarihler zaman çizelgesinde; ', 'Deadlines on the timeline; '], ['risk bantları', 'risk bands'], ['Her nokta bir belge/son tarih (içi boş nokta = tarih yaklaşık).', 'Each dot is a document/deadline (hollow dot = approximate date).'], ['Belge kartları', 'Document cards'],
    ['12 aydan sonra: ', 'After 12 months: '], ['Aktarılmamış fatura yok.', 'No untransferred invoices.'], ['Bağlantı yok, tekrar deneyin', 'No connection, please retry'], ['Veri şu an yok', 'No data right now'], ['Veri okunamadı', 'Data could not be read'], ['Giriş henüz açık değil', 'Sign-in not available yet'], ['Giriş yapın', 'Please sign in'], ['tarihi yazılı olmayan kayıt tahmin edilmez', 'records without a written date are not estimated'], ['tarihi yazılı olmayan', 'without a written date'], ['Önümüzdeki 12 ay son tarih çizelgesi', 'Deadline timeline for the next 12 months'], ['Önümüzdeki 12 ay', 'Next 12 months'],
    ['Risk bandı filtresi', 'Risk band filter'], ['Risk bandı', 'Risk band'], ['Eğitim, muayene ve periyodik kontrol takvimi', 'Training, inspection and periodic check calendar'], ['İSG takvimi', 'OHS calendar'], ['Kalite takvimi', 'Quality calendar'],
    ['±14 gün içindeki diğer son tarihler', 'Other deadlines within ±14 days'], ['31–90 gün', '31–90 days'], ['8–30 gün', '8–30 days'], ['90 günden sonra', 'After 90 days'], ['Ay takvimi', 'Month calendar'], ['Belge / yükümlülük', 'Document / obligation'], ['Belge bilgisi', 'Document information'],
    ['Belge bulunamadı', 'Document not found'], ['Bu ayda tarihi kayıtlı son tarih yok.', 'No deadline with a recorded date this month.'], ['Bu belge listede yok', 'This document is not in the list'], ['Bu risk bandında kayıt yok.', 'No records in this risk band.'],
    ['Günün rengi o günkü en yakın riski gösterir; dokununca o günün belgeleri açılır', 'The day’s colour shows the nearest risk that day; tap to open that day’s documents'], ['Kalan gün', 'Days left'], ['Kaynak liste güncellenmiş olabilir.', 'The source list may have been updated.'],
    ['Kaynak listede belge/son tarih bulunmuyor.', 'The source list has no document/deadline.'], ['Kaynaktaki tarih metni', 'Date text in the source'], ['Kuruluş / alan', 'Organisation / area'], ['Onay kutusu için bekleyen ve karara bağlanan onaylar', 'Pending and decided approvals'], ['Bekleyen ve karara bağlanan onaylar', 'Pending and decided approvals'], ['Onay yolu', 'Approval route'], ['Bordro ve izin gibi kişi verisi bu uygulamaya şimdilik alınmıyor', 'Personal data such as payroll and leave is not brought into this app for now'], ['Yazma özelliği yakında açılacak…', 'Typing will open soon…'], ['Yapay zekâ bağlantısı', 'AI connection'], ['Önceki ay', 'Previous month'], ['Sonraki ay', 'Next month'], ['Son tarih', 'Deadline'],
    ['Tarih bilinmiyor', 'Date unknown'], ['Tarih kesinliği', 'Date certainty'], ['Tarihi bilinmeyen kayıtlar', 'Records with unknown date'], ['Tarihi yazılı olmayan kayıt tahmin edilmez; renk bugünden hesaplanır.', 'Records without a written date are not estimated; colour is calculated from today.'],
    ['Veri eski', 'Data is stale'], ['Yaklaşık (gün belirsiz olabilir)', 'Approximate (day may be uncertain)'], ['Ağu', 'Aug'],
     
    ['Yurtiçi sevkiyatlar: çıkış durumu ve gecikmeler', 'Domestic shipments: dispatch status and delays'], ['bilgisi bu ekranda yok.', 'information is not on this screen.'], ['teslim edildi', 'delivered'], ['yalnız depodan çıkışı gösterir', 'only shows departure from the warehouse'],
    ['Çıkış yapıldı', 'Dispatched'], ['Bugün çıkan', 'Dispatched today'], ['veri eski — sayı gösterilmiyor', 'data is stale — number not shown'], ['Çıkış bekliyor', 'Awaiting dispatch'], ['Çıkış ', 'Dispatch '], ['teslimat müşteri/hastane sevkiyatı sayılarına dahil değildir; ', 'delivery is not included in customer/hospital shipment counts; '],
    ['filtresinde görülür', 'is visible in the filter'], ['Tüm müşteriler / hastaneler', 'All customers / hospitals'], ['yalnız genel ve DMO teslimatları; tutar gösterilmez', 'general and DMO deliveries only; no amounts shown'], ['Örnek veri (gerçek değil)', 'Sample data (not real)'], ['Durum filtresi', 'Status filter'],
    ['Şirket filtresi', 'Company filter'], ['Müşteri / hastane filtresi', 'Customer / hospital filter'],
     
    ['Gri = teslim edilmedi DEĞİL, kanıt yok: bu teslimatlar için taşıyıcı portalında kayıt bulunamadı ya da taşıyıcı listesi tam değil. Boş sıfır değildir.', 'Grey = NOT “undelivered”, no evidence: no record was found in the carrier portal for these deliveries, or the carrier list is incomplete. Empty is not zero.'],
    ['Teslim edilmedi DEĞİL, kanıt yok', 'NOT undelivered, no evidence'], ['Portal gönderi sayıları şirket bazında ayrılmaz; aşağıda bu şirketin teslimat kayıtları var.', 'Portal shipment counts are not split by company; this company’s delivery records are below.'],
    ['Taşıyıcı portallarından teslim verisi henüz gelmedi.', 'Delivery data from the carrier portals has not arrived yet.'], ['Kargo teslim verisi yok', 'No cargo delivery data'], ['Veri eski/eksik', 'Data stale/incomplete'],
    ['Eksik taşıyıcı: ', 'Missing carrier: '], [' — oranlar eksik olabilir', ' — rates may be incomplete'], ['son başarılı okuma zamanı yok', 'no last successful read time'], ['son başarılı okuma ', 'last successful read '], ['Son başarılı okuma ', 'Last successful read '], ['Son okuma zamanı yok', 'No last read time'],
    ['Bu taşıyıcının bilgileri eksik geliyor; oranlar eksik olabilir.', 'This carrier’s data arrives incomplete; rates may be incomplete.'], [' bilgisi eksik)', ' data incomplete)'],
    ['Teslim oranı', 'Delivery rate'], ['Koli teslim oranı', 'Parcel delivery rate'], ['Uzun yolda', 'Long in transit'], ['14 gün üstü: ', 'Over 14 days: '], [' gönderi teslim', ' shipments delivered'], [' bağlı teslimat', ' linked deliveries'],
    ['şirket bazında koli verisi yok', 'no parcel data per company'], ['şirket bazında uzun yolda verisi yok', 'no long-in-transit data per company'], ['taşıyıcıda, teslim edilmedi', 'with the carrier, not delivered'],
    ['Teslim durumu filtresi', 'Delivery status filter'], ['Tüm teslim durumları', 'All delivery statuses'], ['Yolda / bekliyor', 'In transit / waiting'], ['Kanıt yok', 'No evidence'], ['Ekran bölümü', 'Screen section'], ['Sevkiyat', 'Shipments'], ['Genel sevkiyat', 'General shipments'], ['DMO Nakliyat', 'DMO Logistics'], ['Bölüm', 'Section'],['Kargo teslim', 'Cargo delivery'],
    ['Portal gönderileri (', 'Portal shipments ('], [' gönderi)', ' shipments)'], ['Teslimat kayıtları (', 'Delivery records ('], ['Bağlı teslimat yok', 'No linked deliveries'], ['Portalda yok', 'Not in portal'], ['Taşıyıcı bilgisi yok', 'No carrier data'], ['Teslim durumu', 'Delivery status'],
    ['Çıkış → teslim', 'Dispatch → delivery'], [' · medyan ', ' · median '],
    ['Son 30 gün: kargo çıkışı ve teslim', 'Last 30 days: cargo dispatch and delivery'], ['Taşıyıcı portalı, gönderi adedi/gün', 'Carrier portal, shipments per day'], [' · şirket ayrımı yok, tüm gönderiler', ' · no company split, all shipments'],
    ['İl bazında ortalama teslim süresi', 'Average delivery time by province'], ['İl bazında teslim günü', 'Delivery days by province'], ['Portalda hâlâ teslim görünmeyen; en uzun bekleyen üstte', 'Still not shown as delivered in the portal; longest waiting first'], ['Liste verisi yok', 'No list data'],
     
    ['e-Belge, aktarım, kapanış, mutabakat (yalnız muhasebe rolü)', 'e-Document, transfer, closing, reconciliation (accounting role only)'], ['Mali tablolar, e-Belge, aktarım, kapanış', 'Financial statements, e-Document, transfer, closing'], ['değerleme farkı düşülmüş', 'valuation difference deducted'], ['son dışa aktarım', 'last export'], ['Aktarılmayan', 'Not transferred'], ['tamamı kural gereği bekliyor', 'all waiting by rule'], ['GİB engeli', 'GİB block'],
    ['kontrolü', 'check'], ['gönderilebilir', 'ready to send'], ['Düzeltme', 'Correction'], ['cevap geldi', 'reply received'], ['Aktarım bekliyor', 'Awaiting transfer'], ['Aktarıldı', 'Transferred'], ['Aktarım', 'Transfer'], ['Kapanış', 'Closing'], ['Fatura türü', 'Invoice type'],
    ['İptal', 'Cancelled'], ['İade iptali', 'Return cancellation'], ['İade faturası', 'Return invoice'], ['Genel / grup içi satış', 'General / intra-group sale'], ['DMO tevkifatlı', 'DMO withholding'], ['GİB öncesi kontrol kararı', 'Pre-GİB check decision'], ['Gönderilebilir', 'Ready to send'], ['Gönderilemez', 'Not ready to send'],
    ['Gerekçe: ', 'Reason: '], ['gerekçe', 'reason'], ['Muhasebe bölümleri', 'Accounting sections'], ['Anlık ciro', 'Live net sales'], ['Dönem karşılaştırması', 'Period comparison'], ['Bu ay günlük ciro', 'Daily net sales this month'], ['Boş ciro hariç', 'Excl. zero-margin sales'], ['Bu hafta', 'This week'], ['Bu ay', 'This month'], ['Açık düzeltmeler listesi bulunamadı.', 'Open corrections list not found.'],
    [' ürün · en çok gönderilecek üstte', ' products · largest remaining first'], ['Depodan çıkmış, portalda teslim bekliyor: ', 'Left the warehouse, awaiting portal delivery entry: '], [' · Kayıt saati ', ' · Records at '], ['Henüz kayıt yok (son kayıt ', 'No record yet (last record '],
     
    ['Borç, teminat ve ödeme takvimi (yalnız yetkili kişiler)', 'Debt, collateral and payment schedule (authorised people only)'], ['Tarih itibarıyla ', 'As of '], ['TL karşılığı', 'TRY equivalent'], ['önceki gün', 'previous day'], ['Toplam teminat', 'Total collateral'], ['Banka + leasing borcu', 'Bank + leasing debt'],
    ['Açık kredi/leasing taksitleri, dosyadaki TL karşılığı', 'Open loan/leasing instalments, TRY equivalent in the file'], ['Açık taksitler, dosyadaki TL karşılığı', 'Open instalments, TRY equivalent in the file'], ['Trend için yeterli gün yok', 'Not enough days for a trend'], ['Eğilim için yeterli gün yok', 'Not enough days for a trend'],
    ['Teminat dağılımı', 'Collateral breakdown'], ['Teminat verisi yok', 'No collateral data'], ['Kaynakta teminat satırı boş.', 'The collateral row in the source is empty.'], ['Aylık kredi/leasing taksit yükü', 'Monthly loan/leasing instalment load'], ['Taksit verisi yok', 'No instalment data'],
    ['Krediler sayfasında açık taksit bulunamadı.', 'No open instalments found on the Loans sheet.'], ['Değerin yanındaki sayı taksit adedidir.', 'The number next to the value is the instalment count.'], ['Çek vade takvimi', 'Cheque maturity calendar'], ['çek vadesi yok', 'no cheque maturities'],
    ['ÇEK sayfasında bu aralıkta tutar yok.', 'The cheque sheet has no amount in this range.'], ['Yaklaşan taksitler', 'Upcoming instalments'], ['Yaklaşan taksit yok', 'No upcoming instalments'], ['açık taksit bulunamadı', 'no open instalments found'], ['ilk ', 'first '], ['Borç ve teminat eğilimi', 'Debt and collateral trend'],
    ['taksit', 'instalments'], ['Taksit', 'Instalment'], ['teminat', 'collateral'], ['Teminat', 'Collateral'],
     
    ['90 gün içinde tarihi bilinen son tarih yok. (Tarihi bilinmeyen kayıtlar bu listede olmaz.)', 'No deadline with a known date within 90 days. (Records with unknown dates are not in this list.)'], ['Bekleyen / hold', 'Waiting / on hold'], ['Bir bölümün verisi alınamadı', 'Data for a section could not be retrieved'],
    ['Eldiven — varışlar ve durum', 'Gloves — arrivals and status'], ['Eldiven haritası', 'Glove map'], ['Fabrika (makineler)', 'Factory (machines)'], ['Haftalık varış', 'Weekly arrivals'], ['Hat toplamı; devam eden gün karşılaştırmaya girmez', 'Line total; the day in progress is not included in the comparison'],
    ['Her rakamın ne kadar güncel olduğu', 'How up to date each figure is'], ['İthal / teslim', 'Imported / delivered'], ['Kalite / İSG — risk bantları', 'Quality / OHS — risk bands'], ['Kalite ve İSG, en yakın önce', 'Quality and OHS, nearest first'], ['Kompres üretimi — son ', 'Compress output — last '],
    ['Limanda / antrepoda', 'At port / in bonded warehouse'], ['Operasyonel özet (finans verisi yok)', 'Operational summary (no finance data)'], ['ÖRNEK VERİ — fabrika rakamları gerçek değil', 'SAMPLE DATA — factory figures are not real'], ['Siparişler — gecikme yaşlandırma', 'Orders — delay ageing'],
    ['Son 14 tam gün kompres toplamı', 'Compress total for the last 14 full days'], ['Tarihi bilinmiyor', 'Date unknown'], ['Yaklaşan son tarihler', 'Upcoming deadlines'], ['Yoldaki konteynerlerin haftalık varışı; durum dağılımı', 'Weekly arrivals of containers in transit; status distribution'], ['Yönetim paneli', 'Management panel'],
     
    ['Ana sayfa, zil, arama', 'Home page, bell, search'], ['Ana sayfada en önemli en çok 3 madde çıkar. Dokununca ilgili ayrıntıya gidersiniz; “Tümü” bildirim panelini açar.', 'The home page shows at most the 3 most important items. Tap one to go to its details; “All” opens the notification panel.'],
    ['Bu uygulama MY Medikal verisini tek yerde gösterir. Rolünüz: ', 'This app shows MY Medikal data in one place. Your role: '], ['Bugün dikkat', 'Needs attention today'], ['Eldiven finans', 'Glove finance'], ['Kartın kıyas, kaynak ve açıklama gibi teknik notları ⓘ içindedir; ihtiyaç olunca açın.', 'A card’s technical notes (comparison, source, explanation) are inside ⓘ; open it when needed.'],
    ['Menünüzdeki modüller', 'Sections in your menu'], ['Menünüze yeni modül eklendi:', 'A new section was added to your menu:'], ['SAP’ye veya başka bir sisteme yazmaz; yalnız gösterir.', 'It does not write to SAP or any other system; it only displays.'], ['Uygulama salt okunurdur. ', 'The app is read-only. '],
    ['Üstteki Ara düğmesi (ya da “/” veya Ctrl/⌘ K) ile konteyner, sipariş, makine veya belgeyi yazıp doğrudan açarsınız.', 'With the Search button at the top (or “/” or Ctrl/⌘ K) you can type a container, order, machine or document and open it directly.'],
    ['Üstteki zildeki kırmızı sayı yalnız okunmamış kritik uyarıları sayar; diğer uyarılar panelde listelenir.', 'The red number on the bell counts only unread critical alerts; other alerts are listed in the panel.'], ['Veri güncelliği', 'Data freshness'], ['Yakında: ', 'Coming soon: '], ['Yeni modüller', 'New sections'],
    ['Yeşil / sarı nokta', 'Green / yellow dot'], ['Yeşil: veri güncel. Sarı: veri eski; ⓘ içinde nedenini yazar. Yanındaki “x dk önce” son güncellemeyi gösterir.', 'Green: data is up to date. Yellow: data is stale; the reason is in ⓘ. The “x min ago” beside it shows the last update.'],
     
    ['Automatic Batın machines', 'Automatic abdominal pad machines'], ['Batın', 'Abdominal pad'], ['Gauze (Spanç)', 'Gauze swab'], ['Spanç', 'Gauze swab'], ['reçete', 'recipe'], ['Q şüpheli', 'Q suspect'], ['istifleme', 'stacking'], ['İstifleme', 'Stacking'], ['örnek uyarı', 'sample warning'], ['ayrı gösterilir', 'shown separately'],
    ['düşük üretim', 'low output'], ['uyarı', 'warning'], ['sayacı', 'counter'], ['raporlamıyor', 'not reporting'], ['durmuş değil', 'not stopped'], ['Dokuma', 'Weaving'], ['Kompres hattı', 'Compress line'], ['Dokuma tezgâhı', 'Weaving loom'], ['Hedefin altında', 'Below target'], ['yüzde ', 'percent '],
    ['Atfedilemeyen', 'Unattributed'], ['Malzeme bekleme', 'Waiting for material'], ['kümülatif', 'cumulative'], ['Kullanılabilirlik', 'Availability'], ['neden', 'reason'], ['duruş nedenleri', 'stoppage reasons'], ['duruş', 'stoppage'], [' — ayrıntı', ' — details'], ['stacker', 'stacker'], ['bugün şimdiye', 'until now today']
  ]);
  PARCA_L.push.apply(PARCA_L, [
     
    ['taksitli: kalan taksit · diğer: kalan anapara', 'instalment loans: remaining instalments · others: remaining principal'], [' kredi bakiyesi yok', ' loans without balance'], ['TL ve döviz ayrı satır', 'TL and FX on separate rows'], ['Banka düzeyi, kısmi', 'Bank level, partial'], ['Toplam bakiye', 'Total balance'],
    ['Ödeme teyidi bekleyen kalem var', 'Items awaiting payment confirmation'],['Vadesi geçmiş, ödeme teyidi bekleyen kredi taksiti: ', 'Overdue loan instalments awaiting payment confirmation: '], ['Vadesi geçen verilen çek, ödeme teyidi bekleniyor: ', 'Overdue issued cheques, payment confirmation pending: '],
    ['Banka hareketi bağlı değil: vadesi geçen kalem ödendi mi bilinmiyor; "gecikti" denmez.', 'Bank transactions are not connected: whether an overdue item was paid is unknown, so it is not called late.'],
    ['Vadesi geçmiş taksit', 'Overdue instalment'], ['ödeme teyidi bekleniyor', 'payment confirmation pending'], ['Vadesi geçmiş, ödeme teyidi bekleyen', 'Overdue, awaiting payment confirmation'],
    ['Kredi no', 'Loan no.'], ['Varlık (leasing)', 'Asset (leasing)'], ['Kalan taksitlerdeki sigorta/diğer', 'Insurance/other in remaining instalments'], ['Bakiye', 'Balance'], ['kalan toplam taksit', 'remaining total instalments'],
    ['Sigorta/diğer', 'Insurance/other'], ['Faiz ve sigorta/diğer', 'Interest and insurance/other'],
    ['Verilen teminatlar', 'Collateral issued'], ['Verilen teminatlar (', 'Collateral issued ('], ['Alınan teminatlar', 'Collateral received'], ['Alınan teminatlar (', 'Collateral received ('], ['Alınan teminat verisi yok', 'No received-collateral data'],
    ['Bankaların bizim adımıza verdiği teminat mektupları · vadesi geçmiş olanlar işaretli', 'Guarantee letters banks issued on our behalf · expired ones are marked'], ['Müşteri ve firmalardan aldığımız teminatlar (iade edilenler hariç)', 'Collateral received from customers and firms (returned ones excluded)'],
    ['Alınan teminat yok.', 'No received collateral.'], ['Çek karşılığı ve çekle karşılanmayan tutar', 'Cheque cover and amount not covered by cheques'], ['Çek karşılıklı kredi', 'Cheque-backed loans'], ['Bankaya verilen çek', 'Cheques given to bank'], ['Çekle karşılanmayan', 'Not covered by cheques'],
    ['Hazine görünümleri', 'Treasury views'], ['Ödeme takvimi', 'Payment schedule'], ['DMO alacakları', 'DMO receivables'], ['Krediler', 'Loans'], ['Çekler', 'Cheques'], ['Teminat listesi', 'Collateral list'], ['Teminat', 'Collateral'], ['Bankalar', 'Banks'], ['Döviz', 'FX'],
    ['Vadesi geçmiş ödeme var', 'Overdue payments'], ['Vadesi geçmiş açık kredi taksiti: ', 'Overdue open loan instalments: '], [' kredi', ' loans'], ['Vadesi geçen verilen çek: ', 'Overdue issued cheques: '],
    ['Bu ay ödenecek kredi', 'Loan payments due this month'], ['Toplam kredi borcu', 'Total loan debt'], ['kalan anapara', 'remaining principal'], ['kredi/leasing', 'loans/leases'], ['30 gün çek çıkışı / girişi', 'Cheques out / in, next 30 days'], ['çıkış', 'outflow'],
    ['Ödenen ', 'Paid '], [' · kalan ', ' · remaining '], [' taksit', ' instalments'], ['Giriş ', 'Inflow '], ['Nakit', 'Cash'], ['mevduat + bakiye', 'deposits + balance'], ['Mevduat ', 'Deposits '], ['banka bakiyesi', 'bank balance'],
    ['Borç / net alacak (döviz)', 'Debt / net receivable (FX)'], ['Net alacak ', 'Net receivable '], ['En yakın kredi son vadesi', 'Nearest loan final maturity'], ['en yakın kredi son vadesi', 'nearest loan final maturity'], ['sonraki taksit ', 'next instalment '],
    ['Net borç', 'Net debt'], ['kredi borcu − nakit', 'loan debt − cash'], ['Teminat toplamı', 'Total collateral'], [' teminat', ' collaterals'], ['Döviz net pozisyon (USD)', 'FX net position (USD)'], ['TL karşılığı ', 'TL equivalent '],
    ['Kaynak: ', 'Source: '], [' · tarih itibarıyla ', ' · as of '], ['Nakit akış tablosu', 'Cash flow table'], ['nakit akış tablosu', 'cash flow table'], ['DMO ödeme raporu', 'DMO payment report'], ['SAP açık kalemleri ve ', 'SAP open items and '], ['Ödeme planı bakiye sayfası ve ', 'Payment plan balance sheet and '],
    ['Kredi verisi yok', 'No loan data'], ['Kaynakta kredi satırı bulunamadı.', 'No loan rows found in the source.'], ['Banka bazında kalan anapara', 'Remaining principal by bank'], ['TL karşılığı · değerin yanında kredi adedi', 'TL equivalent · loan count next to value'], ['Diğer (', 'Other ('], [' banka)', ' banks)'],
    ['Kredi türü dağılımı', 'Loan type breakdown'], ['Kalan anapara, TL karşılığı', 'Remaining principal, TL equivalent'], ['Tür verisi yok', 'No type data'], ['Kredi listesi (', 'Loan list ('], ['Satıra dokununca ayrıntı açılır', 'Tap a row for details'], ['Kredi türü', 'Loan type'],
    ['Kullandırım tutarı', 'Amount drawn'], ['Kalan anapara', 'Remaining principal'], ['belirsiz', 'unknown'], ['Kalan toplam ödeme', 'Total remaining payment'], ['Faiz oranı', 'Interest rate'], ['Açılış tarihi', 'Opening date'], ['Son vade', 'Final maturity'], ['Kalan taksit sayısı', 'Remaining instalments'],
    ['Sonraki taksit', 'Next instalment'], ['Vadesi geçmiş açık taksit', 'Overdue open instalment'], ['Kalan anapara (TL)', 'Remaining principal (TL)'], ['Faiz', 'Interest'], ['Bu türde kredi yok.', 'No loans of this type.'],
    ['Ödeme takvimi verisi yok', 'No payment schedule data'], ['Kaynakta açık taksit bulunamadı.', 'No open instalments found in the source.'], ['Bu ay (', 'This month ('], ['Ödenen ve kalan taksit', 'Paid and remaining instalments'], ['Ödenen', 'Paid'], ['Kalan', 'Remaining'], ['Vadesi geçmiş açık', 'Overdue open'],
    ['Önümüzdeki 12 ay kredi ödemesi', 'Loan payments, next 12 months'], ['Anapara + faiz, TL karşılığı', 'Principal + interest, TL equivalent'], ['Anapara ', 'Principal '], ['Anapara', 'Principal'], ['Sonraki dönem: anapara ', 'Later periods: principal '], [' + faiz ', ' + interest '],
    ['Banka kırılımı · ', 'By bank · '], ['Toplam ', 'Total '], ['Bu ay için banka kırılımı yok.', 'No bank breakdown for this month.'], ['Banka', 'Bank'],
    ['Verilen çekler', 'Issued cheques'], ['Alınan çekler', 'Received cheques'], ['Çek yönü', 'Cheque direction'], ['Çek verisi yok', 'No cheque data'], ['Toplam açık çek', 'Total open cheques'], [' çek', ' cheques'], ['Vadesi geçen', 'Overdue'], ['Önümüzdeki 30 gün', 'Next 30 days'],
    ['Haftalık vade', 'Weekly maturities'], ['Hafta başlangıcı · TL karşılığı', 'Week start · TL equivalent'], ['Aylık vade', 'Monthly maturities'], ['Vade verisi yok', 'No maturity data'], ['Muhatap bazında (ilk 8)', 'By payee (top 8)'], ['Keşideci bazında (ilk 8)', 'By drawer (top 8)'],
    ['TL karşılığı · çek adedi', 'TL equivalent · cheque count'], ['Banka bazında (ilk 8)', 'By bank (top 8)'], ['Belirtilmemiş', 'Not specified'], ['Çek listesi (', 'Cheque list ('], ['Liste kısaltılmıştır', 'List is truncated'], ['Vadeye göre sıralanır', 'Sorted by maturity'],
    ['Çek yok.', 'No cheques.'], ['Vade', 'Maturity'], ['Tutar (TL)', 'Amount (TL)'], ['Kalan gün', 'Days left'], [' · En yakın vade ', ' · Earliest maturity '], [' çek', ' cheques'], ['Tutar', 'Amount'], ['TL karşılığı', 'TL equivalent'], ['Muhatap', 'Payee'], ['Vadeye', 'To maturity'], [' gün geçti', ' days overdue'], [' gün kaldı', ' days left'],
    ['DMO ödeme verisi yok', 'No DMO payment data'], ['Rapor henüz üretilmedi.', 'The report has not been generated yet.'], ['Şirkete kalan DMO tutarları', 'DMO amounts remaining with the company'], ['milyon ₺ · ödeme tarihine göre', 'million ₺ · by payment date'], ['Kalem', 'Item'],
    ['Teminat verisi yok', 'No collateral data'], ['Verilen teminat toplamı', 'Total collateral issued'], ['60 gün içinde vadesi dolan', 'Expiring within 60 days'], ['Vadesi geçmiş, iade bekleyen', 'Expired, awaiting return'], ['Banka bazında teminat', 'Collateral by bank'],
    ['TL karşılığı · teminat adedi', 'TL equivalent · collateral count'], ['60 gün içinde vadesi dolanlar', 'Expiring within 60 days'], ['Teminat listesi (', 'Collateral list ('], ['Vadesi geçmiş olanlar işaretli', 'Expired ones are marked'], ['Tutar (TL)', 'Amount (TL)'], ['süresiz', 'no expiry'], ['Teminat yok.', 'No collateral.'],
    ['Bakiye TL', 'Balance TL'], ['Bakiye USD', 'Balance USD'], ['Bakiye EUR', 'Balance EUR'], ['Bloke ', 'Blocked '], ['Bakiye', 'Balance'], ['Bloke', 'Blocked'], ['Kredi kalan', 'Loan outstanding'], ['Verilen çek', 'Issued cheques'], ['Limit bilgisi finans ekibinden bekleniyor', 'Limit information is awaited from the finance team'],
    ['Döviz pozisyonu verisi yok', 'No FX position data'], [' pozisyonu', ' position'], ['Kur ', 'Rate '], [' · net TL karşılığı ', ' · net TL equivalent '], ['Varlık', 'Assets'], ['Yükümlülük', 'Liabilities'], ['Net', 'Net'], ['Kalem yok.', 'No items.'],
    ['Döviz kredi anaparası', 'FX loan principal'], ['Döviz alacak', 'FX receivable'], ['Döviz borç', 'FX payable'], ['Banka bakiyesi', 'Bank balance'], ['Alınan çek', 'Received cheque'], ['Tutar (', 'Amount ('], ['kalan', 'remaining'], ['tam liste Krediler sekmesinde', 'full list in the Loans tab'], [' · kaynak tablo toplamı ', ' · source table total '], ['Kur: ', 'Rate: '], ['TL karşılığı güncel kurla hesaplandı', 'TL equivalent at current rate'], [' · güncel kurla', ' · at current rate'], ['tutar kaynakta yok', 'amount not in source'], ['Kalan anapara', 'Remaining principal']
  ]);
  PARCA_L.push.apply(PARCA_L, [
     
    [' kurum · ', ' institutions · '], [' limitli', ' with limit'], ['Limit kaynakta yok', 'No limit in source'], ['Doluluk ', 'Utilisation '],
    ['Limitler', 'Limits'], ['Limit verisi bekleniyor', 'Limit data pending'], ['Banka limitleri finans ekibinden alındığında banka banka burada görünecek.', 'Bank limits will appear here, bank by bank, once received from the finance team.'],
    ['Banka limit listesi', 'Bank limit list'], ['Toplam limit', 'Total limit'], ['Toplam risk (kullanılan)', 'Total risk (used)'], ['Toplam boş limit', 'Total free limit'], [' banka', ' banks'],
    [' dolu', ' used'], ['aşım', 'overrun'], ['Aşım (limit üstü risk)', 'Overrun (risk above limit)'], ['kullanılabilir', 'available'], ['Güncel olmayan limit var', 'Outdated limits'],
    [' bankanın limiti eski revizyondan; boş limit rakamı eski olabilir.', ' bank limits are from an old revision; the free-limit figure may be outdated.'],
    ['Boş limit sıralaması', 'Free limit ranking'], ['Bankalar boş limite göre · TL karşılığı', 'Banks by free limit · TL equivalent'], ['Boş limit hesaplanamadı', 'Free limit could not be calculated'], ['Kaynakta risk/limit alanı yok.', 'No risk/limit field in the source.'],
    ['Boş limit', 'Free limit'], ['Aşım', 'Overrun'], ['Doluluk bilinmiyor', 'Utilisation unknown'], ['Doluluk %', 'Utilisation %'], [' · risk ', ' · risk '], [' / limit ', ' / limit '],
    ['Nakdi (risk / limit)', 'Cash (risk / limit)'], ['Gayrinakdi (risk / limit)', 'Non-cash (risk / limit)'], ['Bizim kredi', 'Our loans'], ['Teminat mektubu', 'Letters of guarantee'], ['Çek karşılığı krediler', 'Loans backed by cheques'], ['Çek karşılığı', 'Cheque-backed'],
    ['Limit kaynağı: ', 'Limit source: '], ['Limit kaynağı belirtilmemiş', 'Limit source not stated'], ['2025 revize — güncel değil', '2025 revision — not current'],
    ['Limit revize vadesi geçmiş — güncel değil', 'Limit revision date passed — not current'], ['Revize vadesi ', 'Revision due '], ['Findeks blok toplamı özet toplamıyla tutmuyor; rakamlar kontrol edilmeli.', 'Findeks block total does not match the summary total; figures need checking.'],
    ['Listedeki', 'Listed'], [' toplam kalan anapara', ' total remaining principal'], ['Kayıt yok', 'No records'], ['Tüm teminatlar', 'All collateral'], ['Teminat süzgeci', 'Collateral filter'], ['belirtilmemiş', 'not stated'], ['Teminat', 'Collateral'],
    [' gün kaldı', ' day(s) left'], [' · süresi geçti', ' · expired'], [' · bugün', ' · today'], [' ilgili kalem', ' relevant item(s)'], [' kalem', ' item(s)'], ['Maliyet tabanı: ', 'Cost floor: '],
    [' geçmiş fiyat', ' past price(s)'], ['DMO dışı: günlük defter', 'Non-DMO: daily log'], ['DMO: robot ', 'DMO: robot '], [' · eski', ' · stale'], ['İKN ', 'Tender no. '], ['Kalem ', 'Item '],
  ]);
   
  [['Veri eski/eksik', 'Data stale/incomplete'], ['Eksik taşıyıcı: ', 'Incomplete carrier: '], ['kısmi okuma', 'partial read'], [' — oranlar eksik olabilir', ' — rates may be understated'], ['son başarılı okuma ', 'last successful read '], ['Kargo teslim (ÖKN portalı)', 'Cargo delivery (ÖKN portal)'], ['Kargo teslim', 'Cargo delivery'], ['Kargo: portalda kayıt yok (kanıt yok)', 'Cargo: no portal record (no evidence)'], ['Kargo teslim verisi yok', 'No cargo delivery data'], ['Gönderi teslim', 'Shipment delivered'], ['Koli teslim', 'Parcel delivered'], [' koli teslim · ', ' parcels delivered · '], [' yolda', ' in transit'], [' hazırlanıyor', ' preparing'], ['Uzun yolda', 'Long in transit'], ['Tam eşleşme', 'Exact match'], ['Tahmini eşleşme', 'Estimated match'], ['Bağlanamadı', 'Unmatched'], ['Teslim edildi', 'Delivered'], ['Dağıtımda', 'Out for delivery'], ['Hazırlanıyor', 'Preparing'], ['Yolda', 'In transit'], ['Eşleme (', 'Matching ('], [' gönderi)', ' shipments)'], ['Durum verisi yok', 'No status data'], ['İhale bağı yok', 'No tender link'], ['(tahmini: ', '(estimated: '], [' gönderi)', ' shipments)'], [' DMO ihalesine bağlı gönderi', ' shipments linked to DMO tenders'], ['DMO ihalesine bağlı koli', 'Parcels linked to DMO tenders'], ['Tüm eşlenen gönderiler (DMO dışı ', 'All matched shipments (non-DMO '], [' dahil): ', ' included): '], ['Panoda esas olan DMO ihalesine bağlı orandır.', 'The DMO-linked rate is the primary one.'], ['Tahmini eşleşmeler (', 'Estimated matches ('], [') kesin değildir; ihale sütunlarında ayrıca etiketlenir.', ') are not certain; they are labelled separately on tenders.'], ['Portalda kaydı olmayan gönderi için durum: kanıt yok (teslim edilmedi sonucu çıkarılmaz).', 'No portal record means: no evidence (it is not concluded as not delivered).'], ['14 günden eski, portalda hâlâ yolda görünen gönderiler. Portal güncellememiş olabilir; teslim edilmedi sonucu çıkarılmaz.', 'Older than 14 days and still in transit on the portal. The portal may not be updated; it is not concluded as not delivered.'], ['Bu ilde uzun yolda gönderi yok', 'No long-transit shipments in this province'], ['Uzun yolda gönderi yok', 'No long-transit shipments']].forEach(function (p) {
    if (!PARCA_L.some(function (x) { return x[0] === p[0]; })) PARCA_L.push(p);
  });
   
  [['Planlama dosyası henüz bağlı değil; durum sevk tarihinden belirlenir.', 'The planning file is not connected yet; status is taken from the dispatch date.'], [' Koli ve ayrıntılı tür bilgisi dosya bağlanınca gelecek.', ' Cargo-box counts and detailed type information will appear once the file is connected.'], [' İrsaliye, lokasyon ve koli bilgisi dosya bağlanınca gelecek.', ' Waybill, location and box information will appear once the file is connected.'],
    ['Bugün için planlanmış sevkiyat yok; “Tümü” sekmesine bakın.', 'No shipments are planned for today; see the “All” tab.'], ['Bu süzgeçte kayıt yok.', 'No records for this filter.'], ['Bu dönemde sevkiyat kaydı yok.', 'No shipments in this period.'],
    ['Ara: kurum, ürün, sipariş, irsaliye…', 'Search: institution, product, order, waybill…'], ['Ara: hastane, İKN, sipariş, il…', 'Search: hospital, tender no., order, province…'], ['Lojistik listesi yok', 'No logistics list'], ['Sevkiyat planı verisi henüz gelmedi.', 'Shipment plan data has not arrived yet.'], ['Günlük rapor yok', 'No daily report'], ['Günlük sevkiyat verisi henüz gelmedi.', 'Daily shipment data has not arrived yet.'],
    ['Liste kesik: ilk ', 'List truncated: first '], [' satır gösteriliyor.', ' rows shown.'], [' gönderi gösteriliyor, toplam ', ' shipments shown, total '], ['Sevkiyat özeti', 'Shipment summary'], ['Aylık sevkiyat', 'Monthly shipments'], ['Her ay çıkışı yapılan teslimat, satır ve miktar', 'Deliveries, lines and quantity dispatched each month'],
    ['Son 30 gün sevkiyat', 'Last 30 days shipments'], ['Günlük çıkışı yapılan teslimat sayısı · günlük ortalama koli ', 'Deliveries dispatched per day · daily average boxes '], ['En çok sevk edilen 10 ürün', 'Top 10 shipped products'], ['Sevk satırı sayısına göre; miktar kendi biriminde', 'By number of shipment lines; quantity in its own unit'], [' · son 60 günde ', ' · in the last 60 days '], [' ürün çeşidi', ' product types'], [' satır · ', ' lines · '], [' satır', ' lines'],
    ['Teslimat listesi', 'Delivery list'], ['Teslim alan kurum', 'Receiving institution'], ['Plan tarihi', 'Planned date'], ['Sevk tarihi', 'Dispatch date'], ['Sevk edildi', 'Dispatched'], ['Planlandı', 'Planned'], ['Tüm durumlar', 'All statuses'], ['Tarih seç', 'Pick a date'], ['Rapor dönemi', 'Report period'], ['Tek gün', 'Single day'], ['Tarih aralığı', 'Date range'], ['Başlangıç ', 'Start '], ['Bitiş ', 'End '],
    ['Günlük rapor', 'Daily report'], ['Lojistik', 'Logistics'], ['Sipariş no', 'Order no.'], ['İrsaliye no', 'Waybill no.'], ['Teslimat no', 'Delivery no.'], ['farklı teslimat', 'distinct deliveries'], ['Teslim (ciro)', 'Delivered (revenue)'], ['Kabul (ciro)', 'Accepted (revenue)'], ['Sipariş tarihi', 'Order date'], ['Dosya no (sipariş)', 'File no (order)'], ['IKN veri yok', 'IKN data missing'], ['IKN yok', 'No IKN'], ['IKN eşleşmedi', 'IKN not matched'], ['YK no / Özel', 'YK no / Private'], ['Özel', 'Private'], ['YK no yok', 'No YK no'], ['Fatura no', 'Invoice no.'], ['Makine bazında fire', 'Scrap by machine'], ['Duruşlar · dönem Excel', 'Stoppages · period Excel'], ['Dönem raporu', 'Period report'], ['Başlangıç', 'Start'], ['Bitiş', 'End'], ['Başlangıç tarihi', 'Start date'], ['Bitiş tarihi', 'End date'], ['Son 7 gün', 'Last 7 days'], ['Son 30 gün', 'Last 30 days'], ['Son 120 gün', 'Last 120 days'], ['Makineler · duruşlar', 'Machines · stoppages'], ['bu dönemde kayıt yok', 'no records in this period'], ['Duruş türü', 'Stoppage type'], ['Duruş yorumu', 'Stoppage comment'], ['Süre (dk)', 'Duration (min)'], ['Vardiya', 'Shift'], ['adet üretim', 'units produced'], ['Fire verisi yok', 'No scrap data'], ['Ortak klasör:', 'Shared folder:'], ['Bankalardan Alınan Teminatlar', 'Guarantees Received from Banks'], ['Bankalardan Alınan Teminatlar (', 'Guarantees Received from Banks ('], ['Bankalardan alınan teminat toplamı', 'Total guarantees received from banks'], ['Eksik Teslimat Sebebiyle Ödenecek Temlik Teminatlı Krediler', 'Assignment-Secured Loans Payable Due to Short Delivery'], ['Cevapsız sesli arama', 'Missed voice call'], ['Cevapsız görüntülü arama', 'Missed video call'], ['Reddedilen arama', 'Declined call'], ['Arama', 'Call'], ['İade', 'Returns'], ['İade verisi henüz yok', 'No returns data yet'], ['iade verisi henüz yok — "iade yok" demek değil', 'no returns data yet — does not mean "no returns"'], ['İadeler için kaynak veri gelince burada listelenir; şimdilik "iade yok" anlamına gelmez.', 'Returns will be listed here once source data arrives; for now this does not mean "no returns".'], ['(hastane azsa hastane sayısı kadar)', '(or the number of hospitals if fewer)'], ['İade adımları', 'Return steps'], ['adım adım takip · adım verisi henüz yok', 'step-by-step tracking · no step data yet'], ['veri yok', 'no data'], ['İade başlatıldı', 'Return started'], ['Lojistik yönlendirildi', 'Logistics assigned'], ['Hastaneden alındı', 'Collected from hospital'], ['Depoya ulaştı', 'Arrived at warehouse'], ['Mal girişi', 'Goods receipt'], ['Kalite kontrol', 'Quality control'], ['Satışa hazır', 'Ready for sale'], ['kayıtlı kanıt yok; iade sayılmaz', 'no recorded evidence; not counted as return'],['İadeler', 'Returns'], ['Özel + DMO', 'Private + DMO'], ['Özel (doğrudan temin dahil)', 'Private (incl. direct procurement)'], ['MY + DAY', 'MY + DAY'], ['Tüm ürün grupları', 'All product groups'], ['Tüm ihaleler', 'All tenders'], ['İhale no seç', 'Select tender no.'], ['Hedefe kadar sevk edilmedi', 'Not shipped by target'], ['Teslimi geciken', 'Late delivery'], ['Satır satır', 'Row by row'], ['Hastane hastane grupla', 'Group by hospital'], ['Hedef tarih (son teslim)', 'Target date (deadline)'], ['Sevk % (irsaliyeyle çıkan)', 'Shipped % (with waybill)'], ['Teslim %', 'Delivered %'], ['Sipariş satırı', 'Order line'], ['Sipariş adedi', 'Order quantity'], ['Sevk durumu (hastane bazında)', 'Shipment status (by hospital)'], ['İptal kotası (%10, en az 3)', 'Cancellation quota (10%, min. 3)'], ['sipariş (hepsi)', 'orders (all)'], ['açık DMO siparişi', 'open DMO orders'], ['İrsaliye', 'Waybill'], ['Teslim noktası', 'Delivery point'], ['Teslim noktası', 'Delivery point'], ['farklı kurum', 'distinct institutions'], ['farklı irsaliye', 'distinct waybills'], ['sevk satırı', 'shipment lines'], ['toplam miktar', 'total quantity'], ['toplam koli', 'total boxes'], ['koli bilgisi yok', 'no box information'], ['Lokasyon', 'Location'], ['Açıklama', 'Note'],
    ['Teslimat', 'Deliveries'], [' · koli ', ' · boxes '], ['Ürün kodu', 'Product code'], ['Sevk satırı', 'Shipment lines'], ['Ürün çeşidi', 'Product types'], ['Excel\'e aktar', 'Export to Excel'], ['Sevk durumu süzgeci', 'Dispatch status filter'], ['Teslim durumu süzgeci', 'Delivery status filter'], ['Sevk durumu', 'Dispatch status'], ['Başlanmadı', 'Not started'], ['Kısmi', 'Partial'], ['Teslim edildi', 'Delivered'], ['Kısmen teslim', 'Partially delivered'], ['Teslim kanıtı yok', 'No delivery evidence'], ['Uyuşmazlık', 'Mismatch'], ['Tamam', 'OK'], ['Hastane', 'Hospital'], ['Teslim durumu', 'Delivery status'], ['Kontrol', 'Check'], ['Ürün grubu', 'Product group'], ['Sevk edilen', 'Dispatched qty'], ['Teslim adet', 'Delivered qty'], ['Son irsaliye', 'Last waybill'], ['Son teslim', 'Last delivery'],
    [' (kısmi ay)', ' (partial month)'], ['Planlandı · gecikmiş', 'Planned · overdue'],
    ['Uzun yolda (', 'Long in transit ('], ['+ gün)', '+ days)'], ['ort. ', 'avg. '], ['(tahmini)', '(estimated)'], ['Kargo çıkış ', 'Cargo dispatch '], ['İli bilinmeyen gönderi yok.', 'No shipments with an unknown province.'], ['İli bilinmeyen ', 'Unknown province: '], [' gönderi bu grafiğe girmez.', ' shipments are not in this chart.'], ['En çok gönderi giden 12 il', 'Top 12 provinces by shipments'], [' kayıtta teslim tarihi çıkıştan önce görünüyor; süre ortalamasına alınmadı.', ' records show a delivery date before dispatch; excluded from the duration average.'],
    ['Ocak', 'January'], ['Şubat', 'February'], ['Mart', 'March'], ['Nisan', 'April'], ['Mayıs', 'May'], ['Haziran', 'June'], ['Temmuz', 'July'], ['Ağustos', 'August'], ['Eylül', 'September'], ['Ekim', 'October'], ['Kasım', 'November'], ['Aralık', 'December']
  ].forEach(function (p) {
    if (!PARCA_L.some(function (x) { return x[0] === p[0]; })) PARCA_L.push(p);
  });
   
  [[' sipariş · en uzun ', ' orders · longest '], ['İlk teslimat siparişten ', 'First delivery after order: '], [' gün sonra', ' days'], ['İlk fatura ilk tesliminden ', 'First invoice after first delivery: '], [' açık sipariş', ' open orders'], ['Süresi geçti ', 'Expired '], [' · 7 günde ', ' · within 7 days ']].forEach(function (p) {
    if (!PARCA_L.some(function (x) { return x[0] === p[0]; })) PARCA_L.push(p);
  });
   
  [['Kredi kartları', 'Credit cards'], ['Kira artışı', 'Rent increases'], ['Sözleşmeler', 'Contracts'], ['Asistan önerisi', 'Assistant suggestion'], ['Kapsam varsayımı', 'Scope assumption'], ['Öneri', 'Suggestion'],
    ['Kredi önerisi', 'Loan suggestion'], ['Kapatılabilir', 'Can be closed'], ['Yenileme/uzatma değerlendir', 'Consider renewal/extension'], ['Döviz borçları · güncel kur (TCMB)', 'FX debts · current rate (CBRT)'],
    ['Kur tarihi', 'Rate date'], ['Kur (TCMB satış)', 'Rate (CBRT selling)'], ['PDF/fotoğraf ekle', 'Add PDF/photo'], ['Kredi kartı verisi yok', 'No credit card data'], ['Kira sözleşmesi verisi yok', 'No lease data'],
    ['Sözleşme kaydı yok', 'No contract records'], ['Yaklaşan kira artışları', 'Upcoming rent increases'], ['Sözleşme ara', 'Search contracts'], ['Ad veya tür', 'Name or type'], ['Aramaya uyan sözleşme yok.', 'No contract matches the search.'],
    ['Teslim edilmemiş DMO siparişi · öz kaynak açığı', 'Undelivered DMO orders · equity gap'], ['DMO siparişi teslim edilmedi: kredi vadesinde öz kaynaktan ödenecek açık', 'DMO order not delivered: gap to be paid from equity at the loan maturity'],
    ['Kendiliğinden işlem yapılmaz.', 'No action is taken automatically.'], ['Ödemeye kalan gün', 'Days to payment'], ['Hesap kesim günü', 'Statement day'], ['Son ödeme günü', 'Payment due day'], ['indir', 'download']].forEach(function (p) {
    if (!PARCA_L.some(function (x) { return x[0] === p[0]; })) PARCA_L.push(p);
  });
  var PARCA = PARCA_L.slice().sort(function (a, b) { return b[0].length - a[0].length; });
  var REGEX = [
    [/(^|\D)1 days ago/g, '$11 day ago'], [/(^|\D)1 days left/g, '$11 day left'], [/(^|\D)1 days/g, '$11 day'], [/(\d+) sa (\d+) dk önce/g, '$1 h $2 min ago'], [/(\d+) sa önce/g, '$1 h ago'], [/(\d+) dk önce/g, '$1 min ago'], [/(\d+) gün önce/g, '$1 days ago']
  ];
   
  var HARF = /[A-Za-zÇĞİÖŞÜçğıöşüÂâ]/;
  function degis(s, a, b) {
    var bas = HARF.test(a.charAt(0)), son = HARF.test(a.charAt(a.length - 1)), cikti = '', i = 0, j;
    while ((j = s.indexOf(a, i)) >= 0) {
      var ok = (!bas || j === 0 || !HARF.test(s.charAt(j - 1))) && (!son || j + a.length >= s.length || !HARF.test(s.charAt(j + a.length)));
      cikti += s.substring(i, j) + (ok ? b : a); i = j + a.length;
    }
    return cikti + s.substring(i);
  }
   
  var L = '(?![A-Za-zÇĞİÖŞÜçğıöşüÂâ])';
  function say(tr, bir, cok) {
    REGEX.push([new RegExp('(^|[^\\d.,])1 ' + tr + L, 'g'), '$11 ' + bir]);
    REGEX.push([new RegExp('(\\d) ' + tr + L, 'g'), '$1 ' + cok]);
  }
  [['sipariş', 'order', 'orders'], ['kayıt', 'record', 'records'], ['kalem', 'item', 'items'], ['konteyner', 'container', 'containers'], ['belge', 'document', 'documents'], ['fatura', 'invoice', 'invoices'],
   ['hastane', 'hospital', 'hospitals'], ['ihale', 'tender', 'tenders'], ['taksit', 'instalment', 'instalments'], ['rica', 'request', 'requests'], ['teslimat', 'delivery', 'deliveries'], ['alarm', 'alarm', 'alarms'], ['tezgâh', 'loom', 'looms'], ['hat', 'line', 'lines']].forEach(function (a) { say(a[0], a[1], a[2]); });
  REGEX.splice.apply(REGEX, [0, 0].concat([[/^Daha fazla \((\d+)\)$/, 'More ($1)'], [/^(.+) hakkında ayrıntı$/, 'Details: $1'],[/(?:Eğilim|Trend):\s*son\s+(\d+)\s+günde açılan sipariş sayısı \(günlük\)/g, 'Trend: daily number of orders opened in the last $1 days'], [/(?:Eğilim|Trend):\s*son\s+(\d+)\s+gün(?![a-zçğıöşü])/gi, 'Trend: last $1 days'], [/kaynak dosya\s+(.+?)\s+tarihli/g, 'source file dated $1'], [/\(\+(\d+) alarm\w* daha\)/g, '(+$1 more alarms)'], [/(\d+) milyon adet yolda/g, '$1 million units in transit'], [/Etiket yok, [“"]sorun yok[”"] anlamına gelmez/g, 'A missing label does not mean “no problem”'], [/kaynak (\d+) günlük pencere[^\s.;,]*/g, 'source window of $1 days'],
   [/^son (\d+) gün/g, 'last $1 days'], [/(^|[^\d.,])1 (?:delivery|teslimat) müşteri\/hastane sevkiyatı sayılarına dahil değildir; /g, '$11 delivery is not included in customer/hospital shipment counts; '], [/(\d+) (?:delivery|deliveries|teslimat) müşteri\/hastane sevkiyatı sayılarına dahil değildir; /g, '$1 deliveries are not included in customer/hospital shipment counts; '], [/Önümüzdeki (\d+) günde günlük varış sayısı/g, 'Daily arrivals over the next $1 days'], [/Önümüzdeki (\d+) günde/g, 'In the next $1 days'], [/Önümüzdeki (\d+) gün(?![a-zçğıöşü])/g, 'Next $1 days'],
   [/(\d+) gün içinde/g, 'within $1 days'], [/Son (\d+) gün çıkan/g, 'Dispatched in the last $1 days'], [/son (\d+) gün penceresi/g, 'last $1-day window'], [/son (\d+) günde/g, 'in the last $1 days'], [/Trend: son (\d+) gün/g, 'Trend: last $1 days'],
   [/Trend: Son (\d+) tam gün/g, 'Trend: last $1 full days'], [/Analiz \(huni, gecikme, son (\d+) gün\)/g, 'Analysis (funnel, delay, last $1 days)'], [/(\S+) tarihinde açıldı/g, 'opened on $1'], [/kaynak dosya (\d+) gün önceki tarihli/g, 'source file dated $1 days earlier'],
   [/(\S+) itibarıyla, milyon/g, 'As of $1, million'], [/(\S+ – \S+) arasında oluşturulan belgeler; tutar yok/g, 'Documents created between $1; no amounts'], [/(\d\d:\d\d)’den bugün şimdiye/g, 'from $1 today until now'], [/Nakliye firması ve teslim kanıtı SAP.de tutulmuyor; /g, 'The carrier and proof of delivery are not kept in SAP; '],
   [/Şirket içi \(MY→DAY\)/g, 'Internal (MY→DAY)'], [/(\d+) kaynağın/g, '$1 sources’']]));
   
  var TAM_MESAJ = {
    'Asistan': 'Assistant', 'Yeni sohbet': 'New chat', 'Yenile': 'Refresh', 'Geri': 'Back', 'Başlat': 'Start', 'Anladım': 'Got it', 'Kişi ara': 'Search people', 'Grup adı': 'Group name',
    'Kişi seçin': 'Select people', 'Sohbet yok': 'No chats', 'Mesaj yok': 'No messages', 'Mesaj': 'Message', 'Gönder': 'Send', 'Kartı gönder': 'Send card', 'Siz': 'You', 'Okundu': 'Read',
    'Gönderildi': 'Sent', 'Gönderiliyor': 'Sending', 'Gönderilemedi': 'Not sent', 'Ulaştı': 'Delivered', 'İletildi': 'Delivered', 'Okundu': 'Read', 'Yeniden dene': 'Try again', 'Mesajın ulaştığı ve okunduğu bilgisi sohbet üyelerine gösterilir.': 'Whether a message was delivered and read is shown to the members of the chat.', 'Biri': 'Someone', 'yazıyor…': 'is typing…', 'Sesli ara': 'Voice call', 'Görüntülü ara': 'Video call', 'Aranıyor': 'Calling', 'Arama sürüyor': 'Call in progress',
    'sizi arıyor': 'is calling you', 'görüntülü': 'video', 'Sesli mesaj': 'Voice message', 'Dosya': 'File', 'Paylaşılan kart': 'Shared card', 'Dosya / fotoğraf': 'File / photo', 'Katıl': 'Join',
    'Sohbet': 'Chat', 'Kişi bulunamadı': 'No people found', 'Yükleniyor': 'Loading', 'Yükleniyor…': 'Loading…', 'Mesaj kapalı': 'Messaging is off',
    'Mesaj girişi alınamadı': 'Could not sign in to messaging', 'Giriş geçersiz': 'Sign-in is not valid', 'Bu sohbete erişiminiz yok': 'You do not have access to this chat', 'Bulunamadı': 'Not found',
    'Geçersiz istek': 'Invalid request', 'Çok sık istek; biraz sonra deneyin': 'Too many requests; please try again shortly', 'Bağlantı yok': 'No connection', 'Sunucu hatası': 'Server error',
    'Mesaj boş': 'Message is empty', 'Mesaj çok uzun': 'Message is too long', 'Bu dosya türü gönderilemez': 'This file type cannot be sent', 'Dosya 25 MB\'tan büyük olamaz': 'File cannot be larger than 25 MB',
    'Fotoğraf işlenemedi': 'Photo could not be processed', 'Dosya yüklenemedi': 'File could not be uploaded', 'Grup adı yazın': 'Enter a group name', 'Arama bu cihazda yok': 'Calling is not available on this device',
    'Arama başlatılamadı': 'Could not start the call', 'Alınamadı': 'Could not be retrieved',
    'Mesajlar': 'Messages', 'Sohbetler': 'Chats', 'Ara': 'Search', 'Tümü': 'All', 'Okunmamış': 'Unread', 'okunmamış': 'unread', 'Favoriler': 'Favorites', 'Gruplar': 'Groups', 'Arşivlenmiş': 'Archived',
    'Asistan şu an yanıt vermiyor. Sorunuzu mail ile iletin; cevap kendi yetkinize göre verilir.': 'The assistant is not responding right now. Send your question by email; the answer follows your own access rights.',
    'Asistan hazırlanıyor…': 'The assistant is getting ready…', 'Soru iletilemedi': 'The question could not be sent', 'hata': 'error', 'Sorunuz': 'Your question', 'Gönder': 'Send',
    'Cevap gecikti. Yeniden sorabilir ya da iş olarak iletebilirsiniz.': 'The answer is taking long. You can ask again or send it as a request.', 'Erişebildiğin bölümler:': 'Sections you can access:',
    'Şirket içi yapay zekâ asistanı': 'In-company AI assistant', 'Henüz sohbet yok. Başlatmak için + düğmesine dokunun.': 'No chats yet. Tap + to start one.', 'Arşivde sohbet yok': 'No archived chats', 'Sonuç yok': 'No results',
    'Sohbetler şirket hesabında saklanır.': 'Chats are stored in the company account.', 'Gizle': 'Hide', 'Ayrıntı': 'Details', 'Açılıyor': 'Opening', 'Kişi listesi yenileniyor…': 'Refreshing the people list…',
    'Kişi listesi alınamadı': 'Could not load the people list', 'Yeni grup': 'New group', 'Henüz kimse yok — app\'i açan iş arkadaşların burada görünecek': 'No one yet — colleagues who open the app will appear here',
    'Grubu oluştur': 'Create group', 'kişi seçildi': 'selected', 'Gruba eklenecek kişileri seçin': 'Select people to add to the group', 'Grup için en az 2 kişi seçin': 'Select at least 2 people for a group',
    'Kişi listesi yenilendi, tekrar deneyin': 'People list refreshed, try again', 'Grup bilgisi': 'Group info', 'Kişi bilgisi': 'Contact info', 'Grup': 'Group', 'üye': 'members', 'Görüntülü': 'Video',
    'Sesi aç': 'Unmute', 'Sessize al': 'Mute', 'Favoriden çıkar': 'Remove from favorites', 'Favoriye ekle': 'Add to favorites', 'Arşivden çıkar': 'Unarchive', 'Arşivle': 'Archive', 'Sabitle': 'Pin',
    'Sabitlemeyi kaldır': 'Unpin', 'Üye ekle': 'Add member', 'Yönetici': 'Admin', 'Gizlilik': 'Privacy', 'Okundu say': 'Mark as read', 'Tümünü gör': 'See all', 'Paylaş': 'Share', 'Sohbette ara': 'Search in chat', 'Medya': 'Media', 'Ayarlar': 'Settings', 'Üyeler': 'Members', 'Medya yok': 'No media', 'Grup açıklaması ekle': 'Add group description', 'Grup açıklaması': 'Group description', 'Kaydet': 'Save', 'Gruptan çık': 'Leave group', 'Yöneticiliği kaldır': 'Remove as admin', 'Yönetici yap': 'Make admin', 'Üye işlemleri': 'Member actions', 'Medya yüklenemedi': 'Media could not be loaded', 'Ayar yok': 'No settings', 'Paylaşım bu cihazda yok': 'Sharing is not available on this device', 'Gruptan çıkar': 'Remove from group', 'Ekle': 'Add', 'Mesaj yazın': 'Type a message', 'Fotoğraf': 'Photo',
    'Sohbet yüklenemedi': 'Chat could not be loaded', 'Vazgeç': 'Cancel', 'İşlem yapılamadı': 'Action could not be completed', 'Daha fazla': 'More', 'Yeniden dene': 'Try again', 'Dün': 'Yesterday', 'Bugün': 'Today',
    'Bu sohbetler şirketin Microsoft bulut hesabında (Avrupa Birliği içinde) 12 ay saklanır. Uçtan uca şifreli değildir; şirket yönetimi gerektiğinde erişebilir. Aramalar kaydedilmez. Şifre, kimlik numarası, sağlık bilgisi yazmayınız. Buraya yazılan \'onay\' ya da \'gönder\' hiçbir işlemi başlatmaz.':
      'These chats are kept for 12 months in the company\'s Microsoft cloud account (within the European Union). They are not end-to-end encrypted; company management can access them when required. Calls are not recorded. Do not write passwords, ID numbers or health information. Writing \'approve\' or \'send\' here does not start any action.',
    'Mumu Talk': 'Mumu Talk', 'Mumu Meet toplantısı': 'Mumu Meet meeting', 'Toplantı': 'Meeting', 'Mumu Meet': 'Mumu Meet', 'Bildirimleri sessize al': 'Mute notifications', 'Sessize alındı': 'Muted','Sessize aldığınızı diğer kişi görmez. Bahsedildiğinizde yine bildirim alırsınız.': 'The other person will not see that you muted. You will still get notifications when you are mentioned.', 'saatine kadar': 'until', 'tarihine kadar': 'until', '8 saat': '8 hours', '1 hafta': '1 week', 'Her zaman': 'Always',
    'Bu özellik birazdan açılacak': 'This feature will be available shortly', 'Asistan bu grupta birazdan açılacak': 'The assistant will be available in this group shortly',
    'yeni mesaj': 'new messages', 'Mumu Talk · yeni mesaj': 'Mumu Talk · new messages',
    'Mumu Meet lobisinde, uygulamayı açık tutan iş arkadaşlarınız sizi \'çevrimiçi\' olarak görebilir.': 'In the Mumu Meet lobby, colleagues who keep the app open can see you as \'online\'.'
  };
  Object.keys(TAM_MESAJ).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_MESAJ[k]; });
   
  var TAM_VARDIYA = { 'Vardiya': 'Shift', 'Operatör': 'Operator', 'Gündüz': 'Day', 'Gece': 'Night', 'Akşam': 'Evening' };
  Object.keys(TAM_VARDIYA).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_VARDIYA[k]; });
   
  var TAM_URETIM = {
    'Üretim Planı': 'Production Plan', 'Plan': 'Plan', 'Hat yükü, açık siparişler ve sterilizasyon önerileri': 'Line load, open orders and sterilization suggestions',
    'Hat yükü': 'Line load', 'Siparişler': 'Orders', 'Değerler': 'Values', 'Üretim planı görünümleri': 'Production plan views',
    'Hat yükü yok': 'No line load', 'Hat yükü bilgisi şu an alınamıyor.': 'Line load information is not available right now.',
    'günlük iş': 'workdays', 'Hat ailesi yükü': 'Line family load', 'açık işin kaç günlük olduğu': 'how many days of work are open', 'Kaç günlük iş': 'Days of work',
    'Hesaplanabilen hat ailesi yok.': 'No line family can be calculated.', 'Hat aileleri': 'Line families', 'son 10 iş günü ortalaması': 'average of the last 10 working days',
    'Hat ailesi yok.': 'No line family.', 'Hat ailesi': 'Line family', 'Açık iş': 'Open work', 'Günlük ort.': 'Daily avg.', 'Hedef': 'Target', 'Ölçüm': 'Measurement',
    'Makine sayacı': 'Machine counter', 'Üretim onayı': 'Production confirmation', 'Kesin değil': 'Not final', 'Mabotex hatları': 'Mabotex lines', 'hat bazında': 'by line', 'Hat yok.': 'No line.', 'Hat': 'Line',
    'Spanç toplam hedef': 'Total sponge target', 'Dokuma': 'Weaving', 'Çin makineleri': 'China machines', 'Otomatik batın': 'Automatic abdominal', 'Manuel batın': 'Manual abdominal', 'Spanç ortak': 'Sponge shared', 'Diğer': 'Other', 'Diğer (eşlenmedi)': 'Other (unmatched)',
    'Tümü': 'All', 'Şirket': 'Company', 'Açık sipariş satırı': 'Open order lines', 'Eksiği olan satır': 'Lines with shortage', 'Eksik olup üretimi açılmamış': 'Short with no production opened',
    'Depo tanımı doğrulanmadı': 'Store definition not verified', 'Açık sipariş yok': 'No open orders', 'Açık sipariş bilgisi şu an alınamıyor.': 'Open order information is not available right now.',
    'Eşleşen sipariş yok.': 'No matching order.', 'Müşteri': 'Customer', 'Ürün': 'Product', 'İstenen teslim': 'Requested delivery', 'Söz verilen teslim': 'Promised delivery', 'Sipariş': 'Order', 'Eksik': 'Shortage', 'Stok': 'Stock', 'Üretim': 'Production', 'Açık': 'Open', 'Yok': 'None',
    'Sterilizasyon planı yok': 'No sterilization plan', 'Sterilizasyon bilgisi şu an alınamıyor.': 'Sterilization information is not available right now.',
    'Günlük iç cihaz kapasitesi': 'Daily in-house unit capacity', 'Sterilizasyon kuyruğu': 'Sterilization queue', 'Kuyruk': 'Queue', 'sterilizasyon bekleyen': 'awaiting sterilization', 'Kuyruk hesaplanamadı.': 'Queue could not be calculated.',
    'Kuyrukta ürün yok.': 'No product in the queue.', 'Koli': 'Cases', 'Palet': 'Pallets', 'Teslim': 'Delivery', 'Öncelik': 'Priority', 'Döngü önerisi hesaplanamadı.': 'Cycle suggestion could not be calculated.', 'Şu an döngü önerisi yok.': 'No cycle suggestion right now.',
    'Taslak': 'Draft', 'Döngü önerileri': 'Cycle suggestions', 'tam paletli, döngü başına en çok 168 koli': 'full pallets, at most 168 cases per cycle',
    'Güncellik bilgisi yok.': 'No freshness information.', 'Veri yok': 'No data', 'Eski': 'Old', 'Sipariş ve stok': 'Orders and stock', 'Üretim onayı ve depo hareketi': 'Production confirmation and store movement',
    'Dokuma ve Mabotex sayacı': 'Weaving and Mabotex counter', 'Çin ve batın sayacı': 'China and abdominal counter', 'Veri güncelliği': 'Data freshness', 'her bilginin son tarihi': 'latest date of each item',
    'Değer bilgisi yok.': 'No value information.', 'Planlama değerleri': 'Planning values', 'dokununca ayrıntı': 'tap for details',
    'İç cihaz: döngü başına koli': 'In-house unit: cases per cycle', 'İç cihaz: günlük koli': 'In-house unit: cases per day', 'Karantina süresi': 'Quarantine time',
    'Dış sterilizasyon (1): haftalık koli': 'External sterilization (1): cases per week', 'Dış sterilizasyon (2): günlük koli': 'External sterilization (2): cases per day',
    'Dış sterilizasyon: gidiş dönüş süresi': 'External sterilization: round-trip time', 'Dış sterilizasyon uygunluğu': 'External sterilization suitability', 'Araç palet kapasitesi': 'Vehicle pallet capacity',
    'Sevk paleti koli adedi': 'Cases per shipping pallet', 'Spanç günlük hedef': 'Sponge daily target', 'Mabotex günlük hedef': 'Mabotex daily target', 'Otomatik batın günlük hedef': 'Automatic abdominal daily target', 'Ölçülen değer': 'Measured value',
    'Veri henüz yok': 'No data yet', 'Üretim planı hazırlandığında burada görünecek.': 'The production plan will appear here once it is prepared.', 'Üretim planı alınamadı': 'Could not load production plan',
    'Veri eski': 'Data is old', 'ÖRNEK VERİ — gerçek değil': 'SAMPLE DATA — not real'
  };
  Object.keys(TAM_URETIM).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_URETIM[k]; });
   
  var TAM_GECE = {
     
    'Kurum, İKN veya kalem ara': 'Search institution, tender no. or item', 'Depodaki lot': 'Lot in warehouse', 'Eşleşen lot yok': 'No matching lot', 'Aramayı değiştirin.': 'Try a different search.',
     
    'Siparişleri gör': 'View orders', 'Veri yok: bu ihalenin sevk satırı kaynakta yok': 'No data: this tender has no dispatch lines in the source', 'Ortalama çıkıştan teslime': 'Average dispatch-to-delivery', 'İlk son teslim tarihi': 'First delivery deadline',
    'DMO onayladı': 'DMO approved', 'İKN': 'Tender no.', 'Çıktı %': 'Dispatched %', 'Çıktı': 'Dispatched', 'tümü': 'all', 'Eşleşmeyen teslim belgeleri': 'Unmatched delivery documents', 'Tüm firmalar': 'All companies',
    'Firmaya göre kırılım': 'Breakdown by company', 'MY ve DAY ayrı ayrı': 'MY and DAY separately', 'ödenmemiş DMO faturaları': 'unpaid DMO invoices', 'aktif, siparişli, teslimi başlayan': 'active, with orders, delivery started',
    'zamanında ve tam teslim': 'on-time and complete delivery', 'iptal hakkı doluluğu': 'cancellation allowance used', 'DMO Nakliyat ihale bazında': 'DMO Logistics by tender', 'Teslim kanıtı yok, ayrıntı': 'No delivery evidence, details',
    'Teslim kanıtı yok, teslim edilmedi demek değildir; yalnız belge kaydı bulunamadı demektir.': 'No delivery evidence does not mean not delivered; it only means no document record was found.', 'Örnek veri, gerçek değil. ': 'Sample data, not real. ',
    'Teslim edilmedi DEĞİL, kanıt yok': 'NOT undelivered, no evidence',
     
    'Hatlar': 'Lines', 'Duruşlar': 'Downtime', 'Teslim oldu': 'Delivered', 'Teslim edilen': 'Delivered', 'Teslim kanıtı': 'Delivery evidence', 'Malzeme türü': 'Material type', 'Canlı pano': 'Live board', 'Makineler görünümü': 'Machines view', 'Çalışan hat': 'Running lines', 'Duran / sorunlu hat': 'Stopped / faulty lines', 'Alarm (24 sa)': 'Alarms (24 h)',
    'gerçek makine verisi değil': 'not real machine data', 'ÖRNEK VERİ — fabrika rakamları gerçek değil': 'SAMPLE DATA — factory figures are not real', 'Hat adedi (canlı tahmini)': 'Line count (live estimate)',
     
    'Bu hastanenin siparişleri': 'Orders of this hospital', 'Bu IKN toplam ciro (son 90 gün)': 'Total turnover of this tender no. (last 90 days)', 'Bu hastanede sipariş kalemi yok': 'No order items for this hospital', 'Sipariş verisi şu an yok': 'No order data at the moment',
    'Açık sipariş takibi': 'Open order tracking', 'DMO hastaneler': 'DMO hospitals', 'DMO ihaleler': 'DMO tenders', 'DMO siparişler': 'DMO orders', 'Olumsuz muayeneler': 'Failed inspections', 'DMO ceza kesintileri': 'DMO penalty deductions',
    'Açık siparişi olanlar': 'With open orders', 'Cezalı süre kalan gün': 'Penalty period days left', 'Cezalı süre sonu': 'Penalty period end', 'İşlem son tarihi': 'Action deadline', 'Tüm etiketliler': 'All flagged', 'En yakın son teslim': 'Nearest delivery deadline',
    'Gönderilecek adet': 'Units to ship', 'Sipariş sayısı': 'Number of orders', 'Ceza ve iptal kotası': 'Penalty and cancellation quota', 'sipariş ayına göre sayı': 'count by order month', 'İl': 'Province',
    'Riskli, süresi geçmiş ya da teslim edilmemiş etiketli hastane yok.': 'No flagged hospitals that are at risk, overdue or undelivered.',
     
    'Borç ve teminat': 'Debt and collateral', 'Taksitler': 'Instalments', 'Alacak / borç': 'Receivables / payables', 'DMO ödemesi': 'DMO payment', 'Finans bölümleri': 'Finance sections', 'Tutar (TL karş.)': 'Amount (TRY equiv.)',
     
    'Harita yükleniyor…': 'Loading map…', 'Harita zamanında açılamadı. Bağlantınızı kontrol edip yeniden deneyin.': 'The map did not open in time. Check your connection and try again.',
     
    'Mabotex hatları': 'Mabotex lines', 'makinenin bildirdiği oran · adet': 'rate reported by the machine · units', 'önümüzdeki 7 gün içinde varış': 'arriving within the next 7 days',
     
    'Taşıyıcı': 'Carrier', 'Firma': 'Company', 'Tarih': 'Date', 'Şirket': 'Company', 'Gecikme (gün)': 'Delay (days)', 'Çıkış tarihi': 'Dispatch date', 'Kargo durumu': 'Cargo status', 'Nakliye teslimat listesi': 'Transport delivery list',
    'EAN / UBB': 'EAN / UBB', 'Onay %': 'Approval %', 'SKT': 'Expiry date', 'Okundu olarak işaretle': 'Mark as read', 'Özet verisi yok': 'No summary data', 'Sevkiyat bölümü': 'Shipments section', 'Teslim durumu yok': 'No delivery status',
     
    'Baskın tür': 'Dominant type', 'Sıra': 'Rank', 'Yaş (gün)': 'Age (days)', 'Hedef aşıldı': 'Target exceeded', 'Hayır': 'No', 'Yönlendirme': 'Routing', 'Öncelik sırası': 'Priority order', 'Şikâyet öncelik sırası': 'Complaint priority order',
    'Şikâyet dikkat listesi': 'Complaint watch list', 'Açık olay yok': 'No open events', 'Sıralanacak açık şikâyet bulunmuyor.': 'There are no open complaints to rank.',
    'Açık olaylar; önce bakılacak olan üstte. Sıralama karar değildir, yöntem alttadır': 'Open events; the one to look at first is on top. The ranking is not a decision; the method is below',
     
    'Tedarikçi lotu': 'Supplier lot', 'Parti oluşturma tarihi': 'Batch creation date', 'Satınalma talep no': 'Purchase requisition no.', 'Satınalma talepleri': 'Purchase requisitions', 'Talep miktarı': 'Requested quantity', 'Siparişe dönen': 'Converted to order',
    'Parti sayısı': 'Number of batches', 'ürün toplamı': 'product totals', 'Stok değeri': 'Stock value',
     
    'Anlık sonuç': 'Instant result', 'Dikkat skoruna göre sıralı': 'Sorted by attention score', 'Aramayı ya da süzgeci değiştirin.': 'Change the search or the filter.', 'Tüm hastaneler izleme seviyesinde.': 'All hospitals are at watch level.',
    'Eşleşen hastane yok': 'No matching hospital', 'Hastane ara': 'Search hospitals', 'Kalite bölümleri': 'Quality sections', 'Örnek veri: hastane adları, sipariş numaraları ve tutarlar gerçek değil.': 'Sample data: hospital names, order numbers and amounts are not real.'
  };
  Object.keys(TAM_GECE).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_GECE[k]; });
   
  REGEX.splice.apply(REGEX, [0, 0].concat([
    [/^Siparişleri gör \((\d+)\)$/, 'View orders ($1)'], [/^Mabotex hatları \((\d+)\)$/, 'Mabotex lines ($1)'], [/^Tümünü gör \((\d+)\)$/, 'See all ($1)'], [/^İhale bazında \((\d+)\)$/, 'By tender ($1)'],
    [/^Veri yok: bu ihalenin sevk satırı kaynakta yok \((\S+) sipariş kayıtlı\)\.?$/, 'No data: this tender has no dispatch lines in the source ($1 orders on record).'],
    [/(^|[^\d.,])1 kesinti satırı/g, '$11 deduction line'], [/(\S+) kesinti satırı/g, '$1 deduction lines'],
    [/(\S+) hastane satırı \(her satır bir IKN × hastane; aynı hastane birden çok ihalede görünebilir\)/g, '$1 hospital rows (each row is one tender no. × hospital; the same hospital can appear in several tenders)'],
    [/(\S+) sipariş kalemi \(özet kartları tekil sipariş sayar; bir sipariş birden çok kalem olabilir\)/g, '$1 order items (summary cards count unique orders; one order can have several items)'],
    [/(\S+) ihale · çubuk: koyu = hastane kabulü, açık = teslim, çizgi = temlik eşiği/g, '$1 tenders · bar: dark = hospital acceptance, light = delivery, line = assignment threshold'],
    [/(\S+) kayıt · 15 günlük değişim süresi "işlem son tarihi"nden izlenir · ret gerekçesi metni kaynakta yok/g, '$1 records · the 15-day change period is tracked from the "action deadline" · rejection reason text is not in the source'],
    [/(\S+) sipariş kalemi$/, '$1 order items'], [/^(\d+) sipariş · (\S+) ürün$/, '$1 orders · $2 products'],
    [/(\S+) talep kalemi · son 180 gün \((.+?) sonrası\) · yalnız görüntüleme/g, '$1 requisition items · last 180 days (after $2) · view only'],
    [/Toplamda yer almayan: fiyatı kontrol edilecek (\S+) kalem, değeri girilmemiş (\S+) kalem/g, 'Not included in the total: $1 items with price to be checked, $2 items without a value'],
    [/(\S+) gün geçti/g, '$1 days overdue'], [/(\S+) gün kaldı/g, '$1 days left'], [/ · içinde (\S+) tahmin \(ölçüm değil\)/g, ' · of which $1 estimated (not measured)'], [/ · makine ölçümü/g, ' · machine measurement'],
    [/^Plan tarihi: bugün \(/, 'Planned date: today ('], [/^Plan tarihi: tümü$/, 'Planned date: all'], [/(^| · )İhale: /g, '$1Tender: '], [/^Şikâyet olayları - /, 'Complaint events - ']
  ]));
  [['tümü', 'all'], [' · son teslim ', ' · delivery deadline '], ['Şirket: ', 'Company: '], ['Tür: ', 'Type: '], ['Müşteri: ', 'Customer: '], ['Arama: ', 'Search: '], ['Dönem: ', 'Period: '], ['Ürün grubu: ', 'Product group: '], ['İşaret: ', 'Flag: '], ['varış: ', 'arrival: '],
   ['Sıradaki varış: ', 'Next arrival: '], ['Durum: ', 'Status: '], ['Hedef tarih = kaynaktaki son teslim tarihi (ayrı bir hedef tarihi alanı yok).', 'Target date = last delivery date in the source (there is no separate target date field).']].forEach(function (p) { PARCA.push(p); });
   
  var TAM_D4 = {
    'Onay': 'Approval', 'Aç': 'Open', 'Sağlık': 'Health', 'Genel görünüm': 'Overview', 'Hedefi aşan': 'Over target', 'Bilgi notu önerileri': 'Info note suggestions',
    'Tedarikçiler': 'Suppliers', 'Yüksek risk': 'High risk', 'Orta risk': 'Medium risk', 'Düşük risk': 'Low risk', 'Az veri': 'Little data', 'az veri': 'little data', 'tedarikçi': 'supplier',
    'adım': 'step', 'koli/gün': 'cases/day', 'Çar': 'Wed', 'Kullanılan': 'Used',
    'Onay kutusu': 'Approval inbox', 'Onay kuralı': 'Approval rule', 'Onay durumu': 'Approval status', 'Mevcut onay akışı': 'Current approval flow', 'Yetkili onayı gerekir': 'Authorised approval required',
    'Satınalma siparişi onayı': 'Purchase order approval', 'Onay kutusu — tek dokunuşla ONAY / RED': 'Approval inbox — approve / reject with one tap',
    'Müşteri satış siparişi kaydı': 'Customer sales order record', 'Şirket dışı bilgilendirme maili': 'External information email',
    'İzin bakiyem': 'My leave balance', 'İzin talebi': 'Leave request', 'İzin türü': 'Leave type', 'Bordro pusulası': 'Payslip', 'Yalnız kişinin kendisi görür': 'Visible only to the person themselves',
    'gün kaldı': 'days left', 'İzin, bordro pusulası, duyurular': 'Leave, payslips, announcements', 'Not (isteğe bağlı)': 'Note (optional)', '1 hafta önce': '1 week ago', 'Bekleyen talep': 'Pending requests',
    'Talep gönder (örnek)': 'Send request (sample)', 'Yöneticiye gider (örnek akış)': 'Goes to manager (sample flow)', 'Yıllık izin (örnek)': 'Annual leave (sample)', 'Örnek açıklama': 'Sample note',
    'ÖNİZLEME — ÖRNEK VERİ: bu ekran taslaktır, rakamlar sahte, hiçbir düğme kayıt yapmaz': 'PREVIEW — SAMPLE DATA: this screen is a draft, the figures are fake and no button saves anything',
    'ÖRNEK duyuru: yıllık izin planı': 'SAMPLE announcement: annual leave plan',
    'Bu görünümde hastane yok': 'No hospitals in this view', 'adet gönderilecek': 'units to be dispatched', 'adedi son teslimi geçmiş': 'quantity past its last delivery date', 'tıklayınca ilgili liste açılır': 'tapping opens the related list',
    'Riskli sipariş: cezalı süre ya da teslim işlemi bekliyor': 'At-risk orders: penalty period or delivery action pending',
    'İtiraz edilebilir sipariş (teslim var, hastane kabulü yok)': 'Orders open to objection (delivered, no hospital acceptance)',
    'Nakliyeci bazında gecikme': 'Delay by carrier', 'Sipariş akışı': 'Order flow', 'İl haritası': 'Province map', 'günlük adet · MY + DAY': 'daily units · MY + DAY',
    'sevk durumu · ile dokunun, listeler o ile süzülsün': 'dispatch status · tap a province to filter the lists by it', 'Çıktı, portalda teslim yok': 'Dispatched, no delivery on the portal',
    'İhale bazında çıktı, teslim ve DMO onayı': 'Dispatch, delivery and DMO approval by tender', 'İl bazında teslim süresi': 'Delivery time by province', 'Uyuşmazlık süzgeci': 'Mismatch filter',
    'Çıkış siparişten fazla': 'Dispatch exceeds order', 'çıkıştan teslime ortalama gün · en yavaş üstte': 'average days from dispatch to delivery · slowest first',
    'Bu yıl, geçen yılın aynı dönemine göre': 'This year vs the same period last year', 'Müşteri görünümü': 'Customer view',
    'Son 12 ay müşteri faturasına göre · bir müşteriye dokununca siparişleri açılır': 'By customer invoices, last 12 months · tap a customer to open their orders',
    'Ara toplam (türe göre)': 'Subtotal (by type)', 'Aramayı ya da süzgeçleri değiştirin.': 'Change the search or the filters.', 'Diğer:': 'Other:', 'Ara toplam — Diğer': 'Subtotal — Other',
    'tahmin içeren gün (ölçüm değil)': 'days including estimates (not measured)',
    'Ay sonu kapanış': 'Month-end close', 'Borç / özkaynak': 'Debt / equity', 'Muhasebe Müdürü': 'Accounting Manager', 'Yaşa göre, en eski üstte · kişi adı yerine rol': 'By age, oldest first · role instead of person name',
    'önceki döneme göre': 'vs previous period', 'Geçen yıl': 'Last year', 'Günlük net satış': 'Daily net sales', 'ÖRNEK dönem': 'SAMPLE period',
    'Veri gecikmeli': 'Data delayed', 'veri gecikmeli': 'data delayed', 'veri gecikmeli · artmıyor': 'data delayed · not increasing', 'Canlı fabrika panosu': 'Live factory dashboard',
    'Pazar günü döngü yok': 'No cycle on Sunday', 'Manuel batın': 'Manual abdominal', 'Çin makineleri': 'Chinese machines', 'Sterilizasyon kuyruğu': 'Sterilization queue',
    '— kuyruk ve öneriler stok kırılımına dayanır, kesin olmayabilir.': '— the queue and suggestions rely on the stock breakdown and may not be exact.',
    '— stok kırılımı (steril, sterilsiz, karantina) kesin olmayabilir.': '— the stock breakdown (sterile, non-sterile, quarantine) may not be exact.',
    'Puan nasıl hesaplanır': 'How the score is calculated', 'Son 12 ayda tekrarlayan türler': 'Recurring types in the last 12 months', 'Tüm bantlar': 'All bands', 'Diğer · MY': 'Other · MY'
  };
  Object.keys(TAM_D4).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_D4[k]; });
  var AYK_D4 = [['Oca', 'Jan'], ['Şub', 'Feb'], ['Nis', 'Apr'], ['Haz', 'Jun'], ['Tem', 'Jul'], ['Eyl', 'Sep'], ['Eki', 'Oct'], ['Kas', 'Nov'], ['Ara', 'Dec']];
  var REGEX_D4 = AYK_D4.map(function (a) { return [new RegExp('^(Brüt marj: .+? · )' + a[0] + '( \\d+)?( · FAVÖK marjı)'), '$1' + a[1] + '$2$3']; });
  var HAKKINDA_D4 = [['Bugün', 'Today'], ['Manuel batın', 'Manual abdominal'], ['Sterilizasyon kuyruğu', 'Sterilization queue'], ['Çin makineleri', 'Chinese machines'], ['Kalite kararı bekleyen', 'Awaiting quality decision'],
    ['Sevk geçiş deposunda', 'In dispatch transit store'], ['Yüksek risk', 'High risk'], ['Orta risk', 'Medium risk'], ['Düşük risk', 'Low risk'], ['Az veri', 'Little data']];
  HAKKINDA_D4.forEach(function (a) { REGEX_D4.push([new RegExp('^' + a[0] + ' hakkında ayrıntı$'), 'Details: ' + a[1]]); });
  REGEX_D4 = REGEX_D4.concat([
    [/^Brüt marj: /, 'Gross margin: '],
    [/^Ayrıntılı özet \((\d+)\)$/, 'Detailed summary ($1)'], [/^bu hafta (\d+) varış$/, 'this week: $1 arrivals'], [/^● (\d+) belge GİB engeli$/, '● $1 documents — GİB block'],
    [/^(Eldiven|Batın|Spanç) payı (%[\d.,]+)$/, function (m, a, p) { return ({ 'Eldiven': 'Glove', 'Batın': 'Abdominal pad', 'Spanç': 'Gauze swab' })[a] + ' share ' + p; }],
    [/^Güncelleme: (.+)$/, 'Updated: $1'], [/Veri: (\S+(?: \d\d:\d\d)?) itibarıyla/g, 'Data as of $1'],
    [/^Geciken ([\d.,]+) adet \(en çok (\d+) gün\)$/, 'Late $1 units (up to $2 days)'], [/^Gönderilecek miktarın gecikmiş oranı (%[\d.,]+)$/, 'Overdue share of the quantity to be dispatched $1'],
    [/^Teslim (%[\d.,]+), hastane kabulü (%[\d.,]+)$/, 'Delivered $1, hospital acceptance $2'], [/^Örnek veri: hastane adları, sipariş numaraları ve tutarlar gerçek değil\./, 'Sample data: hospital names, order numbers and amounts are not real.'],
    [/^Örnek veri, gerçek değil\./, 'Sample data, not real.'], [/^Bu seçimde yok (\d+)$/, 'Not in this selection $1'], [/^(.+): bu seçimde yok$/, '$1: not in this selection'],
    [/^Kullanılan (\d+)$/, 'Used $1'], [/^İptal hakkı (\d+), kullanılan (\d+)$/, 'Cancellation right $1, used $2'], [/^İptal hakkı \((\d+) sevk zorunlu\)$/, 'Cancellation right ($1 dispatches required)'],
    [/^Sevke başlanmadı (\d+)$/, 'Dispatch not started $1'], [/^Sevke başlanmayan (\d+)$/, 'Not yet dispatched $1'], [/^Tamamlanmadı (\d+)$/, 'Incomplete $1'],
    [/^Teslim belgesi eksiği \((\d+)\)$/, 'Missing delivery documents ($1)'], [/^Uyuşmazlıklar \((\d+)\)$/, 'Mismatches ($1)'], [/^Yalnız uyuşmazlıklar (\d+)$/, 'Mismatches only $1'],
    [/^DMO onayladı (%[\d.,]+)$/, 'DMO approved $1'], [/^Çıktı (%[\d.,]+)$/, 'Dispatched $1'], [/^koli (%[\d.,]+) · gönderi (%[\d.,]+)$/, 'boxes $1 · shipments $2'],
    [/^Çıkan: ([\d.,]+) · (\S+) · Teslim: ([\d.,]+) · Onay: ([\d.,]+)$/, 'Dispatched: $1 · $2 · Delivered: $3 · Approved: $4'],
    [/^Sevk edildi (\d+) · Kısmi (\d+) · Sevke başlanmadı (\d+)$/, 'Dispatched $1 · Partial $2 · Not started $3'], [/^Sevk edildi (\d+), kısmi (\d+), sevke başlanmadı (\d+)$/, 'Dispatched $1, partial $2, not started $3'],
    [/^(.+): Tamamlanmadı · (\d+) hastane · sevk (%[\d.,]+)$/, '$1: Incomplete · $2 hospitals · dispatch $3'], [/^(.+): Sevke başlanmadı · (\d+) hastane · sevk (%[\d.,]+)$/, '$1: Dispatch not started · $2 hospitals · dispatch $3'],
    [/^Plan (\S+) → çıkış yok$/, 'Plan $1 → no dispatch'], [/^Son (\d+) gün günlük çıkan, teslim, onay$/, 'Last $1 days daily dispatched, delivered, approved'],
    [/Veri eski — sevkiyat listesi (\d+) gün önce güncellendi\./, 'Data is stale — shipment list updated $1 days ago.'], [/^([\d.,]+) adet çıktı$/, '$1 units dispatched'], [/^([\d.,]+) adet\/gün$/, '$1 units/day'],
    [/^(%[\d.,]+) arttı geçen yıla göre$/, '$1 up on last year'], [/^(%[\d.,]+) arttı$/, '$1 up'], [/^(%[\d.,]+) azaldı$/, '$1 down'],
    [/^Bayi · /, 'Dealer · '], [/^İhracat · /, 'Export · '], [/^Devlet hastanesi · /, 'State hospital · '],
    [/^(\d+) müşteri · son 12 ay müşteri faturası büyükten küçüğe$/, '$1 customers · last 12 months customer invoices, largest first'],
    [/^(\d+) konteyner — önümüzdeki (\d+) gün içinde varış$/, '$1 containers — arriving within the next $2 days'], [/Fabrika verisi eskiSon güncelleme/, 'Factory data is stale — last updated'],
    [/^Sürüyor (\d+)$/, 'In progress $1'], [/^önceki döneme göre (.+) → (.+)$/, 'vs previous period $1 → $2'], [/^ÖRNEK düzeltme konusu (\d+)$/, 'SAMPLE correction item $1'],
    [/^Gecikmiş kapanış adımı: /, 'Late close step: '],
    [/^Veri gecikmeli \(son: (\d\d:\d\d)\)$/, 'Data delayed (last: $1)'],
    [/^([\d.,]+) koli\/döngü$/, '$1 cases/cycle'], [/^([\d.,]+) döngü\/gün$/, '$1 cycles/day'], [/^([\d.,]+) koli\/gün$/, '$1 cases/day'], [/^Cihaz kapasitesi (\d+) koli\/döngü$/, 'Machine capacity $1 cases/cycle'],
    [/^Teslim (\S+) öncelikli$/, 'Delivery $1 priority'], [/^Tam paletli döngü \((\d+) koli\/palet\); döngü (\d+) koliyi aşmaz$/, 'Full-pallet cycle ($1 cases/pallet); a cycle does not exceed $2 cases'],
    [/^Bitiş (.+) · Sevke hazır (.+)$/, 'Finish $1 · Ready to dispatch $2'], [/^Ürün eşleme: (%[\d.,]+) eşlendi · (%[\d.,]+) Diğer hatlarda$/, 'Product mapping: $1 mapped · $2 on other lines'],
    [/^(\d+) olay için üst bildirim$/, '$1 incidents escalated'],
    [/^(MY|DAY) · (\d+) kalem · zamanında (%[\d.,]+) · vadesi geçmiş açık (\d+)$/, '$1 · $2 items · on time $3 · overdue open $4'], [/^(MY|DAY) · (\d+) kalem · zamanında (%[\d.,]+)$/, '$1 · $2 items · on time $3'],
    [/^(.+) ayında son tarihler \((\d+)\)$/, 'Deadlines in $1 ($2)'], [/^(.+ \d{4}) son tarihleri$/, 'Deadlines for $1'],
    [/^([A-Za-zÇĞİÖŞÜçğıöşü]+ \d{4}) pusulası$/, '$1 payslip'], [/^Örnek izin bakiyesi: (\d+) günden (\d+) gün kullanıldı, (\d+) gün kaldı$/, 'Sample leave balance: $2 of $1 days used, $3 days left'],
    [/^Satınalma · ÖRNEK tedarikçi · ÖRNEK tutar$/, 'Purchasing · SAMPLE supplier · SAMPLE amount'], [/^ÖRNEK tedarikçi · ÖRNEK tutar$/, 'SAMPLE supplier · SAMPLE amount'], [/^Satış · ÖRNEK hastane · (\d+) kalem$/, 'Sales · SAMPLE hospital · $1 items'],
    [/^Talep no (\S+) · Satınalma$/, 'Request no. $1 · Purchasing'], [/^İletişim · ÖRNEK alıcı · taslak metin$/, 'Communication · SAMPLE recipient · draft text']
  ]);
  REGEX.splice.apply(REGEX, [0, 0].concat(REGEX_D4));
  [['adım', 'step', 'steps'], ['tedarikçi', 'supplier', 'suppliers']].forEach(function (a) { say(a[0], a[1], a[2]); });
  [['Çarşamba', 'Wednesday'], ['Perşembe', 'Thursday'], ['Pazartesi', 'Monday'], ['Cumartesi', 'Saturday'], ['Gecikmiş kapanış adımı', 'Late close step'], ['Önemli sapma', 'Significant deviation'], ['ay/ay', 'MoM'], ['yıl/yıl', 'YoY'],
   ['Yatırım (yaklaşık)', 'Investing (approx.)'], ['Finansman (yaklaşık)', 'Financing (approx.)'], ['Net satış:', 'Net sales:'], ['Faaliyet:', 'Operating:'], ['FAVÖK:', 'EBITDA:'], ['FAVÖK marjı:', 'EBITDA margin:'],
   ['Geçici ay (maliyet dağıtımı eksik)', 'Provisional month (cost allocation incomplete)'], ['Maliyeti tamamlanmadı', 'Cost not completed'],
   ['Rakamlar güncel olmayabilir.', 'Figures may be out of date.'], ['Miktarlar güncel olmayabilir.', 'Quantities may be out of date.'], ['— son güncelleme ', '— last updated '],
   ['Kime: Satış Müdürü', 'To: Sales Manager'], [' · CC: GMY (üretim ve satış)', ' · CC: Deputy GM (production and sales)']].forEach(function (p) { PARCA.push(p); });
  [['Sevke başlanmadı', 'Not yet dispatched'], ['sevke başlanmadı', 'not yet dispatched'], [' kısmi ', ' partial '], ['hospital kabulü', 'hospital acceptance'], ['bu seçimde yok', 'none in this selection'], ['Tamamlanmadı', 'Incomplete'],
   ['DMO onayladı', 'DMO approved'], ['DMO onayı', 'DMO approval'], ['Çıkan:', 'Dispatched:'], ['Teslim:', 'Delivered:'], ['Onay:', 'Approved:'], ['İl haritası', 'Province map'], ['sevk durumu', 'shipment status'], ['listeler o ile süzülsün', 'lists filter to that province'], ['ile dokunun', 'tap a province'],
   ['günlük units', 'daily units'], ['İl bazında teslim süresi', 'Delivery time by province'], ['çıkıştan teslime ortalama', 'average dispatch-to-delivery'], ['en slow üstte', 'slowest first'], ['Nakliyeci bazında gecikme', 'Delay by carrier'], ['Uyuşmazlıklar', 'Discrepancies'], ['Teslim belgesi eksiği', 'Missing delivery documents'],
   ['İhale bazında', 'By tender'], ['Order akışı', 'Order flow'], ['tıklayınca ilgili liste açılır', 'click to open the related list'], ['cezalı süre ya da teslim işlemi bekliyor', 'penalty period or delivery pending'], ['İtiraz edilebilir', 'Objectionable'], ['teslim var', 'delivered'],
   ['Sample veri', 'Sample data'], ['numaraları ve tutarlar', 'numbers and amounts'], ['itibarıyla', 'as of'], ['Güncelleme:', 'Updated:'], ['gönderilecek', 'to be shipped'], ['adedi son teslimi geçmiş', 'units past last delivery date'],
   ['Gönderilecek miktarın late oranı', 'Late rate of the quantity to ship'], ['Eldiven payı', 'Glove share'], ['Gauze swab payı', 'Gauze swab share'], ['Abdominal pad payı', 'Abdominal pad share'], ['(en çok', '(at most'], ['GİB block', 'GIB-blocked'], ['bu hafta varış', 'arriving this week'],
   ['customer faturasına göre', 'by customer invoice'], ['bir müşteriye dokununca siparişleri açılır', 'tap a customer to open their orders'], ['geçen yılın aynı dönemine göre', 'vs. same period last year'], ['Customer görünümü', 'Customer view'], ['customer faturası büyükten küçüğe', 'customer invoice, largest first'],
   ['estimate içeren', 'including estimates'], ['(ölçüm değil)', '(not measured)'], ['gecikmiş', 'overdue'], ['En eski:', 'Oldest:'], ['Factory verisi eski', 'Factory data is stale'], ['Son güncelleme', 'Last update'], ['önümüzdeki within', 'within the next'], ['days varış', 'days'],
   ['Ay sonu kapanış', 'Month-end close'], ['SAMPLE dönem', 'SAMPLE period'], ['Sürüyor', 'In progress'], ['Yaşa göre', 'By age'], ['en eski üstte', 'oldest first'], ['kişi adı yerine rol', 'role instead of person name'], ['SAMPLE düzeltme konusu', 'SAMPLE correction topic'], ['Muhasebe Müdürü', 'Accounting Manager'],
   ['kapanış adımı', 'close step'], ['önceki döneme göre', 'vs. previous period'], ['GL net satış', 'GL net sales'], ['FX cinsi faturalar', 'FX-denominated invoices'], ['çevrilmedi', 'not converted'], ['Yatırım (approximate)', 'Investing (approx.)'], ['Finansman (approximate)', 'Financing (approx.)'],
   ['Yatırım ve finansman rakamları hesap grubu değişiminden türetildiği için yaklaşıktır', 'Investing and financing figures are derived from account-group changes, so they are approximate'], ['sonu itibarıyla', 'as of period end'], ['Borç / özkaynak', 'Debt / equity'],
   ['veri gecikmeli', 'data delayed'], ['artmıyor', 'not increasing'], ['Canlı fabrika panosu', 'Live factory dashboard'], ['Product eşleme', 'Product mapping'], ['eşlendi', 'mapped'], ['Diğer hatlarda', 'On other lines'],
   ['koli/gün', 'boxes/day'], ['koli/döngü', 'boxes/cycle'], ['döngü/gün', 'cycles/day'], ['Sevke hazır', 'Ready to ship'], ['Cihaz kapasitesi', 'Device capacity'], ['öncelikli', 'priority'], ['Tam paletli döngü', 'Full-pallet cycle'], ['koli/palet', 'boxes/pallet'], ['koliyi aşmaz', 'boxes at most'],
   ['Pazar günü döngü yok', 'No cycle on Sunday'], ['stok kırılımına dayanır', 'rely on the stock breakdown'], ['kesin olmayabilir', 'may not be exact'], ['kuyruk ve öneriler', 'queue and recommendations'], ['stok kırılımı', 'stock breakdown'],
   ['Genel görünüm', 'Overview'], ['Hedefi aşan', 'Over target'], ['olay için üst bildirim', 'incident(s) for escalation'], ['Bilgi notu önerileri', 'Info note suggestions'], ['ayda tekrarlayan türler', 'months: recurring types'], ['koli sayımı', 'box count'], ['tutanak ve tamamlama süreci', 'report and completion process'],
   ['Puan nasıl hesaplanır', 'How the score is calculated'], ['Kime: Kalite', 'To: Quality'], ['İlgili birim', 'Related unit'], ['records önceliği', 'record priority'],
   ['Tedarikçiler', 'Suppliers'], ['Yüksek risk', 'High risk'], ['Düşük risk', 'Low risk'], ['Orta risk', 'Medium risk'], ['Az veri', 'Little data'], ['zamanında teslim', 'on-time delivery'], ['zamanında', 'on time'], ['vadesi geçmiş', 'overdue'], ['mal girişi', 'goods receipt'], ['planlı tarih', 'planned date'], ['bilgisi içermez', 'contains no information'],
   ['Tüm bantlar', 'All bands'], ['poliçe yenileme', 'policy renewal'], ['eğitim yenileme', 'training renewal'], ['modül sertifikası', 'module certificate'], ['ÜTS başvurusu', 'ÜTS application'], ['tarihsiz', 'undated'], ['yerli malı belgesi', 'domestic goods certificate'],
   ['takvimlerinin', 'calendars'], ['birleşimidir', 'combination'], ['renkler bugünden hesaplanır', 'colors are calculated from today'], ['Diğer · MY', 'Other · MY'], ['Sample Tedarikçi', 'Sample Supplier'], ['Sample ürün', 'Sample product'], ['Sample İSG kaydı', 'Sample OHS record'], ['ayında son tarihler', 'deadlines'],
   ['Sevk geçiş deposunda', 'In shipping transit warehouse'], ['Kalite kararı bekleyen', 'Awaiting quality decision'],
   ['İzin bakiyem', 'My leave balance'], ['Yıllık izin', 'Annual leave'], ['gün kaldı', 'days left'], ['Kullanılan', 'Used'], ['Waiting talep', 'Pending request'], ['İzin talebi', 'Leave request'], ['Yöneticiye gider', 'Goes to manager'], ['İzin türü', 'Leave type'], ['Talep gönder', 'Submit request'],
   ['Bordro pusulası', 'Payslip'], ['pusulası', 'payslip'], ['Yalnız kişinin kendisi görür', 'Visible only to the person'], ['hafta önce', 'weeks ago'], ['duyuru:', 'announcement:'], ['yıllık izin planı', 'annual leave plan'], ['İSG eğitimi takvimi', 'OHS training calendar'],
   ['ÖNİZLEME', 'PREVIEW'], ['bu ekran taslaktır', 'this screen is a draft'], ['rakamlar sahte', 'figures are fake'], ['hiçbir düğme records yapmaz', 'no button records anything'], ['Sample izin bakiyesi', 'Sample leave balance'], ['kullanıldı', 'used'], ['Sample açıklama', 'Sample note'],
   ['Onay kutusu', 'Approval inbox'], ['tek dokunuşla', 'with one tap'], ['Satınalma siparişi onayı', 'Purchase order approval'], ['Satınalma', 'Purchasing'], ['SAMPLE tedarikçi', 'SAMPLE supplier'], ['SAMPLE tutar', 'SAMPLE amount'], ['satış siparişi', 'sales order'], ['dışı bilgilendirme maili', 'external notification email']].forEach(function (p) { PARCA.push(p); });
  Object.keys({ 'adım': 'step', 'Çar': 'Wed', 'Aç': 'Open', 'az veri': 'little data' }).forEach(function (k) { var v = { 'adım': 'step', 'Çar': 'Wed', 'Aç': 'Open', 'az veri': 'little data' }[k]; if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = v; });
  


  if (!Object.prototype.hasOwnProperty.call(TAM, 'Satınalma talebi verisi yok')) TAM['Satınalma talebi verisi yok'] = 'No requisition data';
  PARCA.push.apply(PARCA, [
    ['bağlantı gelince gönderilecek', 'it will be sent when you are online'], ['Belge kaydedildi,', 'Document saved,'], ['Satınalma talebi', 'Purchase requisition'],
    ['gecikmişEn eski:', 'late. Oldest:'], ["Genel Müdür'e bildir", 'Notify the General Manager'], ['GMY üretim ve satış', 'Deputy GM, production and sales'],
    [' ayında önceki aya ya da geçen yıla göre eşiği aşan kalem (ayrıntı aşağıdaki "Önemli sapmalar" kartında).', ' items above the threshold vs. the previous month or last year (details in the "Key variances" card below).'],
    ['ayları maliyeti kapanmadığı için (geçici) sapma hesabına katılmadı; son maliyeti kapanmış ay esas alındı.', 'were not included in the variance calculation because their costs are not closed (provisional); the last cost-closed month was used.'],
    ['ayı maliyeti kapanmadığı için (geçici) sapma hesabına katılmadı; son maliyeti kapanmış ay esas alındı.', 'was not included in the variance calculation because its costs are not closed (provisional); the last cost-closed month was used.'],
    ['Döviz cinsi faturalar (çevrilmedi, TL karşılığı faturalandırma dışı / GL farkı içinde kalır): ', 'FX-denominated invoices (not converted; the TL equivalent stays outside invoicing / within the GL difference): '],
    ['Yatırım ve finansman rakamları hesap grubu değişiminden türetildiği için yaklaşıktır (alım/satış, kredi/vergi ayrılamaz).', 'Investing and financing figures are derived from account-group changes, so they are approximate (purchases/sales, loans/tax cannot be separated).'],
    ['Soluk çubuk ve tablo, maliyet dağıtımı tamamlanmamış geçici aylar içerir: ', 'The faded bar and table include provisional months with incomplete cost allocation: '],
    ['MY · TRY · DAY ayrı ve isteğe bağlı; bu bölümde yalnız MY vardır, toplanmaz.', 'MY · TRY · DAY is separate and optional; this section shows MY only and is not summed.']
  ]);
  REGEX.push([/ · FAVÖK marjı/g, ' · EBITDA margin'], [/gönderi (%[\d.,]+)/g, 'shipments $1'], [/(%[\d.,]+) teslim(?![A-Za-zÇĞİÖŞÜçğıöşü])/g, '$1 delivered'], [/^Teslim oldu (%[\d.,]+)$/, 'Delivered $1'],
    [/^En az (\d+) hastaneye sevk zorunlu$/, 'Dispatch to at least $1 hospitals is required']);
  REGEX.push([/(^Gross margin: .*? · )(\d+) ay(?= · EBITDA margin)/, function (m, a, n) { return a + n + (n === '1' ? ' month' : ' months'); }]);
   
  var TAM_A4 = {
    'Değişim ve mal fazlası': 'Exchanges and surplus goods', 'Son 365 gün': 'Last 365 days', 'Mal fazlası': 'Surplus goods', 'Kayıt bulunamadı': 'No records found', 'Kalem kaydı yok': 'No item records',
    'Hastane, belge no, malzeme ara…': 'Search hospital, document no. or material…', 'Hastane, belge no, malzeme ara': 'Search hospital, document no. or material',
    'e-fatura gönderildi': 'e-invoice sent', 'e-fatura gönderilmedi': 'e-invoice not sent', 'Filtreleri değiştirin ya da aramayı temizleyin.': 'Change the filters or clear the search.',
    'veri saati': 'data time', 'Dokuma m²': 'Weaving m²', 'Tezgah bazında': 'By loom', 'Salon süzgeci': 'Hall filter', 'tanımsız': 'not defined',
    'Çalışan hatlar': 'Running lines', 'Hat bazında tahmin': 'Forecast by line',
    '{n} tezgahta m² bilgisi tanımsız (toplama katılmadı)': 'm² is not defined for {n} loom(s) (not included in the total)',
    'Hak edilen': 'Entitled', 'Mazeret izni': 'Excuse leave', 'Ücretsiz izin': 'Unpaid leave', 'Duyurular': 'Announcements', 'PDF · örnek dosya': 'PDF · sample file',
    'Önizleme: talep gönderilmedi. Gerçek sürümde yöneticiye iletilir.': 'Preview: the request was not sent. In the real version it goes to the manager.',
    'Önizleme: gerçek pusula yok. Gerçek sürümde yalnız oturum açan kişinin kayıtları açılır.': 'Preview: there is no real payslip. In the real version only the signed-in person\'s records open.',
    'Satış yetkilisi onayı gerekir': 'Sales authority approval required', 'Gönderimden önce yetkili içeriği görür': 'An authorised person sees the content before sending', 'Yetkili onayı verildi': 'Authorised approval given',
    'Fiyat revizyonu girişi': 'Price revision entry', 'Karar sahibi onaylamadı': 'Decision owner did not approve', 'İletişim': 'Communication', 'İhale': 'Tender',
    'Onaylanan': 'Approved', 'Reddedilen': 'Rejected', 'Konu': 'Subject', 'Karar bekliyor': 'Awaiting decision', 'Onaylandı': 'Approved', 'Reddedildi': 'Rejected', 'ONAY': 'Approve', 'RED': 'Reject',
    'Önizleme: ONAY iletilmedi. Gerçek sürüm kodu mevcut onay akışına iletir.': 'Preview: the approval was not forwarded. The real version forwards the code to the current approval flow.', 'Önizleme: RED iletilmedi.': 'Preview: the rejection was not forwarded.',
    'ÖRNEK alıcı · taslak metin': 'SAMPLE recipient · draft text', 'Bu durumda örnek kayıt yok.': 'No sample record in this status.', 'e-fatura gönderimi': 'e-invoice dispatch', 'ÖRNEK ihale': 'SAMPLE tender'
  };
  Object.keys(TAM_A4).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_A4[k]; });
  PARCA.push.apply(PARCA, [['Talep no ÖRNEK', 'Request no. SAMPLE'], ['invoices kaydı', 'invoice records'], ['invoice kaydı', 'invoice record'], [' · Satış', ' · Sales'], [' · İletişim', ' · Communication'], [' · İhale', ' · Tender'], [' · Fatura', ' · Invoice']]);
   
  var TAM_8028 = {
    'Alım türü': 'Procurement type', 'Açık ihaleden': 'From open tender', 'Pazarlık usulü': 'Negotiated', 'Doğrudan temin': 'Direct procurement', 'Özel müşteri': 'Private customer', 'DMO (tür bilinmiyor)': 'DMO (type unknown)',
    'aynı hastanede doğrudan temin siparişi: açık': 'direct procurement order at the same hospital: open',
    'Süren': 'In progress', 'Tamamlanan': 'Completed', 'Henüz değil': 'Not yet', 'Bilinmiyor': 'Unknown', 'Başlatıldı': 'Started', 'Teslim alındı': 'Received', 'Kalite kontrol': 'Quality check', 'Satışa hazır': 'Ready for sale',
    'İade durumu': 'Return status', 'İade adımları': 'Return steps', 'Aramaya uyan iade yok': 'No return matches the search', 'süren iade': 'returns in progress', 'iade': 'returns',
    'Hastane, belge no ara…': 'Search hospital or document no.…', 'Hastane, belge no ara': 'Search hospital or document no.'
  };
  Object.keys(TAM_8028).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_8028[k]; });
  REGEX.unshift([/^aynı hastanede doğrudan temin siparişi: teslim edildi · bugün$/, 'direct procurement order at the same hospital: delivered · today'],
    [/^aynı hastanede doğrudan temin siparişi: teslim edildi · (\d+) gün önce$/, function (m, n) { return 'direct procurement order at the same hospital: delivered · ' + n + (n === '1' ? ' day ago' : ' days ago'); }],
    [/^aynı hastanede doğrudan temin siparişi: teslim edildi$/, 'direct procurement order at the same hospital: delivered'],
    [/^(\d+) gündür bu adımda$/, function (m, n) { return n + (n === '1' ? ' day' : ' days') + ' at this step'; }],
    [/^Alım türü · (\d+) belgede bilinmiyor$/, function (m, n) { return 'Procurement type · unknown for ' + n + (n === '1' ? ' order' : ' orders'); }]);
   
  var TAM_8029 = {
    'Bir bölüm verisi alınamadı': 'A section’s data could not be loaded', 'Bir bölümün verisi alınamadı': 'A section’s data could not be loaded',
    'Bugün ne değişti': 'What changed today',
    'Hastane / müşteri': 'Hospital / customer', 'Teslimat / irsaliye': 'Delivery / waybill', 'Tedarikçi': 'Supplier', 'Konteyner': 'Container', 'Makine': 'Machine'
  };
  Object.keys(TAM_8029).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_8029[k]; });
  REGEX.unshift([/^— (.+)$/, function (m, r) { return '— ' + cevir(r); }],
    [/^(Hastane \/ müşteri|Sipariş|Teslimat \/ irsaliye|Konteyner|Ürün|Tedarikçi|Belge|İhale|Makine) \((\d+)\)$/, function (m, a, n) { return cevir(a) + ' (' + n + ')'; }]);
   
  var TAM_8032 = {
    'Kalemler / risk': 'Items / risk', 'Siparişler': 'Orders', '← Siparişler': '← Orders', 'Sipariş bulunamadı': 'Order not found', 'Bu görünümde sipariş yok': 'No orders in this view',
    'Uyarı': 'Warning', 'Normal': 'Normal', 'Hastane': 'Hospital', 'İptal hakkı: veri yok': 'Cancellation allowance: no data', 'İptal hakkı': 'Cancellation allowance', 'Oranlar (TL)': 'Rates (TL)',
    'İrsaliye / kargo teslim / muayene kabul oranları: veri bekleniyor': 'Delivery note / cargo delivered / inspection acceptance rates: awaiting data',
    'Yüzdeler IKN toplamıdır, bu siparişe özel değildir.': 'Percentages are IKN totals, not specific to this order.', 'IKN listesi yükleniyor': 'IKN list is loading', 'IKN yok': 'No IKN',
    'Siparişler (sipariş bazlı görünüm)': 'Orders (order-based view)', 'Hastane listesi yükleniyor': 'Hospital list is loading', 'Sipariş verisi şu an yok': 'Order data is not available right now',
    'Bu siparişte hastane yok': 'No hospitals in this order',
    'Geçmiş teslimata göre riskli hastane: veri bekleniyor': 'Hospitals at risk by past deliveries: awaiting data',
    'Panoyu büyüt': 'Enlarge board', 'Panoyu küçült': 'Shrink board', 'Büyüt': 'Enlarge',
    'Cezalı süre sonu (en yakın)': 'Penalty period end (nearest)', 'Ek süre': 'Extension', 'Temlik eşiği aşıldı': 'Assignment threshold exceeded'
  };
  Object.keys(TAM_8032).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_8032[k]; });
  REGEX.unshift([/^(\d+) sipariş$/, '$1 orders'],
    [/^(\d+) sipariş · (\d+) uyarılı$/, '$1 orders · $2 flagged'],
    [/İptal olan hastane (\d+) \(son 90 gün\)/g, 'Hospitals cancelled $1 (last 90 days)'],
    [/Hastane (\d+) \(son 90 gün\)/g, 'Hospitals $1 (last 90 days)'],
    [/^(.+): kullanılan (veri yok|\S+) \/ hak (veri yok|\S+) · kalan (veri yok|\S+)( · kota aşıldı)?$/, function (m, ad, k, hk, kl, t) { return cevir(ad) + ': used ' + k + ' / allowance ' + hk + ' · remaining ' + kl + (t ? ' · quota exceeded' : ''); }],
    [/^Hastane (\d+|veri yok) \((.+)\)$/, function (m, n, k) { return 'Hospitals ' + n + ' (' + (k === 'siparişin tamamı' ? 'whole order' : k === '90 gün' ? '90 days' : k) + ')'; }],
    [/^İptal hakkı: sipariş ve ürün kodunda hastane sayısının %10'u, en az 3\.$/, 'Cancellation allowance: 10% of the hospitals per order and product code, minimum 3.'],
    [/^IKN'ler \((\d+)\)$/, 'IKNs ($1)'],
    [/^bu IKN (\d+) siparişte geçiyor$/, 'this IKN appears in $1 orders'],
    [/^IKN (.+): ihale satırı yok$/, 'IKN $1: no tender row'],
    [/^Hastaneler \((\d+)\)$/, 'Hospitals ($1)'],
    [/^Açık kaleminde risk etiketi olan hastane: (\d+) \(bugünkü durum; geçmiş teslimat puanı değil\)$/, 'Hospitals with a risk label on an open item: $1 (current status; not a past delivery score)'],
    [/^Ek süre başvurusu gereken hastane \(başvuru süresi içinde\): (\d+)$/, 'Hospitals needing an extension request (within the application period): $1']);
   
  var TAM_8033 = {
    'İrsaliye / kargo teslim / muayene kabul oranları: veri yok': 'Delivery note / cargo delivered / inspection acceptance rates: no data',
    'Geçmiş teslimata göre riskli hastane: veri yok': 'Hospitals at risk by past deliveries: no data',
    'Sayılar IKN toplamıdır, bu siparişe özel değildir.': 'Counts are IKN totals, not specific to this order.',
    'Ek süre başvurusu': 'Extension request'
  };
  Object.keys(TAM_8033).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_8033[k]; });
  REGEX.unshift([/^Dikkat gereken IKN: (\d+)$/, 'IKNs needing attention: $1']);
  PARCA.sort(function (a, b) { return b[0].length - a[0].length; });
  var onbellek = {};
  function cevir(m) {
    if (!EN || m == null) return m;
    var anahtar = String(m);
    if (Object.prototype.hasOwnProperty.call(TAM, anahtar)) return TAM[anahtar];
    var tr = anahtar.trim();
    if (tr && Object.prototype.hasOwnProperty.call(TAM, tr)) return anahtar.replace(tr, TAM[tr]);
    if (!/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(anahtar)) return anahtar;
    if (Object.prototype.hasOwnProperty.call(onbellek, anahtar)) return onbellek[anahtar];
    var s = anahtar;
    REGEX.forEach(function (r) { s = s.replace(r[0], r[1]); });
    PARCA.forEach(function (p) { if (s.indexOf(p[0]) >= 0) s = degis(s, p[0], p[1]); });
    s = s.replace(/(^|\D)1 days (ago|left|late|overdue)/g, '$11 day $2').replace(/(^|\D)1 days\b/g, '$11 day');
    onbellek[anahtar] = s; return s;
  }
  function t(k, yedekTR) { if (!EN) return yedekTR == null ? k : yedekTR; var c = cevir(k); return c === k && yedekTR != null && TAM[k] === undefined ? yedekTR : c; }

  window.MM_DIL = { tr: {}, en: TAM, enParca: PARCA_L };
  window.MM = window.MM || {};
  window.MM.t = t;
  window.MM.dil = function () { return dil; };
  window.MM.dilSec = function (d) { if (d !== 'tr' && d !== 'en' || d === dil) return; try { localStorage.setItem('mm_dil', d); } catch (e) { } location.reload(); };
  window.MM.veriMetin = function (o, alan, hamAlan) { return EN && o && o[hamAlan || '_ham'] ? o[hamAlan || '_ham'] : (o && o[alan]); };   
  if (!EN) return;

   
  var ATTR = ['aria-label', 'title', 'placeholder', 'alt', 'data-et'];
  function duzDugum(n) {
    if (n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.tagName)) return;   
    var v = n.nodeValue, c = cevir(v); if (c !== v) n.nodeValue = c;
  }
  function tara(kok) {
    if (!kok) return;
    if (kok.nodeType === 3) { duzDugum(kok); return; }
    if (kok.nodeType !== 1) return;
    if (/^(SCRIPT|STYLE)$/.test(kok.tagName)) return;
    ATTR.forEach(function (a) { if (kok.hasAttribute && kok.hasAttribute(a)) { var v = kok.getAttribute(a), c = cevir(v); if (c !== v) kok.setAttribute(a, c); } });
    var yurur = document.createTreeWalker(kok, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
    while ((n = yurur.nextNode())) {
      if (n.nodeType === 3) { if (!(n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.tagName))) duzDugum(n); }
      else ATTR.forEach(function (a) { if (n.hasAttribute(a)) { var v = n.getAttribute(a), c = cevir(v); if (c !== v) n.setAttribute(a, c); } });
    }
  }
  function basla() {
    document.title = cevir(document.title);
    var bt = document.querySelector('title');
    if (bt) new MutationObserver(function () { var v = document.title, c = cevir(v); if (c !== v) document.title = c; }).observe(bt, { childList: true, characterData: true, subtree: true });
    tara(document.body);
    new MutationObserver(function (liste) {
      liste.forEach(function (m) {
        if (m.type === 'childList') m.addedNodes.forEach(tara);
        else if (m.type === 'characterData') duzDugum(m.target);
        else if (m.type === 'attributes') { var v = m.target.getAttribute(m.attributeName), c = cevir(v); if (c !== v) m.target.setAttribute(m.attributeName, c); }
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  }
  if (document.body) basla(); else document.addEventListener('DOMContentLoaded', basla);
})();
