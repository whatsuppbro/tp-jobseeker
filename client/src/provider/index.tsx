"use client";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
