"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useDebounce from "./useDebounce";
import Combobox from "../Combobox";

interface SearchFilterProps {
  categories: string[];
  locations: string[];
  onSearch: (filters: {
    keyword: string;
    category: string;
    location: string;
  }) => void;
}

export default function SearchFilter({
  categories,
  locations,
  onSearch,
}: SearchFilterProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const debouncedKeyword = useDebounce(keyword, 500);

  const handleSearch = () => {
    onSearch({ keyword: debouncedKeyword, category, location });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl mx-auto p-4">
      <div className="flex-1">
        <Label htmlFor="keyword" className="block mb-2 text-sm font-medium">
          Search by Title or Description
        </Label>
        <Input
          id="keyword"
          placeholder="Enter keywords..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full bg-white flex items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex-1">
        <Label htmlFor="category" className="block mb-2 text-sm font-medium">
          Filter by Category
        </Label>
        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-full bg-white flex items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground">
            <SelectValue placeholder="Select a category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat, index) => (
              <SelectItem key={index} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="location" className=" block mb-2 text-sm font-medium">
          Filter by Location
        </Label>
        <Combobox
          value={location}
          onValueChange={(value) => setLocation(value)}
          options={locations}
          placeholder="Enter a location..."
        />
      </div>

      <div className="flex items-end">
        <Button
          onClick={handleSearch}
          className="mt-6 w-full md:w-auto cursor-pointer"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
