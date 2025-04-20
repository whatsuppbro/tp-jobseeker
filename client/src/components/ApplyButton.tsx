"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ApplyButtonProps {
  jobId: string;
  pendingUserIds: string[];
}

export default function ApplyButton({
  jobId,
  pendingUserIds,
}: ApplyButtonProps) {
  const router = useRouter();
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkApplication = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const parsedUser = JSON.parse(userData);
      setHasApplied(pendingUserIds.includes(parsedUser.id));
    };
    checkApplication();
  }, [pendingUserIds]);

  const handleApply = async () => {
    if (hasApplied) return;

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
      setHasApplied(true);
    } catch (error) {
      toast.error("Error submitting application.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <Button
        onClick={handleApply}
        disabled={hasApplied || isLoading}
        variant={hasApplied ? "secondary" : "default"}
      >
        {hasApplied
          ? "Pending"
          : isLoading
          ? "Applying..."
          : "Apply for this Job"}
      </Button>
    </div>
  );
}
