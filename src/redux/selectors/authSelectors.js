export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAuthInitialized = (state) => state.auth.isInitialized;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Role-based helper selectors
export const selectCurrentUserRole = (state) => state.auth?.user?.roleCode || "USER";
export const selectIsSuperAdmin = (state) => state.auth?.user?.roleCode === "SUPERADMIN";
export const selectIsAdmin = (state) => {
  const role = state.auth?.user?.roleCode;
  return role === "ADMIN" || role === "SUPERADMIN";
};
export const selectCurrentUserCompanyId = (state) => state.auth?.user?.companyId || null;
