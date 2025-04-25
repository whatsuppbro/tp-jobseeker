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
import { JobwithCompany } from "@/types/type";
import JobsModal from "@/components/AdminModal/JobsModal";

export default function AdminJob() {
  const [data, setData] = useState<JobwithCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();

        if (Array.isArray(data.data)) {
          setData(data.data);
        } else {
          console.error("Unexpected data format:", data);
          toast.error("Unexpected data format received from the server.");
        }
      } catch (error) {
        console.error("Error fetching :", error);
        toast.error("An error occurred while fetching. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastUser = currentPage * itemPerPage;
  const indexOfFirstUser = indexOfLastUser - itemPerPage;
  const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser);

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
          <CardTitle>Jobs Management</CardTitle>
          <CardDescription>List of all registered Jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Company</TableHead>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead className="w-[200px]">Type</TableHead>
                <TableHead className="w-[200px]">Location</TableHead>
                <TableHead className="w-[150px]">Email</TableHead>
                <TableHead className="w-[150px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.company.company_name}</TableCell>
                    <TableCell>{user.title}</TableCell>
                    <TableCell>{user.job_type}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.company.company_email}</TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <JobsModal Id={user.id} Data={user} />
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
              totalUsers={data.length}
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
