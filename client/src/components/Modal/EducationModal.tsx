import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
          <button className="text-blue-600 hover:underline flex items-center gap-1  cursor-pointer ml-2 text-sm">
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
          <Input
            type="text"
            placeholder="School Name"
            value={formData.school_name}
            onChange={(e) =>
              setFormData({ ...formData, school_name: e.target.value })
            }
            required
          />
          <Input
            type="text"
            placeholder="Degree"
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
            required
          />
          <Input
            type="text"
            placeholder="Field of Study"
            value={formData.field_of_study}
            onChange={(e) =>
              setFormData({ ...formData, field_of_study: e.target.value })
            }
            required
          />

          <DatePicker
            selected={
              formData.start_date ? new Date(formData.start_date) : null
            }
            onChange={(date) => {
              const formattedDate = date ? format(date, "dd MMMM, yyyy") : "";
              setFormData({ ...formData, start_date: formattedDate });
            }}
          />
          <DatePicker
            selected={formData.end_date ? new Date(formData.end_date) : null}
            onChange={(date) => {
              const formattedDate = date ? format(date, "dd MMMM, yyyy") : "";
              setFormData({ ...formData, end_date: formattedDate });
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
