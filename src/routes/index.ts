import { Router } from "express";
import waitlistRoutes from "../api/waitlist";
import zealyRoutes from "../api/zealy";
import authRoutes from "./authRoutes";
import cardRoutes from "./cardRoutes";
import kycRoutes from "./kycRoutes";
import loiRoutes from "./loiRoutes";
import notificationRoutes from "./notificationRoutes";
import walletRoutes from "./walletRoutes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/wallet", walletRoutes);
router.use("/kyc", kycRoutes);
router.use("/card", cardRoutes);
router.use("/notifications", notificationRoutes);
router.use("/waitlist", waitlistRoutes);
router.use("/loi", loiRoutes);
router.use("/zealy", zealyRoutes);

export default router;
