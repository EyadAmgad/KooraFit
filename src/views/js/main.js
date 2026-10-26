/* KooraFit — shared UI + page logic (vanilla JS) */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const page = document.body.dataset.page;

/* ---------- Data (replace with real content / API later) ---------- */
const LINKS = [["index.html","الرئيسية"],["booking.html","الحجز"],["offers.html","العروض"],["coaches.html","المدربون"],["media.html","الوسائط"],["competitions.html","البطولات"],["locations.html","الفروع والملاعب"]];
const SCHEDULE = [["الإثنين","9:00 صباحاً","المنطقة 1"],["الثلاثاء","6:00 مساءً","المنطقة 2"],["الأربعاء","9:00 صباحاً","المنطقة 1"],["الجمعة","5:00 مساءً","المنطقة 3"]];
const SLOTS = ["9:00 ص","10:00 ص","11:00 ص","5:00 م","6:00 م","7:00 م","8:00 م","9:00 م"];
const PLANS = [
  {n:"شهري",p:600,per:"شهر",f:["8 حصص تدريبية","حجز أولوية","مباراة ودية شهرية"]},
  {n:"ربع سنوي",p:1500,per:"3 شهور",f:["24 حصة تدريبية","وفّر 17٪","تقييم بدني مجاني","خصم على البطولات"],feat:1},
  {n:"سنوي",p:5400,per:"سنة",f:["حصص مفتوحة","وفّر 25٪","طقم لعب رسمي","دخول مجاني للبطولات"]}];
const COACHES = [
  {n:"كابتن أحمد سمير",b:"مدرب لياقة ومهارات فردية، خبرة 10 سنوات.",s:["لياقة صباحية — الإثنين 9:00 ص","مهارات المراوغة — الأربعاء 9:00 ص"]},
  {n:"كابتن محمود حسن",b:"مدرب حراس مرمى معتمد.",s:["حراس المرمى — الثلاثاء 6:00 م"]},
  {n:"كابتن يوسف علي",b:"مدرب تكتيك ومباريات مصغّرة.",s:["مباريات 5×5 — الجمعة 5:00 م","تكتيك الدفاع — السبت 7:00 م"]}];
const COMPS = [
  {n:"كأس KooraFit للهواة",d:"يبدأ 15 نوفمبر",r:"التسجيل حتى 5 نوفمبر",pr:"الجائزة: 20,000 ج.م"},
  {n:"دوري الشتاء 5×5",d:"يبدأ 1 ديسمبر",r:"التسجيل حتى 20 نوفمبر",pr:"الجائزة: 10,000 ج.م"},
  {n:"بطولة الناشئين",d:"يبدأ 10 يناير",r:"التسجيل حتى 30 ديسمبر",pr:"كؤوس وميداليات"}];
const BRANCHES = [ // Placeholder places: swap q for your real addresses
  {n:"فرع القاهرة الجديدة",h:"يومياً 8:00 ص – 12:00 م",q:"New Cairo, Egypt"},
  {n:"فرع مدينة نصر",h:"يومياً 9:00 ص – 11:00 م",q:"Nasr City, Cairo, Egypt"},
  {n:"فرع الشيخ زايد",h:"يومياً 8:00 ص – 12:00 م",q:"Sheikh Zayed City, Egypt"}];

/* ---------- Helpers ---------- */
const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2800); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- Shared header / footer ---------- */
const LOGO = `<a class="logo" href="index.html" aria-label="KooraFit"><svg width="34" height="28" viewBox="0 0 34 28" aria-hidden="true"><path d="M2 26V3h30v23M2 3l5 5h20l5-5M7 8v18M27 8v18" fill="none" stroke="#FF6B00" stroke-width="2.2" stroke-linejoin="round"/><circle cx="17" cy="21" r="3" fill="#fff"/></svg><span>Koora<b>Fit</b></span></a>`;
$("#site-header").innerHTML = `<div class="wrap nav">${LOGO}
  <button class="burger" aria-label="القائمة" aria-expanded="false">☰</button>
  <nav class="menu" aria-label="القائمة الرئيسية">${LINKS.map(([h,t]) => `<a href="${h}" class="${h===page?"on":""}">${t}</a>`).join("")}</nav>
  <a class="btn" href="login.html">تسجيل الدخول / حساب جديد</a></div>`;
$("#site-footer").innerHTML = `<div class="wrap"><p>© 2026 KooraFit — جميع الحقوق محفوظة</p><p><a href="https://instagram.com/koora.fit" target="_blank" rel="noopener">@koora.fit</a></p></div>`;
const burger = $(".burger");
burger.onclick = () => { const o = $(".menu").classList.toggle("open"); burger.setAttribute("aria-expanded", o); };

/* ---------- Login / Sign up ---------- */
if (page === "login.html") {
  const tabs = $$(".tab");
  const forms = $$(".form");
  const showForm = tab => {
    tabs.forEach(button => {
      const selected = button === tab;
      button.classList.toggle("on", selected);
      button.setAttribute("aria-selected", selected);
    });
    forms.forEach(form => form.hidden = form.id !== tab.dataset.tab);
  };
  tabs.forEach(tab => tab.onclick = () => showForm(tab));
  forms.forEach(form => form.onsubmit = e => {
    e.preventDefault();
    if (form.id === "signup" && $("#signup-password").value !== $("#signup-password-confirmation").value) {
      $("#signup-password-confirmation").setCustomValidity("كلمتا المرور غير متطابقتين");
      $("#signup-password-confirmation").reportValidity();
      return;
    }
    const confirmation = $("#signup-password-confirmation");
    if (confirmation) confirmation.setCustomValidity("");
    toast(form.dataset.msg);
    form.reset();
  });
}

