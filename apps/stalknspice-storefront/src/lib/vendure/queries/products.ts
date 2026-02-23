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
    collections {
      id
      name
      slug
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

export const GET_PRODUCTS_LIGHT = `
  query GetProductsLight($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
        variants {
          id
          name
          price
          priceWithTax
          stockLevel
          featuredAsset {
            preview
          }
        }
        collections {
          id
          name
          slug
        }
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
          children {
            id
            name
            slug
          }
        }
      }
      totalItems
    }
  }
`;

export const GET_COLLECTION = `
  ${PRODUCT_FRAGMENT}
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
      productVariants {
        totalItems
        items {
          id
          name
          priceWithTax
          currencyCode
          product {
            ...ProductFields
          }
        }
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
export const GET_SIDEBAR_COLLECTIONS = `
  query GetSidebarCollections {
    collections(options: { topLevelOnly: true }) {
      items {
        id
        name
        slug
        featuredAsset {
          preview
        }
        children {
          id
          name
          slug
        }
      }
    }
  }
`;

export const GET_COLLECTIONS_WITH_COUNTS = `
  query GetCollectionsWithCounts($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
        productVariants(options: { take: 1 }) {
          totalItems
        }
      }
      totalItems
    }
  }
`;

export const GET_COLLECTION_PAGINATED = `
  query GetCollectionPaginated($slug: String!, $options: ProductVariantListOptions) {
    collection(slug: $slug) {
      id
      name
      slug
      productVariants(options: $options) {
        totalItems
        items {
          id
          name
          price
          priceWithTax
          stockLevel
          featuredAsset {
            preview
          }
          product {
            id
            name
            slug
            featuredAsset {
              preview
            }
            collections {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_PAGINATED_LIGHT = `
  query GetCollectionPaginatedLight($slug: String!, $options: ProductVariantListOptions) {
    collection(slug: $slug) {
      id
      name
      slug
      productVariants(options: $options) {
        totalItems
        items {
          id
          name
          price
          priceWithTax
          stockLevel
          featuredAsset {
            preview
          }
          product {
            id
            name
            slug
            featuredAsset {
              preview
            }
          }
        }
      }
    }
  }
`;

export const GET_HIERARCHICAL_COLLECTIONS = `
  query GetHierarchicalCollections {
    collections(options: { filter: { parentId: { eq: "1" } }, take: 100 }) {
      items {
        id
        name
        slug
        children {
          id
          name
          slug
          children {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_BRAND_COLLECTIONS = `
  query GetBrandCollections($options: CollectionListOptions) {
    collections(options: $options) {
      totalItems
      items {
        id
        name
        slug
      }
    }
  }
`;
