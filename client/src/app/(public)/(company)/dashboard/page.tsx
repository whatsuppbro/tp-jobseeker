"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Company, Job } from "@/types/type";

export default function Dashboard() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    job_type: "",
    image_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          toast.error("No user data found. Redirecting to sign-in.");
          router.push("/signin");
          return;
        }
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== "company") {
          toast.error("Access denied: Not a company account.");
          return;
        }
        const companyId = parsedUser.id;
        const fetchCompanyData = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/company/user/${companyId}`
        );
        if (!fetchCompanyData.ok) {
          throw new Error("Failed to fetch company data");
        }
        const companyInfoData = await fetchCompanyData.json();
        console.log("Company Info Data:", companyInfoData);

        const companyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/company/user/${companyId}`
        );
        if (!companyResponse.ok) {
          throw new Error("Failed to fetch company data");
        }
        const companyData = await companyResponse.json();
        setCompany(companyData.data);

        const jobsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/company/${companyInfoData.data.id}`
        );
        if (!jobsResponse.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const jobsData = await jobsResponse.json();
        setJobs(
          jobsData.data.map((job: Job) => ({
            ...job,
            applications: job.applications || [],
          }))
        );
      } catch (error) {
        toast.error(
          "Error fetching dashboard data. " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newJob,
          company_id: company.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to post job");

      await response.json();
      setNewJob({
        title: "",
        description: "",
        location: "",
        salary: "",
        job_type: "",
        image_url: "",
      });

      toast.success("Job posted successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Error posting job.");
      console.error("Error posting job:", error);
    }
  };

  const handleViewApplications = (jobId: string) => {
    router.push(`/dashboard/application?job_id=${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-center">
          Welcome to JobTP
        </h1>
        <p className="max-w-md text-center text-gray-600">
          Create company to view dashboard.
        </p>
        <Button onClick={() => router.push("/details/edit")} size="lg">
          Create Company
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Company Details</h2>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {company.company_name}
          </p>

          <p>
            <strong>Description:</strong> {company.company_description}
          </p>
          <div>
            <strong>Website:</strong>
            <a
              href={company.company_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-2"
            >
              View Website
            </a>
          </div>
          <p>
            <strong>Email:</strong> {company.company_email}
          </p>
          <p>
            <strong>Phone:</strong> {company.company_phone}
          </p>
          <p>
            <strong>Address:</strong> {company.company_address},{" "}
            {company.company_city}, {company.company_country}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Post a New Job</h2>
        <form onSubmit={handlePostJob} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Title
            </label>
            <Input
              name="title"
              value={newJob.title}
              onChange={handleInputChange}
              placeholder="Job Title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Image URL
            </label>
            <Input
              type="url"
              name="image_url"
              value={newJob.image_url}
              onChange={handleInputChange}
              placeholder="image url (e.g., https://example.com/image.jpg)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Description
            </label>
            <Textarea
              name="description"
              value={newJob.description}
              onChange={handleInputChange}
              placeholder="Job Description"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Location
            </label>
            <Input
              name="location"
              value={newJob.location}
              onChange={handleInputChange}
              placeholder="Job Location"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Salary
            </label>
            <Input
              type="number"
              name="salary"
              value={newJob.salary}
              onChange={handleInputChange}
              placeholder="Salary (e.g., $5000)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Job Type
            </label>
            <Input
              name="job_type"
              value={newJob.job_type}
              onChange={handleInputChange}
              placeholder="Job Type (e.g., Full-Time, Part-Time)"
              required
            />
          </div>
          <Button type="submit" className="cursor-pointer">
            Post Job
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Posted Jobs</h2>
        {jobs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    {job.applications?.length || 0} Applications
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplications(job.id)}
                    >
                      View Applications
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}
