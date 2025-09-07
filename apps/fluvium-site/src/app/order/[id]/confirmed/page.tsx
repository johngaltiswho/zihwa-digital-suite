import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveOrder } from "@/lib/medusa-lib/data/orders"
import OrderCompletedTemplate from "@/modules/order/templates/order-completed-template"
import Nav from "@/modules/layout/templates/nav"
import Footer from "@/modules/layout/templates/footer"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Order Confirmed - ${order.display_id}`,
    description: `Order confirmation for order ${order.display_id}`,
  }
}

export default async function OrderConfirmedPage({ params }: Props) {
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return (
    <div className="order-confirmation-layout">
      <Nav />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <OrderCompletedTemplate order={order} />
        </div>
      </div>
      <Footer />
    </div>
  )
}