import axios from "axios";
import { setCookie } from "cookies-next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const url = "http://localhost:8080/api/auth/login";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.SECRET,

  session: {
    strategy: "jwt", // Use JWT sessions
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("user", user);
      try {
        // Send user data to the backend API to save it to MySQL
        const response = await axios.post(
          url,
          { email: user.email, googleID: user.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
            maxRedirects: 0,
          }
        );
        // If user data is successfully saved, proceed with login
        if (response.data.result.authenticated) {
          setCookie("token", response.data.result.token, {
            maxAge: 60 * 10,
            path: "/", // Cookie is valid for the whole site
          });
          return true;
        }
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      // Persist the Google access token to the token right after signIn
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
