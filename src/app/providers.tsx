"use client";

import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthProvider";
import { ProductProvider } from "@/context/ProductContext";
import { ProductFilterProvider } from "@/context/ProductFilterProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {/* <WishlistProvider>
          <ProductProvider> */}
        <ProductFilterProvider>{children}</ProductFilterProvider>
        {/* </ProductProvider>
        </WishlistProvider> */}
      </AuthProvider>
    </SessionProvider>
  );
}
