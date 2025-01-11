// shared/src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	console.error("Shared Error Handler:", err);
	res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;
