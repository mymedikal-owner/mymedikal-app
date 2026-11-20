


(function () {
  'use strict';
  var HEDEF = '*';   
  window.addEventListener('message', function (e) {
    if (e.source !== window.parent || !e.data || e.data.mm !== 'html' || typeof e.data.html !== 'string') return;
    var ss = e.data.ss && typeof e.data.ss === 'object' ? e.data.ss : {};
    var kabukJs = '<script>(function(){var s=' + JSON.stringify(ss).replace(/</g, '\\u003c') + ',P=window.parent;' +
      'var o={getItem:function(k){return Object.prototype.hasOwnProperty.call(s,k)?s[k]:null},setItem:function(k,v){s[k]=String(v);P.postMessage({mm:"ss",ss:s},"' + HEDEF + '")},removeItem:function(k){delete s[k];P.postMessage({mm:"ss",ss:s},"' + HEDEF + '")}};' +
      'try{Object.defineProperty(window,"sessionStorage",{value:o,configurable:true})}catch(x){}' +
      'var y=parseInt(s.__y,10)||0,t=0;' +
      'window.addEventListener("load",function(){P.postMessage({mm:"yuklendi"},"' + HEDEF + '");if(y)setTimeout(function(){window.scrollTo(0,y)},350)});' +
      'window.addEventListener("scroll",function(){clearTimeout(t);t=setTimeout(function(){s.__y=String(Math.round(window.pageYOffset));P.postMessage({mm:"ss",ss:s},"' + HEDEF + '")},300)},{passive:true});' +
      'document.addEventListener("click",function(ev){var a=ev.target.closest&&ev.target.closest("a[href]");if(a&&!/^#/.test(a.getAttribute("href")))ev.preventDefault()});' +
      '})();<\/script>' +
      

      '<style>body::before{height:0!important}.ust{top:0!important}.sekmeler{padding-bottom:6px!important}#detay{padding-bottom:20px!important}body{padding-bottom:var(--mm-alt,84px)!important}</style>' +
       
      '<script>(function(){function o(){var l=document.querySelectorAll(".sekmeler"),m=0;for(var i=0;i<l.length;i++){var r=l[i].getBoundingClientRect();if(r.height>m&&getComputedStyle(l[i]).position==="fixed")m=r.height}' +
      'document.documentElement.style.setProperty("--mm-alt",((m||48)+24)+"px")}' +
      'window.addEventListener("load",function(){o();setTimeout(o,400);setTimeout(o,1500)});window.addEventListener("resize",o);setInterval(o,700)})();<\/script>';
    var h = e.data.html;
    var i = h.indexOf('<head');
    var j = i >= 0 ? h.indexOf('>', i) + 1 : 0;
    
    var dilJs = /[?&]dil=en\b/.test(location.search) ? '<script src="pano-en.js"><\/script>' : '';
    h = h.slice(0, j) + kabukJs + dilJs + h.slice(j);
    document.open(); document.write(h); document.close();
  });
  window.parent.postMessage({ mm: 'hazir' }, HEDEF);
})();
