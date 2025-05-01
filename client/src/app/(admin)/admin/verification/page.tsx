"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomPagination } from "@/components/AdminPagnation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Verification {
  id: string;
  user_id: string;
  company_name: string;
  company_email: string;
  company_website?: string;
  company_description?: string;
  company_phone?: string;
  company_address?: string;
  company_city?: string;
  company_country?: string;
  image_url?: string;
  verified: {
    id: string;
    company_id: string;
    verified_url: string;
    verified_description: string;
    document_type: string;
    status: "verified" | "pending" | "rejected";
  };
}

export default function AdminVerification() {
  const [data, setData] = useState<Verification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/company/verification/all`
        );

        if (!response.ok) throw new Error("Failed to fetch verifications");

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching verifications:", error);
        toast.error("Could not load verification data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerification = async (
    verificationId: string,
    status: "verified" | "rejected"
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verification/status/${verificationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      toast.success("Status updated successfully");

      const updatedRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/verification/all`
      );
      const updatedData = await updatedRes.json();
      setData(updatedData.data || []);
    } catch (error) {
      console.error("Error updating verification:", error);
      toast.error("Failed to update verification status");
    }
  };

  const filteredData = data.filter((item) =>
    item.company_email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const StatusBadge = ({
    status,
  }: {
    status: "verified" | "pending" | "rejected";
  }) => {
    const styles = {
      verified: "bg-green-500 text-white",
      pending: "bg-yellow-500 text-white",
      rejected: "bg-red-500 text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]} capitalize`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-gray-500">Loading verifications...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">
                Verification Management
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Manage company verifications
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-auto">
              <Input
                type="email"
                placeholder="Search by company email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="pr-10 bg-gray-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Company Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Document Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold">
                  Actions
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Documents
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.company_name}</TableCell>
                    <TableCell>{item.company_email}</TableCell>
                    <TableCell>{item.verified.document_type}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.verified.status} />
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      {item.verified.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleVerification(item.verified.id, "verified")
                            }
                            className="bg-green-500 hover:bg-green-600 text-white border-transparent"
                          >
                            Verified
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleVerification(item.verified.id, "rejected")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                          >
                            Rejected
                          </Button>
                        </>
                      )}
                      {item.verified.status === "verified" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleVerification(item.verified.id, "rejected")
                          }
                          className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                        >
                          Rejected
                        </Button>
                      )}
                      {item.verified.status === "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleVerification(item.verified.id, "verified")
                          }
                          className="bg-green-500 hover:bg-green-600 text-white border-transparent"
                        >
                          Verified
                        </Button>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(item.image_url || "#", "_blank")
                        }
                      >
                        View Document
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No verifications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-center">
            <CustomPagination
              totalUsers={filteredData.length}
              itemPerPage={itemsPerPage}
              currentPage={currentPage}
              paginate={goToPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
