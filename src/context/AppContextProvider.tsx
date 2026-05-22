import { AppContext } from "./AppContext";
import { useUIContext } from "./hooks/useUIContext";
import { useDataContext } from "./hooks/useDataContext";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ui = useUIContext();
  const data = useDataContext();

  return (
    <AppContext.Provider value={{ ...ui, ...data }}>
      {children}
    </AppContext.Provider>
  );
};
