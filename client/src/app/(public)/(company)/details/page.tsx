"use client";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/type";
import CompanyVerification from "@/components/CompanyVerification";

export default function Details() {
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

        if (parsedUser.role === "seeker") {
          redirect("/profile");
        }

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
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === "seeker") {
        redirect("/profile");
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
    `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Company";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="capitalize">{displayName}</span>,
            <p className="text-xl font-bold">
              Agency of,{" "}
              <span className="capitalize">
                {user.company?.company_name || "Company name"}
              </span>
              !
            </p>
          </h1>

          <Button
            onClick={() => router.push("/details/edit")}
            variant="outline"
          >
            Edit Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProfileSection title="Company Information">
              <div className="mb-4 flex justify-center items-center">
                <InfoRow
                  label=""
                  value={
                    user.company?.image_url ? (
                      <img
                        src={user.company.image_url}
                        alt="image"
                        className="w-40 h-40 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                      />
                    ) : (
                      "Image not found"
                    )
                  }
                />
              </div>
              <InfoRow
                label="Company Name"
                value={user.company?.company_name || "Company name"}
              />
              <InfoRow label="Email Address" value={user.email} />
            </ProfileSection>

            <ProfileSection title="About Your Company">
              <InfoRow
                label="Description"
                value={
                  user.company?.company_description ||
                  "No description added yet"
                }
              />
              <InfoRow
                label="Company Email"
                value={
                  user.company?.company_email || "No description added yet"
                }
              />
              <InfoRow
                label="Company Phone Number"
                value={user?.company?.company_phone || "Not provided"}
              />
              <InfoRow
                label="Company Address"
                value={user?.company?.company_address || "Not provided"}
              />
              <InfoRow
                label="Company City"
                value={user?.company?.company_city || "Not provided"}
              />
              <InfoRow
                label="Company Country"
                value={user?.company?.company_country || "Not provided"}
              />
              <InfoRow
                label="Company Website"
                value={
                  user?.company?.company_website ? (
                    <a
                      href={user.company?.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Website
                    </a>
                  ) : (
                    "Not provided"
                  )
                }
              />
            </ProfileSection>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ProfileSection
              title="Profile Strength"
              headerContent={
                <CompanyVerification companyId={user.company?.id || ""} />
              }
            >
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{ width: `${calculateProfileCompleteness(user)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Complete your profile to increase visibility to job seekers.
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
  headerContent,
}: {
  title: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {headerContent && <div>{headerContent}</div>}
      </div>
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
  if (user?.company?.company_address) completeFields++;
  if (user?.company?.company_phone) completeFields++;
  if (user?.company?.company_address) completeFields++;
  if (user?.company?.company_city) completeFields++;
  if (user?.company?.company_description) completeFields++;
  return Math.round((completeFields / 6) * 100);
}
