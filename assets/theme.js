(function(){
  var money=function(c){return '$'+(c/100).toFixed(2);};
  function starHTML(avg){var p=Math.round((avg/5)*100);return '<span class="stars" style="--p:'+p+'%"><span class="fill"></span></span>';}
  function toast(m){var t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('show');},1900);}

  /* ---------- reviews ---------- */
  function reviews(){return window.BANFANA_REVIEWS||{};}
  function fillCardBadges(){
    document.querySelectorAll('[data-review-handle]').forEach(function(el){
      var d=reviews()[el.getAttribute('data-review-handle')];if(!d)return;
      el.innerHTML=starHTML(d.avg)+'<span class="rating-inline" style="margin-left:6px">'+d.avg+' ('+d.count+')</span>';
    });
  }
  function renderProductReviews(){
    var host=document.getElementById('review-widget');if(!host)return;
    var handle=host.getAttribute('data-handle');var d=reviews()[handle];
    var inline=document.getElementById('rating-inline');
    if(!d){host.innerHTML='<p class="muted">No reviews yet.</p>';return;}
    if(inline){inline.innerHTML=starHTML(d.avg)+' <span>'+d.avg+' · '+d.count+' reviews</span>';inline.onclick=function(){host.scrollIntoView({behavior:'smooth'});};}
    var bars='';[5,4,3,2,1].forEach(function(s){var c=d.dist[s]||0;var pct=d.count?Math.round(c/d.count*100):0;bars+='<div class="rv-bar"><span>'+s+' star</span><span class="track"><i style="width:'+pct+'%"></i></span><span>'+c+'</span></div>';});
    var shown=6,list=d.reviews;
    function card(r){return '<div class="rv"><div class="rvh"><span class="who">'+r.n+(r.v?' <span class="vf">Verified</span>':'')+'</span><span class="date">'+r.d+'</span></div>'+starHTML(r.r)+'<div class="rvt">'+r.t+'</div><div class="rvb">'+r.b+'</div></div>';}
    function draw(){
      host.innerHTML='<div class="rv-top"><div class="rv-score"><div class="big">'+d.avg+'</div>'+starHTML(d.avg)+'<div class="cnt">Based on '+d.count+' reviews</div></div><div class="rv-bars">'+bars+'</div></div><div class="rv-list">'+list.slice(0,shown).map(card).join('')+'</div>'+(shown<list.length?'<button class="btn ghost rv-more">Show more reviews</button>':'');
      var mb=host.querySelector('.rv-more');if(mb)mb.onclick=function(){shown+=6;draw();};
    }
    draw();
    // JSON-LD Product + aggregateRating + reviews
    var pd=document.getElementById('pd');
    if(pd){try{var p=JSON.parse(pd.textContent);var ld={"@context":"https://schema.org/","@type":"Product","name":p.name,"image":p.image,"description":p.description,"sku":p.sku,"brand":{"@type":"Brand","name":"Banfana"},"offers":{"@type":"Offer","url":p.url,"priceCurrency":p.currency,"price":p.price,"availability":p.available?"https://schema.org/InStock":"https://schema.org/OutOfStock"},"aggregateRating":{"@type":"AggregateRating","ratingValue":d.avg,"reviewCount":d.count},"review":list.slice(0,8).map(function(r){return{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":r.r},"author":{"@type":"Person","name":r.n},"datePublished":r.d,"name":r.t,"reviewBody":r.b};})};var sc=document.createElement('script');sc.type='application/ld+json';sc.textContent=JSON.stringify(ld);document.head.appendChild(sc);}catch(e){}}
  }
  function renderReviewCarousel(){
    var host=document.getElementById('review-carousel');if(!host)return;var R=reviews();var all=[];
    Object.keys(R).forEach(function(h){R[h].reviews.filter(function(r){return r.r===5&&r.b.length>60;}).forEach(function(r){all.push(r);});});
    all.sort(function(){return Math.random()-.5;});
    host.innerHTML=all.slice(0,3).map(function(r){return '<div class="rv">'+starHTML(5)+'<div class="rvt">'+r.t+'</div><div class="rvb">'+r.b+'</div><div class="rvh" style="margin-top:10px"><span class="who">'+r.n+' <span class="vf">Verified</span></span></div></div>';}).join('');
  }

  /* ---------- cart ---------- */
  function setCount(n){document.querySelectorAll('[data-cart-count]').forEach(function(e){e.textContent=n;});}
  function refreshDrawer(){
    fetch('/cart.js').then(function(r){return r.json();}).then(function(c){
      setCount(c.item_count);
      var box=document.getElementById('drawer-items');if(!box)return;
      if(!c.item_count){box.innerHTML='<div class="empty">Your cart is empty.</div>';}
      else{box.innerHTML=c.items.map(function(it){return '<div class="ditem"><img src="'+(it.image?it.image:'')+'" alt=""><div style="flex:1"><b style="font-size:13.5px">'+it.product_title+'</b><div class="muted" style="font-size:12px">'+(it.variant_title&&it.variant_title!=='Default Title'?it.variant_title:'')+'</div><button class="muted" style="background:none;border:none;padding:0;font-size:12px;cursor:pointer" data-remove="'+it.key+'">Remove</button></div><div style="font-weight:700;font-size:13.5px">'+money(it.final_line_price)+'</div></div>';}).join('');}
      var st=document.getElementById('drawer-subtotal');if(st)st.textContent=money(c.total_price);
      box.querySelectorAll('[data-remove]').forEach(function(b){b.onclick=function(){fetch('/cart/change.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:b.getAttribute('data-remove'),quantity:0})}).then(refreshDrawer);};});
    });
  }
  function openDrawer(){var d=document.getElementById('cart-drawer'),b=document.getElementById('cart-backdrop');if(d){d.classList.add('open');b.classList.add('open');refreshDrawer();}}
  function closeDrawer(){var d=document.getElementById('cart-drawer'),b=document.getElementById('cart-backdrop');if(d){d.classList.remove('open');b.classList.remove('open');}}

  document.addEventListener('DOMContentLoaded',function(){
    fillCardBadges();renderProductReviews();renderReviewCarousel();refreshDrawer();

    var burger=document.getElementById('burger'),nav=document.querySelector('.nav');
    if(burger&&nav)burger.onclick=function(){nav.style.display=nav.style.display==='flex'?'':'flex';};
    document.querySelectorAll('[data-open-cart]').forEach(function(b){b.onclick=function(e){e.preventDefault();openDrawer();};});
    document.querySelectorAll('[data-close-cart]').forEach(function(b){b.onclick=closeDrawer;});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrawer();});

    // product form
    var form=document.getElementById('product-form');
    if(form){
      var variants=JSON.parse(document.getElementById('variant-data').textContent);
      var selected={};form.querySelectorAll('[data-opt]').forEach(function(sw){var g=sw.getAttribute('data-opt');if(selected[g]===undefined)selected[g]=sw.getAttribute('data-val');});
      function match(){return variants.find(function(v){return v.options.every(function(o,i){return o===selected['opt'+(i+1)];});});}
      function sync(){var v=match();if(!v)return;form.querySelector('[name=id]').value=v.id;var pr=document.getElementById('p-price');if(pr)pr.textContent=money(v.price);var btn=form.querySelector('button[type=submit]');if(btn){btn.disabled=!v.available;btn.textContent=v.available?'Add to cart':'Sold out';}}
      form.querySelectorAll('[data-opt]').forEach(function(sw){sw.onclick=function(){var g=sw.getAttribute('data-opt');selected[g]=sw.getAttribute('data-val');form.querySelectorAll('[data-opt="'+g+'"]').forEach(function(x){x.classList.remove('active');});sw.classList.add('active');sync();};});
      sync();
      var qi=form.querySelector('[name=quantity]');form.querySelectorAll('[data-qty]').forEach(function(b){b.onclick=function(){var d=parseInt(b.getAttribute('data-qty'));qi.value=Math.max(1,(parseInt(qi.value)||1)+d);};});
      form.addEventListener('submit',function(e){e.preventDefault();var btn=form.querySelector('button[type=submit]');btn.disabled=true;fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:form.querySelector('[name=id]').value,quantity:parseInt(qi.value)||1})}).then(function(r){return r.json();}).then(function(){btn.disabled=false;btn.textContent='Add to cart';toast('Added to cart');openDrawer();}).catch(function(){btn.disabled=false;});});
    }

    // gallery
    document.querySelectorAll('[data-thumb]').forEach(function(t){t.onclick=function(){var main=document.getElementById('gallery-main');if(main){main.src=t.getAttribute('data-full');document.querySelectorAll('[data-thumb]').forEach(function(x){x.classList.remove('active');});t.classList.add('active');}};});

    // collection sort
    var sort=document.getElementById('sortby');
    if(sort)sort.onchange=function(){var g=document.getElementById('product-grid');if(!g)return;var items=[].slice.call(g.children);items.sort(function(a,b){var pa=parseFloat(a.getAttribute('data-price')),pb=parseFloat(b.getAttribute('data-price'));if(sort.value==='price-asc')return pa-pb;if(sort.value==='price-desc')return pb-pa;return (a.getAttribute('data-title')||'').localeCompare(b.getAttribute('data-title')||'');});items.forEach(function(i){g.appendChild(i);});};
  });
})();
