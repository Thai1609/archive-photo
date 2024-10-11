import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer, { AuthorizationState } from "./slices/authorization/authorizationSlice";
import userProfileReducer from "./slices/user/userProfileSlice";
import productReducer, { ProductState } from "./slices/product/productSlice";
import { loadState, saveState } from "../utils/localStorage";

// Định nghĩa kiểu dữ liệu của preloadedState để khớp với Redux store
interface PersistedState {
  authorization: AuthorizationState;
  userProfile: UserProfile;
  product: ProductState;
}

// Khôi phục state từ localStorage, với kiểu dữ liệu được định nghĩa
const persistedState: PersistedState | undefined = loadState();
export const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    userProfile: userProfileReducer,
    product: productReducer,
  },
  preloadedState: persistedState, // Khôi phục state
});

// Lưu state vào localStorage mỗi khi store thay đổi
store.subscribe(() => {
  saveState({
    authorization: store.getState().authorization,
    userProfile: store.getState().userProfile,
    product: store.getState().product,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
