/* =========================================================
   script.js — المنطق الذكي + دعم لغتين (عربي/إنجليزي)
   ========================================================= */

/* ---------------------------------------------------------
   (0) قاموس النصوص الثابتة (واجهة المستخدم)
   كل مفتاح له نسخة عربية وإنجليزية، تُطبّق على عناصر data-i18n
   --------------------------------------------------------- */
const I18N = {
  ar: {
    nav_menu:"القائمة", nav_today:"طبق اليوم", nav_gallery:"المعرض", nav_reviews:"الآراء",
    nav_hours:"أوقات العمل", nav_contact:"تواصل معنا",
    hero_browse:"تصفّح القائمة", hero_order:"اطلب الآن",
    menu_eyebrow:"قائمتنا", menu_title:"أطباقنا المميزة", menu_sub:"محضّرة بعناية يومياً — الأسعار شاملة الضريبة",
    today_eyebrow:"عرض خاص", today_title:"طبق اليوم", today_order:"اطلب طبق اليوم", today_badge:"مختار اليوم",
    gallery_eyebrow:"لمحات من المكان", gallery_title:"معرض الصور",
    reviews_eyebrow:"ماذا قالوا عنّا", reviews_title:"آراء عملائنا",
    hours_eyebrow:"نسعد بزيارتكم", hours_title:"أوقات العمل", address_title:"العنوان",
    contact_eyebrow:"راسلنا", contact_title:"اتصل بنا", contact_sub:"عندك استفسار أو حجز؟ اكتب لنا وبنرد عليك بأسرع وقت.",
    contact_send:"إرسال", rights:"جميع الحقوق محفوظة", admin_panel:"لوحة التحكم",
    currency:"ر.س", order_btn:"اطلب",
    ph_name:"الاسم", ph_email:"البريد الإلكتروني", ph_subject:"الموضوع", ph_message:"رسالتك...",
    form_sending:"جارٍ الإرسال...", form_ok:"✅ تم إرسال رسالتك، شكراً لتواصلك!",
    form_err:"❌ حدث خطأ، حاول مرة أخرى لاحقاً.", form_noendpoint:"⚠️ ضع رابط Formspree الخاص بك في البيانات أولاً.",
    greet_morning:"صباح الخير 🌅 نوّرت من بدري", greet_noon:"نهارك سعيد ☀️ وقت الغداء حان",
    greet_evening:"مساء الخير 🌙 أهلاً بك في أمسيتنا", greet_night:"سهرة هانئة ✨ نحن بانتظارك",
    season_summer:"أجواء صيفية — جرّب أطباقنا المنعشة الباردة",
    season_winter:"أجواء شتوية — دفّي قلبك بأطباقنا الساخنة",
    wa_dish:n=>`مرحباً، أرغب بطلب: ${n} 🍽️`, wa_general:"مرحباً، أرغب بالاستفسار عن الطلبات 😊",
    langLabel:"EN"
  },
  en: {
    nav_menu:"Menu", nav_today:"Today's Dish", nav_gallery:"Gallery", nav_reviews:"Reviews",
    nav_hours:"Hours", nav_contact:"Contact",
    hero_browse:"Browse Menu", hero_order:"Order Now",
    menu_eyebrow:"Our Menu", menu_title:"Signature Dishes", menu_sub:"Freshly prepared daily — prices include VAT",
    today_eyebrow:"Special", today_title:"Dish of the Day", today_order:"Order Today's Dish", today_badge:"Today's Pick",
    gallery_eyebrow:"A Glimpse", gallery_title:"Photo Gallery",
    reviews_eyebrow:"What They Said", reviews_title:"Customer Reviews",
    hours_eyebrow:"Visit Us", hours_title:"Opening Hours", address_title:"Address",
    contact_eyebrow:"Get In Touch", contact_title:"Contact Us", contact_sub:"Have a question or booking? Write to us and we'll reply fast.",
    contact_send:"Send", rights:"All rights reserved", admin_panel:"Dashboard",
    currency:"SAR", order_btn:"Order",
    ph_name:"Name", ph_email:"Email", ph_subject:"Subject", ph_message:"Your message...",
    form_sending:"Sending...", form_ok:"✅ Your message was sent. Thank you!",
    form_err:"❌ Something went wrong, please try again later.", form_noendpoint:"⚠️ Add your Formspree URL to the data first.",
    greet_morning:"Good morning 🌅 Early bird!", greet_noon:"Good afternoon ☀️ Lunchtime!",
    greet_evening:"Good evening 🌙 Welcome to our evening", greet_night:"Pleasant night ✨ We're waiting for you",
    season_summer:"Summer vibes — try our refreshing cold dishes",
    season_winter:"Winter vibes — warm up with our hot dishes",
    wa_dish:n=>`Hello, I'd like to order: ${n} 🍽️`, wa_general:"Hello, I'd like to ask about orders 😊",
    langLabel:"عربي"
  }
};

