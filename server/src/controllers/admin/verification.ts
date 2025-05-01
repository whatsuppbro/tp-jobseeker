import { Request, Response } from "express";
import { db } from "../../db";
import { verification, verification_history } from "../../db/schema/verification";
import { eq } from "drizzle-orm";
import { notification } from "../../db/schema/notification";

export const getVerifications = async (req: Request, res: Response) => {
  try {
    const verifications = await db.query.verification.findMany({
      with: {
        company: {
          columns: {
            company_name: true,
            company_email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: verifications,
    });
  } catch (error) {
    console.error("Error fetching verifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch verifications",
    });
  }
};

export const updateVerificationStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, reason } = req.body;
  const adminId = req.user?.id;

  if (!adminId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const verificationRecord = await db.query.verification.findFirst({
      where: eq(verification.id, id),
      with: {
        company: true,
      },
    });

    if (!verificationRecord) {
      return res.status(404).json({
        success: false,
        message: "Verification not found",
      });
    }

    const newStatus = action === "approve" ? "verified" : "rejected";

    // Update verification status
    await db
      .update(verification)
      .set({
        status: newStatus,
        rejection_reason: action === "reject" ? reason : null,
      })
      .where(eq(verification.id, id));

    // Create verification history record
    await db.insert(verification_history).values({
      verification_id: id,
      admin_id: adminId,
      action: action,
      reason: action === "reject" ? reason : null,
    });

    // Create notification for company
    await db.insert(notification).values({
      user_id: verificationRecord.company.user_id,
      type: "verification_status",
      message: `Your verification request has been ${newStatus}`,
    });

    res.json({
      success: true,
      message: `Verification ${action}d successfully`,
    });
  } catch (error) {
    console.error("Error updating verification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update verification status",
    });
  }
}; 