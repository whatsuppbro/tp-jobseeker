"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Combobox from "./Combobox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ShieldCheck } from "lucide-react";

const verificationSchema = z.object({
  verified_url: z.string().url("Must be a valid URL"),
  verified_description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

export default function CompanyVerification({
  companyId,
}: {
  companyId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<
    "verified" | "pending" | "rejected" | "unverified"
  >("unverified");
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const documentOptions = [
    "business_license",
    "tax_id",
    "company_registration",
    "other",
  ];

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verified_url: "",
      verified_description: "",
    },
  });

  useEffect(() => {
    async function fetchVerificationStatus() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/company/${companyId}`
        );
        const data = await res.json();

        if (data?.data?.verified) {
          const currentStatus = data.data.verified.status?.toLowerCase();

          if (
            currentStatus === "verified" ||
            currentStatus === "pending" ||
            currentStatus === "rejected"
          ) {
            setStatus(currentStatus as "verified" | "pending" | "rejected");

            if (data.data.verified.document_type) {
              setDocumentType(data.data.verified.document_type);
            }
          }
        } else {
          setStatus("unverified");
        }
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
        setStatus("unverified");
      } finally {
        setLoading(false);
      }
    }

    fetchVerificationStatus();
  }, [companyId]);

  const handleVerify = async (formData: VerificationFormValues) => {
    if (!documentType) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verification/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
            verified_url: formData.verified_url,
            verified_description: formData.verified_description,
            document_type: documentType,
            status: "pending",
          }),
        }
      );

      if (response.ok) {
        alert("Verification request submitted!");
        setStatus("pending");
        setOpen(false);
      } else {
        alert("Failed to submit verification.");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert("An error occurred.");
    }
  };

  if (loading) {
    return <Badge variant="outline">Loading...</Badge>;
  }

  if (status === "verified" || status === "pending") {
    const isVerified = status === "verified";
    return (
      <Badge
        className={
          isVerified
            ? "bg-green-100 text-green-800 border-green-300"
            : "bg-yellow-100 text-yellow-800 border-yellow-300"
        }
      >
        <span className="text-xs font-medium flex items-center gap-1">
          {isVerified ? <ShieldCheck className="w-4 h-4 text-green-700" /> : "⏳"}
          {isVerified ? "Verified" : "Pending"}
        </span>
      </Badge>
    );
  }

  if (status === "rejected") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Verify Company
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Verification</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleVerify)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="verified_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verified URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Official website or document link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verified_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe your verification..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a short explanation about this verification request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Combobox
              value={documentType || ""}
              onValueChange={(value) => setDocumentType(value)}
              options={documentOptions}
              placeholder="Select document type"
            />

            <Button type="submit" disabled={!documentType} className="w-full">
              Submit Verification
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
