// src/pages/Dashboard.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeam, createTeam } from "../store/slices/teamSlice";
import { RootState, AppDispatch } from "../store/store";

const Dashboard: React.FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const { team, loading, error } = useSelector(
		(state: RootState) => state.team
	);

	useEffect(() => {
		if (!team) {
			dispatch(fetchTeam());
		}
	}, [dispatch, team]);

	const handleCreateTeam = () => {
		dispatch(createTeam());
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Your Team</h1>
			{team ? (
				<div className="bg-white shadow-md rounded px-8 py-6">
					<p>
						<strong>Team ID:</strong> {team._id}
					</p>
					<p>
						<strong>Budget:</strong> ${team.budget.toLocaleString()}
					</p>
					<h2 className="text-2xl font-bold mt-4">Players</h2>
					<ul className="list-disc list-inside">
						{team.players.map((player) => (
							<li key={player._id}>
								{player.name} - {player.position} - $
								{player.price.toLocaleString()}
							</li>
						))}
					</ul>
				</div>
			) : (
				<div className="bg-white shadow-md rounded px-8 py-6">
					<p>You don't have a team yet.</p>
					<button
						onClick={handleCreateTeam}
						className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					>
						Create Team
					</button>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
