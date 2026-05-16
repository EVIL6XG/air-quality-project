import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Activity,
  ArrowLeft,
  BellRing,
  CircleGauge,
  Leaf,
  Map,
  Plus,
  Recycle,
  ShieldCheck,
  Shirt,
  Wind,
  X,
} from "lucide-react"

const logoSrc = "/airq.png"
const lookbookSrc = "/airq-shop-lookbook.png"
const shirtPreviewSrc = "/airq-shirt-preview.png"
const smogHoodieSrc = "/airq-hoodie-smog-clean-v2.png"
const mountainHoodieSrc = "/airq-hoodie-mountain-clean.png"
const urbanHoodieSrc = "/airq-hoodie-urban-clean-v2.png"
const urbanMaskSrc = "/airq-mask-urban-product.png"
const smogMaskSrc = "/airq-mask-smog-product.png"
const maskFeatureSrc = "/airq-mask-feature.png"

const airProducts = [
  {
    name: "AirQ Pocket Monitor",
    description: "Compact PM2.5 and AQI companion for daily city movement.",
    type: "Portable air quality device",
    price: "$89",
    badge: "Clean Air Product",
    colors: ["#0f766e", "#111827", "#e5f5ff"],
    icon: Wind,
    variant: "device",
  },
  {
    name: "AirQ Home Sensor",
    description: "Minimal indoor station for tracking home air and ventilation.",
    type: "Smart home sensor",
    price: "$129",
    badge: "Eco Friendly",
    colors: ["#f8fafc", "#7dd3fc", "#1e293b"],
    icon: Activity,
    variant: "sensor",
  },
  {
    name: "District Alert Plan",
    description: "Personal AQI notifications for Bostandyk, Medeu, Auezov, Alatau, and Jetisu.",
    type: "AirQ digital service",
    price: "$6/mo",
    badge: "Clean Air Product",
    colors: ["#38bdf8", "#a78bfa", "#86efac"],
    icon: BellRing,
    variant: "app",
  },
  {
    name: "AirQ Urban Mask",
    description: "Breathable everyday protection for city movement and polluted commute hours.",
    type: "Reusable urban mask",
    price: "$29",
    badge: "Clean Air Product",
    colors: ["#111827", "#6b7280", "#c4b5fd"],
    image: urbanMaskSrc,
    imagePosition: "center",
  },
  {
    name: "Smog Protection Mask",
    description: "Advanced filtration mask for heavy pollution days with replaceable filters.",
    type: "High-efficiency filter mask",
    price: "$49",
    badge: "PM2.5 Protection",
    colors: ["#e5e7eb", "#111827", "#a78bfa"],
    image: smogMaskSrc,
    imagePosition: "center",
  },
]

const merchProducts = [
  {
    name: "Smog Cloud Edition",
    description: "Black recycled hoodie with contour smog graphics and Almaty awareness print.",
    type: "Recycled cotton hoodie",
    price: "$58",
    badge: "Recycled Material",
    colors: ["#f1f5f9", "#cbd5e1", "#0f172a"],
    backText: "Breathe Better, Almaty",
    accent: "smog",
    image: smogHoodieSrc,
    imagePosition: "center",
  },
  {
    name: "Mountain Air Edition",
    description: "Soft white sweatshirt with mountain artwork and clean-air back message.",
    type: "Organic recycled sweatshirt",
    price: "$52",
    badge: "Eco Friendly",
    colors: ["#e0f2fe", "#94a3b8", "#064e3b"],
    backText: "Clean Air Starts Here",
    accent: "mountain",
    image: mountainHoodieSrc,
    imagePosition: "center",
  },
  {
    name: "Urban AQI Edition",
    description: "Dark sweatshirt with city-map AQI graphics and monitoring message.",
    type: "Recycled performance sweatshirt",
    price: "$56",
    badge: "Clean Air Product",
    colors: ["#020617", "#334155", "#22d3ee"],
    backText: "Monitor. Forecast. Protect.",
    accent: "urban",
    image: urbanHoodieSrc,
    imagePosition: "center",
  },
]

const conceptPoints = [
  ["Clean air for everyone", CircleGauge],
  ["Data you can trust", Leaf],
  ["Local focus, Almaty standards", Map],
  ["Community driven", Recycle],
  ["Healthier city, better future", ShieldCheck],
]

const ProductVisual = ({ item }) => {
  const Icon = item.icon || Shirt

  if (item.image) {
    return (
      <div className={`shop-real-product-visual ${item.type?.toLowerCase().includes("mask") ? "shop-mask-product-visual" : ""}`}>
        <img src={item.image} alt={`${item.name} product mockup`} style={{ objectPosition: item.imagePosition }} />
      </div>
    )
  }

  if (item.backText) {
    return (
      <div className={`shop-shirt-stage shop-shirt-${item.accent}`}>
        <div className="shop-shirt shop-shirt-front">
          <span className="shop-shirt-neck" />
          <img src={logoSrc} alt="AirQ Almaty logo" />
          {item.accent === "mountain" && (
            <svg viewBox="0 0 160 58" aria-hidden="true" className="shop-mountain-line">
              <path d="M8 48L42 17l22 20 18-26 34 37h36" />
            </svg>
          )}
          {item.accent === "urban" && <span className="shop-aqi-map" />}
        </div>
        <div className="shop-shirt shop-shirt-back">
          <span className="shop-shirt-neck" />
          <strong>{item.backText}</strong>
        </div>
      </div>
    )
  }

  return (
    <div className={`shop-device-stage shop-device-${item.variant}`}>
      <div className="shop-device-orbit" />
      <div className="shop-device-shell">
        <div className="shop-device-top">
          <img src={logoSrc} alt="AirQ Almaty logo" />
          <Icon size={20} />
        </div>
        <div className="shop-device-screen">
          <span>AQI</span>
          <strong>{item.variant === "app" ? "42" : item.variant === "sensor" ? "18" : "31"}</strong>
          <small>{item.variant === "sensor" ? "PM2.5 ug/m3" : "Good air window"}</small>
        </div>
        <div className="shop-device-bars">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  )
}

