// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
	return (
		<Router>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow container mx-auto px-4 py-6">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/transfer"
							element={
								<ProtectedRoute>
									<Transfer />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
