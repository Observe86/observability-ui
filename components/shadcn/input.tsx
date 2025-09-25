import * as React from "react";

import { cn } from "@/utils/shadcn";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "font-normal border-b border-muted-foreground/20 border-t-0 border-r-0 border-l-0 shadow-none rounded-none focus:outline-none focus-visible:border-b focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/60", // custom, remove if need to reset
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
