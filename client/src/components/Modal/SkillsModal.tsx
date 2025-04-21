import { useState, useEffect } from "react";
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
import { Edit, Trash2Icon } from "lucide-react";

interface SkillsModalProps {
  seekerId: string;
  hasSkills?: boolean;
  skills?: { id: string; name: string }[];
  onSkillUpdated?: () => void;
}

export default function SkillsModal({
  seekerId,
  hasSkills = false,
  skills: receivedSkills = [],
  onSkillUpdated,
}: SkillsModalProps) {
  const [skillName, setSkillName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] =
    useState<{ id: string; name: string }[]>(receivedSkills);

  useEffect(() => {
    setSkills(receivedSkills);
  }, [receivedSkills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seeker/skill/${seekerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seeker_id: seekerId,
            name: skillName,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save skill");

      const newSkill = await response.json();
      setSkills((prev) => [...prev, newSkill]);
      toast.success(hasSkills ? "Skill updated!" : "Skill added!");
      setIsOpen(false);
      setSkillName("");
      onSkillUpdated?.();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (skillId: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seeker/skill/${skillId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete skill");

      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      toast.success("Skill deleted successfully");
      onSkillUpdated?.();
    } catch (error) {
      toast.error("Failed to delete skill. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {hasSkills ? (
          <button className=" text-blue-600 hover:underline flex items-center gap-1  cursor-pointer ml-2 text-sm">
            <Edit size={16} /> Edit
          </button>
        ) : (
          <Button className="w-full sm:w-auto mt-2">Add Skills</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{hasSkills ? "Edit Skills" : "Add Skills"}</DialogTitle>
        </DialogHeader>

        {hasSkills && (
          <div className="max-h-48 overflow-y-auto mb-4">
            {skills.map((skill, index) => (
              <div
                key={`${skill.id}-${index}`}
                className="flex justify-between items-center p-2 border rounded mb-2"
              >
                <span>{skill.name}</span>
                <Trash2Icon
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => handleDelete(skill.id)}
                />
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            placeholder="Enter a skill"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : hasSkills ? "Update" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
