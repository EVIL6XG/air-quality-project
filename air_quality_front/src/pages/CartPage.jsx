import { Link } from "react-router-dom"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import { useCart, useCheckout, useRemoveCartItem, useStripeCheckout, useUpdateCartItem } from "@/features/shop/queries"

const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`

export default function CartPage() {
  const { data, isLoading, error } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const checkout = useCheckout()
  const stripeCheckout = useStripeCheckout()
  const stripeError = stripeCheckout.error?.response?.data?.error
  const items = data?.items || []

  return (
    <main className="airq-info-page min-h-screen text-white">
      <div className="airq-info-bg" />
      <section className="airq-info-card">
        <Link className="airq-info-back" to="/shop">
          <ArrowLeft size={16} />
          Back to Shop
        </Link>
        <p className="airq-info-kicker">Shop</p>
        <h1>Your Cart</h1>
        {isLoading && <p>Loading cart...</p>}
        {error && <p className="text-red-300">Failed to load cart. Please sign in.</p>}
        {!isLoading && !error && (
          <div className="mt-6 space-y-3">
            {items.length === 0 && <p className="text-slate-200/85">Cart is empty.</p>}
            {items.map((item) => (
              <article key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-slate-200/80">{money(item.price_cents)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-white/20 p-1"
                    onClick={() => updateItem.mutate({ itemId: item.id, qty: item.qty - 1 })}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button
                    type="button"
                    className="rounded-md border border-white/20 p-1"
                    onClick={() => updateItem.mutate({ itemId: item.id, qty: item.qty + 1 })}
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    className="ml-2 rounded-md border border-white/20 p-1 text-rose-200"
                    onClick={() => removeItem.mutate(item.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                  <strong className="ml-3 w-20 text-right">{money(item.line_total_cents)}</strong>
                </div>
              </article>
            ))}
            {items.length > 0 && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-cyan-200/20 bg-cyan-400/10 p-4">
                <div>
                  <p className="text-sm text-slate-200/85">Total</p>
                  <strong className="text-xl">{money(data.total_cents)}</strong>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-900"
                  onClick={() => checkout.mutate()}
                >
                  {checkout.isPending ? "Processing..." : "Place order"}
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-900"
                  onClick={async () => {
                    try {
                      const response = await stripeCheckout.mutateAsync({ origin: window.location.origin })
                      if (response?.checkout_url) {
                        window.location.href = response.checkout_url
                      }
                    } catch (_) {
                      // handled via stripeError render below
                    }
                  }}
                >
                  {stripeCheckout.isPending ? "Redirecting..." : "Pay with card"}
                </button>
              </div>
            )}
            {checkout.data?.order_id && (
              <p className="text-emerald-300">
                Order #{checkout.data.order_id} placed successfully. <Link className="underline" to="/shop/orders">View orders</Link>
              </p>
            )}
            {stripeError && <p className="text-rose-300">{stripeError}</p>}
          </div>
        )}
      </section>
    </main>
  )
}
