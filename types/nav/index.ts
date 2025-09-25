import { JSX } from "react";

export interface NavItem {
  title: string;
  description: string;
  icon: JSX.Element;
  href: string;
}
