interface IProps {
  children: React.ReactNode;
}

export function TypographyH4({ children }: IProps) {
  return <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">{children}</h4>;
}
