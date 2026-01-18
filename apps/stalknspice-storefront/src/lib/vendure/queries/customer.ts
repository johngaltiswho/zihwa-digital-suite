/**
 * Customer GraphQL Queries for Vendure Shop API
 */

export const GET_ACTIVE_CUSTOMER = `
  query GetActiveCustomer {
    activeCustomer {
      id
      title
      firstName
      lastName
      emailAddress
      phoneNumber
    }
  }
`;

export const GET_ACTIVE_CUSTOMER_ADDRESSES = `
  query GetActiveCustomerAddresses {
    activeCustomer {
      id
      addresses {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
          code
          name
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
      }
    }
  }
`;

export const GET_ACTIVE_CUSTOMER_ORDERS = `
  query GetActiveCustomerOrders($options: OrderListOptions) {
    activeCustomer {
      id
      orders(options: $options) {
        items {
          id
          code
          state
          totalWithTax
          currencyCode
          createdAt
          updatedAt
          orderPlacedAt
          lines {
            id
            productVariant {
              id
              name
              sku
            }
            featuredAsset {
              id
              preview
            }
            quantity
            linePriceWithTax
          }
        }
        totalItems
      }
    }
  }
`;

export const GET_ORDER_BY_CODE = `
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      id
      code
      state
      active
      createdAt
      updatedAt
      orderPlacedAt
      totalWithTax
      subTotalWithTax
      shipping
      shippingWithTax
      currencyCode
      lines {
        id
        productVariant {
          id
          name
          sku
        }
        featuredAsset {
          id
          preview
        }
        unitPriceWithTax
        quantity
        linePriceWithTax
      }
      shippingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
      payments {
        id
        method
        amount
        state
        transactionId
        createdAt
      }
    }
  }
`;

export const GET_AVAILABLE_COUNTRIES = `
  query GetAvailableCountries {
    availableCountries {
      id
      code
      name
    }
  }
`;
