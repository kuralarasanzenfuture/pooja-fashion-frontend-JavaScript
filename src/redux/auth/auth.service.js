import api from "../../config/api.js";

const unwrapResponse = (response) => response.data?.data ?? response.data;

export const login = async (credentials) => {
	const payload = {
		...credentials,
		...(credentials?.identifier && !credentials?.email && credentials.identifier.includes("@")
			? { email: credentials.identifier }
			: {}),
		...(credentials?.identifier && !credentials?.username && !credentials.identifier.includes("@")
			? { username: credentials.identifier }
			: {}),
	};
	const response = await api.post("/auth/login", payload);
	return unwrapResponse(response);
};


export const refreshToken = async () => {
	const response = await api.post("/auth/refresh-token");
	return unwrapResponse(response);
};

export const getMe = async () => {
	const response = await api.get("/auth/me");
	return unwrapResponse(response);
};

export const logout = async () => {
	const response = await api.post("/auth/logout");
	return unwrapResponse(response);
};

export const logoutAllDevices = async () => {
	const response = await api.post("/auth/logout-all");
	return unwrapResponse(response);
};

export const getSessions = async () => {
	const response = await api.get("/auth/sessions");
	return unwrapResponse(response);
};

export const revokeSession = async (sessionId) => {
	const response = await api.delete(`/auth/sessions/${sessionId}`);
	return unwrapResponse(response);
};

export const getLoginHistory = async (params) => {
	const response = await api.get("/auth/login-history", { params });
	return response.data;
};

export const changePassword = async (passwordData) => {
	const response = await api.post("/auth/change-password", passwordData);
	return unwrapResponse(response);
};
