'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { vendureClient, handleGraphQLError } from './client';
import { GET_COLLECTIONS, GET_COLLECTION } from './queries/products';
import type { Collection } from './types';

interface CollectionsContextType {
  collections: Collection[];
  topLevelCollections: Collection[];
  isLoading: boolean;
  error: string | null;
  getCollectionById: (id: string) => Collection | null;
  getCollectionBySlug: (slug: string) => Collection | null;
  getChildCollections: (parentId: string) => Collection[];
  refreshCollections: () => Promise<void>;
  clearError: () => void;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all collections on mount
  const refreshCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await vendureClient.request(GET_COLLECTIONS, {
        options: {
          filter: {
            parentId: { eq: "1" }
          },
          take: 100,
        },
      });

      const baseCollections: Collection[] = data.collections.items || [];

      const enrichedCollections = await Promise.all(
        baseCollections.map(async (collection) => {
          try {
            const detail = await vendureClient.request(GET_COLLECTION, { id: collection.id });
            const enrichedChildren = detail.collection?.children ?? collection.children ?? [];

            return {
              ...collection,
              children: enrichedChildren,
            };
          } catch (error) {
            console.error(`Failed to fetch children for collection ${collection.id}`, error);
            return collection;
          }
        })
      );

      setCollections(enrichedCollections);
      setError(null);
    } catch (err: any) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      console.error('Failed to fetch collections:', errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  // Compute top-level collections
  // Since we fetch with filter parentId: "1", all collections are already top-level
  const topLevelCollections = useMemo(() => {
    return collections;
  }, [collections]);

  // Helper: Get collection by ID
  const getCollectionById = useCallback((id: string): Collection | null => {
    return collections.find(c => c.id === id) || null;
  }, [collections]);

  // Helper: Get collection by slug
  const getCollectionBySlug = useCallback((slug: string): Collection | null => {
    return collections.find(c => c.slug === slug) || null;
  }, [collections]);

  // Helper: Get child collections of a parent (use embedded children list)
  const getChildCollections = useCallback((parentId: string): Collection[] => {
    const parent = collections.find(c => c.id === parentId);
    return parent?.children ?? [];
  }, [collections]);

  const clearError = () => {
    setError(null);
  };

  const value: CollectionsContextType = {
    collections,
    topLevelCollections,
    isLoading,
    error,
    getCollectionById,
    getCollectionBySlug,
    getChildCollections,
    refreshCollections,
    clearError,
  };

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}
