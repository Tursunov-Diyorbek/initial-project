import { Route, Routes, Navigate } from "react-router-dom";
import { protected_routes } from "./routes";
import { Layout } from "../components";
import type { AppRoute } from "@/types";

const RenderComponent = (route: AppRoute) => {
  const Component = route.component;
  const structure = route.config?.structure;

  if (structure === "layout") {
    return (
      <Layout>
        <Component />
      </Layout>
    );
  }

  return <Component />;
};

const RoutesMiddleware = () => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  const renderRoute = (route: AppRoute) => {
    const isAllowed =
      route.config?.permission === "unlock" ||
      route.config?.isRole?.includes(role ?? "");

    if (!isAllowed) return null;

    return (
      <Route
        key={route.path}
        path={route.path}
        element={RenderComponent(route)}
      />
    );
  };

  return (
    <Routes>
      {/* Agar login qilgan bo‘lsa */}
      {token
        ? protected_routes
            .filter((r) => r.config?.structure !== "nonlayout") // layout sahifalar
            .map(renderRoute)
        : protected_routes
            .filter((r) => r.config?.structure === "nonlayout") // login, register va boshqalar
            .map(renderRoute)}

      {/* Default redirect */}
      {!token && <Route path="*" element={<Navigate to="/login" replace />} />}
      {token && <Route path="*" element={<h1>NOT FOUND</h1>} />}
    </Routes>
  );
};

export default RoutesMiddleware;
