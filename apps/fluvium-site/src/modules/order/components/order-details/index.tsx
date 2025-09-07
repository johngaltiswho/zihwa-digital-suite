import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
          <span className="text-cyan-400 text-sm">📧</span>
        </div>
        <div>
          <Text className="text-white text-sm">
            Confirmation sent to{" "}
            <span
              className="text-cyan-400 font-semibold"
              data-testid="order-email"
            >
              {order.email}
            </span>
          </Text>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900/40 rounded-md p-4">
          <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
            Order Date
          </Text>
          <Text className="text-white font-medium" data-testid="order-date">
            {new Date(order.created_at).toDateString()}
          </Text>
        </div>
        
        <div className="bg-gray-900/40 rounded-md p-4">
          <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
            Order Number
          </Text>
          <Text className="text-cyan-400 font-bold text-lg" data-testid="order-id">
            #{order.display_id}
          </Text>
        </div>
      </div>

      {showStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-900/40 rounded-md p-4">
            <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Order Status
            </Text>
            <Text className="text-white font-medium" data-testid="order-status">
              {formatStatus(order.fulfillment_status)}
            </Text>
          </div>
          
          <div className="bg-gray-900/40 rounded-md p-4">
            <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Payment Status
            </Text>
            <Text className="text-white font-medium" data-testid="order-payment-status">
              {formatStatus(order.payment_status)}
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
