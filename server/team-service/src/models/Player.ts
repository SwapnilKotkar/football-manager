// team-service/src/models/Player.ts
import { Schema, model, Document } from "mongoose";

export interface IPlayer extends Document {
	name: string;
	position: "Goalkeeper" | "Defender" | "Midfielder" | "Attacker";
	price: number;
	team: Schema.Types.ObjectId;
}

const playerSchema = new Schema<IPlayer>({
	name: { type: String, required: true },
	position: {
		type: String,
		enum: ["Goalkeeper", "Defender", "Midfielder", "Attacker"],
		required: true,
	},
	price: { type: Number, required: true },
	team: { type: Schema.Types.ObjectId, ref: "Team" },
});

export default model<IPlayer>("Player", playerSchema);
