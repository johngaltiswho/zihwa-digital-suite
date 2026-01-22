"use client";
import React, { useState } from "react";
import { ChevronRight, Grid } from "lucide-react";
import Link from "next/link";
import { useCollections } from "@/lib/vendure/collections-context";

export default function VerticalCategoryMenu() {
  const { topLevelCollections, isLoading } = useCollections();

  // Filter collections with valid slugs
  const validCollections = topLevelCollections.filter(
    c => c.slug && c.slug.trim() !== ''
  );

  const [activeTab, setActiveTab] = useState<string | null>(
    validCollections[0]?.id || null
  );

  // If loading, show a skeleton or loading state
  if (isLoading) {
    return (
      <section className="max-w-[1250px] mx-auto px-5 py-10">
        <div className="flex relative bg-white border border-gray-200 shadow-sm min-h-[500px] items-center justify-center">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  // If no collections, show empty state
  if (validCollections.length === 0) {
    return (
      <section className="max-w-[1250px] mx-auto px-5 py-10">
        <div className="flex relative bg-white border border-gray-200 shadow-sm min-h-[500px] items-center justify-center">
          <p className="text-gray-500">No categories available</p>
        </div>
      </section>
    );
  }

  // Set initial active tab if not set
  if (!activeTab && validCollections.length > 0) {
    setActiveTab(validCollections[0].id);
  }

  return (
    <section className="max-w-[1250px] mx-auto px-5 py-10">
      <div className="flex relative bg-white border border-gray-200 shadow-sm min-h-[500px]">
        
        {/* LEFT SIDEBAR */}
        <div className="w-[350px] border-r border-gray-200 flex-shrink-0">
          {/* Header */}
          <div className="bg-[#00A86B] text-white p-4 flex items-center gap-3 font-bold text-lg">
            <Grid size={20} />
            <span>Gourmet Food</span>
          </div>

          {/* List Items */}
          <nav className="flex flex-col">
            {validCollections.map((collection) => (
              <div
                key={collection.id}
                onMouseEnter={() => setActiveTab(collection.id)}
                className={`flex items-center justify-between px-5 py-4 cursor-pointer border-b border-gray-100 transition-colors ${
                  activeTab === collection.id ? "bg-gray-50 text-[#00A86B] font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-[15px]">{collection.name}</span>
                <ChevronRight size={16} className={activeTab === collection.id ? "opacity-100" : "opacity-30"} />
              </div>
            ))}
          </nav>
        </div>

        {/* RIGHT SUB-MENU (Dynamic based on Hover) */}
        <div className="flex-1 p-10 bg-white">
          {activeTab && (() => {
            const activeCollection = validCollections.find(c => c.id === activeTab);
            const children = activeCollection?.children || [];

            if (children.length === 0) {
              return (
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-4">Explore all products in</p>
                  <Link
                    href={`/collection/${activeCollection?.slug}`}
                    className="inline-block bg-[#00A86B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#008F5B] transition-colors"
                  >
                    View {activeCollection?.name}
                  </Link>
                </div>
              );
            }

            return (
              <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                <ul className="space-y-6">
                  {children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/collection/${child.slug}`}
                        className="text-lg text-gray-800 hover:text-[#00A86B] transition-colors block"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>

      </div>
    </section>
  );
}