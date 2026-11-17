import React from "react";

/**
 * AnimatedTabContent
 * Wrapper for tab pane body that smoothly slides and fades in on tab changes.
 * Supports both `activeKey` and `activeTab` props for seamless interoperability across master pages.
 */
export default function AnimatedTabContent({
  activeKey,
  activeTab,
  children,
  className = "",
}) {
  const currentKey = activeKey ?? activeTab;

  return (
    <div
      key={currentKey}
      role="tabpanel"
      className={`animate-in fade-in-50 slide-in-from-bottom-1 duration-200 ease-out fill-mode-both ${className}`}
    >
      {children}
    </div>
  );
}
