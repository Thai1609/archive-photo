import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const backendLoginUrl = "http://localhost:8080/api/auth/login";

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
          //Login with api
          const response = await axios.post(backendLoginUrl, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const dataBackend = response.data.result;
          if (dataBackend) {
            return {
              //Login with firebase
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
      if (account?.provider === "credentials") {
        return true;
      }

      const backendProviderUrl =
        "http://localhost:8080/api/auth/login-with-provider";
      let newUser: LoginWithProvider;

      if (account?.provider === "google") {
        newUser = {
          email: user.email,
          provider: "GOOGLE",
          providerId: user.id,
          name: user.name || profile.name,
          imageUrl: profile.picture || user.image,
        };
      } else if (account?.provider === "facebook") {
        newUser = {
          email: user.email,
          provider: "FACEBOOK",
          providerId: user.id,
          name: user.name || profile.name,
          imageUrl: profile.picture?.data?.url || user.image,
        };
      } else {
        return false;
      }

      try {
        console.log("Show Profile Data:", profile);

        const response = await axios.post(backendProviderUrl, newUser);

        const backendData = response.data.result;

        user.backendToken = backendData.token; // ✅ Store backend token from Spring Boot
      } catch (error) {
        console.error("❌Sign-in error:", error);
        return false;
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.email = user.email;
        token.sub = user.id;
        if (user.id) {
          token.provider = account?.provider;
          token.name = profile.name;
          token.image = profile.picture;
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
      session.user.provider = token.provider;

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