const VALID_TYPES = ["restaurant", "cafe", "bakery"];
let currentLang = localStorage.getItem("lang") || "ar"; // اللغة الحالية
let currentData = null; // بيانات النوع الحالي (محفوظة للاستخدام عند تبديل اللغة)

/* نسخة احتياطية مختصرة لضمان العمل بدون خادم */
const FALLBACK_DATA = {
  restaurant: {
    id:"restaurant", kind:"مطعم", kind_en:"Restaurant", name:"مطعم الذواقة", name_en:"Al-Thawaqa",
    tagline:"نكهات أصيلة تُحاكي ذاكرة المكان", tagline_en:"Authentic flavors that echo memory",
    logoText:"الذواقة", logoText_en:"Thawaqa",
    about:"نقدّم أشهى الأطباق الشرقية والمشاوي الطازجة.", about_en:"We serve the finest oriental dishes and fresh grills.",
    phone:"966500000001", address:"حي العليا، الرياض", address_en:"Al Olaya, Riyadh",
    mapQuery:"King Fahd Road Riyadh", colors:{primary:"#B23A2E",accent:"#E2A53D",bg:"#FBF6EE",text:"#2B2118"},
    hours:[{day:"السبت – الخميس",day_en:"Sat – Thu",time:"12:00 ظهراً – 1:00 صباحاً",time_en:"12 PM – 1 AM"}],
    social:{facebook:"#",instagram:"#",tiktok:"#"}, formspree:"https://formspree.io/f/your_form_id",
    dishes:[{name:"مندي لحم",name_en:"Lamb Mandi",desc:"أرز مدخّن مع لحم غنم",desc_en:"Smoked rice with lamb",price:65,img:"https://placehold.co/600x400/B23A2E/FBF6EE?text=Mandi",season:"all",tag:"الأكثر طلباً",tag_en:"Best Seller"}],
    gallery:[{img:"https://placehold.co/800x600/B23A2E/FBF6EE?text=1",caption:"صالة الطعام",caption_en:"Dining hall"}],
    reviews:[{name:"سعود ع.",stars:5,text:"أفضل مندي جربته.",text_en:"Best mandi I've had."}]
  }
};

/* ---------------------------------------------------------
   (1) تحديد نوع النشاط من الرابط
   --------------------------------------------------------- */
function detectType() {
  // أولاً: باراميتر ?type= (له الأولوية)
  const param = new URLSearchParams(window.location.search).get("type");
  if (VALID_TYPES.includes(param)) return param;
  // ثانياً: الهاش #cafe
  const hash = window.location.hash.replace("#", "");
  if (VALID_TYPES.includes(hash)) return hash;
  // ثالثاً: آخر مقطع بالمسار
  const segments = window.location.pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (VALID_TYPES.includes(last)) return last;
  // الافتراضي
  return "restaurant";
}

/* ---------------------------------------------------------
   (2) تحميل البيانات: localStorage ← data.json ← الاحتياطي
   --------------------------------------------------------- */
async function loadData(type) {
  const saved = localStorage.getItem("menuData_" + type);
  if (saved) { try { return JSON.parse(saved); } catch(e){} }
  try {
    const res = await fetch("data.json", { cache:"no-store" });
    if (res.ok) { const all = await res.json(); if (all[type]) return all[type]; }
  } catch(e) { console.warn("تعذّر جلب data.json — استخدام الاحتياطي.", e); }
  return FALLBACK_DATA[type] || FALLBACK_DATA.restaurant;
}

/* ---------------------------------------------------------
   أداة: اختيار النص حسب اللغة الحالية
   تعيد الحقل الإنجليزي إن وُجد ومفعّل، وإلا العربي
   مثال: pick(dish,"name") → name_en أو name
   --------------------------------------------------------- */
