/**
 * Checkout GraphQL Mutations for Vendure Shop API
 */

export const SET_ORDER_SHIPPING_ADDRESS = `
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order {
        id
        code
        state
        shippingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          country
          phoneNumber
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const GET_ELIGIBLE_SHIPPING_METHODS = `
  query GetEligibleShippingMethods {
    eligibleShippingMethods {
      id
      name
      code
      description
      metadata
      price
      priceWithTax
    }
  }
`;

export const SET_ORDER_SHIPPING_METHOD = `
  mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      ... on Order {
        id
        code
        state
        shipping
        shippingWithTax
        shippingLines {
          shippingMethod {
            id
            name
            code
          }
          priceWithTax
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const TRANSITION_ORDER_TO_STATE = `
  mutation TransitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order {
        id
        code
        state
      }
      ... on OrderStateTransitionError {
        errorCode
        message
        transitionError
        fromState
        toState
      }
    }
  }
`;

export const ADD_PAYMENT_TO_ORDER = `
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order {
        id
        code
        state
        active
        orderPlacedAt
        totalWithTax
        currencyCode
        lines {
          id
          productVariant {
            id
            name
            sku
            product {
              id
              name
              slug
              featuredAsset {
                preview
              }
            }
          }
          unitPriceWithTax
          quantity
          linePriceWithTax
        }
        shippingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          country
          phoneNumber
        }
        shippingLines {
          shippingMethod {
            name
            code
          }
          priceWithTax
        }
        payments {
          id
          method
          amount
          state
          transactionId
          metadata
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
      ... on PaymentFailedError {
        errorCode
        message
        paymentErrorMessage
      }
      ... on PaymentDeclinedError {
        errorCode
        message
        paymentErrorMessage
      }
      ... on OrderPaymentStateError {
        errorCode
        message
      }
      ... on IneligiblePaymentMethodError {
        errorCode
        message
        eligibilityCheckerMessage
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
      currencyCode
      lines {
        id
        productVariant {
          id
          name
          sku
          product {
            id
            name
            slug
            featuredAsset {
              preview
            }
          }
        }
        unitPriceWithTax
        quantity
        linePriceWithTax
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
      shippingLines {
        shippingMethod {
          name
          code
          description
        }
        priceWithTax
      }
      payments {
        id
        method
        amount
        state
        transactionId
      }
    }
  }
`;
