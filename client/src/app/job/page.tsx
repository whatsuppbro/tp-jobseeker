"use client";
import SearchFilter from "@/components/SearchFilter/SearchFilter";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Page() {
  const [filters, setFilters] = useState({
    keyword: "",
    jobType: "All",
    location: "All",
  });

  const [jobs, setJobs] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs`
        );
        if (!jobsResponse.ok) throw new Error("Failed to fetch jobs");
        const jobsData = await jobsResponse.json();

        const extractedJobTypes = [
          ...new Set(
            jobsData.data.map((job: { job_type: string }) => job.job_type)
          ),
        ] as string[];

        setJobs(jobsData.data || []);
        setJobTypes(extractedJobTypes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const locations = [...new Set(jobs.map((job) => job.location))];

  const filteredJobs = jobs.filter((job) => {
    const matchesKeyword =
      filters.keyword === "" ||
      (job.title?.toLowerCase() || "").includes(
        filters.keyword.toLowerCase()
      ) ||
      (job.description?.toLowerCase() || "").includes(
        filters.keyword.toLowerCase()
      );

    const matchesJobType =
      filters.jobType === "All" || job.job_type === filters.jobType;

    const matchesLocation =
      filters.location === "All" ||
      (job.location?.toLowerCase() || "") === filters.location.toLowerCase();

    return matchesKeyword && matchesJobType && matchesLocation;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto px-4 py-8 bg-gradient-to-r from-green-700/65 to-emerald-600 w-full">
        <SearchFilter
          jobTypes={jobTypes}
          locations={locations}
          onSearch={(newFilters) => {
            setFilters({
              keyword: newFilters.keyword,
              jobType: newFilters.jobType,
              location: newFilters.location,
            });
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {currentJobs.length > 0 ? (
          <ul className="space-y-4">
            {currentJobs.map((job) => (
              <Link href={`/job/${job.id}`} key={job.id}>
                <Card className="hover:bg-muted transition-colors duration-300 my-4 shadow-md rounded-lg cursor-pointer gap-0">
                  <div className="px-6">
                    <CardHeader className=" flex flex-col items-start justify-between p-4">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        <img
                          src={
                            job.company.image_url ||
                            "https://png.pngtree.com/png-clipart/20230926/original/pngtree-unknown-user-warning-black-glyph-icon-digital-design-logo-vector-png-image_12785034.png"
                          }
                          alt={`${job.company.company_name} logo`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <h1 className="text-2xl text-black">{job.title}</h1>
                      </CardTitle>
                    </CardHeader>
                  </div>
                  <CardDescription className="text-sm px-6 text-gray-600">
                    <div className="flex justify-between items-center px-4">
                      <span className="text-sm text-gray-900 ">
                        {job.description}
                      </span>
                    </div>
                  </CardDescription>
                  <CardContent className="flex flex-col justify-between h-full">
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-900">
                          Company: {job.company.company_name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-green-600 font-medium"
                        >
                          ${job.salary}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-900">
                          {job.location}
                        </span>
                        <span className="text-sm text-gray-900">
                          Type: {job.job_type}
                        </span>
                      </div>
                    </div>{" "}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No jobs found.</p>
        )}

        <Pagination>
          <PaginationContent className="cursor-pointer">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {Array.from(
              { length: Math.ceil(filteredJobs.length / jobsPerPage) },
              (_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    isActive={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(filteredJobs.length / jobsPerPage)
                    )
                  )
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
