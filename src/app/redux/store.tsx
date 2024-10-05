"use client";

import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from "./authorization/authorizationSlice";
import userProfileReducer from "./user/userProfileSlice";
import userReducer from "./user/userSlice";
import productReducer from "./product/productSlice";


export const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    userProfile: userProfileReducer,
    user: userReducer,
    product:productReducer,
  },
});

// Infer the type of makeStore
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
