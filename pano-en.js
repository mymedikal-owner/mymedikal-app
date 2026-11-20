



(function () {
  'use strict';
  var NIT = ['aria-label', 'title', 'data-ipucu', 'alt'];
  var son = new WeakMap();   

   
  var R = [
    [/^Kısmi: (\d+) hatta ölçüm yok$/, 'Partial: $1 line(s) with no measurement'],
    [/^Ayrıca tahmin: (.*?) · (.*?) \(sayaç şüpheli, toplama dahil değil\)$/, 'Also estimate: $1 · $2 (counter suspect, not included in total)'],
    [/bugünkü üretilen \+ bugünkü ortalama hız \((.+?) adet\/dk\) × kalan planlı süre \((.+?) dk\); gün (.+?), pazar planlı değil/, 'produced today + today’s average speed ($1 pcs/min) × remaining planned time ($2 min); day $3, Sunday not planned'],
    [/Arıza başına kayıp dk = kayıtlı arıza olaylarının toplam kaybı ÷ arıza sayısı \(MTTR yaklaşığı\)\.\s*Yalnız arıza sınıfı olaylar sayılır; mola\/değişim\/nedeni girilmemiş duruş dahil değil\./,
      'Lost minutes per breakdown = total loss of recorded breakdown events ÷ number of breakdowns (MTTR approximation). Only breakdown-class events are counted; breaks, changeovers and stoppages with no reason entered are not included.'],
    [/OEE = kullanılabilirlik \(K\) × performans \(P\) × kalite \(Q\)/, 'OEE = availability (A) × performance (P) × quality (Q)'],
    [/K: üretim süresi ÷ planlı süre/, 'A: run time ÷ planned time'],
    [/P: gerçek hız ÷ ideal hız \(en çok %(.+?)\)/, 'P: actual speed ÷ ideal speed (at most $1%)'],
    [/Q: (\S+) − makine fire % \(tartım değil\)/, 'Q: $1 − machine scrap % (not weighed)'],
    [/^K · kullanılabilirlik$/, 'A · availability'], [/^P · performans$/, 'P · performance'], [/^Q · kalite$/, 'Q · quality'],
    [/^(\d+) arıza$/, function (m, n) { return n + (n === '1' ? ' breakdown' : ' breakdowns'); }],
    [/arıza başına kayıp dk · (\d+) arıza · toplam (\S+) dk/, function (m, n, t) { return 'lost min per breakdown · ' + n + (n === '1' ? ' breakdown' : ' breakdowns') + ' · total ' + t + ' min'; }],
    [/arıza başına kayıp dk · arıza kaydı verisi yok/, 'lost min per breakdown · no breakdown record data'],
    [/P üst sınır %(\S+) \(ham %(\S+)\)/, 'P cap $1% (raw $2%)'],
    [/Q = (\S+) − makine fire \(gerçek kalite verisi değil\)/, 'Q = $1 − machine scrap (not real quality data)'],
    [/ideal hız: son (\d+) günden p(\d+)/, 'ideal speed: from last $1 days p$2'], [/az örnek/, 'few samples'],
    [/Hattın bilgisayarı açık ama PLC'yi okuyamıyor \(son başarılı okuma (\S+) dk önce\); makine tarafındaki ağ bağlantısı kopuk\./, 'The line’s computer is on but cannot read the PLC (last successful read $1 min ago); the network link on the machine side is down.'],
    [/sayaç ilerlemiyor \(durdu, boşta ya da vardiya arası\)/, 'counter not advancing (stopped, idle or between shifts)'],
    [/^Durdu — Örnek duruş$/, 'Stopped — Sample stoppage'],
    [/^\+(\d+) madde daha$/, '+$1 more items'], [/^\+(\d+) tezgâh daha — aşağıda plan$/, '+$1 more looms — plan below'],
    [/^(\d+) hat dikkat istiyor$/, '$1 lines need attention'],
    [/Tezgâh (\S+?), (Çalışıyor|Durdu|düşük verim|veri yok), verim yüzde (\S+)/, function (m, t, d, v) { return 'Loom ' + t + ', ' + ({ 'Çalışıyor': 'Running', 'Durdu': 'Stopped', 'düşük verim': 'low efficiency', 'veri yok': 'no data' })[d] + ', efficiency ' + v + ' percent'; }],
    [/^En düşük verimli (\d+) tezgâh/, 'Lowest-efficiency $1 looms'],
    [/^(\S+) haftası en çok:/, 'Week of $1, top:'], [/^(\S+) haftası/, 'Week of $1'],
    [/^(\S+) – tezgâh başına en çok (\d+) neden toplanır/, '$1 · at most $2 reasons are summed per loom'],
    [/tezgâh başına en çok (\d+) neden toplanır/, 'at most $1 reasons are summed per loom'],
    [/^Son (\d+) gün verim çizgisi$/, 'Last $1 days efficiency line'], [/^Son (\d+) gün verim$/, 'Last $1 days efficiency'],
    [/^(\d+) tezgâh · dokun: ayrıntı$/, '$1 looms · tap for details'],
    [/(\S+)'(?:den|dan) beri/, 'since $1'],
    [/Ürün bilgisi (\S+)'(?:dan|den) itibaren kayıtlı; önceki günlerde ürün yok, hafta\/ay toplamları yalnız ürünü bilinen günleri kapsar\./, 'Product information is recorded from $1; no product data for earlier days; week/month totals cover only days with a known product.'],
    [/Bugün vardiya verisi yok; yalnız şu an duran tezgâhlar gösteriliyor\./, 'No shift data for today; only looms stopped right now are shown.'],
    [/Bugünkü vardiya dökümü yok; yalnız şu an duran tezgâhlar gösteriliyor\./, 'No breakdown for today’s shift; only looms stopped right now are shown.'],
    [/(\d+)\+ dakikadır raporlamayan tezgâh 'bilinmiyor'dur, durmuş sayılmaz\./, 'A loom that has not reported for $1+ minutes is “unknown”, not counted as stopped.'],
    [/Nominal devir ayarlı hızdır, ölçüm değildir\./, 'Nominal speed is the set speed, not a measurement.'],
    [/^(\S+) bin$/, '$1k'], [/^(\S+) Mn$/, '$1M'],
    [/^(\d+) sn$/, '$1 s'], [/^(\d+) sa$/, '$1 h']
  ];

   
  var S = {
    'Bugün toplam kompres (ölçülen)': 'Total compress today (measured)', 'Genel durum': 'Overall status', 'çalışan hat': 'running lines', 'veri yok (durdu değil)': 'no data (not stopped)',
    'Veri yok': 'No data', 'Veri': 'Data', 'veri yok': 'no data', 'Durdu': 'Stopped', 'durdu': 'stopped', 'Çalışıyor': 'Running', 'çalışıyor': 'running', 'Canlı veri': 'Live data', 'Canlı': 'Live', 'canlı veri': 'live data', 'eski veri': 'stale data',
    'Sayaç şüpheli': 'Counter suspect', 'sayaç şüpheli': 'counter suspect', 'sayaç ölçümü yok': 'no counter measurement', 'Dikkat': 'Attention', 'dikkat': 'attention', 'Uyarı': 'Warning', 'Bilgi': 'Info',
    'Bu vardiya hedefe göre': 'This shift vs target', 'Bu vardiya · üretilen / hedef (şu ana kadar)': 'This shift · produced / target (so far)', 'Bu vardiya': 'This shift', 'bu vardiya': 'this shift',
    'bu vardiya, ürün başına metre ve tezgâhlar': 'this shift, metres per product and looms', 'blister var': 'with blister', 'blister yok': 'no blister',
    'tahmin · bugünkü hızla': 'estimate · at today’s speed', 'Gün sonu tahmini:': 'End-of-day estimate:', 'günlük hedef': 'daily target', 'Bugün:': 'Today:', 'hedefe göre': 'vs target', 'hedefe': 'vs target', 'tahmin': 'estimate',
    'çevrim/dk': 'cycles/min', 'kayıp bugün': 'loss today', 'Hız, son': 'Speed, last', 'Reçete:': 'Recipe:', 'kat': 'ply', 'Üretilen (bugün)': 'Produced (today)',
    'Ayrıntı': 'Details', 'ayrıntı': 'details', 'Hatlar': 'Lines', 'Hat': 'Line', 'Bölümler': 'Sections', 'Gün/Hafta/Ay': 'Day/Week/Month', 'Gün': 'Day', 'Hafta': 'Week', 'Ay': 'Month', 'Tümü': 'All',
    'Haftalık': 'Weekly', 'Aylık': 'Monthly', 'Bu hafta': 'This week', 'Bu ay': 'This month', 'bu hafta': 'this week', 'bu ay': 'this month', 'Vardiya': 'Shift', 'vardiya': 'shift',
    'Çalışan tezgâh': 'Running looms', 'düşük verim': 'low efficiency', 'Düşük verim': 'Low efficiency', 'Düşük': 'Low', 'ort. verim': 'avg. efficiency', 'verim (vardiya)': 'efficiency (shift)', 'verim': 'efficiency', 'Verim': 'Efficiency',
    'metre bugün': 'metres today', 'metre (vardiya)': 'metres (shift)', 'gecikmeli': 'delayed', 'Şimdi dikkat': 'Needs attention now', 'Salon özetleri': 'Hall summaries', 'Salon planı': 'Hall plan', 'Salon toplamı, metre': 'Hall total, metres',
    'Salon metre, gun': 'Hall metres, day', 'Salon metre, hafta': 'Hall metres, week', 'Salon metre, ay': 'Hall metres, month', 'Tüm salonlar': 'All halls', 'Salon': 'Hall',
    'En düşük verimli tezgâhlar': 'Lowest-efficiency looms', 'dokununca ayrıntı': 'tap for details', 'Tezgâh detayı': 'Loom details', 'Tezgâhlar, sıralı': 'Looms, sorted', 'tezgâh': 'loom', 'Tezgâh': 'Loom',
    'en düşük verim üstte': 'lowest efficiency on top', 'hedefin altında': 'below target', 'durdu demek değildir': 'does not mean stopped', 'dönem sürüyor': 'period in progress', 'eksik gün var': 'missing days', 'en az bu kadar': 'at least this much', 'eksik gün': 'missing day',
    'Duruş nedenleri (bugün)': 'Stoppage reasons (today)', 'Duruş nedenleri': 'Stoppage reasons', 'şu an ve bu vardiya, dakika': 'now and this shift, minutes', 'Duruş': 'Stoppage', 'duruş': 'stoppage',
    'Kayıtsız Duruş': 'Unrecorded stoppage', 'Çözgü': 'Warp', 'Atkı': 'Weft', 'atkı': 'weft', 'Bobin': 'Bobbin', 'Manuel': 'Manual', 'çalışma': 'run time', 'veri yaşı': 'data age',
    'Şu an:': 'Now:', 'kesikli çizgi': 'dashed line', 'hedef': 'target', 'Ürünler': 'Products', 'Ürün:': 'Product:', 'Ürün': 'Product', 'Dönem': 'Period', 'Metre': 'Metres', 'Kayıp': 'Loss', 'Kapat': 'Close',
    'Bugün için duruş kaydı yok.': 'No stoppage record for today.', 'Personel': 'Personnel', 'Teknik': 'Technical', 'Makineler': 'Machines',
    'kullanılabilirlik': 'availability', 'performans': 'performance', 'kalite': 'quality', 'Toplam': 'Total', 'Dün': 'Yesterday', 'Bilinmiyor': 'Unknown', 'Eksik': 'Missing', 'Beklemede': 'Pending',
    'hat veri göndermiyor': 'line is not sending data', 'OEE verisi yok': 'No OEE data', 'hat': 'line', 'ya da': 'or', 'boşta': 'idle', 'vardiya arası': 'between shifts', 'adet': 'pcs', 'dk': 'min',
    'Pzt': 'Mon', 'Sal': 'Tue', 'Çar': 'Wed', 'Per': 'Thu', 'Cum': 'Fri', 'Cmt': 'Sat', 'Paz': 'Sun',
    'Oca': 'Jan', 'Şub': 'Feb', 'Nis': 'Apr', 'Haz': 'Jun', 'Tem': 'Jul', 'Ağu': 'Aug', 'Eyl': 'Sep', 'Eki': 'Oct', 'Kas': 'Nov'
  };
  
  var LB = '(^|[^\\p{L}\\p{N}])', RB = '(?![\\p{L}\\p{N}])';
  function kacis(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var SR = Object.keys(S).sort(function (a, b) { return b.length - a.length; }).map(function (k) { var v = S[k]; return [new RegExp(LB + kacis(k) + RB, 'gu'), function (x, on) { return on + v; }]; });

  function sayiTokeni(on, t) {
    var v;
    if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) v = t.replace(/[.,]/g, function (c) { return c === '.' ? ',' : '.'; });
    else if (/^\d+,\d+$/.test(t)) v = t.replace(',', '.');
    else v = t;
    return on ? v + '%' : v;
  }
  function cevir(m) {
    var s = m;
    if (!/[A-Za-zÇĞİÖŞÜçğıöşü\d]/.test(s)) return s;
    R.forEach(function (r) { s = s.replace(r[0], r[1]); });
    SR.forEach(function (r) { s = s.replace(r[0], r[1]); });
    s = s.replace(/(%?)(\d[\d.,]*\d|\d)/g, function (x, on, t) { return sayiTokeni(on, t); });
    return s;
  }
  var onbellek = new Map();
  function en(m) {
    if (onbellek.has(m)) return onbellek.get(m);
    var c = cevir(m); if (onbellek.size > 20000) onbellek.clear(); onbellek.set(m, c); return c;
  }

  function dugum(n) {
    var p = n.parentNode; if (!p || /^(SCRIPT|STYLE)$/.test(p.tagName)) return;
    var v = n.nodeValue; if (son.get(n) === v) return;
    var c = en(v); if (c !== v) { n.nodeValue = c; } son.set(n, c);
  }
  function nitelik(e, a) {
    var v = e.getAttribute(a); if (v == null) return;
    var anahtar = e; var kay = son.get(e) || (son.set(e, {}), son.get(e));
    if (typeof kay !== 'object') return;
    if (kay[a] === v) return;
    var c = en(v); if (c !== v) e.setAttribute(a, c); kay[a] = c;
  }
  function tara(kok) {
    if (!kok) return;
    if (kok.nodeType === 3) { dugum(kok); return; }
    if (kok.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(kok.tagName)) return;
    NIT.forEach(function (a) { if (kok.hasAttribute(a)) nitelik(kok, a); });
    var w = document.createTreeWalker(kok, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) dugum(n);
      else if (!/^(SCRIPT|STYLE)$/.test(n.tagName)) NIT.forEach(function (a) { if (n.hasAttribute(a)) nitelik(n, a); });
    }
  }
  function basla() {
    var kok = document.documentElement;   
    kok.lang = 'en';
    new MutationObserver(function () { if (kok.lang !== 'en') kok.lang = 'en'; }).observe(kok, { attributes: true, attributeFilter: ['lang'] });
    tara(document.body);
    new MutationObserver(function (liste) {
      liste.forEach(function (m) {
        if (m.type === 'childList') m.addedNodes.forEach(tara);
        else if (m.type === 'characterData') dugum(m.target);
        else if (m.type === 'attributes') nitelik(m.target, m.attributeName);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: NIT });
  }
  if (document.body) basla(); else document.addEventListener('DOMContentLoaded', basla);
})();
