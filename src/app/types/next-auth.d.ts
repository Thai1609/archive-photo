// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string; // ✅ Add `backendToken`
    user?: {
      sub?: string;
      email?: string;
      name?: string;
      image?: string;
    };
  }
}
