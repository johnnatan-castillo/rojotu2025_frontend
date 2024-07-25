import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState: Filters = {
  isFilteredBy : ""
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    filter: (state, action: PayloadAction<Filters>) => {
      state.isFilteredBy = action.payload.isFilteredBy
    },
    resetFilter: (state) => {
      state.isFilteredBy = ""
    }
  }
});

export const { filter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
