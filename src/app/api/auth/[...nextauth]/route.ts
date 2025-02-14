import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const backendLoginUrl = "http://localhost:8080/api/auth/login";
const backendGoogleUrl = "http://localhost:8080/api/auth/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/auth",
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        url: "https://www.facebook.com/v18.0/dialog/oauth",
        params: {
          scope: "email public_profile",
          auth_type: "rerequest",
          display: "popup",
        },
      },
    }),

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
          const response = await axios.post(backendLoginUrl, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const dataBackend = response.data.result;
          if (dataBackend) {
            return {
              email: credentials?.email,
              backendToken: dataBackend.token,
            };
          }
          return null;
        } catch (error) {
          throw new Error("Email not found or Password is invalid!");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!profile) {
          console.error("❌ No profile returned from Google!");
          return false;
        }
        try {
          console.log("🔍 Google Profile Data:", profile);

          const response = await axios.post(backendGoogleUrl, {
            email: user.email,
            provider: "GOOGLE",
            providerId: user.id,
            name: user.name || profile.name,
            imageUrl: profile.picture || user.image, // ✅ Ensure profile picture is used
          });

          const backendData = response.data.result;

          user.backendToken = backendData.token; // ✅ Store backend token from Spring Boot
        } catch (error) {
          console.error("❌ Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.email = user.email;

        if (account?.provider === "google" && profile) {
          token.name = profile.name;
          token.image = profile.picture;
          token.sub = profile.sub;
        }

        if (!token.exp) {
          token.exp = Math.floor(Date.now() / 1000) + 5 * 60; // ✅ Token expires in 5 minutes
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.sub = token.sub;
      session.exp = token.exp ? new Date(token.exp * 1000).toISOString() : null;

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 5 * 60, // ✅ Session expires in 1 minutes
  },
  httpOptions: {
    timeout: 10000,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
