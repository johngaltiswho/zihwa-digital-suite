/**
 * Cart (ActiveOrder) GraphQL Queries for Vendure Shop API
 */

export const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    code
    state
    active
    createdAt
    updatedAt
    totalQuantity
    subTotal
    subTotalWithTax
    shipping
    shippingWithTax
    total
    totalWithTax
    currencyCode
    lines {
      id
      productVariant {
        id
        name
        sku
        price
        priceWithTax
        currencyCode
        product {
          id
          slug
          name
          featuredAsset {
            id
            preview
          }
        }
      }
      featuredAsset {
        id
        preview
      }
      unitPrice
      unitPriceWithTax
      quantity
      linePrice
      linePriceWithTax
      discountedLinePrice
      discountedLinePriceWithTax
    }
  }
`;

export const GET_ACTIVE_ORDER = `
  ${ORDER_FRAGMENT}
  query GetActiveOrder {
    activeOrder {
      ...OrderFields
    }
  }
`;

export const GET_ELIGIBLE_SHIPPING_METHODS = `
  query GetEligibleShippingMethods {
    eligibleShippingMethods {
      id
      code
      name
      description
      price
      priceWithTax
      metadata
    }
  }
`;

export const GET_ELIGIBLE_PAYMENT_METHODS = `
  query GetEligiblePaymentMethods {
    eligiblePaymentMethods {
      id
      code
      name
      description
      isEligible
      eligibilityMessage
    }
  }
`;
