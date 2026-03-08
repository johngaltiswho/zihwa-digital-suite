import { gql } from 'graphql-request'

export const GET_ALL_PRODUCTS_FOR_SITEMAP = gql`
  query GetAllProductsForSitemap($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        slug
        updatedAt
      }
      totalItems
    }
  }
`

export const GET_ALL_COLLECTIONS_FOR_SITEMAP = gql`
  query GetAllCollectionsForSitemap($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        slug
        updatedAt
      }
      totalItems
    }
  }
`
