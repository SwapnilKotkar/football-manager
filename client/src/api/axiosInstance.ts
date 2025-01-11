// src/api/axiosInstance.ts
import axios from "axios";
import store, { RootState } from "../store/store";
import {
	refreshAccessToken,
	logoutUser,
	clearAuth,
} from "../store/slices/authSlice";

const axiosInstance = axios.create({
	baseURL: "http://localhost:5000", // Update with your backend base URL
});

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
	(config) => {
		const state: RootState = store.getState();
		const token = state.auth.accessToken;
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const state: RootState = store.getState();
			const refreshToken = state.auth.refreshToken;
			if (refreshToken) {
				try {
					const response = await store
						.dispatch(refreshAccessToken(refreshToken))
						.unwrap();
					axiosInstance.defaults.headers.common[
						"Authorization"
					] = `Bearer ${response.accessToken}`;
					originalRequest.headers[
						"Authorization"
					] = `Bearer ${response.accessToken}`;
					return axiosInstance(originalRequest);
				} catch (err) {
					store.dispatch(clearAuth());
					store.dispatch(logoutUser(refreshToken));
					window.location.href = "/login"; // Redirect to login
					return Promise.reject(err);
				}
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
