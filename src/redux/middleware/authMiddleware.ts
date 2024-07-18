import { Middleware } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { logout } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const authMiddleware: Middleware<{}, RootState> = () => (next) => (action) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);  
  
  if (!token) {
    alert("Su sesión ha expirado");
    dispatch(logout());
    navigate("/login");
  } else {
    next(action);
  }
};

export default authMiddleware;
