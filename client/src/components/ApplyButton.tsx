"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ApplyButtonProps {
  jobId: string;
  applications: {
    id: string;
    user_id: string;
    status: "pending" | "accepted" | "rejected";
  }[];
}

export default function ApplyButton({ jobId, applications }: ApplyButtonProps) {
  const router = useRouter();
  const [applicationStatus, setApplicationStatus] = useState<
    "pending" | "accepted" | "rejected" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeker, setIsSeeker] = useState(false);

  useEffect(() => {
    const checkUserRole = () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const parsedUser = JSON.parse(userData);
      setIsSeeker(parsedUser.role === "seeker");
    };

    const checkApplicationStatus = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const parsedUser = JSON.parse(userData);
      const userApplication = applications.find(
        (app) => app.user_id === parsedUser.id
      );
      setApplicationStatus(userApplication?.status || null);
    };

    checkUserRole();
    checkApplicationStatus();
  }, [applications]);

  const handleApply = async () => {
    if (applicationStatus) return;

    setIsLoading(true);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        toast.error("Please sign in to apply.");
        router.push("/signin");
        return;
      }

      const parsedUser = JSON.parse(userData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_id: jobId,
            user_id: parsedUser.id,
            status: "pending",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit application");
      toast.success("Application submitted!");
      setApplicationStatus("pending");
    } catch (error) {
      toast.error("Error submitting application.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSeeker) {
    return null;
  }

  const buttonText = isLoading
    ? "Applying..."
    : applicationStatus === "accepted"
    ? "Accepted"
    : applicationStatus === "rejected"
    ? "Rejected"
    : applicationStatus === "pending"
    ? "Pending"
    : "Apply for this Job";

  const buttonVariant =
    applicationStatus === "accepted"
      ? "approved"
      : applicationStatus === "rejected"
      ? "destructive"
      : "default";

  return (
    <div className="flex justify-center mt-4">
      <Button
        onClick={handleApply}
        disabled={!!applicationStatus || isLoading}
        variant={buttonVariant}
      >
        {buttonText}
      </Button>
    </div>
  );
}
