"use client";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { signOut, useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const userProfileUrl = "http://localhost:8080/api/user/my-info";

interface AuthContextType {
  userProfile: UserProfile | null;
  fetchUserProfile: () => Promise<void>;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("🔄 AuthProvider is loading..");

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [providerId, setProviderId] = useState("");

  const { data: session } = useSession();
  const cookieToken = getCookie("token");

  // ✅ Update token state after session or cookies change
  useEffect(() => {
   

    if (session?.backendToken) {
      setToken(session.backendToken);
      setProviderId(session.user?.sub);
    } else if (cookieToken) {
      setToken(cookieToken);
    }
    // ✅ Load email from session
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session, cookieToken]);

  // ✅ Ensure token is available before calling API
  const fetchUserProfile = useCallback(async () => {
    if (!token || userProfile) return;

    try {
      const formDataInfo = {
        email,
        provider: providerId ? "GOOGLE" : null,
        providerId: providerId,
      };

      const response = await axios.post(userProfileUrl, formDataInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🔍 API Response:", response.data); // ✅ Debug response

      if (response.data?.result?.userProfile) {
        const userData = response.data.result.userProfile;
        localStorage.setItem("user", JSON.stringify(userData));
        setUserProfile(userData);
        console.log("User info fetched:", userData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [token, email, providerId]);

  // ✅ Fetch user profile only when token is available
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token, fetchUserProfile]);

  // ✅ Logout function
  const logout = useCallback(() => {
    setUserProfile(null);
    setToken(null);
    setEmail("");
    deleteCookie("token"); // ✅ Remove token
    localStorage.removeItem("user"); // ✅ Clear user info from localStorage
    signOut({ callbackUrl: "/auth/login" });
  }, []);

  return (
    <AuthContext.Provider
      value={{ userProfile, fetchUserProfile, login: setCookie, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
