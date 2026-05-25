import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { get, post, http } from "@/lib/http"

export const shopKeys = {
  products: ["shop", "products"],
  cart: ["shop", "cart"],
  orders: ["shop", "orders"],
}

export function useShopProducts() {
  return useQuery({
    queryKey: shopKeys.products,
    queryFn: () => get("/shop/products"),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCart() {
  return useQuery({
    queryKey: shopKeys.cart,
    queryFn: () => get("/shop/cart"),
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ product_id, qty = 1 }) => post("/shop/cart/items", { product_id, qty }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shopKeys.cart }),
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, qty }) => http.patch(`/shop/cart/items/${itemId}`, { qty }).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shopKeys.cart }),
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId) => http.delete(`/shop/cart/items/${itemId}`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shopKeys.cart }),
  })
}

export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => post("/shop/checkout", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.cart })
      queryClient.invalidateQueries({ queryKey: shopKeys.orders })
    },
  })
}

export function useOrders() {
  return useQuery({
    queryKey: shopKeys.orders,
    queryFn: () => get("/shop/orders"),
  })
}

export function useStripeCheckout() {
  return useMutation({
    mutationFn: ({ origin }) => post("/payments/create-checkout-session", { origin }),
  })
}
