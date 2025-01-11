// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Props {
	children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
	const accessToken = useSelector((state: RootState) => state.auth.accessToken);

	if (!accessToken) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;
