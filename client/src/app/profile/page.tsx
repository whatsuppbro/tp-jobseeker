"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
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
        const responseData = await response.json();
        const completeUserData: User = responseData.data;

        setUser(completeUserData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.role === "company") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const displayName =
    user?.firstname || user?.lastname
      ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
      : "Guest";

  if (!user || user.role === "company") {
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
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Welcome back, <span className="capitalize">{displayName}</span>!
            </h1>
            <p className="text-gray-600">
              Manage your professional profile and applications
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/profile/edit")}
            className="px-8 py-2 hover:bg-gray-50 transition-all border-gray-300"
          >
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">
                    Full Name
                  </span>
                  <span className="text-lg text-gray-900 capitalize">
                    {displayName || "Not provided"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">
                    Email Address
                  </span>
                  <span className="text-lg text-gray-900 break-all">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Skills & Experience
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.length ? (
                      user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">
                    Experience
                  </span>
                  <p className="text-gray-700 leading-relaxed">
                    {user.experience || "No experience added yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Applications
                </h2>
                <span className="text-blue-600 text-sm font-medium">
                  0 Active
                </span>
              </div>

              <div className="space-y-6">
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    You haven't applied to any jobs yet
                  </p>
                  <Button
                    variant="default"
                    className="w-full "
                    onClick={() => router.push("/jobs")}
                  >
                    Browse Jobs
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Quick Actions</h3>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-gray-700"
                    onClick={() => router.push("/jobs?filter=recent")}
                  >
                    <span>🔥</span> View New Postings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-gray-700"
                    onClick={() => router.push("/jobs?filter=remote")}
                  >
                    <span>🏠</span> Remote Opportunities
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Profile Strength
              </h2>
              <div className="space-y-4">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2 transition-all"
                    style={{ width: `${calculateProfileCompleteness(user)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Complete your profile to increase visibility to employers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateProfileCompleteness(user: User): number {
  let completeFields = 1;
  if (user.firstname || user.lastname) completeFields++;
  if (user.skills?.length) completeFields++;
  if (user.experience) completeFields++;
  return Math.round((completeFields / 4) * 100);
}
