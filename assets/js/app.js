/* ==========================================================================
   Phykar Store — app.js
   Shared behaviour: header/footer, product rendering, WhatsApp deep links,
   search + filters, and the gift-box builder.
   No dependencies. Everything degrades gracefully.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.STORE;

  /* ------------------------------------------------------------------ util */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* Currency — ₦4,400 */
  function money(n) {
    return (S.currency || "₦") + Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 });
  }

  /* Human label for a product price, including ranges and "from" pricing. */
  function priceLabel(p) {
    if (p.price == null) return { text: "Ask for price", dm: true };
    if (p.priceMax) return { text: money(p.price) + " – " + money(p.priceMax) };
    if (p.priceFrom) return { text: "From " + money(p.price) };
    return { text: money(p.price) };
  }

  /* Compact price used inside WhatsApp messages and the box builder. */
  function priceShort(p) {
    if (p.price == null) return "price on request";
    if (p.priceMax) return money(p.price) + "–" + money(p.priceMax);
    if (p.priceFrom) return "from " + money(p.price);
    return money(p.price);
  }

  /* "Hi Phykar!" — short name, so the greeting doesn't read "Hi Shop with Phykar!" */
  function hi() { return "Hi " + (S.shortName || S.brand) + "!"; }

  /* The footer opens with a plain "Home" link instead of the wordmark image.
     The mark is still used for the browser tab icon (hardcoded in each page's
     <link rel="icon">); as a footer tile it read as a flat block. */
  function footHome() {
    return '<a class="foot-home" href="index.html">Home</a>';
  }

  /* Universal WhatsApp deep link with a pre-filled message. */
  /* Outgoing WhatsApp messages are flattened to characters that every phone and
     desktop font can draw. Emoji, smart dashes and bullet points are lovely in
     the browser but turn into an empty "missing glyph" box on a device whose
     font set is incomplete, and that box ends up inside the customer's chat. The
     site UI keeps the pretty glyphs; only the message text is normalised. */
  /* Ranges must sit inside [] and must use the same escape style throughout:
     a bare a-z is a lazy quantifier, and mixing \uXXXX with \u{XXXX} in one
     class silently matches nothing. */
  var KEEP_EMOJI = S.messageEmoji === "keep";

  /* Typographic characters that some fonts lack, replaced with plain ASCII
     lookalikes. Applied in both modes. */
  var WA_SAFE = [
    [/\u{00A0}/gu, " "],              /* non-breaking space */
    [/[\u{2014}\u{2013}]/gu, "-"],    /* em dash, en dash */
    [/\u{2026}/gu, "..."],            /* ellipsis */
    [/[\u{2022}\u{00B7}]/gu, "-"],    /* bullet, middle dot */
    [/\u{00D7}/gu, "x"],              /* multiplication sign */
    [/\u{2212}/gu, "-"],              /* minus sign */
    [/[\u{2713}\u{2714}]/gu, "v"]     /* check marks */
  ];

  /* Emoji handling. With messageEmoji: "strip" every pictograph goes, along
     with the variation selectors, zero-width joiner and the stray female /
     copyright signs that ride along inside emoji sequences - leaving those
     behind would produce the same empty box we are trying to avoid.
     With "keep" none of this runs, so WhatsApp renders the emoji as typed. */
  if (!KEEP_EMOJI) {
    WA_SAFE = WA_SAFE.concat([
      [/[\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1FFFF}]/gu, ""],
      [/[\u{FE0E}\u{FE0F}]/gu, ""],
      [/\u{200D}/gu, ""],
      [/[\u{2640}\u{00A9}]/gu, ""]
    ]);
  }

  /* Every outgoing message is percent-encoded exactly once, here. The result is
     pure ASCII, so nothing can be mangled in transit by a browser, an
     intermediate proxy or WhatsApp itself. */
  function waLink(message) {
    return "https://wa.me/" + S.waNumber + "?text=" + encodeURIComponent(waText(message));
  }

  function waText(s) {
    var out = String(s == null ? "" : s);
    for (var i = 0; i < WA_SAFE.length; i++) out = out.replace(WA_SAFE[i][0], WA_SAFE[i][1]);
    return out
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function currentPage() {
    var b = document.body;
    return b.getAttribute("data-page") || "";
  }

  function siteUrl() {
    return location.origin && location.origin !== "null"
      ? location.origin + location.pathname
      : "https://wa.me/" + S.waNumber;
  }

  /* ----------------------------------------------------------------- icons */

  var ICONS = {
    wa: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.894 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.465 3.488"/></svg>',
    search: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"/></svg>',
    arrow: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>',
    pin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5"/></svg>',
    clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16m.5-13H11v6l5.2 3.1.8-1.3-4.5-2.7z"/></svg>',
    truck: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 8h-3V4H3a2 2 0 0 0-2 2v11h2a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h2v-5zm-6 9H6.8A3 3 0 0 0 2 18.2 3 3 0 0 0 8 18h6a3 3 0 0 0 0-1m4-2h-2.2a3 3 0 0 0-5.6 0H8V6h6zm3 1a3 3 0 0 0-2-2.8V14h4z"/></svg>',
    tiktok: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06v-3.1a5.66 5.66 0 0 0-.77-.05A5.66 5.66 0 0 0 4.2 15.4a5.66 5.66 0 0 0 5.66 5.66 5.66 5.66 0 0 0 5.66-5.66V9.01a7.35 7.35 0 0 0 4.28 1.37V7.3a4.29 4.29 0 0 1-3.2-1.48"/></svg>',
    cal: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m0 15H5a1 1 0 0 1-1-1v-8h16v8a1 1 0 0 1-1 1m0-10H4V7a1 1 0 0 1 1-1h1v2h2V6h8v2h2V6h1a1 1 0 0 1 1 1z"/></svg>',
    mail: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>',
    mapPin: '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5"/></svg>',
    bag: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    sun: '<svg class="ico ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 1.8v2.4M12 19.8v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M1.8 12h2.4M19.8 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/></svg>',
    moon: '<svg class="ico ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 13.2A9 9 0 1 1 10.8 3a7 7 0 0 0 10.2 10.2"/></svg>'
  };

  /* --------------------------------------------------------- header/footer */

  /* Dark mode. The very first paint is handled by a tiny inline script in each
     page's <head>, which is the only way to set data-theme before the browser
     paints — app.js sits at the end of <body> and would flash light first. This
     code only owns the button: it re-applies whatever the head script decided
     (so the glyph and aria state match) and writes the user's choice back.

     A stored "light" always wins over the OS preference, so someone who has
     deliberately turned dark mode off is not overridden on every visit. */
  var THEME_KEY = "phykar.theme.v1";

  function themeCurrent() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function themeApply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (err) { /* storage blocked — theme lasts this page only */ }

    var d = document.documentElement;
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#150d16" : "#3b1f38");

    $$(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  function mountThemeToggle() {
    $$(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        themeApply(themeCurrent() === "dark" ? "light" : "dark");
      });
    });
    themeApply(themeCurrent());
  }

  function mountHeader() {
    var host = $("#site-header");
    if (!host) return;
    var page = currentPage();

    var links = S.nav.map(function (item) {
      var active = item.href === page ? ' aria-current="page"' : "";
      return '<li><a href="' + esc(item.href) + '"' + active + ">" + esc(item.label) + "</a></li>";
    }).join("");

    var tt = S.tiktok
      ? '<a class="icon-btn tt" href="' + esc(S.tiktok) + '" target="_blank" rel="noopener" aria-label="TikTok" title="TikTok">' + ICONS.tiktok + "</a>"
      : "";

    var cartBtn =
      '<button class="icon-btn cart-btn" type="button" data-cart-toggle aria-label="Your cart" title="Your cart">' +
        ICONS.bag + '<span class="cart-count" data-cart-count hidden>0</span>' +
      "</button>";

    /* Dark mode toggle sits with the cart and TikTok. Both glyphs ship and CSS
       shows one, so aria-pressed + the label set by mountThemeToggle() describe
       the current state without needing the icons to swap in JS. */
    var themeBtn =
      '<button class="icon-btn theme-toggle" type="button" aria-pressed="false" ' +
        'aria-label="Switch to dark mode" title="Switch to dark mode">' +
        ICONS.sun + ICONS.moon +
      "</button>";

    /* Brand lockup, far left: circular logo mark + wordmark. The .brand auto
       margin pushes the links, cart and TikTok to the right. If the logo file is
       missing the mark falls back to the rose/gold disc behind it.

       The wordmark runs the words together as a single mark ("ShopwithPhykar").
       Only the visible text is compacted - the aria-label and every other use of
       S.brand (page titles, footer, image alt) keep the spaced name, so the
       business name is still written and pronounced normally everywhere else. */
    var markName = String(S.brand).replace(/\s+/g, "");
    var brand =
      '<a class="brand" href="index.html" aria-label="' + esc(S.brand) + ' — home">' +
        '<span class="brand-mark">' +
          '<img src="' + esc(S.logo) + '" alt="" width="42" height="42" onerror="this.remove()">' +
        "</span>" +
        '<span class="brand-name">' + esc(markName) + "</span>" +
      "</a>";

    host.className = "site-header";
    host.innerHTML =
      '<div class="wrap"><nav class="nav" aria-label="Main">' +
        brand +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Open menu">' +
          "<span></span><span></span><span></span>" +
        "</button>" +

        '<ul class="nav-links desktop-only">' + links + "</ul>" +
        '<div class="nav-actions">' + themeBtn + cartBtn + tt + "</div>" +

        '<div class="nav-menu" id="nav-menu">' +
          '<ul class="nav-links">' + links + "</ul>" +
        "</div>" +
      "</nav></div>";

    var toggle = $(".nav-toggle", host);
    var menu = $("#nav-menu", host);
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    var onScroll = function () {
      host.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function mountFooter() {
    var host = $("#site-footer");
    if (!host) return;

    var shopLinks = S.nav.filter(function (i) { return i.href !== "index.html"; })
      .map(function (i) { return '<li><a href="' + esc(i.href) + '">' + esc(i.label) + "</a></li>"; }).join("");

    var helpLinks = [
      '<li><a href="bundles.html#how">How to order</a></li>',
      '<li><a href="appointments.html">Book an appointment</a></li>',
      '<li><a href="bundles.html#faq">Delivery &amp; FAQ</a></li>',
      '<li><a href="' + esc(waLink(hi() + " I have a question about an item.")) + '" target="_blank" rel="noopener">Ask a question</a></li>',
      '<li><a href="' + esc(waLink(hi() + " I'd like a custom gift box.")) + '" target="_blank" rel="noopener">Custom gift box</a></li>',
      '<li><a href="' + esc(S.catalogueUrl) + '" target="_blank" rel="noopener">WhatsApp catalogue</a></li>'
    ].join("");

    var mailBtn = S.email
      ? '<a class="icon-btn" href="mailto:' + esc(S.email) + '" aria-label="Email ' + esc(S.brand) + '" title="' + esc(S.email) + '">' + ICONS.mail + "</a>"
      : "";

    var mapBtn = S.locationUrl
      ? '<a class="icon-btn" href="' + esc(S.locationUrl) + '" target="_blank" rel="noopener" aria-label="Find us on Google Maps" title="Find us on Google Maps">' + ICONS.mapPin + "</a>"
      : "";

    var social =
      '<div class="social">' +
        '<a class="icon-btn tt" href="' + esc(S.tiktok) + '" target="_blank" rel="noopener" aria-label="TikTok" title="TikTok">' + ICONS.tiktok + "</a>" +
        '<a class="icon-btn" href="' + esc(S.catalogueUrl) + '" target="_blank" rel="noopener" aria-label="WhatsApp catalogue" title="WhatsApp catalogue">' + ICONS.wa + "</a>" +
        mailBtn + mapBtn +
      "</div>";

    host.className = "site-footer";
    host.innerHTML =
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          "<div>" +
            footHome() +
            "<p>" + esc(S.tagline) + ". Every order is confirmed personally on WhatsApp before payment.</p>" +
            '<a class="btn btn-wa btn-sm" href="' + esc(waLink(hi() + " I'd like to browse your catalogue.")) + '" target="_blank" rel="noopener">' + ICONS.wa + " Chat with us</a>" +
          "</div>" +
          "<div><h4>Shop</h4><ul>" + shopLinks + "</ul></div>" +
          "<div><h4>Help</h4><ul>" + helpLinks + "</ul></div>" +
          "<div>" +
            "<h4>Find us</h4>" +
            "<ul>" +
              "<li>Based in Lagos, Nigeria</li>" +
              "<li>Same-day delivery in Lagos</li>" +
              "<li>Nationwide delivery available</li>" +
              "<li>Appointments Mon&ndash;Sat</li>" +
            "</ul>" +
            social +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>&copy; " + new Date().getFullYear() + " " + esc(S.brand) + ". All rights reserved.</span>" +
          "<span>Made with care in Lagos &middot; Prices subject to change</span>" +
        "</div>" +
      "</div>";
  }

  function mountFloat() {
    var host = $("#wa-float");
    if (!host) return;
    host.className = "wa-float";
    host.setAttribute("role", "button");
    host.setAttribute("aria-label", "Order on WhatsApp");
    host.innerHTML = ICONS.wa + '<span class="lbl">Order on WhatsApp</span><span class="wa-count" data-cart-count hidden></span>';
    host.addEventListener("click", function (e) {
      e.preventDefault();
      sendCart();
    });
  }

  /* -------------------------------------------------------- product cards */

  function productOrderLink(p, qty) {
    var cat = S.categories.filter(function (c) { return c.id === p.cat; })[0];
    var q = qty > 1 ? qty + " × " : "";
    var lines = [
      hi() + " 👋 I'd like to place an order.",
      "",
      "• " + q + p.name + " — " + priceShort(p),
      "• Category: " + (cat ? cat.label : p.cat),
      "",
      "Please confirm availability, delivery fee and payment details. Thank you!"
    ];
    return waLink(lines.join("\n"));
  }

  function productCard(p) {
    var price = priceLabel(p);
    var tag = p.tag
      ? '<span class="product-tag' + (/best/i.test(p.tag) ? " bestseller" : "") + '">' + esc(p.tag) + "</span>"
      : "";
    var art = p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">'
      : '<span class="glyph" aria-hidden="true">' + (p.glyph || "✨") + "</span>";

    var inCart = cartQty(p.id);
    var cartPill = inCart
      ? '<span class="in-cart" data-pill-for="' + esc(p.id) + '">In cart &middot; ' + inCart + "</span>"
      : "";

    return (
      '<article class="product" data-id="' + esc(p.id) + '" data-group="' + esc(p.group || "") + '" data-name="' + esc(p.name.toLowerCase()) + '">' +
        '<div class="product-art">' + tag + art + "</div>" +
        '<div class="product-body">' +
          "<h3>" + esc(p.name) + "</h3>" +
          '<p class="product-cat">' + esc(p.group || "") + "</p>" +
          '<p class="price' + (price.dm ? " is-dm" : "") + '">' + esc(price.text) + "</p>" +
          cartPill +
          '<div class="product-actions">' +
            '<button class="btn btn-dark btn-sm" type="button" data-add="' + esc(p.id) + '">Add to cart</button>' +
            '<a class="btn btn-wa btn-sm" href="' + esc(productOrderLink(p)) + '" target="_blank" rel="noopener" aria-label="Order ' + esc(p.name) + ' on WhatsApp">' +
              ICONS.wa + (price.dm ? " Enquire" : " Order") + "</a>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }


  /* ------------------------------------------------------ category pages */

  function initCategoryPage() {
    var grid = $("#product-grid");
    if (!grid) return;

    var catId = document.body.getAttribute("data-category");
    var cat = S.categories.filter(function (c) { return c.id === catId; })[0];
    if (!cat) return;

    var all = S.products.filter(function (p) { return p.cat === catId; });
    var groups = [];
    all.forEach(function (p) {
      if (p.group && groups.indexOf(p.group) === -1) groups.push(p.group);
    });

    /* group filter chips */
    var chips = $("#filter-chips");
    if (chips && groups.length > 1) {
      chips.innerHTML =
        '<button class="chip" type="button" data-filter="all" aria-pressed="true">All items</button>' +
        groups.map(function (g) {
          return '<button class="chip" type="button" data-filter="' + esc(g) + '" aria-pressed="false">' + esc(g) + "</button>";
        }).join("");

      chips.addEventListener("click", function (e) {
        var btn = e.target.closest(".chip");
        if (!btn) return;
        $$(".chip", chips).forEach(function (c) { c.setAttribute("aria-pressed", String(c === btn)); });
        state.group = btn.getAttribute("data-filter");
        draw();
      });
    }

    /* state + draw */
    var state = { group: "all", q: "" };

    function draw() {
      var list = all.filter(function (p) {
        var okGroup = state.group === "all" || p.group === state.group;
        var okQ = !state.q || p.name.toLowerCase().indexOf(state.q) !== -1;
        return okGroup && okQ;
      });

      grid.innerHTML = list.length
        ? list.map(productCard).join("")
        : '<p class="empty">No items match that search. Try a different word, or ask us on WhatsApp.</p>';

      var live = $("#result-count");
      if (live) live.textContent = list.length ? "Showing " + list.length : "";
    }

    var search = $("#search");
    if (search) {
      search.addEventListener("input", function () {
        state.q = search.value.trim().toLowerCase();
        draw();
      });
    }

    draw();
  }

  /* ------------------------------------------------------- home page bits */

  function initHome() {
    /* Large category tiles — the main navigation. No item counts. */
    var catHost = $("#category-cards");
    if (catHost) {
      catHost.innerHTML = S.categories.map(function (c) {
        return (
          '<a class="cat-card" href="' + esc(c.href) + '">' +
            '<div class="cat-art" aria-hidden="true">' + c.icon + "</div>" +
            '<div class="cat-body">' +
              "<h3>" + esc(c.label) + "</h3>" +
              "<p>" + esc(c.blurb) + "</p>" +
              '<span class="cat-arrow">Browse ' + ICONS.arrow + "</span>" +
            "</div>" +
          "</a>"
        );
      }).join("");
    }

    /* Compact service strip, links straight into the booking flow */
    var svcHost = $("#service-strip");
    if (svcHost) {
      svcHost.innerHTML = S.services.map(function (s) {
        return (
          '<a class="svc-item" href="appointments.html?service=' + esc(s.id) + '">' +
            '<span class="ico-face" aria-hidden="true">' + s.icon + "</span>" +
            "<span><b>" + esc(s.title) + "</b><span>" + esc(s.text) + "</span></span>" +
          "</a>"
        );
      }).join("");
    }

    /* Brand portrait, injected so the path lives in one place */
    var face = $("#brand-face");
    if (face && S.face) {
      face.innerHTML =
        '<div class="portrait-frame">' +
          '<img src="' + esc(S.face) + '" alt="' + esc(S.brand) + '" width="961" height="1280">' +
          '<span class="portrait-ring" aria-hidden="true"></span>' +
          '<span class="portrait-tag">Face of the brand</span>' +
        "</div>";
    }

    mountFaq();
  }

  function mountFaq() {
    var host = $("#faq-list");
    if (!host) return;
    host.className = "faq";
    host.innerHTML = S.faqs.map(function (f) {
      return (
        "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>"
      );
    }).join("");
  }

  /* ---------------------------------------------------------- gift boxes */

  function initBundles() {
    var host = $("#tier-grid");
    if (!host) return;

    host.className = "grid tier-grid";
    host.innerHTML = S.bundles.map(function (b) {
      var priceBlock = b.price != null
        ? '<p class="tier-price">' + money(b.price) + " <small>" + esc(b.priceNote || "") + "</small></p>"
        : '<p class="tier-price">' + esc(b.priceLabel || "Custom") + " <small>" + (b.priceNote || "to your budget") + "</small></p>";

      var msg = b.price != null
        ? "Hi! I want to order the " + String(b.price).toLocaleString("en-NG") + " Gift Box — " + b.name + ". Please send me the available items and delivery details."
        : "Hi! I would like to discuss a custom gift package with a liaison. My budget and recipient details are below:";

      var tierArt = b.image
        ? '<div class="tier-art"><img src="' + esc(b.image) + '" alt="' + esc(b.name) + '" loading="lazy" decoding="async"></div>'
        : '<div class="tier-emoji" aria-hidden="true">' + b.emoji + "</div>";

      return (
        '<article class="tier' + (b.featured ? " featured" : "") + '">' +
          (b.featured ? '<span class="tier-ribbon">Most popular</span>' : "") +
          tierArt +
          "<h3>" + esc(b.name) + "</h3>" +
          '<p class="tier-sub">' + esc(b.blurb) + "</p>" +
          priceBlock +
          "<ul>" + b.includes.map(function (i) {
            return '<li><span class="tick" aria-hidden="true">✓</span><span>' + esc(i) + "</span></li>";
          }).join("") + "</ul>" +
          '<a class="btn ' + (b.featured ? "btn-onDark" : "btn-wa") + ' btn-block" href="' +
            esc(waLink(msg)) + '" target="_blank" rel="noopener">' +
            (b.price != null ? ICONS.wa : "💬") + " " + esc(b.cta) + "</a>" +
        "</article>"
      );
    }).join("");

    initBuilder();
  }

  /* ------------------------------------------------------------- builder */

  var BUILDER_KEY = "phykar.box.v1";
  var picked = {};          /* productId -> qty */
  var details = {};         /* form field -> value */

  function initBuilder() {
    var picker = $("#builder-picker");
    var summary = $("#builder-summary");
    if (!picker || !summary) return;

    /* group the pickable (priced) products by category */
    var groups = S.categories.map(function (c) {
      return {
        cat: c,
        items: S.products.filter(function (p) { return p.cat === c.id && p.price != null; })
      };
    }).filter(function (g) { return g.items.length; });

    picker.innerHTML =
      "<h3>Pick your items</h3>" +
      "<p>Use <b>&minus;</b> and <b>+</b> to add or remove items. Your selection is saved on this device.</p>" +
      groups.map(function (g) {
        return (
          '<div class="builder-group">' +
            "<h4>" + g.cat.icon + " " + esc(g.cat.label) + "</h4>" +
            '<div class="builder-items">' +
              g.items.map(function (p) {
                return (
                  '<div class="pick-row">' +
                    '<div class="pick" data-pick="' + esc(p.id) + '" role="button" tabindex="0" aria-pressed="false">' +
                      '<span class="glyph" aria-hidden="true">' + (p.glyph || "✨") + "</span>" +
                      '<span class="txt"><b>' + esc(p.name) + "</b><span>" + esc(priceShort(p)) + "</span></span>" +
                    "</div>" +
                    '<div class="stepper" data-stepper="' + esc(p.id) + '">' +
                      '<button class="step" type="button" data-dec="' + esc(p.id) + '" aria-label="Remove one ' + esc(p.name) + '" disabled>&minus;</button>' +
                      '<span class="qty" data-qty-for="' + esc(p.id) + '">0</span>' +
                      '<button class="step" type="button" data-inc="' + esc(p.id) + '" aria-label="Add one ' + esc(p.name) + '">+</button>' +
                    "</div>" +
                  "</div>"
                );
              }).join("") +
            "</div>" +
          "</div>"
        );
      }).join("");

    /* hydrate from storage */
    try {
      var saved = JSON.parse(localStorage.getItem(BUILDER_KEY) || "{}");
      if (saved.picked) picked = saved.picked;
      if (saved.details) details = saved.details;
    } catch (err) { /* storage blocked — continue with empty selection */ }

    var form = $("#box-form");
    if (form) {
      ["name", "forWhom", "occasion", "budget", "notes"].forEach(function (key) {
        var field = form.elements[key];
        if (field && details[key]) field.value = details[key];
      });
      form.addEventListener("submit", function (e) { e.preventDefault(); sendBox(); });
      form.addEventListener("input", function (e) {
        var key = e.target.name;
        if (key) { details[key] = e.target.value; save(); }
      });
      form.addEventListener("change", function (e) {
        var key = e.target.name;
        if (key) { details[key] = e.target.value; save(); }
      });
    }

    var clearBtn = $("#box-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        picked = {};
        save();
        drawBox();
        toast("Box cleared");
      });
    }

    /* steppers: + adds one, − removes one, tapping the row adds one */
    function bump(id, delta) {
      var next = Math.max(0, (picked[id] || 0) + delta);
      if (next === 0) { delete picked[id]; } else { picked[id] = next; }
      save();
      drawBox();
    }

    picker.addEventListener("click", function (e) {
      var inc = e.target.closest("[data-inc]");
      if (inc) { bump(inc.getAttribute("data-inc"), 1); return; }

      var dec = e.target.closest("[data-dec]");
      if (dec && !dec.disabled) { bump(dec.getAttribute("data-dec"), -1); return; }

      var row = e.target.closest("[data-pick]");
      if (row) bump(row.getAttribute("data-pick"), 1);
    });

    /* keyboard support for the row-as-button */
    picker.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var row = e.target.closest("[data-pick]");
      if (!row) return;
      e.preventDefault();
      bump(row.getAttribute("data-pick"), 1);
    });

    var sendBtn = $("#box-send");
    if (sendBtn) sendBtn.addEventListener("click", sendBox);

    drawBox();
  }

  function save() {
    try {
      localStorage.setItem(BUILDER_KEY, JSON.stringify({ picked: picked, details: details }));
    } catch (err) { /* ignore quota / privacy errors */ }
  }

  function productById(id) {
    return S.products.filter(function (p) { return p.id === id; })[0];
  }

  function drawBox() {
    /* toggle pressed states, counters and stepper enabled state */
    $$("[data-pick]").forEach(function (row) {
      var id = row.getAttribute("data-pick");
      var q = picked[id] || 0;
      row.setAttribute("aria-pressed", String(q > 0));
      row.classList.toggle("is-on", q > 0);
      var badge = $('[data-qty-for="' + id + '"]');
      if (badge) badge.textContent = String(q);
      var dec = $('[data-dec="' + id + '"]');
      if (dec) dec.disabled = q === 0;
    });

    var ids = Object.keys(picked).filter(function (id) { return picked[id] > 0; });
    var list = $("#box-list");
    var total = 0;
    var counted = 0;

    var rows = ids.map(function (id) {
      var p = productById(id);
      if (!p) return "";
      var q = picked[id];
      var unit = p.price != null ? p.price : 0;
      if (p.price != null) { total += unit * q; counted += unit * q; }
      return (
        "<li><span>" + (q > 1 ? q + " × " : "") + esc(p.name) + "</span>" +
        "<span>" + esc(p.price != null ? money(unit * q) : "on request") + "</span></li>"
      );
    }).filter(Boolean);

    if (list) {
      list.innerHTML = rows.length
        ? rows.join("")
        : '<li class="none">No items yet — start picking on the left.</li>';
    }

    var totalEl = $("#box-total");
    if (totalEl) totalEl.textContent = money(counted);

    var hint = $("#box-hint");
    if (hint) {
      if (!ids.length) hint.textContent = "Your running total appears here as you pick items.";
      else if (counted < 10000) hint.textContent = "₦" + (10000 - counted).toLocaleString("en-NG") + " more to reach the Starter Box value.";
      else if (counted < 25000) hint.textContent = "₦" + (25000 - counted).toLocaleString("en-NG") + " more to reach the Signature Box value.";
      else if (counted < 50000) hint.textContent = "₦" + (50000 - counted).toLocaleString("en-NG") + " more to reach the Deluxe Box value.";
      else hint.textContent = "Building a custom package.";
    }

    var sendBtn = $("#box-send");
    if (sendBtn) sendBtn.classList.toggle("is-empty", !ids.length);
  }

  function sendBox() {
    var ids = Object.keys(picked).filter(function (id) { return picked[id] > 0; });
    var nameField = ($("#box-form") && $("#box-form").elements.name) || null;
    var d = {
      name: (nameField && nameField.value.trim()) || details.name || "",
      forWhom: details.forWhom || "",
      occasion: details.occasion || "",
      budget: details.budget || "",
      notes: details.notes || ""
    };

    var lines = [hi() + " 👋 I'd like to order a custom gift box."];

    if (ids.length) {
      var total = 0;
      lines.push("", "Items:");
      ids.forEach(function (id) {
        var p = productById(id);
        if (!p) return;
        var q = picked[id];
        var line = "• " + (q > 1 ? q + " × " : "") + p.name + " — " + priceShort(p);
        lines.push(line);
        if (p.price != null) total += p.price * q;
      });
      lines.push("", "Estimated total: " + money(total));
    } else {
      lines.push("", "I'd like help choosing the items — please send me your recommendations.");
    }

    if (d.budget) lines.push("My budget: " + d.budget);
    if (d.forWhom) lines.push("Recipient: " + d.forWhom);
    if (d.occasion) lines.push("Occasion: " + d.occasion);
    if (d.notes) lines.push("Notes: " + d.notes);
    if (d.name) lines.push("My name: " + d.name);

    lines.push("", "Please confirm availability, packaging and delivery. Thank you!");

    window.open(waLink(lines.join("\n")), "_blank", "noopener");
    toast("Opening WhatsApp with your box…");
  }

  /* ------------------------------------------------------------- the cart */

  var CART_KEY = "phykar.cart.v1";
  var cart = {};           /* productId -> qty */

  function cartQty(id) { return cart[id] || 0; }

  function cartUnits() {
    return Object.keys(cart).reduce(function (n, id) { return n + cart[id]; }, 0);
  }

  function cartTotal() {
    return Object.keys(cart).reduce(function (n, id) {
      var p = productById(id);
      return n + (p && p.price != null ? p.price * cart[id] : 0);
    }, 0);
  }

  function cartSave() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (err) { /* ignore */ }
  }

  function cartLoad() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
      if (raw && typeof raw === "object") cart = raw;
    } catch (err) { /* storage blocked — start empty */ }
    /* drop anything that no longer exists in the catalogue */
    Object.keys(cart).forEach(function (id) {
      if (!productById(id) || cart[id] < 1) delete cart[id];
    });
  }

  /* one place that repaints every count on the page */
  function drawCart() {
    var n = cartUnits();
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
    var floatBtn = $("#wa-float");
    if (floatBtn) {
      floatBtn.classList.toggle("has-items", n > 0);
      floatBtn.setAttribute("aria-label", n > 0
        ? "Order on WhatsApp — " + n + " item" + (n === 1 ? "" : "s") + " in your cart"
        : "Order on WhatsApp");
    }
    $$("[data-pill-for]").forEach(function (pill) {
      var q = cartQty(pill.getAttribute("data-pill-for"));
      pill.textContent = "In cart · " + q;
    });
    drawCartPanel();
  }

  function cartBump(id, delta) {
    var p = productById(id);
    if (!p) return;
    var next = Math.max(0, cartQty(id) + delta);
    if (next === 0) delete cart[id]; else cart[id] = next;
    cartSave();
    drawCart();
    syncCardPills();
    if (delta > 0) toast(p.name + " added to your cart 🛍️");
  }

  /* keep the "In cart · n" pill in sync without re-rendering whole grids */
  function syncCardPills() {
    $$("[data-add]").forEach(function (btn) {
      var id = btn.getAttribute("data-add");
      var q = cartQty(id);
      var card = btn.closest(".product");
      if (!card) return;
      var body = card.querySelector(".product-body");
      if (!body) return;
      var actions = card.querySelector(".product-actions");
      var pill = card.querySelector('[data-pill-for="' + id + '"]');
      if (q > 0) {
        if (!pill) {
          pill = document.createElement("span");
          pill.className = "in-cart";
          pill.setAttribute("data-pill-for", id);
          body.insertBefore(pill, actions);
        }
        pill.textContent = "In cart · " + q;
      } else if (pill) {
        pill.remove();
      }
    });
  }

  /* the slide-over cart */
  function drawCartPanel() {
    var panel = $("#cart-panel");
    if (!panel) return;

    var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });
    var body = $("#cart-body", panel);
    var foot = $("#cart-foot", panel);

    if (!ids.length) {
      body.innerHTML =
        '<div class="cart-empty">' +
          "<p><b>Your cart is empty</b></p>" +
          "<p>Tap <b>Add to cart</b> on any product and it will show up here.</p>" +
        "</div>";
      foot.hidden = true;
      return;
    }

    body.innerHTML = "<ul>" + ids.map(function (id) {
      var p = productById(id);
      if (!p) return "";
      var q = cart[id];
      return (
        "<li>" +
          '<span class="ci-art" aria-hidden="true">' + (p.glyph || "✨") + "</span>" +
          '<span class="ci-txt"><b>' + esc(p.name) + "</b><span>" + esc(priceShort(p)) + "</span></span>" +
          '<span class="ci-step">' +
            '<button class="step" type="button" data-cart-dec="' + esc(id) + '" aria-label="Remove one ' + esc(p.name) + '">&minus;</button>' +
            '<span class="qty">' + q + "</span>" +
            '<button class="step" type="button" data-cart-inc="' + esc(id) + '" aria-label="Add one ' + esc(p.name) + '">+</button>' +
          "</span>" +
          '<span class="ci-sum">' + esc(p.price != null ? money(p.price * q) : "on request") + "</span>" +
          '<button class="ci-x" type="button" data-cart-del="' + esc(id) + '" aria-label="Remove ' + esc(p.name) + '">&times;</button>' +
        "</li>"
      );
    }).join("") + "</ul>";

    var n = cartUnits();
    var total = cartTotal();
    $("#cart-units", panel).textContent = n + " item" + (n === 1 ? "" : "s");
    $("#cart-total", panel).textContent = money(total);
    foot.hidden = false;
  }

  function toggleCart(open) {
    var panel = $("#cart-panel");
    if (!panel) return;
    var on = open != null ? open : !panel.classList.contains("open");
    var scrim = $("#cart-scrim");

    if (on) {
      /* The panel is created with the `hidden` attribute so it can never appear
         as a stray white block, even if the stylesheet fails to load. Clearing
         `hidden` and adding .open in the same task means there is no previous
         computed style to transition from, so the slide-in is a keyframe
         animation instead. */
      panel.hidden = false;
      if (scrim) scrim.hidden = false;
      panel.classList.add("open");
      if (scrim) scrim.classList.add("on");
      panel.setAttribute("aria-hidden", "false");
      drawCartPanel();
      var close = $(".cart-close", panel);
      if (close) close.focus();
    } else {
      panel.classList.remove("open");
      if (scrim) scrim.classList.remove("on");
      panel.setAttribute("aria-hidden", "true");
      /* Let the slide-out finish before the UA [hidden] rule kicks in. */
      window.setTimeout(function () {
        if (panel.classList.contains("open")) return;
        panel.hidden = true;
        if (scrim) scrim.hidden = true;
      }, 300);
    }
    $$("[data-cart-toggle]").forEach(function (b) { b.setAttribute("aria-expanded", String(on)); });
  }

  function mountCart() {
    if (!$("#cart-panel")) {
      var scrim = document.createElement("div");
      scrim.id = "cart-scrim";
      scrim.className = "cart-scrim";
      scrim.hidden = true;
      scrim.addEventListener("click", function () { toggleCart(false); });
      document.body.appendChild(scrim);

      var panel = document.createElement("aside");
      panel.id = "cart-panel";
      panel.className = "cart-panel";
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
      panel.setAttribute("aria-label", "Your cart");
      panel.innerHTML =
        '<div class="cart-head">' +
          "<h2>Your cart</h2>" +
          '<button class="cart-close" type="button" aria-label="Close cart">&times;</button>' +
        "</div>" +
        '<div class="cart-body" id="cart-body"></div>' +
        '<div class="cart-foot" id="cart-foot">' +
          '<div class="cart-totals">' +
            '<span><b>Items</b> <span id="cart-units">0 items</span></span>' +
            '<span><b>Estimated total</b> <span id="cart-total">₦0</span></span>' +
          "</div>" +
          '<button class="btn btn-wa btn-block btn-lg" type="button" data-cart-order>' + ICONS.wa + " Order on WhatsApp</button>" +
          '<button class="btn btn-ghost btn-block" type="button" data-cart-clear>Clear cart</button>' +
          '<p class="cart-note">We check availability and confirm the final price, delivery fee and payment details with you.</p>' +
        "</div>";
      document.body.appendChild(panel);

      $(".cart-close", panel).addEventListener("click", function () { toggleCart(false); });
      $("[data-cart-clear]", panel).addEventListener("click", function () {
        cart = {};
        cartSave();
        drawCart();
        syncCardPills();
        toast("Cart cleared");
      });
      $("[data-cart-order]", panel).addEventListener("click", sendCart);

      panel.addEventListener("click", function (e) {
        var inc = e.target.closest("[data-cart-inc]");
        if (inc) { cartBump(inc.getAttribute("data-cart-inc"), 1); return; }
        var dec = e.target.closest("[data-cart-dec]");
        if (dec) { cartBump(dec.getAttribute("data-cart-dec"), -1); return; }
        var del = e.target.closest("[data-cart-del]");
        if (del) { cartBump(del.getAttribute("data-cart-del"), -cartQty(del.getAttribute("data-cart-del"))); }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") toggleCart(false);
      });
    }

    document.addEventListener("click", function (e) {
      var toggle = e.target.closest("[data-cart-toggle]");
      if (toggle) { e.preventDefault(); toggleCart(); return; }

      var add = e.target.closest("[data-add]");
      if (!add) return;
      var p = productById(add.getAttribute("data-add"));
      if (!p) return;
      cartBump(p.id, 1);
    });

    cartLoad();
    drawCart();
    syncCardPills();
  }

  /* builds the pre-filled order + availability request */
  function sendCart() {
    var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });

    if (!ids.length) {
      window.open(waLink(hi() + " 👋 I'd like to make an order 🙏"), "_blank", "noopener");
      toast("Opening WhatsApp…");
      return;
    }

    var total = 0;
    var anyUnpriced = false;

    var lines = [
      hi() + " 👋 Here's my order:",
      "",
      "Please confirm availability of the following " + (ids.length === 1 ? "item" : "items") + " 👇",
      ""
    ];

    ids.forEach(function (id, i) {
      var p = productById(id);
      if (!p) return;
      var q = cart[id];
      if (p.price != null) {
        total += p.price * q;
        lines.push((i + 1) + ". " + p.name + " — " + q + " × " + priceShort(p) + " = " + money(p.price * q));
      } else {
        anyUnpriced = true;
        lines.push((i + 1) + ". " + p.name + " — " + q + " × (please send the price)");
      }
    });

    lines.push("");
    if (anyUnpriced) {
      lines.push("Estimated total: " + money(total) + " (excluding items awaiting a price)");
    } else {
      lines.push("Estimated total: " + money(total));
    }

    lines.push(
      "",
      "Could you please let me know:",
      "1. Which of these are currently in stock?",
      "2. Are any prices different from the ones listed?",
      "3. The total delivery fee to my address, and how long it will take?",
      "",
      "Thank you!"
    );

    window.open(waLink(lines.join("\n")), "_blank", "noopener");
    toggleCart(false);
    toast("Opening WhatsApp with your order…");
  }

  /* ---------------------------------------------------------- appointments */

  function toISO(d) {
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  function fromISO(iso) {
    var p = iso.split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAYFULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* "Friday, 3 October 2026" */
  function longDate(iso) {
    var d = fromISO(iso);
    return DAYFULL[d.getDay()] + ", " + d.getDate() + " " + MON[d.getMonth()] + " " + d.getFullYear();
  }

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return Number(p[0]) * 60 + Number(p[1]);
  }

  function to24(hhmm) {
    var p = hhmm.split(":");
    return String(p[0]).padStart(2, "0") + ":" + String(p[1]).padStart(2, "0");
  }

  function initAppointments() {
    var root = $("#appt");
    if (!root) return;

    var bk = S.booking;
    var sel = { service: null, date: null, time: null };
    var form = $("#appt-form");

    /* ---- 1. services ---- */
    var svcHost = $("#appt-services");
    svcHost.innerHTML = S.services.map(function (s) {
      var mins = s.duration || 60;
      var dur = mins >= 60 ? (mins % 60 ? (Math.floor(mins / 60) + "h " + (mins % 60) + "m") : (mins / 60) + "h") : mins + "m";
      return (
        '<button class="svc-pick" type="button" data-svc="' + esc(s.id) + '" aria-pressed="false">' +
          '<span class="glyph" aria-hidden="true">' + s.icon + "</span>" +
          '<span class="txt"><b>' + esc(s.title) + "</b><span>" + esc(s.text) + "</span></span>" +
          '<span class="dur">' + dur + "</span>" +
        "</button>"
      );
    }).join("");

    /* ---- 2. dates: next N days, closed days disabled ---- */
    var dayCount = Math.min(21, bk.maxDays || 90);
    var dateHost = $("#appt-dates");

    /* The calendar is rebuilt from the real current date, and rebuilt again
       whenever the day rolls over or the tab regains focus — so it never
       drifts, even if the page is left open for days. */
    var builtFor = "";

    /* The salon is in Lagos, so "today" and "what time is it" must be judged
       against Lagos wall-clock time - not the visitor's device clock or their
       timezone. Otherwise someone booking from abroad sees the wrong day, or
       the wrong slots greyed out as "already passed". */
    var TZ = bk.timezone || "Africa/Lagos";
    var tzFmt = null;
    try {
      tzFmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ,
        hourCycle: "h23",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
      });
    } catch (e) { tzFmt = null; }

    /* The current date and time as they are in the salon's timezone. */
    function salonNow() {
      var d = new Date();
      if (!tzFmt) return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), h: d.getHours(), min: d.getMinutes() };
      var p = {};
      tzFmt.formatToParts(d).forEach(function (x) { if (x.type !== "literal") p[x.type] = x.value; });
      return {
        y: Number(p.year), m: Number(p.month), d: Number(p.day),
        h: Number(p.hour) % 24, min: Number(p.minute)
      };
    }

    /* YYYY-MM-DD for the salon's current day. */
    function todayISO() {
      var n = salonNow();
      return n.y + "-" + String(n.m).padStart(2, "0") + "-" + String(n.d).padStart(2, "0");
    }

    function buildDates() {
      var n = salonNow();
      builtFor = todayISO();
      /* A local-midnight Date is only ever a calendar cursor here: we read and
         write Y/M/D and getDay() in the same timezone, so the weekday is right. */
      var first = new Date(n.y, n.m - 1, n.d + (bk.leadDays || 0));

      var chips = "";
      for (var i = 0; i < dayCount; i++) {
        var d = new Date(first);
        d.setDate(d.getDate() + i);
        var iso = toISO(d);
        var closed = !bk.hours[d.getDay()];
        var rel = i === 0 ? "Earliest" : (i === 1 ? "Tomorrow" : DOW[d.getDay()]);
        chips +=
          '<button class="date-chip" type="button" data-date="' + iso + '" aria-pressed="' + (sel.date === iso ? "true" : "false") + '"' +
            (closed ? " disabled" : "") +
            ' aria-label="' + esc(longDate(iso)) + (closed ? " — closed" : "") + '">' +
            '<span class="dow">' + rel + "</span>" +
            '<span class="dnum">' + d.getDate() + "</span>" +
            '<span class="dmon">' + MON[d.getMonth()] + " " + d.getFullYear() + "</span>" +
          "</button>";
      }
      dateHost.innerHTML = chips;
    }

    buildDates();

    /* keep it honest: re-check once a minute, and whenever the tab is shown again */
    function refreshIfDayChanged() {
      var today = todayISO();
      if (today === builtFor) return;
      buildDates();
      /* a previously chosen date may have rolled into the past */
      if (sel.date && sel.date < today) {
        sel.date = null;
        sel.time = null;
        drawSlots();
        toast("A new day — please pick a new date.");
      } else {
        /* still in the future - keep it highlighted and just refresh the slots */
        var chip = dateHost.querySelector('[data-date="' + sel.date + '"]');
        if (chip) chip.setAttribute("aria-pressed", "true");
        drawSlots();
      }
    }
    setInterval(refreshIfDayChanged, 60000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) refreshIfDayChanged(); });
    window.addEventListener("focus", refreshIfDayChanged);
    window.addEventListener("pageshow", refreshIfDayChanged);

    /* ---- 3. slots for the chosen day ---- */
    var slotHost = $("#appt-slots");
    var slotNote = $("#appt-slot-note");

    function drawSlots() {
      if (!sel.date) {
        slotHost.innerHTML =         '<p class="slot-prompt">Pick a date first, then choose a time.</p>';
        return;
      }
      var day = fromISO(sel.date).getDay();
      var hours = bk.hours[day];
      if (!hours) {
        slotHost.innerHTML = '<p class="closed-note">We are closed on ' + DOW[day] + "days. Please choose another date.</p>";
        return;
      }
      var open = toMinutes(hours[0]);
      var close = toMinutes(hours[1]);
      var step = bk.slotMinutes || 30;
      var isToday = todayISO() === sel.date;
      var n = salonNow();
      var minsNow = n.h * 60 + n.min;

      var out = "";
      var count = 0;
      for (var m = open; m + 30 <= close; m += step) {
        var label = to24(String(Math.floor(m / 60)) + ":" + String(m % 60).padStart(2, "0"));
        var past = isToday && m <= minsNow;
        out +=
          '<button class="slot" type="button" data-time="' + label + '" aria-pressed="false"' + (past ? " disabled" : "") + ">" +
          label + "</button>";
        count++;
      }
      slotHost.innerHTML = out || '<p class="closed-note">No slots left on this day — please pick another date.</p>';
      if (slotNote) {
        slotNote.textContent =
          longDate(sel.date) + " — sessions run " +
          to24(String(Math.floor(open / 60)) + ":" + String(open % 60).padStart(2, "0")) +
          " to " + to24(String(Math.floor(close / 60)) + ":" + String(close % 60).padStart(2, "0")) + ".";
      }
      sel.time = null;
      drawSummary();
    }

    /* ---- 4. live summary ---- */
    function svcById(id) {
      return S.services.filter(function (s) { return s.id === id; })[0];
    }

    function drawSummary() {
      var svc = sel.service ? svcById(sel.service) : null;
      var set = function (id, html, isSet) {
        var el = $("#" + id);
        if (el) el.innerHTML = isSet ? html : '<span class="none">Not chosen yet</span>';
      };
      set("sum-service", svc ? esc(svc.title) : "", !!svc);
      set("sum-date", sel.date ? esc(longDate(sel.date)) : "", !!sel.date);
      set("sum-time", sel.time ? esc(sel.time) : "", !!sel.time);
      set("sum-length", svc ? (svc.duration + " minutes") : "", !!svc);

      var btn = $("#appt-send");
      if (btn) {
        var ready = !!(svc && sel.date && sel.time);
        btn.setAttribute("aria-disabled", String(!ready));
        btn.textContent = ready ? "Book on WhatsApp" : "Choose a service, date and time";
      }
    }

    /* ---- interactions ---- */
    svcHost.addEventListener("click", function (e) {
      var b = e.target.closest("[data-svc]");
      if (!b) return;
      sel.service = b.getAttribute("data-svc");
      $$(".svc-pick", svcHost).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      drawSummary();
    });

    dateHost.addEventListener("click", function (e) {
      var b = e.target.closest("[data-date]");
      if (!b || b.disabled) return;
      sel.date = b.getAttribute("data-date");
      $$(".date-chip", dateHost).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      drawSlots();
    });

    slotHost.addEventListener("click", function (e) {
      var b = e.target.closest("[data-time]");
      if (!b || b.disabled) return;
      sel.time = b.getAttribute("data-time");
      $$(".slot", slotHost).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      drawSummary();
    });

    if (form) {
      form.addEventListener("submit", function (e) { e.preventDefault(); sendBooking(); });
    }
    var sendBtn = $("#appt-send");
    if (sendBtn) sendBtn.addEventListener("click", function () {
      if (sendBtn.getAttribute("aria-disabled") !== "true") sendBooking();
    });

    function sendBooking() {
      var svc = sel.service ? svcById(sel.service) : null;
      if (!svc || !sel.date || !sel.time) return;
      var g = function (n) {
        var f = form && form.elements[n];
        return f ? f.value.trim() : "";
      };

      var lines = [
        hi() + " 👋 I'd like to book an appointment.",
        "",
        "Service: " + svc.title,
        "Date: " + longDate(sel.date),
        "Time: " + sel.time + " (WAT)",
        "Duration: about " + svc.duration + " minutes"
      ];
      if (g("name")) lines.push("Name: " + g("name"));
      if (g("phone")) lines.push("Phone: " + g("phone"));
      if (g("notes")) lines.push("Notes: " + g("notes"));
      lines.push("", "Please confirm this slot is available. Thank you!");

      window.open(waLink(lines.join("\n")), "_blank", "noopener");
      toast("Opening WhatsApp with your booking…");
    }

    /* deep link: appointments.html?service=lashes */
    var want = (location.search.match(/service=([a-z0-9_-]+)/i) || [])[1];
    if (want) {
      var pre = $('[data-svc="' + want + '"]', svcHost);
      if (pre) pre.click();
    }

    drawSlots();
    drawSummary();
  }

  /* --------------------------------------------------------------- toast */

  var toastTimer;
  function toast(msg) {
    var el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(function () { el.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
  }

  /* --------------------------------------------------------------- boot */

  function boot() {
    mountHeader();
    mountThemeToggle();
    mountFooter();
    mountFloat();
    mountCart();
    initHome();
    initCategoryPage();
    initBundles();
    initAppointments();
    document.documentElement.setAttribute("data-ready", "true");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* small public surface for debugging */
  window.Phykar = { money: money, waLink: waLink, priceShort: priceShort, toast: toast };
})();
