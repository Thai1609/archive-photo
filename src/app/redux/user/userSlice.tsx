import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  id: 0,
  email: "",
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUserRedux(state, action: PayloadAction<User>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.id = 0;
      state.email = "";
    },
  },
});

export const { setUserRedux, clearUser } = UserSlice.actions;
export default UserSlice.reducer;
