"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { navList as defaultNavList } from "@/data/navList";
import { AlignJustify, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [navList, setNavList] = useState(defaultNavList);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);

      if (parsedUser?.role === "company") {
        setNavList((prevNavList) =>
          prevNavList.map((item) =>
            item.name === "Profile"
              ? { ...item, name: "Details", href: "/details" }
              : item
          )
        );
      } else {
        setNavList(defaultNavList);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
      setNavList(defaultNavList);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setNavList(defaultNavList);
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  return (
    <nav className="bg-background border-b">
      <div className="container flex items-center justify-between h-16">
        <div>
          <Link href="/" className="text-lg font-bold">
            JobTP
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ul className="flex space-x-4">
            {navList.map((navItem, i) => (
              <li key={i}>
                <Link href={navItem.href}>
                  <Button variant="ghost" className="cursor-pointer">
                    {navItem.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/setting")}>
                  Setting
                </DropdownMenuItem>

                {user?.role === "seeker" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/job/applied-jobs")}
                  >
                    Applied Jobs
                  </DropdownMenuItem>
                )}
                {user?.role === "company" && (
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                )}
                <Separator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="cursor-pointer">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <AlignJustify className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navList.map((navItem, i) => (
                <DropdownMenuItem key={i}>
                  <Link href={navItem.href} className="w-full">
                    {navItem.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <Separator />
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem onClick={() => router.push("/setting")}>
                    Setting
                  </DropdownMenuItem>

                  {user?.role === "seeker" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/job/applied-jobs")}
                    >
                      Applied Jobs
                    </DropdownMenuItem>
                  )}
                  {user?.role === "company" && (
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <Separator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link href="/login" className="w-full">
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/signup" className="w-full">
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
