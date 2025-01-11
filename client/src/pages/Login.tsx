// src/pages/Login.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const authState = useSelector((state: RootState) => state.auth);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await dispatch(loginUser({ email, password })).unwrap();
			navigate("/dashboard");
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<div className="max-w-md mx-auto bg-white shadow-md rounded px-8 py-6">
			<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
			{authState.error && (
				<p className="text-red-500 mb-4">{authState.error}</p>
			)}
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="email"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div className="mb-6">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="password"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div className="flex items-center justify-between">
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{authState.loading ? "Logging in..." : "Login"}
					</button>
					<Link
						to="/register"
						className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
					>
						Register
					</Link>
				</div>
			</form>
		</div>
	);
};

export default Login;
