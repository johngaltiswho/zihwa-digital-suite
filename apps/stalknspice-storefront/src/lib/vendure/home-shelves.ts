import { vendureClient } from "@/lib/vendure/client";
import { GET_COLLECTION_PAGINATED_LIGHT, GET_HIERARCHICAL_COLLECTIONS } from "@/lib/vendure/queries/products";
import type { Product } from "@/lib/vendure/types";

export type CategoryShelf = {
  collectionId: string;
  collectionName: string;
  collectionSlug: string;
  products: Product[];
};

type RawTopLevelCollection = {
  id: string;
  name: string;
  slug: string;
  children?: RawCollectionNode[];
};

type RawCollectionNode = {
  id: string;
  name: string;
  slug: string;
  children?: RawCollectionNode[];
};

const EXCLUDED_SLUGS = new Set(["__default_channel__"]);

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isOutOfStockLevel(stockLevel: string | number | undefined): boolean {
  return stockLevel === "OUT_OF_STOCK" || stockLevel === "0" || stockLevel === 0;
}

function buildProductFromVariant(pv: any, product: any): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: "",
    featuredAsset: product.featuredAsset,
    assets: [],
    variants: [
      {
        id: pv.id,
        sku: "",
        name: pv.name,
        price: pv.price,
        priceWithTax: pv.priceWithTax,
        currencyCode: "INR",
        stockLevel: pv.stockLevel,
        options: [],
        featuredAsset: pv.featuredAsset,
        assets: [],
      },
    ],
    collections: product.collections || [],
  };
}

function normalizeProductsFromCollectionVariants(items: any[]): Product[] {
  const productMap = new Map<string, Product>();

  for (const pv of items) {
    const product = pv?.product;
    if (!product?.id) continue;

    const existing = productMap.get(product.id);
    const incomingOutOfStock = isOutOfStockLevel(pv.stockLevel);

    // Keep first variant by default, but prefer an in-stock variant if seen later.
    if (!existing) {
      productMap.set(product.id, buildProductFromVariant(pv, product));
      continue;
    }

    const existingStock = existing.variants?.[0]?.stockLevel;
    const existingOutOfStock = isOutOfStockLevel(existingStock as string | number | undefined);

    if (existingOutOfStock && !incomingOutOfStock) {
      productMap.set(product.id, buildProductFromVariant(pv, product));
    }
  }

  return Array.from(productMap.values());
}

export async function fetchHomeCategoryShelves(limit = 6, productsPerShelf = 8): Promise<CategoryShelf[]> {
  const topLevelData = await vendureClient.request(GET_HIERARCHICAL_COLLECTIONS);
  const topLevelItems: RawTopLevelCollection[] = topLevelData.collections?.items || [];

  // Your data model places products on grandchildren collections.
  const grandchildCollections: RawCollectionNode[] = topLevelItems.flatMap((top) =>
    (top.children || []).flatMap((child) => child.children || []),
  );

  const candidates = shuffle(
    grandchildCollections.filter((c) => c.slug && !EXCLUDED_SLUGS.has(c.slug)),
  );

  const shelves: CategoryShelf[] = [];
  const batchSize = 4; // Process 4 collections at a time to avoid overwhelming the database

  for (let i = 0; i < candidates.length && shelves.length < limit; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);

    const batchResults = await Promise.allSettled(
      batch.map(async (collection) => {
        const collectionData = await vendureClient.request(GET_COLLECTION_PAGINATED_LIGHT, {
          slug: collection.slug,
          options: {
            take: productsPerShelf,
            skip: 0,
          },
        });

        const items = collectionData.collection?.productVariants?.items || [];
        const products = normalizeProductsFromCollectionVariants(items);
        if (products.length === 0) return null;

        return {
          collectionId: collection.id,
          collectionName: collection.name,
          collectionSlug: collection.slug,
          products,
        } satisfies CategoryShelf;
      }),
    );

    for (const result of batchResults) {
      if (shelves.length >= limit) break;
      if (result.status !== "fulfilled" || !result.value) continue;
      shelves.push(result.value);
    }
  }

  return shelves;
}
