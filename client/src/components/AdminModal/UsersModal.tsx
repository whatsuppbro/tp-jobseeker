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
import { User } from "@/types/type";
import { Separator } from "@/components/ui/separator";

interface UserModalProps {
  userId: string;
  userData: User;
}

export default function UserModal({ userId, userData }: UserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        password: "",
        role: userData.role || "seeker",
      });
    }
  }, [userData]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            role: formData.role,
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

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: formData.password,
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

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      toast.success("User deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user. Please try again.");
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
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="firstname"
            placeholder="Enter first name"
            value={formData.firstname}
            onChange={handleChange}
          />
          <Input
            name="lastname"
            placeholder="Enter last name"
            value={formData.lastname}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full p-2 border rounded-md"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="seeker">seeker</option>
            <option value="company">company</option>
          </select>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Update"}
            </Button>
          </div>
        </form>
        <Separator className="py-1 rounded-2xl bg-gray-200" />
        <form onSubmit={handleSubmitPassword} className="space-y-4">
          <Input
            name="password"
            type="password"
            placeholder="Enter new password (leave blank to keep current)"
            value={formData.password}
            onChange={handleSubmitPassword}
          />

          <div className="flex justify-between gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash size={16} className="mr-2" /> Delete
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
