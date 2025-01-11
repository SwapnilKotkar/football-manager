// auth-service/src/routes/authRoutes.ts
import { Router, Request, Response } from "express";
import {
	register,
	login,
	refreshTokenHandler,
	logout,
} from "../controllers/authController";
import rateLimiter from "../middlewares/rateLimiter";
import authMiddleware from "../middlewares/authMiddleware";
import User from "../models/User";

const router: Router = Router();

router.post("/register", rateLimiter, register);
router.post("/login", rateLimiter, login);
router.post("/refresh-token", rateLimiter, refreshTokenHandler);
router.post("/logout", rateLimiter, logout);

router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId) {
		return res.status(400).json({ message: "User ID not found" });
	}

	const user = await User.findById(userId).select("-password -refreshTokens");
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	return res.json({ user });
});

export default router;
