// utils/localStorage.ts

import { AuthorizationState } from "../redux/slices/authorization/authorizationSlice";
import { ProductState } from "../redux/slices/product/productSlice";

// Kiểm tra client-side
const isClient = typeof window !== 'undefined';

interface PersistedState {
    authorization: AuthorizationState;
    userProfile: UserProfile;
    product: ProductState;
  }
// Khôi phục state từ localStorage (chỉ thực thi khi ở client-side)
export const loadState = (): PersistedState | undefined => {
  try {
    if (!isClient) {
      // Không thể truy cập localStorage khi đang render phía server
      return undefined;
    }

    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as PersistedState;
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};

// Lưu state vào localStorage (chỉ thực thi khi ở client-side)
export const saveState = (state: PersistedState) => {
  try {
    if (!isClient) {
      // Không thể lưu vào localStorage khi đang render phía server
      return;
    }

    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};
