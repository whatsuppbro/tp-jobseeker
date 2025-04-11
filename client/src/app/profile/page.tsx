"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: number;
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userFromStorage = localStorage.getItem("user");

        if (!userFromStorage) {
          setIsLoading(false);
          return;
        }
        const userData = JSON.parse(userFromStorage);
        const userId = userData.id;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`
        );

        if (!response.ok) throw new Error("Failed to fetch user");

        const completeUserData: User = await response.json();
        setUser(completeUserData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-center bg-clip-text ">
          Welcome to JobTP
        </h1>
        <p className="max-w-md text-center text-gray-600">
          Sign in to view or create your professional profile and start your job
          search or hiring journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/signin")}
            className="w-full sm:w-40 transition-all hover:bg-blue-600"
            size="lg"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            variant="outline"
            className="w-full sm:w-40 hover:bg-gray-100 transition-all"
            size="lg"
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto md:px-6 lg:px-8 flex flex-col items-center py-12">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
            Your Profile
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push("/profile/edit")}
            className="px-6 hover:bg-gray-100 transition-all"
          >
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 w-full">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-800">
                    {user.name || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-800">
                    {user.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-800">
                    {user.role === "company" ? "Employer" : "Job Seeker"}
                  </span>
                </div>
              </div>
            </div>

            {user.role === "seeker" && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 w-full">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                  Job Seeker Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Skills</span>
                    <span className="font-medium text-gray-800">
                      {user.skills?.join(", ") || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Experience</span>
                    <span className="font-medium text-gray-800">
                      {user.experience || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {user.role === "seeker" && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 w-full">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                  Your Applications
                </h2>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    You haven't applied to any jobs yet.
                  </p>
                  <Button
                    variant="link"
                    className="font-medium text-blue-600 hover:underline"
                    onClick={() => router.push("/jobs")}
                  >
                    Browse available jobs
                  </Button>
                </div>
              </div>
            )}
          </div>

          {user.role === "company" && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 w-full">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Company Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Company Name</span>
                  <span className="font-medium text-gray-800">
                    {user.companyName || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Industry</span>
                  <span className="font-medium text-gray-800">
                    {user.industry || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-800">
                    {user.location || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {user.role === "company" && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 w-full">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Your Job Postings
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You haven't posted any jobs yet.
                </p>
                <Button
                  variant="link"
                  className="font-medium text-blue-600 hover:underline"
                  onClick={() => router.push("/dashboard/post-job")}
                >
                  Create your first job post
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
