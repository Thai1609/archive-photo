"use client";

import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider, useAuth } from "../context/AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
