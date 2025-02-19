"use client";

import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthProvider";
import { ProductProvider } from "@/context/ProductContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {/* <WishlistProvider>
          <ProductProvider> */}
            {children}
            {/* </ProductProvider>
        </WishlistProvider> */}
      </AuthProvider>
    </SessionProvider>
  );
}
