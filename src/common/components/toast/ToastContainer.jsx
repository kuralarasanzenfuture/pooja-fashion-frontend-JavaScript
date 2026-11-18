import React, { useEffect, useState } from "react";
import "./toast.css";
import ToastItem from "./ToastItem.jsx";
import { subscribeToasts, dismissToast } from "./toastStore.js";

/**
 * ToastContainer Component
 * Mounts in the app viewport root to render all active Splashed Toasts.
 */
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToasts((updatedToasts) => {
      setToasts(updatedToasts);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <aside
      className="splashed-toast-panel"
      aria-label="Notifications"
      role="region"
    >
      {toasts.map((item) => (
        <ToastItem
          key={item.id}
          item={item}
          onDismiss={dismissToast}
        />
      ))}
    </aside>
  );
}

