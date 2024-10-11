import { createSlice } from "@reduxjs/toolkit";

export interface AuthorizationState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthorizationState = {
  token: null,
  isAuthenticated: false,
};

const authorizationSlice = createSlice({
  name: "authorization",
  initialState,
  reducers: {
    
    setLogin(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    setLogout(state) {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setLogin, setLogout } = authorizationSlice.actions;
export default authorizationSlice.reducer;
