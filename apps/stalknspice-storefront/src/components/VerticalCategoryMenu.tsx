"use client";
import React, { useState } from "react";
import { ChevronRight, Grid } from "lucide-react";
import Link from "next/link";


const CATEGORIES = [
  { name: "Bakery, Biscuits & Confectionery", slug: "bakery", sub: ["Biscuits, Cookies & Cakes", "Cherries", "Cocoa Powder", "Bean to Bar Chocolate", "Jams"] },
  { name: "Beverages and Tea", slug: "beverages", sub: ["Coffee", "Tea Bags", "Green Tea", "Fruit Juices", "Syrups"] },
  { name: "Cereals, Grains & Pasta", slug: "cereals", sub: ["Pasta Penne", "Arborio Rice", "Quinoa", "Oats", "Muesli"] },
  { name: "Dried Fruits & Nuts", slug: "dried-fruits", sub: ["Almonds", "Walnuts", "Cashews", "Pistachios"] },
  { name: "Herbs, Spices and Condiments", slug: "herbs", sub: ["Saffron", "Vanilla Beans", "Truffle Oil", "Sea Salt"] },
  { name: "Mushrooms and Canned Food", slug: "canned", sub: ["Olives", "Jalapenos", "Mushrooms", "Gherkins"] },
  { name: "Fish & Dairy", slug: "dairy", sub: ["Cheese", "Butter", "Frozen Fish", "Cooking Cream"] },
  { name: "Noodles and Rice Paper Sheet", slug: "noodles", sub: ["Soba", "Udon", "Rice Paper", "Glass Noodles"] },
  { name: "Oils & Vinegars", slug: "oils", sub: ["Olive Oil", "Balsamic Vinegar", "Apple Cider"] },
  { name: "Sauces and Pastes", slug: "sauces", sub: ["Pesto", "Pasta Sauce", "Curry Paste", "Mayo"] },
];

export default function VerticalCategoryMenu() {
  const [activeTab, setActiveTab] = useState<string | null>(CATEGORIES[0].name);

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
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                onMouseEnter={() => setActiveTab(cat.name)}
                className={`flex items-center justify-between px-5 py-4 cursor-pointer border-b border-gray-100 transition-colors ${
                  activeTab === cat.name ? "bg-gray-50 text-[#00A86B] font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-[15px]">{cat.name}</span>
                <ChevronRight size={16} className={activeTab === cat.name ? "opacity-100" : "opacity-30"} />
              </div>
            ))}
          </nav>
        </div>

        {/* RIGHT SUB-MENU (Dynamic based on Hover) */}
        <div className="flex-1 p-10 bg-white">
          {activeTab && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-200">
              <ul className="space-y-6">
                {CATEGORIES.find(c => c.name === activeTab)?.sub.map((item) => (
                  <li key={item}>
                    <Link 
                      href="#" 
                      className="text-lg text-gray-800 hover:text-[#00A86B] transition-colors block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}