const ProductCard = ({ item, index, onPreview }) => (
  <motion.article
    className="shop-product-card"
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.55, delay: index * 0.06 }}
  >
    <button
      type="button"
      className="shop-product-media"
      onClick={() => onPreview(item)}
      aria-label={`Open ${item.name} preview`}
    >
      <span className="shop-eco-badge">
        <Leaf size={13} />
        {item.badge}
      </span>
      <ProductVisual item={item} />
      <span className="shop-preview-hint">Open preview</span>
    </button>

    <div className="shop-product-body">
      <div>
        <p className="shop-product-type">{item.type}</p>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>

      <div className="shop-product-meta">
        <div className="shop-color-row" aria-label={`${item.name} color options`}>
          {item.colors.map((color) => (
            <span key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
        <strong>{item.price}</strong>
      </div>

      <button type="button" className="shop-add-button">
        <Plus size={16} />
        Add to cart
      </button>
    </div>
  </motion.article>
)

export default function ShopPage() {
  const [previewProduct, setPreviewProduct] = useState(null)

  return (
    <main className="airq-shop-page">
      <div className="shop-bg" />
      <div className="shop-bg-image" />

      <section className="shop-hero">
        <Link className="shop-back" to="/">
          <ArrowLeft size={16} />
          Back to AirQ
        </Link>

        <motion.div
          className="shop-lookbook"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <div className="shop-lookbook-top">
            <div className="shop-lookbook-copy">
              <h1>
                <span>AirQ</span> Almaty
              </h1>
              <p>Breathe smarter. Live better.</p>
              <small>
                AirQ turns air quality data into real-life impact for a healthier Almaty.
              </small>
              <img src={logoSrc} alt="AirQ Almaty logo" />
            </div>
            <div className="shop-lookbook-image-wrap">
              <img src={lookbookSrc} alt="AirQ Almaty branded T-shirt collection" />
              <div className="shop-logo-correction">
                <img src={logoSrc} alt="AirQ Almaty logo" />
                <span>Official AirQ Almaty merch</span>
              </div>
            </div>
          </div>

          <div className="shop-lookbook-bottom">
            <aside className="shop-concept-panel">
              <p>Design concept</p>
              <span />
              {conceptPoints.map(([label, Icon]) => (
                <div key={label}>
                  <Icon size={22} />
                  <strong>{label}</strong>
                </div>
              ))}
            </aside>

            <div className="shop-photo-panel shop-real-photo-panel">
              <img src={shirtPreviewSrc} alt="AirQ Almaty recycled T-shirt product mockups" />
              <div className="shop-photo-brand-mark">
                <img src={logoSrc} alt="AirQ Almaty logo" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="air-products" className="shop-section">
        <div className="shop-section-heading">
          <p>Air quality products</p>
          <h2>Tools for monitoring healthier spaces.</h2>
        </div>
        <div className="shop-mask-feature">
          <img src={maskFeatureSrc} alt="AirQ mask collection for urban air protection" />
        </div>
        <div className="shop-product-grid shop-product-grid-three">
          {airProducts.map((item, index) => (
            <ProductCard key={item.name} item={item} index={index} onPreview={setPreviewProduct} />
          ))}
        </div>
      </section>

      <section id="merch" className="shop-section">
        <div className="shop-section-heading">
          <p>Branded eco-friendly merchandise</p>
          <h2>Recycled T-shirts with AirQ Almaty identity.</h2>
        </div>
        <div className="shop-product-grid">
          {merchProducts.map((item, index) => (
            <ProductCard key={item.name} item={item} index={index} onPreview={setPreviewProduct} />
          ))}
        </div>
      </section>

      <section className="shop-footer-cta">
        <Map size={24} />
        <h2>Wear the message. Track the air. Protect the city.</h2>
        <p>
          Every product connects the AirQ mission with everyday awareness across Almaty.
        </p>
      </section>

      {previewProduct && (
        <div
          className="shop-preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewProduct.name} product preview`}
          onClick={() => setPreviewProduct(null)}
        >
          <motion.div
            className="shop-preview-modal"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="shop-preview-close"
              onClick={() => setPreviewProduct(null)}
              aria-label="Close preview"
            >
              <X size={20} />
            </button>

            <div className="shop-preview-stage">
              {previewProduct.image ? (
                <img
                  src={previewProduct.image}
                  alt={`${previewProduct.name} product preview`}
                />
              ) : (
                <ProductVisual item={previewProduct} />
              )}
            </div>

            <div className="shop-preview-info">
              <span>{previewProduct.type}</span>
              <h2>{previewProduct.name}</h2>
              <p>{previewProduct.description}</p>
              <div className="shop-preview-meta">
                <strong>{previewProduct.price}</strong>
                <div className="shop-color-row">
                  {previewProduct.colors.map((color) => (
                    <i key={color} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}
