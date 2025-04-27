"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { JobApplication } from "@/types/type";

export default function ApplicationsDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job_id");
  const [job, setJob] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        toast.error("No job ID provided.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`
        );
        if (!response.ok) throw new Error("Failed to fetch job details");
        const jobData = await response.json();

        const jobWithApplications = {
          ...jobData.data,
          applications: jobData.data.applications || [],
        };

        setJob(jobWithApplications);
      } catch (error) {
        toast.error("Error fetching job details.");
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: jobId,
            user_id: job?.applications.find(
              (application) => application.id === applicationId
            )?.user.id,
            status,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update application status");

      setJob((prevJob) => {
        if (!prevJob) return prevJob;

        return {
          ...prevJob,
          applications: prevJob.applications.map((application) =>
            application.id === applicationId
              ? { ...application, status }
              : application
          ),
        };
      });

      toast.success(
        `Application ${
          status === "accepted" ? "accepted" : "rejected"
        } successfully.`
      );
      window.location.reload();
    } catch (error) {
      toast.error("Error updating application status.");
      console.error("Error updating application status:", error);
    }
  };

  const handleDeleteJob = async () => {
    if (!job) return;

    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete job");

      toast.success("Job deleted successfully.");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error deleting job.");
      console.error("Error deleting job:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-center">Job Not Found</h1>
        <Button onClick={() => router.push("/dashboard")} size="lg">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Job Details</h2>
        <div className="space-y-4">
          <img
            src={job.image_url || "https://picsum.photos/1000"}
            alt={job.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <p>
            <strong>Title:</strong> {job.title}
          </p>
          <p>
            <strong>Description:</strong> {job.description}
          </p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Salary:</strong> {job.salary}
          </p>
          <p>
            <strong>Job Type:</strong> {job.job_type}
          </p>
          <p>
            <strong>Company:</strong> {job.company.company_name}
          </p>
        </div>
        <div className="mt-6 flex gap-4">
          <Button
            variant="destructive"
            onClick={handleDeleteJob}
            className="cursor-pointer"
          >
            Delete Job
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="cursor-pointer"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Applications</h2>
        {job?.applications?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {job.applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="capitalize">
                    {`${application.user.firstname} ${application.user.lastname}`}
                  </TableCell>
                  <TableCell>{application.user.email}</TableCell>
                  <TableCell>{application.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        router.push(
                          `/dashboard/application/${application.user.id}`
                        )
                      }
                    >
                      <Search />
                    </Button>
                  </TableCell>
                  <TableCell>
                    {application.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateApplicationStatus(
                              application.id,
                              "accepted"
                            )
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleUpdateApplicationStatus(
                              application.id,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No applications yet.</p>
        )}
      </div>
    </div>
  );
}
