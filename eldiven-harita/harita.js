(function(){
'use strict';
 
const I = {
 tr:{eyebrow:'',title:'Eldiven Yönetim Haritası',loading:'Veriler yükleniyor…',today:'Bugün',search:'Ara: konteyner, sipariş, müşteri, ürün, beden, gemi, tarih',
  emptyLoading:'Konteyner kayıtları yükleniyor. Haritada limanlar ve rotalar görünür; konteynerler veri geldiğinde eklenir.',
  noGl:'3D harita bu cihazda açılamadı (tarayıcı WebGL veya harita dosyaları engelli). Liste, kartlar ve ödemeler normal çalışıyor.',
  noDb:'Konteyner verisi bu görünümde açılamadı. claude.ai hesabınızla oturum açıp sayfayı yeniden açın; erişim yalnızca paylaşılan kişilere açıktır.',
  noData:'Henüz konteyner kaydı yok. İlk güncelleme yapıldığında burada görünecek.', nores:'Aramayla eşleşen konteyner yok.',
  asof:'Son güncelleme', g:{yolda:'Yolda',liman:'Türkiye limanında',antrepo:'Antrepoda',teslim:'Yurtdışı',bekliyor:'Yükleme bekleyen'},
  k:{yolda:'Yolda',liman:'Limanda',antrepo:'Antrepo',teslim:'Yurtdışı',bekliyor:'Bekleyen'},
  st:{yolda:'Yolda',transship:'Aktarmada',liman:'Limanda',late:'Serbest süre aşıldı',antrepo:'Antrepoda',ithal:'İthal edildi',teslim:'Varış limanında',bekliyor:'Yükleme bekliyor',hold:'Beklemede (hold)',pre:'Kalkış bekliyor'},
  late:n=>`<b>${n}</b> konteynerin limanda serbest bekleme süresi doldu`,
  mn:'mn adet', ktr:'konteyner',
  cargo:'Yük', ship:'Sevkiyat', where:'Konum',
  f:{prd:'Ürün',brand:'Marka',grade:'Standart',g:'Eldiven ağırlığı',qty:'Toplam miktar',ctn:'Koli',gross:'Brüt ağırlık',sup:'Üretici',origin:'Menşe',po:'PI / PO',liner:'Armatör',bl:'Konşimento',vessels:'Gemiler',eta:'Varış (ETA)',arr:'Varış',days:'Limanda',free:'Serbest süre',loc:'Şu an',dest:'Hedef'},
  lots:{cus:'Müşteri / lot',sizes:'Beden',qty:'Miktar',kg:'Brüt kg'},
  pcs:'adet',pairs:'çift',partial:'kısmi',day:'gün',over:'aşım',
  atSea:(a,b)=>`Denizde · ${a} → ${b}`, atPort:a=>a, waitAt:a=>`${a} – yükleme öncesi`,
  srcLive:'Konum: armatör canlı takibi',srcAis:'Konum: AIS gemi konumu (canlı)',trk:{h:'Canlı takip',ev:'Son olay',eta:'Armatör ETA',prev:'liste',vsl:'Gemi / sefer',pos:'Gemi konumu',src:'Kaynak',chk:'Kontrol',arr:'Varış gerçekleşti',late:'gün geç',early:'gün erken',same:'plana uygun',kn:'kn',age:'saat önce',live:'canlı takip',none:'Henüz canlı veri yok'}, srcEst:'Konum tahmini: kalkış ve varış tarihine göre rota üzerinde',
  srcList:'Kaynak: eldiven ana listesi',
  vKtr:'Konteynerler', vGrp:'Gemiler ve limanlar', vPay:'Ödemeler', pv:{urg:'Ödeme durumu',late:'Gecikmiş – ödeme günü geçti',week:'7 gün içinde',open:'İthal edilmiş – bakiye açık (teyit)',openD:'Yük ithal edilmiş',later:'Sonraki haftalar',load:'Yükleme için avans gerekli',cal:'Ödeme takvimi (varıştan 4 gün önce)',past:'Gecikmiş',bySup:'Tedarikçiye göre',noPay:'Açık ödeme yok.',atPort:n=>`${n} gündür limanda`,dueOn:d=>`Ödeme ${d}`,list:'Ödenecekler'}, ship:'Gemi', port:'Liman', est:'tahmini', back:'← Gruba dön', ktrs:'konteyner',
  route:'Rota', plan:'Gemi planı', byCus:'Müşteri', byPrd:'Ürün', gTot:{n:'Konteyner',q:'Muayene eldiveni',s:'Cerrahi eldiven',ctn:'Koli',kg:'Brüt kg',eta:'ETA'},
  pay:{h:'Tedarikçi ödemeleri (USD)',total:'PI / fatura tutarı',cn:'Credit note',adv:'Ödenen avans',p2:'Ödenen bakiye',bal:'Kalan ödeme',due:'Vade (şarta göre)',status:'Listede durum',terms:'Ödeme şartı',paid:'Tamamı ödendi',over:'Vadesi geçti',notShipped:'Yüklemeden sonra (konşimento tarihine göre)',
   tA:'%5 sipariş onayında avans, %95 konşimento tarihinden itibaren 30 gün içinde',tB:'%10 peşinat, bakiye konşimento tarihinde',tC:'%10 peşin, %90 konşimento kopyasına karşı',tD:'%30 peşinat, %70 bitmiş ürün fotoğrafı ve COA\'ya karşı',
   need:'Ne zaman ödenmeli',rel:'Gecikti – varıştan 3-4 gün önce ödenmeliydi; ödenmeden yük serbest bırakılmıyor',arr:'Varıştan 4 gün önce',dueNow:'Ödeme günü geldi',dueIn:n=>`${n} gün kaldı`,kWeek:'Yoldakiler: 7 gün içinde / geçmiş',open:'Yük ithal edilmiş ama listede bakiye açık görünüyor – ödeme durumu teyit edilmeli',totLine:'Tedarikçilere kalan toplam',load:'Yükleme için avans gerekli',notdue:'Avans ödendi; bakiye sevkiyattan sonra, varıştan 3-4 gün önce ödenecek',relD:'Yük limanda bekliyor; ödeme gecikmesi her gün ardiye/demuraj yazıyor.',kBal:'Tedarikçiye kalan toplam',kRel:'Limandaki yükleri çekmek için',kArr:'Yoldakiler için (varıştan 4 gün önce)',kLoad:'Yükleme için avans gerekli',calc:'Kural: ödeme varıştan 3-4 gün önce yapılır (telex release); ödenmeden konteyner serbest bırakılmıyor. Tarih, ETA eksi 4 gün olarak hesaplandı.'},
  eta:'ETA', c:{MY:'Malezya',TH:'Tayland',CN:'Çin'}, sel:'Seçili konteyner', close:'Kapat',
  months:['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']},
 en:{eyebrow:'',title:'Glove Management Map',loading:'Loading data…',today:'Today',search:'Search: container, order, customer, product, size, vessel, date',
  emptyLoading:'Loading container records. Ports and routes show on the globe; containers appear when the data arrives.',
  noGl:'The 3D globe could not start on this device (browser WebGL or map files blocked). The list, cards and payments work normally.',
  noDb:'Container data could not be opened in this view. Sign in with your claude.ai account and reopen the page; access is limited to people it is shared with.',
  noData:'No container records yet. They appear here after the first update.', nores:'No container matches this search.',
  asof:'Last updated', g:{yolda:'In transit',liman:'At Turkish ports',antrepo:'Bonded warehouse',teslim:'Abroad',bekliyor:'Awaiting shipment'},
  k:{yolda:'In transit',liman:'At port',antrepo:'Bonded',teslim:'Abroad',bekliyor:'Awaiting'},
  st:{yolda:'In transit',transship:'Transshipment',liman:'At port',late:'Free time exceeded',antrepo:'Bonded warehouse',ithal:'Cleared',teslim:'At destination',bekliyor:'Awaiting shipment',hold:'On hold',pre:'Awaiting departure'},
  late:n=>`<b>${n}</b> containers have used up their free time at port`,
  mn:'m pcs', ktr:'containers',
  cargo:'Cargo', ship:'Shipment', where:'Location',
  f:{prd:'Product',brand:'Brand',grade:'Standard',g:'Glove weight',qty:'Total quantity',ctn:'Cartons',gross:'Gross weight',sup:'Manufacturer',origin:'Origin',po:'PI / PO',liner:'Carrier',bl:'Bill of lading',vessels:'Vessels',eta:'Arrival (ETA)',arr:'Arrived',days:'At port',free:'Free time',loc:'Now',dest:'Destination'},
  lots:{cus:'Customer / lot',sizes:'Sizes',qty:'Quantity',kg:'Gross kg'},
  pcs:'pcs',pairs:'pairs',partial:'partial',day:'days',over:'over',
  atSea:(a,b)=>`At sea · ${a} → ${b}`, atPort:a=>a, waitAt:a=>`${a} – before loading`,
  srcLive:'Position: carrier live tracking',srcAis:'Position: AIS vessel position (live)',trk:{h:'Live tracking',ev:'Last event',eta:'Carrier ETA',prev:'list',vsl:'Vessel / voyage',pos:'Vessel position',src:'Source',chk:'Checked',arr:'Arrived',late:'days late',early:'days early',same:'on plan',kn:'kn',age:'h ago',live:'live tracking',none:'No live data yet'}, srcEst:'Estimated position: placed on the route by departure and arrival dates',
  srcList:'Source: glove master list',
  vKtr:'Containers', vGrp:'Vessels & ports', vPay:'Payments', pv:{urg:'Payment status',late:'Late – payment date passed',week:'Within 7 days',open:'Cleared – balance open (confirm)',openD:'Cargo cleared',later:'Later weeks',load:'Advance needed for loading',cal:'Payment calendar (4 days before arrival)',past:'Late',bySup:'By supplier',noPay:'No open payments.',atPort:n=>`${n} days at port`,dueOn:d=>`Pay by ${d}`,list:'To pay'}, ship:'Vessel', port:'Port', est:'estimated', back:'← Back to group', ktrs:'containers',
  route:'Route', plan:'Vessel plan', byCus:'Customer', byPrd:'Product', gTot:{n:'Containers',q:'Exam gloves',s:'Surgical gloves',ctn:'Cartons',kg:'Gross kg',eta:'ETA'},
  pay:{h:'Supplier payments (USD)',total:'PI / invoice amount',cn:'Credit note',adv:'Advance paid',p2:'Balance paid',bal:'Remaining to pay',due:'Due (per terms)',status:'Status in list',terms:'Payment terms',paid:'Fully paid',over:'Overdue',notShipped:'After loading (from B/L date)',
   tA:'5% advance on order confirmation, 95% within 30 days after B/L date',tB:'10% down payment, balance at B/L date',tC:'10% in advance, 90% against B/L copy',tD:'30% down payment, 70% against finished-goods photos and COA',
   need:'When to pay',rel:'Late – should have been paid 3-4 days before arrival; cargo is not released until paid',arr:'4 days before arrival',dueNow:'Payment is due now',dueIn:n=>`${n} days left`,kWeek:'In transit: due within 7 days / passed',open:'Cargo has been cleared but the list still shows an open balance – confirm the payment status',totLine:'Total remaining to suppliers',load:'Advance needed for loading',notdue:'Advance paid; balance due after shipment, 3-4 days before arrival',relD:'Cargo is waiting at port; each day of delay adds storage/demurrage.',kBal:'Total remaining to suppliers',kRel:'To release cargo at port',kArr:'For cargo in transit (4 days before arrival)',kLoad:'Advance needed for loading',calc:'Rule: payment is made 3-4 days before arrival (telex release); containers are not released until paid. Date shown is ETA minus 4 days.'},
  eta:'ETA', c:{MY:'Malaysia',TH:'Thailand',CN:'China'}, sel:'Selected container', close:'Close',
  months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']}
};
let lang='tr'; try{ const s=localStorage.getItem('gl-lang'); if(s==='en'||s==='tr') lang=s; }catch(e){}
try{ const dp=new URLSearchParams(location.search).get('dil'); if(dp==='en'||dp==='tr') lang=dp; }catch(e){}    
const L=()=>I[lang];

 
const D2R=Math.PI/180;
const HAS_THREE=typeof THREE!=='undefined' && !!THREE.Vector3;
class SV{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z} clone(){return new SV(this.x,this.y,this.z)} copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this} set(x,y,z){this.x=x;this.y=y;this.z=z;return this}
  add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this} sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this} addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;return this} multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this}
  lerp(v,a){this.x+=(v.x-this.x)*a;this.y+=(v.y-this.y)*a;this.z+=(v.z-this.z)*a;return this} dot(v){return this.x*v.x+this.y*v.y+this.z*v.z} lengthSq(){return this.dot(this)} length(){return Math.sqrt(this.lengthSq())}
  normalize(){const l=this.length()||1;return this.multiplyScalar(1/l)} angleTo(v){const d=Math.sqrt(this.lengthSq()*v.lengthSq())||1;return Math.acos(Math.min(1,Math.max(-1,this.dot(v)/d)))}
  crossVectors(a,b){const x=a.y*b.z-a.z*b.y,y=a.z*b.x-a.x*b.z,z=a.x*b.y-a.y*b.x;this.x=x;this.y=y;this.z=z;return this} }
