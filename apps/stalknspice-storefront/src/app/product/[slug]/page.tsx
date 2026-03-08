import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { vendureClient } from "@/lib/vendure/client"
import { GET_PRODUCT_BY_SLUG } from "@/lib/vendure/queries/products"
import { getAssetUrl } from "@/lib/vendure/asset-utils"
import ProductPageClient from './ProductPageClient'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  try {
    const data = await vendureClient.request(GET_PRODUCT_BY_SLUG, { slug })
    const product = data.product

    if (!product) {
      return { title: 'Product Not Found | Stalks N Spice' }
    }

    const variant = product.variants?.[0]
    const price = variant ? (variant.priceWithTax / 100).toFixed(0) : 'N/A'
    const inStock = variant?.stockLevel !== 'OUT_OF_STOCK'

    // Extract brand from collections
    const brandName = product.collections
      ?.find(c => /brand/i.test(c.name))
      ?.name.replace(/^brand[-\s]*/i, '') || ''

    // Dual B2C/B2B meta description strategy
    const description = `${product.name} - ₹${price} | Premium ${brandName ? brandName + ' ' : ''}product available for retail & bulk orders. 45-min express delivery in Bangalore. Perfect for restaurants, cafes & home chefs. Buy online at Stalks N Spice.`

    // Extract category from collections
    const category = product.collections?.find(c => !/brand/i.test(c.name))?.name || 'Specialty Ingredients'

    // Keywords: B2C + B2B + Local
    const keywords = [
      product.name,
      `${product.name} online India`,
      `${brandName} ${category}`,
      `buy ${category} Bangalore`,
      `wholesale ${category} suppliers`,
      `restaurant ingredients Bangalore`,
      `bulk ${category} Karnataka`,
      brandName,
      'Stalks N Spice'
    ].filter(Boolean)

    const imageUrl = getAssetUrl(variant?.featuredAsset?.preview || product.featuredAsset?.preview)

    return {
      title: `${product.name}${brandName ? ` - ${brandName}` : ''} | ₹${price}`,
      description,
      keywords,
      openGraph: {
        type: 'website',
        url: `https://stalknspice.com/product/${slug}`,
        title: `${product.name}${brandName ? ` - ${brandName}` : ''}`,
        description,
        images: [{
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name
        }],
        siteName: 'Stalks N Spice',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name}${brandName ? ` - ${brandName}` : ''}`,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://stalknspice.com/product/${slug}`
      },
      other: {
        'product:price:amount': price,
        'product:price:currency': 'INR',
        'product:availability': inStock ? 'in stock' : 'out of stock',
        'product:brand': brandName || 'Stalks N Spice',
        'product:category': category,
      }
    }
  } catch (error) {
    console.error('Error generating product metadata:', error)
    return { title: 'Product | Stalks N Spice' }
  }
}

// Product Schema Structured Data
function ProductStructuredData({ product, variant }: any) {
  const price = variant ? (variant.priceWithTax / 100).toFixed(2) : '0'
  const imageUrl = getAssetUrl(variant?.featuredAsset?.preview || product.featuredAsset?.preview)
  const brandName = product.collections
    ?.find((c: any) => /brand/i.test(c.name))
    ?.name.replace(/^brand[-\s]*/i, '') || 'Stalks N Spice'

  const inStock = variant?.stockLevel !== 'OUT_OF_STOCK'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: imageUrl,
    description: product.description?.replace(/<[^>]*>/g, '') || product.name, // Strip HTML tags
    sku: variant?.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: brandName
    },
    offers: {
      '@type': 'Offer',
      url: `https://stalknspice.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: price,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Stalks N Spice'
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
          addressRegion: 'Karnataka'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          }
        }
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const data = await vendureClient.request(GET_PRODUCT_BY_SLUG, { slug })

    if (!data.product) {
      notFound()
    }

    return (
      <>
        <ProductStructuredData product={data.product} variant={data.product.variants?.[0]} />
        <ProductPageClient initialProduct={data.product} slug={slug} />
      </>
    )
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
}
