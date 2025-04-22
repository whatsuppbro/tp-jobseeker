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
  image_url: string;
  company: {
    company_name: string;
    company_description: string;
    company_website: string;
    company_email: string;
    company_phone: string;
    company_address: string;
    company_city: string;
    company_country: string;
    image_url: string;
  };
  applications: {
    id: string;
    user_id: string;
    name: string;
    email: string;
    status: "pending" | "accepted" | "rejected";
  }[];
}

export default async function JobDetail({
  role,
  params,
}: {
  params: { id: string };
  role: string;
}) {
  const userRole = role;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}`
    );
    if (!response.ok) return redirect("/#");
    const jobData = await response.json();
    const job: Job = jobData.data;

    const pendingUserIds = job.applications
      .filter((app) => app.status === "pending")
      .map((app) => app.user_id);

    return (
      <div className="container mx-auto px-4 py-12 space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center space-y-4">
              <img
                src={job.image_url || "https://picsum.photos/1000"}
                alt={job.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            </CardTitle>
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
            <div>
              <strong>Website:</strong>
              <a
                href={job.company.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline ml-2"
              >
                View Website
              </a>
            </div>
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
        {userRole === "seeker" && (
          <ApplyButton jobId={job.id} applications={job.applications} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching job details:", error);
    return redirect("/#");
  }
}
