// transfer-service/src/models/Transfer.ts
import { Schema, model, Document } from "mongoose";

export interface ITransfer extends Document {
	player: Schema.Types.ObjectId;
	owner: Schema.Types.ObjectId;
	askingPrice: number;
	isListed: boolean;
}

const transferSchema = new Schema<ITransfer>({
	player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
	owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
	askingPrice: { type: Number, required: true },
	isListed: { type: Boolean, default: false },
});

export default model<ITransfer>("Transfer", transferSchema);
