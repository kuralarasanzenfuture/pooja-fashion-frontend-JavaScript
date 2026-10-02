import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsAuthInitialized,
  selectCurrentUserRole,
} from "../redux/selectors/authSelectors.js";
import { ROUTES } from "../constants/routes.js";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "../common/components/ui/buttons/index.js";

/**
 * Role-Based Route Guard
 * Verifies both authentication status and allowed user roles (e.g. ['ADMIN', 'SUPERADMIN']).
 * If unauthenticated, redirects to login.
 * If unauthorized, presents a clear access denied card with navigation options.
 */
export default function RoleProtectedRoute({ allowedRoles = [] }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsAuthInitialized);
  const userRole = useSelector(selectCurrentUserRole);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#1e3a8a]/20 border-t-[#1e3a8a] animate-spin mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Verifying permissions...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-base-100 rounded-3xl border border-base-300 p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-base-content tracking-tight">
              Access Restricted
            </h2>
            <p className="text-sm text-base-content/65 leading-relaxed">
              Your role <span className="font-semibold text-primary">({userRole})</span> does not have sufficient permissions to view or manage this module.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => (window.location.href = ROUTES.DASHBOARD)}
              className="w-full sm:w-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
