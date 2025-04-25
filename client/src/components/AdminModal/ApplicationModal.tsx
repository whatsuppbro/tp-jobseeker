import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import { ApplicantionByUser } from "@/types/type";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModalProps {
  Id: string;
  Data: ApplicantionByUser;
}

export default function ApplicationModal({ Id, Data }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: Data.status,
  });

  useEffect(() => {
    if (Data) {
      setFormData({
        status: Data.status,
      });
    }
  }, [Data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${Id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: Data.user_id,
            job_id: Data.job_id,
            status: formData.status,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update user");

      toast.success("User updated successfully");
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
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
          <DialogTitle>Edit Applications</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                status: value as "pending" | "accepted" | "rejected",
              }))
            }
          >
            <SelectTrigger className="w-full" name="status">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </form>
        <Separator className="py-1 rounded-2xl bg-gray-200" />
      </DialogContent>
    </Dialog>
  );
}
