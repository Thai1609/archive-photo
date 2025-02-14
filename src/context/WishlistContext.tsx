"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { useAuth } from "./AuthProvider";

interface WishlistContextType {
  wishlist: { [key: string]: boolean };
  wishlistLength: number;
  toggleWishlist: (userId: string, itemId: string) => void;
}

// Create Context
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// Reducer function to manage wishlist state
const wishlistReducer = (
  state: { [key: string]: boolean },
  action: { type: "LOAD" | "ADD" | "REMOVE"; itemId?: string; payload?: any }
) => {
  switch (action.type) {
    case "LOAD":
      return action.payload || {};
    case "ADD":
      return { ...state, [action.itemId!]: true };
    case "REMOVE": {
      const { [action.itemId!]: _, ...newState } = state; // Remove item safely
      return newState;
    }
    default:
      return state;
  }
};

// Wishlist Provider Component
export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  console.log("🔄 WishlistProvider is loading..");

  const [wishlist, dispatch] = useReducer(wishlistReducer, {});
  const { data: session } = useSession();
  const token = session?.backendToken || getCookie("token") || "";

  const { userProfile } = useAuth();

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    console.log("🔄 WishlistProvider userPofile: ", userProfile);

    if (!userProfile?.id || !token) return;

    try {
      const response = await axios.get("http://localhost:8080/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: userProfile.id },
      });

      // Convert API response to { itemId: true } format
      const wishlistData = response.data.reduce(
        (acc: Record<string, boolean>, item: any) => {
          acc[item.galleryId] = true;
          return acc;
        },
        {}
      );

      dispatch({ type: "LOAD", payload: wishlistData });
      localStorage.setItem("wishlist", JSON.stringify(wishlistData));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [token, userProfile?.id]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Get wishlist length
  const wishlistLength = useMemo(
    () => Object.keys(wishlist).length,
    [wishlist]
  );

  // Toggle wishlist item
  const toggleWishlist = useCallback(
    async (userId: string, itemId: string) => {
      const isWishlisted = wishlist[itemId];
      const method = isWishlisted ? "delete" : "post";
      const url = "http://localhost:8080/api/wishlist";

      try {
        const response = await axios({
          method,
          url,
          headers: { Authorization: `Bearer ${token}` },
          params: { userId, galleryId: itemId },
        });

        if (response.data) {
          dispatch({ type: isWishlisted ? "REMOVE" : "ADD", itemId });

          // Save updated wishlist to localStorage
          const updatedWishlist = { ...wishlist, [itemId]: !isWishlisted };
          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        }
      } catch (error) {
        console.error(
          `Error ${isWishlisted ? "removing from" : "adding to"} wishlist:`,
          error
        );
      }
    },
    [wishlist, token]
  );

  // Memoize context value
  const wishlistContextValue = useMemo(
    () => ({
      wishlist,
      wishlistLength,
      toggleWishlist,
    }),
    [wishlist, wishlistLength, toggleWishlist]
  );

  return (
    <WishlistContext.Provider value={wishlistContextValue}>
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
