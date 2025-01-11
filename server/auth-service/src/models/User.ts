// auth-service/src/models/User.ts
import { Schema, model, Document } from "mongoose";

interface IRefreshToken {
	token: string;
}

export interface IUser extends Document {
	email: string;
	password: string;
	refreshTokens: IRefreshToken[];
}

const userSchema = new Schema<IUser>({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	refreshTokens: [{ token: String }],
});

export default model<IUser>("User", userSchema);
