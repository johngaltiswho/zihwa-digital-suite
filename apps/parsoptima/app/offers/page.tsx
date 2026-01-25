"use client";

import React from "react";
import ComingSoon from "../components/ComingSoon";

export default function OffersPage() {
  return (
    <main className="min-h-[70vh]">
      <ComingSoon 
        title="Mega Deals" 
        subtitle="We are preparing the most exciting discounts and bundled offers for your healthcare journey. Stay tuned for exclusive seasonal savings!"
        accentColor="text-red-600"
      />
    </main>
  );
}