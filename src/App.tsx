import { useEffect } from "react";
import { MainContext } from "./context";
import RoutesMiddleware from "./routes/routes_midleware";
import { useAppDispatch, useAppSelector } from "./store";
import SignIn from "./store/auth/service";

function App() {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const roles = useAppSelector((state) => state.auth.roles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token && !isAuth) {
        await dispatch(SignIn({ data: null, type: "me" }));
      }
    };
    checkAuth();
  }, [isAuth, dispatch]);

  return (
    <MainContext.Provider value={{ roles }}>
      <RoutesMiddleware />
    </MainContext.Provider>
  );
}

export default App;
