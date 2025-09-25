interface IProps {
  children: React.ReactNode;
}

export function TypographyMuted({ children }: IProps) {
  return <p className="text-muted-foreground">{children}</p>;
}
