import { Router } from "express";
import zealyController from "../controllers/zealyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Route to redirect to Zealy connection page
router.get("/connect", authMiddleware, zealyController.connect);

// Route to handle Zealy callback
router.get("/callback", authMiddleware, zealyController.callback);

// Route to sync Zealy points
router.post("/sync-points", authMiddleware, zealyController.syncPoints);

export default router;
