"use client";
import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import galleryReducer, {
  GALLERY_ACTIONS,
  InitialGalleryState,
  initialGalleryState,
} from "@/app/reducers/galleryReducer/galleryReducer";

// ✅ Define Gallery Context Type
interface GalleryContextType {
  state: InitialGalleryState;
  fetchGalleries: (page: number) => Promise<void>;
  addGallery: (gallery: Image) => void;
  removeGallery: (id: number) => void;
  setPage: (page: number) => void;
}

// ✅ Create Context
const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

// ✅ Provider Component
export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(galleryReducer, initialGalleryState);

  // ✅ Fetch Galleries from API
  const fetchGalleries = useCallback(async (page: number) => {
    dispatch({ type: GALLERY_ACTIONS.FETCH_INIT });
    try {
      const response = await axios.get(
        `http://localhost:8080/api/galleries?page=${page}`
      );
      dispatch({
        type: GALLERY_ACTIONS.FETCH_SUCCESS,
        payload: {
          galleries: response.data.galleries,
          totalPages: response.data.totalPages,
        },
      });
    } catch (error) {
      dispatch({ type: GALLERY_ACTIONS.FETCH_ERROR });
    }
  }, []);

  // ✅ Add Gallery
  const addGallery = useCallback((gallery: Image) => {
    dispatch({ type: GALLERY_ACTIONS.ADD_GALLERY_SUCCESS, payload: gallery });
  }, []);

  // ✅ Remove Gallery
  const removeGallery = useCallback((id: number) => {
    dispatch({ type: GALLERY_ACTIONS.REMOVE_GALLERY_SUCCESS, payload: { id } });
  }, []);

  // ✅ Set Page
  const setPage = useCallback((page: number) => {
    dispatch({ type: GALLERY_ACTIONS.SET_PAGE, payload: page });
  }, []);

  return (
    <GalleryContext.Provider
      value={{ state, fetchGalleries, addGallery, removeGallery, setPage }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

// ✅ Custom Hook to Use Gallery
export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
};
