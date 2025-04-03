"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  user_id: number;
  email: string;
  name?: string;
  role: "seeker" | "company";
  skills?: string[];
  experience?: string;
  companyName?: string;
  industry?: string;
  location?: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await fetch("/");
  //       const data = await response.json();

  //       if (data.isAuthenticated && data.user) {
  //         setUser(data.user);
  //       } else {
  //         setUser(null);
  //       }
  //     } catch (error) {
  //       console.error("Failed to check auth status:", error);
  //       setUser(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
        <h1 className="text-3xl font-bold text-center">Welcome to JobTP</h1>
        <p className="text-lg text-center max-w-md">
          Sign in to view or create your profile
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => router.push("/signin")}
            className="cursor-pointer"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            variant="outline"
            className="cursor-pointer"
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Button variant="outline" onClick={() => router.push("/profile/edit")}>
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {user.name || "Not provided"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                {user.role === "company" ? "Employer" : "Job Seeker"}
              </p>
            </div>
          </div>

          {user.role === "seeker" && (
            <div>
              <h2 className="text-lg font-semibold">Job Seeker Details</h2>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Skills:</span>{" "}
                  {user.skills?.join(", ") || "Not specified"}
                </p>
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {user.experience || "Not specified"}
                </p>
              </div>
            </div>
          )}
        </div>

        {user.role === "company" && (
          <div>
            <h2 className="text-lg font-semibold">Company Information</h2>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">Company Name:</span>{" "}
                {user.companyName || "Not provided"}
              </p>
              <p>
                <span className="font-medium">Industry:</span>{" "}
                {user.industry || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {user.location || "Not specified"}
              </p>
            </div>
          </div>
        )}
      </div>

      {user.role === "seeker" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">
              You haven't applied to any jobs yet.
            </p>
            <Button
              variant="link"
              className="mt-2 p-0"
              onClick={() => router.push("/jobs")}
            >
              Browse jobs
            </Button>
          </div>
        </div>
      )}

      {user.role === "company" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Job Postings</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">You haven't posted any jobs yet.</p>
            <Button
              variant="link"
              className="mt-2 p-0"
              onClick={() => router.push("/dashboard/post-job")}
            >
              Post a job
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