function pick(obj, field) {
  if (!obj) return "";
  if (currentLang === "en" && obj[field + "_en"]) return obj[field + "_en"];
  return obj[field] || "";
}
function t(key) { // ترجمة نص ثابت
  return I18N[currentLang][key] ?? I18N.ar[key] ?? key;
}

/* ---------------------------------------------------------
   (3) المحتوى الذكي (يحترم اللغة الحالية)
   --------------------------------------------------------- */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)  return t("greet_morning");
  if (h >= 12 && h < 17) return t("greet_noon");
  if (h >= 17 && h < 22) return t("greet_evening");
  return t("greet_night");
}
function getSeason() {
  const m = new Date().getMonth() + 1;
  return (m >= 4 && m <= 9) ? "summer" : "winter";
}
function pickDishOfDay(dishes) {
  if (!dishes || !dishes.length) return null;
  const dayIndex = Math.floor(Date.now() / 86400000);
  return dishes[dayIndex % dishes.length];
}

/* ---------------------------------------------------------
   (4) أدوات مساعدة
   --------------------------------------------------------- */
function applyColors(c) {
  if (!c) return;
  const r = document.documentElement.style;
  if (c.primary) r.setProperty("--primary", c.primary);
  if (c.accent)  r.setProperty("--accent", c.accent);
  if (c.bg)      r.setProperty("--bg", c.bg);
  if (c.text)    r.setProperty("--text", c.text);
}
function waLink(phone, dishName) {
  const msg = dishName ? t("wa_dish")(dishName) : t("wa_general");
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
function starsHTML(n) {
  let s = "";
  for (let i = 0; i < 5; i++) s += `<i class="fa-${i < n ? "solid" : "regular"} fa-star"></i>`;
  return s;
}

/* ---------------------------------------------------------
   (5) تطبيق اتجاه ولغة الصفحة + النصوص الثابتة
   --------------------------------------------------------- */
function applyLang() {
  const html = document.documentElement;
  html.lang = currentLang;
  html.dir = currentLang === "ar" ? "rtl" : "ltr";

  // النصوص الثابتة (textContent)
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  // النصوص النائبة (placeholders)
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  // زر اللغة يعرض اللغة الأخرى
  document.getElementById("langLabel").textContent = t("langLabel");
}

/* ---------------------------------------------------------
   (6) بناء الواجهة من البيانات (يحترم اللغة)
   --------------------------------------------------------- */
function renderPage(d) {
  currentData = d;
  applyColors(d.colors);
  applyLang();

  const mark = (pick(d,"logoText") || pick(d,"name") || "م").charAt(0);
  document.getElementById("logoMark").textContent = mark;
  document.getElementById("footerMark").textContent = mark;
  document.getElementById("logoText").textContent = pick(d,"logoText") || pick(d,"name");
  document.getElementById("footerText").textContent = pick(d,"logoText") || pick(d,"name");

  document.getElementById("greeting").textContent = getGreeting();
  document.getElementById("heroName").textContent = pick(d,"name");
  document.getElementById("heroTagline").textContent = pick(d,"tagline");
  document.getElementById("heroAbout").textContent = pick(d,"about");
  document.getElementById("footerTagline").textContent = pick(d,"tagline");
  document.title = `${pick(d,"name")} — ${pick(d,"kind")}`;

  const wa = waLink(d.phone);
  document.getElementById("heroWhatsapp").href = wa;
  document.getElementById("floatWhatsapp").href = wa;

  document.getElementById("seasonText").textContent = t("season_" + getSeason());

  // ---- الأطباق ----
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = (d.dishes || []).map((dish,i) => `
    <article class="dish-card reveal">
      <div class="dish-img">
        <img src="${dish.img}" alt="${pick(dish,"name")}" loading="lazy" />
        ${pick(dish,"tag") ? `<span class="dish-tag">${pick(dish,"tag")}</span>` : ""}
      </div>
      <div class="dish-body">
        <h3>${pick(dish,"name")}</h3>
        <p class="muted">${pick(dish,"desc")}</p>
        <div class="dish-foot">
          <span class="dish-price">${dish.price} ${t("currency")}</span>
          <button class="dish-order" data-i="${i}"><i class="fa-brands fa-whatsapp"></i> ${t("order_btn")}</button>
        </div>
      </div>
    </article>`).join("");
  grid.querySelectorAll(".dish-order").forEach(btn => {
    btn.addEventListener("click", () => {
      const dish = d.dishes[btn.dataset.i];
      window.open(waLink(d.phone, pick(dish,"name")), "_blank");
    });
  });

  // ---- طبق اليوم ----
  const today = pickDishOfDay(d.dishes);
  if (today) {
    document.getElementById("todayName").textContent = pick(today,"name");
    document.getElementById("todayDesc").textContent = pick(today,"desc");
    document.getElementById("todayPrice").textContent = today.price;
    document.getElementById("todayImg").src = today.img;
    document.getElementById("todayOrder").href = waLink(d.phone, pick(today,"name"));
  }

  // ---- المعرض ----
  const gal = document.getElementById("galleryGrid");
  gal.innerHTML = (d.gallery || []).map((g,i) => `
    <figure class="gallery-item reveal" data-i="${i}">
      <img src="${g.img}" alt="${pick(g,"caption")}" loading="lazy" />
      <figcaption>${pick(g,"caption")}</figcaption>
    </figure>`).join("");
  gal.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const g = d.gallery[item.dataset.i];
      openLightbox(g.img, pick(g,"caption"));
    });
  });

  // ---- الآراء ----
  document.getElementById("reviewsGrid").innerHTML = (d.reviews || []).map(r => `
    <div class="review-card reveal">
      <div class="review-stars">${starsHTML(r.stars)}</div>
      <p class="review-text">"${pick(r,"text")}"</p>
      <div class="review-name"><i class="fa-solid fa-circle-user"></i> ${r.name}</div>
    </div>`).join("");

  // ---- الساعات ----
  document.getElementById("hoursList").innerHTML = (d.hours || []).map(h => `
    <li><span>${pick(h,"day")}</span><span class="muted">${pick(h,"time")}</span></li>`).join("");
  document.getElementById("addressText").textContent = pick(d,"address");

  // ---- الخريطة ----
  const q = encodeURIComponent(d.mapQuery || pick(d,"address") || "Riyadh");
  document.getElementById("mapFrame").src = `https://maps.google.com/maps?q=${q}&z=15&output=embed`;

  // ---- التواصل الاجتماعي ----
  document.querySelectorAll("#socialLinks a").forEach(a => {
    if (d.social && d.social[a.dataset.net]) a.href = d.social[a.dataset.net];
  });

  setupContactForm(d.formspree);
  document.getElementById("year").textContent = new Date().getFullYear();
  initScrollReveal();
}

