/**
 * Cart (ActiveOrder) GraphQL Mutations for Vendure Shop API
 */

export const ADD_ITEM_TO_ORDER = `
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      __typename
      ... on Order {
        id
        code
        state
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
            product {
              id
              slug
              name
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
        }
      }
      ... on OrderModificationError {
        errorCode
        message
      }
      ... on OrderLimitError {
        errorCode
        message
      }
      ... on NegativeQuantityError {
        errorCode
        message
      }
      ... on InsufficientStockError {
        errorCode
        message
        quantityAvailable
        order {
          id
        }
      }
    }
  }
`;

export const ADJUST_ORDER_LINE = `
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      __typename
      ... on Order {
        id
        code
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
            product {
              id
              slug
              name
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
        }
      }
      ... on OrderModificationError {
        errorCode
        message
      }
      ... on InsufficientStockError {
        errorCode
        message
        quantityAvailable
      }
    }
  }
`;

export const REMOVE_ORDER_LINE = `
  mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      __typename
      ... on Order {
        id
        code
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
            product {
              id
              slug
              name
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
        }
      }
      ... on OrderModificationError {
        errorCode
        message
      }
    }
  }
`;

export const REMOVE_ALL_ORDER_LINES = `
  mutation RemoveAllOrderLines {
    removeAllOrderLines {
      __typename
      ... on Order {
        id
        code
        totalQuantity
        lines {
          id
        }
      }
      ... on OrderModificationError {
        errorCode
        message
      }
    }
  }
`;
