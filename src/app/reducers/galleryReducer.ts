// galleryReducer.ts

export const ACTIONS = {
  FETCH_INIT: 'FETCH_INIT',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  ADD_GALLERY_SUCCESS: 'ADD_GALLERY_SUCCESS',
  REMOVE_GALLERY_SUCCESS: 'REMOVE_GALLERY_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR', // Add this action if not present
  SET_PAGE: 'SET_PAGE',       // If pagination is needed
} as const;

type Gallery = {
  id: number;
  nameImage: string;
  urlImage: string;
  status: number;
};

interface GalleryState {
  galleries: Gallery[];
  isLoading: boolean;
  isError: boolean;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

type GalleryAction =
  | { type: typeof ACTIONS.FETCH_INIT }
  | { type: typeof ACTIONS.FETCH_SUCCESS; payload: { galleries: Gallery[]; totalPages: number } }
  | { type: typeof ACTIONS.ADD_GALLERY_SUCCESS; payload: Gallery }
  | { type: typeof ACTIONS.REMOVE_GALLERY_SUCCESS; payload: { id: number } }
  | { type: typeof ACTIONS.FETCH_ERROR }
  | { type: typeof ACTIONS.SET_PAGE; payload: number };

// Initial state
const initialState: GalleryState = {
  galleries: [],
  isLoading: false,
  isError: false,
  totalPages: 1,
  currentPage: 1,
  pageSize: 4,
};

const galleryReducer = (state: GalleryState = initialState, action: GalleryAction): GalleryState => {
  switch (action.type) {
    case ACTIONS.FETCH_INIT:
      return { ...state, isLoading: true, isError: false };

    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        galleries: action.payload.galleries,
        totalPages: action.payload.totalPages,
        isLoading: false,
      };

    case ACTIONS.ADD_GALLERY_SUCCESS:
      return { ...state, galleries: [...state.galleries, action.payload] };

    case ACTIONS.REMOVE_GALLERY_SUCCESS:
      return {
        ...state,
        galleries: state.galleries.filter((gallery) => gallery.id !== action.payload.id),
      };

    case ACTIONS.FETCH_ERROR:
      return { ...state, isLoading: false, isError: true };

    case ACTIONS.SET_PAGE:
      return { ...state, currentPage: action.payload };

    default:
      throw new Error('Unhandled action type');
  }
};

export default galleryReducer;