const Vec3=HAS_THREE?THREE.Vector3:SV;
const last=a=>a&&a.length?a[a.length-1]:undefined;
function v3(lat,lon,r){ r=r||1; const la=lat*D2R, ph=(lon+180)*D2R; return new Vec3(-Math.cos(ph)*Math.cos(la)*r, Math.sin(la)*r, Math.sin(ph)*Math.cos(la)*r); }
const PORTS={
 AMB:[40.96,28.69,'Ambarlı','Ambarlı',1], AMBA:[41.06,28.83,'','',1], ALI:[38.80,26.93,'Aliağa','Aliağa',1], IZM:[38.44,27.14,'İzmir','Izmir',1],
 KLG:[2.95,101.25,'Port Klang','Port Klang'], PEN:[5.35,100.2,'Penang','Penang'], SG:[1.22,103.85,'Singapur','Singapore'],
 NGB:[29.9,122.1,'Ningbo','Ningbo'], QIN:[36.0,120.5,'Qingdao','Qingdao'], SHA:[30.7,122.3,'Şanghay','Shanghai'],
 PS:[31.4,32.35,'Port Said','Port Said'], MLT:[35.85,14.55,'Malta','Malta'], PIR:[37.93,23.6,'Pire','Piraeus'], BEY:[33.9,35.5,'Beyrut','Beirut'],
 NAP:[40.82,14.25,'Napoli','Naples'], MNL:[14.55,120.85,'Manila','Manila'], POTI:[42.15,41.62,'Poti','Poti'], SKG:[40.6,22.92,'Selanik','Thessaloniki'],
 BGS:[42.49,27.47,'Burgaz','Burgas'], GDN:[54.4,18.67,'Gdańsk','Gdańsk'], CAU:[18.42,-69.63,'Caucedo','Caucedo'], JKT:[-6.1,106.88,'Cakarta','Jakarta']
};
const NODES={
 QIN:[36.0,120.5],Y1:[34.6,123.0],NGB:[29.9,122.1],SHA:[30.7,122.3],E1:[29.4,123.2],T1:[24.8,119.9],H1:[21.6,115.8],LZ:[20.6,120.9],M1:[16.4,119.4],MNL:[14.55,120.85],
 S1:[12.0,110.4],S2:[6.0,106.3],S3:[1.6,104.6],SG:[1.22,103.85],MA1:[1.9,102.4],KLG:[2.95,101.25],MA3:[4.4,99.9],PEN:[5.35,100.2],MA4:[5.9,97.6],AN1:[6.1,94.2],
 DH:[5.5,80.6],AR1:[9.5,66.0],SO1:[12.4,53.6],GA1:[12.1,47.0],BAB:[12.6,43.35],RS1:[15.6,41.8],RS2:[20.0,38.6],RS3:[24.8,35.6],RS4:[27.7,33.85],SUE:[29.85,32.55],PS:[31.4,32.35],
 E2:[32.6,30.0],E3:[34.1,27.4],KAS:[35.35,26.55],AE1:[36.7,25.7],AE2:[37.75,26.25],AEW:[38.3,25.55],CHS:[38.35,26.2],IZG:[38.75,26.55],IZ2:[38.58,26.9],IZM:[38.44,27.14],ALI:[38.8,26.93],
 AE3:[39.15,25.6],AE4:[39.7,25.8],DAR1:[40.02,26.15],DAR2:[40.22,26.42],DAR3:[40.42,26.72],MAR1:[40.68,27.55],MAR2:[40.85,28.3],AMB:[40.96,28.69],
 BOS1:[41.0,29.0],BOS2:[41.24,29.13],BS1:[41.6,31.5],BS2:[42.0,36.0],BS3:[41.85,39.6],POTI:[42.15,41.62],BG1:[42.1,28.7],BGS:[42.49,27.47],
 SK1:[39.7,24.2],SK2:[40.25,23.0],SKG:[40.6,22.92],CY1:[36.7,24.6],PIR1:[37.65,23.65],PIR:[37.93,23.6],CRT:[34.6,24.8],M2:[34.6,19.5],MLT:[35.85,14.55],
 MSN1:[37.6,15.4],MSN:[38.2,15.63],TY1:[39.5,14.7],NAP:[40.82,14.25],M3:[36.2,18.2],CRW:[36.1,22.95],BEY1:[32.9,34.0],BEY:[33.9,35.5],CYS:[34.3,32.6],RH1:[35.7,28.25],DO1:[36.45,26.95],IKS:[37.65,26.45]
};
const EDGES=('QIN-Y1 Y1-E1 NGB-E1 SHA-E1 E1-T1 T1-H1 T1-LZ LZ-M1 M1-MNL H1-S1 M1-S1 S1-S2 S2-S3 S3-SG SG-MA1 MA1-KLG KLG-MA3 MA3-PEN PEN-MA4 MA3-MA4 MA4-AN1 AN1-DH DH-AR1 AR1-SO1 SO1-GA1 GA1-BAB BAB-RS1 RS1-RS2 RS2-RS3 RS3-RS4 RS4-SUE SUE-PS '+
 'PS-E2 E2-E3 E3-KAS KAS-AE1 AE1-AE2 AE2-CHS CHS-IZG IZG-IZ2 IZ2-IZM IZG-ALI AE1-AEW AEW-AE3 AE3-AE4 AE4-DAR1 DAR1-DAR2 DAR2-DAR3 DAR3-MAR1 MAR1-MAR2 MAR2-AMB AMB-BOS1 BOS1-BOS2 BOS2-BS1 BS1-BS2 BS2-BS3 BS3-POTI BOS2-BG1 BG1-BGS '+
 'AE3-SK1 SK1-SK2 SK2-SKG KAS-CY1 CY1-AE1 CY1-PIR1 PIR1-PIR E3-CRT CRT-M2 M2-MLT MLT-MSN1 MSN1-MSN MSN-TY1 TY1-NAP MLT-M3 M3-CRW CRW-CY1 PS-BEY1 BEY1-BEY BEY-CYS E3-CYS CYS-RH1 RH1-DO1 DO1-IKS IKS-CHS').split(' ');
const NV={}; for(const k in NODES) NV[k]=v3(NODES[k][0],NODES[k][1]);
const ADJ={}; for(const e of EDGES){ const [a,b]=e.split('-'); const w=NV[a].angleTo(NV[b]); (ADJ[a]=ADJ[a]||[]).push([b,w]); (ADJ[b]=ADJ[b]||[]).push([a,w]); }
const PATHC={};
function route(a,b){
  const key=a+'>'+b; if(PATHC[key]) return PATHC[key];
  const dist={},prev={},done={}; for(const k in NODES) dist[k]=Infinity; dist[a]=0;
  for(;;){ let u=null,best=Infinity; for(const k in dist) if(!done[k]&&dist[k]<best){best=dist[k];u=k;} if(u===null||u===b) break; done[u]=1;
    for(const [v,w] of (ADJ[u]||[])) if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;prev[v]=u;} }
  const seq=[]; let c=b; if(dist[b]===Infinity){ seq.push(a,b); } else { while(c){ seq.unshift(c); c=prev[c]; } }
  const posOf=k=>NV[k]||(PORTS[k]?v3(PORTS[k][0],PORTS[k][1]):null);
  if(!posOf(a)||!posOf(b)){ const p=posOf(a)||posOf(b)||v3(0,0); return PATHC[key]={pts:[p,p.clone()],cum:[0,0],len:0}; }
  const pts=[]; for(let i=0;i<seq.length-1;i++){ const p=posOf(seq[i]), q=posOf(seq[i+1]);
    const n=Math.max(2,Math.ceil(p.angleTo(q)/0.01)); for(let j=(i?1:0);j<=n;j++) pts.push(p.clone().lerp(q,j/n).normalize()); }
  const cum=[0]; for(let i=1;i<pts.length;i++) cum.push(cum[i-1]+pts[i].angleTo(pts[i-1]));
  return PATHC[key]={pts,cum,len:cum[cum.length-1]};
}

 
const serialNow=()=>{ try{ const ps=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date()); const g=t=>+ps.find(x=>x.type===t).value; return Date.UTC(g('year'),g('month')-1,g('day'))/864e5+25569+((g('hour')%24)+g('minute')/60)/24; }catch(e){ return Date.now()/864e5+25569; } };
const STAFF=new URLSearchParams(location.search).get('r')!=='y';
if(STAFF){  
  I.tr.eyebrow=''; I.tr.title='Eldiven Konteyner Haritası';
  I.en.eyebrow=''; I.en.title='Glove Container Map'; }
function sdate(s){ return new Date((s-25569)*864e5); }
function fmtD(s,withYear){ const d=sdate(s); const m=L().months[d.getUTCMonth()]; return withYear? `${d.getUTCDate()} ${m} ${d.getUTCFullYear()}` : `${String(d.getUTCDate()).padStart(2,'0')} ${m}`; }
const nf=()=>new Intl.NumberFormat(lang==='tr'?'tr-TR':'en-GB');
const nf1=()=>new Intl.NumberFormat(lang==='tr'?'tr-TR':'en-GB',{maximumFractionDigits:2});

 
const css=getComputedStyle(document.documentElement); const tok=n=>css.getPropertyValue(n).trim();
const COL={yolda:tok('--transit'),transship:tok('--transit'),liman:tok('--port'),late:tok('--late'),antrepo:tok('--bond'),ithal:tok('--done'),teslim:tok('--done'),bekliyor:tok('--wait'),hold:tok('--hold'),pre:tok('--wait'),port:tok('--port'),wait:tok('--wait'),open:tok('--hold')};
const COARSE=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
const stage=document.getElementById('stage'), labelsEl=document.getElementById('labels');
let renderer=null, scene=null, camera=null, controls=null, sun=null, boxGeo=null, edgeGeo=null, edgeMat=null, edgeSel=null; const MATS={};
let GL=HAS_THREE && !!THREE.WebGLRenderer && !!THREE.OrbitControls;
if(GL){ try{
renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)); renderer.setClearColor(tok('--bg'));
stage.insertBefore(renderer.domElement,labelsEl);
scene=new THREE.Scene();
camera=new THREE.PerspectiveCamera(38,1,0.01,100);
camera.position.copy(v3(24,62,3.1));
controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=0.08; controls.enablePan=false; controls.minDistance=1.12; controls.maxDistance=6; controls.rotateSpeed=0.45; controls.zoomSpeed=0.8;
scene.add(new THREE.AmbientLight(0x8fa6c8,0.75));
sun=new THREE.DirectionalLight(0xffffff,0.85); scene.add(sun);


const TW=2048,TH=1024; const landCv=document.createElement('canvas'); landCv.width=TW; landCv.height=TH; const lg=landCv.getContext('2d');
function decodeRing(c,o,s){ const r=[]; let px=o[0],py=o[1]; for(let i=0;i<c.length;i+=2){ let x=c.charCodeAt(i)-64,y=c.charCodeAt(i+1)-64; x=(x>>1)^(-(x&1)); y=(y>>1)^(-(y&1)); x+=px;y+=py;px=x;py=y; r.push([x/s,y/s]); } return r; }
function drawLand(ctx,fill){
  ctx.fillStyle=fill; const w=window.__WORLD; if(!w||!w.features) return false; const sc=w.UTF8Scale||1024;
  for(const f of w.features){ const g=f.geometry; if(!g) continue; const polys=g.type==='Polygon'?[[g.coordinates,g.encodeOffsets]]:g.coordinates.map((p,i)=>[p,g.encodeOffsets[i]]);
    for(const [rings,offs] of polys){ ctx.beginPath();
      rings.forEach((ring,ri)=>{ let pts=w.UTF8Encoding?decodeRing(ring,offs[ri],sc):ring; let lon0=pts[0][0];
        for(const shift of [-360,0,360]){ let prev=null; pts.forEach((p,k)=>{ let lon=p[0]; if(prev!==null){ while(lon-prev>180) lon-=360; while(lon-prev<-180) lon+=360; } prev=lon;
            const X=(lon+shift+180)/360*TW, Y=(90-p[1])/180*TH; k?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }); ctx.closePath(); } });
      ctx.fill('evenodd'); } }
  return true;
}
lg.fillStyle='#000'; lg.fillRect(0,0,TW,TH); const haveLand=drawLand(lg,'#fff');
const landData=lg.getImageData(0,0,TW,TH).data;
const oceanCv=document.createElement('canvas'); oceanCv.width=TW; oceanCv.height=TH; const og=oceanCv.getContext('2d');
og.fillStyle=tok('--ocean'); og.fillRect(0,0,TW,TH); og.globalAlpha=.55; drawLand(og,'#13253D'); og.globalAlpha=1;
og.strokeStyle='rgba(120,150,190,.08)'; og.lineWidth=1; for(let lo=-180;lo<=180;lo+=30){const x=(lo+180)/360*TW; og.beginPath(); og.moveTo(x,0); og.lineTo(x,TH); og.stroke();} for(let la=-60;la<=60;la+=30){const y=(90-la)/180*TH; og.beginPath(); og.moveTo(0,y); og.lineTo(TW,y); og.stroke();}
const oceanTex=new THREE.CanvasTexture(oceanCv); oceanTex.anisotropy=4;
const globe=new THREE.Mesh(new THREE.SphereGeometry(1,128,96),new THREE.MeshPhongMaterial({map:oceanTex,shininess:6,specular:0x1a2c48}));
scene.add(globe);

(function(){ if(!haveLand) return; const N=110000, pos=[], gold=Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<N;i++){ const y=1-2*(i+.5)/N, r=Math.sqrt(1-y*y), th=gold*i; const x=Math.cos(th)*r, z=Math.sin(th)*r;
    const lat=Math.asin(y)/D2R; let lon=Math.atan2(z,-x)/D2R-180; if(lon<-180) lon+=360;
    const px=Math.min(TW-1,Math.floor((lon+180)/360*TW)), py=Math.min(TH-1,Math.floor((90-lat)/180*TH));
    if(landData[(py*TW+px)*4]>127){ pos.push(x*1.0015,y*1.0015,z*1.0015); } }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  const dc=document.createElement('canvas'); dc.width=dc.height=32; const dg=dc.getContext('2d'); dg.fillStyle='#fff'; dg.beginPath(); dg.arc(16,16,12,0,Math.PI*2); dg.fill();
  scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:tok('--land'),size:0.0062,map:new THREE.CanvasTexture(dc),transparent:true,alphaTest:.3,depthWrite:false})));
})();

scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.06,64,48),new THREE.ShaderMaterial({side:THREE.BackSide,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,
  uniforms:{c:{value:new THREE.Color(tok('--glow'))}},
  vertexShader:'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 c;varying vec3 vN;void main(){float i=pow(0.72-dot(vN,vec3(0.,0.,1.)),3.2);gl_FragColor=vec4(c,1.)*i*.9;}'})));
boxGeo=new THREE.BoxGeometry(0.018,0.0076,0.0076); edgeGeo=new THREE.EdgesGeometry(boxGeo);
for(const k in COL){ const c=new THREE.Color(COL[k]); MATS[k]=new THREE.MeshStandardMaterial({color:c,roughness:.55,metalness:.15,emissive:c,emissiveIntensity:.22}); }
edgeMat=new THREE.LineBasicMaterial({color:0x050a12,transparent:true,opacity:.7}); edgeSel=new THREE.LineBasicMaterial({color:0xffffff});
}catch(err){ GL=false; try{ if(renderer&&renderer.domElement&&renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }catch(e){} renderer=null; } }
if(!GL){ const m=document.createElement('div'); m.className='nogl'; m.id='nogl'; stage.appendChild(m); document.getElementById('app').classList.add('nogl-on'); labelsEl.style.display='none'; }


