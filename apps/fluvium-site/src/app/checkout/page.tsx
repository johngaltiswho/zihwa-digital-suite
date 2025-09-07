import { Metadata } from "next"

import { retrieveCart } from "@/lib/medusa-lib/data/cart"
import { retrieveCustomer } from "@/lib/medusa-lib/data/customer"
import CheckoutTemplate from "@/modules/checkout/templates"
import Nav from "@/modules/layout/templates/nav"
import Footer from "@/modules/layout/templates/footer"

export const metadata: Metadata = {
  title: "Checkout - Fluvium",
}

export default async function Checkout() {
  const cart = await retrieveCart()
  const customer = await retrieveCustomer()

  return (
    <div className="checkout-layout">
      <Nav />
      <CheckoutTemplate cart={cart} customer={customer} />
      <Footer />
    </div>
  )
}