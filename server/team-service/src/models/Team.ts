// team-service/src/models/Team.ts
import { Schema, model, Document } from "mongoose";

export interface ITeam extends Document {
	user: Schema.Types.ObjectId;
	budget: number;
	players: Schema.Types.ObjectId[];
}

const teamSchema = new Schema<ITeam>({
	user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
	budget: { type: Number, default: 5000000 },
	players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
});

export default model<ITeam>("Team", teamSchema);