const labelEls={};
for(const k in PORTS){ const p=PORTS[k]; if(!p[2]) continue; const el=document.createElement('span'); el.className='plabel'+(p[4]?' tr':''); labelsEl.appendChild(el); labelEls[k]=el; }
function setPortLabels(){ for(const k in labelEls) labelEls[k].textContent=lang==='tr'?PORTS[k][2]:PORTS[k][3]; }
setPortLabels();

 
const BL=0.018,BH=0.0076,BW=0.0076;
let selGroup=null, fromGroup=null, view='ktr', GROUPS=new Map();
let BOARD=null, ITEMS=[], selected=null, T=46318, filters={yolda:1,liman:1,antrepo:1,teslim:1,bekliyor:1}, query='';
const groupOf=ds=>({yolda:'yolda',transship:'yolda',liman:'liman',late:'liman',ithal:'liman',antrepo:'antrepo',teslim:'teslim',bekliyor:'bekliyor',hold:'bekliyor',pre:'bekliyor'})[ds]||'bekliyor';

function buildItems(){
  if(GL) for(const it of ITEMS){ scene.remove(it.mesh); if(it.line){ scene.remove(it.line); scene.remove(it.lineHi); } }
  ITEMS=[]; if(!BOARD) return;
  for(const c of BOARD.containers){
    let mesh, ed; if(GL){ mesh=new THREE.Mesh(boxGeo,MATS.bekliyor); ed=new THREE.LineSegments(edgeGeo,edgeMat); mesh.add(ed); scene.add(mesh); }
    else { mesh={position:new Vec3(),visible:true,material:null,userData:{},scale:{setScalar(){}},quaternion:{setFromRotationMatrix(){}}}; ed={material:null}; }
    mesh.userData.c=c;
    const it={c,mesh,ed,segs:[]};
    const legs=c.legs||[]; let full=[];
    legs.forEach((lg,i)=>{ if(i>0 && lg[2]>legs[i-1][3]) it.segs.push({type:'dwell',at:lg[0],t0:legs[i-1][3],t1:lg[2],leg:i-1,idx:full.length-1});
      const r=route(lg[0],lg[1]); it.segs.push({type:'move',t0:lg[2],t1:lg[3],r,leg:i,start:full.length}); full=full.concat(r.pts); });
    if(full.length>1 && !GL) it.n=full.length;
    if(full.length>1 && GL){ const arr=new Float32Array(full.length*3); full.forEach((p,i)=>{arr[i*3]=p.x*1.0025;arr[i*3+1]=p.y*1.0025;arr[i*3+2]=p.z*1.0025;});
      const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(arr,3));
      it.line=new THREE.Line(g,new THREE.LineBasicMaterial({color:COL.yolda,transparent:true,opacity:.18,depthWrite:false}));
      it.lineHi=new THREE.Line(g,new THREE.LineBasicMaterial({color:COL.yolda,transparent:true,opacity:.85,depthWrite:false}));
      it.line.visible=it.lineHi.visible=false; scene.add(it.line); scene.add(it.lineHi); it.n=full.length; }
    ITEMS.push(it);
  }
}

function stateAt(it,t){
  const c=it.c, legs=c.legs||[];
  if(!legs.length) return {mode:'port',at:c.at,ds:(c.st==='yolda'||c.st==='transship'||!c.st)?'bekliyor':c.st};
  const dep=legs[0][2], arr=legs[legs.length-1][3];
  if(c.st==='hold'||c.st==='bekliyor') return {mode:'port',at:legs[0][0],ds:c.st,traveled:0};
  if(!Number.isFinite(dep)||!Number.isFinite(arr)){ if(Number.isFinite(dep)&&t<dep) return {mode:'port',at:legs[0][0],ds:'pre',traveled:0}; return {mode:'port',at:(Number.isFinite(dep)?legs[legs.length-1][1]:legs[0][0]),ds:Number.isFinite(dep)?'yolda':'pre',noeta:true,traveled:0}; }
  if(t<dep) return {mode:'port',at:legs[0][0],ds:'pre',traveled:0};
  if(t>=arr){ let ds=c.st; const days=Math.floor(t-arr); const free=c.free!=null?c.free:14; if(ds==='liman' && days>free) ds='late'; return {mode:'port',at:c.at,ds,days,arr,traveled:it.n||0,done:true}; }
  for(const s of it.segs){ if(t>=s.t0 && t<s.t1){
    if(s.type==='dwell') return {mode:'port',at:s.at,ds:'transship',leg:s.leg,traveled:s.idx+1};
    const f=(t-s.t0)/(s.t1-s.t0), d=f*s.r.len, cum=s.r.cum; let lo=0,hi=cum.length-1; while(hi-lo>1){ const m=(lo+hi)>>1; if(cum[m]<=d) lo=m; else hi=m; }
    const a=s.r.pts[lo], b=s.r.pts[Math.min(hi,s.r.pts.length-1)], seg=cum[hi]-cum[lo]||1, k=(d-cum[lo])/seg;
    const pos=a.clone().lerp(b,k).normalize(), dir=b.clone().sub(a); if(dir.lengthSq()<1e-12) dir.set(1,0,0);
    const lp=livePos(c,t); return {mode:'move',pos:lp?lp.pos:pos,dir,ds:'yolda',leg:s.leg,from:legs[s.leg][0],to:legs[s.leg][1],traveled:s.start+lo+1,live:!!lp}; } }
  return {mode:'port',at:legs[legs.length-1][1],ds:'yolda'};
}
const vname=s=>String(s||'').split(' ').filter(w=>!/\d/.test(w)).join(' ').trim();
function curVessel(it){ const c=it.c, st=it.st, lg=c.legs[st.leg]||[];
  if(lg[4]) return {name:lg[4],est:false};
  const parts=(c.vessels||'').split(' · ').filter(Boolean); if(!parts.length) return {name:(c.liner||'')+' '+portName(st.from)+'→'+portName(st.to),est:true};
  const f=(st.traveled||0)/(it.n||1); const i=parts.length>=3?(f<0.06?0:(f>0.9?parts.length-1:1)):(parts.length===2?(f<0.06?0:1):0);
  return {name:parts[i],est:parts.length>1}; }
const up0=new Vec3(), ax=new Vec3(), side=new Vec3(), m4=GL?new THREE.Matrix4():{makeBasis(){return this}}, tmp=new Vec3();
const fold=s=>String(s==null?'':s).replace(/[İIı]/g,'i').toLowerCase();
function matchesQuery(c){ if(!query) return true; const it=ITEMS.find(i=>i.c===c), st=it&&it.st; const cus=c.lots.map(l=>cusName(l.cus)+' '+l.cus).join(' ');
  const sizes=c.lots.map(l=>Object.entries(l.sizes||{}).map(([k,v])=>k+' '+v+' '+k+v).join(' ')).join(' '); const eta=c.legs.length?last(c.legs)[3]:null; const etaS=Number.isFinite(eta)?fmtD(eta,true)+' '+sdate(eta).toISOString().slice(0,7):'';
  return fold([c.ref,c.ktr,c.po,c.bl,cus,c.sup,c.brand,c.grade,prdName(c.prd),c.vessels,c.liner,sizes,etaS,st?L().st[st.ds]:'',portName(c.at),c.dest?portName(c.dest):''].join(' ')).includes(query); }
function layout(){
  if(!ITEMS.length){ GROUPS=new Map(); return; }
  const dist=camera?camera.position.length():3.1, s=Math.min(2.0,Math.max(0.3,(dist-1)*0.75));
  const groups=new Map();
  for(const it of ITEMS){ it.st=stateAt(it,T); const vis=filters[groupOf(it.st.ds)] && matchesQuery(it.c); it.vis=vis; it.mesh.visible=vis;
    if(it.line){ const show=vis && (it.st.mode==='move'||it.st.ds==='transship'||it===selected); it.line.visible=show; it.lineHi.visible=show; if(show) it.lineHi.geometry.setDrawRange(0,Math.max(1,it.st.traveled||0)); }
    if(!vis) continue;
    let key,base,dir=null;
    if(it.st.mode==='move'){ base=it.st.pos; dir=it.st.dir; const la=Math.asin(base.y), lo=Math.atan2(base.z,-base.x); it.vl=curVessel(it); key='v'+vname(it.vl.name); }
    else { const p=PORTS[it.st.at]||NODES[it.st.at]||[0,0]; base=v3(p[0],p[1]); key='p'+it.st.at; }
    if(!groups.has(key)) groups.set(key,{key,base,dir,list:[],kind:it.st.mode==='move'?'ship':'port',at:it.st.at,vl:it.vl,transship:it.st.ds==='transship'}); else if(it.st.mode==='move') groups.get(key).base.add(base); groups.get(key).list.push(it); it.gk=key;
  }
  GROUPS=groups;
  for(const [key,g] of groups){
    up0.copy(g.base).normalize();
    if(g.dir){ ax.copy(g.dir).addScaledVector(up0,-g.dir.dot(up0)).normalize(); }
    else { const la=Math.asin(up0.y)/D2R, lo=Math.atan2(up0.z,-up0.x)/D2R-180; ax.copy(v3(la,lo+0.1)).sub(v3(la,lo)).normalize(); }
    side.crossVectors(ax,up0).normalize(); ax.crossVectors(up0,side).normalize();
    const cols=g.dir?1:3, rows=2, per=cols*rows;
    g.list.sort((a,b)=>a.c.ref<b.c.ref?-1:1);
    g.list.forEach((it,i)=>{ const layer=Math.floor(i/per), r=i%per, col=r%cols, row=Math.floor(r/cols);
      tmp.copy(up0).multiplyScalar(1+ (BH/2+layer*BH*1.08)*s+0.0006).addScaledVector(ax,(col-(cols-1)/2)*BL*1.12*s).addScaledVector(side,(row-(rows-1)/2)*BW*1.3*s);
      it.mesh.position.copy(tmp); m4.makeBasis(ax,up0,side); it.mesh.quaternion.setFromRotationMatrix(m4);
      const sel=it===selected; it.mesh.scale.setScalar(s*(sel?1.3:1)); it.mesh.material=MATS[it.st.ds]||MATS.bekliyor; it.ed.material=sel?edgeSel:edgeMat; });
  }
}

 
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
function iso(k){ if(!k) return '—'; return k.length===11? `${esc(k.slice(0,4))} ${esc(k.slice(4,10))}<b>${esc(k.slice(10))}</b>` : esc(k); }
const cusName=code=>{ const c=BOARD&&BOARD.customers[code]; return c?c[lang==='tr'?0:1]:code; };
const prdName=code=>{ const p=BOARD&&BOARD.products[code]; return p?p[lang==='tr'?0:1]:code; };
const portName=k=>{ const p=PORTS[k]; if(!p) return k; if(k==='AMBA') return lang==='tr'?'Ambarlı antrepo':'Ambarlı bonded'; return lang==='tr'?p[2]:p[3]; };
const num=v=>(v==null||!isFinite(v))?'—':nf().format(v);
function qtyStr(c){ return c.unit==='pairs'? `${num(c.qty)} ${L().pairs}` : `${num(c.qty)} ${L().pcs}`; }
function applyI18n(){
  document.documentElement.lang=lang; document.title=L().title;
  document.querySelectorAll('[data-i]').forEach(el=>{ const v=L()[el.dataset.i]; if(typeof v==='string') el.textContent=v; });
  $('q').placeholder=L().search; $('lang-tr').setAttribute('aria-pressed',lang==='tr'); $('lang-en').setAttribute('aria-pressed',lang==='en');
  setPortLabels(); ticks(); if(BOARD) setAsof(); const ng=$('nogl'); if(ng) ng.textContent=L().noGl; refreshUI(true);
}
function ticks(){ const el=$('ticks'), a=sdate(+$('t').min), b=sdate(+$('t').max); let h='', y=a.getUTCFullYear(), m=a.getUTCMonth(), g=0; const ye=b.getUTCFullYear(), me=b.getUTCMonth();
  while((y<ye||(y===ye&&m<=me)) && g++<36){ h+=`<span>${L().months[m]}</span>`; if(++m>11){ m=0; y++; } } el.innerHTML=h; }
