export const CREATE_RAZORPAY_ORDER = `
  mutation CreateRazorpayOrder($amount: Int!) {
    createRazorpayOrder(amount: $amount) {
      id
      amount
      currency
      keyId
    }
  }
`;
