"use client";


import { SharedHeader, AACP_NAV_ITEMS } from "@repo/ui"; 

import "@repo/ui/styles/header.css"; 

export default function Header() {
  return (
    <SharedHeader 
      navItems={AACP_NAV_ITEMS} 
      logoSrc="/aacp-logo.jpg" 
    />
  );
}