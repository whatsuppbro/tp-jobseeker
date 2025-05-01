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
  company_id: string;
  company: {
    company_name: string;
    company_email: string;
  };
  verified_url: string;
  document_url: string;
  document_type: string;
  status: string;
  created_at: string;
}

export default function AdminVerification() {
  const [data, setData] = useState<Verification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const itemPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/verifications`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        setData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerification = async (
    id: string,
    action: string,
    reason?: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/verification/${id}`,
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
      const updatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/verifications`
      );
      const updatedData = await updatedResponse.json();
      setData(updatedData.data);
    } catch (error) {
      console.error("Error updating verification:", error);
      toast.error("Failed to update verification status");
    }
  };

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const filteredData = data.filter((verification) =>
    verification.company.company_email
      .toLowerCase()
      .includes(searchEmail.toLowerCase())
  );
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 p-8">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Verification Management</CardTitle>
              <CardDescription>Manage company verifications</CardDescription>
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
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.company.company_name}</TableCell>
                    <TableCell>{item.company.company_email}</TableCell>
                    <TableCell>{item.document_type}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      {item.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleVerification(item.id, "approve")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleVerification(
                                item.id,
                                "reject",
                                "Document verification failed"
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(item.document_url, "_blank")}
                      >
                        View Document
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No verifications found.
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
