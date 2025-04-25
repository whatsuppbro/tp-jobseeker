import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { JobwithCompany } from "@/types/type";
import { Textarea } from "../ui/textarea";

interface ModalProps {
  Id: string;
  Data?: JobwithCompany;
}

export default function JobsModal({ Id, Data }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    job_type: "",
    location: "",
    salary: "",
    image_url: "",
  });

  useEffect(() => {
    if (Data) {
      setFormData({
        title: Data.title || "",
        description: Data.description || "",
        job_type: Data.job_type || "",
        location: Data.location || "",
        salary: Data.salary || "",
        image_url: Data.image_url || "",
      });
    }
  }, [Data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${Id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_id: Data?.company_id || "",
            ...formData,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      toast.success("updated successfully");
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${Id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto mt-2 flex items-center gap-2">
          <Edit size={16} /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Jobs</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="Enter description"
            value={formData.description || ""}
            onChange={handleChange}
          />

          <Input
            name="job_type"
            placeholder="Enter job type"
            value={formData.job_type || ""}
            onChange={handleChange}
          />
          <Input
            name="location"
            placeholder="Enter location"
            value={formData.location || ""}
            onChange={handleChange}
          />
          <Input
            name="salary"
            placeholder="Enter salary"
            type="number"
            value={formData.salary || ""}
            onChange={handleChange}
          />
          <Input
            name="image_url"
            placeholder="Enter image URL"
            value={formData.image_url || ""}
            onChange={handleChange}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </form>
        <Separator className="py-1 rounded-2xl bg-gray-200" />
        <div className="flex justify-end gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash size={16} className="mr-2" /> Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
