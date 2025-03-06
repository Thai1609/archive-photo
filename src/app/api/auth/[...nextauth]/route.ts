import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const BACKEND_LOGIN_URL = "http://localhost:8080/api/auth/login";
const BACKEND_PROVIDER_URL =
  "http://localhost:8080/api/auth/login-with-provider";

export const authOptions = {
  providers: [
    // Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // Facebook Login
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),

    // Email & Password (Credentials)
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
          const response = await axios.post(BACKEND_LOGIN_URL, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const { result } = response.data;

          if (!result) throw new Error("Invalid email or password.");

          return { email: credentials?.email, backendToken: result.token };
        } catch (error) {
          throw new Error("Email not found or Password is invalid!");
        }
      },
    }),
  ],

  callbacks: {
    // Xử lý đăng nhập bằng Google hoặc Facebook
    async signIn({ user, account, profile }) {
      if (account.provider === "credentials") return true; // Bỏ qua nếu dùng email/password

      try {
        const newUser = {
          email: user.email,
          provider: account.provider.toUpperCase(),
          providerId: user.id,
          name: user.name || profile.name,
          imageUrl: profile.picture?.data?.url || user.image,
        };

        const response = await axios.post(BACKEND_PROVIDER_URL, newUser);
        const backendData = response.data.result;

        if (!backendData) throw new Error("Backend authentication failed.");

        user.backendToken = backendData.token; // Lưu token backend vào user
        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },

    //  Tạo JWT chứa thông tin user & token
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.backendToken = user.backendToken || token.backendToken;
        token.email = user.email || token.email;
        token.sub = user.id || token.sub;
        token.provider = account?.provider || token.provider;
        token.name = profile?.name || user.name || token.name;
        token.image = profile?.picture || user.image || token.image;

        token.exp = Math.floor(Date.now() / 1000) + 5 * 60;
      }
      return token;
    },

    // Xử lý session từ JWT token
    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.user = {
        email: token.email,
        name: token.name,
        image: token.image,
        sub: token.sub,
        provider: token.provider,
      };

      session.exp = token.exp ? new Date(token.exp * 1000).toISOString() : null;

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 5 * 60, // 5 phút
  },

  secret: process.env.NEXTAUTH_SECRET,

  httpOptions: {
    timeout: 10000,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
