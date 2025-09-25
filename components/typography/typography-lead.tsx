interface IProps {
  children: React.ReactNode;
}

export function TypographyLead({ children }: IProps) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}
