import { combineReducers } from "./index";

import { tagReducer, initialTagState } from "./tagReducer/tagReducer";
import galleryReducer, { initialGalleryState, Gallery } from '../reducers/galleryReducer/galleryReducer';



export const initialState = {
  tags: initialTagState,
  galleries: initialGalleryState,
};

export const rootReducer = combineReducers({
  tags: tagReducer,
  galleries: galleryReducer,
});
