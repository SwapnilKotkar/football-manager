// team-service/src/controllers/teamController.ts
import { Request, Response } from "express";
import Team from "../models/Team";
import Player from "../models/Player";
import createTeam from "../workers/teamCreationWorker";
import AuthenticatedRequest from "../types/AuthenticatedRequest";

export const createTeamHandler = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<Response> => {
	const userId: string = req.user.id;

	try {
		const teamId: string = await createTeam(userId);
		return res.status(201).json({ teamId });
	} catch (error: any) {
		console.error("Team Service: Team Creation Error", error);
		return res
			.status(500)
			.json({ message: "Team creation failed", error: error.message });
	}
};

export const getTeam = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<Response> => {
	const userId: string = req.user.id;

	try {
		const team = await Team.findOne({ user: userId }).populate("players");
		if (!team) return res.status(404).json({ message: "Team not found" });

		return res.json({ team });
	} catch (error) {
		console.error("Team Service: Get Team Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};
