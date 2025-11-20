import { Layout, Menu } from "antd";
import { protected_routes } from "../../../routes/routes";
import { Link, useLocation } from "react-router-dom";
import type { MenuItemType } from "antd/es/menu/interface";
import { useContext } from "react";
import { MainContext } from "@/context";

const { Sider } = Layout;

export default function Sidebar({ burger }: any) {
  const { roles } = useContext(MainContext);
  const location = useLocation();

  const items = () => {
    const _items: MenuItemType[] = [];
    protected_routes?.forEach((e) => {
      if (
        e.config?.isMenu &&
        e.config.permission === "unlock" &&
        e.config.structure === "layout" &&
        ((e.config.isRole && e.config.isRole?.some((role: string) => roles.includes(role))) ||
          !e.config.isRole)
      ) {
        _items.push({
          key: e.path,
          icon: e.config.icon ?? undefined,
          label: <Link to={e.path}>{e.name}</Link>,
        });
      }
    });

    return _items;
  };

  return (
    <Sider trigger={null} collapsible collapsed={burger} className="h-screen">
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items()}
      />
    </Sider>
  );
}
