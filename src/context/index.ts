import type { MainContextTypes } from "@/types";
import { createContext } from "react";

export const MainContext = createContext<MainContextTypes>(
  {} as MainContextTypes
);
