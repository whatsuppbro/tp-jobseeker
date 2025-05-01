import { Router } from "express";
import { uploadVerificationDocument } from "../../controllers/company/verification";
import { authenticateUser } from "../../middleware/auth";
import { upload } from "../../middleware/upload";

const router = Router();

router.post(
  "/verification",
  authenticateUser,
  upload.single("document"),
  uploadVerificationDocument
);

export default router; 