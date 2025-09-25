import "./globals.css";

import { Urbanist } from "next/font/google";

export const metadata = {
  title: "Observe86",
};

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

interface IProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: IProps) {
  return (
    <html suppressHydrationWarning>
      <body className={`${urbanist.className}`} style={{ fontFamily: "Urbanist", fontWeight: 500 }}>
        {children}
      </body>
    </html>
  );
}
