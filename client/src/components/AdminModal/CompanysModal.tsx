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
import { Edit, Trash, CheckCircle2 } from "lucide-react";
import { Company } from "@/types/type";
import { Separator } from "@/components/ui/separator";

interface ModalProps {
  Id: string;
  Data: Company;
}

export default function CompanyModal({ Id, Data }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: Data.company_name,
    company_email: Data.company_email,
    company_phone: Data.company_phone,
    company_website: Data.company_website,
    company_description: Data.company_description,
    company_address: Data.company_address,
    company_city: Data.company_city,
    company_country: Data.company_country,
    is_verified: Data.is_verified,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/${Id}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_verified: true,
            verified_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify company");
      }

      toast.success("Company verified successfully!");
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error verifying company:", error);
      toast.error("Failed to verify company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/${Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update company");
      }

      toast.success("Company updated successfully!");
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/${Id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success(" deleted successfully");
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
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="company_name"
            placeholder="Enter company name"
            value={formData.company_name}
            onChange={handleChange}
          />
          <Input
            name="company_email"
            placeholder="Enter company email"
            value={formData.company_email}
            onChange={handleChange}
          />
          <Input
            name="company_phone"
            placeholder="Enter company phone"
            value={formData.company_phone}
            onChange={handleChange}
          />
          <Input
            name="company_website"
            placeholder="Enter company website"
            value={formData.company_website}
            onChange={handleChange}
          />
          <Input
            name="company_description"
            placeholder="Enter company description"
            value={formData.company_description}
            onChange={handleChange}
          />
          <Input
            name="company_address"
            placeholder="Enter company address"
            value={formData.company_address}
            onChange={handleChange}
          />
          <Input
            name="company_city"
            placeholder="Enter company city"
            value={formData.company_city}
            onChange={handleChange}
          />
          <Input
            name="company_country"
            placeholder="Enter company country"
            value={formData.company_country}
            onChange={handleChange}
          />

          <div className="flex justify-between gap-2">
            {!formData.is_verified && (
              <Button
                type="button"
                onClick={handleVerify}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify Company
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Update"}
            </Button>
          </div>
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
