"use client"

import { setAddresses } from "@/lib/medusa-lib/data/cart"
import compareAddresses from "@/lib/medusa-lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@/modules/common/components/divider"
import Spinner from "@/modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline text-white"
        >
          Shipping Address
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8 text-white"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6" data-testid="submit-address-button">
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className="flex flex-col space-y-2"
                  data-testid="shipping-address-summary"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <Text className="font-semibold text-white text-base">
                      Shipping Address
                    </Text>
                  </div>
                  <div className="bg-gray-900/40 rounded-md p-3 space-y-1">
                    <Text className="font-medium text-white text-sm">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      {cart.shipping_address.address_1}
                      {cart.shipping_address.address_2 && `, ${cart.shipping_address.address_2}`}
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      {cart.shipping_address.postal_code} {cart.shipping_address.city}
                    </Text>
                    <Text className="text-gray-300 text-sm font-medium">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>
                </div>

                <div
                  className="flex flex-col space-y-2"
                  data-testid="shipping-contact-summary"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <Text className="font-semibold text-white text-base">
                      Contact Information
                    </Text>
                  </div>
                  <div className="bg-gray-900/40 rounded-md p-3 space-y-1">
                    <Text className="text-gray-300 text-sm">
                      📞 {cart.shipping_address.phone}
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      ✉️ {cart.email}
                    </Text>
                  </div>
                </div>

                <div
                  className="flex flex-col space-y-2"
                  data-testid="billing-address-summary"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <Text className="font-semibold text-white text-base">
                      Billing Address
                    </Text>
                  </div>
                  <div className="bg-gray-900/40 rounded-md p-3 space-y-1">
                    {sameAsBilling ? (
                      <Text className="text-gray-300 text-sm italic">
                        Same as shipping address
                      </Text>
                    ) : (
                      <div className="space-y-1">
                        <Text className="font-medium text-white text-sm">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="text-gray-300 text-sm">
                          {cart.billing_address?.address_1}
                          {cart.billing_address?.address_2 && `, ${cart.billing_address?.address_2}`}
                        </Text>
                        <Text className="text-gray-300 text-sm">
                          {cart.billing_address?.postal_code} {cart.billing_address?.city}
                        </Text>
                        <Text className="text-gray-300 text-sm font-medium">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
