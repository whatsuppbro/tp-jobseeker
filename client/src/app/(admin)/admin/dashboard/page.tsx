"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "@/types/type";
import { CustomPagination } from "@/components/AdminPagnation";
import { StatCard } from "@/components/AdminStatCard";
import UserModal from "@/components/AdminModal/UsersModal";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [companys, setCompanys] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const itemPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.error("Unexpected data format:", data);
          toast.error("Unexpected data format received from the server.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error(
          "An error occurred while fetching users. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    const fetchCompanys = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/company`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        setCompanys(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCompanys();

    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        const data = await response.json();
        setJobs(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchJobs();
  }, []);

  const indexOfLastUser = currentPage * itemPerPage;
  const indexOfFirstUser = indexOfLastUser - itemPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage your application and users from here.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          description="Users registered in the system"
          value={users.length.toString()}
        />
        <StatCard
          title="Tocal Companies"
          description="Total number of companies registered"
          value={companys.length.toString()}
        />
        <StatCard
          title="Total Jobs"
          description="Total number of jobs posted"
          value={jobs.length.toString()}
        />
      </div>

      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>List of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[150px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="flex justify-center">
                      <UserModal userId={user.id} userData={user} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-center mt-6">
            <CustomPagination
              totalUsers={users.length}
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
