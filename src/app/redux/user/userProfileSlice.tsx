import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: UserProfile = {
  firstName: "",
  lastName: "",
  address: "",
  gender: "",
  phone: "",
  image: [],
  dob: "", 
};

const UserProfileSlice = createSlice({
  name: "UserDetail",
  initialState,
  reducers: {
    setUserProfileRedux(state, action: PayloadAction<UserProfile>) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.address = action.payload.address;
      state.gender = action.payload.gender;
      state.phone = action.payload.phone;
      state.image = action.payload.image;
      state.dob = action.payload.dob;
    },

    clearUserProfile(state) {
      state.firstName = "";
      state.lastName = "";
      state.address = "";
      state.gender = "";
      state.phone = "";
      state.image = [];
      state.dob = "";
    },
  },
});

export const { setUserProfileRedux, clearUserProfile } =
  UserProfileSlice.actions;
export default UserProfileSlice.reducer;
