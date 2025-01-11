// team-service/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
	id: string;
	email: string;
	iat: number;
	exp: number;
}

const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
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
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as DecodedToken;
		req.user = { id: decoded.id, email: decoded.email };
		next();
	} catch (error) {
		console.error("Team Service: Auth Middleware Error", error);
		res.status(401).json({ message: "Invalid token" });
	}
};

export default authMiddleware;
