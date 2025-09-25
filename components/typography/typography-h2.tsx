interface IProps {
  children: React.ReactNode;
}

export function TypographyH2({ children }: IProps) {
  return (
    <h2 className="scroll-m-20 pb-2 text-2xl font-normal tracking-tight first:mt-0">{children}</h2>
  );
}
