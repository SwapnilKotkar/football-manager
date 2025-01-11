// transfer-service/src/controllers/transferController.ts
import { Request, Response } from "express";
import Transfer, { ITransfer } from "../models/Transfer";
import Player from "../../team-service/src/models/Player"; // Ensure proper path or use inter-service communication
import Team from "../../team-service/src/models/Team"; // Ensure proper path or use inter-service communication
import User from "../../auth-service/src/models/User"; // Ensure proper path or use inter-service communication
import emailEmitter from "../../auth-service/src/utils/emailEmitter"; // Ensure proper path or use inter-service communication

export const filterTransfers = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const { teamName, playerName, price } = req.query;
	try {
		let filters: any = { isListed: true };

		if (playerName) {
			filters["player.name"] = { $regex: playerName, $options: "i" };
		}

		if (price) {
			filters["askingPrice"] = { $lte: Number(price) };
		}

		// For teamName filtering, assuming you have a way to join Player with Team
		// This requires aggregation or proper referencing
		// For simplicity, this example skips teamName filtering

		const transfers: ITransfer[] = await Transfer.find(filters)
			.populate({
				path: "player",
				populate: { path: "team", select: "name" },
			})
			.populate("owner", "email");

		return res.json({ transfers });
	} catch (error) {
		console.error("Transfer Service: Filter Transfers Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};

export const listTransfer = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const userId: string = req.user.id;
	const { playerId, askingPrice } = req.body;

	try {
		const transfer: ITransfer | null = await Transfer.findOne({
			player: playerId,
			owner: userId,
		});
		if (!transfer)
			return res.status(404).json({ message: "Player not found in your team" });

		transfer.askingPrice = askingPrice;
		transfer.isListed = true;
		await transfer.save();

		return res.json({ message: "Player listed for transfer" });
	} catch (error) {
		console.error("Transfer Service: List Transfer Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};

export const delistTransfer = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const userId: string = req.user.id;
	const { playerId } = req.body;

	try {
		const transfer: ITransfer | null = await Transfer.findOne({
			player: playerId,
			owner: userId,
		});
		if (!transfer)
			return res.status(404).json({ message: "Player not found in your team" });

		transfer.isListed = false;
		await transfer.save();

		return res.json({ message: "Player delisted from transfer" });
	} catch (error) {
		console.error("Transfer Service: Delist Transfer Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};

export const buyPlayer = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const buyerId: string = req.user.id;
	const { transferId } = req.body;

	try {
		const transfer: ITransfer | null = await Transfer.findById(transferId)
			.populate("player")
			.populate("owner");

		if (!transfer || !transfer.isListed)
			return res.status(404).json({ message: "Transfer not available" });

		const purchasePrice: number = transfer.askingPrice * 0.95;

		// Update buyer's budget and team
		const buyerTeam = await Team.findOne({ user: buyerId });
		if (!buyerTeam)
			return res.status(404).json({ message: "Buyer team not found" });

		if (buyerTeam.budget < purchasePrice) {
			return res.status(400).json({ message: "Insufficient budget" });
		}

		buyerTeam.budget -= purchasePrice;
		buyerTeam.players.push(transfer.player._id);
		await buyerTeam.save();

		// Update seller's team and budget
		const sellerTeam = await Team.findOne({ user: transfer.owner._id });
		if (!sellerTeam)
			return res.status(404).json({ message: "Seller team not found" });

		sellerTeam.budget += purchasePrice;
		sellerTeam.players = sellerTeam.players.filter(
			(pid) => pid.toString() !== transfer.player._id.toString()
		);
		await sellerTeam.save();

		// Update transfer record
		transfer.isListed = false;
		transfer.owner = buyerId;
		transfer.askingPrice = 0;
		await transfer.save();

		// Emit event for sending purchase email
		emailEmitter.emit("playerPurchased", {
			buyerId,
			sellerId: transfer.owner._id,
			playerId: transfer.player._id,
		});

		return res.json({ message: "Player purchased successfully" });
	} catch (error) {
		console.error("Transfer Service: Buy Player Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};
