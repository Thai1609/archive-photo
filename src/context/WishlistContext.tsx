"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";

// Define Wishlist Context Type
interface WishlistContextType {
  wishlist: { [key: string]: boolean };
  wishlistLength: number;
  toggleWishlist: (userId: string, itemId: string) => void;
}

// Create Context
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// Define Reducer Function
const wishlistReducer = (
  state: { [key: string]: boolean },
  action: { type: string; itemId?: string; payload?: any }
) => {
  switch (action.type) {
    case "LOAD": // ✅ Load wishlist from API
      return action.payload || {};
    case "ADD":
      return { ...state, [action.itemId!]: true };
    case "REMOVE":
      const newState = { ...state };
      delete newState[action.itemId!];
      return newState;
    default:
      return state;
  }
};

// Wishlist Provider
export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  console.log("🔄 WishlistProvider is loading..");

  const [wishlist, dispatch] = useReducer(wishlistReducer, {});
  const [token, setToken] = useState("");
  const { data: session } = useSession();
  const cookieToken = getCookie("token");

  // ✅ Update token state after session or cookies change
  useEffect(() => {
    if (session?.backendToken) {
      setToken(session.backendToken);
    } else if (cookieToken) {
      setToken(cookieToken);
    }
  }, [session, cookieToken]);

  const [user, setUser] = useState<{ id?: string }>({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.id) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("❌ Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  // ✅ Fetch wishlist from API on mount
  useEffect(() => {
    if (user.id) {
      const fetchWishlist = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/wishlist",
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { userId: user.id },
            }
          );

          // ✅ Convert API response to { itemId: true } format
          const wishlistData = response.data.reduce((acc: any, item: any) => {
            acc[item.galleryId] = true;
            return acc;
          }, {});

          dispatch({ type: "LOAD", payload: wishlistData }); // ✅ Dispatch loaded wishlist
          localStorage.setItem("wishlist", JSON.stringify(wishlistData)); // ✅ Sync with localStorage
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };
      fetchWishlist();
    }
  }, [token, user.id]);

  // Get wishlist length
  const wishlistLength = Object.keys(wishlist).length;

  // Function to toggle wishlist
  const toggleWishlist = async (userId: string, itemId: string) => {
    const isWishlisted = wishlist[itemId];
    const method = isWishlisted ? "delete" : "post";
    const params = { userId, galleryId: itemId };
    const url = "http://localhost:8080/api/wishlist"; // Backend API

    try {
      const response = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${cookieToken}` },
        params,
      });

      if (response.data) {
        dispatch({ type: isWishlisted ? "REMOVE" : "ADD", itemId });

        // ✅ Save to localStorage after update
        const updatedWishlist = { ...wishlist, [itemId]: !isWishlisted };
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      }
    } catch (error) {
      console.error(
        `Error ${isWishlisted ? "removing from" : "adding to"} wishlist:`,
        error
      );
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, wishlistLength, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom Hook to Use Wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