function setAsof(){ const d=new Date(BOARD.asof); $('asof').textContent=`${L().asof}: ${new Date(d.getTime()+10800000).toLocaleString(lang==='tr'?'tr-TR':'en-GB',{timeZone:'UTC',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}`+(BOARD.trk&&BOARD.trk.ts&&BOARD.trk.n>0?` · ${L().trk.h}: ${fmtTs(BOARD.trk.ts)} (${BOARD.trk.n})`:''); }
let lastDay=null;
function refreshUI(force){
  const day=Math.floor(T); $('date').textContent=fmtD(T,true); $('t').value=day;
  if(!force && day===lastDay) return; lastDay=day;
  if(!BOARD){ return; }
  layout();
  const cnt={yolda:0,liman:0,antrepo:0,teslim:0,bekliyor:0}, q={yolda:0,liman:0,antrepo:0,teslim:0,bekliyor:0}; let late=0;
  for(const it of ITEMS){ const g=groupOf(it.st.ds); cnt[g]++; if(it.c.unit==='pcs') q[g]+=it.c.qty; if(it.st.ds==='late') late++; }
  $('kpis').innerHTML=['yolda','liman','antrepo','teslim','bekliyor'].map(k=>`<button type="button" class="kpi" data-g="${k}" aria-pressed="${!!filters[k]}"><span class="n">${cnt[k]}</span><span class="l"><i style="background:${COL[k==='teslim'?'teslim':k]}"></i>${L().k[k]}</span><span class="s">${nf1().format(q[k]/1e6)} ${L().mn}</span></button>`).join('');
  finKpis();
  const al=$('alert'); if(late){ al.hidden=false; al.innerHTML=`<span style="width:8px;height:8px;border-radius:2px;background:${COL.late};flex:none"></span><span>${L().late(late)}</span>`; } else al.hidden=true;
  
  const order=['yolda','liman','antrepo','teslim','bekliyor']; let html='', shown=0;
  for(const g of order){ if(!filters[g]) continue; const items=ITEMS.filter(it=>groupOf(it.st.ds)===g && it.vis);
    if(!items.length) continue; shown+=items.length;
    items.sort((a,b)=>{ if(g==='yolda') return (last(a.c.legs)||[0,0,0,0])[3]-(last(b.c.legs)||[0,0,0,0])[3]; if(g==='liman') return (b.st.days||0)-(a.st.days||0); return a.c.ref<b.c.ref?-1:1; });
    html+=`<div class="gh"><span>${L().g[g]}</span><span>${items.length}</span></div>`;
    for(const it of items){ const c=it.c, st=it.st; let m='', lateCls='';
      if(g==='yolda'){ const eta=(last(c.legs)||[])[3]; m=`${L().eta}<br>${Number.isFinite(eta)?fmtD(eta):'—'}`; }
      else if(st.days!=null && (st.ds==='liman'||st.ds==='late')){ m=`${st.days} ${L().day}`; if(st.ds==='late'){ lateCls=' late'; m+=`<br>+${st.days-c.free}`; } }
      else m=esc(portName(st.at));
      html+=`<button type="button" class="row" data-id="${esc(c.id)}" aria-current="${it===selected}"><span class="pip" style="background:${COL[st.ds]}"></span><span class="r1">${esc(c.ref)} · ${esc(cusName(c.lots[0].cus))}${c.trk?`<i class="lv" title="${L().trk.live}"></i>`:''}</span><span class="m${lateCls}">${m}</span><span class="r2">${c.ktr?esc(c.ktr):esc(prdName(c.prd))} · ${esc(portName(st.mode==='move'?st.to:st.at))}</span></button>`; }
  }
  if(view==='grp'){ html=''; const gs=[...GROUPS.values()].sort((a,b)=>{ if(a.kind!==b.kind) return a.kind==='ship'?-1:1; if(a.kind==='ship'){ const ea=groupTotals(a.list).etaMin||0, eb=groupTotals(b.list).etaMin||0; return ea-eb; } return b.list.length-a.list.length; });
    let lastKind=null; for(const g of gs){ const t=groupTotals(g.list); if(g.kind!==lastKind){ lastKind=g.kind; html+=`<div class="gh"><span>${g.kind==='ship'?L().ship:L().port}</span><span>${gs.filter(x=>x.kind===g.kind).length}</span></div>`; }
      const col=g.kind==='ship'?COL.yolda:COL[g.list[0].st.ds];
      html+=`<button type="button" class="row" data-gk="${esc(g.key)}" aria-current="${g.key===selGroup}"><span class="pip" style="background:${col}"></span><span class="r1">${esc(groupLabel(g))}</span><span class="m">${t.n}<br><span style="font-size:11px">${L().ktrs}</span></span><span class="r2">${nf1().format(t.q/1e6)} ${L().mn}${t.s?` · ${nf().format(t.s)} ${L().pairs}`:''}${g.kind==='ship'&&t.etaMin?` · ${L().eta} ${fmtD(t.etaMin)}`:''}</span></button>`; } }
  if(view==='ozet') html=ozetView(); $('v-pay').hidden=STAFF||!(BOARD&&BOARD.fin); if(view==='pay'&&BOARD&&BOARD.fin&&!STAFF) html=payView();
  $('v-fiy').hidden=STAFF||!(BOARD&&BOARD.fiyat_listesi); if(view==='fiy'&&BOARD&&BOARD.fiyat_listesi&&!STAFF) html=flView();
  $('list').innerHTML= html || `<div class="empty">${ITEMS.length?L().nores:L().noData}</div>`;
  if(selected) renderCard();
}
 
