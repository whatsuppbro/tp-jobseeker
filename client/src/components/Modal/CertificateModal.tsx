import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Edit } from "lucide-react";

export default function CertificateModal({ seekerId }: { seekerId: string }) {
  const [certificateName, setCertificateName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seeker/certificate/${seekerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            certificates: certificateName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add certificate");
      }

      toast.success("Certificate added successfully!");
      setIsOpen(false);
      setCertificateName("");
    } catch (error) {
      toast.error("Failed to add certificate");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {seekerId ? (
          <button className="text-blue-600 hover:underline flex items-center gap-1  cursor-pointer ml-2 text-sm">
            <Edit size={16} /> Edit
          </button>
        ) : (
          <Button>Add Certificate</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Certificate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Certificate Name"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
          />
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
