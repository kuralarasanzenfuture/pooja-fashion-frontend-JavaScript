import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for smooth 200ms modal open/close animation and backdrop lifecycle.
 * Matches the header SearchModal architecture (crystal-clear unblurred bg-black/40 overlay,
 * smooth GPU-accelerated scale-96 to scale-100 ease-out transform, and Escape key handling).
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} [onClose] - Close callback
 * @returns {Object} { isRendered, isVisible, handleClose, backdropClasses, cardClasses }
 */
export function useModalAnimation(isOpen, onClose) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setIsRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      timer = setTimeout(() => {
        setIsRendered(false);
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 180);
  }, [onClose]);

  // Global Escape key listener to close modal smoothly
  useEffect(() => {
    if (!isRendered) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRendered, handleClose]);

  return {
    isRendered,
    isVisible,
    handleClose,
    backdropClasses: `fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 transition-opacity duration-200 ease-out select-none ${
      isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`,
    cardClasses: `transition-all duration-200 ease-out transform ${
      isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.96] -translate-y-2"
    }`,
  };
}

export default useModalAnimation;
