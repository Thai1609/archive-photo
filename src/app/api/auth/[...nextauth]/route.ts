import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { setCookie } from "cookies-next";

const backendLoginUrl = "http://localhost:8080/api/auth/login"; // ? API login email/password
const backendGoogleUrl = "http://localhost:8080/api/auth/google"; // ? API login Google OAuth

export const authOptions = {
  providers: [
    // ? Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // ? Email/Password Login
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("?? Sending Login Request:", credentials?.email);

          const response = await axios.post(backendLoginUrl, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const dataBackend = response.data.result; // ? Ki?m tra d? li?u t? backend

          if (!dataBackend) {
            console.error("❌ No token returned from backend!");
            return null;
          }
          return {
            email: credentials?.email,
            backendToken: response.data.result.token,
          };
        } catch (error) {
          console.error("? L?i ??ng nh?p:", error);
          throw new Error("Email ho?c m?t kh?u kh?ng ?úng!");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          console.log("?? ??ng nh?p Google:", user.email);

          const response = await axios.post(backendGoogleUrl, {
            email: user.email,
            provider: "GOOGLE",
            providerId: user.id,
          });

          user.backendToken = response.data.result.token; // ? L?u token t? backend
        }

        return true;
      } catch (error) {
        console.error("? L?i l?u th?ng tin ??ng nh?p:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.backendToken) {
        token.backendToken = user.backendToken;
      }
      if (user?.email) {
        token.email = user.email; // ✅ Store email in JWT token
      }
      if (user?.provider === "google") {
        token.sub = user.sub; // Add `sub` from Google profile
      }

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.user.email = token.email; // ✅ Attach email to session
      session.user.sub = token.sub;
      setCookie("token", session.backendToken, { maxAge: 60 * 60 * 24 });
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
