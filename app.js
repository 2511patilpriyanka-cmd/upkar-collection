/* Upkar Saree Collection – works offline. Data is saved in the browser (localStorage). */
const PHONE="7066171740", WA="917066171740", ADDR="Kasoda, Tal. Erondal, Dist. Jalgaon";
// Add / edit sarees here. Put photos in the images/ folder.
const P=[
{id:1,name:"Traditional Designer Saree",cat:"Designer",price:1999,mrp:2499,rate:4.5,img:"images/saree1.jpg",desc:"Elegant designer saree with rich traditional work, perfect for weddings and festivals."},
{id:2,name:"Party Wear Silk Saree",cat:"Silk",price:2299,mrp:2999,rate:4.6,img:"images/saree2.jpg",desc:"Soft silk saree with a beautiful shine and border, made for party evenings."},
{id:3,name:"Floral Printed Saree",cat:"Printed",price:1799,mrp:2199,rate:4.4,img:"images/saree3.jpg",desc:"Light, comfortable saree with a fresh floral print for everyday and festive wear."},
{id:4,name:"Paithani Style Saree",cat:"Paithani",price:2000,mrp:3199,rate:4.7,img:"images/saree4.jpg",desc:"Paithani-inspired saree with a rich pallu and traditional Maharashtrian look."},
{id:5,name:"Royal Silk Saree",cat:"Silk",price:2699,mrp:1500,rate:4.5,img:"images/sareeC.jpeg",desc:"Royal silk saree with a grand finish. (Sample photo – replace with your own.)"},
{id:6,name:"Festive Designer Saree",cat:"Designer",price:1900,mrp:2799,rate:4.3,img:"images/sareeB.jpeg",desc:"Festive designer saree with a rich border. (Sample photo – replace with your own.)"},
{id:7,name:"Daily Wear Printed Saree",cat:"Printed",price:999,mrp:1399,rate:4.2,img:"images/saree8.jpeg",desc:"Easy-to-wear printed saree for daily use. (Sample photo – replace with your own.)"},
{id:8,name:"Bridal Paithani Saree",cat:"Paithani",price:1500,mrp:4499,rate:4.8,img:"images/bridel.jpg.jpeg",desc:"Bridal Paithani-style saree with heavy pallu. (Sample photo – replace with your own.)"}
];
const COUPON={code:"UPKAR10",pct:10};
const $=(s,r=document)=>r.querySelector(s);
const ls={get:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const inr=n=>"₹"+Number(n).toLocaleString("en-IN");
const off=p=>Math.round((1-p.price/p.mrp)*100);
const find=id=>P.find(p=>p.id==id);
const me=()=>ls.get("users",[]).find(u=>u.email===ls.get("session",""));
const qs=new URLSearchParams(location.search), page=document.body.dataset.page;
const cart=()=>ls.get("cart",[]), wish=()=>ls.get("wish",[]);
function toast(m,ms){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),ms||1800)}
function totals(){const sub=cart().reduce((s,c)=>s+find(c.id).price*c.qty,0);const disc=ls.get("coupon","")===COUPON.code?Math.round(sub*COUPON.pct/100):0;const ship=(!sub||sub-disc>=999)?0:60;return{sub,disc,ship,total:sub-disc+ship}}
function need(){if(!me()){location.href="login.html?next="+encodeURIComponent(location.pathname.split("/").pop()+location.search);return false}return true}

