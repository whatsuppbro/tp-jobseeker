import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import { DatePicker } from "../Datepicker";
import { format } from "date-fns";

interface EducationModalProps {
  seekerId: string;
  education?: {
    seeker_id: string;
    school_name: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
  };
  onEducationUpdated?: () => void;
}

export default function EducationModal({
  seekerId,
  education,
  onEducationUpdated,
}: EducationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    school_name: education?.school_name || "",
    degree: education?.degree || "",
    field_of_study: education?.field_of_study || "",
    start_date: education?.start_date || "",
    end_date: education?.end_date || "",
  });

  const schoolDegreeMapping: Record<string, string[]> = {
    "Rangsit University": ["Bachelor's Degree", "Master's Degree"],
    "Bangkok University": ["Bachelor's Degree", "Doctoral Degree"],
    "Chulalongkorn University": ["Master's Degree", "Doctoral Degree"],
    "Thammasat University": ["Bachelor's Degree", "Master's Degree"],
    "Mahidol University": ["Doctoral Degree"],
    "Kasetsart University": ["Master's Degree", "Doctoral Degree"],
  };

  const degreeFieldMapping: Record<string, string[]> = {
    "Bachelor's Degree": [
      "Computer Science",
      "Business Administration",
      "Psychology",
    ],
    "Master's Degree": [
      "Data Science",
      "International Business",
      "Clinical Psychology",
    ],
    "Doctoral Degree": ["Research", "Advanced Studies"],
  };

  const [availableDegrees, setAvailableDegrees] = useState<string[]>(
    education?.school_name && schoolDegreeMapping[education.school_name]
      ? schoolDegreeMapping[education.school_name]
      : []
  );
  const [availableFields, setAvailableFields] = useState<string[]>(
    education?.degree && degreeFieldMapping[education.degree]
      ? degreeFieldMapping[education.degree]
      : []
  );

  if (!seekerId) {
    return (
      <div className="text-red-500">
        Personal Information is required to manage education.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seeker/education/${seekerId}`,
        {
          method: education ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seeker_id: seekerId,
            school_name: formData.school_name,
            degree: formData.degree,
            field_of_study: formData.field_of_study,
            start_date: formData.start_date,
            end_date: formData.end_date,
          }),
        }
      );

      if (!response.ok) throw new Error("Operation failed");

      toast.success(education ? "Education updated" : "Education added");
      setIsOpen(false);
      onEducationUpdated?.();
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {education ? (
          <button className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer ml-2 text-sm">
            <Edit size={16} /> Edit
          </button>
        ) : (
          <Button>Add Education</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{education ? "Edit" : "Add"} Education</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* School Name */}
          <Select
            value={formData.school_name}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                school_name: value,
                degree: "",
                field_of_study: "",
              }));
              setAvailableDegrees(schoolDegreeMapping[value] || []);
              setAvailableFields([]);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select School Name" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(schoolDegreeMapping).map((school, index) => (
                <SelectItem key={index} value={school}>
                  {school}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Degree */}
          <Select
            value={formData.degree}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                degree: value,
                field_of_study: "",
              }));
              setAvailableFields(degreeFieldMapping[value] || []);
            }}
            disabled={!formData.school_name}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Degree" />
            </SelectTrigger>
            <SelectContent>
              {availableDegrees.map((degree, index) => (
                <SelectItem key={index} value={degree}>
                  {degree}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Field of Study */}
          <Select
            value={formData.field_of_study}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, field_of_study: value }))
            }
            disabled={!formData.degree}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Field of Study" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map((field, index) => (
                <SelectItem key={index} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePicker
            selected={
              formData.start_date ? new Date(formData.start_date) : null
            }
            onChange={(date) => {
              const formattedDate = date ? format(date, "dd MMMM, yyyy") : "";
              setFormData((prev) => ({ ...prev, start_date: formattedDate }));
            }}
          />
          <DatePicker
            selected={formData.end_date ? new Date(formData.end_date) : null}
            onChange={(date) => {
              const formattedDate = date ? format(date, "dd MMMM, yyyy") : "";
              setFormData((prev) => ({ ...prev, end_date: formattedDate }));
            }}
          />

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : education ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
