import { createSlice } from "@reduxjs/toolkit";

export interface AuthorizationState {
  token: string;
  isAuthenticated: boolean;
}

const initialState: AuthorizationState = {
  token: "",
  isAuthenticated: false,
};

const authorizationSlice = createSlice({
  name: "Authorization",
  initialState,
  reducers: {
    setLogin(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setLogout(state, action) {
      state.token = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setLogin } = authorizationSlice.actions;
export default authorizationSlice.reducer;
