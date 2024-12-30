// galleryReducer.ts
export const GALLERY_ACTIONS = {
  FETCH_INIT: "FETCH_INIT",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  ADD_GALLERY_SUCCESS: "ADD_GALLERY_SUCCESS",
  REMOVE_GALLERY_SUCCESS: "REMOVE_GALLERY_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR", // Add this action if not present
  SET_PAGE: "SET_PAGE", // If pagination is needed
} as const;

export type Gallery = {
  id: number;
  nameImage: string;
  urlImage: string;
  status: number;
};

export interface InitialGalleryState {
  galleries: Gallery[];
  isLoading: boolean;
  isError: boolean;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
// Initial state
export const initialGalleryState: InitialGalleryState = {
  galleries: [],
  isLoading: false,
  isError: false,
  totalPages: 1,
  currentPage: 1,
  pageSize: 100,
};

type GalleryAction =
  | { type: typeof GALLERY_ACTIONS.FETCH_INIT }
  | {
      type: typeof GALLERY_ACTIONS.FETCH_SUCCESS;
      payload: { galleries: Gallery[]; totalPages: number };
    }
  | { type: typeof GALLERY_ACTIONS.ADD_GALLERY_SUCCESS; payload: Gallery }
  | {
      type: typeof GALLERY_ACTIONS.REMOVE_GALLERY_SUCCESS;
      payload: { id: number };
    }
  | { type: typeof GALLERY_ACTIONS.FETCH_ERROR }
  | { type: typeof GALLERY_ACTIONS.SET_PAGE; payload: number };

const galleryReducer = (
  state: InitialGalleryState,
  action: GalleryAction
): InitialGalleryState => {
  switch (action.type) {
    case GALLERY_ACTIONS.FETCH_INIT:
      return { ...state, isLoading: true, isError: false };

    case GALLERY_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        galleries: action.payload.galleries,
        totalPages: action.payload.totalPages,
        isLoading: false,
      };

    case GALLERY_ACTIONS.ADD_GALLERY_SUCCESS:
      return { ...state, galleries: [...state.galleries, action.payload] };

    case GALLERY_ACTIONS.REMOVE_GALLERY_SUCCESS:
      return {
        ...state,
        galleries: state.galleries.filter(
          (gallery) => gallery.id !== action.payload.id
        ),
      };

    case GALLERY_ACTIONS.FETCH_ERROR:
      return { ...state, isLoading: false, isError: true };

    case GALLERY_ACTIONS.SET_PAGE:
      return { ...state, currentPage: action.payload };

    default:
      throw new Error("Unhandled action type");
  }
};

export default galleryReducer;
