import type { AppRoute } from "@/types";
import { Role1, Role2 } from "../pages";
import Login from "@/pages/auth/login";
import Dashboard from "@/pages/dashboard";

export const protected_routes: AppRoute[] = [
   {
    name: "Login",
    path: "/login",
    component: Login,
    config: {
      permission: "unlock",
      structure: "nonlayout",
      isMenu: false,
    },
  },
  {
    name: "Asosiy sahifa",
    path: "/",
    component: Dashboard,
    config: {
      permission: "unlock",
      icon: [],
      structure: "layout",
      isMenu: true,
    },
  },
  {
    name: "Role 1",
    path: "/role1",
    component: Role1,
    config: {
      permission: "unlock",
      icon: [],
      structure: "layout",
      isMenu: true,
      isRole: ["superadmin"],
    },
  },
  {
    name: "Role 2",
    path: "/role2",
    component: Role2,
    config: {
      permission: "user_view",
      icon: [],
      structure: "layout",
      isMenu: true,
      isRole: ["2"],
    },
  }
];
