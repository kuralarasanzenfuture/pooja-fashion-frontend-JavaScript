import { createSlice } from "@reduxjs/toolkit";

const savedFont = typeof window !== "undefined" ? localStorage.getItem("pooja_app_font") || "outfit" : "outfit";
const savedTheme = typeof window !== "undefined" ? localStorage.getItem("pooja_app_theme") || "light" : "light";
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-font", savedFont);
  document.documentElement.setAttribute("data-theme", savedTheme);
}

const initialState = {
  sidebarOpen: true,
  mobileSidebarOpen: false,
  theme: savedTheme,
  loading: false,
  fontFamily: savedFont,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    setMobileSidebarOpen: (state, action) => {
      state.mobileSidebarOpen = action.payload;
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("pooja_app_theme", action.payload);
      }
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", action.payload);
      }
    },

    setFontFamily: (state, action) => {
      state.fontFamily = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("pooja_app_font", action.payload);
      }
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-font", action.payload);
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setMobileSidebarOpen,
  setTheme,
  setFontFamily,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
