"use client";

import React from "react";
import ComingSoon from "../components/ComingSoon";

export default function WishlistPage() {
  return (
    <main className="min-h-[70vh]">
      <ComingSoon 
        title="Wishlist" 
        subtitle="Your personalized collection of health and beauty essentials is almost here. Soon you'll be able to save items and track price drops with one click."
        accentColor="text-rose-500"
      />
    </main>
  );
}