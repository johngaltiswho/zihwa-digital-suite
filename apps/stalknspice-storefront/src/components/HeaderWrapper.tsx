"use client";

import { useState } from "react";
import { StalksHeader } from "@repo/ui";
import { useAuth } from "@/lib/vendure/auth-context";
import { useRouter } from "next/navigation";
import CartIcon from "./CartIcon";
import type { Collection } from "@/lib/vendure/types";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderWrapperProps {
  navItems: NavItem[];
  logoSrc: string;
  isEcommerce?: boolean;
  collections?: Collection[];
}

export default function HeaderWrapper({ navItems, logoSrc, isEcommerce, collections }: HeaderWrapperProps) {
  const { customer, logout } = useAuth();
  const router = useRouter();

const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <StalksHeader
        navItems={navItems}
        logoSrc={logoSrc}
        isEcommerce={isEcommerce}
        customer={customer}
        onLogout={handleLogout}
        collections={collections}
        onUserMenuToggle={setIsMenuOpen}
      />
      {/* 4. Only show this div if isMenuOpen is FALSE */}
      {!isMenuOpen && (
        <div className="hidden lg:block fixed top-[52px] right-4 z-[100]">
          <CartIcon />
        </div>
      )}
    </>
  );
}
