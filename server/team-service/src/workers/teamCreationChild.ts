// team-service/src/workers/teamCreationChild.ts
import { parentPort, workerData } from "worker_threads";
import mongoose from "mongoose";
import Team from "../models/Team";
import Player from "../models/Player";

// Sample data for players
const samplePlayers = [
	// Goalkeepers
	{ name: "GK1", position: "Goalkeeper", price: 50000 },
	{ name: "GK2", position: "Goalkeeper", price: 60000 },
	{ name: "GK3", position: "Goalkeeper", price: 55000 },
	// Defenders
	{ name: "DF1", position: "Defender", price: 40000 },
	{ name: "DF2", position: "Defender", price: 42000 },
	{ name: "DF3", position: "Defender", price: 45000 },
	{ name: "DF4", position: "Defender", price: 43000 },
	{ name: "DF5", position: "Defender", price: 41000 },
	{ name: "DF6", position: "Defender", price: 44000 },
	// Midfielders
	{ name: "MF1", position: "Midfielder", price: 70000 },
	{ name: "MF2", position: "Midfielder", price: 72000 },
	{ name: "MF3", position: "Midfielder", price: 68000 },
	{ name: "MF4", position: "Midfielder", price: 71000 },
	{ name: "MF5", position: "Midfielder", price: 69000 },
	{ name: "MF6", position: "Midfielder", price: 73000 },
	// Attackers
	{ name: "AT1", position: "Attacker", price: 90000 },
	{ name: "AT2", position: "Attacker", price: 95000 },
	{ name: "AT3", position: "Attacker", price: 88000 },
	{ name: "AT4", position: "Attacker", price: 92000 },
	{ name: "AT5", position: "Attacker", price: 87000 },
];

const createTeam = async (userId: string) => {
	try {
		// Connect to MongoDB
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(process.env.MONGO_URI as string);
		}

		// Create Team
		const team = new Team({ user: userId });
		await team.save();

		// Assign Players
		const players = samplePlayers.map((p) => ({ ...p, team: team._id }));
		const createdPlayers = await Player.insertMany(players);
		team.players = createdPlayers.map((p) => p._id);
		await team.save();

		parentPort?.postMessage({ status: "success", teamId: team._id.toString() });
		process.exit(0);
	} catch (error: any) {
		parentPort?.postMessage({ status: "error", error: error.message });
		process.exit(1);
	}
};

createTeam(workerData.userId);