function fmtTs(s){ const d=new Date(s); if(isNaN(d)) return esc(s||''); return new Date(d.getTime()+10800000).toLocaleString(lang==='tr'?'tr-TR':'en-GB',{timeZone:'UTC',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }
function livePos(c,t){ const p=c.trk&&c.trk.pos; if(!p||!Number.isFinite(p.lat)||!Number.isFinite(p.lon)) return null; if(Math.abs(t-serialNow())>1.5) return null;
  const age=(Date.now()-Date.parse(p.t))/36e5; if(!(age<36)) return null; return {pos:v3(p.lat,p.lon),age}; }
function trkBlock(c,st){ const k=c.trk, x=L().trk; if(!k||!x) return ''; const fd=v=>Number.isFinite(v)?fmtD(v,true):'—'; let rows='';
  if(k.ev_tr||k.ev_en){ const at=k.ev_at?(PORTS[k.ev_at]?portName(k.ev_at):k.ev_at):''; rows+=`<dt>${x.ev}</dt><dd>${esc(lang==='tr'?k.ev_tr:k.ev_en)}${at?` · ${esc(at)}`:''}${k.ev_vsl?` · ${esc(k.ev_vsl)}`:''}${Number.isFinite(k.ev_t)?` · <span class="num">${fd(k.ev_t)}</span>`:''}</dd>`; }
  if(Number.isFinite(k.eta)){ let diff=''; if(Number.isFinite(k.eta_prev)&&k.eta_prev!==k.eta){ const d=k.eta-k.eta_prev; diff=` <span class="${d>0?'l':'d'}">(${d>0?'+':''}${d} ${d>0?x.late:x.early}, ${x.prev} ${fd(k.eta_prev)})</span>`; } else diff=` <span class="d">(${x.same})</span>`;
    rows+=`<dt>${k.arrived?x.arr:x.eta}</dt><dd><span class="num">${fd(k.eta)}</span>${k.pod?` · ${esc(portName(k.pod))}`:''}${k.arrived?'':diff}</dd>`; }
  if(k.vsl) rows+=`<dt>${x.vsl}</dt><dd>${esc(k.vsl)}${k.voy?` ${esc(k.voy)}`:''}</dd>`;
  if(k.pos&&Number.isFinite(k.pos.lat)){ const age=Math.max(0,Math.round((Date.now()-Date.parse(k.pos.t))/36e5)); rows+=`<dt>${x.pos}</dt><dd>${k.pos.vsl?esc(k.pos.vsl)+' · ':''}<span class="num">${k.pos.lat.toFixed(2)}, ${k.pos.lon.toFixed(2)}</span>${Number.isFinite(k.pos.sog)?` · ${k.pos.sog} ${x.kn}`:''} · ${age} ${x.age}</dd>`; }
  if(!rows) rows=`<dt>${x.ev}</dt><dd>${x.none}</dd>`;
  return `<div class="trk"><h4><i class="lv" style="margin:0"></i>${x.h}</h4><dl>${rows}</dl><div class="meta">${x.src}: ${esc(k.src||'')} · ${x.chk}: ${fmtTs(k.ts)}</div></div>`; }
function renderCard(){
  const it=selected, card=$('card'); if(!it){ if(selGroup) return renderGroupCard(); card.hidden=true; return; } const c=it.c, st=it.st, l=L();
  const loc = st.mode==='move' ? l.atSea(portName(st.from),portName(st.to)) : (st.ds==='pre'? l.waitAt(portName(st.at)) : portName(st.at));
  const lastArr=c.legs.length?last(c.legs)[3]:null;
  const lots=c.lots.map(lt=>`<tr><td>${esc(cusName(lt.cus))}</td><td><div class="sizes">${Object.entries(lt.sizes||{}).map(([k,v])=>`<span>${esc(k)} ${num(v)}</span>`).join('')}</div></td><td class="r num">${num(lt.qty)}</td><td class="r num">${lt.gross!=null?nf().format(Math.round(lt.gross)):'—'}</td></tr>`).join('');
  const fd=v=>Number.isFinite(v)?fmtD(v):'—';
  const legs=c.legs.map((lg,i)=>{ let cls=''; if(Number.isFinite(lg[3])&&T>=lg[3]) cls='done'; if(st.leg===i && st.mode==='move') cls='now'; return `<li class="${cls}"><div>${esc(portName(lg[0]))} → ${esc(portName(lg[1]))} · <span class="num">${fd(lg[2])} – ${fd(lg[3])}</span>${lg[4]?`<div class="v">${esc(lg[4])}</div>`:''}</div></li>`; }).join('');
  const gross=c.gross!=null? `${nf().format(Math.round(c.gross))} kg` : (c.gross_part? `${nf().format(Math.round(c.gross_part))} kg (${l.partial})` : '—');
  const note=lang==='tr'?c.note_tr:c.note_en;
  let portRow=''; if(st.days!=null && c.free!=null){ portRow=`<dt>${l.f.days}</dt><dd><span class="num">${st.days} ${l.day}</span> · ${l.f.free} ${c.free} ${l.day}${st.ds==='late'?` · <b style="color:${COL.late}">+${st.days-c.free} ${l.over}</b>`:''}</dd>`; }
  const dest=c.dest? `<dt>${l.f.dest}</dt><dd>${esc(portName(c.dest))}</dd>`:'';
  const srcPos = c.legs.length? (st.live? l.srcAis : (c.live? l.srcLive : l.srcEst)) : '';
  card.innerHTML=`<div class="ch">${fromGroup?`<button type="button" class="back" id="cardback">${l.back}</button>`:''}<div class="t"><h2>${esc(c.ref)}</h2><button type="button" class="x" id="cardx" aria-label="${l.close}">✕</button></div>
   <div class="iso">${iso(c.ktr)}</div><div><span class="pill"><i style="background:${COL[st.ds]}"></i>${l.st[st.ds]}</span></div></div>
   <div class="cs"><h3>${l.cargo}</h3><dl>
     <dt>${l.f.prd}</dt><dd>${esc(prdName(c.prd))}</dd>
     <dt>${l.f.brand}</dt><dd>${esc(c.brand)}${c.grade?` · ${esc(c.grade)}`:''}</dd>
     ${c.g?`<dt>${l.f.g}</dt><dd class="num">${nf1().format(c.g)} g</dd>`:''}
     <dt>${l.f.qty}</dt><dd class="num">${qtyStr(c)}</dd>
     <dt>${l.f.ctn}</dt><dd class="num">${num(c.ctn)}</dd>
     <dt>${l.f.gross}</dt><dd class="num">${gross}</dd></dl>
     <div style="overflow-x:auto"><table class="lots"><thead><tr><th>${l.lots.cus}</th><th>${l.lots.sizes}</th><th class="r">${l.lots.qty}</th><th class="r">${l.lots.kg}</th></tr></thead><tbody>${lots}</tbody></table></div></div>
   <div class="cs"><h3>${l.ship}</h3><dl>
     <dt>${l.f.sup}</dt><dd>${esc(c.sup)} · ${esc(l.c[c.origin]||c.origin)}</dd>
     <dt>${l.f.po}</dt><dd class="num">${esc(c.po)}</dd>
     ${c.liner?`<dt>${l.f.liner}</dt><dd>${esc(c.liner)}</dd>`:''}
     ${c.bl?`<dt>${l.f.bl}</dt><dd class="num">${esc(c.bl)}</dd>`:''}
     ${c.vessels?`<dt>${l.f.vessels}</dt><dd>${esc(c.vessels)}</dd>`:''}
     <dt>${l.f.loc}</dt><dd>${esc(loc)}</dd>
     ${Number.isFinite(lastArr)?`<dt>${T>=lastArr?l.f.arr:l.f.eta}</dt><dd class="num">${fmtD(lastArr,true)}</dd>`:(st.noeta?`<dt>${l.f.eta}</dt><dd>${lang==='tr'?'bekleniyor':'pending'}</dd>`:'')}${dest}${portRow}</dl>
     ${legs?`<ul class="legs">${legs}</ul>`:''}
     ${note?`<div class="note">${esc(note)}</div>`:''}
     ${trkBlock(c,st)}
     <div class="src">${srcPos?esc(srcPos)+'<br>':''}${esc(l.srcList)} · ${esc(lang==='tr'?BOARD.src_tr:BOARD.src_en)}</div></div>${finCard(c,st)}`;
  card.hidden=false; $('cardx').onclick=()=>select(null); const bk=$('cardback'); if(bk) bk.onclick=()=>selectGroup(fromGroup,false);
}
function groupLabel(g){ if(g.kind==='ship') return g.vl? g.vl.name+(g.vl.est?` (${L().est})`:'') : L().ship; return portName(g.at)+(g.transship?' · '+L().st.transship:''); }
function groupTotals(list){ const t={n:list.length,q:0,s:0,ctn:0,kg:0,kgPart:false,cus:{},prd:{},fob:0,bal:0,fin:false,etaMin:null,etaMax:null};
  for(const it of list){ const c=it.c; if(c.unit==='pairs') t.s+=c.qty; else t.q+=c.qty; t.ctn+=c.ctn||0;
    if(c.gross!=null) t.kg+=c.gross; else { t.kgPart=true; if(c.gross_part) t.kg+=c.gross_part; }
    for(const lt of c.lots){ const n=cusName(lt.cus); t.cus[n]=(t.cus[n]||0)+1; } const pn=prdName(c.prd); t.prd[pn]=(t.prd[pn]||0)+1;
    if(c.legs.length&&Number.isFinite(last(c.legs)[3])){ const e=last(c.legs)[3]; t.etaMin=t.etaMin==null?e:Math.min(t.etaMin,e); t.etaMax=t.etaMax==null?e:Math.max(t.etaMax,e); }
    if(c.fin&&!STAFF){ t.fin=true; t.fob+=c.fin.fob||0; if(c.fin.pay) t.bal+=c.fin.pay.bal||0; } }
  return t; }
function renderGroupCard(){
  const g=GROUPS.get(selGroup), card=$('card'), l=L(); if(!g){ card.hidden=true; return; } const t=groupTotals(g.list);
  const chips=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span>${esc(k)} × ${v}</span>`).join('');
  const first=g.list[0].c, plan=g.kind==='ship'&&first.vessels? `<div class="src">${l.plan}: ${esc(first.vessels)}</div>`:'';
  const route=g.kind==='ship'? `${esc(portName(g.list[0].st.from))} → ${esc(portName(g.list[0].st.to))}` : '';
  const eta=t.etaMin!=null && g.kind==='ship'? (t.etaMin===t.etaMax? fmtD(t.etaMin) : `${fmtD(t.etaMin)} – ${fmtD(t.etaMax)}`) : '';
  const rows=g.list.slice().sort((a,b)=>a.c.ref<b.c.ref?-1:1).map(it=>{ const c=it.c, st=it.st; let m=c.unit==='pairs'? `${nf().format(c.qty/1000)}k`:`${nf1().format(c.qty/1e6)} mn`;
    return `<button type="button" class="row" data-gid="${esc(c.id)}"><span class="pip" style="background:${COL[st.ds]}"></span><span class="r1">${esc(c.ref)} · ${esc(cusName(c.lots[0].cus))}${c.trk?`<i class="lv" title="${L().trk.live}"></i>`:''}</span><span class="m">${m}</span><span class="r2">${c.ktr?esc(c.ktr)+' · ':''}${esc(prdName(c.prd))}</span></button>`; }).join('');
  const finRow=t.fin&&BOARD.fin? `<div class="gstats" style="grid-template-columns:1fr 1fr"><div><b>${usd(t.fob)}</b><span>FOB</span></div><div><b style="color:${t.bal>0?COL.port:COL.ithal}">${usd(t.bal)}</b><span>${l.pay.bal}</span></div></div>`:'';
  card.innerHTML=`<div class="ch"><div class="t"><h2>${esc(groupLabel(g))}</h2><button type="button" class="x" id="cardx" aria-label="${l.close}">✕</button></div>
    <div class="src">${g.kind==='ship'?l.ship:l.port}${route?' · '+route:''}${eta?' · '+l.gTot.eta+' '+eta:''}</div></div>
   <div class="cs"><div class="gstats"><div><b>${t.n}</b><span>${l.gTot.n}</span></div><div><b>${nf1().format(t.q/1e6)} mn</b><span>${l.gTot.q}</span></div><div><b>${nf().format(t.ctn)}</b><span>${l.gTot.ctn}</span></div>
     ${t.s?`<div><b>${nf().format(t.s)}</b><span>${l.gTot.s} (${l.pairs})</span></div>`:''}<div><b>${nf().format(Math.round(t.kg))}</b><span>${l.gTot.kg}${t.kgPart?' ('+l.partial+')':''}</span></div></div>${finRow}
     <h3>${l.byCus}</h3><div class="chips">${chips(t.cus)}</div><h3>${l.byPrd}</h3><div class="chips">${chips(t.prd)}</div>${plan}</div>
   <div class="cs"><h3>${t.n} ${t.n===1&&lang==='en'?'container':l.ktrs}</h3><div class="glist">${rows}</div></div>`;
  card.hidden=false; $('cardx').onclick=()=>{ selGroup=null; select(null); };
  card.querySelectorAll('[data-gid]').forEach(b=>b.onclick=()=>{ const it=ITEMS.find(x=>x.c.id===b.dataset.gid); if(it) select(it,false,selGroup); });
}
 
const FT={tr:{h:'Maliyet (USD)',fob:'FOB',fr:'Navlun',ins:'Sigorta',cif:'CIF',t2:'Gümrük vergisi %2',e15:'İlave gümrük vergisi %15',kdv:'Gözetim farkı KDV maliyeti',st:'Liman ardiye (14 gün)',other:'TAREKS, müşavir, damga, nakliye',imp:'İthalat maliyeti (14 gün dahil)',extra:'Ek liman bekleme (bugüne kadar)',tr:'Türkiye\'ye çekilirse toplam',transit:'Transit (antrepo, yeniden ihracat)',per:'/1000',sale:'Satış fiyatı',margin:'Brüt marj (ithal senaryosu)',onlyFob:'Yalnızca FOB biliniyor; navlun ve ithalat masrafı listede yok.',stock:'Satılmamış stok (FOB)',accr:'Biriken ek liman masrafı',days:'gün',dem:'demuraj',sto:'ardiye'},
 en:{h:'Cost (USD)',fob:'FOB',fr:'Freight',ins:'Insurance',cif:'CIF',t2:'Customs duty 2%',e15:'Additional duty 15%',kdv:'Surveillance VAT cost',st:'Port storage (14 days)',other:'TAREKS, broker, stamp, haulage',imp:'Import cost (incl. 14 days)',extra:'Extra port time (to date)',tr:'Total if imported into Turkey',transit:'Transit (bonded, re-export)',per:'/1000',sale:'Selling price',margin:'Gross margin (import case)',onlyFob:'Only FOB is known; freight and import costs are not in the list yet.',stock:'Unsold stock (FOB)',accr:'Accrued extra port cost',days:'days',dem:'demurrage',sto:'storage'}};
const usd=v=>v==null?'—':new Intl.NumberFormat(lang==='tr'?'tr-TR':'en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
const usd2=v=>v==null?'—':new Intl.NumberFormat(lang==='tr'?'tr-TR':'en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(v);
function costCalc(c,st){
  const f=c.fin; if(!f||!BOARD.fin) return null; const P=BOARD.fin, k=c.qty/1000;
  const atPort=(st.ds==='liman'||st.ds==='late') && st.days!=null && ['AMB','ALI','IZM'].includes(st.at);
  const days=atPort?st.days:0, exSt=Math.max(0,days-14)*P.st_day, exDem=Math.max(0,days-(c.free||14))*P.dem_day, extra=exSt+exDem;
  const cif=f.fr!=null? f.fob+(f.fr||0)+(f.ins||0) : null;
  const imp=f.total!=null? f.total+extra : null;
  const tra=cif!=null? cif+(f.st!=null?f.st:P.st14)+extra+P.transit : null;
  const sale=f.sale_k!=null? f.sale_k*k : null;
  return {f,k,days,exSt,exDem,extra,cif,imp,tra,sale,margin:(sale!=null&&imp!=null)?sale-imp:null};
}
function finCard(c,st){
  if(STAFF) return ''; const x=costCalc(c,st); if(!x) return ''; const t=FT[lang], f=x.f, per=v=>v==null?'':` <span class="num" style="color:var(--muted)">${usd2(v/x.k)}${t.per}</span>`;
  const row=(a,v,bold)=>`<dt>${a}</dt><dd class="num"${bold?' style="font-weight:600;color:var(--fg)"':''}>${usd(v)}</dd>`;
  let h=`<div class="cs"><h3>${t.h}</h3><dl>`+row(t.fob,f.fob)+(f.fr!=null?row(t.fr,f.fr)+row(t.ins,f.ins)+row(t.cif,x.cif,1):'');
  const extraRow=x.extra?`<dt>${t.extra}</dt><dd class="num" style="color:${COL.late}">${usd(x.extra)} <span style="color:var(--muted)">(${t.sto} ${Math.max(0,x.days-14)} ${t.days}, ${t.dem} ${Math.max(0,x.days-(c.free||14))} ${t.days})</span></dd>`:'';
  if(f.total!=null){ if(f.t2) h+=row(t.t2,f.t2); if(f.e15) h+=row(t.e15,f.e15); h+=row(t.kdv,f.kdv)+row(t.st,f.st)+row(t.other,f.other)+row(t.imp,f.total,1)+extraRow; } else h+=extraRow;
  h+='</dl>'+customsBlock(c,x);
  if(f.est) h+=`<div class="src" style="color:${COL.late}">⚠ ${esc(f.est[lang==='tr'?0:1])}</div>`;
  if(f.total!=null||x.tra!=null){ h+=`<dl style="border-top:1px solid var(--line);padding-top:8px">`;
    if(x.imp!=null) h+=`<dt><b>${t.tr}</b></dt><dd class="num"><b>${usd(x.imp)}</b>${per(x.imp)}</dd>`;
    if(x.tra!=null) h+=`<dt><b>${t.transit}</b></dt><dd class="num"><b>${usd(x.tra)}</b>${per(x.tra)}</dd>`;
    if(x.sale!=null) h+=`<dt>${t.sale}</dt><dd class="num">${usd2(f.sale_k)}${t.per} · ${usd(x.sale)}</dd><dt>${t.margin}</dt><dd class="num" style="color:${x.margin>=0?COL.ithal:COL.late}">${usd(x.margin)} · ${nf1().format(x.margin/x.sale*100)}%</dd>`;
    h+='</dl>'; } else h+=`<div class="src">${t.onlyFob}</div>`;
  if(f.part) h+=`<div class="src">${esc(f.part[lang==='tr'?0:1])}</div>`;
  h+=`<div class="src">${esc(lang==='tr'?BOARD.fin.transit_tr:BOARD.fin.transit_en)}<br>${esc(lang==='tr'?BOARD.fin.rule_tr:BOARD.fin.rule_en)}</div></div>`;
  return h+payBlock(c);
}
 
const HOL=new Set(['2026-01-01','2026-03-20','2026-03-21','2026-03-22','2026-04-23','2026-05-01','2026-05-19','2026-05-27','2026-05-28','2026-05-29','2026-05-30','2026-07-15','2026-08-30','2026-10-29',
 '2027-01-01','2027-03-09','2027-03-10','2027-03-11','2027-04-23','2027-05-01','2027-05-16','2027-05-17','2027-05-18','2027-05-19','2027-07-15','2027-08-30','2027-10-29']);
function busday(serial){ let s=Math.floor(serial); for(let i=0;i<10;i++){ const d=sdate(s), wd=d.getUTCDay(); if(wd!==0&&wd!==6&&!HOL.has(d.toISOString().slice(0,10))) break; s--; } return s; }
function payNeed(c,st){ const p=c.fin&&c.fin.pay; if(!p) return null; if(p.bal<=0.5) return {paid:true,over:p.bal<-0.5};
  const ds=st?st.ds:c.st; if(ds==='yolda'||ds==='transship'){ const a=(last(c.legs)||[])[3]; if(!Number.isFinite(a)) return {kind:'arr',due:null,now:false,left:null,noeta:true}; const due=busday(a-4); return {kind:'arr',due,now:T>=due,left:Math.ceil(due-T)}; }
  if(ds==='pre'||ds==='bekliyor'||ds==='hold'){ if((p.adv||0)>0.5) return {kind:'notdue',amt:p.bal}; const pct={A:.05,B:.10,C:.10,D:.30}[p.terms]||.10; return {kind:'load',amt:Math.min(p.bal,pct*(p.total||0))}; }
  if(ds==='ithal') return {kind:'open'};
  return {kind:'rel'}; }
function payBlock(c){ const p=c.fin&&c.fin.pay; if(!p) return ''; const t=L().pay;
  const row=(a,v,st)=>`<dt>${a}</dt><dd class="num"${st?` style="${st}"`:''}>${v}</dd>`;
  const it=ITEMS.find(x=>x.c===c), d=payNeed(c,it&&it.st);
  let h=`<div class="cs"><h3>${t.h}</h3><dl>`+row(t.total,usd2(p.total));
  if(p.cn) h+=row(t.cn,'−'+usd2(p.cn)); if(p.adv) h+=row(t.adv,usd2(p.adv)); if(p.p2) h+=row(t.p2,usd2(p.p2));
  h+=row(t.bal,`<b>${usd2(p.bal)}</b>`, d&&d.kind==='rel'?`color:${COL.late}`:(p.bal<=0.5?`color:${COL.ithal}`:''));
  if(d&&d.paid) h+=row(t.need,t.paid,`color:${COL.ithal}`);
  else if(d&&d.kind==='rel') h+=row(t.need,`<b style="color:${COL.late}">${t.rel}</b>`);
  else if(d&&d.kind==='open') h+=row(t.need,`<b style="color:${COL.open}">${t.open}</b>`);
  else if(d&&d.kind==='arr'&&d.due==null) h+=row(t.need,`${t.arr} · ${lang==='tr'?'varış tarihi bekleniyor':'ETA pending'}`);
  else if(d&&d.kind==='arr') h+=row(t.need,`${fmtD(d.due,true)} · ${t.arr}${d.now?` · <b style="color:${COL.late}">${t.dueNow}</b>`:` · ${t.dueIn(d.left)}`}`, d.now?`color:${COL.late}`:'');
  else if(d&&d.kind==='load') h+=row(t.need,`<b>${t.load}: ${usd2(d.amt)}</b>`);
  else if(d&&d.kind==='notdue') h+=row(t.need,t.notdue);
  else h+=row(t.need,t.load);
  h+=`<dt>${t.status}</dt><dd>${esc(p.status)}</dd><dt>${t.terms}</dt><dd>${esc(t['t'+p.terms]||'')}</dd></dl>`;
  if(d&&d.kind==='rel') h+=`<div class="warn">${t.relD}</div>`;
  if(d&&d.over) h+=`<div class="warn">${lang==='tr'?'Listede fazla ödeme görünüyor (negatif bakiye) – teyit edilmeli.':'The list shows an overpayment (negative balance) – please confirm.'}</div>`;
  if(p.chk) h+=`<div class="warn">⚠ ${lang==='tr'?'Teyit bekleniyor – ödemeden önce bakiye finans ile doğrulanmalı.':'To be confirmed – verify the balance with finance before paying.'}</div>`;
  if(p.flag) h+=`<div class="warn">${esc(p.flag[lang==='tr'?0:1])}</div>`;
  if(!(d&&d.paid)) h+=`<div class="src">${t.calc}</div>`;
  return h+'</div>'; }
function payRows(){ const out=[]; for(const it of ITEMS){ const c=it.c, p=c.fin&&c.fin.pay; if(!p||p.bal<=0.5||!it.vis) continue; const d=payNeed(c,it.st); if(!d||d.paid) continue;
    const cat=d.kind==='rel'?'late':d.kind==='load'?'load':d.kind==='open'?'open':(d.due==null?'week':(d.due<Math.floor(T)?'late':(d.due-T<=7?'week':'later'))); if(d.kind==='notdue') continue; out.push({it,c,p,d,cat,amt:d.amt!=null?d.amt:p.bal}); } return out; }
function payView(){
  const l=L(), P=l.pv, rows=payRows(); if(!rows.length) return `<div class="empty">${P.noPay}</div>`;
  const CATS=['late','week','later','load','open'], CC={late:COL.late,week:COL.port,later:COL.yolda,load:COL.wait,open:COL.open}, S={late:0,week:0,later:0,load:0,open:0}, N={late:0,week:0,later:0,load:0,open:0};
  rows.forEach(r=>{S[r.cat]+=r.amt; N[r.cat]++;}); const tot=CATS.reduce((a,k)=>a+S[k],0)||1;
  let h=`<div class="pv"><div><h4>${P.urg}</h4><div class="ubar">${CATS.map(k=>`<i style="width:${S[k]/tot*100}%;background:${CC[k]}"></i>`).join('')}</div>
    <div class="leg">${CATS.filter(k=>N[k]).map(k=>`<div><i style="background:${CC[k]}"></i><div><b>${usd(S[k])}</b><span>${P[k]} · ${N[k]} ${l.ktrs}</span></div></div>`).join('')}</div></div>`;
  
  const bins=[{lab:P.past,v:S.late,col:COL.late}]; const w0=Math.floor(T);
  for(let w=0;w<7;w++) bins.push({lab:fmtD(w0+w*7),v:0,col:w===0?COL.port:COL.yolda});
  rows.forEach(r=>{ if(r.d.kind!=='arr'||r.cat==='late'||r.d.due==null) return; const k=r.d.due<w0?0:1+Math.floor((r.d.due-w0)/7); if(k===0) bins[0].v+=r.amt; else if(k<bins.length) bins[k].v+=r.amt; });
  const mx=Math.max(1,...bins.map(b=>b.v));
  h+=`<div><h4>${P.cal}</h4><div class="wk">${bins.map(b=>`<div><em>${b.v?nf1().format(b.v/1000)+'k':''}</em><i style="height:${b.v/mx*70}px;background:${b.col}"></i><span>${esc(b.lab)}</span></div>`).join('')}</div></div>`;
  
  const bs={}; rows.forEach(r=>{ const s=r.c.sup; (bs[s]=bs[s]||{late:0,week:0,later:0,load:0,open:0,t:0}); bs[s][r.cat]+=r.amt; bs[s].t+=r.amt; });
  const sm=Math.max(...Object.values(bs).map(x=>x.t));
  h+=`<div><h4>${P.bySup}</h4><div class="sup">${Object.entries(bs).sort((a,b)=>b[1].t-a[1].t).map(([s,x])=>`<div><span>${esc(s)}</span><span class="bar" style="width:${x.t/sm*100}%">${CATS.map(k=>x[k]?`<i style="width:${x[k]/x.t*100}%;background:${CC[k]}"></i>`:'').join('')}</span><b>${nf1().format(x.t/1e6)} mn</b></div>`).join('')}</div></div></div>`;
  
  const order={late:0,week:1,later:2,load:3,open:4};
  rows.sort((a,b)=>order[a.cat]-order[b.cat] || (a.cat==='late'?((b.it.st.days!=null?b.it.st.days:T-(b.d.due||T)))-((a.it.st.days!=null?a.it.st.days:T-(a.d.due||T))):(a.d.due||0)-(b.d.due||0)) || (a.c.ref<b.c.ref?-1:1));
  let last=null; for(const r of rows){ if(r.cat!==last){ last=r.cat; h+=`<div class="gh"><span>${P[r.cat]}</span><span>${usd(S[r.cat])}</span></div>`; }
    const sub=(r.d.kind==='rel'?(r.it.st.days!=null?P.atPort(r.it.st.days):esc(portName(r.it.st.at))):r.cat==='load'?esc(portName(r.it.st.at)):r.cat==='open'?P.openD+' · '+esc(portName(r.it.st.at)):(r.d.due==null?(lang==='tr'?'varış tarihi bekleniyor':'ETA pending'):P.dueOn(fmtD(r.d.due))))+(r.p.chk?` · <b style="color:${COL.late}">⚠ ${lang==='tr'?'teyit':'confirm'}</b>`:'');
    h+=`<button type="button" class="row" data-id="${esc(r.c.id)}"><span class="pip" style="background:${CC[r.cat]}"></span><span class="r1">${esc(r.c.ref)} · ${esc(r.c.sup)}</span><span class="m${r.cat==='late'?' late':''}">${usd(r.amt)}</span><span class="r2">${r.c.ktr?esc(r.c.ktr)+' · ':''}${sub}</span></button>`; }
  return h; }
const tl=v=>new Intl.NumberFormat(lang==='tr'?'tr-TR':'en-US',{style:'currency',currency:'TRY',currencyDisplay:'narrowSymbol',maximumFractionDigits:0}).format(v);
function customsBlock(c,x){
  const f=x.f, P=BOARD.fin; if(f.total==null||c.gross==null||f.fr==null||f.part||!P.fx_live) return '';
  const tr=lang==='tr', r=P.fx_live.rate, t2=f.t2||0, e15=f.e15||0, gz=c.gross*10, cif=x.cif||0, base=Math.max(cif,gz), kdv=0.10*(base+t2+e15);
  const lost=f.kdv!=null? f.kdv : 0.10*Math.max(0,gz-cif), ded=Math.max(0,kdv-lost), tot=t2+e15+kdv, extra=t2+e15+lost;
  const L=tr?{h:'Gümrükte ödenecek vergiler',t2:'Gümrük vergisi %2',e15:'İlave gümrük vergisi %15',kdv:'KDV %10 (gümrükte ödenen)',ded:'– indirilebilir KDV',lost:'– gözetim farkı KDV (kiloya göre, indirilemez)',tot:'Gümrükte ödenecek toplam',extra:'Geri alınamayan vergi (maliyete girer)',
      note:`Gözetim değeri: brüt ${nf().format(Math.round(c.gross))} kg × 10 $ = ${usd(gz)}; fatura değeri (CIF) ${usd(cif)}. KDV matrahı yüksek olan değer üzerinden hesaplanır; fatura ile gözetim değeri arasındaki farkın KDV'si indirilemez, ekstra vergi olarak maliyete girer.${t2||e15?' Gümrük ve ilave gümrük vergisi de maliyettir.':' Malezya menşeli (ticaret anlaşması) yükte gümrük vergisi yok; ekstra vergi sadece kiloya göre çıkan KDV farkı.'}`,
      fx:`Kur: anlık 1 $ = ${nf1().format(r)} ₺ (${esc(P.fx_live.src)}).${P.fx_tcmb?` Beyannamede TCMB döviz alış kuru esas alınır: ${nf1().format(P.fx_tcmb.buy)} ₺ (${esc(P.fx_tcmb.date)}).`:''}`}
    :{h:'Taxes payable at customs',t2:'Customs duty 2%',e15:'Additional duty 15%',kdv:'VAT 10% (paid at customs)',ded:'– deductible VAT',lost:'– surveillance VAT (by weight, not deductible)',tot:'Total payable at customs',extra:'Non-recoverable tax (goes into cost)',
      note:`Surveillance value: gross ${nf().format(Math.round(c.gross))} kg × $10 = ${usd(gz)}; invoice value (CIF) ${usd(cif)}. VAT is charged on the higher value; the VAT on the difference between invoice and surveillance value cannot be deducted and is an extra cost.${t2||e15?' Customs duty and additional duty are also costs.':' Malaysian origin (trade agreement): no customs duty; the only extra tax is the weight-based VAT difference.'}`,
      fx:`Rate: live $1 = ₺${nf1().format(r)} (${esc(P.fx_live.src)}).${P.fx_tcmb?` The customs declaration uses the CBRT buying rate: ₺${nf1().format(P.fx_tcmb.buy)} (${esc(P.fx_tcmb.date)}).`:''}`};
  const row=(a,v,st)=>`<dt${st?` style="${st}"`:''}>${a}</dt><dd class="num"${st?` style="${st}"`:''}>${usd(v)} · ${tl(v*r)}</dd>`;
  let h=`<dl style="border-top:1px solid var(--line);padding-top:8px"><dt style="grid-column:1/-1;color:var(--fg);font-weight:600">${L.h}</dt>`;
  if(t2) h+=row(L.t2,t2); if(e15) h+=row(L.e15,e15);
  h+=row(L.kdv,kdv)+row(L.ded,ded,'color:var(--muted)')+row(L.lost,lost,`color:${COL.late}`);
  h+=`<dt><b>${L.tot}</b></dt><dd class="num"><b>${usd(tot)} · ${tl(tot*r)}</b></dd>`;
  h+=`<dt><b style="color:${COL.late}">${L.extra}</b></dt><dd class="num"><b style="color:${COL.late}">${usd(extra)} · ${tl(extra*r)}</b></dd></dl>`;
  h+=`<div class="src">${L.note}<br>${L.fx}</div>`;
  return h; }
function finKpis(){
  const el=$('finkpi'); if(STAFF||!BOARD||!BOARD.fin){ el.hidden=true; return; } let stock=0, accr=0;
  for(const it of ITEMS){ const c=it.c; if(!c.fin) continue; const x=costCalc(c,it.st); if(x) accr+=x.extra;
    for(const lt of c.lots){ if((lt.cus==='MY'||lt.cus==='EXP') && c.st!=='teslim') { stock+=c.fin.fob*(lt.qty/c.qty); } } }
  const S={rel:0,arr:0,load:0,week:0,open:0,notdue:0}; let bal=0; for(const it of ITEMS){ const c=it.c, p=c.fin&&c.fin.pay; if(!p) continue; bal+=p.bal; const d=payNeed(c,it.st); if(d&&d.kind) S[d.kind]+=(d.amt!=null?d.amt:p.bal); if(d&&d.kind==='arr'&&(d.due==null||d.due-T<=7)) S.week+=p.bal; }
  const tp=L().pay; const t=FT[lang]; const tile=(v,lab,col)=>`<div class="kpi" style="cursor:default"><span class="n"${col?` style="color:${col}"`:''}>${usd(v)}</span><span class="l">${lab}</span></div>`;
  el.hidden=false; el.innerHTML=tile(S.rel,tp.kRel,COL.late)+tile(S.week,tp.kWeek,COL.port)+tile(S.arr,tp.kArr,COL.yolda)+tile(S.load,tp.kLoad,COL.wait)+`<div class="kpi" style="cursor:default"><span class="n">${usd(stock)}</span><span class="l">${t.stock}</span></div><div class="kpi" style="cursor:default"><span class="n" style="color:${COL.late}">${usd(accr)}</span><span class="l">${t.accr}</span></div><div class="src" style="grid-column:1/-1">${tp.totLine}: <b class="num">${usd(bal)}</b></div>`;
}
function selectGroup(key,fly){ const ch=selGroup!==key||selected; selected=null; fromGroup=null; selGroup=key; lastDay=null; refreshUI(true); renderCard(); if(ch) $('card').scrollTop=0;
  const g=GROUPS.get(key); if(g && fly) flyTo(g.base.clone().normalize()); }
function select(it,fly,from){
  const ch=it!==selected; selected=it; fromGroup=from||null; if(it||!from) selGroup=null; lastDay=null; refreshUI(true); renderCard(); if(ch) $('card').scrollTop=0;
  if(it && fly){ layout(); flyTo(it.mesh.position.clone().normalize()); }
}
let flyAnim=null; const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function flyTo(dir){ if(!GL) return; const d0=camera.position.length(), d1=Math.min(d0,1.9), a=camera.position.clone().normalize(), b=dir.clone();
  if(reduce){ camera.position.copy(b.multiplyScalar(d1)); return; } flyAnim={a,b,d0,d1,t0:performance.now()}; }


 
const OZ={tr:{vOzet:'Özet',h:'Ürün bazında toplam',q:'Toplam adet',cus:'Müşteri bazında',m:'Aylara göre varış',ay:'Ay',arr:'Varmış',noEta:'Tarih bekleniyor',sz:'Beden dağılımı (görünen konteynerler)'},
 en:{vOzet:'Summary',h:'Totals by product',q:'Total pcs',cus:'By customer',m:'Arrivals by month',ay:'Month',arr:'Arrived',noEta:'Date pending',sz:'Size breakdown (visible containers)'}};
for(const k of ['tr','en']) I[k].vOzet=OZ[k].vOzet;
const VIEWS=['ktr','grp','ozet','fiy','pay'];
{ const hv=location.hash.replace('#',''); if(VIEWS.includes(hv)&&hv!=='pay') view=hv; VIEWS.forEach(k=>{ const b=$('v-'+k); if(b) b.setAttribute('aria-pressed',k===view); }); }
function ozetView(){ const x=OZ[lang]; const vis=ITEMS.filter(i=>i.vis); const byP={}, byC={}, byM={}, sz={}; let tq=0, ts=0;
  for(const it of vis){ const c=it.c, g=groupOf(it.st.ds), pairs=c.unit==='pairs'; const p=byP[c.prd]=byP[c.prd]||{n:0,q:0,pairs,g:{yolda:0,liman:0,antrepo:0,teslim:0,bekliyor:0},sz:{}}; p.n++; p.q+=c.qty; p.g[g]+=c.qty; if(pairs) ts+=c.qty; else tq+=c.qty;
    for(const lt of c.lots){ const cn=cusName(lt.cus); const cc=byC[cn]=byC[cn]||{n:0,q:0,s:0}; cc.n++; if(pairs) cc.s+=lt.qty||0; else cc.q+=lt.qty||0; for(const [k,v] of Object.entries(lt.sizes||{})){ p.sz[k]=(p.sz[k]||0)+v; if(!pairs) sz[k]=(sz[k]||0)+v; } }
    const eta=c.legs.length?last(c.legs)[3]:null; const d=Number.isFinite(eta)?sdate(eta):null; const key=d?`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`:'—'; const m=byM[key]=byM[key]||{n:0,q:0,arr:0}; m.n++; m.q+=c.qty; if(it.st.done) m.arr+=c.qty; }
  const fq=(v,pairs)=>pairs?`${nf().format(v)} ${L().pairs}`:`${nf1().format(v/1e6)} mn`;
  const szs=o=>Object.keys(o).sort((a,b)=>(parseFloat(a)||['XS','S','M','L','XL'].indexOf(a))-(parseFloat(b)||['XS','S','M','L','XL'].indexOf(b))).filter(k=>o[k]).map(k=>`<span>${esc(k)} ${nf().format(o[k])}</span>`).join('');
  let h=`<div class="pv"><h4>${x.h} · ${vis.length} ${L().ktr} · ${nf1().format(tq/1e6)} ${L().mn}${ts?` · ${nf().format(ts)} ${L().pairs}`:''}</h4>`;
  for(const [k,p] of Object.entries(byP).sort((a,b)=>b[1].q-a[1].q)) h+=`<div class="ocard"><b>${esc(prdName(k))}</b><div class="gstats"><div><b>${p.n}</b><span>${L().ktr}</span></div><div><b>${fq(p.q,p.pairs)}</b><span>${x.q}</span></div><div><b>${fq(p.g.liman+p.g.antrepo,p.pairs)}</b><span>${L().k.liman}</span></div><div><b>${fq(p.g.yolda,p.pairs)}</b><span>${L().k.yolda}</span></div><div><b>${fq(p.g.bekliyor,p.pairs)}</b><span>${L().k.bekliyor}</span></div></div><div class="sizes">${szs(p.sz)}</div></div>`;
  h+=`<h4>${x.cus}</h4><table class="lots"><thead><tr><th>${L().byCus}</th><th class="r">${L().ktr}</th><th class="r">${x.q}</th></tr></thead><tbody>`+Object.entries(byC).sort((a,b)=>(b[1].q+b[1].s)-(a[1].q+a[1].s)).map(([k,v])=>`<tr><td>${esc(k)}</td><td class="r num">${v.n}</td><td class="r num">${v.q?num(v.q):''}${v.s?` ${num(v.s)} ${L().pairs}`:''}</td></tr>`).join('')+`</tbody></table>`;
  h+=`<h4>${x.m}</h4><table class="lots"><thead><tr><th>${x.ay}</th><th class="r">${L().ktr}</th><th class="r">${x.q}</th><th class="r">${x.arr}</th></tr></thead><tbody>`;
  for(const [k,m] of Object.entries(byM).sort()){ const lab=k==='—'?x.noEta:`${L().months[+k.split('-')[1]-1]} ${k.split('-')[0]}`; h+=`<tr><td>${lab}</td><td class="r num">${m.n}</td><td class="r num">${num(m.q)}</td><td class="r num">${num(m.arr)}</td></tr>`; }
  h+=`</tbody></table><h4>${x.sz}</h4><div class="sizes">${szs(sz)}</div></div>`; return h; }

 
const FL={tr:{v:'Fiyat listesi',tabL:'Fiyat listesi',tabK:'Üretici karşılaştırma',h:'EZGİ fiyat listesi (iç)',ay:'Dönem',val:'Geçerlilik',
  none:'Yönetim verisinde fiyat listesi yok (fiyat_listesi alanı üretilmedi).',fab:'Fabrika FOB',mus:'Müşteri FOB',marj:'Marj',k:'/1000',tmF:'İç teslim',
  tH:'İç tahmini teslim (fabrika FOB, ek masraf payı yok)',c1:'$ / 1000',c2:'Konteyner',fob:'Fabrika FOB',fr:'Navlun + sigorta',ver:'Vergi / gözetim farkı KDV',st:'Liman ardiye (14 gün)',oth:'Diğer (gümrükleme, TAREKS, damga, nakliye)',tot:'Tahmini teslim',
  mH:'Marj ve müşteri tarafı',mFob:'FOB marjı / konteyner',mEk:'Ek masraf payı / konteyner',mTop:'Toplam ek gelir / konteyner',mMus:'Müşteriye tahmini teslim (EZGİ sayfası)',mFark:'Fark (müşteri − iç teslim)',
  sup:'Üretici',g:'Ağırlık',per:'Konteyner',pcs:'adet',prod:'Üretim',eta:'Tahmini varış',src:'Tahmin kaynağı',kg:'brüt',
  kH:'Üretici karşılaştırma (iç)',kSub:'Aynı ürün, üreticiye göre: fabrika FOB ve iç tahmini teslim maliyetiyle. Ucuz olan yeşil.',kFab:'Fabrika FOB $/1000',kTm:'İç teslim $/1000',kTot:'İç teslim / konteyner',kMus:'Müşteri FOB $/1000',kMt:'Müşteriye teslim $/1000',kPer:'Adet / konteyner',
  kBest:'daha ucuz',kOnly:u=>`yalnız ${u}`,kSame:'İki üreticinin iç teslim maliyeti aynı.',kDiff:(u,d,p)=>`<b>${u}</b> iç teslimde ${d} /1000 (%${p}) daha ucuz.`,kFobDiff:(u,d,p)=>`Fabrika FOB'da ${u} ${d} /1000 (%${p}) daha ucuz.`,
  note:'Tahmini: son sevkiyatların ortalama navlun ve masraflarına göre, mevcut siparişlerle aynı formül (build_musteri.py). Müşteri FOB = fabrika FOB + kâr; müşteriye teslime konteyner başı ek masraf payı dahildir. Fabrika fiyatı ve marj yalnız bu iç sayfada görünür.',
  upd:'Üretildi'},
 en:{v:'Price list',tabL:'Price list',tabK:'Manufacturer comparison',h:'EZGİ price list (internal)',ay:'Period',val:'Valid',
  none:'No price list in the management data (fiyat_listesi field not generated).',fab:'Factory FOB',mus:'Customer FOB',marj:'Margin',k:'/1000',tmF:'Internal landed',
  tH:'Internal estimated landed cost (factory FOB, no extra charge share)',c1:'$ / 1000',c2:'Container',fob:'Factory FOB',fr:'Freight + insurance',ver:'Taxes / surveillance VAT',st:'Port storage (14 days)',oth:'Other (clearance, TAREKS, stamp, haulage)',tot:'Estimated landed',
  mH:'Margin and customer side',mFob:'FOB margin / container',mEk:'Extra charge share / container',mTop:'Total extra income / container',mMus:'Customer est. landed (EZGİ page)',mFark:'Difference (customer − internal)',
  sup:'Manufacturer',g:'Weight',per:'Container',pcs:'pcs',prod:'Production',eta:'Est. arrival',src:'Estimate source',kg:'gross',
  kH:'Manufacturer comparison (internal)',kSub:'Same product by manufacturer: factory FOB and internal estimated landed cost. Cheaper one in green.',kFab:'Factory FOB $/1000',kTm:'Internal landed $/1000',kTot:'Internal landed / container',kMus:'Customer FOB $/1000',kMt:'Customer landed $/1000',kPer:'Pcs / container',
  kBest:'cheaper',kOnly:u=>`${u} only`,kSame:'Both manufacturers have the same internal landed cost.',kDiff:(u,d,p)=>`<b>${u}</b> is ${d} /1000 (${p}%) cheaper landed.`,kFobDiff:(u,d,p)=>`Factory FOB: ${u} is ${d} /1000 (${p}%) cheaper.`,
  note:'Estimate: average freight and charges of recent shipments, same formula as current orders (build_musteri.py). Customer FOB = factory FOB + margin; customer landed includes the per-container extra charge share. Factory price and margin are shown only on this internal page.',
  upd:'Generated'}};
for(const k of ['tr','en']) I[k].vFiy=FL[k].v;
function flAy(s,ay){ if(!s) return '—'; if(ay){ const [y,m]=String(s).split('-'); return `${L().months[+m-1]} ${y}`; } const d=new Date(s+'T00:00:00Z'); return isNaN(d)?esc(s):`${d.getUTCDate()} ${L().months[d.getUTCMonth()]} ${d.getUTCFullYear()}`; }
function flTabs(){ const x=FL[lang], k=window.__flTab==='kar'; return `<div class="seg fl-tabs" role="group"><button type="button" class="fl-tab" data-t="fiy" aria-pressed="${!k}">${x.tabL}</button><button type="button" class="fl-tab" data-t="kar" aria-pressed="${k}">${x.tabK}</button></div>`; }
function flBaslik(t){ return `${esc(t.urun)} · ${esc(t.marka||'')} <small>· ${esc(t.uretici)}</small>`; }
function flView(){ const F=BOARD&&BOARD.fiyat_listesi; if(!F) return `<div class="empty">${FL[lang].none}</div>`; return window.__flTab==='kar'?flKar(F):flListe(F); }
function flListe(F){ const x=FL[lang], tl=F.kalemler||[];
  let h=`<div class="pv fl">${flTabs()}<h4>${x.h}${F.ay?` · ${x.ay} ${esc(F.ay)}`:''}</h4>${F.gecerlilik?`<div class="src">${x.val}: ${esc(F.gecerlilik)}</div>`:''}`;
  if(!tl.length) return h+`<div class="empty">${x.none}</div></div>`;
  for(const t of tl){ const a=t.tm_fab, m=t.tm_mus;
    h+=`<div class="ocard"><b>${flBaslik(t)}</b><div class="src">${esc(prdName(t.urun))}</div><div class="gstats g4"><div><b>${usd2(t.fab_k)}</b><span>${x.fab} ${x.k}</span></div><div><b>${usd2(t.mus_k)}</b><span>${x.mus} ${x.k}</span></div><div><b class="mj">${usd2(t.marj_k)}</b><span>${x.marj} ${x.k}</span></div><div><b>${a?usd2(a.k.total):'—'}</b><span>${x.tmF} ${x.k}</span></div></div>`;
    if(a){ const r=(lab,k,v,cl)=>`<tr${cl?` class="${cl}"`:''}><td>${lab}</td><td class="r num">${usd2(k)}</td><td class="r num">${usd(v)}</td></tr>`;
      h+=`<table class="lots"><thead><tr><th>${x.tH}</th><th class="r">${x.c1}</th><th class="r">${x.c2}</th></tr></thead><tbody>`+r(x.fob,a.k.fob,a.fob)+r(x.fr,a.k.fr_ins,a.fr_ins)+r(x.ver,a.k.vergi,a.vergi)+r(x.st,a.k.st,a.st)+r(x.oth,a.k.other,a.other)+r(x.tot,a.k.total,a.total,'t')+`</tbody></table>`;
      h+=`<table class="lots"><thead><tr><th>${x.mH}</th><th class="r">${x.c1}</th><th class="r">${x.c2}</th></tr></thead><tbody>`
        +`<tr><td>${x.mFob}</td><td class="r num mj">${usd2(t.marj_k)}</td><td class="r num mj">${usd(t.marj_ktr)}</td></tr>`
        +`<tr><td>${x.mEk}</td><td class="r num">${usd2(t.ek_ktr/(t.adet_konteyner/1000))}</td><td class="r num">${usd(t.ek_ktr)}</td></tr>`
        +`<tr class="t"><td>${x.mTop}</td><td class="r num mj">${usd2(t.kazanc_ktr/(t.adet_konteyner/1000))}</td><td class="r num mj">${usd(t.kazanc_ktr)}</td></tr>`
        +(m?`<tr><td>${x.mMus}</td><td class="r num">${usd2(m.k.total)}</td><td class="r num">${usd(m.total)}</td></tr><tr><td>${x.mFark}</td><td class="r num">${usd2(t.fark_k)}</td><td class="r num">${usd(t.fark_ktr)}</td></tr>`:'')+`</tbody></table>`; }
    const kn=t.kaynak; h+=`<div class="src">${x.sup}: ${esc(t.uretici)}${t.mense?` (${esc(t.mense)})`:''}${t.g?` · ${x.g} ${nf1().format(t.g)} g`:''}${t.adet_konteyner?` · ${x.per}: ${num(t.adet_konteyner)} ${x.pcs}${t.koli?` / ${num(t.koli)}`:''}`:''} · ${x.prod} ${flAy(t.uretim,t.uretim_ay)} · ${x.eta} ${flAy(t.varis,t.varis_ay)}`
      +((lang==='tr'?t.not_tr:t.not_en)?`<br>${esc(lang==='tr'?t.not_tr:t.not_en)}`:'')
      +(kn&&kn.kademe?`<br>${x.src}: ${esc(kn.kademe)} · ${esc((kn.konteynerler||[]).join(', '))}${kn.gross?` · ${x.kg} ${num(Math.round(kn.gross))} kg`:''}`:'')+`</div></div>`; }
  if(F.not_tr||F.not_en) h+=`<div class="src">${esc(lang==='tr'?F.not_tr:F.not_en)}</div>`;
  return h+`<div class="src">${x.note}${F.kaynak?`<br>${esc(F.kaynak)}`:''}${F.uretildi?`<br>${x.upd}: ${fmtTs(F.uretildi)}`:''}</div></div>`; }
function flKar(F){ const x=FL[lang], tl=F.kalemler||[], gr=F.karsilastirma||[];
  let h=`<div class="pv fl">${flTabs()}<h4>${x.kH}${F.ay?` · ${x.ay} ${esc(F.ay)}`:''}</h4><div class="src">${x.kSub}</div>`;
  if(!gr.length) return h+`<div class="empty">${x.none}</div></div>`;
  const ures=[...new Set(tl.map(t=>t.uretici))]; const pct=(a,b)=>nf1().format(Math.round((b-a)/b*1000)/10); const val=t=>t.tm_fab?t.tm_fab.k.total:t.fab_k;
  for(const g of gr){ const ts=ures.map(u=>tl.find(t=>t.uretici===u&&g.ids.includes(t.id))).filter(Boolean); if(!ts.length) continue;
    let best=null; if(ts.length>1){ const s=ts.slice().sort((a,b)=>val(a)-val(b)); if(val(s[0])<val(s[1])) best=s[0]; }
    h+=`<div class="ocard"><b>${esc(lang==='tr'?g.tr:g.en)}</b>${ts.length===1?`<div><span class="chip">${esc(x.kOnly(ts[0].uretici))}</span></div>`:''}`;
    const hd=ts.map(t=>`<th class="r${t===best?' best':''}">${esc(t.uretici)}${t===best?`<br><span class="chip ok">✓ ${x.kBest}</span>`:''}</th>`).join('');
    const row=(lab,f)=>`<tr><td>${lab}</td>${ts.map(t=>`<td class="r num${t===best?' best':''}">${f(t)}</td>`).join('')}</tr>`;
    h+=`<table class="lots"><thead><tr><th></th>${hd}</tr></thead><tbody>`+row(x.kFab,t=>usd2(t.fab_k))+row(x.kTm,t=>t.tm_fab?`<b>${usd2(t.tm_fab.k.total)}</b>`:'—')+row(x.kTot,t=>t.tm_fab?usd(t.tm_fab.total):'—')
      +row(x.kPer,t=>t.adet_konteyner?num(t.adet_konteyner):'—')+row(x.g,t=>t.g?nf1().format(t.g)+' g':'—')+row(x.kMus,t=>usd2(t.mus_k))+row(x.kMt,t=>t.tm_mus?usd2(t.tm_mus.k.total):'—')
      +row(x.prod,t=>flAy(t.uretim,t.uretim_ay))+row(x.eta,t=>flAy(t.varis,t.varis_ay))+`</tbody></table>`;
    if(ts.length>1){ const s=ts.slice().sort((a,b)=>val(a)-val(b)), lo=s[0], hi=s[s.length-1];
      h+=`<div class="src">`+(best?x.kDiff(esc(lo.uretici),usd2(val(hi)-val(lo)),pct(val(lo),val(hi))):x.kSame);
      const f=ts.slice().sort((a,b)=>a.fab_k-b.fab_k); if(f[0].fab_k<f[f.length-1].fab_k) h+=`<br>`+x.kFobDiff(esc(f[0].uretici),usd2(f[f.length-1].fab_k-f[0].fab_k),pct(f[0].fab_k,f[f.length-1].fab_k));
      h+=`</div>`; }
    h+=`</div>`; }
  return h+`<div class="src">${x.note}</div></div>`; }
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('.fl-tab'); if(!b) return; window.__flTab=b.dataset.t; refreshUI(true); const p=$('panel'); if(p) p.scrollTop=0; });

 
let stageOff=false;
if(GL){
  if('IntersectionObserver' in window) new IntersectionObserver(es=>{ stageOff=!es[es.length-1].isIntersecting; }).observe(stage);
  if(window.matchMedia&&matchMedia('(pointer:coarse)').matches){
    renderer.domElement.style.touchAction='pan-y';
    let t1=null; const yEks=new THREE.Vector3(0,1,0);
    stage.addEventListener('touchstart',e=>{ if(e.touches.length===1){ t1={x:e.touches[0].clientX,y:e.touches[0].clientY,m:''}; e.stopPropagation(); } else t1=null; },{capture:true,passive:true});
    stage.addEventListener('touchmove',e=>{ if(!t1||e.touches.length!==1) return; e.stopPropagation(); const p=e.touches[0], dx=p.clientX-t1.x, dy=p.clientY-t1.y;
      if(!t1.m){ if(Math.abs(dx)<8&&Math.abs(dy)<8) return; t1.m=Math.abs(dx)>Math.abs(dy)?'h':'v'; }
      if(t1.m==='h'){ flyAnim=null; camera.position.applyAxisAngle(yEks,-dx/Math.max(1,stage.clientWidth)*Math.PI*0.9); controls.update(); }
      t1.x=p.clientX; t1.y=p.clientY; },{capture:true,passive:true});
    stage.addEventListener('touchend',e=>{ if(t1){ e.stopPropagation(); if(e.touches.length===0) t1=null; } },{capture:true,passive:true});
    stage.addEventListener('touchcancel',()=>{ t1=null; },{capture:true,passive:true});
  }
}
 
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{ lang=b.dataset.lang; try{localStorage.setItem('gl-lang',lang);}catch(e){} applyI18n(); }));
$('kpis').addEventListener('click',e=>{ const b=e.target.closest('.kpi'); if(!b) return; filters[b.dataset.g]=filters[b.dataset.g]?0:1; refreshUI(true); });
$('list').addEventListener('click',e=>{ const b=e.target.closest('.row'); if(!b) return; if(b.dataset.gk){ const g=GROUPS.get(b.dataset.gk); if(g&&g.list.length===1) select(g.list[0],true); else selectGroup(b.dataset.gk,true); return; } const it=ITEMS.find(x=>x.c.id===b.dataset.id); if(it) select(it,true); });
VIEWS.forEach(v=>$('v-'+v).addEventListener('click',()=>{ view=v; VIEWS.forEach(k=>$('v-'+k).setAttribute('aria-pressed',k===v)); refreshUI(true); }));
$('q').addEventListener('input',e=>{ query=fold(e.target.value.trim()); refreshUI(true); });
$('t').addEventListener('input',e=>{ T=+e.target.value+0.5; playing=false; $('play').textContent='▶'; refreshUI(true); });
$('today').addEventListener('click',()=>{ T=serialNow(); refreshUI(true); });
let playing=false; $('play').addEventListener('click',()=>{ playing=!playing; if(playing && T>=+$('t').max) T=+$('t').min; $('play').textContent=playing?'❚❚':'▶'; });
const ray=GL?new THREE.Raycaster():null, mouse=GL?new THREE.Vector2():null; let down=null;
if(GL){
function pickAt(cx,cy){ const r=renderer.domElement.getBoundingClientRect(); mouse.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1); ray.setFromCamera(mouse,camera);
  const vis=ITEMS.filter(i=>i.vis); let hitIt=null; const hit=ray.intersectObjects(vis.map(i=>i.mesh),false)[0]; if(hit) hitIt=vis.find(i=>i.mesh===hit.object);
  if(!hitIt){ let best=COARSE?30:24; const cd=camera.position.clone().normalize(), q=new THREE.Vector3();
    for(const i of vis){ if(i.mesh.position.clone().normalize().dot(cd)<0.15) continue; q.copy(i.mesh.position).project(camera);
      const d=Math.hypot((q.x+1)/2*r.width-(cx-r.left),(1-q.y)/2*r.height-(cy-r.top)); if(d<best){best=d;hitIt=i;} } }
  return hitIt; }
