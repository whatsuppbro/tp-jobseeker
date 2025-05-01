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
import { Building, Users, Briefcase, FileUser, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompanyWithVerification extends Company {
  verification?: {
    status: string;
    document_url?: string;
    document_type?: string;
    rejection_reason?: string;
  };
}

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
          `${process.env.NEXT_PUBLIC_API_URL}/company`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Company");
        }
        const data = await response.json();

        if (Array.isArray(data.data)) {
          // Fetch verification status for each company
          const companiesWithVerification = await Promise.all(
            data.data.map(async (company: Company) => {
              const verificationResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/company/${company.id}/verification`
              );
              if (verificationResponse.ok) {
                const verificationData = await verificationResponse.json();
                return {
                  ...company,
                  verification: verificationData.data,
                };
              }
              return {
                ...company,
                verification: { status: "unverified" },
              };
            })
          );
          setData(companiesWithVerification);
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

  const handleVerification = async (companyId: string, action: string, reason?: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const indexOfLastUser = currentPage * itemPerPage;
  const indexOfFirstUser = indexOfLastUser - itemPerPage;
  const filteredData = data.filter(company => 
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
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[250px]">Email</TableHead>
                <TableHead className="w-[150px]">Phone</TableHead>
                <TableHead className="w-[150px]">City</TableHead>
                <TableHead className="w-[150px]">Verification</TableHead>
                <TableHead className="w-[150px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.company_name}</TableCell>
                    <TableCell>{company.company_email}</TableCell>
                    <TableCell>{company.company_phone}</TableCell>
                    <TableCell>{company.company_city}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.verification?.status || "unverified")}>
                        {company.verification?.status || "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <CompanyModal Id={company.id} Data={company} />
                      {company.verification?.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerification(company.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleVerification(company.id, "reject", "Document verification failed")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {company.verification?.document_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(company.verification?.document_url, "_blank")}
                        >
                          View Document
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No data found.
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
