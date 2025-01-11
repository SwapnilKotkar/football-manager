// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
	return (
		<div className="text-center">
			<h1 className="text-4xl font-bold mb-4">Welcome to Football Manager</h1>
			<p className="mb-6">
				Manage your football team and dominate the transfer market!
			</p>
			<div className="space-x-4">
				<Link
					to="/login"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Login
				</Link>
				<Link
					to="/register"
					className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
				>
					Register
				</Link>
			</div>
		</div>
	);
};

export default Home;