/* ---------------------------------------------------------
   (7) نافذة الصورة المكبّرة (Lightbox)
   --------------------------------------------------------- */
function openLightbox(src, caption) {
  const lb = document.getElementById("lightbox");
  document.getElementById("lightboxImg").src = src;
  document.getElementById("lightboxCaption").textContent = caption || "";
  lb.classList.add("open");
}
function initLightbox() {
  const lb = document.getElementById("lightbox");
  const close = () => lb.classList.remove("open");
  document.getElementById("lightboxClose").addEventListener("click", close);
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

/* ---------------------------------------------------------
   (8) نموذج التواصل (Formspree)
   --------------------------------------------------------- */
function setupContactForm(endpoint) {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form) return;
  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!endpoint || endpoint.includes("your_form_id")) {
      status.textContent = t("form_noendpoint"); status.className = "form-status err"; return;
    }
    status.textContent = t("form_sending"); status.className = "form-status";
    try {
      const res = await fetch(endpoint, { method:"POST", body:new FormData(form), headers:{Accept:"application/json"} });
      if (res.ok) { status.textContent = t("form_ok"); status.className = "form-status ok"; form.reset(); }
      else throw new Error();
    } catch { status.textContent = t("form_err"); status.className = "form-status err"; }
  };
}

/* ---------------------------------------------------------
   (9) أنيميشن التمرير
   --------------------------------------------------------- */
function initScrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => io.observe(el));
}

/* ---------------------------------------------------------
   (10) شريط التنقل + زر اللغة
   --------------------------------------------------------- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const navbar = document.getElementById("navbar");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
  window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", window.scrollY > 20));

  // زر تبديل اللغة: يبدّل، يحفظ الاختيار، ويعيد بناء الصفحة
  document.getElementById("langBtn").addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("lang", currentLang);
    if (currentData) renderPage(currentData);
  });
}

/* ---------------------------------------------------------
   (11) البداية
   --------------------------------------------------------- */
(async function init() {
  initNav();
  initLightbox();
  const type = detectType();
  const data = await loadData(type);
  renderPage(data);
})();
