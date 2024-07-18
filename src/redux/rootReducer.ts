import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartsReducer from "../features/cart/cartSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  carts: cartsReducer,
});

export default rootReducer;
export type RootStates = ReturnType<typeof rootReducer>;
