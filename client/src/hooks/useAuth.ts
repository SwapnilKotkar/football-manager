// src/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
	loginUser,
	logoutUser,
	registerUser,
	clearAuth,
} from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const { accessToken, refreshToken, loading, error } = useSelector(
		(state: RootState) => state.auth
	);

	const login = async (email: string, password: string) => {
		try {
			await dispatch(loginUser({ email, password })).unwrap();
			console.log("Logged in successfully!");
			navigate("/dashboard");
		} catch (err) {
			console.error(`Login failed: ${err}`);
		}
	};

	const register = async (email: string, password: string) => {
		try {
			await dispatch(registerUser({ email, password })).unwrap();
			console.log("Registered successfully!");
			navigate("/login");
		} catch (err) {
			console.error(`Registration failed: ${err}`);
		}
	};

	const logout = () => {
		if (refreshToken) {
			dispatch(logoutUser(refreshToken))
				.unwrap()
				.then(() => {
					dispatch(clearAuth());
					console.log("Logged out successfully!");
					navigate("/login");
				})
				.catch((err) => {
					console.error(`Logout failed: ${err}`);
					console.error("Logout failed:", err);
				});
		} else {
			console.warn("No refresh token available.");
			dispatch(clearAuth());
			navigate("/login");
		}
	};

	return {
		accessToken,
		refreshToken,
		loading,
		error,
		login,
		register,
		logout,
	};
};

export default useAuth;
