import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { footList } from "@/data/navList";
import { Github, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border text-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold">JobTP</h2>
            <p className="text-sm text-muted-foreground mt-2">
              &copy; {new Date().getFullYear()} CS project. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-col md:flex-row gap-4 text-sm">
            {footList.map((footItem, i) => (
              <Link key={i} href={footItem.href}>
                {footItem.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="https://facebook.com/">
                <Facebook className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="https://github.com/">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          Made with ❤️ by Nathee & Punnatat
        </div>
      </div>
    </footer>
  );
}
