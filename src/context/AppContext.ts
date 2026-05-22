import { createContext } from "react";
import { useUIContext } from "./hooks/useUIContext";
import { useDataContext } from "./hooks/useDataContext";

export type AppContextType = ReturnType<typeof useUIContext> &
  ReturnType<typeof useDataContext>;

export const AppContext = createContext<AppContextType | null>(null);
