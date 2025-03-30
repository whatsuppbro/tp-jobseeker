"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";

export interface ComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export default function Combobox({
  value,
  onValueChange,
  options,
  placeholder,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="bg-white/65 font-normal flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background text-muted-foreground hover:text-muted-foreground"
        >
          {value ? value : placeholder || "Select an option..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-full min-w-[200px]"
        side="bottom"
        align="start"
      >
        <Command>
          <CommandInput placeholder={placeholder || "Search..."} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onValueChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                  {value === option && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
