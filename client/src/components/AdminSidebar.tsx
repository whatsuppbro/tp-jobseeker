"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { adminAuthHandler } from "@/utils/adminAuthHandler";
import { LayoutDashboard, FilePenLine, UserPen, Settings } from "lucide-react";

export default function AdminSidebar() {
  const handleLogout = async () => {
    await adminAuthHandler("adminsignout");
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="mb-6 bg-gray-700 p-4 rounded-lg shadow-md text-center">
          <LayoutDashboard className="h-8 w-8 mx-auto mb-2" />
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>

        <nav className="space-y-2 bg-gray-700 p-4 rounded-lg shadow-md">
          <Link href="/admin/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
            >
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/jobs">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
            >
              <FilePenLine className="mr-2" />
              Jobs
            </Button>
          </Link>
          <Link href="/admin/companys">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
            >
              <Settings className="mr-2" />
              Company
            </Button>
          </Link>
          <Link href="/admin/applications">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
            >
              <Settings className="mr-2" />
              Applications
            </Button>
          </Link>
        </nav>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg shadow-md text-center">
        <Separator className="my-2 " />
        <Button
          variant="destructive"
          className="w-full cursor-pointer"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}
