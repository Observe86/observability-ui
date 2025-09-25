interface IProps {
  children: React.ReactNode;
}

export function TypographyH3({ children }: IProps) {
  return <h3 className="scroll-m-20 text-xl font-medium tracking-tight">{children}</h3>;
}
