import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartsReducer from "../features/cart/cartSlice";
import filterReducer from "../features/filter/filterSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  carts: cartsReducer,
  filter: filterReducer
});

export default rootReducer;
export type RootStates = ReturnType<typeof rootReducer>;