/* ---------- Booking ---------- */
if (page === "booking.html") {
  $("#sched").innerHTML = SCHEDULE.map(([d,t,z]) => `<li><span>حصة تدريبية - ${d} الساعة ${t}</span><strong>${z}</strong></li>`).join("");
  const date = $("#bDate"), field = $("#bField"), slotsEl = $("#slots"), sum = $("#summary");
  let chosen = null;
  date.min = new Date().toISOString().slice(0,10);
  const taken = () => { // demo only: pseudo-random unavailable slots per date+field
    const seed = [...(date.value + field.value)].reduce((a,c) => a + c.charCodeAt(0), 0);
    return SLOTS.map((_, i) => (seed + i * 7) % 5 === 0);
  };
  const update = () => sum.textContent = date.value && chosen
    ? `حجزك: ${date.value} — ${field.value} — ${chosen}`
    : "اختر التاريخ والموعد لعرض ملخص الحجز.";
  const render = () => {
    const t = taken(); chosen = null;
    slotsEl.innerHTML = SLOTS.map((s,i) => `<button type="button" class="slot" ${t[i]?"disabled":""}>${s}</button>`).join("");
    $$(".slot").forEach(b => b.onclick = () => { $$(".slot").forEach(x => x.classList.remove("on")); b.classList.add("on"); chosen = b.textContent; update(); });
    update();
  };
  date.onchange = field.onchange = render; render();
  $("#bookForm").onsubmit = e => {
    e.preventDefault();
    if (!date.value || !chosen) return toast("اختر التاريخ والموعد أولاً");
    toast("تم تأكيد حجزك ✓"); e.target.reset(); render();
  };
}

/* ---------- Offers ---------- */
if (page === "offers.html") {
  $("#plans").innerHTML = PLANS.map(p => `
    <div class="card ${p.feat?"feat":""}">${p.feat?'<span class="badge">الأكثر توفيراً</span>':""}
    <h3>${p.n}</h3><div class="price">${p.p.toLocaleString("ar-EG")} <small>ج.م / ${p.per}</small></div>
    <ul class="check">${p.f.map(x => `<li>${x}</li>`).join("")}</ul>
    <button class="btn" data-plan="${esc(p.n)}">اشترك الآن</button></div>`).join("");
  $("#plans").onclick = e => { const b = e.target.closest("[data-plan]"); if (b) toast(`تم اختيار الباقة ${b.dataset.plan} — سجّل الدخول لإتمام الاشتراك`); };
}

/* ---------- Coaches ---------- */
if (page === "coaches.html") $("#coaches").innerHTML = COACHES.map(c => `
  <article class="card"><div class="ph round" aria-hidden="true">⚽</div><h3>${c.n}</h3><p>${c.b}</p>
  <ul class="check">${c.s.map(x => `<li>${x}</li>`).join("")}</ul><a class="btn" href="booking.html">احجز مع المدرب</a></article>`).join("");

/* ---------- Media ---------- */
if (page === "media.html") {
  $("#gallery").innerHTML = Array.from({length:8}, (_, i) => `<button aria-label="صورة ${i+1}"><div class="ph">⚽</div></button>`).join("");
  const lb = $("#lb");
  $("#gallery").onclick = e => { if (e.target.closest("button")) lb.hidden = false; };
  $("#lbClose").onclick = () => lb.hidden = true;
  document.onkeydown = e => { if (e.key === "Escape") lb.hidden = true; };
  $$(".play").forEach(b => b.onclick = () => toast("أضف رابط الفيديو هنا"));
}

/* ---------- Competitions ---------- */
if (page === "competitions.html") {
  $("#comps").innerHTML = COMPS.map(c => `<article class="card dark"><h3>${c.n}</h3><p>${c.d}</p><p>${c.r}</p><p class="price">${c.pr}</p>
    <button class="btn" data-c="${esc(c.n)}">سجّل فريقك</button></article>`).join("");
  $("#comps").onclick = e => { const b = e.target.closest("[data-c]"); if (b) toast(`تم استلام طلب التسجيل في ${b.dataset.c}`); };
}

/* ---------- Locations ---------- */
if (page === "locations.html") {
  const box = $("#branches"), map = $("#map");
  box.innerHTML = BRANCHES.map((b,i) => `<button class="branch" data-i="${i}"><h3>${b.n}</h3><p>${b.h}</p></button>
    <a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.q)}" target="_blank" rel="noopener" style="margin-bottom:16px">الاتجاهات</a>`).join("");
  const show = i => {
    map.src = `https://www.google.com/maps?q=${encodeURIComponent(BRANCHES[i].q)}&hl=ar&output=embed`;
    $$(".branch").forEach((b,j) => b.classList.toggle("on", j === i));
  };
  box.onclick = e => { const b = e.target.closest(".branch"); if (b) show(+b.dataset.i); };
  show(0);
}
