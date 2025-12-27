import { precastProducts } from "@/data/precast";
import PrecastCard from "./PrecastCard";

export default function PrecastGrid() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {precastProducts.map((product) => (
          <PrecastCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
