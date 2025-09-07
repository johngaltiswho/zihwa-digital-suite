import { HttpTypes } from "@medusajs/types"
import CheckoutForm from "./checkout-form"
import CheckoutSummary from "./checkout-summary"

type CheckoutTemplateProps = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}

const CheckoutTemplate = async ({ cart, customer }: CheckoutTemplateProps) => {
  if (!cart) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="lg:pr-8">
            <CheckoutForm cart={cart} customer={customer} />
          </div>

          {/* Checkout Summary */}
          <div className="lg:pl-8">
            <CheckoutSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutTemplate