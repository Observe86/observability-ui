import clsx from "clsx";

import { TypographyH1 } from "../typography/typography-h1";
import { TypographyMuted } from "../typography/typography-muted";

interface IProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actionButtons?: Array<React.ReactNode>;
  children?: React.ReactNode;
}

export const PageWrapper = ({ title, description, actionButtons, children }: IProps) => {
  return (
    <div className="space-y-5">
      <div className="space-y-0.5">
        <TypographyH1 className={clsx(!description && "pb-0")}>{title}</TypographyH1>
        {description && <TypographyMuted>{description}</TypographyMuted>}
      </div>

      {actionButtons && actionButtons.length > 0 && (
        <div className="flex gap-2">{actionButtons}</div>
      )}

      {children}
    </div>
  );
};
