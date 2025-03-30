"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = React.useState(false);

  const filteredOptions =
    inputValue === ""
      ? options
      : options.filter((option) =>
          option.toLowerCase().includes(inputValue.toLowerCase())
        );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <CommandInput
            placeholder={placeholder || "Search..."}
            value={inputValue}
            onValueChange={(e) => setInputValue(e)}
            className="w-full"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option, index) => (
                <CommandItem
                  key={index}
                  value={option}
                  onSelect={() => {
                    setInputValue(option);
                    onValueChange(option);
                  }}
                  className="cursor-pointer"
                >
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
