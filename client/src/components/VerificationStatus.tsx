import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface VerificationStatusProps {
  status: string;
  rejectionReason?: string;
  onUpload?: (file: File) => void;
  isCompany?: boolean;
}

export function VerificationStatus({
  status,
  rejectionReason,
  onUpload,
  isCompany = false,
}: VerificationStatusProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
        toast.error("Only image and PDF files are allowed");
        return;
      }
      onUpload?.(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        {rejectionReason && (
          <p className="text-sm text-red-600">{rejectionReason}</p>
        )}
      </div>

      {isCompany && status !== "verified" && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => document.getElementById("verification-doc")?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
          <input
            id="verification-doc"
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-sm text-gray-500">
            Upload a business registration document or other official document
          </p>
        </div>
      )}
    </div>
  );
} 