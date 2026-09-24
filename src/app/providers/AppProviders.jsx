import ReduxProvider from "./ReduxProvider";
import QueryProvider from "./QueryProvider";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}
