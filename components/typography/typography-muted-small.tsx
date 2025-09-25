import clsx from "clsx";

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export function TypographyMutedSmall({ children, className }: IProps) {
  return <p className={clsx("text-sm text-muted-foreground", className)}>{children}</p>;
}
