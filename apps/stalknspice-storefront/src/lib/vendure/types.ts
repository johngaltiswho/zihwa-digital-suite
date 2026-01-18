/**
 * TypeScript types for Vendure Shop API
 * Based on Vendure 3.5.2 GraphQL schema
 */

// ============================================================================
// Common Types
// ============================================================================

export interface Asset {
  id: string;
  preview: string;
  source: string;
  name?: string;
}

export interface FacetValue {
  id: string;
  name: string;
  code: string;
  facet: {
    id: string;
    name: string;
    code: string;
  };
}

// ============================================================================
// Product Types
// ============================================================================

export interface ProductVariantOptions {
  id: string;
  code: string;
  name: string;
  groupId: string;
  group: {
    id: string;
    code: string;
    name: string;
  };
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  priceWithTax: number;
  currencyCode: string;
  stockLevel: string;
  options: ProductVariantOptions[];
  featuredAsset?: Asset;
  assets?: Asset[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset?: Asset;
  assets?: Asset[];
  variants: ProductVariant[];
  facetValues?: FacetValue[];
  collections?: Collection[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  featuredAsset?: Asset;
  parent?: {
    id: string;
    name: string;
  };
  children?: Collection[];
}

export interface SearchResult {
  productId: string;
  productName: string;
  slug: string;
  description: string;
  priceWithTax: {
    min: number;
    max: number;
  };
  productAsset?: Asset;
  productVariantId: string;
  productVariantName: string;
  currencyCode: string;
}

export interface SearchResponse {
  items: SearchResult[];
  totalItems: number;
  facetValues: FacetValue[];
}

// ============================================================================
// Customer & Auth Types
// ============================================================================

export interface Customer {
  id: string;
  title?: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
}

export interface CurrentUser {
  id: string;
  identifier: string;
  channels: Array<{
    id: string;
    code: string;
    token: string;
  }>;
}

export interface Address {
  id?: string;
  fullName?: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
}

export interface CreateAddressInput {
  fullName?: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  countryCode: string;
  phoneNumber?: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
}

// ============================================================================
// Order & Cart Types
// ============================================================================

export interface OrderLine {
  id: string;
  productVariant: ProductVariant;
  featuredAsset?: Asset;
  unitPrice: number;
  unitPriceWithTax: number;
  quantity: number;
  linePrice: number;
  linePriceWithTax: number;
  discountedLinePrice: number;
  discountedLinePriceWithTax: number;
}

export interface ShippingMethod {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  priceWithTax: number;
}

export interface PaymentMethod {
  id: string;
  code: string;
  name: string;
  description?: string;
  enabled: boolean;
}

export interface Payment {
  id: string;
  method: string;
  amount: number;
  state: string;
  transactionId?: string;
  metadata?: Record<string, any>;
}

export interface Order {
  id: string;
  code: string;
  state: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  orderPlacedAt?: string;
  currencyCode: string;
  totalQuantity: number;
  subTotal: number;
  subTotalWithTax: number;
  shipping: number;
  shippingWithTax: number;
  total: number;
  totalWithTax: number;
  lines: OrderLine[];
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingLines?: Array<{
    shippingMethod: ShippingMethod;
    priceWithTax: number;
  }>;
  payments?: Payment[];
  customer?: Customer;
}

export type ActiveOrder = Order | null;

// ============================================================================
// GraphQL Response Types
// ============================================================================

export interface ProductListResponse {
  products: {
    items: Product[];
    totalItems: number;
  };
}

export interface CollectionListResponse {
  collections: {
    items: Collection[];
    totalItems: number;
  };
}

export interface OrderListResponse {
  activeCustomer: {
    orders: {
      items: Order[];
      totalItems: number;
    };
  };
}

// ============================================================================
// Error Types
// ============================================================================

export interface ErrorResult {
  errorCode: string;
  message: string;
}

export interface InvalidCredentialsError extends ErrorResult {
  errorCode: 'INVALID_CREDENTIALS_ERROR';
}

export interface NotVerifiedError extends ErrorResult {
  errorCode: 'NOT_VERIFIED_ERROR';
}

export interface AlreadyLoggedInError extends ErrorResult {
  errorCode: 'ALREADY_LOGGED_IN_ERROR';
}

export interface MissingPasswordError extends ErrorResult {
  errorCode: 'MISSING_PASSWORD_ERROR';
}

export type AuthenticationError =
  | InvalidCredentialsError
  | NotVerifiedError
  | AlreadyLoggedInError
  | MissingPasswordError;

// ============================================================================
// Input Types
// ============================================================================

export interface RegisterCustomerInput {
  emailAddress: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  title?: string;
}

export interface CreateAddressInput {
  fullName?: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  countryCode: string;
  phoneNumber?: string;
  defaultShippingAddress?: boolean;
  defaultBillingAddress?: boolean;
}

export interface SearchInput {
  term?: string;
  facetValueIds?: string[];
  facetValueOperator?: 'AND' | 'OR';
  collectionId?: string;
  collectionSlug?: string;
  groupByProduct?: boolean;
  take?: number;
  skip?: number;
  sort?: {
    name?: 'ASC' | 'DESC';
    price?: 'ASC' | 'DESC';
  };
}

export interface ProductListOptions {
  take?: number;
  skip?: number;
  sort?: {
    name?: 'ASC' | 'DESC';
    price?: 'ASC' | 'DESC';
    createdAt?: 'ASC' | 'DESC';
  };
  filter?: {
    name?: {
      contains?: string;
    };
  };
}
