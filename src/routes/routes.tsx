import type { AppRoute } from "@/types";
import { Home1, Home2, Role1, Role2 } from "../pages";
import Login from "@/pages/auth/login";

export const protected_routes: AppRoute[] = [
  {
    name: "Main page",
    path: "/",
    component: Home1,
    config: {
      permission: "unlock",
      icon: [],
      structure: "layout",
      isMenu: true,
      isRole: ["1"],
    },
  },
  {
    name: "Books",
    path: "/books",
    component: Home2,
    config: {
      permission: "unlock",
      icon: [],
      structure: "layout",
      isMenu: true,
      isRole: ["1"],
    },
  },
  {
    name: "Users",
    path: "/user",
    component: Home1,
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
      isRole: ["2"],
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
  },
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
];
