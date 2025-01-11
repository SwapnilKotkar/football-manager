// src/components/Layout/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar: React.FC = () => {
	const { accessToken, logout } = useAuth();

	return (
		<nav className="bg-blue-600 text-white py-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/" className="text-xl font-bold">
					Football Manager
				</Link>
				<div className="space-x-4">
					{accessToken ? (
						<>
							<Link to="/dashboard" className="hover:underline">
								Dashboard
							</Link>
							<Link to="/transfer" className="hover:underline">
								Transfer Market
							</Link>
							<button onClick={logout} className="hover:underline">
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="hover:underline">
								Login
							</Link>
							<Link to="/register" className="hover:underline">
								Register
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
