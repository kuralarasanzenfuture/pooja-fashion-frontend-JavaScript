import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
	selectIsAuthenticated,
	selectIsAuthInitialized,
} from "../redux/selectors/authSelectors.js";
import { ROUTES } from "../constants/routes.js";

export default function PublicRoute() {
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const isInitialized = useSelector(selectIsAuthInitialized);

	if (!isInitialized) {
		return (
			<div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4">
				<div className="w-10 h-10 rounded-full border-4 border-[#1e3a8a]/20 border-t-[#1e3a8a] animate-spin mb-3" />
				<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
					Verifying session...
				</p>
			</div>
		);
	}

	return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
}