/* ---------- layout ---------- */
function layout(){
 const nav=[["index.html","Home","home"],["shop.html","Sarees","shop"],["offers.html","Offers","offers"],["about.html","About Us","about"],["contact.html","Contact","contact"]];
 const u=me();
 $("#header").innerHTML=`<header class="top"><a class="logo" href="index.html">Upkar Saree Collection</a>
 <form class="sform" id="sf"><input id="q" placeholder="Search sarees, collections..." value="${(qs.get("q")||"").replace(/"/g,"")}"><button type="button" class="mic" id="mic" title="Search by voice">🎤</button><button>Search</button></form>
 <div class="icons"><a href="wishlist.html">♡ Wishlist <b id="wc"></b></a><a href="cart.html">🛒 Cart <b id="cc"></b></a>
 <a href="${u?"account.html":"login.html"}">👤 ${u?u.name.split(" ")[0]:"Login"}</a></div></header>
 <nav class="nav">${nav.map(n=>`<a href="${n[0]}" class="${n[2]===page?"on":""}">${n[1]}</a>`).join("")}</nav>`;
 $("#footer").innerHTML=`<footer><div class="fg"><div><h3>Upkar Saree Collection</h3><p>Beautiful sarees for every special occasion.</p></div>
 <div><h3>Quick Links</h3><ul><li><a href="index.html">Home</a></li><li><a href="shop.html">Sarees</a></li><li><a href="about.html">About Us</a></li><li><a href="contact.html">Contact</a></li></ul></div>
 <div><h3>Contact</h3><p>${ADDR}<br>${PHONE}</p></div></div><p style="margin-top:25px;text-align:center">© 2026 Upkar Saree Collection</p></footer>`;
 $("#sf").onsubmit=e=>{e.preventDefault();location.href="shop.html?q="+encodeURIComponent($("#q").value.trim())};
 badges();
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition,mic=$("#mic");
 let busy=false;
 mic.onclick=async()=>{
  if(!SR)return toast("Voice search works in Chrome or Edge. Please open the site in Chrome.",5000);
  if(busy)return;
  try{const s=await navigator.mediaDevices.getUserMedia({audio:true});s.getTracks().forEach(t=>t.stop())}
  catch(e){return toast("Microphone is blocked. Click the lock icon near the address bar → allow Microphone, and turn ON Windows Settings → Privacy → Microphone.",7000)}
  const r=new SR();r.lang="en-IN";r.interimResults=false;r.maxAlternatives=1;
  r.onstart=()=>{busy=true;mic.classList.add("rec");toast("🎤 Listening… say a saree name, e.g. Paithani",4000)};
  r.onend=()=>{busy=false;mic.classList.remove("rec")};
  r.onerror=e=>{const m={"not-allowed":"Microphone is blocked. Allow Microphone for this site.","service-not-allowed":"Speech service blocked. In Windows: Settings → Privacy → Speech → turn ON Online speech recognition. Or open the site in Chrome.","no-speech":"No voice heard. Click 🎤 and speak again.","audio-capture":"No microphone found on this laptop.","network":"Internet is needed for voice search."};toast(m[e.error]||"Voice search error: "+e.error,7000)};
  r.onresult=e=>{const t=e.results[0][0].transcript.replace(/[.]$/,"");$("#q").value=t;toast("Searching: "+t);setTimeout(()=>$("#sf").requestSubmit(),600)};
  try{r.start()}catch(e){toast("Could not start voice search. Please try again.")}
 }
}
function badges(){$("#cc").textContent=cart().reduce((s,c)=>s+c.qty,0);$("#wc").textContent=wish().length||""}
const card=p=>`<article class="card"><a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy"></a><div class="info"><h3>${p.name}</h3><span class="rating">${p.rate} ★</span>
<div class="price">${inr(p.price)} <span class="old">${inr(p.mrp)}</span><span class="off">${off(p)}% off</span></div>
<div class="actions"><button data-wish="${p.id}" class="${wish().includes(p.id)?"on":""}" title="Wishlist">♡</button><button class="buy" data-add="${p.id}">Add to Cart</button></div></div></article>`;
const empty=(t,b,l)=>`<div class="empty"><h3>${t}</h3><a class="btn" href="${l}">${b}</a></div>`;

