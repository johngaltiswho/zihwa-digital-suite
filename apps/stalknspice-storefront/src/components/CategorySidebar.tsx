"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Package, ShieldCheck, ChevronDown } from "lucide-react";
import { vendureClient } from "@/lib/vendure/client";
import { GET_HIERARCHICAL_COLLECTIONS } from "@/lib/vendure/queries/products";

interface GrandchildCollection {
  id: string;
  name: string;
  slug: string;
}

interface ChildCollection {
  id: string;
  name: string;
  slug: string;
  children?: GrandchildCollection[];
}

interface ParentCollection {
  id: string;
  name: string;
  slug: string;
  children: ChildCollection[];
  productCategories?: GrandchildCollection[];
  brandCategories?: GrandchildCollection[];
}

interface CategorySidebarProps {
  selectedCollection?: string | null;
  onCollectionClick?: (slug: string | null) => void;
}

export function CategorySidebar({
  selectedCollection,
  onCollectionClick,
}: CategorySidebarProps) {
  const [parentCollections, setParentCollections] = useState<ParentCollection[]>([]);
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      setCollectionsLoading(true);
      try {
        const data = await vendureClient.request(GET_HIERARCHICAL_COLLECTIONS);

        const parentsWithProducts = (data.collections.items || [])
          .map((parent: any) => {
            const productsContainer = parent.children?.find((child: any) =>
              child.name === "Products" || child.name.toLowerCase().includes("product"),
            );

            const brandsContainer = parent.children?.find((child: any) =>
              child.name === "Brands" || child.name.toLowerCase().includes("brand"),
            );

            let productCategories = (productsContainer?.children || []).filter(
              (grandchild: GrandchildCollection) => grandchild.slug && grandchild.slug.trim() !== "",
            );

            let brandCategories = (brandsContainer?.children || []).filter(
              (grandchild: GrandchildCollection) => grandchild.slug && grandchild.slug.trim() !== "",
            );

            if (productCategories.length === 0 && brandCategories.length === 0) {
              const childrenWithGrandchildren = (parent.children || []).filter(
                (child: any) => child.children && child.children.length > 0,
              );

              if (childrenWithGrandchildren.length > 0) {
                productCategories = childrenWithGrandchildren
                  .flatMap((child: any) => child.children || [])
                  .filter((grandchild: GrandchildCollection) => grandchild.slug && grandchild.slug.trim() !== "");
              }
            }

            return {
              ...parent,
              productCategories,
              brandCategories,
              children: parent.children || [],
            };
          })
          .filter(
            (parent: ParentCollection) =>
              (parent.productCategories?.length || 0) > 0 || (parent.brandCategories?.length || 0) > 0,
          )
          .sort((a: ParentCollection, b: ParentCollection) => a.name.localeCompare(b.name));

        setParentCollections(parentsWithProducts);
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      } finally {
        setCollectionsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    if (!selectedCollection || parentCollections.length === 0) return;

    const selectedParent = parentCollections.find((p) => p.slug === selectedCollection);
    const parentWithProduct = parentCollections.find((parent) =>
      (parent.productCategories || []).some((cat) => cat.slug === selectedCollection),
    );
    const parentWithBrand = parentCollections.find((parent) =>
      (parent.brandCategories || []).some((cat) => cat.slug === selectedCollection),
    );

    const targetParent = selectedParent || parentWithProduct || parentWithBrand;
    if (!targetParent) return;

    // Sync to route-selected category only when route/data changes.
    // Do not include expandedParentId in deps, otherwise manual collapse gets overridden.
    setExpandedParentId((current) => (current === targetParent.id ? current : targetParent.id));
  }, [selectedCollection, parentCollections]);

  const handleCollectionClick = (slug: string | null) => {
    onCollectionClick?.(slug);
  };

  return (
    <aside className="w-80 border-r border-gray-100 min-h-screen sticky top-[73px] hidden md:block overflow-y-auto scrollbar-hide bg-[#fafafa]">
      <div className="p-5 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid size={18} className="text-gray-900" />
          <h2 className="text-medium font-black uppercase tracking-[0.1em] text-gray-900 leading-none">CATEGORIES</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsMenuExpanded((prev) => !prev)}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          aria-label={isMenuExpanded ? "Collapse categories" : "Expand categories"}
          title={isMenuExpanded ? "Collapse categories" : "Expand categories"}
        >
          <ChevronDown size={18} className={`transition-transform duration-200 ${isMenuExpanded ? "rotate-0" : "-rotate-90"}`} />
        </button>
      </div>

      {isMenuExpanded && (
        <>
          <div className="border-b border-gray-100 bg-white">
            <button
              onClick={() => {
                handleCollectionClick(null);
                setExpandedParentId(null);
              }}
              className={`w-full text-left p-4 transition-all relative ${!selectedCollection ? "bg-gray-50/50" : "hover:bg-gray-50"}`}
            >
              {!selectedCollection && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8B2323] z-10" />}
              <span className={`text-[13px] font-black uppercase tracking-tight leading-tight ${!selectedCollection ? "text-[#8B2323]" : "text-gray-600"}`}>
                All Products
              </span>
            </button>
          </div>

          {collectionsLoading ? (
            <div className="p-4 text-center text-xs text-gray-400">Loading categories...</div>
          ) : (
            parentCollections.map((parent) => {
              const isExpanded = expandedParentId === parent.id;
              const isParentSelected = selectedCollection === parent.slug;
              const isProductSelected = (parent.productCategories || []).some((cat) => cat.slug === selectedCollection);
              const isBrandSelected = (parent.brandCategories || []).some((cat) => cat.slug === selectedCollection);
              const isParentActive = isParentSelected || isProductSelected || isBrandSelected;

              return (
                <div key={parent.id} className="border-b border-gray-100 bg-white">
                  <div
                    onClick={() => setExpandedParentId(isExpanded ? null : parent.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer relative transition-all ${isExpanded ? "bg-gray-50/50" : "hover:bg-gray-50"}`}
                  >
                    {(isExpanded || isParentActive) && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8B2323] z-10" />}
                    <span className={`text-[13px] font-black uppercase tracking-tight leading-tight pr-4 flex-1 ${isExpanded || isParentActive ? "text-[#8B2323]" : "text-gray-600"}`}>
                      {parent.name}
                    </span>
                    <ChevronDown size={18} className={`transition-transform duration-300 flex-shrink-0 ${isExpanded ? "rotate-180 text-[#8B2323]" : "text-gray-300"}`} />
                  </div>

                  {isExpanded && ((parent.productCategories && parent.productCategories.length > 0) || (parent.brandCategories && parent.brandCategories.length > 0)) && (
                    <div className="px-3 py-4 space-y-6 bg-white border-t border-gray-50">
                      {parent.productCategories && parent.productCategories.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-1">
                            <Package size={14} className="text-[#8B2323]" />
                            <span className="text-[12px] font-black uppercase tracking-widest text-gray-900">Products</span>
                          </div>
                          <div className="space-y-1">
                            {parent.productCategories.map((category) => {
                              const isActive = selectedCollection === category.slug;
                              return (
                                <button
                                  key={category.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCollectionClick(category.slug);
                                  }}
                                  className={`w-full text-left text-[13px] font-bold py-2 px-3 rounded-md transition-all ${
                                    isActive ? "text-[#8B2323] bg-red-50 border-l-2 border-[#8B2323]" : "text-gray-500 hover:text-[#8B2323] hover:bg-gray-50"
                                  }`}
                                >
                                  {category.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {parent.brandCategories && parent.brandCategories.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-1">
                            <ShieldCheck size={14} className="text-[#8B2323]" />
                            <span className="text-[12px] font-black uppercase tracking-widest text-gray-900">Featured Brands</span>
                          </div>
                          <div className="space-y-1">
                            {parent.brandCategories.map((brand) => {
                              const isActive = selectedCollection === brand.slug;
                              return (
                                <button
                                  key={brand.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCollectionClick(brand.slug);
                                  }}
                                  className={`w-full text-left text-[13px] font-bold py-2 px-3 rounded-md transition-all ${
                                    isActive ? "text-[#8B2323] bg-red-50 border-l-2 border-[#8B2323]" : "text-gray-500 hover:text-[#8B2323] hover:bg-gray-50"
                                  }`}
                                >
                                  {brand.name.replace("Brand-", "")}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </>
      )}
    </aside>
  );
}
