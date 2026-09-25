import { createSlice } from "@reduxjs/toolkit";

const savedFont = typeof window !== "undefined" ? localStorage.getItem("pooja_app_font") || "outfit" : "outfit";
const savedFontSize = typeof window !== "undefined" ? localStorage.getItem("pooja_app_font_size") || "15px" : "15px";
const savedTheme = typeof window !== "undefined" ? localStorage.getItem("pooja_app_theme") || "light" : "light";
const savedHeadingFont = typeof window !== "undefined" ? localStorage.getItem("pooja_app_heading_font") || "" : "";
const savedMonoFont = typeof window !== "undefined" ? localStorage.getItem("pooja_app_mono_font") || "" : "";
const savedLineHeight = typeof window !== "undefined" ? localStorage.getItem("pooja_app_line_height") || "1.75" : "1.75";

if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-font", savedFont);
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.documentElement.setAttribute("data-font-size", savedFontSize);
  document.documentElement.style.setProperty("--app-font-size", savedFontSize);
  document.documentElement.style.setProperty("font-size", savedFontSize, "important");
  if (savedHeadingFont) {
    document.documentElement.style.setProperty("--font-display", savedHeadingFont);
  }
  if (savedMonoFont) {
    document.documentElement.style.setProperty("--font-geist-mono", savedMonoFont);
  }
  if (savedLineHeight) {
    document.documentElement.style.setProperty("--app-line-height", savedLineHeight);
  }
}

const initialState = {
  sidebarOpen: true,
  mobileSidebarOpen: false,
  theme: savedTheme,
  loading: false,
  fontFamily: savedFont,
  fontSize: savedFontSize,
  headingFont: savedHeadingFont,
  monoFont: savedMonoFont,
  lineHeight: savedLineHeight,
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

    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("pooja_app_font_size", action.payload);
      }
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-font-size", action.payload);
        document.documentElement.style.setProperty("--app-font-size", action.payload);
        document.documentElement.style.setProperty("font-size", action.payload, "important");
        if (document.body) {
          document.body.style.setProperty("font-size", action.payload);
        }
      }
    },

    setTypography: (state, action) => {
      const { fontFamily, fontSize, headingFamily, monoFamily, lineHeight } = action.payload;
      if (fontFamily) {
        state.fontFamily = fontFamily;
        if (typeof window !== "undefined") localStorage.setItem("pooja_app_font", fontFamily);
        if (typeof document !== "undefined") document.documentElement.setAttribute("data-font", fontFamily);
      }
      if (fontSize) {
        state.fontSize = fontSize;
        if (typeof window !== "undefined") localStorage.setItem("pooja_app_font_size", fontSize);
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-font-size", fontSize);
          document.documentElement.style.setProperty("--app-font-size", fontSize);
          document.documentElement.style.setProperty("font-size", fontSize, "important");
          if (document.body) {
            document.body.style.setProperty("font-size", fontSize);
          }
        }
      }
      if (headingFamily) {
        state.headingFont = headingFamily;
        if (typeof window !== "undefined") localStorage.setItem("pooja_app_heading_font", headingFamily);
        if (typeof document !== "undefined") document.documentElement.style.setProperty("--font-display", headingFamily);
      }
      if (monoFamily) {
        state.monoFont = monoFamily;
        if (typeof window !== "undefined") localStorage.setItem("pooja_app_mono_font", monoFamily);
        if (typeof document !== "undefined") document.documentElement.style.setProperty("--font-geist-mono", monoFamily);
      }
      if (lineHeight) {
        state.lineHeight = lineHeight;
        if (typeof window !== "undefined") localStorage.setItem("pooja_app_line_height", lineHeight);
        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty("--app-line-height", lineHeight);
          if (document.body) {
            document.body.style.setProperty("line-height", lineHeight);
          }
        }
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
  setFontSize,
  setTypography,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
