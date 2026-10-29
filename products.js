/**
 * SnapDealz - Product Catalog Data
 * Multi-category bold deal store inventory
 */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Apex Pulse Air Running Shoes",
    category: "Men's Shoes",
    categorySlug: "mens-shoes",
    price: 20.99,
    oldPrice: 40.99,
    rating: 4.8,
    reviewCount: 342,
    badge: "50% OFF",
    stock: 14,
    isTrending: true,
    isFeatured: true,
    colors: ["#1f1f1f", "#F9B800", "#DC3545", "#0D6EFD"],
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Engineered with responsive cloud-cushioning and aerodynamic breathable mesh. Designed for marathon training, sprint sessions, and all-day street style.",
    features: [
      "Dynamic Dual-Density Foam midsole for maximum energy rebound",
      "Seamless knitted upper for featherlight blister-free comfort",
      "High-abrasion anti-slip rubber outsole with flex grooves",
      "Reflective accents for low-light night running safety"
    ],
    specs: {
      "Brand": "Apex Footwear",
      "Weight": "285g (Size 10)",
      "Upper Material": "Engineered Knit Mesh",
      "Sole Material": "Phylon & Vulcanized Rubber",
      "Closure": "Lace-up Lock",
      "Warranty": "6 Months Manufacturer Warranty"
    }
  },
  {
    id: 2,
    name: "Luxe Verona Italian Leather Tote",
    category: "Ladies Bags",
    categorySlug: "ladies-bags",
    price: 19.99,
    oldPrice: 45.00,
    rating: 4.9,
    reviewCount: 218,
    badge: "FLASH DEAL",
    stock: 9,
    isTrending: true,
    isFeatured: true,
    colors: ["#8B4513", "#1f1f1f", "#D2B48C", "#B22222"],
    sizes: ["Medium (14\"x11\")", "Large (16\"x13\")"],
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Crafted from hand-selected pebbled vegan leather with gold-tone hardware. Generous compartment holds up to a 15-inch laptop, cosmetics, and everyday essentials.",
    features: [
      "Scratch-resistant water-repellent pebbled vegan leather",
      "Padded central compartment fits laptops up to 15.6 inches",
      "Detachable adjustable crossbody strap with shoulder pad",
      "Reinforced protective metal feet at the base"
    ],
    specs: {
      "Brand": "Verona Atelier",
      "Dimensions": "15\" W x 12\" H x 5.5\" D",
      "Lining": "Signature Silk Jacquard",
      "Hardware": "14K Gold-tone zinc alloy",
      "Closure": "Magnetic snap & zipper top",
      "Warranty": "1 Year Craftsmanship Guarantee"
    }
  },
  {
    id: 3,
    name: "Lumière Radiance Botanical Glow Serum",
    category: "Health & Beauty",
    categorySlug: "health-beauty",
    price: 34.50,
    oldPrice: 68.00,
    rating: 4.9,
    reviewCount: 512,
    badge: "BESTSELLER",
    stock: 31,
    isTrending: true,
    isFeatured: true,
    colors: ["#F9B800", "#FFF"],
    sizes: ["30ml / 1.0 fl oz", "50ml / 1.7 fl oz"],
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597359-54359d997d43?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Potent antioxidant elixir with 15% stabilized Vitamin C, botanical hyaluronic acid, and niacinamide. Delivers glass-skin clarity and deep 72-hour hydration.",
    features: [
      "Visibly brightens dark spots and evens skin tone in 14 days",
      "100% Vegan, Cruelty-Free, Paraben-Free, and Fragrance-Free",
      "Triple molecular weight hyaluronic acid for multi-layer hydration",
      "Dermatologist tested and hypoallergenic for sensitive skin"
    ],
    specs: {
      "Brand": "Lumière Botanics",
      "Volume": "30ml (1.0 fl oz)",
      "Skin Type": "All Skin Types (Oily, Dry, Sensitive, Combination)",
      "Key Actives": "15% L-Ascorbic Acid, Hyaluronic Acid, Vitamin E",
      "Packaging": "UV-protective amber glass bottle with dropper",
      "Origin": "Formulated in France"
    }
  },
  {
    id: 4,
    name: "SonicPro ANC Wireless Headphones",
    category: "Electronics",
    categorySlug: "electronics",
    price: 89.99,
    oldPrice: 179.99,
    rating: 4.7,
    reviewCount: 429,
    badge: "50% OFF",
    stock: 18,
    isTrending: true,
    isFeatured: true,
    colors: ["#1f1f1f", "#E0E0E0", "#1E3A8A"],
    sizes: ["Universal Fit"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Immerse yourself in rich hi-res studio acoustics with Hybrid Active Noise Cancellation. Features 60-hour playtime and ultra-plush memory foam earcups.",
    features: [
      "Hybrid ANC reduces ambient noise by up to 38dB",
      "Custom 40mm titanium diaphragm drivers for punchy bass",
      "60-Hour battery life; 10 min fast charge yields 5 hours",
      "Multipoint Bluetooth 5.3 connection for seamless device switching"
    ],
    specs: {
      "Brand": "SonicAudio",
      "Driver Size": "40mm Custom Titanium",
      "Battery Life": "60 Hours (ANC Off) / 45 Hours (ANC On)",
      "Bluetooth": "Version 5.3 (SBC, AAC, LDAC)",
      "Microphones": "4 Beamforming Mics with AI ENC",
      "Weight": "240g"
    }
  },
  {
    id: 5,
    name: "Chronos Stealth Chronograph Watch",
    category: "Watches",
    categorySlug: "watches",
    price: 119.00,
    oldPrice: 240.00,
    rating: 4.8,
    reviewCount: 164,
    badge: "HOT DEAL",
    stock: 7,
    isTrending: true,
    isFeatured: false,
    colors: ["#1f1f1f", "#C0C0C0", "#F9B800"],
    sizes: ["42mm Case"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Sleek matte black stainless steel case paired with scratch-proof sapphire crystal glass. Features Japanese quartz precision movement and 100m water resistance.",
    features: [
      "Genuine Japanese Miyota Quartz movement",
      "Ultra-scratch-resistant sapphire crystal glass",
      "Subdials for 60-second, 30-minute, and 24-hour displays",
      "10 ATM (100 meters / 330 feet) water resistance"
    ],
    specs: {
      "Brand": "Chronos Heritage",
      "Case Diameter": "42mm",
      "Case Thickness": "11.5mm",
      "Band Material": "316L Solid Stainless Steel",
      "Glass": "Anti-Reflective Sapphire Crystal",
      "Movement": "Japanese Miyota OS20"
    }
  },
  {
    id: 6,
    name: "AeroGlide Cross-Trainer Sneaker",
    category: "Men's Shoes",
    categorySlug: "mens-shoes",
    price: 54.00,
    oldPrice: 110.00,
    rating: 4.6,
    reviewCount: 189,
    badge: "51% OFF",
    stock: 22,
    isTrending: true,
    isFeatured: false,
    colors: ["#212529", "#F9B800", "#6C757D"],
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512374382149-233c42b661ac?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Versatile gym sneaker engineered with lateral stability wings and an ultra-grip traction base for HIIT, cross-training, and heavy lifting.",
    features: [
      "Reinforced TPU heel counter for zero wobble on squats",
      "Breathable engineered jacquard knit upper",
      "Cushioned EVA insole with ergonomic arch support",
      "Multi-surface grooved tread for rapid agility cuts"
    ],
    specs: {
      "Brand": "AeroSport",
      "Weight": "310g",
      "Upper": "TPU reinforced knit",
      "Midsole": "High-density EVA foam",
      "Drop": "6mm offset",
      "Warranty": "3 Months"
    }
  },
  {
    id: 7,
    name: "Seraphina Quilted Crossbody Chain Bag",
    category: "Ladies Bags",
    categorySlug: "ladies-bags",
    price: 49.50,
    oldPrice: 99.00,
    rating: 4.8,
    reviewCount: 175,
    badge: "50% OFF",
    stock: 12,
    isTrending: true,
    isFeatured: false,
    colors: ["#1f1f1f", "#FFFFFF", "#F9B800", "#E91E63"],
    sizes: ["Compact (9.5\"x6\")"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Elevate date nights and weekend outings with this iconic diamond-quilted crossbody featuring a polished interwoven gold curb chain.",
    features: [
      "Signature geometric diamond chevron quilt stitching",
      "Convertible strap: wear as long shoulder strap or double cross",
      "Dual interior slip pockets plus secure zip wallet slot",
      "Turn-lock hardware clasp with polished gold finish"
    ],
    specs: {
      "Brand": "Seraphina New York",
      "Dimensions": "9.5\" L x 6.2\" H x 3.0\" D",
      "Material": "Eco-friendly Microfiber Leather",
      "Strap Drop": "22\" crossbody or 12\" double shoulder",
      "Lining": "Burgundy grosgrain fabric"
    }
  },
  {
    id: 8,
    name: "HydraGel Ultra Deep Moisture Creme",
    category: "Health & Beauty",
    categorySlug: "health-beauty",
    price: 28.00,
    oldPrice: 56.00,
    rating: 4.7,
    reviewCount: 388,
    badge: "BUY 1 GET 1",
    stock: 45,
    isTrending: false,
    isFeatured: true,
    colors: ["#4FC3F7"],
    sizes: ["50ml", "100ml"],
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Weightless oil-free water-burst cream infused with bio-ceramides and Japanese green tea extract to reinforce the moisture barrier.",
    features: [
      "Instantly boosts skin moisture levels by 179%",
      "Non-comedogenic formula won't clog pores or cause breakouts",
      "Infused with soothing Centella Asiatica & Aloe leaf water",
      "Perfect smoothing primer base under daily makeup"
    ],
    specs: {
      "Brand": "DermaAqua",
      "Form": "Gel-Cream",
      "Skin Concern": "Dehydration, Dullness, Redness",
      "Net Weight": "50g / 1.76 oz",
      "Free From": "Sulfates, Phthalates, Synthetic Dyes"
    }
  },
  {
    id: 9,
    name: "TitanFit Pro Smart Fitness Tracker",
    category: "Electronics",
    categorySlug: "electronics",
    price: 45.99,
    oldPrice: 89.99,
    rating: 4.6,
    reviewCount: 290,
    badge: "48% OFF",
    stock: 25,
    isTrending: true,
    isFeatured: false,
    colors: ["#1f1f1f", "#F9B800", "#2E7D32"],
    sizes: ["Standard Wrist"],
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Crisp 1.62-inch AMOLED screen tracking 120+ workout modes, continuous SpO2 oxygen, heart rate dynamics, and scientific sleep stage analysis.",
    features: [
      "Always-On Retina AMOLED full-color touch display",
      "14-day ultra-long battery life on single magnetic charge",
      "5 ATM waterproof rating for swimming laps and showers",
      "Smart phone notifications, music control, and camera shutter"
    ],
    specs: {
      "Brand": "TitanTech",
      "Display": "1.62\" AMOLED 490x192 HD",
      "Battery": "180mAh Li-Po (14 days regular use)",
      "Compatibility": "iOS 12.0+ & Android 7.0+",
      "Sensors": "6-axis PPG Optical Heart Rate, SpO2, Accelerometer",
      "Water Resistance": "50 Meters (5 ATM)"
    }
  },
  {
    id: 10,
    name: "Nomad Explorer Canvas Travel Duffel",
    category: "Ladies Bags",
    categorySlug: "ladies-bags",
    price: 59.00,
    oldPrice: 119.00,
    rating: 4.8,
    reviewCount: 147,
    badge: "TOP PICK",
    stock: 11,
    isTrending: false,
    isFeatured: false,
    colors: ["#556B2F", "#1f1f1f", "#A0522D"],
    sizes: ["Weekender (45L)"],
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Rugged 16oz wax-treated military canvas with top-grain leather trim. Features an isolated ventilated shoe compartment and TSA flight-carry compliance.",
    features: [
      "Separate zipped waterproof shoe & dirty laundry tunnel",
      "Heavy-duty brass YKK two-way lockable zippers",
      "Removable ergonomic padded shoulder sling",
      "Rear luggage trolley sleeve slips effortlessly over roll-aboard handles"
    ],
    specs: {
      "Brand": "Nomad Supply Co.",
      "Capacity": "45 Liters (Meets Airline Carry-On Standards)",
      "Dimensions": "21.5\" x 12\" x 11\"",
      "Fabric": "Waxed Cotton Canvas & Full-Grain Leather",
      "Weight": "1.25 kg"
    }
  },
  {
    id: 11,
    name: "Vortex 4K Ultra Action Camera",
    category: "Electronics",
    categorySlug: "electronics",
    price: 99.99,
    oldPrice: 199.99,
    rating: 4.7,
    reviewCount: 204,
    badge: "DEAL OF DAY",
    stock: 8,
    isTrending: true,
    isFeatured: false,
    colors: ["#1f1f1f"],
    sizes: ["Action Bundle"],
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Shoot crisp 4K 60fps action footage with 6-axis electronic image stabilization. Includes 131ft waterproof case and dual color screens for vlogging.",
    features: [
      "Crystal-clear 4K/60fps video & 20MP high-res action stills",
      "Dual screens: 2.0\" rear touch display + 1.4\" front selfie screen",
      "Advanced 6-Axis HyperSmooth EIS anti-shake stabilization",
      "Includes waterproof housing submersible down to 40m / 131ft"
    ],
    specs: {
      "Brand": "Vortex Vision",
      "Video Resolution": "4K@60fps, 2.7K@60fps, 1080P@120fps",
      "Photo Resolution": "20 Megapixels",
      "Lens": "170° Super Wide-Angle 7G Glass Lens",
      "Battery": "Dual 1350mAh Li-ion batteries included",
      "Connectivity": "Wi-Fi + Companion Mobile App"
    }
  },
  {
    id: 12,
    name: "Classic Derby Brogue Oxford Shoes",
    category: "Men's Shoes",
    categorySlug: "mens-shoes",
    price: 84.00,
    oldPrice: 168.00,
    rating: 4.9,
    reviewCount: 133,
    badge: "50% OFF",
    stock: 15,
    isTrending: false,
    isFeatured: false,
    colors: ["#8B4513", "#1f1f1f"],
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Timeless formal dress shoes with handcrafted wingtip perforations. Goodyear welted construction on a burnished full-grain calfskin upper.",
    features: [
      "Hand-burnished Italian calfskin leather",
      "Goodyear-welted sole that can be repeatedly resoled",
      "Breathable leather lining with memory foam footbed",
      "Waxed dress laces and blind eyelets"
    ],
    specs: {
      "Brand": "Kingsman & Co.",
      "Style": "Wingtip Brogue Derby",
      "Upper": "100% Full-Grain Calf Leather",
      "Outsole": "Stacked Leather with Non-Skid Rubber Top-Lift",
      "Origin": "Handmade in Portugal"
    }
  },
  {
    id: 13,
    name: "Volumizing 24K Gold Collagen Hair Mask",
    category: "Health & Beauty",
    categorySlug: "health-beauty",
    price: 24.99,
    oldPrice: 49.99,
    rating: 4.8,
    reviewCount: 295,
    badge: "HOT DEAL",
    stock: 38,
    isTrending: true,
    isFeatured: false,
    colors: ["#F9B800"],
    sizes: ["250ml / 8.5 oz", "500ml / 17 oz"],
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Deep conditioning restorative hair treatment that repairs heat damage, split ends, and eliminates frizz with hydrolyzed keratin and argan oils.",
    features: [
      "Restores brittle, color-treated hair in a 5-minute salon ritual",
      "Infused with Moroccan Argan oil, Keratin, and pure botanical lipids",
      "Adds mirror-like gloss and weightless bounce",
      "Color-safe, sulfate-free, and paraben-free"
    ],
    specs: {
      "Brand": "Aura Hair Lab",
      "Size": "250ml (8.45 fl oz)",
      "Hair Type": "Damaged, Dry, Curly, or Color-Treated",
      "Usage": "Apply after shampooing, rinse after 5-10 minutes"
    }
  },
  {
    id: 14,
    name: "Aviator Gold Polarized Sunglasses",
    category: "Watches",
    categorySlug: "watches",
    price: 39.99,
    oldPrice: 85.00,
    rating: 4.7,
    reviewCount: 167,
    badge: "53% OFF",
    stock: 20,
    isTrending: false,
    isFeatured: false,
    colors: ["#F9B800", "#1f1f1f", "#4A5568"],
    sizes: ["Standard 58mm"],
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Classic military pilot sunglasses with 100% UV400 polarized HD lenses, corrosion-resistant metallic alloy frames, and soft silicone nose pads.",
    features: [
      "TAC Polarized lenses block 100% harmful UVA & UVB rays",
      "Ultralight stainless titanium alloy frame (only 21 grams)",
      "Spring hinges flex up to 15 degrees for any face shape",
      "Includes hardshell leather case and microfiber cloth"
    ],
    specs: {
      "Brand": "Skyline Optics",
      "Lens Width": "58mm",
      "Bridge": "14mm",
      "Temple Length": "138mm",
      "Frame Material": "Gold-Plated Titanium Alloy",
      "Lens Type": "Polarized Triacetate Cellulose"
    }
  }
];

// Category metadata for category bar and filters
const categoriesData = [
  { name: "All", slug: "all", icon: "bi-grid-fill" },
  { name: "Men's Shoes", slug: "mens-shoes", icon: "bi-boot" },
  { name: "Ladies Bags", slug: "ladies-bags", icon: "bi-handbag" },
  { name: "Health & Beauty", slug: "health-beauty", icon: "bi-stars" },
  { name: "Electronics", slug: "electronics", icon: "bi-laptop" },
  { name: "Watches & Acc.", slug: "watches", icon: "bi-watch" }
];

// Product Persistence Key
const STORAGE_CUSTOM_PRODUCTS_KEY = 'snapdealz_custom_products_v1';

/**
 * Loads products from localStorage (custom added + existing), or falls back to DEFAULT_PRODUCTS
 */
function loadProductsCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading custom products from storage:", e);
  }
  return [...DEFAULT_PRODUCTS];
}

