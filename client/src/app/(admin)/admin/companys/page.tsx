"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface VerifiedInfo {
  id: string;
  company_id: string;
  verified_url: string;
  verified_description: string;
  document_type: string;
  status: "verified" | "pending" | "rejected";
  created_at: string;
}

interface CompanyWithVerification extends Company {
  verified?: VerifiedInfo;
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
      className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-sm font-semibold min-w-[100px] ${
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

  const fetchCompanyData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/verification/all`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to fetch");

      if (Array.isArray(json.data)) {
        setData(json.data);
      } else {
        toast.error("Unexpected data format received.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load company data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const handleVerification = async (
    verificationId: string,
    action: string,
    reason?: string,
    status?: "verified" | "rejected"
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verification/status/${verificationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, reason, status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update verification status");

      toast.success("Status updated successfully.");
      await fetchCompanyData();
    } catch (error) {
      console.error("Verification update error:", error);
      toast.error("Failed to update verification.");
    }
  };

  const filteredData = data.filter((company) =>
    company.company_email?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const currentUsers = filteredData.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-gray-500">Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="shadow-md border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Company Management</CardTitle>
              <CardDescription>List of all registered companies</CardDescription>
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
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center">Verification Date</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead className="text-center">Documents</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.company_name}</TableCell>
                    <TableCell>{company.company_email}</TableCell>
                    <TableCell>{company.company_phone}</TableCell>
                    <TableCell className="text-center">
                      {company.verified?.created_at ? (
                        new Date(company.verified.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
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
                            size="sm"
                            className="cursor-pointer bg-green-50 text-green-700 hover:bg-green-100 rounded-full px-4 py-1 text-sm font-semibold"
                            onClick={() =>
                              handleVerification(company.verified!.id, "approve", "", "verified")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="cursor-pointer bg-red-50 text-red-700 hover:bg-red-100 rounded-full px-4 py-1 text-sm font-semibold"
                            onClick={() =>
                              handleVerification(
                                company.verified!.id,
                                "reject",
                                "Document verification failed",
                                "rejected"
                              )
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
              paginate={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
