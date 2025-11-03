import { MainContext } from "./context";
import RoutesMiddleware from "./routes/routes_midleware";

function App() {
  return (
    <MainContext.Provider value={{}}>
      <RoutesMiddleware/>
    </MainContext.Provider>
  );
}

export default App;