// Global active product list used across the store
var products = loadProductsCatalog();

/**
 * Saves entire catalog to localStorage
 */
function saveProductCatalog(newCatalog) {
  try {
    localStorage.setItem(STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(newCatalog));
    products = newCatalog;
    return true;
  } catch (e) {
    console.error("Error saving product catalog:", e);
    return false;
  }
}

/**
 * Add a new product to catalog (top of the store)
 */
function addNewProduct(productData) {
  const currentCatalog = loadProductsCatalog();
  const maxId = currentCatalog.reduce((max, p) => (Number(p.id) > max ? Number(p.id) : max), 100);
  
  const categoryStr = (productData.category || "Electronics").trim();
  const slug = categoryStr.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const priceNum = Math.max(0.99, parseFloat(productData.price) || 29.99);
  const oldPriceNum = parseFloat(productData.oldPrice) || (priceNum * 1.4);

  const formattedProduct = {
    id: maxId + 1,
    name: (productData.name || "Special Deal Product").trim(),
    category: categoryStr,
    categorySlug: slug,
    price: parseFloat(priceNum.toFixed(2)),
    oldPrice: parseFloat(oldPriceNum.toFixed(2)),
    rating: parseFloat(productData.rating) || 5.0,
    reviewCount: parseInt(productData.reviewCount, 10) || 16,
    badge: (productData.badge || "NEW DEAL").trim(),
    stock: parseInt(productData.stock, 10) || 20,
    isTrending: true,
    isFeatured: true,
    colors: Array.isArray(productData.colors) && productData.colors.length ? productData.colors : ["#1f1f1f", "#F9B800", "#0D6EFD"],
    sizes: Array.isArray(productData.sizes) && productData.sizes.length ? productData.sizes : ["Standard", "Large"],
    images: Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images
      : [productData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"],
    description: (productData.description || "Premium quality product with manufacturer warranty, fast dispatch, and guaranteed satisfaction.").trim(),
    features: Array.isArray(productData.features) && productData.features.length > 0
      ? productData.features
      : [
          "Authentic, factory sealed original merchandise",
          "Includes 30-day money-back guarantee & quick exchange",
          "Superfast priority courier shipping"
        ],
    specs: productData.specs || {
      "Category": categoryStr,
      "Condition": "Brand New / Sealed",
      "Warranty": "Official Warranty",
      "Shipping": "2-4 Business Days"
    }
  };

  const newCatalog = [formattedProduct, ...currentCatalog];
  saveProductCatalog(newCatalog);
  return formattedProduct;
}

/**
 * Delete a product by its ID
 */
function deleteProductById(productId) {
  const currentCatalog = loadProductsCatalog();
  const newCatalog = currentCatalog.filter(p => Number(p.id) !== Number(productId));
  saveProductCatalog(newCatalog);
  return newCatalog;
}

/**
 * Reset catalog back to factory defaults
 */
function resetProductsCatalog() {
  localStorage.removeItem(STORAGE_CUSTOM_PRODUCTS_KEY);
  products = [...DEFAULT_PRODUCTS];
  return products;
}

