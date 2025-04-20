"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
}

export default function Setting() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        ...formData,
        firstname: parsedUser.firstname || "",
        lastname: parsedUser.lastname || "",
        email: parsedUser.email,
      });
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const isEmailChanged = formData.email !== user.email;
      if (isEmailChanged && !formData.currentPassword) {
        toast.error("Current password is required to update email.");
        return;
      }

      const isPasswordChanged = formData.newPassword.trim() !== "";
      if (isPasswordChanged) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }
        if (!formData.currentPassword) {
          toast.error("Current password is required to update password.");
          return;
        }
      }

      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            currentPassword: formData.currentPassword,
          }),
        }
      );

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile.");
      }

      if (isPasswordChanged) {
        const passwordResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/change-password`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
            }),
          }
        );

        if (!passwordResponse.ok) {
          throw new Error("Failed to update password.");
        }
      }

      const updatedUser = {
        ...user,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error("Update failed. Check your inputs and try again.");
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold">Sign In Required</h1>
        <p className="text-gray-600">Please sign in to access settings.</p>
        <Button onClick={() => router.push("/signin")} size="lg">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                First Name
              </label>
              <Input
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Name
              </label>
              <Input
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email Address
              </label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Current Password (required for email changes)
              </label>
              <Input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Current Password"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                New Password
              </label>
              <Input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
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
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
