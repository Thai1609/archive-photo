import { combineReducers } from "./index";

import galleryReducer, {
  initialGalleryState,
  Gallery,
} from "../reducers/galleryReducer/galleryReducer";

export const initialState = {
  galleries: initialGalleryState,
};

export const rootReducer = combineReducers({
  galleries: galleryReducer,
});
