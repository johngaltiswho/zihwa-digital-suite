/**
 * Product GraphQL Queries for Vendure Shop API
 */

export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    name
    slug
    description
    featuredAsset {
      id
      preview
      source
    }
    assets {
      id
      preview
      source
    }
    variants {
      id
      name
      sku
      price
      priceWithTax
      currencyCode
      stockLevel
      featuredAsset {
        id
        preview
        source
      }
    }
  }
`;

export const GET_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        ...ProductFields
      }
      totalItems
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = `
  ${PRODUCT_FRAGMENT}
  query GetProductBySlug($slug: String!) {
    product(slug: $slug) {
      ...ProductFields
      facetValues {
        id
        name
        code
        facet {
          id
          name
          code
        }
      }
      collections {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = `
  ${PRODUCT_FRAGMENT}
  query GetProductById($id: ID!) {
    product(id: $id) {
      ...ProductFields
    }
  }
`;

export const SEARCH_PRODUCTS = `
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      items {
        productId
        productName
        slug
        description
        priceWithTax {
          ... on PriceRange {
            min
            max
          }
          ... on SinglePrice {
            value
          }
        }
        productAsset {
          id
          preview
        }
        productVariantId
        productVariantName
        currencyCode
        score
      }
      totalItems
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_COLLECTIONS = `
  query GetCollections($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset {
          id
          preview
          source
        }
        parent {
          id
          name
          slug
        }
        children {
          id
          name
          slug
          featuredAsset {
            id
            preview
          }
          children {
            id
            name
            slug
            featuredAsset {
              id
              preview
            }
          }
        }
      }
      totalItems
    }
  }
`;

export const GET_COLLECTION = `
  query GetCollection($slug: String, $id: ID) {
    collection(slug: $slug, id: $id) {
      id
      name
      slug
      description
      featuredAsset {
        id
        preview
        source
      }
      breadcrumbs {
        id
        name
        slug
      }
      children {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
        children {
          id
          name
          slug
          featuredAsset {
            id
            preview
          }
        }
      }
    }
  }
`;
