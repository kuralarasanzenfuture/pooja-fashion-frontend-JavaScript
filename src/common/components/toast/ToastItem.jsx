import React, { useEffect, useRef, useState } from "react";

/**
 * ToastItem Component
 * Renders an individual Splashed Toast with organic droplet gradients,
 * head badge icon, hover-to-pause timer, and close action.
 */
export default function ToastItem({ item, onDismiss }) {
  const { id, type, title, message, duration = 4000, isClosing, action } = item;
  const [isHovered, setIsHovered] = useState(false);
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    if (isClosing) return;

    if (duration > 0 && !isHovered) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(id);
      }, remainingTimeRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, duration, isHovered, isClosing, onDismiss]);

  const handleMouseEnter = () => {
    if (isClosing) return;
    setIsHovered(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const handleMouseLeave = () => {
    if (isClosing) return;
    setIsHovered(false);
  };

  return (
    <div
      className={`splashed-toast-item ${type} ${isClosing ? "closed" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      <div className={`splashed-toast ${type}`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="splashed-close"
          aria-label="Close notification"
          title="Dismiss"
        />

        {/* Title with speech connector neck */}
        <h3>{title}</h3>

        {/* Message body */}
        <p>{message}</p>

        {/* Optional interactive action element (e.g. undo, retry, link) */}
        {action && <div className="mt-2 pt-2 border-t border-white/20 text-xs font-medium">{action}</div>}

        {/* Progress bar line if auto-dismiss enabled */}
        {duration > 0 && (
          <div className="splashed-toast-progress">
            <div
              className="splashed-toast-progress-bar"
              style={{
                animation: isHovered
                  ? "none"
                  : `splashed-shrink ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

