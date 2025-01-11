// src/components/Auth/Profile.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchUserProfile } from "../../store/slices/authSlice";
import { RootState, AppDispatch } from "../../store/store";

const Profile: React.FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const { user, loading, error } = useSelector(
		(state: RootState) => state.auth
	);

	useEffect(() => {
		// Implement fetchUserProfile thunk if needed
	}, [dispatch]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p className="text-red-500">{error}</p>;
	if (!user) return <p>No user data</p>;

	return (
		<div className="max-w-md mx-auto bg-white shadow-md rounded px-8 py-6">
			<h2 className="text-2xl font-bold mb-4">Profile</h2>
			<p>
				<strong>ID:</strong> {user.id}
			</p>
			<p>
				<strong>Email:</strong> {user.email}
			</p>
		</div>
	);
};

export default Profile;
