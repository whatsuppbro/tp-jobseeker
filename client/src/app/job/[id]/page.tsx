import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ApplyButton from "@/components/ApplyButton";

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
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}`
    );
    if (!response.ok) {
      return redirect("/not-found");
    }
    const jobData = await response.json();
    const job: Job = jobData.data;

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
          <ApplyButton jobId={job.id} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching job details:", error);
    return redirect("/error");
  }
}
