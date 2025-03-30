"use client";
import SearchFilter from "../components/SearchFilter/SearchFilter";
import { useState } from "react";
import jobs from "@/mock/jobs.json";
import categories from "@/mock/categories.json";

export default function Page() {
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    location: "",
  });

  const categoryNames = categories.map((cat) => cat.name);
  const locations = [...new Set(jobs.map((job) => job.location))];

  const filteredJobs = jobs.filter((job) => {
    const matchesKeyword =
      filters.keyword === "" ||
      job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.keyword.toLowerCase());

    const matchesCategory =
      filters.category === "" ||
      job.category_id ===
        categories.find((cat) => cat.name === filters.category)?.category_id;

    const matchesLocation =
      filters.location === "" ||
      job.location.toLowerCase() === filters.location.toLowerCase();

    return matchesKeyword && matchesCategory && matchesLocation;
  });

  const handleSearch = (newFilters: {
    keyword: string;
    category: string;
    location: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto px-4 py-8 bg-green-700/65 w-full ">
        <SearchFilter
          categories={categoryNames}
          locations={locations}
          onSearch={handleSearch}
        />
      </div>
      <div className="max-w-6xl mx-auto p-4">
        {filteredJobs.length > 0 ? (
          <ul className="space-y-4">
            {filteredJobs.map((job) => (
              <li
                key={job.job_id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{job.location}</span>
                  <span className="text-sm font-medium text-green-600">
                    ${job.salary}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No jobs found.</p>
        )}
      </div>
    </div>
  );
}
