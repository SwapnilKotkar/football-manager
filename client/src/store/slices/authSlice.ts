// src/store/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { extractErrorMessage } from "../../utils/errorMessage";

interface User {
	id: string;
	email: string;
}

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	loading: false,
	error: null,
};

export const registerUser = createAsyncThunk(
	"auth/register",
	async (
		credentials: { email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/auth/register", credentials);
			return response.data;
		} catch (err) {
			return rejectWithValue(extractErrorMessage(err, "Registration failed"));
		}
	}
);

export const loginUser = createAsyncThunk(
	"auth/login",
	async (
		credentials: { email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/auth/login", credentials);
			return response.data;
		} catch (err) {
			return rejectWithValue(extractErrorMessage(err, "Login failed"));
		}
	}
);

export const refreshAccessToken = createAsyncThunk(
	"auth/refreshToken",
	async (refreshToken: string, { rejectWithValue }) => {
		try {
			const response = await axios.post("/api/auth/refresh-token", {
				refreshToken,
			});
			return response.data;
		} catch (err) {
			return rejectWithValue(extractErrorMessage(err, "Token refresh failed"));
		}
	}
);

export const logoutUser = createAsyncThunk(
	"auth/logout",
	async (refreshToken: string, { rejectWithValue }) => {
		try {
			const response = await axios.post("/api/auth/logout", { refreshToken });
			return response.data;
		} catch (err) {
			return rejectWithValue(extractErrorMessage(err, "Logout failed"));
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ accessToken: string; refreshToken: string }>
		) => {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
		},
		clearAuth: (state) => {
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Register User
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Login User
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Refresh Token
			.addCase(refreshAccessToken.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(refreshAccessToken.fulfilled, (state, action) => {
				state.loading = false;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
			})
			.addCase(refreshAccessToken.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
			})
			// Logout User
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loading = false;
				state.user = null;
				state.accessToken = null;
				state.refreshToken = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { setCredentials, clearAuth } = authSlice.actions;

export default authSlice.reducer;
