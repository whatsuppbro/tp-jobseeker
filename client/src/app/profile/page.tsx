"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
  skills?: string[];
  experience?: string;
  phonenumber?: string;
  address?: string;
  city?: string;
  resume?: string;
  company_name?: string;
  position?: string;
  description?: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) return;

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        const [userResponse, seekerResponse, experienceRes] = await Promise.all(
          [
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/seeker/user/${userId}`),
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/experience/user/${userId}`
            ),
          ]
        );

        if (!userResponse.ok || !seekerResponse.ok)
          throw new Error("Failed to fetch data");

        const [userDataResponse, seekerDataResponse, experienceData] =
          await Promise.all([
            userResponse.json(),
            seekerResponse.json(),
            experienceRes.json(),
          ]);

        const completeUserData: User = {
          ...userDataResponse.data,
          phonenumber: seekerDataResponse.data.phonenumber || null,
          address: seekerDataResponse.data.address || null,
          city: seekerDataResponse.data.city || null,
          resume: seekerDataResponse.data.resume || null,
          company_name: experienceData.data.company_name || null,
          position: experienceData.data.position || null,
          description: experienceData.data.description || null,
        };

        setUser(completeUserData);

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
    if (user?.role === "company") router.push("/dashboard");
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Guest";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="capitalize">{displayName}</span>!
          </h1>
          <Button
            onClick={() => router.push("/profile/edit")}
            variant="outline"
          >
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Section */}
            <ProfileSection title="Personal Information">
              <InfoRow
                label="Full Name"
                value={displayName || "Not provided"}
              />
              <InfoRow label="Email Address" value={user.email} />
              <InfoRow
                label="Phone Number"
                value={user.phonenumber || "Not provided"}
              />
              <InfoRow label="Address" value={user.address || "Not provided"} />
              <InfoRow label="City" value={user.city || "Not provided"} />
              <InfoRow
                label="Resume"
                value={
                  user.resume ? (
                    <a
                      href={user.resume}
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

            {/* Skills & Experience Section */}
            <ProfileSection title="Skills & Experience">
              <InfoRow
                label="Skills"
                value={
                  user.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <span key={skill} className="badge">
                          {skill}
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
                value={user.company_name || "No experience added yet"}
              />
              <InfoRow
                label="Position"
                value={user.position || "No position added yet"}
              />
              <InfoRow
                label="Description"
                value={user.description || "No description added yet"}
              />
            </ProfileSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileSection title="Applications">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">
                  You haven't applied to any jobs yet.
                </p>
                <Button onClick={() => router.push("/jobs")}>
                  Browse Jobs
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
  if (user.skills?.length) completeFields++;
  if (user.experience) completeFields++;
  return Math.round((completeFields / 4) * 100);
}
