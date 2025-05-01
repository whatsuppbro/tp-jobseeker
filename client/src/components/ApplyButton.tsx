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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "seeker" | "company";
  seeker: {
    id: string;
    resume_url?: string;
    skills?: { id: string; name: string }[];
    education?: {
      id: string;
      school_name: string;
      degree: string;
      field_of_study: string;
    }[];
  };
}

export default function ApplyButton({ jobId, applications }: ApplyButtonProps) {
  const router = useRouter();
  const [applicationStatus, setApplicationStatus] = useState<
    "pending" | "accepted" | "rejected" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeker, setIsSeeker] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const parsedUser = JSON.parse(userData);
      setIsSeeker(parsedUser.role === "seeker");

      const userId = parsedUser.id;
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`
      );

      if (!userResponse.ok) return;
      const user = await userResponse.json();
      const userInformation: User = {
        ...user.data,
      };
      setUser(userInformation);
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
      
      // Check if user has resume
      if (!user?.seeker?.resume_url) {
        toast.error("Please upload your resume before applying.");
        router.push("/profile/edit");
        return;
      }

      // Check if user has skills
      if (!user?.seeker?.skills || user.seeker.skills.length === 0) {
        toast.error("Please add at least one skill to your profile.");
        router.push("/profile");
        return;
      }

      // Check if user has education
      if (!user?.seeker?.education || user.seeker.education.length === 0) {
        toast.error("Please add your education information.");
        router.push("/profile");
        return;
      }

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

  if (!user?.seeker) {
    return (
      <div className="flex justify-center mt-4">
        <Button onClick={() => router.push("/profile/edit")} size="lg">
          Edit Personal Information
        </Button>
      </div>
    );
  }
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