/* ---------- actions ---------- */
document.addEventListener("click",e=>{
 const t=e.target.closest("[data-add],[data-wish],[data-inc],[data-dec],[data-rm],[data-buy]");if(!t)return;
 const d=t.dataset, c=cart();
 if(d.add||d.buy){const id=+(d.add||d.buy),n=d.buy?+($("#pq")?.textContent||1):(d.pq?+$("#pq").textContent:1);const i=c.find(x=>x.id===id);i?i.qty+=n:c.push({id,qty:n});ls.set("cart",c);badges();
  if(d.buy)location.href="checkout.html";else toast("Added to cart ✔")}
 if(d.wish){const id=+d.wish;let w=wish();w.includes(id)?w=w.filter(x=>x!==id):w.push(id);ls.set("wish",w);badges();t.classList.toggle("on");toast(w.includes(id)?"Added to wishlist ♡":"Removed from wishlist");if(page==="wishlist")pages.wishlist()}
 if(d.inc||d.dec){const i=c.find(x=>x.id==(d.inc||d.dec));i.qty+=d.inc?1:-1;ls.set("cart",c.filter(x=>x.qty>0));badges();pages.cart()}
 if(d.rm){ls.set("cart",c.filter(x=>x.id!=d.rm));badges();pages.cart()}
});

