"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  applied_position: string;
  status: "pending" | "accepted" | "rejected";
  resume_url?: string;
  created_at: string;
}

export default function Applicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applications`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applicants");
        }

        const data = await response.json();
        const transformedData = data.data.map((application: any) => ({
          id: application.id,
          name: `${application.user.firstname} ${application.user.lastname}`,
          email: application.user.email,
          phone: application.user.seeker?.phonenumber || undefined,
          applied_position: application.job.title,
          status: application.status,
          resume_url: application.user.seeker?.resume_url || undefined,
          created_at: new Date().toISOString(),
        }));

        setApplicants(transformedData);
      } catch (error) {
        toast.error("Failed to load applicants");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full mb-2" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>
      </div>

      <div className="">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <Card
              key={applicant.id}
              className="shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white"
            >
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {applicant.name}
                </CardTitle>
                <CardDescription className="text-sm ">
                  {applicant.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-xs font-medium  uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm text-gray-700">
                    {applicant.phone || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium  uppercase tracking-wider">
                    Position Applied
                  </p>
                  <p className="text-sm text-gray-700">
                    {applicant.applied_position}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium  uppercase tracking-wider">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      applicant.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : applicant.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {applicant.status.charAt(0).toUpperCase() +
                      applicant.status.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium  uppercase tracking-wider">
                    Applied On
                  </p>
                  <p className="text-sm text-gray-700">
                    {new Date(applicant.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  {applicant.resume_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        window.open(applicant.resume_url, "_blank")
                      }
                    >
                      View Resume
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center ">No applicants found.</div>
        )}
      </div>
    </div>
  );
}
