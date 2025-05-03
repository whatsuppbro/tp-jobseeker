"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Company } from "@/types/type";
import CompanyModal from "@/components/AdminModal/CompanysModal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CompanyWithVerification extends Company {
  verified?: {
    id?: string;
    company_id?: string;
    verified_url?: string;
    verified_description?: string;
    document_type?: string;
    status?: string;
    created_at?: string;
  };
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    verified: "bg-green-500 text-white",
    pending: "bg-yellow-500 text-white",
    rejected: "bg-red-500 text-white",
    unverified: "bg-gray-400 text-white",
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-sm font-semibold min-w-[100px] text-center ${
        styles[status] || styles.unverified
      }`}
    >
      {label}
    </span>
  );
};

export default function AdminCompany() {
  const [data, setData] = useState<CompanyWithVerification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const itemPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/company/verification/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Company and Verification");
        }
        const data = await response.json();
        console.log("API Response:", data);
        if (Array.isArray(data.data)) {
          setData(data.data);
        } else {
          console.error("Unexpected data format:", data);
          toast.error("Unexpected data format received from the server.");
        }
      } catch (error) {
        console.error("Error fetching Company:", error);
        toast.error(
          "An error occurred while fetching Company. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerification = async (
    companyId: string,
    action: string,
    reason?: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/verification/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, reason }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update verification status");
      }

      toast.success("Verification status updated successfully");
      // Refresh data
      const updatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company`
      );
      const updatedData = await updatedResponse.json();
      setData(updatedData.data);
    } catch (error) {
      console.error("Error updating verification:", error);
      toast.error("Failed to update verification status");
    }
  };

  const indexOfLastUser = currentPage * itemPerPage;
  const indexOfFirstUser = indexOfLastUser - itemPerPage;
  const filteredData = data.filter((company) =>
    company.company_email.toLowerCase().includes(searchEmail.toLowerCase())
  );
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 p-8">
        <p className="text-lg text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="shadow-md border border-gray-200 ">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Company Management</CardTitle>
              <CardDescription>List of all registered Company</CardDescription>
            </div>
            <div className="relative">
              <Input
                type="email"
                placeholder="Search by company email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="max-w-sm pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Company Name</TableHead>
                <TableHead className="w-[200px]">Email</TableHead>
                <TableHead className="w-[120px]">Phone</TableHead>
                <TableHead className="w-[150px] text-center">Verification Date</TableHead>
                <TableHead className="w-[120px]">Document Type</TableHead>
                <TableHead className="w-[100px] text-center">Documents</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="w-[150px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.company_name}</TableCell>
                    <TableCell>{company.company_email}</TableCell>
                    <TableCell>{company.company_phone}</TableCell>
                    <TableCell className="text-center">
                      {company.verified?.created_at ? (
                        <span className="text-sm text-gray-600">
                          {new Date(company.verified.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{company.verified?.document_type || "-"}</TableCell>
                    <TableCell className="text-center">
                      {company.verified?.verified_url ? (
                        <a
                          href={company.verified.verified_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={company.verified?.status || "unverified"} />
                    </TableCell>
                    <TableCell className="text-center">
                      {company.verified?.status === "pending" && (
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100 rounded-full px-4 py-1 text-sm font-semibold"
                            onClick={() => handleVerification(company.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100 rounded-full px-4 py-1 text-sm font-semibold"
                            onClick={() =>
                              handleVerification(company.id, "reject", "Document verification failed")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    No companies found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-center mt-6">
            <CustomPagination
              totalUsers={filteredData.length}
              itemPerPage={itemPerPage}
              currentPage={currentPage}
              paginate={paginate}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
