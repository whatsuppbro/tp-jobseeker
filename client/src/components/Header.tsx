import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { navList } from "@/data/navList";
import { AlignJustify } from "lucide-react";

export default function Header() {
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

          <Link href="/signup">
            <Button className="cursor-pointer">Sign Up</Button>
          </Link>
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
              <DropdownMenuItem>
                <Link href="/signup" className="w-full text-center ">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
