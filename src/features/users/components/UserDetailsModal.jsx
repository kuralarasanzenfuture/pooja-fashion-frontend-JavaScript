import React from "react";
import UserViewPage from "../pages/UserViewPage.jsx";

/**
 * UserDetailsModal -> User Profile Page View
 * Renders full page view style (not modal/popup style) matching the Connext profile reference design.
 */
export default function UserDetailsModal({
  isOpen = false,
  onClose,
  user = null,
  onEdit,
  onResetPassword,
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-base-100">
      <UserViewPage
        userId={user.id}
        initialUser={user}
        onBack={onClose}
        onEdit={onEdit}
        onResetPassword={onResetPassword}
      />
    </div>
  );
}
