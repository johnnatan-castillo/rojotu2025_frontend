import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState: AuthState = {
  user: "",
  nombre: "",
  token: "",
  rol: "",
  gender: "",
  climate: "",
  grupo: "",
  cargo: "",
  pais: "",
  identidad: "",
  prendas_superiores: "",
  prendas_inferiores: "",
  prendas_otros: "",
  limits: {
    prendas_superiores: 0,
    prendas_inferiores: 0,
    prendas_otros: 0,
  },
  total: "",
  correo: "",
  url_3d: "",
  primer_ingreso: "",
  administrador: "",
  dashboard: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.nombre = action.payload.nombre;
      state.token = action.payload.token;
      state.rol = action.payload.rol;
      state.gender = action.payload.gender;
      state.climate = action.payload.climate;
      state.grupo = action.payload.grupo;
      state.cargo = action.payload.cargo;
      state.pais = action.payload.pais;
      state.identidad = action.payload.identidad;
      state.prendas_superiores = action.payload.prendas_superiores;
      state.prendas_inferiores = action.payload.prendas_inferiores;
      state.prendas_otros = action.payload.prendas_otros;
      state.limits = {
        prendas_superiores: parseInt(action.payload.prendas_superiores),
        prendas_inferiores: parseInt(action.payload.prendas_inferiores),
        prendas_otros: parseInt(action.payload.prendas_otros),
      };
      state.total = action.payload.total;
      state.correo = action.payload.correo;
      state.url_3d = action.payload.url_3d;
      state.primer_ingreso = action.payload.primer_ingreso;
      state.administrador = action.payload.administrador;
      state.dashboard = action.payload.dashboard;
    },
    logout: (state) => {
      state.user = "";
      state.nombre = "";
      state.token = "";
      state.rol = "";
      state.gender = "";
      state.climate = "";
      state.grupo = "";
      state.cargo = "";
      state.pais = "";
      state.identidad = "";
      state.prendas_superiores = "";
      state.prendas_inferiores = "";
      state.prendas_otros = "";
      state.limits = {
        prendas_superiores: 0,
        prendas_inferiores: 0,
        prendas_otros: 0,
      };
      state.total = "";
      state.correo = "";
      state.url_3d = "";
      state.primer_ingreso = "";
      state.administrador = "";
      state.dashboard = "";
    },
    updateUserInfo: (
      state,
      action: PayloadAction<{ primer_ingreso: string }>
    ) => {
      state.primer_ingreso = action.payload.primer_ingreso;
    },
    updateTokenUser: (
      state,
      action: PayloadAction<{ token: string }>
    ) => {
      state.token = action.payload.token;
    }
  },
});

export const { login, logout, updateUserInfo, updateTokenUser } = authSlice.actions;
export default authSlice.reducer;
