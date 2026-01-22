"use client";

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
      />
      {/* Floating Cart Icon - Positioned absolutely */}
      <div className="fixed top-4 right-4 z-[200] lg:top-[72px] lg:right-8">
        <CartIcon />
      </div>
    </>
  );
}
