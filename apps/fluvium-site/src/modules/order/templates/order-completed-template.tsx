import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@/modules/common/components/cart-totals"
import Help from "@/modules/order/components/help"
import Items from "@/modules/order/components/items"
import OnboardingCta from "@/modules/order/components/onboarding-cta"
import OrderDetails from "@/modules/order/components/order-details"
import ShippingDetails from "@/modules/order/components/shipping-details"
import PaymentDetails from "@/modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <Heading
            level="h1"
            className="flex flex-col gap-y-2 text-white text-3xl mb-2"
          >
            <span>Order Confirmed!</span>
          </Heading>
          <p className="text-gray-300 text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <div
          className="flex flex-col gap-6 max-w-4xl h-full bg-gray-900/50 border border-gray-700/50 rounded-xl w-full p-8"
          data-testid="order-complete-container"
        >
          <OrderDetails order={order} />
          
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
            <Heading level="h2" className="flex flex-row text-2xl text-white mb-6">
              Order Summary
            </Heading>
            <Items order={order} />
            <CartTotals totals={order} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ShippingDetails order={order} />
            <PaymentDetails order={order} />
          </div>
          
          <Help />
        </div>
      </div>
    </div>
  )
}
