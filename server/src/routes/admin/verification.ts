import { Router } from "express";
import { getVerifications, updateVerificationStatus } from "../../controllers/admin/verification";
import { authenticateAdmin } from "../../middleware/auth";

const router = Router();

router.get("/verifications", authenticateAdmin, getVerifications);
router.put("/verification/:id", authenticateAdmin, updateVerificationStatus);

export default router; 