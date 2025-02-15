"use client";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { signOut, useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  // ✅ Update token state after session or cookies change
  useEffect(() => {
    console.log("✅ session:", session);

    if (session?.backendToken) {
      setToken(session.backendToken);
      setProviderId(session.user?.sub);
    }
    // ✅ Load email from session
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  // ✅ Fetch user profile only when needed
  const fetchUserProfile = useCallback(async () => {
    if (!token || userProfile) return; // Prevent redundant calls

    try {
      const formInforUser = {
        email,
        provider: providerId ? "GOOGLE" : null,
        providerId: providerId,
      };

      const response = await axios.post(userProfileUrl, formInforUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.result?.userProfile) {
        const userData = response.data.result.userProfile;
        localStorage.setItem("user", JSON.stringify(userData));
        setUserProfile(userData);
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  }, [token, email, providerId, userProfile]);

  // ✅ Fetch user profile when token changes
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // ✅ Logout function
  const logout = useCallback(() => {
    setUserProfile(null);
    deleteCookie("token");
    localStorage.setItem("user", "null");
    localStorage.removeItem("user");
    signOut({ callbackUrl: "/auth/account/login" });
  }, []);

  // ✅ Memoize context value to avoid unnecessary re-renders
  const authContextValue = useMemo(
    () => ({
      userProfile,
      fetchUserProfile,
      login: setCookie,
      logout,
    }),
    [userProfile, fetchUserProfile, logout]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
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
