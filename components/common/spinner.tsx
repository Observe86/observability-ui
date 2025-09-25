import clsx from "clsx";

interface IProps {
  className?: string;
}

export const Spinner = ({ className }: IProps) => {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary/30 border-t-primary "></div>
    </div>
  );
};
