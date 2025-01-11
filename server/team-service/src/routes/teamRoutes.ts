// team-service/src/routes/teamRoutes.ts
import { Router } from "express";
import { createTeamHandler, getTeam } from "../controllers/teamController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = Router();

router.post("/create", authMiddleware, createTeamHandler);
router.get("/", authMiddleware, getTeam);

export default router;
