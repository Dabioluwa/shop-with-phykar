/* ==========================================================================
   Phykar Store — Catalog data
   Single source of truth for products, categories, services and bundles.
   Edit prices here; every page updates automatically.
   ========================================================================== */

window.STORE = {
  brand: "Shop with Phykar",
  shortName: "Phykar",
  tagline: "Curated Beauty, Accessories & Gift Boxes",
  waNumber: "2348101447062",

  /* Price symbol. The naira sign (U+20A6) is in the latin-ext subset of the
     site fonts, so it displays everywhere here. If you ever share a screen or
     export where it shows as an empty box, change this to "NGN " and every
     price on the site updates. */
  currency: "₦",

  /* How outgoing WhatsApp messages treat emoji and typographic characters.
     "strip" (default) removes them so the text is pure ASCII and cannot render
     as a missing-glyph box on any device.
     "keep" puts them back. They are ALWAYS percent-encoded in the link either
     way, because that is how a URL carries text - but WhatsApp decodes the link
     before showing it, so the customer still has to have a font that can draw
     the character. Percent-encoding cannot prevent the box; only removing the
     character can. */
  messageEmoji: "strip",

  /* ------------------------------------------------------------- assets -- */
  logo: "assets/img/logo.png",        /* 939x940 square pink mark: white heart + script wordmark */
  face: "assets/img/face.jpeg",       /* brand portrait, featured on the home page */
  favicon: "assets/img/favicon.svg",

  /* ----------------------------------------------------------- channels -- */
  tiktok: "https://www.tiktok.com/@shopwithphykarlagos?_r=1&_t=ZS-9A9C2v34STR",
  instagram: "",
  catalogueUrl: "https://wa.me/c/2348101447062",
  /* Footer contact buttons. Leave email as "" (or locationUrl as "") to hide
     that button. email is used to build a mailto: link, so keep it bare. */
  email: "onashokuntao@gmail.com",
  locationUrl: "https://goo.gl/maps/1MZmgfKxg3L2Lojz8?g_st=aw",

  /* ---------------------------------------------------------------- nav -- */
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Beauty", href: "beauty.html" },
    { label: "Jewelry", href: "jewelry.html" },
    { label: "Hair", href: "hair.html" },
    { label: "Lifestyle", href: "lifestyle.html" },
    { label: "Gift Boxes", href: "bundles.html" },
    { label: "Lash appointment", href: "appointments.html" }
  ],

  /* --------------------------------------------------------- categories -- */
  categories: [
    {
      id: "beauty",
      href: "beauty.html",
      label: "Cosmetics & Skincare",
      short: "Beauty",
      icon: "💄",
      blurb: "Lip care, masks, sunscreen, mascara, lashes, tattoos and perfumes.",
      group: "Skincare & Makeup"
    },
    {
      id: "jewelry",
      href: "jewelry.html",
      label: "Jewelry & Accessories",
      short: "Jewelry",
      icon: "💍",
      blurb: "Wristwatches, bracelets, beads, rings, hand chains and necklaces.",
      group: "Jewelry & Accessories"
    },
    {
      id: "hair",
      href: "hair.html",
      label: "Hair Accessories",
      short: "Hair",
      icon: "🎀",
      blurb: "Bonnets, claw clips, French clips, hairbands and scrunchies.",
      group: "Hair Accessories"
    },
    {
      id: "lifestyle",
      href: "lifestyle.html",
      label: "Personal Care & Gadgets",
      short: "Lifestyle",
      icon: "🥤",
      blurb: "Sip cups, phone grips, tongue brushes, mirrors and keyholders.",
      group: "Lifestyle & Personal Care"
    }
  ],

  /* ------------------------------------------------------------ services -- */
  /* Bookable via appointments.html — `price` is the from-price, `slot` is the
     length in minutes used to validate the chosen time.                     */
  services: [
    {
      id: "lashes",
      icon: "👁️",
      title: "Lash Extensions",
      text: "Classic, volume or mega-volume sets mapped to your eye shape.",
      duration: 120,
      price: null
    },
    {
      id: "lashfill",
      icon: "✨",
      title: "Lash Refill",
      text: "Two-to-three week infill to keep your set looking fresh.",
      duration: 90,
      price: null
    },
    {
      id: "lashesremoval",
      icon: "🧴",
      title: "Lash Removal",
      text: "Gentle removal with a soothing lash cleanse and finish.",
      duration: 45,
      price: null
    },
    {
      id: "brows",
      icon: "🖌️",
      title: "Brow Lamination & Tint",
      text: "Brushed-up, set brows shaped to your face.",
      duration: 60,
      price: null
    }
  ],

  /* ------------------------------------------------------------- booking -- */
  booking: {
    /* Availability is judged against Lagos wall-clock time, whatever timezone
       or clock the visitor's device is on. */
    timezone: "Africa/Lagos",

    /* Opening hours, 24h. Sunday is closed (0). */
    hours: {
      0: null,          /* Sunday — closed */
      1: ["10:00", "18:00"],
      2: ["10:00", "18:00"],
      3: ["10:00", "18:00"],
      4: ["10:00", "18:00"],
      5: ["10:00", "18:00"],
      6: ["10:00", "16:00"]
    },
    slotMinutes: 30,    /* start times offered, every N minutes */
    leadDays: 2,        /* earliest bookable date is today + this many days */
    maxDays: 90,        /* furthest ahead a client may book */
    location: "Lagos, Nigeria — exact address shared on confirmation"
  },

  /* ------------------------------------------------------------ bundles --- */
  /* Set featured: true on a bundle to give it the dark card treatment and
     the "Most popular" ribbon. All three tiers are currently level.       */
  bundles: [
    {
      id: "starter",
image: "assets/img/Product/10k-gift-box.webp",
            emoji: "🌷",
      name: "The Starter Package",
      price: 10000,
      priceNote: "gift box",
      blurb: "A simple, high-value selection of curated everyday essentials.",
      cta: "Order ₦10k Box",
      featured: false,
      includes: [
        "Everyday beauty essentials",
        "A scent or lip duo",
        "One accessory piece",
        "Gift wrapping & handwritten note",
        "Delivery within Lagos"
      ]
    },
    {
      id: "signature",
image: "assets/img/Product/25k-giftbox.webp",
            emoji: "💫",
      name: "The Signature Package",
      price: 25000,
      priceNote: "gift box",
      blurb: "A balanced assortment of premium items across grooming, beauty and accessories.",
      cta: "Order ₦25k Box",
      featured: false,
      includes: [
        "Premium skincare & sunscreen",
        "Full lip and eye makeup set",
        "Jewelry or watch piece",
        "Hair accessory duo",
        "Lifestyle gadget of choice",
        "Luxury packaging & gift note"
      ]
    },
    {
      id: "deluxe",
image: "assets/img/Product/50k-giftbox.webp",
            emoji: "👑",
      name: "The Deluxe Package",
      price: 50000,
      priceNote: "gift box",
      blurb: "A full luxury bundle designed for major celebrations and milestone gifting.",
      cta: "Order ₦50k Box",
      featured: false,
      includes: [
        "Everything in the Signature Package",
        "Premium watch & bracelet set",
        "Designer fragrance",
        "Complete hair care collection",
        "Multiple gift boxes for the group",
        "Personalised concierge service"
      ]
    }
  ],

  /* ------------------------------------------------------------ products -- */
  /* group  : sub-heading used inside a category page
     price  : number in Naira, or null when the price is quoted on WhatsApp
     tag    : optional label badge                                            */
  products: [
    /* ============================ BEAUTY (20) ============================ */
    { id: "b01", image: "assets/img/Product/lip-combo.webp", cat: "beauty", group: "Lip Care", name: "Lip Combo", price: 4400, glyph: "💋" },
    { id: "b02", image: "assets/img/Product/clear-lipgloss.webp", cat: "beauty", group: "Lip Care", name: "Clear Lipgloss", price: 1500, glyph: "💧" },
    { id: "b03", image: "assets/img/Product/lipgloss.webp", cat: "beauty", group: "Lip Care", name: "Lipgloss", price: 1200, glyph: "💋" },
    { id: "b04", image: "assets/img/Product/lip-oil-and-lip-gloss.webp", cat: "beauty", group: "Lip Care", name: "Lip Oil & Lip Gloss", price: 1500, glyph: "🫧" },
    { id: "b05", image: "assets/img/Product/lip-balm-and-lip-gloss-combo.webp", cat: "beauty", group: "Lip Care", name: "Lip Balm & Lip Gloss Combo", price: 2000, glyph: "💄" },
    { id: "b06", image: "assets/img/Product/pink-lip-balm.webp", cat: "beauty", group: "Lip Care", name: "Pink Lip Balm", price: 1000, glyph: "🌸" },
    { id: "b07", image: "assets/img/Product/ushas-lip-mask.webp", cat: "beauty", group: "Lip Care", name: "Ushas Lip Mask", price: 1300, glyph: "🧖" },
    { id: "b08", image: "assets/img/Product/lipcare-products.webp", cat: "beauty", group: "Lip Care", name: "Lipcare Products", price: null, glyph: "✨" },
    { id: "b09", image: "assets/img/Product/lipbrush.webp", cat: "beauty", group: "Lip Care", name: "Lipbrush", price: 800, glyph: "🖌️" },

    { id: "b10", image: "assets/img/Product/sunscreen.webp", cat: "beauty", group: "Skincare & Makeup", name: "Sunscreen", price: 3800, glyph: "🧴", tag: "Bestseller" },
    { id: "b11", image: "assets/img/Product/black-mask.webp", cat: "beauty", group: "Skincare & Makeup", name: "Black Mask", price: 2500, glyph: "🖤" },
    { id: "b12", image: "assets/img/Product/facial-sheet-mask.webp", cat: "beauty", group: "Skincare & Makeup", name: "Facial Sheet Mask", price: 800, glyph: "🧖‍♀️" },
    { id: "b13", image: "assets/img/Product/mascara.webp", cat: "beauty", group: "Skincare & Makeup", name: "Mascara", price: 1000, glyph: "👁️" },
    { id: "b14", image: "assets/img/Product/eyeliner-and-star-seal.webp", cat: "beauty", group: "Skincare & Makeup", name: "Eyeliner & Star Seal", price: 1500, glyph: "⭐" },
    { id: "b15", image: "assets/img/Product/eyelashes.webp", cat: "beauty", group: "Skincare & Makeup", name: "Eyelashes", price: null, glyph: "👀" },
    { id: "b16", image: "assets/img/Product/face-razor.webp", cat: "beauty", group: "Skincare & Makeup", name: "Face Razor", price: null, glyph: "🪒" },
    { id: "b17", image: "assets/img/Product/press-on-nails.webp", cat: "beauty", group: "Skincare & Makeup", name: "Press-On Nails", price: null, glyph: "💅" },

    { id: "b18", image: "assets/img/Product/temporary-tattoo.webp", cat: "beauty", group: "Body & Fragrance", name: "Temporary Tattoo", price: 1200, glyph: "🦋" },
    { id: "b19", image: "assets/img/Product/tattoo-stickers.webp", cat: "beauty", group: "Body & Fragrance", name: "Tattoo Stickers", price: null, glyph: "🌺" },
    { id: "b20", image: "assets/img/Product/variety-perfumes.webp", cat: "beauty", group: "Body & Fragrance", name: "Variety Perfumes", price: 800, priceFrom: true, glyph: "🌸", tag: "From ₦800" },

    /* =========================== JEWELRY (8) ============================ */
    { id: "j01", image: "assets/img/Product/wristwatch-and-beads.webp", cat: "jewelry", group: "Wristwear", name: "Wristwatch & Beads", price: 6000, glyph: "⌚" },
    { id: "j02", image: "assets/img/Product/wristwatch-bracelet-and-box.webp", cat: "jewelry", group: "Wristwear", name: "Wristwatch, Bracelet & Box", price: 8000, glyph: "🎁", tag: "Bestseller" },
    { id: "j03", image: "assets/img/Product/bracelets.webp", cat: "jewelry", group: "Wristwear", name: "Bracelets", price: 5500, glyph: "📿" },
    { id: "j06", image: "assets/img/Product/beads.webp", cat: "jewelry", group: "Wristwear", name: "Beads", price: null, glyph: "🔮" },

    { id: "j07", image: "assets/img/Product/knuckle-ring.webp", cat: "jewelry", group: "Rings, Chains & Necklaces", name: "Knuckle Ring", price: 1500, glyph: "💍" },
    { id: "j08", image: "assets/img/Product/rings.webp", cat: "jewelry", group: "Rings, Chains & Necklaces", name: "Rings", price: null, glyph: "💎" },
    { id: "j09", image: "assets/img/Product/hand-chain.webp", cat: "jewelry", group: "Rings, Chains & Necklaces", name: "Hand Chain", price: 3500, glyph: "🪬" },
    { id: "j10", image: "assets/img/Product/necklaces.webp", cat: "jewelry", group: "Rings, Chains & Necklaces", name: "Necklaces", price: null, glyph: "📿", tag: "Bestseller" },

    /* ============================= HAIR (7) ============================= */
    { id: "h01", image: "assets/img/Product/french-clip-black.webp", cat: "hair", group: "Clips & Ties", name: "French Clip — Black", price: 2500, glyph: "📎" },
    { id: "h03", image: "assets/img/Product/claw-clip.webp", cat: "hair", group: "Clips & Ties", name: "Claw Clip", price: 1200, glyph: "🦞", tag: "Bestseller" },
    { id: "h04", image: "assets/img/Product/hair-clips.webp", cat: "hair", group: "Clips & Ties", name: "Hair Clips", price: 1300, priceMax: 2000, glyph: "✂️" },
    { id: "h06", image: "assets/img/Product/hairband.webp", cat: "hair", group: "Clips & Ties", name: "Hairband", price: 1000, glyph: "➰" },
    { id: "h07", image: "assets/img/Product/baby-hairbands.webp", cat: "hair", group: "Clips & Ties", name: "Baby Hairbands", price: null, glyph: "👶" },
    { id: "h08", image: "assets/img/Product/scrunchies.webp", cat: "hair", group: "Clips & Ties", name: "Scrunchies", price: 400, glyph: "🧶" },

    { id: "h09", image: "assets/img/Product/bonnet.webp", cat: "hair", group: "Protection", name: "Satin Bonnet", price: 2000, glyph: "🎩", tag: "Bestseller" },

    /* ========================== LIFESTYLE (6) =========================== */
    { id: "l01", image: "assets/img/Product/sip-cup-textured.webp", cat: "lifestyle", group: "Sip & Drinkware", name: "Sip Cup — Textured", price: 2500, glyph: "🥤" },
    { id: "l02", image: "assets/img/Product/sip-cup-tall.webp", cat: "lifestyle", group: "Sip & Drinkware", name: "Sip Cup — Tall", price: 3000, glyph: "🧋" },
    { id: "l03", image: "assets/img/Product/gripsuction.webp", cat: "lifestyle", group: "Gadgets & Extras", name: "GripSuction Phone Grip", price: 1500, glyph: "📱" },
    { id: "l04", image: "assets/img/Product/tongue-brush.webp", cat: "lifestyle", group: "Gadgets & Extras", name: "Tongue Brush", price: 1200, glyph: "🪥" },
    { id: "l05", image: "assets/img/Product/mirror.webp", cat: "lifestyle", group: "Gadgets & Extras", name: "Compact Mirror", price: null, glyph: "🪞" },
    { id: "l06", image: "assets/img/Product/keyholders.webp", cat: "lifestyle", group: "Gadgets & Extras", name: "Keyholders", price: null, glyph: "🔑" }
  ],

  /* ------------------------------------------------------------ questions -- */
  faqs: [
    {
      q: "How do I place an order?",
      a: "Tap 'Add to cart' on as many items as you like — a number appears on the Order on WhatsApp button so you know when you're done. Tap it and we'll get a message listing everything you picked, asking which items are in stock, the delivery fee and how long it will take. Just hit send."
    },
    {
      q: "Do I have to pay on this website?",
      a: "No. Nothing is charged here. We confirm availability, the final price, delivery fee and payment details with you on WhatsApp first."
    },
    {
      q: "How do I book an appointment?",
      a: "Open the Book an appointment page, choose your service, pick your date and time, add your details, then tap 'Book on WhatsApp'. Your request is written out for you — just hit send and we'll confirm the slot within minutes."
    },
    {
      q: "Do you deliver outside Lagos?",
      a: "Yes. Nationwide delivery is available; Lagos orders placed before 4pm can be delivered same-day. Delivery fees are confirmed before dispatch."
    },
    {
      q: "Some items show no price. Why?",
      a: "Those items vary by design, size or stock level. Send us a message and you will get the exact price and options on WhatsApp within minutes."
    },
    {
      q: "Can I swap items in a gift box?",
      a: "Absolutely. Use the box builder on the Gift Boxes page — pick the exact items you want and we confirm every one with you before packing."
    },
    {
      q: "Are the gift boxes really ₦10k, ₦25k and ₦50k?",
      a: "Yes. Each tier is a curated value package. You can also build a custom box at any budget, including mixed tiers for group orders."
    }
  ],

  /* -------------------------------------------------------------- images -- */
  /* Product photos live in assets/img/Product/ as WebP, one kebab-case file per
     product, and are set with "image" on the product itself, e.g.
     image: "assets/img/Product/sunscreen.webp". The card then shows the photo
     instead of the emoji. Every product currently has one; leaving "image" out
     on a new item falls back to its emoji, so the field stays optional.

     The gift-box tiers take an "image" the same way. The originals these were
     converted from sit in assets/img/_originals_png/ and are not referenced by
     the site, so that folder is safe to delete once you are happy.           */
};
