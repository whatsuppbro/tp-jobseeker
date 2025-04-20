"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
  seeker?: {
    id?: string;
    phonenumber?: string;
    address?: string;
    city?: string;
    resume_url?: string;
  };
}

const SeekerFormSchema = z.object({
  phonenumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .or(z.literal("")),
  address: z.string(),
  city: z.string(),
  resume_url: z.union([z.string().url(), z.literal("")]).optional(),
});

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          router.push("/signin");
          return;
        }
        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        console.error("Error:", error);
        if (error instanceof Error) {
          if (error instanceof Error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("An unknown error occurred");
            }
          } else {
            toast.error("An unknown error occurred");
          }
        } else {
          toast.error("An unknown error occurred");
        }
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const keys = name.split(".");
      setUser((prev) => {
        if (!prev) return prev;
        const newState = { ...prev };
        let current: any = newState;
        for (const key of keys.slice(0, -1)) {
          current[key] = { ...current[key] };
          current = current[key];
        }
        current[keys[keys.length - 1]] = value;
        return newState;
      });
    } else {
      setUser((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const seekerFormData = {
        phonenumber: user.seeker?.phonenumber || "",
        address: user.seeker?.address || "",
        city: user.seeker?.city || "",
        resume_url: user.seeker?.resume_url || "",
      };

      const seekerValidation = SeekerFormSchema.safeParse(seekerFormData);
      if (!seekerValidation.success) {
        seekerValidation.error.issues.forEach((issue) => {
          toast.error(issue.message);
        });
        return;
      }

      let seekerId: string;
      if (user.seeker?.id) {
        const seekerResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seeker/${user.seeker.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              phonenumber: user.seeker.phonenumber,
              address: user.seeker.address,
              city: user.seeker.city,
              resume_url: user.seeker.resume_url,
            }),
          }
        );
        if (!seekerResponse.ok) throw new Error("Failed to update seeker");
        seekerId = user.seeker.id;
      } else {
        const seekerResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seeker/user/${user.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              phonenumber: user.seeker?.phonenumber,
              address: user.seeker?.address,
              city: user.seeker?.city,
              resume_url: user.seeker?.resume_url,
            }),
          }
        );
        if (!seekerResponse.ok) throw new Error("Failed to create seeker");
        const seekerData = await seekerResponse.json();
        seekerId = seekerData.data.id;
      }

      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/profile")}
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    First Name
                  </label>
                  <Input
                    name="firstname"
                    value={user?.firstname || ""}
                    onChange={handleInputChange}
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    To change your name or email, go to{" "}
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => router.push("/setting")}
                    >
                      Settings
                    </span>
                    .
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Name
                  </label>
                  <Input
                    name="lastname"
                    value={user?.lastname || ""}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    value={user?.email || ""}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <Input
                    name="seeker.phonenumber"
                    value={user?.seeker?.phonenumber || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <Input
                    name="seeker.address"
                    value={user?.seeker?.address || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    City
                  </label>
                  <Input
                    name="seeker.city"
                    value={user?.seeker?.city || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Resume URL
                  </label>
                  <Input
                    name="seeker.resume_url"
                    value={user?.seeker?.resume_url || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Profile Preview</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg text-gray-900">
                    {`${user?.firstname || ""} ${
                      user?.lastname || ""
                    }`.trim() || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-lg text-gray-900">
                    {user?.seeker?.phonenumber || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Resume</p>
                  <a
                    href={user?.seeker?.resume_url}
                    target="_blank"
                    className="text-blue-600 hover:underline "
                  >
                    <p className="line-clamp-3">
                      {user?.seeker?.resume_url || "No resume uploaded"}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
