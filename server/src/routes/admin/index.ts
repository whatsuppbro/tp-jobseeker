import { Router } from "express";
import userRoutes from "./user";
import jobRoutes from "./job";
import companyRoutes from "./company";
import applicationRoutes from "./application";
import verificationRoutes from "./verification";

const router = Router();

router.use("/", userRoutes);
router.use("/", jobRoutes);
router.use("/", companyRoutes);
router.use("/", applicationRoutes);
router.use("/", verificationRoutes);

export default router; 