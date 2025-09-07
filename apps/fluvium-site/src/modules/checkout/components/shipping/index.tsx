"use client"

import { RadioGroup, Radio } from "@headlessui/react"
import { setShippingMethod } from "@/lib/medusa-lib/data/cart"
import { calculatePriceForShippingOption } from "@/lib/medusa-lib/data/fulfillment"
import { convertToLocale } from "@/lib/medusa-lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@/modules/checkout/components/error-message"
import Divider from "@/modules/common/components/divider"
import MedusaRadio from "@/modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          Delivery
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid />
          )}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                data-testid="edit-delivery-button"
              >
                Edit
              </button>
            </Text>
          )}
      </div>
      {isOpen ? (
        <>
          <div className="grid">
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-white mb-2">
                Choose your delivery method
              </span>
              <span className="mb-6 text-gray-300 text-sm">
                Select how you'd like to receive your order
              </span>
            </div>
            <div data-testid="delivery-options-container">
              <div className="pb-8 md:pt-0 pt-2">
                {hasPickupOptions && (
                  <RadioGroup
                    value={showPickupOptions}
                    onChange={(value) => {
                      const id = _pickupMethods.find(
                        (option) => !option.insufficient_inventory
                      )?.id

                      if (id) {
                        handleSetShippingMethod(id, "pickup")
                      }
                    }}
                  >
                    <Radio
                      value={PICKUP_OPTION_ON}
                      data-testid="delivery-option-radio"
                      className={clx(
                        "flex items-center justify-between text-small-regular cursor-pointer py-4 px-6 mb-3 rounded-xl border-2 transition-all duration-200 hover:bg-gray-800/30",
                        {
                          "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20":
                            showPickupOptions === PICKUP_OPTION_ON,
                          "border-gray-600 bg-gray-800/20 hover:border-gray-500":
                            showPickupOptions !== PICKUP_OPTION_ON,
                        }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <div className={clx(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                          {
                            "border-cyan-400 bg-cyan-400": showPickupOptions === PICKUP_OPTION_ON,
                            "border-gray-500": showPickupOptions !== PICKUP_OPTION_ON
                          }
                        )}>
                          {showPickupOptions === PICKUP_OPTION_ON && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className={clx(
                            "font-medium text-base",
                            {
                              "text-white": true
                            }
                          )}>
                            Pick up your order
                          </span>
                          <span className="text-sm text-gray-400">Choose a nearby pickup location</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={clx(
                          "font-semibold text-lg",
                          {
                            "text-cyan-400": showPickupOptions === PICKUP_OPTION_ON,
                            "text-white": showPickupOptions !== PICKUP_OPTION_ON,
                          }
                        )}>
                          Free
                        </span>
                        <span className="text-xs text-green-400 font-medium">FREE</span>
                      </div>
                    </Radio>
                  </RadioGroup>
                )}
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => handleSetShippingMethod(v, "shipping")}
                >
                  {_shippingMethods?.map((option) => {
                    const isDisabled =
                      option.price_type === "calculated" &&
                      !isLoadingPrices &&
                      typeof calculatedPricesMap[option.id] !== "number"

                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        disabled={isDisabled}
                        className={clx(
                          "flex items-center justify-between text-small-regular cursor-pointer py-4 px-6 mb-3 rounded-xl border-2 transition-all duration-200 hover:bg-gray-800/30",
                          {
                            "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20":
                              option.id === shippingMethodId,
                            "border-gray-600 bg-gray-800/20 hover:border-gray-500":
                              option.id !== shippingMethodId && !isDisabled,
                            "border-gray-700 bg-gray-800/10 cursor-not-allowed opacity-50":
                              isDisabled,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <div className={clx(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                            {
                              "border-cyan-400 bg-cyan-400": option.id === shippingMethodId,
                              "border-gray-500": option.id !== shippingMethodId
                            }
                          )}>
                            {option.id === shippingMethodId && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className={clx(
                              "font-medium text-base",
                              {
                                "text-white": option.id === shippingMethodId || !isDisabled,
                                "text-gray-400": isDisabled
                              }
                            )}>
                              {option.name}
                            </span>
                            {option.name === "Express Delivery" && (
                              <span className="text-sm text-gray-400">Delivered in 1-2 business days</span>
                            )}
                            {option.name === "In-Store-Pickup" && (
                              <span className="text-sm text-gray-400">Ready for pickup in 2-4 hours</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={clx(
                            "font-semibold text-lg",
                            {
                              "text-cyan-400": option.id === shippingMethodId,
                              "text-white": option.id !== shippingMethodId && !isDisabled,
                              "text-gray-400": isDisabled
                            }
                          )}>
                            {option.price_type === "flat" ? (
                              convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })
                            ) : calculatedPricesMap[option.id] ? (
                              convertToLocale({
                                amount: calculatedPricesMap[option.id],
                                currency_code: cart?.currency_code,
                              })
                            ) : isLoadingPrices ? (
                              <Loader />
                            ) : (
                              "-"
                            )}
                          </span>
                          {option.amount === 0 && (
                            <span className="text-xs text-green-400 font-medium">FREE</span>
                          )}
                        </div>
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="grid">
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-white mb-2">
                  Select pickup location
                </span>
                <span className="mb-6 text-gray-300 text-sm">
                  Choose a convenient store location
                </span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => handleSetShippingMethod(v, "pickup")}
                  >
                    {_pickupMethods?.map((option) => {
                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          disabled={option.insufficient_inventory}
                          data-testid="delivery-option-radio"
                          className={clx(
                            "flex items-center justify-between text-small-regular cursor-pointer py-4 px-6 mb-3 rounded-xl border-2 transition-all duration-200 hover:bg-gray-800/30",
                            {
                              "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20":
                                option.id === shippingMethodId,
                              "border-gray-600 bg-gray-800/20 hover:border-gray-500":
                                option.id !== shippingMethodId && !option.insufficient_inventory,
                              "border-gray-700 bg-gray-800/10 cursor-not-allowed opacity-50":
                                option.insufficient_inventory,
                            }
                          )}
                        >
                          <div className="flex items-start gap-x-4">
                            <div className={clx(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 mt-1",
                              {
                                "border-cyan-400 bg-cyan-400": option.id === shippingMethodId,
                                "border-gray-500": option.id !== shippingMethodId
                              }
                            )}>
                              {option.id === shippingMethodId && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className={clx(
                                "font-medium text-base mb-1",
                                {
                                  "text-white": !option.insufficient_inventory,
                                  "text-gray-400": option.insufficient_inventory
                                }
                              )}>
                                {option.name}
                              </span>
                              <span className="text-sm text-gray-400 leading-relaxed">
                                {formatAddress(
                                  option.service_zone?.fulfillment_set?.location
                                    ?.address
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={clx(
                              "font-semibold text-lg",
                              {
                                "text-cyan-400": option.id === shippingMethodId,
                                "text-white": option.id !== shippingMethodId && !option.insufficient_inventory,
                                "text-gray-400": option.insufficient_inventory
                              }
                            )}>
                              {convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })}
                            </span>
                            {option.amount === 0 && (
                              <span className="text-xs text-green-400 font-medium">FREE</span>
                            )}
                          </div>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              size="large"
              className="
                mt-6 w-full
                bg-gradient-to-r from-cyan-500 to-cyan-600 
                hover:from-cyan-600 hover:to-cyan-700
                text-white font-semibold 
                px-8 py-4 rounded-xl 
                shadow-lg shadow-cyan-500/25 
                hover:shadow-xl hover:shadow-cyan-500/35
                disabled:from-gray-600 disabled:to-gray-700 
                disabled:shadow-gray-500/25
                transition-all duration-200 
                transform hover:scale-[1.02] 
                disabled:hover:scale-100
                border-0
              "
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!cart.shipping_methods?.[0]}
              variant="transparent"
              data-testid="submit-delivery-option-button"
            >
              Continue to payment
            </Button>
          </div>
        </>
      ) : (
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <Text className="font-semibold text-white text-base">
                    Delivery Method
                  </Text>
                </div>
                <div className="bg-gray-900/40 rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400 text-sm">🚚</span>
                    </div>
                    <div>
                      <Text className="font-medium text-white text-sm">
                        {cart.shipping_methods?.at(-1)?.name}
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        {cart.shipping_methods?.at(-1)?.name === "Express Delivery" && "Delivered in 1-2 business days"}
                        {cart.shipping_methods?.at(-1)?.name === "In-Store-Pickup" && "Ready for pickup in 2-4 hours"}
                        {cart.shipping_methods?.at(-1)?.name === "Standard Shipping" && "Delivered in 3-5 business days"}
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="font-semibold text-cyan-400 text-base">
                      {convertToLocale({
                        amount: cart.shipping_methods.at(-1)?.amount!,
                        currency_code: cart?.currency_code,
                      })}
                    </Text>
                    {cart.shipping_methods.at(-1)?.amount === 0 && (
                      <Text className="text-xs text-green-400 font-medium">FREE</Text>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Shipping
