interface IProps {
  children: React.ReactNode;
}

export function TypographySmall({ children }: IProps) {
  return <small className="text-sm font-medium leading-none">{children}</small>;
}
