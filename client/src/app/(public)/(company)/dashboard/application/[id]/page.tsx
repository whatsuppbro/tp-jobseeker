"use client";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Applicant } from "@/types/type";

export default function ApplicantId() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicant, setApplicant] = useState<Applicant[] | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applications/user/${params.id}`,
          {
            next: { revalidate: 60 },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch applicants");
        const data = await response.json();
        setApplicant(data.data);
      } catch (error) {
        setError("Error fetching applicants");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [params]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!applicant || applicant.length === 0)
    return <p>No applicant data available.</p>;

  const firstApplicant = applicant[0];
  const seeker = firstApplicant.user.seeker;
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            {`${firstApplicant.user.firstname} ${firstApplicant.user.lastname}`}
          </CardTitle>
          <Badge
            variant={
              firstApplicant.status === "pending" ? "secondary" : "default"
            }
            className="px-3 py-1 text-sm font-medium"
          >
            {firstApplicant.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-4 flex justify-center items-center">
            <Avatar className="w-40 h-40 rounded-full object-cover border-2 border-gray-300 shadow-sm">
              <AvatarImage
                src={seeker?.avatar_url ?? "/default-avatar.png"}
                alt={`${firstApplicant.user.firstname ?? ""}'s profile`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-200 text-gray-600">
                {`${firstApplicant.user.firstname?.[0] ?? ""}${
                  firstApplicant.user.lastname?.[0] ?? ""
                }`}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <CardDescription className="text-sm text-gray-500">
              <div className="flex flex-col items-start justify-start mb-2 space-y-1">
                <div className="text-base font-medium text-gray-700">
                  <InfoRow
                    label="Email"
                    value={firstApplicant.user.email ?? ""}
                  />
                </div>
                <div className="text-base font-medium text-gray-700">
                  <InfoRow
                    label="Phone Number"
                    value={seeker?.phonenumber ?? "Phone number not available"}
                  />
                </div>
                <div className="text-base font-medium text-gray-700">
                  <InfoRow
                    label="Address"
                    value={`${seeker?.address ?? "Address not available"}, ${
                      seeker?.city ?? "City not available"
                    }`}
                  />
                </div>
              </div>
            </CardDescription>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
            <Separator className="my-2 bg-gray-200 h-px" />
            <div className="space-y-2">
              {seeker?.experience ? (
                <>
                  <InfoRow
                    label="Position"
                    value={seeker.experience.position}
                  />
                  <InfoRow
                    label="company_name"
                    value={seeker.experience.company_name}
                  />
                  <InfoRow
                    label="description"
                    value={seeker.experience.description}
                  />
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Experience information not available.
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
            <Separator className="my-2 bg-gray-200 h-px" />
            <div className="flex flex-wrap gap-2">
              {seeker?.skills?.length > 0 ? (
                seeker.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full"
                  >
                    {skill.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No skills listed.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Education</h3>
            <Separator className="my-2 bg-gray-200 h-px" />
            <div className="space-y-2">
              {seeker?.education ? (
                <>
                  <InfoRow
                    label="School"
                    value={seeker.education.school_name}
                  />
                  <InfoRow
                    label="Degree"
                    value={`${seeker.education.degree} in ${seeker.education.field_of_study}`}
                  />
                  <InfoRow
                    label="Years"
                    value={`${
                      seeker.education.start_date
                        ? format(new Date(seeker.education.start_date), "yyyy")
                        : "N/A"
                    } - ${
                      seeker.education.end_date
                        ? format(new Date(seeker.education.end_date), "yyyy")
                        : "N/A"
                    }`}
                  />
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Education information not available.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-lg text-gray-900">{value}</span>
    </div>
  );
}