renderer.domElement.addEventListener('pointerdown',e=>{ flyAnim=null; down=e.isPrimary?[e.clientX,e.clientY,e.pointerId,pickAt(e.clientX,e.clientY)]:null; if(down){ try{ renderer.domElement.setPointerCapture(e.pointerId); }catch(err){} } });
renderer.domElement.addEventListener('pointerup',e=>{ if(!down||e.pointerId!==down[2]){ down=null; return; } const moved=Math.hypot(e.clientX-down[0],e.clientY-down[1]); const hitIt=down[3]; down=null; if(moved>(e.pointerType==='mouse'?6:14)) return;
  if(!hitIt){ select(null); return; } const g=GROUPS.get(hitIt.gk); if(g&&g.list.length>1) selectGroup(hitIt.gk,false); else select(hitIt,false); });
renderer.domElement.addEventListener('pointermove',e=>{ if(down) return; const r=renderer.domElement.getBoundingClientRect(); mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1); ray.setFromCamera(mouse,camera);
  renderer.domElement.style.cursor=ray.intersectObjects(ITEMS.filter(i=>i.vis).map(i=>i.mesh),false).length?'pointer':'grab'; });
renderer.domElement.addEventListener('pointercancel',()=>{ down=null; });
}
function resize(){ const w=stage.clientWidth, h=stage.clientHeight; renderer.setSize(w,h,false); renderer.domElement.style.width=w+'px'; renderer.domElement.style.height=h+'px'; camera.aspect=w/Math.max(1,h); camera.updateProjectionMatrix(); }
if(GL){ new ResizeObserver(resize).observe(stage); resize(); }

