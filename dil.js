



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
    'Soruyu mail ile ilet': 'Send the question by email', 'İş olarak ilet': 'Send as a request', 'Sorunuzu yazın…': 'Type your question…', 'Sorular ve cevaplar denetim için kayda alınır, 90 gün saklanır.': 'Questions and answers are recorded for audit and kept for 90 days.', 'Cevap hazır olunca bu ekranda görünür.': 'The answer will appear on this screen when ready.', 'Asistan yazma özelliği kurulunca bu ekrandan soru sorabileceksiniz. Şimdilik sorunuzu mail ile iletin; cevap kendi yetkinize göre verilir.': 'Once the assistant writing feature is set up you can ask questions here. For now, send your question by email; the answer follows your own access rights.',
    'Fiyat önerisi': 'Price suggestion', 'Mail at': 'Send mail', 'Asistan önerili tabloyu kontrol edip size mail eder': 'The assistant will check the suggested table and email it to you',
    'geçmiş fiyat bulunamadı': 'no past price found', 'maliyet modeli yok': 'no cost model', 'Bant maliyetin altında': 'Range is below cost', 'En düşük': 'Lowest', 'Son': 'Latest', 'En yüksek': 'Highest',
    'öneri; karar: yönetim': 'suggestion; decision: management', 'öneri; karar: satış': 'suggestion; decision: sales', 'Kalem seçilmedi.': 'No item selected.', 'Kalem bilgisi yok.': 'No item information.',
    'Bizimle ilgili kalem yok.': 'No relevant items.', 'İhale yok': 'No tenders', 'Bu filtreyle eşleşen ihale yok.': 'No tender matches this filter.', 'Şu an açık ihale görünmüyor.': 'No open tenders right now.',
    'İhaleler alınamadı': 'Tenders could not be loaded', 'Bu bölüm sizin için kapalı': 'This section is not open to you', 'Erişim için yöneticinize başvurun.': 'Contact your administrator for access.',
    'Maliyet tabanı: ': 'Cost floor: ', ' geçmiş fiyat': ' past price(s)', ' gün kaldı': ' day(s) left', ' · süresi geçti': ' · expired', ' · bugün': ' · today', ' ilgili kalem': ' relevant item(s)',
    'DMO: robot ': 'DMO: robot ', 'DMO dışı: günlük defter': 'Non-DMO: daily log', ' · eski': ' · stale', ' kalem seç': ' select',
     
    'Sterilizasyon': 'Sterilization', 'Sterilizasyon deposu ve lotlar': 'Sterilization store and lots', 'Kalite bildir': 'Report quality issue', 'Bugün': 'Today', 'Lotlar': 'Lots',
    'Sterilizasyon deposunda': 'In sterilization store', 'Karantinada': 'In quarantine', 'Kalite kararı bekleyen': 'Awaiting quality decision', 'son 30 günde açılan': 'opened in the last 30 days',
    'Giren adet': 'Units in', 'Çıkan adet': 'Units out', 'son 7 gün': 'last 7 days', 'Günlük giren adet': 'Daily units in', 'Günlük çıkan adet': 'Daily units out',
    'Hareket bilgisi şu an alınamıyor.': 'Movement data is not available right now.', 'Son 7 günde sterilizasyon deposunda hareket olmadı.': 'No movement in the sterilization store in the last 7 days.',
    'Lot kaydı yok': 'No lot records', 'Sterilizasyon deposunda lot bulunamadı.': 'No lots found in the sterilization store.', 'Ürün veya lot ara': 'Search product or lot', 'Eşleşen lot yok.': 'No matching lots.',
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
    'Bu sayfada ara…': 'Search this page…', 'Bu sayfada ara': 'Search this page', 'Aramayı temizle': 'Clear search', 'Temizle': 'Clear', 'Tüm uygulamada ara (Ctrl/⌘ K)': 'Search the whole app (Ctrl/⌘ K)', 'Tümünde ara': 'Search everything',
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
    'Hafta': 'Week', 'Ay': 'Month', 'Hesap': 'Account', 'Dil / Language': 'Dil / Language'
  };
   
  var TAM41 = {
    'Mali tablolar': 'Financial statements', 'Gelir tablosu': 'Income statement', 'Net satış': 'Net sales', 'Brüt satış': 'Gross sales', 'İade ve indirimler': 'Returns and discounts',
    'Satılan malın maliyeti': 'Cost of goods sold', 'Brüt kâr': 'Gross profit', 'Brüt marj': 'Gross margin', 'Faaliyet giderleri': 'Operating expenses', 'Pazarlama': 'Marketing', 'Genel yönetim': 'General administration',
    'Esas faaliyet kârı': 'Operating profit', 'Diğer gelirler': 'Other income', 'Diğer giderler': 'Other expenses', 'Finansman giderleri': 'Financing expenses', 'Olağan dışı gelir': 'Extraordinary income', 'Olağan dışı gider': 'Extraordinary expense',
    'Dönem kârı (vergi öncesi)': 'Profit for the period (before tax)', 'FAVÖK': 'EBITDA', 'FAVÖK marjı': 'EBITDA margin', 'Amortisman öncesi faaliyet kârı': 'Operating profit before depreciation',
    'Bu dönem': 'This period', 'Önceki dönem': 'Previous period', 'Değişim': 'Change', 'Toplam': 'Total', 'Dönem': 'Period', 'Seçili dönem': 'Selected period',
    'Son 3 ay': 'Last 3 months', 'Son 6 ay': 'Last 6 months', 'Son 9 ay': 'Last 9 months', 'Son 12 ay': 'Last 12 months',
    'Aylık net satış': 'Monthly net sales', 'Aylık FAVÖK': 'Monthly EBITDA', 'Marj eğilimi': 'Margin trend', 'Brüt marj ve FAVÖK marjı, % olarak': 'Gross margin and EBITDA margin, in %',
    'Bilanço özeti': 'Balance sheet summary', 'Varlıklar': 'Assets', 'Kaynaklar': 'Liabilities and equity', 'Nakit ve benzeri': 'Cash and equivalents', 'Ticari alacaklar': 'Trade receivables', 'Stoklar': 'Inventories',
    'Diğer dönen varlıklar': 'Other current assets', 'Duran varlıklar': 'Non-current assets', 'Kısa vadeli borçlar': 'Short-term liabilities', 'Uzun vadeli borçlar': 'Long-term liabilities', 'Özkaynak': 'Equity',
    'Finansal oranlar': 'Financial ratios', 'Cari oran': 'Current ratio', 'Likidite oranı': 'Liquidity ratio', 'Nakit oranı': 'Cash ratio', 'Alacak tahsil süresi': 'Receivables collection period',
    'Stokta kalma süresi': 'Inventory holding period', 'Borç ödeme süresi': 'Payables payment period', 'Nakit döngüsü': 'Cash cycle',
    'Maliyeti kapanmış ay': 'Month with closed costing', 'Maliyeti tamamlanmadı': 'Costing not completed', 'Maliyeti tamamlanmamış ay': 'Month with incomplete costing',
    'Mali tablo verisi yok': 'No financial statement data', 'Mali tablolar alınamadı': 'Financial statements could not be loaded',
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
    ['Kaynak: ', 'Source: '], ['Kaynak', 'Source'], ['kaynak', 'source'], ['Şirket', 'Company'], ['şirket içi', 'internal'], ['Şirket içi', 'Internal'], ['Tüm şirketler', 'All companies'], ['Tüm türler', 'All types'], ['Geciken', 'Late'], ['geciken', 'late'], ['gecikmiş', 'late'], ['Gecikmiş', 'Late'],
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
    ['Teslim durumu filtresi', 'Delivery status filter'], ['Tüm teslim durumları', 'All delivery statuses'], ['Yolda / bekliyor', 'In transit / waiting'], ['Kanıt yok', 'No evidence'], ['Ekran bölümü', 'Screen section'], ['Sevkiyat', 'Shipments'], ['Kargo teslim', 'Cargo delivery'],
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
     
    ['Hazine görünümleri', 'Treasury views'], ['Ödeme takvimi', 'Payment schedule'], ['DMO alacakları', 'DMO receivables'], ['Krediler', 'Loans'], ['Çekler', 'Cheques'], ['Teminat listesi', 'Collateral list'], ['Teminat', 'Collateral'], ['Bankalar', 'Banks'], ['Döviz', 'FX'],
    ['Vadesi geçmiş ödeme var', 'Overdue payments'], ['Vadesi geçmiş açık kredi taksiti: ', 'Overdue open loan instalments: '], [' kredi', ' loans'], ['Vadesi geçen verilen çek: ', 'Overdue issued cheques: '],
    ['Bu ay ödenecek kredi', 'Loan payments due this month'], ['Toplam kredi borcu', 'Total loan debt'], ['kalan anapara', 'remaining principal'], ['kredi/leasing', 'loans/leases'], ['30 gün çek çıkışı / girişi', 'Cheques out / in, next 30 days'], ['çıkış', 'outflow'],
    ['Ödenen ', 'Paid '], [' · kalan ', ' · remaining '], [' taksit', ' instalments'], ['Giriş ', 'Inflow '], ['Nakit', 'Cash'], ['mevduat + bakiye', 'deposits + balance'], ['Mevduat ', 'Deposits '], ['banka bakiyesi', 'bank balance'],
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
    ['Günlük rapor', 'Daily report'], ['Lojistik', 'Logistics'], ['Sipariş no', 'Order no.'], ['İrsaliye no', 'Waybill no.'], ['İrsaliye', 'Waybill'], ['Teslim noktası', 'Delivery point'], ['Teslim noktası', 'Delivery point'], ['farklı kurum', 'distinct institutions'], ['farklı irsaliye', 'distinct waybills'], ['sevk satırı', 'shipment lines'], ['toplam miktar', 'total quantity'], ['toplam koli', 'total boxes'], ['koli bilgisi yok', 'no box information'], ['Lokasyon', 'Location'], ['Açıklama', 'Note'],
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
  REGEX.splice.apply(REGEX, [0, 0].concat([[/^(.+) hakkında ayrıntı$/, 'Details: $1'], [/(?:Eğilim|Trend):\s*son\s+(\d+)\s+günde açılan sipariş sayısı \(günlük\)/g, 'Trend: daily number of orders opened in the last $1 days'], [/(?:Eğilim|Trend):\s*son\s+(\d+)\s+gün(?![a-zçğıöşü])/gi, 'Trend: last $1 days'], [/kaynak dosya\s+(.+?)\s+tarihli/g, 'source file dated $1'], [/\(\+(\d+) alarm\w* daha\)/g, '(+$1 more alarms)'], [/(\d+) milyon adet yolda/g, '$1 million units in transit'], [/Etiket yok, [“"]sorun yok[”"] anlamına gelmez/g, 'A missing label does not mean “no problem”'], [/kaynak (\d+) günlük pencere[^\s.;,]*/g, 'source window of $1 days'],
   [/^son (\d+) gün/g, 'last $1 days'], [/(^|[^\d.,])1 (?:delivery|teslimat) müşteri\/hastane sevkiyatı sayılarına dahil değildir; /g, '$11 delivery is not included in customer/hospital shipment counts; '], [/(\d+) (?:delivery|deliveries|teslimat) müşteri\/hastane sevkiyatı sayılarına dahil değildir; /g, '$1 deliveries are not included in customer/hospital shipment counts; '], [/Önümüzdeki (\d+) günde günlük varış sayısı/g, 'Daily arrivals over the next $1 days'], [/Önümüzdeki (\d+) günde/g, 'In the next $1 days'], [/Önümüzdeki (\d+) gün(?![a-zçğıöşü])/g, 'Next $1 days'],
   [/(\d+) gün içinde/g, 'within $1 days'], [/Son (\d+) gün çıkan/g, 'Dispatched in the last $1 days'], [/son (\d+) gün penceresi/g, 'last $1-day window'], [/son (\d+) günde/g, 'in the last $1 days'], [/Trend: son (\d+) gün/g, 'Trend: last $1 days'],
   [/Trend: Son (\d+) tam gün/g, 'Trend: last $1 full days'], [/Analiz \(huni, gecikme, son (\d+) gün\)/g, 'Analysis (funnel, delay, last $1 days)'], [/(\S+) tarihinde açıldı/g, 'opened on $1'], [/kaynak dosya (\d+) gün önceki tarihli/g, 'source file dated $1 days earlier'],
   [/(\S+) itibarıyla, milyon/g, 'As of $1, million'], [/(\S+ – \S+) arasında oluşturulan belgeler; tutar yok/g, 'Documents created between $1; no amounts'], [/(\d\d:\d\d)’den bugün şimdiye/g, 'from $1 today until now'], [/Nakliye firması ve teslim kanıtı SAP.de tutulmuyor; /g, 'The carrier and proof of delivery are not kept in SAP; '],
   [/Şirket içi \(MY→DAY\)/g, 'Internal (MY→DAY)'], [/(\d+) kaynağın/g, '$1 sources’']]));
   
  var TAM_MESAJ = {
    'Asistan': 'Assistant', 'Yeni sohbet': 'New chat', 'Yenile': 'Refresh', 'Geri': 'Back', 'Başlat': 'Start', 'Anladım': 'Got it', 'Kişi ara': 'Search people', 'Grup adı': 'Group name',
    'Kişi seçin': 'Select people', 'Sohbet yok': 'No chats', 'Mesaj yok': 'No messages', 'Mesaj': 'Message', 'Gönder': 'Send', 'Kartı gönder': 'Send card', 'Siz': 'You', 'Okundu': 'Read',
    'Gönderildi': 'Sent', 'Biri': 'Someone', 'yazıyor…': 'is typing…', 'Sesli ara': 'Voice call', 'Görüntülü ara': 'Video call', 'Aranıyor': 'Calling', 'Arama sürüyor': 'Call in progress',
    'sizi arıyor': 'is calling you', 'görüntülü': 'video', 'Sesli mesaj': 'Voice message', 'Dosya': 'File', 'Paylaşılan kart': 'Shared card', 'Dosya / fotoğraf': 'File / photo', 'Katıl': 'Join',
    'Sohbet': 'Chat', 'Kişi bulunamadı': 'No people found', 'Yükleniyor': 'Loading', 'Mesaj kapalı': 'Messaging is off',
    'Mesaj girişi alınamadı': 'Could not sign in to messaging', 'Giriş geçersiz': 'Sign-in is not valid', 'Bu sohbete erişiminiz yok': 'You do not have access to this chat', 'Bulunamadı': 'Not found',
    'Geçersiz istek': 'Invalid request', 'Çok sık istek; biraz sonra deneyin': 'Too many requests; please try again shortly', 'Bağlantı yok': 'No connection', 'Sunucu hatası': 'Server error',
    'Mesaj boş': 'Message is empty', 'Mesaj çok uzun': 'Message is too long', 'Bu dosya türü gönderilemez': 'This file type cannot be sent', 'Dosya 25 MB\'tan büyük olamaz': 'File cannot be larger than 25 MB',
    'Fotoğraf işlenemedi': 'Photo could not be processed', 'Dosya yüklenemedi': 'File could not be uploaded', 'Grup adı yazın': 'Enter a group name', 'Arama bu cihazda yok': 'Calling is not available on this device',
    'Arama başlatılamadı': 'Could not start the call', 'Alınamadı': 'Could not be retrieved',
    'Bu sohbetler şirketin Microsoft bulut hesabında (Batı Avrupa) 12 ay saklanır. Uçtan uca şifreli değildir; şirket yönetimi gerektiğinde erişebilir. Aramalar kaydedilmez. Şifre, kimlik numarası, sağlık bilgisi yazmayınız. Buraya yazılan \'onay\' ya da \'gönder\' hiçbir işlemi başlatmaz.':
      'These chats are kept for 12 months in the company\'s Microsoft cloud account (West Europe). They are not end-to-end encrypted; company management can access them when required. Calls are not recorded. Do not write passwords, ID numbers or health information. Writing \'approve\' or \'send\' here does not start any action.'
  };
  Object.keys(TAM_MESAJ).forEach(function (k) { if (!Object.prototype.hasOwnProperty.call(TAM, k)) TAM[k] = TAM_MESAJ[k]; });
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
