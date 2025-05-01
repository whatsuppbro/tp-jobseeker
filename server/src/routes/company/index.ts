import { Router } from "express";
import jobRoutes from "./job";
import applicationRoutes from "./application";
import verificationRoutes from "./verification";

const router = Router();

router.use("/", jobRoutes);
router.use("/", applicationRoutes);
router.use("/", verificationRoutes);

export default router; 