"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
}

const userSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Setting() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser.id;
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setUser(data.data);
          } else {
            toast.error(data.message || "Failed to fetch user data");
          }
        } catch (error) {
          toast.error("An error occurred while fetching user data");
        }
      }
    };

    fetchUser();
  }, []);

  const handleUpdateInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const formData = {
        firstname: e.currentTarget.firstname.value,
        lastname: e.currentTarget.lastname.value,
        email: e.currentTarget.email.value,
      };

      const validationResult = userSchema.safeParse(formData);
      if (!validationResult.success) {
        validationResult.error.errors.forEach((err) => {
          toast.error(err.message);
        });
        setIsSaving(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/information/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Personal information updated successfully");
      } else {
        toast.error(result.message || "Failed to update personal information");
      }
    } catch (error) {
      toast.error("An error occurred while updating personal information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdatingPassword(true);
    try {
      const formData = {
        currentPassword: e.currentTarget.currentPassword.value,
        newPassword: e.currentTarget.newPassword.value,
        confirmPassword: e.currentTarget.confirmPassword.value,
      };

      const validationResult = passwordSchema.safeParse(formData);
      if (!validationResult.success) {
        validationResult.error.errors.forEach((err) => {
          toast.error(err.message);
        });
        setIsUpdatingPassword(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/password/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            password: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Password updated successfully");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/signin");
      } else {
        toast.error(result.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred while updating password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Account deleted successfully");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/");
      } else {
        toast.error(result.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred while deleting your account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <form onSubmit={handleUpdateInfo} className="space-y-8">
        <div className="bg-white rounded-xl shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                First Name
              </label>
              <Input
                name="firstname"
                defaultValue={user?.firstname || ""}
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Name
              </label>
              <Input
                name="lastname"
                defaultValue={user?.lastname || ""}
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email Address
              </label>
              <Input
                name="email"
                defaultValue={user?.email || ""}
                placeholder="Email"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button type="submit" className="w-full md:w-auto">
            {isSaving ? "Updating..." : "Update Personal Info"}
          </Button>
        </div>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-8 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Current Password
              </label>
              <Input
                name="currentPassword"
                type="password"
                placeholder="Current Password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                New Password
              </label>
              <Input
                name="newPassword"
                type="password"
                placeholder="New Password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Confirm New Password
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button type="submit" className="w-full md:w-auto">
            {isUpdatingPassword ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </form>

      <div className="mt-8 bg-red-50 rounded-xl shadow-md p-6 border border-red-200">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-4">
          Deleting your account is permanent and cannot be undone. All your data
          will be removed.
        </p>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          className="w-full md:w-auto"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>
  );
}
