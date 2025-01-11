// auth-service/src/models/BlacklistedToken.ts
import { Schema, model, Document } from "mongoose";

export interface IBlacklistedToken extends Document {
	token: string;
	expiresAt: Date;
}

const blacklistedTokenSchema = new Schema<IBlacklistedToken>({
	token: { type: String, required: true, unique: true },
	expiresAt: { type: Date, required: true },
});

export default model<IBlacklistedToken>(
	"BlacklistedToken",
	blacklistedTokenSchema
);
