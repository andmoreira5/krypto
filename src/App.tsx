import "./App.css";
import { AppContextProvider } from "./context/AppContextProvider";
import { HomeCoinPage } from "./pages/HomeCoinPage";

function App() {
  return (
    <AppContextProvider>
      <HomeCoinPage />
    </AppContextProvider>
  );
}

export default App;