let lastNow=performance.now(); const pv=new Vec3(); const markerEls=new Map(); let mDown=null;
function openKey(key){ const gg=GROUPS.get(key); if(!gg) return; if(gg.list.length===1) select(gg.list[0],true); else selectGroup(key,true); }
window.addEventListener('pointerup',ev=>{ if(!mDown||ev.pointerId!==mDown.id) return; const m=mDown; mDown=null; if(Math.hypot(ev.clientX-m.x,ev.clientY-m.y)<=(ev.pointerType==='mouse'?8:18)) openKey(m.key); });
window.addEventListener('pointercancel',()=>{ mDown=null; });
function frame(now){
  const dt=Math.min(.1,(now-lastNow)/1000); lastNow=now;
  if(playing){ T+=dt*5; if(T>=+$('t').max){ T=+$('t').max; playing=false; $('play').textContent='▶'; } refreshUI(false); }
  if(!GL||(stageOff&&!flyAnim)){ requestAnimationFrame(frame); return; }
  if(flyAnim){ const k=Math.min(1,(now-flyAnim.t0)/1100), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; const d=flyAnim.a.clone().lerp(flyAnim.b,e).normalize(); camera.position.copy(d.multiplyScalar(flyAnim.d0+(flyAnim.d1-flyAnim.d0)*e)); if(k>=1) flyAnim=null; }
  controls.update(); sun.position.copy(camera.position).applyAxisAngle(new THREE.Vector3(0,1,0),0.6).add(new THREE.Vector3(0,1.5,0));
  layout();
  const cd=camera.position.clone().normalize(), w=stage.clientWidth, h=stage.clientHeight;
  const placed=[];
  
  const seen=new Set();
  for(const [key,g] of GROUPS){ let el=markerEls.get(key); if(!el){ el=document.createElement('button'); el.type='button'; el.className='gm'; el.addEventListener('pointerdown',ev=>{ mDown={key,x:ev.clientX,y:ev.clientY,id:ev.pointerId}; flyAnim=null; }); el.addEventListener('click',ev=>{ ev.stopPropagation(); if(ev.detail===0) openKey(key); }); labelsEl.appendChild(el); markerEls.set(key,el); }
    seen.add(key); const v=g.base.clone().normalize(); if(v.dot(cd)<0.15){ el.style.display='none'; continue; }
    pv.copy(v).multiplyScalar(1.01).project(camera); let x=(pv.x+1)/2*w, y=(1-pv.y)/2*h;
    const MW=COARSE?36:30, MH=COARSE?34:28; {  
      const x0=x, y0=y, cand=[[0,0]]; for(let k=1;k<=8;k++) cand.push([0,-MH*k],[0,MH*k],[MW*k,0],[-MW*k,0],[MW*k,-MH*k],[-MW*k,-MH*k],[MW*k,MH*k],[-MW*k,MH*k]);
      const lo=MH/2+3, hi=h-MH/2-3, xl=MW/2+3, xh=w-MW/2-3; let best=null;
      for(const c of cand){ const cx=x0+c[0], cy=y0+c[1]; if(cx<xl||cx>xh||cy<lo||cy>hi) continue; if(!placed.some(r=>r.m&&Math.abs(r.x-cx)<MW&&Math.abs(r.y-cy)<MH)){ best=[cx,cy]; break; } }
      if(best){ x=best[0]; y=best[1]; } else { x=Math.min(Math.max(x,xl),xh); y=Math.min(Math.max(y,lo),hi); } }
    const n=g.list.length, ds=g.kind==='ship'?'yolda':g.list.map(i=>i.st.ds).sort((a,b)=>g.list.filter(i=>i.st.ds===b).length-g.list.filter(i=>i.st.ds===a).length)[0];
    if(el.textContent!==String(n)) el.textContent=n; el.style.background=COL[ds]||COL.wait; el.classList.toggle('ship',g.kind==='ship'); el.setAttribute('aria-current',key===selGroup||(selected&&selected.gk===key));
    const tt=groupLabel(g)+' · '+n+' '+(n===1&&lang==='en'?'container':L().ktrs); if(el.title!==tt){ el.title=tt; el.setAttribute('aria-label',tt); }
    el.style.display='block'; el.style.left=x+'px'; el.style.top=y+'px'; placed.push({x,y,w:MW,h:MH,m:1}); }
  for(const [key,el] of markerEls){ if(!seen.has(key)) el.style.display='none'; }
  
  const order=Object.keys(labelEls).sort((a,b)=>(PORTS[b][4]?2:0)-(PORTS[a][4]?2:0));
  for(const k of order){ const p=PORTS[k], v=v3(p[0],p[1]); const el=labelEls[k]; if(v.dot(cd)<0.2){ el.style.display='none'; continue; }
    pv.copy(v).project(camera); const x=(pv.x+1)/2*w, y=(1-pv.y)/2*h, lw=el.textContent.length*7+14;
    const lx=x+8, hit=placed.some(r=>r.m? (lx<r.x+r.w/2 && lx+lw>r.x-r.w/2 && Math.abs(y-r.y)<18) : (lx<r.x+r.w && lx+lw>r.x && Math.abs(y-r.y)<13));
    if(hit||lx+lw+10>w){ el.style.display='none'; continue; }   
    el.style.display='block'; el.style.left=x+'px'; el.style.top=y+'px'; placed.push({x:lx,y,w:lw,h:12}); }
  renderer.render(scene,camera); requestAnimationFrame(frame);
}

 
let firstBoard=true;
function setRange(){ let mn=Infinity, mx=-Infinity; for(const c of BOARD.containers) for(const lg of (c.legs||[])){ if(Number.isFinite(lg[2])) mn=Math.min(mn,lg[2]); if(Number.isFinite(lg[3])) mx=Math.max(mx,lg[3]); }
  const now=Math.floor(serialNow()); if(!isFinite(mn)){ mn=now-60; mx=now+60; } mn=Math.floor(Math.min(mn,now-30))-3; mx=Math.ceil(Math.max(mx+21,now+45));
  $('t').min=mn; $('t').max=mx; ticks(); }
