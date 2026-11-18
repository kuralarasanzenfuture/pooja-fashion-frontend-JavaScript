import React, { createContext, useContext, useMemo } from "react";
import ToastContainer from "./ToastContainer.jsx";
import { toast } from "./toastStore.js";

const ToastContext = createContext(toast);

/**
 * ToastProvider Component
 * Wrap around app root (in AppProviders.jsx).
 * Mounts the ToastContainer globally and provides useToast context.
 */
export function ToastProvider({ children }) {
  const value = useMemo(() => toast, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook
 * Access the toast dispatcher inside React components.
 * Alternatively, import { toast } directly from "@/common/components/toast".
 */
export function useToast() {
  const context = useContext(ToastContext);
  return context || toast;
}

export default ToastProvider;

