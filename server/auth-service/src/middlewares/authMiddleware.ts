// auth-service/src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/BlacklistedToken";
import User, { IUser } from "../models/User";

interface DecodedToken {
	id: string;
	email: string;
	iat: number;
	exp: number;
}

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
			};
		}
	}
}

const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).json({ message: "No token provided" });
		return;
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "No token provided" });
		return;
	}

	try {
		// Check if the token is blacklisted
		const blacklisted = await BlacklistedToken.findOne({ token });
		if (blacklisted) {
			res.status(401).json({ message: "Token has been revoked" });
			return;
		}

		// Verify the token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as DecodedToken;

		// Attach user information to the request object
		req.user = {
			id: decoded.id,
			email: decoded.email,
		};

		next();
	} catch (error) {
		console.error("Auth Middleware Error:", error);
		res.status(401).json({ message: "Invalid token" });
	}
};

export default authMiddleware;
