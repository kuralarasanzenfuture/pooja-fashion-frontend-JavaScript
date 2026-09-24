import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	changePassword,
	getMe,
	getSessions,
	login,
	logout,
	logoutAllDevices,
	refreshToken as refreshTokenService,
	revokeSession,
} from "./auth.service.js";

const getStoredUser = () => {
	try {
		return JSON.parse(localStorage.getItem("user") || "null");
	} catch {
		return null;
	}
};

const getTokenData = (payload) => payload?.tokens ?? payload?.data?.tokens ?? {};

const persistAuth = (payload) => {
	const tokens = getTokenData(payload);

	if (tokens.accessToken) localStorage.setItem("accessToken", tokens.accessToken);
	if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
	if (payload?.session?.id) localStorage.setItem("sessionId", payload.session.id);
	if (payload?.user) localStorage.setItem("user", JSON.stringify(payload.user));

	return tokens;
};

const getErrorMessage = (error, fallback) => {
	if (error.code === "ERR_NETWORK" || !error.response) {
		return "Unable to connect to server. Ensure the backend API is running on http://localhost:5000 or use Demo Mode.";
	}
	return (
		error.response?.data?.message ||
		error.response?.data?.error ||
		error.message ||
		fallback
	);
};

export const loginWithDemo = createAsyncThunk(
	"auth/loginWithDemo",
	async (demoRole = "admin") => {
		const demoUser = {
			id: "usr_demo_01",
			name: "Pooja Sharma",
			username: "pooja.admin",
			email: "admin@poojafashion.com",
			role: demoRole === "admin" ? "ADMIN" : "STAFF",
			storeName: "Pooja Fashion Main Branch",
		};
		const demoData = {
			user: demoUser,
			session: { id: "sess_demo_101", active: true },
			tokens: {
				accessToken: "demo_access_token_pooja_fashion",
				refreshToken: "demo_refresh_token_pooja_fashion",
			},
		};
		persistAuth(demoData);
		return demoData;
	}
);

export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (credentials, { rejectWithValue }) => {
		try {
			const authData = await login(credentials);
			persistAuth(authData);
			return authData;
		} catch (error) {
			return rejectWithValue(getErrorMessage(error, "Login failed. Please verify credentials."));
		}
	},
);

export const fetchCurrentUser = createAsyncThunk(
	"auth/fetchCurrentUser",
	async (_, { rejectWithValue }) => {
		try {
			const profile = await getMe();
			localStorage.setItem("user", JSON.stringify(profile.user));
			return profile;
		} catch (error) {
			return rejectWithValue(getErrorMessage(error, "Failed to fetch user"));
		}
	},
);

export const refreshUserToken = createAsyncThunk(
	"auth/refreshToken",
	async (_, { rejectWithValue }) => {
		try {
			const tokenData = await refreshTokenService();
			persistAuth({ tokens: tokenData });
			return tokenData;
		} catch (error) {
			return rejectWithValue(getErrorMessage(error, "Token refresh failed"));
		}
	},
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { dispatch }) => {
	try {
		await logout();
	} finally {
		dispatch(clearAuth());
	}
	return true;
});

export const logoutAll = createAsyncThunk("auth/logoutAll", async (_, { dispatch }) => {
	try {
		await logoutAllDevices();
	} finally {
		dispatch(clearAuth());
	}
	return true;
});

export const fetchSessions = createAsyncThunk("auth/fetchSessions", async (_, { rejectWithValue }) => {
	try {
		return await getSessions();
	} catch (error) {
		return rejectWithValue(getErrorMessage(error, "Failed to fetch sessions"));
	}
});

export const revokeUserSession = createAsyncThunk(
	"auth/revokeSession",
	async (sessionId, { rejectWithValue }) => {
		try {
			return await revokeSession(sessionId);
		} catch (error) {
			return rejectWithValue(getErrorMessage(error, "Failed to revoke session"));
		}
	},
);

export const updatePassword = createAsyncThunk(
	"auth/changePassword",
	async (passwordData, { rejectWithValue }) => {
		try {
			return await changePassword(passwordData);
		} catch (error) {
			return rejectWithValue(getErrorMessage(error, "Failed to change password"));
		}
	},
);

const storedAccessToken = localStorage.getItem("accessToken");
const storedUser = getStoredUser();

const initialState = {
	user: storedUser,
	session: null,
	sessions: [],
	accessToken: storedAccessToken || null,
	isAuthenticated: Boolean(storedAccessToken || storedUser),
	isInitialized: false,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearAuthError(state) {
			state.error = null;
		},
		setCredentials(state, action) {
			const authData = action.payload?.data ?? action.payload;
			const tokens = getTokenData(authData);
			state.user = authData.user || authData || null;
			state.session = authData.session || null;
			state.accessToken = tokens.accessToken || null;
			state.isAuthenticated = true;
			state.isInitialized = true;
			persistAuth(authData);
		},
		clearAuth(state) {
			state.user = null;
			state.session = null;
			state.accessToken = null;
			state.isAuthenticated = false;
			state.isInitialized = true;
			state.error = null;
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("sessionId");
			localStorage.removeItem("user");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				const tokens = getTokenData(action.payload);
				state.loading = false;
				state.user = action.payload.user || action.payload;
				state.session = action.payload.session || null;
				state.accessToken = tokens.accessToken || null;
				state.isAuthenticated = true;
				state.isInitialized = true;
				state.error = null;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(loginWithDemo.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginWithDemo.fulfilled, (state, action) => {
				const tokens = getTokenData(action.payload);
				state.loading = false;
				state.user = action.payload.user;
				state.session = action.payload.session;
				state.accessToken = tokens.accessToken || null;
				state.isAuthenticated = true;
				state.isInitialized = true;
				state.error = null;
			})
			.addCase(loginWithDemo.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(fetchCurrentUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isInitialized = true;
				state.user = action.payload?.user || action.payload;
				state.session = action.payload?.currentSession || action.payload?.session || null;
				state.isAuthenticated = true;
				if (action.payload?.user) {
					localStorage.setItem("user", JSON.stringify(action.payload.user));
				}
			})
			.addCase(fetchCurrentUser.rejected, (state) => {
				state.loading = false;
				state.isInitialized = true;
				// In demo mode without backend running, preserve demo session
				if (state.accessToken?.startsWith("demo_") && state.user) {
					state.isAuthenticated = true;
					return;
				}
				// Otherwise cookie session is not valid / unauthorized
				state.user = null;
				state.session = null;
				state.accessToken = null;
				state.isAuthenticated = false;
			})
			.addCase(refreshUserToken.fulfilled, (state, action) => {
				const tokens = getTokenData(action.payload);
				state.accessToken = tokens.accessToken || action.payload?.accessToken || null;
				state.isAuthenticated = true;
			})
			.addCase(refreshUserToken.rejected, (state, action) => {
				state.error = action.payload;
			})
			.addCase(fetchSessions.fulfilled, (state, action) => {
				state.sessions = action.payload;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.sessions = [];
			})
			.addCase(logoutAll.fulfilled, (state) => {
				state.sessions = [];
			});
	},
});

export const { clearAuth, clearAuthError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
