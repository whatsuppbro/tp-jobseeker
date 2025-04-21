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
    experience?: {
      id?: string;
      company_name?: string;
      position?: string;
      experience_years?: string;
      description?: string;
    };
    skills?: {
      id: string;
      name: string;
    }[];
  };
}

const ExperienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  experience_years: z.string().min(1, "Experience duration is required"),
  description: z.string().optional(),
});

export default function ExperienceSettings() {
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${parsedUser.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        toast.error("Failed to load profile information");
        console.error(error);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.seeker) return;

    setIsSaving(true);

    try {
      const experienceValidation = ExperienceSchema.safeParse({
        company_name: user.seeker.experience?.company_name || "",
        position: user.seeker.experience?.position || "",
        experience_years: user.seeker.experience?.experience_years || "",
        description: user.seeker.experience?.description || "",
      });

      if (!experienceValidation.success) {
        experienceValidation.error.issues.forEach((issue) => {
          toast.error(issue.message);
        });
        return;
      }

      const experienceMethod = user.seeker?.experience?.id ? "PUT" : "POST";
      const experienceUrl = user.seeker.experience?.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/experience/${user.seeker.experience.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/experience/seeker/${user.seeker.id}`;

      const experienceResponse = await fetch(experienceUrl, {
        method: experienceMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seeker_id: user.seeker.id,
          company_name: user.seeker.experience?.company_name,
          position: user.seeker.experience?.position,
          experience_years: user.seeker.experience?.experience_years,
          description: user.seeker.experience?.description,
        }),
      });

      if (!experienceResponse.ok) {
        throw new Error("Failed to update experience");
      }

      const updatedUser = {
        ...user,
        seeker: {
          ...user.seeker,
          experience: {
            ...(user.seeker.experience || {}),
            ...(await experienceResponse.json()).data,
          },
        },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Experience updated successfully");
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to update experience");
      console.error(error);
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
          <h1 className="text-3xl font-bold">Experience Settings</h1>
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
              <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company Name
                  </label>
                  <Input
                    name="seeker.experience.company_name"
                    value={user?.seeker?.experience?.company_name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Position
                  </label>
                  <Input
                    name="seeker.experience.position"
                    value={user?.seeker?.experience?.position || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Experience Duration
                  </label>
                  <Input
                    name="seeker.experience.experience_years"
                    value={user?.seeker?.experience?.experience_years || ""}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 3 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <Textarea
                    name="seeker.experience.description"
                    value={user?.seeker?.experience?.description || ""}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Your responsibilities and achievements..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Company
                  </p>
                  <p className="text-lg font-medium">
                    {user?.seeker?.experience?.company_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Position
                  </p>
                  <p className="text-lg font-medium">
                    {user?.seeker?.experience?.position || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Duration
                  </p>
                  <p className="text-gray-600">
                    {user?.seeker?.experience?.experience_years ||
                      "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
