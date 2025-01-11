// auth-service/src/services/tokenService.ts
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../models/User";

export const generateAccessToken = (user: IUser): string => {
	return jwt.sign(
		{ id: user._id, email: user.email },
		process.env.JWT_SECRET as string,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

export const generateRefreshToken = (): string => {
	return uuidv4();
};
