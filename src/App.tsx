import { useEffect, useState } from "react";
import { MainContext } from "./context";
import RoutesMiddleware from "./routes/routes_midleware";
import { useAppDispatch, useAppSelector } from "./store";
import SignIn from "./store/auth/service";

function App() {
  const [roles, setRoles] = useState<string[]>([]);
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (token && !isAuth) {
        const res = await dispatch(SignIn({ data: null, type: "me" }));

        if ([200, 201].includes(res?.payload?.response_code)) {
          setRoles(res?.payload?.data?.user?.roles);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <MainContext.Provider value={{ roles }}>
      <RoutesMiddleware />
    </MainContext.Provider>
  );
}

export default App;
