"use client";
import SearchFilter from "@/components/SearchFilter/SearchFilter";
import { useState, useEffect } from "react";
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5); // Number of jobs per page

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

  // Filter jobs based on applied filters
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

  // Pagination logic
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
                <div className="mb-4">
                  <li
                    key={job.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <h2 className="text-xl font-semibold ">{job.title}</h2>
                    <p className="text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {job.location}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        ${job.salary}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Type: {job.job_type}
                      </span>
                    </div>
                  </li>
                </div>
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
