"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ApplicationCompany } from "@/types/type";

export default function JobApplied() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          router.push("/signin");
          return;
        }

        const parsedUser = JSON.parse(userData);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applications/user/${parsedUser.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch applications");
        const data = await response.json();
        setApplications(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
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
        <h1 className="text-4xl font-extrabold text-center">Error</h1>
        <p className="max-w-md text-center text-gray-600">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>
      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/job/${app.job.id}`}
                    className="hover:underline text-xl"
                  >
                    {app.job.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm mt-2 ${app.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "accepted"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  {app.applied_at && (
                    <p className="text-sm text-gray-500">
                      Applied on:{" "}
                      {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  <strong>Company:</strong> {app.job.company.company_name}
                </p>
                <p>
                  <strong>Location:</strong> {app.job.location}
                </p>
                <p>
                  <strong>Salary: </strong> 
                  {app.job.salary
                    ? Number(app.job.salary.toString().replace(/,/g, "")).toLocaleString()
                    : "Not specified"}฿
                </p>
                <p>
                  <strong>Type:</strong> {app.job.job_type}
                </p>
                <div className="flex justify-end">
                  <Link href={`/job/${app.job.id}`}>
                    <Button variant="outline">View Job Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">No applications found.</p>
          <Button onClick={() => router.push("/job")} variant="secondary">
            Browse Jobs
          </Button>
        </div>
      )}
    </div>
  );
}
