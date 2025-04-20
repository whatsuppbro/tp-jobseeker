"use client";
import { Button } from "@/components/ui/button";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
  applications?: [
    {
      id: string;
      job_id: string;
      status: "pending" | "accepted" | "rejected";
      job?: {
        id: string;
        title: string;
        description: string;
        location: string;
        salary: string;
        job_type: string;
      };
    }
  ];
  seeker: {
    phonenumber?: string;
    address?: string;
    city?: string;
    resume_url?: string;
    experience?: {
      company_name?: string;
      position?: string;
      description?: string;
    };
    skills?: {
      id?: string;
      name?: string;
    }[];
  };
  company_name?: string;
  position?: string;
  description?: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          setError("User data not found. Please log in.");
          return;
        }

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userDataResponse = await userResponse.json();

        const completeUserData: User = {
          ...userDataResponse.data,
        };

        setUser(completeUserData);
      } catch (err: any) {
        console.error("Error:", err.message);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === "company") {
        redirect("/details");
      }
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-3xl font-extrabold text-center text-red-500">
          Error
        </h1>
        <p className="max-w-md text-center text-gray-600">{error}</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-center">
          Welcome to JobTP
        </h1>
        <p className="max-w-md text-center text-gray-600">
          Sign in to view or create your professional profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => router.push("/signin")} size="lg">
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            variant="outline"
            size="lg"
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  const displayName =
    `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Seeker";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="capitalize">{displayName}</span>!
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/profile/edit")}
              variant="outline"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProfileSection title="Personal Information">
              <InfoRow
                label="Full Name"
                value={displayName || "Not provided"}
              />
              <InfoRow label="Email Address" value={user.email} />
              <InfoRow
                label="Phone Number"
                value={user.seeker?.phonenumber || "Not provided"}
              />
              <InfoRow
                label="Address"
                value={user.seeker?.address || "Not provided"}
              />
              <InfoRow
                label="City"
                value={user.seeker?.city || "Not provided"}
              />
              <InfoRow
                label="Resume"
                value={
                  user.seeker?.resume_url ? (
                    <a
                      href={user.seeker.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    "Not provided"
                  )
                }
              />
            </ProfileSection>

            <ProfileSection title="Skills & Experience">
              <InfoRow
                label="Skills"
                value={
                  user.seeker?.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {user.seeker.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 ease-in-out"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Not specified"
                  )
                }
              />

              <InfoRow
                label="Experience"
                value={
                  user.seeker?.experience?.company_name ||
                  "No experience added yet"
                }
              />

              <InfoRow
                label="Position"
                value={
                  user.seeker?.experience?.position || "No position added yet"
                }
              />

              <InfoRow
                label="Description"
                value={
                  user.seeker?.experience?.description ||
                  "No description added yet"
                }
              />
            </ProfileSection>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ProfileSection title="Applications">
              {user.applications && user.applications.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Applications</h3>
                  {user.applications
                    .filter(
                      (application) =>
                        application.status === "accepted" ||
                        application.status === "pending"
                    )
                    .map((application) => (
                      <Link
                        key={application.id}
                        href={`/job/${application.job_id}`}
                        className="block p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition"
                      >
                        <h3 className="text-lg font-semibold">
                          {application.job?.title || "Job Title Not Available"}
                        </h3>
                        <p className="text-gray-600">
                          {application.job?.description || "No description"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <span
                            className={
                              application.status === "accepted"
                                ? "text-green-500"
                                : "text-yellow-500"
                            }
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </span>
                        </p>
                      </Link>
                    ))}
                  {user.applications.filter(
                    (app) =>
                      app.status === "accepted" || app.status === "pending"
                  ).length === 0 && (
                    <p className="text-gray-500 text-center">
                      No applications to display.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center p-4  rounded-lg">
                  <p className="text-gray-500 mb-4">
                    You haven't applied to any jobs yet.
                  </p>
                  <Button onClick={() => router.push("/job")}>
                    Browse Jobs
                  </Button>
                </div>
              )}
              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => router.push("/applied-jobs")}
                  variant="outline"
                >
                  Applied Jobs
                </Button>
                <Button
                  onClick={() => router.push("/saved-jobs")}
                  variant="outline"
                >
                  Saved Jobs
                </Button>
              </div>
            </ProfileSection>

            <ProfileSection title="Profile Strength">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{ width: `${calculateProfileCompleteness(user)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Complete your profile to increase visibility to employers.
              </p>
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-lg text-gray-900">{value}</span>
    </div>
  );
}

function calculateProfileCompleteness(user: User): number {
  let completeFields = 1;
  if (user.firstname || user.lastname) completeFields++;
  if (user.seeker?.skills?.length) completeFields++;
  if (user.seeker?.experience?.company_name) completeFields++;
  if (user.seeker?.phonenumber) completeFields++;
  if (user.seeker?.address) completeFields++;
  if (user.seeker?.city) completeFields++;
  if (user.seeker?.resume_url) completeFields++;
  return Math.round((completeFields / 8) * 100);
}
