"use client";

import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthProvider";
import { GalleryProvider } from "@/context/GalleryContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <WishlistProvider>
          <GalleryProvider>{children}</GalleryProvider>
        </WishlistProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
