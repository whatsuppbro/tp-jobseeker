"use client";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
  company?: {
    company_name: string;
    company_description: string;
    company_website: string;
    company_email: string;
    company_phone: string;
    company_address: string;
    company_city: string;
    company_country: string;
    image_url?: string;
  };
}

export default function EditDetails() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    company_description: "",
    company_website: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    company_city: "",
    company_country: "",
    image_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          setError("User data not found. Please log in.");
          return;
        }

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        if (parsedUser.role === "seeker") {
          redirect("/profile");
        }

        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userDataResponse = await userResponse.json();

        const completeUserData: User = {
          ...userDataResponse.data,
        };

        setUser(completeUserData);

        if (completeUserData.company) {
          setFormData({
            company_name: completeUserData.company?.company_name || "",
            company_description:
              completeUserData.company?.company_description || "",
            company_website: completeUserData.company?.company_website || "",
            company_email: completeUserData.company?.company_email || "",
            company_phone: completeUserData.company?.company_phone || "",
            company_address: completeUserData.company?.company_address || "",
            company_city: completeUserData.company?.company_city || "",
            company_country: completeUserData.company?.company_country || "",
            image_url: completeUserData.company?.image_url || "",
          });
        }
      } catch (err: any) {
        console.error("Error:", err.message);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        setError("User data not found. Please log in.");
        return;
      }

      const parsedUser = JSON.parse(userData);
      const userId = parsedUser.id;

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/company/${userId}`;
      const method = user?.company ? "PUT" : "POST";
      const payload = {
        user_id: userId,
        ...formData,
      };

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update/create company data");
      }

      const updatedUserData = { ...parsedUser, company: formData };
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      router.push("/details");
    } catch (err: any) {
      console.error("Error:", err.message);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 bg-gray-50">
        <h1 className="text-3xl font-extrabold text-center text-red-500">
          Error
        </h1>
        <p className="max-w-md text-center text-gray-600">{error}</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
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
          Sign in to view or create your professional profile.
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
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Edit About Your Company</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfileSection title="Company Information">
            <InfoRow label="Company Name">
              <Input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>
            <InfoRow label="Company Logo">
              <Input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Enter your company logo"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>

            <InfoRow label="Description">
              <Textarea
                name="company_description"
                value={formData.company_description}
                onChange={handleChange}
                placeholder="Enter your company description"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>
            <InfoRow label="Website">
              <Input
                type="text"
                name="company_website"
                value={formData.company_website}
                onChange={handleChange}
                placeholder="Enter your company website"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>

            <InfoRow label="Email">
              <Input
                type="email"
                name="company_email"
                value={formData.company_email}
                onChange={handleChange}
                placeholder="Enter your company email"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>
            <InfoRow label="Phone Number">
              <Input
                type="tel"
                name="company_phone"
                value={formData.company_phone}
                onChange={handleChange}
                placeholder="Enter your company phone number"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>
            <InfoRow label="Address">
              <Input
                type="text"
                name="company_address"
                value={formData.company_address}
                onChange={handleChange}
                placeholder="Enter your company address"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>
            <InfoRow label="City">
              <Input
                type="text"
                name="company_city"
                value={formData.company_city}
                onChange={handleChange}
                placeholder="Enter your company city"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>
            <InfoRow label="Country">
              <Input
                type="text"
                name="company_country"
                value={formData.company_country}
                onChange={handleChange}
                placeholder="Enter your company country"
                className="w-full p-2 border rounded-md"
              />
            </InfoRow>
          </ProfileSection>

          <div className="flex justify-end gap-4">
            <Button onClick={() => router.push("/details")} variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      {children}
    </div>
  );
}
