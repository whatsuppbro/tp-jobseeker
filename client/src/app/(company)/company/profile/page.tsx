"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VerificationStatus } from "@/components/VerificationStatus";
import { toast } from "sonner";

export default function CompanyProfile() {
  const [verificationStatus, setVerificationStatus] = useState<string>("unverified");
  const [rejectionReason, setRejectionReason] = useState<string | undefined>();

  const handleDocumentUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/verification`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      const data = await response.json();
      setVerificationStatus("pending");
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Manage your company information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Verification Status</h3>
                <VerificationStatus
                  status={verificationStatus}
                  rejectionReason={rejectionReason}
                  onUpload={handleDocumentUpload}
                  isCompany={true}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 