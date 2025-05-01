import { Request, Response } from "express";
import { db } from "../../db";
import { verification } from "../../db/schema/verification";
import { eq } from "drizzle-orm";
import { uploadToS3 } from "../../utils/s3";

export const uploadVerificationDocument = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const file = req.file;

  if (!userId || !file) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Get company ID from user ID
    const company = await db.query.company.findFirst({
      where: eq(company.user_id, userId),
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Upload file to S3
    const documentUrl = await uploadToS3(file, "verification-documents");

    // Create or update verification record
    const existingVerification = await db.query.verification.findFirst({
      where: eq(verification.company_id, company.id),
    });

    if (existingVerification) {
      await db
        .update(verification)
        .set({
          document_url: documentUrl,
          document_type: file.mimetype,
          status: "pending",
          rejection_reason: null,
        })
        .where(eq(verification.id, existingVerification.id));
    } else {
      await db.insert(verification).values({
        company_id: company.id,
        document_url: documentUrl,
        document_type: file.mimetype,
        status: "pending",
      });
    }

    res.json({
      success: true,
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
}; 