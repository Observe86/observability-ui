"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";

interface DateTimePickerProps {
  label: string;
  name: string;
  value: Date | undefined;
  onChange: (date: Date) => void;
  error?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  name,
  value,
  onChange,
  error,
}) => {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(value ? value.toTimeString().slice(0, 8) : "12:00:00");

  React.useEffect(() => {
    if (value) {
      setTime(value.toTimeString().slice(0, 8));
    }
  }, [value]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value;
    setTime(timeStr);

    if (value) {
      const [h, m, s] = timeStr.split(":").map(Number);
      const newDate = new Date(value);
      newDate.setHours(h);
      newDate.setMinutes(m);
      newDate.setSeconds(s);
      onChange(newDate);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-40 justify-between px-0 font-normal border-b border-muted-foreground/20 border-t-0 border-r-0 border-l-0 shadow-none rounded-none focus:outline-none focus-visible:border-b focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/60"
            >
              {value ? value.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                const newDate = new Date(date);
                const [h, m, s] = time.split(":").map(Number);
                newDate.setHours(h);
                newDate.setMinutes(m);
                newDate.setSeconds(s);
                onChange(newDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          step="1"
          value={time}
          onChange={handleTimeChange}
          className="w-[120px] px-0"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
