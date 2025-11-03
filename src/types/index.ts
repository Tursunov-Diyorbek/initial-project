import type { ComponentType, ReactNode } from "react";

export type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export type Language = {
  uz: string;
  ru: string;
  kr: string;
  en: string;
};

export interface HeaderSidebarContentProps {
  collapsed?: boolean;
  toggleCollapsed?: () => void;
  children?: React.ReactNode;
  noLayout?: string;
}

export interface MainContextTypes {}


export type PermissionType = "unlock" | "lock" | "user_view";

export interface AppRoute {
  name: string;
  path: string;
  component: ComponentType;
  config?: {
    permission?: PermissionType;
    icon?: ReactNode;
    structure?: "layout" | "nonlayout";
    isMenu?: boolean;
    isRole?: string[];
  };
  submenu?: AppRoute[];
}