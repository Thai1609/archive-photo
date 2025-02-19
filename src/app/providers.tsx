"use client";

import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthProvider";
import { ProductProvider } from "@/context/ProductContext";
import { CategoryProvider } from "@/context/CategoryContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {/* <WishlistProvider>
          <ProductProvider> */}
        <CategoryProvider>{children}</CategoryProvider>
        {/* </ProductProvider>
        </WishlistProvider> */}
      </AuthProvider>
    </SessionProvider>
  );
}
