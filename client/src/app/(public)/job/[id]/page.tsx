import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ApplyButtonWrapper from "@/components/ApplyButton";
import { JobwithCompany } from "@/types/type";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function JobDetail({
  params,
}: {
  params: { id: string };
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}`
    );
    if (!response.ok) return redirect("/#");
    const jobData = await response.json();
    const job: JobwithCompany = jobData.data;

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

        <ApplyButtonWrapper jobId={job.id} applications={job.applications} />
        <ShowSignUpButtonIfNotLoggedIn />
      </div>
    );
  } catch (error) {
    console.error("Error fetching job details:", error);
    return redirect("/#");
  }
}

function ShowSignUpButtonIfNotLoggedIn() {
  if (typeof window !== "undefined" && !localStorage.getItem("user")) {
    return (
      <div className="flex justify-center mt-8">
        <Link href="/signup">
          <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">
            Sign Up to Apply
          </Button>
        </Link>
      </div>
    );
  }
  return null;
}
