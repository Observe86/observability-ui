"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import { CalendarIcon, Camera } from "lucide-react";
import React, { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { MdCheck } from "react-icons/md";
import { components } from "react-select";
import AsyncSelect from "react-select/async";

import { Filter, TableRequest } from "@/types/search-and-filter";
import { cn } from "@/utils/shadcn";

import { useDictionary } from "../layout/dictionary-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import { Calendar } from "../shadcn/calendar";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { RadioGroup, RadioGroupItem } from "../shadcn/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shadcn/select";
import { Switch } from "../shadcn/switch";
import { Textarea } from "../shadcn/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../shadcn/tooltip";
import { TypographyMutedSmall } from "../typography/typography-muted-small";

type Option = {
  label: string | React.ReactNode;
  value: string;
};

export type DynamicFieldType = {
  id?: string;
  type:
    | "text"
    | "color"
    | "textarea"
    | "select"
    | "async-select"
    | "group"
    | "switch"
    | "radio"
    | "avatar"
    | "date";
  label?: string;
  fields?: Array<DynamicFieldType>;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: (e: any) => void;
  hide?: boolean;
  placeholder?: string;
  tooltip?: string;
  options?: Array<Option>;
  error?: any;
  onSearchChange?: (search: string) => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  actions?: Array<React.ReactNode>;
  queryKey?: Array<string>;
  queryFn?: (request: TableRequest) => Promise<{ rows: any[]; rowCount?: number }>;
  queryField?: string;
  mapOption?: (data: any) => Option;
  isMulti?: boolean;
  filters?: Filter[];
};

export const DynamicFieldRenderer = ({
  field,
  disabled,
  className,
}: {
  field: DynamicFieldType;
  disabled: boolean;
  className?: string;
}) => {
  if (field.hide) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {field.label && (
        <div className="flex items-center gap-2 w-1/5 mt-3">
          <Label htmlFor={field.id} className="font-semibold mt-3">
            {field.label}
          </Label>
          {field.tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-primary">?</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{field.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      <InputRenderer field={field} disabled={disabled} className={className} />
    </div>
  );
};

const InputRenderer = ({
  field,
  disabled,
  className,
}: {
  field: DynamicFieldType;
  disabled: boolean;
  className?: string;
}) => {
  const { dict } = useDictionary();

  /** Stores the search state in case the field type is async-select */
  const [search, setSearch] = useState("");

  const {
    data: loadedOptions,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [...(field?.queryKey || []), search],
    queryFn: async () => {
      if (!field.queryKey || !field.queryFn || !field.queryField) {
        return { rows: [], rowCount: 0 };
      }

      // Combine the external filters (if provided) with the default search filter
      const defaultFilter: Filter = {
        field: field.queryField,
        operator: "contains",
        value: search,
      };
      const filters = [...(field.filters || []), defaultFilter];

      const result = await field.queryFn({
        filterQueries: [
          {
            filters,
            matchType: "all",
          },
        ],
      });

      return result || { rows: [] };
    },
    // enabled: false, // Disable automatic fetching when search changes
  });

  const debouncedLoadOptions = useMemo(() => {
    return debounce((inputValue: string, resolve: (options: Option[]) => void) => {
      // Ensure state is updated synchronously so that the query key is correct.
      flushSync(() => {
        setSearch(inputValue);
      });
      refetch().then(({ data }) => {
        const newOptions =
          data?.rows?.map((option) => (field.mapOption ? field.mapOption(option) : option)) || [];
        resolve(newOptions);
      });
    }, 300); // Adjust the delay (in milliseconds) as needed.
  }, [refetch, field.mapOption]);

  if (field.type === "text") {
    return (
      <Input
        disabled={disabled}
        id={field.id}
        name={field.id}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={field.placeholder}
        className={clsx(
          "mb-2 p-1 px-0 placeholder:text-sm",
          field.error && "border-destructive",
          className,
        )}
      />
    );
  }

  if (field.type === "color") {
    return (
      <Input
        disabled={disabled}
        id={field.id}
        name={field.id}
        type="color"
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={field.placeholder}
        className="mb-2 w-8 p-1 place-self-start"
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <Textarea
        disabled={disabled}
        id={field.id}
        name={field.id}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={field.placeholder}
        className="mb-2 p-1 placeholder:text-sm"
      />
    );
  }

  if (field.type === "select") {
    return (
      <Select
        name={field.id}
        value={field.value}
        onValueChange={field.onChange}
        disabled={disabled}
      >
        <SelectTrigger className="px-0 font-light">
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field?.options ? (
            field.options.map((option: any, index: number) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <TypographyMutedSmall className="px-2">{dict?.Shared?.NoResults}</TypographyMutedSmall>
          )}
        </SelectContent>
      </Select>
    );
  }

  // TODO: Add disabled
  if (field.type === "async-select") {
    return (
      <AsyncSelect
        id={field.id}
        name={field.id}
        isDisabled={disabled}
        cacheOptions={false}
        value={field.value}
        placeholder={field.placeholder}
        onChange={field.onChange}
        onBlur={field.onBlur}
        isMulti={field.isMulti}
        isLoading={isFetching}
        closeMenuOnSelect={true}
        hideSelectedOptions={false}
        defaultOptions={
          loadedOptions?.rows?.map((option: any) =>
            field.mapOption ? field.mapOption(option) : option,
          ) || []
        }
        isClearable={true}
        loadOptions={(inputValue) =>
          new Promise((resolve) => {
            debouncedLoadOptions(inputValue, resolve);
          })
        }
        noOptionsMessage={() =>
          search.trim() === "" ? dict?.Shared?.StartTyping : dict?.Shared?.NoResults
        }
        {...field} // spread the field props so the components prop below can access field.actions
        components={{
          MenuList: (menuProps) => <CustomMenuList {...menuProps} actions={field.actions} />,
          DropdownIndicator: null,
          Option: (props) => <CustomOption {...props} />,
        }}
        styles={{
          menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "transparent",
            border: "none",
            shadow: "none",
            boxShadow: "none",
          }),
          control: (baseStyles, state) => ({
            ...baseStyles,
            border: "none",
            borderBottom: `1px solid ${
              state.isFocused ? "hsl(var(--primary))" : "hsl(var(--input))"
            }`,
            borderRadius: "0",
            padding: "0",
            boxShadow: "none",
            backgroundColor: "transparent",
            color: "#ffffff",
            transition: "border-color 200ms ease-in-out",
            "&:hover": {
              borderBottom: "1px solid hsl(var(--input))",
            },
          }),
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            padding: "0",
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            color: "hsl(var(--foreground))",
            padding: "0",
            fontWeight: "300",
            fontSize: "0.875rem",
          }),
          option: (baseStyles, { isSelected, isFocused }) => ({
            ...baseStyles,
            backgroundColor: isFocused ? "hsl(var(--accent))" : "transparent",
            color: isSelected ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
            borderRadius: "8px",
            padding: "6px 8px",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
            borderRadius: "24px",
            padding: "0px 6px",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "hsl(var(--foreground))",
            fontWeight: "500",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "white",
            cursor: "pointer",
            "&:hover": {
              color: "hsl(var(--foreground))",
              backgroundColor: "transparent", // Ensures no background change
            },
          }),
          placeholder: (base) => ({
            ...base,
            fontSize: "0.875rem",
          }),
        }}
      />
    );
  }

  // if (field.type === "autocomplete") {
  //   return (
  //     <Autocomplete
  //       disabled={disabled}
  //       value={field.value}
  //       placeholder={field.placeholder}
  //       onChange={field.onChange}
  //       options={field.options || []}
  //       onSearchChange={field.onSearchChange}
  //       actions={field.actions}
  //     />
  //   );
  // }

  if (field.type === "group") {
    return (
      <div className="mb-2 w-full">
        {field.fields?.map((f) => (
          <DynamicFieldRenderer disabled={disabled} key={f.id} field={f} />
        ))}
      </div>
    );
  }

  if (field.type === "switch") {
    return (
      <Switch disabled={disabled} id={field.id} checked={field.value} onChange={field.onChange} />
    );
  }

  if (field.type === "radio") {
    return (
      <RadioGroup
        disabled={disabled}
        id={field.id}
        name={field.id}
        value={field.value}
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="flex gap-5 mb-5"
      >
        {field.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  if (field.type === "avatar") {
    return (
      <>
        <Avatar
          className={clsx("border rounded-[4px]", !disabled && "cursor-pointer")}
          style={{ width: "5rem", height: "5rem" }}
          onClick={() => {
            if (disabled) {
              return;
            }
            if (field.fileInputRef?.current) {
              field.fileInputRef.current.click();
            }
          }}
        >
          <AvatarImage
            className="rounded-none bg-transparent"
            src={field.value}
            alt={field.label}
          />
          <AvatarFallback className="bg-transparent">
            <Camera className="w-6 h-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <Input
          disabled={disabled}
          ref={field.fileInputRef}
          id={field.id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={field.onChange}
        />
      </>
    );
  }

  if (field.type === "date") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            disabled={disabled}
            className={cn(
              "w-[240px] justify-start text-left font-normal mt-1 ps-3",
              !field.value && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {field.value ? format(field.value, "PPP") : <span>{dict?.Shared?.PickADate}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
        </PopoverContent>
      </Popover>
    );
  }
};

const CustomMenuList = (props: any) => {
  return (
    <components.MenuList
      {...props}
      className="bg-popover text-popover-foreground text-sm min-h-10 max-h-96 overflow-hidden border rounded-md px-1"
    >
      {props.children}
      {props.actions?.length > 0 && (
        <div className="border-t flex flex-col gap-2 px-0 mt-1">
          {props.actions.map((action: React.ReactNode, index: number) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
    </components.MenuList>
  );
};
const CustomOption = (props: any) => {
  const { isSelected, innerRef, innerProps, data } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center justify-between px-2 py-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
    >
      {data.label}
      {isSelected && <MdCheck className="ml-2 w-4 h-4" />}
    </div>
  );
};
