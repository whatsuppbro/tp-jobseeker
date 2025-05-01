"use client";
import { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface SearchFilterProps {
  jobTypes: string[];
  locations: string[];
  onSearch: (filters: {
    keyword: string;
    jobType: string;
    location: string;
    minSalary: string;
    maxSalary: string;
  }) => void;
}

const MIN_SALARY_RANGES = [
  { value: "", label: "All" },
  { value: "0", label: "0" },
  { value: "10000", label: "10K" },
  { value: "20000", label: "20K" },
  { value: "50000", label: "50K" },
  { value: "100000", label: "100K" },
  { value: "200000", label: "200K" },
];

const MAX_SALARY_RANGES = [
  { value: "", label: "All" },
  { value: "10000", label: "10K" },
  { value: "20000", label: "20K" },
  { value: "50000", label: "50K" },
  { value: "100000", label: "100K" },
  { value: "200000", label: "200K" },
];

export default function SearchFilter({
  jobTypes,
  locations,
  onSearch,
}: SearchFilterProps) {
  const [keyword, setKeyword] = useState("");
  const [jobType, setJobType] = useState("All");
  const [location, setLocation] = useState("All");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedMinSalary, setSelectedMinSalary] = useState("0");
  const [selectedMaxSalary, setSelectedMaxSalary] = useState("200k");

  const debouncedKeyword = useDebounce(keyword, 500);

  const handleSalaryChange = (type: 'min' | 'max', value: string, label: string) => {
    if (type === 'min') {
      setMinSalary(value);
      setSelectedMinSalary(label);
    } else {
      setMaxSalary(value);
      setSelectedMaxSalary(label);
    }
    
    onSearch({
      keyword: debouncedKeyword,
      jobType,
      location,
      minSalary: type === 'min' ? value : minSalary,
      maxSalary: type === 'max' ? value : maxSalary,
    });
  };

  const handleSearch = () => {
    onSearch({ 
      keyword: debouncedKeyword, 
      jobType, 
      location,
      minSalary,
      maxSalary 
    });
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedKeyword]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="keyword" className="block mb-2 text-base font-medium text-white">
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
          <Label htmlFor="jobType" className="block mb-2 text-base font-medium text-white">
            Filter by Job Type
          </Label>
          <Select value={jobType} onValueChange={(value) => setJobType(value)}>
            <SelectTrigger className="w-full bg-white flex items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground cursor-pointer">
              <SelectValue placeholder="Select a job type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all-jobType" value="All" className="cursor-pointer">
                All
              </SelectItem>
              {jobTypes.map((type, index) => (
                <SelectItem key={index} value={type} className="cursor-pointer">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="location" className="block mb-2 text-base font-medium text-white">
            Filter by Location
          </Label>
          <Combobox
            value={location}
            onValueChange={(value) => setLocation(value)}
            options={["All", ...locations]}
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

      <div className="flex justify-end items-center gap-4 relative">
        {showMoreOptions && (
          <div className="absolute right-[146px] flex gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-[130px] bg-transparent text-white border-white justify-between rounded-full text-sm h-9 px-3 hover:bg-white/20 cursor-pointer"
                  >
                    Paying ฿{selectedMinSalary}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[130px]">
                  {MIN_SALARY_RANGES.map((range) => (
                    <DropdownMenuItem
                      key={range.value}
                      onClick={() => handleSalaryChange('min', range.value, range.label)}
                      className="text-sm cursor-pointer"
                    >
                      {range.label === "All" ? "All" : `${range.label}`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-[130px] bg-transparent text-white border-white justify-between rounded-full text-sm h-9 px-3 hover:bg-white/20 cursor-pointer"
                  >
                    To ฿{selectedMaxSalary}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[130px]">
                  {MAX_SALARY_RANGES.map((range) => (
                    <DropdownMenuItem
                      key={range.value}
                      onClick={() => handleSalaryChange('max', range.value, range.label)}
                      className="text-sm cursor-pointer"
                    >
                      {range.label === "All" ? "All" : `${range.label}`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="text-white hover:text-white hover:bg-white/20 flex items-center gap-2 px-3 min-w-[140px] cursor-pointer"
        >
          {showMoreOptions ? "Hide Options" : "More Options"}
          <SlidersHorizontal size={16} />
        </Button>
      </div>
    </div>
  );
}
