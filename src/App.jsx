import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes.jsx";
import { fetchCurrentUser } from "./redux/auth/authSlice.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Validate cookie-based authentication session with the backend on app boot
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

