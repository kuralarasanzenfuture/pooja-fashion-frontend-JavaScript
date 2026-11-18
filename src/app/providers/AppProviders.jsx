import ReduxProvider from "./ReduxProvider";
import QueryProvider from "./QueryProvider";
import { ToastProvider } from "../../common/components/toast/index.js";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ToastProvider>{children}</ToastProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
