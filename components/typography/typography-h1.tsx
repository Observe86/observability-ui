import clsx from "clsx";

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export function TypographyH1({ children, className }: IProps) {
  return (
    <h1
      className={clsx("scroll-m-20 pb-2 text-3xl font-medium tracking-tight first:mt-0", className)}
    >
      {children}
    </h1>
  );
}