/* ---------- pages ---------- */
const pages={
home(){
 const cats=[...new Set(P.map(p=>p.cat))];
 $("#app").innerHTML=`<section class="hero"><div class="heroText"><img class="hlogo" src="images/logo.jpg" alt="Upkar Collection logo"><small>WELCOME TO UPKAR SAREE COLLECTION</small>
 <h1>Beautiful sarees, <span>made for you</span></h1><p>From traditional to modern styles, find the perfect saree for every special occasion.</p>
 <a class="btn" href="shop.html">Shop Now →</a></div><img src="images/shop.jpg" alt="Upkar Saree Collection shop"></section>
 <section class="section"><div class="title"><h2>Shop by Category</h2></div><div class="chips">${cats.map(c=>`<a class="chip" href="shop.html?cat=${c}">${c}</a>`).join("")}</div></section>
 <section class="section"><div class="title"><h2>Trending Sarees</h2><a class="view" href="shop.html">View All →</a></div><div class="grid">${P.slice(0,4).map(card).join("")}</div></section>
 <section class="section"><div class="title"><h2>Why Shop With Us?</h2></div><div class="benefits">
 <div class="benefit">✓<b>Great Quality</b><span>Carefully selected collection</span></div><div class="benefit">★<b>Latest Designs</b><span>New fashion styles</span></div>
 <div class="benefit">₹<b>Best Prices</b><span>Affordable for everyone</span></div><div class="benefit">☎<b>Customer Support</b><span>Call or WhatsApp us</span></div></div></section>
 <section class="section two"><div><div class="title"><h2>About Upkar Saree Collection</h2></div><p>We offer traditional, designer, party wear and printed sarees. Our goal is to give our customers a beautiful collection and friendly service.</p><a class="btn" href="about.html">Know More</a></div><img src="images/shop.jpg" alt="Our shop"></section>`},
shop(){
 const cats=[...new Set(P.map(p=>p.cat))];
 $("#app").innerHTML=`<section class="section"><div class="title"><h2>All Sarees</h2><span class="muted" id="cnt"></span></div>
 <div class="bar"><input id="fq" placeholder="Search sarees..." value="${qs.get("q")||""}"><select id="fc"><option value="">All categories</option>${cats.map(c=>`<option ${qs.get("cat")===c?"selected":""}>${c}</option>`).join("")}</select>
 <select id="fs"><option value="">Sort: Featured</option><option value="l">Price: Low to High</option><option value="h">Price: High to Low</option><option value="r">Top Rated</option></select></div><div class="grid" id="g"></div></section>`;
 const go=()=>{const q=$("#fq").value.toLowerCase().trim(),c=$("#fc").value,s=$("#fs").value;
  let l=P.filter(p=>(!c||p.cat===c)&&(!q||(p.name+" "+p.cat+" "+p.desc).toLowerCase().includes(q)));
  if(s==="l")l.sort((a,b)=>a.price-b.price);if(s==="h")l.sort((a,b)=>b.price-a.price);if(s==="r")l.sort((a,b)=>b.rate-a.rate);
  $("#cnt").textContent=l.length+" sarees";$("#g").innerHTML=l.length?l.map(card).join(""):empty("No sarees found","Clear search","shop.html")};
 ["fq","fc","fs"].forEach(i=>$("#"+i).oninput=go);go()},
product(){
 const p=find(qs.get("id"));if(!p){$("#app").innerHTML=`<section class="section">${empty("Saree not found","Browse Sarees","shop.html")}</section>`;return}
 $("#app").innerHTML=`<section class="section pd"><img src="${p.img}" alt="${p.name}"><div><h1>${p.name}</h1><span class="rating">${p.rate} ★</span> <span class="tag">${p.cat}</span>
 <div class="price">${inr(p.price)} <span class="old">${inr(p.mrp)}</span><span class="off">${off(p)}% off</span></div><p class="muted" style="margin:16px 0">${p.desc}</p>
 <p class="muted">${p.price>=999?"✓ Free delivery":"Delivery ₹60"} &nbsp; ✓ Cash on delivery</p>
 <div style="margin:18px 0">Quantity: <span class="q"><button onclick="pqty(-1)">−</button><span id="pq">1</span><button onclick="pqty(1)">+</button></span></div>
 <div class="actions" style="max-width:420px"><button data-wish="${p.id}" class="${wish().includes(p.id)?"on":""}">♡</button><button class="buy" data-add="${p.id}" data-pq="1">Add to Cart</button><button class="buy" data-buy="${p.id}">Buy Now</button></div>
 <p style="margin-top:18px"><a class="btn wa" target="_blank" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi, I want to know about: "+p.name)}">Ask on WhatsApp</a></p></div></section>
 <section class="section"><div class="title"><h2>You may also like</h2></div><div class="grid">${P.filter(x=>x.id!==p.id&&x.cat===p.cat||x.id!==p.id).slice(0,4).map(card).join("")}</div></section>`},
cart(){
 const c=cart(),t=totals();
 $("#app").innerHTML=`<section class="section"><div class="title"><h2>My Cart</h2></div>${!c.length?empty("Your cart is empty","Start Shopping","shop.html"):`<div class="cols"><div>${c.map(i=>{const p=find(i.id);return`<div class="row"><a href="product.html?id=${p.id}"><img src="${p.img}"></a><div class="d"><b>${p.name}</b><div>${inr(p.price)}</div>
 <span class="q"><button data-dec="${p.id}">−</button><span>${i.qty}</span><button data-inc="${p.id}">+</button></span><br><button class="rm" data-rm="${p.id}">Remove</button></div><b>${inr(p.price*i.qty)}</b></div>`}).join("")}</div>
 <div class="sum order"><h3 style="margin-bottom:10px">Order Summary</h3><div><span>Subtotal</span><span>${inr(t.sub)}</span></div>${t.disc?`<div><span>Coupon (${COUPON.code})</span><span>− ${inr(t.disc)}</span></div>`:""}
 <div><span>Delivery</span><span>${t.ship?inr(t.ship):"FREE"}</span></div><div class="t"><span>Total</span><span>${inr(t.total)}</span></div>
 <div class="bar" style="margin:12px 0 0"><input id="cp" placeholder="Coupon code"><button class="btn" style="margin:0;padding:10px 16px" id="ap">Apply</button></div><p class="msg" id="cm"></p>
 <a class="btn" style="width:100%;text-align:center" href="checkout.html">Proceed to Checkout</a></div></div>`}</section>`;
 const a=$("#ap");if(a)a.onclick=()=>{if($("#cp").value.trim().toUpperCase()===COUPON.code){ls.set("coupon",COUPON.code);toast("Coupon applied ✔");pages.cart()}else $("#cm").textContent="Invalid coupon code."}},
wishlist(){const l=wish().map(find).filter(Boolean);$("#app").innerHTML=`<section class="section"><div class="title"><h2>My Wishlist</h2></div>${l.length?`<div class="grid">${l.map(card).join("")}</div>`:empty("Your wishlist is empty","Browse Sarees","shop.html")}</section>`},
checkout(){
 if(!need())return;const c=cart(),u=me(),t=totals();
 if(!c.length){$("#app").innerHTML=`<section class="section">${empty("Your cart is empty","Start Shopping","shop.html")}</section>`;return}
 $("#app").innerHTML=`<section class="section"><div class="title"><h2>Checkout</h2></div><div class="cols"><form class="f" id="cf" style="max-width:none">
 <label>Full name</label><input id="n" required value="${u.name}"><label>Mobile number</label><input id="ph" required pattern="[0-9]{10}" title="10-digit mobile number" value="${u.phone||""}">
 <label>Full address</label><textarea id="ad" rows="3" required></textarea><label>City / Village</label><input id="ci" required><label>Pincode</label><input id="pc" required pattern="[0-9]{6}" title="6-digit pincode">
 <label>Payment method</label><select id="pm"><option>Cash on Delivery</option><option>UPI on Delivery</option></select><button class="btn" style="width:100%">Place Order</button></form>
 <div class="sum order"><h3 style="margin-bottom:10px">Your Order</h3>${c.map(i=>`<div><span>${find(i.id).name} × ${i.qty}</span><span>${inr(find(i.id).price*i.qty)}</span></div>`).join("")}
 ${t.disc?`<div><span>Coupon</span><span>− ${inr(t.disc)}</span></div>`:""}<div><span>Delivery</span><span>${t.ship?inr(t.ship):"FREE"}</span></div><div class="t"><span>Total</span><span>${inr(t.total)}</span></div></div></div></section>`;
 $("#cf").onsubmit=e=>{e.preventDefault();const o={id:"UPK"+Date.now().toString().slice(-8),date:new Date().toLocaleString("en-IN"),email:u.email,
  items:c.map(i=>({name:find(i.id).name,price:find(i.id).price,qty:i.qty})),...t,name:$("#n").value,phone:$("#ph").value,addr:`${$("#ad").value}, ${$("#ci").value} - ${$("#pc").value}`,pay:$("#pm").value,status:"Placed"};
  ls.set("orders",[o,...ls.get("orders",[])]);ls.set("cart",[]);ls.set("coupon","");badges();
  const m=`New order ${o.id}\n`+o.items.map(i=>`${i.name} x${i.qty} = ${inr(i.price*i.qty)}`).join("\n")+`\nTotal: ${inr(o.total)} (${o.pay})\nName: ${o.name}\nPhone: ${o.phone}\nAddress: ${o.addr}`;
  $("#app").innerHTML=`<section class="section empty"><h2 style="color:var(--g)">✓ Order placed successfully!</h2><p style="margin:12px 0">Your order number is <b>${o.id}</b>. Total: <b>${inr(o.total)}</b> (${o.pay}).</p>
  <p class="muted">Tap below to send your order details to the shop on WhatsApp so we can confirm it quickly.</p>
  <a class="btn wa" target="_blank" href="https://wa.me/${WA}?text=${encodeURIComponent(m)}" style="margin:18px auto 8px">Send order on WhatsApp</a><a class="btn alt" href="account.html" style="margin:8px auto">View My Orders</a></section>`;scrollTo(0,0)}},
login(){
 if(me()){location.href=qs.get("next")||"account.html";return}
 let mode="in";const draw=()=>{$("#app").innerHTML=`<section class="section auth"><div class="tabs"><button class="${mode==="in"?"on":""}" data-m="in">Login</button><button class="${mode==="up"?"on":""}" data-m="up">Register</button></div>
 <form class="f" id="af">${mode==="up"?`<label>Full name</label><input id="an" required><label>Mobile number</label><input id="ap" required pattern="[0-9]{10}" title="10-digit mobile number">`:""}
 <label>Email</label><input id="ae" type="email" required><label>Password</label><input id="aw" type="password" required minlength="6"><p class="msg" id="am"></p><button class="btn" style="width:100%;margin:0">${mode==="in"?"Login":"Create Account"}</button></form></section>`;
  document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{mode=b.dataset.m;draw()});
  $("#af").onsubmit=e=>{e.preventDefault();const us=ls.get("users",[]),em=$("#ae").value.trim().toLowerCase(),pw=btoa($("#aw").value);
   if(mode==="up"){if(us.some(u=>u.email===em))return $("#am").textContent="This email is already registered. Please login.";us.push({name:$("#an").value.trim(),phone:$("#ap").value,email:em,pw});ls.set("users",us)}
   else if(!us.some(u=>u.email===em&&u.pw===pw))return $("#am").textContent="Wrong email or password.";
   ls.set("session",em);location.href=qs.get("next")||"account.html"}};draw()},
