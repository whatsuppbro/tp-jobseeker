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
import { Edit } from "lucide-react";

interface ExperienceModalProps {
  seekerId: string;
  experience?: {
    id: string;
    company_name: string;
    position: string;
    experience_years: string;
    description: string;
  };
  onExperienceUpdated?: () => void;
}

export default function ExperienceModal({
  seekerId,
  experience,
  onExperienceUpdated,
}: ExperienceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: experience?.company_name || "",
    position: experience?.position || "",
    years: experience?.experience_years || "",
    description: experience?.description || "",
  });

  if (!seekerId) {
    return (
      <div className="text-red-500">
        Personal Information is required to manage experience.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = experience ? "PUT" : "POST";
      const url = experience
        ? `${process.env.NEXT_PUBLIC_API_URL}/experience/${experience.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/experience/seeker/${seekerId}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seeker_id: seekerId,
          company_name: formData.company,
          position: formData.position,
          experience_years: formData.years,
          description: formData.description,
        }),
      });

      if (!response.ok) throw new Error("Operation failed");

      toast.success(experience ? "Experience updated" : "Experience added");
      setIsOpen(false);
      onExperienceUpdated?.();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {experience ? (
          <button className="text-blue-600 hover:underline flex items-center gap-1  cursor-pointer ml-2 text-sm">
            <Edit size={16} /> Edit
          </button>
        ) : (
          <Button>Add Experience</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{experience ? "Edit" : "Add"} Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            placeholder="Company Name"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            disabled={isLoading}
            required
          />
          <Input
            placeholder="Position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            disabled={isLoading}
            required
          />
          <Input
            placeholder="Years of Experience"
            value={formData.years}
            onChange={(e) =>
              setFormData({ ...formData, years: e.target.value })
            }
            disabled={isLoading}
            type="number"
            required
          />
          <Input
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : experience ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
