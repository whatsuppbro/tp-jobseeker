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
import { Building, Users, Briefcase, FileUser, Search, CheckCircle2 } from "lucide-react";

export default function AdminCompany() {
  const [data, setData] = useState<Company[]>([]);
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
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.company_name}</TableCell>
                    <TableCell>{user.company_email}</TableCell>
                    <TableCell>{user.company_phone}</TableCell>
                    <TableCell>{user.company_city}</TableCell>
                    <TableCell>
                      {user.is_verified ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Verified
                        </div>
                      ) : (
                        <span className="text-orange-500">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <CompanyModal Id={user.id} Data={user} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
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
