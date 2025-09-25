interface IProps {
  children: React.ReactNode;
}

export function TypographyP({ children }: IProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}
