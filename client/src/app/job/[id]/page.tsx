import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  job_type: string;
  company: {
    company_name: string;
    company_description: string;
    company_website: string;
    company_email: string;
    company_phone: string;
    company_address: string;
    company_city: string;
    company_country: string;
  };
  applicants: {
    id: string;
    name: string;
    email: string;
    status: "pending" | "accepted" | "rejected";
  }[];
}

export default async function JobDetail({
  params,
}: {
  params: { id: string };
}) {
  let job: Job | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch job details");
    const jobData = await response.json();
    job = jobData.data;
  } catch (err: any) {
    error = err.message;
  }

  const handleApply = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        alert("Please sign in to apply for this job.");
        redirect("/signin");
        return;
      }

      const parsedUser = JSON.parse(userData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: params.id,
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-center">Error</h1>
        <p className="max-w-md text-center text-gray-600">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-center">Job Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>
            Location: {job.location} | Salary: {job.salary}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{job.description}</p>
          <p>
            <strong>Job Type:</strong> {job.job_type}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{job.company.company_name}</CardTitle>
          <CardDescription>About the Company</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{job.company.company_description}</p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={job.company.company_website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {job.company.company_website}
            </a>
          </p>
          <p>
            <strong>Email:</strong> {job.company.company_email}
          </p>
          <p>
            <strong>Phone:</strong> {job.company.company_phone}
          </p>
          <p>
            <strong>Address:</strong> {job.company.company_address},{" "}
            {job.company.company_city}, {job.company.company_country}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <button onClick={handleApply}>Apply for this Job</button>
      </div>
    </div>
  );
}