const KNOWN=k=>!!(PORTS[k]||NODES[k]);
function sanitize(b0){ const b=Object.assign({},b0); b.customers=(b.customers&&typeof b.customers==='object')?b.customers:{}; b.products=(b.products&&typeof b.products==='object')?b.products:{};
  const out=[], seen=new Set(); let n=0;
  for(const c0 of b.containers){ if(!c0||typeof c0!=='object') continue; const c=Object.assign({},c0); n++;
    if(!c.id) c.id=c.ktr||c.ref||('x'+n); if(seen.has(c.id)) continue; seen.add(c.id);
    c.lots=(Array.isArray(c.lots)&&c.lots.length?c.lots:[{cus:'',sizes:{},qty:c.qty,ctn:c.ctn,gross:null}]).map(l=>Object.assign({},l||{},{sizes:(l&&l.sizes&&typeof l.sizes==='object')?l.sizes:{}}));
    c.legs=(Array.isArray(c.legs)?c.legs:[]).filter(l=>Array.isArray(l)&&l.length>=4&&KNOWN(l[0])&&KNOWN(l[1])).map(l=>[l[0],l[1],Number.isFinite(l[2])?l[2]:null,Number.isFinite(l[3])?l[3]:null,l[4]]);
    if(!c.st) c.st=c.legs.length?'liman':'bekliyor';
    if(!KNOWN(c.at)) c.at=c.legs.length?last(c.legs)[1]:(KNOWN(c.dest)?c.dest:'AMB');
    out.push(c); }
  b.containers=out; return b; }
function setBoard(b){ if(!b||!Array.isArray(b.containers)){ $('asof').textContent=''; $('list').innerHTML=`<div class="empty">${esc(L().noData)}</div>`; return; }
  const prev=BOARD, prevSel=selected&&selected.c.id;
  try{ BOARD=sanitize(b); setRange(); if(firstBoard){ firstBoard=false; T=Math.min(+$('t').max,Math.max(+$('t').min,serialNow())); } buildItems(); setAsof();
    if(prevSel) selected=ITEMS.find(i=>i.c.id===prevSel)||null; lastDay=null; refreshUI(true); }
  catch(err){ console.error('setBoard',err); BOARD=prev; selected=null; try{ if(prev){ buildItems(); lastDay=null; refreshUI(true); } }catch(e2){} $('asof').textContent=(lang==='tr'?'Veri hatası – son geçerli görünüm: ':'Data error – last valid view: ')+String(err&&err.message||err); } }
T=Math.min(+$('t').max,Math.max(+$('t').min,serialNow()));
applyI18n(); requestAnimationFrame(frame);
(function(){
   
  function bos(m){ $('asof').textContent=''; $('list').innerHTML='<div class="empty">'+esc(m)+'</div>'; }
  window.addEventListener('message',function(e){
    if(e.source!==window.parent) return;
    const d=e.data||{};
    if(d.tip==='eldiven-board') setBoard(d.board);
    else if(d.tip==='eldiven-hata') bos(d.mesaj||L().noData);
  });
  if(window.parent&&window.parent!==window) window.parent.postMessage({tip:'eldiven-hazir'},'*');
})();
})();
