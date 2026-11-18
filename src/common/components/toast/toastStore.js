/**
 * Global Toast Store & Dispatcher
 * Provides both imperative API (toast.success, toast.error, etc.)
 * and reactive subscription for ToastProvider.
 */

let toastCounter = 0;
const listeners = new Set();

const DEFAULT_TITLES = {
  success: "Success!",
  error: "Error!",
  warning: "Warning!",
  help: "Help!",
  info: "Help!",
};

const notify = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

let toasts = [];

export const subscribeToasts = (listener) => {
  listeners.add(listener);
  listener([...toasts]);
  return () => listeners.delete(listener);
};

export const dismissToast = (id) => {
  toasts = toasts.map((t) => (t.id === id ? { ...t, isClosing: true } : t));
  notify();

  // Remove completely after exit animation completes
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 450);
};

export const clearAllToasts = () => {
  toasts = toasts.map((t) => ({ ...t, isClosing: true }));
  notify();
  setTimeout(() => {
    toasts = [];
    notify();
  }, 450);
};

export const addToast = (type = "success", message = "", titleOrOptions = {}) => {
  const id = `toast-${++toastCounter}-${Date.now()}`;

  let title = DEFAULT_TITLES[type] || "Notice!";
  let duration = 4000;
  let action = null;

  if (typeof titleOrOptions === "string") {
    title = titleOrOptions;
  } else if (typeof titleOrOptions === "object" && titleOrOptions !== null) {
    if (titleOrOptions.title) title = titleOrOptions.title;
    if (typeof titleOrOptions.duration === "number") duration = titleOrOptions.duration;
    if (titleOrOptions.action) action = titleOrOptions.action;
  }

  // Support normalizing "info" to "help" for splashing styling
  const normalizedType = type === "info" ? "help" : type;

  const newToast = {
    id,
    type: normalizedType,
    message: String(message || ""),
    title,
    duration,
    action,
    createdAt: Date.now(),
    isClosing: false,
  };

  // Limit max visible toasts to 5 to avoid screen clutter
  if (toasts.length >= 5) {
    toasts = toasts.slice(1);
  }

  toasts = [...toasts, newToast];
  notify();
  return id;
};

/**
 * Universal toast object callable anywhere in the app
 * Examples:
 *   toast.success("User saved successfully")
 *   toast.error("Network request failed", "Failed!")
 *   toast.warning("Check GST compliance rate")
 *   toast.info("Need help? Click here")
 */
export const toast = {
  success: (message, titleOrOptions) => addToast("success", message, titleOrOptions),
  error: (message, titleOrOptions) => addToast("error", message, titleOrOptions),
  warning: (message, titleOrOptions) => addToast("warning", message, titleOrOptions),
  help: (message, titleOrOptions) => addToast("help", message, titleOrOptions),
  info: (message, titleOrOptions) => addToast("help", message, titleOrOptions),
  show: (type, message, titleOrOptions) => addToast(type, message, titleOrOptions),
  dismiss: (id) => dismissToast(id),
  clear: () => clearAllToasts(),
};

export default toast;

