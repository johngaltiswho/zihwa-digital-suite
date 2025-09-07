import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"

import Radio from "@/modules/common/components/radio"

import { isManual } from "@/lib/medusa-lib/constants"
import SkeletonCardDetails from "@/modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 px-6 mb-3 rounded-xl border-2 transition-all duration-200 hover:bg-gray-800/30",
        {
          "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20":
            selectedPaymentOptionId === paymentProviderId,
          "border-gray-600 bg-gray-800/20 hover:border-gray-500":
            selectedPaymentOptionId !== paymentProviderId && !disabled,
          "border-gray-700 bg-gray-800/10 cursor-not-allowed opacity-50":
            disabled,
        }
      )}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-x-4">
          <div className={clx(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200",
            {
              "border-cyan-400 bg-cyan-400": selectedPaymentOptionId === paymentProviderId,
              "border-gray-500": selectedPaymentOptionId !== paymentProviderId
            }
          )}>
            {selectedPaymentOptionId === paymentProviderId && (
              <div className="w-2 h-2 rounded-full bg-white"></div>
            )}
          </div>
          <Text className={clx(
            "font-medium text-base",
            {
              "text-white": !disabled,
              "text-gray-400": disabled
            }
          )}>
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <div className="flex items-center">
          <span className={clx(
            "transition-colors duration-200",
            {
              "text-cyan-400": selectedPaymentOptionId === paymentProviderId,
              "text-white": selectedPaymentOptionId !== paymentProviderId && !disabled,
              "text-gray-400": disabled
            }
          )}>
            {paymentInfoMap[paymentProviderId]?.icon}
          </span>
        </div>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <Text className="txt-medium-plus text-white mb-1">
              Enter your card details:
            </Text>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