account(){
 if(!need())return;const u=me(),o=ls.get("orders",[]).filter(x=>x.email===u.email);
 $("#app").innerHTML=`<section class="section"><div class="title"><h2>My Account</h2><button class="btn alt" style="margin:0" id="lo">Logout</button></div><p><b>${u.name}</b><br><span class="muted">${u.email} • ${u.phone||""}</span></p></section>
 <section class="section"><div class="title"><h2>My Orders</h2></div>${o.length?o.map(x=>`<div class="order"><div class="title" style="margin-bottom:8px"><b>${x.id}</b><span class="tag">${x.status}</span></div><p class="muted">${x.date}</p>
 ${x.items.map(i=>`<div>${i.name} × ${i.qty} — ${inr(i.price*i.qty)}</div>`).join("")}<p style="margin-top:8px"><b>Total: ${inr(x.total)}</b> (${x.pay})</p><p class="muted">Deliver to: ${x.addr}</p></div>`).join(""):empty("No orders yet","Start Shopping","shop.html")}</section>`;
 $("#lo").onclick=()=>{ls.set("session","");location.href="index.html"}},
about(){$("#app").innerHTML=`<section class="section two"><div><div class="title"><h2>About Upkar Saree Collection</h2></div><p>Upkar Saree Collection offers traditional, designer, party wear, Paithani and printed sarees. Our goal is to give every customer a beautiful collection, fair prices and friendly service.</p><p style="margin-top:12px">Visit our shop in ${ADDR} or order online and get your saree delivered home.</p></div><img src="images/shop.jpg" alt="Our shop"></section>`},
offers(){$("#app").innerHTML=`<section class="section"><div class="title"><h2>Special Offers</h2></div><div class="order"><h3>Extra ${COUPON.pct}% off</h3><p class="muted" style="margin:8px 0">Use coupon code <b>${COUPON.code}</b> in your cart.</p><a class="btn" style="margin-top:8px" href="cart.html">Go to Cart</a></div>
 <div class="order"><h3>Free delivery</h3><p class="muted">On all orders above ₹999. Cash on delivery available.</p></div></section>
 <section class="section"><div class="title"><h2>Best Deals</h2></div><div class="grid">${[...P].sort((a,b)=>off(b)-off(a)).slice(0,4).map(card).join("")}</div></section>`},
contact(){$("#app").innerHTML=`<section class="section two" style="align-items:start"><div><div class="title"><h2>Contact Us</h2></div><p style="line-height:2"><b>Owner:</b> Kirna Patil<br><b>Address:</b> ${ADDR}<br><b>Phone:</b> <a href="tel:${PHONE}">${PHONE}</a></p>
 <p style="margin-top:14px"><a class="btn wa" target="_blank" href="https://wa.me/${WA}">Chat on WhatsApp</a></p></div>
 <form class="f" id="mf"><label>Your name</label><input id="mn" required><label>Mobile number</label><input id="mp" required pattern="[0-9]{10}" title="10-digit mobile number"><label>Message</label><textarea id="mm" rows="4" required></textarea><button class="btn" style="margin:0">Send Message</button></form></section>`;
 $("#mf").onsubmit=e=>{e.preventDefault();ls.set("messages",[{n:$("#mn").value,p:$("#mp").value,m:$("#mm").value,d:new Date().toLocaleString("en-IN")},...ls.get("messages",[])]);e.target.reset();toast("Message sent. We will contact you soon ✔")}}
};
layout();pages[page]();
function pqty(n){const e=$("#pq");e.textContent=Math.max(1,+e.textContent+n)}
