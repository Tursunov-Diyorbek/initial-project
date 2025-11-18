import { useContext } from "react";
import Home1 from "../home1";
import Home2 from "../home2";
import { MainContext } from "@/context";

export default function Dashboard() {
  const { roles } = useContext(MainContext);
  const userRoles = Array.isArray(roles) ? roles : [];

  // Birinchi topilgan roleni olish
  const firstRole = userRoles.find((role) => role)?.toLocaleLowerCase();

  switch (firstRole) {
    case "student":
      return <Home1 />;
    case "superadmin":
      return <Home2 />;
    default:
      return <div>Not Found</div>;
  }
}

