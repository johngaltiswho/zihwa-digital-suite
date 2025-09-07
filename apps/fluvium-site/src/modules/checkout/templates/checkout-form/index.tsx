import { listCartShippingMethods } from "@/lib/medusa-lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/medusa-lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@/modules/checkout/components/addresses"
import Payment from "@/modules/checkout/components/payment"
import Review from "@/modules/checkout/components/review"
import Shipping from "@/modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  console.log("🛒 Cart ID:", cart.id)
  console.log("🛒 Cart region:", cart.region?.id)
  console.log("🚚 Shipping methods:", shippingMethods?.length || 0)
  console.log("💳 Payment methods:", paymentMethods?.length || 0)

  if (!shippingMethods || !paymentMethods) {
    console.log("❌ Missing shipping or payment methods, not rendering checkout form")
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}
