"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ApplyButtonProps {
  jobId: string;
}

export default function ApplyButton({ jobId }: ApplyButtonProps) {
  const router = useRouter();

  const handleApply = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        alert("Please sign in to apply for this job.");
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
            applicant_id: parsedUser.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit application");
      alert("Your application has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while submitting your application.");
    }
  };

  return <Button onClick={handleApply}>Apply for this Job</Button>;
}
