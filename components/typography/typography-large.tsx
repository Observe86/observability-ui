interface IProps {
  children: React.ReactNode;
}

export function TypographyLarge({ children }: IProps) {
  return <div className="text-lg font-semibold">{children}</div>;
}
