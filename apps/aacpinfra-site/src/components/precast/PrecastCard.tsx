import Image from "next/image";
import { PrecastProduct } from "@/types/precast";

export default function PrecastCard({ product }: { product: PrecastProduct }) {
  return (
    <div className="group relative rounded-2xl bg-white border shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* CONTENT */}
      <div className="p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {product.shortDescription}
        </p>

        {/* CATEGORY */}
        <div className="mt-6 inline-block text-xs tracking-wide uppercase text-red-700 font-medium">
          {product.category}
        </div>
      </div>
    </div>
  );
}
