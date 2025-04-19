"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
  skill?: string[];
  experience?: {
    company_name?: string;
    position?: string;
    description?: string;
    skill?: { name: string }[];
  };
  seeker: {
    phonenumber?: string;
    address?: string;
    city?: string;
    resume_url?: string;
  };
  company_name?: string;
  position?: string;
  description?: string;
}

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) return;

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        const [userResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`),
        ]);

        if (!userResponse.ok) throw new Error("Failed to fetch data");

        const [userDataResponse] = await Promise.all([userResponse.json()]);

        const completeUserData: User = {
          ...userDataResponse.data,
        };

        setUser(completeUserData);
        if (userDataResponse.data.experience?.skill) {
          setSkillsInput(
            userDataResponse.data.experience.skill
              .map((s: { name: any }) => s.name)
              .join(", ")
          );
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUser((prev) => ({
        ...prev!,
        [parent]: {
          ...(prev![parent as keyof User] as object),
          [child]: value,
        },
      }));
    } else if (name.includes("experience.")) {
      const [, expField] = name.split("experience.");
      setUser((prev) => ({
        ...prev!,
        experience: {
          ...(prev!.experience || {}),
          [expField]: value,
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillsInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // Process skills
      const skillsArray = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const updatedUser = {
        ...user,
        experience: {
          ...user.experience,
          skill: skillsArray.map((name) => ({ name })),
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      // Update local storage
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...parsedUser,
            ...updatedUser,
          })
        );
      }

      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-center">
          Welcome to JobTP
        </h1>
        <p className="max-w-md text-center text-gray-600">
          Sign in to view or edit your professional profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => router.push("/signin")} size="lg">
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            variant="outline"
            size="lg"
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
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
                    value={user.firstname || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Name
                  </label>
                  <Input
                    name="lastname"
                    value={user.lastname || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    value={user.email}
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
                    value={user.seeker.phonenumber || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <Input
                    name="seeker.address"
                    value={user.seeker.address || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    City
                  </label>
                  <Input
                    name="seeker.city"
                    value={user.seeker.city || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Resume URL
                  </label>
                  <Input
                    name="seeker.resume_url"
                    value={user.seeker.resume_url || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">
                Skills & Experience
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Skills (comma separated)
                  </label>
                  <Input
                    value={skillsInput}
                    onChange={handleSkillsChange}
                    placeholder="React, JavaScript, TypeScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Company Name
                  </label>
                  <Input
                    name="experience.company_name"
                    value={user.experience?.company_name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Position
                  </label>
                  <Input
                    name="experience.position"
                    value={user.experience?.position || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <Textarea
                    name="experience.description"
                    value={user.experience?.description || ""}
                    onChange={handleInputChange}
                    rows={4}
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
                    {`${user.firstname || ""} ${user.lastname || ""}`.trim() ||
                      "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skillsInput.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Profile Strength</h2>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{ width: `${calculateProfileCompleteness(user)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Complete your profile to increase visibility to employers.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function calculateProfileCompleteness(user: User): number {
  let completeFields = 1;
  if (user.firstname || user.lastname) completeFields++;
  if (user.experience?.skill?.length) completeFields++;
  if (user.experience?.company_name) completeFields++;
  if (user.seeker.phonenumber) completeFields++;
  if (user.seeker.address) completeFields++;
  if (user.seeker.city) completeFields++;
  if (user.seeker.resume_url) completeFields++;
  return Math.round((completeFields / 8) * 100);
}
