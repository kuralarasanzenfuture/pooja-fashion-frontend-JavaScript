/**
 * AnimatedTabContent
 * Wrapper for tab pane body that smoothly slides and fades in on tab changes
 */
export default function AnimatedTabContent({
  activeKey,
  children,
  className = "",
}) {
  return (
    <div
      key={activeKey}
      role="tabpanel"
      className={`animate-in fade-in-50 slide-in-from-bottom-1 duration-200 ease-out fill-mode-both ${className}`}
    >
      {children}
    </div>
  );
}

