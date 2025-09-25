"use client";

import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { useDictionary } from "../layout/dictionary-provider";
import { Button } from "../shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Spinner } from "./spinner";

interface Option {
  value: string;
  label: React.ReactNode;
  color?: string;
}

interface Props {
  values: Array<string>;
  options: Array<Option>;
  placeholder?: string;
  onChange?: (values: Array<string>) => void;
  onSearchChange?: (search: string) => void;
  actions?: Array<React.ReactNode>;
  disabled: boolean;
}

export function MultiAutocomplete({
  values,
  options,
  placeholder,
  onChange,
  onSearchChange,
  actions = [],
  disabled,
}: Props) {
  const { dict } = useDictionary();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
  }, [search]);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch);
    }
    setIsSearching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const filteredOptions = options.filter((option) => !values.includes(option.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx(
            "w-full px-0 justify-start flex-wrap",
            // custom, remove if need to reset
            "border-b border-muted-foreground/20 border-t-0 border-r-0 border-l-0 shadow-none rounded-none focus:outline-none focus-within:ring-0 focus-within:border-primary transition-colors duration-300 placeholder:text-muted-foreground/60",
            // also custom, but just for this component
            "hover:bg-transparent",
            open && "border-primary",
            // putting h-auto without conditions makes the height too short if nothing is selected
            values.length > 0 && "h-auto",
          )}
        >
          {values.length > 0 ? (
            values.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                option && (
                  <div
                    key={value}
                    className={clsx(
                      "inline-flex items-center px-2 py-1 text-sm rounded-md",
                      option.color ? `bg-[${option.color}]` : "bg-gray-100",
                    )}
                  >
                    {option.label}
                    <button
                      className={clsx("ms-2 text-gray-600 hover:text-gray-800 focus:outline-none")}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newValues = values.filter((v) => v !== value);
                        if (onChange) onChange(newValues);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )
              );
            })
          ) : (
            <span className="text-muted-foreground/60">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto min-w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput
            placeholder={dict?.Shared?.Search}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isSearching ? (
              <CommandEmpty>
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              </CommandEmpty>
            ) : (
              <>
                <CommandEmpty>{dict?.Shared?.NoResults}</CommandEmpty>
                <CommandGroup className="py-1">
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(selectedValue) => {
                        if (!values.includes(selectedValue) && onChange) {
                          onChange([...values, selectedValue]);
                        }
                        setOpen(false);
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {actions?.length > 0 && (
                  <div className="border-t">{actions?.map((action) => action)}</div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
