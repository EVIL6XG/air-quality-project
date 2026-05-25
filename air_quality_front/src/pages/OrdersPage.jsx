import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useOrders } from "@/features/shop/queries"

const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`

export default function OrdersPage() {
  const { data, isLoading, error } = useOrders()
  const orders = data || []

  return (
    <main className="airq-info-page min-h-screen text-white">
      <div className="airq-info-bg" />
      <section className="airq-info-card">
        <Link className="airq-info-back" to="/shop">
          <ArrowLeft size={16} />
          Back to Shop
        </Link>
        <p className="airq-info-kicker">Shop</p>
        <h1>Order History</h1>
        {isLoading && <p>Loading orders...</p>}
        {error && <p className="text-red-300">Failed to load orders. Please sign in.</p>}
        {!isLoading && !error && (
          <div className="mt-6 space-y-4">
            {orders.length === 0 && <p className="text-slate-200/85">No orders yet.</p>}
            {orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <strong>Order #{order.id}</strong>
                  <span className="text-sm text-slate-200/80">{money(order.total_cents)}</span>
                </div>
                <div className="space-y-1 text-sm text-slate-200/90">
                  {order.items.map((item) => (
                    <p key={`${order.id}-${item.product_id}`}>
                      {item.name} x{item.qty} — {money(item.line_total_cents)}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
