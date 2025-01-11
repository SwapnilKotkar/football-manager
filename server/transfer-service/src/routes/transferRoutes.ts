// transfer-service/src/routes/transferRoutes.ts
import { Router } from "express";
import {
	filterTransfers,
	listTransfer,
	delistTransfer,
	buyPlayer,
} from "../controllers/transferController";
import authMiddleware from "../middlewares/authMiddleware";
import rateLimiter from "../middlewares/rateLimiter";

const router: Router = Router();

router.get("/filter", authMiddleware, rateLimiter, filterTransfers);
router.post("/list", authMiddleware, rateLimiter, listTransfer);
router.post("/delist", authMiddleware, rateLimiter, delistTransfer);
router.post("/buy", authMiddleware, rateLimiter, buyPlayer);

export default router;
