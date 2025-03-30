"use client";
import SearchFilter from "../components/SearchFilter/SearchFilter";
import { useState } from "react";
import jobs from "@/mock/jobs.json";
import category from "@/mock/categories.json";

export default function page() {
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    location: "",
  });

  const categories = category.map((categories) => categories.name);
  const locations = jobs.map((job) => job.location);

  const handleSearch = (filters: {
    keyword: string;
    category: string;
    location: string;
  }) => {
    console.log("Search Filters:", filters);
    setFilters(filters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-8">Job Search</h1>
      <SearchFilter
        categories={categories}
        locations={locations}
        onSearch={handleSearch}
      />
    </div>
  );
}
