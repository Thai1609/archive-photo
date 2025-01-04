import axios from "axios";
import { setCookie } from "cookies-next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const url = "http://localhost:8080/api/auth/google";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const response = await axios.post(
          url,
          { email: user.email, provider: "GOOGLE", providerId: user.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        user.backendToken = response.data.result.token;

        return true;
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // Attach backendToken to the JWT token during initial login
      if (user?.backendToken) {
        token.backendToken = user.backendToken;
      }
      if (user?.provider === "google") {
        token.sub = user.sub; // Add `sub` from Google profile
      }
      return token;
    },

    async session({ session, token }) {
      // Attach backendToken to the session object
      session.backendToken = token.backendToken;
      session.user.sub = token.sub;

      setCookie("token", session.backendToken, {
        maxAge: 60 * 10,
      });
      return session;
    },
  },
  secret: process.env.SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
