"use client"

import Back from "@/modules/common/icons/back"
import FastDelivery from "@/modules/common/icons/fast-delivery"
import Refresh from "@/modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Material</span>
            <p className="text-gray-200 mt-2">{product.material ? product.material : "Not specified"}</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Country of origin</span>
            <p className="text-gray-200 mt-2">{product.origin_country ? product.origin_country : "Not specified"}</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Type</span>
            <p className="text-gray-200 mt-2">{product.type ? product.type.value : "Not specified"}</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Weight</span>
            <p className="text-gray-200 mt-2">{product.weight ? `${product.weight} g` : "Not specified"}</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Dimensions</span>
            <p className="text-gray-200 mt-2">
              {product.length && product.width && product.height
                ? `${product.length}L × ${product.width}W × ${product.height}H`
                : "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-6">
      <div className="space-y-6">
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 flex items-start gap-4">
          <div className="text-cyan-400 mt-1">
            <FastDelivery />
          </div>
          <div className="flex-1">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Fast delivery</span>
            <p className="text-gray-200 mt-2 leading-relaxed">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 flex items-start gap-4">
          <div className="text-cyan-400 mt-1">
            <Refresh />
          </div>
          <div className="flex-1">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Simple exchanges</span>
            <p className="text-gray-200 mt-2 leading-relaxed">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 flex items-start gap-4">
          <div className="text-cyan-400 mt-1">
            <Back />
          </div>
          <div className="flex-1">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Easy returns</span>
            <p className="text-gray-200 mt-2 leading-relaxed">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
